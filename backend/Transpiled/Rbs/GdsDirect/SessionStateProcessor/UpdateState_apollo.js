
const CmsApolloTerminal = require('../../../Rbs/GdsDirect/GdsInterface/CmsApolloTerminal.js');
const SessionStateHelper = require("./SessionStateHelper");

const PnrStatusParser = require('gds-utils/src/text_format_processing/apollo/actions/PnrStatusParser.js');
const PnrParser = require('gds-utils/src/text_format_processing/apollo/pnr/PnrParser.js');
const ItineraryParser = require('gds-utils/src/text_format_processing/apollo/pnr/ItineraryParser.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const CmdParser = require('gds-utils/src/text_format_processing/apollo/commands/CmdParser.js');

const isValidSellOutput = (output) => {
	for (const line of output.split('\n')) {
		if (ItineraryParser.parseSegmentLine(line)) {
			return true;
		}
	}
	return false;
};

const isValidPricingOutput = (output) => {
	const tooShortToBeValid = !output.match(/\n.*\n.*\n/);
	return !tooShortToBeValid;
};

const isValidPricing = (cmd, output) => {
	const type = CmdParser.parse(cmd).type;
	return ['priceItinerary', 'storePricing'].includes(type)
		&& isValidPricingOutput(output);
};

const parseAddTurSegmentOutput = (dump) => {
	const regex =
		'/^\\s*'+
		'(?<segmentNumber>\\d+)\\s*'+
		'(?<segmentType>OTH|TUR)\\s*'+
		'(?<vendor>[A-Z0-9]{2})\\s*'+
		'(?<status>[A-Z]{2})\\s*'+
		'(?<amount>\\d+)\\s*'+
		'(?<location>[A-Z]{3})\\s*'+
		'(?<date>\\d+[A-Z]{3})\\s*'+
		'(-\\s*(?<remark>.*?))?'+
		'\\s*$/';
	let matches;
	if (php.preg_match(regex, dump, matches = [])) {
		return matches;
	} else {
		return null;
	}
};

const detectPartialResallSuccessError = (dump) => {
	let matches;
	if (php.preg_match(/^\s*RE SUCCESSFUL THRU SEGMENT\s+(\d+)\s*$/, dump, matches = [])) {
		const [, $repeatedSegmentCount] = matches;
		return {repeatedSegmentCount: $repeatedSegmentCount};
	} else {
		return null;
	}
};

const handleApolloCopyPnr = (sessionData, output) => {
	output = output.replace(/\)?><$/, '');
	const parsed = PnrParser.parse(output);
	const sections = PnrParser.splitToSections(output);
	delete (sections.HEAD);
	const isEmpty = (val) => php.empty(val);
	const isValidPnrOutput = !php.empty(parsed.itineraryData)
		|| !php.empty(parsed.passengers.passengerList)
		|| !Object.values(sections).every(isEmpty, sections);
	if (isValidPnrOutput || detectPartialResallSuccessError(output)) {
		// PNR data data was copied
		sessionData.recordLocator = '';
		sessionData.isPnrStored = false;
		sessionData.hasPnr = true;
	} else if (output.match(/^\s*MODIFY\s*(><)?$/)) {
		// nothing happened
	} else {
		// everything else probably is error (typo, etc...)
	}
	return sessionData;
};

const isPnrListOutput = (output) => {
	output = output.replace(/\)?><$/, '');
	const regex = /^([A-Z0-9]{3,4})-(.+?)\s*(\d{1,3} NAMES ON LIST)/;
	return output.match(regex)
		|| output.trim() === 'NO NAMES';
};

const wasSinglePnrOpenedFromSearch = (output) => {
	output = output.replace(/><$/, '');
	return !isPnrListOutput(output)
		&& output.trim() !== 'FIN OR IGN'
		&& output.trim() !== 'AG - DUTY CODE NOT AUTH FOR CRT - APOLLO'
	;
};

const wasPnrOpenedFromList = (output) => {
	output = output.replace(/><$/, '');
	return output.trim() !== 'FIN OR IGN'
		&& output.trim() !== 'AG - DUTY CODE NOT AUTH FOR CRT - APOLLO'
		&& output.trim() !== 'INVLD';
};

const wasIgnoredOk = (output) => output.match(/^\s*IGND\s*(><)?\s*$/);

/** @param {Object|null} agent = require('Agent.js')() */
const UpdateState_apollo = ({
	cmd, output, sessionState, getAreaData,
}) => {
	sessionState = {...sessionState};
	const getAreaDataUnsafe = getAreaData;
	getAreaData = (letter) => ({...getAreaDataUnsafe(letter)});

	const updateState = (cmd, output) => {
		const clean = php.preg_replace(/\)?><$/, '', output);
		const commandTypeData = CmdParser.parse(cmd);
		const {type, data} = commandTypeData;
		if (isValidPricing(cmd, output)) {
			sessionState.pricingCmd = cmd !== '$BBQ01'
				? cmd : sessionState.pricingCmd;
		} else if (!php.in_array(type, SessionStateHelper.getCanCreatePqSafeTypes())) {
			sessionState.pricingCmd = null;
		}
		if (php.preg_match(/^\s*\*\s*(><)?\s*$/, output)) {
			// "*" output is returned by most Apollo writing commands
			// on success - this triggers PNR creation if context was empty
			sessionState.hasPnr = true;
		}
		let recordLocator = '';
		let openPnr = false;
		let dropPnr = false;

		if (type === 'storePnr') {
			dropPnr = PnrStatusParser.parseSavePnr(output).success;
		} else if (type === 'ignore') {
			dropPnr = wasIgnoredOk(output);
		} else if (type === 'ignoreKeepPnr') {
			dropPnr = php.preg_match(/^\s*NO TRANS AAA\s*(><)?\s*$/, output);
		} else if (type === 'storeAndCopyPnr') {
			sessionState = handleApolloCopyPnr(sessionState, output);
		} else if (php.in_array(type, SessionStateHelper.$dropPnrContextCommands)) {
			dropPnr = true;
			// Invalid command: returns INVLD ADDRS, breaks PNR state
		} else if (cmd === '*R*@*R*') {
			dropPnr = true;
			// Invalid command: '*ACOSTA/MONICA BAUTISTA' with output INVLD breaks PNR state
		} else if (php.preg_match(/^\*[A-Z0-9]+\//, cmd) && output.startsWith('INVLD')) {
			dropPnr = true;
		} else if (type == 'changePcc' && CmsApolloTerminal.isSuccessChangePccOutput(output, data)) {
			sessionState.pcc = data;
		} else if (type == 'openPnr') {
			const openPnrStatus = PnrStatusParser.detectOpenPnrStatus(output);
			if (php.in_array(openPnrStatus, ['notExisting', 'isRestricted'])) {
				dropPnr = true;
			} else if (openPnrStatus === 'available') {
				recordLocator = data;
				openPnr = true;
			}
		} else if (type == 'storeKeepPnr') {
			if (recordLocator = PnrStatusParser.parseSavePnr(output).recordLocator || null) {
				openPnr = true;
			}
		} else if (type == 'searchPnr') {
			if (wasSinglePnrOpenedFromSearch(output)) {
				recordLocator = (PnrParser.parse(output).headerData.reservationInfo || {}).recordLocator;
				openPnr = true;
			} else if (isPnrListOutput(output)) {
				dropPnr = true;
			}
		} else if (type == 'displayPnrFromList') {
			if (wasPnrOpenedFromList(output)) {
				recordLocator = (PnrParser.parse(output).headerData.reservationInfo || {}).recordLocator;
				openPnr = true;
			}
		} else if (type == 'changeArea' && new CmsApolloTerminal().isSuccessChangeAreaOutput(output)) {
			const areaData = getAreaData(data);
			areaData.area = data;
			sessionState = {...areaData};
		} else if (type === 'sell') {
			if (isValidSellOutput(output) ||
				parseAddTurSegmentOutput(clean)
			) {
				sessionState.hasPnr = true;
			}
		} else if (type === 'sellFromLowFareSearch') {
			if (php.preg_match(/^FS.*?\s+.*PRICING OPTION.*TOTAL AMOUNT\s*\d*\.?\d+[A-Z]{3}/s, output)) {
				sessionState.hasPnr = true;
			}
		} else if (type === 'redisplayPnr') {
			if (php.trim(clean) === 'INVLD') {
				dropPnr = true;
			}
		}
		if (openPnr) {
			sessionState.recordLocator = recordLocator;
			sessionState.hasPnr = true;
			sessionState.isPnrStored = true;
		} else if (dropPnr) {
			sessionState.recordLocator = '';
			sessionState.hasPnr = false;
			sessionState.isPnrStored = false;
		}
		return sessionState;
	};

	/** @param {IAreaState} sessionData
	 * @param {function(string): IAreaState} getAreaData */
	const execute = () => {
		const cmdParsed = CmdParser.parse(cmd);
		const flatCmds = php.array_merge([cmdParsed], cmdParsed.followingCommands || []);
		for (const cmdRec of flatCmds) {
			updateState(cmdRec.cmd, output);
		}
		sessionState.cmdType = cmdParsed ? cmdParsed.type : null;
		return sessionState;
	};

	return execute();
};

UpdateState_apollo.wasIgnoredOk = wasIgnoredOk;

module.exports = UpdateState_apollo;
