

const ArrayUtil = require('../../../Lib/Utils/ArrayUtil.js');
const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const Lexeme = require('gds-utils/src/lexer/Lexeme.js');
const Lexer = require('gds-utils/src/lexer/Lexer.js');
const CommonParserHelpers = require('../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const FqCmdParser = require('../../../Gds/Parsers/Galileo/Commands/FqCmdParser.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
const TariffCmdParser = require("./Commands/TariffCmdParser");
class CommandParser
{
	static detectCommandType($cmd)  {
		let $is, $regex, $startsWith, $pattern, $type, $name, $starts;

		$cmd = php.strtoupper($cmd);

		$is = {
			'OP/W*': 'workAreas',
			'MT': 'moveTop',
			'MB': 'moveBottom',
			'MR': 'moveRest',
			'P-*ALL': 'printPnr',
			'Y': 'sell', // an ARNK segment
			'I': 'ignore',
			'IR': 'ignoreKeepPnr',
			'E': 'storePnr',
			'ER': 'storeKeepPnr',
			'*R': 'redisplayPnr',
			'*I': 'itinerary',
			'*IA': 'airItinerary',
			'*MM': 'frequentFlyerData',
			'FQ*': 'redisplayPriceItinerary',
			'FQA*': 'redisplayPriceItinerary',
			'FQBB*': 'redisplayPriceItinerary',
			'FQBA*': 'redisplayPriceItinerary',
			'FQBBK*': 'redisplayPriceItinerary',
			'*HTE': 'ticketList',
		};

		$regex = {
			[/^\*\d+$/]: 'displayPnrFromList',
			[/^FN\d+$/]: 'fareRulesMenu',
			[/^FN\d+[\*\/].*/]: 'fareRules',
			[/^FQP[^0-9]/]: 'fareQuotePlanner',
			[/^FSK\d+$/]: 'sellFromLowFareSearch',
			['/^('+php.implode('|', [
				'MORE\\*\\d+',// (VIEW MORE ITINERARIES WITHIN AN OPTION)
				'FS\\*\\d+',// (VIEW FARE DETAIL DISPLAY)
				'FSOF\\d+', // (VIEW ADDITIONAL FEE DISPLAY)
				'FSMORE',// (VIEW ADDITIONAL PRICING OPTIONS)
				'FS-', // (RETURN TO PREVIOUS SCREEN)
			])+')$/']: 'lowFareSearchNavigation',
			[/^FS.*/]: 'lowFareSearch',
			[/^E[A-Z]*M.*/]: 'storePnrSendEmail',

			[/^P\.[^@]*$/]: 'addAgencyPhone',
			[/^R\.[^@]*$/]: 'addReceivedFrom',
			[/^N\.[^@]*$/]: 'addName',
			[/^T\.[^@]*$/]: 'addTicketingDateLimit',
			[/^W\.[^@]*$/]: 'addAddress',
			[/^NP\.[^@]*$/]: 'addRemark',
			[/^SI\.[^@]*$/]: 'addSsr',
			[/^F\.[^@]*$/]: 'addFormOfPayment',

			[/^P\..*@.*$/]: 'changeAgencyPhone',
			[/^R\..*@.*$/]: 'changeReceivedFrom',
			[/^N\..*@.*$/]: 'changeName',
			[/^T\..*@.*$/]: 'changeTicketingDateLimit',
			[/^W\..*@.*$/]: 'changeAddress',
			[/^SI\..*@.*$/]: 'cancelSsr',
			[/^F\..*@.*$/]: 'changeFormOfPayment',
		};

		$startsWith = {
			'CAL': 'carAvailability',
			'CAU': 'updateCarAvailabilityParams',
			'CAI': 'carVendors',
			'CAD': 'carDescription',
			'CAM': 'modifyCarSegment',
			'CAV': 'carRules',
			'HOI': 'hotels',
			'HOC': 'hotelCompleteAvailability',
			'HOU': 'updateHotelAvailabilityParams',
			'HOV': 'hotelRules',
			'HOD': 'hotelDescription',
			'HOM': 'modifyHotelSegment',
			'FD*': 'fareRulesMenuFromTariff',
			'FN*': 'fareRulesFromMenu',
			'FDC*': 'showBookingClassOfFare',
			'FR*': 'routingFromTariff',
			'FQL': 'fareQuoteLadder',
			'FQN': 'fareList',
			'F*Q': 'pricingLinearFare',
			'FZ': 'convertCurrency',

			'C*': 'agencyProfile',
			'CM': 'moveAgencyProfile',
			'SON': 'signIn',
			'SAI': 'signIn',
			'SOF': 'signOut',
			'SAO': 'signOut',
			'SDA': 'agentList',
			'STD': 'createAgent',
			'H/': 'help',
			'HELP': 'help',
			'GG*': 'helpIndex',
			'.CE': 'encodeCity',
			'.CD': 'decodeCity',
			'.LE': 'encodeCountry',
			'.LD': 'decodeCountry',
			'.AE': 'encodeAirline',
			'.AD': 'decodeAirline',
			'.EE': 'encodeAircraft',
			'.ED': 'decodeAircraft',
			'GC*': 'encodeOrDecodeHotelOrCar',
			'MU': 'moveUp',
			'MD': 'moveDown',
			'XX': 'calculator',
			'X': 'deletePnrField',
			'TT': 'timeTable',
			'L@': 'operationalInfo',
			'TI-': 'visaAndHealthInfo',
			'FTAX': 'taxInfo',
			'DCT': 'minConnectionTimeTable',
			'HOR': 'referencePoints',
			'SM*': 'seatMap',

			'QC': 'queueCount',
			'QX': 'leaveQueue',
			'QR': 'removeFromQueue',
			'QEB': 'movePnrToQueue',
			'QPRINT': 'printAllPnrsOnQueue',
			'QEM/': 'sendToMessageQueue',
			'Q/': 'openQueue',
			'*-': 'searchPnr',
			'**': 'searchPnr',
			'*H': 'history',
			'*SVC': 'flightServiceInfo',
			'*SD': 'requestedSeats',
			'SA*S': 'seatMap',
			'*FF': 'storedPricing',
			'*TE': 'ticketMask',
			'RE': 'storeAndCopyPnr',

			'TKP': 'issueTickets',
			'TMU': 'changeTickets',
			'TRV': 'voidTicket',
			'TKV': 'voidTicket',
			'TRU': 'unvoidPaperTicket',
			'TRN': 'refundTicket',
			'TRA': 'refundTicket',
			'TKR': 'revalidateTicket',

			'FF': 'storePricing',
			'/': 'setNextFollowsSegment',
			'0': 'sell',
			'N': 'sell',
			'@': 'rebook', // change segment status, seat count, booking class
		};

		$cmd = php.trim($cmd);
		for ([$pattern, $type] of Object.entries($is)) {
			if ($cmd === $pattern) {
				return $type;
			}}

		for ([$pattern, $name] of Object.entries($regex)) {
			if (php.preg_match($pattern, $cmd)) {
				return $name;
			}}

		$starts = php.array_keys($startsWith);
		$starts = Fp.sortBy(a => php.mb_strlen(a), $starts, true); // longest matched first
		for ($pattern of Object.values($starts)) {
			$type = $startsWith[$pattern];
			if (StringUtil.startsWith($cmd, $pattern)) {
				return $type;
			}}

		return null;
	}

	// 'SEM/69KS/AG'
	static parseSem($cmd)  {
		let $matches;

		if (php.preg_match(/^SEM\/([A-Z0-9]{3,4})\/(\S.*?)\s*$/, $cmd, $matches = [])) {
			return {pcc: $matches[1], dutyCode: $matches[2]};
		} else {
			return null;
		}
	}

	// 'SC', 'SA'
	static parseChangeArea($cmd)  {
		let $matches;

		if (php.preg_match(/^S([A-Z])(\/.*)?$/, $cmd, $matches = [])) {
			return {area: $matches[1]};
		} else {
			return null;
		}
	}

	static parseOpenPnr($cmd)  {
		let $matches;

		if (php.preg_match(/^\*([A-Z0-9]{6})$/, $cmd, $matches = [])) {
			return {recordLocator: $matches[1]};
		} else {
			return null;
		}
	}

	static parseAirAvailability($cmd)  {
		let $regex, $getFirst, $onlyRaw, $lexer, $matches, $flags, $lexed;

		$regex =
            '/^A'+
            '(?<preFlags>[A-Z]{0,2})'+
            '('+
                '(?<departureDate>\\d{1,2}[A-Z]{3}\\d{0,2})'+
                '(?<postFlags>[A-Z]{0,2})'+
            ')?'+
            '('+
                '(?<departureAirport>[A-Z]{3})?'+
                '(?<destinationAirport>[A-Z]{3})'+
            ')?'+
            '(?<modsPart>[^A-Z0-9].*|)'+
            '$/';
		$getFirst = ($matches) => ({raw: $matches[0], parsed: $matches[1]});
		$onlyRaw = ($matches) => ({raw: $matches[0], parsed: null});
		$lexer = new Lexer([
			(new Lexeme('connection', /^\.?\d{1,4}[APNM]?(\.[A-Z]{3}-?)?(\.[A-Z]{3}-?)?/)).preprocessData($onlyRaw),
			(new Lexeme('airlines', /^(\/[A-Z0-9]{2}[-\#]?)+/)).preprocessData($onlyRaw),
			(new Lexeme('numberOfStops', /^\.D(\d)/)).preprocessData($getFirst),
			(new Lexeme('directLink', /^\*([A-Z0-9]{2})/)).preprocessData($getFirst),
			(new Lexeme('bookingClass', /^@(\d*)([A-Z])/)).preprocessData(($matches) => ({
				raw: $matches[0], parsed: {
					seatCount: $matches[1],
					bookingClass: $matches[2],
				},
			})),
			(new Lexeme('allianceCode', /^\/\/\*([A-Z])/)).preprocessData($getFirst),
		]);
		if (php.preg_match($regex, $cmd, $matches = [])) {
			$flags = php.array_filter(php.str_split($matches['preFlags']+($matches['postFlags'] || '')));
			$lexed = $lexer.lex($matches['modsPart']);
			return {
				isReturn: php.in_array('R', $flags),
				orderBy: ArrayUtil.getLast(Fp.filter(($flag) => $flag !== 'R', $flags)),
				departureDate: php.empty($matches['departureDate']) ? null : {
					raw: $matches['departureDate'],
					parsed: CommonParserHelpers.parsePartialDate($matches['departureDate']),
				},
				departureAirport: $matches['departureAirport'] || '',
				destinationAirport: $matches['destinationAirport'] || '',
				modifiers: Fp.map(($rec) => ({
					type: $rec['lexeme'], raw: $rec['data']['raw'], parsed: $rec['data']['parsed'],
				}), $lexed['lexemes']),
				unparsed: $lexed['text'],
			};
		} else {
			return null;
		}
	}

	static parsePriceItinerary($cmd)  {
		return FqCmdParser.parse($cmd);
	}

	/** @param $expr = '3' || '9-12' || '9.12' || '1-3.6-8.12'; */
	static parseRemarkRanges($expr)  {
		let $parseRange;

		$parseRange = ($text) => {
			let $pair;

			$pair = php.explode('-', $text);
			return {from: $pair[0], to: $pair[1] || $pair[0]};
		};
		return Fp.map($parseRange, php.explode('.', php.trim($expr)));
	}

	static flattenRange($expr)  {
		let $parseRange;

		if (!$expr) {
			return [];
		}
		$parseRange = ($text) => {
			let $pair;

			$pair = php.explode('-', $text);
			return php.range($pair[0], $pair[1] || $pair[0]);
		};
		return Fp.flatten(Fp.map($parseRange, php.explode('.', php.trim($expr))));
	}

	static parseChangePnrRemarks($cmd)  {
		let $matches, $_, $rangesRaw, $newText;

		if (php.preg_match(/^NP\.(\d+[\d-.]*|)@(.*)$/, $cmd, $matches = [])) {
			[$_, $rangesRaw, $newText] = $matches;
			return {
				ranges: this.parseRemarkRanges($rangesRaw),
				newText: $newText,
			};
		} else {
			return null;
		}
	}

	// 'UA12345876490/BD/LH/AC', 'AA423188DLM', 'UA/TG/SK'
	static parseMmAir($airPart)  {
		let $mathces, $_, $air, $code, $partnerPart;

		if (php.preg_match(/^([A-Z0-9]{2})([A-Z0-9]*)((\/[A-Z0-9]{2})+|)$/, $airPart, $mathces = [])) {
			[$_, $air, $code, $partnerPart] = $mathces;
			return {
				airline: $air,
				code: $code,
				partners: !$partnerPart ? [] :
					php.explode('/', php.ltrim($partnerPart, '/')),
			};
		} else {
			return null;
		}
	}

	// 'M.P2/TW123456LRG-AA423188DLM', 'M.P1/UA12345876490/BD/LH/AC', 'M.P2*UA/TG/SK'
	static parseAddFrequentFlyerNumber($cmd)  {
		let $regex, $matches, $airParts, $mmAirs;

		$regex =
            '/^M\\.'+
            '(P(?<majorPaxNum>\\d+)(?<crossAccrual>[\\\/\\*]))?'+
            '(?<airPart>.*)'+
            '$/';
		if (php.preg_match($regex, $cmd, $matches = [])) {
			$airParts = php.explode('-', $matches['airPart']);
			$mmAirs = php.array_map((...args) => this.parseMmAir(...args), $airParts);
			if (Fp.any('is_null', $mmAirs)) {
				return null;
			} else {
				return {
					majorPaxNum: $matches['majorPaxNum'] || '',
					isCrossAccrual: ($matches['crossAccrual'] || '') === '*',
					mileagePrograms: $mmAirs,
				};
			}
		} else {
			return null;
		}
	}

	// 'P2*AA', 'P2', 'AA', 'P1*KL/UK/NW'
	static parseMmChangePax($paxPart)  {
		let $regex, $matches, $partnersPart;

		$regex =
            '/^'+
            '(P(?<majorPaxNum>\\d+)\\*?)?'+
            '('+
                '(?<airline>[A-Z0-9]{2})'+
                '(?<partners>(\\\/[A-Z0-9]{2})+|\\\/ALL|)'+
            ')?'+
            '$/';
		if (php.preg_match($regex, $paxPart, $matches = [])) {
			$partnersPart = $matches['partners'] || '';
			return {
				majorPaxNum: $matches['majorPaxNum'] || '',
				airline: $matches['airline'] || '',
				withAllPartners: $partnersPart === '/ALL',
				partners: php.in_array($partnersPart, ['', '/ALL']) ? [] :
					php.explode('/', php.ltrim($matches['partners'], '/')),
			};
		} else {
			return null;
		}
	}

	// 'M.@', 'M.P2@', 'M.AA@', 'M.P1*DL@', 'M.P1*DL/P2*AA@', 'M.P1*KL/UK/NW@', 'M.P2*UA/ALL@'
	static parseChangeFrequentFlyerNumber($cmd)  {
		let $matches, $paxPart, $paxParts, $paxes;

		if (php.preg_match(/^M\.(.*)@$/, $cmd, $matches = [])) {
			$paxPart = $matches[1];
			$paxParts = !$paxPart ? [] : $paxPart.split(/\/(?=P\d+\*)/);
			$paxes = php.array_map((...args) => this.parseMmChangePax(...args), $paxParts);
			if (Fp.any('is_null', $paxes)) {
				return null;
			} else {
				return {passengers: $paxes};
			}
		} else {
			return null;
		}
	}

	// 'S.S2/17A/18C', 'S.P2S1@', 'S.P1-4S2@', 'S.P1S2/NW', 'S.S1.2/NA'
	static parseSeatChange($cmd)  {
		let $regex, $matches, $seatCodesStr, $seatCodeGroups, $seatCodes, $group, $seatMatches, $_, $rowNumber, $letters, $letter, $paxNums, $segNums;

		$regex =
            '/^S\\.'+
            '(P(?<paxNums>\\d+[-.\\d]*))?'+
            '(S(?<segNums>\\d+[-.\\d]*))?'+
            '(\\\/?N(?<location>[AWB]))?'+
            '(?<seatCodes>(\\\/\\d+[A-Z](\\.[A-Z])*)*)'+
            '(?<changeMark>@|)'+
            '$/';
		if (php.preg_match($regex, $cmd, $matches = [])) {
			$seatCodesStr = php.ltrim($matches['seatCodes'] || '', '/');
			$seatCodeGroups = $seatCodesStr ? php.explode('/', $seatCodesStr) : [];
			$seatCodes = [];
			for ($group of Object.values($seatCodeGroups)) {
				php.preg_match_all(/(\d+)([A-Z](\.[A-Z])*)/, $group, $seatMatches = [], php.PREG_SET_ORDER);
				for ([$_, $rowNumber, $letters] of Object.values($seatMatches)) {
					for ($letter of Object.values(php.explode('.', $letters))) {
						$seatCodes.push($rowNumber+$letter);}}}
			$paxNums = this.flattenRange($matches['paxNums'] || '');
			$segNums = this.flattenRange($matches['segNums'] || '');
			return {
				type: $matches['changeMark'] === '@'
					? 'cancelSeats' : 'requestSeats',
				data: {
					paxRanges: Fp.map(($num) => ({
						from: $num, fromMinor: null,
						to: $num, toMinor: null,
					}), $paxNums),
					segNums: $segNums,
					location: php.empty($matches['location']) ? null : {
						raw: $matches['location'],
						parsed: ({A: 'aisle', W: 'window', B: 'bulkhead'} || {})[$matches['location']],
					},
					zone: null,
					seatCodes: $seatCodes,
				},
			};
		} else {
			return null;
		}
	}

	static parseSingleCommand($cmd)  {
		let $data, $type, $parsed;

		if ($data = this.parseSem($cmd)) {
			$type = 'changePcc';
		} else if ($data = this.parseChangeArea($cmd)) {
			$type = 'changeArea';
		} else if ($data = this.parseOpenPnr($cmd)) {
			$type = 'openPnr';
		} else if ($data = this.parseAirAvailability($cmd)) {
			$type = 'airAvailability';
		} else if ($data = TariffCmdParser.parse($cmd)) {
			$type = 'fareSearch';
		} else if ($data = this.parseChangePnrRemarks($cmd)) {
			$type = 'changePnrRemarks';
		} else if ($data = this.parseAddFrequentFlyerNumber($cmd)) {
			$type = 'addFrequentFlyerNumber';
		} else if ($data = this.parseChangeFrequentFlyerNumber($cmd)) {
			$type = 'changeFrequentFlyerNumber';
		} else if ($parsed = this.parseSeatChange($cmd)) {
			$type = $parsed['type'];
			$data = $parsed['data'];
		} else if ($type = this.detectCommandType($cmd)) {
			$data = null;
		} else if ($data = this.parsePriceItinerary($cmd)) {
			// must be at the very bottom, since there are many
			// commands in Galileo that start with FQ: FQP, FQN, FQL...
			$type = 'priceItinerary';
		} else {
			$data = null;
			$type = null;
		}
		return {
			cmd: $cmd,
			type: $type,
			data: $data,
		};
	}

	static parse($cmd)  {
		let $flatCmds, $parsed;

		// 'T.TAU/19APR|R.KINGSLEY|ER' -> ['T.TAU/19APR', 'R.KINGSLEY', 'ER']
		// 'FQBB||-AB' -> ['FQBB||-AB']
		const subCmds = $cmd.split(/(?<!\|)\|(?!\|)/g);
		$flatCmds = subCmds.map(subCmd => this.parseSingleCommand(subCmd));
		$parsed = $flatCmds.shift();
		$parsed['followingCommands'] = $flatCmds;
		return $parsed;
	}
}
module.exports = CommandParser;
