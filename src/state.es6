import {get} from "./helpers/requests";

let State =  {
	language	: 'APOLLO',
	fontSize	: 1,
	hideMenu	: false,
	requestId	: null,
	gdsList		: [],
	gdsObjName	: ''
};

window.TerminalState = {
	isLanguageApollo 	: () => State.language === 'APOLLO',
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

	State = State = {...State, action};

	console.log('STATE:', State);
	renderView(State);
};

export const getters = (action, props) => {

	const GET = (urlPart, param) => get(urlPart + '/' + State.gdsObjName + '/' + param);

	switch (action)
	{
		case 'active' :
			GET('terminal/saveSetting/terminal', props);
			break;

		case 'switch' :
			GET('terminal/saveSetting/gds', props);
			break;

		case 'session' :
			GET('terminal/saveSetting/area', props);
			break;

		case 'language' :
			GET('terminal/saveSetting/language', props);
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
	}
};

let renderView;
export const setProvider = containerRender => { renderView = containerRender };