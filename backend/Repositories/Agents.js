
let Db = require('./../Utils/Db.js');
let php = require('../Transpiled/php.js');
let {getClient, keys} = require('../LibWrappers/Redis.js');

exports.getFsCallsUsed = async (agentId) => {
	let rows = await Db.with(db => db.query([
		'SELECT COUNT(*) AS cnt,',
		'       MIN(dt) AS minDt',
		'FROM counted_fs_usages ',
		'WHERE agent_id = ?',
		'    AND dt >= ?',
	].join('\n'), [
		agentId,
		php.date('Y-m-d H:i:s', php.strtotime('-1 day')),
	]));
	return rows[0];
};

exports.getGdsDirectCallsUsed = async (agentId) => {
	let cacheKey = keys.AGENT_CMD_COUNTER + ':' + agentId;
	let client = await getClient();
	let cached = await client.get(cacheKey).catch(exc => null);
	if (cached !== null) {
		return cached;
	}

	let sql = [
		'SELECT COUNT(*) as cnt FROM terminal_command_log tcl',
		'JOIN terminal_sessions ts ON ts.id = tcl.session_id',
		'WHERE TRUE',
		'    AND ts.agent_id = ?',
		'    AND (ts.closed_dt IS NULL OR ts.closed_dt >= ?)',
		'    AND tcl.dt >= ?',
	].join('\n');
	let values = [
		agentId,
		php.date('Y-m-d H:i:s', php.strtotime('-1 day')),
		php.date('Y-m-d H:i:s', php.strtotime('-1 day')),
	];

	let rows = await Db.with(db => db.query(sql, values));
	let cnt = rows[0].cnt;

	client.set(cacheKey, cnt, 'EX', 5 * 60);

	return cnt;
};