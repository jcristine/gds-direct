
// namespace Gds\Parsers\Apollo\Mco;

const AbstractMaskParser = require('../../../../Gds/Parsers/Apollo/AbstractMaskParser.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');

let php = require('../../../../php.js');

/**
 * parses output of >*MCO{lineNumber};
 * it is screen with detailed information on each MCO listed in >*MPD;
 *
 * it looks something like this:
 * '>HHMCU1           *** MISC CHARGE ORDER ***',
 * ' PASSENGER NAME;ARYA/PRASHANT...........................',
 * ' TO;SU.....................................+ AT;SVO............',
 * ' VALID FOR;SPLIT...............................................',
 * ' TOUR CODE;..............+ RELATED TKT NBR;.............',
 * ' FOP;VI4111111111111111/OK.....................................',
 * ' EXP DATE;0718 APVL CODE;755001 COMM;0.00/..+ TAX;........-;..',
 * ' AMOUNT;1106.26.-;USD EQUIV ;........-;..+ BSR;..........',
 * ' END BOX;......................................................',
 * ' REMARK1;..............................................',
 * ' REMARK2;......................................................',
 * ' VALIDATING CARRIER;SU                  ISSUE NOW;.',
 * '><',
 */
class McoMaskParser extends AbstractMaskParser
{
    static transformResult($fields)  {
        return {
            'passengerName': $fields['passengerName'],
            'to': $fields['to'],
            'at': $fields['at'],
            'validFor': $fields['validFor'],
            'tourCode': $fields['tourCode'],
            'ticketNumber': $fields['ticketNumber'],
            'formOfPayment': {'raw': $fields['formOfPayment']},
            'expirationMonth': ($fields['expirationDate'] || null) ? php.mb_substr($fields['expirationDate'], 0, 2) : null,
            'expirationYear': ($fields['expirationDate'] || null) ? php.mb_substr($fields['expirationDate'], 2, 2) : null,
            'approvalCode': $fields['approvalCode'],
            'commission': $fields['commission'],
            'taxAmount': $fields['taxAmount'],
            'taxCode': $fields['taxCode'],
            'baseFare': {
                'currency': $fields['amountCurrency'],
                'amount': $fields['amount'],
            },
            'fareEquivalent': ($fields['equivCurrency'] || $fields['equivAmount']) ? {
                'currency': $fields['equivCurrency'],
                'amount': $fields['equivAmount'],
            } : null,
            'rateOfExchange': $fields['bsr'],
            'endorsementBox': $fields['endorsementBox'],
            'remark1': $fields['remark1'],
            'remark2': $fields['remark2'],
            'validatingCarrier': $fields['validatingCarrier'],
            'issueNow': $fields['issueNow'] === 'Y',
        };
    }

    static parse($dump)  {
        let $mask, $fields;
        $mask = StringUtil.padLines(php.implode(php.PHP_EOL, [
            '>HHMCU..          *** MISC CHARGE ORDER ***                    ',
            ' PASSENGER NAME;........................................       ',
            ' TO;........................................ AT;...............',
            ' VALID FOR;....................................................',
            ' TOUR CODE;............... RELATED TKT NBR;.............       ',
            ' FOP;..........................................................',
            ' EXP DATE;.... APVL CODE;...... COMM;........ TAX;........-;.. ',
            ' AMOUNT;........-;... EQUIV ;........-;... BSR;..........      ',
            ' END BOX;......................................................',
            ' REMARK1;..............................................        ',
            ' REMARK2;......................................................',
            ' VALIDATING CARRIER;..                  ISSUE NOW;.            ',
        ]), 63, ' ');
        $fields = [
            'mcoNumber',
            'passengerName',
            'to', 'at',
            'validFor',
            'tourCode', 'ticketNumber',
            'formOfPayment',
            'expirationDate', 'approvalCode', 'commission', 'taxAmount', 'taxCode',
            'amount', 'amountCurrency', 'equivAmount', 'equivCurrency', 'bsr',
            'endorsementBox',
            'remark1',
            'remark2',
            'validatingCarrier', 'issueNow',
        ];
        $dump = StringUtil.padLines($dump, 63, ' ');
        let error = this.checkDumpMatchesMask($dump, $mask);
        if (error) {
            return {'error': 'Bad MCO mask output: ' + error + php.PHP_EOL + $dump+php.PHP_EOL};
        }
        return this.transformResult(this.parseMask($mask, $fields, $dump));
    }
}
module.exports = McoMaskParser;
