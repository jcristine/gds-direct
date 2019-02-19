
let aklesuns = require('./Migration/aklesuns.js');
let Db = require('./Utils/Db.js');

let TABLE_NAME = 'migrations';

let runSingle = (migration, db) => {
	let {name, perform} = migration;
	return db.fetchAll({
		table: TABLE_NAME,
		where: [['name', '=', name]],
	}).then(rows => {
		if (rows.length > 0) {
			console.log('Skipping migration #' + name + ' completed at ' + rows[0].dt);
			return Promise.resolve();
		} else {
			return perform(db)
				.catch(exc => Promise.reject('Migration #' + name + ' failed ' + exc))
				.then(result =>
					db.writeRows(TABLE_NAME, [{
						name: name,
						dt: new Date().toISOString(),
					}]).then(writeResult => {
						console.log('Executed migration #' + name, result);
						return result;
					}));
		}
	});
};

exports.run = () => {
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

	return Db.with(db => start(db));
};