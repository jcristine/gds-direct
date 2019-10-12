
import './theme/entry/main.less';
import requests from  "./helpers/requests";
import GdsDirectPlusApp from  "./modules/GdsDirectPlusApp";
import HighlightRulesAdminApp from "./modules/HighlightRulesAdminApp";
import TerminalThemesAdminApp from "./modules/TerminalThemesAdminApp";
import {cookies, syncJsCache, initGlobEvents, initThemeStyles, addExternalStyle} from "./helpers/appInitialization";

const addExternalStyles = () => {
	addExternalStyle('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
};

const rootUrl = new URL(document.currentScript.src).origin;
const isDev = !rootUrl.endsWith('.asaptickets.com') && !rootUrl.endsWith('.stage.dyninno.net');
window.GdsDirectPlusParams = window.GdsDirectPlusParams || {
	rootUrl: rootUrl,
	socketHost: isDev
		? rootUrl.replace(/:\d+$/, '') + ':' + 3022
		: rootUrl,
	isForeignProjectEmcId: false,
	emcSessionId: null,
	travelRequestId: null,
	cmsUrl: null,
    auth: null,
	codeUpdateInfo: null,
	// set to true from console to test
	disableAllRoles: false,
};

/**
 * code expects that root element is displayed on the moment of first initialization
 */
const whenVisible = (htmlRootDom, action) =>
	new Promise((resolve) => {
		let checkVisible = () => {
			let isVisible = htmlRootDom.offsetParent !== null;
			if (isVisible) {
				resolve(action());
			} else {
				setTimeout(checkVisible, 500);
			}
		};
		checkVisible();
	});

const onEmcSessionId = (emcSessionId, params) => {
	// probably better would be to pass it through all these abstractions
	// to the session.es6 instead of making a global variable...
	window.GdsDirectPlusParams.emcSessionId = emcSessionId;
	// problems? should, like, prefix them at some point maybe...
	let leadId = params.scheduleChangeId || params.travelRequestId;
	window.GdsDirectPlusParams.travelRequestId = leadId;
	window.GdsDirectPlusParams.cmsUrl = params.cmsUrl;
	window.GdsDirectPlusParams.socketHost = params.socketHost || window.GdsDirectPlusParams.socketHost;
	params.htmlRootDom.innerHTML = '<h2 class="pls-wait-placeholder" style="background-color: black; color: white">Please wait, loading user data...</h2>';

	let loadView = requests.get('/gdsDirect/view');
	let loadThemes = requests.get('/gdsDirect/themes');

	return Promise.all([loadView, loadThemes])
		.then(([viewData, themeData]) => {
			syncJsCache();
			initThemeStyles(themeData, params.htmlRootDom);
			[...params.htmlRootDom.querySelectorAll('.pls-wait-placeholder')]
				.forEach(ph => ph.remove());
			return whenVisible(params.htmlRootDom, () => {
				initGlobEvents(params.htmlRootDom);
				return new GdsDirectPlusApp(params, viewData, themeData);
			});
		});
};

const getEmcSessionIdFromCookie = () => {
	let emcSessionId = cookies.get('GDS_DIRECT_PLUS_AUTH');
	if (!emcSessionId) {
		return Promise.reject('No EMC session id in cookie');
	} else {
		return fetch(rootUrl + '/checkEmcSessionId?emcSessionId=' + emcSessionId)
			.then(rs => rs.json()).then(data => data.isValid
				? Promise.resolve(emcSessionId)
				: Promise.reject('EMC session id from cookie is not valid'));
	}
};

/**
 * supposed to be injected in a <script> tag (either
 * statically or via js dynamic DOM generation)
 *
 * @return {Promise<GdsDirectPlusApp>}
 */
window.InitGdsDirectPlusApp = (params) => {
	let whenEmcSessionId;
	if (!params.getCrossAuthToken) {
		window.GdsDirectPlusParams.isForeignProjectEmcId =
			params.isForeignProjectEmcId === undefined
				? true : params.isForeignProjectEmcId;
		whenEmcSessionId = Promise.resolve(params.emcSessionId);
	} else {
		whenEmcSessionId = getEmcSessionIdFromCookie()
			.catch(() => Promise.resolve()
				.then(() => params.getCrossAuthToken())
				.then(token => token ? token : Promise.reject('Provided cross-auth token was empty'))
				.then(token => fetch(rootUrl + '/authorizeEmcToken?token=' + token, {
					headers: {'Cache-Control': 'no-cache'},
				}))
				.then(rs => rs.json()).then(data => data.emcSessionId)
				.then(emcSessionId => {
					cookies.set('GDS_DIRECT_PLUS_AUTH', emcSessionId);
					return emcSessionId;
				}))
			.catch(exc => {
				window.GdsDirectPlusParams.isForeignProjectEmcId = true;
				console.error('Failed to cross-authorize token, falling back to CMS auth', exc);
				cookies.set('GDS_DIRECT_PLUS_AUTH', '');
				return params.emcSessionId
					? Promise.resolve(params.emcSessionId)
					: Promise.reject(exc);
			});
	}
	return whenEmcSessionId.then(emcSessionId => {
		return onEmcSessionId(emcSessionId, params);
	});
};

window.InitGdsDirectPlusApp.AdminApps = () => {
	// required for modals.js, not included in injected
	// part of the app, because it conflicts with CMS UI
	require('bootstrap');
	let cssUrl = rootUrl + '/public/src/theme/entry/standalone.css';
	addExternalStyle(cssUrl);
	return {
		HighlightRulesAdminApp: HighlightRulesAdminApp,
		TerminalThemesAdminApp: TerminalThemesAdminApp,
	};
};

addExternalStyles();
