// 'deprieated';
import ButtonPopOver	from '../../modules/buttonPopover.es6';

export default class Settings extends ButtonPopOver
{
	constructor( params )
	{
		super( params );

		// this.popContent = Dom('div');
		this.makeTrigger();

		this.popContent.innerHTML = '<div class="wrapper"> In Development </div>';
	}

	// build()
	// {
	// 	Request.get('', true).then( ( response = ['No History'] ) => {
	// 	});
	// }
}
