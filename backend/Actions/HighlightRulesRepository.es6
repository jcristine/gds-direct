
let Db = require("../Utils/Db.es6");
let MultiLevelMap = require('../Utils/MultiLevelMap.es6');

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