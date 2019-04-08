
let {fetchAll, wrap} = require('../GdsHelpers/TravelportUtils.js');
const StatefulSession = require("../GdsHelpers/StatefulSession.js");
const AreaSettings = require("../Repositories/AreaSettings");
const ProcessApolloTerminalInputAction = require("../Transpiled/Rbs/GdsDirect/Actions/Apollo/ProcessApolloTerminalInputAction");
const ApoCommandParser = require("../Transpiled/Gds/Parsers/Apollo/CommandParser");
const SabCommandParser = require("../Transpiled/Gds/Parsers/Sabre/CommandParser");
const AmaCommandParser = require("../Transpiled/Gds/Parsers/Amadeus/CommandParser");
const GalCommandParser = require("../Transpiled/Gds/Parsers/Galileo/CommandParser");
const Misc = require("../Transpiled/Lib/Utils/Misc");
const CommonDataHelper = require("../Transpiled/Rbs/GdsDirect/CommonDataHelper");
const CmsSabreTerminal = require("../Transpiled/Rbs/GdsDirect/GdsInterface/CmsSabreTerminal");
const CmsApolloTerminal = require("../Transpiled/Rbs/GdsDirect/GdsInterface/CmsApolloTerminal");
const matchAll = require("../Utils/Str").matchAll;
const nonEmpty = require("../Utils/Rej").nonEmpty;
const GdsDialectTranslator = require('../Transpiled/Rbs/GdsDirect/DialectTranslator/GdsDialectTranslator.js');
const ProcessSabreTerminalInputAction = require("../Transpiled/Rbs/GdsDirect/Actions/Sabre/ProcessSabreTerminalInputAction");
const TerminalService = require('../Transpiled/App/Services/TerminalService.js');
const TerminalBuffering = require("../Repositories/CmdRqLog");
const ProcessAmadeusTerminalInputAction = require("../Transpiled/Rbs/GdsDirect/Actions/Amadeus/ProcessAmadeusTerminalInputAction");
const Agents = require("../Repositories/Agents");
const ProcessGalileoTerminalInputAction = require("../Transpiled/Rbs/GdsDirect/Actions/Galileo/ProcessGalileoTerminalInputAction");
const GdsDirect = require("../Transpiled/Rbs/GdsDirect/GdsDirect");
const BadRequest = require("../Utils/Rej").BadRequest;
const TooManyRequests = require("../Utils/Rej").TooManyRequests;
const NotImplemented = require("../Utils/Rej").NotImplemented;

// this is not complete list
let shouldWrap = (cmd) => {
	let wrappedCmds = ['FS', 'MORE*', 'QC', '*HTE', 'HOA', 'HOC', 'FQN', 'A', '$D'];
	let alwaysWrap = false;
	return alwaysWrap
		|| wrappedCmds.some(wCmd => cmd.startsWith(wCmd));
};

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

let extractTpTabCmds = (output) => {
	let tabCommands = matchAll(/>([^>\n]+?)(?:·|;)/g, output).map(m => m[1]);
	return [...new Set(tabCommands)];
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

let runByGds = async (inputCmd, stateful) => {
	let gdsResult;
	if (stateful.gds === 'apollo') {
		gdsResult = await (new ProcessApolloTerminalInputAction(stateful).execute(inputCmd));
	} else if (stateful.gds === 'sabre') {
		gdsResult = await (new ProcessSabreTerminalInputAction(stateful).execute(inputCmd));
	} else if (stateful.gds === 'amadeus') {
		gdsResult = await (new ProcessAmadeusTerminalInputAction(stateful).execute(inputCmd));
	} else if (stateful.gds === 'galileo') {
		gdsResult = await (new ProcessGalileoTerminalInputAction(stateful).execute(inputCmd));
	} else {
		return NotImplemented('Unsupported GDS for runCmdRq() - ' + stateful.gds);
	}
	return gdsResult;
};

let runCmdRq =  async (inputCmd, stateful) => {
	let status = 'success';
	let messages = [];
	let actions = [];
	let calledCommands = [];
	let bulkCmds = inputCmd.match(/^\s*[1-9]/)
		? [inputCmd] // itinerary, keep intact for rebook
		: inputCmd.split('\n');
	if (bulkCmds.length > 10) {
		return BadRequest('Too many lines (' + bulkCmds + ') in your input for bulk invocation');
	}
	for (let cmd of bulkCmds) {
		let running = runByGds(cmd.trim(), stateful);
		if (bulkCmds.length > 1) {
			running = running.catch(exc => ({
				status: GdsDirect.STATUS_FORBIDDEN,
				userMessages: ['' + exc],
				calledCommands: stateful.flushCalledCommands(),
			}));
		}
		let gdsResult = await running;
		messages.push(...(gdsResult.userMessages || [])
			.map(msg => ({type: 'error', text: msg})));
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
	let forTranslation = decodeCmsInput(inputCmd, fromGds);
	let translated = (new GdsDialectTranslator())
		.translate(fromGds, toGds, forTranslation);
	let errors = translated.errors || [];
	let messages = translated.messages || [];
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
	};
};

let getDefaultPcc = async (area, stateful) => {
	let gds = stateful.gds;
	let agentId = stateful.getAgent().getId();
	let areaSettings = await AreaSettings.getByAgent(agentId);
	let configPcc = areaSettings
		.filter(r => r.area === area && r.gds === stateful.gds)
		.map(r => r.defaultPcc)[0];

	if (gds === 'sabre' && area === 'A' && !configPcc) {
		// ensure we are emulated in 6IIF on startup
		configPcc = '6IIF';
	}
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

/**
 * auto-correct typos in the command, convert it between
 * GDS dialects, run _alias_ chain of commands, etc...
 * @param session = at('GdsSessions.js').makeSessionRecord()
 * @param {{command: '*R'}} rqBody = at('MainController.js').normalizeRqBody()
 */
let ProcessTerminalInput = async ({session, rqBody, emcUser}) => {
	let whenCmdRqId = TerminalBuffering.storeNew(rqBody, session);
	let stateful = await StatefulSession.makeFromDb({session, whenCmdRqId, emcUser});
	let cmdRq = rqBody.command;
	let gds = session.context.gds;
	let dialect = rqBody.language || gds;
	let translated = translateCmd(dialect, gds, cmdRq);
	cmdRq = translated.cmd;

	let callsLimit = (emcUser.settings || {}).gds_direct_usage_limit || null;
	if (callsLimit) {
		let callsUsed = await Agents.getGdsDirectCallsUsed(emcUser.id);
		if (+callsUsed >= +callsLimit) {
			return TooManyRequests('Too many calls, ' + callsUsed + ' >= ' + callsLimit + ' in last 24h');
		}
	}

	let prePccResult = await ensureConfigPcc(stateful);
	let rbsResult = await runCmdRq(cmdRq, stateful);
	let postPccResult = await ensureConfigPcc(stateful); // if this command changed area

	rbsResult = {...rbsResult,
		calledCommands: []
			.concat(prePccResult.calledCommands || [])
			.concat(rbsResult.calledCommands)
			.concat(postPccResult.calledCommands)
			.map(r => transformCalledCommand(r, stateful)),
		messages: []
			.concat(translated.messages)
			.concat(prePccResult.messages || [])
			.concat(rbsResult.messages)
			.concat(postPccResult.messages),
	};

	let termSvc = new TerminalService(gds);
	let cmsResult = await termSvc.addHighlighting(rqBody.command, rbsResult, stateful.getFullState());
	TerminalBuffering.logOutput(rqBody, whenCmdRqId, cmsResult.output);

	return cmsResult;
};

ProcessTerminalInput.extractTpTabCmds = extractTpTabCmds;

module.exports = ProcessTerminalInput;