import {get, post} from "./helpers/requests";

let State =  {
	useRbs		: false,
	language	: 'APOLLO',
	fontSize	: 1,
	// hideMenu	: false,
	requestId	: null,
	gdsList		: [],
	gdsObjName	: '',
	menuHidden	: false,
	keyBindings	: {},
	gdsAreaSettings : {},
	defaultPccs : {}

	// action	: ''
	// canCreatePq	: ''
	// gdsObjIndex	: ''
	// theme : '',
	// terminalThemes : '',
	// permissions : '',
	// log : '',
};

window.GdsDirectPlusState = {
	isLanguageApollo 	: () => State.language.toLowerCase() === 'apollo',
	getLanguage 		: () => State.language,
	hasPermissions 		: () => State.permissions,
	getUseRbs 			: () => State.useRbs,
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
	const POST = (urlPart, param) => post(urlPart + '/' + State.gdsObjName, param);

	switch (action)
	{
		case 'terminal' :
		case 'gds' :
		case 'area' :
		case 'language' :
		case 'fontSize' :
		case 'theme' :
			GET(`terminal/saveSetting/${action}`, props);
		break;
		// POST method is used just to make sure that URL length is not exceeding limits
		case 'settings' :
			post(`terminal/saveSetting/${action}/0`, props);
		break;
		case 'matrixConfiguration' :
			POST(`terminal/saveSetting/${action}`, props);
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