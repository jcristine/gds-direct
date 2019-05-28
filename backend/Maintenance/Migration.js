
let LibMigration = require('klesun-node-tools/src/Maintenance/Migration.js');

let aklesuns = require('../Migration/aklesuns.js');
let Db = require('../Utils/Db.js');
let {getClient} = require('../LibWrappers/Redis.js');

let TABLE_NAME = 'migrations';

exports.run = async () => {
	let redis = await getClient();
	let migrations = aklesuns.migrations;
	return Db.with(db => LibMigration({
		db, redis, migrations, TABLE_NAME,
	}).run());
};