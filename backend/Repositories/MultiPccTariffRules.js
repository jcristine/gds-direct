const php = require('../../tests/backend/Transpiled/php.js');
const Db = require('../Utils/Db.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const {sqlNow} = require('klesun-node-tools/src/Utils/Misc.js');

const TABLE = 'multi_pcc_tariff_rules';

const normalizeRule = (rule, forClient) => {
	// remove empty condition keys to make field more readable in db cli
	const normDict = !forClient
		? (dict) => php.array_filter(dict)
		: (dict) => dict;

	return normDict({
		departure_items: (rule.departure_items || []).map((item) => {
			return normDict({
				type: php.strval(item.type),
				value: php.strval(item.value),
			});
		}),
		destination_items: (rule.destination_items || []).map((item) => {
			return normDict({
				type: php.strval(item.type),
				value: php.strval(item.value),
			});
		}),
		reprice_pcc_records: (rule.reprice_pcc_records || []).map((item) => {
			return normDict({
				gds: php.strval(item.gds),
				pcc: php.strval(item.pcc),
				ptc: php.strval(item.ptc || ''),
				account_code: php.strval(item.account_code || ''),
				fare_type: php.strval(item.fare_type || ''),
			});
		}),
	});
};

const unserializeRule = (serialized) => {
	const rule = serialized
		? JSON.parse(serialized)
		: {};
	return normalizeRule(rule, true);
};

const serializeRule = (rule) => {
	const normalized = normalizeRule(rule, false);
	return JSON.stringify(normalized);
};

exports.getAll = async () => {
	const rows = await Db.fetchAll({table: TABLE});
	return rows.map(row => {
		const data = unserializeRule(row.data);
		data.id = row.id;
		return data;
	});
};

exports.saveRule = async (rqBody) => {
	const id = rqBody.id;
	const written = await Db.with(db => db.writeRows(TABLE, [{
		...(id ? {id} : {}),
		updated_dt: sqlNow(),
		data: serializeRule(rqBody),
	}]));
	return {
		success: true,
		id: id || written.insertId,
	};
};

exports.deleteRule = async ({id}) => {
	if (id) {
		return Db.with(db => db.delete({
			table: TABLE,
			where: [['id', '=', id]],
		})).then(sqlResult => ({success: true}));
	} else {
		return Rej.BadRequest('Parameter id is mandatory');
	}
};