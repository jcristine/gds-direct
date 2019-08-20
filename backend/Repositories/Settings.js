
const Db = require('../Utils/Db.js');
const Rej = require('klesun-node-tools/src/Rej.js');

const TABLE = 'admin_settings';

exports.set = ({name, value}) => {
	if (name === 'gdsProfiles') {
		// check that it is valid json
		if (!JSON.parse(value)) {
			return Rej.BadRequest('value is not valid json');
		}
	}
	return Db.with(db => db.writeRows(TABLE, [{name, value}]));
};

exports.delete = ({name}) => {
	const sql = 'DELETE FROM admin_settings WHERE name = ?';
	return Db.with(db => db.query(sql, [name]));
};

exports.getAll = () => Db.with(db => db.fetchAll({table: TABLE}));

/** @return {Promise<String>} */
exports.get = ({name}) => Db.fetchOne({
	table: TABLE, where: [['name', '=', name]],
}).then(row => row.value);