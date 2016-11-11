/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(4);
	module.exports = __webpack_require__(19);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _terminal = __webpack_require__(5);
	
	var _terminal2 = _interopRequireDefault(_terminal);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var apiData = window.apiData || {};
	
	var Context = {
		init: function init() {
			var rootId = apiData.htmlRootId || 'rootTerminal';
			_terminal2.default.render(rootId);
	
			if (apiData.styleSheets) __webpack_require__(15);
		},
		createTerminal: function createTerminal() {
			_terminal2.default.add();
		}
	};
	
	Context.init();
	Context.createTerminal();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _terminal = __webpack_require__(6);
	
	var _terminal2 = _interopRequireDefault(_terminal);
	
	var _constants = __webpack_require__(8);
	
	var _buttons = __webpack_require__(13);
	
	var _sideMenu = __webpack_require__(14);
	
	var _sideMenu2 = _interopRequireDefault(_sideMenu);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var isSplit = void 0;
	
	function splitHandler() {
		isSplit = !isSplit;
	
		if (Main.terminals.length == 1) {
			Main.add({
				className: 'border-top',
				split: 'no',
				height: _constants.TERMINAL_SPLIT_HEIGHT + 'px'
			});
		}
	
		if (isSplit) {
			Main.terminals[1].show();
			Main.minimizeAll();
		} else {
			Main.maximizeAll();
			Main.terminals[1].hide();
		}
	}
	
	var Terminal = function () {
		function Terminal(params) {
			_classCallCheck(this, Terminal);
	
			this.params = params;
			this.context = document.createElement('div');
			this.context.className = params.className;
			this.context.style.height = params.height + 'px';
	
			this.menu = document.createElement('div');
			this.menu.className = 'text-right wrapper-sm menu';
		}
	
		_createClass(Terminal, [{
			key: 'render',
			value: function render() {
				document.getElementById('terminalContainer').appendChild(this.context);
				this.context.appendChild(this.menu);
			}
		}, {
			key: 'create',
			value: function create() {
				this.render();
	
				this.menu.appendChild((0, _buttons.bufferBtn)().make(function () {
					plugin.focus();
				}));
	
				if (this.params.split == 1) {
					this.menu.appendChild(_buttons.splitBtn);
					_buttons.splitBtn.addEventListener('click', splitHandler);
				}
	
				var plugin = _terminal2.default.init(this.context);
				// plugin.focus();
			}
		}, {
			key: 'hide',
			value: function hide() {
				this.context.style.display = 'none';
			}
		}, {
			key: 'show',
			value: function show() {
				this.context.style.display = '';
			}
		}, {
			key: 'minimize',
			value: function minimize() {
				this.context.style.height = _constants.TERMINAL_SPLIT_HEIGHT + 'px';
			}
		}, {
			key: 'maximize',
			value: function maximize() {
				this.context.style.height = _constants.TERMINAL_HEIGHT + 'px';
			}
		}]);
	
		return Terminal;
	}();
	
	var TerminalWrap = function () {
		function TerminalWrap() {
			_classCallCheck(this, TerminalWrap);
	
			this.terminals = [];
		}
	
		_createClass(TerminalWrap, [{
			key: 'render',
			value: function render(rootId) {
				var Root = document.getElementById(rootId);
	
				Root.insertAdjacentHTML('beforeend', '<section class="terminal-wrap clearfix">\n\t\t\t\t<header class="title-bar">Terminal Sabre</header>\n\t\t\t\t<div class="t-d-table">\n\t\t\t\t\t<div id="terminalContainer" class="t-d-cell"></div>\n\t\t\t\t\t<div id="sideMenu" class="t-d-cell panel-right"></div>\n\t\t\t\t</div>\n\t\t\t</section>');
	
				document.getElementById('sideMenu').appendChild(_sideMenu2.default.render());
			}
		}, {
			key: 'add',
			value: function add() {
				var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
				var terminal = new Terminal({
					className: params.className || '',
					split: params.split || 1,
					height: params.height || _constants.TERMINAL_HEIGHT
				});
	
				terminal.create();
				this.terminals.push(terminal);
			}
		}, {
			key: 'minimizeAll',
			value: function minimizeAll() {
				this.terminals.map(function (obj) {
					obj.minimize();
				});
			}
		}, {
			key: 'maximizeAll',
			value: function maximizeAll() {
				this.terminals.map(function (obj) {
					obj.maximize();
				});
			}
		}, {
			key: 'remove',
			value: function remove() {}
		}]);
	
		return TerminalWrap;
	}();
	
	var Main = new TerminalWrap();
	
	exports.default = Main;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _sabreSession = __webpack_require__(7);
	
	var _sabreSession2 = _interopRequireDefault(_sabreSession);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var $ = __webpack_require__(10);
	window.$ = window.jQuery = $;
	var terminal = __webpack_require__(11);
	var Helpers = __webpack_require__(12);
	
	var TerminalPlugin = function () {
		return {
	
			init: function init(Context) {
	
				$(Context).on('keypress', function (evt) {
					if (evt.which && !evt.ctrlKey) {
						var ch = Helpers.substitutePrintableChar(String.fromCharCode(evt.which));
	
						if (ch) {
							term.insert(ch);
							return false;
						}
					}
				});
	
				$(Context).on('keydown', function (evt) {
					if ((evt.which === 83 || evt.which === 87) && evt.ctrlKey) {
						// CTRL+S || CTRL+W
						term.clear();
						return false;
					} else if (evt.which === 68 && evt.ctrlKey) {
						// CTRL+D
						return false;
					} else if (evt.which === 76 && evt.ctrlKey) {
						// CTRL+L
						return false;
					} else if (evt.which === 82 && evt.ctrlKey) {
						// CTRL+R
						return false;
					}
				});
	
				var term = $(Context).terminal(function (command, terminal) {
	
					var outputCache = [];
	
					if (command === '') {
						terminal.echo('');
					} else if (command === 'MD') {
						terminal.echo(outputCache.length > 0 ? outputCache.shift() : '‡NOTHING TO SCROLL‡');
					} else {
						try {
							terminal.set_prompt('');
	
							_sabreSession2.default.runCommand(command).then(function () {
								var response = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	
								var result = response['data'];
	
								if (result.prompt) terminal.set_prompt(result.prompt);
	
								if (result.clearScreen) terminal.clear();
	
								if (result.output) {
									outputCache = Helpers.makeCachedParts(result.output);
									terminal.echo(outputCache.shift());
								}
							});
						} catch (e) {
							alert(' something went wrong ');
							terminal.error(new String(e));
						}
					}
				}, {
					greetings: false,
					name: 'sabre_terminal',
					disabled: true,
					prompt: '',
					onInit: function onInit(terminal) {
						_sabreSession2.default.startSession();
						// let startSessionOutput = SabreSession.startSession();
						//terminal.echo('>' + startSessionOutput['emulationCommand']);
						//terminal.echo(startSessionOutput['emulationCommandOutput']);
					}
				});
	
				return term;
			}
		};
	}();
	
	exports.default = TerminalPlugin;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _constants = __webpack_require__(8);
	
	var _requests = __webpack_require__(9);
	
	var _requests2 = _interopRequireDefault(_requests);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	
		var sessionToken = void 0;
	
		return {
	
			// startSession2	: function()
			// {
			// 	// let result = runSyncCommand('startSession', {'timeFormat': TIME_FORMAT, 'account': ACCOUNT});
			//
			// 	let post = {
			// 		timeFormat	: TIME_FORMAT,
			// 		account		: ACCOUNT
			// 	};
			//
			// 	let promise = Requests.runSyncCommand('startSession',  post);
			//
			// 	promise.done( function ( response ) {
			// 		sessionToken = response['data']['sessionToken'];
			// 		return response['data'];
			// 	}).fail( function () {
			// 		console.log('fail :((((')
			// 	});
			//
			// 	// return false;
			// },
	
			startSession: function startSession() {
				var post = {
					timeFormat: _constants.TIME_FORMAT,
					account: _constants.ACCOUNT
				};
	
				var promise = _requests2.default.runSyncCommand('startSession', post);
	
				promise.then(function (response) {
					console.log(response);
					sessionToken = response['data']['sessionToken'];
					return response['data'];
				}).catch(function (err) {
					console.error('oh shit Error', err);
				});
			},
	
			cachedOutput: '',
	
			runCommand: function runCommand(cmd) {
				// console.log('making runCommand call');
	
				if (cmd == 'MD') return this.cachedOutput.shift();
	
				return _requests2.default.runSyncCommand('runCommand', { 'sessionToken': sessionToken, 'command': cmd });
	
				// throw 'Failed to execute, session has timed outp';
			},
	
			endSession: function endSession() {
	
				// console.log('making endSession call');
	
				var result = _requests2.default.runSyncCommand('endSession', { 'sessionToken': sessionToken });
	
				if (result['success']) return true;
	
				// throw new Exception('Failed to execute, session has timed oupt');
			}
		};
	}();

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var TERMINAL_HEIGHT = exports.TERMINAL_HEIGHT = '650';
	var TERMINAL_SPLIT_HEIGHT = exports.TERMINAL_SPLIT_HEIGHT = '325';
	
	// export const END_POINT_URL	 		= '../?id=sabre/terminal&her=1';
	
	var INFO_DATA_URL = exports.INFO_DATA_URL = '?id=sabre/terminal&getInfoData=1';
	var END_POINT_URL = exports.END_POINT_URL = '?id=sabre/terminal&her=1';
	var TIME_FORMAT = exports.TIME_FORMAT = '12';
	var ACCOUNT = exports.ACCOUNT = 'training';
	var API_HOST = exports.API_HOST = 'http://intranet.dyninno.net/~artur/CMS1ee/';

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _constants = __webpack_require__(8);
	
	var $ = __webpack_require__(10);
	
	function get(url, params) {
		if (!url) return '';
	
		return fetch(_constants.API_HOST + url, {}).then(function (response) {
			return response.json();
		});
	}
	
	function runSyncCommand(functionName, params) {
		var url = _constants.END_POINT_URL;
	
		var data = {
			'function': functionName,
			'params': params
		};
	
		// body: JSON.stringify({
		// 	email: document.getElementById('email').value
		// 	answer: document.getElementById('answer').value
		// })
	
		var get = JSON.stringify(data, true);
	
		url += '&data=' + get + '&function=' + functionName;
	
		return fetch(_constants.API_HOST + url, {
	
			// method		: 'POST',
			// redirect	: 'follow'
			// ,
			// headers: new Headers({
			// 	'Content-Type': 'application/json'
			// })
	
			// {method: "post", headers: {"content-type": "application/x-www-form-urlencoded"}
	
		}).then(function (response) {
			return response.json();
		});
	}
	
	function runSyncCommand2(functionName, params) {
		var url = _constants.END_POINT_URL;
	
		var data = {
			'function': functionName,
			'params': params
		};
	
		console.log('???', url + '&function=' + functionName);
	
		//
		// get( END_POINT_URL ).then(function(response) {
		// 	console.log("Success!", response);
		// }, function(error) {
		// 	console.error("Failed!", error);
		// });
	
		return $.ajax({
			type: 'POST',
			url: url + '&function=' + functionName,
	
			// crossDomain		: true,
			// async			: false,
			// dataType		: 'json',
			//
			// headers			: {
			// 	'X-Requested-With': 'XMLHttpRequest'
			// },
			//
	
			data: {
				data: JSON.stringify(data, true)
			},
	
			complete: function complete(responseData, textStatus, jqXHR) {
				console.log(' completed ');
				// result = responseData;
			},
	
			fail: function fail(responseData, textStatus, errorThrown) {
				console.log(' fail ;');
				console.log(responseData);
				console.log(responseData.responseText);
				alert('POST failed.');
			}
		});
	}
	
	exports.default = {
		runSyncCommand: runSyncCommand,
		get: get
	};
	
	// module.exports = Actions;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery JavaScript Library v3.1.1
	 * https://jquery.com/
	 *
	 * Includes Sizzle.js
	 * https://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * https://jquery.org/license
	 *
	 * Date: 2016-09-22T22:30Z
	 */
	( function( global, factory ) {
	
		"use strict";
	
		if ( typeof module === "object" && typeof module.exports === "object" ) {
	
			// For CommonJS and CommonJS-like environments where a proper `window`
			// is present, execute the factory and get jQuery.
			// For environments that do not have a `window` with a `document`
			// (such as Node.js), expose a factory as module.exports.
			// This accentuates the need for the creation of a real `window`.
			// e.g. var jQuery = require("jquery")(window);
			// See ticket #14549 for more info.
			module.exports = global.document ?
				factory( global, true ) :
				function( w ) {
					if ( !w.document ) {
						throw new Error( "jQuery requires a window with a document" );
					}
					return factory( w );
				};
		} else {
			factory( global );
		}
	
	// Pass this if window is not defined yet
	} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
	
	// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
	// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
	// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
	// enough that all such attempts are guarded in a try block.
	"use strict";
	
	var arr = [];
	
	var document = window.document;
	
	var getProto = Object.getPrototypeOf;
	
	var slice = arr.slice;
	
	var concat = arr.concat;
	
	var push = arr.push;
	
	var indexOf = arr.indexOf;
	
	var class2type = {};
	
	var toString = class2type.toString;
	
	var hasOwn = class2type.hasOwnProperty;
	
	var fnToString = hasOwn.toString;
	
	var ObjectFunctionString = fnToString.call( Object );
	
	var support = {};
	
	
	
		function DOMEval( code, doc ) {
			doc = doc || document;
	
			var script = doc.createElement( "script" );
	
			script.text = code;
			doc.head.appendChild( script ).parentNode.removeChild( script );
		}
	/* global Symbol */
	// Defining this global in .eslintrc.json would create a danger of using the global
	// unguarded in another place, it seems safer to define global only for this module
	
	
	
	var
		version = "3.1.1",
	
		// Define a local copy of jQuery
		jQuery = function( selector, context ) {
	
			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		},
	
		// Support: Android <=4.0 only
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
	
		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([a-z])/g,
	
		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		};
	
	jQuery.fn = jQuery.prototype = {
	
		// The current version of jQuery being used
		jquery: version,
	
		constructor: jQuery,
	
		// The default length of a jQuery object is 0
		length: 0,
	
		toArray: function() {
			return slice.call( this );
		},
	
		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {
	
			// Return all the elements in a clean array
			if ( num == null ) {
				return slice.call( this );
			}
	
			// Return just the one element from the set
			return num < 0 ? this[ num + this.length ] : this[ num ];
		},
	
		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems ) {
	
			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );
	
			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
	
			// Return the newly-formed element set
			return ret;
		},
	
		// Execute a callback for every element in the matched set.
		each: function( callback ) {
			return jQuery.each( this, callback );
		},
	
		map: function( callback ) {
			return this.pushStack( jQuery.map( this, function( elem, i ) {
				return callback.call( elem, i, elem );
			} ) );
		},
	
		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},
	
		first: function() {
			return this.eq( 0 );
		},
	
		last: function() {
			return this.eq( -1 );
		},
	
		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
		},
	
		end: function() {
			return this.prevObject || this.constructor();
		},
	
		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};
	
	jQuery.extend = jQuery.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[ 0 ] || {},
			i = 1,
			length = arguments.length,
			deep = false;
	
		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
	
			// Skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}
	
		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
			target = {};
		}
	
		// Extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}
	
		for ( ; i < length; i++ ) {
	
			// Only deal with non-null/undefined values
			if ( ( options = arguments[ i ] ) != null ) {
	
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];
	
					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}
	
					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
						( copyIsArray = jQuery.isArray( copy ) ) ) ) {
	
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray( src ) ? src : [];
	
						} else {
							clone = src && jQuery.isPlainObject( src ) ? src : {};
						}
	
						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );
	
					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}
	
		// Return the modified object
		return target;
	};
	
	jQuery.extend( {
	
		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),
	
		// Assume jQuery is ready without the ready module
		isReady: true,
	
		error: function( msg ) {
			throw new Error( msg );
		},
	
		noop: function() {},
	
		isFunction: function( obj ) {
			return jQuery.type( obj ) === "function";
		},
	
		isArray: Array.isArray,
	
		isWindow: function( obj ) {
			return obj != null && obj === obj.window;
		},
	
		isNumeric: function( obj ) {
	
			// As of jQuery 3.0, isNumeric is limited to
			// strings and numbers (primitives or objects)
			// that can be coerced to finite numbers (gh-2662)
			var type = jQuery.type( obj );
			return ( type === "number" || type === "string" ) &&
	
				// parseFloat NaNs numeric-cast false positives ("")
				// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
				// subtraction forces infinities to NaN
				!isNaN( obj - parseFloat( obj ) );
		},
	
		isPlainObject: function( obj ) {
			var proto, Ctor;
	
			// Detect obvious negatives
			// Use toString instead of jQuery.type to catch host objects
			if ( !obj || toString.call( obj ) !== "[object Object]" ) {
				return false;
			}
	
			proto = getProto( obj );
	
			// Objects with no prototype (e.g., `Object.create( null )`) are plain
			if ( !proto ) {
				return true;
			}
	
			// Objects with prototype are plain iff they were constructed by a global Object function
			Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
			return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
		},
	
		isEmptyObject: function( obj ) {
	
			/* eslint-disable no-unused-vars */
			// See https://github.com/eslint/eslint/issues/6125
			var name;
	
			for ( name in obj ) {
				return false;
			}
			return true;
		},
	
		type: function( obj ) {
			if ( obj == null ) {
				return obj + "";
			}
	
			// Support: Android <=2.3 only (functionish RegExp)
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[ toString.call( obj ) ] || "object" :
				typeof obj;
		},
	
		// Evaluates a script in a global context
		globalEval: function( code ) {
			DOMEval( code );
		},
	
		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE <=9 - 11, Edge 12 - 13
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function( string ) {
			return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
		},
	
		nodeName: function( elem, name ) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},
	
		each: function( obj, callback ) {
			var length, i = 0;
	
			if ( isArrayLike( obj ) ) {
				length = obj.length;
				for ( ; i < length; i++ ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			}
	
			return obj;
		},
	
		// Support: Android <=4.0 only
		trim: function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},
	
		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];
	
			if ( arr != null ) {
				if ( isArrayLike( Object( arr ) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
						[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}
	
			return ret;
		},
	
		inArray: function( elem, arr, i ) {
			return arr == null ? -1 : indexOf.call( arr, elem, i );
		},
	
		// Support: Android <=4.0 only, PhantomJS 1 only
		// push.apply(_, arraylike) throws on ancient WebKit
		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;
	
			for ( ; j < len; j++ ) {
				first[ i++ ] = second[ j ];
			}
	
			first.length = i;
	
			return first;
		},
	
		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;
	
			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}
	
			return matches;
		},
	
		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var length, value,
				i = 0,
				ret = [];
	
			// Go through the array, translating each of the items to their new values
			if ( isArrayLike( elems ) ) {
				length = elems.length;
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );
	
					if ( value != null ) {
						ret.push( value );
					}
				}
	
			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );
	
					if ( value != null ) {
						ret.push( value );
					}
				}
			}
	
			// Flatten any nested arrays
			return concat.apply( [], ret );
		},
	
		// A global GUID counter for objects
		guid: 1,
	
		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function( fn, context ) {
			var tmp, args, proxy;
	
			if ( typeof context === "string" ) {
				tmp = fn[ context ];
				context = fn;
				fn = tmp;
			}
	
			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if ( !jQuery.isFunction( fn ) ) {
				return undefined;
			}
	
			// Simulated bind
			args = slice.call( arguments, 2 );
			proxy = function() {
				return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
			};
	
			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;
	
			return proxy;
		},
	
		now: Date.now,
	
		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	} );
	
	if ( typeof Symbol === "function" ) {
		jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
	}
	
	// Populate the class2type map
	jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );
	
	function isArrayLike( obj ) {
	
		// Support: real iOS 8.2 only (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
			type = jQuery.type( obj );
	
		if ( type === "function" || jQuery.isWindow( obj ) ) {
			return false;
		}
	
		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}
	var Sizzle =
	/*!
	 * Sizzle CSS Selector Engine v2.3.3
	 * https://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2016-08-08
	 */
	(function( window ) {
	
	var i,
		support,
		Expr,
		getText,
		isXML,
		tokenize,
		compile,
		select,
		outermostContext,
		sortInput,
		hasDuplicate,
	
		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,
	
		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},
	
		// Instance methods
		hasOwn = ({}).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		push_native = arr.push,
		push = arr.push,
		slice = arr.slice,
		// Use a stripped-down indexOf as it's faster than native
		// https://jsperf.com/thor-indexof-vs-for/5
		indexOf = function( list, elem ) {
			var i = 0,
				len = list.length;
			for ( ; i < len; i++ ) {
				if ( list[i] === elem ) {
					return i;
				}
			}
			return -1;
		},
	
		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
	
		// Regular expressions
	
		// http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",
	
		// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
	
		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +
			// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
			"*\\]",
	
		pseudos = ":(" + identifier + ")(?:\\((" +
			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
			// 3. anything else (capture 2)
			".*" +
			")\\)|)",
	
		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp( whitespace + "+", "g" ),
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),
	
		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
	
		rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),
	
		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),
	
		matchExpr = {
			"ID": new RegExp( "^#(" + identifier + ")" ),
			"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
			"TAG": new RegExp( "^(" + identifier + "|[*])" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},
	
		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,
	
		rnative = /^[^{]+\{\s*\[native \w/,
	
		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
	
		rsibling = /[+~]/,
	
		// CSS escapes
		// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
		funescape = function( _, escaped, escapedWhitespace ) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox<24
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ?
				escaped :
				high < 0 ?
					// BMP codepoint
					String.fromCharCode( high + 0x10000 ) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		},
	
		// CSS string/identifier serialization
		// https://drafts.csswg.org/cssom/#common-serializing-idioms
		rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
		fcssescape = function( ch, asCodePoint ) {
			if ( asCodePoint ) {
	
				// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
				if ( ch === "\0" ) {
					return "\uFFFD";
				}
	
				// Control characters and (dependent upon position) numbers get escaped as code points
				return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
			}
	
			// Other potentially-special ASCII characters get backslash-escaped
			return "\\" + ch;
		},
	
		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function() {
			setDocument();
		},
	
		disabledAncestor = addCombinator(
			function( elem ) {
				return elem.disabled === true && ("form" in elem || "label" in elem);
			},
			{ dir: "parentNode", next: "legend" }
		);
	
	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			(arr = slice.call( preferredDoc.childNodes )),
			preferredDoc.childNodes
		);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?
	
			// Leverage slice if possible
			function( target, els ) {
				push_native.apply( target, slice.call(els) );
			} :
	
			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
				// Can't trust NodeList.length
				while ( (target[j++] = els[i++]) ) {}
				target.length = j - 1;
			}
		};
	}
	
	function Sizzle( selector, context, results, seed ) {
		var m, i, elem, nid, match, groups, newSelector,
			newContext = context && context.ownerDocument,
	
			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9;
	
		results = results || [];
	
		// Return early from calls with invalid selector or context
		if ( typeof selector !== "string" || !selector ||
			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {
	
			return results;
		}
	
		// Try to shortcut find operations (as opposed to filters) in HTML documents
		if ( !seed ) {
	
			if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
				setDocument( context );
			}
			context = context || document;
	
			if ( documentIsHTML ) {
	
				// If the selector is sufficiently simple, try using a "get*By*" DOM method
				// (excepting DocumentFragment context, where the methods don't exist)
				if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
	
					// ID selector
					if ( (m = match[1]) ) {
	
						// Document context
						if ( nodeType === 9 ) {
							if ( (elem = context.getElementById( m )) ) {
	
								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if ( elem.id === m ) {
									results.push( elem );
									return results;
								}
							} else {
								return results;
							}
	
						// Element context
						} else {
	
							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( newContext && (elem = newContext.getElementById( m )) &&
								contains( context, elem ) &&
								elem.id === m ) {
	
								results.push( elem );
								return results;
							}
						}
	
					// Type selector
					} else if ( match[2] ) {
						push.apply( results, context.getElementsByTagName( selector ) );
						return results;
	
					// Class selector
					} else if ( (m = match[3]) && support.getElementsByClassName &&
						context.getElementsByClassName ) {
	
						push.apply( results, context.getElementsByClassName( m ) );
						return results;
					}
				}
	
				// Take advantage of querySelectorAll
				if ( support.qsa &&
					!compilerCache[ selector + " " ] &&
					(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
	
					if ( nodeType !== 1 ) {
						newContext = context;
						newSelector = selector;
	
					// qSA looks outside Element context, which is not what we want
					// Thanks to Andrew Dupont for this workaround technique
					// Support: IE <=8
					// Exclude object elements
					} else if ( context.nodeName.toLowerCase() !== "object" ) {
	
						// Capture the context ID, setting it first if necessary
						if ( (nid = context.getAttribute( "id" )) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", (nid = expando) );
						}
	
						// Prefix every selector in the list
						groups = tokenize( selector );
						i = groups.length;
						while ( i-- ) {
							groups[i] = "#" + nid + " " + toSelector( groups[i] );
						}
						newSelector = groups.join( "," );
	
						// Expand context for sibling selectors
						newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
							context;
					}
	
					if ( newSelector ) {
						try {
							push.apply( results,
								newContext.querySelectorAll( newSelector )
							);
							return results;
						} catch ( qsaError ) {
						} finally {
							if ( nid === expando ) {
								context.removeAttribute( "id" );
							}
						}
					}
				}
			}
		}
	
		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}
	
	/**
	 * Create key-value caches of limited size
	 * @returns {function(string, object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var keys = [];
	
		function cache( key, value ) {
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key + " " ] = value);
		}
		return cache;
	}
	
	/**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}
	
	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created element and returns a boolean result
	 */
	function assert( fn ) {
		var el = document.createElement("fieldset");
	
		try {
			return !!fn( el );
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if ( el.parentNode ) {
				el.parentNode.removeChild( el );
			}
			// release memory in IE
			el = null;
		}
	}
	
	/**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split("|"),
			i = arr.length;
	
		while ( i-- ) {
			Expr.attrHandle[ arr[i] ] = handler;
		}
	}
	
	/**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				a.sourceIndex - b.sourceIndex;
	
		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}
	
		// Check if b follows a
		if ( cur ) {
			while ( (cur = cur.nextSibling) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}
	
		return a ? 1 : -1;
	}
	
	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for :enabled/:disabled
	 * @param {Boolean} disabled true for :disabled; false for :enabled
	 */
	function createDisabledPseudo( disabled ) {
	
		// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
		return function( elem ) {
	
			// Only certain elements can match :enabled or :disabled
			// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
			// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
			if ( "form" in elem ) {
	
				// Check for inherited disabledness on relevant non-disabled elements:
				// * listed form-associated elements in a disabled fieldset
				//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
				//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
				// * option elements in a disabled optgroup
				//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
				// All such elements have a "form" property.
				if ( elem.parentNode && elem.disabled === false ) {
	
					// Option elements defer to a parent optgroup if present
					if ( "label" in elem ) {
						if ( "label" in elem.parentNode ) {
							return elem.parentNode.disabled === disabled;
						} else {
							return elem.disabled === disabled;
						}
					}
	
					// Support: IE 6 - 11
					// Use the isDisabled shortcut property to check for disabled fieldset ancestors
					return elem.isDisabled === disabled ||
	
						// Where there is no isDisabled, check manually
						/* jshint -W018 */
						elem.isDisabled !== !disabled &&
							disabledAncestor( elem ) === disabled;
				}
	
				return elem.disabled === disabled;
	
			// Try to winnow out elements that can't be disabled before trusting the disabled property.
			// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
			// even exist on them, let alone have a boolean value.
			} else if ( "label" in elem ) {
				return elem.disabled === disabled;
			}
	
			// Remaining elements are neither :enabled nor :disabled
			return false;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction(function( argument ) {
			argument = +argument;
			return markFunction(function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;
	
				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ (j = matchIndexes[i]) ] ) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}
	
	/**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}
	
	// Expose support vars for convenience
	support = Sizzle.support = {};
	
	/**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};
	
	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare, subWindow,
			doc = node ? node.ownerDocument || node : preferredDoc;
	
		// Return early if doc is invalid or already selected
		if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}
	
		// Update global variables
		document = doc;
		docElem = document.documentElement;
		documentIsHTML = !isXML( document );
	
		// Support: IE 9-11, Edge
		// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
		if ( preferredDoc !== document &&
			(subWindow = document.defaultView) && subWindow.top !== subWindow ) {
	
			// Support: IE 11, Edge
			if ( subWindow.addEventListener ) {
				subWindow.addEventListener( "unload", unloadHandler, false );
	
			// Support: IE 9 - 10 only
			} else if ( subWindow.attachEvent ) {
				subWindow.attachEvent( "onunload", unloadHandler );
			}
		}
	
		/* Attributes
		---------------------------------------------------------------------- */
	
		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function( el ) {
			el.className = "i";
			return !el.getAttribute("className");
		});
	
		/* getElement(s)By*
		---------------------------------------------------------------------- */
	
		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function( el ) {
			el.appendChild( document.createComment("") );
			return !el.getElementsByTagName("*").length;
		});
	
		// Support: IE<9
		support.getElementsByClassName = rnative.test( document.getElementsByClassName );
	
		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programmatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function( el ) {
			docElem.appendChild( el ).id = expando;
			return !document.getElementsByName || !document.getElementsByName( expando ).length;
		});
	
		// ID filter and find
		if ( support.getById ) {
			Expr.filter["ID"] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute("id") === attrId;
				};
			};
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var elem = context.getElementById( id );
					return elem ? [ elem ] : [];
				}
			};
		} else {
			Expr.filter["ID"] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== "undefined" &&
						elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};
	
			// Support: IE 6 - 7 only
			// getElementById is not reliable as a find shortcut
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var node, i, elems,
						elem = context.getElementById( id );
	
					if ( elem ) {
	
						// Verify the id attribute
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
	
						// Fall back on getElementsByName
						elems = context.getElementsByName( id );
						i = 0;
						while ( (elem = elems[i++]) ) {
							node = elem.getAttributeNode("id");
							if ( node && node.value === id ) {
								return [ elem ];
							}
						}
					}
	
					return [];
				}
			};
		}
	
		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( tag );
	
				// DocumentFragment nodes don't have gEBTN
				} else if ( support.qsa ) {
					return context.querySelectorAll( tag );
				}
			} :
	
			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
					results = context.getElementsByTagName( tag );
	
				// Filter out possible comments
				if ( tag === "*" ) {
					while ( (elem = results[i++]) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}
	
					return tmp;
				}
				return results;
			};
	
		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
			if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};
	
		/* QSA/matchesSelector
		---------------------------------------------------------------------- */
	
		// QSA and matchesSelector support
	
		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];
	
		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See https://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];
	
		if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function( el ) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// https://bugs.jquery.com/ticket/12359
				docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
					"<select id='" + expando + "-\r\\' msallowcapture=''>" +
					"<option selected=''></option></select>";
	
				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if ( el.querySelectorAll("[msallowcapture^='']").length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}
	
				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !el.querySelectorAll("[selected]").length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}
	
				// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
				if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
					rbuggyQSA.push("~=");
				}
	
				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !el.querySelectorAll(":checked").length ) {
					rbuggyQSA.push(":checked");
				}
	
				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibling-combinator selector` fails
				if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
					rbuggyQSA.push(".#.+[+~]");
				}
			});
	
			assert(function( el ) {
				el.innerHTML = "<a href='' disabled='disabled'></a>" +
					"<select disabled='disabled'><option/></select>";
	
				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = document.createElement("input");
				input.setAttribute( "type", "hidden" );
				el.appendChild( input ).setAttribute( "name", "D" );
	
				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( el.querySelectorAll("[name=d]").length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}
	
				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if ( el.querySelectorAll(":enabled").length !== 2 ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}
	
				// Support: IE9-11+
				// IE's :disabled selector does not pick up the children of disabled fieldsets
				docElem.appendChild( el ).disabled = true;
				if ( el.querySelectorAll(":disabled").length !== 2 ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}
	
				// Opera 10-11 does not throw on post-comma invalid pseudos
				el.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}
	
		if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
			docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector) )) ) {
	
			assert(function( el ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( el, "*" );
	
				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( el, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			});
		}
	
		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );
	
		/* Contains
		---------------------------------------------------------------------- */
		hasCompare = rnative.test( docElem.compareDocumentPosition );
	
		// Element contains another
		// Purposefully self-exclusive
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				));
			} :
			function( a, b ) {
				if ( b ) {
					while ( (b = b.parentNode) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};
	
		/* Sorting
		---------------------------------------------------------------------- */
	
		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {
	
			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}
	
			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}
	
			// Calculate position if both inputs belong to the same document
			compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :
	
				// Otherwise we know they are disconnected
				1;
	
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {
	
				// Choose the first element that is related to our preferred document
				if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
					return 1;
				}
	
				// Maintain original order
				return sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
			}
	
			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {
			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}
	
			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];
	
			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {
				return a === document ? -1 :
					b === document ? 1 :
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
	
			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}
	
			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( (cur = cur.parentNode) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( (cur = cur.parentNode) ) {
				bp.unshift( cur );
			}
	
			// Walk down the tree looking for a discrepancy
			while ( ap[i] === bp[i] ) {
				i++;
			}
	
			return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[i], bp[i] ) :
	
				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 :
				bp[i] === preferredDoc ? 1 :
				0;
		};
	
		return document;
	};
	
	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};
	
	Sizzle.matchesSelector = function( elem, expr ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}
	
		// Make sure that attribute selectors are quoted
		expr = expr.replace( rattributeQuotes, "='$1']" );
	
		if ( support.matchesSelector && documentIsHTML &&
			!compilerCache[ expr + " " ] &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {
	
			try {
				var ret = matches.call( elem, expr );
	
				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch (e) {}
		}
	
		return Sizzle( expr, document, null, [ elem ] ).length > 0;
	};
	
	Sizzle.contains = function( context, elem ) {
		// Set document vars if needed
		if ( ( context.ownerDocument || context ) !== document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};
	
	Sizzle.attr = function( elem, name ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}
	
		var fn = Expr.attrHandle[ name.toLowerCase() ],
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;
	
		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				(val = elem.getAttributeNode(name)) && val.specified ?
					val.value :
					null;
	};
	
	Sizzle.escape = function( sel ) {
		return (sel + "").replace( rcssescape, fcssescape );
	};
	
	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};
	
	/**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;
	
		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );
	
		if ( hasDuplicate ) {
			while ( (elem = results[i++]) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}
	
		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;
	
		return results;
	};
	
	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;
	
		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes
	
		return ret;
	};
	
	Expr = Sizzle.selectors = {
	
		// Can be adjusted by the user
		cacheLength: 50,
	
		createPseudo: markFunction,
	
		match: matchExpr,
	
		attrHandle: {},
	
		find: {},
	
		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},
	
		preFilter: {
			"ATTR": function( match ) {
				match[1] = match[1].replace( runescape, funescape );
	
				// Move the given value to match[3] whether quoted or unquoted
				match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );
	
				if ( match[2] === "~=" ) {
					match[3] = " " + match[3] + " ";
				}
	
				return match.slice( 0, 4 );
			},
	
			"CHILD": function( match ) {
				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[1] = match[1].toLowerCase();
	
				if ( match[1].slice( 0, 3 ) === "nth" ) {
					// nth-* requires argument
					if ( !match[3] ) {
						Sizzle.error( match[0] );
					}
	
					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
					match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );
	
				// other types prohibit arguments
				} else if ( match[3] ) {
					Sizzle.error( match[0] );
				}
	
				return match;
			},
	
			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[6] && match[2];
	
				if ( matchExpr["CHILD"].test( match[0] ) ) {
					return null;
				}
	
				// Accept quoted arguments as-is
				if ( match[3] ) {
					match[2] = match[4] || match[5] || "";
	
				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {
	
					// excess is a negative index
					match[0] = match[0].slice( 0, excess );
					match[2] = unquoted.slice( 0, excess );
				}
	
				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},
	
		filter: {
	
			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() { return true; } :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},
	
			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];
	
				return pattern ||
					(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
					classCache( className, function( elem ) {
						return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
					});
			},
	
			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );
	
					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}
	
					result += "";
	
					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
				};
			},
	
			"CHILD": function( type, what, argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";
	
				return first === 1 && last === 0 ?
	
					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :
	
					function( elem, context, xml ) {
						var cache, uniqueCache, outerCache, node, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType,
							diff = false;
	
						if ( parent ) {
	
							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( (node = node[ dir ]) ) {
										if ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) {
	
											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}
	
							start = [ forward ? parent.firstChild : parent.lastChild ];
	
							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {
	
								// Seek `elem` from a previously-cached index
	
								// ...in a gzip-friendly way
								node = parent;
								outerCache = node[ expando ] || (node[ expando ] = {});
	
								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});
	
								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex && cache[ 2 ];
								node = nodeIndex && parent.childNodes[ nodeIndex ];
	
								while ( (node = ++nodeIndex && node && node[ dir ] ||
	
									// Fallback to seeking `elem` from the start
									(diff = nodeIndex = 0) || start.pop()) ) {
	
									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}
	
							} else {
								// Use previously-cached element index if available
								if ( useCache ) {
									// ...in a gzip-friendly way
									node = elem;
									outerCache = node[ expando ] || (node[ expando ] = {});
	
									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[ node.uniqueID ] ||
										(outerCache[ node.uniqueID ] = {});
	
									cache = uniqueCache[ type ] || [];
									nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
									diff = nodeIndex;
								}
	
								// xml :nth-child(...)
								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
								if ( diff === false ) {
									// Use the same loop as above to seek `elem` from the start
									while ( (node = ++nodeIndex && node && node[ dir ] ||
										(diff = nodeIndex = 0) || start.pop()) ) {
	
										if ( ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) &&
											++diff ) {
	
											// Cache the index of each encountered element
											if ( useCache ) {
												outerCache = node[ expando ] || (node[ expando ] = {});
	
												// Support: IE <9 only
												// Defend against cloned attroperties (jQuery gh-1709)
												uniqueCache = outerCache[ node.uniqueID ] ||
													(outerCache[ node.uniqueID ] = {});
	
												uniqueCache[ type ] = [ dirruns, diff ];
											}
	
											if ( node === elem ) {
												break;
											}
										}
									}
								}
							}
	
							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},
	
			"PSEUDO": function( pseudo, argument ) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );
	
				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}
	
				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction(function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf( seed, matched[i] );
								seed[ idx ] = !( matches[ idx ] = matched[i] );
							}
						}) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}
	
				return fn;
			}
		},
	
		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function( selector ) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );
	
				return matcher[ expando ] ?
					markFunction(function( seed, matches, context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;
	
						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( (elem = unmatched[i]) ) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) :
					function( elem, context, xml ) {
						input[0] = elem;
						matcher( input, null, xml, results );
						// Don't keep the element (issue #299)
						input[0] = null;
						return !results.pop();
					};
			}),
	
			"has": markFunction(function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			}),
	
			"contains": markFunction(function( text ) {
				text = text.replace( runescape, funescape );
				return function( elem ) {
					return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
				};
			}),
	
			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
				// lang value must be a valid identifier
				if ( !ridentifier.test(lang || "") ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( (elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {
	
							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
					return false;
				};
			}),
	
			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},
	
			"root": function( elem ) {
				return elem === docElem;
			},
	
			"focus": function( elem ) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},
	
			// Boolean properties
			"enabled": createDisabledPseudo( false ),
			"disabled": createDisabledPseudo( true ),
	
			"checked": function( elem ) {
				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
			},
	
			"selected": function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}
	
				return elem.selected === true;
			},
	
			// Contents
			"empty": function( elem ) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},
	
			"parent": function( elem ) {
				return !Expr.pseudos["empty"]( elem );
			},
	
			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},
	
			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},
	
			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},
	
			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&
	
					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
			},
	
			// Position-in-collection
			"first": createPositionalPseudo(function() {
				return [ 0 ];
			}),
	
			"last": createPositionalPseudo(function( matchIndexes, length ) {
				return [ length - 1 ];
			}),
	
			"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			}),
	
			"even": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"odd": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			})
		}
	};
	
	Expr.pseudos["nth"] = Expr.pseudos["eq"];
	
	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}
	
	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();
	
	tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];
	
		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}
	
		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;
	
		while ( soFar ) {
	
			// Comma and first run
			if ( !matched || (match = rcomma.exec( soFar )) ) {
				if ( match ) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[0].length ) || soFar;
				}
				groups.push( (tokens = []) );
			}
	
			matched = false;
	
			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace( rtrim, " " )
				});
				soFar = soFar.slice( matched.length );
			}
	
			// Filters
			for ( type in Expr.filter ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match ))) ) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice( matched.length );
				}
			}
	
			if ( !matched ) {
				break;
			}
		}
	
		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	};
	
	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[i].value;
		}
		return selector;
	}
	
	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			skip = combinator.next,
			key = skip || dir,
			checkNonElements = base && key === "parentNode",
			doneName = done++;
	
		return combinator.first ?
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
				return false;
			} :
	
			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var oldCache, uniqueCache, outerCache,
					newCache = [ dirruns, doneName ];
	
				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
				if ( xml ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || (elem[ expando ] = {});
	
							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});
	
							if ( skip && skip === elem.nodeName.toLowerCase() ) {
								elem = elem[ dir ] || elem;
							} else if ( (oldCache = uniqueCache[ key ]) &&
								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {
	
								// Assign to newCache so results back-propagate to previous elements
								return (newCache[ 2 ] = oldCache[ 2 ]);
							} else {
								// Reuse newcache so results back-propagate to previous elements
								uniqueCache[ key ] = newCache;
	
								// A match means we're done; a fail means we have to keep checking
								if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
									return true;
								}
							}
						}
					}
				}
				return false;
			};
	}
	
	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[i]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[0];
	}
	
	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[i], results );
		}
		return results;
	}
	
	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;
	
		for ( ; i < len; i++ ) {
			if ( (elem = unmatched[i]) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}
	
		return newUnmatched;
	}
	
	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction(function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,
	
				// Get initial elements from seed or context
				elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),
	
				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,
	
				matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?
	
						// ...intermediate processing is necessary
						[] :
	
						// ...otherwise use results directly
						results :
					matcherIn;
	
			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}
	
			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );
	
				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( (elem = temp[i]) ) {
						matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
					}
				}
			}
	
			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( (elem = matcherOut[i]) ) {
								// Restore matcherIn since elem is not yet a final match
								temp.push( (matcherIn[i] = elem) );
							}
						}
						postFinder( null, (matcherOut = []), temp, xml );
					}
	
					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) &&
							(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {
	
							seed[temp] = !(results[temp] = elem);
						}
					}
				}
	
			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		});
	}
	
	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[0].type ],
			implicitRelative = leadingRelative || Expr.relative[" "],
			i = leadingRelative ? 1 : 0,
	
			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			} ];
	
		for ( ; i < len; i++ ) {
			if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
				matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
			} else {
				matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );
	
				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[j].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(
							// If the preceding token was a descendant combinator, insert an implicit any-element `*`
							tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}
	
		return elementMatcher( matchers );
	}
	
	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		var bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,
					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
					len = elems.length;
	
				if ( outermost ) {
					outermostContext = context === document || context || outermost;
				}
	
				// Add elements passing elementMatchers directly to results
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
						if ( !context && elem.ownerDocument !== document ) {
							setDocument( elem );
							xml = !documentIsHTML;
						}
						while ( (matcher = elementMatchers[j++]) ) {
							if ( matcher( elem, context || document, xml) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
						}
					}
	
					// Track unmatched elements for set filters
					if ( bySet ) {
						// They will have gone through all possible matchers
						if ( (elem = !matcher && elem) ) {
							matchedCount--;
						}
	
						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}
	
				// `i` is now the count of elements visited above, and adding it to `matchedCount`
				// makes the latter nonnegative.
				matchedCount += i;
	
				// Apply set filters to unmatched elements
				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
				// no element matchers and no seed.
				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
				// numerically zero.
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( (matcher = setMatchers[j++]) ) {
						matcher( unmatched, setMatched, context, xml );
					}
	
					if ( seed ) {
						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !(unmatched[i] || setMatched[i]) ) {
									setMatched[i] = pop.call( results );
								}
							}
						}
	
						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}
	
					// Add matches to results
					push.apply( results, setMatched );
	
					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {
	
						Sizzle.uniqueSort( results );
					}
				}
	
				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}
	
				return unmatched;
			};
	
		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}
	
	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];
	
		if ( !cached ) {
			// Generate a function of recursive functions that can be used to check each element
			if ( !match ) {
				match = tokenize( selector );
			}
			i = match.length;
			while ( i-- ) {
				cached = matcherFromTokens( match[i] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}
	
			// Cache the compiled function
			cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	
			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};
	
	/**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */
	select = Sizzle.select = function( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			compiled = typeof selector === "function" && selector,
			match = !seed && tokenize( (selector = compiled.selector || selector) );
	
		results = results || [];
	
		// Try to minimize operations if there is only one selector in the list and no seed
		// (the latter of which guarantees us context)
		if ( match.length === 1 ) {
	
			// Reduce context if the leading compound selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {
	
				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
	
				// Precompiled matchers will still verify ancestry, so step up a level
				} else if ( compiled ) {
					context = context.parentNode;
				}
	
				selector = selector.slice( tokens.shift().value.length );
			}
	
			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];
	
				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
					)) ) {
	
						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}
	
						break;
					}
				}
			}
		}
	
		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		( compiled || compile( selector, match ) )(
			seed,
			context,
			!documentIsHTML,
			results,
			!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	};
	
	// One-time assignments
	
	// Sort stability
	support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;
	
	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;
	
	// Initialize against the default document
	setDocument();
	
	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( el ) {
		// Should return 1, but returns 4 (following)
		return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
	});
	
	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert(function( el ) {
		el.innerHTML = "<a href='#'></a>";
		return el.firstChild.getAttribute("href") === "#" ;
	}) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		});
	}
	
	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert(function( el ) {
		el.innerHTML = "<input/>";
		el.firstChild.setAttribute( "value", "" );
		return el.firstChild.getAttribute( "value" ) === "";
	}) ) {
		addHandle( "value", function( elem, name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		});
	}
	
	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert(function( el ) {
		return el.getAttribute("disabled") == null;
	}) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
						(val = elem.getAttributeNode( name )) && val.specified ?
						val.value :
					null;
			}
		});
	}
	
	return Sizzle;
	
	})( window );
	
	
	
	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	
	// Deprecated
	jQuery.expr[ ":" ] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;
	jQuery.escapeSelector = Sizzle.escape;
	
	
	
	
	var dir = function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;
	
		while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	};
	
	
	var siblings = function( n, elem ) {
		var matched = [];
	
		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}
	
		return matched;
	};
	
	
	var rneedsContext = jQuery.expr.match.needsContext;
	
	var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );
	
	
	
	var risSimple = /^.[^:#\[\.,]*$/;
	
	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, not ) {
		if ( jQuery.isFunction( qualifier ) ) {
			return jQuery.grep( elements, function( elem, i ) {
				return !!qualifier.call( elem, i, elem ) !== not;
			} );
		}
	
		// Single element
		if ( qualifier.nodeType ) {
			return jQuery.grep( elements, function( elem ) {
				return ( elem === qualifier ) !== not;
			} );
		}
	
		// Arraylike of elements (jQuery, arguments, Array)
		if ( typeof qualifier !== "string" ) {
			return jQuery.grep( elements, function( elem ) {
				return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
			} );
		}
	
		// Simple selector that can be filtered directly, removing non-Elements
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}
	
		// Complex selector, compare the two sets, removing non-Elements
		qualifier = jQuery.filter( qualifier, elements );
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
		} );
	}
	
	jQuery.filter = function( expr, elems, not ) {
		var elem = elems[ 0 ];
	
		if ( not ) {
			expr = ":not(" + expr + ")";
		}
	
		if ( elems.length === 1 && elem.nodeType === 1 ) {
			return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
		}
	
		return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
	};
	
	jQuery.fn.extend( {
		find: function( selector ) {
			var i, ret,
				len = this.length,
				self = this;
	
			if ( typeof selector !== "string" ) {
				return this.pushStack( jQuery( selector ).filter( function() {
					for ( i = 0; i < len; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				} ) );
			}
	
			ret = this.pushStack( [] );
	
			for ( i = 0; i < len; i++ ) {
				jQuery.find( selector, self[ i ], ret );
			}
	
			return len > 1 ? jQuery.uniqueSort( ret ) : ret;
		},
		filter: function( selector ) {
			return this.pushStack( winnow( this, selector || [], false ) );
		},
		not: function( selector ) {
			return this.pushStack( winnow( this, selector || [], true ) );
		},
		is: function( selector ) {
			return !!winnow(
				this,
	
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test( selector ) ?
					jQuery( selector ) :
					selector || [],
				false
			).length;
		}
	} );
	
	
	// Initialize a jQuery object
	
	
	// A central reference to the root jQuery(document)
	var rootjQuery,
	
		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		// Shortcut simple #id case for speed
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
	
		init = jQuery.fn.init = function( selector, context, root ) {
			var match, elem;
	
			// HANDLE: $(""), $(null), $(undefined), $(false)
			if ( !selector ) {
				return this;
			}
	
			// Method init() accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;
	
			// Handle HTML strings
			if ( typeof selector === "string" ) {
				if ( selector[ 0 ] === "<" &&
					selector[ selector.length - 1 ] === ">" &&
					selector.length >= 3 ) {
	
					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];
	
				} else {
					match = rquickExpr.exec( selector );
				}
	
				// Match html or make sure no context is specified for #id
				if ( match && ( match[ 1 ] || !context ) ) {
	
					// HANDLE: $(html) -> $(array)
					if ( match[ 1 ] ) {
						context = context instanceof jQuery ? context[ 0 ] : context;
	
						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge( this, jQuery.parseHTML(
							match[ 1 ],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );
	
						// HANDLE: $(html, props)
						if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
							for ( match in context ) {
	
								// Properties of context are called as methods if possible
								if ( jQuery.isFunction( this[ match ] ) ) {
									this[ match ]( context[ match ] );
	
								// ...and otherwise set as attributes
								} else {
									this.attr( match, context[ match ] );
								}
							}
						}
	
						return this;
	
					// HANDLE: $(#id)
					} else {
						elem = document.getElementById( match[ 2 ] );
	
						if ( elem ) {
	
							// Inject the element directly into the jQuery object
							this[ 0 ] = elem;
							this.length = 1;
						}
						return this;
					}
	
				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || root ).find( selector );
	
				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}
	
			// HANDLE: $(DOMElement)
			} else if ( selector.nodeType ) {
				this[ 0 ] = selector;
				this.length = 1;
				return this;
	
			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( jQuery.isFunction( selector ) ) {
				return root.ready !== undefined ?
					root.ready( selector ) :
	
					// Execute immediately if ready is not present
					selector( jQuery );
			}
	
			return jQuery.makeArray( selector, this );
		};
	
	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;
	
	// Initialize central reference
	rootjQuery = jQuery( document );
	
	
	var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	
		// Methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};
	
	jQuery.fn.extend( {
		has: function( target ) {
			var targets = jQuery( target, this ),
				l = targets.length;
	
			return this.filter( function() {
				var i = 0;
				for ( ; i < l; i++ ) {
					if ( jQuery.contains( this, targets[ i ] ) ) {
						return true;
					}
				}
			} );
		},
	
		closest: function( selectors, context ) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				targets = typeof selectors !== "string" && jQuery( selectors );
	
			// Positional selectors never match, since there's no _selection_ context
			if ( !rneedsContext.test( selectors ) ) {
				for ( ; i < l; i++ ) {
					for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {
	
						// Always skip document fragments
						if ( cur.nodeType < 11 && ( targets ?
							targets.index( cur ) > -1 :
	
							// Don't pass non-elements to Sizzle
							cur.nodeType === 1 &&
								jQuery.find.matchesSelector( cur, selectors ) ) ) {
	
							matched.push( cur );
							break;
						}
					}
				}
			}
	
			return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
		},
	
		// Determine the position of an element within the set
		index: function( elem ) {
	
			// No argument, return index in parent
			if ( !elem ) {
				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
			}
	
			// Index in selector
			if ( typeof elem === "string" ) {
				return indexOf.call( jQuery( elem ), this[ 0 ] );
			}
	
			// Locate the position of the desired element
			return indexOf.call( this,
	
				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[ 0 ] : elem
			);
		},
	
		add: function( selector, context ) {
			return this.pushStack(
				jQuery.uniqueSort(
					jQuery.merge( this.get(), jQuery( selector, context ) )
				)
			);
		},
	
		addBack: function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter( selector )
			);
		}
	} );
	
	function sibling( cur, dir ) {
		while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
		return cur;
	}
	
	jQuery.each( {
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) {
			return dir( elem, "parentNode" );
		},
		parentsUntil: function( elem, i, until ) {
			return dir( elem, "parentNode", until );
		},
		next: function( elem ) {
			return sibling( elem, "nextSibling" );
		},
		prev: function( elem ) {
			return sibling( elem, "previousSibling" );
		},
		nextAll: function( elem ) {
			return dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) {
			return dir( elem, "previousSibling" );
		},
		nextUntil: function( elem, i, until ) {
			return dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, i, until ) {
			return dir( elem, "previousSibling", until );
		},
		siblings: function( elem ) {
			return siblings( ( elem.parentNode || {} ).firstChild, elem );
		},
		children: function( elem ) {
			return siblings( elem.firstChild );
		},
		contents: function( elem ) {
			return elem.contentDocument || jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var matched = jQuery.map( this, fn, until );
	
			if ( name.slice( -5 ) !== "Until" ) {
				selector = until;
			}
	
			if ( selector && typeof selector === "string" ) {
				matched = jQuery.filter( selector, matched );
			}
	
			if ( this.length > 1 ) {
	
				// Remove duplicates
				if ( !guaranteedUnique[ name ] ) {
					jQuery.uniqueSort( matched );
				}
	
				// Reverse order for parents* and prev-derivatives
				if ( rparentsprev.test( name ) ) {
					matched.reverse();
				}
			}
	
			return this.pushStack( matched );
		};
	} );
	var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );
	
	
	
	// Convert String-formatted options into Object-formatted ones
	function createOptions( options ) {
		var object = {};
		jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		} );
		return object;
	}
	
	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {
	
		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			createOptions( options ) :
			jQuery.extend( {}, options );
	
		var // Flag to know if list is currently firing
			firing,
	
			// Last fire value for non-forgettable lists
			memory,
	
			// Flag to know if list was already fired
			fired,
	
			// Flag to prevent firing
			locked,
	
			// Actual callback list
			list = [],
	
			// Queue of execution data for repeatable lists
			queue = [],
	
			// Index of currently firing callback (modified by add/remove as needed)
			firingIndex = -1,
	
			// Fire callbacks
			fire = function() {
	
				// Enforce single-firing
				locked = options.once;
	
				// Execute callbacks for all pending executions,
				// respecting firingIndex overrides and runtime changes
				fired = firing = true;
				for ( ; queue.length; firingIndex = -1 ) {
					memory = queue.shift();
					while ( ++firingIndex < list.length ) {
	
						// Run callback and check for early termination
						if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
							options.stopOnFalse ) {
	
							// Jump to end and forget the data so .add doesn't re-fire
							firingIndex = list.length;
							memory = false;
						}
					}
				}
	
				// Forget the data if we're done with it
				if ( !options.memory ) {
					memory = false;
				}
	
				firing = false;
	
				// Clean up if we're done firing for good
				if ( locked ) {
	
					// Keep an empty list if we have data for future add calls
					if ( memory ) {
						list = [];
	
					// Otherwise, this object is spent
					} else {
						list = "";
					}
				}
			},
	
			// Actual Callbacks object
			self = {
	
				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {
	
						// If we have memory from a past run, we should fire after adding
						if ( memory && !firing ) {
							firingIndex = list.length - 1;
							queue.push( memory );
						}
	
						( function add( args ) {
							jQuery.each( args, function( _, arg ) {
								if ( jQuery.isFunction( arg ) ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {
	
									// Inspect recursively
									add( arg );
								}
							} );
						} )( arguments );
	
						if ( memory && !firing ) {
							fire();
						}
					}
					return this;
				},
	
				// Remove a callback from the list
				remove: function() {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
	
							// Handle firing indexes
							if ( index <= firingIndex ) {
								firingIndex--;
							}
						}
					} );
					return this;
				},
	
				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ?
						jQuery.inArray( fn, list ) > -1 :
						list.length > 0;
				},
	
				// Remove all callbacks from the list
				empty: function() {
					if ( list ) {
						list = [];
					}
					return this;
				},
	
				// Disable .fire and .add
				// Abort any current/pending executions
				// Clear all callbacks and values
				disable: function() {
					locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function() {
					return !list;
				},
	
				// Disable .fire
				// Also disable .add unless we have memory (since it would have no effect)
				// Abort any pending executions
				lock: function() {
					locked = queue = [];
					if ( !memory && !firing ) {
						list = memory = "";
					}
					return this;
				},
				locked: function() {
					return !!locked;
				},
	
				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( !locked ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						queue.push( args );
						if ( !firing ) {
							fire();
						}
					}
					return this;
				},
	
				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},
	
				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};
	
		return self;
	};
	
	
	function Identity( v ) {
		return v;
	}
	function Thrower( ex ) {
		throw ex;
	}
	
	function adoptValue( value, resolve, reject ) {
		var method;
	
		try {
	
			// Check for promise aspect first to privilege synchronous behavior
			if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
				method.call( value ).done( resolve ).fail( reject );
	
			// Other thenables
			} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
				method.call( value, resolve, reject );
	
			// Other non-thenables
			} else {
	
				// Support: Android 4.0 only
				// Strict mode functions invoked without .call/.apply get global-object context
				resolve.call( undefined, value );
			}
	
		// For Promises/A+, convert exceptions into rejections
		// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
		// Deferred#then to conditionally suppress rejection.
		} catch ( value ) {
	
			// Support: Android 4.0 only
			// Strict mode functions invoked without .call/.apply get global-object context
			reject.call( undefined, value );
		}
	}
	
	jQuery.extend( {
	
		Deferred: function( func ) {
			var tuples = [
	
					// action, add listener, callbacks,
					// ... .then handlers, argument index, [final state]
					[ "notify", "progress", jQuery.Callbacks( "memory" ),
						jQuery.Callbacks( "memory" ), 2 ],
					[ "resolve", "done", jQuery.Callbacks( "once memory" ),
						jQuery.Callbacks( "once memory" ), 0, "resolved" ],
					[ "reject", "fail", jQuery.Callbacks( "once memory" ),
						jQuery.Callbacks( "once memory" ), 1, "rejected" ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					"catch": function( fn ) {
						return promise.then( null, fn );
					},
	
					// Keep pipe for back-compat
					pipe: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;
	
						return jQuery.Deferred( function( newDefer ) {
							jQuery.each( tuples, function( i, tuple ) {
	
								// Map tuples (progress, done, fail) to arguments (done, fail, progress)
								var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];
	
								// deferred.progress(function() { bind to newDefer or newDefer.notify })
								// deferred.done(function() { bind to newDefer or newDefer.resolve })
								// deferred.fail(function() { bind to newDefer or newDefer.reject })
								deferred[ tuple[ 1 ] ]( function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.progress( newDefer.notify )
											.done( newDefer.resolve )
											.fail( newDefer.reject );
									} else {
										newDefer[ tuple[ 0 ] + "With" ](
											this,
											fn ? [ returned ] : arguments
										);
									}
								} );
							} );
							fns = null;
						} ).promise();
					},
					then: function( onFulfilled, onRejected, onProgress ) {
						var maxDepth = 0;
						function resolve( depth, deferred, handler, special ) {
							return function() {
								var that = this,
									args = arguments,
									mightThrow = function() {
										var returned, then;
	
										// Support: Promises/A+ section 2.3.3.3.3
										// https://promisesaplus.com/#point-59
										// Ignore double-resolution attempts
										if ( depth < maxDepth ) {
											return;
										}
	
										returned = handler.apply( that, args );
	
										// Support: Promises/A+ section 2.3.1
										// https://promisesaplus.com/#point-48
										if ( returned === deferred.promise() ) {
											throw new TypeError( "Thenable self-resolution" );
										}
	
										// Support: Promises/A+ sections 2.3.3.1, 3.5
										// https://promisesaplus.com/#point-54
										// https://promisesaplus.com/#point-75
										// Retrieve `then` only once
										then = returned &&
	
											// Support: Promises/A+ section 2.3.4
											// https://promisesaplus.com/#point-64
											// Only check objects and functions for thenability
											( typeof returned === "object" ||
												typeof returned === "function" ) &&
											returned.then;
	
										// Handle a returned thenable
										if ( jQuery.isFunction( then ) ) {
	
											// Special processors (notify) just wait for resolution
											if ( special ) {
												then.call(
													returned,
													resolve( maxDepth, deferred, Identity, special ),
													resolve( maxDepth, deferred, Thrower, special )
												);
	
											// Normal processors (resolve) also hook into progress
											} else {
	
												// ...and disregard older resolution values
												maxDepth++;
	
												then.call(
													returned,
													resolve( maxDepth, deferred, Identity, special ),
													resolve( maxDepth, deferred, Thrower, special ),
													resolve( maxDepth, deferred, Identity,
														deferred.notifyWith )
												);
											}
	
										// Handle all other returned values
										} else {
	
											// Only substitute handlers pass on context
											// and multiple values (non-spec behavior)
											if ( handler !== Identity ) {
												that = undefined;
												args = [ returned ];
											}
	
											// Process the value(s)
											// Default process is resolve
											( special || deferred.resolveWith )( that, args );
										}
									},
	
									// Only normal processors (resolve) catch and reject exceptions
									process = special ?
										mightThrow :
										function() {
											try {
												mightThrow();
											} catch ( e ) {
	
												if ( jQuery.Deferred.exceptionHook ) {
													jQuery.Deferred.exceptionHook( e,
														process.stackTrace );
												}
	
												// Support: Promises/A+ section 2.3.3.3.4.1
												// https://promisesaplus.com/#point-61
												// Ignore post-resolution exceptions
												if ( depth + 1 >= maxDepth ) {
	
													// Only substitute handlers pass on context
													// and multiple values (non-spec behavior)
													if ( handler !== Thrower ) {
														that = undefined;
														args = [ e ];
													}
	
													deferred.rejectWith( that, args );
												}
											}
										};
	
								// Support: Promises/A+ section 2.3.3.3.1
								// https://promisesaplus.com/#point-57
								// Re-resolve promises immediately to dodge false rejection from
								// subsequent errors
								if ( depth ) {
									process();
								} else {
	
									// Call an optional hook to record the stack, in case of exception
									// since it's otherwise lost when execution goes async
									if ( jQuery.Deferred.getStackHook ) {
										process.stackTrace = jQuery.Deferred.getStackHook();
									}
									window.setTimeout( process );
								}
							};
						}
	
						return jQuery.Deferred( function( newDefer ) {
	
							// progress_handlers.add( ... )
							tuples[ 0 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									jQuery.isFunction( onProgress ) ?
										onProgress :
										Identity,
									newDefer.notifyWith
								)
							);
	
							// fulfilled_handlers.add( ... )
							tuples[ 1 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									jQuery.isFunction( onFulfilled ) ?
										onFulfilled :
										Identity
								)
							);
	
							// rejected_handlers.add( ... )
							tuples[ 2 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									jQuery.isFunction( onRejected ) ?
										onRejected :
										Thrower
								)
							);
						} ).promise();
					},
	
					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};
	
			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 5 ];
	
				// promise.progress = list.add
				// promise.done = list.add
				// promise.fail = list.add
				promise[ tuple[ 1 ] ] = list.add;
	
				// Handle state
				if ( stateString ) {
					list.add(
						function() {
	
							// state = "resolved" (i.e., fulfilled)
							// state = "rejected"
							state = stateString;
						},
	
						// rejected_callbacks.disable
						// fulfilled_callbacks.disable
						tuples[ 3 - i ][ 2 ].disable,
	
						// progress_callbacks.lock
						tuples[ 0 ][ 2 ].lock
					);
				}
	
				// progress_handlers.fire
				// fulfilled_handlers.fire
				// rejected_handlers.fire
				list.add( tuple[ 3 ].fire );
	
				// deferred.notify = function() { deferred.notifyWith(...) }
				// deferred.resolve = function() { deferred.resolveWith(...) }
				// deferred.reject = function() { deferred.rejectWith(...) }
				deferred[ tuple[ 0 ] ] = function() {
					deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
					return this;
				};
	
				// deferred.notifyWith = list.fireWith
				// deferred.resolveWith = list.fireWith
				// deferred.rejectWith = list.fireWith
				deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
			} );
	
			// Make the deferred a promise
			promise.promise( deferred );
	
			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}
	
			// All done!
			return deferred;
		},
	
		// Deferred helper
		when: function( singleValue ) {
			var
	
				// count of uncompleted subordinates
				remaining = arguments.length,
	
				// count of unprocessed arguments
				i = remaining,
	
				// subordinate fulfillment data
				resolveContexts = Array( i ),
				resolveValues = slice.call( arguments ),
	
				// the master Deferred
				master = jQuery.Deferred(),
	
				// subordinate callback factory
				updateFunc = function( i ) {
					return function( value ) {
						resolveContexts[ i ] = this;
						resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( !( --remaining ) ) {
							master.resolveWith( resolveContexts, resolveValues );
						}
					};
				};
	
			// Single- and empty arguments are adopted like Promise.resolve
			if ( remaining <= 1 ) {
				adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject );
	
				// Use .then() to unwrap secondary thenables (cf. gh-3000)
				if ( master.state() === "pending" ||
					jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {
	
					return master.then();
				}
			}
	
			// Multiple arguments are aggregated like Promise.all array elements
			while ( i-- ) {
				adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
			}
	
			return master.promise();
		}
	} );
	
	
	// These usually indicate a programmer mistake during development,
	// warn about them ASAP rather than swallowing them by default.
	var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
	
	jQuery.Deferred.exceptionHook = function( error, stack ) {
	
		// Support: IE 8 - 9 only
		// Console exists when dev tools are open, which can happen at any time
		if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
			window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
		}
	};
	
	
	
	
	jQuery.readyException = function( error ) {
		window.setTimeout( function() {
			throw error;
		} );
	};
	
	
	
	
	// The deferred used on DOM ready
	var readyList = jQuery.Deferred();
	
	jQuery.fn.ready = function( fn ) {
	
		readyList
			.then( fn )
	
			// Wrap jQuery.readyException in a function so that the lookup
			// happens at the time of error handling instead of callback
			// registration.
			.catch( function( error ) {
				jQuery.readyException( error );
			} );
	
		return this;
	};
	
	jQuery.extend( {
	
		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,
	
		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,
	
		// Hold (or release) the ready event
		holdReady: function( hold ) {
			if ( hold ) {
				jQuery.readyWait++;
			} else {
				jQuery.ready( true );
			}
		},
	
		// Handle when the DOM is ready
		ready: function( wait ) {
	
			// Abort if there are pending holds or we're already ready
			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
				return;
			}
	
			// Remember that the DOM is ready
			jQuery.isReady = true;
	
			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}
	
			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );
		}
	} );
	
	jQuery.ready.then = readyList.then;
	
	// The ready event handler and self cleanup method
	function completed() {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );
		jQuery.ready();
	}
	
	// Catch cases where $(document).ready() is called
	// after the browser event has already occurred.
	// Support: IE <=9 - 10 only
	// Older IE sometimes signals "interactive" too soon
	if ( document.readyState === "complete" ||
		( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {
	
		// Handle it asynchronously to allow scripts the opportunity to delay ready
		window.setTimeout( jQuery.ready );
	
	} else {
	
		// Use the handy event callback
		document.addEventListener( "DOMContentLoaded", completed );
	
		// A fallback to window.onload, that will always work
		window.addEventListener( "load", completed );
	}
	
	
	
	
	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			len = elems.length,
			bulk = key == null;
	
		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				access( elems, fn, i, key[ i ], true, emptyGet, raw );
			}
	
		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;
	
			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}
	
			if ( bulk ) {
	
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;
	
				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}
	
			if ( fn ) {
				for ( ; i < len; i++ ) {
					fn(
						elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
					);
				}
			}
		}
	
		if ( chainable ) {
			return elems;
		}
	
		// Gets
		if ( bulk ) {
			return fn.call( elems );
		}
	
		return len ? fn( elems[ 0 ], key ) : emptyGet;
	};
	var acceptData = function( owner ) {
	
		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
	};
	
	
	
	
	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}
	
	Data.uid = 1;
	
	Data.prototype = {
	
		cache: function( owner ) {
	
			// Check if the owner object already has a cache
			var value = owner[ this.expando ];
	
			// If not, create one
			if ( !value ) {
				value = {};
	
				// We can accept data for non-element nodes in modern browsers,
				// but we should not, see #8335.
				// Always return an empty object.
				if ( acceptData( owner ) ) {
	
					// If it is a node unlikely to be stringify-ed or looped over
					// use plain assignment
					if ( owner.nodeType ) {
						owner[ this.expando ] = value;
	
					// Otherwise secure it in a non-enumerable property
					// configurable must be true to allow the property to be
					// deleted when data is removed
					} else {
						Object.defineProperty( owner, this.expando, {
							value: value,
							configurable: true
						} );
					}
				}
			}
	
			return value;
		},
		set: function( owner, data, value ) {
			var prop,
				cache = this.cache( owner );
	
			// Handle: [ owner, key, value ] args
			// Always use camelCase key (gh-2257)
			if ( typeof data === "string" ) {
				cache[ jQuery.camelCase( data ) ] = value;
	
			// Handle: [ owner, { properties } ] args
			} else {
	
				// Copy the properties one-by-one to the cache object
				for ( prop in data ) {
					cache[ jQuery.camelCase( prop ) ] = data[ prop ];
				}
			}
			return cache;
		},
		get: function( owner, key ) {
			return key === undefined ?
				this.cache( owner ) :
	
				// Always use camelCase key (gh-2257)
				owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
		},
		access: function( owner, key, value ) {
	
			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if ( key === undefined ||
					( ( key && typeof key === "string" ) && value === undefined ) ) {
	
				return this.get( owner, key );
			}
	
			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set( owner, key, value );
	
			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function( owner, key ) {
			var i,
				cache = owner[ this.expando ];
	
			if ( cache === undefined ) {
				return;
			}
	
			if ( key !== undefined ) {
	
				// Support array or space separated string of keys
				if ( jQuery.isArray( key ) ) {
	
					// If key is an array of keys...
					// We always set camelCase keys, so remove that.
					key = key.map( jQuery.camelCase );
				} else {
					key = jQuery.camelCase( key );
	
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					key = key in cache ?
						[ key ] :
						( key.match( rnothtmlwhite ) || [] );
				}
	
				i = key.length;
	
				while ( i-- ) {
					delete cache[ key[ i ] ];
				}
			}
	
			// Remove the expando if there's no more data
			if ( key === undefined || jQuery.isEmptyObject( cache ) ) {
	
				// Support: Chrome <=35 - 45
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
				if ( owner.nodeType ) {
					owner[ this.expando ] = undefined;
				} else {
					delete owner[ this.expando ];
				}
			}
		},
		hasData: function( owner ) {
			var cache = owner[ this.expando ];
			return cache !== undefined && !jQuery.isEmptyObject( cache );
		}
	};
	var dataPriv = new Data();
	
	var dataUser = new Data();
	
	
	
	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014
	
	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /[A-Z]/g;
	
	function getData( data ) {
		if ( data === "true" ) {
			return true;
		}
	
		if ( data === "false" ) {
			return false;
		}
	
		if ( data === "null" ) {
			return null;
		}
	
		// Only convert to a number if it doesn't change the string
		if ( data === +data + "" ) {
			return +data;
		}
	
		if ( rbrace.test( data ) ) {
			return JSON.parse( data );
		}
	
		return data;
	}
	
	function dataAttr( elem, key, data ) {
		var name;
	
		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {
			name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
			data = elem.getAttribute( name );
	
			if ( typeof data === "string" ) {
				try {
					data = getData( data );
				} catch ( e ) {}
	
				// Make sure we set the data so it isn't changed later
				dataUser.set( elem, key, data );
			} else {
				data = undefined;
			}
		}
		return data;
	}
	
	jQuery.extend( {
		hasData: function( elem ) {
			return dataUser.hasData( elem ) || dataPriv.hasData( elem );
		},
	
		data: function( elem, name, data ) {
			return dataUser.access( elem, name, data );
		},
	
		removeData: function( elem, name ) {
			dataUser.remove( elem, name );
		},
	
		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPriv methods, these can be deprecated.
		_data: function( elem, name, data ) {
			return dataPriv.access( elem, name, data );
		},
	
		_removeData: function( elem, name ) {
			dataPriv.remove( elem, name );
		}
	} );
	
	jQuery.fn.extend( {
		data: function( key, value ) {
			var i, name, data,
				elem = this[ 0 ],
				attrs = elem && elem.attributes;
	
			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = dataUser.get( elem );
	
					if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
						i = attrs.length;
						while ( i-- ) {
	
							// Support: IE 11 only
							// The attrs elements can be null (#14894)
							if ( attrs[ i ] ) {
								name = attrs[ i ].name;
								if ( name.indexOf( "data-" ) === 0 ) {
									name = jQuery.camelCase( name.slice( 5 ) );
									dataAttr( elem, name, data[ name ] );
								}
							}
						}
						dataPriv.set( elem, "hasDataAttrs", true );
					}
				}
	
				return data;
			}
	
			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each( function() {
					dataUser.set( this, key );
				} );
			}
	
			return access( this, function( value ) {
				var data;
	
				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if ( elem && value === undefined ) {
	
					// Attempt to get data from the cache
					// The key will always be camelCased in Data
					data = dataUser.get( elem, key );
					if ( data !== undefined ) {
						return data;
					}
	
					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr( elem, key );
					if ( data !== undefined ) {
						return data;
					}
	
					// We tried really hard, but the data doesn't exist.
					return;
				}
	
				// Set the data...
				this.each( function() {
	
					// We always store the camelCased key
					dataUser.set( this, key, value );
				} );
			}, null, value, arguments.length > 1, null, true );
		},
	
		removeData: function( key ) {
			return this.each( function() {
				dataUser.remove( this, key );
			} );
		}
	} );
	
	
	jQuery.extend( {
		queue: function( elem, type, data ) {
			var queue;
	
			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				queue = dataPriv.get( elem, type );
	
				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !queue || jQuery.isArray( data ) ) {
						queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
					} else {
						queue.push( data );
					}
				}
				return queue || [];
			}
		},
	
		dequeue: function( elem, type ) {
			type = type || "fx";
	
			var queue = jQuery.queue( elem, type ),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks( elem, type ),
				next = function() {
					jQuery.dequeue( elem, type );
				};
	
			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
				startLength--;
			}
	
			if ( fn ) {
	
				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}
	
				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call( elem, next, hooks );
			}
	
			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}
		},
	
		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function( elem, type ) {
			var key = type + "queueHooks";
			return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
				empty: jQuery.Callbacks( "once memory" ).add( function() {
					dataPriv.remove( elem, [ type + "queue", key ] );
				} )
			} );
		}
	} );
	
	jQuery.fn.extend( {
		queue: function( type, data ) {
			var setter = 2;
	
			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}
	
			if ( arguments.length < setter ) {
				return jQuery.queue( this[ 0 ], type );
			}
	
			return data === undefined ?
				this :
				this.each( function() {
					var queue = jQuery.queue( this, type, data );
	
					// Ensure a hooks for this queue
					jQuery._queueHooks( this, type );
	
					if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				} );
		},
		dequeue: function( type ) {
			return this.each( function() {
				jQuery.dequeue( this, type );
			} );
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},
	
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					if ( !( --count ) ) {
						defer.resolveWith( elements, [ elements ] );
					}
				};
	
			if ( typeof type !== "string" ) {
				obj = type;
				type = undefined;
			}
			type = type || "fx";
	
			while ( i-- ) {
				tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
				if ( tmp && tmp.empty ) {
					count++;
					tmp.empty.add( resolve );
				}
			}
			resolve();
			return defer.promise( obj );
		}
	} );
	var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;
	
	var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );
	
	
	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];
	
	var isHiddenWithinTree = function( elem, el ) {
	
			// isHiddenWithinTree might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;
	
			// Inline style trumps all
			return elem.style.display === "none" ||
				elem.style.display === "" &&
	
				// Otherwise, check computed style
				// Support: Firefox <=43 - 45
				// Disconnected elements can have computed display: none, so first confirm that elem is
				// in the document.
				jQuery.contains( elem.ownerDocument, elem ) &&
	
				jQuery.css( elem, "display" ) === "none";
		};
	
	var swap = function( elem, options, callback, args ) {
		var ret, name,
			old = {};
	
		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}
	
		ret = callback.apply( elem, args || [] );
	
		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	
		return ret;
	};
	
	
	
	
	function adjustCSS( elem, prop, valueParts, tween ) {
		var adjusted,
			scale = 1,
			maxIterations = 20,
			currentValue = tween ?
				function() {
					return tween.cur();
				} :
				function() {
					return jQuery.css( elem, prop, "" );
				},
			initial = currentValue(),
			unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),
	
			// Starting value computation is required for potential unit mismatches
			initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
				rcssNum.exec( jQuery.css( elem, prop ) );
	
		if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {
	
			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[ 3 ];
	
			// Make sure we update the tween properties later on
			valueParts = valueParts || [];
	
			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;
	
			do {
	
				// If previous iteration zeroed out, double until we get *something*.
				// Use string for doubling so we don't accidentally see scale as unchanged below
				scale = scale || ".5";
	
				// Adjust and apply
				initialInUnit = initialInUnit / scale;
				jQuery.style( elem, prop, initialInUnit + unit );
	
			// Update scale, tolerating zero or NaN from tween.cur()
			// Break the loop if scale is unchanged or perfect, or if we've just had enough.
			} while (
				scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
			);
		}
	
		if ( valueParts ) {
			initialInUnit = +initialInUnit || +initial || 0;
	
			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[ 1 ] ?
				initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
				+valueParts[ 2 ];
			if ( tween ) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}
	
	
	var defaultDisplayMap = {};
	
	function getDefaultDisplay( elem ) {
		var temp,
			doc = elem.ownerDocument,
			nodeName = elem.nodeName,
			display = defaultDisplayMap[ nodeName ];
	
		if ( display ) {
			return display;
		}
	
		temp = doc.body.appendChild( doc.createElement( nodeName ) );
		display = jQuery.css( temp, "display" );
	
		temp.parentNode.removeChild( temp );
	
		if ( display === "none" ) {
			display = "block";
		}
		defaultDisplayMap[ nodeName ] = display;
	
		return display;
	}
	
	function showHide( elements, show ) {
		var display, elem,
			values = [],
			index = 0,
			length = elements.length;
	
		// Determine new display value for elements that need to change
		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
	
			display = elem.style.display;
			if ( show ) {
	
				// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
				// check is required in this first loop unless we have a nonempty display value (either
				// inline or about-to-be-restored)
				if ( display === "none" ) {
					values[ index ] = dataPriv.get( elem, "display" ) || null;
					if ( !values[ index ] ) {
						elem.style.display = "";
					}
				}
				if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
					values[ index ] = getDefaultDisplay( elem );
				}
			} else {
				if ( display !== "none" ) {
					values[ index ] = "none";
	
					// Remember what we're overwriting
					dataPriv.set( elem, "display", display );
				}
			}
		}
	
		// Set the display of the elements in a second loop to avoid constant reflow
		for ( index = 0; index < length; index++ ) {
			if ( values[ index ] != null ) {
				elements[ index ].style.display = values[ index ];
			}
		}
	
		return elements;
	}
	
	jQuery.fn.extend( {
		show: function() {
			return showHide( this, true );
		},
		hide: function() {
			return showHide( this );
		},
		toggle: function( state ) {
			if ( typeof state === "boolean" ) {
				return state ? this.show() : this.hide();
			}
	
			return this.each( function() {
				if ( isHiddenWithinTree( this ) ) {
					jQuery( this ).show();
				} else {
					jQuery( this ).hide();
				}
			} );
		}
	} );
	var rcheckableType = ( /^(?:checkbox|radio)$/i );
	
	var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );
	
	var rscriptType = ( /^$|\/(?:java|ecma)script/i );
	
	
	
	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {
	
		// Support: IE <=9 only
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
	
		// XHTML parsers do not magically insert elements in the
		// same way that tag soup parsers do. So we cannot shorten
		// this by omitting <tbody> or other required elements.
		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
	
		_default: [ 0, "", "" ]
	};
	
	// Support: IE <=9 only
	wrapMap.optgroup = wrapMap.option;
	
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;
	
	
	function getAll( context, tag ) {
	
		// Support: IE <=9 - 11 only
		// Use typeof to avoid zero-argument method invocation on host objects (#15151)
		var ret;
	
		if ( typeof context.getElementsByTagName !== "undefined" ) {
			ret = context.getElementsByTagName( tag || "*" );
	
		} else if ( typeof context.querySelectorAll !== "undefined" ) {
			ret = context.querySelectorAll( tag || "*" );
	
		} else {
			ret = [];
		}
	
		if ( tag === undefined || tag && jQuery.nodeName( context, tag ) ) {
			return jQuery.merge( [ context ], ret );
		}
	
		return ret;
	}
	
	
	// Mark scripts as having already been evaluated
	function setGlobalEval( elems, refElements ) {
		var i = 0,
			l = elems.length;
	
		for ( ; i < l; i++ ) {
			dataPriv.set(
				elems[ i ],
				"globalEval",
				!refElements || dataPriv.get( refElements[ i ], "globalEval" )
			);
		}
	}
	
	
	var rhtml = /<|&#?\w+;/;
	
	function buildFragment( elems, context, scripts, selection, ignored ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;
	
		for ( ; i < l; i++ ) {
			elem = elems[ i ];
	
			if ( elem || elem === 0 ) {
	
				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
	
					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );
	
				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );
	
				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement( "div" ) );
	
					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];
	
					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}
	
					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, tmp.childNodes );
	
					// Remember the top-level container
					tmp = fragment.firstChild;
	
					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}
	
		// Remove wrapper from fragment
		fragment.textContent = "";
	
		i = 0;
		while ( ( elem = nodes[ i++ ] ) ) {
	
			// Skip elements already in the context collection (trac-4087)
			if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
				if ( ignored ) {
					ignored.push( elem );
				}
				continue;
			}
	
			contains = jQuery.contains( elem.ownerDocument, elem );
	
			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );
	
			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}
	
			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( ( elem = tmp[ j++ ] ) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}
	
		return fragment;
	}
	
	
	( function() {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild( document.createElement( "div" ) ),
			input = document.createElement( "input" );
	
		// Support: Android 4.0 - 4.3 only
		// Check state lost if the name is set (#11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input.setAttribute( "type", "radio" );
		input.setAttribute( "checked", "checked" );
		input.setAttribute( "name", "t" );
	
		div.appendChild( input );
	
		// Support: Android <=4.1 only
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;
	
		// Support: IE <=11 only
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
	} )();
	var documentElement = document.documentElement;
	
	
	
	var
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
	
	function returnTrue() {
		return true;
	}
	
	function returnFalse() {
		return false;
	}
	
	// Support: IE <=9 only
	// See #13393 for more info
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch ( err ) { }
	}
	
	function on( elem, types, selector, data, fn, one ) {
		var origFn, type;
	
		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
	
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
	
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				on( elem, type, selector, data, types[ type ], one );
			}
			return elem;
		}
	
		if ( data == null && fn == null ) {
	
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
	
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
	
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return elem;
		}
	
		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
	
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
	
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return elem.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		} );
	}
	
	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {
	
		global: {},
	
		add: function( elem, types, handler, data, selector ) {
	
			var handleObjIn, eventHandle, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.get( elem );
	
			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if ( !elemData ) {
				return;
			}
	
			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}
	
			// Ensure that invalid selectors throw exceptions at attach time
			// Evaluate against documentElement in case elem is a non-element node (e.g., document)
			if ( selector ) {
				jQuery.find.matchesSelector( documentElement, selector );
			}
	
			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}
	
			// Init the element's event structure and main handler, if this is the first
			if ( !( events = elemData.events ) ) {
				events = elemData.events = {};
			}
			if ( !( eventHandle = elemData.handle ) ) {
				eventHandle = elemData.handle = function( e ) {
	
					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
						jQuery.event.dispatch.apply( elem, arguments ) : undefined;
				};
			}
	
			// Handle multiple events separated by a space
			types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
	
				// There *must* be a type, no attaching namespace-only handlers
				if ( !type ) {
					continue;
				}
	
				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};
	
				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;
	
				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};
	
				// handleObj is passed to all event handlers
				handleObj = jQuery.extend( {
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
					namespace: namespaces.join( "." )
				}, handleObjIn );
	
				// Init the event handler queue if we're the first
				if ( !( handlers = events[ type ] ) ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;
	
					// Only use addEventListener if the special events handler returns false
					if ( !special.setup ||
						special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
	
						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle );
						}
					}
				}
	
				if ( special.add ) {
					special.add.call( elem, handleObj );
	
					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}
	
				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}
	
				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}
	
		},
	
		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {
	
			var j, origCount, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );
	
			if ( !elemData || !( events = elemData.events ) ) {
				return;
			}
	
			// Once for each type.namespace in types; type may be omitted
			types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
	
				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}
	
				special = jQuery.event.special[ type ] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				handlers = events[ type ] || [];
				tmp = tmp[ 2 ] &&
					new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );
	
				// Remove matching events
				origCount = j = handlers.length;
				while ( j-- ) {
					handleObj = handlers[ j ];
	
					if ( ( mappedTypes || origType === handleObj.origType ) &&
						( !handler || handler.guid === handleObj.guid ) &&
						( !tmp || tmp.test( handleObj.namespace ) ) &&
						( !selector || selector === handleObj.selector ||
							selector === "**" && handleObj.selector ) ) {
						handlers.splice( j, 1 );
	
						if ( handleObj.selector ) {
							handlers.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}
	
				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( origCount && !handlers.length ) {
					if ( !special.teardown ||
						special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
	
						jQuery.removeEvent( elem, type, elemData.handle );
					}
	
					delete events[ type ];
				}
			}
	
			// Remove data and the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				dataPriv.remove( elem, "handle events" );
			}
		},
	
		dispatch: function( nativeEvent ) {
	
			// Make a writable jQuery.Event from the native event object
			var event = jQuery.event.fix( nativeEvent );
	
			var i, j, ret, matched, handleObj, handlerQueue,
				args = new Array( arguments.length ),
				handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
				special = jQuery.event.special[ event.type ] || {};
	
			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[ 0 ] = event;
	
			for ( i = 1; i < arguments.length; i++ ) {
				args[ i ] = arguments[ i ];
			}
	
			event.delegateTarget = this;
	
			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}
	
			// Determine handlers
			handlerQueue = jQuery.event.handlers.call( this, event, handlers );
	
			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
				event.currentTarget = matched.elem;
	
				j = 0;
				while ( ( handleObj = matched.handlers[ j++ ] ) &&
					!event.isImmediatePropagationStopped() ) {
	
					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {
	
						event.handleObj = handleObj;
						event.data = handleObj.data;
	
						ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
							handleObj.handler ).apply( matched.elem, args );
	
						if ( ret !== undefined ) {
							if ( ( event.result = ret ) === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}
	
			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}
	
			return event.result;
		},
	
		handlers: function( event, handlers ) {
			var i, handleObj, sel, matchedHandlers, matchedSelectors,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;
	
			// Find delegate handlers
			if ( delegateCount &&
	
				// Support: IE <=9
				// Black-hole SVG <use> instance trees (trac-13180)
				cur.nodeType &&
	
				// Support: Firefox <=42
				// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
				// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
				// Support: IE 11 only
				// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
				!( event.type === "click" && event.button >= 1 ) ) {
	
				for ( ; cur !== this; cur = cur.parentNode || this ) {
	
					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
						matchedHandlers = [];
						matchedSelectors = {};
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];
	
							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";
	
							if ( matchedSelectors[ sel ] === undefined ) {
								matchedSelectors[ sel ] = handleObj.needsContext ?
									jQuery( sel, this ).index( cur ) > -1 :
									jQuery.find( sel, this, null, [ cur ] ).length;
							}
							if ( matchedSelectors[ sel ] ) {
								matchedHandlers.push( handleObj );
							}
						}
						if ( matchedHandlers.length ) {
							handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
						}
					}
				}
			}
	
			// Add the remaining (directly-bound) handlers
			cur = this;
			if ( delegateCount < handlers.length ) {
				handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
			}
	
			return handlerQueue;
		},
	
		addProp: function( name, hook ) {
			Object.defineProperty( jQuery.Event.prototype, name, {
				enumerable: true,
				configurable: true,
	
				get: jQuery.isFunction( hook ) ?
					function() {
						if ( this.originalEvent ) {
								return hook( this.originalEvent );
						}
					} :
					function() {
						if ( this.originalEvent ) {
								return this.originalEvent[ name ];
						}
					},
	
				set: function( value ) {
					Object.defineProperty( this, name, {
						enumerable: true,
						configurable: true,
						writable: true,
						value: value
					} );
				}
			} );
		},
	
		fix: function( originalEvent ) {
			return originalEvent[ jQuery.expando ] ?
				originalEvent :
				new jQuery.Event( originalEvent );
		},
	
		special: {
			load: {
	
				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {
	
				// Fire native event if possible so blur/focus sequence is correct
				trigger: function() {
					if ( this !== safeActiveElement() && this.focus ) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if ( this === safeActiveElement() && this.blur ) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {
	
				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
						this.click();
						return false;
					}
				},
	
				// For cross-browser consistency, don't fire native .click() on links
				_default: function( event ) {
					return jQuery.nodeName( event.target, "a" );
				}
			},
	
			beforeunload: {
				postDispatch: function( event ) {
	
					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if ( event.result !== undefined && event.originalEvent ) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		}
	};
	
	jQuery.removeEvent = function( elem, type, handle ) {
	
		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	};
	
	jQuery.Event = function( src, props ) {
	
		// Allow instantiation without the 'new' keyword
		if ( !( this instanceof jQuery.Event ) ) {
			return new jQuery.Event( src, props );
		}
	
		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;
	
			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&
	
					// Support: Android <=2.3 only
					src.returnValue === false ?
				returnTrue :
				returnFalse;
	
			// Create target properties
			// Support: Safari <=6 - 7 only
			// Target should not be a text node (#504, #13143)
			this.target = ( src.target && src.target.nodeType === 3 ) ?
				src.target.parentNode :
				src.target;
	
			this.currentTarget = src.currentTarget;
			this.relatedTarget = src.relatedTarget;
	
		// Event type
		} else {
			this.type = src;
		}
	
		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}
	
		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();
	
		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};
	
	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		isSimulated: false,
	
		preventDefault: function() {
			var e = this.originalEvent;
	
			this.isDefaultPrevented = returnTrue;
	
			if ( e && !this.isSimulated ) {
				e.preventDefault();
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;
	
			this.isPropagationStopped = returnTrue;
	
			if ( e && !this.isSimulated ) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;
	
			this.isImmediatePropagationStopped = returnTrue;
	
			if ( e && !this.isSimulated ) {
				e.stopImmediatePropagation();
			}
	
			this.stopPropagation();
		}
	};
	
	// Includes all common event props including KeyEvent and MouseEvent specific props
	jQuery.each( {
		altKey: true,
		bubbles: true,
		cancelable: true,
		changedTouches: true,
		ctrlKey: true,
		detail: true,
		eventPhase: true,
		metaKey: true,
		pageX: true,
		pageY: true,
		shiftKey: true,
		view: true,
		"char": true,
		charCode: true,
		key: true,
		keyCode: true,
		button: true,
		buttons: true,
		clientX: true,
		clientY: true,
		offsetX: true,
		offsetY: true,
		pointerId: true,
		pointerType: true,
		screenX: true,
		screenY: true,
		targetTouches: true,
		toElement: true,
		touches: true,
	
		which: function( event ) {
			var button = event.button;
	
			// Add which for key events
			if ( event.which == null && rkeyEvent.test( event.type ) ) {
				return event.charCode != null ? event.charCode : event.keyCode;
			}
	
			// Add which for click: 1 === left; 2 === middle; 3 === right
			if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
				if ( button & 1 ) {
					return 1;
				}
	
				if ( button & 2 ) {
					return 3;
				}
	
				if ( button & 4 ) {
					return 2;
				}
	
				return 0;
			}
	
			return event.which;
		}
	}, jQuery.event.addProp );
	
	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each( {
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,
	
			handle: function( event ) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;
	
				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	} );
	
	jQuery.fn.extend( {
	
		on: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn );
		},
		one: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			var handleObj, type;
			if ( types && types.preventDefault && types.handleObj ) {
	
				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ?
						handleObj.origType + "." + handleObj.namespace :
						handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {
	
				// ( types-object [, selector] )
				for ( type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {
	
				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each( function() {
				jQuery.event.remove( this, types, fn, selector );
			} );
		}
	} );
	
	
	var
	
		/* eslint-disable max-len */
	
		// See https://github.com/eslint/eslint/issues/3229
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
	
		/* eslint-enable */
	
		// Support: IE <=10 - 11, Edge 12 - 13
		// In IE/Edge using regex groups here causes severe slowdowns.
		// See https://connect.microsoft.com/IE/feedback/details/1736512/
		rnoInnerhtml = /<script|<style|<link/i,
	
		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
	
	function manipulationTarget( elem, content ) {
		if ( jQuery.nodeName( elem, "table" ) &&
			jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {
	
			return elem.getElementsByTagName( "tbody" )[ 0 ] || elem;
		}
	
		return elem;
	}
	
	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript( elem ) {
		elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
		return elem;
	}
	function restoreScript( elem ) {
		var match = rscriptTypeMasked.exec( elem.type );
	
		if ( match ) {
			elem.type = match[ 1 ];
		} else {
			elem.removeAttribute( "type" );
		}
	
		return elem;
	}
	
	function cloneCopyEvent( src, dest ) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;
	
		if ( dest.nodeType !== 1 ) {
			return;
		}
	
		// 1. Copy private data: events, handlers, etc.
		if ( dataPriv.hasData( src ) ) {
			pdataOld = dataPriv.access( src );
			pdataCur = dataPriv.set( dest, pdataOld );
			events = pdataOld.events;
	
			if ( events ) {
				delete pdataCur.handle;
				pdataCur.events = {};
	
				for ( type in events ) {
					for ( i = 0, l = events[ type ].length; i < l; i++ ) {
						jQuery.event.add( dest, type, events[ type ][ i ] );
					}
				}
			}
		}
	
		// 2. Copy user data
		if ( dataUser.hasData( src ) ) {
			udataOld = dataUser.access( src );
			udataCur = jQuery.extend( {}, udataOld );
	
			dataUser.set( dest, udataCur );
		}
	}
	
	// Fix IE bugs, see support tests
	function fixInput( src, dest ) {
		var nodeName = dest.nodeName.toLowerCase();
	
		// Fails to persist the checked state of a cloned checkbox or radio button.
		if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
			dest.checked = src.checked;
	
		// Fails to return the selected option to the default selected state when cloning options
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;
		}
	}
	
	function domManip( collection, args, callback, ignored ) {
	
		// Flatten any nested arrays
		args = concat.apply( [], args );
	
		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );
	
		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return collection.each( function( index ) {
				var self = collection.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				domManip( self, args, callback, ignored );
			} );
		}
	
		if ( l ) {
			fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
			first = fragment.firstChild;
	
			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}
	
			// Require either new content or an interest in ignored elements to invoke the callback
			if ( first || ignored ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;
	
				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;
	
					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );
	
						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
	
							// Support: Android <=4.0 only, PhantomJS 1 only
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}
	
					callback.call( collection[ i ], node, i );
				}
	
				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;
	
					// Reenable scripts
					jQuery.map( scripts, restoreScript );
	
					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!dataPriv.access( node, "globalEval" ) &&
							jQuery.contains( doc, node ) ) {
	
							if ( node.src ) {
	
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
							}
						}
					}
				}
			}
		}
	
		return collection;
	}
	
	function remove( elem, selector, keepData ) {
		var node,
			nodes = selector ? jQuery.filter( selector, elem ) : elem,
			i = 0;
	
		for ( ; ( node = nodes[ i ] ) != null; i++ ) {
			if ( !keepData && node.nodeType === 1 ) {
				jQuery.cleanData( getAll( node ) );
			}
	
			if ( node.parentNode ) {
				if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
					setGlobalEval( getAll( node, "script" ) );
				}
				node.parentNode.removeChild( node );
			}
		}
	
		return elem;
	}
	
	jQuery.extend( {
		htmlPrefilter: function( html ) {
			return html.replace( rxhtmlTag, "<$1></$2>" );
		},
	
		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var i, l, srcElements, destElements,
				clone = elem.cloneNode( true ),
				inPage = jQuery.contains( elem.ownerDocument, elem );
	
			// Fix IE cloning issues
			if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
					!jQuery.isXMLDoc( elem ) ) {
	
				// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
				destElements = getAll( clone );
				srcElements = getAll( elem );
	
				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					fixInput( srcElements[ i ], destElements[ i ] );
				}
			}
	
			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				if ( deepDataAndEvents ) {
					srcElements = srcElements || getAll( elem );
					destElements = destElements || getAll( clone );
	
					for ( i = 0, l = srcElements.length; i < l; i++ ) {
						cloneCopyEvent( srcElements[ i ], destElements[ i ] );
					}
				} else {
					cloneCopyEvent( elem, clone );
				}
			}
	
			// Preserve script evaluation history
			destElements = getAll( clone, "script" );
			if ( destElements.length > 0 ) {
				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
			}
	
			// Return the cloned set
			return clone;
		},
	
		cleanData: function( elems ) {
			var data, elem, type,
				special = jQuery.event.special,
				i = 0;
	
			for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
				if ( acceptData( elem ) ) {
					if ( ( data = elem[ dataPriv.expando ] ) ) {
						if ( data.events ) {
							for ( type in data.events ) {
								if ( special[ type ] ) {
									jQuery.event.remove( elem, type );
	
								// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent( elem, type, data.handle );
								}
							}
						}
	
						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataPriv.expando ] = undefined;
					}
					if ( elem[ dataUser.expando ] ) {
	
						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataUser.expando ] = undefined;
					}
				}
			}
		}
	} );
	
	jQuery.fn.extend( {
		detach: function( selector ) {
			return remove( this, selector, true );
		},
	
		remove: function( selector ) {
			return remove( this, selector );
		},
	
		text: function( value ) {
			return access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().each( function() {
						if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
							this.textContent = value;
						}
					} );
			}, null, value, arguments.length );
		},
	
		append: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.appendChild( elem );
				}
			} );
		},
	
		prepend: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.insertBefore( elem, target.firstChild );
				}
			} );
		},
	
		before: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this );
				}
			} );
		},
	
		after: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				}
			} );
		},
	
		empty: function() {
			var elem,
				i = 0;
	
			for ( ; ( elem = this[ i ] ) != null; i++ ) {
				if ( elem.nodeType === 1 ) {
	
					// Prevent memory leaks
					jQuery.cleanData( getAll( elem, false ) );
	
					// Remove any remaining nodes
					elem.textContent = "";
				}
			}
	
			return this;
		},
	
		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
	
			return this.map( function() {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			} );
		},
	
		html: function( value ) {
			return access( this, function( value ) {
				var elem = this[ 0 ] || {},
					i = 0,
					l = this.length;
	
				if ( value === undefined && elem.nodeType === 1 ) {
					return elem.innerHTML;
				}
	
				// See if we can take a shortcut and just use innerHTML
				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {
	
					value = jQuery.htmlPrefilter( value );
	
					try {
						for ( ; i < l; i++ ) {
							elem = this[ i ] || {};
	
							// Remove element nodes and prevent memory leaks
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( getAll( elem, false ) );
								elem.innerHTML = value;
							}
						}
	
						elem = 0;
	
					// If using innerHTML throws an exception, use the fallback method
					} catch ( e ) {}
				}
	
				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},
	
		replaceWith: function() {
			var ignored = [];
	
			// Make the changes, replacing each non-ignored context element with the new content
			return domManip( this, arguments, function( elem ) {
				var parent = this.parentNode;
	
				if ( jQuery.inArray( this, ignored ) < 0 ) {
					jQuery.cleanData( getAll( this ) );
					if ( parent ) {
						parent.replaceChild( elem, this );
					}
				}
	
			// Force callback invocation
			}, ignored );
		}
	} );
	
	jQuery.each( {
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var elems,
				ret = [],
				insert = jQuery( selector ),
				last = insert.length - 1,
				i = 0;
	
			for ( ; i <= last; i++ ) {
				elems = i === last ? this : this.clone( true );
				jQuery( insert[ i ] )[ original ]( elems );
	
				// Support: Android <=4.0 only, PhantomJS 1 only
				// .get() because push.apply(_, arraylike) throws on ancient WebKit
				push.apply( ret, elems.get() );
			}
	
			return this.pushStack( ret );
		};
	} );
	var rmargin = ( /^margin/ );
	
	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );
	
	var getStyles = function( elem ) {
	
			// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			var view = elem.ownerDocument.defaultView;
	
			if ( !view || !view.opener ) {
				view = window;
			}
	
			return view.getComputedStyle( elem );
		};
	
	
	
	( function() {
	
		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computeStyleTests() {
	
			// This is a singleton, we need to execute it only once
			if ( !div ) {
				return;
			}
	
			div.style.cssText =
				"box-sizing:border-box;" +
				"position:relative;display:block;" +
				"margin:auto;border:1px;padding:1px;" +
				"top:1%;width:50%";
			div.innerHTML = "";
			documentElement.appendChild( container );
	
			var divStyle = window.getComputedStyle( div );
			pixelPositionVal = divStyle.top !== "1%";
	
			// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
			reliableMarginLeftVal = divStyle.marginLeft === "2px";
			boxSizingReliableVal = divStyle.width === "4px";
	
			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = divStyle.marginRight === "4px";
	
			documentElement.removeChild( container );
	
			// Nullify the div so it wouldn't be stored in the memory and
			// it will also be a sign that checks already performed
			div = null;
		}
	
		var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
			container = document.createElement( "div" ),
			div = document.createElement( "div" );
	
		// Finish early in limited (non-browser) environments
		if ( !div.style ) {
			return;
		}
	
		// Support: IE <=9 - 11 only
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";
	
		container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
			"padding:0;margin-top:1px;position:absolute";
		container.appendChild( div );
	
		jQuery.extend( support, {
			pixelPosition: function() {
				computeStyleTests();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				computeStyleTests();
				return boxSizingReliableVal;
			},
			pixelMarginRight: function() {
				computeStyleTests();
				return pixelMarginRightVal;
			},
			reliableMarginLeft: function() {
				computeStyleTests();
				return reliableMarginLeftVal;
			}
		} );
	} )();
	
	
	function curCSS( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;
	
		computed = computed || getStyles( elem );
	
		// Support: IE <=9 only
		// getPropertyValue is only needed for .css('filter') (#12537)
		if ( computed ) {
			ret = computed.getPropertyValue( name ) || computed[ name ];
	
			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}
	
			// A tribute to the "awesome hack by Dean Edwards"
			// Android Browser returns percentage for some values,
			// but width seems to be reliably pixels.
			// This is against the CSSOM draft spec:
			// https://drafts.csswg.org/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {
	
				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;
	
				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;
	
				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}
	
		return ret !== undefined ?
	
			// Support: IE <=9 - 11 only
			// IE returns zIndex value as an integer.
			ret + "" :
			ret;
	}
	
	
	function addGetHookIf( conditionFn, hookFn ) {
	
		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function() {
				if ( conditionFn() ) {
	
					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}
	
				// Hook needed; redefine it so that the support test is not executed again.
				return ( this.get = hookFn ).apply( this, arguments );
			}
		};
	}
	
	
	var
	
		// Swappable if display is none or starts with table
		// except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},
	
		cssPrefixes = [ "Webkit", "Moz", "ms" ],
		emptyStyle = document.createElement( "div" ).style;
	
	// Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName( name ) {
	
		// Shortcut for names that are not vendor prefixed
		if ( name in emptyStyle ) {
			return name;
		}
	
		// Check for vendor prefixed names
		var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
			i = cssPrefixes.length;
	
		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in emptyStyle ) {
				return name;
			}
		}
	}
	
	function setPositiveNumber( elem, value, subtract ) {
	
		// Any relative (+/-) values have already been
		// normalized at this point
		var matches = rcssNum.exec( value );
		return matches ?
	
			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
			value;
	}
	
	function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
		var i,
			val = 0;
	
		// If we already have the right measurement, avoid augmentation
		if ( extra === ( isBorderBox ? "border" : "content" ) ) {
			i = 4;
	
		// Otherwise initialize for horizontal or vertical properties
		} else {
			i = name === "width" ? 1 : 0;
		}
	
		for ( ; i < 4; i += 2 ) {
	
			// Both box models exclude margin, so add it if we want it
			if ( extra === "margin" ) {
				val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
			}
	
			if ( isBorderBox ) {
	
				// border-box includes padding, so remove it if we want content
				if ( extra === "content" ) {
					val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
				}
	
				// At this point, extra isn't border nor margin, so remove border
				if ( extra !== "margin" ) {
					val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			} else {
	
				// At this point, extra isn't content, so add padding
				val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
	
				// At this point, extra isn't content nor padding, so add border
				if ( extra !== "padding" ) {
					val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			}
		}
	
		return val;
	}
	
	function getWidthOrHeight( elem, name, extra ) {
	
		// Start with offset property, which is equivalent to the border-box value
		var val,
			valueIsBorderBox = true,
			styles = getStyles( elem ),
			isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";
	
		// Support: IE <=11 only
		// Running getBoundingClientRect on a disconnected node
		// in IE throws an error.
		if ( elem.getClientRects().length ) {
			val = elem.getBoundingClientRect()[ name ];
		}
	
		// Some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if ( val <= 0 || val == null ) {
	
			// Fall back to computed then uncomputed css if necessary
			val = curCSS( elem, name, styles );
			if ( val < 0 || val == null ) {
				val = elem.style[ name ];
			}
	
			// Computed unit is not pixels. Stop here and return.
			if ( rnumnonpx.test( val ) ) {
				return val;
			}
	
			// Check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox &&
				( support.boxSizingReliable() || val === elem.style[ name ] );
	
			// Normalize "", auto, and prepare for extra
			val = parseFloat( val ) || 0;
		}
	
		// Use the active box-sizing model to add/subtract irrelevant styles
		return ( val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || ( isBorderBox ? "border" : "content" ),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}
	
	jQuery.extend( {
	
		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {
	
						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;
					}
				}
			}
		},
	
		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},
	
		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			"float": "cssFloat"
		},
	
		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {
	
			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}
	
			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = jQuery.camelCase( name ),
				style = elem.style;
	
			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );
	
			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;
	
				// Convert "+=" or "-=" to relative numbers (#7345)
				if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
					value = adjustCSS( elem, name, ret );
	
					// Fixes bug #9237
					type = "number";
				}
	
				// Make sure that null and NaN values aren't set (#7116)
				if ( value == null || value !== value ) {
					return;
				}
	
				// If a number was passed in, add the unit (except for certain CSS properties)
				if ( type === "number" ) {
					value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
				}
	
				// background-* props affect original clone's values
				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
					style[ name ] = "inherit";
				}
	
				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !( "set" in hooks ) ||
					( value = hooks.set( elem, value, extra ) ) !== undefined ) {
	
					style[ name ] = value;
				}
	
			} else {
	
				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks &&
					( ret = hooks.get( elem, false, extra ) ) !== undefined ) {
	
					return ret;
				}
	
				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},
	
		css: function( elem, name, extra, styles ) {
			var val, num, hooks,
				origName = jQuery.camelCase( name );
	
			// Make sure that we're working with the right name
			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );
	
			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks ) {
				val = hooks.get( elem, true, extra );
			}
	
			// Otherwise, if a way to get the computed value exists, use that
			if ( val === undefined ) {
				val = curCSS( elem, name, styles );
			}
	
			// Convert "normal" to computed value
			if ( val === "normal" && name in cssNormalTransform ) {
				val = cssNormalTransform[ name ];
			}
	
			// Make numeric if forced or a qualifier was provided and val looks numeric
			if ( extra === "" || extra ) {
				num = parseFloat( val );
				return extra === true || isFinite( num ) ? num || 0 : val;
			}
			return val;
		}
	} );
	
	jQuery.each( [ "height", "width" ], function( i, name ) {
		jQuery.cssHooks[ name ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {
	
					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
	
						// Support: Safari 8+
						// Table columns in Safari have non-zero offsetWidth & zero
						// getBoundingClientRect().width unless display is changed.
						// Support: IE <=11 only
						// Running getBoundingClientRect on a disconnected node
						// in IE throws an error.
						( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
							swap( elem, cssShow, function() {
								return getWidthOrHeight( elem, name, extra );
							} ) :
							getWidthOrHeight( elem, name, extra );
				}
			},
	
			set: function( elem, value, extra ) {
				var matches,
					styles = extra && getStyles( elem ),
					subtract = extra && augmentWidthOrHeight(
						elem,
						name,
						extra,
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
						styles
					);
	
				// Convert to pixels if value adjustment is needed
				if ( subtract && ( matches = rcssNum.exec( value ) ) &&
					( matches[ 3 ] || "px" ) !== "px" ) {
	
					elem.style[ name ] = value;
					value = jQuery.css( elem, name );
				}
	
				return setPositiveNumber( elem, value, subtract );
			}
		};
	} );
	
	jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
		function( elem, computed ) {
			if ( computed ) {
				return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} )
					) + "px";
			}
		}
	);
	
	// These hooks are used by animate to expand properties
	jQuery.each( {
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {
		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i = 0,
					expanded = {},
	
					// Assumes a single number if not a string
					parts = typeof value === "string" ? value.split( " " ) : [ value ];
	
				for ( ; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}
	
				return expanded;
			}
		};
	
		if ( !rmargin.test( prefix ) ) {
			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
		}
	} );
	
	jQuery.fn.extend( {
		css: function( name, value ) {
			return access( this, function( elem, name, value ) {
				var styles, len,
					map = {},
					i = 0;
	
				if ( jQuery.isArray( name ) ) {
					styles = getStyles( elem );
					len = name.length;
	
					for ( ; i < len; i++ ) {
						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
					}
	
					return map;
				}
	
				return value !== undefined ?
					jQuery.style( elem, name, value ) :
					jQuery.css( elem, name );
			}, name, value, arguments.length > 1 );
		}
	} );
	
	
	function Tween( elem, options, prop, end, easing ) {
		return new Tween.prototype.init( elem, options, prop, end, easing );
	}
	jQuery.Tween = Tween;
	
	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
		},
		cur: function() {
			var hooks = Tween.propHooks[ this.prop ];
	
			return hooks && hooks.get ?
				hooks.get( this ) :
				Tween.propHooks._default.get( this );
		},
		run: function( percent ) {
			var eased,
				hooks = Tween.propHooks[ this.prop ];
	
			if ( this.options.duration ) {
				this.pos = eased = jQuery.easing[ this.easing ](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = ( this.end - this.start ) * eased + this.start;
	
			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}
	
			if ( hooks && hooks.set ) {
				hooks.set( this );
			} else {
				Tween.propHooks._default.set( this );
			}
			return this;
		}
	};
	
	Tween.prototype.init.prototype = Tween.prototype;
	
	Tween.propHooks = {
		_default: {
			get: function( tween ) {
				var result;
	
				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if ( tween.elem.nodeType !== 1 ||
					tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
					return tween.elem[ tween.prop ];
				}
	
				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css( tween.elem, tween.prop, "" );
	
				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ) {
	
				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if ( jQuery.fx.step[ tween.prop ] ) {
					jQuery.fx.step[ tween.prop ]( tween );
				} else if ( tween.elem.nodeType === 1 &&
					( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
						jQuery.cssHooks[ tween.prop ] ) ) {
					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
				} else {
					tween.elem[ tween.prop ] = tween.now;
				}
			}
		}
	};
	
	// Support: IE <=9 only
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ) {
			if ( tween.elem.nodeType && tween.elem.parentNode ) {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	};
	
	jQuery.easing = {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return 0.5 - Math.cos( p * Math.PI ) / 2;
		},
		_default: "swing"
	};
	
	jQuery.fx = Tween.prototype.init;
	
	// Back compat <1.8 extension point
	jQuery.fx.step = {};
	
	
	
	
	var
		fxNow, timerId,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;
	
	function raf() {
		if ( timerId ) {
			window.requestAnimationFrame( raf );
			jQuery.fx.tick();
		}
	}
	
	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout( function() {
			fxNow = undefined;
		} );
		return ( fxNow = jQuery.now() );
	}
	
	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ) {
		var which,
			i = 0,
			attrs = { height: type };
	
		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for ( ; i < 4; i += 2 - includeWidth ) {
			which = cssExpand[ i ];
			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
		}
	
		if ( includeWidth ) {
			attrs.opacity = attrs.width = type;
		}
	
		return attrs;
	}
	
	function createTween( value, prop, animation ) {
		var tween,
			collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {
	
				// We're done with this property
				return tween;
			}
		}
	}
	
	function defaultPrefilter( elem, props, opts ) {
		var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
			isBox = "width" in props || "height" in props,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHiddenWithinTree( elem ),
			dataShow = dataPriv.get( elem, "fxshow" );
	
		// Queue-skipping animations hijack the fx hooks
		if ( !opts.queue ) {
			hooks = jQuery._queueHooks( elem, "fx" );
			if ( hooks.unqueued == null ) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function() {
					if ( !hooks.unqueued ) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;
	
			anim.always( function() {
	
				// Ensure the complete handler is called before this completes
				anim.always( function() {
					hooks.unqueued--;
					if ( !jQuery.queue( elem, "fx" ).length ) {
						hooks.empty.fire();
					}
				} );
			} );
		}
	
		// Detect show/hide animations
		for ( prop in props ) {
			value = props[ prop ];
			if ( rfxtypes.test( value ) ) {
				delete props[ prop ];
				toggle = toggle || value === "toggle";
				if ( value === ( hidden ? "hide" : "show" ) ) {
	
					// Pretend to be hidden if this is a "show" and
					// there is still data from a stopped show/hide
					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
						hidden = true;
	
					// Ignore all other no-op show/hide data
					} else {
						continue;
					}
				}
				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
			}
		}
	
		// Bail out if this is a no-op like .hide().hide()
		propTween = !jQuery.isEmptyObject( props );
		if ( !propTween && jQuery.isEmptyObject( orig ) ) {
			return;
		}
	
		// Restrict "overflow" and "display" styles during box animations
		if ( isBox && elem.nodeType === 1 ) {
	
			// Support: IE <=9 - 11, Edge 12 - 13
			// Record all 3 overflow attributes because IE does not infer the shorthand
			// from identically-valued overflowX and overflowY
			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];
	
			// Identify a display type, preferring old show/hide data over the CSS cascade
			restoreDisplay = dataShow && dataShow.display;
			if ( restoreDisplay == null ) {
				restoreDisplay = dataPriv.get( elem, "display" );
			}
			display = jQuery.css( elem, "display" );
			if ( display === "none" ) {
				if ( restoreDisplay ) {
					display = restoreDisplay;
				} else {
	
					// Get nonempty value(s) by temporarily forcing visibility
					showHide( [ elem ], true );
					restoreDisplay = elem.style.display || restoreDisplay;
					display = jQuery.css( elem, "display" );
					showHide( [ elem ] );
				}
			}
	
			// Animate inline elements as inline-block
			if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
				if ( jQuery.css( elem, "float" ) === "none" ) {
	
					// Restore the original display value at the end of pure show/hide animations
					if ( !propTween ) {
						anim.done( function() {
							style.display = restoreDisplay;
						} );
						if ( restoreDisplay == null ) {
							display = style.display;
							restoreDisplay = display === "none" ? "" : display;
						}
					}
					style.display = "inline-block";
				}
			}
		}
	
		if ( opts.overflow ) {
			style.overflow = "hidden";
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}
	
		// Implement show/hide animations
		propTween = false;
		for ( prop in orig ) {
	
			// General show/hide setup for this element animation
			if ( !propTween ) {
				if ( dataShow ) {
					if ( "hidden" in dataShow ) {
						hidden = dataShow.hidden;
					}
				} else {
					dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
				}
	
				// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
				if ( toggle ) {
					dataShow.hidden = !hidden;
				}
	
				// Show elements before animating them
				if ( hidden ) {
					showHide( [ elem ], true );
				}
	
				/* eslint-disable no-loop-func */
	
				anim.done( function() {
	
				/* eslint-enable no-loop-func */
	
					// The final step of a "hide" animation is actually hiding the element
					if ( !hidden ) {
						showHide( [ elem ] );
					}
					dataPriv.remove( elem, "fxshow" );
					for ( prop in orig ) {
						jQuery.style( elem, prop, orig[ prop ] );
					}
				} );
			}
	
			// Per-property setup
			propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = propTween.start;
				if ( hidden ) {
					propTween.end = propTween.start;
					propTween.start = 0;
				}
			}
		}
	}
	
	function propFilter( props, specialEasing ) {
		var index, name, easing, value, hooks;
	
		// camelCase, specialEasing and expand cssHook pass
		for ( index in props ) {
			name = jQuery.camelCase( index );
			easing = specialEasing[ name ];
			value = props[ index ];
			if ( jQuery.isArray( value ) ) {
				easing = value[ 1 ];
				value = props[ index ] = value[ 0 ];
			}
	
			if ( index !== name ) {
				props[ name ] = value;
				delete props[ index ];
			}
	
			hooks = jQuery.cssHooks[ name ];
			if ( hooks && "expand" in hooks ) {
				value = hooks.expand( value );
				delete props[ name ];
	
				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for ( index in value ) {
					if ( !( index in props ) ) {
						props[ index ] = value[ index ];
						specialEasing[ index ] = easing;
					}
				}
			} else {
				specialEasing[ name ] = easing;
			}
		}
	}
	
	function Animation( elem, properties, options ) {
		var result,
			stopped,
			index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always( function() {
	
				// Don't match elem in the :animated selector
				delete tick.elem;
			} ),
			tick = function() {
				if ( stopped ) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
	
					// Support: Android 2.3 only
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;
	
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( percent );
				}
	
				deferred.notifyWith( elem, [ animation, percent, remaining ] );
	
				if ( percent < 1 && length ) {
					return remaining;
				} else {
					deferred.resolveWith( elem, [ animation ] );
					return false;
				}
			},
			animation = deferred.promise( {
				elem: elem,
				props: jQuery.extend( {}, properties ),
				opts: jQuery.extend( true, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options ),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end ) {
					var tween = jQuery.Tween( elem, animation.opts, prop, end,
							animation.opts.specialEasing[ prop ] || animation.opts.easing );
					animation.tweens.push( tween );
					return tween;
				},
				stop: function( gotoEnd ) {
					var index = 0,
	
						// If we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if ( stopped ) {
						return this;
					}
					stopped = true;
					for ( ; index < length; index++ ) {
						animation.tweens[ index ].run( 1 );
					}
	
					// Resolve when we played the last frame; otherwise, reject
					if ( gotoEnd ) {
						deferred.notifyWith( elem, [ animation, 1, 0 ] );
						deferred.resolveWith( elem, [ animation, gotoEnd ] );
					} else {
						deferred.rejectWith( elem, [ animation, gotoEnd ] );
					}
					return this;
				}
			} ),
			props = animation.props;
	
		propFilter( props, animation.opts.specialEasing );
	
		for ( ; index < length; index++ ) {
			result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
			if ( result ) {
				if ( jQuery.isFunction( result.stop ) ) {
					jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
						jQuery.proxy( result.stop, result );
				}
				return result;
			}
		}
	
		jQuery.map( props, createTween, animation );
	
		if ( jQuery.isFunction( animation.opts.start ) ) {
			animation.opts.start.call( elem, animation );
		}
	
		jQuery.fx.timer(
			jQuery.extend( tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			} )
		);
	
		// attach callbacks from options
		return animation.progress( animation.opts.progress )
			.done( animation.opts.done, animation.opts.complete )
			.fail( animation.opts.fail )
			.always( animation.opts.always );
	}
	
	jQuery.Animation = jQuery.extend( Animation, {
	
		tweeners: {
			"*": [ function( prop, value ) {
				var tween = this.createTween( prop, value );
				adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
				return tween;
			} ]
		},
	
		tweener: function( props, callback ) {
			if ( jQuery.isFunction( props ) ) {
				callback = props;
				props = [ "*" ];
			} else {
				props = props.match( rnothtmlwhite );
			}
	
			var prop,
				index = 0,
				length = props.length;
	
			for ( ; index < length; index++ ) {
				prop = props[ index ];
				Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
				Animation.tweeners[ prop ].unshift( callback );
			}
		},
	
		prefilters: [ defaultPrefilter ],
	
		prefilter: function( callback, prepend ) {
			if ( prepend ) {
				Animation.prefilters.unshift( callback );
			} else {
				Animation.prefilters.push( callback );
			}
		}
	} );
	
	jQuery.speed = function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};
	
		// Go to the end state if fx are off or if document is hidden
		if ( jQuery.fx.off || document.hidden ) {
			opt.duration = 0;
	
		} else {
			if ( typeof opt.duration !== "number" ) {
				if ( opt.duration in jQuery.fx.speeds ) {
					opt.duration = jQuery.fx.speeds[ opt.duration ];
	
				} else {
					opt.duration = jQuery.fx.speeds._default;
				}
			}
		}
	
		// Normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}
	
		// Queueing
		opt.old = opt.complete;
	
		opt.complete = function() {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
	
			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			}
		};
	
		return opt;
	};
	
	jQuery.fn.extend( {
		fadeTo: function( speed, to, easing, callback ) {
	
			// Show any hidden elements after setting opacity to 0
			return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()
	
				// Animate to the value specified
				.end().animate( { opacity: to }, speed, easing, callback );
		},
		animate: function( prop, speed, easing, callback ) {
			var empty = jQuery.isEmptyObject( prop ),
				optall = jQuery.speed( speed, easing, callback ),
				doAnimation = function() {
	
					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation( this, jQuery.extend( {}, prop ), optall );
	
					// Empty animations, or finishing resolves immediately
					if ( empty || dataPriv.get( this, "finish" ) ) {
						anim.stop( true );
					}
				};
				doAnimation.finish = doAnimation;
	
			return empty || optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},
		stop: function( type, clearQueue, gotoEnd ) {
			var stopQueue = function( hooks ) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop( gotoEnd );
			};
	
			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue && type !== false ) {
				this.queue( type || "fx", [] );
			}
	
			return this.each( function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = dataPriv.get( this );
	
				if ( index ) {
					if ( data[ index ] && data[ index ].stop ) {
						stopQueue( data[ index ] );
					}
				} else {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
							stopQueue( data[ index ] );
						}
					}
				}
	
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this &&
						( type == null || timers[ index ].queue === type ) ) {
	
						timers[ index ].anim.stop( gotoEnd );
						dequeue = false;
						timers.splice( index, 1 );
					}
				}
	
				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if ( dequeue || !gotoEnd ) {
					jQuery.dequeue( this, type );
				}
			} );
		},
		finish: function( type ) {
			if ( type !== false ) {
				type = type || "fx";
			}
			return this.each( function() {
				var index,
					data = dataPriv.get( this ),
					queue = data[ type + "queue" ],
					hooks = data[ type + "queueHooks" ],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;
	
				// Enable finishing flag on private data
				data.finish = true;
	
				// Empty the queue first
				jQuery.queue( this, type, [] );
	
				if ( hooks && hooks.stop ) {
					hooks.stop.call( this, true );
				}
	
				// Look for any active animations, and finish them
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
						timers[ index ].anim.stop( true );
						timers.splice( index, 1 );
					}
				}
	
				// Look for any animations in the old queue and finish them
				for ( index = 0; index < length; index++ ) {
					if ( queue[ index ] && queue[ index ].finish ) {
						queue[ index ].finish.call( this );
					}
				}
	
				// Turn off finishing flag
				delete data.finish;
			} );
		}
	} );
	
	jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
		var cssFn = jQuery.fn[ name ];
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply( this, arguments ) :
				this.animate( genFx( name, true ), speed, easing, callback );
		};
	} );
	
	// Generate shortcuts for custom animations
	jQuery.each( {
		slideDown: genFx( "show" ),
		slideUp: genFx( "hide" ),
		slideToggle: genFx( "toggle" ),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	} );
	
	jQuery.timers = [];
	jQuery.fx.tick = function() {
		var timer,
			i = 0,
			timers = jQuery.timers;
	
		fxNow = jQuery.now();
	
		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
	
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}
	
		if ( !timers.length ) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};
	
	jQuery.fx.timer = function( timer ) {
		jQuery.timers.push( timer );
		if ( timer() ) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};
	
	jQuery.fx.interval = 13;
	jQuery.fx.start = function() {
		if ( !timerId ) {
			timerId = window.requestAnimationFrame ?
				window.requestAnimationFrame( raf ) :
				window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
		}
	};
	
	jQuery.fx.stop = function() {
		if ( window.cancelAnimationFrame ) {
			window.cancelAnimationFrame( timerId );
		} else {
			window.clearInterval( timerId );
		}
	
		timerId = null;
	};
	
	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,
	
		// Default speed
		_default: 400
	};
	
	
	// Based off of the plugin by Clint Helfers, with permission.
	// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";
	
		return this.queue( type, function( next, hooks ) {
			var timeout = window.setTimeout( next, time );
			hooks.stop = function() {
				window.clearTimeout( timeout );
			};
		} );
	};
	
	
	( function() {
		var input = document.createElement( "input" ),
			select = document.createElement( "select" ),
			opt = select.appendChild( document.createElement( "option" ) );
	
		input.type = "checkbox";
	
		// Support: Android <=4.3 only
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";
	
		// Support: IE <=11 only
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;
	
		// Support: IE <=11 only
		// An input loses its value after becoming a radio
		input = document.createElement( "input" );
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	} )();
	
	
	var boolHook,
		attrHandle = jQuery.expr.attrHandle;
	
	jQuery.fn.extend( {
		attr: function( name, value ) {
			return access( this, jQuery.attr, name, value, arguments.length > 1 );
		},
	
		removeAttr: function( name ) {
			return this.each( function() {
				jQuery.removeAttr( this, name );
			} );
		}
	} );
	
	jQuery.extend( {
		attr: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;
	
			// Don't get/set attributes on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}
	
			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === "undefined" ) {
				return jQuery.prop( elem, name, value );
			}
	
			// Attribute hooks are determined by the lowercase version
			// Grab necessary hook if one is defined
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
				hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
					( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
			}
	
			if ( value !== undefined ) {
				if ( value === null ) {
					jQuery.removeAttr( elem, name );
					return;
				}
	
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}
	
				elem.setAttribute( name, value + "" );
				return value;
			}
	
			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}
	
			ret = jQuery.find.attr( elem, name );
	
			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},
	
		attrHooks: {
			type: {
				set: function( elem, value ) {
					if ( !support.radioValue && value === "radio" &&
						jQuery.nodeName( elem, "input" ) ) {
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},
	
		removeAttr: function( elem, value ) {
			var name,
				i = 0,
	
				// Attribute names can contain non-HTML whitespace characters
				// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
				attrNames = value && value.match( rnothtmlwhite );
	
			if ( attrNames && elem.nodeType === 1 ) {
				while ( ( name = attrNames[ i++ ] ) ) {
					elem.removeAttribute( name );
				}
			}
		}
	} );
	
	// Hooks for boolean attributes
	boolHook = {
		set: function( elem, value, name ) {
			if ( value === false ) {
	
				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else {
				elem.setAttribute( name, name );
			}
			return name;
		}
	};
	
	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
		var getter = attrHandle[ name ] || jQuery.find.attr;
	
		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle,
				lowercaseName = name.toLowerCase();
	
			if ( !isXML ) {
	
				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ lowercaseName ];
				attrHandle[ lowercaseName ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					lowercaseName :
					null;
				attrHandle[ lowercaseName ] = handle;
			}
			return ret;
		};
	} );
	
	
	
	
	var rfocusable = /^(?:input|select|textarea|button)$/i,
		rclickable = /^(?:a|area)$/i;
	
	jQuery.fn.extend( {
		prop: function( name, value ) {
			return access( this, jQuery.prop, name, value, arguments.length > 1 );
		},
	
		removeProp: function( name ) {
			return this.each( function() {
				delete this[ jQuery.propFix[ name ] || name ];
			} );
		}
	} );
	
	jQuery.extend( {
		prop: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;
	
			// Don't get/set properties on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}
	
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
	
				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}
	
			if ( value !== undefined ) {
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}
	
				return ( elem[ name ] = value );
			}
	
			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}
	
			return elem[ name ];
		},
	
		propHooks: {
			tabIndex: {
				get: function( elem ) {
	
					// Support: IE <=9 - 11 only
					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr( elem, "tabindex" );
	
					if ( tabindex ) {
						return parseInt( tabindex, 10 );
					}
	
					if (
						rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) &&
						elem.href
					) {
						return 0;
					}
	
					return -1;
				}
			}
		},
	
		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	} );
	
	// Support: IE <=11 only
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	// eslint rule "no-unused-expressions" is disabled for this code
	// since it considers such accessions noop
	if ( !support.optSelected ) {
		jQuery.propHooks.selected = {
			get: function( elem ) {
	
				/* eslint no-unused-expressions: "off" */
	
				var parent = elem.parentNode;
				if ( parent && parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
				return null;
			},
			set: function( elem ) {
	
				/* eslint no-unused-expressions: "off" */
	
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;
	
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}
	
	jQuery.each( [
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[ this.toLowerCase() ] = this;
	} );
	
	
	
	
		// Strip and collapse whitespace according to HTML spec
		// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
		function stripAndCollapse( value ) {
			var tokens = value.match( rnothtmlwhite ) || [];
			return tokens.join( " " );
		}
	
	
	function getClass( elem ) {
		return elem.getAttribute && elem.getAttribute( "class" ) || "";
	}
	
	jQuery.fn.extend( {
		addClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
				} );
			}
	
			if ( typeof value === "string" && value ) {
				classes = value.match( rnothtmlwhite ) || [];
	
				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
					cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );
	
					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
							if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
								cur += clazz + " ";
							}
						}
	
						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}
	
			return this;
		},
	
		removeClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
				} );
			}
	
			if ( !arguments.length ) {
				return this.attr( "class", "" );
			}
	
			if ( typeof value === "string" && value ) {
				classes = value.match( rnothtmlwhite ) || [];
	
				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
	
					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );
	
					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
	
							// Remove *all* instances
							while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
								cur = cur.replace( " " + clazz + " ", " " );
							}
						}
	
						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}
	
			return this;
		},
	
		toggleClass: function( value, stateVal ) {
			var type = typeof value;
	
			if ( typeof stateVal === "boolean" && type === "string" ) {
				return stateVal ? this.addClass( value ) : this.removeClass( value );
			}
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( i ) {
					jQuery( this ).toggleClass(
						value.call( this, i, getClass( this ), stateVal ),
						stateVal
					);
				} );
			}
	
			return this.each( function() {
				var className, i, self, classNames;
	
				if ( type === "string" ) {
	
					// Toggle individual class names
					i = 0;
					self = jQuery( this );
					classNames = value.match( rnothtmlwhite ) || [];
	
					while ( ( className = classNames[ i++ ] ) ) {
	
						// Check each className given, space separated list
						if ( self.hasClass( className ) ) {
							self.removeClass( className );
						} else {
							self.addClass( className );
						}
					}
	
				// Toggle whole class name
				} else if ( value === undefined || type === "boolean" ) {
					className = getClass( this );
					if ( className ) {
	
						// Store className if set
						dataPriv.set( this, "__className__", className );
					}
	
					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					if ( this.setAttribute ) {
						this.setAttribute( "class",
							className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
						);
					}
				}
			} );
		},
	
		hasClass: function( selector ) {
			var className, elem,
				i = 0;
	
			className = " " + selector + " ";
			while ( ( elem = this[ i++ ] ) ) {
				if ( elem.nodeType === 1 &&
					( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
						return true;
				}
			}
	
			return false;
		}
	} );
	
	
	
	
	var rreturn = /\r/g;
	
	jQuery.fn.extend( {
		val: function( value ) {
			var hooks, ret, isFunction,
				elem = this[ 0 ];
	
			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] ||
						jQuery.valHooks[ elem.nodeName.toLowerCase() ];
	
					if ( hooks &&
						"get" in hooks &&
						( ret = hooks.get( elem, "value" ) ) !== undefined
					) {
						return ret;
					}
	
					ret = elem.value;
	
					// Handle most common string cases
					if ( typeof ret === "string" ) {
						return ret.replace( rreturn, "" );
					}
	
					// Handle cases where value is null/undef or number
					return ret == null ? "" : ret;
				}
	
				return;
			}
	
			isFunction = jQuery.isFunction( value );
	
			return this.each( function( i ) {
				var val;
	
				if ( this.nodeType !== 1 ) {
					return;
				}
	
				if ( isFunction ) {
					val = value.call( this, i, jQuery( this ).val() );
				} else {
					val = value;
				}
	
				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";
	
				} else if ( typeof val === "number" ) {
					val += "";
	
				} else if ( jQuery.isArray( val ) ) {
					val = jQuery.map( val, function( value ) {
						return value == null ? "" : value + "";
					} );
				}
	
				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];
	
				// If set returns undefined, fall back to normal setting
				if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			} );
		}
	} );
	
	jQuery.extend( {
		valHooks: {
			option: {
				get: function( elem ) {
	
					var val = jQuery.find.attr( elem, "value" );
					return val != null ?
						val :
	
						// Support: IE <=10 - 11 only
						// option.text throws exceptions (#14686, #14858)
						// Strip and collapse whitespace
						// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
						stripAndCollapse( jQuery.text( elem ) );
				}
			},
			select: {
				get: function( elem ) {
					var value, option, i,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one",
						values = one ? null : [],
						max = one ? index + 1 : options.length;
	
					if ( index < 0 ) {
						i = max;
	
					} else {
						i = one ? index : 0;
					}
	
					// Loop through all the selected options
					for ( ; i < max; i++ ) {
						option = options[ i ];
	
						// Support: IE <=9 only
						// IE8-9 doesn't update selected after form reset (#2551)
						if ( ( option.selected || i === index ) &&
	
								// Don't return options that are disabled or in a disabled optgroup
								!option.disabled &&
								( !option.parentNode.disabled ||
									!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {
	
							// Get the specific value for the option
							value = jQuery( option ).val();
	
							// We don't need an array for one selects
							if ( one ) {
								return value;
							}
	
							// Multi-Selects return an array
							values.push( value );
						}
					}
	
					return values;
				},
	
				set: function( elem, value ) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray( value ),
						i = options.length;
	
					while ( i-- ) {
						option = options[ i ];
	
						/* eslint-disable no-cond-assign */
	
						if ( option.selected =
							jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
						) {
							optionSet = true;
						}
	
						/* eslint-enable no-cond-assign */
					}
	
					// Force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	} );
	
	// Radios and checkboxes getter/setter
	jQuery.each( [ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			set: function( elem, value ) {
				if ( jQuery.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
				}
			}
		};
		if ( !support.checkOn ) {
			jQuery.valHooks[ this ].get = function( elem ) {
				return elem.getAttribute( "value" ) === null ? "on" : elem.value;
			};
		}
	} );
	
	
	
	
	// Return jQuery for attributes-only inclusion
	
	
	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;
	
	jQuery.extend( jQuery.event, {
	
		trigger: function( event, data, elem, onlyHandlers ) {
	
			var i, cur, tmp, bubbleType, ontype, handle, special,
				eventPath = [ elem || document ],
				type = hasOwn.call( event, "type" ) ? event.type : event,
				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];
	
			cur = tmp = elem = elem || document;
	
			// Don't do events on text and comment nodes
			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
				return;
			}
	
			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}
	
			if ( type.indexOf( "." ) > -1 ) {
	
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split( "." );
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf( ":" ) < 0 && "on" + type;
	
			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[ jQuery.expando ] ?
				event :
				new jQuery.Event( type, typeof event === "object" && event );
	
			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join( "." );
			event.rnamespace = event.namespace ?
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
				null;
	
			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}
	
			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[ event ] :
				jQuery.makeArray( data, [ event ] );
	
			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}
	
			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {
	
				bubbleType = special.delegateType || type;
				if ( !rfocusMorph.test( bubbleType + type ) ) {
					cur = cur.parentNode;
				}
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push( cur );
					tmp = cur;
				}
	
				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( tmp === ( elem.ownerDocument || document ) ) {
					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
				}
			}
	
			// Fire handlers on the event path
			i = 0;
			while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
	
				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;
	
				// jQuery handler
				handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
					dataPriv.get( cur, "handle" );
				if ( handle ) {
					handle.apply( cur, data );
				}
	
				// Native handler
				handle = ontype && cur[ ontype ];
				if ( handle && handle.apply && acceptData( cur ) ) {
					event.result = handle.apply( cur, data );
					if ( event.result === false ) {
						event.preventDefault();
					}
				}
			}
			event.type = type;
	
			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {
	
				if ( ( !special._default ||
					special._default.apply( eventPath.pop(), data ) === false ) &&
					acceptData( elem ) ) {
	
					// Call a native DOM method on the target with the same name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {
	
						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ ontype ];
	
						if ( tmp ) {
							elem[ ontype ] = null;
						}
	
						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[ type ]();
						jQuery.event.triggered = undefined;
	
						if ( tmp ) {
							elem[ ontype ] = tmp;
						}
					}
				}
			}
	
			return event.result;
		},
	
		// Piggyback on a donor event to simulate a different one
		// Used only for `focus(in | out)` events
		simulate: function( type, elem, event ) {
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true
				}
			);
	
			jQuery.event.trigger( e, null, elem );
		}
	
	} );
	
	jQuery.fn.extend( {
	
		trigger: function( type, data ) {
			return this.each( function() {
				jQuery.event.trigger( type, data, this );
			} );
		},
		triggerHandler: function( type, data ) {
			var elem = this[ 0 ];
			if ( elem ) {
				return jQuery.event.trigger( type, data, elem, true );
			}
		}
	} );
	
	
	jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup contextmenu" ).split( " " ),
		function( i, name ) {
	
		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );
	
	jQuery.fn.extend( {
		hover: function( fnOver, fnOut ) {
			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
		}
	} );
	
	
	
	
	support.focusin = "onfocusin" in window;
	
	
	// Support: Firefox <=44
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	if ( !support.focusin ) {
		jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {
	
			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
			};
	
			jQuery.event.special[ fix ] = {
				setup: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access( doc, fix );
	
					if ( !attaches ) {
						doc.addEventListener( orig, handler, true );
					}
					dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
				},
				teardown: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access( doc, fix ) - 1;
	
					if ( !attaches ) {
						doc.removeEventListener( orig, handler, true );
						dataPriv.remove( doc, fix );
	
					} else {
						dataPriv.access( doc, fix, attaches );
					}
				}
			};
		} );
	}
	var location = window.location;
	
	var nonce = jQuery.now();
	
	var rquery = ( /\?/ );
	
	
	
	// Cross-browser xml parsing
	jQuery.parseXML = function( data ) {
		var xml;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
	
		// Support: IE 9 - 11 only
		// IE throws on parseFromString with invalid input.
		try {
			xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}
	
		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	};
	
	
	var
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;
	
	function buildParams( prefix, obj, traditional, add ) {
		var name;
	
		if ( jQuery.isArray( obj ) ) {
	
			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {
	
					// Treat each array item as a scalar.
					add( prefix, v );
	
				} else {
	
					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(
						prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
						v,
						traditional,
						add
					);
				}
			} );
	
		} else if ( !traditional && jQuery.type( obj ) === "object" ) {
	
			// Serialize object item.
			for ( name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}
	
		} else {
	
			// Serialize scalar item.
			add( prefix, obj );
		}
	}
	
	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function( a, traditional ) {
		var prefix,
			s = [],
			add = function( key, valueOrFunction ) {
	
				// If value is a function, invoke it and use its return value
				var value = jQuery.isFunction( valueOrFunction ) ?
					valueOrFunction() :
					valueOrFunction;
	
				s[ s.length ] = encodeURIComponent( key ) + "=" +
					encodeURIComponent( value == null ? "" : value );
			};
	
		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
	
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );
	
		} else {
	
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}
	
		// Return the resulting serialization
		return s.join( "&" );
	};
	
	jQuery.fn.extend( {
		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},
		serializeArray: function() {
			return this.map( function() {
	
				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop( this, "elements" );
				return elements ? jQuery.makeArray( elements ) : this;
			} )
			.filter( function() {
				var type = this.type;
	
				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			} )
			.map( function( i, elem ) {
				var val = jQuery( this ).val();
	
				if ( val == null ) {
					return null;
				}
	
				if ( jQuery.isArray( val ) ) {
					return jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} );
				}
	
				return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			} ).get();
		}
	} );
	
	
	var
		r20 = /%20/g,
		rhash = /#.*$/,
		rantiCache = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	
		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,
	
		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},
	
		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},
	
		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat( "*" ),
	
		// Anchor tag for parsing the document origin
		originAnchor = document.createElement( "a" );
		originAnchor.href = location.href;
	
	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {
	
		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {
	
			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}
	
			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];
	
			if ( jQuery.isFunction( func ) ) {
	
				// For each dataType in the dataTypeExpression
				while ( ( dataType = dataTypes[ i++ ] ) ) {
	
					// Prepend if requested
					if ( dataType[ 0 ] === "+" ) {
						dataType = dataType.slice( 1 ) || "*";
						( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );
	
					// Otherwise append
					} else {
						( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
					}
				}
			}
		};
	}
	
	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {
	
		var inspected = {},
			seekingTransport = ( structure === transports );
	
		function inspect( dataType ) {
			var selected;
			inspected[ dataType ] = true;
			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
				if ( typeof dataTypeOrTransport === "string" &&
					!seekingTransport && !inspected[ dataTypeOrTransport ] ) {
	
					options.dataTypes.unshift( dataTypeOrTransport );
					inspect( dataTypeOrTransport );
					return false;
				} else if ( seekingTransport ) {
					return !( selected = dataTypeOrTransport );
				}
			} );
			return selected;
		}
	
		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	}
	
	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ) {
		var key, deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};
	
		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}
	
		return target;
	}
	
	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {
	
		var ct, type, finalDataType, firstDataType,
			contents = s.contents,
			dataTypes = s.dataTypes;
	
		// Remove auto dataType and get content-type in the process
		while ( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
			}
		}
	
		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}
	
		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {
	
			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}
	
			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}
	
		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}
	
	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert( s, response, jqXHR, isSuccess ) {
		var conv2, current, conv, tmp, prev,
			converters = {},
	
			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();
	
		// Create converters map with lowercased keys
		if ( dataTypes[ 1 ] ) {
			for ( conv in s.converters ) {
				converters[ conv.toLowerCase() ] = s.converters[ conv ];
			}
		}
	
		current = dataTypes.shift();
	
		// Convert to each sequential dataType
		while ( current ) {
	
			if ( s.responseFields[ current ] ) {
				jqXHR[ s.responseFields[ current ] ] = response;
			}
	
			// Apply the dataFilter if provided
			if ( !prev && isSuccess && s.dataFilter ) {
				response = s.dataFilter( response, s.dataType );
			}
	
			prev = current;
			current = dataTypes.shift();
	
			if ( current ) {
	
				// There's only work to do if current dataType is non-auto
				if ( current === "*" ) {
	
					current = prev;
	
				// Convert response if prev dataType is non-auto and differs from current
				} else if ( prev !== "*" && prev !== current ) {
	
					// Seek a direct converter
					conv = converters[ prev + " " + current ] || converters[ "* " + current ];
	
					// If none found, seek a pair
					if ( !conv ) {
						for ( conv2 in converters ) {
	
							// If conv2 outputs current
							tmp = conv2.split( " " );
							if ( tmp[ 1 ] === current ) {
	
								// If prev can be converted to accepted input
								conv = converters[ prev + " " + tmp[ 0 ] ] ||
									converters[ "* " + tmp[ 0 ] ];
								if ( conv ) {
	
									// Condense equivalence converters
									if ( conv === true ) {
										conv = converters[ conv2 ];
	
									// Otherwise, insert the intermediate dataType
									} else if ( converters[ conv2 ] !== true ) {
										current = tmp[ 0 ];
										dataTypes.unshift( tmp[ 1 ] );
									}
									break;
								}
							}
						}
					}
	
					// Apply converter (if not an equivalence)
					if ( conv !== true ) {
	
						// Unless errors are allowed to bubble, catch and return them
						if ( conv && s.throws ) {
							response = conv( response );
						} else {
							try {
								response = conv( response );
							} catch ( e ) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}
	
		return { state: "success", data: response };
	}
	
	jQuery.extend( {
	
		// Counter for holding the number of active queries
		active: 0,
	
		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},
	
		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test( location.protocol ),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
	
			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/
	
			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},
	
			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},
	
			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},
	
			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {
	
				// Convert anything to text
				"* text": String,
	
				// Text to html (true = no transformation)
				"text html": true,
	
				// Evaluate text as a json expression
				"text json": JSON.parse,
	
				// Parse text as xml
				"text xml": jQuery.parseXML
			},
	
			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},
	
		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			return settings ?
	
				// Building a settings object
				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :
	
				// Extending ajaxSettings
				ajaxExtend( jQuery.ajaxSettings, target );
		},
	
		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),
	
		// Main method
		ajax: function( url, options ) {
	
			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}
	
			// Force options to be an object
			options = options || {};
	
			var transport,
	
				// URL without anti-cache param
				cacheURL,
	
				// Response headers
				responseHeadersString,
				responseHeaders,
	
				// timeout handle
				timeoutTimer,
	
				// Url cleanup var
				urlAnchor,
	
				// Request state (becomes false upon send and true upon completion)
				completed,
	
				// To know if global events are to be dispatched
				fireGlobals,
	
				// Loop variable
				i,
	
				// uncached part of the url
				uncached,
	
				// Create the final options object
				s = jQuery.ajaxSetup( {}, options ),
	
				// Callbacks context
				callbackContext = s.context || s,
	
				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context &&
					( callbackContext.nodeType || callbackContext.jquery ) ?
						jQuery( callbackContext ) :
						jQuery.event,
	
				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks( "once memory" ),
	
				// Status-dependent callbacks
				statusCode = s.statusCode || {},
	
				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},
	
				// Default abort message
				strAbort = "canceled",
	
				// Fake xhr
				jqXHR = {
					readyState: 0,
	
					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( completed ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
									responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
								}
							}
							match = responseHeaders[ key.toLowerCase() ];
						}
						return match == null ? null : match;
					},
	
					// Raw string
					getAllResponseHeaders: function() {
						return completed ? responseHeadersString : null;
					},
	
					// Caches the header
					setRequestHeader: function( name, value ) {
						if ( completed == null ) {
							name = requestHeadersNames[ name.toLowerCase() ] =
								requestHeadersNames[ name.toLowerCase() ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},
	
					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( completed == null ) {
							s.mimeType = type;
						}
						return this;
					},
	
					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( completed ) {
	
								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							} else {
	
								// Lazy-add the new callbacks in a way that preserves old ones
								for ( code in map ) {
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							}
						}
						return this;
					},
	
					// Cancel the request
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};
	
			// Attach deferreds
			deferred.promise( jqXHR );
	
			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || location.href ) + "" )
				.replace( rprotocol, location.protocol + "//" );
	
			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;
	
			// Extract dataTypes list
			s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];
	
			// A cross-domain request is in order when the origin doesn't match the current origin.
			if ( s.crossDomain == null ) {
				urlAnchor = document.createElement( "a" );
	
				// Support: IE <=8 - 11, Edge 12 - 13
				// IE throws exception on accessing the href property if url is malformed,
				// e.g. http://example.com:80x/
				try {
					urlAnchor.href = s.url;
	
					// Support: IE <=8 - 11 only
					// Anchor's host property isn't correctly set when s.url is relative
					urlAnchor.href = urlAnchor.href;
					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
						urlAnchor.protocol + "//" + urlAnchor.host;
				} catch ( e ) {
	
					// If there is an error parsing the URL, assume it is crossDomain,
					// it can be rejected by the transport if it is invalid
					s.crossDomain = true;
				}
			}
	
			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}
	
			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );
	
			// If request was aborted inside a prefilter, stop there
			if ( completed ) {
				return jqXHR;
			}
	
			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;
	
			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger( "ajaxStart" );
			}
	
			// Uppercase the type
			s.type = s.type.toUpperCase();
	
			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );
	
			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			// Remove hash to simplify url manipulation
			cacheURL = s.url.replace( rhash, "" );
	
			// More options handling for requests with no content
			if ( !s.hasContent ) {
	
				// Remember the hash so we can put it back
				uncached = s.url.slice( cacheURL.length );
	
				// If data is available, append data to url
				if ( s.data ) {
					cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;
	
					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}
	
				// Add or update anti-cache param if needed
				if ( s.cache === false ) {
					cacheURL = cacheURL.replace( rantiCache, "$1" );
					uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
				}
	
				// Put hash and anti-cache on the URL that will be requested (gh-1732)
				s.url = cacheURL + uncached;
	
			// Change '%20' to '+' if this is encoded form body content (gh-2658)
			} else if ( s.data && s.processData &&
				( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
				s.data = s.data.replace( r20, "+" );
			}
	
			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}
	
			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}
	
			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
					s.accepts[ s.dataTypes[ 0 ] ] +
						( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);
	
			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}
	
			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend &&
				( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {
	
				// Abort if not done already and return
				return jqXHR.abort();
			}
	
			// Aborting is no longer a cancellation
			strAbort = "abort";
	
			// Install callbacks on deferreds
			completeDeferred.add( s.complete );
			jqXHR.done( s.success );
			jqXHR.fail( s.error );
	
			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );
	
			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;
	
				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}
	
				// If request was aborted inside ajaxSend, stop there
				if ( completed ) {
					return jqXHR;
				}
	
				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = window.setTimeout( function() {
						jqXHR.abort( "timeout" );
					}, s.timeout );
				}
	
				try {
					completed = false;
					transport.send( requestHeaders, done );
				} catch ( e ) {
	
					// Rethrow post-completion exceptions
					if ( completed ) {
						throw e;
					}
	
					// Propagate others as results
					done( -1, e );
				}
			}
	
			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;
	
				// Ignore repeat invocations
				if ( completed ) {
					return;
				}
	
				completed = true;
	
				// Clear timeout if it exists
				if ( timeoutTimer ) {
					window.clearTimeout( timeoutTimer );
				}
	
				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;
	
				// Cache response headers
				responseHeadersString = headers || "";
	
				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;
	
				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;
	
				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}
	
				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );
	
				// If successful, handle type chaining
				if ( isSuccess ) {
	
					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader( "Last-Modified" );
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader( "etag" );
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}
	
					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";
	
					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";
	
					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {
	
					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}
	
				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";
	
				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}
	
				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;
	
				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}
	
				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );
	
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
	
					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger( "ajaxStop" );
					}
				}
			}
	
			return jqXHR;
		},
	
		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},
	
		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	} );
	
	jQuery.each( [ "get", "post" ], function( i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {
	
			// Shift arguments if data argument was omitted
			if ( jQuery.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}
	
			// The url can be an options object (which then must have .url)
			return jQuery.ajax( jQuery.extend( {
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject( url ) && url ) );
		};
	} );
	
	
	jQuery._evalUrl = function( url ) {
		return jQuery.ajax( {
			url: url,
	
			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			cache: true,
			async: false,
			global: false,
			"throws": true
		} );
	};
	
	
	jQuery.fn.extend( {
		wrapAll: function( html ) {
			var wrap;
	
			if ( this[ 0 ] ) {
				if ( jQuery.isFunction( html ) ) {
					html = html.call( this[ 0 ] );
				}
	
				// The elements to wrap the target around
				wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );
	
				if ( this[ 0 ].parentNode ) {
					wrap.insertBefore( this[ 0 ] );
				}
	
				wrap.map( function() {
					var elem = this;
	
					while ( elem.firstElementChild ) {
						elem = elem.firstElementChild;
					}
	
					return elem;
				} ).append( this );
			}
	
			return this;
		},
	
		wrapInner: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapInner( html.call( this, i ) );
				} );
			}
	
			return this.each( function() {
				var self = jQuery( this ),
					contents = self.contents();
	
				if ( contents.length ) {
					contents.wrapAll( html );
	
				} else {
					self.append( html );
				}
			} );
		},
	
		wrap: function( html ) {
			var isFunction = jQuery.isFunction( html );
	
			return this.each( function( i ) {
				jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
			} );
		},
	
		unwrap: function( selector ) {
			this.parent( selector ).not( "body" ).each( function() {
				jQuery( this ).replaceWith( this.childNodes );
			} );
			return this;
		}
	} );
	
	
	jQuery.expr.pseudos.hidden = function( elem ) {
		return !jQuery.expr.pseudos.visible( elem );
	};
	jQuery.expr.pseudos.visible = function( elem ) {
		return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
	};
	
	
	
	
	jQuery.ajaxSettings.xhr = function() {
		try {
			return new window.XMLHttpRequest();
		} catch ( e ) {}
	};
	
	var xhrSuccessStatus = {
	
			// File protocol always yields status code 0, assume 200
			0: 200,
	
			// Support: IE <=9 only
			// #1450: sometimes IE returns 1223 when it should be 204
			1223: 204
		},
		xhrSupported = jQuery.ajaxSettings.xhr();
	
	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	support.ajax = xhrSupported = !!xhrSupported;
	
	jQuery.ajaxTransport( function( options ) {
		var callback, errorCallback;
	
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( support.cors || xhrSupported && !options.crossDomain ) {
			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr();
	
					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);
	
					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}
	
					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}
	
					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}
	
					// Set headers
					for ( i in headers ) {
						xhr.setRequestHeader( i, headers[ i ] );
					}
	
					// Callback
					callback = function( type ) {
						return function() {
							if ( callback ) {
								callback = errorCallback = xhr.onload =
									xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;
	
								if ( type === "abort" ) {
									xhr.abort();
								} else if ( type === "error" ) {
	
									// Support: IE <=9 only
									// On a manual native abort, IE9 throws
									// errors on any property access that is not readyState
									if ( typeof xhr.status !== "number" ) {
										complete( 0, "error" );
									} else {
										complete(
	
											// File: protocol always yields status 0; see #8605, #14207
											xhr.status,
											xhr.statusText
										);
									}
								} else {
									complete(
										xhrSuccessStatus[ xhr.status ] || xhr.status,
										xhr.statusText,
	
										// Support: IE <=9 only
										// IE9 has no XHR2 but throws on binary (trac-11426)
										// For XHR2 non-text, let the caller handle it (gh-2498)
										( xhr.responseType || "text" ) !== "text"  ||
										typeof xhr.responseText !== "string" ?
											{ binary: xhr.response } :
											{ text: xhr.responseText },
										xhr.getAllResponseHeaders()
									);
								}
							}
						};
					};
	
					// Listen to events
					xhr.onload = callback();
					errorCallback = xhr.onerror = callback( "error" );
	
					// Support: IE 9 only
					// Use onreadystatechange to replace onabort
					// to handle uncaught aborts
					if ( xhr.onabort !== undefined ) {
						xhr.onabort = errorCallback;
					} else {
						xhr.onreadystatechange = function() {
	
							// Check readyState before timeout as it changes
							if ( xhr.readyState === 4 ) {
	
								// Allow onerror to be called first,
								// but that will not handle a native abort
								// Also, save errorCallback to a variable
								// as xhr.onerror cannot be accessed
								window.setTimeout( function() {
									if ( callback ) {
										errorCallback();
									}
								} );
							}
						};
					}
	
					// Create the abort callback
					callback = callback( "abort" );
	
					try {
	
						// Do send the request (this may raise an exception)
						xhr.send( options.hasContent && options.data || null );
					} catch ( e ) {
	
						// #14683: Only rethrow if this hasn't been notified as an error yet
						if ( callback ) {
							throw e;
						}
					}
				},
	
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );
	
	
	
	
	// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
	jQuery.ajaxPrefilter( function( s ) {
		if ( s.crossDomain ) {
			s.contents.script = false;
		}
	} );
	
	// Install script dataType
	jQuery.ajaxSetup( {
		accepts: {
			script: "text/javascript, application/javascript, " +
				"application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	} );
	
	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
		}
	} );
	
	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function( s ) {
	
		// This transport only deals with cross domain requests
		if ( s.crossDomain ) {
			var script, callback;
			return {
				send: function( _, complete ) {
					script = jQuery( "<script>" ).prop( {
						charset: s.scriptCharset,
						src: s.url
					} ).on(
						"load error",
						callback = function( evt ) {
							script.remove();
							callback = null;
							if ( evt ) {
								complete( evt.type === "error" ? 404 : 200, evt.type );
							}
						}
					);
	
					// Use native DOM manipulation to avoid our domManip AJAX trickery
					document.head.appendChild( script[ 0 ] );
				},
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );
	
	
	
	
	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;
	
	// Default jsonp settings
	jQuery.ajaxSetup( {
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
			this[ callback ] = true;
			return callback;
		}
	} );
	
	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {
	
		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
				"url" :
				typeof s.data === "string" &&
					( s.contentType || "" )
						.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
					rjsonp.test( s.data ) && "data"
			);
	
		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {
	
			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
				s.jsonpCallback() :
				s.jsonpCallback;
	
			// Insert callback into url or form data
			if ( jsonProp ) {
				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			} else if ( s.jsonp !== false ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
			}
	
			// Use data converter to retrieve json after script execution
			s.converters[ "script json" ] = function() {
				if ( !responseContainer ) {
					jQuery.error( callbackName + " was not called" );
				}
				return responseContainer[ 0 ];
			};
	
			// Force json dataType
			s.dataTypes[ 0 ] = "json";
	
			// Install callback
			overwritten = window[ callbackName ];
			window[ callbackName ] = function() {
				responseContainer = arguments;
			};
	
			// Clean-up function (fires after converters)
			jqXHR.always( function() {
	
				// If previous value didn't exist - remove it
				if ( overwritten === undefined ) {
					jQuery( window ).removeProp( callbackName );
	
				// Otherwise restore preexisting value
				} else {
					window[ callbackName ] = overwritten;
				}
	
				// Save back as free
				if ( s[ callbackName ] ) {
	
					// Make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;
	
					// Save the callback name for future use
					oldCallbacks.push( callbackName );
				}
	
				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( overwritten ) ) {
					overwritten( responseContainer[ 0 ] );
				}
	
				responseContainer = overwritten = undefined;
			} );
	
			// Delegate to script
			return "script";
		}
	} );
	
	
	
	
	// Support: Safari 8 only
	// In Safari 8 documents created via document.implementation.createHTMLDocument
	// collapse sibling forms: the second one becomes a child of the first one.
	// Because of that, this security measure has to be disabled in Safari 8.
	// https://bugs.webkit.org/show_bug.cgi?id=137337
	support.createHTMLDocument = ( function() {
		var body = document.implementation.createHTMLDocument( "" ).body;
		body.innerHTML = "<form></form><form></form>";
		return body.childNodes.length === 2;
	} )();
	
	
	// Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function( data, context, keepScripts ) {
		if ( typeof data !== "string" ) {
			return [];
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
	
		var base, parsed, scripts;
	
		if ( !context ) {
	
			// Stop scripts or inline event handlers from being executed immediately
			// by using document.implementation
			if ( support.createHTMLDocument ) {
				context = document.implementation.createHTMLDocument( "" );
	
				// Set the base href for the created document
				// so any parsed elements with URLs
				// are based on the document's URL (gh-2965)
				base = context.createElement( "base" );
				base.href = document.location.href;
				context.head.appendChild( base );
			} else {
				context = document;
			}
		}
	
		parsed = rsingleTag.exec( data );
		scripts = !keepScripts && [];
	
		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[ 1 ] ) ];
		}
	
		parsed = buildFragment( [ data ], context, scripts );
	
		if ( scripts && scripts.length ) {
			jQuery( scripts ).remove();
		}
	
		return jQuery.merge( [], parsed.childNodes );
	};
	
	
	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function( url, params, callback ) {
		var selector, type, response,
			self = this,
			off = url.indexOf( " " );
	
		if ( off > -1 ) {
			selector = stripAndCollapse( url.slice( off ) );
			url = url.slice( 0, off );
		}
	
		// If it's a function
		if ( jQuery.isFunction( params ) ) {
	
			// We assume that it's the callback
			callback = params;
			params = undefined;
	
		// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}
	
		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax( {
				url: url,
	
				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			} ).done( function( responseText ) {
	
				// Save response for use in complete callback
				response = arguments;
	
				self.html( selector ?
	
					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :
	
					// Otherwise use the full result
					responseText );
	
			// If the request succeeds, this function gets "data", "status", "jqXHR"
			// but they are ignored because response was set above.
			// If it fails, this function gets "jqXHR", "status", "error"
			} ).always( callback && function( jqXHR, status ) {
				self.each( function() {
					callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
				} );
			} );
		}
	
		return this;
	};
	
	
	
	
	// Attach a bunch of functions for handling common AJAX events
	jQuery.each( [
		"ajaxStart",
		"ajaxStop",
		"ajaxComplete",
		"ajaxError",
		"ajaxSuccess",
		"ajaxSend"
	], function( i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	} );
	
	
	
	
	jQuery.expr.pseudos.animated = function( elem ) {
		return jQuery.grep( jQuery.timers, function( fn ) {
			return elem === fn.elem;
		} ).length;
	};
	
	
	
	
	/**
	 * Gets a window from an element
	 */
	function getWindow( elem ) {
		return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
	}
	
	jQuery.offset = {
		setOffset: function( elem, options, i ) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css( elem, "position" ),
				curElem = jQuery( elem ),
				props = {};
	
			// Set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}
	
			curOffset = curElem.offset();
			curCSSTop = jQuery.css( elem, "top" );
			curCSSLeft = jQuery.css( elem, "left" );
			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
				( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;
	
			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
	
			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}
	
			if ( jQuery.isFunction( options ) ) {
	
				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
			}
	
			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}
	
			if ( "using" in options ) {
				options.using.call( elem, props );
	
			} else {
				curElem.css( props );
			}
		}
	};
	
	jQuery.fn.extend( {
		offset: function( options ) {
	
			// Preserve chaining for setter
			if ( arguments.length ) {
				return options === undefined ?
					this :
					this.each( function( i ) {
						jQuery.offset.setOffset( this, options, i );
					} );
			}
	
			var docElem, win, rect, doc,
				elem = this[ 0 ];
	
			if ( !elem ) {
				return;
			}
	
			// Support: IE <=11 only
			// Running getBoundingClientRect on a
			// disconnected node in IE throws an error
			if ( !elem.getClientRects().length ) {
				return { top: 0, left: 0 };
			}
	
			rect = elem.getBoundingClientRect();
	
			// Make sure element is not hidden (display: none)
			if ( rect.width || rect.height ) {
				doc = elem.ownerDocument;
				win = getWindow( doc );
				docElem = doc.documentElement;
	
				return {
					top: rect.top + win.pageYOffset - docElem.clientTop,
					left: rect.left + win.pageXOffset - docElem.clientLeft
				};
			}
	
			// Return zeros for disconnected and hidden elements (gh-2310)
			return rect;
		},
	
		position: function() {
			if ( !this[ 0 ] ) {
				return;
			}
	
			var offsetParent, offset,
				elem = this[ 0 ],
				parentOffset = { top: 0, left: 0 };
	
			// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
			// because it is its only offset parent
			if ( jQuery.css( elem, "position" ) === "fixed" ) {
	
				// Assume getBoundingClientRect is there when computed position is fixed
				offset = elem.getBoundingClientRect();
	
			} else {
	
				// Get *real* offsetParent
				offsetParent = this.offsetParent();
	
				// Get correct offsets
				offset = this.offset();
				if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
					parentOffset = offsetParent.offset();
				}
	
				// Add offsetParent borders
				parentOffset = {
					top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
					left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
				};
			}
	
			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
			};
		},
	
		// This method will return documentElement in the following cases:
		// 1) For the element inside the iframe without offsetParent, this method will return
		//    documentElement of the parent window
		// 2) For the hidden or detached element
		// 3) For body or html element, i.e. in case of the html node - it will return itself
		//
		// but those exceptions were never presented as a real life use-cases
		// and might be considered as more preferable results.
		//
		// This logic, however, is not guaranteed and can change at any point in the future
		offsetParent: function() {
			return this.map( function() {
				var offsetParent = this.offsetParent;
	
				while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
					offsetParent = offsetParent.offsetParent;
				}
	
				return offsetParent || documentElement;
			} );
		}
	} );
	
	// Create scrollLeft and scrollTop methods
	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
		var top = "pageYOffset" === prop;
	
		jQuery.fn[ method ] = function( val ) {
			return access( this, function( elem, method, val ) {
				var win = getWindow( elem );
	
				if ( val === undefined ) {
					return win ? win[ prop ] : elem[ method ];
				}
	
				if ( win ) {
					win.scrollTo(
						!top ? val : win.pageXOffset,
						top ? val : win.pageYOffset
					);
	
				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length );
		};
	} );
	
	// Support: Safari <=7 - 9.1, Chrome <=37 - 49
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each( [ "top", "left" ], function( i, prop ) {
		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
			function( elem, computed ) {
				if ( computed ) {
					computed = curCSS( elem, prop );
	
					// If curCSS returns percentage, fallback to offset
					return rnumnonpx.test( computed ) ?
						jQuery( elem ).position()[ prop ] + "px" :
						computed;
				}
			}
		);
	} );
	
	
	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
			function( defaultExtra, funcName ) {
	
			// Margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );
	
				return access( this, function( elem, type, value ) {
					var doc;
	
					if ( jQuery.isWindow( elem ) ) {
	
						// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
						return funcName.indexOf( "outer" ) === 0 ?
							elem[ "inner" + name ] :
							elem.document.documentElement[ "client" + name ];
					}
	
					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;
	
						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}
	
					return value === undefined ?
	
						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :
	
						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable );
			};
		} );
	} );
	
	
	jQuery.fn.extend( {
	
		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},
	
		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {
	
			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ?
				this.off( selector, "**" ) :
				this.off( types, selector || "**", fn );
		}
	} );
	
	jQuery.parseJSON = JSON.parse;
	
	
	
	
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	
	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
	
	if ( true ) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return jQuery;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	
	
	
	
	var
	
		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,
	
		// Map over the $ in case of overwrite
		_$ = window.$;
	
	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}
	
		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}
	
		return jQuery;
	};
	
	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if ( !noGlobal ) {
		window.jQuery = window.$ = jQuery;
	}
	
	
	
	
	
	return jQuery;
	} );


/***/ },
/* 11 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**@license
	 *       __ _____                     ________                              __
	 *      / // _  /__ __ _____ ___ __ _/__  ___/__ ___ ______ __ __  __ ___  / /
	 *  __ / // // // // // _  // _// // / / // _  // _//     // //  \/ // _ \/ /
	 * /  / // // // // // ___// / / // / / // ___// / / / / // // /\  // // / /__
	 * \___//____ \\___//____//_/ _\_  / /_//____//_/ /_/ /_//_//_/ /_/ \__\_\___/
	 *           \/              /____/                              version 0.11.11
	 *
	 * This file is part of jQuery Terminal. http://terminal.jcubic.pl
	 *
	 * Copyright (c) 2010-2016 Jakub Jankiewicz <http://jcubic.pl>
	 * Released under the MIT license
	 *
	 * Contains:
	 *
	 * Storage plugin Distributed under the MIT License
	 * Copyright (c) 2010 Dave Schindler
	 *
	 * jQuery Timers licenced with the WTFPL
	 * <http://jquery.offput.ca/timers/>
	 *
	 * Cross-Browser Split 1.1.1
	 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
	 * Available under the MIT License
	 *
	 * jQuery Caret
	 * Copyright (c) 2009, Gideon Sireling
	 * 3 clause BSD License
	 *
	 * sprintf.js
	 * Copyright (c) 2007-2013 Alexandru Marasteanu <hello at alexei dot ro>
	 * licensed under 3 clause BSD license
	 *
	 * Date: Fri, 07 Oct 2016 15:43:15 +0000
	 */
	
	/* TODO:
	 *
	 * Debug interpreters names in LocalStorage
	 * onPositionChange event add to terminal ???
	 * different command line history for each login users (add login if present to
	 * localStorage key)
	 *
	 * TEST: login + promises/exec
	 *       json-rpc/object + promises
	 *
	 * NOTE: json-rpc don't need promises and delegate resume/pause because only
	 *       exec can call it and exec call interpreter that work with resume/pause
	 */
	
	/* jshint ignore:start */
	(function(ctx) {
	    var sprintf = function() {
	        if (!sprintf.cache.hasOwnProperty(arguments[0])) {
	            sprintf.cache[arguments[0]] = sprintf.parse(arguments[0]);
	        }
	        return sprintf.format.call(null, sprintf.cache[arguments[0]], arguments);
	    };
	
	    sprintf.format = function(parse_tree, argv) {
	        var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
	        for (i = 0; i < tree_length; i++) {
	            node_type = get_type(parse_tree[i]);
	            if (node_type === 'string') {
	                output.push(parse_tree[i]);
	            }
	            else if (node_type === 'array') {
	                match = parse_tree[i]; // convenience purposes only
	                if (match[2]) { // keyword argument
	                    arg = argv[cursor];
	                    for (k = 0; k < match[2].length; k++) {
	                        if (!arg.hasOwnProperty(match[2][k])) {
	                            throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
	                        }
	                        arg = arg[match[2][k]];
	                    }
	                }
	                else if (match[1]) { // positional argument (explicit)
	                    arg = argv[match[1]];
	                }
	                else { // positional argument (implicit)
	                    arg = argv[cursor++];
	                }
	
	                if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
	                    throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
	                }
	                switch (match[8]) {
	                    case 'b': arg = arg.toString(2); break;
	                    case 'c': arg = String.fromCharCode(arg); break;
	                    case 'd': arg = parseInt(arg, 10); break;
	                    case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
	                    case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
	                    case 'o': arg = arg.toString(8); break;
	                    case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
	                    case 'u': arg = arg >>> 0; break;
	                    case 'x': arg = arg.toString(16); break;
	                    case 'X': arg = arg.toString(16).toUpperCase(); break;
	                }
	                arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
	                pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
	                pad_length = match[6] - String(arg).length;
	                pad = match[6] ? str_repeat(pad_character, pad_length) : '';
	                output.push(match[5] ? arg + pad : pad + arg);
	            }
	        }
	        return output.join('');
	    };
	
	    sprintf.cache = {};
	
	    sprintf.parse = function(fmt) {
	        var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
	        while (_fmt) {
	            if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
	                parse_tree.push(match[0]);
	            }
	            else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
	                parse_tree.push('%');
	            }
	            else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
	                if (match[2]) {
	                    arg_names |= 1;
	                    var field_list = [], replacement_field = match[2], field_match = [];
	                    if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
	                        field_list.push(field_match[1]);
	                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
	                            if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
	                                field_list.push(field_match[1]);
	                            }
	                            else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
	                                field_list.push(field_match[1]);
	                            }
	                            else {
	                                throw('[sprintf] huh?');
	                            }
	                        }
	                    }
	                    else {
	                        throw('[sprintf] huh?');
	                    }
	                    match[2] = field_list;
	                }
	                else {
	                    arg_names |= 2;
	                }
	                if (arg_names === 3) {
	                    throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
	                }
	                parse_tree.push(match);
	            }
	            else {
	                throw('[sprintf] huh?');
	            }
	            _fmt = _fmt.substring(match[0].length);
	        }
	        return parse_tree;
	    };
	
	    var vsprintf = function(fmt, argv, _argv) {
	        _argv = argv.slice(0);
	        _argv.splice(0, 0, fmt);
	        return sprintf.apply(null, _argv);
	    };
	
	    /**
	     * helpers
	     */
	    function get_type(variable) {
	        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
	    }
	
	    function str_repeat(input, multiplier) {
	        for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
	        return output.join('');
	    }
	
	    /**
	     * export to either browser or node.js
	     */
	    ctx.sprintf = sprintf;
	    ctx.vsprintf = vsprintf;
	})(typeof global != "undefined" ? global : window);
	/* jshint ignore:end */
	(function($, undefined) {
	    "use strict";
	    // -----------------------------------------------------------------------
	    // :: map object to object
	    // -----------------------------------------------------------------------
	    $.omap = function(o, fn) {
	        var result = {};
	        $.each(o, function(k, v) {
	            result[k] = fn.call(o, k, v);
	        });
	        return result;
	    };
	    var Clone = {
	        clone_object: function(object) {
	            var tmp = {};
	            if (typeof object == 'object') {
	                if ($.isArray(object)) {
	                    return this.clone_array(object);
	                } else if (object === null) {
	                    return object;
	                } else {
	                    for (var key in object) {
	                        if ($.isArray(object[key])) {
	                            tmp[key] = this.clone_array(object[key]);
	                        } else if (typeof object[key] == 'object') {
	                            tmp[key] = this.clone_object(object[key]);
	                        } else {
	                            tmp[key] = object[key];
	                        }
	                    }
	                }
	            }
	            return tmp;
	        },
	        clone_array: function(array) {
	            if (!$.isFunction(Array.prototype.map)) {
	                throw new Error("You'r browser don't support ES5 array map " +
	                                "use es5-shim");
	            }
	            return array.slice(0).map(function(item) {
	                if (typeof item == 'object') {
	                    return this.clone_object(item);
	                } else {
	                    return item;
	                }
	            }.bind(this));
	        }
	    };
	    var clone = function(object) {
	        return Clone.clone_object(object);
	    };
	
	    var hasLS = function () {
	      var testKey = 'test', storage = window.localStorage;
	      try {
	        storage.setItem(testKey, '1');
	        storage.removeItem(testKey);
	        return true;
	      } catch (error) {
	        return false;
	      }
	    };
	
	    /* jshint ignore:start */
	    // -----------------------------------------------------------------------
	    // :: Storage plugin
	    // -----------------------------------------------------------------------
	    // Private data
	    var isLS = hasLS();
	    // Private functions
	    function wls(n, v) {
	        var c;
	        if (typeof n === 'string' && typeof v === 'string') {
	            localStorage[n] = v;
	            return true;
	        } else if (typeof n === 'object' && typeof v === 'undefined') {
	            for (c in n) {
	                if (n.hasOwnProperty(c)) {
	                    localStorage[c] = n[c];
	                }
	            }
	            return true;
	        }
	        return false;
	    }
	    function wc(n, v) {
	        var dt, e, c;
	        dt = new Date();
	        dt.setTime(dt.getTime() + 31536000000);
	        e = '; expires=' + dt.toGMTString();
	        if (typeof n === 'string' && typeof v === 'string') {
	            document.cookie = n + '=' + v + e + '; path=/';
	            return true;
	        } else if (typeof n === 'object' && typeof v === 'undefined') {
	            for (c in n) {
	                if (n.hasOwnProperty(c)) {
	                    document.cookie = c + '=' + n[c] + e + '; path=/';
	                }
	            }
	            return true;
	        }
	        return false;
	    }
	    function rls(n) {
	        return localStorage[n];
	    }
	    function rc(n) {
	        var nn, ca, i, c;
	        nn = n + '=';
	        ca = document.cookie.split(';');
	        for (i = 0; i < ca.length; i++) {
	            c = ca[i];
	            while (c.charAt(0) === ' ') {
	                c = c.substring(1, c.length);
	            }
	            if (c.indexOf(nn) === 0) {
	                return c.substring(nn.length, c.length);
	            }
	        }
	        return null;
	    }
	    function dls(n) {
	        return delete localStorage[n];
	    }
	    function dc(n) {
	        return wc(n, '', -1);
	    }
	    /**
	    * Public API
	    * $.Storage.set("name", "value")
	    * $.Storage.set({"name1":"value1", "name2":"value2", etc})
	    * $.Storage.get("name")
	    * $.Storage.remove("name")
	    */
	    $.extend({
	        Storage: {
	            set: isLS ? wls : wc,
	            get: isLS ? rls : rc,
	            remove: isLS ? dls : dc
	        }
	    });
	    // -----------------------------------------------------------------------
	    // :: jQuery Timers
	    // -----------------------------------------------------------------------
	    var jQuery = $;
	    jQuery.fn.extend({
	        everyTime: function(interval, label, fn, times, belay) {
	            return this.each(function() {
	                jQuery.timer.add(this, interval, label, fn, times, belay);
	            });
	        },
	        oneTime: function(interval, label, fn) {
	            return this.each(function() {
	                jQuery.timer.add(this, interval, label, fn, 1);
	            });
	        },
	        stopTime: function(label, fn) {
	            return this.each(function() {
	                jQuery.timer.remove(this, label, fn);
	            });
	        }
	    });
	
	    jQuery.extend({
	        timer: {
	            guid: 1,
	            global: {},
	            regex: /^([0-9]+)\s*(.*s)?$/,
	            powers: {
	                // Yeah this is major overkill...
	                'ms': 1,
	                'cs': 10,
	                'ds': 100,
	                's': 1000,
	                'das': 10000,
	                'hs': 100000,
	                'ks': 1000000
	            },
	            timeParse: function(value) {
	                if (value === undefined || value === null) {
	                    return null;
	                }
	                var result = this.regex.exec(jQuery.trim(value.toString()));
	                if (result[2]) {
	                    var num = parseInt(result[1], 10);
	                    var mult = this.powers[result[2]] || 1;
	                    return num * mult;
	                } else {
	                    return value;
	                }
	            },
	            add: function(element, interval, label, fn, times, belay) {
	                var counter = 0;
	
	                if (jQuery.isFunction(label)) {
	                    if (!times) {
	                        times = fn;
	                    }
	                    fn = label;
	                    label = interval;
	                }
	
	                interval = jQuery.timer.timeParse(interval);
	
	                if (typeof interval !== 'number' ||
	                    isNaN(interval) ||
	                    interval <= 0) {
	                    return;
	                }
	                if (times && times.constructor !== Number) {
	                    belay = !!times;
	                    times = 0;
	                }
	
	                times = times || 0;
	                belay = belay || false;
	
	                if (!element.$timers) {
	                    element.$timers = {};
	                }
	                if (!element.$timers[label]) {
	                    element.$timers[label] = {};
	                }
	                fn.$timerID = fn.$timerID || this.guid++;
	
	                var handler = function() {
	                    if (belay && handler.inProgress) {
	                        return;
	                    }
	                    handler.inProgress = true;
	                    if ((++counter > times && times !== 0) ||
	                        fn.call(element, counter) === false) {
	                        jQuery.timer.remove(element, label, fn);
	                    }
	                    handler.inProgress = false;
	                };
	
	                handler.$timerID = fn.$timerID;
	
	                if (!element.$timers[label][fn.$timerID]) {
	                    element.$timers[label][fn.$timerID] = window.setInterval(handler, interval);
	                }
	
	                if (!this.global[label]) {
	                    this.global[label] = [];
	                }
	                this.global[label].push(element);
	
	            },
	            remove: function(element, label, fn) {
	                var timers = element.$timers, ret;
	
	                if (timers) {
	
	                    if (!label) {
	                        for (var lab in timers) {
	                            if (timers.hasOwnProperty(lab)) {
	                                this.remove(element, lab, fn);
	                            }
	                        }
	                    } else if (timers[label]) {
	                        if (fn) {
	                            if (fn.$timerID) {
	                                window.clearInterval(timers[label][fn.$timerID]);
	                                delete timers[label][fn.$timerID];
	                            }
	                        } else {
	                            for (var _fn in timers[label]) {
	                                if (timers[label].hasOwnProperty(_fn)) {
	                                    window.clearInterval(timers[label][_fn]);
	                                    delete timers[label][_fn];
	                                }
	                            }
	                        }
	
	                        for (ret in timers[label]) {
	                            if (timers[label].hasOwnProperty(ret)) {
	                                break;
	                            }
	                        }
	                        if (!ret) {
	                            ret = null;
	                            delete timers[label];
	                        }
	                    }
	
	                    for (ret in timers) {
	                        if (timers.hasOwnProperty(ret)) {
	                            break;
	                        }
	                    }
	                    if (!ret) {
	                        element.$timers = null;
	                    }
	                }
	            }
	        }
	    });
	
	    if (/(msie) ([\w.]+)/.exec(navigator.userAgent.toLowerCase())) {
	        jQuery(window).one('unload', function() {
	            var global = jQuery.timer.global;
	            for (var label in global) {
	                if (global.hasOwnProperty(label)) {
	                    var els = global[label], i = els.length;
	                    while (--i) {
	                        jQuery.timer.remove(els[i], label);
	                    }
	                }
	            }
	        });
	    }
	    // -----------------------------------------------------------------------
	    // :: CROSS BROWSER SPLIT
	    // -----------------------------------------------------------------------
	    (function(undef) {
	
	        // prevent double include
	
	        if (!String.prototype.split.toString().match(/\[native/)) {
	            return;
	        }
	
	        var nativeSplit = String.prototype.split,
	        compliantExecNpcg = /()??/.exec("")[1] === undef, // NPCG: nonparticipating capturing group
	        self;
	
	        self = function (str, separator, limit) {
	            // If `separator` is not a regex, use `nativeSplit`
	            if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
	                return nativeSplit.call(str, separator, limit);
	            }
	            var output = [],
	            flags = (separator.ignoreCase ? "i" : "") +
	                (separator.multiline  ? "m" : "") +
	                (separator.extended   ? "x" : "") + // Proposed for ES6
	                (separator.sticky     ? "y" : ""), // Firefox 3+
	                lastLastIndex = 0,
	            // Make `global` and avoid `lastIndex` issues by working with a copy
	            separator2, match, lastIndex, lastLength;
	            separator = new RegExp(separator.source, flags + "g");
	            str += ""; // Type-convert
	            if (!compliantExecNpcg) {
	                // Doesn't need flags gy, but they don't hurt
	                separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
	            }
	            /* Values for `limit`, per the spec:
	             * If undefined: 4294967295 // Math.pow(2, 32) - 1
	             * If 0, Infinity, or NaN: 0
	             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
	             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
	             * If other: Type-convert, then use the above rules
	             */
	            // ? Math.pow(2, 32) - 1 : ToUint32(limit)
	            limit = limit === undef ? -1 >>> 0 : limit >>> 0;
	            while (match = separator.exec(str)) {
	                    // `separator.lastIndex` is not reliable cross-browser
	                    lastIndex = match.index + match[0].length;
	                    if (lastIndex > lastLastIndex) {
	                        output.push(str.slice(lastLastIndex, match.index));
	                        // Fix browsers whose `exec` methods don't consistently return `undefined` for
	                        // nonparticipating capturing groups
	                        if (!compliantExecNpcg && match.length > 1) {
	                            match[0].replace(separator2, function () {
	                                for (var i = 1; i < arguments.length - 2; i++) {
	                                    if (arguments[i] === undef) {
	                                        match[i] = undef;
	                                    }
	                                }
	                            });
	                        }
	                        if (match.length > 1 && match.index < str.length) {
	                            Array.prototype.push.apply(output, match.slice(1));
	                        }
	                        lastLength = match[0].length;
	                        lastLastIndex = lastIndex;
	                        if (output.length >= limit) {
	                            break;
	                        }
	                    }
	                    if (separator.lastIndex === match.index) {
	                        separator.lastIndex++; // Avoid an infinite loop
	                    }
	                }
	            if (lastLastIndex === str.length) {
	                if (lastLength || !separator.test("")) {
	                    output.push("");
	                }
	            } else {
	                output.push(str.slice(lastLastIndex));
	            }
	            return output.length > limit ? output.slice(0, limit) : output;
	        };
	
	        // For convenience
	        String.prototype.split = function (separator, limit) {
	            return self(this, separator, limit);
	        };
	
	        return self;
	
	    })();
	    // -----------------------------------------------------------------------
	    // :: jQuery Caret
	    // -----------------------------------------------------------------------
	    $.fn.caret = function(pos) {
	        var target = this[0];
	        var isContentEditable = target.contentEditable === 'true';
	        //get
	        if (arguments.length == 0) {
	            //HTML5
	            if (window.getSelection) {
	                //contenteditable
	                if (isContentEditable) {
	                    target.focus();
	                    var range1 = window.getSelection().getRangeAt(0),
	                    range2 = range1.cloneRange();
	                    range2.selectNodeContents(target);
	                    range2.setEnd(range1.endContainer, range1.endOffset);
	                    return range2.toString().length;
	                }
	                //textarea
	                return target.selectionStart;
	            }
	            //IE<9
	            if (document.selection) {
	                target.focus();
	                //contenteditable
	                if (isContentEditable) {
	                    var range1 = document.selection.createRange(),
	                    range2 = document.body.createTextRange();
	                    range2.moveToElementText(target);
	                    range2.setEndPoint('EndToEnd', range1);
	                    return range2.text.length;
	                }
	                //textarea
	                var pos = 0,
	                range = target.createTextRange(),
	                range2 = document.selection.createRange().duplicate(),
	                bookmark = range2.getBookmark();
	                range.moveToBookmark(bookmark);
	                while (range.moveStart('character', -1) !== 0) pos++;
	                return pos;
	            }
	            //not supported
	            return 0;
	        }
	        //set
	        if (pos == -1)
	            pos = this[isContentEditable? 'text' : 'val']().length;
	        //HTML5
	        if (window.getSelection) {
	            //contenteditable
	            if (isContentEditable) {
	                target.focus();
	                window.getSelection().collapse(target.firstChild, pos);
	            }
	            //textarea
	            else
	                target.setSelectionRange(pos, pos);
	        }
	        //IE<9
	        else if (document.body.createTextRange) {
	            var range = document.body.createTextRange();
	            range.moveToElementText(target);
	            range.moveStart('character', pos);
	            range.collapse(true);
	            range.select();
	        }
	        if (!isContentEditable)
	            target.focus();
	        return pos;
	    };
	    /* jshint ignore:end */
	    // -----------------------------------------------------------------------
	    // :: Split string to array of strings with the same length
	    // -----------------------------------------------------------------------
	    function str_parts(str, length) {
	        var result = [];
	        var len = str.length;
	        if (len < length) {
	            return [str];
	        } else if (length < 0) {
	            throw new Error('str_parts: length can\'t be negative'); // '
	        }
	        for (var i = 0; i < len; i += length) {
	            result.push(str.substring(i, i + length));
	        }
	        return result;
	    }
	    // -----------------------------------------------------------------------
	    // :: CYCLE DATA STRUCTURE
	    // -----------------------------------------------------------------------
	    function Cycle(init) {
	        var data = init ? [init] : [];
	        var pos = 0;
	        $.extend(this, {
	            get: function() {
	                return data;
	            },
	            rotate: function() {
	                if (!data.filter(Boolean).length) {
	                    return;
	                }
	                if (data.length === 1) {
	                    return data[0];
	                } else {
	                    if (pos === data.length - 1) {
	                        pos = 0;
	                    } else {
	                        ++pos;
	                    }
	                    if (data[pos]) {
	                        return data[pos];
	                    } else {
	                        return this.rotate();
	                    }
	                }
	            },
	            length: function() {
	                return data.length;
	            },
	            remove: function(index) {
	                delete data[index];
	            },
	            set: function(item) {
	                for (var i = data.length; i--;) {
	                    if (data[i] === item) {
	                        pos = i;
	                        return;
	                    }
	                }
	                this.append(item);
	            },
	            front: function() {
	                if (data.length) {
	                    var index = pos;
	                    var restart = false;
	                    while (!data[index]) {
	                        index++;
	                        if (index > data.length) {
	                            if (restart) {
	                                break;
	                            }
	                            index = 0;
	                            restart = true;
	                        }
	                    }
	                    return data[index];
	                }
	            },
	            append: function(item) {
	                data.push(item);
	            }
	        });
	    }
	    // -----------------------------------------------------------------------
	    // :: STACK DATA STRUCTURE
	    // -----------------------------------------------------------------------
	    function Stack(init) {
	        var data = init instanceof Array ? init : init ? [init] : [];
	        $.extend(this, {
	            data: function() {
	                return data;
	            },
	            map: function(fn) {
	                return $.map(data, fn);
	            },
	            size: function() {
	                return data.length;
	            },
	            pop: function() {
	                if (data.length === 0) {
	                    return null;
	                } else {
	                    var value = data[data.length - 1];
	                    data = data.slice(0, data.length - 1);
	                    return value;
	                }
	            },
	            push: function(value) {
	                data = data.concat([value]);
	                return value;
	            },
	            top: function() {
	                return data.length > 0 ? data[data.length - 1] : null;
	            },
	            clone: function() {
	                return new Stack(data.slice(0));
	            }
	        });
	    }
	    // -------------------------------------------------------------------------
	    // :: Serialize object myself (biwascheme or prototype library do something
	    // :: wicked with JSON serialization for Arrays)
	    // -------------------------------------------------------------------------
	    $.json_stringify = function(object, level) {
	        var result = '', i;
	        level = level === undefined ? 1 : level;
	        var type = typeof object;
	        switch (type) {
	            case 'function':
	                result += object;
	                break;
	            case 'boolean':
	                result += object ? 'true' : 'false';
	                break;
	            case 'object':
	                if (object === null) {
	                    result += 'null';
	                } else if (object instanceof Array) {
	                    result += '[';
	                    var len = object.length;
	                    for (i = 0; i < len - 1; ++i) {
	                        result += $.json_stringify(object[i], level + 1);
	                    }
	                    result += $.json_stringify(object[len - 1], level + 1) + ']';
	                } else {
	                    result += '{';
	                    for (var property in object) {
	                        if (object.hasOwnProperty(property)) {
	                            result += '"' + property + '":' +
	                                $.json_stringify(object[property], level + 1);
	                        }
	                    }
	                    result += '}';
	                }
	                break;
	            case 'string':
	                var str = object;
	                var repl = {
	                    '\\\\': '\\\\',
	                    '"': '\\"',
	                    '/': '\\/',
	                    '\\n': '\\n',
	                    '\\r': '\\r',
	                    '\\t': '\\t'};
	                for (i in repl) {
	                    if (repl.hasOwnProperty(i)) {
	                        str = str.replace(new RegExp(i, 'g'), repl[i]);
	                    }
	                }
	                result += '"' + str + '"';
	                break;
	            case 'number':
	                result += String(object);
	                break;
	        }
	        result += (level > 1 ? ',' : '');
	        // quick hacks below
	        if (level === 1) {
	            // fix last comma
	            result = result.replace(/,([\]}])/g, '$1');
	        }
	        // fix comma before array or object
	        return result.replace(/([\[{]),/g, '$1');
	    };
	    // -------------------------------------------------------------------------
	    // :: HISTORY CLASS
	    // -------------------------------------------------------------------------
	    function History(name, size) {
	        var enabled = true;
	        var storage_key = '';
	        if (typeof name === 'string' && name !== '') {
	            storage_key = name + '_';
	        }
	        storage_key += 'commands';
	        var data = $.Storage.get(storage_key);
	        data = data ? $.parseJSON(data) : [];
	        var pos = data.length-1;
	        $.extend(this, {
	            append: function(item) {
	                if (enabled) {
	                    if (data[data.length-1] !== item) {
	                        data.push(item);
	                        if (size && data.length > size) {
	                            data = data.slice(-size);
	                        }
	                        pos = data.length-1;
	                        $.Storage.set(storage_key, $.json_stringify(data));
	                    }
	                }
	            },
	            data: function() {
	                return data;
	            },
	            reset: function() {
	                pos = data.length-1;
	            },
	            last: function() {
	                return data[data.length-1];
	            },
	            end: function() {
	                return pos === data.length-1;
	            },
	            position: function() {
	                return pos;
	            },
	            current: function() {
	                return data[pos];
	            },
	            next: function() {
	                if (pos < data.length-1) {
	                    ++pos;
	                }
	                if (pos !== -1) {
	                    return data[pos];
	                }
	            },
	            previous: function() {
	                var old = pos;
	                if (pos > 0) {
	                    --pos;
	                }
	                if (old !== -1) {
	                    return data[pos];
	                }
	            },
	            clear: function() {
	                data = [];
	                this.purge();
	            },
	            enabled: function() {
	                return enabled;
	            },
	            enable: function() {
	                enabled = true;
	            },
	            purge: function() {
	                $.Storage.remove(storage_key);
	            },
	            disable: function() {
	                enabled = false;
	            }
	        });
	    }
	    // -----------------------------------------------------------------------
	    var is_paste_supported = (function() {
	        var el = document.createElement('div');
	        el.setAttribute('onpaste', 'return;');
	        return typeof el.onpaste == "function";
	    })();
	    var first_cmd = true;
	    // -------------------------------------------------------------------------
	    // :: COMMAND LINE PLUGIN
	    // -------------------------------------------------------------------------
	    $.fn.cmd = function(options) {
	        var self = this;
	        var maybe_data = self.data('cmd');
	        if (maybe_data) {
	            return maybe_data;
	        }
	        self.addClass('cmd');
	        self.append('<span class="prompt"></span><span></span>' +
	                    '<span class="cursor">&nbsp;</span><span></span>');
	        // on mobile the only way to hide textarea on desktop it's needed because
	        // textarea show up after focus
	        //self.append('<span class="mask"></mask>');
	        var clip = $('<textarea>').addClass('clipboard').appendTo(self);
	        // we don't need this but leave it as a comment just in case
	        //var contentEditable = $('<div contentEditable></div>')
	        //$(document.body).append(contentEditable);
	        if (options.width) {
	            self.width(options.width);
	        }
	        var num_chars; // calculated by draw_prompt
	        var prompt_len;
	        var prompt_node = self.find('.prompt');
	        var reverse_search = false;
	        var rev_search_str = '';
	        var reverse_search_position = null;
	        var backup_prompt;
	        var mask = options.mask || false;
	        var command = '';
	        var last_command;
	        // text from selection using CTRL+SHIFT+C (as in Xterm)
	        var selected_text = '';
	        var kill_text = ''; // text from command that kill part of the command
	        var position = 0;
	        var prompt;
	        var enabled;
	        var historySize = options.historySize || 60;
	        var name, history;
	        var cursor = self.find('.cursor');
	        var animation;
	        var paste_count = 0;
	        function mobile_focus() {
	            //if (is_touch) {
	            var focus = clip.is(':focus');
	            if (enabled) {
	                if (!focus) {
	                    clip.focus();
	                    self.oneTime(10, function() {
	                        clip.focus();
	                    });
	                }
	            } else {
	                if (focus) {
	                    clip.blur();
	                }
	            }
	        }
	        // on mobile you can't delete character if input is empty (event
	        // will not fire) so we fake text entry, we could just put dummy
	        // data but we put real command and position
	        function fake_mobile_entry() {
	            if (is_touch) {
	                // delay worked while experimenting
	                self.oneTime(10, function() {
	                    clip.val(command);
	                    self.oneTime(10, function() {
	                        clip.caret(position);
	                    });
	                });
	            }
	        }
	        // terminal animation don't work on andorid because they animate
	        // 2 properties
	        if ((support_animations && !is_android)) {
	            animation = function(toggle) {
	                if (toggle) {
	                    cursor.addClass('blink');
	                } else {
	                    cursor.removeClass('blink');
	                }
	            };
	        } else {
	            var animating = false;
	            animation = function(toggle) {
	                if (toggle && !animating) {
	                    animating = true;
	                    cursor.addClass('inverted blink');
	                    self.everyTime(500, 'blink', blink);
	                } else if (animating && !toggle) {
	                    animating = false;
	                    self.stopTime('blink', blink);
	                    cursor.removeClass('inverted blink');
	                }
	            };
	        }
	        // ---------------------------------------------------------------------
	        // :: Blinking cursor function
	        // ---------------------------------------------------------------------
	        function blink(i) {
	            cursor.toggleClass('inverted');
	        }
	        // ---------------------------------------------------------------------
	        // :: Set prompt for reverse search
	        // ---------------------------------------------------------------------
	        function draw_reverse_prompt() {
	            prompt = "(reverse-i-search)`" + rev_search_str + "': ";
	            draw_prompt();
	        }
	        // ---------------------------------------------------------------------
	        // :: Disable reverse search
	        // ---------------------------------------------------------------------
	        function clear_reverse_state() {
	            prompt = backup_prompt;
	            reverse_search = false;
	            reverse_search_position = null;
	            rev_search_str = '';
	        }
	        // ---------------------------------------------------------------------
	        // :: Search through command line history. If next is not defined or
	        // :: false it searches for the first item from the end. If true it
	        // :: search for the next item
	        // ---------------------------------------------------------------------
	        function reverse_history_search(next) {
	            var history_data = history.data();
	            var regex, save_string;
	            var len = history_data.length;
	            if (next && reverse_search_position > 0) {
	                len -= reverse_search_position;
	            }
	            if (rev_search_str.length > 0) {
	                for (var j=rev_search_str.length; j>0; j--) {
	                    save_string = $.terminal.escape_regex(rev_search_str.substring(0, j));
	                    regex = new RegExp(save_string);
	                    for (var i=len; i--;) {
	                        if (regex.test(history_data[i])) {
	                            reverse_search_position = history_data.length - i;
	                            self.position(history_data[i].indexOf(save_string));
	                            self.set(history_data[i], true);
	                            redraw();
	                            if (rev_search_str.length !== j) {
	                                rev_search_str = rev_search_str.substring(0, j);
	                                draw_reverse_prompt();
	                            }
	                            return;
	                        }
	                    }
	                }
	            }
	            rev_search_str = ''; // clear if not found any
	        }
	        // ---------------------------------------------------------------------
	        // :: Recalculate number of characters in command line
	        // ---------------------------------------------------------------------
	        function change_num_chars() {
	            var W = self.width();
	            var w = cursor[0].getBoundingClientRect().width;
	            num_chars = Math.floor(W / w);
	        }
	        // ---------------------------------------------------------------------
	        // :: Split String that fit into command line where first line need to
	        // :: fit next to prompt (need to have less characters)
	        // ---------------------------------------------------------------------
	        function get_splited_command_line(string) {
	            var first = string.substring(0, num_chars - prompt_len);
	            var rest = string.substring(num_chars - prompt_len);
	            return [first].concat(str_parts(rest, num_chars));
	        }
	        // ---------------------------------------------------------------------
	        // :: Function that displays the command line. Split long lines and
	        // :: place cursor in the right place
	        // ---------------------------------------------------------------------
	        var redraw = (function(self) {
	            var before = cursor.prev();
	            var after = cursor.next();
	            // -----------------------------------------------------------------
	            // :: Draw line with the cursor
	            // -----------------------------------------------------------------
	            function draw_cursor_line(string, position) {
	                var len = string.length;
	                if (position === len) {
	                    before.html($.terminal.encode(string));
	                    cursor.html('&nbsp;');
	                    after.html('');
	                } else if (position === 0) {
	                    before.html('');
	                    //fix for tilda in IE
	                    cursor.html($.terminal.encode(string.slice(0, 1)));
	                    //cursor.html($.terminal.encode(string[0]));
	                    after.html($.terminal.encode(string.slice(1)));
	                } else {
	                    var before_str = string.slice(0, position);
	                    before.html($.terminal.encode(before_str));
	                    //fix for tilda in IE
	                    var c = string.slice(position, position + 1);
	                    //cursor.html(string[position]);
	                    cursor.html($.terminal.encode(c));
	                    if (position === string.length - 1) {
	                        after.html('');
	                    } else {
	                        after.html($.terminal.encode(string.slice(position + 1)));
	                    }
	                }
	            }
	            function div(string) {
	                return '<div>' + $.terminal.encode(string) + '</div>';
	            }
	            // -----------------------------------------------------------------
	            // :: Display lines after the cursor
	            // -----------------------------------------------------------------
	            function lines_after(lines) {
	                var last_ins = after;
	                $.each(lines, function(i, line) {
	                    last_ins = $(div(line)).insertAfter(last_ins).
	                        addClass('clear');
	                });
	            }
	            // -----------------------------------------------------------------
	            // :: Display lines before the cursor
	            // -----------------------------------------------------------------
	            function lines_before(lines) {
	                $.each(lines, function(i, line) {
	                    before.before(div(line));
	                });
	            }
	            var count = 0;
	            // -----------------------------------------------------------------
	            // :: Redraw function
	            // -----------------------------------------------------------------
	            return function() {
	                var string;
	                var str; // max 80 line helper
	                switch(typeof mask) {
	                    case 'boolean':
	                        string = mask ? command.replace(/./g, '*') : command;
	                        break;
	                    case 'string':
	                        string = command.replace(/./g, mask);
	                        break;
	                }
	                var i, first_len;
	                self.find('div').remove();
	                before.html('');
	                // long line
	                if (string.length > num_chars - prompt_len - 1 ||
	                    string.match(/\n/)) {
	                    var array;
	                    var tabs = string.match(/\t/g);
	                    var tabs_rm = tabs ? tabs.length * 3 : 0;
	                    //quick tabulation hack
	                    if (tabs) {
	                        string = string.replace(/\t/g, '\x00\x00\x00\x00');
	                    }
	                    // command contains new line characters
	                    if (string.match(/\n/)) {
	                        var tmp = string.split("\n");
	                        first_len = num_chars - prompt_len - 1;
	                        // empty character after each line
	                        for (i=0; i<tmp.length-1; ++i) {
	                            tmp[i] += ' ';
	                        }
	                        // split first line
	                        if (tmp[0].length > first_len) {
	                            array = [tmp[0].substring(0, first_len)];
	                            str = tmp[0].substring(first_len);
	                            array = array.concat(str_parts(str, num_chars));
	                        } else {
	                            array = [tmp[0]];
	                        }
	                        // process rest of the lines
	                        for (i=1; i<tmp.length; ++i) {
	                            if (tmp[i].length > num_chars) {
	                                array = array.concat(str_parts(tmp[i],
	                                                               num_chars));
	                            } else {
	                                array.push(tmp[i]);
	                            }
	                        }
	                    } else {
	                        array = get_splited_command_line(string);
	                    }
	                    if (tabs) {
	                        array = $.map(array, function(line) {
	                            return line.replace(/\x00\x00\x00\x00/g, '\t');
	                        });
	                    }
	                    first_len = array[0].length;
	                    //cursor in first line
	                    if (first_len === 0 && array.length === 1) {
	                        // skip empty line
	                    } else if (position < first_len) {
	                        draw_cursor_line(array[0], position);
	                        lines_after(array.slice(1));
	                    } else if (position === first_len) {
	                        before.before(div(array[0]));
	                        draw_cursor_line(array[1], 0);
	                        lines_after(array.slice(2));
	                    } else {
	                        var num_lines = array.length;
	                        var offset = 0;
	                        if (position < first_len) {
	                            draw_cursor_line(array[0], position);
	                            lines_after(array.slice(1));
	                        } else if (position === first_len) {
	                            before.before(div(array[0]));
	                            draw_cursor_line(array[1], 0);
	                            lines_after(array.slice(2));
	                        } else {
	                            var last = array.slice(-1)[0];
	                            var from_last = string.length - position - tabs_rm;
	                            var last_len = last.length;
	                            var pos = 0;
	                            if (from_last <= last_len) {
	                                lines_before(array.slice(0, -1));
	                                if (last_len === from_last) {
	                                    pos = 0;
	                                } else {
	                                    pos = last_len-from_last;
	                                }
	                                draw_cursor_line(last, pos);
	                            } else {
	                                // in the middle
	                                if (num_lines === 3) {
	                                    str = $.terminal.encode(array[0]);
	                                    before.before('<div>' + str + '</div>');
	                                    draw_cursor_line(array[1],
	                                                     position-first_len-1);
	                                    str = $.terminal.encode(array[2]);
	                                    after.after('<div class="clear">' + str +
	                                                '</div>');
	                                } else {
	                                    // more lines, cursor in the middle
	                                    var line_index;
	                                    var current;
	                                    pos = position;
	                                    for (i=0; i<array.length; ++i) {
	                                        var current_len = array[i].length;
	                                        if (pos > current_len) {
	                                            pos -= current_len;
	                                        } else {
	                                            break;
	                                        }
	                                    }
	                                    current = array[i];
	                                    line_index = i;
	                                    // cursor on first character in line
	                                    if (pos === current.length) {
	                                        pos = 0;
	                                        current = array[++line_index];
	                                    }
	                                    draw_cursor_line(current, pos);
	                                    lines_before(array.slice(0, line_index));
	                                    lines_after(array.slice(line_index+1));
	                                }
	                            }
	                        }
	                    }
	                } else {
	                     if (string === '') {
	                         before.html('');
	                         cursor.html('&nbsp;');
	                         after.html('');
	                     } else {
	                         draw_cursor_line(string, position);
	                     }
	                }
	            };
	        })(self);
	        // ---------------------------------------------------------------------
	        // :: Draw prompt that can be a function or a string
	        // ---------------------------------------------------------------------
	        var draw_prompt = (function() {
	            function set(prompt) {
	                prompt_node.html($.terminal.format($.terminal.encode(prompt)));
	                prompt_len = prompt_node.text().length;
	            }
	            return function() {
	                switch (typeof prompt) {
	                    case 'string':
	                        set(prompt);
	                        break;
	                    case 'function':
	                        prompt(set);
	                        break;
	                }
	            };
	        })();
	        // ---------------------------------------------------------------------
	        // :: Paste content to terminal using hidden textarea
	        // ---------------------------------------------------------------------
	        function paste(e) {
	            if (paste_count++ > 0) {
	                return;
	            }
	            if (e.originalEvent) {
	                e = e.originalEvent;
	            }
	            if (self.isenabled()) {
	                var clip = self.find('textarea');
	                if (!clip.is(':focus')) {
	                    clip.focus();
	                }
	                //wait until Browser insert text to textarea
	                self.oneTime(100, function() {
	                    self.insert(clip.val());
	                    clip.val('');
	                    fake_mobile_entry();
	                });
	            }
	        }
	        var first_up_history = true;
	        // prevent_keypress - hack for Android that was inserting characters on
	        // backspace
	        var prevent_keypress = false;
	        var no_keypress;
	        // ---------------------------------------------------------------------
	        // :: Keydown Event Handler
	        // ---------------------------------------------------------------------
	        function keydown_event(e) {
	            var result, pos, len;
	            if (enabled) {
	                if ($.isFunction(options.keydown)) {
	                    result = options.keydown(e);
	                    if (result !== undefined) {
	                        //prevent_keypress = true;
	                        return result;
	                    }
	                }
	                if (e.which !== 38 &&
	                    !(e.which === 80 && e.ctrlKey)) {
	                    first_up_history = true;
	                }
	                // arrows / Home / End / ENTER
	                if (reverse_search && (e.which === 35 || e.which === 36 ||
	                                       e.which === 37 || e.which === 38 ||
	                                       e.which === 39 || e.which === 40 ||
	                                       e.which === 13 || e.which === 27)) {
	                    clear_reverse_state();
	                    draw_prompt();
	                    if (e.which === 27) { // ESC
	                        self.set('');
	                    }
	                    redraw();
	                    // finish reverse search and execute normal event handler
	                    /* jshint validthis:true */
	                    keydown_event.call(this, e);
	                } else if (e.altKey) {
	                    // Chrome on Windows sets ctrlKey and altKey for alt
	                    // need to check for alt first
	                    //if (e.which === 18) { // press ALT
	                    if (e.which === 68) { //ALT+D
	                        self.set(command.slice(0, position) +
	                                 command.slice(position).
	                                 replace(/ *[^ ]+ *(?= )|[^ ]+$/, ''), true);
	                        // chrome jump to address bar
	                        return false;
	                    }
	                    return true;
	                } else if (e.keyCode === 13) { //enter
	                    if (e.shiftKey) {
	                        self.insert('\n');
	                    } else {
	                        if (history && command && !mask &&
	                            ($.isFunction(options.historyFilter) &&
	                             options.historyFilter(command)) ||
	                            (options.historyFilter instanceof RegExp &&
	                             command.match(options.historyFilter)) ||
	                            !options.historyFilter) {
	                            history.append(command);
	                        }
	                        var tmp = command;
	                        history.reset();
	                        self.set('');
	                        if (options.commands) {
	                            options.commands(tmp);
	                        }
	                        if ($.isFunction(prompt)) {
	                            draw_prompt();
	                        }
	                    }
	                } else if (e.which === 8) { //backspace
	                    if (reverse_search) {
	                        rev_search_str = rev_search_str.slice(0, -1);
	                        draw_reverse_prompt();
	                    } else {
	                        if (command !== '' && position > 0) {
	                            self['delete'](-1);
	                        }
	                    }
	                    if (is_touch) {
	                        return true; // mobile fix
	                    }
	                } else if (e.which === 67 && e.ctrlKey && e.shiftKey) {
	                    // CTRL+SHIFT+C
	                    selected_text = get_selected_text();
	                } else if (e.which === 86 && e.ctrlKey && e.shiftKey) {
	                    if (selected_text !== '') {
	                        self.insert(selected_text);
	                    }
	                } else if (e.which === 9 && !(e.ctrlKey || e.altKey)) { // TAB
	                    self.insert('\t');
	                } else if (e.which === 46) {
	                    //DELETE
	                    self['delete'](1);
	                    return;
	                } else if (history && (e.which === 38 && !e.ctrlKey) ||
	                           (e.which === 80 && e.ctrlKey)) {
	                    //UP ARROW or CTRL+P
	                    if (first_up_history) {
	                        last_command = command;
	                        self.set(history.current());
	                    } else {
	                        self.set(history.previous());
	                    }
	                    first_up_history = false;
	                } else if (history && (e.which === 40 && !e.ctrlKey) ||
	                           (e.which === 78 && e.ctrlKey)) {
	                    //DOWN ARROW or CTRL+N
	                    self.set(history.end() ? last_command : history.next());
	                } else if (e.which === 37 || (e.which === 66 && e.ctrlKey)) {
	                    //CTRL+LEFT ARROW or CTRL+B
	                    if (e.ctrlKey && e.which !== 66) {
	                        len = position - 1;
	                        pos = 0;
	                        if (command[len] === ' ') {
	                            --len;
	                        }
	                        for (var i = len; i > 0; --i) {
	                            if (command[i] === ' ' && command[i+1] !== ' ') {
	                                pos = i + 1;
	                                break;
	                            } else if (command[i] === '\n' &&
	                                       command[i+1] !== '\n') {
	                                pos = i;
	                                break;
	                            }
	                        }
	                        self.position(pos);
	                    } else {
	                        //LEFT ARROW or CTRL+B
	                        if (position > 0) {
	                            self.position(-1, true);
	                            redraw();
	                        }
	                    }
	                } else if (e.which === 82 && e.ctrlKey) { // CTRL+R
	                    if (reverse_search) {
	                        reverse_history_search(true);
	                    } else {
	                        backup_prompt = prompt;
	                        draw_reverse_prompt();
	                        last_command = command;
	                        self.set('');
	                        redraw();
	                        reverse_search = true;
	                    }
	                } else if (e.which == 71 && e.ctrlKey) { // CTRL+G
	                    if (reverse_search) {
	                        prompt = backup_prompt;
	                        draw_prompt();
	                        self.set(last_command);
	                        redraw();
	                        reverse_search = false;
	                        rev_search_str = '';
	                    }
	                } else if (e.which === 39 ||
	                           (e.which === 70 && e.ctrlKey)) {
	                    //RIGHT ARROW OR CTRL+F
	                    if (e.ctrlKey && e.which !== 70) {
	                        // jump to beginning or end of the word
	                        if (command[position] === ' ') {
	                            ++position;
	                        }
	                        var re = /\S[\n\s]{2,}|[\n\s]+\S?/;
	                        var match = command.slice(position).match(re);
	                        if (!match || match[0].match(/^\s+$/)) {
	                            self.position(command.length);
	                        } else {
	                            if (match[0][0] !== ' ') {
	                                position += match.index + 1;
	                            } else {
	                                position += match.index + match[0].length - 1;
	                                if (match[0][match[0].length-1] !== ' ') {
	                                    --position;
	                                }
	                            }
	                        }
	                        redraw();
	                    } else {
	                        if (position < command.length) {
	                            self.position(1, true);
	                        }
	                    }
	                } else if (e.which === 123) { // F12 - Allow Firebug
	                    return;
	                } else if (e.which === 36) { // HOME
	                    self.position(0);
	                } else if (e.which === 35) { // END
	                    self.position(command.length);
	                } else if (e.shiftKey && e.which == 45) { // Shift+Insert
	                    clip.val(''); // so we get it before paste event
	                    paste_count = 0;
	                    if (!is_paste_supported) {
	                        paste(e);
	                    } else {
	                        clip.focus();
	                    }
	                    return;
	                } else if (e.ctrlKey || e.metaKey) {
	                    if (e.which === 192) { // CMD+` switch browser window on Mac
	                        return;
	                    }
	                    if (e.metaKey) {
	                        if(e.which === 82) { // CMD+r page reload in Chrome Mac
	                            return;
	                        } else if(e.which === 76) {
	                            // CMD+l jump into Omnibox on Chrome Mac
	                            return;
	                        }
	                    }
	                    if (e.shiftKey) { // CTRL+SHIFT+??
	                        if (e.which === 84) {
	                            //CTRL+SHIFT+T open closed tab
	                            return;
	                        }
	                    //} else if (e.altKey) { //ALT+CTRL+??
	                    } else {
	                        if (e.which === 81) { // CTRL+W
	                            // don't work in Chromium (can't prevent close tab)
	                            if (command !== '' && position !== 0) {
	                                var m = command.slice(0, position).match(/([^ ]+ *$)/);
	                                kill_text = self['delete'](-m[0].length);
	                            }
	                            return false;
	                        } else if (e.which === 72) { // CTRL+H
	                            if (command !== '' && position > 0) {
	                                self['delete'](-1);
	                            }
	                            return false;
	                        //NOTE: in opera charCode is undefined
	                        } else if (e.which === 65) {
	                            //CTRL+A
	                            self.position(0);
	                        } else if (e.which === 69) {
	                            //CTRL+E
	                            self.position(command.length);
	                        } else if (e.which === 88 || e.which === 67 ||
	                                   e.which === 84) {
	                            //CTRL+X CTRL+C CTRL+W CTRL+T
	                            return;
	                        } else if (e.which === 89) { // CTRL+Y
	                            if (kill_text !== '') {
	                                self.insert(kill_text);
	                            }
	                        } else if (e.which === 86 || e.which === 118) { // CTRL+V
	                            clip.val('');
	                            paste_count = 0;
	                            if (!is_paste_supported) {
	                                paste(e);
	                            } else {
	                                clip.focus();
	                                clip.on('input', function input(e) {
	                                    paste(e);
	                                    clip.off('input', input);
	                                });
	                            }
	                            return;
	                        } else if (e.which === 75) { // CTRL+K
	                            kill_text = self['delete'](command.length-position);
	                        } else if (e.which === 85) { // CTRL+U
	                            if (command !== '' && position !== 0) {
	                                kill_text = self['delete'](-position);
	                            }
	                        } else if (e.which === 17) { //CTRL+TAB switch tab
	                            return false;
	                        }
	                    }
	                } else {
	                    prevent_keypress = false;
	                    no_keypress = true;
	                    return;
	                }
	                // this will prevent for instance backspace to go back one page
	                //prevent_keypress = true;
	                e.preventDefault();
	            }
	        }
	        function fire_change_command() {
	            if ($.isFunction(options.onCommandChange)) {
	                options.onCommandChange(command);
	            }
	        }
	        // ---------------------------------------------------------------------
	        // :: Command Line Methods
	        // ---------------------------------------------------------------------
	        $.extend(self, {
	            name: function(string) {
	                if (string !== undefined) {
	                    name = string;
	                    var enabled = history && history.enabled() || !history;
	                    history = new History(string, historySize);
	                    // disable new history if old was disabled
	                    if (!enabled) {
	                        history.disable();
	                    }
	                    return self;
	                } else {
	                    return name;
	                }
	            },
	            purge: function() {
	                history.clear();
	                return self;
	            },
	            history: function() {
	                return history;
	            },
	            'delete': function(n, stay) {
	                var removed;
	                if (n === 0) {
	                    return self;
	                } else if (n < 0) {
	                    if (position > 0) {
	                        // this may look weird but if n is negative we need
	                        // to use +
	                        removed = command.slice(0, position).slice(n);
	                        command = command.slice(0, position + n) +
	                            command.slice(position, command.length);
	                        if (!stay) {
	                            self.position(position+n);
	                        } else {
	                            fire_change_command();
	                        }
	                    }
	                } else {
	                    if (command !== '' && position < command.length) {
	                        removed = command.slice(position).slice(0, n);
	                        command = command.slice(0, position) +
	                            command.slice(position + n, command.length);
	                        fire_change_command();
	                    }
	                }
	                redraw();
	                fake_mobile_entry();
	                return removed;
	            },
	            set: function(string, stay) {
	                if (string !== undefined) {
	                    command = string;
	                    if (!stay) {
	                        self.position(command.length);
	                    }
	                    redraw();
	                    fake_mobile_entry();
	                    fire_change_command();
	                }
	                return self;
	            },
	            insert: function(string, stay) {
	                if (position === command.length) {
	                    command += string;
	                } else if (position === 0) {
	                    command = string + command;
	                } else {
	                    command = command.slice(0, position) +
	                        string + command.slice(position);
	                }
	                if (!stay) {
	                    self.position(string.length, true);
	                } else {
	                    fake_mobile_entry();
	                }
	                redraw();
	                fire_change_command();
	                return self;
	            },
	            get: function() {
	                return command;
	            },
	            commands: function(commands) {
	                if (commands) {
	                    options.commands = commands;
	                    return self;
	                } else {
	                    return commands;
	                }
	            },
	            destroy: function() {
	                doc.unbind('keypress.cmd', keypress_event);
	                doc.unbind('keydown.cmd', keydown_event);
	                doc.unbind('paste.cmd', paste);
	                doc.unbind('input.cmd', input);
	                self.stopTime('blink', blink);
	                self.find('.cursor').next().remove().end().prev().remove().
	                    end().remove();
	                self.find('.prompt, .clipboard').remove();
	                self.removeClass('cmd').removeData('cmd');
	                return self;
	            },
	            prompt: function(user_prompt) {
	                if (user_prompt === undefined) {
	                    return prompt;
	                } else {
	                    if (typeof user_prompt === 'string' ||
	                        typeof user_prompt === 'function') {
	                        prompt = user_prompt;
	                    } else {
	                        throw new Error('prompt must be a function or string');
	                    }
	                    draw_prompt();
	                    // we could check if command is longer then numchars-new
	                    // prompt
	                    redraw();
	                    return self;
	                }
	            },
	            kill_text: function() {
	                return kill_text;
	            },
	            position: function(n, relative) {
	                if (typeof n === 'number') {
	                    // if (position !== n) { this don't work, don't know why
	                    if (relative) {
	                        position += n;
	                    } else {
	                        if (n < 0) {
	                            position = 0;
	                        } else if (n > command.length) {
	                            position = command.length;
	                        } else {
	                            position = n;
	                        }
	                    }
	                    if ($.isFunction(options.onPositionChange)) {
	                        options.onPositionChange(position);
	                    }
	                    redraw();
	                    fake_mobile_entry();
	                    return self;
	                } else {
	                    return position;
	                }
	            },
	            visible: (function() {
	                var visible = self.visible;
	                return function() {
	                    visible.apply(self, []);
	                    redraw();
	                    draw_prompt();
	                };
	            })(),
	            show: (function() {
	                var show = self.show;
	                return function() {
	                    show.apply(self, []);
	                    redraw();
	                    draw_prompt();
	                };
	            })(),
	            resize: function(num) {
	                if (num) {
	                    num_chars = num;
	                } else {
	                    change_num_chars();
	                }
	                redraw();
	                return self;
	            },
	            enable: function() {
	                enabled = true;
	                self.addClass('enabled');
	                animation(true);
	                mobile_focus();
	                return self;
	            },
	            isenabled: function() {
	                return enabled;
	            },
	            disable: function() {
	                enabled = false;
	                self.removeClass('enabled');
	                animation(false);
	                mobile_focus();
	                return self;
	            },
	            mask: function(new_mask) {
	                if (typeof new_mask === 'undefined') {
	                    return mask;
	                } else {
	                    mask = new_mask;
	                    redraw();
	                    return self;
	                }
	            }
	        });
	        // ---------------------------------------------------------------------
	        // :: INIT
	        // ---------------------------------------------------------------------
	        self.name(options.name || options.prompt || '');
	        if (typeof options.prompt == 'string') {
	            prompt = options.prompt;
	        } else {
	            prompt = '> ';
	        }
	        draw_prompt();
	        if (options.enabled === undefined || options.enabled === true) {
	            self.enable();
	        }
	        // Keystrokes
	        var object;
	        var doc = $(document.documentElement || window);
	        function keypress_event(e) {
	            var result;
	            no_keypress = false;
	            if ((e.ctrlKey || e.metaKey) && ([99, 118, 86].indexOf(e.which) !== -1)) {
	                // CTRL+C or CTRL+V
	                return;
	            }
	            if (prevent_keypress) {
	                return;
	            }
	            if (!reverse_search && $.isFunction(options.keypress)) {
	                result = options.keypress(e);
	            }
	            //$.terminal.active().echo(JSON.stringify(result));
	            if (result === undefined || result) {
	                if (enabled) {
	                    if ($.inArray(e.which, [38, 13, 0, 8]) > -1 &&
	                        //!(e.which === 40 && e.shiftKey ||
	                        !(e.which === 38 && e.shiftKey)) {
	                        if (e.keyCode == 123) { // for F12 which == 0
	                            return;
	                        }
	                        return false;
	                    } else if (!e.ctrlKey && !(e.altKey && e.which === 100) ||
	                               e.altKey) { // ALT+D
	                        if (reverse_search) {
	                            rev_search_str += String.fromCharCode(e.which);
	                            reverse_history_search();
	                            draw_reverse_prompt();
	                        } else {
	                            self.insert(String.fromCharCode(e.which));
	                        }
	                        return false;
	                    }
	                }
	            } else {
	                return result;
	            }
	        }
	        function input(e) {
	            if (no_keypress) {
	                // Some Androids don't fire keypress - #39
	                var val = clip.val();
	                if (val || e.which == 8) {  // #209 ; 8 - backspace
	                    self.set(val);
	                }
	            }
	        }
	        doc.bind('keypress.cmd', keypress_event).bind('keydown.cmd', keydown_event).
	            bind('input.cmd', input);
	        // characters
	        self.data('cmd', self);
	        return self;
	    }; // cmd plugin
	
	    // -------------------------------------------------------------------------
	    // :: TOOLS
	    // -------------------------------------------------------------------------
	    function skip_formatting_count(string) {
	        // this will covert html entities to single characters
	        return $('<div>' + $.terminal.strip(string) + '</div>').text().length;
	    }
	    // -------------------------------------------------------------------------
	    function formatting_count(string) {
	        return string.length - skip_formatting_count(string);
	    }
	    // -------------------------------------------------------------------------
	    // taken from https://hacks.mozilla.org/2011/09/detecting-and-generating-
	    // css-animations-in-javascript/
	    var support_animations = (function() {
	        var animation = false,
	            animationstring = 'animation',
	            keyframeprefix = '',
	            domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
	            pfx  = '',
	            elm = document.createElement('div');
	        if (elm.style.animationName) { animation = true; }
	        if (animation === false) {
	            for (var i = 0; i < domPrefixes.length; i++) {
	                var name = domPrefixes[i] + 'AnimationName';
	                if (elm.style[ name ] !== undefined) {
	                    pfx = domPrefixes[i];
	                    animationstring = pfx + 'Animation';
	                    keyframeprefix = '-' + pfx.toLowerCase() + '-';
	                    animation = true;
	                    break;
	                }
	            }
	        }
	        return animation;
	    })();
	    // -------------------------------------------------------------------------
	    var is_android = navigator.userAgent.toLowerCase().indexOf("android") != -1;
	    // -------------------------------------------------------------------------
	    var is_touch = (function() {
	        return ('ontouchstart' in window) || window.DocumentTouch &&
	            document instanceof DocumentTouch;
	    })();
	    // -------------------------------------------------------------------------
	    function process_command(string, fn) {
	        var array = fn(string);
	        if (array.length) {
	            var name = array.shift();
	            var regex = new RegExp('^' + $.terminal.escape_regex(name));
	            var rest = string.replace(regex, '').trim();
	            return {
	                command: string,
	                name: name,
	                args: array,
	                rest: rest
	            };
	        } else {
	            return {
	                command: string,
	                name: '',
	                args: [],
	                rest: ''
	            };
	        }
	    }
	    // -------------------------------------------------------------------------
	    var format_split_re = /(\[\[[!gbiuso]*;[^;]*;[^\]]*\](?:[^\]]*\\\][^\]]*|[^\]]*|[^\[]*\[[^\]]*)\]?)/i;
	    var format_parts_re = /\[\[([!gbiuso]*);([^;]*);([^;\]]*);?([^;\]]*);?([^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^\[]*\[[^\]]*)\]?/gi;
	    var format_re = /\[\[([!gbiuso]*;[^;\]]*;[^;\]]*(?:;|[^\]()]*);?[^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^\[]*\[[^\]]*)\]?/gi;
	    var format_exist_re = /\[\[([!gbiuso]*;[^;\]]*;[^;\]]*(?:;|[^\]()]*);?[^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^\[]*\[[^\]]*)\]/gi;
	    var format_full_re = /^\[\[([!gbiuso]*;[^;\]]*;[^;\]]*(?:;|[^\]()]*);?[^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^\[]*\[[^\]]*)\]$/gi;
	    var color_hex_re = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
	    //var url_re = /https?:\/\/(?:(?!&[^;]+;)[^\s:"'<>)])+/g;
	    //var url_re = /\bhttps?:\/\/(?:(?!&[^;]+;)[^\s"'<>)])+\b/g;
	    var url_re = /(\bhttps?:\/\/(?:(?:(?!&[^;]+;)|(?=&amp;))[^\s"'<>\]\[)])+\b)/gi;
	    var url_nf_re = /\b(https?:\/\/(?:(?:(?!&[^;]+;)|(?=&amp;))[^\s"'<>\][)])+)\b(?![^[\]]*])/gi;
	    var email_re = /((([^<>('")[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))/g;
	    var command_re = /('[^']*'|"(\\"|[^"])*"|(?:\/(\\\/|[^\/])+\/[gimy]*)(?=:? |$)|(\\ |[^ ])+|[\w-]+)/gi;
	    var format_begin_re = /(\[\[[!gbiuso]*;[^;]*;[^\]]*\])/i;
	    var format_start_re = /^(\[\[[!gbiuso]*;[^;]*;[^\]]*\])/i;
	    var format_last_re = /\[\[[!gbiuso]*;[^;]*;[^\]]*\]?$/i;
	    var format_exec_re = /(\[\[(?:[^\]]|\\\])*\]\])/;
	    $.terminal = {
	        version: '0.11.10',
	        // colors from http://www.w3.org/wiki/CSS/Properties/color/keywords
	        color_names: [
	            'black', 'silver', 'gray', 'white', 'maroon', 'red', 'purple',
	            'fuchsia', 'green', 'lime', 'olive', 'yellow', 'navy', 'blue',
	            'teal', 'aqua', 'aliceblue', 'antiquewhite', 'aqua', 'aquamarine',
	            'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue',
	            'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse',
	            'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson',
	            'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray',
	            'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta',
	            'darkolivegreen', 'darkorange', 'darkorchid', 'darkred',
	            'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray',
	            'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink',
	            'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick',
	            'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite',
	            'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey',
	            'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki',
	            'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon',
	            'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow',
	            'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon',
	            'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey',
	            'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen',
	            'magenta', 'maroon', 'mediumaquamarine', 'mediumblue',
	            'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue',
	            'mediumspringgreen', 'mediumturquoise', 'mediumvioletred',
	            'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite',
	            'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered',
	            'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise',
	            'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum',
	            'powderblue', 'purple', 'red', 'rosybrown', 'royalblue',
	            'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell',
	            'sienna', 'silver', 'skyblue', 'slateblue', 'slategray',
	            'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'teal',
	            'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white',
	            'whitesmoke', 'yellow', 'yellowgreen'],
	        // ---------------------------------------------------------------------
	        // :: Validate html color (it can be name or hex)
	        // ---------------------------------------------------------------------
	        valid_color: function(color) {
	            if (color.match(color_hex_re)) {
	                return true;
	            } else {
	                return $.inArray(color.toLowerCase(),
	                                 $.terminal.color_names) !== -1;
	            }
	        },
	        // ---------------------------------------------------------------------
	        // :: Escape all special regex characters, so it can be use as regex to
	        // :: match exact string that contain those characters
	        // ---------------------------------------------------------------------
	        escape_regex: function(str) {
	            if (typeof str == 'string') {
	                var special = /([-\\\^$\[\]()+{}?*.|])/g;
	                return str.replace(special, '\\$1');
	            }
	        },
	        // ---------------------------------------------------------------------
	        // :: test if string contain formatting
	        // ---------------------------------------------------------------------
	        have_formatting: function(str) {
	            return typeof str == 'string' && !!str.match(format_exist_re);
	        },
	        is_formatting: function(str) {
	            return typeof str == 'string' && !!str.match(format_full_re);
	        },
	        // ---------------------------------------------------------------------
	        // :: return array of formatting and text between them
	        // ---------------------------------------------------------------------
	        format_split: function(str) {
	            return str.split(format_split_re);
	        },
	        // ---------------------------------------------------------------------
	        // :: split text into lines with equal length so each line can be
	        // :: rendered separately (text formatting can be longer then a line).
	        // ---------------------------------------------------------------------
	        split_equal: function(str, length, words) {
	            var formatting = false;
	            var in_text = false;
	            var prev_format = '';
	            var result = [];
	            // add format text as 5th paramter to formatting it's used for
	            // data attribute in format function
	            var array = str.replace(format_re, function(_, format, text) {
	                var semicolons = format.match(/;/g).length;
	                // missing semicolons
	                if (semicolons >= 4) {
	                    return _;
	                } else if (semicolons == 2) {
	                    semicolons = ';;';
	                } else if (semicolons == 3) {
	                    semicolons = ';';
	                } else {
	                    semicolons = '';
	                }
	                // return '[[' + format + ']' + text + ']';
	                // closing braket will break formatting so we need to escape
	                // those using html entity equvalent
	                var safe = text.replace(/\\\]/g, '&#93;').replace(/\n/g, '\\n').
	                    replace(/&nbsp;/g, ' ');
	                return '[[' + format + semicolons + safe + ']' + text + ']';
	            }).split(/\n/g);
	            function is_space() {
	                return line.substring(j-6, j) == '&nbsp;' ||
	                    line.substring(j-1, j) == ' ';
	            }
	            for (var i = 0, len = array.length; i < len; ++i) {
	                if (array[i] === '') {
	                    result.push('');
	                    continue;
	                }
	                var line = array[i];
	                var first_index = 0;
	                var count = 0;
	                var space = -1;
	                for (var j=0, jlen=line.length; j<jlen; ++j) {
	                    if (line.substring(j).match(format_start_re)) {
	                        formatting = true;
	                        in_text = false;
	                    } else if (formatting && line[j] === ']') {
	                        if (in_text) {
	                            formatting = false;
	                            in_text = false;
	                        } else {
	                            in_text = true;
	                        }
	                    } else if ((formatting && in_text) || !formatting) {
	                        if (line[j] === '&') { // treat entity as one character
	                            var m = line.substring(j).match(/^(&[^;]+;)/);
	                            if (!m) {
	                                // should never happen if used by terminal,
	                                // because it always calls $.terminal.encode
	                                // before this function
	                                throw new Error("Unclosed html entity in line " +
	                                                (i+1) + ' at char ' + (j+1));
	                            }
	                            j+=m[1].length-2; // because continue adds 1 to j
	                            // if entity is at the end there is no next loop
	                            // issue #77
	                            if (j === jlen-1) {
	                                result.push(output + m[1]);
	                            }
	                            continue;
	                        } else if (line[j] === ']' && line[j-1] === '\\') {
	                            // escape \] counts as one character
	                            --count;
	                        } else {
	                            ++count;
	                        }
	                    }
	                    if (is_space() && ((formatting && in_text) || !formatting ||
	                                      (line[j] === '[' && line[j+1] === '['))) {
	                        space = j;
	                    }
	                    if ((count === length || j === jlen-1) &&
	                        ((formatting && in_text) || !formatting)) {
	                        var output;
	                        var text = $.terminal.strip(line.substring(space));
	                        text = $('<span>' + text + '</span>').text();
	                        var text_len = text.length;
	                        text = text.substring(0, j+length+1);
	                        var can_break = !!text.match(/\s/) || j+length+1 > text_len;
	                        if (words && space != -1 && j !== jlen-1 && can_break) {
	                            output = line.substring(first_index, space);
	                            j = space-1;
	                        } else {
	                            output = line.substring(first_index, j+1);
	                        }
	                        if (words) {
	                            output = output.replace(/(&nbsp;|\s)+$/g, '');
	                        }
	                        space = -1;
	                        first_index = j+1;
	                        count = 0;
	                        if (prev_format) {
	                            output = prev_format + output;
	                            if (output.match(']')) {
	                                prev_format = '';
	                            }
	                        }
	                        // Fix output if formatting not closed
	                        var matched = output.match(format_re);
	                        if (matched) {
	                            var last = matched[matched.length-1];
	                            if (last[last.length-1] !== ']') {
	                                prev_format = last.match(format_begin_re)[1];
	                                output += ']';
	                            } else if (output.match(format_last_re)) {
	                                var line_len = output.length;
	                                // why this line ???
	                                //var f_len = line_len-last[last.length-1].length;
	                                output = output.replace(format_last_re, '');
	                                prev_format = last.match(format_begin_re)[1];
	                            }
	                        }
	                        result.push(output);
	                    }
	                }
	            }
	            return result;
	        },
	        // ---------------------------------------------------------------------
	        // :: Encode formating as html for insertion into DOM
	        // ---------------------------------------------------------------------
	        encode: function(str) {
	            // don't escape entities
	            str = str.replace(/&(?!#[0-9]+;|[a-zA-Z]+;)/g, '&amp;');
	            return str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
	                .replace(/ /g, '&nbsp;')
	                .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
	        },
	        // ---------------------------------------------------------------------
	        // :: safe function that will render text as it is
	        // ---------------------------------------------------------------------
	        escape_formatting: function(string) {
	            return $.terminal.escape_brackets($.terminal.encode(string));
	        },
	        // ---------------------------------------------------------------------
	        // :: Replace terminal formatting with html
	        // ---------------------------------------------------------------------
	        format: function(str, options) {
	            var settings = $.extend({}, {
	                linksNoReferrer: false
	            }, options || {});
	            if (typeof str === 'string') {
	                //support for formating foo[[u;;]bar]baz[[b;#fff;]quux]zzz
	                var splitted = $.terminal.format_split(str);
	                str = $.map(splitted, function(text) {
	                    if (text === '') {
	                        return text;
	                    } else if ($.terminal.is_formatting(text)) {
	                        // fix &nbsp; inside formatting because encode is called
	                        // before format
	                        text = text.replace(/\[\[[^\]]+\]/, function(text) {
	                            return text.replace(/&nbsp;/g, ' ');
	                        });
	                        return text.replace(format_parts_re, function(s,
	                                                                      style,
	                                                                      color,
	                                                                      background,
	                                                                      _class,
	                                                                      data_text,
	                                                                      text) {
	                            if (text === '') {
	                                return ''; //'<span>&nbsp;</span>';
	                            }
	                            text = text.replace(/\\]/g, ']');
	                            var style_str = '';
	                            if (style.indexOf('b') !== -1) {
	                                style_str += 'font-weight:bold;';
	                            }
	                            var text_decoration = [];
	                            if (style.indexOf('u') !== -1) {
	                                text_decoration.push('underline');
	                            }
	                            if (style.indexOf('s') !== -1) {
	                                text_decoration.push('line-through');
	                            }
	                            if (style.indexOf('o') !== -1) {
	                                text_decoration.push('overline');
	                            }
	                            if (text_decoration.length) {
	                                style_str += 'text-decoration:' +
	                                    text_decoration.join(' ') + ';';
	                            }
	                            if (style.indexOf('i') !== -1) {
	                                style_str += 'font-style:italic;';
	                            }
	                            if ($.terminal.valid_color(color)) {
	                                style_str += 'color:' + color + ';';
	                                if (style.indexOf('g') !== -1) {
	                                    style_str += 'text-shadow:0 0 5px ' + color + ';';
	                                }
	                            }
	                            if ($.terminal.valid_color(background)) {
	                                style_str += 'background-color:' + background;
	                            }
	                            var data;
	                            if (data_text === '') {
	                                data = text;
	                            } else {
	                                data = data_text.replace(/&#93;/g, ']');
	                            }
	                            var result;
	                            if (style.indexOf('!') !== -1) {
	                                if (data.match(email_re)) {
	                                    result = '<a href="mailto:' + data + '" ';
	                                } else {
	                                    result = '<a target="_blank" href="' + data + '" ';
	                                    if (settings.linksNoReferrer) {
	                                        result += 'rel="noreferrer" ';
	                                    }
	                                }
	                            } else {
	                                result = '<span';
	                            }
	                            if (style_str !== '') {
	                                result += ' style="' + style_str + '"';
	                            }
	                            if (_class !== '') {
	                                result += ' class="' + _class + '"';
	                            }
	                            if (style.indexOf('!') !== -1) {
	                                result += '>' + text + '</a>';
	                            } else {
	                                result += ' data-text="' +
	                                    data.replace('"', '&quote;') + '">' +
	                                    text + '</span>';
	                            }
	                            return result;
	                        });
	                    } else {
	                        return '<span>' + text.replace(/\\\]/g, ']') + '</span>';
	                    }
	                }).join('');
	                return str.replace(/<span><br\s*\/?><\/span>/gi, '<br/>');
	            } else {
	                return '';
	            }
	        },
	        // ---------------------------------------------------------------------
	        // :: Replace brackets with html entities
	        // ---------------------------------------------------------------------
	        escape_brackets: function(string) {
	            return string.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;');
	        },
	        // ---------------------------------------------------------------------
	        // :: Remove formatting from text
	        // ---------------------------------------------------------------------
	        strip: function(str) {
	            return str.replace(format_parts_re, '$6');
	        },
	        // ---------------------------------------------------------------------
	        // :: Return active terminal
	        // ---------------------------------------------------------------------
	        active: function() {
	            return terminals.front();
	        },
	        // implmentation detail id is always length of terminals Cycle
	        last_id: function() {
	            var len = terminals.length();
	            if (len) {
	                return len - 1;
	            }
	        },
	        // keep old as backward compatible
	        parseArguments: function(string) {
	            return $.terminal.parse_arguments(string);
	        },
	        splitArguments: function(string) {
	            return $.terminal.split_arguments(string);
	        },
	        parseCommand: function(string) {
	            return $.terminal.parse_command(string);
	        },
	        splitCommand: function(string) {
	            return $.terminal.split_command(string);
	        },
	        // ---------------------------------------------------------------------
	        // :: Function splits arguments and works with strings like
	        // :: 'asd' 'asd\' asd' "asd asd" asd\ 123 -n -b / [^ ]+ / /\s+/ asd\ a
	        // :: it creates a regex and numbers and replaces escape characters in
	        // :: double quotes
	        // ---------------------------------------------------------------------
	        parse_arguments: function(string) {
	            var float_re = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
	            return $.map(string.match(command_re) || [], function(arg) {
	                if (arg[0] === "'" && arg[arg.length-1] === "'") {
	                    return arg.replace(/^'|'$/g, '');
	                } else if (arg[0] === '"' && arg[arg.length-1] === '"') {
	                    arg = arg.replace(/^"|"$/g, '').replace(/\\([" ])/g, '$1');
	                    return arg.replace(/\\\\|\\t|\\n/g, function(string) {
	                        if (string[1] === 't') {
	                            return '\t';
	                        } else if (string[1] === 'n') {
	                            return '\n';
	                        } else {
	                            return '\\';
	                        }
	                    }).replace(/\\x([0-9a-f]+)/gi, function(_, hex) {
	                        return String.fromCharCode(parseInt(hex, 16));
	                    }).replace(/\\0([0-7]+)/g, function(_, oct) {
	                        return String.fromCharCode(parseInt(oct, 8));
	                    });
	                } else if (arg.match(/^\/(\\\/|[^\/])+\/[gimy]*$/)) { // RegEx
	                    var m = arg.match(/^\/([^\/]+)\/([^\/]*)$/);
	                    return new RegExp(m[1], m[2]);
	                } else if (arg.match(/^-?[0-9]+$/)) {
	                    return parseInt(arg, 10);
	                } else if (arg.match(float_re)) {
	                    return parseFloat(arg);
	                } else {
	                    return arg.replace(/\\ /g, ' ');
	                }
	            });
	        },
	        // ---------------------------------------------------------------------
	        // :: Split arguments: it only strips single and double quotes and
	        // :: escapes spaces
	        // ---------------------------------------------------------------------
	        split_arguments: function(string) {
	            return $.map(string.match(command_re) || [], function(arg) {
	                if (arg[0] === "'" && arg[arg.length-1] === "'") {
	                    return arg.replace(/^'|'$/g, '');
	                } else if (arg[0] === '"' && arg[arg.length-1] === '"') {
	                    return arg.replace(/^"|"$/g, '').replace(/\\([" ])/g, '$1');
	                } else if (arg.match(/\/.*\/[gimy]*$/)) {
	                    return arg;
	                } else {
	                    return arg.replace(/\\ /g, ' ');
	                }
	            });
	        },
	        // ---------------------------------------------------------------------
	        // :: Function that returns an object {name,args}. Arguments are parsed
	        // :: using the function parse_arguments
	        // ---------------------------------------------------------------------
	        parse_command: function(string) {
	            return process_command(string, $.terminal.parse_arguments);
	        },
	        // ---------------------------------------------------------------------
	        // :: Same as parse_command but arguments are parsed using split_arguments
	        // ---------------------------------------------------------------------
	        split_command: function(string) {
	            return process_command(string, $.terminal.split_arguments);
	        },
	        // ---------------------------------------------------------------------
	        // :: function executed for each text inside [{ .... }]
	        // ---------------------------------------------------------------------
	        extended_command: function(term, string) {
	            try {
	                change_hash = false;
	                term.exec(string, true).then(function() {
	                    change_hash = true;
	                });
	            } catch(e) {
	                // error is process in exec
	            }
	        }
	    };
	
	    // -----------------------------------------------------------------------
	    // Helper plugins
	    // -----------------------------------------------------------------------
	    $.fn.visible = function() {
	        return this.css('visibility', 'visible');
	    };
	    $.fn.hidden = function() {
	        return this.css('visibility', 'hidden');
	    };
	    // -----------------------------------------------------------------------
	    // JSON-RPC CALL
	    // -----------------------------------------------------------------------
	    var ids = {}; // list of url based id of JSON-RPC
	    $.jrpc = function(url, method, params, success, error) {
	        ids[url] = ids[url] || 0;
	        var request = $.json_stringify({
	           'jsonrpc': '2.0', 'method': method,
	            'params': params, 'id': ++ids[url]});
	        return $.ajax({
	            url: url,
	            data: request,
	            success: function(result, status, jqXHR) {
	                var content_type = jqXHR.getResponseHeader('Content-Type');
	                if (!content_type.match(/application\/json/)) {
	                    var msg = 'Response Content-Type is not application/json';
	                    if (console && console.warn) {
	                        console.warn(msg);
	                    } else {
	                        throw new Error('WARN: ' + msg);
	                    }
	                }
	                var json;
	                try {
	                    json = $.parseJSON(result);
	                } catch (e) {
	                    if (error) {
	                        error(jqXHR, 'Invalid JSON', e);
	                    } else {
	                        throw new Error('Invalid JSON');
	                    }
	                    return;
	                }
	                // don't catch errors in success callback
	                success(json, status, jqXHR);
	            },
	            error: error,
	            contentType: 'application/json',
	            dataType: 'text',
	            async: true,
	            cache: false,
	            //timeout: 1,
	            type: 'POST'});
	    };
	    // -----------------------------------------------------------------------
	    /*
	    function is_scrolled_into_view(elem) {
	        var docViewTop = $(window).scrollTop();
	        var docViewBottom = docViewTop + $(window).height();
	
	        var elemTop = $(elem).offset().top;
	        var elemBottom = elemTop + $(elem).height();
	
	        return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
	    }
	    */
	    // -----------------------------------------------------------------------
	    // :: Create fake terminal to calcualte the dimention of one character
	    // :: this will make terminal work if terminal div is not added to the
	    // :: DOM at init like with:
	    // :: $('<div/>').terminal().echo('foo bar').appendTo('body');
	    // -----------------------------------------------------------------------
	    function char_size() {
	        var temp = $('<div class="terminal temp"><div class="cmd"><span cla' +
	                     'ss="cursor">&nbsp;</span></div></div>').appendTo('body');
	        var span = temp.find('span');
	        var result = {
	            width: span.width(),
	            height: span.outerHeight()
	        };
	        temp.remove();
	        return result;
	    }
	    // -----------------------------------------------------------------------
	    // :: calculate numbers of characters
	    // -----------------------------------------------------------------------
	    function get_num_chars(terminal) {
	        var temp = $('<div class="terminal wrap"><span class="cursor">' +
	                     '&nbsp;</span></div>').appendTo('body').css('padding', 0);
	        var span = temp.find('span');
	        var width = span[0].getBoundingClientRect().width;
	        var result = Math.floor(terminal.width() / width);
	        temp.remove();
	        if (have_scrollbars(terminal)) {
	            var SCROLLBAR_WIDTH = 20;
	            // assume that scrollbars are 20px - in my Laptop with
	            // Linux/Chrome they are 16px
	            var margins = terminal.innerWidth() - terminal.width();
	            result -= Math.ceil((SCROLLBAR_WIDTH - margins / 2) / (width-1));
	        }
	        return result;
	    }
	    // -----------------------------------------------------------------------
	    // :: Calculate number of lines that fit without scroll
	    // -----------------------------------------------------------------------
	    function get_num_rows(terminal) {
	        return Math.floor(terminal.height() / char_size().height);
	    }
	    // -----------------------------------------------------------------------
	    // :: Get Selected Text (this is internal because it return text even if
	    // :: it's outside of terminal, is used to paste text to the terminal)
	    // -----------------------------------------------------------------------
	    function get_selected_text() {
	        if (window.getSelection || document.getSelection) {
	            var selection = (window.getSelection || document.getSelection)();
	            if (selection.text) {
	                return selection.text;
	            } else {
	                return selection.toString();
	            }
	        } else if (document.selection) {
	            return document.selection.createRange().text;
	        }
	    }
	    // -----------------------------------------------------------------------
	    // :: check if div have scrollbars (need to have overflow auto or always)
	    // -----------------------------------------------------------------------
	    function have_scrollbars(div) {
	        if (div.css('overflow') == 'scroll' ||
	            div.css('overflow-y') == 'scroll') {
	            return true;
	        } else if (div.is('body')) {
	            return $("body").height() > $(window).height();
	        } else {
	            return div.get(0).scrollHeight > div.innerHeight();
	        }
	    }
	    // -----------------------------------------------------------------------
	    // :: TERMINAL PLUGIN CODE
	    // -----------------------------------------------------------------------
	    var version_set = !$.terminal.version.match(/^\{\{/);
	    var copyright = 'Copyright (c) 2011-2016 Jakub Jankiewicz <http://jcubic'+
	        '.pl>';
	    var version_string = version_set ? ' v. ' + $.terminal.version : ' ';
	    //regex is for placing version string aligned to the right
	    var reg = new RegExp(" {" + version_string.length + "}$");
	    var name_ver = 'jQuery Terminal Emulator' +
	        (version_set ? version_string : '');
	    // -----------------------------------------------------------------------
	    // :: Terminal Signatures
	    // -----------------------------------------------------------------------
	    var signatures = [
	        ['jQuery Terminal', '(c) 2011-2016 jcubic'],
	        [name_ver, copyright.replace(/^Copyright | *<.*>/g, '')],
	        [name_ver, copyright.replace(/^Copyright /, '')],
	        ['      _______                 ________                        __',
	         '     / / _  /_ ____________ _/__  ___/______________  _____  / /',
	         ' __ / / // / // / _  / _/ // / / / _  / _/     / /  \\/ / _ \\/ /',
	         '/  / / // / // / ___/ // // / / / ___/ // / / / / /\\  / // / /__',
	         '\\___/____ \\\\__/____/_/ \\__ / /_/____/_//_/_/_/ /_/  \\/\\__\\_\\___/',
	         '         \\/          /____/                                   '.replace(reg, ' ') +
	         version_string,
	         copyright],
	        ['      __ _____                     ________                              __',
	         '     / // _  /__ __ _____ ___ __ _/__  ___/__ ___ ______ __ __  __ ___  / /',
	         ' __ / // // // // // _  // _// // / / // _  // _//     // //  \\/ // _ \\/ /',
	         '/  / // // // // // ___// / / // / / // ___// / / / / // // /\\  // // / /__',
	         '\\___//____ \\\\___//____//_/ _\\_  / /_//____//_/ /_/ /_//_//_/ /_/ \\__\\_\\___/',
	         '          \\/              /____/                                          '.replace(reg, '') +
	         version_string,
	         copyright]
	    ];
	    // -----------------------------------------------------------------------
	    // :: Default options
	    // -----------------------------------------------------------------------
	    $.terminal.defaults = {
	        prompt: '> ',
	        history: true,
	        exit: true,
	        clear: true,
	        enabled: true,
	        historySize: 60,
	        maskChar: '*',
	        checkArity: true,
	        raw: false,
	        exceptionHandler: null,
	        cancelableAjax: true,
	        processArguments: true,
	        linksNoReferrer: false,
	        processRPCResponse: null,
	        Token: true, // where this came from?
	        convertLinks: true,
	        historyState: false,
	        echoCommand: true,
	        scrollOnEcho: true,
	        login: null,
	        outputLimit: -1,
	        formatters: [],
	        onAjaxError: null,
	        onRPCError: null,
	        completion: false,
	        historyFilter: null,
	        onInit: $.noop,
	        onClear: $.noop,
	        onBlur: $.noop,
	        onFocus: $.noop,
	        onTerminalChange: $.noop,
	        onExit: $.noop,
	        keypress: $.noop,
	        keydown: $.noop,
	        strings: {
	            wrongPasswordTryAgain: "Wrong password try again!",
	            wrongPassword: "Wrong password!",
	            ajaxAbortError: "Error while aborting ajax call!",
	            wrongArity: "Wrong number of arguments. Function '%s' expects %s got"+
	                " %s!",
	            commandNotFound: "Command '%s' Not Found!",
	            oneRPCWithIgnore: "You can use only one rpc with ignoreSystemDescr"+
	                "ibe",
	            oneInterpreterFunction: "You can't use more than one function (rpc"+
	                "with ignoreSystemDescribe counts as one)",
	            loginFunctionMissing: "You didn't specify a login function",
	            noTokenError: "Access denied (no token)",
	            serverResponse: "Server responded",
	            wrongGreetings: "Wrong value of greetings parameter",
	            notWhileLogin: "You can't call `%s' function while in login",
	            loginIsNotAFunction: "Authenticate must be a function",
	            canExitError: "You can't exit from main interpreter",
	            invalidCompletion: "Invalid completion",
	            invalidSelector: 'Sorry, but terminal said that "%s" is not valid '+
	                'selector!',
	            invalidTerminalId: 'Invalid Terminal ID',
	            login: "login",
	            password: "password",
	            recursiveCall: 'Recursive call detected, skip'
	        }
	    };
	    // -------------------------------------------------------------------------
	    // :: All terminal globals
	    // -------------------------------------------------------------------------
	    var requests = []; // for canceling on CTRL+D
	    var terminals = new Cycle(); // list of terminals global in this scope
	    // state for all terminals, terminals can't have own array fo state because
	    // there is only one popstate event
	    var save_state = []; // hold objects returned by export_view by history API
	    var hash_commands;
	    var change_hash = false; // don't change hash on Init
	    var fire_hash_change = true;
	    var first_instance = true; // used by history state
	    var last_id;
	    $.fn.terminal = function(init_interpreter, options) {
	        // ---------------------------------------------------------------------
	        // :: helper function
	        // ---------------------------------------------------------------------
	        function get_processed_command(command) {
	            if ($.isFunction(settings.processArguments)) {
	                return process_command(command, settings.processArguments);
	            } else if (settings.processArguments) {
	                return $.terminal.parse_command(command);
	            } else {
	                return $.terminal.split_command(command);
	            }
	        }
	        // ---------------------------------------------------------------------
	        // :: Display object on terminal
	        // ---------------------------------------------------------------------
	        function display_object(object) {
	            if (typeof object === 'string') {
	                self.echo(object);
	            } else if (object instanceof Array) {
	                self.echo($.map(object, function(object) {
	                    return $.json_stringify(object);
	                }).join(' '));
	            } else if (typeof object === 'object') {
	                self.echo($.json_stringify(object));
	            } else {
	                self.echo(object);
	            }
	        }
	        // Display line code in the file if line numbers are present
	        function print_line(url_spec) {
	            var re = /(.*):([0-9]+):([0-9]+)$/;
	            // google chrome have line and column after filename
	            var m = url_spec.match(re);
	            if (m) {
	                // TODO: do we need to call pause/resume or return promise?
	                self.pause();
	                $.get(m[1], function(response) {
	                    var prefix = location.href.replace(/[^\/]+$/, '');
	                    var file = m[1].replace(prefix, '');
	                    self.echo('[[b;white;]' + file + ']');
	                    var code = response.split('\n');
	                    var n = +m[2]-1;
	                    self.echo(code.slice(n-2, n+3).map(function(line, i) {
	                        if (i == 2) {
	                            line = '[[;#f00;]' +
	                                $.terminal.escape_brackets(line) + ']';
	                        }
	                        return '[' + (n+i) + ']: ' + line;
	                    }).join('\n')).resume();
	                }, 'text');
	            }
	        }
	        // ---------------------------------------------------------------------
	        // :: Helper function
	        // ---------------------------------------------------------------------
	        function display_json_rpc_error(error) {
	            if ($.isFunction(settings.onRPCError)) {
	                settings.onRPCError.call(self, error);
	            } else {
	                self.error('&#91;RPC&#93; ' + error.message);
	                if (error.error && error.error.message) {
	                    error = error.error;
	                    // more detailed error message
	                    var msg = '\t' + error.message;
	                    if (error.file) {
	                        msg += ' in file "' + error.file.replace(/.*\//, '') + '"';
	                    }
	                    if (error.at) {
	                        msg += ' at line ' + error.at;
	                    }
	                    self.error(msg);
	                }
	            }
	        }
	        // ---------------------------------------------------------------------
	        // :: Create interpreter function from url string
	        // ---------------------------------------------------------------------
	        function make_basic_json_rpc(url, auth) {
	            var interpreter = function(method, params) {
	                self.pause();
	                $.jrpc(url, method, params, function(json) {
	                    if (json.error) {
	                        display_json_rpc_error(json.error);
	                    } else {
	                        if ($.isFunction(settings.processRPCResponse)) {
	                            settings.processRPCResponse.call(self, json.result, self);
	                        } else {
	                            display_object(json.result);
	                        }
	                    }
	                    self.resume();
	                }, ajax_error);
	            };
	            //this is the interpreter function
	            return function(command, terminal) {
	                if (command === '') {
	                    return;
	                }
	                try {
	                    command = get_processed_command(command);
	                } catch(e) {
	                    // exception can be thrown on invalid regex
	                    terminal.error(e.toString());
	                    return;
	                    //throw e; // this will show stack in other try..catch
	                }
	                if (!auth || command.name === 'help') {
	                    // allows to call help without a token
	                    interpreter(command.name, command.args);
	                } else {
	                    var token = terminal.token();
	                    if (token) {
	                        interpreter(command.name, [token].concat(command.args));
	                    } else {
	                        //should never happen
	                        terminal.error('&#91;AUTH&#93; ' +
	                                       strings.noTokenError);
	                    }
	                }
	            };
	        }
	        // ---------------------------------------------------------------------
	        // :: Create interpreter function from Object. If the value is object
	        // :: it will create nested interpreters
	        // ---------------------------------------------------------------------
	        function make_object_interpreter(object, arity, login, fallback) {
	            // function that maps commands to object methods
	            // it keeps terminal context
	            return function(user_command, terminal) {
	                if (user_command === '') {
	                    return;
	                }
	                //command = split_command_line(command);
	                var command;
	                try {
	                    command = get_processed_command(user_command);
	                } catch(e) {
	                    // exception can be thrown on invalid regex
	                    self.error(e.toString());
	                    return;
	                    //throw e; // this will show stack in other try..catch
	                }
	                /*
	                if (login) {
	                    var token = self.token(true);
	                    if (token) {
	                        command.args = [token].concat(command.args);
	                    } else {
	                        terminal.error('&#91;AUTH&#93; ' + strings.noTokenError);
	                        return;
	                    }
	                }*/
	                var val = object[command.name];
	                var type = $.type(val);
	                if (type === 'function') {
	                    if (arity && val.length !== command.args.length) {
	                        self.error("&#91;Arity&#93; " +
	                                   sprintf(strings.wrongArity,
	                                           command.name,
	                                           val.length,
	                                           command.args.length));
	                    } else {
	                        return val.apply(self, command.args);
	                    }
	                } else if (type === 'object' || type === 'string') {
	                    var commands = [];
	                    if (type === 'object') {
	                        commands = Object.keys(val);
	                        val = make_object_interpreter(val,
	                                                      arity,
	                                                      login);
	                    }
	                    terminal.push(val, {
	                        prompt: command.name + '> ',
	                        name: command.name,
	                        completion: type === 'object' ? commands : undefined
	                    });
	                } else {
	                    if ($.isFunction(fallback)) {
	                        fallback(user_command, self);
	                    } else if ($.isFunction(settings.onCommandNotFound)) {
	                        settings.onCommandNotFound(user_command, self);
	                    } else {
	                        terminal.error(sprintf(strings.commandNotFound,
	                                               command.name));
	                    }
	                }
	            };
	        }
	        // ---------------------------------------------------------------------
	        function ajax_error(xhr, status, error) {
	            self.resume(); // onAjaxError can use pause/resume call it first
	            if ($.isFunction(settings.onAjaxError)) {
	                settings.onAjaxError.call(self, xhr, status, error);
	            } else if (status !== 'abort') {
	                self.error('&#91;AJAX&#93; ' + status + ' - ' +
	                           strings.serverResponse + ': \n' +
	                           $.terminal.escape_brackets(xhr.responseText));
	            }
	        }
	        // ---------------------------------------------------------------------
	        function make_json_rpc_object(url, auth, success) {
	            $.jrpc(url, 'system.describe', [], function(ret) {
	                var commands = [];
	                if (ret.procs) {
	                    var interpreter_object = {};
	                    $.each(ret.procs, function(_, proc) {
	                        interpreter_object[proc.name] = function() {
	                            var append = auth && proc.name != 'help';
	                            var args = Array.prototype.slice.call(arguments);
	                            var args_len = args.length + (append ? 1 : 0);
	                            if (settings.checkArity && proc.params &&
	                                proc.params.length !== args_len) {
	                                self.error("&#91;Arity&#93; " +
	                                           sprintf(strings.wrongArity,
	                                                   proc.name,
	                                                   proc.params.length,
	                                                   args_len));
	                            } else {
	                                self.pause();
	                                if (append) {
	                                    var token = self.token(true);
	                                    if (token) {
	                                        args = [token].concat(args);
	                                    } else {
	                                        self.error('&#91;AUTH&#93; ' +
	                                                   strings.noTokenError);
	                                    }
	                                }
	                                $.jrpc(url, proc.name, args, function(json) {
	                                    if (json.error) {
	                                        display_json_rpc_error(json.error);
	                                    } else {
	                                        if ($.isFunction(settings.processRPCResponse)) {
	                                            settings.processRPCResponse.call(self,
	                                                                             json.result,
	                                                                             self);
	                                        } else {
	                                            display_object(json.result);
	                                        }
	                                    }
	                                    self.resume();
	                                }, ajax_error);
	                            }
	                        };
	                    });
	                    interpreter_object.help = interpreter_object.help || function(fn) {
	                        if (typeof fn == 'undefined') {
	                            self.echo('Available commands: ' + ret.procs.map(function(proc) {
	                                return proc.name;
	                            }).join(', ') + ', help');
	                        } else {
	                            var found = false;
	                            $.each(ret.procs, function(_, proc) {
	                                if (proc.name == fn) {
	                                    found = true;
	                                    var msg = '';
	                                    msg += '[[bu;#fff;]' + proc.name + ']';
	                                    if (proc.params) {
	                                        msg += ' ' + proc.params.join(' ');
	                                    }
	                                    if (proc.help) {
	                                        msg += '\n' + proc.help;
	                                    }
	                                    self.echo(msg);
	                                    return false;
	                                }
	                            });
	                            if (!found) {
	                                if (fn == 'help') {
	                                    self.echo('[[bu;#fff;]help] [method]\ndisplay help ' +
	                                              'for the method or list of methods if not'+
	                                              ' specified');
	                                } else {
	                                    var msg = 'Method `' + fn.toString() + '\' not found ';//'
	                                    self.error(msg);
	                                }
	                            }
	                        }
	                    };
	                    success(interpreter_object);
	                } else {
	                    success(null);
	                }
	            }, function() {
	                success(null);
	            });
	        }
	        // ---------------------------------------------------------------------
	        function make_interpreter(user_intrp, login, finalize) {
	            finalize = finalize || $.noop;
	            var type = $.type(user_intrp);
	            var object;
	            var result = {};
	            var rpc_count = 0; // only one rpc can be use for array
	            var fn_interpreter;
	            if (type === 'array') {
	                object = {};
	                // recur will be called when previous acync call is finished
	                (function recur(interpreters, success) {
	                    if (interpreters.length) {
	                        var first = interpreters[0];
	                        var rest = interpreters.slice(1);
	                        var type = $.type(first);
	                        if (type === 'string') {
	                            rpc_count++;
	                            self.pause();
	                            if (settings.ignoreSystemDescribe) {
	                                if (rpc_count === 1) {
	                                    fn_interpreter = make_basic_json_rpc(first, login);
	                                } else {
	                                    self.error(strings.oneRPCWithIgnore);
	                                }
	                                recur(rest, success);
	                            } else {
	                                make_json_rpc_object(first, login, function(new_obj) {
	                                    // will ignore rpc in array that don't have
	                                    // system.describe
	                                    if (new_obj) {
	                                        $.extend(object, new_obj);
	                                    }
	                                    self.resume();
	                                    recur(rest, success);
	                                });
	                            }
	                        } else if (type === 'function') {
	                            if (fn_interpreter) {
	                                self.error(strings.oneInterpreterFunction);
	                            } else {
	                                fn_interpreter = first;
	                            }
	                            recur(rest, success);
	                        } else if (type === 'object') {
	                            $.extend(object, first);
	                            recur(rest, success);
	                        }
	                    } else {
	                        success();
	                    }
	                })(user_intrp, function() {
	                    finalize({
	                        interpreter: make_object_interpreter(object,
	                                                             false,
	                                                             login,
	                                                             fn_interpreter),
	                        completion: Object.keys(object)
	                    });
	                });
	            } else if (type === 'string') {
	                if (settings.ignoreSystemDescribe) {
	                    object = {
	                        interpreter: make_basic_json_rpc(user_intrp, login)
	                    };
	                    if ($.isArray(settings.completion)) {
	                        object.completion = settings.completion;
	                    }
	                    finalize(object);
	                } else {
	                    self.pause();
	                    make_json_rpc_object(user_intrp, login, function(object) {
	                        if (object) {
	                            result.interpreter = make_object_interpreter(object,
	                                                                         false,
	                                                                         login);
	                            result.completion = Object.keys(object);
	                        } else {
	                            // no procs in system.describe
	                            result.interpreter = make_basic_json_rpc(user_intrp, login);
	                        }
	                        finalize(result);
	                        self.resume();
	                    });
	                }
	            } else if (type === 'object') {
	                finalize({
	                    interpreter: make_object_interpreter(user_intrp,
	                                                         settings.checkArity),
	                    completion: Object.keys(user_intrp)
	                });
	            } else {
	                // allow $('<div/>').terminal();
	                if (type === 'undefined') {
	                    user_intrp = $.noop;
	                } else if (type !== 'function') {
	                    throw type + " is invalid interpreter value";
	                }
	                finalize({
	                    interpreter: user_intrp,
	                    completion: settings.completion
	                });
	            }
	        }
	        // ---------------------------------------------------------------------
	        // :: Create JSON-RPC authentication function
	        // ---------------------------------------------------------------------
	        function make_json_rpc_login(url, login) {
	            var method = $.type(login) === 'boolean' ? 'login' : login;
	            return function(user, passwd, callback, term) {
	                self.pause();
	                $.jrpc(url,
	                       method,
	                       [user, passwd],
	                       function(response) {
	                           if (!response.error && response.result) {
	                               callback(response.result);
	                           } else {
	                               // null will trigger message that login fail
	                               callback(null);
	                           }
	                           self.resume();
	                       }, ajax_error);
	            };
	            //default name is login so you can pass true
	        }
	        // ---------------------------------------------------------------------
	        // :: Return exception message as string
	        // ---------------------------------------------------------------------
	        function exception_message(e) {
	            if (typeof e === 'string') {
	                return e;
	            } else if (typeof e.fileName === 'string') {
	                return e.fileName + ': ' + e.message;
	            } else {
	                return e.message;
	            }
	        }
	        // ---------------------------------------------------------------------
	        // :: display Exception on terminal
	        // ---------------------------------------------------------------------
	        function display_exception(e, label) {
	            if ($.isFunction(settings.exceptionHandler)) {
	                settings.exceptionHandler.call(self, e);
	            } else {
	                self.exception(e, label);
	            }
	        }
	        // ---------------------------------------------------------------------
	        function scroll_to_bottom() {
	            var scrollHeight;
	            if (scroll_object.prop) {
	                scrollHeight = scroll_object.prop('scrollHeight');
	            } else {
	                scrollHeight = scroll_object.attr('scrollHeight');
	            }
	            scroll_object.scrollTop(scrollHeight);
	        }
	        // ---------------------------------------------------------------------
	        // :: validating if object is a string or a function, call that function
	        // :: and display the exeption if any
	        // ---------------------------------------------------------------------
	        function validate(label, object) {
	            try {
	                if ($.isFunction(object)) {
	                    object(function() {
	                        // don't care
	                    });
	                } else if (typeof object !== 'string') {
	                    var msg = label + ' must be string or function';
	                    throw msg;
	                }
	            } catch (e) {
	                display_exception(e, label.toUpperCase());
	                return false;
	            }
	            return true;
	        }
	        // ---------------------------------------------------------------------
	        // :: Draw line - can have line breaks and be longer than the width of
	        // :: the terminal, there are 2 options raw and finalize
	        // :: raw - will not encode the string and finalize if a function that
	        // :: will have div container of the line as first argument
	        // :: NOTE: it formats and appends lines to output_buffer. The actual
	        // :: append to terminal output happens in the flush function
	        // ---------------------------------------------------------------------
	        var output_buffer = [];
	        var NEW_LINE = 1;
	        function buffer_line(string, options) {
	            // urls should always have formatting to keep url if split
	            if (settings.convertLinks) {
	                string = string.replace(email_re, '[[!;;]$1]').
	                    replace(url_nf_re, '[[!;;]$1]');
	            }
	            var formatters = $.terminal.defaults.formatters;
	            var i, len;
	            if (!options.raw) {
	                // format using user defined formatters
	                for (i=0; i<formatters.length; ++i) {
	                    try {
	                        if (typeof formatters[i] == 'function') {
	                            var ret = formatters[i](string);
	                            if (typeof ret == 'string') {
	                                string = ret;
	                            }
	                        }
	                    } catch(e) {
	                        //display_exception(e, 'FORMATTING');
	                        alert('formatting error at formatters[' + i + ']\n' +
	                              (e.stack ? e.stack : e));
	                    }
	                }
	                string = $.terminal.encode(string);
	            }
	            output_buffer.push(NEW_LINE);
	            if (!options.raw && (string.length > num_chars ||
	                                       string.match(/\n/))) {
	                var words = options.keepWords;
	                var array = $.terminal.split_equal(string, num_chars, words);
	                for (i = 0, len = array.length; i < len; ++i) {
	                    if (array[i] === '' || array[i] === '\r') {
	                        output_buffer.push('<span></span>');
	                    } else {
	                        if (options.raw) {
	                            output_buffer.push(array[i]);
	                        } else {
	                            output_buffer.push($.terminal.format(array[i], {
	                                linksNoReferrer: settings.linksNoReferrer
	                            }));
	                        }
	                    }
	                }
	            } else {
	                if (!options.raw) {
	                    string = $.terminal.format(string, {
	                        linksNoReferrer: settings.linksNoReferrer
	                    });
	                }
	                output_buffer.push(string);
	            }
	            output_buffer.push(options.finalize);
	        }
	        // ---------------------------------------------------------------------
	        function process_line(line, options) {
	            // prevent exception in display exception
	            try {
	                var line_settings = $.extend({
	                    exec: true,
	                    raw: false,
	                    finalize: $.noop
	                }, options || {});
	                var string = $.type(line) === "function" ? line() : line;
	                string = $.type(string) === "string" ? string : String(string);
	                if (string !== '') {
	                    if (line_settings.exec) {
	                        string = $.map(string.split(format_exec_re), function(string) {
	                            if (string.match(format_exec_re) &&
	                                !$.terminal.is_formatting(string)) {
	                                // redraw should not execute commands and it have
	                                // and lines variable have all extended commands
	                                string = string.replace(/^\[\[|\]\]$/g, '');
	                                if (prev_command && prev_command.command == string) {
	                                    self.error(strings.recursiveCall);
	                                } else {
	                                    $.terminal.extended_command(self, string);
	                                }
	                                return '';
	                            } else {
	                                return string;
	                            }
	                        }).join('');
	                        if (string !== '') {
	                            // string can be empty after removing extended commands
	                            buffer_line(string, line_settings);
	                        }
	                    } else {
	                        buffer_line(string, line_settings);
	                    }
	                }
	            } catch (e) {
	                output_buffer = [];
	                // don't display exception if exception throw in terminal
	                alert('[Internal Exception(process_line)]:' +
	                      exception_message(e) + '\n' + e.stack);
	            }
	        }
	        // ---------------------------------------------------------------------
	        // :: Redraw all lines
	        // ---------------------------------------------------------------------
	        function redraw() {
	            command_line.resize(num_chars);
	            // we don't want reflow while processing lines
	            var detached_output = output.empty().detach();
	            var lines_to_show;
	            if (settings.outputLimit >= 0) {
	                // flush will limit lines but if there is lot of
	                // lines we don't need to show them and then remove
	                // them from terminal
	                var limit = settings.outputLimit === 0 ?
	                    self.rows() :
	                    settings.outputLimit;
	                lines_to_show = lines.slice(lines.length-limit-1);
	            } else {
	                lines_to_show = lines;
	            }
	            try {
	                output_buffer = [];
	                $.each(lines_to_show, function(i, line) {
	                    process_line.apply(null, line); // line is an array
	                });
	                command_line.before(detached_output); // reinsert output
	                self.flush();
	            } catch(e) {
	                alert('Exception in redraw\n' + e.stack);
	            }
	        }
	        // ---------------------------------------------------------------------
	        // :: Display user greetings or terminal signature
	        // ---------------------------------------------------------------------
	        function show_greetings() {
	            if (settings.greetings === undefined) {
	                self.echo(self.signature);
	            } else if (settings.greetings) {
	                var type = typeof settings.greetings;
	                if (type === 'string') {
	                    self.echo(settings.greetings);
	                } else if (type === 'function') {
	                    settings.greetings.call(self, self.echo);
	                } else {
	                    self.error(strings.wrongGreetings);
	                }
	            }
	        }
	        // ---------------------------------------------------------------------
	        // :: Display prompt and last command
	        // ---------------------------------------------------------------------
	        function echo_command(command) {
	            var prompt = command_line.prompt();
	            var mask = command_line.mask();
	            switch (typeof mask) {
	                case 'string':
	                    command = command.replace(/./g, mask);
	                    break;
	                case 'boolean':
	                    if (mask) {
	                        command = command.replace(/./g, settings.maskChar);
	                    } else {
	                        command = $.terminal.escape_formatting(command);
	                    }
	                    break;
	            }
	            var options = {
	                finalize: function(div) {
	                    div.addClass('command');
	                }
	            };
	            if ($.isFunction(prompt)) {
	                prompt(function(string) {
	                    self.echo(string + command, options);
	                });
	            } else {
	                self.echo(prompt + command, options);
	            }
	        }
	        // ---------------------------------------------------------------------
	        // :: Helper function that restore state. Call import_view or exec
	        // ---------------------------------------------------------------------
	        function restore_state(spec) {
	            // spec [terminal_id, state_index, command]
	            var terminal = terminals.get()[spec[0]];
	            if (!terminal) {
	                throw new Error(strings.invalidTerminalId);
	            }
	            var command_idx = spec[1];
	            if (save_state[command_idx]) { // state exists
	                terminal.import_view(save_state[command_idx]);
	            } else {
	                // restore state
	                change_hash = false;
	                var command = spec[2];
	                if (command) {
	                    terminal.exec(command).then(function() {
	                        change_hash = true;
	                        save_state[command_idx] = terminal.export_view();
	                    });
	                }
	            }
	            /*if (spec[3].length) {
	                restore_state(spec[3]);
	            }*/
	        }
	        // ---------------------------------------------------------------------
	        // :: Helper function
	        // ---------------------------------------------------------------------
	        function maybe_update_hash() {
	            if (change_hash) {
	                fire_hash_change = false;
	                location.hash = '#' + $.json_stringify(hash_commands);
	                setTimeout(function() {
	                    fire_hash_change = true;
	                }, 100);
	            }
	        }
	        // ---------------------------------------------------------------------
	        // :: Wrapper over interpreter, it implements exit and catches all
	        // :: exeptions from user code and displays them on the terminal
	        // ---------------------------------------------------------------------
	        var first_command = true;
	        var last_command;
	        var resume_callbacks = [];
	        var resume_event_bound = false;
	        function commands(command, silent, exec) {
	            last_command = command; // for debug
	            // first command store state of the terminal before the command get
	            // executed
	            if (first_command) {
	                first_command = false;
	                // execHash need first empty command too
	                if (settings.historyState || (settings.execHash && exec)) {
	                    if (!save_state.length) {
	                        // first command in first terminal don't have hash
	                        self.save_state();
	                    } else {
	                        self.save_state(null);
	                    }
	                }
	            }
	            function after_exec() {
	                // variables defined later in commands
	                if (!exec) {
	                    change_hash = true;
	                    if (settings.historyState) {
	                        self.save_state(command, false);
	                    }
	                    change_hash = saved_change_hash;
	                }
	                deferred.resolve();
	                if ($.isFunction(settings.onAfterCommand)) {
	                    settings.onAfterCommand(self, command);
	                }
	            }
	            try {
	                // this callback can disable commands
	                if ($.isFunction(settings.onBeforeCommand)) {
	                    if (settings.onBeforeCommand(self, command) === false) {
	                        return;
	                    }
	                }
	                if (!exec) {
	                    prev_command = $.terminal.split_command(command);
	                }
	                if (!ghost()) {
	                    // exec execute this function wihout the help of cmd plugin
	                    // that add command to history on enter
	                    if (exec && ($.isFunction(settings.historyFilter) &&
	                                 settings.historyFilter(command) ||
	                                 command.match(settings.historyFilter))) {
	                        command_line.history().append(command);
	                    }
	                }
	                var interpreter = interpreters.top();
	                if (!silent && settings.echoCommand) {
	                    echo_command(command);
	                }
	                // new promise will be returned to exec that will resolve his
	                // returned promise
	                var deferred = new $.Deferred();
	                // we need to save sate before commands is deleyd because
	                // execute_extended_command disable it and it can be executed
	                // after delay
	                var saved_change_hash = change_hash;
	                if (command.match(/^\s*login\s*$/) && self.token(true)) {
	                    if (self.level() > 1) {
	                        self.logout(true);
	                    } else {
	                        self.logout();
	                    }
	                    after_exec();
	                } else if (settings.exit && command.match(/^\s*exit\s*$/) &&
	                           !in_login) {
	                    var level = self.level();
	                    if (level == 1 && self.get_token() || level > 1) {
	                        if (self.get_token(true)) {
	                            self.set_token(undefined, true);
	                        }
	                        self.pop();
	                    }
	                    after_exec();
	                } else if (settings.clear && command.match(/^\s*clear\s*$/) &&
	                           !in_login) {
	                    self.clear();
	                    after_exec();
	                } else {
	                    var position = lines.length-1;
	                    // Call user interpreter function
	                    var result = interpreter.interpreter.call(self, command, self);
	                    if (result !== undefined) {
	                        // auto pause/resume when user return promises
	                        self.pause(true);
	                        return $.when(result).then(function(result) {
	                            // don't echo result if user echo something
	                            if (result && position === lines.length-1) {
	                                display_object(result);
	                            }
	                            after_exec();
	                            self.resume();
	                        });
	                    } else if (paused) {
	                        var old_command = command;
	                        resume_callbacks.push(function() {
	                            // exec with resume/pause in user code
	                            after_exec();
	                        });
	                    } else {
	                        after_exec();
	                    }
	                }
	                return deferred.promise();
	            } catch (e) {
	                display_exception(e, 'USER');
	                self.resume();
	                throw e;
	            }
	        }
	        // ---------------------------------------------------------------------
	        // :: The logout function removes Storage, disables history and runs
	        // :: the login function. This function is called only when options.login
	        // :: function is defined. The check for this is in the self.pop method
	        // ---------------------------------------------------------------------
	        function global_logout() {
	            if ($.isFunction(settings.onBeforeLogout)) {
	                try {
	                    if (settings.onBeforeLogout(self) === false) {
	                        return;
	                    }
	                } catch (e) {
	                    display_exception(e, 'onBeforeLogout');
	                }
	            }
	            clear_loging_storage();
	            if ($.isFunction(settings.onAfterLogout)) {
	                try {
	                    settings.onAfterLogout(self);
	                } catch (e) {
	                    display_exception(e, 'onAfterlogout');
	                }
	            }
	            self.login(settings.login, true, initialize);
	        }
	        // ---------------------------------------------------------------------
	        function clear_loging_storage() {
	            var name = self.prefix_name(true) + '_';
	            $.Storage.remove(name + 'token');
	            $.Storage.remove(name + 'login');
	        }
	        // ---------------------------------------------------------------------
	        // :: Save the interpreter name for use with purge
	        // ---------------------------------------------------------------------
	        function maybe_append_name(interpreter_name) {
	            var storage_key = self.prefix_name() + '_interpreters';
	            var names = $.Storage.get(storage_key);
	            if (names) {
	                names = $.parseJSON(names);
	            } else {
	                names = [];
	            }
	            if ($.inArray(interpreter_name, names) == -1) {
	                names.push(interpreter_name);
	                $.Storage.set(storage_key, $.json_stringify(names));
	            }
	        }
	        // ---------------------------------------------------------------------
	        // :: Function enables history, sets prompt, runs interpreter function
	        // ---------------------------------------------------------------------
	        function prepare_top_interpreter(silent) {
	            var interpreter = interpreters.top();
	            var name = self.prefix_name(true);
	            if (!ghost()) {
	                maybe_append_name(name);
	            }
	            command_line.name(name);
	            if ($.isFunction(interpreter.prompt)) {
	                command_line.prompt(function(command) {
	                    interpreter.prompt(command, self);
	                });
	            } else {
	                command_line.prompt(interpreter.prompt);
	            }
	            command_line.set('');
	            if (!silent && $.isFunction(interpreter.onStart)) {
	                interpreter.onStart(self);
	            }
	        }
	        // ---------------------------------------------------------------------
	        var local_first_instance;
	        function initialize() {
	            prepare_top_interpreter();
	            show_greetings();
	            // was_paused flag is workaround for case when user call exec before
	            // login and pause in onInit, 3rd exec will have proper timing (will
	            // execute after onInit resume)
	            var was_paused = false;
	            if ($.isFunction(settings.onInit)) {
	                onPause = function() { // local in terminal
	                    was_paused = true;
	                };
	                try {
	                    settings.onInit(self);
	                } catch (e) {
	                    display_exception(e, 'OnInit');
	                    // throw e; // it will be catched by terminal
	                } finally {
	                    onPause = $.noop;
	                    if (!was_paused) {
	                        // resume login if user didn't call pause in onInit
	                        // if user pause in onInit wait with exec until it
	                        // resume
	                        self.resume();
	                    }
	                }
	            }
	            function hashchange() {
	                if (fire_hash_change && settings.execHash) {
	                    try {
	                        if (location.hash) {
	                            var hash = location.hash.replace(/^#/, '');
	                            hash_commands = $.parseJSON(decodeURIComponent(hash));
	                        } else {
	                            hash_commands = [];
	                        }
	                        if (hash_commands.length) {
	                            restore_state(hash_commands[hash_commands.length-1]);
	                        } else if (save_state[0]) {
	                            self.import_view(save_state[0]);
	                        }
	                    } catch(e) {
	                        display_exception(e, 'TERMINAL');
	                    }
	                }
	            }
	            if (first_instance) {
	                first_instance = false;
	                if ($.fn.hashchange) {
	                    $(window).hashchange(hashchange);
	                } else {
	                    $(window).bind('hashchange', hashchange);
	                }
	            }
	        }
	        // ---------------------------------------------------------------------
	        // :: function complete the command
	        // ---------------------------------------------------------------------
	        function complete_helper(command, string, commands) {
	            if (settings.clear && $.inArray('clear', commands) == -1) {
	                commands.push('clear');
	            }
	            if (settings.exit && $.inArray('exit', commands) == -1) {
	                commands.push('exit');
	            }
	            var test = command_line.get().substring(0, command_line.position());
	            if (test !== command) {
	                // command line changed between TABS - ignore
	                return;
	            }
	            var regex = new RegExp('^' + $.terminal.escape_regex(string));
	            var matched = [];
	            for (var i=commands.length; i--;) {
	                if (regex.test(commands[i])) {
	                    matched.push(commands[i]);
	                }
	            }
	            if (matched.length === 1) {
	                self.insert(matched[0].replace(regex, ''));
	            } else if (matched.length > 1) {
	                if (tab_count >= 2) {
	                    echo_command(command);
	                    var text = matched.reverse().join('\t');
	                    self.echo($.terminal.escape_brackets(text), {keepWords: true});
	                    tab_count = 0;
	                } else {
	                    var found = false;
	                    var found_index;
	                    var j;
	                    loop:
	                    for (j=string.length; j<matched[0].length; ++j) {
	                        for (i=1; i<matched.length; ++i) {
	                            if (matched[0].charAt(j) !== matched[i].charAt(j)) {
	                                break loop;
	                            }
	                        }
	                        found = true;
	                    }
	                    if (found) {
	                        self.insert(matched[0].slice(0, j).replace(regex, ''));
	                    }
	                }
	            }
	        }
	        // ---------------------------------------------------------------------
	        // :: If Ghost don't store anything in localstorage
	        // ---------------------------------------------------------------------
	        function ghost() {
	            return in_login || command_line.mask() !== false;
	        }
	        // ---------------------------------------------------------------------
	        // :: Keydown event handler
	        // ---------------------------------------------------------------------
	        function key_down(e) {
	            // Prevent to be executed by cmd: CTRL+D, TAB, CTRL+TAB (if more
	            // then one terminal)
	            var result, i, top = interpreters.top(), completion;
	            if (!self.paused() && self.enabled()) {
	                if ($.isFunction(top.keydown)) {
	                    result = top.keydown(e, self);
	                    if (result !== undefined) {
	                        return result;
	                    }
	                } else if ($.isFunction(settings.keydown)) {
	                    result = settings.keydown(e, self);
	                    if (result !== undefined) {
	                        return result;
	                    }
	                }
	                if (settings.completion &&
	                    $.type(settings.completion) != 'boolean' &&
	                    top.completion === undefined) {
	                    completion = settings.completion;
	                } else {
	                    completion = top.completion;
	                }
	                if (completion == 'settings') {
	                    completion = settings.completion;
	                }
	                // after text pasted into textarea in cmd plugin
	                self.oneTime(10, function() {
	                    on_scrollbar_show_resize();
	                });
	                if (e.which !== 9) { // not a TAB
	                    tab_count = 0;
	                }
	                if (e.which === 68 && e.ctrlKey) { // CTRL+D
	                    if (!in_login) {
	                        if (command_line.get() === '') {
	                            if (interpreters.size() > 1 ||
	                                settings.login !== undefined) {
	                                self.pop('');
	                            } else {
	                                self.resume();
	                                self.echo('');
	                            }
	                        } else {
	                            self.set_command('');
	                        }
	                    }
	                    return false;
	                } else if (e.which === 76 && e.ctrlKey) { // CTRL+L
	                    self.clear();
	                } else if (completion && e.which === 9) { // TAB
	                    // TODO: move this to cmd plugin
	                    //       add completion = array | function
	                    //       !!! Problem complete more then one key need terminal
	                    ++tab_count;
	                    // cursor can be in the middle of the command
	                    // so we need to get the text before the cursor
	                    var pos = command_line.position();
	                    var command = command_line.get().substring(0, pos);
	                    var cmd_strings = command.split(' ');
	                    var string; // string before cursor that will be completed
	                    if (strings.length == 1) {
	                        string = cmd_strings[0];
	                    } else {
	                        string = cmd_strings[cmd_strings.length-1];
	                        for (i=cmd_strings.length-1; i>0; i--) {
	                            // treat escape space as part of the string
	                            if (cmd_strings[i-1][cmd_strings[i-1].length-1] == '\\') {
	                                string = cmd_strings[i-1] + ' ' + string;
	                            } else {
	                                break;
	                            }
	                        }
	                    }
	                    switch ($.type(completion)) {
	                        case 'function':
	                            completion(self, string, function(commands) {
	                                complete_helper(command, string, commands);
	                            });
	                            break;
	                        case 'array':
	                            complete_helper(command, string, completion);
	                            break;
	                        default:
	                            // terminal will not catch this because it's an event
	                            throw new Error(strings.invalidCompletion);
	                    }
	                    return false;
	                } else if ((e.which === 118 || e.which === 86) &&
	                           (e.ctrlKey || e.metaKey)) { // CTRL+V
	                    self.oneTime(1, function() {
	                        scroll_to_bottom();
	                    });
	                    return;
	                } else if (e.which === 9 && e.ctrlKey) { // CTRL+TAB
	                    if (terminals.length() > 1) {
	                        self.focus(false);
	                        return false;
	                    }
	                } else if (e.which === 34) { // PAGE DOWN
	                    self.scroll(self.height());
	                } else if (e.which === 33) { // PAGE UP
	                    self.scroll(-self.height());
	                } else {
	                    self.attr({scrollTop: self.attr('scrollHeight')});
	                }
	            } else if (e.which === 68 && e.ctrlKey) { // CTRL+D (if paused)
	                if (requests.length) {
	                    for (i=requests.length; i--;) {
	                        var r = requests[i];
	                        if (4 !== r.readyState) {
	                            try {
	                                r.abort();
	                            } catch (error) {
	                                self.error(strings.ajaxAbortError);
	                            }
	                        }
	                    }
	                    requests = [];
	                    // only resume if there are ajax calls
	                    self.resume();
	                }
	                return false;
	            }
	        }
	        // ---------------------------------------------------------------------
	        var self = this;
	        if (this.length > 1) {
	            return this.each(function() {
	                $.fn.terminal.call($(this),
	                                   init_interpreter,
	                                   $.extend({name: self.selector}, options));
	            });
	        }
	        // terminal already exists
	        if (self.data('terminal')) {
	            return self.data('terminal');
	        }
	        if (self.length === 0) {
	            throw sprintf($.terminal.defaults.strings.invalidSelector, self.selector);
	        }
	        //var names = []; // stack if interpreter names
	        var scroll_object;
	        var prev_command; // used for name on the terminal if not defined
	        var loged_in = false;
	        var tab_count = 0; // for tab completion
	        // array of line objects:
	        // - function (called whenever necessary, result is printed)
	        // - array (expected form: [line, settings])
	        // - anything else (cast to string when painted)
	        var lines = [];
	        var output; // .terminal-output jquery object
	        var terminal_id = terminals.length();
	        var num_chars; // numer of chars in line
	        var num_rows; // number of lines that fit without scrollbar
	        var command_list = []; // for tab completion
	        var url;
	        var logins = new Stack(); // stack of logins
	        var init_deferr = $.Deferred();
	        var in_login = false;//some Methods should not be called when login
	        // TODO: Try to use mutex like counter for pause/resume
	        var onPause = $.noop;//used to indicate that user call pause onInit
	        var old_width, old_height;
	        var delayed_commands = []; // used when exec commands while paused
	        var settings = $.extend({},
	                                $.terminal.defaults,
	                                {name: self.selector},
	                                options || {});
	        var strings = $.terminal.defaults.strings;
	        var enabled = settings.enabled, frozen;
	        var paused = false;
	        var autologin = true; // set to false of onBeforeLogin return false
	        // -----------------------------------------------------------------
	        // TERMINAL METHODS
	        // -----------------------------------------------------------------
	        $.extend(self, $.omap({
	            id: function() {
	                return terminal_id;
	            },
	            // -------------------------------------------------------------
	            // :: Clear the output
	            // -------------------------------------------------------------
	            clear: function() {
	                output.html('');
	                lines = [];
	                try {
	                    settings.onClear(self);
	                } catch (e) {
	                    display_exception(e, 'onClear');
	                }
	                self.attr({ scrollTop: 0});
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Return an object that can be used with import_view to
	            // :: restore the state
	            // -------------------------------------------------------------
	            export_view: function() {
	                var user_export = {};
	                if ($.isFunction(settings.onExport)) {
	                    try {
	                        user_export = settings.onExport();
	                    } catch(e) {
	                        display_exception(e, 'onExport');
	                    }
	                }
	                return $.extend({}, {
	                    focus: enabled,
	                    mask: command_line.mask(),
	                    prompt: self.get_prompt(),
	                    command: self.get_command(),
	                    position: command_line.position(),
	                    lines: clone(lines),
	                    interpreters: interpreters.clone()
	                }, user_export);
	            },
	            // -------------------------------------------------------------
	            // :: Restore the state of the previous exported view
	            // -------------------------------------------------------------
	            import_view: function(view) {
	                if (in_login) {
	                    throw new Error(sprintf(strings.notWhileLogin, 'import_view'));
	                }
	                if ($.isFunction(settings.onImport)) {
	                    try {
	                        settings.onImport(view);
	                    } catch(e) {
	                        display_exception(e, 'onImport');
	                    }
	                }
	                init_deferr.then(function() {
	                    self.set_prompt(view.prompt);
	                    self.set_command(view.command);
	                    command_line.position(view.position);
	                    command_line.mask(view.mask);
	                    if (view.focus) {
	                        self.focus();
	                    }
	                    lines = clone(view.lines);
	                    interpreters = view.interpreters;
	                    redraw();
	                });
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Store current terminal state
	            // -------------------------------------------------------------
	            save_state: function(command, ignore_hash, index) {
	                //save_state.push({view:self.export_view(), join:[]});
	                if (typeof index != 'undefined') {
	                    save_state[index] = self.export_view();
	                } else {
	                    save_state.push(self.export_view());
	                }
	                if (!$.isArray(hash_commands)) {
	                    hash_commands = [];
	                }
	                if (command !== undefined && !ignore_hash) {
	                    var state = [
	                        terminal_id,
	                        save_state.length-1,
	                        command
	                    ];
	                    hash_commands.push(state);
	                    maybe_update_hash();
	                }
	            },
	            // -------------------------------------------------------------
	            // :: Execute a command, it will handle commands that do AJAX
	            // :: calls and have delays, if the second argument is set to
	            // :: true it will not echo executed command
	            // -------------------------------------------------------------
	            exec: function(command, silent, deferred) {
	                var d = deferred || new $.Deferred();
	                function run() {
	                    if ($.isArray(command)) {
	                        (function recur() {
	                            var cmd = command.shift();
	                            if (cmd) {
	                                self.exec(cmd, silent).then(recur);
	                            } else {
	                                d.resolve();
	                            }
	                        })();
	                    } else if (paused) {
	                        // both commands executed here (resume will call Term::exec)
	                        // delay command multiple time
	                        delayed_commands.push([command, silent, d]);
	                    } else {
	                        // commands may return promise from user code
	                        // it will resolve exec promise when user promise
	                        // is resolved
	                        commands(command, silent, true).then(function() {
	                            d.resolve(self);
	                        });
	                    }
	                }
	                // while testing it didn't executed last exec when using this
	                // for resolved deferred
	                if (init_deferr.state() != 'resolved') {
	                    init_deferr.then(run);
	                } else {
	                    run();
	                }
	                return d.promise();
	            },
	            // -------------------------------------------------------------
	            // :: bypass login function that wait untill you type user/pass
	            // :: it hide implementation detail
	            // -------------------------------------------------------------
	            autologin: function(user, token, silent) {
	                self.trigger('terminal.autologin', [user, token, silent]);
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Function changes the prompt of the command line to login
	            // :: with a password and calls the user login function with
	            // :: the callback that expects a token. The login is successful
	            // :: if the user calls it with value that is truthy
	            // -------------------------------------------------------------
	            login: function(auth, infinite, success, error) {
	                logins.push([].slice.call(arguments));
	                if (in_login) {
	                    throw new Error(sprintf(strings.notWhileLogin, 'login'));
	                }
	                if (!$.isFunction(auth)) {
	                    throw new Error(strings.loginIsNotAFunction);
	                }
	                in_login = true;
	                if (self.token() && self.level() == 1 && !autologin) {
	                    in_login = false; // logout will call login
	                    self.logout(true);
	                } else {
	                    if (self.token(true) && self.login_name(true)) {
	                        in_login = false;
	                        if ($.isFunction(success)) {
	                            success();
	                        }
	                        return self;
	                    }
	                }
	                var user = null;
	                // don't store login data in history
	                if (settings.history) {
	                    command_line.history().disable();
	                }
	                // so we know how many times call pop
	                var level = self.level();
	                function login_callback(user, token, silent, event) {
	                    if (token) {
	                        while (self.level() > level) {
	                            self.pop();
	                        }
	                        if (settings.history) {
	                            command_line.history().enable();
	                        }
	                        var name = self.prefix_name(true) + '_';
	                        $.Storage.set(name + 'token', token);
	                        $.Storage.set(name + 'login', user);
	                        in_login = false;
	                        if ($.isFunction(success)) {
	                            // will be used internaly since users know
	                            // when login success (they decide when
	                            // it happen by calling the callback -
	                            // this funtion)
	                            success();
	                        }
	                    } else {
	                        if (infinite) {
	                            if (!silent) {
	                                self.error(strings.wrongPasswordTryAgain);
	                            }
	                            self.pop().set_mask(false);
	                        } else {
	                            in_login = false;
	                            if (!silent) {
	                                self.error(strings.wrongPassword);
	                            }
	                            self.pop().pop();
	                        }
	                        // used only to call pop in push
	                        if ($.isFunction(error)) {
	                            error();
	                        }
	                    }
	                    self.off('terminal.autologin');
	                }
	                self.on('terminal.autologin', function(event, user, token, silent) {
	                    login_callback(user, token, silent);
	                });
	                self.push(function(user) {
	                    self.set_mask(settings.maskChar).push(function(pass) {
	                        try {
	                            auth.call(self, user, pass, function(token, silent) {
	                                login_callback(user, token, silent);
	                            });
	                        } catch(e) {
	                            display_exception(e, 'AUTH');
	                        }
	                    }, {
	                        prompt: strings.password + ': ',
	                        name: 'password'
	                    });
	                }, {
	                    prompt: strings.login + ': ',
	                    name: 'login'
	                });
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: User defined settings and defaults as well
	            // -------------------------------------------------------------
	            settings: function() {
	                return settings;
	            },
	            // -------------------------------------------------------------
	            // :: Return commands function from top interpreter
	            // -------------------------------------------------------------
	            commands: function() {
	                return interpreters.top().interpreter;
	            },
	            // -------------------------------------------------------------
	            // :: Low Level method that overwrites interpreter
	            // -------------------------------------------------------------
	            setInterpreter: function() {
	                if (window.console && console.warn) {
	                    console.warn('This function is deprecated, use set_inte'+
	                                 'rpreter insead!');
	                }
	                return self.set_interpreter.apply(self, arguments);
	            },
	            // -------------------------------------------------------------
	            set_interpreter: function(user_intrp, login) {
	                function overwrite_interpreter() {
	                    self.pause();
	                    make_interpreter(user_intrp, !!login, function(result) {
	                        self.resume();
	                        var top = interpreters.top();
	                        $.extend(top, result);
	                        prepare_top_interpreter(true);
	                    });
	                }
	                if ($.type(user_intrp) == 'string' && login) {
	                    self.login(make_json_rpc_login(user_intrp, login),
	                               true,
	                               overwrite_interpreter);
	                } else {
	                    overwrite_interpreter();
	                }
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Show user greetings or terminal signature
	            // -------------------------------------------------------------
	            greetings: function() {
	                show_greetings();
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Return true if terminal is paused false otherwise
	            // -------------------------------------------------------------
	            paused: function() {
	                return paused;
	            },
	            // -------------------------------------------------------------
	            // :: Pause the terminal, it should be used for ajax calls
	            // -------------------------------------------------------------
	            pause: function(visible) {
	                onPause();
	                if (!paused && command_line) {
	                    init_deferr.then(function() {
	                        paused = true;
	                        command_line.disable();
	                        if (!visible) {
	                            command_line.hidden();
	                        }
	                        if ($.isFunction(settings.onPause)) {
	                            settings.onPause();
	                        }
	                    });
	                }
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Resume the previously paused terminal
	            // -------------------------------------------------------------
	            resume: function() {
	                function run() {
	                    paused = false;
	                    if (terminals.front() == self) {
	                        command_line.enable();
	                    }
	                    command_line.visible();
	                    var original = delayed_commands;
	                    delayed_commands = [];
	                    for (var i = 0; i < original.length; ++i) {
	                        self.exec.apply(self, original[i]);
	                    }
	                    self.trigger('resume');
	                    var fn = resume_callbacks.shift();
	                    if (fn) {
	                        fn();
	                    }
	                    scroll_to_bottom();
	                    if ($.isFunction(settings.onResume)) {
	                        settings.onResume();
	                    }
	                }
	                if (paused && command_line) {
	                    if (init_deferr.state() != 'resolved') {
	                        init_deferr.then(run);
	                    } else {
	                        run();
	                    }
	                }
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Return the number of characters that fit into the width of
	            // :: the terminal
	            // -------------------------------------------------------------
	            cols: function() {
	                return settings.numChars?settings.numChars:get_num_chars(self);
	            },
	            // -------------------------------------------------------------
	            // :: Return the number of lines that fit into the height of the
	            // :: terminal
	            // -------------------------------------------------------------
	            rows: function() {
	                return settings.numRows?settings.numRows:get_num_rows(self);
	            },
	            // -------------------------------------------------------------
	            // :: Return the History object
	            // -------------------------------------------------------------
	            history: function() {
	                return command_line.history();
	            },
	            // -------------------------------------------------------------
	            // :: toggle recording of history state
	            // -------------------------------------------------------------
	            history_state: function(toggle) {
	                if (toggle) {
	                    // if set to true and if set from user command we need
	                    // not to include the command
	                    self.oneTime(1, function() {
	                        settings.historyState = true;
	                        if (!save_state.length) {
	                            self.save_state();
	                        } else if (terminals.length() > 1) {
	                            self.save_state(null);
	                        }
	                    });
	                } else {
	                    settings.historyState = false;
	                }
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: clear the history state
	            // -------------------------------------------------------------
	            clear_history_state: function() {
	                hash_commands = [];
	                save_state = [];
	            },
	            // -------------------------------------------------------------
	            // :: Switch to the next terminal
	            // -------------------------------------------------------------
	            next: function() {
	                if (terminals.length() === 1) {
	                    return self;
	                } else {
	                    var offsetTop = self.offset().top;
	                    var height = self.height();
	                    var scrollTop = self.scrollTop();
	                    /*if (!is_scrolled_into_view(self)) {
	                        self.enable();
	                        $('html,body').animate({
	                            scrollTop: offsetTop-50
	                        }, 500);
	                        return self;
	                    } else {
	                    */
	                    terminals.front().disable();
	                    var next = terminals.rotate().enable();
	                    // 100 provides buffer in viewport
	                    var x = next.offset().top - 50;
	                    $('html,body').animate({scrollTop: x}, 500);
	                    try {
	                        settings.onTerminalChange(next);
	                    } catch (e) {
	                        display_exception(e, 'onTerminalChange');
	                    }
	                    return next;
	                }
	            },
	            // -------------------------------------------------------------
	            // :: Make the terminal in focus or blur depending on the first
	            // :: argument. If there is more then one terminal it will
	            // :: switch to next one, if the second argument is set to true
	            // :: the events will be not fired. Used on init
	            // -------------------------------------------------------------
	            focus: function(toggle, silent) {
	                init_deferr.then(function() {
	                    if (terminals.length() === 1) {
	                        if (toggle === false) {
	                            try {
	                                if (!silent && settings.onBlur(self) !== false ||
	                                    silent) {
	                                    self.disable();
	                                }
	                            } catch (e) {
	                                display_exception(e, 'onBlur');
	                            }
	                        } else {
	                            try {
	                                if (!silent && settings.onFocus(self) !== false ||
	                                    silent) {
	                                    self.enable();
	                                }
	                            } catch (e) {
	                                display_exception(e, 'onFocus');
	                            }
	                        }
	                    } else {
	                        if (toggle === false) {
	                            self.next();
	                        } else {
	                            var front = terminals.front();
	                            if (front != self) {
	                                front.disable();
	                                if (!silent) {
	                                    try {
	                                        settings.onTerminalChange(self);
	                                    } catch (e) {
	                                        display_exception(e, 'onTerminalChange');
	                                    }
	                                }
	                            }
	                            terminals.set(self);
	                            self.enable();
	                        }
	                    }
	                });
	                // why this delay - it can't be use for mobile
	                /*
	                self.oneTime(1, function() {
	                });
	                */
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Disable/Enable terminal that can be enabled by click
	            // -------------------------------------------------------------
	            freeze: function(freeze) {
	                init_deferr.then(function() {
	                    if (freeze) {
	                        self.disable();
	                        frozen = true;
	                    } else {
	                        frozen = false;
	                        self.enable();
	                    }
	                });
	            },
	            // -------------------------------------------------------------
	            // :: check if terminal is frozen
	            // -------------------------------------------------------------
	            frozen: function() {
	                return frozen;
	            },
	            // -------------------------------------------------------------
	            // :: Enable the terminal
	            // -------------------------------------------------------------
	            enable: function() {
	                if (!enabled && !frozen) {
	                    if (num_chars === undefined) {
	                        //enabling first time
	                        self.resize();
	                    }
	                    init_deferr.then(function() {
	                        command_line.enable();
	                        enabled = true;
	                    });
	                }
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Disable the terminal
	            // -------------------------------------------------------------
	            disable: function() {
	                if (enabled && !frozen) {
	                    init_deferr.then(function() {
	                        enabled = false;
	                        command_line.disable();
	                    });
	                }
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: return true if the terminal is enabled
	            // -------------------------------------------------------------
	            enabled: function() {
	                return enabled;
	            },
	            // -------------------------------------------------------------
	            // :: Return the terminal signature depending on the size of the terminal
	            // -------------------------------------------------------------
	            signature: function() {
	                var cols = self.cols();
	                var i = cols < 15 ? null : cols < 35 ? 0 : cols < 55 ? 1 : cols < 64 ? 2 : cols < 75 ? 3 : 4;
	                if (i !== null) {
	                    return signatures[i].join('\n') + '\n';
	                } else {
	                    return '';
	                }
	            },
	            // -------------------------------------------------------------
	            // :: Return the version number
	            // -------------------------------------------------------------
	            version: function() {
	                return $.terminal.version;
	            },
	            // -------------------------------------------------------------
	            // :: Return actual command line object (jquery object with cmd
	            // :: methods)
	            // -------------------------------------------------------------
	            cmd: function() {
	                return command_line;
	            },
	            // -------------------------------------------------------------
	            // :: Return the current command entered by terminal
	            // -------------------------------------------------------------
	            get_command: function() {
	                return command_line.get();
	            },
	            // -------------------------------------------------------------
	            // :: Change the command line to the new one
	            // -------------------------------------------------------------
	            set_command: function(command) {
	                init_deferr.then(function() {
	                    command_line.set(command);
	                });
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Insert text into the command line after the cursor
	            // -------------------------------------------------------------
	            insert: function(string) {
	                if (typeof string === 'string') {
	                    init_deferr.then(function() {
	                        command_line.insert(string);
	                    });
	                    return self;
	                } else {
	                    throw "insert function argument is not a string";
	                }
	            },
	            // -------------------------------------------------------------
	            // :: Set the prompt of the command line
	            // -------------------------------------------------------------
	            set_prompt: function(prompt) {
	                init_deferr.then(function() {
	                    if (validate('prompt', prompt)) {
	                        if ($.isFunction(prompt)) {
	                            command_line.prompt(function(callback) {
	                                prompt(callback, self);
	                            });
	                        } else {
	                            command_line.prompt(prompt);
	                        }
	                        interpreters.top().prompt = prompt;
	                    }
	                });
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Return the prompt used by the terminal
	            // -------------------------------------------------------------
	            get_prompt: function() {
	                return interpreters.top().prompt;
	                // command_line.prompt(); - can be a wrapper
	                //return command_line.prompt();
	            },
	            // -------------------------------------------------------------
	            // :: Enable or Disable mask depedning on the passed argument
	            // :: the mask can also be character (in fact it will work with
	            // :: strings longer then one)
	            // -------------------------------------------------------------
	            set_mask: function(mask) {
	                init_deferr.then(function() {
	                    command_line.mask(mask === true ? settings.maskChar : mask);
	                });
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Return the ouput of the terminal as text
	            // -------------------------------------------------------------
	            get_output: function(raw) {
	                if (raw) {
	                    return lines;
	                } else {
	                    return $.map(lines, function(item) {
	                        return $.isFunction(item[0]) ? item[0]() : item[0];
	                    }).join('\n');
	                }
	            },
	            // -------------------------------------------------------------
	            // :: Recalculate and redraw everything
	            // -------------------------------------------------------------
	            resize: function(width, height) {
	                if (!self.is(':visible')) {
	                    // delay resize if terminal not visible
	                    self.stopTime('resize');
	                    self.oneTime(500, 'resize', function() {
	                        self.resize(width, height);
	                    });
	                } else {
	                    if (width && height) {
	                        self.width(width);
	                        self.height(height);
	                    }
	                    width = self.width();
	                    height = self.height();
	                    var new_num_chars = self.cols();
	                    var new_num_rows = self.rows();
	                    // only if number of chars changed
	                    if (new_num_chars !== num_chars ||
	                        new_num_rows !== num_rows) {
	                        num_chars = new_num_chars;
	                        num_rows = new_num_rows;
	                        redraw();
	                        var top = interpreters.top();
	                        if ($.isFunction(top.resize)) {
	                            top.resize(self);
	                        } else if ($.isFunction(settings.onResize)) {
	                            settings.onResize(self);
	                        }
	                        old_height = height;
	                        old_width = width;
	                        scroll_to_bottom();
	                    }
	                }
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Flush the output to the terminal
	            // -------------------------------------------------------------
	            flush: function() {
	                try {
	                    var wrapper;
	                    // print all lines
	                    $.each(output_buffer, function(i, line) {
	                        if (line === NEW_LINE) {
	                            wrapper = $('<div></div>');
	                        } else if ($.isFunction(line)) {
	                            // this is finalize function from echo
	                            wrapper.appendTo(output);
	                            try {
	                                line(wrapper);
	                                /* this don't work with resize
	                                   line(wrapper, function(user_finalize) {
	                                   // TODO:
	                                   //user_finalize need to be save in line object
	                                   user_finalize(wrapper);
	                                   });*/
	                            } catch (e) {
	                                display_exception(e, 'USER:echo(finalize)');
	                            }
	                        } else {
	                            $('<div/>').html(line).
	                                appendTo(wrapper).width('100%');
	                        }
	                    });
	                    if (settings.outputLimit >= 0) {
	                        var limit = settings.outputLimit === 0 ?
	                            self.rows() :
	                            settings.outputLimit;
	                        var $lines = output.find('div div');
	                        if ($lines.length > limit) {
	                            var max = $lines.length-limit+1;
	                            var for_remove = $lines.slice(0, max);
	                            // you can't get parent if you remove the
	                            // element so we first get the parent
	                            var parents = for_remove.parent();
	                            for_remove.remove();
	                            parents.each(function() {
	                                var self = $(this);
	                                if (self.is(':empty')) {
	                                    // there can be divs inside parent that
	                                    // was not removed
	                                    self.remove();
	                                }
	                            });
	                        }
	                    }
	                    num_rows = get_num_rows(self);
	                    on_scrollbar_show_resize();
	                    if (settings.scrollOnEcho) {
	                        scroll_to_bottom();
	                    }
	                    output_buffer = [];
	                } catch (e) {
	                    alert('[Flush] ' + exception_message(e) + '\n' +
	                          e.stack);
	                }
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Update the output line - line number can be negative
	            // -------------------------------------------------------------
	            update: function(line, string) {
	                init_deferr.then(function() {
	                    if (line < 0) {
	                        line = lines.length + line; // yes +
	                    }
	                    if (!lines[line]) {
	                        self.error('Invalid line number ' + line);
	                    } else {
	                        if (string === null) {
	                            lines.splice(line, 1);
	                        } else {
	                            lines[line][0] = string;
	                        }
	                        // it would be hard to figure out which div need to be
	                        // updated so we update everything
	                        redraw();
	                    }
	                });
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: return index of last line in case when you need to update
	            // :: after something is echo on the terminal
	            // -------------------------------------------------------------
	            last_index: function() {
	                return lines.length-1;
	            },
	            // -------------------------------------------------------------
	            // :: Print data to the terminal output. It can have two options
	            // :: a function that is called with the container div that
	            // :: holds the output (as a jquery object) every time the
	            // :: output is printed (including resize and scrolling)
	            // :: If the line is a function it will be called for every
	            // :: redraw.
	            // :: it use $.when so you can echo a promise
	            // -------------------------------------------------------------
	            echo: function(string, options) {
	                string = string || '';
	                $.when(string).then(function(string) {
	                    try {
	                        var locals = $.extend({
	                            flush: true,
	                            raw: settings.raw,
	                            finalize: $.noop,
	                            keepWords: false
	                        }, options || {});
	                        if (locals.flush) {
	                            output_buffer = [];
	                        }
	                        process_line(string, locals);
	                        // extended commands should be processed only
	                        // once in echo and not on redraw
	                        lines.push([string, $.extend(locals, {
	                            exec: false
	                        })]);
	                        if (locals.flush) {
	                            self.flush();
	                        }
	                    } catch (e) {
	                        // if echo throw exception we can't use error to
	                        // display that exception
	                        alert('[Terminal.echo] ' + exception_message(e) +
	                              '\n' + e.stack);
	                    }
	                });
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: echo red text
	            // -------------------------------------------------------------
	            error: function(message, finalize) {
	                //quick hack to fix trailing backslash
	                var str = $.terminal.escape_brackets(message).
	                    replace(/\\$/, '&#92;').
	                    replace(url_re, ']$1[[;;;error]');
	                return self.echo('[[;;;error]' + str + ']', finalize);
	            },
	            // -------------------------------------------------------------
	            // :: Display Exception on terminal
	            // -------------------------------------------------------------
	            exception: function(e, label) {
	                var message = exception_message(e);
	                if (label) {
	                    message = '&#91;' + label + '&#93;: ' + message;
	                }
	                if (message) {
	                    self.error(message, {
	                        finalize: function(div) {
	                            div.addClass('exception message');
	                        }
	                    });
	                }
	                if (typeof e.fileName === 'string') {
	                    //display filename and line which throw exeption
	                    self.pause();
	                    $.get(e.fileName, function(file) {
	                        self.resume();
	                        var num = e.lineNumber - 1;
	                        var line = file.split('\n')[num];
	                        if (line) {
	                            self.error('[' + e.lineNumber + ']: ' + line);
	                        }
	                    });
	                }
	                if (e.stack) {
	                    var stack = $.terminal.escape_brackets(e.stack);
	                    self.echo(stack.split(/\n/g).map(function(trace) {
	                        return '[[;;;error]' + trace.replace(url_re, function(url) {
	                            return ']' + url + '[[;;;error]';
	                        }) + ']';
	                    }).join('\n'), {
	                        finalize: function(div) {
	                            div.addClass('exception stack-trace');
	                        }
	                    });
	                }
	            },
	            // -------------------------------------------------------------
	            // :: Scroll Div that holds the terminal
	            // -------------------------------------------------------------
	            scroll: function(amount) {
	                var pos;
	                amount = Math.round(amount);
	                if (scroll_object.prop) { // work with jQuery > 1.6
	                    if (amount > scroll_object.prop('scrollTop') && amount > 0) {
	                        scroll_object.prop('scrollTop', 0);
	                    }
	                    pos = scroll_object.prop('scrollTop');
	                    scroll_object.scrollTop(pos + amount);
	                } else {
	                    if (amount > scroll_object.attr('scrollTop') && amount > 0) {
	                        scroll_object.attr('scrollTop', 0);
	                    }
	                    pos = scroll_object.attr('scrollTop');
	                    scroll_object.scrollTop(pos + amount);
	                }
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Exit all interpreters and logout. The function will throw
	            // :: exception if there is no login provided
	            // -------------------------------------------------------------
	            logout: function(local) {
	                if (in_login) {
	                    throw new Error(sprintf(strings.notWhileLogin, 'logout'));
	                }
	                init_deferr.then(function() {
	                    if (local) {
	                        var login = logins.pop();
	                        self.set_token(undefined, true);
	                        self.login.apply(self, login);
	                    } else {
	                        while (interpreters.size() > 0) {
	                            // pop will call global_logout that will call login
	                            // and size will be > 0; this is workaround the problem
	                            if (self.pop()) {
	                                break;
	                            }
	                        }
	                    }
	                });
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Function returns the token returned by callback function
	            // :: in login function. It does nothing (return undefined) if
	            // :: there is no login
	            // -------------------------------------------------------------
	            token: function(local) {
	                return $.Storage.get(self.prefix_name(local) + '_token');
	            },
	            // -------------------------------------------------------------
	            // :: Function sets the token to the supplied value. This function
	            // :: works regardless of wherer settings.login is supplied
	            // -------------------------------------------------------------
	            set_token: function(token, local) {
	                var name = self.prefix_name(local) + '_token';
	                if (typeof token == 'undefined') {
	                    $.Storage.remove(name, token);
	                } else {
	                    $.Storage.set(name, token);
	                }
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Function get the token either set by the login method or
	            // :: by the set_token method.
	            // -------------------------------------------------------------
	            get_token: function(local) {
	                return $.Storage.get(self.prefix_name(local) + '_token');
	            },
	            // -------------------------------------------------------------
	            // :: Function return Login name entered by the user
	            // -------------------------------------------------------------
	            login_name: function(local) {
	                return $.Storage.get(self.prefix_name(local) + '_login');
	            },
	            // -------------------------------------------------------------
	            // :: Function returns the name of current interpreter
	            // -------------------------------------------------------------
	            name: function() {
	                return interpreters.top().name;
	            },
	            // -------------------------------------------------------------
	            // :: Function return prefix name for login/token
	            // -------------------------------------------------------------
	            prefix_name: function(local) {
	                var name = (settings.name ? settings.name + '_': '') +
	                    terminal_id;
	                if (local && interpreters.size() > 1) {
	                    var local_name = interpreters.map(function(intrp) {
	                        return intrp.name;
	                    }).slice(1).join('_');
	                    if (local_name) {
	                        name += '_' + local_name;
	                    }
	                }
	                return name;
	            },
	            // -------------------------------------------------------------
	            // :: wrapper for common use case
	            // -------------------------------------------------------------
	            read: function(message, callback) {
	                var d = new $.Deferred();
	                self.push(function(text) {
	                    self.pop();
	                    if ($.isFunction(callback)) {
	                        callback(text);
	                    }
	                    d.resolve(text);
	                }, {
	                    prompt: message
	                });
	                return d.promise();
	            },
	            // -------------------------------------------------------------
	            // :: Push a new interenter on the Stack
	            // -------------------------------------------------------------
	            push: function(interpreter, options) {
	                init_deferr.then(function() {
	                    options = options || {};
	                    var defaults = {
	                        infiniteLogin: false
	                    };
	                    var settings = $.extend({}, defaults, options);
	                    if (!settings.name && prev_command) {
	                        // push is called in login
	                        settings.name = prev_command.name;
	                    }
	                    if (settings.prompt === undefined) {
	                        settings.prompt = (settings.name || '>') + ' ';
	                    }
	                    //names.push(options.name);
	                    var top = interpreters.top();
	                    if (top) {
	                        top.mask = command_line.mask();
	                    }
	                    var was_paused = paused;
	                    //self.pause();
	                    make_interpreter(interpreter, !!options.login, function(ret) {
	                        // result is object with interpreter and completion
	                        // properties
	                        interpreters.push($.extend({}, ret, settings));
	                        if ($.isArray(ret.completion) && settings.completion === true) {
	                            interpreters.top().completion = ret.completion;
	                        } else if (!ret.completion && settings.completion === true) {
	                            interpreters.top().completion = false;
	                        }
	                        if (settings.login) {
	                            var type = $.type(settings.login);
	                            if (type == 'function') {
	                                // self.pop on error
	                                self.login(settings.login,
	                                           settings.infiniteLogin,
	                                           prepare_top_interpreter,
	                                           settings.infiniteLogin ? $.noop : self.pop);
	                            } else if ($.type(interpreter) == 'string' &&
	                                       type == 'string' || type == 'boolean') {
	                                self.login(make_json_rpc_login(interpreter,
	                                                               settings.login),
	                                           settings.infiniteLogin,
	                                           prepare_top_interpreter,
	                                           settings.infiniteLogin ? $.noop : self.pop);
	                            }
	                        } else {
	                            prepare_top_interpreter();
	                        }
	                        if (!was_paused) {
	                            self.resume();
	                        }
	                    });
	                });
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Remove the last interpreter from the Stack
	            // -------------------------------------------------------------
	            pop: function(string) {
	                if (string !== undefined) {
	                    echo_command(string);
	                }
	                var token = self.token(true);
	                if (interpreters.size() == 1) {
	                    if (settings.login) {
	                        global_logout();
	                        if ($.isFunction(settings.onExit)) {
	                            try {
	                                settings.onExit(self);
	                            } catch (e) {
	                                display_exception(e, 'onExit');
	                            }
	                        }
	                        return true;
	                    } else {
	                        self.error(strings.canExitError);
	                    }
	                } else {
	                    if (self.token(true)) {
	                        clear_loging_storage();
	                    }
	                    var current = interpreters.pop();
	                    prepare_top_interpreter();
	                    // we check in case if you don't pop from password interpreter
	                    if (in_login && self.get_prompt() != strings.login + ': ') {
	                        in_login = false;
	                    }
	                    if ($.isFunction(current.onExit)) {
	                        try {
	                            current.onExit(self);
	                        } catch (e) {
	                            display_exception(e, 'onExit');
	                        }
	                    }
	                    // restore mask
	                    self.set_mask(interpreters.top().mask);
	                }
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Change terminal option(s) at runtime
	            // -------------------------------------------------------------
	            option: function(object_or_name, value) {
	                if (typeof value == 'undefined') {
	                    if (typeof object_or_name == 'string') {
	                        return settings[object_or_name];
	                    } else if (typeof object_or_name == 'object') {
	                        $.each(object_or_name, function(key, value) {
	                            settings[key] = value;
	                        });
	                    }
	                } else {
	                    settings[object_or_name] = value;
	                }
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Return how deep you are in nested interpreters
	            // -------------------------------------------------------------
	            level: function() {
	                return interpreters.size();
	            },
	            // -------------------------------------------------------------
	            // :: Reinitialize the terminal
	            // -------------------------------------------------------------
	            reset: function() {
	                init_deferr.then(function() {
	                    self.clear();
	                    while(interpreters.size() > 1) {
	                        interpreters.pop();
	                    }
	                    initialize();
	                });
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Remove all local storage left by terminal, it will not
	            // :: logout you until you refresh the browser
	            // -------------------------------------------------------------
	            purge: function() {
	                init_deferr.then(function() {
	                    var prefix = self.prefix_name() + '_';
	                    var names = $.Storage.get(prefix + 'interpreters');
	                    $.each($.parseJSON(names), function(_, name) {
	                        $.Storage.remove(name + '_commands');
	                        $.Storage.remove(name + '_token');
	                        $.Storage.remove(name + '_login');
	                    });
	                    command_line.purge();
	                    $.Storage.remove(prefix + 'interpreters');
	                });
	                return self;
	            },
	            // -------------------------------------------------------------
	            // :: Remove all events and DOM nodes left by terminal, it will
	            // :: not purge the terminal so you will have the same state
	            // :: when you refresh the browser
	            // -------------------------------------------------------------
	            destroy: function() {
	                init_deferr.then(function() {
	                    command_line.destroy().remove();
	                    output.remove();
	                    $(document).unbind('.terminal');
	                    $(window).unbind('.terminal');
	                    self.unbind('click mousewheel mousedown mouseup');
	                    self.removeData('terminal').removeClass('terminal');
	                    if (settings.width) {
	                        self.css('width', '');
	                    }
	                    if (settings.height) {
	                        self.css('height', '');
	                    }
	                    $(window).off('blur', blur_terminal).
	                        off('focus', focus_terminal);
	                    terminals.remove(terminal_id);
	                });
	                return self;
	            }
	        }, function(name, fun) {
	            // wrap all functions and display execptions
	            return function() {
	                try {
	                    return fun.apply(self, [].slice.apply(arguments));
	                } catch (e) {
	                    // exec catch by command (resume call exec)
	                    if (name !== 'exec' && name !== 'resume') {
	                        display_exception(e, 'TERMINAL');
	                    }
	                    throw e;
	                }
	            };
	        }));
	
	        // -----------------------------------------------------------------
	        var on_scrollbar_show_resize = (function() {
	            var scroll_bars = have_scrollbars(self);
	            return function() {
	                if (scroll_bars !== have_scrollbars(self)) {
	                    // if the scollbar appearance changes we will have a
	                    // different number of chars
	                    self.resize();
	                    scroll_bars = have_scrollbars(self);
	                }
	            };
	        })();
	
	
	        // -----------------------------------------------------------------
	        // INIT CODE
	        // -----------------------------------------------------------------
	        if (settings.width) {
	            self.width(settings.width);
	        }
	        if (settings.height) {
	            self.height(settings.height);
	        }
	        var agent = navigator.userAgent.toLowerCase();
	        if (!agent.match(/(webkit)[ \/]([\w.]+)/) &&
	            self[0].tagName.toLowerCase() == 'body') {
	            scroll_object = $('html');
	        } else {
	            scroll_object = self;
	        }
	        // register ajaxSend for cancel requests on CTRL+D
	        $(document).bind('ajaxSend.terminal', function(e, xhr, opt) {
	            requests.push(xhr);
	        });
	        output = $('<div>').addClass('terminal-output').appendTo(self);
	        self.addClass('terminal');
	        // keep focus in clipboard textarea in mobile
	        /*
	          if (('ontouchstart' in window) || window.DocumentTouch &&
	          document instanceof DocumentTouch) {
	          self.click(function() {
	          self.find('textarea').focus();
	          });
	          self.find('textarea').focus();
	          }
	        */
	        /*
	          self.bind('touchstart.touchScroll', function() {
	
	          });
	          self.bind('touchmove.touchScroll', function() {
	
	          });
	        */
	        //$('<input type="text"/>').hide().focus().appendTo(self);
	
	        // before login event
	        if (settings.login && $.isFunction(settings.onBeforeLogin)) {
	            try {
	                if (settings.onBeforeLogin(self) === false) {
	                    autologin = false;
	                }
	            } catch (e) {
	                display_exception(e, 'onBeforeLogin');
	                throw e;
	            }
	        }
	        var auth = settings.login;
	        // create json-rpc authentication function
	        var base_interpreter;
	        if (typeof init_interpreter == 'string') {
	            base_interpreter = init_interpreter;
	        } else if (init_interpreter instanceof Array) {
	            // first JSON-RPC
	            for (var i=0, len=init_interpreter.length; i<len; ++i) {
	                if (typeof init_interpreter[i] == 'string') {
	                    base_interpreter = init_interpreter[i];
	                    break;
	                }
	            }
	        }
	        if (base_interpreter &&
	            (typeof settings.login === 'string' || settings.login === true)) {
	            settings.login = make_json_rpc_login(base_interpreter,
	                                                 settings.login);
	        }
	        terminals.append(self);
	        var interpreters;
	        var command_line;
	        var old_enabled;
	        function focus_terminal() {
	            if (old_enabled) {
	                self.focus();
	            }
	        }
	        function blur_terminal() {
	            old_enabled = enabled;
	            self.disable();
	        }
	        make_interpreter(init_interpreter, !!settings.login, function(itrp) {
	            if (settings.completion && typeof settings.completion != 'boolean' ||
	                !settings.completion) {
	                // overwrite interpreter completion by global setting #224
	                // we use string to indicate that it need to be taken from settings
	                // so we are able to change it using option API method
	                itrp.completion = 'settings';
	            }
	            interpreters = new Stack($.extend({
	                name: settings.name,
	                prompt: settings.prompt,
	                keypress: settings.keypress,
	                keydown: settings.keydown,
	                resize: settings.onResize,
	                greetings: settings.greetings,
	                mousewheel: settings.mousewheel
	            }, itrp));
	            // CREATE COMMAND LINE
	            command_line = $('<div/>').appendTo(self).cmd({
	                prompt: settings.prompt,
	                history: settings.history,
	                historyFilter: settings.historyFilter,
	                historySize: settings.historySize,
	                width: '100%',
	                enabled: enabled && !is_touch,
	                keydown: key_down,
	                keypress: function(e) {
	                    var result, i, top = interpreters.top();
	                    if ($.isFunction(top.keypress)) {
	                        return top.keypress(e, self);
	                    } else if ($.isFunction(settings.keypress)) {
	                        return settings.keypress(e, self);
	                    }
	                },
	                onCommandChange: function(command) {
	                    if ($.isFunction(settings.onCommandChange)) {
	                        try {
	                            settings.onCommandChange(command, self);
	                        } catch (e) {
	                            display_exception(e, 'onCommandChange');
	                            throw e;
	                        }
	                    }
	                    scroll_to_bottom();
	                },
	                commands: commands
	            });
	            // touch devices need touch event to get virtual keyboard
	            if (enabled && self.is(':visible') && !is_touch) {
	                self.focus(undefined, true);
	            } else {
	                self.disable();
	            }
	            self.oneTime(100, function() {
	                function disable(e) {
	                    var sender = $(e.target);
	                    if (!sender.closest('.terminal').length &&
	                        self.enabled() &&
	                        settings.onBlur(self) !== false) {
	                        self.disable();
	                    }
	                }
	                $(document).bind('click.terminal', disable).
	                    bind('contextmenu.terminal', disable);
	            });
	            var $win = $(window);
	            if (!is_touch) {
	                // work weird on mobile
	                $win.on('focus', focus_terminal).
	                    on('blur', blur_terminal);
	            } else {
	                /*
	                self.find('textarea').on('blur.terminal', function() {
	                    if (enabled) {
	                        self.focus(false);
	                    }
	                });*/
	            }
	            // detect mouse drag
	            (function() {
	                var count = 0;
	                var isDragging = false;
	                self.mousedown(function() {
	                    $(window).mousemove(function() {
	                        isDragging = true;
	                        count = 0;
	                        $(window).unbind('mousemove');
	                    });
	                }).mouseup(function() {
	                    var wasDragging = isDragging;
	                    isDragging = false;
	                    $(window).unbind('mousemove');
	                    if (!wasDragging && ++count == 1) {
	                        count = 0;
	                        if (!self.enabled() && !frozen) {
	                            self.focus();
	                            command_line.enable();
	                        }
	                    }
	                });
	            })();
	            if (is_touch) {
	                self.click(function() {
	                    if (!self.enabled() && !frozen) {
	                        self.focus();
	                        command_line.enable();
	                    } else {
	                        self.focus(false);
	                    }
	                });
	            }
	            self.delegate('.exception a', 'click', function(e) {
	                //.on('click', '.exception a', function(e) {
	                // in new jquery .delegate just call .on
	                var href = $(this).attr('href');
	                if (href.match(/:[0-9]+$/)) { // display line if specified
	                    e.preventDefault();
	                    print_line(href);
	                }
	            });
	            if (!navigator.platform.match(/linux/i)) {
	                // on linux system paste work with middle mouse button
	                self.mousedown(function(e) {
	                    if (e.which == 2) {
	                        var selected = get_selected_text();
	                        self.insert(selected);
	                    }
	                });
	            }
	            if (self.is(':visible')) {
	                num_chars = self.cols();
	                command_line.resize(num_chars);
	                num_rows = get_num_rows(self);
	            }
	            // -------------------------------------------------------------
	            // Run Login
	            if (settings.login) {
	                self.login(settings.login, true, initialize);
	            } else {
	                initialize();
	            }
	            self.oneTime(100, function() {
	                $win.bind('resize.terminal', function() {
	                    if (self.is(':visible')) {
	                        var width = self.width();
	                        var height = self.height();
	                        // prevent too many calculations in IE
	                        if (old_height !== height || old_width !== width) {
	                            self.resize();
	                        }
	                    }
	                });
	            });
	            // -------------------------------------------------------------
	            // :: helper
	            function exec_spec(spec) {
	                var terminal = terminals.get()[spec[0]];
	                // execute if belong to this terminal
	                if (terminal && terminal_id == terminal.id()) {
	                    if (spec[2]) {
	                        try {
	                            if (paused) {
	                                var defer = $.Deferred();
	                                resume_callbacks.push(function() {
	                                    return terminal.exec(spec[2]).then(function(term, i) {
	                                        terminal.save_state(spec[2], true, spec[1]);
	                                        defer.resolve();
	                                    });
	                                });
	                                return defer.promise();
	                            } else {
	                                return terminal.exec(spec[2]).then(function(term, i) {
	                                    terminal.save_state(spec[2], true, spec[1]);
	                                });
	                            }
	                        } catch (e) {
	                            var cmd = $.terminal.escape_brackets(command);
	                            var msg = "Error while exec with command " + cmd;
	                            terminal.error(msg).exception(e);
	                        }
	                    }
	                }
	            }
	            // exec from hash called in each terminal instance
	            if (settings.execHash) {
	                if (location.hash) {
	                    // wait until login is initialized
	                    setTimeout(function() {
	                        try {
	                            var hash = location.hash.replace(/^#/, '');
	                            // yes no var - local inside terminal
	                            hash_commands = $.parseJSON(decodeURIComponent(hash));
	                            var i = 0;
	                            (function recur() {
	                                var spec = hash_commands[i++];
	                                if (spec) {
	                                    exec_spec(spec).then(recur);
	                                } else {
	                                    change_hash = true;
	                                }
	                            })();//*/
	                        } catch (e) {
	                            //invalid json - ignore
	                        }
	                    });
	                } else {
	                    change_hash = true;
	                }
	            } else {
	                change_hash = true; // if enabled later
	            }
	            //change_hash = true; // exec can now change hash
	            // -------------------------------------------------------------
	            if ($.event.special.mousewheel) {
	                var shift = false;
	                $(document).bind('keydown.terminal', function(e) {
	                    if (e.shiftKey) {
	                        shift = true;
	                    }
	                }).bind('keyup.terminal', function(e) {
	                    // in Google Chromium/Linux shiftKey is false
	                    if (e.shiftKey || e.which == 16) {
	                        shift = false;
	                    }
	                });
	                self.mousewheel(function(event, delta) {
	                    if (!shift) {
	                        var interpreter = interpreters.top();
	                        if ($.isFunction(interpreter.mousewheel)) {
	                            var ret = interpreter.mousewheel(event, delta, self);
	                            if (ret === false) {
	                                return;
	                            }
	                        } else if ($.isFunction(settings.mousewheel)) {
	                            settings.mousewheel(event, delta, self);
	                        }
	                        if (delta > 0) {
	                            self.scroll(-40);
	                        } else {
	                            self.scroll(40);
	                        }
	                        //event.preventDefault();
	                    }
	                });
	            }
	            init_deferr.resolve();
	        }); // make_interpreter
	        self.data('terminal', self);
	        return self;
	    }; //terminal plugin
	})(jQuery);
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	function chunk(arr, limit) {
		var result = [];
	
		while (arr.length > limit) {
			result.push(arr.slice(0, limit));
			arr = arr.slice(limit);
		}
	
		if (arr.length > 0) result.push(arr);
	
		return result;
	}
	
	function substitutePrintableChar(ch) {
		var sabreLayout = {
			'\'': '‡',
			'[': '¤',
			'=': '*',
			'\\': '§'
		};
	
		if (sabreLayout[ch]) return sabreLayout[ch];
	
		return ch.toUpperCase();
	}
	
	function splitLines(txt) {
		return txt.split(/\r?\n/);
	}
	
	function makeCachedParts(txt) {
		var lines = splitLines(txt);
	
		return chunk(lines, 20).map(function (sectionLines) {
			return sectionLines.join('\n');
		});
	}
	
	var Helpers = {
		makeCachedParts: makeCachedParts,
		substitutePrintableChar: substitutePrintableChar
	};
	
	module.exports = Helpers;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var splitBtn = document.createElement("button");
	
	splitBtn.className = "btn btn-purple zbtn-invert t-f-size-14 btn-rounded";
	splitBtn.innerHTML = '<i class="fa fa-fw fa-columns t-bold"></i>';
	
	function bufferBtn() {
		return {
			make: function make(callback) {
				var buffer = document.createElement("button");
	
				buffer.innerHTML = '<i class="fa fa-fw fa-clipboard"></i>';
				buffer.className = "btn btn-primary btn-rounded t-f-size-14";
				buffer.addEventListener("click", callback);
	
				return buffer;
			}
		};
	}
	
	var minimize = document.createElement("button");
	
	minimize.innerHTML = "splitBtn";
	minimize.className = "btn btn-success";
	
	minimize.addEventListener("click", function () {
		console.log(root);
	});
	
	exports.splitBtn = splitBtn;
	exports.minimize = minimize;
	exports.bufferBtn = bufferBtn;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	// function availableFormats()
	// {
	// 	let container = document.createElement('div');
	//
	// 	container.innerHTML = `
	// 	<div class="text-center heading">Availability formats</div>
	//
	// 	<table class="table">
	// 		<thead>
	// 			<tr>
	// 				<th>Apollo</th>
	// 				<th>Sabre</th>
	// 			</tr>
	// 		</thead>
	// 		<tr>
	// 			<td>asdsad sa</td>
	// 			<td> adssa d sa</td>
	// 		</tr>
	// 	</table>`;
	//
	// 	return container;
	// }
	//
	//
	// let section = document.createElement('section');
	// let ul 		= document.createElement('ul');
	//
	// ul.className = 'list';
	//
	// ul.appendChild( createList({
	// 	name : 'Pcc & product Info',
	// 	text : 'bla bal bal'
	// }) );
	//
	// ul.appendChild( createList({
	// 	name : 'Tariff display formats',
	// 	text : 'bla bal bal'
	// }) );
	//
	// ul.appendChild( availableFormats() );
	//
	// ul.appendChild( createList({
	// 	name : 'Sell seats',
	// 	text : 'bla bal bal'
	// }) );
	//
	// ul.appendChild( createList({
	// 	name : 'Pricing formats',
	// 	text : 'bla bal bal'
	// }) );
	//
	// sideMenu.appendChild( ul );
	
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _constants = __webpack_require__(8);
	
	var _requests = __webpack_require__(9);
	
	var _requests2 = _interopRequireDefault(_requests);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var SideMenu = function () {
		var ul = void 0,
		    sideMenu = document.createElement('aside');
	
		function createList() {
			var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
			var button = document.createElement('button');
			button.className = 'js-collapse btn btn-white btn-block';
			button.innerHTML = params.name;
	
			var container = document.createElement('div');
			container.innerHTML = params.text;
			container.className = 'm-t-sm';
			container.style.display = 'none';
	
			var hidden = true;
			button.addEventListener('click', function () {
				hidden = !hidden;
				container.style.display = hidden ? 'none' : '';
			});
	
			var li = document.createElement('li');
			li.appendChild(button);
			li.appendChild(container);
	
			return li;
		}
	
		function getData() {
			_requests2.default.get(_constants.INFO_DATA_URL).then(function (response) {
				response.data.map(function (obj) {
					ul.appendChild(createList({
						name: obj.name,
						text: obj.info
					}));
				});
	
				sideMenu.appendChild(ul);
			});
		}
	
		return {
			render: function render() {
				ul = document.createElement('ul');
				ul.className = 'list';
	
				getData();
				return sideMenu;
			}
		};
	}();
	
	exports.default = {
		render: SideMenu.render
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(16);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(18)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js?sourceMap!./main.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js?sourceMap!./main.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(17)();
	// imports
	
	
	// module
	exports.push([module.id, "/*!\n *       __ _____                     ________                              __\n *      / // _  /__ __ _____ ___ __ _/__  ___/__ ___ ______ __ __  __ ___  / /\n *  __ / // // // // // _  // _// // / / // _  // _//     // //  \\/ // _ \\/ /\n * /  / // // // // // ___// / / // / / // ___// / / / / // // /\\  // // / /__\n * \\___//____ \\\\___//____//_/ _\\_  / /_//____//_/ /_/ /_//_//_/ /_/ \\__\\_\\___/\n *           \\/              /____/                              version 0.11.11\n * http://terminal.jcubic.pl\n *\n * This file is part of jQuery Terminal.\n *\n * Copyright (c) 2011-2016 Jakub Jankiewicz <http://jcubic.pl>\n * Released under the MIT license\n *\n * Date: Fri, 07 Oct 2016 19:35:06 +0000\n */\n.terminal .terminal-output .format,\n.cmd .format,\n.cmd .prompt,\n.cmd .prompt div,\n.terminal .terminal-output div div {\n  display: inline-block;\n}\n.terminal h1,\n.terminal h2,\n.terminal h3,\n.terminal h4,\n.terminal h5,\n.terminal h6,\n.terminal pre,\n.cmd {\n  margin: 0;\n}\n.terminal h1,\n.terminal h2,\n.terminal h3,\n.terminal h4,\n.terminal h5,\n.terminal h6 {\n  line-height: 1.2em;\n}\n/*\n.cmd .mask {\n    width: 10px;\n    height: 11px;\n    background: black;\n    z-index: 100;\n}\n*/\n.cmd .clipboard {\n  position: absolute;\n  left: -16px;\n  top: 0;\n  width: 10px;\n  height: 16px;\n  /* this seems to work after all on Android */\n  /*left: -99999px;\n\tclip: rect(1px,1px,1px,1px);\n\t/* on desktop textarea appear when paste */\n  /*\n\topacity: 0.01;\n\tfilter: alpha(opacity = 0.01);\n\tfilter: progid:DXImageTransform.Microsoft.Alpha(opacity=0.01);\n\t*/\n  background: transparent;\n  border: none;\n  color: transparent;\n  outline: none;\n  padding: 0;\n  resize: none;\n  z-index: 0;\n  overflow: hidden;\n}\n.terminal .error {\n  color: #f00;\n}\n.terminal {\n  padding: 10px;\n  position: relative;\n  /*overflow: hidden;*/\n  overflow: auto;\n}\n.cmd {\n  padding: 0;\n  height: 1.3em;\n  position: relative;\n  /*margin-top: 3px; */\n}\n.terminal .inverted,\n.cmd .inverted,\n.cmd .cursor.blink {\n  background-color: #aaa;\n  color: #000;\n}\n.cmd .cursor.blink {\n  -webkit-animation: terminal-blink 1s infinite steps(1, start);\n  -moz-animation: terminal-blink 1s infinite steps(1, start);\n  -ms-animation: terminal-blink 1s infinite steps(1, start);\n  animation: terminal-blink 1s infinite steps(1, start);\n}\n@-webkit-keyframes terminal-blink {\n  0%,\n  100% {\n    background-color: #000;\n    color: #aaa;\n  }\n  50% {\n    background-color: #bbb;\n    color: #000;\n  }\n}\n@-ms-keyframes terminal-blink {\n  0%,\n  100% {\n    background-color: #000;\n    color: #aaa;\n  }\n  50% {\n    background-color: #bbb;\n    color: #000;\n  }\n}\n@-moz-keyframes terminal-blink {\n  0%,\n  100% {\n    background-color: #000;\n    color: #aaa;\n  }\n  50% {\n    background-color: #bbb;\n    color: #000;\n  }\n}\n@keyframes terminal-blink {\n  0%,\n  100% {\n    background-color: #000;\n    color: #aaa;\n  }\n  50% {\n    background-color: #bbb;\n    /* not #aaa because it's seems there is Google Chrome bug */\n    color: #000;\n  }\n}\n.terminal .terminal-output div div,\n.cmd .prompt {\n  display: block;\n  line-height: 14px;\n  height: auto;\n}\n.cmd .prompt {\n  float: left;\n}\n.terminal,\n.cmd {\n  font-family: monospace;\n  /*font-family: FreeMono, monospace; this don't work on Android */\n  color: #aaa;\n  background-color: #000;\n  font-size: 12px;\n  line-height: 14px;\n}\n.terminal-output > div {\n  /*padding-top: 3px;*/\n  min-height: 14px;\n}\n.terminal-output > div > div * {\n  word-wrap: break-word;\n  /* when echo html */\n}\n.terminal .terminal-output div span {\n  display: inline-block;\n}\n.cmd span {\n  float: left;\n  /*display: inline-block; */\n}\n/* fix double style of selecting text in terminal */\n.terminal-output span,\n.terminal-output a,\n.cmd div,\n.cmd span,\n.terminal td,\n.terminal pre,\n.terminal h1,\n.terminal h2,\n.terminal h3,\n.terminal h4,\n.terminal h5,\n.terminal h6 {\n  -webkit-touch-callout: initial;\n  -webkit-user-select: initial;\n  -khtml-user-select: initial;\n  -moz-user-select: initial;\n  -ms-user-select: initial;\n  user-select: initial;\n}\n.terminal,\n.terminal-output,\n.terminal-output div {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n/* firefox hack */\n@-moz-document url-prefix() {\n  .terminal,\n  .terminal-output,\n  .terminal-output div {\n    -webkit-touch-callout: initial;\n    -webkit-user-select: initial;\n    -khtml-user-select: initial;\n    -moz-user-select: initial;\n    -ms-user-select: initial;\n    user-select: initial;\n  }\n}\n.terminal table {\n  border-collapse: collapse;\n}\n.terminal td {\n  border: 1px solid #aaa;\n}\n.terminal h1::-moz-selection,\n.terminal h2::-moz-selection,\n.terminal h3::-moz-selection,\n.terminal h4::-moz-selection,\n.terminal h5::-moz-selection,\n.terminal h6::-moz-selection,\n.terminal pre::-moz-selection,\n.terminal td::-moz-selection,\n.terminal .terminal-output div div::-moz-selection,\n.terminal .terminal-output div span::-moz-selection,\n.terminal .terminal-output div div a::-moz-selection,\n.cmd div::-moz-selection,\n.cmd > span::-moz-selection,\n.cmd .prompt span::-moz-selection {\n  background-color: #aaa;\n  color: #000;\n}\n/* this don't work in Chrome\n.terminal tr td::-moz-selection {\n    border-color: #000;\n}\n.terminal tr td::selection {\n    border-color: #000;\n}\n*/\n.terminal h1::selection,\n.terminal h2::selection,\n.terminal h3::selection,\n.terminal h4::selection,\n.terminal h5::selection,\n.terminal h6::selection,\n.terminal pre::selection,\n.terminal td::selection,\n.terminal .terminal-output div div::selection,\n.terminal .terminal-output div div a::selection,\n.terminal .terminal-output div span::selection,\n.cmd div::selection,\n.cmd > span::selection,\n.cmd .prompt span::selection {\n  background-color: #aaa;\n  color: #000;\n}\n.terminal .terminal-output div.error,\n.terminal .terminal-output div.error div {\n  color: red;\n}\n.tilda {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  z-index: 1100;\n}\n.clear {\n  clear: both;\n}\n.terminal a {\n  color: #0F60FF;\n}\n.terminal a:hover {\n  color: red;\n}\nbody {\n  margin: 0;\n  background: #451919;\n}\n.terminal-wrap {\n  font-family: \"Lucida Grande\", sans-serif;\n  font-size: 11px;\n  color: #414141;\n  border-radius: 6px;\n  margin: 20px;\n  box-shadow: inset rgba(255, 255, 255, 0.7) 0 1px 1px;\n}\n.terminal-wrap .title-bar {\n  padding: 5px 0;\n  text-align: center;\n  text-shadow: rgba(255, 255, 255, 0.8) 0 1px 0;\n  background-image: -webkit-linear-gradient(top, #e8e8e8, #bcbbbc);\n  background-image: -moz-linear-gradient(top, #e8e8e8, #bcbbbc);\n  background-image: linear-gradient(top, #e8e8e8, #bcbbbc);\n}\n.terminal-wrap .menu {\n  position: absolute;\n  right: 3px;\n  z-index: 2;\n}\n.terminal-wrap .btn {\n  display: inline-block;\n  margin-bottom: 0;\n  text-align: center;\n  vertical-align: middle;\n  touch-action: manipulation;\n  cursor: pointer;\n  background-image: none;\n  border: 1px solid transparent;\n  white-space: nowrap;\n  padding: 6px 12px;\n  font-size: 11px;\n  line-height: 1.545454;\n  border-radius: 2px;\n  font-weight: bold;\n}\n.terminal-wrap .btn + .btn {\n  margin-left: 5px;\n}\n.terminal-wrap .btn-block {\n  width: 100%;\n}\n.terminal-wrap .btn-success {\n  color: #fff !important;\n  background-color: #5cb85c;\n  border-color: #5cb85c;\n}\n.terminal-wrap .btn-success:hover,\n.terminal-wrap .btn-success:focus,\n.terminal-wrap .btn-success:active,\n.terminal-wrap .btn-success.active,\n.open .dropdown-toggle.terminal-wrap .btn-success {\n  color: #fff !important;\n  background-color: #47a447;\n  border-color: #419641;\n}\n.terminal-wrap .btn-success:active,\n.terminal-wrap .btn-success.active,\n.open .dropdown-toggle.terminal-wrap .btn-success {\n  background-image: none;\n}\n.terminal-wrap .btn-success.disabled,\n.terminal-wrap .btn-success[disabled],\nfieldset[disabled] .terminal-wrap .btn-success,\n.terminal-wrap .btn-success.disabled:hover,\n.terminal-wrap .btn-success[disabled]:hover,\nfieldset[disabled] .terminal-wrap .btn-success:hover,\n.terminal-wrap .btn-success.disabled:focus,\n.terminal-wrap .btn-success[disabled]:focus,\nfieldset[disabled] .terminal-wrap .btn-success:focus,\n.terminal-wrap .btn-success.disabled:active,\n.terminal-wrap .btn-success[disabled]:active,\nfieldset[disabled] .terminal-wrap .btn-success:active,\n.terminal-wrap .btn-success.disabled.active,\n.terminal-wrap .btn-success[disabled].active,\nfieldset[disabled] .terminal-wrap .btn-success.active {\n  background-color: #5cb85c;\n  border-color: #5cb85c;\n}\n.terminal-wrap .btn-primary {\n  color: #fff !important;\n  background-color: #3C506F;\n  border-color: #3C506F;\n}\n.terminal-wrap .btn-primary:hover,\n.terminal-wrap .btn-primary:focus,\n.terminal-wrap .btn-primary:active,\n.terminal-wrap .btn-primary.active,\n.open .dropdown-toggle.terminal-wrap .btn-primary {\n  color: #fff !important;\n  background-color: #2e3d55;\n  border-color: #273347;\n}\n.terminal-wrap .btn-primary:active,\n.terminal-wrap .btn-primary.active,\n.open .dropdown-toggle.terminal-wrap .btn-primary {\n  background-image: none;\n}\n.terminal-wrap .btn-primary.disabled,\n.terminal-wrap .btn-primary[disabled],\nfieldset[disabled] .terminal-wrap .btn-primary,\n.terminal-wrap .btn-primary.disabled:hover,\n.terminal-wrap .btn-primary[disabled]:hover,\nfieldset[disabled] .terminal-wrap .btn-primary:hover,\n.terminal-wrap .btn-primary.disabled:focus,\n.terminal-wrap .btn-primary[disabled]:focus,\nfieldset[disabled] .terminal-wrap .btn-primary:focus,\n.terminal-wrap .btn-primary.disabled:active,\n.terminal-wrap .btn-primary[disabled]:active,\nfieldset[disabled] .terminal-wrap .btn-primary:active,\n.terminal-wrap .btn-primary.disabled.active,\n.terminal-wrap .btn-primary[disabled].active,\nfieldset[disabled] .terminal-wrap .btn-primary.active {\n  background-color: #3C506F;\n  border-color: #3C506F;\n}\n.terminal-wrap .btn-purple {\n  color: #fff !important;\n  background-color: #863F88;\n  border-color: #863F88;\n}\n.terminal-wrap .btn-purple:hover,\n.terminal-wrap .btn-purple:focus,\n.terminal-wrap .btn-purple:active,\n.terminal-wrap .btn-purple.active,\n.open .dropdown-toggle.terminal-wrap .btn-purple {\n  color: #fff !important;\n  background-color: #6b326c;\n  border-color: #5d2c5e;\n}\n.terminal-wrap .btn-purple:active,\n.terminal-wrap .btn-purple.active,\n.open .dropdown-toggle.terminal-wrap .btn-purple {\n  background-image: none;\n}\n.terminal-wrap .btn-purple.disabled,\n.terminal-wrap .btn-purple[disabled],\nfieldset[disabled] .terminal-wrap .btn-purple,\n.terminal-wrap .btn-purple.disabled:hover,\n.terminal-wrap .btn-purple[disabled]:hover,\nfieldset[disabled] .terminal-wrap .btn-purple:hover,\n.terminal-wrap .btn-purple.disabled:focus,\n.terminal-wrap .btn-purple[disabled]:focus,\nfieldset[disabled] .terminal-wrap .btn-purple:focus,\n.terminal-wrap .btn-purple.disabled:active,\n.terminal-wrap .btn-purple[disabled]:active,\nfieldset[disabled] .terminal-wrap .btn-purple:active,\n.terminal-wrap .btn-purple.disabled.active,\n.terminal-wrap .btn-purple[disabled].active,\nfieldset[disabled] .terminal-wrap .btn-purple.active {\n  background-color: #863F88;\n  border-color: #863F88;\n}\n.terminal-wrap .btn-white {\n  color: #717171 !important;\n  background-color: #fff;\n  border-color: #e1e1e1;\n}\n.terminal-wrap .btn-white:hover,\n.terminal-wrap .btn-white:focus,\n.terminal-wrap .btn-white:active,\n.terminal-wrap .btn-white.active,\n.open .dropdown-toggle.terminal-wrap .btn-white {\n  color: #717171 !important;\n  background-color: #ebebeb;\n  border-color: #c2c2c2;\n}\n.terminal-wrap .btn-white:active,\n.terminal-wrap .btn-white.active,\n.open .dropdown-toggle.terminal-wrap .btn-white {\n  background-image: none;\n}\n.terminal-wrap .btn-white.disabled,\n.terminal-wrap .btn-white[disabled],\nfieldset[disabled] .terminal-wrap .btn-white,\n.terminal-wrap .btn-white.disabled:hover,\n.terminal-wrap .btn-white[disabled]:hover,\nfieldset[disabled] .terminal-wrap .btn-white:hover,\n.terminal-wrap .btn-white.disabled:focus,\n.terminal-wrap .btn-white[disabled]:focus,\nfieldset[disabled] .terminal-wrap .btn-white:focus,\n.terminal-wrap .btn-white.disabled:active,\n.terminal-wrap .btn-white[disabled]:active,\nfieldset[disabled] .terminal-wrap .btn-white:active,\n.terminal-wrap .btn-white.disabled.active,\n.terminal-wrap .btn-white[disabled].active,\nfieldset[disabled] .terminal-wrap .btn-white.active {\n  background-color: #fff;\n  border-color: #e1e1e1;\n}\n.terminal-wrap .clear:before,\n.terminal-wrap .clear:after {\n  content: \" \";\n  /* 1 */\n  display: table;\n  /* 2 */\n}\n.terminal-wrap .clear:after {\n  clear: both;\n}\n.terminal-wrap .container {\n  padding: 50px;\n}\n.terminal-wrap .heading {\n  border: 1px solid #e1e1e1;\n  padding: 10px;\n  font-weight: bold;\n}\n.terminal-wrap .list {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.terminal-wrap .list li {\n  padding: 10px 0;\n}\n.terminal-wrap .menu {\n  padding: 10px 0;\n  text-align: right;\n}\n.terminal-wrap .border-top {\n  border-top: 1px solid #2D2D2D;\n}\n.terminal-wrap .panel-right {\n  width: 20%;\n  background: #fff;\n  padding: 15px;\n}\n.terminal-wrap .pull-left {\n  float: left;\n}\n.terminal-wrap .pull-right {\n  float: left;\n}\n.terminal-wrap .table {\n  border: 1px solid #e1e1e1;\n  font-size: 11px;\n  width: 100%;\n  border-collapse: collapse;\n  text-align: center;\n}\n.terminal-wrap .table thead th {\n  background: #e1e1e1;\n  font-weight: bold;\n}\n.terminal-wrap .table th {\n  font-weight: bold;\n}\n.terminal-wrap .table th,\n.terminal-wrap .table td {\n  padding: 10px 5px;\n}\n.terminal-wrap .terminal {\n  cursor: text;\n}\n.terminal-wrap .text-center {\n  text-align: center;\n}\n.terminal-wrap .text-right {\n  text-align: right;\n}\n.terminal-wrap .t-d-table {\n  display: table;\n  width: 100%;\n}\n.terminal-wrap .t-d-row {\n  display: table-row;\n}\n.terminal-wrap .t-d-cell {\n  vertical-align: top;\n  display: table-cell;\n}\n.terminal-wrap .t-f-size-14 {\n  font-size: 14px;\n}\n.terminal-wrap .t-bold {\n  font-weight: bold;\n}\n.terminal-wrap .wrapper-sm {\n  padding: 5px 10px;\n}\n\n/*# sourceMappingURL=main.css.map*/", "", {"version":3,"sources":["/./webpack:/src/theme/main.less","/./webpack:/webpack:/src/theme/terminal.less","/./webpack:/webpack:/src/theme/main.less","/./webpack:/webpack:/src/theme/mixins.less","/../../../../../../public/main.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;;GAeG;ACCH;;;;;EAEC,sBAAA;CDIA;ACFD;;;;;;;;EACC,UAAA;CDWA;ACTD;;;;;;EACC,mBAAA;CDgBA;AACD;;;;;;;EAOE;ACdF;EACC,mBAAA;EACA,YAAA;EACA,OAAA;EACA,YAAA;EACA,aAAA;EDgBC,6CAA6C;EAC7C;;4CAE0C;EAC1C;;;;GAIC;ECdF,wBAAA;EACA,aAAA;EACA,mBAAA;EACA,cAAA;EACA,WAAA;EACA,aAAA;EACA,WAAA;EACA,iBAAA;CDgBA;ACdD;EACC,YAAA;CDgBA;ACdD;EACC,cAAA;EACA,mBAAA;EDgBC,qBAAqB;ECdtB,eAAA;CDgBA;ACdD;EACC,WAAA;EACA,cAAA;EACA,mBAAA;EDgBC,qBAAqB;CACtB;ACdD;;;EACC,uBAAA;EACA,YAAA;CDkBA;AChBD;EACC,8DAAA;EACA,2DAAA;EACA,0DAAA;EACA,sDAAA;CDkBA;AChBD;EACC;;IACC,uBAAA;IACA,YAAA;GDmBC;ECjBF;IACC,uBAAA;IACA,YAAA;GDmBC;CACF;AChBD;EACC;;IACC,uBAAA;IACA,YAAA;GDmBC;ECjBF;IACC,uBAAA;IACA,YAAA;GDmBC;CACF;AChBD;EACC;;IACC,uBAAA;IACA,YAAA;GDmBC;ECjBF;IACC,uBAAA;IACA,YAAA;GDmBC;CACF;ACjBD;EACC;;IACC,uBAAA;IACA,YAAA;GDoBC;EClBF;IACC,uBAAA;IDoBE,4DAA4D;ICnB9D,YAAA;GDqBC;CACF;AClBD;;EACC,eAAA;EACA,kBAAA;EACA,aAAA;CDqBA;ACnBD;EACC,YAAA;CDqBA;ACnBD;;EACC,uBAAA;EDsBC,iEAAiE;ECpBlE,YAAA;EACA,uBAAA;EACA,gBAAA;EACA,kBAAA;CDsBA;ACnBD;EDqBE,qBAAqB;ECnBtB,iBAAA;CDqBA;ACnBD;EACC,sBAAA;EDqBC,oBAAoB;CACrB;ACpBD;EACC,sBAAA;CDsBA;ACpBD;EACC,YAAA;EDsBC,2BAA2B;CAC5B;AACD,oDAAoD;ACpBpD;;;;;;;;;;;;EAGC,+BAAA;EACA,6BAAA;EACA,4BAAA;EACA,0BAAA;EACA,yBAAA;EACA,qBAAA;CD+BA;AC7BD;;;EACC,4BAAA;EACA,0BAAA;EACA,yBAAA;EACA,uBAAA;EACA,sBAAA;EACA,kBAAA;CDiCA;AACD,kBAAkB;AC/BlB;EACC;;;IACC,+BAAA;IACA,6BAAA;IACA,4BAAA;IACA,0BAAA;IACA,yBAAA;IACA,qBAAA;GDmCC;CACF;ACjCD;EACC,0BAAA;CDmCA;ACjCD;EACC,uBAAA;CDmCA;ACjCD;;;;;;;;;;;;;;EAcC,uBAAA;EACA,YAAA;CDmCA;AACD;;;;;;;EAOE;ACjCF;;;;;;;;;;;;;;EAcC,uBAAA;EACA,YAAA;CDmCA;ACjCD;;EACC,WAAA;CDoCA;AClCD;EACC,gBAAA;EACA,OAAA;EACA,QAAA;EACA,YAAA;EACA,cAAA;CDoCA;AClCD;EACC,YAAA;CDoCA;AClCD;EACC,eAAA;CDoCA;AClCD;EACC,WAAA;CDoCA;AE3RD;EACC,UAAA;EACA,oBAAA;CF6RA;AE1RD;EACC,yCAAA;EACA,gBAAA;EACA,eAAA;EACA,mBAAA;EACA,aAAA;EAEA,qDAAA;CF2RA;AElSD;EAUE,eAAA;EACA,mBAAA;EACA,8CAAA;EACA,iEAAA;EACA,8DAAA;EACA,yDAAA;CF2RD;AE1SD;EAmBE,mBAAA;EACA,WAAA;EACA,WAAA;CF0RD;AE/SD;EAyBE,sBAAA;EACA,iBAAA;EACA,mBAAA;EACA,uBAAA;EACA,2BAAA;EACA,gBAAA;EACA,uBAAA;EACA,8BAAA;EACA,oBAAA;EACA,kBAAA;EACA,gBAAA;EACA,sBAAA;EACA,mBAAA;EACA,kBAAA;CFyRD;AEvRC;EACC,iBAAA;CFyRF;AElUD;EA8CE,YAAA;CFuRD;AErUD;EC+EC,uBAAA;EACA,0BAAA;EACA,sBAAA;CHyPA;AGvPA;;;;;EAKC,uBAAA;EACA,0BAAA;EACA,sBAAA;CHyPD;AGvPA;;;EAGC,uBAAA;CHyPD;AGpPC;;;;;;;;;;;;;;;EAKC,0BAAA;EACA,sBAAA;CHgQF;AE1WD;EC+EC,uBAAA;EACA,0BAAA;EACA,sBAAA;CH8RA;AG5RA;;;;;EAKC,uBAAA;EACA,0BAAA;EACA,sBAAA;CH8RD;AG5RA;;;EAGC,uBAAA;CH8RD;AGzRC;;;;;;;;;;;;;;;EAKC,0BAAA;EACA,sBAAA;CHqSF;AE/YD;EC+EC,uBAAA;EACA,0BAAA;EACA,sBAAA;CHmUA;AGjUA;;;;;EAKC,uBAAA;EACA,0BAAA;EACA,sBAAA;CHmUD;AGjUA;;;EAGC,uBAAA;CHmUD;AG9TC;;;;;;;;;;;;;;;EAKC,0BAAA;EACA,sBAAA;CH0UF;AEpbD;EC+EC,0BAAA;EACA,uBAAA;EACA,sBAAA;CHwWA;AGtWA;;;;;EAKC,0BAAA;EACA,0BAAA;EACA,sBAAA;CHwWD;AGtWA;;;EAGC,uBAAA;CHwWD;AGnWC;;;;;;;;;;;;;;;EAKC,uBAAA;EACA,sBAAA;CH+WF;AGleA;;EAEC,aAAA;EHoeA,OAAO;EGneP,eAAA;EHqeA,OAAO;CACR;AGpeA;EACC,YAAA;CHseD;AEneD;EAoFE,cAAA;CFkZD;AEteD;EAwFE,0BAAA;EACA,cAAA;EACA,kBAAA;CFiZD;AE3eD;EA8FE,iBAAA;EACA,WAAA;EACA,UAAA;CFgZD;AEhfD;EAmGG,gBAAA;CFgZF;AEnfD;EAwGE,gBAAA;EACA,kBAAA;CF8YD;AEvfD;EA6GE,8BAAA;CF6YD;AE1fD;EAiHE,WAAA;EACA,iBAAA;EACA,cAAA;CF4YD;AE/fD;EAuHE,YAAA;CF2YD;AElgBD;EA2HE,YAAA;CF0YD;AErgBD;EA+HE,0BAAA;EACA,gBAAA;EACA,YAAA;EACA,0BAAA;EAEA,mBAAA;CFwYD;AE5gBD;EAwII,oBAAA;EACA,kBAAA;CFuYH;AEhhBD;EA8IG,kBAAA;CFqYF;AEnhBD;;EAkJG,kBAAA;CFqYF;AEvhBD;EAyJE,aAAA;CFiYD;AE1hBD;EA6JE,mBAAA;CFgYD;AE7hBD;EAgKE,kBAAA;CFgYD;AEhiBD;EAoKE,eAAA;EACA,YAAA;CF+XD;AEpiBD;EAyKE,mBAAA;CF8XD;AEviBD;EA6KE,oBAAA;EACA,oBAAA;CF6XD;AE3iBD;EAkLE,gBAAA;CF4XD;AE9iBD;EAsLE,kBAAA;CF2XD;AEjjBD;EA0LE,kBAAA;CF0XD;;AIED,mCAAmC","file":"main.css","sourcesContent":["/*!\n *       __ _____                     ________                              __\n *      / // _  /__ __ _____ ___ __ _/__  ___/__ ___ ______ __ __  __ ___  / /\n *  __ / // // // // // _  // _// // / / // _  // _//     // //  \\/ // _ \\/ /\n * /  / // // // // // ___// / / // / / // ___// / / / / // // /\\  // // / /__\n * \\___//____ \\\\___//____//_/ _\\_  / /_//____//_/ /_/ /_//_//_/ /_/ \\__\\_\\___/\n *           \\/              /____/                              version 0.11.11\n * http://terminal.jcubic.pl\n *\n * This file is part of jQuery Terminal.\n *\n * Copyright (c) 2011-2016 Jakub Jankiewicz <http://jcubic.pl>\n * Released under the MIT license\n *\n * Date: Fri, 07 Oct 2016 19:35:06 +0000\n */\n.terminal .terminal-output .format,\n.cmd .format,\n.cmd .prompt,\n.cmd .prompt div,\n.terminal .terminal-output div div {\n  display: inline-block;\n}\n.terminal h1,\n.terminal h2,\n.terminal h3,\n.terminal h4,\n.terminal h5,\n.terminal h6,\n.terminal pre,\n.cmd {\n  margin: 0;\n}\n.terminal h1,\n.terminal h2,\n.terminal h3,\n.terminal h4,\n.terminal h5,\n.terminal h6 {\n  line-height: 1.2em;\n}\n/*\n.cmd .mask {\n    width: 10px;\n    height: 11px;\n    background: black;\n    z-index: 100;\n}\n*/\n.cmd .clipboard {\n  position: absolute;\n  left: -16px;\n  top: 0;\n  width: 10px;\n  height: 16px;\n  /* this seems to work after all on Android */\n  /*left: -99999px;\n\tclip: rect(1px,1px,1px,1px);\n\t/* on desktop textarea appear when paste */\n  /*\n\topacity: 0.01;\n\tfilter: alpha(opacity = 0.01);\n\tfilter: progid:DXImageTransform.Microsoft.Alpha(opacity=0.01);\n\t*/\n  background: transparent;\n  border: none;\n  color: transparent;\n  outline: none;\n  padding: 0;\n  resize: none;\n  z-index: 0;\n  overflow: hidden;\n}\n.terminal .error {\n  color: #f00;\n}\n.terminal {\n  padding: 10px;\n  position: relative;\n  /*overflow: hidden;*/\n  overflow: auto;\n}\n.cmd {\n  padding: 0;\n  height: 1.3em;\n  position: relative;\n  /*margin-top: 3px; */\n}\n.terminal .inverted,\n.cmd .inverted,\n.cmd .cursor.blink {\n  background-color: #aaa;\n  color: #000;\n}\n.cmd .cursor.blink {\n  -webkit-animation: terminal-blink 1s infinite steps(1, start);\n  -moz-animation: terminal-blink 1s infinite steps(1, start);\n  -ms-animation: terminal-blink 1s infinite steps(1, start);\n  animation: terminal-blink 1s infinite steps(1, start);\n}\n@-webkit-keyframes terminal-blink {\n  0%,\n  100% {\n    background-color: #000;\n    color: #aaa;\n  }\n  50% {\n    background-color: #bbb;\n    color: #000;\n  }\n}\n@-ms-keyframes terminal-blink {\n  0%,\n  100% {\n    background-color: #000;\n    color: #aaa;\n  }\n  50% {\n    background-color: #bbb;\n    color: #000;\n  }\n}\n@-moz-keyframes terminal-blink {\n  0%,\n  100% {\n    background-color: #000;\n    color: #aaa;\n  }\n  50% {\n    background-color: #bbb;\n    color: #000;\n  }\n}\n@keyframes terminal-blink {\n  0%,\n  100% {\n    background-color: #000;\n    color: #aaa;\n  }\n  50% {\n    background-color: #bbb;\n    /* not #aaa because it's seems there is Google Chrome bug */\n    color: #000;\n  }\n}\n.terminal .terminal-output div div,\n.cmd .prompt {\n  display: block;\n  line-height: 14px;\n  height: auto;\n}\n.cmd .prompt {\n  float: left;\n}\n.terminal,\n.cmd {\n  font-family: monospace;\n  /*font-family: FreeMono, monospace; this don't work on Android */\n  color: #aaa;\n  background-color: #000;\n  font-size: 12px;\n  line-height: 14px;\n}\n.terminal-output > div {\n  /*padding-top: 3px;*/\n  min-height: 14px;\n}\n.terminal-output > div > div * {\n  word-wrap: break-word;\n  /* when echo html */\n}\n.terminal .terminal-output div span {\n  display: inline-block;\n}\n.cmd span {\n  float: left;\n  /*display: inline-block; */\n}\n/* fix double style of selecting text in terminal */\n.terminal-output span,\n.terminal-output a,\n.cmd div,\n.cmd span,\n.terminal td,\n.terminal pre,\n.terminal h1,\n.terminal h2,\n.terminal h3,\n.terminal h4,\n.terminal h5,\n.terminal h6 {\n  -webkit-touch-callout: initial;\n  -webkit-user-select: initial;\n  -khtml-user-select: initial;\n  -moz-user-select: initial;\n  -ms-user-select: initial;\n  user-select: initial;\n}\n.terminal,\n.terminal-output,\n.terminal-output div {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n/* firefox hack */\n@-moz-document url-prefix() {\n  .terminal,\n  .terminal-output,\n  .terminal-output div {\n    -webkit-touch-callout: initial;\n    -webkit-user-select: initial;\n    -khtml-user-select: initial;\n    -moz-user-select: initial;\n    -ms-user-select: initial;\n    user-select: initial;\n  }\n}\n.terminal table {\n  border-collapse: collapse;\n}\n.terminal td {\n  border: 1px solid #aaa;\n}\n.terminal h1::-moz-selection,\n.terminal h2::-moz-selection,\n.terminal h3::-moz-selection,\n.terminal h4::-moz-selection,\n.terminal h5::-moz-selection,\n.terminal h6::-moz-selection,\n.terminal pre::-moz-selection,\n.terminal td::-moz-selection,\n.terminal .terminal-output div div::-moz-selection,\n.terminal .terminal-output div span::-moz-selection,\n.terminal .terminal-output div div a::-moz-selection,\n.cmd div::-moz-selection,\n.cmd > span::-moz-selection,\n.cmd .prompt span::-moz-selection {\n  background-color: #aaa;\n  color: #000;\n}\n/* this don't work in Chrome\n.terminal tr td::-moz-selection {\n    border-color: #000;\n}\n.terminal tr td::selection {\n    border-color: #000;\n}\n*/\n.terminal h1::selection,\n.terminal h2::selection,\n.terminal h3::selection,\n.terminal h4::selection,\n.terminal h5::selection,\n.terminal h6::selection,\n.terminal pre::selection,\n.terminal td::selection,\n.terminal .terminal-output div div::selection,\n.terminal .terminal-output div div a::selection,\n.terminal .terminal-output div span::selection,\n.cmd div::selection,\n.cmd > span::selection,\n.cmd .prompt span::selection {\n  background-color: #aaa;\n  color: #000;\n}\n.terminal .terminal-output div.error,\n.terminal .terminal-output div.error div {\n  color: red;\n}\n.tilda {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  z-index: 1100;\n}\n.clear {\n  clear: both;\n}\n.terminal a {\n  color: #0F60FF;\n}\n.terminal a:hover {\n  color: red;\n}\nbody {\n  margin: 0;\n  background: #451919;\n}\n.terminal-wrap {\n  font-family: \"Lucida Grande\", sans-serif;\n  font-size: 11px;\n  color: #414141;\n  border-radius: 6px;\n  margin: 20px;\n  box-shadow: inset rgba(255, 255, 255, 0.7) 0 1px 1px;\n}\n.terminal-wrap .title-bar {\n  padding: 5px 0;\n  text-align: center;\n  text-shadow: rgba(255, 255, 255, 0.8) 0 1px 0;\n  background-image: -webkit-linear-gradient(top, #e8e8e8, #bcbbbc);\n  background-image: -moz-linear-gradient(top, #e8e8e8, #bcbbbc);\n  background-image: linear-gradient(top, #e8e8e8, #bcbbbc);\n}\n.terminal-wrap .menu {\n  position: absolute;\n  right: 3px;\n  z-index: 2;\n}\n.terminal-wrap .btn {\n  display: inline-block;\n  margin-bottom: 0;\n  text-align: center;\n  vertical-align: middle;\n  touch-action: manipulation;\n  cursor: pointer;\n  background-image: none;\n  border: 1px solid transparent;\n  white-space: nowrap;\n  padding: 6px 12px;\n  font-size: 11px;\n  line-height: 1.545454;\n  border-radius: 2px;\n  font-weight: bold;\n}\n.terminal-wrap .btn + .btn {\n  margin-left: 5px;\n}\n.terminal-wrap .btn-block {\n  width: 100%;\n}\n.terminal-wrap .btn-success {\n  color: #fff !important;\n  background-color: #5cb85c;\n  border-color: #5cb85c;\n}\n.terminal-wrap .btn-success:hover,\n.terminal-wrap .btn-success:focus,\n.terminal-wrap .btn-success:active,\n.terminal-wrap .btn-success.active,\n.open .dropdown-toggle.terminal-wrap .btn-success {\n  color: #fff !important;\n  background-color: #47a447;\n  border-color: #419641;\n}\n.terminal-wrap .btn-success:active,\n.terminal-wrap .btn-success.active,\n.open .dropdown-toggle.terminal-wrap .btn-success {\n  background-image: none;\n}\n.terminal-wrap .btn-success.disabled,\n.terminal-wrap .btn-success[disabled],\nfieldset[disabled] .terminal-wrap .btn-success,\n.terminal-wrap .btn-success.disabled:hover,\n.terminal-wrap .btn-success[disabled]:hover,\nfieldset[disabled] .terminal-wrap .btn-success:hover,\n.terminal-wrap .btn-success.disabled:focus,\n.terminal-wrap .btn-success[disabled]:focus,\nfieldset[disabled] .terminal-wrap .btn-success:focus,\n.terminal-wrap .btn-success.disabled:active,\n.terminal-wrap .btn-success[disabled]:active,\nfieldset[disabled] .terminal-wrap .btn-success:active,\n.terminal-wrap .btn-success.disabled.active,\n.terminal-wrap .btn-success[disabled].active,\nfieldset[disabled] .terminal-wrap .btn-success.active {\n  background-color: #5cb85c;\n  border-color: #5cb85c;\n}\n.terminal-wrap .btn-primary {\n  color: #fff !important;\n  background-color: #3C506F;\n  border-color: #3C506F;\n}\n.terminal-wrap .btn-primary:hover,\n.terminal-wrap .btn-primary:focus,\n.terminal-wrap .btn-primary:active,\n.terminal-wrap .btn-primary.active,\n.open .dropdown-toggle.terminal-wrap .btn-primary {\n  color: #fff !important;\n  background-color: #2e3d55;\n  border-color: #273347;\n}\n.terminal-wrap .btn-primary:active,\n.terminal-wrap .btn-primary.active,\n.open .dropdown-toggle.terminal-wrap .btn-primary {\n  background-image: none;\n}\n.terminal-wrap .btn-primary.disabled,\n.terminal-wrap .btn-primary[disabled],\nfieldset[disabled] .terminal-wrap .btn-primary,\n.terminal-wrap .btn-primary.disabled:hover,\n.terminal-wrap .btn-primary[disabled]:hover,\nfieldset[disabled] .terminal-wrap .btn-primary:hover,\n.terminal-wrap .btn-primary.disabled:focus,\n.terminal-wrap .btn-primary[disabled]:focus,\nfieldset[disabled] .terminal-wrap .btn-primary:focus,\n.terminal-wrap .btn-primary.disabled:active,\n.terminal-wrap .btn-primary[disabled]:active,\nfieldset[disabled] .terminal-wrap .btn-primary:active,\n.terminal-wrap .btn-primary.disabled.active,\n.terminal-wrap .btn-primary[disabled].active,\nfieldset[disabled] .terminal-wrap .btn-primary.active {\n  background-color: #3C506F;\n  border-color: #3C506F;\n}\n.terminal-wrap .btn-purple {\n  color: #fff !important;\n  background-color: #863F88;\n  border-color: #863F88;\n}\n.terminal-wrap .btn-purple:hover,\n.terminal-wrap .btn-purple:focus,\n.terminal-wrap .btn-purple:active,\n.terminal-wrap .btn-purple.active,\n.open .dropdown-toggle.terminal-wrap .btn-purple {\n  color: #fff !important;\n  background-color: #6b326c;\n  border-color: #5d2c5e;\n}\n.terminal-wrap .btn-purple:active,\n.terminal-wrap .btn-purple.active,\n.open .dropdown-toggle.terminal-wrap .btn-purple {\n  background-image: none;\n}\n.terminal-wrap .btn-purple.disabled,\n.terminal-wrap .btn-purple[disabled],\nfieldset[disabled] .terminal-wrap .btn-purple,\n.terminal-wrap .btn-purple.disabled:hover,\n.terminal-wrap .btn-purple[disabled]:hover,\nfieldset[disabled] .terminal-wrap .btn-purple:hover,\n.terminal-wrap .btn-purple.disabled:focus,\n.terminal-wrap .btn-purple[disabled]:focus,\nfieldset[disabled] .terminal-wrap .btn-purple:focus,\n.terminal-wrap .btn-purple.disabled:active,\n.terminal-wrap .btn-purple[disabled]:active,\nfieldset[disabled] .terminal-wrap .btn-purple:active,\n.terminal-wrap .btn-purple.disabled.active,\n.terminal-wrap .btn-purple[disabled].active,\nfieldset[disabled] .terminal-wrap .btn-purple.active {\n  background-color: #863F88;\n  border-color: #863F88;\n}\n.terminal-wrap .btn-white {\n  color: #717171 !important;\n  background-color: #fff;\n  border-color: #e1e1e1;\n}\n.terminal-wrap .btn-white:hover,\n.terminal-wrap .btn-white:focus,\n.terminal-wrap .btn-white:active,\n.terminal-wrap .btn-white.active,\n.open .dropdown-toggle.terminal-wrap .btn-white {\n  color: #717171 !important;\n  background-color: #ebebeb;\n  border-color: #c2c2c2;\n}\n.terminal-wrap .btn-white:active,\n.terminal-wrap .btn-white.active,\n.open .dropdown-toggle.terminal-wrap .btn-white {\n  background-image: none;\n}\n.terminal-wrap .btn-white.disabled,\n.terminal-wrap .btn-white[disabled],\nfieldset[disabled] .terminal-wrap .btn-white,\n.terminal-wrap .btn-white.disabled:hover,\n.terminal-wrap .btn-white[disabled]:hover,\nfieldset[disabled] .terminal-wrap .btn-white:hover,\n.terminal-wrap .btn-white.disabled:focus,\n.terminal-wrap .btn-white[disabled]:focus,\nfieldset[disabled] .terminal-wrap .btn-white:focus,\n.terminal-wrap .btn-white.disabled:active,\n.terminal-wrap .btn-white[disabled]:active,\nfieldset[disabled] .terminal-wrap .btn-white:active,\n.terminal-wrap .btn-white.disabled.active,\n.terminal-wrap .btn-white[disabled].active,\nfieldset[disabled] .terminal-wrap .btn-white.active {\n  background-color: #fff;\n  border-color: #e1e1e1;\n}\n.terminal-wrap .clear:before,\n.terminal-wrap .clear:after {\n  content: \" \";\n  /* 1 */\n  display: table;\n  /* 2 */\n}\n.terminal-wrap .clear:after {\n  clear: both;\n}\n.terminal-wrap .container {\n  padding: 50px;\n}\n.terminal-wrap .heading {\n  border: 1px solid #e1e1e1;\n  padding: 10px;\n  font-weight: bold;\n}\n.terminal-wrap .list {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.terminal-wrap .list li {\n  padding: 10px 0;\n}\n.terminal-wrap .menu {\n  padding: 10px 0;\n  text-align: right;\n}\n.terminal-wrap .border-top {\n  border-top: 1px solid #2D2D2D;\n}\n.terminal-wrap .panel-right {\n  width: 20%;\n  background: #fff;\n  padding: 15px;\n}\n.terminal-wrap .pull-left {\n  float: left;\n}\n.terminal-wrap .pull-right {\n  float: left;\n}\n.terminal-wrap .table {\n  border: 1px solid #e1e1e1;\n  font-size: 11px;\n  width: 100%;\n  border-collapse: collapse;\n  text-align: center;\n}\n.terminal-wrap .table thead th {\n  background: #e1e1e1;\n  font-weight: bold;\n}\n.terminal-wrap .table th {\n  font-weight: bold;\n}\n.terminal-wrap .table th,\n.terminal-wrap .table td {\n  padding: 10px 5px;\n}\n.terminal-wrap .terminal {\n  cursor: text;\n}\n.terminal-wrap .text-center {\n  text-align: center;\n}\n.terminal-wrap .text-right {\n  text-align: right;\n}\n.terminal-wrap .t-d-table {\n  display: table;\n  width: 100%;\n}\n.terminal-wrap .t-d-row {\n  display: table-row;\n}\n.terminal-wrap .t-d-cell {\n  vertical-align: top;\n  display: table-cell;\n}\n.terminal-wrap .t-f-size-14 {\n  font-size: 14px;\n}\n.terminal-wrap .t-bold {\n  font-weight: bold;\n}\n.terminal-wrap .wrapper-sm {\n  padding: 5px 10px;\n}\n\n\n\n/** WEBPACK FOOTER **\n ** webpack:///less-loader?sourceMap!./src/theme/main.less\n **/","/*!\n *       __ _____                     ________                              __\n *      / // _  /__ __ _____ ___ __ _/__  ___/__ ___ ______ __ __  __ ___  / /\n *  __ / // // // // // _  // _// // / / // _  // _//     // //  \\/ // _ \\/ /\n * /  / // // // // // ___// / / // / / // ___// / / / / // // /\\  // // / /__\n * \\___//____ \\\\___//____//_/ _\\_  / /_//____//_/ /_/ /_//_//_/ /_/ \\__\\_\\___/\n *           \\/              /____/                              version 0.11.11\n * http://terminal.jcubic.pl\n *\n * This file is part of jQuery Terminal.\n *\n * Copyright (c) 2011-2016 Jakub Jankiewicz <http://jcubic.pl>\n * Released under the MIT license\n *\n * Date: Fri, 07 Oct 2016 19:35:06 +0000\n */\n.terminal .terminal-output .format, .cmd .format,\n.cmd .prompt, .cmd .prompt div, .terminal .terminal-output div div{\n\tdisplay: inline-block;\n}\n.terminal h1, .terminal h2, .terminal h3, .terminal h4, .terminal h5, .terminal h6, .terminal pre, .cmd {\n\tmargin: 0;\n}\n.terminal h1, .terminal h2, .terminal h3, .terminal h4, .terminal h5, .terminal h6 {\n\tline-height: 1.2em;\n}\n/*\n.cmd .mask {\n    width: 10px;\n    height: 11px;\n    background: black;\n    z-index: 100;\n}\n*/\n.cmd .clipboard {\n\tposition: absolute;\n\tleft: -16px;\n\ttop: 0;\n\twidth: 10px;\n\theight: 16px;\n\t/* this seems to work after all on Android */\n\t/*left: -99999px;\n\tclip: rect(1px,1px,1px,1px);\n\t/* on desktop textarea appear when paste */\n\t/*\n\topacity: 0.01;\n\tfilter: alpha(opacity = 0.01);\n\tfilter: progid:DXImageTransform.Microsoft.Alpha(opacity=0.01);\n\t*/\n\tbackground: transparent;\n\tborder: none;\n\tcolor: transparent;\n\toutline: none;\n\tpadding: 0;\n\tresize: none;\n\tz-index: 0;\n\toverflow: hidden;\n}\n.terminal .error {\n\tcolor: #f00;\n}\n.terminal {\n\tpadding: 10px;\n\tposition: relative;\n\t/*overflow: hidden;*/\n\toverflow: auto;\n}\n.cmd {\n\tpadding: 0;\n\theight: 1.3em;\n\tposition: relative;\n\t/*margin-top: 3px; */\n}\n.terminal .inverted, .cmd .inverted, .cmd .cursor.blink {\n\tbackground-color: #aaa;\n\tcolor: #000;\n}\n.cmd .cursor.blink {\n\t-webkit-animation: terminal-blink 1s infinite steps(1, start);\n\t-moz-animation: terminal-blink 1s infinite steps(1, start);\n\t-ms-animation: terminal-blink 1s infinite steps(1, start);\n\tanimation: terminal-blink 1s infinite steps(1, start);\n}\n@-webkit-keyframes terminal-blink {\n\t0%, 100% {\n\t\tbackground-color: #000;\n\t\tcolor: #aaa;\n\t}\n\t50% {\n\t\tbackground-color: #bbb;\n\t\tcolor: #000;\n\t}\n}\n\n@-ms-keyframes terminal-blink {\n\t0%, 100% {\n\t\tbackground-color: #000;\n\t\tcolor: #aaa;\n\t}\n\t50% {\n\t\tbackground-color: #bbb;\n\t\tcolor: #000;\n\t}\n}\n\n@-moz-keyframes terminal-blink {\n\t0%, 100% {\n\t\tbackground-color: #000;\n\t\tcolor: #aaa;\n\t}\n\t50% {\n\t\tbackground-color: #bbb;\n\t\tcolor: #000;\n\t}\n}\n@keyframes terminal-blink {\n\t0%, 100% {\n\t\tbackground-color: #000;\n\t\tcolor: #aaa;\n\t}\n\t50% {\n\t\tbackground-color: #bbb; /* not #aaa because it's seems there is Google Chrome bug */\n\t\tcolor: #000;\n\t}\n}\n\n.terminal .terminal-output div div, .cmd .prompt {\n\tdisplay: block;\n\tline-height: 14px;\n\theight: auto;\n}\n.cmd .prompt {\n\tfloat: left;\n}\n.terminal, .cmd {\n\tfont-family: monospace;\n\t/*font-family: FreeMono, monospace; this don't work on Android */\n\tcolor: #aaa;\n\tbackground-color: #000;\n\tfont-size: 12px;\n\tline-height: 14px;\n}\n\n.terminal-output > div {\n\t/*padding-top: 3px;*/\n\tmin-height: 14px;\n}\n.terminal-output > div > div * {\n\tword-wrap: break-word; /* when echo html */\n}\n.terminal .terminal-output div span {\n\tdisplay: inline-block;\n}\n.cmd span {\n\tfloat: left;\n\t/*display: inline-block; */\n}\n/* fix double style of selecting text in terminal */\n.terminal-output span, .terminal-output a, .cmd div, .cmd span, .terminal td,\n.terminal pre, .terminal h1, .terminal h2, .terminal h3, .terminal h4,\n.terminal h5, .terminal h6 {\n\t-webkit-touch-callout: initial;\n\t-webkit-user-select: initial;\n\t-khtml-user-select: initial;\n\t-moz-user-select: initial;\n\t-ms-user-select: initial;\n\tuser-select: initial;\n}\n.terminal, .terminal-output, .terminal-output div {\n\t-webkit-touch-callout: none;\n\t-webkit-user-select: none;\n\t-khtml-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n}\n/* firefox hack */\n@-moz-document url-prefix() {\n\t.terminal, .terminal-output, .terminal-output div {\n\t\t-webkit-touch-callout: initial;\n\t\t-webkit-user-select: initial;\n\t\t-khtml-user-select: initial;\n\t\t-moz-user-select: initial;\n\t\t-ms-user-select: initial;\n\t\tuser-select: initial;\n\t}\n}\n.terminal table {\n\tborder-collapse: collapse;\n}\n.terminal td {\n\tborder: 1px solid #aaa;\n}\n.terminal h1::-moz-selection,\n.terminal h2::-moz-selection,\n.terminal h3::-moz-selection,\n.terminal h4::-moz-selection,\n.terminal h5::-moz-selection,\n.terminal h6::-moz-selection,\n.terminal pre::-moz-selection,\n.terminal td::-moz-selection,\n.terminal .terminal-output div div::-moz-selection,\n.terminal .terminal-output div span::-moz-selection,\n.terminal .terminal-output div div a::-moz-selection,\n.cmd div::-moz-selection,\n.cmd > span::-moz-selection,\n.cmd .prompt span::-moz-selection {\n\tbackground-color: #aaa;\n\tcolor: #000;\n}\n/* this don't work in Chrome\n.terminal tr td::-moz-selection {\n    border-color: #000;\n}\n.terminal tr td::selection {\n    border-color: #000;\n}\n*/\n.terminal h1::selection,\n.terminal h2::selection,\n.terminal h3::selection,\n.terminal h4::selection,\n.terminal h5::selection,\n.terminal h6::selection,\n.terminal pre::selection,\n.terminal td::selection,\n.terminal .terminal-output div div::selection,\n.terminal .terminal-output div div a::selection,\n.terminal .terminal-output div span::selection,\n.cmd div::selection,\n.cmd > span::selection,\n.cmd .prompt span::selection {\n\tbackground-color: #aaa;\n\tcolor: #000;\n}\n.terminal .terminal-output div.error, .terminal .terminal-output div.error div {\n\tcolor: red;\n}\n.tilda {\n\tposition: fixed;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\tz-index: 1100;\n}\n.clear {\n\tclear: both;\n}\n.terminal a {\n\tcolor: #0F60FF;\n}\n.terminal a:hover {\n\tcolor: red;\n}\n\n\n/** WEBPACK FOOTER **\n ** webpack:///src/theme/terminal.less\n **/","@import \"terminal.less\";\n@import \"variables.less\";\n@import \"mixins.less\";\n//@import \"utilities.less\";\n\nbody {\n\tmargin: 0;\n\tbackground: rgb(69, 25, 25);\n}\n\n.terminal-wrap {\n\tfont-family: \"Lucida Grande\", sans-serif;\n\tfont-size: @font-size;\n\tcolor: #414141;\n\tborder-radius: 6px;\n\tmargin: 20px;\n\n\tbox-shadow: inset rgba(255, 255, 255, 0.7) 0 1px 1px;\n\n\t.title-bar {\n\t\tpadding: 5px 0;\n\t\ttext-align: center;\n\t\ttext-shadow: rgba(255, 255, 255, 0.8) 0 1px 0;\n\t\tbackground-image: -webkit-linear-gradient(top, #e8e8e8, #bcbbbc);\n\t\tbackground-image: -moz-linear-gradient(top, #e8e8e8, #bcbbbc);\n\t\tbackground-image: linear-gradient(top, #e8e8e8, #bcbbbc);\n\t}\n\n\t.menu {\n\t\tposition: absolute;\n\t\tright: 3px;\n\t\tz-index: 2;\n\t}\n\n\t.btn {\n\t\tdisplay: inline-block;\n\t\tmargin-bottom: 0;\n\t\ttext-align: center;\n\t\tvertical-align: middle;\n\t\ttouch-action: manipulation;\n\t\tcursor: pointer;\n\t\tbackground-image: none;\n\t\tborder: 1px solid transparent;\n\t\twhite-space: nowrap;\n\t\tpadding: 6px 12px;\n\t\tfont-size: 11px;\n\t\tline-height: 1.545454;\n\t\tborder-radius: 2px;\n\t\tfont-weight:  bold;\n\n\t\t& +.btn {\n\t\t\tmargin-left: 5px;\n\t\t}\n\t}\n\n\t.btn-block {\n\t\twidth: 100%;\n\t}\n\n\t.btn-success {\n\t\t.button-variant(#fff, @brand-success, @brand-success);\n\t}\n\n\t.btn-primary {\n\t\t.button-variant(#fff, @brand-primary, @brand-primary);\n\t}\n\n\t.btn-purple {\n\t\t.button-variant(#fff, @brand-purple, @brand-purple);\n\t}\n\n\t.btn-white {\n\t\t.button-variant(#717171, #fff, #e1e1e1);\n\t}\n\n\t//.btn-invert {\n\t//\tborder: 2px solid;\n\t//\tborder-radius: 25px;\n\t//\tpadding: 10px 8px;\n\t//\tfont-size: 9px;\n\t//\tbackground-color: transparent;\n\t//\tborder-color: #fff;\n\t//}\n\n\t//.btn-rounded {\n\t//\tborder-radius: 26px;\n\t//\tpadding: 10px 8px;\n\t//}\n\n\t.clear {\n\t\t.clearfix();\n\t}\n\n\t.container {\n\t\tpadding:50px;\n\t}\n\n\t.heading {\n\t\tborder: 1px solid #e1e1e1;\n\t\tpadding: 10px;\n\t\tfont-weight: bold;\n\t}\n\n\t.list {\n\t\tlist-style: none;\n\t\tpadding: 0;\n\t\tmargin: 0;\n\n\t\tli {\n\t\t\tpadding: 10px 0;\n\t\t}\n\t}\n\n\t.menu {\n\t\tpadding: 10px 0;\n\t\ttext-align: right;\n\t}\n\n\t.border-top {\n\t\tborder-top : 1px solid #2D2D2D;\n\t}\n\n\t.panel-right {\n\t\twidth: 20%;\n\t\tbackground: #fff;\n\t\tpadding: 15px;\n\t}\n\n\t.pull-left {\n\t\tfloat: left;\n\t}\n\n\t.pull-right {\n\t\tfloat: left;\n\t}\n\n\t.table {\n\t\tborder: 1px solid #e1e1e1;\n\t\tfont-size: @font-size;\n\t\twidth: 100%;\n\t\tborder-collapse: collapse;\n\n\t\ttext-align: center;\n\n\t\tthead {\n\t\t\tth {\n\t\t\t\tbackground: #e1e1e1;\n\t\t\t\tfont-weight: bold;\n\t\t\t}\n\t\t}\n\n\t\tth {\n\t\t\tfont-weight: bold;\n\t\t}\n\n\t\tth, td {\n\t\t\tpadding: 10px 5px;\n\t\t}\n\t}\n\n\n\n\t.terminal {\n\t\tcursor: text;\n\t}\n\n\t.text-center {\n\t\ttext-align: center;\n\t}\n\t.text-right {\n\t\ttext-align: right;\n\t}\n\n\t.t-d-table {\n\t\tdisplay: table;\n\t\twidth: 100%;\n\t}\n\n\t.t-d-row {\n\t\tdisplay: table-row;\n\t}\n\n\t.t-d-cell {\n\t\tvertical-align: top;\n\t\tdisplay: table-cell;\n\t}\n\n\t.t-f-size-14 {\n\t\tfont-size: 14px;\n\t}\n\n\t.t-bold {\n\t\tfont-weight: bold;\n\t}\n\n\t.wrapper-sm {\n\t\tpadding: 5px 10px;\n\t}\n}\n\n\n\n\n/** WEBPACK FOOTER **\n ** webpack:///src/theme/main.less\n **/",".clearfix() {\n\t&:before,\n\t&:after {\n\t\tcontent: \" \"; /* 1 */\n\t\tdisplay: table; /* 2 */\n\t}\n\t&:after {\n\t\tclear: both;\n\t}\n}\n\n.color-variant(@color: #555, @lt-percent: 10%, @lter-percent: 15%, @dk-percent: 10%, @dker-percent: 15%) {\n\tbackground-color: @color;\n\t&.lt,\n\t.lt {\n\t\tbackground-color: lighten(@color, @lt-percent);\n\t}\n\t&.lter,\n\t.lter {\n\t\tbackground-color: lighten(@color, @lter-percent);\n\t}\n\t&.dk,\n\t.dk {\n\t\tbackground-color: darken(@color, @dk-percent);\n\t}\n\t&.dker,\n\t.dker {\n\t\tbackground-color: darken(@color, @dker-percent);\n\t}\n}\n\n.font-variant(@color: #555, @hover-color: #fff, @nav-link-percent: 40%, @nav-sublink-percent: 10%, @link-percent: 30%, @text-percent){\n\tcolor: lighten(@color, @text-percent);\n\ta {\n\t\tcolor: lighten(@color, @link-percent);\n\t\t&:hover{\n\t\t\tcolor: @hover-color;\n\t\t}\n\t\t&.list-group-item{\n\t\t\t&:hover,\n\t\t\t&:focus{\n\t\t\t\tbackground-color: inherit;\n\t\t\t}\n\t\t}\n\t}\n\t.nav {\n\t\tli {\n\t\t\t> a{\n\t\t\t\tcolor: lighten(@color, @nav-link-percent);\n\t\t\t\t&:hover{\n\t\t\t\t\tbackground-color: darken(@color, 5%);\n\t\t\t\t}\n\t\t\t}\n\t\t\t> ul.dropdown-menu > li{\n\t\t\t\t> a{\n\t\t\t\t\tcolor: lighten(@color, @nav-sublink-percent);\n\t\t\t\t\t&:hover {\n\t\t\t\t\t\tcolor: @hover-color;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t.open > a{\n\t\t\tbackground-color: darken(@color, 5%);\n\t\t}\n\t}\n\t&.navbar .nav{\n\t\t> li.active > a{\n\t\t\tcolor: @hover-color;\n\t\t\tbackground-color: darken(@color, 5%);\n\t\t}\n\t}\n\t.open > a {\n\t\t&,\n\t\t&:hover,\n\t\t&:focus{\n\t\t\tcolor: @hover-color;\n\t\t}\n\t}\n\t.text-muted {\n\t\tcolor: lighten(@color, @text-percent - 5%);\n\t}\n}\n\n// Button variants\n// -------------------------\n// Easily pump out default styles, as well as :hover, :focus, :active,\n// and disabled options for all buttons\n.button-variant(@color; @background; @border) {\n\tcolor: @color !important;\n\tbackground-color: @background;\n\tborder-color: @border;\n\n\t&:hover,\n\t&:focus,\n\t&:active,\n\t&.active,\n\t.open .dropdown-toggle& {\n\t\tcolor: @color !important;\n\t\tbackground-color: darken(@background, 8%);\n\t\tborder-color: darken(@border, 12%);\n\t}\n\t&:active,\n\t&.active,\n\t.open .dropdown-toggle& {\n\t\tbackground-image: none;\n\t}\n\t&.disabled,\n\t&[disabled],\n\tfieldset[disabled] & {\n\t\t&,\n\t\t&:hover,\n\t\t&:focus,\n\t\t&:active,\n\t\t&.active {\n\t\t\tbackground-color: @background;\n\t\t\tborder-color: @border\n\t\t}\n\t}\n}\n\n.contentBox(){\n\t-webkit-box-sizing: content-box;\n\t-moz-box-sizing: content-box;\n\tbox-sizing: content-box;\n}\n\n.translateZ(@z) {\n\t-webkit-transform: translateZ(@z);\n\t-ms-transform: translateZ(@z);\n\t-o-transform: translateZ(@z);\n\ttransform: translateZ(@z);\n}\n\n// CSS3 PROPERTIES\n// --------------------------------------------------\n\n// Single side border-radius\n.border-top-radius(@radius) {\n\tborder-top-right-radius: @radius;\n\tborder-top-left-radius: @radius;\n}\n.border-right-radius(@radius) {\n\tborder-bottom-right-radius: @radius;\n\tborder-top-right-radius: @radius;\n}\n.border-bottom-radius(@radius) {\n\tborder-bottom-right-radius: @radius;\n\tborder-bottom-left-radius: @radius;\n}\n.border-left-radius(@radius) {\n\tborder-bottom-left-radius: @radius;\n\tborder-top-left-radius: @radius;\n}\n\n// Drop shadows\n.box-shadow(@shadow) {\n\t-webkit-box-shadow: @shadow; // iOS <4.3 & Android <4.1\n\tbox-shadow: @shadow;\n}\n\n// Transitions\n.transition(@transition) {\n\t-webkit-transition: @transition;\n\ttransition: @transition;\n}\n.transition-delay(@transition-delay) {\n\t-webkit-transition-delay: @transition-delay;\n\ttransition-delay: @transition-delay;\n}\n.transition-duration(@transition-duration) {\n\t-webkit-transition-duration: @transition-duration;\n\ttransition-duration: @transition-duration;\n}\n.transition-transform(@transition) {\n\t-webkit-transition: -webkit-transform @transition;\n\t-moz-transition: -moz-transform @transition;\n\t-o-transition: -o-transform @transition;\n\ttransition: transform @transition;\n}\n\n// Transformations\n.rotate(@degrees) {\n\t-webkit-transform: rotate(@degrees);\n\t-ms-transform: rotate(@degrees); // IE9+\n\ttransform: rotate(@degrees);\n}\n.scale(@ratio) {\n\t-webkit-transform: scale(@ratio);\n\t-ms-transform: scale(@ratio); // IE9+\n\ttransform: scale(@ratio);\n}\n.translate(@x, @y) {\n\t-webkit-transform: translate(@x, @y);\n\t-ms-transform: translate(@x, @y); // IE9+\n\ttransform: translate(@x, @y);\n}\n.skew(@x, @y) {\n\t-webkit-transform: skew(@x, @y);\n\t-ms-transform: skewX(@x) skewY(@y); // See https://github.com/twbs/bootstrap/issues/4885; IE9+\n\ttransform: skew(@x, @y);\n}\n.translate3d(@x, @y, @z) {\n\t-webkit-transform: translate3d(@x, @y, @z);\n\ttransform: translate3d(@x, @y, @z);\n}\n\n// Backface visibility\n// Prevent browsers from flickering when using CSS 3D transforms.\n// Default value is `visible`, but can be changed to `hidden`\n// See git pull https://github.com/dannykeane/bootstrap.git backface-visibility for examples\n.backface-visibility(@visibility){\n\t-webkit-backface-visibility: @visibility;\n\t-moz-backface-visibility: @visibility;\n\tbackface-visibility: @visibility;\n}\n\n// Box sizing\n.box-sizing(@boxmodel) {\n\t-webkit-box-sizing: @boxmodel;\n\t-moz-box-sizing: @boxmodel;\n\tbox-sizing: @boxmodel;\n}\n\n// User select\n// For selecting text on the page\n.user-select(@select) {\n\t-webkit-user-select: @select;\n\t-moz-user-select: @select;\n\t-ms-user-select: @select; // IE10+\n\t-o-user-select: @select;\n\tuser-select: @select;\n}\n\n// Resize anything\n.resizable(@direction) {\n\tresize: @direction; // Options: horizontal, vertical, both\n\toverflow: auto; // Safari fix\n}\n\n// CSS3 Content Columns\n.content-columns(@column-count, @column-gap: @grid-gutter-width) {\n\t-webkit-column-count: @column-count;\n\t-moz-column-count: @column-count;\n\tcolumn-count: @column-count;\n\t-webkit-column-gap: @column-gap;\n\t-moz-column-gap: @column-gap;\n\tcolumn-gap: @column-gap;\n}\n\n// Optional hyphenation\n.hyphens(@mode: auto) {\n\tword-wrap: break-word;\n\t-webkit-hyphens: @mode;\n\t-moz-hyphens: @mode;\n\t-ms-hyphens: @mode; // IE10+\n\t-o-hyphens: @mode;\n\thyphens: @mode;\n}\n\n// Opacity\n.opacity(@opacity) {\n\topacity: @opacity;\n\t// IE8 filter\n\t@opacity-ie: (@opacity * 100);\n\tfilter: ~\"alpha(opacity=@{opacity-ie})\";\n}\n\n\n\n// GRADIENTS\n// --------------------------------------------------\n\n#gradient {\n\n\t// Horizontal gradient, from left to right\n\t//\n\t// Creates two color stops, start and end, by specifying a color and position for each color stop.\n\t// Color stops are not available in IE9 and below.\n\t.horizontal(@start-color: #555, @end-color: #333, @start-percent: 0%, @end-percent: 100%) {\n\t\tbackground-image: -webkit-gradient(linear, @start-percent top, @end-percent top, from(@start-color), to(@end-color)); // Safari 4+, Chrome 2+\n\t\tbackground-image: -webkit-linear-gradient(left, color-stop(@start-color @start-percent), color-stop(@end-color @end-percent)); // Safari 5.1+, Chrome 10+\n\t\tbackground-image: -moz-linear-gradient(left, @start-color @start-percent, @end-color @end-percent); // FF 3.6+\n\t\tbackground-image:  linear-gradient(to right, @start-color @start-percent, @end-color @end-percent); // Standard, IE10\n\t\tbackground-repeat: repeat-x;\n\t\tfilter: e(%(\"progid:DXImageTransform.Microsoft.gradient(startColorstr='%d', endColorstr='%d', GradientType=1)\",argb(@start-color),argb(@end-color))); // IE9 and down\n\t}\n\n\t// Vertical gradient, from top to bottom\n\t//\n\t// Creates two color stops, start and end, by specifying a color and position for each color stop.\n\t// Color stops are not available in IE9 and below.\n\t.vertical(@start-color: #555, @end-color: #333, @start-percent: 0%, @end-percent: 100%) {\n\t\tbackground-image: -webkit-gradient(linear, left @start-percent, left @end-percent, from(@start-color), to(@end-color)); // Safari 4+, Chrome 2+\n\t\tbackground-image: -webkit-linear-gradient(top, @start-color, @start-percent, @end-color, @end-percent); // Safari 5.1+, Chrome 10+\n\t\tbackground-image:  -moz-linear-gradient(top, @start-color @start-percent, @end-color @end-percent); // FF 3.6+\n\t\tbackground-image: linear-gradient(to bottom, @start-color @start-percent, @end-color @end-percent); // Standard, IE10\n\t\tbackground-repeat: repeat-x;\n\t\tfilter: e(%(\"progid:DXImageTransform.Microsoft.gradient(startColorstr='%d', endColorstr='%d', GradientType=0)\",argb(@start-color),argb(@end-color))); // IE9 and down\n\t}\n\n\t.directional(@start-color: #555, @end-color: #333, @deg: 45deg) {\n\t\tbackground-repeat: repeat-x;\n\t\tbackground-image: -webkit-linear-gradient(@deg, @start-color, @end-color); // Safari 5.1+, Chrome 10+\n\t\tbackground-image: -moz-linear-gradient(@deg, @start-color, @end-color); // FF 3.6+\n\t\tbackground-image: linear-gradient(@deg, @start-color, @end-color); // Standard, IE10\n\t}\n\t.horizontal-three-colors(@start-color: #00b3ee, @mid-color: #7a43b6, @color-stop: 50%, @end-color: #c3325f) {\n\t\tbackground-image: -webkit-gradient(left, linear, 0 0, 0 100%, from(@start-color), color-stop(@color-stop, @mid-color), to(@end-color));\n\t\tbackground-image: -webkit-linear-gradient(left, @start-color, @mid-color @color-stop, @end-color);\n\t\tbackground-image: -moz-linear-gradient(left, @start-color, @mid-color @color-stop, @end-color);\n\t\tbackground-image: linear-gradient(to right, @start-color, @mid-color @color-stop, @end-color);\n\t\tbackground-repeat: no-repeat;\n\t\tfilter: e(%(\"progid:DXImageTransform.Microsoft.gradient(startColorstr='%d', endColorstr='%d', GradientType=1)\",argb(@start-color),argb(@end-color))); // IE9 and down, gets no color-stop at all for proper fallback\n\t}\n\t.vertical-three-colors(@start-color: #00b3ee, @mid-color: #7a43b6, @color-stop: 50%, @end-color: #c3325f) {\n\t\tbackground-image: -webkit-gradient(linear, 0 0, 0 100%, from(@start-color), color-stop(@color-stop, @mid-color), to(@end-color));\n\t\tbackground-image: -webkit-linear-gradient(@start-color, @mid-color @color-stop, @end-color);\n\t\tbackground-image: -moz-linear-gradient(top, @start-color, @mid-color @color-stop, @end-color);\n\t\tbackground-image: linear-gradient(@start-color, @mid-color @color-stop, @end-color);\n\t\tbackground-repeat: no-repeat;\n\t\tfilter: e(%(\"progid:DXImageTransform.Microsoft.gradient(startColorstr='%d', endColorstr='%d', GradientType=0)\",argb(@start-color),argb(@end-color))); // IE9 and down, gets no color-stop at all for proper fallback\n\t}\n\t.radial(@inner-color: #555, @outer-color: #333) {\n\t\tbackground-image: -webkit-gradient(radial, center center, 0, center center, 460, from(@inner-color), to(@outer-color));\n\t\tbackground-image: -webkit-radial-gradient(circle, @inner-color, @outer-color);\n\t\tbackground-image: -moz-radial-gradient(circle, @inner-color, @outer-color);\n\t\tbackground-image: radial-gradient(circle, @inner-color, @outer-color);\n\t\tbackground-repeat: no-repeat;\n\t}\n\t.striped(@color: #555, @angle: 45deg) {\n\t\tbackground-image: -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.25, rgba(255,255,255,.15)), color-stop(.25, transparent), color-stop(.5, transparent), color-stop(.5, rgba(255,255,255,.15)), color-stop(.75, rgba(255,255,255,.15)), color-stop(.75, transparent), to(transparent));\n\t\tbackground-image: -webkit-linear-gradient(@angle, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent);\n\t\tbackground-image: -moz-linear-gradient(@angle, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent);\n\t\tbackground-image: linear-gradient(@angle, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent);\n\t}\n}\n\n// Reset filters for IE\n//\n// When you need to remove a gradient background, don't forget to use this to reset\n// the IE filter for IE9 and below.\n.reset-filter() {\n\tfilter: e(%(\"progid:DXImageTransform.Microsoft.gradient(enabled = false)\"));\n}\n\n\n\n/** WEBPACK FOOTER **\n ** webpack:///src/theme/mixins.less\n **/","/*!\n *       __ _____                     ________                              __\n *      / // _  /__ __ _____ ___ __ _/__  ___/__ ___ ______ __ __  __ ___  / /\n *  __ / // // // // // _  // _// // / / // _  // _//     // //  \\/ // _ \\/ /\n * /  / // // // // // ___// / / // / / // ___// / / / / // // /\\  // // / /__\n * \\___//____ \\\\___//____//_/ _\\_  / /_//____//_/ /_/ /_//_//_/ /_/ \\__\\_\\___/\n *           \\/              /____/                              version 0.11.11\n * http://terminal.jcubic.pl\n *\n * This file is part of jQuery Terminal.\n *\n * Copyright (c) 2011-2016 Jakub Jankiewicz <http://jcubic.pl>\n * Released under the MIT license\n *\n * Date: Fri, 07 Oct 2016 19:35:06 +0000\n */\n.terminal .terminal-output .format,\n.cmd .format,\n.cmd .prompt,\n.cmd .prompt div,\n.terminal .terminal-output div div {\n  display: inline-block;\n}\n.terminal h1,\n.terminal h2,\n.terminal h3,\n.terminal h4,\n.terminal h5,\n.terminal h6,\n.terminal pre,\n.cmd {\n  margin: 0;\n}\n.terminal h1,\n.terminal h2,\n.terminal h3,\n.terminal h4,\n.terminal h5,\n.terminal h6 {\n  line-height: 1.2em;\n}\n/*\n.cmd .mask {\n    width: 10px;\n    height: 11px;\n    background: black;\n    z-index: 100;\n}\n*/\n.cmd .clipboard {\n  position: absolute;\n  left: -16px;\n  top: 0;\n  width: 10px;\n  height: 16px;\n  /* this seems to work after all on Android */\n  /*left: -99999px;\n\tclip: rect(1px,1px,1px,1px);\n\t/* on desktop textarea appear when paste */\n  /*\n\topacity: 0.01;\n\tfilter: alpha(opacity = 0.01);\n\tfilter: progid:DXImageTransform.Microsoft.Alpha(opacity=0.01);\n\t*/\n  background: transparent;\n  border: none;\n  color: transparent;\n  outline: none;\n  padding: 0;\n  resize: none;\n  z-index: 0;\n  overflow: hidden;\n}\n.terminal .error {\n  color: #f00;\n}\n.terminal {\n  padding: 10px;\n  position: relative;\n  /*overflow: hidden;*/\n  overflow: auto;\n}\n.cmd {\n  padding: 0;\n  height: 1.3em;\n  position: relative;\n  /*margin-top: 3px; */\n}\n.terminal .inverted,\n.cmd .inverted,\n.cmd .cursor.blink {\n  background-color: #aaa;\n  color: #000;\n}\n.cmd .cursor.blink {\n  -webkit-animation: terminal-blink 1s infinite steps(1, start);\n  -moz-animation: terminal-blink 1s infinite steps(1, start);\n  -ms-animation: terminal-blink 1s infinite steps(1, start);\n  animation: terminal-blink 1s infinite steps(1, start);\n}\n@-webkit-keyframes terminal-blink {\n  0%,\n  100% {\n    background-color: #000;\n    color: #aaa;\n  }\n  50% {\n    background-color: #bbb;\n    color: #000;\n  }\n}\n@-ms-keyframes terminal-blink {\n  0%,\n  100% {\n    background-color: #000;\n    color: #aaa;\n  }\n  50% {\n    background-color: #bbb;\n    color: #000;\n  }\n}\n@-moz-keyframes terminal-blink {\n  0%,\n  100% {\n    background-color: #000;\n    color: #aaa;\n  }\n  50% {\n    background-color: #bbb;\n    color: #000;\n  }\n}\n@keyframes terminal-blink {\n  0%,\n  100% {\n    background-color: #000;\n    color: #aaa;\n  }\n  50% {\n    background-color: #bbb;\n    /* not #aaa because it's seems there is Google Chrome bug */\n    color: #000;\n  }\n}\n.terminal .terminal-output div div,\n.cmd .prompt {\n  display: block;\n  line-height: 14px;\n  height: auto;\n}\n.cmd .prompt {\n  float: left;\n}\n.terminal,\n.cmd {\n  font-family: monospace;\n  /*font-family: FreeMono, monospace; this don't work on Android */\n  color: #aaa;\n  background-color: #000;\n  font-size: 12px;\n  line-height: 14px;\n}\n.terminal-output > div {\n  /*padding-top: 3px;*/\n  min-height: 14px;\n}\n.terminal-output > div > div * {\n  word-wrap: break-word;\n  /* when echo html */\n}\n.terminal .terminal-output div span {\n  display: inline-block;\n}\n.cmd span {\n  float: left;\n  /*display: inline-block; */\n}\n/* fix double style of selecting text in terminal */\n.terminal-output span,\n.terminal-output a,\n.cmd div,\n.cmd span,\n.terminal td,\n.terminal pre,\n.terminal h1,\n.terminal h2,\n.terminal h3,\n.terminal h4,\n.terminal h5,\n.terminal h6 {\n  -webkit-touch-callout: initial;\n  -webkit-user-select: initial;\n  -khtml-user-select: initial;\n  -moz-user-select: initial;\n  -ms-user-select: initial;\n  user-select: initial;\n}\n.terminal,\n.terminal-output,\n.terminal-output div {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n/* firefox hack */\n@-moz-document url-prefix() {\n  .terminal,\n  .terminal-output,\n  .terminal-output div {\n    -webkit-touch-callout: initial;\n    -webkit-user-select: initial;\n    -khtml-user-select: initial;\n    -moz-user-select: initial;\n    -ms-user-select: initial;\n    user-select: initial;\n  }\n}\n.terminal table {\n  border-collapse: collapse;\n}\n.terminal td {\n  border: 1px solid #aaa;\n}\n.terminal h1::-moz-selection,\n.terminal h2::-moz-selection,\n.terminal h3::-moz-selection,\n.terminal h4::-moz-selection,\n.terminal h5::-moz-selection,\n.terminal h6::-moz-selection,\n.terminal pre::-moz-selection,\n.terminal td::-moz-selection,\n.terminal .terminal-output div div::-moz-selection,\n.terminal .terminal-output div span::-moz-selection,\n.terminal .terminal-output div div a::-moz-selection,\n.cmd div::-moz-selection,\n.cmd > span::-moz-selection,\n.cmd .prompt span::-moz-selection {\n  background-color: #aaa;\n  color: #000;\n}\n/* this don't work in Chrome\n.terminal tr td::-moz-selection {\n    border-color: #000;\n}\n.terminal tr td::selection {\n    border-color: #000;\n}\n*/\n.terminal h1::selection,\n.terminal h2::selection,\n.terminal h3::selection,\n.terminal h4::selection,\n.terminal h5::selection,\n.terminal h6::selection,\n.terminal pre::selection,\n.terminal td::selection,\n.terminal .terminal-output div div::selection,\n.terminal .terminal-output div div a::selection,\n.terminal .terminal-output div span::selection,\n.cmd div::selection,\n.cmd > span::selection,\n.cmd .prompt span::selection {\n  background-color: #aaa;\n  color: #000;\n}\n.terminal .terminal-output div.error,\n.terminal .terminal-output div.error div {\n  color: red;\n}\n.tilda {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  z-index: 1100;\n}\n.clear {\n  clear: both;\n}\n.terminal a {\n  color: #0F60FF;\n}\n.terminal a:hover {\n  color: red;\n}\nbody {\n  margin: 0;\n  background: #451919;\n}\n.terminal-wrap {\n  font-family: \"Lucida Grande\", sans-serif;\n  font-size: 11px;\n  color: #414141;\n  border-radius: 6px;\n  margin: 20px;\n  box-shadow: inset rgba(255, 255, 255, 0.7) 0 1px 1px;\n}\n.terminal-wrap .title-bar {\n  padding: 5px 0;\n  text-align: center;\n  text-shadow: rgba(255, 255, 255, 0.8) 0 1px 0;\n  background-image: -webkit-linear-gradient(top, #e8e8e8, #bcbbbc);\n  background-image: -moz-linear-gradient(top, #e8e8e8, #bcbbbc);\n  background-image: linear-gradient(top, #e8e8e8, #bcbbbc);\n}\n.terminal-wrap .menu {\n  position: absolute;\n  right: 3px;\n  z-index: 2;\n}\n.terminal-wrap .btn {\n  display: inline-block;\n  margin-bottom: 0;\n  text-align: center;\n  vertical-align: middle;\n  touch-action: manipulation;\n  cursor: pointer;\n  background-image: none;\n  border: 1px solid transparent;\n  white-space: nowrap;\n  padding: 6px 12px;\n  font-size: 11px;\n  line-height: 1.545454;\n  border-radius: 2px;\n  font-weight: bold;\n}\n.terminal-wrap .btn + .btn {\n  margin-left: 5px;\n}\n.terminal-wrap .btn-block {\n  width: 100%;\n}\n.terminal-wrap .btn-success {\n  color: #fff !important;\n  background-color: #5cb85c;\n  border-color: #5cb85c;\n}\n.terminal-wrap .btn-success:hover,\n.terminal-wrap .btn-success:focus,\n.terminal-wrap .btn-success:active,\n.terminal-wrap .btn-success.active,\n.open .dropdown-toggle.terminal-wrap .btn-success {\n  color: #fff !important;\n  background-color: #47a447;\n  border-color: #419641;\n}\n.terminal-wrap .btn-success:active,\n.terminal-wrap .btn-success.active,\n.open .dropdown-toggle.terminal-wrap .btn-success {\n  background-image: none;\n}\n.terminal-wrap .btn-success.disabled,\n.terminal-wrap .btn-success[disabled],\nfieldset[disabled] .terminal-wrap .btn-success,\n.terminal-wrap .btn-success.disabled:hover,\n.terminal-wrap .btn-success[disabled]:hover,\nfieldset[disabled] .terminal-wrap .btn-success:hover,\n.terminal-wrap .btn-success.disabled:focus,\n.terminal-wrap .btn-success[disabled]:focus,\nfieldset[disabled] .terminal-wrap .btn-success:focus,\n.terminal-wrap .btn-success.disabled:active,\n.terminal-wrap .btn-success[disabled]:active,\nfieldset[disabled] .terminal-wrap .btn-success:active,\n.terminal-wrap .btn-success.disabled.active,\n.terminal-wrap .btn-success[disabled].active,\nfieldset[disabled] .terminal-wrap .btn-success.active {\n  background-color: #5cb85c;\n  border-color: #5cb85c;\n}\n.terminal-wrap .btn-primary {\n  color: #fff !important;\n  background-color: #3C506F;\n  border-color: #3C506F;\n}\n.terminal-wrap .btn-primary:hover,\n.terminal-wrap .btn-primary:focus,\n.terminal-wrap .btn-primary:active,\n.terminal-wrap .btn-primary.active,\n.open .dropdown-toggle.terminal-wrap .btn-primary {\n  color: #fff !important;\n  background-color: #2e3d55;\n  border-color: #273347;\n}\n.terminal-wrap .btn-primary:active,\n.terminal-wrap .btn-primary.active,\n.open .dropdown-toggle.terminal-wrap .btn-primary {\n  background-image: none;\n}\n.terminal-wrap .btn-primary.disabled,\n.terminal-wrap .btn-primary[disabled],\nfieldset[disabled] .terminal-wrap .btn-primary,\n.terminal-wrap .btn-primary.disabled:hover,\n.terminal-wrap .btn-primary[disabled]:hover,\nfieldset[disabled] .terminal-wrap .btn-primary:hover,\n.terminal-wrap .btn-primary.disabled:focus,\n.terminal-wrap .btn-primary[disabled]:focus,\nfieldset[disabled] .terminal-wrap .btn-primary:focus,\n.terminal-wrap .btn-primary.disabled:active,\n.terminal-wrap .btn-primary[disabled]:active,\nfieldset[disabled] .terminal-wrap .btn-primary:active,\n.terminal-wrap .btn-primary.disabled.active,\n.terminal-wrap .btn-primary[disabled].active,\nfieldset[disabled] .terminal-wrap .btn-primary.active {\n  background-color: #3C506F;\n  border-color: #3C506F;\n}\n.terminal-wrap .btn-purple {\n  color: #fff !important;\n  background-color: #863F88;\n  border-color: #863F88;\n}\n.terminal-wrap .btn-purple:hover,\n.terminal-wrap .btn-purple:focus,\n.terminal-wrap .btn-purple:active,\n.terminal-wrap .btn-purple.active,\n.open .dropdown-toggle.terminal-wrap .btn-purple {\n  color: #fff !important;\n  background-color: #6b326c;\n  border-color: #5d2c5e;\n}\n.terminal-wrap .btn-purple:active,\n.terminal-wrap .btn-purple.active,\n.open .dropdown-toggle.terminal-wrap .btn-purple {\n  background-image: none;\n}\n.terminal-wrap .btn-purple.disabled,\n.terminal-wrap .btn-purple[disabled],\nfieldset[disabled] .terminal-wrap .btn-purple,\n.terminal-wrap .btn-purple.disabled:hover,\n.terminal-wrap .btn-purple[disabled]:hover,\nfieldset[disabled] .terminal-wrap .btn-purple:hover,\n.terminal-wrap .btn-purple.disabled:focus,\n.terminal-wrap .btn-purple[disabled]:focus,\nfieldset[disabled] .terminal-wrap .btn-purple:focus,\n.terminal-wrap .btn-purple.disabled:active,\n.terminal-wrap .btn-purple[disabled]:active,\nfieldset[disabled] .terminal-wrap .btn-purple:active,\n.terminal-wrap .btn-purple.disabled.active,\n.terminal-wrap .btn-purple[disabled].active,\nfieldset[disabled] .terminal-wrap .btn-purple.active {\n  background-color: #863F88;\n  border-color: #863F88;\n}\n.terminal-wrap .btn-white {\n  color: #717171 !important;\n  background-color: #fff;\n  border-color: #e1e1e1;\n}\n.terminal-wrap .btn-white:hover,\n.terminal-wrap .btn-white:focus,\n.terminal-wrap .btn-white:active,\n.terminal-wrap .btn-white.active,\n.open .dropdown-toggle.terminal-wrap .btn-white {\n  color: #717171 !important;\n  background-color: #ebebeb;\n  border-color: #c2c2c2;\n}\n.terminal-wrap .btn-white:active,\n.terminal-wrap .btn-white.active,\n.open .dropdown-toggle.terminal-wrap .btn-white {\n  background-image: none;\n}\n.terminal-wrap .btn-white.disabled,\n.terminal-wrap .btn-white[disabled],\nfieldset[disabled] .terminal-wrap .btn-white,\n.terminal-wrap .btn-white.disabled:hover,\n.terminal-wrap .btn-white[disabled]:hover,\nfieldset[disabled] .terminal-wrap .btn-white:hover,\n.terminal-wrap .btn-white.disabled:focus,\n.terminal-wrap .btn-white[disabled]:focus,\nfieldset[disabled] .terminal-wrap .btn-white:focus,\n.terminal-wrap .btn-white.disabled:active,\n.terminal-wrap .btn-white[disabled]:active,\nfieldset[disabled] .terminal-wrap .btn-white:active,\n.terminal-wrap .btn-white.disabled.active,\n.terminal-wrap .btn-white[disabled].active,\nfieldset[disabled] .terminal-wrap .btn-white.active {\n  background-color: #fff;\n  border-color: #e1e1e1;\n}\n.terminal-wrap .clear:before,\n.terminal-wrap .clear:after {\n  content: \" \";\n  /* 1 */\n  display: table;\n  /* 2 */\n}\n.terminal-wrap .clear:after {\n  clear: both;\n}\n.terminal-wrap .container {\n  padding: 50px;\n}\n.terminal-wrap .heading {\n  border: 1px solid #e1e1e1;\n  padding: 10px;\n  font-weight: bold;\n}\n.terminal-wrap .list {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.terminal-wrap .list li {\n  padding: 10px 0;\n}\n.terminal-wrap .menu {\n  padding: 10px 0;\n  text-align: right;\n}\n.terminal-wrap .border-top {\n  border-top: 1px solid #2D2D2D;\n}\n.terminal-wrap .panel-right {\n  width: 20%;\n  background: #fff;\n  padding: 15px;\n}\n.terminal-wrap .pull-left {\n  float: left;\n}\n.terminal-wrap .pull-right {\n  float: left;\n}\n.terminal-wrap .table {\n  border: 1px solid #e1e1e1;\n  font-size: 11px;\n  width: 100%;\n  border-collapse: collapse;\n  text-align: center;\n}\n.terminal-wrap .table thead th {\n  background: #e1e1e1;\n  font-weight: bold;\n}\n.terminal-wrap .table th {\n  font-weight: bold;\n}\n.terminal-wrap .table th,\n.terminal-wrap .table td {\n  padding: 10px 5px;\n}\n.terminal-wrap .terminal {\n  cursor: text;\n}\n.terminal-wrap .text-center {\n  text-align: center;\n}\n.terminal-wrap .text-right {\n  text-align: right;\n}\n.terminal-wrap .t-d-table {\n  display: table;\n  width: 100%;\n}\n.terminal-wrap .t-d-row {\n  display: table-row;\n}\n.terminal-wrap .t-d-cell {\n  vertical-align: top;\n  display: table-cell;\n}\n.terminal-wrap .t-f-size-14 {\n  font-size: 14px;\n}\n.terminal-wrap .t-bold {\n  font-weight: bold;\n}\n.terminal-wrap .wrapper-sm {\n  padding: 5px 10px;\n}\n\n/*# sourceMappingURL=main.css.map*/"],"sourceRoot":"webpack://"}]);
	
	// exports


/***/ },
/* 17 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}
	
	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 19 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map