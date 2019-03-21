const $		= require('jquery');

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
import {CHANGE_ACTIVE_TERMINAL} from "../actions/settings";
import {UPDATE_CUR_GDS} from "../actions/gdsActions";
// import {debugOutput} from "../helpers/logger";
import {loggerOutput} from "../helpers/logger";
import {post} from "../helpers/requests";
import {McoForm} from "../components/popovers/mcoForm";

export default class TerminalPlugin
{
	constructor( params )
	{
		this.settings 	= params;
		this.context	= params.context;
		this.name		= params.name;

		this.gdsName	= params.gds;

		this.allowManualPaging = params.gds === 'sabre';

		this.session = new Session({
			terminalIndex	: params.name,
			gds				: params.gds,
			onExpired		: (msg) => {
				msg = '[[;;;startSession]/SESSION EXPIRED]';
				this.outputLiner.printOutput(msg, false, []);
			},
		});

		this.terminal 		= this.init();

		this.pagination 	= new Pagination();
		this.spinner 		= new Spinner( this.terminal );
		this.outputLiner 	= new OutputLiner(this.terminal, params);
		this.tabCommands	= new TabManager();
		this.f8Reader		= new F8Reader({
			terminal	: this.terminal,
			gds			: params.gds,
		});

		this.history 		= new History( params.gds );
	}

	_parseKeyBinds( evt, terminal )
	{
		if (evt.target.tagName.toLowerCase() === 'input') {
		        return true;
		}

		const hasNoShortCut = pressedShortcuts( evt, terminal, this );

		if ( !hasNoShortCut )
			return false;

		const isEnter = evt.which === 13;
		this.f8Reader.replaceEmptyChar(evt);

		const ctrlOrMetaKey = evt.ctrlKey || evt.metaKey;
		const replace = !this.f8Reader.getIsActive() && evt.key.length === 1 && !ctrlOrMetaKey;

		// if test>>>asd+sa and cursor on + // execute only between last > and + cmd
		if (isEnter)
		{
			this.f8Reader.isActive	= false;

			let		cmd					= terminal.before_cursor();
			const	lastPromptSignPos	= cmd.lastIndexOf('>') + 1;

			if (lastPromptSignPos)
				cmd = cmd.substring(lastPromptSignPos, cmd.length);

			terminal.set_command(cmd);
		} else if (replace) {
			// Replace text insted of moving forward (like INSERT button works on some text editors). Example:
			// >H|E|LLO - press letter "A", result: >HA|L|LO instead of >HA|E|LLO ("||" - cursor position)
			this.terminal.cmd().delete(+1);
		}
	}

	_changeActiveTerm()
	{
		window.activeTerminal = this;
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
				if (e.target.tagName.toLowerCase() === 'input') {
				        return true;
				}
				const replacement = getReplacement( e, window.GdsDirectPlusState.isLanguageApollo(), this.gdsName );

				if (replacement)
				{
					terminal.insert(replacement);
					return false;
				}
			},

			keydown			: this._parseKeyBinds.bind(this),
			// clickTimeout	: 300,
			onTerminalChange: this._changeActiveTerm.bind(this),
			onBeforeCommand : this._checkBeforeEnter.bind(this),
			exceptionHandler( err ) { console.warn('exc', err); },
		});
	}

	_checkSabreCommand( command, terminal )
	{
		if ( this.allowManualPaging )
		{
			switch (command.toUpperCase())
			{
				case 'MD' :
					this.outputLiner.printOutput(this.pagination.next().print(), false, this.appliedRules);
					// this.print( this.pagination.next().print() );
				return true;

				case 'MU' :
					this.outputLiner.printOutput(this.pagination.prev().print(), false, this.appliedRules);
					// this.print( this.pagination.prev().print() );
				return true;

				case 'MDA' :
					this.outputLiner.printOutput(this.pagination.printAll(), false, this.appliedRules);
					// this.print( this.pagination.printAll() );
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
		if ( this._checkSabreCommand( command, terminal ) )
		{
			return command;
		}

		this.spinner.start();

		const before = () => {
			/** spinner is also new line  **/
			this.outputLiner.printOutput('');
			this.spinner.start();

			// split needed for multiline commands, since jquery
			// terminal does not allow line breaks inside [[;;;...]>]
			command.split('\n').forEach(cmdLine => {
				this.print(`[[;;;usedCommand;]>${cmdLine.toUpperCase()}]`);
			});
			return command.toUpperCase();
		};

		this.session
			.perform( before )
			.then( response => {
				this.spinner.end();

				if (command)
				{
					if (response && response.output)
						this.parseBackEnd( response, command );
					else
						this.print(`[[;;;text-danger;]SERVER ERROR]`);
				}
			});

		return command;
	}

	_displayMcoMask(data)
	{
		let mcoForm = McoForm({data, onsubmit: (data) => {
			let params = {
				gds: this.gdsName,
				fields: data.fields,
				useRbs: GdsDirectPlusState.getUseRbs(),
			};
			this.spinner.start();
			return post('terminal/makeMco', params)
				.then(resp => {
					this.spinner.end();
					this.parseBackEnd(resp, 'HHMCU');
					return {canClosePopup: resp && resp.output};
				}).catch(exc => {
					this.spinner.end();
					return {canClosePopup: false};
				});
		}});
		this.context.appendChild(mcoForm.context);
		let inp = mcoForm.context.querySelector('input:not([disabled]):not([type="hidden"])');
		if (inp) {
			inp.focus();
		}
		this.terminal.scroll_to_bottom();
	}

	parseBackEnd(data, command)
	{
		this.lastCommand = command; // for history
		this.history.add(command);

		let {output, clearScreen, appliedRules, tabCommands} = data;
		this.appliedRules = appliedRules;

		if (output)
		{
			if ( output.trim() === '*')
			{
				this.terminal.update( -2 , command + ' *');
				return false;
			}

			if ( this.allowManualPaging ) // sabre
			{
				const {numOfRows, numOfChars} 	= this.settings;
				output = this.pagination.bindOutput(output, numOfRows - 1, numOfChars).print();
			}

			output = this.outputLiner.printOutput(output, clearScreen, appliedRules);
		}

		this.tabCommands.reset( tabCommands, output );

		if ( window.GdsDirectPlusState.hasPermissions() )
		{
			data = {...data, log : loggerOutput(data, command)};
		}

		UPDATE_CUR_GDS({...data, gdsName : this.gdsName});

		for (let action of data.actions || []) {
			if (action.type === 'displayMcoMask') {
				this._displayMcoMask(action.data);
				this.outputLiner.removeEmpty();
			}
		}
	}

	print(output)
	{
		this.terminal.echo(output);
	}
}