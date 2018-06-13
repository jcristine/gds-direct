import {getters} from "../state";
import {getStore} from "../store";

export const CHANGE_STYLE = name => {
	getStore().app.changeStyle(name);
};

export const CHANGE_FONT_SIZE = ({fontSize}) => {
	getters('fontSize', fontSize);

	getStore().app.getContainer().changeFontClass(fontSize);
	getStore().updateView({fontSize});
};

export const CHANGE_INPUT_LANGUAGE = language => {
	getters('language', language);
	getStore().setState({language});
};

export const GET_HISTORY 	= () => getters('history');

export const GET_LAST_REQUESTS 	= () => getters('lastRequests');

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
	return getStore().app.Gds.runCommand([command])
};

export const ADD_WHIDE_COLUMN = () => {

	getStore().app.Gds.update({
		hasWide : !getStore().app.getGds().get('hasWide')
	});

	getStore().updateView();
};

export const HIDE_MENU = (hidden) => {
	getStore().app.setOffset(hidden ? 0 : 100);

	getStore().updateView({
		menuHidden : hidden
	});
};

export const UPDATE_SCREEN = () => {
	getStore().updateView();
};