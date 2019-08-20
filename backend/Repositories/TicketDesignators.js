const iqJson = require("../Utils/TmpLib").iqJson;
const {getConfig} = require('../Config.js');

const Db = require('../Utils/Db.js');
const php = require('../Transpiled/phpDeprecated.js');
const NotFound = require("klesun-node-tools/src/Rej").NotFound;

const TABLE = 'ticket_designators';

const normalizeRow = ($designator) => {
	return {
		'code': $designator['title'],
		'ticketing_correct_pricing_command':  $designator['ticketing_pricing_command'] || $designator['ticketing_correct_pricing_command'],
		'sale_correct_pricing_command': $designator['sale_pricing_command'] || $designator['sale_correct_pricing_command'],
		'is_published': php.strtolower($designator['fare_type']) === 'published',
		'updated_dt': php.date('Y-m-d H:i:s'),
		'ticketing_gds': $designator['ticketing_gds'] || $designator['gds'],
		'ticketing_pcc': $designator['ticketing_pcc'] || $designator['pcc_title'],
		'tour_code': $designator['tour_code'] || null,
		'updated_in_act_dt': $designator['updated_at'] || null,
		'currency': $designator['currency'] || null,
		'agency_incentive_value': $designator['agency_incentive_amount'] || $designator['incentive_amount'] || null,
		'agency_incentive_units': 'amount',
		'drop_net_value': $designator['dropnet_value'] || $designator['drop_net_value'] || $designator['drop_net'] || null,
		'drop_net_units': $designator['dropnet_type'] || $designator['drop_net_type'] || null,
	};
};

const fetchChunk = async (minUpdateDt) => {
	const config = await getConfig();
	return iqJson({
		url: config.external_service.act.host,
		credentials: {
			login: config.external_service.act.login,
			passwd: config.external_service.act.password,
		},
		functionName: 'getTicketDesignatorsV2ByCriteria',
		serviceName: 'rbs',
		params: {updateDt: minUpdateDt},
	});
};

exports.updateFromService = async () => {
	let $lastDt, $importedTds, $done, $response, $designators, $rows, $lastRow, $cols;
	$lastDt = '0001-01-01 00:00:00'; // could take last record in DB I guess?
	$importedTds = [];
	$done = false;
	while (!$done) {
		$response = (await fetchChunk($lastDt)).result;
		$designators = $response['content'] || [];

		$rows = php.array_map((...args) => normalizeRow(...args), $designators);
		$importedTds = $importedTds.concat($rows.map(r => r.code));
		$lastRow = $rows.slice(-1)[0];
		$cols = php.array_keys($lastRow || []);
		await Db.with(db => db.writeRows(TABLE, $rows));
		const hasMore = $response.result_count < $response.filter_count;
		if (hasMore && $lastRow &&
			$lastRow['updated_in_act_dt'] > $lastDt
		) {
			$lastDt = $lastRow['updated_in_act_dt'];
		} else {
			$done = true;
		}
	}

	return {
		message: 'imported ' + new Set($importedTds).size + ' ticket designators',
	};
};

exports.findByCode = async (gds, code) => {
	if ((code || '').length !== 10) {
		return NotFound('Not an ITN ticket designator');
	}
	/** @var row = normalizeRow() */
	const row = await Db.with(db => db.fetchOne({
		table: TABLE,
		where: [
			['code', '=', code],
		],
	}));
	return row;
};