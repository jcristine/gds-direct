const {parseXml} = require('../../GdsHelpers/CommonUtils.js');
const js2xml = require('xml');
const _ = require('lodash');

// lodash range is [min, max)
const generateParagraphs = paragraphs => paragraphs || _.range(0, 32)

module.exports.buildFareRuleXml = params => {
	const paragraphs = generateParagraphs(params.paragraphs);

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

module.exports.parseFareRuleXmlResponse = (response, params) => {
	const dom = parseXml(response);
	const result = {
		// same command that would have been executed from terminal
		cmd: `FN${params.fareComponentNumber}/${generateParagraphs(params.paragraphs).join('/')}`,
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