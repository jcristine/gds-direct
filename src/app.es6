import {setLink}				from './helpers/requests.es6';
import {CHANGE_ACTIVE_TERMINAL} from "./actions/settings";
import {DEV_CMD_STACK_RUN} from "./actions";
import {CHANGE_GDS} from "./actions/gdsActions";

import {GDS} 			from './modules/gds';
import ContainerMain 	from "./containers/main";
import {PqParser} 		from "./modules/pqParser";
import {cookieGet, cookieSet} from "./helpers/cookie";
import './theme/main.less';
import {OFFSET_DEFAULT} from "./constants";

import {connect, getStore} from "./store";

const BORDER_SIZE = 2;

class TerminalApp
{
	constructor(params)
	{
		const {settings, requestId, buffer, permissions, PqPriceModal, htmlRootId, agentId, terminalThemes, commandUrl} = params;

		this.Gds 	= new GDS({
			gdsListDb 	: settings.gds,
			activeName 	: settings['common']['currentGds'] || 'apollo',
			buffer 		: buffer || {}
		});

		this.params 		= {requestId, permissions};
		this.offset			= OFFSET_DEFAULT; //menu

		this.pqParser 		= new PqParser(PqPriceModal);
		this.container 		= new ContainerMain(htmlRootId);

		this.agentId 		= agentId;
		this.themeId		= this.getStyle(agentId, terminalThemes);

		setLink( commandUrl );
		initGlobEvents();

		connect(this);

		const curGds 		= settings['gds'][settings['common']['currentGds'] || 'apollo'];
		const fontSize		= curGds['fontSize'] || 1;
		const language		= curGds['language'] || 'apollo';
		this.container.changeFontClass(fontSize);

		getStore().updateView({
			requestId		: requestId,
			permissions 	: permissions,
			terminalThemes	: terminalThemes,
			fontSize		: fontSize,
			language		: language,
			theme			: this.themeId,
			gdsObjName		: this.Gds.getCurrentName(),
			gdsObjIndex 	: this.Gds.getCurrentIndex()
		});
	}

	changeStyle(id)
	{
		cookieSet('terminalTheme_' + this.agentId, id, 30);
		this.container.changeStyle(id);
	}

	getStyle(agentId, terminalThemes)
	{
		if (!this.themeId)
		{
			this.themeId = cookieGet('terminalTheme_' + agentId) || terminalThemes[0]['id'];
			this.container.changeStyle(this.themeId);
		}

		return this.themeId;
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

		resizeTimeout = setTimeout( () => getStore().updateView(), 10 );
	};
};