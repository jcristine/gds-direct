'use strict';

import {getDate} 	from './helpers.es6';

/*window.addEventListener("beforeunload", function (e) {
	let confirmationMessage = "TEST";
	(e || window.event).returnValue = confirmationMessage; //Gecko + IE
	return confirmationMessage;                            //Webkit, Safari, Chrome
});*/


export default class KeyBinding
{
	static parse(evt, terminal, plugin)
	{
		const keymap 	= evt.keyCode || evt.which;
		const isApollo	= window.TerminalState.isGdsApollo();
		const gds		= window.TerminalState.getGds();

		let cmd			= '';

		// if ( keymap === 13 )
		// 	return false;

		// console.log(keymap);
		// evt.preventDefault();
		// evt.stopPropagation();

		if ( evt.ctrlKey || evt.metaKey )
		{
			switch (keymap)
			{
				case 8: //  CTRL + backSpace; || CTRL + S
				// case 83:
					evt.preventDefault();
					//terminal.clear();
					window.TerminalState.purgeScreens();
					return false;
				break;

				case 87: //	CTRL+W
					window.TerminalState.clearTerminal();
					return false;
				break;

				case 68 : // CTRL+D
					// window.TerminalState.clearTerminal();
					return false;
				break;

				case 76 : // CTRL+L
					return false;
				break;

				case 82 : // CTRL+R
					return false;
				break;

				case 120 :
					// F9
					// Template for Apollo: ¤:5S(paxOrder) (sellPrice) N1 (netPrice) F1 (fareAmount)
					// Example for Apollo: ¤:5S1 985.00 N1 720.00 F1 500.00
					// Template for Sabre: 5S(paxOrder) (sellPrice) N1 (netPrice) F1 (fareAmount)
					// Example for Sabre: 5S1 985.00 N1 720.00 F1 500.00
					evt.preventDefault();
					console.log('F9');
					return false;
				break;

				case 38 : // Up arrow
					// Last performed format

					plugin.history.previous().then( command => {
						terminal.cmd().set( command );
					});

					return false;
				break;

				case 40 : // down arrow
					//Next performed format, by default returns to the first format and than each one by one.

					plugin.history.next().then( command => {
						terminal.cmd().set( command );
					});

					return false;
				break;

				case 112 :	// f1
					switch (gds)
					{
						case 'apollo':
							cmd = 'S*CTY/';
							break;
						case 'amadeus':
							cmd = 'DAC';
							break;

						default:
							cmd = 'W/*'
					}

					terminal.insert( cmd );
					return false;
				break;

				case 113 :
					// f2
					// Apollo template: S*AIR/(Airline Code)
					// Apollo example: S*AIR/RIX
					// Sabre template: W/*(Airline Code)
					 // Sabre example: W/*BT

					switch (gds)
					{
						case 'apollo':
							cmd = 'S*AIR/';
							break;
						case 'amadeus':
							cmd = 'DNA';
							break;

						default:
							cmd = 'W/*'
					}

					terminal.insert( cmd );
					return false;
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
					return false;
					break;


				default:
					console.log(' default ');
			}
		}

		if ( evt.shiftKey )
		{
			switch (keymap)
			{
				case 120 : //f9
					switch (gds)
					{
						case 'apollo':
							cmd = 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT';
							break;
						case 'amadeus':
							cmd = 'AP SFO 800-750-2238-A';
							break;

						default:
							cmd = '91-800-750-2238-A';
					}

					terminal.exec(cmd);
					return false;
				break;

				case 116 : //F5
					switch (gds)
					{
						case 'apollo':
							cmd = 'SEM/2G52/AG';
							break;

						default:
							cmd = 'AAA5E9H';
					}

					terminal.exec(cmd);
					return false;
				break;

				case 117: //F6
					terminal.exec(isApollo ? 'SEM/2G55/AG' : 'AAA6IIF');
					return false;
				break;

				case 118: //F7
					terminal.exec(isApollo ? 'SEM/2G2H/AG' : 'AAADK8H');
					return false;
				break;

				case 119: //F8
					terminal.exec(isApollo ? 'SEM/2BQ6/AG' : 'AAAW8K7');
					return false;
				break;

				case 187: //+
				case 61 : //+ FireFox
				case 188: //,
					terminal.insert('+');
					return false;
				break;


				// disabling key from terminal library to execute
				// key is used in terminalKeydown()
				case 192 :	// Shift + ~
					return false;
					break;

				default :
			}
		}

		if ( evt.altKey )
		{
			switch (keymap)
			{
				case 8: // + backSpace;
					terminal.clear();
					return false;
				break;

				case 38 : // Up arrow
					// Last performed format
					plugin.history.previous().then( command => {
						terminal.cmd().set( command );
					});
					return false;
				break;

				case 40 : // down arrow
					//Next performed format, by default returns to the first format and than each one by one.

					plugin.history.next().then( command => {
						terminal.cmd().set( command );
					});

					return false;
				break;

				default :
			}
		}

		switch (keymap)
		{
			case 59	: // ; firefox
			case 186: // ; all other browsers

				if (!isApollo)
				{
					// terminal.cmd().delete(-1);
					// return false;
				}

			break;

			case 34 : // page down
			case 33 : //page up

				let cmdA = keymap === 33 ? 'MU' : 'MD';

				if (plugin.lastCommand && plugin.lastCommand.toLowerCase() === '$bba')
				{
						terminal.exec(cmdA);
						return false;
				}

				if (isApollo && plugin.lastCommand && plugin.lastCommand.substr(0, 2).toLowerCase() === '$b')
				{
				} else
				{
					terminal.exec(cmdA);
					return false;
				}
			break;

			case 38 : //UP

				plugin.history.previous().then( command => {
					terminal.cmd().set( command );
				});

				return false;
			break;

			case 40 : //DOWN
				plugin.history.next().then( command => {
					terminal.cmd().set( command );
				});

				return false;
			break;

			case 116 :
				// console.log('f5');
				const plus320 = getDate().plus320;

				switch (gds)
				{
					case 'apollo':
						cmd = '0TURZZBK1YYZ' + plus320 + '-RETENTION LINE';
						break;
					case 'sabre':
						cmd = '0OTHYYGK1/RETENTION' + plus320;
						break;
					case 'amadeus':
						cmd = 'RU1AHK1SFO' + plus320 + '/RETENTION';
						break;

					default:
						cmd = '0TURZZBK1YYZ'+ plus320 +'-RETENTION LINE'
				}

				terminal.exec(cmd);
				return false;
			break;

			case 122 :
				// console.log('f11');
				const d = getDate().now;

				switch (gds)
				{
					case 'apollo':
						cmd = 'T:TAU/';
						break;
					case 'amadeus':
						cmd = 'TKTL';
						break;

					default:
						cmd = '7TAW/'
				}

				terminal.exec(  cmd + d );
				return false;
			break;

			case 123 :
				// console.log('f12');
				switch (gds)
				{
					case 'apollo':
						cmd = 'R:';
						break;
					case 'amadeus':
						cmd = 'RF';
						break;

					default:
						cmd = '6'
				}

				terminal.exec( cmd + window.apiData.auth.login.toUpperCase() );
				return false;
			break;

			default:
		}

		return true;
	}
}