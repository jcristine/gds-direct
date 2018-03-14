const $		= require('jquery');
window.$ 	= window.jQuery = $;

// require('jquery.terminal/js/jquery.terminal');
require('../lib/jquery-terminal');
require('keyboardevent-key-polyfill').polyfill();

import Pagination 	from '../modules/pagination.es6';
import Session 		from '../modules/session.es6';
import Spinner 		from '../modules/spinner.es6';
import {pressedShortcuts} from "../helpers/keyBinding";
import OutputLiner	from '../modules/output.es6';
import TabManager	from '../modules/tabManager.es6';
import F8Reader		from '../modules/f8.es6';
import History 		from '../modules/history.es6';
import {getReplacement}		from '../helpers/helpers.es6';
import {UPDATE_CUR_GDS, CHANGE_ACTIVE_TERMINAL} from "../actions";
import {debugOutput, loggerOutput} from "../helpers/logger";

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

	_parseKeyBinds( evt, terminal )
	{
		const hasNoShortCut = pressedShortcuts( evt, terminal, this );

		if ( !hasNoShortCut )
			return false;

		const isEnter = evt.which === 13;
		this.f8Reader.replaceEmptyChar(evt);

		// if test>>>asd+sa and cursor on + // execute only between last > and + cmd
		if (isEnter)
		{
			this.f8Reader.isActive	= false;

			let		cmd					= terminal.before_cursor();
			const	lastPromptSignPos	= cmd.lastIndexOf('>') + 1;

			if (lastPromptSignPos)
				cmd = cmd.substring(lastPromptSignPos, cmd.length);

			terminal.set_command(cmd);
		}
	}

	_changeActiveTerm()
	{
		// if (this.settings.name === 'fullScreen')
		// 	return false;

		CHANGE_ACTIVE_TERMINAL({curTerminalId : this.name});
	}

	purge()
	{
		this.settings.clear();
	}

	tabPerform( reverse = false )
	{
		if ( this.f8Reader.getIsActive() )
			return this.f8Reader.jumpToNextPos();

		this.tabCommands.move(reverse).run(this.terminal);
	}

	resize({numOfRows, numOfChars, charHeight})
	{
		this.settings.numOfRows  = numOfRows;
		this.settings.numOfChars = numOfChars;

		this.terminal.settings().numChars = numOfChars;
		this.terminal.settings().numRows  = numOfRows;
		this.terminal.resize();

		this.outputLiner.recalculate({numOfRows, numOfChars, charHeight});
	}

	init()
	{
		//caveats terminal.rows() - every time appends div with cursor span - not too smooth for performance
		return $(this.context).terminal( () => {}, {
			echoCommand		: false,
			greetings		: '',
			name			: this.name,
			prompt			: '>',
			numRows			: this.settings.numOfRows || 0, // plugin calculates it in so shitty slow manner appending cursor to body 3 times per plugin
			numChars		: this.settings.numOfChars,
			memory			: true, // do not add to localStorage

			keypress		: (e, terminal) => {
				const replacement = getReplacement( e, window.TerminalState.isLanguageApollo() );

				if (replacement)
				{
					terminal.insert(replacement);
					return false;
				}
			},

			keydown			: this._parseKeyBinds.bind(this),
			clickTimeout	: 300,
			onTerminalChange: this._changeActiveTerm.bind(this),
			onBeforeCommand : this._checkBeforeEnter.bind(this),


			// onInit			: this._changeActiveTerm.bind(this),
			/*keymap		: {},*/

			exceptionHandler( err ) { console.warn('exc', err); }
		});
	}

	_checkSabreCommand( command, terminal )
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
				case 'MDA20' :
					return true;
			}
		}

		return false;
	}

	_checkBeforeEnter( terminal, command )
	{
		if ( !command || command.trim() === '' )
		{
			this.terminal.echo('>');
			return false;
		}

		if ( this._checkSabreCommand( command, terminal ) )
			return command;

		this.spinner.start(); // issue 03

		const before = () => {
			this.outputLiner.prepare('');
			this.spinner.start();
			this.terminal.echo( `[[;;;usedCommand;]>${command.toUpperCase()}]` );
			return command.toUpperCase();
		};

		this.session
			.pushCommand( before )
			.perform()
			.then( response => {
				this.spinner.end();
				this.parseBackEnd( response, command );
			});

		return command;
	}

	parseBackEnd( response = {}, command )
	{
		this.lastCommand = command; // for history
		this.history.add(command);

		let result = response['data'] || {};

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
				const clearScreen = result['clearScreen'];// && window.TerminalState.getMatrix().rows !== 0;
				this.outputLiner.prepare( result['output'], clearScreen );
			}
		}

		this.tabCommands.reset( result['tabCommands'], result['output'] );

		if ( window.TerminalState.hasPermissions() )
		{
			// debugOutput( result );
			result = {...result, log : loggerOutput(result, command)}
		}

		console.log('????' , this.settings.gds);

		UPDATE_CUR_GDS(result);
	}
}