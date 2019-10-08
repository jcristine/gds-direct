const iqJson = require("dyn-utils/src/DynUtils.js").iqJson;
const {getConfig} = require('../Config.js');

const Db = require('../Utils/Db.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const {sqlNow} = require('klesun-node-tools/src/Utils/Misc.js');
const Conflict = require("klesun-node-tools/src/Rej").Conflict;
const NotFound = require("klesun-node-tools/src/Rej").NotFound;

const TABLE = 'pccs';

const normalizeCustomData = pcc => ({
	can_book_pnr: pcc.can_book_pnr,
	can_price_pnr: pcc.can_price_pnr,
	can_store_fare: pcc.can_store_fare,
});

const normalizeForDb = (pcc) => {
	return {
		gds: php.strtolower(pcc.gds),
		pcc: pcc.pcc,
		consolidator: pcc.consolidator,
		pcc_type: pcc.pcc_type,
		arc_type: pcc.arc_type,
		content_type: pcc.content_type,
		description: pcc.pcc_name,
		arc_nr: pcc.arc_nr,
		dk_number: pcc.dk_number,
		point_of_sale_country: pcc.point_of_sale_country,
		point_of_sale_city: pcc.point_of_sale_city,
		// there are two fields: 'currency' in getPCCsAll and one in 'getConsolidatorAll'
		// currency of PCC is > currency of consolidator, but the former may be not set
		default_currency: null, // RBS took it from 'getConsolidatorAll'
		ticket_mask_pcc: pcc.ticket_mask_pcc,
		updated_dt: sqlNow(),
		data_json: JSON.stringify(normalizeCustomData(pcc)),
	};
};

/** @param row = normalizeForDb() */
const normalizeFromDb = (row) => {
	/** @var data = normalizeCustomData() */
	const data = row.data_json ? JSON.parse(row.data_json) : {};
	row.data = data;
	return row;
};

exports.updateFromService = async () => {
	const config = await getConfig();
	/** @type {IGetPccsAllRs} */
	const serviceResult = await iqJson({
		url: config.external_service.act.host,
		credentials: {
			login: config.external_service.act.login,
			passwd: config.external_service.act.password,
		},
		functionName: 'getPCCsAll',
		serviceName: config.external_service.act.serviceName,
	});

	const rows = Object
		.values(serviceResult.result.content)
		.map($pcc => normalizeForDb($pcc));

	const written = await Db.with(db => db.writeRows(TABLE, rows));
	return {
		message: 'written ' + rows.length + ' rows to db',
		sqlResult: written,
	};
};

exports.findByCodeParams = (gds, pcc) => ({
	table: TABLE,
	where: [
		['gds', '=', gds],
		['pcc', '=', pcc],
	],
});

exports.findByCode = async (gds, pcc) => {
	/** @var row = normalizeForDb() */
	const params = exports.findByCodeParams(gds, pcc);
	return Db.with(db => db.fetchOne(params)).then(normalizeFromDb);
};

exports.getGdsByPcc = async (pcc) => {
	const rows = await Db.with(db => db.fetchAll({
		table: TABLE,
		where: [['pcc', '=', pcc]],
	}));
	const gdses = new Set(rows.map(r => r.gds));
	if (gdses.size === 0) {
		return NotFound('No such PCC in DB - ' + pcc);
	} else if (gdses.size === 1) {
		return [...gdses][0];
	} else {
		return Conflict('Ambiguous PCC ' + pcc + ' belongs to multiple GDS-es: ' + [...gdses].join(', '));
	}
};

exports.getAll = async () => {
	const rows = await Db.with(db => db.fetchAll({
		table: TABLE,
	}));
	return rows.map(normalizeFromDb);
};
