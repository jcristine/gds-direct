import Dom 			 from '../../helpers/dom.es6';
import ButtonPopOver from '../../modules/buttonPopover.es6';
import {CHANGE_FONT_SIZE, SET_DISABLE_TEXT_WRAP} from "../../actions/settings";

class TextSize extends ButtonPopOver
{
	constructor( {fontSize, ...params} )
	{
		super( params, 'div.terminal-menu-popover' );
		this.makeTrigger();


		this.curFont 	= fontSize;
		this.curBtn		= '';
	}

	build( list )
	{
		[ 1, 2, 3, 4].map( value => {

			const button 		= Dom(`a.t-pointer  [${value}]x`);

			button.addEventListener('click', () => {
				this.curBtn.classList.remove('checked');

				this.toggle(button);
				this.click(value);
			});

			this.popContent.appendChild( button );

			if (this.curFont === value )
			{
				this.toggle(button);
			}

			return button;
		});

		let noWrapFlag = Dom('input', {
			type: 'checkbox',
			checked: window.GdsDirectPlusState.disableTextWrap(),
			onchange: () => {
				this.disableTextWrap = noWrapFlag.checked;
				SET_DISABLE_TEXT_WRAP(noWrapFlag.checked);
			},
		});
		let noWrapLabel = Dom('label[Disable Text Wrap: ]', {
			title: 'May speed up PQ popup opening',
			style: 'float: right; white-space: nowrap',
		});
		noWrapLabel.appendChild(noWrapFlag);
		this.popContent.appendChild(noWrapLabel);
		this.popContent.appendChild(Dom('br', {clear: 'all'}));
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