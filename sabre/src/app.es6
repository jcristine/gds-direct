import {setLink}				from './helpers/requests.es6';
import {getBindingForKey} 		from './helpers/keyBinding';
import {CHANGE_ACTIVE_TERMINAL} from "./actions/settings";
import {DEV_CMD_STACK_RUN} from "./actions";
import {CHANGE_GDS} from "./actions/gdsActions";

import {GDS} 			from './modules/gds';
import ContainerMain 	from "./containers/main";
import {PqParser} 		from "./modules/pqParser";
import './theme/main.less';
import {OFFSET_DEFAULT} from "./constants";

import {connect, getStore} from "./store";

const BORDER_SIZE = 2;

class TerminalApp
{
	constructor(params)
	{
		const {settings, requestId, isStandAlone, buffer, permissions, PqPriceModal, htmlRootId, agentId, terminalThemes, commandUrl} = params;

		const { keyBindings, defaultPccs, gdsAreaSettings }	= this.getGdsDefaultSettings(settings);

		this.Gds 	= new GDS({
			gdsListDb 	: settings.gds,
			activeName 	: settings['common']['currentGds'] || 'apollo',
			buffer 		: buffer || {}
		});

		this.params 		= {requestId, permissions, isStandAlone};
		this.offset			= OFFSET_DEFAULT; //menu

		this.pqParser 		= new PqParser(PqPriceModal);
		this.container 		= new ContainerMain(htmlRootId);

		this.agentId 		= agentId;

		setLink( commandUrl );
		initGlobEvents();

		connect(this);

		const curGds 		= settings['gds'][settings['common']['currentGds'] || 'apollo'];
		const fontSize		= curGds['fontSize'] || 1;
		const language		= curGds['language'] || 'APOLLO';
		this.container.changeFontClass(fontSize);

		this.themeId		= this.getStyle(settings.gds, terminalThemes);

		getStore().updateView({
			requestId		: requestId,
			permissions 	: permissions,
			terminalThemes	: terminalThemes,
			fontSize		: fontSize,
			language		: language,
			theme			: this.themeId,
			gdsObjName		: this.Gds.getCurrentName(),
			gdsObjIndex 	: this.Gds.getCurrentIndex(),
			keyBindings		: keyBindings,
            gdsAreaSettings	: gdsAreaSettings,
			defaultPccs		: defaultPccs
		});
	}

	set(key, val)
	{
		this.params[key] = val;
	}

	changeStyle(id)
	{
		this.container.changeStyle(id);
	}

	getStyle(settings, terminalThemes)
	{
		if (!this.themeId)
		{
			const themeId = settings && settings[this.Gds.name] && settings[this.Gds.name].theme
				? settings[this.Gds.name].theme
				: terminalThemes[0]['id']
			this.themeId = themeId;
			this.container.changeStyle(this.themeId);
		}

		return this.themeId;
	}

	getGdsDefaultSettings(allSettings)
	{
		const settings = {
			keyBindings: {},
			defaultPccs: {},
			gdsAreaSettings: {},
		};

        settings.gdsAreaSettings = {};
		$.each(allSettings.gds, (gds, gdsSettings) => {
			const parsedKeyBindings = {};

			// Fix old key formatting
			if (gdsSettings.keyBindings) {
				$.each(gdsSettings.keyBindings, (key, data) => {
					let c = { command: '', autorun: 0 };
					if (typeof data === 'string') {
						c.command = data;
					} else {
						c = Object.assign({}, c, {
							command: data.command,
							autorun: parseInt(data.autorun)
						});
					}
					parsedKeyBindings[key] = c;
				});
			}

			allSettings.gds[gds].keyBindings = parsedKeyBindings; // It's bad to do like this, I know

			settings.keyBindings[gds] = parsedKeyBindings;
			settings.defaultPccs[gds] = gdsSettings.defaultPcc || null;
			settings.gdsAreaSettings[gds] = gdsSettings.areaSettings;
		});

		return settings;
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
		if (this.container.context.offsetParent === null) {
			// terminal tab is hidden, can't recalculate since clientWidth will be 0
			// TODO: should probably also trigger recalculate on tab change
			return;
		}

		const {matrix, hasWide} = this.Gds.getCurrent().get();
		const {rows, cells} 	= matrix;

		const char 			= this.getCharLength();

		const rRows = rows + 1;

		const height		= Math.floor(this.container.context.clientHeight / rRows); // - (BORDER_SIZE * rRows) );
		const width 		= Math.floor((this.container.context.clientWidth - this.getOffset()) / (cells + (hasWide ? 2 : 1) ) );

		const numOf = {
			numOfRows 	: Math.floor( (height - BORDER_SIZE)	/ char.height ),
			numOfChars	: Math.floor( (width - BORDER_SIZE) 	/ char.width ) - 2 // 2 - FORGOT ABOUT SCROLL
		};

		const dimensions = {
			char,
			numOf,

			terminalSize 	: {
				width 	: width - BORDER_SIZE,
				height 	: (numOf.numOfRows * char.height) //- BORDER_SIZE
			},

			parent 			: {
				height	: this.container.context.clientHeight,
				width 	: this.container.context.clientWidth - this.getOffset()
			}
		};

		dimensions['leftOver'] = {
			height : Math.floor(   ( this.container.context.clientHeight - ((dimensions.terminalSize.height + BORDER_SIZE) * rRows)  ) / rRows )
		};

		this.Gds.updateMatrix(dimensions);

		if (hasWide)
		{
			this.calculateHasWide(dimensions, rows);
		}

		return this;
	}

	calculateHasWide(dimensions)
	{
		const wideDimensions = {
			...dimensions,
			numOf  			: {...dimensions.numOf},
			terminalSize  	: {...dimensions.terminalSize}
		};

		wideDimensions.numOf.numOfRows 		= Math.floor( (dimensions.parent.height - BORDER_SIZE) / dimensions.char.height );
		wideDimensions.terminalSize.height 	= wideDimensions.numOf.numOfRows * dimensions.char.height;
		wideDimensions['leftOver'] 			= {
			height : Math.floor(this.container.context.clientHeight - (wideDimensions.terminalSize.height + BORDER_SIZE))
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

		// console.warn('on resize');

		// if (resizeTimeout)
		// {
		// 	clearInterval(resizeTimeout);
		// }

		getStore().updateView();
		// resizeTimeout = setTimeout( () => getStore().updateView(), 0 );
	};
};