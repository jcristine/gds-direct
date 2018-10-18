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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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

/***/ "./node_modules/css-loader/index.js!./node_modules/jquery.terminal/css/jquery.terminal.min.css":
/*!********************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/jquery.terminal/css/jquery.terminal.min.css ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "/*!\n *       __ _____                     ________                              __\n *      / // _  /__ __ _____ ___ __ _/__  ___/__ ___ ______ __ __  __ ___  / /\n *  __ / // // // // // _  // _// // / / // _  // _//     // //  \\/ // _ \\/ /\n * /  / // // // // // ___// / / // / / // ___// / / / / // // /\\  // // / /__\n * \\___//____ \\\\___//____//_/ _\\_  / /_//____//_/ /_/ /_//_//_/ /_/ \\__\\_\\___/\n *           \\/              /____/                              version DEV\n * http://terminal.jcubic.pl\n *\n * This file is part of jQuery Terminal.\n *\n * Copyright (c) 2011-2017 Jakub Jankiewicz <http://jcubic.pl>\n * Released under the MIT license\n *\n * Date: Tue, 12 Sep 2017 07:04:06 +0000\n */.cmd .format,.cmd .prompt,.cmd .prompt div,.terminal .terminal-output .format,.terminal .terminal-output div div{display:inline-block}.cmd,.terminal h1,.terminal h2,.terminal h3,.terminal h4,.terminal h5,.terminal h6,.terminal pre{margin:0}.terminal h1,.terminal h2,.terminal h3,.terminal h4,.terminal h5,.terminal h6{line-height:1.2em}.cmd .clipboard{position:absolute;left:-16px;top:0;width:20px;height:16px;background:transparent;border:none;color:transparent;outline:none;padding:0;resize:none;z-index:0;overflow:hidden}.terminal .error{color:red}.terminal{position:relative;overflow-y:auto;overflow-x:hidden}.terminal>div{height:100%}.cmd{padding:0;position:relative;float:left}.cmd .inverted,.terminal .inverted{background-color:#aaa;color:#000}.cmd .cursor{border-bottom:3px solid transparent;margin-bottom:-3px;background-clip:content-box}.cmd .cursor.blink{-webkit-animation:a 1s infinite step-start;animation:a 1s infinite step-start;border-left:1px solid transparent;margin-left:-1px}.bar.cmd .inverted,.bar.terminal .inverted{border-left-color:#aaa}.cmd .prompt,.terminal .terminal-output div div{display:block;line-height:14px;height:auto}.cmd .prompt>span{float:left}.cmd,.terminal{font-family:monospace;color:#aaa;background-color:#000;font-size:12px;line-height:14px;box-sizing:border-box}.cmd div{float:left}.cmd div,.cmd div+span{clear:both}.cmd .prompt+div{clear:right}.terminal-output>div{min-height:14px}.terminal-output>div>div *{overflow-wrap:break-word;word-wrap:break-word}.terminal .terminal-output div span{display:inline-block}.cmd>span:not(.prompt){float:left}.cmd .prompt span.line{display:block;float:none}.cmd div,.cmd span,.terminal-output a,.terminal-output span,.terminal h1,.terminal h2,.terminal h3,.terminal h4,.terminal h5,.terminal h6,.terminal pre,.terminal td{-webkit-touch-callout:initial;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text}.terminal,.terminal-output,.terminal-output div{-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}@-moz-document url-prefix(){.terminal,.terminal-output,.terminal-output div{-webkit-touch-callout:initial;-webkit-user-select:initial;-moz-user-select:initial;-ms-user-select:initial;user-select:auto}}.terminal table{border-collapse:collapse}.terminal td{border:1px solid #aaa}.cmd .prompt span::-moz-selection,.cmd>div::-moz-selection,.cmd>div span::-moz-selection,.cmd>span::-moz-selection,.cmd>span span::-moz-selection,.cmd div::-moz-selection,.terminal .terminal-output div div::-moz-selection,.terminal .terminal-output div div a::-moz-selection,.terminal .terminal-output div span::-moz-selection,.terminal h1::-moz-selection,.terminal h2::-moz-selection,.terminal h3::-moz-selection,.terminal h4::-moz-selection,.terminal h5::-moz-selection,.terminal h6::-moz-selection,.terminal pre::-moz-selection,.terminal td::-moz-selection{background-color:#aaa;color:#000}.cmd .prompt span::selection,.cmd>div::selection,.cmd>div span::selection,.cmd>span::selection,.cmd>span span::selection,.cmd div::selection,.terminal .terminal-output div div::selection,.terminal .terminal-output div div a::selection,.terminal .terminal-output div span::selection,.terminal h1::selection,.terminal h2::selection,.terminal h3::selection,.terminal h4::selection,.terminal h5::selection,.terminal h6::selection,.terminal pre::selection,.terminal td::selection{background-color:hsla(0,0%,67%,.99);color:#000}.terminal .terminal-output div.error,.terminal .terminal-output div.error div{color:red}.tilda{position:fixed;top:0;left:0;width:100%;z-index:1}.clear{clear:both}.terminal a{color:#0f60ff}.terminal a:hover{color:red}.terminal .terminal-fill{position:absolute;left:0;top:-100%;width:100%;height:100%;margin:1px 0 0;border:none;opacity:0;pointer-events:none;box-sizing:border-box}.terminal,.terminal .terminal-fill{padding:10px}@-webkit-keyframes a{0%,to{background-color:#000;color:#aaa}50%{background-color:#bbb;color:#000}}@keyframes a{0%,to{background-color:#000;color:#aaa}50%{background-color:#bbb;color:#000}}@-webkit-keyframes terminal-bar{0%,to{border-left-color:#aaa}50%{border-left-color:#000}}@keyframes terminal-bar{0%,to{border-left-color:#aaa}50%{border-left-color:#000}}@-webkit-keyframes terminal-underline{0%,to{border-bottom-color:#aaa;position:relative;line-height:12px;border-left:none}50%{border-bottom-color:#000;position:relative;line-height:12px;border-left:none}}@keyframes terminal-underline{0%,to{border-bottom-color:#aaa;position:relative;line-height:11px;border-left:none}50%{border-bottom-color:#000;position:relative;line-height:11px;border-left:none}}@supports (--css:variables){.cmd,.terminal{color:var(--color,#aaa);background-color:var(--background,#000)}.cmd,.cmd .prompt,.terminal,.terminal .terminal-output div div{font-size:calc(var(--size, 1) * 12px);line-height:calc(var(--size, 1) * 14px)}.cmd .inverted,.terminal .inverted{background-color:var(--color,#aaa);color:var(--background,#000)}.cmd .cursor.blink{-webkit-animation:var(--animation,a) 1s infinite step-start;animation:var(--animation,a) 1s infinite step-start;color:var(--color,#aaa);background-color:var(--background,#000)}.cmd .prompt span::-moz-selection,.cmd>div::-moz-selection,.cmd>div span::-moz-selection,.cmd>span::-moz-selection,.cmd>span span::-moz-selection,.cmd div::-moz-selection,.terminal .terminal-output div div::-moz-selection,.terminal .terminal-output div div a::-moz-selection,.terminal .terminal-output div span::-moz-selection,.terminal h1::-moz-selection,.terminal h2::-moz-selection,.terminal h3::-moz-selection,.terminal h4::-moz-selection,.terminal h5::-moz-selection,.terminal h6::-moz-selection,.terminal pre::-moz-selection,.terminal td::-moz-selection{background-color:var(--color,#aaa);color:var(--background,#000)}.cmd .prompt span::selection,.cmd>div::selection,.cmd>div span::selection,.cmd>span::selection,.cmd>span span::selection,.cmd div::selection,.terminal .terminal-output div div::selection,.terminal .terminal-output div div a::selection,.terminal .terminal-output div span::selection,.terminal h1::selection,.terminal h2::selection,.terminal h3::selection,.terminal h4::selection,.terminal h5::selection,.terminal h6::selection,.terminal pre::selection,.terminal td::selection{background-color:var(--color,hsla(0,0%,67%,.99));color:var(--background,#000)}@-webkit-keyframes a{0%,to{background-color:var(--background,#000);color:var(--color,#aaa)}50%{background-color:var(--color,#aaa);color:var(--background,#000)}}@keyframes a{0%,to{background-color:var(--background,#000);color:var(--color,#aaa)}50%{background-color:var(--color,#aaa);color:var(--background,#000)}}@-webkit-keyframes terminal-bar{0%,to{border-left-color:var(--background,#000)}50%{border-left-color:var(--color,#aaa)}}@keyframes terminal-bar{0%,to{border-left-color:var(--background,#000)}50%{border-left-color:var(--color,#aaa)}}@-webkit-keyframes terminal-underline{0%,to{border-bottom-color:var(--color,#aaa);position:relative;line-height:calc(var(--size, 1) * 12px);border-left:none}50%{border-bottom-color:var(--background,#000);position:relative;line-height:calc(var(--size, 1) * 12px);border-left:none}}@keyframes terminal-underline{0%,to{border-bottom-color:var(--background,#000);position:relative;line-height:calc(var(--size, 1) * 12px);border-left:none}50%{border-bottom-color:var(--color,#aaa);position:relative;line-height:calc(var(--size, 1) * 12px);border-left:none}}}", ""]);

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
exports.i(__webpack_require__(/*! -!../../node_modules/css-loader!jquery.terminal/css/jquery.terminal.min.css */ "./node_modules/css-loader/index.js!./node_modules/jquery.terminal/css/jquery.terminal.min.css"), "");
exports.i(__webpack_require__(/*! -!../../node_modules/css-loader!tether-drop/dist/css/drop-theme-twipsy.min.css */ "./node_modules/css-loader/index.js!./node_modules/tether-drop/dist/css/drop-theme-twipsy.min.css"), "");
exports.i(__webpack_require__(/*! -!../../node_modules/css-loader!noty/lib/noty.css */ "./node_modules/css-loader/index.js!./node_modules/noty/lib/noty.css"), "");

// module
exports.push([module.i, ".terminal-wrap-custom .terminal .cmd {\n  height: 14px;\n}\n.terminal-wrap-custom .terminal .cmd .clipboard {\n  height: 14px;\n}\n.temp-terminal {\n  position: absolute;\n  top: -99999px;\n}\n.term-f-size-4 .terminal {\n  --size: 1.3;\n}\n.term-f-size-4 .terminal .cmd {\n  height: calc(18.2px);\n}\n.term-f-size-3 .terminal {\n  --size: 1.2;\n}\n.term-f-size-3 .terminal .cmd {\n  height: calc(16.8px);\n}\n.term-f-size-3 .terminal .cmd .clipboard {\n  height: calc(16.8px);\n}\n.term-f-size-2 .terminal {\n  --size: 1.1;\n}\n.term-f-size-2 .terminal .cmd {\n  height: calc(15.4px);\n}\n.term-f-size-2 .terminal .cmd .clipboard {\n  height: calc(15.4px);\n}\n.terminal-wrap-custom .t-matrix-w-0 td {\n  width: 100%;\n}\n.terminal-wrap-custom .t-matrix-w-1 td {\n  width: 50%;\n}\n.terminal-wrap-custom .t-matrix-w-2 td {\n  width: 33.33%;\n}\n.terminal-wrap-custom .t-matrix-w-3 td {\n  width: 25%;\n}\n.drop-element.drop-theme-twipsy .drop-content {\n  font-family: inherit;\n  padding: 10px;\n}\n.terminal-lds-hourglass {\n  display: inline-block;\n  position: relative;\n  width: 64px;\n  height: 64px;\n}\n.terminal-lds-hourglass:after {\n  content: \" \";\n  display: block;\n  border-radius: 50%;\n  width: 0;\n  height: 0;\n  margin: 6px;\n  box-sizing: border-box;\n  border: 26px solid #fff;\n  border-color: #fff transparent #fff transparent;\n  animation: lds-hourglass 1.2s infinite;\n}\n@keyframes lds-hourglass {\n  0% {\n    transform: rotate(0);\n    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);\n  }\n  50% {\n    transform: rotate(900deg);\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n  100% {\n    transform: rotate(1800deg);\n  }\n}\n.matrix-column {\n  display: inline-block;\n  float: left;\n  height: 125px;\n  margin-right: 20px;\n  padding: 10px;\n  cursor: pointer;\n  width: 25px;\n}\n.matrix-column:hover {\n  background: #7a43b6;\n}\n.matrix-table {\n  background: #fff;\n}\n.matrix-table td {\n  padding: 15px;\n  border: 1px solid #e0e0e0;\n  cursor: pointer;\n}\n.matrix-table td:hover {\n  background-color: #7a43b6;\n}\n.terminal .terminal-output .highlight-popover {\n  font-size: 11px;\n  line-height: 1.5em;\n}\n.terminal .terminal-output div.tooltip-inner {\n  font-size: 11px;\n  line-height: 1.6em;\n}\n.term-popover-menu .btn {\n  display: block;\n  width: 100%;\n  margin: 10px 0;\n}\n.term-popover-menu .btn i {\n  font-size: 14px;\n}\n.terminal-menu-popover {\n  padding-left: 5px;\n  width: 100px;\n}\n.terminal-menu-popover.themes {\n  width: 150px;\n}\n.terminal-menu-popover.themes a {\n  padding: 5px 0;\n}\n.terminal-menu-popover.historyContext {\n  width: 200px;\n}\n.terminal-menu-popover.historyContext ul {\n  max-height: 400px;\n  overflow-y: auto;\n  padding: 0;\n}\n.terminal-menu-popover.historyContext ul li input {\n  vertical-align: middle;\n  margin: 0;\n}\n.terminal-menu-popover.historyContext ul li a:hover {\n  opacity: .7;\n}\n.terminal-menu-popover.historyContext ul li a:before {\n  content: \"\\26AC\";\n  margin-right: 5px;\n  font-size: 21px;\n  vertical-align: middle;\n}\n.terminal-menu-popover.historyContext ul li a.checked:before {\n  content: \"\\2714\";\n  margin-right: 5px;\n}\n.terminal-menu-popover.hotkeysContext {\n  width: 500px;\n}\n.terminal-menu-popover.hotkeysContext .gds-select-header {\n  padding-bottom: 10px;\n  background: #414141;\n  z-index: 10;\n}\n.terminal-menu-popover.hotkeysContext .gds-select-container .tab {\n  display: none;\n}\n.terminal-menu-popover.hotkeysContext .gds-select-container .tab .tab-content {\n  max-height: 400px;\n  overflow-y: auto;\n}\n.terminal-menu-popover.hotkeysContext .gds-select-container .tab.active {\n  display: block;\n}\n.terminal-menu-popover.hotkeysContext .gds-select {\n  display: inline-block;\n  text-transform: uppercase;\n  margin-top: 3px;\n  margin-right: 5px;\n  cursor: pointer;\n}\n.terminal-menu-popover.hotkeysContext .settings-input-container {\n  display: flex;\n  margin-bottom: 4px;\n}\n.terminal-menu-popover.hotkeysContext .settings-input-container label {\n  min-width: 90px;\n  align-self: center;\n}\n.terminal-menu-popover.hotkeysContext .settings-input-container input {\n  flex: 1 1 auto;\n}\n.terminal-menu-popover.hotkeysContext .settings-input-container input.ch-box {\n  margin: 0;\n  width: auto;\n  min-width: 70px;\n}\n.terminal-menu-popover.hotkeysContext .settings-input-container.input-container-header label:not(:first-child):not(:last-child) {\n  flex: 1 1 auto;\n}\n.terminal-menu-popover.hotkeysContext .settings-input-container.input-container-header label:last-child {\n  min-width: 70px;\n  text-align: center;\n}\n.terminal-menu-popover a {\n  margin-left: 5px;\n  vertical-align: middle;\n  font-size: 12px;\n  display: block;\n  padding: 2px 0;\n  font-weight: bold;\n  color: #fff;\n}\n.terminal-menu-popover a:hover {\n  opacity: .7;\n}\n.terminal-menu-popover a:before {\n  content: \"\\26AC\";\n  margin-right: 5px;\n  font-size: 21px;\n  vertical-align: middle;\n}\n.terminal-menu-popover a.checked:before {\n  content: \"\\2714\";\n  margin-right: 5px;\n}\n.terminal-menu-popover.requestList a:before {\n  display: none;\n}\n.cmd .cursor {\n  border: 0;\n}\n.noty-wrap-text {\n  padding: 10px;\n  font-weight: bold;\n  font-size: 13px;\n  margin: 0;\n}\n.animated {\n  animation-duration: .5s;\n  animation-fill-mode: both;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n.fadeIn {\n  animation-name: fadeIn;\n}\n@keyframes fadeOut {\n  from {\n    opacity: 1;\n  }\n  to {\n    opacity: 0;\n  }\n}\n.fadeOut {\n  animation-name: fadeOut;\n}\n.terminal,\n.cmd {\n  color: transparent;\n  background-color: transparent;\n}\n#terminalContext {\n  width: 100%;\n  background: #fff;\n}\n.terminal-full-screen {\n  text-align: left;\n}\n.pcc-label {\n  position: absolute;\n  top: -5px;\n  right: -16px;\n  padding: 2px 5px;\n  background: #fff;\n  color: #511551;\n  border-radius: 15px;\n  font-size: 10px;\n  border: 0;\n}\n.terminal-wrap-custom {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.terminal-wrap-custom .btn.active {\n  position: relative;\n}\n.terminal-wrap-custom .btn.active:before {\n  content: \"\\F00C\";\n  font: normal normal normal 11px/1 FontAwesome;\n  position: absolute;\n  font-size: 9px;\n  z-index: 3;\n  top: 6px;\n  left: -6px;\n  background: inherit;\n  padding: 2px;\n  border-radius: 25px;\n}\n.terminal-wrap-custom .btn.has-drop-down:after {\n  content: \"\\F078\";\n  font: normal normal normal 11px/1 FontAwesome;\n  position: absolute;\n  font-size: 11px;\n  z-index: 3;\n  top: 6px;\n  right: -6px;\n  background: inherit;\n  padding: 2px;\n  border-radius: 25px;\n}\n.terminal-wrap-custom .actions-btn-menu {\n  position: absolute;\n  padding: 10px;\n  z-index: 1;\n  right: 7px;\n  top: 4px;\n}\n.terminal-wrap-custom .actions-btn-menu.bottom {\n  bottom: 0;\n  top: initial;\n}\n.terminal-wrap-custom .actions-btn-menu .btn {\n  display: inline-block;\n  font-size: 0;\n  cursor: pointer;\n  width: 47px;\n  height: 47px;\n  border-radius: 50%;\n  text-align: center;\n  position: relative;\n}\n.terminal-wrap-custom .actions-btn-menu .btn i {\n  vertical-align: middle;\n  font-size: 23px;\n  line-height: 19px;\n}\n.terminal-wrap-custom .actions-btn-menu .btn:after {\n  top: -5px;\n  left: -5px;\n  padding: 5px;\n  box-shadow: 0 0 0 3px #6b3b60;\n  transition: transform 0.2s, opacity 0.2s;\n  transform: scale(0.8);\n  opacity: 0;\n  pointer-events: none;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  content: '';\n  box-sizing: content-box;\n}\n.terminal-wrap-custom .actions-btn-menu .btn:hover:after {\n  transform: scale(1);\n  opacity: 1;\n}\n.terminal-wrap-custom .pqQuotes {\n  background: #bdbebf;\n  vertical-align: top;\n  width: 445px;\n}\n.terminal-wrap-custom .pqQuotes .close {\n  top: 10px;\n  position: relative;\n}\n.terminal-wrap-custom .pqQuotes div.term-body-pq {\n  padding: 0 5px;\n}\n.terminal-wrap-custom .pqQuotes div.term-body-pq .pq-container {\n  position: relative;\n  margin: 15px 0;\n}\n.terminal-wrap-custom .pqQuotes div.term-body-pq .pq-container .pq-container-labels {\n  position: absolute;\n  top: -7px;\n  z-index: 1;\n  border-radius: 25px;\n  width: 100%;\n}\n.terminal-wrap-custom .pqQuotes div.term-body-pq .pq-container .pq-container-labels .label {\n  border-radius: 25px;\n}\n.terminal-wrap-custom .pqQuotes div.term-body-pq .pq-container .added-by {\n  float: right;\n}\n.terminal-wrap-custom .pqQuotes .priceqoute-pre {\n  font-size: 11px;\n  padding: 15px 0 0;\n  color: #000;\n}\n.terminal-wrap-custom .centered {\n  top: 50%;\n  position: absolute;\n  left: 0;\n  right: 0;\n  margin: auto;\n}\n.terminal-wrap-custom > .term-body {\n  width: 100%;\n  height: 100%;\n}\n.terminal-wrap-custom > .term-body .left {\n  position: relative;\n  height: 100%;\n}\n.terminal-wrap-custom > .term-body .menu {\n  width: 20%;\n  vertical-align: top;\n  background: #fff;\n}\n.terminal-wrap-custom > .term-body .menu .label {\n  font-weight: bold;\n  font-size: 12px;\n  padding: 10px 0;\n  color: #414141;\n}\n.terminal-wrap-custom > .term-body.minimized .menu {\n  width: 100px;\n}\n.terminal-wrap-custom > .term-body.minimized .menu .sideMenu {\n  height: 100%;\n}\n.terminal-wrap-custom > .term-body.minimized .menu article.small-buttons .btn {\n  width: 85%;\n}\n.terminal-wrap-custom > .term-body.minimized .menu article.align-bottom {\n  position: absolute;\n  bottom: 20px;\n  width: 100%;\n}\n.terminal-wrap-custom > .term-body.minimized .menu article {\n  padding: 5px 10px;\n}\n.terminal-wrap-custom > .term-body.minimized .menu article .btn:last-of-type {\n  margin-bottom: 0;\n}\n.terminal-wrap-custom > .term-body.minimized .menu .btn {\n  display: block;\n  width: 100%;\n  margin: 0 auto 8px;\n  box-shadow: 1px 1px 3px #c1c1c1;\n}\n.terminal-wrap-custom > .term-body.minimized .menu .btn-purple {\n  width: 85%;\n}\n.terminal-wrap-custom > .term-body.minimized .menu .label {\n  text-align: center;\n  font-size: 12px;\n  display: block;\n}\n.terminal-wrap-custom .matrix-row .terminal {\n  border-right: 2px solid #fff;\n  border-bottom: 2px solid #fff;\n}\n.terminal-wrap-custom .terminal {\n  padding: 0;\n  float: left;\n}\n.terminal-wrap-custom .terminal.active {\n  background: red;\n}\n.terminal-wrap-custom .terminal .cmd {\n  font-weight: bold;\n  text-transform: uppercase;\n}\n.terminal-wrap-custom .terminal .usedCommand {\n  text-transform: uppercase;\n}\n.terminal-wrap-custom .terminal .term-highlight {\n  position: relative;\n}\n.terminal-wrap-custom .terminal .term-highlight.underline:before {\n  border-bottom: 1px solid;\n}\n.terminal-wrap-custom .terminal .term-highlight.dotted:before {\n  border-bottom: 1px dashed;\n}\n.terminal-wrap-custom .terminal .term-highlight.dotted:hover,\n.terminal-wrap-custom .terminal .term-highlight.underline:hover {\n  opacity: .7;\n}\n.terminal-wrap-custom .terminal .term-highlight.dotted:hover:before,\n.terminal-wrap-custom .terminal .term-highlight.underline:hover:before {\n  display: none;\n}\n.terminal-wrap-custom .terminal .term-highlight.dotted:before,\n.terminal-wrap-custom .terminal .term-highlight.underline:before {\n  position: absolute;\n  left: 0;\n  right: 0;\n  content: ' ';\n  bottom: 2px;\n}\n.terminal-wrap-custom .terminal .term-highlight.bold {\n  font-weight: bold;\n}\n.terminal-wrap-custom .terminal .term-highlight.bordered {\n  border: 1px solid;\n  border-radius: 6px;\n  padding: 1px 4px;\n  font-size: 0.9em;\n}\n.terminal-wrap-custom .terminal .t-pointer {\n  cursor: pointer;\n}\n.terminal-wrap-custom .terminal .raw > div {\n  white-space: pre-wrap;\n}\n.terminal-wrap-custom .terminal-output div span {\n  display: inline;\n}\n.terminal-wrap-custom .terminal-output pre {\n  white-space: pre-wrap;\n  overflow: hidden;\n}\n.terminal-wrap-custom div.terminal-wrapper {\n  height: auto;\n}\n@keyframes blink {\n  0% {\n    opacity: 1;\n  }\n  25% {\n    opacity: 0;\n  }\n  50% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@-webkit-keyframes blink {\n  0% {\n    opacity: 1;\n  }\n  25% {\n    opacity: 0;\n  }\n  50% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@-ms-keyframes blink {\n  0% {\n    opacity: 1;\n  }\n  25% {\n    opacity: 0;\n  }\n  50% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@-moz-keyframes blink {\n  0% {\n    opacity: 1;\n  }\n  25% {\n    opacity: 0;\n  }\n  50% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n.cmd .cursor.blink {\n  background: #ccc;\n  -webkit-animation: blink 1s infinite linear;\n  -moz-animation: blink 1s infinite linear;\n  -ms-animation: blink 1s infinite linear;\n  animation: blink 1s linear infinite;\n}\n", ""]);

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

/***/ "./node_modules/css-loader/index.js!./node_modules/tether-drop/dist/css/drop-theme-twipsy.min.css":
/*!***********************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/tether-drop/dist/css/drop-theme-twipsy.min.css ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-center .drop-content,.drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-left.drop-target-attached-top .drop-content,.drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-right.drop-target-attached-top .drop-content{margin-bottom:10px}.drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-right.drop-target-attached-left .drop-content,.drop-element.drop-theme-twipsy.drop-element-attached-right.drop-element-attached-middle .drop-content,.drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-right.drop-target-attached-left .drop-content{margin-right:10px}.drop-element,.drop-element *,.drop-element :after,.drop-element :before,.drop-element:after,.drop-element:before{box-sizing:border-box}.drop-element{position:absolute;display:none}.drop-element.drop-open,.drop-element.drop-theme-twipsy.drop-open-transitionend{display:block}.drop-element.drop-theme-twipsy{max-width:100%;max-height:100%;opacity:0;-webkit-transition:opacity 150ms;transition:opacity 150ms}.drop-element.drop-theme-twipsy .drop-content{position:relative;background:#414141;color:#fff;box-shadow:0 3px 7px rgba(0,0,0,.2);border-radius:2px;font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;padding:3px 8px;line-height:18px;font-size:11px}.drop-element.drop-theme-twipsy .drop-content:before{content:\"\";display:block;position:absolute;width:0;height:0;border-color:transparent;border-width:10px;border-style:solid}.drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-center .drop-content:before{top:100%;left:50%;margin-left:-10px;border-top-color:#414141}.drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-center .drop-content{margin-top:10px}.drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-center .drop-content:before{bottom:100%;left:50%;margin-left:-10px;border-bottom-color:#414141}.drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-left.drop-target-attached-right .drop-content,.drop-element.drop-theme-twipsy.drop-element-attached-left.drop-element-attached-middle .drop-content,.drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-left.drop-target-attached-right .drop-content{margin-left:10px}.drop-element.drop-theme-twipsy.drop-element-attached-right.drop-element-attached-middle .drop-content:before{left:100%;top:50%;margin-top:-10px;border-left-color:#414141}.drop-element.drop-theme-twipsy.drop-element-attached-left.drop-element-attached-middle .drop-content:before{right:100%;top:50%;margin-top:-10px;border-right-color:#414141}.drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-left.drop-target-attached-bottom .drop-content,.drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-right.drop-target-attached-bottom .drop-content{margin-top:10px}.drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-left.drop-target-attached-bottom .drop-content:before{bottom:100%;left:10px;border-bottom-color:#414141}.drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-right.drop-target-attached-bottom .drop-content:before{bottom:100%;right:10px;border-bottom-color:#414141}.drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-left.drop-target-attached-top .drop-content:before{top:100%;left:10px;border-top-color:#414141}.drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-right.drop-target-attached-top .drop-content:before{top:100%;right:10px;border-top-color:#414141}.drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-right.drop-target-attached-left .drop-content:before{top:10px;left:100%;border-left-color:#414141}.drop-element.drop-theme-twipsy.drop-element-attached-top.drop-element-attached-left.drop-target-attached-right .drop-content:before{top:10px;right:100%;border-right-color:#414141}.drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-right.drop-target-attached-left .drop-content:before{bottom:10px;left:100%;border-left-color:#414141}.drop-element.drop-theme-twipsy.drop-element-attached-bottom.drop-element-attached-left.drop-target-attached-right .drop-content:before{bottom:10px;right:100%;border-right-color:#414141}.drop-element.drop-theme-twipsy.drop-after-open{opacity:1}", ""]);

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
exports.SWITCH_TERMINAL = exports.PURGE_SCREENS = exports.DEV_CMD_STACK_RUN = undefined;

var _state = __webpack_require__(/*! ./state */ "./src/state.es6");

var _store = __webpack_require__(/*! ./store */ "./src/store.es6");

var DEV_CMD_STACK_RUN = exports.DEV_CMD_STACK_RUN = function DEV_CMD_STACK_RUN(command) {
	return (0, _store.getStore)().app.Gds.runCommand(command);
};

var PURGE_SCREENS = exports.PURGE_SCREENS = function PURGE_SCREENS() {
	(0, _store.getStore)().app.Gds.clearScreen();
	(0, _state.getters)('clear'); // TO MANY REQUESTS;
};

var SWITCH_TERMINAL = exports.SWITCH_TERMINAL = function SWITCH_TERMINAL(fn) {

	return new Promise(function (resolve) {

		var curTerminalId = fn((0, _store.getStore)().app.getGds().get());

		setTimeout(function () {
			// THIS IS CRAZY SHIT. WITHOUT IT SWITCHES TERMINALS SEVERAL TIMES TRY PRESS ~

			var terminal = (0, _store.getStore)().app.Gds.getCurrent().get('terminals');

			if (curTerminalId !== false) terminal[curTerminalId].plugin.terminal.focus();

			resolve('done');
		}, 100);
	});
};

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
exports.UPDATE_CUR_GDS = exports.CHANGE_GDS = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = __webpack_require__(/*! ../constants */ "./src/constants.es6");

var _store = __webpack_require__(/*! ../store */ "./src/store.es6");

var _state = __webpack_require__(/*! ../state */ "./src/state.es6");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var update_cur_gds = function update_cur_gds(_ref) {
	var canCreatePq = _ref.canCreatePq,
	    canCreatePqErrors = _ref.canCreatePqErrors,
	    area = _ref.area,
	    pcc = _ref.pcc,
	    startNewSession = _ref.startNewSession,
	    log = _ref.log,
	    gdsName = _ref.gdsName;


	var sessionIndex = _constants.AREA_LIST.indexOf(area);

	var pc = _defineProperty({}, sessionIndex, pcc);
	var pccUpd = startNewSession ? pc : _extends({}, (0, _store.getStore)().app.Gds.getGds(gdsName).get('pcc'), pc);

	(0, _store.getStore)().app.Gds.update({ pcc: pccUpd, canCreatePq: canCreatePq, canCreatePqErrors: canCreatePqErrors, sessionIndex: sessionIndex }, gdsName);

	return {
		log: log,
		canCreatePq: canCreatePq
	};
};

var CHANGE_GDS = exports.CHANGE_GDS = function CHANGE_GDS(gdsName) {
	(0, _state.getters)('gds', gdsName);

	(0, _store.getStore)().app.Gds.setCurrent(gdsName);

	var _getStore$app$Gds$get = (0, _store.getStore)().app.Gds.getCurrent().get(),
	    fontSize = _getStore$app$Gds$get.fontSize,
	    language = _getStore$app$Gds$get.language,
	    theme = _getStore$app$Gds$get.theme;

	(0, _store.getStore)().app.getContainer().changeFontClass(fontSize);
	(0, _store.getStore)().app.changeStyle(theme);

	(0, _store.getStore)().updateView({
		gdsObjName: (0, _store.getStore)().app.Gds.getCurrentName(),
		gdsObjIndex: (0, _store.getStore)().app.Gds.getCurrentIndex(),
		fontSize: fontSize,
		language: language,
		theme: theme
	});
};

var UPDATE_CUR_GDS = exports.UPDATE_CUR_GDS = function UPDATE_CUR_GDS(props) {

	(0, _store.getStore)().setState(_extends({}, update_cur_gds(props)));
};

/***/ }),

/***/ "./src/actions/priceQuoutes.es6":
/*!**************************************!*\
  !*** ./src/actions/priceQuoutes.es6 ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.CLOSE_PQ_WINDOW = exports.PQ_MODAL_SHOW = exports.SET_REQUEST_ID = exports.HIDE_PQ_QUOTES = exports.SHOW_PQ_QUOTES = undefined;

var _store = __webpack_require__(/*! ../store */ "./src/store.es6");

var _constants = __webpack_require__(/*! ../constants */ "./src/constants.es6");

var _state = __webpack_require__(/*! ../state */ "./src/state.es6");

var isHidden = false;

var showPq = function showPq() {
	var newState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

	(0, _store.getStore)().app.setOffset(offset);
	(0, _store.getStore)().updateView(newState);
};

var SHOW_PQ_QUOTES = exports.SHOW_PQ_QUOTES = function SHOW_PQ_QUOTES() {
	var offset = (0, _store.getStore)().app.getOffset() === 0 ? 400 : _constants.OFFSET_QUOTES;
	showPq({ pqToShow: 'loading' }, offset);

	return (0, _state.getters)('showExistingPq').then(function (response) {
		return showPq({ pqToShow: response }, offset);
	});
};

var HIDE_PQ_QUOTES = exports.HIDE_PQ_QUOTES = function HIDE_PQ_QUOTES() {
	var offset = (0, _store.getStore)().app.getOffset() === 400 ? 0 : 100;
	return showPq({ pqToShow: false }, offset);
};

var SET_REQUEST_ID = exports.SET_REQUEST_ID = function SET_REQUEST_ID(rId) {
	(0, _store.getStore)().app.set('requestId', rId);
	return Promise.resolve();
};

var openPq = function openPq(app) {
	app.pqParser.show(app.getGds(), app.params.requestId).then(function () {
		return showPq({ menuHidden: true }, 0);
	});
};

var PQ_MODAL_SHOW = exports.PQ_MODAL_SHOW = function PQ_MODAL_SHOW() {
	return openPq((0, _store.getStore)().app);
};
var CLOSE_PQ_WINDOW = exports.CLOSE_PQ_WINDOW = function CLOSE_PQ_WINDOW() {
	return showPq({ menuHidden: false });
};

/***/ }),

/***/ "./src/actions/settings.es6":
/*!**********************************!*\
  !*** ./src/actions/settings.es6 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UPDATE_SCREEN = exports.HIDE_MENU = exports.ADD_WHIDE_COLUMN = exports.CHANGE_SESSION_BY_MENU = exports.CHANGE_ACTIVE_TERMINAL = exports.CHANGE_MATRIX = exports.GET_LAST_REQUESTS = exports.GET_HISTORY = exports.CHANGE_SETTINGS = exports.CHANGE_INPUT_LANGUAGE = exports.CHANGE_FONT_SIZE = exports.CHANGE_STYLE = undefined;

var _state = __webpack_require__(/*! ../state */ "./src/state.es6");

var _store = __webpack_require__(/*! ../store */ "./src/store.es6");

var CHANGE_STYLE = exports.CHANGE_STYLE = function CHANGE_STYLE(theme) {
	(0, _state.getters)('theme', theme);

	var _getStore$app$Gds$get = (0, _store.getStore)().app.Gds.getCurrent().get(),
	    name = _getStore$app$Gds$get.name;

	(0, _store.getStore)().app.Gds.update({ theme: theme }, name);
	(0, _store.getStore)().updateView({ theme: theme });
	(0, _store.getStore)().app.changeStyle(theme);
};

var CHANGE_FONT_SIZE = exports.CHANGE_FONT_SIZE = function CHANGE_FONT_SIZE(_ref) {
	var fontSize = _ref.fontSize;

	(0, _state.getters)('fontSize', fontSize);

	(0, _store.getStore)().app.getContainer().changeFontClass(fontSize);

	var _getStore$app$Gds$get2 = (0, _store.getStore)().app.Gds.getCurrent().get(),
	    name = _getStore$app$Gds$get2.name;

	(0, _store.getStore)().app.Gds.update({ fontSize: fontSize }, name);
	(0, _store.getStore)().updateView({ fontSize: fontSize });
};

var CHANGE_INPUT_LANGUAGE = exports.CHANGE_INPUT_LANGUAGE = function CHANGE_INPUT_LANGUAGE(language) {
	(0, _state.getters)('language', language);
	(0, _store.getStore)().setState({ language: language });
};

var CHANGE_SETTINGS = exports.CHANGE_SETTINGS = function CHANGE_SETTINGS(settings) {
	(0, _state.getters)('settings', settings);

	var newData = { keyBindings: {}, defaultPccs: {} };
	$.each(settings, function (gds, value) {
		newData.keyBindings[gds] = value.keyBindings || {};
		newData.defaultPccs[gds] = value.defaultPcc || '';
		(0, _store.getStore)().app.Gds.update({
			keyBindings: newData.keyBindings[gds],
			defaultPcc: newData.defaultPccs[gds]
		}, gds);
	});
	(0, _store.getStore)().updateView({ keyBindings: newData.keyBindings, defaultPccs: newData.defaultPccs });
};

var GET_HISTORY = exports.GET_HISTORY = function GET_HISTORY() {
	return (0, _state.getters)('history');
};

var GET_LAST_REQUESTS = exports.GET_LAST_REQUESTS = function GET_LAST_REQUESTS() {
	return (0, _state.getters)('lastRequests');
};

var CHANGE_MATRIX = exports.CHANGE_MATRIX = function CHANGE_MATRIX(matrix) {
	var result = {
		hasWide: (0, _store.getStore)().app.getGds().get('hasWide'),
		matrix: matrix
	};
	(0, _state.getters)('matrixConfiguration', result);
	(0, _store.getStore)().app.Gds.update({ matrix: matrix });
	(0, _store.getStore)().updateView();
};

var CHANGE_ACTIVE_TERMINAL = exports.CHANGE_ACTIVE_TERMINAL = function CHANGE_ACTIVE_TERMINAL(_ref2) {
	var curTerminalId = _ref2.curTerminalId;

	(0, _store.getStore)().app.Gds.changeActive(curTerminalId);
	(0, _state.getters)('terminal', curTerminalId + 1);
};

var CHANGE_SESSION_BY_MENU = exports.CHANGE_SESSION_BY_MENU = function CHANGE_SESSION_BY_MENU(area) {
	(0, _state.getters)('area', area);

	var command = ((0, _store.getStore)().app.Gds.isApollo() ? 'S' : '¤') + area;
	return (0, _store.getStore)().app.Gds.runCommand([command]);
};

var ADD_WHIDE_COLUMN = exports.ADD_WHIDE_COLUMN = function ADD_WHIDE_COLUMN() {
	var hasWide = !(0, _store.getStore)().app.getGds().get('hasWide');
	var result = {
		hasWide: hasWide,
		matrix: (0, _store.getStore)().app.getGds().get('matrix')
	};
	(0, _state.getters)('matrixConfiguration', result);

	(0, _store.getStore)().app.Gds.update({
		hasWide: !(0, _store.getStore)().app.getGds().get('hasWide')
	});

	(0, _store.getStore)().updateView();
};

var HIDE_MENU = exports.HIDE_MENU = function HIDE_MENU(hidden) {
	(0, _store.getStore)().app.setOffset(hidden ? 0 : 100);

	(0, _store.getStore)().updateView({
		menuHidden: hidden
	});
};

var UPDATE_SCREEN = exports.UPDATE_SCREEN = function UPDATE_SCREEN() {
	(0, _store.getStore)().updateView();
};

/***/ }),

/***/ "./src/app.es6":
/*!*********************!*\
  !*** ./src/app.es6 ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requests = __webpack_require__(/*! ./helpers/requests.es6 */ "./src/helpers/requests.es6");

var _keyBinding = __webpack_require__(/*! ./helpers/keyBinding */ "./src/helpers/keyBinding.es6");

var _settings = __webpack_require__(/*! ./actions/settings */ "./src/actions/settings.es6");

var _actions = __webpack_require__(/*! ./actions */ "./src/actions.es6");

var _gdsActions = __webpack_require__(/*! ./actions/gdsActions */ "./src/actions/gdsActions.es6");

var _gds = __webpack_require__(/*! ./modules/gds */ "./src/modules/gds.es6");

var _main = __webpack_require__(/*! ./containers/main */ "./src/containers/main.es6");

var _main2 = _interopRequireDefault(_main);

var _pqParser = __webpack_require__(/*! ./modules/pqParser */ "./src/modules/pqParser.es6");

__webpack_require__(/*! ./theme/main.less */ "./src/theme/main.less");

var _constants = __webpack_require__(/*! ./constants */ "./src/constants.es6");

var _store = __webpack_require__(/*! ./store */ "./src/store.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BORDER_SIZE = 2;

var TerminalApp = function () {
	function TerminalApp(params) {
		_classCallCheck(this, TerminalApp);

		var settings = params.settings,
		    requestId = params.requestId,
		    buffer = params.buffer,
		    permissions = params.permissions,
		    PqPriceModal = params.PqPriceModal,
		    htmlRootId = params.htmlRootId,
		    agentId = params.agentId,
		    terminalThemes = params.terminalThemes,
		    commandUrl = params.commandUrl;

		var _getGdsDefaultSetting = this.getGdsDefaultSettings(settings),
		    keyBindings = _getGdsDefaultSetting.keyBindings,
		    defaultPccs = _getGdsDefaultSetting.defaultPccs;

		this.Gds = new _gds.GDS({
			gdsListDb: settings.gds,
			activeName: settings['common']['currentGds'] || 'apollo',
			buffer: buffer || {}
		});

		this.params = { requestId: requestId, permissions: permissions };
		this.offset = _constants.OFFSET_DEFAULT; //menu

		this.pqParser = new _pqParser.PqParser(PqPriceModal);
		this.container = new _main2.default(htmlRootId);

		this.agentId = agentId;

		(0, _requests.setLink)(commandUrl);
		initGlobEvents();

		(0, _store.connect)(this);

		var curGds = settings['gds'][settings['common']['currentGds'] || 'apollo'];
		var fontSize = curGds['fontSize'] || 1;
		var language = curGds['language'] || 'APOLLO';
		this.container.changeFontClass(fontSize);

		this.themeId = this.getStyle(settings.gds, terminalThemes);

		(0, _store.getStore)().updateView({
			requestId: requestId,
			permissions: permissions,
			terminalThemes: terminalThemes,
			fontSize: fontSize,
			language: language,
			theme: this.themeId,
			gdsObjName: this.Gds.getCurrentName(),
			gdsObjIndex: this.Gds.getCurrentIndex(),
			keyBindings: keyBindings,
			defaultPccs: defaultPccs
		});
	}

	_createClass(TerminalApp, [{
		key: 'set',
		value: function set(key, val) {
			this.params[key] = val;
		}
	}, {
		key: 'changeStyle',
		value: function changeStyle(id) {
			this.container.changeStyle(id);
		}
	}, {
		key: 'getStyle',
		value: function getStyle(settings, terminalThemes) {
			if (!this.themeId) {
				var themeId = settings && settings[this.Gds.name] && settings[this.Gds.name].theme ? settings[this.Gds.name].theme : terminalThemes[0]['id'];
				this.themeId = themeId;
				this.container.changeStyle(this.themeId);
			}

			return this.themeId;
		}
	}, {
		key: 'getGdsDefaultSettings',
		value: function getGdsDefaultSettings(allSettings) {
			var settings = {
				keyBindings: {},
				defaultPccs: {}
			};

			$.each(allSettings.gds, function (gds, gdsSettings) {
				var parsedKeyBindings = {};

				// Fix old key formatting
				if (gdsSettings.keyBindings) {
					$.each(gdsSettings.keyBindings, function (key, data) {
						var c = { command: '', autorun: 0 };
						if (typeof data === 'string') {
							c.command = data;
						} else {
							c = Object.assign({}, c, {
								command: data.command,
								autorun: parseInt(data.autorun)
							});
						}
						parsedKeyBindings[key] = c;
					});
				}

				allSettings.gds[gds].keyBindings = parsedKeyBindings; // It's bad to do like this, I know

				settings.keyBindings[gds] = parsedKeyBindings;
				settings.defaultPccs[gds] = gdsSettings.defaultPcc || null;
			});

			return settings;
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
	}, {
		key: 'calculateMatrix',
		value: function calculateMatrix() {
			var _Gds$getCurrent$get = this.Gds.getCurrent().get(),
			    matrix = _Gds$getCurrent$get.matrix,
			    hasWide = _Gds$getCurrent$get.hasWide;

			var rows = matrix.rows,
			    cells = matrix.cells;


			var char = this.getCharLength();

			var rRows = rows + 1;

			var height = Math.floor(this.container.context.clientHeight / rRows); // - (BORDER_SIZE * rRows) );
			var width = Math.floor((this.container.context.clientWidth - this.getOffset()) / (cells + (hasWide ? 2 : 1)));

			var numOf = {
				numOfRows: Math.floor((height - BORDER_SIZE) / char.height),
				numOfChars: Math.floor((width - BORDER_SIZE) / char.width) - 2 // 2 - FORGOT ABOUT SCROLL
			};

			var dimensions = {
				char: char,
				numOf: numOf,

				terminalSize: {
					width: width - BORDER_SIZE,
					height: numOf.numOfRows * char.height //- BORDER_SIZE
				},

				parent: {
					height: this.container.context.clientHeight,
					width: this.container.context.clientWidth - this.getOffset()
				}
			};

			dimensions['leftOver'] = {
				height: Math.floor((this.container.context.clientHeight - (dimensions.terminalSize.height + BORDER_SIZE) * rRows) / rRows)
			};

			this.Gds.updateMatrix(dimensions);

			if (hasWide) {
				this.calculateHasWide(dimensions, rows);
			}

			return this;
		}
	}, {
		key: 'calculateHasWide',
		value: function calculateHasWide(dimensions) {
			var wideDimensions = _extends({}, dimensions, {
				numOf: _extends({}, dimensions.numOf),
				terminalSize: _extends({}, dimensions.terminalSize)
			});

			wideDimensions.numOf.numOfRows = Math.floor((dimensions.parent.height - BORDER_SIZE) / dimensions.char.height);
			wideDimensions.terminalSize.height = wideDimensions.numOf.numOfRows * dimensions.char.height;
			wideDimensions['leftOver'] = {
				height: Math.floor(this.container.context.clientHeight - (wideDimensions.terminalSize.height + BORDER_SIZE))
			};

			this.Gds.update({ wideDimensions: wideDimensions });
		}
	}, {
		key: 'runPnr',
		value: function runPnr(_ref) {
			var pnrCode = _ref.pnrCode,
			    _ref$gdsName = _ref.gdsName,
			    gdsName = _ref$gdsName === undefined ? 'apollo' : _ref$gdsName;

			if (pnrCode) {
				(0, _gdsActions.CHANGE_GDS)(gdsName);
				(0, _settings.CHANGE_ACTIVE_TERMINAL)({ curTerminalId: 0 });
				(0, _actions.DEV_CMD_STACK_RUN)('*' + pnrCode);
			}
		}
	}, {
		key: 'rebuild',
		value: function rebuild(_ref2) {
			var data = _ref2.data,
			    _ref2$gdsName = _ref2.gdsName,
			    gdsName = _ref2$gdsName === undefined ? 'apollo' : _ref2$gdsName;

			if (data) {
				(0, _gdsActions.CHANGE_GDS)(gdsName);
				(0, _settings.CHANGE_ACTIVE_TERMINAL)({ curTerminalId: 0 });
				(0, _actions.DEV_CMD_STACK_RUN)('REBUILD/' + data.itineraryId + '/' + data.segmentStatus + '/' + data.seats);
			}
		}
	}]);

	return TerminalApp;
}();

window.terminal = TerminalApp;

var resizeTimeout = void 0;

var initGlobEvents = function initGlobEvents() {

	window.onresize = function () {

		// console.warn('on resize');

		// if (resizeTimeout)
		// {
		// 	clearInterval(resizeTimeout);
		// }

		(0, _store.getStore)().updateView();
		// resizeTimeout = setTimeout( () => getStore().updateView(), 0 );
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

var _priceQuoutes = __webpack_require__(/*! ../actions/priceQuoutes */ "./src/actions/priceQuoutes.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PqQuotes = exports.PqQuotes = function (_Component) {
	_inherits(PqQuotes, _Component);

	function PqQuotes() {
		_classCallCheck(this, PqQuotes);

		var _this = _possibleConstructorReturn(this, (PqQuotes.__proto__ || Object.getPrototypeOf(PqQuotes)).call(this, 'td.pqQuotes hidden'));

		_this.observe(new _component2.default('section.hbox stretch').observe(new _component2.default('section.vbox').append(new _component2.default('header.header').append(new _component2.default('span.close[&times;]', { onclick: _priceQuoutes.HIDE_PQ_QUOTES }))).observe(new _component2.default('section.scrollable lter').observe(new _component2.default('div.hbox stretch').observe(new Body())))));
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
				if (this.state['pqToShow'] === 'loading') {
					this.context.innerHTML = '<div class="text-center centered"><div class="terminal-lds-hourglass"></div></div>';
					return '';
				}

				this.context.innerHTML = '';

				this.state['pqToShow'].result.map(function (pq) {

					var container = (0, _dom2.default)('div.pq-container');
					var labels = (0, _dom2.default)('div.pq-container-labels');

					labels.appendChild((0, _dom2.default)('strong.label label-grey m-r-sm', { innerHTML: 'Selling: ' + pq['selling'] }));

					labels.appendChild((0, _dom2.default)('strong.label label-grey  m-r-sm', { innerHTML: 'NET: ' + pq['net'] }));

					labels.appendChild((0, _dom2.default)('strong.label label-mozilla added-by', { innerHTML: pq['addedByGroupLabel'] }));

					container.appendChild(labels);

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
exports.ActionsMenuBottom = exports.ActionsMenu = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _terminalMatrix = __webpack_require__(/*! ./popovers/terminalMatrix.es6 */ "./src/components/popovers/terminalMatrix.es6");

var _terminalMatrix2 = _interopRequireDefault(_terminalMatrix);

var _component = __webpack_require__(/*! ../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

var _gdsAreas = __webpack_require__(/*! ./menu/gdsAreas */ "./src/components/menu/gdsAreas.es6");

var _buttonPopover = __webpack_require__(/*! ../modules/dom/buttonPopover */ "./src/modules/dom/buttonPopover.es6");

var _settingsButtons = __webpack_require__(/*! ./menu/settingsButtons */ "./src/components/menu/settingsButtons.es6");

var _languageButtons = __webpack_require__(/*! ./menu/languageButtons */ "./src/components/menu/languageButtons.es6");

var _quotes = __webpack_require__(/*! ./menu/quotes */ "./src/components/menu/quotes.es6");

var _pqButton = __webpack_require__(/*! ./menu/pqButton */ "./src/components/menu/pqButton.es6");

var _pqButton2 = _interopRequireDefault(_pqButton);

var _settings = __webpack_require__(/*! ../actions/settings */ "./src/actions/settings.es6");

var _devButtons = __webpack_require__(/*! ./menu/devButtons */ "./src/components/menu/devButtons.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActionsMenu = exports.ActionsMenu = function (_Component) {
	_inherits(ActionsMenu, _Component);

	function ActionsMenu() {
		_classCallCheck(this, ActionsMenu);

		var _this = _possibleConstructorReturn(this, (ActionsMenu.__proto__ || Object.getPrototypeOf(ActionsMenu)).call(this, 'div.actions-btn-menu'));

		_this.observe([new _terminalMatrix2.default()]);
		return _this;
	}

	_createClass(ActionsMenu, [{
		key: 'setState',
		value: function setState(_ref) {
			var menuHidden = _ref.menuHidden;

			return _get(ActionsMenu.prototype.__proto__ || Object.getPrototypeOf(ActionsMenu.prototype), 'setState', this).call(this, {
				menuHidden: menuHidden
			});
		}
	}, {
		key: '_renderer',
		value: function _renderer() {
			this.context.classList.toggle('hidden', this.state.menuHidden);
		}
	}]);

	return ActionsMenu;
}(_component2.default);

var ActionsMenuBottom = exports.ActionsMenuBottom = function (_Component2) {
	_inherits(ActionsMenuBottom, _Component2);

	function ActionsMenuBottom() {
		_classCallCheck(this, ActionsMenuBottom);

		var _this2 = _possibleConstructorReturn(this, (ActionsMenuBottom.__proto__ || Object.getPrototypeOf(ActionsMenuBottom)).call(this, 'div.actions-btn-menu bottom'));

		_this2.observe([new Trigger()]);
		return _this2;
	}

	return ActionsMenuBottom;
}(_component2.default);

var Trigger = function (_ButtonPopover) {
	_inherits(Trigger, _ButtonPopover);

	function Trigger() {
		_classCallCheck(this, Trigger);

		return _possibleConstructorReturn(this, (Trigger.__proto__ || Object.getPrototypeOf(Trigger)).call(this, { icon: '<i class="fa fa-bars"></i>',
			popoverProps: {
				className: 'term-popover-menu'
			},

			buttonProps: {}
		}));
	}

	_createClass(Trigger, [{
		key: 'clickOnButton',
		value: function clickOnButton() {
			this.context.classList.toggle('btn-success');
			this.context.classList.toggle('btn-purple');

			_get(Trigger.prototype.__proto__ || Object.getPrototypeOf(Trigger.prototype), 'clickOnButton', this).call(this);

			if (this.closed) {
				this.context.innerHTML = '<i class="fa fa-bars"></i>';
			} else {
				this.context.innerHTML = '<i class="fa fa-times"></i>';
			}
		}
	}, {
		key: 'getPopContent',
		value: function getPopContent() {
			var _this4 = this;

			this.popContent.observe([new _terminalMatrix2.default(), new _settingsButtons.SettingsButtons(), new _gdsAreas.GdsAreas(), new _languageButtons.LanguageButtons(), new _quotes.Quotes(), new _pqButton2.default()]);

			if (this.state.permissions) {
				this.popContent.observe(new _devButtons.DevButtons());
			}

			this.popContent.observe(new _component2.default('button.btn btn-primary[<i class="fa fa-bars"></i>]', {
				onclick: function onclick() {
					_this4.clickOnButton();
					(0, _settings.HIDE_MENU)(false);
				}
			}));

			return this.popContent;
		}
	}, {
		key: 'getPopoverProps',
		value: function getPopoverProps() {
			return {
				openOn: null,
				position: 'top right'
				// tetherOptions: {
				// 	offset: '0 3px'
				//
				// }
			};
		}
	}, {
		key: 'setState',
		value: function setState(_ref2) {
			var menuHidden = _ref2.menuHidden,
			    permissions = _ref2.permissions;

			return _get(Trigger.prototype.__proto__ || Object.getPrototypeOf(Trigger.prototype), 'setState', this).call(this, {
				menuHidden: menuHidden, permissions: permissions
			});
		}
	}, {
		key: '_renderer',
		value: function _renderer() {
			this.context.classList.toggle('hidden', !this.state.menuHidden);
		}
	}]);

	return Trigger;
}(_buttonPopover.ButtonPopover);

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

var _settings = __webpack_require__(/*! ../../actions/settings */ "./src/actions/settings.es6");

var _gdsActions = __webpack_require__(/*! ../../actions/gdsActions */ "./src/actions/gdsActions.es6");

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
			var current = state.curGds;

			return _get(GdsAreas.prototype.__proto__ || Object.getPrototypeOf(GdsAreas.prototype), "setState", this).call(this, {
				gdsName: current.get('name'),
				pcc: current.get('pcc'),
				sessionIndex: current.get('sessionIndex'),
				areaList: current.get('list')
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
		var gdsName = _ref.gdsName,
		    areaList = _ref.areaList,
		    sessionIndex = _ref.sessionIndex,
		    pcc = _ref.pcc;

		_classCallCheck(this, GdsButtons);

		var _this2 = _possibleConstructorReturn(this, (GdsButtons.__proto__ || Object.getPrototypeOf(GdsButtons)).call(this, { icon: gdsName }, 'div'));

		_this2.gdsname = gdsName;
		_this2.areaList = areaList;
		_this2.sessionIndex = sessionIndex;
		_this2.pcc = pcc;
		return _this2;
	}

	_createClass(GdsButtons, [{
		key: "makeTrigger",
		value: function makeTrigger() {
			return _get(GdsButtons.prototype.__proto__ || Object.getPrototypeOf(GdsButtons.prototype), "makeTrigger", this).call(this, { className: 'btn btn-primary font-bold pos-rlt has-drop-down' });
		}
	}, {
		key: "build",
		value: function build() {
			var _this3 = this;

			_constants.GDS_LIST.map(function (name) {
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
					(0, _gdsActions.CHANGE_GDS)(gdsName);
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
					(0, _settings.CHANGE_SESSION_BY_MENU)(_constants.AREA_LIST[index]);
				}
			});
		}
	}]);

	return GdsButtons;
}(_buttonPopover2.default);

/***/ }),

/***/ "./src/components/menu/gdsDirectPqButton.es6":
/*!***************************************************!*\
  !*** ./src/components/menu/gdsDirectPqButton.es6 ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = __webpack_require__(/*! ../../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

var _dom = __webpack_require__(/*! ../../helpers/dom */ "./src/helpers/dom.es6");

var _dom2 = _interopRequireDefault(_dom);

var _settings = __webpack_require__(/*! ../../actions/settings */ "./src/actions/settings.es6");

var _priceQuoutes = __webpack_require__(/*! ../../actions/priceQuoutes */ "./src/actions/priceQuoutes.es6");

var _tetherDrop = __webpack_require__(/*! tether-drop */ "./node_modules/tether-drop/dist/js/drop.js");

var _tetherDrop2 = _interopRequireDefault(_tetherDrop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var gdsDirectPqButton = function (_Component) {
	_inherits(gdsDirectPqButton, _Component);

	function gdsDirectPqButton() {
		_classCallCheck(this, gdsDirectPqButton);

		var _this = _possibleConstructorReturn(this, (gdsDirectPqButton.__proto__ || Object.getPrototypeOf(gdsDirectPqButton)).call(this, 'button.btn btn-sm btn-mozilla font-bold[PQ]'));

		_this.popContent = (0, _dom2.default)('div.terminal-menu-popover requestList');

		_this.context.addEventListener('click', function () {
			_this.makePopover();
			_this.askServer();
		});
		return _this;
	}

	_createClass(gdsDirectPqButton, [{
		key: "makePopover",
		value: function makePopover() {
			if (this.popover) {
				return false;
			}

			this.popover = new _tetherDrop2.default({
				target: this.context,
				content: this.popContent,
				classes: 'drop-theme-twipsy',
				position: 'left top',
				openOn: 'manual'
			});
		}
	}, {
		key: "askServer",
		value: function askServer() {
			var _this2 = this;

			this.popContent.innerHTML = '<div class="text-center"><div class="terminal-lds-hourglass"></div></div>';

			this.popover.open();

			(0, _settings.GET_LAST_REQUESTS)().then(function (response) {
				var c = new PopoverContext(response, _this2.popover);

				_this2.popContent.innerHTML = '';
				_this2.popContent.appendChild(c.context);

				c.finalize(_this2.popContent);
			});
		}
	}, {
		key: "setState",
		value: function setState(_ref) {
			var requestId = _ref.requestId,
			    state = _objectWithoutProperties(_ref, ["requestId"]);

			return _get(gdsDirectPqButton.prototype.__proto__ || Object.getPrototypeOf(gdsDirectPqButton.prototype), "setState", this).call(this, {
				canCreatePq: state.curGds.get('canCreatePq'),
				requestId: requestId
			});
		}
	}, {
		key: "_renderer",
		value: function _renderer() {
			this.context.disabled = this.state.canCreatePq !== true;
			this.context.classList.toggle('hidden', !!this.state.requestId);
		}
	}]);

	return gdsDirectPqButton;
}(_component2.default);

exports.default = gdsDirectPqButton;

var PopoverContext = function () {
	function PopoverContext(response, popover) {
		_classCallCheck(this, PopoverContext);

		this.context = (0, _dom2.default)('div');

		this._makeBody(response, popover);
	}

	_createClass(PopoverContext, [{
		key: "_makeBody",
		value: function _makeBody(response, popover) {
			var _this3 = this;

			response.data.forEach(function (value) {

				var el = (0, _dom2.default)("a.t-pointer[" + value + "]", {
					onclick: function onclick() {
						(0, _priceQuoutes.SET_REQUEST_ID)(value).then(function () {
							(0, _priceQuoutes.PQ_MODAL_SHOW)();
							popover.close();
						});
					}
				});

				_this3.context.appendChild(el);
			});
		}
	}, {
		key: "finalize",
		value: function finalize(popContent) {
			this.context.scrollTop = popContent.scrollHeight;
		}
	}]);

	return PopoverContext;
}();

/***/ }),

/***/ "./src/components/menu/hideMenu.es6":
/*!******************************************!*\
  !*** ./src/components/menu/hideMenu.es6 ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MenuHideButton = undefined;

var _component = __webpack_require__(/*! ../../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

var _settings = __webpack_require__(/*! ../../actions/settings */ "./src/actions/settings.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MenuHideButton = exports.MenuHideButton = function (_Component) {
	_inherits(MenuHideButton, _Component);

	function MenuHideButton() {
		_classCallCheck(this, MenuHideButton);

		return _possibleConstructorReturn(this, (MenuHideButton.__proto__ || Object.getPrototypeOf(MenuHideButton)).call(this, 'button.btn btn-white[<i class="fa fa-bars"></i>]', {
			onclick: function onclick() {
				return (0, _settings.HIDE_MENU)(true);
			}
		}));
	}

	return MenuHideButton;
}(_component2.default);

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

var _settings = __webpack_require__(/*! ../../actions/settings */ "./src/actions/settings.es6");

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
			return _get(LanguageButton.prototype.__proto__ || Object.getPrototypeOf(LanguageButton.prototype), "makeTrigger", this).call(this, { className: 'btn btn-primary font-bold pos-rlt has-drop-down', style: 'text-transform : uppercase' });
		}
	}, {
		key: "build",
		value: function build() {
			var _this3 = this;

			_constants.LANGUAGE_LIST.forEach(function (name) {

				if (!window.TerminalState.hasPermissions() && name === 'GALILEO') {
					return '';
				}

				var button = (0, _dom2.default)("button.btn btn-block btn-gold t-f-size-10 font-bold " + (_this3.language === name ? ' active' : '') + " [" + name + "]");

				button.addEventListener('click', function () {
					_this3.popover.close();
					(0, _settings.CHANGE_INPUT_LANGUAGE)(name);
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

var _priceQuoutes = __webpack_require__(/*! ../../actions/priceQuoutes */ "./src/actions/priceQuoutes.es6");

var _component = __webpack_require__(/*! ../../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PqButton = function (_Component) {
	_inherits(PqButton, _Component);

	function PqButton() {
		_classCallCheck(this, PqButton);

		return _possibleConstructorReturn(this, (PqButton.__proto__ || Object.getPrototypeOf(PqButton)).call(this, 'button.btn btn-sm btn-mozilla font-bold[PQ]', { onclick: _priceQuoutes.PQ_MODAL_SHOW }));
	}

	_createClass(PqButton, [{
		key: "setState",
		value: function setState(_ref) {
			var requestId = _ref.requestId,
			    state = _objectWithoutProperties(_ref, ["requestId"]);

			return _get(PqButton.prototype.__proto__ || Object.getPrototypeOf(PqButton.prototype), "setState", this).call(this, {
				canCreatePq: state.curGds.get('canCreatePq'),
				requestId: requestId
			});
		}
	}, {
		key: "_renderer",
		value: function _renderer() {
			this.context.disabled = this.state.canCreatePq !== true;
			this.context.classList.toggle('hidden', !this.state.requestId);
		}
	}]);

	return PqButton;
}(_component2.default);

exports.default = PqButton;

/***/ }),

/***/ "./src/components/menu/quotes.es6":
/*!****************************************!*\
  !*** ./src/components/menu/quotes.es6 ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Quotes = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _priceQuoutes = __webpack_require__(/*! ../../actions/priceQuoutes */ "./src/actions/priceQuoutes.es6");

var _component = __webpack_require__(/*! ../../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Quotes = exports.Quotes = function (_Component) {
	_inherits(Quotes, _Component);

	function Quotes() {
		_classCallCheck(this, Quotes);

		return _possibleConstructorReturn(this, (Quotes.__proto__ || Object.getPrototypeOf(Quotes)).call(this, 'button.btn btn-mozilla font-bold[Quotes]', {
			onclick: function onclick(e) {
				e.target.innerHTML = 'Loading';
				e.target.disabled = true;
				(0, _priceQuoutes.SHOW_PQ_QUOTES)().then(function () {
					e.target.innerHTML = 'Quotes';e.target.disabled = false;
				});
			}
		}));
	}

	_createClass(Quotes, [{
		key: "setState",
		value: function setState(_ref) {
			var requestId = _ref.requestId;

			return _get(Quotes.prototype.__proto__ || Object.getPrototypeOf(Quotes.prototype), "setState", this).call(this, {
				requestId: requestId
			});
		}
	}, {
		key: "_renderer",
		value: function _renderer() {
			this.context.classList.toggle('hidden', !this.state.requestId);
		}
	}]);

	return Quotes;
}(_component2.default);

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

var _keySettings = __webpack_require__(/*! ../popovers/keySettings */ "./src/components/popovers/keySettings.es6");

var _keySettings2 = _interopRequireDefault(_keySettings);

var _textSize = __webpack_require__(/*! ../popovers/textSize */ "./src/components/popovers/textSize.es6");

var _textSize2 = _interopRequireDefault(_textSize);

var _component = __webpack_require__(/*! ../../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SettingsButtons = exports.SettingsButtons = function (_Component) {
	_inherits(SettingsButtons, _Component);

	function SettingsButtons() {
		_classCallCheck(this, SettingsButtons);

		return _possibleConstructorReturn(this, (SettingsButtons.__proto__ || Object.getPrototypeOf(SettingsButtons)).call(this, 'article.small-buttons'));
	}

	_createClass(SettingsButtons, [{
		key: "mount",
		value: function mount(_ref) {
			var _this2 = this;

			var theme = _ref.theme,
			    terminalThemes = _ref.terminalThemes,
			    fontSize = _ref.fontSize,
			    keyBindings = _ref.keyBindings,
			    defaultPccs = _ref.defaultPccs;

			this.children({ theme: theme, terminalThemes: terminalThemes, fontSize: fontSize, keyBindings: keyBindings, defaultPccs: defaultPccs }).map(function (element) {
				return _this2.context.appendChild(element);
			});
		}
	}, {
		key: "children",
		value: function children(_ref2) {
			var theme = _ref2.theme,
			    terminalThemes = _ref2.terminalThemes,
			    fontSize = _ref2.fontSize,
			    keyBindings = _ref2.keyBindings,
			    defaultPccs = _ref2.defaultPccs;

			var themeBtn = new _theme2.default({
				icon: '<i class="fa fa-paint-brush t-f-size-14"></i>',
				themes: terminalThemes,
				theme: theme
			}).getTrigger();

			var textSize = new _textSize2.default({
				icon: '<i class="fa fa-text-height t-f-size-14"></i>',
				fontSize: fontSize
			}).getTrigger();

			var history = new _history.History({
				icon: '<i class="fa fa-history t-f-size-14"></i>'
			}).getTrigger();

			var keySettings = new _keySettings2.default({
				icon: '<i class="fa fa-gear t-f-size-14"></i>',
				keyBindings: keyBindings,
				defaultPccs: defaultPccs
			}).getTrigger();

			return [themeBtn, textSize, history, keySettings];
		}
	}, {
		key: "_renderer",
		value: function _renderer(_ref3) {
			var _this3 = this;

			var theme = _ref3.theme,
			    terminalThemes = _ref3.terminalThemes,
			    fontSize = _ref3.fontSize,
			    keyBindings = _ref3.keyBindings,
			    defaultPccs = _ref3.defaultPccs;

			this.context.innerHTML = '';
			this.children({ theme: theme, terminalThemes: terminalThemes, fontSize: fontSize, keyBindings: keyBindings, defaultPccs: defaultPccs }).map(function (element) {
				return _this3.context.appendChild(element);
			});
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

var _gdsDirectPqButton = __webpack_require__(/*! ./menu/gdsDirectPqButton.es6 */ "./src/components/menu/gdsDirectPqButton.es6");

var _gdsDirectPqButton2 = _interopRequireDefault(_gdsDirectPqButton);

var _devButtons = __webpack_require__(/*! ./menu/devButtons.es6 */ "./src/components/menu/devButtons.es6");

var _dom = __webpack_require__(/*! ../helpers/dom.es6 */ "./src/helpers/dom.es6");

var _dom2 = _interopRequireDefault(_dom);

var _component = __webpack_require__(/*! ../modules/component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

var _settingsButtons = __webpack_require__(/*! ./menu/settingsButtons */ "./src/components/menu/settingsButtons.es6");

var _gdsAreas = __webpack_require__(/*! ./menu/gdsAreas */ "./src/components/menu/gdsAreas.es6");

var _languageButtons = __webpack_require__(/*! ./menu/languageButtons */ "./src/components/menu/languageButtons.es6");

var _logButton = __webpack_require__(/*! ./popovers/logButton */ "./src/components/popovers/logButton.es6");

var _quotes = __webpack_require__(/*! ./menu/quotes */ "./src/components/menu/quotes.es6");

var _hideMenu = __webpack_require__(/*! ./menu/hideMenu */ "./src/components/menu/hideMenu.es6");

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
			this.observe(new _component2.default('article').observe(new _quotes.Quotes()));

			this.observe(new _settingsButtons.SettingsButtons());

			this.attach((0, _dom2.default)('span.label[Session]'));

			this.observe(new _gdsAreas.GdsAreas());

			this.attach((0, _dom2.default)('span.label[Language]'));

			this.observe(new _languageButtons.LanguageButtons());

			this.observe(new _component2.default('article').observe(new _pqButton2.default()).observe(new _gdsDirectPqButton2.default()));

			this.observe(new _component2.default('article.align-bottom').observe(new _hideMenu.MenuHideButton()));

			if (state.permissions) {
				this.attach((0, _dom2.default)('span.label[Dev actions]'));

				this.observe(new _component2.default('article').observe(new _devButtons.DevButtons()).observe(new _logButton.LogButton()));
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

var _settings = __webpack_require__(/*! ../../actions/settings */ "./src/actions/settings.es6");

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

			(0, _settings.GET_HISTORY)().then(function (response) {

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

/***/ "./src/components/popovers/keySettings.es6":
/*!*************************************************!*\
  !*** ./src/components/popovers/keySettings.es6 ***!
  \*************************************************/
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

var _settings = __webpack_require__(/*! ../../actions/settings */ "./src/actions/settings.es6");

var _keyBinding = __webpack_require__(/*! ../../helpers/keyBinding */ "./src/helpers/keyBinding.es6");

var _constants = __webpack_require__(/*! ../../constants */ "./src/constants.es6");

var _store = __webpack_require__(/*! ./../../store */ "./src/store.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KeySettings = function (_ButtonPopOver) {
	_inherits(KeySettings, _ButtonPopOver);

	function KeySettings(_ref) {
		var keyBindings = _ref.keyBindings,
		    defaultPccs = _ref.defaultPccs,
		    params = _objectWithoutProperties(_ref, ['keyBindings', 'defaultPccs']);

		_classCallCheck(this, KeySettings);

		var _this = _possibleConstructorReturn(this, (KeySettings.__proto__ || Object.getPrototypeOf(KeySettings)).call(this, params, 'div.terminal-menu-popover hotkeysContext'));

		_this.makeTrigger({
			onclick: function onclick() {
				_this.popContent.innerHTML = '';
				var c = new Context(_this, keyBindings, defaultPccs);
				_this.popContent.appendChild(c.context);
			}
		});
		return _this;
	}

	return KeySettings;
}(_buttonPopover2.default);

exports.default = KeySettings;

var Context = function () {
	function Context(popover, keyBindings, defaultPccs) {
		_classCallCheck(this, Context);

		this.context = (0, _dom2.default)('div');
		this.currentKeyBindings = keyBindings;
		this.currentPccs = defaultPccs;
		this.inputFields = {};
		this._makeBody(popover);
	}

	_createClass(Context, [{
		key: '_makeBody',
		value: function _makeBody(parent) {
			var _this2 = this;

			var _getStore$app$Gds$get = (0, _store.getStore)().app.Gds.getCurrent().get(),
			    name = _getStore$app$Gds$get.name;

			var selectedGds = name;

			var container = (0, _dom2.default)('div');
			var header = (0, _dom2.default)('div.gds-select-header');
			var content = (0, _dom2.default)('div.gds-select-container');

			container.appendChild(header);
			container.appendChild(content);

			_constants.GDS_LIST.forEach(function (gds, idx) {
				var isActive = selectedGds === gds;

				var btn = (0, _dom2.default)('a.gds-select t-pointer ' + (isActive ? 'checked' : '') + '[' + gds + ']');
				header.appendChild(btn);

				// Change active tab
				btn.addEventListener('click', function (e) {
					e.target.classList.add('checked');
					selectedGds = gds;
					var activeIdx = _constants.GDS_LIST.findIndex(function (el) {
						return el === selectedGds;
					});
					var children = content.children;

					for (var i = 0; i < children.length; i++) {
						content.children[i].classList.remove('active');
						header.children[i].classList.remove('checked');
						if (i === activeIdx) {
							content.children[i].classList.add('active');
							header.children[i].classList.add('checked');
						}
					}
				});

				var tab = (0, _dom2.default)('div.tab' + (isActive ? ' active' : ''));
				content.appendChild(tab);

				var tabContent = (0, _dom2.default)('div.tab-content');
				tab.appendChild(tabContent);

				var buttonHeader = (0, _dom2.default)('div.settings-input-container input-container-header');
				buttonHeader.appendChild((0, _dom2.default)('label[Key]'));
				buttonHeader.appendChild((0, _dom2.default)('label[Command]'));
				buttonHeader.appendChild((0, _dom2.default)('label[Autorun]'));

				var inputFields = _this2._makeInputFieldList(gds);
				tabContent.appendChild(inputFields.pccContainer);

				tabContent.appendChild(buttonHeader);

				inputFields.buttons.forEach(function (button) {
					tabContent.appendChild(button.inputContainer);
				});
			});

			var saveBtn = (0, _dom2.default)('button.btn btn-sm btn-purple font-bold pull-right [Save]', {
				onclick: function onclick() {
					_this2.save();
					parent.popover.close();
				}
			});
			header.appendChild(saveBtn);

			this.context.appendChild(container);
		}
	}, {
		key: '_makeInputFieldList',
		value: function _makeInputFieldList(gds) {
			var _this3 = this;

			var data = { pccContainer: null, buttons: [] };
			var buttonPrefixes = [null, 'shift', 'ctrl'];
			var startingKey = 111;

			// Default PCC
			var pccContainer = this._getInputRow({
				label: 'Default PCC',
				name: 'defaultPcc[' + gds + ']',
				placeholder: '',
				value: this._getPcc(gds)
			});

			data.pccContainer = pccContainer;

			// All button shortcuts
			buttonPrefixes.forEach(function (prefix) {
				for (var i = 1; i <= 12; i += 1) {
					var key = startingKey + i;
					var btnName = prefix ? prefix + '+' + key : '' + key;
					var placeholder = (0, _keyBinding.getBindingForKey)(btnName, gds, false);

					// "Hotkey" input
					var inputContainer = _this3._getInputRow({
						label: prefix ? prefix + ' + F' + i : 'F' + i,
						placeholder: placeholder.command,
						value: _this3._getKeyBinding(gds, btnName, 'command')
					});

					// "Autorun" checkbox
					var userAutorun = _this3._getKeyBinding(gds, btnName, 'autorun');
					inputContainer.appendChild((0, _dom2.default)('input.form-control settings-input ch-box', {
						type: 'checkbox',
						checked: userAutorun !== false ? userAutorun : placeholder.autorun
					}));
					data.buttons.push(_defineProperty({ key: key, btnName: btnName, placeholder: placeholder, inputContainer: inputContainer }, 'placeholder', placeholder));
				}
			});

			this.inputFields[gds] = data;

			return data;
		}
	}, {
		key: '_getInputRow',
		value: function _getInputRow(_ref2) {
			var label = _ref2.label,
			    placeholder = _ref2.placeholder,
			    value = _ref2.value;

			var container = (0, _dom2.default)('div.settings-input-container');
			container.appendChild((0, _dom2.default)('label[' + label + ']'));
			container.appendChild((0, _dom2.default)('input.form-control settings-input', { placeholder: placeholder, value: value }));
			return container;
		}
	}, {
		key: '_getKeyBinding',
		value: function _getKeyBinding(gds, btnName, type) {
			var hasValue = this.currentKeyBindings && this.currentKeyBindings[gds] && this.currentKeyBindings[gds][btnName];
			if (hasValue) {
				var value = this.currentKeyBindings[gds][btnName];
				return value[type];
			}

			return type === 'command' ? '' : false;
		}
	}, {
		key: '_getPcc',
		value: function _getPcc(gds) {
			return this.currentPccs && this.currentPccs[gds] ? this.currentPccs[gds] : '';
		}
	}, {
		key: 'save',
		value: function save() {
			var _this4 = this;

			var result = {};

			_constants.GDS_LIST.forEach(function (gds) {
				result[gds] = { keyBindings: {}, defaultPcc: null };

				_this4.inputFields[gds].buttons.forEach(function (input) {
					var placeholder = input.placeholder;
					var command = input.inputContainer.children[1].value;
					var autorun = input.inputContainer.children[2].checked ? 1 : 0;

					if (command !== '' || autorun !== placeholder.autorun) {
						result[gds].keyBindings[input.btnName] = { command: command, autorun: autorun };
					}
				});

				result[gds].defaultPcc = _this4.inputFields[gds].pccContainer.children[1].value;

				// jquery-param removes empty objects so we need to preserve emptiness with "null"
				if ($.isEmptyObject(result[gds].keyBindings)) {
					result[gds].keyBindings = null;
				}
			});

			(0, _settings.CHANGE_SETTINGS)(result);
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

		return _possibleConstructorReturn(this, (LogButton.__proto__ || Object.getPrototypeOf(LogButton)).call(this, 'div.m-t-sm'));
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

var _settings = __webpack_require__(/*! ../../actions/settings */ "./src/actions/settings.es6");

var _constants = __webpack_require__(/*! ../../constants */ "./src/constants.es6");

var _helpers = __webpack_require__(/*! ../../helpers/helpers */ "./src/helpers/helpers.es6");

var _buttonPopover = __webpack_require__(/*! ../../modules/dom/buttonPopover */ "./src/modules/dom/buttonPopover.es6");

var _store = __webpack_require__(/*! ../../store */ "./src/store.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cellObj = [];

var HOVER_CLASS = 'bg-purple';
var ACTIVE_CLASS = 'bg-info';

var Matrix = function (_ButtonPopover) {
	_inherits(Matrix, _ButtonPopover);

	function Matrix() {
		_classCallCheck(this, Matrix);

		return _possibleConstructorReturn(this, (Matrix.__proto__ || Object.getPrototypeOf(Matrix)).call(this, { icon: '<i class="fa fa-th-large"></i>' }));
	}

	_createClass(Matrix, [{
		key: "getPopContent",
		value: function getPopContent() {
			this.build();
			return this.popContent;
		}
	}, {
		key: "build",
		value: function build() {
			this.wideButton = (0, _dom2.default)('div.bg-white matrix-column ', {
				onclick: function onclick(e) {
					e.target.classList.toggle(ACTIVE_CLASS);
					e.target.classList.toggle('bg-white');
					(0, _settings.ADD_WHIDE_COLUMN)();
				}
			});

			this._renderer();

			var table = new _dom2.default('table.matrix-table');

			[0, 1, 2, 3].map(this._rows).map(this._cells, this).map(function (tr) {
				table.appendChild(tr);
			});

			var _getStorageMatrix = (0, _helpers.getStorageMatrix)(),
			    rows = _getStorageMatrix.rows,
			    cells = _getStorageMatrix.cells;

			this._addColor(rows, cells, ACTIVE_CLASS);

			this.popContent.attach(this.wideButton);

			this.popContent.attach(table);
		}
	}, {
		key: "_rows",
		value: function _rows() {
			cellObj.push([]);
			return (0, _dom2.default)('tr');
		}
	}, {
		key: "_cells",
		value: function _cells(row, rIndex) {
			var _this2 = this;

			[0, 1, 2, 3].map(function (cIndex) {
				return row.appendChild(_this2._cell(rIndex, cIndex));
			});
			return row;
		}
	}, {
		key: "_cell",
		value: function _cell(rIndex, cIndex) {
			var _this3 = this;

			var selectMatrix = function selectMatrix() {
				// this.popover.close();

				var makeArray = function makeArray(length) {
					return Array.apply(null, { length: length });
				};
				var arrayByIndex = function arrayByIndex(yIndex) {
					return function (x, xIndex) {
						return yIndex * _constants.MAX_ROWS + xIndex;
					};
				};
				var mergeIntoOne = function mergeIntoOne(part, collection) {
					return [].concat(_toConsumableArray(part), _toConsumableArray(collection));
				};

				var cellsSelected = makeArray(rIndex + 1).map(function (y, yIndex) {
					return makeArray(cIndex + 1).map(arrayByIndex(yIndex));
				}).reduce(mergeIntoOne);

				_this3._removeClass(ACTIVE_CLASS);
				_this3._addColor(rIndex, cIndex, ACTIVE_CLASS);

				var matrixProps = {
					rows: rIndex,
					cells: cIndex,
					list: cellsSelected
				};

				localStorage.setItem('matrix', JSON.stringify(matrixProps));

				(0, _settings.CHANGE_MATRIX)(matrixProps);
			};

			var cell = (0, _dom2.default)('td.matrix-p-row', { onclick: selectMatrix });

			cell.addEventListener('mouseover', function () {
				return _this3._addColor(rIndex, cIndex, HOVER_CLASS);
			});
			cell.addEventListener('mouseleave', function () {
				return _this3._removeClass(HOVER_CLASS);
			});

			cellObj[rIndex].push(cell);

			return cell;
		}
	}, {
		key: "_addColor",
		value: function _addColor(rIndex, cIndex, className) {
			for (var i = 0; i <= rIndex; i++) {
				cellObj[i].slice(0, cIndex + 1).forEach(function (cell) {
					return cell.classList.add(className);
				});
			}
		}
	}, {
		key: "_removeClass",
		value: function _removeClass(className) {
			[].forEach.call(this.popContent.context.querySelectorAll('.matrix-p-row.' + className), function (cell) {
				return cell.classList.remove(className);
			});
		}
	}, {
		key: "_renderer",
		value: function _renderer() {
			if (this.wideButton) {
				if ((0, _store.getStore)().app.getGds().get('hasWide')) {
					this.wideButton.classList.add(ACTIVE_CLASS);
					this.wideButton.classList.remove('bg-white');
				} else {
					this.wideButton.classList.remove(ACTIVE_CLASS);
					this.wideButton.classList.add('bg-white');
				}
			}
		}
	}]);

	return Matrix;
}(_buttonPopover.ButtonPopover);

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

var _settings = __webpack_require__(/*! ../../actions/settings */ "./src/actions/settings.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextSize = function (_ButtonPopOver) {
	_inherits(TextSize, _ButtonPopOver);

	function TextSize(_ref) {
		var fontSize = _ref.fontSize,
		    params = _objectWithoutProperties(_ref, ['fontSize']);

		_classCallCheck(this, TextSize);

		var _this = _possibleConstructorReturn(this, (TextSize.__proto__ || Object.getPrototypeOf(TextSize)).call(this, params, 'div.terminal-menu-popover'));

		_this.makeTrigger();

		_this.curFont = fontSize;
		_this.curBtn = '';
		return _this;
	}

	_createClass(TextSize, [{
		key: 'build',
		value: function build(list) {
			var _this2 = this;

			[1, 2, 3, 4].map(function (value) {

				var button = (0, _dom2.default)('a.t-pointer  [' + value + ']x');

				button.addEventListener('click', function () {
					_this2.curBtn.classList.remove('checked');

					_this2.toggle(button);
					_this2.click(value);
				});

				_this2.popContent.appendChild(button);

				if (_this2.curFont === value) {
					_this2.toggle(button);
				}

				return button;
			});
		}
	}, {
		key: 'click',
		value: function click(value) {
			this.popover.close();
			this.curFont = value;
			(0, _settings.CHANGE_FONT_SIZE)({ fontSize: value });
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

var _settings = __webpack_require__(/*! ../../actions/settings */ "./src/actions/settings.es6");

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

			(0, _settings.CHANGE_STYLE)(newThemeClass);
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
		value: function setState(state) {
			var _state$curGds$get = state.curGds.get(),
			    terminals = _state$curGds$get.terminals,
			    matrix = _state$curGds$get.matrix,
			    dimensions = _state$curGds$get.dimensions,
			    hasWide = _state$curGds$get.hasWide,
			    wideDimensions = _state$curGds$get.wideDimensions,
			    name = _state$curGds$get.name;

			this.terminals = terminals;

			return _get(TerminalsMatrix.prototype.__proto__ || Object.getPrototypeOf(TerminalsMatrix.prototype), 'setState', this).call(this, {
				matrix: matrix, dimensions: dimensions, name: name, hasWide: hasWide, wideDimensions: wideDimensions
			});
		}
	}, {
		key: '_renderer',
		value: function _renderer() {
			var _this2 = this;

			var _state = this.state,
			    dimensions = _state.dimensions,
			    matrix = _state.matrix,
			    hasWide = _state.hasWide,
			    wideDimensions = _state.wideDimensions;

			var terminals = this.terminals;

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
var LANGUAGE_LIST = exports.LANGUAGE_LIST = ['APOLLO', 'SABRE', 'AMADEUS', 'GALILEO'];

var OFFSET_QUOTES = exports.OFFSET_QUOTES = 500;
var OFFSET_DEFAULT = exports.OFFSET_DEFAULT = 100;

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

		var _this = _possibleConstructorReturn(this, (ContainerMain.__proto__ || Object.getPrototypeOf(ContainerMain)).call(this, "section.terminal-wrap-custom"));

		_this.observe(new _sectionsWrap.TableSections());

		_this.parent = document.getElementById(rootId);

		_this.parent.appendChild(_this.getContext());

		_this.tempTerminal = new _tempTerminal.TempTerminal();

		_this.append(_this.tempTerminal);
		return _this;
	}

	_createClass(ContainerMain, [{
		key: "changeFontClass",
		value: function changeFontClass(fontSize) {
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

		_this.observe(new _component2.default('tr').observe([new LeftTd(), new _PqQuotes.PqQuotes(), new _right.RightSide(), new _actionsMenu.ActionsMenuBottom()]));
		return _this;
	}

	return TableSections;
}(_component2.default);

var LeftTd = function (_Component2) {
	_inherits(LeftTd, _Component2);

	function LeftTd() {
		_classCallCheck(this, LeftTd);

		var _this2 = _possibleConstructorReturn(this, (LeftTd.__proto__ || Object.getPrototypeOf(LeftTd)).call(this, 'td.left'));

		_this2.observe([new _terminalMatrix2.default(), new _actionsMenu.ActionsMenu()]
		// new ActionsMenuBottom()
		);
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
			var menuHidden = _ref.menuHidden;

			return _get(RightSide.prototype.__proto__ || Object.getPrototypeOf(RightSide.prototype), "setState", this).call(this, {
				menuHidden: menuHidden
			});
		}
	}, {
		key: "_renderer",
		value: function _renderer() {
			this.context.classList.toggle('hidden', this.state.menuHidden);
		}
	}]);

	return RightSide;
}(_component2.default);

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
exports.getStorageMatrix = exports.getDate = exports.splitLines = exports.splitIntoLinesArr = exports.makePages = exports.getReplacement = exports.escapeSpecials = exports.getFirstNumber = exports.replaceChar = undefined;

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

var replaceChar = exports.replaceChar = function replaceChar(value, char) {
	return value.replace(new RegExp(char, 'g'), '');
};
var getFirstNumber = exports.getFirstNumber = function getFirstNumber(line) {
	return line.match(/^\d+|\d+\b|\d+(?=\w)/)[0];
};
var escapeSpecials = exports.escapeSpecials = function escapeSpecials(value) {
	return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

var getReplacement = exports.getReplacement = function getReplacement(evt, isApollo) {
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

var splitLines = exports.splitLines = function splitLines(txt) {
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
exports.pressedShortcuts = exports.getBindingForKey = undefined;

var _helpers = __webpack_require__(/*! ./helpers.es6 */ "./src/helpers/helpers.es6");

var _actions = __webpack_require__(/*! ../actions */ "./src/actions.es6");

var _store = __webpack_require__(/*! ../store */ "./src/store.es6");

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

/**
 * Default key bindings
 * Object keys are in format "keyNumber" or "ctrl|shift+keyNumber"
 */
var DEFAULT_KEY_BINDINGS = {
	116: {
		apollo: { command: '0TURZZBK1YYZ{{datePlus320}}-RETENTION LINE', autorun: 1 },
		amadeus: { command: 'RU1AHK1SFO{{datePlus320}}/RETENTION', autorun: 1 },
		sabre: { command: '0OTHYYGK1/RETENTION{{datePlus320}}', autorun: 1 },
		galileo: { command: '0TURZZBK1YYZ{{dateMinus45}}-RETENTION LINE', autorun: 1 }
	},
	119: function _() {
		return '((f8Command))';
	},
	122: {
		apollo: { command: 'T:TAU/{{dateNow}}', autorun: 1 },
		amadeus: { command: 'TKTL{{dateNow}}', autorun: 1 },
		sabre: { command: '7TAW/{{dateNow}}', autorun: 1 },
		galileo: { command: 'T.TAU/{{dateNow}}', autorun: 1 }
	},
	123: {
		apollo: { command: 'R:{{userName}}', autorun: 1 },
		amadeus: { command: 'RF{{userName}}', autorun: 1 },
		sabre: { command: '6{{userName}}', autorun: 1 },
		galileo: { command: 'R.{{userName}}', autorun: 1 }
	},
	'ctrl+112': {
		apollo: 'S*CTY/',
		amadeus: 'DAC',
		sabre: 'W/*',
		galileo: '.CD'
	},
	'ctrl+113': {
		apollo: 'S*AIR/',
		amadeus: 'DNA',
		sabre: 'W/*',
		galileo: '.AD'
	},
	'shift+116': {
		apollo: { command: 'SEM/2G52/AG', autorun: 1 },
		amadeus: { command: 'AAA5E9H', autorun: 1 },
		sabre: { command: 'AAA5E9H', autorun: 1 },
		galileo: { command: 'SEM/711M/AG', autorun: 1 }
	},
	'shift+117': function shift117(gds) {
		var command = gds === 'apollo' ? 'SEM/2G55/AG' : 'AAA6IIF';
		return { command: command, autorun: 1 };
	},
	'shift+118': function shift118(gds) {
		var command = gds === 'apollo' ? 'SEM/2G2H/AG' : 'AAADK8H';
		return { command: command, autorun: 1 };
	},
	'shift+119': function shift119(gds) {
		var command = gds === 'apollo' ? 'SEM/2BQ6/AG' : 'AAAW8K7';
		return { command: command, autorun: 1 };
	},
	'shift+120': {
		apollo: { command: 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT', autorun: 1 },
		amadeus: { command: 'AP SFO 800-750-2238-A', autorun: 1 },
		sabre: { command: '91-800-750-2238-A', autorun: 1 },
		galileo: { command: 'P.SFOT:800-750-2238 ASAP CUSTOMER SUPPORT', autorun: 1 }
	}

	/**
  * Converts Event button clicks to readable string
  * e.g. CTRL + F12 = 'ctrl+123'; F1 = '112' etc.
  * @param evt Event
  * @returns string
  */
};function eventToButtonName(evt) {
	var keymap = evt.keyCode || evt.which;
	var btns = [];
	if (evt.ctrlKey || evt.metaKey) {
		btns.push('ctrl');
	} else if (evt.shiftKey) {
		btns.push('shift');
	}
	btns.push(keymap);

	return btns.join('+');
}

/**
 * Replaces command pre-defined "variables" real values
 * @param command
 * @returns string
 */
function replaceCommandVariables(command) {
	return command.replace('{{userName}}', window.apiData.auth.displayName.toUpperCase()).replace('{{dateNow}}', (0, _helpers.getDate)().now).replace('{{datePlus320}}', (0, _helpers.getDate)().plus320).replace('{{dateMinus45}}', (0, _helpers.getDate)().minus45);
}

/**
 * Checks if user has overwritten some key bindings
 * @param keyName string
 * @returns string || false
 */
function getUserCustomCommand(keyName) {
	var _getStore$app$Gds$get = (0, _store.getStore)().app.Gds.getCurrent().get(),
	    name = _getStore$app$Gds$get.name,
	    keyBindings = _getStore$app$Gds$get.keyBindings;

	if (keyBindings && keyBindings[keyName]) {
		var defaultCommand = getBindingForKey(keyName, name);
		var userReplacedCommand = replaceCommandVariables(keyBindings[keyName].command);

		// User can overwrite default command "autorun" so we still need to execute default command
		if (userReplacedCommand === '') {
			userReplacedCommand = defaultCommand.command;
		}

		return { command: userReplacedCommand, autorun: parseInt(keyBindings[keyName].autorun) };
	}
	return false;
}

var getBindingForKey = exports.getBindingForKey = function getBindingForKey(keyName, gds) {
	var replaceVariables = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	var data = DEFAULT_KEY_BINDINGS[keyName] || null;

	var result = '';
	if (data && typeof data === 'function') {
		result = data(gds);
	} else if (data && data[gds]) {
		result = data[gds];
	}

	var command = result.command || result || '';
	if (replaceVariables) {
		command = replaceCommandVariables(command);
	}

	return Object.assign({}, {
		command: command,
		autorun: result.autorun || 0
	});
};

var pressedShortcuts = exports.pressedShortcuts = function pressedShortcuts(evt, terminal, plugin) {
	var keymap = evt.keyCode || evt.which;

	var gds = plugin.settings.gds;
	var isApollo = gds === 'apollo';
	// const isApollo	= window.TerminalState.isGdsApollo();
	// console.log('key pressed:' ,keymap);

	function doF8() {
		terminal.set_command(plugin.f8Reader.getFullCommand());

		plugin.f8Reader.jumpToNextPos();
	}

	function insertOrExec(command) {
		if (command.autorun) {
			terminal.exec(command.command);
		} else {
			terminal.insert(command.command);
		}
	}

	// Try to get user custom command
	var keyName = eventToButtonName(evt);
	var command = getUserCustomCommand(keyName);
	if (command !== false) {
		if (command === '((f8Command))') {
			doF8();
		} else {
			insertOrExec(command);
		}
		return true;
	}

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

			case 112: // F1
			case 113:
				// F2
				var _command = getBindingForKey("ctrl+" + keymap, gds);
				insertOrExec(_command);
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

			case 116: // F5
			case 117: // F6
			case 118: // F7
			case 119: // F8
			case 120:
				// F9
				var _command2 = getBindingForKey("shift+" + keymap, gds);
				insertOrExec(_command2);
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

		case 119:
			//F8
			doF8();
			break;

		case 116: // F5
		case 122: // F11
		case 123:
			// F12
			var _command3 = getBindingForKey(keymap, gds);
			insertOrExec(_command3);
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
exports.setLink = exports.post = exports.get = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = __webpack_require__(/*! ../constants.es6 */ "./src/constants.es6");

__webpack_require__(/*! whatwg-fetch */ "./node_modules/whatwg-fetch/fetch.js");

var _debug = __webpack_require__(/*! ./debug */ "./src/helpers/debug.es6");

var JParam = __webpack_require__(/*! jquery-param */ "./node_modules/jquery-param/jquery-param.js");

var Url = void 0;

var getPostRequestHeader = function getPostRequestHeader(data) {
	return {
		credentials: 'include',
		body: JParam(data),
		method: 'POST',
		headers: {
			'Accept': 'application/json, application/xml, text/plain, text/html, .',
			'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
		}
	};
};

var Ask = function Ask(url, params) {
	if (url.substr(0, 1) !== '/') url = '/' + url;

	return fetch(wwwFullDir + url, params).then(function (response) {

		if (response && response.status && response.status === 200) {
			return response.json();
		}

		console.log("ERORR:   ", response.text());
		return Promise.reject(response.statusText);
	}).then(_debug.showUserMessages).catch(_debug.debugRequest);
};

var get = exports.get = function get(url) {
	var defParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	if (!url) return '';

	if (defParams) url += '?rId=' + window.apiData.rId;

	return Ask(url, { credentials: 'include' });
};

var post = exports.post = function post(url) {
	var defParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	if (!url) return '';

	if (defParams) url += '?rId=' + window.apiData.rId;

	return Ask(url, _extends({}, getPostRequestHeader(defParams)));
};

var runSyncCommand = function runSyncCommand(postData) {
	return Ask(_constants.API_HOST + Url, _extends({}, getPostRequestHeader(postData)));
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

var _settings2 = __webpack_require__(/*! ../actions/settings */ "./src/actions/settings.es6");

var _gdsActions = __webpack_require__(/*! ../actions/gdsActions */ "./src/actions/gdsActions.es6");

var _logger = __webpack_require__(/*! ../helpers/logger */ "./src/helpers/logger.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = __webpack_require__(/*! jquery */ "jquery");
window.$ = window.jQuery = $;

// require('jquery.terminal/js/jquery.terminal');
__webpack_require__(/*! ../lib/jquery-terminal */ "./src/lib/jquery-terminal.js");
__webpack_require__(/*! keyboardevent-key-polyfill */ "./node_modules/keyboardevent-key-polyfill/index.js").polyfill();
// import {debugOutput} from "../helpers/logger";

var TerminalPlugin = function () {
	function TerminalPlugin(params) {
		_classCallCheck(this, TerminalPlugin);

		this.settings = params;
		this.context = params.context;
		this.name = params.name;

		this.gdsName = params.gds;

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

			var ctrlOrMetaKey = evt.ctrlKey || evt.metaKey;
			var replace = !this.f8Reader.getIsActive() && evt.key.length === 1 && !ctrlOrMetaKey;

			// if test>>>asd+sa and cursor on + // execute only between last > and + cmd
			if (isEnter) {
				this.f8Reader.isActive = false;

				var cmd = terminal.before_cursor();
				var lastPromptSignPos = cmd.lastIndexOf('>') + 1;

				if (lastPromptSignPos) cmd = cmd.substring(lastPromptSignPos, cmd.length);

				terminal.set_command(cmd);
			} else if (replace) {
				// Replace text insted of moving forward (like INSERT button works on some text editors). Example:
				// >H|E|LLO - press letter "A", result: >HA|L|LO instead of >HA|E|LLO ("||" - cursor position)
				this.terminal.cmd().delete(+1);
			}
		}
	}, {
		key: '_changeActiveTerm',
		value: function _changeActiveTerm() {
			window.activeTerminal = this;
			(0, _settings2.CHANGE_ACTIVE_TERMINAL)({ curTerminalId: this.name });
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
				// clickTimeout	: 300,
				onTerminalChange: this._changeActiveTerm.bind(this),
				onBeforeCommand: this._checkBeforeEnter.bind(this),
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
						this.outputLiner.printOutput(this.pagination.next().print(), false, this.appliedRules);
						// this.print( this.pagination.next().print() );
						return true;

					case 'MU':
						this.outputLiner.printOutput(this.pagination.prev().print(), false, this.appliedRules);
						// this.print( this.pagination.prev().print() );
						return true;

					case 'MDA':
						this.outputLiner.printOutput(this.pagination.printAll(), false, this.appliedRules);
						// this.print( this.pagination.printAll() );
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

			this.spinner.start();

			var before = function before() {
				/** spinner is also new line  **/
				_this.outputLiner.printOutput('');
				_this.spinner.start();

				_this.print('[[;;;usedCommand;]>' + command.toUpperCase() + ']');
				return command.toUpperCase();
			};

			this.session.perform(before).then(function (response) {
				_this.spinner.end();

				if (command) {
					if (response && response.data) _this.parseBackEnd(response, command);else _this.print('[[;;;text-danger;]SERVER ERROR]');
				}
			});

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
			    output = _data.output,
			    clearScreen = _data.clearScreen,
			    appliedRules = _data.appliedRules,
			    tabCommands = _data.tabCommands;

			this.appliedRules = appliedRules;

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

						output = this.pagination.bindOutput(output, numOfRows - 1, numOfChars).print();
					}

				output = this.outputLiner.printOutput(output, clearScreen, appliedRules);
			}

			this.tabCommands.reset(tabCommands, output);

			if (window.TerminalState.hasPermissions()) {
				data = _extends({}, data, { log: (0, _logger.loggerOutput)(data, command) });
			}

			(0, _gdsActions.UPDATE_CUR_GDS)(_extends({}, data, { gdsName: this.gdsName }));
		}
	}, {
		key: 'print',
		value: function print(output) {
			this.terminal.echo(output);
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
				openOn: 'click',
				remove: true
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
		key: 'addToObserve',
		value: function addToObserve(component) {
			this.observers.push(component);
			return this;
		}
	}, {
		key: 'observe',
		value: function observe(el) {
			var _this = this;

			if (!el) {
				return this;
			}

			if (el.constructor === Array) {
				el.map(function (obj) {
					return _this.observe(obj);
				});
			} else {
				this.context.appendChild(el.getContext());
				this.observers.push(el);
			}

			return this;
		}
	}, {
		key: 'append',
		value: function append(el) {
			var _this2 = this;

			if (el.constructor === Array) {
				el.map(function (obj) {
					return _this2.append(obj);
				});
			} else {
				if (!el) return '';

				if (!(el instanceof Element)) {
					this.context.appendChild(el.getContext());
				} else {
					this.context.appendChild(el);
				}
			}

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

/***/ "./src/modules/dom/buttonPopover.es6":
/*!*******************************************!*\
  !*** ./src/modules/dom/buttonPopover.es6 ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ButtonPopover = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tetherDrop = __webpack_require__(/*! tether-drop */ "./node_modules/tether-drop/dist/js/drop.js");

var _tetherDrop2 = _interopRequireDefault(_tetherDrop);

var _settings = __webpack_require__(/*! ../../actions/settings */ "./src/actions/settings.es6");

var _component = __webpack_require__(/*! ../component */ "./src/modules/component.es6");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ButtonPopover = exports.ButtonPopover = function (_Component) {
	_inherits(ButtonPopover, _Component);

	function ButtonPopover(_ref) {
		var icon = _ref.icon,
		    _ref$popoverProps = _ref.popoverProps,
		    popoverProps = _ref$popoverProps === undefined ? {} : _ref$popoverProps,
		    _ref$buttonProps = _ref.buttonProps,
		    buttonProps = _ref$buttonProps === undefined ? {} : _ref$buttonProps;

		_classCallCheck(this, ButtonPopover);

		var _this = _possibleConstructorReturn(this, (ButtonPopover.__proto__ || Object.getPrototypeOf(ButtonPopover)).call(this, "button.btn btn-purple m-b-sm[" + icon + "]", _extends({
			onclick: function onclick() {
				return _this.clickOnButton();
			}
		}, buttonProps)));

		_this.popContent = new _component2.default('div', popoverProps);

		_this.observe(_this.popContent);

		_this.closed = true;
		return _this;
	}

	_createClass(ButtonPopover, [{
		key: "clickOnButton",
		value: function clickOnButton() {
			if (this.popover) {
				if (this.getPopoverProps().openOn === null) // if manual open/close popover
					{
						this.closed = !this.closed;

						if (this.closed) {
							this.popover.close();
						} else {
							this.popover.open();
						}
					}

				return false;
			}

			this.popover = new _tetherDrop2.default(_extends({}, this.getPopoverDefs(), this.getPopoverProps()));

			(0, _settings.UPDATE_SCREEN)(); // need to pass current state in order to popovers components render right
			this.popover.open();
			this.closed = false;
		}
	}, {
		key: "getPopContent",
		value: function getPopContent() {}
	}, {
		key: "getPopoverDefs",
		value: function getPopoverDefs() {
			return {
				target: this.context,
				content: this.getPopContent().getContext(),
				classes: 'drop-theme-twipsy',
				position: 'left top',
				// openOn		: 'click',
				openOn: 'click'
				// constrainToWindow: true,
				// constrainToScrollParent: true
			};
		}
	}, {
		key: "getPopoverProps",
		value: function getPopoverProps() {
			var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			return props;
		}
	}, {
		key: "mount",
		value: function mount() {}
		// this.clickOnButton()


		// _renderer()
		// {
		// }

	}]);

	return ButtonPopover;
}(_component2.default);

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
		cmd: 'SI.P /SSRDOCSYYHK1///// DMMYY/ //        /         /',
		rules: [' /SSDOCSYYHK1', ' DMMYY', ' //', '        /', '        /']
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

var _constants = __webpack_require__(/*! ../constants */ "./src/constants.es6");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GDS = exports.GDS = function () {
	function GDS(_ref) {
		var gdsListDb = _ref.gdsListDb,
		    _ref$buffer = _ref.buffer,
		    buffer = _ref$buffer === undefined ? {} : _ref$buffer,
		    activeName = _ref.activeName;

		_classCallCheck(this, GDS);

		this.setCurrent(activeName);

		this.gdsSet = _constants.GDS_LIST.map(function (name) {
			var settings = gdsListDb[name] || {};
			var _buffer$gds = buffer.gds,
			    gds = _buffer$gds === undefined ? {} : _buffer$gds;


			return new _gdsUnit.GDS_UNIT(name, settings.area, gds, settings);
		});
	}

	_createClass(GDS, [{
		key: "getList",
		value: function getList() {
			return this.gdsSet;
		}
	}, {
		key: "setCurrent",
		value: function setCurrent() {
			var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'apollo';

			this.name = name;
			this.index = _constants.GDS_LIST.indexOf(name);
		}
	}, {
		key: "getCurrent",
		value: function getCurrent() {
			var _this = this;

			return this.gdsSet.filter(function (gds) {
				return _this.name === gds.get('name');
			})[0] || this.gdsSet[0];
		}
	}, {
		key: "getCurrentName",
		value: function getCurrentName() {
			return this.name;
		}
	}, {
		key: "getCurrentIndex",
		value: function getCurrentIndex() {
			return this.index;
		}
	}, {
		key: "isApollo",
		value: function isApollo() {
			return this.name === 'apollo';
		}
	}, {
		key: "update",
		value: function update(newState) {
			var gdsName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.name;

			this.gdsSet = this.gdsSet.map(function (gds) {

				if (gds.get('name') === gdsName) {
					gds.update(newState);
				}

				return gds;
			});
		}
	}, {
		key: "updateMatrix",
		value: function updateMatrix(dimensions) {
			this.getCurrent().updateMatrix(dimensions);
		}
	}, {
		key: "getGds",
		value: function getGds(gdsName) {
			return this.gdsSet.filter(function (gds) {
				return gds.get('name') === gdsName;
			})[0];
		}
	}, {
		key: "clearScreen",
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
		key: "_getActiveTerminal",
		value: function _getActiveTerminal() {
			return this.getCurrent().getActiveTerminal();
		}
	}, {
		key: "changeActive",
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
		key: "runCommand",
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
	function GDS_UNIT(name, area, buffer, settings) {
		_classCallCheck(this, GDS_UNIT);

		var _ref = settings.matrix || {},
		    matrix = _ref.matrix,
		    hasWide = _ref.hasWide;

		this.props = {
			name: name,
			list: name === 'sabre' ? _constants.AREA_LIST : _constants.AREA_LIST.slice(0, -1),
			buffer: buffer[name],

			matrix: matrix || (0, _helpers.getStorageMatrix)(),
			sessionIndex: _constants.AREA_LIST.indexOf(area),
			defaultPcc: settings.pcc || null,
			pcc: {},
			canCreatePq: false, //1
			history: [],
			terminals: {},
			curTerminalId: undefined,
			dimensions: {},
			hasWide: hasWide === 'true',
			language: settings.language || 'apollo',
			fontSize: settings.fontSize || 1,
			keyBindings: settings.keyBindings || {},
			theme: settings.theme || 4
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

/***/ "./src/modules/highlight.es6":
/*!***********************************!*\
  !*** ./src/modules/highlight.es6 ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.replaceInTerminal = exports.seedOutputString = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _actions = __webpack_require__(/*! ../actions */ "./src/actions.es6");

var _switchTerminal = __webpack_require__(/*! ./switchTerminal */ "./src/modules/switchTerminal.es6");

var _helpers = __webpack_require__(/*! ../helpers/helpers */ "./src/helpers/helpers.es6");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var makeRule = function makeRule(rule, key) {
	var isPattern = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

	var searchIndex = '';
	var isInteract = rule['onClickCommand'] || rule['onClickMessage'] || rule['onMouseOver'];

	if (isInteract) {
		searchIndex = "replace_" + key + "_" + isPattern.replace('*', '');
		tips = _extends({}, tips, _defineProperty({}, searchIndex, rule));
	}

	var className = "term-highlight " + rule.color + " " + rule['decoration'].join(' ') + (searchIndex ? " t-pointer " + searchIndex : '');
	return "[[;;;" + className + "]" + (0, _helpers.replaceChar)(rule.value, '%') + "]"; // creates span like span.usedCommand term-highlight replace_0
};

/**
 color
 decoration
 id
 isInSameWindow
 onClickCommand : command / {lineNumber} / {pattern}
 onClickMessage
 onMouseOver
 value
**/

var replaceAll = function replaceAll(value) {
	return new RegExp(value, 'g');
};

var tips = {};

var seedOutputString = exports.seedOutputString = function seedOutputString(outputText, appliedRules) {

	tips = {};

	var loop = function loop(rule, key) {
		var value = rule.value;

		var replaceWith = function replaceWith() {
			var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
			var patternReplaced = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

			var newRule = _extends({}, rule);

			if (pattern) {
				newRule.onClickCommand = newRule.onClickCommand.replace(pattern, patternReplaced);
			}

			return makeRule(newRule, key, patternReplaced);
		};

		var replaceOutput = function replaceOutput(pattern, onClickCmd) {
			return function (line) {
				var replaced = replaceWith(pattern, onClickCmd(line));
				var needle = replaceAll((0, _helpers.escapeSpecials)(value));

				var newLine = line.replace(needle, replaced);
				outputText = outputText.replace(line, newLine);
			};
		};

		var findInjection = function findInjection(line) {
			return line.indexOf(value) > -1;
		};
		var replacePerLine = function replacePerLine(pattern, onClickCmd) {
			return (0, _helpers.splitLines)(outputText).filter(findInjection).map(replaceOutput(pattern, onClickCmd));
		};

		if (rule.onClickCommand.indexOf('{lnNumber}') > -1) {
			return replacePerLine('{lnNumber}', function (line) {
				return (0, _helpers.getFirstNumber)(line);
			});
		}

		if (rule.onClickCommand.indexOf('{pattern}') > -1) {
			return replacePerLine('{pattern}', function () {
				return (0, _helpers.replaceChar)(value, '%');
			});
		}

		if (outputText.indexOf(value) > -1) {
			var needle = new RegExp((0, _helpers.escapeSpecials)(value), 'g');
			outputText = outputText.replace(needle, replaceWith());
		}
	};

	appliedRules.forEach(loop);

	return { tips: tips, outputText: outputText };
};

var replaceInTerminal = exports.replaceInTerminal = function replaceInTerminal(div, tips) {

	var findSpan = function findSpan(key) {
		return function (target) {
			var _tips$key = tips[key],
			    id = _tips$key.id,
			    onMouseOver = _tips$key.onMouseOver,
			    onClickMessage = _tips$key.onClickMessage,
			    onClickCommand = _tips$key.onClickCommand,
			    isInSameWindow = _tips$key.isInSameWindow;


			if (onClickMessage) {
				$(target).popover(_extends({}, popoverDefs(div, onClickMessage, id), {

					template: '<div class="popover popoverOnClick font-bold text-danger" role="tooltip"><div class="arrow"></div><div class="popover-content highlight-popover"></div></div>'
				}));
			}

			if (onMouseOver) {
				$(target).popover(_extends({}, popoverDefs(div, onMouseOver, id), {

					placement: 'top',
					trigger: 'hover',
					template: '<div class="popover font-bold text-primary" role="tooltip"><div class="arrow"></div><div class="popover-content highlight-popover"></div></div>'
				}));
			}

			if (onClickCommand) {
				// $(target).tooltip({
				// 	...popoverDefs(div, onClickCommand, id),
				// 	placement 	: 'top',
				// 	trigger 	: 'hover',
				// 	template 	: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
				// });

				if (parseInt(isInSameWindow) === 1) {
					target.onclick = function () {
						return (0, _actions.DEV_CMD_STACK_RUN)(onClickCommand);
					};
				} else {
					target.onclick = function () {
						return (0, _switchTerminal.switchTerminal)({ keymap: 'next' }).then(function () {
							return (0, _actions.DEV_CMD_STACK_RUN)(onClickCommand);
						});
					};
				}
			}
		};
	};

	Object.keys(tips).map(function (key) {
		var spans = div[0].querySelectorAll('.' + key);
		[].map.call(spans, findSpan(key));
	});
};

var popoverDefs = function popoverDefs(div, content, id) {
	content += window.TerminalState.hasPermissions() ? '(' + id + ')' : '';

	return {
		content: content,
		placement: 'top',
		trigger: 'click',
		template: '<div class="popover font-bold text-danger" role="tooltip"><div class="arrow"></div><div class="popover-content highlight-popover"></div></div>',

		title: content,
		html: true,
		viewport: div,
		container: div
	};
};

// closing popover when clicking outside it
$('body').on('click', function (e) {
	$('.popoverOnClick').each(function () {
		if (e.target.getAttribute('aria-describedby') !== this.id && !$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
			$(this).popover('hide');
		}
	});
});
// bootstrap fix where programmatically hiding popover trigger click state is not changed
$('body').on('hidden.bs.popover', function (e) {
	$(e.target).data('bs.popover').inState.click = false;
});

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

var _settings = __webpack_require__(/*! ../actions/settings */ "./src/actions/settings.es6");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var promises = {};
var commands = {};

function History() {
	var gds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'apollo';

	var pos = false;
	var length = 0;

	commands[gds] = commands[gds] || [];

	var askServer = function askServer() {
		return (0, _settings.GET_HISTORY)();
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
			if (commands[gds]) {
				if ([].concat(_toConsumableArray(commands[gds])).pop() !== cmd) // Do not add repeated previous cmd
					{
						commands[gds].push(cmd);
					}
			}
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

var _highlight = __webpack_require__(/*! ./highlight */ "./src/modules/highlight.es6");

var _helpers2 = __webpack_require__(/*! ../helpers/helpers */ "./src/helpers/helpers.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
			return (0, _helpers.splitIntoLinesArr)(this.outputStrings, this.numOfChars).filter(function (line) {
				return line !== null;
			}).length;
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
			var appliedRules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
			var output = arguments[1];

			if (appliedRules && appliedRules.length) {
				var _seedOutputString = (0, _highlight.seedOutputString)(output, appliedRules),
				    tips = _seedOutputString.tips,
				    outputText = _seedOutputString.outputText;

				this.outputStrings = outputText;

				this.terminal.echo(outputText, {
					finalize: function finalize(div) {
						return (0, _highlight.replaceInTerminal)(div, tips);
					}
					// raw 		: true
				});
			} else {
				this.terminal.echo(this.outputStrings);
			}

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
			var appliedRules = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

			this.outputStrings = appliedRules ? (0, _helpers2.replaceChar)(output, '%') : output;
			this.clearScreen = isClearScreen;
			this.cmdLineOffset = this.terminal.cmd()[0].offsetTop; // - this.charHeight; // remember scrollTop height before the command so when clear flag screen is set scroll to this mark

			this._countEmpty()._printOutput(appliedRules, output)._attachEmpty()._scroll();

			return this.outputStrings;
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

var _priceQuoutes = __webpack_require__(/*! ../actions/priceQuoutes */ "./src/actions/priceQuoutes.es6");

var _debug = __webpack_require__(/*! ../helpers/debug */ "./src/helpers/debug.es6");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var reject = function reject(err) {

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
		key: "loaderToggle",
		value: function loaderToggle(state) {
			var spinner = document.querySelector('#spinners');
			var loadingDots = document.querySelector('#loadingDots');

			if (spinner) spinner.classList.toggle('hidden', state);

			if (loadingDots) loadingDots.classList.toggle('loading-hidden', state);
		}
	}, {
		key: "show",
		value: function show(gds, rId) {
			var _this = this;

			if (!gds.get('canCreatePq')) {
				return Promise.reject('canCreatePq');
			}

			if (gds.get('canCreatePqErrors')) {
				return reject(gds.get('canCreatePqErrors'));
			}

			this.loaderToggle(false);

			return (0, _requests.get)("terminal/priceQuote?rId=" + rId).then(function (response) {
				_this.loaderToggle(true);

				var pqError = isPqError(response);
				return pqError.length ? reject(pqError) : response;
			}).then(function (response) {
				(0, _requests.get)("terminal/importPriceQuote?rId=" + rId);
				return _this.modal(response, _priceQuoutes.CLOSE_PQ_WINDOW);
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
var stack = [];
var promise = '';

var Session = function () {
	function Session(params) {
		_classCallCheck(this, Session);

		this.settings = params;
	}

	_createClass(Session, [{
		key: '_run',
		value: function _run(cmd) {
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
		key: '_runNext',
		value: function _runNext() {
			if (!promise) {
				var nextRun = stack.shift();

				if (nextRun) {
					promise = nextRun();
				}
			}
		}
	}, {
		key: '_makePromise',
		value: function _makePromise(resolve) {
			var _this = this;

			return function () {
				return _this._run(beforeStack.shift()()).then(resolve) //output result
				.then(function () {
					return promise = '';
				}).then(function () {
					return _this._runNext();
				});
			};
		}
	}, {
		key: 'perform',
		value: function perform(beforeFn) {
			var _this2 = this;

			beforeStack.push(beforeFn);

			return new Promise(function (resolve) {
				stack.push(_this2._makePromise(resolve));
				_this2._runNext();
			});
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

var switchTerminal = exports.switchTerminal = function switchTerminal(_ref) {
	var keymap = _ref.keymap;


	var fn = function fn(_ref2) {
		var matrix = _ref2.matrix,
		    curTerminalId = _ref2.curTerminalId;
		var list = matrix.list;


		if (typeof keymap === 'number') {
			var id = keymap === 48 ? 9 : keymap - 49;
			return id >= list.length ? false : list[id];
		}

		var index = list.indexOf(curTerminalId);
		var changeIndex = keymap === 'next' ? index + 1 : index - 1;

		if (changeIndex >= list.length) changeIndex = 0;

		if (changeIndex < 0) changeIndex = list.length - 1;

		return list[changeIndex];
	};

	return (0, _actions.SWITCH_TERMINAL)(fn);
};

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

var _settings = __webpack_require__(/*! ../actions/settings */ "./src/actions/settings.es6");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

__webpack_require__(/*! ../../node_modules/jquery.terminal/js/unix_formatting */ "./node_modules/jquery.terminal/js/unix_formatting.js");

var Terminal = function () {
	function Terminal(params) {
		_classCallCheck(this, Terminal);

		this.plugin = null;
		this.settings = params;
		this.context = (0, _dom2.default)('div.terminal terminal-cell ' + (params.name === 'wide' ? 'fixedColumnBackground' : ''));

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
					(0, _settings.CHANGE_ACTIVE_TERMINAL)({ curTerminalId: 0 });
					this.plugin.terminal.enable();
				}
		}
	}, {
		key: 'makeBuffer',
		value: function makeBuffer(buf) {
			if (!buf) return false;

			var buffered = buf['buffering'].map(function (record) {

				var c = $.terminal.format(record.output).replace(/%/g, '').replace(new RegExp('\r?\n', 'g'), '<br />');
				var output = record.output ? '<pre style="white-space: pre-wrap; overflow: hidden">' + c + ' </pre>' : '';

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
			    terminalSize = dimension.terminalSize,
			    leftOver = dimension.leftOver;


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

			var padding = Math.floor(leftOver.height / 2);
			this.context.style.paddingTop = padding + 'px';
			this.context.style.paddingBottom = padding + 'px';
			this.context.style.boxSizing = 'content-box';

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
	// hideMenu	: false,
	requestId: null,
	gdsList: [],
	gdsObjName: '',
	menuHidden: false,
	keyBindings: {},
	defaultPccs: {}

	// action	: ''
	// canCreatePq	: ''
	// gdsObjIndex	: ''
	// theme : '',
	// terminalThemes : '',
	// permissions : '',
	// log : '',
};

window.TerminalState = {
	isLanguageApollo: function isLanguageApollo() {
		return State.language.toLowerCase() === 'apollo';
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

	State = _extends({}, State, { action: action });

	if (State.permissions) console.log('STATE:', State);

	renderView(State);
};

var getters = exports.getters = function getters(action, props) {
	var GET = function GET(urlPart, param) {
		return (0, _requests.get)(urlPart + '/' + State.gdsObjName + '/' + param);
	};
	var POST = function POST(urlPart, param) {
		return (0, _requests.post)(urlPart + '/' + State.gdsObjName, param);
	};

	switch (action) {
		case 'terminal':
		case 'gds':
		case 'area':
		case 'language':
		case 'fontSize':
		case 'theme':
			GET('terminal/saveSetting/' + action, props);
			break;
		// POST method is used just to make sure that URL length is not exceeding limits
		case 'settings':
			(0, _requests.post)('terminal/saveSetting/' + action + '/0', props);
			break;
		case 'matrixConfiguration':
			POST('terminal/saveSetting/' + action, props);
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

		case 'lastRequests':
			return (0, _requests.get)('gdsDirect/lastViewedRequests');
			break;
	}
};

var renderView = void 0;
var setProvider = exports.setProvider = function setProvider(containerRender) {
	renderView = containerRender;
};

/***/ }),

/***/ "./src/store.es6":
/*!***********************!*\
  !*** ./src/store.es6 ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getStore = exports.connect = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _state = __webpack_require__(/*! ./state */ "./src/state.es6");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var store = void 0;

var connect = exports.connect = function connect(app) {
	(0, _state.setProvider)(function (State) {
		return app.getContainer().render(State);
	});
	store = new Store(app);
};

var Store = function () {
	function Store(app) {
		_classCallCheck(this, Store);

		this.setApp(app);
	}

	_createClass(Store, [{
		key: "getApp",
		value: function getApp() {
			return this.app;
		}
	}, {
		key: "setApp",
		value: function setApp(app) {
			this.app = app;
		}
	}, {
		key: "setState",
		value: function setState(state) {
			(0, _state.setState)(state);
		}
	}, {
		key: "updateView",
		value: function updateView(props) {
			store.app.calculateMatrix();

			this.setState(_extends({}, props, {
				curGds: store.app.Gds.getCurrent()
			}));
		}
	}]);

	return Store;
}();

var getStore = exports.getStore = function getStore() {
	return store;
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