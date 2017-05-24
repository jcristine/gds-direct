'use strict';

import ActionsMenu 	from './actionsMenu.es6';
import MenuPanel 	from './menuPanel.es6';
import Dom			from '../helpers/dom.es6';
import TerminalMatrix from './terminalMatrix.es6';

class RightMenu
{
	static init()
	{
		this.context = Dom('aside.t-d-cell menu');
		this.context.appendChild( MenuPanel.getContext() );
		return this;
	}

	static render( params )
	{
		MenuPanel.render( params );
		this.context.classList.toggle('hidden', params.hideMenu );
	}

	static getContext()
	{
		return this.context;
	}
}

class Wrapper
{
	static init()
	{
		this.context = Dom('div.term-body minimized');
		this.context.appendChild( MenuPanel.getContext() );

		const LeftSide 	= Dom('aside.t-d-cell left');
		LeftSide.appendChild( TerminalMatrix.context );
		LeftSide.appendChild( ActionsMenu.init().getContext() );

		this.context.appendChild( LeftSide );
		this.context.appendChild( RightMenu.init().getContext() );

		return this;
	}

	static render( params )
	{
		const gds = params.gds;

		if ( this.gds !== gds )
		{
			this.gds 				= gds;
			this.context.className = `term-body minimized ${gds}`; // change gds styles
		}

		RightMenu.render( params );
		TerminalMatrix.render( params );
	}

	static getContext()
	{
		return this.context;
	}
}

export default class Container {

	static init( rootId )
	{
		const Root = document.getElementById( rootId );

		this.context = Dom(`section`);
		this.context.appendChild( Wrapper.init().getContext() );

		Root.appendChild( this.context );
	}

	static purgeScreens( gds )
	{
		TerminalMatrix.purgeScreens( gds );
	}

	static render( params )
	{
		this.context.className = 'terminal-wrap-custom term-f-size-' + params.fontSize;

		const {hideMenu} = params;

		const p = {
			hideMenu,
			gds 			: params.gdsObj['name'],
			canCreatePq 	: params.gdsObj.canCreatePq,
			sessionIndex  	: params.gdsObj.sessionIndex,
			activeTerminal 	: params.gdsObj.activeTerminal,
			cellMatrix		: params.gdsObj.matrix,
			containerWidth	: this.context.clientWidth
		};

		Wrapper.render( p );
	}
}