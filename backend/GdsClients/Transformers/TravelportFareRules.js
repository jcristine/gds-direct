const {parseXml} = require('../../GdsHelpers/CommonUtils.js');
const js2xml = require('xml');
const _ = require('lodash');

module.exports.buildFareRuleXml = params => {
	// lodash range is [min, max)
	const paragraphs = params.paragraphs || _.range(0, 32);

	return js2xml([{
		FareDisplayMods: [{
			QueryHeader: [
				{Action: '035'}, // the fare rules
				{RetCRTOutput: 'Y'}, // returns as terminal text
			],
		}, {
			RulesDisplay: [
				{FullTextInd: 'Y'},
				{RuleParagraphNums: paragraphs.join('.')},
			],
		}, {
			FollowUpEntries: [
				{QuoteNum: params.fareComponentNumber},
			],
		},
		],
	}]);
};

module.exports.parseFareRuleXmlResponse = response => {
	const dom = parseXml(response);
	const result = {
		errors: null,
		dump: null,
	};

	const elements = dom.querySelectorAll('FareInfo > OutputMsg');

	if(!elements || elements.length === 0) {
		result.errors = ['Service returned error response', response];
	} else {
		result.dump = _.map(elements, msgElement =>
			_.map(msgElement.querySelectorAll('Text'), t => t.textContent).join('')
		).join('');
	}

	return result;
};