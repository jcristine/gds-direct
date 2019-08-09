const AmadeusClient = require('../GdsClients/AmadeusClient.js');
const TravelportClient = require('../GdsClients/TravelportClient.js');
const GdsSession = require('../GdsHelpers/GdsSession.js');
const AddMpRemark = require('./AddMpRemark.js');
const GetCurrentPnr = require('./GetCurrentPnr.js');

let {fetchAll, wrap, extractTpTabCmds} = require('../GdsHelpers/TravelportUtils.js');
const ApoRunCmdRq = require("../Transpiled/Rbs/GdsDirect/Actions/Apollo/RunCmdRq.js");
const SabRunCmdRq = require("../Transpiled/Rbs/GdsDirect/Actions/Sabre/RunCmdRq.js");
const GalRunCmdRq = require("../Transpiled/Rbs/GdsDirect/Actions/Galileo/RunCmdRq.js");
const AmaRunCmdRq = require("../Transpiled/Rbs/GdsDirect/Actions/Amadeus/RunCmdRq.js");
const ApoCommandParser = require("../Transpiled/Gds/Parsers/Apollo/CommandParser");
const SabCommandParser = require("../Transpiled/Gds/Parsers/Sabre/CommandParser");
const GalCommandParser = require("../Transpiled/Gds/Parsers/Galileo/CommandParser");
const CommonDataHelper = require("../Transpiled/Rbs/GdsDirect/CommonDataHelper");
const CmsSabreTerminal = require("../Transpiled/Rbs/GdsDirect/GdsInterface/CmsSabreTerminal");
const CmsApolloTerminal = require("../Transpiled/Rbs/GdsDirect/GdsInterface/CmsApolloTerminal");
const GdsDialectTranslator = require('../Transpiled/Rbs/GdsDirect/DialectTranslator/GdsDialectTranslator.js');
const CmdResultAdapter = require('../Transpiled/App/Services/CmdResultAdapter.js');
const Agents = require("../Repositories/Agents");
const GdsDirect = require("../Transpiled/Rbs/GdsDirect/GdsDirect");
const Rej = require("klesun-node-tools/src/Rej");
const TerminalSettings = require("../Transpiled/App/Models/Terminal/TerminalSettings");
const CommandCorrector = require("../Transpiled/Rbs/GdsDirect/DialectTranslator/CommandCorrector");
const AliasParser = require("../Transpiled/Rbs/GdsDirect/AliasParser");
const TooManyRequests = require("klesun-node-tools/src/Rej").TooManyRequests;
const NotImplemented = require("klesun-node-tools/src/Rej").NotImplemented;
const {hrtimeToDecimal} = require('klesun-node-tools/src/Utils/Misc.js');
const _ = require('lodash');

/**
 * @param '$BN1|2*INF'
 * @return '$BN1+2*INF'
 */
let encodeTpCmdForCms = ($cmd) =>
	$cmd.replace(/\|/g, '+').replace(/@/g, '¤');

let decodeCmsInput = ($cmd, gds) => {
	if (['apollo', 'galileo'].includes(gds)) {
		$cmd = new CmsApolloTerminal().decodeCmsInput($cmd);
	} else if (gds === 'sabre') {
		$cmd = new CmsSabreTerminal().decodeCmsInput($cmd);
	}
	return $cmd;
};

let encodeTpOutputForCms = ($dump) => {
	$dump = $dump.replace(/\|/g, '+').replace(/;/g, '·');
	$dump = $dump.replace(/\n?\)><$/, '\n└─>');
	$dump = $dump.replace(/><$/, '');
	return $dump;
};

let isScreenCleaningCommand = (rec, gds) => {
	if (gds === 'apollo') {
		let type = rec.type || ApoCommandParser.parse(rec.cmd);
		return ['seatMap', 'changeArea', 'ignoreKeepPnr', 'reorderSegments'].includes(type)
			|| rec.cmd.startsWith('A')
			|| rec.cmd.startsWith('*')
			|| rec.cmd.startsWith('$')
			|| rec.cmd.startsWith('MDA')
			|| rec.cmd.startsWith('MT');
	} else if (gds === 'galileo') {
		let type = rec.type || GalCommandParser.parse(rec.cmd);
		let clearScreenTypes = [
			'seatMap', 'changeArea', 'ignoreKeepPnr', 'reorderSegments', 'airAvailability',
			// Apollo $... command analogs follow...
			'priceItinerary', 'fareRulesFromMenu', 'fareRulesMenuFromTariff', 'fareSearch',
			'routingFromTariff', 'showBookingClassOfFare',
		];
		return clearScreenTypes.includes(type)
			|| rec.cmd.startsWith('*')
			|| rec.cmd.startsWith('MDA');
	} else if (gds === 'sabre') {
		let type = rec.type || SabCommandParser.parse(rec.cmd);
		return ['seatMap', 'changeArea', 'ignoreKeepPnr', 'reorderSegments'].includes(type);
	} else {
		return false;
	}
};

let encodeCmdForCms = (gds, cmd) => {
	if (['galileo', 'apollo'].includes(gds)) {
		cmd = encodeTpCmdForCms(cmd);
	}
	return cmd;
};

let transformCalledCommand = (rec, stateful) => {
	if (!rec.cmd || !rec.output) {
		// mostly cases when Promise accidentally returned instead of cmd object
		let cls = ((rec || {}).constructor || {}).name;
		throw new Error('Invalid cmdRec format - ' + cls + ' - ' + JSON.stringify(rec));
	}
	let gds = stateful.gds;
	let agent = stateful.getAgent();
	let output = rec.output;
	let type = rec.type;
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

let runByGds = async (cmdRqData) => {
	let gdsResult;
	let httpRq = GdsSession.initHttpRq(cmdRqData.stateful.getSessionRecord());
	let travelport = TravelportClient({PersistentHttpRq: httpRq});
	let amadeus = AmadeusClient.makeCustom({PersistentHttpRq: httpRq});
	let gds = cmdRqData.stateful.gds;
	if (gds === 'apollo') {
		gdsResult = await ApoRunCmdRq({...cmdRqData, travelport});
	} else if (gds === 'sabre') {
		gdsResult = await SabRunCmdRq(cmdRqData);
	} else if (gds === 'amadeus') {
		gdsResult = await AmaRunCmdRq({...cmdRqData, amadeusClient: amadeus});
	} else if (gds === 'galileo') {
		gdsResult = await GalRunCmdRq(cmdRqData);
	} else {
		return NotImplemented('Unsupported GDS for runCmdRq() - ' + gds);
	}
	return gdsResult;
};

let runCmdRq =  async (cmdRq, stateful) => {
	let status = 'success';
	let messages = [];
	let actions = [];
	let calledCommands = [];

	let parsedAlias = await AliasParser.parse(cmdRq, stateful);
	if (parsedAlias.type === 'addMpRemark') {
		return AddMpRemark({stateful, airline: parsedAlias.data.airline});
	}

	let bulkCmdRecs = parsedAlias.type !== 'bulkCmds'
		? [parsedAlias] : parsedAlias.data.bulkCmdRecs;

	for (let cmdRec of bulkCmdRecs) {
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
		let gdsResult = await running;
		let isSuccess = gdsResult.status === GdsDirect.STATUS_EXECUTED;
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
	return {
		status: status,
		messages: messages,
		actions: actions,
		calledCommands: calledCommands,
	};
};

let translateCmd = (fromGds, toGds, inputCmd) => {
	let errors = [];
	let messages = [];
	let startHr = process.hrtime();
	let forTranslation = decodeCmsInput(inputCmd, fromGds);

	let corrected = CommandCorrector.correct(forTranslation, fromGds);
	errors.push(...(corrected.errors || []));
	messages.push(...(corrected.messages || []));
	if (corrected.output &&
		corrected.output !== forTranslation &&
		corrected.errors.length === 0
	) {
		forTranslation = corrected.output;
	}

	let translated = (new GdsDialectTranslator())
		.translate(fromGds, toGds, forTranslation);
	errors.push(...(translated.errors || []));
	messages.push(...(translated.messages || []));
	let resultCmd;
	if (translated.output) {
		resultCmd = translated.output;
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

let extendActions = async ({whenCmsResult, stateful}) => {
	let agent = stateful.getAgent();
	let didSavePnr = false;
	let prevState = stateful.getSessionData();
	stateful.addPnrSaveHandler(() => didSavePnr = true);
	let result = await whenCmsResult;
	let state = stateful.getSessionData();
	let isExpert = agent.hasGroup('Experts');
	let isNewPnr =
		!prevState.isPnrStored ||
		prevState.recordLocator &&
		prevState.recordLocator !== state.recordLocator;

	if (didSavePnr && state.isPnrStored && isNewPnr && isExpert) {
		let pnr = await GetCurrentPnr(stateful);
		let airlines = [...new Set(pnr.getItinerary().map(s => s.airline))];
		// there are some actions expert has to quickly perform right after PNR was created on
		// these airlines, that's why we were asked to disable the popup - to not slow them down
		let noPopupAirlines = _.intersection(airlines, ['MU', 'CA', 'SQ']);
		if (noPopupAirlines.length === 0 && airlines.length > 0) {
			result.actions.push({type: 'displayMpRemarkDialog', data: {airlines: airlines}});
		}
	}

	return result;
};

/**
 * auto-correct typos in the command, convert it between
 * GDS dialects, run _alias_ chain of commands, etc...
 * @param session = at('GdsSessions.js').makeSessionRecord()
 * @param {{command: '*R'}} rqBody = at('MainController.js').normalizeRqBody()
 */
let ProcessTerminalInput = async ({
	stateful, cmdRq, dialect = null,
	AreaSettings = require("../Repositories/AreaSettings.js"),
}) => {
	let getDefaultPcc = async (area, stateful) => {
		let gds = stateful.gds;
		let agentId = stateful.getAgent().getId();
		let areaSettings = await AreaSettings.getByAgent(agentId);
		let configPcc = areaSettings
			.filter(r => r.area === area && r.gds === stateful.gds)
			.map(r => r.defaultPcc)[0];

		configPcc = configPcc || TerminalSettings.getForcedStartPcc(gds, area);
		return configPcc;
	};

	let ensureConfigPcc = async (stateful) => {
		let areaState = stateful.getSessionData();
		if (!areaState.cmdCnt || !areaState.pcc) {
			let defaultPcc = await getDefaultPcc(areaState.area, stateful);
			if (defaultPcc && defaultPcc !== areaState.pcc) {
				let cmd = translateCmd('apollo', stateful.gds, 'SEM/' + defaultPcc + '/AG').cmd;
				return runCmdRq(cmd, stateful);
			}
		}
		return {calledCommands: [], messages: []};
	};

	let processNormalized = async ({stateful, cmdRq}) => {
		let prePccResult = await ensureConfigPcc(stateful);
		let rbsResult = await runCmdRq(cmdRq, stateful);
		let postPccResult = await ensureConfigPcc(stateful); // if this command changed area

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
		let gds = stateful.gds;
		let translated = translateCmd(dialect || gds, gds, cmdRq);
		let cmdRqNorm = translated.cmd;

		let callsLimit = stateful.getAgent().getUsageLimit();
		if (callsLimit) {
			let callsUsed = await Agents.getGdsDirectCallsUsed(stateful.getAgent().getId());
			if (+callsUsed >= +callsLimit) {
				return TooManyRequests('You exhausted your GDS Direct usage limit for today (' + callsUsed + ' >= ' + callsLimit + ')');
			}
		}
		let whenCmsResult = processNormalized({
			stateful, cmdRq: cmdRqNorm,
		}).then(cmsResult => ({...cmsResult,
			messages: (translated.messages || [])
				.concat(cmsResult.messages || []),
		})).then((rbsResult) => CmdResultAdapter({
			cmdRq, gds: stateful.gds,
			rbsResp: rbsResult,
			fullState: stateful.getFullState(),
		}));
		whenCmsResult = extendActions({whenCmsResult, stateful});

		return whenCmsResult;
	};

	return execute();
};

module.exports = ProcessTerminalInput;
