
const Db = require("../Utils/Db.js");
const Redis = require('../LibWrappers/Redis.js');
const MultiLevelMap = require('../Utils/MultiLevelMap.js');
const Rej = require('klesun-node-tools/src/Lang.js');
const _ = require('lodash');;

const TABLE = 'highlightRules';
const TABLE_CMD = 'highlightCmdPatterns';
const TABLE_OUTPUT = 'highlightOutputPatterns';

const fetchFromDb = () => Db.with((db) => Promise.all([
	db.fetchAll({table: TABLE}),
	db.fetchAll({table: TABLE_CMD}),
	db.fetchAll({table: TABLE_OUTPUT}),
]).then(/**
 * @param {IHighlightRules[]}         highlightRules
 * @param {highlightCmdPatterns[]}    highlightCmdPatterns
 * @param {highlightOutputPatterns[]} highlightOutputPatterns
*/ ([
	highlightRules,
	highlightCmdPatterns,
	highlightOutputPatterns,
]) => ({
	highlightRules,
	highlightCmdPatterns,
	highlightOutputPatterns,
})));

/**
 * Convert string to camelCase and remove non alphabetical symbols
 * @param string $value
 * @return string
 */
const toCamelCase = ($value) => {
	return $value.replace(/[^a-z0-9]+/gi, ' ')
		.trim().split(' ')
		.map(word => word.slice(0, 1).toUpperCase() + word.slice(1))
		.join('');
};

/** @return {IFullHighlightData} */
const getFullDataForAdminPage = () => fetchFromDb().then(async ({
	highlightRules,
	highlightOutputPatterns,
	highlightCmdPatterns,
}) => {
	const dumpRows = await Db.fetchAll({table: 'highlight_sample_dumps'});
	const outIdToDumps = _.groupBy(dumpRows, row => row.outputPatternId);

	const ruleToGdsToCmdRow = MultiLevelMap();
	for (const cmdRow of highlightCmdPatterns) {
		ruleToGdsToCmdRow.set([cmdRow.ruleId, cmdRow.dialect], cmdRow);
	}
	const ruleToGdsToOutRow = MultiLevelMap();
	for (const outRow of highlightOutputPatterns) {
		outRow.dumpRecs = outIdToDumps[outRow.id] || [];
		ruleToGdsToOutRow.set([outRow.ruleId, outRow.gds], outRow);
	}
	const aaData = highlightRules.map(rule => {
		rule.decoration = JSON.parse(rule.decoration);
		rule.languages = ruleToGdsToCmdRow.root[rule.id] || {};
		rule.gds = ruleToGdsToOutRow.root[rule.id] || {};
		return rule;
	});
	return {aaData: aaData};
});

// TODO: merge with getFullDataForAdminPage() somehow if possible
const fetchFullDataForService = async () => {
	const record = await fetchFromDb();
	const byId = {};
	for (const rule of record.highlightRules) {
		byId[rule.id] = rule;
	}
	for (const cmdPattern of record.highlightCmdPatterns) {
		if (byId[cmdPattern.ruleId]) {
			byId[cmdPattern.ruleId].cmdPatterns = byId[cmdPattern.ruleId].cmdPatterns || [];
			byId[cmdPattern.ruleId].cmdPatterns.push(cmdPattern);
		}
	}
	for (const pattern of record.highlightOutputPatterns) {
		if (byId[pattern.ruleId]) {
			byId[pattern.ruleId].patterns = byId[pattern.ruleId].patterns || [];
			byId[pattern.ruleId].patterns.push(pattern);
		}
	}
	const byName = {};
	for (const rule of Object.values(byId)) {
		byName[rule.name] = rule;
	}
	return {byId, byName};
};

/** RAM caching */
let lastUpdateMs = null;
let whenRuleMapping = null;

const didCacheExpire = async (lastUpdateMs) => {
	if (!lastUpdateMs) {
		return true;
	} else if (Date.now() - lastUpdateMs < 10 * 1000) {
		// ping Redis not more often than once in 10 seconds
		// actually could make this timeout much greater, like 10 minutes,
		// if all requests worked via web-sockets: setting just 10 seconds
		// because user would want to see changes ~instantly while editing
		return false;
	} else {
		const redis = await Redis.getClient();
		const key = Redis.keys.HIGHLIGHT_RULES_UPDATE_MS;
		const updateMs = await redis.get(key).catch(exc => null);
		return updateMs && lastUpdateMs < updateMs;
	}
};

const invalidateCache = async () => {
	const key = Redis.keys.HIGHLIGHT_RULES_UPDATE_MS;
	const redis = await Redis.getClient();
	lastUpdateMs = null;
	return redis.set(key, Date.now());
};

/**
 * @param {ISaveHighlightRuleParams} rqBody
 * @param {IEmcResult} emcResult
 */
const saveRule = (rqBody, emcResult, routeParams, request) => Db.with(db => {
	// datatables legacy
	if (rqBody.removeData == 1) {
		// TODO: delete orphaned records in other tables as well
		return db.delete({
			table: TABLE,
			where: [['id', '=', rqBody.id]],
		}).then(sqlRs => ({
			message: 'Deleted successfully ' +
				sqlRs.affectedRows + ' rows',
		}));
	}

	const decoration = [];
	for (const [key, value] of Object.entries(rqBody.decorationFlags || {})) {
		if (+value) {
			decoration.push(key);
		}
	}
	return db.writeRows(TABLE, [{
		id: rqBody.id || undefined,
		highlightGroup: rqBody.highlightGroup,
		color: rqBody.color,
		backgroundColor: rqBody.backgroundColor,
		highlightType: rqBody.highlightType,
		priority: rqBody.priority || 0,
		// not sure we actually need this field...
		name: toCamelCase(rqBody.label),
		label: rqBody.label,
		message: rqBody.message,
		// flags are passed only when you set them
		isMessageOnClick: +rqBody.isMessageOnClick ? true : false,
		isOnlyFirstFound: +rqBody.isOnlyFirstFound ? true : false,
		isEnabled: +rqBody.isEnabled ? true : false,
		isForTestersOnly: +rqBody.isForTestersOnly ? true : false,
		isInSameWindow: +rqBody.isInSameWindow ? true : false,
		decoration: JSON.stringify(decoration),
	}]).then(inserted => {
		const ruleId = rqBody.id || inserted.insertId;
		const promises = [];
		for (const gds in rqBody.languages) {
			const rec = rqBody.languages[gds];
			promises.push(db.writeRows(TABLE_CMD, [{
				ruleId: ruleId,
				dialect: gds,
				cmdPattern: rec.cmdPattern,
				onClickCommand: rec.onClickCommand,
			}]));
		}
		for (const gds in rqBody.gds) {
			const rec = rqBody.gds[gds];
			promises.push(db.writeRows(TABLE_OUTPUT, [{
				ruleId: ruleId,
				gds: gds,
				pattern: rec.pattern,
			}]));
		}
		return Promise.all(promises);
	}).then(results => {
		invalidateCache();
		return ({
			message: 'Written to DB successfully with ' + results.length + ' sub-queries',
		});
	});
});

const saveSampleDump = ({
	outputPatternId, dump,
	id = null, comment = '',
}) => Db.with(db => db.writeRows('highlight_sample_dumps', [{
	outputPatternId, dump,
	...(id ? {id} : {}),
	comment: comment,
}])).then(sqlResult => ({
	id: id || sqlResult.insertId,
}));

exports.getFullDataForAdminPage = getFullDataForAdminPage;
exports.saveRule = saveRule;
exports.saveSampleDump = saveSampleDump;

const getFullDataForServiceMulti = async () => {
	if (await didCacheExpire(lastUpdateMs)) {
		whenRuleMapping = fetchFullDataForService();
		lastUpdateMs = Date.now();
	}
	return whenRuleMapping;
};

exports.getFullDataForService = () => getFullDataForServiceMulti().then(({byId}) => byId);
exports.getByName = async (ruleName) => {
	return getFullDataForServiceMulti()
		.then(({byName}) => byName[ruleName])
		.then(Rej.nonEmpty('No such rule - ' + ruleName));
};