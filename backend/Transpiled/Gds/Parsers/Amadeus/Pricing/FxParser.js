
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const FareConstructionParser = require('../../../../Gds/Parsers/Common/FareConstruction/FareConstructionParser.js');
const BagAllowanceParser = require('../../../../Gds/Parsers/Sabre/BagAllowanceParser.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');

/**
 * parses output of FX{modifiers} command which contains pricing with fare
 * calculation if there is just one PTC or just a ptc list if there are many
 */
class FxParser {
	static parseSequence($linesLeft, $parse) {
		$linesLeft = [...$linesLeft];
		let $parsedLines, $line, $parsedLine;

		$parsedLines = [];
		while (!php.is_null($line = php.array_shift($linesLeft))) {
			if ($parsedLine = $parse($line)) {
				$parsedLines.push($parsedLine);
			} else {
				php.array_unshift($linesLeft, $line);
				break;
			}
		}
		return [$parsedLines, $linesLeft];
	}

	/**
	 * this wrapper does not require $names
	 * handy if you do postprocessing
	 */
	static splitByPositionLetters($line, $pattern) {
		let $symbols, $names;

		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);

		return StringUtil.splitByPosition($line, $pattern, $names, true);
	}

	static isEmptyLine($line) {

		return php.trim($line) === '';
	}

	static parseSegmentLine($line) {
		let $flightSegment, $matches;

		if ($flightSegment = this.parseFlightSegment($line)) {
			return $flightSegment;
		} else if (php.preg_match(/^\s*([A-Z]{3})\s+S U R F A C E\s*$/, $line, $matches = [])) {
			// ' YAO      S U R F A C E',
			return {'type': 'surface', 'destinationCity': $matches[1], 'isStopover': true};
		} else {
			return null;
		}
	}

	static parseFlightSegment($line) {
		let $pattern, $split, $date, $time, $nvbDate, $nvaDate, $isEmptyString, $fareBasis, $ticketDesignator, $result;

		//         '     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
		//         'XDTT DL   462 B *  23OCT 0910  BNE0WRMD                   2P',
		//         ' ADD ET   501 H *  20NOV 1030  HLOWUS                     2P',
		//         ' RIX SU  2682 Y    10DEC 0925  YVO             10DEC10DEC 1P',
		//         "XTPE BR    31 C  C 10DEC 0020  COU             10DEC10DEC 2P",
		$pattern = 'XAAA CC  FFFF L *_ WWWWW TTTT  IIIIIIIIIIIIIIIIOOOOOEEEEEBBB';
		$split = this.splitByPositionLetters($line, $pattern);

		$date = CommonParserHelpers.parsePartialDate($split['W']);
		$time = CommonParserHelpers.decodeApolloTime($split['T']);
		$nvbDate = CommonParserHelpers.parsePartialDate($split['O']);
		$nvaDate = CommonParserHelpers.parsePartialDate($split['E']);

		$isEmptyString = ($val) => $val === '';
		[$fareBasis, $ticketDesignator] = php.array_pad(php.explode('/', $split['I']), 2, null);
		$result = {
			'type': 'flight',
			'isStopover': $split['X'] !== 'X',
			'destinationCity': $split['A'],
			'airline': $split['C'],
			'flightNumber': $split['F'],
			'bookingClass': $split['L'],
			'rebookRequired': $split['*'] === '*',
			'destinationDate': {'raw': $split['W'], 'parsed': $date},
			'destinationTime': {'raw': $split['T'], 'parsed': $time},
			'fareBasis': $fareBasis,
			'ticketDesignator': $ticketDesignator,
			'notValidBefore': $nvbDate ? {'raw': $split['O'], 'parsed': $nvbDate} : null,
			'notValidAfter': $nvaDate ? {'raw': $split['E'], 'parsed': $nvaDate} : null,
			'freeBaggageAmount': BagAllowanceParser.parseAmountCode($split['B']),
		};
		if ($date && $time && php.trim($split[' ']) === '' &&
			$result['bookingClass'] && !Fp.any($isEmptyString, $result)
		) {
			return $result;
		} else {
			return null;
		}
	}

	static splitValueAndFcLine($line) {
		let $pattern, $symbols, $names, $split, $fcLine, $value;

		//         'USD   633.00      20NOV17WAS ET ADD424.00HLOWUS ET NBO209.00',
		//         '                  UOWET NUC633.00END ROE1.000000',
		//         'USD     8.62YQ    XT USD 18.00US USD 5.60AY USD 4.50XF IAD',
		//         'USD   262.00YR    4.50',
		//         'USD   120.29-YQ   XT USD 10.61-MD USD 7.31-WW USD 6.72-RI',
		//         'USD    28.10XT',
		//         'USD   931.72',
		$pattern = 'CCCAAAAAAAAATTT   FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
		$symbols = php.str_split($pattern, 1);
		$names = php.array_combine($symbols, $symbols);
		$split = StringUtil.splitByPosition($line, $pattern, $names, false);
		if (php.trim($split[' ']) === '') {
			$fcLine = $split['F'];
			if (php.trim($split['C'] + $split['A'] + $split['T']) === '') {
				return [null, $fcLine];
			} else {
				$value = {
					'currency': $split['C'],
					'amount': php.trim($split['A']),
					'taxCode': php.trim($split['T'], ' -') || null,
				};
				if (php.preg_match(/^[A-Z]{3}$/, $value['currency']) &&
					php.preg_match(/^\d*\.?\d+$/, $value['amount'])
				) {
					return [$value, $fcLine];
				}
			}
		}
		return null;
	}

	/**
	 * @param $segments = [FxParser::parseSegmentLine(), ...]
	 * Amadeus wraps FC line on a digit followed by a letter or vice versa
	 * it's ok with everything except fare basis, which is alphanumeric
	 * so we use the known fare basis list to unwrap line correctly
	 */
	static unwrapFcLine($lines, $segments) {
		let $fareBases, $airlines, $segment, $air, $fb, $td, $fullLine, $line, $nextStartsWith, $endsWith,
			$wrappedOnLetter, $wrappedOnDigit;

		$fareBases = [];
		$airlines = [];
		for ($segment of Object.values($segments)) {
			if ($air = $segment['airline']) {
				$airlines.push($air);
			}
			if ($fb = $segment['fareBasis']) {
				if ($td = $segment['ticketDesignator']) {
					$fb += '/' + $td;
				}
				$fareBases.push($fb);
			}
		}
		$fullLine = php.array_shift($lines);
		for ($line of Object.values($lines)) {
			$nextStartsWith = ($airline) => StringUtil.startsWith($line, $airline + ' ');
			$endsWith = ($fb) => StringUtil.endsWith($fullLine, $fb);
			$wrappedOnLetter = php.preg_match(/[A-Z]$/, $fullLine) && php.preg_match(/^[A-Z]/, $line);
			$wrappedOnDigit = php.preg_match(/\d$/, $fullLine) && php.preg_match(/^\d/, $line);
			if (Fp.any($endsWith, $fareBases) || $wrappedOnLetter || $wrappedOnDigit ||
				Fp.any($endsWith, $airlines) || Fp.any($nextStartsWith, $airlines)
			) {
				$fullLine += ' ' + $line;
			} else {
				$fullLine += $line;
			}
		}
		return $fullLine;
	}

	static parseFareConstruction($raw) {
		let $matches, $_, $dateRaw, $fcRaw, $fcRecord;

		if (php.preg_match(/^(\d{1,2}[A-Z]{3}\d{2,4})(.+)$/s, $raw, $matches = [])) {
			[$_, $dateRaw, $fcRaw] = $matches;
			$fcRecord = FareConstructionParser.parse($fcRaw);
			$fcRecord['raw'] = $raw;
			if ($fcRecord['parsed']) {
				$fcRecord['parsed']['date'] = {
					'raw': $dateRaw,
					'parsed': '20' + CommonParserHelpers.parseApolloFullDate($dateRaw),
				};
			}
			return $fcRecord;
		} else {
			return {'error': 'Failed to match FC start - ' + php.substr($raw, 0, 7)};
		}
	}

	// separates XT taxes part from fare calculation
	static parseTaxBreakdown($fcLine) {
		let $xtTaxes, $facilityCharges, $matches, $_, $xtTaxesRaw, $facilityChargesRaw, $tuples, $airport, $amount,
			$taxRegex, $taxCurrency, $taxCode, $taxBreakdown;

		$xtTaxes = [];
		$facilityCharges = [];
		if (php.preg_match(/^(.+)XT\s+(.+?)(([A-Z]{3}\s*\d*\.?\d+\s*)*)$/, $fcLine, $matches = [])) {
			[$_, $fcLine, $xtTaxesRaw, $facilityChargesRaw] = $matches;
			if (php.preg_match_all(/([A-Z]{3})\s*(\d*\.?\d+)\s*/, $facilityChargesRaw, $tuples = [], php.PREG_SET_ORDER)) {
				for ([$_, $airport, $amount] of Object.values($tuples)) {
					$facilityCharges.push({'airport': $airport, 'amount': $amount});
				}
			}
			$taxRegex = /([A-Z]{3})\s*(\d*\.?\d+)[\s\-]*([A-Z0-9]{2})/;
			if (php.preg_match_all($taxRegex, $xtTaxesRaw, $tuples = [], php.PREG_SET_ORDER)) {
				for ([$_, $taxCurrency, $amount, $taxCode] of Object.values($tuples)) {
					$xtTaxes.push({'currency': $taxCurrency, 'amount': $amount, 'taxCode': $taxCode});
				}
			}
		}
		$taxBreakdown = {
			'xtTaxes': $xtTaxes,
			'facilityCharges': $facilityCharges,
		};
		return [$fcLine, $taxBreakdown];
	}

	static parseWholeMessages($lines, $appliesTo) {
		let $result, $lastDateToPurchase, $line, $matches, $_, $dateRaw, $unparsed;

		$result = {'appliesTo': $appliesTo};
		$lastDateToPurchase = null;
		for ($line of Object.values($lines)) {
			if (php.trim($line) === 'REBOOK TO CHANGE BOOKING CLASS AS SPECIFIED') {
				$result['rebookStatus'] = 'required';
			} else if (php.trim($line) === 'NO REBOOKING REQUIRED FOR LOWEST AVAILABLE FARE') {
				$result['rebookStatus'] = 'notRequired';
			} else if (php.preg_match(/^LAST TKT DTE (\d{1,2}[A-Z]{3}\d{2})\s*(.*?)\s*$/, $line, $matches = [])) {
				[$_, $dateRaw, $unparsed] = $matches;
				$result['lastDateToPurchase'] = {
					'raw': $dateRaw,
					'parsed': '20' + CommonParserHelpers.parseApolloFullDate($dateRaw),
					'unparsed': $unparsed,
				};
			} else {
				$result['unparsed'] = $result['unparsed'] || [];
				$result['unparsed'].push($line);
			}
		}
		return $result;
	}

	// >HELP FCPI; >MS379;
	// same code as in TQT
	static parseTstIndicator($code) {
		let $parsed;

		$parsed = ({
			'I': 'IATA_AUTOPRICED_FARE',
			'B': 'NEGOTIATED_FARE',
			'A': 'ATAF_AUTOPRICED_FARE',
			'F': 'NEGOTIATED_AUTOPRICED_FARE_UPDATED_BY_AN_AIRLINE',
			'G': 'NEGOTIATED_FARE_UPDATED_BY_AN_AGENT_OR_CONSOLIDATOR',
			'M': 'MANUAL_PRICED_FARE',
			'T': 'AUTOPRICED_INCLUSIVE_TOUR_FARE',
			'W': 'NO_FARE_CALC_CHECK_AGAINST_TST_ITINERARY',
			'O': 'CABIN_CLASS_OVERRIDE_USED_IN_PRICING',
		} || {})[$code];
		return {'raw': $code, 'parsed': $parsed};
	}

	static parsePtcPricingMessages($lines) {
		let $result, $line, $matches, $_, $cat, $nego, $tstIndicator;

		$result = [];
		for ($line of Object.values($lines)) {
			if (php.preg_match(/^BG CXR: (\d+\*|)([A-Z0-9]{2})/, $line, $matches = [])) {
				$result['bgCarrier'] = $matches[2];
			} else if (php.preg_match(/^PRICED WITH VALIDATING CARRIER ([A-Z0-9]{2})/, $line, $matches = [])) {
				$result['validatingCarrier'] = $matches[1];
			} else if (php.preg_match(/^PRICED VC ([A-Z0-9]{2}) - OTHER VC AVAILABLE ([A-Z0-9]{2})/, $line, $matches = [])) {
				$result['validatingCarrier'] = $matches[1];
				$result['otherVcAvailable'] = $matches[2];
			} else if (php.preg_match(/^ENDOS (.+?)$/, $line, $matches = [])) {
				$result['endorsementLines'] = $result['endorsementLines'] || [];
				$result['endorsementLines'].push($matches[1]);
			} else if (php.preg_match(/^\s*TICKET STOCK RESTRICTION\s*$/, $line)) {
				$result['hasTicketStockRestriction'] = true;
			} else if (php.preg_match(/^\s*(CAT35|.*)\s*(NEGOTIATED FARES|PRIVATE RATES USED)\s*\*?([A-Z]|)\*?\s*$/, $line, $matches = [])) {
				[$_, $cat, $nego, $tstIndicator] = $matches;
				$result['negotiatedFareCategory'] = $cat;
				$result['hasNegotiatedFaresMessage'] = true;
				$result['tstIndicator'] = null;
				$result['tstIndicator'] = !$tstIndicator ? null :
					this.parseTstIndicator($tstIndicator);
			} else {
				$result['unparsed'] = $result['unparsed'] || [];
				$result['unparsed'].push($line);
			}
		}
		return $result;
	}

	// first lines like:
	// ' NYC',
	// ' TAS HY   102 K *  06JUL 1500  KHE6M           06JUL06JUL 2P',
	static parsePtcPricing($lines) {
		let $departureCity, $segments, $emptyLines, $fcSplit, $fcSplit2, $values, $fcLines, $baseFare, $fareEquivalent,
			$netPrice, $mainTaxes, $fcLine, $taxBreakdown;

		$departureCity = php.trim(php.array_shift($lines));
		[$segments, $lines] = this.parseSequence($lines, (...args) => this.parseSegmentLine(...args));
		if ($segments.length === 0) {
			return {error: 'Failed to parse FX segment line - ' + $lines[0]};
		}
		[$emptyLines, $lines] = this.parseSequence($lines, (...args) => this.isEmptyLine(...args));

		[$fcSplit, $lines] = this.parseSequence($lines, (...args) => this.splitValueAndFcLine(...args));
		[$emptyLines, $lines] = this.parseSequence($lines, (...args) => this.isEmptyLine(...args)); // infant
		[$fcSplit2, $lines] = this.parseSequence($lines, (...args) => this.splitValueAndFcLine(...args));
		$fcSplit = php.array_merge($fcSplit, $fcSplit2);

		$values = php.array_column($fcSplit, 0);
		$fcLines = php.array_column($fcSplit, 1);

		$baseFare = php.array_shift($values);
		$fareEquivalent = php.array_shift($values);
		$values = php.array_values(php.array_filter($values));
		$netPrice = php.array_pop($values);
		$mainTaxes = $values;

		$fcLine = this.unwrapFcLine($fcLines, $segments);
		[$fcLine, $taxBreakdown] = this.parseTaxBreakdown($fcLine);

		return {
			'departureCity': $departureCity,
			'segments': $segments,
			'baseFare': $baseFare,
			'fareEquivalent': $fareEquivalent,
			'fareConstruction': this.parseFareConstruction($fcLine),
			'mainTaxes': $mainTaxes,
			'xtTaxes': $taxBreakdown['xtTaxes'],
			'facilityCharges': $taxBreakdown['facilityCharges'],
			'netPrice': $netPrice,
			'additionalInfo': this.parsePtcPricingMessages($lines),
		};
	}

	/** @param $query = '1' || '' || '1,3-4' */
	static parseCmdPaxNums($query) {
		let $parseRange;

		if (php.preg_match(/^\s*(\d[\d,-]*)\s*$/, $query)) {
			$parseRange = ($text) => {
				let $pair;

				$pair = php.explode('-', $text);
				return php.range($pair[0], $pair[1] || $pair[0]);
			};
			return Fp.flatten(Fp.map($parseRange, php.explode(',', php.trim($query))));
		} else {
			return null;
		}
	}

	static parsePassengerLine($line) {
		let $pattern, $split, $lname, $fname, $cmdPaxNumsRaw, $infMark, $result, $cmdPaxNums;

		//         '   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
		//         '02 SMITH/JANNI*      ADT     1     980.00  623.50    1603.50',
		//         '04 LIBERMANE/ZIMICH  CNN     1     361.00   67.11     428.11',
		//         '02 LIBERMANE/LONGL*  CNN     1     359.00   66.77     425.77',
		//         '02 LONGLONGL*/LONGL* CNN     1     359.00   66.77     425.77',
		//         '01 1,3-4             ADT     3     742.00   82.73     824.73',
		//         '03 3 INF             INF     1      15.00    0.00      15.00',
		//         "03 WALTERS/PATRI*    IN      1       3086    8974      12060",
		//         '                   TOTALS    5    2239.00  268.44    2507.44','
		$pattern = 'NN FFFFFFFFFFFFFFFFF.PPP.   QQ BBBBBBBBBB TTTTTTT CCCCCCCCCC';
		$split = this.splitByPositionLetters($line, $pattern);

		$lname = php.explode('/', $split['F'])[0];
		$fname = (php.explode('/', $split['F']) || {})[1];
		$cmdPaxNumsRaw = php.explode(' ', $split['F'])[0];
		$infMark = (php.explode(' ', $split['F']) || {})[1];
		$result = {
			'lineNumber': $split['N'],
			'ptc': $split['P'],
			'quantity': $split['Q'],
			'baseFare': $split['B'],
			'taxAmount': $split['T'] || null,
			'netPrice': $split['C'],
		};
		if (!php.empty($cmdPaxNums = this.parseCmdPaxNums($cmdPaxNumsRaw))) {
			$result['hasName'] = false;
			$result['cmdPaxNums'] = $cmdPaxNums;
			$result['isInfantCapture'] = $infMark === 'INF';
		} else {
			$result['hasName'] = true;
			$result['lastName'] = php.rtrim($lname, '*');
			$result['lastNameTruncated'] = php.rtrim($lname, '*') !== $lname;
			$result['firstName'] = php.rtrim($fname, '*');
			$result['firstNameTruncated'] = php.rtrim($fname, '*') !== $fname;
		}
		if (php.trim($split[' ']) === '' &&
			php.preg_match(/^[A-Z0-9]{2,3}$/, $result['ptc']) &&
			php.preg_match(/^\d*\.?\d+$/, $result['baseFare']) &&
			php.preg_match(/^\d*\.?\d+$/, $result['netPrice'])
		) {
			return $result;
		} else {
			return null;
		}
	}

	// first line like:
	// '01 LIBERMANE/LEPIN   CNN     1     361.00   67.11     428.11'
	static parsePtcList($lines) {
		let $passengers, $emptyLines, $totals;

		[$passengers, $lines] = this.parseSequence($lines, (...args) => this.parsePassengerLine(...args));
		[$emptyLines, $lines] = this.parseSequence($lines, (...args) => this.isEmptyLine(...args));
		$totals = this.parsePassengerLine(php.array_shift($lines));
		if (!$totals) {
			throw new Error('Failed to parse FXX TOTALS line - ' + $lines[0]);
		}
		[$emptyLines, $lines] = this.parseSequence($lines, (...args) => this.isEmptyLine(...args));
		return {
			'passengers': $passengers,
			'totalPassengers': $totals['quantity'],
			'totalBaseFare': $totals['baseFare'],
			'totalTaxAmount': $totals['taxAmount'],
			'totalNetPrice': $totals['netPrice'],
			'additionalInfo': {
				'unparsed': $lines,
			},
		};
	}

	static parse($dump) {
		let $lines, $commandCopy, $wholeMessages, $type, $data, $i, $line, $matches, $pricingBlock, $ptcListBlock;

		$lines = StringUtil.lines($dump);
		$commandCopy = php.trim(php.array_shift($lines));
		$wholeMessages = [];
		$type = null;
		$data = null;
		for ($i = 0; $i < php.count($lines); ++$i) {
			$line = $lines[$i];
			if (php.trim($line) !== '') {
				if (php.preg_match(/^\s*-{3,}(.*?)-{3,}\s*$/, $line, $matches = [])) {
					$type = 'ptcPricing';
					$pricingBlock = php.array_splice($lines, $i + 2);
					$data = this.parsePtcPricing($pricingBlock);
					$data['privateFareHeader'] = $matches[1];
				} else if (php.preg_match(/PASSENGER.*PTC.*NP.*FARE\s+([A-Z]{3})/, $line, $matches = [])) {
					$type = 'ptcList';
					$ptcListBlock = php.array_splice($lines, $i + 1);
					$data = this.parsePtcList($ptcListBlock);
					$data['currency'] = $matches[1];
				} else {
					$wholeMessages.push(php.trim($line));
				}
			}
		}

		if ($type !== null) {
			return {
				'commandCopy': $commandCopy,
				'wholeMessages': this.parseWholeMessages($wholeMessages),
				'type': $type,
				'data': $data,
				'error': $data.error || undefined,
			};
		} else {
			return {'error': 'Failed to parse PTC list/pricing'};
		}
	}
}

module.exports = FxParser;
