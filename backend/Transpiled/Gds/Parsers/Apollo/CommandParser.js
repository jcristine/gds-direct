const PricingCmdParser = require('gds-utils/src/text_format_processing/apollo/commands/PricingCmdParser.js');

const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const Lexeme = require('gds-utils/src/lexer/Lexeme.js');
const Lexer = require('gds-utils/src/lexer/Lexer.js');
const php = require("klesun-node-tools/src/Transpiled/php.js");
const CommonParserHelpers = require("./CommonParserHelpers");
const {mkReg} = require('klesun-node-tools/src/Utils/Misc.js');

const simpleTypeExact = {
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

const simpleTypeStart = {
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
	'HMP': 'soldTicketsDailyReport',
	'TI-': 'visaAndHealthInfo',
	'T:$B': 'storePricing', // store Ticketing pricing
	'MV/': 'fillFromProfile',
	'MVT/': 'addAgencyInfo', // add agency info
	'$D': 'fareSearch', // HELP TARIFF DISPLAY-BASIC OR VALIDATED
	'FD': 'fareDetailsFromTariff',
	'$LR': 'routingFromTariff',
	'*$D': 'redisplayFareSearch',
	'S*': 'encodeOrDecode', // HELP ENCODE OR DECODE
	'A*': 'moreAirAvailability',
	'A-': 'lessAirAvailability',
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

const simpleTypeRegex = [
	[/^VIT[A-Z0-9]{2}\d+\/\d{1,2}[A-Z]{3}$/, 'flightRoutingAndTimes'], // flight routing and times
	[/^FQN\d*$/, 'fareList'], // Fare Components For i-th ptc group in pricing
	[/^FN\d+$/, 'fareRulesMenu'], // show available sections of i-th fare
	[/^\$V\d+\/?$/, 'fareRulesMenuFromTariff'], // show available sections of i-th fare
	[/^FN\d+\/S$/, 'fareRulesSummary'], // navigate through them with summary
	[/^FN\d+(\/\d+(\-\d+)?|\/[A-Z]{3})+/, 'fareRules'], // get k-th fare rule section of i-th fare
	[/^\$V(\/\d+(\-\d+)?|\/[A-Z]{3})+/, 'fareRulesFromMenu'],
	[/^\$V\d+(\/\d+(\-\d+)?|\/[A-Z]{3})+/, 'fareRulesFromTariff'],
	[/^T:V\d*$/, 'restorePricing'],
	[/^\*R(\||$)/, 'redisplayPnr'], // ENTIRE RECORD
	[/^\*I(\||$)/, 'itinerary'], // ITINERARY
	[/^(?:\/\d+){2}(?:[|+-]\d+)*$/, 'reorderSegments'],
	[/^(?:\/\d+)$/, 'setNextFollowsSegment'],
	[/^FS\d*[A-Z]{3}(\d+[A-Z]{3}[A-Z]{3})+.*$/, 'lowFareSearch'], // HELP FSU (Unbooked)
	[/^FS\d+$/, 'sellFromLowFareSearch'],
	[/^MORE\*\d+$/, 'lowFareSearchNavigation'],// AT THE SAME PRICE AS PRICING OPTION \d
	[/^FS\*\d+$/, 'lowFareSearchNavigation'],// VIEW FARE DETAILS FOR PRICING OPTION \d
	[/^FSMORE$/, 'lowFareSearchNavigation'],// VIEW MORE PRICING OPTIONS
	[/^\*FS$/, 'lowFareSearchNavigation'], // RETURN TO THE ORIGINAL PRICING OPTION SCREEN
	[/^FS-$/, 'lowFareSearchNavigation'], // RETURN TO THE PREVIOUS SCREEN
	[/^FS\/\/.*$/, 'lowFareSearchFromPnr'], // HELP FSA (Availabilities for current reservation)
	// there are also "HELP FSP and HELP FSC" for filters when working within a reservation,
	// but i believe we don't use them much, please, add the regex-es here if i am wrong
	[/^FS.*/, 'lowFareSearchUnclassified'],
];

const regex_sell_availability_seg = /([A-Z])(\d{1,2})/;

const regex_sell_availability = mkReg([
	'^0',
	/(?<seatCount>\d+)/,
	'(?<segments>(', regex_sell_availability_seg, ')+)',
	/(?<includeConnections>\*?)/,
	/(?<segmentStatus>[A-Z]{2}|)/,
	'$',
]);

// '01Y1Y2', '02S3*BK', '01Y11Y22'
const parse_sell_availability = (cmd) => {
	const match = cmd.match(regex_sell_availability);
	if (match) {
		const groups = match.groups;
		const segments = [];
		let tuples;
		php.preg_match_all(regex_sell_availability_seg, groups.segments, tuples = [], php.PREG_SET_ORDER);
		for (const [, $bookingClass, $lineNumber] of tuples) {
			segments.push({bookingClass: $bookingClass, lineNumber: $lineNumber});
		}
		return {
			sellType: 'availability',
			seatCount: groups.seatCount,
			segments: segments,
			includeConnections: groups.includeConnections === '*',
			segmentStatus: groups.segmentStatus,
		};
	} else {
		return null;
	}
};

// '0XXOPENYSLCCVGNO1'
const parse_sell_openSegment = ($cmd) => {
	const regex = /^0XXOPEN(?<unparsed>.*?)\s*$/;
	const match = $cmd.match(regex);
	if (match) {
		return {
			sellType: 'openSegment',
			unparsed: match.groups.unparsed,
		};
	} else {
		return null;
	}
};

const regex_sell_directSell = mkReg([
	'^0',
	/(?<airline>[A-Z0-9]{2})/,
	/(?<flightNumber>\d{1,4})/,
	/(?<bookingClass>[A-Z])/,
	/(?<departureDate>\d{1,2}[A-Z]{3})/,
	/(?<departureAirport>[A-Z]{3})/,
	/(?<destinationAirport>[A-Z]{3})/,
	/(?<segmentStatus>[A-Z]{2})/,
	/(?<seatCount>\d{0,2})/,
	/(?<unparsed>.*?)/,
	'\s*$',
]);

// '0SK93F8NOVLAXCPHNN2'
const parse_sell_directSell = (cmd) => {
	const match = cmd.match(regex_sell_directSell);
	if (match) {
		const groups = match.groups;
		return {
			sellType: 'directSell',
			airline: groups.airline,
			flightNumber: groups.flightNumber,
			bookingClass: groups.bookingClass,
			departureDate: {raw: groups.departureDate},
			departureAirport: groups.departureAirport,
			destinationAirport: groups.destinationAirport,
			segmentStatus: groups.segmentStatus,
			seatCount: php.intval(groups.seatCount),
			unparsed: groups.unparsed,
		};
	} else {
		return null;
	}
};

const regex_airAvailability = mkReg([
	/^A/,
	/(?:\/(?<sameCabin>\*)?(?<bookingClass>[A-Z])(?<seatCount>\d+)?\/)?/,
	/(?<departureDate>\d{1,2}[A-Z]{3})/,
	/(?<departureAirport>[A-Z]{3})/,
	/(?<destinationAirport>[A-Z]{3})/,
	/(?<unparsed>.*)/,
]);

const parse_airAvailability = (cmd) => {
	const match = cmd.match(regex_airAvailability);
	if (match) {
		const groups = match.groups;
		return {
			similarClass: groups.sameCabin === '*',
			bookingClass: groups.bookingClass,
			seatCount: groups.seatCount,
			departureDate: {
				raw: groups.departureDate,
				parsed: CommonParserHelpers.parsePartialDate(groups.departureDate),
			},
			departureAirport: groups.departureAirport,
			destinationAirport: groups.destinationAirport,
			unparsed: groups.unparsed,
		};
	} else {
		return null;
	}
};

const parsePaxRanges = (expr) => {
	return expr.split('|').map((num) => {
		const lNum = num.split('-')[0];
		const fNum = num.split('-')[1] || null;
		return {
			from: lNum, fromMinor: fNum,
			to: lNum, toMinor: fNum,
		};
	});
};

// '1|3-5'
const parseRange = (expr, delim, thru) => {
	const parseRange = (text) => {
		const pair = text.split(thru);
		return php.range(pair[0], pair[1] || pair[0]);
	};
	return expr.trim().split(delim).flatMap(parseRange);
};

const regex_seatChange = mkReg([
	'^',
	/(?<baseCmd>9S|9X)/,
	/(\/N(?<paxNums>\d+[-|\d]*))?/,
	/(\/S(?<segNums>\d+[*|\d]*))?/,
	/(\/(?<aisleMark>A))?/,
	/(\/(?<seatCodes>(\d+[A-Z]+)+))?/,
	'$',
]);

// '9S/S2/17A18C', '9S/N1/S2/A', '9S/S2/17AB'
const parse_changeSeats = (cmd) => {
	const match = cmd.match(regex_seatChange);
	if (match) {
		const groups = match.groups;
		const seatCodesStr = groups.seatCodes || '';
		let seatMatches;
		php.preg_match_all(/(\d+)([A-Z]+)/, seatCodesStr, seatMatches = [], php.PREG_SET_ORDER);
		const seatCodes = [];
		for (const [, $rowNumber, $letters] of seatMatches) {
			for (const letter of php.str_split($letters, 1)) {
				seatCodes.push($rowNumber + letter);
			}
		}
		return {
			type: {
				'9S': 'requestSeats',
				'9X': 'cancelSeats',
			}[groups['baseCmd']] || null,
			data: {
				paxRanges: php.empty(groups.paxNums) ? [] :
					parsePaxRanges(groups.paxNums),
				segNums: php.empty(groups.segNums) ? [] :
					parseRange(groups.segNums, '|', '*'),
				location: php.empty(groups.aisleMark) ? null :
					{raw: groups.aisleMark, parsed: 'aisle'},
				zone: null,
				seatCodes: seatCodes,
			},
		};
	} else {
		return null;
	}
};

/** @param expr = '2-4*7*9-13' || '' || '2-*'; */
const parseRemarkRanges = (expr) => {
	let rangeType, matches;
	const ranges = [];
	if (!expr) {
		rangeType = 'notSpecified';
		ranges.push({from: 1, to: 1});
	} else if (php.preg_match(/^(\d+)-\*$/, expr, matches = [])) {
		rangeType = 'everythingAfter';
		ranges.push({from: matches[1]});
	} else {
		rangeType = 'explicitEnds';
		for (const rawRange of php.explode('*', php.trim(expr))) {
			const pair = php.explode('-', rawRange);
			ranges.push({from: pair[0], to: pair[1] || pair[0]});
		}
	}
	return {rangeType, ranges};
};

const regex_changePnrRemarks = mkReg([
	'^',
	'(?<cmd>',
	/C:/,
	/(?<ranges>[0-9\-*]*)@:5/,
	/(?<newText>[^|]*)/,
	')',
	/(\|(?<textLeft>.*)|$)/,
]);

const parse_changePnrRemarks = ($cmd) => {
	const match = $cmd.match(regex_changePnrRemarks);
	if (match) {
		const groups = match.groups;
		const rangesData = parseRemarkRanges(groups.ranges);
		return {
			cmd: groups['cmd'],
			type: 'changePnrRemarks',
			data: {
				rangeType: rangesData.rangeType,
				ranges: rangesData.ranges,
				newText: groups.newText,
			},
			textLeft: groups.textLeft || '',
		};
	} else {
		return null;
	}
};

/** note: different case from PricingCmdParser */
const getCabinClasses = () => {
	return {
		W: 'premium_economy',
		F: 'first',
		P: 'premium_first',
		C: 'business',
		Y: 'economy',
		U: 'upper',
	};
};

const parseDate = (raw) => {
	return !raw ? null : {
		raw: raw,
		partial: CommonParserHelpers.parsePartialDate(raw),
		full: CommonParserHelpers.parseCurrentCenturyFullDate(raw)['parsed'],
	};
};

const end = /(?![A-Z0-9])/;
let lexemes_fareSearch = [
	new Lexeme('airlines', mkReg([/^(\|[A-Z0-9]{2})+/, end]))
		.map((matches) => php.ltrim(matches[0], '|').split('|')),
	new Lexeme('currency', mkReg([/^:([A-Z]{3})/, end])).map((m) => m[1]),
	new Lexeme('tripType', mkReg([/^:(RT|OW)/, end])).map((m) => m[1]),
	new Lexeme('cabinClass', mkReg([/^(\/\/)?@(?<cabinClass>[A-Z])/, end]))
		.map((matches) => getCabinClasses()[matches.cabinClass] || null),
	new Lexeme('fareType', mkReg([/^:([A-Z])/, end]))
		.map((matches) => PricingCmdParser.decodeFareType(matches[1])),
	new Lexeme('ptc', mkReg([/^-([A-Z][A-Z0-9]{2})/, end])).map((m) => m[1]),
	new Lexeme('bookingClass', mkReg([/^-([A-Z])/, end])).map((m) => m[1]),
	new Lexeme('ticketingDate', mkReg([/^T(\d{1,2}[A-Z]{3}\d{2})/, end])).map((m) => parseDate(m[1])),
];

const parseTariffMods = ($modsPart) => {
	const lexer = new Lexer(lexemes_fareSearch);
	return lexer.lex($modsPart);
};

const parse_fareSearch = (cmd) => {
	let returnDate, $matches, $_, departureAirport, destinationAirport, departureDate, $modsPart, $lexed;
	returnDate = null;
	// probably should parse token sequence with Lexer.js same as
	// modifiers, as we know that they may come in nearly any order...
	// the only rule I see here is that return date can only be specified with "V"-alidated indicator
	if (php.preg_match(/^\$D([A-Z]{3})([A-Z]{3})(\d{1,2}[A-Z]{3}\d{0,2})(.*)$/, cmd, $matches = [])) {
		// $DJFKMNL25MAY
		[$_, departureAirport, destinationAirport, departureDate, $modsPart] = $matches;
	} else if (php.preg_match(/^\$DV(\d{1,2}[A-Z]{3}\d{0,2})([A-Z]{3})([A-Z]{3})(\d{1,2}[A-Z]{3}\d{0,2})(.*)$/, cmd, $matches = [])) {
		// $DV25MAYJFKMNL28MAY
		[$_, departureDate, departureAirport, destinationAirport, returnDate, $modsPart] = $matches;
	} else if (php.preg_match(/^\$DV?(\d{1,2}[A-Z]{3}\d{0,2})([A-Z]{3})([A-Z]{3})(.*)$/, cmd, $matches = [])) {
		// $DV25MAYJFKMNL, $D25MAYJFKMNL
		[$_, departureDate, departureAirport, destinationAirport, $modsPart] = $matches;
	} else if (php.preg_match(/^\$D([A-Z]{3})([A-Z]{3})V(\d{1,2}[A-Z]{3})(\d{1,2}[A-Z]{3}){0,1}(.*)$/, cmd, $matches = [])) {
		// $DJFKMNLV25MAY27MAY, $DJFKMNLV25MAY
		[$_, departureAirport, destinationAirport, departureDate, returnDate, $modsPart] = $matches;
	} else {
		return null;
	}

	const lexed = parseTariffMods($modsPart);

	return {
		departureDate: parseDate(departureDate),
		returnDate: parseDate(returnDate),
		departureAirport: departureAirport,
		destinationAirport: destinationAirport,
		modifiers: lexed.lexemes.map((rec) => ({
			type: rec.lexeme, raw: rec.raw, parsed: rec.data,
		})),
		unparsed: lexed.text,
	};
};

/**
 * takes terminal command typed by a user and returns it's type
 * and probably some more info in future, like Sabre-version of
 * this command, maybe description what it does, link to HELP, etc...
 */
class CommandParser {
	static detectCommandType(cmd) {
		cmd = php.strtoupper(cmd);
		cmd = php.trim(cmd);
		for (const [pattern, type] of Object.entries(simpleTypeStart)) {
			if (cmd.startsWith(pattern)) {
				return type;
			}
		}
		for (const [pattern, name] of simpleTypeRegex) {
			if (cmd.match(pattern)) {
				return name;
			}
		}
		return null;
	}

	static parseChainableCmd(cmd) {
		const simplePatterns = [
			[/^@:5(.+?)(\||$)/, 'addRemark'],
			[/^PS-(.+?)(\||$)/, 'psRemark'],
			[/^I(\||$)/, 'ignore'],
			[/^P:(.*?)(\||$)/, 'addAgencyPhone'],
			[/^R:(.*?)(\||$)/, 'addReceivedFrom'],
			[/^N:(.*?)(\||$)/, 'addName'],
			[/^T:TAU\/(.*?)(\||$)/, 'addTicketingDateLimit'],
			[/^T-(.*?)(\||$)/, 'addAccountingLine'],
			[/^\*\s*([A-Z0-9]{6})(\||$)/, 'openPnr'],
			[/^C:(\d+)@:3(\||$)/, 'cancelSsr'],
			[/^\*(\d{1,3})(\||$)/, 'displayPnrFromList'],
			[/^\*\*([^|]*?-[A-Z][^|]*?)(\||$)/, 'searchPnr'],
		];
		for (const [pattern, name] of simplePatterns) {
			const matches = cmd.match(pattern);
			if (matches) {
				const [raw, data] = matches;
				return {
					cmd: php.rtrim(raw, '|'),
					type: name,
					data: data || null,
					textLeft: php.mb_substr(cmd, php.mb_strlen(raw)),
				};
			}
		}
		return parse_changePnrRemarks(cmd)
			|| null;
	}

	static parseStorePnr($cmd) {
		let $result, $textLeft;
		$result = {keepPnr: false, sendEmail: false};
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

	// '1M|2B'
	static parseRebookSelective($textLeft) {
		let $segments, $rawSeg, $matches, $_, $segNum, $bookCls;
		$segments = [];
		for ($rawSeg of php.explode('|', $textLeft)) {
			if (php.preg_match(/^(\d{1,2})([A-Z])$/, $rawSeg, $matches = [])) {
				[$_, $segNum, $bookCls] = $matches;
				$segments.push({
					segmentNumber: $segNum,
					bookingClass: $bookCls,
				});
			} else {
				return null;
			}
		}
		return {
			sellType: 'rebookSelective',
			segments: $segments,
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
				$date = {raw: $matches[1]};
			} else if (php.preg_match(/^([A-Z]|)$/, $value, $matches = [])) {
				$bookingClass = $value;
			} else {
				return null;
			}
		}
		return {
			sellType: 'rebookAll',
			departureDate: $date,
			bookingClass: $bookingClass,
		};
	}

	static parseSell(cmd) {
		let $textLeft;
		if (StringUtil.startsWith(cmd, '0')) {
			$textLeft = php.substr(cmd, 1);
			return parse_sell_availability(cmd)
				|| this.parseRebookSelective($textLeft)
				|| this.parseRebookAll($textLeft)
				|| parse_sell_directSell(cmd)
				|| parse_sell_openSegment(cmd)
				|| {sellType: null, raw: cmd};
		} else if (php.trim(cmd) === 'Y') {
			return {
				sellType: 'arrivalUnknown',
				segments: [
					{type: 'ARNK'},
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
				$segmentNumbers = parseRange($range, '|', '-');
			}
			return {
				field: 'itinerary',
				applyToAllAir: $applyToAllAir,
				segmentNumbers: $segmentNumbers,
				sell: $textLeft ? this.parseSell(php.ltrim($textLeft, '/')) : null,
			};
		} else {
			return {field: null, unparsed: $textLeft};
		}
	}

	// '/2|Y', '/3|01Y3', '/4|0UA15Y3DECLAXSFONN1'
	static parseInsertSegments($cmd) {
		let $matches, $_, $segNum, $value;
		if (php.preg_match(/^\/(\d+)\|(\S.*)$/, $cmd, $matches = [])) {
			[$_, $segNum, $value] = $matches;
			return {
				insertAfter: $segNum,
				sell: this.parseSell($value),
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
				withAllPartners: $at ? true : false,
				airline: $air,
				code: $code,
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
					majorPaxNum: $matches['majorPaxNum'] || '',
					minorPaxNum: $matches['minorPaxNum'] || '',
					mileagePrograms: $mpAirs,
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
					type: $xMark ? 'changeFrequentFlyerNumber' : 'addFrequentFlyerNumber',
					data: {passengers: $mpPaxes},
				};
			}
		} else {
			return null;
		}
	}

	static getCabinClasses() {
		return getCabinClasses();
	}

	static parseFareSearch(cmd) {
		return parse_fareSearch(cmd);
	}

	static parseArea(cmd) {
		const matches = cmd.match(/^S([A-E])$/);
		if (matches) {
			return matches[1];
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
		if ($cmd.match(/^\$B{1,2}/)) {
			return PricingCmdParser.parse($cmd);
		} else {
			return null;
		}
	}

	static parsePriceItineraryManually($cmd) {
		let matches;
		if (php.preg_match(/^(HH\$?PR)(.*?)\s*$/, $cmd, matches = [])) {
			const [_, baseCmd, modsStr] = matches;
			const mods = PricingCmdParser.parsePricingModifiers(modsStr);
			return {
				baseCmd: baseCmd,
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

	static parse_moreAirAvailability(cmd) {
		let match;
		if (!cmd.startsWith('A*')) {
			return null;
		}
		let modsPart = cmd.slice('A*'.length);
		if (modsPart === '') {
			return {action: 'nextPage'};
		} else if (match = modsPart.match(/^C(\d+)$/)) {
			return {action: 'showAllClasses', lineNumber: match[1]};
		} else {
			const data = {action: 'changeInput'};
			if (match = modsPart.match(/^(.*?)\|((?:[A-Z]{2}|[A-Z][0-9]|[0-9][A-Z])(?:\.[A-Z0-9]{2})*)$/)) {
				modsPart = match[1];
				data.airlines = match[2].split('.');
			}
			if (modsPart === 'J') {
				data.displayType = 'J';
			} else if (match = modsPart.match(/^(\d{1,2}[A-Z]{3}|)(\d{1,2}[APMN]|)$/)) {
				const [, date, time] = match;
				data.departureDate = !date ? undefined : {raw: date};
				data.departureTime = !time ? undefined : {raw: time};
			} else if (match = modsPart.match(/^O(\d{1,2}[A-Z]{3}|)(\d{1,2}[APMN]|)$/)) {
				const [, date, time] = match;
				data.returnDate = !date ? undefined : {raw: date};
				data.returnTime = !time ? undefined : {raw: time};
			} else if (match = modsPart.match(/^B([A-Z]{3})$/)) {
				data.departureAirport = match[1];
			} else if (match = modsPart.match(/^D([A-Z]{3})$/)) {
				data.destinationAirport = match[1];
			} else if (match = modsPart.match(/^X((?:[A-Z]{3})+)$/)) {
				data.connection = {raw: match[1]};
			} else if (match = modsPart.match(/^\|(-?\d+)$/)) {
				data.dayOffset = +match[1];
			} else if (modsPart !== '') {
				// unsupported modifier
				return null;
			}
			return data;
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
							field: $checkCmd,
							modifiers: $data,
						});
					} else {
						return null;
					}
				}
			}

			if (!php.empty($parts)) {
				return {
					cmd: $cmd,
					type: 'showPnrFields',
					data: $parts,
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
					cmd: $strCmd,
					type: null,
					data: null,
				};
				$parsedCommands.push($parseTillEnd);
				$strCmd = '';
			}
		}
		$firstCmd = php.array_shift($parsedCommands)
			|| {type: null, data: null};
		$firstCmd['followingCommands'] = $parsedCommands;
		return $firstCmd;
	}

	static parse($cmd) {
		$cmd = php.str_replace('+', '|', $cmd);
		$cmd = php.str_replace('\u00A4', '@', $cmd);
		return this.parseBulkCommand($cmd);
	}

	static parseSingleCommand(cmd) {
		let data, type, parsed;
		if (type = simpleTypeExact[cmd]) {
			data = null;
		} else if (data = this.parseArea(cmd)) {
			type = 'changeArea';
		} else if (data = this.parsePcc(cmd)) {
			type = 'changePcc';
		} else if (data = this.parsePriceItinerary(cmd)) { // TODO: optimize
			type = 'priceItinerary';
		} else if (data = this.parsePriceItineraryManually(cmd)) {
			type = 'priceItineraryManually';
		} else if (data = this.parseStorePricing(cmd)) {
			type = 'storePricing';
		} else if (data = this.parseSell(cmd)) {
			type = 'sell';
		} else if (data = this.parseDeletePnrField(cmd)) {
			type = 'deletePnrField';
		} else if (data = this.parseInsertSegments(cmd)) {
			type = 'insertSegments';
		} else if (data = parse_fareSearch(cmd)) {
			type = 'fareSearch';
		} else if (parsed = this.parseMpChange(cmd)) {
			type = parsed.type;
			data = parsed.data;
		} else if (parsed = parse_changeSeats(cmd)) {
			type = parsed.type;
			data = parsed.data;
		} else if (data = this.parseStorePnr(cmd)) {
			type = php.array_keys(php.array_filter({
				storePnrSendEmail: data.sendEmail,
				storeKeepPnr: data.keepPnr,
			}))[0] || 'storePnr';
		} else if (data = parse_airAvailability(cmd)) {
			type = 'airAvailability';
		} else if (data = this.parse_moreAirAvailability(cmd)) {
			type = 'moreAirAvailability';
		} else if (parsed = this.parseChainableCmd(cmd)) {
			return parsed;
		} else if (type = this.detectCommandType(cmd)) {
			data = null;
		} else if (parsed = this.parseShowPnrFieldsCmd(cmd)) {
			// for rest PNR fields we gave no explicit names to
			return parsed;
		} else {
			return null;
		}
		return {cmd: cmd, type: type, data: data};
	}
}

module.exports = CommandParser;
