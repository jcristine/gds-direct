
import {getShortcutActionList} from "../helpers/dataProvider.js";
import {notify} from '../helpers/debug.es6';
import {getDate} from './../helpers/helpers.es6';

/**
 * describes the behaviour of terminal during multi-command shortcut
 * execution, possibly with additional data entered on tab
 */
export default class ActionReader
{
	/**
	 * @param {TerminalPlugin} plugin
	 * @param terminal = $().terminal();
	 */
	constructor({plugin, terminal, gds})
	{
		this.plugin = plugin;
		this.gds = gds;
		this.terminal = terminal;
		this.whenActionList = getShortcutActionList();
		// following field are mutable
		this.isActive = false;
		this.commandsLeft = [];
		this.tabStopsLeft = [];
		this.extension = 0;
	}

	/**
	 * Replaces command pre-defined "variables" real values
	 * @param command
	 * @returns string
	 */
	static replaceCommandVariables(command) {
		let auth = window.GdsDirectPlusParams.auth;
		return command
			.replace('{{userName}}', auth ? auth.displayName.toUpperCase() : '')
			.replace('{{dateNow}}', getDate().now)
			.replace('{{datePlus320}}', getDate().plus320)
			.replace('{{dateMinus45}}', getDate().minus45)
			.replace(/<Transmit>/g, '\n');
	}

	_executeAction(record) {
		/** @debug */
		console.debug('Processing Shortcut Action', record);
		this.commandsLeft = [...record.commands];
		this.handleNewLine();
	}

	initAction(actionName) {
		this.whenActionList.then(({records}) => {
			let pcc = this.plugin.getSessionInfo().pcc;
			let byGds = records.filter(rec =>
				rec.name === actionName &&
				rec.gds === this.gds);
			let byPcc = byGds.filter(rec => rec.pccs.includes(pcc));
			let forAnyPcc = byGds.filter(rec => rec.pccs.length === 0);
			if (byPcc.length > 0) {
				// prioritize the action with PCC specified if
				// any, supposedly there should be just one
				this._executeAction(byPcc[0]);
			} else if (forAnyPcc.length > 0) {
				this._executeAction(forAnyPcc[0]);
			} else {
				let error = 'No shortcut action found for ' + this.gds + ' ' + pcc + ' ' + actionName;
				notify({msg: error, align: 'bottomRight'});
			}
		});
	}

	/**
	 * @param cmd = '¤:3SSRDOCSYYHK1/N{{tab_2}}/////{{tab_7}}/{{tab_1}}//{{tab_20}}/{{tab_20}}/'
	 * @return {{
	 *     cmd: '¤:3SSRDOCSYYHK1/N  /////       / //                    /                    /',
	 *     tabStops: [[17, 2], [24, 7], [32, 1], [35, 20], [56, 20]],
	 * }}
	 */
	_parseTabStops(cmd) {
		let tabStops = [];
		let match;
		while (match = cmd.match(/({{tab_(\d+)}})/)) {
			let [_, token, spaces] = match;
			let pos = match.index;
			tabStops.push([pos, spaces]);
			cmd = cmd.slice(0, pos)
				+ ' '.repeat(spaces)
				+ cmd.slice(pos + token.length);
		}
		return {cmd, tabStops};
	}

	_pressKey(keyName) {
		// press enter
		let event = new Event('keydown');
		event.key = keyName;
		document.documentElement.dispatchEvent(event);
	}

	_putCaretAtTabStop() {
		if (this.tabStopsLeft.length > 0) {
			let [pos, len] = this.tabStopsLeft[0];
			pos += this.extension;
			this.terminal.cmd().position(pos);
			return true;
		} else {
			return false;
		}
	}

	_prepareCmd(cmd) {
		let [_, tabs, restCmd] = cmd.match(/^((?:<Tab>)*)([\s\S]*)$/);
		let prefix = '';
		if (tabs) {
			for (let tab of tabs.match(/<Tab>/g) || []) {
				this.plugin.tabCommands.move(false).run(this.terminal);
			}
			prefix = this.terminal.get_command();
		}
		restCmd = this.constructor.replaceCommandVariables(restCmd);
		let parsed = this._parseTabStops(restCmd);
		this.terminal.set_command(prefix + parsed.cmd);
		this.tabStopsLeft = parsed.tabStops;
	}

	handleNewLine() {
		if (this.commandsLeft.length === 0) {
			this.isActive = false;
		} else {
			this.isActive = true;
			let cmd = this.commandsLeft.shift();
			this._prepareCmd(cmd);
			this.extension = 0;
			if (!this._putCaretAtTabStop()) {
				this._pressKey('ENTER');
			}
		}
	}

	getIsActive()
	{
		return this.isActive;
	}

	jumpToNextPos()
	{
		this.tabStopsLeft.shift();
		this._putCaretAtTabStop();
	}

	replaceEmptyChar(evt)
	{
		if ( this.getIsActive() )
		{
			if (evt.key.length === 1 && !evt.ctrlKey) // issue 01
			{
				const curPos 			= this.terminal.cmd().position();
				if (this.tabStopsLeft.length > 0) {
					let [pos, len] = this.tabStopsLeft[0];
					pos += this.extension;
					if (curPos === +pos + +len) {
						// add more spaces before the "/" when agent continues typing
						++this.extension;
						return false;
					}
				}

				this.terminal.cmd().delete(+1);
			}
		}
	}
}