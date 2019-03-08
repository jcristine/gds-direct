
let aklesuns = require('../Migration/aklesuns.js');
let Db = require('../Utils/Db.js');
let {client, keys} = require('../LibWrappers/Redis.js');
let Diag = require('../LibWrappers/Diag.js');

let TABLE_NAME = 'migrations';

let Migration = () => {
	let logs = [];
	let log = (msg, data) => {
		console.log(msg, data);
		logs.push({dt: new Date().toISOString(), msg, data});
	};

	let runSingle = (migration, db) => {
		let {name, perform} = migration;
		return db.fetchAll({
			table: TABLE_NAME,
			where: [['name', '=', name]],
		}).then(rows => {
			if (rows.length > 0) {
				log('Skipping migration #' + name + ' completed at ' + rows[0].dt);
				return Promise.resolve();
			} else {
				Diag.log('About to run migration #' + name);
				return perform(db)
					.catch(exc => {
						Diag.error('Migration #' + name + ' failed ' + exc);
						return Promise.reject('Migration #' + name + ' failed ' + exc);
					})
					.then(result =>
						db.writeRows(TABLE_NAME, [{
							name: name,
							dt: new Date().toISOString(),
						}]).then(writeResult => {
							Diag.log('Done migration #' + name, result);
							log('Executed migration #' + name, result);
							return result;
						}));
			}
		});
	};

	let runLocked = async () => {
		let migrations = aklesuns.migrations.slice();
		let cnt = migrations.length;
		let runNext = (db) => {
			let next = migrations.shift();
			if (!next) {
				return Promise.resolve({cnt: cnt});
			} else {
				return runSingle(next, db)
					.then(() => runNext(db));
			}
		};

		let start = (db) =>
			db.query([
				'CREATE TABLE IF NOT EXISTS ' + TABLE_NAME + ' ( ',
				'    `id` INTEGER PRIMARY KEY AUTO_INCREMENT, ',
				'    `name` VARCHAR(255) DEFAULT NULL, ',
				'    `dt`  DATETIME DEFAULT NULL, ',
				'    UNIQUE KEY `name` (`name`) ',
				') ENGINE=InnoDb DEFAULT CHARSET=utf8;',
			].join('\n'))
				.then(() => runNext(db));

		return Db.with(db => {
			Diag.log('Got DB from pool');
			return start(db);
		}).then(result => ({result: result, logs: logs}));
	};

	return {
		run: async () => {
			// there are currently 2 supposedly equal servers
			let lockSeconds = 5 * 60; // 5 minutes
			let lockKey = keys.MIGRAT_LOCK;
			Diag.log(new Date().toISOString() + ': Waiting for 10 seconds ' + process.pid);
			await new Promise(resolve => setTimeout(resolve, 10000));
			Diag.log(new Date().toISOString() + ': about to acquire ' + lockKey + ' lock for process ' + process.pid);
			let migrationLock = await client.set(lockKey, process.pid, 'NX', 'EX', lockSeconds);
			if (!migrationLock) {
				let lastValue = await client.get(lockKey);
				return Promise.resolve(new Date().toISOString() + ': Migration is already being handled by other cluster ' + JSON.stringify(migrationLock) + ' lock name: ' + lockKey + ' last value: ' + lastValue);
			}
			Diag.log(new Date().toISOString() + ': Acquired the lock for process ' + process.pid);
			return runLocked()
				.then(async (res) => {
					let delOut = await client.del(lockKey);
					res.delOut = delOut;
					return res;
				})
				.catch((exc) => {
					client.del(lockKey);
					return Promise.reject(exc);
				});
		},
	};
};

exports.run = () => Migration().run();