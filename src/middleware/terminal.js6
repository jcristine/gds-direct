'use strict';

let $					= require('jquery');
window.$ 				= window.jQuery = $;

let jqTerminal 			= require('jquery.terminal/js/jquery.terminal');
let Helpers				= require('../helpers/helpers');

import SabreSession from '../modules/sabreSession';

export default class TerminalPlugin
{
	constructor( context, name )
	{
		this.context	= context;
		this.name		= name;
		this.terminal 	= null;

		this.init();
	}

	getPlugin()
	{
		return this.terminal;
	}

	static parseInput( evt, terminal )
	{
		//console.log('parse input bla common', terminal );
		//console.log( this );

		if ( !terminal.enabled() ) // keypress fires globaly on all terminals;
			return false;

		if (evt.which && !evt.ctrlKey)
		{
			let ch = Helpers.substitutePrintableChar( String.fromCharCode( evt.which ) );

			if (ch)
			{
				terminal.insert(ch);
				return false;
			}
		}
	}

	static parseKeyBinds( evt, terminal )
	{
		//console.log( "AAAA", terminal );

		if ( (evt.which === 83 || evt.which === 87) && evt.ctrlKey )
		{
			//console.log("BBBB", terminal);
			// CTRL+S || CTRL+W;

			terminal.clear();
			return false;

		} else if (evt.which === 68 && evt.ctrlKey)
		{
			// CTRL+D
			return false;
		} else if (evt.which === 76 && evt.ctrlKey)
		{
			// CTRL+L
			return false;
		} else if (evt.which === 82 && evt.ctrlKey)
		{
			// CTRL+R
			return false;
		}
	}

	onInit( terminal )
	{
		//console.log( 'ON INIT ' , this)
		//SabreSession.startSession();
		// let startSessionOutput = SabreSession.startSession();
		//terminal.echo('>' + startSessionOutput['emulationCommand']);
		//terminal.echo(startSessionOutput['emulationCommandOutput']);
	}

	init()
	{
		this.terminal = $(this.context).terminal( this.commandParser, {
			greetings	: '',
			name		: 'sabre_terminal' + this.name,
			prompt		: '>',

			//enabled		: false,

			keypress	: TerminalPlugin.parseInput,
			keydown		: TerminalPlugin.parseKeyBinds,
			onInit		: this.onInit
			//,
			//
			//onTerminalChange	: function () {
			//	console.log(' terminal change 1')
			//},
			//
			//exceptionHandler	 : function () {
			//	console.log('exc', arguments)
			//}
		});
	}

	commandParser( command, terminal )
	{
		//console.log(' commandParser ',  command, terminal )

		let outputCache = [];

		if (command === '')
		{
			terminal.echo('');
		}
		else if ( command === 'MD' )
		{
			terminal.echo( outputCache.length > 0 ?  outputCache.shift() : '‡NOTHING TO SCROLL‡' );
		}
		else
		{
			try {
				terminal.set_prompt('');

				SabreSession
					.runCommand(command)
					.then( ( response = {} ) => {

						let result = response['data'];

						if ( result['prompt'] )
							terminal.set_prompt( result['prompt'] );

						if ( result['clearScreen'] )
							terminal.clear();

						if ( result['output'] )
						{
							outputCache = Helpers.makeCachedParts( result['output'] );
							terminal.echo( outputCache.shift() );
						}

					});

			} catch(e)
			{
				alert(' something went wrong ');
				//terminal.error( new String(e) );
			}
		}

	}
}