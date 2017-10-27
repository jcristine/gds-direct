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
/***/ (function(module, exports) {

module.exports = vendor_lib;

/***/ }),
/* 2 */
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
/* 3 */
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
/* 4 */
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
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = __webpack_require__(26);

var _plugin2 = _interopRequireDefault(_plugin);

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

__webpack_require__(43);

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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setLink = exports.get = undefined;

var _constants = __webpack_require__(5);

__webpack_require__(29);

var _debug = __webpack_require__(8);

var JParam = __webpack_require__(31);

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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.showUserMessages = exports.debugRequest = exports.Debug = undefined;

var _noty = __webpack_require__(30);

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

var _constants = __webpack_require__(5);

var _helpers = __webpack_require__(3);

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
module.exports = __webpack_require__(45);


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

var _requests = __webpack_require__(7);

var _gds = __webpack_require__(10);

var _gds2 = _interopRequireDefault(_gds);

var _constants = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Container = void 0,
    Gds = void 0;

var Terminal = function Terminal(params) {
	_classCallCheck(this, Terminal);

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

var _menuPanel = __webpack_require__(17);

var _menuPanel2 = _interopRequireDefault(_menuPanel);

var _terminalMatrix = __webpack_require__(44);

var _terminalMatrix2 = _interopRequireDefault(_terminalMatrix);

var _component = __webpack_require__(4);

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

var _component = __webpack_require__(4);

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

var _buttonPopover = __webpack_require__(2);

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

module.exports = (__webpack_require__(1))(12);

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _theme = __webpack_require__(18);

var _theme2 = _interopRequireDefault(_theme);

var _history = __webpack_require__(19);

var _history2 = _interopRequireDefault(_history);

var _textSize = __webpack_require__(20);

var _textSize2 = _interopRequireDefault(_textSize);

var _settings = __webpack_require__(21);

var _settings2 = _interopRequireDefault(_settings);

var _sessionButtons = __webpack_require__(22);

var _sessionButtons2 = _interopRequireDefault(_sessionButtons);

var _pqButton = __webpack_require__(23);

var _pqButton2 = _interopRequireDefault(_pqButton);

var _devButtons = __webpack_require__(24);

var _devButtons2 = _interopRequireDefault(_devButtons);

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

var _component = __webpack_require__(4);

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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(2);

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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// import Request			from '../../helpers/requests.es6';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(2);

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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(2);

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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(2);

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
/* 22 */
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
/* 23 */
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(2);

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

var _fullscreen = __webpack_require__(25);

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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

var _terminal = __webpack_require__(6);

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
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pagination = __webpack_require__(27);

var _pagination2 = _interopRequireDefault(_pagination);

var _session = __webpack_require__(28);

var _session2 = _interopRequireDefault(_session);

var _spinner = __webpack_require__(32);

var _spinner2 = _interopRequireDefault(_spinner);

var _keyBinding = __webpack_require__(34);

var _output = __webpack_require__(35);

var _output2 = _interopRequireDefault(_output);

var _tabManager = __webpack_require__(36);

var _tabManager2 = _interopRequireDefault(_tabManager);

var _f = __webpack_require__(37);

var _f2 = _interopRequireDefault(_f);

var _history = __webpack_require__(38);

var _history2 = _interopRequireDefault(_history);

var _debug = __webpack_require__(8);

var _switchTerminal = __webpack_require__(39);

var _helpers = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = __webpack_require__(40);
window.$ = window.jQuery = $;

__webpack_require__(41);
__webpack_require__(42).polyfill();

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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(3);

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
/* 28 */
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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(14);

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(11);

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(15);

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cliSpinners = __webpack_require__(33);

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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(9);

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.pressedShortcuts = undefined;

var _helpers = __webpack_require__(3);

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

			// case 187: //+
			// case 61 : //+ FireFox
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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(3);

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
/* 36 */
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
/* 37 */
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
/* 38 */
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
/* 39 */
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
/* 40 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(2);

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(7);

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(8);

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(0);

var _dom2 = _interopRequireDefault(_dom);

var _terminal = __webpack_require__(6);

var _terminal2 = _interopRequireDefault(_terminal);

var _component = __webpack_require__(4);

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
/* 45 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=terminal-bundle.js.map