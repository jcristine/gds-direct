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
const GoToPcc = async ({stateful, pcc}) => {
	await CommonDataHelper.checkEmulatePccRights({stateful, pcc});

	const fullState = stateful.getFullState();

	const signs = Object.values(stateful.getAreaRows());
	const matchingSign = signs.filter(r => r.pcc === pcc)[0] || null;
	const pnredAreas = signs.filter(s => s.hasPnr).map(s => s.area);

	const agentId = stateful.getAgent().getId();
	const areaSettings = await AreaSettings.getByAgent(agentId);
	const matchingSetting = areaSettings.filter(s => s.defaultPcc === pcc)[0] || null;
	const configuredAreas = areaSettings.filter(s => s.defaultPcc).map(s => s.area);

	const freeArea = GdsSessions.getAreaLetters(stateful.gds)
		.filter(area => !pnredAreas.includes(area))
		.filter(area => !configuredAreas.includes(area))[0] || null;

	let area;
	if (matchingSign) {
		area = matchingSign.area;
	} else if (matchingSetting) {
		area = matchingSetting.area;
	} else if (freeArea) {
		area = freeArea;
	} else {
		area = 'A';
	}
	if (area !== fullState.area) {
		await GoToArea({stateful, area: matchingSetting.area});
	}
	const areaState = fullState.areas[area] || {};
	if (areaState.pcc !== pcc) {
		await IgnorePnr({stateful});
		await EnsurePcc({stateful, pcc});
	}
	const text = 'GDS: ' + stateful.gds + '; PCC: ' + pcc + '; Area: ' + area;
	return {messages: [{type: 'info', text}]};
};

module.exports = GoToPcc;
