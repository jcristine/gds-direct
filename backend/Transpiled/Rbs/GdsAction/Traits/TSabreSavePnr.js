const GdsConstants = require('gds-utils/src/text_format_processing/agnostic/GdsConstants.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
class TSabreSavePnr
{
	static isSaveConfirmationRequired(dump)  {
		// 'VERIFY ORDER OF ITINERARY SEGMENTS - MODIFY OR END TRANSACTION',
		// 'SEGMENTS NOT IN DATE ORDER - VERIFY AND REENTER',
		// 'MIN CONNX TIME SEG 05 AT ORD 1.15'
		const isWarningLine = (line) => {
			return line.trim() === 'SEGMENTS NOT IN DATE ORDER - VERIFY AND REENTER'
                || line.trim() === 'VERIFY ORDER OF ITINERARY SEGMENTS - MODIFY OR END TRANSACTION'
                || line.startsWith('MIN CONNX TIME SEG')
                || php.preg_match(/^\s*FF MILEAGE AGREEMENT EXISTS, SEE PT\*AC FOR ITINERARY SEGMENT\s*\d*\s*$/, line);
		};
		return dump.trim().split('\n').every(isWarningLine);
	}

	// 'SIMULTANEOUS CHANGES TO PNR - USE IR TO IGNORE AND RETRIEVE PNR'
	static parseErrorType(dump)  {
		if (php.trim(dump) === 'SIMULTANEOUS CHANGES TO PNR - USE IR TO IGNORE AND RETRIEVE PNR') {
			return GdsConstants.SAVE_PNR_SIMULTANEOUS_CHANGES;
		} else {
			return null;
		}
	}

	// "OK 0802 FWOIAU"
	static parseSavePnrOutput($dump)  {
		let $matches, $_, $transactionNumber, $recordLocator, $warningMessage;

		$matches = [];
		if (php.preg_match(/^OK ([A-Z0-9]{4}) ([A-Z]{6})\s*(.*)$/, php.trim($dump), $matches = [])) {
			[$_, $transactionNumber, $recordLocator, $warningMessage] = $matches;
			return {
				success: true,
				status: GdsConstants.SAVE_PNR_EXECUTED,
				transactionNumber: $transactionNumber,
				recordLocator: $recordLocator,
				warningMessage: $warningMessage,
				raw: $dump,
			};
		} else {
			return {
				success: false,
				status: this.parseErrorType($dump) || GdsConstants.SAVE_PNR_GDS_ERROR,
				raw: $dump,
			};
		}
	}
}
module.exports = TSabreSavePnr;
