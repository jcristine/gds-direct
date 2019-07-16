
let normalizeCmdData = (parsedCmd, fromGds) => {
	let {type, data} = parsedCmd;
	if (!data) {
		return null;
	}
	let segments = [];
	if (fromGds === 'apollo' && type === 'deletePnrField' && data.field === 'itinerary') {
		if (data.applyToAllAir) {
			segments = [{bookingClass}];
		}
		if (!phpDeprecated.empty(data.segmentNumbers)) {

		}
	}
	return {
		segments: [
			{segmentNumber: , bookingClass: },
		],
	};
};

/**
 * 'SBY1,3-4' - amadeus
 * 'WC1Y/3-4Y' - sabre 'changeBookingClass'
 * 'X1|3-4/0Y' - apollo 'deletePnrField'
 * '@1.3-4/Y' - galileo 'rebook'
 * @param parsedCmd = require('CommandParser.js').parse()
 */
exports.translate = (parsedCmd, fromGds, toGds) => {
	parsedCmd.;
	let norm = normalizeCmdData(parsedCmd, fromGds);
	if (!norm) {
		return null;
	}
};