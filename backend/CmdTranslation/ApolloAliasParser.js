const Rej = require('klesun-node-tools/src/Rej.js');
const ParserUtil = require('gds-utils/src/text_format_processing/agnostic/ParserUtil.js');
const RepriceInAnotherPccAction = require('../Transpiled/Rbs/GdsDirect/Actions/Common/RepriceInAnotherPccAction.js');

const ApolloAliasParser = require('./AliasParser.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const CommandParser = require('gds-utils/src/text_format_processing/apollo/commands/CmdParser.js');

//parse: A/T/20SEPNYCSFO/CHI/ATL/CLT/SEA/MSP+DL
const matchMultipleCityAvailabilityCmd = (cmd) => {
	const regex =
		'/^' +
		'(A\\/[A-Z]\\*?\\d?\\*?\\/\\d{1,2}[A-Z]{6})' +
		'([A-Z]{3}(?:\\/[A-Z]{3})+)' +
		'(\\|[A-Z\\d]{2}(?:\\.[A-Z\\d]{2})*)' +
		'$/';
	let matches;
	if (php.preg_match(regex, cmd, matches = [])) {
		const [_, availability, cityRow, airlines] = matches;
		return {availability, cities: cityRow.split('/'), airlines};
	} else {
		return null;
	}
};

const extendPricingCmd = ($mainCmd, $newPart) => {
	const mainParsed = CommandParser.parse($mainCmd);
	if (mainParsed.type !== 'priceItinerary' || !mainParsed.data) {
		return null;
	}
	if (php.preg_match(/^\d/, $newPart)) {
		$newPart = 'S' + $newPart;
	}
	let isFullCmd;
	if (!$newPart.startsWith('$B')) {
		isFullCmd = false;
		$newPart = mainParsed.data.baseCmd + '/' + $newPart;
	} else {
		isFullCmd = true;
	}
	const newParsed = CommandParser.parse($newPart);
	if (newParsed.type !== 'priceItinerary' || !newParsed.data) {
		return null;
	}
	const mainMods = php.array_combine(php.array_column(mainParsed.data.pricingModifiers, 'type'),
		mainParsed.data.pricingModifiers);
	let newMods = php.array_combine(php.array_column(newParsed.data.pricingModifiers, 'type'),
		newParsed.data.pricingModifiers);
	if (!isFullCmd) {
		newMods = php.array_merge(mainMods, newMods);
	}
	const rawMods = php.array_column(newMods, 'raw');
	return newParsed.data.baseCmd + (rawMods.length ? '/' + rawMods.join('/') : '');
};

exports.parse = async (cmdRequested, stateful, PtcUtil = require('../Transpiled/Rbs/Process/Common/PtcUtil.js')) => {
	let realCmd = cmdRequested;
	let data = null;
	let type = null;
	const moveDownAll = ApolloAliasParser.parseMda(cmdRequested);
	if (moveDownAll) {
		realCmd = moveDownAll.realCmd;
	}
	let matches, result;
	if (php.preg_match(/^(\$D.*)\*D([PF])(\d*\.?\d+)$/, realCmd, matches = [])) {
		let units, value;
		[, realCmd, units, value] = matches;
		type = 'fareSearchWithDecrease';
		data = {
			units: {
				'F': 'amount',
				'P': 'percent',
			}[units],
			value: value,
		};
	} else if (/^\$D[BD][A-Z]{3}V$/.test(realCmd)) {
		type = 'fareSearchValidatedChangeCity';
	} else if (php.preg_match(/^(\$D.*)\/MIX$/, realCmd, matches = [])) {
		type = 'fareSearchMultiPcc';
		realCmd = matches[1];
	} else if (php.preg_match(/^\$B.*(&|\|\|)\S.*/, realCmd)) {
		const parts = php.preg_split(/&|\|\|/, realCmd);
		const mainCmd = parts.shift();
		const followingCommands = parts.map(($cmdPart) =>
			extendPricingCmd(mainCmd, $cmdPart));
		if (!followingCommands.some(cmd => !cmd)) {
			type = 'multiPriceItinerary';
			const cmds = [mainCmd, ...followingCommands];
			data = {'pricingCommands': cmds};
		}
	} else if (data = await ApolloAliasParser.parseStore(realCmd, PtcUtil)) {
		type = 'storePricing';
	} else if (data = await ApolloAliasParser.parsePrice(realCmd, stateful)) {
		type = 'priceAll';
	} else if (data = ApolloAliasParser.parseRe(cmdRequested)) {
		type = 'rebookInPcc';
	} else if (data = matchMultipleCityAvailabilityCmd(realCmd)) {
		type = 'multiDstAvail';
	} else if (php.preg_match(/^X(\d+[\|\-\d]*)\/0(\d{1,2}[A-Z]{3}|)\/?([A-Z]|)GK$/, realCmd, matches = [])) {
		type = 'rebookAsGk';
		const [, segNumStr, date, cls] = matches;
		data = {
			'segmentNumbers': ParserUtil.parseRange(segNumStr, '|', '-'),
			'departureDate': !date ? null : {
				'raw': date,
				'parsed': ParserUtil.parsePartialDate(date),
			},
			'bookingClass': cls || null,
		};
		if (data.departureDate && !data.departureDate.parsed) {
			return Rej.BadRequest('Invalid departure date - ' + date);
		}
	} else if (php.preg_match(/^\/GK$/, realCmd, matches = [])) {
		type = 'rebookAsGk';
		data = {
			segmentNumbers: [],
			departureDate: null,
			bookingClass: null,
		};
	} else if (php.preg_match(/^\/SS([EM]?)$/, realCmd, matches = [])) {
		type = 'rebookAsSs';
		data = {
			method: {
				'E': 'allowCutting',
				'M': 'guessMarriages',
				'': 'yGkRebook',
			}[matches[1]],
		};
	} else if (result = RepriceInAnotherPccAction.parseAlias(realCmd)) {
		type = 'priceInAnotherPcc';
		realCmd = result.cmd;
		data = {
			target: result.target,
			dialect: result.dialect,
		};
	}
	return Promise.resolve({realCmd, moveDownAll, data, type});
};
