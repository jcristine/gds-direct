const Pccs = require('../Repositories/Pccs.js');
const RepriceInPccMix = require('./RepriceInPccMix.js');
const GdsSession = require('../GdsHelpers/GdsSession.js');
const AddMpRemark = require('./AddMpRemark.js');
const GetCurrentPnr = require('./GetCurrentPnr.js');

const {fetchAll, wrap, extractTpTabCmds} = require('../GdsHelpers/TravelportUtils.js');
const ApoRunCmdRq = require("../Transpiled/Rbs/GdsDirect/Actions/Apollo/RunCmdRq.js");
const SabRunCmdRq = require("../Transpiled/Rbs/GdsDirect/Actions/Sabre/RunCmdRq.js");
const GalRunCmdRq = require("../Transpiled/Rbs/GdsDirect/Actions/Galileo/RunCmdRq.js");
const AmaRunCmdRq = require("../Transpiled/Rbs/GdsDirect/Actions/Amadeus/RunCmdRq.js");
const ApoCommandParser = require("gds-utils/src/text_format_processing/apollo/commands/CmdParser");
const SabCommandParser = require("gds-utils/src/text_format_processing/sabre/commands/CmdParser");
const GalCommandParser = require("gds-utils/src/text_format_processing/galileo/commands/CmdParser");
const CommonDataHelper = require("../Transpiled/Rbs/GdsDirect/CommonDataHelper");
const CmsSabreTerminal = require("../Transpiled/Rbs/GdsDirect/GdsInterface/CmsSabreTerminal");
const CmsApolloTerminal = require("../Transpiled/Rbs/GdsDirect/GdsInterface/CmsApolloTerminal");
const GdsDialectTranslator = require('../CmdTranslation/RomanSereda/GdsDialectTranslator.js');
const Agents = require("../Repositories/Agents");
const GdsDirect = require("../Transpiled/Rbs/GdsDirect/GdsDirect");
const Rej = require("klesun-node-tools/src/Rej");
const TerminalSettings = require("../Transpiled/App/Models/Terminal/TerminalSettings");
const CommandCorrector = require("../CmdTranslation/RomanSereda/CommandCorrector");
const AliasParser = require("../CmdTranslation/AliasParser");
const TooManyRequests = require("klesun-node-tools/src/Rej").TooManyRequests;
const NotImplemented = require("klesun-node-tools/src/Rej").NotImplemented;
const {hrtimeToDecimal} = require('klesun-node-tools/src/Utils/Misc.js');
const _ = require('lodash');
const {coverExc} = require('klesun-node-tools/src/Lang.js');

/**
 * @param '$BN1|2*INF'
 * @return '$BN1+2*INF'
 */
const encodeTpCmdForCms = (cmd) =>
	cmd.replace(/\|/g, '+').replace(/@/g, '¤');

const decodeCmsInput = (cmd, gds) => {
	if (['apollo', 'galileo'].includes(gds)) {
		cmd = new CmsApolloTerminal().decodeCmsInput(cmd);
	} else if (gds === 'sabre') {
		cmd = new CmsSabreTerminal().decodeCmsInput(cmd);
	}
	return cmd;
};

const encodeTpOutputForCms = (dump) => {
	dump = dump.replace(/\|/g, '+').replace(/;/g, '·');
	dump = dump.replace(/\n?\)><$/, '\n└─>');
	dump = dump.replace(/><$/, '');
	return dump;
};

const isScreenCleaningCommand = (rec, gds) => {
	if (gds === 'apollo') {
		const type = rec.type || ApoCommandParser.parse(rec.cmd);
		return ['seatMap', 'changeArea', 'ignoreKeepPnr', 'reorderSegments'].includes(type)
			|| rec.cmd.startsWith('A')
			|| rec.cmd.startsWith('*')
			|| rec.cmd.startsWith('$')
			|| rec.cmd.startsWith('MDA')
			|| rec.cmd.startsWith('MT');
	} else if (gds === 'galileo') {
		const type = rec.type || GalCommandParser.parse(rec.cmd);
		const clearScreenTypes = [
			'seatMap', 'changeArea', 'ignoreKeepPnr', 'reorderSegments', 'airAvailability',
			// Apollo $... command analogs follow...
			'priceItinerary', 'fareRulesFromMenu', 'fareRulesMenuFromTariff', 'fareSearch',
			'routingFromTariff', 'showBookingClassOfFare',
		];
		return clearScreenTypes.includes(type)
			|| rec.cmd.startsWith('*')
			|| rec.cmd.startsWith('MDA');
	} else if (gds === 'sabre') {
		const type = rec.type || SabCommandParser.parse(rec.cmd);
		return ['seatMap', 'changeArea', 'ignoreKeepPnr', 'reorderSegments'].includes(type);
	} else {
		return false;
	}
};

const encodeCmdForCms = (gds, cmd) => {
	if (['galileo', 'apollo'].includes(gds)) {
		cmd = encodeTpCmdForCms(cmd);
	}
	return cmd;
};

const transformCalledCommand = (rec, stateful) => {
	if (!rec.cmd || !rec.output) {
		// mostly cases when Promise accidentally returned instead of cmd object
		const cls = ((rec || {}).constructor || {}).name;
		throw new Error('Invalid cmdRec format - ' + cls + ' - ' + JSON.stringify(rec));
	}
	const gds = stateful.gds;
	const agent = stateful.getAgent();
	let output = rec.output;
	const type = rec.type;
	let tabCommands = [];
	if (['galileo', 'apollo'].includes(gds)) {
		if (!rec.noWrap) {
			output = wrap(rec.output, gds);
		}
		output = encodeTpOutputForCms(output);
		tabCommands = extractTpTabCmds(rec.output);
	} else if (gds === 'amadeus') {
		// they are using past century macs apparently - with just \r as a line break...
		output = output.replace(/\r\n|\r/g, '\n');
		if (rec.hasMore) { // in case of /MDA with limit scrolling indicator gets removed
			output = output.replace('\s*$') + '\n└─>';
		}
	}
	if (!agent.canSeeContactInfo()) {
		output = CommonDataHelper.maskSsrContactInfo(output);
	}
	return {
		cmd: encodeCmdForCms(gds, rec.cmd),
		type: type,
		output: output,
		duration: rec.duration || null,
		clearScreen: isScreenCleaningCommand(rec, gds),
		tabCommands: tabCommands,
		scrolledCmd: rec.scrolledCmd ? encodeCmdForCms(gds, rec.scrolledCmd) : null,
	};
};

const translateCmd = (fromGds, toGds, inputCmd) => {
	const errors = [];
	const messages = [];
	const startHr = process.hrtime();
	let forTranslation = decodeCmsInput(inputCmd, fromGds);

	const corrected = CommandCorrector.correct(forTranslation, fromGds);
	errors.push(...(corrected.errors || []));
	messages.push(...(corrected.messages || []));
	if (corrected.output &&
		corrected.output !== forTranslation &&
		corrected.errors.length === 0
	) {
		forTranslation = corrected.output;
	}

	const translated = (new GdsDialectTranslator())
		.translate(fromGds, toGds, forTranslation);
	errors.push(...(translated.errors || []));
	messages.push(...(translated.messages || []));
	let resultCmd;
	if (translated.output) {
		resultCmd = translated.output;
	} else if (corrected.isAgnostic) {
		resultCmd = corrected.output;
	} else {
		// command not translated, likely because it was a native command
		resultCmd = decodeCmsInput(inputCmd, toGds);
	}
	return {
		cmd: resultCmd,
		messages: []
			.concat(errors.map(e => ({type: 'console_error', text: e})))
			.concat(messages.map(e => ({type: 'pop_up', text: e}))),
		translationTime: hrtimeToDecimal(process.hrtime(startHr)),
	};
};

const extendActions = async ({whenCmsResult, stateful}) => {
	const agent = stateful.getAgent();
	let didSavePnr = false;
	const prevState = stateful.getSessionData();
	stateful.addPnrSaveHandler(() => didSavePnr = true);
	const result = await whenCmsResult;
	const state = stateful.getSessionData();
	const isExpert = agent.hasGroup('Experts');
	const isNewPnr =
		!prevState.isPnrStored ||
		prevState.recordLocator &&
		prevState.recordLocator !== state.recordLocator;

	if (didSavePnr && state.isPnrStored && isNewPnr && isExpert) {
		const pnr = await GetCurrentPnr(stateful);
		const airlines = [...new Set(pnr.getItinerary().map(s => s.airline))];
		// there are some actions expert has to quickly perform right after PNR was created on
		// these airlines, that's why we were asked to disable the popup - to not slow them down
		const noPopupAirlines = _.intersection(airlines, ['MU', 'CA', 'SQ']);
		if (noPopupAirlines.length === 0 && airlines.length > 0) {
			result.actions.push({type: 'displayMpRemarkDialog', data: {airlines: airlines}});
		}
	}

	return result;
};

/**
 * auto-correct typos in the command, convert it between
 * GDS dialects, run _alias_ chain of commands, etc...
 *
 * by "local" I mean that it is bound to a set session in a set GDS
 *
 * @param stateful = require('StatefulSession.js')()
 * @param {{command: '*R'}} rqBody = at('MainController.js').normalizeRqBody()
 */
const RunLocalCmdRq = async ({
	stateful, cmdRq, dialect = null,
	AreaSettings = require("../Repositories/AreaSettings.js"),
	gdsClients = GdsSession.makeLoggingGdsClients({
		gds: stateful.getSessionRecord().context.gds,
		logId: stateful.getSessionRecord().logId,
	}),
}) => {
	const runByGds = async (cmdRqData) => {
		cmdRqData = {...cmdRqData, stateful, AreaSettings, gdsClients};
		let gdsResult;
		const gds = cmdRqData.stateful.gds;
		if (gds === 'apollo') {
			gdsResult = await ApoRunCmdRq(cmdRqData);
		} else if (gds === 'sabre') {
			gdsResult = await SabRunCmdRq(cmdRqData);
		} else if (gds === 'amadeus') {
			gdsResult = await AmaRunCmdRq(cmdRqData);
		} else if (gds === 'galileo') {
			gdsResult = await GalRunCmdRq(cmdRqData);
		} else {
			return NotImplemented('Unsupported GDS for runCmdRq() - ' + gds);
		}
		return gdsResult;
	};

	const runCmdRq =  async ({cmdRq}) => {
		let status = 'success';
		const messages = [];
		const actions = [];
		const calledCommands = [];

		const parsedAlias = await AliasParser.parse(cmdRq, stateful);
		if (parsedAlias.type === 'addMpRemark') {
			return AddMpRemark({stateful, airline: parsedAlias.data.airline});
		} else if (parsedAlias.type === 'priceAll' && parsedAlias.data.isMix) {
			const aliasData = {...parsedAlias.data, dialect: 'apollo', baseCmd: '$BB'};
			return RepriceInPccMix({stateful, aliasData, gdsClients});
		}

		const bulkCmdRecs = parsedAlias.type !== 'bulkCmds'
			? [parsedAlias] : parsedAlias.data.bulkCmdRecs;

		for (const cmdRec of bulkCmdRecs) {
			cmdRec.cmdRq = cmdRec.cmdRq.trim();
			let running = runByGds({stateful, ...cmdRec})
				.catch(exc => Rej.NoContent.matches(exc.httpStatusCode)
					? {	userMessages: [exc + ''],
						status: GdsDirect.STATUS_EXECUTED,
					} : Promise.reject(exc));
			if (bulkCmdRecs.length > 1) {
				running = running.catch(exc => ({
					status: GdsDirect.STATUS_FORBIDDEN,
					userMessages: ['' + exc],
					calledCommands: stateful.flushCalledCommands(),
				}));
			}
			const gdsResult = await running;
			const isSuccess = gdsResult.status === GdsDirect.STATUS_EXECUTED;
			messages.push(...(gdsResult.messages || []));
			messages.push(...(gdsResult.userMessages || [])
				.map(msg => ({type: isSuccess ? 'info' : 'error', text: msg})));
			actions.push(...(gdsResult.actions || []));
			calledCommands.push(...(gdsResult.calledCommands || []));
			status = gdsResult.status || '(no status)';
			if (status !== GdsDirect.STATUS_EXECUTED) {
				break;
			}
			stateful.flushCalledCommands();
		}
		return {status, messages, actions, calledCommands};
	};

	const getDefaultPcc = async (area, stateful) => {
		const gds = stateful.gds;
		const agent = stateful.getAgent();
		const agentId = agent.getId();
		const allowedPccs = agent.getAllowedPccRecs()
			.filter(r => r.gds === gds)
			.map(r => r.pcc);
		const areaSettings = await AreaSettings.getByAgent(agentId);
		let configPcc = areaSettings
			.filter(r => r.area === area && r.gds === stateful.gds)
			.map(r => r.defaultPcc)[0];

		configPcc = configPcc || TerminalSettings.getForcedStartPcc(gds, area);
		if (allowedPccs.length > 0 &&
			!allowedPccs.includes(configPcc)
		) {
			configPcc = allowedPccs[0];
		}
		return configPcc;
	};

	/**
	 * if no PCC is currently active - emulate into the
	 * one specified in user config for this work area
	 */
	const ensureFittingPcc = async (stateful) => {
		const areaState = stateful.getSessionData();
		if (!areaState.cmdCnt || !areaState.pcc) {
			const defaultPcc = await getDefaultPcc(areaState.area, stateful);
			if (defaultPcc && defaultPcc !== areaState.pcc) {
				const cmdRq = translateCmd('apollo', stateful.gds, 'SEM/' + defaultPcc + '/AG').cmd;
				return runCmdRq({cmdRq}).catch(coverExc(Rej.list, exc => ({
					// show the PCC emulation error, but still continue
					// with normal flow to not hang in "Invalid PCC" state
					messages: [{type: 'error', text: 'PCC ' + defaultPcc + ' not emulated - ' + exc}],
				})));
			}
		}
		return {calledCommands: [], messages: []};
	};

	const processNormalized = async ({stateful, cmdRq}) => {
		const prePccResult = await ensureFittingPcc(stateful);
		const rbsResult = await runCmdRq({cmdRq, stateful});
		const postPccResult = await ensureFittingPcc(stateful); // if this command changed area

		return {...rbsResult,
			calledCommands: []
				.concat(prePccResult.calledCommands || [])
				.concat(rbsResult.calledCommands || [])
				.concat(postPccResult.calledCommands || [])
				.map(r => transformCalledCommand(r, stateful)),
			messages: []
				.concat(prePccResult.messages || [])
				.concat(rbsResult.messages || [])
				.concat(postPccResult.messages || []),
		};
	};

	const execute = async () => {
		const gds = stateful.gds;
		const translated = translateCmd(dialect || gds, gds, cmdRq);
		const cmdRqNorm = translated.cmd;

		const callsLimit = stateful.getAgent().getUsageLimit();
		if (callsLimit) {
			const callsUsed = await Agents.getGdsDirectCallsUsed(stateful.getAgent().getId());
			if (+callsUsed >= +callsLimit) {
				return TooManyRequests('You exhausted your GDS Direct usage limit for today (' + callsUsed + ' >= ' + callsLimit + ')');
			}
		}
		let whenCmsResult = processNormalized({
			stateful, cmdRq: cmdRqNorm,
		}).then(cmsResult => ({...cmsResult,
			messages: (translated.messages || [])
				.concat(cmsResult.messages || []),
		}));
		whenCmsResult = extendActions({whenCmsResult, stateful});

		return whenCmsResult;
	};

	return execute();
};

module.exports = RunLocalCmdRq;
