const Db = require('../Utils/Db.js');
const TABLE = 'terminal_command_log_hist_dictionary';

module.exports.getForCommand = async ({gds, type}) => {
	return Db.with(async db => {
		const result = await db.fetchAll({
			table: TABLE,
			where: [
				['type', '=', type],
				['gds', '=', gds],
				['status', '=', 1],
			],
			orderBy: 'id DESC',
		});

		return result ? result[0] : null;
	});

};

module.exports.storeForCommand = async ({gds, type, dictionary}) => {
	const query = `
		INSERT INTO ${TABLE} (gds, type, dictionary, created)
		VALUES (?, ?, BINARY(?), ?)`;

	return Db.with(db =>
		db.query(query, [gds, type, dictionary, new Date().toISOString()])
	);
};

