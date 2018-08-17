import {getters} from "../state";
import {getStore} from "../store";

export const CHANGE_STYLE = theme => {
	getters('theme', theme);

	const { name } = getStore().app.Gds.getCurrent().get();
	getStore().app.Gds.update({ theme }, name);
	getStore().updateView({theme});
	getStore().app.changeStyle(theme);
};

export const CHANGE_FONT_SIZE = ({fontSize}) => {
	getters('fontSize', fontSize);

	getStore().app.getContainer().changeFontClass(fontSize);

	const { name } = getStore().app.Gds.getCurrent().get();
	getStore().app.Gds.update({ fontSize: fontSize }, name);
	getStore().updateView({fontSize});
};

export const CHANGE_INPUT_LANGUAGE = language => {
	getters('language', language);
	getStore().setState({language});
};

export const CHANGE_SETTINGS = settings => {
	getters('settings', settings);

	const newData = { keyBindings: {}, defaultPccs: {} };
	$.each(settings, (gds, value) => {
		newData.keyBindings[gds] = value.keyBindings || {};
		newData.defaultPccs[gds] = value.defaultPcc || '';
		getStore().app.Gds.update({
			keyBindings: newData.keyBindings[gds],
			defaultPcc: newData.defaultPccs[gds]
		}, gds);
	});
	getStore().updateView({ keyBindings: newData.keyBindings, defaultPccs: newData.defaultPccs });
};

export const GET_HISTORY 	= () => getters('history');

export const GET_LAST_REQUESTS 	= () => getters('lastRequests');

export const CHANGE_MATRIX = matrix => {
	const result = {
		hasWide: getStore().app.getGds().get('hasWide'),
		matrix,
	}
	getters('matrixConfiguration', result);
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
	const hasWide = !getStore().app.getGds().get('hasWide');
	const result = {
		hasWide,
		matrix: getStore().app.getGds().get('matrix'),
	}
	getters('matrixConfiguration', result);

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