'use strict';

let $					= require('jquery');
window.$ 				= window.jQuery = $;
let terminal 			= require('jquery.terminal/js/jquery.terminal');
let Helpers				= require('../helpers/helpers');

import SabreSession from '../modules/sabreSession';

let TerminalPlugin = function()
{
	return {

		init : function (Context) {

			$(Context).on('keypress',function (evt) {
				if (evt.which && !evt.ctrlKey)
				{
					let ch = Helpers.substitutePrintableChar( String.fromCharCode( evt.which ) );

					if (ch)
					{
						term.insert(ch);
						return false;
					}
				}
			});

			$(Context).on('keydown', function (evt) {
				if ((evt.which === 83 || evt.which === 87) && evt.ctrlKey) { // CTRL+S || CTRL+W
					term.clear();
					return false;
				} else if (evt.which === 68 && evt.ctrlKey) { // CTRL+D
					return false;
				} else if (evt.which === 76 && evt.ctrlKey) { // CTRL+L
					return false;
				} else if (evt.which === 82 && evt.ctrlKey) { // CTRL+R
					return false;
				}
			});

			let term = $(Context).terminal(function(command, terminal) {

				let outputCache = [];

				if (command === '')
				{
					terminal.echo('');
				}
				else if (command === 'MD')
				{
					terminal.echo( outputCache.length > 0 ?  outputCache.shift() : '‡NOTHING TO SCROLL‡' );
				}
				else
				{
					try {
						terminal.set_prompt('');

						SabreSession.runCommand(command).then( ( response = {} ) => {

							let result = response['data'];

							if (result.prompt)
								terminal.set_prompt( result.prompt );

							if ( result.clearScreen )
								terminal.clear();

							if ( result.output )
							{
								outputCache = Helpers.makeCachedParts(result.output);
								terminal.echo(outputCache.shift());
							}
						});

					} catch(e)
					{
						alert(' something went wrong ');
						terminal.error( new String(e) );
					}
				}
			},

			{
				greetings	: false,
				name		: 'sabre_terminal',
				disabled	: true,
				prompt		: '',
				onInit		: function(terminal)
				{
					SabreSession.startSession();
					// let startSessionOutput = SabreSession.startSession();
					//terminal.echo('>' + startSessionOutput['emulationCommand']);
					//terminal.echo(startSessionOutput['emulationCommandOutput']);
				}
			});

			return term;
		}
	}
}();

export default TerminalPlugin;

