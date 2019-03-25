import {getters} from "../state";
import {getStore} from "../store";
import {GDS_LIST} from "../constants";
import {notify} from '../helpers/debug.es6';
import $ from 'jquery';

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

export const CHANGE_USE_RBS = useRbs => {
	getStore().setState({useRbs});
};

export const CHANGE_SETTINGS = settings => {
	getters('settings', settings);

	const newData = { keyBindings: {}, gdsAreaSettings: {} };
	let promises = [];
	$.each(settings, (gds, value) => {
		newData.keyBindings[gds] = value.keyBindings || {};
        newData.gdsAreaSettings[gds] = value.areaSettings || [];
		let promise = getStore().app.Gds.update({
			keyBindings: newData.keyBindings[gds],
            areaSettings: newData.gdsAreaSettings[gds],
		}, gds);
		promises.push(promise);
	});
	if (promises.length > 0) {
		Promise.all(promises).then(() => {
			notify({
				type: 'success',
				msg: 'Saved Successfully',
			});
		});
	}
	getStore().updateView({ keyBindings: newData.keyBindings, gdsAreaSettings: newData.gdsAreaSettings });
};

export const GET_HISTORY 	= () => getters('history');

export const GET_LAST_REQUESTS 	= () => getters('lastRequests');

export const CHANGE_MATRIX = matrix => {
	const result = {
		hasWide: getStore().app.getGds().get('hasWide'),
		matrix,
	};
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

	const command = {
		apollo: 'S' + area,
		galileo: 'S' + area,
		sabre: '¤' + area,
		amadeus: 'JM' + area,
	}[getStore().app.Gds.name];
	return getStore().app.Gds.runCommand([command])
};

export const RUN_COMMAND_LIST = commands => {
	for (let cmd of commands) {
		getStore().app.Gds.runCommand([cmd]);
	}
};

export const ADD_WHIDE_COLUMN = () => {
	const hasWide = !getStore().app.getGds().get('hasWide');
	const result = {
		hasWide,
		matrix: getStore().app.getGds().get('matrix'),
	};
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