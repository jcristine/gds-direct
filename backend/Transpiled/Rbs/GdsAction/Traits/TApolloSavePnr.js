
// namespace Rbs\GdsAction\Traits;

const SavePnrAction = require('../../../Rbs/MultiGdsAction/SavePnrAction.js');
const php = require('../../../phpDeprecated');

class TApolloSavePnr
{
    // 'SIMULT CHGS TO PNR',
    // '><',
    static parseErrorType($dump)  {
        let $clean;
        $clean = php.preg_replace(/(\)?><)$/, '', $dump);
        if (php.trim($clean) === 'SIMULT CHGS TO PNR') {
            return SavePnrAction.STATUS_SIMULTANEOUS_CHANGES;
        } else {
            return null;
        }
    }

    static parseSavePnrOutput($dump)  {
        let $matches, $recordLocator;
        $matches = [];
        if (php.preg_match(/^OK - (?<recordLocator>[A-Z0-9]{6})-/, $dump, $matches = [])) {
            $recordLocator = $matches['recordLocator'];
            return {
                'success': true,
                'status': SavePnrAction.STATUS_EXECUTED,
                'recordLocator': $recordLocator,
                'raw': $dump,
            };
        } else {
            return {
                'success': false,
                'status': this.parseErrorType($dump),
                'recordLocator': null,
                'raw': $dump,
            };
        }
    }
}
module.exports = TApolloSavePnr;
