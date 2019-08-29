

const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const SavePnrAction = require('../../../Rbs/MultiGdsAction/SavePnrAction.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
class TSabreSavePnr
{
	static isSaveConfirmationRequired($dump)  {
		let $isWarningLine;

		// 'VERIFY ORDER OF ITINERARY SEGMENTS - MODIFY OR END TRANSACTION',
		// 'SEGMENTS NOT IN DATE ORDER - VERIFY AND REENTER',
		// 'MIN CONNX TIME SEG 05 AT ORD 1.15'
		$isWarningLine = ($line) => {

			return php.trim($line) === 'SEGMENTS NOT IN DATE ORDER - VERIFY AND REENTER'
                || php.trim($line) === 'VERIFY ORDER OF ITINERARY SEGMENTS - MODIFY OR END TRANSACTION'
                || StringUtil.startsWith($line, 'MIN CONNX TIME SEG')
                || php.preg_match(/^\s*FF MILEAGE AGREEMENT EXISTS, SEE PT\*AC FOR ITINERARY SEGMENT\s*\d*\s*$/, $line);
		};
		return Fp.all($isWarningLine, StringUtil.lines(php.trim($dump)));
	}

	// 'SIMULTANEOUS CHANGES TO PNR - USE IR TO IGNORE AND RETRIEVE PNR'
	static parseErrorType($dump)  {

		if (php.trim($dump) === 'SIMULTANEOUS CHANGES TO PNR - USE IR TO IGNORE AND RETRIEVE PNR') {
			return SavePnrAction.STATUS_SIMULTANEOUS_CHANGES;
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
				status: SavePnrAction.STATUS_EXECUTED,
				transactionNumber: $transactionNumber,
				recordLocator: $recordLocator,
				warningMessage: $warningMessage,
				raw: $dump,
			};
		} else {
			return {
				success: false,
				status: this.parseErrorType($dump) || SavePnrAction.STATUS_GDS_ERROR,
				raw: $dump,
			};
		}
	}
}
module.exports = TSabreSavePnr;
