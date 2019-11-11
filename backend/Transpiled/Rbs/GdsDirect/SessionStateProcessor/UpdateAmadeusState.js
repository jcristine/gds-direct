const StateHelper = require('gds-utils/src/state_tracking/StateHelper.js');

const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const CommandParser = require('gds-utils/src/text_format_processing/amadeus/commands/CmdParser.js');
const PnrSearchParser = require('../../../Gds/Parsers/Amadeus/PnrSearchParser.js');
const PnrParser = require('gds-utils/src/text_format_processing/amadeus/pnr/PnrParser.js');
const SessionStateDs = require('../../../Rbs/GdsDirect/SessionStateProcessor/SessionStateDs.js');
const CmsAmadeusTerminal = require('../../../Rbs/GdsDirect/GdsInterface/CmsAmadeusTerminal.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');

class UpdateAmadeusState
{
	constructor(initialState, getAreaData)  {
		this.state = initialState;
		this.getAreaData = getAreaData;
	}

	/** @param data = CommandParser::parsePriceItinerary() */
	static isPricingValidForPq(data, output)  {
		// 'FXX',
		// '',
		// 'NO FARE FOR BOOKING CODE-TRY OTHER PRICING OPTIONS',
		// ' ',
		const isErrorOutput = StringUtil.lines(output.trim()).length < 5;
		return !isErrorOutput;
	}

	static isPnrListOutput(output)  {
		return PnrSearchParser.parse(output).success
            || php.preg_match(/^[^\n]*\s*NO NAME\s*$/, output);
	}

	static wasSinglePnrOpenedFromSearch(output)  {
		return !this.isPnrListOutput(output)
            && !php.preg_match(/^\s*(\/\$)?CHECK FORMAT\s*$/, output)
            && !php.preg_match(/^\s*(\/\$)?CHECK FLIGHT NUMBER\s*$/, output)
            && !php.preg_match(/^\s*(\/\$)?CHECK .*\s*$/, output)
            && !php.preg_match(/^\s*(\/\$)?INVALID\s*$/, output)
            && php.count(StringUtil.lines(php.trim(output))) > 2;
	}

	static wasPnrOpenedFromList(output)  {
		return !this.isPnrListOutput(output)
            && !php.preg_match(/^\s*(\/\$)?NO ITEMS\s*$/, output)
            && !php.preg_match(/^\s*(\/\$)?INVALID\s*$/, output)
            && php.count(StringUtil.lines(php.trim(output))) > 2;
	}

	static detectOpenPnrStatus(output)  {
		let parsedPnr;

		if (php.preg_match(/^(\/\$)?NO MATCH FOR RECORD LOCATOR\s*$/, output)) {
			return 'notExisting';
		} else if (php.preg_match(/^(\/\$)?FINISH OR IGNORE\s*$/, output)) {
			return 'finishOrIgnore';
		} else {
			parsedPnr = PnrParser.parse(output);
			if (parsedPnr.success) {
				return 'available';
			} else {
				return 'customError';
			}
		}
	}

	getAreaState(area)  {
		const getAreaData = this.getAreaData;
		return SessionStateDs.makeFromArray(getAreaData(area));
	}

	openPnr(recordLocator)  {
		this.state.hasPnr = true;
		this.state.isPnrStored = true;
		this.state.recordLocator = recordLocator;
	}

	dropPnr()  {
		this.state.hasPnr = false;
		this.state.isPnrStored = false;
		this.state.recordLocator = '';
	}

	static wasIgnoredOk(output)  {
		return php.preg_match(/^\s*\/?\s*IGNORED(\s*-\s*[A-Z0-9]+)?\s*$/, output);
	}

	updateState(cmd, output)  {
		const helper = (new CmsAmadeusTerminal());
		const cmdParsed = CommandParser.parse(cmd);
		const type = cmdParsed.type;
		const data = cmdParsed.data;

		if (type === 'priceItinerary' && this.constructor.isPricingValidForPq(data, output)) {
			this.state.pricingCmd = cmd;
		} else if (!StateHelper.createPqSafeTypes.includes(type)) {
			this.state.pricingCmd = null;
		}
		const parsedPnr = PnrParser.parse(output);
		if (parsedPnr.success) {
			// Amadeus redisplays resulting PNR after each writing command, and even if it is
			// not a writing command, if it outputs PNR, that means there is a PNR right?
			this.state.hasPnr = true;
		}

		if (type === 'ignore') {
			if (this.constructor.wasIgnoredOk(output)) {
				this.dropPnr();
			}
		} else if (type === 'storePnr') {
			const rloc = (helper.parseSavePnr(output, false) || {}).recordLocator;
			if (rloc) {
				this.dropPnr();
			}
		} else if (type == 'changePcc') {
			if (helper.isSuccessChangePccOutput(output, data)) {
				this.state.pcc = data;
			}
		} else if (type == 'openPnr') {
			const openPnrStatus = this.constructor.detectOpenPnrStatus(output);
			if (php.in_array(openPnrStatus, ['notExisting', 'isRestricted'])) {
				this.dropPnr();
			} else if (openPnrStatus === 'available') {
				this.openPnr(data);
			}
		} else if (type == 'storeKeepPnr') {
			const rloc = (helper.parseSavePnr(output, true) || {}).recordLocator;
			if (rloc) {
				this.openPnr(rloc);
			}
		} else if (type == 'searchPnr') {
			if (this.constructor.wasSinglePnrOpenedFromSearch(output)) {
				this.openPnr(((parsedPnr.parsed || {}).pnrInfo || {}).recordLocator || '');
			} else if (this.constructor.isPnrListOutput(output)) {
				this.dropPnr();
			}
		} else if (type == 'displayPnrFromList') {
			if (this.constructor.wasPnrOpenedFromList(output)) {
				this.openPnr(((parsedPnr.parsed || {}).pnrInfo || {}).recordLocator || '');
			}
		} else if (type == 'changeArea') {
			if (helper.isSuccessChangeAreaOutput(output)) {
				this.state.updateFrom(this.getAreaState(data));
				this.state.area = data;
			}
		}
	}

	static execute(cmd, output, sessionData, getAreaData)  {
		const initialState = SessionStateDs.makeFromArray(sessionData);
		const self = new this(initialState, getAreaData);

		const cmdParsed = CommandParser.parse(cmd);
		const flatCmds = [cmdParsed, ...(cmdParsed.followingCommands || [])];
		for (const cmdRec of Object.values(flatCmds)) {
			self.updateState(cmdRec.cmd, output);
		}
		self.state.cmdType = cmdParsed ? cmdParsed.type : null;
		return self.state;
	}
}
module.exports = UpdateAmadeusState;
