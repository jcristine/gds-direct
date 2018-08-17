import {getDate} 		from './helpers.es6';
import {PURGE_SCREENS} 	from "../actions";
import {getStore} 		from "../store";
import {switchTerminal} from "../modules/switchTerminal";

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

// Bindings are neededed outside this scope
const DEFAULT_KEY_BINDINGS = {
	116: {
		apollo 	: '0TURZZBK1YYZ{{datePlus320}}-RETENTION LINE',
		amadeus : 'RU1AHK1SFO{{datePlus320}}/RETENTION',
		sabre 	: '0OTHYYGK1/RETENTION{{datePlus320}}',
		galileo : '0TURZZBK1YYZ{{dateMinus45}}-RETENTION LINE'
	},
	119: () => '((f8Command))',
	122: {
		apollo 	: 'T:TAU/{{dateNow}}',
		amadeus : 'TKTL{{dateNow}}',
		sabre 	: '7TAW/{{dateNow}}',
		galileo : 'T.TAU/{{dateNow}}'
	},
	123: {
		apollo 	: 'R:{{userName}}',
		amadeus : 'RF{{userName}}',
		sabre 	: '6{{userName}}',
		galileo : 'R.{{userName}}'
	},
	'ctrl+112': {
		apollo 	: 'S*CTY/',
		amadeus : 'DAC',
		sabre 	: 'W/*',
		galileo	: '.CD'
	},
	'ctrl+113': {
		apollo 	: 'S*AIR/',
		amadeus : 'DNA',
		sabre 	: 'W/*',
		galileo	: '.AD'
	},
	'shift+116': {
		apollo 	: 'SEM/2G52/AG',
		amadeus : 'AAA5E9H',
		sabre 	: 'AAA5E9H',
		galileo : 'SEM/711M/AG'
	},
	'shift+117': gds => gds === 'apollo' ? 'SEM/2G55/AG' : 'AAA6IIF',
	'shift+118': gds => gds === 'apollo' ? 'SEM/2G2H/AG' : 'AAADK8H',
	'shift+119': gds => gds === 'apollo' ? 'SEM/2BQ6/AG' : 'AAAW8K7',
	'shift+120': {
		apollo 	: 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
		amadeus : 'AP SFO 800-750-2238-A',
		sabre 	: '91-800-750-2238-A',
		galileo : 'P.SFOT:800-750-2238 ASAP CUSTOMER SUPPORT'
	}
}

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
 * Replaces command pre-defined "variables" real values
 * @param command
 * @returns string
 */
function replaceCommandVariables(command) {
	return command
		.replace('{{userName}}', window.apiData.auth.displayName.toUpperCase())
		.replace('{{dateNow}}', getDate().now)
		.replace('{{datePlus320}}', getDate().plus320)
		.replace('{{dateMinus45}}', getDate().minus45);
}

/**
 * Checks if user has overwritten some key bindings
 * @param keyName string
 * @returns string || false
 */
function getUserCustomCommand(keyName) {
	const { keyBindings } = getStore().app.Gds.getCurrent().get();

	return keyBindings && keyBindings[keyName]
		? replaceCommandVariables(keyBindings[keyName])
		: false;
}

export const getBindingForKey = (keyName, gds, replaceVariables = true) => {
	const data = DEFAULT_KEY_BINDINGS[keyName] || null;

	let result = '';
	if (data && typeof data === 'function') {
		result = data(gds)
	} else if (data && data[gds]) {
		result = data[gds];
	}

	if (replaceVariables) {
		result = replaceCommandVariables(result);
	}

	return result;
}

export const pressedShortcuts = (evt, terminal, plugin) => {
		const keymap 	= evt.keyCode || evt.which;

		const gds		= plugin.settings.gds;
		const isApollo	= gds === 'apollo';
		// const isApollo	= window.TerminalState.isGdsApollo();
		// console.log('key pressed:' ,keymap);

		function doF8() {
			terminal.set_command(
				plugin.f8Reader.getFullCommand()
			);

			plugin.f8Reader.jumpToNextPos();
		}

		// Try to get user custom command
		const keyName = eventToButtonName(evt);
		const command = getUserCustomCommand(keyName);
		if (command !== false) {
			if (command === '((f8Command))') {
				doF8();
			} else {
				terminal.exec(command);
			}
			return true;
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
					terminal.insert(getBindingForKey(`ctrl+${keymap}`, gds));
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
					terminal.exec(getBindingForKey(`shift+${keymap}`, gds));
				break;

				// case 187: //+
				// case 61 : //+ FireFox
				case 188: //,
					terminal.insert('+');
				break;

				case 192 :	// Shift + ~
					switchTerminal({keymap : 'prev'});
				break;

				default : return true
			}

			return false;
		}

		if ( evt.altKey )
		{
			switch (keymap)
			{
				case 8: // + backSpace;
					terminal.clear();
				break;

				case 38 : // Up arrow
					prevCmd(plugin, terminal);
				break;

				case 40 : // down arrow
					nextCmd(plugin, terminal);
				break;

				default : return true
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
				doF8()
			break;

			case 116 : // F5
			case 122 : // F11
			case 123 : // F12
				const c = getBindingForKey(keymap, gds);
				terminal.exec(c);
			break;

			default: return true;
		}

		return false;
};