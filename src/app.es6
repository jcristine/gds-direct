import {setLink}				from './helpers/requests.es6';
import {CHANGE_ACTIVE_TERMINAL, CHANGE_GDS, DEV_CMD_STACK_RUN, INIT, UPDATE_STATE} from "./actions";

import {GDS} 			from './modules/gds';
import ContainerMain 	from "./containers/main";
import {PqParser} 		from "./modules/pqParser";
import {cookieGet, cookieSet} from "./helpers/cookie";

class TerminalApp
{
	constructor(params)
	{
		this.params			= params;
		this.settings 		= params.settings;
		this.Gds 			= new GDS(params.settings.gds, params['buffer'], this.settings['common']['currentGds']);
		this.pqParser 		= new PqParser(params["PqPriceModal"]);
		this.offset			= 100; //menu

		this.container 		= new ContainerMain(params['htmlRootId']);

		setLink( params['commandUrl'] );
		INIT(this);

		initGlobEvents();
	}

	getContainer()
	{
		return this.container;
	}

	getGds()
	{
		return this.Gds.getCurrent();
	}

	getCharLength()
	{
		return this.container.getTempTerminal().getLineHeight();
	}

	getOffset()
	{
		return this.offset || 0;
	}

	setOffset(value)
	{
		this.offset = value;
	}

	calculateMatrix()
	{
		const {rows, cells} = this.Gds.getCurrent().get('matrix');
		const hasWide 		= this.Gds.getCurrent().get('hasWide');

		const sizes 	= {
			height		: Math.floor(	(this.container.context.clientHeight) / (rows + 1) ),
			width 		: Math.floor( 	(this.container.context.clientWidth - this.getOffset()) / (cells + (hasWide ? 2 : 1) ) ) ,
		};

		const dimensions = {
			char : this.getCharLength(),
			size : sizes,
			parent : {
				height	: this.container.context.clientHeight,
				width 	: (this.container.context.clientWidth - this.getOffset())
			}
		};

		this.Gds.updateMatrix(dimensions);

		return this;
	}
}

window.terminal = TerminalApp;

let resizeTimeout;

const initGlobEvents = () => {

	const exec_terminal = () =>	{
		const
			pnrCode = cookieGet('pnrCode'),
			gdsName = cookieGet('gdsName') || 'apollo';

		if (pnrCode)
		{
			cookieSet('pnrCode', '');
			cookieSet('gdsName', '');

			CHANGE_GDS(gdsName);
			CHANGE_ACTIVE_TERMINAL({curTerminalId : 0});
			DEV_CMD_STACK_RUN('*' + pnrCode);
		}
	};

	window.onresize = () => {

		if (resizeTimeout)
		{
			clearInterval(resizeTimeout);
		}

		resizeTimeout = setTimeout( () => UPDATE_STATE({}), 10 );
	};

	setTimeout(() => {

		window.onhashchange = () => {

			if (location.hash === "#terminalNavBtntab")
			{
				exec_terminal();
			}
		};

		exec_terminal();

	}, 300);

};