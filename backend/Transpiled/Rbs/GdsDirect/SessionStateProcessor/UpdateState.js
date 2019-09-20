const Rej = require('klesun-node-tools/src/Rej.js');
const SessionStateHelper = require('./SessionStateHelper.js');
const UpdateState_apollo = require('./UpdateState_apollo.js');

const updateAreaState = ({cmd, output, gds, sessionState, getAreaData}) => {
	const getAreaDataNorm = (letter) => ({...getAreaData(letter)});
	if (gds === 'apollo') {
		return UpdateState_apollo({cmd, output, sessionState, getAreaData: getAreaDataNorm});
	} else if (gds === 'sabre') {
		const UpdateSabreSessionStateAction = require('./UpdateSabreState.js');
		return UpdateSabreSessionStateAction.execute(cmd, output, sessionState, getAreaDataNorm);
	} else if (gds === 'amadeus') {
		const UpdateAmadeusSessionStateAction = require('./UpdateAmadeusState.js');
		return UpdateAmadeusSessionStateAction.execute(cmd, output, sessionState, getAreaDataNorm).toArray();
	} else if (gds === 'galileo') {
		const UpdateGalileoSessionStateAction = require('./UpdateGalileoState.js');
		return UpdateGalileoSessionStateAction.execute(cmd, output, sessionState, getAreaDataNorm).toArray();
	} else {
		throw Rej.NotImplemented.makeExc('Session State Processor is not implemented for ' + gds + ' GDS yet');
	}
};

/**
 * takes called command, output and previous state,
 * returns the state after the command was applied
 * "state" includes info about current PCC/area/PNR/pricing/etc...
 *
 * @param {Object|null} agent = require('Agent.js')()
 */
const UpdateState = ({cmd, output, gds, fullState}) => {
	const updateFullState = () => {
		fullState = JSON.parse(JSON.stringify(fullState));
		const oldArea = fullState.area;
		const getAreaData = letter => fullState.areas[letter] || {};
		const oldState = fullState.areas[fullState.area] || {};
		const newState = updateAreaState({
			cmd, output, gds, getAreaData,
			sessionState: oldState,
		});
		const isMr = SessionStateHelper.mrCmdTypes.includes(newState.cmdType);
		newState.scrolledCmd = isMr ? oldState.scrolledCmd : cmd;
		fullState.area = newState.area;
		fullState.areas[newState.area] = newState;
		fullState.areas[oldArea].cmdCnt = (fullState.areas[oldArea].cmdCnt || 0) + 1;
		return fullState;
	};

	return updateFullState();
};

/** exposed for tests */
UpdateState.forArea = updateAreaState;

module.exports = UpdateState;
