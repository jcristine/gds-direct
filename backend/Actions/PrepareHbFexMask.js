const ParseHbFex = require('gds-utils/src/text_format_processing/apollo/ticketing_masks/ParseHbFex.js');
const DateTime = require('../Transpiled/Lib/Utils/DateTime.js');
const PnrHistoryParser = require('gds-utils/src/text_format_processing/apollo/PnrHistoryParser.js');
const GetCurrentPnr = require('./GetCurrentPnr.js');
const TicketHistoryParser = require('gds-utils/src/text_format_processing/apollo/TicketHistoryParser.js');
const TmpLib = require('../Utils/TmpLib.js');
const McoListParser = require('gds-utils/src/text_format_processing/apollo/McoListParser.js');
const McoMaskParser = require('gds-utils/src/text_format_processing/apollo/ticketing_masks/McoMaskParser.js');
const TravelportUtils = require('../GdsHelpers/TravelportUtils.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const moment = require('moment');

/** @param {string} passengerName = 'LONGLONG' || 'BITCA/IU' || 'BITCA/IURI' */
const matchesMcoName = (passengerName, headerData) => {
	const [lnme, fnme] = passengerName.split('/');
	return headerData.lastName.startsWith(lnme || '')
		&& headerData.firstName.startsWith(fnme || '')
		|| (lnme || '').startsWith(headerData.lastName)
		&& (fnme || '').startsWith(headerData.firstName);
};

/** @param stateful = require('StatefulSession.js')() */
const PrepareHbFexMask = ({
	stateful, cmdStoreNumber = '', ticketNumber = '',
	Pccs = require('../Repositories/Pccs.js'),
}) => {
	const filterMcoRowsByMask = async (matchingPartial, headerData) => {
		const matchingFull = [];
		for (const mcoRow of matchingPartial) {
			if (mcoRow.command) {
				const cmd = mcoRow.command;
				const mcoDump = (await TravelportUtils.fetchAll(cmd, stateful)).output;
				const parsed = McoMaskParser.parse(mcoDump);
				if (parsed.error) {
					return Rej.UnprocessableEntity('Bad ' + cmd + ' reply - ' + parsed.error);
				} else if (matchesMcoName(parsed.passengerName, headerData)) {
					mcoRow.fullData = parsed;
					matchingFull.push(mcoRow);
				}
			}
		}
		return matchingFull;
	};

	/** @param {ApolloPnr} pnr */
	const getMcoRows = async (pnr, headerData) => {
		if (!pnr.hasMcoInfo()) {
			return [];
		}
		const cmdRec = await TravelportUtils.fetchAll('*MPD', stateful);
		const parsed = McoListParser.parse(cmdRec.output);
		if (parsed.error) {
			return Rej.UnprocessableEntity('Bad *MPD reply - ' + parsed.error);
		}
		const matchingPartial = parsed.mcoRows.filter(mcoRow => {
			return matchesMcoName(mcoRow.passengerName, headerData);
		});
		return filterMcoRowsByMask(matchingPartial, headerData)
			.catch(TmpLib.ignoreExc(matchingPartial, [Rej.UnprocessableEntity]));
	};

	/** @param {ApolloPnr} pnr */
	const getHtRows = async (pnr) => {
		if (!pnr.hasEtickets()) {
			return [];
		}
		const cmdRec = await TravelportUtils.fetchAll('*HT', stateful);
		const parsed = TicketHistoryParser.parse(cmdRec.output);
		const tickets = []
			.concat(parsed.currentTickets.map(r => ({...r, isActive: true})))
			.concat(parsed.deletedTickets.map(r => ({...r, isActive: false})));
		if (tickets.length === 0) {
			return Rej.UnprocessableEntity('Bad *HT reply - ' + cmdRec.output);
		} else {
			return tickets;
		}
	};

	const _checkPnrForExchange = async (storeNum) => {
		const agent = stateful.getAgent();
		if (!agent.canIssueTickets()) {
			return Rej.Forbidden('You have no ticketing rights');
		}
		const pnr = await GetCurrentPnr(stateful);
		if (!pnr.getRecordLocator()) {
			return Rej.BadRequest('Must be in a PNR');
		}
		const store = pnr.getStoredPricingList()[storeNum - 1];
		if (!store) {
			return Rej.BadRequest('There is no ATFQ #' + storeNum + ' in PNR');
		}
		if (pnr.getPassengers().length > 1) {
			const nData = store.pricingModifiers
				.filter(mod => mod.type === 'passengers')
				.map(mod => mod.parsed)[0];

			const paxCnt = !nData || !nData.passengersSpecified
				? pnr.getPassengers().length
				: nData.passengerProperties.length;
			// Rico says there is a risk of losing a ticket if issuing multiple paxes
			// at once with HB:FEX, so ticketing agents are not allowed to do so
			if (paxCnt > 1) {
				const error = 'Multiple passengers (' + paxCnt +
					') in ATFQ #' + storeNum + ' not allowed for HB:FEX';
				return Rej.BadRequest(error);
			}
		}
		return Promise.resolve(pnr);
	};

	// mcoRows dates are in _ticketing_ PCC timezone, but date passed to HB:FEX should
	// be in timezone of PCC in which PNR was _originally created_, not ticketed
	// this is problem only if there is large enough gap between utc and pcc
	// where actual date value should be smaller
	const modifyMcosAccordingToPccDate = async (mcoRows, htRows) => {
		const history = PnrHistoryParser
			.parse((await TravelportUtils.fetchAll('*HA', stateful)).output);

		const pccId = history && history.rcvdList && history.rcvdList[0]
			&& history.rcvdList[0].rcvd && history.rcvdList[0].rcvd.pcc;

		if (!pccId) {
			return;
		}

		const pnrCreationPcc = await Pccs.findByCode('apollo', pccId);

		if (!pnrCreationPcc) {
			return;
		}

		const pnrCreationTz = await stateful.getGeoProvider()
			.getTimezone(pnrCreationPcc.point_of_sale_city);

		if (!pnrCreationTz) {
			return;
		}

		mcoRows.forEach(mcoRow => {
			const htRecord = htRows
				.find(record => record.ticketNumber === mcoRow.documentNumber);

			if (!htRecord) {
				return;
			}

			// needed only to get date's year
			const pastDate = DateTime.addPastYear(
				htRecord.transactionDt.parsed.split(' ')[0], stateful.getStartDt());

			if (!pastDate) {
				return;
			}

			const year = pastDate.split('-')[0];

			const finalDate = moment.utc(DateTime.fromUtc(`${year}-${htRecord.transactionDt.parsed}:00`, pnrCreationTz));

			mcoRow.issueDate = {
				raw: finalDate.format('DDMMMYY').toUpperCase(),
				parsed: finalDate.format('YYYY-MM-DD'),
			};
		});
	};

	const main = async () => {
		const pnr = await _checkPnrForExchange(cmdStoreNumber || 1);
		const cmd = 'HB' + cmdStoreNumber + ':FEX' + (ticketNumber || '');
		const output = (await stateful.runCmd(cmd)).output;
		const parsed = ParseHbFex(output);
		if (!parsed) {
			return {calledCommands: [{cmd, output}], errors: ['Invalid HB:FEX response']};
		}
		const readonlyFields = new Set([
			'originalBoardPoint', 'originalOffPoint',
			'originalAgencyIata', 'originalInvoiceNumber',
			'originalTicketStarExtension',
		]);
		const pcc = stateful.getSessionData().pcc;
		const pccRow = !pcc ? null : await Pccs.findByCode('apollo', pcc);

		const mcoRows =ticketNumber ? [] : await getMcoRows(pnr, parsed.headerData)
			.catch(TmpLib.ignoreExc([], [Rej.UnprocessableEntity]));
		const htRows = ticketNumber ? [] : await getHtRows(pnr)
			.catch(TmpLib.ignoreExc([], [Rej.UnprocessableEntity]));

		await modifyMcosAccordingToPccDate(mcoRows, htRows);

		return {
			calledCommands: [{
				cmd: cmd,
				output: 'SEE MASK FORM BELOW',
			}],
			actions: [{
				type: 'displayExchangeMask',
				data: {
					currentPos: !pccRow ? null : pccRow.point_of_sale_city,
					mcoRows: mcoRows,
					htRows: htRows,
					headerData: parsed.headerData,
					fields: parsed.fields.map(f => ({
						key: f.key,
						value: f.value,
						enabled: !f.value && !readonlyFields.has(f.key),
					})),
					maskOutput: output,
				},
			}],
		};
	};

	return main();
};

module.exports = PrepareHbFexMask;
