import TariffPccMixList from "../components/popovers/TariffPccMixList";

const $		= require('jquery');

// require('jquery.terminal/js/jquery.terminal');
require('../lib/jquery-terminal');

import Pagination 	from '../modules/pagination.es6';
import Session 		from '../modules/session.es6';
import Spinner 		from '../modules/spinner.es6';
import {pressedShortcuts} from "../helpers/keyBinding";
import OutputLiner	from '../modules/output.es6';
import TabManager	from '../modules/tabManager.es6';
import F8Reader		from '../modules/f8.es6';
import ActionReader	from '../modules/actionReader.es6';
import History 		from '../modules/history.es6';
import {getReplacement}		from '../helpers/helpers.es6';
import {CHANGE_ACTIVE_TERMINAL} from "../actions/settings";
import {CHANGE_GDS, UPDATE_CUR_GDS} from "../actions/gdsActions";
// import {debugOutput} from "../helpers/logger";
import {loggerOutput} from "../helpers/logger";
import {post} from "../helpers/requests";
import {McoForm} from "../components/popovers/maskForms/mcoForm";
import {ExchangeForm} from "../components/popovers/maskForms/exchangeForm";
import {ManualPricingForm} from "../components/popovers/maskForms/manualPricingForm.es6";
import {TaxBreakdownForm} from "../components/popovers/maskForms/taxBreakdownForm.es6";
import {ZpTaxBreakdownForm} from "../components/popovers/maskForms/zpTaxBreakdownForm.es6";
import {FareCalculationForm} from "../components/popovers/maskForms/fareCalculationForm.es6";
import PricePccMixList from "../components/popovers/PricePccMixList.es6";

const Component = require('../modules/component.es6').default;
const Cmp = (...args) => new Component(...args);

const chooseStrFromList = (plugin, options, caption = 'Choose One Of The Following Values') =>
	new Promise((resolve, reject) => {
		if (options.length === 0) {
			reject(new Error('Can not choose from 0 options'));
		} else if (options.length === 1) {
			resolve(options[0]);
		} else {
			let remove = () => {};
			let selectCmp = Cmp('select', {
				size: '5',
				onkeydown: (evt) => {
					if (evt.key === 'Enter') {
						resolve(evt.target.value);
						remove();
					}
				},
			}).attach(
				options.map(o => Cmp('option', {
					value: o, textContent: o,
					onclick: () => {
						resolve(o);
						remove();
					},
				}))
			);
			remove = plugin.injectDom({
				dom: Cmp('form.choose-str-from-list').attach([
					Cmp('h3', {textContent: caption}),
					selectCmp,
				]).context,
			}).remove;
			selectCmp.context.focus();
			selectCmp.context.querySelector('option').setAttribute('selected', 'selected');
		}
	});

const tryInterpretAsGdsChangeAlias = (command) => {
	const semMatch = command.match(/^SEM\/([0-9A-Z]{2,3})(?:\/AG|)\s*$/);
	if (semMatch) {
		const pcc = semMatch[1];
		const gdsToAliases = {
			apollo: ['AP', 'APO', '1V'],
			sabre: ['SA', 'SAB', '1S'],
			galileo: ['GA', 'GAL', '1G'],
			amadeus: ['AM', 'AMA', '1A'],
		};
		for (const [gds, aliases] of Object.entries(gdsToAliases)) {
			if (aliases.includes(pcc)) {
				CHANGE_GDS(gds);
				return true;
			}
		}
	}
	return false;
};

/** element of Terminal class */
export default class TerminalPlugin
{
	/**
	 * @param {{
	 *     context: HTMLDocument,
	 * }} params
	 */
	constructor( params )
	{
		this.settings 	= params;
		this.context	= params.context;
		this.name		= params.name;

		this.gdsName	= params.gds;

		this.allowManualPaging = params.gds === 'sabre';

		this.injectedForms = [];

		this.session = new Session({
			terminalIndex	: params.name,
			gds				: params.gds,
			onExpired		: (msg) => {
				msg = '[[;;;startSession]/SESSION EXPIRED]';
				this._printOutput(msg, false);
			},
		});

		this.terminal 		= this.init();

		this.pagination 	= new Pagination();
		this.spinner 		= new Spinner( this.terminal );
		this.outputLiner 	= new OutputLiner(this.terminal, params, this.injectedForms);
		this.tabCommands	= new TabManager();
		this.f8Reader		= new F8Reader({
			terminal	: this.terminal,
			gds			: params.gds,
		});
		this.actionReader = new ActionReader({
			plugin: this,
			terminal: this.terminal,
			gds: params.gds,
		});
		this.getSessionInfo = params.getSessionInfo;
		this.history 		= new History( params.gds );

		this.insertKey	= false;
	}

	/** @param {KeyboardEvent} evt */
	_shouldIgnoreKeyPress(evt)
	{
		// to not let terminal intercept chars entered in a form input
		return evt.target.tagName.toLowerCase() === 'input'
			|| evt.target.tagName.toLowerCase() === 'select'
			|| evt.target.tagName.toLowerCase() === 'option'
			|| evt.target.tagName.toLowerCase() === 'button';
	}

	/** @param {jQuery.Event} $evt */
	_parseKeyBinds( $evt, terminal )
	{
		/** @type {KeyboardEvent} */
		let evt = $evt.originalEvent || $evt;

		if (this.injectedForms.length)
		{
			this.outputLiner.emptyLines = 0;
			this.outputLiner.recalculate({}); // just to re-render / reset settings
		}

		if (this._shouldIgnoreKeyPress(evt)) {
			return true;
		}

		if (evt.ctrlKey && evt.key === 'Tab') {
			// firefox v45.0.2 on Ubuntu v 14.04 behaves crazy if you return false in Ctrl+Tab event handler when there are no tabs - it slowly
			// scrolls page down, then up, then triggers 2 more Ctrl+Tab events and jquery terminal gets focused in multiple cells at once
			// chrome/xubuntu won't even trigger an event on Ctrl+Tab, so let's ignore it in firefox as well to stay consistent
			return true;
		}
		const passFurther = evt.repeat ? true :
			pressedShortcuts( $evt, terminal, this );
		if (!passFurther) {
			evt.preventDefault();
			return false;
		} else if (evt.repeat) {
			evt.preventDefault();
		}

		const isEnter = $evt.which === 13;
		this.f8Reader.replaceEmptyChar(evt);
		this.actionReader.replaceEmptyChar(evt);

		if ($evt.which === 45)
		{
			this.insertKey = !this.insertKey;
		}

		const ctrlOrMetaKey = evt.ctrlKey || evt.metaKey;
		const replace = !this.f8Reader.getIsActive() && !this.actionReader.getIsActive()
			&& evt.key.length === 1 && !ctrlOrMetaKey && !this.insertKey;

		// if test>>>asd+sa and cursor on + // execute only between last > and + cmd
		if (isEnter)
		{
			this.f8Reader.isActive	= false;

			let cmd = terminal.before_cursor();
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

	clearBrief()
	{
		this.injectedForms.forEach(f => f.remove());
		this.injectedForms = [];
		this.terminal.clear();
		this.terminal.cmd().set('');
	}

	/**
	 * shortcut to the clear() in terminal.es6,
	 * which calls clearBrief() and removes history
	 */
	purge()
	{
		this.settings.clear();
	}

	tabPerform( reverse = false )
	{
		if ( this.f8Reader.getIsActive() )
			return this.f8Reader.jumpToNextPos();

		if ( this.actionReader.getIsActive() )
			return this.actionReader.jumpToNextPos();

		this.tabCommands.move(reverse).run(this.terminal);
	}

	resize({numOfRows, numOfChars, charHeight})
	{
		this.settings.numOfRows  = numOfRows;
		this.settings.numOfChars = numOfChars;

		this.terminal.settings().numChars = numOfChars;
		this.terminal.settings().numRows  = numOfRows;
		this.terminal.resize();

		if (this.injectedForms.length)
		{
			this.outputLiner.emptyLines = 0;
			this.terminal.settings().emptyLines = 0;

			this.outputLiner.recalculate({numOfRows: 0, numOfChars: 0});
		}
		else
		{
			this.outputLiner.recalculate({numOfRows, numOfChars, charHeight});
		}
	}

	/** @return {JQueryTerminal} */
	init()
	{
		//caveats terminal.rows() - every time appends div with cursor span - not too smooth for performance
		return $(this.context).terminal( () => {}, {
			wrap			: !window.GdsDirectPlusState.disableTextWrap(),
			echoCommand		: false,
			greetings		: '',
			name			: this.name,
			prompt			: '>',
			numRows			: this.settings.numOfRows || 0, // plugin calculates it in so shitty slow manner appending cursor to body 3 times per plugin
			numChars		: this.settings.numOfChars,
			memory			: true, // do not add to localStorage

			keypress		: (e, terminal) => {
				if (this._shouldIgnoreKeyPress(e)) {
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

	_printOutput(output, isClearScreen = false) {
		const injectedForms = [...this.injectedForms];
		for (const dom of injectedForms) {
			this._ejectForm({context: dom});
		}
		const appliedRules = this.appliedRules;
		return this.outputLiner.printOutput({
			output, isClearScreen,
			appliedRules, injectedForms,
		});
	}

	_tryInterpretAsSabreMdAlias(command) {
		if ( this.allowManualPaging )
		{
			switch (command)
			{
				case 'MD' :
					this._printOutput(this.pagination.next().print(), false);
					// this.print( this.pagination.next().print() );
					return true;

				case 'MU' :
					this._printOutput(this.pagination.prev().print(), false);
					// this.print( this.pagination.prev().print() );
					return true;

				case 'MDA' :
					this._printOutput(this.pagination.printAll(), false);
					// this.print( this.pagination.printAll() );
					return true;

				case 'MDA5' :
				case 'MDA20' :
					return true;
			}
		}

		return false;
	}

	_checkOfflineCommand(command, terminal)
	{
		command = command.toUpperCase();
		return tryInterpretAsGdsChangeAlias(command)
			|| this._tryInterpretAsSabreMdAlias(command);
	}

	_checkBeforeEnter( terminal, command )
	{
		if (this._checkOfflineCommand(command, terminal)) {
			return command;
		}

		this.spinner.start();

		const before = () => {
			/** spinner is also new line  **/
			this.outputLiner.printOutput({output: ''});
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
			.finally(() => this.spinner.end())
			.then( response => {
				if (command) {
					const actions = (response || {}).actions || [];
					let activePlugin = this;
					if (response.switchToGds && response.switchToGds !== this.gdsName) {
						const gdsUnit = CHANGE_GDS(response.switchToGds);
						activePlugin = gdsUnit.getActiveTerminal().plugin;
						activePlugin.terminal.focus();
					}
					if (response && (response.output || actions.length > 0)) {
						activePlugin.parseBackEnd(response, command);
					} else if (actions.length === 0) {
						this.print(`[[;;;errorMessage;]EMPTY SERVER RESPONSE]`);
					}
				}
				this.actionReader.handleNewLine();
			})
			.catch(exc => {
				this.print(`[[;;;errorMessage;]` + exc + `]`);
			});

		return command;
	}

	/**
	 * @template T
	 * @param {function(): T} action
	 * @return Promise<T>
	 */
	_withSpinner(action) {
		return this.session.enqueue(() => {
			this.spinner.start();
			return action();
		}).finally(() => {
			this.spinner.end();
		});
	}

	/**
	 * show cancelable dialog inside the terminal window
	 */
	injectDom({dom, onCancel = null, cls = null})
	{
		let formCmp;
		let remove = () => {
			this._ejectForm(formCmp);
			// love jquery terminal - needed to return focus
			setTimeout(() => this.terminal.enable(), 4);
		};
		const holderCmp = Cmp('div.injected-dom-holder').attach([
			Cmp({context: dom}),
		]);
		formCmp = Cmp('div.injected-in-terminal').attach([
			Cmp('br'),
			Cmp('div').attach([
				holderCmp,
				...(!onCancel ? [] : [Cmp('div.float-right').attach([
					Cmp('button[Cancel]', {type: 'button', onclick: () => {
						onCancel();
						remove();
					}}),
				])]),
			]),
			Cmp('br', {clear: 'all'}),
		]);
		if (cls) {
			formCmp.context.classList.toggle(cls, true);
		}
		this._injectForm(formCmp);
		let inp = formCmp.context.querySelector('input:not(:disabled)');
		if (inp) {
			inp.focus();
		}
		return {remove};
	}

	_displayMpRemarkDialog(data)
	{
		let remove = () => {};
		let addMpRemark = (airline) => this._withSpinner(() =>
			post('terminal/addMpRemark', {
				gds: this.gdsName, useSocket: true, airline,
			})).then(resp => this.parseBackEnd(resp, 'MP REMARK'));
		let onYes = () => {
			remove();
			let caption = 'Specify MP airline';
			chooseStrFromList(this, data.airlines, caption)
				.then(option => addMpRemark(option));
		};
		let yesBtnCmp;
		let noBtnCmp;
		yesBtnCmp = Cmp('button[Yes]', {
			onclick: onYes,
			onkeydown: (evt) => {
				if (evt.key === 'Escape') {
					remove();
				} else if (evt.key === 'Enter') {
					onYes();
				} else if (evt.key === 'ArrowRight') {
					noBtnCmp.context.focus();
				}
			},
		});
		noBtnCmp = Cmp('button[No]', {
			onclick: () => remove(),
			onkeydown: (evt) => {
				if (evt.key === 'ArrowLeft') {
					yesBtnCmp.context.focus();
				}
			},
		});

		remove = this.injectDom({
			dom: Cmp('div.mp-remark-dialog').attach([
				Cmp('h2[Was the PNR MPed?]'),
				Cmp('div.button-cont').attach([
					yesBtnCmp,
					noBtnCmp,
				]),
			]).context,
		}).remove;

		setTimeout(() => yesBtnCmp.context.focus(), 4);
	}

	_injectForm(formCmp)
	{
		this.context.appendChild(formCmp.context);
		this.injectedForms.push(formCmp.context);
		let inp = formCmp.context.querySelector('input:not([disabled]):not([type="hidden"])');
		if (inp) {
			inp.focus();
		}
		this.terminal.scroll_to_bottom();
		this.outputLiner.removeEmpty();
	}

	_ejectForm( formCmp ) {
		const el = formCmp.context;

		formCmp.context.remove();
		if (this.injectedForms.indexOf( el ) > -1)
		{
			this.injectedForms.splice(this.injectedForms.indexOf( el ), 1);
		}
	}

	/** @param {IMaskForm} formInst */
	_displayGenericForm(formInst)
	{
		let close = () => {
			this._ejectForm(finalForm);
		};
		let submitCmp = Cmp('button[Submit]');
		let finalForm = Cmp('form.mask-form monospace-inputs').attach([
			Cmp('br'),
			Cmp({context: formInst.dom}),
			Cmp('div.float-right').attach([
				submitCmp,
				Cmp('button[Cancel]', { type: 'button', onclick: close}),
			]),
			Cmp('br', {clear: 'all'}),
		]);
		let lock = action => {
			submitCmp.context.setAttribute('disabled', 'disabled');
			return this._withSpinner(action)
				.finally(() => submitCmp.context.removeAttribute('disabled', 'disabled'));
		};
		this._injectForm(finalForm);
		finalForm.context.onsubmit = (e) => {
			submitCmp.context.setAttribute('disabled', 'disabled');
			lock(() => formInst.submit())
				.then(resp => {
					this.parseBackEnd(resp, 'MASK FORM');
					let canClosePopup = resp && resp.output;
					if (canClosePopup) {
						close();
					}
				});
			return false;
		};
	}

	_displayMcoMask(data)
	{
		let formInst = McoForm({data});
		this._displayGenericForm(formInst);
	}

	_displayExchangeMask(data)
	{
		let formInst = ExchangeForm({data});
		this._displayGenericForm(formInst);

		let inp = formInst.dom.querySelector('input[name="ticketNumber1"]');
		if (inp) {
			inp.focus();
		}
	}

	_displayExchangeFareDifferenceMask(data)
	{
		// ">$MR       TOTAL ADD COLLECT   USD   783.30",
		// " /F;..............................................",
		let fopInputCmp = Cmp('input', {type: 'text', name: 'formOfPayment'});
		let formCmp = Cmp('div').attach([
			Cmp('div').attach([
				Cmp('span', {innerHTML: '>$MR       TOTAL ADD COLLECT   '}),
				Cmp('span', {innerHTML: data.currency}),
				Cmp('span', {innerHTML: data.amount}),
			]),
			Cmp('div').attach([
				Cmp('span', {innerHTML: ' /F'}),
				fopInputCmp,
			]),
		]);
		for (let field of data.fields) {
			[...formCmp.context.querySelectorAll('input[name="' + field.key + '"]')]
				.forEach(inp => inp.value = field.value);
		}

		this._displayGenericForm({
			dom: formCmp.context,
			submit: () => post('terminal/confirmExchangeFareDifference', {
				gds: this.gdsName,
				fields: [{
					key: 'formOfPayment', value: fopInputCmp.context.value,
				}],
				maskOutput: data.maskOutput,
			}),
		});
	}

	_displayHhprMask(data)
	{
		let formInst = ManualPricingForm({data});
		this._displayGenericForm(formInst);
	}

	_displayTaxBreakdownMask(data)
	{
		let formInst = TaxBreakdownForm({data});
		this._displayGenericForm(formInst);
	}

	_displayZpTaxBreakdownMask(data)
	{
		let formInst = ZpTaxBreakdownForm({data});
		this._displayGenericForm(formInst);
	}

	_displayFcMask(data)
	{
		let formInst = FareCalculationForm({data});
		this._displayGenericForm(formInst);
	}

	parseBackEnd(data, command)
	{
		this.lastCommand = command; // for history
		this.history.add(command);

		let {output, clearScreen, appliedRules, tabCommands} = data;
		this.appliedRules = appliedRules;

		if (data.startNewSession) {
			let msg = '[[;;;startSession]/NEW SESSION STARTED]';
			this._printOutput(msg, false);
		}

		if (output)
		{
			if ( this.allowManualPaging ) // sabre
			{
				const {numOfRows, numOfChars} 	= this.settings;
				output = this.pagination.bindOutput(output, numOfRows - 1, numOfChars).print();
			}

			output = this._printOutput(output, clearScreen);
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
			} else if (action.type === 'displayExchangeMask') {
				this._displayExchangeMask(action.data);
			} else if (action.type === 'displayExchangeFareDifferenceMask') {
				this._displayExchangeFareDifferenceMask(action.data);
			} else if (action.type === 'displayHhprMask') {
				this._displayHhprMask(action.data);
			} else if (action.type === 'displayTaxBreakdownMask') {
				this._displayTaxBreakdownMask(action.data);
			} else if (action.type === 'displayZpTaxBreakdownMask') {
				this._displayZpTaxBreakdownMask(action.data);
			} else if (action.type === 'displayFcMask') {
				this._displayFcMask(action.data);
			} else if (action.type === 'displayMpRemarkDialog') {
				this._displayMpRemarkDialog(action.data);
			} else if (action.type === 'initializePriceMix') {
				PricePccMixList.initialize(this, action.data);
			} else if (action.type === 'finalizeTariffMix') {
				TariffPccMixList.finalize(this, action.data);
			} else {
				let msg = '[[;;;error]Unsupported action - ' + action.type + ']';
				this._printOutput(msg, false);
			}
		}
	}

	print(output)
	{
		this.terminal.echo(output);
	}
}
