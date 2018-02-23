import Dom 			 from '../../helpers/dom.es6';
import ButtonPopOver from '../../modules/buttonPopover.es6';
import {CHANGE_FONT_SIZE} from "../../actions";

class TextSize extends ButtonPopOver
{
	constructor( params )
	{
		super( params );
		this.makeTrigger();
	}

	build( list )
	{
		[ '1', '2', '3', '4'].forEach( value => {

			const button 		= Dom('button.list-group-item');
			button.innerHTML	= value + 'x';

			button.addEventListener('click', () => {
				this.popover.close();
				CHANGE_FONT_SIZE({fontSize : value})
			});

			this.popContent.appendChild( button );
		})
	}
}

export default TextSize;