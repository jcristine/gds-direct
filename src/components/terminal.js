'use strict';

import TerminalPlugin from '../middleware/terminal.js';

import {TERMINAL_HEIGHT, TERMINAL_SPLIT_HEIGHT} from '../constants.js';
import {bufferBtn, splitBtn} 					from '../components/buttons.js';

import sideMenu from './sideMenu.js'

let Root 		= document.getElementById('root');

let MainScreen, SplitScreen, context, terminalAppender;

const Terminal = {};

Terminal.create = function( className = '', withSplit = '' )
{
	let TerminalInst = document.createElement('div');
	TerminalInst.className = className;

	let Menu = document.createElement('div');
	Menu.className = 'text-right wrapper-sm menu';

	Menu.appendChild(
		bufferBtn().make()
	);

	if (withSplit == 1)
	{
		Menu.appendChild( splitBtn );

		splitBtn.addEventListener('click', (e) => {
			!SplitScreen ? this.split() : this.unSplit();
		});
	}

	TerminalInst.appendChild( Menu );
	let plugin = TerminalPlugin.init( TerminalInst );

	plugin.focus();

	// terminalAppender.appendChild( TerminalInst );
	document.getElementById('terminals').appendChild( TerminalInst );
	return TerminalInst;
};

Terminal.main = function()
{
	MainScreen = this.create('', 1);
	MainScreen.style.height 	= TERMINAL_HEIGHT;

	return MainScreen;
};

Terminal.split = function () {
	SplitScreen = SplitScreen || this.create( 'border-top' );
	MainScreen.style.height 	= TERMINAL_SPLIT_HEIGHT;
	SplitScreen.style.height 	= TERMINAL_SPLIT_HEIGHT;
	return SplitScreen;
};

Terminal.unSplit = function () {
	SplitScreen.parentElement.removeChild(SplitScreen);
	SplitScreen = '';
	MainScreen.style.height 	= TERMINAL_HEIGHT;
};

Terminal.render  = function () {
	context = document.createElement("section");
	context.className = 'terminal-wrap clearfix';

	// let header = document.createElement('header');
	// header.className = 'title-bar';
	// header.innerHTML = 'Terminal Sabre';
	//
	// let body = document.createElement('section');
	// body.className = 't-d-table';
	//
	// terminalAppender = document.createElement('div');
	// terminalAppender.className = 't-d-cell';
	//
	// let panel = document.createElement('div');
	// panel.className = 't-d-cell panel-right';
	//
	// context.appendChild( header );
	// context.appendChild( body );
	//
	// body.appendChild( terminalAppender );
	// body.appendChild( panel );

	context.innerHTML = `
			<header class="title-bar">Terminal Sabre</header>
			<div class="t-d-table">
				<div id="terminals" class="t-d-cell"></div>
				<div id="sideMenu" class="t-d-cell panel-right"></div>
			</div>
	`;

	Root.appendChild( context );
	document.getElementById('sideMenu').appendChild( sideMenu );

	// View
	return context;
};

export default Terminal;