const MmParser = require('gds-utils/src/text_format_processing/galileo/pnr/MmParser.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const MpListParser = require('gds-utils/src/text_format_processing/apollo/MpListParser.js');
const SiParser = require('gds-utils/src/text_format_processing/galileo/pnr/SiParser.js');
const TravelportUtils = require('../GdsHelpers/TravelportUtils.js');
const SabrePnr = require('../Transpiled/Rbs/TravelDs/SabrePnr.js');

const getSabreLongPnrData = async ({stateful}) => {
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
	return SabrePnr.makeFromDump(pnrCmdRec.output);
};

const getAllSabreSsrs = async ({stateful}) => {
	const fullPnr = await getSabreLongPnrData({stateful});
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

const findNameNumByRaw = (rawPaxNum, nameRecords) => {
	const allNameNumbers = nameRecords.map(pax => pax.nameNumber);
	const match = rawPaxNum.match(/^\s*(\d+)\.(\d+)\s*$/);
	if (match) {
		const [, fieldNumber, firstNameNumber] = match;
		return allNameNumbers.filter((nameNum) => {
			return nameNum.fieldNumber == fieldNumber
				&& nameNum.firstNameNumber == firstNameNumber;
		})[0];
	} else {
		return null;
	}
};

const normTpMps = (parsed, pnr) => {
	if (parsed.error) {
		const msg = 'Failed to parse Mileage Program List - ' + parsed.error;
		return Rej.NotImplemented(msg, parsed);
	} else {
		const passengers = parsed.passengers;
		return passengers.flatMap(pax => {
			const pnrPax = pnr.getPassengers()[pax.passengerNumber - 1] || null;
			return pax.mileagePrograms.map(mp => ({
				airline: mp.airline,
				code: mp.code,
				passengerNameNumber: !pnrPax ? null : pnrPax.nameNumber,
				passengerName: pax.passengerName,
			}));
		});
	}
};

/** @param {ApolloPnr} pnr */
const getApolloMileagePrograms = async ({pnr, stateful}) => {
	if (!pnr.hasFrequentFlyerInfo()) {
		return [];
	} else {
		const cmdRec = await TravelportUtils.fetchAll('*MP', stateful);
		const parsed = MpListParser.parse(cmdRec.output);
		return normTpMps(parsed, pnr);
	}
};

/** @param {GalileoPnr} pnr */
const getGalileoMileagePrograms = async ({pnr, stateful}) => {
	if (!pnr.hasFrequentFlyerInfo()) {
		return [];
	} else {
		const cmdRec = await TravelportUtils.fetchAll('*MM', stateful);
		const parsed = MmParser.parse(cmdRec.output);
		return normTpMps(parsed, pnr);
	}
};

/** @param {SabrePnr} pnr */
const getSabreMileagePrograms = async ({pnr, stateful}) => {
	if (!pnr.hasFrequentFlyerInfo()) {
		return [];
	} else {
		const fullPnr = await getSabreLongPnrData({stateful});
		return fullPnr.parsed.parsedData.frequentTraveler.mileagePrograms.map(mp => ({
			...mp,
			passengerNameNumber: findNameNumByRaw(mp.passengerNumber, fullPnr.getPassengers()),
		}));
	}
};

/**
 * @param {IPnr|ApolloPnr|AmadeusPnr} pnr
 * @param stateful = require('StatefulSession.js')()
 */
const ImportPnr = ({pnr, stateful}) => {
	const getPnrFields = async () => {
		const gds = pnr.getGdsName();
		return {
			apollo: async () => {
				const ssrs = pnr.getSsrList().map(ssr => ({...ssr,
					nameNumber: getTravelportNameNumber(ssr, pnr),
				}));
				return {
					docSsrList: {data: ssrs.filter(isDocSsr)},
					serviceSsrList: {data: ssrs.filter(isServiceSsr)},
					frequentFlyerInfo: {mileagePrograms: await getApolloMileagePrograms({pnr, stateful})},
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
					frequentFlyerInfo: {mileagePrograms: await getGalileoMileagePrograms({pnr, stateful})},
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
					frequentFlyerInfo: {mileagePrograms: await getSabreMileagePrograms({pnr, stateful})},
				};
			},
			amadeus: () => {
				const ssrs = pnr.getSsrList().map(ssr => ({...ssr,
					nameNumber: getAmadeusNameNumber(ssr, pnr),
				}));
				return {
					docSsrList: {data: ssrs.filter(isDocSsr)},
					serviceSsrList: {data: ssrs.filter(isServiceSsr)},
					frequentFlyerInfo: {
						mileagePrograms: ssrs
							.filter(ssr => ssr.ssrCode === 'FQTV')
							.map(ssr => ({
								airline: ssr.data.airline,
								flyerNumber: ssr.data.flyerNumber,
								passengerNameNumber: ssr.nameNumber,
								passengerName: null,
							})),
					},
				};
			},
		}[gds]();
	};

	const main = async () => {
		const pnrFields = await getPnrFields();
		pnrFields.serviceSsrList.data.forEach(ssr => {
			if (!stateful.getAgent().canSeeContactInfo()) {
				if (ssr.ssrCode === 'CTCM') {
					ssr.content = ssr.content.replace(/.(?=\d{3})/g, '*');
				} else if (ssr.ssrCode === 'CTCE') {
					ssr.content = ssr.content.replace(/.(?=\S{2,}\/\/)/g, '*');
				}
			}
		});
		return {pnrFields};
	};

	return main();
};

module.exports = ImportPnr;
