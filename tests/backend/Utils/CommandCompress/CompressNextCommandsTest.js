const sinon = require('sinon');
const {expect} = require('chai');
const CompressNextCommands = require('../../../../backend/Utils/CommandCompress/CompressNextCommands');
const DictionaryCache = require('../../../../backend/Utils/CommandCompress/DictionaryCache');
const CmdLog = require('../../../../backend/Repositories/CmdLogs');
const CmdLogHist = require('../../../../backend/Repositories/CmdLogHist');
const Compressor = require('../../../../backend/Utils/CommandCompress/Compression');

const setupStubs = ({commandsFetched}) => {
	const dictionaryCache = new DictionaryCache({
		limit: 10,
		rounds: 10,
	});

	const cacheStub = sinon.stub(dictionaryCache, 'get');

	sinon.stub(CmdLog, 'getArchivableCommands')
		.onFirstCall()
		.returns(Promise.resolve(commandsFetched))
		.onSecondCall()
		.returns(Promise.resolve([]));

	const store = sinon.stub(CmdLogHist, 'storeArchive')
		.returns(Promise.resolve());

	const removeStub = sinon.stub(CmdLog, 'removeLogs')
		.returns(Promise.resolve());

	for (const [i, command] of Object.entries(commandsFetched)) {
		cacheStub.withArgs(command)
			.returns(Promise.resolve({
				dictionary: Buffer.from('somethingnicefor' + command.type),
				id: parseInt(i, 10) + 1,
			}));
	}

	const compressor = new CompressNextCommands({
		dictionaryCache,
		limit: 10,
		olderThanDays: 2,
		concurrency: 5,
		log: () => {},
	});

	return {
		store,
		removeStub,
		dictionaryCache,
		compressor,
		cacheStub,
	};
};

const provideForCompression = () => {
	const list = [{
		title: 'Test command log compression',
		commandsFetched: [
			{"id":1,"session_id":1,"gds":"apollo","type":"command1","is_mr":0,"dt":"2019-08-20 09:13:19","cmd":"cmd1","duration":1,"cmd_rq_id":182573686,"area":"A","record_locator":"","has_pnr":0,"is_pnr_stored":0,"output":"APOLLO COMMAND OUTPUT1"},
			{"id":2,"session_id":2,"gds":"apollo","type":"command2","is_mr":0,"dt":"2019-08-20 09:12:59","cmd":"cmd2","duration":2,"cmd_rq_id":182573620,"area":"A","record_locator":"","has_pnr":1,"is_pnr_stored":0,"output":"APOLLO COMMAND OUTPUT2"},
		],
	}];

	return list.map(c => [c]);
};

const provideShort = () => {
	const list = [{
		title: 'Short commands should be stored as is',
		commandsFetched: [
			{"id":3,"session_id":3,"gds":"apollo","type":"command1","is_mr":0,"dt":"2019-08-20 09:12:59","cmd":"cmd2","duration":2,"cmd_rq_id":182573620,"area":"A","record_locator":"","has_pnr":1,"is_pnr_stored":0,"output":"SHORTY"},
		],
	}];

	return list.map(c => [c]);
};

const provideNoDictionary = () => {
	const list = [{
		title: 'If no dictionary is constructed it should do nothing',
		commandsFetched: [
			{"id":3,"session_id":3,"gds":"apollo","type":"command1","is_mr":0,"dt":"2019-08-20 09:12:59","cmd":"cmd2","duration":2,"cmd_rq_id":182573620,"area":"A","record_locator":"","has_pnr":1,"is_pnr_stored":0,"output":"SHORTY"},
		],
	}];

	return list.map(c => [c]);
};

class CompressNextCommandsTest extends require('../../Transpiled/Lib/TestCase') {
	async testCommandCompresison({commandsFetched}) {

		const {removeStub, store, compressor} = setupStubs({commandsFetched});

		sinon.stub(Compressor, 'compress')
			.withArgs('APOLLO COMMAND OUTPUT1', Buffer.from('somethingniceforcommand1'))
			.returns(Promise.resolve('compressed text 1'))
			.withArgs('APOLLO COMMAND OUTPUT2', Buffer.from('somethingniceforcommand2'))
			.returns(Promise.resolve('compressed text 2'));

		try {
			await compressor.next();

			this.assertArrayElementsSubset(removeStub.firstCall.args, [[1, 2]]);
			this.assertSame(removeStub.callCount, 1);

			this.assertArrayElementsSubset(store.firstCall.args, [[
				{"id":1,"session_id":1,"gds":"apollo","type":"command1","is_mr":0,"dt":"2019-08-20 09:13:19","cmd":"cmd1","duration":1,"cmd_rq_id":182573686,"area":"A","record_locator":"","has_pnr":0,"is_pnr_stored":0,"output":"compressed text 1", "dictionary": 1, "compression_type": 1},
				{"id":2,"session_id":2,"gds":"apollo","type":"command2","is_mr":0,"dt":"2019-08-20 09:12:59","cmd":"cmd2","duration":2,"cmd_rq_id":182573620,"area":"A","record_locator":"","has_pnr":1,"is_pnr_stored":0,"output":"compressed text 2", "dictionary": 2, "compression_type": 1},
			]]);
		} finally {
			sinon.restore();
		}
	}

	async testShortOutputRaw({commandsFetched}) {
		const {removeStub, store, compressor} = setupStubs({commandsFetched});

		sinon.stub(Compressor, 'compress')
			.returns(Promise.resolve('Something longer than command output'));

		try {
			await compressor.next();

			this.assertArrayElementsSubset(removeStub.firstCall.args, [[3]]);

			this.assertSame(1, removeStub.callCount);

			this.assertArrayElementsSubset(store.firstCall.args, [[
				{"id":3,"session_id":3,"gds":"apollo","type":"command1","is_mr":0,"dt":"2019-08-20 09:12:59","cmd":"cmd2","duration":2,"cmd_rq_id":182573620,"area":"A","record_locator":"","has_pnr":1,"is_pnr_stored":0,"output":"SHORTY", "dictionary": null, "compression_type": 0},
			]]);
		} finally {
			sinon.restore();
		}
	}

	async testNoDictionary({commandsFetched}) {
		const {removeStub, store, compressor, cacheStub, dictionaryCache} = setupStubs({commandsFetched});

		const compressSpy = sinon.spy(Compressor, 'compress');

		cacheStub.restore();

		sinon.stub(dictionaryCache, 'get')
			.returns(Promise.resolve(null));

		try {
			await compressor.next();

			this.assertSame(0, removeStub.callCount);
			this.assertSame(0, compressSpy.callCount);
			this.assertSame(0, store.callCount);
		} finally {
			sinon.restore();
		}
	}

	getTestMapping() {
		return [
			[provideForCompression, this.testCommandCompresison],
			[provideShort, this.testShortOutputRaw],
			[provideNoDictionary, this.testNoDictionary],
		];
	}
}

module.exports = CompressNextCommandsTest;