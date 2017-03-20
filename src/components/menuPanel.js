'use strict';

import History 	from './popovers/history';

let context;

context 			= document.createElement('aside');
context.className 	= 'sideMenu';

let parentContext;

function createBtn()
{
	let btn 		= document.createElement('button');
	btn.type		= 'button';
	btn.className 	= 'btn btn-primary';

	return btn;
}

export default class MenuPanel
{
	static toggle()
	{
		let btn 		= createBtn();
		btn.innerHTML 	= '<i class="fa fa-bars"></i>';

		btn.addEventListener('click', () => {
			parentContext.classList.toggle('minimized');
		});

		return btn;
	}

	static fontSize()
	{
		let btn 		= createBtn();
		btn.innerHTML 	= '<i class="fa fa-font"></i>';

		btn.addEventListener('click', () => {
			parentContext.classList.toggle('t-f-size-2x');
		});

		return btn;
	}

	static history()
	{
		let btn 		= createBtn();
		btn.innerHTML 	= '<i class="fa fa-history"></i>';

		let popover = new History({
			button	: btn
		});

		popover.build();

		return btn;
	}

	static settings()
	{
		let btn 		= createBtn();
		btn.innerHTML 	= '<i class="fa fa-gears"></i>';

		btn.addEventListener('click', () => {
		});

		return btn;
	}

	static activeSession()
	{
		let context 		= document.createElement('article');
		context.innerHTML 	= '<div class="label">Change Active Session</div>';

		[1,2,3].map(( value ) => {
			let button = document.createElement('button');
			button.className = 'btn btn-sm btn-purple';
			button.innerHTML = value;

			context.appendChild( button );
		});

		return context;

	}

	static PccLanguage()
	{
		let context 		= document.createElement('article');
		context.innerHTML 	= '<div class="label">Switch Language</div>';

		['sabre','apollo'].map(( value ) => {
			let button = document.createElement('button');
			button.className = 'btn btn-sm btn-purple';
			button.innerHTML = value;

			context.appendChild( button );
		});

		return context;
	}

	static build()
	{
		[
			MenuPanel.toggle(),
			MenuPanel.fontSize(),
			MenuPanel.history(),
			MenuPanel.settings(),

		].map(( button ) => {
			context.appendChild(
				button
			)
		});

		context.appendChild( this.activeSession() );
		context.appendChild( this.PccLanguage() );
	}

	static render( parent )
	{
		parentContext = parent;
		MenuPanel.build();
		return context;
	}

}
