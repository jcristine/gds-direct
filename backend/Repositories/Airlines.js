
const {getConfig} = require('../Config.js');
const Db = require('../Utils/Db.js');
const sqlNow = require("../Utils/TmpLib").sqlNow;
const {iqJson} = require("dyn-utils/src/DynUtils.js");

const TABLE = 'airlines';

const normalizeRow = ($row) => {
	return {
		iata_code: $row['code_en'],
		name: $row['name_en'],
		hub: $row['code_hub'],
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