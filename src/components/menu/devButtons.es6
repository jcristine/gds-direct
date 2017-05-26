
import Dom	from '../../helpers/dom.es6';
import ButtonPopOver	from '../../modules/buttonPopover.es6';

class CommandsBuffer extends ButtonPopOver
{
	constructor( params )
	{
		super( params );

		this.settings.onOpen = () => this.area.focus();
		this.makeTrigger();
	}

	build()
	{
		const area 		= Dom('textarea.form-control');
		const btn 		= Dom('button.btn btn-sm btn-primary btn-block m-t font-bold');
		btn.innerHTML	= 'Run';

		area.rows 	= 15;
		area.cols 	= 20;

		btn.onclick 	= () => {
			const cmd = area.value.trim().split(/\s+/);
			window.TerminalState.action('DEV_CMD_STACK_RUN', cmd);
			this.popover.close();
		};

		this.popContent.appendChild( area );
		this.popContent.appendChild( btn );

		this.area = area;
	}
}

export default class DevButtons
{
	constructor()
	{
		this.context = Dom('div');
		this.context.appendChild ( this.AddPqMacros() );
		this.context.appendChild ( this.commandsBuffer() );
	}

	AddPqMacros()
	{
		this.macros 			= Dom('span.btn btn-primary font-bold');
		this.macros.innerHTML 	= 'Test pq';
		this.macros.onclick 	= () => {
			// window.TerminalState.action('DEV_CMD_STACK_RUN', ['A/V/13SEPSEAMNL+DL', '01Y1*', '*R', '$BB']);
			window.TerminalState.action('DEV_CMD_STACK_RUN', ['A10JUNKIVRIX', '01Y1Y2', '$B']);
		};

		return this.macros;
	}

	commandsBuffer()
	{
		return this.commandsBuffer = new CommandsBuffer({
			icon : `<span>Dev Buf</span>`
		}).getTrigger();
	}

	getContext()
	{
		return this.context;
	}
}