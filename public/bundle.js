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
/******/ 	return __webpack_require__(__webpack_require__.s = 39);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/* harmony default export */ __webpack_exports__["a"] = (( str ) => {

	const [node, className] = str.split('.');

	const element = document.createElement( node );

	if (className)
		element.className = className;

	return element;
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tether_drop__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tether_drop___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tether_drop__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_dom__ = __webpack_require__(0);





// classes		: 'drop-theme-arrows',
// classes		: 'drop-theme-hubspot-popovers',
// classes		: 'drop-theme-basic',

// const CLASS_NAME = 'drop-theme-hubspot-popovers';
const CLASS_NAME = 'drop-theme-twipsy';
// const CLASS_NAME = 'drop-theme-arrows-bounce';
// const CLASS_NAME = 'drop-theme-arrows-bounce-dark';
// const CLASS_NAME = 'drop-theme-basic';
// const CLASS_NAME = 'drop-theme-arrows';

class ButtonPopOver
{
	constructor( params )
	{
		this.settings 	= params;
	}

	makeTrigger()
	{
		this.trigger 			= __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers_dom__["a" /* default */])('button.btn btn-primary');
		this.trigger.onclick 	= this.makePopover.bind(this);
		this.trigger.innerHTML	= this.settings.icon;

		return this.trigger;
	}

	makePopover()
	{
		this.popover = this.popover || new __WEBPACK_IMPORTED_MODULE_0_tether_drop___default.a({
				target		: this.getTrigger(),
				content		: this.getPopContent(),
				classes		: CLASS_NAME,
				position	: 'left top',
				openOn		: 'click'
			});

		this.trigger.onclick = false;
		this.trigger.click();
	}

	getTrigger()
	{
		return this.trigger;
	}

	getPopContent()
	{
		console.log('please overwrite in child');
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ButtonPopOver;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = getReplacement;
/* harmony export (immutable) */ __webpack_exports__["a"] = substitutePrintableChar;
/* unused harmony export _splitIntoLinesArr */


/*function chunk(arr, limit)
{
	let result = [];

	while (arr.length > limit)
	{
		result.push(arr.slice(0, limit));
		arr = arr.slice(limit);
	}

	if (arr.length > 0)
		result.push(arr);

	return result;
}*/

const common = {
	'[': '¤',
	'=': '*',
	',': '+',
};

const sabreLayout = Object.assign({}, common, {
	'\'': '‡',
	'\\': '§',
	// shift + ","
});

const apolloLayout = Object.assign({}, common, {
	']': '$',
	'`': '>',
	';': ':',
	'\\': false
});

const _to_ascii = {
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
	'189': '45'  //IE Key codes
};

function getReplacement( evt, isApollo )
{
	const char = String.fromCharCode(_to_ascii[ evt.keyCode || evt.which ] );
	return isApollo ? apolloLayout[char] : sabreLayout[char];
}

function substitutePrintableChar(evt, isApollo)
{
	const keyCode	= evt.keyCode || evt.which;

	if ( keyCode === 13 )
		return false;

	const ch = String.fromCharCode(keyCode);

	if (!ch)
		return false;

	const layout = isApollo ? apolloLayout : sabreLayout;

	return layout[ch] !== undefined ? layout[ch] : ch.toUpperCase();
}

function chunkIntoPages( linesArr , rowsPerScreen )
{
	return linesArr.map(
		(line, lineIndex) => lineIndex % rowsPerScreen ? [] : linesArr.slice( lineIndex , lineIndex + rowsPerScreen )
	)
	.filter(
		( data ) => !!data.length
	);
}

function _makePages(txt, rowsPerScreen = 20, maxCharLimit)
{
	const chunkByCharLimit = _splitIntoLinesArr( txt, maxCharLimit );

	return chunkIntoPages(chunkByCharLimit, rowsPerScreen).map(
		(sectionLines) => sectionLines.join('\n')
	);
}

function _splitIntoLinesArr( txt, maxCharLimit )
{
	const lines 		= splitLines(txt);
	const regex 		= new RegExp(`(.{1,${maxCharLimit}})`, 'gi');

	let chunkByCharLimit= [];

	lines.forEach( (line) => {
		let lineArr = line.match(regex);
		chunkByCharLimit = chunkByCharLimit.concat(lineArr);
	});

	return chunkByCharLimit;
}

function splitLines(txt)
{
	return txt.split(/\r?\n/);
}

/* harmony default export */ __webpack_exports__["c"] = ({
	makeCachedParts 		: _makePages,
	substitutePrintableChar : substitutePrintableChar,
	getLines 				: _splitIntoLinesArr,
	splitLines 				: splitLines,
	getReplacement 			: getReplacement,
});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_noty__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_noty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_noty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_whatwg_fetch__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_whatwg_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_whatwg_fetch__);






const Debug = txt => {
	new __WEBPACK_IMPORTED_MODULE_1_noty___default.a({
		text	: `SERVER ERROR : ${txt}`,
		layout 	: 'bottomRight',
		timeout : 5000,
		// theme	: 'relax',
		type 	: 'error'
	}).show();
};

function ask( url, params)
{
	return fetch( url, params )

		.then( response => response.json() )
		.catch( err => {

			Debug( err );
			console.error( '?????????', err );

		});
}

function get( url, defParams )
{
	if (!url)
		return '';

	if (defParams)
	{
		url += '?rId='+ window.apiData.rId;
	}

	const params = { credentials: 'include' };

	return ask( url, params );
	// return fetch( url, params ).then( response => response.json() )
}


function runSyncCommand( params )
{
	// let url 	= (window.apiData.getCommandUrl || END_POINT_URL)  + '&function=' + functionName;
	let url 	= window.apiData.getCommandUrl || __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* END_POINT_URL */];

	// const data 	= ;
	// console.log( data );

	const formData 	= new FormData();
	formData.append( "data", JSON.stringify({ params }, true) );

	// url += '&function=' + functionName;

	return ask( __WEBPACK_IMPORTED_MODULE_0__constants__["d" /* API_HOST */] + url, {
		credentials	: 'include',
		body		: formData,
		method		: 'POST',
	});

	/*return fetch(API_HOST + url, {
		credentials	: 'include',
		body		: formData,
		method		: 'POST',
	}).then( response  => response.json() ).catch(
		() => { console.log(' fu ')
	})*/
}

/* harmony default export */ __webpack_exports__["a"] = ({
	runSyncCommand	: runSyncCommand,
	get 			: get
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

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
  visibilityControl: true
};

/**
 * @param {string} queueName
 * @return {object}
 */
function getQueueCounts() {
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

      if (this.options.killer === true && !API.PageHidden) {
        Noty.closeAll();
      } else if (typeof this.options.killer === 'string' && !API.PageHidden) {
        Noty.closeAll(this.options.killer);
      } else {
        var queueCounts = API.getQueueCounts(this.options.queue);

        if (queueCounts.current >= queueCounts.maxVisible || API.PageHidden) {
          API.addToQueue(this);

          if (API.PageHidden && this.hasSound && Utils.inArray('docHidden', this.options.sounds.conditions)) {
            Utils.createAudioElements(this);
          }

          if (API.PageHidden && Utils.inArray('docHidden', this.options.titleCount.conditions)) {
            API.docTitle.increment();
          }

          return this;
        }
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
          _this.close();
        }, false);
      }

      Utils.addListener(this.barDom, 'mouseenter', function () {
        API.fire(_this, 'onHover');
      }, false);

      if (this.options.timeout) Utils.addClass(this.barDom, 'noty_has_timeout');

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
      return "3.1.0";
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
/* 5 */
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const END_POINT_URL	 		= 'terminal/command?';
/* harmony export (immutable) */ __webpack_exports__["c"] = END_POINT_URL;

const TIME_FORMAT 			= '12';
/* unused harmony export TIME_FORMAT */

const ACCOUNT 				= 'training';
/* unused harmony export ACCOUNT */

const API_HOST 				= '';
/* harmony export (immutable) */ __webpack_exports__["d"] = API_HOST;

const KEEP_ALIVE_REFRESH 	= 60000;
/* harmony export (immutable) */ __webpack_exports__["b"] = KEEP_ALIVE_REFRESH;

const AREA_LIST 				= ['A', 'B', 'C', 'D', 'E', 'F'];
/* harmony export (immutable) */ __webpack_exports__["a"] = AREA_LIST;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_containerMain__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_requests__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants__ = __webpack_require__(6);






const apiData	= window.apiData || {};
const saved		= localStorage.getItem('matrix');

const gdsSettings = {
	sessionIndex 	: 0,
	pcc				: {},
	matrix			: saved ? JSON.parse( saved ) : {rows : 1, cells : 1},
	activeTerminal	: null,
	canCreatePq		: false
};

const extendGds = name => ({
	name 			: name,
	sessionIndex 	: __WEBPACK_IMPORTED_MODULE_2__constants__["a" /* AREA_LIST */].indexOf(apiData.settings['gds'][name]['area']),
	canCreatePq		: !!apiData.settings['gds'][name]['canCreatePq']
});

const Gds = {
	apollo	: Object.assign({}, gdsSettings, extendGds('apollo')),
	sabre	: Object.assign({}, gdsSettings, extendGds('sabre'))
};

class TerminalState
{
	constructor()
	{
		const curGds = apiData.settings.common['currentGds'] || 'apollo';

		this.state = {
			language		: 'APOLLO',
			fontSize		: 1,
			hideMenu		: false,

			gdsObj			: Gds[curGds]
		};

		// Request.get(`terminal/keepAlive`, true);
		setInterval( () => __WEBPACK_IMPORTED_MODULE_1__helpers_requests__["a" /* default */].get(`terminal/keepAlive`, true), __WEBPACK_IMPORTED_MODULE_2__constants__["b" /* KEEP_ALIVE_REFRESH */] );
	}

	getMatrix()
	{
		return this.state.gdsObj.matrix;
	}

	getPcc()
	{
		return this.state.gdsObj.pcc;
	}

	getActiveTerminal()
	{
		return this.state.gdsObj['activeTerminal'];
	}

	getGds()
	{
		return this.state.gdsObj['name'];
	}

	getLanguage()
	{
		return this.state['language'];
	}

	getAreaIndex()
	{
		return this.state.gdsObj['sessionIndex'];
	}

	getSessionAreaMap()
	{
		const key = this.getGds() === 'apollo' ? 'S': '¤';
		return __WEBPACK_IMPORTED_MODULE_2__constants__["a" /* AREA_LIST */].map( char => key + char );
	}

	getBuffer( gds, terminalId )
	{
		const buffer = apiData.buffer;

		if ( apiData && buffer && buffer.gds && buffer.gds[gds] )
			return buffer['gds'][gds]['terminals'][terminalId];

		return false;
	}

	purgeScreens()
	{
		__WEBPACK_IMPORTED_MODULE_0__components_containerMain__["a" /* default */].purgeScreens( this.getGds() );
		__WEBPACK_IMPORTED_MODULE_1__helpers_requests__["a" /* default */].get(`terminal/clearBuffer`, true);
	}

	execCmd( cmd = '' )
	{
		const terminal = this.getActiveTerminal();

		if (terminal && cmd)
			terminal.exec( cmd );
	}

	isLanguageApollo()
	{
		return this.getLanguage() === 'APOLLO';
	}

	action( action, params )
	{
		switch (action)
		{
			case 'CHANGE_GDS':

				Gds[ this.getGds() ] = this.state.gdsObj;

				this.change({
					gds		: params,
					gdsObj 	: Gds[params]
				});

			break;

			case 'CHANGE_SESSION_AREA' :

				this.change({
					gdsObj : Object.assign( {}, this.state.gdsObj, {sessionIndex : params} )
				});

				// return Container.menuRender( this.state );
			break;

			case 'CHANGE_SESSION_BY_MENU' :

				// console.log( params );

				const command	= this.getSessionAreaMap()[params];
				const xz		= this.getActiveTerminal().exec( command );

				// console.log( '!!!', xz );
				// return false;

			break;

			case 'CHANGE_MATRIX':

				localStorage.setItem('matrix', JSON.stringify( params ) );

				this.change({
					gdsObj : Object.assign( {}, this.state.gdsObj, {matrix : params} )
				});

			break;

			case 'CHANGE_ACTIVE_TERMINAL' :
				// TODO :: optimize

				this.change({
					gdsObj : Object.assign( {}, this.state.gdsObj, { activeTerminal : params } )
				});

				// todo move to
				// params[0].parentNode.classList.add('active');
				// return false;
			break;

			case 'CHANGE_PCC' :
				const area = this.getAreaIndex();

				this.change({
					gdsObj : Object.assign({}, this.state.gdsObj, {
						pcc : {
							[area] : params
						}
					})
				});
			break;

			// case 'ACTIVATE_PQ' :
			// break;

			case 'CAN_CREATE_PQ' :

				// console.log("SSSSS", params);
				// console.log("SSSSS", this.state.gdsObj.canCreatePq);

				if (this.state.gdsObj.canCreatePq !== params )
				{
					this.change({
						gdsObj : Object.assign( {}, this.state.gdsObj, { canCreatePq : params } )
					});

					// console.log( 'trigger BTN ');
				}

				return false;

			break;

			case 'PQ_MODAL_SHOW' :

				if (!this.state.gdsObj.canCreatePq)
					return false;

				apiData.pqModal.show({
					onClose	: () => this.change( {hideMenu: false} )
				})

				.then( () => this.change({hideMenu: true}) );

			break;

			case 'PQ_MACROS' :

				const term = this.getActiveTerminal();

				if (term)
				{
					window.activePlugin.hiddenBuff = ['A/V/13SEPSEAMNL+DL', '01Y1*', '*R', '$BB'];
					window.activePlugin.loopCmdStack();
				}

				return false;
			break;
		}
	}

	change( params = {} )
	{
		this.state = Object.assign( {}, this.state, params );

		console.log(' change ', params);

		__WEBPACK_IMPORTED_MODULE_0__components_containerMain__["a" /* default */].render( this.state );
	}
}

window.TerminalState = new TerminalState();

let resizeTimeout;

window.onresize = function() {

	if (resizeTimeout)
		clearInterval(resizeTimeout);

	resizeTimeout = setTimeout( () => window.TerminalState.change(), 150 );
};

__WEBPACK_IMPORTED_MODULE_0__components_containerMain__["a" /* default */].init( apiData['htmlRootId'] || 'rootTerminal' );
window.TerminalState.change({}, '');

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(10);


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = {
	"dots": {
		"interval": 80,
		"frames": [
			"⠋",
			"⠙",
			"⠹",
			"⠸",
			"⠼",
			"⠴",
			"⠦",
			"⠧",
			"⠇",
			"⠏"
		]
	},
	"dots2": {
		"interval": 80,
		"frames": [
			"⣾",
			"⣽",
			"⣻",
			"⢿",
			"⡿",
			"⣟",
			"⣯",
			"⣷"
		]
	},
	"dots3": {
		"interval": 80,
		"frames": [
			"⠋",
			"⠙",
			"⠚",
			"⠞",
			"⠖",
			"⠦",
			"⠴",
			"⠲",
			"⠳",
			"⠓"
		]
	},
	"dots4": {
		"interval": 80,
		"frames": [
			"⠄",
			"⠆",
			"⠇",
			"⠋",
			"⠙",
			"⠸",
			"⠰",
			"⠠",
			"⠰",
			"⠸",
			"⠙",
			"⠋",
			"⠇",
			"⠆"
		]
	},
	"dots5": {
		"interval": 80,
		"frames": [
			"⠋",
			"⠙",
			"⠚",
			"⠒",
			"⠂",
			"⠂",
			"⠒",
			"⠲",
			"⠴",
			"⠦",
			"⠖",
			"⠒",
			"⠐",
			"⠐",
			"⠒",
			"⠓",
			"⠋"
		]
	},
	"dots6": {
		"interval": 80,
		"frames": [
			"⠁",
			"⠉",
			"⠙",
			"⠚",
			"⠒",
			"⠂",
			"⠂",
			"⠒",
			"⠲",
			"⠴",
			"⠤",
			"⠄",
			"⠄",
			"⠤",
			"⠴",
			"⠲",
			"⠒",
			"⠂",
			"⠂",
			"⠒",
			"⠚",
			"⠙",
			"⠉",
			"⠁"
		]
	},
	"dots7": {
		"interval": 80,
		"frames": [
			"⠈",
			"⠉",
			"⠋",
			"⠓",
			"⠒",
			"⠐",
			"⠐",
			"⠒",
			"⠖",
			"⠦",
			"⠤",
			"⠠",
			"⠠",
			"⠤",
			"⠦",
			"⠖",
			"⠒",
			"⠐",
			"⠐",
			"⠒",
			"⠓",
			"⠋",
			"⠉",
			"⠈"
		]
	},
	"dots8": {
		"interval": 80,
		"frames": [
			"⠁",
			"⠁",
			"⠉",
			"⠙",
			"⠚",
			"⠒",
			"⠂",
			"⠂",
			"⠒",
			"⠲",
			"⠴",
			"⠤",
			"⠄",
			"⠄",
			"⠤",
			"⠠",
			"⠠",
			"⠤",
			"⠦",
			"⠖",
			"⠒",
			"⠐",
			"⠐",
			"⠒",
			"⠓",
			"⠋",
			"⠉",
			"⠈",
			"⠈"
		]
	},
	"dots9": {
		"interval": 80,
		"frames": [
			"⢹",
			"⢺",
			"⢼",
			"⣸",
			"⣇",
			"⡧",
			"⡗",
			"⡏"
		]
	},
	"dots10": {
		"interval": 80,
		"frames": [
			"⢄",
			"⢂",
			"⢁",
			"⡁",
			"⡈",
			"⡐",
			"⡠"
		]
	},
	"dots11": {
		"interval": 100,
		"frames": [
			"⠁",
			"⠂",
			"⠄",
			"⡀",
			"⢀",
			"⠠",
			"⠐",
			"⠈"
		]
	},
	"dots12": {
		"interval": 80,
		"frames": [
			"⢀⠀",
			"⡀⠀",
			"⠄⠀",
			"⢂⠀",
			"⡂⠀",
			"⠅⠀",
			"⢃⠀",
			"⡃⠀",
			"⠍⠀",
			"⢋⠀",
			"⡋⠀",
			"⠍⠁",
			"⢋⠁",
			"⡋⠁",
			"⠍⠉",
			"⠋⠉",
			"⠋⠉",
			"⠉⠙",
			"⠉⠙",
			"⠉⠩",
			"⠈⢙",
			"⠈⡙",
			"⢈⠩",
			"⡀⢙",
			"⠄⡙",
			"⢂⠩",
			"⡂⢘",
			"⠅⡘",
			"⢃⠨",
			"⡃⢐",
			"⠍⡐",
			"⢋⠠",
			"⡋⢀",
			"⠍⡁",
			"⢋⠁",
			"⡋⠁",
			"⠍⠉",
			"⠋⠉",
			"⠋⠉",
			"⠉⠙",
			"⠉⠙",
			"⠉⠩",
			"⠈⢙",
			"⠈⡙",
			"⠈⠩",
			"⠀⢙",
			"⠀⡙",
			"⠀⠩",
			"⠀⢘",
			"⠀⡘",
			"⠀⠨",
			"⠀⢐",
			"⠀⡐",
			"⠀⠠",
			"⠀⢀",
			"⠀⡀"
		]
	},
	"line": {
		"interval": 130,
		"frames": [
			"-",
			"\\",
			"|",
			"/"
		]
	},
	"line2": {
		"interval": 100,
		"frames": [
			"⠂",
			"-",
			"–",
			"—",
			"–",
			"-"
		]
	},
	"pipe": {
		"interval": 100,
		"frames": [
			"┤",
			"┘",
			"┴",
			"└",
			"├",
			"┌",
			"┬",
			"┐"
		]
	},
	"simpleDots": {
		"interval": 400,
		"frames": [
			".  ",
			".. ",
			"...",
			"   "
		]
	},
	"simpleDotsScrolling": {
		"interval": 200,
		"frames": [
			".  ",
			".. ",
			"...",
			" ..",
			"  .",
			"   "
		]
	},
	"star": {
		"interval": 70,
		"frames": [
			"✶",
			"✸",
			"✹",
			"✺",
			"✹",
			"✷"
		]
	},
	"star2": {
		"interval": 80,
		"frames": [
			"+",
			"x",
			"*"
		]
	},
	"flip": {
		"interval": 70,
		"frames": [
			"_",
			"_",
			"_",
			"-",
			"`",
			"`",
			"'",
			"´",
			"-",
			"_",
			"_",
			"_"
		]
	},
	"hamburger": {
		"interval": 100,
		"frames": [
			"☱",
			"☲",
			"☴"
		]
	},
	"growVertical": {
		"interval": 120,
		"frames": [
			"▁",
			"▃",
			"▄",
			"▅",
			"▆",
			"▇",
			"▆",
			"▅",
			"▄",
			"▃"
		]
	},
	"growHorizontal": {
		"interval": 120,
		"frames": [
			"▏",
			"▎",
			"▍",
			"▌",
			"▋",
			"▊",
			"▉",
			"▊",
			"▋",
			"▌",
			"▍",
			"▎"
		]
	},
	"balloon": {
		"interval": 140,
		"frames": [
			" ",
			".",
			"o",
			"O",
			"@",
			"*",
			" "
		]
	},
	"balloon2": {
		"interval": 120,
		"frames": [
			".",
			"o",
			"O",
			"°",
			"O",
			"o",
			"."
		]
	},
	"noise": {
		"interval": 100,
		"frames": [
			"▓",
			"▒",
			"░"
		]
	},
	"bounce": {
		"interval": 120,
		"frames": [
			"⠁",
			"⠂",
			"⠄",
			"⠂"
		]
	},
	"boxBounce": {
		"interval": 120,
		"frames": [
			"▖",
			"▘",
			"▝",
			"▗"
		]
	},
	"boxBounce2": {
		"interval": 100,
		"frames": [
			"▌",
			"▀",
			"▐",
			"▄"
		]
	},
	"triangle": {
		"interval": 50,
		"frames": [
			"◢",
			"◣",
			"◤",
			"◥"
		]
	},
	"arc": {
		"interval": 100,
		"frames": [
			"◜",
			"◠",
			"◝",
			"◞",
			"◡",
			"◟"
		]
	},
	"circle": {
		"interval": 120,
		"frames": [
			"◡",
			"⊙",
			"◠"
		]
	},
	"squareCorners": {
		"interval": 180,
		"frames": [
			"◰",
			"◳",
			"◲",
			"◱"
		]
	},
	"circleQuarters": {
		"interval": 120,
		"frames": [
			"◴",
			"◷",
			"◶",
			"◵"
		]
	},
	"circleHalves": {
		"interval": 50,
		"frames": [
			"◐",
			"◓",
			"◑",
			"◒"
		]
	},
	"squish": {
		"interval": 100,
		"frames": [
			"╫",
			"╪"
		]
	},
	"toggle": {
		"interval": 250,
		"frames": [
			"⊶",
			"⊷"
		]
	},
	"toggle2": {
		"interval": 80,
		"frames": [
			"▫",
			"▪"
		]
	},
	"toggle3": {
		"interval": 120,
		"frames": [
			"□",
			"■"
		]
	},
	"toggle4": {
		"interval": 100,
		"frames": [
			"■",
			"□",
			"▪",
			"▫"
		]
	},
	"toggle5": {
		"interval": 100,
		"frames": [
			"▮",
			"▯"
		]
	},
	"toggle6": {
		"interval": 300,
		"frames": [
			"ဝ",
			"၀"
		]
	},
	"toggle7": {
		"interval": 80,
		"frames": [
			"⦾",
			"⦿"
		]
	},
	"toggle8": {
		"interval": 100,
		"frames": [
			"◍",
			"◌"
		]
	},
	"toggle9": {
		"interval": 100,
		"frames": [
			"◉",
			"◎"
		]
	},
	"toggle10": {
		"interval": 100,
		"frames": [
			"㊂",
			"㊀",
			"㊁"
		]
	},
	"toggle11": {
		"interval": 50,
		"frames": [
			"⧇",
			"⧆"
		]
	},
	"toggle12": {
		"interval": 120,
		"frames": [
			"☗",
			"☖"
		]
	},
	"toggle13": {
		"interval": 80,
		"frames": [
			"=",
			"*",
			"-"
		]
	},
	"arrow": {
		"interval": 100,
		"frames": [
			"←",
			"↖",
			"↑",
			"↗",
			"→",
			"↘",
			"↓",
			"↙"
		]
	},
	"arrow2": {
		"interval": 80,
		"frames": [
			"⬆️ ",
			"↗️ ",
			"➡️ ",
			"↘️ ",
			"⬇️ ",
			"↙️ ",
			"⬅️ ",
			"↖️ "
		]
	},
	"arrow3": {
		"interval": 120,
		"frames": [
			"▹▹▹▹▹",
			"▸▹▹▹▹",
			"▹▸▹▹▹",
			"▹▹▸▹▹",
			"▹▹▹▸▹",
			"▹▹▹▹▸"
		]
	},
	"bouncingBar": {
		"interval": 80,
		"frames": [
			"[    ]",
			"[   =]",
			"[  ==]",
			"[ ===]",
			"[====]",
			"[=== ]",
			"[==  ]",
			"[=   ]"
		]
	},
	"bouncingBall": {
		"interval": 80,
		"frames": [
			"( ●    )",
			"(  ●   )",
			"(   ●  )",
			"(    ● )",
			"(     ●)",
			"(    ● )",
			"(   ●  )",
			"(  ●   )",
			"( ●    )",
			"(●     )"
		]
	},
	"smiley": {
		"interval": 200,
		"frames": [
			"😄 ",
			"😝 "
		]
	},
	"monkey": {
		"interval": 300,
		"frames": [
			"🙈 ",
			"🙈 ",
			"🙉 ",
			"🙊 "
		]
	},
	"hearts": {
		"interval": 100,
		"frames": [
			"💛 ",
			"💙 ",
			"💜 ",
			"💚 ",
			"❤️ "
		]
	},
	"clock": {
		"interval": 100,
		"frames": [
			"🕐 ",
			"🕑 ",
			"🕒 ",
			"🕓 ",
			"🕔 ",
			"🕕 ",
			"🕖 ",
			"🕗 ",
			"🕘 ",
			"🕙 ",
			"🕚 "
		]
	},
	"earth": {
		"interval": 180,
		"frames": [
			"🌍 ",
			"🌎 ",
			"🌏 "
		]
	},
	"moon": {
		"interval": 80,
		"frames": [
			"🌑 ",
			"🌒 ",
			"🌓 ",
			"🌔 ",
			"🌕 ",
			"🌖 ",
			"🌗 ",
			"🌘 "
		]
	},
	"runner": {
		"interval": 140,
		"frames": [
			"🚶 ",
			"🏃 "
		]
	},
	"pong": {
		"interval": 80,
		"frames": [
			"▐⠂       ▌",
			"▐⠈       ▌",
			"▐ ⠂      ▌",
			"▐ ⠠      ▌",
			"▐  ⡀     ▌",
			"▐  ⠠     ▌",
			"▐   ⠂    ▌",
			"▐   ⠈    ▌",
			"▐    ⠂   ▌",
			"▐    ⠠   ▌",
			"▐     ⡀  ▌",
			"▐     ⠠  ▌",
			"▐      ⠂ ▌",
			"▐      ⠈ ▌",
			"▐       ⠂▌",
			"▐       ⠠▌",
			"▐       ⡀▌",
			"▐      ⠠ ▌",
			"▐      ⠂ ▌",
			"▐     ⠈  ▌",
			"▐     ⠂  ▌",
			"▐    ⠠   ▌",
			"▐    ⡀   ▌",
			"▐   ⠠    ▌",
			"▐   ⠂    ▌",
			"▐  ⠈     ▌",
			"▐  ⠂     ▌",
			"▐ ⠠      ▌",
			"▐ ⡀      ▌",
			"▐⠠       ▌"
		]
	},
	"shark": {
		"interval": 120,
		"frames": [
			"▐|\\____________▌",
			"▐_|\\___________▌",
			"▐__|\\__________▌",
			"▐___|\\_________▌",
			"▐____|\\________▌",
			"▐_____|\\_______▌",
			"▐______|\\______▌",
			"▐_______|\\_____▌",
			"▐________|\\____▌",
			"▐_________|\\___▌",
			"▐__________|\\__▌",
			"▐___________|\\_▌",
			"▐____________|\\▌",
			"▐____________/|▌",
			"▐___________/|_▌",
			"▐__________/|__▌",
			"▐_________/|___▌",
			"▐________/|____▌",
			"▐_______/|_____▌",
			"▐______/|______▌",
			"▐_____/|_______▌",
			"▐____/|________▌",
			"▐___/|_________▌",
			"▐__/|__________▌",
			"▐_/|___________▌",
			"▐/|____________▌"
		]
	},
	"dqpb": {
		"interval": 100,
		"frames": [
			"d",
			"q",
			"p",
			"b"
		]
	}
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, setImmediate) {/**@license
 *       __ _____                     ________                              __
 *      / // _  /__ __ _____ ___ __ _/__  ___/__ ___ ______ __ __  __ ___  / /
 *  __ / // // // // // _  // _// // / / // _  // _//     // //  \/ // _ \/ /
 * /  / // // // // // ___// / / // / / // ___// / / / / // // /\  // // / /__
 * \___//____ \\___//____//_/ _\_  / /_//____//_/ /_/ /_//_//_/ /_/ \__\_\___/
 *           \/              /____/                              version 1.2.0
 *
 * This file is part of jQuery Terminal. http://terminal.jcubic.pl
 *
 * Copyright (c) 2010-2017 Jakub Jankiewicz <http://jcubic.pl/me>
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
 * Date: Fri, 21 Apr 2017 16:18:04 +0000
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
/* global location, jQuery, setTimeout, window, global, localStorage, sprintf,
          setImmediate */
/* eslint-disable */
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

                if (/[^s]/.test(match[8]) && (get_type(arg) !== 'number')) {
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
                arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? ' +' + arg : arg);
                pad_character = match[4] ? match[4] === '0' ? '0' : match[4].charAt(1) : ' ';
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
})(typeof global !== "undefined" ? global : window);
/* eslint-enable */
(function($, undefined) {
    'use strict';
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
            if (typeof object === 'object') {
                if ($.isArray(object)) {
                    return this.clone_array(object);
                } else if (object === null) {
                    return object;
                } else {
                    for (var key in object) {
                        if ($.isArray(object[key])) {
                            tmp[key] = this.clone_array(object[key]);
                        } else if (typeof object[key] === 'object') {
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
                throw new Error("Your browser don't support ES5 array map " +
                                'use es5-shim');
            }
            return array.slice(0).map(function(item) {
                if (typeof item === 'object') {
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

    /* eslint-disable */
    var hasLS = function() {
      var testKey = 'test', storage = window.localStorage;
      try {
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return true;
      } catch (error) {
        return false;
      }
    };

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

        self = function(str, separator, limit) {
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
                            match[0].replace(separator2, function() {
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
        String.prototype.split = function(separator, limit) {
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
        if (arguments.length === 0) {
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
        if (pos === -1)
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
    /* eslint-enable */
    // -----------------------------------------------------------------------
    // :: hide elements from screen readers
    // -----------------------------------------------------------------------
    function a11y_hide(element) {
        element.attr({
            role: 'presentation',
            'aria-hidden': 'true'
        });
    }
    // -----------------------------------------------------------------------
    // :: Split string to array of strings with the same length
    // -----------------------------------------------------------------------
    function str_parts(str, length) {
        var result = [];
        var len = str.length;
        if (len < length) {
            return [str];
        } else if (length < 0) {
            throw new Error("str_parts: length can't be negative");
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
    // :: HISTORY CLASS
    // -------------------------------------------------------------------------
    function History(name, size, memory) {
        var enabled = true;
        var storage_key = '';
        if (typeof name === 'string' && name !== '') {
            storage_key = name + '_';
        }
        storage_key += 'commands';
        var data;
        if (memory) {
            data = [];
        } else {
            data = $.Storage.get(storage_key);
            data = data ? $.parseJSON(data) : [];
        }
        var pos = data.length - 1;
        $.extend(this, {
            append: function(item) {
                if (enabled) {
                    if (data[data.length - 1] !== item) {
                        data.push(item);
                        if (size && data.length > size) {
                            data = data.slice(-size);
                        }
                        pos = data.length - 1;
                        if (!memory) {
                            $.Storage.set(storage_key, JSON.stringify(data));
                        }
                    }
                }
            },
            set: function(new_data) {
                if (new_data instanceof Array) {
                    data = new_data;
                    if (!memory) {
                        $.Storage.set(storage_key, JSON.stringify(data));
                    }
                }
            },
            data: function() {
                return data;
            },
            reset: function() {
                pos = data.length - 1;
            },
            last: function() {
                return data[data.length - 1];
            },
            end: function() {
                return pos === data.length - 1;
            },
            position: function() {
                return pos;
            },
            current: function() {
                return data[pos];
            },
            next: function() {
                if (pos < data.length - 1) {
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
                if (!memory) {
                    $.Storage.remove(storage_key);
                }
            },
            disable: function() {
                enabled = false;
            }
        });
    }
    // -------------------------------------------------------------------------
    // :: COMMAND LINE PLUGIN
    // -------------------------------------------------------------------------
    var cmd_index = 0;
    $.fn.cmd = function(options) {
        var self = this;
        var maybe_data = self.data('cmd');
        if (maybe_data) {
            return maybe_data;
        }
        var id = cmd_index++;
        self.addClass('cmd');
        self.append('<span class="prompt"></span><span></span>' +
                    '<span class="cursor">&nbsp;</span><span></span>');
        // a11y: don't read command it's in textarea that's in focus
        a11y_hide(self.find('span').not(':eq(0)'));
        // on mobile the only way to hide textarea on desktop it's needed because
        // textarea show up after focus
        //self.append('<span class="mask"></mask>');
        var clip = $('<textarea>').attr({
            autocapitalize: 'off',
            spellcheck: 'false',
            tabindex: 1
        }).addClass('clipboard').appendTo(self);
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
        var kill_text = ''; // text from command that kill part of the command
        var position = 0;
        var prompt;
        var enabled;
        var historySize = options.historySize || 60;
        var name, history;
        var cursor = self.find('.cursor');
        var animation;
        var paste_count = 0;
        function get_char_size() {
            var span = $('<span>&nbsp;</span>').appendTo(self);
            var rect = span[0].getBoundingClientRect();
            span.remove();
            return rect;
        }
        function get_char_pos(point) {
            var prompt_len = self.find('.prompt').text().length;
            var size = get_char_size();
            var width = size.width;
            var height = size.height;
            var offset = self.offset();
            var col = Math.floor((point.x - offset.left) / width);
            var row = Math.floor((point.y - offset.top) / height);
            var lines = get_splited_command_line(command);
            var try_pos;
            if (row > 0 && lines.length > 1) {
                try_pos = col + lines.slice(0, row).reduce(function(sum, line) {
                    return sum + line.length;
                }, 0);
            } else {
                try_pos = col - prompt_len;
            }
            // tabs are 4 spaces and newline don't show up in results
            var text = command.replace(/\t/g, '\x00\x00\x00\x00').replace(/\n/, '');
            var before = text.slice(0, try_pos);
            var len = before.replace(/\x00{4}/g, '\t').replace(/\x00+/, '').length;
            return len > command.length ? command.length : len;
        }
        function get_key(e) {
            if (e.key) {
                var key = e.key.toUpperCase();
                if (key === 'CONTROL') {
                    return 'CTRL';
                } else {
                    var combo = [];
                    if (e.ctrlKey) {
                        combo.push('CTRL');
                    }
                    if (e.metaKey && key !== 'META') {
                        combo.push('META');
                    }
                    if (e.shiftKey && key !== 'SHIFT') {
                        combo.push('SHIFT');
                    }
                    if (e.altKey && key !== 'ALT') {
                        combo.push('ALT');
                    }
                    if (e.key) {
                        if (key === 'DEL') { // IE11
                            combo.push('DELETE');
                        } else {
                            combo.push(key);
                        }
                    }
                    return combo.join('+');
                }
            }
        }
        var keymap;
        var default_keymap = {
            'ALT+D': function() {
                self.set(command.slice(0, position) +
                         command.slice(position).
                         replace(/ *[^ ]+ *(?= )|[^ ]+$/, ''), true);
                // chrome jump to address bar
                return false;
            },
            'ENTER': function() {
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
                $('.clipboard').val('');
                return true;
            },
            'SHIFT+ENTER': function() {
                self.insert('\n');
                return false;
            },
            'BACKSPACE': function() {
                if (reverse_search) {
                    rev_search_str = rev_search_str.slice(0, -1);
                    draw_reverse_prompt();
                } else if (command !== '' && position > 0) {
                    self['delete'](-1);
                }
                return false;
                //return is_touch;
            },
            'TAB': function() {
                self.insert('\t');
            },
            'CTRL+D': function() {
                self['delete'](1);
                return false;
            },
            'DELETE': function() {
                self['delete'](1);
                return true;
            },
            'ARROWUP': prev_history,
            'UP': prev_history, // IE
            'CTRL+P': prev_history,
            'ARROWDOWN': next_history,
            'DOWN': next_history, // IE
            'CTRL+N': next_history,
            'ARROWLEFT': left,
            'LEFT': left, // IE
            'CTRL+B': left,
            'CTRL+ARROWLEFT': function() {
                // jump to one character after last space before prevoius word
                var len = position - 1;
                var pos = 0;
                if (command[len] === ' ') {
                    --len;
                }
                for (var i = len; i > 0; --i) {
                    if (command[i] === ' ' && command[i + 1] !== ' ') {
                        pos = i + 1;
                        break;
                    } else if (command[i] === '\n' &&
                               command[i + 1] !== '\n') {
                        pos = i;
                        break;
                    }
                }
                self.position(pos);
            },
            'CTRL+R': function() {
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
                return false;
            },
            'CTRL+G': function() {
                if (reverse_search) {
                    prompt = backup_prompt;
                    draw_prompt();
                    self.set(last_command);
                    redraw();
                    reverse_search = false;
                    rev_search_str = '';
                    return false;
                }
            },
            'ARROWRIGHT': right,
            'CTRL+F': right,
            'RIGHT': right, // IE
            'CTRL+ARROWRIGHT': function() {
                // jump to beginning or end of the word
                if (command[position] === ' ') {
                    ++position;
                }
                var re = /\S[\n\s]{2,}|[\n\s]+\S?/;
                var match = command.slice(position).match(re);
                if (!match || match[0].match(/^\s+$/)) {
                    self.position(command.length);
                } else if (match[0][0] !== ' ') {
                    position += match.index + 1;
                } else {
                    position += match.index + match[0].length - 1;
                    if (match[0][match[0].length - 1] !== ' ') {
                        --position;
                    }
                }
                redraw();
            },
            'F12': return_true, // Allow Firebug
            'END': end,
            'CTRL+E': end,
            'HOME': home,
            'CTRL+A': home,
            'SHIFT+INSERT': paste_event,
            'CTRL+SHIFT+T': return_true, // open closed tab
            'CTRL+W': function() {
                // don't work in Chromium (can't prevent close tab)
                if (command !== '' && position !== 0) {
                    var m = command.slice(0, position).match(/([^ ]+ *$)/);
                    if (m[0].length) {
                        kill_text = self['delete'](-m[0].length);
                        text_to_clipboard(self, kill_text);
                    }
                }
                return false;
            },
            'CTRL+H': function() {
                if (command !== '' && position > 0) {
                    self['delete'](-1);
                }
                return false;
            },
            'CTRL+X': return_true,
            'CTRL+C': return_true,
            'CTRL+T': return_true,
            'CTRL+Y': function() {
                if (kill_text !== '') {
                    self.insert(kill_text);
                }
            },
            'CTRL+V': paste_event,
            'META+V': paste_event,
            'CTRL+K': function() {
                if (command.length - position) {
                    kill_text = self['delete'](command.length - position);
                    text_to_clipboard(self, kill_text);
                }
                return false;
            },
            'CTRL+U': function() {
                if (command !== '' && position !== 0) {
                    kill_text = self['delete'](-position);
                    text_to_clipboard(self, kill_text);
                }
                return false;
            },
            'CTRL+TAB': function() {
                return false;
            },
            'META+`': return_true, // CMD+` switch browser window on Mac
            'META+R': return_true, // CMD+R page reload in Chrome Mac
            'META+L': return_true  // CLD+L jump into Ominbox on Chrome Mac
        };
        function return_true() {
            return true;
        }
        function paste_event() {
            clip.val('');
            paste_count = 0;
            clip.focus();
            clip.on('input', function input(e) {
                paste(e);
                clip.off('input', input);
            });
            return true;
        }
        function prev_history() {
            if (first_up_history) {
                last_command = command;
                self.set(history.current());
            } else {
                self.set(history.previous());
            }
            first_up_history = false;
            return false;
        }
        function next_history() {
            self.set(history.end() ? last_command : history.next());
            return false;
        }
        function left() {
            if (position > 0) {
                self.position(-1, true);
                redraw();
            }
        }
        function right() {
            if (position < command.length) {
                self.position(1, true);
            }
            return false;
        }
        function home() {
            self.position(0);
        }
        function end() {
            self.position(command.length);
        }
        function mobile_focus() {
            //if (is_touch) {
            var focus = clip.is(':focus');
            if (enabled) {
                if (!focus) {
                    clip.trigger('focus', [true]);
                    self.oneTime(10, function() {
                        clip.trigger('focus', [true]);
                    });
                }
            } else if (focus) {
                clip.blur();
            }
        }
        // on mobile you can't delete character if input is empty (event
        // will not fire) so we fake text entry, we could just put dummy
        // data but we put real command and position
        function fix_textarea() {
            // delay worked while experimenting
            self.oneTime(10, function() {
                clip.val(command);
                if (enabled) {
                    self.oneTime(10, function() {
                        try {
                            clip.caret(position);
                        } catch (e) {
                            // firefox throw NS_ERROR_FAILURE ignore
                        }
                    });
                }
            });
        }
        // terminal animation don't work on andorid because they animate
        // 2 properties
        if (support_animations && !is_android) {
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
        function blink() {
            cursor.toggleClass('inverted');
        }
        // ---------------------------------------------------------------------
        // :: Set prompt for reverse search
        // ---------------------------------------------------------------------
        function draw_reverse_prompt() {
            prompt = '(reverse-i-search)`' + rev_search_str + "': ";
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
                for (var j = rev_search_str.length; j > 0; j--) {
                    save_string = $.terminal.escape_regex(rev_search_str.substring(0, j));
                    regex = new RegExp(save_string);
                    for (var i = len; i--;) {
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
            var array;
            // command contains new line characters
            if (string.match(/\n/)) {
                var tmp = string.split('\n');
                var first_len = num_chars - prompt_len - 1;
                // empty character after each line
                for (var i = 0; i < tmp.length - 1; ++i) {
                    tmp[i] += ' ';
                }
                // split first line
                if (tmp[0].length > first_len) {
                    array = [tmp[0].substring(0, first_len)];
                    var str = tmp[0].substring(first_len);
                    array = array.concat(str_parts(str, num_chars));
                } else {
                    array = [tmp[0]];
                }
                // process rest of the lines
                for (i = 1; i < tmp.length; ++i) {
                    if (tmp[i].length > num_chars) {
                        array = array.concat(str_parts(tmp[i], num_chars));
                    } else {
                        array.push(tmp[i]);
                    }
                }
            } else {
                var first = string.substring(0, num_chars - prompt_len);
                var rest = string.substring(num_chars - prompt_len);
                array = [first].concat(str_parts(rest, num_chars));
            }
            return array;
        }
        // ---------------------------------------------------------------------
        // :: format end encode the string
        // ---------------------------------------------------------------------
        function format(string) {
            var formatters = $.terminal.defaults.formatters;
            for (var i = 0; i < formatters.length; ++i) {
                try {
                    if (typeof formatters[i] === 'function') {
                        var ret = formatters[i](string);
                        if (typeof ret === 'string') {
                            string = ret;
                        }
                    }
                } catch (e) {
                    alert('formatting error at formatters[' + i + ']\n' +
                          (e.stack ? e.stack : e));
                }
            }
            return $.terminal.format($.terminal.encode(string));
        }
        // ---------------------------------------------------------------------
        // :: Function that displays the command line. Split long lines and
        // :: place cursor in the right place
        // ---------------------------------------------------------------------
        var redraw = (function() {
            var before = cursor.prev();
            var after = cursor.next();
            // -----------------------------------------------------------------
            // :: Draw line with the cursor
            // -----------------------------------------------------------------
            function draw_cursor_line(string, position) {
                var len = string.length;
                if (position === len) {
                    before.html(format(string));
                    cursor.html('&nbsp;');
                    after.html('');
                } else if (position === 0) {
                    before.html('');
                    //fix for tilda in IE
                    cursor.html(format(string.slice(0, 1)));
                    //cursor.html(format(string[0]));
                    after.html(format(string.slice(1)));
                } else {
                    var before_str = string.slice(0, position);
                    before.html(format(before_str));
                    //fix for tilda in IE
                    var c = string.slice(position, position + 1);
                    //cursor.html(string[position]);
                    cursor.html(format(c));
                    if (position === string.length - 1) {
                        after.html('');
                    } else {
                        after.html(format(string.slice(position + 1)));
                    }
                }
            }
            function div(string) {
                return '<div>' + format(string) + '</div>';
            }
            // -----------------------------------------------------------------
            // :: Display lines after the cursor
            // -----------------------------------------------------------------
            function lines_after(lines) {
                var last_ins = after;
                $.each(lines, function(i, line) {
                    last_ins = $(div(line)).insertAfter(last_ins);
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
            // -----------------------------------------------------------------
            // :: Redraw function
            // -----------------------------------------------------------------
            return function() {
                var string;
                switch (typeof mask) {
                    case 'boolean':
                        string = mask ? command.replace(/./g, '*') : command;
                        break;
                    case 'string':
                        string = command.replace(/./g, mask);
                        break;
                }
                var i;
                self.find('div').remove();
                before.html('');
                // long line
                if (string.length > num_chars - prompt_len - 1 ||
                    string.match(/\n/)) {
                    var tabs = string.match(/\t/g);
                    var tabs_rm = tabs ? tabs.length * 3 : 0;
                    //quick tabulation hack
                    if (tabs) {
                        string = string.replace(/\t/g, '\x00\x00\x00\x00');
                    }
                    var array = get_splited_command_line(string);
                    if (tabs) {
                        array = $.map(array, function(line) {
                            return line.replace(/\x00\x00\x00\x00/g, '\t');
                        });
                    }
                    var first_len = array[0].length;
                    //cursor in first line
                    if (first_len === 0 && array.length === 1) {
                        // skip empty line
                    } else if (position < first_len) {
                        draw_cursor_line(array[0], position);
                        lines_after(array.slice(1));
                    } else if (position === first_len) {
                        before.before(div(array[0]));
                        draw_cursor_line(array[1] || '', 0);
                        if (array.length > 1) {
                            lines_after(array.slice(2));
                        }
                    } else {
                        var num_lines = array.length;
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
                            if (from_last <= last_len) { // in last line
                                lines_before(array.slice(0, -1));
                                if (last_len === from_last) {
                                    pos = 0;
                                } else {
                                    pos = last_len - from_last;
                                }
                                draw_cursor_line(last, pos);
                            } else if (num_lines === 3) { // in the middle
                                var str = format(array[0]);
                                before.before('<div>' + str + '</div>');
                                draw_cursor_line(array[1], position - first_len - 1);
                                str = format(array[2]);
                                after.after('<div>' + str + '</div>');
                            } else {
                                // more lines, cursor in the middle
                                var line_index;
                                var current;
                                pos = position;
                                for (i = 0; i < array.length; ++i) {
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
                                    if (current === undefined) {
                                        //should never happen
                                        var msg = $.terminal.defaults.strings.redrawError;
                                        throw new Error(msg);
                                    }
                                }
                                draw_cursor_line(current, pos);
                                lines_before(array.slice(0, line_index));
                                lines_after(array.slice(line_index + 1));
                            }
                        }
                    }
                } else if (string === '') {
                    before.html('');
                    cursor.html('&nbsp;');
                    after.html('');
                } else {
                    draw_cursor_line(string, position);
                }
            };
        })();
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
        function paste() {
            if (paste_count++ > 0) {
                return;
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
                    fix_textarea();
                });
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
                    history = new History(
                        string,
                        historySize,
                        options.history === 'memory'
                    );
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
                            self.position(position + n);
                        }
                        fire_change_command();
                    }
                } else if (command !== '' && position < command.length) {
                    removed = command.slice(position).slice(0, n);
                    command = command.slice(0, position) +
                        command.slice(position + n, command.length);
                    fire_change_command();
                }
                redraw();
                fix_textarea();
                return removed;
            },
            set: function(string, stay) {
                if (string !== undefined) {
                    command = string;
                    if (!stay) {
                        self.position(command.length);
                    }
                    redraw();
                    fix_textarea();
                    fire_change_command();
                }
                return self;
            },
            keymap: function(new_keymap) {
                if (typeof new_keymap === 'undefined') {
                    return keymap;
                } else {
                    keymap = $.extend(
                        {},
                        default_keymap,
                        $.omap(new_keymap || {}, function(key, fn) {
                            return function(e) {
                                // new keymap function will get default as 2nd argument
                                return fn(e, default_keymap[key]);
                            };
                        })
                    );
                    return self;
                }
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
                    fix_textarea();
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
                self.removeClass('cmd').removeData('cmd').off('.cmd');
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
                    } else if (n < 0) {
                        position = 0;
                    } else if (n > command.length) {
                        position = command.length;
                    } else {
                        position = n;
                    }
                    if ($.isFunction(options.onPositionChange)) {
                        options.onPositionChange(position);
                    }
                    redraw();
                    fix_textarea();
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
                try {
                    clip.caret(position);
                } catch (e) {
                    // firefox throw NS_ERROR_FAILURE ignore
                }
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
        if (typeof options.prompt === 'string') {
            prompt = options.prompt;
        } else {
            prompt = '> ';
        }
        draw_prompt();
        if (options.enabled === undefined || options.enabled === true) {
            self.enable();
        }
        if (!options.history) {
            history.disable();
        }
        var first_up_history = true;
        // prevent_keypress - hack for Android that was inserting characters on
        // backspace
        var prevent_keypress = false;
        var dead_key = false;
        var single_key = false;
        var no_keypress = false;
        var no_key = false;
        var backspace = false;
        var skip_insert;
        // we hold text before keydown to fix backspace for Android/Chrome/SwiftKey
        // keyboard that generate keycode 229 for all keys #296
        var text;
        // ---------------------------------------------------------------------
        // :: Keydown Event Handler
        // ---------------------------------------------------------------------
        function keydown_event(e) {
            var result;
            dead_key = no_keypress && single_key;
            // special keys don't trigger keypress fix #293
            try {
                single_key = e.key && e.key.length === 1;
                // chrome on android support key property but it's "Unidentified"
                no_key = String(e.key).toLowerCase() === 'unidentified';
                backspace = e.key.toUpperCase() === 'BACKSPACE' || e.which === 8;
            } catch (exception) {}
            text = clip.val();
            no_keypress = true;
            var key = get_key(e);
            if ($.isFunction(options.keydown)) {
                result = options.keydown(e);
                if (result !== undefined) {
                    //prevent_keypress = true;
                    return result;
                }
            }
            if (enabled) {
                // CTRL+V don't fire keypress in IE11
                skip_insert = ['CTRL+V', 'META+V'].indexOf(key) !== -1;
                if (e.which !== 38 && !(e.which === 80 && e.ctrlKey)) {
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
                } else if ($.isFunction(keymap[key])) {
                    result = keymap[key]();
                    if (result === true) {
                        return;
                    }
                    if (result !== undefined) {
                        return result;
                    }
                } else if (e.altKey) {
                    return;
                } else {
                    prevent_keypress = false;
                    return;
                }
                // this will prevent for instance backspace to go back one page
                //prevent_keypress = true;
                e.preventDefault();
            }
        }
        var doc = $(document.documentElement || window);
        self.keymap(options.keymap);
        function keypress_event(e) {
            var result;
            no_keypress = false;
            if ((e.ctrlKey || e.metaKey) && [99, 118, 86].indexOf(e.which) !== -1) {
                // CTRL+C or CTRL+V
                return;
            }
            if (prevent_keypress) {
                return;
            }
            if ($.isFunction(options.keypress)) {
                result = options.keypress(e);
                if (result !== undefined) {
                    return result;
                }
            }
            // key polyfill is not correct for keypress
            // https://github.com/cvan/keyboardevent-key-polyfill/issues/15
            var key;
            if (is_key_native()) {
                key = e.key;
            }
            if (!key || no_key) {
                key = String.fromCharCode(e.which);
            }
            if (key.toUpperCase() === 'SPACEBAR') { // fix IE issue
                key = ' ';
            }
            if (enabled) {
                if ($.inArray(e.which, [13, 0, 8]) > -1) {
                    if (e.keyCode === 123) { // for F12 which === 0
                        return;
                    }
                    return false;
                    // which === 100 - d
                } else if (key && (!e.ctrlKey || (e.ctrlKey && e.ctrlKey)) &&
                           (!(e.altKey && e.which === 100) || e.altKey) &&
                           !dead_key) {
                    // dead_key are handled by input event
                    if (reverse_search) {
                        rev_search_str += key;
                        reverse_history_search();
                        draw_reverse_prompt();
                    } else {
                        self.insert(key);
                    }
                    return false;
                }
            }
        }
        function input() {
            // Some Androids don't fire keypress - #39
            // if there is dead_key we also need to grab real character #158
            if ((no_keypress || dead_key) && !skip_insert && (single_key || no_key) &&
                !backspace) {
                var pos = position;
                var val = clip.val();
                if (val !== '') {
                    if (reverse_search) {
                        rev_search_str = val;
                        reverse_history_search();
                        draw_reverse_prompt();
                    } else {
                        self.set(val);
                    }
                    // backspace detection for Android/Chrome/SwiftKey
                    if (backspace || val.length < text.length) {
                        self.position(pos - 1);
                    } else {
                        // user enter more then one character if click on complete word
                        // on android
                        self.position(pos + Math.abs(val.length - text.length));
                    }
                }
            }
        }
        doc.bind('keypress.cmd', keypress_event).bind('keydown.cmd', keydown_event).
            bind('input.cmd', input);
        (function() {
            var isDragging = false;
            var was_down = false;
            var count = 0;
            self.on('mousedown.cmd', function() {
                was_down = true;
                self.oneTime(1, function() {
                    $(window).on('mousemove.cmd_' + id, function() {
                        isDragging = true;
                        $(window).off('mousemove.cmd_' + id);
                    });
                });
            }).on('mouseup.cmd', function(e) {
                var wasDragging = isDragging;
                isDragging = false;
                $(window).off('mousemove.cmd_' + id);
                if (!wasDragging) {
                    var name = 'click_' + id;
                    if (++count === 1) {
                        var down = was_down;
                        if (enabled) {
                            self.oneTime(options.clickTimeout, name, function() {
                                if (!$(e.target).is('.prompt') && down) {
                                    self.position(get_char_pos({
                                        x: e.pageX,
                                        y: e.pageY
                                    }));
                                }
                                count = 0;
                            });
                        } else {
                            count = 0;
                        }
                    } else {
                        self.stopTime(name);
                        count = 0;
                    }
                }
                was_down = false;
            });
        })();
        self.data('cmd', self);
        if (!('KeyboardEvent' in window && 'key' in window.KeyboardEvent.prototype)) {
            setTimeout(function() {
                throw new Error('key event property not supported try ' +
                                'https://github.com/cvan/keyboardevent-key-polyfill');
            }, 0);
        }
        return self;
    }; // cmd plugin

    // -------------------------------------------------------------------------
    // :: TOOLS
    // -------------------------------------------------------------------------
    // taken from https://hacks.mozilla.org/2011/09/detecting-and-generating-
    // css-animations-in-javascript/
    var support_animations = (function() {
        var animation = false,
            domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
            elm = document.createElement('div');
        if (elm.style.animationName) {
            animation = true;
        }
        if (animation === false) {
            for (var i = 0; i < domPrefixes.length; i++) {
                var name = domPrefixes[i] + 'AnimationName';
                if (elm.style[name] !== undefined) {
                    animation = true;
                    break;
                }
            }
        }
        return animation;
    })();
    // -------------------------------------------------------------------------
    var is_android = navigator.userAgent.toLowerCase().indexOf('android') !== -1;
    // -------------------------------------------------------------------------
    var is_touch = (function() {
        return 'ontouchstart' in window || !!window.DocumentTouch &&
            document instanceof window.DocumentTouch;
    })();
    // -------------------------------------------------------------------------
    function process_command(string, fn) {
        var array = fn(string);
        if (array.length) {
            var name = array.shift();
            var rest = string.substring(name.length).trim();
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
    /* eslint-disable */
    var format_split_re = /(\[\[[!gbiuso]*;[^;]*;[^\]]*\](?:[^\]]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]?)/i;
    var format_parts_re = /\[\[([!gbiuso]*);([^;]*);([^;\]]*);?([^;\]]*);?([^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]?/gi;
    var format_re = /\[\[([!gbiuso]*;[^;\]]*;[^;\]]*(?:;|[^\]()]*);?[^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]?/gi;
    var format_exist_re = /\[\[([!gbiuso]*;[^;\]]*;[^;\]]*(?:;|[^\]()]*);?[^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]/gi;
    var format_full_re = /^\[\[([!gbiuso]*;[^;\]]*;[^;\]]*(?:;|[^\]()]*);?[^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]$/gi;
    var color_hex_re = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
    var url_re = /(\bhttps?:\/\/(?:(?:(?!&[^;]+;)|(?=&amp;))[^\s"'<>\][)])+\b)/gi;
    var url_nf_re = /\b(https?:\/\/(?:(?:(?!&[^;]+;)|(?=&amp;))[^\s"'<>\][)])+)\b(?![^[\]]*])/gi;
    var email_re = /((([^<>('")[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))/g;
    var command_re = /('(?:[^']|\\')*'|"(\\"|[^"])*"|(?:\/(\\\/|[^/])+\/[gimy]*)(?=:? |$)|(\\\s|\S)+|[\w-]+)/gi;
    var format_begin_re = /(\[\[[!gbiuso]*;[^;]*;[^\]]*\])/i;
    var format_start_re = /^(\[\[[!gbiuso]*;[^;]*;[^\]]*\])/i;
    var format_last_re = /\[\[[!gbiuso]*;[^;]*;[^\]]*\]?$/i;
    var format_exec_re = /(\[\[(?:[^\]]|\\\])+\]\])/;
    var float_re = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
    var re_re = /^\/((?:\\\/|[^/]|\[[^\]]*\/[^\]]*\])+)\/([gimy]*)$/;
    /* eslint-enable */
    $.terminal = {
        version: '1.2.0',
        // colors from http://www.w3.org/wiki/CSS/Properties/color/keywords
        color_names: [
            'transparent', 'currentcolor', 'black', 'silver', 'gray', 'white',
            'maroon', 'red', 'purple', 'fuchsia', 'green', 'lime', 'olive',
            'yellow', 'navy', 'blue', 'teal', 'aqua', 'aliceblue',
            'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque',
            'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown',
            'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral',
            'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue',
            'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey',
            'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange',
            'darkorchid', 'darkred', 'darksalmon', 'darkseagreen',
            'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise',
            'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey',
            'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia',
            'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green',
            'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo',
            'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen',
            'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan',
            'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey',
            'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue',
            'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow',
            'lime', 'limegreen', 'linen', 'magenta', 'maroon',
            'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple',
            'mediumseagreen', 'mediumslateblue', 'mediumspringgreen',
            'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream',
            'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive',
            'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod',
            'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip',
            'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'red',
            'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown',
            'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue',
            'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan',
            'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat',
            'white', 'whitesmoke', 'yellow', 'yellowgreen'],
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
            if (typeof str === 'string') {
                var special = /([-\\^$[\]()+{}?*.|])/g;
                return str.replace(special, '\\$1');
            }
        },
        // ---------------------------------------------------------------------
        // :: test if string contain formatting
        // ---------------------------------------------------------------------
        have_formatting: function(str) {
            return typeof str === 'string' && !!str.match(format_exist_re);
        },
        is_formatting: function(str) {
            return typeof str === 'string' && !!str.match(format_full_re);
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
                } else if (semicolons === 2) {
                    semicolons = ';;';
                } else if (semicolons === 3) {
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
                return line.substring(j - 6, j) === '&nbsp;' ||
                    line.substring(j - 1, j) === ' ';
            }
            // Fix output if formatting not closed
            function fix_close() {
                var matched = output.match(format_re);
                if (matched) {
                    var last = matched[matched.length - 1];
                    if (last[last.length - 1] !== ']') {
                        prev_format = last.match(format_begin_re)[1];
                        output += ']';
                    } else if (output.match(format_last_re)) {
                        output = output.replace(format_last_re, '');
                        prev_format = last.match(format_begin_re)[1];
                    }
                }
            }
            for (var i = 0, len = array.length; i < len; ++i) {
                if (array[i] === '') {
                    result.push('');
                    continue;
                }
                var line = array[i];
                var first_index = 0;
                var count = 0;
                var output;
                var space = -1;
                for (var j = 0, jlen = line.length; j < jlen; ++j) {
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
                                throw new Error('Unclosed html entity in line ' +
                                                (i + 1) + ' at char ' + (j + 1));
                            }
                            j += m[1].length - 2; // because continue adds 1 to j
                            // if entity is at the end there is no next loop
                            // issue #77
                            if (j === jlen - 1) {
                                result.push(output + m[1]);
                            }
                            continue;
                        } else if (line[j] === ']' && line[j - 1] === '\\') {
                            // escape \] counts as one character
                            --count;
                        } else {
                            ++count;
                        }
                    }
                    if (is_space() && ((formatting && in_text) || !formatting ||
                                      (line[j] === '[' && line[j + 1] === '['))) {
                        space = j;
                    }
                    if ((count === length || j === jlen - 1) &&
                        ((formatting && in_text) || !formatting)) {
                        var text = $.terminal.strip(line.substring(space));
                        text = $('<span>' + text + '</span>').text();
                        var text_len = text.length;
                        text = text.substring(0, j + length + 1);
                        var can_break = !!text.match(/\s/) || j + length + 1 > text_len;
                        if (words && space !== -1 && j !== jlen - 1 && can_break) {
                            output = line.substring(first_index, space);
                            j = space - 1;
                        } else {
                            output = line.substring(first_index, j + 1);
                        }
                        if (words) {
                            output = output.replace(/(&nbsp;|\s)+$/g, '');
                        }
                        space = -1;
                        first_index = j + 1;
                        count = 0;
                        if (prev_format) {
                            output = prev_format + output;
                            if (output.match(']')) {
                                prev_format = '';
                            }
                        }
                        fix_close();
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
                // support for formating foo[[u;;]bar]baz[[b;#fff;]quux]zzz
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
                                // make focus to terminal textarea that will enable
                                // terminal when pressing tab and terminal is disabled
                                result += 'tabindex="1000" ';
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
        // ---------------------------------------------------------------------
        // :: Implmentation detail id is always length of terminals Cycle
        // ---------------------------------------------------------------------
        last_id: function() {
            var len = terminals.length();
            if (len) {
                return len - 1;
            }
        },
        // ---------------------------------------------------------------------
        // :: Function splits arguments and works with strings like
        // :: 'asd' 'asd\' asd' "asd asd" asd\ 123 -n -b / [^ ]+ / /\s+/ asd\ a
        // :: it creates a regex and numbers and replaces escape characters in
        // :: double quotes
        // ---------------------------------------------------------------------
        parse_arguments: function(string) {
            return $.map(string.match(command_re) || [], function(arg) {
                var regex = arg.match(re_re);
                if (regex) {
                    return new RegExp(regex[1], regex[2]);
                } else if (arg[0] === "'" && arg[arg.length - 1] === "'" &&
                           arg.length > 1) {
                    return arg.replace(/^'|'$/g, '');
                } else if (arg[0] === '"' && arg[arg.length - 1] === '"' &&
                           arg.length > 1) {
                    return $.parseJSON(arg);
                } else if (arg.match(/^-?[0-9]+$/)) {
                    return parseInt(arg, 10);
                } else if (arg.match(float_re)) {
                    return parseFloat(arg);
                } else if (arg.match(/^['"]$/)) {
                    return '';
                } else {
                    return arg.replace(/\\(['"() ])/g, '$1');
                }
            });
        },
        // ---------------------------------------------------------------------
        // :: Split arguments: it only strips single and double quotes and
        // :: escapes spaces
        // ---------------------------------------------------------------------
        split_arguments: function(string) {
            return $.map(string.match(command_re) || [], function(arg) {
                if (arg[0] === "'" && arg[arg.length - 1] === "'") {
                    return arg.replace(/^'|'$/g, '');
                } else if (arg[0] === '"' && arg[arg.length - 1] === '"') {
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
            } catch (e) {
                // error is process in exec
            }
        }
    };
    // -----------------------------------------------------------------------
    // Helper plugins and functions
    // -----------------------------------------------------------------------
    $.fn.visible = function() {
        return this.css('visibility', 'visible');
    };
    $.fn.hidden = function() {
        return this.css('visibility', 'hidden');
    };
    // -----------------------------------------------------------------------
    // :: hack to get scroll element if terminal attached to the body
    // :: is better then userAgent sniffing because other browsers beside
    // :: chrome may use body as scroll element instead of html like
    // :: IE and FireFox
    // -----------------------------------------------------------------------
    $.fn.scroll_element = function() {
        var defaults = $.fn.scroll_element.defaults;
        return this.map(function() {
            var $this = $(this);
            if ($this.is('body')) {
                var html = $('html');
                var body = $('body');
                var scrollTop = body.scrollTop() || html.scrollTop();
                var pre = $('<pre/>').css(defaults.pre).appendTo('body');
                pre.html(new Array(defaults.lines).join('\n'));
                $('body,html').scrollTop(10);
                var scroll_object;
                if (body.scrollTop() === 10) {
                    body.scrollTop(scrollTop);
                    scroll_object = body[0];
                } else if (html.scrollTop() === 10) {
                    html.scrollTop(scrollTop);
                    scroll_object = html[0];
                }
                pre.remove();
                return scroll_object;
            } else {
                return this;
            }
        });
    };
    $.fn.scroll_element.defaults = {
        lines: 2000,
        pre: {
            'font-size': '14px',
            'white-space': 'pre' // just in case if user overwrite css for pre tag
        }
    };
    function is_key_native() {
        if (!('KeyboardEvent' in window && 'key' in window.KeyboardEvent.prototype)) {
            return false;
        }
        var proto = window.KeyboardEvent.prototype;
        var get = Object.getOwnPropertyDescriptor(proto, 'key').get;
        return get.toString().match(/\[native code\]/);
    }
    // -----------------------------------------------------------------------
    function warn(msg) {
        if (console && console.warn) {
            console.warn(msg);
        } else {
            throw new Error('WARN: ' + msg);
        }
    }
    // -----------------------------------------------------------------------
    // JSON-RPC CALL
    // -----------------------------------------------------------------------
    var ids = {}; // list of url based ids of JSON-RPC
    $.jrpc = function(url, method, params, success, error) {
        var options;
        if ($.isPlainObject(url)) {
            options = url;
        } else {
            options = {
                url: url,
                method: method,
                params: params,
                success: success,
                error: error
            };
        }
        function validJSONRPC(response) {
            return (typeof response.id === 'number' &&
                    typeof response.result !== 'undefined') ||
                (options.method === 'system.describe' &&
                 response.name === 'DemoService' &&
                 typeof response.id !== 'undefined' &&
                 response.procs instanceof Array);
        }
        ids[options.url] = ids[options.url] || 0;
        var request = {
            'jsonrpc': '2.0',
            'method': options.method,
            'params': options.params,
            'id': ++ids[options.url]
        };
        return $.ajax({
            url: options.url,
            beforeSend: function(jxhr, settings) {
                if ($.isFunction(options.request)) {
                    options.request(jxhr, request);
                }
                settings.data = JSON.stringify(request);
            },
            success: function(response, status, jqXHR) {
                var content_type = jqXHR.getResponseHeader('Content-Type');
                if (!content_type.match(/(application|text)\/json/)) {
                    warn('Response Content-Type is neither application/json' +
                         ' nor text/json');
                }
                var json;
                try {
                    json = $.parseJSON(response);
                } catch (e) {
                    if (options.error) {
                        options.error(jqXHR, 'Invalid JSON', e);
                    } else {
                        throw new Error('Invalid JSON');
                    }
                    return;
                }
                if ($.isFunction(options.response)) {
                    options.response(jqXHR, json);
                }
                if (validJSONRPC(json)) {
                    // don't catch errors in success callback
                    options.success(json, status, jqXHR);
                } else if (options.error) {
                    options.error(jqXHR, 'Invalid JSON-RPC');
                } else {
                    throw new Error('Invalid JSON-RPC');
                }
            },
            error: options.error,
            contentType: 'application/json',
            dataType: 'text',
            async: true,
            cache: false,
            // timeout: 1,
            type: 'POST'
        });
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
        var result = Math.floor(terminal.find('iframe').width() / width);
        temp.remove();
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
    // :: try to copy given DOM element text to clipboard
    // -----------------------------------------------------------------------
    function text_to_clipboard(container, text) {
        var $div = $('<div>' + text.replace(/\n/, '<br/>') + '<div>');
        var range;
        container.append($div);
        if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText($div[0]);
            range.select();
        } else if (window.getSelection) {
            var selection = window.getSelection();
            if (selection.setBaseAndExtent) {
                selection.setBaseAndExtent($div[0], 0, $div[0], 1);
            } else if (document.createRange) {
                range = document.createRange();
                range.selectNodeContents($div[0]);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
        try {
            document.execCommand('copy');
        } catch (e) {}
        $div.remove();
    }
    // -----------------------------------------------------------------------
    // :: TERMINAL PLUGIN CODE
    // -----------------------------------------------------------------------
    var version_set = !$.terminal.version.match(/^\{\{/);
    var copyright = 'Copyright (c) 2011-2017 Jakub Jankiewicz <http://jcubic' +
        '.pl/me>';
    var version_string = version_set ? ' v. ' + $.terminal.version : ' ';
    // regex is for placing version string aligned to the right
    var reg = new RegExp(' {' + version_string.length + '}$');
    var name_ver = 'jQuery Terminal Emulator' +
        (version_set ? version_string : '');
    // -----------------------------------------------------------------------
    // :: Terminal Signatures
    // -----------------------------------------------------------------------
    var signatures = [
        ['jQuery Terminal', '(c) 2011-2017 jcubic'],
        [name_ver, copyright.replace(/^Copyright | *<.*>/g, '')],
        [name_ver, copyright.replace(/^Copyright /, '')],
        [
            '      _______                 ________                        __',
            '     / / _  /_ ____________ _/__  ___/______________  _____  / /',
            ' __ / / // / // / _  / _/ // / / / _  / _/     / /  \\/ / _ \\/ /',
            '/  / / // / // / ___/ // // / / / ___/ // / / / / /\\  / // / /__',
            '\\___/____ \\\\__/____/_/ \\__ / /_/____/_//_/_/_/ /_/  \\/\\__\\_\\___/',
            '         \\/          /____/                                   '
                .replace(reg, ' ') + version_string,
            copyright
        ],
        [
            '      __ _____                     ________                            ' +
                '  __',
            '     / // _  /__ __ _____ ___ __ _/__  ___/__ ___ ______ __ __  __ ___ ' +
                ' / /',
            ' __ / // // // // // _  // _// // / / // _  // _//     // //  \\/ // _ ' +
                '\\/ /',
            '/  / // // // // // ___// / / // / / // ___// / / / / // // /\\  // // ' +
                '/ /__',
            '\\___//____ \\\\___//____//_/ _\\_  / /_//____//_/ /_/ /_//_//_/ /_/ \\' +
                '__\\_\\___/',
            ('          \\/              /____/                                      ' +
             '    ').replace(reg, '') + version_string,
            copyright
        ]
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
        wrap: true,
        checkArity: true,
        raw: false,
        exceptionHandler: null,
        pauseEvents: true,
        memory: false,
        cancelableAjax: true,
        processArguments: true,
        linksNoReferrer: false,
        processRPCResponse: null,
        Token: true, // where this came from?
        convertLinks: true,
        extra: {},
        historyState: false,
        importHistory: false,
        echoCommand: true,
        scrollOnEcho: true,
        login: null,
        outputLimit: -1,
        formatters: [],
        onAjaxError: null,
        scrollBottomOffset: 20,
        wordAutocomplete: true,
        clickTimeout: 200,
        request: $.noop,
        response: $.noop,
        onRPCError: null,
        completion: false,
        historyFilter: null,
        softPause: false,
        onInit: $.noop,
        onClear: $.noop,
        onBlur: $.noop,
        onFocus: $.noop,
        onTerminalChange: $.noop,
        onExit: $.noop,
        onPush: $.noop,
        onPop: $.noop,
        keypress: $.noop,
        keydown: $.noop,
        strings: {
            comletionParameters: 'From version 1.0.0 completion function need to' +
                ' have two arguments',
            wrongPasswordTryAgain: 'Wrong password try again!',
            wrongPassword: 'Wrong password!',
            ajaxAbortError: 'Error while aborting ajax call!',
            wrongArity: "Wrong number of arguments. Function '%s' expects %s got" +
                ' %s!',
            commandNotFound: "Command '%s' Not Found!",
            oneRPCWithIgnore: 'You can use only one rpc with ignoreSystemDescr' +
                'ibe or rpc without system.describe',
            oneInterpreterFunction: "You can't use more than one function (rpc " +
                'without system.describe or with option ignoreSystemDescribe cou' +
                 'nts as one)',
            loginFunctionMissing: "You didn't specify a login function",
            noTokenError: 'Access denied (no token)',
            serverResponse: 'Server responded',
            wrongGreetings: 'Wrong value of greetings parameter',
            notWhileLogin: "You can't call `%s' function while in login",
            loginIsNotAFunction: 'Authenticate must be a function',
            canExitError: "You can't exit from main interpreter",
            invalidCompletion: 'Invalid completion',
            invalidSelector: 'Sorry, but terminal said that "%s" is not valid ' +
                'selector!',
            invalidTerminalId: 'Invalid Terminal ID',
            login: 'login',
            password: 'password',
            recursiveCall: 'Recursive call detected, skip',
            notAString: '%s function: argument is not a string',
            redrawError: 'Internal error, wrong position in cmd redraw'
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
    $.fn.terminal = function(init_interpreter, options) {
        function StorageHelper(memory) {
            if (memory) {
                this.storage = {};
            }
            this.set = function(key, value) {
                if (memory) {
                    this.storage[key] = value;
                } else {
                    $.Storage.set(key, value);
                }
            };
            this.get = function(key) {
                if (memory) {
                    return this.storage[key];
                } else {
                    return $.Storage.get(key);
                }
            };
            this.remove = function(key) {
                if (memory) {
                    delete this.storage[key];
                } else {
                    $.Storage.remove(key);
                }
            };
        }
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
                    return JSON.stringify(object);
                }).join(' '));
            } else if (typeof object === 'object') {
                self.echo(JSON.stringify(object));
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
                self.pause(settings.softPause);
                $.get(m[1], function(response) {
                    var prefix = location.href.replace(/[^/]+$/, '');
                    var file = m[1].replace(prefix, '');
                    self.echo('[[b;white;]' + file + ']');
                    var code = response.split('\n');
                    var n = +m[2] - 1;
                    self.echo(code.slice(n - 2, n + 3).map(function(line, i) {
                        if (i === 2) {
                            line = '[[;#f00;]' +
                                $.terminal.escape_brackets(line) + ']';
                        }
                        return '[' + (n + i) + ']: ' + line;
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
                self.pause(settings.softPause);
                $.jrpc({
                    url: url,
                    method: method,
                    params: params,
                    request: function(jxhr, request) {
                        try {
                            settings.request.apply(self, jxhr, request, self);
                        } catch (e) {
                            display_exception(e, 'USER');
                        }
                    },
                    response: function(jxhr, response) {
                        try {
                            settings.response.apply(self, jxhr, response, self);
                        } catch (e) {
                            display_exception(e, 'USER');
                        }
                    },
                    success: function(json) {
                        if (json.error) {
                            display_json_rpc_error(json.error);
                        } else if ($.isFunction(settings.processRPCResponse)) {
                            settings.processRPCResponse.call(self, json.result, self);
                        } else {
                            display_object(json.result);
                        }
                        self.resume();
                    },
                    error: ajax_error
                });
            };
            // this is the interpreter function
            return function(command, terminal) {
                if (command === '') {
                    return;
                }
                try {
                    command = get_processed_command(command);
                } catch (e) {
                    // exception can be thrown on invalid regex
                    display_exception(e, 'TERMINAL (get_processed_command)');
                    return;
                    // throw e; // this will show stack in other try..catch
                }
                if (!auth || command.name === 'help') {
                    // allows to call help without a token
                    interpreter(command.name, command.args);
                } else {
                    var token = terminal.token();
                    if (token) {
                        interpreter(command.name, [token].concat(command.args));
                    } else {
                        // should never happen
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
                // command = split_command_line(command);
                var command;
                try {
                    command = get_processed_command(user_command);
                } catch (e) {
                    // exception can be thrown on invalid regex
                    if ($.isFunction(settings.exception)) {
                        settings.exception(e, self);
                    } else {
                        self.error(e.toString());
                    }
                    return;
                    // throw e; // this will show stack in other try..catch
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
                        self.error('&#91;Arity&#93; ' +
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
                } else if ($.isFunction(fallback)) {
                    fallback(user_command, self);
                } else if ($.isFunction(settings.onCommandNotFound)) {
                    settings.onCommandNotFound.call(self, user_command, self);
                } else {
                    terminal.error(sprintf(strings.commandNotFound, command.name));
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
                           strings.serverResponse + ':\n' +
                           $.terminal.escape_brackets(xhr.responseText));
            }
        }
        // ---------------------------------------------------------------------
        function make_json_rpc_object(url, auth, success) {
            function jrpc_success(json) {
                if (json.error) {
                    display_json_rpc_error(json.error);
                } else if ($.isFunction(settings.processRPCResponse)) {
                    settings.processRPCResponse.call(self, json.result, self);
                } else {
                    display_object(json.result);
                }
                self.resume();
            }
            function jrpc_request(jxhr, request) {
                try {
                    settings.request.call(self, jxhr, request, self);
                } catch (e) {
                    display_exception(e, 'USER');
                }
            }
            function jrpc_response(jxhr, response) {
                try {
                    settings.response.call(self, jxhr, response, self);
                } catch (e) {
                    display_exception(e, 'USER');
                }
            }
            function response(ret) {
                if (ret.procs) {
                    var interpreter_object = {};
                    $.each(ret.procs, function(_, proc) {
                        interpreter_object[proc.name] = function() {
                            var append = auth && proc.name !== 'help';
                            var args = Array.prototype.slice.call(arguments);
                            var args_len = args.length + (append ? 1 : 0);
                            if (settings.checkArity && proc.params &&
                                proc.params.length !== args_len) {
                                self.error('&#91;Arity&#93; ' +
                                           sprintf(strings.wrongArity,
                                                   proc.name,
                                                   proc.params.length,
                                                   args_len));
                            } else {
                                self.pause(settings.softPause);
                                if (append) {
                                    var token = self.token(true);
                                    if (token) {
                                        args = [token].concat(args);
                                    } else {
                                        self.error('&#91;AUTH&#93; ' +
                                                   strings.noTokenError);
                                    }
                                }
                                $.jrpc({
                                    url: url,
                                    method: proc.name,
                                    params: args,
                                    request: jrpc_request,
                                    response: jrpc_response,
                                    success: jrpc_success,
                                    error: ajax_error
                                });
                            }
                        };
                    });
                    interpreter_object.help = interpreter_object.help || function(fn) {
                        if (typeof fn === 'undefined') {
                            var names = ret.procs.map(function(proc) {
                                return proc.name;
                            }).join(', ') + ', help';
                            self.echo('Available commands: ' + names);
                        } else {
                            var found = false;
                            $.each(ret.procs, function(_, proc) {
                                if (proc.name === fn) {
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
                                if (fn === 'help') {
                                    self.echo('[[bu;#fff;]help] [method]\ndisplay help ' +
                                              'for the method or list of methods if not' +
                                              ' specified');
                                } else {
                                    var msg = 'Method `' + fn + "' not found ";
                                    self.error(msg);
                                }
                            }
                        }
                    };
                    success(interpreter_object);
                } else {
                    success(null);
                }
            }
            return $.jrpc({
                url: url,
                method: 'system.describe',
                params: [],
                success: response,
                request: function(jxhr, request) {
                    try {
                        settings.request.call(self, jxhr, request, self);
                    } catch (e) {
                        display_exception(e, 'USER');
                    }
                },
                response: function(jxhr, response) {
                    try {
                        settings.response.call(self, jxhr, response, self);
                    } catch (e) {
                        display_exception(e, 'USER');
                    }
                },
                error: function() {
                    success(null);
                }
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
                            self.pause(settings.softPause);
                            if (settings.ignoreSystemDescribe) {
                                if (++rpc_count === 1) {
                                    fn_interpreter = make_basic_json_rpc(first, login);
                                } else {
                                    self.error(strings.oneRPCWithIgnore);
                                }
                                recur(rest, success);
                            } else {
                                make_json_rpc_object(first, login, function(new_obj) {
                                    if (new_obj) {
                                        $.extend(object, new_obj);
                                    } else if (++rpc_count === 1) {
                                        fn_interpreter = make_basic_json_rpc(
                                            first,
                                            login
                                        );
                                    } else {
                                        self.error(strings.oneRPCWithIgnore);
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
                                                             fn_interpreter.bind(self)),
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
                    self.pause(settings.softPause);
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
                    throw new Error(type + ' is invalid interpreter value');
                }
                // single function don't need bind
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
            return function(user, passwd, callback) {
                self.pause(settings.softPause);
                $.jrpc({
                    url: url,
                    method: method,
                    params: [user, passwd],
                    request: function(jxhr, request) {
                        try {
                            settings.request.call(self, jxhr, request, self);
                        } catch (e) {
                            display_exception(e, 'USER');
                        }
                    },
                    response: function(jxhr, response) {
                        try {
                            settings.response.call(self, jxhr, response, self);
                        } catch (e) {
                            display_exception(e, 'USER');
                        }
                    },
                    success: function(response) {
                        if (!response.error && response.result) {
                            callback(response.result);
                        } else {
                            // null will trigger message that login fail
                            callback(null);
                        }
                        self.resume();
                    },
                    error: ajax_error
                });
            };
            // default name is login so you can pass true
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
                settings.exceptionHandler.call(self, e, label);
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
            if (settings.convertLinks && !options.raw) {
                string = string.replace(email_re, '[[!;;]$1]').
                    replace(url_nf_re, '[[!;;]$1]');
            }
            var formatters = $.terminal.defaults.formatters;
            var i, len;
            if (!options.raw) {
                if (options.formatters) {
                    // format using user defined formatters
                    for (i = 0; i < formatters.length; ++i) {
                        try {
                            if (typeof formatters[i] === 'function') {
                                var ret = formatters[i](string);
                                if (typeof ret === 'string') {
                                    string = ret;
                                }
                            }
                        } catch (e) {
                            // display_exception(e, 'FORMATTING');
                            if ($.isFunction(settings.exceptionHandler)) {
                                settings.exceptionHandler.call(self, e, 'FORMATTERS');
                            } else {
                                alert('formatting error at formatters[' + i + ']\n' +
                                      (e.stack ? e.stack : e));
                            }
                        }
                    }
                }
                string = $.terminal.encode(string);
            }
            output_buffer.push(NEW_LINE);
            if (!options.raw && (string.length > num_chars ||
                                       string.match(/\n/)) &&
                ((settings.wrap === true && options.wrap === undefined) ||
                  settings.wrap === false && options.wrap === true)) {
                var words = options.keepWords;
                var array = $.terminal.split_equal(string, num_chars, words);
                for (i = 0, len = array.length; i < len; ++i) {
                    if (array[i] === '' || array[i] === '\r') {
                        output_buffer.push('<span></span>');
                    } else if (options.raw) {
                        output_buffer.push(array[i]);
                    } else {
                        output_buffer.push($.terminal.format(array[i], {
                            linksNoReferrer: settings.linksNoReferrer
                        }));
                    }
                }
            } else if (!options.raw) {
                string = $.terminal.format(string, {
                    linksNoReferrer: settings.linksNoReferrer
                });
                string.split(/\n/).forEach(function(string) {
                    output_buffer.push(string);
                });
            } else {
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
                var string = $.type(line) === 'function' ? line() : line;
                string = $.type(string) === 'string' ? string : String(string);
                if (string !== '') {
                    string = $.map(string.split(format_exec_re), function(string) {
                        if (string.match(format_exec_re) &&
                            !$.terminal.is_formatting(string)) {
                            // redraw should not execute commands and it have
                            // and lines variable have all extended commands
                            string = string.replace(/^\[\[|\]\]$/g, '');
                            if (line_settings.exec) {
                                if (prev_command && prev_command.command === string) {
                                    self.error(strings.recursiveCall);
                                } else {
                                    $.terminal.extended_command(self, string);
                                }
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
                }
            } catch (e) {
                output_buffer = [];
                // don't display exception if exception throw in terminal
                if ($.isFunction(settings.exceptionHandler)) {
                    settings.exceptionHandler.call(self, e, 'TERMINAL');
                } else {
                    alert('[Internal Exception(process_line)]:' +
                          exception_message(e) + '\n' + e.stack);
                }
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
                var limit;
                if (settings.outputLimit === 0) {
                    limit = self.rows();
                } else {
                    limit = settings.outputLimit;
                }
                lines_to_show = lines.slice(lines.length - limit - 1);
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
            } catch (e) {
                if ($.isFunction(settings.exceptionHandler)) {
                    settings.exceptionHandler.call(self, e, 'TERMINAL (redraw)');
                } else {
                    alert('Exception in redraw\n' + e.stack);
                }
            }
        }
        // ---------------------------------------------------------------------
        // :: Display user greetings or terminal signature
        // ---------------------------------------------------------------------
        function show_greetings() {
            if (settings.greetings === undefined) {
                // signature have ascii art so it's not suite for screen readers
                self.echo(self.signature, {finalize: a11y_hide});
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
            if (typeof command === 'undefined') {
                command = self.get_command();
            }
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
                    a11y_hide(div.addClass('command'));
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
                location.hash = '#' + JSON.stringify(hash_commands);
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
        var resume_callbacks = [];
        function commands(command, silent, exec) {
            // first command store state of the terminal before the command get
            // executed
            if (first_command) {
                first_command = false;
                // execHash need first empty command too
                if (settings.historyState || settings.execHash && exec) {
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
                    settings.onAfterCommand.call(self, self, command);
                }
            }
            try {
                // this callback can disable commands
                if ($.isFunction(settings.onBeforeCommand)) {
                    if (settings.onBeforeCommand.call(self, self, command) === false) {
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
                    if (level === 1 && self.get_token() || level > 1) {
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
                    var position = lines.length - 1;
                    // Call user interpreter function
                    var result = interpreter.interpreter.call(self, command, self);
                    if (result !== undefined) {
                        // auto pause/resume when user return promises
                        self.pause(settings.softPause);
                        return $.when(result).then(function(result) {
                            // don't echo result if user echo something
                            if (result && position === lines.length - 1) {
                                display_object(result);
                            }
                            after_exec();
                            self.resume();
                        });
                    } else if (paused) {
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
                    if (settings.onBeforeLogout.call(self, self) === false) {
                        return;
                    }
                } catch (e) {
                    display_exception(e, 'onBeforeLogout');
                }
            }
            clear_loging_storage();
            if ($.isFunction(settings.onAfterLogout)) {
                try {
                    settings.onAfterLogout.call(self, self);
                } catch (e) {
                    display_exception(e, 'onAfterlogout');
                }
            }
            self.login(settings.login, true, initialize);
        }
        // ---------------------------------------------------------------------
        function clear_loging_storage() {
            var name = self.prefix_name(true) + '_';
            storage.remove(name + 'token');
            storage.remove(name + 'login');
        }
        // ---------------------------------------------------------------------
        // :: Save the interpreter name for use with purge
        // ---------------------------------------------------------------------
        function maybe_append_name(interpreter_name) {
            var storage_key = self.prefix_name() + '_interpreters';
            var names = storage.get(storage_key);
            if (names) {
                names = $.parseJSON(names);
            } else {
                names = [];
            }
            if ($.inArray(interpreter_name, names) === -1) {
                names.push(interpreter_name);
                storage.set(storage_key, JSON.stringify(names));
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
                    interpreter.prompt.call(self, command, self);
                });
            } else {
                command_line.prompt(interpreter.prompt);
            }
            if ($.isPlainObject(interpreter.keymap)) {
                command_line.keymap($.omap(interpreter.keymap, function(name, fun) {
                    return function() {
                        var args = [].slice.call(arguments);
                        try {
                            return fun.apply(self, args);
                        } catch (e) {
                            display_exception(e, 'USER KEYMAP');
                            throw e;
                        }
                    };
                }));
            }
            command_line.set('');
            init_defer.resolve();
            if (!silent && $.isFunction(interpreter.onStart)) {
                interpreter.onStart.call(self, self);
            }
        }
        // ---------------------------------------------------------------------
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
                        restore_state(hash_commands[hash_commands.length - 1]);
                    } else if (save_state[0]) {
                        self.import_view(save_state[0]);
                    }
                } catch (e) {
                    display_exception(e, 'TERMINAL');
                }
            }
        }
        // ---------------------------------------------------------------------
        function initialize() {
            prepare_top_interpreter();
            show_greetings();
            if (lines.length) {
                redraw(); // for case when showing long error before init
            }
            // was_paused flag is workaround for case when user call exec before
            // login and pause in onInit, 3rd exec will have proper timing (will
            // execute after onInit resume)
            var was_paused = false;
            if ($.isFunction(settings.onInit)) {
                onPause = function() { // local in terminal
                    was_paused = true;
                };
                try {
                    settings.onInit.call(self, self);
                } catch (e) {
                    display_exception(e, 'OnInit');
                    // throw e; // it will be catched by terminal
                } finally {
                    onPause = $.noop;
                    if (!was_paused && self.enabled()) {
                        // resume login if user didn't call pause in onInit
                        // if user pause in onInit wait with exec until it
                        // resume
                        self.resume();
                    }
                }
            }
            if (first_instance) {
                first_instance = false;
                $(window).on('hashchange', hashchange);
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
        function user_key_down(e) {
            var result, top = interpreters.top();
            if ($.isFunction(top.keydown)) {
                result = top.keydown.call(self, e, self);
                if (result !== undefined) {
                    return result;
                }
            } else if ($.isFunction(settings.keydown)) {
                result = settings.keydown.call(self, e, self);
                if (result !== undefined) {
                    return result;
                }
            }
        }
        var keymap = {
            'CTRL+D': function(e, original) {
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
                        original();
                    }
                }
                return false;
            },
            'CTRL+L': function() {
                self.clear();
            },
            'TAB': function(e, orignal) {
                // TODO: move this to cmd plugin
                //       add completion = array | function
                //       !!! Problem complete more then one key need terminal
                var top = interpreters.top(), completion;
                if (settings.completion &&
                    $.type(settings.completion) !== 'boolean' &&
                    top.completion === undefined) {
                    completion = settings.completion;
                } else {
                    completion = top.completion;
                }
                if (completion === 'settings') {
                    completion = settings.completion;
                }
                if (completion) {
                    switch ($.type(completion)) {
                        case 'function':
                            var string = self.before_cursor(settings.wordAutocomplete);
                            if (completion.length === 3) {
                                var error = new Error(strings.comletionParameters);
                                display_exception(error, 'USER');
                                return false;
                            }
                            completion.call(self, string, function(commands) {
                                self.complete(commands, {
                                    echo: true
                                });
                            });
                            break;
                        case 'array':
                            self.complete(completion, {
                                echo: true
                            });
                            break;
                        default:
                            // terminal will not catch this because it's an event
                            throw new Error(strings.invalidCompletion);
                    }
                } else {
                    orignal();
                }
                return false;
            },
            'CTRL+V': function(e, original) {
                original(e);
                self.oneTime(200, function() {
                    scroll_to_bottom();
                });
                return true;
            },
            'CTRL+TAB': function() {
                if (terminals.length() > 1) {
                    self.focus(false);
                    return false;
                }
            },
            'PAGEDOWN': function() {
                self.scroll(self.height());
            },
            'PAGEUP': function() {
                self.scroll(-self.height());
            }
        };
        function key_down(e) {
            // Prevent to be executed by cmd: CTRL+D, TAB, CTRL+TAB (if more
            // then one terminal)
            var result, i;
            if (self.enabled()) {
                if (!self.paused()) {
                    result = user_key_down(e);
                    if (result !== undefined) {
                        return result;
                    }
                    if (e.which !== 9) { // not a TAB
                        tab_count = 0;
                    }
                    self.attr({scrollTop: self.attr('scrollHeight')});
                } else {
                    if (!settings.pauseEvents) {
                        result = user_key_down(e);
                        if (result !== undefined) {
                            return result;
                        }
                    }
                    if (e.which === 68 && e.ctrlKey) { // CTRL+D (if paused)
                        if (settings.pauseEvents) {
                            result = user_key_down(e);
                            if (result !== undefined) {
                                return result;
                            }
                        }
                        if (requests.length) {
                            for (i = requests.length; i--;) {
                                var r = requests[i];
                                if (r.readyState !== 4) {
                                    try {
                                        r.abort();
                                    } catch (error) {
                                        if ($.isFunction(settings.exceptionHandler)) {
                                            settings.exceptionHandler.call(self,
                                                                           e,
                                                                           'AJAX ABORT');
                                        } else {
                                            self.error(strings.ajaxAbortError);
                                        }
                                    }
                                }
                            }
                            requests = [];
                        }
                        self.resume();
                    }
                    return false;
                }
            }
        }
        function ready(defer) {
            return function(fun) {
                if (defer.state() !== 'resolved') {
                    defer.then(fun.bind(self));
                } else {
                    fun.call(self);
                }
            };
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
        // var names = []; // stack if interpreter names
        var scroll_object;
        var prev_command; // used for name on the terminal if not defined
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
        var command; // for tab completion
        var logins = new Stack(); // stack of logins
        var command_defer = $.Deferred();
        var init_defer = $.Deferred();
        var when_ready = ready(init_defer);
        var cmd_ready = ready(command_defer);
        var in_login = false;// some Methods should not be called when login
        // TODO: Try to use mutex like counter for pause/resume
        var onPause = $.noop;// used to indicate that user call pause onInit
        var old_width, old_height;
        var delayed_commands = []; // used when exec commands while paused
        var settings = $.extend({},
                                $.terminal.defaults,
                                {name: self.selector},
                                options || {});
        var storage = new StorageHelper(settings.memory);
        var strings = $.extend({}, $.terminal.defaults.strings, settings.strings);
        var enabled = settings.enabled, frozen = false;
        var paused = false;
        var autologin = true; // set to false of onBeforeLogin return false
        var interpreters;
        var command_line;
        var old_enabled;
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
                    settings.onClear.call(self, self);
                } catch (e) {
                    display_exception(e, 'onClear');
                }
                self.attr({scrollTop: 0});
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
                        user_export = settings.onExport.call(self);
                    } catch (e) {
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
                    interpreters: interpreters.clone(),
                    history: command_line.history().data
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
                        settings.onImport.call(self, view);
                    } catch (e) {
                        display_exception(e, 'onImport');
                    }
                }
                when_ready(function ready() {
                    self.set_prompt(view.prompt);
                    self.set_command(view.command);
                    command_line.position(view.position);
                    command_line.mask(view.mask);
                    if (view.focus) {
                        self.focus();
                    }
                    lines = clone(view.lines);
                    interpreters = view.interpreters;
                    if (settings.importHistory) {
                        command_line.history().set(view.history);
                    }
                    redraw();
                });
                return self;
            },
            // -------------------------------------------------------------
            // :: Store current terminal state
            // -------------------------------------------------------------
            save_state: function(command, ignore_hash, index) {
                // save_state.push({view:self.export_view(), join:[]});
                if (typeof index !== 'undefined') {
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
                        save_state.length - 1,
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
                cmd_ready(function ready() {
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
                });
                // while testing it didn't executed last exec when using this
                // for resolved deferred
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
                if (self.token() && self.level() === 1 && !autologin) {
                    in_login = false; // logout will call login
                    self.logout(true);
                } else if (self.token(true) && self.login_name(true)) {
                    in_login = false;
                    if ($.isFunction(success)) {
                        success();
                    }
                    return self;
                }
                // don't store login data in history
                if (settings.history) {
                    command_line.history().disable();
                }
                // so we know how many times call pop
                var level = self.level();
                function login_callback(user, token, silent) {
                    if (token) {
                        while (self.level() > level) {
                            self.pop(undefined, true);
                        }
                        if (settings.history) {
                            command_line.history().enable();
                        }
                        var name = self.prefix_name(true) + '_';
                        storage.set(name + 'token', token);
                        storage.set(name + 'login', user);
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
                            self.pop(undefined, true).set_mask(false);
                        } else {
                            in_login = false;
                            if (!silent) {
                                self.error(strings.wrongPassword);
                            }
                            self.pop(undefined, true).pop(undefined, true);
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
                        } catch (e) {
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
            // :: Get string before cursor
            // -------------------------------------------------------------
            before_cursor: function(word) {
                var pos = command_line.position();
                var command = command_line.get().substring(0, pos);
                var cmd_strings = command.split(' ');
                var string; // string before cursor that will be completed
                if (word) {
                    if (cmd_strings.length === 1) {
                        string = cmd_strings[0];
                    } else {
                        var m = command.match(/(\\?")/g);
                        var double_quotes = m ? m.filter(function(chr) {
                            return !chr.match(/^\\/);
                        }).length : 0;
                        m = command.match(/'/g);
                        var single_quote = m ? m.length : 0;
                        if (single_quote % 2 === 1) {
                            string = command.match(/('[^']*)$/)[0];
                        } else if (double_quotes % 2 === 1) {
                            string = command.match(/("(?:[^"]|\\")*)$/)[0];
                        } else {
                            string = cmd_strings[cmd_strings.length - 1];
                            for (i = cmd_strings.length - 1; i > 0; i--) {
                                // treat escape space as part of the string
                                var prev_string = cmd_strings[i - 1];
                                if (prev_string[prev_string.length - 1] === '\\') {
                                    string = cmd_strings[i - 1] + ' ' + string;
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    string = command;
                }
                return string;
            },
            // -------------------------------------------------------------
            // :: complete word or command based on array of words
            // -------------------------------------------------------------
            complete: function(commands, options) {
                options = $.extend({
                    word: true,
                    echo: false
                }, options || {});
                // cursor can be in the middle of the command
                // so we need to get the text before the cursor
                var string = self.before_cursor(options.word).replace(/\\"/g, '"');
                var quote = false;
                if (string.match(/^"/)) {
                    quote = '"';
                } else if (string.match(/^'/)) {
                    quote = "'";
                }
                if (quote) {
                    string = string.replace(/^["']/, '');
                }
                // local copy
                commands = commands.slice();
                if (settings.clear && $.inArray('clear', commands) === -1) {
                    commands.push('clear');
                }
                if (settings.exit && $.inArray('exit', commands) === -1) {
                    commands.push('exit');
                }
                if (tab_count % 2 === 0) {
                    command = self.before_cursor(options.word);
                } else {
                    var test = self.before_cursor(options.word);
                    if (test !== command) {
                        // command line changed between TABS - ignore
                        return;
                    }
                }
                var safe = $.terminal.escape_regex(string)
                    .replace(/\\(["'() ])/g, '\\?$1');
                var regex = new RegExp('^' + safe);
                var matched = [];
                for (var i = commands.length; i--;) {
                    if (regex.test(commands[i])) {
                        var match = commands[i];
                        if (quote === '"') {
                            match = match.replace(/"/g, '\\"');
                        }
                        if (!quote) {
                            match = match.replace(/(["'() ])/g, '\\$1');
                        }
                        matched.push(match);
                    }
                }
                if (matched.length === 1) {
                    self.insert(matched[0].replace(regex, '') + (quote || ''));
                    command = self.before_cursor(options.word);
                    return true;
                } else if (matched.length > 1) {
                    if (++tab_count >= 2) {
                        tab_count = 0;
                        if (options.echo) {
                            echo_command();
                            var text = matched.reverse().join('\t');
                            self.echo($.terminal.escape_brackets(text), {
                                keepWords: true
                            });
                            return true;
                        }
                    } else {
                        var found = false;
                        var j;
                        loop:
                        for (j = string.length; j < matched[0].length; ++j) {
                            for (i = 1; i < matched.length; ++i) {
                                if (matched[0].charAt(j) !== matched[i].charAt(j)) {
                                    break loop;
                                }
                            }
                            found = true;
                        }
                        if (found) {
                            self.insert(matched[0].slice(0, j).replace(regex, ''));
                            command = self.before_cursor(options.word);
                            return true;
                        }
                    }
                }
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
            set_interpreter: function(user_intrp, login) {
                function overwrite_interpreter() {
                    self.pause(settings.softPause);
                    make_interpreter(user_intrp, !!login, function(result) {
                        self.resume();
                        var top = interpreters.top();
                        $.extend(top, result);
                        prepare_top_interpreter(true);
                    });
                }
                if ($.type(user_intrp) === 'string' && login) {
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
                cmd_ready(function ready() {
                    onPause();
                    paused = true;
                    command_line.disable();
                    if (!visible) {
                        command_line.hidden();
                    }
                    if ($.isFunction(settings.onPause)) {
                        settings.onPause.call(self);
                    }
                });
                return self;
            },
            // -------------------------------------------------------------
            // :: Resume the previously paused terminal
            // -------------------------------------------------------------
            resume: function() {
                cmd_ready(function ready() {
                    paused = false;
                    if (terminals.front() === self) {
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
                        settings.onResume.call(self);
                    }
                });
                return self;
            },
            // -------------------------------------------------------------
            // :: Return the number of characters that fit into the width of
            // :: the terminal
            // -------------------------------------------------------------
            cols: function() {
                return settings.numChars ? settings.numChars : get_num_chars(self);
            },
            // -------------------------------------------------------------
            // :: Return the number of lines that fit into the height of the
            // :: terminal
            // -------------------------------------------------------------
            rows: function() {
                return settings.numRows ? settings.numRows : get_num_rows(self);
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
                function run() {
                    settings.historyState = true;
                    if (!save_state.length) {
                        self.save_state();
                    } else if (terminals.length() > 1) {
                        self.save_state(null);
                    }
                }
                if (toggle) {
                    // if set to true and if set from user command we need
                    // not to include the command
                    if (typeof window.setImmediate === 'undefined') {
                        setTimeout(run, 0);
                    } else {
                        setImmediate(run);
                    }
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
                return self;
            },
            // -------------------------------------------------------------
            // :: Switch to the next terminal
            // -------------------------------------------------------------
            next: function() {
                if (terminals.length() === 1) {
                    return self;
                } else {
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
                        settings.onTerminalChange.call(next, next);
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
                cmd_ready(function ready() {
                    var ret;
                    if (terminals.length() === 1) {
                        if (toggle === false) {
                            try {
                                ret = settings.onBlur.call(self, self);
                                if (!silent && ret !== false || silent) {
                                    self.disable();
                                }
                            } catch (e) {
                                display_exception(e, 'onBlur');
                            }
                        } else {
                            try {
                                ret = settings.onFocus.call(self, self);
                                if (!silent && ret !== false || silent) {
                                    self.enable();
                                }
                            } catch (e) {
                                display_exception(e, 'onFocus');
                            }
                        }
                    } else if (toggle === false) {
                        self.next();
                    } else {
                        var front = terminals.front();
                        if (front !== self) {
                            front.disable();
                            if (!silent) {
                                try {
                                    settings.onTerminalChange.call(self, self);
                                } catch (e) {
                                    display_exception(e, 'onTerminalChange');
                                }
                            }
                        }
                        terminals.set(self);
                        self.enable();
                    }
                });
                return self;
            },
            // -------------------------------------------------------------
            // :: Disable/Enable terminal that can be enabled by click
            // -------------------------------------------------------------
            freeze: function(freeze) {
                when_ready(function ready() {
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
                        // enabling first time
                        self.resize();
                    }
                    cmd_ready(function ready() {
                        if (!self.paused()) {
                            command_line.enable();
                        }
                        enabled = true;
                    });
                }
                return self;
            },
            // -------------------------------------------------------------
            // :: Disable the terminal
            // -------------------------------------------------------------
            disable: function() {
                cmd_ready(function ready() {
                    enabled = false;
                    command_line.disable();
                });
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
                var i;
                if (cols < 15) {
                    i = null;
                } else if (cols < 35) {
                    i = 0;
                } else if (cols < 55) {
                    i = 1;
                } else if (cols < 64) {
                    i = 2;
                } else if (cols < 75) {
                    i = 3;
                } else {
                    i = 4;
                }
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
                when_ready(function ready() {
                    command_line.set(command);
                });
                return self;
            },
            // -------------------------------------------------------------
            // :: Insert text into the command line after the cursor
            // -------------------------------------------------------------
            insert: function(string, stay) {
                if (typeof string === 'string') {
                    when_ready(function ready() {
                        var bottom = self.is_bottom();
                        command_line.insert(string, stay);
                        if (settings.scrollOnEcho || bottom) {
                            scroll_to_bottom();
                        }
                    });
                    return self;
                } else {
                    throw new Error(sprintf(strings.notAString, 'insert'));
                }
            },
            // -------------------------------------------------------------
            // :: Set the prompt of the command line
            // -------------------------------------------------------------
            set_prompt: function(prompt) {
                when_ready(function ready() {
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
                // return command_line.prompt();
            },
            // -------------------------------------------------------------
            // :: Enable or Disable mask depedning on the passed argument
            // :: the mask can also be character (in fact it will work with
            // :: strings longer then one)
            // -------------------------------------------------------------
            set_mask: function(mask) {
                when_ready(function ready() {
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
                            settings.onResize.call(self, self);
                        }
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
                    var bottom = self.is_bottom();
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
                                   // user_finalize need to be save in line object
                                   user_finalize(wrapper);
                                   });*/
                            } catch (e) {
                                display_exception(e, 'USER:echo(finalize)');
                            }
                        } else {
                            $('<div/>').html(line)
                                .appendTo(wrapper).width('100%');
                        }
                    });
                    if (settings.outputLimit >= 0) {
                        var limit;
                        if (settings.outputLimit === 0) {
                            limit = self.rows();
                        } else {
                            limit = settings.outputLimit;
                        }
                        var $lines = output.find('div div');
                        if ($lines.length > limit) {
                            var max = $lines.length - limit + 1;
                            var for_remove = $lines.slice(0, max);
                            // you can't get parent if you remove the
                            // element so we first get the parent
                            var parents = for_remove.parent();
                            for_remove.remove();
                            parents.each(function() {
                                var $self = $(this);
                                if ($self.is(':empty')) {
                                    // there can be divs inside parent that
                                    // was not removed
                                    $self.remove();
                                }
                            });
                        }
                    }
                    num_rows = get_num_rows(self);
                    if (settings.scrollOnEcho || bottom) {
                        scroll_to_bottom();
                    }
                    output_buffer = [];
                } catch (e) {
                    if ($.isFunction(settings.exceptionHandler)) {
                        settings.exceptionHandler.call(self, e, 'TERMINAL (Flush)');
                    } else {
                        alert('[Flush] ' + exception_message(e) + '\n' +
                              e.stack);
                    }
                }
                return self;
            },
            // -------------------------------------------------------------
            // :: Update the output line - line number can be negative
            // -------------------------------------------------------------
            update: function(line, string) {
                when_ready(function ready() {
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
                return lines.length - 1;
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
                function echo(string) {
                    try {
                        var locals = $.extend({
                            flush: true,
                            raw: settings.raw,
                            finalize: $.noop,
                            keepWords: false,
                            formatters: true
                        }, options || {});
                        if (locals.raw) {
                            (function(finalize) {
                                locals.finalize = function(div) {
                                    div.addClass('raw');
                                    finalize(div);
                                };
                            })(locals.finalize);
                        }
                        if (locals.flush) {
                            // flush buffer if there was no flush after previous echo
                            if (output_buffer.length) {
                                self.flush();
                            }
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
                        if ($.isFunction(settings.exceptionHandler)) {
                            settings.exceptionHandler.call(self, e, 'TERMINAL (echo)');
                        } else {
                            alert('[Terminal.echo] ' + exception_message(e) +
                              '\n' + e.stack);
                        }
                    }
                }
                string = string || '';
                var type = $.type(string);
                if (type === 'function' || type === 'string') {
                    echo(string);
                } else {
                    $.when(string).then(echo);
                }
                return self;
            },
            // -------------------------------------------------------------
            // :: echo red text
            // -------------------------------------------------------------
            error: function(message, options) {
                options = $.extend({}, options, {raw: false, formatters: false});
                // quick hack to fix trailing backslash
                var str = $.terminal.escape_brackets(message).
                    replace(/\\$/, '&#92;').
                    replace(url_re, ']$1[[;;;error]');
                return self.echo('[[;;;error]' + str + ']', options);
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
                        },
                        keepWords: true
                    });
                }
                if (typeof e.fileName === 'string') {
                    // display filename and line which throw exeption
                    self.pause(settings.softPause);
                    $.get(e.fileName, function(file) {
                        var num = e.lineNumber - 1;
                        var line = file.split('\n')[num];
                        if (line) {
                            self.error('[' + e.lineNumber + ']: ' + line);
                        }
                        self.resume();
                    }, 'text');
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
                        },
                        formatters: false
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
                when_ready(function ready() {
                    if (local) {
                        var login = logins.pop();
                        self.set_token(undefined, true);
                        self.login.apply(self, login);
                    } else if (interpreters.size() === 1 && self.token()) {
                        self.logout(true);
                    } else {
                        while (interpreters.size() > 1) {
                            // pop will call global_logout that will call login
                            // and size will be > 0; this is workaround the problem
                            if (self.token()) {
                                self.logout(true).pop().pop();
                            } else {
                                self.pop();
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
                return storage.get(self.prefix_name(local) + '_token');
            },
            // -------------------------------------------------------------
            // :: Function sets the token to the supplied value. This function
            // :: works regardless of wherer settings.login is supplied
            // -------------------------------------------------------------
            set_token: function(token, local) {
                var name = self.prefix_name(local) + '_token';
                if (typeof token === 'undefined') {
                    storage.remove(name, token);
                } else {
                    storage.set(name, token);
                }
                return self;
            },
            // -------------------------------------------------------------
            // :: Function get the token either set by the login method or
            // :: by the set_token method.
            // -------------------------------------------------------------
            get_token: function(local) {
                return self.token(local);
            },
            // -------------------------------------------------------------
            // :: Function return Login name entered by the user
            // -------------------------------------------------------------
            login_name: function(local) {
                return storage.get(self.prefix_name(local) + '_login');
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
                var name = (settings.name ? settings.name + '_' : '') +
                    terminal_id;
                if (local && interpreters.size() > 1) {
                    var local_name = interpreters.map(function(intrp) {
                        return intrp.name || '';
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
                cmd_ready(function ready() {
                    options = options || {};
                    var defaults = {
                        infiniteLogin: false
                    };
                    var push_settings = $.extend({}, defaults, options);
                    if (!push_settings.name && prev_command) {
                        // push is called in login
                        push_settings.name = prev_command.name;
                    }
                    if (push_settings.prompt === undefined) {
                        push_settings.prompt = (push_settings.name || '>') + ' ';
                    }
                    // names.push(options.name);
                    var top = interpreters.top();
                    if (top) {
                        top.mask = command_line.mask();
                    }
                    var was_paused = paused;
                    function init() {
                        settings.onPush.call(self, top, interpreters.top(), self);
                        prepare_top_interpreter();
                    }
                    // self.pause();
                    make_interpreter(interpreter, !!options.login, function(ret) {
                        // result is object with interpreter and completion properties
                        interpreters.push($.extend({}, ret, push_settings));
                        if (push_settings.completion === true) {
                            if ($.isArray(ret.completion)) {
                                interpreters.top().completion = ret.completion;
                            } else if (!ret.completion) {
                                interpreters.top().completion = false;
                            }
                        }
                        if (push_settings.login) {
                            var error;
                            var type = $.type(push_settings.login);
                            if (type === 'function') {
                                error = push_settings.infiniteLogin ? $.noop : self.pop;
                                self.login(push_settings.login,
                                           push_settings.infiniteLogin,
                                           init,
                                           error);
                            } else if ($.type(interpreter) === 'string' &&
                                       type === 'string' || type === 'boolean') {
                                error = push_settings.infiniteLogin ? $.noop : self.pop;
                                self.login(make_json_rpc_login(interpreter,
                                                               push_settings.login),
                                           push_settings.infiniteLogin,
                                           init,
                                           error);
                            }
                        } else {
                            init();
                        }
                        if (!was_paused && self.enabled()) {
                            self.resume();
                        }
                    });
                });
                return self;
            },
            // -------------------------------------------------------------
            // :: Remove the last interpreter from the Stack
            // -------------------------------------------------------------
            pop: function(string, silent) {
                if (string !== undefined) {
                    echo_command(string);
                }
                var token = self.token(true);
                var top;
                if (interpreters.size() === 1) {
                    top = interpreters.top();
                    if (settings.login) {
                        global_logout();
                        if ($.isFunction(settings.onExit)) {
                            try {
                                settings.onExit.call(self, self);
                            } catch (e) {
                                display_exception(e, 'onExit');
                            }
                        }
                    } else {
                        self.error(strings.canExitError);
                    }
                    if (!silent) {
                        settings.onPop.call(self, top, null, self);
                    }
                } else {
                    if (token) {
                        clear_loging_storage();
                    }
                    var current = interpreters.pop();
                    top = interpreters.top();
                    prepare_top_interpreter();
                    if (!silent) {
                        settings.onPop.call(self, current, top);
                    }
                    // we check in case if you don't pop from password interpreter
                    if (in_login && self.get_prompt() !== strings.login + ': ') {
                        in_login = false;
                    }
                    if ($.isFunction(current.onExit)) {
                        try {
                            current.onExit.call(self, self);
                        } catch (e) {
                            display_exception(e, 'onExit');
                        }
                    }
                    // restore mask
                    self.set_mask(top.mask);
                }
                return self;
            },
            // -------------------------------------------------------------
            // :: Change terminal option(s) at runtime
            // -------------------------------------------------------------
            option: function(object_or_name, value) {
                if (typeof value === 'undefined') {
                    if (typeof object_or_name === 'string') {
                        return settings[object_or_name];
                    } else if (typeof object_or_name === 'object') {
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
                when_ready(function ready() {
                    self.clear();
                    while (interpreters.size() > 1) {
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
                when_ready(function ready() {
                    var prefix = self.prefix_name() + '_';
                    var names = storage.get(prefix + 'interpreters');
                    if (names) {
                        $.each($.parseJSON(names), function(_, name) {
                            storage.remove(name + '_commands');
                            storage.remove(name + '_token');
                            storage.remove(name + '_login');
                        });
                    }
                    command_line.purge();
                    storage.remove(prefix + 'interpreters');
                });
                return self;
            },
            // -------------------------------------------------------------
            // :: Remove all events and DOM nodes left by terminal, it will
            // :: not purge the terminal so you will have the same state
            // :: when you refresh the browser
            // -------------------------------------------------------------
            destroy: function() {
                when_ready(function ready() {
                    command_line.destroy().remove();
                    output.remove();
                    wrapper.remove();
                    $(document).unbind('.terminal_' + self.id());
                    $(window).unbind('.terminal_' + self.id());
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
                    iframe.remove();
                    terminals.remove(terminal_id);
                    if (!terminals.length()) {
                        $(window).off('hashchange');
                    }
                });
                return self;
            },
            // -------------------------------------------------------------
            scroll_to_bottom: scroll_to_bottom,
            // -------------------------------------------------------------
            // :: return true if terminal div or body is at the bottom
            // :: is use scrollBottomOffset option as margin for the check
            // -------------------------------------------------------------
            is_bottom: function() {
                if (settings.scrollBottomOffset === -1) {
                    return false;
                } else {
                    var scroll_height, scroll_top, height;
                    if (self.is('body')) {
                        scroll_height = $(document).height();
                        scroll_top = $(window).scrollTop();
                        height = window.innerHeight;
                    } else {
                        scroll_height = scroll_object[0].scrollHeight;
                        scroll_top = scroll_object.scrollTop();
                        height = scroll_object.outerHeight();
                    }
                    var limit = scroll_height - settings.scrollBottomOffset;
                    return scroll_top + height > limit;
                }
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
        // INIT CODE
        // -----------------------------------------------------------------
        if (settings.width) {
            self.width(settings.width);
        }
        if (settings.height) {
            self.height(settings.height);
        }
        scroll_object = self.scroll_element();
        // register ajaxSend for cancel requests on CTRL+D
        $(document).bind('ajaxSend.terminal_' + self.id(), function(e, xhr) {
            requests.push(xhr);
        });
        var wrapper = $('<div class="terminal-wrapper"/>').appendTo(self);
        var iframe = $('<iframe/>').appendTo(wrapper);
        output = $('<div>').addClass('terminal-output').attr('role', 'log')
            .appendTo(wrapper);
        self.addClass('terminal');
        // before login event
        if (settings.login && $.isFunction(settings.onBeforeLogin)) {
            try {
                if (settings.onBeforeLogin.call(self, self) === false) {
                    autologin = false;
                }
            } catch (e) {
                display_exception(e, 'onBeforeLogin');
                throw e;
            }
        }
        // create json-rpc authentication function
        var base_interpreter;
        if (typeof init_interpreter === 'string') {
            base_interpreter = init_interpreter;
        } else if (init_interpreter instanceof Array) {
            // first JSON-RPC
            for (var i = 0, len = init_interpreter.length; i < len; ++i) {
                if (typeof init_interpreter[i] === 'string') {
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
        self.on('focus.terminal', 'textarea', function(e, skip) {
            if (!enabled && !skip) {
                self.enable();
            }
        });
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
            if (settings.completion && typeof settings.completion !== 'boolean' ||
                !settings.completion) {
                // overwrite interpreter completion by global setting #224
                // we use string to indicate that it need to be taken from settings
                // so we are able to change it using option API method
                itrp.completion = 'settings';
            }
            var new_keymap = $.extend({}, keymap, settings.keymap || {});
            interpreters = new Stack($.extend({}, settings.extra, {
                name: settings.name,
                prompt: settings.prompt,
                keypress: settings.keypress,
                keydown: settings.keydown,
                resize: settings.onResize,
                greetings: settings.greetings,
                mousewheel: settings.mousewheel,
                keymap: new_keymap
            }, itrp));
            // CREATE COMMAND LINE
            command_line = $('<div/>').appendTo(wrapper).cmd({
                prompt: settings.prompt,
                history: settings.memory ? 'memory' : settings.history,
                historyFilter: settings.historyFilter,
                historySize: settings.historySize,
                width: '100%',
                enabled: enabled && !is_touch,
                keydown: key_down,
                keymap: new_keymap,
                clickTimeout: settings.clickTimeout,
                keypress: function(e) {
                    var top = interpreters.top();
                    if ($.isFunction(top.keypress)) {
                        return top.keypress.call(self, e, self);
                    } else if ($.isFunction(settings.keypress)) {
                        return settings.keypress.call(self, e, self);
                    }
                },
                onCommandChange: function(command) {
                    if ($.isFunction(settings.onCommandChange)) {
                        try {
                            settings.onCommandChange.call(self, command, self);
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
                        settings.onBlur.call(self, self) !== false) {
                        self.disable();
                    }
                }
                $(document).bind('click.terminal_' + self.id(), disable).
                    bind('contextmenu.terminal_' + self.id(), disable);
            });
            var $win = $(window);
            if (!is_touch) {
                // work weird on mobile
                $win.on('focus.terminal_' + self.id(), focus_terminal).
                    on('blur.terminal_' + self.id(), blur_terminal);
            } else {
                /*
                self.find('textarea').on('blur.terminal', function() {
                    if (enabled) {
                        self.focus(false);
                    }
                });*/
            }
            if (is_touch) {
                self.click(function() {
                    if (!self.enabled() && !frozen) {
                        self.focus();
                        command_line.enable();
                    } else {
                        self.focus(false);
                    }
                });
            } else {
                // detect mouse drag
                (function() {
                    var count = 0;
                    var isDragging = false;
                    var target;
                    self.mousedown(function(e) {
                        var parents = $(e.target).parents();
                        if (parents.addBack) {
                            target = parents.addBack();
                        } else {
                            target = parents.andSelf();
                        }
                        self.oneTime(1, function() {
                            $(window).on('mousemove.terminal_' + self.id(), function() {
                                isDragging = true;
                                count = 0;
                                $(window).off('mousemove.terminal_' + self.id());
                            });
                        });
                    }).mouseup(function() {
                        var wasDragging = isDragging;
                        isDragging = false;
                        $(window).off('mousemove.terminal_' + self.id());
                        if (!wasDragging) {
                            if (++count === 1) {
                                if (!self.enabled() && !frozen) {
                                    self.focus();
                                    command_line.enable();
                                    count = 0;
                                } else {
                                    var name = 'click_' + self.id();
                                    self.oneTime(settings.clickTimeout, name, function() {
                                        // move cursor to the end if clicked after .cmd
                                        if (!target.is('.terminal-output') &&
                                            !target.is('.cmd') &&
                                            target.is('.terminal > div')) {
                                            var len = command_line.get().length;
                                            command_line.position(len);
                                        }
                                        count = 0;
                                    });
                                }
                            } else {
                                self.stopTime('click_' + self.id());
                                count = 0;
                            }
                        }
                    }).dblclick(function() {
                        count = 0;
                        self.stopTime('click_' + self.id());
                    });
                })();
            }
            self.delegate('.exception a', 'click', function(e) {
                // .on('click', '.exception a', function(e) {
                // in new jquery .delegate just call .on
                var href = $(this).attr('href');
                if (href.match(/:[0-9]+$/)) { // display line if specified
                    e.preventDefault();
                    print_line(href);
                }
            });
            self.mousedown(function(e) {
                if (e.which === 2) {
                    var selected = get_selected_text();
                    self.insert(selected);
                }
            });
            if (self.is(':visible')) {
                num_chars = self.cols();
                command_line.resize(num_chars);
                num_rows = get_num_rows(self);
            }
            // -------------------------------------------------------------
            // Run Login
            command_defer.resolve();
            if (settings.login) {
                self.login(settings.login, true, initialize);
            } else {
                initialize();
            }
            function resize() {
                if (self.is(':visible')) {
                    var width = self.width();
                    var height = self.height();
                    // prevent too many calculations in IE
                    if (old_height !== height || old_width !== width) {
                        self.resize();
                    }
                    old_height = height;
                    old_width = width;
                }
            }
            self.oneTime(100, function() {
                // idea taken from https://github.com/developit/simple-element
                // -resize-detector
                function bind() {
                    iframe[0].contentWindow.onresize = resize;
                }
                if (iframe.is(':visible')) {
                    bind();
                } else {
                    iframe.on('load', bind);
                }
            });
            // -------------------------------------------------------------
            // :: helper
            function exec_spec(spec) {
                var terminal = terminals.get()[spec[0]];
                // execute if belong to this terminal
                if (terminal && terminal_id === terminal.id()) {
                    if (spec[2]) {
                        try {
                            if (paused) {
                                var defer = $.Deferred();
                                resume_callbacks.push(function() {
                                    return terminal.exec(spec[2]).then(function() {
                                        terminal.save_state(spec[2], true, spec[1]);
                                        defer.resolve();
                                    });
                                });
                                return defer.promise();
                            } else {
                                return terminal.exec(spec[2]).then(function() {
                                    terminal.save_state(spec[2], true, spec[1]);
                                });
                            }
                        } catch (e) {
                            var settings = terminal.settings();
                            if ($.isFunction(settings.exceptionHandler)) {
                                settings.exceptionHandler.call(self, e, 'EXEC HASH');
                            } else {
                                var cmd = $.terminal.escape_brackets(command);
                                var msg = 'Error while exec with command ' + cmd;
                                terminal.error(msg).exception(e);
                            }
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
                            })();// */
                        } catch (e) {
                            // invalid json - ignore
                        }
                    });
                } else {
                    change_hash = true;
                }
            } else {
                change_hash = true; // if enabled later
            }
            // change_hash = true; // exec can now change hash
            // -------------------------------------------------------------
            if ($.event.special.mousewheel) {
                var shift = false;
                $(document).bind('keydown.terminal_' + self.id(), function(e) {
                    if (e.shiftKey) {
                        shift = true;
                    }
                }).bind('keyup.terminal_' + self.id(), function(e) {
                    // in Google Chromium/Linux shiftKey is false
                    if (e.shiftKey || e.which === 16) {
                        shift = false;
                    }
                });
                self.mousewheel(function(event, delta) {
                    if (!shift) {
                        var interpreter = interpreters.top();
                        var ret;
                        if ($.isFunction(interpreter.mousewheel)) {
                            ret = interpreter.mousewheel(event, delta, self);
                            if (ret === false) {
                                return;
                            }
                        } else if ($.isFunction(settings.mousewheel)) {
                            ret = settings.mousewheel(event, delta, self);
                            if (ret === false) {
                                return;
                            }
                        }
                        if (delta > 0) {
                            self.scroll(-40);
                        } else {
                            self.scroll(40);
                        }
                        // event.preventDefault();
                    }
                });
            }
        }); // make_interpreter
        self.data('terminal', self);
        return self;
    }; // terminal plugin
})(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(18).setImmediate))

/***/ }),
/* 12 */
/***/ (function(module, exports) {

/**@license
 *       __ _____                     ________                              __
 *      / // _  /__ __ _____ ___ __ _/__  ___/__ ___ ______ __ __  __ ___  / /
 *  __ / // // // // // _  // _// // / / // _  // _//     // //  \/ // _ \/ /
 * /  / // // // // // ___// / / // / / // ___// / / / / // // /\  // // / /__
 * \___//____ \\___//____//_/ _\_  / /_//____//_/ /_/ /_//_//_/ /_/ \__\_\___/
 *           \/              /____/
 * http://terminal.jcubic.pl
 *
 * This is example of how to create custom formatter for jQuery Terminal
 *
 * Copyright (c) 2014-2016 Jakub Jankiewicz <http://jcubic.pl/me>
 * Released under the MIT license
 *
 */
/* global jQuery */
(function($) {
    if (!$.terminal) {
        throw new Error('$.terminal is not defined');
    }
    // ---------------------------------------------------------------------
    // :: Replace overtyping (from man) formatting with terminal formatting
    // ---------------------------------------------------------------------
    $.terminal.overtyping = function(string) {
        return string.replace(/((?:_\x08.|.\x08_)+)/g, function(full) {
            var striped = full.replace(/_x08|\x08_|_\u0008|\u0008_/g, '');
            return '[[u;;]' + striped + ']';
        }).replace(/((?:.\x08.)+)/g, function(full) {
            return '[[b;#fff;]' + full.replace(/(.)(?:\x08|\u0008)\1/g,
                                               function(full, g) {
                                                   return g;
                                               }) + ']';
        });
    };
    // ---------------------------------------------------------------------
    // :: Html colors taken from ANSI formatting in Linux Terminal
    // ---------------------------------------------------------------------
    $.terminal.ansi_colors = {
        normal: {
            black: '#000',
            red: '#A00',
            green: '#008400',
            yellow: '#A50',
            blue: '#00A',
            magenta: '#A0A',
            cyan: '#0AA',
            white: '#AAA'
        },
        faited: {
            black: '#000',
            red: '#640000',
            green: '#006100',
            yellow: '#737300',
            blue: '#000087',
            magenta: '#650065',
            cyan: '#008787',
            white: '#818181'
        },
        bold: {
            black: '#000',
            red: '#F55',
            green: '#44D544',
            yellow: '#FF5',
            blue: '#55F',
            magenta: '#F5F',
            cyan: '#5FF',
            white: '#FFF'
        },
        // XTerm 8-bit pallete
        palette: [
            '#000000', '#AA0000', '#00AA00', '#AA5500', '#0000AA', '#AA00AA',
            '#00AAAA', '#AAAAAA', '#555555', '#FF5555', '#55FF55', '#FFFF55',
            '#5555FF', '#FF55FF', '#55FFFF', '#FFFFFF', '#000000', '#00005F',
            '#000087', '#0000AF', '#0000D7', '#0000FF', '#005F00', '#005F5F',
            '#005F87', '#005FAF', '#005FD7', '#005FFF', '#008700', '#00875F',
            '#008787', '#0087AF', '#0087D7', '#0087FF', '#00AF00', '#00AF5F',
            '#00AF87', '#00AFAF', '#00AFD7', '#00AFFF', '#00D700', '#00D75F',
            '#00D787', '#00D7AF', '#00D7D7', '#00D7FF', '#00FF00', '#00FF5F',
            '#00FF87', '#00FFAF', '#00FFD7', '#00FFFF', '#5F0000', '#5F005F',
            '#5F0087', '#5F00AF', '#5F00D7', '#5F00FF', '#5F5F00', '#5F5F5F',
            '#5F5F87', '#5F5FAF', '#5F5FD7', '#5F5FFF', '#5F8700', '#5F875F',
            '#5F8787', '#5F87AF', '#5F87D7', '#5F87FF', '#5FAF00', '#5FAF5F',
            '#5FAF87', '#5FAFAF', '#5FAFD7', '#5FAFFF', '#5FD700', '#5FD75F',
            '#5FD787', '#5FD7AF', '#5FD7D7', '#5FD7FF', '#5FFF00', '#5FFF5F',
            '#5FFF87', '#5FFFAF', '#5FFFD7', '#5FFFFF', '#870000', '#87005F',
            '#870087', '#8700AF', '#8700D7', '#8700FF', '#875F00', '#875F5F',
            '#875F87', '#875FAF', '#875FD7', '#875FFF', '#878700', '#87875F',
            '#878787', '#8787AF', '#8787D7', '#8787FF', '#87AF00', '#87AF5F',
            '#87AF87', '#87AFAF', '#87AFD7', '#87AFFF', '#87D700', '#87D75F',
            '#87D787', '#87D7AF', '#87D7D7', '#87D7FF', '#87FF00', '#87FF5F',
            '#87FF87', '#87FFAF', '#87FFD7', '#87FFFF', '#AF0000', '#AF005F',
            '#AF0087', '#AF00AF', '#AF00D7', '#AF00FF', '#AF5F00', '#AF5F5F',
            '#AF5F87', '#AF5FAF', '#AF5FD7', '#AF5FFF', '#AF8700', '#AF875F',
            '#AF8787', '#AF87AF', '#AF87D7', '#AF87FF', '#AFAF00', '#AFAF5F',
            '#AFAF87', '#AFAFAF', '#AFAFD7', '#AFAFFF', '#AFD700', '#AFD75F',
            '#AFD787', '#AFD7AF', '#AFD7D7', '#AFD7FF', '#AFFF00', '#AFFF5F',
            '#AFFF87', '#AFFFAF', '#AFFFD7', '#AFFFFF', '#D70000', '#D7005F',
            '#D70087', '#D700AF', '#D700D7', '#D700FF', '#D75F00', '#D75F5F',
            '#D75F87', '#D75FAF', '#D75FD7', '#D75FFF', '#D78700', '#D7875F',
            '#D78787', '#D787AF', '#D787D7', '#D787FF', '#D7AF00', '#D7AF5F',
            '#D7AF87', '#D7AFAF', '#D7AFD7', '#D7AFFF', '#D7D700', '#D7D75F',
            '#D7D787', '#D7D7AF', '#D7D7D7', '#D7D7FF', '#D7FF00', '#D7FF5F',
            '#D7FF87', '#D7FFAF', '#D7FFD7', '#D7FFFF', '#FF0000', '#FF005F',
            '#FF0087', '#FF00AF', '#FF00D7', '#FF00FF', '#FF5F00', '#FF5F5F',
            '#FF5F87', '#FF5FAF', '#FF5FD7', '#FF5FFF', '#FF8700', '#FF875F',
            '#FF8787', '#FF87AF', '#FF87D7', '#FF87FF', '#FFAF00', '#FFAF5F',
            '#FFAF87', '#FFAFAF', '#FFAFD7', '#FFAFFF', '#FFD700', '#FFD75F',
            '#FFD787', '#FFD7AF', '#FFD7D7', '#FFD7FF', '#FFFF00', '#FFFF5F',
            '#FFFF87', '#FFFFAF', '#FFFFD7', '#FFFFFF', '#080808', '#121212',
            '#1C1C1C', '#262626', '#303030', '#3A3A3A', '#444444', '#4E4E4E',
            '#585858', '#626262', '#6C6C6C', '#767676', '#808080', '#8A8A8A',
            '#949494', '#9E9E9E', '#A8A8A8', '#B2B2B2', '#BCBCBC', '#C6C6C6',
            '#D0D0D0', '#DADADA', '#E4E4E4', '#EEEEEE'
        ]
    };
    // ---------------------------------------------------------------------
    // :: Replace ANSI formatting with terminal formatting
    // ---------------------------------------------------------------------
    $.terminal.from_ansi = (function() {
        var color_list = {
            30: 'black',
            31: 'red',
            32: 'green',
            33: 'yellow',
            34: 'blue',
            35: 'magenta',
            36: 'cyan',
            37: 'white',

            39: 'inherit' // default color
        };
        var background_list = {
            40: 'black',
            41: 'red',
            42: 'green',
            43: 'yellow',
            44: 'blue',
            45: 'magenta',
            46: 'cyan',
            47: 'white',

            49: 'transparent' // default background
        };
        function format_ansi(code) {
            var controls = code.split(';');
            var num;
            var faited = false;
            var reverse = false;
            var bold = false;
            var styles = [];
            var output_color = '';
            var output_background = '';
            var _8bit_color = false;
            var _8bit_background = false;
            var process_8bit = false;
            var palette = $.terminal.ansi_colors.palette;
            function set_styles(num) {
                switch (num) {
                    case 1:
                        styles.push('b');
                        bold = true;
                        faited = false;
                        break;
                    case 4:
                        styles.push('u');
                        break;
                    case 3:
                        styles.push('i');
                        break;
                    case 5:
                        process_8bit = true;
                        break;
                    case 38:
                        _8bit_color = true;
                        break;
                    case 48:
                        _8bit_background = true;
                        break;
                    case 2:
                        faited = true;
                        bold = false;
                        break;
                    case 7:
                        reverse = true;
                        break;
                    default:
                        if (controls.indexOf('5') === -1) {
                            if (color_list[num]) {
                                output_color = color_list[num];
                            }
                            if (background_list[num]) {
                                output_background = background_list[num];
                            }
                        }
                }
            }
            for (var i in controls) {
                if (controls.hasOwnProperty(i)) {
                    num = parseInt(controls[i], 10);
                    if (process_8bit && (_8bit_background || _8bit_color)) {
                        if (_8bit_color && palette[num]) {
                            output_color = palette[num];
                        }
                        if (_8bit_background && palette[num]) {
                            output_background = palette[num];
                        }
                    } else {
                        set_styles(num);
                    }
                }
            }
            if (reverse) {
                if (output_color || output_background) {
                    var tmp = output_background;
                    output_background = output_color;
                    output_color = tmp;
                } else {
                    output_color = 'black';
                    output_background = 'white';
                }
            }
            var colors, color, background, backgrounds;
            if (bold) {
                colors = backgrounds = $.terminal.ansi_colors.bold;
            } else if (faited) {
                colors = backgrounds = $.terminal.ansi_colors.faited;
            } else {
                colors = backgrounds = $.terminal.ansi_colors.normal;
            }
            if (_8bit_color) {
                color = output_color;
            } else if (output_color === 'inherit') {
                color = output_color;
            } else {
                color = colors[output_color];
            }
            if (_8bit_background) {
                background = output_background;
            } else if (output_background === 'transparent') {
                background = output_background;
            } else {
                background = backgrounds[output_background];
            }
            return [styles.join(''), color, background];
        }
        return function(input) {
            //merge multiple codes
            /*input = input.replace(/((?:\x1B\[[0-9;]*[A-Za-z])*)/g, function(group) {
              return group.replace(/m\x1B\[/g, ';');
              });*/
            var splitted = input.split(/(\x1B\[[0-9;]*[A-Za-z])/g);
            if (splitted.length === 1) {
                return input;
            }
            var output = [];
            //skip closing at the begining
            if (splitted.length > 3) {
                var str = splitted.slice(0, 3).join('');
                if (str.match(/^\[0*m$/)) {
                    splitted = splitted.slice(3);
                }
            }
            var prev_color, prev_background, code, match;
            var inside = false;
            for (var i = 0; i < splitted.length; ++i) {
                match = splitted[i].match(/^\x1B\[([0-9;]*)([A-Za-z])$/);
                if (match) {
                    switch (match[2]) {
                        case 'm':
                            if (+match[1] !== 0) {
                                code = format_ansi(match[1]);
                            }
                            if (inside) {
                                output.push(']');
                                if (+match[1] === 0) {
                                    //just closing
                                    inside = false;
                                    prev_color = prev_background = '';
                                } else {
                                    // someone forget to close - move to next
                                    code[1] = code[1] || prev_color;
                                    code[2] = code[2] || prev_background;
                                    output.push('[[' + code.join(';') + ']');
                                    // store colors to next use
                                    if (code[1]) {
                                        prev_color = code[1];
                                    }
                                    if (code[2]) {
                                        prev_background = code[2];
                                    }
                                }
                            } else if (+match[1] !== 0) {
                                inside = true;
                                code[1] = code[1] || prev_color;
                                code[2] = code[2] || prev_background;
                                output.push('[[' + code.join(';') + ']');
                                // store colors to next use
                                if (code[1]) {
                                    prev_color = code[1];
                                }
                                if (code[2]) {
                                    prev_background = code[2];
                                }
                            }
                            break;
                    }
                } else {
                    output.push(splitted[i]);
                }
            }
            if (inside) {
                output.push(']');
            }
            return output.join(''); //.replace(/\[\[[^\]]+\]\]/g, '');
        };
    })();
    $.terminal.defaults.formatters.push($.terminal.overtyping);
    $.terminal.defaults.formatters.push($.terminal.from_ansi);
})(jQuery);


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* global define, KeyboardEvent, module */

(function () {

  var keyboardeventKeyPolyfill = {
    polyfill: polyfill,
    keys: {
      3: 'Cancel',
      6: 'Help',
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      28: 'Convert',
      29: 'NonConvert',
      30: 'Accept',
      31: 'ModeChange',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      41: 'Select',
      42: 'Print',
      43: 'Execute',
      44: 'PrintScreen',
      45: 'Insert',
      46: 'Delete',
      48: ['0', ')'],
      49: ['1', '!'],
      50: ['2', '@'],
      51: ['3', '#'],
      52: ['4', '$'],
      53: ['5', '%'],
      54: ['6', '^'],
      55: ['7', '&'],
      56: ['8', '*'],
      57: ['9', '('],
      91: 'OS',
      93: 'ContextMenu',
      144: 'NumLock',
      145: 'ScrollLock',
      181: 'VolumeMute',
      182: 'VolumeDown',
      183: 'VolumeUp',
      186: [';', ':'],
      187: ['=', '+'],
      188: [',', '<'],
      189: ['-', '_'],
      190: ['.', '>'],
      191: ['/', '?'],
      192: ['`', '~'],
      219: ['[', '{'],
      220: ['\\', '|'],
      221: [']', '}'],
      222: ["'", '"'],
      224: 'Meta',
      225: 'AltGraph',
      246: 'Attn',
      247: 'CrSel',
      248: 'ExSel',
      249: 'EraseEof',
      250: 'Play',
      251: 'ZoomOut'
    }
  };

  // Function keys (F1-24).
  var i;
  for (i = 1; i < 25; i++) {
    keyboardeventKeyPolyfill.keys[111 + i] = 'F' + i;
  }

  // Printable ASCII characters.
  var letter = '';
  for (i = 65; i < 91; i++) {
    letter = String.fromCharCode(i);
    keyboardeventKeyPolyfill.keys[i] = [letter.toLowerCase(), letter.toUpperCase()];
  }

  function polyfill () {
    if (!('KeyboardEvent' in window) ||
        'key' in KeyboardEvent.prototype) {
      return false;
    }

    // Polyfill `key` on `KeyboardEvent`.
    var proto = {
      get: function (x) {
        var key = keyboardeventKeyPolyfill.keys[this.which || this.keyCode];

        if (Array.isArray(key)) {
          key = key[+this.shiftKey];
        }

        return key;
      }
    };
    Object.defineProperty(KeyboardEvent.prototype, 'key', proto);
    return proto;
  }

  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (keyboardeventKeyPolyfill),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    module.exports = keyboardeventKeyPolyfill;
  } else if (window) {
    window.keyboardeventKeyPolyfill = keyboardeventKeyPolyfill;
  }

})();


/***/ }),
/* 14 */
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

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(14)))

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

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(15);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 19 */
/***/ (function(module, exports) {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__popovers_terminalMatrix__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_dom__ = __webpack_require__(0);





class ActionsMenu {

	static init()
	{
		this.context = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers_dom__["a" /* default */])('div.actions-btn-menu');

		const matrix =  new __WEBPACK_IMPORTED_MODULE_0__popovers_terminalMatrix__["a" /* default */]({
			icon		: '<i class="fa fa-th-large"></i>',
			// onSelect	: value => { window.TerminalState.change({fontSize : value}) }
		}).getTrigger();

		matrix.className = 'btn btn-purple';

		this.context.appendChild( matrix );
		return this;
	}
	
	static getContext()
	{
		return this.context;
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ActionsMenu;


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__terminal__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actionsMenu__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__menuPanel__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_dom__ = __webpack_require__(0);







let gdsSession = [];

class TerminalsMatrix
{
	static makeRow()
	{
		return document.createElement('tr');
	}

	static clear()
	{
		this.context.innerHTML = '';
		return this;
	}

	static getDimension( rowCount, cellCount )
	{
		const parent = this.context.parentNode;

		return {
			height	: Math.floor(parent.clientHeight / rowCount),
			width 	: Math.floor(parent.clientWidth / cellCount)
		}
	}

	static makeCells({rows : rowCount, cells : cellCount})
	{
		let resCells 	= [];

		rowCount++;
		cellCount++;

		this.dimensions = this.getDimension(rowCount, cellCount);

		const makeCells = row => {

			const makeCell = () => {
				return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__helpers_dom__["a" /* default */])('td.v-middle');
			};

			[ ...new Array(cellCount) ].map(makeCell).forEach( (cell) => {
				row.appendChild(cell);
				resCells.push(cell);
			});

			return row;
		};

		[ ...new Array(rowCount) ]
			.map( this.makeRow )
			.map( makeCells )
			.map( row => this.context.appendChild(row) );

		this.resCells = resCells;

		this.context.className = 'terminals-table ' + 't-matrix-w-' + ( cellCount - 1 );

		return this;
	}

	static appendTerminals({sessionIndex, gds, activeTerminal})
	{
		gdsSession[ gds ] = gdsSession[ gds ] || [];

		this.resCells.forEach(( cell, index ) => {

			if( activeTerminal && index === activeTerminal.name() )
			{
				cell.classList.add('active');
			}

			gdsSession[gds][index] = gdsSession[gds][index] || new __WEBPACK_IMPORTED_MODULE_0__terminal__["a" /* default */]({
				name 			: index,
				sessionIndex	: sessionIndex,
				gds				: gds,
				buffer			: window.TerminalState.getBuffer(gds, index + 1)
			});

			// draw or redraw
			gdsSession[ gds ][index].reattach( cell , this.dimensions );
		});
	}

	static purgeScreens( gds )
	{
		gdsSession[ gds ].forEach( terminal => terminal.clear() );
	}
}

TerminalsMatrix.context = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__helpers_dom__["a" /* default */])('table.terminals-table');

class RightMenu
{
	static init()
	{
		this.context = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__helpers_dom__["a" /* default */])('aside.t-d-cell menu');
		this.context.appendChild( __WEBPACK_IMPORTED_MODULE_2__menuPanel__["a" /* default */].getContext() );
		return this;
	}

	static render( params )
	{
		__WEBPACK_IMPORTED_MODULE_2__menuPanel__["a" /* default */].render( params );
		this.context.classList.toggle('hidden', params.hideMenu );
	}

	static getContext()
	{
		return this.context;
	}
}

class Wrapper
{
	static init()
	{
		this.context = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__helpers_dom__["a" /* default */])('div.term-body minimized');
		this.context.appendChild( __WEBPACK_IMPORTED_MODULE_2__menuPanel__["a" /* default */].getContext() );

		const LeftSide 	= __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__helpers_dom__["a" /* default */])('aside.t-d-cell left');
		LeftSide.appendChild( TerminalsMatrix.context );
		LeftSide.appendChild( __WEBPACK_IMPORTED_MODULE_1__actionsMenu__["a" /* default */].init().getContext() );

		this.context.appendChild( LeftSide );
		this.context.appendChild( RightMenu.init().getContext() );

		return this;
	}

	static render( params )
	{
		const gds = params.gds;

		if ( this.gds !== gds )
		{
			this.gds 				= gds;
			this.context.className = `term-body minimized ${gds}`; // change gds styles
		}

		RightMenu.render( params );
	}

	static getContext()
	{
		return this.context;
	}
}

class Container {

	static init( rootId )
	{
		const Root = document.getElementById( rootId );

		this.state = { className : 'terminal-wrap-custom' };


		this.context = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__helpers_dom__["a" /* default */])(`section.${this.state.className}`);
		this.context.appendChild( Wrapper.init().getContext() );

		Root.appendChild( this.context );
	}

	static purgeScreens( gds )
	{
		TerminalsMatrix.purgeScreens( gds );
	}

	// static menuRender( params )
	// {
	// 	RightMenu.render( params );
	// }

	static render( params )
	{
		this.context.className = this.state.className + ' term-f-size-' + params.fontSize;

		// Wrapper.render({
		// 	gds 			: params.gds,
		// 	hideMenu 		: params.hideMenu,
		// 	canAddPq 		: params.canAddPq
		// 	sessionIndex 	: params.sessionIndex
		// 	activeTerminal 	: params.activeTerminal
		// });

		const {hideMenu} = params;

		const p = {
			hideMenu,
			gds 			: params.gdsObj['name'],
			canCreatePq 	: params.gdsObj.canCreatePq,
			sessionIndex  	: params.gdsObj.sessionIndex,
			activeTerminal 	: params.gdsObj.activeTerminal
		};

		Wrapper.render( p );

		TerminalsMatrix
			.clear()
			.makeCells( params.gdsObj.matrix )
			.appendTerminals( p );
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Container;


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let button;

class PqButton
{
	static makeButton(value, index)
	{
		const button 		= document.createElement('button');
		button.className	= 'btn btn-sm btn-purple font-bold';
		button.innerHTML	= 'PQ';

		button.onclick = () => window.TerminalState.action('PQ_MODAL_SHOW', {});

		return button;
	}

	static render( { canCreatePq } )
	{
		button 			= button || this.makeButton();
		button.disabled = !canCreatePq;
		return button;
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PqButton;


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_dom__ = __webpack_require__(0);



class SessionKeys
{
	constructor( params )
	{
		this.context 	= document.createElement('div');
		this.settings 	= params;
		this.collection	= [];
		this.trigger	= [];
		this.active		= params.name === params.gds;
	}

	getButtons()
	{
		return this.settings.list.map( this.makeButton, this );
	}

	makeButton(value, index)
	{
		// console.log(' make buttons ', window.TerminalState.state )

		const button 		= __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers_dom__["a" /* default */])('button.btn btn-sm btn-purple font-bold pos-rlt');
		button.innerHTML	= value;

		if ( window.TerminalState.getPcc()[index] )
			button.innerHTML += `<span class="pcc-label">${window.TerminalState.getPcc()[index]}</span>`;

		if ( this.settings.sessionIndex === index )
			button.className += ' active';

		button.disabled = !this.settings.activeTerminal;

		button.addEventListener('click', () => {
			// this.disableAll();
			this.settings.onAreaChange( index );
		});

		return button;
	}

	disableAll()
	{
		this.collection.map( btn => btn.disabled = true );
	}

	getTrigger()
	{
		this.trigger 			= __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers_dom__["a" /* default */])('button.btn btn-sm btn-mint font-bold' + ( this.active ? ' active' : '' ));
		this.trigger.innerHTML	= this.settings['name'];

		if (!this.active)
			this.trigger.addEventListener('click', () => this.settings.onGdsChange( this.settings['name'] ) );

		return this.trigger;
	}

	render()
	{
		this.context.appendChild( this.getTrigger() );

		if (this.active)
			this.collection = this.getButtons().map( button => this.context.appendChild( button ) );

		return this.context;
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SessionKeys;


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__popovers_history__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__popovers_textSize__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__popovers_settings__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__menu_sessionButtons__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__menu_pqButton__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__helpers_dom__ = __webpack_require__(0);









const context = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__helpers_dom__["a" /* default */])('aside.sideMenu');

let SettingsContext;

class MenuPanel
{
	static toggle()
	{
	}

	static fontSize()
	{
		return new __WEBPACK_IMPORTED_MODULE_1__popovers_textSize__["a" /* default */]({
			icon		: '<i class="fa fa-text-height t-f-size-14"></i>',
			onSelect	: value => { window.TerminalState.change({fontSize : value}) }
		}).getTrigger();
	}

	static history()
	{
		return new __WEBPACK_IMPORTED_MODULE_0__popovers_history__["a" /* default */]({
			icon		: '<i class="fa fa-history t-f-size-14"></i>',
			onSelect	: value => window.TerminalState.execCmd( value )
		}).getTrigger();
	}

	static settings()
	{
		return new __WEBPACK_IMPORTED_MODULE_2__popovers_settings__["a" /* default */]({
			icon		: '<i class="fa fa-gears t-f-size-14"></i>'
		}).getTrigger();
	}

	static activeSession( {gds, sessionIndex, activeTerminal} )
	{
		const defParams = { gds, sessionIndex, activeTerminal };

		// console.log( defParams )

		defParams.onAreaChange 	= sessionIndex => {
			window.TerminalState.action('CHANGE_SESSION_BY_MENU', sessionIndex);
		};

		defParams.onGdsChange 	= gds => {
			window.TerminalState.action('CHANGE_GDS', gds);
		};

		const apollo 	= new __WEBPACK_IMPORTED_MODULE_3__menu_sessionButtons__["a" /* default */]( Object.assign( {}, defParams, {
			name : 'apollo',
			list : ['A', 'B', 'C', 'D', 'E']
		}));

		const sabre 	= new __WEBPACK_IMPORTED_MODULE_3__menu_sessionButtons__["a" /* default */]( Object.assign( {}, defParams, {
			name : 'sabre',
			list : ['A', 'B', 'C', 'D', 'E', 'F' ]
		}));

		const context 		= document.createElement('article');
		context.innerHTML 	= '<div class="label">Session</div>';

		context.appendChild( apollo.render() );
		context.appendChild( sabre.render() );

		return context;
	}

	static InputLanguage()
	{
		const context 	= document.createElement('article');

		context.innerHTML = '<div class="label">Input Language</div>';

		['APOLLO','SABRE'].forEach( value => {

			const button = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__helpers_dom__["a" /* default */])('button.btn btn-sm btn-gold font-bold' + ( window.TerminalState.getLanguage() === value ? ' active' : '') );

			button.innerHTML = value;
			button.addEventListener('click', () => window.TerminalState.change({ language : value }) );

			context.appendChild( button );
		});

		return context;
	}

	static settingsButtons()
	{
		if (SettingsContext)
			return SettingsContext;

		SettingsContext	= document.createElement('article');

		[
			// MenuPanel.toggle(),
			MenuPanel.fontSize(),
			MenuPanel.history(),
			MenuPanel.settings()
		].map( button => SettingsContext.appendChild( button ) );

		return SettingsContext;
	}

	static getContext()
	{
		return context;
	}

	static tests()
	{
		this.macros = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__helpers_dom__["a" /* default */])('span.btn btn-warning font-bold');
		this.macros.innerHTML 	= 'test pq';
		this.macros.onclick 	= () => { window.TerminalState.action('PQ_MACROS') };

		return this.macros;
	}

	static render(params)
	{
		// let start = new Date().getTime();
		// console.log(' re render ');

		context.innerHTML = '';

		context.appendChild( this.settingsButtons( params ) );
		context.appendChild( this.activeSession( params ) );
		context.appendChild( this.InputLanguage() );
		context.appendChild( __WEBPACK_IMPORTED_MODULE_4__menu_pqButton__["a" /* default */].render( params ) );

		context.appendChild( this.macros || this.tests() );

		// console.log('draw done', new Date().getTime() - start);
		return context;
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MenuPanel;


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_requests__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_dom__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_buttonPopover__ = __webpack_require__(1);






class History extends __WEBPACK_IMPORTED_MODULE_2__modules_buttonPopover__["a" /* default */]
{
	constructor( params )
	{
		super( params );

		this.popContent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers_dom__["a" /* default */])('div.historyContext');
		this.makeTrigger();
	}

	getPopContent()
	{
		this.build();
		return this.popContent;
	}

	makeShortcut( value )
	{
		const el = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers_dom__["a" /* default */])('a.t-pointer');

		el.innerHTML 	= value;
		el.onclick 		= this.settings.onSelect.bind(null, value);

		this.popContent.appendChild( el );
	}

	build()
	{
		__WEBPACK_IMPORTED_MODULE_0__helpers_requests__["a" /* default */].get('terminal/lastCommands', true).then( ( response = ['No History'] ) => {
			response.data.map( this.makeShortcut, this );
		});
	}
}

/* harmony default export */ __webpack_exports__["a"] = (History);

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_dom__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_buttonPopover__ = __webpack_require__(1);





class Settings extends __WEBPACK_IMPORTED_MODULE_1__modules_buttonPopover__["a" /* default */]
{
	constructor( params )
	{
		super( params );

		this.popContent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers_dom__["a" /* default */])('div');
		this.makeTrigger();

		this.popContent.innerHTML = '<div class="wrapper"> In Development </div>';
	}

	getPopContent()
	{
		// this.build();
		return this.popContent;
	}

	// build()
	// {
	// 	Request.get('', true).then( ( response = ['No History'] ) => {
	// 	});
	// }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Settings;



/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_dom__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_buttonPopover__ = __webpack_require__(1);





let cellObj = [];

const ACTIVE_CLASS = 'bg-purple';

class Matrix extends __WEBPACK_IMPORTED_MODULE_1__modules_buttonPopover__["a" /* default */]
{
	constructor( params )
	{
		super( params );

		this.popContent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers_dom__["a" /* default */])('table.matrix-table');
		this.makeTrigger();
	}

	getPopContent()
	{
		this.build();
		return this.popContent;
	}

	build()
	{
		[0, 1, 2, 3]
			.map( this._rows )
			.map( this._cells, this )
			.map( this._toTable, this );
	}

	_rows()
	{
		cellObj.push([]);
		return document.createElement('tr');
	}

	_cells( row, rIndex )
	{
		[0, 1, 2, 3].map( cIndex => row.appendChild( this._cell( rIndex, cIndex) ) );
		return row;
	}

	_cell( rIndex, cIndex)
	{
		const cell = document.createElement('td');

		cellObj[rIndex].push(cell);

		cell.addEventListener( 'click', () => {
			this.popover.close();

			window.TerminalState.action( 'CHANGE_MATRIX', {
				rows 	: rIndex,
				cells	: cIndex
			});
		});

		cell.addEventListener('mouseover', () => {

			for ( let i = 0; i <= rIndex; i++ )
			{
				cellObj[i].slice(0, cIndex + 1 ).forEach( cell => cell.classList.toggle(ACTIVE_CLASS) )
			}

		});

		cell.addEventListener('mouseleave', () => {
			[].forEach.call( this.popContent.querySelectorAll( '.' + ACTIVE_CLASS) , cell => cell.classList.toggle(ACTIVE_CLASS) );
		});

		return cell;
	}

	_toTable( row )
	{
		this.popContent.appendChild( row );
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Matrix;


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_dom__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_buttonPopover__ = __webpack_require__(1);





class TextSize extends __WEBPACK_IMPORTED_MODULE_1__modules_buttonPopover__["a" /* default */]
{
	constructor( params )
	{
		super( params );

		this.popContent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers_dom__["a" /* default */])('div');
		this.makeTrigger();
	}

	getPopContent()
	{
		this.build();
		return this.popContent;
	}

	build( list )
	{
		[ '1', '2', '3', '4'].forEach( value => {

			const button 		= __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers_dom__["a" /* default */])('button.list-group-item');
			button.innerHTML	= value + 'x';

			button.addEventListener('click', () => {
				this.popover.close();
				this.settings.onSelect( value );
			});

			this.popContent.appendChild( button );
		})
	}
}

/* harmony default export */ __webpack_exports__["a"] = (TextSize);

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__middleware_terminal__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_dom__ = __webpack_require__(0);





__webpack_require__(12);

// const calculateHeight = terminal => (terminal.find('.cursor').height() * terminal.rows());

class Terminal {

	constructor( params )
	{
		this.plugin 				= null;
		this.settings 				= params;
		this.context 				= __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers_dom__["a" /* default */])('div.terminal');

		this.makeBuffer( params.buffer );
		this.context.onclick = () => { if (!this.plugin) this.init(); };
	}

	init()
	{
		this.plugin = new __WEBPACK_IMPORTED_MODULE_0__middleware_terminal__["a" /* default */]({
			context 		: this.context,
			name 			: this.settings['name'],
			sessionIndex 	: this.settings['sessionIndex'],
			gds 			: this.settings['gds']
		});

		// this.context.style.height = calculateHeight(this.plugin.terminal) + 'px';
		// this.plugin.terminal.scroll_to_bottom();
	}

	makeBuffer( buf )
	{
		if (!buf)
			return false;

		const buffered = buf['buffering'].map( record => {
			return `<div class="command">${record.command}</div><pre style="white-space: pre-wrap">${record.output}</pre>`;
		}).join('');

		this.bufferDiv 				= __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers_dom__["a" /* default */])('article.terminal-wrapper');
		this.bufferDiv.innerHTML 	= `<div class="terminal-output">${$.terminal.format( buffered )}</div>`;

		this.context.appendChild( this.bufferDiv );
	}

	//
	// insertBuffer()
	// {
	// 	if ( !this.buffer )
	// 		return false;
	//
	// 	this.buffer['buffering'].forEach( (record) => {
	// 		this.plugin.terminal.echo(record.request, { finalize : function ( div ) {
	// 			div[0].className = 'command';
	// 		}});
	//
	// 		this.plugin.terminal.echo(record.output);
	// 	});
	// }

	getLineHeight()
	{
		const tempCmd 		= __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers_dom__["a" /* default */])('div.terminal-wrapper');
		tempCmd.innerHTML 	= '<div class="cmd"><span class="cursor">&nbsp;</span></div>';

		this.context.appendChild( tempCmd );

		const cursor = tempCmd.querySelector('.cursor');
		const height = cursor.clientHeight;

		this.context.removeChild( tempCmd );

		return height;
	}

	calculateHeight()
	{
		const getLineHeight = this.getLineHeight();
		const rowsNumber 	= Math.floor( this.settings.parentContext.clientHeight / getLineHeight );

		return getLineHeight * rowsNumber;
	}

	reattach( parentNode, dimensions )
	{
		// console.log(' ratach ', dimensions);

		this.settings.parentContext = parentNode;

		parentNode.style.height		= dimensions.height + 'px';
		// parentNode.style.width		= dimensions.width	+ 'px';

		this.context.style.height	= parentNode.clientHeight	+ 'px';
		this.context.style.width	= parentNode.clientWidth	+ 'px';

		if (this.plugin)
		{
			this.plugin.resize();
		}

		this.settings.parentContext.appendChild( this.context );
		this.context.style.height = this.calculateHeight() + 'px';

		if (this.plugin)
		{
			this.plugin.emptyLinesRecalculate();
		}

		this.context.scrollTop = this.context.scrollHeight;
	}

	clear()
	{
		if (this.plugin)
		{
			this.plugin.terminal.clear();
			this.plugin.terminal.cmd().set('');
		}

		if (this.bufferDiv)
		{
			this.context.removeChild(this.bufferDiv);
			this.bufferDiv = false;
		}

		this.buffer = '';
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Terminal;


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/*
window.addEventListener("beforeunload", function (e) {
	let confirmationMessage = "\o/";
	(e || window.event).returnValue = confirmationMessage; //Gecko + IE
	return confirmationMessage;                            //Webkit, Safari, Chrome
});
*/

class KeyBinding
{
	static parse(evt, terminal)
	{
		const keymap 	= evt.keyCode || evt.which;
		const isApollo	= window.TerminalState.getGds() === 'apollo';

		// if ( keymap === 13 )
		// 	return false;

		// console.log(keymap);

		// evt.preventDefault();
		// evt.stopPropagation();

		if ( evt.ctrlKey || evt.metaKey )
		{
			switch (keymap)
			{
				case 8: //  CTRL + backSpace; || CTRL+W || CTRL + S
				case 87:
				// case 83:
					evt.preventDefault();
					terminal.clear();
					return false;
				break;

				case 68 :
					console.log('dddd');
					// CTRL+D
					return false;
				break;

				case 76 :
					// CTRL+L
					return false;
				break;

				case 82 :
					// CTRL+R
					// terminal.insert('cccc');
					return false;
				break;

				case 120 :
					// F9
					// Template for Apollo: ¤:5S(paxOrder) (sellPrice) N1 (netPrice) F1 (fareAmount)
					// Example for Apollo: ¤:5S1 985.00 N1 720.00 F1 500.00
					// Template for Sabre: 5S(paxOrder) (sellPrice) N1 (netPrice) F1 (fareAmount)
					// Example for Sabre: 5S1 985.00 N1 720.00 F1 500.00
					evt.preventDefault();
					console.log('F9');
					return false;
				break;

				case 38 :
					// Up arrow
					// Last performed format

					return false;
				break;

				case 40 :
					// down arrow
					//Next performed format, by default returns to the first format and than each one by one.

					return false;
				break;

				case 112 :
					// f1
					// Apollo template: S*CTY/(City Code}
					// Apollo example: S*CTY/RIX
					// Sabre template: W/*(City Code)
 					// Sabre example: W/*RIX

					console.log('???');
					return false;
				break;

				case 113 :
					// f2
					// Apollo template: S*AIR/(Airline Code)
					// Apollo example: S*AIR/RIX
					// Sabre template: W/*(Airline Code)
					 // Sabre example: W/*BT

					terminal.insert( isApollo ? 'S*AIR/' : 'W/*' );
					return false;
				break;

				default:
					console.log(' default ');
			}
		}

		if ( evt.shiftKey )
		{
			switch (keymap)
			{
				case 120 : //f9
					let cmd = isApollo ? 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT' : '91-800-750-2238-A';
					terminal.exec(cmd);
					return false;
				break;

				case 117: //F6
					terminal.exec(isApollo ? 'SEM/2G55/AG' : 'AAA6IIF');
					return false;
				break;

				case 118: //F7
					terminal.exec(isApollo ? 'SEM/2G2H/AG' : 'AAADK8H');
					return false;
				break;

				case 119: //F8
					terminal.exec(isApollo ? 'SEM/2BQ6/AG' : 'AAAW8K7');
					return false;
				break;

				case 187: //+
				case 188: //,
					terminal.insert('+');
					return false;
				break;

				default :
			}
		}

		if ( evt.altKey )
		{
			switch (keymap)
			{
				case 8: // + backSpace;
					terminal.clear();
					return false;
				break;

				default :
			}
		}

		switch (keymap)
		{
			case 34 : // page down
				terminal.exec('MD');
				return false;
			break;

			case 33 : //page up
				terminal.exec('MU');
				return false;
			break;

			case 123 :
				// console.log('f12');
				terminal.exec(  ( isApollo ? 'R:' : '6')  + window.apiData.auth.login.toUpperCase() );
				return false;
			break;

			/*case 119 : //f8

				let cmd = {};

				if (isApollo)
				{
					cmd = {
						pos 	: '¤:3SSRDOCSYYHK1/N'.length,
						cmd		: '¤:3SSRDOCSYYHK1/N ///// DMMMYY/ //          /          / ',
						rules	: [
							'¤:3SSRDOCSYYHK1/N',
							'DMMMYY'
						]
					}
				} else
				{
					cmd = {
						pos		: '3DOCSA/DB/'.length,
						cmd		: '3DOCSA/DB/DDMMMYY/      /        /        -',
						rules	: [
							'3DOCSA/DB/'
						]
					}
				}

				plugin.lockF8( cmd );

				return false;
			break;*/

			default:
		}

		return true;
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = KeyBinding;


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_noty__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_noty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_noty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_pagination__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_session__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_spinner__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helpers_keyBinding__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_output__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modules_tabManager__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__modules_f8__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__helpers_helpers__ = __webpack_require__(2);


const $					= __webpack_require__(38);
window.$ 				= window.jQuery = $;

__webpack_require__(11);
__webpack_require__(13).polyfill();












const Debug = txt => {
	new __WEBPACK_IMPORTED_MODULE_0_noty___default.a({
		text	: `DEBUG : ${txt}`,
		layout 	: 'bottomRight',
		timeout : 1000,
		theme	: 'relax',
		type 	: 'warning'
	}).show();
};

class TerminalPlugin
{
	constructor( params )
	{
		// console.log( params );

		this.settings 	= params;
		this.context	= params.context;
		this.name		= params.name;

		this.hiddenBuff		= [];
		// this.hiddenCommand	= '';

		this.allowManualPaging = params.gds === 'sabre';

		this.session = new __WEBPACK_IMPORTED_MODULE_2__modules_session__["a" /* default */]({
			terminalIndex	: params.name,
			sessionIndex	: params.sessionIndex,
			gds				: params.gds
		});

		this.terminal 		= this.init();

		this.pagination 	= new __WEBPACK_IMPORTED_MODULE_1__modules_pagination__["a" /* default */]( this.terminal );
		this.spinner 		= new __WEBPACK_IMPORTED_MODULE_3__modules_spinner__["a" /* default */]( this.terminal );
		this.outputLiner 	= new __WEBPACK_IMPORTED_MODULE_5__modules_output__["a" /* default */]( this.terminal );
		this.tabCommands	= new __WEBPACK_IMPORTED_MODULE_6__modules_tabManager__["a" /* default */]();
		this.f8Reader		= new __WEBPACK_IMPORTED_MODULE_7__modules_f8__["a" /* default */]( this.terminal );
	}

	parseChar( evt, terminal )
	{
		console.log(' parse char ');

		// key press fires globally on all terminals;
		// return false;

		// console.log( evt.target.nodeName );

		if ( evt.target.nodeName !== 'TEXTAREA' )
			return undefined;

		// console.log('zest 1');

		if ( terminal.cmd().find('textarea')[0] !== evt.target )
			return undefined;

		if ( !terminal.enabled() )
			return undefined;

		// console.log(' zest' );

		const ch = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__helpers_helpers__["a" /* substitutePrintableChar */])( evt, window.TerminalState.isLanguageApollo() );

		if (!ch) // don't insert empty char further
		{
			return false;
		}

		console.log( '???', this.f8Reader.getIsActive() );

		if ( this.f8Reader.getIsActive() )
		{
			this.f8Reader.keyPressed( ch );
			return false;
		}

		// console.log( ch );
		terminal.insert( ch );

		return false;
	}

	parseKeyBinds( evt, terminal )
	{
		// console.log(' key bind !')

		if ( !__WEBPACK_IMPORTED_MODULE_4__helpers_keyBinding__["a" /* default */].parse( evt, terminal ) )
		{
			return false;
		}

		const replacement = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__helpers_helpers__["b" /* getReplacement */])( evt, window.TerminalState.isLanguageApollo() );

		if ( this.f8Reader.getIsActive() )
		{
			console.log( this.terminal.get_command() );

			// console.log("ZZZ", this.f8Reader.getIsActive())
			// this.f8Reader.keyPressed( replacement );
			// return false;
		}

		if ( replacement )
		{
			terminal.insert( replacement );
			return false;
		}

		if (replacement === false)
		{
			return false;
		}
	}

	switchArea( command )
	{
		const sessionIndex = window.TerminalState.getSessionAreaMap().indexOf( command );
		console.log( 'Seitch area ', command, sessionIndex );

		if ( sessionIndex !== -1 )
		{
			window.TerminalState.action('CHANGE_SESSION_AREA', sessionIndex);
		}
	}

	changeActiveTerm( activeTerminal )
	{
		window.activePlugin = this; // SO SO
		window.TerminalState.action('CHANGE_ACTIVE_TERMINAL', activeTerminal );
	}

	// clearBuf()
	// {
	// 	window.TerminalState.purgeScreens();
	// }

	tabPressed()
	{
		if ( this.f8Reader.getIsActive() )
		{
			this.f8Reader.tabPressed();
			return false;
		}

		const replace = terminal => {

			return ( [cmd, formatted] ) => {
				terminal.cmd().set( cmd );
				terminal.update( terminal.last_index(), formatted );
			}

		};

		this.tabCommands.run( replace(this.terminal) );
	}

	resize( w, h )
	{
		this.terminal.resize( w, h );
	}

	emptyLinesRecalculate()
	{
		this.outputLiner.recalculate();
	}

	init()
	{
		return $(this.context).terminal( this.commandParser.bind(this), {

			greetings		: '',
			name			: this.name,
			prompt			: '>',

			// scrollOnEcho	: false,
			// keypress		: this.parseChar.bind(this), // BUGGY BUGGY, assign on document wtf???
			keydown			: this.parseKeyBinds.bind(this),

			onInit			: this.changeActiveTerm.bind(this),
			onTerminalChange: this.changeActiveTerm.bind(this),

			// memory			: true,

			onBeforeCommand : ( terminal, command ) => { // is using
				if ( this.spinner.isActive()  )
				{
					this.hiddenBuff.push( command );
					return false;
				}
			},

			// for hard scenario shortcut, others in keymap helper
			keymap			: {
				'CTRL+S'	: () => window.TerminalState.purgeScreens(),
				'TAB'		: () => this.tabPressed(),
				'F8'		: () => this.f8Reader.tie(),
				'F5'		: () => false,
			},

			exceptionHandler( err )
			{
				console.warn('exc', err)
			}
		});
	}

	commandParser( command, terminal ) //pressed enter
	{
		this.outputLiner.prepare('');

		if ( !command || command === '' )
			return false;

		if ( this.allowManualPaging )
		{
			switch (command)
			{
				case 'MD' :
					terminal.echo( this.pagination.next().print() );
				return false;

				case 'MU' :
					terminal.echo( this.pagination.prev().print() );
				return false;

				case 'MDA' :
					terminal.echo( this.pagination.printAll() );
				return false;

				case 'MDA5' :
					return false;

				case 'MDA20' :
					return false;
			}
		}

		this.spinner.start();

		// this.outputLiner.prepare( '' );

		/*setTimeout( () => {
			this.spinner.end();
			this.loopCmdStack();
			this.parseBackEnd({
				data	: {
					output 		: 'THIS IS ONLY A TEST TEST TES TEST',
					clearScreen : true
				}
			})
		}, 1000 );*/

		this.sendRequest(command);

		return false;
	}

	loopCmdStack()
	{
		if (this.hiddenBuff.length)
		{
			const cmd = this.hiddenBuff.shift();

			if ( cmd )
				this.terminal.exec( cmd );
		}
	}

	sendRequest( command )
	{
		this.session
			.run({
				cmd : command.toUpperCase()
			})

			.then( response => {
				this.spinner.end();
				return response;
			})

			.then( this.parseBackEnd.bind(this) )
			.then( () => {
				this.loopCmdStack();
				this.switchArea( command.toUpperCase() );
			})

			// .catch( this.parseError.bind(this) );
	}

	parseBackEnd( response = {} )
	{
		const result = response['data'] || {};

		if ( result['output'] )
		{
			if ( this.allowManualPaging ) // sabre
			{
				const output = this.pagination
					.bindOutput( result['output'], this.terminal.rows() - 1, this.terminal.cols() )
					.print();

				this.terminal.echo( output );
			} else
			{
				const clearScreen = result['clearScreen'] && window.TerminalState.getMatrix().rows !== 0;

				this.outputLiner
					.prepare( result['output'], clearScreen );
			}
		}

		this.tabCommands.reset( result['tabCommands'], result['output'] );

		if ( result['pcc'] )
			window.TerminalState.action( 'CHANGE_PCC', result['pcc'] );

		// if ( result['canCreatePq'] )
		window.TerminalState.action( 'CAN_CREATE_PQ', result['canCreatePq'] );

		this.debugOutput( result );
	}

	debugOutput( result )
	{
		if (result['clearScreen'])
			Debug( 'DEBUG: CLEAR SCREEN' );

		if ( result['canCreatePq'] )
			Debug( 'CAN CREATE PCC' );

		if ( result['tabCommands'] && result['tabCommands'].length )
			Debug( 'FOUND TAB COMMANDS' );
	}
	
	parseError(e)
	{
		// this.spinner.end();
		// console.error(' error', arguments );
		// this.terminal.error( String(e) );
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TerminalPlugin;


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const rules = {
	apollo : {
		pos 	: '¤:3SSRDOCSYYHK1/N'.length,
		cmd		: '¤:3SSRDOCSYYHK1/N ///// DMMMYY/ //          /          / ',
		rules	: [
			'¤:3SSRDOCSYYHK1/N',
			'DMMMYY'
		]
	},

	sabre 	: {
		pos		: '3DOCSA/DB/'.length,
		cmd		: '3DOCSA/DB/DDMMMYY/      /        /        -',
		rules	: [
			'3DOCSA/DB/'
		]
	}
};

class F8Reader
{
	constructor( terminal )
	{
		this.index		= 0;
		this.terminal 	= terminal;
		this.isActive 	= false;
		this.canReplace	= false;
	}

	getIsActive()
	{
		return this.isActive;
	}

	nextTabPos()
	{
		const cmd	= this.currentCmd.cmd;
		const slice	= this.currentCmd.rules[ this.index ];

		return cmd.indexOf( slice ) + ( this.index === 0 ?  slice.length : 0);
	}

	tabPressed()
	{
		this.canReplace = true;
		this.terminal.cmd().position( this.nextTabPos() );

		if ( !this.currentCmd.rules[ this.index] )
		{
			this.isActive 	= false;
			this.canReplace = false;
			this.index 		= 0;
		}

		this.index++;
		console.log(this.currentCmd.rules[ this.index])
	}

	keyPressed( char )
	{
		// const char		= String.fromCharCode( evt.keyCode || evt.which );
		const curPos 	= this.terminal.cmd().position();
		const oldCmd 	= this.terminal.get_command();

		if (oldCmd.substr(curPos, 1) === "/")
		{
			this.canReplace = false;
		}

		if ( !this.canReplace )
			return false;

		// todo helper spec chars;
		const newCmd = oldCmd.substr(0, curPos) + char + oldCmd.substr(curPos + 1);

		this.terminal.set_command(newCmd);
		this.terminal.cmd().position( curPos + 1 );
	}

	tie()
	{
		this.currentCmd	= rules[window.TerminalState.getGds()];
		this.index 		= 0;
		this.isActive	= true;

		this.terminal.insert( this.currentCmd.cmd );
		this.tabPressed();
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = F8Reader;


/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_helpers__ = __webpack_require__(2);




class Output
{
	constructor( terminal )
	{
		this.terminal		= terminal;

		this.context 		= document.createElement('div');
		this.emptyLines 	= 0;
		this.outputStrings	= '';
		this.cmdLineOffset 	= '';

		this.terminal.cmd().after( this.context );

		this.clearScreen 	= false;
	}

	countEmpty()
	{
		const noClearScreen	= () => this.emptyLines > 0 ? this.emptyLines - this.getOutputLength() : 0 ;
		const isClearScreen = () => this.terminal.rows() - ( this.getOutputLength() + 1 );

		this.emptyLines 	= this.clearScreen ? isClearScreen() : noClearScreen();

		// console.log( this.terminal.rows() );
		// console.log( this.getOutputLength() );
		// console.log( this.emptyLines );

		if (this.emptyLines < 0 )
			this.emptyLines = 0;

		return this;
	}

	prepare( output, clearScreen = false )
	{
		this.outputStrings 	= output;
		this.clearScreen	= clearScreen;

		this.countEmpty().printOutput().attachEmpty().scroll();
	}

	recalculate()
	{
		this.countEmpty().attachEmpty().scroll();
	}

	attachEmpty()
	{
		this.context.innerHTML = '';

		if (this.emptyLines > 0 )
			this.context.innerHTML = [ ...new Array(  this.emptyLines + 1  ) ].join('<div><span>&nbsp;</span></div>');

		return this;
	}

	getOutputLength()
	{
		return __WEBPACK_IMPORTED_MODULE_0__helpers_helpers__["c" /* default */].getLines( this.outputStrings, this.terminal.cols() ).length;
	}

	printOutput()
	{
		this.cmdLineOffset 	= this.terminal.cmd()[0].offsetTop;
		// this.terminal.echo( this.outputStrings, {raw : 1});
		this.terminal.echo( this.outputStrings);
		return this;
	}

	scroll()
	{
		if (this.emptyLines === 0)
		{
			this.terminal.scroll().scroll( this.cmdLineOffset ); // to first line, to desired line //TEST
		} else
		{
			this.terminal.scroll_to_bottom(); // to first line, to desired line //TEST
			// this.terminal[0].scrollTop = this.terminal[0].scrollHeight;
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Output;


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_helpers__ = __webpack_require__(2);




class Pagination
{
	constructor()
	{
		this.cache 	= [];
		this.output	= '';
		this.page 	= 0;
	}

	bindOutput(output, rows = 0, cols = 0)
	{
		this.page 	= 0;
		this.output = output;
		this.cache 	= __WEBPACK_IMPORTED_MODULE_0__helpers_helpers__["c" /* default */].makeCachedParts( output, rows, cols );

		// console.log(this.cache );
		return this;
	}

	next()
	{
		if (this.cache.length && this.page < this.cache.length)
			this.page++;

		return this;
	}

	prev()
	{
		if (this.page > 0 )
			this.page--;

		return this;
	}

	print()
	{
		return this.cache[ this.page ] || '‡NOTHING TO SCROLL‡';
	}

	printAll()
	{
		return this.output;
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Pagination;


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_requests__ = __webpack_require__(3);


// import { TIME_FORMAT, ACCOUNT } from '../constants';


class Session
{
	constructor( params )
	{
		this.settings = params;
	}

	run( params )
	{
		const rData = {
			terminalIndex	: parseInt(this.settings['terminalIndex']) + 1,
			command			: params['cmd'],
			gds				: this.settings['gds'],
			language		: window.TerminalState.getLanguage(),
			terminalData	: window.apiData['terminalData']
		};

		return __WEBPACK_IMPORTED_MODULE_0__helpers_requests__["a" /* default */].runSyncCommand( rData );
	}

	/*start()
	{
		Requests.runSyncCommand('startSession', {
			timeFormat	: TIME_FORMAT,
			account		: ACCOUNT
		})
			.then( function( response ) {
				return response['data'];
			})
			.catch(function(err) {
				console.error('oh shit Error', err);
			});
	}

	end()
	{
		let result = Requests.runSyncCommand('endSession', {
			sessionToken: this.settings['sessionToken']
		});

		if (result['success'])
			return true;
	}*/
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Session;


/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


const cliSpinners 		= __webpack_require__(9);

class Spinner
{
	constructor( terminal )
	{
		this.timer 		= false;
		this.terminal 	= terminal;
		this.prompt 	= '';
		this.spinner	= cliSpinners.simpleDots;

		this.frameCounter = 0;
	}

	set()
	{
		const text = this.spinner.frames[this.frameCounter++ % this.spinner.frames.length];
		this.terminal.set_prompt(text);
	}

	start()
	{
		if (this.timer)
			this.end();

		this.terminal.find('.cursor').hide();
		this.terminal.set_mask('');

		this.prompt 	= this.terminal.get_prompt();

		this.set();
		this.timer 		= setInterval( this.set.bind(this), this.spinner.interval);
	}

	end()
	{
		clearInterval( this.timer );

		this.terminal.set_prompt( this.prompt );

		this.terminal.find('.cursor').show();
		this.terminal.set_mask(false);

		this.timer = false;
	}

	isActive()
	{
		return !!this.timer;
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Spinner;


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class TabManager
{
	constructor()
	{
		this.index 	= 0;
		this.list	= [];
	}

	reset( list = [], output )
	{
		this.list 	= list;

		this.index 	= 0;
		this.output = output;

		if (list.length)
		{
			this.list.push(''); // empty command line
		}
	}

	next()
	{
		this.index++;

		if ( this.list.length <= this.index )
			this.index = 0;
	}

	getCommand()
	{
		return this.list[ this.index ];
	}

	formatOutput( cmd )
	{
		if (cmd) // last element in the array is an empty string
		{
			cmd = `>${cmd}`;
			const index = this.output.indexOf( cmd ) + cmd.length;
			return this.output.substr(0, index) + `[[;red;blue;]·]` +  this.output.substr( (index + 1 ) , this.output.length)

		}

		return this.output;
	}

	run( replace )
	{
		const cmd = this.getCommand();

		if ( cmd !== undefined )
		{
			replace([ cmd, this.formatOutput( cmd ) ]);
			this.next();
		}

		return [];
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TabManager;


/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(8);
module.exports = __webpack_require__(7);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map