import Dom 			 from '../../helpers/dom.es6';
import ButtonPopOver from '../../modules/buttonPopover.es6';
import {CHANGE_FONT_SIZE} from "../../actions/settings";

class TextSize extends ButtonPopOver
{
	constructor( params )
	{
		super( params, 'div.terminal-menu-popover' );
		this.makeTrigger();

		this.curFont 	= 1;
		this.curBtn		= '';
	}

	build( list )
	{
		const buttons = [ 1, 2, 3, 4].map( value => {

			const button 		= Dom(`a.t-pointer ${this.curFont === value} [${value}]x`);

			button.addEventListener('click', () => {
				this.curBtn.classList.remove('checked');

				this.toggle(button);
				this.click(value);
			});

			this.popContent.appendChild( button );

			return button;
		});

		this.toggle(buttons[0]);
	}

	click(value)
	{
		this.popover.close();
		this.curFont = value;
		CHANGE_FONT_SIZE({fontSize : value});
	}

	toggle(button)
	{
		this.curBtn = button;
		this.curBtn.classList.toggle('checked');
	}
}

export default TextSize;