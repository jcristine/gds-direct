import Dom		from '../helpers/dom.es6';
import Terminal	from '../modules/terminal.es6';
import {cookieGet} 		from '../helpers/cookie';
import {UPDATE_STATE} from "../actions";


export default class FullScreen {

	static makeBody()
	{
		const body 		= Dom('div.terminal-wrap-custom terminal-cell t-f-size-13 text-center t-height-100');
		const body2 	= Dom('div.terminal-body');

		body.appendChild(body2);
		return body;
	}

	static terminal( body )
	{
		const props = {
			name 			: 'fullScreen',
			gds				: window.TerminalState.getGds(),
			buffer			: false
		};

		const dimensions = {
			height		: body.clientHeight,
			width 		: body.clientWidth,
			char		: '',
			// char		: {
			// 	height 		: '',
			// 	width		: ''
			// }
		};

		const terminal = new Terminal( props );
		terminal.reattach(body, dimensions);
		terminal.context.innerHTML = window.activePlugin.terminal.get(0).innerHTML;

		// on close there is two cmd lines
		const cmd = terminal.context.querySelector('.cmd');
		cmd.parentNode.removeChild( cmd );

		// remove cloned epmty lines
		const emptyLines = terminal.context.querySelector('.emptyLinesWrapper');
		emptyLines.parentNode.removeChild( emptyLines );

		terminal.init();
	}

	static show()
	{
		if (!window.activePlugin)
		{
			alert('no terminal selected');
			return false;
		}

		const themeClass	= cookieGet('terminalTheme_' + apiData.auth.id) || 'terminaltheme_' + apiData['terminalThemes'][0]['id'];
		const body			= this.makeBody();

		window.apiData.Modal.make({
			dialog_class	: 'modal-full no-footer',
			body_class		: 'no-padder ' + themeClass,
			body			: body,
			noCloseBtn 		: 1,
			header			: 'Full Screen'
		})

		.show( params => {

			params.modal.on('hidden.bs.modal', e => {
				UPDATE_STATE({});
				params.modal.detach().remove();
			});

			this.terminal( body );
		});
	}
}