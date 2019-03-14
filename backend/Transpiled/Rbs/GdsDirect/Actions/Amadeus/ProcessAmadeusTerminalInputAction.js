// namespace Rbs\GdsDirect\Actions\Amadeus;

const php = require('../../../../php.js');
const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const DateTime = require('../../../../Lib/Utils/DateTime.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const RepriceInAnotherPccAction = require('../../../../Rbs/GdsDirect/Actions/Common/RepriceInAnotherPccAction.js');
const GetMultiPccTariffDisplayAction = require('../../../../Rbs/GdsDirect/Actions/Common/GetMultiPccTariffDisplayAction.js');
const AliasParser = require('../../../../Rbs/GdsDirect/AliasParser.js');
const Errors = require('../../../../Rbs/GdsDirect/Errors.js');
const GdsDirect = require('../../../../Rbs/GdsDirect/GdsDirect.js');
const AmadeusReservationParser = require('../../../../Gds/Parsers/Amadeus/Pnr/PnrParser.js');
const GenericRemarkParser = require('../../../../Gds/Parsers/Common/GenericRemarkParser.js');
const CommonDataHelper = require('../../../../Rbs/GdsDirect/CommonDataHelper.js');
const SessionStateHelper = require('../../../../Rbs/GdsDirect/SessionStateProcessor/SessionStateHelper.js');
const PtcUtil = require('../../../../Rbs/Process/Common/PtcUtil.js');
const CommandParser = require('../../../../Gds/Parsers/Amadeus/CommandParser.js');
const CmsAmadeusTerminal = require('../../../../Rbs/GdsDirect/GdsInterface/CmsAmadeusTerminal.js');
const AmadeusUtil = require("../../../../../GdsHelpers/AmadeusUtils");
const GdsProfiles = require("../../../../../Repositories/GdsProfiles");
const getRbsPqInfo = require("../../../../../GdsHelpers/RbsUtils").getRbsPqInfo;
const translib = require('../../../../translib.js');
const MoveDownAllAction = require('./MoveDownAllAction.js');
const AmadeusPnr = require('../../../../Rbs/TravelDs/AmadeusPnr.js');
const AmadeusBuildItineraryAction = require('../../../../Rbs/GdsAction/AmadeusBuildItineraryAction.js');
const MarriageItineraryParser = require('../../../../Gds/Parsers/Amadeus/MarriageItineraryParser.js');

var require = translib.stubRequire;

const FxParser = require('../../../../Gds/Parsers/Amadeus/Pricing/FxParser.js');
const TicketMaskParser = require('../../../../Gds/Parsers/Amadeus/TicketMaskParser.js');

class ProcessAmadeusTerminalInputAction {
	/** @param $statefulSession = require('StatefulSession.js')() */
	constructor($statefulSession) {
		this.stateful = $statefulSession;
		this.$log = ($msg, $data) => {
		};
	}

	setLog($log) {
		this.$log = $log;
		return this;
	}

	log($msg, $data) {
		let $log;

		$log = this.$log;
		$log($msg, $data);
	}

	static doesStorePnr($cmd) {
		let $parsedCmd, $flatCmds, $cmdTypes;

		$parsedCmd = CommandParser.parse($cmd);
		$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands'] || []);
		$cmdTypes = php.array_column($flatCmds, 'type');
		return !php.empty(php.array_intersect($cmdTypes, ['storePnr', 'storeKeepPnr']));
	}

	static doesOpenPnr($cmd) {
		let $parsedCmd;

		$parsedCmd = CommandParser.parse($cmd);
		return php.in_array($parsedCmd['type'], ['openPnr', 'searchPnr', 'displayPnrFromList']);
	}

	static formatGtlPccError($exc) {

		if (php.preg_match(/\bSoapFault: *11|\Session\b/, $exc.getMessage())) {
			return 'Invalid PCC';
		} else {
			return 'Unexpected GTL error - ' + php.preg_replace(/\s+/, ' ', php.substr($exc.getMessage(), -100));
		}
	}

	static isSaveConfirmationRequired($output) {
		let $regex;

		// '/',
		// 'WARNING: CHECK TICKETING DATE',
		// 'WARNING: PS REQUIRES TICKET ON OR BEFORE 19SEP:1900/S2-3',
		$regex =
			'\/^' +
			'\\s*\\\/\\s*' +
			'(\\s*WARNING: .*\\s*)+' +
			'$\/';
		return php.preg_match($regex, $output);
	}

	static isOkXeOutput($output) {
		let $parsedPnr;

		$parsedPnr = AmadeusReservationParser.parse($output);
		return $parsedPnr['success']
			|| php.preg_match(/^\s*\/\s*ITINERARY CANCELLED\s*$/, $output);
	}

	static isOkFxdOutput($output) {
		let $pager;

		$pager = AmadeusUtil.parseRtPager($output);
		return $pager['hasPageMark']; // error responses don't have it
	}

	static countsAsFxd($cmd, $output) {
		let $cmdType;

		$cmdType = CommandParser.parse($cmd)['type'];
		return php.in_array($cmdType, CommonDataHelper.getCountedFsCommands())
			&& this.isOkFxdOutput($output);
	}

	// '+4', '+4S3', '+4S1-3GK'
	static parseSeatIncreasePseudoCmd($cmd) {
		let $regex, $matches;

		$regex =
			'\/^\\+' +
			'(?<seatAmount>\\d+)' +
			'(S' +
			'(?<segNumStart>\\d+)' +
			'(-(?<segNumEnd>\\d+))?' +
			')?' +
			'(?<segmentStatus>[A-Z]{2})?' +
			'$\/';
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
	}

	async makeCreatedForCmdIfNeeded() {
		let $cmdLog, $sessionData, $leadData, $remarkCmd, $flattenCmd, $performedCmds, $flatPerformedCmds;

		$cmdLog = this.stateful.getLog();
		$sessionData = $cmdLog.getSessionData();
		if (!$sessionData['is_pnr_stored']) {
			$leadData = this.stateful.getLeadData();
			$remarkCmd = 'RM' + await CommonDataHelper.createCredentialMessage(this.stateful);

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
	}

	async makeTopRemarkCmdIfNeeded() {
		let $cmdLog, $sessionData, $performedCmds, $msg, $cmd;

		$cmdLog = this.stateful.getLog();
		$sessionData = $cmdLog.getSessionData();
		if (!$sessionData['is_pnr_stored']) {
			$performedCmds = php.array_column(await $cmdLog.getCurrentPnrCommands(), 'cmd');
			$msg = 'CREATED IN GDS DIRECT BY ' + php.strtoupper(this.getAgent().getLogin());
			$cmd = 'UHP\/' + $msg;
			if (!php.in_array($cmd, $performedCmds)) {
				return $cmd;
			}
		}
		return null;
	}

	getAgent() {
		return this.stateful.getAgent();
	}

	/** @return Agent|null */
	getLeadAgent() {
		return this.stateful.getLeadAgent();
	}

	getSessionData() {
		return this.stateful.getSessionData();
	}

	handlePnrSave($recordLocator) {
		this.stateful.handlePnrSave($recordLocator);
	}

	async moveDownAll($limit) {
		let $pageLimit = $limit || 100;
		let $result = await (new MoveDownAllAction())
			.setSession(this.stateful)
			.execute(this.stateful.getLog(), $pageLimit);
		$result['calledCommands'] = Fp.map(($cmdRec) => {
			return this.modifyOutput($cmdRec);
		}, $result['calledCommands'] || []);
		return $result;
	}

	async runAndMoveDownAll($cmdReal, $limit) {
		let $result, $moved;

		$result = await this.processRealCommand($cmdReal);
		if (php.empty($result['errors'])) {
			$moved = await this.moveDownAll($limit);
			if (php.empty($moved['errors'])) {
				$result['calledCommands'] = $moved['calledCommands'];
			}
			$result['userMessages'] = php.array_merge($result['userMessages'] || [],
				$moved['userMessages'] || []);
			$result['errors'] = $moved['errors'] || [];
		}
		return $result;
	}

	async processSavePnr() {
		let $calledCommands, $pnr, $errors, $login, $cmd, $writeCommands, $output, $parsedStoredPnr, $rloc;

		$calledCommands = [];

		if (php.empty(this.stateful.getLeadData()['leadId'])) {
			if (!this.getAgent().canSavePnrWithoutLead()) {
				return {'errors': [Errors.getMessage(Errors.LEAD_ID_IS_REQUIRED)]};
			}
		}
		$pnr = await this.getCurrentPnr();
		if (!CommonDataHelper.isValidPnr($pnr)) {
			return {'errors': [Errors.getMessage(Errors.INVALID_PNR, {'response': php.trim($pnr.getDump())})]};
		} else if (!php.empty($errors = CommonDataHelper.checkSeatCount($pnr))) {
			return {'errors': $errors};
		}

		$login = this.getAgent().getLogin();

		if ($cmd = await this.makeTopRemarkCmdIfNeeded()) {
			// not joinable
			await this.runCommand($cmd);
		}
		$writeCommands = [
			// phone number will be added automatically
			// 'APSFO800-750-2238-A',
			'TKTL' + php.strtoupper(php.date('dM', php.strtotime(this.stateful.getStartDt()))), // ticketing time limit
			'RF' + php.strtoupper($login), // received from
			'ER',
		];
		if ($cmd = await this.makeCreatedForCmdIfNeeded()) {
			php.array_unshift($writeCommands, $cmd);
		}

		$cmd = php.implode(';', $writeCommands);
		$output = await this.amadeusRt($cmd);

		if (this.constructor.isSaveConfirmationRequired($output)) {
			$calledCommands.push({'cmd': 'ER', 'output': $output});
			$output = await this.amadeusRt('ER');
		}
		$parsedStoredPnr = AmadeusReservationParser.parse($output);
		if ($rloc = (($parsedStoredPnr['parsed'] || {})['pnrInfo'] || {})['recordLocator']) {
			this.handlePnrSave($rloc);
		}

		$calledCommands.push({'cmd': 'PNR', 'output': $output});
		return {'calledCommands': $calledCommands};
	}

	async processSortItinerary() {
		let $pnr, $pnrDump,
			$calledCommands, $cmd;

		$pnr = await this.getCurrentPnr();
		$pnrDump = $pnr.getDump();
		let {itinerary} = await CommonDataHelper.sortSegmentsByUtc($pnr, this.stateful.getGeoProvider());

		$calledCommands = [];
		$cmd = 'RS' + itinerary.map(s => s.segmentNumber).join(',');
		let output = await this.runCommand($cmd);
		$calledCommands.push({cmd: $cmd, output});
		return {'calledCommands': $calledCommands};
	}

	changeArea($area) {
		let $calledCommands, $errorData, $sessionId, $areaRows, $isRequested, $row, $stopwatch, $newSession;

		$calledCommands = [];

		if (!php.in_array($area, this.constructor.AREA_LETTERS)) {
			$errorData = {'area': $area, 'options': php.implode(', ', this.constructor.AREA_LETTERS)};
			return {'errors': [Errors.getMessage(Errors.INVALID_AREA_LETTER, $errorData)]};
		}
		if (this.stateful.getSessionData()['area'] === $area) {
			return {'errors': [Errors.getMessage(Errors.ALREADY_IN_THIS_AREA, {'area': $area})]};
		}
		$sessionId = this.getSessionData()['id'];
		$areaRows = this.stateful.getAreaRows();
		$isRequested = ($row) => $row['work_area_letter'] === $area;
		$row = ArrayUtil.getFirst(Fp.filter($isRequested, $areaRows));

		if (!$row) {
			$newSession = this.stateful.startNewGdsSession();
			$row = SessionStateHelper.makeNewAreaData({
				'id': $sessionId,
				'area': $area,
				'internal_token': $newSession.getSessionToken(),
				'pcc': GdsProfiles.AMADEUS.AMADEUS_PROD_1ASIWTUTICO,
			});
		}
		this.stateful.getLog().updateAreaState($row, {
			'type': 'changeArea',
			'duration': $stopwatch.stop()['timeDelta'],
		});

		return {
			'calledCommands': $calledCommands,
			'userMessages': ['Successfully changed area to ' + $area],
		};
	}

	async deleteSegments($segNumStart, $segNumEnd) {
		let $rtamDump, $itinerary, $xeCmd, $segNums, $matches, $matchedSegments, $xeOutput;

		$rtamDump = await this.amadeusRt('RTAM');
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
		$xeOutput = await this.runCommand($xeCmd);
		if (!this.constructor.isOkXeOutput($xeOutput)) {
			return {
				'errors': ['Failed to delete segments - ' + $xeOutput],
				'calledCommands': this.stateful.flushCalledCommands(),
			};
		}
		return {'matchedSegments': $matchedSegments};
	}

	/** @param $params = ProcessAmadeusTerminalInputAction::parseSeatIncreasePseudoCmd() */
	async processSeatIncrease($params) {
		let $deleted, $matchedSegments, $i;

		if ($params['seatAmount'] > 9) {
			return {'errors': ['Seat amount must be a one-digit number']};
		}
		$deleted = await this.deleteSegments($params['segNumStart'], $params['segNumEnd']);
		if (php.empty($matchedSegments = $deleted['matchedSegments'] || [])) {
			return $deleted;
		}
		for ($i = 0; $i < php.count($matchedSegments); ++$i) {
			$matchedSegments[$i]['statusNumber'] = $params['seatAmount'];
			$matchedSegments[$i]['segmentStatus'] = $params['segmentStatus'];
		}
		return this.bookItinerary($matchedSegments);
	}

	async processCloneItinerary($aliasData) {
		let $pcc, $segmentStatus, $seatNumber, $pnrDump, $itinerary, $emptyAreas, $area, $result, $key, $segment;

		$pcc = $aliasData['pcc'];
		$segmentStatus = $aliasData['segmentStatus'] || 'GK';
		$seatNumber = $aliasData['seatCount'] || 0;

		$pnrDump = (await AmadeusUtil.fetchAllRt('RTAM', this.runCommand)).output;

		if (php.empty($itinerary = MarriageItineraryParser.parse($pnrDump))) {
			return {'errors': [Errors.getMessage(Errors.ITINERARY_IS_EMPTY)]};
		}
		if (php.empty($emptyAreas = this.getEmptyAreasFromDbState())) {
			return {'errors': [Errors.getMessage(Errors.NO_FREE_AREAS)]};
		}
		if (!this.getSessionData()['is_pnr_stored'] && !$aliasData['keepOriginal'] && $segmentStatus !== 'GK') {
			await this.runCommand('IG'); // ignore the itinerary it initial area
		}
		$area = $emptyAreas[0];
		$result = this.changeArea($area);
		if (!php.empty($result['errors'])) {
			return $result;
		}
		if (this.getSessionData()['pcc'] !== $pcc) {
			$result = this.changePcc($pcc);
			if (!php.empty($result['errors'])) {
				return $result;
			}
		}

		for ([$key, $segment] of Object.entries($itinerary)) {
			if ($seatNumber >= 1 && $seatNumber <= 9) {
				$itinerary[$key]['statusNumber'] = $seatNumber;
			}
			$itinerary[$key]['segmentStatus'] = $segmentStatus;
			$itinerary[$key]['lineNumber'] = $key + 1;
		}

		return this.bookItinerary($itinerary);
	}

	static transformBuildError($result) {
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
	}

	/** @param $itinerary = MarriageItineraryParser::parse() */
	async bookItinerary($itinerary) {
		let $errors, $i, $segment, $bookItinerary, $result, $error, $isActive, $activeSegments, $marriageGroups,
			$marriage, $group, $segmentNumbers, $calledCommands;

		$errors = [];
		this.stateful.flushCalledCommands();

		for ([$i, $segment] of Object.entries($itinerary)) {
			// in most cases there are no paxes in destination PNR, so first segment number will be 1
			$segment['lineNumber'] = +$i + 1; // $segment['lineNumber'] || $i + 1;
		}
		$bookItinerary = $itinerary.map(($segment) => {
			let cls = !php.in_array($segment['segmentStatus'], this.constructor.PASSIVE_STATUSES)
				? 'Y' : $segment['bookingClass'];
			return {...$segment, bookingClass: cls};
		});

		$result = await (new AmadeusBuildItineraryAction())
			.setSession(this.stateful).execute($bookItinerary, true);

		if ($error = this.constructor.transformBuildError($result)) {
			$errors.push($error);
		} else {
			$isActive = ($seg) => !php.in_array($seg['segmentStatus'], this.constructor.PASSIVE_STATUSES);
			$activeSegments = Fp.filter($isActive, $itinerary);
			$marriageGroups = Fp.groupBy(($seg) => $seg['marriage'], $activeSegments);

			for ([$marriage, $group] of Object.entries($marriageGroups)) {
				if ($marriage > 0) {
					$segmentNumbers = php.array_column($group, 'lineNumber');
					if ($error = await this.rebookSegment($group[0]['bookingClass'], $segmentNumbers)) {
						$errors.push($error);
					}
				} else {
					for ($segment of Object.values($group)) {
						if ($error = await this.rebookSegment($segment['bookingClass'], [$segment['lineNumber']])) {
							$errors.push($error);
						}
					}
				}
			}
		}
		$calledCommands = this.stateful.flushCalledCommands();
		return {
			'calledCommands': !php.empty($errors) ? $calledCommands : [
				// last command should have resulting PNR dump
				{'cmd': 'RT', 'output': ArrayUtil.getLast($calledCommands)['output']},
			],
			'errors': $errors,
		};
	}

	async rebookSegment($class, $lineNumbers) {
		let $numberStr, $output, $parsed;

		$numberStr = php.implode(',', $lineNumbers);
		$output = await this.runCommand('SB' + $class + $numberStr);
		$parsed = AmadeusReservationParser.parse($output);
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
	}

	async rebookAsSs() {
		let $gkSegments, $newSegments, $result, $calledCommands, $error;

		this.stateful.flushCalledCommands();
		$gkSegments = (await this.getCurrentPnr()).getItinerary()
			.filter(($seg) => $seg['segmentStatus'] === 'GK',);
		if (php.empty($gkSegments)) {
			return {'errors': ['No GK segments']};
		}
		await this.runCommand('XE' + php.implode(',', php.array_column($gkSegments, 'lineNumber')));
		$newSegments = Fp.map(($seg) => {
			$seg['segmentStatus'] = '';
			return $seg;
		}, $gkSegments);
		$result = await (new AmadeusBuildItineraryAction()).setLog(this.$log)
			.setSession(this.stateful).execute($newSegments, true);

		$calledCommands = this.stateful.flushCalledCommands();
		if ($error = this.constructor.transformBuildError($result)) {
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
	}

	getMultiPccTariffDisplay($realCmd) {
		return (new GetMultiPccTariffDisplayAction())
			.execute($realCmd, this.stateful);
	}

	async needsRp($cmd, $output, $pnr) {
		let $parsed = FxParser.parse($output);
		if (($parsed['type']) === 'ptcList') {
			$output = (await AmadeusUtil.fetchAllFx((...args) => this.runCommand(...args), 'FQQ1')).output;
		}
		if (php.isset($parsed['error'])) {
			return false;
		}
		let rbsInfo = await getRbsPqInfo($pnr.getDump(), $output, 'amadeus').catch(exc => ({}));
		return rbsInfo.isPrivateFare && rbsInfo.isBrokenFare;
	}

	static translateApolloPricingModifiers($apolloMods) {
		let $mods, $rSubMods, $apolloMod;

		$mods = [];
		$rSubMods = [];
		for ($apolloMod of Object.values($apolloMods)) {
			if ($apolloMod['type'] === 'validatingCarrier') {
				$rSubMods.push('VC-' + $apolloMod['parsed']);
			} else {
				return {'errors': ['Unsupported modifier - ' + $apolloMod['raw']]};
			}
		}
		return {'mods': $mods, 'rSubMods': $rSubMods};
	}

	makeStorePricingCmd($pnr, $aliasData, $needsRp) {
		let $adultPtc, $modRec, $tripEndDate, $tripEndDt, $paxStores, $pax, $paxMods, $determined, $error, $rMod,
			$rSubMod, $mod;

		$adultPtc = $aliasData['ptc'] || 'ADT';
		if ($needsRp && $adultPtc === 'ITX') {
			$adultPtc = 'ADT';
		}
		$modRec = this.constructor.translateApolloPricingModifiers($aliasData['pricingModifiers']);
		if (!php.empty($modRec['errors'])) {
			return {'errors': $modRec['errors']};
		}

		$tripEndDate = ((ArrayUtil.getLast($pnr.getItinerary()) || {})['departureDate'] || {})['parsed'];
		$tripEndDt = $tripEndDate ? DateTime.decodeRelativeDateInFuture($tripEndDate, this.stateful.getStartDt()) : null;

		$paxStores = [];
		for ($pax of Object.values($pnr.getPassengers())) {
			$paxMods = [];
			$paxMods.push('P' + $pax['nameNumber']['fieldNumber']);
			$paxMods.push($pax['nameNumber']['isInfant'] ? 'INF' : 'PAX');
			$determined = PtcUtil.convertPtcAgeGroup($adultPtc, $pax, $tripEndDt);
			if ($error = $determined['error']) {
				return {'errors': ['Unknown PTC for passenger #' + $pax['nameNumber']['raw'] + ': ' + $error]};
			} else {
				$rMod = 'R' + $determined['ptc'];
				if ($needsRp) {
					$rMod += ',P';
				}
				for ($rSubMod of Object.values($modRec['rSubMods'])) {
					$rMod += ',' + $rSubMod;
				}
				$paxMods.push($rMod);
			}
			for ($mod of Object.values($modRec['mods'])) {
				$paxMods.push($mod);
			}
			$paxStores.push(php.implode('\/', $paxMods));
		}
		return {'cmd': 'FXP\/' + php.implode('\/\/', $paxStores)};
	}

	async storePricing($aliasData) {
		let $pnr, $errors, $cmdRecord, $output;

		$pnr = await this.getCurrentPnr();
		if ($errors = CommonDataHelper.checkSeatCount($pnr)) {
			return {'errors': $errors};
		}
		$cmdRecord = this.makeStorePricingCmd($pnr, $aliasData, false);
		if ($errors = $cmdRecord['errors'] || []) {
			return {'errors': $errors};
		}
		$output = (await AmadeusUtil.fetchAllFx((...args) =>
			this.runCommand(...args), $cmdRecord['cmd'])).output;

		if (await this.needsRp($cmdRecord['cmd'], $output, $pnr)) {
			// delete TST we just created, and re-price it with 'P'-ublished mod
			await this.runCommand('TTE/ALL');
			$cmdRecord = this.makeStorePricingCmd($pnr, $aliasData, true);
			if (!php.empty($errors = $cmdRecord['errors'] || [])) {
				return {'errors': $errors};
			}

			$output = await this.runCommand($cmdRecord['cmd']);
		}
		$cmdRecord['output'] = $output;
		return {'calledCommands': [$cmdRecord]};
	}

	getEmptyAreasFromDbState() {
		let $isOccupied, $occupiedRows, $occupiedAreas;

		$isOccupied = ($row) => $row['has_pnr'];
		$occupiedRows = Fp.filter($isOccupied, this.stateful.getAreaRows());
		$occupiedAreas = php.array_column($occupiedRows, 'area');
		$occupiedAreas.push(this.getSessionData()['area']);
		return php.array_values(php.array_diff(this.constructor.AREA_LETTERS, $occupiedAreas));
	}

	changePcc($pcc) {
		let $calledCommands, $jdDump, $parsed, $isCurrentArea, $area, $stopwatch, $newSession, $sessionToken, $exc,
			$areaData;

		$calledCommands = [];

		if (this.stateful.getSessionData()['pcc'] === $pcc) {
			return {'errors': [Errors.getMessage(Errors.ALREADY_IN_THIS_PCC, {'pcc': $pcc})]};
		}

		// check that there is no PNR in session to match GDS behaviour
		$jdDump = this.runCommand('JD');
		$parsed = WorkAreaScreenParser.parse($jdDump);
		$isCurrentArea = ($area) => $area['isCurrentArea'];
		if (!($area = ArrayUtil.getFirst(Fp.filter($isCurrentArea, $parsed['records'] || [])))) {
			return {'errors': ['Failed to determine current area - ' + ($parsed['error'] || 'none of areas is active')]};
		}
		if ($area['hasPnr']) {
			return {'errors': [Errors.getMessage(Errors.LEAVE_PNR_CONTEXT, {'pcc': $pcc})]};
		}

		try {
			$newSession = this.stateful.startNewGdsSession({'pcc': $pcc});
			$sessionToken = $newSession.getSessionToken();
			// we need to call some command to trigger actual communication with Amadeus to check that PCC is ok
			$jdDump = $newSession.runSimpleCommand('JD');
			$parsed = WorkAreaScreenParser.parse($jdDump);
			if ($parsed['pcc'] !== $pcc) {
				$newSession.closeSession();
				return {'errors': ['Failed to change PCC - resulting PCC ' + $parsed['pcc'] + ' does not match requested PCC ' + $pcc]};
			}
		} catch ($exc) {
			return {'errors': ['Failed to start session with PCC ' + $pcc + ' - ' + this.constructor.formatGtlPccError($exc)]};
		}
		$areaData = SessionStateHelper.makeNewAreaData(this.getSessionData());
		this.stateful.getGdsSession().closeSession();
		$areaData['internal_token'] = $sessionToken;
		$areaData['pcc'] = $pcc;
		this.stateful.getLog().updateAreaState($areaData, {
			'type': 'changePcc',
			'duration': $stopwatch.stop()['timeDelta'],
		});

		return {
			'calledCommands': $calledCommands,
			'userMessages': ['Successfully changed PCC to ' + $pcc],
		};
	}

	async preprocessCommand($cmd) {
		let $lastCmdRec, $wasRtFormatPage, $pnr;

		if ($cmd === 'MD') {
			if ($lastCmdRec = await this.stateful.getLog().getLastCalledCommand()) {
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
			$pnr = await this.getCurrentPnr();
			$cmd = 'XE' + php.implode(',', php.array_column($pnr.getItinerary(), 'lineNumber'));
		}
		return $cmd;
	}

	async runCmd(cmd) {
		let cmdRec = await this.stateful.runCmd(cmd);
		if (this.constructor.countsAsFxd(cmd, cmdRec.output)) {
			this.stateful.handleFsUsage();
		}
		return cmdRec;
	}

	// public for closures
	async runCommand($cmd) {
		return (await this.runCmd($cmd)).output;
	}

	async amadeusRt($cmd) {
		return (await AmadeusUtil.fetchAllRt($cmd, this.stateful)).output;
	}

	async makeCmdMessages($cmd, $output) {
		let $userMessages, $type, $agent, $left, $fsLeftMsg;

		$userMessages = [];
		$type = CommandParser.parse($cmd)['type'];
		if (php.in_array($type, CommonDataHelper.getCountedFsCommands())) {
			$agent = this.getAgent();
			$left = $agent.getFsLimit() - await $agent.getFsCallsUsed();
			$fsLeftMsg = $left + ' FXD COMMANDS REMAINED';
			$userMessages.push($fsLeftMsg);
		}
		return $userMessages;
	}

	/** @return Promise<string> - the command we are currently scrolling
	 * (last command that was not one of MD, MU, MT, MB */
	async getScrolledCmd() {
		return this.stateful.getSessionData().scrolledCmd;
	}

	modifyOutput($calledCommand) {
		let $scrolledCmd, $type, $lines, $isSafe;

		$scrolledCmd = this.getScrolledCmd() || $calledCommand['cmd'];
		$type = (CommandParser.parse($scrolledCmd) || {})['type'];
		if (php.in_array($type, ['searchPnr', 'displayPnrFromList']) &&
			!this.stateful.getAgent().canOpenPrivatePnr()
		) {
			$lines = StringUtil.lines($calledCommand['output']);
			$isSafe = ($line) => !StringUtil.contains($line, 'WEINSTEIN/ALEX');
			$calledCommand['output'] = php.implode(php.PHP_EOL, Fp.filter($isSafe, $lines));
		}
		return $calledCommand;
	}

	async getCurrentPnr() {
		let $reservationDump;

		$reservationDump = (new CmsAmadeusTerminal()).getFullPnrDump(this.stateful.getLog()) || await this.amadeusRt('RT');
		return AmadeusPnr.makeFromDump($reservationDump);
	}

	async areAllCouponsVoided() {
		let $faRecs, $faRec, $twdOutput, $twdParsed, $isFlight, $isVoid, $coupons;

		$faRecs = (((await this.getCurrentPnr()).getParsedData() || {})['parsed'] || {})['tickets'] || [];
		for ($faRec of Object.values($faRecs)) {
			$twdOutput = this.runCommand('TWD\/L' + $faRec['lineNumber']);
			$twdParsed = TicketMaskParser.parse($twdOutput);
			$isFlight = ($seg) => {
				return $seg['type'] !== 'void';
			};
			$isVoid = ($seg) => {
				return StringUtil.startsWith($seg['couponStatus'], 'V');
			};
			$coupons = Fp.filter($isFlight, $twdParsed['segments']);
			if (!php.empty($twdParsed['error']) ||
				!Fp.all($isVoid, $coupons)
			) {
				return false;
			}
		}
		return true;
	}

	async isGdRemarkLine($lineNum) {
		let $remark;

		for ($remark of Object.values((await this.getCurrentPnr()).getRemarks())) {
			if ($remark['lineNumber'] == $lineNum) {
				return $remark['remarkType'] === GenericRemarkParser.CMS_LEAD_REMARK;
			}
		}
		return false;
	}

	async checkIsForbidden($cmd) {
		let $errors, $parsedCmd, $flatCmds, $type, $agent, $isQueueCmd, $totalAllowed, $pnr, $canChange, $flatCmd,
			$numRec;

		$errors = [];
		$parsedCmd = CommandParser.parse($cmd);
		$flatCmds = php.array_merge([$parsedCmd], $parsedCmd['followingCommands'] || []);
		$type = $parsedCmd['type'];
		$agent = this.getAgent();
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
			if (this.stateful.getSessionData()['is_pnr_stored'] &&
				!$agent.canEditTicketedPnr()
			) {
				$pnr = await this.getCurrentPnr();
				$canChange = !$pnr.hasEtickets()
					|| $agent.canEditVoidTicketedPnr()
					&& await this.areAllCouponsVoided();
				if (!$canChange) {
					$errors.push(Errors.getMessage(Errors.CANT_CHANGE_TICKETED_PNR));
				}
			}
		}
		if (this.constructor.doesStorePnr($cmd)) {
			if (php.empty(this.stateful.getLeadData()['leadId'])) {
				if (!$agent.canSavePnrWithoutLead()) {
					$errors.push(Errors.getMessage(Errors.LEAD_ID_IS_REQUIRED));
				}
			}
		}
		if (this.getSessionData()['is_pnr_stored']) {
			for ($flatCmd of Object.values($flatCmds)) {
				if ($flatCmd['type'] === 'changePnrField') {
					if (await this.isGdRemarkLine($flatCmd['data']['majorNum'])) {
						$errors.push(Errors.getMessage(Errors.CANT_CHANGE_GDSD_REMARK, {'lineNum': $flatCmd['data']['majorNum']}));
					}
				} else if ($flatCmd['type'] === 'deletePnrField') {
					for ($numRec of Object.values(($flatCmd['data'] || {})['lineNumbers'] || [])) {
						if (await this.isGdRemarkLine($numRec['major'])) {
							$errors.push(Errors.getMessage(Errors.CANT_CHANGE_GDSD_REMARK, {'lineNum': $numRec['major']}));
						}
					}
				}
			}
		}
		return $errors;
	}

	async callImplicitCommandsBefore($cmd) {
		let $calledCommands;

		$calledCommands = [];
		if (this.constructor.doesStorePnr($cmd)) {
			if ($cmd = await this.makeCreatedForCmdIfNeeded()) {
				await this.runCommand($cmd);
			}
			if ($cmd = await this.makeTopRemarkCmdIfNeeded()) {
				await this.runCommand($cmd);
			}
		}
		return $calledCommands;
	}

	async callImplicitCommandsAfter($cmdRecord, $calledCommands, $userMessages) {
		let $recordLocator, $parsed, $isAlex;

		$calledCommands.push(await this.modifyOutput($cmdRecord));
		if (this.constructor.doesStorePnr($cmdRecord['cmd'])) {
			$recordLocator = ((new CmsAmadeusTerminal()).parseSavePnr($cmdRecord['output'], true) || {})['recordLocator']
							|| (new CmsAmadeusTerminal()).parseSavePnr($cmdRecord['output'], false)['recordLocator'];
			if ($recordLocator) {
				this.handlePnrSave($recordLocator);
			}
		} else if (this.constructor.doesOpenPnr($cmdRecord['cmd'])) {
			$parsed = AmadeusReservationParser.parse($cmdRecord['output']);
			$isAlex = ($pax) => {
				return $pax['lastName'] === 'WEINSTEIN'
					&& $pax['firstName'] === 'ALEX';
			};
			if (Fp.any($isAlex, ($parsed['parsed'] || {})['passengers'] || []) &&
				!this.stateful.getAgent().canOpenPrivatePnr()
			) {
				await this.runCommand('IG');
				return {'errors': ['Restricted PNR']};
			}
		}
		return {'calledCommands': $calledCommands, 'userMessages': $userMessages};
	}

	async processRealCommand($cmd) {
		let $errors, $calledCommands, $output, $userMessages;

		$cmd = await this.preprocessCommand($cmd);
		if (!php.empty($errors = await this.checkIsForbidden($cmd))) {
			return {'errors': $errors};
		}
		$calledCommands = [];
		$calledCommands = php.array_merge($calledCommands, await this.callImplicitCommandsBefore($cmd));
		let cmdRec = await this.runCmd($cmd);
		$userMessages = await this.makeCmdMessages($cmd, $output);
		return this.callImplicitCommandsAfter(cmdRec, $calledCommands, $userMessages);
	}

	async priceInAnotherPcc($cmd, $target, $dialect) {
		let $pnr;

		$pnr = await this.getCurrentPnr();
		return (new RepriceInAnotherPccAction())
			.setLog(this.$log)
			.execute($pnr, $cmd, $dialect, $target, this.stateful);
	}

	processRequestedCommand($cmd) {
		let $matches, $area, $pcc, $mdaData, $limit, $cmdReal, $reData, $aliasData, $params, $itinerary, $result;

		if (php.preg_match(/^JM *([A-Z])$/, $cmd, $matches = [])) {
			$area = $matches[1];
			return this.changeArea($area);
		} else if (php.preg_match(/^JUM\/O- *([A-Z0-9]+)$/, $cmd, $matches = [])) {
			$pcc = $matches[1];
			return this.changePcc($pcc);
		} else if (php.preg_match(/^JD$/, $cmd, $matches = [])) {
			return {'calledCommands': [this.imitateGetAreasCmd()]};
		} else if ($mdaData = AliasParser.parseMda($cmd)) {
			$limit = $mdaData['limit'] || null;
			if ($cmdReal = $mdaData['realCmd']) {
				return this.runAndMoveDownAll($cmdReal, $limit || null);
			} else {
				return this.moveDownAll($limit);
			}
		} else if (php.preg_match(/^PNR$/, $cmd, $matches = [])) {
			return this.processSavePnr();
		} else if (php.preg_match(/^SORT$/, $cmd, $matches = [])) {
			return this.processSortItinerary();
		} else if ($reData = AliasParser.parseRe($cmd)) {
			return this.processCloneItinerary($reData);
		} else if ($aliasData = AliasParser.parseStore($cmd)) {
			return this.storePricing($aliasData);
		} else if ($params = this.constructor.parseSeatIncreasePseudoCmd($cmd)) {
			return this.processSeatIncrease($params);
		} else if ($cmd === '/SS') {
			return this.rebookAsSs();
		} else if (php.preg_match(/^(FQD.*)\/MIX$/, $cmd, $matches = [])) {
			return this.getMultiPccTariffDisplay($matches[1]);
		} else if (!php.empty($itinerary = AliasParser.parseCmdAsItinerary($cmd, this.stateful))) {
			return this.bookItinerary($itinerary);
		} else if ($result = RepriceInAnotherPccAction.parseAlias($cmd)) {
			return this.priceInAnotherPcc($result['cmd'], $result['target'], $result['dialect']);
		} else {
			return this.processRealCommand($cmd);
		}
	}

	imitateGetAreasCmd() {
		let $sessionData, $areasFromDb;

		$sessionData = this.getSessionData();
		$areasFromDb = this.stateful.getAreaRows();

		return {
			'cmd': 'JD',
			'output': this.constructor.forgeViewAreasDump($sessionData, $areasFromDb),
		};
	}

	static forgeViewAreasDump($sessionData, $areasFromDb) {
		let $areas, $area, $lines, $letter, $status, $data;

		$areas = [];
		for ($area of Object.values($areasFromDb)) {
			$areas[$area['work_area_letter']] = $area;
		}
		$lines = [
			'00000000         ' + $sessionData['pcc'],
			'',
			'AREA  TM  MOD SG/DT.LG TIME      ACT.Q   STATUS     NAME',
		];
		for ($letter of Object.values(this.AREA_LETTERS)) {
			if (php.isset($areas[$letter])) {
				if ($areas[$letter]['is_pnr_stored']) {
					$status = 'PNR MODIFY';
				} else if ($areas[$letter]['has_pnr']) {
					$status = 'PNR CREATE';
				} else {
					$status = 'SIGNED';
				}
				$data = {
					'letter': $letter,
					'signed': ($letter == $sessionData['area']) ? '-IN' : '   ',
					'status': $status,
				};
				$lines.push(StringUtil.format('{letter}{signed}      PRD WS\/SU.EN  24             {status}', $data));
			} else {
				$lines.push($letter + '                                      NOT SIGNED');
			}
		}
		return php.implode(php.PHP_EOL, $lines);
	}

	async execute($cmdRequested) {
		let $callResult, $errors, $status, $calledCommands, $userMessages;

		$callResult = await this.processRequestedCommand($cmdRequested);

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
	}
}

ProcessAmadeusTerminalInputAction.PASSIVE_STATUSES = ['GK', 'PE'];
// defines how much areas can agent open in single session
ProcessAmadeusTerminalInputAction.AREA_LETTERS = ['A', 'B', 'C', 'D'];
module.exports = ProcessAmadeusTerminalInputAction;
