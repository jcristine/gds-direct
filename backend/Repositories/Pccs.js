const iqJson = require("../Utils/TmpLib").iqJson;
const {getConfig} = require('../Config.js');

const Db = require('../Utils/Db.js');
const php = require('../Transpiled/phpDeprecated.js');
const sqlNow = require("../Utils/TmpLib").sqlNow;
const Conflict = require("klesun-node-tools/src/Rej").Conflict;
const NotFound = require("klesun-node-tools/src/Rej").NotFound;

const TABLE = 'pccs';

const normalizeRow = ($pcc) => {
	return {
		'gds': php.strtolower($pcc['gds']),
		'pcc': $pcc['pcc'],
		'consolidator': $pcc['consolidator'],
		'pcc_type': $pcc['pcc_type'],
		'arc_type': $pcc['arc_type'],
		'content_type': $pcc['content_type'],
		'description': $pcc['pcc_name'],
		'arc_nr': $pcc['arc_nr'],
		'dk_number': $pcc['dk_number'],
		'point_of_sale_country': $pcc['point_of_sale_country'],
		'point_of_sale_city': $pcc['point_of_sale_city'],
		'default_currency': null, // RBS took it from 'getConsolidatorAll'
		'ticket_mask_pcc': $pcc['ticket_mask_pcc'],
		'updated_dt': sqlNow(),
	};
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
		serviceName: 'rbs',
	});

	const rows = Object
		.values(serviceResult.result.content)
		.map($pcc => normalizeRow($pcc));

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
	/** @var row = normalizeRow() */
	const params = exports.findByCodeParams(gds, pcc);
	const row = await Db.with(db => db.fetchOne(params));
	return row;
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
		return Conflict('Ambiguous PCC ' + pcc + ' belongs multiple GDS-es: ' + [...gdses].join(', '));
	}
};

exports.getAll = async () => {
	const rows = await Db.with(db => db.fetchAll({
		table: TABLE,
	}));
	return rows.map(r => {
		/** @var typed = normalizeRow() */
		const typed = r;
		return typed;
	});
};