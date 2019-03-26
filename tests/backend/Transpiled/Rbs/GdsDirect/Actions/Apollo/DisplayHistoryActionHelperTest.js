
// namespace Rbs\GdsDirect\Actions\Apollo;

const PnrHistoryParser = require('../../../../../../../backend/Transpiled/Gds/Parsers/Apollo/PnrHistoryParser.js');
const DisplayHistoryActionHelper = require("../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Apollo/DisplayHistoryActionHelper");

let php = require('../../../../../../../backend/Transpiled/php.js');

class DisplayHistoryActionHelperTest extends require('../../../../../../../backend/Transpiled/Lib/TestCase.js')
{
    providePnrDumps()  {
        let $list;
        $list = [];
        $list.push([
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
        return $list;
    }

    /**
     * @test
     * @dataProvider providePnrDumps
     */
    checkDetectedDates($haDump, $expectedResult)  {
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
