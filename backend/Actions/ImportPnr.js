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
	let pnrCmdRec = null;
	for (const cmdRec of await stateful.getLog().getLastStateSafeCommands()) {
		if (cmdRec.cmd === fullPnrCmd) {
			pnrCmdRec = cmdRec;
		}
	}
	pnrCmdRec = pnrCmdRec || (await stateful.runCmd(fullPnrCmd));
	const fullPnr = SabrePnr.makeFromDump(pnrCmdRec.output);
	return fullPnr.getSsrList();
};

const getGalileoOtherSsrs = async ({stateful}) => {
	const cmdRec = await TravelportUtils.fetchAll('*SI', stateful);
	const parsed = SiParser.parse(cmdRec.output);
	return parsed.otherSsrs;
};

const getTravelportNameNumber = (ssr, pnr) => {
	const pnrPaxes = pnr.getPassengers();
	const pnrPaxName = ssr.pnrPaxName || null;
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
	const paxNum = (ssr.paxNums || [])[0] || null;
	return nameNumbers.length === 1
		? nameNumbers[0]
		: nameNumbers.filter(numRec => numRec.fieldNumber == paxNum)[0];
};

const isDocSsr = ssr => ['DOCS', 'DOCA', 'DOCO'].includes(ssr.ssrCode);
const isServiceSsr = ssr => !isDocSsr(ssr);

/** @param {IPnr|ApolloPnr|AmadeusPnr} pnr */
const ImportPnr = ({pnr, stateful}) => {
	const getPnrFields = async () => {
		const gds = pnr.getGdsName();
		return {
			apollo: () => {
				const ssrs = pnr.getSsrList().map(ssr => ({...ssr,
					nameNumber: getTravelportNameNumber(ssr, pnr),
				}));
				return {
					docSsrList: {data: ssrs.filter(isDocSsr)},
					serviceSsrList: {data: ssrs.filter(isServiceSsr)},
				};
			},
			sabre: async () => {
				const ssrs = (await getAllSabreSsrs({stateful}))
					.map(ssr => ({...ssr,
						nameNumber: getSabreNameNumber(ssr, pnr),
					}));
				return {
					docSsrList: {data: ssrs.filter(isDocSsr)},
					serviceSsrList: {data: ssrs.filter(isServiceSsr)},
				};
			},
			galileo: async () => {
				const ssrs = (await getGalileoOtherSsrs({stateful}))
					.map(ssr => ({...ssr,
						nameNumber: getTravelportNameNumber(ssr, pnr),
					}));
				return {
					docSsrList: {data: ssrs.filter(isDocSsr)},
					serviceSsrList: {data: ssrs.filter(isServiceSsr)},
				};
			},
			amadeus: () => {
				const ssrs = pnr.getSsrList().map(ssr => ({...ssr,
					nameNumber: getAmadeusNameNumber(ssr, pnr),
				}));
				return {
					docSsrList: {data: ssrs.filter(isDocSsr)},
					serviceSsrList: {data: ssrs.filter(isServiceSsr)},
				};
			},
		}[gds]();
	};

	const main = async () => {
		const pnrFields = await getPnrFields();
		const isDoc = ssr => ['DOCS', 'DOCA', 'DOCO']
			.includes(ssr.ssrCode);
		return {pnrFields};
	};

	return main();
};

module.exports = ImportPnr;
