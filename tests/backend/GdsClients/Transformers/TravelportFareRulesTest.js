const TravelportFareRules = require('../../../../backend/GdsClients/Transformers/TravelportFareRules');

const provide_buildXml = () => {
	const list = [];

	list.push({
		title: 'Build specified paragraphs',
		input: {
			paragraphs: [1, 2, 3],
			fareComponentNumber: 13,
		},
		output: [
			'<FareDisplayMods>',
				'<QueryHeader>',
					'<Action>035</Action>',
					'<RetCRTOutput>Y</RetCRTOutput>',
				'</QueryHeader>',
				'<RulesDisplay>',
					'<FullTextInd>Y</FullTextInd>',
					'<RuleParagraphNums>1.2.3</RuleParagraphNums>',
				'</RulesDisplay>',
				'<FollowUpEntries>',
					'<QuoteNum>13</QuoteNum>',
				'</FollowUpEntries>',
			'</FareDisplayMods>',
		].join(''),
	});

	list.push({
		title: 'Build all paragraphs in no paragraphs were specified',
		input: {
			fareComponentNumber: 13,
		},
		output: [
			'<FareDisplayMods>',
				'<QueryHeader>',
					'<Action>035</Action>',
					'<RetCRTOutput>Y</RetCRTOutput>',
				'</QueryHeader>',
				'<RulesDisplay>',
					'<FullTextInd>Y</FullTextInd>',
					'<RuleParagraphNums>0.1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20.21.22.23.24.25.26.27.28.29.30.31</RuleParagraphNums>',
				'</RulesDisplay>',
				'<FollowUpEntries>',
					'<QuoteNum>13</QuoteNum>',
				'</FollowUpEntries>',
			'</FareDisplayMods>',
		].join(''),
	});

	return list.map(a => [a]);
};

const provide_parseXml = () => {
	const list = [];

	list.push({
		title: 'Build correct result object from soap response',
		input: {
			xml: '<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soapenv:Body><SubmitXmlOnSessionResponse xmlns="http://webservices.galileo.com"><SubmitXmlOnSessionResult><FareQuoteMultiDisplay_23 xmlns=""><FareInfo><OutputMsg><Text><![CDATA[Something ]]></Text><Text><![CDATA[Something2 ]]></Text></OutputMsg><OutputMsg><Text><![CDATA[Something3]]></Text></OutputMsg><RespHeader><UniqueKey>0000</UniqueKey><CRTOutput>Y</CRTOutput><ErrMsg>N</ErrMsg><AgntAlert>N</AgntAlert><SmartParsedData>N</SmartParsedData><NextGenInd>Y</NextGenInd><Spares1>NNN</Spares1><FQSOnlyItin>N</FQSOnlyItin><HostUse14>N</HostUse14><IFQLastF0>N</IFQLastF0><IFQLastFQ>N</IFQLastFQ><IFQLastD>N</IFQLastD><IFQLastB>N</IFQLastB><IFQLastV>N</IFQLastV><HostUse20>N</HostUse20><AppInd1>N</AppInd1><AppInd2>N</AppInd2><AppInd3>N</AppInd3><AppInd4>N</AppInd4><AppInd5>N</AppInd5><AppInd6>N</AppInd6><AppInd7>N</AppInd7><AppInd8>N</AppInd8><AppInd9>N</AppInd9><AppInd10>N</AppInd10><AppInd11>N</AppInd11><AppInd12>N</AppInd12><AppInd13>N</AppInd13><AppInd14>N</AppInd14><AppInd15>N</AppInd15><AppInd16>N</AppInd16></RespHeader></FareInfo></FareQuoteMultiDisplay_23></SubmitXmlOnSessionResult></SubmitXmlOnSessionResponse></soapenv:Body></soapenv:Envelope>',
			params: {
				paragraphs: [1, 2, 3],
				fareComponentNumber: 13,
			},
		},
		output: {
			cmd: 'FN13/1/2/3',
			error: null,
			output: 'Something Something2 \nSomething3',
		},
	});

	list.push({
		title: 'Build correct result object from soap response with errors',
		input: {
			xml: '<SubmitXmlOnSessionResult><FareQuoteMultiDisplay_23 xmlns=""></FareQuoteMultiDisplay_23></SubmitXmlOnSessionResult>',
			params: {
				fareComponentNumber: 13,
			},
		},
		output: {
			cmd: 'FN13/0/1/2/3/4/5/6/7/8/9/10/11/12/13/14/15/16/17/18/19/20/21/22/23/24/25/26/27/28/29/30/31',
			error: 'Service returned error response - <SubmitXmlOnSessionResult><FareQuoteMultiDisplay_23 xmlns=""></FareQuoteMultiDisplay_23></SubmitXmlOnSessionResult>',
			output: '',
		},
	});

	return list.map(a => [a]);
};


class TravelportClientTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js') {
	async test_buildXml({input, output}) {
		this.assertSame(output, TravelportFareRules.buildFareRuleXml(input));
	}

	async test_parseXml({input, output}) {
		const result = TravelportFareRules.parseFareRuleXmlResponse(input.xml, input.params);
		this.assertArrayElementsSubset(output, result);
	}

	getTestMapping() {
		return [
			[provide_buildXml, this.test_buildXml],
			[provide_parseXml, this.test_parseXml],
		];
	}
}

module.exports = TravelportClientTest;
