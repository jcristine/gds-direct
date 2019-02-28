const iqJson = require("../Utils/Misc").iqJson;
const {getConfig} = require('../Config.js');

let Db = require('../Utils/Db.js');
let php = require('../Transpiled/php.js');

const TABLE = 'pccs';

let normalizePccRow = ($pcc) => {
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
		'updated_dt': new Date().toISOString(),
	};
};

exports.updateFromService = async () => {
	let config = await getConfig();
	/** @type {IGetPccsAllRs} */
	let serviceResult = await iqJson({
		url: config.external_service.act.host,
		credentials: {
			login: config.external_service.act.login,
			passwd: config.external_service.act.password,
		},
		functionName: 'getPCCsAll',
		serviceName: 'cms',
	});

	let rows = Object
		.values(serviceResult.result.content)
		.map($pcc => normalizePccRow($pcc));

	let written = await Db.with(db => db.writeRows(TABLE, rows));
	return {
		message: 'written ' + rows.length + ' rows to db',
		sqlResult: written,
	};
};

exports.findByCode = async (gds, pcc) => {
	return Db.with(db => db.fetchOne({
		table: TABLE,
		where: [
			['gds', '=', gds],
			['pcc', '=', pcc],
		],
	}));
};