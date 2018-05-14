import Drop from "tether-drop";
import {UPDATE_SCREEN} from "../../actions/settings";
import Component from "../component";

export class ButtonPopover extends Component
{
	constructor({icon, popoverProps = {}, buttonProps = {}})
	{
		super(`button.btn btn-purple m-b-sm[${icon}]`, {
			onclick : () => this.clickOnButton(),
			style 	: 'display : block',
			...buttonProps
		});

		this.popContent = new Component('div', popoverProps);

		this.observe(
			this.popContent
		);

		this.closed = true;
	}

	clickOnButton()
	{
		if (this.popover)
		{
			if (this.getPopoverProps().openOn === null) // if manual open/close popover
			{
				this.closed = !this.closed;

				if (this.closed)
				{
					this.popover.close();
				} else
				{
					this.popover.open();
				}
			}

			return false;
		}

		this.popover = new Drop({...this.getPopoverDefs(), ...this.getPopoverProps()});

		UPDATE_SCREEN(); // need to pass current state in order to popovers components render right
		this.popover.open();
		this.closed = false;
	}

	getPopContent()
	{
	}

	getPopoverDefs()
	{
		return {
			target		: this.context,
			content		: this.getPopContent().getContext(),
			classes		: 'drop-theme-twipsy',
			position	: 'left top',
			// openOn		: 'click',
			openOn		: 'click',
			// constrainToWindow: true,
			// constrainToScrollParent: true
		}
	}

	getPopoverProps(props = {})
	{
		return props
	}

	mount()
	{
		// this.clickOnButton()
	}

	// _renderer()
	// {
	// }
}