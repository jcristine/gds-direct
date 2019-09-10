const CommonParserHelpers = require('../../Transpiled/Gds/Parsers/Apollo/CommonParserHelpers.js');
const RepriceInAnotherPccAction = require('../../Transpiled/Rbs/GdsDirect/Actions/Common/RepriceInAnotherPccAction.js');

const AliasParser = require('../../Transpiled/Rbs/GdsDirect/AliasParser.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const CommandParser = require('gds-utils/src/text_format_processing/apollo/commands/CmdParser.js');

//parse: A/T/20SEPNYCSFO/CHI/ATL/CLT/SEA/MSP+DL
const matchMultipleCityAvailabilityCmd = ($cmd) => {
	let $regex, $matches;
	$regex =
		'/^' +
		'(A\\/[A-Z]\\*?\\d?\\*?\\/\\d{1,2}[A-Z]{6})' +
		'([A-Z]{3}(?:\\/[A-Z]{3})+)' +
		'(\\|[A-Z\\d]{2}(?:\\.[A-Z\\d]{2})*)' +
		'$/';
	if (php.preg_match($regex, $cmd, $matches = [])) {
		const [_, availability, cityRow, airlines] = $matches;
		return {availability, cities: cityRow.split('/'), airlines};
	} else {
		return null;
	}
};

const extendPricingCmd = ($mainCmd, $newPart) => {
	let $mainParsed, $isFullCmd, $newParsed, $mainMods, $newMods, $rawMods;
	$mainParsed = CommandParser.parse($mainCmd);
	if ($mainParsed['type'] !== 'priceItinerary' || !$mainParsed['data']) {
		return null;
	}
	if (php.preg_match(/^\d/, $newPart)) {
		$newPart = 'S' + $newPart;
	}
	if (!$newPart.startsWith('$B')) {
		$isFullCmd = false;
		$newPart = $mainParsed['data']['baseCmd'] + '/' + $newPart;
	} else {
		$isFullCmd = true;
	}
	$newParsed = CommandParser.parse($newPart);
	if ($newParsed['type'] !== 'priceItinerary' || !$newParsed['data']) {
		return null;
	}
	$mainMods = php.array_combine(php.array_column($mainParsed['data']['pricingModifiers'], 'type'),
		$mainParsed['data']['pricingModifiers']);
	$newMods = php.array_combine(php.array_column($newParsed['data']['pricingModifiers'], 'type'),
		$newParsed['data']['pricingModifiers']);
	if (!$isFullCmd) {
		$newMods = php.array_merge($mainMods, $newMods);
	}
	$rawMods = php.array_column($newMods, 'raw');
	return $newParsed['data']['baseCmd'] + ($rawMods.length ? '/' + php.implode('/', $rawMods) : '');
};

exports.parse = async ($cmdRequested, stateful) => {
	let $realCmd, $data, $type, $moveDownAll, $matches, $_, $units, $value, $parts, $mainCmd, $followingCommands,
		$cmds, $segNumStr, $date, $cls, $result;
	$realCmd = $cmdRequested;
	$data = null;
	$type = null;
	if ($moveDownAll = AliasParser.parseMda($cmdRequested)) {
		$realCmd = $moveDownAll['realCmd'];
	}
	if (php.preg_match(/^(\$D.*)\*D([PF])(\d*\.?\d+)$/, $realCmd, $matches = [])) {
		[$_, $realCmd, $units, $value] = $matches;
		$type = 'fareSearchWithDecrease';
		$data = {
			'units': {
				'F': 'amount',
				'P': 'percent',
			}[$units],
			'value': $value,
		};
	} else if(/^\$D[BD][A-Z]{3}V$/.test($realCmd)) {
		$type = 'fareSearchValidatedChangeCity';
	} else if (php.preg_match(/^(\$D.*)\/MIX$/, $realCmd, $matches = [])) {
		$type = 'fareSearchMultiPcc';
		$realCmd = $matches[1];
	} else if (php.preg_match(/^\$B.*(&|\|\|)\S.*/, $realCmd)) {
		$parts = php.preg_split(/&|\|\|/, $realCmd);
		$mainCmd = php.array_shift($parts);
		$followingCommands = $parts.map(($cmdPart) =>
			extendPricingCmd($mainCmd, $cmdPart));
		if (!$followingCommands.some(cmd => !cmd)) {
			$type = 'multiPriceItinerary';
			$cmds = php.array_merge([$mainCmd], $followingCommands);
			$data = {'pricingCommands': $cmds};
		}
	} else if ($data = await AliasParser.parseStore($realCmd)) {
		$type = 'storePricing';
	} else if ($data = await AliasParser.parsePrice($realCmd, stateful)) {
		$type = 'priceAll';
	} else if ($data = AliasParser.parseRe($cmdRequested)) {
		$type = 'rebookInPcc';
	} else if ($data = matchMultipleCityAvailabilityCmd($realCmd)) {
		$type = 'multiDstAvail';
	} else if (php.preg_match(/^X(\d+[\|\-\d]*)\/0(\d{1,2}[A-Z]{3}|)\/?([A-Z]|)GK$/, $realCmd, $matches = [])) {
		$type = 'rebookAsGk';
		[$_, $segNumStr, $date, $cls] = $matches;
		$data = {
			'segmentNumbers': CommandParser.parseRange($segNumStr, '|', '-'),
			'departureDate': !$date ? null : {
				'raw': $date,
				'parsed': CommonParserHelpers.parsePartialDate($date),
			},
			'bookingClass': $cls || null,
		};
	} else if (php.preg_match(/^\/GK$/, $realCmd, $matches = [])) {
		$type = 'rebookAsGk';
		$data = {
			segmentNumbers: [],
			departureDate: null,
			bookingClass: null,
		};
	} else if (php.preg_match(/^\/SS(E?)$/, $realCmd, $matches = [])) {
		$type = 'rebookAsSs';
		$data = {
			'allowCutting': $matches[1] === 'E',
		};
	} else if ($result = RepriceInAnotherPccAction.parseAlias($realCmd)) {
		$type = 'priceInAnotherPcc';
		$realCmd = $result['cmd'];
		$data = {
			'target': $result['target'],
			'dialect': $result['dialect'],
		};
	}
	return {
		'realCmd': $realCmd,
		'moveDownAll': $moveDownAll,
		'data': $data,
		'type': $type,
	};
};
