const Db = require("../Utils/Db");

const AREA_TABLE = 'terminalAreaSettings';

/** @return Promise<terminalAreaSettings[]> */
exports.getByAgent = (agentId, db = null) => {
	const withDb = db => db.fetchAll({
		table: AREA_TABLE,
		where: [['agentId', '=', agentId]],
	});
	return db ? withDb(db) : Db.with(withDb);
};

exports.update = (agentId, $gds, $areaSettings) => Db.with(
	db => db.writeRows(AREA_TABLE, $areaSettings.map($areaSetting => ({
		'area': $areaSetting['area'],
		'gds': $gds,
		'agentId': agentId,
		'defaultPcc': $areaSetting['defaultPcc'],
	})))
);