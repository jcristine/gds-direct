
// namespace Rbs\GdsAction;

const ApolloMakeMcoAction = require("../../../../../backend/Transpiled/Rbs/GdsAction/ApolloMakeMcoAction");

let php = require('../../../../../backend/Transpiled/phpDeprecated.js');
const GdsActionTestUtil = require("../../../../../backend/Transpiled/Rbs/TestUtils/GdsActionTestUtil");

class ApolloMakeMcoActionTest extends require('../../../../../backend/Transpiled/Lib/TestCase.js')
{
    provideMakeCmdTestCases()  {
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
                ' PASSENGER NAME;SHAWTAYLOR/EVA I........................        ',
                ' TO;SA...................................... AT;JOHANNESBURG... ',
                ' VALID FOR;SPLIT............................................... ',
                ' TOUR CODE;............... RELATED TKT NBR;.............        ',
                ' FOP;VI4430000000070970/OK..................................... ',
                ' EXP DATE;0419 APVL CODE;741346 COMM;0.00/... TAX;........-;..  ',
                ' AMOUNT;710.00..-;USD EQUIV ;........-;... BSR;..........       ',
                ' END BOX;...................................................... ',
                ' REMARK1;..............................................         ',
                ' REMARK2;...................................................... ',
                ' VALIDATING CARRIER;SA                  ISSUE NOW;Y',
            ]),
        ]);
        return $list;
    }

    provideExecuteTestCases() {
        let testCases = [];

        // STORED example
        testCases.push({
            input: {
                mcoNumber: 1,
                passengerName: "LIB/MAR",
                to: "LO",
                at: "WAW",
                validFor: "SPLIT",
                tourCode: "",
                ticketNumber: "",
                formOfPayment: "VIXXXXXXXXXXXX1111/OK",
                expirationDate: "2022-03-01",
                approvalCode: "12345Z",
                commission: "0.00/",
                taxAmount: "",
                taxCode: "",
                amount: "1.00",
                amountCurrency: "USD",
                equivAmount: "",
                equivCurrency: "",
                rateOfExchange: "",
                endorsementBox: "",
                remark1: "",
                remark2: "",
                validatingCarrier: "LO",
                issueNow: "n",
            },
            output: {
                success: true,
                response: "MCO DATA STORED \n",
            },
            calledCommands: [
                {
                    "cmd": [
                        "HHMCU1.         *** MISC CHARGE ORDER ***                      ",
                        " PASSENGER NAME;LIB/MAR.................................        ",
                        " TO;LO...................................... AT;WAW............ ",
                        " VALID FOR;SPLIT............................................... ",
                        " TOUR CODE;............... RELATED TKT NBR;.............        ",
                        " FOP;VIXXXXXXXXXXXX1111/OK..................................... ",
                        " EXP DATE;0322 APVL CODE;12345Z COMM;0.00/... TAX;........-;..  ",
                        " AMOUNT;1.00....-;USD EQUIV ;........-;... BSR;..........       ",
                        " END BOX;...................................................... ",
                        " REMARK1;..............................................         ",
                        " REMARK2;...................................................... ",
                        " VALIDATING CARRIER;LO                  ISSUE NOW;N",
                    ].join(''),
                    "output": "MCO DATA STORED \n><",
                    "duration": "0.211568601",
                },
            ],
        });

        // MCO ISSUED example
        testCases.push({
            input: {
                mcoNumber: 1,                             taxCode: "",
                passengerName: "LIB/MAR",                 amount: "3.00",
                to: "LO",                                 amountCurrency: "USD",
                at: "WAW",                                equivAmount: "",
                validFor: "SPLIT",                        equivCurrency: "",
                tourCode: "",                             rateOfExchange: "",
                ticketNumber: "",                         endorsementBox: "",
                formOfPayment: "VI4111111111111111/OK",   remark1: "",
                expirationDate: "2022-03-01",             remark2: "",
                approvalCode: "12345Z",                   validatingCarrier: "LO",
                commission: "0.00/",                      issueNow: "Y",
                taxAmount: "",
            },
            output: {
                success: true,
                response: [
                    "MCO ISSUED TTL FARE  USD     3.00",
                    "ITIN/INVOICE ISSUED",
                    "TAB AND ENTER TO REDISPLAY PNR >*LCF9T0;",
                    "",
                ].join("\n"),
            },
            calledCommands: [
                {
                    "cmd": "HHMCU1.         *** MISC CHARGE ORDER ***                       PASSENGER NAME;LIB/MAR.................................         TO;LO...................................... AT;WAW............  VALID FOR;SPLIT...............................................  TOUR CODE;............... RELATED TKT NBR;.............         FOP;VI4111111111111111/OK.....................................  EXP DATE;0322 APVL CODE;12345Z COMM;0.00/... TAX;........-;..   AMOUNT;3.00....-;USD EQUIV ;........-;... BSR;..........        END BOX;......................................................  REMARK1;..............................................          REMARK2;......................................................  VALIDATING CARRIER;LO                  ISSUE NOW;Y",
                    "output": [
                        "MCO ISSUED TTL FARE  USD     3.00",
                        "ITIN/INVOICE ISSUED",
                        "TAB AND ENTER TO REDISPLAY PNR >*LCF9T0;",
                        "><",
                    ].join("\n"),
                    "duration": "0.256330192",
                },
            ],
        });

        return testCases.map(t => [t]); // arg tuple list
    }

    /**
     * @test
     * @dataProvider provideTestCases
     */
    async testMakeCmd($params, $expectedOutput)  {
        let $actualCmd;
        $actualCmd = await ApolloMakeMcoAction.makeCmd($params);
        this.assertEquals($expectedOutput, $actualCmd);
    }

    async testExecute(testCase) {
        await GdsActionTestUtil.testGdsAction(this, testCase, (session, input) =>
            (new ApolloMakeMcoAction()).setSession(session).execute(input));
    }

	getTestMapping() {
		return [
			[this.provideMakeCmdTestCases, this.testMakeCmd],
			[this.provideExecuteTestCases, this.testExecute],
		];
	}
}
module.exports = ApolloMakeMcoActionTest;
