
// namespace Rbs\GdsAction;

const AbstractMaskParser = require('../../Gds/Parsers/Apollo/AbstractMaskParser.js');
const StringUtil = require('../../Lib/Utils/StringUtil.js');
const Fp = require('../../Lib/Utils/Fp.js');

// Assumes PNR is already open
class ApolloMakeMcoAction
{
    static getMask()  {
        return php.implode('', [
            'HHMCU..         *** MISC CHARGE ORDER ***                      ',
            ' PASSENGER NAME;........................................        ',
            ' TO;........................................ AT;............... ',
            ' VALID FOR;.................................................... ',
            ' TOUR CODE;............... RELATED TKT NBR;.............        ',
            ' FOP;.......................................................... ',
            ' EXP DATE;.... APVL CODE;...... COMM;........ TAX;........-;..  ',
            ' AMOUNT;........-;... EQUIV ;........-;... BSR;..........       ',
            ' END BOX;...................................................... ',
            ' REMARK1;..............................................         ',
            ' REMARK2;...................................................... ',
            ' VALIDATING CARRIER;..                  ISSUE NOW;.',
        ]);
    }

    static getFields()  {
        return [
            'mcoNumber',
            'passengerName',
            'to', 'at',
            'validFor',
            'tourCode', 'ticketNumber',
            'formOfPayment',
            'expirationDate', 'approvalCode', 'commission', 'taxAmount', 'taxCode',
            'amount', 'amountCurrency', 'equivAmount', 'equivCurrency', 'rateOfExchange',
            'endorsementBox',
            'remark1',
            'remark2',
            'validatingCarrier', 'issueNow',
        ];
    }

    static getDefaultParams()  {
        return {
            'validFor': 'SPLIT',
            'tourCode': '',
            'ticketNumber': '',
            'commission': '0.00\/',
            'taxAmount': '',
            'taxCode': '',
            'equivAmount': '',
            'equivCurrency': '',
            'rateOfExchange': '',
            'endorsementBox': '',
            'remark1': '',
            'remark2': '',
            'issueNow': 'Y',
        };
    }

    static getPositions($cmd)  {
        let $positions, $makeStartAndLength;
        $positions = AbstractMaskParser.getMaskTokenPositions($cmd);
        $makeStartAndLength = ($tuple) => {
            let $start, $end;
            [$start, $end] = $tuple;
            return [$start, $end - $start + 1];
        };
        return Fp.map($makeStartAndLength, $positions);
    }

    static overwriteStr($str, $needle, $position)  {
        let $replaceLength;
        $replaceLength = php.mb_strlen($needle);
        if ($replaceLength) {
            return php.mb_substr($str, 0, $position)+$needle+php.mb_substr($str, $position + $replaceLength);
        } else {
            return $str;
        }
    }

    static makeCmd($params)  {
        let $cmd, $positions, $fields, $missingFields, $field, $start, $length, $token;
        $params = php.array_merge(this.getDefaultParams(), $params);
        $params['expirationDate'] = php.date('my', php.strtotime($params['expirationDate']));
        $cmd = this.getMask();
        $positions = this.getPositions($cmd);
        $fields = this.getFields();
        $missingFields = php.array_keys(php.array_diff_key(php.array_flip($fields), $params));
        if ($missingFields) {
            throw new Error('Missing necessary params for MCO: ['+php.implode(', ', $missingFields)+']');
        }
        for ([$field, $start, $length] of Object.values(Fp.zip([$fields, $positions]))) {
            $token = $params[$field] || '';
            if (php.mb_strlen($token) > $length) {
                $token = php.mb_substr($token, 0, $length);
            }
            $cmd = this.overwriteStr($cmd, $token, $start);}
        return $cmd;
    }

    execute($params)  {
        let $cmd, $result;
        $cmd = this.constructor.makeCmd($params);
        $result = this.apollo($cmd);
        return {
            'success': StringUtil.startsWith($result, 'MCO ISSUED'),
            'response': $result,
        };
    }
}
module.exports = ApolloMakeMcoAction;
