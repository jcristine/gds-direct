
import './theme/entry/main.less';
import {getStore} from "./store";
import requests from  "./helpers/requests";
import GdsDirectPlusApp from  "./modules/GdsDirectPlusApp";
import HighlightRulesAdminApp from "./modules/HighlightRulesAdminApp";
import TerminalThemesAdminApp from "./modules/TerminalThemesAdminApp";
import TerminalSessionListApp from "./modules/TerminalSessionListApp";


const initGlobEvents = (htmlRootDom) => {

	let ctrlKeyDown = false;
	let lastCtrlAt = 0;

	let isAppActive = () => htmlRootDom.offsetParent !== null;

	// should return true when it is _Ctrl + W_ as agent often
	// accidentally type it, since there is such shortcut in Focal Point
	// if (terminalDom.isVisible && isCtrlKeyPressed)
	let shouldConfirmClosing = () => {
		return isAppActive()
			&& ctrlKeyDown
			// if ctrl was released outside
			&& Date.now() - lastCtrlAt < 5 * 1000;
	};

	window.addEventListener('resize', (e) => {

		// console.warn('on resize');

		// if (resizeTimeout)
		// {
		// 	clearInterval(resizeTimeout);
		// }

		let store = getStore();
		if (store) {
			store.updateView();
		}
		// resizeTimeout = setTimeout( () => getStore().updateView(), 0 );
	});

	window.addEventListener('beforeunload', (e) => {
		if (shouldConfirmClosing()) {
			ctrlKeyDown = false;
			e.preventDefault(); // firefox
			// does not affect the prompt message in 2019, but still...
			let msg = 'Terminal window active, you sure want to close tab?';
			e.returnValue = msg; // chrome
			return msg; // chrome
		}
	});

	window.addEventListener('keydown', (e) => {
		if (e.ctrlKey) {
			lastCtrlAt = Date.now();
			ctrlKeyDown = true;
		} else {
			ctrlKeyDown = false;
		}
	});
	window.addEventListener('keyup', (e) => ctrlKeyDown = e.ctrlKey);
};

let addCss = (cssText, htmlRootDom) => {
	let style = document.createElement('style');
	style.class = 'generated-theme-css';
	style.type = 'text/css';
	style.appendChild(document.createTextNode(cssText));
	htmlRootDom.appendChild(style);
};

let addExternalStyles = () => {
	let link = document.createElement('link');
	link.class = 'generated-fa-css';
	link.rel = 'stylesheet';
	link.type = 'text/css';
	document.head.appendChild(link);
	link.setAttribute('href', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
};

let initThemeStyles = (responseData, htmlRootDom) => {
	let cssLines = [];
	let classList = ['defaultBg', 'outputFont', 'activeWindow', 'entryFont', 'usedCommand', 'errorMessage',
		'warningMessage', 'startSession', 'specialHighlight', 'fixedColumnBackground',
		'highlightDark', 'highlightLight', 'highlightBlue'];
	for (let row of responseData.terminalThemes) {
		let prefix = '.terminaltheme_' + row.id;
		for (let cls of classList) {
			if (row.colors[cls]) {
				let className;
				if (cls === 'defaultBg') {
					className = 'terminal-cell';
				} else if (cls === 'outputFont') {
					className = 'terminal';
				} else if (cls === 'entryFont') {
					className = 'cmd';
				} else {
					className = cls;
				}
				let props = [];
				for (let k1 in row.colors[cls]) {
					let v1 = row.colors[cls][k1];
					props.push(k1 + ':' + v1 + ';');
				}
				cssLines.push(prefix + ' .' + className + ' { ' + props.join(' ') + ' }');
				cssLines.push(prefix + ' .' + className + ' pre { ' + props.join(' ') + ' }');
			}
		}
		for (let cls in row.colorsParsed) {
			let props = [];
			let style = row.colorsParsed[cls];
			for (let k1 in style) {
				let v1 = style[k1];
				props.push(k1 + ':' + v1 + ';');
			}
			cssLines.push(prefix + ' .' + cls + ' { ' + props.join(' ') + ' }');
			cssLines.push(prefix + ' .' + cls + ' pre { ' + props.join(' ') + ' }');
		}
	}
	addCss(cssLines.join('\n'), htmlRootDom);
};

let isDev = !(window.location.hostname + '').endsWith('.asaptickets.com');
let rootUrl = new URL(document.currentScript.src).origin;
window.GdsDirectPlusParams = window.GdsDirectPlusParams || {
	rootUrl: rootUrl,
	socketHost: isDev
		? rootUrl.replace(/:\d+$/, '') + ':' + 3022
		: rootUrl,
	emcSessionId: null,
	travelRequestId: null,
	cmsUrl: null,
    auth: null,
};

let onEmcSessionId = (emcSessionId, params) => {
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
			params.htmlRootDom.querySelectorAll('.pls-wait-placeholder')
				.forEach(ph => ph.remove());
			initGlobEvents(params.htmlRootDom);
			initThemeStyles(themeData, params.htmlRootDom);
			return new GdsDirectPlusApp(params, viewData, themeData);
		});
};

let getEmcSessionIdFromCookie = () => {
	let cookieData = {};
	for (let pair of document.cookie.split('; ')) {
		let [key, value] = pair.split('=');
		cookieData[key] = value;
	}
	let emcSessionId = cookieData['GDS_DIRECT_PLUS_AUTH'];
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
 */
window.InitGdsDirectPlusApp = (params) => {
	let whenEmcSessionId = !params.getCrossAuthToken
		? Promise.resolve(params.emcSessionId)
		: getEmcSessionIdFromCookie()
			.catch(() => Promise.resolve()
				.then(() => params.getCrossAuthToken())
				.then(token => token ? token : Promise.reject('Provided cross-auth token was empty'))
				.then(token => fetch(rootUrl + '/authorizeEmcToken?token=' + token))
				.then(rs => rs.json()).then(data => data.emcSessionId)
				.then(emcSessionId => {
					document.cookie = 'GDS_DIRECT_PLUS_AUTH=' + emcSessionId;
					return emcSessionId;
				}))
			.catch(exc => {
				document.cookie = 'GDS_DIRECT_PLUS_AUTH=';
				return params.emcSessionId
					? Promise.resolve(params.emcSessionId)
					: Promise.reject(exc);
			});
	return whenEmcSessionId.then(emcSessionId => {
		return onEmcSessionId(emcSessionId, params);
	});
};

window.InitGdsDirectPlusApp.AdminApps = () => {
	// required for modals.js, not included in injected
	// part of the app, because it conflicts with CMS UI
	require('bootstrap');
	require('./theme/entry/standalone.less');
	return {
		HighlightRulesAdminApp: HighlightRulesAdminApp,
		TerminalThemesAdminApp: TerminalThemesAdminApp,
		TerminalSessionListApp: TerminalSessionListApp,
	};
};

addExternalStyles();