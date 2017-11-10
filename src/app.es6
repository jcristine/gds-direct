import {setLink}	from './helpers/requests.es6';
import {INIT, UPDATE_STATE} 		from "./actions";

class Terminal
{
	constructor( params )
	{
		setLink( params['commandUrl'] );
		INIT(params);
	}
}

window.terminal = Terminal;

let resizeTimeout;

window.onresize = () => {

	if (resizeTimeout)
		clearInterval(resizeTimeout);

	resizeTimeout = setTimeout( () => UPDATE_STATE({}), 10 );
};