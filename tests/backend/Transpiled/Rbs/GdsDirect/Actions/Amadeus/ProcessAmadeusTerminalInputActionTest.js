// namespace Rbs\GdsDirect\Actions\Amadeus;

const Agent = require('../../../../../../../backend/DataFormats/Wrappers/Agent.js');
const ProcessAmadeusTerminalInputAction = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Amadeus/RunCmdRq.js');
const GdsDirectDefaults = require('../../../../Rbs/TestUtils/GdsDirectDefaults.js');
const php = require('../../../../php.js');

class ProcessAmadeusTerminalInputActionTest extends require('../../../../Lib/TestCase.js') {
	provideTestForgeAreasDumpCases() {
		let $list;

		$list = [];

		$list.push({
			'sessionData': {
				'area': 'C',
				'pcc': 'SFO1S2195',
			},
			'areas': [
				{
					'id': '225',
					'session_id': '148',
					'area': 'A',
					'pcc': 'SFO1S2195',
					'recordLocator': '',
					'dt': '2017-11-02 15:00:27',
					'isPnrStored': false,
					'internal_token': 'b072a036-495f-4556-aedf-473d107d18cc',
					'hasPnr': false,
				},
				{
					'id': '227',
					'session_id': '148',
					'area': 'C',
					'pcc': 'SFO1S2195',
					'recordLocator': '',
					'dt': '2017-11-02 15:01:30',
					'isPnrStored': false,
					'internal_token': '87138ec6-b573-4223-9864-c8bcf140e09a',
					'hasPnr': '1',
				},
				{
					'id': '226',
					'session_id': '148',
					'area': 'D',
					'pcc': 'SFO1S2195',
					'recordLocator': 'JBTUEN',
					'dt': '2017-11-02 15:01:07',
					'isPnrStored': true,
					'internal_token': 'f0377dad-08ac-4be6-9870-97d719d0a444',
					'hasPnr': '1',
				},
			],
			'dump': php.implode(php.PHP_EOL, [
				'00000000         SFO1S2195',
				'',
				'AREA  TM  MOD SG/DT.LG TIME      ACT.Q   STATUS     NAME',
				'A         PRD WS/SU.EN  24             SIGNED',
				'B                                      NOT SIGNED',
				'C-IN      PRD WS/SU.EN  24             PNR CREATE',
				'D         PRD WS/SU.EN  24             PNR MODIFY',
			]),
		});

		$list.push({
			'sessionData': {
				'area': 'A',
				'pcc': 'SFO1S2195',
			},
			'areas': [
				{
					'id': '229',
					'session_id': '150',
					'area': 'A',
					'pcc': 'SFO1S2195',
					'recordLocator': '',
					'dt': '2017-11-02 15:05:07',
					'isPnrStored': false,
					'internal_token': 'b02241bc-a0a6-4082-9a3a-c20deb85a65f',
					'hasPnr': false,
				},
			],
			'dump': php.implode(php.PHP_EOL, [
				'00000000         SFO1S2195',
				'',
				'AREA  TM  MOD SG/DT.LG TIME      ACT.Q   STATUS     NAME',
				'A-IN      PRD WS/SU.EN  24             SIGNED',
				'B                                      NOT SIGNED',
				'C                                      NOT SIGNED',
				'D                                      NOT SIGNED',
			]),
		});

		return $list.map(r => [r.sessionData, r.areas, r.dump]);
	}

	provideExecuteTestCases() {
		let $list, $agentBaseData, $argumentTuples, $testCase;

		$list = [];

		// >+{seatAmount}; successful example without marriages, specific segments
		// based on itinerary of >RTS2IJBM;
		$list.push({
			'input': {
				'cmdRequested': '+2S4-5',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'sessionData': {'hasPnr': true},
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
					'area': 'B', 'pcc': 'NYC1S2186', 'hasPnr': true,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'RTAM',
						'output': php.implode(php.PHP_EOL, [
							'/$RP/NYC1S2186/',
							'  4  CI 003 N 08FEB 4 SFOTPE HK1        I  1205A 555A+1 *1A/E*',
							'  5  CI 701 N 09FEB 5 TPEMNL HK1        1   735A 940A   *1A/E*',
							'  6  CI 704 L 22FEB 4 MNLTPE HK1        1   455P 655P   *1A/E*',
							'  7  CI 004 L 22FEB 4 TPESFO HK1        2  1140P 640P   *1A/E*',
							' ',
						]),
					},
					{
						'cmd': 'XE4-5',
						'output': php.implode(php.PHP_EOL, [
							'/$                        ***  NHP  ***',
							'RP/NYC1S2186/',
							'  1.LIBERMANE/LEPIN   2.LIBERMANE/MARINA   3.LIBERMANE/ZIMICH',
							'  4  CI 704 L 22FEB 4 MNLTPE DK1   455P 655P 22FEB  E  0 333 M',
							'     SEE RTSVC',
							'  5  CI 004 L 22FEB 4 TPESFO DK1  1140P 640P 22FEB  E  0 77W M',
							'     SEE RTSVC',
							'  6 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							'       GGAMAUSHAZ/S5',
							' ',
						]),
					},
					{
						'cmd': 'SSCI003Y08FEBSFOTPE2',
						'output': php.implode(php.PHP_EOL, [
							'/$                        ***  NHP  ***',
							'RP/NYC1S2186/',
							'  1.LIBERMANE/LEPIN   2.LIBERMANE/MARINA   3.LIBERMANE/ZIMICH',
							'  4  CI 003 Y 08FEB 4 SFOTPE DK2  1205A 555A 09FEB  E  0 77W M',
							'     SEE RTSVC',
							'  5  CI 704 L 22FEB 4 MNLTPE DK1   455P 655P 22FEB  E  0 333 M',
							'     SEE RTSVC',
							'  6  CI 004 L 22FEB 4 TPESFO DK1  1140P 640P 22FEB  E  0 77W M',
							'     SEE RTSVC',
							'  7 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							'       GGAMAUSHAZ/S4,6',
							' ',
						]),
					},
					{
						'cmd': 'SSCI701Y09FEBTPEMNL2',
						'output': php.implode(php.PHP_EOL, [
							'/$                        ***  NHP  ***',
							'RP/NYC1S2186/',
							'  1.LIBERMANE/LEPIN   2.LIBERMANE/MARINA   3.LIBERMANE/ZIMICH',
							'  4  CI 003 Y 08FEB 4 SFOTPE DK2  1205A 555A 09FEB  E  0 77W M',
							'     SEE RTSVC',
							'  5  CI 701 Y 09FEB 5 TPEMNL DK2   735A 940A 09FEB  E  0 333 M',
							'     SEE RTSVC',
							'  6  CI 704 L 22FEB 4 MNLTPE DK1   455P 655P 22FEB  E  0 333 M',
							'     SEE RTSVC',
							'  7  CI 004 L 22FEB 4 TPESFO DK1  1140P 640P 22FEB  E  0 77W M',
							'     SEE RTSVC',
							'  8 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							'       GGAMAUSHAZ/S4,7',
							' ',
						]),
					},
					{
						'cmd': 'SBN4',
						'output': php.implode(php.PHP_EOL, [
							'/$                        ***  NHP  ***',
							'RP/NYC1S2186/',
							'  1.LIBERMANE/LEPIN   2.LIBERMANE/MARINA   3.LIBERMANE/ZIMICH',
							'  4  CI 003 N 08FEB 4 SFOTPE DK2  1205A 555A 09FEB  E  0 77W M',
							'     SEE RTSVC',
							'  5  CI 701 Y 09FEB 5 TPEMNL DK2   735A 940A 09FEB  E  0 333 M',
							'     SEE RTSVC',
							'  6  CI 704 L 22FEB 4 MNLTPE DK1   455P 655P 22FEB  E  0 333 M',
							'     SEE RTSVC',
							'  7  CI 004 L 22FEB 4 TPESFO DK1  1140P 640P 22FEB  E  0 77W M',
							'     SEE RTSVC',
							'  8 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							'       GGAMAUSHAZ/S4,7',
							' ',
						]),
					},
					{
						'cmd': 'SBN5',
						'output': php.implode(php.PHP_EOL, [
							'/$                        ***  NHP  ***',
							'RP/NYC1S2186/',
							'  1.LIBERMANE/LEPIN   2.LIBERMANE/MARINA   3.LIBERMANE/ZIMICH',
							'  4  CI 003 N 08FEB 4 SFOTPE DK2  1205A 555A 09FEB  E  0 77W M',
							'     SEE RTSVC',
							'  5  CI 701 N 09FEB 5 TPEMNL DK2   735A 940A 09FEB  E  0 333 M',
							'     SEE RTSVC',
							'  6  CI 704 L 22FEB 4 MNLTPE DK1   455P 655P 22FEB  E  0 333 M',
							'     SEE RTSVC',
							'  7  CI 004 L 22FEB 4 TPESFO DK1  1140P 640P 22FEB  E  0 77W M',
							'     SEE RTSVC',
							'  8 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							'       GGAMAUSHAZ/S4,7',
							' ',
						]),
					},
				],
			},
		});

		// >+{seatAmount}; successful example with marriages, whole itinerary
		// based on itinerary of >RTS2IJBM;
		$list.push({
			'input': {
				'cmdRequested': '+1',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'sessionData': {'hasPnr': true},
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
					'area': 'B', 'pcc': 'NYC1S2186', 'hasPnr': true,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'RTAM',
						'output': php.implode(php.PHP_EOL, [
							'/$RP/NYC1S2186/',
							'  4  SN9590 L 18JUN 1 SFOYUL HK2   830A 1   930A 547P   *1A/E*',
							'                                                      A01 ',
							'     OPERATED BY AIR CANADA',
							'  5  SN9620 L 18JUN 1 YULFCO HK2   605P     705P 905A+1 *1A/E*',
							'                                                      A01 ',
							'     OPERATED BY AIR CANADA',
							'  6  LX1727 L 02JUL 1 FCOZRH HK2        3   940A1120A   *1A/E*',
							'                                                      A02',
							'  7  LX 038 L 02JUL 1 ZRHSFO HK2            110P 400P   *1A/E*',
							'                                                      A02 ',
							'     OPERATED BY SWISS GLOBAL AIR LINES',
							' ',
						]),
					},
					{
						'cmd': 'XE4,5,6,7',
						'output': php.implode(php.PHP_EOL, [
							'/',
							'ITINERARY CANCELLED',
							' ',
						]),
					},
					{
						'cmd': 'SSSN9590Y18JUNSFOYUL1',
						'output': php.implode(php.PHP_EOL, [
							'/$                        ***  NHP  ***',
							'RP/NYC1S2186/',
							'  1.LIBERMANE/LEPIN   2.LIBERMANE/MARINA   3.LIBERMANE/ZIMICH',
							'  4  SN9590 Y 18JUN 1 SFOYUL SS1   930A 547P 18JUN  E  0 320',
							'     OPERATED BY AIR CANADA',
							'     SEE RTSVC - TRAFFIC RESTRICTION EXISTS',
							'     LINK DOWN. SOLD IN STANDARD ACCESS',
							'  5 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							'       GGAMAUSHAZ/S4',
							' ',
						]),
					},
					{
						'cmd': 'SSSN9620Y18JUNYULFCO1',
						'output': php.implode(php.PHP_EOL, [
							'/$                        ***  NHP  ***',
							'RP/NYC1S2186/',
							'  1.LIBERMANE/LEPIN   2.LIBERMANE/MARINA   3.LIBERMANE/ZIMICH',
							'  4  SN9590 Y 18JUN 1 SFOYUL SS1   930A 547P 18JUN  E  0 320',
							'     OPERATED BY AIR CANADA',
							'     SEE RTSVC - TRAFFIC RESTRICTION EXISTS',
							'     LINK DOWN. SOLD IN STANDARD ACCESS',
							'  5  SN9620 Y 18JUN 1 YULFCO DK1   705P 905A 19JUN  E  0 333',
							'     OPERATED BY AIR CANADA',
							'     SEE RTSVC',
							'  6 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							'       GGAMAUSHAZ/S4',
							' ',
						]),
					},
					{
						'cmd': 'SSLX1727Y02JULFCOZRH1',
						'output': php.implode(php.PHP_EOL, [
							'/$                        ***  NHP  ***',
							'RP/NYC1S2186/',
							'  1.LIBERMANE/LEPIN   2.LIBERMANE/MARINA   3.LIBERMANE/ZIMICH',
							'  4  SN9590 Y 18JUN 1 SFOYUL SS1   930A 547P 18JUN  E  0 320',
							'     OPERATED BY AIR CANADA',
							'     SEE RTSVC - TRAFFIC RESTRICTION EXISTS',
							'     LINK DOWN. SOLD IN STANDARD ACCESS',
							'  5  SN9620 Y 18JUN 1 YULFCO DK1   705P 905A 19JUN  E  0 333',
							'     OPERATED BY AIR CANADA',
							'     SEE RTSVC',
							'  6  LX1727 Y 02JUL 1 FCOZRH DK1   940A1120A 02JUL  E  0 320 S',
							'     SEE RTSVC',
							'  7 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							'       GGAMAUSHAZ/S4',
							' ',
						]),
					},
					{
						'cmd': 'SSLX038Y02JULZRHSFO1',
						'output': php.implode(php.PHP_EOL, [
							'/$                        ***  NHP  ***',
							'RP/NYC1S2186/',
							'  1.LIBERMANE/LEPIN   2.LIBERMANE/MARINA   3.LIBERMANE/ZIMICH',
							'  4  SN9590 Y 18JUN 1 SFOYUL SS1   930A 547P 18JUN  E  0 320',
							'     OPERATED BY AIR CANADA',
							'     SEE RTSVC - TRAFFIC RESTRICTION EXISTS',
							'     LINK DOWN. SOLD IN STANDARD ACCESS',
							'  5  SN9620 Y 18JUN 1 YULFCO DK1   705P 905A 19JUN  E  0 333',
							'     OPERATED BY AIR CANADA',
							'     SEE RTSVC',
							'  6  LX1727 Y 02JUL 1*FCOZRH DK1   940A1120A 02JUL  E  0 320 S',
							'     SEE RTSVC',
							'  7  LX 038 Y 02JUL 1*ZRHSFO DK1   110P 400P 02JUL  E  0 77W MS',
							'     OPERATED BY LZ',
							'     OPERATED BY SWISS GLOBAL AIR LINES',
							'     SEE RTSVC',
							'  8 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							'       GGAMAUSHAZ/S4,7',
							' ',
						]),
					},
					{
						'cmd': 'SBL4,5',
						'output': php.implode(php.PHP_EOL, [
							'/$                        ***  NHP  ***',
							'RP/NYC1S2186/',
							'  1.LIBERMANE/LEPIN   2.LIBERMANE/MARINA   3.LIBERMANE/ZIMICH',
							'  4  SN9590 L 18JUN 1*SFOYUL DK1   930A 547P 18JUN  E  0 320',
							'     OPERATED BY AIR CANADA',
							'     SEE RTSVC - TRAFFIC RESTRICTION EXISTS',
							'  5  SN9620 L 18JUN 1*YULFCO DK1   705P 905A 19JUN  E  0 333',
							'     OPERATED BY AIR CANADA',
							'     SEE RTSVC',
							'  6  LX1727 Y 02JUL 1*FCOZRH DK1   940A1120A 02JUL  E  0 320 S',
							'     SEE RTSVC',
							'  7  LX 038 Y 02JUL 1*ZRHSFO DK1   110P 400P 02JUL  E  0 77W MS',
							'     OPERATED BY LZ',
							'     OPERATED BY SWISS GLOBAL AIR LINES',
							'     SEE RTSVC',
							'  8 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							'       GGAMAUSHAZ/S4,7',
							' ',
						]),
					},
					{
						'cmd': 'SBL6,7',
						'output': php.implode(php.PHP_EOL, [
							'/$                        ***  NHP  ***',
							'RP/NYC1S2186/',
							'  1.LIBERMANE/LEPIN   2.LIBERMANE/MARINA   3.LIBERMANE/ZIMICH',
							'  4  SN9590 L 18JUN 1*SFOYUL DK1   930A 547P 18JUN  E  0 320',
							'     OPERATED BY AIR CANADA',
							'     SEE RTSVC - TRAFFIC RESTRICTION EXISTS',
							'  5  SN9620 L 18JUN 1*YULFCO DK1   705P 905A 19JUN  E  0 333',
							'     OPERATED BY AIR CANADA',
							'     SEE RTSVC',
							'  6  LX1727 L 02JUL 1*FCOZRH DK1   940A1120A 02JUL  E  0 320 S',
							'     SEE RTSVC',
							'  7  LX 038 L 02JUL 1*ZRHSFO DK1   110P 400P 02JUL  E  0 77W MS',
							'     OPERATED BY LZ',
							'     OPERATED BY SWISS GLOBAL AIR LINES',
							'     SEE RTSVC',
							'  8 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							'       GGAMAUSHAZ/S4,7',
							' ',
						]),
					},
				],
			},
		});


		$list.push({
			'input': {
				'title': [
					'>+{seatAmount}; example where booking class change failed due to availability',
					'based on itinerary of >RTS56GRY;',
				].join('\n'),
				'cmdRequested': '+3S3-4',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'forbidden',
				'userMessages': [php.implode(php.PHP_EOL, [
					'Failed to change booking class in 3,4 segment(s) due to no availability',
				])],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultAmadeusState(),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'RTAM',
						'output': php.implode(php.PHP_EOL, [
							'/$-REPLICATED PNR-',
							'RP/SFO1S2195/',
							'  3  LH 445 L 13MAY 7 ATLFRA HK2        I   415P 710A+1 *1A/E*',
							'                                                      A01',
							'  4  LH 324 L 14MAY 1 FRAVCE HK2        1   815A 930A   *1A/E*',
							'                                                      A01',
							'  5  LH 333 L 30MAY 3 VCEFRA HK2            630A 755A   *1A/E*',
							'                                                      A02',
							'  6  LH 444 L 30MAY 3 FRAATL HK2        1  1020A 225P   *1A/E*',
							'                                                      A02',
							' ',
						]),
					},
					{
						'cmd': 'XE3-4',
						'output': php.implode(php.PHP_EOL, [
							'/$--- MSC SFP ---',
							'-REPLICATED PNR-',
							'RP/SFO1S2195/',
							'  1.LIBERMANE/MARINA   2.LIBERMANE/ZIMICH',
							'  3  LH 333 L 30MAY 3*VCEFRA DK2   630A 755A 30MAY  E  0 320 S',
							'     SEE RTSVC',
							'  4  LH 444 L 30MAY 3*FRAATL DK2  1020A 225P 30MAY  E  0 333 M',
							'     SEC FLT PSGR DATA REQUIRED 72 HBD SSR DOCS',
							'     US LAW SEE GGAIRLH PNR ACCESS OR NEWS KEYWORDS',
							'     ESTA REQUIRED FOR VISA WAIVER NATIONALS',
							'     FULLY FLAT BED IN BUSINESS CLASS. SEE WWW.LH.COM',
							'     SEE RTSVC',
							'  5 APA TRAVIX SUPPLY HUB',
							'  6 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							'       GGAMAUSHAZ/S4',
							'  7 RM *IRF-KUSW-2499310',
							'  8 RM TRANSACTION_ID:A191423E-64BA-464F-87E1-8A4367F8F404',
							'  9 RM CREATED BY SUPPLY_HUB',
							' 10 RM *F* FARE : PUBLISHED FRC LH IT FARE NO',
							' 11 RM ISSUE TICKET TO INTUSA-A PLEASE',
							' 12 RM *U*NOTE NON MOR PSE DO NOT CHANGE FOP',
							')',
						]),
					},
					{
						'cmd': 'SSLH445Y13MAYATLFRA3',
						'output': php.implode(php.PHP_EOL, [
							'/$                        ***  NHP  ***',
							'-REPLICATED PNR-',
							'RP/SFO1S2195/',
							'  1.LIBERMANE/MARINA   2.LIBERMANE/ZIMICH',
							'  3  LH 445 Y 13MAY 7 ATLFRA DK3   415P 710A 14MAY  E  0 333 M',
							'     SEC FLT PSGR DATA REQUIRED 72 HBD SSR DOCS',
							'     US LAW SEE GGAIRLH PNR ACCESS OR NEWS KEYWORDS',
							'     ESTA REQUIRED FOR VISA WAIVER NATIONALS',
							'     FULLY FLAT BED IN BUSINESS CLASS. SEE WWW.LH.COM',
							'     SEE RTSVC',
							'  4  LH 333 L 30MAY 3*VCEFRA DK2   630A 755A 30MAY  E  0 320 S',
							'     SEE RTSVC',
							'  5  LH 444 L 30MAY 3*FRAATL DK2  1020A 225P 30MAY  E  0 333 M',
							'     SEC FLT PSGR DATA REQUIRED 72 HBD SSR DOCS',
							'     US LAW SEE GGAIRLH PNR ACCESS OR NEWS KEYWORDS',
							'     ESTA REQUIRED FOR VISA WAIVER NATIONALS',
							'     FULLY FLAT BED IN BUSINESS CLASS. SEE WWW.LH.COM',
							'     SEE RTSVC',
							'  6 APA TRAVIX SUPPLY HUB',
							'  7 RM *IRF-KUSW-2499310',
							'  8 RM TRANSACTION_ID:A191423E-64BA-464F-87E1-8A4367F8F404',
							'  9 RM CREATED BY SUPPLY_HUB',
							') ',
						]),
					},
					{
						'cmd': 'SSLH324Y14MAYFRAVCE3',
						'output': php.implode(php.PHP_EOL, [
							'/$                        ***  NHP  ***',
							'-REPLICATED PNR-',
							'RP/SFO1S2195/',
							'  1.LIBERMANE/MARINA   2.LIBERMANE/ZIMICH',
							'  3  LH 445 Y 13MAY 7 ATLFRA DK3   415P 710A 14MAY  E  0 333 M',
							'     SEC FLT PSGR DATA REQUIRED 72 HBD SSR DOCS',
							'     US LAW SEE GGAIRLH PNR ACCESS OR NEWS KEYWORDS',
							'     ESTA REQUIRED FOR VISA WAIVER NATIONALS',
							'     FULLY FLAT BED IN BUSINESS CLASS. SEE WWW.LH.COM',
							'     SEE RTSVC',
							'  4  LH 324 Y 14MAY 1 FRAVCE DK3   815A 930A 14MAY  E  0 321 S',
							'     SEE RTSVC',
							'  5  LH 333 L 30MAY 3*VCEFRA DK2   630A 755A 30MAY  E  0 320 S',
							'     SEE RTSVC',
							'  6  LH 444 L 30MAY 3*FRAATL DK2  1020A 225P 30MAY  E  0 333 M',
							'     SEC FLT PSGR DATA REQUIRED 72 HBD SSR DOCS',
							'     US LAW SEE GGAIRLH PNR ACCESS OR NEWS KEYWORDS',
							'     ESTA REQUIRED FOR VISA WAIVER NATIONALS',
							'     FULLY FLAT BED IN BUSINESS CLASS. SEE WWW.LH.COM',
							'     SEE RTSVC',
							'  7 APA TRAVIX SUPPLY HUB',
							'  8 RM *IRF-KUSW-2499310',
							') ',
						]),
					},
					{
						'cmd': 'SBL3,4',
						'output': php.implode(php.PHP_EOL, [
							'/$  LH 445 L 13MAY 7 ATLFRA REBOOK REJECTED: SEGMENT NOT AVAILABLE',
							'  LH 324 L 14MAY 1 FRAVCE REBOOK REJECTED: SEGMENT NOT AVAILABLE',
							'AD13MAYATLVCE1615',
							'** AMADEUS AVAILABILITY - AD ** VCE VENICE.IT                158 SU 13MAY  415P',
							' 1  *AA2962  J6 D6 I5 Y7 B7 H7 K7 /ATL N ORD 3  315P    441P  E0.CR7',
							'             M7 L7 G7 V7 S7 N7 Q7 O7',
							'     AA 042  J7 R7 D7 I5 Y7 B0 H7 /ORD 3 VCE    700P   1100A+1E0.788      13:45',
							'             K7 M7 L7 G7 V7 S7 N7 Q7 O7',
							'             SUBJECT TO GOVERNMENT APPROVAL',
							' 2  :AY4054  J9 CL D9 I9 Y9 B9 H9 /ATL N ORD 3  315P    441P  E0/CR7  TR',
							'             K9 M9 L9 V9',
							'  AA:AY4148  J9 CL D9 I9 Y9 B9 H9 /ORD 3 VCE    700P   1100A+1E0/788      13:45',
							'             K9 M9 L9 V9 S9 N9 Q9 O9 G9',
							'             SUBJECT TO GOVERNMENT APPROVAL',
							' 3   AA1731  J7 D7 I6 Y7 B7 H7 K7 /ATL N PHL 0  316P    527P  E0.319',
							'             M7 L7 G7 V7 S7 N7 Q0 O0',
							'     AA 714  J7 R7 D7 I7 Y7 B0 H7 /PHL A VCE    640P    910A+1E0.333      11:54',
							'             K7 M7 L7 G7 V7 S7 N7 Q0 O0',
							' 4DL:AF3611  J9 C9 Y9 B9 M9 U9 K9 /ATL I CDG2E  317P    600A+1E0/333',
							'             H9 L9 Q9 T9',
							'     AF1126  J9 C9 D9 I9 Y9 B9 M9 /CDG2F VCE    725A+1  900A+1E0/318      11:43',
							'             U9 K9 H9 L9 Q9 T9',
							' ',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'STORE{ptc} alias example',
				'cmdRequested': 'STOREJCB',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'FXP/P1/PAX/RJ08//P2/PAX/RJCB//P2/INF/RJNF'},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultAmadeusState(),
				'initialCommands': [
					{
						'cmd': 'RT',
						'output': php.implode(php.PHP_EOL, [
							'/$--- MSC ---',
							'RP/SFO1S2195/',
							'  1.LIBERMANE/LEPIN(C08)',
							'  2.LIBERMANE/MARINA(INFLIBERMANE/ZIMICH/28DEC17)',
							'  3  SU1845 M 10MAY 4*KIVSVO DK2  1250A 345A 10MAY  E  0 32A S',
							'     SEE RTSVC',
							'  4  SU2682 M 10MAY 4*SVORIX DK2   915A1050A 10MAY  E  0 73H S',
							'     010 BT 7425',
							'     SEE RTSVC',
							'  5 SSR INFT SU NN1 LIBERMANE/ZIMICH 28DEC17/S3/P2',
							'  6 SSR INFT SU NN1 LIBERMANE/ZIMICH 28DEC17/S4/P2',
							' ',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'FXP/P1/PAX/RJ08//P2/PAX/RJCB//P2/INF/RJNF',
						'output': php.implode(php.PHP_EOL, [
							'FXP/P1/RJ08//P2/PAX/RJCB//P2/INF/RJNF',
							'',
							'',
							'   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
							'01 LIBERMANE/LEPIN   CNN     1     390.00   80.99     470.99',
							'02 LIBERMANE/MARINA  ADT     1     520.00   88.05     608.05',
							'03 LIBERMANE/ZIMICH  INF     1      52.00   52.02     104.02',
							'',
							'                   TOTALS    3     962.00  221.06    1183.06',
							'',
							'FXU/TS TO UPSELL EC FOR -687.00USD',
							'1-3 FARE FAMILIES:ER',
							'1-3 LAST TKT DTE 23FEB18/23:59 LT in POS - SEE ADV PURCHASE',
							'1-3 TICKETS ARE NON-REFUNDABLE',
							'                                                  PAGE  2/ 2',
							' ',
						]),
					},
					{
						'cmd': 'FQQ1',
						'output': php.implode(php.PHP_EOL, [
							'FQQ1',
							'',
							'01 LIBERMANE/LEPIN',
							'',
							'LAST TKT DTE 08MAR18/23:59 LT in POS - SEE ADV PURCHASE',
							'------------------------------------------------------------',
							'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
							' KIV',
							'XMOW SU  1845 M    10MAY 0050  MVO/CH25        10MAY10MAY 1P',
							' RIX SU  2682 M    10MAY 0915  MVO/CH25        10MAY10MAY 1P',
							'',
							'EUR   315.00      10MAY18KIV SU X/MOW SU RIX372.93MVO/CH25',
							'USD   387.00      NUC372.93END ROE0.844659',
							'USD    51.63YQ    XT USD 11.06MD USD 7.62WW USD 3.61RI USD',
							'USD     3.07JQ    3.61RI',
							'USD    25.90XT',
							'USD   467.60',
							'RATE USED 1EUR=1.229292USD',
							'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
							'FARE FAMILY:FC1:1-2:ER',
							'FXU/TS TO UPSELL EC FOR -276.00USD',
							'                                                  PAGE  3/ 4',
							' ',
						]),
					},
					{
						'cmd': 'MD',
						'output': php.implode(php.PHP_EOL, [
							'NOT FARED AT PASSENGER TYPE REQUESTED *5*',
							'TICKET STOCK RESTRICTION',
							'BG CXR: 2*SU',
							'PRICED WITH VALIDATING CARRIER SU - REPRICE IF DIFFERENT VC',
							'TICKETS ARE NON-REFUNDABLE',
							'ENDOS NONREF/HEBO3BPATEH',
							'01MAR18 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
							'                                                  PAGE  4/ 4',
							' ',
						]),
					},
				],
			},
		});

		// STORE alias without PTC specified example
		$list.push({
			'input': {
				'cmdRequested': 'STORE',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'FXP/P1/PAX/RC08//P2/PAX/RADT//P2/INF/RINF'},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultAmadeusState(),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'RT',
						'output': php.implode(php.PHP_EOL, [
							'/$--- MSC ---',
							'RP/SFO1S2195/',
							'  1.LIBERMANE/LEPIN(C08)',
							'  2.LIBERMANE/MARINA(INFLIBERMANE/ZIMICH/28DEC17)',
							'  3  SU1845 M 10MAY 4*KIVSVO DK2  1250A 345A 10MAY  E  0 32A S',
							'     SEE RTSVC',
							'  4  SU2682 M 10MAY 4*SVORIX DK2   915A1050A 10MAY  E  0 73H S',
							'     010 BT 7425',
							'     SEE RTSVC',
							'  5 SSR INFT SU NN1 LIBERMANE/ZIMICH 28DEC17/S3/P2',
							'  6 SSR INFT SU NN1 LIBERMANE/ZIMICH 28DEC17/S4/P2',
							' ',
						]),
					},
					{
						'cmd': 'FXP/P1/PAX/RC08//P2/PAX/RADT//P2/INF/RINF',
						'output': php.implode(php.PHP_EOL, [
							'FXP/P1/PAX/RC08//P2/PAX/RADT//P2/INF/RINF',
							'',
							'',
							'   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
							'01 LIBERMANE/LEPIN   CNN     1     390.00   80.99     470.99',
							'02 LIBERMANE/MARINA  ADT     1     520.00   88.05     608.05',
							'03 LIBERMANE/ZIMICH  INF     1      52.00    0.00      52.00',
							'',
							'                   TOTALS    3     962.00  169.04    1131.04',
							'',
							'FXU/TS TO UPSELL EC FOR -687.00USD',
							'1-3 FARE FAMILIES:ER',
							'1-3 LAST TKT DTE 23FEB18/23:59 LT in POS - SEE ADV PURCHASE',
							'1-3 TICKETS ARE NON-REFUNDABLE',
							'                                                  PAGE  2/ 2',
							' ',
						]),
					},
					{
						'cmd': 'FQQ1',
						'output': php.implode(php.PHP_EOL, [
							'FQQ1',
							'',
							'01 LIBERMANE/LEPIN',
							'',
							'LAST TKT DTE 08MAR18/23:59 LT in POS - SEE ADV PURCHASE',
							'------------------------------------------------------------',
							'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
							' KIV',
							'XMOW SU  1845 M    10MAY 0050  MVO/CH25        10MAY10MAY 1P',
							' RIX SU  2682 M    10MAY 0915  MVO/CH25        10MAY10MAY 1P',
							'',
							'EUR   315.00      10MAY18KIV SU X/MOW SU RIX372.93MVO/CH25',
							'USD   387.00      NUC372.93END ROE0.844659',
							'USD    51.63YQ    XT USD 11.06MD USD 7.62WW USD 3.61RI USD',
							'USD     3.07JQ    3.61RI',
							'USD    25.90XT',
							'USD   467.60',
							'RATE USED 1EUR=1.229292USD',
							'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
							'FARE FAMILY:FC1:1-2:ER',
							'FXU/TS TO UPSELL EC FOR -276.00USD',
							'                                                  PAGE  3/ 4',
							' ',
						]),
					},
					{
						'cmd': 'MD',
						'output': php.implode(php.PHP_EOL, [
							'TICKET STOCK RESTRICTION',
							'BG CXR: 2*SU',
							'PRICED WITH VALIDATING CARRIER SU - REPRICE IF DIFFERENT VC',
							'TICKETS ARE NON-REFUNDABLE',
							'ENDOS NONREF/HEBO3BPATEH',
							'01MAR18 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
							'                                                  PAGE  4/ 4',
							' ',
						]),
					},
				],
			},
		});

		// >PNR; example with an INS (infant with a seat), should be
		// matched correctly whe checking seats in itinerary: 2 paxes = 2 seats
		$list.push({
			'input': {
				'cmdRequested': 'PNR',
				'baseDate': '2018-02-22',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'ER'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
					'hasPnr': true, 'lead_creator_id': 2838,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'RT',
						'output': php.implode(php.PHP_EOL, [
							'/$--- MSC ---',
							'RP/SFO1S2195/',
							'  1.IVANOV/ANDREY(INS)   2.IVANOV/OLEG',
							'  3  PS 898 N 20SEP 4*KIVKBP DK2   720A 825A 20SEP  E  0 738 F',
							'     BOARDING PASS AT CHECKIN IS CHARGEABLE',
							'     FULL PASSPORT DATA IS MANDATORY',
							'     SEE RTSVC',
							'  4  PS 185 N 20SEP 4*KBPRIX DK2   920A1055A 20SEP  E  0 E90 F',
							'     BOARDING PASS AT CHECKIN IS CHARGEABLE',
							'     FULL PASSPORT DATA IS MANDATORY',
							'     SEE RTSVC',
							' ',
						]),
					},
					{
						'cmd': 'UHP/CREATED IN GDS DIRECT BY AKLESUNS',
						'output': php.implode(php.PHP_EOL, [
							'/$--- MSC ---',
							'RP/SFO1S2195/',
							'------- PRIORITY',
							'M  CREATED IN GDS DIRECT BY AKLESUNS',
							'-------',
							'  1.IVANOV/ANDREY(INS)   2.IVANOV/OLEG',
							'  3  PS 898 N 20SEP 4*KIVKBP DK2   720A 825A 20SEP  E  0 738 F',
							'     BOARDING PASS AT CHECKIN IS CHARGEABLE',
							'     FULL PASSPORT DATA IS MANDATORY',
							'     SEE RTSVC',
							'  4  PS 185 N 20SEP 4*KBPRIX DK2   920A1055A 20SEP  E  0 E90 F',
							'     BOARDING PASS AT CHECKIN IS CHARGEABLE',
							'     FULL PASSPORT DATA IS MANDATORY',
							'     SEE RTSVC',
							' ',
						]),
					},
					{
						'cmd': 'RMGD-AKLESUNS/6206322/FOR STANISLAW/2838/LEAD-1 IN SFO1S2195;TKTL22FEB;RFAKLESUNS;ER',
						'output': php.implode(php.PHP_EOL, [
							'/',
							'WARNING: PS REQUIRES TICKET ON OR BEFORE 23FEB:1000/S3-4',
							' ',
						]),
					},
					{
						'cmd': 'ER',
						'output': php.implode(php.PHP_EOL, [
							'/$--- RLR MSC ---',
							'RP/SFO1S2195/SFO1S2195            WS/SU  22FEB18/1709Z   LSGN77',
							'------- PRIORITY',
							'M  CREATED IN GDS DIRECT BY AKLESUNS',
							'-------',
							'SFO1S2195/9998WS/22FEB18',
							'  1.IVANOV/ANDREY(INS)   2.IVANOV/OLEG',
							'  3  PS 898 N 20SEP 4*KIVKBP HK2   720A 825A 20SEP  E  PS/LSGN77',
							'  4  PS 185 N 20SEP 4*KBPRIX HK2   920A1055A 20SEP  E  PS/LSGN77',
							'  5 AP SFO 888 585-2727 - ITN CORP. - A',
							'  6 TK TL22FEB/SFO1S2195',
							'  7 OPW-22FEB:1000/1C7/PS REQUIRES TICKET ON OR BEFORE',
							'        23FEB:1000/S3-4',
							'  8 OPC-23FEB:1000/1C8/PS CANCELLATION DUE TO NO TICKET/S3-4',
							'  9 RM GD-AKLESUNS/6206/FOR STANISLAW/2838/LEAD-1 IN SFO1S2195',
							' ',
						]),
					},
				],
			},
		});

		// same as previous, but with INF this time - infant _without_ seat, should not be
		// counted when checking seat count in segments and result in error: 1 pax != 2 seats
		$list.push({
			'input': {
				'cmdRequested': 'PNR',
				'baseDate': '2018-02-22',
			},
			'output': {
				'status': 'forbidden',
				'calledCommands': [],
				'userMessages': ['Name count: 1 does not match seat count in a segment: 2'],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
					'hasPnr': true, 'lead_creator_id': 2838,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'RT',
						'output': php.implode(php.PHP_EOL, [
							'/$                        ***  NHP  ***',
							'RP/SFO1S2195/',
							'  1.IVANOV/OLEG(INFIVANOV/ANDREY/14FEB17)',
							'  2  PS 898 N 20SEP 4*KIVKBP DK2   720A 825A 20SEP  E  0 738 F',
							'     BOARDING PASS AT CHECKIN IS CHARGEABLE',
							'     FULL PASSPORT DATA IS MANDATORY',
							'     SEE RTSVC',
							'  3  PS 185 N 20SEP 4*KBPRIX DK2   920A1055A 20SEP  E  0 E90 F',
							'     BOARDING PASS AT CHECKIN IS CHARGEABLE',
							'     FULL PASSPORT DATA IS MANDATORY',
							'     SEE RTSVC',
							' ',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'STORE attempt with unsupported PTC - error',
				'cmdRequested': 'STOREMIL',
				'baseDate': '2018-02-22',
			},
			output: {
				error: 'Error: No known Fare Families matched adult PTC MIL',
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
					'hasPnr': true, 'lead_creator_id': 2838,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'RT',
						'output': php.implode(php.PHP_EOL, [
							'/$--- MSC ---',
							'RP/SFO1S2195/',
							'  1.LIBERMANE/LEPIN(C08)',
							'  2.LIBERMANE/MARINA(INFLIBERMANE/ZIMICH/28DEC17)',
							'  3  SU1845 M 10MAY 4*KIVSVO DK2  1250A 345A 10MAY  E  0 32A S',
							'     SEE RTSVC',
							'  4  SU2682 M 10MAY 4*SVORIX DK2   915A1050A 10MAY  E  0 73H S',
							'     010 BT 7425',
							'     SEE RTSVC',
							'  5 SSR INFT SU NN1 LIBERMANE/ZIMICH 28DEC17/S3/P2',
							'  6 SSR INFT SU NN1 LIBERMANE/ZIMICH 28DEC17/S4/P2',
							' ',
						]),
					},
				],
			},
		});

		// >{initialCommand}/MDA; example - should result in just one element in 'calledCommands'
		$list.push({
			'input': {
				'cmdRequested': 'FQDLAXMNL/07MAY18/R,28DEC17,U/ACZ/IR/CT/MDA',
				'baseDate': '2018-02-22',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'FQDLAXMNL/07MAY18/R,28DEC17,U/ACZ/IR/CT'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
					'hasPnr': true, 'lead_creator_id': 2838,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'FQDLAXMNL/07MAY18/R,28DEC17,U/ACZ/IR/CT',
						'output': php.implode(php.PHP_EOL, [
							'FQDLAXMNL/07MAY18/R,28DEC17,U/ACZ/IR/CT',
							'                                       XF MAY APPLY',
							'                                       3.96XA/7XY EXCLUDED',
							'                                       OTHER TAX MAY APPLY',
							'ROE 1.000000 NEAREST 1.00 USD          SURCHG MAY APPLY-CK RULE',
							'07MAY18**21MAY18/CZ LAXMNL/NPX;PA/TPM  7296/MPM  8755',
							'LN FARE BASIS    OW   USD  RT   B PEN  DATES/DAYS   AP MIN MAXFR',
							'01 TLPTUS                   187 T  @  S07MAY B31JAN@14  7@  3MAR',
							'                                      E01JAN O31MAY',
							'02 TLPTUS                   187 T  @  S07MAY B31JAN@14  7@  3MAR',
							'                                      E01JAN O31MAY',
							'03 TKPTUS                   298 T  @  S23MAY B31JAN@14  7@  3MAR',
							'                                      E01JAN O31MAY',
							'04 TKPTUS                   298 T  @  S23MAY B31JAN@14  7@  3MAR',
							'                                      E01JAN O31MAY',
							'                                                  PAGE  1/ 1',
							' ',
						]),
					},
				],
			},
		});

		// joined command ending with "ER" - should add GD- remark
		$list.push({
			'input': {
				'cmdRequested': 'NM1LIBERMANE/MARINA;ER',
				'baseDate': '2018-02-22',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'NM1LIBERMANE/MARINA;ER'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
					'agent_id': 1588, 'lead_creator_id': 2838,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'RMGD-PRINCE/1588/FOR STANISLAW/2838/LEAD-1 IN SFO1S2195',
						'output': php.implode(php.PHP_EOL, [
							'/$RP/SFO1S2195/',
							'  1 RM GD-PRINCE/1588/FOR STANISLAW/2838/LEAD-1 IN SFO1S2195',
							' ',
						]),
					},
					{
						'cmd': 'UHP/CREATED IN GDS DIRECT BY PRINCE',
						'output': php.implode(php.PHP_EOL, [
							'/$RP/SFO1S2195/',
							'------- PRIORITY',
							'M  CREATED IN GDS DIRECT BY PRINCE',
							'-------',
							'  1 RM GD-PRINCE/1588/FOR STANISLAW/2838/LEAD-1 IN SFO1S2195',
							' ',
						]),
					},
					{
						'cmd': 'NM1LIBERMANE/MARINA;ER',
						'output': php.implode(php.PHP_EOL, [
							'/',
							'NEED TICKETING ARRANGEMENT',
							'NEED ITINERARY',
							' ',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'should not allow regular agents to open Alex PNR-s',
				'cmdRequested': 'RT2',
				'baseDate': '2018-02-22',
			},
			'output': {
				'status': 'forbidden',
				'calledCommands': [],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
					'agent_id': 1588,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'RT2',
						'output': php.implode(php.PHP_EOL, [
							'/$RP/SFO1S2195/SFO1S2195            WS/SU  15MAY18/1219Z   WMYSYX',
							'------- PRIORITY',
							'M  CREATED IN GDS DIRECT BY PRINCE',
							'-------',
							'SFO1S2195/9998WS/15MAY18',
							'  1.LIBERMANE/MARINA(INF/ZIMICH)   2.LIBERMANE/STAS(C06)',
							'  3.WEINSTEIN/ALEX(C05)',
							'  4  SU1845 Y 10DEC 1 KIVSVO GK3   140A 540A 10DEC     A',
							'  5  SU2682 Y 10DEC 1 SVORIX GK3   925A1005A 10DEC     A',
							'  6 AP 15123-4567-B',
							'  7 APE JOHN@GMAIL.COM',
							'  8 TK TL01MAY/SFO1S2195',
							'  9 RM GD-PRINCE/1588/FOR STANISLAW/2838/LEAD-1 IN SFO1S2195',
							' 10 RM DEV TESTING PLS IGNORE',
							' ',
						]),
					},
					{
						'cmd': 'IG',
						'output': php.implode(php.PHP_EOL, [
							'/',
							'IGNORED - WMYSYX',
							' ',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'regular agents should not see Alex PNR-s in PNR search',
				'cmdRequested': 'RT/W',
				'baseDate': '2018-02-22',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': 'RT/W',
						'output': php.implode(php.PHP_EOL, [
							'/$RT/W',
							'  1 WALTERS/JESSICA       NO ACTIVE ITINERARY           MBEEOE',
							'  3 WEINSTEIN/ELENA       NO ACTIVE ITINERARY           VHPGAG',
							'  4 WILMINGTON/ADAM       NO ACTIVE ITINERARY           Q37KW9',
							'  5 WILMINGTON/JAMES      NO ACTIVE ITINERARY           UIQ37D',
							'  6 WILMINGTON/JAMES A    NO ACTIVE ITINERARY           QUXMGB',
							' ',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
					'agent_id': 1588,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'RT/W',
						'output': php.implode(php.PHP_EOL, [
							'/$RT/W',
							'  1 WALTERS/JESSICA       NO ACTIVE ITINERARY           MBEEOE',
							'  2 WEINSTEIN/ALEX        SU  1845 Y  10DEC  KIVSVO   3 WMYSYX',
							'  3 WEINSTEIN/ELENA       NO ACTIVE ITINERARY           VHPGAG',
							'  4 WILMINGTON/ADAM       NO ACTIVE ITINERARY           Q37KW9',
							'  5 WILMINGTON/JAMES      NO ACTIVE ITINERARY           UIQ37D',
							'  6 WILMINGTON/JAMES A    NO ACTIVE ITINERARY           QUXMGB',
							' ',
						]),
					},
				],
			},
		});

		// seat map MDA example - should work
		$list.push({
			'input': {
				'cmdRequested': 'SM1/MDA',
				'baseDate': '2018-02-22',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': 'SM1',
						'output': php.implode(php.PHP_EOL, [
							'SM PS 0898/N/20SEPKIVKBP                                 /S001/',
							'SM PS  0898  N 20SEP KIVKBP        738',
							'   S   ',
							'   0         0 0            0  0            0  0 ',
							'   0         0 1            1  2            2  3 ',
							'   4567      890123456      7890123456      78901',
							'                   EE                                                          ',
							'F  HHHH   F  HHHHHHYYH   F  HHHHHHHHHH   F  HHHHH                             F',
							'E  YYYY   E  YYYYYYYYY   E  YYYYYYYYYY   E  YYYYD                             E',
							'D  YYYY   D  YYYYYYYYY   D  YYYYYYYYYY   D  YYYYD                             D',
							'                                                                               ',
							'C  YYYY   C  YYYYYYYYY   C  YYYYYYYYYY   C  YYYYD                             C',
							'B  YYYY   B  YYYYYYYYY   B  YYYYYYYYYY   B  YYYYD                             B',
							'A  HHHH   A  HHHHHHYYH   A  HHHHHHHHHH   A  HHHHH                             A',
							'                   EE                                                          ',
							'   4567      890123456      7890123456      78901',
							'   0         0 1            1  2            2  3 ',
							'. AVAILABLE      WING     F GEN FACI   K GALLEY   E EXIT    C COT ',
							'+ OCCUPIED    - LAST OFF  H HANDICAP   Q QUIET    G GROUPS  P PET ',
							'/ RESTRICTED  B BULKHEAD  V PREF.SEAT  X BLOCKED  L LEGROOM U UMNR',
							'() SMOKING    D DEPORTEE  UP UP-DECK   Z NO FILM  I INFANT  R REAR',
							'Y CHARGEABLE',
							'   0         0 0            0  0            0  0 ',
							'   S   ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
					'agent_id': 1588,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'SM1',
						'output': php.implode(php.PHP_EOL, [
							'/$SM PS 0898/N/20SEPKIVKBP                                 /S001/',
							'SM PS  0898  N 20SEP KIVKBP        738',
							'   S   ',
							'   0         0 0            0  0            0  0 ',
							'   0         0 1            1  2            2  3 ',
							'   4567      890123456      7890123456      78901',
							'                   EE                                                          ',
							'F  HHHH   F  HHHHHHYYH   F  HHHHHHHHHH   F  HHHHH                             F',
							'E  YYYY   E  YYYYYYYYY   E  YYYYYYYYYY   E  YYYYD                             E',
							'D  YYYY   D  YYYYYYYYY   D  YYYYYYYYYY   D  YYYYD                             D',
							'                                                                               ',
							'C  YYYY   C  YYYYYYYYY   C  YYYYYYYYYY   C  YYYYD                             C',
							'B  YYYY   B  YYYYYYYYY   B  YYYYYYYYYY   B  YYYYD                             B',
							'A  HHHH   A  HHHHHHYYH   A  HHHHHHHHHH   A  HHHHH                             A',
							'                   EE                                                          ',
							'   4567      890123456      7890123456      78901',
							'   0         0 1            1  2            2  3 ',
							'. AVAILABLE      WING     F GEN FACI   K GALLEY   E EXIT    C COT ',
							'+ OCCUPIED    - LAST OFF  H HANDICAP   Q QUIET    G GROUPS  P PET ',
							'/ RESTRICTED  B BULKHEAD  V PREF.SEAT  X BLOCKED  L LEGROOM U UMNR',
							'() SMOKING    D DEPORTEE  UP UP-DECK   Z NO FILM  I INFANT  R REAR',
							'Y CHARGEABLE',
							') ',
						]),
					},
					{
						'cmd': 'MDR',
						'output': php.implode(php.PHP_EOL, [
							'/$   0         0 0            0  0            0  0 ',
							'   S   ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
							' ',
						]),
					},
				],
			},
		});

		// air history MDA example - should work
		$list.push({
			'input': {
				'cmdRequested': 'RHA/MDA',
				'baseDate': '2018-02-22',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': 'RHA',
						'output': php.implode(php.PHP_EOL, [
							'RP/SFO1S2195/SFO1S2195            G3/RM  28APR18/1223Z   OOXFW3',
							'SFO1S2195/9998WS/25APR18',
							'    000 OS/G37453 F 25JUN 1 EZEGRU LK1 140P 420P/NN *1A/E*',
							'    000 OS/G38002 F 25JUN 1 GRUATL LK1 925P 600A+1/NN *1A/E*',
							'    000 OS/G38200 F 26JUN 2 ATLIAD LK1 725A 910A/NN *1A/E*',
							'    000 OS/G38167 F 24JUL 2 IADATL LK1 540P 752P/NN *1A/E*',
							'    000 OS/G38003 F 24JUL 2 ATLGRU LK1 947P 820A+1/NN *1A/E*',
							'    000 OS/G37450 F 25JUL 3 GRUEZE LK11010A 100P/NN *1A/E*',
							'    000 RF-PHIL CR-SFO1S2195 05578602 SU 9998WS 25APR1830Z',
							'000/002 CS/G37453 F 25JUN 1 EZEGRU HX1 140P 420P/HK *1A/E*',
							'000/002 CS/G38002 F 25JUN 1 GRUATL HX1 925P 600A+1/HK *1A/E*',
							'000/002 CS/G38200 F 26JUN 2 ATLIAD HX1 725A 910A/HK *1A/E*',
							'000/002 CS/G38167 F 24JUL 2 IADATL HX1 540P 752P/HK *1A/E*',
							'000/002 CS/G38003 F 24JUL 2 ATLGRU HX1 947P 820A+1/HK *1A/E*',
							'000/002 CS/G37450 F 25JUL 3 GRUEZE HX11010A 100P/HK *1A/E*',
							'    002 RF-HDQRMG3 251830 CR-HDQ RM G3 25APR1830Z',
							'002/003 XS/G37453 F 25JUN 1 EZEGRU HX1 140P 420P/HK *1A/E*',
							'002/003 XS/G38002 F 25JUN 1 GRUATL HX1 925P 600A+1/HK *1A/E*',
							'002/003 XS/G38200 F 26JUN 2 ATLIAD HX1 725A 910A/HK *1A/E*',
							'002/003 XS/G38167 F 24JUL 2 IADATL HX1 540P 752P/HK *1A/E*',
							'002/003 XS/G38003 F 24JUL 2 ATLGRU HX1 947P 820A+1/HK *1A/E*',
							'002/003 XS/G37450 F 25JUL 3 GRUEZE HX11010A 100P/HK *1A/E*',
							'    003 RF-PHIL CR-SFO1S2195 05578602 SU 9998WS 25APR1830Z',
							'    004 AS/G37453 Y 25JUN 1 EZEGRU LK1 140P 420P/NN *1A/E*',
							'    004 AS/G38002 Y 25JUN 1 GRUATL LK1 925P 600A+1/NN *1A/E*',
							'    004 AS/G38200 Y 26JUN 2 ATLIAD LK1 725A 910A/NN *1A/E*',
							'    004 RF-PHIL CR-SFO1S2195 05578602 SU 9998WS 25APR1832Z',
							'004/006 XS/G37453 Y 25JUN 1 EZEGRU HK1 140P 420P/NN *1A/E*',
							'004/006 XS/G38002 Y 25JUN 1 GRUATL HK1 925P 600A+1/NN *1A/E*',
							'004/006 XS/G38200 Y 26JUN 2 ATLIAD HK1 725A 910A/NN *1A/E*',
							'    006 AS/G37453 U 25JUN 1 EZEGRU LK1 140P 420P/NN *1A/E*',
							'    006 AS/G38002 U 25JUN 1 GRUATL LK1 925P 600A+1/NN *1A/E*',
							'    006 AS/G38200 U 26JUN 2 ATLIAD LK1 725A 910A/NN *1A/E*',
							'    006 RF-PHIL CR-SFO1S2195 05578602 SU 9998WS 25APR1833Z',
							'    007 AS/G38167 U 24JUL 2 IADATL LK1 540P 752P/NN *1A/E*',
							'    007 AS/G38003 U 24JUL 2 ATLGRU LK1 947P 820A+1/NN *1A/E*',
							'    007 AS/G37450 U 25JUL 3 GRUEZE LK11010A 100P/NN *1A/E*',
							'    007 RF-PHIL CR-SFO1S2195 05578602 SU 9998WS 25APR1834Z',
							'006/008 XS/G37453 U 25JUN 1 EZEGRU HK1 140P 420P/NN *1A/E*',
							'006/008 XS/G38002 U 25JUN 1 GRUATL HK1 925P 600A+1/NN *1A/E*',
							'006/008 XS/G38200 U 26JUN 2 ATLIAD HK1 725A 910A/NN *1A/E*',
							'    008 AS/G37453 F 25JUN 1 EZEGRU LK1 140P 420P/NN *1A/E*',
							'    008 AS/G38002 F 25JUN 1 GRUATL LK1 925P 600A+1/NN *1A/E*',
							'    008 AS/G38200 F 26JUN 2 ATLIAD LK1 725A 910A/NN *1A/E*',
							'    008 RF-PHIL CR-SFO1S2195 05578602 SU 9998WS 25APR1834Z',
							'007/009 XS/G38167 U 24JUL 2 IADATL HK1 540P 752P/NN *1A/E*',
							'007/009 XS/G38003 U 24JUL 2 ATLGRU HK1 947P 820A+1/NN *1A/E*',
							'007/009 XS/G37450 U 25JUL 3 GRUEZE HK11010A 100P/NN *1A/E*',
							'008/009 XS/G37453 F 25JUN 1 EZEGRU HK1 140P 420P/NN *1A/E*',
							'008/009 XS/G38002 F 25JUN 1 GRUATL HK1 925P 600A+1/NN *1A/E*',
							'008/009 XS/G38200 F 26JUN 2 ATLIAD HK1 725A 910A/NN *1A/E*',
							'    009 RF-PHIL CR-SFO1S2195 05578602 SU 9998WS 25APR1835Z',
							'    011 AS/G38200 Y 26JUN 2 ATLIAD TK1 725A 904A/TK     E*',
							'    011 RF-HDQRMG3 281223 CR-HDQ RM G3 28APR1223Z',
							' ',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
					'agent_id': 1588,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'RHA',
						'output': php.implode(php.PHP_EOL, [
							'/$RP/SFO1S2195/SFO1S2195            G3/RM  28APR18/1223Z   OOXFW3',
							'SFO1S2195/9998WS/25APR18',
							'    000 OS/G37453 F 25JUN 1 EZEGRU LK1 140P 420P/NN *1A/E*',
							'    000 OS/G38002 F 25JUN 1 GRUATL LK1 925P 600A+1/NN *1A/E*',
							'    000 OS/G38200 F 26JUN 2 ATLIAD LK1 725A 910A/NN *1A/E*',
							'    000 OS/G38167 F 24JUL 2 IADATL LK1 540P 752P/NN *1A/E*',
							'    000 OS/G38003 F 24JUL 2 ATLGRU LK1 947P 820A+1/NN *1A/E*',
							'    000 OS/G37450 F 25JUL 3 GRUEZE LK11010A 100P/NN *1A/E*',
							'    000 RF-PHIL CR-SFO1S2195 05578602 SU 9998WS 25APR1830Z',
							'000/002 CS/G37453 F 25JUN 1 EZEGRU HX1 140P 420P/HK *1A/E*',
							'000/002 CS/G38002 F 25JUN 1 GRUATL HX1 925P 600A+1/HK *1A/E*',
							'000/002 CS/G38200 F 26JUN 2 ATLIAD HX1 725A 910A/HK *1A/E*',
							'000/002 CS/G38167 F 24JUL 2 IADATL HX1 540P 752P/HK *1A/E*',
							'000/002 CS/G38003 F 24JUL 2 ATLGRU HX1 947P 820A+1/HK *1A/E*',
							'000/002 CS/G37450 F 25JUL 3 GRUEZE HX11010A 100P/HK *1A/E*',
							'    002 RF-HDQRMG3 251830 CR-HDQ RM G3 25APR1830Z',
							'002/003 XS/G37453 F 25JUN 1 EZEGRU HX1 140P 420P/HK *1A/E*',
							'002/003 XS/G38002 F 25JUN 1 GRUATL HX1 925P 600A+1/HK *1A/E*',
							'002/003 XS/G38200 F 26JUN 2 ATLIAD HX1 725A 910A/HK *1A/E*',
							'002/003 XS/G38167 F 24JUL 2 IADATL HX1 540P 752P/HK *1A/E*',
							'002/003 XS/G38003 F 24JUL 2 ATLGRU HX1 947P 820A+1/HK *1A/E*',
							'002/003 XS/G37450 F 25JUL 3 GRUEZE HX11010A 100P/HK *1A/E*',
							'    003 RF-PHIL CR-SFO1S2195 05578602 SU 9998WS 25APR1830Z',
							') ',
						]),
					},
					{
						'cmd': 'MDR',
						'output': php.implode(php.PHP_EOL, [
							'/$    004 AS/G37453 Y 25JUN 1 EZEGRU LK1 140P 420P/NN *1A/E*',
							'    004 AS/G38002 Y 25JUN 1 GRUATL LK1 925P 600A+1/NN *1A/E*',
							'    004 AS/G38200 Y 26JUN 2 ATLIAD LK1 725A 910A/NN *1A/E*',
							'    004 RF-PHIL CR-SFO1S2195 05578602 SU 9998WS 25APR1832Z',
							'004/006 XS/G37453 Y 25JUN 1 EZEGRU HK1 140P 420P/NN *1A/E*',
							'004/006 XS/G38002 Y 25JUN 1 GRUATL HK1 925P 600A+1/NN *1A/E*',
							'004/006 XS/G38200 Y 26JUN 2 ATLIAD HK1 725A 910A/NN *1A/E*',
							'    006 AS/G37453 U 25JUN 1 EZEGRU LK1 140P 420P/NN *1A/E*',
							'    006 AS/G38002 U 25JUN 1 GRUATL LK1 925P 600A+1/NN *1A/E*',
							'    006 AS/G38200 U 26JUN 2 ATLIAD LK1 725A 910A/NN *1A/E*',
							'    006 RF-PHIL CR-SFO1S2195 05578602 SU 9998WS 25APR1833Z',
							'    007 AS/G38167 U 24JUL 2 IADATL LK1 540P 752P/NN *1A/E*',
							'    007 AS/G38003 U 24JUL 2 ATLGRU LK1 947P 820A+1/NN *1A/E*',
							'    007 AS/G37450 U 25JUL 3 GRUEZE LK11010A 100P/NN *1A/E*',
							'    007 RF-PHIL CR-SFO1S2195 05578602 SU 9998WS 25APR1834Z',
							'006/008 XS/G37453 U 25JUN 1 EZEGRU HK1 140P 420P/NN *1A/E*',
							'006/008 XS/G38002 U 25JUN 1 GRUATL HK1 925P 600A+1/NN *1A/E*',
							'006/008 XS/G38200 U 26JUN 2 ATLIAD HK1 725A 910A/NN *1A/E*',
							'    008 AS/G37453 F 25JUN 1 EZEGRU LK1 140P 420P/NN *1A/E*',
							'    008 AS/G38002 F 25JUN 1 GRUATL LK1 925P 600A+1/NN *1A/E*',
							'    008 AS/G38200 F 26JUN 2 ATLIAD LK1 725A 910A/NN *1A/E*',
							'    008 RF-PHIL CR-SFO1S2195 05578602 SU 9998WS 25APR1834Z',
							'007/009 XS/G38167 U 24JUL 2 IADATL HK1 540P 752P/NN *1A/E*',
							') ',
						]),
					},
					{
						'cmd': 'MDR',
						'output': php.implode(php.PHP_EOL, [
							'/$007/009 XS/G38003 U 24JUL 2 ATLGRU HK1 947P 820A+1/NN *1A/E*',
							'007/009 XS/G37450 U 25JUL 3 GRUEZE HK11010A 100P/NN *1A/E*',
							'008/009 XS/G37453 F 25JUN 1 EZEGRU HK1 140P 420P/NN *1A/E*',
							'008/009 XS/G38002 F 25JUN 1 GRUATL HK1 925P 600A+1/NN *1A/E*',
							'008/009 XS/G38200 F 26JUN 2 ATLIAD HK1 725A 910A/NN *1A/E*',
							'    009 RF-PHIL CR-SFO1S2195 05578602 SU 9998WS 25APR1835Z',
							'    011 AS/G38200 Y 26JUN 2 ATLIAD TK1 725A 904A/TK     E*',
							'    011 RF-HDQRMG3 281223 CR-HDQ RM G3 28APR1223Z',
							' ',
						]),
					},
				],
			},
		});

		// should not allow deleting GD- remark
		$list.push({
			'input': {
				'cmdRequested': 'XE16-17',
				'baseDate': '2018-02-22',
			},
			'output': {
				'status': 'forbidden',
				'userMessages': [
					'Forbidden command, cant delete fields in ticketed PNR',
					'Forbidden command, cant change GDS Direct \"CREATED FOR\" remark on line 17',
				],
				'calledCommands': [],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
					'agent_id': 1588, 'isPnrStored': true,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'RT',
						'output': php.implode(php.PHP_EOL, [
							'/$--- TST RLR MSC SFP ---',
							'RP/SFO1S2195/SFO1S2195            AA/GS   6APR18/0216Z   U98C8V',
							'------- PRIORITY',
							'M  CREATED IN GDS DIRECT BY ESTEBAN',
							'-------',
							'SFO1S2195/9998WS/5APR18',
							'  1.GARCIARUIZ/CARLA VALERIA   2.GARCIARUIZ/MARIANN',
							'  3  AM 419 N 26JUN 2*IAHMEX HK2  1245P 305P 26JUN  E  AM/XUMVQP',
							'  4  AM 018 R 26JUN 2*MEXLIM HK2   455P1055P 26JUN  E  AM/XUMVQP',
							'  5  AM 019 R 04JUL 3*LIMMEX HK2  1215A 620A 04JUL  E  AM/XUMVQP',
							'  6  AM 472 N 04JUL 3*MEXIAH HK2   905A1130A 04JUL  E  AM/XUMVQP',
							'  7 AP SFO 888 585-2727 - ITN CORP. - A',
							'  8 TK PAX OK05APR/SFO1S2195/S3-6/P1',
							'  9 TK OK05APR/SFO1S2195//ETAM',
							' 10 SSR OTHS 1A PLS ADV SECURE FLT INFO BY 08APR 1143 SFO',
							' 11 SSR DOCS AM HK1 ////23FEB99/F//GARCIARUIZ/CARLA VALERIA/P1',
							' 12 SSR DOCS AM HK1 ////02SEP03/F//GARCIARUIZ/MARIANN/P2',
							' 13 OSI 1A MARRIED CONNECTION EXISTS FLTS AM0419/AM0018',
							' 14 OSI 1A SUBSEQUENT XL MAY XL ENTIRE CONNECTION',
							' 15 OSI 1A MARRIED CONNECTION EXISTS FLTS AM0019/AM0472',
							' 16 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							') ',
						]),
					},
					{
						'cmd': 'MDR',
						'output': php.implode(php.PHP_EOL, [
							'/$       GGAMAUSHAZ/S3,6',
							' 17 RM GD-ESTEBAN/22026/FOR CRISCORNEL/23238/LEAD-7865670 IN',
							'       SFO1S2195',
							' 18 FA PAX 139-7106162307/ETAM/USD510.88/05APR18/SFO1S2195/05578',
							'       602/S3-6/P1',
							' 19 FA PAX 139-7106162308/ETAM/USD510.88/05APR18/SFO1S2195/05578',
							'       602/S3-6/P2',
							' 20 FB PAX 0000000000 TTP/ET/RT/P1 OK ETICKET - USD510.88',
							'       /S3-6/P1',
							' 21 FB PAX 0000000000 TTP/ET/RT/P2 OK ETICKET - USD510.88',
							'       /S3-6/P2',
							' 22 FE PAX FARESAVERS -BG:AM/S3-6/P1-2',
							' 23 FM *M*0',
							' 24 FP CCVIXXXXXXXXXXXX4654/1220',
							' 25 FP PAX CCVIXXXXXXXXXXXX4654/1220/A044988/S3-6/P2',
							' 26 FV PAX AM/S3-6/P1-2',
							' ',
						]),
					},
				],
			},
		});

		// should not allow changing GD- remark
		$list.push({
			'input': {
				'cmdRequested': '8/NOT ME',
				'baseDate': '2018-02-22',
			},
			'output': {
				'status': 'forbidden',
				'userMessages': [
					'Forbidden command, cant change GDS Direct \"CREATED FOR\" remark on line 8',
				],
				'calledCommands': [],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
					'agent_id': 1588, 'isPnrStored': true,
				}),
				'initialCommands': [
					{
						'cmd': 'RT',
						'output': php.implode(php.PHP_EOL, [
							'/$--- TST RLR SFP ---',
							'RP/SFO1S2195/SFO1S2195            AA/GS  29NOV17/1739Z   MKQ7IZ',
							'------- PRIORITY',
							'M  CREATED IN GDS DIRECT BY HUGO',
							'-------',
							'SFO1S2195/9998WS/29NOV17',
							'  1.MENENDEZ/JULIANA',
							'  2  IB2624 Q 04JUL 3 LAXBCN HK1   940P 610P 05JUL  E  IB/L507W',
							'  3  IB2623 O 25JUL 3 BCNLAX HK1   355P 755P 25JUL  E  IB/L507W',
							'  4 AP SFO 888 585-2727 - ITN CORP. - A',
							'  5 TK OK29NOV/SFO1S2195//ETIB',
							'  6 SSR DOCS IB HK1 ////26JUN98/F//MENENDEZ/JULIANA',
							'  7 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							'       GGAMAUSHAZ/S2-3',
							'  8 RM GD-HUGO/3953/FOR YOUNG/21724/LEAD-6640252 IN SFO1S2195',
							'  9 FA PAX 075-7071223369/ETIB/USD492.87/29NOV17/SFO1S2195/05578',
							'       602/S2-3',
							' 10 FB PAX 0000000000 TTP/ET/RT OK ETICKET - USD492.87/S2-3',
							' 11 FE PAX CHGS REST/REF NOT PERMITTE -BG:IB/S2-3',
							' 12 FM *M*0',
							' 13 FP CHECK',
							') ',
						]),
					},
					{
						'cmd': 'MDR',
						'output': php.implode(php.PHP_EOL, [
							'/$ 14 FV PAX IB/S2-3',
							' ',
						]),
					},
				],
				'performedCommands': [],
			},
		});

		// should not use XI since it deletes GD- remark, should be replaced with XE4,5,6,7
		$list.push({
			'input': {
				'cmdRequested': 'XI',
				'baseDate': '2018-02-22',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': 'XE4,5',
						'output': php.implode(php.PHP_EOL, [
							'/',
							'ITINERARY CANCELLED',
							' ',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
					'agent_id': 1588, 'isPnrStored': true,
				}),
				'initialCommands': [
					{
						'cmd': 'RT',
						'output': php.implode(php.PHP_EOL, [
							'/$--- RLR ---',
							'RP/SFO1S2195/SFO1S2195            WS/RC  29MAY18/1602Z   QHDUG7',
							'------- PRIORITY',
							'M  CREATED IN GDS DIRECT BY PRINCE',
							'-------',
							'SFO1S2195/9998WS/29MAY18',
							'  1.LIBERMANE/LEPIN   2.LIBERMANE/MARINA   3.LIBERMANE/ZIMICH',
							'  4  LH 590 L 16SEP 7 FRANBO HK3  1110A 810P 16SEP  E  LH/QHDUG7',
							'  5  LX 294 L 30SEP 7 NBOZRH HK3   740P 615A 01OCT  E  LX/QHDUG7',
							'  6 AP SFO 888 585-2727 - ITN CORP. - A',
							'  7 TK TL29MAY/SFO1S2195',
							'  8 SSR OTHS 1A PLS ADV TKT NBR FOR ITIN BY 01JUN18/1602Z OR LX',
							'       FLTS WILL BE CNLD / APPLIC FARE RULE APPLIES IF IT',
							'       DEMANDS',
							'  9 SSR OTHS 1A /// EARLIER TKTG // 29MAY181602',
							' 10 RM GD-PRINCE/1588/FOR STANISLAW/2838/LEAD-1 IN SFO1S2195',
							' ',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'XE4,5',
						'output': php.implode(php.PHP_EOL, [
							'/',
							'ITINERARY CANCELLED',
							' ',
						]),
					},
				],
			},
		});

		// STORE/CUA example - with validating carrier override
		$list.push({
			'input': {
				'cmdRequested': 'STORE/CUA',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'FXP/P1/PAX/RADT,VC-UA//P2/PAX/RADT,VC-UA'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), []),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'RT',
						'output': php.implode(php.PHP_EOL, [
							'/$--- SFP ---',
							'RP/SFO1S2195/',
							'  1.LIB/MAR   2.LIB/ZIM',
							'  3  B61505 P 11SEP 2 EWRFLL DK2   735A1030A 11SEP  E  0 320',
							'     010 EK 6897',
							'     SEE RTSVC',
							'  4  AV 037 O 11SEP 2 FLLBOG DK2   404P 650P 11SEP  E  0 320 L',
							'     OPERATED BY AVIANCA',
							'     OPERATED BY SUBSIDIARY/FRANCHISE',
							'     SEE RTSVC',
							'  5 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							'       GGAMAUSHAZ/S3-4',
							' ',
						]),
					},
					{
						'cmd': 'FXP/P1/PAX/RADT,VC-UA//P2/PAX/RADT,VC-UA',
						'output': php.implode(php.PHP_EOL, [
							'FXP/P1/PAX/RADT,VC-UA//P2/PAX/RADT,VC-UA',
							'',
							'',
							'   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
							'01 LIB/MAR           ADT     1     245.00   47.90     292.90',
							'02 LIB/ZIM           ADT     1     245.00   47.90     292.90',
							'',
							'                   TOTALS    2     490.00   95.80     585.80',
							'',
							'1-2 FARE FAMILIES:BLUE-ECONO',
							'1-2 LAST TKT DTE 15AUG18/00:00 LT in POS - SEE ADV PURCHASE',
							'1-2 TICKETS ARE NON-REFUNDABLE',
							'                                                  PAGE  2/ 2',
							' ',
						]),
					},
					{
						'cmd': 'FQQ1',
						'output': php.implode(php.PHP_EOL, [
							'FQQ1',
							'',
							'01 LIB/MAR',
							'',
							'LAST TKT DTE 15AUG18/00:00 LT in POS - SEE ADV PURCHASE',
							'------------------------------------------------------------',
							'     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
							' EWR',
							' FLL B6  1505 P    11SEP 0735  PL2ABEN         11SEP11SEP 2P',
							' BOG AV    37 O    11SEP 1604  OEO00RI9                   2P',
							'',
							'USD   245.00      11SEP18EWR B6 FLL59.53PL2ABEN AV BOG185.00',
							'                  OEO00RI9 NUC244.53END ROE1.000000',
							'USD    18.30-US   XT USD 15.00-JS USD 9.00-XF EWR4.50FLL4.50',
							'USD     5.60-AY',
							'USD    24.00-XT',
							'USD   292.90',
							'FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)',
							'FARE FAMILY:FC1:1:BLUE',
							'FARE FAMILY:FC2:2:ECONO',
							'BG CXR: AV',
							'                                                  PAGE  3/ 4',
							' ',
						]),
					},
					{
						'cmd': 'MD',
						'output': php.implode(php.PHP_EOL, [
							'WARNING - VC UA FAILED TICKET-ABILITY PRE-CHECKS',
							'TICKETS ARE NON-REFUNDABLE',
							'ENDOS /C1 NONREF - FEE FOR CHG/CXL /C2 REFUND FEE APPLIES/ C',
							'      HANGE FEE APPLIES AND PLUS FARE DIFF/NON END -BG:AV',
							'13AUG18 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
							'                                                  PAGE  4/ 4',
							' ',
						]),
					},
				],
			},
		});

		// GDS_DIRECT_EDIT_VOID_TICKETED_PNR logic example - forbidden
		$agentBaseData = GdsDirectDefaults.makeAgentBaseData();
		$list.push({
			'input': {
				'cmdRequested': 'XI',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
				'stubAgents': [
					Agent.makeStub(php.array_merge(GdsDirectDefaults.makeAgentBaseData(), {
						'row': php.array_merge($agentBaseData['row'], {
							'id': '346',
							'login': 'lepin',
							'name': 'Lepin Lepin',
							'team_id': '1',
						}),
						'roleRows': [
							{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_EDIT_VOID_TICKETED_PNR'},
						],
					})),
				],
			},
			'output': {
				'status': 'forbidden',
				'userMessages': [
					'Forbidden command, cant delete fields in ticketed PNR',
				],
				'calledCommands': [],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
					'agent_id': 346, 'isPnrStored': true,
				}),
				'initialCommands': [
					{
						'cmd': 'RT',
						'output': php.implode(php.PHP_EOL, [
							'/$TICKET REVALIDATION/REISSUE IS RECOMMENDED',
							'--- TST RLR MSC SFP ---',
							'RP/SJC1S212D/SJC1S212D            FS/SU  10SEP18/1146Z   RP9FAP',
							'------- PRIORITY',
							'M  STEPAN - EXCH',
							'-------',
							'SJC1S212D/9998WS/6AUG18',
							'  1.JONAS/SPENCER MR(ADT/02OCT91)',
							'  2  LA5094 O 05OCT 5*PDXLAX HK1  1000A1226P 05OCT  E  LA/QIMVHA',
							'  3  LA2477 O 05OCT 5*LAXLIM HK1   200P1245A 06OCT  E  LA/QIMVHA',
							'  4  LA 639 O 06OCT 6*LIMSCL HK1   201A 736A 06OCT  E  LA/QIMVHA',
							'  5  LA 632 A 06NOV 2*SCLLIM HK1   406P 554P 06NOV  E  LA/QIMVHA',
							'  6  LA2476 O 07NOV 3*LIMLAX HK1   150A 745A 07NOV  E  LA/QIMVHA',
							'  7  AS1795 T 07NOV 3 LAXPDX HK1  1100A 135P 07NOV  E  AS/QDPVED',
							'  8 AP =============================',
							'  9 AP =10SEP/PM/ PLS REISSUE FOC DUE TO AIRLINE SCHEDULE CHANGE',
							' 10 AP ==============================',
							' 11 APA SUPPLY HUB',
							' 12 TK OK10SEP/SFO1S2195//ETLA',
							' 13 SSR DOCS LA HK1 ////02OCT91/M//JONAS/SPENCER',
							' 14 SSR CTCE LA HK1 SPENCERJONASAK//GMAIL.COM',
							' 15 SSR CTCM LA HK1 09073171565',
							') ',
						]),
					},
					{
						'cmd': 'MDR',
						'output': php.implode(php.PHP_EOL, [
							'/$ 16 SSR OTHS 1A PLS ADV TKT NBR BEFORE 06AUG18 1841 PDX LT OR',
							'       AUTO CNL',
							' 17 SSR ADTK 1A PLEASE INSERT TKT NUMBER BY 0659/30AUG18 AMS',
							' 18 SSR DOCS LA HK1 ////30JUN73/M//JONAS/SPENCER MR',
							' 19 SSR DOCS LA HK1 ////02OCT91/M//JONAS/SPENCER',
							' 20 SSR DOCS AS HK1 ////02OCT91/M//JONAS/SPENCER/P',
							' 21 SSR DOCS AS HK1 ////30JUN73/M//JONAS/SPENCER/P',
							' 22 OSI LA SKCHG LA5095 LAXPDX 07NOV CNLD',
							' 23 RM *IRF-KUSW-4574805',
							' 24 RM TRANSACTION_ID:25ADF97A-9362-4185-8EAE-BD5BB2655A63',
							' 25 RM CREATED BY SUPPLY_HUB',
							' 26 RM *F* FARE : PUBLISHED FRC LA IT FARE NO',
							' 27 RM ISSUE TICKET TO INTUSA-A PLEASE',
							' 28 RM *U*NOTE NON MOR PSE DO NOT CHANGE FOP',
							' 29 RM *CUSTID-KUSW',
							' 30 RM *Y* TTS2 06AUG-0345 RP9FAP DISPATCHED FROM AMSAA31AT TO',
							'       INTUSA-M = SJC1S212D Q79C 0',
							' 31 RM NO MATCHING RULES FOUND!',
							' 32 RM PICCCADT-890.91',
							' 33 RM *Y* TTS2 06AUG-0830 RP9FAP DISPATCHED FROM AMSAA31AT TO',
							'       INTUSA-A = SFO1S2195 Q81C 0',
							' 34 RM SEVERE: NUMBER OF SEGMENTS DID NOT MATCH!',
							') ',
						]),
					},
					{
						'cmd': 'MDR',
						'output': php.implode(php.PHP_EOL, [
							'/$ 35 RM MAJOR: DEPARTURE TIME CHANGED ON SEGMENT INDEX 2 -',
							'       EARLIER DEPARTURE 10/6/2018 8:14:00 AM != 10/6/2018 2:',
							' 36 RM NO MATCHING RULES FOUND!',
							' 37 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							'       GGAMAUSHAZ/S2-3,6-7',
							' 38 RM *S*/28AUG/BLR/MUNEEBK/MAJOR ASC RE-BOKD OPTIONS/SENT C8',
							' 39 RM *T*10SEP/SENT TO CONSOLIDATOR FOR REISSUE',
							' 40 RM *A*/10SEP/EXC/ REISSUE DONE',
							' 41 FA PAX 045-7129117026-27/ETLA/USD890.91/10SEP18/SFO1S2195/05',
							'       578602/S2-7',
							' 42 FHE 045-7124336801-02',
							' 43 FB PAX 0000000000 TTP/ET/RT/EXCH/T4 OK ETICKET - USD890.91',
							'       /S2-7',
							' 44 FE PAX *M*SKCHG LA5095 LAXPDX 07NOV CNLD NONREF/CHG FEE',
							'       APPLIES/S2-7',
							' 45 FG PAX 0000000000 AMSAA3102/S2-7',
							' 46 FK AMSAA3102',
							' 47 FM *M*8/XO/8',
							' 48 FO 045-7124336805SFO05AUG18/05578602/045-71243368056E1*B783.',
							'       00/X107.91/C0.00',
							' 49 FP O/CASH',
							') ',
						]),
					},
					{'cmd': 'MDR', 'output': php.implode(php.PHP_EOL, ['/$ 50 FV LA', ' '])},
				],
				'performedCommands': [
					{
						'cmd': 'TWD/L41',
						'output': php.implode(php.PHP_EOL, [
							'TKT-0457129117026-027    RCI-                     1A  LOC-RP9FAP',
							' OD-PDXPDX  SI-      FCMI-1   POI-SFO  DOI-10SEP18  IOI-05578602',
							'   1.JONAS/SPENCER MR          ADT            ST',
							' 1 OPDX LA5094AS O 05OCT1000 OK OLESP99R      O   05OCT05OCT 2PC',
							' 2 OLAX LA2477   O 05OCT1400 OK OLESP99R      O   05OCT05OCT 2PC',
							' 3 OLIM LA 639   O 06OCT0201 OK OLESP00F      O   06OCT06OCT 2PC',
							' 4 OSCL LA 632   A 06NOV1606 OK ALESP00F      O   06OCT06OCT 2PC',
							' 5 OLIM LA2476   O 07NOV0150 OK OLESP99R      O   07NOV07NOV 2PC',
							' 6 OLAX AS1795   T 07NOV1100 OK OLESP99R      O   07NOV07NOV 2PC',
							'    PDX',
							'FARE   F USD       783.00',
							'TOTALTAX USD       107.91',
							'TOTAL    USD       890.91 ',
							'/FC PDX LA X/LAX LA LIM Q PDXLIM165.00 M150.00OLESP99R LA SCL Q2',
							' 7.00 58.00OLESP00F LA LIM Q27.00 40.50ALESP00F LA X/LAX LA PDX ',
							'Q LIMPDX165.00 M150.00OLESP99R NUC782.50END ROE1.000000 XF PDX4.',
							'5LAX4.5LAX4.5',
							'FE SKCHG LA5095 LAXPDX 07NOV CNLD NONREF/CHG FEE APPLIES',
							'FO 045-7124336805SFO05AUG18/05578602/045-7124336805-06',
							'FP O/CASH',
							'FOR TAX/FEE DETAILS USE TWD/TAX',
							' ',
						]),
					},
				],
			},
		});

		// GDS_DIRECT_EDIT_VOID_TICKETED_PNR logic example - allowed
		$agentBaseData = GdsDirectDefaults.makeAgentBaseData();
		$list.push({
			'input': {
				'cmdRequested': 'XI',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
				'stubAgents': [
					Agent.makeStub(php.array_merge(GdsDirectDefaults.makeAgentBaseData(), {
						'row': php.array_merge($agentBaseData['row'], {
							'id': '346',
							'login': 'lepin',
							'name': 'Lepin Lepin',
							'team_id': '1',
						}),
						'roleRows': [
							{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_EDIT_VOID_TICKETED_PNR'},
						],
					})),
				],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'XE2,3,4,5,6,7'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
					'agent_id': 346, 'isPnrStored': true,
				}),
				'initialCommands': [
					{
						'cmd': 'RT',
						'output': php.implode(php.PHP_EOL, [
							'/$TICKET REVALIDATION/REISSUE IS RECOMMENDED',
							'--- TST RLR MSC SFP ---',
							'RP/SJC1S212D/SJC1S212D            FS/SU  10SEP18/1146Z   RP9FAP',
							'------- PRIORITY',
							'M  STEPAN - EXCH',
							'-------',
							'SJC1S212D/9998WS/6AUG18',
							'  1.JONAS/SPENCER MR(ADT/02OCT91)',
							'  2  LA5094 O 05OCT 5*PDXLAX HK1  1000A1226P 05OCT  E  LA/QIMVHA',
							'  3  LA2477 O 05OCT 5*LAXLIM HK1   200P1245A 06OCT  E  LA/QIMVHA',
							'  4  LA 639 O 06OCT 6*LIMSCL HK1   201A 736A 06OCT  E  LA/QIMVHA',
							'  5  LA 632 A 06NOV 2*SCLLIM HK1   406P 554P 06NOV  E  LA/QIMVHA',
							'  6  LA2476 O 07NOV 3*LIMLAX HK1   150A 745A 07NOV  E  LA/QIMVHA',
							'  7  AS1795 T 07NOV 3 LAXPDX HK1  1100A 135P 07NOV  E  AS/QDPVED',
							'  8 AP =============================',
							'  9 AP =10SEP/PM/ PLS REISSUE FOC DUE TO AIRLINE SCHEDULE CHANGE',
							' 10 AP ==============================',
							' 11 APA SUPPLY HUB',
							' 12 TK OK10SEP/SFO1S2195//ETLA',
							' 13 SSR DOCS LA HK1 ////02OCT91/M//JONAS/SPENCER',
							' 14 SSR CTCE LA HK1 XXXXXXXXXXXXXK//GMAIL.COM',
							' 15 SSR CTCM LA HK1 XXXXXXXXX65',
							') ',
						]),
					},
					{
						'cmd': 'MDR',
						'output': php.implode(php.PHP_EOL, [
							'/$ 16 SSR OTHS 1A PLS ADV TKT NBR BEFORE 06AUG18 1841 PDX LT OR',
							'       AUTO CNL',
							' 17 SSR ADTK 1A PLEASE INSERT TKT NUMBER BY 0659/30AUG18 AMS',
							' 18 SSR DOCS LA HK1 ////30JUN73/M//JONAS/SPENCER MR',
							' 19 SSR DOCS LA HK1 ////02OCT91/M//JONAS/SPENCER',
							' 20 SSR DOCS AS HK1 ////02OCT91/M//JONAS/SPENCER/P',
							' 21 SSR DOCS AS HK1 ////30JUN73/M//JONAS/SPENCER/P',
							' 22 OSI LA SKCHG LA5095 LAXPDX 07NOV CNLD',
							' 23 RM *IRF-KUSW-4574805',
							' 24 RM TRANSACTION_ID:25ADF97A-9362-4185-8EAE-BD5BB2655A63',
							' 25 RM CREATED BY SUPPLY_HUB',
							' 26 RM *F* FARE : PUBLISHED FRC LA IT FARE NO',
							' 27 RM ISSUE TICKET TO INTUSA-A PLEASE',
							' 28 RM *U*NOTE NON MOR PSE DO NOT CHANGE FOP',
							' 29 RM *CUSTID-KUSW',
							' 30 RM *Y* TTS2 06AUG-0345 RP9FAP DISPATCHED FROM AMSAA31AT TO',
							'       INTUSA-M = SJC1S212D Q79C 0',
							' 31 RM NO MATCHING RULES FOUND!',
							' 32 RM PICCCADT-890.91',
							' 33 RM *Y* TTS2 06AUG-0830 RP9FAP DISPATCHED FROM AMSAA31AT TO',
							'       INTUSA-A = SFO1S2195 Q81C 0',
							' 34 RM SEVERE: NUMBER OF SEGMENTS DID NOT MATCH!',
							') ',
						]),
					},
					{
						'cmd': 'MDR',
						'output': php.implode(php.PHP_EOL, [
							'/$ 35 RM MAJOR: DEPARTURE TIME CHANGED ON SEGMENT INDEX 2 -',
							'       EARLIER DEPARTURE 10/6/2018 8:14:00 AM != 10/6/2018 2:',
							' 36 RM NO MATCHING RULES FOUND!',
							' 37 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
							'       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
							'       GGAMAUSHAZ/S2-3,6-7',
							' 38 RM *S*/28AUG/BLR/MUNEEBK/MAJOR ASC RE-BOKD OPTIONS/SENT C8',
							' 39 RM *T*10SEP/SENT TO CONSOLIDATOR FOR REISSUE',
							' 40 RM *A*/10SEP/EXC/ REISSUE DONE',
							' 41 FA PAX 045-7129117026-27/ETLA/USD890.91/10SEP18/SFO1S2195/05',
							'       578602/S2-7',
							' 42 FHE 045-7124336801-02',
							' 43 FB PAX 0000000000 TTP/ET/RT/EXCH/T4 OK ETICKET - USD890.91',
							'       /S2-7',
							' 44 FE PAX *M*SKCHG LA5095 LAXPDX 07NOV CNLD NONREF/CHG FEE',
							'       APPLIES/S2-7',
							' 45 FG PAX 0000000000 AMSAA3102/S2-7',
							' 46 FK AMSAA3102',
							' 47 FM *M*8/XO/8',
							' 48 FO 045-7124336805SFO05AUG18/05578602/045-71243368056E1*B783.',
							'       00/X107.91/C0.00',
							' 49 FP O/CASH',
							') ',
						]),
					},
					{
						'cmd': 'MDR',
						'output': php.implode(php.PHP_EOL, [
							'/$ 50 FV LA',
							' ',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'TWD/L41',
						'output': php.implode(php.PHP_EOL, [
							'TKT-0457124336801-802    RCI-                     1A  LOC-RP9FAP',
							' OD-PDXPDX  SI-      FCMI-0   POI-SFO  DOI-05AUG18  IOI-05578602',
							'   1.JONAS/SPENCER MR          ADT            ST',
							' 1 OPDX LA5094AS O 05OCT1000 OK OLESP99R      V   05OCT05OCT 2PC',
							' 2 XLAX LA2477   O 05OCT1400 OK OLESP99R      V   05OCT05OCT 2PC',
							' 3 OLIM LA 635   O 06OCT0814 OK OLESP00F      V   06OCT06OCT 2PC',
							' 4 OSCL LA 632   A 06NOV1606 OK ALESP00F      V   06NOV06NOV 2PC',
							' 5 OLIM LA2476   O 07NOV0150 OK OLESP99R      V   07NOV07NOV 2PC',
							' 6 XLAX LA5095AS O 07NOV1255 OK OLESP99R      V   07NOV07NOV 2PC',
							'    PDX',
							'FARE   F USD       783.00',
							'TOTALTAX USD       107.91',
							'TOTAL    USD       890.91 ',
							'/FC PDX LA X/LAX LA LIM Q PDXLIM165.00 M150.00OLESP99R LA SCL Q2',
							'7.00 58.00OLESP00F LA LIM Q27.00 40.50ALESP00F LA X/LAX LA PDX Q',
							' LIMPDX165.00 M150.00OLESP99R NUC782.50END ROE1.000000 XF PDX4.5',
							'LAX4.5LAX4.5',
							'FE NONREF/CHG FEE APPLIES -BG LA',
							'FP CCVIXXXXXXXXXXXX6647/0222/A006888',
							'FOR TAX/FEE DETAILS USE TWD/TAX',
							'SAC-C0454R8MTLF8N8',
							' ',
						]),
					},
					{
						'cmd': 'XE2,3,4,5,6,7',
						'output': php.implode(php.PHP_EOL, [
							'/',
							'WARNING : SEGMENT DELETED - TST WILL BE DELETED IF ET/ER',
							'ITINERARY CANCELLED',
							' ',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'void ticketed PNR role example - SECURED ETKT RECORD(S), session #182694',
				'cmdRequested': 'XE10-12',
				'baseDate': '2019-05-07 19:16:52',
				'ticketDesignators': [],
				'stubAgents': [
					Agent.makeStub(php.array_merge(GdsDirectDefaults.makeAgentBaseData(), {
						'row': php.array_merge($agentBaseData['row'], {
							'id': '346', // '4235',
							'login': 'lepin', // 'Andy',
							'name': 'Lepin Lepin',
							'team_id': '1',
						}),
						'roleRows': [
							{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_EDIT_VOID_TICKETED_PNR'},
						],
					})),
				],
			},
			'output': {
				'status': 'forbidden',
				'userMessages': ['Forbidden command, cant delete fields in ticketed PNR'],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
					'agent_id': 346, 'isPnrStored': true,
				}),
				'initialCommands': [
					{
					    "cmd": "RTWVCGJW",
					    "output": [
					        "/$--- TST RLR SFP ---",
					        "RP/LAXGO3106/LAXGO3106            WS/SU   7MAY19/1814Z   WVCGJW",
					        "------- PRIORITY",
					        "M  STEPAN",
					        "-------",
					        "LAXGO3106/9998WS/25APR19",
					        "  1.STITT/MICHAEL ANDREW",
					        "  2  QF 094 D 08MAY 3 LAXMEL HK1  1040P 730A 10MAY  E  QF/WVCGJW",
					        "  3  QF 093 D 18MAY 6 MELLAX HK1   900A 625A 18MAY  E  QF/WVCGJW",
					        "  4  QF3397 T 18MAY 6 LAXYVR HK1   755P1042P 18MAY  E  QF/WVCGJW",
					        "  5 AP LAX 310 410-3995 - GLOBAL NETWORK N GOWAY TRAVEL - A",
					        "  6 AP 1 312-927-5544-M",
					        "  7 AP 1 312-927-5544-M",
					        "  8 APE MIKE.STITT@GMAIL.COM",
					        "  9 TK OK27APR/LAXGO3100//ETQF",
					        " 10 SSR RQST QF HK1 LAXMEL/21EN,P1/S2   SEE RTSTR",
					        " 11 SSR RQST QF HK1 MELLAX/18EN,P1/S3   SEE RTSTR",
					        " 12 SSR OTHS QF HN1 SEAT 21E/S2",
					        " 13 SSR OTHS QF HN1 SEAT 21E/S2",
					        " 14 SSR DOCS QF HK1 ////05NOV79/M//STITT/MICHAEL ANDREW/",
					        " 15 RM GD-GINA STEVENS/2185/FOR MELINDA GATES/22502/LEAD-1137097",
					        "       8 IN LAXGO3106",
					        ") "
					    ].join("\n"),
					    "duration": "0.364907276",
					    "type": "openPnr",
					    "scrolledCmd": "RTWVCGJW",
					    "state": {"canCreatePq":false,"pricingCmd":null,"area":"A","recordLocator":"WVCGJW","pcc":"SFO1S2195","hasPnr":true,"isPnrStored":true,"cmdType":"openPnr","gdsData":null,"scrolledCmd":"RTWVCGJW","cmdCnt":7}
					},
				],
				'performedCommands': [
					{
					    "cmd": "RT",
					    "output": [
					        "/$--- TST RLR SFP ---",
					        "RP/LAXGO3106/LAXGO3106            WS/SU   7MAY19/1814Z   WVCGJW",
					        "------- PRIORITY",
					        "M  STEPAN",
					        "-------",
					        "LAXGO3106/9998WS/25APR19",
					        "  1.STITT/MICHAEL ANDREW",
					        "  2  QF 094 D 08MAY 3 LAXMEL HK1  1040P 730A 10MAY  E  QF/WVCGJW",
					        "  3  QF 093 D 18MAY 6 MELLAX HK1   900A 625A 18MAY  E  QF/WVCGJW",
					        "  4  QF3397 T 18MAY 6 LAXYVR HK1   755P1042P 18MAY  E  QF/WVCGJW",
					        "  5 AP LAX 310 410-3995 - GLOBAL NETWORK N GOWAY TRAVEL - A",
					        "  6 AP 1 312-927-5544-M",
					        "  7 AP 1 312-927-5544-M",
					        "  8 APE MIKE.STITT@GMAIL.COM",
					        "  9 TK OK27APR/LAXGO3100//ETQF",
					        " 10 SSR RQST QF HK1 LAXMEL/21EN,P1/S2   SEE RTSTR",
					        " 11 SSR RQST QF HK1 MELLAX/18EN,P1/S3   SEE RTSTR",
					        " 12 SSR OTHS QF HN1 SEAT 21E/S2",
					        " 13 SSR OTHS QF HN1 SEAT 21E/S2",
					        " 14 SSR DOCS QF HK1 ////05NOV79/M//STITT/MICHAEL ANDREW/",
					        " 15 RM GD-GINA STEVENS/2185/FOR MELINDA GATES/22502/LEAD-1137097",
					        "       8 IN LAXGO3106",
					        ") "
					    ].join("\n"),
					    "duration": "0.509869062",
					    "type": "redisplayPnr",
					    "scrolledCmd": "RT",
					    "state": {"canCreatePq":false,"pricingCmd":null,"area":"A","recordLocator":"WVCGJW","pcc":"SFO1S2195","hasPnr":true,"isPnrStored":true,"cmdType":"redisplayPnr","gdsData":null,"scrolledCmd":"RT","cmdCnt":8}
					},
					{
					    "cmd": "MDR",
					    "output": [
					        "/$ 16 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:",
					        "       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -",
					        "       GGAMAUSHAZ/S2-4",
					        " 17 RM TICKET NBR MUST BE ADVISED TO QF",
					        " 18 RM NO LATER THAN 02MAY TO AVOID CANCELLATION",
					        " 19 RM WHERE SPECIAL SVC RQSTD-EMD NBR MUST BE ADVD TO QF",
					        " 20 RM AT TIME OF TKT ISSUE OR RISK CANCELLATION OF SVC",
					        " 21 RM FQTV AA-0WVCGJW/QF-FAILED/VERIFY CARD NUMBER",
					        " 22 RM FQTV AA-0DKKGAX/QF-FAILED/VERIFY CARD NUMBER",
					        " 23 RM FQTV AA-0J38M12/QF-FAILED/VERIFY CARD NUMBER",
					        " 24 RM PNR MODIFIED BY THE END USER (TUESDAY-7-MAY-2019)",
					        " 25 RM * 5H-FQ-USD8698.82TOTAL/25.00SUPP COMM/393.00AGENCY COMM",
					        " 26 RM *CN/ITN",
					        " 27 RM *BR/4",
					        " 28 RM *BR/4",
					        " 29 RM *TA/408",
					        " 30 RM *BA/OTP",
					        " 31 RM *SF/8125.00",
					        " 32 RX RESTRICTED",
					        " 33 RX RESTRICTED",
					        " 34 FA PAX 081-7318750793/ETQF/27APR19/LAXGO3100/05669893/S2-4",
					        " 35 FB PAX 0000000000 TTP/INV/ET/RT OK ETICKET OFFER ITR*ADVISE",
					        ") "
					    ].join("\n"),
					    "duration": "0.127277902",
					    "type": "moveRest",
					    "scrolledCmd": "RT",
					    "state": {"canCreatePq":false,"pricingCmd":null,"area":"A","recordLocator":"WVCGJW","pcc":"SFO1S2195","hasPnr":true,"isPnrStored":true,"cmdType":"moveRest","gdsData":null,"scrolledCmd":"RT","cmdCnt":9}
					},
					{
					    "cmd": "MDR",
					    "output": [
					        "/$       PHOTO ID REQUIRED/S2-4",
					        " 36 FE PAX NONEND/RERTE/NONREF W/O REF TO ISSUING OFFCE -BG:QF",
					        "       /S2-4",
					        " 37 FI PAX 0000000000 INV 0810535475/S2-4",
					        " 38 FM *M*393.00A",
					        " 39 FP PAX CCAXXXXXXXXXXXX2007/0224/A162622/S2-4",
					        " 40 FS 82",
					        " 41 FT *1104030",
					        " 42 FV PAX QF/S2-4",
					        " "
					    ].join("\n"),
					    "duration": "0.130019081",
					    "type": "moveRest",
					    "scrolledCmd": "RT",
					    "state": {"canCreatePq":false,"pricingCmd":null,"area":"A","recordLocator":"WVCGJW","pcc":"SFO1S2195","hasPnr":true,"isPnrStored":true,"cmdType":"moveRest","gdsData":null,"scrolledCmd":"RT","cmdCnt":10}
					},
					{
					    "cmd": "TWD/L34",
					    "output": [
					        "SECURED ETKT RECORD(S)",
					        " "
					    ].join("\n"),
					    "duration": "0.459972817",
					    "type": "ticketMask",
					    "scrolledCmd": "TWD/L34",
					    "state": {"canCreatePq":false,"pricingCmd":null,"area":"A","recordLocator":"WVCGJW","pcc":"SFO1S2195","hasPnr":true,"isPnrStored":true,"cmdType":"ticketMask","gdsData":null,"scrolledCmd":"TWD/L34","cmdCnt":11}
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'pricing referencing particular paxes in PNR should not result in format adapter error',
				'cmdRequested': 'FXX/P1/RC05/S3//P2/RADT',
				'baseDate': '2019-05-29 14:29:06',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{cmd: 'FXX/P1/RC05/S3//P2/RADT'},
					{cmd: 'FQQ1'},
					{cmd: 'FQQ2'},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultAmadeusState(),
				'initialCommands': [],
				'performedCommands': [
					{
					    "cmd": "FXX/P1/RC05/S3//P2/RADT",
					    "output": [
					        "FXX/P1/RC05/S3//P2/RADT",
					        "",
					        "",
					        "   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR",
					        "01 LIB/LEP           CNN     1     936.00   99.70    1035.70",
					        "02 LIB/MAR           ADT     1    1248.00   99.70    1347.70",
					        "",
					        "                   TOTALS    2    2184.00  199.40    2383.40",
					        "",
					        "1-2 LAST TKT DTE 10MAY20 - DATE OF ORIGIN",
					        "1-2 250.00 USD PENALTY APPLIES",
					        "                                                  PAGE  2/ 2",
					        " "
					    ].join("\n"),
					},
					{
					    "cmd": "FQQ1",
					    "output": [
					        "FQQ1",
					        "",
					        "01 LIB/LEP",
					        "",
					        "LAST TKT DTE 10MAY20 - DATE OF ORIGIN",
					        "------------------------------------------------------------",
					        "     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG",
					        " JFK",
					        " MNL PR   127 N    10MAY 0145  NLOXFNY/CH25               2P",
					        "",
					        "USD   936.00      10MAY20JFK PR MNL936.00NLOXFNY/CH25 NUC",
					        "                  936.00END ROE1.000000",
					        "USD    70.00-YQ   XT USD 18.60-US USD 5.60-AY USD 4.50-XF",
					        "USD     1.00-YR   JFK4.50",
					        "USD    28.70-XT",
					        "USD  1035.70",
					        "BAG/SEAT/SERVICES AT A CHARGE MAY BE AVAILABLE-ENTER FXK",
					        "TICKET STOCK RESTRICTION",
					        "BG CXR: PR",
					        "PRICED VC PR - OTHER VC AVAILABLE GP HR",
					        "250.00 USD PENALTY APPLIES",
					        "                                                  PAGE  3/ 4",
					        " "
					    ].join("\n"),
					},
					{
					    "cmd": "MD",
					    "output": [
					        "ENDOS PREMIUM ECONOMY FARE RULES APPLY -BG:PR",
					        "29MAY19 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED",
					        "                                                  PAGE  4/ 4",
					        " "
					    ].join("\n"),
					},
					{
					    "cmd": "FQQ2",
					    "output": [
					        "FQQ2",
					        "",
					        "02 LIB/MAR",
					        "",
					        "LAST TKT DTE 10MAY20 - DATE OF ORIGIN",
					        "------------------------------------------------------------",
					        "     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG",
					        " JFK",
					        " MNL PR   127 N    10MAY 0145  NLOXFNY                    2P",
					        "",
					        "USD  1248.00      10MAY20JFK PR MNL1248.00NLOXFNY NUC1248.00",
					        "                  END ROE1.000000",
					        "USD    70.00-YQ   XT USD 18.60-US USD 5.60-AY USD 4.50-XF",
					        "USD     1.00-YR   JFK4.50",
					        "USD    28.70-XT",
					        "USD  1347.70",
					        "BAG/SEAT/SERVICES AT A CHARGE MAY BE AVAILABLE-ENTER FXK",
					        "TICKET STOCK RESTRICTION",
					        "BG CXR: PR",
					        "PRICED VC PR - OTHER VC AVAILABLE GP HR",
					        "250.00 USD PENALTY APPLIES",
					        "                                                  PAGE  3/ 4",
					        " "
					    ].join("\n"),
					},
					{
					    "cmd": "MD",
					    "output": [
					        "ENDOS PREMIUM ECONOMY FARE RULES APPLY -BG:PR",
					        "29MAY19 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED",
					        "                                                  PAGE  4/ 4",
					        " "
					    ].join("\n"),
					},
				],
			},
		});

		//============================
		// problematic cases follow
		//============================

		// would need to stub RBS service response to test that
		// $list.push({
		//     'input': {
		//         'title': 'STORE on a broken private fare - should be repriced with R,P modifier',
		//         'cmdRequested': 'STORE',
		//         'baseDate': '2018-02-22',
		//     },
		//     'output': {
		//         'status': 'executed',
		//         'calledCommands': [
		//             {'cmd': 'FXP/P1/PAX/RADT,P'},
		//         ],
		//     },
		//     'sessionInfo': {
		//         'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
		//             'hasPnr': true, 'lead_creator_id': 2838,
		//         }),
		//         'initialCommands': [
		//             {
		//                 'cmd': 'RT',
		//                 'output': php.implode(php.PHP_EOL, [
		//                     '/$--- SFP ---',
		//                     'RP/SFO1S2195/',
		//                     '  1.LIBERMANE/MARINA',
		//                     '  2  4O2993 S 08NOV 4 JFKMEX DK1  1250A 530A 08NOV  E  0 320 SR',
		//                     '     SEE RTSVC',
		//                     '  3  4O2890 S 08NOV 4 MEXLIM DK1  1000A 500P 08NOV  E  0 320 SR',
		//                     '     SEE RTSVC',
		//                     '  4  4O2891 S 22NOV 4 LIMMEX DK1   615P1140P 22NOV  E  0 320 SR',
		//                     '     SEE RTSVC',
		//                     '  5  4O2990 S 23NOV 5 MEXJFK DK1   610A1155A 23NOV  E  0 320 SR',
		//                     '     SEE RTSVC',
		//                     '  6 RM NOTIFY PASSENGER PRIOR TO TICKET PURCHASE & CHECK-IN:',
		//                     '       FEDERAL LAWS FORBID THE CARRIAGE OF HAZARDOUS MATERIALS -',
		//                     '       GGAMAUSHAZ/S2,5',
		//                     ' ',
		//                 ]),
		//             },
		//         ],
		//         'performedCommands': [
		//             // I slightly cheated on this test, there were no private pricing responses on simple
		//             // command, without R,UP in DB, so I replaced messed with mods here as you can see
		//             {
		//                 'cmd': 'FXP/P1/PAX/RADT',
		//                 'output': php.implode(php.PHP_EOL, [
		//                     'FXP/P1/PAX/RADT,UP',
		//                     '',
		//                     '01 LIBERMANE/MARINA',
		//                     '',
		//                     'LAST TKT DTE 03MAR18/10:04 LT in POS - SEE ADV PURCHASE',
		//                     '------------------------ PRIVATE ---------------------------',
		//                     '     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
		//                     ' NYC',
		//                     ' MEX 4O  2993 S    08NOV 0050  SRTOO           08NOV08NOV',
		//                     ' LIM 4O  2890 S    08NOV 1000  S7RTOO          08NOV08NOV',
		//                     ' MEX 4O  2891 S    22NOV 1815  S7RTOO          22NOV22NOV',
		//                     ' NYC 4O  2990 S    23NOV 0610  SRTOO           23NOV23NOV',
		//                     '',
		//                     'USD   598.00      08NOV18NYC 4O MEX121.50SRTOO 4O LIM177.50S',
		//                     '                  7RTOO 4O MEX177.50S7RTOO 4O NYC121.50SRTOO',
		//                     'USD     5.65YC    NUC598.00END ROE1.000000',
		//                     'USD    18.30US    XT USD 18.30US USD 3.96XA USD 7.00XY USD',
		//                     'USD    85.11XT    5.60AY USD 15.00DY USD 30.75HW USD 4.50XF',
		//                     'USD   707.06      JFK4.50',
		//                     'NO BAG INCLUDED FOR AT LEAST ONE FLIGHT',
		//                     'NO CHARGEABLE ANCILLARY SERVICE',
		//                     '                                                  PAGE  2/ 3',
		//                     ' ',
		//                 ]),
		//             },
		//             {
		//                 'cmd': 'MD',
		//                 'output': php.implode(php.PHP_EOL, [
		//                     'PRIVATE RATES USED *F*',
		//                     'TICKET STOCK RESTRICTION',
		//                     'BG CXR: 4O',
		//                     'PRICED WITH VALIDATING CARRIER 4O - REPRICE IF DIFFERENT VC',
		//                     'TICKETS ARE NON-REFUNDABLE',
		//                     'ENDOS NON REFUNDABLE CHNG SUBJ TO FEE -BG:4O',
		//                     '01MAR18 PER GAF REQUIREMENTS FARE NOT VALID UNTIL TICKETED',
		//                     '                                                  PAGE  3/ 3',
		//                     ' ',
		//                 ]),
		//             },
		//             {
		//                 'cmd': 'TTE/ALL',
		//                 'output': php.implode(php.PHP_EOL, [
		//                     '/',
		//                     'TST DELETED',
		//                     ' ',
		//                 ]),
		//             },
		//             {
		//                 'cmd': 'FXP/P1/PAX/RADT,P',
		//                 'output': php.implode(php.PHP_EOL, [
		//                     'FXP/P1/PAX/RADT,P',
		//                     '',
		//                     '01 LIBERMANE/MARINA',
		//                     '',
		//                     'LAST TKT DTE 03MAR18/10:04 LT in POS - SEE ADV PURCHASE',
		//                     '------------------------------------------------------------',
		//                     '     AL FLGT  BK   DATE  TIME  FARE BASIS      NVB  NVA   BG',
		//                     ' NYC',
		//                     ' MEX 4O  2993 S    08NOV 0050  SOO             08NOV08NOV',
		//                     ' LIM 4O  2890 S    08NOV 1000  SOO             08NOV08NOV',
		//                     ' MEX 4O  2891 S    22NOV 1815  SOO             22NOV22NOV',
		//                     ' NYC 4O  2990 S    23NOV 0610  SOO             23NOV23NOV',
		//                     '',
		//                     'USD   702.00      08NOV18NYC 4O MEX151.00SOO 4O LIM200.00SOO',
		//                     '                  4O MEX200.00SOO 4O NYC151.00SOO NUC702.00',
		//                     'USD     5.65YC    END ROE1.000000',
		//                     'USD    18.30US    XT USD 18.30US USD 3.96XA USD 7.00XY USD',
		//                     'USD    85.11XT    5.60AY USD 15.00DY USD 30.75HW USD 4.50XF',
		//                     'USD   811.06      JFK4.50',
		//                     'NO BAG INCLUDED FOR AT LEAST ONE FLIGHT',
		//                     'NO CHARGEABLE ANCILLARY SERVICE',
		//                     '                                                  PAGE  2/ 3',
		//                     ' ',
		//                 ]),
		//             },
		//         ],
		//     },
		// });

		// // would need to stub session creation here
		// $list.push({
		// 	'input': {
		// 		'title': 'RE/ example',
		// 		'cmdRequested': 'RE/NYC1S2186/SS',
		// 		'baseDate': '2018-02-22',
		// 	},
		// 	'output': {
		// 		'status': 'executed',
		// 		'sessionData': {
		// 			'area': 'B',
		// 			'pcc': 'NYC1S2186',
		// 			'hasPnr': true,
		// 		},
		// 		'calledCommands': [
		// 			{'cmd': 'RT'},
		// 		],
		// 	},
		// 	'sessionInfo': {
		// 		'initialState': php.array_merge(GdsDirectDefaults.makeDefaultAmadeusState(), {
		// 			'agent_id': 1588, 'lead_creator_id': 2838,
		// 		}),
		// 		'initialCommands': [],
		// 		'performedCommands': [
		// 			{
		// 				'cmd': 'RTAM',
		// 				'output': php.implode(php.PHP_EOL, [
		// 					'/$RP/SFO1S2195/',
		// 					'  1  SU1845 D 10MAY 4 KIVSVO HK1           1250A 345A   *1A/E*',
		// 					'                                                      A01',
		// 					'  2  SU2682 D 10MAY 4 SVORIX HK1        D   915A1050A   *1A/E*',
		// 					'                                                      A01',
		// 					' ',
		// 				]),
		// 			},
		// 			{'cmd': 'IG', 'output': php.implode(php.PHP_EOL, ['/', 'IGNORED', ' '])},
		// 			{
		// 				'cmd': 'JD',
		// 				'output': php.implode(php.PHP_EOL, [
		// 					'/$',
		// 					'00000000         SFO1S2195                                     ',
		// 					'',
		// 					'AREA  TM  MOD SG/DT.LG TIME      ACT.Q   STATUS     NAME ',
		// 					'A-IN      PRD WS/SU.EN  24             SIGNED       ',
		// 					'B                                      NOT SIGNED   ',
		// 					'C                                      NOT SIGNED   ',
		// 					'D                                      NOT SIGNED   ',
		// 					'E                                      NOT SIGNED   ',
		// 					'F                                      NOT SIGNED   ',
		// 					' ',
		// 				]),
		// 			},
		// 			// ... pcc change here ...
		// 			{
		// 				'cmd': 'JD',
		// 				'output': php.implode(php.PHP_EOL, [
		// 					'/$',
		// 					'00000000         NYC1S2186                                     ',
		// 					'',
		// 					'AREA  TM  MOD SG/DT.LG TIME      ACT.Q   STATUS     NAME ',
		// 					'A-IN      PRD WS/SU.EN  24             SIGNED       ',
		// 					'B                                      NOT SIGNED   ',
		// 					'C                                      NOT SIGNED   ',
		// 					'D                                      NOT SIGNED   ',
		// 					'E                                      NOT SIGNED   ',
		// 					'F                                      NOT SIGNED   ',
		// 					' ',
		// 				]),
		// 			},
		// 			{
		// 				'cmd': 'SSSU1845Y10MAYKIVSVO1',
		// 				'output': php.implode(php.PHP_EOL, [
		// 					'/$RP/NYC1S2186/',
		// 					'  1  SU1845 Y 10MAY 4 KIVSVO DK1  1250A 345A 10MAY  E  0 32A S',
		// 					'     SEE RTSVC',
		// 					' ',
		// 				]),
		// 			},
		// 			{
		// 				'cmd': 'SSSU2682Y10MAYSVORIX1',
		// 				'output': php.implode(php.PHP_EOL, [
		// 					'/$--- MSC ---',
		// 					'RP/NYC1S2186/',
		// 					'  1  SU1845 Y 10MAY 4*KIVSVO DK1  1250A 345A 10MAY  E  0 32A S',
		// 					'     SEE RTSVC',
		// 					'  2  SU2682 Y 10MAY 4*SVORIX DK1   915A1050A 10MAY  E  0 73H S',
		// 					'     010 BT 7425',
		// 					'     SEE RTSVC',
		// 					' ',
		// 				]),
		// 			},
		// 			{
		// 				'cmd': 'SBD1,2',
		// 				'output': php.implode(php.PHP_EOL, [
		// 					'/$--- MSC ---',
		// 					'RP/NYC1S2186/',
		// 					'  1  SU1845 D 10MAY 4*KIVSVO DK1  1250A 345A 10MAY  E  0 32A D',
		// 					'     SEE RTSVC',
		// 					'  2  SU2682 D 10MAY 4*SVORIX DK1   915A1050A 10MAY  E  0 73H S',
		// 					'     SEE RTSVC',
		// 					' ',
		// 				]),
		// 			},
		// 		],
		// 	},
		// });

		$argumentTuples = [];
		for ($testCase of Object.values($list)) {
			$argumentTuples.push([$testCase['input'], $testCase['output'], $testCase['sessionInfo']]);
		}

		return $argumentTuples;
	}

	/**
	 * @test
	 * @dataProvider provideTestForgeAreasDumpCases
	 */
	testForgeViewAreasDump($sessionData, $areas, $expected) {
		let $actual;

		$actual = ProcessAmadeusTerminalInputAction.forgeViewAreasDump($sessionData, $areas);
		this.assertEquals($expected, $actual);
	}

	/**
	 * @test
	 * @dataProvider provideExecuteTestCases
	 */
	async testExecute($input, $output, $sessionInfo) {
		let $session, $actualOutput;

		$session = GdsDirectDefaults.makeStatefulSession('amadeus', $input, $sessionInfo);
		$actualOutput = await (new ProcessAmadeusTerminalInputAction($session))
			.execute($input['cmdRequested']).catch(exc => ({error: exc + ''}));
		$actualOutput['sessionData'] = $session.getSessionData();

		this.assertArrayElementsSubset($output, $actualOutput, php.implode('; ', $actualOutput['userMessages'] || ['no errors']));
		this.assertEquals([], $session.getGdsSession().getCommandsLeft(), 'not all session commands were used');
	}

	getTestMapping() {
		return [
			[this.provideExecuteTestCases, this.testExecute],
			[this.provideTestForgeAreasDumpCases, this.testForgeViewAreasDump],
		];
	}
}

ProcessAmadeusTerminalInputActionTest.count = 0;
module.exports = ProcessAmadeusTerminalInputActionTest;
