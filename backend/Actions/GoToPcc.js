const GoToArea = require('./GoToArea.js');
const GdsSessions = require('../Repositories/GdsSessions.js');
const EnsurePcc = require('./EnsurePcc.js');
const IgnorePnr = require('./IgnorePnr.js');
const CommonDataHelper = require('../Transpiled/Rbs/GdsDirect/CommonDataHelper.js');
const AreaSettings = require('../Repositories/AreaSettings.js');

/**
 * go to the area that holds the session in PCC specified if any;
 * otherwise go to any free area; if none, go to area A and ignore PNR then proceed
 *
 * @param stateful = require('StatefulSession.js')()
 */
const GoToPcc = async ({stateful, pcc, recoveryPcc = null, sameAreaForbidden = false}) => {
	await CommonDataHelper.checkEmulatePccRights({stateful, pcc});

	const fullState = stateful.getFullState();

	const signs = Object.values(stateful.getAreaRows());
	const matchingSigns = signs
		.filter(r => !sameAreaForbidden || r.area !== fullState.area)
		.filter(r => r.pcc === pcc);
	const pnredAreas = signs
		.filter(s => !sameAreaForbidden || s.area !== fullState.area)
		.filter(s => s.hasPnr).map(s => s.area);

	const agentId = stateful.getAgent().getId();
	const areaSettings = await AreaSettings.getByAgent(agentId);
	const matchingSettings = areaSettings.filter(s => s.defaultPcc === pcc);
	const configuredAreas = areaSettings.filter(s => s.defaultPcc).map(s => s.area);

	const freeAreas = GdsSessions.getAreaLetters(stateful.gds)
		.filter(area => !sameAreaForbidden || area !== fullState.area)
		.filter(area => !pnredAreas.includes(area))
		.filter(area => !configuredAreas.includes(area));

	const area = [
		...matchingSigns.map(r => r.area),
		...matchingSettings.map(s => s.area),
		...freeAreas,
	].filter(area => {
		return !sameAreaForbidden
			|| area !== fullState.area;
	})[0] || 'A';

	if (area !== fullState.area) {
		await GoToArea({stateful, area});
	}
	const areaState = fullState.areas[area] || {};
	if (areaState.pcc !== pcc) {
		await IgnorePnr({stateful});
		await EnsurePcc({stateful, pcc, recoveryPcc});
	}
	const text = 'GDS: ' + stateful.gds + '; PCC: ' + pcc + '; Area: ' + area;
	return {messages: [{type: 'info', text}]};
};

module.exports = GoToPcc;
