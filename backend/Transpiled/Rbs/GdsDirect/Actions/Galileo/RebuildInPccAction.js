// namespace Rbs\GdsDirect\Actions\Galileo;

const Fp = require('../../../../Lib/Utils/Fp.js');
const AbstractGdsAction = require('../../../../Rbs/GdsAction/AbstractGdsAction.js');
const GalileoBuildItineraryAction = require('../../../../Rbs/GdsAction/GalileoBuildItineraryAction.js');
const Errors = require('../../../../Rbs/GdsDirect/Errors.js');
const UpdateGalileoSessionStateAction = require('../../../../Rbs/GdsDirect/SessionStateProcessor/UpdateGalileoStateAction.js');
const {fetchAll} = require('../../../../../GdsHelpers/TravelportUtils.js');

/**
 * emulate into specified PCC in specified area and rebuild the itinerary
 * fallbacks to passive (AK) segments if there is no availability
 */
const php = require('../../../../php.js');

class RebuildInPccAction extends AbstractGdsAction {
	constructor() {
		super();
		this.$fallbackToAk = false;
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
	async rebookGkSegments($segments) {
		let $marriageToSegs = Fp.groupMap(($seg) => $seg['marriage'], $segments);
		let $failedSegNums = [];
		for (let [$marriage, $marriedSegs] of $marriageToSegs) {
			let $clsToSegs = Fp.groupBy(($seg) => $seg['bookingClass'], $marriedSegs);
			for (let [$cls, $clsSegs] of Object.entries($clsToSegs)) {
				let $cmd = '@' + php.implode('.', php.array_column($clsSegs, 'segmentNumber')) + '/' + $cls;
				let $output = (await this.runCmd($cmd)).output;
				if (!this.constructor.isSuccessRebookOutput($output)) {
					$failedSegNums.push(php.array_column($clsSegs, 'segmentNumber'));
				}
			}
		}
		return {'failedSegmentNumbers': $failedSegNums};
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
		let $errors, $isAkRebookPossible, $akItinerary, $result, $error, $gkRebook, $failedSegNums;
		$itinerary = $itinerary.map((s,i) => ({
			segmentNumber: i + 1,
			...s,
			segmentStatus: s.segmentStatus === 'GK' ? 'AK' : s.segmentStatus,
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

		$result = await (new GalileoBuildItineraryAction())
			.setSession(this.session).execute($akItinerary, true);

		$itinerary = Fp.filter($isAkRebookPossible, $itinerary);
		if ($error = this.constructor.transformBuildError($result)) {
			$errors.push($error);
		} else {
			$gkRebook = await this.rebookGkSegments($itinerary);
			if (!php.empty($failedSegNums = $gkRebook['failedSegmentNumbers'])) {
				$errors.push(Errors.getMessage(Errors.REBUILD_FALLBACK_TO_GK, {'segNums': php.implode(',', $failedSegNums)}));
			}
			await this.runCmd('*R');
		}
		return {'errors': $errors};
	}

	/** @param $itinerary = GalileoPnr::getItinerary() */
	async execute($area, $pcc, $itinerary) {
		let $output, $error;

		$output = (await fetchAll('S' + $area, this)).output;
		if (!UpdateGalileoSessionStateAction.isSuccessChangeAreaOutput($output)) {
			$error = Errors.getMessage(Errors.FAILED_TO_CHANGE_AREA, {
				'area': $area, 'response': php.trim($output),
			});
			return {'errors': [$error]};
		}
		$output = (await fetchAll('SEM/' + $pcc + '/AG', this)).output;
		if (!UpdateGalileoSessionStateAction.wasPccChangedOk($output)) {
			$error = Errors.getMessage(Errors.PCC_GDS_ERROR, {
				'pcc': $pcc, 'response': php.trim($output),
			});
			return {'errors': [$error]};
		}
		return this.bookItinerary($itinerary);
	}
}

module.exports = RebuildInPccAction;
