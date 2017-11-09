/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UPDATE_STATE = exports.FULL_SCREEN = exports.SWITCH_TERMINAL = exports.UPDATE_CUR_GDS = exports.PURGE_SCREENS = exports.CHANGE_GDS = exports.CHANGE_SESSION_BY_MENU = exports.CLOSE_PQ_WINDOW = exports.PQ_MODAL_SHOW_DEV = exports.PQ_MODAL_SHOW = exports.HIDE_PQ_QUOTES = exports.SHOW_PQ_QUOTES = exports.CHANGE_MATRIX = exports.CHANGE_ACTIVE_TERMINAL = exports.GET_HISTORY = exports.DEV_CMD_STACK_RUN = exports.CHANGE_INPUT_LANGUAGE = exports.INIT = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = __webpack_require__(6);

var _requests = __webpack_require__(5);

var _state = __webpack_require__(17);

var _gds = __webpack_require__(9);

var _gds2 = _interopRequireDefault(_gds);

var _containerMain = __webpack_require__(18);

var _containerMain2 = _interopRequireDefault(_containerMain);

var _fullscreen = __webpack_require__(46);

var _fullscreen2 = _interopRequireDefault(_fullscreen);

var _pqParser = __webpack_require__(47);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var state = void 0,
    Gds = {},
    Container = void 0,
    pqParser = void 0;

var INIT = function INIT(_ref) {
	var settings = _ref.settings,
	    params = _objectWithoutProperties(_ref, ["settings"]);

	pqParser = new _pqParser.PqParser(params["PqPriceModal"]);

	_gds2.default.makeList(settings['gds']).forEach(function (gds) {
		return Gds[gds['name']] = gds;
	});

	state = window.TerminalState = new _state.TerminalState(params);

	Container = new _containerMain2.default(params['htmlRootId']);

	state.setProvider(function (state) {
		return Container.render(state);
	});

	state.change({
		gdsObj: Gds[settings['common']['currentGds'] || 'apollo']
	});
};

exports.INIT = INIT;
var CHANGE_INPUT_LANGUAGE = exports.CHANGE_INPUT_LANGUAGE = function CHANGE_INPUT_LANGUAGE(language) {
	GET('terminal/saveSetting/language', language);
	state.change({ language: language });
};

var DEV_CMD_STACK_RUN = exports.DEV_CMD_STACK_RUN = function DEV_CMD_STACK_RUN(command) {

	if (state.getGdsObj()['curTerminalId'] >= 0) {
		window.activePlugin.terminal.exec(command);
		return Promise.resolve();
	}

	alert('Please select terminal first');
	return Promise.reject();
};

var GET = function GET(urlPart, param) {
	return (0, _requests.get)(urlPart + '/' + state.getGds() + '/' + param);
};

var GET_HISTORY = exports.GET_HISTORY = function GET_HISTORY() {
	return (0, _requests.get)("terminal/lastCommands?rId=" + state.getRequestId() + "&gds=" + state.getGds());
};

var CHANGE_ACTIVE_TERMINAL = exports.CHANGE_ACTIVE_TERMINAL = function CHANGE_ACTIVE_TERMINAL(_ref2) {
	var gds = _ref2.gds,
	    curTerminalId = _ref2.curTerminalId;


	GET('terminal/saveSetting/terminal', name + 1);

	Gds[gds] = _extends({}, Gds[gds], { curTerminalId: curTerminalId });

	state.change({
		gdsObj: Gds[gds]
	});
};

var CHANGE_MATRIX = exports.CHANGE_MATRIX = function CHANGE_MATRIX(matrix) {
	localStorage.setItem('matrix', JSON.stringify(matrix));

	var gds = state.getGds();
	Gds[gds] = _extends({}, Gds[gds], { matrix: matrix });

	state.change({
		gdsObj: Gds[gds]
	});
};

var SHOW_PQ_QUOTES = exports.SHOW_PQ_QUOTES = function SHOW_PQ_QUOTES(e) {
	e.target.innerHTML = 'Loading...';

	(0, _requests.get)("terminal/priceQuotes?rId=" + state.getRequestId()).then(function (response) {
		e.target.innerHTML = 'Quotes';

		state.change({
			pqToShow: response,
			hideMenu: true
		});
	});
};

var HIDE_PQ_QUOTES = exports.HIDE_PQ_QUOTES = function HIDE_PQ_QUOTES() {
	state.change({
		pqToShow: false,
		hideMenu: false
	});
};

var PQ_MODAL_SHOW = exports.PQ_MODAL_SHOW = function PQ_MODAL_SHOW() {

	if (!state.getGdsObj().canCreatePq) return false;

	return pqParser.show(state.getGdsObj()['canCreatePqErrors'], state.getRequestId());
};

var PQ_MODAL_SHOW_DEV = exports.PQ_MODAL_SHOW_DEV = function PQ_MODAL_SHOW_DEV() {
	return pqParser.show(state.getGdsObj()['canCreatePqErrors'], state.getRequestId());
};

var CLOSE_PQ_WINDOW = exports.CLOSE_PQ_WINDOW = function CLOSE_PQ_WINDOW() {
	state.change({
		hideMenu: false
	});
};

var CHANGE_SESSION_BY_MENU = exports.CHANGE_SESSION_BY_MENU = function CHANGE_SESSION_BY_MENU(area) {
	var command = (state.isGdsApollo() ? 'S' : '¤') + area;

	GET('terminal/saveSetting/area', area);
	return DEV_CMD_STACK_RUN([command]);
};

var CHANGE_GDS = exports.CHANGE_GDS = function CHANGE_GDS(gdsName) {
	GET('terminal/saveSetting/gds', gdsName);

	// Gds[state.getGds()] = state.getGdsObj(); // save prev gds state

	state.change({
		gdsObj: Gds[gdsName]
	});
};

var PURGE_SCREENS = exports.PURGE_SCREENS = function PURGE_SCREENS(gds) {
	Container.purgeScreens(gds);
	(0, _requests.get)('terminal/clearBuffer', true);
};

var UPDATE_CUR_GDS = exports.UPDATE_CUR_GDS = function UPDATE_CUR_GDS(gdsName, _ref3) {
	var canCreatePq = _ref3.canCreatePq,
	    canCreatePqErrors = _ref3.canCreatePqErrors,
	    area = _ref3.area,
	    pcc = _ref3.pcc,
	    startNewSession = _ref3.startNewSession;

	// Gds[this.getGds()] 	= this.state.gdsObj; //issue 02

	var sessionIndex = _constants.AREA_LIST.indexOf(area);
	var newPcc = _defineProperty({}, sessionIndex, pcc);

	Gds[gdsName]['pcc'] = startNewSession ? newPcc : _extends({}, Gds[gdsName]['pcc'], newPcc);
	Gds[gdsName] = _extends({}, Gds[gdsName], { canCreatePq: canCreatePq, canCreatePqErrors: canCreatePqErrors, sessionIndex: sessionIndex });

	state.change({
		gdsObj: Gds[gdsName]
	});
};

var SWITCH_TERMINAL = exports.SWITCH_TERMINAL = function SWITCH_TERMINAL(gds, index) {

	var terminal = Container.getTerminal(gds, index);

	if (terminal.plugin !== null) return terminal.plugin.terminal.focus();

	terminal.context.click();
};

var FULL_SCREEN = exports.FULL_SCREEN = function FULL_SCREEN() {
	if (state.getGdsObj()['curTerminalId'] >= 0) return _fullscreen2.default.show(state.getGds(), window.activePlugin.terminal);

	alert('no terminal selected');
};

var UPDATE_STATE = exports.UPDATE_STATE = function UPDATE_STATE(props) {
	state.change(props);
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = Dom;
var applyProperties = function applyProperties(node, list) {
	Object.keys(list).map(function (index) {
		if (index === 'style') {
			node.setAttribute('style', list[index]);
		} else {
			node[index] = list[index];
		}
	});
};

function Dom(str) {
	var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


	var innerHTML = void 0;

	var matches = str.match(/\[(.*?)\]/);

	if (matches) {
		innerHTML = matches[1];
		str = str.replace('[' + innerHTML + ']', '');
	}

	var _str$split = str.split('.'),
	    _str$split2 = _slicedToArray(_str$split, 2),
	    node = _str$split2[0],
	    className = _str$split2[1];

	var element = document.createElement(node);

	if (className) element.className = className;

	if (innerHTML) element.innerHTML = innerHTML;

	applyProperties(element, props);
	return element;
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = vendor_lib;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function () {
	function Component(selector) {
		_classCallCheck(this, Component);

		this.context = (0, _dom2.default)(selector);
		this.observers = [];
	}

	_createClass(Component, [{
		key: 'observe',
		value: function observe(component) {
			this.observers.push(component);
			this.context.appendChild(component.getContext());
			return this;
		}
	}, {
		key: 'addToObserve',
		value: function addToObserve(component) {
			this.observers.push(component);
			return this;
		}
	}, {
		key: 'append',
		value: function append(component) {
			this.context.appendChild(component.getContext());
			return this;
		}
	}, {
		key: 'attach',
		value: function attach(element) {
			this.context.appendChild(element);
		}
	}, {
		key: 'getContext',
		value: function getContext() {
			return this.context;
		}
	}, {
		key: 'render',
		value: function render(params) {
			var _this = this;

			if (typeof this.stateToProps === 'function') {
				var props = this.stateToProps(params);

				if (JSON.stringify(props) === JSON.stringify(this.props)) {
					return '';
				}

				if (props) {
					this.props = JSON.parse(JSON.stringify(props));
				}
			} else {
				this.props = params;
			}

			if (typeof this._renderer === 'function') {
				this._renderer();
			}

			this.observers.map(function (component) {
				component.render(_this.props);
			});

			return this.context;
		}
	}]);

	return Component;
}();

exports.default = Component;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tetherDrop = __webpack_require__(21);

var _tetherDrop2 = _interopRequireDefault(_tetherDrop);

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// classes		: 'drop-theme-arrows',
// classes		: 'drop-theme-hubspot-popovers',
// classes		: 'drop-theme-basic',

// const CLASS_NAME = 'drop-theme-hubspot-popovers';
var CLASS_NAME = 'drop-theme-twipsy';
// const CLASS_NAME = 'drop-theme-arrows-bounce';
// const CLASS_NAME = 'drop-theme-arrows-bounce-dark';
// const CLASS_NAME = 'drop-theme-basic';
// const CLASS_NAME = 'drop-theme-arrows';

var ButtonPopOver = function () {
	function ButtonPopOver(params) {
		_classCallCheck(this, ButtonPopOver);

		this.settings = params;
		this.popContent = this.popContent = (0, _dom2.default)('div');
	}

	_createClass(ButtonPopOver, [{
		key: 'makeTrigger',
		value: function makeTrigger() {
			this.trigger = (0, _dom2.default)('button.btn btn-primary font-bold');
			this.trigger.onclick = this.makePopover.bind(this);
			this.trigger.innerHTML = this.settings.icon;

			return this.trigger;
		}
	}, {
		key: 'makePopover',
		value: function makePopover() {
			this.popover = this.popover || new _tetherDrop2.default({
				target: this.getTrigger(),
				content: this.getPopContent(),
				classes: CLASS_NAME,
				position: 'left top',
				openOn: 'click'
			});

			if (this.settings.onOpen) this.popover.on('open', this.settings.onOpen);

			this.trigger.onclick = false;
			this.popover.open();
			// this.trigger.click();
		}
	}, {
		key: 'getTrigger',
		value: function getTrigger() {
			return this.trigger;
		}
	}, {
		key: 'getPopContent',
		value: function getPopContent() {
			this.build();
			return this.popContent;
		}
	}, {
		key: 'build',
		value: function build() {
			console.warn('Build Popover method undefined in child component ');
		}
	}]);

	return ButtonPopOver;
}();

exports.default = ButtonPopOver;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setLink = exports.get = undefined;

var _constants = __webpack_require__(6);

__webpack_require__(14);

var _debug = __webpack_require__(8);

var JParam = __webpack_require__(16);

var Url = void 0;

var Ask = function Ask(url, params) {
	if (url.substr(0, 1) !== '/') url = '/' + url;

	return fetch(wwwFullDir + url, params).then(function (response) {
		return response.json();
	}).then(_debug.showUserMessages).catch(_debug.debugRequest);
};

var get = exports.get = function get(url) {
	var defParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	if (!url) return '';

	if (defParams) url += '?rId=' + window.apiData.rId;

	return Ask(url, { credentials: 'include' });
};

var runSyncCommand = function runSyncCommand(postData) {
	return Ask(_constants.API_HOST + Url, {
		credentials: 'include',
		body: JParam(postData),
		method: 'POST',
		headers: {
			'Accept': 'application/json, application/xml, text/plain, text/html, .',
			'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
		}
	});
};

var setLink = exports.setLink = function setLink(url) {
	Url = url || _constants.END_POINT_URL;
};

exports.default = {
	runSyncCommand: runSyncCommand,
	get: get
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var END_POINT_URL = exports.END_POINT_URL = 'terminal/command?';
var TIME_FORMAT = exports.TIME_FORMAT = '12';
var ACCOUNT = exports.ACCOUNT = 'training';
var API_HOST = exports.API_HOST = '';
var KEEP_ALIVE_REFRESH = exports.KEEP_ALIVE_REFRESH = 60000;
var AREA_LIST = exports.AREA_LIST = ['A', 'B', 'C', 'D', 'E', 'F'];
var GDS_LIST = exports.GDS_LIST = ['apollo', 'sabre', 'amadeus'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var common = {
	'`': '>',
	'[': '¤',
	']': '$',
	'=': '*',
	';': ':',
	'\'': '‡',
	'\\': '§'
};

var sabreLayout = Object.assign({}, common);
var apolloLayout = Object.assign({}, common, {
	',': '+'
});

var _to_ascii = {
	'188': '44',
	'109': '45',
	'190': '46',
	'191': '47',
	'192': '96',
	'220': '92',
	'222': '39',
	'221': '93',
	'219': '91',
	'173': '45',
	'187': '61', //IE Key codes
	'186': '59', //IE Key codes
	'189': '45', //IE Key codes

	'59': '59', //FF Key codes  ;
	'61': '61' //FF Key codes  =
};

var getReplacement = exports.getReplacement = function getReplacement(evt, isApollo) {
	// const char = String.fromCharCode(_to_ascii[ evt.keyCode || evt.which ] );
	var char = String.fromCharCode(evt.keyCode || evt.which);
	return isApollo ? apolloLayout[char] : sabreLayout[char];
};

var chunkIntoPages = function chunkIntoPages(linesArr, rowsPerScreen) {
	return linesArr.map(function (line, lineIndex) {
		return lineIndex % rowsPerScreen ? [] : linesArr.slice(lineIndex, lineIndex + rowsPerScreen);
	}).filter(function (data) {
		return !!data.length;
	});
};

var makePages = exports.makePages = function makePages(txt) {
	var rowsPerScreen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
	var maxCharLimit = arguments[2];

	var chunkByCharLimit = splitIntoLinesArr(txt, maxCharLimit);

	return chunkIntoPages(chunkByCharLimit, rowsPerScreen).map(function (sectionLines) {
		return sectionLines.join('\n');
	});
};

var splitIntoLinesArr = exports.splitIntoLinesArr = function splitIntoLinesArr(txt, maxCharLimit) {
	var lines = splitLines(txt);
	var regex = new RegExp('(.{1,' + maxCharLimit + '})', 'gi');

	var chunkByCharLimit = [];

	lines.forEach(function (line) {
		var lineArr = line.match(regex);
		chunkByCharLimit = chunkByCharLimit.concat(lineArr);
	});

	return chunkByCharLimit;
};

var splitLines = function splitLines(txt) {
	return txt.split(/\r?\n/);
};

var makeDate = function makeDate(d) {
	return d < 10 ? '0' + d : d;
};

var getDate = exports.getDate = function getDate() {
	var d = new Date();
	var date = d.getDate();
	var d2 = new Date();
	var dPlus320 = new Date(d2.setDate(date + 320));
	var p320Date = dPlus320.getDate();
	var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

	return {
		now: makeDate(date) + months[d.getMonth()],
		plus320: makeDate(p320Date) + months[dPlus320.getMonth()]
	};
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.notify = exports.showUserMessages = exports.debugRequest = exports.Debug = undefined;

var _noty = __webpack_require__(15);

var _noty2 = _interopRequireDefault(_noty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Debug = exports.Debug = function Debug(txt, type) {
	new _noty2.default({
		text: 'DEBUG : <strong>' + txt + '</strong>',
		layout: 'bottomCenter',
		timeout: 1500,
		theme: 'metroui',
		type: type || 'info',
		progressBar: false,
		animation: {
			open: 'animated fadeIn', // Animate.css class names
			close: 'animated fadeOut' // Animate.css class names
		}
	}).show();
};

var debugRequest = exports.debugRequest = function debugRequest(err) {
	new _noty2.default({
		text: 'SERVER ERROR : ' + err,
		layout: 'bottomRight',
		timeout: 5000,
		type: 'error'
	}).show();

	console.warn('Server Returned: ', err);
};

var showUserMessages = exports.showUserMessages = function showUserMessages(response) {

	if (response && response['data'] && response['data']['userMessages']) {
		var userMessages = response['data']['userMessages'];

		notify({
			msg: userMessages.join(''),
			type: 'warning'
		});
	}

	return response;
};

var notify = exports.notify = function notify(_ref) {
	var msg = _ref.msg,
	    _ref$align = _ref.align,
	    align = _ref$align === undefined ? 'bottomLeft' : _ref$align,
	    _ref$type = _ref.type,
	    type = _ref$type === undefined ? 'error' : _ref$type;


	return new _noty2.default({
		text: '<p class="noty-wrap-text">' + msg + '</p>',
		layout: align,
		timeout: 100000,
		theme: 'mint',
		type: type,
		animation: {
			open: 'animated fadeIn', // Animate.css class names
			close: 'animated fadeOut' // Animate.css class names
		}
	}).show();
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = __webpack_require__(6);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var saved = localStorage.getItem('matrix');

var defaults = {
	sessionIndex: 0,
	pcc: {},
	matrix: saved ? JSON.parse(saved) : { rows: 1, cells: 1 },
	// activeTerminal	: null,
	canCreatePq: false,
	history: [],
	curTerminalId: undefined
};

var initGdsData = function initGdsData(name) {
	var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


	var props = {
		name: name,
		sessionIndex: _constants.AREA_LIST.indexOf(settings['area']),
		// canCreatePq		: 1,
		canCreatePq: false,
		list: name === 'sabre' ? _constants.AREA_LIST : _constants.AREA_LIST.slice(0, -1)
	};

	return _extends({}, defaults, props);
};

var GdsSet = function () {
	function GdsSet() {
		_classCallCheck(this, GdsSet);
	}

	_createClass(GdsSet, null, [{
		key: 'makeList',
		value: function makeList(savedGdsData) {
			return this.gdsList = _constants.GDS_LIST.map(function (name) {
				return initGdsData(name, savedGdsData[name]);
			});
		}
	}, {
		key: 'getList',
		value: function getList() {
			return this.gdsList;
		}
	}]);

	return GdsSet;
}();

exports.default = GdsSet;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.cookieGet = cookieGet;
exports.cookieSet = cookieSet;
function cookieGet(name) {
	var value = '; ' + document.cookie;
	var parts = value.split('; ' + name + '=');

	if (parts.length === 2) return parts.pop().split(';').shift();
}

function cookieSet(name, value, xdays) {
	var d = new Date();
	d.setTime(d.getTime() + xdays * 24 * 60 * 60 * 1000);
	var expires = 'expires=' + d.toUTCString();
	document.cookie = name + '=' + value + '; ' + expires;
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = __webpack_require__(30);

var _plugin2 = _interopRequireDefault(_plugin);

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

__webpack_require__(44);

var Terminal = function () {
	function Terminal(params) {
		var _this = this;

		_classCallCheck(this, Terminal);

		this.plugin = null;
		this.settings = params;
		this.context = (0, _dom2.default)('div.terminal');

		this.makeBuffer(params.buffer);

		this.context.onclick = function () {
			if (!_this.plugin) _this.init();
		};
	}

	_createClass(Terminal, [{
		key: 'init',
		value: function init() {
			var _this2 = this;

			this.plugin = new _plugin2.default({
				context: this.context,
				clear: function clear() {
					return _this2.clear();
				},
				name: this.settings['name'],
				gds: this.settings['gds'],
				numOfRows: this.numOfRows,
				numOfChars: this.numOfChars
			});
		}
	}, {
		key: 'makeBuffer',
		value: function makeBuffer(buf) {
			if (!buf) return false;

			var buffered = buf['buffering'].map(function (record) {

				var output = record.output ? '<pre style="white-space: pre-wrap; overflow: hidden">' + $.terminal.format(record.output) + ' </pre>' : '';

				return '<div class="command">\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<span class="usedCommand">' + record.command + '</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t' + output;
			}).join('');

			this.bufferDiv = (0, _dom2.default)('article.terminal-wrapper');
			this.bufferDiv.innerHTML = '<div class="terminal-output"> ' + buffered + ' </div>';

			this.context.appendChild(this.bufferDiv);
		}

		/*insertBuffer()
  {
  	if ( !this.settings.buffer )
  		return false;
  		this.settings.buffer['buffering'].forEach( (record) => {
  		this.plugin.terminal.echo(record.command, { finalize : function ( div ) {
  			div[0].className = 'command';
  		}});
  			this.plugin.terminal.echo(record.output);
  	});
  }*/

	}, {
		key: 'reattach',
		value: function reattach(parentNode, dimensions) {
			this.settings.parentContext = parentNode;

			this.context.style.height = parentNode.clientHeight + 'px';
			this.context.style.width = parentNode.clientWidth + 'px';

			this.settings.parentContext.appendChild(this.context);

			this.numOfRows = Math.floor(parentNode.clientHeight / dimensions.char.height);
			this.numOfChars = Math.floor(this.context.clientWidth / dimensions.char.width); //2 - padding-left px : need to fix


			if (this.plugin) {
				this.plugin.resize({
					numOfChars: this.numOfChars - 2,
					numOfRows: this.numOfRows
				});

				this.plugin.emptyLinesRecalculate(this.numOfRows, this.numOfChars, dimensions.char.height);
			}

			this.context.style.height = this.numOfRows * dimensions.char.height + 'px';

			this.context.scrollTop = this.context.scrollHeight;
		}
	}, {
		key: 'clear',
		value: function clear() {
			if (this.plugin) {
				this.plugin.terminal.clear();
				this.plugin.terminal.cmd().set('');
			}

			if (this.bufferDiv) {
				this.context.removeChild(this.bufferDiv);
				this.bufferDiv = false;
			}

			this.buffer = '';
		}
	}]);

	return Terminal;
}();

exports.default = Terminal;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(13);
module.exports = __webpack_require__(48);


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _requests = __webpack_require__(5);

var _actions = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Terminal = function Terminal(params) {
	_classCallCheck(this, Terminal);

	(0, _requests.setLink)(params['commandUrl']);
	(0, _actions.INIT)(params);
};

window.terminal = Terminal;

var resizeTimeout = void 0;

window.onresize = function () {

	if (resizeTimeout) clearInterval(resizeTimeout);

	resizeTimeout = setTimeout(function () {
		return (0, _actions.UPDATE_STATE)({});
	}, 50);
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(14);

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(11);

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(15);

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TerminalState = exports.TerminalState = function () {
	function TerminalState(_ref) {
		var permissions = _ref.permissions,
		    buffer = _ref.buffer,
		    requestId = _ref.requestId;

		_classCallCheck(this, TerminalState);

		this.state = {
			language: 'APOLLO',
			fontSize: 1,
			hideMenu: false,
			buffer: buffer,
			requestId: requestId
		};

		this.permissions = permissions;

		this.buffer = {
			gds: {}
		};

		if (buffer && buffer.gds) this.state.buffer = buffer.gds;
	}

	_createClass(TerminalState, [{
		key: 'setProvider',
		value: function setProvider(fn) {
			this.render = fn;
		}
	}, {
		key: 'hasPermissions',
		value: function hasPermissions() {
			return this.permissions;
		}
	}, {
		key: 'getMatrix',
		value: function getMatrix() {
			return this.state.gdsObj.matrix;
		}
	}, {
		key: 'getPcc',
		value: function getPcc() {
			return this.state.gdsObj.pcc;
		}
	}, {
		key: 'getActiveTerminal',
		value: function getActiveTerminal() {
			return this.state.gdsObj['activeTerminal'];
		}
	}, {
		key: 'getGds',
		value: function getGds() {
			return this.state.gdsObj['name'];
		}
	}, {
		key: 'getGdsObj',
		value: function getGdsObj() {
			return this.state.gdsObj;
		}
	}, {
		key: 'getLanguage',
		value: function getLanguage() {
			return this.state['language'];
		}
	}, {
		key: 'getAreaIndex',
		value: function getAreaIndex() {
			return this.state.gdsObj['sessionIndex'];
		}
	}, {
		key: 'getRequestId',
		value: function getRequestId() {
			return this.state.requestId;
		}

		/*execCmd( commands )
  {
  	const term = this.getActiveTerminal();
  		if (term)
  		term.exec( commands );
  		return false;
  }
  	getGdsList()
  {
  	// console.log( Gds );
  	// return Gds;
  }*/

	}, {
		key: 'isGdsApollo',
		value: function isGdsApollo() {
			return this.getGds() === 'apollo';
		}
	}, {
		key: 'isLanguageApollo',
		value: function isLanguageApollo() {
			return this.getLanguage() === 'APOLLO'; //when time comes uncomment
		}
	}, {
		key: 'change',
		value: function change() {
			var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			this.state = Object.assign({}, this.state, params);

			this.render(this.state);
		}
	}]);

	return TerminalState;
}();

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _actionsMenu = __webpack_require__(19);

var _actionsMenu2 = _interopRequireDefault(_actionsMenu);

var _menuPanel = __webpack_require__(22);

var _menuPanel2 = _interopRequireDefault(_menuPanel);

var _terminalMatrix = __webpack_require__(29);

var _terminalMatrix2 = _interopRequireDefault(_terminalMatrix);

var _component = __webpack_require__(3);

var _component2 = _interopRequireDefault(_component);

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

var _PqQuotes = __webpack_require__(45);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var matrix = void 0,
    tempTerm = void 0;

var Container = function (_Component) {
	_inherits(Container, _Component);

	function Container(rootId) {
		_classCallCheck(this, Container);

		var _this = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, 'section'));

		_this.observe(new Wrapper());

		document.getElementById(rootId).appendChild(_this.getContext());
		return _this;
	}

	_createClass(Container, [{
		key: 'purgeScreens',
		value: function purgeScreens(gds) {
			matrix.purgeScreens(gds);
		}
	}, {
		key: 'getTerminal',
		value: function getTerminal(gds, index, props) {
			return matrix.getTerminal(gds, index, props);
		}
	}, {
		key: '_renderer',
		value: function _renderer() {
			this.context.className = 'terminal-wrap-custom term-f-size-' + this.props.fontSize;
		}
	}]);

	return Container;
}(_component2.default);

exports.default = Container;

var RightSide = function (_Component2) {
	_inherits(RightSide, _Component2);

	function RightSide() {
		_classCallCheck(this, RightSide);

		var _this2 = _possibleConstructorReturn(this, (RightSide.__proto__ || Object.getPrototypeOf(RightSide)).call(this, 'td.menu'));

		var menu = new _menuPanel2.default();
		_this2.addToObserve(menu);

		_this2.append(new _component2.default('section.hbox stretch').append(new _component2.default('section.vbox').append(new _component2.default('section.scrollable').append(menu))));

		// this.observe(
		// 	new MenuPanel()
		// );
		return _this2;
	}

	_createClass(RightSide, [{
		key: '_renderer',
		value: function _renderer() {
			this.context.classList.toggle('hidden', this.props.hideMenu);
		}
	}]);

	return RightSide;
}(_component2.default);

var TempTerminal = function (_Component3) {
	_inherits(TempTerminal, _Component3);

	function TempTerminal(parent) {
		_classCallCheck(this, TempTerminal);

		var _this3 = _possibleConstructorReturn(this, (TempTerminal.__proto__ || Object.getPrototypeOf(TempTerminal)).call(this, 'div.terminal temp-terminal'));

		_this3.cursor = (0, _dom2.default)('span.cursor', { innerHTML: '&nbsp;' });
		var div = (0, _dom2.default)('div.cmd', { innerHTML: '&nbsp;' });

		div.appendChild(_this3.cursor);
		_this3.attach(div);

		_this3.parent = parent;
		return _this3;
	}

	_createClass(TempTerminal, [{
		key: 'calculate',
		value: function calculate(_ref, parentWidth, parentHeight) {
			var cells = _ref.cells,
			    rows = _ref.rows;

			// console.log( 'zzzzz', this.parent.clientHeight );
			// console.log( 'zzzzz', parentWidth );
			// console.log( 'zzzzz', this.parent.offsetWidth );
			// console.log( 'zzzzz', Math.floor(parentHeight 	/ (rows+1)) );
			// console.log( 'zzzzz', Math.floor(this.parent.clientHeight 	/ (rows+1)));

			return {
				// height		: Math.floor(this.parent.clientHeight 	/ (rows+1)),
				height: Math.floor(parentHeight / (rows + 1)),
				// width 		: Math.floor(this.parent.clientWidth 	/ (cells+1)),
				width: Math.floor((parentWidth - 100) / (cells + 1)),
				char: this.getLineHeight()
			};
		}
	}, {
		key: 'getLineHeight',
		value: function getLineHeight() {
			var _cursor$getBoundingCl = this.cursor.getBoundingClientRect(),
			    width = _cursor$getBoundingCl.width,
			    height = _cursor$getBoundingCl.height;

			return { width: width, height: height };
		}
	}]);

	return TempTerminal;
}(_component2.default);

var Wrapper = function (_Component4) {
	_inherits(Wrapper, _Component4);

	function Wrapper() {
		_classCallCheck(this, Wrapper);

		var _this4 = _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).call(this, 'table.term-body minimized'));

		matrix = new _terminalMatrix2.default(_this4.context);

		var leftSide = new _component2.default('td.left');
		var rightSide = new RightSide();

		tempTerm = new TempTerminal(leftSide.context);

		_this4.observe(new _component2.default('tr').append(leftSide).observe(new _PqQuotes.PqQuotes()).append(rightSide));

		_this4.addToObserve(rightSide);
		_this4.addToObserve(leftSide);

		leftSide.observe(matrix).append(new _actionsMenu2.default());

		_this4.append(tempTerm);
		return _this4;
	}

	_createClass(Wrapper, [{
		key: '_renderer',
		value: function _renderer() {
			// console.log(this.context.clientHeight);
			// console.log(this.context.parentNode.clientHeight);
			// console.log(this.context);
			//
			// console.log(this.context.parentNode.clientWidth);
			// console.log(this.context.parentNode);
			//
			// console.log(this.context.parentNode);
			// console.log('=================');

			var dimensions = tempTerm.calculate(this.props.gdsObj.matrix, this.context.parentNode.clientWidth, this.context.parentNode.clientHeight);
			this.props = _extends({}, this.props, { dimensions: dimensions });
		}
	}]);

	return Wrapper;
}(_component2.default);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _terminalMatrix = __webpack_require__(20);

var _terminalMatrix2 = _interopRequireDefault(_terminalMatrix);

var _component = __webpack_require__(3);

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActionsMenu = function (_Component) {
	_inherits(ActionsMenu, _Component);

	function ActionsMenu() {
		_classCallCheck(this, ActionsMenu);

		var _this = _possibleConstructorReturn(this, (ActionsMenu.__proto__ || Object.getPrototypeOf(ActionsMenu)).call(this, 'div.actions-btn-menu'));

		var matrix = new _terminalMatrix2.default({
			icon: '<i class="fa fa-th-large"></i>'
		}).getTrigger();

		matrix.className = 'btn btn-purple';

		_this.context.appendChild(matrix);
		return _this;
	}

	return ActionsMenu;
}(_component2.default);

exports.default = ActionsMenu;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(4);

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

var _actions = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cellObj = [];

var ACTIVE_CLASS = 'bg-purple';

var Matrix = function (_ButtonPopOver) {
	_inherits(Matrix, _ButtonPopOver);

	function Matrix(params) {
		_classCallCheck(this, Matrix);

		var _this = _possibleConstructorReturn(this, (Matrix.__proto__ || Object.getPrototypeOf(Matrix)).call(this, params));

		_this.popContent = (0, _dom2.default)('table.matrix-table');
		_this.makeTrigger();
		return _this;
	}

	_createClass(Matrix, [{
		key: 'build',
		value: function build() {
			[0, 1, 2, 3].map(this._rows).map(this._cells, this).map(this._toTable, this);
		}
	}, {
		key: '_rows',
		value: function _rows() {
			cellObj.push([]);
			return document.createElement('tr');
		}
	}, {
		key: '_cells',
		value: function _cells(row, rIndex) {
			var _this2 = this;

			[0, 1, 2, 3].map(function (cIndex) {
				return row.appendChild(_this2._cell(rIndex, cIndex));
			});
			return row;
		}
	}, {
		key: '_cell',
		value: function _cell(rIndex, cIndex) {
			var _this3 = this;

			var cell = document.createElement('td');

			cellObj[rIndex].push(cell);

			cell.addEventListener('click', function () {
				_this3.popover.close();

				(0, _actions.CHANGE_MATRIX)({
					rows: rIndex,
					cells: cIndex
				});
			});

			cell.addEventListener('mouseover', function () {

				for (var i = 0; i <= rIndex; i++) {
					cellObj[i].slice(0, cIndex + 1).forEach(function (cell) {
						return cell.classList.toggle(ACTIVE_CLASS);
					});
				}
			});

			cell.addEventListener('mouseleave', function () {
				[].forEach.call(_this3.popContent.querySelectorAll('.' + ACTIVE_CLASS), function (cell) {
					return cell.classList.toggle(ACTIVE_CLASS);
				});
			});

			return cell;
		}
	}, {
		key: '_toTable',
		value: function _toTable(row) {
			this.popContent.appendChild(row);
		}
	}]);

	return Matrix;
}(_buttonPopover2.default);

exports.default = Matrix;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(12);

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _theme = __webpack_require__(23);

var _theme2 = _interopRequireDefault(_theme);

var _history = __webpack_require__(24);

var _textSize = __webpack_require__(25);

var _textSize2 = _interopRequireDefault(_textSize);

var _sessionButtons = __webpack_require__(26);

var _pqButton = __webpack_require__(27);

var _pqButton2 = _interopRequireDefault(_pqButton);

var _devButtons = __webpack_require__(28);

var _devButtons2 = _interopRequireDefault(_devButtons);

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

var _component = __webpack_require__(3);

var _component2 = _interopRequireDefault(_component);

var _gds = __webpack_require__(9);

var _gds2 = _interopRequireDefault(_gds);

var _actions = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MenuPanel = function (_Component) {
	_inherits(MenuPanel, _Component);

	function MenuPanel() {
		_classCallCheck(this, MenuPanel);

		var _this = _possibleConstructorReturn(this, (MenuPanel.__proto__ || Object.getPrototypeOf(MenuPanel)).call(this, 'aside.sideMenu'));

		_this.append(new SettingsButtons());

		_this.attach((0, _dom2.default)('span.label[Session]'));

		_this.observe(new GdsAreas());

		_this.attach((0, _dom2.default)('span.label[Input Language]'));

		_this.observe(new LanguageButtons());

		_this.observe(new _pqButton2.default());

		if (window.TerminalState.hasPermissions()) _this.append(new TestsButtons());
		return _this;
	}

	return MenuPanel;
}(_component2.default);

exports.default = MenuPanel;

var SettingsButtons = function (_Component2) {
	_inherits(SettingsButtons, _Component2);

	function SettingsButtons() {
		_classCallCheck(this, SettingsButtons);

		var _this2 = _possibleConstructorReturn(this, (SettingsButtons.__proto__ || Object.getPrototypeOf(SettingsButtons)).call(this, 'article'));

		_this2.children().map(function (element) {
			return _this2.context.appendChild(element);
		});
		return _this2;
	}

	_createClass(SettingsButtons, [{
		key: 'children',
		value: function children() {
			var Quotes = (0, _dom2.default)('button.btn btn-primary font-bold', { innerHTML: 'Quoutes', onclick: _actions.SHOW_PQ_QUOTES });

			var theme = new _theme2.default({
				icon: '<i class="fa fa-paint-brush t-f-size-14"></i>'
			}).getTrigger();

			var textSize = new _textSize2.default({
				icon: '<i class="fa fa-text-height t-f-size-14"></i>'
			}).getTrigger();

			var history = new _history.History({
				icon: '<i class="fa fa-history t-f-size-14"></i>'
			}).getTrigger();

			return [Quotes, theme, textSize, history];
		}
	}]);

	return SettingsButtons;
}(_component2.default);

var GdsAreas = function (_Component3) {
	_inherits(GdsAreas, _Component3);

	function GdsAreas() {
		_classCallCheck(this, GdsAreas);

		return _possibleConstructorReturn(this, (GdsAreas.__proto__ || Object.getPrototypeOf(GdsAreas)).call(this, 'article'));
	}

	_createClass(GdsAreas, [{
		key: 'stateToProps',
		value: function stateToProps(_ref) {
			var gdsObj = _ref.gdsObj;
			var pcc = gdsObj.pcc,
			    sessionIndex = gdsObj.sessionIndex,
			    name = gdsObj.name;

			return { pcc: pcc, sessionIndex: sessionIndex, name: name };
		}
	}, {
		key: '_renderer',
		value: function _renderer() {
			var _this4 = this;

			this.context.innerHTML = '';

			_gds2.default.getList().forEach(function (_ref2) {
				var list = _ref2.list,
				    name = _ref2.name;


				var buttons = new _sessionButtons.SessionButtons(_this4.props);

				_this4.context.appendChild(buttons.makeTrigger(name));

				if (_this4.props['name'] === name) list.map(function (area, index) {
					_this4.context.appendChild(buttons.makeArea(area, index));
				});
			});
		}
	}]);

	return GdsAreas;
}(_component2.default);

var LanguageButtons = function (_Component4) {
	_inherits(LanguageButtons, _Component4);

	function LanguageButtons() {
		_classCallCheck(this, LanguageButtons);

		return _possibleConstructorReturn(this, (LanguageButtons.__proto__ || Object.getPrototypeOf(LanguageButtons)).call(this, 'article'));
	}

	_createClass(LanguageButtons, [{
		key: 'stateToProps',
		value: function stateToProps(_ref3) {
			var language = _ref3.language;

			return { language: language };
		}
	}, {
		key: '_renderer',
		value: function _renderer() {
			var _this6 = this;

			this.context.innerHTML = '';

			['APOLLO', 'SABRE', 'AMADEUS'].forEach(function (value) {

				var button = (0, _dom2.default)('button.btn  btn-gold t-f-size-10 font-bold' + (_this6.props.language === value ? ' active' : ''));

				button.innerHTML = value;
				button.addEventListener('click', function () {
					return (0, _actions.CHANGE_INPUT_LANGUAGE)(value);
				});

				_this6.context.appendChild(button);
			});
		}
	}]);

	return LanguageButtons;
}(_component2.default);

var TestsButtons = function (_Component5) {
	_inherits(TestsButtons, _Component5);

	function TestsButtons() {
		_classCallCheck(this, TestsButtons);

		var _this7 = _possibleConstructorReturn(this, (TestsButtons.__proto__ || Object.getPrototypeOf(TestsButtons)).call(this, 'article'));

		_this7.context.appendChild(new _devButtons2.default().getContext());
		return _this7;
	}

	return TestsButtons;
}(_component2.default);

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(4);

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

var _cookie = __webpack_require__(10);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Theme = function (_ButtonPopOver) {
	_inherits(Theme, _ButtonPopOver);

	function Theme(params) {
		_classCallCheck(this, Theme);

		var _this = _possibleConstructorReturn(this, (Theme.__proto__ || Object.getPrototypeOf(Theme)).call(this, params));

		_this.agentId = apiData.auth.id;
		_this.oldThemeClass = (0, _cookie.cookieGet)('terminalTheme_' + _this.agentId) || 'terminaltheme_' + window.apiData['terminalThemes'][0]['id'];

		_this.context = document.getElementById('terminalContext');
		_this.context.classList.add(_this.oldThemeClass);

		_this.makeTrigger();
		return _this;
	}

	_createClass(Theme, [{
		key: 'onSelect',
		value: function onSelect(value) {
			var newThemeClass = 'terminaltheme_' + value.id;

			this.context.classList.remove(this.oldThemeClass);
			this.context.classList.add(newThemeClass);

			this.oldThemeClass = newThemeClass;
			(0, _cookie.cookieSet)('terminalTheme_' + this.agentId, newThemeClass, 30);
		}
	}, {
		key: 'build',
		value: function build() {
			var _this2 = this;

			var themeList = window.apiData['terminalThemes'];

			if (themeList.length) {
				themeList.map(function (value) {

					var button = (0, _dom2.default)('button.list-group-item');
					button.innerHTML = value.label;

					button.addEventListener('click', function () {
						_this2.popover.close();
						_this2.onSelect(value);
					});

					_this2.popContent.appendChild(button);
				});
			}
		}
	}]);

	return Theme;
}(_buttonPopover2.default);

exports.default = Theme;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.History = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(4);

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

var _actions = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var buffer = [];

var History = exports.History = function (_ButtonPopOver) {
	_inherits(History, _ButtonPopOver);

	function History(params) {
		_classCallCheck(this, History);

		var _this = _possibleConstructorReturn(this, (History.__proto__ || Object.getPrototypeOf(History)).call(this, params));

		_this.popContent = (0, _dom2.default)('div.historyContext');

		var btn = _this.makeTrigger();
		btn.addEventListener('click', function () {
			return _this.askServer();
		});
		return _this;
	}

	_createClass(History, [{
		key: '_makeBody',
		value: function _makeBody(response) {
			this.list = (0, _dom2.default)('ul.list');
			response.data.forEach(this._makeLi, this);
			this.popContent.appendChild(this.list);
		}
	}, {
		key: '_makeLi',
		value: function _makeLi(value) {
			var cb = (0, _dom2.default)('input');
			cb.type = 'checkbox';
			cb.onclick = function () {
				return buffer.push(value);
			};

			var el = (0, _dom2.default)('a.t-pointer[' + value + ']');
			el.onclick = function () {
				return cb.click();
			};

			var li = (0, _dom2.default)('li.m-b-xs');
			li.appendChild(cb);
			li.appendChild(el);

			this.list.appendChild(li);
		}
	}, {
		key: '_makeLaunchBtn',
		value: function _makeLaunchBtn() {
			var _this2 = this;

			var el = (0, _dom2.default)('button.btn btn-sm btn-purple font-bold btn-block m-t[Perform]');

			el.onclick = function () {
				return (0, _actions.DEV_CMD_STACK_RUN)(buffer);
			};
			el.addEventListener('click', function () {
				return _this2.popover.close();
			});

			this.popContent.appendChild(el);
		}
	}, {
		key: '_finalize',
		value: function _finalize() {
			this.list.scrollTop = this.popContent.scrollHeight;
		}
	}, {
		key: 'askServer',
		value: function askServer() {
			buffer = [];
			this.popContent.innerHTML = '';

			(0, _actions.GET_HISTORY)().then(this._makeBody.bind(this)).then(this._makeLaunchBtn.bind(this)).then(this._finalize.bind(this));
		}
	}, {
		key: 'build',
		value: function build() {
			return false;
		}
	}]);

	return History;
}(_buttonPopover2.default);

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(4);

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

var _actions = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextSize = function (_ButtonPopOver) {
	_inherits(TextSize, _ButtonPopOver);

	function TextSize(params) {
		_classCallCheck(this, TextSize);

		var _this = _possibleConstructorReturn(this, (TextSize.__proto__ || Object.getPrototypeOf(TextSize)).call(this, params));

		_this.makeTrigger();
		return _this;
	}

	_createClass(TextSize, [{
		key: 'build',
		value: function build(list) {
			var _this2 = this;

			['1', '2', '3', '4'].forEach(function (value) {

				var button = (0, _dom2.default)('button.list-group-item');
				button.innerHTML = value + 'x';

				button.addEventListener('click', function () {
					_this2.popover.close();
					(0, _actions.UPDATE_STATE)({ fontSize: value });
				});

				_this2.popContent.appendChild(button);
			});
		}
	}]);

	return TextSize;
}(_buttonPopover2.default);

exports.default = TextSize;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SessionButtons = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

var _actions = __webpack_require__(0);

var _constants = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SessionButtons = exports.SessionButtons = function () {
	function SessionButtons(params) {
		_classCallCheck(this, SessionButtons);

		this.context = (0, _dom2.default)('div');
		this.pcc = params.pcc;
		this.sessionIndex = params.sessionIndex;
		this.gdsname = params.name;
	}

	_createClass(SessionButtons, [{
		key: "makeTrigger",
		value: function makeTrigger(gdsName) {
			return (0, _dom2.default)('button', {
				className: "btn btn-sm btn-mint font-bold " + (gdsName === this.gdsname ? ' active' : ''),
				innerHTML: gdsName,
				onclick: function onclick() {
					return (0, _actions.CHANGE_GDS)(gdsName);
				}
			});
		}
	}, {
		key: "makeArea",
		value: function makeArea(area, index) {
			var pcc = this.pcc[index];
			var isActive = this.sessionIndex === index;

			return (0, _dom2.default)("button", {
				className: "btn btn-sm btn-purple font-bold pos-rlt " + (isActive ? 'active' : ''),

				innerHTML: area + (pcc ? "<span class=\"pcc-label\">" + pcc + "</span>" : ''),

				// disabled	:  !curTerminalId || isActive,
				disabled: isActive,

				onclick: function onclick(e) {

					e.target.disabled = true;

					(0, _actions.CHANGE_SESSION_BY_MENU)(_constants.AREA_LIST[index]).catch(function () {
						e.target.disabled = false;
					});
				}
			});
		}
	}]);

	return SessionButtons;
}();

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _actions = __webpack_require__(0);

var _component = __webpack_require__(3);

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PqButton = function (_Component) {
	_inherits(PqButton, _Component);

	function PqButton() {
		_classCallCheck(this, PqButton);

		var _this = _possibleConstructorReturn(this, (PqButton.__proto__ || Object.getPrototypeOf(PqButton)).call(this, 'button.btn btn-sm btn-mozilla font-bold[PQ]', {
			disabled: true
		}));

		_this.context.onclick = _actions.PQ_MODAL_SHOW;
		return _this;
	}

	_createClass(PqButton, [{
		key: "stateToProps",
		value: function stateToProps(_ref) {
			var gdsObj = _ref.gdsObj;
			var canCreatePq = gdsObj.canCreatePq;

			return { canCreatePq: canCreatePq };
		}
	}, {
		key: "_renderer",
		value: function _renderer() {
			this.context.disabled = !this.props.canCreatePq;
		}
	}]);

	return PqButton;
}(_component2.default);

exports.default = PqButton;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(4);

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

var _actions = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STORAGE_KEY = 'dedTerminalBufCmd';

var CommandsBuffer = function (_ButtonPopOver) {
	_inherits(CommandsBuffer, _ButtonPopOver);

	function CommandsBuffer(params) {
		_classCallCheck(this, CommandsBuffer);

		var _this = _possibleConstructorReturn(this, (CommandsBuffer.__proto__ || Object.getPrototypeOf(CommandsBuffer)).call(this, params));

		_this.settings.onOpen = function () {
			return _this.area.focus();
		};
		_this.makeTrigger();
		return _this;
	}

	_createClass(CommandsBuffer, [{
		key: 'build',
		value: function build() {
			var _this2 = this;

			var cmd = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || [];

			var area = (0, _dom2.default)('textarea.form-control');
			var btn = (0, _dom2.default)('button.btn btn-sm btn-primary btn-block m-t font-bold[Run]');

			area.value = cmd.join("\n");

			area.rows = 15;
			area.cols = 20;

			btn.onclick = function () {
				var cmd = area.value.trim().split(/\s+/);

				window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cmd));
				(0, _actions.DEV_CMD_STACK_RUN)(cmd);

				_this2.popover.close();
			};

			this.popContent.appendChild(area);
			this.popContent.appendChild(btn);

			this.area = area;
		}
	}]);

	return CommandsBuffer;
}(_buttonPopover2.default);

var DevButtons = function () {
	function DevButtons() {
		_classCallCheck(this, DevButtons);

		this.context = (0, _dom2.default)('div');
		this.context.appendChild(this.PqAddTest());
		// this.context.appendChild ( this.AddPqMacros() );
		this.context.appendChild(this.commandsBuffer());
		this.context.appendChild(this.fullScreen());
	}

	_createClass(DevButtons, [{
		key: 'PqAddTest',
		value: function PqAddTest() {
			this.macros = (0, _dom2.default)('span.btn btn-mozilla font-bold[PQ Dev]');
			this.macros.onclick = _actions.PQ_MODAL_SHOW_DEV;

			return this.macros;
		}

		// AddPqMacros()
		// {
		// 	this.macros 			= Dom('span.btn btn-primary font-bold[Test pq]');
		// 	this.macros.onclick 	= () => DEV_CMD_STACK_RUN(['A/V/13SEPSEAMNL+DL', '01k1*', '*R', '$BN1+2*C09+3*inf']);
		//
		// 	return this.macros;
		// }

	}, {
		key: 'commandsBuffer',
		value: function commandsBuffer() {
			return this.commandsBuffer = new CommandsBuffer({
				icon: '<span>Dev Buf</span>'
			}).getTrigger();
		}
	}, {
		key: 'fullScreen',
		value: function fullScreen() {
			this.macros = (0, _dom2.default)('span.btn btn-primary font-bold[Full]');
			this.macros.onclick = _actions.FULL_SCREEN;

			return this.macros;
		}
	}, {
		key: 'getContext',
		value: function getContext() {
			return this.context;
		}
	}]);

	return DevButtons;
}();

exports.default = DevButtons;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

var _terminal = __webpack_require__(11);

var _terminal2 = _interopRequireDefault(_terminal);

var _component = __webpack_require__(3);

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var gdsSession = [];
var stringify = JSON.stringify;
var cells = [];

var TerminalsMatrix = function (_Component) {
	_inherits(TerminalsMatrix, _Component);

	function TerminalsMatrix() {
		_classCallCheck(this, TerminalsMatrix);

		return _possibleConstructorReturn(this, (TerminalsMatrix.__proto__ || Object.getPrototypeOf(TerminalsMatrix)).call(this, 'table.terminals-table'));
	}

	_createClass(TerminalsMatrix, [{
		key: 'clear',
		value: function clear() {
			this.context.innerHTML = '';
			return this;
		}
	}, {
		key: 'makeCells',
		value: function makeCells(rowCount, cellCount, dimensions) {
			var _this2 = this;

			var makeRow = function makeRow() {
				var row = (0, _dom2.default)('tr');
				_this2.context.appendChild(row);
				return row;
			};

			var makeCells = function makeCells(row) {
				return [].concat(_toConsumableArray(new Array(cellCount))).map(function () {
					var cell = (0, _dom2.default)('td.terminal-cell', { style: 'zbackground: currentColor; width : ' + dimensions.width + 'px; max-height : ' + dimensions.height + 'px; height: ' + dimensions.height + 'px' });
					// const cell = Dom('td.terminal-cell');
					row.appendChild(cell);
					return cell;
				});
			};

			return [].concat.apply([], [].concat(_toConsumableArray(new Array(rowCount))).map(makeRow).map(makeCells));
		}
	}, {
		key: 'purgeScreens',
		value: function purgeScreens(gds) {
			gdsSession[gds].forEach(function (terminal) {
				return terminal.clear();
			});
		}
	}, {
		key: 'getTerminal',
		value: function getTerminal(gds, index, props) {
			return gdsSession[gds][index] = gdsSession[gds][index] || new _terminal2.default(props);
		}
	}, {
		key: 'renderIsNeeded',
		value: function renderIsNeeded(state) {
			if (!this.state) return true;

			return stringify(state) !== stringify(this.state);
		}
	}, {
		key: '_renderer',
		value: function _renderer() {
			var _this3 = this;

			var _props = this.props,
			    hideMenu = _props.hideMenu,
			    buffer = _props.buffer,
			    gdsObj = _props.gdsObj,
			    dimensions = _props.dimensions;


			var state = {
				gds: gdsObj['name'],
				dimensions: dimensions,
				hideMenu: hideMenu
			};

			var needToRender = this.renderIsNeeded(state);

			if (needToRender) {
				gdsSession[gdsObj['name']] = gdsSession[gdsObj['name']] || [];
				var rowCount = gdsObj.matrix.rows + 1;
				var cellCount = gdsObj.matrix.cells + 1;

				console.warn('need to rerender');

				this.context.innerHTML = '';
				// this.context.className 	= 't-matrix-w-' + ( cellCount - 1 );

				this.state = state;

				cells = this.makeCells(rowCount, cellCount, dimensions);

				cells.forEach(function (cell, index) {

					var props = {
						name: index,
						gds: gdsObj['name'],
						buffer: buffer && buffer[gdsObj['name']] ? buffer[gdsObj['name']]['terminals'][index + 1] : ''
					};

					_this3.getTerminal(gdsObj['name'], index, props).reattach(cell, dimensions);
					// .reattach( cell, this.sizer.calculate(rowCount, cellCount) ); //sometimes calculate doesn't get actual parent context dimensions
				});
			}

			if (cells[this.curTerminalId]) cells[this.curTerminalId].classList.remove('activeWindow');

			if (cells[gdsObj.curTerminalId]) cells[gdsObj.curTerminalId].classList.add('activeWindow');

			this.curTerminalId = gdsObj.curTerminalId;
		}
	}]);

	return TerminalsMatrix;
}(_component2.default);

exports.default = TerminalsMatrix;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pagination = __webpack_require__(31);

var _pagination2 = _interopRequireDefault(_pagination);

var _session = __webpack_require__(32);

var _session2 = _interopRequireDefault(_session);

var _spinner = __webpack_require__(33);

var _spinner2 = _interopRequireDefault(_spinner);

var _keyBinding = __webpack_require__(35);

var _output = __webpack_require__(37);

var _output2 = _interopRequireDefault(_output);

var _tabManager = __webpack_require__(38);

var _tabManager2 = _interopRequireDefault(_tabManager);

var _f = __webpack_require__(39);

var _f2 = _interopRequireDefault(_f);

var _history = __webpack_require__(40);

var _history2 = _interopRequireDefault(_history);

var _debug = __webpack_require__(8);

var _helpers = __webpack_require__(7);

var _actions = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = __webpack_require__(41);
window.$ = window.jQuery = $;

__webpack_require__(42);
__webpack_require__(43).polyfill();

var TerminalPlugin = function () {
	function TerminalPlugin(params) {
		_classCallCheck(this, TerminalPlugin);

		this.settings = params;
		this.context = params.context;
		this.name = params.name;

		this.allowManualPaging = params.gds === 'sabre';

		this.session = new _session2.default({
			terminalIndex: params.name,
			gds: params.gds
		});

		this.terminal = this.init();

		this.pagination = new _pagination2.default(this.terminal);
		this.spinner = new _spinner2.default(this.terminal);

		this.outputLiner = new _output2.default(this.terminal);
		this.outputLiner.setNumRows(params.numOfRows);

		this.tabCommands = new _tabManager2.default();

		this.f8Reader = new _f2.default({
			terminal: this.terminal,
			gds: params.gds
		});

		this.history = new _history2.default(params.gds);
	}

	_createClass(TerminalPlugin, [{
		key: 'parseKeyBinds',
		value: function parseKeyBinds(evt, terminal) {
			var hasNoShortCut = (0, _keyBinding.pressedShortcuts)(evt, terminal, this);

			if (!hasNoShortCut) return false;

			var isEnter = evt.which === 13;
			this.f8Reader.replaceEmptyChar(evt);

			// if test>>>asd+sa and cursor on + // execute only between last > and + cmd
			if (isEnter) {
				this.f8Reader.isActive = false;

				var cmd = terminal.before_cursor();
				var lastPromptSignPos = cmd.lastIndexOf('>') + 1;

				if (lastPromptSignPos) cmd = cmd.substring(lastPromptSignPos, cmd.length);

				terminal.set_command(cmd);
			}
		}
	}, {
		key: 'changeActiveTerm',
		value: function changeActiveTerm() {
			if (this.settings.name === 'fullScreen') return false;

			window.activePlugin = this; // SO SO check to DEPRECATED

			(0, _actions.CHANGE_ACTIVE_TERMINAL)({ gds: this.settings.gds, curTerminalId: this.name });
		}
	}, {
		key: 'purge',
		value: function purge() {
			this.settings.clear();
		}
	}, {
		key: 'tabPerform',
		value: function tabPerform() {
			var reverse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			if (this.f8Reader.getIsActive()) return this.f8Reader.jumpToNextPos();

			this.tabCommands.move(reverse).run(this.terminal);
		}
	}, {
		key: 'resize',
		value: function resize(sizes) {
			this.terminal.settings().numChars = sizes.numOfChars;
			this.terminal.settings().numRows = sizes.numOfRows;
			// this.terminal.resize(width, height);
			this.terminal.resize();
		}
	}, {
		key: 'emptyLinesRecalculate',
		value: function emptyLinesRecalculate(numOfRows, numOfChars, charHeight) {
			this.outputLiner.setNumRows(numOfRows).setNumChars(numOfChars).setCharHeight(charHeight).recalculate();
		}
	}, {
		key: 'init',
		value: function init() {
			//caveats terminal.rows() - every time appends div with cursor span - not too smooth for performance
			return $(this.context).terminal(function () {}, {
				echoCommand: false,
				greetings: '',
				name: this.name,
				prompt: '>',
				numRows: this.settings.numOfRows || 0, // plugin calculates it in so shitty slow manner appending cursor to body 3 times per plugin
				numChars: this.settings.numOfChars,
				memory: true, // do not add to localStorage

				keypress: function keypress(e, terminal) {
					var replacement = (0, _helpers.getReplacement)(e, window.TerminalState.isLanguageApollo());

					if (replacement) {
						terminal.insert(replacement);
						return false;
					}
				},

				keydown: this.parseKeyBinds.bind(this),
				clickTimeout: 300,
				onInit: this.changeActiveTerm.bind(this),
				onTerminalChange: this.changeActiveTerm.bind(this),
				onBeforeCommand: this.checkBeforeEnter.bind(this),

				/*keymap		: {},*/

				exceptionHandler: function exceptionHandler(err) {
					console.warn('exc', err);
				}
			});
		}
	}, {
		key: 'checkSabreCommand',
		value: function checkSabreCommand(command, terminal) {
			if (this.allowManualPaging) {
				switch (command.toUpperCase()) {
					case 'MD':
						terminal.echo(this.pagination.next().print());
						return true;

					case 'MU':
						terminal.echo(this.pagination.prev().print());
						return true;

					case 'MDA':
						terminal.echo(this.pagination.printAll());
						return true;

					case 'MDA5':
					case 'MDA20':
						return true;
				}
			}

			return false;
		}
	}, {
		key: 'checkBeforeEnter',
		value: function checkBeforeEnter(terminal, command) {
			var _this = this;

			if (!command || command.trim() === '') {
				this.terminal.echo('>');
				return false;
			}

			if (this.checkSabreCommand(command, terminal)) return command;

			this.spinner.start(); // issue 03

			var before = function before() {
				_this.outputLiner.prepare('');
				_this.spinner.start();
				_this.terminal.echo('[[;;;usedCommand;]>' + command.toUpperCase() + ']');
				return command.toUpperCase();
			};

			this.session.pushCommand(before).perform().then(function (response) {
				_this.spinner.end();
				_this.parseBackEnd(response, command);
			});

			return command;
		}
	}, {
		key: 'parseBackEnd',
		value: function parseBackEnd() {
			var response = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			var command = arguments[1];

			this.lastCommand = command;
			this.history.add(command);

			var result = response['data'] || {};

			if (result['output']) {
				if (result['output'].trim() === '*') {
					this.terminal.update(-2, command + ' *');
					return false;
				}

				if (this.allowManualPaging) // sabre
					{
						var output = this.pagination.bindOutput(result['output'], this.settings.numOfRows - 1, this.settings.numOfChars).print();

						this.terminal.echo(output);
					} else {
					// if 1 rows of terminal do not perform clear screen
					var clearScreen = result['clearScreen'] && window.TerminalState.getMatrix().rows !== 0;
					this.outputLiner.prepare(result['output'], clearScreen);
				}
			}

			this.tabCommands.reset(result['tabCommands'], result['output']);

			(0, _actions.UPDATE_CUR_GDS)(this.settings.gds, result);

			if (window.TerminalState.hasPermissions()) this.debugOutput(result);
		}
	}, {
		key: 'debugOutput',
		value: function debugOutput(result) {
			if (result['clearScreen']) (0, _debug.Debug)('DEBUG: CLEAR SCREEN', 'info');

			if (result['canCreatePq']) (0, _debug.Debug)('CAN CREATE PQ', 'warning');

			if (result['tabCommands'] && result['tabCommands'].length) (0, _debug.Debug)('FOUND TAB COMMANDS', 'success');

			if (result['pcc']) (0, _debug.Debug)('CHANGE PCC', 'success');
		}

		// parseError(e)
		// {
		// }

	}]);

	return TerminalPlugin;
}();

exports.default = TerminalPlugin;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(7);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pagination = function () {
	function Pagination() {
		_classCallCheck(this, Pagination);

		this.cache = [];
		this.output = '';
		this.page = 0;
	}

	_createClass(Pagination, [{
		key: 'bindOutput',
		value: function bindOutput(output) {
			var rows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var cols = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

			this.page = 0;
			this.output = output;
			this.cache = (0, _helpers.makePages)(output, rows, cols);

			// console.log(this.cache );
			return this;
		}
	}, {
		key: 'next',
		value: function next() {
			if (this.cache.length && this.page < this.cache.length) this.page++;

			return this;
		}
	}, {
		key: 'prev',
		value: function prev() {
			if (this.page > 0) this.page--;

			return this;
		}
	}, {
		key: 'print',
		value: function print() {
			return this.cache[this.page] || '‡NOTHING TO SCROLL‡';
		}
	}, {
		key: 'printAll',
		value: function printAll() {
			return this.output;
		}
	}]);

	return Pagination;
}();

exports.default = Pagination;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requests = __webpack_require__(5);

var _requests2 = _interopRequireDefault(_requests);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var beforeStack = [];
var promises = [];
var stack = [];

var Session = function () {
	function Session(params) {
		_classCallCheck(this, Session);

		this.settings = params;
	}

	_createClass(Session, [{
		key: 'run',
		value: function run(cmd) {
			return _requests2.default.runSyncCommand({
				terminalIndex: parseInt(this.settings['terminalIndex']) + 1,
				command: cmd,
				gds: this.settings['gds'],
				language: window.TerminalState.getLanguage().toLowerCase(),
				terminalData: window.apiData['terminalData']
			});
		}
	}, {
		key: 'perform',
		value: function perform() {
			var _this = this;

			return new Promise(function (resolve) {

				var run = function run() {
					var cmd = beforeStack[0]();
					beforeStack.shift();

					return _this.run(cmd).then(resolve) //output result
					.then(function () {
						var nextCmd = stack.shift();

						if (nextCmd) return nextCmd();

						promises = [];
					});
				};

				if (!promises.length) {
					promises.push(run());
				} else {
					stack.push(run);
				}
			});
		}
	}, {
		key: 'pushCommand',
		value: function pushCommand(before) {
			beforeStack.push(before);
			return this;
		}
	}]);

	return Session;
}();

exports.default = Session;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cliSpinners = __webpack_require__(34);

var Spinner = function () {
	function Spinner(terminal) {
		_classCallCheck(this, Spinner);

		this.timer = false;
		this.terminal = terminal;
		this.prompt = '';
		this.spinner = cliSpinners.simpleDots;
		this.spinner.interval = 550;
		this.frameCounter = 0;
	}

	_createClass(Spinner, [{
		key: 'set',
		value: function set() {
			var text = this.spinner.frames[this.frameCounter++ % this.spinner.frames.length];
			this.terminal.set_prompt(text);
		}
	}, {
		key: 'start',
		value: function start() {
			if (this.timer) {
				// this.end();
				return false;
			}

			this.terminal.find('.cursor').hide();
			this.terminal.set_mask('');

			this.prompt = this.terminal.get_prompt();

			this.set();
			this.timer = setInterval(this.set.bind(this), this.spinner.interval);
		}
	}, {
		key: 'end',
		value: function end() {
			clearInterval(this.timer);

			this.terminal.set_prompt(this.prompt);

			this.terminal.find('.cursor').show();
			this.terminal.set_mask(false);

			this.timer = false;
		}
	}, {
		key: 'isActive',
		value: function isActive() {
			return !!this.timer;
		}
	}]);

	return Spinner;
}();

exports.default = Spinner;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(9);

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.pressedShortcuts = undefined;

var _helpers = __webpack_require__(7);

var _actions = __webpack_require__(0);

var _switchTerminal = __webpack_require__(36);

var nextCmd = function nextCmd(plugin, terminal) {
	//Next performed format, by default returns to the first format and than each one by one.
	plugin.history.next().then(function (command) {
		terminal.cmd().set(command);
	});
};

var prevCmd = function prevCmd(plugin, terminal) {
	plugin.history.previous().then(function (command) {
		terminal.cmd().set(command);
	});
};

var pressedShortcuts = exports.pressedShortcuts = function pressedShortcuts(evt, terminal, plugin) {
	var keymap = evt.keyCode || evt.which;

	var gds = plugin.settings.gds;
	var isApollo = gds === 'apollo';
	// const isApollo	= window.TerminalState.isGdsApollo();
	// console.log('key pressed:' ,keymap);

	if (evt.ctrlKey || evt.metaKey) {
		switch (keymap) {
			case 8: //CTRL + backSpace;
			case 83:
				//CTRL + S;
				(0, _actions.PURGE_SCREENS)(gds);
				break;

			case 87:
				//CTRL+W
				plugin.purge();
				break;

			case 68: // CTRL+D
			case 76: // CTRL+L
			case 82: // CTRL+R
			case 120:
				// F9
				// Template for Apollo: ¤:5S(paxOrder) (sellPrice) N1 (netPrice) F1 (fareAmount)
				// Example for Apollo: ¤:5S1 985.00 N1 720.00 F1 500.00
				// Template for Sabre: 5S(paxOrder) (sellPrice) N1 (netPrice) F1 (fareAmount)
				// Example for Sabre: 5S1 985.00 N1 720.00 F1 500.00
				// evt.preventDefault();
				break;

			case 38:
				// Up arrow
				prevCmd(plugin, terminal);
				break;

			case 40:
				// down arrow
				nextCmd(plugin, terminal);
				break;

			case 112:
				// F1
				var f1 = {
					apollo: 'S*CTY/',
					amadeus: 'DAC',
					sabre: 'W/*'
				};

				terminal.insert(f1[gds]);
				break;

			case 113:
				// F2
				var f2 = {
					apollo: 'S*AIR/',
					amadeus: 'DNA',
					sabre: 'W/*'
				};

				terminal.insert(f2[gds]);
				break;

			// disabling these keys from terminal library to execute
			case 192:
				// Ctrl + ~
				(0, _switchTerminal.switchTerminal)({ keymap: 'next', gds: gds, name: plugin.name });
				break;

			case 48: // Ctrl + 0
			case 49: // Ctrl + 1
			case 50: // Ctrl + 2
			case 51: // Ctrl + 3
			case 52: // Ctrl + 4
			case 53: // Ctrl + 5
			case 54: // Ctrl + 6
			case 55: // Ctrl + 7
			case 56: // Ctrl + 8
			case 57:
				// Ctrl + 9
				(0, _switchTerminal.switchTerminal)({ keymap: keymap, gds: gds, name: plugin.name });
				break;

			default:
				return true;
		}

		return false;
	}

	if (evt.shiftKey) {
		switch (keymap) {
			case 9:
				//TAB
				plugin.tabPerform(true);
				break;

			case 120:
				//F9
				var f9 = {
					apollo: 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					amadeus: 'AP SFO 800-750-2238-A',
					sabre: '91-800-750-2238-A'
				};

				terminal.exec(f9[gds]);
				break;

			case 116:
				//F5
				terminal.exec(isApollo ? 'SEM/2G52/AG' : 'AAA5E9H');
				break;

			case 117:
				//F6
				terminal.exec(isApollo ? 'SEM/2G55/AG' : 'AAA6IIF');
				break;

			case 118:
				//F7
				terminal.exec(isApollo ? 'SEM/2G2H/AG' : 'AAADK8H');
				break;

			case 119:
				//F8
				terminal.exec(isApollo ? 'SEM/2BQ6/AG' : 'AAAW8K7');
				break;

			// case 187: //+
			// case 61 : //+ FireFox
			case 188:
				//,
				terminal.insert('+');
				break;

			case 192:
				// Shift + ~
				(0, _switchTerminal.switchTerminal)({ keymap: 'prev', gds: gds, name: plugin.name });
				break;

			default:
				return true;
		}

		return false;
	}

	if (evt.altKey) {
		switch (keymap) {
			case 8:
				// + backSpace;
				terminal.clear();
				break;

			case 38:
				// Up arrow
				prevCmd(plugin, terminal);
				break;

			case 40:
				// down arrow
				nextCmd(plugin, terminal);
				break;

			default:
				return true;
		}

		return false;
	}

	switch (keymap) {
		case 9:
			//TAB
			plugin.tabPerform();
			break;

		case 34: //page down
		case 33:
			//page up
			var cmm = plugin.lastCommand ? plugin.lastCommand.toLowerCase() : '';

			if (cmm !== '$bba' && isApollo && cmm.substr(0, 2) === '$b') return true;

			terminal.exec(keymap === 33 ? 'MU' : 'MD');
			break;

		case 38:
			//UP
			prevCmd(plugin, terminal);
			break;

		case 40:
			//DOWN
			nextCmd(plugin, terminal);
			break;

		case 116:
			// F5
			var plus320 = (0, _helpers.getDate)().plus320;
			var f5 = {
				apollo: '0TURZZBK1YYZ' + plus320 + '-RETENTION LINE',
				amadeus: 'RU1AHK1SFO' + plus320 + '/RETENTION',
				sabre: '0OTHYYGK1/RETENTION' + plus320
			};

			terminal.exec(f5[gds]);
			break;

		case 119:
			//F8
			terminal.set_command(plugin.f8Reader.getFullCommand());

			plugin.f8Reader.jumpToNextPos();
			break;

		case 122:
			//F11
			var f11 = {
				apollo: 'T:TAU/',
				amadeus: 'TKTL',
				sabre: '7TAW/'
			};

			terminal.exec(f11[gds] + (0, _helpers.getDate)().now);
			break;

		case 123:
			//F12
			var f12 = {
				apollo: 'R:',
				amadeus: 'RF',
				sabre: '6'
			};

			terminal.exec(f12[gds] + window.apiData.auth.login.toUpperCase());
			break;

		default:
			return true;
	}

	return false;
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.switchTerminal = undefined;

var _actions = __webpack_require__(0);

var gridMaps = {
	'2x2': {
		encode: {
			0: 0,
			1: 2,
			2: 1,
			3: 3
		},
		decode: {
			0: 0,
			1: 2,
			2: 1,
			3: 3
		}
	},
	'2x3': {
		encode: {
			0: 0,
			1: 3,
			2: 1,
			3: 4,
			4: 2,
			5: 5
		},
		decode: {
			0: 0,
			1: 2,
			2: 4,
			3: 1,
			4: 3,
			5: 5
		}
	},
	'2x4': {
		encode: {
			0: 0,
			1: 4,
			2: 1,
			3: 5,
			4: 2,
			5: 6,
			6: 3,
			7: 7
		},
		decode: {
			0: 0,
			1: 2,
			2: 4,
			3: 6,
			4: 1,
			5: 3,
			6: 5,
			7: 7
		}
	},
	'3x2': {
		encode: {
			0: 0,
			1: 2,
			2: 4,
			3: 1,
			4: 3,
			5: 5
		},
		decode: {
			0: 0,
			1: 3,
			2: 1,
			3: 4,
			4: 2,
			5: 5
		}
	},
	'3x3': {
		encode: {
			0: 0,
			1: 3,
			2: 6,
			3: 1,
			4: 4,
			5: 7,
			6: 2,
			7: 5,
			8: 8
		},
		decode: {
			0: 0,
			1: 3,
			2: 6,
			3: 1,
			4: 4,
			5: 7,
			6: 2,
			7: 5,
			8: 8
		}
	},
	'3x4': {
		encode: {
			0: 0,
			1: 4,
			2: 8,
			3: 1,
			4: 5,
			5: 9,
			6: 2,
			7: 6,
			8: 10,
			9: 3,
			10: 7,
			11: 11
		},
		decode: {
			0: 0,
			1: 3,
			2: 6,
			3: 9,
			4: 1,
			5: 4,
			6: 7,
			7: 10,
			8: 2,
			9: 5,
			10: 8,
			11: 11
		}
	},
	'4x2': {
		encode: {
			0: 0,
			1: 2,
			2: 4,
			3: 6,
			4: 1,
			5: 3,
			6: 5,
			7: 7
		},
		decode: {
			0: 0,
			1: 4,
			2: 1,
			3: 5,
			4: 2,
			5: 6,
			6: 3,
			7: 7
		}
	},
	'4x3': {
		encode: {
			0: 0,
			1: 3,
			2: 6,
			3: 9,
			4: 1,
			5: 4,
			6: 7,
			7: 10,
			8: 2,
			9: 5,
			10: 8,
			11: 11
		},
		decode: {
			0: 0,
			1: 4,
			2: 8,
			3: 1,
			4: 5,
			5: 9,
			6: 2,
			7: 6,
			9: 3,
			10: 7,
			8: 10,
			11: 11
		}
	},
	'4x4': {
		encode: {
			0: 0,
			1: 4,
			2: 8,
			3: 12,
			4: 1,
			5: 5,
			6: 9,
			7: 13,
			8: 2,
			9: 6,
			10: 10,
			11: 14,
			12: 3,
			13: 7,
			14: 11,
			15: 15
		},
		decode: {
			0: 0,
			1: 4,
			2: 8,
			4: 1,
			5: 5,
			6: 9,
			8: 2,
			9: 6,
			12: 3,
			13: 7,
			10: 10,
			14: 11,
			3: 12,
			7: 13,
			11: 14,
			15: 15
		}
	},
	'other': {
		encode: {
			0: 0,
			1: 1,
			2: 2,
			3: 3,
			4: 4,
			5: 5,
			6: 6,
			7: 7,
			8: 8,
			9: 9
		},
		decode: {
			0: 0,
			1: 1,
			2: 2,
			3: 3,
			4: 4,
			5: 5,
			6: 6,
			7: 7,
			8: 8,
			9: 9
		}
	}
};

var switchTerminal = exports.switchTerminal = function switchTerminal(_ref) {
	var keymap = _ref.keymap,
	    gds = _ref.gds,
	    name = _ref.name;

	var currentTerminalName = name;
	var matrix = window.TerminalState.state.gdsObj.matrix;

	var rows = matrix.rows + 1;
	var cells = matrix.cells + 1;
	var gridCount = rows * cells;
	var mapName = rows === 1 || cells === 1 ? 'other' : rows + 'x' + cells;

	var getId = 0;

	if (typeof keymap === 'number') {
		var id = keymap === 48 ? 9 : keymap - 49;
		getId = gridMaps[mapName]['encode'][id];

		if (typeof getId === 'undefined') return false;
	} else {
		var isNext = keymap === 'next';
		var nextId = gridMaps[mapName]['decode'][currentTerminalName] + (isNext ? 1 : -1);

		if (isNext) {
			getId = nextId >= gridCount ? 0 : gridMaps[mapName]['encode'][nextId];
		} else {
			getId = nextId < 0 ? gridCount - 1 : gridMaps[mapName]['encode'][nextId];
		}
	}

	(0, _actions.SWITCH_TERMINAL)(gds, getId);
};

/*
export function terminalKeydown(terminal)
{
	terminal.querySelector('textarea').addEventListener( 'keydown', (e) => {
		const keymap 	= e.keyCode || e.which;

		if ( e.ctrlKey || e.metaKey )
		{
			switch (keymap)
			{
				case 192 :	// Ctrl + ~
					switchTerminal('next');
					break;

				case 48 :	// Ctrl + 0
				case 49 :	// Ctrl + 1
				case 50 :	// Ctrl + 2
				case 51 :	// Ctrl + 3
				case 52 :	// Ctrl + 4
				case 53 :	// Ctrl + 5
				case 54 :	// Ctrl + 6
				case 55 :	// Ctrl + 7
				case 56 :	// Ctrl + 8
				case 57 :	// Ctrl + 9
					switchTerminal(keymap);
					break;
			}
		}

		if (e.shiftKey)
		{
			if (keymap === 192)	// Shift + ~
			{
				switchTerminal('prev');
			}
		}
	});
}*/

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(7);

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Output = function () {
	function Output(terminal) {
		_classCallCheck(this, Output);

		this.terminal = terminal;

		this.context = (0, _dom2.default)('div.emptyLinesWrapper');
		this.emptyLines = 0;
		this.outputStrings = '';
		this.cmdLineOffset = '';

		this.terminal.cmd().after(this.context);

		this.clearScreen = false;
		this.numRows = 0;
	}

	_createClass(Output, [{
		key: 'setNumRows',
		value: function setNumRows(numRows) {
			this.numRows = numRows;
			return this;
		}
	}, {
		key: 'setNumChars',
		value: function setNumChars(numOfChars) {
			this.numOfChars = numOfChars;
			return this;
		}
	}, {
		key: 'setCharHeight',
		value: function setCharHeight(charHeight) {
			this.charHeight = charHeight;
			return this;
		}
	}, {
		key: 'countEmpty',
		value: function countEmpty() {
			var _this = this;

			if (!this.numRows) {
				console.warn('No num rows !!!!!!!!!!!!');
			}

			var numOfRows = this.numRows || this.terminal.rows(); //this.terminal.rows() - slow dom append cursor to body

			var noClearScreen = function noClearScreen() {
				return _this.emptyLines > 0 ? _this.emptyLines - _this.getOutputLength() : 0;
			};
			var isClearScreen = function isClearScreen() {
				return numOfRows - (_this.getOutputLength() + 2);
			}; // 2 = cmd line + command name

			this.emptyLines = this.clearScreen ? isClearScreen() : noClearScreen();

			if (this.emptyLines < 0) this.emptyLines = 0;

			return this;
		}
	}, {
		key: 'prepare',
		value: function prepare(output) {
			var clearScreen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			this.outputStrings = output;
			this.clearScreen = clearScreen;

			this.countEmpty().printOutput().attachEmpty().scroll();
		}
	}, {
		key: 'recalculate',
		value: function recalculate() {
			this.countEmpty().attachEmpty().scroll();
		}
	}, {
		key: 'attachEmpty',
		value: function attachEmpty() {
			this.context.innerHTML = '';

			if (this.emptyLines > 0) this.context.innerHTML = [].concat(_toConsumableArray(new Array(this.emptyLines + 1))).join('<div><span>&nbsp;</span></div>');

			return this;
		}
	}, {
		key: 'getOutputLength',
		value: function getOutputLength() {
			var chars = this.numOfChars || this.terminal.cols();
			var lines = (0, _helpers.splitIntoLinesArr)(this.outputStrings, chars);

			return lines.length;
		}
	}, {
		key: 'printOutput',
		value: function printOutput() {
			this.cmdLineOffset = this.terminal.cmd()[0].offsetTop - (this.charHeight ? this.charHeight : 0);

			// const chars = this.numOfChars || this.terminal.cols();
			this.terminal.echo(this.outputStrings);

			return this;
		}
	}, {
		key: 'scroll',
		value: function scroll() {
			if (this.emptyLines === 0) {
				this.terminal.scroll().scroll(this.cmdLineOffset); // to first line, to desired line //TEST
			} else {
				this.terminal.scroll_to_bottom();
			}
		}
	}]);

	return Output;
}();

exports.default = Output;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TabManager = function () {
	function TabManager() {
		_classCallCheck(this, TabManager);

		this.index = 0;
		this.list = [];
		this.output = '';
	}

	_createClass(TabManager, [{
		key: '_getCommand',
		value: function _getCommand() {
			return this.list[this.index];
		}
	}, {
		key: '_formatOutput',
		value: function _formatOutput(cmd) {
			if (cmd) // last element in the array is an empty string
				{
					cmd = '>' + cmd;
					var pos = this.output.indexOf(cmd);
					var index = pos + cmd.length;

					if (pos !== -1) // show this only if command is found
						return this.output.substr(0, index) + '[[;red;blue;]\xB7]' + this.output.substr(index + 1, this.output.length);
				}

			return this.output;
		}
	}, {
		key: 'reset',
		value: function reset() {
			var commandList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var output = arguments[1];

			this.list = commandList;
			this.index = false;
			this.output = output;

			if (commandList.length) {
				this.list.push(''); // empty command line
			}
		}
	}, {
		key: 'next',
		value: function next() {
			this.index = this.index === false ? 0 : this.index + 1;

			if (this.list.length <= this.index) this.index = 0;

			return this;
		}
	}, {
		key: 'prev',
		value: function prev() {
			this.index--;

			if (this.index < 0) this.index = this.list.length - 1;

			return this;
		}
	}, {
		key: 'move',
		value: function move() {
			var isOn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			if (isOn) return this.prev();

			return this.next();
		}
	}, {
		key: 'run',
		value: function run(terminal) {
			var cmd = this._getCommand();

			if (cmd !== undefined) {
				terminal.update(-1, this._formatOutput(cmd));
				terminal.cmd().set(cmd);
			}

			return [];
		}
	}]);

	return TabManager;
}();

exports.default = TabManager;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rules = {
	apollo: {
		cmd: '¤:3SSRDOCSYYHK1/N ///// DMMMYY/ //          /          /',

		rules: [' /////',
		// '¤:3SSRDOCSYYHK1/N',
		' DMMMYY', ' // ', '          /', '          /']
	},

	sabre: {
		cmd: '3DOCSA/DB/DDMMMYY/      /        /        -',
		rules: ['3DOCSA/DB/']
	},

	amadeus: {
		cmd: 'SRDOCSYYHK1-----  DDMMMYY   -     --        -       /P',
		rules: ['SRDOCSYYHK1']
	}
};

var F8Reader = function () {
	function F8Reader(_ref) {
		var terminal = _ref.terminal,
		    gds = _ref.gds;

		_classCallCheck(this, F8Reader);

		this.index = 0;
		this.terminal = terminal;
		this.isActive = false;
		this.currentCmd = rules[gds];
	}

	_createClass(F8Reader, [{
		key: 'getIsActive',
		value: function getIsActive() {
			return this.isActive;
		}
	}, {
		key: '_getNextTabPos',
		value: function _getNextTabPos() {
			var subStr = this.currentCmd.rules[this.index];
			return this.terminal.get_command().indexOf(subStr);
		}
	}, {
		key: 'jumpToNextPos',
		value: function jumpToNextPos() {
			// console.log('position', this._getNextTabPos() );
			// console.log(' tab pressed ', this.currentCmd.rules, this.index);

			if (!this.currentCmd.rules[this.index]) {
				this.isActive = false;
				this.index = 0;

				return false;
			}

			this.terminal.cmd().position(this._getNextTabPos());
			this.index++;
		}
	}, {
		key: 'replaceEmptyChar',
		value: function replaceEmptyChar(evt) {
			if (this.getIsActive()) {
				if (evt.key.length === 1 && !evt.ctrlKey) // issue 01
					{
						var curPos = this.terminal.cmd().position();
						var charToReplace = this.terminal.get_command().substr(curPos, 1);

						/*const char = this.terminal.get_command().charAt(
      	this.terminal.cmd().position()
      );
      console.log(char);*/

						if (charToReplace === '/') return false;

						this.terminal.cmd().delete(+1);
					}
			}
		}
	}, {
		key: 'getFullCommand',
		value: function getFullCommand() {
			this.index = 0;
			this.isActive = true;
			return this.currentCmd.cmd;
		}
	}]);

	return F8Reader;
}();

exports.default = F8Reader;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = History;

var _actions = __webpack_require__(0);

var promises = {};
var commands = {};

function History() {
	var gds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'apollo';

	var pos = false;
	var length = 0;

	commands[gds] = commands[gds] || [];

	var askServer = function askServer() {
		return (0, _actions.GET_HISTORY)();
	};
	var getData = function getData() {
		// if ( promises[gds] && !pos )
		// 	pos = commands[gds].length - 1;

		// this will ask server only once per GDS
		promises[gds] = promises[gds] || new Promise(function (resolve) {

			askServer().then(function (response) {
				commands[gds] = response.data;
				pos = commands[gds].length;
				length = commands[gds].length;
			}).then(resolve);
		});

		return promises[gds];
	};

	var checkIfListUpdated = function checkIfListUpdated() {

		if (commands[gds]) // when new commands were executed update position
			{
				if (commands[gds].length !== length) {
					length = commands[gds].length;
					pos = length;
				}
			}
	};

	return {

		add: function add(cmd) {
			if (commands[gds]) commands[gds].push(cmd);
		},

		next: function next() {
			if (length === 0) return getData();

			if (pos < commands[gds].length) ++pos;

			checkIfListUpdated();

			return getData().then(function () {
				return commands[gds][pos] || '';
			});
		},

		previous: function previous() {
			checkIfListUpdated();

			return getData().then(function () {
				if (pos > 0) --pos;

				return commands[gds][pos];
			});
		}
	};
}

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(2);

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(7);

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(8);

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.PqQuotes = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = __webpack_require__(3);

var _component2 = _interopRequireDefault(_component);

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

var _actions = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PqQuotes = exports.PqQuotes = function (_Component) {
	_inherits(PqQuotes, _Component);

	function PqQuotes() {
		_classCallCheck(this, PqQuotes);

		var _this = _possibleConstructorReturn(this, (PqQuotes.__proto__ || Object.getPrototypeOf(PqQuotes)).call(this, 'td.pqQuotes hidden bg-white b-l b-r'));

		_this.observe(new _component2.default('section.hbox stretch').observe(new _component2.default('section.vbox').observe(new _component2.default('section.scrollable').observe(new Body()))));
		return _this;
	}

	_createClass(PqQuotes, [{
		key: "stateToProps",
		value: function stateToProps(_ref) {
			var pqToShow = _ref.pqToShow;

			return { pqToShow: pqToShow };
		}
	}, {
		key: "_renderer",
		value: function _renderer() {
			this.context.classList.toggle('hidden', !this.props['pqToShow']);
		}
	}]);

	return PqQuotes;
}(_component2.default);

var Body = function (_Component2) {
	_inherits(Body, _Component2);

	function Body() {
		_classCallCheck(this, Body);

		return _possibleConstructorReturn(this, (Body.__proto__ || Object.getPrototypeOf(Body)).call(this, 'div.hbox stretch'));
	}

	_createClass(Body, [{
		key: "_renderer",
		value: function _renderer() {
			var _this3 = this;

			if (this.props['pqToShow']) {
				this.context.innerHTML = '';

				this.context.appendChild((0, _dom2.default)('span.close', {
					innerHTML: '&times;',
					onclick: _actions.HIDE_PQ_QUOTES
				}));

				this.context.appendChild((0, _dom2.default)('br'));

				this.props['pqToShow'].result.map(function (pq) {

					_this3.context.appendChild((0, _dom2.default)('span.m-r-sm', { innerHTML: 'Selling:' }));

					_this3.context.appendChild((0, _dom2.default)('strong.m-r-sm', { innerHTML: pq['selling'] }));

					_this3.context.appendChild((0, _dom2.default)('span.m-r-sm', { innerHTML: 'NET:' }));

					_this3.context.appendChild((0, _dom2.default)('strong.m-r-sm', { innerHTML: pq['net'] }));

					_this3.context.appendChild((0, _dom2.default)('strong.label label-mozilla', { innerHTML: pq['addedByGroupLabel'] }));

					_this3.context.appendChild((0, _dom2.default)('div.m-t-sm', {}));

					_this3.context.appendChild((0, _dom2.default)('pre.priceqoute-pre pos-rlt m-b-none m-t-none t-courier', { innerHTML: pq['reservationDump'] }));

					_this3.context.appendChild((0, _dom2.default)('br', {}));
				});
			}
		}
	}]);

	return Body;
}(_component2.default);

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

var _terminal = __webpack_require__(11);

var _terminal2 = _interopRequireDefault(_terminal);

var _cookie = __webpack_require__(10);

var _actions = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FullScreen = function () {
	function FullScreen() {
		_classCallCheck(this, FullScreen);
	}

	_createClass(FullScreen, null, [{
		key: 'makeBody',
		value: function makeBody() {
			var body = (0, _dom2.default)('div.terminal-full-screen terminal-wrap-custom terminal-cell t-f-size-13 text-center t-height-100');
			var body2 = (0, _dom2.default)('div.terminal-body');

			body.appendChild(body2);
			return body;
		}
	}, {
		key: 'terminal',
		value: function terminal(_ref) {
			var body = _ref.body,
			    html = _ref.html,
			    props = _objectWithoutProperties(_ref, ['body', 'html']);

			var dimensions = {
				height: body.clientHeight,
				width: body.clientWidth,
				char: ''
			};

			var terminal = new _terminal2.default(props);

			terminal.reattach(body, dimensions);
			terminal.context.innerHTML = html;

			// on close there is two cmd lines
			var cmd = terminal.context.querySelector('.cmd');
			cmd.parentNode.removeChild(cmd);

			// remove cloned empty lines
			var emptyLines = terminal.context.querySelector('.emptyLinesWrapper');
			emptyLines.parentNode.removeChild(emptyLines);

			terminal.init();
		}
	}, {
		key: 'show',
		value: function show(gds, activeTerminal) {
			var _this = this;

			var themeClass = (0, _cookie.cookieGet)('terminalTheme_' + apiData.auth.id) || 'terminaltheme_' + apiData['terminalThemes'][0]['id'];
			var body = this.makeBody();

			window.apiData.Modal.make({
				dialog_class: 'modal-full no-footer',
				body_class: 'no-padder ' + themeClass,
				body: body,
				noCloseBtn: 1,
				header: 'Full Screen'
			}).show(function (params) {

				params.modal.on('hidden.bs.modal', function () {
					(0, _actions.UPDATE_STATE)({});
					params.modal.detach().remove();
				});

				var props = {
					name: 'fullScreen',
					gds: gds,
					html: activeTerminal.get(0).innerHTML,
					body: body
				};

				_this.terminal(props);
			});
		}
	}]);

	return FullScreen;
}();

exports.default = FullScreen;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.PqParser = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requests = __webpack_require__(5);

var _actions = __webpack_require__(0);

var _debug = __webpack_require__(8);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var throwError = function throwError(err) {

	if (typeof err === 'string') err = [err];

	var separator = err.length > 1 ? '-' : '';
	var printErrors = function printErrors(msg) {
		return separator + msg;
	};
	var html = err.map(printErrors).join('</br></br>');

	var pqErrMsg = {
		msg: html,
		align: err.length > 1 ? 'text-left' : ''
	};

	(0, _debug.notify)({ msg: pqErrMsg.msg });
	return Promise.reject();
};

var isPqError = function isPqError(_ref) {
	var data = _ref.data,
	    result = _ref.result;


	return [data.canCreatePqErrors, data.errors, result.error, result.msg].filter(function (er) {
		return er && er !== undefined && er.length > 0;
	});
	// .toString().split(',')
};

var PqParser = exports.PqParser = function () {
	function PqParser(modal) {
		_classCallCheck(this, PqParser);

		this.modal = modal;
	}

	_createClass(PqParser, [{
		key: "show",
		value: function show(errors, rId) {
			var _this = this;

			if (errors) return throwError(errors);

			document.querySelector('#spinners').classList.remove('hidden');
			document.querySelector('#loadingDots').classList.remove('loading-hidden');

			(0, _requests.get)("terminal/priceQuote?rId=" + rId).then(function (response) {
				document.querySelector('#spinners').classList.add('hidden');
				document.querySelector('#loadingDots').classList.add('loading-hidden');

				var pqError = isPqError(response);

				if (pqError.length) return throwError(pqError);

				return response;
			}).then(function (response) {
				(0, _requests.get)("terminal/importPriceQuote?rId=" + rId);
				return response;
			}).then(function (response) {
				return _this.modal(response, _actions.CLOSE_PQ_WINDOW);
			}).then(function () {
				(0, _actions.UPDATE_STATE)({ hideMenu: true });
			});
		}
	}]);

	return PqParser;
}();

/***/ }),
/* 48 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=terminal-bundle.js.map