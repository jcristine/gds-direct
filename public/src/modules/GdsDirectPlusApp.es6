
import {CHANGE_ACTIVE_TERMINAL} from "../actions/settings";
import {DEV_CMD_STACK_RUN} from "../actions";
import {CHANGE_GDS, UPDATE_CUR_GDS, UPDATE_ALL_AREA_STATE} from "../actions/gdsActions";
import {GdsSwitch} 			from './GdsSwitch';
import {ContainerMain, normalizeThemeId} from "../containers/main";
import {PqParser} 		from "../modules/pqParser";
import {OFFSET_DEFAULT, AREA_LIST} from "../constants";
import {connect, getStore} from "../store";
import $ from 'jquery';
const {post} = require('../helpers/requests.es6');
import {CHANGE_INPUT_LANGUAGE} from "../actions/settings";
import {setMessageFromServerHandler} from './../helpers/socketIoWrapper.js';
import {notify} from './../helpers/debug.es6';
import {LeadList} from '../components/reusable/LeadList.js';
import PricePccMixList from '../components/popovers/PricePccMixList.es6';
import promptForTicketedPnrCancelConfirm from "../components/popovers/promptForTicketedPnrCancelConfirm";
import TariffPccMixList from "../components/popovers/TariffPccMixList";

const BORDER_SIZE = 2;

const chooseLeadFromList = (plugin) => new Promise((resolve, reject) => {
	const {remove} = plugin.injectDom({
		dom: new LeadList(leadId => {
			remove();
			resolve(leadId);
		}).context,
		onCancel: reject,
	});
});

const toHandleMessageFromServer = (gdsSwitch) => {
	return (data, reply) => {
		// maybe should move to separate module and add list suggestions for lead id
		if (data.messageType === 'promptForLeadId') {
			let plugin = gdsSwitch.getActivePlugin();
			if (plugin) {
				chooseLeadFromList(plugin)
					.then(leadId => reply({leadId}))
					.catch(exc => reply({leadId: null, error: exc + ''}));
			} else {
				let leadId = prompt('Enter Lead ID:');
				if (leadId !== null && !leadId.match(/^\d{6,}[02468]$/)) {
					notify({msg: 'Invalid lead id - ' + leadId});
					leadId = null;
				}
				reply({leadId: leadId});
			}
		} else if (data.messageType === 'promptForTicketedPnrCancelConfirm') {
			const plugin = gdsSwitch.getActivePlugin();
			promptForTicketedPnrCancelConfirm(plugin, data)
				.then(({status}) => reply({value: ({status})}))
				.catch(exc => reply({error: exc + '', value: ({
					stack: (exc || {}).stack, ...(exc || {})}),
				}));
		} else if (data.messageType === 'displayPriceMixPccRow') {
			PricePccMixList.displayPriceMixPccRow(data);
			reply({value: {status: 'done'}});
		} else if (data.messageType === 'displayTariffMixPccRow') {
			const plugin = gdsSwitch.getActivePlugin();
			TariffPccMixList.displayTariffMixPccRow(plugin, data);
			reply({value: {status: 'done'}});
		} else {
			console.error('could not interpret message triggered by server', data);
			reply({
				error: 'Unexpected message from server - ' + data.messageType + ', you may need to reload page twice',
				value: {status: 'unknownMessageType', data},
			});
		}
	};
};

/**
 * hierarchy goes as follows:
 * GdsDirectPlusApp.es6 (exposes the API to app user)
 *   GdsSwitch in gds.es6 (represents a GDS list)
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
		const {htmlRootDom, PqPriceModal, travelRequestId, chatContainerId} = params;
		const terminalThemes = themeData.terminalThemes;
		const {settings, buffer, auth} = viewData;

		htmlRootDom.classList.add('gds-direct-plus-root');

		this.params 		= {travelRequestId};
		this.chatContainer	= document.getElementById(chatContainerId || 'chat-plugin-container');
		this.offset			= OFFSET_DEFAULT; //menu
		this.container 		= new ContainerMain({htmlRootDom, terminalThemes});

		window.GdsDirectPlusParams.auth = auth;

		const { keyBindings, gdsAreaSettings }	= this._getGdsDefaultSettings(settings);

		let gdsSwitch = new GdsSwitch({
			gdsListDb 	: settings.gds,
			activeName 	: settings['common']['currentGds'] || 'apollo',
			buffer 		: buffer || {},
		});
		this.gdsSwitch = gdsSwitch;
		if (PqPriceModal) {
			this.pqParser = new PqParser(PqPriceModal, gdsSwitch);
		}

		let handleMessageFromServer = toHandleMessageFromServer(gdsSwitch);
		setMessageFromServerHandler(handleMessageFromServer);
		connect(this);

		const curGds 		= settings['gds'][settings['common']['currentGds'] || 'apollo'];
		const fontSize		= curGds['fontSize'] || 1;
		const language		= curGds['language'] || 'APOLLO';
		let agentCustomSettings = settings.agentCustomSettings || {};
		this.container.setDisableTextWrap(agentCustomSettings.disableTextWrap || false);
		this.container.changeFontClass(fontSize);

		this.themeId		= this._getStyle(settings.gds, terminalThemes);

		getStore().updateView({
			requestId		: travelRequestId,
			roles			: viewData.auth.roles,
			terminalThemes	: terminalThemes,
			fontSize		: fontSize,
			disableTextWrap : agentCustomSettings.disableTextWrap || false,
			language		: language,
			theme			: this.themeId,
			gdsObjName		: this.gdsSwitch.getCurrentName(),
			gdsObjIndex 	: this.gdsSwitch.getCurrentIndex(),
			keyBindings		: keyBindings,
			gdsAreaSettings	: gdsAreaSettings,
		});

		// set current PCC on each area button
		for (let [gds, data] of Object.entries(settings.gds)) {
			UPDATE_ALL_AREA_STATE(gds, data.fullState);
		}

		let queryObj = new URLSearchParams(window.location.search);
		this.initFromQuery(queryObj);

		// without that, when you hover on a highlighted
		// text, scroll will jump to the bottom...
		getStore().updateView();

		// ping EMC session every 10 minutes to avoid state where
		// CMS session is still alive, but GDSD session expired
		let keepAliveEmcInterval = setInterval(() => {
			post('/keepAliveEmc', {skipErrorPopup: true})
				.catch(exc => clearInterval(keepAliveEmcInterval));
		}, 10 * 60 * 1000);
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
			const themeId = settings && settings[this.gdsSwitch.name] && settings[this.gdsSwitch.name].theme
				? settings[this.gdsSwitch.name].theme
				: 4; // 4  Apollo Default
			this.themeId = normalizeThemeId(themeId, terminalThemes);
			this.container.changeStyle(this.themeId);
		}

		return this.themeId;
	}

	_getGdsDefaultSettings(allSettings)
	{
		const settings = {
			keyBindings: {},
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
							autorun: parseInt(data.autorun),
						});
					}
					parsedKeyBindings[key] = c;
				});
			}

			allSettings.gds[gds].keyBindings = parsedKeyBindings; // It's bad to do like this, I know

			settings.keyBindings[gds] = parsedKeyBindings;
			settings.gdsAreaSettings[gds] = gdsSettings.areaSettings;
		});

		return settings;
	}

	/** @return {ContainerMain} */
	getContainer()
	{
		return this.container;
	}

	getGds()
	{
		return this.gdsSwitch.getCurrent();
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
		this.moveChatContainer(value);
		this.offset = value;
	}

	moveChatContainer(value)
	{
		if (this.chatContainer)	{
			this.chatContainer.style.right = ((value || 60) + 11) + 'px';
		}
	}

	// used by Component framework
	calculateMatrix()
	{
		let isVisible = this.container.context.offsetParent !== null;
		if (!isVisible) {
			// terminal tab is hidden, can't recalculate since clientWidth will be 0
			return;
		}

		const {matrix, hasWide} = this.gdsSwitch.getCurrent().get();
		const {rows, cells} 	= matrix;

		const char 			= this.getCharLength();

		const rRows = rows + 1;

		let appHeight = this.container.context.clientHeight;
		let appWidth = this.container.context.clientWidth;

		appHeight = Math.max(appHeight, 200);

		const height		= Math.floor(appHeight / rRows); // - (BORDER_SIZE * rRows) );
		const width 		= Math.floor((appWidth - this.getOffset()) / (cells + (hasWide ? 2 : 1) ) );

		const numOf = {
			numOfRows 	: Math.floor( (height - BORDER_SIZE)	/ char.height ),
			numOfChars	: Math.floor( (width - BORDER_SIZE) 	/ char.width ) - 2, // 2 - FORGOT ABOUT SCROLL
		};

		const dimensions = {
			char,
			numOf,

			terminalSize 	: {
				width 	: width - BORDER_SIZE,
				height 	: (numOf.numOfRows * char.height), //- BORDER_SIZE
			},

			parent 			: {
				height	: this.container.context.clientHeight,
				width 	: this.container.context.clientWidth - this.getOffset(),
			},
		};

		dimensions['leftOver'] = {
			height : Math.floor(   ( this.container.context.clientHeight - ((dimensions.terminalSize.height + BORDER_SIZE) * rRows)  ) / rRows ),
		};

		this.gdsSwitch.updateMatrix(dimensions);

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
			terminalSize  	: {...dimensions.terminalSize},
		};

		wideDimensions.numOf.numOfRows 		= Math.floor( (dimensions.parent.height - BORDER_SIZE) / dimensions.char.height );
		wideDimensions.terminalSize.height 	= wideDimensions.numOf.numOfRows * dimensions.char.height;
		wideDimensions['leftOver'] 			= {
			height : Math.floor(this.container.context.clientHeight - (wideDimensions.terminalSize.height + BORDER_SIZE)),
		};

		this.gdsSwitch.update({wideDimensions});
	}

	_changePcc(gds, pcc) {
		if (pcc) {
			let cmd = {
				apollo: 'SEM/' + pcc + '/AG',
				sabre: 'AAA' + pcc,
				amadeus: 'JUM/O-' + pcc,
				galileo: 'SEM/' + pcc + '/AG',
			}[gds || 'apollo'];
			DEV_CMD_STACK_RUN(cmd);
		}
	}

	_changeArea(gds, area) {
		if (area) {
			let cmd = {
				apollo: 'S' + area,
				sabre: '¤' + area,
				amadeus: 'JM' + area,
				galileo: 'S' + area,
			}[gds || 'apollo'];
			DEV_CMD_STACK_RUN(cmd);
		}
	}

	_openPnr(gds, recordLocator) {
		if (recordLocator) {
			let cmd = gds === 'amadeus' ? 'RT' + recordLocator : '*' + recordLocator;
			DEV_CMD_STACK_RUN(cmd);
		}
	}

	// used by CMS - when agent presses on a record locator in PQ list
	runPnr({pnrCode, gdsName = 'apollo'})
	{
		if (pnrCode)
		{
			CHANGE_GDS(gdsName);
			CHANGE_ACTIVE_TERMINAL({curTerminalId : 0});
			this._openPnr(gdsName, pnrCode);
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

	/**
	 * could be used for example if you wish to show some text
	 * to agent in one of the cells, like PNR dump to an expert
	 * @param terminalId - 0 is the top-left window, 4 is the
	 *          most left window on the second row, and so on...
	 */
	preEnterCommand({cmd, terminalId = 0, gds = null, pcc = null}) {
		if (gds) {
			CHANGE_GDS(gds);
			CHANGE_ACTIVE_TERMINAL({curTerminalId : 0});
		}
		this._changePcc(gds, pcc);

		let prevTermId = getStore().app.gdsSwitch.getCurrent().props.curTerminalId;
		if (!getStore().app.gdsSwitch.getCurrent().props.matrix.list.includes(terminalId)) {
			// TODO: extend cells if terminalId is out of bounds
			terminalId = 0;
		}
		getStore().app.gdsSwitch.changeActive(terminalId);
		getStore().app.gdsSwitch.getActivePlugin().terminal.set_command(cmd);
		getStore().app.gdsSwitch.changeActive(prevTermId);
	}

	/** @param {URLSearchParams} queryObj */
	initFromQuery(queryObj) {
		let gds = queryObj.get('gds');
		let pcc = queryObj.get('pcc');
		let recordLocator = queryObj.get('pnr');
		let area = queryObj.get('area');
		let language = queryObj.get('language');
		let terminal = queryObj.get('terminal');

		if (gds) {
			CHANGE_GDS(gds);
			CHANGE_ACTIVE_TERMINAL({curTerminalId : 0});
		}
		if (terminal) {
			CHANGE_ACTIVE_TERMINAL({curTerminalId : terminal});
		}
		if (language) {
			CHANGE_INPUT_LANGUAGE(language);
		}
		this._changeArea(gds, area);
		this._changePcc(gds, pcc);
		this._openPnr(gds, recordLocator);
	}
}
