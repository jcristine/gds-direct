import {getters, setProvider, setState} from "./state";
import {change_gds, update_cur_gds} from "./actions/gdsActions";
import {OFFSET_QUOTES} from "./constants";

let app;

export const INIT = (App, props) => {
	app = App;

	setProvider( State => app.getContainer().render(State) );

	UPDATE_STATE({
		requestId		: props.requestId,
		permissions 	: props.permissions,
		terminalThemes	: props.terminalThemes,
		theme			: props.themeId,

		gdsObjName		: app.Gds.getCurrentName(),
		gdsObjIndex 	: app.Gds.getCurrentIndex()
	});
};

export const CHANGE_MATRIX = matrix => {
	app.Gds.update({matrix});
	UPDATE_STATE();
};

export const CHANGE_ACTIVE_TERMINAL = ({curTerminalId}) => {
	app.Gds.changeActive(curTerminalId);
	getters('active', curTerminalId + 1);
};

export const CHANGE_GDS = gdsName => {
	getters('switch', gdsName);

	UPDATE_STATE(
		change_gds(app, gdsName)
	);
};

export const UPDATE_CUR_GDS = props => {
	setState({
		...update_cur_gds(app, props)
	});
};

export const CHANGE_STYLE = name => {
	app.changeStyle(name);
};

export const CHANGE_SESSION_BY_MENU = area => {
	getters('session', area);

	const command = (app.Gds.isApollo() ? 'S': '¤') + area;
	return DEV_CMD_STACK_RUN([command])
};

export const DEV_CMD_STACK_RUN = command => app.Gds.runCommand(command);

export const CHANGE_INPUT_LANGUAGE = language => {
	getters('language', language);
	setState({language});
};

export const GET_HISTORY 	= () => getters('history');

export const PURGE_SCREENS 	= () => {
	app.Gds.clearScreen();
	getters('clear'); // TO MANY REQUESTS;
};

const showPq = (newState, offset = 100) => {
	app.setOffset(offset);
	UPDATE_STATE(newState);
};

export const SHOW_PQ_QUOTES = () => getters('showExistingPq').then(response => showPq({pqToShow :response}, OFFSET_QUOTES) );
export const HIDE_PQ_QUOTES = () => showPq({pqToShow:false});

export const PQ_MODAL_SHOW 	= () => {
	app.pqParser
		.show( app.getGds(), app.params.requestId )
		.then(() => {
			showPq({hideMenu : true}, 0)
		})
};

export const CLOSE_PQ_WINDOW = () => showPq({hideMenu : false});

export const SWITCH_TERMINAL = (fn) => {

	return new Promise( resolve => {

		const curTerminalId = fn(app.getGds().get());

		setTimeout(() => { // THIS IS CRAZY SHIT. WITHOUT IT SWITCHES TERMINALS SEVERAL TIMES TRY PRESS ~

			const terminal = app.Gds.getCurrent().get('terminals');

			if (curTerminalId !== false)
				terminal[curTerminalId].plugin.terminal.focus();

			resolve('done');
		}, 100);
	});
};

export const CHANGE_FONT_SIZE = props => {
	app.getContainer().changeFontClass(props);
	UPDATE_STATE(props);
};

export const ADD_WHIDE_COLUMN = () => {
	app.Gds.update({
		hasWide : !app.getGds().get('hasWide')
	});

	UPDATE_STATE();
};

export const UPDATE_STATE = (props = {}) => {
	app.calculateMatrix();

	setState({
		...props,
		curGds	: app.Gds.getCurrent()
	})
};