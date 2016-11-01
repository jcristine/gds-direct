'use strict';

import Terminal from './components/terminal';

// let Root 		= document.getElementById('root');
let Status 		= {};

let Context = {

	init() {
		Terminal.render()
	},

	createTerminal() {
		Status = {
			mainScreen : 1
		};

		Terminal.main();
	}
};

Context.init();
Context.createTerminal();