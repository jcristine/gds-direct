import {getStore} from "../store";
import {post} from "./requests";

/** @deprecated - should reuse cookie.es6 */
export const cookies = {
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

const versionKey = 'GDS_DIRECT_PLUS_VERSION';
const effectiveVersion = cookies.get(versionKey);

export const initGlobEvents = (htmlRootDom) => {

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
		if (doNotLog.some(prefix => (message || '').startsWith(prefix))) {
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
		if (!e) {
			// if you reject() without an argument, no info, no point logging it
			return false;
		}
		if (e.httpStatusCode) {
			// server error responses, already reported to diag if relevant
			return false;
		}
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
		if (e.httpStatusCode) {
			// server error responses, already reported to diag if relevant
			return;
		}
		handleGenericError(e.reason || {message: 'Rejection with empty reason', error: e});
	};
	window.addEventListener('error', onerror);
	// Most errors will be it. Not supported by firefox ATM sadly...
	window.addEventListener('unhandledrejection', onrejection);
};

/**
 * I'm going to set Cache-Control: 3600, but I still
 * want agents to get updated code after refresh
 */
export const syncJsCache = (rootUrl) => {
	fetch(rootUrl + '/CURRENT_PRODUCTION_TAG', {
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

export const addExternalStyle = (url) => {
	let link = document.createElement('link');
	link.class = 'generated-fa-css';
	link.rel = 'stylesheet';
	link.type = 'text/css';
	document.head.appendChild(link);
	link.setAttribute('href', url);
};

const addCss = (cssText, htmlRootDom) => {
	let style = document.createElement('style');
	style.class = 'generated-theme-css';
	style.type = 'text/css';
	style.appendChild(document.createTextNode(cssText));
	htmlRootDom.appendChild(style);
};

export const initThemeStyles = (responseData, htmlRootDom) => {
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
