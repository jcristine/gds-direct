
let PersistentHttpRq = require('../Utils/PersistentHttpRq.js');
let {getConfig} = require('../Config.js');
let querystring = require('querystring');
let Db = require('../Utils/Db.js');
let {strval, implode, array_column} = require('../Transpiled/php.js');

let TABLE = 'airports';

let normalizeAirportRow = ($row) => ({
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
	updated_dt: new Date().toISOString(),
	alternatives: implode(',', array_column($row['alternatives'] || [], 'code_en')),
});

exports.updateFromService = async () => {
	let config = await getConfig();
	/** @type IGetAirportsRs */
	let serviceResult = await PersistentHttpRq({
		url: config.external_service.infocenter.host,
		body: querystring.stringify({
			credentials: JSON.stringify({
				login: config.external_service.infocenter.login,
				passwd: config.external_service.infocenter.password,
			}),
			functionName: 'getAirports',
			serviceName: 'infocenter',
			params: JSON.stringify({folder: 'arc'})
		}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	}).then(rs => JSON.parse(rs.body));

	let rows = Object
		.values(serviceResult.result.data)
		.map(normalizeAirportRow);

	let written = await Db.with(db => db.writeRows(TABLE, rows));
	return {
		message: 'written ' + rows.length + ' rows to db',
		sqlResult: written,
	};
};