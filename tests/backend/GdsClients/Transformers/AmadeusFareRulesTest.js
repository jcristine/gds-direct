const AmadeusFareRules = require('../../../../backend/GdsClients/Transformers/AmadeusFareRules');

const provide_buildXml = () => {
	const list = [];

	list.push({
		title: 'Build request xml',
		input: {
			airline: 'CX',
			destination: 'MNL',
			fareBasis: 'QLXSPCL',
			origin: 'JFK',
			ticketingDt: '2019-08-09',
		},
		output: [
			'<ns1:Fare_GetFareRules xmlns:ns1="http://xml.amadeus.com/FARRNQ_10_1_1A">',
			'<ns1:msgType>',
			'	<ns1:messageFunctionDetails>',
			'		<ns1:messageFunction>FRN</ns1:messageFunction>',
			'	</ns1:messageFunctionDetails>',
			'</ns1:msgType>',
			'<ns1:pricingTickInfo>',
			'	<ns1:productDateTimeDetails>',
			'		<ns1:ticketingDate>090819</ns1:ticketingDate>',
			'	</ns1:productDateTimeDetails>',
			'</ns1:pricingTickInfo>',
			'<ns1:flightQualification>',
			'	<ns1:additionalFareDetails>',
			'		<ns1:rateClass>QLXSPCL</ns1:rateClass>',
			'		<ns1:commodityCategory/>',
			'	</ns1:additionalFareDetails>',
			'</ns1:flightQualification>',
			'<ns1:transportInformation>',
			'	<ns1:transportService>',
			'		<ns1:companyIdentification>',
			'			<ns1:marketingCompany>CX</ns1:marketingCompany>',
			'		</ns1:companyIdentification>',
			'	</ns1:transportService>',
			'</ns1:transportInformation>',
			'<ns1:tripDescription>',
			'	<ns1:origDest>',
			'		<ns1:origin>JFK</ns1:origin>',
			'		<ns1:destination>MNL</ns1:destination>',
			'	</ns1:origDest>',
			'	<ns1:dateFlightMovement/>',
			'</ns1:tripDescription>',
			'</ns1:Fare_GetFareRules>',
		].map(s => s.trim()).join(''),
	});

	list.push({
		title: 'Build request with departure date',
		input: {
			airline: 'CX',
			destination: 'MNL',
			fareBasis: 'QLXSPCL',
			origin: 'JFK',
			ticketingDt: '2019-08-09',
			departureDt: '2019-08-10',
		},
		output: [
			'<ns1:Fare_GetFareRules xmlns:ns1="http://xml.amadeus.com/FARRNQ_10_1_1A">',
			'<ns1:msgType>',
			'	<ns1:messageFunctionDetails>',
			'		<ns1:messageFunction>FRN</ns1:messageFunction>',
			'	</ns1:messageFunctionDetails>',
			'</ns1:msgType>',
			'<ns1:pricingTickInfo>',
			'	<ns1:productDateTimeDetails>',
			'		<ns1:ticketingDate>090819</ns1:ticketingDate>',
			'	</ns1:productDateTimeDetails>',
			'</ns1:pricingTickInfo>',
			'<ns1:flightQualification>',
			'	<ns1:additionalFareDetails>',
			'		<ns1:rateClass>QLXSPCL</ns1:rateClass>',
			'		<ns1:commodityCategory/>',
			'	</ns1:additionalFareDetails>',
			'</ns1:flightQualification>',
			'<ns1:transportInformation>',
			'	<ns1:transportService>',
			'		<ns1:companyIdentification>',
			'			<ns1:marketingCompany>CX</ns1:marketingCompany>',
			'		</ns1:companyIdentification>',
			'	</ns1:transportService>',
			'</ns1:transportInformation>',
			'<ns1:tripDescription>',
			'	<ns1:origDest>',
			'		<ns1:origin>JFK</ns1:origin>',
			'		<ns1:destination>MNL</ns1:destination>',
			'	</ns1:origDest>',
			'	<ns1:dateFlightMovement>',
			'		<ns1:dateAndTimeDetails>',
			'			<ns1:date>100819</ns1:date>',
			'		</ns1:dateAndTimeDetails>',
			'	</ns1:dateFlightMovement>',
			'</ns1:tripDescription>',
			'</ns1:Fare_GetFareRules>',
		].map(s => s.trim()).join(''),
	});

	return list.map(a => [a]);
};

const provide_parseXml = () => {
	const list = [];

	list.push({
		title: 'Build correct result object from soap response',
		input: {
			xml: '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" xmlns:wsa="http://www.w3.org/2005/08/addressing"><SOAP-ENV:Header><wsa:To>http://www.w3.org/2005/08/addressing/anonymous</wsa:To><wsa:From><wsa:Address>https://nodeD1.production.webservices.amadeus.com/1ASIWTUTICO</wsa:Address></wsa:From><wsa:Action>http://webservices.amadeus.com/FARRNQ_10_1_1A</wsa:Action><wsa:MessageID>urn:uuid:ef8cb9d5-d4d4-c1a4-093f-cf7173c219fd</wsa:MessageID><wsa:RelatesTo RelationshipType="http://www.w3.org/2005/08/addressing/reply">1e8a1141-935b-4763-bb4a-6d325c31fea6</wsa:RelatesTo><awsse:Session TransactionStatusCode="End"><awsse:SessionId>0VPJZYL885</awsse:SessionId><awsse:SequenceNumber>1</awsse:SequenceNumber><awsse:SecurityToken>16IIZWUR47QA838W0Z5J12OJZQ</awsse:SecurityToken></awsse:Session></SOAP-ENV:Header><SOAP-ENV:Body><Fare_GetFareRulesReply xmlns="http://xml.amadeus.com/FARRNR_10_1_1A"><transactionType><messageFunctionDetails><messageFunction>FRN</messageFunction></messageFunctionDetails></transactionType><tariffInfo><fareRuleInfo><ruleSectionLocalId>1</ruleSectionLocalId><ruleCategoryCode>(50)</ruleCategoryCode></fareRuleInfo><fareRuleText><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier><informationType>CAT</informationType></freeTextQualification><freeText>RU.RULE APPLICATION</freeText></fareRuleText><fareRuleText><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier></freeTextQualification><freeText>BETWEEN MNL AND THE UNITED STATES</freeText></fareRuleText><fareRuleText><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier></freeTextQualification><freeText>EY PUBLISHED FARES FROM PHILIPPINE</freeText></fareRuleText></tariffInfo><tariffInfo><fareRuleInfo><ruleSectionLocalId>2</ruleSectionLocalId><ruleCategoryCode>(6)</ruleCategoryCode></fareRuleInfo><fareRuleText><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier><informationType>CAT</informationType></freeTextQualification><freeText>MN.MIN STAY</freeText></fareRuleText><fareRuleText><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier></freeTextQualification><freeText>NONE UNLESS OTHERWISE SPECIFIED</freeText></fareRuleText></tariffInfo><tariffInfo><fareRuleInfo><ruleSectionLocalId>3</ruleSectionLocalId><ruleCategoryCode>(7)</ruleCategoryCode></fareRuleInfo><fareRuleText><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier><informationType>CAT</informationType></freeTextQualification><freeText>MX.MAX STAY</freeText></fareRuleText><fareRuleText><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier></freeTextQualification><freeText>NONE UNLESS OTHERWISE SPECIFIED</freeText></fareRuleText></tariffInfo><flightDetails><nbOfSegments/><qualificationFareDetails><fareDetails><qualifier>ADT</qualifier><fareCategory>BOX</fareCategory></fareDetails><additionalFareDetails><fareClass>COWPH</fareClass></additionalFareDetails></qualificationFareDetails><flightErrorCode><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier><informationType>PTC</informationType></freeTextQualification><freeText>ADULT</freeText></flightErrorCode><flightErrorCode><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier><informationType>FTC</informationType></freeTextQualification><freeText>BUSINESS OW SPECIAL EXC</freeText></flightErrorCode><productInfo><productDetails><bookingClassDetails><designator>C</designator></bookingClassDetails></productDetails></productInfo><travellerGrp><travellerIdentRef><referenceDetails><type>RU</type><value>PHGD</value></referenceDetails></travellerIdentRef><fareRulesDetails><tariffClassId>1</tariffClassId><ruleSectionId>1</ruleSectionId><ruleSectionId>2</ruleSectionId><ruleSectionId>3</ruleSectionId><ruleSectionId>4</ruleSectionId><ruleSectionId>5</ruleSectionId><ruleSectionId>6</ruleSectionId><ruleSectionId>7</ruleSectionId><ruleSectionId>8</ruleSectionId><ruleSectionId>9</ruleSectionId><ruleSectionId>10</ruleSectionId><ruleSectionId>11</ruleSectionId><ruleSectionId>12</ruleSectionId><ruleSectionId>13</ruleSectionId><ruleSectionId>14</ruleSectionId><ruleSectionId>15</ruleSectionId><ruleSectionId>16</ruleSectionId><ruleSectionId>17</ruleSectionId><ruleSectionId>18</ruleSectionId><ruleSectionId>19</ruleSectionId><ruleSectionId>20</ruleSectionId><ruleSectionId>21</ruleSectionId></fareRulesDetails></travellerGrp></flightDetails></Fare_GetFareRulesReply></SOAP-ENV:Body></SOAP-ENV:Envelope>',
		},
		output: {
			header: {
				fareBasis: 'COWPH',
				trf: '1',
				rule: 'PHGD',
				bookingClass: 'C',
				ptc: 'ADT',
				ptcMeaning: 'ADULT',
				fareType: 'BOX',
				tripTypeRemark: 'BUSINESS OW SPECIAL EXC',
				sectionOrders: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'],
			},
			sections: [{
				sectionOrder: '1',
				sectionNumber: '50',
				sectionName: 'RULE APPLICATION',
				abbrevation: 'RU',
				raw: [
					'BETWEEN MNL AND THE UNITED STATES',
					'EY PUBLISHED FARES FROM PHILIPPINE',
				].join('\n'),
			}, {
				sectionOrder: '2',
				sectionNumber: '6',
				sectionName: 'MIN STAY',
				abbrevation: 'MN',
				raw: [
					'NONE UNLESS OTHERWISE SPECIFIED',
				].join('\n'),
			}, {
				sectionOrder: '3',
				sectionNumber: '7',
				sectionName: 'MAX STAY',
				abbrevation: 'MX',
				raw: 'NONE UNLESS OTHERWISE SPECIFIED',
			}],
		},
	});

	list.push({
		title: 'Parse error response',
		input: {
			xml: '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" xmlns:wsa="http://www.w3.org/2005/08/addressing"><SOAP-ENV:Header><wsa:To>http://www.w3.org/2005/08/addressing/anonymous</wsa:To><wsa:From><wsa:Address>https://nodeD1.production.webservices.amadeus.com/1ASIWTUTICO</wsa:Address></wsa:From><wsa:Action>http://webservices.amadeus.com/FARRNQ_10_1_1A</wsa:Action><wsa:MessageID>urn:uuid:ca896305-2b91-dd84-f927-51153b1ab20e</wsa:MessageID><wsa:RelatesTo RelationshipType="http://www.w3.org/2005/08/addressing/reply">19872773-020b-0095-00fa-d9d84a7f2c4e</wsa:RelatesTo><awsse:Session TransactionStatusCode="End"><awsse:SessionId>0S0TEDTXOP</awsse:SessionId><awsse:SequenceNumber>1</awsse:SequenceNumber><awsse:SecurityToken>2NEE99T20C9VF2XN99E703SJYC</awsse:SecurityToken></awsse:Session></SOAP-ENV:Header><SOAP-ENV:Body><Fare_GetFareRulesReply xmlns="http://xml.amadeus.com/FARRNR_10_1_1A"><transactionType><messageFunctionDetails><messageFunction>FRN</messageFunction></messageFunctionDetails></transactionType><errorInfo><rejectErrorCode><errorDetails><errorCode>3</errorCode></errorDetails></rejectErrorCode><errorFreeText><freeText>NO CURRENT FARE IN SYSTEM</freeText></errorFreeText></errorInfo></Fare_GetFareRulesReply></SOAP-ENV:Body></SOAP-ENV:Envelope>',
		},
		output: {
			errorCode: '3',
			error: 'NO CURRENT FARE IN SYSTEM',
		},
	});

	return list.map(a => [a]);
};

class TravelportClientTest extends require('../../Transpiled/Lib/TestCase') {
	async test_buildXml({input, output}) {
		this.assertSame(output, AmadeusFareRules.buildFareRuleXml(input));
	}

	async test_parseXml({input, output}) {
		const result = AmadeusFareRules.parseFareRuleXmlResponse(input.xml, input.params);
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