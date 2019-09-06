const IqClients = require('../LibWrappers/IqClients.js');

const Db = require('../Utils/Db.js');
const BadGateway = require("klesun-node-tools/src/Rej").BadGateway;

const TABLE = 'airline_booking_classes';

const normalizeRow = (airline, clsRec) => {
	return {
		airline: airline,
		booking_class: clsRec.bookingClass,
		cabin_class: clsRec.primaryCabinClass,
	};
};

exports.updateFromService = async () => {
	const infocenter = await IqClients.getInfocenter();
	const serviceResult = await infocenter.getAllAirlineList();

	const rows = [];
	for (const airRec of Object.values(serviceResult.result.data)) {
		const airline = airRec.code_en;
		for (const clsRec of Object.values(airRec.bookingClasses)) {
			const row = normalizeRow(airline, clsRec);
			rows.push(row);
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