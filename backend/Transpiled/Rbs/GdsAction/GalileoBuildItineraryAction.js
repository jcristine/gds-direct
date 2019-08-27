const StringUtil = require('../../Lib/Utils/StringUtil.js');
const ItineraryParser = require('../../Gds/Parsers/Galileo/Pnr/ItineraryParser.js');
const TravelportBuildItineraryViaXml = require('./TravelportBuildItineraryActionViaXml');
const moment = require('moment');

/**
 * takes itinerary data and adds it to current PNR by
 * performing a direct sell command of each segment
 * >0AC 215V 24MAR YYCYVR NN1;
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');
const fetchAll = require('../../../GdsHelpers/TravelportUtils').fetchAll;

// '    EK  214 C  29JUL FLLDXB HS1   910P # 740P O       E         DEPARTS FLL TERMINAL 3  - ARRIVES DXB TERMINAL 3                *COMPLIMENTARY CHAUFFEUR DRIVE - SEE EK PAGES IN YOUR GDS*',
// '*ADD PASSPORT DETAILS IN SSR DOCS AND CONTACT IN SSR CTCM *',
// '*ADD NEXT OF KIN CONTACT IN SSR PCTC*',
// 'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS  ',
// 'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
// 'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
// 'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
// 'OFFER CAR/HOTEL      >CAL;       >HOA; ',
// '><',
// ' 5. EK  213 K  23AUG DXBFLL HS1   210A   959A O       E      1  DEPARTS DXB TERMINAL 3  - ARRIVES FLL TERMINAL 4                *ADD PASSPORT DETAILS IN SSR DOCS AND CONTACT IN SSR CTCM *',
// '*ADD NEXT OF KIN CONTACT IN SSR PCTC*',
// 'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS  ',
// 'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
// 'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
// 'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
// 'OFFER CAR/HOTEL      >CAL;       >HOA; ',
// '><',
const parseItinerary = output => {
	let wrapped, parsed;

	output = php.preg_replace(/^ {4}/, ' 0. ', output);
	wrapped = StringUtil.wrapLinesAt(output, 64);
	parsed = ItineraryParser.parse(wrapped);
	return parsed['parsedData'] || [];
};

/** @deprecated I guess, should use TravelportBuildItineraryActionViaXml.js (and rename it maybe to be a lit less verbose) */
const GalileoBuildItineraryAction = ({
	session,
	itinerary,
	isParserFormat,
	useXml = true,
	travelport,
	baseDate = moment().format("YYYY-MM-DD"),
}) => {
	const formatGdsDate = dt => {
		return php.strtoupper(php.date('dM', php.strtotime(dt)));
	};

	const isAvailabilityOutput = output => {
		const clean = php.preg_replace(/></, '', output);
		return php.trim(clean) === '*0 AVAIL/WL CLOSED*';
	};

	const executeViaTerminal = async (itinerary, isParserFormat) => {
		let resultItinerary, i, segment, pattern, cmd, output, segments, errorType, tplData;

		itinerary = itinerary.map(segment => {
			const date = isParserFormat
				? segment['departureDate']['raw']
				: formatGdsDate(segment['departureDate']);

			return {...segment, 'departureDate': date};
		});

		resultItinerary = [];
		for ([i, segment] of Object.entries(itinerary)) {
			pattern = '0{airline}{flightNumber}{bookingClass}{departureDate}{departureAirport}{destinationAirport}{segmentStatus}{seatCount}';
			cmd = StringUtil.format(pattern, segment);
			output = (await fetchAll(cmd, session)).output;
			if (php.empty(segments = parseItinerary(output))) {
				if (isAvailabilityOutput(output)) {
					errorType = GalileoBuildItineraryAction.ERROR_NO_AVAIL;
				} else {
					errorType = GalileoBuildItineraryAction.ERROR_GDS_ERROR;
				}
				tplData = {
					'segmentNumber': i + 1,
					'from': segment['departureAirport'],
					'to': segment['destinationAirport'],
					'response': php.trim(output),
				};
				return {'success': false, 'errorType': errorType, 'errorData': tplData};
			}
			resultItinerary = php.array_merge(resultItinerary, segments);
		}
		return {'success': true, 'itinerary': resultItinerary};
	};

	const execute = async (itinerary, isParserFormat) => {
		if(useXml) {
			return TravelportBuildItineraryViaXml({
				itinerary,
				session,
				travelport,
				baseDate,
			});
		} else {
			return executeViaTerminal(itinerary, isParserFormat);
		}
	};

	return execute(itinerary, isParserFormat);
};

GalileoBuildItineraryAction.ERROR_GDS_ERROR = 'ERROR_GDS_ERROR';
GalileoBuildItineraryAction.ERROR_NO_AVAIL = 'ERROR_NO_AVAIL';
module.exports = GalileoBuildItineraryAction;
module.exports.parseItinerary = parseItinerary;