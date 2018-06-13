import {get} from "./helpers/requests";

let State =  {
	language	: 'APOLLO',
	fontSize	: 1,
	// hideMenu	: false,
	requestId	: null,
	gdsList		: [],
	gdsObjName	: '',
	menuHidden	: false

	// action	: ''
	// canCreatePq	: ''
	// gdsObjIndex	: ''
	// theme : '',
	// terminalThemes : '',
	// permissions : '',
	// log : '',
};

window.TerminalState = {
	isLanguageApollo 	: () => State.language.toLowerCase() === 'apollo',
	getLanguage 		: () => State.language,
	hasPermissions 		: () => State.permissions
};

export const setState = (newState, action = '') => {

	if (action)
	{
		switch (action)
		{
			default :
		}
	} else
	{
		State = {...State, ...newState};
	}

	State = {...State, action};

	if (State.permissions)
		console.log('STATE:', State);

	renderView(State);
};

export const getters = (action, props) => {

	const GET = (urlPart, param) => get(urlPart + '/' + State.gdsObjName + '/' + param);

	switch (action)
	{
		case 'terminal' :
		case 'gds' :
		case 'area' :
		case 'language' :
		case 'fontSize' :
			GET(`terminal/saveSetting/${action}`, props);
		break;

		case 'clear' :
			get('terminal/clearBuffer', true);
		break;

		case 'history' :
			return get(`terminal/lastCommands?rId=${State.requestId}&gds=${State.gdsObjName}`);
		break;

		case 'showExistingPq' :
			return get(`terminal/priceQuotes?rId=${State.requestId}`);
		break;

		case 'lastRequests' :
			return get(`gdsDirect/lastViewedRequests`);
		break;
	}
};

let renderView;
export const setProvider = containerRender => { renderView = containerRender };