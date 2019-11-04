const PnrStatusParser = require('gds-utils/src/text_format_processing/apollo/actions/PnrStatusParser.js');

const SabrePnr = require('../Transpiled/Rbs/TravelDs/SabrePnr.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const GalPnrParser = require('gds-utils/src/text_format_processing/galileo/pnr/PnrParser.js');
const AmaPnrParser = require('../Transpiled/Gds/Parsers/Amadeus/Pnr/PnrParser.js');
const {safe} = require('../Utils/TmpLib.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');

const isSimultaneousChangesRs = (gds, output) => {
	const pred = {
		apollo: rs => rs.match(/^\s*SIMULT CHGS TO PNR\s*><$/),
		sabre: rs => rs.trim() === 'SIMULTANEOUS CHANGES TO PNR - USE IR TO IGNORE AND RETRIEVE PNR',
		galileo: rs => rs.match(/^\s*SIMULTANEOUS CHANGES TO BOOKING FILE - IGNORE TRANSACTION\s*><$/),
		amadeus: rs => rs.match(/^\s*\/\s*SIMULTANEOUS CHANGES TO PNR - USE WRA\/RT TO PRINT OR IGNORE\s*$/),
	}[gds];

	return pred(output);
};

const isWarningRs = (gds, output) => {
	const pred = {
		// 'SEG CONT SEG 03'
		// 'SEG CONT SEG 04'
		// 'DTE CONT'
		// 'SEG CONT SEG 05'
		// 'CHECK MINIMUM CONNECT TIME SEGMENT 05/06',
		apollo: rs => rs.replace(/\s*><$/, '').trim().split('\n').every(l => {
			return l.trim() === 'DTE CONT'
				|| l.match(/^\s*(SEG\s+CONT\s+SEG\s+\d{1,2}\s*)+\s*$/) // Open Jaw connections
				|| l.match(/^\s*CHECK MINIMUM CONNECT TIME SEGMENT.*$/) // short time between connections
				|| l.match(/^.*\bCONT\b.*$/);
		}),
		// 'VERIFY ORDER OF ITINERARY SEGMENTS - MODIFY OR END TRANSACTION',
		// 'SEGMENTS NOT IN DATE ORDER - VERIFY AND REENTER',
		// 'MIN CONNX TIME SEG 05 AT ORD 1.15'
		sabre: rs => rs.trim().split('\n').every(l => {
			return l.trim() === 'SEGMENTS NOT IN DATE ORDER - VERIFY AND REENTER'
				|| l.trim() === 'VERIFY ORDER OF ITINERARY SEGMENTS - MODIFY OR END TRANSACTION'
				|| l.startsWith('MIN CONNX TIME SEG')
				|| l.match(/^\s*FF MILEAGE AGREEMENT EXISTS, SEE PT\*AC FOR ITINERARY SEGMENT\s*\d*\s*$/);
		}),
		// '><',
		// 'CHECK CONTINUITY SEGMENT 05',
		// 'CHECK DATE/TIME CONTINUITY SEGMENT 05',
		galileo: rs => rs.replace(/\s*><$/, '').split('\n')
			.some(l => [
				'CHECK CONTINUITY SEGMENT',
				'CHECK DATE/TIME CONTINUITY SEGMENT',
				'ECK MINIMUM CONNECT TIME SEGMENTS',
			].some(prefix => l.startsWith(prefix))),
		// '/',
		// 'WARNING: CHECK MINIMUM CONNECTION TIME - SEGMENT 6/7',
		// 'WARNING: SECURE FLT PASSENGER DATA REQUIRED FOR TICKETING PAX 1',
		amadeus: rs => rs.replace(/^\s*\/\s*/, '').trim()
			.split('\n')
			.every(l => l.startsWith('WARNING:')),
	}[gds];

	return pred(output);
};

const isSuccessRs = (gds, output) => {
	const pred = {
		apollo: rs => PnrStatusParser.parseSavePnr(rs).recordLocator,
		sabre: rs => SabrePnr.makeFromDump(rs).getRecordLocator(),
		galileo: rs => safe(() => GalPnrParser.parse(rs).headerData.reservationInfo.recordLocator),
		amadeus: rs => safe(() => AmaPnrParser.parse(rs).parsed.pnrInfo.recordLocator),
	}[gds];

	return pred(output);
};

const SavePnr = ({gds, gdsSession, cmds}) => {
	const delim = {
		apollo: '|',
		sabre: '§',
		galileo: '|',
		amadeus: ';',
	}[gds];

	const main = async () => {
		const cmd = cmds.join(delim) + delim + 'ER';
		let cmdRec = await gdsSession.runCmd(cmd);
		if (isWarningRs(gds, cmdRec.output)) {
			cmdRec = await gdsSession.runCmd('ER');
		}
		if (isSuccessRs(gds, cmdRec.output)) {
			return Promise.resolve({message: 'MP Remark Saved Successfully'});
		} else if (isSimultaneousChangesRs(gds, cmdRec.output)) {
			return Rej.Conflict('Simultaneous changes to PNR');
		} else {
			return Rej.UnprocessableEntity('Unsuccessful >ER; output - ' + cmdRec.output.trim());
		}

	};

	return main();
};

// could parse each command and check: if it is in a
// whitelist - glue it with ER, otherwise run separately
SavePnr.withRetry = async ({gds, gdsSession, cmds}) => {
	const tryOnce = () => SavePnr({gds, gdsSession, cmds});
	return tryOnce().catch(coverExc([Rej.Conflict], async (exc) => {
		await gdsSession.runCmd('IR');
		return tryOnce();
	}));
};

module.exports = SavePnr;
