'use strict';

import ActionsMenu 		from './actionsMenu';
import MenuPanel 		from './menuPanel';
import TerminalMatrix 	from './terminalMatrix';
import Component 		from '../modules/component';

class RightSide extends Component
{
	constructor()
	{
		super('aside.t-d-cell menu');
		this.observe( new MenuPanel() );
	}

	_renderer()
	{
		this.context.classList.toggle('hidden', this.props.hideMenu );
	}
}

let matrix;

class Wrapper extends Component
{
	constructor()
	{
		super('div.term-body minimized');

		matrix 			= new TerminalMatrix();

		const leftSide 	= new Component('aside.t-d-cell left');
		const rightSide = new RightSide();

		this
			.append( leftSide )
			.append( rightSide );

		this.addToObserve( rightSide );
		this.addToObserve( leftSide );

		leftSide
			.observe( matrix )
			.observe( new ActionsMenu() );
	}

	_renderer()
	{
		const gds = this.props.gds;

		if ( this.gds !== gds )
		{
			this.gds 				= gds;
			this.context.className = `term-body minimized ${gds}`; // change gds styles
		}
	}
}

export default class Container extends Component {

	constructor( rootId )
	{
		super('section');

		this.observe( new Wrapper() );

		document.getElementById( rootId ).appendChild( this.getContext() );
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
		const params = this.props;

		this.context.className 	= 'terminal-wrap-custom term-f-size-' + params.fontSize;

		this.props = {
			hideMenu		: params.hideMenu,
			gds 			: params.gdsObj['name'],
			canCreatePq 	: params.gdsObj.canCreatePq,
			sessionIndex  	: params.gdsObj.sessionIndex,
			activeTerminal 	: params.gdsObj.activeTerminal,
			cellMatrix		: params.gdsObj.matrix,
			containerWidth	: this.context.clientWidth,
			buffer			: params.buffer
		};
	}
}