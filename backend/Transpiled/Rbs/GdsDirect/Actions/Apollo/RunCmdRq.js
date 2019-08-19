const RunCmdHelper = require('./RunCmdRq/RunCmdHelper.js');
const ModifyCmdOutput = require('./RunCmdRq/ModifyCmdOutput.js');
const RunRealCmd = require('./RunCmdRq/RunRealCmd.js');
const GetCurrentPnr = require('../../../../../Actions/GetCurrentPnr.js');

// utils
const php = require('klesun-node-tools/src/Transpiled/php.js');
const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const DateTime = require('../../../../Lib/Utils/DateTime.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const TravelportUtils = require("../../../../../GdsHelpers/TravelportUtils.js");
const {fetchUntil, fetchAll, extractPager} = TravelportUtils;
const {findSegmentNumberInPnr} = require('../Common/ItinerarySegments');

const Rej = require('klesun-node-tools/src/Rej.js');
const {ignoreExc} = require('../../../../../Utils/TmpLib.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');
const UnprocessableEntity = require("klesun-node-tools/src/Rej").UnprocessableEntity;
const BadRequest = require("klesun-node-tools/src/Rej").BadRequest;
const Errors = require('../../../../Rbs/GdsDirect/Errors.js');

const CommonDataHelper = require('../../../../Rbs/GdsDirect/CommonDataHelper.js');
const GdsDirect = require('../../../../Rbs/GdsDirect/GdsDirect.js');
const CmsApolloTerminal = require('../../../../Rbs/GdsDirect/GdsInterface/CmsApolloTerminal.js');
const ApolloPnr = require('../../../../Rbs/TravelDs/ApolloPnr.js');

// actions
const ApolloBuildItineraryAction = require('../../../GdsAction/ApolloBuildItinerary.js');
const ApolloMakeMcoAction = require('../../../../Rbs/GdsAction/ApolloMakeMcoAction.js');
const MakeMcoApolloAction = require('../../../../Rbs/GdsDirect/Actions/Apollo/MakeMcoApolloAction.js');
const RepriceInAnotherPccAction = require('../../../../Rbs/GdsDirect/Actions/Common/RepriceInAnotherPccAction.js');
const EndManualPricing = require('../../../../../Actions/ManualPricing/EndManualPricing.js');
const GetMultiPccTariffDisplayAction = require('../../../../Rbs/GdsDirect/Actions/Common/GetMultiPccTariffDisplayAction.js');
const DisplayHistoryActionHelper = require('./DisplayHistoryActionHelper.js');

// parsers
const ItineraryParser = require('../../../../Gds/Parsers/Apollo/Pnr/ItineraryParser.js');
const CommandParser = require('../../../../Gds/Parsers/Apollo/CommandParser.js');
const TApolloSavePnr = require('../../../../Rbs/GdsAction/Traits/TApolloSavePnr.js');
const AliasParser = require('../../../../Rbs/GdsDirect/AliasParser.js');
const ApoAliasParser = require('../../../../../Parsers/Apollo/AliasParser.js');
const getRbsPqInfo = require("../../../../../GdsHelpers/RbsUtils").getRbsPqInfo;
const PnrHistoryParser = require('../../../../Gds/Parsers/Apollo/PnrHistoryParser.js');
const McoListParser = require("../../../../Gds/Parsers/Apollo/Mco/McoListParser");
const McoMaskParser = require("../../../../Gds/Parsers/Apollo/Mco/McoMaskParser");
const TariffDisplayParser = require('../../../../Gds/Parsers/Apollo/TariffDisplay/TariffDisplayParser.js');
const ParseHbFex = require('../../../../../Parsers/Apollo/ParseHbFex.js');
const NmeMaskParser = require("../../../../../Actions/ManualPricing/NmeMaskParser");

const TicketHistoryParser = require("../../../../Gds/Parsers/Apollo/TicketHistoryParser");

// 'SEGMENTS CANCELLED - NEXT REPLACES  1'
// 'CNLD FROM  1'
const isSuccessXiOutput = ($output) => {
	return php.preg_match(/^\s*SEGMENTS CANCELLED - NEXT REPLACES\s*\d+\s*(><)?$/, $output)
		|| php.preg_match(/^\s*CNLD FROM\s*\d+\s*(><)?$/, $output);
};

const isScrollingAvailable = ($dumpPage) => {
	let $exc;
	try {
		return extractPager($dumpPage)[1] === ')><';
	} catch ($exc) {
		return false;
	}
};

const isSuccessRebookOutput = ($dump) => {
	let $isSegmentLine;
	$isSegmentLine = ($line) => ItineraryParser.parseSegmentLine('0 ' + $line);
	return Fp.any($isSegmentLine, StringUtil.lines($dump));
};

const transformBuildError = ($result) => {
	if (!$result['success']) {
		return Errors.getMessage($result['errorType'], $result['errorData']);
	} else {
		return null;
	}
};

// Parse strings like '1,2,4-7,9'
const parseStringNumbersList = ($numberString) => {
	let $list, $key, $number, $diapason, $i;
	$list = php.explode('|', $numberString).map(a => +a);
	for ([$key, $number] of Object.entries($list)) {
		$diapason = php.explode('-', $number);
		if (php.isset($diapason[1])) {
			$list[$key] = $diapason[0];
			for ($i = $diapason[0]; $i < $diapason[1]; $i++) {
				php.array_push($list, $i + 1);
			}
		}
	}
	return php.array_values(php.array_unique($list.sort()));
};

const findLastCommandIn = ($cmdTypes, $calledCommands) => {
	let $mrs, $cmdRecord, $logCmdType;
	$mrs = [];
	for ($cmdRecord of php.array_reverse($calledCommands)) {
		php.array_unshift($mrs, $cmdRecord['output']);
		$logCmdType = CommandParser.parse($cmdRecord['cmd'])['type'];
		if (php.in_array($logCmdType, $cmdTypes)) {
			$cmdRecord['output'] = TravelportUtils.joinFullOutput($mrs);
			return $cmdRecord;
		} else if ($logCmdType !== 'moveRest') {
			$mrs = [];
		}
	}
	return null;
};

/** @param stateful = await require('StatefulSession.js')() */
let RunCmdRq = ({
	stateful, cmdRq,
	CmdRqLog = require('../../../../../Repositories/CmdRqLog.js'),
	PtcUtil = require('../../../../Rbs/Process/Common/PtcUtil.js'),
	Pccs = require("../../../../../Repositories/Pccs.js"),
	travelport = require('../../../../../GdsClients/TravelportClient.js')(),
	useXml = true,
}) => {
	const {
		flattenCmds,
		prepareToSavePnr,
		checkEmulatedPcc,
		runCmd,
		runCommand,
	} = RunCmdHelper({stateful});

	const getSessionData = () => {
		return stateful.getSessionData();
	};

	const getAgent = () => {
		return stateful.getAgent();
	};

	const getLastTariffDisplay = async () => {
		let $cmds = await stateful.getLog().getAllCommands();
		let $tariffTypes = ['fareSearch', 'redisplayFareSearch'];
		let $cmdRecord = findLastCommandIn($tariffTypes, $cmds);
		if (!$cmdRecord) {
			return Promise.reject('No recent $D');
		} else {
			return TariffDisplayParser.parse($cmdRecord['output']);
		}
	};

	const findOnLastTariffDisplay = async (lineNumber) => {
		if (lineNumber < 1 || lineNumber > 250) {
			return BadRequest('Invalid fare number - ' + lineNumber + ', out of range');
		}
		let parsed = await getLastTariffDisplay().catch(exc => null);
		if (parsed) {
			for (let fare of parsed.result || []) {
				if (fare.lineNumber == lineNumber) {
					return fare;
				}
			}
			return BadRequest('There is no fare #' + lineNumber + ' on last tariff display');
		}

		// could not find $D in command log - try redisplaying it in GDS

		let requestedFare = null;
		let pages = [];
		await fetchUntil('*$D', stateful, ({output}) => {
			pages.push(output);
			let parsed = TariffDisplayParser.parse(pages.join('\n'));
			if (parsed.errorType === 'needTariffDisplay') {
				return BadRequest('Need Tariff Display');
			} else if (parsed.error) {
				return UnprocessableEntity('Failed to parse tariff display - ' + parsed.error + ' - ' + output);
			}
			let fares = parsed.result || [];
			for (let fare of fares) {
				if (fare['lineNumber'] == lineNumber) {
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
	const preprocessPricingCommand = async ($data) => {
		let $rawMods, $mod, $matches, $fare;
		if (!$data) return null;
		$rawMods = [];
		for ($mod of Object.values($data['pricingModifiers'])) {
			if (php.preg_match(/^@(\d+)$/, $mod['raw'], $matches = [])) {
				if ($fare = await findOnLastTariffDisplay($matches[1])) {
					$rawMods.push('@' + $fare['fareBasis']);
				} else {
					$rawMods.push($mod['raw']);
				}
			} else {
				$rawMods.push($mod['raw']);
			}
		}
		return $data['baseCmd'] + ($rawMods.length ? '/' + php.implode('/', $rawMods) : '');
	};

	/** maybe should move this to ApoAliasParser ? */
	const preprocessCommand = async ($cmd) => {
		let aliasData;
		let $parsed = CommandParser.parse($cmd);
		if ($cmd === 'MD') {
			let scrolledCmd = await getScrolledCmd();
			let scrolledType = !scrolledCmd ? null : CommandParser.parse(scrolledCmd).type;
			if (scrolledType === 'operationalInfo') {
				// "F:" shows output from airline's GDS and MR does not work there
				$cmd = 'MD';
			} else if (scrolledCmd && StringUtil.startsWith(scrolledCmd, 'TI')) {
				// timatic screen uses TIPN instead of MD
				$cmd = 'TIPN';
			} else if (scrolledCmd && scrolledCmd.startsWith('A')) {
				$cmd = 'A*';
			} else if (scrolledCmd && scrolledCmd.startsWith('FS')) {
				let lastCmdRec = await stateful.getLog().getLastCalledCommand();
				if (extractPager(lastCmdRec.output)[1] === '><') {
					$cmd = 'FSMORE';
				} else {
					$cmd = 'MR';
				}
			} else {
				$cmd = 'MR';
			}
		} else if ($cmd === 'MU') {
			let scrolledCmd = await getScrolledCmd();
			if (scrolledCmd && scrolledCmd.startsWith('A')) {
				$cmd = 'A-';
			}
		} else if ($parsed['type'] === 'priceItinerary') {
			$cmd = await preprocessPricingCommand($parsed['data']) || $cmd;
		} else if (aliasData = AliasParser.parseSameMonthReturnAvail($cmd)) {
			$cmd = await _preprocessSameMonthReturnAvailability(aliasData.days);
		}
		return $cmd;
	};

	const modifyOutput = async (calledCommand) => {
		return ModifyCmdOutput({
			cmdRq, calledCommand, stateful, CmdRqLog,
		});
	};

	const shouldFetchAll = ($cmd) => {
		let $type, $isConsidered, $errorRecords, $consideredErrors;
		$type = CommandParser.parse($cmd)['type'];
		if (StringUtil.startsWith($cmd, '$B') || $type === 'storePricing') {
			$isConsidered = ($errRec) => $errRec['type'] === Errors.BAD_MOD_IGNORE_AVAILABILITY;
			$errorRecords = CmsApolloTerminal.checkPricingCmdObviousPqRuleRecords($cmd);
			$consideredErrors = Fp.filter($isConsidered, $errorRecords);
			return php.empty($consideredErrors);
		} else if (php.in_array($type, ['ticketList', 'ticketMask'])) {
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

	/** replace GK segments with $segments */
	const rebookGkSegments = async ($segments, reservation = null) => {
		let $marriageToSegs = Fp.groupMap(($seg) => $seg['marriage'], $segments);
		let $failedSegNums = [];
		for (let [, $segs] of $marriageToSegs) {
			let records = $segs.map(gkSeg => {
				const cls = gkSeg.bookingClass;
				return {segNum: findSegmentNumberInPnr(gkSeg, reservation && reservation.itinerary), cls};
			});
			let $chgClsCmd =
				'X' + php.implode('+', records.map(r => r.segNum)) + '/' +
				'0' + php.implode('+', records.map(r => r.segNum + r.cls));
			let $chgClsOutput = (await runCmd($chgClsCmd, true)).output;
			if (!isSuccessRebookOutput($chgClsOutput)) {
				$failedSegNums = php.array_merge($failedSegNums, php.array_column($segs, 'segmentNumber'));
			}
		}
		return {'failedSegmentNumbers': $failedSegNums};
	};

	const buildItinerary = async ({itinerary}) => {
		let built = await ApolloBuildItineraryAction({
			travelport: travelport,
			itinerary: itinerary,
			baseDate: stateful.getStartDt(),
			useXml: useXml,
			session: stateful,
		});
		if (built.segmentsSold > 0) {
			stateful.updateAreaState({
				type: '!xml:PNRBFManagement',
				state: {hasPnr: true, canCreatePq: false},
			});
		}
		return built;
	};

	/** @param {Boolean} $fallbackToGk - defines whether all segments should be booked together or with a separate command
	 *                       each. When you book them all at once, marriages are added, if separately - not */
	const bookItinerary = async ($itinerary, $fallbackToGk) => {
		let $isGkRebookPossible, $newItinerary, $gkSegments, $result, $error,
			$failedSegNums, $sortResult;
		stateful.flushCalledCommands();
		$isGkRebookPossible = ($seg) => {
			return $fallbackToGk
				&& $seg['segmentStatus'] !== 'GK';
		};
		$newItinerary = Fp.map(($seg) => {
			$seg = {...$seg};
			if ($isGkRebookPossible($seg)) {
				// any different booking class will do, since it's GK
				$seg['bookingClass'] = $seg['bookingClass'] !== 'Y' ? 'Y' : 'Z';
				$seg['segmentStatus'] = 'GK';
			}
			return $seg;
		}, $itinerary);
		$gkSegments = Fp.filter($isGkRebookPossible, $itinerary);
		$result = await buildItinerary({itinerary: $newItinerary});
		if ($error = transformBuildError($result)) {
			return {
				'calledCommands': stateful.flushCalledCommands(),
				'errors': [$error],
			};
		} else {
			let $gkRebook = await rebookGkSegments($gkSegments, $result.reservation);
			let errors = [];
			if (!php.empty($failedSegNums = $gkRebook['failedSegmentNumbers'])) {
				errors.push(Errors.getMessage(Errors.REBUILD_FALLBACK_TO_GK, {'segNums': php.implode(',', $failedSegNums)}));
			}
			stateful.flushCalledCommands();
			$sortResult = await processSortItinerary()
				.catch(coverExc([Rej.NoContent], exc => ({errors: ['Did not SORT - ' + exc]})));
			if (php.empty($sortResult['errors'])) {
				let calledCommands = stateful.flushCalledCommands().slice(-1);
				return {calledCommands, errors};
			} else {
				let pnrDump = (await getCurrentPnr()).getDump();
				let cmdRec = {cmd: '*R', output: pnrDump};
				return {'calledCommands': [cmdRec], 'errors': errors};
			}
		}
	};

	const bookPassengers = async (passengers) => {
		// note that Amadeus has different format instead of this 'remark', so a
		// better approach would be to generate command for pure parsed dob/ptc
		let cmd = passengers
			.map(pax => 'N:' + pax.lastName + '/' + pax.firstName +
				(!pax.remark ? '' : '*' + pax.remark))
			.join('|');
		let cmdRec = await runCmd(cmd);
		return {calledCommands: [cmdRec]};
	};

	const bookPnr = async (reservation) => {
		let passengers = reservation.passengers || [];
		let itinerary = reservation.itinerary || [];
		let errors = [];
		let allUserMessages = [];
		let calledCommands = [];
		if (reservation.pcc && reservation.pcc !== getSessionData().pcc) {
			let cmd = 'SEM/' + reservation.pcc + '/AG';
			let {cmdRec, userMessages} = await processRealCommand(cmd);
			allUserMessages.push(...userMessages);
			calledCommands.push(cmdRec);
		}
		if (passengers.length > 0) {
			let booked = await bookPassengers(passengers);
			errors.push(...(booked.errors || []));
			calledCommands.push(...(booked.calledCommands || []));
		}
		if (itinerary.length > 0) {
			// would be better to use number returned by ApolloBuildItineraryAction
			// as it may be not in same order in case of marriages...
			itinerary = itinerary.map((s, i) => ({...s, segmentNumber: +i + 1}));
			let booked = await bookItinerary(itinerary, true);
			errors.push(...(booked.errors || []));
			calledCommands.push(...(booked.calledCommands || []));
		}
		return {errors, userMessages: allUserMessages, calledCommands};
	};

	const rebookWithNewSeatAmount = async ($seatNumber) => {
		let $itinerary, $i;
		if (php.empty($itinerary = (await getCurrentPnr()).getItinerary())) {
			return {'errors': [Errors.getMessage(Errors.ITINERARY_IS_EMPTY)]};
		}
		await runCommand('XI', false);
		for ($i = 0; $i < php.count($itinerary); ++$i) {
			$itinerary[$i]['seatCount'] = $seatNumber;
		}
		return bookItinerary($itinerary, true);
	};

	const rebookWithNewSeatAmountSpecificSegments = async ($seatNumber, $numberString, $segmentStatus) => {
		let $itinerary, $selectedItinerary, $matches, $segmentNumbers, $i;
		if (php.empty($itinerary = (await getCurrentPnr()).getItinerary())) {
			return {'errors': [Errors.getMessage(Errors.ITINERARY_IS_EMPTY)]};
		}
		await runCommand('XI', false);
		$selectedItinerary = [];
		php.preg_match(/[\d\-\|]+/, $numberString, $matches = []);
		$segmentNumbers = parseStringNumbersList($matches[0] || '');
		for ($i = 0; $i < php.count($itinerary); ++$i) {
			if (php.in_array($itinerary[$i]['segmentNumber'], $segmentNumbers)) {
				$itinerary[$i]['seatCount'] = $seatNumber;
				if (!php.empty($segmentStatus)) {
					$itinerary[$i]['segmentStatus'] = $segmentStatus;
				}
				$selectedItinerary.push($itinerary[$i]);
			}
		}
		return bookItinerary($itinerary, true);
	};

	const rebookAsGk = async ($data) => {
		let $segNums, $bookingClass, $departureDate, $newSegments, $seg, $xOutput;
		$segNums = $data['segmentNumbers'];
		$bookingClass = $data['bookingClass'] || null;
		$departureDate = $data['departureDate'] || null;
		let pnr = await getCurrentPnr();
		let itinerary = pnr.getItinerary();
		$segNums = $segNums.length > 0 ? $segNums :
			itinerary.map(s => s.segmentNumber);
		$newSegments = [];
		for ($seg of itinerary) {
			if (php.in_array($seg['segmentNumber'], $segNums)) {
				if ($bookingClass) {
					$seg['bookingClass'] = $bookingClass;
				}
				if ($departureDate) {
					$seg['departureDate'] = $departureDate;
				}
				$seg['segmentStatus'] = 'GK';
				$newSegments.push($seg);
			}
		}
		stateful.flushCalledCommands();
		$xOutput = await runCommand('X' + php.implode('|', $segNums));
		if (!isSuccessXiOutput($xOutput) &&
			!php.preg_match(/^\s*NEXT REPLACES\s*\d+\s*(><)?$/, $xOutput)
		) {
			return {
				'errors': ['Could not cancel segments - ' + php.trim($xOutput)],
				'calledCommands': stateful.flushCalledCommands(),
			};
		}
		return bookItinerary($newSegments, false);
	};

	const emulatePcc = async ($pcc, $recoveryPcc) => {
		let $cmd, $result, $answer, $recoveryResult;
		$recoveryPcc = $recoveryPcc || getSessionData()['pcc'];
		$cmd = 'SEM/' + $pcc + '/AG';
		$result = await processRealCommand($cmd, false);
		if (!php.empty($recoveryPcc)) {
			// maybe it would be more idiomatic to put this in
			// callImplicitCommandsAfter() like we did for *R after ER?
			$answer = $result.cmdRec.output;
			if (php.trim(extractPager($answer)[0]) === 'ERR: INVALID - NOT 2HJ9 - APOLLO') {
				$cmd = 'SEM/' + $recoveryPcc + '/AG';
				await runCmd($cmd, false);
			}
		}
		return $result;
	};

	const rebookAsSs = async ($data) => {
		let $allowCutting, $gkSegments, $xCmd, $newSegs;
		$allowCutting = $data['allowCutting'] || false;
		stateful.flushCalledCommands();
		let pnr = await getCurrentPnr();
		$gkSegments = pnr.getItinerary().filter(($seg) => $seg['segmentStatus'] === 'GK');
		if (php.empty($gkSegments)) {
			return {'errors': ['No GK segments']};
		}
		$xCmd = 'X' + php.implode('|', php.array_column($gkSegments, 'segmentNumber'));
		await runCommand($xCmd);
		$newSegs = $gkSegments.map(($seg) => ({...$seg, segmentStatus: 'NN'}));
		return bookItinerary($newSegs, !$allowCutting);
	};

	const getMultiPccTariffDisplay = async ($cmd) => {
		return (new GetMultiPccTariffDisplayAction()).execute($cmd, stateful);
	};

	const priceInAnotherPcc = async ($cmd, $target, $dialect) => {
		let $pnr;
		$pnr = await getCurrentPnr();
		return (new RepriceInAnotherPccAction())
			.setLog((msg, data) => stateful.logit(msg, data))
			.execute($pnr, $cmd, $dialect, $target, stateful);
	};

	const getEmptyAreas = () => {
		return getEmptyAreasFromDbState();
	};

	const getEmptyAreasFromDbState = () => {
		let $isOccupied, $occupiedRows, $occupiedAreas;
		$isOccupied = ($row) => $row['hasPnr'];
		$occupiedRows = Fp.filter($isOccupied, stateful.getAreaRows());
		$occupiedAreas = php.array_column($occupiedRows, 'area');
		$occupiedAreas.push(getSessionData()['area']);
		return php.array_values(php.array_diff(['A', 'B', 'C', 'D', 'E'], $occupiedAreas));
	};

	const processCloneItinerary = async ($aliasData) => {
		let $pcc, $segmentStatus, $seatNumber, $errors, $itinerary, $emptyAreas, $recoveryPcc, $area, $output, $error,
			$key, $segment, $fallbackToGk;
		$pcc = $aliasData['pcc'];
		$segmentStatus = $aliasData['segmentStatus'] || 'GK';
		$seatNumber = $aliasData['seatCount'] || 0;
		if (!php.empty($errors = checkEmulatedPcc($pcc))) {
			return {'errors': $errors};
		}
		if (php.empty($itinerary = (await getCurrentPnr()).getItinerary())) {
			return {'errors': [Errors.getMessage(Errors.ITINERARY_IS_EMPTY)]};
		}
		if (php.empty($emptyAreas = getEmptyAreas())) {
			return {'errors': [Errors.getMessage(Errors.NO_FREE_AREAS)]};
		}
		if (!getSessionData()['isPnrStored'] && !$aliasData['keepOriginal'] && $segmentStatus !== 'GK') {
			await ignoreWithoutWarning(); // ignore the itinerary in initial area
		}
		$recoveryPcc = getSessionData()['pcc'];
		$area = $emptyAreas[0];
		$output = (await runCmd('S' + $area)).output;
		if (getSessionData()['area'] !== $area) {
			$error = Errors.getMessage(Errors.FAILED_TO_CHANGE_AREA, {
				'area': $area, 'response': php.trim($output),
			});
			return {'errors': [$error]};
		}
		let {cmdRec} = await emulatePcc($pcc, $recoveryPcc);
		if (getSessionData()['pcc'] !== $pcc) {
			$error = cmdRec.output.startsWith('ERR: INVALID - NOT ' + $pcc + ' - APOLLO')
				? Errors.getMessage(Errors.PCC_NOT_ALLOWED_BY_GDS, {'pcc': $pcc, 'gds': 'apollo'})
				: Errors.getMessage(Errors.PCC_GDS_ERROR, {'pcc': $pcc, 'response': cmdRec.output});
			return {'errors': [$error]};
		}
		for ([$key, $segment] of Object.entries($itinerary)) {
			if ($seatNumber >= 1 && $seatNumber <= 9) {
				$itinerary[$key]['seatCount'] = $seatNumber;
			}
			$itinerary[$key]['segmentStatus'] = $segmentStatus;
		}
		$fallbackToGk = $segmentStatus === 'SS';
		return bookItinerary($itinerary, $fallbackToGk);
	};

	const handlePnrSave = ($recordLocator) => {
		stateful.handlePnrSave($recordLocator);
	};

	const processSavePnr = async () => {
		let $pnr, $pnrDump, $errors, $usedCmds, $flatCmds, $usedCmdTypes, $login, $writeCommands, $cmd, $output,
			$saveResult, $cmdRecord;
		$pnr = await getCurrentPnr();
		$pnrDump = $pnr.getDump();
		if (!CommonDataHelper.isValidPnr($pnr)) {
			return {'errors': [Errors.getMessage(Errors.INVALID_PNR, {'response': php.trim($pnrDump)})]};
		} else if (!php.empty($errors = CommonDataHelper.checkSeatCount($pnr))) {
			return {'errors': $errors};
		}
		$usedCmds = await stateful.getLog().getCurrentPnrCommands();
		$flatCmds = flattenCmds($usedCmds);
		$usedCmdTypes = php.array_column($flatCmds, 'type');
		$login = getAgent().getLogin();
		$writeCommands = [
			'ER',
		];
		if (!php.in_array('addReceivedFrom', $usedCmdTypes)) {
			php.array_unshift($writeCommands, 'R:' + php.strtoupper($login));
		}
		if (!php.in_array('addTicketingDateLimit', $usedCmdTypes)) {
			php.array_unshift($writeCommands, 'T:TAU/' + php.strtoupper(php.date('dM', php.strtotime(stateful.getStartDt()))));
		}
		if (!php.in_array('addAgencyPhone', $usedCmdTypes)) {
			php.array_unshift($writeCommands, 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT');
		}
		// Add accounting line ("customer account" in apollo docs): smth like DK number in Sabre
		if (php.in_array(getSessionData()['pcc'], ['2E8R', '1RZ2', '2G8P'])
			&& !php.in_array('addAccountingLine', $usedCmdTypes)
		) {
			php.array_unshift($writeCommands, 'T-CA-SFO@$0221686');
		}
		$writeCommands = php.array_merge(await prepareToSavePnr(), $writeCommands);
		$cmd = php.implode('|', $writeCommands);
		$output = (await runCmd($cmd)).output;
		$saveResult = TApolloSavePnr.parseSavePnrOutput($output);
		if ($saveResult['success']) {
			handlePnrSave($saveResult['recordLocator']);
			$output = (await runCmd('*R')).output;
		}
		$cmdRecord = {'cmd': 'PNR', 'output': $output};
		return {'calledCommands': [$cmdRecord]};
	};

	const processSortItinerary = async () => {
		let $pnr, $pnrDump, $calledCommands,
			$cmd;

		$pnr = await getCurrentPnr();
		let {itinerary} = await CommonDataHelper.sortSegmentsByUtc(
			$pnr, stateful.getGeoProvider(), stateful.getStartDt()
		);

		$calledCommands = [];
		$cmd = '/0/' + itinerary.map(s => s.segmentNumber).join('|');
		$calledCommands.push(await runCmd($cmd));
		return {'calledCommands': $calledCommands};
	};

	const multiPriceItinerary = async ($aliasData) => {
		let $calledCommands, $cmd, $output;
		$calledCommands = [];
		for ($cmd of Object.values($aliasData['pricingCommands'])) {
			$output = await runCommand($cmd, true);
			$calledCommands.push({'cmd': $cmd, 'output': $output});
		}
		return {'calledCommands': $calledCommands};
	};

	const needsColonN = async ($pricingDump, $pnr) => {
		let rbsInfo = await getRbsPqInfo($pnr.getDump(), $pricingDump, 'apollo').catch(exc => ({}));
		return rbsInfo.isPrivateFare && rbsInfo.isBrokenFare;
	};

	const makeStorePricingCmd = async ($pnr, $aliasData, $needsColonN) => {
		let $adultPtc, $mods, $errors, $tripEndDate, $tripEndDt, $paxCmdParts, $pax, $nameNumFormat,
			$cmd, $needsAccompanying, $mod;
		$adultPtc = $aliasData['ptc'] || 'ADT';
		$mods = $aliasData['pricingModifiers'];
		if ($needsColonN && $adultPtc === 'ITX') {
			$adultPtc = 'ADT';
		}
		if (!php.empty($errors = CommonDataHelper.checkSeatCount($pnr))) {
			return Rej.BadRequest('Invalid PNR - ' + $errors.join('; '));
		}
		let lastSeg = ArrayUtil.getLast($pnr.getItinerary());
		$tripEndDate = !lastSeg ? null : lastSeg['departureDate']['parsed'];
		$tripEndDt = $tripEndDate ? DateTime.decodeRelativeDateInFuture($tripEndDate, stateful.getStartDt()) : null;
		$paxCmdParts = [];
		for ($pax of Object.values($pnr.getPassengers())) {
			$nameNumFormat = $pax['nameNumber']['fieldNumber'] +
				'-' + $pax['nameNumber']['firstNameNumber'];
			let ptc = await PtcUtil.convertPtcAgeGroup($adultPtc, $pax, $tripEndDt);
			$paxCmdParts.push($nameNumFormat + '*' + ptc);
		}
		$cmd = 'T:$BN' + php.implode('|', $paxCmdParts);
		$needsAccompanying = ($pax) => {
			let $ageGroup;
			$ageGroup = PtcUtil.getPaxAgeGroup($pax, $tripEndDt);
			return ['child', 'infant'].includes($ageGroup);
		};
		$cmd += '/Z0';
		if (Fp.all($needsAccompanying, $pnr.getPassengers())) {
			$cmd += '/ACC';
		}
		if ($needsColonN) {
			$cmd += '/:N';
		}
		for ($mod of Object.values($mods)) {
			$cmd += '/' + $mod['raw'];
		}
		return $cmd;
	};

	const makePriceAllCmd = async (aliasData) => {
		let {requestedAgeGroups, ptcs, pricingModifiers = []} = aliasData;
		let rawMods = [];
		rawMods.push('N' + ptcs
			.map((ptc,i) => (i + 1) + '*' + ptc)
			.join('|'));
		if (requestedAgeGroups.every(g => ['child', 'infant'].includes(g.ageGroup))) {
			rawMods.push('/ACC');
		}
		rawMods.push(...pricingModifiers.map(m => m.raw));
		let cmd = '$B' + rawMods.map(m => '/' + m).join('');
		return Promise.resolve(cmd);
	};

	const storePricing = async ($aliasData) => {
		let $pnr, $prevAtfqNum, $newAtfqNum;
		$pnr = await getCurrentPnr();
		let lastStore = ArrayUtil.getLast($pnr.getStoredPricingList());
		$prevAtfqNum = lastStore ? lastStore['lineNumber'] : 0;
		let cmd = await makeStorePricingCmd($pnr, $aliasData, false);
		let cmdRec = await runCmd(cmd);
		let output = cmdRec.output;
		if (StringUtil.contains(output, '** PRIVATE FARES SELECTED **')) {
			output = (await moveDownAll(null, [cmdRec]))[0]['output'] || output;
			if (await needsColonN(output, $pnr)) {
				$newAtfqNum = $prevAtfqNum + 1;
				// delete ATFQ we just created and store a correct one, with /:N/ mod
				await runCommand('XT' + $newAtfqNum, false);
				cmd = await makeStorePricingCmd($pnr, $aliasData, true);
				output = await runCommand(cmd, false);
			}
		}
		return {calledCommands: [{cmd, output}]};
	};

	const priceAll = async (aliasData) => {
		let cmd = await makePriceAllCmd(aliasData);
		let {cmdRec, userMessages} = await processRealCommand(cmd, true);
		return {calledCommands: [cmdRec], userMessages};
	};

	const ignoreWithoutWarning = async () => {
		let $output, $cmdRecord;
		$output = await runCommand('I');
		if (php.preg_match(/^\s*THIS IS A NEW PNR-ALL DATA WILL BE IGNORED WITH NEXT I OR IR\s*(><)?$/, $output)) {
			$output = await runCommand('I');
		}
		$cmdRecord = {'cmd': 'I', 'output': $output};
		return {'calledCommands': [$cmdRecord]};
	};

	const displayHistory = async () => {
		let $dump, $history, $display;
		$dump = (await runCmd('*HA', true)).output;
		$history = PnrHistoryParser.parse($dump);
		$display = DisplayHistoryActionHelper.display($history);
		return {'calledCommands': [{'cmd': '*HA', 'output': $display}]};
	};

	/** @param int|null $pageLimit - null means _all_ */
	const moveDownAll = async ($pageLimit, calledCommands) => {
		let $calledCommands, $lastCommandArray, $output, $iteration, $nextPage, $cmd;
		$pageLimit = $pageLimit || 100;
		$calledCommands = [];
		$lastCommandArray = calledCommands;
		if (!php.empty($lastCommandArray)) {
			$output = '';
			for ($iteration = 0; $iteration < $pageLimit; $iteration++) {
				if ($lastCommandArray[$iteration]) {
					$nextPage = $lastCommandArray[$iteration]['output'];
				} else {
					let {cmdRec} = await processRealCommand('MR');
					$nextPage = cmdRec['output'];
				}

				$output = ($output ? extractPager($output)[0] : '') + $nextPage;
				if (!isScrollingAvailable($nextPage)) {
					break;
				}
			}
			$cmd = $lastCommandArray.length > 0 ? $lastCommandArray[0]['cmd'] : 'MDA';
			$calledCommands.push({
				'cmd': $cmd,
				'output': $output,
			});
		}
		return $calledCommands;
	};

	const processRealCommand = async (cmd, fetchAll = false) => {
		return RunRealCmd({stateful, cmd, fetchAll, cmdRq, CmdRqLog});
	};

	/** show availability for first successful city option */
	const makeMultipleCityAvailabilitySearch = async (aliasData) => {
		let {availability, cities, airlines} = aliasData;
		let calledCommands = [];
		// probably would make sense to do it in separate sessions simultaneously
		for (let city of cities) {
			let cmd = availability + city + airlines;
			let cmdRec = await stateful.runCmd(cmd);
			let output = cmdRec.output;
			calledCommands.push({'cmd': cmd, 'output': output});
			if (php.preg_match('/^FIRAV/', output)) {
				// FIRAV means OK, got availability for a city - job's done
				break;
			}
		}
		return {
			'calledCommands': calledCommands.slice(-1),
		};
	};

	/**
	 * imitation of Sabre >1R20; which shows return availability for 20 day of same month
	 */
	const _preprocessSameMonthReturnAvailability = async (day) => {
		let availsDesc = (await stateful.getLog().getLikeSql({
			where: [
				['area', '=', getSessionData().area],
				['type', 'IN', ['airAvailability', 'moreAirAvailability']],
			],
			limit: 20,
		}));
		for (let lastAvail of availsDesc) {
			let {type, data} = CommandParser.parse(lastAvail.cmd);
			let date = (data || {}).departureDate || (data || {}).returnDate;
			if (date) {
				let month = date.raw.slice(-3);
				return 'A*O' + day + month;
			}
			if (type === 'airAvailability' && !data) {
				return Rej.NotImplemented('Could not parse availability cmd >' + lastAvail.cmd + ';');
			}
		}
		return Rej.BadRequest('No recent availability to request return date from');
	};

	const prepareMcoMask = async () => {
		let $getPaxName, $pcc, $pccPointOfSaleCountry, $agent, $pnr, $passengerNames, $mcoMask, $pnrParams,
			$hasPredefinedPax, $predefinedPax, $mcoParams, $key, $value, $calledCommands, $userMessages, $result;
		$getPaxName = ($pax) => $pax['lastName'] + '/' + $pax['firstName'];
		$pcc = getSessionData()['pcc'];
		$pccPointOfSaleCountry = await stateful.getPccDataProvider()('apollo', $pcc)
			.then(r => r.point_of_sale_country).catch(exc => null);
		if ($pccPointOfSaleCountry !== 'US') {
			return {'errors': ['You\\\'re emulated to ' + $pcc + '. Split MCO can be issued only in a USA PCC']};
		}
		$agent = stateful.getAgent();
		if (!$agent.canUseMco()) {
			return {'errors': ['Not allowed to use HHMCO']};
		}
		$pnr = await getCurrentPnr();
		if (!$pnr.getRecordLocator()) {
			return {'errors': ['Must be in a PNR']};
		}
		$passengerNames = Fp.map($getPaxName, php.array_filter($pnr.getPassengers()));
		$mcoMask = (await runCmd('HHMCO', true)).output;
		$pnrParams = await MakeMcoApolloAction.getMcoParams($pnr, $mcoMask);
		if (!php.empty($pnrParams['errors'])) {
			return {'errors': $pnrParams['errors']};
		}
		$hasPredefinedPax = (php.count($passengerNames) === 1);
		$predefinedPax = $hasPredefinedPax ? ArrayUtil.getFirst($passengerNames) : '';
		$mcoParams = [
			['passengerName', $predefinedPax, !$hasPredefinedPax],
			['amount', '', true],

			['amountCurrency', 'USD', false],

			['validatingCarrier', $pnrParams['validatingCarrier'], false],
			['to', $pnrParams['validatingCarrier'], false],
			['at', $pnrParams['hub'], false],
			['formOfPayment', $pnrParams['fop'], false],
			['expirationDate', $pnrParams['expirationDate'], false],
			['approvalCode', $pnrParams['approvalCode'], false],

			['issueNow', '', true],
		];
		for ([$key, $value] of Object.entries(ApolloMakeMcoAction.getDefaultParams())) {
			if (!php.in_array($key, ['issueNow'])) {
				$mcoParams.push([$key, $value, false]);
			}
		}
		$mcoParams = Fp.map(($field) => {
			let $key, $value, $enabled;
			[$key, $value, $enabled] = $field;
			return {'key': $key, 'value': $value, 'enabled': $enabled};
		}, $mcoParams);
		$calledCommands = [{'cmd': 'HHMCO', 'output': 'SEE MCO FORM BELOW', 'tabCommands': [], 'clearScreen': true}];
		$userMessages = [];
		$result = {
			'calledCommands': $calledCommands, 'userMessages': $userMessages,
			'actions': [
				{
					'type': 'displayMcoMask',
					'data': {
						'fields': $mcoParams,
						'passengers': $passengerNames,
					},
				},
			],
		};
		return $result;
	};

	/** @param {string} passengerName = 'LONGLONG' || 'BITCA/IU' || 'BITCA/IURI' */
	const matchesMcoName = (passengerName, headerData) => {
		let [lnme, fnme] = passengerName.split('/');
		return headerData.lastName.startsWith(lnme || '')
			&& headerData.firstName.startsWith(fnme || '');
	};

	const filterMcoRowsByMask = async (matchingPartial, headerData) => {
		let matchingFull = [];
		for (let mcoRow of matchingPartial) {
			if (mcoRow.command) {
				let cmd = mcoRow.command;
				let mcoDump = (await fetchAll(cmd, stateful)).output;
				let parsed = McoMaskParser.parse(mcoDump);
				if (parsed.error) {
					return UnprocessableEntity('Bad ' + cmd + ' reply - ' + parsed.error);
				} else if (matchesMcoName(parsed.passengerName, headerData)) {
					mcoRow.fullData = parsed;
					matchingFull.push(mcoRow);
				}
			}
		}
		return matchingFull;
	};

	/** @param {ApolloPnr} pnr */
	const getMcoRows = async (pnr, headerData) => {
		if (!pnr.hasMcoInfo()) {
			return [];
		}
		let cmdRec = await fetchAll('*MPD', stateful);
		let parsed = McoListParser.parse(cmdRec.output);
		if (parsed.error) {
			return UnprocessableEntity('Bad *MPD reply - ' + parsed.error);
		}
		let matchingPartial = parsed.mcoRows.filter(mcoRow => {
			return matchesMcoName(mcoRow.passengerName, headerData);
		});
		return filterMcoRowsByMask(matchingPartial, headerData)
			.catch(ignoreExc(matchingPartial, [UnprocessableEntity]));
	};

	/** @param {ApolloPnr} pnr */
	const getHtRows = async (pnr) => {
		if (!pnr.hasEtickets()) {
			return [];
		}
		let cmdRec = await fetchAll('*HT', stateful);
		let parsed = TicketHistoryParser.parse(cmdRec.output);
		let tickets = []
			.concat(parsed.currentTickets.map(r => ({...r, isActive: true})))
			.concat(parsed.deletedTickets.map(r => ({...r, isActive: false})));
		if (tickets.length === 0) {
			return UnprocessableEntity('Bad *HT reply - ' + cmdRec.output);
		} else {
			return tickets;
		}
	};

	const _checkPnrForExchange = async (storeNum) => {
		let agent = stateful.getAgent();
		if (!agent.canIssueTickets()) {
			return Rej.Forbidden('You have no ticketing rights');
		}
		let pnr = await getCurrentPnr();
		if (!pnr.getRecordLocator()) {
			return Rej.BadRequest('Must be in a PNR');
		}
		let store = pnr.getStoredPricingList()[storeNum - 1];
		if (!store) {
			return Rej.BadRequest('There is no ATFQ #' + storeNum + ' in PNR');
		}
		if (pnr.getPassengers().length > 1) {
			let nData = store.pricingModifiers
				.filter(mod => mod.type === 'passengers')
				.map(mod => mod.parsed)[0];

			let paxCnt = !nData || !nData.passengersSpecified
				? pnr.getPassengers().length
				: nData.passengerProperties.length;
			// Rico says there is a risk of losing a ticket if issuing multiple paxes
			// at once with HB:FEX, so ticketing agents are not allowed to do so
			if (paxCnt > 1) {
				let error = 'Multiple passengers (' + paxCnt +
					') in ATFQ #' + storeNum + ' not allowed for HB:FEX';
				return Rej.BadRequest(error);
			}
		}
		return Promise.resolve(pnr);
	};

	const prepareHbFexMask = async (cmdStoreNumber = '', ticketNumber = '') => {
		let pnr = await _checkPnrForExchange(cmdStoreNumber || 1);
		let cmd = 'HB' + cmdStoreNumber + ':FEX' + (ticketNumber || '');
		let output = (await runCmd(cmd)).output;
		let parsed = ParseHbFex(output);
		if (!parsed) {
			return {calledCommands: [{cmd, output}], errors: ['Invalid HB:FEX response']};
		}
		let readonlyFields = new Set([
			'originalBoardPoint', 'originalOffPoint',
			'originalAgencyIata', 'originalInvoiceNumber',
			'originalTicketStarExtension',
		]);
		let pcc = getSessionData().pcc;
		let pccRow = !pcc ? null : await Pccs.findByCode('apollo', pcc);
		let result = {
			calledCommands: [{
				cmd: cmd,
				output: 'SEE MASK FORM BELOW',
			}],
			actions: [{
				type: 'displayExchangeMask',
				data: {
					currentPos: !pccRow ? null : pccRow.point_of_sale_city,
					mcoRows: ticketNumber ? [] : await
					getMcoRows(pnr, parsed.headerData)
						.catch(ignoreExc([], [UnprocessableEntity])),
					htRows: ticketNumber ? [] : await
					getHtRows(pnr)
						.catch(ignoreExc([], [UnprocessableEntity])),
					headerData: parsed.headerData,
					fields: parsed.fields.map(f => ({
						key: f.key,
						value: f.value,
						enabled: !f.value && !readonlyFields.has(f.key),
					})),
					maskOutput: output,
				},
			}],
		};
		return result;
	};

	const prepareHhprMask = async (cmd) => {
		let output = (await runCmd(cmd)).output;
		let data = await NmeMaskParser.parse(output);
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
		const match = output.match(/>(?<cmd>\$D[^ ]+)/m);
		return match && match.groups.cmd || null;
	};

	/**
	 * @param {String} cmd = '$DBWASV'
	 * performs >$DBWASV20MAY25MAY;
	 *
	 * there is a >$DBWAS; format in GDS, but it does not preserve the 'V'-alidated
	 * fare indicator, that's why we were asked to implement an alias that would not
	 * require to retype the dates from last $D, but would still return _validated_ fares
	 *
	 * "validated" means that fare is allowed by our contracts, that usually define stuff
	 * like MIN/MAX stay limitation, seasonality, advance purchase days limit, etc...
	 */
	const fareSearchValidatedChangeCity = async cmd => {
		let parsed;

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

		// If shorthand command such as $D is used then cmd itself is useless,
		// but we still can extract required data from command's output and that should
		// be present in every request response
		parsed = CommandParser.parseFareSearch(extractDCommandFromOutput(previousDb.output));

		if (!parsed) {
			// $D is as fallback in case if last fareSearch entry in DB is invalid
			// (could happen if city code in last modification request is invalid)
			// but fare search request in session is still valid
			const dCmdOutput = await runCmd('$D');

			parsed = CommandParser.parseFareSearch(extractDCommandFromOutput(dCmdOutput.output));

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

	const processRequestedCommand = async (cmd) => {
		let $alias, $mdaData, $limit, $cmdReal, $matches, $_, $plus, $seatAmount,
			$segmentNumbers, $segmentStatus;
		let reservation;
		$alias = await ApoAliasParser.parse(cmd, stateful);
		let parsed = CommandParser.parse(cmd);
		if ($mdaData = $alias['moveDownAll'] || null) {
			$limit = $mdaData['limit'] || null;
			if ($cmdReal = $alias['realCmd']) {
				let {cmdRec} = await processRealCommand($cmdReal, false);
				return {calledCommands: await moveDownAll($limit, [cmdRec])};
			} else {
				let mdCmdRows = await stateful.getLog().getScrolledCmdMrs();
				mdCmdRows = await Promise.all(mdCmdRows.map(cmdRec => modifyOutput(cmdRec)));
				let calledCommands = await moveDownAll($limit, mdCmdRows);
				return {calledCommands};
			}
		} else if (php.preg_match(/^PNR$/, cmd, $matches = [])) {
			return processSavePnr();
		} else if (php.preg_match(/^HHMCO$/, cmd, $matches = [])) {
			return prepareMcoMask();
		} else if (php.preg_match(/^HB(\d*):FEX\s*([\d\s]{13,}|)$/, cmd, $matches = [])) {
			let [_, storeNumber, ticketNumber] = $matches;
			return prepareHbFexMask(storeNumber, ticketNumber || '');
		} else if (['priceItineraryManually', 'manualStoreItinerary'].includes(parsed.type)) {
			return prepareHhprMask(cmd);
		} else if (
			['HBT', 'HBTA'].includes(cmd) ||
			parsed.type === 'manualStoreFareCalculation'
		) {
			return EndManualPricing({cmd, stateful: stateful});
		} else if (php.preg_match(/^SORT$/, cmd, $matches = [])) {
			return processSortItinerary();
		} else if ($alias['type'] === 'rebookInPcc') {
			return processCloneItinerary($alias['data']);
		} else if ($alias['type'] === 'multiPriceItinerary') {
			return multiPriceItinerary($alias['data']);
		} else if ($alias['type'] === 'storePricing') {
			return storePricing($alias['data']);
		} else if ($alias['type'] === 'priceAll') {
			return priceAll($alias['data']);
		} else if (cmd === '*HA') {
			return displayHistory();
		} else if (cmd === '!aliasDoubleIgnore') {
			return ignoreWithoutWarning();
		} else if (php.preg_match(/^(\||\+)(\d{1})$/, cmd, $matches = [])) {
			[$_, $plus, $seatAmount] = $matches;
			return rebookWithNewSeatAmount($seatAmount);
		} else if (php.preg_match(/^(\||\+)(\d{1})(S[\d\-\|]+)([A-Z]{2}|)$/, cmd, $matches = [])) {
			[$_, $plus, $seatAmount, $segmentNumbers, $segmentStatus] = $matches;
			return rebookWithNewSeatAmountSpecificSegments($seatAmount, $segmentNumbers, $segmentStatus);
		} else if ($alias['type'] === 'rebookAsGk') {
			return rebookAsGk($alias['data']);
		} else if ($alias['type'] === 'rebookAsSs') {
			return rebookAsSs($alias['data']);
		} else if ($alias['type'] === 'fareSearchMultiPcc') {
			return getMultiPccTariffDisplay($alias['realCmd']);
		} else if ($alias['type'] === 'priceInAnotherPcc') {
			return priceInAnotherPcc($alias['realCmd'], $alias['data']['target'], $alias['data']['dialect']);
		} else if ($alias['type'] === 'multiDstAvail') {
			return makeMultipleCityAvailabilitySearch($alias['data']);
		} else if (php.preg_match(/^SEM\/([\w\d]{3,4})\/AG$/, cmd, $matches = [])) {
			let {cmdRec} = await emulatePcc($matches[1]);
			return {calledCommands: [cmdRec]};
		} else if (!php.empty(reservation = await AliasParser.parseCmdAsPnr(cmd, stateful))) {
			return bookPnr(reservation);
		} else if ($alias.type === 'fareSearchValidatedChangeCity') {
			return fareSearchValidatedChangeCity($alias.realCmd);
		} else {
			cmd = $alias['realCmd'];
			let fetchAll = shouldFetchAll(cmd);
			cmd = await preprocessCommand(cmd);
			let {cmdRec, userMessages, performanceDebug} = await processRealCommand(cmd, fetchAll);
			return {calledCommands: [cmdRec], userMessages, performanceDebug};
		}
	};

	const execute = async () => {
		let $callResult, $errors, $status, $calledCommands, $userMessages, $actions;
		let $cmdRequested = cmdRq;
		$callResult = await processRequestedCommand($cmdRequested)
			.catch(exc =>
				Rej.BadRequest.matches(exc.httpStatusCode) ||
				Rej.Forbidden.matches(exc.httpStatusCode)
					? ({errors: [exc + '']})
					: Promise.reject(exc));

		if ($callResult.then) {
			// way too often I accidentally pass Promise here...
			let unwrapped = await $callResult.catch(exc => ({error: exc + ''}));
			let msg = 'Code mistake, call result was a promise inside another promise';
			return Rej.InternalServerError(msg, unwrapped);
		}

		if (!php.empty($errors = $callResult['errors'] || [])) {
			$status = GdsDirect.STATUS_FORBIDDEN;
			$calledCommands = $callResult['calledCommands'] || [];
			$userMessages = $errors;
			$actions = $callResult['actions'] || [];
		} else {
			$status = GdsDirect.STATUS_EXECUTED;
			$calledCommands = $callResult['calledCommands'] || [];
			$userMessages = $callResult['userMessages'] || [];
			$actions = $callResult['actions'] || [];
		}
		return {
			'status': $status,
			'calledCommands': $calledCommands.map(a => a),
			'userMessages': $userMessages,
			'actions': $actions,
			'performanceDebug': $callResult.performanceDebug,
		};
	};

	return execute();
};

module.exports = RunCmdRq;
