import {AREA_LIST} 		from "./constants";
import {get} 			from "./helpers/requests";
import {TerminalState} 	from "./state";
import GdsSet 			from './modules/gds';
import ContainerMain 	from "./components/containerMain";

let state, Gds = {}, Container, PqModal;

export const INIT = ({ settings, ...params }) => {

	GdsSet.makeList(settings.gds).forEach( gds => Gds[gds.name] = gds);

	state = window.TerminalState = new TerminalState(params);

	PqModal = params["openPqModal"];

	Container = new ContainerMain( params['htmlRootId'] || 'rootTerminal' );
	const gdsName = settings.common['currentGds'] || 'apollo';

	state.setProvider( (state) => Container.render(state) );

	state.change({
		gdsObj : Gds[gdsName]
	});
};

export const CHANGE_INPUT_LANGUAGE = language => {
	get(`terminal/saveSetting/language/${state.getGds()}/${language}`);
	state.change({language});
};

export const DEV_CMD_STACK_RUN 		= command => {

	if ( state.getGdsObj()['curTerminalId'] >= 0 )
	{
		state.execCmd(command);
		return Promise.resolve();
	}

	alert('Please select terminal first');
	return Promise.reject();
};

export const GET_HISTORY 			= () => get(`terminal/lastCommands?rId=${state.getRequestId()}&gds=${state.getGds()}`);

export const CHANGE_ACTIVE_TERMINAL = ({gds, curTerminalId, activeTerminal}) => {

	get(`terminal/saveSetting/terminal/${gds}/${name + 1}`);

	Gds[gds] = { ...Gds[gds], activeTerminal, curTerminalId };

	state.change({
		gdsObj 			: Gds[gds]
	});
};

export const CHANGE_MATRIX = (matrix) => {
	localStorage.setItem('matrix', JSON.stringify(matrix) );

	Gds[state.getGds()] = { ...Gds[ state.getGds() ], matrix};

	state.change({
		gdsObj : Gds[state.getGds()]
	});
};

export const PQ_MODAL_SHOW = () => {

	const errors = state.getGdsObj().canCreatePq;

	if (!errors)
		return false;

	return PqModal({
		canCreatePqErrors 	: state.getGdsObj()['canCreatePqErrors'],
		onClose				: () => CLOSE_PQ_WINDOW()
	})
		.then(	() => state.change({hideMenu: true}) )
		.catch(	() => console.log(' catch !!!') );
};

export const CLOSE_PQ_WINDOW = () => state.change({hideMenu: false});

export const CHANGE_SESSION_BY_MENU = ({sessionIndex}) => {
	const area 		= AREA_LIST[sessionIndex];
	const command 	= (state.isGdsApollo() ? 'S': '¤') + area;

	get(`terminal/saveSetting/area/${state.getGds()}/${area}`);
	return DEV_CMD_STACK_RUN([command]);
};

export const CHANGE_GDS = (gdsName) => {
	get(`terminal/saveSetting/gds/${state.getGds()}/${gdsName}`);

	Gds[state.getGds()] = state.getGdsObj(); // save prev gds state

	state.change({
		gdsObj 	: Gds[gdsName]
	});
};

export const PURGE_SCREENS = (gds) => {
	Container.purgeScreens( gds );
	get(`terminal/clearBuffer`, true);
};

export const UPDATE_CUR_GDS = (gdsName, {canCreatePq, canCreatePqErrors, area, pcc, startNewSession}) => {
	// Gds[this.getGds()] 	= this.state.gdsObj; //issue 02

	const sessionIndex	= AREA_LIST.indexOf(area);
	const newPcc 		= {[sessionIndex] : pcc};

	Gds[gdsName]['pcc'] = startNewSession ? newPcc : { ...Gds[gdsName]['pcc'], ...newPcc};

	Gds[gdsName] = { ...Gds[gdsName], canCreatePq, canCreatePqErrors, sessionIndex };

	state.change({
		gdsObj : Gds[gdsName]
	});
};

export const SWITCH_TERMINAL = (gds, index) => {

	const terminal = Container.getTerminal(gds, index);

	if (terminal.plugin !== null)
		return terminal.plugin.terminal.focus();

	terminal.context.click();
};

export const UPDATE_STATE = props => {
	state.change(props)
};