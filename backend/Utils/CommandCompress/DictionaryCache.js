const DictionaryBuilder = require('./DictionaryBuilder');
const CmdLogs = require('../../Repositories/CmdLogs');
const CmdLogDict = require('../../Repositories/CmdLogDict');

// Ensures that there aren't multiple competing requests for same gds and
// type pair
class DictionaryCache {
	constructor({limit, rounds}) {
		this.dictionaryBuilder = new DictionaryBuilder({rounds});
		this.limit = limit;
		this.cache = new Map();
	}

	get({gds, type}) {
		const key = `${gds}:${type}`;

		if (this.cache.has(key)) {
			return this.cache.get(key);
		}

		const promise = this.fetchOrBuild(gds, type);

		this.cache.set(key, promise);

		return promise;
	}

	async fetchOrBuild(gds, type) {
		const existing = await CmdLogDict.getForCommand({gds, type});

		if (existing) {
			return {
				id: existing.id,
				dictionary: Buffer.from(existing.dictionary, 'binary'),
			};
		}

		const lastCommands = await CmdLogs.getLastNCommands({gds, type, limit: this.limit});

		const dictionary = await this.dictionaryBuilder.build(lastCommands);

		if (!dictionary) {
			return null;
		}

		const result = await CmdLogDict.storeForCommand({gds, type, dictionary});

		return {
			id: result.insertId,
			dictionary,
		};
	}
}

module.exports = DictionaryCache;
