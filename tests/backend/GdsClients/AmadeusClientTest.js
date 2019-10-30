const AmadeusClient = require('../../../backend/GdsClients/AmadeusClient');
const PersistentHttpRqStub = require('../../../backend/Utils/Testing/PersistentHttpRqStub.js');
const sinon = require('sinon');

const provideTestCases = () => {
	const list = [];

	list.push({
		title: 'Perform request and parse response',
		input: {
			airline: 'CX',
			destination: 'MNL',
			fareBasis: 'QLXSPCL',
			origin: 'JFK',
			ticketingDt: '2019-08-09',
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
		httpRequests: [{
			rq: [
				'<?xml version="1.0" encoding="UTF-8"?>',
				'		<SOAP-ENV:Envelope',
				'		    xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"',
				'		    xmlns:ns2="http://www.w3.org/2005/08/addressing"',
				'		    xmlns:ns3="http://wsdl.amadeus.com/2010/06/ws/Link_v1">',
				'		  <SOAP-ENV:Header>',
				'		    <ns2:MessageID>00000000-0000-0000-0000-000000000000</ns2:MessageID>',
				'		    <ns2:Action>http://webservices.amadeus.com/FARRNQ_10_1_1A</ns2:Action>',
				'		    <ns2:To>https://something/somewhere</ns2:To>',
				'		    <ns3:TransactionFlowLink/>',
				'		    <oas:Security xmlns:oas="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">',
				'		      <oas:UsernameToken xmlns:oas1="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" oas1:Id="UsernameToken-1">',
				'		        <oas:Username>grectUnitTest</oas:Username>',
				'		        <oas:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">Ly8vLy8vLy8vLy8vLy8vLy8vLy8vdz09</oas:Nonce>',
				'		        <oas:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">8wBmE+H/tWJE15ScOax3TnN4qTM=</oas:Password>',
				'		        <oas1:Created>2019-08-07T00:00:00.000Z</oas1:Created>',
				'		      </oas:UsernameToken>',
				'		    </oas:Security>',
				'		    <AMA_SecurityHostedUser xmlns="http://xml.amadeus.com/2010/06/Security_v1">',
				'		      <UserID AgentDutyCode="SU" RequestorType="U" PseudoCityCode="something" POS_Type="1"/>',
				'		    </AMA_SecurityHostedUser>',
				'		  </SOAP-ENV:Header>',
				'		  <SOAP-ENV:Body><ns1:Fare_GetFareRules xmlns:ns1="http://xml.amadeus.com/FARRNQ_10_1_1A"><ns1:msgType><ns1:messageFunctionDetails><ns1:messageFunction>FRN</ns1:messageFunction></ns1:messageFunctionDetails></ns1:msgType><ns1:pricingTickInfo><ns1:productDateTimeDetails><ns1:ticketingDate>090819</ns1:ticketingDate></ns1:productDateTimeDetails></ns1:pricingTickInfo><ns1:flightQualification><ns1:additionalFareDetails><ns1:rateClass>QLXSPCL</ns1:rateClass><ns1:commodityCategory/></ns1:additionalFareDetails></ns1:flightQualification><ns1:transportInformation><ns1:transportService><ns1:companyIdentification><ns1:marketingCompany>CX</ns1:marketingCompany></ns1:companyIdentification></ns1:transportService></ns1:transportInformation><ns1:tripDescription><ns1:origDest><ns1:origin>JFK</ns1:origin><ns1:destination>MNL</ns1:destination></ns1:origDest><ns1:dateFlightMovement/></ns1:tripDescription></ns1:Fare_GetFareRules></SOAP-ENV:Body>',
				'		</SOAP-ENV:Envelope>',
			].join('\n'),
			rs: '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" xmlns:wsa="http://www.w3.org/2005/08/addressing"><SOAP-ENV:Header><wsa:To>http://www.w3.org/2005/08/addressing/anonymous</wsa:To><wsa:From><wsa:Address>https://nodeD1.production.webservices.amadeus.com/1ASIWTUTICO</wsa:Address></wsa:From><wsa:Action>http://webservices.amadeus.com/FARRNQ_10_1_1A</wsa:Action><wsa:MessageID>urn:uuid:ef8cb9d5-d4d4-c1a4-093f-cf7173c219fd</wsa:MessageID><wsa:RelatesTo RelationshipType="http://www.w3.org/2005/08/addressing/reply">1e8a1141-935b-4763-bb4a-6d325c31fea6</wsa:RelatesTo><awsse:Session TransactionStatusCode="End"><awsse:SessionId>0VPJZYL885</awsse:SessionId><awsse:SequenceNumber>1</awsse:SequenceNumber><awsse:SecurityToken>16IIZWUR47QA838W0Z5J12OJZQ</awsse:SecurityToken></awsse:Session></SOAP-ENV:Header><SOAP-ENV:Body><Fare_GetFareRulesReply xmlns="http://xml.amadeus.com/FARRNR_10_1_1A"><transactionType><messageFunctionDetails><messageFunction>FRN</messageFunction></messageFunctionDetails></transactionType><tariffInfo><fareRuleInfo><ruleSectionLocalId>1</ruleSectionLocalId><ruleCategoryCode>(50)</ruleCategoryCode></fareRuleInfo><fareRuleText><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier><informationType>CAT</informationType></freeTextQualification><freeText>RU.RULE APPLICATION</freeText></fareRuleText><fareRuleText><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier></freeTextQualification><freeText>BETWEEN MNL AND THE UNITED STATES</freeText></fareRuleText><fareRuleText><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier></freeTextQualification><freeText>EY PUBLISHED FARES FROM PHILIPPINE</freeText></fareRuleText></tariffInfo><tariffInfo><fareRuleInfo><ruleSectionLocalId>2</ruleSectionLocalId><ruleCategoryCode>(6)</ruleCategoryCode></fareRuleInfo><fareRuleText><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier><informationType>CAT</informationType></freeTextQualification><freeText>MN.MIN STAY</freeText></fareRuleText><fareRuleText><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier></freeTextQualification><freeText>NONE UNLESS OTHERWISE SPECIFIED</freeText></fareRuleText></tariffInfo><tariffInfo><fareRuleInfo><ruleSectionLocalId>3</ruleSectionLocalId><ruleCategoryCode>(7)</ruleCategoryCode></fareRuleInfo><fareRuleText><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier><informationType>CAT</informationType></freeTextQualification><freeText>MX.MAX STAY</freeText></fareRuleText><fareRuleText><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier></freeTextQualification><freeText>NONE UNLESS OTHERWISE SPECIFIED</freeText></fareRuleText></tariffInfo><flightDetails><nbOfSegments/><qualificationFareDetails><fareDetails><qualifier>ADT</qualifier><fareCategory>BOX</fareCategory></fareDetails><additionalFareDetails><fareClass>COWPH</fareClass></additionalFareDetails></qualificationFareDetails><flightErrorCode><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier><informationType>PTC</informationType></freeTextQualification><freeText>ADULT</freeText></flightErrorCode><flightErrorCode><freeTextQualification><textSubjectQualifier>3</textSubjectQualifier><informationType>FTC</informationType></freeTextQualification><freeText>BUSINESS OW SPECIAL EXC</freeText></flightErrorCode><productInfo><productDetails><bookingClassDetails><designator>C</designator></bookingClassDetails></productDetails></productInfo><travellerGrp><travellerIdentRef><referenceDetails><type>RU</type><value>PHGD</value></referenceDetails></travellerIdentRef><fareRulesDetails><tariffClassId>1</tariffClassId><ruleSectionId>1</ruleSectionId><ruleSectionId>2</ruleSectionId><ruleSectionId>3</ruleSectionId><ruleSectionId>4</ruleSectionId><ruleSectionId>5</ruleSectionId><ruleSectionId>6</ruleSectionId><ruleSectionId>7</ruleSectionId><ruleSectionId>8</ruleSectionId><ruleSectionId>9</ruleSectionId><ruleSectionId>10</ruleSectionId><ruleSectionId>11</ruleSectionId><ruleSectionId>12</ruleSectionId><ruleSectionId>13</ruleSectionId><ruleSectionId>14</ruleSectionId><ruleSectionId>15</ruleSectionId><ruleSectionId>16</ruleSectionId><ruleSectionId>17</ruleSectionId><ruleSectionId>18</ruleSectionId><ruleSectionId>19</ruleSectionId><ruleSectionId>20</ruleSectionId><ruleSectionId>21</ruleSectionId></fareRulesDetails></travellerGrp></flightDetails></Fare_GetFareRulesReply></SOAP-ENV:Body></SOAP-ENV:Envelope>',
		}],
	});

	return list.map(c => [c]);
};

class AmadeusClientTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js') {
	async testClient({input, output, httpRequests}) {
		const PersistentHttpRq = PersistentHttpRqStub(httpRequests);

		const amadeus = AmadeusClient.makeCustom({
			PersistentHttpRq,
			GdsProfiles: {
				getAmadeus: () => Promise.resolve({
					username: 'grectUnitTest',
					password: 'qwerty123',
					default_pcc: 'something',
					endpoint: 'https://something/somewhere',
				}),
			},
		});

		const gdsData = {
			sessionToken: 'soap-unit-test-blabla-123',
			profileName: 'something',
		};

		sinon.stub(require('crypto'), 'randomBytes')
			.onFirstCall()
			.returns(Buffer.from('ffffffffffffffffffffffffffffffff', 'hex'))
			.onSecondCall()
			.returns(Buffer.from('00000000000000000000000000000000', 'hex'));

		sinon.stub(Date.prototype, 'toISOString')
			.returns('2019-08-07T00:00:00.000Z');

		try {
			const result = await amadeus.getFareRules(gdsData, input);
			this.assertArrayElementsSubset(output, result);
		} finally {
			sinon.restore();
		}
	}

	getTestMapping() {
		return [
			[provideTestCases, this.testClient],
		];
	}
}

module.exports = AmadeusClientTest;
