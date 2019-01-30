
import {getBindingForKey} 		from '../helpers/keyBinding';
import {CHANGE_ACTIVE_TERMINAL} from "../actions/settings";
import {DEV_CMD_STACK_RUN} from "../actions";
import {CHANGE_GDS, UPDATE_CUR_GDS} from "../actions/gdsActions";
import {GDS} 			from '../modules/gds';
import ContainerMain 	from "../containers/main";
import {PqParser} 		from "../modules/pqParser";
import {OFFSET_DEFAULT} from "../constants";
import {connect, getStore} from "../store";

const BORDER_SIZE = 2;

/**
 * hierarchy goes as follows:
 * GdsDirectPlusApp.es6 (exposes the API to app user)
 *   GDS in gds.es6 (represents a GDS list)
 *     GDS_UNIT in gdsUnit.es6 (represents a single GDS)
 *       Terminal in terminal.es6 (represents a single window in the matrix, visual part)
 *         TerminalPlugin in plugin.es6 (wrapper around jquery terminal with keybinds and stuff)
 *           Session in session.es6 (implements cmd perform() stack)
 */
export default class GdsDirectPlusApp
{
	/**
	 * @param viewData = await require('UserController.es6').getView()
	 */
	constructor(params, viewData, themeData)
	{
		const {htmlRootDom, PqPriceModal, travelRequestId} = params;

		// should not be needed anymore anywhere actually...
		let isStandAlone = !travelRequestId;

		this.params 		= {travelRequestId, isStandAlone};
		this.offset			= OFFSET_DEFAULT; //menu
		this.pqParser 		= new PqParser(PqPriceModal);
		this.container 		= new ContainerMain(htmlRootDom);

		const terminalThemes = themeData.terminalThemes;
		const {settings, buffer, auth} = viewData;
		window.GdsDirectPlusParams.auth = auth;

		const { keyBindings, defaultPccs, gdsAreaSettings }	= this._getGdsDefaultSettings(settings);

		this.Gds 	= new GDS({
			gdsListDb 	: settings.gds,
			activeName 	: settings['common']['currentGds'] || 'apollo',
			buffer 		: buffer || {}
		});

		connect(this);

		const curGds 		= settings['gds'][settings['common']['currentGds'] || 'apollo'];
		const fontSize		= curGds['fontSize'] || 1;
		const language		= curGds['language'] || 'APOLLO';
		this.container.changeFontClass(fontSize);

		this.themeId		= this._getStyle(settings.gds, terminalThemes);

		getStore().updateView({
			requestId		: travelRequestId,
			isAdmin			: viewData.isAdmin,
			useRbs			: !viewData.isAdmin,
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

		// set current PCC on each area button
		for (let [gds, data] of Object.entries(settings.gds)) {
			let updateArea = (area) => UPDATE_CUR_GDS({
				canCreatePqErrors: [],
				area: area,
				pcc: (data.fullState.areas[area] || {}).pcc,
				canCreatePq: (data.fullState.areas[area] || {}).can_create_pq,
				recordLocator: (data.fullState.areas[area] || {}).record_locator,
				startNewSession: false,
				gdsName: gds,
			});
			for (let area of Object.keys(data.fullState.areas || {})) {
				updateArea(area); // set data of each area
			}
			updateArea(data.fullState.area); // set current area
		}
	}

	set(key, val)
	{
		this.params[key] = val;
	}

	// used by Component framework
	changeStyle(id)
	{
		this.container.changeStyle(id);
	}

	_getStyle(settings, terminalThemes)
	{
		if (!this.themeId)
		{
			const themeId = settings && settings[this.Gds.name] && settings[this.Gds.name].theme
				? settings[this.Gds.name].theme
				: 4; // 4  Apollo Default
			this.themeId = themeId;
			this.container.changeStyle(this.themeId);
		}

		return this.themeId;
	}

	_getGdsDefaultSettings(allSettings)
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

	// used by Component framework
	calculateMatrix()
	{
		if (this.container.context.offsetParent === null) {
			// terminal tab is hidden, can't recalculate since clientWidth will be 0
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

	// used by CMS - when agent presses on a record locator in PQ list
	runPnr({pnrCode, gdsName = 'apollo'})
	{
		if (pnrCode)
		{
			CHANGE_GDS(gdsName);
			CHANGE_ACTIVE_TERMINAL({curTerminalId : 0});
			DEV_CMD_STACK_RUN('*' + pnrCode);
		}
	}

	// TODO: it should take the itinerary, not it's id in CMS
	// used by CMS - when agent presses on a "GDS Direct" logo in PQ list
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