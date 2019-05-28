
let Db = require("../Utils/Db.js");
let Redis = require('../LibWrappers/Redis.js');
let MultiLevelMap = require('../Utils/MultiLevelMap.js');
let {admins} = require('../Constants.js');
let {Forbidden} = require('klesun-node-tools/src/Utils/Rej.js');

const TABLE = 'highlightRules';
const TABLE_CMD = 'highlightCmdPatterns';
const TABLE_OUTPUT = 'highlightOutputPatterns';

let fetchFromDb = () => Db.with((db) => Promise.all([
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
let toCamelCase = ($value) => {
	return $value.replace(/[^a-z0-9]+/gi, ' ')
		.trim().split(' ')
		.map(word => word.slice(0, 1).toUpperCase() + word.slice(1))
		.join('');
};

/** @return {IFullHighlightData} */
let getFullDataForAdminPage = () => fetchFromDb().then(({
	highlightRules,
	highlightOutputPatterns,
	highlightCmdPatterns,
}) => {
	let ruleToGdsToCmdRow = MultiLevelMap();
	for (let cmdRow of highlightCmdPatterns) {
		ruleToGdsToCmdRow.set([cmdRow.ruleId, cmdRow.dialect], cmdRow);
	}
	let ruleToGdsToOutRow = MultiLevelMap();
	for (let cmdRow of highlightOutputPatterns) {
		ruleToGdsToOutRow.set([cmdRow.ruleId, cmdRow.gds], cmdRow);
	}
	let aaData = highlightRules.map(rule => {
		rule.decoration = JSON.parse(rule.decoration);
		rule.languages = ruleToGdsToCmdRow.root[rule.id] || {};
		rule.gds = ruleToGdsToOutRow.root[rule.id] || {};
		return rule;
	});
	return {aaData: aaData};
});

// TODO: merge with getFullDataForAdminPage() somehow if possible
let fetchFullDataForService = async () => {
	let record = await fetchFromDb();
	let mapping = {};
	for (let rule of record.highlightRules) {
		mapping[rule.id] = rule;
	}
	for (let cmdPattern of record.highlightCmdPatterns) {
		if (mapping[cmdPattern.ruleId]) {
			mapping[cmdPattern.ruleId].cmdPatterns = mapping[cmdPattern.ruleId].cmdPatterns || [];
			mapping[cmdPattern.ruleId].cmdPatterns.push(cmdPattern);
		}
	}
	for (let pattern of record.highlightOutputPatterns) {
		if (mapping[pattern.ruleId]) {
			mapping[pattern.ruleId].patterns = mapping[pattern.ruleId].patterns || [];
			mapping[pattern.ruleId].patterns.push(pattern);
		}
	}
	return mapping;
};

let lastUpdateMs = null;
let whenRuleMapping = null;

let didCacheExpire = async (lastUpdateMs) => {
	if (!lastUpdateMs) {
		return true;
	} else if (Date.now() - lastUpdateMs < 10 * 1000) {
		// ping Redis not more often than once in 10 seconds
		// actually could make this timeout much greater, like 10 minutes,
		// if all requests worked via web-sockets: setting just 10 seconds
		// because user would want to see changes ~instantly while editing
		return false;
	} else {
		let redis = await Redis.getClient();
		let key = Redis.keys.HIGHLIGHT_RULES_UPDATE_MS;
		let updateMs = await redis.get(key).catch(exc => null);
		return updateMs && lastUpdateMs < updateMs;
	}
};

let invalidateCache = async () => {
	let key = Redis.keys.HIGHLIGHT_RULES_UPDATE_MS;
	let redis = await Redis.getClient();
	lastUpdateMs = null;
	return redis.set(key, Date.now());
};

/**
 * @param {ISaveHighlightRuleParams} rqBody
 * @param {IEmcResult} emcResult
 */
let saveRule = (rqBody, emcResult) => Db.with(db => {
	if (!admins.includes(+emcResult.user.id)) {
		return Forbidden('You (' + emcResult.user.displayName + ') are not listed as an admin of this project, so you can not change rules');
	}
	let decoration = [];
	for (let [key, value] of Object.entries(rqBody.decorationFlags || {})) {
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
		priority: rqBody.priority,
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
		let ruleId = rqBody.id || inserted.insertId;
		let promises = [];
		for (let gds in rqBody.languages) {
			let rec = rqBody.languages[gds];
			promises.push(db.writeRows(TABLE_CMD, [{
				ruleId: ruleId,
				dialect: gds,
				cmdPattern: rec.cmdPattern,
				onClickCommand: rec.onClickCommand,
			}]));
		}
		for (let gds in rqBody.gds) {
			let rec = rqBody.gds[gds];
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

exports.getFullDataForAdminPage = getFullDataForAdminPage;
exports.saveRule = saveRule;
exports.getFullDataForService = async () => {
	if (await didCacheExpire(lastUpdateMs)) {
		whenRuleMapping = fetchFullDataForService();
		lastUpdateMs = Date.now();
	}
	return whenRuleMapping;
};