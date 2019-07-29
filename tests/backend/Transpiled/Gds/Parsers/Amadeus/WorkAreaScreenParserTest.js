

const php = require('../../../php.js');
const WorkAreaScreenParser = require("../../../../../../backend/Transpiled/Gds/Parsers/Amadeus/WorkAreaScreenParser");
class WorkAreaScreenParserTest extends require('../../../Lib/TestCase.js')
{
    provideDumps()  {
        let $list;

        $list = [];

        // in a queue
        $list.push([
            php.implode(php.PHP_EOL, [
                '/$',
                '00000000         SFO1S2195                                     ',
                '',
                'AREA  TM  MOD SG/DT.LG TIME      ACT.Q   STATUS     NAME ',
                'A-IN      PRD WS/SU.EN  24       00C00 PNR MODIFY   BOUSSIENGUE/',
                'B                                      NOT SIGNED   ',
                'C                                      NOT SIGNED   ',
                'D                                      NOT SIGNED   ',
                'E                                      NOT SIGNED   ',
                'F                                      NOT SIGNED   ',
            ]),
            {
                'pcc': 'SFO1S2195',
                'records': [
                    {
                        'areaLetter': 'A',
                        'isSignedIn': true,
                        'isCurrentArea': true,
                        'initials': 'WS',
                        'dutyCode': 'SU',
                        'activeQueue': '00C00',
                        'status': 'PNR MODIFY',
                        'hasPnr': true,
                        'name': 'BOUSSIENGUE/',
                    },
                    {'areaLetter': 'B', 'isSignedIn': false},
                    {'areaLetter': 'C', 'isSignedIn': false},
                    {'areaLetter': 'D', 'isSignedIn': false},
                    {'areaLetter': 'E', 'isSignedIn': false},
                    {'areaLetter': 'F', 'isSignedIn': false},
                ],
            },
        ]);

        // in PNR creation process
        $list.push([
            php.implode(php.PHP_EOL, [
                '/$',
                '00000000         SFO1S2195                                     ',
                '',
                'AREA  TM  MOD SG/DT.LG TIME      ACT.Q   STATUS     NAME ',
                'A-IN      PRD WS/SU.EN  24             PNR CREATE   ',
                'B                                      NOT SIGNED   ',
                'C                                      NOT SIGNED   ',
                'D                                      NOT SIGNED   ',
                'E                                      NOT SIGNED   ',
                'F                                      NOT SIGNED   ',
            ]),
            {
                'records': [
                    {'areaLetter': 'A', 'isCurrentArea': true, 'status': 'PNR CREATE', 'hasPnr': true},
                    {'areaLetter': 'B', 'isSignedIn': false},
                    {'areaLetter': 'C', 'isSignedIn': false},
                    {'areaLetter': 'D', 'isSignedIn': false},
                    {'areaLetter': 'E', 'isSignedIn': false},
                    {'areaLetter': 'F', 'isSignedIn': false},
                ],
            },
        ]);

        // in a stored PNR
        $list.push([
            php.implode(php.PHP_EOL, [
                '/$',
                '00000000         SFO1S2195                                     ',
                '',
                'AREA  TM  MOD SG/DT.LG TIME      ACT.Q   STATUS     NAME ',
                'A-IN      PRD WS/SU.EN  24             PNR MODIFY   AKINBOWALE/E',
                'B                                      NOT SIGNED   ',
                'C                                      NOT SIGNED   ',
                'D                                      NOT SIGNED   ',
                'E                                      NOT SIGNED   ',
                'F                                      NOT SIGNED   ',
            ]),
            {
                'records': [
                    {'areaLetter': 'A', 'isCurrentArea': true, 'status': 'PNR MODIFY', 'hasPnr': true, 'name': 'AKINBOWALE/E'},
                    {'areaLetter': 'B', 'isSignedIn': false},
                    {'areaLetter': 'C', 'isSignedIn': false},
                    {'areaLetter': 'D', 'isSignedIn': false},
                    {'areaLetter': 'E', 'isSignedIn': false},
                    {'areaLetter': 'F', 'isSignedIn': false},
                ],
            },
        ]);

        // not in PNR
        $list.push([
            php.implode(php.PHP_EOL, [
                '/$',
                '00000000         SFO1S2195                                     ',
                '',
                'AREA  TM  MOD SG/DT.LG TIME      ACT.Q   STATUS     NAME ',
                'A-IN      PRD WS/SU.EN  24             SIGNED       ',
                'B                                      NOT SIGNED   ',
                'C                                      NOT SIGNED   ',
                'D                                      NOT SIGNED   ',
                'E                                      NOT SIGNED   ',
                'F                                      NOT SIGNED   ',
            ]),
            {
                'records': [
                    {'areaLetter': 'A', 'isCurrentArea': true, 'status': 'SIGNED', 'hasPnr': false},
                    {'areaLetter': 'B', 'isSignedIn': false},
                    {'areaLetter': 'C', 'isSignedIn': false},
                    {'areaLetter': 'D', 'isSignedIn': false},
                    {'areaLetter': 'E', 'isSignedIn': false},
                    {'areaLetter': 'F', 'isSignedIn': false},
                ],
            },
        ]);

        return $list;
    }

    /**
     * @test
     * @dataProvider provideDumps
     */
    testParser($dump, $expected)  {
        let $actual;

        $actual = WorkAreaScreenParser.parse($dump);
        this.assertArrayElementsSubset($expected, $actual);
    }

	getTestMapping() {
		return [
			[this.provideDumps, this.testParser],
		];
	}
}
WorkAreaScreenParserTest.count = 0;
module.exports = WorkAreaScreenParserTest;
