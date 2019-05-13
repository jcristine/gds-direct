import {getDate} 		from './helpers.es6';
import {PURGE_SCREENS} 	from "../actions";
import {getStore} 		from "../store";
import {switchTerminal} from "../modules/switchTerminal";
import ActionReader from '../modules/actionReader.es6';

const nextCmd = (plugin, terminal) => { //Next performed format, by default returns to the first format and than each one by one.
	plugin.history.next().then( command => {
		terminal.cmd().set( command );
	});
};

const prevCmd = (plugin, terminal) => {
	plugin.history.previous().then( command => {
		terminal.cmd().set( command );
	});
};

/**
 * Default key bindings
 * Object keys are in format "keyNumber" or "ctrl|shift+keyNumber"
 */
const DEFAULT_KEY_BINDINGS = {
	113: { // F2 (F1 opens new tab)
		apollo	: { command: 'A10SEPJFKMNL<Transmit>01N1*GK<Transmit>$BB0', autorun: 1 },
		amadeus	: { command: 'A10SEPJFKMNL<Transmit>01N1*GK<Transmit>$BB0', autorun: 1 },
		sabre	: { command: 'A10SEPJFKMNL<Transmit>01N1*GK<Transmit>$BB0', autorun: 1 },
		galileo	: { command: 'A10SEPJFKMNL<Transmit>01N1*GK<Transmit>$BB0', autorun: 1 },
	},
	116: { // F5
		apollo	: { command: '0TURZZBK1YYZ{{datePlus320}}-RETENTION LINE', autorun: 1 },
		amadeus	: { command: 'RU1AHK1SFO{{datePlus320}}/RETENTION', autorun: 1 },
		sabre	: { command: '0OTHYYGK1/RETENTION{{datePlus320}}', autorun: 1 },
		galileo	: { command: '0TURZZBK1YYZ{{dateMinus45}}-RETENTION LINE', autorun: 1 },
	},
	119: () => '((f8Command))',
	122: {
		apollo 	: { command: 'T:TAU/{{dateNow}}', autorun: 1 },
		amadeus : { command: 'TKTL{{dateNow}}', autorun: 1 },
		sabre 	: { command: '7TAW/{{dateNow}}', autorun: 1 },
		galileo : { command: 'T.TAU/{{dateNow}}', autorun: 1 },
	},
	123: {
		apollo 	: { command: 'R:{{userName}}', autorun: 1 },
		amadeus	: { command: 'RF{{userName}}', autorun: 1 },
		sabre 	: { command: '6{{userName}}', autorun: 1 },
		galileo	: { command: 'R.{{userName}}', autorun: 1 },
	},
	'ctrl+112': {
		apollo 	: 'S*CTY/',
		amadeus : 'DAC',
		sabre 	: 'W/*',
		galileo	: '.CD',
	},
	'ctrl+113': {
		apollo 	: 'S*AIR/',
		amadeus : 'DNA',
		sabre 	: 'W/*',
		galileo	: '.AD',
	},
	'shift+116': {
		apollo 	: { command: 'SEM/2G52/AG', autorun: 1 },
		amadeus	: { command: 'AAA5E9H', autorun: 1 },
		sabre 	: { command: 'AAA5E9H', autorun: 1 },
		galileo	: { command: 'SEM/711M/AG', autorun: 1 },
	},
	'shift+117': gds => {
		const command = gds === 'apollo' ? 'SEM/2G55/AG' : 'AAA6IIF';
		return { command, autorun: 1 };
	},
	'shift+118': gds => {
		const command = gds === 'apollo' ? 'SEM/2G2H/AG' : 'AAADK8H';
		return { command, autorun: 1 };
	},
	'shift+119': gds => {
		const command = gds === 'apollo' ? 'SEM/2BQ6/AG' : 'AAAW8K7';
		return { command, autorun: 1 };
	},
	'shift+120': {
		apollo 	: { command: 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT', autorun: 1 },
		amadeus : { command: 'AP SFO 800-750-2238-A', autorun: 1 },
		sabre 	: { command: '91-800-750-2238-A', autorun: 1 },
		galileo : { command: 'P.SFOT:800-750-2238 ASAP CUSTOMER SUPPORT', autorun: 1 },
	},
};

/**
 * Converts Event button clicks to readable string
 * e.g. CTRL + F12 = 'ctrl+123'; F1 = '112' etc.
 * @param evt Event
 * @returns string
 */
function eventToButtonName(evt) {
	const keymap = evt.keyCode || evt.which;
	const btns = [];
	if (evt.ctrlKey || evt.metaKey) {
		btns.push('ctrl');
	} else if (evt.shiftKey) {
		btns.push('shift');
	}
	btns.push(keymap);

	return btns.join('+');
}

/**
 * Checks if user has overwritten some key bindings
 * @param keyName string
 * @returns string || false
 */
function getUserCustomCommand(keyName) {
	const { name, keyBindings } = getStore().app.Gds.getCurrent().get();

	if (keyBindings && keyBindings[keyName]) {
		const defaultCommand = getBindingForKey(keyName, name);
		let userReplacedCommand = ActionReader.replaceCommandVariables(keyBindings[keyName].command);

		// User can overwrite default command "autorun" so we still need to execute default command
		if (userReplacedCommand === '') {
			userReplacedCommand = defaultCommand.command;
		}

		let actionName = null;
		let match = userReplacedCommand.match(/^{{!(.+)}}$/);
		if (match) {
			actionName = match[1];
		}

		return {
			command: userReplacedCommand,
			autorun: parseInt(keyBindings[keyName].autorun),
			actionName: actionName,
		};
	}
	return false;
}

export const getBindingForKey = (keyName, gds, replaceVariables = true) => {
	const data = DEFAULT_KEY_BINDINGS[keyName] || null;

	let result = '';
	if (data && typeof data === 'function') {
		result = data(gds);
	} else if (data && data[gds]) {
		result = data[gds];
	}

	let command = result.command || result || '';
	if (replaceVariables) {
		command = ActionReader.replaceCommandVariables(command);
	}

	return Object.assign({}, {
		command,
		autorun: result.autorun || 0,
	});
};

/**
 * @param terminal = $().terminal()
 * @return boolean - true if should pass event further
 */
export const pressedShortcuts = (evt, terminal, plugin) => {
		const keymap 	= evt.keyCode || evt.which;

		const gds		= plugin.settings.gds;
		const isApollo	= gds === 'apollo';

		function doF8() {
			terminal.set_command(
				plugin.f8Reader.getFullCommand()
			);

			plugin.f8Reader.jumpToNextPos();
		}

		function doShortcutAction(actionName) {
			plugin.actionReader.initAction(actionName);
		}

		function insertOrExec(command) {
			if (command.actionName) {
				doShortcutAction(command.actionName);
			} else if (command.autorun) {
				terminal.exec(command.command);
			} else {
				terminal.insert(command.command);
			}
		}

		// Try to get user custom command
		const keyName = eventToButtonName(evt);
		const command = getUserCustomCommand(keyName);
		if (command !== false) {
			insertOrExec(command);
			return false;
		}


		if ( evt.ctrlKey || evt.metaKey )
		{
			switch (keymap)
			{
				case 8:  //CTRL + backSpace;
				case 83: //CTRL + S;
					PURGE_SCREENS(gds);
				break;

				case 87: //CTRL+W
					plugin.purge();
				break;

				case 68 	: // CTRL+D
				case 76 	: // CTRL+L
				case 82 	: // CTRL+R
				case 120	: // F9
					// Template for Apollo: ¤:5S(paxOrder) (sellPrice) N1 (netPrice) F1 (fareAmount)
					// Example for Apollo: ¤:5S1 985.00 N1 720.00 F1 500.00
					// Template for Sabre: 5S(paxOrder) (sellPrice) N1 (netPrice) F1 (fareAmount)
					// Example for Sabre: 5S1 985.00 N1 720.00 F1 500.00
					// evt.preventDefault();
				break;

				case 38 : // Up arrow
					prevCmd(plugin, terminal);
				break;

				case 40 : // down arrow
					nextCmd(plugin, terminal);
				break;

				case 112 :	// F1
				case 113 :	// F2
					const command = getBindingForKey(`ctrl+${keymap}`, gds);
					insertOrExec(command);
				break;

				// disabling these keys from terminal library to execute
				case 192 :	// Ctrl + ~
					switchTerminal({keymap : 'next'});
				break;

				case 48 :	// Ctrl + 0
				case 49 :	// Ctrl + 1
				case 50 :	// Ctrl + 2
				case 51 :	// Ctrl + 3
				case 52 :	// Ctrl + 4
				case 53 :	// Ctrl + 5
				case 54 :	// Ctrl + 6
				case 55 :	// Ctrl + 7
				case 56 :	// Ctrl + 8
				case 57 :	// Ctrl + 9
					switchTerminal({keymap});
				break;

				default:
					return true;
			}

			return false;
		}

		if ( evt.shiftKey )
		{
			switch (keymap)
			{
				case 9 : //TAB
					plugin.tabPerform(true);
				break;

				case 116 : // F5
				case 117 : // F6
				case 118 : // F7
				case 119 : // F8
				case 120 : // F9
					const command = getBindingForKey(`shift+${keymap}`, gds);
					insertOrExec(command);
				break;

				// case 187: //+
				// case 61 : //+ FireFox
				case 188: //,
					terminal.insert('+');
				break;

				case 192 :	// Shift + ~
					switchTerminal({keymap : 'prev'});
				break;

				default : return true;
			}

			return false;
		}

		if ( evt.altKey )
		{
			switch (keymap)
			{
				case 8: // + backSpace;
					plugin.purge();
				break;

				case 38 : // Up arrow
					prevCmd(plugin, terminal);
				break;

				case 40 : // down arrow
					nextCmd(plugin, terminal);
				break;

				default : return true;
			}

			return false;
		}

		switch (keymap)
		{
			case 9 : //TAB
				plugin.tabPerform();
			break;

			case 34 : //page down
			case 33 : //page up
				const cmm 	= plugin.lastCommand ? plugin.lastCommand.toLowerCase() : '';

				if (cmm !== '$bba' && isApollo && cmm.substr(0, 2) === '$b')
					return true;

				terminal.exec(keymap === 33 ? 'MU' : 'MD');
			break;

			case 38 : //UP
				prevCmd(plugin,terminal);
			break;

			case 40 : //DOWN
				nextCmd(plugin, terminal);
			break;

			case 119 : //F8
				doF8();
			break;

			case 116 : // F5
			case 122 : // F11
			case 123 : // F12
				const command = getBindingForKey(keymap, gds);
				insertOrExec(command);
			break;

			default: return true;
		}
};