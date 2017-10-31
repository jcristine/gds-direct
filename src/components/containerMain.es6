import ActionsMenu 		from './actionsMenu';
import MenuPanel 		from './menuPanel';
import TerminalMatrix 	from './terminalMatrix';
import Component 		from '../modules/component';

let matrix;

export default class Container extends Component {

	constructor( rootId )
	{
		super('section');

		this.observe(
			new Wrapper()
		);

		document.getElementById( rootId ).appendChild(
			this.getContext()
		);
	}

	purgeScreens( gds )
	{
		matrix.purgeScreens( gds );
	}

	getTerminal(gds, index, props)
	{
		return matrix.getTerminal(gds, index, props);
	}

	_renderer()
	{
		this.context.className 	= 'terminal-wrap-custom term-f-size-' + this.props.fontSize;
	}
}

class RightSide extends Component
{
	constructor()
	{
		super('aside.t-d-cell menu');

		this.observe(
			new MenuPanel()
		);
	}

	_renderer()
	{
		this.context.classList.toggle('hidden', this.props.hideMenu );
	}
}

class Wrapper extends Component
{
	constructor()
	{
		super('div.term-body minimized');

		matrix 			= new TerminalMatrix( this.context );

		const leftSide 	= new Component('aside.t-d-cell left');
		const rightSide = new RightSide();

		this
			.append( leftSide )
			.append( rightSide );

		this.addToObserve( rightSide );
		this.addToObserve( leftSide );

		leftSide
			.observe( matrix )
			.append(
				new ActionsMenu()
			);
	}
}