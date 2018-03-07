import {setLink}				from './helpers/requests.es6';
import {CHANGE_ACTIVE_TERMINAL, CHANGE_GDS, DEV_CMD_STACK_RUN, INIT, UPDATE_STATE} from "./actions";

import {GDS} 			from './modules/gds';
import ContainerMain 	from "./containers/main";
import {PqParser} 		from "./modules/pqParser";
import {cookieGet, cookieSet} from "./helpers/cookie";
import {THEME_CLASS_NAME} from "./constants";

class TerminalApp
{
	constructor(params)
	{
		this.params			= params;
		this.settings 		= params.settings;

		this.Gds 			= new GDS(params.settings.gds, params['buffer'], this.settings['common']['currentGds'], params.permissions);
		this.pqParser 		= new PqParser(params["PqPriceModal"]);

		this.offset			= 100; //menu

		this.container 		= new ContainerMain(params['htmlRootId']);

		const theme 		= cookieGet('terminalTheme_' + this.params.agentId);
		const themeName		= theme || THEME_CLASS_NAME + this.params.terminalThemes[0]['id'];
		this.changeStyle(themeName);

		setLink( params['commandUrl'] );
		INIT(this);

		initGlobEvents();
	}

	changeStyle( name )
	{
		cookieSet('terminalTheme_' + this.params.agentId, name, 30);
		this.container.changeStyle(name);
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

	runPnr({pnrCode, gdsName = 'apollo'})
	{
		if (pnrCode)
		{
			CHANGE_GDS(gdsName);
			CHANGE_ACTIVE_TERMINAL({curTerminalId : 0});
			DEV_CMD_STACK_RUN('*' + pnrCode);
		}
	}
}

window.terminal = TerminalApp;

let resizeTimeout;

const initGlobEvents = () => {

	window.onresize = () => {

		if (resizeTimeout)
		{
			clearInterval(resizeTimeout);
		}

		resizeTimeout = setTimeout( () => UPDATE_STATE({}), 10 );
	};
};