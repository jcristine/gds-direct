
const IqClients = require('../LibWrappers/IqClients.js');
const _ = require('lodash');

const Db = require('../Utils/Db.js');
const {sqlNow} = require('klesun-node-tools/src/Utils/Misc.js');
const {array_combine} = require('klesun-node-tools/src/Transpiled/php.js');

const TABLE = 'airports';

const normalizeRow = (icnRow) => ({
	iata_code: icnRow.airport_code_en,
	name: icnRow.airport_title_en,
	country_code: icnRow.country_code || '',
	country_code_3: icnRow.country_iso3 || '',
	country_name: icnRow.country_title_en || '',
	state_code: icnRow.state_code || '',
	city_code: icnRow.city_code_en || '',
	city_name: icnRow.city_title_en || '',
	region_id: icnRow.region_id || null,
	region_name: icnRow.region || null,
	lat: icnRow.airport_latitude,
	lon: icnRow.airport_longitude,
	tz: icnRow.airport_timezone || '',
	updated_dt: sqlNow(),
	alternatives: (icnRow.alternatives || [])
		.map(a => a.code_en).join(','),
});

exports.updateFromService = async () => {
	const infocenter = await IqClients.getInfocenter();
	const serviceResult = await infocenter.getAirports({folder: 'arc'});

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
		.then(rows => array_combine(
			rows.map(r => r.region_id),
			rows.map(r => r.region_name),
		));
};

exports.getCountryNames = () => {
	const sql = 'SELECT DISTINCT country_code, country_name FROM airports';
	return Db.with(db => db.query(sql))
		.then(rows => array_combine(
			rows.map(r => r.country_code),
			rows.map(r => r.country_name),
		));
};

exports.getAllLocations = async () => {
	const rows = await Db.fetchAll({table: TABLE});

	const typeToValueToName = {};
	for (const row of Object.values(rows)) {
		_.set(typeToValueToName, ['airport', row.iata_code], row.name);
		_.set(typeToValueToName, ['city', row.city_code], row.city_name);
		_.set(typeToValueToName, ['country', row.country_code], row.country_name);
		_.set(typeToValueToName, ['region', row.region_id], row.region_name);
	}

	const records = [];
	for (const [type, valueToName] of Object.entries(typeToValueToName)) {
		for (const [value, name] of Object.entries(valueToName)) {
			if (value) {
				records.push({type, value, name});
			}
		}
	}

	return records;
};
