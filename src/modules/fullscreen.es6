//deprecated
/*
import Dom				from '../helpers/dom.es6';
import Terminal			from '../modules/terminal.es6';
import {cookieGet} 		from '../helpers/cookie';
import {UPDATE_STATE} 	from "../actions";

export default class FullScreen {

	static makeBody()
	{
		const body 		= Dom('div.terminal-full-screen terminal-wrap-custom terminal-cell t-f-size-13 text-center t-height-100');
		const body2 	= Dom('div.terminal-body');

		body.appendChild(body2);
		return body;
	}

	static terminal({body, html, ...props})
	{
		const dimensions = {
			height		: body.clientHeight,
			width 		: body.clientWidth,
			char		: ''
		};

		const terminal = new Terminal(props);

		terminal.reattach(body, dimensions);
		terminal.context.innerHTML = html;

		// on close there is two cmd lines
		const cmd = terminal.context.querySelector('.cmd');
		cmd.parentNode.removeChild( cmd );

		// remove cloned empty lines
		const emptyLines = terminal.context.querySelector('.emptyLinesWrapper');
		emptyLines.parentNode.removeChild( emptyLines );

		terminal.init();
	}

	static show(gds, activeTerminal)
	{
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

			params.modal.on('hidden.bs.modal', () => {
				UPDATE_STATE({});
				params.modal.detach().remove();
			});

			const props = {
				name 		: 'fullScreen',
				gds			: gds,
				html		: activeTerminal.get(0).innerHTML,
				body
			};

			this.terminal(props);
		});
	}
}*/
