const SiParser = require('../Transpiled/Gds/Parsers/Galileo/Pnr/SiParser.js');
const TravelportUtils = require('../GdsHelpers/TravelportUtils.js');
const SabrePnr = require('../Transpiled/Rbs/TravelDs/SabrePnr.js');

const getAllSabreSsrs = async ({stateful}) => {
	// Sabre shows _some_ SSRs on simple *R display, but not all of them

	// *P3/4 - SSR-s, *P5 - remarks, *P6 - received from
	// *P9 - phones, *N - names, *T - ticket list, *B - seats
	// *PE - email, *PAC - accounting, *IMSL - itinerary with marriages
	// *CID - corporate id
	const fullPnrCmd = '*P3D*P4D*P3*P4*P5*P6*P9*N*T*B*PAC*PE*PDK*FN*PAD*FF*IMSL'; // *SC*DL-*FN*/*CID*CC;
	const cmdRec = await stateful.runCmd(fullPnrCmd);
	const fullPnr = SabrePnr.makeFromDump(cmdRec.output);
	return fullPnr.getSsrList();
};

const getGalileoOtherSsrs = async ({stateful}) => {
	const cmdRec = await TravelportUtils.fetchAll('*SI', stateful);
	const parsed = SiParser.parse(cmdRec.output);
	return parsed.otherSsrs;
};

/** @param {IPnr|ApolloPnr|AmadeusPnr} pnr */
const GetDocSsrList = ({pnr, stateful}) => {
	const getSsrs = async () => {
		const gds = pnr.getGdsName();
		return {
			apollo: () => pnr.getSsrList(),
			sabre: () => getAllSabreSsrs({stateful}),
			galileo: () => getGalileoOtherSsrs({stateful}),
			amadeus: () => pnr.getSsrList(),
		}[gds]();
	};

	const main = async () => {
		const ssrs = await getSsrs();
		const isDoc = ssr => ['DOCS', 'DOCA', 'DOCO']
			.includes(ssr.code);
		return {data: ssrs.filter(isDoc)};
	};

	return main();
};

module.exports = GetDocSsrList;
