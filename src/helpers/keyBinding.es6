'use strict';

import {currDate} 	from './helpers.es6';

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
					terminal.insert( isApollo ? 'S*CTY/' : 'W/*' );
					return false;
				break;

				case 113 :
					// f2
					// Apollo template: S*AIR/(Airline Code)
					// Apollo example: S*AIR/RIX
					// Sabre template: W/*(Airline Code)
					 // Sabre example: W/*BT

					terminal.insert( isApollo ? 'S*AIR/' : 'W/*' );
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
					let cmd = isApollo ? 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT' : '91-800-750-2238-A';
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
					terminal.cmd().delete(-1);
					return false;
				}

			break;

			case 34 : // page down
				terminal.exec('MD');
				return false;
			break;

			case 33 : //page up
				terminal.exec('MU');
				return false;
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

			case 122 :
				// console.log('f11');
				const d = currDate();
				terminal.exec(  (isApollo ? 'T:TAU/' : '7TAW/') + d );
				return false;
			break;

			case 123 :
				// console.log('f12');
				terminal.exec(  ( isApollo ? 'R:' : '6')  + window.apiData.auth.login.toUpperCase() );
				return false;
			break;

			default:
		}

		return true;
	}
}