const Compression = require('./Compression');
const _ = require('lodash');
const plimit = require('p-limit');

// From experiments full block size has best compression ratio(-262 is there
// becuase deflate will discard 262 bytes from end of the block anyway)
const maxDictLength = 32 * 1024 - 262;

class DictionaryBuilder {
	constructor({rounds, concurrency = 2}) {
		this.rounds = rounds;
		this.concurrency = concurrency;
	}

	// Through experiments there is no straightforward and easy approach that would
	// provide better compression ratio than just taking random sample of outputs and
	// finding which combination has the best
	async build(samples) {
		const inputSize = samples
			.reduce((acc, s) => acc + Buffer.byteLength(s.output), 0);

		const limit = plimit(this.concurrency);

		// there isn't really a point in using sub optimal dictionary,
		// it would be better to just wait for more commands of same type
		if (inputSize < maxDictLength) {
			return null;
		}

		const randomDictionaries = _.range(this.rounds)
			.map(() => buildDictionaryBuffer(_.shuffle(samples)));

		const sizes = await Promise.all(randomDictionaries.map(async dictionary => limit(async () => {
			let size = 0;
			for (const sample of samples) {
				size += await Compression.compress(sample.output, dictionary);
			}
			return size;
		})));

		const bestDictionary = sizes.findIndex((size, i, arr) => arr.every(otherSize => otherSize >= size));

		return randomDictionaries[bestDictionary];
	}
}

module.exports = DictionaryBuilder;

const buildDictionaryBuffer = samples => {
	let result = Buffer.alloc(0);

	for (const sample of samples) {
		result = Buffer.concat([result, Buffer.from(sample.output)]);

		if (result.length >= maxDictLength) {
			return result.slice(-maxDictLength);
		}
	}

	return result;
};