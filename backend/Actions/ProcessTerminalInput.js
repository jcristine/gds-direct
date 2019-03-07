
let {fetchAll, wrap} = require('../GdsHelpers/TravelportUtils.js');
const StatefulSession = require("../GdsHelpers/StatefulSession.js");
const AreaSettings = require("../Repositories/AreaSettings");
const ItineraryParser = require("../Transpiled/Gds/Parsers/Apollo/Pnr/ItineraryParser");
const ProcessApolloTerminalInputAction = require("../Transpiled/Rbs/GdsDirect/Actions/Apollo/ProcessApolloTerminalInputAction");
const CommandParser = require("../Transpiled/Gds/Parsers/Apollo/CommandParser");
const Misc = require("../Transpiled/Lib/Utils/Misc");
const CommonDataHelper = require("../Transpiled/Rbs/GdsDirect/CommonDataHelper");
const CmsSabreTerminal = require("../Transpiled/Rbs/GdsDirect/GdsInterface/CmsSabreTerminal");
const CmsApolloTerminal = require("../Transpiled/Rbs/GdsDirect/GdsInterface/CmsApolloTerminal");
const matchAll = require("../Utils/Str").matchAll;
const nonEmpty = require("../Utils/Rej").nonEmpty;
const GdsDialectTranslator = require('../Transpiled/Rbs/GdsDirect/DialectTranslator/GdsDialectTranslator.js');
const ProcessSabreTerminalInputAction = require("../Transpiled/Rbs/GdsDirect/Actions/Sabre/ProcessSabreTerminalInputAction");

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

/** @param segment = ItineraryParser.parseSegmentLine() */
let makeSellCmd = (segment) => {
	return [
		'0',
		segment.airline,
		segment.flightNumber,
		segment.bookingClass,
		segment.departureDate.raw,
		segment.departureAirport,
		segment.destinationAirport,
		segment.segmentStatus,
		segment.seatCount,
	].join('');
};

let parseCmdAsItinerary = (dump) => {
	try {
		let parsed = ItineraryParser.parse(dump);
		if (parsed.segments.length > 0) {
			console.log('parsed itinerary', {dump, parsed});
			return {
				bulkCmds: parsed.segments.map(makeSellCmd),
			};
		}
	} catch (exc) {
		// should not happen, but who knows...
	}
	return null;
};

let parseAlias = (cmd) => {
	let type = null, data = null, fetchAll = false, realCmd = '';

	if (cmd.endsWith('/MDA')) {
		realCmd = cmd.slice(0, -4);
		fetchAll = true;
	} else if (cmd === 'MDA') {
		realCmd = 'MD';
		fetchAll = true;
	} else if (data = parseCmdAsItinerary(cmd)) {
		type = 'itinerary';
	} else {
		realCmd = cmd;
	}
	return {
		realCmd: realCmd,
		fetchAll: fetchAll,
		data: data,
		type: type,
	};
};

let makeGrectResult = (calledCommands, fullState) => {
	let areaState = fullState.areas[fullState.area] || {};
	return ({
		calledCommands: calledCommands.map(a => a),
		messages: [],
		clearScreen: false,
		sessionInfo: {
			canCreatePq: areaState.can_create_pq ? true : false,
			pricingCmd: areaState.pricing_cmd || '',
			canCreatePqErrors: areaState.can_create_pq
				? [] : ['Local state processor does not allow creating PQ'],
			area: areaState.area || '',
			pcc: areaState.pcc || '',
			hasPnr: areaState.has_pnr ? true : false,
			recordLocator: areaState.record_locator || '',
		},
	});
};

let isScreenCleaningCommand = (rec, gds) => {
	if (gds === 'apollo') {
		let type = rec.type || CommandParser.parse(rec.cmd);
		return ['seatMap', 'changeArea', 'ignoreKeepPnr', 'reorderSegments'].includes(type)
			|| rec.cmd.startsWith('A')
			|| rec.cmd.startsWith('*')
			|| rec.cmd.startsWith('$')
			|| rec.cmd.startsWith('MDA')
			|| rec.cmd.startsWith('MT')
			;
	} else {
		// TODO: rest GDS-es when we parse them
		return false;
	}
};

let transformCalledCommand = (rec, stateful) => {
	let gds = stateful.gds;
	let agent = stateful.getAgent();
	let cmd = rec.cmd;
	let output = rec.output;
	let type = rec.type;
	let tabCommands = [];
	if (['galileo', 'apollo'].includes(gds)) {
		cmd = encodeTpCmdForCms(cmd);
		if (!rec.noWrap) {
			output = wrap(rec.output);
		}
		output = encodeTpOutputForCms(output);
		tabCommands = matchAll(/>([^>]+?)(?:·|;)/g, output).map(m => m[1]);
		tabCommands = [...new Set(tabCommands)];
	} else if (gds === 'amadeus') {
		// they are using past century macs apparently - with just \r as a line break...
		output = output.replace(/\r\n|\r/g, '\n');
	}
	if (!agent.canSeeCcNumbers()) {
		output = Misc.maskCcNumbers(output)
	}
	if (!agent.canSeeContactInfo()) {
		output = CommonDataHelper.maskSsrContactInfo(output);
	}
	return {
		cmd: cmd,
		type: type,
		output: output,
		duration: rec.duration || null,
		clearScreen: isScreenCleaningCommand(rec, gds),
		tabCommands: tabCommands,
	};
};

let runCmdRq =  async (inputCmd, stateful) => {
	if (stateful.gds === 'apollo') {
		let gdsResult = await (new ProcessApolloTerminalInputAction(stateful).execute(inputCmd));
		let grectResult = makeGrectResult(gdsResult.calledCommands, stateful.getFullState());
		grectResult.status = gdsResult.status;
		grectResult.messages = (gdsResult.userMessages || []).map(msg => ({type: 'error', text: msg}));
		grectResult.actions = gdsResult.actions || [];
		return grectResult;
	} else if (stateful.gds === 'sabre') {
		let gdsResult = await (new ProcessSabreTerminalInputAction(stateful).execute(inputCmd));
		let grectResult = makeGrectResult(gdsResult.calledCommands, stateful.getFullState());
		grectResult.status = gdsResult.status;
		grectResult.messages = (gdsResult.userMessages || []).map(msg => ({type: 'error', text: msg}));
		grectResult.actions = gdsResult.actions || [];
		return grectResult;
	} else {
		let {realCmd: cmd, fetchAll, type, data} = parseAlias(inputCmd);
		let cmdsLeft = (data ? data.bulkCmds : null) || [cmd];
		let calledCommands = [];
		for (let cmd of cmdsLeft) {
			let cmdRec = fetchAll
				? await fetchAll(cmd, stateful)
				: (await stateful.runCmd(cmd));
			calledCommands.push(cmdRec);
		}
		return makeGrectResult(calledCommands, stateful.getFullState());
	}
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

/**
 * auto-correct typos in the command, convert it between
 * GDS dialects, run _alias_ chain of commands, etc...
 * @param session = at('GdsSessions.js').makeSessionRecord()
 * @param {{command: '*R'}} rqBody
 */
module.exports = async (session, rqBody) => {
	let stateful = await StatefulSession(session);
	let cmdRq = rqBody.command;
	let gds = session.context.gds;
	let dialect = rqBody.language || gds;
	cmdRq = translateCmd(dialect, gds, cmdRq).cmd;

	return runCmdRq(cmdRq, stateful)
		.then(grectResult => {
			let {area, pcc} = grectResult.sessionInfo;
			if (!pcc) {
				// emulate to default pcc
				return AreaSettings.getByAgent(rqBody.agentId)
					.then(rows => rows.filter(r =>
						r.gds === gds &&
						r.area === area &&
						r.defaultPcc)[0])
					.then(nonEmpty())
					.then(row => {
						let cmd = {
							apollo: 'SEM/' + row.defaultPcc + '/AG',
							galileo: 'SEM/' + row.defaultPcc + '/AG',
							sabre: 'AAA' + row.defaultPcc,
							amadeus: 'JUM/O-' + row.defaultPcc,
						}[gds];
						return stateful.runCmd(cmd)
							.then(cmdRec => {
								let calledCommands = (grectResult.calledCommands || []).concat([cmdRec]);
								return makeGrectResult(calledCommands, stateful.getFullState());
							});
					})
					.catch(exc => grectResult);
			} else {
				return grectResult;
			}
		})
		.then(grectResult => ({
			...grectResult,
			calledCommands: grectResult.calledCommands
				.map(r => transformCalledCommand(r, stateful)),
		}));
};