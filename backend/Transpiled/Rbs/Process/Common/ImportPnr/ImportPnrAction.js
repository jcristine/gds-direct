
// namespace Rbs\Process\Common\ImportPnr;

let php = require('../../../../php');

/**
 * this action unites the Apollo and Sabre PNR import processes
 */
class ImportPnrAction
{
    static detectOpenPnrStatus($gds, $dump)  {
        let $status;
        if ($gds == 'apollo') {
            if (require('../../../../Rbs/TravelDs/ApolloPnr.js').checkDumpIsNotExisting($dump)) {
                $status = 'notExisting';
            } else if (require('../../../../Rbs/TravelDs/ApolloPnr.js').checkDumpIsRestricted($dump)) {
                $status = 'isRestricted';
            } else if (php.preg_match(/^\s*FIN OR IGN\s*(><)?\s*$/, $dump)) {
                $status = 'finishOrIgnore';
            } else if (php.preg_match(/^\s*\S[^\n]*\s*(><)?\s*$/, $dump)) {
                // any single line is treated as error
                $status = 'customError';
            } else {
                // there are many ways for agent to open a PNR and tweak
                // output, so matching anything that is not an error is safer
                $status = 'available';
            }
        } else {
            throw new Error('Unsupported GDS - '+$gds);
        }
        return $status;
    }
}
module.exports = ImportPnrAction;
