const GdsActionTestUtil = require("../../../backend/Utils/Testing/GdsActionTestUtil");
const SubmitTaxBreakdownMask = require('../../../backend/Actions/ManualPricing/SubmitTaxBreakdownMask.js');

class SubmitTaxBreakdownMaskTest extends require('../Transpiled/Lib/TestCase.js')
{
	provideTestCases() {
		let testCases = [];

		testCases.push({
			title: 'ZP tax example resulting in a separate screen',
			input: {
				"fields": [
					{"key":"netPrice","value":"","enabled":true},
					{"key":"rateOfExchange","value":"","enabled":true},
					{"key":"tax1_amount","value":"5.60","enabled":true},
					{"key":"tax1_code","value":"AY","enabled":true},
					{"key":"tax2_amount","value":"27.77","enabled":true},
					{"key":"tax2_code","value":"US","enabled":true},
					{"key":"tax3_amount","value":"4.50","enabled":true},
					{"key":"tax3_code","value":"XF","enabled":true},
					{"key":"tax4_amount","value":"4.10","enabled":true},
					{"key":"tax4_code","value":"ZP","enabled":true},
					{"key":"tax5_amount","value":"","enabled":true},
					{"key":"tax5_code","value":"","enabled":true},
					{"key":"tax6_amount","value":"","enabled":true},
					{"key":"tax6_code","value":"","enabled":true},
					{"key":"tax7_amount","value":"","enabled":true},
					{"key":"tax7_code","value":"","enabled":true},
					{"key":"tax8_amount","value":"","enabled":true},
					{"key":"tax8_code","value":"","enabled":true},
					{"key":"tax9_amount","value":"","enabled":true},
					{"key":"tax9_code","value":"","enabled":true},
					{"key":"tax10_amount","value":"","enabled":true},
					{"key":"tax10_code","value":"","enabled":true},
					{"key":"tax11_amount","value":"","enabled":true},
					{"key":"tax11_code","value":"","enabled":true},
					{"key":"tax12_amount","value":"","enabled":true},
					{"key":"tax12_code","value":"","enabled":true},
					{"key":"tax13_amount","value":"","enabled":true},
					{"key":"tax13_code","value":"","enabled":true},
					{"key":"tax14_amount","value":"","enabled":true},
					{"key":"tax14_code","value":"","enabled":true},
					{"key":"tax15_amount","value":"","enabled":true},
					{"key":"tax15_code","value":"","enabled":true},
					{"key":"tax16_amount","value":"","enabled":true},
					{"key":"tax16_code","value":"","enabled":true},
					{"key":"tax17_amount","value":"","enabled":true},
					{"key":"tax17_code","value":"","enabled":true},
					{"key":"tax18_amount","value":"","enabled":true},
					{"key":"tax18_code","value":"","enabled":true},
					{"key":"tax19_amount","value":"","enabled":true},
					{"key":"tax19_code","value":"","enabled":true},
					{"key":"tax20_amount","value":"","enabled":true},
					{"key":"tax20_code","value":"","enabled":true},
					{"key":"facilityCharge1_airport","value":"SFO","enabled":true},
					{"key":"facilityCharge1_amount","value":"4.50","enabled":true},
					{"key":"facilityCharge2_airport","value":"","enabled":true},
					{"key":"facilityCharge2_amount","value":"","enabled":true},
					{"key":"facilityCharge3_airport","value":"","enabled":true},
					{"key":"facilityCharge3_amount","value":"","enabled":true},
					{"key":"facilityCharge4_airport","value":"","enabled":true},
					{"key":"facilityCharge4_amount","value":"","enabled":true}
				],
				"maskOutput": [
					">$TA                TAX BREAKDOWN SCREEN                       ",
					" FARE  USD  370.23 TTL USD ;........          ROE ;............",
					"T1 ;........;.. T2 ;........;.. T3 ;........;.. T4 ;........;..",
					"T5 ;........;.. T6 ;........;.. T7 ;........;.. T8 ;........;..",
					"T9 ;........;.. T10;........;.. T11;........;.. T12;........;..",
					"T13;........;.. T14;........;.. T15;........;.. T16;........;..",
					"T17;........;.. T18;........;.. T19;........;.. T20;........;..",
					"                                                               ",
					" U.S. PSGR FACILITY CHARGES                                    ",
					" AIRPORT 1 ;...  AMT ;.....   AIRPORT 2 ;...  AMT ;.....       ",
					" AIRPORT 3 ;...  AMT ;.....   AIRPORT 4 ;...  AMT ;.....       ",
					""
				].join("\n"),
			},
			output: {
				calledCommands: [
					{cmd: '$TA...'},
				],
				actions: [
					{
						type: 'displayZpTaxBreakdownMask',
					},
				],
			},
			calledCommands: [
				{
					"cmd": "$TA                TAX BREAKDOWN SCREEN                         FARE  USD  370.23 TTL USD ;........          ROE ;............ T1 ;5.60....;AY T2 ;27.77...;US T3 ;4.50....;XF T4 ;4.10....;ZP T5 ;........;.. T6 ;........;.. T7 ;........;.. T8 ;........;.. T9 ;........;.. T10;........;.. T11;........;.. T12;........;.. T13;........;.. T14;........;.. T15;........;.. T16;........;.. T17;........;.. T18;........;.. T19;........;.. T20;........;..                                                                  U.S. PSGR FACILITY CHARGES                                      AIRPORT 1 ;SFO  AMT ;4.50.   AIRPORT 2 ;...  AMT ;.....         AIRPORT 3 ;...  AMT ;.....   AIRPORT 4 ;...  AMT ;.....",
					"output": [
						">$ZP U.S. FLIGHT SEGMENT TAX BREAKDOWN SCREEN                  ",
						"                                                               ",
						"  TOTAL USD     4.10 ZP                                        ",
						"                                                               ",
						"  ARPT01;...;.....  ARPT02;...;.....  ARPT03;...;.....         ",
						"  ARPT04;...;.....  ARPT05;...;.....  ARPT06;...;.....         ",
						"  ARPT07;...;.....  ARPT08;...;.....  ARPT09;...;.....         ",
						"  ARPT10;...;.....  ARPT11;...;.....  ARPT12;...;.....         ",
						"  ARPT13;...;.....  ARPT14;...;.....  ARPT15;...;.....         ",
						"  ARPT16;...;.....  ARPT17;...;.....  ARPT18;...;.....         ",
						"  ARPT19;...;.....  ARPT20;...;.....                           ",
						"><"
					].join("\n"),
				},
			],
		});

		return testCases.map(c => [c]);
	}

	async testAction(testCase) {
		await GdsActionTestUtil.testGdsAction(this, testCase, (gdsSession, input) =>
			SubmitTaxBreakdownMask({rqBody: input, gdsSession}));
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testAction],
		];
	}
}

module.exports = SubmitTaxBreakdownMaskTest;