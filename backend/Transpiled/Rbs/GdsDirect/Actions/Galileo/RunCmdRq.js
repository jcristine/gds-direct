const Parse_priceItinerary = require('gds-utils/src/text_format_processing/galileo/commands/Parse_priceItinerary.js');
const TranslatePricingCmd = require('../../../../../Actions/CmdTranslators/TranslatePricingCmd.js');
const NormalizePricingCmd = require('gds-utils/src/cmd_translators/NormalizePricingCmd.js');
const SortItinerary = require('../../../../../Actions/SortItinerary.js');
const RepriceInPccMix = require('../../../../../Actions/RepriceInPccMix.js');
const GdsSession = require('../../../../../GdsHelpers/GdsSession.js');
const GetCurrentPnr = require('../../../../../Actions/GetCurrentPnr.js');

const CmsGalileoTerminal = require("../../GdsInterface/CmsApolloTerminal");

const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const getRbsPqInfo = require("../../../../../GdsHelpers/RbsUtils").getRbsPqInfo;
const fetchAll = require("../../../../../GdsHelpers/TravelportUtils").fetchAll;
const {withFakeNames} = require("../../../../../GdsHelpers/GalileoUtils.js");
const DateTime = require('../../../../Lib/Utils/DateTime.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const GalileoPnrCommonFormatAdapter = require('../../../../Rbs/FormatAdapters/GalileoPnrCommonFormatAdapter.js');
const GalileoBuildItineraryAction = require('../../../../Rbs/GdsAction/GalileoBuildItineraryAction.js');
const RepriceInAnotherPccAction = require('../../../../Rbs/GdsDirect/Actions/Common/RepriceInAnotherPccAction.js');
const GetMultiPccTariffDisplayAction = require('../../../../Rbs/GdsDirect/Actions/Common/GetMultiPccTariffDisplayAction.js');
const AliasParser = require('../../../../Rbs/GdsDirect/AliasParser.js');
const CommonDataHelper = require('../../../../Rbs/GdsDirect/CommonDataHelper.js');
const Errors = require('../../../../Rbs/GdsDirect/Errors.js');
const GdsDirect = require('../../../../Rbs/GdsDirect/GdsDirect.js');
const UpdateGalileoSessionStateAction = require('../../SessionStateProcessor/UpdateGalileoState.js');
const GenericRemarkParser = require('../../../../Gds/Parsers/Common/GenericRemarkParser.js');
const CommandParser = require('gds-utils/src/text_format_processing/galileo/commands/CmdParser.js');
const PnrParser = require('../../../../Gds/Parsers/Galileo/Pnr/PnrParser.js');
const GalileoPnr = require('../../../../Rbs/TravelDs/GalileoPnr.js');
const RebuildInPccAction = require('./RebuildInPccAction.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const GalileoRetrieveTicketsAction = require('../../../../Rbs/Process/Apollo/ImportPnr/Actions/RetrieveApolloTicketsAction.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const {onDemand} = require('klesun-node-tools/src/Lang.js');

const doesStorePnr = (cmd) => {
	let parsedCmd, flatCmds, cmdTypes;

	parsedCmd = CommandParser.parse(cmd);
	flatCmds = php.array_merge([parsedCmd], parsedCmd.followingCommands || []);
	cmdTypes = php.array_column(flatCmds, 'type');
	return !php.empty(php.array_intersect(cmdTypes, ['storePnr', 'storeKeepPnr']));
};

const doesOpenPnr = (cmd) => {
	let parsedCmd;

	parsedCmd = CommandParser.parse(cmd);
	return php.in_array(parsedCmd.type, ['openPnr', 'searchPnr', 'displayPnrFromList']);
};

const isSuccessfulFsCommand = (cmd, dump) => {
	let keywords, type, isFsCmd, isFsSuccessful;

	keywords = [
		'ITINERARY OPTIONS RETURNED',
		'PRICING OPTION',
	];

	type = (CommandParser.parse(cmd) || {}).type || '';
	isFsCmd = php.in_array(type, CommonDataHelper.getCountedFsCommands());
	isFsSuccessful = Fp.any((keyword) => {
		return StringUtil.contains(dump, keyword);
	}, keywords);

	return isFsCmd && isFsSuccessful;
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

const extendPricingCmd = (mainCmd, newPart) => {
	let mainParsed, isFullCmd, newParsed, mainMods, newMods, rawMods;

	mainParsed = CommandParser.parse(mainCmd);
	if (mainParsed.type !== 'priceItinerary' || !mainParsed.data) {
		return null;
	}
	if (php.preg_match(/^\d/, newPart)) {
		newPart = 'S' + newPart;
	}
	if (!StringUtil.startsWith(newPart, 'FQ')) {
		isFullCmd = false;
		newPart = mainParsed.data.baseCmd + '/' + newPart;
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
	return [newParsed.data.baseCmd].concat(rawMods).join('/');
};

const translateApolloPricingModifier = (mod) => {

	if (mod.type === 'validatingCarrier') {
		return 'C' + mod.parsed;
	} else {
		return null;
	}
};

const parseMultiPriceItineraryAlias = (cmd) => {
	let parts, mainCmd, followingCommands, cmds;

	if (php.preg_match(/^FQ.*(&)\S.*$/, cmd)) {
		parts = php.preg_split(/&/g, cmd);
		mainCmd = php.array_shift(parts);
		followingCommands = parts.map((cmdPart) => extendPricingCmd(mainCmd, cmdPart));
		if (!Fp.any(cmd => !cmd, followingCommands)) {
			cmds = php.array_merge([mainCmd], followingCommands);
			return {pricingCommands: cmds};
		}
	}
	return null;
};

/** @param stateful = require('StatefulSession.js')() */
const RunCmdRq = ({
	stateful, cmdRq,
	PtcUtil = require('../../../../Rbs/Process/Common/PtcUtil.js'),
	useXml = true,
	gdsClients = GdsSession.makeGdsClients(),
}) => {
	const travelport = gdsClients.travelport;

	/** @param data = Galileo\CommandParser::parseChangePnrRemarks().data */
	const checkChangeRemarks = async (data) => {
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

	/** @return Promise<string> - the command we are currently scrolling
 * (last command that was not one of MD, MU, MT, MB */
	const getScrolledCmd =  () => {
		return stateful.getSessionData().scrolledCmd;
	};

	const getSessionData =  () => {
		return stateful.getSessionData();
	};

	/** @return string|null - null means "not changed" */
	const preprocessAvailCmd = async (parsed) => {
		const getRows = onDemand(() => stateful.getLog().getLikeSql({
			where: [
				['type', '=', 'airAvailability'],
				['area', '=', getSessionData().area],
			],
			limit: 20,
		}));
		const match = parsed.cmd.match(/^AR(\d+)$/);
		if (match) {
			const day = match[1];
			const availsDesc = await getRows();
			for (const lastAvail of availsDesc) {
				const {type, data} = CommandParser.parse(lastAvail.cmd);
				const date = (data || {}).departureDate || (data || {}).returnDate;
				if (date) {
					const month = date.raw.slice(-3);
					const cmd = 'AR' + day + month;
					parsed = CommandParser.parse(cmd);
					break;
				}
			}
		}
		const {type, data} = parsed;
		if (type === 'airAvailability' && data && data.isReturn) {
			// add mods from original availability request
			let typeToMod = php.array_combine(
				php.array_column(data.modifiers || [], 'type'),
				php.array_column(data.modifiers || [], 'raw')
			);
			const cmdRows = await getRows();
			for (const cmdRow of cmdRows) {
				const oldParsed = CommandParser.parse(cmdRow.cmd);
				const oldTypeToMod = php.array_combine(
					php.array_column((oldParsed.data || {}).modifiers || [], 'type'),
					php.array_column((oldParsed.data || {}).modifiers || [], 'raw')
				);
				typeToMod = php.array_merge(oldTypeToMod, typeToMod);
				if ((oldParsed.data || {}).destinationAirport) {
					// the start of current availability
					break;
				}
			}
			return 'AR' + (data.orderBy || '') + ((data.departureDate || {}).raw || '')
				+ data.departureAirport + data.destinationAirport
				+ php.implode('', typeToMod);
		} else {
			return null;
		}
	};

	/** @return string|null - null means "not changed" */
	const preprocessPricingCmd =  (data) => {
		let mods, typeToData, needsAccompanying, typeToMods, rawMods, ptcs;

		mods = data.pricingModifiers || [];
		typeToData = php.array_combine(php.array_column(mods, 'type'),
			php.array_column(mods, 'parsed'));
		needsAccompanying = (ptc) => php.in_array(PtcUtil.parsePtc(ptc).ageGroup, ['infant', 'child']);
		typeToMods = Fp.groupBy((mod) => mod.type, mods);
		if (!php.empty(typeToMods.accountCode) && typeToMods.accountCode[0].raw === '-T') {
		// not real account code, just an alias
			delete (typeToMods.accountCode);
			mods = Fp.flatten(typeToMods);
			rawMods = php.array_column(mods, 'raw');
			ptcs = php.array_column((typeToData.passengers || {}).ptcGroups || [], 'ptc');
			if (!php.empty(ptcs) && Fp.all(needsAccompanying, php.array_filter(ptcs))) {
				rawMods.push('ACCITX'); // accompanied by ITX adult
			}
			rawMods.push('-TPACK'); // tour code
			rawMods.push('TA0GF'); // ticketing agency PCC 0GF
			rawMods.push(':P'); // private fare
			return data.baseCmd + '/' + php.implode('/', rawMods);
		} else {
			return null;
		}
	};

	const preprocessCommand = async (cmd) => {
		let parsed;

		parsed = CommandParser.parse(cmd);
		if (cmd === 'MD') {
			cmd = 'MR';
		} else if (cmd.startsWith('A')) {
			cmd = await preprocessAvailCmd(parsed) || cmd;
		} else if (parsed.type === 'priceItinerary') {
			cmd = await preprocessPricingCmd(parsed.data) || cmd;
		}
		return cmd;
	};

	const makeCmdMessages = async (cmd, output) => {
		let userMessages, type, agent, left, fsLeftMsg;

		userMessages = [];
		type = CommandParser.parse(cmd).type;
		if (php.in_array(type, CommonDataHelper.getCountedFsCommands())) {
			agent = stateful.getAgent();
			left = agent.getFsLimit() - await agent.getFsCallsUsed();
			fsLeftMsg = left + ' FS COMMANDS REMAINED';
			userMessages.push(fsLeftMsg);
		}
		return userMessages;
	};

	const modifyOutput = async (calledCommand) => {
		let scrolledCmd, cmdParsed, type, output, lines, modsLine, split, blocks, isNotAlex, pad, filtered,
			pcc, isOk;

		scrolledCmd = (await getScrolledCmd()) || calledCommand.cmd;
		cmdParsed = CommandParser.parse(scrolledCmd);
		type = cmdParsed.type;
		if (php.in_array(type, ['searchPnr', 'displayPnrFromList']) &&
		!GalileoPnr.makeFromDump(calledCommand.output).getRecordLocator() &&
		!stateful.getAgent().canOpenPrivatePnr()
		) {
		// '   711M-S*                        ',
		// '001 01SMITH/JOHN         20SEP  002 01SMITH/MARGARETH    20SEP',
		// '003 01SMITH/MICHALE      20SEP  004 01SMITH/CALEB        23SEP',

			output = StringUtil.wrapLinesAt(calledCommand.output, 64);
			lines = StringUtil.lines(output);
			modsLine = php.array_shift(lines);

			split = (line) => php.str_split(line, 32);
			blocks = Fp.flatten(Fp.map(split, lines));

			isNotAlex = (block) => !StringUtil.contains(block, 'WEINSTEIN/ALEX');
			blocks = php.array_values(Fp.filter(isNotAlex, blocks));

			pad = (block) => php.str_pad(block, 32);
			blocks = Fp.map(pad, blocks);

			filtered = Fp.map('rtrim', Fp.map('implode', php.array_chunk(blocks, 2)));
			php.array_unshift(filtered, modsLine);
			calledCommand.output = php.implode(php.PHP_EOL, filtered);
		}
		if (type === 'changePcc' && cmdParsed.data) {
			pcc = cmdParsed.data.pcc;
			isOk = UpdateGalileoSessionStateAction.wasPccChangedOk(calledCommand.output);
			if (isOk) {
				calledCommand.output = 'YOU HAVE SUCCESSFULLY EMULATED TO ' + pcc;
			}
		}
		return calledCommand;
	};

	const makeCreatedForCmdIfNeeded = async () => {
		let cmdLog, sessionData, agent, remarkCmd, flatPerformedCmds;

		cmdLog = stateful.getLog();
		sessionData = cmdLog.getSessionData();
		if (!sessionData.isPnrStored) {
			agent = stateful.getAgent();
			const msg = await CommonDataHelper.createCredentialMessage(stateful);
			remarkCmd = 'NP.' + msg;
			flatPerformedCmds = php.array_column(await getFlatUsedCmds(), 'cmd');

			if (!php.in_array(remarkCmd, flatPerformedCmds)) {
				return remarkCmd;
			}
		}
		return null;
	};

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

	const getFlatUsedCmds = async () => {
		let usedCmds;

		usedCmds = await stateful.getLog().getCurrentPnrCommands();
		return flattenCmds(usedCmds);
	};

	const runCmd = async (cmd, shouldFetchAll) => {
		const cmdRec = shouldFetchAll
			? await fetchAll(cmd, stateful)
			: await stateful.runCmd(cmd);
		if (isSuccessfulFsCommand(cmd, cmdRec.output)) {
			stateful.handleFsUsage();
		}
		return cmdRec;
	};

	const runCommand = async (cmd, fetchAll) => {
		return (await runCmd(cmd, fetchAll)).output;
	};

	const getCurrentPnr = async () => {
		return GetCurrentPnr.inGalileo(stateful);
	};

	const areAllCouponsVoided = async () => {
		let reservation, ticketInfo, ticket, isVoid;

		reservation = GalileoPnrCommonFormatAdapter.transform((await getCurrentPnr()).getParsedData(),
			stateful.getStartDt());
		ticketInfo = await (new GalileoRetrieveTicketsAction())
			.setSession(stateful).execute(reservation);
		if (!php.empty(ticketInfo.error)) {
			return false;
		}
		for (ticket of Object.values(ticketInfo.tickets)) {
			isVoid = (seg) => seg.couponStatus === 'VOID';
			if (!php.empty(ticket.error) ||
			!Fp.all(isVoid, ticket.segments)
			) {
				return false;
			}
		}
		return true;
	};

	const getStoredPnr = async () => {
		if (getSessionData().isPnrStored) {
			return getCurrentPnr();
		} else {
			return null;
		}
	};

	const checkIsForbidden = async (cmd) => {
		const errors = [];
		const parsedCmd = CommandParser.parse(cmd);
		const flatCmds = php.array_merge([parsedCmd], parsedCmd.followingCommands || []);
		const type = parsedCmd.type;
		const agent = stateful.getAgent();
		const isQueueCmd =
			php.in_array(type, CommonDataHelper.getQueueCommands()) ||
			cmd.startsWith('Q'); // to be extra sure

		if (php.in_array(type, CommonDataHelper.getTicketingCommands())) {
			if (!agent.canIssueTickets()) {
				errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd: cmd, type: type}));
			}
		} else if (php.in_array(type, CommonDataHelper.getCountedFsCommands())) {
			const totalAllowed = agent.getFsLimit();
			if (!totalAllowed) {
				errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd: cmd, type: type}));
			} else if (await agent.getFsCallsUsed() >= totalAllowed) {
				errors.push(Errors.getMessage(Errors.FS_LIMIT_EXHAUSTED, {totalAllowed: totalAllowed}));
			}
		} else if (isQueueCmd && !php.in_array(type, ['movePnrToQueue'])) {
			if (!agent.canProcessQueues()) {
				errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd: cmd, type: type || 'queueOperation'}));
			}
		} else if (type === 'searchPnr') {
			if (!agent.canSearchPnr()) {
				errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd: cmd, type: type}));
			}
		} else if (php.in_array(type, CommonDataHelper.getTotallyForbiddenCommands())) {
			errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {cmd: cmd, type: type}));
		}
		if (php.in_array('deletePnrField', php.array_column(flatCmds, 'type'))) {
			if (!agent.canEditTicketedPnr()) {
				const pnr = await getStoredPnr();
				if (pnr) {
					const canChange = !pnr.hasEtickets()
						|| agent.canEditVoidTicketedPnr()
						&& await areAllCouponsVoided();
					if (!canChange) {
						errors.push(Errors.getMessage(Errors.CANT_CHANGE_TICKETED_PNR));
					}
				}
			}
		}
		const remarkOrderChanged = flatCmds.some((parsed) => StringUtil.startsWith(parsed.cmd, 'NP./'));
		for (const flatCmd of Object.values(flatCmds)) {
			if (flatCmd.type === 'changePnrRemarks') {
				if (remarkOrderChanged) {
				// it's hard to predict which exactly remark will be removed,
				// so better forbid to make sure it is not GD- remark
					errors.push('Forbidden command, do not use >NP./...; and >' + flatCmd.cmd + '; at the same time');
				} else {
					errors.push(...await checkChangeRemarks(flatCmd.data));
				}
			}
		}
		return errors;
	};

	const callImplicitCommandsBefore = async (cmd) => {
		let calledCommands, remarkCmd;

		calledCommands = [];
		if (doesStorePnr(cmd)) {
			if (remarkCmd = await makeCreatedForCmdIfNeeded()) {
			// we don't show it - no adding to calledCommands
				await runCommand(remarkCmd, false);
			}
		}
		return calledCommands;
	};

	const callImplicitCommandsAfter = async (cmdRecord, calledCommands, userMessages) => {
		let savedPnr, rloc, parsed, isAlex;

		calledCommands.push(await modifyOutput(cmdRecord));
		if (doesStorePnr(cmdRecord.cmd)) {
			savedPnr = GalileoPnr.makeFromDump(cmdRecord.output);
			if (rloc = savedPnr.getRecordLocator()) {
				stateful.handlePnrSave(rloc);
			}
		} else if (doesOpenPnr(cmdRecord.cmd)) {
			parsed = PnrParser.parse(cmdRecord.output);
			isAlex = (pax) => {
				return pax.lastName === 'WEINSTEIN'
				&& pax.firstName === 'ALEX';
			};
			if (Fp.any(isAlex, (parsed.passengers || {}).passengerList || []) &&
			!stateful.getAgent().canOpenPrivatePnr()
			) {
				await runCommand('I', false);
				return {errors: ['Restricted PNR']};
			}
		}
		return {calledCommands: calledCommands, userMessages: userMessages};
	};

	const processRealCommand = async (cmd, shouldFetchAll = false) => {
		let calledCommands, errors, userMessages;

		calledCommands = [];
		cmd = await preprocessCommand(cmd);
		if (!php.empty(errors = await checkIsForbidden(cmd))) {
			return {errors: errors};
		}
		calledCommands = php.array_merge(calledCommands, await callImplicitCommandsBefore(cmd));
		const cmdRec = await runCmd(cmd, shouldFetchAll);
		userMessages = await makeCmdMessages(cmdRec.cmd, cmdRec.output);
		return callImplicitCommandsAfter(cmdRec, calledCommands, userMessages);
	};

	const moveDownAll = async (limit) => {
		let pageLimit, mds, pages, lastPage, nextPage, cleanDumps, output, calledCommand, calledCommands;

		pageLimit = limit || 100;
		mds = await stateful.getLog().getLastCommandsOfTypes(['moveRest']);
		if (php.empty(mds)) {
			return {userMessages: ['There is nothing to scroll']};
		}
		pages = php.array_column(mds, 'output');
		lastPage = ArrayUtil.getLast(pages);
		let i = pages.length;
		while (CmsGalileoTerminal.isScrollingAvailable(lastPage) && i < pageLimit) {
			nextPage = await runCommand('MR', false);
			if (nextPage === lastPage) {
				break;
			}
			lastPage = nextPage;
			pages.push(lastPage);
			++i;
		}
		cleanDumps = Fp.map((...args) => CmsGalileoTerminal.trimScrollingIndicator(...args), pages);
		output = php.implode('', cleanDumps);
		calledCommand = {cmd: 'MDA', output: output};
		calledCommand = await modifyOutput(calledCommand);
		calledCommands = [calledCommand];
		return {calledCommands: calledCommands};
	};

	const runAndMoveDownAll = async (cmdReal, limit) => {
		let result, moved;

		result = await processRealCommand(cmdReal);
		if (php.empty(result.errors)) {
			moved = await moveDownAll(limit);
			if (php.empty(moved.errors)) {
				result.calledCommands = moved.calledCommands;
			}
			result.userMessages = php.array_merge(result.userMessages || [],
				moved.userMessages || []);
			result.errors = moved.errors || [];
		}
		return result;
	};

	const processSavePnr = async () => {
		let pcc, pnr, pnrDump, errors, flatCmds, usedCmdTypes, performedCmds, login, writeCommands, remarkCmd,
			cmd, output, savedPnr, rloc, cmdRecord;

		pcc = getSessionData().pcc;
		pnr = await getCurrentPnr();
		pnrDump = pnr.getDump();
		if (!CommonDataHelper.isValidPnr(pnr)) {
			return {errors: [Errors.getMessage(Errors.INVALID_PNR, {response: php.trim(pnrDump)})]};
		} else if (!php.empty(errors = CommonDataHelper.checkSeatCount(pnr))) {
			return {errors: errors};
		}
		flatCmds = await getFlatUsedCmds();
		usedCmdTypes = php.array_column(flatCmds, 'type');
		performedCmds = php.array_column(flatCmds, 'cmd');
		login = stateful.getAgent().getLogin();
		writeCommands = [
			'ER',
		];

		if (!php.in_array('addReceivedFrom', usedCmdTypes)) {
			php.array_unshift(writeCommands, 'R.' + php.strtoupper(login));
		}
		if (!php.in_array('addTicketingDateLimit', usedCmdTypes)) {
			php.array_unshift(writeCommands, 'T.TAU/' + php.strtoupper(php.date('dM', php.strtotime(stateful.getStartDt()))));
		}
		if (!php.in_array('addAgencyPhone', usedCmdTypes)) {
			php.array_unshift(writeCommands, 'P.SFOR*800-750-2238 ASAP CUSTOMER SUPPORT');
		}
		if (remarkCmd = await makeCreatedForCmdIfNeeded()) {
			php.array_unshift(writeCommands, remarkCmd);
		}
		if (pcc === '80DJ' && !php.in_array('ID.C/ID4ITNGB80DJ', performedCmds)) {
			php.array_unshift(writeCommands, 'ID.C/ID4ITNGB80DJ');
		}

		cmd = php.implode('|', writeCommands);
		output = await runCommand(cmd, true);
		savedPnr = GalileoPnr.makeFromDump(output);
		if (rloc = savedPnr.getRecordLocator()) {
			stateful.handlePnrSave(rloc);
		}

		cmdRecord = {cmd: 'PNR', output: output};
		return {calledCommands: [cmdRecord]};
	};

	const bookPassengers = async (passengers) => {
	// note that Amadeus has different format instead of 'remark', so a
	// better approach would be to generate command for pure parsed dob/ptc
		const cmd = passengers
			.map(pax => {
				const infMark = pax.nameNumber.isInfant ? 'I/' : '';
				return 'N.' + infMark + pax.lastName + '/' + pax.firstName +
					(!pax.remark ? '' : '*' + pax.remark);
			})
			.join('|');
		const cmdRec = await runCmd(cmd);
		return {calledCommands: [cmdRec]};
	};

	const bookPnr = async (reservation) => {
		const pcc = reservation.pcc || null;
		const passengers = reservation.passengers || [];
		let itinerary = reservation.itinerary || [];
		const errors = [];
		const allUserMessages = [];
		const calledCommands = [];

		if (reservation.pcc && pcc !== getSessionData().pcc) {
		// probably it would make more sense to pass the PCC to the RebuildInPccAction...
			const cmd = 'SEM/' + pcc + '/AG';
			const {calledCommands, userMessages} = await processRealCommand(cmd);
			allUserMessages.push(...userMessages);
			calledCommands.push(...calledCommands);
		}
		if (passengers.length > 0) {
			const booked = await bookPassengers(passengers);
			errors.push(...(booked.errors || []));
			calledCommands.push(...(booked.calledCommands || []));
		}
		if (itinerary.length > 0) {
		// would be better to use number returned by GalileoBuildItineraryAction
		// as it may be not in same order in case of marriages...
			itinerary = itinerary.map((s, i) => ({...s, segmentNumber: +i + 1}));
			const result = await (new RebuildInPccAction({
				useXml, travelport, baseDate: stateful.getStartDt(),
			})).setSession(stateful)
				.fallbackToAk(true).bookItinerary(itinerary);
			let cmdRecs = stateful.flushCalledCommands();
			if (php.empty(result.errors)) {
				cmdRecs = cmdRecs.slice(-1); // keep just the ending *R
			}
			errors.push(...(result.errors || []));
			calledCommands.push(...cmdRecs);
		}
		return {errors, userMessages: allUserMessages, calledCommands};
	};

	const processSortItinerary = async () => {
		const pnr = await getCurrentPnr();
		return SortItinerary.inGalileo({
			gdsSession: stateful,
			itinerary: pnr.getReservation(stateful.getStartDt()).itinerary,
			geo: stateful.getGeoProvider(),
		});
	};

	const getEmptyAreas =  () => {
		let isOccupied, occupiedRows, occupiedAreas;

		isOccupied = (row) => row.hasPnr;
		occupiedRows = Fp.filter(isOccupied, stateful.getAreaRows());
		occupiedAreas = php.array_column(occupiedRows, 'area');
		occupiedAreas.push(getSessionData().area);
		return php.array_values(php.array_diff(['A', 'B', 'C', 'D', 'E'], occupiedAreas));
	};

	const processCloneItinerary = async (aliasData) => {
		const pcc = aliasData.pcc;
		const segmentStatus = aliasData.segmentStatus || 'AK';
		const seatNumber = aliasData.seatCount || 0;

		await CommonDataHelper.checkEmulatePccRights({stateful, pcc});
		const itinerary = (await getCurrentPnr()).getItinerary();
		if (php.empty(itinerary)) {
			return {errors: [Errors.getMessage(Errors.ITINERARY_IS_EMPTY)]};
		}
		const emptyAreas = getEmptyAreas();
		if (php.empty(emptyAreas)) {
			return {errors: [Errors.getMessage(Errors.NO_FREE_AREAS)]};
		}
		if (!getSessionData().isPnrStored && !aliasData.keepOriginal && segmentStatus !== 'AK') {
			await runCommand('I', false); // ignore the itinerary it initial area
		}
		const area = emptyAreas[0];
		const isSellStatus = php.in_array(segmentStatus, ['HS', 'SS']);
		for (const [key, segment] of Object.entries(itinerary)) {
			if (seatNumber >= 1 && seatNumber <= 9) {
				itinerary[key].seatCount = seatNumber;
			}
			itinerary[key].segmentStatus = ({
			// you have to sell in NN to get HS status in Galileo
				SS: 'NN',
				HS: 'NN',
				GK: 'AK',
			} || {})[segmentStatus] || segmentStatus;
		}
		stateful.flushCalledCommands();
		const result = await (new RebuildInPccAction({
			useXml, travelport, baseDate: stateful.getStartDt(),
		})).setSession(stateful)
			.fallbackToAk(isSellStatus).execute(area, pcc, itinerary);
		let calledCommands = stateful.flushCalledCommands();
		if (php.empty(result.errors)) {
		// if no error - show only the result
			calledCommands = php.array_slice(calledCommands, -1);
		}
		result.calledCommands = calledCommands;
		return result;
	};

	const rebookAsSs = async () => {
		stateful.flushCalledCommands();
		const akSegments = (await getCurrentPnr()).getItinerary()
			.filter((seg) => seg.segmentStatus === 'AK');
		if (php.empty(akSegments)) {
			return {errors: ['No AK segments']};
		}
		const xCmd = 'X' + php.array_column(akSegments, 'segmentNumber').join('.');
		await runCommand(xCmd, false);
		const newSegs = akSegments.map((seg) => {
			seg.segmentStatus = 'NN';
			return seg;
		});

		const result = await GalileoBuildItineraryAction({
			session: stateful,
			baseDate: stateful.getStartDt(),
			useXml,
			travelport,
			itinerary: newSegs,
			isParserFormat: true,
		});

		if (useXml && result.segments.length > 0) {
			stateful.updateAreaState({
				type: '!xml:PNRBFManagement',
				state: {hasPnr: true, canCreatePq: false},
			});
		}

		const error = RebuildInPccAction.transformBuildError(result);
		if (error) {
			return {
				calledCommands: stateful.flushCalledCommands(),
				errors: [error],
			};
		} else {
			const output = await runCommand('*R', true);
			return {
				calledCommands: [{cmd: '*R', output: output}],
			};
		}
	};

	const getMultiPccTariffDisplay =  (realCmd) => {
		return (new GetMultiPccTariffDisplayAction())
			.execute(realCmd, stateful);
	};

	const _fetchPricing = async (cmd) => {
		const shouldFetchAll = !cmd.startsWith('FQBA') && !cmd.startsWith('FQBBK');
		const result = await processRealCommand(cmd, shouldFetchAll);
		if (shouldFetchAll && !php.empty(result.calledCommands)) {
			const fqOutput = result.calledCommands[0].output;
			if (!UpdateGalileoSessionStateAction.isErrorPricingRs(fqOutput)) {
				const linearCmdRec = await runCmd('F*Q', true);
				result.calledCommands.push(linearCmdRec);
			}
		}
		return result;
	};

	const priceItinerary = async (cmd, cmdData) => {
		const addedRealName = (cmdRec) => {
			return cmdRec.type === 'addName'
				&& !StringUtil.startsWith(cmdRec.cmd, 'N.FAKE/');
		};
		const flatUsedCmds = await getFlatUsedCmds();
		const hasNamesInPnr = getSessionData().isPnrStored
			|| Fp.any(addedRealName, flatUsedCmds);

		const price = () => _fetchPricing(cmd);
		let result;
		if (!hasNamesInPnr) {
			result = await withFakeNames({
				session: stateful,
				pricingModifiers: cmdData.pricingModifiers || [],
				action: price,
			});
		} else {
			result = await price();
		}
		return result;
	};

	/** @param cmdData = require('FqCmdParser.js').parse() */
	const processPriceItinerary = async (cmd, cmdData) => {
		const srcMods = cmdData.pricingModifiers;
		// /MIX is our fake modifier that triggers reprice in multiple PCCs
		const cleanMods = srcMods.filter(m => m.raw !== 'MIX');
		if (srcMods.length > cleanMods.length) {
			return RepriceInPccMix({stateful, gdsClients, aliasData: {
				dialect: 'galileo',
				baseCmd: cmdData.baseCmd,
				pricingModifiers: cleanMods,
			}});
		} else {
			return priceItinerary(cmd, cmdData);
		}
	};

	const needsColonN = async (fqDump, pnr) => {
		let linearDump;

		linearDump = await runCommand('F*Q', true);
		const joined = fqDump + '\n' + linearDump;
		const rbsInfo = await getRbsPqInfo(pnr.getDump(), joined, 'galileo').catch(exc => ({}));
		return rbsInfo.isPrivateFare && rbsInfo.isBrokenFare;
	};

	const translateMods = async (apolloPricingModifiers) => {
		const normalized = NormalizePricingCmd.inApollo({
			type: 'storePricing',
			data: {
				baseCmd: 'B',
				pricingModifiers: apolloPricingModifiers,
			},
		});
		const galileoRawMods = [];
		for (const mod of normalized.pricingModifiers) {
			const effectiveMods = [];
			if (TranslatePricingCmd.mod_galileo(effectiveMods, mod)) {
				galileoRawMods.push(...effectiveMods);
			} else {
				const msg = mod.type
					? 'Unsupported Apollo modifier - ' + mod.type + ' - ' + mod.raw
					: 'Unsupported modifier - ' + mod.raw;
				return Rej.NotImplemented(msg);
			}
		}
		return galileoRawMods;
	};

	const makeStorePricingCmd = async (pnr, aliasData, needsColonN) => {
		let adultPtc = aliasData.ptc || 'ADT';
		if (needsColonN && adultPtc === 'ITX') {
			adultPtc = 'ADT';
		}
		const errors = CommonDataHelper.checkSeatCount(pnr);
		if (!php.empty(errors)) {
			return Rej.BadRequest('Invalid PNR - ' + errors.join('; '));
		}
		const tripEndDate = ((ArrayUtil.getLast(pnr.getItinerary()) || {}).departureDate || {}).parsed;
		const tripEndDt = tripEndDate ? DateTime.addYear(tripEndDate, stateful.getStartDt()) : null;

		const paxCmdParts = [];
		for (const [i, pax] of Object.entries(pnr.getPassengers())) {
			const ptc = await PtcUtil.convertPtcAgeGroup(adultPtc, pax, tripEndDt);
			paxCmdParts.push(pax.nameNumber.absolute + '*' + ptc);
		}

		let cmd = 'FQP' + paxCmdParts.join('.');
		if (needsColonN) {
			cmd += '/:N';
		}
		const customMods = await translateMods(aliasData.pricingModifiers);
		cmd += customMods.map(m => '/' + m).join('');

		return {cmd, paxCmdParts};
	};

	const makePriceAllCmd = async (aliasData) => {
		const {requestedAgeGroups, ptcs, pricingModifiers = []} = aliasData;
		const rawMods = [];
		rawMods.push('P' + ptcs
			.map((ptc,i) => (i + 1) + '*' + ptc)
			.join('.'));
		if (requestedAgeGroups.every(g => ['child', 'infant'].includes(g.ageGroup))) {
			rawMods.push('/ACC');
		}
		const customMods = await translateMods(pricingModifiers);
		rawMods.push(...customMods);
		const cmd = 'FQ' + rawMods.map(m => '/' + m).join('');
		return Promise.resolve(cmd);
	};

	const storePricing = async (aliasData) => {
		const pnr = await getCurrentPnr();
		if (pnr.getItinerary().length === 0) {
			return Rej.BadRequest('No itinerary to price');
		} else if (pnr.getPassengers().length === 0) {
			return Rej.BadRequest('No passenger names in PNR');
		}
		let storeCmdRec = await makeStorePricingCmd(pnr, aliasData, false);

		let output = await runCommand(storeCmdRec.cmd, true);
		const calledCommands = [];
		if (StringUtil.contains(output, 'PRIVATE FARE SELECTED')) {
			if (await needsColonN(output, pnr)) {
				storeCmdRec = await makeStorePricingCmd(pnr, aliasData, true);
				output = await runCommand(storeCmdRec.cmd, false);
				calledCommands.push({cmd: storeCmdRec.cmd, output});
			} else if (php.count(storeCmdRec.paxCmdParts) > 1) {
				// private fare can only be stored with a separate cmd per PTC
				for (const paxCmdPart of storeCmdRec.paxCmdParts) {
					storeCmdRec = 'FQP' + paxCmdPart;
					output = await runCommand(storeCmdRec, false);
					calledCommands.push({cmd: storeCmdRec, output});
				}
			} else {
				calledCommands.push({cmd: storeCmdRec.cmd, output});
			}
		} else {
			calledCommands.push({cmd: storeCmdRec.cmd, output});
		}
		if (stateful.getSessionData().isPnrStored) {
			const login = stateful.getAgent().getLogin().toUpperCase();
			const erCmdRec = await runCmd('R.' + login + '|ER');
			calledCommands.push(erCmdRec);
		}

		return {calledCommands};
	};

	const priceAll = async (aliasData) => {
		const cmd = await makePriceAllCmd(aliasData);
		const cmdData = Parse_priceItinerary(cmd);
		return priceItinerary(cmd, cmdData);
	};

	const multiPriceItinerary = async (aliasData) => {
		let calledCommands, cmd, output;

		calledCommands = [];
		for (cmd of Object.values(aliasData.pricingCommands)) {
			output = await runCommand(cmd, true);
			calledCommands.push({cmd: cmd, output: output});
		}
		return {calledCommands: calledCommands};
	};

	const priceInAnotherPcc = async (cmd, target, dialect) => {
		const pnr = await getCurrentPnr();
		return (new RepriceInAnotherPccAction({gdsClients}))
			.execute(pnr, cmd, dialect, target, stateful);
	};

	const processRequestedCommand = async (cmd) => {
		let mdaData, cmdReal, matches,
			reData, aliasData, result, reservation;

		const parsed = CommandParser.parse(cmd);
		if (mdaData = AliasParser.parseMda(cmd)) {
			const limit = mdaData.limit || null;
			if (cmdReal = mdaData.realCmd) {
				return runAndMoveDownAll(cmdReal, limit || null);
			} else {
				return moveDownAll(limit);
			}
		} else if (php.preg_match(/^PNR$/, cmd, matches = [])) {
			return processSavePnr();
		} else if (php.preg_match(/^SORT$/, cmd, matches = [])) {
			return processSortItinerary();
		} else if (reData = AliasParser.parseRe(cmd)) {
			return processCloneItinerary(reData);
		} else if (aliasData = parseMultiPriceItineraryAlias(cmd)) {
			return multiPriceItinerary(aliasData);
		} else if (aliasData = await AliasParser.parseStore(cmd, PtcUtil)) {
			return storePricing(aliasData);
		} else if (aliasData = await AliasParser.parsePrice(cmd, stateful)) {
			return priceAll(aliasData);
		} else if (cmd === '/SS') {
			return rebookAsSs();
		} else if (php.preg_match(/^(FD.*)\/MIX$/, cmd, matches = [])) {
			return getMultiPccTariffDisplay(matches[1]);
		} else if (result = RepriceInAnotherPccAction.parseAlias(cmd)) {
			return priceInAnotherPcc(result.cmd, result.target, result.dialect);
		} else if (parsed.type === 'priceItinerary') {
			return processPriceItinerary(cmd, parsed.data);
		} else if (!php.empty(reservation = await AliasParser.parseCmdAsPnr(cmd, stateful))) {
			return bookPnr(reservation);
		} else {
			return processRealCommand(cmd);
		}
	};

	const execute = async (cmdRequested) => {
		const callResult = await processRequestedCommand(cmdRequested);
		const errors = callResult.errors || null;
		const messages = callResult.messages || [];
		const actions = callResult.actions || [];
		let status, calledCommands, userMessages;
		if (!php.empty(errors)) {
			status = GdsDirect.STATUS_FORBIDDEN;
			calledCommands = callResult.calledCommands || [];
			userMessages = errors;
		} else {
			status = GdsDirect.STATUS_EXECUTED;
			calledCommands = callResult.calledCommands || [];
			userMessages = callResult.userMessages || [];
		}
		return {status, actions, messages, calledCommands, userMessages};
	};

	return execute(cmdRq);
};

module.exports = RunCmdRq;
