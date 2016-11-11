'use strict';

import Terminal from './components/terminal';

let apiData = window.apiData || {};

let Context		= {
	init()
	{
		let rootId = apiData.htmlRootId || 'rootTerminal';
		Terminal.render( rootId );

		if (apiData.styleSheets)
			require( '../../sabre/public/main.css' )
	},

	createTerminal()
	{
		Terminal.add();
	}
};

Context.init();
Context.createTerminal();
