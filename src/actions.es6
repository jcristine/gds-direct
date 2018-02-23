import {AREA_LIST} 		from "./constants";
import {getters, setProvider, setState} from "./state";

let app;

export const INIT = App => {
	app = App;

	setProvider( State => app.getContainer().render(State) );

	UPDATE_STATE({
		requestId	: app.params.requestId,
		gdsObjName	: app.Gds.getCurrentName(),
		permissions : app.params.permissions
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
	app.Gds.setCurrent(gdsName);
	UPDATE_STATE({gdsObjName : app.Gds.getCurrentName()});
};

export const UPDATE_CUR_GDS = (gdsName, {canCreatePq, canCreatePqErrors, area, pcc, startNewSession}) => {

	const sessionIndex	= AREA_LIST.indexOf(area);
	const newPcc 		= {[sessionIndex] : pcc};

	if (startNewSession)
	{
		app.Gds.update({pcc : {newPcc}, canCreatePq, canCreatePqErrors, sessionIndex});
	} else
	{
		app.Gds.updatePcc(newPcc);
		app.Gds.update({canCreatePq, canCreatePqErrors, sessionIndex});
	}

	setState({gdsList : app.Gds.getList()})
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

export const SHOW_PQ_QUOTES = () => getters('showExistingPq').then(response => showPq({pqToShow :response}, 500) );
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

	const curTerminalId = fn(app.getGds().get());

	setTimeout(() => { // THIS IS CRAZY SHIT. WITHOUT IT SWITCHES TERMINALS SEVERAL TIMES TRY PRESS ~
		const terminal = app.Gds.getCurrent().get('terminals');

		if (curTerminalId !== false)
			terminal[curTerminalId].plugin.terminal.focus();
	}, 100);
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
	setState({
		...props,
		gdsList : app.calculateMatrix().Gds.getList()
	})
};


// export const PQ_MODAL_SHOW_DEV = () => {
// 	app.pqParser.show( app.getGds()['canCreatePqErrors'], app.params.requestId )
// 		.then( () => {
// 			app.setOffset(0);
// 			UPDATE_STATE({hideMenu: true})
// 		});
// };

/*export const FULL_SCREEN = () => {
	// if ( state.getGdsObj()['curTerminalId'] >= 0 )
	// 	return FullScreen.show(state.getGds(), window.activePlugin.terminal);
	//
	// alert('no terminal selected');
};*/

// const Actions = ( props = {}, name ) => {
//
// 	switch (action)
// 	{
// 		case 'CHANGE_FONT_SIZE' :
// 			app.getContainer().changeFontClass(props);
// 		break;
//
// 		case 'ADD_WHIDE_COLUMN' :
// 			app.Gds.update({hasWide : !app.getGds().get('hasWide')});
// 		break;
// 	}
//
//
// 	UPDATE_STATE(props);
// };