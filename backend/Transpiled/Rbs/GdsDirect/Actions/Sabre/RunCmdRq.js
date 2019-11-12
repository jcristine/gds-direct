const GoToArea = require('../../../../../Actions/GoToArea.js');
const Normalize_priceItinerary = require('gds-utils/src/cmd_translators/Normalize_priceItinerary.js');
const Parse_priceItinerary = require('gds-utils/src/text_format_processing/sabre/commands/Parse_priceItinerary.js');
const SortItinerary = require('../../../../../Actions/SortItinerary.js');
const TranslatePricingCmd = require('gds-utils/src/cmd_translators/Translate_priceItinerary.js');
const RepriceInPccMix = require('../../../../../Actions/RepriceInPccMix.js');
const BookViaGk_sabre = require('../../../../../Actions/BookViaGk/BookViaGk_sabre.js');
const GdsSession = require('../../../../../GdsHelpers/GdsSession.js');
const GetCurrentPnr = require('../../../../../Actions/GetCurrentPnr.js');

const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const DateTime = require('../../../../Lib/Utils/DateTime.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const TSabreSavePnr = require('../../../../Rbs/GdsAction/Traits/TSabreSavePnr.js');
const RepriceInAnotherPccAction = require('../../../../Rbs/GdsDirect/Actions/Common/RepriceInAnotherPccAction.js');
const GetMultiPccTariffDisplayAction = require('../../../../Rbs/GdsDirect/Actions/Common/GetMultiPccTariffDisplayAction.js');
const AliasParser = require('../../../../../CmdTranslation/AliasParser.js');
const Errors = require('../../../../Rbs/GdsDirect/Errors.js');
const GdsDirect = require('../../../../Rbs/GdsDirect/GdsDirect.js');
const CmsSabreTerminal = require('../../../../Rbs/GdsDirect/GdsInterface/CmsSabreTerminal.js');
const GenericRemarkParser = require('gds-utils/src/text_format_processing/agnostic/GenericRemarkParser.js');
const CommandParser = require('gds-utils/src/text_format_processing/sabre/commands/CmdParser.js');
const SabrePnr = require('../../../../Rbs/TravelDs/SabrePnr.js');
const CommonDataHelper = require('../../../../Rbs/GdsDirect/CommonDataHelper.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const SabreTicketListParser = require('gds-utils/src/text_format_processing/sabre/pnr/TicketListParser.js');
const PnrParser = require('../../../../Gds/Parsers/Sabre/Pnr/PnrParser.js');
const getRbsPqInfo = require("../../../../../GdsHelpers/RbsUtils").getRbsPqInfo;
const UnprocessableEntity = require("klesun-node-tools/src/Rej").UnprocessableEntity;
const SabreTicketParser = require('gds-utils/src/text_format_processing/sabre/TicketMaskParser.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');

const doesStorePnr = (cmd) => {
	const parsedCmd = CommandParser.parse(cmd);
	const flatCmds = php.array_merge([parsedCmd], parsedCmd.followingCommands || []);
	const cmdTypes = php.array_column(flatCmds, 'type');
	const intersection = php.array_intersect(cmdTypes, [
		'storePnr', 'storeKeepPnr', 'storePnrSendEmail', 'storeAndCopyPnr',
	]);
	return !php.empty(intersection);
};

const doesStorePricing = parsedCmd => {
	if (parsedCmd.type === 'storePricing') {
		return true;
	} else if (parsedCmd.type === 'priceItinerary') {
		return parsedCmd.data.pricingModifiers
			.some(m => m.type === 'createPriceQuote');
	} else {
		return false;
	}
};

const doesOpenPnr = (cmd) => {
	let parsedCmd;

	parsedCmd = CommandParser.parse(cmd);
	return php.in_array(parsedCmd.type, ['openPnr', 'searchPnr', 'displayPnrFromList']);
};

/** @param ranges = [['from' => 3, 'to' => 7], ['from' => 15]] */
const isInRanges = (num, ranges) => {
	let range;

	for (range of Object.values(ranges)) {
		if (php.array_key_exists('to', range)) {
			if (num >= range.from && num <= range.to) {
				return true;
			}
		} else {
			if (num >= range.from) {
				return true;
			}
		}
	}
	return false;
};

const hideSeaPassengers = (gdsOutput) => {
	return php.str_replace('SEAMAN', 'ITSPE', gdsOutput);
};

const getPerformedCommands = async (cmdLog) => {
	let commands, cmdRecord, parsed, flatCmds;

	const result = [];
	commands = await cmdLog.getCurrentPnrCommands();
	for (cmdRecord of Object.values(commands)) {
		parsed = CommandParser.parse(cmdRecord.cmd);
		flatCmds = php.array_merge([parsed], parsed.followingCommands);
		for (const flatCmd of Object.values(flatCmds)) {
			result.push(flatCmd);
		}
	}
	return result;
};

const isSuccessfulFsCommand = (cmd, dump) => {
	let keywords, type, isFsCmd, isFsSuccessful;

	keywords = [
	// on >WPNI; screen
		'BARGAIN FINDER PLUS ITINERARY OPTIONS',
		'NO LOWER FARE DETERMINED',
		'CURRENT ITINERARY',
		'ALREADY BOOKED AT LOWEST',
		'NO COMBINABLE FARES FOR CLASS',
		'* USE WC¥OPTION NUMBER TO SELL NEW ITINERARY *.',

		// on >JR.{params}; screen
		'¥NO FLIGHT SCHEDULES FOR QUALIFIERS USED',
		'¥NO FLIGHTS FOUND FOR',
		'¥NO COMBINABLE SCHEDULES RETURNED',
		'* ENTER JR0 WITH OPTION NUMBER *.',
	];

	type = (CommandParser.parse(cmd) || {}).type || '';
	isFsCmd = php.in_array(type, CommonDataHelper.getCountedFsCommands());
	isFsSuccessful = keywords.some((keyword) => StringUtil.contains(dump, keyword));

	return isFsCmd && isFsSuccessful;
};

const extendPricingCmd = (mainCmd, newPart) => {
	let mainParsed, isFullCmd, newParsed, mainMods, newMods, rawMods;

	mainParsed = CommandParser.parse(mainCmd);
	if (mainParsed.type !== 'priceItinerary' || !mainParsed.data) {
		return null;
	}
	if (php.preg_match(/^\d/, newPart)) {
		newPart = 'S' + newPart;
	}
	if (!StringUtil.startsWith(newPart, 'WP')) {
		isFullCmd = false;
		newPart = mainParsed.data.baseCmd + newPart;
	} else {
		isFullCmd = true;
	}
	newParsed = CommandParser.parse(newPart);
	if (newParsed.type !== 'priceItinerary' || !newParsed.data) {
		return null;
	}
	mainMods = php.array_combine(php.array_column(mainParsed.data.pricingModifiers, 'type'),
		mainParsed.data.pricingModifiers);
	newMods = php.array_combine(php.array_column(newParsed.data.pricingModifiers, 'type'),
		newParsed.data.pricingModifiers);
	if (!isFullCmd) {
		newMods = php.array_merge(mainMods, newMods);
	}
	rawMods = php.array_column(newMods, 'raw');
	return newParsed.data.baseCmd + php.implode('¥', rawMods);
};

const parseMultiPriceItineraryAlias = (cmd) => {
	let parts, mainCmd, followingCommands, cmds;

	if (php.preg_match(/^WP.*(&|\|\|)\S.*$/, cmd)) {
		parts = php.preg_split(/&|\|\|/, cmd);
		mainCmd = php.array_shift(parts);
		followingCommands = parts.map((cmdPart) =>
			extendPricingCmd(mainCmd, cmdPart));
		if (!Fp.any('is_null', followingCommands)) {
			cmds = php.array_merge([mainCmd], followingCommands);
			return {pricingCommands: cmds};
		}
	}
	return null;
};

/**
 * since we use our own _fake_ areas, _real_ letter in AAA{pcc} output would
 * always be "A", that's confusing - so we change the area letter in the dump
 *
 * not sure it is relevant anymore, as we now use real areas in Sabre with OIATH
 */
const forgePccChangeOutput = (calledCommands, area) => {
	return Fp.map((calledCommand) => {
		if (CommandParser.parse(calledCommand.cmd).type == 'changePcc' && !php.empty(area)) {
			calledCommand.output = php.preg_replace('#(?<=^[A-Z\\d]{4}\\.L3II\\*AWS\\.)[A-Z]#', area, calledCommand.output);
			calledCommand.output = php.preg_replace('#(?<=^[A-Z\\d]{3}\\.L3II\\*AWS\\.)[A-Z]#', area, calledCommand.output);
		}
		return calledCommand;
	}, calledCommands);
};

/** @param stateful = require('StatefulSession.js')() */
const execute = ({
	stateful, cmdRq,
	PtcUtil = require('../../../../Rbs/Process/Common/PtcUtil.js'),
	Pccs = require("../../../../../Repositories/Pccs"),
	gdsClients = GdsSession.makeGdsClients(),
}) => {
	const getDkNumber = async (pcc) => {
		return Pccs.findByCode('sabre', pcc)
			.then(row => row.dk_number)
			.catch(exc => null);
	};

	const makeAddDkNumberCmdIfNeeded = async (cmdLog) => {
		const sessionData = cmdLog.getSessionData();
		if (sessionData.isPnrStored) {
			return null;
		}
		const number = await getDkNumber(sessionData.pcc);
		if (!number) {
			return null;
		}
		for (const flatCmd of await getPerformedCommands(cmdLog)) {
			if (flatCmd.type === 'addDkNumber' && flatCmd.data == number) {
				// already added DK number
				return null;
			}
		}
		return 'DK' + number;
	};

	const getSessionData =  () => {
		return stateful.getSessionData();
	};

	const makeGdRemarkCmdIfNeeded = async  () => {
		const cmdLog = stateful.getLog();
		if (!stateful.getSessionData().isPnrStored) {
			const msg = await CommonDataHelper.createCredentialMessage(stateful);
			const cmd = '5' + msg;
			if (await CommonDataHelper.shouldAddCreationRemark(msg, cmdLog)) {
				return cmd;
			}
		}
		return null;
	};

	const getAgent =  () => {
		return stateful.getAgent();
	};

	/** @return Agent|null */
	const getLeadAgent =  () => {
		return stateful.getLeadAgent();
	};

	const runCmd = async  (cmd) => {
		let cmdStartsWith, prevState, output;

		cmdStartsWith = (str) => StringUtil.startsWith(cmd, str);

		prevState = getSessionData();
		let cmdRec = await stateful.runCmd(cmd);

		if (isSuccessfulFsCommand(cmd, cmdRec.output)) {
			stateful.handleFsUsage();
		}
		if (Fp.any(cmdStartsWith, ['FQ', 'PQ', '*PQ'])) {
			cmdRec = {...cmdRec, output: hideSeaPassengers(cmdRec.output)};
		}
		return cmdRec;
	};

	const runCommand = async  (cmd) => {
		return (await runCmd(cmd)).output;
	};

	const makeCmdMessages = async  (cmd, output) => {
		let userMessages, type, agent, left, wpniLeftMsg;

		userMessages = [];
		type = CommandParser.parse(cmd).type;
		if (php.in_array(type, CommonDataHelper.getCountedFsCommands())) {
			agent = getAgent();
			left = agent.getFsLimit() - await agent.getFsCallsUsed();
			wpniLeftMsg = left + ' WPNI COMMANDS REMAINED';
			userMessages.push(wpniLeftMsg);
		}
		return userMessages;
	};

	const modifyOutput =  (calledCommand) => {
		let cmdParsed, type, lines, split, blocks, isNotAlex, pad, pcc;

		cmdParsed = CommandParser.parse(calledCommand.cmd);
		type = cmdParsed.type;
		if (php.in_array(type, ['searchPnr', 'displayPnrFromList']) &&
		!SabrePnr.makeFromDump(calledCommand.output).getRecordLocator() &&
		!stateful.getAgent().canOpenPrivatePnr()
		) {
		// '  3   WEINSTEIN/EL X     -17JUL   4   WEINSTEIN/AL  05MAY-20NOV'
			lines = StringUtil.lines(calledCommand.output);
			split = (line) => php.str_split(line, 32);
			blocks = Fp.flatten(Fp.map(split, lines));

			isNotAlex = (block) => !StringUtil.contains(block, 'WEINSTEIN\/AL');
			blocks = php.array_values(Fp.filter(isNotAlex, blocks));

			pad = (block) => php.str_pad(block, 32);
			blocks = Fp.map(pad, blocks);

			lines = Fp.map('implode', php.array_chunk(blocks, 2));
			calledCommand.output = php.implode(php.PHP_EOL, lines);
		}
		if (cmdParsed.type === 'changePcc' && cmdParsed.data) {
			pcc = cmdParsed.data;
			if (CmsSabreTerminal.isSuccessChangePccOutput(calledCommand.output, pcc)) {
				calledCommand.output = 'YOU HAVE SUCCESSFULLY EMULATED TO ' + pcc;
			}
		}
		return calledCommand;
	};

	const getCurrentPnr = async  () => {
		return GetCurrentPnr.inSabre(stateful);
	};

	const areAllCouponsVoided = async  () => {
		let tOutput, tParsed, ticketRecord, wetrOutput, wetrParsed, isVoid;

		tOutput = await runCommand('*T');
		tParsed = SabreTicketListParser.parse(tOutput);
		if (!php.empty(tParsed.error)) {
			return false;
		}
		for (ticketRecord of Object.values(tParsed.tickets)) {
			if (ticketRecord.transactionIndicator !== 'TV') {
				wetrOutput = await runCommand('WETR*' + ticketRecord.lineNumber);
				wetrParsed = SabreTicketParser.parse(wetrOutput);
				isVoid = (seg) => seg.couponStatus === 'VOID';
				if (!php.empty(wetrParsed.error) ||
				!Fp.all(isVoid, wetrParsed.segments)
				) {
					return false;
				}
			}
		}
		return true;
	};

	/** @param data = CommandParser::parseChangePnrRemarks().data */
	const checkChangeRemarks = async  (data) => {
		let errors, remark, lineNum;

		errors = [];
		for (remark of Object.values((await getCurrentPnr()).getRemarks())) {
			if (remark.remarkType !== GenericRemarkParser.CMS_LEAD_REMARK) continue;
			lineNum = remark.lineNumber;
			if (isInRanges(lineNum, data.ranges)) {
				errors.push(Errors.getMessage(Errors.CANT_CHANGE_GDSD_REMARK, {lineNum: lineNum}));
			}
		}
		return errors;
	};

	const checkIsForbidden = async (cmd) => {
		let errors = [];
		const parsedCmd = CommandParser.parse(cmd);
		const flatCmds = php.array_merge([parsedCmd], parsedCmd.followingCommands || []);
		const type = parsedCmd.type;
		const agent = getAgent();
		const isQueueCmd = php.in_array(type, CommonDataHelper.getQueueCommands()) ||
			StringUtil.startsWith(cmd, 'Q'); // to be extra sure

		if (php.in_array(type, CommonDataHelper.getTicketingCommands())) {
			if (!agent.canIssueTickets()) {
				errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd: cmd, type: type}));
			}
		} else if (php.in_array(type, CommonDataHelper.getCountedFsCommands())) {
			const totalAllowed = agent.getFsLimit();
			if (!totalAllowed) {
				errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd: cmd, type: type}));
			} else if ((await agent.getFsCallsUsed()) >= totalAllowed) {
				errors.push(Errors.getMessage(Errors.FS_LIMIT_EXHAUSTED, {totalAllowed: totalAllowed}));
			}
		} else if (php.in_array(type, CommonDataHelper.getCountedFsCommands())) {
		// not allowed in Sabre yet
			errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd: cmd, type: type}));
		} else if (isQueueCmd && type !== 'movePnrToQueue') {
			if (!agent.canProcessQueues()) {
				errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd: cmd, type: type}));
			}
		} else if (type === 'searchPnr') {
			if (!agent.canSearchPnr()) {
				errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd: cmd, type: type}));
			}
		} else if (php.in_array(type, CommonDataHelper.getTotallyForbiddenCommands())) {
			errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd: cmd, type: type}));
		}
		if (php.in_array('deletePnrField', php.array_column(flatCmds, 'type'))) {
			if (getSessionData().isPnrStored &&
			!agent.canEditTicketedPnr()
			) {
				const pnr = await getCurrentPnr();
				const canChange = !pnr.hasEtickets()
					|| agent.canEditVoidTicketedPnr()
						&& await areAllCouponsVoided();
				if (!canChange) {
					errors.push(Errors.getMessage(Errors.CANT_CHANGE_TICKETED_PNR));
				}
			}
		}
		if (type === 'changePcc') {
			await CommonDataHelper.checkEmulatePccRights({stateful, pcc: parsedCmd.data});
		}
		if (doesStorePnr(cmd)) {
			const state = stateful.getSessionData();
			if (!state.isPnrStored && !(await canCreatePnrInThisPcc())) {
				errors.push('Unfortunately, PNR\\\'s in PCC cannot be created. Please use a special Sabre login in SabreRed.');
			}
		}
		if (doesStorePricing(parsedCmd)) {
			await CommonDataHelper.checkStorePricingPcc({stateful, Pccs});
		}
		for (const flatCmd of Object.values(flatCmds)) {
			if (flatCmd.type === 'changePnrRemarks') {
				errors = php.array_merge(errors, await checkChangeRemarks(flatCmd.data));
			}
		}
		return errors;
	};

	const getEmptyAreas =  () => {
		return getEmptyAreasFromDbState();
	};

	const getEmptyAreasFromDbState =  () => {
		const isOccupied = (row) => row.hasPnr;
		const occupiedRows = Fp.filter(isOccupied, stateful.getAreaRows());
		const occupiedAreas = php.array_column(occupiedRows, 'area');
		occupiedAreas.push(getSessionData().area);
		return php.array_values(php.array_diff(['A', 'B', 'C', 'D', 'E', 'F'], occupiedAreas));
	};

	const changeArea = async (area) => {
		return GoToArea.inSabre({stateful, area});
	};

	const prepareReArea = async (aliasData) => {
		const sameAreaAllowed = aliasData.sameAreaAllowed || false;
		const pcc = aliasData.pcc || getSessionData().pcc;
		await CommonDataHelper.checkEmulatePccRights({stateful, pcc});
		const emptyAreas = await getEmptyAreas();
		if (php.empty(emptyAreas)) {
			return {errors: [Errors.getMessage(Errors.NO_FREE_AREAS)]};
		}
		let useSameArea = sameAreaAllowed && getSessionData().pcc === pcc;
		if (!getSessionData().isPnrStored &&
			!aliasData.keepOriginal &&
			(!aliasData.willGk || useSameArea)
		) {
			await runCommand('I'); // ignore the itinerary it initial area
		} else {
			useSameArea = false;
		}
		if (useSameArea) {
			return Promise.resolve({errors: []});
		}
		const area = emptyAreas[0];
		const areaChange = await changeArea(area);
		const errors = areaChange.errors || [];
		if (!php.empty(errors)) {
			return {errors};
		} else if (getSessionData().area !== area) {
			const error = Errors.getMessage(Errors.FAILED_TO_CHANGE_AREA, {
				area: area,
				response: php.trim((php.array_pop(areaChange.calledCommands) || {}).output || 'no commands called'),
			});
			return {errors: [error]};
		}
		const output = php.trim(await runCommand('AAA' + pcc));
		if (getSessionData().pcc !== pcc) {
			const error = output === '¥NOT ALLOWED THIS CITY¥'
				? Errors.getMessage(Errors.PCC_NOT_ALLOWED_BY_GDS, {pcc, gds: 'sabre'})
				: Errors.getMessage(Errors.PCC_GDS_ERROR, {pcc, response: php.trim(output)});
			return {errors: [error]};
		} else {
			return {calledCommands: stateful.flushCalledCommands()};
		}
	};

	/** RE/6IIF */
	const processCloneItinerary = async (aliasData) => {
		const seatNumber = aliasData.seatCount || 0;
		const segmentNumbers = aliasData.segmentNumbers || [];

		const reservation = (await getCurrentPnr())
			.getReservation(stateful.getStartDt());
		const takenSegments = reservation
			.itinerary.filter(s => {
				return !segmentNumbers.length
					|| segmentNumbers.includes(+s.segmentNumber);
			});
		const newStatus = aliasData.segmentStatus ||
			(takenSegments.some(s => s.airline === 'AA') ? 'SS' : 'GK');
		if (php.empty(takenSegments)) {
			return {errors: [Errors.getMessage(Errors.ITINERARY_IS_EMPTY)]};
		}
		const isAa = (seg) => seg.airline === 'AA';
		const pccResult = await prepareReArea({...aliasData,
			willGk: newStatus === 'GK' && !takenSegments.some(isAa),
		});
		const errors = pccResult.errors || [];
		if (!php.empty(errors)) {
			return {errors};
		}
		const desiredSegments = takenSegments.map((seg) => ({
			...seg,
			seatCount: seatNumber || seg.seatCount,
			segmentStatus: newStatus,
		}));
		const fallbackToGk = newStatus === 'SS';
		return bookItinerary(desiredSegments, fallbackToGk)
			.then(async actRs => {
				if (aliasData.withPassengers && php.empty(actRs.errors)) {
					const booked = await bookPassengers(reservation.passengers);
					actRs.calledCommands = [
						...(actRs.calledCommands || []),
						...booked.calledCommands,
					];
				}
				return actRs;
			});
	};

	const bookPassengers = async  (passengers) => {
		// note that Amadeus has different format instead of 'remark', so a
		// better approach would be to generate command for pure parsed dob/ptc
		const cmd = passengers
			.map(pax => {
				const infMark = pax.nameNumber.isInfant ? 'I/' : '';
				return '-' + infMark + pax.lastName + '/' + pax.firstName +
					(!pax.remark ? '' : '*' + pax.remark);
			})
			.join('§');
		const cmdRec = await runCmd(cmd);
		return {calledCommands: [cmdRec]};
	};

	const bookPnr = async  (reservation) => {
		const passengers = reservation.passengers || [];
		let itinerary = reservation.itinerary || [];
		const errors = [];
		const userMessages = [];
		const calledCommands = [];
		if (reservation.pcc && reservation.pcc !== getSessionData().pcc) {
			const cmd = 'AAA' + reservation.pcc;
			const pccResult = await processRealCommand(cmd);
			errors.push(...(pccResult.errors || []));
			userMessages.push(...(pccResult.userMessages || []));
			calledCommands.push(...(pccResult.calledCommands || []));
		}
		if (passengers.length > 0) {
			const booked = await bookPassengers(passengers);
			errors.push(...(booked.errors || []));
			calledCommands.push(...(booked.calledCommands || []));
		}
		if (itinerary.length > 0) {
			itinerary = itinerary.map((s, i) => ({...s,
				segmentNumber: +i + 1,
				segmentStatus: {
					'GK': s.airline !== 'AA' ? 'GK' :
						BookViaGk_sabre.AA_PASSIVE_STATUS,
					'HK': 'SS', // from stored PNR
					'DK': 'SS', // amadeus
					'HS': 'SS', // galileo
				}[s.segmentStatus] || s.segmentStatus,
			}));
			const booked = await bookItinerary(itinerary, true)
				.catch(coverExc([Rej.UnprocessableEntity], exc => {
					if ((exc + '').includes('SYSTEM UNABLE TO PROCESS')) {
						if (itinerary.some(s => s.airline === 'AA') &&
							itinerary.every(s => !s.marriage) &&
							itinerary.length > 2
						) {
							const msg = 'No marriages in dump, SYSTEM UNABLE TO PROCESS, need *IMSL';
							exc = Rej.BadRequest.makeExc(msg);
						}
					}
					return Promise.reject(exc);
				}));
			errors.push(...(booked.errors || []));
			calledCommands.push(...(booked.calledCommands || []));
		}
		return {errors, userMessages, calledCommands};
	};

	const bookItinerary = async (desiredSegments, fallbackToGk) => {
		const prevState = getSessionData();
		const built = await BookViaGk_sabre({
			bookRealSegments: true,
			withoutRebook: !fallbackToGk,
			itinerary: desiredSegments,
			session: stateful,
			baseDate: stateful.getStartDt(),
			sabre: gdsClients.sabre,
		}).catch(coverExc([Rej.UnprocessableEntity], exc => {
			if (exc.message.includes('DUPLICATE SEGMENT - NOT ALLOWED') &&
				prevState.hasPnr
			) {
				exc.httpStatusCode = Rej.BadRequest.httpStatusCode;
			}
			return Promise.reject(exc);
		}));
		stateful.updateAreaState({
			type: '!xml:EnhancedAirBookRQ',
			state: {hasPnr: true, canCreatePq: false},
		});

		let cmdRec = built.pnrCmdRec;
		const sortResult = await processSortItinerary((cmdRec || {}).output)
			.catch(coverExc(Rej.list, exc => ({errors: ['Did not SORT' + exc]})));

		cmdRec = cmdRec || {
			cmd: '*R',
			output: (await getCurrentPnr()).getDump(),
		};
		return {
			calledCommands: [cmdRec],
			userMessages: built.messages
				.filter(r => r.type === 'info')
				.map(r => r.text),
			errors: built.messages
				.filter(r => r.type === 'error')
				.map(r => r.text),
		};
	};

	const rebookAsSs = async  () => {
		let gkSegments, cmd, output;

		stateful.flushCalledCommands();
		gkSegments = (await getCurrentPnr()).getItinerary()
			.filter((seg) => seg.segmentStatus === 'GK');
		if (!gkSegments) {
			return {errors: ['No GK segments']};
		}
		cmd = 'WC' + gkSegments.map((seg) => seg.segmentNumber + seg.bookingClass).join('/');
		output = await runCommand(cmd);
		return {calledCommands: [{cmd: cmd, output: output}]};
	};

	const getMultiPccTariffDisplay =  (realCmd) => {
		return (new GetMultiPccTariffDisplayAction()).execute(realCmd, stateful);
	};

	/** @param cmdRecs = TerminalCommandLog::getCurrentPnrCommands() */
	const flattenCmds =  (cmdRecs) => {
		let allFlatCmds, cmdRecord, parsedCmd, flatCmds;

		allFlatCmds = [];
		for (cmdRecord of Object.values(cmdRecs)) {
			parsedCmd = CommandParser.parse(cmdRecord.cmd);
			flatCmds = php.array_merge([parsedCmd], parsedCmd.followingCommands);
			allFlatCmds = php.array_merge(allFlatCmds, flatCmds);
		}
		return allFlatCmds;
	};

	const handlePnrSave =  (recordLocator) => {
		stateful.handlePnrSave(recordLocator);
	};

	const processSavePnr = async  () => {
		if (!(await canCreatePnrInThisPcc())) {
			return {
				calledCommands: [],
				errors: ['Unfortunately, PNR\'s in PCC cannot be created. Please use a special Sabre login in SabreRed.'],
			};
		}
		const pnr = await getCurrentPnr();
		let errors;
		if (!CommonDataHelper.isValidPnr(pnr)) {
			return {errors: [Errors.getMessage(Errors.INVALID_PNR, {response: php.trim(pnr.getDump())})]};
		} else if (!php.empty(errors = CommonDataHelper.checkSeatCount(pnr))) {
			return {errors: errors};
		}

		const login = getAgent().getLogin();
		const writeCommands = [
			'7TAW/' + php.strtoupper(php.date('dM', php.strtotime(stateful.getStartDt()))),
			'6' + php.strtoupper(login),
			'ER',
		];
		const usedCmds = await stateful.getLog().getCurrentPnrCommands();
		const flatCmds = flattenCmds(usedCmds);
		const usedCmdTypes = php.array_column(flatCmds, 'type');
		const performedCmds = php.array_column(flatCmds, 'cmd');
		const pcc = getSessionData().pcc;
		if (pcc == '9WE0' && !php.in_array('5.ITN', performedCmds)) {
			php.array_unshift(writeCommands, '5.ITN');
		}
		if (!php.in_array('addAgencyPhone', usedCmdTypes)) {
			php.array_unshift(writeCommands, '9800-750-2238-A'); //Add Phone if not done earlier
		}
		const remarkCmd = await makeGdRemarkCmdIfNeeded();
		if (remarkCmd) {
			php.array_unshift(writeCommands, remarkCmd);
		}
		const dkNumberCmd = await makeAddDkNumberCmdIfNeeded(stateful.getLog());
		if (dkNumberCmd) {
			php.array_unshift(writeCommands, dkNumberCmd);
		}

		let cmd = php.implode('\u00A7', writeCommands);
		let output = await runCommand(cmd);

		if (php.trim(output) === 'NEED ADDRESS - USE W-') {
			cmd = php.implode('\u00A7', ['W- 100 PINE STREET', '5\/ITN', 'ER']);
			output = await runCommand(cmd);
		}
		const parsedStoredPnr = PnrParser.parse(output);
		const rloc = ((parsedStoredPnr.parsedData || {}).pnrInfo || {}).recordLocator;
		if (rloc) {
			handlePnrSave(rloc);
		}

		const cmdRecord = {cmd: 'PNR', output: output};
		return {calledCommands: [cmdRecord]};
	};

	const processSortItinerary = async (pnrDump) => {
		const pnr = pnrDump ? SabrePnr.makeFromDump(pnrDump) : await getCurrentPnr();
		return SortItinerary.inSabre({
			gdsSession: stateful,
			itinerary: pnr.getReservation(stateful.getStartDt()).itinerary,
			geo: stateful.getGeoProvider(),
		});
	};

	const needsPl = async  (cmd, pricingDump, pnr) => {
		const rbsInfo = await getRbsPqInfo(pnr.getDump(), pricingDump, 'sabre').catch(exc => ({}));
		return rbsInfo.isPrivateFare && rbsInfo.isBrokenFare;
	};

	const translateMods = async  (apolloPricingModifiers) => {
		const normalized = Normalize_priceItinerary.inApollo({
			type: 'storePricing',
			data: {
				baseCmd: '$B',
				pricingModifiers: apolloPricingModifiers,
			},
		});

		const sabreRawMods = [];
		for (const mod of normalized.pricingModifiers) {
			const moreSabreMods = TranslatePricingCmd.mod_sabre(mod);
			if (moreSabreMods) {
				sabreRawMods.push(...moreSabreMods);
			} else if (mod.raw === 'FXD') {
				const msg = 'Bad modifier /FXD/ - Sabre does not ' +
					'have a direct format to exclude basic economy';
				return Rej.BadRequest(msg);
			} else {
				const msg = mod.type
					? 'Unsupported Apollo modifier - ' + mod.type + ' - ' + mod.raw
					: 'Unsupported modifier - ' + mod.raw;
				return Rej.NotImplemented(msg);
			}
		}
		return Promise.resolve(sabreRawMods);
	};

	const makeStorePricingCmd = async  (pnr, aliasData, needsPl) => {
		let adultPtc = aliasData.ptc || 'ADT';
		if (needsPl && adultPtc === 'ITX') {
			adultPtc = 'ADT';
		}

		const errors = CommonDataHelper.checkSeatCount(pnr);
		if (!php.empty(errors)) {
			return Rej.BadRequest('Invalid PNR - ' + errors.join('; '));
		}
		const tripEndDate = ((ArrayUtil.getLast(pnr.getItinerary()) || {}).departureDate || {}).parsed;
		const tripEndDt = tripEndDate ? DateTime.addYear(tripEndDate, stateful.getStartDt()) : null;

		const paxCmdParts = [];
		for (const pax of Object.values(pnr.getPassengers())) {
			const ptc = await PtcUtil.convertPtcAgeGroup(adultPtc, pax, tripEndDt);
			paxCmdParts.push('1' + ptc);
		}
		// KP0 - specify commission, needed by some airlines
		let cmd = 'WPP' + paxCmdParts.join('/') + '¥KP0¥RQ';

		if (needsPl) {
			cmd += '¥PL';
		}
		const customMods = await translateMods(aliasData.pricingModifiers);
		cmd += customMods.map(m => '¥' + m).join('');

		return cmd;
	};

	const makePriceAllCmd = async  (aliasData) => {
		const {ptcs, pricingModifiers = []} = aliasData;
		const rawMods = [];
		rawMods.push('P' + ptcs
			.map(ptc => '0' + ptc)
			.join('/'));
		const customMods = await translateMods(pricingModifiers);
		rawMods.push(...customMods);
		const cmd = 'WP' + rawMods.join('¥');
		return Promise.resolve(cmd);
	};

	const storePricing = async  (aliasData) => {
		await CommonDataHelper.checkStorePricingPcc({stateful, Pccs});
		const pnr = await getCurrentPnr();
		if (pnr.getItinerary().length === 0) {
			return Rej.BadRequest('No itinerary to price');
		} else if (pnr.getPassengers().length === 0) {
			return Rej.BadRequest('No passenger names in PNR');
		}
		let cmd = await makeStorePricingCmd(pnr, aliasData, false);
		let output = await runCommand(cmd);

		if (await needsPl(cmd, output, pnr)) {
			// delete PQ we just created and store a correct one, with /PL/ mod
			await runCommand('PQD-ALL');
			cmd = await makeStorePricingCmd(pnr, aliasData, true);
			output = await runCommand(cmd);
		}
		const calledCommands = [{cmd, output}];
		const isSuccess = output.length > 150;
		if (isSuccess && stateful.getSessionData().isPnrStored) {
			const login = getAgent().getLogin().toUpperCase();
			const erCmdRec = await runCmd('6' + login + '§ER');
			calledCommands.push(erCmdRec);
		}
		return {calledCommands};
	};

	const priceAll = async  (aliasData) => {
		const cmd = await makePriceAllCmd(aliasData);
		return processRealCommand(cmd);
	};

	const callImplicitCommandsBefore = async  (cmd) => {
		let calledCommands, remarkCmd, dkNumberCmd;

		calledCommands = [];
		if (doesStorePnr(cmd)) {
			if (remarkCmd = await makeGdRemarkCmdIfNeeded()) {
				// we don't show it - no adding to calledCommands
				await runCommand(remarkCmd);
			}
			if (dkNumberCmd = await makeAddDkNumberCmdIfNeeded(stateful.getLog())) {
				await runCommand(dkNumberCmd);
			}
		}
		return calledCommands;
	};

	const canCreatePnrInThisPcc = async () => {
		const pcc = getSessionData().pcc;
		if (['DK8H', '5E9H'].includes(pcc)) {
			return false;
		}
		return CommonDataHelper.checkSavePnrRights({stateful, Pccs})
			.then(() => true)
			.catch(coverExc([Rej.Forbidden], exc => false));
	};

	const callImplicitCommandsAfter = async  (cmdRecord, calledCommands, userMessages) => {
		let cmd, output, recordLocator, parsed, isAlex;

		calledCommands.push(modifyOutput(cmdRecord));
		if (doesStorePnr(cmdRecord.cmd)) {
			if (php.trim(cmdRecord.output) === 'NEED ADDRESS - USE W-') {
			// add address and call E/ER again
				cmd = php.implode('\u00A7', ['W- 100 PINE STREET', '5\/ITN', cmdRecord.cmd]);
				output = await runCommand(cmd);
				calledCommands.push({cmd: cmd, output: output});
			}
			recordLocator = (TSabreSavePnr.parseSavePnrOutput(cmdRecord.output) || {}).recordLocator || (((PnrParser.parse(cmdRecord.output) || {}).parsedData || {}).pnrInfo || {}).recordLocator;
			if (recordLocator) {
				handlePnrSave(recordLocator);
			}
		} else if (doesOpenPnr(cmdRecord.cmd)) {
			parsed = PnrParser.parse(cmdRecord.output);
			isAlex = (pax) => {
				return pax.lastName === 'WEINSTEIN'
				&& pax.firstName === 'ALEX';
			};
			if (Fp.any(isAlex, (((parsed.parsedData || {}).passengers || {}).parsedData || {}).passengerList || []) &&
			!stateful.getAgent().canOpenPrivatePnr()
			) {
				await runCommand('I');
				return {errors: ['Restricted PNR']};
			}
		}
		return {calledCommands: calledCommands, userMessages: userMessages};
	};

	const processRealCommand = async  (cmd) => {
		let errors, calledCommands, userMessages;

		if (!php.empty(errors = await checkIsForbidden(cmd))) {
			return {errors: errors};
		}
		calledCommands = [];
		calledCommands = php.array_merge(calledCommands, await callImplicitCommandsBefore(cmd));
		const cmdRec = await runCmd(cmd);
		userMessages = await makeCmdMessages(cmd, cmdRec.output);
		return callImplicitCommandsAfter(cmdRec, calledCommands, userMessages);
	};

	const multiPriceItinerary = async  (aliasData) => {
		let calledCommands, cmd, output;

		calledCommands = [];
		for (cmd of Object.values(aliasData.pricingCommands)) {
			output = await runCommand(cmd);
			calledCommands.push({cmd: cmd, output: output});
		}
		return {calledCommands: calledCommands};
	};

	const priceInAnotherPcc = async  (cmd, target, dialect) => {
		const pnr = await getCurrentPnr();
		return (new RepriceInAnotherPccAction({gdsClients}))
			.execute(pnr, cmd, dialect, target, stateful);
	};

	const repriceInPccMix = (cleanCmd) => {
		const data = Parse_priceItinerary(cleanCmd);
		if (!data) {
			return Rej.NotImplemented('Unsupported pricing format: ' + cleanCmd);
		} else {
			const aliasData = {...data, dialect: 'sabre'};
			return RepriceInPccMix({stateful, gdsClients, aliasData});
		}
	};

	const processRequestedCommand = async  (cmd) => {
		let matches, result, reData, aliasData, reservation;

		const parsed = CommandParser.parse(cmd);
		if (php.preg_match(/^PNR$/, cmd, matches = [])) {
			return processSavePnr();
		} else if (php.preg_match(/^SORT$/, cmd, matches = [])) {
			return processSortItinerary();
		} else if (parsed.type === 'changePcc') {
			const result = await processRealCommand(cmd);
			if (php.array_key_exists('errors', result)) {
				return result;
			} else {
				result.calledCommands = forgePccChangeOutput(result.calledCommands, getSessionData().area);
				return result;
			}
		} else if (parsed.type === 'changeArea') {
			return changeArea(parsed.data);
		} else if (reData = AliasParser.parseRe(cmd)) {
			return processCloneItinerary(reData);
		} else if (aliasData = await AliasParser.parseStore(cmd, PtcUtil)) {
			return storePricing(aliasData);
		} else if (aliasData = await AliasParser.parsePrice(cmd, stateful)) {
			return priceAll(aliasData);
		} else if (aliasData = parseMultiPriceItineraryAlias(cmd)) {
			return multiPriceItinerary(aliasData);
		} else if (cmd === '/SS') {
			return rebookAsSs();
		} else if (php.preg_match(/^(FQ.*)\/MIX$/, cmd, matches = [])) {
			return getMultiPccTariffDisplay(matches[1]);
		} else if (!php.empty(reservation = await AliasParser.parseCmdAsPnr(cmd, stateful))) {
			return bookPnr(reservation, true);
		} else if (result = RepriceInAnotherPccAction.parseAlias(cmd)) {
			return priceInAnotherPcc(result.cmd, result.target, result.dialect);
		} else if (matches = cmd.match(/^(WP.*)\/MIX$/)) {
			return repriceInPccMix(matches[1]);
		} else {
			// not an alias
			return processRealCommand(cmd);
		}
	};

	const execute = async  (cmdRequested) => {
		const calledCommands = [];
		if (cmdRequested.match(/^.+\/MDA$/)) {
			// no /MDA in sabre
			cmdRequested = cmdRequested.slice(0, -'/MDA'.length);
		}
		const callResult = await processRequestedCommand(cmdRequested);
		const errors = callResult.errors;
		const messages = callResult.messages || [];
		const actions = callResult.actions || [];
		let status, userMessages;
		if (!php.empty(errors)) {
			status = GdsDirect.STATUS_FORBIDDEN;
			calledCommands.push(...callResult.calledCommands || []);
			userMessages = errors;
		} else {
			status = GdsDirect.STATUS_EXECUTED;
			calledCommands.push(...(callResult.calledCommands || []));
			userMessages = callResult.userMessages || [];
		}

		return {status, actions, calledCommands, messages, userMessages};
	};

	return execute(cmdRq);
};

module.exports = execute;
