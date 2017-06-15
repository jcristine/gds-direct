'use strict';

const $					= require('jquery');
window.$ 				= window.jQuery = $;

require('jquery.terminal/js/jquery.terminal');
require('keyboardevent-key-polyfill').polyfill();

import Noty 		from 'noty';
import Pagination 	from '../modules/pagination.es6';
import Session 		from '../modules/session.es6';
import Spinner 		from '../modules/spinner.es6';
import KeyBinding	from '../helpers/keyBinding.es6';
import OutputLiner	from '../modules/output.es6';
import TabManager	from '../modules/tabManager.es6';
import F8Reader		from '../modules/f8.es6';
import History 		from '../modules/history.es6';

import {getReplacement} from '../helpers/helpers.es6';

const Debug = (txt, type) => {
	new Noty({
		text	: `DEBUG : <strong>${txt}</strong>`,
		layout 	: 'bottomCenter',
		timeout : 1500,
		theme	: 'metroui',
		type 	: type || 'info'
	}).show();
};

export default class TerminalPlugin
{
	constructor( params )
	{
		this.settings 	= params;
		this.context	= params.context;
		this.name		= params.name;

		this.allowManualPaging = params.gds === 'sabre';

		this.session = new Session({
			terminalIndex	: params.name,
			sessionIndex	: params.sessionIndex,
			gds				: params.gds
		});

		this.terminal 		= this.init();

		this.pagination 	= new Pagination( this.terminal );
		this.spinner 		= new Spinner( this.terminal );

		this.outputLiner 	= new OutputLiner( this.terminal );
		this.outputLiner.setNumRows(params.numOfRows);

		this.tabCommands	= new TabManager();

		this.f8Reader		= new F8Reader({
			terminal	: this.terminal,
			gds			: params.gds
		});

		this.history 		= new History( params.gds );
	}

	/*
	* return false if char is don't belong cmd
	* */
	parseKeyBinds( evt, terminal )
	{
		if ( !KeyBinding.parse( evt, terminal, this ) )
			return false;

		if ( this.f8Reader.getIsActive() ) // ignore Tab press
		{
			if (evt.which === 13)
			{
				this.f8Reader.execCommand();
				return false;
			}

			this.f8Reader.replaceChar();
		}

		const replacement = getReplacement( evt, window.TerminalState.isLanguageApollo() );

		if ( replacement )
		{
			terminal.insert( replacement );
			return false;
		}

		if (replacement === false) // do not print nothing if char is forbiden
			return false;
	}

	// switchArea( command )
	// {
	// 	const sessionIndex = window.TerminalState.getSessionAreaMap().indexOf( command );
	//
	// 	if ( sessionIndex !== -1 )
	// 		window.TerminalState.action('CHANGE_SESSION_AREA', sessionIndex);
	// }

	changeActiveTerm( activeTerminal )
	{
		window.activePlugin = this; // SO SO DEPRECATED NOW
		window.TerminalState.action('CHANGE_ACTIVE_TERMINAL', activeTerminal );
	}

	purge()
	{
		this.settings.clear();
	}

	tabPressed()
	{
		if ( this.f8Reader.getIsActive() )
			return this.f8Reader.jumpToNextPos();

		this.tabCommands.next().run( this.updateOutput.bind(this) );
	}

	tabShiftPressed()
	{
		this.tabCommands.prev().run( this.updateOutput.bind(this) );
	}

	updateOutput([cmd, str])
	{
		this.terminal.update( -1,  str );
		this.terminal.cmd().set( cmd );
	}

	resize()
	{
		this.terminal.resize();
	}

	emptyLinesRecalculate( numOfRows, numOfChars, charHeight )
	{
		this.outputLiner
			.setNumRows(numOfRows)
			.setNumChars(numOfChars)
			.setCharHeight(charHeight)
			.recalculate();
	}

	init()
	{
		//caveats terminal.rows() - every time appends div with cursor span - not too smooth for performance

		return $(this.context).terminal( this.commandParser.bind(this), {
			echoCommand		: false,

			greetings		: '',
			name			: this.name,
			prompt			: '>',

			numRows			: this.settings.numOfRows, // plugin calculates it in so shitty slow manner appending cursor to body 3 times per plugin
			numChars		: this.settings.numOfChars,

			memory			: true, // dont add to localStorage

			// scrollOnEcho	: false,
			// keypress		: this.parseChar.bind(this), // BUGGY BUGGY, assign on document wtf???

			/*keypress		: (e) => { // this function is super shitty prefer not to use it
				if ( (e.ctrlKey) && [67].indexOf(e.which) !== -1 )
					return '';
			},*/

			keydown			: this.parseKeyBinds.bind(this),

			// clickTimeout	: 300,

			onInit			: this.changeActiveTerm.bind(this),
			onTerminalChange: this.changeActiveTerm.bind(this),

			onBeforeCommand : this.checkBeforeEnter.bind(this),

			// for hard scenario shortcut, others in keymap helper
			keymap			: {
				'CTRL+S'	: () => window.TerminalState.purgeScreens(),
				// 'CTRL+C'	: (e) => { console.log(' ??' , e)},
				'TAB'		: () => this.tabPressed(),
				// 'SHIFT+TAB'	: () => {; this.tabShiftPressed() }, moved to keyParse
				'F8'		: () => this.f8Reader.tie(),
				'F5'		: () => false
			},

			exceptionHandler( err )
			{
				console.warn('exc', err);
			}
		});
	}

	checkSabreCommand( command, terminal )
	{
		if ( this.allowManualPaging )
		{
			switch (command.toUpperCase())
			{
				case 'MD' :
					terminal.echo( this.pagination.next().print() );
					return true;

				case 'MU' :
					terminal.echo( this.pagination.prev().print() );
					return true;

				case 'MDA' :
					terminal.echo( this.pagination.printAll() );
					return true;

				case 'MDA5' :
					return true;

				case 'MDA20' :
					return true;
			}
		}

		return false;
	}

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

	commandParser( command, terminal ) //pressed enter
	{
		return false;
	}

	checkBeforeEnter( terminal, command )
	{
		if ( !command || command === '' )
		{
			this.terminal.echo('>');
			return false;
		}

		if ( this.checkSabreCommand( command, terminal ) )
			return command;

		this.spinner.start();

		this.history.add( command );

		const finish = response => {
			this.spinner.end();
			this.parseBackEnd( response, command );
		};

		const before = () => {
			this.outputLiner.prepare('');
			this.spinner.start();
			this.terminal.echo( `[[;yellow;]>${command.toUpperCase()}]` );
		};

		this.session.pushCommand( command.toUpperCase(), finish, before );

		this.session.perform();

		return command;
	}

	parseBackEnd( response = {}, command )
	{
		const result = response['data'] || {};

		if ( result['output'] )
		{
			if ( result['output'].trim() === '*')
			{
				this.terminal.update( -2 , command + ' *');
				return false;
			}

			if ( this.allowManualPaging ) // sabre
			{
				const output = this.pagination
					.bindOutput( result['output'], this.settings.numOfRows - 1, this.settings.numOfChars )
					.print();

				this.terminal.echo( output );
			} else
			{
				// if 1 rows of terminal do not perform clear screen
				const clearScreen = result['clearScreen'] && window.TerminalState.getMatrix().rows !== 0;
				this.outputLiner.prepare( result['output'], clearScreen );
			}
		}

		this.tabCommands.reset( result['tabCommands'], result['output'] );

		window.TerminalState.action( 'UPDATE_CUR_GDS', {
			canCreatePq 		: result['canCreatePq'],
			canCreatePqErrors 	: result['canCreatePqErrors'],
			sessionIndex		: ['A','B','C','D','E','F'].indexOf(result.area),

			lastPcc 			: result['pcc'] // TODO:: better deep-merge as pcc { sesionIndex : result[pcc] }
		});

		if ( window.apiData.hasPermissions() )
			this.debugOutput( result );
	}

	debugOutput( result )
	{
		if (result['clearScreen'])
			Debug( 'DEBUG: CLEAR SCREEN', 'info' );

		if ( result['canCreatePq'] )
			Debug( 'CAN CREATE PQ' , 'warning');

		if ( result['tabCommands'] && result['tabCommands'].length )
			Debug( 'FOUND TAB COMMANDS', 'success' );

		if ( result['pcc'] )
			Debug( 'CHANGE PCC', 'success' );
	}
	
	parseError(e)
	{
		// this.spinner.end();
		// console.error(' error', arguments );
		// this.terminal.error( String(e) );
	}
}