'use strict';

import TerminalPlugin from '../middleware/terminal.js';

import {
	TERMINAL_HEIGHT,
	TERMINAL_SPLIT_HEIGHT
} from '../constants.js';

import {bufferBtn, splitBtn} from '../components/buttons.js';
import sideMenu from './sideMenu.js';

let isSplit;

function splitHandler()
{
	isSplit = !isSplit;

	if ( Main.terminals.length == 1 )
	{
		Main.add({
			className	: 'border-top',
			split 		: 'no',
			height 		: TERMINAL_SPLIT_HEIGHT+'px'
		});
	}

	if (isSplit)
	{
		Main.terminals[1].show();
		Main.minimizeAll();
	} else
	{
		Main.maximizeAll();
		Main.terminals[1].hide();
	}
}

class Terminal {

	constructor( params )
	{
		this.params 	= params;
		this.context 	= document.createElement('div');
		this.context.className = params.className;
		this.context.style.height = params.height + 'px';

		this.menu 	= document.createElement('div');
		this.menu.className = 'text-right wrapper-sm menu';
	}

	render()
	{
		document.getElementById('terminalContainer').appendChild( this.context );
		this.context.appendChild( this.menu );
	}

	create()
	{
		this.render();

		this.menu.appendChild(
			bufferBtn().make( () => {
				plugin.focus();
			})
		);

		if (this.params.split == 1)
		{
			this.menu.appendChild( splitBtn );
			splitBtn.addEventListener('click', splitHandler);
		}

		let plugin = TerminalPlugin.init( this.context );
		// plugin.focus();
	}

	hide()
	{
		this.context.style.display = 'none';
	}

	show()
	{
		this.context.style.display = '';
	}

	minimize()
	{
		this.context.style.height = TERMINAL_SPLIT_HEIGHT+'px';
	}

	maximize()
	{
		this.context.style.height = TERMINAL_HEIGHT+'px';
	}
}

class TerminalWrap {

	constructor()
	{
		this.terminals = [];
	}

	render( rootId )
	{
		let Root 	= document.getElementById( rootId );

		Root.insertAdjacentHTML('beforeend',
			`<section class="terminal-wrap clearfix">
				<header class="title-bar">Terminal Sabre</header>
				<div class="t-d-table">
					<div id="terminalContainer" class="t-d-cell"></div>
					<div id="sideMenu" class="t-d-cell panel-right"></div>
				</div>
			</section>`
		);

		document.getElementById('sideMenu').appendChild( sideMenu.render() );
	}

	add ( params = {} )
	{
		let terminal = new Terminal({
			className 	: params.className 	|| '',
			split		: params.split 		|| 1,
			height		: params.height 	|| TERMINAL_HEIGHT
		});

		terminal.create();
		this.terminals.push( terminal );
	}

	minimizeAll()
	{
		this.terminals.map(function (obj) {
			obj.minimize()
		})
	}

	maximizeAll()
	{
		this.terminals.map(function (obj) {
			obj.maximize()
		})
	}

	remove ()
	{

	}
}

let Main = new TerminalWrap();

export default Main;