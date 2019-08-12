const SabreClient = require('../../../backend/GdsClients/SabreClient');
const PersistentHttpRqStub = require('../../../backend/Utils/Testing/PersistentHttpRqStub.js');
const sinon = require('sinon');
const moment = require('moment');

const provideItineraryTestCases = () => {
	const list = [];

	list.push({
		title: 'Perform request and parse response',
		input: {
			addAirSegments: [{
				airline: 'PR',
				flightNumber: '127',
				bookingClass: 'C',
				destinationAirport: 'MNL',
				departureAirport: 'JFK',
				departureDt: '2020-05-20',
				segmentStatus: 'GK',
				seatCount: 1,
				isMarried: false,
			}, {
				airline: 'PR',
				flightNumber: '126',
				bookingClass: 'C',
				destinationAirport: 'JFK',
				departureAirport: 'MNL',
				departureDt: '2020-05-25',
				segmentStatus: 'GK',
				seatCount: 1,
				isMarried: false,
			}],
		},
		output: {
			binarySecurityToken: 'Shared/IDL:IceSess/SessMgr:1.0.IDL/Common/!ICESMS/RESB!ICESMSLB/RES.LB!-1111111111111111111!2222222!0',
			newAirSegments: [{
				departureDt: '2020-05-20 01:45:00',
				destinationDt: '2020-05-21 06:15:00',
				airline: 'PR',
				flightNumber: '0127',
				bookingClass: 'C',
				destinationAirport: 'MNL',
				departureAirport: 'JFK',
				segmentStatus: 'GK',
				seatCount: '001',
				eticket: true,
			}, {
				departureDt: '2020-05-25 19:40:00',
				destinationDt: '2020-05-25 23:15:00',
				airline: 'PR',
				flightNumber: '0126',
				bookingClass: 'C',
				destinationAirport: 'JFK',
				departureAirport: 'MNL',
				segmentStatus: 'GK',
				seatCount: '001',
				eticket: true,
			}],
			error: null,
		},
		httpRequests: [{
			rq: [
				'<?xml version="1.0" encoding="UTF-8"?>',
				'<SOAP-ENV:Envelope',
				'	xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"',
				'	xmlns:secext="http://schemas.xmlsoap.org/ws/2002/12/secext"',
				'	xmlns:ebmsg="http://www.ebxml.org/namespaces/messageHeader">',
				'  <SOAP-ENV:Header>',
				'    <secext:Security>',
				'      <secext:BinarySecurityToken>soap-unit-test-blabla-123</secext:BinarySecurityToken>',
				'    </secext:Security>',
				'    <ebmsg:MessageHeader>',
				'      <ebmsg:From>',
				'        <ebmsg:PartyId ebmsg:type="urn:x12.org:IO5:01">innogw.dyninno.net</ebmsg:PartyId>',
				'      </ebmsg:From>',
				'      <ebmsg:To>',
				'        <ebmsg:PartyId ebmsg:type="urn:x12.org:IO5:01">webservices.sabre.com/websvc</ebmsg:PartyId>',
				'      </ebmsg:To>',
				'      <ebmsg:CPAId>something</ebmsg:CPAId>',
				'      <ebmsg:ConversationId>someConversationId</ebmsg:ConversationId>',
				'      <ebmsg:Service ebmsg:type="OTA">EnhancedAirBookRQ</ebmsg:Service>',
				'      <ebmsg:Action>EnhancedAirBookRQ</ebmsg:Action>',
				'      <ebmsg:MessageData>',
				'        <ebmsg:MessageId>1</ebmsg:MessageId>',
				'        <ebmsg:Timestamp>2019-02-22T19:07:05</ebmsg:Timestamp>',
				'        <ebmsg:Timeout>600</ebmsg:Timeout>',
				'      </ebmsg:MessageData>',
				'    </ebmsg:MessageHeader>',
				'  </SOAP-ENV:Header>',
				'  <SOAP-ENV:Body><ns1:EnhancedAirBookRQ version="3.9.0" xmlns:ns1="http://services.sabre.com/sp/eab/v3_9"><ns1:OTA_AirBookRQ><ns1:OriginDestinationInformation><ns1:FlightSegment DepartureDateTime="2020-05-20T00:00" FlightNumber="127" NumberInParty="1" ResBookDesigCode="C" Status="GK"><ns1:DestinationLocation LocationCode="MNL"/><ns1:MarketingAirline Code="PR" FlightNumber="127"/><ns1:MarriageGrp>I</ns1:MarriageGrp><ns1:OperatingAirline Code="PR"/><ns1:OriginLocation LocationCode="JFK"/></ns1:FlightSegment><ns1:FlightSegment DepartureDateTime="2020-05-25T00:00" FlightNumber="126" NumberInParty="1" ResBookDesigCode="C" Status="GK"><ns1:DestinationLocation LocationCode="JFK"/><ns1:MarketingAirline Code="PR" FlightNumber="126"/><ns1:MarriageGrp>I</ns1:MarriageGrp><ns1:OperatingAirline Code="PR"/><ns1:OriginLocation LocationCode="MNL"/></ns1:FlightSegment></ns1:OriginDestinationInformation></ns1:OTA_AirBookRQ><ns1:PostProcessing/><ns1:PreProcessing/></ns1:EnhancedAirBookRQ>  </SOAP-ENV:Body>',
				'</SOAP-ENV:Envelope>',
			].join('\n'),
			rs: '<?xml version="1.0" encoding="UTF-8"?><soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"><soap-env:Header><eb:MessageHeader xmlns:eb="http://www.ebxml.org/namespaces/messageHeader" eb:version="1.0" soap-env:mustUnderstand="1"><eb:From><eb:PartyId eb:type="urn:x12.org:IO5:01">webservices.sabre.com/websvc</eb:PartyId></eb:From><eb:To><eb:PartyId eb:type="urn:x12.org:IO5:01">innogw.dyninno.net</eb:PartyId></eb:To><eb:CPAId>L3II</eb:CPAId><eb:ConversationId>2019-08-07T13:52:58@innogateway5d4ad7ba96d18PID19798</eb:ConversationId><eb:Service eb:type="OTA">EnhancedAirBookRQ</eb:Service><eb:Action>EnhancedAirBookRS</eb:Action><eb:MessageData><eb:MessageId>247y4eskx</eb:MessageId><eb:Timestamp>2019-08-07T13:53:09</eb:Timestamp><eb:RefToMessageId>1345904779</eb:RefToMessageId></eb:MessageData></eb:MessageHeader><wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"><wsse:BinarySecurityToken valueType="String" EncodingType="wsse:Base64Binary">Shared/IDL:IceSess/SessMgr:1.0.IDL/Common/!ICESMS/RESB!ICESMSLB/RES.LB!-1111111111111111111!2222222!0</wsse:BinarySecurityToken></wsse:Security></soap-env:Header><soap-env:Body><EnhancedAirBookRS xmlns="http://services.sabre.com/sp/eab/v3_9"><ApplicationResults xmlns="http://services.sabre.com/STL_Payload/v02_01" status="Complete"><Success timeStamp="2019-08-07T08:53:09.759-05:00"/></ApplicationResults><OTA_AirBookRS><OriginDestinationOption><FlightSegment ArrivalDateTime="05-21T06:15" DepartureDateTime="05-20T01:45" FlightNumber="0127" NumberInParty="001" ResBookDesigCode="C" Status="GK" eTicket="true"><DestinationLocation LocationCode="MNL"/><MarketingAirline Code="PR" FlightNumber="0127"/><OriginLocation LocationCode="JFK"/></FlightSegment><FlightSegment ArrivalDateTime="05-25T23:15" DepartureDateTime="05-25T19:40" FlightNumber="0126" NumberInParty="001" ResBookDesigCode="C" Status="GK" eTicket="true"><DestinationLocation LocationCode="JFK"/><MarketingAirline Code="PR" FlightNumber="0126"/><OriginLocation LocationCode="MNL"/></FlightSegment></OriginDestinationOption></OTA_AirBookRS></EnhancedAirBookRS></soap-env:Body></soap-env:Envelope>',
		}],
	});

	return list.map(c => [c]);
};

class SabreClientTest extends require('../../../backend/Transpiled/Lib/TestCase') {
	async testItinerary({input, output, httpRequests}) {
		const PersistentHttpRq = PersistentHttpRqStub(httpRequests);

		const sabre = SabreClient.makeCustom({
			PersistentHttpRq,
			GdsProfiles: {
				getSabre: () => Promise.resolve({
					username: 'grectUnitTest',
					password: 'qwerty123',
					default_pcc: 'something',
					endpoint: 'https://something/somewhere',
				}),
			},
		});

		sinon.stub(moment.fn, 'format')
			.withArgs('YYYY-MM-DD')
			.returns('2019-08-09')
			.withArgs('YYYY-MM-DD\\THH:mm')
			.callThrough();

		const gdsData = {
			binarySecurityToken: 'soap-unit-test-blabla-123',
			profileName: 'something',
			conversationId: 'someConversationId',
			messageId: '1',
		};

		try {
			const result = await sabre.processPnr(gdsData, input);
			this.assertArrayElementsSubset(output, result);
		} finally {
			sinon.restore();
		}
	}

	getTestMapping() {
		return [
			[provideItineraryTestCases, this.testItinerary],
		];
	}
}

module.exports = SabreClientTest;
