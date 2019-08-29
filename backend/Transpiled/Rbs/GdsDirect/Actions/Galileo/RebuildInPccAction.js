const Rej = require('klesun-node-tools/src/Rej.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const AbstractGdsAction = require('../../../../Rbs/GdsAction/AbstractGdsAction.js');
const GalileoBuildItineraryAction = require('../../../../Rbs/GdsAction/GalileoBuildItineraryAction.js');
const Errors = require('../../../../Rbs/GdsDirect/Errors.js');
const UpdateGalileoSessionStateAction = require('../../SessionStateProcessor/UpdateGalileoState.js');
const {fetchAll} = require('../../../../../GdsHelpers/TravelportUtils.js');
const {findSegmentNumberInPnr} = require('../Common/ItinerarySegments');

/**
 * emulate into specified PCC in specified area and rebuild the itinerary
 * fallbacks to passive (AK) segments if there is no availability
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');

class RebuildInPccAction extends AbstractGdsAction {
	constructor({
		travelport,
		useXml,
		baseDate,
	}) {
		super();
		this.$fallbackToAk = false;
		this.travelport = travelport;
		this.useXml = useXml;
		this.baseDate = baseDate;
	}

	fallbackToAk($flag) {
		this.$fallbackToAk = $flag;
		return this;
	}

	// 'UNABLE - DUPLICATE SEGMENT'
	//
	// '*UNABLE - CLASS DOES NOT EXIST FOR THIS FLIGHT*'
	//
	// ' 1. PS  898 S  10MAY KIVKBP HS1   720A   825A O                 '
	// '*BOARDING PASS AT CHECKIN IS CHARGEABLE*'
	// '*FULL PASSPORT DATA IS MANDATORY*'
	// ' 2. BT 7405 S  10MAY KBPRIX HS1   920A  1055A O                 '
	// 'OPERATED BY UKRAINE INTERNATIONAL AI                            '
	// 'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS  '
	// 'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION'
	// 'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES'
	// 'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES'
	static isSuccessRebookOutput($dump) {
		return UpdateGalileoSessionStateAction.isSuccessSellOutput($dump);
	}

	/** replace GK segments with $segments */
	async rebookGkSegments(segments, reservation) {
		const marriageToSegs = Fp.groupMap(seg => seg['marriage'], segments);
		const failedSegNums = [];
		for (const [, marriedSegs] of marriageToSegs) {
			const clsToSegs = Fp.groupBy(seg => seg['bookingClass'], marriedSegs);
			for (const [cls, clsSegs] of Object.entries(clsToSegs)) {
				const segmentNumbers = clsSegs.map(seg =>
					findSegmentNumberInPnr(seg, reservation && reservation.itinerary));

				const $cmd = '@' + segmentNumbers.join('.') + '/' + cls;

				const $output = (await this.runCmd($cmd)).output;
				if (!this.constructor.isSuccessRebookOutput($output)) {
					failedSegNums.push(php.array_column(clsSegs, 'segmentNumber'));
				}
			}
		}
		return {failedSegmentNumbers: failedSegNums};
	}

	static transformBuildError($result) {
		let $cmsMessageType;

		if (!$result['success']) {
			$cmsMessageType = ({
				[GalileoBuildItineraryAction.ERROR_GDS_ERROR]: Errors.REBUILD_GDS_ERROR,
				[GalileoBuildItineraryAction.ERROR_NO_AVAIL]: Errors.REBUILD_NO_AVAIL,
			} || {})[$result['errorType']] || $result['errorType'];
			return Errors.getMessage($cmsMessageType, $result['errorData']);
		} else {
			return null;
		}
	}

	async bookItinerary($itinerary) {
		// TODO: reuse BookViaGk.js instead
		let $errors, $isAkRebookPossible, $akItinerary, $result, $error, $gkRebook, $failedSegNums;
		$itinerary = $itinerary.map((s,i) => ({
			segmentNumber: i + 1,
			...s,
			segmentStatus: {
				GK: 'AK',
				HK: 'NN',
				SS: 'NN',
			}[s.segmentStatus] || s.segmentStatus,
		}));

		$errors = [];
		// Galileo returns UNABLE - DUPLICATE SEGMENT if you try to rebook AK Y to HS Y
		// so as in Apollo skipping AK fallback for Y segments. They are rare so it's ok.
		$isAkRebookPossible = ($seg) => {
			return this.$fallbackToAk
				&& $seg['bookingClass'] !== 'Y'
				&& $seg['segmentStatus'] !== 'AK';
		};
		$akItinerary = Fp.map(($seg) => {
			$seg = {...$seg};
			if ($isAkRebookPossible($seg)) {
				$seg['bookingClass'] = 'Y';
				$seg['segmentStatus'] = 'AK';
			}
			return $seg;
		}, $itinerary);

		$result = await GalileoBuildItineraryAction({
			session: this.session,
			itinerary: $akItinerary,
			isParserFormat: true,
			useXml: this.useXml,
			travelport: this.travelport,
			baseDate: this.baseDate,
		});

		if (this.useXml && $result.segments.length > 0) {
			this.session.updateAreaState({
				type: '!xml:PNRBFManagement',
				state: {hasPnr: true, canCreatePq: false},
			});
		}

		$itinerary = Fp.filter($isAkRebookPossible, $itinerary);
		if ($error = this.constructor.transformBuildError($result)) {
			$errors.push($error);
		} else {
			$gkRebook = await this.rebookGkSegments($itinerary, $result.reservation);
			if (!php.empty($failedSegNums = $gkRebook['failedSegmentNumbers'])) {
				$errors.push(Errors.getMessage(Errors.REBUILD_FALLBACK_TO_GK, {segNums: php.implode(',', $failedSegNums)}));
			}
			await this.runCmd('*R');
		}
		return {errors: $errors};
	}

	/** @param $itinerary = GalileoPnr::getItinerary() */
	async execute($area, $pcc, $itinerary) {
		let $output, $error;

		$output = (await fetchAll('S' + $area, this)).output;
		if (!UpdateGalileoSessionStateAction.isSuccessChangeAreaOutput($output)) {
			$error = Errors.getMessage(Errors.FAILED_TO_CHANGE_AREA, {
				area: $area, response: php.trim($output),
			});
			return {errors: [$error]};
		}
		$output = (await fetchAll('SEM/' + $pcc + '/AG', this)).output;
		if (!UpdateGalileoSessionStateAction.wasPccChangedOk($output)) {
			$error = Errors.getMessage(Errors.PCC_GDS_ERROR, {
				pcc: $pcc, response: php.trim($output),
			});
			return {errors: [$error]};
		}
		return this.bookItinerary($itinerary);
	}
}

module.exports = RebuildInPccAction;
