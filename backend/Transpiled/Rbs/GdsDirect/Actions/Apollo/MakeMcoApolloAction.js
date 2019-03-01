
// namespace Rbs\GdsDirect\Actions\Apollo;

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const ApolloMakeMcoAction = require('../../../../Rbs/GdsAction/ApolloMakeMcoAction.js');
const ApolloPnr = require('../../../../Rbs/TravelDs/ApolloPnr.js');
const Airlines = require("../../../../../Repositories/Airlines");
const AbstractGdsAction = require('../../../GdsAction/AbstractGdsAction.js');
const fetchAll = require("../../../../../GdsHelpers/TravelportUtils").fetchAll;
const McoListParser = require('../../../../Gds/Parsers/Apollo/Mco/McoListParser.js');
const McoMaskParser = require('../../../../Gds/Parsers/Apollo/Mco/McoMaskParser.js');

let php = require('../../../../php.js');

/**
 * call ApolloMakeMcoAction and format output
 */
class MakeMcoApolloAction extends AbstractGdsAction
{
    static formatGdsOutput($dump)  {
        $dump = php.str_replace('|', '+', $dump);
        $dump = php.str_replace(';', '\u00B7', $dump);
        return $dump;
    }

    static extractTabCommands($output)  {
        let $matches;
        $matches = php.preg_match_all(/>([^>]+?)(?:·|;)/, $output, $matches = []);
        return php.array_unique($matches[1] || []);
    }

    static async getMcoParams($pnr, $mcoMask)  {
        let $validatingCarrier, $hub, $storedParams, $fop, $expirationDate;
        $validatingCarrier = $pnr.getValidatingCarrier();
        $hub = await Airlines.findByCode($validatingCarrier)
            .then(r => r.hub).catch(() => null);
        if (!$validatingCarrier) {
            return {'errors': ['Validating carrier must be present in ATFQ']};
        }
        $storedParams = McoMaskParser.parse($mcoMask);
        $fop = $storedParams['formOfPayment']['raw'] || null;
        $expirationDate = ($storedParams['expirationYear'] && $storedParams['expirationMonth'])
            ? '20'+$storedParams['expirationYear']+'-'+$storedParams['expirationMonth']+'-01'
            : null;
        if (!$fop || !$expirationDate || !$storedParams['approvalCode']) {
            return {'errors': ['Approved FOP must be present']};
        }
        if (!StringUtil.endsWith($fop, '\/OK')) {
            $fop += '\/OK';
        }
        return {
            'validatingCarrier': $validatingCarrier,
            'hub': $hub,
            'fop': $fop,
            'expirationDate': $expirationDate,
            'approvalCode': $storedParams['approvalCode'] || null,
        };
    }

    async getPnrMcoData()  {
        let $pnr, $mcoMask;
        let pnrDump = (await fetchAll('*R', this)).output;
        $pnr = ApolloPnr.makeFromDump(pnrDump);
        if (!$pnr.getRecordLocator()) {
            return {'errors': ['Must be in a PNR']};
        }
        $mcoMask = (await fetchAll('HHMCO', this)).output;
        return this.constructor.getMcoParams($pnr, $mcoMask);
    }

    async getCurrentMcoCount()  {
        let $mcoList;
        $mcoList = (await fetchAll('*MPD', this)).output;
        $mcoList = McoListParser.parse($mcoList);
        return php.count($mcoList['mcoRows'] || []);
    }

    async prepareParams($userParams)  {
        let $defaultParams, $pnrParams, $paramsFromPnr, $paramsFromUser;
        $defaultParams = ApolloMakeMcoAction.getDefaultParams();
        $pnrParams = await this.getPnrMcoData();
        if ($pnrParams['errors'] || null) {
            return $pnrParams;
        }
        $paramsFromPnr = {
            'validatingCarrier': $pnrParams['validatingCarrier'],
            'to': $pnrParams['validatingCarrier'],
            'at': $pnrParams['hub'],
            'formOfPayment': $pnrParams['fop'],
            'expirationDate': $pnrParams['expirationDate'],
            'approvalCode': $pnrParams['approvalCode'],
        };
        $paramsFromUser = {
            'mcoNumber': this.getCurrentMcoCount() + 1,
            'passengerName': $userParams['passengerName'],
            'amount': $userParams['amount'],
            'amountCurrency': $userParams['amountCurrency'],
            'issueNow': $userParams['issueNow'],
        };
        return php.array_merge($defaultParams, $paramsFromPnr, $paramsFromUser);
    }

    async execute($userParams)  {
        let $params, $mcoResult;
        $params = await this.prepareParams($userParams);
        if ($params['errors'] || null) {
            return {'errors': $params['errors']};
        }
        $mcoResult = await new ApolloMakeMcoAction()
            .setSession(this.session)
            .execute($params);
        if ($mcoResult['success'] || false) {
            return {
                'calledCommands': [{
                    'cmd': 'HHMCU',
                    'output': this.constructor.formatGdsOutput($mcoResult['response']),
                    'tabCommands': this.constructor.extractTabCommands($mcoResult['response']),
                    'clearScreen': true,
                }],
            };
        } else {
            return {
                'errors': ['Failed to issue MCO: '+$mcoResult['response']],
            };
        }
    }
}
module.exports = MakeMcoApolloAction;
