const Rej = require('klesun-node-tools/src/Rej.js');
const CommonUtils = require('../GdsHelpers/CommonUtils.js');
const SavePnr = require('./SavePnr.js');
const OpenPnr = require('./OpenPnr.js');
const GetCurrentPnr = require('./GetCurrentPnr.js');
const GdsSession = require('../GdsHelpers/GdsSession.js');
const _ = require('lodash');

/**
 * adds 'OSI{airline} TCP {confirmationNumber}' remark for /ACC child linked PNRs to tell airline
 * it's record locator (confirmation number) in which is linked adult passenger is located
 *
 * @param stateful = require('StatefulSession.js')()
 */
const AddCrossRefOsi = ({
	stateful, gds, recordLocator,
	gdsClients = GdsSession.makeGdsClients(),
}) => {
	const baseDate = stateful.getStartDt();

	const getCrossRefOsiRecs = async (srcPnr) => {
		let writeOsiRecs = [];
		const airlines = srcPnr.getItinerary().map(s => s.airline);
		const reservation = srcPnr.getReservation(baseDate);
		const numRecs = reservation.confirmationNumbers;
		if (numRecs.length === 0) {
			const msg = 'PNR ' + srcPnr.getRecordLocator() + ' has no ACKN entries';
			return Rej.BadRequest(msg);
		}

		/**
		 * sometimes in place of airline code you get just 1A -
		 * should determine actual airline by deduction in such case
		 */
		const codeShareNumRecs = [];
		const coveredAirlines = new Set();
		for (const numRec of numRecs) {
			const {airline, confirmationNumber} = numRec;
			const recordLocator = confirmationNumber;
			if (airlines.includes(airline)) {
				coveredAirlines.add(airline);
				writeOsiRecs.push({airline, recordLocator});
			} else {
				codeShareNumRecs.push({airline, recordLocator});
			}
		}
		const airlinesLeftSet = new Set(airlines.filter(a => !coveredAirlines.has(a)));
		const codeShareNumRecsUniq = _.uniqBy(codeShareNumRecs, r => JSON.stringify(r));
		if (airlinesLeftSet.size === 1) {
			const airline = [...airlinesLeftSet][0];
			for (const numRec of codeShareNumRecs) {
				writeOsiRecs.push({
					airline: airline,
					recordLocator: numRec.recordLocator,
				});
			}
		// possibly should also check that number of ACKN records
		// matches the number of airlines left, but not sure...
		} else if (codeShareNumRecsUniq.length === 1) {
			// different airlines on same 1A record locator, for example LX and LH
			const {recordLocator} = codeShareNumRecs[0];
			for (const airline of airlinesLeftSet) {
				writeOsiRecs.push({airline, recordLocator});
			}
		} else if (airlinesLeftSet.size > 1 && codeShareNumRecs.length > 0) {
			// could eventually ask user to assign which number
			// belongs to which airline... if he can himself
			const msg = 'Could not deduct actual airlines among ' + [...airlinesLeftSet].join(',') +
				' for ' + codeShareNumRecsUniq.map(r => r.airline + '-' + r.recordLocator).join(',');
			return Rej.UnprocessableEntity(msg);
		}
		writeOsiRecs = _.uniqBy(writeOsiRecs, r => JSON.stringify(r));

		return writeOsiRecs;
	};

	const copyCrossRef = async (gdsSession, srcPnr) => {
		const writeOsiRecs = await getCrossRefOsiRecs(srcPnr);
		const cmds = writeOsiRecs.map(({airline, recordLocator}) => {
			const sabreApi = airline === 'AA' ? '4' : '3';
			return {
				apollo: `@:3OSI${airline} TCP ${recordLocator}`,
				galileo: `SI.${airline}*TCP ${recordLocator}`,
				sabre: `${sabreApi}OSI ${airline} TCP ${recordLocator}`,
				amadeus: `OS ${airline} TCP ${recordLocator}`,
			}[gds];
		});
		if (cmds.length > 0) {
			await SavePnr.withRetry({
				gds, gdsSession, cmds,
			});
		}
	};

	const main = async () => {
		const whenPnr = GetCurrentPnr(stateful);
		const {otherPnr, otherCalledCommands} = await GdsSession.withSession({
			gds, gdsClients,
			action: async gdsSession => {
				const otherPnr = (await OpenPnr({
					gdsSession, gds,
					recordLocator, allowPccChange: true,
				})).pnr;
				const currentPnr = await whenPnr;
				const capturing = CommonUtils.withCapture(gdsSession);
				await copyCrossRef(capturing, currentPnr);
				const otherCalledCommands = capturing.getCalledCommands();

				return {otherPnr, otherCalledCommands};
			},
		});
		const capturing = CommonUtils.withCapture(stateful);
		await copyCrossRef(capturing, otherPnr);

		return {
			calledCommands: [
				...otherCalledCommands,
				...capturing.getCalledCommands(),
			],
		};
	};

	return main();
};

module.exports = AddCrossRefOsi;
