
const {getConfig} = require('../Config.js');
const Db = require('../Utils/Db.js');
const BadGateway = require("klesun-node-tools/src/Rej").BadGateway;
const iqJson = require("dyn-utils/src/DynUtils.js").iqJson;

const TABLE = 'airline_booking_classes';

const normalizeRow = (airline, bookingClass, cabinClass) => {
	return {
		airline: airline,
		booking_class: bookingClass,
		cabin_class: cabinClass,
	};
};

exports.updateFromService = async () => {
	const config = await getConfig();
	/** @type {IGetAirlineBookingClassesRs} */
	const serviceResult = await iqJson({
		url: config.external_service.act.host,
		credentials: {
			login: config.external_service.act.login,
			passwd: config.external_service.act.password,
		},
		functionName: 'getAirlineBookingClasses',
		serviceName: config.external_service.act.serviceName,
	});

	const rows = [];
	for (const [airline, cabinClasses] of Object.entries(serviceResult.result.content)) {
		for (const [cabinClass, bookingClasses] of Object.entries(cabinClasses)) {
			for (const [bookingClass, exists] of Object.entries(bookingClasses)) {
				const row = normalizeRow(airline, bookingClass, cabinClass);
				rows.push(row);
			}
		}
	}
	if (rows.length === 0) {
		return BadGateway('Unexpected ACT response format - ' + JSON.stringify(serviceResult));
	}

	const written = await Db.with(db => db.writeRows(TABLE, rows));
	return {
		message: 'written ' + rows.length + ' rows to db',
		sqlResult: written,
	};
};

exports.find = async ({airline, bookingClass}) => {
	/** @var row = normalizeRow() */
	const row = await Db.with(db => db.fetchOne({
		table: TABLE,
		where: [
			['airline', '=', airline],
			['booking_class', '=', bookingClass],
		],
	}));
	return row;
};