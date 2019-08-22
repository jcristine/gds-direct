const {expect} = require('chai');
const sinon = require('sinon');
const DictionaryCache = require('../../../../backend/Utils/CommandCompress/DictionaryCache');
const CmdLogs = require('../../../../backend/Repositories/CmdLogs');
const DictionaryBuilder = require('../../../../backend/Utils/CommandCompress/DictionaryBuilder');
const CmdLogDict = require('../../../../backend/Repositories/CmdLogDict');

const provideForReadMultiple = () => {
	const list = [];
	list.push({
		title: 'Read multiple times, only one hit to DB for each gds+type pair',
		apollo: [
			{"id":1,"session_id":1,"gds":"apollo","type":"command","is_mr":0,"dt":"2019-08-20 09:13:19","cmd":"A17DECAKLNOU|SB","duration":0.3903,"cmd_rq_id":182573686,"area":"A","record_locator":"","has_pnr":0,"is_pnr_stored":0,"output":"APOLLO COMMAND OUTPUT"},
			{"id":2,"session_id":2,"gds":"apollo","type":"command","is_mr":0,"dt":"2019-08-20 09:12:59","cmd":"A5FEBNYCBOM|DL","duration":0.5072,"cmd_rq_id":182573620,"area":"A","record_locator":"","has_pnr":1,"is_pnr_stored":0,"output":"APOLLO COMMAND OUTPUT"},
		],
	});

	return list.map(c => [c]);
};

class DictionaryCacheTest extends require('../../Transpiled/Lib/TestCase') {
	async testBuildMultipleNew({apollo}) {
		const stub = sinon.stub(CmdLogs, 'getLastNCommands')
			.withArgs({
				gds: 'apollo',
				type: 'command',
				limit: 10,
			})
			.returns(Promise.resolve(apollo));

		const create = sinon.stub(CmdLogDict, 'storeForCommand')
			.returns(Promise.resolve({insertId: 2}));

		sinon.stub(CmdLogDict, 'getForCommand')
			.withArgs({gds: 'apollo', type: 'command'})
			.returns(Promise.resolve(null))
			.withArgs({gds: 'sabre', type: 'command'})
			.returns(Promise.resolve({
				id: 1,
				type: 'command',
				gds: 'sabre',
				dictionary: 'somethingfabuloussabre',
			}));

		sinon.stub(DictionaryBuilder.prototype, 'build')
			.withArgs(apollo)
			.returns(Promise.resolve(Buffer.from('somethingfabulousapollo')));

		try {
			const cache = new DictionaryCache({
				limit: 10, rounds: 10,
			});

			expect(cache.get({gds: 'apollo', type: 'command'})).to.be.equal(cache.get({gds: 'apollo', type: 'command'}));
			expect(cache.get({gds: 'sabre', type: 'command'})).not.to.be.equal(cache.get({gds: 'apollo', type: 'command'}));

			expect(await cache.get({gds: 'sabre', type: 'command'}))
				.to.be.deep.equal({
					id: 1,
					dictionary: Buffer.from('somethingfabuloussabre'),
				});

			expect(await cache.get({gds: 'apollo', type: 'command'}))
				.to.be.deep.equal({
					id: 2,
					dictionary: Buffer.from('somethingfabulousapollo'),
				});

			expect(stub.calledOnce).to.be.equal(true);

			expect(create.calledOnce).to.be.equal(true);
		} finally {
			sinon.restore();
		}
	}

	getTestMapping() {
		return [
			[provideForReadMultiple, this.testBuildMultipleNew],
		];
	}
}

module.exports = DictionaryCacheTest;