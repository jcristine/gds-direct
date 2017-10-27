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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = Dom;
function Dom(str) {

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

	if (innerHTML) {
		element.innerHTML = innerHTML;
	}

	return element;
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tetherDrop = __webpack_require__(16);

var _tetherDrop2 = _interopRequireDefault(_tetherDrop);

var _dom = __webpack_require__(0);

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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getReplacement = getReplacement;
exports.makePages = makePages;
exports.splitIntoLinesArr = splitIntoLinesArr;
exports.getDate = getDate;
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

function getReplacement(evt, isApollo) {
	// const char = String.fromCharCode(_to_ascii[ evt.keyCode || evt.which ] );
	var char = String.fromCharCode(evt.keyCode || evt.which);
	return isApollo ? apolloLayout[char] : sabreLayout[char];
}

function chunkIntoPages(linesArr, rowsPerScreen) {
	return linesArr.map(function (line, lineIndex) {
		return lineIndex % rowsPerScreen ? [] : linesArr.slice(lineIndex, lineIndex + rowsPerScreen);
	}).filter(function (data) {
		return !!data.length;
	});
}

function makePages(txt) {
	var rowsPerScreen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
	var maxCharLimit = arguments[2];

	var chunkByCharLimit = splitIntoLinesArr(txt, maxCharLimit);

	return chunkIntoPages(chunkByCharLimit, rowsPerScreen).map(function (sectionLines) {
		return sectionLines.join('\n');
	});
}

function splitIntoLinesArr(txt, maxCharLimit) {
	var lines = splitLines(txt);
	var regex = new RegExp('(.{1,' + maxCharLimit + '})', 'gi');

	var chunkByCharLimit = [];

	lines.forEach(function (line) {
		var lineArr = line.match(regex);
		chunkByCharLimit = chunkByCharLimit.concat(lineArr);
	});

	return chunkByCharLimit;
}

var mergeIntoNew = exports.mergeIntoNew = function mergeIntoNew(current, extendWith) {
	return Object.assign({}, current, extendWith);
};

function splitLines(txt) {
	return txt.split(/\r?\n/);
}

function makeDate(d) {
	return d < 10 ? '0' + d : d;
}

function getDate() {
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
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(0);

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

		// _renderer()
		// {
		// }

	}, {
		key: 'render',
		value: function render(params) {
			var _this = this;

			// console.log('render');
			// console.log( this._renderer );

			this.props = params;

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
var END_POINT_URL = exports.END_POINT_URL = 'terminal/command?';
var TIME_FORMAT = exports.TIME_FORMAT = '12';
var ACCOUNT = exports.ACCOUNT = 'training';
var API_HOST = exports.API_HOST = '';
var KEEP_ALIVE_REFRESH = exports.KEEP_ALIVE_REFRESH = 60000;
var AREA_LIST = exports.AREA_LIST = ['A', 'B', 'C', 'D', 'E', 'F'];
var GDS_LIST = exports.GDS_LIST = ['apollo', 'sabre', 'amadeus'];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = __webpack_require__(27);

var _plugin2 = _interopRequireDefault(_plugin);

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

__webpack_require__(42);

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
				sessionIndex: this.settings['sessionIndex'],
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
		key: 'calculateNumOfRows',
		value: function calculateNumOfRows(lineHeight) {
			return Math.floor(this.settings.parentContext.clientHeight / lineHeight);
		}
	}, {
		key: 'reattach',
		value: function reattach(parentNode, dimensions) {
			this.settings.parentContext = parentNode;

			parentNode.style.height = dimensions.height + 'px';
			parentNode.style.width = dimensions.width + 'px';

			this.context.style.height = parentNode.clientHeight + 'px';
			this.context.style.width = parentNode.clientWidth + 'px';

			this.numOfRows = this.calculateNumOfRows(dimensions.char.height);
			this.numOfChars = Math.floor((dimensions.width - 2) / dimensions.char.width);

			this.settings.parentContext.appendChild(this.context);

			if (this.plugin) {
				this.plugin.resize({
					numOfChars: this.numOfChars,
					numOfRows: this.numOfRows
				});
			}

			this.context.style.height = this.numOfRows * dimensions.char.height + 'px';

			if (this.plugin) this.plugin.emptyLinesRecalculate(this.numOfRows, this.numOfChars, dimensions.char.height);

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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setLink = exports.get = undefined;

var _constants = __webpack_require__(4);

var _debug = __webpack_require__(7);

var JParam = __webpack_require__(32);

// import 'vendor';
// import 'whatwg-fetch';

var Url = void 0;

var Ask = function Ask(url, params) {
	if (url.substr(0, 1) !== '/') url = '/' + url;

	return fetch(wwwFullDir + url, params).then(function (response) {
		return response.json();
	}).then(_debug.showUserMessages).catch(_debug.debugRequest);
};

var get = exports.get = function get(url, defParams) {
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.showUserMessages = exports.debugRequest = exports.Debug = undefined;

var _noty = __webpack_require__(31);

var _noty2 = _interopRequireDefault(_noty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Debug = exports.Debug = function Debug(txt, type) {
	new _noty2.default({
		text: 'DEBUG : <strong>' + txt + '</strong>',
		layout: 'bottomCenter',
		timeout: 1500,
		theme: 'metroui',
		type: type || 'info'
	}).show();
};

var debugRequest = exports.debugRequest = function debugRequest(err) {

	var notify = new _noty2.default({
		text: 'SERVER ERROR : ' + err,
		layout: 'bottomRight',
		timeout: 5000,
		type: 'error'
	});

	notify.show();
	console.warn('Server Returned: ', err);
};

var showUserMessages = exports.showUserMessages = function showUserMessages(response) {

	if (typeof response['data'] !== 'undefined') {
		var userMessages = response['data']['userMessages'] || [];

		userMessages.map(function (msg) {
			new _noty2.default({
				text: '<strong>' + msg + '</strong>',
				layout: 'bottomCenter',
				timeout: 5000,
				theme: 'metroui',
				type: 'warning'
			}).show();
		});
	}

	return response;
};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = vendor_lib;

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

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = __webpack_require__(4);

var _helpers = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var saved = localStorage.getItem('matrix');

var defaults = {
	sessionIndex: 0,
	pcc: {},
	matrix: saved ? JSON.parse(saved) : { rows: 1, cells: 1 },
	activeTerminal: null,
	canCreatePq: false,
	history: []
};

var getGdsData = function getGdsData(name) {
	var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


	return (0, _helpers.mergeIntoNew)(defaults, {

		name: name,
		sessionIndex: _constants.AREA_LIST.indexOf(settings['area']),

		// canCreatePq		: !!settings['canCreatePq'] // for DEV
		// canCreatePq		: !window.TerminalState.hasPermissions() ? false : !!settings['canCreatePq'],

		canCreatePq: false
	});
};

var GdsSet = function () {
	function GdsSet() {
		_classCallCheck(this, GdsSet);
	}

	_createClass(GdsSet, null, [{
		key: 'getList',
		value: function getList(list, loadedGds) {
			this.gdsList = list.map(function (name) {
				return getGdsData(name, loadedGds[name]);
			});

			var res = {};

			this.gdsList.forEach(function (gds) {
				res[gds.name] = gds;
			});

			return res;
		}
	}, {
		key: 'getAreas',
		value: function getAreas(defaultsEvents) {
			return this.gdsList.map(function (gds) {

				return (0, _helpers.mergeIntoNew)(defaultsEvents, {
					name: gds.name,
					list: gds.name === 'sabre' ? _constants.AREA_LIST : _constants.AREA_LIST.slice(0, -1) //remove F
				});
			});
		}
	}]);

	return GdsSet;
}();

exports.default = GdsSet;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(12);
module.exports = __webpack_require__(44);


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.TerminalState = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _containerMain = __webpack_require__(13);

var _containerMain2 = _interopRequireDefault(_containerMain);

var _requests = __webpack_require__(6);

var _gds = __webpack_require__(10);

var _gds2 = _interopRequireDefault(_gds);

var _constants = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// require('vendor')
__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./vendor\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var Container = void 0,
    Gds = void 0;

var Terminal = function Terminal(params) {
	_classCallCheck(this, Terminal);

	console.log('new Terminal');

	Gds = _gds2.default.getList(_constants.GDS_LIST, params.settings.gds);

	(0, _requests.setLink)(params['commandUrl']);

	var permissions = params.permissions,
	    buffer = params.buffer,
	    openPqModal = params.openPqModal,
	    requestId = params.requestId;


	window.TerminalState = new TerminalState({
		curGds: Gds[params.settings.common['currentGds'] || 'apollo'],
		permissions: permissions, buffer: buffer, openPqModal: openPqModal, requestId: requestId
	});

	Container = new _containerMain2.default(params['htmlRootId'] || 'rootTerminal');
	window.TerminalState.change({}, '');
};

var TerminalState = function () {
	function TerminalState(params) {
		_classCallCheck(this, TerminalState);

		this.state = {
			language: 'APOLLO',
			fontSize: 1,
			hideMenu: false,
			gdsObj: params.curGds,
			buffer: params.buffer,
			requestId: params.requestId
		};

		this.permissions = params.permissions;
		this.openPqModal = params.openPqModal;

		this.buffer = {
			gds: {}
		};

		if (params.buffer && params.buffer.gds) this.state.buffer = params.buffer.gds;
	}

	_createClass(TerminalState, [{
		key: 'showPqModal',
		value: function showPqModal() {
			var _this = this;

			return this.openPqModal({
				canCreatePqErrors: this.state.gdsObj.canCreatePqErrors,
				onClose: function onClose() {
					return _this.action('CLOSE_PQ_WINDOW');
				}
			});
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
		key: 'clearTerminal',
		value: function clearTerminal() {
			window.activePlugin.purge();
		}
	}, {
		key: 'getGds',
		value: function getGds() {
			return this.state.gdsObj['name'];
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
		key: 'getAreaName',
		value: function getAreaName(index) {
			var areas = ['A', 'B', 'C', 'D', 'E'];

			return areas[index];
		}
	}, {
		key: 'getSessionAreaMap',
		value: function getSessionAreaMap() {
			var key = this.isGdsApollo() ? 'S' : '¤';
			return _constants.AREA_LIST.map(function (char) {
				return key + char;
			});
		}
	}, {
		key: 'getHistory',
		value: function getHistory() {
			return (0, _requests.get)('terminal/lastCommands?rId=' + this.state.requestId + '&gds=' + this.getGds(), false);
		}
	}, {
		key: 'purgeScreens',
		value: function purgeScreens() {
			Container.purgeScreens(this.getGds());
			(0, _requests.get)('terminal/clearBuffer', true);
		}
	}, {
		key: 'switchTerminals',
		value: function switchTerminals(gds, index, props) {
			var terminal = Container.getTerminal(gds, index, props);

			if (terminal.plugin !== null) return terminal.plugin.terminal.focus();

			terminal.context.click();
		}
	}, {
		key: 'execCmd',
		value: function execCmd(commands) {
			var term = this.getActiveTerminal();

			if (term) term.exec(commands);

			return false;
		}
	}, {
		key: 'getGdsList',
		value: function getGdsList() {
			console.log(Gds);
		}
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
		key: 'action',
		value: function action(_action, params) {
			var _this2 = this;

			switch (_action) {
				case 'CHANGE_GDS':
					// save to backend
					(0, _requests.get)('terminal/saveSetting/gds/' + this.getGds() + '/' + params, false);

					// save prev gds state
					Gds[this.getGds()] = this.state.gdsObj;

					// replace gds params = index
					this.change({
						gds: params,
						gdsObj: Gds[params]
					});
					break;

				case 'CHANGE_SESSION_AREA':
					(0, _requests.get)('terminal/saveSetting/area/' + this.getGds() + '/' + this.getAreaName(params), false);

					this.change({
						gdsObj: Object.assign({}, this.state.gdsObj, { sessionIndex: params })
					});
					break;

				case 'CHANGE_SESSION_BY_MENU':
					(0, _requests.get)('terminal/saveSetting/area/' + this.getGds() + '/' + this.getAreaName(params), false);

					var command = this.getSessionAreaMap()[params];
					this.execCmd([command]);
					break;

				case 'CHANGE_MATRIX':
					localStorage.setItem('matrix', JSON.stringify(params));

					this.change({
						gdsObj: Object.assign({}, this.state.gdsObj, { matrix: params })
					});
					break;

				case 'CHANGE_ACTIVE_TERMINAL':
					(0, _requests.get)('terminal/saveSetting/terminal/' + this.getGds() + '/' + (params.name() + 1), false);

					this.change({
						gdsObj: Object.assign({}, this.state.gdsObj, { activeTerminal: params })
					});
					break;

				case 'UPDATE_CUR_GDS':
					var gdsName = params.gdsName,
					    canCreatePq = params.canCreatePq,
					    canCreatePqErrors = params.canCreatePqErrors,
					    sessionIndex = params.sessionIndex,
					    lastPcc = params.lastPcc,
					    startNewSession = params.startNewSession;


					Gds[this.getGds()] = this.state.gdsObj; //issue 02
					Gds[gdsName] = Object.assign(Gds[gdsName], { canCreatePq: canCreatePq, canCreatePqErrors: canCreatePqErrors, sessionIndex: sessionIndex });

					if (startNewSession) Gds[gdsName]['pcc'] = {};

					Gds[gdsName]['pcc'][sessionIndex] = lastPcc;

					this.change({
						gdsObj: Object.assign(this.state.gdsObj, Gds[this.getGds()])
					});
					break;

				case 'PQ_MODAL_SHOW':
					if (!this.state.gdsObj.canCreatePq) return false;

					this.showPqModal().then(function () {
						return _this2.change({ hideMenu: true });
					}).catch(function () {
						return console.log(' catch !!!');
					});
					break;

				case 'CLOSE_PQ_WINDOW':
					this.change({ hideMenu: false });
					break;

				case 'DEV_CMD_STACK_RUN':
					this.execCmd(params);
					return false;
					break;

				case 'CHANGE_INPUT_LANGUAGE':
					(0, _requests.get)('terminal/saveSetting/language/' + this.getGds() + '/' + params, false);

					this.change({ language: params });
					break;
			}
		}
	}, {
		key: 'change',
		value: function change() {
			var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			this.state = Object.assign({}, this.state, params);

			if (window.location.hash === '#terminalNavBtntab') // fixing bug where terminal freezes if i close pq popup while in other tab
				{
					Container.render(this.state);
				}
		}
	}]);

	return TerminalState;
}();

exports.TerminalState = TerminalState;


window.terminal = Terminal;

var resizeTimeout = void 0;

window.onresize = function () {

	if (resizeTimeout) clearInterval(resizeTimeout);

	resizeTimeout = setTimeout(function () {
		return window.TerminalState.change();
	}, 50);
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _actionsMenu = __webpack_require__(14);

var _actionsMenu2 = _interopRequireDefault(_actionsMenu);

var _menuPanel = __webpack_require__(18);

var _menuPanel2 = _interopRequireDefault(_menuPanel);

var _terminalMatrix = __webpack_require__(43);

var _terminalMatrix2 = _interopRequireDefault(_terminalMatrix);

var _component = __webpack_require__(3);

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RightSide = function (_Component) {
	_inherits(RightSide, _Component);

	function RightSide() {
		_classCallCheck(this, RightSide);

		var _this = _possibleConstructorReturn(this, (RightSide.__proto__ || Object.getPrototypeOf(RightSide)).call(this, 'aside.t-d-cell menu'));

		_this.observe(new _menuPanel2.default());
		return _this;
	}

	_createClass(RightSide, [{
		key: '_renderer',
		value: function _renderer() {
			this.context.classList.toggle('hidden', this.props.hideMenu);
		}
	}]);

	return RightSide;
}(_component2.default);

var matrix = void 0;

var Wrapper = function (_Component2) {
	_inherits(Wrapper, _Component2);

	function Wrapper() {
		_classCallCheck(this, Wrapper);

		var _this2 = _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).call(this, 'div.term-body minimized'));

		matrix = new _terminalMatrix2.default();

		var leftSide = new _component2.default('aside.t-d-cell left');
		var rightSide = new RightSide();

		_this2.append(leftSide).append(rightSide);

		_this2.addToObserve(rightSide);
		_this2.addToObserve(leftSide);

		leftSide.observe(matrix).observe(new _actionsMenu2.default());
		return _this2;
	}

	_createClass(Wrapper, [{
		key: '_renderer',
		value: function _renderer() {
			var gds = this.props.gds;

			if (this.gds !== gds) {
				this.gds = gds;
				this.context.className = 'term-body minimized ' + gds; // change gds styles
			}
		}
	}]);

	return Wrapper;
}(_component2.default);

var Container = function (_Component3) {
	_inherits(Container, _Component3);

	function Container(rootId) {
		_classCallCheck(this, Container);

		var _this3 = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, 'section'));

		_this3.observe(new Wrapper());

		document.getElementById(rootId).appendChild(_this3.getContext());
		return _this3;
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
			var params = this.props;

			this.context.className = 'terminal-wrap-custom term-f-size-' + params.fontSize;

			this.props = {
				hideMenu: params.hideMenu,
				gds: params.gdsObj['name'],
				canCreatePq: params.gdsObj.canCreatePq,
				sessionIndex: params.gdsObj.sessionIndex,
				activeTerminal: params.gdsObj.activeTerminal,
				cellMatrix: params.gdsObj.matrix,
				containerWidth: this.context.clientWidth,
				buffer: params.buffer
			};
		}
	}]);

	return Container;
}(_component2.default);

exports.default = Container;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _terminalMatrix = __webpack_require__(15);

var _terminalMatrix2 = _interopRequireDefault(_terminalMatrix);

var _component = __webpack_require__(3);

var _component2 = _interopRequireDefault(_component);

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActionsMenu = function (_Component) {
	_inherits(ActionsMenu, _Component);

	// export default class ActionsMenu{

	function ActionsMenu() {
		_classCallCheck(this, ActionsMenu);

		// this.context =  Dom('div.actions-btn-menu');

		var _this = _possibleConstructorReturn(this, (ActionsMenu.__proto__ || Object.getPrototypeOf(ActionsMenu)).call(this, 'div.actions-btn-menu'));

		var matrix = new _terminalMatrix2.default({
			icon: '<i class="fa fa-th-large"></i>'
			// onSelect	: value => { window.TerminalState.change({fontSize : value}) }
		}).getTrigger();

		matrix.className = 'btn btn-purple';

		_this.context.appendChild(matrix);
		return _this;
	}

	return ActionsMenu;
}(_component2.default);

exports.default = ActionsMenu;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(1);

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

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

				window.TerminalState.action('CHANGE_MATRIX', {
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! tether-drop 1.4.1 */

(function(root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(17)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports === 'object') {
    module.exports = factory(require('tether'));
  } else {
    root.Drop = factory(root.Tether);
  }
}(this, function(Tether) {

/* global Tether */
'use strict';

var _bind = Function.prototype.bind;

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Tether$Utils = Tether.Utils;
var extend = _Tether$Utils.extend;
var addClass = _Tether$Utils.addClass;
var removeClass = _Tether$Utils.removeClass;
var hasClass = _Tether$Utils.hasClass;
var Evented = _Tether$Utils.Evented;

function sortAttach(str) {
  var _str$split = str.split(' ');

  var _str$split2 = _slicedToArray(_str$split, 2);

  var first = _str$split2[0];
  var second = _str$split2[1];

  if (['left', 'right'].indexOf(first) >= 0) {
    var _ref = [second, first];
    first = _ref[0];
    second = _ref[1];
  }
  return [first, second].join(' ');
}

function removeFromArray(arr, item) {
  var index = undefined;
  var results = [];
  while ((index = arr.indexOf(item)) !== -1) {
    results.push(arr.splice(index, 1));
  }
  return results;
}

var clickEvents = ['click'];
if ('ontouchstart' in document.documentElement) {
  clickEvents.push('touchstart');
}

var transitionEndEvents = {
  'WebkitTransition': 'webkitTransitionEnd',
  'MozTransition': 'transitionend',
  'OTransition': 'otransitionend',
  'transition': 'transitionend'
};

var transitionEndEvent = '';
for (var _name in transitionEndEvents) {
  if (({}).hasOwnProperty.call(transitionEndEvents, _name)) {
    var tempEl = document.createElement('p');
    if (typeof tempEl.style[_name] !== 'undefined') {
      transitionEndEvent = transitionEndEvents[_name];
    }
  }
}

var MIRROR_ATTACH = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top',
  middle: 'middle',
  center: 'center'
};

var allDrops = {};

// Drop can be included in external libraries.  Calling createContext gives you a fresh
// copy of drop which won't interact with other copies on the page (beyond calling the document events).

function createContext() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var drop = function drop() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new (_bind.apply(DropInstance, [null].concat(args)))();
  };

  extend(drop, {
    createContext: createContext,
    drops: [],
    defaults: {}
  });

  var defaultOptions = {
    classPrefix: 'drop',
    defaults: {
      position: 'bottom left',
      openOn: 'click',
      beforeClose: null,
      constrainToScrollParent: true,
      constrainToWindow: true,
      classes: '',
      remove: false,
      openDelay: 0,
      closeDelay: 50,
      // inherited from openDelay and closeDelay if not explicitly defined
      focusDelay: null,
      blurDelay: null,
      hoverOpenDelay: null,
      hoverCloseDelay: null,
      tetherOptions: {}
    }
  };

  extend(drop, defaultOptions, options);
  extend(drop.defaults, defaultOptions.defaults, options.defaults);

  if (typeof allDrops[drop.classPrefix] === 'undefined') {
    allDrops[drop.classPrefix] = [];
  }

  drop.updateBodyClasses = function () {
    // There is only one body, so despite the context concept, we still iterate through all
    // drops which share our classPrefix.

    var anyOpen = false;
    var drops = allDrops[drop.classPrefix];
    var len = drops.length;
    for (var i = 0; i < len; ++i) {
      if (drops[i].isOpened()) {
        anyOpen = true;
        break;
      }
    }

    if (anyOpen) {
      addClass(document.body, drop.classPrefix + '-open');
    } else {
      removeClass(document.body, drop.classPrefix + '-open');
    }
  };

  var DropInstance = (function (_Evented) {
    _inherits(DropInstance, _Evented);

    function DropInstance(opts) {
      _classCallCheck(this, DropInstance);

      _get(Object.getPrototypeOf(DropInstance.prototype), 'constructor', this).call(this);
      this.options = extend({}, drop.defaults, opts);
      this.target = this.options.target;

      if (typeof this.target === 'undefined') {
        throw new Error('Drop Error: You must provide a target.');
      }

      var dataPrefix = 'data-' + drop.classPrefix;

      var contentAttr = this.target.getAttribute(dataPrefix);
      if (contentAttr && this.options.content == null) {
        this.options.content = contentAttr;
      }

      var attrsOverride = ['position', 'openOn'];
      for (var i = 0; i < attrsOverride.length; ++i) {

        var override = this.target.getAttribute(dataPrefix + '-' + attrsOverride[i]);
        if (override && this.options[attrsOverride[i]] == null) {
          this.options[attrsOverride[i]] = override;
        }
      }

      if (this.options.classes && this.options.addTargetClasses !== false) {
        addClass(this.target, this.options.classes);
      }

      drop.drops.push(this);
      allDrops[drop.classPrefix].push(this);

      this._boundEvents = [];
      this.bindMethods();
      this.setupElements();
      this.setupEvents();
      this.setupTether();
    }

    _createClass(DropInstance, [{
      key: '_on',
      value: function _on(element, event, handler) {
        this._boundEvents.push({ element: element, event: event, handler: handler });
        element.addEventListener(event, handler);
      }
    }, {
      key: 'bindMethods',
      value: function bindMethods() {
        this.transitionEndHandler = this._transitionEndHandler.bind(this);
      }
    }, {
      key: 'setupElements',
      value: function setupElements() {
        var _this = this;

        this.drop = document.createElement('div');
        addClass(this.drop, drop.classPrefix);

        if (this.options.classes) {
          addClass(this.drop, this.options.classes);
        }

        this.content = document.createElement('div');
        addClass(this.content, drop.classPrefix + '-content');

        if (typeof this.options.content === 'function') {
          var generateAndSetContent = function generateAndSetContent() {
            // content function might return a string or an element
            var contentElementOrHTML = _this.options.content.call(_this, _this);

            if (typeof contentElementOrHTML === 'string') {
              _this.content.innerHTML = contentElementOrHTML;
            } else if (typeof contentElementOrHTML === 'object') {
              _this.content.innerHTML = '';
              _this.content.appendChild(contentElementOrHTML);
            } else {
              throw new Error('Drop Error: Content function should return a string or HTMLElement.');
            }
          };

          generateAndSetContent();
          this.on('open', generateAndSetContent.bind(this));
        } else if (typeof this.options.content === 'object') {
          this.content.appendChild(this.options.content);
        } else {
          this.content.innerHTML = this.options.content;
        }

        this.drop.appendChild(this.content);
      }
    }, {
      key: 'setupTether',
      value: function setupTether() {
        // Tether expects two attachment points, one in the target element, one in the
        // drop.  We use a single one, and use the order as well, to allow us to put
        // the drop on either side of any of the four corners.  This magic converts between
        // the two:
        var dropAttach = this.options.position.split(' ');
        dropAttach[0] = MIRROR_ATTACH[dropAttach[0]];
        dropAttach = dropAttach.join(' ');

        var constraints = [];
        if (this.options.constrainToScrollParent) {
          constraints.push({
            to: 'scrollParent',
            pin: 'top, bottom',
            attachment: 'together none'
          });
        } else {
          // To get 'out of bounds' classes
          constraints.push({
            to: 'scrollParent'
          });
        }

        if (this.options.constrainToWindow !== false) {
          constraints.push({
            to: 'window',
            attachment: 'together'
          });
        } else {
          // To get 'out of bounds' classes
          constraints.push({
            to: 'window'
          });
        }

        var opts = {
          element: this.drop,
          target: this.target,
          attachment: sortAttach(dropAttach),
          targetAttachment: sortAttach(this.options.position),
          classPrefix: drop.classPrefix,
          offset: '0 0',
          targetOffset: '0 0',
          enabled: false,
          constraints: constraints,
          addTargetClasses: this.options.addTargetClasses
        };

        if (this.options.tetherOptions !== false) {
          this.tether = new Tether(extend({}, opts, this.options.tetherOptions));
        }
      }
    }, {
      key: 'setupEvents',
      value: function setupEvents() {
        var _this2 = this;

        if (!this.options.openOn) {
          return;
        }

        if (this.options.openOn === 'always') {
          setTimeout(this.open.bind(this));
          return;
        }

        var events = this.options.openOn.split(' ');

        if (events.indexOf('click') >= 0) {
          var openHandler = function openHandler(event) {
            _this2.toggle(event);
            event.preventDefault();
          };

          var closeHandler = function closeHandler(event) {
            if (!_this2.isOpened()) {
              return;
            }

            // Clicking inside dropdown
            if (event.target === _this2.drop || _this2.drop.contains(event.target)) {
              return;
            }

            // Clicking target
            if (event.target === _this2.target || _this2.target.contains(event.target)) {
              return;
            }

            _this2.close(event);
          };

          for (var i = 0; i < clickEvents.length; ++i) {
            var clickEvent = clickEvents[i];
            this._on(this.target, clickEvent, openHandler);
            this._on(document, clickEvent, closeHandler);
          }
        }

        var inTimeout = null;
        var outTimeout = null;

        var inHandler = function inHandler(event) {
          if (outTimeout !== null) {
            clearTimeout(outTimeout);
          } else {
            inTimeout = setTimeout(function () {
              _this2.open(event);
              inTimeout = null;
            }, (event.type === 'focus' ? _this2.options.focusDelay : _this2.options.hoverOpenDelay) || _this2.options.openDelay);
          }
        };

        var outHandler = function outHandler(event) {
          if (inTimeout !== null) {
            clearTimeout(inTimeout);
          } else {
            outTimeout = setTimeout(function () {
              _this2.close(event);
              outTimeout = null;
            }, (event.type === 'blur' ? _this2.options.blurDelay : _this2.options.hoverCloseDelay) || _this2.options.closeDelay);
          }
        };

        if (events.indexOf('hover') >= 0) {
          this._on(this.target, 'mouseover', inHandler);
          this._on(this.drop, 'mouseover', inHandler);
          this._on(this.target, 'mouseout', outHandler);
          this._on(this.drop, 'mouseout', outHandler);
        }

        if (events.indexOf('focus') >= 0) {
          this._on(this.target, 'focus', inHandler);
          this._on(this.drop, 'focus', inHandler);
          this._on(this.target, 'blur', outHandler);
          this._on(this.drop, 'blur', outHandler);
        }
      }
    }, {
      key: 'isOpened',
      value: function isOpened() {
        if (this.drop) {
          return hasClass(this.drop, drop.classPrefix + '-open');
        }
      }
    }, {
      key: 'toggle',
      value: function toggle(event) {
        if (this.isOpened()) {
          this.close(event);
        } else {
          this.open(event);
        }
      }
    }, {
      key: 'open',
      value: function open(event) {
        var _this3 = this;

        /* eslint no-unused-vars: 0 */
        if (this.isOpened()) {
          return;
        }

        if (!this.drop.parentNode) {
          document.body.appendChild(this.drop);
        }

        if (typeof this.tether !== 'undefined') {
          this.tether.enable();
        }

        addClass(this.drop, drop.classPrefix + '-open');
        addClass(this.drop, drop.classPrefix + '-open-transitionend');

        setTimeout(function () {
          if (_this3.drop) {
            addClass(_this3.drop, drop.classPrefix + '-after-open');
          }
        });

        if (typeof this.tether !== 'undefined') {
          this.tether.position();
        }

        this.trigger('open');

        drop.updateBodyClasses();
      }
    }, {
      key: '_transitionEndHandler',
      value: function _transitionEndHandler(e) {
        if (e.target !== e.currentTarget) {
          return;
        }

        if (!hasClass(this.drop, drop.classPrefix + '-open')) {
          removeClass(this.drop, drop.classPrefix + '-open-transitionend');
        }
        this.drop.removeEventListener(transitionEndEvent, this.transitionEndHandler);
      }
    }, {
      key: 'beforeCloseHandler',
      value: function beforeCloseHandler(event) {
        var shouldClose = true;

        if (!this.isClosing && typeof this.options.beforeClose === 'function') {
          this.isClosing = true;
          shouldClose = this.options.beforeClose(event, this) !== false;
        }

        this.isClosing = false;

        return shouldClose;
      }
    }, {
      key: 'close',
      value: function close(event) {
        if (!this.isOpened()) {
          return;
        }

        if (!this.beforeCloseHandler(event)) {
          return;
        }

        removeClass(this.drop, drop.classPrefix + '-open');
        removeClass(this.drop, drop.classPrefix + '-after-open');

        this.drop.addEventListener(transitionEndEvent, this.transitionEndHandler);

        this.trigger('close');

        if (typeof this.tether !== 'undefined') {
          this.tether.disable();
        }

        drop.updateBodyClasses();

        if (this.options.remove) {
          this.remove(event);
        }
      }
    }, {
      key: 'remove',
      value: function remove(event) {
        this.close(event);
        if (this.drop.parentNode) {
          this.drop.parentNode.removeChild(this.drop);
        }
      }
    }, {
      key: 'position',
      value: function position() {
        if (this.isOpened() && typeof this.tether !== 'undefined') {
          this.tether.position();
        }
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this.remove();

        if (typeof this.tether !== 'undefined') {
          this.tether.destroy();
        }

        for (var i = 0; i < this._boundEvents.length; ++i) {
          var _boundEvents$i = this._boundEvents[i];
          var element = _boundEvents$i.element;
          var _event = _boundEvents$i.event;
          var handler = _boundEvents$i.handler;

          element.removeEventListener(_event, handler);
        }

        this._boundEvents = [];

        this.tether = null;
        this.drop = null;
        this.content = null;
        this.target = null;

        removeFromArray(allDrops[drop.classPrefix], this);
        removeFromArray(drop.drops, this);
      }
    }]);

    return DropInstance;
  })(Evented);

  return drop;
}

var Drop = createContext();

document.addEventListener('DOMContentLoaded', function () {
  Drop.updateBodyClasses();
});
return Drop;

}));


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! tether 1.4.0 */

(function(root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.Tether = factory();
  }
}(this, function(require, exports, module) {

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TetherBase = undefined;
if (typeof TetherBase === 'undefined') {
  TetherBase = { modules: [] };
}

var zeroElement = null;

// Same as native getBoundingClientRect, except it takes into account parent <frame> offsets
// if the element lies within a nested document (<frame> or <iframe>-like).
function getActualBoundingClientRect(node) {
  var boundingRect = node.getBoundingClientRect();

  // The original object returned by getBoundingClientRect is immutable, so we clone it
  // We can't use extend because the properties are not considered part of the object by hasOwnProperty in IE9
  var rect = {};
  for (var k in boundingRect) {
    rect[k] = boundingRect[k];
  }

  if (node.ownerDocument !== document) {
    var _frameElement = node.ownerDocument.defaultView.frameElement;
    if (_frameElement) {
      var frameRect = getActualBoundingClientRect(_frameElement);
      rect.top += frameRect.top;
      rect.bottom += frameRect.top;
      rect.left += frameRect.left;
      rect.right += frameRect.left;
    }
  }

  return rect;
}

function getScrollParents(el) {
  // In firefox if the el is inside an iframe with display: none; window.getComputedStyle() will return null;
  // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  var computedStyle = getComputedStyle(el) || {};
  var position = computedStyle.position;
  var parents = [];

  if (position === 'fixed') {
    return [el];
  }

  var parent = el;
  while ((parent = parent.parentNode) && parent && parent.nodeType === 1) {
    var style = undefined;
    try {
      style = getComputedStyle(parent);
    } catch (err) {}

    if (typeof style === 'undefined' || style === null) {
      parents.push(parent);
      return parents;
    }

    var _style = style;
    var overflow = _style.overflow;
    var overflowX = _style.overflowX;
    var overflowY = _style.overflowY;

    if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
      if (position !== 'absolute' || ['relative', 'absolute', 'fixed'].indexOf(style.position) >= 0) {
        parents.push(parent);
      }
    }
  }

  parents.push(el.ownerDocument.body);

  // If the node is within a frame, account for the parent window scroll
  if (el.ownerDocument !== document) {
    parents.push(el.ownerDocument.defaultView);
  }

  return parents;
}

var uniqueId = (function () {
  var id = 0;
  return function () {
    return ++id;
  };
})();

var zeroPosCache = {};
var getOrigin = function getOrigin() {
  // getBoundingClientRect is unfortunately too accurate.  It introduces a pixel or two of
  // jitter as the user scrolls that messes with our ability to detect if two positions
  // are equivilant or not.  We place an element at the top left of the page that will
  // get the same jitter, so we can cancel the two out.
  var node = zeroElement;
  if (!node || !document.body.contains(node)) {
    node = document.createElement('div');
    node.setAttribute('data-tether-id', uniqueId());
    extend(node.style, {
      top: 0,
      left: 0,
      position: 'absolute'
    });

    document.body.appendChild(node);

    zeroElement = node;
  }

  var id = node.getAttribute('data-tether-id');
  if (typeof zeroPosCache[id] === 'undefined') {
    zeroPosCache[id] = getActualBoundingClientRect(node);

    // Clear the cache when this position call is done
    defer(function () {
      delete zeroPosCache[id];
    });
  }

  return zeroPosCache[id];
};

function removeUtilElements() {
  if (zeroElement) {
    document.body.removeChild(zeroElement);
  }
  zeroElement = null;
};

function getBounds(el) {
  var doc = undefined;
  if (el === document) {
    doc = document;
    el = document.documentElement;
  } else {
    doc = el.ownerDocument;
  }

  var docEl = doc.documentElement;

  var box = getActualBoundingClientRect(el);

  var origin = getOrigin();

  box.top -= origin.top;
  box.left -= origin.left;

  if (typeof box.width === 'undefined') {
    box.width = document.body.scrollWidth - box.left - box.right;
  }
  if (typeof box.height === 'undefined') {
    box.height = document.body.scrollHeight - box.top - box.bottom;
  }

  box.top = box.top - docEl.clientTop;
  box.left = box.left - docEl.clientLeft;
  box.right = doc.body.clientWidth - box.width - box.left;
  box.bottom = doc.body.clientHeight - box.height - box.top;

  return box;
}

function getOffsetParent(el) {
  return el.offsetParent || document.documentElement;
}

var _scrollBarSize = null;
function getScrollBarSize() {
  if (_scrollBarSize) {
    return _scrollBarSize;
  }
  var inner = document.createElement('div');
  inner.style.width = '100%';
  inner.style.height = '200px';

  var outer = document.createElement('div');
  extend(outer.style, {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    visibility: 'hidden',
    width: '200px',
    height: '150px',
    overflow: 'hidden'
  });

  outer.appendChild(inner);

  document.body.appendChild(outer);

  var widthContained = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var widthScroll = inner.offsetWidth;

  if (widthContained === widthScroll) {
    widthScroll = outer.clientWidth;
  }

  document.body.removeChild(outer);

  var width = widthContained - widthScroll;

  _scrollBarSize = { width: width, height: width };
  return _scrollBarSize;
}

function extend() {
  var out = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var args = [];

  Array.prototype.push.apply(args, arguments);

  args.slice(1).forEach(function (obj) {
    if (obj) {
      for (var key in obj) {
        if (({}).hasOwnProperty.call(obj, key)) {
          out[key] = obj[key];
        }
      }
    }
  });

  return out;
}

function removeClass(el, name) {
  if (typeof el.classList !== 'undefined') {
    name.split(' ').forEach(function (cls) {
      if (cls.trim()) {
        el.classList.remove(cls);
      }
    });
  } else {
    var regex = new RegExp('(^| )' + name.split(' ').join('|') + '( |$)', 'gi');
    var className = getClassName(el).replace(regex, ' ');
    setClassName(el, className);
  }
}

function addClass(el, name) {
  if (typeof el.classList !== 'undefined') {
    name.split(' ').forEach(function (cls) {
      if (cls.trim()) {
        el.classList.add(cls);
      }
    });
  } else {
    removeClass(el, name);
    var cls = getClassName(el) + (' ' + name);
    setClassName(el, cls);
  }
}

function hasClass(el, name) {
  if (typeof el.classList !== 'undefined') {
    return el.classList.contains(name);
  }
  var className = getClassName(el);
  return new RegExp('(^| )' + name + '( |$)', 'gi').test(className);
}

function getClassName(el) {
  // Can't use just SVGAnimatedString here since nodes within a Frame in IE have
  // completely separately SVGAnimatedString base classes
  if (el.className instanceof el.ownerDocument.defaultView.SVGAnimatedString) {
    return el.className.baseVal;
  }
  return el.className;
}

function setClassName(el, className) {
  el.setAttribute('class', className);
}

function updateClasses(el, add, all) {
  // Of the set of 'all' classes, we need the 'add' classes, and only the
  // 'add' classes to be set.
  all.forEach(function (cls) {
    if (add.indexOf(cls) === -1 && hasClass(el, cls)) {
      removeClass(el, cls);
    }
  });

  add.forEach(function (cls) {
    if (!hasClass(el, cls)) {
      addClass(el, cls);
    }
  });
}

var deferred = [];

var defer = function defer(fn) {
  deferred.push(fn);
};

var flush = function flush() {
  var fn = undefined;
  while (fn = deferred.pop()) {
    fn();
  }
};

var Evented = (function () {
  function Evented() {
    _classCallCheck(this, Evented);
  }

  _createClass(Evented, [{
    key: 'on',
    value: function on(event, handler, ctx) {
      var once = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      if (typeof this.bindings === 'undefined') {
        this.bindings = {};
      }
      if (typeof this.bindings[event] === 'undefined') {
        this.bindings[event] = [];
      }
      this.bindings[event].push({ handler: handler, ctx: ctx, once: once });
    }
  }, {
    key: 'once',
    value: function once(event, handler, ctx) {
      this.on(event, handler, ctx, true);
    }
  }, {
    key: 'off',
    value: function off(event, handler) {
      if (typeof this.bindings === 'undefined' || typeof this.bindings[event] === 'undefined') {
        return;
      }

      if (typeof handler === 'undefined') {
        delete this.bindings[event];
      } else {
        var i = 0;
        while (i < this.bindings[event].length) {
          if (this.bindings[event][i].handler === handler) {
            this.bindings[event].splice(i, 1);
          } else {
            ++i;
          }
        }
      }
    }
  }, {
    key: 'trigger',
    value: function trigger(event) {
      if (typeof this.bindings !== 'undefined' && this.bindings[event]) {
        var i = 0;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        while (i < this.bindings[event].length) {
          var _bindings$event$i = this.bindings[event][i];
          var handler = _bindings$event$i.handler;
          var ctx = _bindings$event$i.ctx;
          var once = _bindings$event$i.once;

          var context = ctx;
          if (typeof context === 'undefined') {
            context = this;
          }

          handler.apply(context, args);

          if (once) {
            this.bindings[event].splice(i, 1);
          } else {
            ++i;
          }
        }
      }
    }
  }]);

  return Evented;
})();

TetherBase.Utils = {
  getActualBoundingClientRect: getActualBoundingClientRect,
  getScrollParents: getScrollParents,
  getBounds: getBounds,
  getOffsetParent: getOffsetParent,
  extend: extend,
  addClass: addClass,
  removeClass: removeClass,
  hasClass: hasClass,
  updateClasses: updateClasses,
  defer: defer,
  flush: flush,
  uniqueId: uniqueId,
  Evented: Evented,
  getScrollBarSize: getScrollBarSize,
  removeUtilElements: removeUtilElements
};
/* globals TetherBase, performance */

'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

if (typeof TetherBase === 'undefined') {
  throw new Error('You must include the utils.js file before tether.js');
}

var _TetherBase$Utils = TetherBase.Utils;
var getScrollParents = _TetherBase$Utils.getScrollParents;
var getBounds = _TetherBase$Utils.getBounds;
var getOffsetParent = _TetherBase$Utils.getOffsetParent;
var extend = _TetherBase$Utils.extend;
var addClass = _TetherBase$Utils.addClass;
var removeClass = _TetherBase$Utils.removeClass;
var updateClasses = _TetherBase$Utils.updateClasses;
var defer = _TetherBase$Utils.defer;
var flush = _TetherBase$Utils.flush;
var getScrollBarSize = _TetherBase$Utils.getScrollBarSize;
var removeUtilElements = _TetherBase$Utils.removeUtilElements;

function within(a, b) {
  var diff = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

  return a + diff >= b && b >= a - diff;
}

var transformKey = (function () {
  if (typeof document === 'undefined') {
    return '';
  }
  var el = document.createElement('div');

  var transforms = ['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform'];
  for (var i = 0; i < transforms.length; ++i) {
    var key = transforms[i];
    if (el.style[key] !== undefined) {
      return key;
    }
  }
})();

var tethers = [];

var position = function position() {
  tethers.forEach(function (tether) {
    tether.position(false);
  });
  flush();
};

function now() {
  if (typeof performance !== 'undefined' && typeof performance.now !== 'undefined') {
    return performance.now();
  }
  return +new Date();
}

(function () {
  var lastCall = null;
  var lastDuration = null;
  var pendingTimeout = null;

  var tick = function tick() {
    if (typeof lastDuration !== 'undefined' && lastDuration > 16) {
      // We voluntarily throttle ourselves if we can't manage 60fps
      lastDuration = Math.min(lastDuration - 16, 250);

      // Just in case this is the last event, remember to position just once more
      pendingTimeout = setTimeout(tick, 250);
      return;
    }

    if (typeof lastCall !== 'undefined' && now() - lastCall < 10) {
      // Some browsers call events a little too frequently, refuse to run more than is reasonable
      return;
    }

    if (pendingTimeout != null) {
      clearTimeout(pendingTimeout);
      pendingTimeout = null;
    }

    lastCall = now();
    position();
    lastDuration = now() - lastCall;
  };

  if (typeof window !== 'undefined' && typeof window.addEventListener !== 'undefined') {
    ['resize', 'scroll', 'touchmove'].forEach(function (event) {
      window.addEventListener(event, tick);
    });
  }
})();

var MIRROR_LR = {
  center: 'center',
  left: 'right',
  right: 'left'
};

var MIRROR_TB = {
  middle: 'middle',
  top: 'bottom',
  bottom: 'top'
};

var OFFSET_MAP = {
  top: 0,
  left: 0,
  middle: '50%',
  center: '50%',
  bottom: '100%',
  right: '100%'
};

var autoToFixedAttachment = function autoToFixedAttachment(attachment, relativeToAttachment) {
  var left = attachment.left;
  var top = attachment.top;

  if (left === 'auto') {
    left = MIRROR_LR[relativeToAttachment.left];
  }

  if (top === 'auto') {
    top = MIRROR_TB[relativeToAttachment.top];
  }

  return { left: left, top: top };
};

var attachmentToOffset = function attachmentToOffset(attachment) {
  var left = attachment.left;
  var top = attachment.top;

  if (typeof OFFSET_MAP[attachment.left] !== 'undefined') {
    left = OFFSET_MAP[attachment.left];
  }

  if (typeof OFFSET_MAP[attachment.top] !== 'undefined') {
    top = OFFSET_MAP[attachment.top];
  }

  return { left: left, top: top };
};

function addOffset() {
  var out = { top: 0, left: 0 };

  for (var _len = arguments.length, offsets = Array(_len), _key = 0; _key < _len; _key++) {
    offsets[_key] = arguments[_key];
  }

  offsets.forEach(function (_ref) {
    var top = _ref.top;
    var left = _ref.left;

    if (typeof top === 'string') {
      top = parseFloat(top, 10);
    }
    if (typeof left === 'string') {
      left = parseFloat(left, 10);
    }

    out.top += top;
    out.left += left;
  });

  return out;
}

function offsetToPx(offset, size) {
  if (typeof offset.left === 'string' && offset.left.indexOf('%') !== -1) {
    offset.left = parseFloat(offset.left, 10) / 100 * size.width;
  }
  if (typeof offset.top === 'string' && offset.top.indexOf('%') !== -1) {
    offset.top = parseFloat(offset.top, 10) / 100 * size.height;
  }

  return offset;
}

var parseOffset = function parseOffset(value) {
  var _value$split = value.split(' ');

  var _value$split2 = _slicedToArray(_value$split, 2);

  var top = _value$split2[0];
  var left = _value$split2[1];

  return { top: top, left: left };
};
var parseAttachment = parseOffset;

var TetherClass = (function (_Evented) {
  _inherits(TetherClass, _Evented);

  function TetherClass(options) {
    var _this = this;

    _classCallCheck(this, TetherClass);

    _get(Object.getPrototypeOf(TetherClass.prototype), 'constructor', this).call(this);
    this.position = this.position.bind(this);

    tethers.push(this);

    this.history = [];

    this.setOptions(options, false);

    TetherBase.modules.forEach(function (module) {
      if (typeof module.initialize !== 'undefined') {
        module.initialize.call(_this);
      }
    });

    this.position();
  }

  _createClass(TetherClass, [{
    key: 'getClass',
    value: function getClass() {
      var key = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var classes = this.options.classes;

      if (typeof classes !== 'undefined' && classes[key]) {
        return this.options.classes[key];
      } else if (this.options.classPrefix) {
        return this.options.classPrefix + '-' + key;
      } else {
        return key;
      }
    }
  }, {
    key: 'setOptions',
    value: function setOptions(options) {
      var _this2 = this;

      var pos = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      var defaults = {
        offset: '0 0',
        targetOffset: '0 0',
        targetAttachment: 'auto auto',
        classPrefix: 'tether'
      };

      this.options = extend(defaults, options);

      var _options = this.options;
      var element = _options.element;
      var target = _options.target;
      var targetModifier = _options.targetModifier;

      this.element = element;
      this.target = target;
      this.targetModifier = targetModifier;

      if (this.target === 'viewport') {
        this.target = document.body;
        this.targetModifier = 'visible';
      } else if (this.target === 'scroll-handle') {
        this.target = document.body;
        this.targetModifier = 'scroll-handle';
      }

      ['element', 'target'].forEach(function (key) {
        if (typeof _this2[key] === 'undefined') {
          throw new Error('Tether Error: Both element and target must be defined');
        }

        if (typeof _this2[key].jquery !== 'undefined') {
          _this2[key] = _this2[key][0];
        } else if (typeof _this2[key] === 'string') {
          _this2[key] = document.querySelector(_this2[key]);
        }
      });

      addClass(this.element, this.getClass('element'));
      if (!(this.options.addTargetClasses === false)) {
        addClass(this.target, this.getClass('target'));
      }

      if (!this.options.attachment) {
        throw new Error('Tether Error: You must provide an attachment');
      }

      this.targetAttachment = parseAttachment(this.options.targetAttachment);
      this.attachment = parseAttachment(this.options.attachment);
      this.offset = parseOffset(this.options.offset);
      this.targetOffset = parseOffset(this.options.targetOffset);

      if (typeof this.scrollParents !== 'undefined') {
        this.disable();
      }

      if (this.targetModifier === 'scroll-handle') {
        this.scrollParents = [this.target];
      } else {
        this.scrollParents = getScrollParents(this.target);
      }

      if (!(this.options.enabled === false)) {
        this.enable(pos);
      }
    }
  }, {
    key: 'getTargetBounds',
    value: function getTargetBounds() {
      if (typeof this.targetModifier !== 'undefined') {
        if (this.targetModifier === 'visible') {
          if (this.target === document.body) {
            return { top: pageYOffset, left: pageXOffset, height: innerHeight, width: innerWidth };
          } else {
            var bounds = getBounds(this.target);

            var out = {
              height: bounds.height,
              width: bounds.width,
              top: bounds.top,
              left: bounds.left
            };

            out.height = Math.min(out.height, bounds.height - (pageYOffset - bounds.top));
            out.height = Math.min(out.height, bounds.height - (bounds.top + bounds.height - (pageYOffset + innerHeight)));
            out.height = Math.min(innerHeight, out.height);
            out.height -= 2;

            out.width = Math.min(out.width, bounds.width - (pageXOffset - bounds.left));
            out.width = Math.min(out.width, bounds.width - (bounds.left + bounds.width - (pageXOffset + innerWidth)));
            out.width = Math.min(innerWidth, out.width);
            out.width -= 2;

            if (out.top < pageYOffset) {
              out.top = pageYOffset;
            }
            if (out.left < pageXOffset) {
              out.left = pageXOffset;
            }

            return out;
          }
        } else if (this.targetModifier === 'scroll-handle') {
          var bounds = undefined;
          var target = this.target;
          if (target === document.body) {
            target = document.documentElement;

            bounds = {
              left: pageXOffset,
              top: pageYOffset,
              height: innerHeight,
              width: innerWidth
            };
          } else {
            bounds = getBounds(target);
          }

          var style = getComputedStyle(target);

          var hasBottomScroll = target.scrollWidth > target.clientWidth || [style.overflow, style.overflowX].indexOf('scroll') >= 0 || this.target !== document.body;

          var scrollBottom = 0;
          if (hasBottomScroll) {
            scrollBottom = 15;
          }

          var height = bounds.height - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth) - scrollBottom;

          var out = {
            width: 15,
            height: height * 0.975 * (height / target.scrollHeight),
            left: bounds.left + bounds.width - parseFloat(style.borderLeftWidth) - 15
          };

          var fitAdj = 0;
          if (height < 408 && this.target === document.body) {
            fitAdj = -0.00011 * Math.pow(height, 2) - 0.00727 * height + 22.58;
          }

          if (this.target !== document.body) {
            out.height = Math.max(out.height, 24);
          }

          var scrollPercentage = this.target.scrollTop / (target.scrollHeight - height);
          out.top = scrollPercentage * (height - out.height - fitAdj) + bounds.top + parseFloat(style.borderTopWidth);

          if (this.target === document.body) {
            out.height = Math.max(out.height, 24);
          }

          return out;
        }
      } else {
        return getBounds(this.target);
      }
    }
  }, {
    key: 'clearCache',
    value: function clearCache() {
      this._cache = {};
    }
  }, {
    key: 'cache',
    value: function cache(k, getter) {
      // More than one module will often need the same DOM info, so
      // we keep a cache which is cleared on each position call
      if (typeof this._cache === 'undefined') {
        this._cache = {};
      }

      if (typeof this._cache[k] === 'undefined') {
        this._cache[k] = getter.call(this);
      }

      return this._cache[k];
    }
  }, {
    key: 'enable',
    value: function enable() {
      var _this3 = this;

      var pos = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      if (!(this.options.addTargetClasses === false)) {
        addClass(this.target, this.getClass('enabled'));
      }
      addClass(this.element, this.getClass('enabled'));
      this.enabled = true;

      this.scrollParents.forEach(function (parent) {
        if (parent !== _this3.target.ownerDocument) {
          parent.addEventListener('scroll', _this3.position);
        }
      });

      if (pos) {
        this.position();
      }
    }
  }, {
    key: 'disable',
    value: function disable() {
      var _this4 = this;

      removeClass(this.target, this.getClass('enabled'));
      removeClass(this.element, this.getClass('enabled'));
      this.enabled = false;

      if (typeof this.scrollParents !== 'undefined') {
        this.scrollParents.forEach(function (parent) {
          parent.removeEventListener('scroll', _this4.position);
        });
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this5 = this;

      this.disable();

      tethers.forEach(function (tether, i) {
        if (tether === _this5) {
          tethers.splice(i, 1);
        }
      });

      // Remove any elements we were using for convenience from the DOM
      if (tethers.length === 0) {
        removeUtilElements();
      }
    }
  }, {
    key: 'updateAttachClasses',
    value: function updateAttachClasses(elementAttach, targetAttach) {
      var _this6 = this;

      elementAttach = elementAttach || this.attachment;
      targetAttach = targetAttach || this.targetAttachment;
      var sides = ['left', 'top', 'bottom', 'right', 'middle', 'center'];

      if (typeof this._addAttachClasses !== 'undefined' && this._addAttachClasses.length) {
        // updateAttachClasses can be called more than once in a position call, so
        // we need to clean up after ourselves such that when the last defer gets
        // ran it doesn't add any extra classes from previous calls.
        this._addAttachClasses.splice(0, this._addAttachClasses.length);
      }

      if (typeof this._addAttachClasses === 'undefined') {
        this._addAttachClasses = [];
      }
      var add = this._addAttachClasses;

      if (elementAttach.top) {
        add.push(this.getClass('element-attached') + '-' + elementAttach.top);
      }
      if (elementAttach.left) {
        add.push(this.getClass('element-attached') + '-' + elementAttach.left);
      }
      if (targetAttach.top) {
        add.push(this.getClass('target-attached') + '-' + targetAttach.top);
      }
      if (targetAttach.left) {
        add.push(this.getClass('target-attached') + '-' + targetAttach.left);
      }

      var all = [];
      sides.forEach(function (side) {
        all.push(_this6.getClass('element-attached') + '-' + side);
        all.push(_this6.getClass('target-attached') + '-' + side);
      });

      defer(function () {
        if (!(typeof _this6._addAttachClasses !== 'undefined')) {
          return;
        }

        updateClasses(_this6.element, _this6._addAttachClasses, all);
        if (!(_this6.options.addTargetClasses === false)) {
          updateClasses(_this6.target, _this6._addAttachClasses, all);
        }

        delete _this6._addAttachClasses;
      });
    }
  }, {
    key: 'position',
    value: function position() {
      var _this7 = this;

      var flushChanges = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      // flushChanges commits the changes immediately, leave true unless you are positioning multiple
      // tethers (in which case call Tether.Utils.flush yourself when you're done)

      if (!this.enabled) {
        return;
      }

      this.clearCache();

      // Turn 'auto' attachments into the appropriate corner or edge
      var targetAttachment = autoToFixedAttachment(this.targetAttachment, this.attachment);

      this.updateAttachClasses(this.attachment, targetAttachment);

      var elementPos = this.cache('element-bounds', function () {
        return getBounds(_this7.element);
      });

      var width = elementPos.width;
      var height = elementPos.height;

      if (width === 0 && height === 0 && typeof this.lastSize !== 'undefined') {
        var _lastSize = this.lastSize;

        // We cache the height and width to make it possible to position elements that are
        // getting hidden.
        width = _lastSize.width;
        height = _lastSize.height;
      } else {
        this.lastSize = { width: width, height: height };
      }

      var targetPos = this.cache('target-bounds', function () {
        return _this7.getTargetBounds();
      });
      var targetSize = targetPos;

      // Get an actual px offset from the attachment
      var offset = offsetToPx(attachmentToOffset(this.attachment), { width: width, height: height });
      var targetOffset = offsetToPx(attachmentToOffset(targetAttachment), targetSize);

      var manualOffset = offsetToPx(this.offset, { width: width, height: height });
      var manualTargetOffset = offsetToPx(this.targetOffset, targetSize);

      // Add the manually provided offset
      offset = addOffset(offset, manualOffset);
      targetOffset = addOffset(targetOffset, manualTargetOffset);

      // It's now our goal to make (element position + offset) == (target position + target offset)
      var left = targetPos.left + targetOffset.left - offset.left;
      var top = targetPos.top + targetOffset.top - offset.top;

      for (var i = 0; i < TetherBase.modules.length; ++i) {
        var _module2 = TetherBase.modules[i];
        var ret = _module2.position.call(this, {
          left: left,
          top: top,
          targetAttachment: targetAttachment,
          targetPos: targetPos,
          elementPos: elementPos,
          offset: offset,
          targetOffset: targetOffset,
          manualOffset: manualOffset,
          manualTargetOffset: manualTargetOffset,
          scrollbarSize: scrollbarSize,
          attachment: this.attachment
        });

        if (ret === false) {
          return false;
        } else if (typeof ret === 'undefined' || typeof ret !== 'object') {
          continue;
        } else {
          top = ret.top;
          left = ret.left;
        }
      }

      // We describe the position three different ways to give the optimizer
      // a chance to decide the best possible way to position the element
      // with the fewest repaints.
      var next = {
        // It's position relative to the page (absolute positioning when
        // the element is a child of the body)
        page: {
          top: top,
          left: left
        },

        // It's position relative to the viewport (fixed positioning)
        viewport: {
          top: top - pageYOffset,
          bottom: pageYOffset - top - height + innerHeight,
          left: left - pageXOffset,
          right: pageXOffset - left - width + innerWidth
        }
      };

      var doc = this.target.ownerDocument;
      var win = doc.defaultView;

      var scrollbarSize = undefined;
      if (win.innerHeight > doc.documentElement.clientHeight) {
        scrollbarSize = this.cache('scrollbar-size', getScrollBarSize);
        next.viewport.bottom -= scrollbarSize.height;
      }

      if (win.innerWidth > doc.documentElement.clientWidth) {
        scrollbarSize = this.cache('scrollbar-size', getScrollBarSize);
        next.viewport.right -= scrollbarSize.width;
      }

      if (['', 'static'].indexOf(doc.body.style.position) === -1 || ['', 'static'].indexOf(doc.body.parentElement.style.position) === -1) {
        // Absolute positioning in the body will be relative to the page, not the 'initial containing block'
        next.page.bottom = doc.body.scrollHeight - top - height;
        next.page.right = doc.body.scrollWidth - left - width;
      }

      if (typeof this.options.optimizations !== 'undefined' && this.options.optimizations.moveElement !== false && !(typeof this.targetModifier !== 'undefined')) {
        (function () {
          var offsetParent = _this7.cache('target-offsetparent', function () {
            return getOffsetParent(_this7.target);
          });
          var offsetPosition = _this7.cache('target-offsetparent-bounds', function () {
            return getBounds(offsetParent);
          });
          var offsetParentStyle = getComputedStyle(offsetParent);
          var offsetParentSize = offsetPosition;

          var offsetBorder = {};
          ['Top', 'Left', 'Bottom', 'Right'].forEach(function (side) {
            offsetBorder[side.toLowerCase()] = parseFloat(offsetParentStyle['border' + side + 'Width']);
          });

          offsetPosition.right = doc.body.scrollWidth - offsetPosition.left - offsetParentSize.width + offsetBorder.right;
          offsetPosition.bottom = doc.body.scrollHeight - offsetPosition.top - offsetParentSize.height + offsetBorder.bottom;

          if (next.page.top >= offsetPosition.top + offsetBorder.top && next.page.bottom >= offsetPosition.bottom) {
            if (next.page.left >= offsetPosition.left + offsetBorder.left && next.page.right >= offsetPosition.right) {
              // We're within the visible part of the target's scroll parent
              var scrollTop = offsetParent.scrollTop;
              var scrollLeft = offsetParent.scrollLeft;

              // It's position relative to the target's offset parent (absolute positioning when
              // the element is moved to be a child of the target's offset parent).
              next.offset = {
                top: next.page.top - offsetPosition.top + scrollTop - offsetBorder.top,
                left: next.page.left - offsetPosition.left + scrollLeft - offsetBorder.left
              };
            }
          }
        })();
      }

      // We could also travel up the DOM and try each containing context, rather than only
      // looking at the body, but we're gonna get diminishing returns.

      this.move(next);

      this.history.unshift(next);

      if (this.history.length > 3) {
        this.history.pop();
      }

      if (flushChanges) {
        flush();
      }

      return true;
    }

    // THE ISSUE
  }, {
    key: 'move',
    value: function move(pos) {
      var _this8 = this;

      if (!(typeof this.element.parentNode !== 'undefined')) {
        return;
      }

      var same = {};

      for (var type in pos) {
        same[type] = {};

        for (var key in pos[type]) {
          var found = false;

          for (var i = 0; i < this.history.length; ++i) {
            var point = this.history[i];
            if (typeof point[type] !== 'undefined' && !within(point[type][key], pos[type][key])) {
              found = true;
              break;
            }
          }

          if (!found) {
            same[type][key] = true;
          }
        }
      }

      var css = { top: '', left: '', right: '', bottom: '' };

      var transcribe = function transcribe(_same, _pos) {
        var hasOptimizations = typeof _this8.options.optimizations !== 'undefined';
        var gpu = hasOptimizations ? _this8.options.optimizations.gpu : null;
        if (gpu !== false) {
          var yPos = undefined,
              xPos = undefined;
          if (_same.top) {
            css.top = 0;
            yPos = _pos.top;
          } else {
            css.bottom = 0;
            yPos = -_pos.bottom;
          }

          if (_same.left) {
            css.left = 0;
            xPos = _pos.left;
          } else {
            css.right = 0;
            xPos = -_pos.right;
          }

          if (window.matchMedia) {
            // HubSpot/tether#207
            var retina = window.matchMedia('only screen and (min-resolution: 1.3dppx)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3)').matches;
            if (!retina) {
              xPos = Math.round(xPos);
              yPos = Math.round(yPos);
            }
          }

          css[transformKey] = 'translateX(' + xPos + 'px) translateY(' + yPos + 'px)';

          if (transformKey !== 'msTransform') {
            // The Z transform will keep this in the GPU (faster, and prevents artifacts),
            // but IE9 doesn't support 3d transforms and will choke.
            css[transformKey] += " translateZ(0)";
          }
        } else {
          if (_same.top) {
            css.top = _pos.top + 'px';
          } else {
            css.bottom = _pos.bottom + 'px';
          }

          if (_same.left) {
            css.left = _pos.left + 'px';
          } else {
            css.right = _pos.right + 'px';
          }
        }
      };

      var moved = false;
      if ((same.page.top || same.page.bottom) && (same.page.left || same.page.right)) {
        css.position = 'absolute';
        transcribe(same.page, pos.page);
      } else if ((same.viewport.top || same.viewport.bottom) && (same.viewport.left || same.viewport.right)) {
        css.position = 'fixed';
        transcribe(same.viewport, pos.viewport);
      } else if (typeof same.offset !== 'undefined' && same.offset.top && same.offset.left) {
        (function () {
          css.position = 'absolute';
          var offsetParent = _this8.cache('target-offsetparent', function () {
            return getOffsetParent(_this8.target);
          });

          if (getOffsetParent(_this8.element) !== offsetParent) {
            defer(function () {
              _this8.element.parentNode.removeChild(_this8.element);
              offsetParent.appendChild(_this8.element);
            });
          }

          transcribe(same.offset, pos.offset);
          moved = true;
        })();
      } else {
        css.position = 'absolute';
        transcribe({ top: true, left: true }, pos.page);
      }

      if (!moved) {
        if (this.options.bodyElement) {
          this.options.bodyElement.appendChild(this.element);
        } else {
          var offsetParentIsBody = true;
          var currentNode = this.element.parentNode;
          while (currentNode && currentNode.nodeType === 1 && currentNode.tagName !== 'BODY') {
            if (getComputedStyle(currentNode).position !== 'static') {
              offsetParentIsBody = false;
              break;
            }

            currentNode = currentNode.parentNode;
          }

          if (!offsetParentIsBody) {
            this.element.parentNode.removeChild(this.element);
            this.element.ownerDocument.body.appendChild(this.element);
          }
        }
      }

      // Any css change will trigger a repaint, so let's avoid one if nothing changed
      var writeCSS = {};
      var write = false;
      for (var key in css) {
        var val = css[key];
        var elVal = this.element.style[key];

        if (elVal !== val) {
          write = true;
          writeCSS[key] = val;
        }
      }

      if (write) {
        defer(function () {
          extend(_this8.element.style, writeCSS);
          _this8.trigger('repositioned');
        });
      }
    }
  }]);

  return TetherClass;
})(Evented);

TetherClass.modules = [];

TetherBase.position = position;

var Tether = extend(TetherClass, TetherBase);
/* globals TetherBase */

'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _TetherBase$Utils = TetherBase.Utils;
var getBounds = _TetherBase$Utils.getBounds;
var extend = _TetherBase$Utils.extend;
var updateClasses = _TetherBase$Utils.updateClasses;
var defer = _TetherBase$Utils.defer;

var BOUNDS_FORMAT = ['left', 'top', 'right', 'bottom'];

function getBoundingRect(tether, to) {
  if (to === 'scrollParent') {
    to = tether.scrollParents[0];
  } else if (to === 'window') {
    to = [pageXOffset, pageYOffset, innerWidth + pageXOffset, innerHeight + pageYOffset];
  }

  if (to === document) {
    to = to.documentElement;
  }

  if (typeof to.nodeType !== 'undefined') {
    (function () {
      var node = to;
      var size = getBounds(to);
      var pos = size;
      var style = getComputedStyle(to);

      to = [pos.left, pos.top, size.width + pos.left, size.height + pos.top];

      // Account any parent Frames scroll offset
      if (node.ownerDocument !== document) {
        var win = node.ownerDocument.defaultView;
        to[0] += win.pageXOffset;
        to[1] += win.pageYOffset;
        to[2] += win.pageXOffset;
        to[3] += win.pageYOffset;
      }

      BOUNDS_FORMAT.forEach(function (side, i) {
        side = side[0].toUpperCase() + side.substr(1);
        if (side === 'Top' || side === 'Left') {
          to[i] += parseFloat(style['border' + side + 'Width']);
        } else {
          to[i] -= parseFloat(style['border' + side + 'Width']);
        }
      });
    })();
  }

  return to;
}

TetherBase.modules.push({
  position: function position(_ref) {
    var _this = this;

    var top = _ref.top;
    var left = _ref.left;
    var targetAttachment = _ref.targetAttachment;

    if (!this.options.constraints) {
      return true;
    }

    var _cache = this.cache('element-bounds', function () {
      return getBounds(_this.element);
    });

    var height = _cache.height;
    var width = _cache.width;

    if (width === 0 && height === 0 && typeof this.lastSize !== 'undefined') {
      var _lastSize = this.lastSize;

      // Handle the item getting hidden as a result of our positioning without glitching
      // the classes in and out
      width = _lastSize.width;
      height = _lastSize.height;
    }

    var targetSize = this.cache('target-bounds', function () {
      return _this.getTargetBounds();
    });

    var targetHeight = targetSize.height;
    var targetWidth = targetSize.width;

    var allClasses = [this.getClass('pinned'), this.getClass('out-of-bounds')];

    this.options.constraints.forEach(function (constraint) {
      var outOfBoundsClass = constraint.outOfBoundsClass;
      var pinnedClass = constraint.pinnedClass;

      if (outOfBoundsClass) {
        allClasses.push(outOfBoundsClass);
      }
      if (pinnedClass) {
        allClasses.push(pinnedClass);
      }
    });

    allClasses.forEach(function (cls) {
      ['left', 'top', 'right', 'bottom'].forEach(function (side) {
        allClasses.push(cls + '-' + side);
      });
    });

    var addClasses = [];

    var tAttachment = extend({}, targetAttachment);
    var eAttachment = extend({}, this.attachment);

    this.options.constraints.forEach(function (constraint) {
      var to = constraint.to;
      var attachment = constraint.attachment;
      var pin = constraint.pin;

      if (typeof attachment === 'undefined') {
        attachment = '';
      }

      var changeAttachX = undefined,
          changeAttachY = undefined;
      if (attachment.indexOf(' ') >= 0) {
        var _attachment$split = attachment.split(' ');

        var _attachment$split2 = _slicedToArray(_attachment$split, 2);

        changeAttachY = _attachment$split2[0];
        changeAttachX = _attachment$split2[1];
      } else {
        changeAttachX = changeAttachY = attachment;
      }

      var bounds = getBoundingRect(_this, to);

      if (changeAttachY === 'target' || changeAttachY === 'both') {
        if (top < bounds[1] && tAttachment.top === 'top') {
          top += targetHeight;
          tAttachment.top = 'bottom';
        }

        if (top + height > bounds[3] && tAttachment.top === 'bottom') {
          top -= targetHeight;
          tAttachment.top = 'top';
        }
      }

      if (changeAttachY === 'together') {
        if (tAttachment.top === 'top') {
          if (eAttachment.top === 'bottom' && top < bounds[1]) {
            top += targetHeight;
            tAttachment.top = 'bottom';

            top += height;
            eAttachment.top = 'top';
          } else if (eAttachment.top === 'top' && top + height > bounds[3] && top - (height - targetHeight) >= bounds[1]) {
            top -= height - targetHeight;
            tAttachment.top = 'bottom';

            eAttachment.top = 'bottom';
          }
        }

        if (tAttachment.top === 'bottom') {
          if (eAttachment.top === 'top' && top + height > bounds[3]) {
            top -= targetHeight;
            tAttachment.top = 'top';

            top -= height;
            eAttachment.top = 'bottom';
          } else if (eAttachment.top === 'bottom' && top < bounds[1] && top + (height * 2 - targetHeight) <= bounds[3]) {
            top += height - targetHeight;
            tAttachment.top = 'top';

            eAttachment.top = 'top';
          }
        }

        if (tAttachment.top === 'middle') {
          if (top + height > bounds[3] && eAttachment.top === 'top') {
            top -= height;
            eAttachment.top = 'bottom';
          } else if (top < bounds[1] && eAttachment.top === 'bottom') {
            top += height;
            eAttachment.top = 'top';
          }
        }
      }

      if (changeAttachX === 'target' || changeAttachX === 'both') {
        if (left < bounds[0] && tAttachment.left === 'left') {
          left += targetWidth;
          tAttachment.left = 'right';
        }

        if (left + width > bounds[2] && tAttachment.left === 'right') {
          left -= targetWidth;
          tAttachment.left = 'left';
        }
      }

      if (changeAttachX === 'together') {
        if (left < bounds[0] && tAttachment.left === 'left') {
          if (eAttachment.left === 'right') {
            left += targetWidth;
            tAttachment.left = 'right';

            left += width;
            eAttachment.left = 'left';
          } else if (eAttachment.left === 'left') {
            left += targetWidth;
            tAttachment.left = 'right';

            left -= width;
            eAttachment.left = 'right';
          }
        } else if (left + width > bounds[2] && tAttachment.left === 'right') {
          if (eAttachment.left === 'left') {
            left -= targetWidth;
            tAttachment.left = 'left';

            left -= width;
            eAttachment.left = 'right';
          } else if (eAttachment.left === 'right') {
            left -= targetWidth;
            tAttachment.left = 'left';

            left += width;
            eAttachment.left = 'left';
          }
        } else if (tAttachment.left === 'center') {
          if (left + width > bounds[2] && eAttachment.left === 'left') {
            left -= width;
            eAttachment.left = 'right';
          } else if (left < bounds[0] && eAttachment.left === 'right') {
            left += width;
            eAttachment.left = 'left';
          }
        }
      }

      if (changeAttachY === 'element' || changeAttachY === 'both') {
        if (top < bounds[1] && eAttachment.top === 'bottom') {
          top += height;
          eAttachment.top = 'top';
        }

        if (top + height > bounds[3] && eAttachment.top === 'top') {
          top -= height;
          eAttachment.top = 'bottom';
        }
      }

      if (changeAttachX === 'element' || changeAttachX === 'both') {
        if (left < bounds[0]) {
          if (eAttachment.left === 'right') {
            left += width;
            eAttachment.left = 'left';
          } else if (eAttachment.left === 'center') {
            left += width / 2;
            eAttachment.left = 'left';
          }
        }

        if (left + width > bounds[2]) {
          if (eAttachment.left === 'left') {
            left -= width;
            eAttachment.left = 'right';
          } else if (eAttachment.left === 'center') {
            left -= width / 2;
            eAttachment.left = 'right';
          }
        }
      }

      if (typeof pin === 'string') {
        pin = pin.split(',').map(function (p) {
          return p.trim();
        });
      } else if (pin === true) {
        pin = ['top', 'left', 'right', 'bottom'];
      }

      pin = pin || [];

      var pinned = [];
      var oob = [];

      if (top < bounds[1]) {
        if (pin.indexOf('top') >= 0) {
          top = bounds[1];
          pinned.push('top');
        } else {
          oob.push('top');
        }
      }

      if (top + height > bounds[3]) {
        if (pin.indexOf('bottom') >= 0) {
          top = bounds[3] - height;
          pinned.push('bottom');
        } else {
          oob.push('bottom');
        }
      }

      if (left < bounds[0]) {
        if (pin.indexOf('left') >= 0) {
          left = bounds[0];
          pinned.push('left');
        } else {
          oob.push('left');
        }
      }

      if (left + width > bounds[2]) {
        if (pin.indexOf('right') >= 0) {
          left = bounds[2] - width;
          pinned.push('right');
        } else {
          oob.push('right');
        }
      }

      if (pinned.length) {
        (function () {
          var pinnedClass = undefined;
          if (typeof _this.options.pinnedClass !== 'undefined') {
            pinnedClass = _this.options.pinnedClass;
          } else {
            pinnedClass = _this.getClass('pinned');
          }

          addClasses.push(pinnedClass);
          pinned.forEach(function (side) {
            addClasses.push(pinnedClass + '-' + side);
          });
        })();
      }

      if (oob.length) {
        (function () {
          var oobClass = undefined;
          if (typeof _this.options.outOfBoundsClass !== 'undefined') {
            oobClass = _this.options.outOfBoundsClass;
          } else {
            oobClass = _this.getClass('out-of-bounds');
          }

          addClasses.push(oobClass);
          oob.forEach(function (side) {
            addClasses.push(oobClass + '-' + side);
          });
        })();
      }

      if (pinned.indexOf('left') >= 0 || pinned.indexOf('right') >= 0) {
        eAttachment.left = tAttachment.left = false;
      }
      if (pinned.indexOf('top') >= 0 || pinned.indexOf('bottom') >= 0) {
        eAttachment.top = tAttachment.top = false;
      }

      if (tAttachment.top !== targetAttachment.top || tAttachment.left !== targetAttachment.left || eAttachment.top !== _this.attachment.top || eAttachment.left !== _this.attachment.left) {
        _this.updateAttachClasses(eAttachment, tAttachment);
        _this.trigger('update', {
          attachment: eAttachment,
          targetAttachment: tAttachment
        });
      }
    });

    defer(function () {
      if (!(_this.options.addTargetClasses === false)) {
        updateClasses(_this.target, addClasses, allClasses);
      }
      updateClasses(_this.element, addClasses, allClasses);
    });

    return { top: top, left: left };
  }
});
/* globals TetherBase */

'use strict';

var _TetherBase$Utils = TetherBase.Utils;
var getBounds = _TetherBase$Utils.getBounds;
var updateClasses = _TetherBase$Utils.updateClasses;
var defer = _TetherBase$Utils.defer;

TetherBase.modules.push({
  position: function position(_ref) {
    var _this = this;

    var top = _ref.top;
    var left = _ref.left;

    var _cache = this.cache('element-bounds', function () {
      return getBounds(_this.element);
    });

    var height = _cache.height;
    var width = _cache.width;

    var targetPos = this.getTargetBounds();

    var bottom = top + height;
    var right = left + width;

    var abutted = [];
    if (top <= targetPos.bottom && bottom >= targetPos.top) {
      ['left', 'right'].forEach(function (side) {
        var targetPosSide = targetPos[side];
        if (targetPosSide === left || targetPosSide === right) {
          abutted.push(side);
        }
      });
    }

    if (left <= targetPos.right && right >= targetPos.left) {
      ['top', 'bottom'].forEach(function (side) {
        var targetPosSide = targetPos[side];
        if (targetPosSide === top || targetPosSide === bottom) {
          abutted.push(side);
        }
      });
    }

    var allClasses = [];
    var addClasses = [];

    var sides = ['left', 'top', 'right', 'bottom'];
    allClasses.push(this.getClass('abutted'));
    sides.forEach(function (side) {
      allClasses.push(_this.getClass('abutted') + '-' + side);
    });

    if (abutted.length) {
      addClasses.push(this.getClass('abutted'));
    }

    abutted.forEach(function (side) {
      addClasses.push(_this.getClass('abutted') + '-' + side);
    });

    defer(function () {
      if (!(_this.options.addTargetClasses === false)) {
        updateClasses(_this.target, addClasses, allClasses);
      }
      updateClasses(_this.element, addClasses, allClasses);
    });

    return true;
  }
});
/* globals TetherBase */

'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

TetherBase.modules.push({
  position: function position(_ref) {
    var top = _ref.top;
    var left = _ref.left;

    if (!this.options.shift) {
      return;
    }

    var shift = this.options.shift;
    if (typeof this.options.shift === 'function') {
      shift = this.options.shift.call(this, { top: top, left: left });
    }

    var shiftTop = undefined,
        shiftLeft = undefined;
    if (typeof shift === 'string') {
      shift = shift.split(' ');
      shift[1] = shift[1] || shift[0];

      var _shift = shift;

      var _shift2 = _slicedToArray(_shift, 2);

      shiftTop = _shift2[0];
      shiftLeft = _shift2[1];

      shiftTop = parseFloat(shiftTop, 10);
      shiftLeft = parseFloat(shiftLeft, 10);
    } else {
      shiftTop = shift.top;
      shiftLeft = shift.left;
    }

    top += shiftTop;
    left += shiftLeft;

    return { top: top, left: left };
  }
});
return Tether;

}));


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _theme = __webpack_require__(19);

var _theme2 = _interopRequireDefault(_theme);

var _history = __webpack_require__(20);

var _history2 = _interopRequireDefault(_history);

var _textSize = __webpack_require__(21);

var _textSize2 = _interopRequireDefault(_textSize);

var _settings = __webpack_require__(22);

var _settings2 = _interopRequireDefault(_settings);

var _sessionButtons = __webpack_require__(23);

var _sessionButtons2 = _interopRequireDefault(_sessionButtons);

var _pqButton = __webpack_require__(24);

var _pqButton2 = _interopRequireDefault(_pqButton);

var _devButtons = __webpack_require__(25);

var _devButtons2 = _interopRequireDefault(_devButtons);

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

var _component = __webpack_require__(3);

var _component2 = _interopRequireDefault(_component);

var _gds = __webpack_require__(10);

var _gds2 = _interopRequireDefault(_gds);

var _cookie = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var agentId = apiData.auth.id;
var oldThemeClass = (0, _cookie.cookieGet)('terminalTheme_' + agentId) || 'terminaltheme_' + apiData['terminalThemes'][0]['id'];

var SettingsButtons = function (_Component) {
	_inherits(SettingsButtons, _Component);

	function SettingsButtons() {
		_classCallCheck(this, SettingsButtons);

		var _this = _possibleConstructorReturn(this, (SettingsButtons.__proto__ || Object.getPrototypeOf(SettingsButtons)).call(this, 'article'));

		_this.children().map(function (element) {
			return _this.context.appendChild(element);
		});
		return _this;
	}

	_createClass(SettingsButtons, [{
		key: 'children',
		value: function children() {
			var theme = new _theme2.default({
				icon: '<i class="fa fa-paint-brush t-f-size-14"></i>',
				onSelect: function onSelect(value) {
					var terminalContext = document.getElementById('terminalContext');
					var newThemeClass = 'terminaltheme_' + value.id;

					terminalContext.classList.remove(oldThemeClass);
					terminalContext.classList.add(newThemeClass);

					oldThemeClass = newThemeClass;

					(0, _cookie.cookieSet)('terminalTheme_' + agentId, newThemeClass, 30);
				}
			}).getTrigger();

			var textSize = new _textSize2.default({
				icon: '<i class="fa fa-text-height t-f-size-14"></i>',
				onSelect: function onSelect(value) {
					window.TerminalState.change({ fontSize: value });
				}
			}).getTrigger();

			var history = new _history2.default({
				icon: '<i class="fa fa-history t-f-size-14"></i>',
				askServer: function askServer() {
					return window.TerminalState.getHistory();
				},
				onHistorySelect: function onHistorySelect(value) {
					return window.TerminalState.execCmd(value);
				}
			}).getTrigger();

			/*const settings	= new Settings({
   	icon		: '<i class="fa fa-gears t-f-size-14"></i>'
   }).getTrigger();*/

			return [theme, textSize, history];
		}
	}]);

	return SettingsButtons;
}(_component2.default);

var GdsAreas = function (_Component2) {
	_inherits(GdsAreas, _Component2);

	function GdsAreas() {
		_classCallCheck(this, GdsAreas);

		return _possibleConstructorReturn(this, (GdsAreas.__proto__ || Object.getPrototypeOf(GdsAreas)).call(this, 'article'));
	}

	_createClass(GdsAreas, [{
		key: '_renderer',
		value: function _renderer() {
			var _this3 = this;

			this.context.innerHTML = '';

			var _props = this.props,
			    gds = _props.gds,
			    sessionIndex = _props.sessionIndex,
			    activeTerminal = _props.activeTerminal;


			var defParams = { gds: gds, sessionIndex: sessionIndex, activeTerminal: activeTerminal };
			defParams.onAreaChange = function (sessionIndex) {
				return window.TerminalState.action('CHANGE_SESSION_BY_MENU', sessionIndex);
			};
			defParams.onGdsChange = function (gds) {
				return window.TerminalState.action('CHANGE_GDS', gds);
			};

			var areas = _gds2.default.getAreas(defParams);

			areas.map(function (areasPerGds) {
				return _this3.context.appendChild(new _sessionButtons2.default(areasPerGds).render());
			});
		}
	}]);

	return GdsAreas;
}(_component2.default);

var LanguageButtons = function (_Component3) {
	_inherits(LanguageButtons, _Component3);

	function LanguageButtons() {
		_classCallCheck(this, LanguageButtons);

		return _possibleConstructorReturn(this, (LanguageButtons.__proto__ || Object.getPrototypeOf(LanguageButtons)).call(this, 'article'));
	}

	_createClass(LanguageButtons, [{
		key: '_renderer',
		value: function _renderer() {
			var _this5 = this;

			this.context.innerHTML = '';

			var list = ['APOLLO', 'SABRE', 'AMADEUS'];

			list.forEach(function (value) {

				var button = (0, _dom2.default)('button.btn btn-sm btn-gold font-bold' + (window.TerminalState.getLanguage() === value ? ' active' : ''));

				button.innerHTML = value;
				button.addEventListener('click', function () {
					return window.TerminalState.action('CHANGE_INPUT_LANGUAGE', value);
				});

				_this5.context.appendChild(button);
			});
		}
	}]);

	return LanguageButtons;
}(_component2.default);

var PriceQuote = function (_Component4) {
	_inherits(PriceQuote, _Component4);

	function PriceQuote() {
		_classCallCheck(this, PriceQuote);

		return _possibleConstructorReturn(this, (PriceQuote.__proto__ || Object.getPrototypeOf(PriceQuote)).call(this, 'article'));
	}

	_createClass(PriceQuote, [{
		key: '_renderer',
		value: function _renderer() {
			this.context.appendChild(_pqButton2.default.render(this.props));
		}
	}]);

	return PriceQuote;
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

var MenuPanel = function (_Component6) {
	_inherits(MenuPanel, _Component6);

	function MenuPanel() {
		_classCallCheck(this, MenuPanel);

		var _this8 = _possibleConstructorReturn(this, (MenuPanel.__proto__ || Object.getPrototypeOf(MenuPanel)).call(this, 'aside.sideMenu'));

		_this8.observe(new SettingsButtons());

		_this8.attach((0, _dom2.default)('span.label[Session]'));
		_this8.observe(new GdsAreas());

		_this8.attach((0, _dom2.default)('span.label[Input Language]'));
		_this8.observe(new LanguageButtons());

		_this8.observe(new PriceQuote());

		if (window.TerminalState.hasPermissions()) _this8.observe(new TestsButtons());
		return _this8;
	}

	return MenuPanel;
}(_component2.default);

exports.default = MenuPanel;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(1);

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Theme = function (_ButtonPopOver) {
	_inherits(Theme, _ButtonPopOver);

	function Theme(params) {
		_classCallCheck(this, Theme);

		var _this = _possibleConstructorReturn(this, (Theme.__proto__ || Object.getPrototypeOf(Theme)).call(this, params));

		_this.makeTrigger();
		return _this;
	}

	_createClass(Theme, [{
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
						_this2.settings.onSelect(value);
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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// import Request			from '../../helpers/requests.es6';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(1);

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var buffer = [];

var History = function (_ButtonPopOver) {
	_inherits(History, _ButtonPopOver);

	function History(params) {
		_classCallCheck(this, History);

		var _this = _possibleConstructorReturn(this, (History.__proto__ || Object.getPrototypeOf(History)).call(this, params));

		_this.popContent = (0, _dom2.default)('div.historyContext');
		var btn = _this.makeTrigger();

		btn.addEventListener('click', _this.askServer.bind(_this));
		return _this;
	}

	_createClass(History, [{
		key: 'makeLi',
		value: function makeLi(value) {
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
		key: 'makeLaunchBtn',
		value: function makeLaunchBtn() {
			var _this2 = this;

			var el = (0, _dom2.default)('button.btn btn-sm btn-purple font-bold btn-block m-t ');
			el.innerHTML = 'Perform';

			el.onclick = this.settings.onHistorySelect.bind(null, buffer);
			el.addEventListener('click', function () {
				return _this2.popover.close();
			});

			this.popContent.appendChild(el);
		}
	}, {
		key: 'makeBody',
		value: function makeBody(response) {
			this.list = (0, _dom2.default)('ul.list');
			response.data.map(this.makeLi, this);
			this.popContent.appendChild(this.list);
		}
	}, {
		key: 'finalize',
		value: function finalize() {
			this.list.scrollTop = this.popContent.scrollHeight;
		}
	}, {
		key: 'askServer',
		value: function askServer() {
			buffer = [];
			this.popContent.innerHTML = '';

			this.settings.askServer().then(this.makeBody.bind(this)).then(this.makeLaunchBtn.bind(this)).then(this.finalize.bind(this));
		}
	}, {
		key: 'build',
		value: function build() {
			return false;
		}
	}]);

	return History;
}(_buttonPopover2.default);

exports.default = History;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(1);

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

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
					_this2.settings.onSelect(value);
				});

				_this2.popContent.appendChild(button);
			});
		}
	}]);

	return TextSize;
}(_buttonPopover2.default);

exports.default = TextSize;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(1);

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Settings = function (_ButtonPopOver) {
	_inherits(Settings, _ButtonPopOver);

	function Settings(params) {
		_classCallCheck(this, Settings);

		// this.popContent = Dom('div');
		var _this = _possibleConstructorReturn(this, (Settings.__proto__ || Object.getPrototypeOf(Settings)).call(this, params));

		_this.makeTrigger();

		_this.popContent.innerHTML = '<div class="wrapper"> In Development </div>';
		return _this;
	}

	// build()
	// {
	// 	Request.get('', true).then( ( response = ['No History'] ) => {
	// 	});
	// }


	return Settings;
}(_buttonPopover2.default);

exports.default = Settings;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SessionKeys = function () {
	function SessionKeys(params) {
		_classCallCheck(this, SessionKeys);

		this.context = (0, _dom2.default)('div');
		this.settings = params;
		this.collection = [];
		this.trigger = [];
		this.active = params.name === params.gds;
	}

	_createClass(SessionKeys, [{
		key: 'getButtons',
		value: function getButtons() {
			return this.settings.list.map(this.makeButton, this);
		}
	}, {
		key: 'makeButton',
		value: function makeButton(value, index) {
			var _this = this;

			var pcc = window.TerminalState.getPcc()[index];
			var isActive = this.settings.sessionIndex === index;

			var button = (0, _dom2.default)('button.btn btn-sm btn-purple font-bold pos-rlt ' + (isActive ? 'active' : ''));
			button.innerHTML = value + (pcc ? '<span class="pcc-label">' + pcc + '</span>' : '');

			button.disabled = !this.settings.activeTerminal || isActive;

			button.addEventListener('click', function () {
				button.disabled = true;
				_this.settings.onAreaChange(index);
			});

			return button;
		}
	}, {
		key: 'getTrigger',
		value: function getTrigger() {
			var _this2 = this;

			this.trigger = (0, _dom2.default)('button.btn btn-sm btn-mint font-bold' + (this.active ? ' active' : ''));
			this.trigger.innerHTML = this.settings['name'];

			if (!this.active) this.trigger.addEventListener('click', function () {
				return _this2.settings.onGdsChange(_this2.settings['name']);
			});

			return this.trigger;
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			this.context.appendChild(this.getTrigger());

			if (this.active) this.collection = this.getButtons().map(function (button) {
				return _this3.context.appendChild(button);
			});

			return this.context;
		}
	}]);

	return SessionKeys;
}();

exports.default = SessionKeys;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var button = void 0;

var PqButton = function () {
	function PqButton() {
		_classCallCheck(this, PqButton);
	}

	_createClass(PqButton, null, [{
		key: 'makeButton',
		value: function makeButton() {
			var button = document.createElement('button');
			button.className = 'btn btn-sm btn-mozilla font-bold';
			button.innerHTML = 'PQ';

			button.onclick = function () {
				return window.TerminalState.action('PQ_MODAL_SHOW', {});
			};

			return button;
		}
	}, {
		key: 'render',
		value: function render(_ref) {
			var canCreatePq = _ref.canCreatePq;

			button = button || this.makeButton();
			button.disabled = !canCreatePq;
			return button;
		}
	}]);

	return PqButton;
}();

exports.default = PqButton;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(1);

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

var _fullscreen = __webpack_require__(26);

var _fullscreen2 = _interopRequireDefault(_fullscreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STORAGE_KEY = 'dedTerminalBufCmd';

// import Terminal		from '../../modules/terminal.es6';

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
			var btn = (0, _dom2.default)('button.btn btn-sm btn-primary btn-block m-t font-bold');
			btn.innerHTML = 'Run';

			area.value = cmd.join("\n");

			area.rows = 15;
			area.cols = 20;

			btn.onclick = function () {
				var cmd = area.value.trim().split(/\s+/);

				window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cmd));
				window.TerminalState.action('DEV_CMD_STACK_RUN', cmd);

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
		this.context.appendChild(this.AddPqMacros());
		this.context.appendChild(this.commandsBuffer());
		this.context.appendChild(this.fullScreen());
	}

	_createClass(DevButtons, [{
		key: 'AddPqMacros',
		value: function AddPqMacros() {
			this.macros = (0, _dom2.default)('span.btn btn-primary font-bold');
			this.macros.innerHTML = 'Test pq';
			this.macros.onclick = function () {
				window.TerminalState.action('DEV_CMD_STACK_RUN', ['A/V/13SEPSEAMNL+DL', '01k1*', '*R', '$BN1+2*C09+3*inf']);
				// window.TerminalState.action('DEV_CMD_STACK_RUN', ['A10JUNKIVRIX', '01Y1Y2', '$B']);
			};

			return this.macros;
		}
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
			this.macros = (0, _dom2.default)('span.btn btn-primary font-bold');
			this.macros.innerHTML = 'Full';
			this.macros.onclick = function () {
				return _fullscreen2.default.show();
			};

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
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

var _terminal = __webpack_require__(5);

var _terminal2 = _interopRequireDefault(_terminal);

var _cookie = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FullScreen = function () {
	function FullScreen() {
		_classCallCheck(this, FullScreen);
	}

	_createClass(FullScreen, null, [{
		key: 'makeBody',
		value: function makeBody() {
			if (!window.activePlugin) return false;

			var body = (0, _dom2.default)('div.terminal-wrap-custom terminal-cell t-f-size-13 text-center t-height-100');
			var body2 = (0, _dom2.default)('div.terminal-body');

			body.appendChild(body2);
			return body;
		}
	}, {
		key: 'terminal',
		value: function terminal(body) {
			var props = {
				name: 'fullScreen',
				sessionIndex: window.TerminalState.getAreaIndex(), // to leave current active terminal
				gds: window.TerminalState.getGds(),
				buffer: false
			};

			var dimensions = {
				height: body.clientHeight,
				width: body.clientWidth,
				char: ''
				// char		: {
				// 	height 		: '',
				// 	width		: ''
				// }
			};

			var terminal = new _terminal2.default(props);
			terminal.reattach(body, dimensions);
			terminal.context.innerHTML = window.activePlugin.terminal.get(0).innerHTML;

			// on close there is two cmd lines
			var cmd = terminal.context.querySelector('.cmd');
			cmd.parentNode.removeChild(cmd);

			// remove cloned epmty lines
			var emptyLines = terminal.context.querySelector('.emptyLinesWrapper');
			emptyLines.parentNode.removeChild(emptyLines);

			terminal.init();
		}
	}, {
		key: 'show',
		value: function show() {
			var _this = this;

			if (!window.activePlugin) {
				alert('no terminal selected');
				return false;
			}

			var themeClass = (0, _cookie.cookieGet)('terminalTheme_' + apiData.auth.id) || 'terminaltheme_' + apiData['terminalThemes'][0]['id'];
			var body = this.makeBody();

			window.apiData.Modal.make({
				dialog_class: 'modal-full no-footer',
				body_class: 'no-padder ' + themeClass,
				body: body,
				noCloseBtn: 1,
				header: 'Full Screen'
			}).show(function (params) {

				params.modal.on('hidden.bs.modal', function (e) {
					window.TerminalState.change({});
					params.modal.detach().remove();
				});

				_this.terminal(body);
			});
		}
	}]);

	return FullScreen;
}();

exports.default = FullScreen;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pagination = __webpack_require__(28);

var _pagination2 = _interopRequireDefault(_pagination);

var _session = __webpack_require__(29);

var _session2 = _interopRequireDefault(_session);

var _spinner = __webpack_require__(33);

var _spinner2 = _interopRequireDefault(_spinner);

var _keyBinding = __webpack_require__(35);

var _output = __webpack_require__(36);

var _output2 = _interopRequireDefault(_output);

var _tabManager = __webpack_require__(37);

var _tabManager2 = _interopRequireDefault(_tabManager);

var _f = __webpack_require__(38);

var _f2 = _interopRequireDefault(_f);

var _history = __webpack_require__(39);

var _history2 = _interopRequireDefault(_history);

var _debug = __webpack_require__(7);

var _switchTerminal = __webpack_require__(40);

var _helpers = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = __webpack_require__(41);
window.$ = window.jQuery = $;

// require('./vendor');

// require('jquery.terminal/js/jquery.terminal');
// require('keyboardevent-key-polyfill').polyfill();

var TerminalPlugin = function () {
	function TerminalPlugin(params) {
		_classCallCheck(this, TerminalPlugin);

		this.settings = params;
		this.context = params.context;
		this.name = params.name;

		this.allowManualPaging = params.gds === 'sabre';

		this.session = new _session2.default({
			terminalIndex: params.name,
			sessionIndex: params.sessionIndex,
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
		value: function changeActiveTerm(activeTerminal) {
			if (this.settings.name === 'fullScreen') return false;

			window.activePlugin = this; // SO SO check to DEPRECATED
			window.TerminalState.action('CHANGE_ACTIVE_TERMINAL', activeTerminal);
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
			var context = $(this.context).terminal(function () {}, {
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

			// custom keydown events for each terminal
			// we introduced this approach because of terminal library adding keydown events to document
			(0, _switchTerminal.terminalKeydown)(context[0]);
			return context;
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

			window.TerminalState.action('UPDATE_CUR_GDS', {
				gdsName: this.settings.gds,
				canCreatePq: result['canCreatePq'],
				canCreatePqErrors: result['canCreatePqErrors'],
				sessionIndex: ['A', 'B', 'C', 'D', 'E', 'F'].indexOf(result.area),
				lastPcc: result['pcc'],
				startNewSession: result['startNewSession']
			});

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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(2);

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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requests = __webpack_require__(6);

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
/* 30 */,
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

/* 
  @package NOTY - Dependency-free notification library 
  @version version: 3.1.3 
  @contributors https://github.com/needim/noty/graphs/contributors 
  @documentation Examples and Documentation - http://needim.github.com/noty 
  @license Licensed under the MIT licenses: http://www.opensource.org/licenses/mit-license.php 
*/

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Noty", [], factory);
	else if(typeof exports === 'object')
		exports["Noty"] = factory();
	else
		root["Noty"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.css = exports.deepExtend = exports.animationEndEvents = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.inArray = inArray;
exports.stopPropagation = stopPropagation;
exports.generateID = generateID;
exports.outerHeight = outerHeight;
exports.addListener = addListener;
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.remove = remove;
exports.classList = classList;
exports.visibilityChangeFlow = visibilityChangeFlow;
exports.createAudioElements = createAudioElements;

var _api = __webpack_require__(1);

var API = _interopRequireWildcard(_api);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var animationEndEvents = exports.animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

function inArray(needle, haystack, argStrict) {
  var key = void 0;
  var strict = !!argStrict;

  if (strict) {
    for (key in haystack) {
      if (haystack.hasOwnProperty(key) && haystack[key] === needle) {
        return true;
      }
    }
  } else {
    for (key in haystack) {
      if (haystack.hasOwnProperty(key) && haystack[key] === needle) {
        return true;
      }
    }
  }
  return false;
}

function stopPropagation(evt) {
  evt = evt || window.event;

  if (typeof evt.stopPropagation !== 'undefined') {
    evt.stopPropagation();
  } else {
    evt.cancelBubble = true;
  }
}

var deepExtend = exports.deepExtend = function deepExtend(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];

    if (!obj) continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (Array.isArray(obj[key])) {
          out[key] = obj[key];
        } else if (_typeof(obj[key]) === 'object' && obj[key] !== null) {
          out[key] = deepExtend(out[key], obj[key]);
        } else {
          out[key] = obj[key];
        }
      }
    }
  }

  return out;
};

function generateID() {
  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var id = 'noty_' + prefix + '_';

  id += 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });

  return id;
}

function outerHeight(el) {
  var height = el.offsetHeight;
  var style = window.getComputedStyle(el);

  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
}

var css = exports.css = function () {
  var cssPrefixes = ['Webkit', 'O', 'Moz', 'ms'];
  var cssProps = {};

  function camelCase(string) {
    return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function (match, letter) {
      return letter.toUpperCase();
    });
  }

  function getVendorProp(name) {
    var style = document.body.style;
    if (name in style) return name;

    var i = cssPrefixes.length;
    var capName = name.charAt(0).toUpperCase() + name.slice(1);
    var vendorName = void 0;

    while (i--) {
      vendorName = cssPrefixes[i] + capName;
      if (vendorName in style) return vendorName;
    }

    return name;
  }

  function getStyleProp(name) {
    name = camelCase(name);
    return cssProps[name] || (cssProps[name] = getVendorProp(name));
  }

  function applyCss(element, prop, value) {
    prop = getStyleProp(prop);
    element.style[prop] = value;
  }

  return function (element, properties) {
    var args = arguments;
    var prop = void 0;
    var value = void 0;

    if (args.length === 2) {
      for (prop in properties) {
        if (properties.hasOwnProperty(prop)) {
          value = properties[prop];
          if (value !== undefined && properties.hasOwnProperty(prop)) {
            applyCss(element, prop, value);
          }
        }
      }
    } else {
      applyCss(element, args[1], args[2]);
    }
  };
}();

function addListener(el, events, cb) {
  var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  events = events.split(' ');
  for (var i = 0; i < events.length; i++) {
    if (document.addEventListener) {
      el.addEventListener(events[i], cb, useCapture);
    } else if (document.attachEvent) {
      el.attachEvent('on' + events[i], cb);
    }
  }
}

function hasClass(element, name) {
  var list = typeof element === 'string' ? element : classList(element);
  return list.indexOf(' ' + name + ' ') >= 0;
}

function addClass(element, name) {
  var oldList = classList(element);
  var newList = oldList + name;

  if (hasClass(oldList, name)) return;

  // Trim the opening space.
  element.className = newList.substring(1);
}

function removeClass(element, name) {
  var oldList = classList(element);
  var newList = void 0;

  if (!hasClass(element, name)) return;

  // Replace the class name.
  newList = oldList.replace(' ' + name + ' ', ' ');

  // Trim the opening and closing spaces.
  element.className = newList.substring(1, newList.length - 1);
}

function remove(element) {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

function classList(element) {
  return (' ' + (element && element.className || '') + ' ').replace(/\s+/gi, ' ');
}

function visibilityChangeFlow() {
  var hidden = void 0;
  var visibilityChange = void 0;
  if (typeof document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
  }

  function onVisibilityChange() {
    API.PageHidden = document[hidden];
    handleVisibilityChange();
  }

  function onBlur() {
    API.PageHidden = true;
    handleVisibilityChange();
  }

  function onFocus() {
    API.PageHidden = false;
    handleVisibilityChange();
  }

  function handleVisibilityChange() {
    if (API.PageHidden) stopAll();else resumeAll();
  }

  function stopAll() {
    setTimeout(function () {
      Object.keys(API.Store).forEach(function (id) {
        if (API.Store.hasOwnProperty(id)) {
          if (API.Store[id].options.visibilityControl) {
            API.Store[id].stop();
          }
        }
      });
    }, 100);
  }

  function resumeAll() {
    setTimeout(function () {
      Object.keys(API.Store).forEach(function (id) {
        if (API.Store.hasOwnProperty(id)) {
          if (API.Store[id].options.visibilityControl) {
            API.Store[id].resume();
          }
        }
      });
      API.queueRenderAll();
    }, 100);
  }

  addListener(document, visibilityChange, onVisibilityChange);
  addListener(window, 'blur', onBlur);
  addListener(window, 'focus', onFocus);
}

function createAudioElements(ref) {
  if (ref.hasSound) {
    var audioElement = document.createElement('audio');

    ref.options.sounds.sources.forEach(function (s) {
      var source = document.createElement('source');
      source.src = s;
      source.type = 'audio/' + getExtension(s);
      audioElement.appendChild(source);
    });

    if (ref.barDom) {
      ref.barDom.appendChild(audioElement);
    } else {
      document.querySelector('body').appendChild(audioElement);
    }

    audioElement.volume = ref.options.sounds.volume;

    if (!ref.soundPlayed) {
      audioElement.play();
      ref.soundPlayed = true;
    }

    audioElement.onended = function () {
      remove(audioElement);
    };
  }
}

function getExtension(fileName) {
  return fileName.match(/\.([^.]+)$/)[1];
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Defaults = exports.Store = exports.Queues = exports.DefaultMaxVisible = exports.docTitle = exports.DocModalCount = exports.PageHidden = undefined;
exports.getQueueCounts = getQueueCounts;
exports.addToQueue = addToQueue;
exports.removeFromQueue = removeFromQueue;
exports.queueRender = queueRender;
exports.queueRenderAll = queueRenderAll;
exports.ghostFix = ghostFix;
exports.build = build;
exports.hasButtons = hasButtons;
exports.handleModal = handleModal;
exports.handleModalClose = handleModalClose;
exports.queueClose = queueClose;
exports.dequeueClose = dequeueClose;
exports.fire = fire;
exports.openFlow = openFlow;
exports.closeFlow = closeFlow;

var _utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var PageHidden = exports.PageHidden = false;
var DocModalCount = exports.DocModalCount = 0;

var DocTitleProps = {
  originalTitle: null,
  count: 0,
  changed: false,
  timer: -1
};

var docTitle = exports.docTitle = {
  increment: function increment() {
    DocTitleProps.count++;

    docTitle._update();
  },

  decrement: function decrement() {
    DocTitleProps.count--;

    if (DocTitleProps.count <= 0) {
      docTitle._clear();
      return;
    }

    docTitle._update();
  },

  _update: function _update() {
    var title = document.title;

    if (!DocTitleProps.changed) {
      DocTitleProps.originalTitle = title;
      document.title = '(' + DocTitleProps.count + ') ' + title;
      DocTitleProps.changed = true;
    } else {
      document.title = '(' + DocTitleProps.count + ') ' + DocTitleProps.originalTitle;
    }
  },

  _clear: function _clear() {
    if (DocTitleProps.changed) {
      DocTitleProps.count = 0;
      document.title = DocTitleProps.originalTitle;
      DocTitleProps.changed = false;
    }
  }
};

var DefaultMaxVisible = exports.DefaultMaxVisible = 5;

var Queues = exports.Queues = {
  global: {
    maxVisible: DefaultMaxVisible,
    queue: []
  }
};

var Store = exports.Store = {};

var Defaults = exports.Defaults = {
  type: 'alert',
  layout: 'topRight',
  theme: 'mint',
  text: '',
  timeout: false,
  progressBar: true,
  closeWith: ['click'],
  animation: {
    open: 'noty_effects_open',
    close: 'noty_effects_close'
  },
  id: false,
  force: false,
  killer: false,
  queue: 'global',
  container: false,
  buttons: [],
  callbacks: {
    beforeShow: null,
    onShow: null,
    afterShow: null,
    onClose: null,
    afterClose: null,
    onClick: null,
    onHover: null,
    onTemplate: null
  },
  sounds: {
    sources: [],
    volume: 1,
    conditions: []
  },
  titleCount: {
    conditions: []
  },
  modal: false,
  visibilityControl: false

  /**
   * @param {string} queueName
   * @return {object}
   */
};function getQueueCounts() {
  var queueName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'global';

  var count = 0;
  var max = DefaultMaxVisible;

  if (Queues.hasOwnProperty(queueName)) {
    max = Queues[queueName].maxVisible;
    Object.keys(Store).forEach(function (i) {
      if (Store[i].options.queue === queueName && !Store[i].closed) count++;
    });
  }

  return {
    current: count,
    maxVisible: max
  };
}

/**
 * @param {Noty} ref
 * @return {void}
 */
function addToQueue(ref) {
  if (!Queues.hasOwnProperty(ref.options.queue)) {
    Queues[ref.options.queue] = { maxVisible: DefaultMaxVisible, queue: [] };
  }

  Queues[ref.options.queue].queue.push(ref);
}

/**
 * @param {Noty} ref
 * @return {void}
 */
function removeFromQueue(ref) {
  if (Queues.hasOwnProperty(ref.options.queue)) {
    var queue = [];
    Object.keys(Queues[ref.options.queue].queue).forEach(function (i) {
      if (Queues[ref.options.queue].queue[i].id !== ref.id) {
        queue.push(Queues[ref.options.queue].queue[i]);
      }
    });
    Queues[ref.options.queue].queue = queue;
  }
}

/**
 * @param {string} queueName
 * @return {void}
 */
function queueRender() {
  var queueName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'global';

  if (Queues.hasOwnProperty(queueName)) {
    var noty = Queues[queueName].queue.shift();

    if (noty) noty.show();
  }
}

/**
 * @return {void}
 */
function queueRenderAll() {
  Object.keys(Queues).forEach(function (queueName) {
    queueRender(queueName);
  });
}

/**
 * @param {Noty} ref
 * @return {void}
 */
function ghostFix(ref) {
  var ghostID = Utils.generateID('ghost');
  var ghost = document.createElement('div');
  ghost.setAttribute('id', ghostID);
  Utils.css(ghost, {
    height: Utils.outerHeight(ref.barDom) + 'px'
  });

  ref.barDom.insertAdjacentHTML('afterend', ghost.outerHTML);

  Utils.remove(ref.barDom);
  ghost = document.getElementById(ghostID);
  Utils.addClass(ghost, 'noty_fix_effects_height');
  Utils.addListener(ghost, Utils.animationEndEvents, function () {
    Utils.remove(ghost);
  });
}

/**
 * @param {Noty} ref
 * @return {void}
 */
function build(ref) {
  findOrCreateContainer(ref);

  var markup = '<div class="noty_body">' + ref.options.text + '</div>' + buildButtons(ref) + '<div class="noty_progressbar"></div>';

  ref.barDom = document.createElement('div');
  ref.barDom.setAttribute('id', ref.id);
  Utils.addClass(ref.barDom, 'noty_bar noty_type__' + ref.options.type + ' noty_theme__' + ref.options.theme);

  ref.barDom.innerHTML = markup;

  fire(ref, 'onTemplate');
}

/**
 * @param {Noty} ref
 * @return {boolean}
 */
function hasButtons(ref) {
  return !!(ref.options.buttons && Object.keys(ref.options.buttons).length);
}

/**
 * @param {Noty} ref
 * @return {string}
 */
function buildButtons(ref) {
  if (hasButtons(ref)) {
    var buttons = document.createElement('div');
    Utils.addClass(buttons, 'noty_buttons');

    Object.keys(ref.options.buttons).forEach(function (key) {
      buttons.appendChild(ref.options.buttons[key].dom);
    });

    ref.options.buttons.forEach(function (btn) {
      buttons.appendChild(btn.dom);
    });
    return buttons.outerHTML;
  }
  return '';
}

/**
 * @param {Noty} ref
 * @return {void}
 */
function handleModal(ref) {
  if (ref.options.modal) {
    if (DocModalCount === 0) {
      createModal(ref);
    }

    exports.DocModalCount = DocModalCount += 1;
  }
}

/**
 * @param {Noty} ref
 * @return {void}
 */
function handleModalClose(ref) {
  if (ref.options.modal && DocModalCount > 0) {
    exports.DocModalCount = DocModalCount -= 1;

    if (DocModalCount <= 0) {
      var modal = document.querySelector('.noty_modal');

      if (modal) {
        Utils.removeClass(modal, 'noty_modal_open');
        Utils.addClass(modal, 'noty_modal_close');
        Utils.addListener(modal, Utils.animationEndEvents, function () {
          Utils.remove(modal);
        });
      }
    }
  }
}

/**
 * @return {void}
 */
function createModal() {
  var body = document.querySelector('body');
  var modal = document.createElement('div');
  Utils.addClass(modal, 'noty_modal');
  body.insertBefore(modal, body.firstChild);
  Utils.addClass(modal, 'noty_modal_open');

  Utils.addListener(modal, Utils.animationEndEvents, function () {
    Utils.removeClass(modal, 'noty_modal_open');
  });
}

/**
 * @param {Noty} ref
 * @return {void}
 */
function findOrCreateContainer(ref) {
  if (ref.options.container) {
    ref.layoutDom = document.querySelector(ref.options.container);
    return;
  }

  var layoutID = 'noty_layout__' + ref.options.layout;
  ref.layoutDom = document.querySelector('div#' + layoutID);

  if (!ref.layoutDom) {
    ref.layoutDom = document.createElement('div');
    ref.layoutDom.setAttribute('id', layoutID);
    Utils.addClass(ref.layoutDom, 'noty_layout');
    document.querySelector('body').appendChild(ref.layoutDom);
  }
}

/**
 * @param {Noty} ref
 * @return {void}
 */
function queueClose(ref) {
  if (ref.options.timeout) {
    if (ref.options.progressBar && ref.progressDom) {
      Utils.css(ref.progressDom, {
        transition: 'width ' + ref.options.timeout + 'ms linear',
        width: '0%'
      });
    }

    clearTimeout(ref.closeTimer);

    ref.closeTimer = setTimeout(function () {
      ref.close();
    }, ref.options.timeout);
  }
}

/**
 * @param {Noty} ref
 * @return {void}
 */
function dequeueClose(ref) {
  if (ref.options.timeout && ref.closeTimer) {
    clearTimeout(ref.closeTimer);
    ref.closeTimer = -1;

    if (ref.options.progressBar && ref.progressDom) {
      Utils.css(ref.progressDom, {
        transition: 'width 0ms linear',
        width: '100%'
      });
    }
  }
}

/**
 * @param {Noty} ref
 * @param {string} eventName
 * @return {void}
 */
function fire(ref, eventName) {
  if (ref.listeners.hasOwnProperty(eventName)) {
    ref.listeners[eventName].forEach(function (cb) {
      if (typeof cb === 'function') {
        cb.apply(ref);
      }
    });
  }
}

/**
 * @param {Noty} ref
 * @return {void}
 */
function openFlow(ref) {
  fire(ref, 'afterShow');
  queueClose(ref);

  Utils.addListener(ref.barDom, 'mouseenter', function () {
    dequeueClose(ref);
  });

  Utils.addListener(ref.barDom, 'mouseleave', function () {
    queueClose(ref);
  });
}

/**
 * @param {Noty} ref
 * @return {void}
 */
function closeFlow(ref) {
  delete Store[ref.id];
  ref.closing = false;
  fire(ref, 'afterClose');

  Utils.remove(ref.barDom);

  if (ref.layoutDom.querySelectorAll('.noty_bar').length === 0 && !ref.options.container) {
    Utils.remove(ref.layoutDom);
  }

  if (Utils.inArray('docVisible', ref.options.titleCount.conditions) || Utils.inArray('docHidden', ref.options.titleCount.conditions)) {
    docTitle.decrement();
  }

  queueRender(ref.options.queue);
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotyButton = undefined;

var _utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NotyButton = exports.NotyButton = function NotyButton(html, classes, cb) {
  var _this = this;

  var attributes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  _classCallCheck(this, NotyButton);

  this.dom = document.createElement('button');
  this.dom.innerHTML = html;
  this.id = attributes.id = attributes.id || Utils.generateID('button');
  this.cb = cb;
  Object.keys(attributes).forEach(function (propertyName) {
    _this.dom.setAttribute(propertyName, attributes[propertyName]);
  });
  Utils.addClass(this.dom, classes || 'noty_btn');

  return this;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Push = exports.Push = function () {
  function Push() {
    var workerPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/service-worker.js';

    _classCallCheck(this, Push);

    this.subData = {};
    this.workerPath = workerPath;
    this.listeners = {
      onPermissionGranted: [],
      onPermissionDenied: [],
      onSubscriptionSuccess: [],
      onSubscriptionCancel: [],
      onWorkerError: [],
      onWorkerSuccess: [],
      onWorkerNotSupported: []
    };
    return this;
  }

  /**
   * @param {string} eventName
   * @param {function} cb
   * @return {Push}
   */


  _createClass(Push, [{
    key: 'on',
    value: function on(eventName) {
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      if (typeof cb === 'function' && this.listeners.hasOwnProperty(eventName)) {
        this.listeners[eventName].push(cb);
      }

      return this;
    }
  }, {
    key: 'fire',
    value: function fire(eventName) {
      var _this = this;

      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (this.listeners.hasOwnProperty(eventName)) {
        this.listeners[eventName].forEach(function (cb) {
          if (typeof cb === 'function') {
            cb.apply(_this, params);
          }
        });
      }
    }
  }, {
    key: 'create',
    value: function create() {
      console.log('NOT IMPLEMENTED YET');
    }

    /**
     * @return {boolean}
     */

  }, {
    key: 'isSupported',
    value: function isSupported() {
      var result = false;

      try {
        result = window.Notification || window.webkitNotifications || navigator.mozNotification || window.external && window.external.msIsSiteMode() !== undefined;
      } catch (e) {}

      return result;
    }

    /**
     * @return {string}
     */

  }, {
    key: 'getPermissionStatus',
    value: function getPermissionStatus() {
      var perm = 'default';

      if (window.Notification && window.Notification.permissionLevel) {
        perm = window.Notification.permissionLevel;
      } else if (window.webkitNotifications && window.webkitNotifications.checkPermission) {
        switch (window.webkitNotifications.checkPermission()) {
          case 1:
            perm = 'default';
            break;
          case 0:
            perm = 'granted';
            break;
          default:
            perm = 'denied';
        }
      } else if (window.Notification && window.Notification.permission) {
        perm = window.Notification.permission;
      } else if (navigator.mozNotification) {
        perm = 'granted';
      } else if (window.external && window.external.msIsSiteMode() !== undefined) {
        perm = window.external.msIsSiteMode() ? 'granted' : 'default';
      }

      return perm.toString().toLowerCase();
    }

    /**
     * @return {string}
     */

  }, {
    key: 'getEndpoint',
    value: function getEndpoint(subscription) {
      var endpoint = subscription.endpoint;
      var subscriptionId = subscription.subscriptionId;

      // fix for Chrome < 45
      if (subscriptionId && endpoint.indexOf(subscriptionId) === -1) {
        endpoint += '/' + subscriptionId;
      }

      return endpoint;
    }

    /**
     * @return {boolean}
     */

  }, {
    key: 'isSWRegistered',
    value: function isSWRegistered() {
      try {
        return navigator.serviceWorker.controller.state === 'activated';
      } catch (e) {
        return false;
      }
    }

    /**
     * @return {void}
     */

  }, {
    key: 'unregisterWorker',
    value: function unregisterWorker() {
      var self = this;
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = registrations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var registration = _step.value;

              registration.unregister();
              self.fire('onSubscriptionCancel');
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        });
      }
    }

    /**
     * @return {void}
     */

  }, {
    key: 'requestSubscription',
    value: function requestSubscription() {
      var _this2 = this;

      var userVisibleOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var self = this;
      var current = this.getPermissionStatus();
      var cb = function cb(result) {
        if (result === 'granted') {
          _this2.fire('onPermissionGranted');

          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register(_this2.workerPath).then(function () {
              navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
                self.fire('onWorkerSuccess');
                serviceWorkerRegistration.pushManager.subscribe({
                  userVisibleOnly: userVisibleOnly
                }).then(function (subscription) {
                  var key = subscription.getKey('p256dh');
                  var token = subscription.getKey('auth');

                  self.subData = {
                    endpoint: self.getEndpoint(subscription),
                    p256dh: key ? window.btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
                    auth: token ? window.btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null
                  };

                  self.fire('onSubscriptionSuccess', [self.subData]);
                }).catch(function (err) {
                  self.fire('onWorkerError', [err]);
                });
              });
            });
          } else {
            self.fire('onWorkerNotSupported');
          }
        } else if (result === 'denied') {
          _this2.fire('onPermissionDenied');
          _this2.unregisterWorker();
        }
      };

      if (current === 'default') {
        if (window.Notification && window.Notification.requestPermission) {
          window.Notification.requestPermission(cb);
        } else if (window.webkitNotifications && window.webkitNotifications.checkPermission) {
          window.webkitNotifications.requestPermission(cb);
        }
      } else {
        cb(current);
      }
    }
  }]);

  return Push;
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {var require;/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.0
 */

(function (global, factory) {
     true ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  return typeof x === 'function' || typeof x === 'object' && x !== null;
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (!Array.isArray) {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
} else {
  _isArray = Array.isArray;
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = __webpack_require__(9);
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && "function" === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  _resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        _resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      _reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      _reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    _reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return _resolve(promise, value);
    }, function (reason) {
      return _reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$) {
  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$ === GET_THEN_ERROR) {
      _reject(promise, GET_THEN_ERROR.error);
      GET_THEN_ERROR.error = null;
    } else if (then$$ === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$)) {
      handleForeignThenable(promise, maybeThenable, then$$);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function _resolve(promise, value) {
  if (promise === value) {
    _reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function _reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      _reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      _resolve(promise, value);
    }, function rejectPromise(reason) {
      _reject(promise, reason);
    });
  } catch (e) {
    _reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this._input = input;
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate();
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    _reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
};

Enumerator.prototype._enumerate = function () {
  var length = this.length;
  var _input = this._input;

  for (var i = 0; this._state === PENDING && i < length; i++) {
    this._eachEntry(_input[i], i);
  }
};

Enumerator.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$ = c.resolve;

  if (resolve$$ === resolve) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$) {
        return resolve$$(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$(entry), i);
  }
};

Enumerator.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      _reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  _reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
  }
}

Promise.all = all;
Promise.race = race;
Promise.resolve = resolve;
Promise.reject = reject;
Promise._setScheduler = setScheduler;
Promise._setAsap = setAsap;
Promise._asap = asap;

Promise.prototype = {
  constructor: Promise,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

function polyfill() {
    var local = undefined;

    if (typeof global !== 'undefined') {
        local = global;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise;
}

// Strange compat..
Promise.polyfill = polyfill;
Promise.Promise = Promise;

return Promise;

})));
//# sourceMappingURL=es6-promise.map

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7), __webpack_require__(8)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global VERSION */

__webpack_require__(5);

var _es6Promise = __webpack_require__(4);

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _utils = __webpack_require__(0);

var Utils = _interopRequireWildcard(_utils);

var _api = __webpack_require__(1);

var API = _interopRequireWildcard(_api);

var _button = __webpack_require__(2);

var _push = __webpack_require__(3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Noty = function () {
  /**
   * @param {object} options
   * @return {Noty}
   */
  function Noty() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Noty);

    this.options = Utils.deepExtend({}, API.Defaults, options);
    this.id = this.options.id || Utils.generateID('bar');
    this.closeTimer = -1;
    this.barDom = null;
    this.layoutDom = null;
    this.progressDom = null;
    this.showing = false;
    this.shown = false;
    this.closed = false;
    this.closing = false;
    this.killable = this.options.timeout || this.options.closeWith.length > 0;
    this.hasSound = this.options.sounds.sources.length > 0;
    this.soundPlayed = false;
    this.listeners = {
      beforeShow: [],
      onShow: [],
      afterShow: [],
      onClose: [],
      afterClose: [],
      onClick: [],
      onHover: [],
      onTemplate: []
    };
    this.promises = {
      show: null,
      close: null
    };
    this.on('beforeShow', this.options.callbacks.beforeShow);
    this.on('onShow', this.options.callbacks.onShow);
    this.on('afterShow', this.options.callbacks.afterShow);
    this.on('onClose', this.options.callbacks.onClose);
    this.on('afterClose', this.options.callbacks.afterClose);
    this.on('onClick', this.options.callbacks.onClick);
    this.on('onHover', this.options.callbacks.onHover);
    this.on('onTemplate', this.options.callbacks.onTemplate);

    return this;
  }

  /**
   * @param {string} eventName
   * @param {function} cb
   * @return {Noty}
   */


  _createClass(Noty, [{
    key: 'on',
    value: function on(eventName) {
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      if (typeof cb === 'function' && this.listeners.hasOwnProperty(eventName)) {
        this.listeners[eventName].push(cb);
      }

      return this;
    }

    /**
     * @return {Noty}
     */

  }, {
    key: 'show',
    value: function show() {
      var _this = this;

      if (this.options.killer === true) {
        Noty.closeAll();
      } else if (typeof this.options.killer === 'string') {
        Noty.closeAll(this.options.killer);
      }

      var queueCounts = API.getQueueCounts(this.options.queue);

      if (queueCounts.current >= queueCounts.maxVisible || API.PageHidden && this.options.visibilityControl) {
        API.addToQueue(this);

        if (API.PageHidden && this.hasSound && Utils.inArray('docHidden', this.options.sounds.conditions)) {
          Utils.createAudioElements(this);
        }

        if (API.PageHidden && Utils.inArray('docHidden', this.options.titleCount.conditions)) {
          API.docTitle.increment();
        }

        return this;
      }

      API.Store[this.id] = this;

      API.fire(this, 'beforeShow');

      this.showing = true;

      if (this.closing) {
        this.showing = false;
        return this;
      }

      API.build(this);
      API.handleModal(this);

      if (this.options.force) {
        this.layoutDom.insertBefore(this.barDom, this.layoutDom.firstChild);
      } else {
        this.layoutDom.appendChild(this.barDom);
      }

      if (this.hasSound && !this.soundPlayed && Utils.inArray('docVisible', this.options.sounds.conditions)) {
        Utils.createAudioElements(this);
      }

      if (Utils.inArray('docVisible', this.options.titleCount.conditions)) {
        API.docTitle.increment();
      }

      this.shown = true;
      this.closed = false;

      // bind button events if any
      if (API.hasButtons(this)) {
        Object.keys(this.options.buttons).forEach(function (key) {
          var btn = _this.barDom.querySelector('#' + _this.options.buttons[key].id);
          Utils.addListener(btn, 'click', function (e) {
            Utils.stopPropagation(e);
            _this.options.buttons[key].cb();
          });
        });
      }

      this.progressDom = this.barDom.querySelector('.noty_progressbar');

      if (Utils.inArray('click', this.options.closeWith)) {
        Utils.addClass(this.barDom, 'noty_close_with_click');
        Utils.addListener(this.barDom, 'click', function (e) {
          Utils.stopPropagation(e);
          API.fire(_this, 'onClick');
          _this.close();
        }, false);
      }

      Utils.addListener(this.barDom, 'mouseenter', function () {
        API.fire(_this, 'onHover');
      }, false);

      if (this.options.timeout) Utils.addClass(this.barDom, 'noty_has_timeout');
      if (this.options.progressBar) {
        Utils.addClass(this.barDom, 'noty_has_progressbar');
      }

      if (Utils.inArray('button', this.options.closeWith)) {
        Utils.addClass(this.barDom, 'noty_close_with_button');

        var closeButton = document.createElement('div');
        Utils.addClass(closeButton, 'noty_close_button');
        closeButton.innerHTML = '×';
        this.barDom.appendChild(closeButton);

        Utils.addListener(closeButton, 'click', function (e) {
          Utils.stopPropagation(e);
          _this.close();
        }, false);
      }

      API.fire(this, 'onShow');

      if (this.options.animation.open === null) {
        this.promises.show = new _es6Promise2.default(function (resolve) {
          resolve();
        });
      } else if (typeof this.options.animation.open === 'function') {
        this.promises.show = new _es6Promise2.default(this.options.animation.open.bind(this));
      } else {
        Utils.addClass(this.barDom, this.options.animation.open);
        this.promises.show = new _es6Promise2.default(function (resolve) {
          Utils.addListener(_this.barDom, Utils.animationEndEvents, function () {
            Utils.removeClass(_this.barDom, _this.options.animation.open);
            resolve();
          });
        });
      }

      this.promises.show.then(function () {
        var _t = _this;
        setTimeout(function () {
          API.openFlow(_t);
        }, 100);
      });

      return this;
    }

    /**
     * @return {Noty}
     */

  }, {
    key: 'stop',
    value: function stop() {
      API.dequeueClose(this);
      return this;
    }

    /**
     * @return {Noty}
     */

  }, {
    key: 'resume',
    value: function resume() {
      API.queueClose(this);
      return this;
    }

    /**
     * @param {int|boolean} ms
     * @return {Noty}
     */

  }, {
    key: 'setTimeout',
    value: function (_setTimeout) {
      function setTimeout(_x) {
        return _setTimeout.apply(this, arguments);
      }

      setTimeout.toString = function () {
        return _setTimeout.toString();
      };

      return setTimeout;
    }(function (ms) {
      this.stop();
      this.options.timeout = ms;

      if (this.barDom) {
        if (this.options.timeout) {
          Utils.addClass(this.barDom, 'noty_has_timeout');
        } else {
          Utils.removeClass(this.barDom, 'noty_has_timeout');
        }

        var _t = this;
        setTimeout(function () {
          // ugly fix for progressbar display bug
          _t.resume();
        }, 100);
      }

      return this;
    })

    /**
     * @param {string} html
     * @param {boolean} optionsOverride
     * @return {Noty}
     */

  }, {
    key: 'setText',
    value: function setText(html) {
      var optionsOverride = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (this.barDom) {
        this.barDom.querySelector('.noty_body').innerHTML = html;
      }

      if (optionsOverride) this.options.text = html;

      return this;
    }

    /**
     * @param {string} type
     * @param {boolean} optionsOverride
     * @return {Noty}
     */

  }, {
    key: 'setType',
    value: function setType(type) {
      var _this2 = this;

      var optionsOverride = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (this.barDom) {
        var classList = Utils.classList(this.barDom).split(' ');

        classList.forEach(function (c) {
          if (c.substring(0, 11) === 'noty_type__') {
            Utils.removeClass(_this2.barDom, c);
          }
        });

        Utils.addClass(this.barDom, 'noty_type__' + type);
      }

      if (optionsOverride) this.options.type = type;

      return this;
    }

    /**
     * @param {string} theme
     * @param {boolean} optionsOverride
     * @return {Noty}
     */

  }, {
    key: 'setTheme',
    value: function setTheme(theme) {
      var _this3 = this;

      var optionsOverride = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (this.barDom) {
        var classList = Utils.classList(this.barDom).split(' ');

        classList.forEach(function (c) {
          if (c.substring(0, 12) === 'noty_theme__') {
            Utils.removeClass(_this3.barDom, c);
          }
        });

        Utils.addClass(this.barDom, 'noty_theme__' + theme);
      }

      if (optionsOverride) this.options.theme = theme;

      return this;
    }

    /**
     * @return {Noty}
     */

  }, {
    key: 'close',
    value: function close() {
      var _this4 = this;

      if (this.closed) return this;

      if (!this.shown) {
        // it's in the queue
        API.removeFromQueue(this);
        return this;
      }

      API.fire(this, 'onClose');

      this.closing = true;

      if (this.options.animation.close === null) {
        this.promises.close = new _es6Promise2.default(function (resolve) {
          resolve();
        });
      } else if (typeof this.options.animation.close === 'function') {
        this.promises.close = new _es6Promise2.default(this.options.animation.close.bind(this));
      } else {
        Utils.addClass(this.barDom, this.options.animation.close);
        this.promises.close = new _es6Promise2.default(function (resolve) {
          Utils.addListener(_this4.barDom, Utils.animationEndEvents, function () {
            if (_this4.options.force) {
              Utils.remove(_this4.barDom);
            } else {
              API.ghostFix(_this4);
            }
            resolve();
          });
        });
      }

      this.promises.close.then(function () {
        API.closeFlow(_this4);
        API.handleModalClose(_this4);
      });

      this.closed = true;

      return this;
    }

    // API functions

    /**
     * @param {boolean|string} queueName
     * @return {Noty}
     */

  }], [{
    key: 'closeAll',
    value: function closeAll() {
      var queueName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      Object.keys(API.Store).forEach(function (id) {
        if (queueName) {
          if (API.Store[id].options.queue === queueName && API.Store[id].killable) {
            API.Store[id].close();
          }
        } else if (API.Store[id].killable) {
          API.Store[id].close();
        }
      });
      return this;
    }

    /**
     * @param {Object} obj
     * @return {Noty}
     */

  }, {
    key: 'overrideDefaults',
    value: function overrideDefaults(obj) {
      API.Defaults = Utils.deepExtend({}, API.Defaults, obj);
      return this;
    }

    /**
     * @param {int} amount
     * @param {string} queueName
     * @return {Noty}
     */

  }, {
    key: 'setMaxVisible',
    value: function setMaxVisible() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : API.DefaultMaxVisible;
      var queueName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'global';

      if (!API.Queues.hasOwnProperty(queueName)) {
        API.Queues[queueName] = { maxVisible: amount, queue: [] };
      }

      API.Queues[queueName].maxVisible = amount;
      return this;
    }

    /**
     * @param {string} innerHtml
     * @param {String} classes
     * @param {Function} cb
     * @param {Object} attributes
     * @return {NotyButton}
     */

  }, {
    key: 'button',
    value: function button(innerHtml) {
      var classes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var cb = arguments[2];
      var attributes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      return new _button.NotyButton(innerHtml, classes, cb, attributes);
    }

    /**
     * @return {string}
     */

  }, {
    key: 'version',
    value: function version() {
      return "3.1.3";
    }

    /**
     * @param {String} workerPath
     * @return {Push}
     */

  }, {
    key: 'Push',
    value: function Push(workerPath) {
      return new _push.Push(workerPath);
    }
  }]);

  return Noty;
}();

// Document visibility change controller


exports.default = Noty;
Utils.visibilityChangeFlow();
module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 8 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })
/******/ ]);
});
//# sourceMappingURL=noty.js.map

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @preserve jquery-param (c) 2015 KNOWLEDGECODE | MIT
 */
(function (global) {
    'use strict';

    var param = function (a) {
        var s = [], rbracket = /\[\]$/,
            isArray = function (obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            }, add = function (k, v) {
                v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
                s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
            }, buildParams = function (prefix, obj) {
                var i, len, key;

                if (prefix) {
                    if (isArray(obj)) {
                        for (i = 0, len = obj.length; i < len; i++) {
                            if (rbracket.test(prefix)) {
                                add(prefix, obj[i]);
                            } else {
                                buildParams(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i]);
                            }
                        }
                    } else if (obj && String(obj) === '[object Object]') {
                        for (key in obj) {
                            buildParams(prefix + '[' + key + ']', obj[key]);
                        }
                    } else {
                        add(prefix, obj);
                    }
                } else if (isArray(obj)) {
                    for (i = 0, len = obj.length; i < len; i++) {
                        add(obj[i].name, obj[i].value);
                    }
                } else {
                    for (key in obj) {
                        buildParams(key, obj[key]);
                    }
                }
                return s;
            };

        return buildParams('', a).join('&').replace(/%20/g, '+');
    };

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = param;
    } else if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
            return param;
        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {
        global.param = param;
    }

}(this));



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

module.exports = (__webpack_require__(8))(9);

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.pressedShortcuts = undefined;

var _helpers = __webpack_require__(2);

/*window.addEventListener("beforeunload", function (e) {
	let confirmationMessage = "TEST";
	(e || window.event).returnValue = confirmationMessage; //Gecko + IE
	return confirmationMessage;                            //Webkit, Safari, Chrome
});*/

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
	var isApollo = window.TerminalState.isGdsApollo();
	var gds = window.TerminalState.getGds();

	// console.log('key pressed:' ,keymap);

	if (evt.ctrlKey || evt.metaKey) {
		switch (keymap) {
			case 8: //CTRL + backSpace;
			case 83:
				//CTRL + S;
				window.TerminalState.purgeScreens();
				break;

			case 87:
				//CTRL+W
				window.TerminalState.clearTerminal();
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
			// these keys are used in terminalKeydown()
			case 192: // Ctrl + ~
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

			case 187: //+
			case 61: //+ FireFox
			case 188:
				//,
				terminal.insert('+');
				break;

			// disabling key from terminal library to execute
			// key is used in terminalKeydown()
			case 192:
				// Shift + ~
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
		/*case 59	: // ; firefox
  case 186: // ; all other browsers
  	if (!isApollo)
  	{
  		// terminal.cmd().delete(-1);
  		// return false;
  	}
  break;*/

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(2);

var _dom = __webpack_require__(0);

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
/* 37 */
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
/* 38 */
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
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = History;
var promises = {};
var commands = {};

function History() {
	var gds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'apollo';

	var pos = false;
	var length = 0;

	commands[gds] = commands[gds] || [];

	var askServer = function askServer() {
		return window.TerminalState.getHistory();
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
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.terminalKeydown = terminalKeydown;
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

function switchTerminal(keymap) {
	var currentTerminalName = window.activePlugin.name;
	var gds = window.TerminalState.getGds();
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

	window.TerminalState.switchTerminals(gds, getId);
}

function terminalKeydown(terminal) {
	terminal.querySelector('textarea').addEventListener('keydown', function (e) {
		var keymap = e.keyCode || e.which;

		if (e.ctrlKey || e.metaKey) {
			switch (keymap) {
				case 192:
					// Ctrl + ~
					switchTerminal('next');
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
					switchTerminal(keymap);
					break;
			}
		}

		if (e.shiftKey) {
			if (keymap === 192) // Shift + ~
				{
					switchTerminal('prev');
				}
		}
	});
}

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(8))(8);

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

var _terminal = __webpack_require__(5);

var _terminal2 = _interopRequireDefault(_terminal);

var _component = __webpack_require__(3);

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gdsSession = [];
var stringify = JSON.stringify;
var cells = [];

var DimensionCalculator = function () {
	function DimensionCalculator(context) {
		_classCallCheck(this, DimensionCalculator);

		this.context = context;
	}

	_createClass(DimensionCalculator, [{
		key: 'calculate',
		value: function calculate(rowCount, cellCount) {
			return {
				height: Math.floor(this.context.clientHeight / rowCount),
				width: Math.floor(this.context.clientWidth / cellCount),
				char: this.getLineHeight()
			};
		}
	}, {
		key: 'getLineHeight',
		value: function getLineHeight() {
			var _getBoundingClientRec = (this.cursor || this.getCursor()).getBoundingClientRect(),
			    width = _getBoundingClientRec.width,
			    height = _getBoundingClientRec.height;

			return { width: width, height: height };
		}
	}, {
		key: 'getCursor',
		value: function getCursor() {
			var tempCmd = (0, _dom2.default)('div.terminal temp-terminal');
			this.context.appendChild(tempCmd);
			tempCmd.innerHTML = '<div class="cmd"><span class="cursor">&nbsp;</span></div>';

			return this.cursor = tempCmd.querySelector('.cursor');
		}
	}]);

	return DimensionCalculator;
}();

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
		key: 'getSizes',
		value: function getSizes() {
			return this.sizer = this.sizer || new DimensionCalculator(this.getContext().parentNode);
		}
	}, {
		key: 'makeCells',
		value: function makeCells(rowCount, cellCount) {
			var _this2 = this;

			var makeRow = function makeRow() {
				var row = (0, _dom2.default)('tr');
				_this2.context.appendChild(row);
				return row;
			};

			var makeCells = function makeCells(row) {
				return [].concat(_toConsumableArray(new Array(cellCount))).map(function () {
					var cell = (0, _dom2.default)('td.terminal-cell .v-middle');
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

			var params = this.props;

			var rowCount = params.cellMatrix.rows + 1;
			var cellCount = params.cellMatrix.cells + 1;

			gdsSession[params.gds] = gdsSession[params.gds] || [];

			var state = {
				gds: params.gds,
				dimensions: this.getSizes().calculate(rowCount, cellCount),
				wrapWidth: params.containerWidth,
				hideMenu: params.hideMenu
			};

			var needToRender = this.renderIsNeeded(state);

			if (needToRender) {
				this.context.innerHTML = '';
				this.context.className = 't-matrix-w-' + (cellCount - 1);

				this.state = state;

				cells = this.makeCells(rowCount, cellCount);

				cells.forEach(function (cell, index) {

					var props = {
						name: index,
						sessionIndex: params.sessionIndex,
						gds: params.gds, // need for session
						buffer: params.buffer && params.buffer[params.gds] ? params.buffer[params.gds]['terminals'][index + 1] : ''
					};

					_this3.getTerminal(params.gds, index, props).reattach(cell, _this3.getSizes().calculate(rowCount, cellCount)); //sometimes calculate doesn't get actual parent context dimensions
				});
			}

			cells.forEach(function (cell, index) {
				var isActive = params.activeTerminal && index === params.activeTerminal.name();
				cell.classList.toggle('activeWindow', isActive);
			});
		}
	}]);

	return TerminalsMatrix;
}(_component2.default);

exports.default = TerminalsMatrix;

/***/ }),
/* 44 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map