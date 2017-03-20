'use strict';

import Container from './components/container';

let apiData = window.apiData || {};

let Context		= {

	init()
	{
		let rootId = apiData.htmlRootId || 'rootTerminal';
		Container.render( rootId );

		//if (apiData.styleSheets)
		//	require( '../../sabre/public/main.css' );

		Container.attachTerminals();
	},

	createTerminal()
	{
		Container.attachTerminals();
	}
};

Context.init();