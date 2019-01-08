const Db = require("../Utils/Db.es6");

/** @param {IFullCmsHighlightData} fullCmsData */
module.exports = (fullCmsData) => {
	let cmsData = fullCmsData.cmsData;
	let idToGds = new Map(fullCmsData.gdses.aaData.map(l => [l.id, l.name]));
	let idToLang = new Map(fullCmsData.langs.aaData.map(l => [l.id, l.name]));
	let idToGroup = new Map(fullCmsData.groups.aaData.map(l => [l.id, l.name]));
	let idToColor = new Map(fullCmsData.colors.aaData.map(l => [l.id, l.name]));
	let idToType = new Map(fullCmsData.types.aaData.map(l => [l.id, l.name]));
	return Db.with(db => Promise.all([
		db.writeRows('highlightOutputPatterns', cmsData.aaData
			.reduce((sum, next) => sum.concat(Object.values(next.gds)), [])
			.map(terminalHighlightLanguages => ({
				id: terminalHighlightLanguages.id,
				ruleId:terminalHighlightLanguages.terminalHighlightId,
				gds: idToGds.get(terminalHighlightLanguages.gdsId),
				pattern: terminalHighlightLanguages.pattern,
				regexError: terminalHighlightLanguages.regexError,
			}))),
		db.writeRows('highlightRules', cmsData.aaData.map(terminalHighlight => ({
			id: terminalHighlight.id,
			highlightGroup: idToGroup.get(terminalHighlight.highlightGroupId),
			color: idToColor.get(terminalHighlight.terminalColorId),
			backgroundColor: idToColor.get(terminalHighlight.terminalBackgroundColorId),
			highlightType: idToType.get(terminalHighlight.highlightTypeId),
			priority: terminalHighlight.priority,
			name: terminalHighlight.name,
			label: terminalHighlight.label,
			message: terminalHighlight.message,
			isMessageOnClick: terminalHighlight.isMessageOnClick,
			isOnlyFirstFound: terminalHighlight.isOnlyFirstFound,
			isEnabled: terminalHighlight.isEnabled,
			isForTestersOnly: terminalHighlight.isForTestersOnly,
			isInSameWindow: terminalHighlight.isInSameWindow,
			decoration: JSON.stringify([
				terminalHighlight.textDecorationUnderline ? 'underline' : null,
				terminalHighlight.textDecorationDotted ? 'dotted' : null,
				terminalHighlight.textDecorationBold ? 'bold' : null,
				terminalHighlight.textDecorationBordered ? 'bordered' : null,
				terminalHighlight.textDecorationItalic ? 'italic' : null,
				terminalHighlight.textDecorationLarge ? 'large' : null,
			]),
		}))),
		db.writeRows('highlightCmdPatterns', cmsData.aaData
			.reduce((sum, next) => sum.concat(Object.values(next.languages)), [])
			.map(terminalHighlightGds => ({
				id: terminalHighlightGds.id,
				ruleId: terminalHighlightGds.terminalHighlightId,
				dialect: idToLang.get(terminalHighlightGds.terminalInputLanguageId),
				cmdPattern: terminalHighlightGds.gdsCommand,
				onClickCommand: terminalHighlightGds.onClickCommand,
				regexError: terminalHighlightGds.regexError,
			}))),
	])).then((result) => ({message: 'Updated successfully', result: result}));
};





