
let {getConfig} = require('../Config.js');
let Db = require('../Utils/Db.js');
const iqJson = require("../Utils/Misc").iqJson;

let TABLE = 'airline_booking_classes';

let normalizeRow = (airline, bookingClass, cabinClass) => {
	return {
		airline: airline,
		booking_class: bookingClass,
		cabin_class: cabinClass,
	};
};

exports.updateFromService = async () => {
	let config = await getConfig();
	/** @type {IGetAirlineBookingClassesRs} */
	let serviceResult = await iqJson({
		url: config.external_service.act.host,
		credentials: {
			login: config.external_service.act.login,
			passwd: config.external_service.act.password,
		},
		functionName: 'getAirlineBookingClasses',
		serviceName: 'cms',
	});

	let rows = [];
	for (let [airline, cabinClasses] of Object.entries(serviceResult.result.content)) {
		for (let [cabinClass, bookingClasses] of Object.entries(cabinClasses)) {
			for (let [bookingClass, exists] of Object.entries(bookingClasses)) {
				let row = normalizeRow(airline, bookingClass, cabinClass);
				rows.push();
			}
		}
	}
	if (rows.length === 0) {
		return Promise.reject('Unexpected ACT response format - ' + JSON.stringify(serviceResult));
	}

	let written = await Db.with(db => db.writeRows(TABLE, rows));
	return {
		message: 'written ' + rows.length + ' rows to db',
		sqlResult: written,
	};
};

exports.find = async ({airline, bookingClass}) => {
	/** @var row = normalizeRow() */
	let row = await Db.with(db => db.fetchOne({
		table: TABLE,
		where: [
			['airline', '=', airline],
			['booking_class', '=', bookingClass],
		],
	}));
	return row;
};