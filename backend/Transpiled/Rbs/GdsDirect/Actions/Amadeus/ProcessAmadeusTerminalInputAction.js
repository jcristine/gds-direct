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
const PtcUtil = require('../../../../Rbs/Process/Common/PtcUtil.js');
const CommandParser = require('../../../../Gds/Parsers/Amadeus/CommandParser.js');
const CmsAmadeusTerminal = require('../../../../Rbs/GdsDirect/GdsInterface/CmsAmadeusTerminal.js');
const AmadeusUtil = require("../../../../../GdsHelpers/AmadeusUtils");
const GdsProfiles = require("../../../../../Repositories/GdsProfiles");
const getRbsPqInfo = require("../../../../../GdsHelpers/RbsUtils").getRbsPqInfo;
const MoveDownAllAction = require('./MoveDownAllAction.js');
const AmadeusPnr = require('../../../../Rbs/TravelDs/AmadeusPnr.js');
const AmadeusBuildItineraryAction = require('../../../../Rbs/GdsAction/AmadeusBuildItineraryAction.js');
const MarriageItineraryParser = require('../../../../Gds/Parsers/Amadeus/MarriageItineraryParser.js');
const AmadeusClient = require("../../../../../GdsClients/AmadeusClient");
const makeDefaultAreaState = require("../../../../../Repositories/GdsSessions").makeDefaultAreaState;
const WorkAreaScreenParser = require("../../../../Gds/Parsers/Amadeus/WorkAreaScreenParser");
const UnprocessableEntity = require("../../../../../Utils/Rej").UnprocessableEntity;
const Rej = require("../../../../../Utils/Rej");
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

	static formatGtlPccError($exc, pcc) {
		let prefix = 'Failed to start session with PCC ' + pcc + ' - ';
		if (php.preg_match(/\bSoapFault: *11|\Session\b/, ($exc.message || ''))) {
			return Rej.BadRequest('Invalid PCC');
		} else {
			return UnprocessableEntity(prefix + 'Unexpected GTL error - ' + php.preg_replace(/\s+/, ' ', php.substr($exc.message || '', -100)));
		}
	}

	static isSaveConfirmationRequired($output) {
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
	}

	async makeCreatedForCmdIfNeeded() {
		let $cmdLog, $sessionData, $remarkCmd, $flattenCmd, $performedCmds, $flatPerformedCmds;

		$cmdLog = this.stateful.getLog();
		$sessionData = $cmdLog.getSessionData();
		if (!$sessionData['isPnrStored']) {
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
		if (!$sessionData['isPnrStored']) {
			$performedCmds = php.array_column(await $cmdLog.getCurrentPnrCommands(), 'cmd');
			$msg = 'CREATED IN GDS DIRECT BY ' + php.strtoupper(this.getAgent().getLogin());
			$cmd = 'UHP/' + $msg;
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
			$result['userMessages'] = php.array_merge(
				$result['userMessages'] || [],
				$moved['userMessages'] || []
			);
			$result['errors'] = $moved['errors'] || [];
		}
		return $result;
	}

	async processSavePnr() {
		let $calledCommands, $pnr, $errors, $login, $cmd, $writeCommands, $output, $parsedStoredPnr, $rloc;

		$calledCommands = [];

		if (php.empty(this.stateful.getLeadId())) {
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

	async startNewAreaSession(area, pcc = null) {
		let $row = makeDefaultAreaState('amadeus');
		pcc = pcc || $row.pcc;
		$row.area = area;
		$row.pcc = pcc;
		$row.gdsData = await AmadeusClient.startSession({
			profileName: GdsProfiles.chooseAmaProfile($row.pcc),
			pcc: pcc,
		});
		return $row;
	}

	async updateGdsData(newAreaState) {
		let fullState = this.stateful.getFullState();
		fullState.areas[newAreaState.area] = newAreaState;
		fullState.area = newAreaState.area;
		let updated = await Promise.all([
			this.stateful.updateFullState(fullState),
			this.stateful.updateGdsData(newAreaState.gdsData),
		]);
		return updated;
	}

	async changeArea($area) {
		let $errorData, $areaRows, $isRequested, $row;

		if (!php.in_array($area, this.constructor.AREA_LETTERS)) {
			$errorData = {'area': $area, 'options': php.implode(', ', this.constructor.AREA_LETTERS)};
			return {'errors': [Errors.getMessage(Errors.INVALID_AREA_LETTER, $errorData)]};
		}
		if (this.stateful.getSessionData()['area'] === $area) {
			return {'errors': [Errors.getMessage(Errors.ALREADY_IN_THIS_AREA, {'area': $area})]};
		}
		$areaRows = this.stateful.getAreaRows();
		$isRequested = ($row) => $row['area'] === $area;
		$row = ArrayUtil.getFirst(Fp.filter($isRequested, $areaRows));

		let fullState = this.stateful.getFullState();
		if (!fullState.areas[fullState.area].gdsData) {
			// preserve area A session token
			fullState.areas[fullState.area].gdsData = this.stateful.getGdsData();
			this.stateful.updateFullState(fullState);
		}
		if (!$row || !$row.gdsData) {
			$row = await this.startNewAreaSession($area);
		}
		await this.updateGdsData($row);

		return {
			'calledCommands': [],
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
			$matchedSegments[$i]['seatCount'] = $params['seatAmount'];
			$matchedSegments[$i]['segmentStatus'] = $params['segmentStatus'];
		}
		return this.bookItinerary($matchedSegments, false);
	}

	async processCloneItinerary($aliasData) {
		let $pcc, $segmentStatus, $seatNumber, $pnrDump, $itinerary, $emptyAreas, $area, $result, $key, $segment;

		$pcc = $aliasData['pcc'];
		$segmentStatus = $aliasData['segmentStatus'] || 'GK';
		$seatNumber = $aliasData['seatCount'] || 0;

		$pnrDump = (await AmadeusUtil.fetchAllRt('RTAM', this.stateful)).output;

		if (php.empty($itinerary = MarriageItineraryParser.parse($pnrDump))) {
			return {'errors': [Errors.getMessage(Errors.ITINERARY_IS_EMPTY)]};
		}
		if (php.empty($emptyAreas = this.getEmptyAreasFromDbState())) {
			return {'errors': [Errors.getMessage(Errors.NO_FREE_AREAS)]};
		}
		if (!this.getSessionData()['isPnrStored'] && !$aliasData['keepOriginal'] && $segmentStatus !== 'GK') {
			await this.runCommand('IG'); // ignore the itinerary it initial area
		}
		$area = $emptyAreas[0];
		$result = await this.changeArea($area);
		if (!php.empty($result['errors'])) {
			return $result;
		}
		if (this.getSessionData()['pcc'] !== $pcc) {
			$result = await this.changePcc($pcc);
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

		return this.bookItinerary($itinerary, true);
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
	async bookItinerary($itinerary, isNewPnr) {
		let $errors, $i, $segment, $bookItinerary, $result, $error,
			$segmentNumbers, $calledCommands;

		$errors = [];
		this.stateful.flushCalledCommands();

		if (isNewPnr) {
			for ([$i, $segment] of Object.entries($itinerary)) {
				// in most cases there are no paxes in destination PNR, so first segment number will be 1
				$segment['lineNumber'] = +$i + 1; // $segment['lineNumber'] || $i + 1;
			}
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
			let $isActive = ($seg) => !php.in_array($seg['segmentStatus'], this.constructor.PASSIVE_STATUSES);
			let $activeSegments = Fp.filter($isActive, $itinerary);
			let $marriageGroups = Fp.groupMap(($seg) => $seg['marriage'], $activeSegments);

			for (let [$marriage, $group] of $marriageGroups) {
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
		$result = await (new AmadeusBuildItineraryAction())
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
			$output = (await AmadeusUtil.fetchAllFx('FQQ1', this)).output;
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
			$paxStores.push(php.implode('/', $paxMods));
		}
		return {'cmd': 'FXP/' + php.implode('//', $paxStores)};
	}

	async storePricing($aliasData) {
		let $pnr, $errors, $cmdRecord, $output;

		$pnr = await this.getCurrentPnr();
		if (!php.empty($errors = CommonDataHelper.checkSeatCount($pnr))) {
			return {'errors': $errors};
		}
		$cmdRecord = this.makeStorePricingCmd($pnr, $aliasData, false);
		if (!php.empty($errors = $cmdRecord['errors'] || [])) {
			return {'errors': $errors};
		}
		$output = (await AmadeusUtil.fetchAllFx($cmdRecord['cmd'], this)).output;

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

		$isOccupied = ($row) => $row['hasPnr'];
		$occupiedRows = Fp.filter($isOccupied, this.stateful.getAreaRows());
		$occupiedAreas = php.array_column($occupiedRows, 'area');
		$occupiedAreas.push(this.getSessionData()['area']);
		return php.array_values(php.array_diff(this.constructor.AREA_LETTERS, $occupiedAreas));
	}

	async changePcc($pcc) {
		let $calledCommands, $jdDump, $parsed;

		$calledCommands = [];

		if (this.stateful.getSessionData()['pcc'] === $pcc) {
			return {'errors': [Errors.getMessage(Errors.ALREADY_IN_THIS_PCC, {'pcc': $pcc})]};
		}

		// check that there is no PNR in session to match GDS behaviour
		if (this.stateful.getSessionData().hasPnr) {
			return {'errors': [Errors.getMessage(Errors.LEAVE_PNR_CONTEXT, {'pcc': $pcc})]};
		}

		let areaState = await this.startNewAreaSession(this.stateful.getSessionData().area, $pcc)
			.catch(exc => this.constructor.formatGtlPccError(exc, $pcc));

		// sometimes when you request invalid PCC, Amadeus fallbacks to
		// SFO1S2195 - should call >JD; and check that PCC is what we requested
		let jdCmdRec = await AmadeusClient.runCmd({command: 'JD'}, areaState.gdsData);
		$jdDump = jdCmdRec.output;
		$parsed = WorkAreaScreenParser.parse($jdDump);
		if ($parsed['pcc'] !== $pcc) {
			AmadeusClient.closeSession(areaState.gdsData);
			return {
				'calledCommands': [{cmd: 'JD', output: $jdDump}],
				'errors': ['Failed to change PCC - resulting PCC ' + $parsed['pcc'] + ' does not match requested PCC ' + $pcc],
			};
		}

		let oldGdsData = this.stateful.getGdsData();
		await this.updateGdsData(areaState);
		AmadeusClient.closeSession(oldGdsData);

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

	/** @return string - the command we are currently scrolling
	 * (last command that was not one of MD, MU, MT, MB */
	getScrolledCmd() {
		return this.stateful.getSessionData().scrolledCmd;
	}

	modifyOutput($calledCommand) {
		let $scrolledCmd, $type, $lines, $isSafe;
		$calledCommand = {...$calledCommand};

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

		$reservationDump = await (new CmsAmadeusTerminal())
			.getFullPnrDump(this.stateful.getLog()) || await this.amadeusRt('RT');
		return AmadeusPnr.makeFromDump($reservationDump);
	}

	async areAllCouponsVoided() {
		let $faRecs, $faRec, $twdOutput, $twdParsed, $isFlight, $isVoid, $coupons;

		$faRecs = (((await this.getCurrentPnr()).getParsedData() || {})['parsed'] || {})['tickets'] || [];
		for ($faRec of Object.values($faRecs)) {
			$twdOutput = await this.runCommand('TWD/L' + $faRec['lineNumber']);
			$twdParsed = TicketMaskParser.parse($twdOutput);
			$isFlight = ($seg) => $seg['type'] !== 'void';
			$isVoid = ($seg) => StringUtil.startsWith($seg['couponStatus'], 'V');
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
			if (this.stateful.getSessionData()['isPnrStored'] &&
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
			if (php.empty(this.stateful.getLeadId())) {
				if (!$agent.canSavePnrWithoutLead()) {
					$errors.push(Errors.getMessage(Errors.LEAD_ID_IS_REQUIRED));
				}
			}
		}
		if (this.getSessionData()['isPnrStored']) {
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

	async processRequestedCommand($cmd) {
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
		} else if (!php.empty($itinerary = await AliasParser.parseCmdAsItinerary($cmd, this.stateful))) {
			return this.bookItinerary($itinerary, true);
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
			$areas[$area['area']] = $area;
		}
		$lines = [
			'00000000         ' + $sessionData['pcc'],
			'',
			'AREA  TM  MOD SG/DT.LG TIME      ACT.Q   STATUS     NAME',
		];
		for ($letter of Object.values(this.AREA_LETTERS)) {
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
