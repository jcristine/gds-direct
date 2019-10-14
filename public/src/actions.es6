import {getters} from "./state";
import {getStore} from "./store";
import {notify} from "./helpers/debug";
import {UPDATE_ALL_AREA_STATE, UPDATE_DEFAULT_AREA_PCCS} from "./actions/gdsActions";
import {post} from './helpers/requests';
import Session from "./modules/session.es6";

export const DEV_CMD_STACK_RUN = command => getStore().app.gdsSwitch.runCommand(command);

export const PURGE_SCREENS 	= () => {
	getStore().app.gdsSwitch.clearScreen();
	getters('clear'); // TO MANY REQUESTS;
};

export const SWITCH_TERMINAL = (fn) => {
	return new Promise( resolve => {
		const curTerminalId = fn(getStore().app.getGds().get());
		setTimeout(() => { // THIS IS CRAZY SHIT. WITHOUT IT SWITCHES TERMINALS SEVERAL TIMES TRY PRESS ~
			const terminal = getStore().app.gdsSwitch.getCurrent().get('terminals');
			if (curTerminalId !== false)
				terminal[curTerminalId].plugin.terminal.focus();

			resolve('done');
		}, 100);
	});
};

export const RESET_SESSION = ({gds}) => {
	Session.resetWaitingQueue();
	return post('/terminal/resetToDefaultPcc', {gds: gds})
		.then(rsData => {
			notify({msg: 'Session Areas Reloaded', timeout: 3000, type: 'success', progressBar: false});
			UPDATE_ALL_AREA_STATE(gds, rsData.fullState);
		})
		.catch(exc => {
			if (exc) {
				exc.message = 'Failed to resetToDefaultPcc - ' + exc.message;
			}
			return Promise.reject(exc);
		});
};
