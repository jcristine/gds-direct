import {getters} from "./state";
import {getStore} from "./store";

export const DEV_CMD_STACK_RUN = command => getStore().app.Gds.runCommand(command);

export const PURGE_SCREENS 	= () => {
	getStore().app.Gds.clearScreen();
	getters('clear'); // TO MANY REQUESTS;
};

export const SWITCH_TERMINAL = (fn) => {

	return new Promise( resolve => {

		const curTerminalId = fn(getStore().app.getGds().get());

		setTimeout(() => { // THIS IS CRAZY SHIT. WITHOUT IT SWITCHES TERMINALS SEVERAL TIMES TRY PRESS ~

			const terminal = getStore().app.Gds.getCurrent().get('terminals');

			if (curTerminalId !== false)
				terminal[curTerminalId].plugin.terminal.focus();

			resolve('done');
		}, 100);
	});
};