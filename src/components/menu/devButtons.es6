import Dom				from '../../helpers/dom.es6';
import ButtonPopOver	from '../../modules/buttonPopover.es6';
import {DEV_CMD_STACK_RUN} from "../../actions";
import Component from "../../modules/component";

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
		const btn 		= Dom('button.btn btn-sm btn-primary btn-block m-t font-bold[Run]');

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

export class DevButtons extends Component
{
	constructor()
	{
		super('div');
		// this.context.appendChild ( this.PqAddTest() );

		this.attach(
			new CommandsBuffer({
				icon : `<span>Dev Buf</span>`
			}).getTrigger()
		)
	}

	// PqAddTest()
	// {
	// 	this.macros 			= Dom('span.btn btn-mozilla font-bold[PQ Dev]');
	// 	this.macros.onclick 	= PQ_MODAL_SHOW_DEV;
	//
	// 	return this.macros;
	// }

	// fullScreen()
	// {
	// 	this.macros 			= Dom('span.btn btn-primary font-bold[Full]');
	// 	this.macros.onclick 	= FULL_SCREEN;
	//
	// 	return this.macros;
	// }
}