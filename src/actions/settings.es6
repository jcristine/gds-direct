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
