
const GetCurrentPricingDumpAction = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Amadeus/GetCurrentPricingDumpAction.js');
const AnyGdsStubSession = require('../../../../../../../backend/Transpiled/Rbs/TestUtils/AnyGdsStubSession.js');

const php = require('../../../../php.js');

class GetCurrentPricingDumpActionTest extends require('../../../../Lib/TestCase.js') {
	provideTestCases() {
		let $list, $argumentTuples, $testCase;

		$list = [];

		// open first page of pricing, then show irrelevant screen,
		// action should return to pricing screen and scroll rest pages
		$list.push({
			'input': {
				'previousCommands': [
					{
						'cmd': 'FXA',
						'output': php.implode(php.PHP_EOL, [
							'FXA',
							'',
							'01 P1',
							'REBOOK TO CHANGE BOOKING CLASS AS SPECIFIED',
							'LAST TKT DTE 08SEP17/23:59 LT in POS - SEE ADV PURCHASE',
							'------------------------------------------------------------',
							'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
							' KIV',
							'XMOW SU  1845 T *  10DEC 0140  TVO             10DEC10DEC 1P',
							' RIX SU  2682 T *  10DEC 0925  TVO             10DEC10DEC 1P',
							'',
							'EUR   102.00      10DEC17KIV SU X/MOW SU RIX114.47TVO NUC',
							'USD   118.00      114.47END ROE0.891032',
							'USD    48.56YQ    XT USD 10.41MD USD 7.17WW USD 6.85RI USD',
							'USD     2.89JQ    6.85RI',
							'USD    31.28XT',
							'USD   200.73',
							'RATE USED 1EUR=1.156262USD',
							'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
							'FARE FAMILY:FC1:1-2:ES',
							'TICKET STOCK RESTRICTION',
							'                                                  PAGE  2/ 3',
							' ',
						]),
					},
					{
						'cmd': 'DO1,2',
						'output': php.implode(php.PHP_EOL, [
							'/$DO1,2',
							'*1A PLANNED FLIGHT INFO*              SU1845  136 SU 10DEC17    ',
							'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
							'KIV          0140  SU JCDIZO/D  Y/S       32A         2:55      ',
							'                      BMUKHLXQTEN/S                             ',
							'                      RGV/S                                     ',
							'SVO 0535  SU                                                2:55',
							'',
							'COMMENTS-',
							' 1.KIV SVO   - ARRIVES TERMINAL D                               ',
							' 2.KIV SVO   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
							' 3.KIV SVO   - Z999                                             ',
							' 4.KIV SVO   -  CO2/PAX* 120.74 KG ECO, 120.74 KG PRE           ',
							' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
							'',
							'CONFIGURATION-',
							'               32A  NO CONFIGURATION SET                        ',
							'*1A PLANNED FLIGHT INFO*              SU2682  136 SU 10DEC17    ',
							'APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL  ',
							'SVO          0925  SU JCDIZOYBMUK/S       320         1:40      ',
							'                      HLXQTENRGV/S                              ',
							'RIX 1005  SU                                                1:40',
							'',
							') ',
						]),
					},
					{
						'cmd': 'MDR',
						'output': php.implode(php.PHP_EOL, [
							'/$COMMENTS-',
							' 1.SVO RIX   - DEPARTS TERMINAL D                               ',
							' 2.SVO RIX   -  ET/ ELECTRONIC TKT CANDIDATE                    ',
							' 3.SVO RIX   - Z999                                             ',
							' 4.SVO RIX   -  CO2/PAX* 123.01 KG ECO, 123.01 KG PRE           ',
							' (*):SOURCE:ICAO CARBON EMISSIONS CALCULATOR                    ',
							'',
							'CONFIGURATION-',
							'               320  NO CONFIGURATION SET                        ',
							' ',
						]),
					},
				],
			},
			'output': {
				'cmd': 'FXA',
				'output': php.implode(php.PHP_EOL, [
					'FXA',
					'',
					'01 P1',
					'REBOOK TO CHANGE BOOKING CLASS AS SPECIFIED',
					'LAST TKT DTE 08SEP17/23:59 LT in POS - SEE ADV PURCHASE',
					'------------------------------------------------------------',
					'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
					' KIV',
					'XMOW SU  1845 T *  10DEC 0140  TVO             10DEC10DEC 1P',
					' RIX SU  2682 T *  10DEC 0925  TVO             10DEC10DEC 1P',
					'',
					'EUR   102.00      10DEC17KIV SU X/MOW SU RIX114.47TVO NUC',
					'USD   118.00      114.47END ROE0.891032',
					'USD    48.56YQ    XT USD 10.41MD USD 7.17WW USD 6.85RI USD',
					'USD     2.89JQ    6.85RI',
					'USD    31.28XT',
					'USD   200.73',
					'RATE USED 1EUR=1.156262USD',
					'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
					'FARE FAMILY:FC1:1-2:ES',
					'TICKET STOCK RESTRICTION',
					'BG CXR: 2*SU',
					'PRICED WITH VALIDATING CARRIER SU - REPRICE IF DIFFERENT VC',
					'TICKETS ARE NON-REFUNDABLE',
					'ENDOS NONREF/HEBO3BPATEH',
					'27JUL17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
				]),
			},
			'calledCommands': [
				{
					'cmd': 'MBFXA',
					'output': php.implode(php.PHP_EOL, [
						'BG CXR: 2*SU',
						'PRICED WITH VALIDATING CARRIER SU - REPRICE IF DIFFERENT VC',
						'TICKETS ARE NON-REFUNDABLE',
						'ENDOS NONREF/HEBO3BPATEH',
						'27JUL17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
						'                                                  PAGE  3/ 3',
						' ',
					]),
				},
			],
		});

		// all pricing was fetched with an >RT; call between pages
		// no calls to gds should be performed nevertheless
		$list.push({
			'input': {
				'previousCommands': [
					{
						'cmd': 'FXX',
						'output': php.implode(php.PHP_EOL, [
							'FXX',
							'',
							'01 P1',
							'',
							'LAST TKT DTE 10DEC17 - DATE OF ORIGIN',
							'------------------------------------------------------------',
							'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
							' MOW',
							' NYC SU   100 Y    10DEC 1010  YVOA            10DEC10DEC 1P',
							'',
							'EUR  2430.00      10DEC17MOW SU NYC2727.17YVOA NUC2727.17END',
							'USD  2810.00      ROE0.891032',
							'USD   107.53YQ    XT USD 18.00US USD 3.96XA USD 7.00XY USD',
							'USD     5.50YC    6.85RI',
							'USD    35.81XT',
							'USD  2958.84',
							'RATE USED 1EUR=1.156262USD',
							'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
							'FARE FAMILY:FC1:1:ES',
							'FXU/TS TO UPSELL EC FOR -2683.00USD',
							'TICKET STOCK RESTRICTION',
							'                                                  PAGE  2/ 3',
							' ',
						]),
					},
					{
						'cmd': 'RT',
						'output': php.implode(php.PHP_EOL, [
							'/$--- SFP ---',
							'RP/SFO1S2195/',
							'  1  SU 100 Y 10DEC 7 SVOJFK DK1  1010A1225P 10DEC  E  0 77W LL',
							'     SEE RTSVC',
							'  2 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							'       GGAMAUSHAZ/S1',
							' ',
						]),
					},
					{
						'cmd': 'MBFXP',
						'output': php.implode(php.PHP_EOL, [
							'BG CXR: SU',
							'PRICED WITH VALIDATING CARRIER SU - REPRICE IF DIFFERENT VC',
							'TICKETS ARE NON-REFUNDABLE',
							'ENDOS NONREF/HEBO3BPATEH -BG:SU',
							'27JUL17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
							'                                                  PAGE  3/ 3',
							' ',
						]),
					},
				],
			},
			'output': {
				'cmd': 'FXX',
				'output': php.implode(php.PHP_EOL, [
					'FXX',
					'',
					'01 P1',
					'',
					'LAST TKT DTE 10DEC17 - DATE OF ORIGIN',
					'------------------------------------------------------------',
					'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
					' MOW',
					' NYC SU   100 Y    10DEC 1010  YVOA            10DEC10DEC 1P',
					'',
					'EUR  2430.00      10DEC17MOW SU NYC2727.17YVOA NUC2727.17END',
					'USD  2810.00      ROE0.891032',
					'USD   107.53YQ    XT USD 18.00US USD 3.96XA USD 7.00XY USD',
					'USD     5.50YC    6.85RI',
					'USD    35.81XT',
					'USD  2958.84',
					'RATE USED 1EUR=1.156262USD',
					'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
					'FARE FAMILY:FC1:1:ES',
					'FXU/TS TO UPSELL EC FOR -2683.00USD',
					'TICKET STOCK RESTRICTION',
					'BG CXR: SU',
					'PRICED WITH VALIDATING CARRIER SU - REPRICE IF DIFFERENT VC',
					'TICKETS ARE NON-REFUNDABLE',
					'ENDOS NONREF/HEBO3BPATEH -BG:SU',
					'27JUL17 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
				]),
			},
			'calledCommands': [],
		});

		$argumentTuples = [];
		for ($testCase of Object.values($list)) {
			$argumentTuples.push([$testCase['input'], $testCase['output'], $testCase['calledCommands']]);
		}

		return $argumentTuples;
	}

	/**
	 * @test
	 * @dataProvider provideTestCases
	 * @param $input = AmadeusBuildItineraryActionTest::provideTestCases()[0][0]
	 */
	async testAction($input, $expectedOutput, $calledCommands) {
		let $actual;

		$actual = await (new GetCurrentPricingDumpAction())
			.setSession(new AnyGdsStubSession($calledCommands))
			.execute($input['previousCommands']);

		this.assertArrayElementsSubset($expectedOutput, $actual);
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testAction],
		];
	}
}

GetCurrentPricingDumpActionTest.count = 0;
module.exports = GetCurrentPricingDumpActionTest;
