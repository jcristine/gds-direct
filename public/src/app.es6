
import './theme/entry/main.less';
import {getStore} from "./store";
import requests from  "./helpers/requests";
import {post} from  "./helpers/requests";
import GdsDirectPlusApp from  "./modules/GdsDirectPlusApp";
import HighlightRulesAdminApp from "./modules/HighlightRulesAdminApp";
import TerminalThemesAdminApp from "./modules/TerminalThemesAdminApp";
import TerminalSessionListApp from "./modules/TerminalSessionListApp";

let cookies = {
	get: (key) => {
		let cookieData = {};
		for (let pair of document.cookie.split('; ')) {
			let [key, value] = pair.split('=');
			cookieData[key] = value;
		}
		return cookieData[key];
	},
	set: (key, value) => {
		document.cookie = key + '=' + value;
	},
};

let versionKey = 'GDS_DIRECT_PLUS_VERSION';
let effectiveVersion = cookies.get(versionKey);

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

	let countErrors = 0;
	/** @param {Error|{message, stack, filename, lineno, colno}} data */
	let handleGenericError = (data) => {
		let {message, stack} = data;
		++countErrors;
		if (countErrors >= 3) {
			return false;
		}
		// taken from CMS
		let doNotLog = ['NS_ERROR_FAILURE:', 'NS_ERROR_STORAGE_IOERR:', 'Error: Script error for', 'NS_ERROR_FILE_CORRUPTED:', 'Uncaught Error: Script error for', 'ReferenceError: vendor_lib'];
		if (doNotLog.some(prefix => message.startsWith(prefix))) {
			return false;
		}
		if (!stack || stack.indexOf('terminal-bundle.js') < 0 ||
			stack.indexOf('/sabre/public/terminal-bundle.js') >= 0 // old code in CMS
		) {
			return false; // not a GDS Direct+ error
		}
		post('/system/reportJsError', {
			...data, message, stack,
			effectiveVersion: effectiveVersion,
			codeUpdateInfo: window.GdsDirectPlusParams.codeUpdateInfo,
		});
	};
	let errorsLog = {};
	/** @param {ErrorEvent} e */
	let onerror = (e) => {
		let {message, filename, lineno, colno, error} = e;
		let stack = error.stack;
		let keyIndex = lineno + ':' + colno;
		if (errorsLog[keyIndex]) {
			return false;
		}
		errorsLog[keyIndex] = 1;
		handleGenericError({message, filename, lineno, colno, stack: stack});
	};
	/** @param {PromiseRejectionEvent} e */
	let onrejection = (e) => {
		handleGenericError(e.reason);
	};
	window.addEventListener('error', onerror);
	// Most errors will be it. Not supported by firefox ATM sadly...
	window.addEventListener('unhandledrejection', onrejection);
};

let addCss = (cssText, htmlRootDom) => {
	let style = document.createElement('style');
	style.class = 'generated-theme-css';
	style.type = 'text/css';
	style.appendChild(document.createTextNode(cssText));
	htmlRootDom.appendChild(style);
};

let addExternalStyle = (url) => {
	let link = document.createElement('link');
	link.class = 'generated-fa-css';
	link.rel = 'stylesheet';
	link.type = 'text/css';
	document.head.appendChild(link);
	link.setAttribute('href', url);
};

let addExternalStyles = () => {
	addExternalStyle('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
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
 * I'm going to set Cache-Control: 3600, but I still
 * want agents to get updated code after refresh
 */
let syncJsCache = () => {
	fetch(rootUrl + '/public/CURRENT_PRODUCTION_TAG', {
		headers: {'Cache-Control': 'no-cache'},
	})	.then(rs => rs.text())
		.then(latestVersion => {
			if (latestVersion !== effectiveVersion) {
				// update the cached code - on next reload user will get up-to-date js
				fetch(rootUrl + '/public/terminal-bundle.js', {cache: 'reload'})
					.then(rs => rs.text())
					.then(latestCode => {
						cookies.set(versionKey, latestVersion);
						// could show a "please reload page" warning somewhere in corner of screen
						window.GdsDirectPlusParams.codeUpdateInfo = {
							effectiveVersion: effectiveVersion,
							latestVersion: latestVersion,
						};
					});
			}
		});
};

/**
 * code expects that root element is displayed on the moment of first initialization
 */
let whenVisible = (htmlRootDom, action) =>
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
			syncJsCache();
			initThemeStyles(themeData, params.htmlRootDom);
			params.htmlRootDom.querySelectorAll('.pls-wait-placeholder')
				.forEach(ph => ph.remove());
			return whenVisible(params.htmlRootDom, () => {
				initGlobEvents(params.htmlRootDom);
				return new GdsDirectPlusApp(params, viewData, themeData);
			});
		});
};

let getEmcSessionIdFromCookie = () => {
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
 */
window.InitGdsDirectPlusApp = (params) => {
	let whenEmcSessionId;
	if (!params.getCrossAuthToken) {
		window.GdsDirectPlusParams.isForeignProjectEmcId = true;
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
		TerminalSessionListApp: TerminalSessionListApp,
	};
};

addExternalStyles();