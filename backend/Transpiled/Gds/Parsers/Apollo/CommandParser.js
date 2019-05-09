// namespace Gds\Parsers\Apollo;

const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const Lexeme = require('../../../Lib/Lexer/Lexeme.js');
const Lexer = require('../../../Lib/Lexer/Lexer.js');
const AtfqParser = require('../../../Gds/Parsers/Apollo/Pnr/AtfqParser.js');
const php = require("../../../php");
const CommonParserHelpers = require("./CommonParserHelpers");

/**
 * takes terminal command typed by a user and returns it's type
 * and probably some more info in future, like Sabre-version of
 * this command, maybe description what it does, link to HELP, etc...
 */
class CommandParser {
	static detectCommandType($cmd) {
		let $is, $startsWith, $regex, $pattern, $type, $name;
		$cmd = php.strtoupper($cmd);
		$is = {
			'IR': 'ignoreKeepPnr',
			'9D': 'requestedSeats',
			'*MP': 'frequentFlyerData',
			'*MPD': 'mcoList',
			'$V:/S': 'fareRuleSummary',
			'*HTE': 'ticketList',
			'@MT': 'verifyConnectionTimes',
			'T:R': 'restoreTicketedPricing',
			'QXI': 'leaveQueue',
			'QR': 'removeFromQueue',
			'.IHK': 'confirmScheduleChange',
			'MT': 'moveTop',
			'MB': 'moveBottom',
			'MR': 'moveRest',
			'TIPN': 'nextTiPage', // next page in "TI-*"
			'C:F-': 'removeFormOfPayment', // remove form of payment
			// HELP PNR-DISPLAY PNR FIELDS
			'*P': 'passengerData', // PASSENGER DATA
			'*N': 'names', // NAME -s of passengers
			'*T': 'ticketing', // TICKETING WITH ATFQ AND FOP
			'*IA': 'airItinerary', // AIR SEGMENT
			'*SVC': 'flightServiceInfo', // SERVICES FOR ALL SEGMENTS
			'*HA': 'airItineraryHistory', // AIR SEGMENT CHANGE
			'*H$': 'pricingHistory', // HISTORY - ATFQ (STORED PRICING FARE FIELD) CHANGE
			'*PA': 'profileAssociation',
			'*DV': 'dividedBookings',
			'OP/W*': 'workAreas',
			'F': 'fileDividedBooking',
			'HHMCO': 'requestMcoMask',
		};
		$startsWith = {
			'@LT': 'showTime',
			'MU': 'moveUp',
			'MD': 'moveDown',
			'S*AIR/': 'decodeAirline',
			'M*': 'determineMileage',
			'HELP': 'help',
			'*H': 'history',
			'DC*': 'directConnectionList',
			'$V:': 'mostRestrictiveSegmentRules',
			'$V/CMB': 'ruleCombinations',
			'$EX NAME': 'exchangeTicketMask',
			'$MR       TOTAL ADD COLLECT': 'confirmExchangeFareDifferenceMask',
			'*TE': 'ticketMask',
			'*LF': 'storedPricing', // '*LF', '*LF1'
			'HHMCU': 'submitMcoMask',
			'*MCO': 'storedMcoMask', // '*MCO1', '*MCO2'
			'@:3SSR': 'addSsr',
			'@:3': 'addProgrammaticSsr',
			'B/': 'bridgeTo',
			'*$B': 'redisplayPriceItinerary',
			'0TURZOBK1XXX': 'addTurSegment',
			'COQ': 'movePnrToPccQueue',
			'JV': 'verifyCreditCard',
			'QEP': 'movePnrToQueue',
			'QC': 'queueCount',
			'QLD': 'queueRecordLocators',
			'QI': 'ignoreMoveToQueue',
			'SON': 'signIn',
			'SOF': 'signOut',
			'STD': 'createAgent',
			'RRVO': 'voidTicket',
			'RRVE': 'exchangeTicket',
			'HBRF': 'refundTicket',
			'HB': 'issueTickets',
			'QMDR': 'qmdr',
			'Q': 'openQueue',
			'XX': 'calculator',
			'F-': 'addFormOfPayment',
			'F:': 'operationalInfo',
			'9V': 'seatMap',
			'HMPR': 'soldTicketsDailyReport',
			'TI-': 'visaAndHealthInfo',
			'T:$B': 'storePricing', // store Ticketing pricing
			'MV/': 'fillFromProfile',
			'MVT/': 'addAgencyInfo', // add agency info
			'$D': 'fareSearch', // HELP TARIFF DISPLAY-BASIC OR VALIDATED
			'FD': 'fareDetailsFromTariff',
			'$LR': 'routingFromTariff',
			'*$D': 'redisplayFareSearch',
			'S*': 'encodeOrDecode', // HELP ENCODE OR DECODE
			'A': 'airAvailability', // HELP AVAILABILITY-STANDARD
			'.': 'changeSegmentStatus', // HELP PNR-CHANGE SEGMENT STATUS
			'C:PS': 'changePsRemark',
			'CAL': 'carAvailability', // HELP CAR-AVAILABILITY
			'FZ': 'convertCurrency', // HELP FZS (currency conversion)
			'S': 'changeWorkArea',
			'$TA': 'manualStoreTaxes',
			'$NME': 'manualStoreItinerary',
			'$MD': 'manualStoreMoveDown',
			'$FC': 'manualStoreFareCalculation',
			// usually >RESALL;
			'RE': 'storeAndCopyPnr',
			'DN': 'divideBooking',
			'$LB': 'showBookingClassOfFare',
			'L@': 'availabilityThroughLink',
			'DCT': 'minConnectionTimeTable',
		};
		$regex = {
			[/^VIT[A-Z0-9]{2}\d+\/\d{1,2}[A-Z]{3}$/]: 'flightRoutingAndTimes', // flight routing and times
			[/^FQN\d*$/]: 'fareList', // Fare Components For i-th ptc group in pricing
			[/^FN\d+$/]: 'fareRulesMenu', // show available sections of i-th fare
			[/^\$V\d+\/?$/]: 'fareRulesMenuFromTariff', // show available sections of i-th fare
			[/^FN\d+\/S$/]: 'fareRulesSummary', // navigate through them with summary
			[/^FN\d+(\/\d+(\-\d+)?|\/[A-Z]{3})+/]: 'fareRules', // get k-th fare rule section of i-th fare
			[/^\$V(\/\d+(\-\d+)?|\/[A-Z]{3})+/]: 'fareRulesFromMenu',
			[/^\$V\d+(\/\d+(\-\d+)?|\/[A-Z]{3})+/]: 'fareRulesFromTariff',
			[/^T:V\d*$/]: 'restorePricing',
			[/^\*R(\||$)/]: 'redisplayPnr', // ENTIRE RECORD
			[/^\*I(\||$)/]: 'itinerary', // ITINERARY
			[/^(?:\/\d+){2}(?:[|+-]\d+)*$/]: 'reorderSegments',
			[/^(?:\/\d+)$/]: 'setNextFollowsSegment',
			[/^FS\d*[A-Z]{3}(\d+[A-Z]{3}[A-Z]{3})+.*$/]: 'lowFareSearch', // HELP FSU (Unbooked)
			[/^FS\d+$/]: 'sellFromLowFareSearch',
			['/^(' + php.implode('|', [
				'MORE\\*\\d+',// AT THE SAME PRICE AS PRICING OPTION \d
				'FS\\*\\d+',// VIEW FARE DETAILS FOR PRICING OPTION \d
				'FSMORE',// VIEW MORE PRICING OPTIONS
				'\\*FS', // RETURN TO THE ORIGINAL PRICING OPTION SCREEN
				'FS-', // RETURN TO THE PREVIOUS SCREEN
			]) + ')$/']: 'lowFareSearchNavigation', // HELP FSN (Navigation)
			[/^FS\/\/.*$/]: 'lowFareSearchFromPnr', // HELP FSA (Availabilities for current reservation)
			// there are also "HELP FSP and HELP FSC" for filters when working within a reservation,
			// but i believe we don't use them much, please, add the regex-es here if i am wrong
			[/^FS.*/]: 'lowFareSearchUnclassified',
		};
		$cmd = php.trim($cmd);
		for ([$pattern, $type] of Object.entries($is)) {
			if ($cmd === $pattern) {
				return $type;
			}
		}
		for ([$pattern, $type] of Object.entries($startsWith)) {
			if (StringUtil.startsWith($cmd, $pattern)) {
				return $type;
			}
		}
		for ([$pattern, $name] of Object.entries($regex)) {
			if (php.preg_match($pattern, $cmd)) {
				return $name;
			}
		}
		return null;
	}

	// '1|3-5'
	static parseRange($expr, $delim, $thru) {
		let $parseRange;
		$parseRange = ($text) => {
			let $pair;
			$pair = php.explode($thru, $text);
			return php.range($pair[0], $pair[1] || $pair[0]);
		};
		return Fp.flatten(Fp.map($parseRange, php.explode($delim, php.trim($expr))));
	}

	/** @param $expr = '2-4*7*9-13' || '' || '2-*'; */
	static parseRemarkRanges($expr) {
		let $ranges, $rangeType, $matches, $rawRange, $pair;
		$ranges = [];
		if (!$expr) {
			$rangeType = 'notSpecified';
			$ranges.push({'from': 1, 'to': 1});
		} else if (php.preg_match(/^(\d+)-\*$/, $expr, $matches = [])) {
			$rangeType = 'everythingAfter';
			$ranges.push({'from': $matches[1]});
		} else {
			$rangeType = 'explicitEnds';
			for ($rawRange of php.explode('*', php.trim($expr))) {
				$pair = php.explode('-', $rawRange);
				$ranges.push({'from': $pair[0], 'to': $pair[1] || $pair[0]});
			}
		}
		return {'rangeType': $rangeType, 'ranges': $ranges};
	}

	static parsePaxRanges($expr) {
		return Fp.map(($num) => {
			let $lNum, $fNum;
			$lNum = php.explode('-', $num)[0];
			$fNum = php.explode('-', $num)[1] || null;
			return {
				'from': $lNum, 'fromMinor': $fNum,
				'to': $lNum, 'toMinor': $fNum,
			};
		}, php.explode('|', $expr));
	}

	static parseChangePnrRemarks($cmd) {
		let $regex, $matches, $rangesData;
		$regex =
			'/^' +
			'(?<cmd>' +
			'C:' +
			'(?<ranges>[\\-\\d\\*]*)@:5' +
			'(?<newText>[^\\|]*)' +
			')' +
			'(\\|(?<textLeft>.*)|$)' +
			'/';
		if (php.preg_match($regex, $cmd, $matches = [])) {
			$rangesData = this.parseRemarkRanges($matches['ranges']);
			return {
				'cmd': $matches['cmd'],
				'type': 'changePnrRemarks',
				'data': {
					'rangeType': $rangesData['rangeType'],
					'ranges': $rangesData['ranges'],
					'newText': $matches['newText'],
				},
				'textLeft': $matches['textLeft'] || '',
			};
		} else {
			return null;
		}
	}

	static parseChainableCmd($cmd) {
		let $simplePatterns, $pattern, $name, $matches, $raw, $data;
		$simplePatterns = {
			[/^@:5(.+?)(\||$)/]: 'addRemark',
			[/^PS-(.+?)(\||$)/]: 'psRemark',
			[/^I(\||$)/]: 'ignore',
			[/^P:(.*?)(\||$)/]: 'addAgencyPhone',
			[/^R:(.*?)(\||$)/]: 'addReceivedFrom',
			[/^N:(.*?)(\||$)/]: 'addName',
			[/^T:TAU\/(.*?)(\||$)/]: 'addTicketingDateLimit',
			[/^T-CA(.*?)(\||$)/]: 'addAccountingLine',
			[/^\*\s*([A-Z0-9]{6})(\||$)/]: 'openPnr',
			[/^C:(\d+)@:3(\||$)/]: 'cancelSsr',
			[/^\*(\d{1,3})(\||$)/]: 'displayPnrFromList',
			[/^\*\*([^|]*?-[A-Z][^|]*?)(\||$)/]: 'searchPnr',
		};
		for ([$pattern, $name] of Object.entries($simplePatterns)) {
			if (php.preg_match($pattern, $cmd, $matches = [])) {
				[$raw, $data] = $matches;
				return {
					'cmd': php.rtrim($raw, '|'),
					'type': $name,
					'data': $data || null,
					'textLeft': php.mb_substr($cmd, php.mb_strlen($raw)),
				};
			}
		}
		return this.parseChangePnrRemarks($cmd)
			|| null;
	}

	static parseStorePnr($cmd) {
		let $result, $textLeft;
		$result = {'keepPnr': false, 'sendEmail': false};
		if (!StringUtil.startsWith($cmd, 'E')) {
			return null;
		}
		$textLeft = php.substr($cmd, 1);
		if (StringUtil.startsWith($textLeft, 'R')) {
			$result['keepPnr'] = true;
			$textLeft = php.substr($textLeft, 1);
		} else if (StringUtil.startsWith($textLeft, 'C')) {
			// store "cruise" PNR, works with normal PNR-s too
			$textLeft = php.substr($textLeft, 1);
		} else if (StringUtil.startsWith($textLeft, 'L')) {
			// store and show similar name list
			$textLeft = php.substr($textLeft, 1);
		}
		if (StringUtil.startsWith($textLeft, 'M')) {
			$result['sendEmail'] = true;
			$textLeft = php.substr($textLeft, 1);
			// $result['actionData'] = ['raw' => $textLeft];
			$textLeft = '';
		}
		if ($textLeft) {
			$result['unparsed'] = $textLeft;
		}
		return $result;
	}

	// '01Y1Y2', '02S3*BK', '01Y11Y22'
	static parseAvailabilitySell($cmd) {
		let $segmentPattern, $regex, $matches, $segments, $tuples, $_, $bookingClass, $lineNumber;
		$segmentPattern = '([A-Z])(\\d{1,2})';
		$regex =
			'/^0' +
			'(?<seatCount>\\d+)' +
			'(?<segments>(' + $segmentPattern + ')+)' +
			'(?<includeConnections>\\*?)' +
			'(?<segmentStatus>[A-Z]{2}|)' +
			'$/';
		if (php.preg_match($regex, $cmd, $matches = [])) {
			$segments = [];
			php.preg_match_all('/' + $segmentPattern + '/', $matches['segments'], $tuples = [], php.PREG_SET_ORDER);
			for ([$_, $bookingClass, $lineNumber] of $tuples) {
				$segments.push({'bookingClass': $bookingClass, 'lineNumber': $lineNumber});
			}
			return {
				'sellType': 'availability',
				'seatCount': $matches['seatCount'],
				'segments': $segments,
				'includeConnections': $matches['includeConnections'] === '*',
				'segmentStatus': $matches['segmentStatus'],
			};
		} else {
			return null;
		}
	}

	// '0SK93F8NOVLAXCPHNN2'
	static parseDirectSell($cmd) {
		let $regex, $matches;
		$regex =
			'/^0' +
			'(?<airline>[A-Z0-9]{2})' +
			'(?<flightNumber>\\d{1,4})' +
			'(?<bookingClass>[A-Z])' +
			'(?<departureDate>\\d{1,2}[A-Z]{3})' +
			'(?<departureAirport>[A-Z]{3})' +
			'(?<destinationAirport>[A-Z]{3})' +
			'(?<segmentStatus>[A-Z]{2})' +
			'(?<seatCount>\\d{0,2})' +
			'(?<unparsed>.*?)' +
			'\\s*$/';
		if (php.preg_match($regex, $cmd, $matches = [])) {
			return {
				'sellType': 'directSell',
				'airline': $matches['airline'],
				'flightNumber': $matches['flightNumber'],
				'bookingClass': $matches['bookingClass'],
				'departureDate': {'raw': $matches['departureDate']},
				'departureAirport': $matches['departureAirport'],
				'destinationAirport': $matches['destinationAirport'],
				'segmentStatus': $matches['segmentStatus'],
				'seatCount': php.intval($matches['seatCount']),
				'unparsed': $matches['unparsed'],
			};
		} else {
			return null;
		}
	}

	// '1M|2B'
	static parseRebookSelective($textLeft) {
		let $segments, $rawSeg, $matches, $_, $segNum, $bookCls;
		$segments = [];
		for ($rawSeg of php.explode('|', $textLeft)) {
			if (php.preg_match(/^(\d{1,2})([A-Z])$/, $rawSeg, $matches = [])) {
				[$_, $segNum, $bookCls] = $matches;
				$segments.push({
					'segmentNumber': $segNum,
					'bookingClass': $bookCls,
				});
			} else {
				return null;
			}
		}
		return {
			'sellType': 'rebookSelective',
			'segments': $segments,
		};
	}

	// '25AUG/Q', 'B', '25FEB'
	static parseRebookAll($textLeft) {
		let $values, $date, $bookingClass, $value, $matches;
		$values = php.explode('/', $textLeft);
		$date = null;
		$bookingClass = null;
		for ($value of $values) {
			if (php.preg_match(/^(\d{1,2}[A-Z]{3})$/, $value, $matches = [])) {
				$date = {'raw': $matches[1]};
			} else if (php.preg_match(/^([A-Z]|)$/, $value, $matches = [])) {
				$bookingClass = $value;
			} else {
				return null;
			}
		}
		return {
			'sellType': 'rebookAll',
			'departureDate': $date,
			'bookingClass': $bookingClass,
		};
	}

	// '0XXOPENYSLCCVGNO1'
	static parseOpenSell($cmd) {
		let $regex, $matches;
		$regex =
			'/^0XXOPEN' +
			'(?<unparsed>.*?)' +
			'\\s*$/';
		if (php.preg_match($regex, $cmd, $matches = [])) {
			return {
				'sellType': 'openSegment',
				'unparsed': $matches['unparsed'],
			};
		} else {
			return null;
		}
	}

	static parseSell($cmd) {
		let $textLeft;
		if (StringUtil.startsWith($cmd, '0')) {
			$textLeft = php.substr($cmd, 1);
			return this.parseAvailabilitySell($cmd)
				|| this.parseRebookSelective($textLeft)
				|| this.parseRebookAll($textLeft)
				|| this.parseDirectSell($cmd)
				|| this.parseOpenSell($cmd)
				|| {'sellType': null, 'raw': $cmd};
		} else if (php.trim($cmd) === 'Y') {
			return {
				'sellType': 'arrivalUnknown',
				'segments': [
					{'type': 'ARNK'},
				],
			};
		} else {
			return null;
		}
	}

	// 'XI', 'XA', 'X5', 'X1|4', 'X1-3|5', 'X2/01B1', 'X4/0SK93F8NOVLAXCPHNN2'
	static parseDeletePnrField($cmd) {
		let $textLeft, $matches, $_, $range, $applyToAllAir, $segmentNumbers;
		if (StringUtil.startsWith($cmd, 'XX') ||
			!StringUtil.startsWith($cmd, 'X')
		) {
			return null;
		}
		$textLeft = php.substr($cmd, 1);
		if (php.preg_match(/^([AI]|\d[\-\|\d]*)(\/.*|)$/, $textLeft, $matches = [])) {
			[$_, $range, $textLeft] = $matches;
			if ($range === 'I' || $range === 'A') {
				$applyToAllAir = true;
				$segmentNumbers = [];
			} else {
				$applyToAllAir = false;
				$segmentNumbers = this.parseRange($range, '|', '-');
			}
			return {
				'field': 'itinerary',
				'applyToAllAir': $applyToAllAir,
				'segmentNumbers': $segmentNumbers,
				'sell': $textLeft ? this.parseSell(php.ltrim($textLeft, '/')) : null,
			};
		} else {
			return {'field': null, 'unparsed': $textLeft};
		}
	}

	// '/2|Y', '/3|01Y3', '/4|0UA15Y3DECLAXSFONN1'
	static parseInsertSegments($cmd) {
		let $matches, $_, $segNum, $value;
		if (php.preg_match(/^\/(\d+)\|(\S.*)$/, $cmd, $matches = [])) {
			[$_, $segNum, $value] = $matches;
			return {
				'insertAfter': $segNum,
				'sell': this.parseSell($value),
			};
		} else {
			return null;
		}
	}

	// '@AA4346366363', 'UA12345678910'
	static parseMpAir($airPart) {
		let $matches, $_, $at, $air, $code;
		if (php.preg_match(/^(@|)([A-Z0-9]{2})([A-Z0-9]*)$/, $airPart, $matches = [])) {
			[$_, $at, $air, $code] = $matches;
			return {
				'withAllPartners': $at ? true : false,
				'airline': $air,
				'code': $code,
			};
		} else {
			return null;
		}
	}

	// '*UA12345678910', 'N1*@LH12345678910',
	// 'N2-1*@AA4346366363*@BA2315488786*@DL7845453554'
	static parseMpPax($paxPart) {
		let $regex, $matches, $airParts, $mpAirs;
		$regex =
			'/^' +
			'(N?(?<majorPaxNum>\\d+)(-(?<minorPaxNum>\\d+))?)?' +
			'\\*(?<airPart>.*)' +
			'$/';
		if (php.preg_match($regex, $paxPart, $matches = [])) {
			$airParts = php.explode('*', $matches['airPart']);
			$mpAirs = php.array_map(a => this.parseMpAir(a), $airParts);
			if (Fp.any('is_null', $mpAirs)) {
				return null;
			} else {
				return {
					'majorPaxNum': $matches['majorPaxNum'] || '',
					'minorPaxNum': $matches['minorPaxNum'] || '',
					'mileagePrograms': $mpAirs,
				};
			}
		} else {
			return null;
		}
	}

	// 'MP*UA12345678910', 'MPN1*@LH12345678910', 'MP/X/N1*DL|2*AA'
	// 'MPN1-1*@AA8853315554*@BA9742123848*@DL3158746568|N2-1*@AA4346366363*@BA2315488786*@DL7845453554'
	static parseMpChange($cmd) {
		let $matches, $_, $xMark, $paxPart, $mpPaxes, $paxParts;
		if (php.preg_match(/^MP(\/X\/|)(.*)$/, $cmd, $matches = [])) {
			[$_, $xMark, $paxPart] = $matches;
			if ($paxPart === '*ALL') {
				$mpPaxes = [];
			} else {
				$paxParts = php.explode('|', $paxPart);
				$mpPaxes = php.array_map(a => this.parseMpPax(a), $paxParts);
			}
			if (Fp.any('is_null', $mpPaxes)) {
				return null;
			} else {
				return {
					'type': $xMark ? 'changeFrequentFlyerNumber' : 'addFrequentFlyerNumber',
					'data': {'passengers': $mpPaxes},
				};
			}
		} else {
			return null;
		}
	}

	// '9S/S2/17A18C', '9S/N1/S2/A', '9S/S2/17AB'
	static parseSeatChange($cmd) {
		let $regex, $matches, $seatCodesStr, $seatMatches, $seatCodes, $_, $rowNumber, $letters, $letter;
		$regex =
			'/^' +
			'(?<baseCmd>9S|9X)' +
			'(\\/N(?<paxNums>\\d+[-|\\d]*))?' +
			'(\\/S(?<segNums>\\d+[*|\\d]*))?' +
			'(\\/(?<aisleMark>A))?' +
			'(\\/(?<seatCodes>(\\d+[A-Z]+)+))?' +
			'$/';
		if (php.preg_match($regex, $cmd, $matches = [])) {
			$seatCodesStr = $matches['seatCodes'] || '';
			php.preg_match_all(/(\d+)([A-Z]+)/, $seatCodesStr, $seatMatches = [], php.PREG_SET_ORDER);
			$seatCodes = [];
			for ([$_, $rowNumber, $letters] of $seatMatches) {
				for ($letter of php.str_split($letters, 1)) {
					$seatCodes.push($rowNumber + $letter);
				}
			}
			return {
				'type': {
					'9S': 'requestSeats',
					'9X': 'cancelSeats',
				}[$matches['baseCmd']] || null,
				'data': {
					'paxRanges': php.empty($matches['paxNums']) ? [] :
						this.parsePaxRanges($matches['paxNums']),
					'segNums': php.empty($matches['segNums']) ? [] :
						this.parseRange($matches['segNums'], '|', '*'),
					'location': php.empty($matches['aisleMark']) ? null :
						{'raw': $matches['aisleMark'], 'parsed': 'aisle'},
					'zone': null,
					'seatCodes': $seatCodes,
				},
			};
		} else {
			return null;
		}
	}

	static getCabinClasses() {
		return {
			'W': 'premium_economy',
			'F': 'first',
			'P': 'premium_first',
			'C': 'business',
			'Y': 'economy',
			'U': 'upper',
		};
	}

	static parseDate($raw) {
		return !$raw ? null : {
			'raw': $raw,
			'partial': CommonParserHelpers.parsePartialDate($raw),
			'full': CommonParserHelpers.parseCurrentCenturyFullDate($raw)['parsed'],
		};
	}

	static parseTariffMods($modsPart) {
		let $getFirst, $parseDate, $end, $lexer;
		$getFirst = ($matches) => {
			return $matches[1];
		};
		$parseDate = ($matches) => {
			return this.parseDate($matches[1]);
		};
		$end = '(?![A-Z0-9])';
		$lexer = new Lexer([
			(new Lexeme('airlines', '/^(\\|[A-Z0-9]{2})+' + $end + '/')).preprocessData(($matches) => {
				return php.explode('|', php.ltrim($matches[0], '|'));
			}),
			(new Lexeme('currency', '/^:([A-Z]{3})' + $end + '/')).preprocessData($getFirst),
			(new Lexeme('tripType', '/^:(RT|OW)' + $end + '/')).preprocessData($getFirst),
			(new Lexeme('cabinClass', '/^(\\\/\\\/)?@(?<cabinClass>[A-Z])' + $end + '/')).preprocessData(($matches) => {
				return this.getCabinClasses()[$matches['cabinClass']] || null;
			}),
			(new Lexeme('fareType', '/^:([A-Z])' + $end + '/')).preprocessData(($matches) => {
				return AtfqParser.decodeFareType($matches[1]);
			}),
			(new Lexeme('ptc', '/^-([A-Z][A-Z0-9]{2})' + $end + '/')).preprocessData($getFirst),
			(new Lexeme('bookingClass', '/^-([A-Z])' + $end + '/')).preprocessData($getFirst),
			(new Lexeme('ticketingDate', '/^T(\\d{1,2}[A-Z]{3}\\d{2})' + $end + '/')).preprocessData($parseDate),
		]);
		return $lexer.lex($modsPart);
	}

	static parseFareSearch($cmd) {
		let $returnDate, $matches, $_, $departureAirport, $destinationAirport, $departureDate, $modsPart, $lexed;
		$returnDate = null;
		if (php.preg_match(/^\$D([A-Z]{3})([A-Z]{3})(\d{1,2}[A-Z]{3}\d{0,2})(.*)$/, $cmd, $matches = [])) {
			[$_, $departureAirport, $destinationAirport, $departureDate, $modsPart] = $matches;
		} else if (php.preg_match(/^\$DV(\d{1,2}[A-Z]{3}\d{0,2})([A-Z]{3})([A-Z]{3})(\d{1,2}[A-Z]{3}\d{0,2})(.*)$/, $cmd, $matches = [])) {
			[$_, $departureDate, $departureAirport, $destinationAirport, $returnDate, $modsPart] = $matches;
		} else if (php.preg_match(/^\$DV?(\d{1,2}[A-Z]{3}\d{0,2})([A-Z]{3})([A-Z]{3})(.*)$/, $cmd, $matches = [])) {
			[$_, $departureDate, $departureAirport, $destinationAirport, $modsPart] = $matches;
		} else {
			return null;
		}
		$lexed = this.parseTariffMods($modsPart);
		return {
			'departureDate': this.parseDate($departureDate),
			'returnDate': this.parseDate($returnDate),
			'departureAirport': $departureAirport,
			'destinationAirport': $destinationAirport,
			'modifiers': Fp.map(($rec) => {
				return {
					'type': $rec['lexeme'], 'raw': $rec['raw'], 'parsed': $rec['data'],
				};
			}, $lexed['lexemes']),
			'unparsed': $lexed['text'],
		};
	}

	static parseArea($cmd) {
		let $filter, $matches;
		$filter = /^S([A-E])$/;
		if (php.preg_match($filter, $cmd, $matches = [])) {
			return $matches[1];
		} else {
			return null;
		}
	}

	static parsePcc($cmd) {
		let $filter, $matches;
		$filter = /^SEM\/([A-Z0-9]{3,4})\/AG$/;
		if (php.preg_match($filter, $cmd, $matches = [])) {
			return $matches[1];
		} else {
			return null;
		}
	}

	static parsePriceItinerary($cmd) {
		let $data;
		if (php.preg_match(/^\$B{1,2}/, $cmd) &&
			($data = AtfqParser.parsePricingCommand($cmd))
		) {
			return $data;
		} else {
			return null;
		}
	}

	static parsePriceItineraryManually($cmd) {
		let matches;
		if (php.preg_match(/^HHPR(.*?)\s*$/, $cmd, matches = [])) {
			let mods = AtfqParser.parsePricingModifiers(matches[1]);
			return {
				pricingModifiers: mods,
			};
		} else {
			return null;
		}
	}

	static parseStorePricing($cmd) {
		let $pricingCmd;
		if (StringUtil.startsWith($cmd, 'T:$B')) {
			$pricingCmd = php.substr($cmd, php.strlen('T:'));
			return this.parsePriceItinerary($pricingCmd);
		} else {
			return null;
		}
	}

	static parseShowPnrFieldsCmd($cmd) {
		let $availableCommands, $parts, $substr, $subCommand, $data, $checkCmd;
		if (StringUtil.startsWith($cmd, '*')) {
			$availableCommands = [
				'IA', 'IX', 'I', 'IC', 'IH', 'I', 'IN', 'IT',
				'PW', 'PC', 'PD', 'R', 'N', 'PO', 'P', 'PP',
				'P1', 'QM', 'PR', 'PRH', 'PS', 'PT', 'T',
			];
			$parts = [];
			$substr = php.explode('|', php.substr($cmd, 1));

			for ($subCommand of $substr) {
				if ($data = php.explode('/', $subCommand)) {
					$checkCmd = php.array_shift($data);

					if (php.in_array($checkCmd, $availableCommands)) {
						$parts.push({
							'field': $checkCmd,
							'modifiers': $data,
						});
					} else {
						return null;
					}
				}
			}

			if (!php.empty($parts)) {
				return {
					'cmd': $cmd,
					'type': 'showPnrFields',
					'data': $parts,
				};
			}
		}
		return null;
	}

	static parseBulkCommand($cmd) {
		let $parsedCommands, $strCmd, $parsedCmd, $parseTillEnd, $firstCmd;
		$parsedCommands = [];
		$strCmd = $cmd;
		while (!php.empty($strCmd)) {
			if ($parsedCmd = this.parseChainableCmd($strCmd)) {
				$strCmd = $parsedCmd['textLeft'];
				delete ($parsedCmd['textLeft']);
				$parsedCommands.push($parsedCmd);
			} else {
				$parseTillEnd = this.parseSingleCommand($strCmd) || {
					'cmd': $strCmd,
					'type': null,
					'data': null,
				};
				$parsedCommands.push($parseTillEnd);
				$strCmd = '';
			}
		}
		$firstCmd = php.array_shift($parsedCommands)
			|| {'type': null, 'data': null};
		$firstCmd['followingCommands'] = $parsedCommands;
		return $firstCmd;
	}

	static parse($cmd) {
		$cmd = php.str_replace('+', '|', $cmd);
		$cmd = php.str_replace('\u00A4', '@', $cmd);
		return this.parseBulkCommand($cmd);
	}

	static parseSingleCommand($cmd) {
		let $data, $type, $parsed;
		if ($data = this.parseArea($cmd)) {
			$type = 'changeArea';
		} else if ($data = this.parsePcc($cmd)) {
			$type = 'changePcc';
		} else if ($data = this.parsePriceItinerary($cmd)) {
			$type = 'priceItinerary';
		} else if ($data = this.parsePriceItineraryManually($cmd)) {
			$type = 'priceItineraryManually';
		} else if ($data = this.parseStorePricing($cmd)) {
			$type = 'storePricing';
		} else if ($data = this.parseSell($cmd)) {
			$type = 'sell';
		} else if ($data = this.parseDeletePnrField($cmd)) {
			$type = 'deletePnrField';
		} else if ($data = this.parseInsertSegments($cmd)) {
			$type = 'insertSegments';
		} else if ($data = this.parseFareSearch($cmd)) {
			$type = 'fareSearch';
		} else if ($parsed = this.parseMpChange($cmd)) {
			$type = $parsed['type'];
			$data = $parsed['data'];
		} else if ($parsed = this.parseSeatChange($cmd)) {
			$type = $parsed['type'];
			$data = $parsed['data'];
		} else if ($data = this.parseStorePnr($cmd)) {
			$type = php.array_keys(php.array_filter({
				'storePnrSendEmail': $data['sendEmail'],
				'storeKeepPnr': $data['keepPnr'],
			}))[0] || 'storePnr';
		} else if ($parsed = this.parseChainableCmd($cmd)) {
			return $parsed;
		} else if ($type = this.detectCommandType($cmd)) {
			$data = null;
		} else if ($parsed = this.parseShowPnrFieldsCmd($cmd)) {
			// for rest PNR fields we gave no explicit names to
			return $parsed;
		} else {
			return null;
		}
		return {
			'cmd': $cmd,
			'type': $type,
			'data': $data,
		};
	}
}

module.exports = CommandParser;
