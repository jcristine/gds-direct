const Db = require('../Utils/Db.js');

const TABLE = 'agent_custom_settings';

exports.get = (agentId, name) => {
	return Db.fetchOne({
		table: TABLE,
		where: [
			['agentId', '=', agentId],
			['name', '=', name],
		],
	}).then(row => JSON.parse(row.data));
};

exports.getMapping = async (agentId) => {
	const rows = await Db.fetchAll({
		table: TABLE,
		where: [
			['agentId', '=', agentId],
		],
	});
	const mapping = {};
	for (const row of rows) {
		mapping[row.name] = JSON.parse(row.data);
	}
	return mapping;
};

exports.set = (agentId, name, value) => {
	return Db.with(db => db.writeRows(TABLE, [{
		agentId, name, data: JSON.stringify(value),
	}]));
};