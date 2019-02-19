
import './theme/main.less';

import {getStore} from "./store";
import requests from  "./helpers/requests";
import GdsDirectPlusApp from  "./modules/GdsDirectPlusApp";
import HighlightRulesAdminApp from "./modules/HighlightRulesAdminApp";
import TerminalThemesAdminApp from "./modules/TerminalThemesAdminApp";
import TerminalSessionListApp from "./modules/TerminalSessionListApp";

const initGlobEvents = () => {

	window.onresize = () => {

		// console.warn('on resize');

		// if (resizeTimeout)
		// {
		// 	clearInterval(resizeTimeout);
		// }

		getStore().updateView();
		// resizeTimeout = setTimeout( () => getStore().updateView(), 0 );
	};
};

const initThemeStyles = responseData => {
	let head = document.head;
	let style = document.createElement('style');
	style.class = 'generated-theme-css';
	style.type = 'text/css';
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
		}
	}
	style.appendChild(document.createTextNode(cssLines.join('\n')));
	head.appendChild(style);
};

let isDev = !(window.location.hostname + '').endsWith('.asaptickets.com');
let rootUrl = new URL(document.currentScript.src).origin;
window.GdsDirectPlusParams = window.GdsDirectPlusParams || {
	rootUrl: rootUrl,
	socketHost: isDev
		? rootUrl.replace(/:\d+$/, '') + ':' + 3022
		: rootUrl + '/socket.io',
	emcSessionId: null,
	travelRequestId: null,
	cmsUrl: null,
    auth: null,
};

/**
 * supposed to be injected in a <script> tag (either
 * statically or via js dynamic DOM generation)
 */
window.InitGdsDirectPlusApp = (params) => {
	// probably better would be to pass it through all these abstractions
	// to the session.es6 instead of making a global variable...
	window.GdsDirectPlusParams.emcSessionId = params.emcSessionId;
	window.GdsDirectPlusParams.travelRequestId = params.travelRequestId;
	window.GdsDirectPlusParams.cmsUrl = params.cmsUrl;
	window.GdsDirectPlusParams.socketHost = params.socketHost || window.GdsDirectPlusParams.socketHost;
	initGlobEvents();
	params.htmlRootDom.innerHTML = '<h2 style="background-color: white; color: black">Please wait, loading user data...</h2>';

	let loadView = requests.get('/gdsDirect/view');
	let loadThemes = requests.get('/gdsDirect/themes');
	return Promise.all([loadView, loadThemes])
		.then(([viewData, themeData]) => {
			initThemeStyles(themeData);
			return new GdsDirectPlusApp(params, viewData, themeData);
		});
};

window.InitGdsDirectPlusApp.HighlightRulesAdminApp = HighlightRulesAdminApp;
window.InitGdsDirectPlusApp.TerminalThemesAdminApp = TerminalThemesAdminApp;
window.InitGdsDirectPlusApp.TerminalSessionListApp = TerminalSessionListApp;
