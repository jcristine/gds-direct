const TravelportUtils = require('../GdsHelpers/TravelportUtils.js');
const TravelportBuildItineraryActionViaXml = require('../Transpiled/Rbs/GdsAction/TravelportBuildItineraryActionViaXml.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const TravelportClient = require('../GdsClients/TravelportClient.js');
const ParsersController = require('../Transpiled/Rbs/IqControllers/ParsersController.js');

exports.priceItinerary = ({iqParams}) => {
	const {pricingCmd, pnrDump, creationDate} = iqParams;
	if (!creationDate) {
		const msg = 'creationDate parameter is mandatory';
		throw Rej.BadRequest.makeExc(msg);
	}
	const guessed = (new ParsersController).guessDumpType({
		dump: pnrDump, creationDate,
	});
	if (guessed.response_code !== 1) {
		return Rej.BadRequest('Failed to parse your PNR dump');
	}
	const {type, data} = guessed.result;
	let {itinerary} = data;
	itinerary = itinerary.map(s => ({...s, segmentStatus: 'GK'}));
	const travelport = TravelportClient();
	return travelport.withSession({}, async (gdsSession) => {
		const built = await TravelportBuildItineraryActionViaXml({
			session: gdsSession, itinerary, travelport,
			baseDate: creationDate || undefined,
		});
		if (built.errorType) {
			return Rej.UnprocessableEntity('Failed to build itinerary - ' + built.errorType, built);
		}
		const pricingCmdRec = await TravelportUtils
			.fetchAll(pricingCmd, gdsSession);
		return {pricingDump: pricingCmdRec.output};
	});
};
