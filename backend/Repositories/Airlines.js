
let {getConfig} = require('../Config.js');
let Db = require('../Utils/Db.js');
const iqJson = require("../Utils/Misc").iqJson;

let TABLE = 'airlines';

let normalizeRow = ($row) => {
	return {
		iata_code: $row['code_en'],
		name: $row['name_en'],
		hub: $row['code_hub'],
		updated_dt: new Date().toISOString(),
	};
};

exports.updateFromService = async () => {
	let config = await getConfig();
	/** @type {IGetAirlinesRs} */
	let serviceResult = await iqJson({
		url: config.external_service.infocenter.host,
		credentials: {
			login: config.external_service.infocenter.login,
			passwd: config.external_service.infocenter.password,
		},
		functionName: 'getAllAirlines',
		serviceName: 'infocenter',
		params: {}, // service demands it to be set
	});

	let rows = Object
		.values(serviceResult.result.result)
		.map(normalizeRow);

	let written = await Db.with(db => db.writeRows(TABLE, rows));
	return {
		message: 'written ' + rows.length + ' rows to db',
		sqlResult: written,
	};
};

exports.findByCode = async (iataCode) => {
	/** @var row = normalizeRow() */
	let row = Db.with(db => db.fetchOne({
		table: TABLE,
		where: [
			['iata_code', '=', iataCode],
		],
	}));
	return row;
};