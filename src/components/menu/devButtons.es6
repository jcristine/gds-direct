import Dom				from '../../helpers/dom.es6';
import ButtonPopOver	from '../../modules/buttonPopover.es6';
import FullScreen		from '../../modules/fullscreen.es6';
import {DEV_CMD_STACK_RUN} from "../../actions";

const STORAGE_KEY = 'dedTerminalBufCmd';

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
		const cmd = JSON.parse( window.localStorage.getItem(STORAGE_KEY) ) || [];

		const area 		= Dom(`textarea.form-control`);
		const btn 		= Dom('button.btn btn-sm btn-primary btn-block m-t font-bold');
		btn.innerHTML	= 'Run';

		area.value = cmd.join("\n");

		area.rows 	= 15;
		area.cols 	= 20;

		btn.onclick 	= () => {
			const cmd = area.value.trim().split(/\s+/);

			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cmd));
			DEV_CMD_STACK_RUN(cmd);

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
		this.context.appendChild ( this.fullScreen() );
	}

	AddPqMacros()
	{
		this.macros 			= Dom('span.btn btn-primary font-bold');
		this.macros.innerHTML 	= 'Test pq';
		this.macros.onclick 	= () => {
			DEV_CMD_STACK_RUN(['A/V/13SEPSEAMNL+DL', '01k1*', '*R', '$BN1+2*C09+3*inf']);
		};

		return this.macros;
	}

	commandsBuffer()
	{
		return this.commandsBuffer = new CommandsBuffer({
			icon : `<span>Dev Buf</span>`
		}).getTrigger();
	}

	fullScreen()
	{
		this.macros 			= Dom('span.btn btn-primary font-bold');
		this.macros.innerHTML 	= 'Full';
		this.macros.onclick 	= () => FullScreen.show();

		return this.macros;
	}

	getContext()
	{
		return this.context;
	}
}