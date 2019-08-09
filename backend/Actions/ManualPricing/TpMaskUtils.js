const Rej = require('klesun-node-tools/src/Rej.js');
const TravelportUtils = require('../../GdsHelpers/TravelportUtils.js');
const CmdResultAdapter = require('../../Transpiled/App/Services/CmdResultAdapter.js');

/**
 * @module - "TP" stands for "Travelport"
 * could eventually move stuff from AbstractMaskParser.js here...
 */

exports.makeMaskRs = (calledCommands, actions = []) => CmdResultAdapter({
	cmdRq: '', gds: 'apollo',
	HighlightRules: {
		getFullDataForService: () => Promise.resolve({}),
		getByName: () => Rej.NotFound('No highlight in mask actions'),
	},
	rbsResp: {
		calledCommands: calledCommands.map(cmdRec => ({
			...cmdRec, tabCommands: TravelportUtils.extractTpTabCmds(cmdRec.output),
		})),
		actions: actions,
	},
});