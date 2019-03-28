
let Db = require('./../Utils/Db.js');
let php = require('../Transpiled/php.js');
const Emc = require("../LibWrappers/Emc");
let {getClient, keys} = require('../LibWrappers/Redis.js');

const TABLE = 'agents';

/** @param {getUsers_rs_el} $row */
let normalizeRow = ($row) => {
	let $sabreLniata, $emails, $companyName, $companyData, $userData;

	$sabreLniata = ($row['settings'] || {})['Sabre LNIATA'] || [];
	$emails = [];
	for ($companyName of Object.values($row['availableCompanies'] || [])) {
		$companyData = ($row['companySettings'] || {})[$companyName];
		if ($companyData && $companyData['email']) {
			$emails[$companyName] = $companyData['email'];
		}
	}
	return {
		'id': $row['id'],
		'login': $row['displayName'],
		'name': $row['name'],
		'is_active': $row['isActive'],
		'fp_initials': ($row['settings'] || {})['fp_initials'] || '',
		'email_list': !php.empty($emails) ? php.json_encode($emails) : '',
		'sabre_initials': ($row['settings'] || {})['Sabre Initials'] || '',
		'sabre_lniata': php.is_array($sabreLniata) ? php.implode(', ', $sabreLniata) : $sabreLniata,
		'sabre_id': ($row['settings'] || {})['Sabre ID'] || '',
		'team_id': $row['teamId'] || '',
		'updated_dt': php.date('Y-m-d H:i:s'),
		'deactivated_dt': ($row['settings'] || {})['unactivatedDt'],
		'gds_direct_fs_limit': ($row['settings'] || {})['gds_direct_fs_limit'],
		'gds_direct_usage_limit': ($row['settings'] || {})['gds_direct_usage_limit'],
		'roles': ($row.roles || []).join(','),
	};
};

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

exports.updateFromService = async () => {
	let emc = await Emc.getClient();
	// keeping useCache false will cause "Not ready yet. Project: 178,
	// Company:" error, so the only choice is to make a low-level request
	emc.setMethod('getUsers');
	/** @type {getUsers_rs} */
	let serviceResult = await emc.call();

	let rows = Object
		.values(serviceResult.data.users)
		.filter(u => u.id) // older versions of EMC may return empty rows
		.map(normalizeRow);

	let written = await Db.with(db => db.writeRows(TABLE, rows));
	return {
		message: 'written ' + rows.length + ' rows to db',
		sqlResult: written,
	};
};

exports.getById = async (id) => {
	return Db.with(db => db.fetchOne({
		table: TABLE,
		where: [['id', '=', id]],
	}));
};