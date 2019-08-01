

const SessionStateHelper = require('./SessionStateHelper.js');

/**
 * takes called command, output and previous state,
 * returns the state after the command was applied
 * "state" includes info about current PCC/area/PNR/pricing/etc...
 */
class SessionStateProcessor
{
	/** "safe" means it does not write to DB */
	static updateStateSafe($cmd, $output, gds, $sessionState, $getAreaData)  {
		let $getAreaDataNorm = (letter) => ({...$getAreaData(letter)});
		if (gds === 'apollo') {
			let UpdateApolloSessionStateAction = require('./UpdateApolloState.js');
			return UpdateApolloSessionStateAction.execute($cmd, $output, $sessionState, $getAreaDataNorm);
		} else if (gds === 'sabre') {
			let UpdateSabreSessionStateAction = require('./UpdateSabreState.js');
			return UpdateSabreSessionStateAction.execute($cmd, $output, $sessionState, $getAreaDataNorm);
		} else if (gds === 'amadeus') {
			let UpdateAmadeusSessionStateAction = require('./UpdateAmadeusState.js');
			return UpdateAmadeusSessionStateAction.execute($cmd, $output, $sessionState, $getAreaDataNorm).toArray();
		} else if (gds === 'galileo') {
			let UpdateGalileoSessionStateAction = require('./UpdateGalileoState.js');
			return UpdateGalileoSessionStateAction.execute($cmd, $output, $sessionState, $getAreaDataNorm).toArray();
		} else {
			throw new Error('Session State Processor is not implemented for '+$sessionState['gds']+' GDS yet');
		}
	}

	static updateFullState(cmd, output, gds, fullState) {
		fullState = JSON.parse(JSON.stringify(fullState));
		let oldArea = fullState.area;
		let getArea = letter => fullState.areas[letter] || {};
		let oldState = fullState.areas[fullState.area] || {};
		let newState = this.updateStateSafe(cmd, output, gds, oldState, getArea);
		let isMr = SessionStateHelper.mrCmdTypes.includes(newState.cmdType);
		newState.scrolledCmd = isMr ? oldState.scrolledCmd : cmd;
		fullState.area = newState.area;
		fullState.areas[newState.area] = newState;
		fullState.areas[oldArea].cmdCnt = (fullState.areas[oldArea].cmdCnt || 0) + 1;
		return fullState;
	}
}

module.exports = SessionStateProcessor;
