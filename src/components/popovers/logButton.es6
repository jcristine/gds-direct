import ButtonPopOver from "../../modules/buttonPopover";
import Component from "../../modules/component";
import Dom from '../../helpers/dom';

export class LogButton extends Component
{
	constructor()
	{
		super('div');
	}

	setState({log})
	{
		return super.setState({log});
	}

	mount()
	{
		const trigger = new Log(this.state);

		this.context.appendChild(
			trigger.makeTrigger()
		);

		this.log = trigger;
	}

	_renderer()
	{
		this.log.update( this.state );
	}
}

export class Log extends ButtonPopOver
{
	constructor()
	{
		super({icon : 'Log'}, 'div', {style : 'width : 300px; max-height : 300px'});
		this.log = [];
	}

	update( {log = []} )
	{
		if (log.length)
		{
			this.log		= [...this.log, [...log] ];
			this.popover 	= false;
		}

		this.trigger.classList.toggle('hidden', this.log.length === 0);
	}

	build()
	{
		this.popContent.innerHTML 	= '';

		this.log.reverse().forEach( cmdArray => {

			const cmdContainer 			= Dom('div.m-t m-b');

			cmdArray.forEach( obj => {

				cmdContainer.appendChild(
					Dom( `div.font-bold text-${obj.type}[${obj.text}]` )
				)

			});

			this.popContent.appendChild( cmdContainer );
		});
	}
}