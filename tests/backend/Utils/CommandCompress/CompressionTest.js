const Compression = require('../../../../backend/Utils/CommandCompress/Compression');

const provideCompression = () => {
	const list = [];

	list.push({
		title: 'Compress text with dictionary',
		text: 'somethingsomethingdangerous',
		dictionary: Buffer.from('somethingelsealso'),
	});

	return list.map(c => [c]);
};

class CompressionTest extends require('../../Transpiled/Lib/TestCase') {
	async testCompressDecompress({text, dictionary}) {
		const archive = await Compression.compress(text, dictionary);
		this.assertSame(true, Buffer.isBuffer(archive));
		const output = await Compression.decompress(archive, dictionary);
		this.assertSame(text, output.toString());
	}

	getTestMapping() {
		return [
			[provideCompression, this.testCompressDecompress],
		];
	}
}

module.exports = CompressionTest;