const {expect} = require('chai');
const _ = require('lodash');
const sinon = require('sinon');
const DictionaryBuilder = require('../../../../backend/Utils/CommandCompress/DictionaryBuilder');

const provideInput = () => {
	const list = [];

	list.push({
		title: 'Return null if there are not enough of samples',
		samples: [{output: 'something short'}],
		output: null,
	});

	list.push({
		title: 'Return null if there are not enough of samples',
		samples: [{output: new Array(16*1024).fill('a').join('')}, {output: new Array(16*1024).fill('b').join('')}],
		output: Buffer.from(new Array(16*1024).fill('a').join('') + new Array(16*1024).fill('b').join('')).slice(-32*1024 + 262),
	});

	return list.map(c => [c]);
};

class DictionaryBuilderTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js') {
	async testCompressDecompress({samples, output}) {
		const builder = new DictionaryBuilder({
			rounds: 3,
			concurrency: 1,
		});

		sinon.stub(_, 'shuffle')
			.callsFake(arr => arr);

		try {
			expect(await builder.build(samples)).to.be.deep.equal(output);
		} finally {
			sinon.restore();
		}
	}

	getTestMapping() {
		return [
			[provideInput, this.testCompressDecompress],
		];
	}
}

module.exports = DictionaryBuilderTest;
