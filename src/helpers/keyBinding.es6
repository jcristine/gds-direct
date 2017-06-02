'use strict';

/*window.addEventListener("beforeunload", function (e) {
	let confirmationMessage = "TEST";
	(e || window.event).returnValue = confirmationMessage; //Gecko + IE
	return confirmationMessage;                            //Webkit, Safari, Chrome
});*/

function next( terminal )
{

	terminal.cmd().set ( terminal.history().previous() );
}

function prev( terminal )
{
	terminal.cmd().set( terminal.history().end() ? '' : terminal.history().next() );
}

export default class KeyBinding
{
	static parse(evt, terminal)
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
				case 8: //  CTRL + backSpace; || CTRL+W || CTRL + S
				case 87:
				// case 83:
					evt.preventDefault();
					//terminal.clear();
					window.TerminalState.purgeScreens();
					return false;
				break;

				case 68 :
					console.log('dddd');
					// CTRL+D
					return false;
				break;

				case 76 :
					// CTRL+L
					return false;
				break;

				case 82 :
					// CTRL+R
					// terminal.insert('cccc');
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

				case 38 :
					// Up arrow
					// Last performed format
					next( terminal );
					return false;
				break;

				case 40 :
					// down arrow
					//Next performed format, by default returns to the first format and than each one by one.
					prev( terminal );
					return false;
				break;

				case 112 :	// f1
					terminal.insert( isApollo ? 'S*CTY' : 'W/*' );
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

				case 38 :
					// Up arrow
					// Last performed format
					next( terminal );
					return false;
				break;

				case 40 :
					// down arrow
					//Next performed format, by default returns to the first format and than each one by one.
					prev( terminal );
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