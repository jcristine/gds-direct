import {getDate} 	from './helpers.es6';

/*window.addEventListener("beforeunload", function (e) {
	let confirmationMessage = "TEST";
	(e || window.event).returnValue = confirmationMessage; //Gecko + IE
	return confirmationMessage;                            //Webkit, Safari, Chrome
});*/

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

export const pressedShortcuts = (evt, terminal, plugin) => {
		const keymap 	= evt.keyCode || evt.which;
		const isApollo	= window.TerminalState.isGdsApollo();
		const gds		= window.TerminalState.getGds();

		// console.log('key pressed:' ,keymap);
		// evt.preventDefault();
		// evt.stopPropagation();

		if ( evt.ctrlKey || evt.metaKey )
		{
			switch (keymap)
			{
				case 8:  //CTRL + backSpace;
				case 83: //CTRL + S;
					window.TerminalState.purgeScreens();
				break;

				case 87: //CTRL+W
					window.TerminalState.clearTerminal();
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
					const f1 = {
						apollo 	: 'S*CTY/',
						amadeus : 'DAC',
						sabre 	: 'W/*'
					};

					terminal.insert(f1[gds]);
				break;

				case 113 : // F2
					const f2 = {
						apollo 	: 'S*AIR/',
						amadeus : 'DNA',
						sabre 	: 'W/*'
					};

					terminal.insert(f2[gds]);
				break;

				// disabling these keys from terminal library to execute
				// these keys are used in terminalKeydown()
				case 192 :	// Ctrl + ~
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
				case 120 : //F9
					const f9 = {
						apollo 	: 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
						amadeus : 'AP SFO 800-750-2238-A',
						sabre 	: '91-800-750-2238-A'
					};

					terminal.exec(f9[gds]);
				break;

				case 116 : //F5
					terminal.exec(isApollo ? 'SEM/2G52/AG' : 'AAA5E9H');
				break;

				case 117: //F6
					terminal.exec(isApollo ? 'SEM/2G55/AG' : 'AAA6IIF');
				break;

				case 118: //F7
					terminal.exec(isApollo ? 'SEM/2G2H/AG' : 'AAADK8H');
				break;

				case 119: //F8
					terminal.exec(isApollo ? 'SEM/2BQ6/AG' : 'AAAW8K7');
				break;

				case 187: //+
				case 61 : //+ FireFox
				case 188: //,
					terminal.insert('+');
				break;

				// disabling key from terminal library to execute
				// key is used in terminalKeydown()
				case 192 :	// Shift + ~
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
			/*case 59	: // ; firefox
			case 186: // ; all other browsers
				if (!isApollo)
				{
					// terminal.cmd().delete(-1);
					// return false;
				}
			break;*/

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

			case 116 : // F5
				const plus320 	= getDate().plus320;
				const f5 		= {
					apollo 	: '0TURZZBK1YYZ' + plus320 + '-RETENTION LINE',
					amadeus : 'RU1AHK1SFO' + plus320 + '/RETENTION',
					sabre 	: '0OTHYYGK1/RETENTION' + plus320
				};

				terminal.exec(f5[gds]);
			break;

			case 122 : //F11
				const f11	= {
					apollo 	: 'T:TAU/',
					amadeus : 'TKTL',
					sabre 	: '7TAW/'
				};

				terminal.exec(f11[gds] + getDate().now);
			break;

			case 123 : //F12
				const f12 = {
					apollo 	: 'R:',
					amadeus : 'RF',
					sabre 	: '6'
				};

				terminal.exec(f12[gds] + window.apiData.auth.login.toUpperCase());
			break;

			default: return true;
		}

		return false;
};