import {getters} from "./state";
import {getStore} from "./store";

export const CHANGE_MATRIX = matrix => {
	getStore().app.Gds.update({matrix});
	getStore().updateView();
};

export const CHANGE_ACTIVE_TERMINAL = ({curTerminalId}) => {
	getStore().app.Gds.changeActive(curTerminalId);
	getters('terminal', curTerminalId + 1);
};

export const CHANGE_SESSION_BY_MENU = area => {
	getters('area', area);

	const command = (getStore().app.Gds.isApollo() ? 'S': '¤') + area;
	return DEV_CMD_STACK_RUN([command])
};

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

export const ADD_WHIDE_COLUMN = () => {

	getStore().app.Gds.update({
		hasWide : !getStore().app.getGds().get('hasWide')
	});

	getStore().updateView();
};