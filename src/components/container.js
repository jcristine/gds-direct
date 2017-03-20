'use strict';

import Terminal 	from './terminal.js';
import ActionsMenu 	from './actionsMenu.js';
import MenuPanel 	from './menuPanel.js';

let terminalList = [], Root, table, context, termTableWrap;

let Table = (function()
{
	let context;

	function constructor()
	{
		context = document.createElement('table');
	}
	
	function makeRow()
	{
		let row 			= document.createElement('tr');
		context.appendChild( row );

		return row;
	}
	
	function makeCell( row, rowCount )
	{
		let cell 	= document.createElement('td');
		let height	= termTableWrap.clientHeight / ( parseInt(rowCount) + 1 );

		//console.log( document.querySelector('#mainContent') )
		//console.log( document.querySelector('#mainContent') )
		//console.log( document.querySelector('.terminal-wrap').scrollHeight )

		//console.log( termTableWrap.querySelector('table') )
		//console.log( termTableWrap.querySelector('table').clientHeight )
		//console.log( termTableWrap.querySelector('table').offsetHeight )
		//console.log( termTableWrap.querySelector('table').scrollHeight )

		//console.log( '????????????????????????' );
		//console.log( termTableWrap.parentNode.clientHeight );

		//console.log( termTableWrap.clientHeight / ( parseInt(rowCount) + 1 ) );
		//console.log( height );
		//console.log( termTableWrap.clientHeight );
		//console.log( termTableWrap.offsetHeight );
		//console.log( termTableWrap.scrollHeight );

		row.appendChild( cell );
		cell.style.height = height + 'px';

		return cell;
	}

	function _draw( rowIndex, cellIndex )
	{
		context.classList = ( ' t-matrix-h-' + rowIndex + ' t-matrix-w-' + cellIndex );
		context.innerHTML = '';

		let row, cells = [];

		for (let i = 0; i<= rowIndex; i++ )
		{
			row = makeRow();

			for (let y = 0; y <= cellIndex; y++ )
			{
				cells.push( makeCell(row, rowIndex) );
			}
		}

		return cells;
	}
	
	function _getContext()
	{
		return context;
	}

	constructor();
	
	return {
		draw 		: _draw,
		getContext 	: _getContext
	}
}());

export default class Container {

	static createContext()
	{
		context 			= document.createElement('section');
		context.className	= 'terminal-wrap clearfix';
	}

	static createHeader()
	{
		let header 			= document.createElement('header');
		header.className 	= 'term-header';
		header.innerHTML 	= 'Terminal Sabre';

		context.appendChild( header );
		return header;
	}

	static createWrapper()
	{
		termTableWrap 				= document.createElement('div');
		termTableWrap.className 	= 'term-body minimized';

		context.appendChild( termTableWrap );

		let leftSide 				= document.createElement('aside');
		leftSide.className			= 't-d-cell left';

		ActionsMenu.init({
			addEvent : this.attachTerminals
		});

		leftSide.appendChild( ActionsMenu.getContext() );
		leftSide.appendChild( Table.getContext() );

		let rightSide 				= document.createElement('aside');
		rightSide.className 		= 't-d-cell menu';

		rightSide.appendChild( MenuPanel.render( termTableWrap ) );

		termTableWrap.appendChild( leftSide );
		termTableWrap.appendChild( rightSide );
	}

	static render( rootId )
	{
		Root = Root || document.getElementById( rootId );

		this.createContext();
		this.createHeader();
		this.createWrapper();

		Root.appendChild( context );
		Container.attachTerminals();
	}

	static clearPrev()
	{
		terminalList.map( function ( instance ) {
			instance.destroy();
		});

		terminalList = [];
	}

	static attachTerminals( rowIndex = 0, cellIndex = 0)
	{
		Container.clearPrev();

		let cells = Table.draw(rowIndex, cellIndex);
		cells.map( Container.createTerminal );
	}

	static createTerminal( cell, index )
	{
		let terminal = new Terminal({
			name 			: index,
			parentContext	: cell
		});

		terminal.create();
		terminalList.push( terminal );
	}
}