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

const getTravelportNameNumber = (ssr, pnr) => {
	const pnrPaxes = pnr.getPassengers();
	const pnrPaxName = (ssr.data || {}).pnrPaxName;
	if (pnrPaxName) {
		const [lastName, firstName] = pnrPaxName.split('/');
		const matching = pnrPaxes
			.filter(pnrPax =>
				pnrPax.lastName === lastName &&
				pnrPax.firstName === firstName)
			.map(pnrPax => pnrPax.nameNumber);
		return matching.length !== 1 ? null : matching[0];
	} else if (pnrPaxes.length === 1) {
		return pnrPaxes[0].nameNumber;
	} else {
		return null;
	}
};

const getSabreNameNumber = (ssr, pnr) => {
	const nameNumbers = pnr.getPassengers()
		.map(pnrPax => pnrPax.nameNumber);
	const paxNum = (ssr.data || {}).paxNum;
	if (paxNum) {
		const matching = nameNumbers
			.filter(numRec => {
				const pnrPaxNum =
					numRec.fieldNumber + '.' +
					numRec.firstNameNumber;
				return paxNum === pnrPaxNum;
			});
		return matching.length !== 1 ? null : matching[0];
	} else if (nameNumbers.length === 1) {
		return nameNumbers[0];
	} else {
		return null;
	}
};

const getAmadeusNameNumber = (ssr, pnr) => {
	const nameNumbers = pnr.getPassengers()
		.map(pnrPax => pnrPax.nameNumber);
	const paxNum = (ssr.data || {}).paxNum;
	return nameNumbers.length === 1
		? nameNumbers[0]
		: nameNumbers.filter(numRec => numRec.fieldNumber == paxNum)[0];
};

/** @param {IPnr|ApolloPnr|AmadeusPnr} pnr */
const GetDocSsrList = ({pnr, stateful}) => {
	const getSsrs = async () => {
		const gds = pnr.getGdsName();
		return {
			apollo: () => pnr.getSsrList()
				.map(ssr => ({...ssr,
					nameNumber: getTravelportNameNumber(ssr, pnr),
				})),
			sabre: () => getAllSabreSsrs({stateful})
				.then(ssrs => ssrs.map(ssr => ({...ssr,
					nameNumber: getSabreNameNumber(ssr, pnr),
				}))),
			galileo: () => getGalileoOtherSsrs({stateful})
				.then(ssrs => ssrs.map(ssr => ({...ssr,
					nameNumber: getTravelportNameNumber(ssr, pnr),
				}))),
			amadeus: () => pnr.getSsrList()
				.map(ssr => ({...ssr,
					nameNumber: getAmadeusNameNumber(ssr, pnr),
				})),
		}[gds]();
	};

	const main = async () => {
		const ssrs = await getSsrs();
		const isDoc = ssr => ['DOCS', 'DOCA', 'DOCO']
			.includes(ssr.ssrCode);
		return {data: ssrs.filter(isDoc)};
	};

	return main();
};

module.exports = GetDocSsrList;
