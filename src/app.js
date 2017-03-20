'use strict';

import Container from './components/container';

const apiData = window.apiData || {};

const Context = {
	init()
	{
		let rootId = apiData.htmlRootId || 'rootTerminal';
		Container.render( rootId );

		//if (apiData.styleSheets)
		//	require( '../../sabre/public/main.css' );

		//Container.attachTerminals();
	}
};

Context.init();