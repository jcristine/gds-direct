const GoToArea = require('./GoToArea.js');
const Fp = require('../Transpiled/Lib/Utils/Fp.js');
const GalileoBuildItineraryAction = require('../Transpiled/Rbs/GdsAction/GalileoBuildItineraryAction.js');
const Errors = require('../Transpiled/Rbs/GdsDirect/Errors.js');
const UpdateGalileoSessionStateAction = require('../Transpiled/Rbs/GdsDirect/SessionStateProcessor/UpdateGalileoState.js');
const {fetchAll} = require('../GdsHelpers/TravelportUtils.js');
const {findSegmentNumberInPnr} = require('../Transpiled/Rbs/GdsDirect/Actions/Common/ItinerarySegments');

/**
 * emulate into specified PCC in specified area and rebuild the itinerary
 * fallbacks to passive (AK) segments if there is no availability
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');


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
const isSuccessRebookOutput = (dump) => {
	return UpdateGalileoSessionStateAction.isSuccessSellOutput(dump);
};

const transformBuildError = (result) => {
	let cmsMessageType;

	if (!result.success) {
		cmsMessageType = ({
			[GalileoBuildItineraryAction.ERROR_GDS_ERROR]: Errors.REBUILD_GDS_ERROR,
			[GalileoBuildItineraryAction.ERROR_NO_AVAIL]: Errors.REBUILD_NO_AVAIL,
		} || {})[result.errorType] || result.errorType;
		return Errors.getMessage(cmsMessageType, result.errorData);
	} else {
		return null;
	}
};

/** @param itinerary = (new (require('GalileoPnr.js'))).getItinerary() */
const RebuildInPcc_galileo = ({
	travelport, useXml, stateful,
	fallbackToAk, area, pcc, itinerary,
}) => {
	const baseDate = stateful.getStartDt();

	/** replace GK segments with segments */
	const rebookGkSegments = async (segments, reservation) => {
		const marriageToSegs = Fp.groupMap(seg => seg.marriage, segments);
		const failedSegNums = [];
		for (const [, marriedSegs] of marriageToSegs) {
			const clsToSegs = Fp.groupBy(seg => seg.bookingClass, marriedSegs);
			for (const [cls, clsSegs] of Object.entries(clsToSegs)) {
				const segmentNumbers = clsSegs.map(seg =>
					findSegmentNumberInPnr(seg, reservation && reservation.itinerary));

				const cmd = '@' + segmentNumbers.join('.') + '/' + cls;

				const output = (await stateful.runCmd(cmd)).output;
				if (!isSuccessRebookOutput(output)) {
					failedSegNums.push(php.array_column(clsSegs, 'segmentNumber'));
				}
			}
		}
		return {failedSegmentNumbers: failedSegNums};
	};

	const bookItinerary = async (itinerary) => {
		// TODO: reuse BookViaGk.js instead
		itinerary = itinerary.map((s,i) => ({
			segmentNumber: i + 1,
			...s,
			segmentStatus: {
				GK: 'AK',
				HK: 'NN',
				HS: 'NN',
				SS: 'NN',
			}[s.segmentStatus] || s.segmentStatus,
		}));

		const errors = [];
		// Galileo returns UNABLE - DUPLICATE SEGMENT if you try to rebook AK Y to HS Y
		// so as in Apollo skipping AK fallback for Y segments. They are rare so it's ok.
		const isAkRebookPossible = (seg) => {
			return fallbackToAk
				&& seg.bookingClass !== 'Y'
				&& seg.segmentStatus !== 'AK';
		};
		const akItinerary = Fp.map((seg) => {
			seg = {...seg};
			if (isAkRebookPossible(seg)) {
				seg.bookingClass = 'Y';
				seg.segmentStatus = 'AK';
			}
			return seg;
		}, itinerary);

		const result = await GalileoBuildItineraryAction({
			session: stateful,
			itinerary: akItinerary,
			isParserFormat: true,
			useXml, travelport, baseDate,
		});

		if (useXml && result.segments.length > 0) {
			stateful.updateAreaState({
				type: '!xml:PNRBFManagement',
				state: {hasPnr: true, canCreatePq: false},
			});
		}

		itinerary = itinerary.filter(isAkRebookPossible);
		const error = transformBuildError(result);
		if (error) {
			errors.push(error);
		} else {
			const gkRebook = await rebookGkSegments(itinerary, result.reservation);
			const failedSegNums = gkRebook.failedSegmentNumbers;
			if (!php.empty(failedSegNums)) {
				errors.push(Errors.getMessage(Errors.REBUILD_FALLBACK_TO_GK, {segNums: php.implode(',', failedSegNums)}));
			}
			await stateful.runCmd('*R');
		}
		return {errors};
	};

	const execute = async () => {
		await GoToArea.inGalileo({stateful, area});
		const output = (await fetchAll('SEM/' + pcc + '/AG', stateful)).output;
		if (!UpdateGalileoSessionStateAction.wasPccChangedOk(output)) {
			const error = Errors.getMessage(Errors.PCC_GDS_ERROR, {
				pcc, response: output.trim(),
			});
			return {errors: [error]};
		}
		return bookItinerary(itinerary);
	};

	return execute();
};

RebuildInPcc_galileo.isSuccessRebookOutput = isSuccessRebookOutput;
RebuildInPcc_galileo.transformBuildError = transformBuildError;

module.exports = RebuildInPcc_galileo;
