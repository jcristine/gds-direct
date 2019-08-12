const PnrHistoryParser = require('../../../../../../../backend/Transpiled/Gds/Parsers/Apollo/PnrHistoryParser.js');
const DisplayHistoryActionHelper = require("../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Apollo/DisplayHistoryActionHelper");

let php = require('klesun-node-tools/src/Transpiled/php.js');

class DisplayHistoryActionHelperTest extends require('../../../../../../../backend/Transpiled/Lib/TestCase.js') {
	providePnrDumps() {
		let list = [];

		list.push([
			php.implode(php.PHP_EOL, [
				'     *****  AIR  HISTORY  *****',
				'AS PR2778 O25MAY TAGMNL HK/TK1   415P  530P *',
				'SC PR2778 O25MAY TAGMNL HK/WK1   445P  555P *',
				'AS PR2773 O12MAY MNLTAG HK/TK1   845A 1000A *',
				'SC PR2773 O12MAY MNLTAG HK/WK1   920A 1035A *',
				'RCVD-251435/ASC/BEDAA5C2/ NO ID  -CR- MNL/1O3K/UA RM PR 25JAN1435Z',
				'AS PR 103 O11MAY LAXMNL TK/TK1  1205A  535A *',
				'SC PR1103 O11MAY LAXMNL TK/UN1  1205A  535A *',
				'RCVD-220817/ASC/C1722A20/ NO ID  -CR- MNL/1O3K/UA RM PR 22JAN0817Z',
				'AS PR1103 O11MAY LAXMNL TK/TK1  1205A  535A *',
				'SC PR 103 O10MAY LAXMNL HK/UN1  1050P  535A *',
				'RCVD-220427/ASC/C169743E/ NO ID  -CR- MNL/1O3K/UA RM PR 22JAN0427Z',
				'AS PR 102 O25MAY MNLLAX HK/TK1   900P  730P *',
				'SC PR 102 O25MAY MNLLAX HK/WK1   900P  715P *',
				'RCVD-170650/ASC/BF976D1A/ NO ID  -CR- MNL/1O3K/UA RM PR 17JAN0650Z',
				'XS PR2778 O25MAY TAGMNL HK/WK1   515P  630P *',
				'SC PR2778 O25MAY TAGMNL TK/HK1   445P  555P *',
				'RCVD-EZREAL/ZDYBDEN -CR- QSB/1O3K/1V AG CS 24NOV2311Z',
				'AS PR2778 O25MAY TAGMNL HK/TK1   445P  555P *',
				'SC PR2778 O25MAY TAGMNL HK/WK1   515P  630P *',
				'RCVD-240122/ASC/C01130C8/ NO ID  -CR- MNL/1O3K/UA RM PR 24NOV0122Z',
				'HS PR 102 O25MAY MNLLAX SS/HK1   900P  715P *       2',
				'HS PR2778 O25MAY TAGMNL SS/HK1   515P  630P *       2',
				'HS PR2773 O12MAY MNLTAG SS/HK1   920A 1035A *       1',
				'HS PR 103 O10MAY LAXMNL SS/HK1  1050P  535A *       1',
				'RCVD-SPIRO/ZDPBVWS -CR- QSB/2G55/1V AG WS 08NOV0054Z',
			]),
			php.implode(php.PHP_EOL, [
				'     *****  AIR  HISTORY  *****',
				' ',
				' ',
				'08NOV / 00:54 UTC. BY: SPIRO. PCC: 2G55. HISTORICAL SEGMENTS',
				'',
				' 1 PR 103O 10MAY LAXMNL SS/HK1  1050P  535A *  1',
				' 2 PR2773O 12MAY MNLTAG SS/HK1   920A 1035A *  1',
				' 3 PR2778O 25MAY TAGMNL SS/HK1   515P  630P *  2',
				' 4 PR 102O 25MAY MNLLAX SS/HK1   900P  715P *  2',
				' ',
				'**********************************************************',
				' ',
				'24NOV / 01:22 UTC. BY: NO ID. PCC: 1O3K. ',
				'',
				'   PR2778O 25MAY TAGMNL HK/WK1  515P  630P * - STATUS CHANGE',
				'   PR2778O 25MAY TAGMNL HK/TK1  445P  555P * - ADDED SEGMENT',
				' ',
				'**********************************************************',
				' ',
				'24NOV / 23:11 UTC. BY: EZREAL. PCC: 1O3K. ',
				'',
				'   PR2778O 25MAY TAGMNL TK/HK1  445P  555P * - STATUS CHANGE',
				'   PR2778O 25MAY TAGMNL HK/WK1  515P  630P * - CANCELLED SEGMENT',
				' ',
				'**********************************************************',
				' ',
				'17JAN / 06:50 UTC. BY: NO ID. PCC: 1O3K. ',
				'',
				'   PR 102O 25MAY MNLLAX HK/WK1  900P  715P * - STATUS CHANGE',
				'   PR 102O 25MAY MNLLAX HK/TK1  900P  730P * - ADDED SEGMENT',
				' ',
				'**********************************************************',
				' ',
				'22JAN / 04:27 UTC. BY: NO ID. PCC: 1O3K. ',
				'',
				'   PR 103O 10MAY LAXMNL HK/UN1 1050P  535A * - STATUS CHANGE',
				'   PR1103O 11MAY LAXMNL TK/TK1 1205A  535A * - ADDED SEGMENT',
				' ',
				'**********************************************************',
				' ',
				'22JAN / 08:17 UTC. BY: NO ID. PCC: 1O3K. ',
				'',
				'   PR1103O 11MAY LAXMNL TK/UN1 1205A  535A * - STATUS CHANGE',
				'   PR 103O 11MAY LAXMNL TK/TK1 1205A  535A * - ADDED SEGMENT',
				' ',
				'**********************************************************',
				' ',
				'25JAN / 14:35 UTC. BY: NO ID. PCC: 1O3K. ',
				'',
				'   PR2773O 12MAY MNLTAG HK/WK1  920A 1035A * - STATUS CHANGE',
				'   PR2773O 12MAY MNLTAG HK/TK1  845A 1000A * - ADDED SEGMENT',
				'   PR2778O 25MAY TAGMNL HK/WK1  445P  555P * - STATUS CHANGE',
				'   PR2778O 25MAY TAGMNL HK/TK1  415P  530P * - ADDED SEGMENT',
				' ',
				'**********************************************************',
				' ',
			]),
		]);

		// caused null pointer error due to some segments not having departure time
		list.push([
			php.implode(php.PHP_EOL, [
				"     *****  AIR  HISTORY  *****",
				"XS 9W5816 O04AUG LHRJFK HK/HX3  ",
				"XS 9W5833 K04JUL JFKLHR HK/HX3  ",
				"RCVD-ALVIN/ZDYBTER -CR- QSB/1O3K/1V AG SC 18APR1806Z",
				"SC 9W5816 O04AUG LHRJFK HK/HX3  ",
				"SC 9W5833 K04JUL JFKLHR HK/HX3  ",
				"RCVD-HDQRM9W/SNC/C02071BB/ NO ID  -CR- HDQ/2G2H/UA RM 9W 18APR1803Z",
				"AS 9W5816 O04AUG LHRJFK HK/HK3  ",
				"AS 9W5833 K04JUL JFKLHR HK/HK3  ",
				"RCVD-HDQRM9W/SNC/C0200A20/ NO ID  -CR- HDQ/2G2H/UA RM 9W 18APR1753Z",
				"XS 9W5816 O04AUG LHRJFK SS/HK3   815P 1110P *",
				"XS 9W 122 O04AUG DELLHR HK/UN3   100P  620P *",
				"XS 9W 121 K15JUL LHRDEL HK/UN3   845P  955A *",
				"XS 9W5833 K04JUL JFKLHR SS/HK3   830P  845A *",
				"RCVD-YVET/ZDPBVWS -CR- QSB/1O3K/1V AG WS 18APR1611Z",
				"SC 9W 122 O04AUG DELLHR HK/UN3   100P  620P *",
				"SC 9W 121 K15JUL LHRDEL HK/UN3   845P  955A *",
				"RCVD-172052/ASC/BFC8DA9A/ NO ID  -CR- HDQ/2G2H/UA RM 9W 17APR2052Z",
				"HS 9W5816 O04AUG LHRJFK SS/HK3   815P 1110P *       1",
				"HS 9W 122 O04AUG DELLHR SS/HK3   100P  620P *       1",
				"HS 9W 121 K15JUL LHRDEL SS/HK3   845P  955A *",
				"HS 9W5833 K04JUL JFKLHR SS/HK3   830P  845A *",
				"RCVD-AMIR/ZDPBVWS -CR- QSB/2G2H/1V AG WS 29MAR0211Z",
			]),
			php.implode(php.PHP_EOL, [
				"     *****  AIR  HISTORY  *****",
				" ",
				" ",
				"29MAR / 02:11 UTC. BY: AMIR. PCC: 2G2H. HISTORICAL SEGMENTS",
				"",
				" 1 9W5833K 04JUL JFKLHR SS/HK3   830P  845A * ",
				" 2 9W 121K 15JUL LHRDEL SS/HK3   845P  955A * ",
				" 3 9W 122O 04AUG DELLHR SS/HK3   100P  620P *  1",
				" 4 9W5816O 04AUG LHRJFK SS/HK3   815P 1110P *  1",
				" ",
				"**********************************************************",
				" ",
				"17APR / 20:52 UTC. BY: NO ID. PCC: 2G2H. ",
				"",
				"   9W 121K 15JUL LHRDEL HK/UN3  845P  955A * - STATUS CHANGE",
				"   9W 122O 04AUG DELLHR HK/UN3  100P  620P * - STATUS CHANGE",
				" ",
				"**********************************************************",
				" ",
				"18APR / 16:11 UTC. BY: YVET. PCC: 1O3K. ",
				"",
				"   9W5833K 04JUL JFKLHR SS/HK3  830P  845A * - CANCELLED SEGMENT",
				"   9W 121K 15JUL LHRDEL HK/UN3  845P  955A * - CANCELLED SEGMENT",
				"   9W 122O 04AUG DELLHR HK/UN3  100P  620P * - CANCELLED SEGMENT",
				"   9W5816O 04AUG LHRJFK SS/HK3  815P 1110P * - CANCELLED SEGMENT",
				" ",
				"**********************************************************",
				" ",
				"18APR / 17:53 UTC. BY: NO ID. PCC: 2G2H. ",
				"",
				"   9W5833K 04JUL JFKLHR HK/HK3              - ADDED SEGMENT",
				"   9W5816O 04AUG LHRJFK HK/HK3              - ADDED SEGMENT",
				" ",
				"**********************************************************",
				" ",
				"18APR / 18:03 UTC. BY: NO ID. PCC: 2G2H. ",
				"",
				"   9W5833K 04JUL JFKLHR HK/HX3              - STATUS CHANGE",
				"   9W5816O 04AUG LHRJFK HK/HX3              - STATUS CHANGE",
				" ",
				"**********************************************************",
				" ",
				"18APR / 18:06 UTC. BY: ALVIN. PCC: 1O3K. ",
				"",
				"   9W5833K 04JUL JFKLHR HK/HX3              - CANCELLED SEGMENT",
				"   9W5816O 04AUG LHRJFK HK/HX3              - CANCELLED SEGMENT",
				" ",
				"**********************************************************",
				" ",
			]),
		]);

		return list;
	}

	/**
	 * @test
	 * @dataProvider providePnrDumps
	 */
	checkDetectedDates($haDump, $expectedResult) {
		let $history, $actualResult;
		$history = PnrHistoryParser.parse($haDump);
		$actualResult = DisplayHistoryActionHelper.display($history);
		this.assertSame($expectedResult, $actualResult);
	}

	getTestMapping() {
		return [
			[this.providePnrDumps, this.checkDetectedDates],
		];
	}
}

module.exports = DisplayHistoryActionHelperTest;
