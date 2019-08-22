const Compressor = require('./Compression');
const CmdLogs = require('../../Repositories/CmdLogs');
const CmdLogsHist = require('../../Repositories/CmdLogHist');
const plimit = require('p-limit');
const _ = require('lodash');

// Has ability to compress commands in a loop
class CommandCompressor {
	constructor({dictionaryCache, concurrency, limit, olderThanDays, log}) {
		this.dictionaryCache = dictionaryCache;
		this.limit = limit;
		this.olderThanDays = olderThanDays;
		this.concurrency = concurrency;
		this.log = log;
	}

	async next() {
		let commands = await this.getOldCommands();

		while (commands.length > 0) {
			await this.processCommands(commands, this.concurrency, this.dictionaryCache);

			commands = await this.getOldCommands();
		}
	}

	async getOldCommands() {
		return CmdLogs.getArchivableCommands({
			limit: this.limit,
			olderThan: new Date(Date.now() - this.olderThanDays * 24 * 60 * 60 * 1000).toISOString(),
		});
	}

	async compressCommand(command) {
		const dictionary = await this.dictionaryCache.get(command);

		// it will get no dictionary output if there isn't enough data to
		// build generic enough dictionary
		if (!dictionary) {
			this.log('No dictionary could be built for', {
				type: command.type,
				gds: command.gds,
			});

			return null;
		}

		const compressed = await Compressor.compress(command.output, dictionary.dictionary);

		// output can potentially be bigger with zip header if output was small to start with
		const zipIsBigger = compressed.length >= Buffer.byteLength(command.output);

		const result = zipIsBigger ? {
			...command,
			dictionary: null,
		}: {
			...command,
			output: compressed,
			dictionary: dictionary.id,
		};

		return _.pick(result, ['id', 'session_id', 'cmd', 'type', 'is_mr', 'dt', 'cmd_rq_id',
			'compression_type', 'output', 'dictionary']);
	}

	async processCommands(commands) {
		const limit = plimit(this.concurrency);

		const promises = commands.map(async command => limit(async () => this.compressCommand(command)));

		const results = (await Promise.all(promises)).filter(output => output);

		if (results.length > 0) {
			try {
				await CmdLogsHist.storeArchive(results);
				// @TODO
				// Temporarly commented out while it is being tested in prod to
				// see if it works as expected
				// await CmdLogs.removeLogs(results.map(c => c.id));
			} catch (e) {
				this.log('Store and remove failed, retrying in sequence', e);
				// just in case something fails in DB,
				// this way it will at least move forward
				for (const result of results) {
					await CmdLogsHist.storeArchive([result]);

					// @TODO
					// Temporarly commented out while it is being tested in prod to
					// see if it works as expected
					// await CmdLogs.removeLogs([result.id]);
				}
			}
		}
	}
}

module.exports = CommandCompressor;