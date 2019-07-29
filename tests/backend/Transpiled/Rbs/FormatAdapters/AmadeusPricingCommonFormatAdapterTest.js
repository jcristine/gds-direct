

const StringUtil = require('../../../../../backend/Transpiled/Lib/Utils/StringUtil.js');
const CommandParser = require('../../../../../backend/Transpiled/Gds/Parsers/Amadeus/CommandParser.js');
const FxParser = require('../../../../../backend/Transpiled/Gds/Parsers/Amadeus/Pricing/FxParser.js');
const PnrParser = require('../../../../../backend/Transpiled/Gds/Parsers/Amadeus/Pnr/PnrParser.js');

const php = require('../../php.js');
const AmadeusPricingCommonFormatAdapter = require("../../../../../backend/Transpiled/Rbs/FormatAdapters/AmadeusPricingCommonFormatAdapter");
class AmadeusPricingCommonFormatAdapterTest extends require('../../Lib/TestCase.js')
{
    providePtcLinkingCases()  {
        let $list;

        $list = [];

        $list.push([
            {
                'pricingDump': php.implode(php.PHP_EOL, [
                    'FXX/RADT*CNN*ADT*ADT*ADT',
                    '',
                    '',
                    '   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
                    '01 1,3-5             ADT     4     694.00   82.73     776.73',
                    '02 2                 CNN     1     520.00   79.31     599.31',
                    '',
                    '                   TOTALS    5    3296.00  410.23    3706.23',
                    '',
                    'FXU/TS TO UPSELL EF FOR 43.00USD',
                    '1-2 FARE FAMILIES:ES',
                    '1-2 LAST TKT DTE 10DEC17 - DATE OF ORIGIN',
                    '1-2 TICKETS ARE NON-REFUNDABLE',
                    '',
                ]),
                'nameRecords': [],
            },
            [
                {'ptc': 'ADT', 'ptcRequested': 'ADT'},
                {'ptc': 'CNN', 'ptcRequested': 'CNN'},
            ],
        ]);

        $list.push([
            {
                'pricingDump': php.implode(php.PHP_EOL, [
                    'FXX/RIN*CH*ADT*INF*MIL',
                    '',
                    '',
                    '   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
                    '01 2                 CNN     1     371.00   79.31     450.31',
                    '02 3                 ADT     1     742.00   82.73     824.73',
                    '03 5                 ADT     1     742.00   82.73     824.73',
                    '04 1,4               INF     2      75.00    0.00      75.00',
                    '',
                    '                   TOTALS    5    2005.00  244.77    2249.77',
                    '',
                    '1-4 FARE FAMILIES:EF',
                    '1-4 LAST TKT DTE 10DEC17 - DATE OF ORIGIN',
                    '',
                ]),
                'nameRecords': [],
            },
            [
                {'ptc': 'CNN', 'ptcRequested': 'CH'},
                {'ptc': 'ADT', 'ptcRequested': 'ADT'},
                {'ptc': 'ADT', 'ptcRequested': 'MIL'},
                {'ptc': 'INF', 'ptcRequested': 'IN'},
            ],
        ]);

        // multi-store pricing command
        $list.push([
            {
                'pricingDump': php.implode(php.PHP_EOL, [
                    'FXX/P1/PAX/RADT//P1/INF/RINF//P2/RC05',
                    '',
                    '',
                    '   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
                    '01 LIBERMANE/MARINA  ADT     1     759.00   84.11     843.11',
                    '02 LIBERMANE/ZIMICH  CNN     1     380.00   80.73     460.73',
                    '03 LIBERMANE/LEPIN   INF     1      77.00    0.00      77.00',
                    '',
                    '                   TOTALS    3    1216.00  164.84    1380.84',
                    '',
                    'FXU/TS TO UPSELL BC FOR 326.32USD',
                    '1-3 FARE FAMILIES:EF',
                    '1-3 LAST TKT DTE 10DEC17 - DATE OF ORIGIN',
                    '                                                  PAGE  2/ 2',
                    ' ',
                ]),
                'nameRecords': ((PnrParser.parse('  1.LIBERMANE/MARINA(INF/LEPIN) 2.LIBERMANE/ZIMICH') || {})['parsed'] || {})['passengers'] || [],
            },
            [
                {
                    'ptc': 'ADT',
                    'ptcRequested': 'ADT',
                    'storeNumber': 1,
                    'nameNumbers': [
                        {'fieldNumber': '1', 'absolute': 1},
                    ],
                },
                {
                    'ptc': 'CNN',
                    'ptcRequested': 'C05',
                    'storeNumber': 3,
                    'nameNumbers': [
                        {'fieldNumber': '2', 'absolute': 3},
                    ],
                },
                {
                    'ptc': 'INF',
                    'ptcRequested': 'INF',
                    'storeNumber': 2,
                    'nameNumbers': [
                        {'fieldNumber': '1', 'absolute': 2},
                    ],
                },
            ],
        ]);

        // INF had ptcRequested null for some reason
        // oh, that's because infant name starts with same letters as other pax - PATRICK vs PATRICIA
        $list.push([
            {
                'pricingDump': php.implode(php.PHP_EOL, [
                    'FXX/P1,3-4/RADT/PAX//P1/RINF/INF//P2/RC09',
                    '',
                    '',
                    '   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
                    '01 WALTERS/ADAM J    ADT     1     666.00  596.92    1262.92',
                    '02 WALTERS/JESSI*    ADT     1     666.00  596.92    1262.92',
                    '03 WALTERS/PATRI*    ADT     1     666.00  596.92    1262.92',
                    '04 WALTERS/ALAN M    CNN     1     499.00  596.92    1095.92',
                    '05 WALTERS/PATRI*    INF     1      62.00   58.81     120.81',
                    '',
                    '                   TOTALS    5    2559.00 2446.49    5005.49',
                    '',
                    '1-5 LAST TKT DTE 24MAY18 - SEE SALES RSTNS',
                    '1-5 TICKETS ARE NON-REFUNDABLE',
                    '                                                  PAGE  2/ 2',
                    ' ',
                ]),
                'nameRecords': ((PnrParser.parse(php.implode(php.PHP_EOL, [
                    '  1.WALTERS/ADAM J(INFWALTERS/PATRICIA MARIA/17MAY17)',
                    '  2.WALTERS/ALAN M(C09)   3.WALTERS/JESSICA   4.WALTERS/PATRICK',
                ])) || {})['parsed'] || {})['passengers'] || [],
            },
            [
                {
                    'ptc': 'ADT',
                    'ptcRequested': 'ADT',
                    'storeNumber': 1,
                    'nameNumbers': [
                        {'fieldNumber': '1', 'absolute': 1},
                        {'fieldNumber': '3', 'absolute': 4},
                        {'fieldNumber': '4', 'absolute': 5},
                    ],
                },
                {
                    'ptc': 'CNN',
                    'ptcRequested': 'C09',
                    'storeNumber': 3,
                    'nameNumbers': [
                        {'fieldNumber': '2', 'absolute': 3},
                    ],
                },
                {
                    'ptc': 'INF',
                    'ptcRequested': 'INF',
                    'storeNumber': 2,
                    'nameNumbers': [
                        {'fieldNumber': '1', 'absolute': 2},
                    ],
                },
            ],
        ]);

        $list.push([
            {
                'pricingDump': php.implode(php.PHP_EOL, [
                    'FXX/P1,2,4/PAX//P1/INF//P3',
                    '',
                    '',
                    '   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
                    '01 WALTERS/ADAM J    ADT     1     666.00  596.92    1262.92',
                    '02 WALTERS/JESSI*    ADT     1     666.00  596.92    1262.92',
                    '03 WALTERS/PATRI*    ADT     1     666.00  596.92    1262.92',
                    '04 WALTERS/ALAN M    CNN     1     499.00  596.92    1095.92',
                    '05 WALTERS/PATRI*    INF     1      62.00   58.81     120.81',
                    '',
                    '                   TOTALS    5    2559.00 2446.49    5005.49',
                    '',
                    '1-5 LAST TKT DTE 24MAY18 - SEE SALES RSTNS',
                    '1-5 TICKETS ARE NON-REFUNDABLE',
                    '                                                  PAGE  2/ 2',
                    ' ',
                ]),
                'nameRecords': ((PnrParser.parse(php.implode(php.PHP_EOL, [
                    '  1.WALTERS/ADAM J(INFWALTERS/PATRICIA MARIA/17MAY17)',
                    '  2.WALTERS/ALAN M(C09)   3.WALTERS/JESSICA   4.WALTERS/PATRICK',
                ])) || {})['parsed'] || {})['passengers'] || [],
            },
            [
                {
                    'ptc': 'ADT',
                    'ptcRequested': null,
                    'storeNumber': 1,
                    'nameNumbers': [
                        {'fieldNumber': '1', 'absolute': 1},
                        {'fieldNumber': '3', 'absolute': 4},
                        {'fieldNumber': '4', 'absolute': 5},
                    ],
                },
                {
                    'ptc': 'CNN',
                    'ptcRequested': null,
                    'storeNumber': 1,
                    'nameNumbers': [
                        {'fieldNumber': '2', 'absolute': 3},
                    ],
                },
                {
                    'ptc': 'INF',
                    'ptcRequested': null,
                    'storeNumber': 2,
                    'nameNumbers': [
                        {'fieldNumber': '1', 'absolute': 2},
                    ],
                },
            ],
        ]);

        // no passengers specified in pricing command
        $list.push([
            {
                'pricingDump': php.implode(php.PHP_EOL, [
                    'FXX',
                    '',
                    '',
                    '   PASSENGER         PTC    NP  FARE USD  TAX/FEE   PER PSGR',
                    '01 LIBERMANE/LEPIN   CNN     1     297.00   71.24     368.24',
                    '02 LIBERMANE/ZIMICH  CNN     1     297.00   71.24     368.24',
                    '03 LIBERMANE/MARINA  ADT     1     395.00   71.24     466.24',
                    '04 LIBERMANE/STAS    ADT     1     395.00   71.24     466.24',
                    '05 LIBERMANE/KATJA   INF     1      40.00    0.00      40.00',
                    '',
                    '                   TOTALS    5    1424.00  284.96    1708.96',
                    '',
                    '1-5 LAST TKT DTE 07AUG17 - SEE SALES RSTNS',
                    '1-5 60 PERCENT PENALTY APPLIES',
                ]),
                'nameRecords': ((PnrParser.parse(php.implode(php.PHP_EOL, [
                    '  1.LIBERMANE/LEPIN(CHD/05APR10)',
                    '  2.LIBERMANE/MARINA(ADT)(INF/KATJA/20JAN17)   3.LIBERMANE/STAS',
                    '  4.LIBERMANE/ZIMICH(CHD/04APR10)',
                ])) || {})['parsed'] || {})['passengers'] || [],
            },
            [
                {
                    'ptc': 'CNN',
                    'nameNumbers': [
                        {'fieldNumber': '1', 'absolute': 1},
                        {'fieldNumber': '4', 'absolute': 5},
                    ],
                },
                {
                    'ptc': 'ADT',
                    'nameNumbers': [
                        {'fieldNumber': '2', 'absolute': 2},
                        {'fieldNumber': '3', 'absolute': 4},
                    ],
                },
                {
                    'ptc': 'INF',
                    'nameNumbers': [
                        {'fieldNumber': '2', 'absolute': 3},
                    ],
                },
            ],
        ]);

        return $list;
    }

    /**
     * @test
     * @dataProvider providePtcLinkingCases
     */
    testPtcLinking($params, $expected)  {
        let $dump, $cmd, $stores, $ptcRows, $nameRecords, $actual;

        $dump = $params['pricingDump'];
        $cmd = StringUtil.lines($dump)[0];
        $stores = CommandParser.parse($cmd)['data']['pricingStores'];
        $ptcRows = FxParser.parse($dump)['data']['passengers'];
        $nameRecords = $params['nameRecords'];
        $actual = AmadeusPricingCommonFormatAdapter.groupPtcList($ptcRows, $stores, $nameRecords);
        this.assertArrayElementsSubset($expected, $actual);
    }

	getTestMapping() {
		return [
			[this.providePtcLinkingCases, this.testPtcLinking],
		];
	}
}

module.exports = AmadeusPricingCommonFormatAdapterTest;
