const MultiLevelMap = require('../Utils/MultiLevelMap.js');

const {getConfig} = require('../Config.js');
const Db = require('../Utils/Db.js');
const sqlNow = require("../Utils/TmpLib").sqlNow;
const iqJson = require("dyn-utils/src/DynUtils.js").iqJson;
const {strval, implode, array_column, array_combine} = require('klesun-node-tools/src/Transpiled/php.js');

const TABLE = 'airports';

const normalizeRow = ($row) => ({
	iata_code: $row['airport_code_en'],
	name: $row['airport_title_en'],
	country_code: strval($row['country_code']),
	country_code_3: strval($row['country_iso3']),
	country_name: strval($row['country_title_en']),
	state_code: strval($row['state_code']),
	city_code: strval($row['city_code_en']),
	city_name: strval($row['city_title_en']),
	region_id: $row['region_id'] || null,
	region_name: $row['region'] || null,
	lat: $row['airport_latitude'],
	lon: $row['airport_longitude'],
	tz: strval($row['airport_timezone']),
	updated_dt: sqlNow(),
	alternatives: implode(',', array_column($row['alternatives'] || [], 'code_en')),
});

exports.updateFromService = async () => {
	const config = await getConfig();
	/** @type IGetAirportsRs */
	const serviceResult = await iqJson({
		url: config.external_service.infocenter.host,
		credentials: {
			login: config.external_service.infocenter.login,
			passwd: config.external_service.infocenter.password,
		},
		functionName: 'getAirports',
		serviceName: 'infocenter',
		params: {folder: 'arc'},
	});

	const rows = Object
		.values(serviceResult.result.data)
		.map(normalizeRow);

	const written = await Db.with(db => db.writeRows(TABLE, rows));
	return {
		message: 'written ' + rows.length + ' rows to db',
		sqlResult: written,
	};
};

exports.findByCode = (code) =>
	Db.with(db => db.fetchOne({
		table: TABLE,
		where: [['iata_code', '=', code]],
	}));

exports.findByCity = (code) =>
	Db.with(db => db.fetchOne({
		table: TABLE,
		where: [['city_code', '=', code]],
	}));

exports.getRegionNames = () => {
	const sql = 'SELECT DISTINCT region_id, region_name FROM airports';
	return Db.with(db => db.query(sql))
		.then($rows => array_combine(
			$rows.map(r => r.region_id),
			$rows.map(r => r.region_name),
		));
};

exports.getCountryNames = () => {
	const sql = 'SELECT DISTINCT country_code, country_name FROM airports';
	return Db.with(db => db.query(sql))
		.then($rows => array_combine(
			$rows.map(r => r.country_code),
			$rows.map(r => r.country_name),
		));
};

exports.getAllLocations = async () => {
	const rows = await Db.fetchAll({table: TABLE});

	const typeToValueToName = MultiLevelMap();
	for (const row of Object.values(rows)) {
		typeToValueToName.set(['airport', row.iata_code], row.name);
		typeToValueToName.set(['city', row.city_code], row.city_name);
		typeToValueToName.set(['country', row.country_code], row.country_name);
		typeToValueToName.set(['region', row.region_id], row.region_name);
	}

	const records = [];
	for (const [type, valueToName] of Object.entries(typeToValueToName.root)) {
		for (const [value, name] of Object.entries(valueToName)) {
			if (value) {
				records.push({type, value, name});
			}
		}
	}

	return records;
};