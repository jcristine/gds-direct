const Misc = require("../../../../../backend/Transpiled/Lib/Utils/MaskingUtil.js");

const TestCase = require('klesun-node-tools/src/Transpiled/Lib/TestCase.js');

class MiscTest extends TestCase
{
	provideMaskCcNumbers() {
		let tests = [];

		tests.push([
			`>HHMCU1           *** MISC CHARGE ORDER ***\n PASSENGER NAME·SCRECIU/NARCISA DORINA..................\n TO·AA......
................................ AT·DFW............\n VALID FOR·SPLIT...............................................\n
TOUR CODE·............... RELATED TKT NBR·.............\n FOP·TP100182454000014/OK.....................................
.\n EXP DATE·0919 APVL CODE·004671 COMM·0.00/... TAX·........-·..\n AMOUNT·50.00...-·USD EQUIV ·........-·... BSR·.....
.....\n END BOX·......................................................\n REMARK1·......................................
........\n REMARK2·......................................................\n VALIDATING CARRIER·AA                  ISSU
E NOW·.`,
			`>HHMCU1           *** MISC CHARGE ORDER ***\n PASSENGER NAME·SCRECIU/NARCISA DORINA..................\n TO·AA......
................................ AT·DFW............\n VALID FOR·SPLIT...............................................\n
TOUR CODE·............... RELATED TKT NBR·.............\n FOP·TPXXXXXXXXXXX0014/OK.....................................
.\n EXP DATE·0919 APVL CODE·004671 COMM·0.00/... TAX·........-·..\n AMOUNT·50.00...-·USD EQUIV ·........-·... BSR·.....
.....\n END BOX·......................................................\n REMARK1·......................................
........\n REMARK2·......................................................\n VALIDATING CARRIER·AA                  ISSU
E NOW·.`,
		]);

		return tests;
	}

	testMaskCcNumbers(input, output) {
		let actual = Misc.maskCcNumbers(input);
		this.assertSame(output, actual);
	}

	getTestMapping() {
		return [
			[this.provideMaskCcNumbers, this.testMaskCcNumbers],
		];
	}
}

module.exports = MiscTest;
