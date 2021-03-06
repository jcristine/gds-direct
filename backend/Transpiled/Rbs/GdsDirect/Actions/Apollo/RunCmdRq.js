const GoToPcc = require('../../../../../Actions/GoToPcc.js');
const EnsurePcc = require('../../../../../Actions/EnsurePcc.js');
const GoToArea = require('../../../../../Actions/GoToArea.js');
const PnrStatusParser = require('gds-utils/src/text_format_processing/apollo/actions/PnrStatusParser.js');
const GkUtil = require('../../../../../Actions/BookViaGk/GkUtil.js');
const BookViaGk_apollo = require('../../../../../Actions/BookViaGk/BookViaGk_apollo.js');
const Parse_fareSearch = require('gds-utils/src/text_format_processing/apollo/commands/Parse_fareSearch.js');
const SortItinerary = require('../../../../../Actions/SortItinerary.js');
const CmdLogs = require('../../../../../Repositories/CmdLogs.js');
const PrepareHbFexMask = require('../../../../../Actions/PrepareHbFexMask.js');
const StorePricing_apollo = require('../../../../../Actions/StorePricing_apollo.js');
const RepriceInPccMix = require('../../../../../Actions/RepriceInPccMix.js');
const GdsSession = require('../../../../../GdsHelpers/GdsSession.js');
const RunCmdHelper = require('./RunCmdRq/RunCmdHelper.js');
const ModifyCmdOutput = require('./RunCmdRq/ModifyCmdOutput.js');
const RunRealCmd = require('./RunCmdRq/RunRealCmd.js');
const GetCurrentPnr = require('../../../../../Actions/GetCurrentPnr.js');

// utils
const php = require('klesun-node-tools/src/Transpiled/php.js');
const _ = require('lodash');

const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const TravelportUtils = require("../../../../../GdsHelpers/TravelportUtils.js");
const {fetchUntil, fetchAll, extractPager} = TravelportUtils;

const Rej = require('klesun-node-tools/src/Rej.js');
const {ignoreExc} = require('../../../../../Utils/TmpLib.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');
const UnprocessableEntity = require("klesun-node-tools/src/Rej").UnprocessableEntity;
const BadRequest = require("klesun-node-tools/src/Rej").BadRequest;
const Errors = require('../../../../Rbs/GdsDirect/Errors.js');

const CommonDataHelper = require('../../../../Rbs/GdsDirect/CommonDataHelper.js');
const GdsDirect = require('../../../../Rbs/GdsDirect/GdsDirect.js');
const CmsApolloTerminal = require('../../../../Rbs/GdsDirect/GdsInterface/CmsApolloTerminal.js');

// actions
const ApolloMakeMcoAction = require('../../../../Rbs/GdsAction/ApolloMakeMcoAction.js');
const MakeMcoApolloAction = require('../../../../Rbs/GdsDirect/Actions/Apollo/MakeMcoApolloAction.js');
const RepriceInAnotherPccAction = require('../../../../Rbs/GdsDirect/Actions/Common/RepriceInAnotherPccAction.js');
const EndManualPricing = require('../../../../../Actions/ManualPricing/EndManualPricing.js');
const GetMultiPccTariffDisplayAction = require('../../../../Rbs/GdsDirect/Actions/Common/GetMultiPccTariffDisplayAction.js');
const DisplayHistoryActionHelper = require('./DisplayHistoryActionHelper.js');

// parsers
const ItineraryParser = require('gds-utils/src/text_format_processing/apollo/pnr/ItineraryParser.js');
const CommandParser = require('gds-utils/src/text_format_processing/apollo/commands/CmdParser.js');
const AliasParser = require('../../../../../CmdTranslation/AliasParser.js');
const ApoAliasParser = require('../../../../../CmdTranslation/ApolloAliasParser.js');
const PnrHistoryParser = require('gds-utils/src/text_format_processing/apollo/PnrHistoryParser.js');
const TariffDisplayParser = require('../../../../Gds/Parsers/Apollo/TariffDisplay/TariffDisplayParser.js');
const NmeMaskParser = require("../../../../../Actions/ManualPricing/NmeMaskParser");

// 'SEGMENTS CANCELLED - NEXT REPLACES  1'
// 'CNLD FROM  1'
// '*** PROG SSR(S) DELETED ***'
// 'CNLD FROM  1'
const isSuccessXiOutput = (output) => {
	return php.preg_match(/^\s*SEGMENTS CANCELLED - NEXT REPLACES\s*\d+\s*(><)?$/, output)
		|| php.preg_match(/^[\s\S]*\s*CNLD FROM\s*\d+\s*(><)?$/, output)
		|| php.preg_match(/^\s*NEXT REPLACES\s*\d+\s*(><)?$/, output)
		|| output.match(/^\s*CANCEL REQUEST COMPLETED\s*(><)?$/) // 12NJ
	;
};

const isScrollingAvailable = (dumpPage) => {
	try {
		return extractPager(dumpPage)[1] === ')><';
	} catch (exc) {
		return false;
	}
};

const isSuccessRebookOutput = (dump) => {
	const isSegmentLine = (line) => ItineraryParser.parseSegmentLine('0 ' + line);
	return StringUtil.lines(dump).some(isSegmentLine);
};

const transformBuildError = (result) => {
	if (!result.success) {
		return Errors.getMessage(result.errorType, result.errorData);
	} else {
		return null;
	}
};

// Parse strings like '1,2,4-7,9'
const parseStringNumbersList = (numberString) => {
	const list = php.explode('|', numberString).map(a => +a);
	for (const [key, number] of Object.entries(list)) {
		const diapason = php.explode('-', number);
		if (php.isset(diapason[1])) {
			list[key] = diapason[0];
			for (let i = diapason[0]; i < diapason[1]; i++) {
				php.array_push(list, i + 1);
			}
		}
	}
	return php.array_values(php.array_unique(list.sort()));
};

const findLastCommandIn = (cmdTypes, calledCommands) => {
	let mrs = [];
	for (const cmdRecord of php.array_reverse(calledCommands)) {
		php.array_unshift(mrs, cmdRecord.output);
		const logCmdType = CommandParser.parse(cmdRecord.cmd).type;
		if (php.in_array(logCmdType, cmdTypes)) {
			cmdRecord.output = TravelportUtils.joinFullOutput(mrs);
			return cmdRecord;
		} else if (logCmdType !== 'moveRest') {
			mrs = [];
		}
	}
	return null;
};

/** @param stateful = await require('StatefulSession.js')() */
const RunCmdRq = ({
	stateful, cmdRq,
	CmdRqLog = require('../../../../../Repositories/CmdRqLog.js'),
	PtcUtil = require('../../../../Rbs/Process/Common/PtcUtil.js'),
	Pccs = require("../../../../../Repositories/Pccs.js"),
	gdsClients = GdsSession.makeGdsClients(),
}) => {
	const travelport = gdsClients.travelport;
	const agent = stateful.getAgent();
	const geo = stateful.getGeoProvider();

	const {
		flattenCmds,
		prepareToSavePnr,
		runCmd,
		runCommand,
	} = RunCmdHelper({stateful, gdsClients});

	const getSessionData = () => {
		return stateful.getSessionData();
	};

	const getAgent = () => {
		return stateful.getAgent();
	};

	const getLastTariffDisplay = async () => {
		const cmds = await stateful.getLog().getAllCommands();
		const tariffTypes = ['fareSearch', 'redisplayFareSearch'];
		const cmdRecord = findLastCommandIn(tariffTypes, cmds);
		if (!cmdRecord) {
			return Promise.reject('No recent D');
		} else {
			return TariffDisplayParser.parse(cmdRecord.output);
		}
	};

	const findOnLastTariffDisplay = async (lineNumber) => {
		if (lineNumber < 1 || lineNumber > 250) {
			return BadRequest('Invalid fare number - ' + lineNumber + ', out of range');
		}
		const parsed = await getLastTariffDisplay().catch(exc => null);
		if (parsed) {
			for (const fare of parsed.result || []) {
				if (fare.lineNumber == lineNumber) {
					return fare;
				}
			}
			return BadRequest('There is no fare #' + lineNumber + ' on last tariff display');
		}

		// could not find D in command log - try redisplaying it in GDS

		let requestedFare = null;
		const pages = [];
		await fetchUntil('*D', stateful, ({output}) => {
			if (output.match(/^\s*INVLD\s*$/)) {
				return BadRequest('No recent $D display in session');
			}
			pages.push(output);
			const parsed = TariffDisplayParser.parse(pages.join('\n'));
			if (parsed.errorType === 'needTariffDisplay') {
				return BadRequest('Need Tariff Display');
			} else if (parsed.error) {
				return UnprocessableEntity('Failed to parse tariff display - ' + parsed.error + ' - ' + output);
			}
			const fares = parsed.result || [];
			for (const fare of fares) {
				if (fare.lineNumber == lineNumber) {
					requestedFare = fare;
					return true;
				}
			}
		});
		return requestedFare
			? Promise.resolve(requestedFare)
			: UnprocessableEntity('Could not find fare #' + lineNumber + ' on last tariff display');
	};

	/** @return string|null - null means "not changed" */
	const preprocessPricingCommand = async (cmd, data) => {
		if (!data) {
			return null;
		}
		const {baseCmd, pricingModifiers} = data;
		const rawMods = [];
		for (const mod of pricingModifiers) {
			let matches;
			if (php.preg_match(/^@(\d+)$/, mod.raw, matches = [])) {
				const fare = await findOnLastTariffDisplay(matches[1]);
				if (fare) {
					rawMods.push('@' + fare.fareBasis);
				} else {
					rawMods.push(mod.raw);
				}
			} else {
				rawMods.push(mod.raw);
			}
		}
		const modsPart = rawMods.join('/');
		const leadingSlash =
			cmd.startsWith(baseCmd + '/') ||
			baseCmd === '$BBC';

		return baseCmd + (!leadingSlash ? '' : '/') + modsPart;
	};

	/** maybe should move this to ApoAliasParser ? */
	const preprocessCommand = async (cmd) => {
		let aliasData;
		const parsed = CommandParser.parse(cmd);
		if (cmd === 'MD') {
			const scrolledCmd = await getScrolledCmd();
			const scrolledType = !scrolledCmd ? null : CommandParser.parse(scrolledCmd).type;
			if (scrolledType === 'operationalInfo') {
				// "F:" shows output from airline's GDS and MR does not work there
				cmd = 'MD';
			} else if (scrolledCmd && StringUtil.startsWith(scrolledCmd, 'TI')) {
				// timatic screen uses TIPN instead of MD
				cmd = 'TIPN';
			} else if (scrolledCmd && scrolledCmd.startsWith('A')) {
				cmd = 'A*';
			} else if (scrolledCmd && scrolledCmd.startsWith('FS')) {
				const lastCmdRec = await stateful.getLog().getLastCalledCommand();
				if (extractPager(lastCmdRec.output)[1] === '><') {
					cmd = 'FSMORE';
				} else {
					cmd = 'MR';
				}
			} else {
				cmd = 'MR';
			}
		} else if (cmd === 'MU') {
			const scrolledCmd = await getScrolledCmd();
			if (scrolledCmd && scrolledCmd.startsWith('A')) {
				cmd = 'A-';
			}
		} else if (parsed.type === 'priceItinerary') {
			cmd = await preprocessPricingCommand(cmd, parsed.data) || cmd;
		} else if (aliasData = AliasParser.parseSameMonthReturnAvail(cmd)) {
			cmd = await _preprocessSameMonthReturnAvailability(aliasData.days);
		}
		return cmd;
	};

	const modifyOutput = async (calledCommand) => {
		return ModifyCmdOutput({
			cmdRq, calledCommand, stateful, CmdRqLog,
		});
	};

	const shouldFetchAll = (cmd) => {
		const type = CommandParser.parse(cmd).type;
		if (cmd.startsWith('$B') || type === 'storePricing') {
			const isConsidered = (errRec) => errRec.type === Errors.BAD_MOD_IGNORE_AVAILABILITY;
			const errorRecords = CmsApolloTerminal.checkPricingCmdObviousPqRuleRecords(cmd, getAgent());
			const consideredErrors = errorRecords.filter(isConsidered);
			return php.empty(consideredErrors);
		} else if (['ticketList', 'ticketMask'].includes(type)) {
			return true;
		} else {
			return false;
		}
	};

	/** @return Promise<string> - the command we are currently scrolling
	 * (last command that was not one of MD, MU, MT, MB */
	const getScrolledCmd = () => {
		return stateful.getSessionData().scrolledCmd;
	};

	const getCurrentPnr = async () => {
		return GetCurrentPnr.inApollo(stateful);
	};

	/** @param {Boolean} fallbackToGk - defines whether all segments should be booked together or with a separate command
	 *                       each. When you book them all at once, marriages are added, if separately - not */
	const bookItinerary = async ({itinerary, fallbackToGk}) => {
		stateful.flushCalledCommands();
		const built = await BookViaGk_apollo({
			bookRealSegments: true,
			withoutRebook: !fallbackToGk,
			session: stateful,
			baseDate: stateful.getStartDt(),
			itinerary, travelport,
		});
		stateful.updateAreaState({
			type: '!xml:PNRBFManagement',
			state: {hasPnr: true, canCreatePq: false},
		});
		stateful.flushCalledCommands();
		const sortResult = await processSortItinerary()
			.catch(coverExc(Rej.list, exc => ({errors: ['Did not SORT - ' + exc]})));

		const calledCommands = php.empty(sortResult.errors)
			// output of /0/1|2|3|9|7|6|8|4|5 holds the resulting PNR
			? stateful.flushCalledCommands().slice(-1)
			: [{cmd: '*R', output: (await getCurrentPnr()).getDump()}];
		return {
			calledCommands,
			userMessages: (built.messages || [])
				.filter(r => r.type === 'info')
				.map(r => r.text),
			errors: (built.messages || [])
				.filter(r => r.type === 'error')
				.map(r => r.text),
		};
	};

	const bookPassengers = async (passengers) => {
		// note that Amadeus has different format instead of this 'remark', so a
		// better approach would be to generate command for pure parsed dob/ptc
		const cmd = passengers
			.map(pax => {
				const infMark = pax.nameNumber.isInfant ? 'I/' : '';
				return 'N:' + infMark + pax.lastName + '/' + pax.firstName +
					(!pax.remark ? '' : '*' + pax.remark);
			})
			.join('|');
		const cmdRec = await runCmd(cmd);
		return {calledCommands: [cmdRec]};
	};

	const findDupeSegments = (itinerary, getMoreValues = null) => {
		getMoreValues = getMoreValues || ((seg) => []);
		itinerary = itinerary.map((s, i) => ({...s, position: +i + 1}));
		const grouped = _.groupBy(itinerary, s => JSON.stringify([
			s.airline, +s.flightNumber, s.departureDt,
			s.departureAirport, s.destinationAirport, ...getMoreValues(s),
		]));
		for (const [hash, dupes] of Object.entries(grouped)) {
			if (dupes.length > 1) {
				return dupes;
			}
		}
		return null;
	};

	const bookPnr = async (reservation) => {
		const passengers = reservation.passengers || [];
		let itinerary = reservation.itinerary || [];
		const errors = [];
		const allUserMessages = [];
		const calledCommands = [];
		if (reservation.pcc && reservation.pcc !== getSessionData().pcc) {
			const cmd = 'SEM/' + reservation.pcc + '/AG';
			const {cmdRec, userMessages} = await processRealCommand(cmd);
			allUserMessages.push(...userMessages);
			calledCommands.push(cmdRec);
		}
		if (passengers.length > 0) {
			const booked = await bookPassengers(passengers);
			errors.push(...(booked.errors || []));
			calledCommands.push(...(booked.calledCommands || []));
		}
		if (itinerary.length > 0) {
			// would be better to use number returned by ApolloBuildItineraryAction
			// as it may be not in same order in case of marriages...
			itinerary = itinerary.map((s, i) => ({...s,
				segmentNumber: +i + 1,
				segmentStatus: {
					'DK': 'SS', // amadeus
					'AK': 'GK', // galileo
					'HS': 'SS', // galileo
					'HK': 'SS', // airline does not add star when you book with HK status
				}[s.segmentStatus] || s.segmentStatus,
			}));
			const prevState = getSessionData();
			const booked = await bookItinerary({itinerary, fallbackToGk: true})
				.catch(coverExc([Rej.UnprocessableEntity], exc => {
					if (prevState.hasPnr) {
						if (exc.message.includes('DUPLICATE SEGMENT NOT PERMITTED') ||
							exc.message.includes('ENTRY NOT ALLOWED THIS AIRLINE') ||
							exc.message.includes('/*(RECORD LOCATOR)  OR  ')
						) {
							exc.message = 'Itinerary present - ' + exc.message;
							exc.httpStatusCode = Rej.BadRequest.httpStatusCode;
						}
					} else {
						if (exc.message.includes('DUPLICATE SEGMENT NOT PERMITTED') ||
							exc.message.includes('/*(RECORD LOCATOR)  OR  ')
						) {
							const dupes = findDupeSegments(itinerary);
							if (dupes) {
								exc.message = 'Duplicate segments at positions: ' +
									dupes.map(d => d.position).join(',') + ' - ' + exc.message;
								exc.httpStatusCode = Rej.BadRequest.httpStatusCode;
							}
						}
					}
					return Promise.reject(exc);
				}));
			errors.push(...(booked.errors || []));
			calledCommands.push(...(booked.calledCommands || []));
		}
		return {errors, userMessages: allUserMessages, calledCommands};
	};

	const rebookWithNewSeatAmount = async (seatNumber) => {
		let itinerary, i;
		if (php.empty(itinerary = (await getCurrentPnr()).getItinerary())) {
			return {errors: [Errors.getMessage(Errors.ITINERARY_IS_EMPTY)]};
		}
		await runCommand('XI', false);
		for (i = 0; i < php.count(itinerary); ++i) {
			itinerary[i].seatCount = seatNumber;
		}
		return bookItinerary({itinerary, fallbackToGk: true});
	};

	const rebookWithNewSeatAmountSpecificSegments = async (seatCount, numberString, segmentStatus) => {
		const itinerary = (await getCurrentPnr()).getItinerary();
		if (php.empty(itinerary)) {
			return {errors: [Errors.getMessage(Errors.ITINERARY_IS_EMPTY)]};
		}
		await runCommand('XI', false);
		const selectedItinerary = [];
		let matches;
		php.preg_match(/[\d\-\|]+/, numberString, matches = []);
		const segmentNumbers = parseStringNumbersList(matches[0] || '');
		for (let i = 0; i < php.count(itinerary); ++i) {
			if (php.in_array(itinerary[i].segmentNumber, segmentNumbers)) {
				itinerary[i].seatCount = seatCount;
				if (!php.empty(segmentStatus)) {
					itinerary[i].segmentStatus = segmentStatus;
				}
				selectedItinerary.push(itinerary[i]);
			}
		}
		return bookItinerary({itinerary: selectedItinerary, fallbackToGk: true});
	};

	/** 'X1/020JAN/CGK' */
	const rebookAsGk = async (data) => {
		let segNums = data.segmentNumbers;
		const bookingClass = data.bookingClass || null;
		const departureDate = data.departureDate || null;
		const pnr = await getCurrentPnr();
		const itinerary = pnr.getItinerary();
		segNums = segNums.length > 0 ? segNums :
			itinerary.map(s => s.segmentNumber);
		const newSegments = [];
		const expectedItinerary = [];
		for (const seg of itinerary) {
			if (php.in_array(seg.segmentNumber, segNums)) {
				if (bookingClass) {
					seg.bookingClass = bookingClass;
				}
				if (departureDate) {
					seg.departureDate = departureDate;
				}
				seg.segmentStatus = 'GK';
				newSegments.push(seg);
			}
			expectedItinerary.push(seg);
		}
		const dupes = findDupeSegments(expectedItinerary, s => [
			s.departureDate.raw, s.bookingClass,
		]);
		if (dupes) {
			const msg = 'Rebook would result in duplicate ' +
				'segments: ' + dupes.map(s => s.segmentNumber);
			return Rej.BadRequest(msg);
		}
		stateful.flushCalledCommands();
		const xOutput = await runCommand('X' + php.implode('|', segNums));
		if (!isSuccessXiOutput(xOutput)) {
			return {
				errors: ['Could not cancel segments - ' + php.trim(xOutput)],
				calledCommands: stateful.flushCalledCommands(),
			};
		}
		return bookItinerary({itinerary: newSegments, fallbackToGk: false})
			.catch(coverExc([Rej.UnprocessableEntity], exc => {
				if (bookingClass && exc.message.includes('CLASS NOT FOUND - PASSIVE PROHIBITED BY AIRLINE')) {
					exc.httpStatusCode = Rej.BadRequest.httpStatusCode;
					exc.message = 'Invalid RBD ' + bookingClass + ' - ' + exc.message;
				}
				return Promise.reject(exc);
			}));
	};

	const emulatePcc = async (pcc, recoveryPcc = null) => {
		recoveryPcc = recoveryPcc || getSessionData().pcc;
		let {calledCommands = [], userMessages = []} =
			await EnsurePcc({stateful, pcc, recoveryPcc});
		calledCommands = await Promise.all(calledCommands
			.map(calledCommand => modifyOutput(calledCommand)));
		return {calledCommands, userMessages};
	};

	const guessGkMarriages = async (itinerary) => {
		return GkUtil.guessGkMarriages(itinerary, geo);
	};

	const rebookAsSs = async (data) => {
		const fallbackToGk = data.method !== 'allowCutting';
		stateful.flushCalledCommands();
		const pnr = await getCurrentPnr();
		let itinerary = pnr.getReservation(stateful.getStartDt()).itinerary;
		itinerary = await guessGkMarriages(itinerary)
			.catch(coverExc([Rej.NotFound], exc => itinerary));
		itinerary = itinerary
			.filter((seg) => seg.segmentStatus === 'GK')
			.map((seg) => ({...seg, segmentStatus: 'NN'}));
		if (php.empty(itinerary)) {
			return {errors: ['No GK segments']};
		}
		const xCmd = 'X' + itinerary.map(s => s.segmentNumber).join('|');
		await runCommand(xCmd);
		return bookItinerary({itinerary, fallbackToGk});
	};

	const getMultiPccTariffDisplay = async (cmd) => {
		return (new GetMultiPccTariffDisplayAction()).execute(cmd, stateful);
	};

	const priceInAnotherPcc = async (cmd, target, dialect) => {
		const pnr = await getCurrentPnr();
		return (new RepriceInAnotherPccAction({gdsClients}))
			.execute(pnr, cmd, dialect, target, stateful);
	};

	const getEmptyAreas = () => {
		return getEmptyAreasFromDbState();
	};

	const getEmptyAreasFromDbState = () => {
		const isOccupied = (row) => row.hasPnr;
		const occupiedRows = Fp.filter(isOccupied, stateful.getAreaRows());
		const occupiedAreas = php.array_column(occupiedRows, 'area');
		occupiedAreas.push(getSessionData().area);
		return php.array_values(php.array_diff(['A', 'B', 'C', 'D', 'E'], occupiedAreas));
	};

	const prepareReArea = async (aliasData) => {
		const segmentStatus = aliasData.segmentStatus || 'GK';
		const sameAreaAllowed = aliasData.sameAreaAllowed || false;
		const pcc = aliasData.pcc || getSessionData().pcc;
		await CommonDataHelper.checkEmulatePccRights({stateful, pcc});

		let useSameArea = sameAreaAllowed && getSessionData().pcc === pcc;
		if (!getSessionData().isPnrStored &&
			!aliasData.keepOriginal &&
			(segmentStatus !== 'GK' || useSameArea)
		) {
			await ignoreWithoutWarning(); // ignore the itinerary in initial area
		} else {
			useSameArea = false;
		}
		if (useSameArea) {
			return Promise.resolve();
		}
		await GoToPcc({
			stateful, pcc,
			recoveryPcc: getSessionData().pcc,
			sameAreaForbidden: true,
		});
	};

	/** RE/2CV4/SS2 */
	const processCloneItinerary = async (aliasData) => {
		const segmentStatus = aliasData.segmentStatus || 'GK';
		const seatCount = aliasData.seatCount || 0;
		const segmentNumbers = aliasData.segmentNumbers || [];
		const reservation = (await getCurrentPnr())
			.getReservation(stateful.getStartDt());
		let itinerary = reservation
			.itinerary.filter(s => {
				return !segmentNumbers.length
					|| segmentNumbers.includes(+s.segmentNumber);
			});
		itinerary = await guessGkMarriages(itinerary)
			.catch(coverExc([Rej.NotFound], exc => itinerary));
		if (php.empty(itinerary)) {
			return {errors: [Errors.getMessage(Errors.ITINERARY_IS_EMPTY)]};
		}
		await prepareReArea(aliasData);
		itinerary = itinerary.map(seg => ({
			...seg, segmentStatus,
			seatCount: seatCount || seg.seatCount,
		}));
		const fallbackToGk = segmentStatus === 'SS';
		return bookItinerary({itinerary, fallbackToGk})
			.then(async actRs => {
				if (aliasData.withPassengers && php.empty(actRs.errors)) {
					const booked = await bookPassengers(reservation.passengers);
					actRs.calledCommands = [
						...(actRs.calledCommands || []),
						...booked.calledCommands,
					];
				}
				return actRs;
			})
			.catch(coverExc([Rej.UnprocessableEntity], exc => {
				if (exc.message.includes('CK ACTN CODE') &&
					!['GK', 'SS', 'NN', 'LL'].includes(segmentStatus)
				) {
					exc.message = 'Invalid status ' + segmentStatus + ' - ' + exc.message;
					exc.httpStatusCode = Rej.BadRequest.httpStatusCode;
				}
				return Promise.reject(exc);
			}));
	};

	const handlePnrSave = (recordLocator) => {
		stateful.handlePnrSave(recordLocator);
	};

	const processSavePnr = async () => {
		await CommonDataHelper.checkSavePnrRights({stateful, Pccs});

		const pnr = await getCurrentPnr();
		const pnrDump = pnr.getDump();
		let errors = null;
		if (!CommonDataHelper.isValidPnr(pnr)) {
			return {errors: [Errors.getMessage(Errors.INVALID_PNR, {response: php.trim(pnrDump)})]};
		} else if (!php.empty(errors = CommonDataHelper.checkSeatCount(pnr))) {
			return {errors: errors};
		}
		const usedCmds = await stateful.getLog().getCurrentPnrCommands();
		const flatCmds = flattenCmds(usedCmds);
		const usedCmdTypes = php.array_column(flatCmds, 'type');
		const login = getAgent().getLogin();
		let writeCommands = [
			'ER',
		];
		if (!php.in_array('addReceivedFrom', usedCmdTypes)) {
			php.array_unshift(writeCommands, 'R:' + php.strtoupper(login));
		}
		if (!php.in_array('addTicketingDateLimit', usedCmdTypes)) {
			php.array_unshift(writeCommands, 'T:TAU/' + php.strtoupper(php.date('dM', php.strtotime(stateful.getStartDt()))));
		}
		if (!php.in_array('addAgencyPhone', usedCmdTypes)) {
			php.array_unshift(writeCommands, 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT');
		}
		// Add accounting line ("customer account" in apollo docs): smth like DK number in Sabre
		if (php.in_array(getSessionData().pcc, ['2E8R', '1RZ2', '2G8P'])
			&& !php.in_array('addAccountingLine', usedCmdTypes)
		) {
			php.array_unshift(writeCommands, 'T-CA-SFO@$0221686');
		}
		writeCommands = php.array_merge(await prepareToSavePnr(), writeCommands);
		const cmd = php.implode('|', writeCommands);
		let output = (await runCmd(cmd)).output;
		const saveResult = PnrStatusParser.parseSavePnr(output);
		if (saveResult.success) {
			handlePnrSave(saveResult.recordLocator);
			output = (await runCmd('*R')).output;
		}
		const cmdRecord = {cmd: 'PNR', output: output};
		return {calledCommands: [cmdRecord]};
	};

	const processSortItinerary = async () => {
		const pnr = await getCurrentPnr();
		return SortItinerary.inApollo({
			gdsSession: stateful,
			itinerary: pnr.getReservation(stateful.getStartDt()).itinerary,
			geo,
		});
	};

	const multiPriceItinerary = async (aliasData) => {
		const calledCommands = [];
		for (const cmd of Object.values(aliasData.pricingCommands)) {
			const output = await runCommand(cmd, true);
			calledCommands.push({cmd, output});
		}
		return {calledCommands: calledCommands};
	};

	const makePriceAllCmd = (aliasData) => {
		const {requestedAgeGroups, ptcs, pricingModifiers = []} = aliasData;
		const rawMods = [];
		rawMods.push('N' + ptcs
			.map((ptc,i) => (i + 1) + '*' + ptc)
			.join('|'));
		if (requestedAgeGroups.every(g => ['child', 'infant'].includes(g.ageGroup))) {
			rawMods.push('ACC');
		}
		rawMods.push(...pricingModifiers.map(m => m.raw));
		return ['$B', ...rawMods].join('/');
	};

	const storePricing = async (aliasData) => {
		await CommonDataHelper.checkStorePricingPcc({stateful, Pccs});
		return StorePricing_apollo({
			stateful, aliasData, agent,
			gdsClients, PtcUtil, Pccs,
		});
	};

	const priceAll = async (aliasData) => {
		const cmd = makePriceAllCmd(aliasData);
		const {cmdRec, userMessages} = await processRealCommand(cmd, true);
		return {calledCommands: [cmdRec], userMessages};
	};

	const ignoreWithoutWarning = async () => {
		let output = await runCommand('I');
		if (php.preg_match(/^\s*THIS IS A NEW PNR-ALL DATA WILL BE IGNORED WITH NEXT I OR IR\s*(><)?$/, output)) {
			output = await runCommand('I');
		}
		const cmdRecord = {cmd: 'I', output: output};
		return {calledCommands: [cmdRecord]};
	};

	const displayHistory = async () => {
		const dump = (await runCmd('*HA', true)).output;
		const history = PnrHistoryParser.parse(dump);
		const display = DisplayHistoryActionHelper.display(history);
		return {calledCommands: [{cmd: '*HA', output: display}]};
	};

	/** @param int|null pageLimit - null means _all_ */
	const moveDownAll = async (pageLimit, calledCommands) => {
		pageLimit = pageLimit || 100;
		const newCalledCommands = [];
		const lastCommandArray = calledCommands;
		if (!php.empty(lastCommandArray)) {
			let output = '';
			for (let i = 0; i < pageLimit; i++) {
				let nextPage;
				if (lastCommandArray[i]) {
					nextPage = lastCommandArray[i].output;
				} else {
					const {cmdRec} = await processRealCommand('MR');
					nextPage = cmdRec.output;
				}

				output = (output ? extractPager(output)[0] : '') + nextPage;
				if (!isScrollingAvailable(nextPage)) {
					break;
				}
			}
			const cmd = lastCommandArray.length > 0 ? lastCommandArray[0].cmd : 'MDA';
			newCalledCommands.push({cmd, output});
		}
		return newCalledCommands;
	};

	const processRealCommand = async (cmd, fetchAll = false) => {
		return RunRealCmd({stateful, cmd, fetchAll, cmdRq, CmdRqLog, gdsClients, Pccs});
	};

	/** show availability for first successful city option */
	const makeMultipleCityAvailabilitySearch = async (aliasData) => {
		const {availability, cities, airlines} = aliasData;
		const calledCommands = [];
		// probably would make sense to do it in separate sessions simultaneously
		for (const city of cities) {
			const cmd = availability + city + airlines;
			const cmdRec = await stateful.runCmd(cmd);
			const output = cmdRec.output;
			calledCommands.push({cmd: cmd, output: output});
			if (php.preg_match('/^FIRAV/', output)) {
				// FIRAV means OK, got availability for a city - job's done
				break;
			}
		}
		return {
			calledCommands: calledCommands.slice(-1),
		};
	};

	/**
	 * imitation of Sabre >1R20; which shows return availability for 20 day of same month
	 */
	const _preprocessSameMonthReturnAvailability = async (day) => {
		const availsDesc = (await stateful.getLog().getLikeSql({
			where: [
				['area', '=', getSessionData().area],
				['type', 'IN', ['airAvailability', 'moreAirAvailability']],
			],
			limit: 20,
		}));
		for (const lastAvail of availsDesc) {
			const {type, data} = CommandParser.parse(lastAvail.cmd);
			const date = (data || {}).departureDate || (data || {}).returnDate;
			if (date) {
				const month = date.raw.slice(-3);
				return 'A*O' + day + month;
			}
			if (type === 'airAvailability' && !data && !CmdLogs.isInvalidFormat(lastAvail, 'apollo')) {
				return Rej.NotImplemented('Could not parse availability cmd >' + lastAvail.cmd + ';');
			}
		}
		return Rej.BadRequest('No recent availability to request return date from');
	};

	const prepareMcoMask = async () => {
		const getPaxName = pax => pax.lastName + '/' + pax.firstName;
		const pcc = getSessionData().pcc;
		const pccPointOfSaleCountry = await stateful.getPccDataProvider()('apollo', pcc)
			.then(r => r.point_of_sale_country).catch(exc => null);
		if (pccPointOfSaleCountry !== 'US') {
			return {errors: ['You\\\'re emulated to ' + pcc + '. Split MCO can be issued only in a USA PCC']};
		}
		const agent = stateful.getAgent();
		if (!agent.canUseMco()) {
			return {errors: ['Not allowed to use HHMCO']};
		}
		const pnr = await getCurrentPnr();
		if (!pnr.getRecordLocator()) {
			return {errors: ['Must be in a PNR']};
		}
		const passengerNames = Fp.map(getPaxName, php.array_filter(pnr.getPassengers()));
		const mcoMask = (await runCmd('HHMCO', true)).output;
		const pnrParams = await MakeMcoApolloAction.getMcoParams(pnr, mcoMask);
		if (!php.empty(pnrParams.errors)) {
			return {errors: pnrParams.errors};
		}
		const hasPredefinedPax = (php.count(passengerNames) === 1);
		const predefinedPax = hasPredefinedPax ? ArrayUtil.getFirst(passengerNames) : '';
		let mcoParams = [
			['passengerName', predefinedPax, !hasPredefinedPax],
			['amount', '', true],

			['amountCurrency', 'USD', false],

			['validatingCarrier', pnrParams.validatingCarrier, false],
			['to', pnrParams.validatingCarrier, false],
			['at', pnrParams.hub, false],
			['formOfPayment', pnrParams.fop, false],
			['expirationDate', pnrParams.expirationDate, false],
			['approvalCode', pnrParams.approvalCode, false],

			['issueNow', '', true],
		];
		for (const [key, value] of Object.entries(ApolloMakeMcoAction.getDefaultParams())) {
			if (!php.in_array(key, ['issueNow'])) {
				mcoParams.push([key, value, false]);
			}
		}
		mcoParams = mcoParams.map(field => {
			const [key, value, enabled] = field;
			return {key, value, enabled};
		});
		const calledCommands = [{
			cmd: 'HHMCO', output: 'SEE MCO FORM BELOW',
			tabCommands: [], clearScreen: true,
		}];
		const userMessages = [];
		return {
			calledCommands, userMessages,
			actions: [
				{
					type: 'displayMcoMask',
					data: {
						fields: mcoParams,
						passengers: passengerNames,
					},
				},
			],
		};
	};

	const prepareHhprMask = async (cmd) => {
		const output = (await runCmd(cmd)).output;
		const data = await NmeMaskParser.parse(output);
		return {
			calledCommands: [{
				cmd: cmd,
				output: 'SEE MASK FORM BELOW',
			}],
			actions: [{
				type: 'displayHhprMask',
				data: data,
			}],
		};
	};

	// Command parser expects clean command and not
	// output cmd that is preceded by >
	const extractDCommandFromOutput = output => {
		const match = output.match(/>(?<cmd>\D[^ ]+)/m);
		return match && match.groups.cmd || null;
	};

	/**
	 * @param {String} cmd = '$DBWASV'
	 * performs >$DBWASV20MAY25MAY;
	 *
	 * there is a >$DBWAS; format in GDS, but it does not preserve the 'V'-alidated
	 * fare indicator, that's why we were asked to implement an alias that would not
	 * require to retype the dates from last D, but would still return _validated_ fares
	 *
	 * "validated" means that fare is allowed by our contracts, that usually define stuff
	 * like MIN/MAX stay limitation, seasonality, advance purchase days limit, etc...
	 */
	const fareSearchValidatedChangeCity = async cmd => {
		const previousDb = (await stateful.getLog().getLikeSql({
			where: [
				['area', '=', getSessionData().area],
				['type', '=', 'fareSearch'],
			],
			limit: 1,
		}))[0];

		if (!previousDb) {
			// emulates same message as in console
			return {
				calledCommands: [{cmd, output: 'NEED TARIFF DISPLAY'}],
			};
		}

		// If shorthand command such as D is used then cmd itself is useless,
		// but we still can extract required data from command's output and that should
		// be present in every request response
		const raw = extractDCommandFromOutput(previousDb.output);
		let parsed = raw && Parse_fareSearch(raw);

		if (!parsed) {
			// $D is as fallback in case if last fareSearch entry in DB is invalid
			// (could happen if city code in last modification request is invalid)
			// but fare search request in session is still valid
			const dCmdOutput = await runCmd('$D');

			const raw = extractDCommandFromOutput(dCmdOutput.output);
			parsed = raw && Parse_fareSearch(raw);

			if (!parsed) {
				return {
					calledCommands: [{cmd, output: dCmdOutput.output}],
				};
			}
		}

		// Return date can potentially be missing if fare is only in one direction
		const newCommand = cmd + parsed.departureDate.raw + (parsed.returnDate ? parsed.returnDate.raw : '');

		const res = await processRealCommand(newCommand);

		return {
			calledCommands: [res.cmdRec],
		};
	};

	const assertPriceMix = ({type, data}) => {
		if (type !== 'priceItinerary' || !data) {
			return Promise.resolve(null);
		}
		const srcMods = data.pricingModifiers;
		// /MIX is our fake modifier that triggers reprice in multiple PCCs
		const cleanMods = srcMods.filter(m => m.raw !== 'MIX');
		if (srcMods.length === cleanMods.length) {
			// no /MIX in modifiers
			return Promise.resolve(null);
		} else {
			return RepriceInPccMix({stateful, gdsClients, aliasData: {
				dialect: 'apollo',
				baseCmd: data.baseCmd,
				pricingModifiers: cleanMods,
			}});
		}
	};

	const processRequestedCommand = async (cmd) => {
		let mdaData, limit, cmdReal, matches, $_, plus, seatAmount,
			segmentNumbers, segmentStatus;
		let reservation, result;
		const alias = await ApoAliasParser.parse(cmd, stateful, PtcUtil);
		const parsed = CommandParser.parse(cmd);
		if (mdaData = alias.moveDownAll || null) {
			limit = mdaData.limit || null;
			if (cmdReal = alias.realCmd) {
				const {cmdRec} = await processRealCommand(cmdReal, false);
				return {calledCommands: await moveDownAll(limit, [cmdRec])};
			} else {
				let mdCmdRows = await stateful.getLog().getScrolledCmdMrs();
				mdCmdRows = await Promise.all(mdCmdRows.map(cmdRec => modifyOutput(cmdRec)));
				const calledCommands = await moveDownAll(limit, mdCmdRows);
				return {calledCommands};
			}
		} else if (php.preg_match(/^PNR$/, cmd, matches = [])) {
			return processSavePnr();
		} else if (php.preg_match(/^HHMCO$/, cmd, matches = [])) {
			return prepareMcoMask();
		} else if (php.preg_match(/^HB(\d*):FEX\s*([\d\s]{13,}|)$/, cmd, matches = [])) {
			const [_, cmdStoreNumber, ticketNumber] = matches;
			return PrepareHbFexMask({stateful, cmdStoreNumber, ticketNumber, Pccs});
		} else if (['priceItineraryManually', 'manualStoreItinerary'].includes(parsed.type)) {
			return prepareHhprMask(cmd);
		} else if (
			['HBT', 'HBTA'].includes(cmd) ||
			parsed.type === 'manualStoreFareCalculation'
		) {
			return EndManualPricing({cmd, stateful: stateful});
		} else if (php.preg_match(/^SORT$/, cmd, matches = [])) {
			return processSortItinerary();
		} else if (alias.type === 'rebookInPcc') {
			return processCloneItinerary(alias.data);
		} else if (alias.type === 'multiPriceItinerary') {
			return multiPriceItinerary(alias.data);
		} else if (alias.type === 'storePricing') {
			return storePricing(alias.data);
		} else if (alias.type === 'priceAll') {
			return priceAll(alias.data);
		} else if (cmd === '*HA') {
			return displayHistory();
		} else if (cmd === '!aliasDoubleIgnore') {
			return ignoreWithoutWarning();
		} else if (php.preg_match(/^(\||\+)([1-9])$/, cmd, matches = [])) {
			[$_, plus, seatAmount] = matches;
			return rebookWithNewSeatAmount(seatAmount);
		} else if (php.preg_match(/^(\||\+)([1-9])(S[\d\-\|]+)([A-Z]{2}|)$/, cmd, matches = [])) {
			[$_, plus, seatAmount, segmentNumbers, segmentStatus] = matches;
			return rebookWithNewSeatAmountSpecificSegments(seatAmount, segmentNumbers, segmentStatus);
		} else if (alias.type === 'rebookAsGk') {
			return rebookAsGk(alias.data);
		} else if (alias.type === 'rebookAsSs') {
			return rebookAsSs(alias.data);
		} else if (alias.type === 'fareSearchMultiPcc') {
			return getMultiPccTariffDisplay(alias.realCmd);
		} else if (alias.type === 'priceInAnotherPcc') {
			return priceInAnotherPcc(alias.realCmd, alias.data.target, alias.data.dialect);
		} else if (alias.type === 'multiDstAvail') {
			return makeMultipleCityAvailabilitySearch(alias.data);
		} else if (php.preg_match(/^SEM\/([\w\d]{3,4})\/AG$/, cmd, matches = [])) {
			return emulatePcc(matches[1]);
		} else if (!php.empty(reservation = await AliasParser.parseCmdAsPnr(cmd, stateful))) {
			return bookPnr(reservation);
		} else if (result = await assertPriceMix(parsed)) {
			return result;
		} else if (alias.type === 'fareSearchValidatedChangeCity') {
			return fareSearchValidatedChangeCity(alias.realCmd);
		} else {
			cmd = alias.realCmd;
			const fetchAll = shouldFetchAll(cmd);
			cmd = await preprocessCommand(cmd);
			const {cmdRec, userMessages, performanceDebug} = await processRealCommand(cmd, fetchAll);
			return {calledCommands: [cmdRec], userMessages, performanceDebug};
		}
	};

	const execute = async () => {
		const callResult = await processRequestedCommand(cmdRq)
			.catch(exc =>
				Rej.BadRequest.matches(exc.httpStatusCode) ||
				Rej.Forbidden.matches(exc.httpStatusCode)
					? ({errors: [exc + '']})
					: Promise.reject(exc));

		if (callResult.then) {
			// way too often I accidentally pass Promise here...
			const unwrapped = await callResult.catch(exc => ({error: exc + ''}));
			const msg = 'Code mistake, call result was a promise inside another promise';
			return Rej.InternalServerError(msg, unwrapped);
		}
		const errors = callResult.errors || [];
		const messages = callResult.messages || [];

		let status, calledCommands, userMessages, actions;
		if (!php.empty(errors)) {
			status = GdsDirect.STATUS_FORBIDDEN;
			calledCommands = callResult.calledCommands || [];
			userMessages = errors;
			actions = callResult.actions || [];
		} else {
			status = GdsDirect.STATUS_EXECUTED;
			calledCommands = callResult.calledCommands || [];
			userMessages = callResult.userMessages || [];
			actions = callResult.actions || [];
		}
		return {status, calledCommands, userMessages, messages, actions};
	};

	return execute();
};

module.exports = RunCmdRq;
