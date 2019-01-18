
let Db = require("../Utils/Db.es6");
let MultiLevelMap = require('../Utils/MultiLevelMap.es6');
let {admins} = require('./../Constants.es6');
let {Forbidden} = require('./../Utils/Rej.es6');

let fetchFromDb = () => Db.with((db) => Promise.all([
	db.fetchAll({table: 'highlightRules'}),
	db.fetchAll({table: 'highlightCmdPatterns'}),
	db.fetchAll({table: 'highlightOutputPatterns'}),
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
exports.getFullDataForAdminPage = () => fetchFromDb().then(({
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

/** @param {ISaveHighlightRuleParams} rqBody
 * @param {IEmcResult} emcResult */
exports.saveRule = (rqBody, emcResult) => Db.with(db => {
	if (!admins.includes(+emcResult.user.id)) {
		return Forbidden('You (' + emcResult.user.displayName + ') are not listed as an admin of this project, so you can not change rules');
	}
	let decoration = [];
	for (let [key, value] of Object.entries(rqBody.decorationFlags || {})) {
		if (+value) {
			decoration.push(key);
		}
	}
	return db.writeRows('highlightRules', [{
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
			promises.push(db.writeRows('highlightCmdPatterns', [{
				ruleId: ruleId,
				dialect: gds,
				cmdPattern: rec.cmdPattern,
				onClickCommand: rec.onClickCommand,
			}]));
		}
		for (let gds in rqBody.gds) {
			let rec = rqBody.gds[gds];
			promises.push(db.writeRows('highlightOutputPatterns', [{
				ruleId: ruleId,
				gds: gds,
				pattern: rec.pattern,
			}]));
		}
		return Promise.all(promises);
	}).then(results => ({
		message: 'Written to DB successfully with ' + results.length + ' sub-queries',
	}));
});