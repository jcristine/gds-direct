
const Db = require('./../Utils/Db.js');
const php = require('../Transpiled/phpDeprecated.js');
const Emc = require("../LibWrappers/Emc");
const {getClient, keys} = require('../LibWrappers/Redis.js');

const TABLE = 'agents';

/** @param {getUsers_rs_el} $row */
const normalizeRow = ($row) => {
	let $sabreLniata, $emails, $companyName, $companyData;

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
	const rows = await Db.with(db => db.query([
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
	const cacheKey = keys.AGENT_CMD_COUNTER + ':' + agentId;
	const client = await getClient();
	const cached = await client.get(cacheKey).catch(exc => null);
	if (cached !== null) {
		return cached;
	}

	const sql = [
		'SELECT COUNT(*) as cnt FROM terminal_command_log tcl',
		'JOIN terminal_sessions ts ON ts.id = tcl.session_id',
		'WHERE TRUE',
		'    AND ts.agent_id = ?',
		'    AND (ts.closed_dt IS NULL OR ts.closed_dt >= ?)',
		'    AND tcl.dt >= ?',
	].join('\n');
	const values = [
		agentId,
		php.date('Y-m-d H:i:s', php.strtotime('-1 day')),
		php.date('Y-m-d H:i:s', php.strtotime('-1 day')),
	];

	const rows = await Db.with(db => db.query(sql, values));
	const cnt = rows[0].cnt;

	client.set(cacheKey, cnt, 'EX', 5 * 60);

	return cnt;
};

exports.updateFromService = async () => {
	const emc = await Emc.getClient();
	// keeping useCache false will cause "Not ready yet. Project: 178,
	// Company:" error, so the only choice is to make a low-level request
	emc.setMethod('getUsers');
	/** @type {getUsers_rs} */
	const serviceResult = await emc.call();

	const rows = Object
		.values(serviceResult.data.users)
		.filter(u => u.id) // older versions of EMC may return empty rows
		.map(normalizeRow);

	const written = await Db.with(db => db.writeRows(TABLE, rows));
	return {
		message: 'written ' + rows.length + ' rows to db',
		sqlResult: written,
	};
};

exports.getById = async (id) => {
	/** @var row = normalizeRow() */
	const row = await Db.with(db => db.fetchOne({
		table: TABLE,
		where: [['id', '=', id]],
	}));
	return row;
};

exports.getAll = async () => {
	const rows = await Db.with(db => db.fetchAll({
		table: TABLE,
		orderBy: 'id ASC',
	}));
	return rows.map(r => {
        /** @var typed = normalizeRow() */
        const typed = r;
		return typed;
	});
};