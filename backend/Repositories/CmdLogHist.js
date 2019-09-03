const Db = require('../Utils/Db.js');

const TABLE = 'terminal_command_log_hist';

module.exports.storeArchive = async archivedCommands => {
	const values = archivedCommands.map(r => {
		return '(' + Object.values(r).map(v => Buffer.isBuffer(v) ? 'BINARY(?)' : '?').join(', ') + ')';
	}).join(', ');

	// custom query here as sqlUtil doesn't allow binary data
	const query = `
		INSERT INTO ${TABLE} (${Object.keys(archivedCommands[0])})
		VALUES ${values}
		ON DUPLICATE KEY UPDATE id=id
	`;

	const params = archivedCommands.map(r => {
		return Object.values(r);
	}).reduce((acc, v) => acc.concat(v));

	return Db.with(db => db.query(query, params));
};
