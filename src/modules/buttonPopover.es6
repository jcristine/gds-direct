import Drop		from 'tether-drop';
import Dom 		from '../helpers/dom.es6';

// classes		: 'drop-theme-arrows',
// classes		: 'drop-theme-hubspot-popovers',
// classes		: 'drop-theme-basic',

// const CLASS_NAME = 'drop-theme-hubspot-popovers';
const CLASS_NAME = 'drop-theme-twipsy';
// const CLASS_NAME = 'drop-theme-arrows-bounce';
// const CLASS_NAME = 'drop-theme-arrows-bounce-dark';
// const CLASS_NAME = 'drop-theme-basic';
// const CLASS_NAME = 'drop-theme-arrows';

export default class ButtonPopOver
{
	constructor( params, context = 'div', attributes = {})
	{
		this.settings 	= params;
		this.popContent = Dom( context, attributes );
	}

	makeTrigger(attributes = {})
	{
		this.trigger = Dom('button.btn btn-primary font-bold', {...attributes, innerHTML : this.settings.icon});

		this.trigger.addEventListener('click', () => this.makePopover());

		return this.trigger;
	}

	makePopover()
	{
		if (this.popover)
		{
			return false;
		}

		this.popover = new Drop({
			target		: this.getTrigger(),
			content		: this.getPopContent(),
			classes		: CLASS_NAME,
			position	: 'left top',
			openOn		: 'click'
		});

		if (this.settings.onOpen)
		{
			this.popover.on('open', this.settings.onOpen );
		}

		this.popover.open();
	}

	getTrigger()
	{
		return this.trigger;
	}

	getPopContent()
	{
		this.build();
		return this.popContent;
	}

	build()
	{
	}
}