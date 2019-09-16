const OpenPnr = require('../../../backend/Actions/OpenPnr.js');
const GdsActionTestUtil = require('../../../backend/Utils/Testing/GdsActionTestUtil.js');

const provide_call = () => {
	const testCases = [];

	testCases.push({
		title: 'Amadues "WARNING:" example',
		input: {
			gds: 'apollo',
			recordLocator: 'JZNN08',
			allowPccChange: true,
		},
		output: {
			pcc: '2G8P',
			pnr: {
				parsed: {
					headerData: {
						reservationInfo: {
							recordLocator: 'JZNN08',
						},
					},
				},
			},
		},
		calledCommands: [
			{ cmd: '*JZNN08',
			  output: 'NO AGREEMENT EXISTS FOR PSEUDO CITY - 2G8P\n><' },
			{ cmd: 'SEM/2G8P/AG',
			  output: 'PROCEED/16SEP-DOWNTOWN TRAVEL          ATL - APOLLO\n><' },
			{ cmd: '*JZNN08',
			  output:
			   'CREATED IN GDS DIRECT BY AKLESUNS\nJZNN08/WS QSBYC DPBVWS  AG 10577976 16SEP\n 1.1KLESUNE/ANITA*P-C05 \n 1 PS 188X 20MAY RIXKBP HK1   600A  735A *         WE   E\nFONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT\nTKTG-TAU/16SEP\nGFAX-SSRADTK1VTOPS BY 18SEP 1800 ATL TIME ZONE OTHERWISE WILL BE XLD\n   2 OSIPS TCP LD6I9G\nRMKS-GD-AKLESUNS/6206 IN 2G8P\nTRMK-CA ACCT-SFO@$0221686\nACKN-1A LDJJ7X   16SEP 1859\n   2 1A LDJJ7X   16SEP 1859\n><' },
		],
	});

	return testCases.map(a => [a]);
};

class AddMpRemarkTest extends require('../../../backend/Transpiled/Lib/TestCase.js') {
	async test_call(testCase) {
		const getActual = async (gdsSession, input) => {
			let {pcc, pnr} = await OpenPnr({gdsSession, ...input});
			pnr = {...pnr};
			return {pcc, pnr};
		};
		await GdsActionTestUtil.testGdsAction(this, testCase, getActual);
	}

	getTestMapping() {
		return [
			[provide_call, this.test_call],
		];
	}
}

module.exports = AddMpRemarkTest;