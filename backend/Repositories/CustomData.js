
const Db = require('../Utils/Db.js');

const TABLE = 'custom_data';

exports.set = (name, value) => {
	let serialized = JSON.stringify(value);
	return Db.with(db => db.writeRows(TABLE, [{name, value: serialized}]));
};

exports.getAll = () => Db.with(db => db.fetchAll({table: TABLE}));

/** @return {Promise<String>} */
exports.get = (name) => Db.fetchOne({
	table: TABLE, where: [['name', '=', name]],
}).then(row => JSON.parse(row.value));