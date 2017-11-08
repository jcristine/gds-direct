import {AREA_LIST} 		from "./constants";
import {get} 			from "./helpers/requests";
import {TerminalState} 	from "./state";
import GdsSet 			from './modules/gds';
import ContainerMain 	from "./components/containerMain";
import FullScreen		from './modules/fullscreen.es6';
import {PqParser} 		from "./modules/pqParser";

let state, Gds = {}, Container, pqParser;

export const INIT = ({ settings, ...params }) => {

	pqParser = new PqParser(params["PqPriceModal"]);

	GdsSet.makeList(settings['gds']).forEach( gds => Gds[gds['name']] = gds);

	state = window.TerminalState = new TerminalState(params);

	Container = new ContainerMain(params['htmlRootId']);

	state.setProvider( state => Container.render(state) );

	state.change({
		gdsObj : Gds[settings['common']['currentGds'] || 'apollo']
	});
};

export const CHANGE_INPUT_LANGUAGE = language => {
	GET('terminal/saveSetting/language', language);
	state.change({language});
};

export const DEV_CMD_STACK_RUN = command => {

	if ( state.getGdsObj()['curTerminalId'] >= 0 )
	{
		state.execCmd(command);
		return Promise.resolve();
	}

	alert('Please select terminal first');
	return Promise.reject();
};

const GET = (urlPart, param) => {
	return get(
		urlPart + '/' + state.getGds() + '/' + param
	);
};

export const GET_HISTORY = () => {
	return get(`terminal/lastCommands?rId=${state.getRequestId()}&gds=${state.getGds()}`);
};

export const CHANGE_ACTIVE_TERMINAL = ({gds, curTerminalId, activeTerminal}) => {

	GET('terminal/saveSetting/terminal', (name + 1));

	Gds[gds] = { ...Gds[gds], activeTerminal, curTerminalId };

	state.change({
		gdsObj : Gds[gds]
	});
};

export const CHANGE_MATRIX = (matrix) => {
	localStorage.setItem('matrix', JSON.stringify(matrix) );

	const gds 	= state.getGds();
	Gds[gds] 	= {...Gds[gds], matrix};

	state.change({
		gdsObj : Gds[gds]
	});
};

export const SHOW_PQ_QUOTES = () => {
	get(`terminal/priceQuotes?rId=${state.getRequestId()}`)
		.then( response => {
			state.change({
				pqToShow	: response,
				hideMenu	: true
			});
		});
};

export const HIDE_PQ_QUOTES = () => {
	state.change({
		pqToShow	: false,
		hideMenu	: false
	});
};

export const PQ_MODAL_SHOW = () => {

	if (!state.getGdsObj().canCreatePq)
		return false;

	return pqParser.show( state.getGdsObj()['canCreatePqErrors'], state.getRequestId() );
};

export const PQ_MODAL_SHOW_DEV = () => {
	return pqParser.show( state.getGdsObj()['canCreatePqErrors'], state.getRequestId() );
};

export const CLOSE_PQ_WINDOW = () => {
	state.change({
		hideMenu : false
	})
};

export const CHANGE_SESSION_BY_MENU = (area) => {
	const command 	= (state.isGdsApollo() ? 'S': '¤') + area;

	GET('terminal/saveSetting/area', area);
	return DEV_CMD_STACK_RUN([command]);
};

export const CHANGE_GDS = gdsName => {
	GET('terminal/saveSetting/gds', gdsName);

	Gds[state.getGds()] = state.getGdsObj(); // save prev gds state

	state.change({
		gdsObj 	: Gds[gdsName]
	});
};

export const PURGE_SCREENS = gds => {
	Container.purgeScreens(gds);
	get('terminal/clearBuffer', true);
};

export const UPDATE_CUR_GDS = (gdsName, {canCreatePq, canCreatePqErrors, area, pcc, startNewSession}) => {
	// Gds[this.getGds()] 	= this.state.gdsObj; //issue 02

	const sessionIndex	= AREA_LIST.indexOf(area);
	const newPcc 		= {[sessionIndex] : pcc};

	Gds[gdsName]['pcc'] = startNewSession ? newPcc : { ...Gds[gdsName]['pcc'], ...newPcc};
	Gds[gdsName] 		= {...Gds[gdsName], canCreatePq, canCreatePqErrors, sessionIndex };

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

export const FULL_SCREEN = () => {

	if ( state.getGdsObj()['curTerminalId'] >= 0 )
	{
		return FullScreen.show(state.getGds(), state.getGdsObj()['activeTerminal']);
	}

	alert('no terminal selected');
};

export const UPDATE_STATE = props => {
	state.change(props)
};