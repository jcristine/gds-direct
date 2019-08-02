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
		cmd: 'SOAP>FARE_RULES', // dummy value to ensure that import pq action is satisfied
		error: null,
		output: '',
	};

	const elements = dom.querySelectorAll('FareInfo > OutputMsg');

	if(!elements || elements.length === 0) {
		result.error = 'Service returned error response - ' + response;
	} else {
		result.output = _.map(elements, msgElement =>
			_.map(msgElement.querySelectorAll('Text'), t => t.textContent).join('')
		).join('\n');
	}

	return result;
};