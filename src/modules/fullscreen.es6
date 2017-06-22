import Dom		from '../helpers/dom.es6';
import Terminal	from '../modules/terminal.es6';


export default class FullScreen {

	static makeBody()
	{
		if (!window.activePlugin)
			return false;

		const body 		= Dom('div.terminal-wrap-custom t-f-size-13 text-center t-height-100');
		const body2 	= Dom('div.terminal-body');

		body.appendChild(body2);
		return body;
	}

	static terminal( body )
	{
		const props = {
			name 			: 'fullScreen',
			sessionIndex	: window.TerminalState.getAreaIndex(), // to leave current active terminal
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

		const body = this.makeBody();

		window.apiData.Modal.make({
			dialog_class	: 'modal-full no-footer',
			body_class		: 'no-padder',
			body			: body,
			noCloseBtn 		: 1,
			header			: 'Full Screen'
		})

		.show( params => {

			params.modal.on('hidden.bs.modal', e => {
				window.TerminalState.change({});
				params.modal.detach().remove();
			});

			this.terminal( body );
		});
	}
}