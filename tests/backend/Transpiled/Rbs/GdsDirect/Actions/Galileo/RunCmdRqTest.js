const PtcFareFamilies = require('../../../../../../../backend/Repositories/PtcFareFamilies.js');
const stubPtcFareFamilies = require('../../../../../../data/stubPtcFareFamilies.js');
const PtcUtil = require('../../../../../../../backend/Transpiled/Rbs/Process/Common/PtcUtil.js');

const GdsDirectDefaults = require('../../../../Rbs/TestUtils/GdsDirectDefaults.js');
const RunCmdRq = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Galileo/RunCmdRq.js');

const php = require('../../../../php.js');
const Agent = require("../../../../../../../backend/DataFormats/Wrappers/Agent");

class RunCmdRqTest extends require('../../../../Lib/TestCase.js') {
	static makeTableRows($keys, $valuesPerRow) {
		let $rows, $values;

		$rows = [];
		for ($values of Object.values($valuesPerRow)) {
			$rows.push(php.array_combine($keys, $values));
		}
		return $rows;
	}

	provideTestCases() {
		let $list, $agentBaseDate, $argumentTuples, $testCase;

		$list = [];

		$list.push({
			'input': {
				'title': 'EM - "store and send email" should be forbidden for everyone',
				'cmdRequested': 'EM',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'forbidden',
				'userMessages': ['FORBIDDEN COMMAND'],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588,
				}),
				'initialCommands': [],
				'performedCommands': [],
			},
		});

		$list.push({
			'input': {
				'title': 'SOF - "sign off" should be forbidden for everyone',
				'cmdRequested': 'SOF',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'forbidden',
				'userMessages': ['FORBIDDEN COMMAND'],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588,
				}),
				'initialCommands': [],
				'performedCommands': [],
			},
		});

		$list.push({
			'input': {
				'title': 'TKP1P2 - "issue tickets" should be forbidden for simple agents like Prince',
				'cmdRequested': 'TKP1P2',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'forbidden',
				'userMessages': ['FORBIDDEN COMMAND'],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588,
				}),
				'initialCommands': [],
				'performedCommands': [],
			},
		});

		$list.push({
			'input': {
				'title': 'Q... - queue commands should be forbidden for simple agents',
				'cmdRequested': 'QCA',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'forbidden',
				'userMessages': ['FORBIDDEN COMMAND'],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588,
				}),
				'initialCommands': [],
				'performedCommands': [],
			},
		});

		$agentBaseDate = GdsDirectDefaults.makeAgentBaseData();
		$list.push({
			'input': {
				'title': '*-... - PNR search should be forbidden for agents without a corresponding role',
				'cmdRequested': '*-',
				'baseDate': '2017-11-05',
				'stubAgents': [
					Agent.makeStub(php.array_merge($agentBaseDate, {
						'row': php.array_merge($agentBaseDate['row'], {
							'id': '346',
							'login': 'lepin',
							'name': 'Lepin Lepin',
							'team_id': '1',
						}),
						'roleRows': [
							{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_ACCESS'},
						],
					})),
				],
			},
			'output': {
				'status': 'forbidden',
				'userMessages': ['FORBIDDEN COMMAND'],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 346,
				}),
				'initialCommands': [],
				'performedCommands': [],
			},
		});

		$list.push({
			'input': {
				'title': 'RE/ example: BK -> HS and seat count change',
				'cmdRequested': 'RE/711M/SS2',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1. UA 5695 Y  05SEP SFOMCI HS2   555P  1114P O          WE',
							'         OPERATED BY SKYWEST DBA UNITED EXPR',
							' 2. CX  901 Y  26MAY HKGMNL HS2   900A  1125A O          SA',
							' 3. KE 7246 L  30MAY TPAJFK HS2   735P  1020P O          WE',
							'         OPERATED BY DELTA AIR LINES',
							'><',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588, 'hasPnr': true,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1. UA 5695 Y  05SEP SFOMCI BK1   555P  1114P            WE',
							'         OPERATED BY SKYWEST DBA UNITED EXPR',
							' 2. CX  901 Y  26MAY HKGMNL BK1   900A  1125A            SA',
							' 3. KE 7246 L  30MAY TPAJFK BK1   735P  1020P            WE',
							'         OPERATED BY DELTA AIR LINES',
							'><',
						]),
					},
					{'cmd': 'I', 'output': php.implode(php.PHP_EOL, ['IGNORED', '><'])},
					{
						'cmd': 'SB',
						'output': php.implode(php.PHP_EOL, [
							'A-OUT B-IN AG-NOT AUTHORISED - GALILEO',
							'><',
						]),
					},
					{
						'cmd': 'SEM/711M/AG',
						'output': php.implode(php.PHP_EOL, [
							'PROCEED/23MAR-INTERNATIONAL TVL NETWOR ATL - GALILEO',
							'><',
						]),
					},
					{
						'cmd': '0UA5695Y05SEPSFOMCINN2',
						'output': php.implode(php.PHP_EOL, [
							' 1. UA 5695 Y   5SEP SFOMCI HS2   555P  1114P O                 OPERATED BY SKYWEST DBA UNITED EXPRESS                          DEPARTS SFO TERMINAL 3  - ARRIVES MCI TERMINAL C                *ADV PAX FLT ARRIVES TERMINAL-C*',
							'*ADV PAX FLT DEPARTS TERMINAL-3*',
							'*OPERATED BY-SKYWEST DBA UNITED EXPRESS*',
							'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS  ',
							'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
							'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
							'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
							'OFFER CAR/HOTEL      >CAL;       >HOA; ',
							'><',
						]),
					},
					{
						'cmd': '0CX901Y26MAYHKGMNLNN2',
						'output': php.implode(php.PHP_EOL, [
							' 2. CX  901 Y  26MAY HKGMNL HS2   900A  1125A O                 DEPARTS HKG TERMINAL 1  - ARRIVES MNL TERMINAL 3                ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS  ',
							'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
							'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
							'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
							'OFFER CAR/HOTEL      >CAL;       >HOA; ',
							'><',
						]),
					},
					{
						'cmd': '0KE7246Y30MAYTPAJFKAK2',
						'output': php.implode(php.PHP_EOL, [
							' 3. KE 7246 Y  30MAY TPAJFK BK2   735P  1020P                   OPERATED BY DELTA AIR LINES                                                              ARRIVES JFK TERMINAL 4                 VALID FOR INTL ONLINE STOP/CONNECTIONS ONLY                     OFFER CAR/HOTEL      >CAL;       >HOA; ',
							'><',
						]),
					},
					{
						'cmd': '@3/L',
						'output': ' 3. KE 7246 L  30MAY TPAJFK HS2   735P  1020P O                 OPERATED BY DELTA AIR LINES                                                              ARRIVES JFK TERMINAL 4                 VALID FOR INTL ONLINE STOP/CONNECTIONS ONLY                     ><',
					},
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1. UA 5695 Y  05SEP SFOMCI HS2   555P  1114P O          WE',
							'         OPERATED BY SKYWEST DBA UNITED EXPR',
							' 2. CX  901 Y  26MAY HKGMNL HS2   900A  1125A O          SA',
							' 3. KE 7246 L  30MAY TPAJFK HS2   735P  1020P O          WE',
							'         OPERATED BY DELTA AIR LINES',
							'><',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'RE/ example: HS -> AK -> HS',
				'cmdRequested': 'RE/69KS/SS',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1. PS  898 D  10MAY KIVKBP HS1   720A   825A O          TH',
							' 2. BT 7405 D  10MAY KBPRIX HS1   920A  1055A O          TH',
							'         OPERATED BY UKRAINE INTERNATIONAL A',
							' 3. AF 7985 C  20MAY RIXCDG HS1   355P   545P O          SU',
							'         OPERATED BY AIR BALTIC CORPORATION',
							'><',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588, 'hasPnr': true,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1. PS  898 D  10MAY KIVKBP HS1   720A   825A O          TH',
							' 2. BT 7405 D  10MAY KBPRIX HS1   920A  1055A O          TH',
							'         OPERATED BY UKRAINE INTERNATIONAL A',
							' 3. AF 7985 C  20MAY RIXCDG HS1   355P   545P O          SU',
							'         OPERATED BY AIR BALTIC CORPORATION',
							'><',
						]),
					},
					{'cmd': 'I', 'output': php.implode(php.PHP_EOL, ['IGNORED', '><'])},
					{
						'cmd': 'SB',
						'output': php.implode(php.PHP_EOL, [
							'A-OUT B-IN AG-NOT AUTHORISED - GALILEO',
							'><',
						]),
					},
					{
						'cmd': 'SEM/69KS/AG',
						'output': php.implode(php.PHP_EOL, [
							'PROCEED/23MAR-INTERNATIONAL TVL NETWOR ATL - GALILEO',
							'><',
						]),
					},
					{
						'cmd': '0PS898Y10MAYKIVKBPAK1',
						'output': php.implode(php.PHP_EOL, [
							' 1. PS  898 Y  10MAY KIVKBP AK1   720A   825A                   CLASS NOT FOUND',
							'OFFER CAR/HOTEL      >CAL;       >HOA; ',
							'><',
						]),
					},
					{
						'cmd': '0BT7405Y10MAYKBPRIXAK1',
						'output': php.implode(php.PHP_EOL, [
							' 2. BT 7405 Y  10MAY KBPRIX AK1   920A  1055A                   OPERATED BY UKRAINE INTERNATIONAL AI                            OFFER CAR/HOTEL      >CAL;       >HOA; ',
							'><',
						]),
					},
					{
						'cmd': '0AF7985Y20MAYRIXCDGAK1',
						'output': php.implode(php.PHP_EOL, [
							' 3. AF 7985 Y  20MAY RIXCDG AK1   355P   545P                   OPERATED BY AIR BALTIC CORPORATION S                                                     ARRIVES CDG TERMINAL 2D                OFFER CAR/HOTEL      >CAL;       >HOA; ',
							'><',
						]),
					},
					{
						'cmd': '@1.2/D',
						'output': php.implode(php.PHP_EOL, [
							' 1. PS  898 D  10MAY KIVKBP HS1   720A   825A O                 *FULL PASSPORT DATA IS MANDATORY*',
							' 2. BT 7405 D  10MAY KBPRIX HS1   920A  1055A O                 OPERATED BY UKRAINE INTERNATIONAL AI                             3. AF 7985 D  20MAY RIXCDG HS1   355P   545P O                 OPERATED BY AIR BALTIC CORPORATION S                                                     ARRIVES CDG TERMINAL 2D                ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS  ',
							'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
							'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
							'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
							'><',
						]),
					},
					{
						'cmd': '@3/C',
						'output': php.implode(php.PHP_EOL, [
							' 3. AF 7985 C  20MAY RIXCDG HS1   355P   545P O                 OPERATED BY AIR BALTIC CORPORATION S                                                     ARRIVES CDG TERMINAL 2D                ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS  ',
							'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
							'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
							'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
							'><',
						]),
					},
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1. PS  898 D  10MAY KIVKBP HS1   720A   825A O          TH',
							' 2. BT 7405 D  10MAY KBPRIX HS1   920A  1055A O          TH',
							'         OPERATED BY UKRAINE INTERNATIONAL A',
							' 3. AF 7985 C  20MAY RIXCDG HS1   355P   545P O          SU',
							'         OPERATED BY AIR BALTIC CORPORATION',
							'><',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'no marriage, different booking classes, also "*0 AVAIL/WL CLOSED*"',
				'cmdRequested': 'RE/69KS/SS',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'forbidden',
				'calledCommands': [
					{'cmd': 'SB'},
					{'cmd': 'SEM/69KS/AG'},
					{'cmd': '0DL4370Y08AUGLHRJFKAK1'},
					{'cmd': '0PR126Y08MAYMNLYVRAK4'},
					{'cmd': '@1/D'},
					{'cmd': '@2/T'},
					{'cmd': '*R'},
				],
				'userMessages': [
					'SOME FLIGHTS DID NOT HAVE ENOUGH SEATS AVAILABLE IN REQUESTED BOOKING CODE - 2',
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588, 'hasPnr': true,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1. DL 4370 D  08AUG LHRJFK HS1   900A  1145A O          WE',
							'         OPERATED BY VIRGIN ATLANTIC',
							' 2. PR  126 T  08MAY MNLYVR BK4   300P  1220P            TU',
							'><',
						]),
					},
					{'cmd': 'I', 'output': php.implode(php.PHP_EOL, ['IGNORED', '><'])},
					{
						'cmd': 'SB',
						'output': php.implode(php.PHP_EOL, [
							'A-OUT B-IN AG-NOT AUTHORISED - GALILEO',
							'><',
						]),
					},
					{
						'cmd': 'SEM/69KS/AG',
						'output': php.implode(php.PHP_EOL, [
							'PROCEED/23MAR-INTERNATIONAL TVL NETWOR ATL - GALILEO',
							'><',
						]),
					},
					{
						'cmd': '0DL4370Y08AUGLHRJFKAK1',
						'output': php.implode(php.PHP_EOL, [
							' 1. DL 4370 Y   8AUG LHRJFK AK1   900A  1145A                   OPERATED BY VIRGIN ATLANTIC                                     DEPARTS LHR TERMINAL 3  - ARRIVES JFK TERMINAL 4                NOT VALID FOR INTERLINE CONNECTIONS                             OFFER CAR/HOTEL      >CAL;       >HOA; ',
							'><',
						]),
					},
					{
						'cmd': '0PR126Y08MAYMNLYVRAK4',
						'output': php.implode(php.PHP_EOL, [
							' 2. PR  126 Y   8MAY MNLYVR AK4   300P  1220P                   DEPARTS MNL TERMINAL 2  - ARRIVES YVR TERMINAL M                OFFER CAR/HOTEL      >CAL;       >HOA; ',
							'><',
						]),
					},
					{
						'cmd': '@1/D',
						'output': php.implode(php.PHP_EOL, [
							' 1. DL 4370 D  08AUG LHRJFK HS1   900A  1145A O                 OPERATED BY VIRGIN ATLANTIC                                     DEPARTS LHR TERMINAL 3  - ARRIVES JFK TERMINAL 4                NOT VALID FOR INTERLINE CONNECTIONS                             **DL CODE SHARE-QUOTE OPERATED BY VIRGIN ATLAN AS VS FLT 3   *',
							'*LOCAL AND ONLINE CONNECTING TRAFFIC ONLY*',
							' 2. PR  126 D  08MAY MNLYVR HS4   300P  1220P O                 DEPARTS MNL TERMINAL 2  - ARRIVES YVR TERMINAL M                ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS  ',
							'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
							'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
							'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
							'><',
						]),
					},
					{
						'cmd': '@2/T',
						'output': php.implode(php.PHP_EOL, [
							'*0 AVAIL/WL CLOSED*',
							'><',
						]),
					},
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							' 1. DL 4370 D  08AUG LHRJFK HS1   900A  1145A O          WE',
							'         OPERATED BY VIRGIN ATLANTIC',
							' 2. PR  126 Y  08MAY MNLYVR AK4   300P  1220P            TU',
							'><',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'attempt to cancel GD- remark should be forbidden',
				'cmdRequested': 'NP.1@',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'forbidden',
				'userMessages': [
					'Forbidden command, cant change GDS Direct \"CREATED FOR\" remark on line 1',
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588, 'hasPnr': true,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'SJ5TBK/WS QSBIV VTL9WS  AG 05578602 27MAR',
							'  1.1PROKOPCHUK/ALENA   2.I/1PROKOPCHUK/SASHA*15FEB18',
							' 1. PS  898 D  10MAY KIVKBP HK1   720A   825A O*         TH  2',
							' 2. PS  185 D  10MAY KBPRIX HK1   920A  1055A O*         TH  2',
							'** FILED FARE DATA EXISTS **           >*FF;',
							'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
							'** VENDOR REMARKS DATA EXISTS **       >*VR;',
							'** SERVICE INFORMATION EXISTS **       >*SI;',
							'FONE-PIXR',
							'TKTG-TAU/WE04APR',
							'NOTE-',
							'  1. GD-PRINCE/1588/FOR STANISLAW/2838/LEAD-1 IN 711M WS 27MAR 1     609Z',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'  2. DEV TESTING PLS IGNORE WS 27MAR 1609Z',
							'><',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'but normal remark deletion should be allowed',
				'cmdRequested': 'NP.2@',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'NP.2@'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588, 'hasPnr': true,
				}),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'SJ5TBK/WS QSBIV VTL9WS  AG 05578602 27MAR',
							'  1.1PROKOPCHUK/ALENA   2.I/1PROKOPCHUK/SASHA*15FEB18',
							' 1. PS  898 D  10MAY KIVKBP HK1   720A   825A O*         TH  2',
							' 2. PS  185 D  10MAY KBPRIX HK1   920A  1055A O*         TH  2',
							'** FILED FARE DATA EXISTS **           >*FF;',
							'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
							'** VENDOR REMARKS DATA EXISTS **       >*VR;',
							'** SERVICE INFORMATION EXISTS **       >*SI;',
							'FONE-PIXR',
							'TKTG-TAU/WE04APR',
							'NOTE-',
							'  1. GD-PRINCE/1588/FOR STANISLAW/2838/LEAD-1 IN 711M WS 27MAR 1     609Z',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'  2. DEV TESTING PLS IGNORE WS 27MAR 1609Z',
							'><',
						]),
					},
				],
				'performedCommands': [
					{'cmd': 'NP.2@', 'output': php.implode(php.PHP_EOL, [' *', '><'])},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'protection against crafty agents',
				'cmdRequested': 'NP./0ASD|NP.3@ASD',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'forbidden',
				'userMessages': ['Forbidden command, do not use >NP./...; and >NP.3@ASD; at the same time'],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588, 'hasPnr': true,
				}),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'SJ5TBK/WS QSBIV VTL9WS  AG 05578602 27MAR',
							'  1.1PROKOPCHUK/ALENA   2.I/1PROKOPCHUK/SASHA*15FEB18',
							' 1. PS  898 D  10MAY KIVKBP HK1   720A   825A O*         TH  2',
							' 2. PS  185 D  10MAY KBPRIX HK1   920A  1055A O*         TH  2',
							'** FILED FARE DATA EXISTS **           >*FF;',
							'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
							'** VENDOR REMARKS DATA EXISTS **       >*VR;',
							'** SERVICE INFORMATION EXISTS **       >*SI;',
							'FONE-PIXR',
							'TKTG-TAU/WE04APR',
							'NOTE-',
							'  1. ASD WS 27MAR 1842Z',
							'  2. GD-PRINCE/1588/FOR STANISLAW/2838/LEAD-1 IN 711M WS 27MAR 1)><',
						]),
					},
				],
				'performedCommands': [],
			},
		});

		$list.push({
			'input': {
				'title': '#11 - attempt to cancel GD- remark with a range select in a complex command - should be forbidden',
				'cmdRequested': 'NP.OLOLO|NP.1.3-5.7@|ER',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'forbidden',
				'userMessages': ['Forbidden command, cant change GDS Direct \"CREATED FOR\" remark on line 4'],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588, 'hasPnr': true,
				}),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'SJ5TBK/WS QSBIV VTL9WS  AG 05578602 27MAR',
							'  1.1PROKOPCHUK/ALENA   2.I/1PROKOPCHUK/SASHA*15FEB18',
							' 1. PS  898 D  10MAY KIVKBP HK1   720A   825A O*         TH  2',
							' 2. PS  185 D  10MAY KBPRIX HK1   920A  1055A O*         TH  2',
							'** FILED FARE DATA EXISTS **           >*FF;',
							'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
							'** VENDOR REMARKS DATA EXISTS **       >*VR;',
							'** SERVICE INFORMATION EXISTS **       >*SI;',
							'FONE-PIXR',
							'TKTG-TAU/WE04APR',
							'NOTE-',
							'  1. DSA WS 27MAR 1847Z',
							'  2. ASSSSSD WS 27MAR 1847Z',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'  3. ASD WS 27MAR 1847Z',
							'  4. GD-PRINCE/1588/FOR STANISLAW/2838/LEAD-1 IN 711M WS 27MAR 1     609Z',
							'  5. DEV TESTING PLS IGNORE WS 27MAR 1609Z',
							'  6. 0ASD WS 27MAR 1846Z',
							'  7. VCX WS 27MAR 1847Z',
							'><',
						]),
					},
				],
				'performedCommands': [],
			},
		});

		$list.push({
			'input': {
				'title': '#12 - STOREJCB example',
				'cmdRequested': 'STOREJCB',
				'baseDate': '2017-11-05',
			},
			'output': {'status': 'executed'},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588, 'hasPnr': true,
				}),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'  1.2LIBERMANE/MARINA/ZIMICH   3.I/1LIBERMANE/LEPIN*25JAN18',
							'  4.1LIBERMANE/STAS*C05',
							' 1. PS  898 N  10MAY KIVKBP HS3   720A   825A O        E TH',
							' 2. BT 7405 Y  10MAY KBPRIX HS3   920A  1055A O        E TH',
							'         OPERATED BY UKRAINE INTERNATIONAL A',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'FQP1*JCB.2*JCB.3*JNF.4*J05',
						'output': php.implode(php.PHP_EOL, [
							'>FQP1*JCB.2*JCB.3*JNF.4*J05',
							'   PSGR                  FARE     TAXES         TOTAL PSG DES   FQG 1-2       USD     1143.00      59.50      2405.00 ADT           GUARANTEED AT TIME OF TICKETING                             FQG 3         USD      115.00       2.00       117.00 JNF           GUARANTEED AT TIME OF TICKETING                             FQG 4         USD      858.00      59.50       917.50 J05           GUARANTEED AT TIME OF TICKETING                             GRAND TOTAL INCLUDING TAXES ****     USD      3439.50                        **ADDITIONAL FEES MAY APPLY**SEE >FO; ',
							'       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQ/DASO;',
							'    JCB      BEST FARE FOR THIS PASSENGER                           JCB      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.232589USD   )><',
						]),
					},
					{
						'cmd': 'MR',
						'output': '    JCB      LAST DATE TO PURCHASE TICKET: 10MAY18                  JCB      TICKETING AGENCY 711M                                  JCB      DEFAULT PLATING CARRIER PS                             JCB      E-TKT REQUIRED                                         JNF      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.229081USD       JNF      LAST DATE TO PURCHASE TICKET: 10MAY18                  JNF      TICKETING AGENCY 711M                                  JNF      DEFAULT PLATING CARRIER PS                             JNF      E-TKT REQUIRED                                         J05      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.229081USD       J05      LAST DATE TO PURCHASE TICKET: 10MAY18                  J05      TICKETING AGENCY 711M                                  J05      DEFAULT PLATING CARRIER PS                         )><',
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'    J05      E-TKT REQUIRED                                     BAGGAGE ALLOWANCE',
							'JCB',
							' PS KIVRIX  1PC  ',
							'   BAG 1 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ',
							'   BAG 2 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
							'                                                               ',
							'CARRY ON ALLOWANCE',
							' PS KIVIEV  07K   ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							' PS IEVRIX  07K   ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'JNF',
							' PS KIVRIX  1PC  ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
							'   BAG 2 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
							'                                                               ',
							'CARRY ON ALLOWANCE',
							' PS KIVIEV  05K   ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							' PS IEVRIX  05K   ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'JNN',
							' PS KIVRIX  1PC  ',
							'   BAG 1 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ',
							'   BAG 2 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSPS.BAGG             ',
							'                                                               ',
							'CARRY ON ALLOWANCE',
							' PS KIVIEV  07K   ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							' PS IEVRIX  07K   ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'                                                               ',
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'><',
						]),
					},
				],
			},
		});

		// STOREITX example with private fare and our ticket designator (informative fare)
		// should not be re-priced with :N
		$list.push({
			'input': {
				'cmdRequested': 'STOREITX',
				'baseDate': '2017-11-05',
				'ticketDesignators': this.constructor.makeTableRows(['code', 'ticketing_correct_pricing_command', 'is_published', 'ticketing_gds', 'ticketing_pcc'], [
					['ITN06JW535', '$B/:N', true, 'apollo', '1O3K'],
				]),
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'FQP1*ITX'},
					{'cmd': 'FQP2*ITF'},
					{'cmd': 'FQP3*I05'},
					{'cmd': 'FQP4*ITS'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588, 'hasPnr': true,
				}),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'  1.1LIBERMANE/MARINA   2.I/1LIBERMANE/ZIMICH*25JAN18',
							'  3.1LIBERMANE/LEPIN*C05   4.1LIBERMANE/STAS*INS',
							' 1. AT  262 D  20SEP NBOCMN AK3   650A   255P            TH',
							' 2. AT  202 D  20SEP CMNJFK AK3  1040P # 130A            TH',
							' 3. AT  201 D  29SEP JFKCMN AK3   900P # 850A            SA',
							' 4. AT  263 D  30SEP CMNNBO AK3   410P # 415A            SU',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'FQP1*ITX.2*ITF.3*I05.4*ITS',
						'output': php.implode(php.PHP_EOL, [
							'>FQP1*ITX.2*ITF.3*I05.4*ITS',
							'   PSGR                  FARE     TAXES         TOTAL PSG DES   FQP 1         USD     3236.00     527.41      3763.41 ADT       FQP 2         USD      324.00      58.81       382.81 ITF       FQP 3         USD     2168.00     527.41      2695.41 I05       FQP 4         USD     2168.00     527.41      2695.41 ITS       GRAND TOTAL INCLUDING TAXES ****     USD      9537.04                        **ADDITIONAL FEES MAY APPLY**SEE >FO; ',
							'       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQ/DASO;',
							'    ITX      PRIVATE FARE SELECTED/BEST FARE FOR THIS PASSENGER     ITX      CAT35                                                  ITX      TOUR CODE: AT6COM                                      ITX      LAST DATE TO PURCHASE TICKET: 20SEP18              )><',
						]),
					},
					{
						'cmd': 'MR',
						'output': '    ITX      TICKETING AGENCY 711M                                  ITX      DEFAULT PLATING CARRIER AT                             ITX      E-TKT REQUIRED                                         ITF      PRIVATE FARE SELECTED                                  ITF      CAT35                                                  ITF      TOUR CODE: AT6COM                                      ITF      LAST DATE TO PURCHASE TICKET: 20SEP18                  ITF      TICKETING AGENCY 711M                                  ITF      DEFAULT PLATING CARRIER AT                             ITF      E-TKT REQUIRED                                         I05      PRIVATE FARE SELECTED                                  I05      CAT35                                                  I05      TOUR CODE: AT6COM                                  )><',
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'    I05      LAST DATE TO PURCHASE TICKET: 20SEP18                  I05      TICKETING AGENCY 711M                                  I05      DEFAULT PLATING CARRIER AT                             I05      E-TKT REQUIRED                                         ITS      PRIVATE FARE SELECTED                                  ITS      CAT35                                                  ITS      TOUR CODE: AT6COM                                      ITS      LAST DATE TO PURCHASE TICKET: 20SEP18                  ITS      TICKETING AGENCY 711M                                  ITS      DEFAULT PLATING CARRIER AT                             ITS      E-TKT REQUIRED                                     UNABLE TO FILE - MULTIPLE PSGR TYPES - QUOTE EACH PTC SEPARATELYBAGGAGE ALLOWANCE',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'ITX',
							' AT NBONYC  3PC  ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG                     ',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG                     ',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSAT.BAGG             ',
							'                                                               ',
							' AT NYCNBO  3PC  ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG                     ',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG                     ',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSAT.BAGGT             ',
							'                                                               ',
							'CARRY ON ALLOWANCE',
							' AT NBOCAS  1PC   ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
							' AT CASNYC  1PC   ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
							' AT NYCCAS  1PC   ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
							' AT CASNBO  1PC   ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
							'ITF',
							' AT NBONYC  10K  ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSAT.BAGG             ',
							'                                                               ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							' AT NYCNBO  10K  ',
							'   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSAT.BAGG             ',
							'                                                               ',
							'CARRY ON ALLOWANCE',
							' AT NBOCAS CARRY ON ALLOWANCE DATA NOT AVAILABLE ',
							' AT CASNYC CARRY ON ALLOWANCE DATA NOT AVAILABLE ',
							' AT NYCCAS CARRY ON ALLOWANCE DATA NOT AVAILABLE ',
							' AT CASNBO CARRY ON ALLOWANCE DATA NOT AVAILABLE ',
							'INN',
							' AT NBONYC  3PC  ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG                     ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   BAG 2 -  NO FEE       UPTO50LB/23KG                     ',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSAT.BAGG             ',
							'                                                               ',
							' AT NYCNBO  3PC  ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG                     ',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG                     ',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSAT.BAGG             ',
							'                                                               ',
							'CARRY ON ALLOWANCE',
							' AT NBOCAS  1PC   ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
							' AT CASNYC  1PC   ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							' AT NYCCAS  1PC   ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
							' AT CASNBO  1PC   ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
							'ITS',
							' AT NBONYC  3PC  ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG                     ',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG                     ',
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSAT.BAGG             ',
							'                                                               ',
							' AT NYCNBO  3PC  ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG                     ',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG                     ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   MYTRIPANDMORE.COM/BAGGAGEDETAILSAT.BAGG             ',
							'                                                               ',
							'CARRY ON ALLOWANCE',
							' AT NBOCAS  1PC   ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
							' AT CASNYC  1PC   ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
							' AT NYCCAS  1PC   ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
							' AT CASNBO  1PC   ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
							'                                                               ',
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'><',
						]),
					},
					{
						'cmd': 'F*Q',
						'output': php.implode(php.PHP_EOL, [
							'FQ-1 P05APR18      ADT       ',
							'  NBO AT X/CAS AT NYC 1618.21DA0R0KEA/ITN06JW535 AT X/CAS AT',
							'  NBO 1618.21DA0R0KEA/ITN06JW535 NUC3236.42 -----  MUST PRICE',
							'  AS B/N - ----END ROE1.0  XF 4.50JFK4.5',
							'  FARE USD 3236.00 TAX AY 5.60 TAX US 36.60 TAX XA 3.96 TAX XF',
							'  4.50 TAX XY 7.00 TAX YC 5.65 TAX TU 50.00 TAX MA 46.10 TAX YQ',
							'  368.00 TOT USD 3763.41',
							'FQ-2 P05APR18      ITF       ',
							'  NBO AT X/CAS AT NYC 161.82DA0R0KEAINF/ITN06JW535 AT X/CAS AT',
							'  NBO 161.82DA0R0KEAINF/ITN06JW535 NUC323.64 -----  MUST PRICE',
							'  AS B/N - ----END ROE1.0',
							'  FARE USD 324.00 TAX AY 5.60 TAX US 36.60 TAX XA 3.96 TAX XY',
							'  7.00 TAX YC 5.65 TOT USD 382.81',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'FQ-3 P05APR18      I05       ',
							'  NBO AT X/CAS AT NYC 1084.20DA0R0KEACH/ITN06JW535 AT X/CAS AT',
							'  NBO 1084.20DA0R0KEACH/ITN06JW535 NUC2168.40 -----  MUST PRICE',
							'  AS B/N - ----END ROE1.0  XF 4.50JFK4.5',
							'  FARE USD 2168.00 TAX AY 5.60 TAX US 36.60 TAX XA 3.96 TAX XF',
							'  4.50 TAX XY 7.00 TAX YC 5.65 TAX TU 50.00 TAX MA 46.10 TAX YQ',
							'  368.00 TOT USD 2695.41',
							'FQ-4 P05APR18      ITS       ',
							'  NBO AT X/CAS AT NYC 1084.20DA0R0KEAINS/ITN06JW535 AT X/CAS AT',
							'  NBO 1084.20DA0R0KEAINS/ITN06JW535 NUC2168.40 -----  MUST',
							'  PRICE AS B/N - ----END ROE1.0  XF 4.50JFK4.5',
							'  FARE USD 2168.00 TAX AY 5.60 TAX US 36.60 TAX XA 3.96 TAX XF',
							'  4.50 TAX XY 7.00 TAX YC 5.65 TAX TU 50.00 TAX MA 46.10 TAX YQ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'  368.00 TOT USD 2695.41',
							'><',
						]),
					},
					{
						'cmd': 'FQP1*ITX',
						'output': php.implode(php.PHP_EOL, [
							'>FQP1*ITX',
							'*** NET TICKET DATA EXISTS ***',
							'   PSGR                  FARE     TAXES         TOTAL PSG DES   FQP 1         USD     3236.00     527.41      3763.41 ADT       GRAND TOTAL INCLUDING TAXES ****     USD      3763.41                        **ADDITIONAL FEES MAY APPLY**SEE >FO; ',
							'       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQ/DASO;',
							'    ITX      PRIVATE FARE SELECTED/BEST FARE FOR THIS PASSENGER     ITX      CAT35                                                  ITX      TOUR CODE: AT6COM                                      ITX      LAST DATE TO PURCHASE TICKET: 20SEP18                  ITX      TICKETING AGENCY 711M                                  ITX      DEFAULT PLATING CARRIER AT                         )><',
						]),
					},
					{
						'cmd': 'FQP2*ITF',
						'output': php.implode(php.PHP_EOL, [
							'>FQP2*ITF',
							'*** NET TICKET DATA EXISTS ***',
							'   PSGR                  FARE     TAXES         TOTAL PSG DES   FQP 2         USD      324.00      58.81       382.81 ITF       GRAND TOTAL INCLUDING TAXES ****     USD       382.81                        **ADDITIONAL FEES MAY APPLY**SEE >FO; ',
							'       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQ/DASO;',
							'    ITF      PRIVATE FARE SELECTED                                  ITF      CAT35                                                  ITF      TOUR CODE: AT6COM                                      ITF      LAST DATE TO PURCHASE TICKET: 20SEP18                  ITF      TICKETING AGENCY 711M                                  ITF      DEFAULT PLATING CARRIER AT                         )><',
						]),
					},
					{
						'cmd': 'FQP3*I05',
						'output': php.implode(php.PHP_EOL, [
							'>FQP3*I05',
							'*** NET TICKET DATA EXISTS ***',
							'   PSGR                  FARE     TAXES         TOTAL PSG DES   FQP 3         USD     2168.00     527.41      2695.41 I05       GRAND TOTAL INCLUDING TAXES ****     USD      2695.41                        **ADDITIONAL FEES MAY APPLY**SEE >FO; ',
							'       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQ/DASO;',
							'    I05      PRIVATE FARE SELECTED                                  I05      CAT35                                                  I05      TOUR CODE: AT6COM                                      I05      LAST DATE TO PURCHASE TICKET: 20SEP18                  I05      TICKETING AGENCY 711M                                  I05      DEFAULT PLATING CARRIER AT                         )><',
						]),
					},
					{
						'cmd': 'FQP4*ITS',
						'output': php.implode(php.PHP_EOL, [
							'>FQP4*ITS',
							'*** NET TICKET DATA EXISTS ***',
							'   PSGR                  FARE     TAXES         TOTAL PSG DES   FQP 4         USD     2168.00     527.41      2695.41 ITS       GRAND TOTAL INCLUDING TAXES ****     USD      2695.41                        **ADDITIONAL FEES MAY APPLY**SEE >FO; ',
							'       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQ/DASO;',
							'    ITS      PRIVATE FARE SELECTED                                  ITS      CAT35                                                  ITS      TOUR CODE: AT6COM                                      ITS      LAST DATE TO PURCHASE TICKET: 20SEP18                  ITS      TICKETING AGENCY 711M                                  ITS      DEFAULT PLATING CARRIER AT                         )><',
						]),
					},
				],
			},
		});

		// regular agents should not be able to open Alex PNR-s
		$list.push({
			'input': {
				'cmdRequested': '*1',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'forbidden',
				'calledCommands': [],
				'userMessages': ['Restricted PNR'],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588, 'hasPnr': true,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '*1',
						'output': php.implode(php.PHP_EOL, [
							'KG278C/WS QSBIV VTL9WS  AG 05578602 15MAY',
							'  1.1PROKOPCHUK/STAS   2.1WEINSTEIN/ALEX',
							'  3.I/1PROKOPCHUK/SASHA*15FEB18',
							' 1. LO  516 D  20DEC KIVWAW HK2   555P   645P O*       E TH',
							' 2. BT  468 D  20DEC WAWRIX HK2   755P  1020P O*       E TH',
							'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
							'** VENDOR REMARKS DATA EXISTS **       >*VR;',
							'** SERVICE INFORMATION EXISTS **       >*SI;',
							'FONE-PIXR',
							'TKTG-TAU/TU04SEP',
							'NOTE-',
							'  1. GD-PRINCE/1588/FOR STANISLAW/2838/LEAD-1 IN 711M WS 15MAY 1     321Z',
							')><',
						]),
					},
					{
						'cmd': 'I',
						'output': php.implode(php.PHP_EOL, [
							'IGNORED',
							'><',
						]),
					},
				],
			},
		});

		// regular agents should not see Alex PNR-s in the search
		$list.push({
			'input': {
				'cmdRequested': '**B-W*',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': '**B-W*',
						'output': php.implode(php.PHP_EOL, [
							'   711M-W*                        ',
							'002 01WRIGHT/PHOENIX     20DEC  ><',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588, 'hasPnr': true,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '**B-W*',
						'output': php.implode(php.PHP_EOL, [
							'   711M-W*                        ',
							'001 01WEINSTEIN/ALEX     20DEC  002 01WRIGHT/PHOENIX     20DEC',
							'><',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'canCreatePq was false because there were just three lines in the output, we decided it was error response - should wrap',
				'cmdRequested': 'FQ',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': 'FQ',
						'output': php.implode(php.PHP_EOL, [
							'>FQ',
							'   PSGR                  FARE     TAXES         TOTAL PSG DES   FQG 1         USD       64.00     529.81       593.81 ADT           GUARANTEED AT TIME OF TICKETING                             FQG 2         USD       48.00     424.11       472.11 C05           GUARANTEED AT TIME OF TICKETING                             FQG 3         USD        6.00     119.61       125.61 INF           GUARANTEED AT TIME OF TICKETING                             GRAND TOTAL INCLUDING TAXES ****     USD      1191.53                        **ADDITIONAL FEES MAY APPLY**SEE >FO; ',
							'    ADT      SUM IDENTIFIED AS UB IS A PASSENGER SERVICE CHARGE     ADT      LAST DATE TO PURCHASE TICKET: 18MAY18                  ADT      TICKETING AGENCY 711M                              ',
						]),
					},
					{
						'cmd': 'F*Q',
						'output': 'fake output to keep test',
					},
				],
				'sessionData': {
					'canCreatePq': true,
				},
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588, 'hasPnr': true, 'canCreatePq': false,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'FQ',
						'output': php.implode(php.PHP_EOL, [
							'>FQ',
							'   PSGR                  FARE     TAXES         TOTAL PSG DES   FQG 1         USD       64.00     529.81       593.81 ADT           GUARANTEED AT TIME OF TICKETING                             FQG 2         USD       48.00     424.11       472.11 C05           GUARANTEED AT TIME OF TICKETING                             FQG 3         USD        6.00     119.61       125.61 INF           GUARANTEED AT TIME OF TICKETING                             GRAND TOTAL INCLUDING TAXES ****     USD      1191.53                        **ADDITIONAL FEES MAY APPLY**SEE >FO; ',
							'    ADT      SUM IDENTIFIED AS UB IS A PASSENGER SERVICE CHARGE     ADT      LAST DATE TO PURCHASE TICKET: 18MAY18                  ADT      TICKETING AGENCY 711M                              ><', // fake truncated
						]),
					},
					{
						'cmd': 'F*Q',
						'output': 'fake output to keep test><',
					},
				],
			},
		});

		// I get some weird wrapping here, gonna find out the reason
		// '** THIS BF IS CURRENTLY IN USE **',
		// 'J2F50L/WS QSBIV VTL9WS  AG 05578602 16MAY',
		// '  1.1WALTERS/JESSICA            ** VENDOR LOCATOR DATA EXISTS **',
		// '       >*VL;                    ** VENDOR REMARKS DATA EXISTS **',
		// '       >*VR;                    ** SERVICE INFORMATION EXISTS **',
		// '       >*SI;                    FONE-SFOR*800-750-2238 ASAP CUST',
		// 'OMER SUPPORT                    NOTE-',
		// '  1. GD-KIRA/785/FOR KIRA/785/LEAD-8180644 IN 711M WS 16MAY 1306',
		// '     Z                          ',
		$list.push({
			'input': {
				'cmdRequested': '*1',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': '*1',
						'output': php.implode(php.PHP_EOL, [
							'** THIS BF IS CURRENTLY IN USE **',
							'J2F50L/WS QSBIV VTL9WS  AG 05578602 16MAY',
							'  1.1WALTERS/JESSICA',
							'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
							'** VENDOR REMARKS DATA EXISTS **       >*VR;',
							'** SERVICE INFORMATION EXISTS **       >*SI;',
							'FONE-SFOR*800-750-2238 ASAP CUSTOMER SUPPORT',
							'NOTE-',
							'  1. GD-KIRA/785/FOR KIRA/785/LEAD-8180644 IN 711M WS 16MAY 1306     Z',
							'><',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588, 'hasPnr': true, 'canCreatePq': false,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '*1',
						'output': php.implode(php.PHP_EOL, [
							'** THIS BF IS CURRENTLY IN USE **',
							'J2F50L/WS QSBIV VTL9WS  AG 05578602 16MAY',
							'  1.1WALTERS/JESSICA',
							'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
							'** VENDOR REMARKS DATA EXISTS **       >*VR;',
							'** SERVICE INFORMATION EXISTS **       >*SI;',
							'FONE-SFOR*800-750-2238 ASAP CUSTOMER SUPPORT',
							'NOTE-',
							'  1. GD-KIRA/785/FOR KIRA/785/LEAD-8180644 IN 711M WS 16MAY 1306     Z',
							'><',
						]),
					},
				],
			},
		});

		// on return availability modifiers should be copied from original availability request
		$list.push({
			'input': {
				'cmdRequested': 'AR25SEP',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': 'AR25SEP.12A.MSP/UA#/AA#/DL#@V',
						'output': 'NEUTRAL DISPLAY*   TU 25SEP SFO/NYC                             1 SFO MSP 25/2343#0514  UA2369 F6 C6 A6 D6 Z6 P5 Y9#---- 739C*E 2     EWR 26/0605 0940 @UA3520 F6 C6 A6 D6 Z6 P5 Y9#0657 E70C*E 3 SJC MSP 25/1348 1926  DL1791 F9 P9 A9 G7 W9 Y9 B9#---- 319C*E 4     EWR 25/2015 2354 @UA3538 F9 C9 A9 D9 Z8 P7 Y9#0706 E7WC*E 5 SFO MSP 25/0030 0604  DL 806 F9 P9 A9 G9 W9 Y9 B9#---- 753C*E 6     JFK 25/0650 1040  DL2032 F9 P9 A9 G9 W9 Y9 B9#0710 717C*E 7 SFO MSP 25/0030 0604  DL 806 F9 P9 A9 G9 W9 Y9 B9#---- 753C*E 8     LGA 25/0700 1043 @AA4493 J7 D7 I7 Y7 B7 H7 K7#0713 E75C*E ><',
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), []),
				'initialCommands': [
					{
						'cmd': 'AJ20SEPNYCSFO.12A.MSP/UA#/AA#/DL#',
						'output': 'NEUTRAL DISPLAY*   TH 20SEP NYC/SFO                             1 EWR MSP 0825 1032  DL1968 F9 P9 A9 G0 W9 Y9 B9 M9#---- 717C*E 2     SJC 1115 1308  DL1791 F9 P9 A9 G0 W9 Y9 B9 M9#0743 319C*E 3 LGA MSP 0815 1020  DL 121 J9 C4 D0 I0 Z0 W9 Y9 B9#---- 320C*E 4     SJC 1115 1308  DL1791 F9 P0 A0 G0 W9 Y9 B9 M9#0753 319C*E 5 EWR MSP 0845 1042 @UA3423 F6 C4 A4 D4 Z2 P1 Y9 B9#---- E70C*E 6     SFO 1145 1353  DL1151 F3 P0 A0 G0 W9 Y9 B9 M9#0808 739C*E 7 JFK MSP 0755 1004  DL 442 F9 P3 A0 G0 W9 Y9 B9 M9#---- 319C*E 8     SJC 1115 1308  DL1791 F9 P8 A0 G0 W9 Y9 B9 M9#0813 319C*E ><',
					},
					{
						'cmd': 'A@V',
						'output': 'NEUTRAL DISPLAY*   TH 20SEP NYC/SFO                             1 EWR SFO 0810 1107  UA 497 J9 C9 D9 Z9 P0 Y9 B9 M9#0557 777C*E 2 EWR SFO 0910 1207  UA 637 J9 C9 D9 Z9 P0 Y9 B9 M9#0557 777C*E 3 EWR SFO 2135#0035  UA1526 J9 C9 D9 Z9 P0 Y9 B9 M9#0600 757C*E 4 EWR SFO 1525 1830  UA1738 J9 C9 D9 Z3 P0 Y9 B9 M9#0605 777C*E 5 EWR SFO 1350 1656  UA1978 J9 C9 D9 Z0 P0 Y9 B9 M9#0606 752C*E 6 EWR SFO 1420 1726  UA 800 J9 C9 D9 Z0 P0 Y9 B9 M9#0606 752C*E 7 EWR SFO 1022 1328  UA1878 J9 C9 D9 Z9 P1 Y9 B9 M9#0606 757C*E 8 EWR SFO 0600 0907  UA1483 J9 C9 D9 Z2 P0 Y9 B9 M9#0607 752C*E ><',
					},
				],
				'performedCommands': [
					{
						'cmd': 'AR25SEP.12A.MSP/UA#/AA#/DL#@V',
						'output': 'NEUTRAL DISPLAY*   TU 25SEP SFO/NYC                             1 SFO MSP 25/2343#0514  UA2369 F6 C6 A6 D6 Z6 P5 Y9#---- 739C*E 2     EWR 26/0605 0940 @UA3520 F6 C6 A6 D6 Z6 P5 Y9#0657 E70C*E 3 SJC MSP 25/1348 1926  DL1791 F9 P9 A9 G7 W9 Y9 B9#---- 319C*E 4     EWR 25/2015 2354 @UA3538 F9 C9 A9 D9 Z8 P7 Y9#0706 E7WC*E 5 SFO MSP 25/0030 0604  DL 806 F9 P9 A9 G9 W9 Y9 B9#---- 753C*E 6     JFK 25/0650 1040  DL2032 F9 P9 A9 G9 W9 Y9 B9#0710 717C*E 7 SFO MSP 25/0030 0604  DL 806 F9 P9 A9 G9 W9 Y9 B9#---- 753C*E 8     LGA 25/0700 1043 @AA4493 J7 D7 I7 Y7 B7 H7 K7#0713 E75C*E ><',
					},
				],
			},
		});

		// return availability, with other avail cmds before last and some own mods
		$list.push({
			'input': {
				'cmdRequested': 'ARJ10AUG.D0',
				'baseDate': '2017-11-05',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': 'ARJ10AUG@K.D0',
						'output': 'NEUTRAL DISPLAY*   FR 10AUG LAX/NYC                             1 LAX EWR 2236#0638  UA 415 J9 C9 D9 Z0 P0 Y9 B9 M9#0502 777C*E 2 LAX EWR 2236#0638 @OZ6264 CC DC Y4 B4 M4 H4 E4 Q4#0502 752B E 3 SNA EWR 1641#0044  UA 786 F7 C4 A3 D3 Z0 P0 Y9 B9#0503 73GC*E 4 LAX JFK 0820 1640  QF  11 J9 C9 D9 I9 W9 R9 T9 Y9#0520 744C*E 5 BUR JFK 2145#0607  B6 358 Y4 E4 K4 H4 Q4 B4 L4 V4#0522 320B E 6 LGB JFK 2043#0505  B6  14 Y4 E4 K4 H4 Q4 B4 L4 V4#0522 320B E 7 LGB JFK 1525 2348  B6 514 Y4 E4 K4 H4 Q4 B4 L4 V4#0523 320B E 8 LAX JFK 1645#0109  B61224 J4 C4 D4 I0 Y4 E4 K4 H4#0524 32SB E ><',
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), []),
				'initialCommands': [
					{
						'cmd': 'A10DECKIVRIX/PS#',
						'output': 'NEUTRAL DISPLAY*   MO 10DEC KIV/RIX                             1 KIV KBP 0710 0820  PS 898 C9 D9 Z9 F9 S9 E9 K9 H9 L9 V9#738C*E2     RIX 0920 1100  PS 185 C9 D9 Z9 F9 S9 E9 K9 H9 L9 V9#738C*E3 KIV KBP 0710 0820  PS 898 C4 D4 Z4 F4 S9 E9 K9 H9 L9 V9#738C*E4     RIX 2045 2220  PS 187 C4 D4 Z4 F4 S9 E9 K9 H9 L9 V9#E90C*ENO MORE LATER FLIGHTS 10DEC                                     ><',
					},
					{
						'cmd': 'A20JULNYCLAX@K',
						'output': 'NEUTRAL DISPLAY*   FR 20JUL NYC/LAX                             1 JFK LAX 0559 0853  B6  23 J4 C4 D0 I0 Y4 E4 K4 H4 Q4 B4#32SB E2 JFK LAX 0600 0910  AA 171 F7 A4 J7 D7 I7 Y7 B7 H7 K7 M7#32BC*E3 JFK LAX 0600 0910 @QF3212 F4 A4 J6 C6 D6 I6 Y9 B9 H9 K9#32BC*E4 JFK LAX 0700 1002  DL 424 J9 C9 D9 I9 Z9 W9 Y9 B9 M9 H9#764C*E5 JFK LAX 0700 1016  AA  33 F7 A2 J7 D7 I5 Y7 B7 H7 K7 M7#32BC*E6 JFK LAX 0700 1016 @QF3096 F4 AL J6 C6 D6 I6 Y9 B9 H9 K9#32BC*E7 JFK LAX 0730 1027  B6 123 J4 C4 D0 I0 Y4 E4 K4 H4 Q4 B4#32SB E8 EWR LAX 0758 1053 @JL5443 F4 A4 J4 C4 DC IC XC Y5 B5 H5#32BC*E><',
					},
				],
				'performedCommands': [
					{
						'cmd': 'ARJ10AUG@K.D0',
						'output': 'NEUTRAL DISPLAY*   FR 10AUG LAX/NYC                             1 LAX EWR 2236#0638  UA 415 J9 C9 D9 Z0 P0 Y9 B9 M9#0502 777C*E 2 LAX EWR 2236#0638 @OZ6264 CC DC Y4 B4 M4 H4 E4 Q4#0502 752B E 3 SNA EWR 1641#0044  UA 786 F7 C4 A3 D3 Z0 P0 Y9 B9#0503 73GC*E 4 LAX JFK 0820 1640  QF  11 J9 C9 D9 I9 W9 R9 T9 Y9#0520 744C*E 5 BUR JFK 2145#0607  B6 358 Y4 E4 K4 H4 Q4 B4 L4 V4#0522 320B E 6 LGB JFK 2043#0505  B6  14 Y4 E4 K4 H4 Q4 B4 L4 V4#0522 320B E 7 LGB JFK 1525 2348  B6 514 Y4 E4 K4 H4 Q4 B4 L4 V4#0523 320B E 8 LAX JFK 1645#0109  B61224 J4 C4 D4 I0 Y4 E4 K4 H4#0524 32SB E ><',
					},
				],
			},
		});

		// should not allow changing ticketed PNR
		$list.push({
			'input': {
				'cmdRequested': 'XI',
				'baseDate': '2018-06-14',
			},
			'output': {
				'status': 'forbidden',
				'userMessages': ['Forbidden command, cant delete fields in ticketed PNR'],
				'calledCommands': [],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {'agent_id': 1588}),
				'initialCommands': [
					{
						'cmd': 'SEM/K9P/AG',
						'output': php.implode(php.PHP_EOL, [
							'PROCEED/14JUN-TRAVELPACK MARKETING   L LON - GALILEO',
							'><',
						]),
					},
					{
						'cmd': '*2TSXM6',
						'output': php.implode(php.PHP_EOL, [
							'** THIS BF IS CURRENTLY IN USE **',
							'0GF - TRAVELPACK MARKETING     LON',
							'2TSXM6/SH LONOU 0GFASH  AG 91291233 23APR',
							'  1.1ROBERTS/JANINE   2.1POWELL/CLIVE',
							' 1. AA  105 Q  04AUG LHRJFK HK2   230P   535P O*       E SA  1',
							' 2. AA 2580 Q  04AUG JFKCLT HK2   700P   922P O*       E SA  1',
							' 3. AA  730 Q  18AUG CLTLHR HK2   805P # 900A O*       E SA',
							'** FILED FARE DATA EXISTS **           >*FF;',
							'** SEAT DATA EXISTS **                 >*SD;',
							'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
							'** SERVICE INFORMATION EXISTS **       >*SI;',
							'** TINS REMARKS EXIST **               >*HTI;',
							'** ELECTRONIC DATA EXISTS **           >*HTE;',
							')><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'** THIS BF IS CURRENTLY IN USE **',
							'0GF - TRAVELPACK MARKETING     LON',
							'2TSXM6/SH LONOU 0GFASH  AG 91291233 23APR',
							'  1.1ROBERTS/JANINE   2.1POWELL/CLIVE',
							' 1. AA  105 Q  04AUG LHRJFK HK2   230P   535P O*       E SA  1',
							' 2. AA 2580 Q  04AUG JFKCLT HK2   700P   922P O*       E SA  1',
							' 3. AA  730 Q  18AUG CLTLHR HK2   805P # 900A O*       E SA',
							'** FILED FARE DATA EXISTS **           >*FF;',
							'** SEAT DATA EXISTS **                 >*SD;',
							'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
							'** SERVICE INFORMATION EXISTS **       >*SI;',
							'** TINS REMARKS EXIST **               >*HTI;',
							'** ELECTRONIC DATA EXISTS **           >*HTE;',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'FONE-LONT*TRAVELPACK 0208 585 4000 ADAM Q/58',
							'RBKG-0GF/TU24APR/0700/Q89*PLZ ISSUE THANKS',
							'TKTG-T*QSB 24APR1535Z 82 AG',
							'NOTE-',
							'  1. VIEWTRIPNET SH 23APR 1849Z',
							'  2. TPACK REF........S46330 JN 24APR 1315Z',
							'><',
						]),
					},
				],
			},
		});

		// /-T/ pricing mod alias example
		$list.push({
			'input': {
				'cmdRequested': 'FQBB*ITX-T',
				'baseDate': '2018-06-14',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'FQBB/*ITX/-TPACK/TA0GF/:P'},
					{'cmd': 'F*Q'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588, 'pcc': 'K9P', 'hasPnr': true,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'FQBB/*ITX/-TPACK/TA0GF/:P',
						'output': php.implode(php.PHP_EOL, [
							'>FQBB/*ITX/-TPACK/TA0GF/:P',
							'                   *** BEST BUY QUOTATION ***',
							'            LOWEST FARE AVAILABLE FOR THIS ITINERARY',
							'                 *** REBOOK BF SEGMENTS 3Q ***',
							'   PSGR   QUOTE BASIS         FARE    TAXES      TOTAL PSG DES  FQZ 1-2    QLN2Z8M4   GBP   161.00   285.51     893.02 ITX      GRAND TOTAL INCLUDING TAXES ****     GBP       893.02                        **ADDITIONAL FEES MAY APPLY**SEE >FO;                  ITX      PRIVATE FARE SELECTED                                  ITX      CAT35                                                  ITX      SUM IDENTIFIED AS UB IS A PASSENGER SERVICE CHARGE     ITX      TOUR CODE: GBTO                                        ITX      FARE HAS FORM OF PAYMENT RESTRICTION               ><', // fake truncated
						]),
					},
					{
						'cmd': 'F*Q',
						'output': 'fake output to keep test><',
					},
				],
			},
		});

		// /-T/ with child and following :USD mod. Should add /ACCITX/
		// also, since its FQBA, should not fetch all
		$list.push({
			'input': {
				'cmdRequested': 'FQBA*I06-T:USD',
				'baseDate': '2018-06-14',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'FQBA/*I06/:USD/ACCITX/-TPACK/TA0GF/:P'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588, 'pcc': 'K9P', 'hasPnr': true,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'FQBA/*I06/:USD/ACCITX/-TPACK/TA0GF/:P',
						'output': php.implode(php.PHP_EOL, [
							'>FQBA/*I06/ACCITX/-TPACK/TA0GF/:P/:USD',
							'                   *** BEST BUY QUOTATION ***',
							'     LOWEST FARE FOR THIS ITINERARY - FOR INFORMATION ONLY',
							'                     *** BOOK IN 1O/2O ***',
							'   PSGR   QUOTE BASIS         FARE    TAXES      TOTAL PSG DES  FQZ 1-2    OLN2Z8M4   USD    46.00   272.01     636.02 I06      GRAND TOTAL INCLUDING TAXES ****     USD       636.02                        **ADDITIONAL FEES MAY APPLY**SEE >FO;                  I06      PRIVATE FARE SELECTED                                  I06      CAT35                                                  I06      SUM IDENTIFIED AS UB IS A PASSENGER SERVICE CHARGE     I06      RATE USED IN EQU TOTAL IS BSR 1GBP - 1.311043USD       I06      TOUR CODE: GBTO                                    )><',
						]),
					},
				],
			},
		});

		// pricing of multiple PTC-s without names in PNR - should
		// implicitly add and remove fake names for pricing to work
		$list.push({
			'input': {
				'cmdRequested': 'FQP1*ITX.2-4*INF',
				'baseDate': '2018-06-14',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'FQP1*ITX.2-4*INF'},
					{'cmd': 'F*Q'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'agent_id': 1588,
				}),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'N.FAKE/A|N.FAKE/B|N.FAKE/C|N.FAKE/D',
						'output': php.implode(php.PHP_EOL, [' *', '><']),
					},
					{
						'cmd': 'FQP1*ITX.2-4*INF',
						'output': php.implode(php.PHP_EOL, [
							'>FQP1*ITX.2-4*INF',
							'   PSGR                  FARE     TAXES         TOTAL PSG DES   FQA 1         USD      728.00     251.71       979.71 ADT           GUARANTEED                                                  FQA 2-4       USD      728.00      52.71      2342.13 ADT           GUARANTEED                                                  GRAND TOTAL INCLUDING TAXES ****     USD      3321.84                        **ADDITIONAL FEES MAY APPLY**SEE >FO; ',
							'       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQ/DASO;',
							'    ITX      PRIVATE FARE SELECTED/BEST FARE FOR THIS PASSENGER     ITX      SUM IDENTIFIED AS UB IS A PASSENGER SERVICE CHARGE     ITX      RATE USED IN EQU TOTAL IS BSR 1GBP - 1.275525USD       ITX      TOUR CODE: BT15DY05                                ><', // fake truncated
						]),
					},
					{
						'cmd': 'F*Q',
						'output': 'fake output to keep test><',
					},
					{'cmd': 'N.P1-4@', 'output': php.implode(php.PHP_EOL, [' *', '><'])},
				],
			},
		});

		// STORE/CUA example - with validating carrier override
		$list.push({
			'input': {
				'cmdRequested': 'STORE/CSN',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'FQP1*ADT.2*ADT/CSN'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), []),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'  1.1LIB/MAR   2.1LIB/ZIMM',
							' 1. SN 2096 U  10DEC LHRBRU HS2   550P   800P O        E MO',
							' 2. NH  232 U  10DEC BRUNRT HS2   850P # 415P O        E MO',
							'** FILED FARE DATA EXISTS **           >*FF;',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'FQP1*ADT.2*ADT/CSN',
						'output': php.implode(php.PHP_EOL, [
							'>FQP1*ADT.2*ADT/CSN',
							'   PSGR                  FARE     TAXES         TOTAL PSG DES   FQG 1-2       USD     1371.00     343.70      3429.40 ADT           GUARANTEED AT TIME OF TICKETING                             GRAND TOTAL INCLUDING TAXES ****     USD      3429.40                        **ADDITIONAL FEES MAY APPLY**SEE >FO; ',
							'       **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQ/DASO;',
							'    ADT      SUM IDENTIFIED AS UB IS A PASSENGER SERVICE CHARGE     ADT      RATE USED IN EQU TOTAL IS BSR 1GBP - 1.286524USD       ADT      LAST DATE TO PURCHASE TICKET: 12NOV18                  ADT      E-TKT REQUIRED                                     BAGGAGE ALLOWANCE',
							'ADT',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							' NH LONTYO  2PC  ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
							'   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/NH            ',
							'                                                               ',
							'CARRY ON ALLOWANCE',
							' SN LONBRU  1PC   ',
							'   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO46LI/118LCM ',
							' NH BRUTYO  1PC   ',
							'   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM ',
							'                                                               ',
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'><',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'multi-pricing alias example',
				'cmdRequested': 'FQBA/S1-2/CHR&3.4/CAY',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'FQBA/S1-2/CHR'},
					{'cmd': 'FQBA/S3.4/CAY'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), []),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': 'FQBA/S1-2/CHR',
						'output': php.implode(php.PHP_EOL, [
							'>FQBA/S1-2/CHR',
							'                   *** BEST BUY QUOTATION ***',
							'     LOWEST FARE FOR THIS ITINERARY - FOR INFORMATION ONLY',
							'                     *** BOOK IN 1C/2C ***',
							'   PSGR   QUOTE BASIS         FARE    TAXES      TOTAL PSG DES  FQG 1           CIF   USD   880.00   129.10    1009.10 ADT          GUARANTEED                                                  GRAND TOTAL INCLUDING TAXES ****     USD      1009.10                        **ADDITIONAL FEES MAY APPLY**SEE >FO;                     **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQBB/DASO;     ADT      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.138269USD       ADT      LAST DATE TO PURCHASE TICKET: 10DEC18                  ADT      E-TKT REQUIRED                                     )><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'UNABLE TO FILE - NEED NAMES',
							'BAGGAGE ALLOWANCE',
							'ADT',
							' 9U KIVRIX  2PC  ',
							'   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
							'   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM ',
							'   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/9U            ',
							'                                                               ',
							'CARRY ON ALLOWANCE',
							' 9U KIVIEV  2PC   ',
							'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
							'   BAG 2 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
							'   BAG  3 - 756 MDL      PET IN CABIN AND UPTO18LB/8KG     ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'   BAG  4 - 756 MDL      PET IN CABIN AND UPTO18LB/8KG     ',
							' BT IEVRIX  2PC   ',
							'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
							'   BAG 2 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
							'                                                               ',
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'><',
						]),
					},
					{
						'cmd': 'FQBA/S3.4/CAY',
						'output': php.implode(php.PHP_EOL, [
							'>FQBA/S3.4/CAY',
							'                   *** BEST BUY QUOTATION ***',
							'     LOWEST FARE FOR THIS ITINERARY - FOR INFORMATION ONLY',
							'                     *** BOOK IN 3Y/4Y ***',
							'   PSGR   QUOTE BASIS         FARE    TAXES      TOTAL PSG DES  FQG 1        YRPRM|   USD  2273.00   233.41    2506.41 ADT          GUARANTEED                                                  GRAND TOTAL INCLUDING TAXES ****     USD      2506.41                        **ADDITIONAL FEES MAY APPLY**SEE >FO;                     **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >FQBB/DASO;     ADT      RATE USED IN EQU TOTAL IS BSR 1EUR - 1.138269USD       ADT      LAST DATE TO PURCHASE TICKET: 23AUG18                  ADT      FARE HAS A PLATING CARRIER RESTRICTION             )><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'    ADT      E-TKT REQUIRED                                                  US PASSENGER FACILITY CHARGE NOT APPLICABLE',
							'UNABLE TO FILE - NEED NAMES',
							'BAGGAGE ALLOWANCE',
							'ADT',
							' BT RIXNYC  1PC  ',
							'   BAG 1 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ',
							'   BAG 2 -  BAGGAGE CHARGES DATA NOT AVAILABLE            ',
							'   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/BT            ',
							'                                                               ',
							'CARRY ON ALLOWANCE',
							' BT RIXHEL  1PC   ',
							'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							' AY HELNYC  1PC   ',
							'   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE    ',
							'                                                               ',
							'BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/',
							'ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.',
							'><',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': [
					'it appears that Galileo may show )>< even when there is no more output',
					'should additionally check that last page is not same as previous',
				].join('\n'),
				'cmdRequested': '*2XZ9B6|*ALL/MDA',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						'cmd': 'MDA',
						'output': php.implode(php.PHP_EOL, [
							' K9P- TRAVELPACK MARKETING   L LON',
							'2XZ9B6/WS QSBIV VTL9WS  AG 91291233 23AUG',
							'  1.1PATRICK/SON   2.1GARY/CREED   3.1ROBINSON/VERNA',
							'  4.1SAM/BONNIE   5.1WEST/FRED   6.1DAVIDSON/PAUL',
							' 1. UA 2287 H  25AUG SFOSAN HK6   350P   524P O*       E SA',
							'FONE-SFOR*800-750-2238 ASAP CUSTOMER SUPPORT',
							'TKTG-TAU/TH23AUG',
							'NOTE-',
							'  1. GD-JORDAN LIGHTMAN/8216/FOR OWEN PARKER/101074/LEAD-9082298      IN K9P WS 23AUG 1844Z',
							'  2. CHML REF................S90990....... 48 23AUG 1909Z',
							'VLOC-UA*PX2XM0/23AUG 1844',
							'VENDOR REMARKS',
							'VRMK-VI/AUA *ADTK1GKK6 .TKT UA SEGS BY 24AUG18 TO AVOID AUTO CXL /EARLIER 1901Z 23AUG',
							'  2. VI/AUA *ADTK1GKK6 .TICKETING MAY BE REQUIRED BY FARE RULE 1901Z 23AUG',
							'NO OSI EXISTS',
							'** MANUAL SSR DATA **',
							'  1. SSRCTCEUA HK  1 /VIVIENLANE//HOTMAIL.COM-1PATRICK/SON',
							'  2. SSRCTCMUA HK  1 /447725305083-1PATRICK/SON',
							'  3. SSRCTCMUA HK  1 /7725305083-1GARY/CREED',
							'  4. SSRCTCMUA HK  1 /7725305083-1ROBINSON/VERNA',
							'  5. SSRCTCMUA HK  1 /7725305083-1SAM/BONNIE',
							'  6. SSRCTCMUA HK  1 /7725305083-1WEST/FRED',
							'  7. SSRCTCMUA HK  1 /7725305083-1DAVIDSON/PAUL',
							'  8. SSRDOCSUA HK  1 /////01SEP63/M//PATRICK/SON/-1PATRICK/SON',
							'  9. SSRDOCSUA HK  1 /////15APR79/M//GARY/CREED/-1GARY/CREED',
							' 10. SSRDOCSUA HK  1 /////08JAN77/F//ROBINSON/VERNA/-1ROBINSON/-                     VERNA',
							' 11. SSRDOCSUA HK  1 /////04DEC80/F//SAM/BONNIE/-1SAM/BONNIE',
							' 12. SSRDOCSUA HK  1 /////09MAY72/M//WEST/FRED/-1WEST/FRED',
							' 13. SSRDOCSUA HK  1 /////23FEB67/M//DAVIDSON/PAUL/-1DAVIDSON/P-                     AUL',
							'',
							'T*FFALL',
						]),
					},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), []),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '*2XZ9B6|*ALL',
						'output': php.implode(php.PHP_EOL, [
							' K9P- TRAVELPACK MARKETING   L LON',
							'2XZ9B6/WS QSBIV VTL9WS  AG 91291233 23AUG',
							'  1.1PATRICK/SON   2.1GARY/CREED   3.1ROBINSON/VERNA',
							'  4.1SAM/BONNIE   5.1WEST/FRED   6.1DAVIDSON/PAUL',
							' 1. UA 2287 H  25AUG SFOSAN HK6   350P   524P O*       E SA',
							'FONE-SFOR*800-750-2238 ASAP CUSTOMER SUPPORT',
							'TKTG-TAU/TH23AUG',
							'NOTE-',
							'  1. GD-JORDAN LIGHTMAN/8216/FOR OWEN PARKER/101074/LEAD-9082298      IN K9P WS 23AUG 1844Z',
							'  2. CHML REF................S90990....... 48 23AUG 1909Z',
							'VLOC-UA*PX2XM0/23AUG 1844',
							'VENDOR REMARKS',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'VRMK-VI/AUA *ADTK1GKK6 .TKT UA SEGS BY 24AUG18 TO AVOID AUTO CXL /EARLIER 1901Z 23AUG',
							'  2. VI/AUA *ADTK1GKK6 .TICKETING MAY BE REQUIRED BY FARE RULE 1901Z 23AUG',
							'NO OSI EXISTS',
							'** MANUAL SSR DATA **',
							'  1. SSRCTCEUA HK  1 /VIVIENLANE//HOTMAIL.COM-1PATRICK/SON',
							'  2. SSRCTCMUA HK  1 /447725305083-1PATRICK/SON',
							'  3. SSRCTCMUA HK  1 /7725305083-1GARY/CREED',
							'  4. SSRCTCMUA HK  1 /7725305083-1ROBINSON/VERNA',
							'  5. SSRCTCMUA HK  1 /7725305083-1SAM/BONNIE',
							'  6. SSRCTCMUA HK  1 /7725305083-1WEST/FRED',
							'  7. SSRCTCMUA HK  1 /7725305083-1DAVIDSON/PAUL',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'  8. SSRDOCSUA HK  1 /////01SEP63/M//PATRICK/SON/-1PATRICK/SON',
							'  9. SSRDOCSUA HK  1 /////15APR79/M//GARY/CREED/-1GARY/CREED',
							' 10. SSRDOCSUA HK  1 /////08JAN77/F//ROBINSON/VERNA/-1ROBINSON/-                     VERNA',
							' 11. SSRDOCSUA HK  1 /////04DEC80/F//SAM/BONNIE/-1SAM/BONNIE',
							' 12. SSRDOCSUA HK  1 /////09MAY72/M//WEST/FRED/-1WEST/FRED',
							' 13. SSRDOCSUA HK  1 /////23FEB67/M//DAVIDSON/PAUL/-1DAVIDSON/P-                     AUL',
							'',
							'T*FFALL)><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'  8. SSRDOCSUA HK  1 /////01SEP63/M//PATRICK/SON/-1PATRICK/SON',
							'  9. SSRDOCSUA HK  1 /////15APR79/M//GARY/CREED/-1GARY/CREED',
							' 10. SSRDOCSUA HK  1 /////08JAN77/F//ROBINSON/VERNA/-1ROBINSON/-                     VERNA',
							' 11. SSRDOCSUA HK  1 /////04DEC80/F//SAM/BONNIE/-1SAM/BONNIE',
							' 12. SSRDOCSUA HK  1 /////09MAY72/M//WEST/FRED/-1WEST/FRED',
							' 13. SSRDOCSUA HK  1 /////23FEB67/M//DAVIDSON/PAUL/-1DAVIDSON/P-                     AUL',
							'',
							'T*FFALL)><',
						]),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'pricing with passenger numbers in a stored PNR - should not add fake names',
				'cmdRequested': 'FQP1*ITX-TPACK/TA0GF:P/FXD',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{'cmd': 'FQP1*ITX-TPACK/TA0GF:P/FXD'},
					{'cmd': 'F*Q'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {}),
				'initialCommands': [
					{
						'cmd': '*PXS90S',
						'output': php.implode(php.PHP_EOL, [
							'*** - INTERNATIONAL TRAVEL NET LON',
							'PXS90S/WS QSBIV VTL9WS  AG 99999992 03SEP',
							'  1.1POWELL/LINTON',
							' 1. UA  928 T  21DEC LHRORD HK1  1205P   320P O*       E FR',
							' 2. UA  958 L  02JAN ORDLHR HK1   355P # 555A O*       E WE',
							'** FILED FARE DATA EXISTS **           >*FF;',
							'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
							'** VENDOR REMARKS DATA EXISTS **       >*VR;',
							'** SERVICE INFORMATION EXISTS **       >*SI;',
							'FONE-SFOR*800-750-2238 ASAP CUSTOMER SUPPORT',
							'FOP -VIXXXXXXXXXXXX9546/D0220',
							'TKTG-TAU/MO03SEP',
							'NOTE-',
							')><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': 'FQP1*ITX-TPACK/TA0GF:P/FXD',
						'output': php.implode(php.PHP_EOL, [
							'>FQP1*ITX-TPACK/TA0GF:P/FXD',
							'*** NET TICKET DATA EXISTS ***',
							'   PSGR                  FARE     TAXES         TOTAL PSG DES   FQP 1         GBP      195.00     261.81       456.81 ITX       GRAND TOTAL INCLUDING TAXES ****     GBP       456.81                        **ADDITIONAL FEES MAY APPLY**SEE >FO; ',
							'    ITX      PRIVATE FARE SELECTED                                  ITX      CAT35                                                  ITX      SUM IDENTIFIED AS UB IS A PASSENGER SERVICE CHARGE     ITX      TOUR CODE: IT402GBT                                    ITX      FARE HAS FORM OF PAYMENT RESTRICTION                   ITX      LAST DATE TO PURCHASE TICKET: 23NOV18                  ITX      TICKETING AGENCY 0GF                               ><', // fake truncated
						]),
					},
					{
						'cmd': 'F*Q',
						'output': 'fake output to keep test><',
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'NEW_GDS_DIRECT_EDIT_VOID_TICKETED_PNR logic example - allowed',
				'cmdRequested': 'XI',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
				'stubAgents': [
					Agent.makeStub(php.array_merge(GdsDirectDefaults.makeAgentBaseData(), {
						'row': php.array_merge($agentBaseDate['row'], {
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
					{'cmd': 'XI'},
				],
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'isPnrStored': true, 'agent_id': 346,
				}),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'** THIS BF IS CURRENTLY IN USE **',
							'80DJ- INTERNATIONAL TRAVEL NET LON',
							'PS5MRQ/WS QSBIV VTL9WS  AG 99999992 03SEP',
							'  1.1POWELL/MICHAEL   2.1POWELL/ELIJAHMICHAEL*P-CNN',
							'  3.1POWELL/MICAIAHLINTON*P-CNN',
							' 1. UA  928 T  21DEC LHRORD HK3  1205P   320P O*       E FR',
							' 2. UA  958 L  02JAN ORDLHR HK3   355P # 555A O*       E WE',
							'** FILED FARE DATA EXISTS **           >*FF;',
							'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
							'** VENDOR REMARKS DATA EXISTS **       >*VR;',
							'** SERVICE INFORMATION EXISTS **       >*SI;',
							'** TINS REMARKS EXIST **               >*HTI;',
							'** ELECTRONIC DATA EXISTS **           >*HTE;',
							'FONE-SFOR*800-750-2238 ASAP CUSTOMER SUPPORT',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'TKTG-T*QSB 04SEP1507Z 36 AG',
							'NOTE-',
							'  1. GD-GARY MATHEWS/8226/FOR GARY MATHEWS/8226/LEAD-9142366 IN',
							'     80DJ WS 03SEP 1337Z',
							'  2. AGENT ACCOUNT - TP7902 WS 04SEP 1312Z',
							'  3. ATOL - 2.50 WS 04SEP 1312Z',
							'  4. BOOKING FEE - 5.00 WS 04SEP 1312Z',
							'  5. TICKET PRICE - 1114.43 WS 04SEP 1313Z',
							'  6. TOTAL INVOICE - 1442.00 WS 04SEP 1314Z',
							'  7. CVV - 014 WS 04SEP 1314Z',
							'  8. CLIENT CARD VALUE - 1442.00 WS 04SEP 1314Z',
							'  9. CARDHOLDER NAME - POWELL WS 04SEP 1314Z',
							' 10. ADDRESS - 36 WAVERLEY ROAD WS 04SEP 1314Z',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							' 11. POSTCODE - RM13 9ND WS 04SEP 1314Z',
							' 12. COUNTRY - GB WS 04SEP 1315Z',
							' 13. CITY - ESSEX WS 04SEP 1315Z',
							' 14. S95066 CG 04SEP 1339Z',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': '*HTE',
						'output': 'ELECTRONIC TICKET LIST BY *HTE                                            NAME             TICKET NUMBER                        >*TE001;  POWELL/ELIJAHMIC 0162667997708                        >*TE002;  POWELL/MICHAEL   0162667997707                        >*TE003;  POWELL/MICAIAHLI 0162667997709                        END OF LIST                                                     ><',
					},
					{
						'cmd': '*TE001',
						'output': php.implode(php.PHP_EOL, [
							'TKT: 016 2667 997708     NAME: POWELL/ELIJAHMICHAEL              ',
							'ISSUED: 04SEP18          FOP:INVS95066                          PSEUDO: 00GF  PLATING CARRIER: UA  ISO: GB  IATA: 91291233   ',
							'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
							'   VOID UA  928  T  21DEC LHRORD 1205P OK TLAXZTOY/RL00CH    1',
							'                                          NVB21DEC NVA21DEC',
							'   VOID UA  958  L  02JAN ORDLHR 0355P OK LLAXZTOY/RL00CH    2',
							'                                          NVB02JAN NVA02JAN',
							' ',
							'FARE           IT TAX    44.91UB TAX   138.90XT TAX            ',
							'TOTAL GBP       IT ',
							'   2016UPC./NONENDS./RISS CHRG APPLY./RFND PNTY APPLY./NO MILE U',
							'   G.                                                           ',
							' ',
							'FC M/IT END ROE1.0 XT 360.00YR 31.00BP 25.00KX 7.00',
							'XY 5.60AY 5.50YC 3.96XA 3.60YQ 4.50XFSFO4.5                     ',
							'TOUR CODE: 6SDANINUCW     ',
							'RLOC 1V KMFB9O    1A ZXSE24       ',
							'><',
						]),
					},
					{
						'cmd': '*TE002',
						'output': php.implode(php.PHP_EOL, [
							'TKT: 016 2667 997707     NAME: POWELL/MICHAEL                    ',
							'ISSUED: 04SEP18          FOP:INVS95066                          PSEUDO: 00GF  PLATING CARRIER: UA  ISO: GB  IATA: 91291233   ',
							'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
							'   VOID UA  928  T  21DEC LHRORD 1205P OK TLAXZTOY/RL00      1',
							'                                          NVB21DEC NVA21DEC',
							'   VOID UA  958  L  02JAN ORDLHR 0355P OK LLAXZTOY/RL00      2',
							'                                          NVB02JAN NVA02JAN',
							' ',
							'FARE           IT TAX    78.00GB TAX   183.81XT TAX            ',
							'TOTAL GBP       IT ',
							'   2016UPC./NONENDS./RISS CHRG APPLY./RFND PNTY APPLY./NO MILE U',
							'   G.                                                           ',
							' ',
							'FC M/IT END ROE1.0 XT 360.00YR 31.00BP 25.00KX 7.00',
							'XY 5.60AY 5.50YC 3.96XA 3.60YQ 4.50XFSFO4.5                     ',
							'TOUR CODE: 6SDANINUCW     ',
							'RLOC 1V KMFB9O    1A ZXSE24       ',
							'><',
						]),
					},
					{
						'cmd': '*TE003',
						'output': php.implode(php.PHP_EOL, [
							'TKT: 016 2667 997709     NAME: POWELL/MICAIAHLINTON              ',
							'ISSUED: 04SEP18          FOP:INVS95066                          PSEUDO: 00GF  PLATING CARRIER: UA  ISO: GB  IATA: 91291233   ',
							'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
							'   VOID UA  928  T  21DEC LHRORD 1205P OK TLAXZTOY/RL00CH    1',
							'                                          NVB21DEC NVA21DEC',
							'   VOID UA  958  L  02JAN ORDLHR 0355P OK LLAXZTOY/RL00CH    2',
							'                                          NVB02JAN NVA02JAN',
							' ',
							'FARE           IT TAX    44.91UB TAX   138.90XT TAX            ',
							'TOTAL GBP       IT ',
							'   2016UPC./NONENDS./RISS CHRG APPLY./RFND PNTY APPLY./NO MILE U',
							'   G.                                                           ',
							' ',
							'FC M/IT END ROE1.0 XT 360.00YR 31.00BP 25.00KX 7.00',
							'XY 5.60AY 5.50YC 3.96XA 3.60YQ 4.50XFSFO4.5                     ',
							'TOUR CODE: 6SDANINUCW     ',
							'RLOC 1V KMFB9O    1A ZXSE24       ',
							'><',
						]),
					},
					{
						'cmd': 'XI',
						'output': 'ITINERARY CANCELLED STARTING AT SEGMENT 01                      ** SSR DATA CANCELLED **    TO REINSTATE SSR DATA   >*SIR;      ><',
					},
				],
			},
		});

		// GDS_DIRECT_EDIT_VOID_TICKETED_PNR logic example - forbidden
		$list.push({
			'input': {
				'cmdRequested': 'XI',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
				'stubAgents': [
					Agent.makeStub(php.array_merge(GdsDirectDefaults.makeAgentBaseData(), {
						'row': php.array_merge($agentBaseDate['row'], {
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
			},
			'sessionInfo': {
				'initialState': php.array_merge(GdsDirectDefaults.makeDefaultGalileoState(), {
					'isPnrStored': true, 'agent_id': 346,
				}),
				'initialCommands': [
					{
						'cmd': '*R',
						'output': php.implode(php.PHP_EOL, [
							'*** - INTERNATIONAL TRAVEL NET LON',
							'P7RXSM/WS QSBIV VTL9WS  AG 99999992 15SEP',
							'  1.1HESTER/DAVIDLEONARD   2.1HESTER/EILEENANN',
							' 1. DL 4350 L  27SEP MANJFK HK2   150P   440P O*       E TH  3',
							'         OPERATED BY VIRGIN ATLANTIC',
							' 2. DL 2435 L  27SEP JFKPHX HK2   700P   939P O*       E TH  3',
							' 3. DL 2946 L  30SEP PHXSLC HK2   645P   923P O*       E SU',
							' 4. DL 2624 X  22OCT SLCMCO HK2   959A   417P O*       E MO  4',
							' 5. DL 4411 X  22OCT MCOMAN HK2   630P # 735A O*       E MO  4',
							'         OPERATED BY VIRGIN ATLANTIC',
							'** FILED FARE DATA EXISTS **           >*FF;',
							'** VENDOR LOCATOR DATA EXISTS **       >*VL;',
							'** VENDOR REMARKS DATA EXISTS **       >*VR;',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'** SERVICE INFORMATION EXISTS **       >*SI;',
							'** TINS REMARKS EXIST **               >*HTI;',
							'** ELECTRONIC DATA EXISTS **           >*HTE;',
							'FONE-SFOR*800-750-2238 ASAP CUSTOMER SUPPORT',
							'RBKG-0GF/MO17SEP/0700/Q89*PLS ISSUE TICKET',
							'FOP -CA5126872000073825/D1120',
							'TKTG-T*QSB 17SEP1552Z 36 AG',
							'NOTE-',
							'  1. GD-STANLEY WILLSON/21136/FOR STANLEY WILLSON/21136/LEAD-919     6984 IN 80DJ WS 15SEP 1258Z',
							'  2. AGENT ACCOUNT - TP7902 WS 17SEP 1531Z',
							'  3. ATOL - 2.50 WS 17SEP 1531Z',
							'  4. BOOKING FEE - 5.00 WS 17SEP 1531Z',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'  5. TICKET PRICE - 1777.36 WS 17SEP 1532Z',
							'  6. TOTAL INVOICE - 2242.00 WS 17SEP 1532Z',
							'  7. CVV - 366 WS 17SEP 1532Z',
							'  8. CLIENT CARD VALUE - 2242.00 WS 17SEP 1532Z',
							'  9. CARDHOLDER NAME - DAVID HESTER MR WS 17SEP 1532Z',
							' 10. ADDRESS - 12 KENNEDY CLOSE WS 17SEP 1532Z',
							' 11. POSTCODE - LA1 5ES WS 17SEP 1532Z',
							' 12. COUNTRY - GB WS 17SEP 1533Z',
							' 13. CITY - LANCASTER WS 17SEP 1533Z',
							' 14. CHML REF *********** T00077 KE 17SEP 1548Z',
							'><',
						]),
					},
				],
				'performedCommands': [
					{
						'cmd': '*HTE',
						'output': 'ELECTRONIC TICKET LIST BY *HTE                                            NAME             TICKET NUMBER                        >*TE001;  HESTER/DAVIDLEON 0062668286045-046                    >*TE002;  HESTER/EILEENANN 0062668286047-048                    END OF LIST                                                     ><',
					},
					{
						'cmd': '*TE001',
						'output': php.implode(php.PHP_EOL, [
							'TKT: 006 2668 286045-046 NAME: HESTER/DAVIDLEONARD               ',
							'ISSUED: 17SEP18          FOP:INVT77                             PSEUDO: 00GF  PLATING CARRIER: DL  ISO: GB  IATA: 91291233   ',
							'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
							'   ARPT DL 4350  L  27SEP MANJFK 0150P OK LKUF57MW/IT34      1',
							'                                          NVB27SEP NVA27SEP',
							'   OPEN DL 2435  L  27SEP JFKPHX 0700P OK LKUF57MW/IT34      2',
							'                                          NVB27SEP NVA27SEP',
							'   OPEN DL 2946  L  30SEP PHXSLC 0645P OK LKUF57MW/IT34      3',
							'                                          NVB30SEP NVA30SEP',
							'   OPEN DL 2624  X  22OCT SLCMCO 0959A OK XKUG8SMX/IT34      4',
							'                                          NVB22OCT NVA22OCT',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'----046----',
							'   ARPT DL 4411  X  22OCT MCOMAN 0630P OK XKUG8SMX/IT34      1',
							'                                          NVB22OCT NVA22OCT',
							' ',
							'FARE           IT TAX    78.00GB TAX   273.68XT TAX            ',
							'TOTAL GBP       IT ',
							'   NONREF                       ',
							'    PENALTY APPLIES             ',
							' ',
							'MAN DL X/E/NYC DL PHX DL SLC M/IT DL X/ORL DL MAN 5',
							'M/IT END ROE0.773147 XT 18.98UB8.60AY28.00US3.00XA5             .40XY4.30YC202.00YR3.40XF MCO4.5                                RLOC 1G P7RXSM    DL GNFNC8                                     )><',
						]),
					},
					{'cmd': 'MR', 'output': php.implode(php.PHP_EOL, ['       ', '><'])},
					{
						'cmd': '*TE002',
						'output': php.implode(php.PHP_EOL, [
							'TKT: 006 2668 286047-048 NAME: HESTER/EILEENANN                  ',
							'ISSUED: 17SEP18          FOP:INVT77                             PSEUDO: 00GF  PLATING CARRIER: DL  ISO: GB  IATA: 91291233   ',
							'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
							'   ARPT DL 4350  L  27SEP MANJFK 0150P OK LKUF57MW/IT34      1',
							'                                          NVB27SEP NVA27SEP',
							'   OPEN DL 2435  L  27SEP JFKPHX 0700P OK LKUF57MW/IT34      2',
							'                                          NVB27SEP NVA27SEP',
							'   OPEN DL 2946  L  30SEP PHXSLC 0645P OK LKUF57MW/IT34      3',
							'                                          NVB30SEP NVA30SEP',
							'   OPEN DL 2624  X  22OCT SLCMCO 0959A OK XKUG8SMX/IT34      4',
							'                                          NVB22OCT NVA22OCT',
							')><',
						]),
					},
					{
						'cmd': 'MR',
						'output': php.implode(php.PHP_EOL, [
							'----048----',
							'   ARPT DL 4411  X  22OCT MCOMAN 0630P OK XKUG8SMX/IT34      1',
							'                                          NVB22OCT NVA22OCT',
							' ',
							'FARE           IT TAX    78.00GB TAX   273.68XT TAX            ',
							'TOTAL GBP       IT ',
							'   NONREF                       ',
							'    PENALTY APPLIES             ',
							' ',
							'MAN DL X/E/NYC DL PHX DL SLC M/IT DL X/ORL DL MAN 5',
							'M/IT END ROE0.773147 XT 18.98UB8.60AY28.00US3.00XA5             .40XY4.30YC202.00YR3.40XF MCO4.5                                RLOC 1G P7RXSM    DL GNFNC8                                     )><',
						]),
					},
					{'cmd': 'MR', 'output': php.implode(php.PHP_EOL, ['       ', '><'])},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'itinerary dump pasted as command example - should rebuild it',
				'cmdRequested': [
					"1. DL 4400 V  22JUN MANLAS HS1   915A  1200N O        E SA  1",
					"       OPERATED BY VIRGIN ATLANTIC",
					"2. DL  951 V  22JUN LASLAX HS1   456P   613P O        E SA  1",
					"3. DL 4357 T  05JUL LAXMAN HS1   605P #1230P O        E FR",
					"       OPERATED BY VIRGIN ATLANTIC"
				].join("\n"),
				'baseDate': '2019-05-20',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						cmd: '*R',
						output: [
							" 1. DL 4400 V  22JUN MANLAS HS1   915A  1200N O        E SA  1",
							"         OPERATED BY VIRGIN ATLANTIC",
							" 2. DL  951 V  22JUN LASLAX HS1   456P   613P O        E SA  1",
							" 3. DL 4357 T  05JUL LAXMAN HS1   605P #1230P O        E FR",
							"         OPERATED BY VIRGIN ATLANTIC",
							"><"
						].join('\n'),
					},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultGalileoState(),
				'initialCommands': [],
				'performedCommands': [
					{
					    "cmd": "0DL4400Y22JUNMANLASAK1",
					    "output": [
					        " 1. DL 4400 Y  22JUN MANLAS AK1   915A  1200N                   OPERATED BY VIRGIN ATLANTIC                                     DEPARTS MAN TERMINAL 2  - ARRIVES LAS TERMINAL 3                NOT VALID FOR INTERLINE CONNECTIONS                             OFFER CAR/HOTEL      >CAL;       >HOA; ",
					        "><"
					    ].join("\n"),
					},
					{
					    "cmd": "0DL951Y22JUNLASLAXAK1",
					    "output": [
					        " 2. DL  951 Y  22JUN LASLAX AK1   456P   613P                   DEPARTS LAS TERMINAL 1  - ARRIVES LAX TERMINAL 2                OFFER CAR/HOTEL      >CAL;       >HOA; ",
					        "><"
					    ].join("\n"),
					},
					{
					    "cmd": "0DL4357Y05JULLAXMANAK1",
					    "output": [
					        " 3. DL 4357 Y   5JUL LAXMAN AK1   605P #1230P                   OPERATED BY VIRGIN ATLANTIC                                     DEPARTS LAX TERMINAL 2  - ARRIVES MAN TERMINAL 2                NOT VALID FOR INTERLINE CONNECTIONS                             OFFER CAR/HOTEL      >CAL;       >HOA; ",
					        "><"
					    ].join("\n"),
					},
					{
					    "cmd": "@1.2/V",
					    "output": [
					        " 1. DL 4400 V  22JUN MANLAS HS1   915A  1200N O       E      1  OPERATED BY VIRGIN ATLANTIC                                     DEPARTS MAN TERMINAL 2  - ARRIVES LAS TERMINAL 3                NOT VALID FOR INTERLINE CONNECTIONS                             **DL CODE SHARE-QUOTE OPERATED BY VIRGIN ATLAN AS VS FLT 85  *",
					        "*LOCAL AND ONLINE CONNECTING TRAFFIC ONLY*",
					        " 2. DL  951 V  22JUN LASLAX HS1   456P   613P O       E      1  DEPARTS LAS TERMINAL 1  - ARRIVES LAX TERMINAL 2                ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS  ",
					        "PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
					        "WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
					        "FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
					        "><"
					    ].join("\n"),
					},
					{
					    "cmd": "@3/T",
					    "output": [
					        " 3. DL 4357 T  05JUL LAXMAN HS1   605P #1230P O       E         OPERATED BY VIRGIN ATLANTIC                                     DEPARTS LAX TERMINAL 2  - ARRIVES MAN TERMINAL 2                NOT VALID FOR INTERLINE CONNECTIONS                             **DL CODE SHARE-QUOTE OPERATED BY VIRGIN ATLAN AS VS FLT 182 *",
					        "*LOCAL AND ONLINE CONNECTING TRAFFIC ONLY*",
					        "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS  ",
					        "PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
					        "WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
					        "FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
					        "><"
					    ].join("\n"),
					},
					{
					    "cmd": "*R",
					    "output": [
					        " 1. DL 4400 V  22JUN MANLAS HS1   915A  1200N O        E SA  1",
					        "         OPERATED BY VIRGIN ATLANTIC",
					        " 2. DL  951 V  22JUN LASLAX HS1   456P   613P O        E SA  1",
					        " 3. DL 4357 T  05JUL LAXMAN HS1   605P #1230P O        E FR",
					        "         OPERATED BY VIRGIN ATLANTIC",
					        "><"
					    ].join("\n"),
					},
				],
			},
		});

		$list.push({
			'input': {
				'title': 'return availability without month example',
				'cmdRequested': 'AR15',
				'baseDate': '2019-05-20',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{cmd: 'AR15JUL/PR#'},
				],
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultGalileoState(),
				'initialCommands': [
					{
					    "cmd": "AJ10JULJFKMNL/PR#",
					    "output": "NEUTRAL DISPLAY*   WE 10JUL NYC/MNL                             1 JFK MNL 0145#0615  PR 127 J9 C9 D9 I9 Z9 W9 N3 Y9#1630 350C*E NO MORE LATER FLIGHTS 10JUL                                     ><",
					},
					{
					    "cmd": "AR20JUL/PR#",
					    "output": "NEUTRAL DISPLAY*   SA 20JUL MNL/NYC                             1 MNL JFK 1940 2315  PR 126 J9 C9 D8 I7 Z7 W9 N2 Y9#1535 350C*E NO MORE LATER FLIGHTS 20JUL                                     ><",
					},
				],
				'performedCommands': [
					{
					    "cmd": "AR15JUL/PR#",
					    "output": "NEUTRAL DISPLAY*   MO 15JUL NYC/MNL                             1 JFK MNL 0145#0615  PR 127 J9 C9 D9 I9 Z3 W9 N7 Y9#1630 350C*E NO MORE LATER FLIGHTS 15JUL                                     ><",
					},
				],
			},
		});

		$argumentTuples = [];
		for ($testCase of Object.values($list)) {
			$argumentTuples.push([$testCase['input'], $testCase['output'], $testCase['sessionInfo']]);
		}

		return $argumentTuples;
	}

	/**
	 * @test
	 * @dataProvider provideTestCases
	 */
	async testCase($input, $output, $sessionInfo) {
		let $session = GdsDirectDefaults.makeStatefulSession('galileo', $input, $sessionInfo);

		let $actualOutput = await RunCmdRq({
			stateful: $session,
			cmdRq: $input['cmdRequested'],
			PtcUtil: PtcUtil.makeCustom({
				PtcFareFamilies: {
					getAll: () => Promise.resolve(stubPtcFareFamilies),
					getByAdultPtc: (adultPtc) => PtcFareFamilies.getByAdultPtcFrom(adultPtc, stubPtcFareFamilies),
				},
			}),
		});
		$actualOutput['sessionData'] = $session.getSessionData();

		let unusedCommands = $session.getGdsSession().getCommandsLeft();
		this.assertEquals([], unusedCommands, 'not all session commands were used');
		this.assertArrayElementsSubset($output, $actualOutput);
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testCase],
		];
	}
}

RunCmdRqTest.count = 0;
module.exports = RunCmdRqTest;
