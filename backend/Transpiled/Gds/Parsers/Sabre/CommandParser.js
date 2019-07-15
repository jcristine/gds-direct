const AvailCmdParser = require('./Commands/AvailCmdParser.js');
// namespace Gds\Parsers\Sabre;

const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const TariffCmdParser = require('../../../Gds/Parsers/Sabre/Commands/TariffCmdParser.js');

/**
 * takes terminal command typed by a user and returns it's type
 * when we need, it also could return data to, for example, convert it to Apollo command
 */
const php = require('../../../php.js');
const PricingCmdParser = require("./Commands/PricingCmdParser");

class CommandParser {
	static detectCommandType($cmd) {
		let $is, $startsWith, $regex, $pattern, $type, $name;
		$cmd = php.strtoupper($cmd);
		$is = {
			'PQ': 'storePricing',
			'*PQ': 'storedPricing',
			'*PQS': 'storedPricingNameData',
			'IR': 'ignoreKeepPnr',
			'I': 'ignore',
			'IA': 'ignore',
			'*B': 'requestedSeats',
			'*FF': 'frequentFlyerData',
			'*N': 'names',
			'*T': 'ticketing',
			'*P': 'passengerData',
			'*P3D': 'ssrDocGeneric',
			'*P4D': 'ssrDocNative',
			'*IA': 'airItinerary',
			'*IMSL': 'itineraryMarriage',
			'*A': 'allPnrFields',
			'VCT*': 'verifyConnectionTimes',
			'QXI': 'leaveQueue',
			'QR': 'removeFromQueue',
			'*HIA': 'airItineraryHistory',
			'VI*': 'flightServiceInfo', // meals/hidden stops/...
			'*FOP': 'formOfPayment',
			'*S*': 'workAreas',
			'JR': 'createLowFareSearchProfile',
			'JR*': 'redisplayLowFareSearchProfile',
			'JRP*': 'redisplayLowFareSearch',
			'JRC': 'cancelLowFareSearchProfile',
			'F': 'fileDividedBooking',
			'WPRDHELP': 'ruleDisplayHelp',
		};
		$startsWith = {
			'FQHELP': 'tariffDisplayHelp',
			'*H': 'history',
			'QC/': 'queueCount',
			'SI': 'signIn', // eg. SI*1234
			'SO': 'signOut',
			'WV*': 'voidList',
			'WV': 'exchangeTicket',
			'W¥': 'issueTickets',
			'WETRR': 'refundTicket',
			'4G': 'seatMap',
			'QP': 'movePnrToQueue',
			'Q': 'openQueue',
			'X': 'deletePnrField',
			'W\/TA': 'branchTo', // branch between pcc's set up
			'HB': 'createAgent',
			'H*CST': 'agentList', // full agent lists
			// >PE*6IIF
			'PE*': 'lniataList', // show all lniatas of pcc
			'PE¥': 'addEmail',
			'FQ': 'fareSearch',
			'WETR*': 'ticketMask', // show i-th ticket mask
			'WP*': 'redisplayPriceItinerary',
			'W\/*': 'decodeOrEncode', // decode airline or city
			'W\/-': 'decodeOrEncode', // encode airline or city
			'2': 'operationalInfo',
			'1*': 'moreAirAvailability',
			'1': 'airAvailability',
			'0': 'sell', // sell from availability
			'-': 'addName', // add passenger name
			'6': 'addReceivedFrom', // add RECEIVED FROM signature
			'7': 'addTicketingDateLimit', // add TAW
			'9': 'addAgencyPhone',
			'\u00A4': 'changeWorkArea',
			'T*QZX': 'showTime',
			'IC': 'ignoreAndCopyPnr',
			'JR.': 'lowFareSearch',
			'JR0': 'sellFromLowFareSearch',
			'RB': 'showBookingClassOfFare',
			'PQD': 'deleteStoredPricing',
			',': 'increaseSeatCount',
			'W-': 'addAddress',
			'OIATH': 'showSessionToken',
		};
		$regex = {
			[/^WP(.*¥)?NI/]: 'lowFareSearchFromPnr',
			[/^T[\[|¤].*/]: 'calculator',
			[/^\dDOCS.*/]: 'addSsrDocs',
			[/^\*R(\||$)/]: 'redisplayPnr',
			[/^\*I(\||$)/]: 'itinerary',
			[/^\*\d{1,3}(\||$)/]: 'displayPnrFromList',
			[/^(?:\/\d+){2}(?:[,-]\d+)*$/]: 'reorderSegments',
			[/^HR(12|24)$/]: 'setTimeFormat',
			[/^PE[\d,\-]*¤/]: 'changeEmail',
			[/^WC¥\d+.*$/]: 'sellFromLowFareSearch',
			[/^WC(A|\d+).*$/]: 'changeBookingClass',
			[/^3(\d+[-,\d]*)¤(.*)$/]: 'changeSsr',
			[/^4(\d+[-,\d]*)¤(.*)$/]: 'changeSsrNative',
			[/^RD(\d+).*$/]: 'fareRulesFromList', // get fare rules of i-th fare
			[/^\*PQ\d+$/]: 'storedPricingByNumber',
			[/^D\d+.*$/]: 'divideBooking',
		};
		$cmd = php.trim($cmd);
		for ([$pattern, $type] of Object.entries($is)) {
			if ($cmd === $pattern) {
				return $type;
			}
		}
		let startTuples = Object.entries($startsWith)
			// put longest start patterns first
			.sort((a,b) => b[0].length - a[0].length);
		for ([$pattern, $type] of startTuples) {
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

	static parseOpenPnr($cmd) {
		let $filter, $matches;
		$filter = /^\*([A-Z][A-Z0-9]{4,5})$/;
		if (php.preg_match($filter, $cmd, $matches = [])) {
			return $matches[1];
		} else {
			return null;
		}
	}

	// 'E', 'ER', 'EM¥N2.1¥RR¥PH', 'EWR', 'ER*N*T*FF', 'ECR'
	static parseStorePnr($cmd) {
		let $result, $textLeft, $rawModifiers, $emailCode, $actionData;
		$result = {'keepPnr': false, 'sendEmail': false, 'cloneItinerary': false};
		if (!StringUtil.startsWith($cmd, 'E')) {
			return null;
		}
		$textLeft = php.substr($cmd, 1);
		if (StringUtil.startsWith($textLeft, 'C')) {
			$result['cloneItinerary'] = true;
			$textLeft = php.substr($textLeft, 1);
			// $result['actionData'] = ['raw' => $textLeft];
			$textLeft = '';
		} else if (StringUtil.startsWith($textLeft, 'L')) {
			// $result['action'] = 'leaveOnQueue';
			$textLeft = php.substr($textLeft, 1);
		} else if (StringUtil.startsWith($textLeft, 'R')) {
			$result['keepPnr'] = true;
			$textLeft = php.substr($textLeft, 1);
		} else if (StringUtil.startsWith($textLeft, 'W')) {
			// $result['action'] = 'updateScheduleChanges';
			$textLeft = php.substr($textLeft, 1);
			if (StringUtil.startsWith($textLeft, 'R')) {
				$result['keepPnr'] = true;
				$textLeft = php.substr($textLeft, 1);
			}
			$result['actionParams'] = {'raw': $textLeft};
		} else if (StringUtil.startsWith($textLeft, 'M')) {
			$result['sendEmail'] = true;
			$textLeft = php.substr($textLeft, 1);
			$rawModifiers = php.explode('¥', $textLeft);
			$emailCode = php.array_shift($rawModifiers);
			if (StringUtil.endsWith($emailCode, 'R')) {
				$result['keepPnr'] = true;
				$emailCode = php.substr($emailCode, 0, -1);
			}
			$actionData = {
				'type': {
					'raw': $emailCode,
					'parsed': ({
						'': 'general',
						'I': 'invoice',
						'T': 'tickets',
						'X': 'pnrDump',
						'XP': 'pnrDumpPdf',
					} || {})[$emailCode],
				},
				'modifiers': Fp.map(($mod) => {
					return {'raw': $mod};
				}, $rawModifiers),
			};
			// $result['actionData'] = $actionData;
			$textLeft = '';
		}
		if ($textLeft) {
			$result['unparsed'] = $textLeft;
		}
		return $result;
	}

	static parseSearchPnr($cmd) {
		let $filter, $matches;
		$filter = '/' + php.implode('|', [
			// Not all formats are possible to display pnr
			'^\\*-.*',
			'^\\*[A-Z0-9]{2}\\d{1,4}[-\\\/].*',
			'^\\*[IL]?¥.*',
			'^\\*\\*\\d{1,3}-.*',
			'^\\*(?:TKT|PTA-|TOD-)\\d+.*',
		]) + '/';
		if (php.preg_match($filter, $cmd, $matches = [])) {
			return $matches[0];
		} else {
			return null;
		}
	}

	static parseArea($cmd) {
		let $filter, $matches;
		$filter = /^(?:\¤|\[)([A-F])$/;
		if (php.preg_match($filter, $cmd, $matches = [])) {
			return $matches[1];
		} else {
			return null;
		}
	}

	static parsePcc($cmd) {
		let $filter, $matches;
		$filter = /^AAA([A-Z0-9]{3,4})$/;
		if (php.preg_match($filter, $cmd, $matches = [])) {
			return $matches[1];
		} else {
			return null;
		}
	}

	static parseWprd($cmd) {
		let $command, $modsStr, $rawData;
		$command = php.substr($cmd, 0, 5);
		if ($command === 'WPRD*') {
			$modsStr = php.substr($cmd, 5);
			$rawData = $modsStr ? php.explode('¥', $modsStr) : [];
			return {'rawModifiers': $rawData};
		} else {
			return null;
		}
	}

	/** @param $expr = '3' || '9-12' || '9,12' || '1-3,6-8,12'; */
	static parseRemarkRanges($expr) {
		let $parseRange;
		if ($expr === '') {
			return [{'from': 1, 'to': 1}];
		}
		$parseRange = ($text) => {
			let $pair;
			$pair = php.explode('-', $text);
			return {'from': $pair[0], 'to': $pair[1] || $pair[0]};
		};
		return Fp.map($parseRange, php.explode(',', php.trim($expr)));
	}

	// '1.1', '3.1', '1.1-4.1', '1.1-1.3,1.5-2.3,3.2-4.0'
	static parsePaxRanges($expr) {
		let $parseRange;
		$parseRange = ($text) => {
			let $pair, $from, $fromFNum, $to, $toFNum;
			$pair = php.explode('-', $text);
			[$from, $fromFNum] = php.explode('.', $pair[0]);
			[$to, $toFNum] = php.explode('.', $pair[1] || $pair[0]);
			return {
				'from': $from, 'fromMinor': $fromFNum,
				'to': $to, 'toMinor': $toFNum,
			};
		};
		return Fp.map($parseRange, php.explode(',', php.trim($expr)));
	}

	static flattenRange($expr) {
		let $parseRange;
		if (!$expr) {
			return [];
		}
		$parseRange = ($text) => {
			let $pair;
			$pair = php.explode('-', $text);
			return php.range($pair[0], $pair[1] || $pair[0]);
		};
		return Fp.flatten(Fp.map($parseRange, php.explode(',', php.trim($expr))));
	}

	/**
	 * '513TESt¤TEST' => 'addRemark',
	 * '513¤TEST' => 'changePnrRemarks',
	 * '5TEST' => 'addRemark',
	 * '5¤TEST' => 'changePnrRemarks',
	 */
	static parseRemarkCmd($cmd) {
		let $content, $matches, $_, $rangesRaw, $newText, $type, $data;
		if (StringUtil.startsWith($cmd, '5')) {
			$content = php.substr($cmd, 1);
			if (php.preg_match(/^([-,\d]+|)¤(.*)$/, $content, $matches = [])) {
				[$_, $rangesRaw, $newText] = $matches;
				$type = 'changePnrRemarks';
				$data = {
					'ranges': this.parseRemarkRanges($rangesRaw),
					'newText': $newText,
				};
			} else {
				// '5ELDAR/ID20744/CREATED FOR VANCE/ID8122/REQ. ID-4777760'
				$type = 'addRemark';
				$data = $content;
			}
			return {'type': $type, 'data': $data};
		} else {
			return null;
		}
	}

	// 'FFUA12345678910-1.1', 'FFUA12345678910/LH-1.1', 'FF¤ALL', 'FFLH992006441415400'
	// 'FF1¤UA5522123', 'FF1¤UA5522123-3.1', 'FFAA987654321/CX,AS,EI,QF-2.2',
	// 'FFAA987654321/1,2-2.3', 'FFAA987654321/CX-HOFFMAN/REICHE', 'FF1,3¤'
	static parseFfChange($cmd) {
		let $regex, $matches;
		$regex =
			'/^FF' +
			'(' +
			'(?<lineNums>\\d+[-,\\d]*|)' +
			'(?<pillow>\u00A4)' +
			')?' +
			'(' +
			'|' +
			'ALL' +
			'|' +
			'(?<airline>[A-Z0-9]{2})' +
			'(?<code>[A-Z0-9]+)' +
			'(\/' +
			'(?<partners>[A-Z0-9]{2}(,[A-Z0-9]{2})*|)' +
			'(?<segNums>\\d+[-,\\d]*|)' +
			')?' +
			'(-(' +
			'(?<majorPaxNum>\\d+)\\.' +
			'(?<minorPaxNum>\\d+)' +
			'|' +
			'(?<paxName>[A-Z].*\\\/.*)' +
			'))?' +
			')' +
			'$/';
		if (php.preg_match($regex, $cmd, $matches = [])) {
			return {
				'type': php.empty($matches['pillow'])
					? 'addFrequentFlyerNumber'
					: 'changeFrequentFlyerNumber',
				'data': {
					'lineNums': this.flattenRange($matches['lineNums'] || ''),
					'airline': $matches['airline'] || '',
					'code': $matches['code'] || '',
					'partners': php.empty($matches['partners']) ? [] :
						php.explode(',', $matches['partners']),
					'segNums': this.flattenRange($matches['segNums'] || ''),
					'majorPaxNum': $matches['majorPaxNum'] || '',
					'minorPaxNum': $matches['minorPaxNum'] || '',
					'paxName': $matches['paxName'] || '',
				},
			};
		} else {
			return null;
		}
	}

	// '4GXALL', '4GX1/25AB', '4G2,3/2EF-1.1-1.2', '4G2,3/2EF-2.1,1.1'
	static parseSeatChange($cmd) {
		let $regex, $matches, $seatCodesStr, $seatMatches, $seatCodes, $_, $rowNumber, $letters, $letter, $segNums;
		$regex =
			'/^4G' +
			'(?<cancelMark>X|)' +
			'(?<segNums>\\d+[,\\d]*|A|ALL|)' +
			'(\\\/(?<location>[AWX]))?' +
			'(\\\/(?<seatCodes>(\\d+[A-Z]+)+))?' +
			'(-(?<paxNums>\\d+\\.\\d+([-,]\\d+\\.\\d+)*))?' +
			'$/';
		if (php.preg_match($regex, $cmd, $matches = [])) {
			$seatCodesStr = $matches['seatCodes'] || '';
			php.preg_match_all(/(\d+)([A-Z]+)/, $seatCodesStr, $seatMatches = [], php.PREG_SET_ORDER);
			$seatCodes = [];
			for ([$_, $rowNumber, $letters] of Object.values($seatMatches || {})) {
				for ($letter of Object.values(php.str_split($letters, 1))) {
					$seatCodes.push($rowNumber + $letter);
				}
			}
			if (php.in_array($matches['segNums'], ['A', 'ALL'])) {
				$segNums = []; // all
			} else {
				$segNums = this.flattenRange($matches['segNums']);
			}
			return {
				'type': php.empty($matches['cancelMark'])
					? 'requestSeats' : 'cancelSeats',
				'data': {
					'paxRanges': php.empty($matches['paxNums']) ? [] :
						this.parsePaxRanges($matches['paxNums']),
					'segNums': $segNums,
					'location': php.empty($matches['location']) ? null : {
						'raw': $matches['location'],
						'parsed': ({'A': 'aisle', 'W': 'window', 'X': 'bulkhead'} || {})[$matches['location']],
					},
					'zone': null,
					'seatCodes': $seatCodes,
				},
			};
		} else {
			return null;
		}
	}

	/**
	 * does not support all possible formats yet
	 * note that there is also an unrelated format
	 * starting with WC for selling from WPNI - WC¥1
	 * 'WC1-3B' - change segments 1-3 class to B
	 * 'WC2B/3N' - change segment 2 class to B and segment 3 class to N
	 * 'WCAF' - change class of all segments to F
	 */
	static parseChangeBookingClasses(cmd) {
		if (!cmd.startsWith('WC')) {
			return null;
		}
		let selection = cmd.slice('WC'.length);
		let segments = [];
		for (let rangeStr of selection.split('/')) {
			let matches = rangeStr.match(/^(\d+)(-\d+|)([A-Z])$/);
			if (!matches) {
				return null;
			}
			let [_, from, to, cls] = matches;
			to = to ? -to : from; // -1 x -1 = +1, problem?
			for (let i = +from; i <= to; ++i) {
				segments.push({segmentNumber: i, bookingClass: cls});
			}
		}
		return {
			segments: segments,
		};
	}

	static parseBulkCommand($cmd) {
		let $parsedCommands, $strCmd, $exploded, $key, $command, $parsed, $firstCmd;
		$parsedCommands = [];
		$strCmd = $cmd;
		$exploded = php.explode('\u00A7', $strCmd);
		for ([$key, $command] of Object.entries($exploded)) {
			$parsed = this.parseSingleCommand($command) || {
				'type': null,
				'data': null,
			};
			$parsed['cmd'] = $command;
			$parsedCommands.push($parsed);
		}
		$firstCmd = php.array_shift($parsedCommands) || {'type': null, 'data': null};
		$firstCmd['followingCommands'] = $parsedCommands;
		return $firstCmd;
	}

	/** @param {String} $cmd */
	static parse($cmd) {
		return this.parseBulkCommand($cmd);
	}

	static parseSingleCommand($cmd) {
		let $data, $type, $parsed, $matches;
		if ($data = this.parseOpenPnr($cmd)) {
			$type = 'openPnr';
		} else if ($data = this.parseArea($cmd)) {
			$type = 'changeArea';
		} else if ($data = this.parsePcc($cmd)) {
			$type = 'changePcc';
		} else if ($data = this.parseSearchPnr($cmd)) {
			$type = 'searchPnr';
		} else if ($data = this.parseWprd($cmd)) {
			$type = 'fareList';
		} else if ($data = TariffCmdParser.parse($cmd)) {
			$type = 'fareSearch';
		} else if ($data = AvailCmdParser.parse($cmd)) {
			$type = 'airAvailability';
		} else if ($parsed = this.parseRemarkCmd($cmd)) {
			$type = $parsed['type'];
			$data = $parsed['data'];
		} else if ($data = this.parseStorePnr($cmd)) {
			$type = (php.array_keys(php.array_filter({
				'storePnrSendEmail': $data['sendEmail'],
				'storeKeepPnr': $data['keepPnr'],
				'storeAndCopyPnr': $data['cloneItinerary'],
			})) || {})[0] || 'storePnr';
		} else if ($parsed = this.parseFfChange($cmd)) {
			$type = $parsed['type'];
			$data = $parsed['data'];
		} else if ($parsed = this.parseSeatChange($cmd)) {
			$type = $parsed['type'];
			$data = $parsed['data'];
		} else if ($data = this.parseChangeBookingClasses($cmd)) {
			$type = 'changeBookingClass';
		} else if (php.preg_match(/^DK(.+)$/, $cmd, $matches = [])) {
			$type = 'addDkNumber';
			$data = $matches[1];
		} else if ($type = this.detectCommandType($cmd)) {
			$data = null;
		} else if ($data = PricingCmdParser.parse($cmd)) {
			// Sabre's pricing command starts with WP, but since there are a lot of
			// other Sabre commands that start with WP, like WPRD* or WPNI, we should
			// match command as "priceItinerary" only if none of the other matched
			$type = 'priceItinerary';
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
