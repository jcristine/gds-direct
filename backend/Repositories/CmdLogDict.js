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

module.exports.storeForCommand = async ({gds, type, dictionary, compressionType}) => {
	return Db.with(async db => {
		const maxResult = await db.query(
			`SELECT MAX(id) as max from ${TABLE} WHERE gds=? and type=?`,
			[gds, type],
		);

		const maxId = maxResult && maxResult[0] && maxResult[0].max || 0;

		const query = `
			INSERT INTO ${TABLE} (id, gds, type, dictionary, compression_type, created)
			VALUES (?, ?, ?, BINARY(?), ?, NOW())`;

		await db.query(query, [maxId + 1, gds, type, dictionary, compressionType]);

		return {
			id: maxId + 1,
			gds,
			type,
		};
	});
};

