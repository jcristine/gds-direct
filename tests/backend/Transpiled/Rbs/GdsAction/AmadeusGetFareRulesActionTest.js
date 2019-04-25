// namespace Rbs\GdsAction;

const StubLocationGeographyProvider = require('../../../../../backend/Transpiled/Rbs/DataProviders/StubLocationGeographyProvider.js');
const AnyGdsStubSession = require('../../Rbs/TestUtils/AnyGdsStubSession.js');
const php = require('../../php.js');
const AmadeusGetFareRulesAction = require('../../../../../backend/Transpiled/Rbs/GdsAction/AmadeusGetFareRulesAction.js');

class AmadeusGetFareRulesActionTest extends require('../../Lib/TestCase.js') {
	provideTestCases() {
		let $list, $argumentTuples, $testCase;

		$list = [];

		$list.push({
			'input': {
				'ptcNum': 1,
				'sections': [6, 7, 16],
				'itinerary': [
					{'segmentNumber': 1, 'departureAirport': 'KIV', 'destinationAirport': 'KBP'},
					{'segmentNumber': 2, 'departureAirport': 'KBP', 'destinationAirport': 'RIX'},
					{'segmentNumber': 3, 'departureAirport': 'RIX', 'destinationAirport': 'SVO'},
					{'segmentNumber': 4, 'departureAirport': 'SVO', 'destinationAirport': 'NRT'},
				],
			},
			'output': {
				'fareList': [
					{
						'componentNumber': '1',
						'departureAirport': 'KIV',
						'destinationAirport': 'RIX',
						'segmentNumbers': [1, 2],
						'ruleRecords': [
							{
								'sectionNumber': 7,
								'parsed': null,
							},
							{
								'sectionNumber': 16,
								'sectionName': 'PENALTIES',
								'parsed': null,
							},
						],
					},
					{
						'componentNumber': '2',
						'departureAirport': 'RIX',
						'destinationAirport': 'NRT',
						'segmentNumbers': [3, 4],
						'ruleRecords': [
							{
								'sectionNumber': 6,
								'sectionName': 'MIN STAY',
								'parsed': null,
								'raw': '  NONE UNLESS OTHERWISE SPECIFIED',
							},
							{
								'sectionNumber': 16,
								'sectionName': 'PENALTIES',
								'parsed': null,
							},
						],
					},
				],
			},
			'calledCommands': [
				{
					'cmd': 'FQN1*6,7,16',
					'output': php.implode(php.PHP_EOL, [
						'FQN1*6,7,16',
						'',
						'1 - PTC 1/6-6 ADT',
						' FQN 1-1    ADT KIVRIX SU  YFO               FF : EF',
						' FQN 1-2    ADT RIXTYO LO  Y1RED',
						'                                                  PAGE  1/ 1',
						' ',
					]),
				},
				{
					'cmd': 'FQN1-1*6,7,16',
					'output': php.implode(php.PHP_EOL, [
						'FQN1-1*6,7,16',
						'',
						' 1 - PTC 1/6-6 ADT                                 RULES DISPLAY',
						'FARE COMPONENT  1    ADT KIVRIX SU  YFO',
						'FCL: YFO       TRF:  21 RULE: EF01 BK:  Y',
						'PTC: ADT-ADULT              FTC: EU -ECONOMY UNRESTRICTED',
						'FARE FAMILY            : EF',
						'MX.MAX STAY',
						'FOR YFO TYPE FARES',
						'',
						'  TRAVEL FROM LAST STOPOVER MUST COMMENCE NO LATER THAN 365',
						'  DAYS AFTER DEPARTURE FROM FARE ORIGIN.',
						'',
						'PE.PENALTIES',
						'FOR ECONOMY UNRESTRICTED FARES',
						'',
						'',
						'         NOTE -',
						'          // CANCELLATION PROVISIONS //',
						'          ---',
						'          CHARGE APPLY PER TRANSACTIONS.',
						'                                                  PAGE  1/ 4',
						' ',
					]),
				},
				{
					'cmd': 'MD',
					'output': php.implode(php.PHP_EOL, [
						'          CHILD DISCOUNT DOES NOT APPLY.',
						'          INFANT WITHOUT A SEAT FREE OF CHARGE.',
						'          ---',
						'          ONLY FARE IN SAME BRAND CAN BE USED FOR REFUND',
						'          PROCEDURE OF PARTLY USED TICKET.',
						'          FARES DIVIDED INTO BRANDS BY FOLLOWING -',
						'          PROMO - FARES WITH PREFIX -SX/-SO',
						'          BUDGET/SAVER - FARES WITH PREFIX -VU/-VO',
						'          OPTIMUM/CLASSIC - FARES WITH PREFIX -CL/-CO',
						'          PREMIUM/FLEX - FARES WITH PREFIX -FM/-FO',
						'          //',
						'          WHEN COMBINING ON A HALF ROUNDTRIP BASIS THE',
						'          MOST RESTRICTIVE CANCELLATION CONDITION APPLIES',
						'          FOR THE ENTIRE PRICING UNIT.',
						'          ---',
						'          PENALTIES WAIVED IN CASE OF INVOLUNTARY REFUND.',
						'          CONTACT CARRIER FOR DETAILS.',
						'          ---',
						'          REFUND OF UNUSED FEES AND TAXES PERMITTED DURING',
						'          TICKET VALIDITY PERIOD.',
						'          ---',
						'                                                  PAGE  2/ 4',
						' ',
					]),
				},
				{
					'cmd': 'MD',
					'output': php.implode(php.PHP_EOL, [
						'          PAPER TICKET SURCHARGE IS NOT REFUNDABLE WHEN',
						'          APPLIED.',
						'          ---',
						'          IN CASE OF CANCELLATION AFTER DEPARTURE REFUND',
						'          THE DIFFERENCE BETWEEN THE FARE PAID AND THE',
						'          APPLICABLE FARE FLOWN.',
						'          WHEN REPRICING FARES FOR FLOWN ITINERARY FARES IN',
						'          LOWER RBD THAN SHOWN IN USED COUPONS CANNOT APPLY.',
						'          ---',
						'          REFUND CAN ONLY BE MADE THROUGH ISSUING OFFICE.',
						'          ---',
						'          // CHANGES PROVISIONS //',
						'          ---',
						'          CHARGE APPLY PER TRANSACTION.',
						'          CHILD DISCOUNT APPLY.',
						'          INFANT WITHOUT A SEAT FREE OF CHARGE.',
						'          CHANGE PERMITTED ONLY WITHIN SAME BRAND.',
						'          FARES DIVIDED INTO BRANDS BY FOLLOWING -',
						'          PROMO - FARES WITH PREFIX -SX/-SO',
						'          BUDGET/SAVER - FARES WITH PREFIX -VU/-VO',
						'          OPTIMUM/CLASSIC - FARES WITH PREFIX -CL/-CO',
						'                                                  PAGE  3/ 4',
						' ',
					]),
				},
				{
					'cmd': 'MD',
					'output': php.implode(php.PHP_EOL, [
						'          PREMIUM/FLEX - FARES WITH PREFIX -FM/-FO',
						'          //',
						'          ---',
						'          CHANGE IS A ROUTING/DATE/FLIGHT/BOOKING CLASS/FARE',
						'          MODIFICATION.',
						'          ---',
						'          RULES FOR CHANGES APPLY BY FARE',
						'          COMPONENT/DIRECTION.',
						'          IN CASE OF FARE COMBINATION CHARGE THE HIGHEST',
						'          FEE OF ALL CHANGED FARE COMPONENTS.',
						'          ---',
						'          NEW FARE AMOUNT SHOULD BE EQUAL OR HIGHER THAN',
						'          PREVIOUS AMOUNT.',
						'          ---',
						'          WHEN COMBINING NORMAL FARE WITH SPECIAL FARE ON A',
						'          HALF ROUNDTRIP BASIS NEW FARE AMOUNT SHOULD BE',
						'          EQUAL OR HIGHER THAN THE PREVIOUS AMOUNT.',
						'          FOR THE ITINERARIES WHERE JFM/JFO/WFM/WFO/YFM/YFO',
						'          FARES APPLIED TO THE ENTIRE ITINERARY',
						'          DOWNGRAIDING IS PERMITTED ONLY TO ABOVE MENTIONED',
						'          FARES.',
						'                                                  PAGE  4/ 4',
						' ',
					]),
				},
				{
					'cmd': 'FQN1-2*6,7,16',
					'output': php.implode(php.PHP_EOL, [
						'FQN1-2*6,7,16',
						'',
						' 1 - PTC 1/6-6 ADT                                 RULES DISPLAY',
						'FARE COMPONENT  2    ADT RIXTYO LO  Y1RED',
						'FCL: Y1RED     TRF:  44 RULE: JP05 BK:  Y',
						'PTC: ADT-ADULT              FTC: EU -ECONOMY UNRESTRICTED',
						'MN.MIN STAY',
						'  NONE UNLESS OTHERWISE SPECIFIED',
						'',
						'PE.PENALTIES',
						'',
						'  CANCELLATIONS',
						'',
						'    BEFORE DEPARTURE',
						'      CANCELLATIONS PERMITTED.',
						'',
						'    AFTER DEPARTURE',
						'      CANCELLATIONS PERMITTED.',
						'',
						'  CHANGES',
						'                                                  PAGE  1/ 3',
						' ',
					]),
				},
				{
					'cmd': 'MD',
					'output': php.implode(php.PHP_EOL, [
						'    CHANGES PERMITTED FOR REISSUE/REVALIDATION.',
						'         NOTE -',
						'          CHARGE APPLIES PER TRANSACTION.',
						'          ------------------------------------',
						'          REBOOKING/REISSUE IS A ROUTING/DATE/FARE BASIS/',
						'          FLIGHT MODIFICATION.',
						'          WHEN MORE THAN ONE FARE COMPONENTS IS BEING',
						'          CHANGED THE HIGHEST OF PENALTIES OF ALL CHANGED',
						'          FARE COMPONENTS WILL APPLY.',
						'          ------------------------------------',
						'          FARE CAN BE REISSUED TO OTHER INTERNATIONAL FARES',
						'          THAT ARE EQUAL OR HIGHER THAN THE ORIGINAL FARES.',
						'          ALL CONDITIONS OF THE NEW FARE MUST BE MET',
						'          AND PASSENGER PAYS THE DIFFERENCE IN FARE PLUS',
						'          CHANGE OF RESERVATION FEE IF ANY APPLIES.',
						'          -----------------------------',
						'          IN CASE OF FARE COMBINATIONS PENALTY APPLIES PER',
						'          FARE COMPONENT ACCORDING TO RESTRICTIONS OF',
						'          FARE USED FOR PORTION OF TRAVEL. WHEN MORE THAN',
						'          ONE FARE COMPONENTS IS BEING CHANGED THE HIGHEST',
						'          OF PENALTIES OF ALL CHANGED FARE COMPONENTS WILL',
						'                                                  PAGE  2/ 3',
						' ',
					]),
				},
				{
					'cmd': 'MD',
					'output': php.implode(php.PHP_EOL, [
						'          APPLY.',
						'          -------------------------------',
						'          CHANGE OF FARE BREAK POINT PERMITTED - TICKET MUST',
						'          BE EXCHANGED MANUALLY.',
						'          -------------------------------',
						'                // IN THE EVENT OF NO SHOW //',
						'            WHEN CHANGES ARE REQUESTED AFTER DEPARTURE',
						'            OF THE ORIGINALLY SCHEDULED FLIGHT',
						'          - WHOLE TICKET MUST BE RECALCULATED FROM THE POINT',
						'          OF ORIGIN AND FARE ON A FARE COMPONENT PASSENEGER',
						'          IS NO SHOW MUST BE UPGRADED TO ANY HIGHER -RED',
						'          OR -PMLO OR FULL BUSINESS INTERNATIONAL',
						'          FARES /EXCLUDING BOX AND BX FARE TYPE CODES/ AND',
						'          PASSENEGER PAYS THE DIFFERENCE IN FARES.',
						'          OR',
						'           - TICKET MUST BE REFUNDED - CANCELLATION RULES',
						'          APPLIES.',
						'                                                  PAGE  3/ 3',
						' ',
					]),
				},
			],
		});

		// single fare component
		$list.push({
			'input': {
				'ptcNum': 1,
				'sections': [6, 7, 16],
				'itinerary': [
					{'segmentNumber': 1, 'departureAirport': 'JFK', 'destinationAirport': 'LHR'},
					{'segmentNumber': 2, 'departureAirport': 'LHR', 'destinationAirport': 'DME'},
				],
			},
			'output': {
				'fareList': [
					{
						'componentNumber': '1',
						'departureAirport': 'JFK',
						'destinationAirport': 'DME',
						'segmentNumbers': [1, 2],
						'ruleRecords': [
							{
								'sectionNumber': 16,
								'sectionName': 'PENALTIES',
								'doesApply': true,
							},
						],
					},
				],
			},
			'calledCommands': [
				{
					'cmd': 'FQN1*6,7,16',
					'output': php.implode(php.PHP_EOL, [
						'FQN1*6,7,16',
						'',
						' 1 - PTC 1 ADT                                     RULES DISPLAY',
						'FARE COMPONENT  1    ADT NYCMOW BA  Y1US',
						'FCL: Y1US      TRF:   1 RULE: 2103 BK:  Y',
						'PTC: ADT-ADULT              FTC: EU -ECONOMY UNRESTRICTED',
						'PE.PENALTIES',
						'',
						'',
						'         NOTE -',
						'          NO PENALTIES UNLESS OTHERWISE SPECIFIED',
						'          REFUND WITHOUT PENALTY PERMITTED AT ANY TIME',
						'          UNLIMITED CHANGES WITHOUT PENALTY PERMITTED',
						'          AT ANY TIME.',
						'          -------------------------------------------------',
						'          A CHANGE IS A DATE/ FLIGHT/ ROUTING/  BOOKING',
						'          CODE CHANGE.',
						'          -------------------------------------------------',
						'          WHEN MORE THAN ONE FARE COMPONENT IS CHANGED',
						'          THE HIGHEST PENALTY OF ALL CHANGED FARE COMPONENTS',
						'          WITHIN THE JOURNEY APPLIES.',
						'                                                  PAGE  1/ 5',
						' ',
					]),
				},
				{
					'cmd': 'MD',
					'output': php.implode(php.PHP_EOL, [
						'          -------------------------------------------------',
						'          --- REPRICING CONDITIONS ---',
						'          A. BEFORE DEPARTURE OF JOURNEY',
						'          WHEN THE FIRST FARE COMPONENT IS CHANGED',
						'          THE ITINERARY MUST BE RE-PRICED USING CURRENT',
						'          FARES IN EFFECT ON THE DATE THE TICKET',
						'          IS REISSUED.',
						'          B. BEFORE DEPARTURE OF JOURNEY',
						'          WHEN CHANGES ARE TO BOOKING CODE ONLY IN THE FIRST',
						'          FARE COMPONENT AND RESULT IN A HIGHER FARE THE',
						'          ITINERARY MUST BE RE-PRICED USING HISTORICAL',
						'          FARES IN EFFECT ON THE PREVIOUS TICKETING DATE',
						'          OR USING CURRENT FARES IN EFFECT ON THE DATE',
						'          THE TICKET IS REISSUED - WHICHEVER IS LOWER.',
						'          C. BEFORE DEPARTURE OF JOURNEY',
						'          WHEN THERE ARE NO CHANGES TO THE FIRST FARE',
						'          COMPONENT BUT OTHER  FARE COMPONENTS ARE CHANGED',
						'          THE ITINERARY MUST BE RE-PRICED USING HISTORICAL',
						'          FARES  IN EFFECT ON THE PREVIOUS TICKETING DATE OR',
						'          USING CURRENT FARES IN EFFECT ON THE DATE THE',
						'          TICKET  IS REISSUED - WHICHEVER IS LOWER.',
						'                                                  PAGE  2/ 5',
						' ',
					]),
				},
				{
					'cmd': 'MD',
					'output': php.implode(php.PHP_EOL, [
						'          D. AFTER DEPARTURE OF JOURNEY',
						'          THE ITINERARY MUST BE RE-PRICED USING HISTORICAL',
						'          FARES IN EFFECT ON THE PREVIOUS TICKETING DATE.',
						'          --------------------------------------------------',
						'          NEW TICKET MAY BE LOWER - EQUAL OR HIGHER THAN',
						'          PREVIOUS AND MUST COMPLY WITH ALL PROVISIONS OF',
						'          THE NEW FARE BEING APPLIED.',
						'          --------------------------------------------------',
						'          WHEN THE ITINERARY RESULTS IN A HIGHER FARE THE',
						'          DIFFERENCE WILL BE COLLECTED.',
						'          ANY APPLICABLE CHANGE FEE STILL APPLIES.',
						'          --------------------------------------------------',
						'          WHEN THE NEW ITINERARY RESULTS IN A LOWER FARE THE',
						'          RESIDUAL AMOUNT WILL BE REFUNDED. ANY APPLICABLE',
						'          CHANGE FEE STILL APPLIES.',
						'          -------------------------------------------------',
						'          FARE COMPONENT IS FULLY REFUNDABLE.',
						'          -------------------------------------------------',
						'          REFUND PERMITTED WITHIN TICKET VALIDITY.',
						'          -------------------------------------------------',
						'          WHEN COMBINING NON-REFUNDABLE FARES WITH',
						'                                                  PAGE  3/ 5',
						' ',
					]),
				},
				{
					'cmd': 'MD',
					'output': php.implode(php.PHP_EOL, [
						'          REFUNDABLE FARES',
						'          1. THE AMOUNT PAID ON EACH REFUNDABLE FARE',
						'          COMPONENT IS REFUNDED',
						'          2. THE AMOUNT PAID ON EACH NON-REFUNDABLE FARE',
						'          COMPONENT WILL NOT BE REFUNDED.',
						'          3. WHEN COMBINING FARES CHARGE THE SUM OF THE',
						'          CANCELLATION FEES OF ALL CANCELLED FARE',
						'          COMPONENTS.',
						'          --------------------------------------------------',
						'          REFUND OF UNUSED TAXES FEES AND CHARGES PAID TO',
						'          THIRD PARTIES PERMITTED. ASSOCIATED CARRIER',
						'          IMPOSED CHARGES ARE REFUNDABLE.',
						'          --------------------------------------------------',
						'          ANY NON-REFUNDABLE AMOUNT FROM A PREVIOUS TICKET',
						'          REMAINS NON-REFUNDABLE FOLLOWING A CHANGE.',
						'          --------------------------------------------------',
						'          TICKET IS NOT TRANSFERABLE TO ANOTHER PERSON.',
						'          -------------------------------------------------',
						'          PARTIALLY USED TICKETS - REFUND THE DIFFERENCE -',
						'          IF ANY - BETWEEN THE FARE PAID AND THE FARE FOR',
						'          THE JOURNEY TRAVELLED.',
						'                                                  PAGE  4/ 5',
						' ',
					]),
				},
				{
					'cmd': 'MD',
					'output': php.implode(php.PHP_EOL, [
						'          ------ CANCELLATION REPRICING CONDITIONS-----',
						'          FLOWN COUPONS MUST BE REPRICED USING HISTORICAL',
						'          FARES IN EFFECT ON THE PREVIOUS TICKETING DATE',
						'          THE FARE FOR THE JOURNEY TRAVELLED MUST BE CAPPED',
						'          AT THE TOTAL FARE AMOUNT PLUS CARRIER IMPOSED',
						'          CHARGE PAID ON THE TICKET BEING PRESENTED FOR',
						'          REFUND',
						'          FULLY FLOWN FARE COMPONENTS MAY BE REPRICED USING',
						'          ANY BOOKING CODE WITHIN THE SAME CABIN PROVIDED',
						'          THE NEW FARE AMOUNT IS EQUAL OR HIGHER THAN',
						'          ORIGINAL',
						'          PARTIALLY FLOWN FARE COMPONENTS MUST BE REPRICED',
						'          USING THE SAME OR HIGHER BOOKING CODE.',
						'                                                  PAGE  5/ 5',
						' ',
					]),
				},
			],
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
	 * @param $input = AmadeusGetFareRulesActionTest::provideTestCases()[0][0]
	 */
	async testAction($input, $expectedOutput, $calledCommands) {
		let $actual;

		$actual = await (new AmadeusGetFareRulesAction())
			.setTzProvider(new StubLocationGeographyProvider([]))
			.setSession(new AnyGdsStubSession($calledCommands))
			.execute($input['ptcNum'], $input['sections'], $input['itinerary']);

		this.assertArrayElementsSubset($expectedOutput, $actual);
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testAction],
		];
	}
}

module.exports = AmadeusGetFareRulesActionTest;
