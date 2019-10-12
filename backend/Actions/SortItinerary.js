const CommonDataHelper = require('../Transpiled/Rbs/GdsDirect/CommonDataHelper.js');
const LocationGeographyProvider = require('../Transpiled/Rbs/DataProviders/LocationGeographyProvider.js');

/**
 * @param baseDate
 */
const SortItinerary = ({
	gds, gdsSession, itinerary,
	geo = new LocationGeographyProvider(),
}) => {
	const main = async () => {
		const sortedSegments = (await CommonDataHelper
			.sortSegmentsByUtc(itinerary, geo)).itinerary;
		const cmd = {
			apollo: '/0/' + sortedSegments.map(s => s.segmentNumber).join('|'),
			sabre: '/0/' + sortedSegments.map(s => s.segmentNumber).join(','),
			galileo: '/0S' + sortedSegments.map(s => s.segmentNumber).join('.'),
			amadeus: 'RS' + sortedSegments.map(s => s.segmentNumber).join(','),
		}[gds];

		const cmdRec = await gdsSession.runCmd(cmd);
		return {itinerary: sortedSegments, calledCommands: [cmdRec]};
	};

	return main();
};

SortItinerary.inApollo = params => SortItinerary({...params, gds: 'apollo'});
SortItinerary.inSabre = params => SortItinerary({...params, gds: 'sabre'});
SortItinerary.inGalileo = params => SortItinerary({...params, gds: 'galileo'});
SortItinerary.inAmadeus = params => SortItinerary({...params, gds: 'amadeus'});

module.exports = SortItinerary;
