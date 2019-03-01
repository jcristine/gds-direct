
// namespace Rbs\GdsAction;

const ApolloMakeMcoAction = require("../../../../../backend/Transpiled/Rbs/GdsAction/ApolloMakeMcoAction");

let php = require('../../../../../backend/Transpiled/php.js');

class ApolloMakeMcoActionTest extends require('../../../../../backend/Transpiled/Lib/TestCase.js')
{
    provideTestCases()  {
        let $list;
        $list = [];
        $list.push([
            {
                'mcoNumber': '4',

                // passed
                'passengerName': 'SHAWTAYLOR\/EVA I',
                'amount': '710.00',
                'amountCurrency': 'USD',

                // retrieved from DB
                'at': 'JOHANNESBURG',

                // retrieved from PNR
                'to': 'SA',
                'validatingCarrier': 'SA',
                'formOfPayment': 'VI4430000000070970\/OK',
                'expirationDate': '2019-04-01',
                'approvalCode': '741346',
            },
            php.implode('', [
                'HHMCU4.         *** MISC CHARGE ORDER ***                      ',
                ' PASSENGER NAME;SHAWTAYLOR\/EVA I........................        ',
                ' TO;SA...................................... AT;JOHANNESBURG... ',
                ' VALID FOR;SPLIT............................................... ',
                ' TOUR CODE;............... RELATED TKT NBR;.............        ',
                ' FOP;VI4430000000070970\/OK..................................... ',
                ' EXP DATE;0419 APVL CODE;741346 COMM;0.00\/... TAX;........-;..  ',
                ' AMOUNT;710.00..-;USD EQUIV ;........-;... BSR;..........       ',
                ' END BOX;...................................................... ',
                ' REMARK1;..............................................         ',
                ' REMARK2;...................................................... ',
                ' VALIDATING CARRIER;SA                  ISSUE NOW;Y',
            ])
        ]);
        return $list;
    }

    /**
     * @test
     * @dataProvider provideTestCases
     */
    testMakeCmd($params, $expectedOutput)  {
        let $actualCmd;
        $actualCmd = ApolloMakeMcoAction.makeCmd($params);
        this.assertEquals($expectedOutput, $actualCmd);
    }

	getTestMapping() {
		return [
			[this.provideTestCases, this.testMakeCmd],
		];
	}
}
module.exports = ApolloMakeMcoActionTest;
