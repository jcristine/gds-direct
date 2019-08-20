
const LibMigration = require('klesun-node-tools/src/Maintenance/Migration.js');

const aklesuns = require('../Migration/aklesuns.js');
const Db = require('../Utils/Db.js');
const {getClient} = require('../LibWrappers/Redis.js');

const TABLE_NAME = 'migrations';

exports.run = async () => {
	const redis = await getClient();
	const migrations = aklesuns.migrations;
	return Db.with(db => LibMigration({
		db, redis, migrations, TABLE_NAME,
	}).run());
};