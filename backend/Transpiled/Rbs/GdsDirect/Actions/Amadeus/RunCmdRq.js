const GetCurrentPnr = require('../../../../../Actions/GetCurrentPnr.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const DateTime = require('../../../../Lib/Utils/DateTime.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const RepriceInAnotherPccAction = require('../../../../Rbs/GdsDirect/Actions/Common/RepriceInAnotherPccAction.js');
const GetMultiPccTariffDisplayAction = require('../../../../Rbs/GdsDirect/Actions/Common/GetMultiPccTariffDisplayAction.js');
const AliasParser = require('../../../../Rbs/GdsDirect/AliasParser.js');
const Errors = require('../../../../Rbs/GdsDirect/Errors.js');
const GdsDirect = require('../../../../Rbs/GdsDirect/GdsDirect.js');
const PnrParser = require('../../../../Gds/Parsers/Amadeus/Pnr/PnrParser.js');
const GenericRemarkParser = require('../../../../Gds/Parsers/Common/GenericRemarkParser.js');
const CommonDataHelper = require('../../../../Rbs/GdsDirect/CommonDataHelper.js');
const CommandParser = require('../../../../Gds/Parsers/Amadeus/CommandParser.js');
const CmsAmadeusTerminal = require('../../../../Rbs/GdsDirect/GdsInterface/CmsAmadeusTerminal.js');
const AmadeusUtil = require("../../../../../GdsHelpers/AmadeusUtils");
const GdsProfiles = require("../../../../../Repositories/GdsProfiles");
const getRbsPqInfo = require("../../../../../GdsHelpers/RbsUtils").getRbsPqInfo;
const MoveDownAllAction = require('./MoveDownAllAction.js');
const AmadeusBuildItineraryAction = require('../../../../Rbs/GdsAction/AmadeusBuildItineraryAction.js');
const MarriageItineraryParser = require('../../../../Gds/Parsers/Amadeus/MarriageItineraryParser.js');
const AmadeusClient = require("../../../../../GdsClients/AmadeusClient");
const makeDefaultAreaState = require("../../../../../Repositories/GdsSessions").makeDefaultAreaState;
const WorkAreaScreenParser = require("../../../../Gds/Parsers/Amadeus/WorkAreaScreenParser");
const UnprocessableEntity = require("klesun-node-tools/src/Rej").UnprocessableEntity;
const Rej = require("klesun-node-tools/src/Rej");
const FxParser = require('../../../../Gds/Parsers/Amadeus/Pricing/FxParser.js');
const TicketMaskParser = require('../../../../Gds/Parsers/Amadeus/TicketMaskParser.js');
const {withCapture} = require("../../../../../GdsHelpers/CommonUtils");
const AmadeusGetPricingPtcBlocks = require('./AmadeusGetPricingPtcBlocksAction.js');
const PricingCmdParser = require('../../../../../Transpiled/Gds/Parsers/Amadeus/Commands/PricingCmdParser.js');

const PASSIVE_STATUSES = ['GK', 'PE'];
// defines how much areas can agent open in single session
const AREA_LETTERS = ['A', 'B', 'C', 'D'];

const forgeViewAreasDump = ($sessionData, $areasFromDb) => {
	let $areas, $area, $lines, $letter, $status, $data;

	$areas = [];
	for ($area of Object.values($areasFromDb)) {
		$areas[$area['area']] = $area;
	}
	$lines = [
		'00000000         ' + $sessionData['pcc'],
		'',
		'AREA  TM  MOD SG/DT.LG TIME      ACT.Q   STATUS     NAME',
	];
	for ($letter of Object.values(AREA_LETTERS)) {
		if (php.isset($areas[$letter])) {
			if ($areas[$letter]['isPnrStored']) {
				$status = 'PNR MODIFY';
			} else if ($areas[$letter]['hasPnr']) {
				$status = 'PNR CREATE';
			} else {
				$status = 'SIGNED';
			}
			$data = {
				'letter': $letter,
				'signed': ($letter == $sessionData['area']) ? '-IN' : '   ',
				'status': $status,
			};
			$lines.push(StringUtil.format('{letter}{signed}      PRD WS/SU.EN  24             {status}', $data));
		} else {
			$lines.push($letter + '                                      NOT SIGNED');
		}
	}
	return php.implode(php.PHP_EOL, $lines);
};

const doesStorePnr = ($cmd) => {
	let $parsedCmd, $flatCmds, $cmdTypes;

	$parsedCmd = CommandParser.parse($cmd);
	$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands'] || []);
	$cmdTypes = php.array_column($flatCmds, 'type');
	return !php.empty(php.array_intersect($cmdTypes, ['storePnr', 'storeKeepPnr']));
};

const doesOpenPnr = ($cmd) => {
	let $parsedCmd;

	$parsedCmd = CommandParser.parse($cmd);
	return php.in_array($parsedCmd['type'], ['openPnr', 'searchPnr', 'displayPnrFromList']);
};

const formatGtlPccError = ($exc, pcc) => {
	let prefix = 'Failed to start session with PCC ' + pcc + ' - ';
	if (php.preg_match(/\bSoapFault: *11|\Session\b/, ($exc.message || ''))) {
		return Rej.BadRequest('Invalid PCC');
	} else {
		return UnprocessableEntity(prefix + 'Unexpected GTL error - ' + php.preg_replace(/\s+/, ' ', php.substr($exc.message || '', -100)));
	}
};

const isSaveConfirmationRequired = ($output) => {
	let $regex;

	// '/',
	// 'WARNING: CHECK TICKETING DATE',
	// 'WARNING: PS REQUIRES TICKET ON OR BEFORE 19SEP:1900/S2-3',
	$regex =
		'/^' +
		'\\s*\\/\\s*' +
		'(\\s*WARNING: .*\\s*)+' +
		'$/';
	return php.preg_match($regex, $output);
};

const isOkXeOutput = ($output) => {
	let $parsedPnr;

	$parsedPnr = PnrParser.parse($output);
	return $parsedPnr['success']
		|| php.preg_match(/^(WARNING: .*\n)*\s*\/\s*ITINERARY CANCELLED\s*$/, $output);
};

const isOkFxdOutput = ($output) => {
	let $pager;

	$pager = AmadeusUtil.parseRtPager($output);
	return $pager['hasPageMark']; // error responses don't have it
};

const countsAsFxd = ($cmd, $output) => {
	let $cmdType;

	$cmdType = CommandParser.parse($cmd)['type'];
	return php.in_array($cmdType, CommonDataHelper.getCountedFsCommands())
		&& isOkFxdOutput($output);
};

// '+4', '+4S3', '+4S1-3GK'
const parseSeatIncreasePseudoCmd = ($cmd) => {
	let $regex, $matches;

	$regex =
		'/^\\+' +
		'(?<seatAmount>\\d+)' +
		'(S' +
		'(?<segNumStart>\\d+)' +
		'(-(?<segNumEnd>\\d+))?' +
		')?' +
		'(?<segmentStatus>[A-Z]{2})?' +
		'$/';
	if (php.preg_match($regex, $cmd, $matches = [])) {
		return {
			'seatAmount': $matches['seatAmount'],
			'segNumStart': $matches['segNumStart'] || '' || null,
			'segNumEnd': $matches['segNumEnd'] || '' || null,
			'segmentStatus': $matches['segmentStatus'] || '' || null,
		};
	} else {
		return null;
	}
};

const transformBuildError = ($result) => {
	let $cmsMessageType;

	if (!$result['success']) {
		$cmsMessageType = ({
			[AmadeusBuildItineraryAction.ERROR_GDS_ERROR]: Errors.REBUILD_GDS_ERROR,
			[AmadeusBuildItineraryAction.ERROR_NO_AVAIL]: Errors.REBUILD_NO_AVAIL,
		} || {})[$result['errorType']] || $result['errorType'];
		return Errors.getMessage($cmsMessageType, $result['errorData']);
	} else {
		return null;
	}
};

const translateApolloPricingModifiers = ($apolloMods) => {
	let $mods, $rSubMods, $apolloMod;

	$mods = [];
	$rSubMods = [];
	for ($apolloMod of Object.values($apolloMods)) {
		if ($apolloMod['type'] === 'validatingCarrier') {
			$rSubMods.push('VC-' + $apolloMod['parsed']);
		} else {
			return Rej.NotImplemented('Unsupported modifier - ' + $apolloMod.raw);
		}
	}
	return {'mods': $mods, 'rSubMods': $rSubMods};
};

/** @param stateful = await require('StatefulSession.js')() */
let execute = ({
	stateful, cmdRq,
	PtcUtil = require('../../../../Rbs/Process/Common/PtcUtil.js'),
	amadeus = AmadeusClient,
}) => {

	const makeCreatedForCmdIfNeeded = async () => {
		let $cmdLog, $sessionData, $remarkCmd, $flattenCmd, $performedCmds, $flatPerformedCmds;

		$cmdLog = stateful.getLog();
		$sessionData = $cmdLog.getSessionData();
		if (!$sessionData['isPnrStored']) {
			$remarkCmd = 'RM' + await CommonDataHelper.createCredentialMessage(stateful);

			$flattenCmd = ($cmd) => {
				let $parsed = CommandParser.parse($cmd);
				return php.array_column(php.array_merge([$parsed], $parsed['followingCommands']), 'cmd');
			};
			$performedCmds = php.array_column(await $cmdLog.getCurrentPnrCommands(), 'cmd');
			$flatPerformedCmds = Fp.flatten(Fp.map($flattenCmd, $performedCmds));

			if (!php.in_array($remarkCmd, $flatPerformedCmds)) {
				return $remarkCmd;
			}
		}
		return null;
	};

	const makeTopRemarkCmdIfNeeded = async () => {
		let $cmdLog, $sessionData, $performedCmds, $msg, $cmd;

		$cmdLog = stateful.getLog();
		$sessionData = $cmdLog.getSessionData();
		if (!$sessionData['isPnrStored']) {
			$performedCmds = php.array_column(await $cmdLog.getCurrentPnrCommands(), 'cmd');
			$msg = 'CREATED IN GDS DIRECT BY ' + php.strtoupper(getAgent().getLogin());
			$cmd = 'UHP/' + $msg;
			if (!php.in_array($cmd, $performedCmds)) {
				return $cmd;
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

	const getSessionData =  () => {
		return stateful.getSessionData();
	};

	const handlePnrSave =  ($recordLocator) => {
		stateful.handlePnrSave($recordLocator);
	};

	const moveDownAll = async ($limit) => {
		let $pageLimit = $limit || 100;
		let $result = await (new MoveDownAllAction())
			.setSession(stateful)
			.execute(stateful.getLog(), $pageLimit);
		$result['calledCommands'] = Fp.map(($cmdRec) => {
			return modifyOutput($cmdRec);
		}, $result['calledCommands'] || []);
		return $result;
	};

	const runAndMoveDownAll = async ($cmdReal, $limit) => {
		let $result, $moved;

		$result = await processRealCommand($cmdReal);
		if (php.empty($result['errors'])) {
			$moved = await moveDownAll($limit);
			if (php.empty($moved['errors'])) {
				$result['calledCommands'] = $moved['calledCommands'];
			}
			$result['userMessages'] = php.array_merge(
				$result['userMessages'] || [],
				$moved['userMessages'] || []
			);
			$result['errors'] = $moved['errors'] || [];
		}
		return $result;
	};

	const processSavePnr = async () => {
		let $calledCommands, $pnr, $errors, $login, $cmd, $writeCommands, $output, $parsedStoredPnr, $rloc;

		$calledCommands = [];

		$pnr = await getCurrentPnr();
		if (!CommonDataHelper.isValidPnr($pnr)) {
			return {'errors': [Errors.getMessage(Errors.INVALID_PNR, {'response': php.trim($pnr.getDump())})]};
		} else if (!php.empty($errors = CommonDataHelper.checkSeatCount($pnr))) {
			return {'errors': $errors};
		}

		$login = getAgent().getLogin();

		if ($cmd = await makeTopRemarkCmdIfNeeded()) {
			// not joinable
			await runCommand($cmd);
		}
		$writeCommands = [
			// phone number will be added automatically
			// 'APSFO800-750-2238-A',
			'TKTL' + php.strtoupper(php.date('dM', php.strtotime(stateful.getStartDt()))), // ticketing time limit
			'RF' + php.strtoupper($login), // received from
			'ER',
		];
		if ($cmd = await makeCreatedForCmdIfNeeded()) {
			php.array_unshift($writeCommands, $cmd);
		}

		$cmd = php.implode(';', $writeCommands);
		$output = await amadeusRt($cmd);

		if (isSaveConfirmationRequired($output)) {
			$calledCommands.push({'cmd': 'ER', 'output': $output});
			$output = await amadeusRt('ER');
		}
		$parsedStoredPnr = PnrParser.parse($output);
		if ($rloc = (($parsedStoredPnr['parsed'] || {})['pnrInfo'] || {})['recordLocator']) {
			handlePnrSave($rloc);
		}

		$calledCommands.push({'cmd': 'PNR', 'output': $output});
		return {'calledCommands': $calledCommands};
	};

	const processSortItinerary = async () => {
		let $pnr, $pnrDump,
			$calledCommands, $cmd;

		$pnr = await getCurrentPnr();
		$pnrDump = $pnr.getDump();
		let {itinerary} = await CommonDataHelper.sortSegmentsByUtc($pnr, stateful.getGeoProvider());

		$calledCommands = [];
		$cmd = 'RS' + itinerary.map(s => s.segmentNumber).join(',');
		let output = await runCommand($cmd);
		$calledCommands.push({cmd: $cmd, output});
		return {'calledCommands': $calledCommands};
	};

	const startNewAreaSession = async (area, pcc = null) => {
		let $row = makeDefaultAreaState('amadeus');
		pcc = pcc || $row.pcc;
		$row.area = area;
		$row.pcc = pcc;
		$row.gdsData = await amadeus.startSession({
			profileName: GdsProfiles.chooseAmaProfile($row.pcc),
			pcc: pcc,
		});
		return $row;
	};

	const updateGdsData = async (newAreaState) => {
		let fullState = stateful.getFullState();
		fullState.areas[newAreaState.area] = newAreaState;
		fullState.area = newAreaState.area;
		let updated = await Promise.all([
			stateful.updateFullState(fullState),
			stateful.updateGdsData(newAreaState.gdsData),
		]);
		return updated;
	};

	const changeArea = async ($area) => {
		let $errorData, $areaRows, $isRequested, $row;

		if (!php.in_array($area, AREA_LETTERS)) {
			$errorData = {'area': $area, 'options': php.implode(', ', AREA_LETTERS)};
			return {'errors': [Errors.getMessage(Errors.INVALID_AREA_LETTER, $errorData)]};
		}
		if (stateful.getSessionData()['area'] === $area) {
			return {'errors': [Errors.getMessage(Errors.ALREADY_IN_THIS_AREA, {'area': $area})]};
		}
		$areaRows = stateful.getAreaRows();
		$isRequested = ($row) => $row['area'] === $area;
		$row = ArrayUtil.getFirst(Fp.filter($isRequested, $areaRows));

		let fullState = stateful.getFullState();
		if (!fullState.areas[fullState.area].gdsData) {
			// preserve area A session token
			fullState.areas[fullState.area].gdsData = stateful.getGdsData();
			stateful.updateFullState(fullState);
		}
		if (!$row || !$row.gdsData) {
			$row = await startNewAreaSession($area);
		}
		await updateGdsData($row);

		return {
			'calledCommands': [],
			'userMessages': ['Successfully changed area to ' + $area],
		};
	};

	const deleteSegments = async ($segNumStart, $segNumEnd) => {
		let $rtamDump, $itinerary, $xeCmd, $segNums, $matches, $matchedSegments, $xeOutput;

		$rtamDump = await amadeusRt('RTAM');
		if (php.empty($itinerary = MarriageItineraryParser.parse($rtamDump))) {
			return {'errors': [Errors.getMessage(Errors.ITINERARY_IS_EMPTY)]};
		}

		if ($segNumStart) {
			$xeCmd = 'XE' + $segNumStart;
			if ($segNumEnd) {
				$xeCmd += '-' + $segNumEnd;
			}
			$segNums = php.range($segNumStart, $segNumEnd || $segNumStart);
			$matches = ($seg) => php.in_array($seg['lineNumber'], $segNums);
			$matchedSegments = Fp.filter($matches, $itinerary);
		} else {
			$xeCmd = 'XE' + php.implode(',', php.array_column($itinerary, 'lineNumber'));
			$matchedSegments = $itinerary;
		}
		$xeOutput = await runCommand($xeCmd);
		if (!isOkXeOutput($xeOutput)) {
			return {
				'errors': ['Failed to delete segments - ' + $xeOutput],
				'calledCommands': stateful.flushCalledCommands(),
			};
		}
		return {'matchedSegments': $matchedSegments};
	};

	/** @param $params = ProcessAmadeusTerminalInputAction::parseSeatIncreasePseudoCmd() */
	const processSeatIncrease = async ($params) => {
		let $deleted, $matchedSegments, $i;

		if ($params['seatAmount'] > 9) {
			return {'errors': ['Seat amount must be a one-digit number']};
		}
		$deleted = await deleteSegments($params['segNumStart'], $params['segNumEnd']);
		if (php.empty($matchedSegments = $deleted['matchedSegments'] || [])) {
			return $deleted;
		}
		for ($i = 0; $i < php.count($matchedSegments); ++$i) {
			$matchedSegments[$i]['seatCount'] = $params['seatAmount'];
			$matchedSegments[$i]['segmentStatus'] = $params['segmentStatus'];
		}
		return bookItinerary($matchedSegments, false);
	};

	const processCloneItinerary = async ($aliasData) => {
		let $pcc, $segmentStatus, $seatNumber, $pnrDump, $itinerary, $emptyAreas, $area, $result, $key, $segment;

		$pcc = $aliasData['pcc'];
		$segmentStatus = $aliasData['segmentStatus'] || 'GK';
		$seatNumber = $aliasData['seatCount'] || 0;

		$pnrDump = (await AmadeusUtil.fetchAllRt('RTAM', stateful)).output;

		$itinerary = MarriageItineraryParser.parse($pnrDump);

		if(php.empty($itinerary)) {
			$pnrDump = (await AmadeusUtil.fetchAllRt('RT', stateful)).output;

			$itinerary = PnrParser.parse($pnrDump).parsed.itinerary;
		}

		if (php.empty($itinerary)) {
			return {'errors': [Errors.getMessage(Errors.ITINERARY_IS_EMPTY)]};
		}

		if (php.empty($emptyAreas = getEmptyAreasFromDbState())) {
			return {'errors': [Errors.getMessage(Errors.NO_FREE_AREAS)]};
		}
		if (!getSessionData()['isPnrStored'] && !$aliasData['keepOriginal'] && $segmentStatus !== 'GK') {
			await runCommand('IG'); // ignore the itinerary it initial area
		}
		$area = $emptyAreas[0];
		$result = await changeArea($area);
		if (!php.empty($result['errors'])) {
			return $result;
		}
		if (getSessionData()['pcc'] !== $pcc) {
			$result = await changePcc($pcc);
			if (!php.empty($result['errors'])) {
				return $result;
			}
		}

		for ([$key, $segment] of Object.entries($itinerary)) {
			if ($seatNumber >= 1 && $seatNumber <= 9) {
				$itinerary[$key]['seatCount'] = $seatNumber;
			}
			$itinerary[$key]['segmentStatus'] = $segmentStatus;
			$itinerary[$key]['lineNumber'] = $key + 1;
		}

		return bookItinerary($itinerary, true);
	};

	/** @param $itinerary = MarriageItineraryParser::parse() */
	const bookItinerary = async ($itinerary, isNewPnr) => {
		let $errors, $i, $segment, $bookItinerary, $result, $error,
			$segmentNumbers, $calledCommands;

		$errors = [];
		stateful.flushCalledCommands();

		if (isNewPnr) {
			for ([$i, $segment] of Object.entries($itinerary)) {
				// in most cases there are no paxes in destination PNR, so first segment number will be 1
				$segment['lineNumber'] = +$i + 1; // $segment['lineNumber'] || $i + 1;
			}
		}
		$bookItinerary = $itinerary.map(($segment) => {
			let cls = !php.in_array($segment['segmentStatus'], PASSIVE_STATUSES)
				? 'Y' : $segment['bookingClass'];
			return {...$segment, bookingClass: cls};
		});

		$result = await (new AmadeusBuildItineraryAction())
			.setSession(stateful).execute($bookItinerary, true);

		if ($error = transformBuildError($result)) {
			$errors.push($error);
		} else {
			let $isActive = ($seg) => !php.in_array($seg['segmentStatus'], PASSIVE_STATUSES);
			let $activeSegments = Fp.filter($isActive, $itinerary);
			let $marriageGroups = Fp.groupMap(($seg) => $seg['marriage'], $activeSegments);

			for (let [$marriage, $group] of $marriageGroups) {
				if ($marriage > 0) {
					$segmentNumbers = php.array_column($group, 'lineNumber');
					if ($error = await rebookSegment($group[0]['bookingClass'], $segmentNumbers)) {
						$errors.push($error);
					}
				} else {
					for ($segment of Object.values($group)) {
						if ($error = await rebookSegment($segment['bookingClass'], [$segment['lineNumber']])) {
							$errors.push($error);
						}
					}
				}
			}
		}
		$calledCommands = stateful.flushCalledCommands();
		return {
			'calledCommands': !php.empty($errors) ? $calledCommands : [
				// last command should have resulting PNR dump
				{'cmd': 'RT', 'output': ArrayUtil.getLast($calledCommands)['output']},
			],
			'errors': $errors,
		};
	};

	const bookPassengers = async (passengers) => {
		let paxCmds = [];
		for (let pax of passengers) {
			let {lastName, nameNumber, firstName, ptc, dob} = pax;
			let fullName = lastName + '/' + firstName;
			let dobSuffix = (!dob ? '' : '/' + dob.raw);
			if (paxCmds.length > 0 && nameNumber.isInfant) {
				// NM1LIB/MAR(ADT)(INF/KATJA OLOLO)
				paxCmds[paxCmds.length - 1] += '(INF' + fullName + dobSuffix + ')';
			} else {
				// NM1LIB/ZIM(CNN/25JAN15)
				let cmd = 'NM1' + fullName;
				if (ptc) {
					cmd += '(' + ptc + dobSuffix + ')';
				}
				paxCmds.push(cmd);
			}
		}
		let cmd = paxCmds.join(';');
		let cmdRec = await runCmd(cmd);
		return {calledCommands: [cmdRec], lastPaxNum: paxCmds.length};
	};

	const bookPnr = async (reservation) => {
		let lastPaxNum = 0;
		let pcc = reservation.pcc || null;
		let passengers = reservation.passengers || [];
		let itinerary = reservation.itinerary || [];
		let errors = [];
		let userMessages = [];
		let calledCommands = [];

		if (reservation.pcc && pcc !== getSessionData().pcc) {
			let pccResult = await changePcc(pcc);
			errors.push(...(pccResult.errors || []));
			userMessages.push(...(pccResult.userMessages || []));
			calledCommands.push(...(pccResult.calledCommands || []));
		}
		if (passengers.length > 0) {
			itinerary = itinerary.map((s, i) => ({...s, segmentNumber: +lastPaxNum + +i + 1}));
			let booked = await bookPassengers(passengers);
			lastPaxNum = booked.lastPaxNum || 0;
			errors.push(...(booked.errors || []));
			calledCommands.push(...(booked.calledCommands || []));
		}
		if (itinerary.length > 0) {
			itinerary = itinerary.map((s, i) => ({...s, lineNumber: +lastPaxNum + +i + 1}));
			let booked = await bookItinerary(itinerary, false);
			errors.push(...(booked.errors || []));
			calledCommands.push(...(booked.calledCommands || []));
		}
		return {errors: errors, userMessages: userMessages, calledCommands};
	};

	const rebookSegment = async ($class, $lineNumbers) => {
		let $numberStr, $output, $parsed;

		$numberStr = php.implode(',', $lineNumbers);
		$output = await runCommand('SB' + $class + $numberStr);
		$parsed = PnrParser.parse($output);
		if (!$parsed['success']) {
			if (AmadeusBuildItineraryAction.isAvailabilityOutput($output)) {
				return Errors.getMessage(Errors.CUSTOM, {
					text: 'Failed to change booking class in ' + $numberStr + ' segment(s) due to no availability',
				});
			} else {
				return Errors.getMessage(Errors.REBOOK_FAILURE, {
					'segNums': $numberStr,
					'output': php.trim($output),
				});
			}
		}
		return null;
	};

	const rebookAsSs = async () => {
		let $gkSegments, $newSegments, $result, $calledCommands, $error;

		stateful.flushCalledCommands();
		$gkSegments = (await getCurrentPnr()).getItinerary()
			.filter(($seg) => $seg['segmentStatus'] === 'GK');
		if (php.empty($gkSegments)) {
			return {'errors': ['No GK segments']};
		}
		await runCommand('XE' + php.implode(',', php.array_column($gkSegments, 'lineNumber')));
		$newSegments = Fp.map(($seg) => {
			$seg['segmentStatus'] = '';
			return $seg;
		}, $gkSegments);
		$result = await (new AmadeusBuildItineraryAction())
			.setSession(stateful).execute($newSegments, true);

		$calledCommands = stateful.flushCalledCommands();
		if ($error = transformBuildError($result)) {
			return {
				'calledCommands': $calledCommands,
				'errors': [$error],
			};
		} else {
			return {
				'calledCommands': [
					{'cmd': 'RT', 'output': ArrayUtil.getLast($calledCommands)['output']},
				],
			};
		}
	};

	const getMultiPccTariffDisplay =  ($realCmd) => {
		return (new GetMultiPccTariffDisplayAction())
			.execute($realCmd, stateful);
	};

	const needsRp = async ($cmd, $output, $pnr) => {
		let $parsed = FxParser.parse($output);
		if (($parsed['type']) === 'ptcList') {
			$output = (await AmadeusUtil.fetchAllFx('FQQ1', stateful)).output;
		}
		if (php.isset($parsed['error'])) {
			return false;
		}
		let rbsInfo = await getRbsPqInfo($pnr.getDump(), $output, 'amadeus').catch(exc => ({}));
		return rbsInfo.isPrivateFare && rbsInfo.isBrokenFare;
	};

	const makeStorePricingCmd = async ($pnr, $aliasData, $needsRp) => {
		let $adultPtc, $modRec, $tripEndDate, $tripEndDt, $paxStores, $pax, $paxMods, $error, $rMod,
			$rSubMod, $mod;

		$adultPtc = $aliasData['ptc'] || 'ADT';
		if ($needsRp && $adultPtc === 'ITX') {
			$adultPtc = 'ADT';
		}
		$modRec = await translateApolloPricingModifiers($aliasData['pricingModifiers']);

		$tripEndDate = ((ArrayUtil.getLast($pnr.getItinerary()) || {})['departureDate'] || {})['parsed'];
		$tripEndDt = $tripEndDate ? DateTime.decodeRelativeDateInFuture($tripEndDate, stateful.getStartDt()) : null;

		$paxStores = [];
		for ($pax of Object.values($pnr.getPassengers())) {
			$paxMods = [];
			$paxMods.push('P' + $pax['nameNumber']['fieldNumber']);
			$paxMods.push($pax['nameNumber']['isInfant'] ? 'INF' : 'PAX');
			let ptc = await PtcUtil.convertPtcAgeGroup($adultPtc, $pax, $tripEndDt);
			$rMod = 'R' + ptc;
			if ($needsRp) {
				$rMod += ',P';
			}
			for ($rSubMod of Object.values($modRec['rSubMods'])) {
				$rMod += ',' + $rSubMod;
			}
			$paxMods.push($rMod);
			for ($mod of Object.values($modRec['mods'])) {
				$paxMods.push($mod);
			}
			$paxStores.push(php.implode('/', $paxMods));
		}
		return 'FXP/' + $paxStores.join('//');
	};

	const makePriceAllCmd = async (aliasData) => {
		let {ptcs, pricingModifiers = []} = aliasData;
		let {mods, rSubMods} = await translateApolloPricingModifiers(pricingModifiers);
		let rawMods = [];
		let rMod = 'R' + ptcs.join('*') +
			rSubMods.map(s => ',' + s).join('');
		rawMods.push(rMod);
		rawMods.push(...mods);
		// proper way would be to use >FXA; (analog of $BB), not >FXX; (analog
		// of $B), but the former does not allow pricing multiple passengers
		return 'FXX' + rawMods.map(m => '/' + m).join('');
	};

	const storePricing = async ($aliasData) => {
		let $pnr, $errors;

		$pnr = await getCurrentPnr();
		if (!php.empty($errors = CommonDataHelper.checkSeatCount($pnr))) {
			return Rej.BadRequest('Invalid PNR - ' + $errors.join('; '));
		}
		let cmd = await makeStorePricingCmd($pnr, $aliasData, false);
		let output = (await AmadeusUtil.fetchAllFx(cmd, stateful)).output;

		if (await needsRp(cmd, output, $pnr)) {
			// delete TST we just created, and re-price it with 'P'-ublished mod
			await runCommand('TTE/ALL');
			cmd = await makeStorePricingCmd($pnr, $aliasData, true);
			output = await runCommand(cmd);
		}
		return {calledCommands: [{cmd, output}]};
	};

	const priceAll = async (aliasData) => {
		let cmd = await makePriceAllCmd(aliasData);
		let cmdData = PricingCmdParser.parse(cmd);
		return _fetchPricing(cmd, cmdData);
	};

	const _fetchPricing = async (cmd, cmdData) => {
		let shouldFetchAll = cmdData.baseCmd !== 'FXL'; // FXL = ignore availability
		if (!shouldFetchAll) {
			return processRealCommand(cmd);
		} else if (shouldFetchAll) {
			let fxCmdRec = await AmadeusUtil.fetchAllFx(cmd, stateful);
			let fxOutput = fxCmdRec.output;
			let capturing = withCapture(stateful);
			let pricing = await (new AmadeusGetPricingPtcBlocks())
				.setSession(capturing)
				.execute(cmd, fxOutput);
			let cmdRecs = capturing.getCalledCommands();
			cmdRecs = AmadeusUtil.collectFullCmdRecs(cmdRecs);
			return {calledCommands: [fxCmdRec].concat(cmdRecs)};
		}
	};

	const getEmptyAreasFromDbState =  () => {
		let $isOccupied, $occupiedRows, $occupiedAreas;

		$isOccupied = ($row) => $row['hasPnr'];
		$occupiedRows = Fp.filter($isOccupied, stateful.getAreaRows());
		$occupiedAreas = php.array_column($occupiedRows, 'area');
		$occupiedAreas.push(getSessionData()['area']);
		return php.array_values(php.array_diff(AREA_LETTERS, $occupiedAreas));
	};

	const changePcc = async (pcc) => {
		let $calledCommands, $jdDump, $parsed;

		$calledCommands = [];

		if (stateful.getSessionData()['pcc'] === pcc) {
			return {'errors': [Errors.getMessage(Errors.ALREADY_IN_THIS_PCC, {'pcc': pcc})]};
		}

		// check that there is no PNR in session to match GDS behaviour
		if (stateful.getSessionData().hasPnr) {
			return {'errors': [Errors.getMessage(Errors.LEAVE_PNR_CONTEXT, {'pcc': pcc})]};
		}

		let areaState = await startNewAreaSession(stateful.getSessionData().area, pcc)
			.catch(exc => formatGtlPccError(exc, pcc));

		areaState.cmdCnt = 1; // to not trigger default area PCC fallback later

		// sometimes when you request invalid PCC, Amadeus fallbacks to
		// SFO1S2195 - should call >JD; and check that PCC is what we requested
		let jdCmdRec = await amadeus.runCmd({command: 'JD'}, areaState.gdsData);
		$jdDump = jdCmdRec.output;
		$parsed = WorkAreaScreenParser.parse($jdDump);
		if ($parsed['pcc'] !== pcc) {
			amadeus.closeSession(areaState.gdsData);
			return {
				'calledCommands': [{cmd: 'JD', output: $jdDump}],
				'errors': ['Failed to change PCC - resulting PCC ' + $parsed['pcc'] + ' does not match requested PCC ' + pcc],
			};
		}

		let oldGdsData = stateful.getGdsData();
		await updateGdsData(areaState);
		amadeus.closeSession(oldGdsData);

		return {
			'calledCommands': $calledCommands,
			'userMessages': ['Successfully changed PCC to ' + pcc],
		};
	};

	const _preprocessSameMonthReturnAvailability = async (day) => {
		let lastAvail = (await stateful.getLog().getLikeSql({
			where: [
				['area', '=', getSessionData().area],
				['type', '=', 'airAvailability'],
				['is_mr', '=', false],
			],
			limit: 1,
		}))[0];
		if (!lastAvail) {
			return Rej.BadRequest('No recent availability to request return date from');
		}
		let {type, data} = CommandParser.parse(lastAvail.cmd);
		if (type !== 'airAvailability' || !data) {
			return Rej.NotImplemented('Could not parse availability cmd >' + lastAvail.cmd + ';');
		}
		let flightDetails = data.modifiers
			.filter(m => m.type === 'flightDetails')
			.map(m => m.parsed)[0];
		if (!flightDetails) {
			return Rej.BadRequest('Original availability request has no date specified >' + lastAvail.cmd + ';');
		} else {
			let month = flightDetails.departureDate.raw.slice(-3);
			return 'ACR' + day + month;
		}
	};

	const preprocessCommand = async ($cmd) => {
		let $lastCmdRec, $wasRtFormatPage, $pnr, aliasData;

		if ($cmd === 'MD') {
			if ($lastCmdRec = await stateful.getLog().getLastCalledCommand()) {
				$wasRtFormatPage = php.preg_match(/^\/\$(.+?)(\n\)\s*)$/s, $lastCmdRec['output']);
				if ($wasRtFormatPage) {
					// MD without overlapping - more
					// useful for reusing output
					$cmd = 'MDR';
				}
			}
		} else if ($cmd === 'XI') {
			// XI deletes GD- remark, so we replace it
			// with XE2,3,4 to delete only segment lines
			$pnr = await getCurrentPnr();
			$cmd = 'XE' + php.implode(',', php.array_column($pnr.getItinerary(), 'lineNumber'));
		} else if (aliasData = AliasParser.parseSameMonthReturnAvail($cmd)) {
			$cmd = await _preprocessSameMonthReturnAvailability(aliasData.days);
		}
		return $cmd;
	};

	const runCmd = async (cmd) => {
		let cmdRec = await stateful.runCmd(cmd);
		if (countsAsFxd(cmd, cmdRec.output)) {
			stateful.handleFsUsage();
		}
		return cmdRec;
	};

	// public for closures
	const runCommand = async ($cmd) => {
		return (await runCmd($cmd)).output;
	};

	const amadeusRt = async ($cmd) => {
		return (await AmadeusUtil.fetchAllRt($cmd, stateful)).output;
	};

	const makeCmdMessages = async ($cmd, $output) => {
		let $userMessages, $type, $agent, $left, $fsLeftMsg;

		$userMessages = [];
		$type = CommandParser.parse($cmd)['type'];
		if (php.in_array($type, CommonDataHelper.getCountedFsCommands())) {
			$agent = getAgent();
			$left = $agent.getFsLimit() - await $agent.getFsCallsUsed();
			$fsLeftMsg = $left + ' FXD COMMANDS REMAINED';
			$userMessages.push($fsLeftMsg);
		}
		return $userMessages;
	};

	/** @return string - the command we are currently scrolling
	 * (last command that was not one of MD, MU, MT, MB */
	const getScrolledCmd =  () => {
		return stateful.getSessionData().scrolledCmd;
	};

	const modifyOutput =  ($calledCommand) => {
		let $scrolledCmd, $type, $lines, $isSafe;
		$calledCommand = {...$calledCommand};

		$scrolledCmd = getScrolledCmd() || $calledCommand['cmd'];
		$type = (CommandParser.parse($scrolledCmd) || {})['type'];
		if (php.in_array($type, ['searchPnr', 'displayPnrFromList']) &&
			!stateful.getAgent().canOpenPrivatePnr()
		) {
			$lines = StringUtil.lines($calledCommand['output']);
			$isSafe = ($line) => !StringUtil.contains($line, 'WEINSTEIN/ALEX');
			$calledCommand['output'] = php.implode(php.PHP_EOL, Fp.filter($isSafe, $lines));
		}
		return $calledCommand;
	};

	const getCurrentPnr = async () => {
		return GetCurrentPnr.inAmadeus(stateful);
	};

	const areAllCouponsVoided = async () => {
		let $faRecs, $faRec, $twdOutput, $twdParsed, $isFlight, $isVoid, $coupons;

		$faRecs = (((await getCurrentPnr()).getParsedData() || {})['parsed'] || {})['tickets'] || [];
		for ($faRec of Object.values($faRecs)) {
			$twdOutput = await runCommand('TWD/L' + $faRec['lineNumber']);
			$twdParsed = TicketMaskParser.parse($twdOutput);
			$isFlight = ($seg) => $seg['type'] !== 'void';
			$isVoid = ($seg) => StringUtil.startsWith($seg['couponStatus'], 'V');
			if ($twdParsed.error) {
				return false;
			}
			$coupons = Fp.filter($isFlight, $twdParsed['segments']);
			if (!Fp.all($isVoid, $coupons)) {
				return false;
			}
		}
		return true;
	};

	const isGdRemarkLine = async ($lineNum) => {
		let $remark;

		for ($remark of Object.values((await getCurrentPnr()).getRemarks())) {
			if ($remark['lineNumber'] == $lineNum) {
				return $remark['remarkType'] === GenericRemarkParser.CMS_LEAD_REMARK;
			}
		}
		return false;
	};

	const checkIsForbidden = async ($cmd) => {
		let $errors, $parsedCmd, $flatCmds, $type, $agent, $isQueueCmd, $totalAllowed, $pnr, $canChange, $flatCmd,
			$numRec;

		$errors = [];
		$parsedCmd = CommandParser.parse($cmd);
		$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands'] || []);
		$type = $parsedCmd['type'];
		$agent = getAgent();
		$isQueueCmd =
			php.in_array($type, CommonDataHelper.getQueueCommands()) ||
			StringUtil.startsWith($cmd, 'Q'); // to be extra sure

		if (php.in_array($type, CommonDataHelper.getTicketingCommands())) {
			if (!$agent.canIssueTickets()) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type}));
			}
		} else if (php.in_array($type, CommonDataHelper.getCountedFsCommands())) {
			$totalAllowed = $agent.getFsLimit();
			if (!$totalAllowed) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type}));
			} else if ((await $agent.getFsCallsUsed()) >= $totalAllowed) {
				$errors.push(Errors.getMessage(Errors.FS_LIMIT_EXHAUSTED, {'totalAllowed': $totalAllowed}));
			}
		} else if ($isQueueCmd && !php.in_array($type, ['movePnrToQueue'])) {
			if (!$agent.canProcessQueues()) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type || 'queueOperation'}));
			}
		} else if ($type === 'searchPnr') {
			if (!$agent.canSearchPnr()) {
				$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type}));
			}
		} else if (php.in_array($type, CommonDataHelper.getTotallyForbiddenCommands())) {
			$errors.push(Errors.getMessage(Errors.CMD_FORBIDDEN, {'cmd': $cmd, 'type': $type}));
		}
		if ($type == 'deletePnrField' || $type == 'deletePnr') {
			if (stateful.getSessionData()['isPnrStored'] &&
				!$agent.canEditTicketedPnr()
			) {
				$pnr = await getCurrentPnr();
				$canChange = !$pnr.hasEtickets()
					|| $agent.canEditVoidTicketedPnr()
					&& await areAllCouponsVoided();
				if (!$canChange) {
					$errors.push(Errors.getMessage(Errors.CANT_CHANGE_TICKETED_PNR));
				}
			}
		}
		if (getSessionData()['isPnrStored']) {
			for ($flatCmd of Object.values($flatCmds)) {
				if ($flatCmd['type'] === 'changePnrField') {
					if (await isGdRemarkLine($flatCmd['data']['majorNum'])) {
						$errors.push(Errors.getMessage(Errors.CANT_CHANGE_GDSD_REMARK, {'lineNum': $flatCmd['data']['majorNum']}));
					}
				} else if ($flatCmd['type'] === 'deletePnrField') {
					for ($numRec of Object.values(($flatCmd['data'] || {})['lineNumbers'] || [])) {
						if (await isGdRemarkLine($numRec['major'])) {
							$errors.push(Errors.getMessage(Errors.CANT_CHANGE_GDSD_REMARK, {'lineNum': $numRec['major']}));
						}
					}
				}
			}
		}
		return $errors;
	};

	const callImplicitCommandsBefore = async ($cmd) => {
		let $calledCommands;

		$calledCommands = [];
		if (doesStorePnr($cmd)) {
			if ($cmd = await makeCreatedForCmdIfNeeded()) {
				await runCommand($cmd);
			}
			if ($cmd = await makeTopRemarkCmdIfNeeded()) {
				await runCommand($cmd);
			}
		}
		return $calledCommands;
	};

	const callImplicitCommandsAfter = async ($cmdRecord, $calledCommands, $userMessages) => {
		let $recordLocator, $parsed, $isAlex;

		$calledCommands.push(await modifyOutput($cmdRecord));
		if (doesStorePnr($cmdRecord['cmd'])) {
			$recordLocator = ((new CmsAmadeusTerminal()).parseSavePnr($cmdRecord['output'], true) || {})['recordLocator']
							|| (new CmsAmadeusTerminal()).parseSavePnr($cmdRecord['output'], false)['recordLocator'];
			if ($recordLocator) {
				handlePnrSave($recordLocator);
			}
		} else if (doesOpenPnr($cmdRecord['cmd'])) {
			$parsed = PnrParser.parse($cmdRecord['output']);
			$isAlex = ($pax) => {
				return $pax['lastName'] === 'WEINSTEIN'
					&& $pax['firstName'] === 'ALEX';
			};
			if (Fp.any($isAlex, ($parsed['parsed'] || {})['passengers'] || []) &&
				!stateful.getAgent().canOpenPrivatePnr()
			) {
				await runCommand('IG');
				return {'errors': ['Restricted PNR']};
			}
		}
		return {'calledCommands': $calledCommands, 'userMessages': $userMessages};
	};

	const processRealCommand = async ($cmd) => {
		let $errors, $calledCommands, $output, $userMessages;

		$cmd = await preprocessCommand($cmd);
		if (!php.empty($errors = await checkIsForbidden($cmd))) {
			return {'errors': $errors};
		}
		$calledCommands = [];
		$calledCommands = php.array_merge($calledCommands, await callImplicitCommandsBefore($cmd));
		let cmdRec = await runCmd($cmd);
		$userMessages = await makeCmdMessages($cmd, $output);
		return callImplicitCommandsAfter(cmdRec, $calledCommands, $userMessages);
	};

	const priceInAnotherPcc = async ($cmd, $target, $dialect) => {
		let $pnr;

		$pnr = await getCurrentPnr();
		return (new RepriceInAnotherPccAction())
			.execute($pnr, $cmd, $dialect, $target, stateful);
	};

	const processRequestedCommand = async ($cmd) => {
		let $matches, $area, $pcc, $mdaData, $limit, $cmdReal, $reData,
			$aliasData, $params, $itinerary, $result, reservation;

		let parsed = CommandParser.parse($cmd);

		if (php.preg_match(/^JM *([A-Z])$/, $cmd, $matches = [])) {
			$area = $matches[1];
			return changeArea($area);
		} else if (php.preg_match(/^JUM\/O- *([A-Z0-9]+)$/, $cmd, $matches = [])) {
			$pcc = $matches[1];
			return changePcc($pcc);
		} else if (php.preg_match(/^JD$/, $cmd, $matches = [])) {
			return {'calledCommands': [imitateGetAreasCmd()]};
		} else if ($mdaData = AliasParser.parseMda($cmd)) {
			$limit = $mdaData['limit'] || null;
			if ($cmdReal = $mdaData['realCmd']) {
				return runAndMoveDownAll($cmdReal, $limit || null);
			} else {
				return moveDownAll($limit);
			}
		} else if (php.preg_match(/^PNR$/, $cmd, $matches = [])) {
			return processSavePnr();
		} else if (php.preg_match(/^SORT$/, $cmd, $matches = [])) {
			return processSortItinerary();
		} else if ($reData = AliasParser.parseRe($cmd)) {
			return processCloneItinerary($reData);
		} else if ($aliasData = AliasParser.parseStore($cmd)) {
			return storePricing($aliasData);
		} else if ($aliasData = await AliasParser.parsePrice($cmd, stateful)) {
			return priceAll($aliasData);
		} else if ($params = parseSeatIncreasePseudoCmd($cmd)) {
			return processSeatIncrease($params);
		} else if ($cmd === '/SS') {
			return rebookAsSs();
		} else if (php.preg_match(/^(FQD.*)\/MIX$/, $cmd, $matches = [])) {
			return getMultiPccTariffDisplay($matches[1]);
		} else if (!php.empty(reservation = await AliasParser.parseCmdAsPnr($cmd, stateful))) {
			return bookPnr(reservation);
		} else if (!php.empty($itinerary = await AliasParser.parseCmdAsItinerary($cmd, stateful))) {
			return bookItinerary($itinerary, true);
		} else if ($result = RepriceInAnotherPccAction.parseAlias($cmd)) {
			return priceInAnotherPcc($result['cmd'], $result['target'], $result['dialect']);
		} else if (parsed.type === 'priceItinerary') {
			return _fetchPricing($cmd, parsed.data);
		} else {
			return processRealCommand($cmd);
		}
	};

	const imitateGetAreasCmd =  () => {
		let $sessionData, $areasFromDb;

		$sessionData = getSessionData();
		$areasFromDb = stateful.getAreaRows();

		return {
			'cmd': 'JD',
			'output': forgeViewAreasDump($sessionData, $areasFromDb),
		};
	};

	const execute = async ($cmdRequested) => {
		let $callResult, $errors, $status, $calledCommands, $userMessages;

		$callResult = await processRequestedCommand($cmdRequested);

		if (!php.empty($errors = $callResult['errors'])) {
			$status = GdsDirect.STATUS_FORBIDDEN;
			$calledCommands = $callResult['calledCommands'] || [];
			$userMessages = $errors;
		} else {
			$status = GdsDirect.STATUS_EXECUTED;
			$calledCommands = $callResult['calledCommands'].map(a => a);
			$userMessages = $callResult['userMessages'] || [];
		}

		return {
			'status': $status,
			'calledCommands': $calledCommands,
			'userMessages': $userMessages,
		};
	};

	return execute(cmdRq);
};

/** exposing for unit tests */
execute.forgeViewAreasDump = forgeViewAreasDump;

module.exports = execute;
