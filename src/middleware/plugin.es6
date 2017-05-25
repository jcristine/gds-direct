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

		this.hiddenBuff		= [];

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
	}

	/*
	* return false if char is don't belong cmd
	* */

	parseKeyBinds( evt, terminal )
	{
		if ( !KeyBinding.parse( evt, terminal ) )
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

	switchArea( command )
	{
		const sessionIndex = window.TerminalState.getSessionAreaMap().indexOf( command );

		if ( sessionIndex !== -1 )
			window.TerminalState.action('CHANGE_SESSION_AREA', sessionIndex);
	}

	changeActiveTerm( activeTerminal )
	{
		window.activePlugin = this; // SO SO
		window.TerminalState.action('CHANGE_ACTIVE_TERMINAL', activeTerminal );
	}

	tabPressed()
	{
		if ( this.f8Reader.getIsActive() )
			return this.f8Reader.jumpToNextPos();

		this.tabCommands.run( this.updateOutput.bind(this) );
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
		// console.log( 'init', this.settings.numOfRows );
		// console.log( 'init', this.settings.numOfChars );
		//caveats terminal.rows() - everytime appends div with cursor span - not too smooth for performance

		return $(this.context).terminal( this.commandParser.bind(this), {

			greetings		: '',
			name			: this.name,
			prompt			: '>',

			numRows			: this.settings.numOfRows, // plugin calculates it in so shitty slow manner appending cursor to body 3 times per plugin
			numChars		: this.settings.numOfChars,

			history			: ['z', 'c'],
			memory			: true, // dont add to localStorage

			// scrollOnEcho	: false,
			// keypress		: this.parseChar.bind(this), // BUGGY BUGGY, assign on document wtf???

			keydown			: this.parseKeyBinds.bind(this),

			onInit			: this.changeActiveTerm.bind(this),
			onTerminalChange: this.changeActiveTerm.bind(this),

			onBeforeCommand : this.checkBeforeEnter.bind(this),

			// for hard scenario shortcut, others in keymap helper
			keymap			: {
				'CTRL+S'	: () => window.TerminalState.purgeScreens(),
				'TAB'		: () => this.tabPressed(),
				'F8'		: () => this.f8Reader.tie(),
				'F5'		: () => false,
			},

			exceptionHandler( err )
			{
				console.warn('exc', err);
			}
		});
	}

	checkBeforeEnter( terminal, command )
	{
		if ( this.spinner.isActive() )
		{
			this.hiddenBuff.push( command );
			return false;
		}
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
		this.spinner.start();

		this.session
			.run({
				cmd : command.toUpperCase()
			})

			.then( response => {
				this.spinner.end();
				return response;
			})

			.then( response  => {
				this.switchArea( command.toUpperCase() );
				this.parseBackEnd( response, command )
			})

			.then( () => this.loopCmdStack() )
	}

	parseBackEnd( response = {}, command )
	{
		const result = response['data'] || {};

		if ( result['output'] )
		{
			if ( result['output'].trim() === '*')
			{
				this.terminal.update( -2 , command + ' *');
				// this.terminal.set_command(command + ' *');
				return false;
			}

			if ( this.allowManualPaging ) // sabre
			{
				const output = this.pagination
					.bindOutput( result['output'], this.terminal.rows() - 1, this.terminal.cols() )
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

		const updateParams = {
			canCreatePq 		: result['canCreatePq'],
			canCreatePqErrors 	: result['canCreatePqErrors']
		};

		// todo :: optimize
		if ( result['pcc'] )
		{
			window.TerminalState.action( 'CHANGE_PCC', result['pcc'] );
		}

		// window.TerminalState.action( 'CHANGE_PCC', 'zzz' );
		window.TerminalState.action( 'CAN_CREATE_PQ', updateParams);

		if ( !window.apiData.hasPermissions() )
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