
const {getConfig} = require('../Config.js');
const Db = require('../Utils/Db.js');
const sqlNow = require("../Utils/TmpLib").sqlNow;
const {iqJson} = require("dyn-utils/src/DynUtils.js");

const TABLE = 'airlines';

const normalizeRow = (row) => {
	return {
		iata_code: row.code_en,
		name: row.name_en,
		// dunno what it is and why it is 'SEQU' for 'X8' airline
		hub: !row.code_hub ? null : row.code_hub.slice(0, 3),
		updated_dt: sqlNow(),
	};
};

exports.updateFromService = async () => {
	const config = await getConfig();
	/** @type {IGetAirlinesRs} */
	const serviceResult = await iqJson({
		url: config.external_service.infocenter.host,
		credentials: {
			login: config.external_service.infocenter.login,
			passwd: config.external_service.infocenter.password,
		},
		functionName: 'getAllAirlines',
		serviceName: 'infocenter',
		params: {}, // service demands it to be set
	});

	const rows = Object
		.values(serviceResult.result.result)
		// Infocenter has a lot of trash in their airline list...
		.filter(row => row && row.code_en && (row.code_en + '').match(/^[A-Z0-9]{2}$/))
		.map(normalizeRow);

	const written = await Db.with(db => db.writeRows(TABLE, rows));
	return {
		message: 'written ' + rows.length + ' rows to db',
		sqlResult: written,
	};
};

exports.findByCode = async (iataCode) => {
	/** @var row = normalizeRow() */
	const row = await Db.with(db => db.fetchOne({
		table: TABLE,
		where: [
			['iata_code', '=', iataCode],
		],
	}));
	return row;
};
