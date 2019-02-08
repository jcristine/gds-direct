
// namespace Gds\Parsers\Apollo;

const CommonParserHelpers = require('../../../../../../../backend/Transpiled/Gds/Parsers/Apollo/CommonParserHelpers.js');

class CommonParserHelpersTest extends require('../../../../../../../backend/Transpiled/Lib/TestCase.js')
{
    provideDecodeApolloTimeData()  {
        return [
            ['1200N', '12:00'],
            ['1200M', '00:00'],
            ['0200A', '02:00'],
            ['0020A', '00:20'],
            ['0200P', '14:00'],
            ['200P', '14:00'],
            ['1740A', '17:40'], // agent mistyped
            ['', null],
        ];
    }

    /**
     * @dataProvider provideDecodeApolloTimeData
     */
    testDecodeApolloTime($timeStr, $expected)  {
        let $this;
        this.assertEquals($expected, CommonParserHelpers.decodeApolloTime($timeStr));
    }

    provideParsePartialDateData()  {
        return [
            ['09FEB', '02-09'],
            ['9FEB', '02-09'],
            ['29FEB', '02-29'],
            ['31MAR', '03-31'],
            ['99MAR', null],
            ['31APR', null],
            ['87IGB', null],
            ['00DEC', null],
            ['', null],
        ];
    }

    /**
     * @dataProvider provideParsePartialDateData
     */
    testParsePartialDate($date, $expected)  {
        let $this;
        this.assertEquals($expected, CommonParserHelpers.parsePartialDate($date));
    }

    provideParseApolloFullDateData()  {
        return [
            ['09FEB16', '16-02-09'],
            ['9FEB16', '16-02-09'],
            ['9FEB46', '46-02-09'],
            ['7JHG6Y', null],
            ['19MARNX', null],
            ['19MAR', null],
            ['', null],
            // irrelevant text was mistakenly captured by a regex - should
            // not produce a date in invalid format, '2005-10-1221'
            ['1221OCT05', null],
        ];
    }

    /**
     * @dataProvider provideParseApolloFullDateData
     */
    testParseApolloFullDate($date, $expected)  {
        let $this;
        this.assertEquals($expected, CommonParserHelpers.parseApolloFullDate($date));
    }

	getTestMapping() {
		return [
			[this.provideDecodeApolloTimeData, this.testDecodeApolloTime],
			[this.provideParsePartialDateData, this.testParsePartialDate],
			[this.provideParseApolloFullDateData, this.testParseApolloFullDate],
		];
	}
}

module.exports = CommonParserHelpersTest;