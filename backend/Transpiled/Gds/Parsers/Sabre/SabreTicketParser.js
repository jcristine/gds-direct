
// namespace Gds\Parsers\Sabre;

const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const FareConstructionParser = require('../../../Gds/Parsers/Common/FareConstruction/FareConstructionParser.js');
const ItineraryParser = require('../../../Gds/Parsers/Sabre/Pnr/ItineraryParser.js');

/**
 * parses output of >WETR*2 (where 2 is an index of ticket in >*T output)
 */
const php = require('../../../phpDeprecated.js');
class SabreTicketParser
{
	static removeIndexKeys($dict)  {

		return php.array_intersect_key($dict, php.array_flip(Fp.filter('is_string', php.array_keys($dict))));
	}

	static detectErrorResponse($dump)  {
		let $errorType, $error;

		if (php.preg_match(/^DISPLAY ENTRY MUST BE MADE BY PSEUDO CITY OF ORIGINAL.*$/, $dump)) {
			$errorType = 'no_agreement_exists';
		} else if (php.preg_match(/^TICKET\/DOCUMENT NOT FOUND IN AIRLINE DATABASE/, $dump)) {
			$errorType = 'ticket_not_found';
		} else if (!php.preg_match(/^\d+ELECTRONIC TICKET RECORD/, $dump)) {
			$errorType = null; // unexpected error response
		} else {
			return null;
		}
		$error = $errorType
			? 'GDS returned error of type '+$errorType
			: 'Unexpected start of dump - '+php.trim($dump);
		return {'error': $error, 'errorType': $errorType};
	}

	/** @param $line = '0557931853228   06JAN17FLL' */
	static parseOriginalIssue($line)  {
		let $regex, $matches;

		$regex =
			'/^\\s*'+
			'(?<airlineNumber>\\d{3})\\s*'+
			'(?<documentNumber>\\d{10})\\s*'+
			'(?<date>\\d{2}[A-Z]{3}\\d{2})'+
			'(?<location>[A-Z]{3})'+
			'\\s*$/';
		if (php.preg_match($regex, $line, $matches = [])) {
			return {
				'airlineNumber': $matches['airlineNumber'],
				'documentNumber': $matches['documentNumber'],
				'date': CommonParserHelpers.parseCurrentCenturyFullDate($matches['date']),
				'location': $matches['location'],
			};
		} else {
			return null;
		}
	}

	/** @param $line = '0557931853228-29 134/1' */
	static parseExchangedFor($line)  {
		let $matches, $_, $airlineNumber, $documentNumber;

		if (php.preg_match(/^\s*(\d{3})(\d{10})/, $line, $matches = [])) {
			[$_, $airlineNumber, $documentNumber] = $matches;
			return {
				'airlineNumber': $airlineNumber,
				'documentNumber': $documentNumber,
			};
		} else {
			return null;
		}
	}

	// 'ORIGINAL ISSUE: 0557931853228   06JAN17FLL                     ',
	// 'ORIGINAL FOP:  CHECK                                           ',
	// 'EXCHANGE TKT: 0557931853228-29 134/1                           ',
	static parseExtraFields($lines)  {
		let $labelToValue, $line, $matches, $_, $label, $value, $extraFields;

		$labelToValue = [];
		while ($line = php.array_shift($lines)) {
			if (php.preg_match(/^\s*([A-Z0-9 ]+?)\s*:\s*(.*?)\s*$/, $line, $matches = [])) {
				[$_, $label, $value] = $matches;
				$labelToValue[$label] = $value;
			} else {
				php.array_unshift($lines, $line);
				break;
			}
		}
		$extraFields = {
			'originalIssue': this.parseOriginalIssue($labelToValue['ORIGINAL ISSUE'] || ''),
			'originalFop': !php.isset($labelToValue['ORIGINAL FOP']) ? null :
				{'raw': $labelToValue['ORIGINAL FOP']},
			'exchangedFor': this.parseExchangedFor($labelToValue['EXCHANGE TKT'] || ''),
		};
		return [$extraFields, $lines];
	}

	static parseFareConstruction($lines)  {
		let $fcLines, $line, $fullLine, $fcRecord, $result;

		$fcLines = [];
		while ($line = php.array_shift($lines)) {
			if (php.trim($line) === '') {
				break;
			} else {
				$fcLines.push($line);
			}
		}

		$fullLine = php.implode($fcLines);

		$fcRecord = FareConstructionParser.parse($fullLine);
		if (php.empty($fcRecord['error'])) {
			$result = $fcRecord['parsed'];
		} else {
			$result = {
				'warning': 'failed to parse fare construction',
				'line': $fullLine,
			};
		}

		return [$result, $lines];
	}

	static parseFareAndTaxes($lines)  {
		let $result, $taxPattern, $regex, $line, $matches, $allTaxesMatches, $taxMatches, $_, $amount, $taxCode;

		$result = [];

		$taxPattern = 'TAX\\s+(\\d+\\.?\\d*)([A-Z0-9]{2})\\s*';
		$regex =
			'/^'+
			'(FARE\\s+'+
				'(?<currency>[A-Z]{3})?'+
				'((?<amount>\\d+\\.?\\d*)|(?<amountIndicator>[A-Z]{2}))'+
			')?\\s*'+
			'(?<taxesPart>('+$taxPattern+')*)\\s*'+
			'$/';

		while ($line = php.array_shift($lines)) {
			if (php.preg_match($regex, $line, $matches = [])) {
				$matches = php.array_filter($matches); // to remove ambiguity between '' and null

				$result['currency'] = $result['currency'] || $matches['currency'];
				$result['amount'] = $result['amount'] || $matches['amount'];
				$result['amountIndicator'] = $result['amountIndicator'] || $matches['amountIndicator'];
				php.preg_match_all('/'+$taxPattern+'/', $matches['taxesPart'], $allTaxesMatches = [], php.PREG_SET_ORDER);

				for ($taxMatches of Object.values($allTaxesMatches)) {
					[$_, $amount, $taxCode] = $taxMatches;
					$result['taxes'] = $result['taxes'] || {};
					$result['taxes'][$taxCode] = $amount;}
			} else {
				php.array_unshift($lines, $line);
				break;
			}
		}

		return [$result, $lines];
	}

	// "FARE   EUR547.00 TAX   82.60YQ  TAX    3.80LV  TAX    7.20XM"
	// "                 TAX   17.60RI  TAX    7.66UH                "
	// "TOTAL   USD728.86               EQUIV FARE PD   USD610.00"
	//
	// Sometimes data is absent:
	// 'TOTAL       USDBT               EQUIV FARE PD          BT      ',
	static parsePriceInfo($lines)  {
		let $fare, $totalLineRegex, $line, $matches;

		[$fare, $lines] = this.parseFareAndTaxes($lines);

		$totalLineRegex =
			'/^'+
			'TOTAL\\s+'+
			'(?<totalCurrency>[A-Z]{3})?'+
			'((?<totalAmount>\\d+\\.?\\d*)|(?<totalAmountIndicator>[A-Z]{2}))\\s*'+
			'(EQUIV\\s+FARE\\s+PD\\s+'+
				'(?<equivFareCurrency>[A-Z]{3})?'+
				'((?<equivFareAmount>\\d+\\.?\\d*)|(?<equivFareAmountIndicator>[A-Z]{2}))'+
			')?\\s*'+
			'$/';

		$line = php.array_shift($lines);
		if (php.preg_match($totalLineRegex, $line, $matches = [])) {
			$matches = php.array_filter($matches);
			return [{
				'fare': $fare,
				'total': php.array_filter({
					'currency': $matches['totalCurrency'],
					'amount': $matches['totalAmount'],
					'amountIndicator': $matches['totalAmountIndicator'],
				}),
				'equivalentFarePaid': php.array_filter({
					'currency': $matches['equivFareCurrency'],
					'amount': $matches['equivFareAmount'],
					'amountIndicator': $matches['equivFareAmountIndicator'],
				}),
			}, $lines];
		} else {
			return [{
				'error': 'line does not match pattern: '+$totalLineRegex,
				'line': $line,
			}, $lines];
		}
	}

	// "2    DY   7107  P  28NOV  LGWLAS 1210P  OK PSRGB           OPEN"
	static parseSegmentLine($line)  {
		let $regex, $matches, $_, $couponNumber;

		$regex =
			'/^'+
			'(?<couponNumber>\\d+)\\s+'+
			'(?<airline>[A-Z\\d]{2})\\s+'+
			'(?<flightNumber>\\d{1,4})\\s+'+
			'(?<bookingClass>[A-Z])\\s+'+
			'(?<departureDate>\\d{2}[A-Z]{3})\\s+'+
			'(?<departureAirport>[A-Z]{3})'+
			'(?<destinationAirport>[A-Z]{3})\\s+'+
			'(?<departureTime>\\d{2,4}[A-Z]?)\\s+'+
			'(?<bookingStatus>OK|RQ|NS)\\s+'+
			'(?<fareBasis>[^\\s\\\/]+)'+
			'(\\\/(?<ticketDesignator>[^\\s]+))?\\s+'+
			'(?<couponStatus>[A-Z\\d]{2,4})\\s*'+
			'$/';

		if (php.preg_match($regex, $line, $matches = [])) {
			return {
				'couponNumber': $matches['couponNumber'],
				'airline': $matches['airline'],
				'flightNumber': $matches['flightNumber'],
				'bookingClass': $matches['bookingClass'],
				'departureDate': {
					'raw': $matches['departureDate'],
					'parsed': CommonParserHelpers.parsePartialDate($matches['departureDate']),
				},
				'departureAirport': $matches['departureAirport'],
				'destinationAirport': $matches['destinationAirport'],
				'departureTime': {
					'raw': $matches['departureTime'],
					'parsed': CommonParserHelpers.decodeApolloTime($matches['departureTime']),
				},
				'bookingStatus': $matches['bookingStatus'],
				'fareBasis': $matches['fareBasis'],
				'ticketDesignator': $matches['ticketDesignator'],
				'couponStatus': $matches['couponStatus'],
				'segmentType': ItineraryParser.SEGMENT_TYPE_ITINERARY_SEGMENT,
			};
		} else if (php.preg_match(/^(\d+)\s+ARUNK\s*$/, $line, $matches = [])) {
			[$_, $couponNumber] = $matches;
			return {
				'couponNumber': $couponNumber,
				'segmentType': ItineraryParser.SEGMENT_TYPE_ARNK,
			};
		} else {
			return null;
		}
	}

	static parseSegments($lines)  {
		let $segments, $line, $segment;

		php.array_shift($lines); // column headers
		$segments = [];
		while ($line = php.array_shift($lines)) {
			if ($segment = this.parseSegmentLine($line)) {
				$segments.push($segment);
			} else {
				php.array_unshift($lines, $line);
				break;
			}
		}

		return [$segments, $lines];
	}

	// "FOP: VI4123456789012345*0104 /012345 M"
	static parseCreditCardLine($line)  {
		let $approvalSources, $pattern, $matches, $_, $paymentNetwork, $creditCardNumber, $expirationDate, $approvalCode, $approvalSource;

		$approvalSources = {
			'L': 'link',
			'S': 'sabre',
			'M': 'manualForAgencies',
			'Z': 'manual',
			'C': 'reused',
		};

		$pattern = /^FOP:\s+([A-Z]{2})([\dX]{15,16})\*([\dX]{4})\s+\/([\dA-Z]+)\s+([LSMZC]|)\s*$/;
		if (php.preg_match($pattern, $line, $matches = [])) {
			[$_, $paymentNetwork, $creditCardNumber, $expirationDate, $approvalCode, $approvalSource] = $matches;
			return {
				'paymentNetwork': $paymentNetwork,
				'creditCardNumber': $creditCardNumber,
				'expirationDate': {
					'raw': $expirationDate,
					'parsed': '20'+php.substr($expirationDate, 0, 2)+'-'+php.substr($expirationDate, 2),
				},
				'approvalCode': $approvalCode,
				'approvalSource': $approvalSource ? $approvalSources[$approvalSource] : null,
			};
		} else {
			return null;
		}
	}

	// "1ELECTRONIC TICKET RECORD"
	// "INV:                  CUST:8007502041                PNR:LOZYSM"
	// "TKT:0167851991461     ISSUED:23AUG16   PCC:DK8H   IATA:10741570"
	// "NAME:GILLESPIE/WILLIAMCOLE"
	// "NAME REF:                              TOUR ID:267BR"
	static getHeaderLinesPattern()  {

		return [
			[false, '^'+
				'INV:(?<invoiceNumber>[A-Z0-9]+)?\\s+'+
				'CUST:(?<customerNumber>[A-Z0-9]+)?\\s+'+
				'PNR:(?<recordLocator>[A-Z0-9]{6})\\s*'+
			'$'],
			[false, '^'+
				'TKT:(?<ticketNumber>\\d{13})'+
				'([\\\/\\-](?<ticketNumberExtension>\\d+))?\\s+'+
				'ISSUED:(?<issueDate>\\d{2}[A-Z]{3}\\d{2})\\s+'+
				'PCC:(?<pcc>[A-Z0-9]{3,4})\\s+'+
				'IATA:(?<pccIataCode>\\d+)\\s*'+
			'$'],
			[false, '^'+
				'NAME:(?<passengerName>[\\w\\s]+\\\/[\\w\\s]+[\\w])'+
				'(\\s+FF:'+
					'(?<frequentFlierAirline>[A-Z0-9]{2})'+
					'(?<frequentFlierCode>[\\dA-Z]+)'+
				')?\\s*'+
			'$'],
			[true, '^'+
				'NAME REF:(?<nameReference>[\\dA-Z\\-]*)\\s+'+
				'(TOUR\\sID:(?<tourId>[^\\s]*))?\\s*'+
			'$'],
		];
	}

	static parseHeader($lines)  {
		let $result, $linePatterns, $tuple, $isOptional, $pattern, $line, $matches, $issueDateParsed, $fopLine, $creditCardInfo, $raw;

		$result = {};

		$linePatterns = this.getHeaderLinesPattern();

		for ($tuple of Object.values($linePatterns)) {
			[$isOptional, $pattern] = $tuple;
			$line = php.array_shift($lines);
			if (php.preg_match('/'+$pattern+'/', $line, $matches = [])) {
				Object.assign($result, php.array_filter(this.removeIndexKeys($matches)));
			} else {
				if ($isOptional) {
					php.array_unshift($lines, $line);
				} else {
					Object.assign($result, {
						'error': 'line does not match pattern: /'+$pattern+'/',
						'line': $line,
					});
					return [$result, $lines];
				}
			}}

		$issueDateParsed = CommonParserHelpers.parseApolloFullDate($result['issueDate']);
		$result['issueDate'] = {
			'raw': $result['issueDate'],
			'parsed': $issueDateParsed ? '20'+$issueDateParsed : null,
		};

		$fopLine = php.array_shift($lines);
		if (php.preg_match(/^FOP: CHECK\s*$/, $fopLine)) {
			$result['formOfPayment'] = 'check';
		} else if ($creditCardInfo = this.parseCreditCardLine($fopLine)) {
			$result['formOfPayment'] = 'creditCard';
			$result['creditCardInfo'] = $creditCardInfo;
		} else if (php.preg_match(/^FOP:\s*(.*)$/, $fopLine, $matches = [])) {
			$raw = $matches[1];
			if (!$raw) {
				$result['formOfPayment'] = 'none';
			} else {
				$result['formOfPayment'] = 'unparsed';
				$result['formOfPaymentRaw'] = $raw;
			}
		} else {
			return [$result + {
				'error': 'failed to parse FOP line',
				'line': $fopLine,
			}, $lines];
		}

		return [$result, $lines];
	}

	static getProcessScheme()  {
		let $parseEmptyLine;

		$parseEmptyLine = ($lines) => {
			let $result, $line;

			$result = php.trim($line = php.array_shift($lines)) !== ''
				? {'error': 'unexpected non-empty line', 'line': $line}
				: [];
			return [$result, $lines];
		};
		return [
			[null, ($lines) => {
				let $result, $line;

				$result = !php.preg_match(/ELECTRONIC TICKET RECORD/, $line = php.array_shift($lines))
					? {'error': 'unexpectedStartOfDump', 'line': $line}
					: [];
				return [$result, $lines];
			}],
			['header', (...args) => this.parseHeader(...args)],
			['segments', (...args) => this.parseSegments(...args)],
			[null, $parseEmptyLine],
			['priceInfo', (...args) => this.parsePriceInfo(...args)],
			[null, $parseEmptyLine],
			['fareConstruction', (...args) => this.parseFareConstruction(...args)],
			['extraFields', (...args) => this.parseExtraFields(...args)],
		];
	}

	static parse($dump)  {
		let $errorData, $result, $lines, $tuple, $sectionName, $func, $funcResult, $error, $i, $endorsementLines;

		if ($errorData = this.detectErrorResponse($dump)) {
			return $errorData;
		}

		$result = [];

		$lines = StringUtil.lines($dump);

		for ($tuple of Object.values(this.getProcessScheme())) {
			[$sectionName, $func] = $tuple;
			[$funcResult, $lines] = $func($lines);
			if ($sectionName !== null) {
				$result[$sectionName] = $funcResult;
			}
			if ($error = $funcResult['error']) {
				if ($sectionName !== null) {
					$result['error'] = 'failed to parse `'+$sectionName+'` - '+$error;
				} else {
					$result += $funcResult;
				}
				break;
			}}

		for ($i = 0; $i < php.count($lines); ++$i) {
			if (php.preg_match(/^ENDORSEMENT\/RESTRICTION:\s*$/, $lines[$i])) {
				$endorsementLines = php.array_splice($lines, $i);
				php.array_shift($endorsementLines); // ENDORSEMENT/RESTRICTION:
				$result['endorsementLines'] = php.array_filter(Fp.map('rtrim', $endorsementLines));
			}
		}
		$result['unparsedLines'] = $lines;

		return $result;
	}
}
module.exports = SabreTicketParser;
