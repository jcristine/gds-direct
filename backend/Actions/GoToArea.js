const TravelportUtils = require('../GdsHelpers/TravelportUtils.js');
const UpdateGalileoState = require('../Transpiled/Rbs/GdsDirect/SessionStateProcessor/UpdateGalileoState.js');
const Errors = require('../Transpiled/Rbs/GdsDirect/Errors.js');
const FakeAreaUtil = require('../GdsHelpers/Amadeus/FakeAreaUtil.js');
const Rej = require('klesun-node-tools/src/Rej.js');

const inSabre = ({stateful, area}) => {
	const ensureSignedInAllAreas = async () => {
		const fullState = stateful.getFullState();
		if (Object.values(fullState.areas).length === 1 ||
			Object.values(fullState.areas).some(a => !a.pcc)
		) {
			// Sabre requires "logging" into all areas before
			// switching between them, or our OIATH trick will fail
			const siOutput = (await stateful.runCmd('SI*')).output;
			const siMatch = siOutput.match(/^([A-Z0-9]{3,4})\.([A-Z0-9]{3,4})\*AWS((?:\.[A-Z])+)/);
			if (siMatch) {
				const [_, emulatedPcc, homePcc, areasStr] = siMatch;
				areasStr.split('.').filter(a => a).forEach(a => {
					fullState.areas[a] = fullState.areas[a] || {};
					fullState.areas[a].pcc = emulatedPcc;
				});
				stateful.updateFullState(fullState);
			} else {
				return Rej.UnprocessableEntity('Failed to login into all areas - ' + siOutput.trim());
			}
		}
	};

	const main = async () => {
		await ensureSignedInAllAreas();
		if (!area) {
			return Rej.InternalServerError('Sabre area letter parameter was empty');
		}

		// '§OIATH' - needed to extract the new session token,
		// since current gets discarded on area change
		const areaCmd = '¤' + area;
		const cmd = areaCmd + '§OIATH';
		const cmdRec = await stateful.runCmd(cmd);
		const athMatch = cmdRec.output.match(/^ATH:(.*)!.*/);
		if (athMatch) {
			const newToken = athMatch[1];
			const gdsData = stateful.getGdsData();
			gdsData.binarySecurityToken = newToken;
			stateful.updateGdsData(gdsData);
			const output = 'Successfully changed area to ' + area;
			const cmdRecs = [{...cmdRec, cmd: areaCmd, output}];
			return {calledCommands: cmdRecs};
		} else {
			const msg = 'Could not change area to ' +
				area + ' - ' + cmdRec.output.trim();
			return Rej.UnprocessableEntity(msg);
		}
	};

	return main();
};

const inApollo = async ({stateful, area}) => {
	if (!area) {
		return Rej.InternalServerError('Apollo area letter parameter was empty');
	}
	const cmdRec = await stateful.runCmd('S' + area);
	if (stateful.getFullState().area !== area) {
		const error = Errors.getMessage(Errors.FAILED_TO_CHANGE_AREA, {
			area: area, response: cmdRec.output.trim(),
		});
		return Rej.UnprocessableEntity(error, cmdRec);
	}
	return {calledCommands: [cmdRec]};
};

const inGalileo = async ({stateful, area}) => {
	if (!area) {
		return Rej.InternalServerError('Galileo area letter parameter was empty');
	}
	const cmdRec = await TravelportUtils.fetchAll('S' + area, stateful);
	const output = cmdRec.output;
	if (!UpdateGalileoState.isSuccessChangeAreaOutput(output)) {
		const error = Errors.getMessage(Errors.FAILED_TO_CHANGE_AREA, {
			area: area, response: output.trim(),
		});
		return Rej.UnprocessableEntity(error, cmdRec);
	}
	return {calledCommands: [cmdRec]};
};

/** @param stateful = require('StatefulSession.js')() */
const GoToArea = async ({stateful, area}) => {
	if (!area) {
		return Rej.InternalServerError('Area letter parameter was empty');
	}
	const gds = stateful.gds;
	if (stateful.getFullState().area === area) {
		const text = 'Already in area ' + area;
		return {messages: [{type: 'info', text}]};
	}
	let result;
	if (gds === 'sabre') {
		result = await inSabre({stateful, area});
	} else if (gds === 'amadeus') {
		result = await FakeAreaUtil({stateful}).changeArea(area);
	} else if (gds === 'apollo') {
		result = await inApollo({stateful, area});
	} else if (gds === 'galileo') {
		result = await inGalileo({stateful, area});
	} else {
		const msg = 'Unsupported GoToArea GDS - ' + gds;
		return Rej.NotImplemented(msg);
	}
	if (stateful.getFullState().area !== area) {
		const msg = 'Failed to switch to requested area ' + area;
		return Rej.UnprocessableEntity(msg, result);
	} else {
		return Promise.resolve(result);
	}
};

GoToArea.inSabre = inSabre;
GoToArea.inApollo = inApollo;
GoToArea.inGalileo = inGalileo;

module.exports = GoToArea;
