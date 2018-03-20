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
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/cli-spinners/index.js":
/*!************************************************************************************!*\
  !*** delegated ./node_modules/cli-spinners/index.js from dll-reference vendor_lib ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(/*! dll-reference vendor_lib */ "dll-reference vendor_lib"))(9);

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/jquery.terminal/css/jquery.terminal.css":
/*!****************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/jquery.terminal/css/jquery.terminal.css ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "/*!\n *       __ _____                     ________                              __\n *      / // _  /__ __ _____ ___ __ _/__  ___/__ ___ ______ __ __  __ ___  / /\n *  __ / // // // // // _  // _// // / / // _  // _//     // //  \\/ // _ \\/ /\n * /  / // // // // // ___// / / // / / // ___// / / / / // // /\\  // // / /__\n * \\___//____ \\\\___//____//_/ _\\_  / /_//____//_/ /_/ /_//_//_/ /_/ \\__\\_\\___/\n *           \\/              /____/                              version DEV\n * http://terminal.jcubic.pl\n *\n * This file is part of jQuery Terminal.\n *\n * Copyright (c) 2011-2017 Jakub Jankiewicz <http://jcubic.pl>\n * Released under the MIT license\n *\n * Date: Tue, 12 Sep 2017 07:04:06 +0000\n */\n.terminal .terminal-output .format, .cmd .format,\n.cmd .prompt, .cmd .prompt div, .terminal .terminal-output div div{\n    display: inline-block;\n}\n.terminal h1, .terminal h2, .terminal h3, .terminal h4, .terminal h5, .terminal h6, .terminal pre, .cmd {\n    margin: 0;\n}\n.terminal h1, .terminal h2, .terminal h3, .terminal h4, .terminal h5, .terminal h6 {\n    line-height: 1.2em;\n}\n/*\n.cmd .mask {\n    width: 10px;\n    height: 11px;\n    background: black;\n    z-index: 100;\n}\n*/\n.cmd .clipboard {\n    position: absolute;\n    left: -16px;\n    top: 0;\n    width: 20px;\n    height: 16px;\n    /* this seems to work after all on Android */\n    /*left: -99999px;\n    clip: rect(1px,1px,1px,1px);\n    /* on desktop textarea appear when paste */\n    /*\n    opacity: 0.01;\n    filter: alpha(opacity = 0.01);\n    filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0.01);\n    */\n    background: transparent;\n    border: none;\n    color: transparent;\n    outline: none;\n    padding: 0;\n    resize: none;\n    z-index: 0;\n    overflow: hidden;\n}\n.terminal .error {\n    color: #f00;\n}\n.terminal {\n    position: relative;\n    /*overflow: hidden;*/\n    overflow-y: auto;\n    overflow-x: hidden;\n}\n.terminal > div {\n    height: 100%;\n}\n.cmd {\n    padding: 0;\n    position: relative;\n    /*margin-top: 3px; */\n    float: left;\n}\n.terminal .inverted, .cmd .inverted {\n    background-color: #aaa;\n    color: #000;\n}\n.cmd .cursor {\n    border-bottom: 3px solid transparent;\n    margin-bottom: -3px;\n    background-clip: content-box;\n}\n.cmd .cursor.blink {\n    -webkit-animation: terminal-blink 1s infinite steps(1, start);\n       -moz-animation: terminal-blink 1s infinite steps(1, start);\n        -ms-animation: terminal-blink 1s infinite steps(1, start);\n            animation: terminal-blink 1s infinite steps(1, start);\n    border-left: 1px solid transparent;\n    margin-left: -1px;\n}\n.bar.terminal .inverted, .bar.cmd .inverted {\n    border-left-color: #aaa;\n}\n.terminal .terminal-output div div, .cmd .prompt {\n    display: block;\n    line-height: 14px;\n    height: auto;\n}\n.cmd .prompt > span {\n    float: left;\n}\n.terminal, .cmd {\n    font-family: monospace;\n    /*font-family: FreeMono, monospace; this don't work on Android */\n    color: #aaa;\n    background-color: #000;\n    font-size: 12px;\n    line-height: 14px;\n    box-sizing: border-box;\n}\n.cmd div {\n    float: left;\n    clear: both;\n}\n.cmd div + span {\n    clear: both;\n}\n.cmd .prompt + div {\n    clear: right;\n}\n.terminal-output > div {\n    /*padding-top: 3px;*/\n    min-height: 14px;\n}\n.terminal-output > div > div * {\n    overflow-wrap: break-word; /* when echo html */\n    word-wrap: break-word;\n}\n.terminal .terminal-output div span {\n    display: inline-block;\n}\n.cmd > span:not(.prompt) {\n    float: left;\n}\n.cmd .prompt span.line {\n    display: block;\n    float: none;\n}\n/* fix double style of selecting text in terminal */\n.terminal-output span, .terminal-output a, .cmd div, .cmd span, .terminal td,\n.terminal pre, .terminal h1, .terminal h2, .terminal h3, .terminal h4,\n.terminal h5, .terminal h6 {\n    -webkit-touch-callout: initial;\n    -webkit-user-select: text;\n    -khtml-user-select: text;\n    -moz-user-select: text;\n    -ms-user-select: text;\n    user-select: text;\n}\n.terminal, .terminal-output, .terminal-output div {\n    -webkit-touch-callout: none;\n    -webkit-user-select: none;\n    -khtml-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n}\n/* firefox hack */\n@-moz-document url-prefix() {\n    .terminal, .terminal-output, .terminal-output div {\n        -webkit-touch-callout: initial;\n        -webkit-user-select: initial;\n        -khtml-user-select: initial;\n        -moz-user-select: initial;\n        -ms-user-select: initial;\n        user-select: initial;\n    }\n}\n.terminal table {\n    border-collapse: collapse;\n}\n.terminal td {\n    border: 1px solid #aaa;\n}\n.terminal h1::-moz-selection,\n.terminal h2::-moz-selection,\n.terminal h3::-moz-selection,\n.terminal h4::-moz-selection,\n.terminal h5::-moz-selection,\n.terminal h6::-moz-selection,\n.terminal pre::-moz-selection,\n.terminal td::-moz-selection,\n.terminal .terminal-output div div::-moz-selection,\n.terminal .terminal-output div span::-moz-selection,\n.terminal .terminal-output div div a::-moz-selection,\n.cmd div::-moz-selection,\n.cmd > span::-moz-selection,\n.cmd > span span::-moz-selection,\n.cmd > div::-moz-selection,\n.cmd > div span::-moz-selection,\n.cmd .prompt span::-moz-selection {\n    background-color: #aaa;\n    color: #000;\n}\n/* this don't work in Chrome\n.terminal tr td::-moz-selection {\n    border-color: #000;\n}\n.terminal tr td::selection {\n    border-color: #000;\n}\n*/\n.terminal h1::selection,\n.terminal h2::selection,\n.terminal h3::selection,\n.terminal h4::selection,\n.terminal h5::selection,\n.terminal h6::selection,\n.terminal pre::selection,\n.terminal td::selection,\n.terminal .terminal-output div div::selection,\n.terminal .terminal-output div div a::selection,\n.terminal .terminal-output div span::selection,\n.cmd div::selection,\n.cmd > span::selection,\n.cmd > span span::selection,\n.cmd > div::selection,\n.cmd > div span::selection,\n.cmd .prompt span::selection {\n    /*\n     * use rgba to fix transparent selection in chrome\n     * http://stackoverflow.com/questions/7224445/css3-selection-behaves-differently-in-ff-chrome\n     */\n    background-color: rgba(170, 170, 170, 0.99);\n    color: #000;\n}\n.terminal .terminal-output div.error, .terminal .terminal-output div.error div {\n    color: red;\n}\n.tilda {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    z-index: 1100;\n}\n.clear {\n    clear: both;\n}\n.terminal a {\n    color: #0F60FF;\n}\n.terminal a:hover {\n    color: red;\n}\n.terminal .terminal-fill {\n    position: absolute;\n    left: 0;\n    top: -100%;\n    width: 100%;\n    height: 100%;\n    margin: 1px 0 0;\n    border: none;\n    opacity: 0;\n    pointer-events: none;\n    box-sizing: border-box;\n}\n.terminal, .terminal .terminal-fill {\n    padding: 10px;\n}\n@-webkit-keyframes terminal-blink {\n  0%, 100% {\n      background-color: #000;\n      color: #aaa;\n  }\n  50% {\n      background-color: #bbb;\n      color: #000;\n  }\n}\n\n@-ms-keyframes terminal-blink {\n  0%, 100% {\n      background-color: #000;\n      color: #aaa;\n  }\n  50% {\n      background-color: #bbb;\n      color: #000;\n  }\n}\n\n@-moz-keyframes terminal-blink {\n  0%, 100% {\n      background-color: #000;\n      color: #aaa;\n  }\n  50% {\n      background-color: #bbb;\n      color: #000;\n  }\n}\n@keyframes terminal-blink {\n  0%, 100% {\n      background-color: #000;\n      color: #aaa;\n  }\n  50% {\n      background-color: #bbb; /* not #aaa because it's seems there is Google Chrome bug */\n      color: #000;\n  }\n}\n@-webkit-keyframes terminal-bar {\n  0%, 100% {\n      border-left-color: #aaa;\n  }\n  50% {\n      border-left-color: #000;\n  }\n}\n@-ms-keyframes terminal-bar {\n  0%, 100% {\n      border-left-color: #aaa;\n  }\n  50% {\n      border-left-color: #000;\n  }\n}\n@-moz-keyframes terminal-bar {\n  0%, 100% {\n      border-left-color: #aaa;\n  }\n  50% {\n      border-left-color: #000;\n  }\n}\n@keyframes terminal-bar {\n  0%, 100% {\n      border-left-color: #aaa;\n  }\n  50% {\n      border-left-color: #000;\n  }\n}\n@-webkit-keyframes terminal-underline {\n  0%, 100% {\n      border-bottom-color: #aaa;\n      position: relative;\n      line-height: 12px;\n      border-left: none;\n  }\n  50% {\n      border-bottom-color: #000;\n      position: relative;\n      line-height: 12px;\n      border-left: none;\n  }\n}\n@-ms-keyframes terminal-underline {\n  0%, 100% {\n      border-bottom-color: #aaa;\n      position: relative;\n      line-height: 12px;\n      border-left: none;\n  }\n  50% {\n      border-bottom-color: #000;\n      position: relative;\n      line-height: 12px;\n      border-left: none;\n  }\n}\n@-moz-keyframes terminal-underline {\n  0%, 100% {\n      border-bottom-color: #aaa;\n      position: relative;\n      line-height: 12px;\n      border-left: none;\n  }\n  50% {\n      border-bottom-color: #000;\n      position: relative;\n      line-height: 11px;\n      border-left: none;\n  }\n}\n@keyframes terminal-underline {\n  0%, 100% {\n      border-bottom-color: #aaa;\n      position: relative;\n      line-height: 11px;\n      border-left: none;\n  }\n  50% {\n      border-bottom-color: #000;\n      position: relative;\n      line-height: 11px;\n      border-left: none;\n  }\n}\n@supports (--css: variables) {\n    .terminal, .cmd {\n        color: var(--color, #aaa);\n        background-color: var(--background, #000);\n    }\n    .terminal, .cmd, .terminal .terminal-output div div, .cmd .prompt {\n        font-size: calc(var(--size, 1) * 12px);\n        line-height: calc(var(--size, 1) * 14px);\n    }\n    .terminal .inverted, .cmd .inverted {\n        background-color: var(--color, #aaa);\n        color: var(--background, #000);\n    }\n    .cmd .cursor.blink {\n        -webkit-animation: var(--animation, terminal-blink) 1s infinite steps(1, start);\n           -moz-animation: var(--animation, terminal-blink) 1s infinite steps(1, start);\n            -ms-animation: var(--animation, terminal-blink) 1s infinite steps(1, start);\n                animation: var(--animation, terminal-blink) 1s infinite steps(1, start);\n        color: var(--color, #aaa);\n        background-color: var(--background, #000);\n    }\n    .terminal h1::-moz-selection,\n    .terminal h2::-moz-selection,\n    .terminal h3::-moz-selection,\n    .terminal h4::-moz-selection,\n    .terminal h5::-moz-selection,\n    .terminal h6::-moz-selection,\n    .terminal pre::-moz-selection,\n    .terminal td::-moz-selection,\n    .terminal .terminal-output div div::-moz-selection,\n    .terminal .terminal-output div span::-moz-selection,\n    .terminal .terminal-output div div a::-moz-selection,\n    .cmd div::-moz-selection,\n    .cmd > span::-moz-selection,\n    .cmd > span span::-moz-selection,\n    .cmd > div::-moz-selection,\n    .cmd > div span::-moz-selection,\n    .cmd .prompt span::-moz-selection {\n        background-color: var(--color, #aaa);\n        color: var(--background, #000);\n    }\n    .terminal h1::selection,\n    .terminal h2::selection,\n    .terminal h3::selection,\n    .terminal h4::selection,\n    .terminal h5::selection,\n    .terminal h6::selection,\n    .terminal pre::selection,\n    .terminal td::selection,\n    .terminal .terminal-output div div::selection,\n    .terminal .terminal-output div div a::selection,\n    .terminal .terminal-output div span::selection,\n    .cmd div::selection,\n    .cmd > span::selection,\n    .cmd > span span::selection,\n    .cmd > div::selection,\n    .cmd > div span::selection,\n    .cmd .prompt span::selection {\n        background-color: var(--color, rgba(170, 170, 170, 0.99));\n        color: var(--background, #000);\n    }\n    @-webkit-keyframes terminal-blink {\n      0%, 100% {\n          background-color: var(--background, #000);\n          color: var(--color, #aaa);\n      }\n      50% {\n          background-color: var(--color, #aaa);\n          color: var(--background, #000);\n      }\n    }\n\n    @-ms-keyframes terminal-blink {\n      0%, 100% {\n          background-color: var(--background, #000);\n          color: var(--color, #aaa);\n      }\n      50% {\n          background-color: var(--color, #aaa);\n          color: var(--background, #000);\n      }\n    }\n    @-moz-keyframes terminal-blink {\n      0%, 100% {\n          background-color: var(--background, #000);\n          color: var(--color, #aaa);\n      }\n      50% {\n          background-color: var(--color, #aaa);\n          color: var(--background, #000);\n      }\n    }\n    @keyframes terminal-blink {\n      0%, 100% {\n          background-color: var(--background, #000);\n          color: var(--color, #aaa);\n      }\n      50% {\n          background-color: var(--color, #aaa);\n          color: var(--background, #000);\n      }\n    }\n    @-webkit-keyframes terminal-bar {\n      0%, 100% {\n          border-left-color: var(--background, #000);\n      }\n      50% {\n          border-left-color: var(--color, #aaa);\n      }\n    }\n    @-ms-keyframes terminal-bar {\n      0%, 100% {\n          border-left-color: var(--background, #000);\n      }\n      50% {\n          border-left-color: var(--color, #aaa);\n      }\n    }\n    @-moz-keyframes terminal-bar {\n      0%, 100% {\n          border-left-color: var(--background, #000);\n      }\n      50% {\n          border-left-color: var(--color, #aaa);\n      }\n    }\n    @keyframes terminal-bar {\n      0%, 100% {\n          border-left-color: var(--background, #000);\n      }\n      50% {\n          border-left-color: var(--color, #aaa);\n      }\n    }\n    @-webkit-keyframes terminal-underline {\n      0%, 100% {\n          border-bottom-color: var(--color, #aaa);\n          position: relative;\n          line-height: calc(var(--size, 1) * 12px);\n          border-left: none;\n      }\n      50% {\n          border-bottom-color: var(--background, #000);\n          position: relative;\n          line-height: calc(var(--size, 1) * 12px);\n          border-left: none;\n      }\n    }\n    @-ms-keyframes terminal-underline {\n      0%, 100% {\n          border-bottom-color: var(--background, #000);\n          position: relative;\n          line-height: calc(var(--size, 1) * 12px);\n          border-left: none;\n      }\n      50% {\n          border-bottom-color: var(--color, #aaa);\n          position: relative;\n          line-height: calc(var(--size, 1) * 12px);\n          border-left: none;\n      }\n    }\n    @-moz-keyframes terminal-underline {\n      0%, 100% {\n          border-bottom-color: var(--background, #000);\n          position: relative;\n          line-height: calc(var(--size, 1) * 12px);\n          border-left: none;\n      }\n      50% {\n          border-bottom-color: var(--color, #aaa);\n          position: relative;\n          line-height: calc(var(--size, 1) * 12px);\n          border-left: none;\n      }\n    }\n    @keyframes terminal-underline {\n      0%, 100% {\n          border-bottom-color: var(--background, #000);\n          position: relative;\n          line-height: calc(var(--size, 1) * 12px);\n          border-left: none;\n      }\n      50% {\n          border-bottom-color: var(--color, #aaa);\n          position: relative;\n          line-height: calc(var(--size, 1) * 12px);\n          border-left: none;\n      }\n    }\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/less-loader/dist/cjs.js!./src/theme/main.less":
/*!**********************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/less-loader/dist/cjs.js!./src/theme/main.less ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports
exports.i(__webpack_require__(/*! -!../../node_modules/css-loader!jquery.terminal/css/jquery.terminal.css */ "./node_modules/css-loader/index.js!./node_modules/jquery.terminal/css/jquery.terminal.css"), "");
exports.i(__webpack_require__(/*! -!../../node_modules/css-loader!tether-drop/dist/css/drop-theme-twipsy.css */ "./node_modules/css-loader/index.js!./node_modules/tether-drop/dist/css/drop-theme-twipsy.css"), "");
exports.i(__webpack_require__(/*! -!../../node_modules/css-loader!noty/lib/noty.css */ "./node_modules/css-loader/index.js!./node_modules/noty/lib/noty.css"), "");

// module
exports.push([module.i, ".terminal-wrap-custom .terminal .cmd {\n  height: 14px;\n}\n.terminal-wrap-custom .terminal .cmd .clipboard {\n  height: 14px;\n}\n.temp-terminal {\n  position: absolute;\n  top: -99999px;\n}\n.term-f-size-4 .terminal {\n  --size: 1.3;\n}\n.term-f-size-4 .terminal .cmd {\n  height: calc(18.2px);\n}\n.term-f-size-3 .terminal {\n  --size: 1.2;\n}\n.term-f-size-3 .terminal .cmd {\n  height: calc(16.8px);\n}\n.term-f-size-3 .terminal .cmd .clipboard {\n  height: calc(16.8px);\n}\n.term-f-size-2 .terminal {\n  --size: 1.1;\n}\n.term-f-size-2 .terminal .cmd {\n  height: calc(15.4px);\n}\n.term-f-size-2 .terminal .cmd .clipboard {\n  height: calc(15.4px);\n}\n.terminal-wrap-custom .t-matrix-w-0 td {\n  width: 100%;\n}\n.terminal-wrap-custom .t-matrix-w-1 td {\n  width: 50%;\n}\n.terminal-wrap-custom .t-matrix-w-2 td {\n  width: 33.33%;\n}\n.terminal-wrap-custom .t-matrix-w-3 td {\n  width: 25%;\n}\n.drop-element.drop-theme-twipsy .drop-content {\n  font-family: inherit;\n  padding: 10px;\n}\n.terminal-lds-hourglass {\n  display: inline-block;\n  position: relative;\n  width: 64px;\n  height: 64px;\n}\n.terminal-lds-hourglass:after {\n  content: \" \";\n  display: block;\n  border-radius: 50%;\n  width: 0;\n  height: 0;\n  margin: 6px;\n  box-sizing: border-box;\n  border: 26px solid #fff;\n  border-color: #fff transparent #fff transparent;\n  animation: lds-hourglass 1.2s infinite;\n}\n@keyframes lds-hourglass {\n  0% {\n    transform: rotate(0);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n  }\n  50% {\n    transform: rotate(900deg);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n  100% {\n    transform: rotate(1800deg);\n  }\n}\n.matrix-column {\n  display: inline-block;\n  float: left;\n  height: 125px;\n  margin-right: 20px;\n  padding: 10px;\n  cursor: pointer;\n  width: 25px;\n}\n.matrix-column:hover {\n  background: #7a43b6;\n}\n.matrix-table {\n  background: #fff;\n}\n.matrix-table td {\n  padding: 15px;\n  border: 1px solid #CCC;\n  cursor: pointer;\n}\n.matrix-table td:hover {\n  background-color: #7a43b6;\n}\n.terminal-menu-popover {\n  padding-left: 5px;\n  width: 100px;\n}\n.terminal-menu-popover.themes {\n  width: 150px;\n}\n.terminal-menu-popover.themes a {\n  padding: 5px 0;\n}\n.terminal-menu-popover.historyContext {\n  width: 200px;\n}\n.terminal-menu-popover.historyContext ul {\n  max-height: 400px;\n  overflow-y: auto;\n  padding: 0;\n}\n.terminal-menu-popover.historyContext ul li input {\n  vertical-align: middle;\n  margin: 0;\n}\n.terminal-menu-popover.historyContext ul li a:hover {\n  opacity: .7;\n}\n.terminal-menu-popover.historyContext ul li a:before {\n  content: \"\\26AC\";\n  margin-right: 5px;\n  font-size: 21px;\n  vertical-align: middle;\n}\n.terminal-menu-popover.historyContext ul li a.checked:before {\n  content: \"\\2714\";\n  margin-right: 5px;\n}\n.terminal-menu-popover a {\n  margin-left: 5px;\n  vertical-align: middle;\n  font-size: 12px;\n  display: block;\n  padding: 2px 0;\n  font-weight: bold;\n  color: #fff;\n}\n.terminal-menu-popover a:hover {\n  opacity: .7;\n}\n.terminal-menu-popover a:before {\n  content: \"\\26AC\";\n  margin-right: 5px;\n  font-size: 21px;\n  vertical-align: middle;\n}\n.terminal-menu-popover a.checked:before {\n  content: \"\\2714\";\n  margin-right: 5px;\n}\n.cmd .cursor {\n  border: 0;\n}\n.noty-wrap-text {\n  padding: 10px;\n  font-weight: bold;\n  font-size: 13px;\n  margin: 0;\n}\n.animated {\n  animation-duration: .5s;\n  animation-fill-mode: both;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n.fadeIn {\n  animation-name: fadeIn;\n}\n@keyframes fadeOut {\n  from {\n    opacity: 1;\n  }\n  to {\n    opacity: 0;\n  }\n}\n.fadeOut {\n  animation-name: fadeOut;\n}\n.terminal,\n.cmd {\n  color: transparent;\n  background-color: transparent;\n}\n#terminalContext {\n  width: 100%;\n  background: #fff;\n}\n.terminal-full-screen {\n  text-align: left;\n}\n.terminal-wrap-custom {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.terminal-wrap-custom .btn.active {\n  position: relative;\n}\n.terminal-wrap-custom .btn.active:before {\n  content: \"\\F00C\";\n  font: normal normal normal 11px/1 FontAwesome;\n  position: absolute;\n  top: 8px;\n  left: 7px;\n  font-size: 9px;\n  z-index: 3;\n}\n.terminal-wrap-custom .actions-btn-menu {\n  position: absolute;\n  padding: 10px;\n  z-index: 1;\n  right: 7px;\n  top: 0;\n}\n.terminal-wrap-custom .actions-btn-menu .btn {\n  padding: 3px 8px;\n}\n.terminal-wrap-custom .actions-btn-menu .btn i {\n  font-size: 23px;\n  vertical-align: middle;\n}\n.terminal-wrap-custom .pqQuotes {\n  vertical-align: top;\n  width: 445px;\n}\n.terminal-wrap-custom .pqQuotes .close {\n  top: 10px;\n  position: relative;\n}\n.terminal-wrap-custom .pqQuotes div.term-body-pq .pq-container {\n  padding: 15px 10px;\n  border-bottom: 1px solid #f3f3f3;\n  border-left: none;\n  border-right: none;\n}\n.terminal-wrap-custom .pqQuotes div.term-body-pq .pq-container .added-by {\n  float: right;\n}\n.terminal-wrap-custom .pqQuotes div.term-body-pq .pq-container:nth-child(even) {\n  background: #fff;\n}\n.terminal-wrap-custom .pqQuotes div.term-body-pq .pq-container:nth-child(odd) {\n  background: #f3f3f3;\n}\n.terminal-wrap-custom .pqQuotes .priceqoute-pre {\n  font-size: 11px;\n  padding: 5px;\n  color: #000;\n}\n.terminal-wrap-custom > .term-body {\n  width: 100%;\n  height: 100%;\n}\n.terminal-wrap-custom > .term-body .left {\n  position: relative;\n  height: 100%;\n}\n.terminal-wrap-custom > .term-body .menu {\n  width: 20%;\n  vertical-align: top;\n  padding: 9px;\n  background: #fff;\n}\n.terminal-wrap-custom > .term-body .menu .label {\n  font-weight: bold;\n  font-size: 12px;\n  padding: 10px 0;\n  color: #414141;\n}\n.terminal-wrap-custom > .term-body .menu .buttons .btn {\n  margin-right: 5px;\n}\n.terminal-wrap-custom > .term-body .menu .pcc-label {\n  position: absolute;\n  top: -5px;\n  right: -5px;\n  border: 1px solid;\n  padding: 0 3px;\n  background: #fff;\n  color: #511551;\n  border-radius: 15px;\n  font-size: 10px;\n}\n.terminal-wrap-custom > .term-body.minimized .menu {\n  width: 100px;\n}\n.terminal-wrap-custom > .term-body.minimized .menu .btn {\n  display: block;\n  width: 100%;\n  margin: 0 0 5px 0;\n}\n.terminal-wrap-custom > .term-body.minimized .menu .label {\n  text-align: center;\n  font-size: 10px;\n  display: block;\n}\n.terminal-wrap-custom .matrix-row .terminal {\n  border-right: 2px solid #fff;\n  border-bottom: 2px solid #fff;\n}\n.terminal-wrap-custom .terminal {\n  padding: 0;\n  float: left;\n}\n.terminal-wrap-custom .terminal.active {\n  background: red;\n}\n.terminal-wrap-custom .terminal .cmd {\n  font-weight: bold;\n  text-transform: uppercase;\n}\n.terminal-wrap-custom .terminal .usedCommand {\n  text-transform: uppercase;\n}\n.terminal-wrap-custom .terminal-output div span {\n  display: inline;\n}\n.terminal-wrap-custom div.terminal-wrapper {\n  height: auto;\n}\n/*\n.cmd .cursor.blink {\n\t-webkit-animation: terminal-blink2 1s infinite steps(1, start);\n\t-moz-animation: terminal-blink2 1s infinite steps(1, start);\n\t-ms-animation: terminal-blink2 1s infinite steps(1, start);\n\tanimation: terminal-blink2 1s infinite steps(1, start);\n}\n@-webkit-keyframes terminal-blink2 {\n\t0%, 100% {\n\t\tbackground-color: rgba(0,0,0,0.3);\n\t\tcolor: rgba(255,255,255,0.8);\n\t}\n\t50% {\n\t\tbackground-color: rgba(255,255,255,0.3);\n\t\tcolor: rgba(0,0,0,0.6);\n\t}\n}\n\n@-ms-keyframes terminal-blink2 {\n\t0%, 100% {\n\t\tbackground-color: rgba(0,0,0,0.3);\n\t\tcolor: rgba(255,255,255,0.8);\n\t}\n\t50% {\n\t\tbackground-color: rgba(255,255,255,0.3);\n\t\tcolor: rgba(0,0,0,0.6);\n\t}\n}\n\n@-moz-keyframes terminal-blink2 {\n\t0%, 100% {\n\t\tbackground-color: rgba(0,0,0,0.3);\n\t\tcolor: rgba(255,255,255,0.8);\n\t}\n\t50% {\n\t\tbackground-color: rgba(255,255,255,0.3);\n\t\tcolor: rgba(0,0,0,0.6);\n\t}\n}\n@keyframes terminal-blink2 {\n\t0%, 100% {\n\t\tbackground-color: rgba(0,0,0,0.3);\n\t\tcolor: rgba(255,255,255,0.8);\n\t}\n\t50% {\n\t\tbackground-color: rgba(255,255,255,0.3);\n\t\tcolor: rgba(0,0,0,0.6);\n\t}\n}*/\n@keyframes blink {\n  0% {\n    opacity: 1;\n  }\n  25% {\n    opacity: 0;\n  }\n  50% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@-webkit-keyframes blink {\n  0% {\n    opacity: 1;\n  }\n  25% {\n    opacity: 0;\n  }\n  50% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@-ms-keyframes blink {\n  0% {\n    opacity: 1;\n  }\n  25% {\n    opacity: 0;\n  }\n  50% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@-moz-keyframes blink {\n  0% {\n    opacity: 1;\n  }\n  25% {\n    opacity: 0;\n  }\n  50% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n.cmd .cursor.blink {\n  background: #ccc;\n  -webkit-animation: blink 1s infinite linear;\n  -moz-animation: blink 1s infinite linear;\n  -ms-animation: blink 1s infinite linear;\n  animation: blink 1s linear infinite;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/noty/lib/noty.css":
/*!******************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/noty/lib/noty.css ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".noty_layout_mixin, #noty_layout__top, #noty_layout__topLeft, #noty_layout__topCenter, #noty_layout__topRight, #noty_layout__bottom, #noty_layout__bottomLeft, #noty_layout__bottomCenter, #noty_layout__bottomRight, #noty_layout__center, #noty_layout__centerLeft, #noty_layout__centerRight {\n  position: fixed;\n  margin: 0;\n  padding: 0;\n  z-index: 9999999;\n  -webkit-transform: translateZ(0) scale(1, 1);\n          transform: translateZ(0) scale(1, 1);\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n  -webkit-font-smoothing: subpixel-antialiased;\n  filter: blur(0);\n  -webkit-filter: blur(0);\n  max-width: 90%; }\n\n#noty_layout__top {\n  top: 0;\n  left: 5%;\n  width: 90%; }\n\n#noty_layout__topLeft {\n  top: 20px;\n  left: 20px;\n  width: 325px; }\n\n#noty_layout__topCenter {\n  top: 5%;\n  left: 50%;\n  width: 325px;\n  -webkit-transform: translate(-webkit-calc(-50% - .5px)) translateZ(0) scale(1, 1);\n          transform: translate(calc(-50% - .5px)) translateZ(0) scale(1, 1); }\n\n#noty_layout__topRight {\n  top: 20px;\n  right: 20px;\n  width: 325px; }\n\n#noty_layout__bottom {\n  bottom: 0;\n  left: 5%;\n  width: 90%; }\n\n#noty_layout__bottomLeft {\n  bottom: 20px;\n  left: 20px;\n  width: 325px; }\n\n#noty_layout__bottomCenter {\n  bottom: 5%;\n  left: 50%;\n  width: 325px;\n  -webkit-transform: translate(-webkit-calc(-50% - .5px)) translateZ(0) scale(1, 1);\n          transform: translate(calc(-50% - .5px)) translateZ(0) scale(1, 1); }\n\n#noty_layout__bottomRight {\n  bottom: 20px;\n  right: 20px;\n  width: 325px; }\n\n#noty_layout__center {\n  top: 50%;\n  left: 50%;\n  width: 325px;\n  -webkit-transform: translate(-webkit-calc(-50% - .5px), -webkit-calc(-50% - .5px)) translateZ(0) scale(1, 1);\n          transform: translate(calc(-50% - .5px), calc(-50% - .5px)) translateZ(0) scale(1, 1); }\n\n#noty_layout__centerLeft {\n  top: 50%;\n  left: 20px;\n  width: 325px;\n  -webkit-transform: translate(0, -webkit-calc(-50% - .5px)) translateZ(0) scale(1, 1);\n          transform: translate(0, calc(-50% - .5px)) translateZ(0) scale(1, 1); }\n\n#noty_layout__centerRight {\n  top: 50%;\n  right: 20px;\n  width: 325px;\n  -webkit-transform: translate(0, -webkit-calc(-50% - .5px)) translateZ(0) scale(1, 1);\n          transform: translate(0, calc(-50% - .5px)) translateZ(0) scale(1, 1); }\n\n.noty_progressbar {\n  display: none; }\n\n.noty_has_timeout.noty_has_progressbar .noty_progressbar {\n  display: block;\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  height: 3px;\n  width: 100%;\n  background-color: #646464;\n  opacity: 0.2;\n  filter: alpha(opacity=10); }\n\n.noty_bar {\n  -webkit-backface-visibility: hidden;\n  -webkit-transform: translate(0, 0) translateZ(0) scale(1, 1);\n  -ms-transform: translate(0, 0) scale(1, 1);\n      transform: translate(0, 0) scale(1, 1);\n  -webkit-font-smoothing: subpixel-antialiased;\n  overflow: hidden; }\n\n.noty_effects_open {\n  opacity: 0;\n  -webkit-transform: translate(50%);\n      -ms-transform: translate(50%);\n          transform: translate(50%);\n  -webkit-animation: noty_anim_in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);\n          animation: noty_anim_in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);\n  -webkit-animation-fill-mode: forwards;\n          animation-fill-mode: forwards; }\n\n.noty_effects_close {\n  -webkit-animation: noty_anim_out 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);\n          animation: noty_anim_out 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);\n  -webkit-animation-fill-mode: forwards;\n          animation-fill-mode: forwards; }\n\n.noty_fix_effects_height {\n  -webkit-animation: noty_anim_height 75ms ease-out;\n          animation: noty_anim_height 75ms ease-out; }\n\n.noty_close_with_click {\n  cursor: pointer; }\n\n.noty_close_button {\n  position: absolute;\n  top: 2px;\n  right: 2px;\n  font-weight: bold;\n  width: 20px;\n  height: 20px;\n  text-align: center;\n  line-height: 20px;\n  background-color: rgba(0, 0, 0, 0.05);\n  border-radius: 2px;\n  cursor: pointer;\n  -webkit-transition: all .2s ease-out;\n  transition: all .2s ease-out; }\n\n.noty_close_button:hover {\n  background-color: rgba(0, 0, 0, 0.1); }\n\n.noty_modal {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  background-color: #000;\n  z-index: 10000;\n  opacity: .3;\n  left: 0;\n  top: 0; }\n\n.noty_modal.noty_modal_open {\n  opacity: 0;\n  -webkit-animation: noty_modal_in .3s ease-out;\n          animation: noty_modal_in .3s ease-out; }\n\n.noty_modal.noty_modal_close {\n  -webkit-animation: noty_modal_out .3s ease-out;\n          animation: noty_modal_out .3s ease-out;\n  -webkit-animation-fill-mode: forwards;\n          animation-fill-mode: forwards; }\n\n@-webkit-keyframes noty_modal_in {\n  100% {\n    opacity: .3; } }\n\n@keyframes noty_modal_in {\n  100% {\n    opacity: .3; } }\n\n@-webkit-keyframes noty_modal_out {\n  100% {\n    opacity: 0; } }\n\n@keyframes noty_modal_out {\n  100% {\n    opacity: 0; } }\n\n@keyframes noty_modal_out {\n  100% {\n    opacity: 0; } }\n\n@-webkit-keyframes noty_anim_in {\n  100% {\n    -webkit-transform: translate(0);\n            transform: translate(0);\n    opacity: 1; } }\n\n@keyframes noty_anim_in {\n  100% {\n    -webkit-transform: translate(0);\n            transform: translate(0);\n    opacity: 1; } }\n\n@-webkit-keyframes noty_anim_out {\n  100% {\n    -webkit-transform: translate(50%);\n            transform: translate(50%);\n    opacity: 0; } }\n\n@keyframes noty_anim_out {\n  100% {\n    -webkit-transform: translate(50%);\n            transform: translate(50%);\n    opacity: 0; } }\n\n@-webkit-keyframes noty_anim_height {\n  100% {\n    height: 0; } }\n\n@keyframes noty_anim_height {\n  100% {\n    height: 0; } }\n\n.noty_theme__relax.noty_bar {\n  margin: 4px 0;\n  overflow: hidden;\n  border-radius: 2px;\n  position: relative; }\n  .noty_theme__relax.noty_bar .noty_body {\n    padding: 10px; }\n  .noty_theme__relax.noty_bar .noty_buttons {\n    border-top: 1px solid #e7e7e7;\n    padding: 5px 10px; }\n\n.noty_theme__relax.noty_type__alert,\n.noty_theme__relax.noty_type__notification {\n  background-color: #fff;\n  border: 1px solid #dedede;\n  color: #444; }\n\n.noty_theme__relax.noty_type__warning {\n  background-color: #FFEAA8;\n  border: 1px solid #FFC237;\n  color: #826200; }\n  .noty_theme__relax.noty_type__warning .noty_buttons {\n    border-color: #dfaa30; }\n\n.noty_theme__relax.noty_type__error {\n  background-color: #FF8181;\n  border: 1px solid #e25353;\n  color: #FFF; }\n  .noty_theme__relax.noty_type__error .noty_buttons {\n    border-color: darkred; }\n\n.noty_theme__relax.noty_type__info,\n.noty_theme__relax.noty_type__information {\n  background-color: #78C5E7;\n  border: 1px solid #3badd6;\n  color: #FFF; }\n  .noty_theme__relax.noty_type__info .noty_buttons,\n  .noty_theme__relax.noty_type__information .noty_buttons {\n    border-color: #0B90C4; }\n\n.noty_theme__relax.noty_type__success {\n  background-color: #BCF5BC;\n  border: 1px solid #7cdd77;\n  color: darkgreen; }\n  .noty_theme__relax.noty_type__success .noty_buttons {\n    border-color: #50C24E; }\n\n.noty_theme__metroui.noty_bar {\n  margin: 4px 0;\n  overflow: hidden;\n  position: relative;\n  box-shadow: rgba(0, 0, 0, 0.298039) 0 0 5px 0; }\n  .noty_theme__metroui.noty_bar .noty_progressbar {\n    position: absolute;\n    left: 0;\n    bottom: 0;\n    height: 3px;\n    width: 100%;\n    background-color: #000;\n    opacity: 0.2;\n    filter: alpha(opacity=20); }\n  .noty_theme__metroui.noty_bar .noty_body {\n    padding: 1.25em;\n    font-size: 14px; }\n  .noty_theme__metroui.noty_bar .noty_buttons {\n    padding: 0 10px .5em 10px; }\n\n.noty_theme__metroui.noty_type__alert,\n.noty_theme__metroui.noty_type__notification {\n  background-color: #fff;\n  color: #1d1d1d; }\n\n.noty_theme__metroui.noty_type__warning {\n  background-color: #FA6800;\n  color: #fff; }\n\n.noty_theme__metroui.noty_type__error {\n  background-color: #CE352C;\n  color: #FFF; }\n\n.noty_theme__metroui.noty_type__info,\n.noty_theme__metroui.noty_type__information {\n  background-color: #1BA1E2;\n  color: #FFF; }\n\n.noty_theme__metroui.noty_type__success {\n  background-color: #60A917;\n  color: #fff; }\n\n.noty_theme__mint.noty_bar {\n  margin: 4px 0;\n  overflow: hidden;\n  border-radius: 2px;\n  position: relative; }\n  .noty_theme__mint.noty_bar .noty_body {\n    padding: 10px;\n    font-size: 14px; }\n  .noty_theme__mint.noty_bar .noty_buttons {\n    padding: 10px; }\n\n.noty_theme__mint.noty_type__alert,\n.noty_theme__mint.noty_type__notification {\n  background-color: #fff;\n  border-bottom: 1px solid #D1D1D1;\n  color: #2F2F2F; }\n\n.noty_theme__mint.noty_type__warning {\n  background-color: #FFAE42;\n  border-bottom: 1px solid #E89F3C;\n  color: #fff; }\n\n.noty_theme__mint.noty_type__error {\n  background-color: #DE636F;\n  border-bottom: 1px solid #CA5A65;\n  color: #fff; }\n\n.noty_theme__mint.noty_type__info,\n.noty_theme__mint.noty_type__information {\n  background-color: #7F7EFF;\n  border-bottom: 1px solid #7473E8;\n  color: #fff; }\n\n.noty_theme__mint.noty_type__success {\n  background-color: #AFC765;\n  border-bottom: 1px solid #A0B55C;\n  color: #fff; }\n\n.noty_theme__sunset.noty_bar {\n  margin: 4px 0;\n  overflow: hidden;\n  border-radius: 2px;\n  position: relative; }\n  .noty_theme__sunset.noty_bar .noty_body {\n    padding: 10px;\n    font-size: 14px;\n    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1); }\n  .noty_theme__sunset.noty_bar .noty_buttons {\n    padding: 10px; }\n\n.noty_theme__sunset.noty_type__alert,\n.noty_theme__sunset.noty_type__notification {\n  background-color: #073B4C;\n  color: #fff; }\n  .noty_theme__sunset.noty_type__alert .noty_progressbar,\n  .noty_theme__sunset.noty_type__notification .noty_progressbar {\n    background-color: #fff; }\n\n.noty_theme__sunset.noty_type__warning {\n  background-color: #FFD166;\n  color: #fff; }\n\n.noty_theme__sunset.noty_type__error {\n  background-color: #EF476F;\n  color: #fff; }\n  .noty_theme__sunset.noty_type__error .noty_progressbar {\n    opacity: .4; }\n\n.noty_theme__sunset.noty_type__info,\n.noty_theme__sunset.noty_type__information {\n  background-color: #118AB2;\n  color: #fff; }\n  .noty_theme__sunset.noty_type__info .noty_progressbar,\n  .noty_theme__sunset.noty_type__information .noty_progressbar {\n    opacity: .6; }\n\n.noty_theme__sunset.noty_type__success {\n  background-color: #06D6A0;\n  color: #fff; }\n\n.noty_theme__bootstrap-v3.noty_bar {\n  margin: 4px 0;\n  overflow: hidden;\n  position: relative;\n  border: 1px solid transparent;\n  border-radius: 4px; }\n  .noty_theme__bootstrap-v3.noty_bar .noty_body {\n    padding: 15px; }\n  .noty_theme__bootstrap-v3.noty_bar .noty_buttons {\n    padding: 10px; }\n  .noty_theme__bootstrap-v3.noty_bar .noty_close_button {\n    font-size: 21px;\n    font-weight: 700;\n    line-height: 1;\n    color: #000;\n    text-shadow: 0 1px 0 #fff;\n    filter: alpha(opacity=20);\n    opacity: .2;\n    background: transparent; }\n  .noty_theme__bootstrap-v3.noty_bar .noty_close_button:hover {\n    background: transparent;\n    text-decoration: none;\n    cursor: pointer;\n    filter: alpha(opacity=50);\n    opacity: .5; }\n\n.noty_theme__bootstrap-v3.noty_type__alert,\n.noty_theme__bootstrap-v3.noty_type__notification {\n  background-color: #fff;\n  color: inherit; }\n\n.noty_theme__bootstrap-v3.noty_type__warning {\n  background-color: #fcf8e3;\n  color: #8a6d3b;\n  border-color: #faebcc; }\n\n.noty_theme__bootstrap-v3.noty_type__error {\n  background-color: #f2dede;\n  color: #a94442;\n  border-color: #ebccd1; }\n\n.noty_theme__bootstrap-v3.noty_type__info,\n.noty_theme__bootstrap-v3.noty_type__information {\n  background-color: #d9edf7;\n  color: #31708f;\n  border-color: #bce8f1; }\n\n.noty_theme__bootstrap-v3.noty_type__success {\n  background-color: #dff0d8;\n  color: #3c763d;\n  border-color: #d6e9c6; }\n\n.noty_theme__bootstrap-v4.noty_bar {\n  margin: 4px 0;\n  overflow: hidden;\n  position: relative;\n  border: 1px solid transparent;\n  border-radius: .25rem; }\n  .noty_theme__bootstrap-v4.noty_bar .noty_body {\n    padding: .75rem 1.25rem; }\n  .noty_theme__bootstrap-v4.noty_bar .noty_buttons {\n    padding: 10px; }\n  .noty_theme__bootstrap-v4.noty_bar .noty_close_button {\n    font-size: 1.5rem;\n    font-weight: 700;\n    line-height: 1;\n    color: #000;\n    text-shadow: 0 1px 0 #fff;\n    filter: alpha(opacity=20);\n    opacity: .5;\n    background: transparent; }\n  .noty_theme__bootstrap-v4.noty_bar .noty_close_button:hover {\n    background: transparent;\n    text-decoration: none;\n    cursor: pointer;\n    filter: alpha(opacity=50);\n    opacity: .75; }\n\n.noty_theme__bootstrap-v4.noty_type__alert,\n.noty_theme__bootstrap-v4.noty_type__notification {\n  background-color: #fff;\n  color: inherit; }\n\n.noty_theme__bootstrap-v4.noty_type__warning {\n  background-color: #fcf8e3;\n  color: #8a6d3b;\n  border-color: #faebcc; }\n\n.noty_theme__bootstrap-v4.noty_type__error {\n  background-color: #f2dede;\n  color: #a94442;\n  border-color: #ebccd1; }\n\n.noty_theme__bootstrap-v4.noty_type__info,\n.noty_theme__bootstrap-v4.noty_type__information {\n  background-color: #d9edf7;\n  color: #31708f;\n  border-color: #bce8f1; }\n\n.noty_theme__bootstrap-v4.noty_type__success {\n  background-color: #dff0d8;\n  color: #3c763d;\n  border-color: #d6e9c6; }\n\n.noty_theme__semanticui.noty_bar {\n  margin: 4px 0;\n  overflow: hidden;\n  position: relative;\n  border: 1px solid transparent;\n  font-size: 1em;\n  border-radius: .28571429rem;\n  box-shadow: 0 0 0 1px rgba(34, 36, 38, 0.22) inset, 0 0 0 0 transparent; }\n  .noty_theme__semanticui.noty_bar .noty_body {\n    padding: 1em 1.5em;\n    line-height: 1.4285em; }\n  .noty_theme__semanticui.noty_bar .noty_buttons {\n    padding: 10px; }\n\n.noty_theme__semanticui.noty_type__alert,\n.noty_theme__semanticui.noty_type__notification {\n  background-color: #f8f8f9;\n  color: rgba(0, 0, 0, 0.87); }\n\n.noty_theme__semanticui.noty_type__warning {\n  background-color: #fffaf3;\n  color: #573a08;\n  box-shadow: 0 0 0 1px #c9ba9b inset, 0 0 0 0 transparent; }\n\n.noty_theme__semanticui.noty_type__error {\n  background-color: #fff6f6;\n  color: #9f3a38;\n  box-shadow: 0 0 0 1px #e0b4b4 inset, 0 0 0 0 transparent; }\n\n.noty_theme__semanticui.noty_type__info,\n.noty_theme__semanticui.noty_type__information {\n  background-color: #f8ffff;\n  color: #276f86;\n  box-shadow: 0 0 0 1px #a9d5de inset, 0 0 0 0 transparent; }\n\n.noty_theme__semanticui.noty_type__success {\n  background-color: #fcfff5;\n  color: #2c662d;\n  box-shadow: 0 0 0 1px #a3c293 inset, 0 0 0 0 transparent; }\n\n.noty_theme__nest.noty_bar {\n  margin: 0 0 15px 0;\n  overflow: hidden;\n  border-radius: 2px;\n  position: relative;\n  box-shadow: rgba(0, 0, 0, 0.098039) 5px 4px 10px 0; }\n  .noty_theme__nest.noty_bar .noty_body {\n    padding: 10px;\n    font-size: 14px;\n    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1); }\n  .noty_theme__nest.noty_bar .noty_buttons {\n    padding: 10px; }\n\n.noty_layout .noty_theme__nest.noty_bar {\n  z-index: 5; }\n\n.noty_layout .noty_theme__nest.noty_bar:nth-child(2) {\n  position: absolute;\n  top: 0;\n  margin-top: 4px;\n  margin-right: -4px;\n  margin-left: 4px;\n  z-index: 4;\n  width: 100%; }\n\n.noty_layout .noty_theme__nest.noty_bar:nth-child(3) {\n  position: absolute;\n  top: 0;\n  margin-top: 8px;\n  margin-right: -8px;\n  margin-left: 8px;\n  z-index: 3;\n  width: 100%; }\n\n.noty_layout .noty_theme__nest.noty_bar:nth-child(4) {\n  position: absolute;\n  top: 0;\n  margin-top: 12px;\n  margin-right: -12px;\n  margin-left: 12px;\n  z-index: 2;\n  width: 100%; }\n\n.noty_layout .noty_theme__nest.noty_bar:nth-child(5) {\n  position: absolute;\n  top: 0;\n  margin-top: 16px;\n  margin-right: -16px;\n  margin-left: 16px;\n  z-index: 1;\n  width: 100%; }\n\n.noty_layout .noty_theme__nest.noty_bar:nth-child(n+6) {\n  position: absolute;\n  top: 0;\n  margin-top: 20px;\n  margin-right: -20px;\n  margin-left: 20px;\n  z-index: -1;\n  width: 100%; }\n\n#noty_layout__bottomLeft .noty_theme__nest.noty_bar:nth-child(2),\n#noty_layout__topLeft .noty_theme__nest.noty_bar:nth-child(2) {\n  margin-top: 4px;\n  margin-left: -4px;\n  margin-right: 4px; }\n\n#noty_layout__bottomLeft .noty_theme__nest.noty_bar:nth-child(3),\n#noty_layout__topLeft .noty_theme__nest.noty_bar:nth-child(3) {\n  margin-top: 8px;\n  margin-left: -8px;\n  margin-right: 8px; }\n\n#noty_layout__bottomLeft .noty_theme__nest.noty_bar:nth-child(4),\n#noty_layout__topLeft .noty_theme__nest.noty_bar:nth-child(4) {\n  margin-top: 12px;\n  margin-left: -12px;\n  margin-right: 12px; }\n\n#noty_layout__bottomLeft .noty_theme__nest.noty_bar:nth-child(5),\n#noty_layout__topLeft .noty_theme__nest.noty_bar:nth-child(5) {\n  margin-top: 16px;\n  margin-left: -16px;\n  margin-right: 16px; }\n\n#noty_layout__bottomLeft .noty_theme__nest.noty_bar:nth-child(n+6),\n#noty_layout__topLeft .noty_theme__nest.noty_bar:nth-child(n+6) {\n  margin-top: 20px;\n  margin-left: -20px;\n  margin-right: 20px; }\n\n.noty_theme__nest.noty_type__alert,\n.noty_theme__nest.noty_type__notification {\n  background-color: #073B4C;\n  color: #fff; }\n  .noty_theme__nest.noty_type__alert .noty_progressbar,\n  .noty_theme__nest.noty_type__notification .noty_progressbar {\n    background-color: #fff; }\n\n.noty_theme__nest.noty_type__warning {\n  background-color: #FFD166;\n  color: #fff; }\n\n.noty_theme__nest.noty_type__error {\n  background-color: #EF476F;\n  color: #fff; }\n  .noty_theme__nest.noty_type__error .noty_progressbar {\n    opacity: .4; }\n\n.noty_theme__nest.noty_type__info,\n.noty_theme__nest.noty_type__information {\n  background-color: #118AB2;\n  color: #fff; }\n  .noty_theme__nest.noty_type__info .noty_progressbar,\n  .noty_theme__nest.noty_type__information .noty_progressbar {\n    opacity: .6; }\n\n.noty_theme__nest.noty_type__success {\n  background-color: #06D6A0;\n  color: #fff; }\n\n.noty_theme__light.noty_bar {\n  margin: 4px 0;\n  overflow: hidden;\n  border-radius: 2px;\n  position: relative; }\n  .noty_theme__light.noty_bar .noty_body {\n    padding: 10px; }\n  .noty_theme__light.noty_bar .noty_buttons {\n    border-top: 1px solid #e7e7e7;\n    padding: 5px 10px; }\n\n.noty_theme__light.noty_type__alert,\n.noty_theme__light.noty_type__notification {\n  background-color: #fff;\n  border: 1px solid #dedede;\n  color: #444; }\n\n.noty_theme__light.noty_type__warning {\n  background-color: #FFEAA8;\n  border: 1px solid #FFC237;\n  color: #826200; }\n  .noty_theme__light.noty_type__warning .noty_buttons {\n    border-color: #dfaa30; }\n\n.noty_theme__light.noty_type__error {\n  background-color: #ED7000;\n  border: 1px solid #e25353;\n  color: #FFF; }\n  .noty_theme__light.noty_type__error .noty_buttons {\n    border-color: darkred; }\n\n.noty_theme__light.noty_type__info,\n.noty_theme__light.noty_type__information {\n  background-color: #78C5E7;\n  border: 1px solid #3badd6;\n  color: #FFF; }\n  .noty_theme__light.noty_type__info .noty_buttons,\n  .noty_theme__light.noty_type__information .noty_buttons {\n    border-color: #0B90C4; }\n\n.noty_theme__light.noty_type__success {\n  background-color: #57C880;\n  border: 1px solid #7cdd77;\n  color: darkgreen; }\n  .noty_theme__light.noty_type__success .noty_buttons {\n    border-color: #50C24E; }", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/tether-drop/dist/css/drop-theme-twipsy.css":
/*!*******************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/tether-drop/dist/css/drop-theme-twipsy.css ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".drop-element, .drop-element:after, .drop-element:before, .drop-element *, .drop-element *:after, .drop-element *:before {\n  box-sizing: border-box; }\n\n.drop-element {\n  position: absolute;\n  display: none; }\n  .drop-element.drop-open {\n    display: block; }\n\n.drop-element.drop-theme-twipsy {\n  max-width: 100%;\n  max-height: 100%; }\n  .drop-element.drop-theme-twipsy .drop-content {\n    border-radius: 5px;\n    position: relative;\n    font-family: inherit;\n    background: #414141;\n    color: #fff;\n    padding: 1em;\n    font-size: 1.1em;\n    line-height: 1.5em; }\n    .drop-element.drop-theme-twipsy .drop-content:before {\n      content: \"\";\n      display: block;\n      position: absolute;\n      width: 0;\n      height: 0;\n      border-color: transparent;\n      border-width: 10px;\n      border-style: solid; }\n  .drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-center .drop-content {\n    margin-bottom: 10px; }\n    .drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-center .drop-content:before {\n      top: 100%;\n      left: 50%;\n      margin-left: -10px;\n      border-top-color: #414141; }\n  .drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-center .drop-content {\n    margin-top: 10px; }\n    .drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-center .drop-content:before {\n      bottom: 100%;\n      left: 50%;\n      margin-left: -10px;\n      border-bottom-color: #414141; }\n  .drop-element.drop-theme-twipsy.drop-element-attached-right.drop-element-attached-middle .drop-content {\n    margin-right: 10px; }\n    .drop-element.drop-theme-twipsy.drop-element-attached-right.drop-element-attached-middle .drop-content:before {\n      left: 100%;\n      top: 50%;\n      margin-top: -10px;\n      border-left-color: #414141; }\n  .drop-element.drop-theme-twipsy.drop-element-attached-left.drop-element-attached-middle .drop-content {\n    margin-left: 10px; }\n    .drop-element.drop-theme-twipsy.drop-element-attached-left.drop-element-attached-middle .drop-content:before {\n      right: 100%;\n      top: 50%;\n      margin-top: -10px;\n      border-right-color: #414141; }\n  .drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-left.drop-target-attached-bottom .drop-content {\n    margin-top: 10px; }\n    .drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-left.drop-target-attached-bottom .drop-content:before {\n      bottom: 100%;\n      left: 10px;\n      border-bottom-color: #414141; }\n  .drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-right.drop-target-attached-bottom .drop-content {\n    margin-top: 10px; }\n    .drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-right.drop-target-attached-bottom .drop-content:before {\n      bottom: 100%;\n      right: 10px;\n      border-bottom-color: #414141; }\n  .drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-left.drop-target-attached-top .drop-content {\n    margin-bottom: 10px; }\n    .drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-left.drop-target-attached-top .drop-content:before {\n      top: 100%;\n      left: 10px;\n      border-top-color: #414141; }\n  .drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-right.drop-target-attached-top .drop-content {\n    margin-bottom: 10px; }\n    .drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-right.drop-target-attached-top .drop-content:before {\n      top: 100%;\n      right: 10px;\n      border-top-color: #414141; }\n  .drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-right.drop-target-attached-left .drop-content {\n    margin-right: 10px; }\n    .drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-right.drop-target-attached-left .drop-content:before {\n      top: 10px;\n      left: 100%;\n      border-left-color: #414141; }\n  .drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-left.drop-target-attached-right .drop-content {\n    margin-left: 10px; }\n    .drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-left.drop-target-attached-right .drop-content:before {\n      top: 10px;\n      right: 100%;\n      border-right-color: #414141; }\n  .drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-right.drop-target-attached-left .drop-content {\n    margin-right: 10px; }\n    .drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-right.drop-target-attached-left .drop-content:before {\n      bottom: 10px;\n      left: 100%;\n      border-left-color: #414141; }\n  .drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-left.drop-target-attached-right .drop-content {\n    margin-left: 10px; }\n    .drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-left.drop-target-attached-right .drop-content:before {\n      bottom: 10px;\n      right: 100%;\n      border-right-color: #414141; }\n\n.drop-element.drop-theme-twipsy {\n  opacity: 0;\n  -webkit-transition: opacity 150ms;\n          transition: opacity 150ms; }\n  .drop-element.drop-theme-twipsy .drop-content {\n    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.2);\n    border-radius: 2px;\n    font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n    padding: 3px 8px;\n    line-height: 18px;\n    font-size: 11px; }\n  .drop-element.drop-theme-twipsy.drop-open-transitionend {\n    display: block; }\n  .drop-element.drop-theme-twipsy.drop-after-open {\n    opacity: 1; }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
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

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/jquery-param/jquery-param.js":
/*!*******************************************************************************************!*\
  !*** delegated ./node_modules/jquery-param/jquery-param.js from dll-reference vendor_lib ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(/*! dll-reference vendor_lib */ "dll-reference vendor_lib"))(15);

/***/ }),

/***/ "./node_modules/jquery.terminal/js/unix_formatting.js":
/*!****************************************************************************************************!*\
  !*** delegated ./node_modules/jquery.terminal/js/unix_formatting.js from dll-reference vendor_lib ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(/*! dll-reference vendor_lib */ "dll-reference vendor_lib"))(8);

/***/ }),

/***/ "./node_modules/keyboardevent-key-polyfill/index.js":
/*!**************************************************************************************************!*\
  !*** delegated ./node_modules/keyboardevent-key-polyfill/index.js from dll-reference vendor_lib ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(/*! dll-reference vendor_lib */ "dll-reference vendor_lib"))(7);

/***/ }),

/***/ "./node_modules/noty/lib/noty.js":
/*!*******************************************************************************!*\
  !*** delegated ./node_modules/noty/lib/noty.js from dll-reference vendor_lib ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(/*! dll-reference vendor_lib */ "dll-reference vendor_lib"))(11);

/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
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

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

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

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./node_modules/tether-drop/dist/js/drop.js":
/*!******************************************************************************************!*\
  !*** delegated ./node_modules/tether-drop/dist/js/drop.js from dll-reference vendor_lib ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(/*! dll-reference vendor_lib */ "dll-reference vendor_lib"))(12);

/***/ }),

/***/ "./node_modules/whatwg-fetch/fetch.js":
/*!************************************************************************************!*\
  !*** delegated ./node_modules/whatwg-fetch/fetch.js from dll-reference vendor_lib ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(/*! dll-reference vendor_lib */ "dll-reference vendor_lib"))(14);

/***/ }),

/***/ "./src/actions.es6":
/*!*************************!*\
  !*** ./src/actions.es6 ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UPDATE_STATE = exports.ADD_WHIDE_COLUMN = exports.CHANGE_FONT_SIZE = exports.SWITCH_TERMINAL = exports.CLOSE_PQ_WINDOW = exports.PQ_MODAL_SHOW = exports.HIDE_PQ_QUOTES = exports.SHOW_PQ_QUOTES = exports.PURGE_SCREENS = exports.GET_HISTORY = exports.CHANGE_INPUT_LANGUAGE = exports.DEV_CMD_STACK_RUN = exports.CHANGE_SESSION_BY_MENU = exports.CHANGE_STYLE = exports.UPDATE_CUR_GDS = exports.CHANGE_GDS = exports.CHANGE_ACTIVE_TERMINAL = exports.CHANGE_MATRIX = exports.INIT = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _state = __webpack_require__(/*! ./state */ "./src/state.es6");

var _gdsActions = __webpack_require__(/*! ./actions/gdsActions */ "./src/actions/gdsActions.es6");

var app = void 0;

var INIT = exports.INIT = function INIT(App) {
	app = App;

	(0, _state.setProvider)(function (State) {
		return app.getContainer().render(State);
	});

	UPDATE_STATE({
		requestId: app.params.requestId,
		gdsObjName: app.Gds.getCurrentName(),
		permissions: app.params.permissions,
		terminalThemes: app.params.terminalThemes,
		theme: app.curTheme,
		gdsObjIndex: app.gdsList.indexOf(app.Gds.getCurrentName())
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

	UPDATE_STATE((0, _gdsActions.change_gds)(app, gdsName));
};

var UPDATE_CUR_GDS = exports.UPDATE_CUR_GDS = function UPDATE_CUR_GDS(props) {
	(0, _state.setState)(_extends({}, (0, _gdsActions.update_cur_gds)(app, props)));
};

var CHANGE_STYLE = exports.CHANGE_STYLE = function CHANGE_STYLE(name) {
	app.changeStyle(name);
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
	(0, _state.getters)('clear'); // TO MANY REQUESTS;
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

		if (curTerminalId !== false) {
			terminal[curTerminalId].plugin.terminal.focus();
		}
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

/***/ }),

/***/ "./src/actions/gdsActions.es6":
/*!************************************!*\
  !*** ./src/actions/gdsActions.es6 ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.change_gds = exports.update_cur_gds = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = __webpack_require__(/*! ../constants */ "./src/constants.es6");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var update_cur_gds = exports.update_cur_gds = function update_cur_gds(app, _ref) {
	var canCreatePq = _ref.canCreatePq,
	    canCreatePqErrors = _ref.canCreatePqErrors,
	    area = _ref.area,
	    pcc = _ref.pcc,
	    startNewSession = _ref.startNewSession,
	    log = _ref.log;


	var sessionIndex = _constants.AREA_LIST.indexOf(area);

	// const newAction 	= {canCreatePq, canCreatePqErrors, sessionIndex};

	if (startNewSession) {
		app.Gds.update(_extends({ pcc: _defineProperty({}, sessionIndex, pcc) }, { canCreatePq: canCreatePq, canCreatePqErrors: canCreatePqErrors, sessionIndex: sessionIndex }));
	} else {
		app.Gds.updatePcc(_defineProperty({}, sessionIndex, pcc));
		app.Gds.update({ canCreatePq: canCreatePq, canCreatePqErrors: canCreatePqErrors, sessionIndex: sessionIndex });
	}

	return {
		gdsList: app.Gds.getList(),
		log: log,
		canCreatePq: canCreatePq
	};
};

var change_gds = exports.change_gds = function change_gds(app, gdsName) {
	app.Gds.setCurrent(gdsName);

	return {
		gdsObjName: app.Gds.getCurrentName(),
		gdsObjIndex: _constants.GDS_LIST.indexOf(gdsName)
	};
};

/***/ }),

/***/ "./src/app.es6":
/*!*********************!*\
  !*** ./src/app.es6 ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requests = __webpack_require__(/*! ./helpers/requests.es6 */ "./src/helpers/requests.es6");

var _actions = __webpack_require__(/*! ./actions */ "./src/actions.es6");

var _gds = __webpack_require__(/*! ./modules/gds */ "./src/modules/gds.es6");

var _main = __webpack_require__(/*! ./containers/main */ "./src/containers/main.es6");

var _main2 = _interopRequireDefault(_main);

var _pqParser = __webpack_require__(/*! ./modules/pqParser */ "./src/modules/pqParser.es6");

var _cookie = __webpack_require__(/*! ./helpers/cookie */ "./src/helpers/cookie.es6");

var _constants = __webpack_require__(/*! ./constants */ "./src/constants.es6");

__webpack_require__(/*! ./theme/main.less */ "./src/theme/main.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BORDER_SIZE = 2;

var TerminalApp = function () {
	function TerminalApp(_ref) {
		var settings = _ref.settings,
		    requestId = _ref.requestId,
		    buffer = _ref.buffer,
		    permissions = _ref.permissions,
		    PqPriceModal = _ref.PqPriceModal,
		    htmlRootId = _ref.htmlRootId,
		    agentId = _ref.agentId,
		    terminalThemes = _ref.terminalThemes,
		    commandUrl = _ref.commandUrl;

		_classCallCheck(this, TerminalApp);

		if (settings['common']['currentGds'] === 'galileo') {
			settings['common']['currentGds'] = 'apollo';
		}

		this.gdsList = _constants.GDS_LIST.filter(function (name) {
			return name !== 'galileo' || permissions;
		});

		this.Gds = new _gds.GDS({
			gdsList: settings.gds,
			activeName: settings['common']['currentGds'] || 'apollo',
			buffer: buffer || {},
			gdsSet: this.gdsList
		});

		this.params = { requestId: requestId, permissions: permissions, terminalThemes: terminalThemes };

		this.agentId = agentId;
		this.offset = 100; //menu

		this.pqParser = new _pqParser.PqParser(PqPriceModal);
		this.container = new _main2.default(htmlRootId);

		this.curTheme = (0, _cookie.cookieGet)('terminalTheme_' + agentId) || terminalThemes[0]['id'];
		this.changeStyle(this.curTheme);

		(0, _requests.setLink)(commandUrl);
		(0, _actions.INIT)(this);

		initGlobEvents();
	}

	_createClass(TerminalApp, [{
		key: 'changeStyle',
		value: function changeStyle(name) {
			(0, _cookie.cookieSet)('terminalTheme_' + this.agentId, name, 30);
			this.container.changeStyle(name);
		}
	}, {
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

		/*calculateMatrix2()
  {
  	const {rows, cells} = this.Gds.getCurrent().get('matrix');
  	const hasWide 		= this.Gds.getCurrent().get('hasWide');
  		const char 			= this.getCharLength();
  	const rowsSize 		= rows + 1;
  		const height 	= ( this.container.context.clientHeight / rowsSize );// - (rowsSize * 2);
  	const width 	= Math.floor( 	(this.container.context.clientWidth - this.getOffset()) / (cells + (hasWide ? 2 : 1) ) );
  		const numOf 	= {
  		numOfRows 	: Math.floor( height / char.height ),
  		numOfChars	: Math.floor( (width - 2) 	/ char.width )
  	};
  		const dimensions = {
  		char,
  		numOf,
  		terminalSize : {
  			width 	: width,
  			height 	: (numOf.numOfRows * char.height) + 2
  		},
  		parent 	: {
  			height	: this.container.context.clientHeight,
  			width 	: (this.container.context.clientWidth - this.getOffset())
  		}
  	};
  		this.Gds.updateMatrix(dimensions);
  		if (hasWide)
  	{
  		this.calculateHasWide( dimensions );
  	}
  		return this;
  }*/

	}, {
		key: 'calculateMatrix',
		value: function calculateMatrix() {
			var _Gds$getCurrent$get = this.Gds.getCurrent().get(),
			    matrix = _Gds$getCurrent$get.matrix,
			    hasWide = _Gds$getCurrent$get.hasWide;

			var rows = matrix.rows,
			    cells = matrix.cells;


			var char = this.getCharLength();

			var height = Math.floor(this.container.context.clientHeight / (rows + 1));
			var width = Math.floor((this.container.context.clientWidth - this.getOffset()) / (cells + (hasWide ? 2 : 1)));

			var numOf = {
				numOfRows: Math.floor((height - BORDER_SIZE) / char.height),
				numOfChars: Math.floor((width - BORDER_SIZE) / char.width) // - 2
			};

			var dimensions = {
				char: char,
				numOf: numOf,

				terminalSize: {
					width: width,
					height: numOf.numOfRows * char.height + BORDER_SIZE
				},

				parent: {
					height: this.container.context.clientHeight,
					width: this.container.context.clientWidth - this.getOffset()
				}
			};

			this.Gds.updateMatrix(dimensions);

			if (hasWide) {
				this.calculateHasWide(dimensions, rows);
			}

			return this;
		}
	}, {
		key: 'calculateHasWide',
		value: function calculateHasWide(dimensions, rows) {
			var numOfRows = Math.floor((dimensions.parent.height - 2) / dimensions.char.height);
			var height = dimensions.terminalSize.height * (rows + 1);

			var wideDimensions = {
				char: dimensions.char,

				numOf: {
					numOfRows: numOfRows,
					numOfChars: dimensions.numOf.numOfChars
				},

				terminalSize: {
					width: dimensions.terminalSize.width,
					height: height
				}
			};

			this.Gds.update({ wideDimensions: wideDimensions });
		}
	}, {
		key: 'runPnr',
		value: function runPnr(_ref2) {
			var pnrCode = _ref2.pnrCode,
			    _ref2$gdsName = _ref2.gdsName,
			    gdsName = _ref2$gdsName === undefined ? 'apollo' : _ref2$gdsName;

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
};

/***/ }),

/***/ "./src/components/PqQuotes.es6":
/*!*************************************!*\
  !*** ./src/components/PqQuotes.es6 ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.PqQuotes = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = __webpack_require__(/*! ../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

var _dom = __webpack_require__(/*! ../helpers/dom */ "./src/helpers/dom.es6");

var _dom2 = _interopRequireDefault(_dom);

var _actions = __webpack_require__(/*! ../actions */ "./src/actions.es6");

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
		key: "setState",
		value: function setState(_ref) {
			var pqToShow = _ref.pqToShow;

			return _get(PqQuotes.prototype.__proto__ || Object.getPrototypeOf(PqQuotes.prototype), "setState", this).call(this, {
				pqToShow: pqToShow
			});
		}
	}, {
		key: "_renderer",
		value: function _renderer() {
			this.context.classList.toggle('hidden', !this.state['pqToShow']);
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
		key: "setState",
		value: function setState(_ref2) {
			var pqToShow = _ref2.pqToShow;

			return _get(Body.prototype.__proto__ || Object.getPrototypeOf(Body.prototype), "setState", this).call(this, {
				pqToShow: pqToShow
			});
		}
	}, {
		key: "_renderer",
		value: function _renderer() {
			var _this3 = this;

			if (this.state['pqToShow']) {
				this.context.innerHTML = '';

				this.state['pqToShow'].result.map(function (pq) {

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

/***/ "./src/components/actionsMenu.es6":
/*!****************************************!*\
  !*** ./src/components/actionsMenu.es6 ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _terminalMatrix = __webpack_require__(/*! ./popovers/terminalMatrix.es6 */ "./src/components/popovers/terminalMatrix.es6");

var _terminalMatrix2 = _interopRequireDefault(_terminalMatrix);

var _component = __webpack_require__(/*! ../modules/component */ "./src/modules/component.es6");

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

/***/ "./src/components/menu/devButtons.es6":
/*!********************************************!*\
  !*** ./src/components/menu/devButtons.es6 ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DevButtons = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(/*! ../../helpers/dom.es6 */ "./src/helpers/dom.es6");

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(/*! ../../modules/buttonPopover.es6 */ "./src/modules/buttonPopover.es6");

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

var _actions = __webpack_require__(/*! ../../actions */ "./src/actions.es6");

var _component = __webpack_require__(/*! ../../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

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

var DevButtons = exports.DevButtons = function (_Component) {
	_inherits(DevButtons, _Component);

	function DevButtons() {
		_classCallCheck(this, DevButtons);

		// this.context.appendChild ( this.PqAddTest() );

		var _this3 = _possibleConstructorReturn(this, (DevButtons.__proto__ || Object.getPrototypeOf(DevButtons)).call(this, 'div'));

		_this3.attach(new CommandsBuffer({
			icon: '<span>Dev Buf</span>'
		}).getTrigger());
		return _this3;
	}

	// PqAddTest()
	// {
	// 	this.macros 			= Dom('span.btn btn-mozilla font-bold[PQ Dev]');
	// 	this.macros.onclick 	= PQ_MODAL_SHOW_DEV;
	//
	// 	return this.macros;
	// }

	// fullScreen()
	// {
	// 	this.macros 			= Dom('span.btn btn-primary font-bold[Full]');
	// 	this.macros.onclick 	= FULL_SCREEN;
	//
	// 	return this.macros;
	// }


	return DevButtons;
}(_component2.default);

/***/ }),

/***/ "./src/components/menu/gdsAreas.es6":
/*!******************************************!*\
  !*** ./src/components/menu/gdsAreas.es6 ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.GdsAreas = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = __webpack_require__(/*! ../../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

var _actions = __webpack_require__(/*! ../../actions */ "./src/actions.es6");

var _dom = __webpack_require__(/*! ../../helpers/dom */ "./src/helpers/dom.es6");

var _dom2 = _interopRequireDefault(_dom);

var _constants = __webpack_require__(/*! ../../constants */ "./src/constants.es6");

var _buttonPopover = __webpack_require__(/*! ../../modules/buttonPopover */ "./src/modules/buttonPopover.es6");

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GdsAreas = exports.GdsAreas = function (_Component) {
	_inherits(GdsAreas, _Component);

	function GdsAreas() {
		_classCallCheck(this, GdsAreas);

		return _possibleConstructorReturn(this, (GdsAreas.__proto__ || Object.getPrototypeOf(GdsAreas)).call(this, 'article'));
	}

	_createClass(GdsAreas, [{
		key: "setState",
		value: function setState(state) {
			var gdsList = state.gdsList,
			    gdsObjName = state.gdsObjName,
			    gdsObjIndex = state.gdsObjIndex;


			var current = gdsList[gdsObjIndex];

			return _get(GdsAreas.prototype.__proto__ || Object.getPrototypeOf(GdsAreas.prototype), "setState", this).call(this, {
				gdsObjName: gdsObjName,
				pcc: current.get('pcc'),
				sessionIndex: current.get('sessionIndex'),
				areaList: current.get('list'),
				gdsList: gdsList.map(function (name) {
					return name.props.name;
				})
			});
		}
	}, {
		key: "_renderer",
		value: function _renderer() {
			this.context.innerHTML = '';

			var buttons = new GdsButtons(this.state);

			this.context.appendChild(buttons.makeTrigger());

			buttons.makeAreas(this.context);
		}
	}]);

	return GdsAreas;
}(_component2.default);

var GdsButtons = function (_ButtonPopOver) {
	_inherits(GdsButtons, _ButtonPopOver);

	function GdsButtons(_ref) {
		var gdsObjName = _ref.gdsObjName,
		    gdsList = _ref.gdsList,
		    areaList = _ref.areaList,
		    sessionIndex = _ref.sessionIndex,
		    pcc = _ref.pcc;

		_classCallCheck(this, GdsButtons);

		var _this2 = _possibleConstructorReturn(this, (GdsButtons.__proto__ || Object.getPrototypeOf(GdsButtons)).call(this, { icon: gdsObjName }, 'div'));

		_this2.gdsname = gdsObjName;
		_this2.gdsList = gdsList;
		_this2.areaList = areaList;
		_this2.sessionIndex = sessionIndex;
		_this2.pcc = pcc;
		return _this2;
	}

	_createClass(GdsButtons, [{
		key: "makeTrigger",
		value: function makeTrigger() {
			return _get(GdsButtons.prototype.__proto__ || Object.getPrototypeOf(GdsButtons.prototype), "makeTrigger", this).call(this);
		}
	}, {
		key: "build",
		value: function build() {
			var _this3 = this;

			this.gdsList.map(function (name) {
				_this3.popContent.appendChild(_this3.gdsButton(name));
			});
		}
	}, {
		key: "gdsButton",
		value: function gdsButton(gdsName) {
			var _this4 = this;

			return (0, _dom2.default)("button.btn btn-sm btn-block btn-mint font-bold [" + gdsName + "]", {
				disabled: this.gdsname === gdsName,
				onclick: function onclick() {
					(0, _actions.CHANGE_GDS)(gdsName);
					_this4.popover.close();
				}
			});
		}
	}, {
		key: "makeAreas",
		value: function makeAreas(context) {
			var _this5 = this;

			this.areaList.map(function (area, index) {
				context.appendChild(_this5.makeArea(area, index));
			});
		}
	}, {
		key: "makeArea",
		value: function makeArea(area, index) {
			var isActive = this.sessionIndex === index;

			return (0, _dom2.default)("button.btn btn-sm btn-purple font-bold pos-rlt " + (isActive ? 'active' : ''), {

				innerHTML: area + (this.pcc[index] ? "<span class=\"pcc-label\">" + this.pcc[index] + "</span>" : ''),

				disabled: isActive,

				onclick: function onclick(e) {

					e.target.disabled = true;

					(0, _actions.CHANGE_SESSION_BY_MENU)(_constants.AREA_LIST[index]);
					// .catch( () => e.target.disabled = false )
				}
			});
		}
	}]);

	return GdsButtons;
}(_buttonPopover2.default);

/***/ }),

/***/ "./src/components/menu/languageButtons.es6":
/*!*************************************************!*\
  !*** ./src/components/menu/languageButtons.es6 ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.LanguageButtons = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _actions = __webpack_require__(/*! ../../actions */ "./src/actions.es6");

var _dom = __webpack_require__(/*! ../../helpers/dom */ "./src/helpers/dom.es6");

var _dom2 = _interopRequireDefault(_dom);

var _component = __webpack_require__(/*! ../../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

var _buttonPopover = __webpack_require__(/*! ../../modules/buttonPopover */ "./src/modules/buttonPopover.es6");

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

var _constants = __webpack_require__(/*! ../../constants */ "./src/constants.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LanguageButtons = exports.LanguageButtons = function (_Component) {
	_inherits(LanguageButtons, _Component);

	function LanguageButtons() {
		_classCallCheck(this, LanguageButtons);

		return _possibleConstructorReturn(this, (LanguageButtons.__proto__ || Object.getPrototypeOf(LanguageButtons)).call(this, 'article'));
	}

	_createClass(LanguageButtons, [{
		key: "setState",
		value: function setState(_ref) {
			var language = _ref.language;

			return _get(LanguageButtons.prototype.__proto__ || Object.getPrototypeOf(LanguageButtons.prototype), "setState", this).call(this, {
				language: language
			});
		}
	}, {
		key: "_renderer",
		value: function _renderer() {
			this.context.innerHTML = '';

			var buttons = new LanguageButton(this.state);

			this.context.appendChild(buttons.makeTrigger());
		}
	}]);

	return LanguageButtons;
}(_component2.default);

var LanguageButton = function (_ButtonPopOver) {
	_inherits(LanguageButton, _ButtonPopOver);

	function LanguageButton(_ref2) {
		var language = _ref2.language;

		_classCallCheck(this, LanguageButton);

		var _this2 = _possibleConstructorReturn(this, (LanguageButton.__proto__ || Object.getPrototypeOf(LanguageButton)).call(this, { icon: language }, 'div'));

		_this2.language = language;
		return _this2;
	}

	_createClass(LanguageButton, [{
		key: "makeTrigger",
		value: function makeTrigger() {
			return _get(LanguageButton.prototype.__proto__ || Object.getPrototypeOf(LanguageButton.prototype), "makeTrigger", this).call(this);
		}
	}, {
		key: "build",
		value: function build() {
			var _this3 = this;

			_constants.LANGUAGE_LIST.map(function (name) {

				var button = (0, _dom2.default)("button.btn btn-block btn-gold t-f-size-10 font-bold " + (_this3.language === name ? ' active' : '') + " [" + name + "]");

				button.addEventListener('click', function () {
					_this3.popover.close();
					(0, _actions.CHANGE_INPUT_LANGUAGE)(name);
				});

				_this3.popContent.appendChild(button);
			});
		}
	}]);

	return LanguageButton;
}(_buttonPopover2.default);

/***/ }),

/***/ "./src/components/menu/pqButton.es6":
/*!******************************************!*\
  !*** ./src/components/menu/pqButton.es6 ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _actions = __webpack_require__(/*! ../../actions */ "./src/actions.es6");

var _component = __webpack_require__(/*! ../../modules/component */ "./src/modules/component.es6");

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
		key: "setState",
		value: function setState(_ref) {
			var _ref$canCreatePq = _ref.canCreatePq,
			    canCreatePq = _ref$canCreatePq === undefined ? false : _ref$canCreatePq;

			return _get(PqButton.prototype.__proto__ || Object.getPrototypeOf(PqButton.prototype), "setState", this).call(this, {
				canCreatePq: canCreatePq
			});
		}
	}, {
		key: "_renderer",
		value: function _renderer(state) {
			this.context.disabled = state.canCreatePq !== true;
		}
	}]);

	return PqButton;
}(_component2.default);

exports.default = PqButton;

/***/ }),

/***/ "./src/components/menu/settingsButtons.es6":
/*!*************************************************!*\
  !*** ./src/components/menu/settingsButtons.es6 ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SettingsButtons = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _theme = __webpack_require__(/*! ../popovers/theme */ "./src/components/popovers/theme.es6");

var _theme2 = _interopRequireDefault(_theme);

var _history = __webpack_require__(/*! ../popovers/history */ "./src/components/popovers/history.es6");

var _textSize = __webpack_require__(/*! ../popovers/textSize */ "./src/components/popovers/textSize.es6");

var _textSize2 = _interopRequireDefault(_textSize);

var _dom = __webpack_require__(/*! ../../helpers/dom */ "./src/helpers/dom.es6");

var _dom2 = _interopRequireDefault(_dom);

var _component = __webpack_require__(/*! ../../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

var _actions = __webpack_require__(/*! ../../actions */ "./src/actions.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SettingsButtons = exports.SettingsButtons = function (_Component) {
	_inherits(SettingsButtons, _Component);

	function SettingsButtons() {
		_classCallCheck(this, SettingsButtons);

		return _possibleConstructorReturn(this, (SettingsButtons.__proto__ || Object.getPrototypeOf(SettingsButtons)).call(this, 'article'));
	}

	_createClass(SettingsButtons, [{
		key: "mount",
		value: function mount(_ref) {
			var _this2 = this;

			var theme = _ref.theme,
			    terminalThemes = _ref.terminalThemes;

			this.children({ theme: theme, terminalThemes: terminalThemes }).map(function (element) {
				return _this2.context.appendChild(element);
			});
		}
	}, {
		key: "children",
		value: function children(_ref2) {
			var theme = _ref2.theme,
			    terminalThemes = _ref2.terminalThemes;

			var Quotes = (0, _dom2.default)('button.btn btn-mozilla font-bold[Quotes]', { onclick: function onclick(e) {
					e.target.innerHTML = 'Loading...';

					(0, _actions.SHOW_PQ_QUOTES)().then(function () {
						e.target.innerHTML = 'Quotes';
					});
				} });

			var themeBtn = new _theme2.default({
				icon: '<i class="fa fa-paint-brush t-f-size-14"></i>',
				themes: terminalThemes,
				theme: theme
			}).getTrigger();

			var textSize = new _textSize2.default({
				icon: '<i class="fa fa-text-height t-f-size-14"></i>'
			}).getTrigger();

			var history = new _history.History({
				icon: '<i class="fa fa-history t-f-size-14"></i>'
			}).getTrigger();

			return [Quotes, themeBtn, textSize, history];
		}
	}]);

	return SettingsButtons;
}(_component2.default);

/***/ }),

/***/ "./src/components/menuPanel.es6":
/*!**************************************!*\
  !*** ./src/components/menuPanel.es6 ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pqButton = __webpack_require__(/*! ./menu/pqButton.es6 */ "./src/components/menu/pqButton.es6");

var _pqButton2 = _interopRequireDefault(_pqButton);

var _devButtons = __webpack_require__(/*! ./menu/devButtons.es6 */ "./src/components/menu/devButtons.es6");

var _dom = __webpack_require__(/*! ../helpers/dom.es6 */ "./src/helpers/dom.es6");

var _dom2 = _interopRequireDefault(_dom);

var _component = __webpack_require__(/*! ../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

var _settingsButtons = __webpack_require__(/*! ./menu/settingsButtons */ "./src/components/menu/settingsButtons.es6");

var _gdsAreas = __webpack_require__(/*! ./menu/gdsAreas */ "./src/components/menu/gdsAreas.es6");

var _languageButtons = __webpack_require__(/*! ./menu/languageButtons */ "./src/components/menu/languageButtons.es6");

var _logButton = __webpack_require__(/*! ./popovers/logButton */ "./src/components/popovers/logButton.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MenuPanel = function (_Component) {
	_inherits(MenuPanel, _Component);

	function MenuPanel() {
		_classCallCheck(this, MenuPanel);

		return _possibleConstructorReturn(this, (MenuPanel.__proto__ || Object.getPrototypeOf(MenuPanel)).call(this, 'aside.sideMenu'));
	}

	_createClass(MenuPanel, [{
		key: 'mount',
		value: function mount(state) {
			this.observe(new _settingsButtons.SettingsButtons());

			this.attach((0, _dom2.default)('span.label[Session]'));

			this.observe(new _gdsAreas.GdsAreas());

			this.attach((0, _dom2.default)('span.label[Input Language]'));

			this.observe(new _languageButtons.LanguageButtons());

			this.observe(new _pqButton2.default());

			if (state.permissions) {
				this.attach((0, _dom2.default)('span.label[Dev actions]'));

				this.append(new _devButtons.DevButtons());

				this.observe(new _logButton.LogButton());
			}
		}
	}]);

	return MenuPanel;
}(_component2.default);

exports.default = MenuPanel;

/***/ }),

/***/ "./src/components/popovers/history.es6":
/*!*********************************************!*\
  !*** ./src/components/popovers/history.es6 ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.History = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(/*! ../../helpers/dom.es6 */ "./src/helpers/dom.es6");

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(/*! ../../modules/buttonPopover.es6 */ "./src/modules/buttonPopover.es6");

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

var _actions = __webpack_require__(/*! ../../actions */ "./src/actions.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var buffer = [];

var History = exports.History = function (_ButtonPopOver) {
	_inherits(History, _ButtonPopOver);

	function History(params) {
		_classCallCheck(this, History);

		var _this = _possibleConstructorReturn(this, (History.__proto__ || Object.getPrototypeOf(History)).call(this, params, 'div.terminal-menu-popover historyContext'));

		_this.makeTrigger({
			onclick: function onclick() {
				return _this.askServer();
			}
		});
		return _this;
	}

	_createClass(History, [{
		key: 'askServer',
		value: function askServer() {
			var _this2 = this;

			buffer = [];
			this.popContent.innerHTML = '<div class="text-center"><div class="terminal-lds-hourglass"></div></div>';

			(0, _actions.GET_HISTORY)().then(function (response) {

				var c = new Context(response, _this2.popover);

				_this2.popContent.innerHTML = '';
				_this2.popContent.appendChild(c.context);

				c.finalize(_this2.popContent);
			});
		}
	}]);

	return History;
}(_buttonPopover2.default);

var Context = function () {
	function Context(response, popover) {
		_classCallCheck(this, Context);

		this.context = (0, _dom2.default)('div');

		this._makeBody(response);
		this._makeLaunchBtn(popover);
	}

	_createClass(Context, [{
		key: '_makeBody',
		value: function _makeBody(response) {
			var list = (0, _dom2.default)('ul.list');

			response.data.forEach(function (value) {

				var el = (0, _dom2.default)('a.t-pointer[' + value + ']', {
					onclick: function onclick() {
						el.classList.toggle('checked');
						buffer.push(value);
					}
				});

				var li = (0, _dom2.default)('li.m-b-xs');
				li.appendChild(el);

				list.appendChild(li);
			});

			this.context.appendChild(list);
			this.list = list;
		}
	}, {
		key: '_makeLaunchBtn',
		value: function _makeLaunchBtn(popover) {
			var el = (0, _dom2.default)('button.btn btn-sm btn-purple font-bold btn-block m-t[Perform]', {
				onclick: function onclick() {
					(0, _actions.DEV_CMD_STACK_RUN)(buffer);
					popover.close();
				}
			});

			this.context.appendChild(el);
		}
	}, {
		key: 'finalize',
		value: function finalize(popContent) {
			this.list.scrollTop = popContent.scrollHeight;
		}
	}]);

	return Context;
}();

/***/ }),

/***/ "./src/components/popovers/logButton.es6":
/*!***********************************************!*\
  !*** ./src/components/popovers/logButton.es6 ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Log = exports.LogButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _buttonPopover = __webpack_require__(/*! ../../modules/buttonPopover */ "./src/modules/buttonPopover.es6");

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

var _component = __webpack_require__(/*! ../../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

var _dom = __webpack_require__(/*! ../../helpers/dom */ "./src/helpers/dom.es6");

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LogButton = exports.LogButton = function (_Component) {
	_inherits(LogButton, _Component);

	function LogButton() {
		_classCallCheck(this, LogButton);

		return _possibleConstructorReturn(this, (LogButton.__proto__ || Object.getPrototypeOf(LogButton)).call(this, 'div'));
	}

	_createClass(LogButton, [{
		key: "setState",
		value: function setState(_ref) {
			var log = _ref.log;

			return _get(LogButton.prototype.__proto__ || Object.getPrototypeOf(LogButton.prototype), "setState", this).call(this, { log: log });
		}
	}, {
		key: "mount",
		value: function mount() {
			var trigger = new Log(this.state);

			this.context.appendChild(trigger.makeTrigger());

			this.log = trigger;
		}
	}, {
		key: "_renderer",
		value: function _renderer() {
			this.log.update(this.state);
		}
	}]);

	return LogButton;
}(_component2.default);

var Log = exports.Log = function (_ButtonPopOver) {
	_inherits(Log, _ButtonPopOver);

	function Log() {
		_classCallCheck(this, Log);

		var _this2 = _possibleConstructorReturn(this, (Log.__proto__ || Object.getPrototypeOf(Log)).call(this, { icon: 'Log' }, 'div', { style: 'width : 300px; max-height : 300px; overflow : auto' }));

		_this2.log = [];
		return _this2;
	}

	_createClass(Log, [{
		key: "update",
		value: function update(_ref2) {
			var _ref2$log = _ref2.log,
			    log = _ref2$log === undefined ? [] : _ref2$log;

			if (log.length) {
				this.log = [].concat(_toConsumableArray(this.log), [[].concat(_toConsumableArray(log))]);
				this.popover = false;
			}

			this.trigger.classList.toggle('hidden', this.log.length === 0);
		}
	}, {
		key: "build",
		value: function build() {
			var _this3 = this;

			this.popContent.innerHTML = '';

			this.log.reverse().forEach(function (cmdArray) {

				var cmdContainer = (0, _dom2.default)('div.m-t m-b');

				cmdArray.forEach(function (obj) {

					cmdContainer.appendChild((0, _dom2.default)("div.font-bold text-" + obj.type + "[" + obj.text + "]"));
				});

				_this3.popContent.appendChild(cmdContainer);
			});
		}
	}]);

	return Log;
}(_buttonPopover2.default);

/***/ }),

/***/ "./src/components/popovers/terminalMatrix.es6":
/*!****************************************************!*\
  !*** ./src/components/popovers/terminalMatrix.es6 ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(/*! ../../helpers/dom.es6 */ "./src/helpers/dom.es6");

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(/*! ../../modules/buttonPopover.es6 */ "./src/modules/buttonPopover.es6");

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

var _actions = __webpack_require__(/*! ../../actions */ "./src/actions.es6");

var _constants = __webpack_require__(/*! ../../constants */ "./src/constants.es6");

var _helpers = __webpack_require__(/*! ../../helpers/helpers */ "./src/helpers/helpers.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cellObj = [];

var HOVER_CLASS = 'bg-purple';
var ACTIVE_CLASS = 'bg-info';

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
			var wideButton = new _dom2.default('div.bg-white matrix-column', {
				onclick: function onclick(e) {
					e.target.classList.toggle(ACTIVE_CLASS);
					e.target.classList.toggle('bg-white');
					(0, _actions.ADD_WHIDE_COLUMN)();
				}
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

			this.popContent.appendChild(wideButton);

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
			cell.className = 'matrix-p-row';

			cellObj[rIndex].push(cell);

			cell.addEventListener('click', function () {

				// this.popover.close();

				var cellsSelected = [];

				Array.apply(null, { length: rIndex + 1 }).map(function (y, yIndex) {
					Array.apply(null, { length: cIndex + 1 }).map(function (x, xIndex) {
						return cellsSelected.push(yIndex * _constants.MAX_ROWS + xIndex);
					});
				});

				_this3._removeClass(ACTIVE_CLASS);
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
				return _this3._addColor(rIndex, cIndex, HOVER_CLASS);
			});
			cell.addEventListener('mouseleave', function () {
				return _this3._removeClass(HOVER_CLASS);
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
	}, {
		key: '_removeClass',
		value: function _removeClass(className) {
			[].forEach.call(this.popContent.querySelectorAll('.matrix-p-row.' + className), function (cell) {
				return cell.classList.remove(className);
			});
		}
	}]);

	return Matrix;
}(_buttonPopover2.default);

exports.default = Matrix;

/***/ }),

/***/ "./src/components/popovers/textSize.es6":
/*!**********************************************!*\
  !*** ./src/components/popovers/textSize.es6 ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(/*! ../../helpers/dom.es6 */ "./src/helpers/dom.es6");

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(/*! ../../modules/buttonPopover.es6 */ "./src/modules/buttonPopover.es6");

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

var _actions = __webpack_require__(/*! ../../actions */ "./src/actions.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextSize = function (_ButtonPopOver) {
	_inherits(TextSize, _ButtonPopOver);

	function TextSize(params) {
		_classCallCheck(this, TextSize);

		var _this = _possibleConstructorReturn(this, (TextSize.__proto__ || Object.getPrototypeOf(TextSize)).call(this, params, 'div.terminal-menu-popover'));

		_this.makeTrigger();

		_this.curFont = 1;
		_this.curBtn = '';
		return _this;
	}

	_createClass(TextSize, [{
		key: 'build',
		value: function build(list) {
			var _this2 = this;

			var buttons = [1, 2, 3, 4].map(function (value) {

				var button = (0, _dom2.default)('a.t-pointer ' + (_this2.curFont === value) + ' [' + value + ']x');

				button.addEventListener('click', function () {
					_this2.curBtn.classList.remove('checked');

					_this2.toggle(button);
					_this2.click(value);
				});

				_this2.popContent.appendChild(button);

				return button;
			});

			this.toggle(buttons[0]);
		}
	}, {
		key: 'click',
		value: function click(value) {
			this.popover.close();
			this.curFont = value;
			(0, _actions.CHANGE_FONT_SIZE)({ fontSize: value });
		}
	}, {
		key: 'toggle',
		value: function toggle(button) {
			this.curBtn = button;
			this.curBtn.classList.toggle('checked');
		}
	}]);

	return TextSize;
}(_buttonPopover2.default);

exports.default = TextSize;

/***/ }),

/***/ "./src/components/popovers/theme.es6":
/*!*******************************************!*\
  !*** ./src/components/popovers/theme.es6 ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(/*! ../../helpers/dom.es6 */ "./src/helpers/dom.es6");

var _dom2 = _interopRequireDefault(_dom);

var _buttonPopover = __webpack_require__(/*! ../../modules/buttonPopover.es6 */ "./src/modules/buttonPopover.es6");

var _buttonPopover2 = _interopRequireDefault(_buttonPopover);

var _actions = __webpack_require__(/*! ../../actions */ "./src/actions.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Theme = function (_ButtonPopOver) {
	_inherits(Theme, _ButtonPopOver);

	function Theme(_ref) {
		var icon = _ref.icon,
		    themes = _ref.themes,
		    theme = _ref.theme;

		_classCallCheck(this, Theme);

		var _this = _possibleConstructorReturn(this, (Theme.__proto__ || Object.getPrototypeOf(Theme)).call(this, { icon: icon }, 'div.terminal-menu-popover themes'));

		_this.themes = themes;
		_this.makeTrigger();

		_this.themeId = theme;
		return _this;
	}

	_createClass(Theme, [{
		key: 'build',
		value: function build() {
			var _this2 = this;

			if (this.themes.length) {
				this.themes.forEach(function (obj) {
					var button = (0, _dom2.default)('a.t-pointer ' + (_this2.themeId === obj.label) + ' [' + obj.label + ']');

					if (obj.id === parseInt(_this2.themeId)) {
						_this2.toggle(button);
					}

					button.addEventListener('click', function () {
						if (_this2.curBtn) {
							_this2.curBtn.classList.remove('checked');
						}

						_this2.toggle(button);
						_this2.onSelect(obj);
					});

					_this2.popContent.appendChild(button);
				});
			}
		}
	}, {
		key: 'onSelect',
		value: function onSelect(value) {
			var newThemeClass = value.id;
			this.themeId = value.id;

			(0, _actions.CHANGE_STYLE)(newThemeClass);
		}
	}, {
		key: 'toggle',
		value: function toggle(button) {
			this.curBtn = button;
			this.curBtn.classList.toggle('checked');
		}
	}]);

	return Theme;
}(_buttonPopover2.default);

exports.default = Theme;

/***/ }),

/***/ "./src/components/tempTerminal.es6":
/*!*****************************************!*\
  !*** ./src/components/tempTerminal.es6 ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.TempTerminal = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = __webpack_require__(/*! ../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

var _dom = __webpack_require__(/*! ../helpers/dom */ "./src/helpers/dom.es6");

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

/***/ "./src/components/terminalMatrix.es6":
/*!*******************************************!*\
  !*** ./src/components/terminalMatrix.es6 ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = __webpack_require__(/*! ../modules/component.es6 */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
		key: 'setState',
		value: function setState(_ref) {
			var gdsObjName = _ref.gdsObjName,
			    gdsObjIndex = _ref.gdsObjIndex,
			    gdsList = _ref.gdsList;

			var curGds = gdsList[gdsObjIndex];

			var _curGds$get = curGds.get(),
			    terminals = _curGds$get.terminals,
			    matrix = _curGds$get.matrix,
			    dimensions = _curGds$get.dimensions,
			    hasWide = _curGds$get.hasWide,
			    wideDimensions = _curGds$get.wideDimensions;

			return _get(TerminalsMatrix.prototype.__proto__ || Object.getPrototypeOf(TerminalsMatrix.prototype), 'setState', this).call(this, {
				terminals: terminals, matrix: matrix, dimensions: dimensions, gdsObjName: gdsObjName, hasWide: hasWide, wideDimensions: wideDimensions
			});
		}
	}, {
		key: '_renderer',
		value: function _renderer() {
			var _this2 = this;

			var _state = this.state,
			    dimensions = _state.dimensions,
			    matrix = _state.matrix,
			    terminals = _state.terminals,
			    hasWide = _state.hasWide,
			    wideDimensions = _state.wideDimensions;


			this.context.style.width = dimensions.parent.width + 'px';
			this.context.style.height = dimensions.parent.height + 'px';
			this.context.innerHTML = '';

			if (hasWide) {
				var wideTerminal = terminals.wide; //curGds.wideTerminal;

				wideTerminal.changeSize(wideDimensions);
				this.context.appendChild(wideTerminal.context);
			}

			matrix.list.forEach(function (index) {

				terminals[index].changeSize(dimensions);

				_this2.context.appendChild(terminals[index].context);

				terminals[index].context.scrollTop = terminals[index].context.scrollHeight;
			});
		}
	}]);

	return TerminalsMatrix;
}(_component2.default);

exports.default = TerminalsMatrix;

/***/ }),

/***/ "./src/constants.es6":
/*!***************************!*\
  !*** ./src/constants.es6 ***!
  \***************************/
/*! no static exports found */
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
var GDS_LIST = exports.GDS_LIST = ['apollo', 'sabre', 'amadeus', 'galileo'];
var MAX_ROWS = exports.MAX_ROWS = 4;
var MAX_CELLS = exports.MAX_CELLS = 4;
var DEFAULT_CELLS = exports.DEFAULT_CELLS = [0, 1, 5, 6];
var THEME_CLASS_NAME = exports.THEME_CLASS_NAME = 'terminaltheme_';
var LANGUAGE_LIST = exports.LANGUAGE_LIST = ['APOLLO', 'SABRE', 'AMADEUS'];

/***/ }),

/***/ "./src/containers/main.es6":
/*!*********************************!*\
  !*** ./src/containers/main.es6 ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = __webpack_require__(/*! ../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

var _sectionsWrap = __webpack_require__(/*! ./sectionsWrap */ "./src/containers/sectionsWrap.es6");

var _tempTerminal = __webpack_require__(/*! ../components/tempTerminal */ "./src/components/tempTerminal.es6");

var _constants = __webpack_require__(/*! ../constants */ "./src/constants.es6");

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

		_this.parent = document.getElementById(rootId);

		_this.parent.appendChild(_this.getContext());

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
	}, {
		key: "changeStyle",
		value: function changeStyle(themeName) {
			this.parent.classList.remove(_constants.THEME_CLASS_NAME + this.themeName);
			this.themeName = themeName;
			this.parent.classList.add(_constants.THEME_CLASS_NAME + themeName);
		}
	}]);

	return ContainerMain;
}(_component2.default);

exports.default = ContainerMain;

/***/ }),

/***/ "./src/containers/sectionsWrap.es6":
/*!*****************************************!*\
  !*** ./src/containers/sectionsWrap.es6 ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.TableSections = undefined;

var _component = __webpack_require__(/*! ../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

var _right = __webpack_require__(/*! ./sides/right */ "./src/containers/sides/right.es6");

var _actionsMenu = __webpack_require__(/*! ../components/actionsMenu */ "./src/components/actionsMenu.es6");

var _actionsMenu2 = _interopRequireDefault(_actionsMenu);

var _terminalMatrix = __webpack_require__(/*! ../components/terminalMatrix */ "./src/components/terminalMatrix.es6");

var _terminalMatrix2 = _interopRequireDefault(_terminalMatrix);

var _PqQuotes = __webpack_require__(/*! ../components/PqQuotes */ "./src/components/PqQuotes.es6");

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

/***/ "./src/containers/sides/right.es6":
/*!****************************************!*\
  !*** ./src/containers/sides/right.es6 ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.RightSide = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = __webpack_require__(/*! ../../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

var _menuPanel = __webpack_require__(/*! ../../components/menuPanel */ "./src/components/menuPanel.es6");

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
		key: "setState",
		value: function setState(_ref) {
			var hideMenu = _ref.hideMenu;

			return _get(RightSide.prototype.__proto__ || Object.getPrototypeOf(RightSide.prototype), "setState", this).call(this, {
				hideMenu: hideMenu
			});
		}
	}, {
		key: "_renderer",
		value: function _renderer() {
			this.context.classList.toggle('hidden', this.state.hideMenu);
		}
	}]);

	return RightSide;
}(_component2.default);

/***/ }),

/***/ "./src/helpers/cookie.es6":
/*!********************************!*\
  !*** ./src/helpers/cookie.es6 ***!
  \********************************/
/*! no static exports found */
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

/***/ "./src/helpers/debug.es6":
/*!*******************************!*\
  !*** ./src/helpers/debug.es6 ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.notify = exports.showUserMessages = exports.debugRequest = exports.Debug = undefined;

var _noty = __webpack_require__(/*! noty */ "./node_modules/noty/lib/noty.js");

var _noty2 = _interopRequireDefault(_noty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Debug = exports.Debug = function Debug(txt, type) {
	new _noty2.default({
		text: '<strong>' + txt + '</strong>',
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

/***/ "./src/helpers/dom.es6":
/*!*****************************!*\
  !*** ./src/helpers/dom.es6 ***!
  \*****************************/
/*! no static exports found */
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

/***/ "./src/helpers/helpers.es6":
/*!*********************************!*\
  !*** ./src/helpers/helpers.es6 ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getStorageMatrix = exports.getDate = exports.splitIntoLinesArr = exports.makePages = exports.getReplacement = undefined;

var _constants = __webpack_require__(/*! ../constants */ "./src/constants.es6");

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
	var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

	var d2 = new Date();
	var dPlus320 = new Date(d2.setDate(date + 320));
	var p320Date = dPlus320.getDate();

	var d3 = new Date();
	var dMinus45 = new Date(d3.setDate(date + 320));
	var m45Date = dMinus45.getDate();

	return {
		now: makeDate(date) + months[d.getMonth()],
		plus320: makeDate(p320Date) + months[dPlus320.getMonth()],
		minus45: makeDate(m45Date) + months[dMinus45.getMonth()]
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

/***/ "./src/helpers/keyBinding.es6":
/*!************************************!*\
  !*** ./src/helpers/keyBinding.es6 ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.pressedShortcuts = undefined;

var _helpers = __webpack_require__(/*! ./helpers.es6 */ "./src/helpers/helpers.es6");

var _actions = __webpack_require__(/*! ../actions */ "./src/actions.es6");

var _switchTerminal = __webpack_require__(/*! ../modules/switchTerminal */ "./src/modules/switchTerminal.es6");

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
					sabre: 'W/*',
					galileo: '.CD'
				};

				terminal.insert(f1[gds]);
				break;

			case 113:
				// F2
				var f2 = {
					apollo: 'S*AIR/',
					amadeus: 'DNA',
					sabre: 'W/*',
					galileo: '.AD'
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

			case 116:
				//F5
				var f5 = {
					apollo: 'SEM/2G52/AG',
					amadeus: 'AAA5E9H',
					sabre: 'AAA5E9H',
					galileo: 'SEM/711M/AG'
				};

				terminal.exec(f5[gds]);
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

			case 120:
				//F9
				var f9 = {
					apollo: 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					amadeus: 'AP SFO 800-750-2238-A',
					sabre: '91-800-750-2238-A',
					galileo: 'P.SFOR:800-750-2238 ASAP CUSTOMER SUPPORT'
				};

				terminal.exec(f9[gds]);
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
			var _f = {
				apollo: '0TURZZBK1YYZ' + plus320 + '-RETENTION LINE',
				amadeus: 'RU1AHK1SFO' + plus320 + '/RETENTION',
				sabre: '0OTHYYGK1/RETENTION' + plus320,
				galileo: '0TURZZBK1YYZ' + (0, _helpers.getDate)().minus45 + '-RETENTION LINE'
			};

			terminal.exec(_f[gds]);
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
				sabre: '7TAW/',
				galileo: 'T.TAU/'
			};

			terminal.exec(f11[gds] + (0, _helpers.getDate)().now);
			break;

		case 123:
			//F12
			var f12 = {
				apollo: 'R:',
				amadeus: 'RF',
				sabre: '6',
				galileo: 'R.'
			};

			terminal.exec(f12[gds] + window.apiData.auth.login.toUpperCase());
			break;

		default:
			return true;
	}

	return false;
};

/***/ }),

/***/ "./src/helpers/logger.es6":
/*!********************************!*\
  !*** ./src/helpers/logger.es6 ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.debugOutput = exports.loggerOutput = undefined;

var _debug = __webpack_require__(/*! ./debug */ "./src/helpers/debug.es6");

var loggerOutput = exports.loggerOutput = function loggerOutput(result, command) {

	var commands = [];

	var date = new Date();

	var localTime = date.toLocaleTimeString('en-GB').replace(/:\d+ /, ' ');

	commands.push({
		text: localTime + ' ' + command,
		type: 'white'
	});

	if (result['clearScreen']) commands.push({
		text: 'DEBUG: CLEAR SCREEN',
		type: 'info'
	});

	if (result['canCreatePq']) commands.push({
		text: 'CAN CREATE PQ',
		type: 'warning'
	});

	if (result['tabCommands'] && result['tabCommands'].length) commands.push({
		text: 'FOUND TAB COMMANDS',
		type: 'success'
	});

	if (result['pcc']) commands.push({
		text: 'CHANGE PCC',
		type: 'success'
	});

	return commands;
};

var debugOutput = exports.debugOutput = function debugOutput(result) {

	if (result['clearScreen']) (0, _debug.Debug)('CLEAR SCREEN', 'info');

	if (result['canCreatePq']) (0, _debug.Debug)('CAN CREATE PQ', 'warning');

	if (result['tabCommands'] && result['tabCommands'].length) (0, _debug.Debug)('FOUND TAB COMMANDS', 'success');

	if (result['pcc']) (0, _debug.Debug)('CHANGE PCC', 'success');
};

/***/ }),

/***/ "./src/helpers/requests.es6":
/*!**********************************!*\
  !*** ./src/helpers/requests.es6 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setLink = exports.get = undefined;

var _constants = __webpack_require__(/*! ../constants.es6 */ "./src/constants.es6");

__webpack_require__(/*! whatwg-fetch */ "./node_modules/whatwg-fetch/fetch.js");

var _debug = __webpack_require__(/*! ./debug */ "./src/helpers/debug.es6");

var JParam = __webpack_require__(/*! jquery-param */ "./node_modules/jquery-param/jquery-param.js");

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

/***/ "./src/lib/jquery-terminal.js":
/*!****************************************************************************!*\
  !*** delegated ./src/lib/jquery-terminal.js from dll-reference vendor_lib ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(/*! dll-reference vendor_lib */ "dll-reference vendor_lib"))(2);

/***/ }),

/***/ "./src/middleware/plugin.es6":
/*!***********************************!*\
  !*** ./src/middleware/plugin.es6 ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pagination = __webpack_require__(/*! ../modules/pagination.es6 */ "./src/modules/pagination.es6");

var _pagination2 = _interopRequireDefault(_pagination);

var _session = __webpack_require__(/*! ../modules/session.es6 */ "./src/modules/session.es6");

var _session2 = _interopRequireDefault(_session);

var _spinner = __webpack_require__(/*! ../modules/spinner.es6 */ "./src/modules/spinner.es6");

var _spinner2 = _interopRequireDefault(_spinner);

var _keyBinding = __webpack_require__(/*! ../helpers/keyBinding */ "./src/helpers/keyBinding.es6");

var _output = __webpack_require__(/*! ../modules/output.es6 */ "./src/modules/output.es6");

var _output2 = _interopRequireDefault(_output);

var _tabManager = __webpack_require__(/*! ../modules/tabManager.es6 */ "./src/modules/tabManager.es6");

var _tabManager2 = _interopRequireDefault(_tabManager);

var _f = __webpack_require__(/*! ../modules/f8.es6 */ "./src/modules/f8.es6");

var _f2 = _interopRequireDefault(_f);

var _history = __webpack_require__(/*! ../modules/history.es6 */ "./src/modules/history.es6");

var _history2 = _interopRequireDefault(_history);

var _helpers = __webpack_require__(/*! ../helpers/helpers.es6 */ "./src/helpers/helpers.es6");

var _actions = __webpack_require__(/*! ../actions */ "./src/actions.es6");

var _logger = __webpack_require__(/*! ../helpers/logger */ "./src/helpers/logger.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = __webpack_require__(/*! jquery */ "jquery");
window.$ = window.jQuery = $;

// require('jquery.terminal/js/jquery.terminal');
__webpack_require__(/*! ../lib/jquery-terminal */ "./src/lib/jquery-terminal.js");
__webpack_require__(/*! keyboardevent-key-polyfill */ "./node_modules/keyboardevent-key-polyfill/index.js").polyfill();

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

		this.pagination = new _pagination2.default();
		this.spinner = new _spinner2.default(this.terminal);
		this.outputLiner = new _output2.default(this.terminal, params);
		this.tabCommands = new _tabManager2.default();
		this.f8Reader = new _f2.default({
			terminal: this.terminal,
			gds: params.gds
		});

		this.history = new _history2.default(params.gds);
	}

	_createClass(TerminalPlugin, [{
		key: '_parseKeyBinds',
		value: function _parseKeyBinds(evt, terminal) {
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
		key: '_changeActiveTerm',
		value: function _changeActiveTerm() {
			// window.activeTerminal = this;
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
		value: function resize(_ref) {
			var numOfRows = _ref.numOfRows,
			    numOfChars = _ref.numOfChars,
			    charHeight = _ref.charHeight;

			this.settings.numOfRows = numOfRows;
			this.settings.numOfChars = numOfChars;

			this.terminal.settings().numChars = numOfChars;
			this.terminal.settings().numRows = numOfRows;
			this.terminal.resize();

			this.outputLiner.recalculate({ numOfRows: numOfRows, numOfChars: numOfChars, charHeight: charHeight });
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

				keydown: this._parseKeyBinds.bind(this),
				clickTimeout: 300,
				onTerminalChange: this._changeActiveTerm.bind(this),
				onBeforeCommand: this._checkBeforeEnter.bind(this),

				// onInit			: this._changeActiveTerm.bind(this),
				/*keymap		: {},*/

				exceptionHandler: function exceptionHandler(err) {
					console.warn('exc', err);
				}
			});
		}
	}, {
		key: '_checkSabreCommand',
		value: function _checkSabreCommand(command, terminal) {
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
		key: '_checkBeforeEnter',
		value: function _checkBeforeEnter(terminal, command) {
			var _this = this;

			if (this._checkSabreCommand(command, terminal)) {
				return command;
			}

			var before = function before() {

				_this.outputLiner.printOutput('');

				_this.spinner.start();

				_this.terminal.echo('[[;;;usedCommand;]>' + command.toUpperCase() + ']');

				return command.toUpperCase();
			};

			var output = function output(response) {
				_this.spinner.end();
				_this.parseBackEnd(response, command);
			};

			this.session.perform(before).then(output);

			return command;
		}
	}, {
		key: 'parseBackEnd',
		value: function parseBackEnd(_ref2, command) {
			var _ref2$data = _ref2.data,
			    data = _ref2$data === undefined ? {} : _ref2$data;

			this.lastCommand = command; // for history
			this.history.add(command);

			var _data = data,
			    output = _data.output;


			if (output) {
				if (output.trim() === '*') {
					this.terminal.update(-2, command + ' *');
					return false;
				}

				if (this.allowManualPaging) // sabre
					{
						var _settings = this.settings,
						    numOfRows = _settings.numOfRows,
						    numOfChars = _settings.numOfChars;


						this.terminal.echo(this.pagination.bindOutput(output, numOfRows - 1, numOfChars).print());
					} else {
					// this.terminal.echo(output);
					this.outputLiner.printOutput(output, data['clearScreen']);
				}
			}

			this.tabCommands.reset(data['tabCommands'], output);

			if (window.TerminalState.hasPermissions()) {
				data = _extends({}, data, { log: (0, _logger.loggerOutput)(data, command) });
			}

			(0, _actions.UPDATE_CUR_GDS)(data);
		}
	}]);

	return TerminalPlugin;
}();

exports.default = TerminalPlugin;

/***/ }),

/***/ "./src/modules/buttonPopover.es6":
/*!***************************************!*\
  !*** ./src/modules/buttonPopover.es6 ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tetherDrop = __webpack_require__(/*! tether-drop */ "./node_modules/tether-drop/dist/js/drop.js");

var _tetherDrop2 = _interopRequireDefault(_tetherDrop);

var _dom = __webpack_require__(/*! ../helpers/dom.es6 */ "./src/helpers/dom.es6");

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
		var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'div';
		var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		_classCallCheck(this, ButtonPopOver);

		this.settings = params;
		this.popContent = (0, _dom2.default)(context, attributes);
	}

	_createClass(ButtonPopOver, [{
		key: 'makeTrigger',
		value: function makeTrigger() {
			var _this = this;

			var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			this.trigger = (0, _dom2.default)('button.btn btn-primary font-bold', _extends({}, attributes, { innerHTML: this.settings.icon }));

			this.trigger.addEventListener('click', function () {
				return _this.makePopover();
			});

			return this.trigger;
		}
	}, {
		key: 'makePopover',
		value: function makePopover() {
			if (this.popover) {
				return false;
			}

			this.popover = new _tetherDrop2.default({
				target: this.getTrigger(),
				content: this.getPopContent(),
				classes: CLASS_NAME,
				position: 'left top',
				openOn: 'click'
			});

			if (this.settings.onOpen) {
				this.popover.on('open', this.settings.onOpen);
			}

			this.popover.open();
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
		value: function build() {}
	}]);

	return ButtonPopOver;
}();

exports.default = ButtonPopOver;

/***/ }),

/***/ "./src/modules/component.es6":
/*!***********************************!*\
  !*** ./src/modules/component.es6 ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = __webpack_require__(/*! ../helpers/dom */ "./src/helpers/dom.es6");

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

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
		key: 'setState',
		value: function setState(state) {
			if (JSON.stringify(state) === JSON.stringify(this.state)) {
				// console.log("IS EQUAL", state, this.state);
				return false;
			}

			this.state = _extends({}, state);

			return true;
		}
	}, {
		key: 'mount',
		value: function mount() {}
	}, {
		key: 'render',
		value: function render(_ref) {
			var state = _objectWithoutProperties(_ref, []);

			if (state) {
				this.mount(state); //only once
				this.mount = function () {};
			}

			if (typeof this._renderer === 'function') {
				var newState = this.setState(state); // if child has no state call parent

				// console.log(newState, this);

				if (newState) {
					this._renderer(state);
				}
			}

			this.observers.map(function (component) {
				return component.render(state);
			});

			return this.context;
		}
	}]);

	return Component;
}();

exports.default = Component;

/***/ }),

/***/ "./src/modules/f8.es6":
/*!****************************!*\
  !*** ./src/modules/f8.es6 ***!
  \****************************/
/*! no static exports found */
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
	},

	galileo: {
		cmd: 'SI.P /SSRDOCSYYHK1/////      / //       /',
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

/***/ "./src/modules/gds.es6":
/*!*****************************!*\
  !*** ./src/modules/gds.es6 ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.GDS = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gdsUnit = __webpack_require__(/*! ./gdsUnit */ "./src/modules/gdsUnit.es6");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GDS = exports.GDS = function () {
	function GDS(_ref) {
		var gdsList = _ref.gdsList,
		    _ref$buffer = _ref.buffer,
		    buffer = _ref$buffer === undefined ? {} : _ref$buffer,
		    activeName = _ref.activeName,
		    gdsSet = _ref.gdsSet;

		_classCallCheck(this, GDS);

		this.setCurrent(activeName);

		this.gdsSet = gdsSet.map(function (name) {
			var settings = gdsList[name] || {};
			var _buffer$gds = buffer.gds,
			    gds = _buffer$gds === undefined ? {} : _buffer$gds;


			return new _gdsUnit.GDS_UNIT(name, settings.area, gds);
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
			var _this = this;

			return this.gdsSet.filter(function (gds) {
				return _this.name === gds.get('name');
			})[0] || this.gdsSet[0];
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
			var _this2 = this;

			this.gdsSet = this.gdsSet.map(function (gds) {

				if (gds.get('name') === _this2.name) {
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
			var terminals = this.getCurrent().get('terminals');

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Object.keys(terminals)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var key = _step.value;

					if (terminals[key]) {
						terminals[key].clear();
					}
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
		}
	}, {
		key: '_getActiveTerminal',
		value: function _getActiveTerminal() {
			return this.getCurrent().getActiveTerminal();
		}
	}, {
		key: 'changeActive',
		value: function changeActive(index) {
			var terminal = this._getActiveTerminal();

			if (typeof terminal !== 'undefined') {
				terminal.context.classList.remove('activeWindow');
			}

			this.update({ curTerminalId: index }); // change current terminal
			this._getActiveTerminal().context.classList.add('activeWindow');

			// return this.getActiveTerminal().context; // for focus
		}
	}, {
		key: 'runCommand',
		value: function runCommand(command) {
			var terminal = this._getActiveTerminal();

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

/***/ "./src/modules/gdsUnit.es6":
/*!*********************************!*\
  !*** ./src/modules/gdsUnit.es6 ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.GDS_UNIT = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = __webpack_require__(/*! ../constants */ "./src/constants.es6");

var _terminal = __webpack_require__(/*! ./terminal */ "./src/modules/terminal.es6");

var _terminal2 = _interopRequireDefault(_terminal);

var _helpers = __webpack_require__(/*! ../helpers/helpers */ "./src/helpers/helpers.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GDS_UNIT = exports.GDS_UNIT = function () {
	function GDS_UNIT(name, area, buffer) {
		_classCallCheck(this, GDS_UNIT);

		this.props = {
			name: name,
			list: name === 'sabre' ? _constants.AREA_LIST : _constants.AREA_LIST.slice(0, -1),
			buffer: buffer[name],

			matrix: (0, _helpers.getStorageMatrix)(),
			sessionIndex: _constants.AREA_LIST.indexOf(area),
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

			return this.props[name];
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

			var terminals = _extends({}, this.get('terminals'));

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

/***/ "./src/modules/history.es6":
/*!*********************************!*\
  !*** ./src/modules/history.es6 ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = History;

var _actions = __webpack_require__(/*! ../actions */ "./src/actions.es6");

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

/***/ "./src/modules/output.es6":
/*!********************************!*\
  !*** ./src/modules/output.es6 ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(/*! ../helpers/helpers.es6 */ "./src/helpers/helpers.es6");

var _dom = __webpack_require__(/*! ../helpers/dom.es6 */ "./src/helpers/dom.es6");

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import Drop from "tether-drop";

var Output = function () {
	function Output(terminal, _ref) {
		var numOfChars = _ref.numOfChars,
		    numOfRows = _ref.numOfRows,
		    charHeight = _ref.charHeight;

		_classCallCheck(this, Output);

		this.terminal = terminal;

		this.emptyLines = 0;
		this.outputStrings = '';
		this.cmdLineOffset = '';
		this.clearScreen = false; // parameter for lifting up output with empty lines;

		this.numRows = numOfRows;
		this.numOfChars = numOfChars;
		this.charHeight = charHeight;

		this.context = (0, _dom2.default)('div.emptyLinesWrapper');
		this.terminal.cmd().after(this.context);
	}

	_createClass(Output, [{
		key: 'setOptions',
		value: function setOptions(_ref2) {
			var numOfRows = _ref2.numOfRows,
			    numOfChars = _ref2.numOfChars,
			    charHeight = _ref2.charHeight;

			this.numRows = numOfRows;
			this.numOfChars = numOfChars;
			this.charHeight = charHeight;
		}
	}, {
		key: 'recalculate',
		value: function recalculate(_ref3) //on view terminal change sizes
		{
			var numOfRows = _ref3.numOfRows,
			    numOfChars = _ref3.numOfChars,
			    charHeight = _ref3.charHeight;

			this.setOptions({ numOfRows: numOfRows, numOfChars: numOfChars, charHeight: charHeight });

			this._countEmpty()._attachEmpty()._scroll();
		}
	}, {
		key: '_getOutputLength',
		value: function _getOutputLength() {
			return (0, _helpers.splitIntoLinesArr)(this.outputStrings, this.numOfChars).length;
		}
	}, {
		key: '_countEmpty',
		value: function _countEmpty() {
			var _this = this;

			var outputRows = this.outputStrings ? this._getOutputLength() : 1;

			var rowsRemoveEmpty = function rowsRemoveEmpty() {
				return _this.emptyLines - outputRows;
			};
			var rowsToLift = function rowsToLift() {
				return _this.numRows - outputRows - 1;
			}; // 1 - cmd line

			this.emptyLines = this.clearScreen ? rowsToLift() : rowsRemoveEmpty();

			if (this.emptyLines < 0) {
				this.emptyLines = 0;
			}

			return this;
		}
	}, {
		key: '_printOutput',
		value: function _printOutput() {
			/*if (this.outputStrings.indexOf('warningMessage') !== -1)
   {
   	this.terminal.echo(this.outputStrings, {
   		finalize : (div) => {
   				const tip = div[0].querySelector('.warningMessage');
   				if (tip)
   			{
   				new Drop({
   					target		: tip,
   					content		: '<div class="t-f-size-16 font-bold">SUCCESS</div>',
   					classes		: 'drop-theme-twipsy',
   					openOn		: 'hover'
   				});
   			}
   		}
   	});
   } else
   {
   	this.terminal.echo(this.outputStrings)
   }*/

			this.terminal.echo(this.outputStrings);

			return this;
		}
	}, {
		key: '_attachEmpty',
		value: function _attachEmpty() {
			this.context.innerHTML = '';

			if (this.emptyLines > 0) {
				this.context.innerHTML = [].concat(_toConsumableArray(new Array(this.emptyLines + 1))).join('<div><span>&nbsp;</span></div>');
			}

			return this;
		}
	}, {
		key: '_scroll',
		value: function _scroll() {
			if (this.emptyLines === 0) {
				this.terminal.scroll().scroll(this.cmdLineOffset); // to first line, to desired line
			} else {
				this.terminal.scroll_to_bottom();
			}
		}
	}, {
		key: 'printOutput',
		value: function printOutput(output) {
			var isClearScreen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			this.outputStrings = output;
			this.clearScreen = isClearScreen;
			this.cmdLineOffset = this.terminal.cmd()[0].offsetTop; // - this.charHeight; // remember scrollTop height before the command so when clear flag screen is set scroll to this mark

			this._countEmpty()._printOutput()._attachEmpty()._scroll();
		}
	}]);

	return Output;
}();

exports.default = Output;

/***/ }),

/***/ "./src/modules/pagination.es6":
/*!************************************!*\
  !*** ./src/modules/pagination.es6 ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = __webpack_require__(/*! ../helpers/helpers.es6 */ "./src/helpers/helpers.es6");

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

/***/ "./src/modules/pqParser.es6":
/*!**********************************!*\
  !*** ./src/modules/pqParser.es6 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.PqParser = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requests = __webpack_require__(/*! ../helpers/requests */ "./src/helpers/requests.es6");

var _actions = __webpack_require__(/*! ../actions */ "./src/actions.es6");

var _debug = __webpack_require__(/*! ../helpers/debug */ "./src/helpers/debug.es6");

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

			document.querySelector('#spinners').classList.remove('hidden');
			document.querySelector('#loadingDots').classList.remove('loading-hidden');

			return (0, _requests.get)("terminal/priceQuote?rId=" + rId).then(function (response) {
				document.querySelector('#spinners').classList.add('hidden');
				document.querySelector('#loadingDots').classList.add('loading-hidden');

				// const pqError = [];//isPqError(response);
				var pqError = isPqError(response);
				return pqError.length ? throwError(pqError) : response;
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

/***/ "./src/modules/session.es6":
/*!*********************************!*\
  !*** ./src/modules/session.es6 ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requests = __webpack_require__(/*! ../helpers/requests.es6 */ "./src/helpers/requests.es6");

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
			if (!cmd) {
				return Promise.resolve('');
			}

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
		value: function perform(beforeFn) {
			var _this = this;

			beforeStack.push(beforeFn);

			return new Promise(function (resolve) {

				var promiseRun = _this._makePromise(resolve);

				//** if we have command running then push to current fn to stack else run it and push to promise **//
				if (!promises.length) {
					promises.push(promiseRun(resolve));
				} else {
					stack.push(promiseRun);
				}
			});
		}
	}, {
		key: '_makePromise',
		value: function _makePromise(resolve) {
			var _this2 = this;

			return function () {
				var cmd = beforeStack.shift();

				return _this2.run(cmd()).then(resolve) //output result
				.then(function () {

					var nextCmd = stack.shift();

					if (nextCmd) {
						return nextCmd();
					}

					promises = [];
				});
			};
		}
	}]);

	return Session;
}();

exports.default = Session;

/***/ }),

/***/ "./src/modules/spinner.es6":
/*!*********************************!*\
  !*** ./src/modules/spinner.es6 ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cliSpinners = __webpack_require__(/*! cli-spinners */ "./node_modules/cli-spinners/index.js");

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

/***/ "./src/modules/switchTerminal.es6":
/*!****************************************!*\
  !*** ./src/modules/switchTerminal.es6 ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.switchTerminal = undefined;

var _actions = __webpack_require__(/*! ../actions */ "./src/actions.es6");

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

/***/ "./src/modules/tabManager.es6":
/*!************************************!*\
  !*** ./src/modules/tabManager.es6 ***!
  \************************************/
/*! no static exports found */
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

/***/ "./src/modules/terminal.es6":
/*!**********************************!*\
  !*** ./src/modules/terminal.es6 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = __webpack_require__(/*! ../middleware/plugin.es6 */ "./src/middleware/plugin.es6");

var _plugin2 = _interopRequireDefault(_plugin);

var _dom = __webpack_require__(/*! ../helpers/dom.es6 */ "./src/helpers/dom.es6");

var _dom2 = _interopRequireDefault(_dom);

var _actions = __webpack_require__(/*! ../actions */ "./src/actions.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

__webpack_require__(/*! ../../node_modules/jquery.terminal/js/unix_formatting */ "./node_modules/jquery.terminal/js/unix_formatting.js");

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
				numOfChars: this.numOfChars,
				charHeight: this.charHeight
			});

			if (this.settings.name === 0) // when all terminals init at once first is current but never gets selected
				{
					(0, _actions.CHANGE_ACTIVE_TERMINAL)({ curTerminalId: 0 });
					this.plugin.terminal.enable();
				}
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
			    numOf = dimension.numOf,
			    terminalSize = dimension.terminalSize;


			this.numOfRows = numOf.numOfRows;
			this.numOfChars = numOf.numOfChars;

			this.charHeight = char.height;

			if (this.plugin) {
				this.plugin.resize({
					numOfChars: this.numOfChars,
					numOfRows: this.numOfRows,
					charHeight: this.charHeight
				});
			} else {
				this.initPlugin();
			}

			this.context.style.width = terminalSize.width + 'px';
			this.context.style.height = terminalSize.height + 'px';

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

/***/ "./src/state.es6":
/*!***********************!*\
  !*** ./src/state.es6 ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setProvider = exports.getters = exports.setState = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _requests = __webpack_require__(/*! ./helpers/requests */ "./src/helpers/requests.es6");

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

	if (State.permissions) console.log('STATE:', State);

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

/***/ "./src/theme/main.less":
/*!*****************************!*\
  !*** ./src/theme/main.less ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../node_modules/css-loader!../../node_modules/less-loader/dist/cjs.js!./main.less */ "./node_modules/css-loader/index.js!./node_modules/less-loader/dist/cjs.js!./src/theme/main.less");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/app.es6 ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/app.es6 */"./src/app.es6");


/***/ }),

/***/ "dll-reference vendor_lib":
/*!*****************************!*\
  !*** external "vendor_lib" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = vendor_lib;

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ })

/******/ });
//# sourceMappingURL=terminal-bundle.js.map