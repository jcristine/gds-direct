import {get, post} from "./helpers/requests";

// initialised in GdsDirectPlusApp.es6
let State =  {
	roles		: [],
	language	: 'APOLLO',
	fontSize	: 1,
	disableTextWrap: false,
	// hideMenu	: false,
	requestId	: null,
	gdsList		: [],
	gdsObjName	: '',
	menuHidden	: false,
	keyBindings	: {},
	gdsAreaSettings : {},
};

window.GdsDirectPlusState = {
	isLanguageApollo 	: () => State.language.toLowerCase() === 'apollo',
	getLanguage 		: () => State.language,
	disableTextWrap		: () => State.disableTextWrap ? true : false,
	hasPermissions 		: () => State.permissions,
	getRoles			: () => State.roles,
	getGdsAreaSettings	: () => State.gdsAreaSettings || {},
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

	let cmsUrl = window.GdsDirectPlusParams.cmsUrl;

	switch (action)
	{
		case 'area' :
			// TODO: per session, not per agent...
		break;
		case 'terminal' :
		case 'gds' :
		case 'language' :
		case 'fontSize' :
		case 'theme' :
			GET(`terminal/saveSetting/${action}`, props);
		break;
		// POST method is used just to make sure that URL length is not exceeding limits
		case 'settings' :
			return post(`terminal/saveSetting/${action}/0`, props);
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
			return fetch(cmsUrl + `/gdsDirectPlus/priceQuotes?rId=${State.requestId}`, {credentials: 'include'})
				.then(resp => resp.json());
		break;

		case 'lastRequests' :
			return fetch(cmsUrl + `/gdsDirectPlus/lastViewedRequests`, {credentials: 'include'})
				.then(resp => resp.json());
		break;

		case 'disableTextWrap' :
			return post(`terminal/saveSetting/${action}`, {value: props});
		break;
	}
};

let renderView;
export const setProvider = containerRender => { renderView = containerRender };