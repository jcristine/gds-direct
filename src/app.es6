import {setLink}				from './helpers/requests.es6';
import {CHANGE_ACTIVE_TERMINAL, CHANGE_GDS, DEV_CMD_STACK_RUN, INIT, UPDATE_STATE} from "./actions";

import {GDS} 			from './modules/gds';
import ContainerMain 	from "./containers/main";
import {PqParser} 		from "./modules/pqParser";
import {cookieGet, cookieSet} from "./helpers/cookie";
import {GDS_LIST} from "./constants";
import './theme/main.less';

const BORDER_SIZE = 2;

class TerminalApp
{
	constructor({settings, requestId, buffer, permissions, PqPriceModal, htmlRootId, agentId, terminalThemes, commandUrl})
	{
		this.gdsList = GDS_LIST;

		this.Gds 	= new GDS({
			gdsList 	: settings.gds,
			activeName 	: settings['common']['currentGds'] || 'apollo',
			buffer 		: buffer || {},
			gdsSet		: GDS_LIST
		});

		this.params = { requestId, permissions, terminalThemes};

		this.agentId		= agentId;
		this.offset			= 100; //menu

		this.pqParser 		= new PqParser(PqPriceModal);
		this.container 		= new ContainerMain(htmlRootId);

		this.curTheme		= cookieGet('terminalTheme_' + agentId) || (terminalThemes[0]['id']);
		this.changeStyle(this.curTheme);

		setLink( commandUrl );
		INIT(this);

		initGlobEvents();
	}

	changeStyle( name )
	{
		cookieSet('terminalTheme_' + this.agentId, name, 30);
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

	/*calculateMatrix2()
	{
		const {rows, cells} = this.Gds.getCurrent().get('matrix');
		const hasWide 		= this.Gds.getCurrent().get('hasWide');

		const char 			= this.getCharLength();
		const rowsSize 		= rows + 1;

		const height 	= ( this.container.context.clientHeight / rowsSize );// - (rowsSize * 2);
		const width 	= Math.floor( 	(this.container.context.clientWidth - this.getOffset()) / (cells + (hasWide ? 2 : 1) ) );

		const numOf 	= {
			numOfRows 	: Math.floor( height / char.height ),
			numOfChars	: Math.floor( (width - 2) 	/ char.width )
		};

		const dimensions = {
			char,
			numOf,
			terminalSize : {
				width 	: width,
				height 	: (numOf.numOfRows * char.height) + 2
			},
			parent 	: {
				height	: this.container.context.clientHeight,
				width 	: (this.container.context.clientWidth - this.getOffset())
			}
		};

		this.Gds.updateMatrix(dimensions);

		if (hasWide)
		{
			this.calculateHasWide( dimensions );
		}

		return this;
	}*/

	calculateMatrix()
	{
		const {matrix, hasWide} = this.Gds.getCurrent().get();
		const {rows, cells} 	= matrix;

		const char 			= this.getCharLength();

		const height		= Math.floor((this.container.context.clientHeight) / (rows + 1) );
		const width 		= Math.floor((this.container.context.clientWidth - this.getOffset()) / (cells + (hasWide ? 2 : 1) ) );

		const numOf = {
			numOfRows 	: Math.floor( (height - BORDER_SIZE)	/ char.height ),
			numOfChars	: Math.floor( (width - BORDER_SIZE) 	/ char.width ) - 2 // 2 - FORGOT ABOUT SCROLL
		};

		const dimensions = {
			char,
			numOf,

			terminalSize 	: {
				width 	: width,
				height 	: (numOf.numOfRows * char.height) + BORDER_SIZE
			},

			parent 			: {
				height	: this.container.context.clientHeight,
				width 	: this.container.context.clientWidth - this.getOffset()
			}
		};

		this.Gds.updateMatrix(dimensions);

		if (hasWide)
		{
			this.calculateHasWide(dimensions, rows);
		}

		return this;
	}

	calculateHasWide(dimensions, rows)
	{
		const numOfRows = Math.floor( (dimensions.parent.height - 2) / dimensions.char.height );
		const height 	= (dimensions.terminalSize.height * (rows + 1));

		const wideDimensions = {
			char 			: dimensions.char,

			numOf 			: {
				numOfRows 	: numOfRows,
				numOfChars	: dimensions.numOf.numOfChars
			},

			terminalSize	: {
				width  	: dimensions.terminalSize.width,
				height  : height
			}
		};

		this.Gds.update({wideDimensions});
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

	rebuild({data, gdsName = 'apollo'})
	{
		if (data)
		{
			CHANGE_GDS(gdsName);
			CHANGE_ACTIVE_TERMINAL({curTerminalId : 0});
			DEV_CMD_STACK_RUN('REBUILD/' + data.itineraryId + '/' + data.segmentStatus + '/' + data.seats);
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