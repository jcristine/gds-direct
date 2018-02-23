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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UPDATE_STATE = exports.ADD_WHIDE_COLUMN = exports.CHANGE_FONT_SIZE = exports.SWITCH_TERMINAL = exports.CLOSE_PQ_WINDOW = exports.PQ_MODAL_SHOW = exports.HIDE_PQ_QUOTES = exports.SHOW_PQ_QUOTES = exports.PURGE_SCREENS = exports.GET_HISTORY = exports.CHANGE_INPUT_LANGUAGE = exports.DEV_CMD_STACK_RUN = exports.CHANGE_SESSION_BY_MENU = exports.UPDATE_CUR_GDS = exports.CHANGE_GDS = exports.CHANGE_ACTIVE_TERMINAL = exports.CHANGE_MATRIX = exports.INIT = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = __webpack_require__(2);

var _state = __webpack_require__(15);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = void 0;

var INIT = exports.INIT = function INIT(App) {
	app = App;
	app.getContainer();

	(0, _state.setProvider)(function (State) {
		return app.getContainer().render(State);
	});

	UPDATE_STATE({
		requestId: app.params.requestId,
		gdsObjName: app.Gds.getCurrentName(),
		permissions: app.params.permissions
	});
};

var CHANGE_MATRIX = exports.CHANGE_MATRIX = function CHANGE_MATRIX(matrix) {
	app.Gds.update({ matrix: matrix });
	UPDATE_STATE();
};

var CHANGE_ACTIVE_TERMINAL = exports.CHANGE_ACTIVE_TERMINAL = function CHANGE_ACTIVE_TERMINAL(_ref) {
	var curTerminalId = _ref.curTerminalId;

	app.Gds.changeActive(curTerminalId);
	(0, _state.getters)('active', curTerminalId + 1);
};

var CHANGE_GDS = exports.CHANGE_GDS = function CHANGE_GDS(gdsName) {
	(0, _state.getters)('switch', gdsName);
	app.Gds.setCurrent(gdsName);
	UPDATE_STATE({ gdsObjName: app.Gds.getCurrentName() });
};

var UPDATE_CUR_GDS = exports.UPDATE_CUR_GDS = function UPDATE_CUR_GDS(gdsName, _ref2) {
	var canCreatePq = _ref2.canCreatePq,
	    canCreatePqErrors = _ref2.canCreatePqErrors,
	    area = _ref2.area,
	    pcc = _ref2.pcc,
	    startNewSession = _ref2.startNewSession;


	var sessionIndex = _constants.AREA_LIST.indexOf(area);
	var newPcc = _defineProperty({}, sessionIndex, pcc);

	if (startNewSession) {
		app.Gds.update({ pcc: { newPcc: newPcc }, canCreatePq: canCreatePq, canCreatePqErrors: canCreatePqErrors, sessionIndex: sessionIndex });
	} else {
		app.Gds.updatePcc(newPcc);
		app.Gds.update({ canCreatePq: canCreatePq, canCreatePqErrors: canCreatePqErrors, sessionIndex: sessionIndex });
	}

	(0, _state.setState)({ gdsList: app.Gds.getList() });
};

var CHANGE_SESSION_BY_MENU = exports.CHANGE_SESSION_BY_MENU = function CHANGE_SESSION_BY_MENU(area) {
	(0, _state.getters)('session', area);

	var command = (app.Gds.isApollo() ? 'S' : '¤') + area;
	return DEV_CMD_STACK_RUN([command]);
};

var DEV_CMD_STACK_RUN = exports.DEV_CMD_STACK_RUN = function DEV_CMD_STACK_RUN(command) {
	return app.Gds.runCommand(command);
};

var CHANGE_INPUT_LANGUAGE = exports.CHANGE_INPUT_LANGUAGE = function CHANGE_INPUT_LANGUAGE(language) {
	(0, _state.getters)('language', language);
	(0, _state.setState)({ language: language });
};

var GET_HISTORY = exports.GET_HISTORY = function GET_HISTORY() {
	return (0, _state.getters)('history');
};

var PURGE_SCREENS = exports.PURGE_SCREENS = function PURGE_SCREENS() {
	app.Gds.clearScreen();
	// getters('clear'); // TO MANY REQUESTS;
};

var showPq = function showPq(newState) {
	var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

	app.setOffset(offset);
	UPDATE_STATE(newState);
};

var SHOW_PQ_QUOTES = exports.SHOW_PQ_QUOTES = function SHOW_PQ_QUOTES() {
	return (0, _state.getters)('showExistingPq').then(function (response) {
		return showPq({ pqToShow: response }, 500);
	});
};
var HIDE_PQ_QUOTES = exports.HIDE_PQ_QUOTES = function HIDE_PQ_QUOTES() {
	return showPq({ pqToShow: false });
};

var PQ_MODAL_SHOW = exports.PQ_MODAL_SHOW = function PQ_MODAL_SHOW() {
	app.pqParser.show(app.getGds(), app.params.requestId).then(function () {
		showPq({ hideMenu: true }, 0);
	});
};

var CLOSE_PQ_WINDOW = exports.CLOSE_PQ_WINDOW = function CLOSE_PQ_WINDOW() {
	return showPq({ hideMenu: false });
};

var SWITCH_TERMINAL = exports.SWITCH_TERMINAL = function SWITCH_TERMINAL(fn) {

	var curTerminalId = fn(app.getGds().get());

	setTimeout(function () {
		// THIS IS CRAZY SHIT. WITHOUT IT SWITCHES TERMINALS SEVERAL TIMES TRY PRESS ~
		var terminal = app.Gds.getCurrent().get('terminals');

		if (curTerminalId !== false) terminal[curTerminalId].plugin.terminal.focus();
	}, 100);
};

var CHANGE_FONT_SIZE = exports.CHANGE_FONT_SIZE = function CHANGE_FONT_SIZE(props) {
	app.getContainer().changeFontClass(props);
	UPDATE_STATE(props);
};

var ADD_WHIDE_COLUMN = exports.ADD_WHIDE_COLUMN = function ADD_WHIDE_COLUMN() {
	app.Gds.update({
		hasWide: !app.getGds().get('hasWide')
	});

	UPDATE_STATE();
};

var UPDATE_STATE = exports.UPDATE_STATE = function UPDATE_STATE() {
	var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	(0, _state.setState)(_extends({}, props, {
		gdsList: app.calculateMatrix().Gds.getList()
	}));
};

// export const PQ_MODAL_SHOW_DEV = () => {
// 	app.pqParser.show( app.getGds()['canCreatePqErrors'], app.params.requestId )
// 		.then( () => {
// 			app.setOffset(0);
// 			UPDATE_STATE({hideMenu: true})
// 		});
// };

/*export const FULL_SCREEN = () => {
	// if ( state.getGdsObj()['curTerminalId'] >= 0 )
	// 	return FullScreen.show(state.getGds(), window.activePlugin.terminal);
	//
	// alert('no terminal selected');
};*/

// const Actions = ( props = {}, name ) => {
//
// 	switch (action)
// 	{
// 		case 'CHANGE_FONT_SIZE' :
// 			app.getContainer().changeFontClass(props);
// 		break;
//
// 		case 'ADD_WHIDE_COLUMN' :
// 			app.Gds.update({hasWide : !app.getGds().get('hasWide')});
// 		break;
// 	}
//
//
// 	UPDATE_STATE(props);
// };

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
var MAX_ROWS = exports.MAX_ROWS = 4;
var MAX_CELLS = exports.MAX_CELLS = 4;
var DEFAULT_CELLS = exports.DEFAULT_CELLS = [0, 1, 5, 6];

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
	function Component(selector, params) {
		_classCallCheck(this, Component);

		this.context = (0, _dom2.default)(selector, params);
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
/***/ (function(module, exports) {

module.exports = vendor_lib;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getStorageMatrix = exports.getDate = exports.splitIntoLinesArr = exports.makePages = exports.getReplacement = undefined;

var _constants = __webpack_require__(2);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

var _getStorage = function _getStorage(name) {
	var saved = localStorage.getItem(name);
	return saved ? JSON.parse(saved) : false;
};

var getStorageMatrix = exports.getStorageMatrix = function getStorageMatrix() {

	var matrix = _getStorage('matrix');

	if (matrix && !matrix.list) return { rows: 1, cells: 1, list: [].concat(_toConsumableArray(_constants.DEFAULT_CELLS)) };

	if (!matrix) {
		return { rows: 1, cells: 1, list: [].concat(_toConsumableArray(_constants.DEFAULT_CELLS)) };
	}

	return matrix;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tetherDrop = __webpack_require__(39);

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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setLink = exports.get = undefined;

var _constants = __webpack_require__(2);

__webpack_require__(12);

var _debug = __webpack_require__(8);

var JParam = __webpack_require__(14);

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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.notify = exports.showUserMessages = exports.debugRequest = exports.Debug = undefined;

var _noty = __webpack_require__(13);

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
		type: 'error',
		progressBar: false,
		animation: {
			open: 'animated fadeIn', // Animate.css class names
			close: 'animated fadeOut' // Animate.css class names
		}
	}).show();

	console.warn('Server Returned: ', err);
};

var showUserMessages = exports.showUserMessages = function showUserMessages(response) {

	if (response && response['data'] && response['data']['userMessages']) {
		var userMessages = response['data']['userMessages'];

		notify({
			msg: userMessages.join(''),
			type: 'warning',
			timeout: 4000
		});
	}

	return response;
};

var notify = exports.notify = function notify(_ref) {
	var msg = _ref.msg,
	    _ref$align = _ref.align,
	    align = _ref$align === undefined ? 'bottomLeft' : _ref$align,
	    _ref$type = _ref.type,
	    type = _ref$type === undefined ? 'error' : _ref$type,
	    _ref$timeout = _ref.timeout,
	    timeout = _ref$timeout === undefined ? 10000 : _ref$timeout;


	return new _noty2.default({
		text: '<p class="noty-wrap-text">' + msg + '</p>',
		layout: align,
		timeout: timeout,
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

// const cookie = {
// 	get : (name) => {
// 		const 	value = '; ' + document.cookie,
// 			parts = value.split('; ' + name + '=');
//
// 		if (parts.length === 2)
// 		{
// 			return parts.pop().split(';').shift();
// 		}
// 	},
//
// 	set : (name, value, xmins) => {
// 		const 	d = new Date(),
// 			expires = 'expires='+ d.toUTCString();
//
// 		xmins = !isNaN(parseFloat(xmins)) ? parseFloat(xmins) : 1;
// 		d.setTime(d.getTime() + (xmins*60*1000));
// 		document.cookie = name + '=' + value + '; ' + expires;
// 	}
// };

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(11);
module.exports = __webpack_require__(51);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requests = __webpack_require__(7);

var _actions = __webpack_require__(0);

var _gds = __webpack_require__(16);

var _main = __webpack_require__(34);

var _main2 = _interopRequireDefault(_main);

var _pqParser = __webpack_require__(50);

var _cookie = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TerminalApp = function () {
	function TerminalApp(params) {
		_classCallCheck(this, TerminalApp);

		this.params = params;
		this.settings = params.settings;
		this.Gds = new _gds.GDS(params.settings.gds, params['buffer'], this.settings['common']['currentGds']);
		this.pqParser = new _pqParser.PqParser(params["PqPriceModal"]);
		this.offset = 100; //menu

		this.container = new _main2.default(params['htmlRootId']);

		(0, _requests.setLink)(params['commandUrl']);
		(0, _actions.INIT)(this);

		initGlobEvents();
	}

	_createClass(TerminalApp, [{
		key: 'getContainer',
		value: function getContainer() {
			return this.container;
		}
	}, {
		key: 'getGds',
		value: function getGds() {
			return this.Gds.getCurrent();
		}
	}, {
		key: 'getCharLength',
		value: function getCharLength() {
			return this.container.getTempTerminal().getLineHeight();
		}
	}, {
		key: 'getOffset',
		value: function getOffset() {
			return this.offset || 0;
		}
	}, {
		key: 'setOffset',
		value: function setOffset(value) {
			this.offset = value;
		}
	}, {
		key: 'calculateMatrix',
		value: function calculateMatrix() {
			var _Gds$getCurrent$get = this.Gds.getCurrent().get('matrix'),
			    rows = _Gds$getCurrent$get.rows,
			    cells = _Gds$getCurrent$get.cells;

			var hasWide = this.Gds.getCurrent().get('hasWide');

			var sizes = {
				height: Math.floor(this.container.context.clientHeight / (rows + 1)),
				width: Math.floor((this.container.context.clientWidth - this.getOffset()) / (cells + (hasWide ? 2 : 1)))
			};

			var dimensions = {
				char: this.getCharLength(),
				size: sizes,
				parent: {
					height: this.container.context.clientHeight,
					width: this.container.context.clientWidth - this.getOffset()
				}
			};

			this.Gds.updateMatrix(dimensions);

			return this;
		}
	}, {
		key: 'runPnr',
		value: function runPnr(_ref) {
			var pnrCode = _ref.pnrCode,
			    _ref$gdsName = _ref.gdsName,
			    gdsName = _ref$gdsName === undefined ? 'apollo' : _ref$gdsName;

			if (pnrCode) {
				(0, _actions.CHANGE_GDS)(gdsName);
				(0, _actions.CHANGE_ACTIVE_TERMINAL)({ curTerminalId: 0 });
				(0, _actions.DEV_CMD_STACK_RUN)('*' + pnrCode);
			}
		}
	}]);

	return TerminalApp;
}();

window.terminal = TerminalApp;

var resizeTimeout = void 0;

var initGlobEvents = function initGlobEvents() {

	window.onresize = function () {

		if (resizeTimeout) {
			clearInterval(resizeTimeout);
		}

		resizeTimeout = setTimeout(function () {
			return (0, _actions.UPDATE_STATE)({});
		}, 10);
	};

	// const exec_terminal = () =>	{
	// const
	// 	pnrCode = cookieGet('pnrCode'),
	// 	gdsName = cookieGet('gdsName') || 'apollo';
	//
	// if (pnrCode)
	// {
	// 	cookieSet('pnrCode', '');
	// 	cookieSet('gdsName', '');
	//
	// 	CHANGE_GDS(gdsName);
	// 	CHANGE_ACTIVE_TERMINAL({curTerminalId : 0});
	// 	DEV_CMD_STACK_RUN('*' + pnrCode);
	// }
	// };


	// setTimeout(() => {
	//
	// 	window.onhashchange = () => {
	//
	// 		if (location.hash === "#terminalNavBtntab")
	// 		{
	// 			exec_terminal();
	// 		}
	// 	};
	//
	// 	exec_terminal();
	//
	// }, 300);
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(4))(14);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(4))(11);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(4))(15);

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setProvider = exports.getters = exports.setState = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _requests = __webpack_require__(7);

var State = {
	language: 'APOLLO',
	fontSize: 1,
	hideMenu: false,
	requestId: null,
	gdsList: [],
	gdsObjName: ''
};

window.TerminalState = {
	isLanguageApollo: function isLanguageApollo() {
		return State.language === 'APOLLO';
	},
	getLanguage: function getLanguage() {
		return State.language;
	},
	hasPermissions: function hasPermissions() {
		return State.permissions;
	}
};

var setState = exports.setState = function setState(newState) {
	var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';


	if (action) {
		switch (action) {
			default:
		}
	} else {
		State = _extends({}, State, newState);
	}

	State = State = _extends({}, State, { action: action });

	console.log('STATE:', State);
	renderView(State);
};

var getters = exports.getters = function getters(action, props) {

	var GET = function GET(urlPart, param) {
		return (0, _requests.get)(urlPart + '/' + State.gdsObjName + '/' + param);
	};

	switch (action) {
		case 'active':
			GET('terminal/saveSetting/terminal', props);
			break;

		case 'switch':
			GET('terminal/saveSetting/gds', props);
			break;

		case 'session':
			GET('terminal/saveSetting/area', props);
			break;

		case 'language':
			GET('terminal/saveSetting/language', props);
			break;

		case 'clear':
			(0, _requests.get)('terminal/clearBuffer', true);
			break;

		case 'history':
			return (0, _requests.get)('terminal/lastCommands?rId=' + State.requestId + '&gds=' + State.gdsObjName);
			break;

		case 'showExistingPq':
			return (0, _requests.get)('terminal/priceQuotes?rId=' + State.requestId);
			break;
	}
};

var renderView = void 0;
var setProvider = exports.setProvider = function setProvider(containerRender) {
	renderView = containerRender;
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.GDS = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = __webpack_require__(2);

var _gdsUnit = __webpack_require__(17);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GDS = exports.GDS = function () {
	function GDS(gdsList) {
		var _this = this;

		var buffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var activeName = arguments[2];

		_classCallCheck(this, GDS);

		this.list = gdsList;
		this.buffer = buffer;
		this.setCurrent(activeName);

		this.gdsSet = _constants.GDS_LIST.map(function (name) {

			var settings = _this.list[name] || {};

			var _ref = _this.buffer || {},
			    _ref$gds = _ref.gds,
			    gds = _ref$gds === undefined ? {} : _ref$gds;

			return new _gdsUnit.GDS_UNIT(name, settings, gds);
		});
	}

	_createClass(GDS, [{
		key: 'getList',
		value: function getList() {
			return this.gdsSet;
		}
	}, {
		key: 'setCurrent',
		value: function setCurrent() {
			var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'apollo';

			this.name = name;
		}
	}, {
		key: 'getCurrent',
		value: function getCurrent() {
			var _this2 = this;

			return this.gdsSet.filter(function (gds) {
				return _this2.name === gds.get('name');
			})[0];
		}
	}, {
		key: 'getCurrentName',
		value: function getCurrentName() {
			return this.name;
		}
	}, {
		key: 'isApollo',
		value: function isApollo() {
			return this.name === 'apollo';
		}
	}, {
		key: 'update',
		value: function update(newState) {
			var _this3 = this;

			this.gdsSet = this.gdsSet.map(function (gds) {

				if (gds.get('name') === _this3.name) {
					gds.update(newState);
				}

				return gds;
			});
		}
	}, {
		key: 'updateMatrix',
		value: function updateMatrix(dimensions) {
			this.getCurrent().updateMatrix(dimensions);
		}
	}, {
		key: 'updatePcc',
		value: function updatePcc(newState) {
			this.getCurrent().updatePcc(newState);
		}
	}, {
		key: 'clearScreen',
		value: function clearScreen() {
			this.getCurrent().get('terminals').forEach(function (terminal) {
				return terminal.clear();
			});
		}
	}, {
		key: 'getActiveTerminal',
		value: function getActiveTerminal() {
			return this.getCurrent().getActiveTerminal();
		}
	}, {
		key: 'changeActive',
		value: function changeActive(index) {
			var terminal = this.getActiveTerminal();

			if (typeof terminal !== 'undefined') {
				terminal.context.classList.remove('activeWindow');
			}

			this.update({ curTerminalId: index });
			this.getActiveTerminal().context.classList.add('activeWindow');

			// return this.getActiveTerminal().context; // for focus
		}
	}, {
		key: 'runCommand',
		value: function runCommand(command) {
			var terminal = this.getActiveTerminal();

			if (typeof terminal === 'undefined') {
				alert('Please select terminal first');
				return Promise.reject('Please select terminal first');
			}

			terminal.plugin.terminal.exec(command);
			return Promise.resolve();
		}
	}]);

	return GDS;
}();

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.GDS_UNIT = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = __webpack_require__(2);

var _terminal = __webpack_require__(18);

var _terminal2 = _interopRequireDefault(_terminal);

var _helpers = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GDS_UNIT = exports.GDS_UNIT = function () {
	function GDS_UNIT(name, settings, buffer) {
		_classCallCheck(this, GDS_UNIT);

		var props = {
			name: name,
			list: name === 'sabre' ? _constants.AREA_LIST : _constants.AREA_LIST.slice(0, -1),
			buffer: buffer[name]
		};

		this.settings = _extends({}, props);

		this.props = {
			matrix: (0, _helpers.getStorageMatrix)(),
			sessionIndex: _constants.AREA_LIST.indexOf(settings['area']),
			pcc: {},
			canCreatePq: false, //1
			history: [],
			terminals: {},
			curTerminalId: undefined,
			dimensions: {},
			hasWide: false
		};

		return this;
	}

	_createClass(GDS_UNIT, [{
		key: "get",
		value: function get(name) {
			if (!name) {
				return this.props;
			}

			return this.settings[name] || this.props[name];
		}
	}, {
		key: "set",
		value: function set(name, value) {
			this.props[name] = value;
		}
	}, {
		key: "update",
		value: function update(newState) {
			this.props = _extends({}, this.props, newState);
		}
	}, {
		key: "updatePcc",
		value: function updatePcc(newState) {
			var pcc = _extends({}, this.get('pcc'), newState);
			this.set('pcc', pcc);
		}
	}, {
		key: "updateMatrix",
		value: function updateMatrix(dimensions) {
			var _this = this;

			var _get = this.get('matrix'),
			    list = _get.list;

			var terminals = [].concat(_toConsumableArray(this.get('terminals')));

			list.filter(function (index) {
				return !terminals[index];
			}).forEach(function (index) {

				terminals[index] = new _terminal2.default({
					name: index,
					gds: _this.get('name'),
					buffer: _this.get('buffer') ? _this.get('buffer')['terminals'][index + 1] : ''
				});
			});

			terminals['wide'] = terminals['wide'] || new _terminal2.default({
				name: 'wide',
				gds: this.get('name'),
				buffer: ''
			});

			this.set('terminals', terminals);
			this.set('dimensions', dimensions);
		}
	}, {
		key: "getActiveTerminal",
		value: function getActiveTerminal() {
			return this.get('terminals')[this.get('curTerminalId')];
		}
	}]);

	return GDS_UNIT;
}();

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = __webpack_require__(19);

var _plugin2 = _interopRequireDefault(_plugin);

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

__webpack_require__(33);

var Terminal = function () {
	function Terminal(params) {
		_classCallCheck(this, Terminal);

		this.plugin = null;
		this.settings = params;
		this.context = (0, _dom2.default)('div.terminal terminal-cell');

		this.makeBuffer(params.buffer);
	}

	_createClass(Terminal, [{
		key: 'initPlugin',
		value: function initPlugin() {
			var _this = this;

			this.plugin = new _plugin2.default({
				context: this.context,
				clear: function clear() {
					return _this.clear();
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
	}, {
		key: 'changeSize',
		value: function changeSize(dimension) {
			var char = dimension.char,
			    size = dimension.size;


			var charHeight = char.height;
			var charWidth = char.width;

			this.numOfRows = Math.floor(size.height / charHeight);
			this.numOfChars = Math.floor(size.width / charWidth); //2 - padding-left px : need to fix

			if (this.plugin) {
				this.plugin.resize({
					numOfChars: this.numOfChars - 2,
					numOfRows: this.numOfRows
				});

				this.plugin.emptyLinesRecalculate(this.numOfRows, this.numOfChars, char.height);
			} else {
				this.initPlugin();
			}

			// this.context.style.width 	= ( (this.numOfChars - 2) * charWidth) 	+ 'px';
			// this.context.style.height 	= (this.numOfRows * charHeight) 		+ 'px';

			this.context.style.width = size.width + 'px';
			this.context.style.height = size.height + 'px';

			return this.plugin;
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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pagination = __webpack_require__(20);

var _pagination2 = _interopRequireDefault(_pagination);

var _session = __webpack_require__(21);

var _session2 = _interopRequireDefault(_session);

var _spinner = __webpack_require__(22);

var _spinner2 = _interopRequireDefault(_spinner);

var _keyBinding = __webpack_require__(24);

var _output = __webpack_require__(26);

var _output2 = _interopRequireDefault(_output);

var _tabManager = __webpack_require__(27);

var _tabManager2 = _interopRequireDefault(_tabManager);

var _f = __webpack_require__(28);

var _f2 = _interopRequireDefault(_f);

var _history = __webpack_require__(29);

var _history2 = _interopRequireDefault(_history);

var _debug = __webpack_require__(8);

var _helpers = __webpack_require__(5);

var _actions = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = __webpack_require__(30);
window.$ = window.jQuery = $;

// require('jquery.terminal/js/jquery.terminal');
__webpack_require__(31);
__webpack_require__(32).polyfill();

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

			(0, _actions.CHANGE_ACTIVE_TERMINAL)({ curTerminalId: this.name });
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
			this.settings.numOfRows = sizes.numOfRows;
			this.settings.numOfChars = sizes.numOfChars;

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
				// onInit			: this.changeActiveTerm.bind(this),
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
					var clearScreen = result['clearScreen']; // && window.TerminalState.getMatrix().rows !== 0;
					// const clearScreen = result['clearScreen'] && window.TerminalState.getMatrix().rows !== 0;
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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(5);

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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requests = __webpack_require__(7);

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
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cliSpinners = __webpack_require__(23);

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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(4))(9);

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.pressedShortcuts = undefined;

var _helpers = __webpack_require__(5);

var _actions = __webpack_require__(0);

var _switchTerminal = __webpack_require__(25);

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
				(0, _switchTerminal.switchTerminal)({ keymap: 'next' });
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
				(0, _switchTerminal.switchTerminal)({ keymap: keymap });
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
				(0, _switchTerminal.switchTerminal)({ keymap: 'prev' });
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
/* 25 */
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
	var keymap = _ref.keymap;


	var fn = function fn(_ref2) {
		var matrix = _ref2.matrix,
		    curTerminalId = _ref2.curTerminalId;
		var list = matrix.list;


		if (typeof keymap === 'number') {
			var id = keymap === 48 ? 9 : keymap - 49;

			if (id >= list.length) {
				return false;
			}

			return list[id];
		}

		var isNext = keymap === 'next';
		var index = list.indexOf(curTerminalId);
		var changeIndex = 0;

		if (isNext) {
			changeIndex = index + 1;

			if (changeIndex >= list.length) {
				changeIndex = 0;
			}
		} else {
			changeIndex = index - 1;

			if (changeIndex < 0) {
				changeIndex = list.length - 1;
			}
		}

		return list[changeIndex];
		// return { list : list[changeIndex] };
	};

	(0, _actions.SWITCH_TERMINAL)(fn);
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
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(5);

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
/* 27 */
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
/* 28 */
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
/* 29 */
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
/* 30 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(4))(2);

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(4))(7);

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(4))(8);

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = __webpack_require__(3);

var _component2 = _interopRequireDefault(_component);

var _sectionsWrap = __webpack_require__(35);

var _tempTerminal = __webpack_require__(49);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContainerMain = function (_Component) {
	_inherits(ContainerMain, _Component);

	function ContainerMain(rootId) {
		_classCallCheck(this, ContainerMain);

		var _this = _possibleConstructorReturn(this, (ContainerMain.__proto__ || Object.getPrototypeOf(ContainerMain)).call(this, 'section.terminal-wrap-custom'));

		_this.observe(new _sectionsWrap.TableSections());

		document.getElementById(rootId).appendChild(_this.getContext());

		_this.tempTerminal = new _tempTerminal.TempTerminal();

		_this.append(_this.tempTerminal);
		return _this;
	}

	_createClass(ContainerMain, [{
		key: "changeFontClass",
		value: function changeFontClass(_ref) {
			var fontSize = _ref.fontSize;

			this.context.className = 'terminal-wrap-custom term-f-size-' + fontSize;
		}
	}, {
		key: "getTempTerminal",
		value: function getTempTerminal() {
			return this.tempTerminal;
		}
	}]);

	return ContainerMain;
}(_component2.default);

exports.default = ContainerMain;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.TableSections = undefined;

var _component = __webpack_require__(3);

var _component2 = _interopRequireDefault(_component);

var _right = __webpack_require__(36);

var _actionsMenu = __webpack_require__(45);

var _actionsMenu2 = _interopRequireDefault(_actionsMenu);

var _terminalMatrix = __webpack_require__(47);

var _terminalMatrix2 = _interopRequireDefault(_terminalMatrix);

var _PqQuotes = __webpack_require__(48);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TableSections = exports.TableSections = function (_Component) {
	_inherits(TableSections, _Component);

	function TableSections() {
		_classCallCheck(this, TableSections);

		var _this = _possibleConstructorReturn(this, (TableSections.__proto__ || Object.getPrototypeOf(TableSections)).call(this, 'table.term-body minimized'));

		_this.observe(new _component2.default('tr').observe(new LeftTd()).observe(new _PqQuotes.PqQuotes()).observe(new _right.RightSide()));
		return _this;
	}

	return TableSections;
}(_component2.default);

var LeftTd = function (_Component2) {
	_inherits(LeftTd, _Component2);

	function LeftTd() {
		_classCallCheck(this, LeftTd);

		var _this2 = _possibleConstructorReturn(this, (LeftTd.__proto__ || Object.getPrototypeOf(LeftTd)).call(this, 'td.left'));

		_this2.observe(new _terminalMatrix2.default()).observe(new _actionsMenu2.default());
		return _this2;
	}

	return LeftTd;
}(_component2.default);

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.RightSide = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = __webpack_require__(3);

var _component2 = _interopRequireDefault(_component);

var _menuPanel = __webpack_require__(37);

var _menuPanel2 = _interopRequireDefault(_menuPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RightSide = exports.RightSide = function (_Component) {
	_inherits(RightSide, _Component);

	function RightSide() {
		_classCallCheck(this, RightSide);

		var _this = _possibleConstructorReturn(this, (RightSide.__proto__ || Object.getPrototypeOf(RightSide)).call(this, 'td.menu'));

		var menu = new _menuPanel2.default();
		_this.addToObserve(menu);

		_this.append(new _component2.default('section.hbox stretch').append(new _component2.default('section.vbox').append(new _component2.default('section.scrollable').append(menu))));
		return _this;
	}

	_createClass(RightSide, [{
		key: "_renderer",
		value: function _renderer() {
			this.context.classList.toggle('hidden', this.props.hideMenu);
		}
	}]);

	return RightSide;
}(_component2.default);

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _theme = __webpack_require__(38);

var _theme2 = _interopRequireDefault(_theme);

var _history = __webpack_require__(40);

var _textSize = __webpack_require__(41);

var _textSize2 = _interopRequireDefault(_textSize);

var _sessionButtons = __webpack_require__(42);

var _pqButton = __webpack_require__(43);

var _pqButton2 = _interopRequireDefault(_pqButton);

var _devButtons = __webpack_require__(44);

var _devButtons2 = _interopRequireDefault(_devButtons);

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

var _component = __webpack_require__(3);

var _component2 = _interopRequireDefault(_component);

var _actions = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import GdsSet 			from '../modules/gds';


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

		// if ( window.TerminalState.hasPermissions() )
		// {
		// 	this.observe(
		// 		new TestsButtons()
		// 	);
		// }

		if (!window.apiData.prod) {
			_this.observe(new TestsButtons());
		}
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
			var Quotes = (0, _dom2.default)('button.btn btn-mozilla font-bold[Quotes]', { onclick: function onclick(e) {
					e.target.innerHTML = 'Loading...';

					(0, _actions.SHOW_PQ_QUOTES)().then(function () {
						e.target.innerHTML = 'Quotes';
					});
				} });

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
		key: '_renderer',
		value: function _renderer() {
			var _this4 = this;

			this.context.innerHTML = '';

			this.props.gdsList.map(function (obj) {

				var buttons = new _sessionButtons.SessionButtons({
					pcc: obj.get('pcc'),
					sessionIndex: obj.get('sessionIndex'),
					name: obj.get('name')
				});

				_this4.context.appendChild(buttons.makeTrigger(_this4.props.gdsObjName));

				if (_this4.props.gdsObjName === obj.get('name')) {
					obj.get('list').map(function (area, index) {
						_this4.context.appendChild(buttons.makeArea(area, index));
					});
				}
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
		value: function stateToProps(_ref) {
			var language = _ref.language;

			return { language: language };
		}
	}, {
		key: '_renderer',
		value: function _renderer() {
			var _this6 = this;

			this.context.innerHTML = '';

			['APOLLO', 'SABRE', 'AMADEUS'].forEach(function (value) {

				var button = (0, _dom2.default)('button.btn btn-gold t-f-size-10 font-bold' + (_this6.props.language === value ? ' active' : ''));

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

		var _this7 = _possibleConstructorReturn(this, (TestsButtons.__proto__ || Object.getPrototypeOf(TestsButtons)).call(this, 'article.hidden'));

		_this7.context.appendChild(new _devButtons2.default().getContext());
		return _this7;
	}

	_createClass(TestsButtons, [{
		key: 'stateToProps',
		value: function stateToProps(_ref2) {
			var permissions = _ref2.permissions;

			return { permissions: permissions };
		}
	}, {
		key: '_renderer',
		value: function _renderer() {
			this.context.classList.toggle('hidden', !this.props.permissions);
		}
	}]);

	return TestsButtons;
}(_component2.default);

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(6);

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

var _cookie = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CLASS_NAME = 'terminaltheme_';

var Theme = function (_ButtonPopOver) {
	_inherits(Theme, _ButtonPopOver);

	function Theme(params) {
		_classCallCheck(this, Theme);

		var _this = _possibleConstructorReturn(this, (Theme.__proto__ || Object.getPrototypeOf(Theme)).call(this, params));

		_this.agentId = apiData.auth.id;
		var theme = (0, _cookie.cookieGet)('terminalTheme_' + _this.agentId);

		_this.oldThemeClass = theme || CLASS_NAME + window.apiData['terminalThemes'][0]['id'];
		_this.themeId = window.apiData['terminalThemes'][0]['id'];

		if (theme) _this.themeId = parseInt(theme.split('_')[1]);

		_this.context = document.getElementById('terminalContext');
		_this.context.classList.add(_this.oldThemeClass);

		_this.makeTrigger();
		return _this;
	}

	_createClass(Theme, [{
		key: 'onSelect',
		value: function onSelect(value) {
			var newThemeClass = CLASS_NAME + value.id;
			this.themeId = value.id;

			this.context.classList.remove(this.oldThemeClass);
			this.context.classList.add(newThemeClass);

			this.oldThemeClass = newThemeClass;
			(0, _cookie.cookieSet)('terminalTheme_' + this.agentId, newThemeClass, 30);

			this.popContent.innerHTML = '';
			this.build();
		}
	}, {
		key: 'build',
		value: function build() {
			var _this2 = this;

			var themeList = window.apiData['terminalThemes'];

			if (themeList.length) {
				themeList.forEach(function (obj) {

					var button = (0, _dom2.default)('button.list-group-item ' + (obj.id === _this2.themeId ? 'font-bold' : ''));
					button.innerHTML = obj.label;

					button.addEventListener('click', function () {
						_this2.popover.close();
						_this2.onSelect(obj);
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
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(4))(12);

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.History = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(6);

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
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(6);

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
					(0, _actions.CHANGE_FONT_SIZE)({ fontSize: value });
				});

				_this2.popContent.appendChild(button);
			});
		}
	}]);

	return TextSize;
}(_buttonPopover2.default);

exports.default = TextSize;

/***/ }),
/* 42 */
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

var _constants = __webpack_require__(2);

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
			var _this = this;

			return (0, _dom2.default)('button', {
				className: "btn btn-sm btn-mint font-bold " + (gdsName === this.gdsname ? ' active' : ''),
				innerHTML: this.gdsname,
				onclick: function onclick() {
					return (0, _actions.CHANGE_GDS)(_this.gdsname);
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
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _actions = __webpack_require__(0);

var _component = __webpack_require__(3);

var _component2 = _interopRequireDefault(_component);

var _constants = __webpack_require__(2);

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
		value: function stateToProps(state) {
			var gdsList = state.gdsList,
			    gdsObjName = state.gdsObjName;

			var curGds = _constants.GDS_LIST.indexOf(gdsObjName);
			return { canCreatePq: gdsList[curGds].get('canCreatePq') };
		}
	}, {
		key: "_renderer",
		value: function _renderer() {
			this.context.disabled = this.props.canCreatePq !== true;
		}
	}]);

	return PqButton;
}(_component2.default);

exports.default = PqButton;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(6);

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
		// this.context.appendChild ( this.PqAddTest() );
		// this.context.appendChild ( this.AddPqMacros() );
		this.context.appendChild(this.commandsBuffer());
		// this.context.appendChild ( this.fullScreen() );
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
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _terminalMatrix = __webpack_require__(46);

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
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(6);

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

var _actions = __webpack_require__(0);

var _constants = __webpack_require__(2);

var _helpers = __webpack_require__(5);

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

		_this.popContent = (0, _dom2.default)('div');
		_this.makeTrigger();
		return _this;
	}

	_createClass(Matrix, [{
		key: 'build',
		value: function build() {
			var button = new _dom2.default('div.bg-white matrix-column', {
				onclick: _actions.ADD_WHIDE_COLUMN
			});

			var table = new _dom2.default('table.matrix-table');
			// window.open('http://cms3.artur.snx702.dyninno.net/leadInfo?rId=6173322#terminalNavBtntab','winname',"directories=0,titlebar=0,toolabar=0,location=0,stataus=0,menaubar=0,scrollbars=no,resizable=no,widtah=400,aheight=350");

			[0, 1, 2, 3].map(this._rows).map(this._cells, this).map(function (tr) {
				table.appendChild(tr);
			});

			var _getStorageMatrix = (0, _helpers.getStorageMatrix)(),
			    rows = _getStorageMatrix.rows,
			    cells = _getStorageMatrix.cells;

			this._addColor(rows, cells, ACTIVE_CLASS);

			this.popContent.appendChild(button);

			this.popContent.appendChild(table);
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

				var cellsSelected = [];

				Array.apply(null, { length: rIndex + 1 }).map(function (y, yIndex) {
					Array.apply(null, { length: cIndex + 1 }).map(function (x, xIndex) {
						return cellsSelected.push(yIndex * _constants.MAX_ROWS + xIndex);
					});
				});

				_this3.popover.close();

				_this3._addColor(rIndex, cIndex, ACTIVE_CLASS);

				var matrixProps = {
					rows: rIndex,
					cells: cIndex,
					list: cellsSelected
				};

				localStorage.setItem('matrix', JSON.stringify(matrixProps));

				(0, _actions.CHANGE_MATRIX)(matrixProps);
			});

			cell.addEventListener('mouseover', function () {
				return _this3._addColor(rIndex, cIndex, ACTIVE_CLASS);
			});

			cell.addEventListener('mouseleave', function () {
				[].forEach.call(_this3.popContent.querySelectorAll('.' + ACTIVE_CLASS), function (cell) {
					return cell.classList.remove(ACTIVE_CLASS);
				});
			});

			return cell;
		}
	}, {
		key: '_addColor',
		value: function _addColor(rIndex, cIndex, className) {
			for (var i = 0; i <= rIndex; i++) {
				cellObj[i].slice(0, cIndex + 1).forEach(function (cell) {
					return cell.classList.add(className);
				});
			}
		}
	}]);

	return Matrix;
}(_buttonPopover2.default);

exports.default = Matrix;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = __webpack_require__(3);

var _component2 = _interopRequireDefault(_component);

var _constants = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var stringify = JSON.stringify;

var TerminalsMatrix = function (_Component) {
	_inherits(TerminalsMatrix, _Component);

	function TerminalsMatrix() {
		_classCallCheck(this, TerminalsMatrix);

		return _possibleConstructorReturn(this, (TerminalsMatrix.__proto__ || Object.getPrototypeOf(TerminalsMatrix)).call(this, 'div.terminals-table matrix-row'));
	}

	_createClass(TerminalsMatrix, [{
		key: 'clear',
		value: function clear() {
			this.context.innerHTML = '';
			return this;
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
			var _this2 = this;

			var curGdsIndex = _constants.GDS_LIST.indexOf(this.props.gdsObjName);
			var curGds = this.props.gdsList[curGdsIndex];

			var terminals = curGds.get('terminals');
			var matrix = curGds.get('matrix');
			var dimensions = curGds.get('dimensions');
			var name = curGds.get('name');

			var state = _extends({
				gds: name
			}, matrix, dimensions, {
				hasWide: curGds.get('hasWide')
			});

			if (!this.renderIsNeeded(state)) {
				return false;
			}

			this.context.style.width = dimensions.parent.width + 'px';
			this.context.style.height = dimensions.parent.height + 'px';
			this.context.innerHTML = '';

			if (curGds.get('hasWide')) {
				var wideTerminal = terminals.wide; //curGds.wideTerminal;

				wideTerminal.changeSize({
					char: dimensions.char,
					size: {
						height: dimensions.parent.height,
						width: dimensions.size.width
					}
				});

				this.context.appendChild(wideTerminal.context);
			}

			matrix.list.forEach(function (index) {

				terminals[index].changeSize(dimensions);

				_this2.context.appendChild(terminals[index].context);

				terminals[index].context.scrollTop = terminals[index].context.scrollHeight;
			});

			this.state = _extends({}, state);
		}
	}]);

	return TerminalsMatrix;
}(_component2.default);

exports.default = TerminalsMatrix;

/***/ }),
/* 48 */
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

		_this.observe(new _component2.default('section.hbox stretch').observe(new _component2.default('section.vbox').append(new _component2.default('header.header b-b').observe(new _component2.default('span.close', {
			innerHTML: '&times;',
			onclick: _actions.HIDE_PQ_QUOTES
		}))).observe(new _component2.default('section.scrollable bg-light lter ').observe(new _component2.default('div.hbox stretch ').observe(new Body())))));
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

		return _possibleConstructorReturn(this, (Body.__proto__ || Object.getPrototypeOf(Body)).call(this, 'div.term-body-pq'));
	}

	_createClass(Body, [{
		key: "_renderer",
		value: function _renderer() {
			var _this3 = this;

			if (this.props['pqToShow']) {
				this.context.innerHTML = '';

				this.props['pqToShow'].result.map(function (pq) {

					var container = (0, _dom2.default)('div.pq-container');

					container.appendChild((0, _dom2.default)('span.m-r-sm', { innerHTML: 'Selling:' }));

					container.appendChild((0, _dom2.default)('strong.label label-grey m-r-sm', { innerHTML: pq['selling'] }));

					container.appendChild((0, _dom2.default)('span.m-r-sm', { innerHTML: 'NET:' }));

					container.appendChild((0, _dom2.default)('strong.label label-grey  m-r-sm', { innerHTML: pq['net'] }));

					container.appendChild((0, _dom2.default)('strong.label label-mozilla added-by', { innerHTML: pq['addedByGroupLabel'] }));

					container.appendChild((0, _dom2.default)('div.m-t', {}));

					container.appendChild((0, _dom2.default)('pre.priceqoute-pre pos-rlt m-b-none m-t-none t-courier', { innerHTML: pq['reservationDump'] }));

					_this3.context.appendChild(container);
				});
			}
		}
	}]);

	return Body;
}(_component2.default);

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.TempTerminal = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = __webpack_require__(3);

var _component2 = _interopRequireDefault(_component);

var _dom = __webpack_require__(1);

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TempTerminal = exports.TempTerminal = function (_Component) {
	_inherits(TempTerminal, _Component);

	function TempTerminal() {
		_classCallCheck(this, TempTerminal);

		var _this = _possibleConstructorReturn(this, (TempTerminal.__proto__ || Object.getPrototypeOf(TempTerminal)).call(this, 'div.terminal temp-terminal'));

		_this.cursor = (0, _dom2.default)('span.cursor', { innerHTML: '&nbsp;' });
		var div = (0, _dom2.default)('div.cmd', { innerHTML: '&nbsp;' });

		div.appendChild(_this.cursor);
		_this.attach(div);
		return _this;
	}

	_createClass(TempTerminal, [{
		key: "calculate",
		value: function calculate() {
			return {
				char: this.getLineHeight()
			};
		}
	}, {
		key: "getLineHeight",
		value: function getLineHeight() {
			var _cursor$getBoundingCl = this.cursor.getBoundingClientRect(),
			    width = _cursor$getBoundingCl.width,
			    height = _cursor$getBoundingCl.height;

			return { width: width, height: height };
		}
	}]);

	return TempTerminal;
}(_component2.default);

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.PqParser = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requests = __webpack_require__(7);

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
		value: function show(gds, rId) {
			var _this = this;

			if (!gds.get('canCreatePq')) {
				return Promise.reject('canCreatePq');
			}

			if (gds.get('canCreatePqErrors')) {
				return throwError(gds.get('canCreatePqErrors'));
			}

			// console.log("LOADING.....");

			document.querySelector('#spinners').classList.remove('hidden');
			document.querySelector('#loadingDots').classList.remove('loading-hidden');

			return (0, _requests.get)("terminal/priceQuote?rId=" + rId).then(function (response) {
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
			});
		}
	}]);

	return PqParser;
}();

/***/ }),
/* 51 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=terminal-bundle.js.map