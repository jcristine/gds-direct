const SabreItinerary = require('../../../../backend/GdsClients/Transformers/SabreItinerary');
const {parseXml} = require('../../../../backend/GdsHelpers/CommonUtils');
const sinon = require('sinon');
const moment = require('moment');

const provide_buildXml = () => {
	const list = [];

	list.push({
		title: 'Build request xml',
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
		output: [
			'<ns1:EnhancedAirBookRQ version="3.9.0" xmlns:ns1="http://services.sabre.com/sp/eab/v3_9">',
			'	<ns1:OTA_AirBookRQ>',
			'		<ns1:OriginDestinationInformation>',
			'			<ns1:FlightSegment DepartureDateTime="2020-05-20T00:00" FlightNumber="127" NumberInParty="1" ResBookDesigCode="C" Status="GK">',
			'				<ns1:DestinationLocation LocationCode="MNL"/>',
			'				<ns1:MarketingAirline Code="PR" FlightNumber="127"/>',
			'				<ns1:MarriageGrp>I</ns1:MarriageGrp>',
			'				<ns1:OperatingAirline Code="PR"/>',
			'				<ns1:OriginLocation LocationCode="JFK"/>',
			'			</ns1:FlightSegment>',
			'			<ns1:FlightSegment DepartureDateTime="2020-05-25T00:00" FlightNumber="126" NumberInParty="1" ResBookDesigCode="C" Status="GK">',
			'				<ns1:DestinationLocation LocationCode="JFK"/>',
			'				<ns1:MarketingAirline Code="PR" FlightNumber="126"/>',
			'				<ns1:MarriageGrp>I</ns1:MarriageGrp>',
			'				<ns1:OperatingAirline Code="PR"/>',
			'				<ns1:OriginLocation LocationCode="MNL"/>',
			'			</ns1:FlightSegment>',
			'		</ns1:OriginDestinationInformation>',
			'	</ns1:OTA_AirBookRQ>',
			'	<ns1:PostProcessing/>',
			'	<ns1:PreProcessing/>',
			'</ns1:EnhancedAirBookRQ>',
		].map(s => s.trim()).join(''),
	});

	return list.map(a => [a]);
};

const provide_parseXml = () => {
	const list = [];
	list.push({
		title: 'Parse xml response',
		input: {
			xml: parseXml('<?xml version="1.0" encoding="UTF-8"?><soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"><soap-env:Header><eb:MessageHeader xmlns:eb="http://www.ebxml.org/namespaces/messageHeader" eb:version="1.0" soap-env:mustUnderstand="1"><eb:From><eb:PartyId eb:type="urn:x12.org:IO5:01">webservices.sabre.com/websvc</eb:PartyId></eb:From><eb:To><eb:PartyId eb:type="urn:x12.org:IO5:01">innogw.dyninno.net</eb:PartyId></eb:To><eb:CPAId>L3II</eb:CPAId><eb:ConversationId>2019-08-07T13:52:58@innogateway5d4ad7ba96d18PID19798</eb:ConversationId><eb:Service eb:type="OTA">EnhancedAirBookRQ</eb:Service><eb:Action>EnhancedAirBookRS</eb:Action><eb:MessageData><eb:MessageId>247y4eskx</eb:MessageId><eb:Timestamp>2019-08-07T13:53:09</eb:Timestamp><eb:RefToMessageId>1345904779</eb:RefToMessageId></eb:MessageData></eb:MessageHeader><wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"><wsse:BinarySecurityToken valueType="String" EncodingType="wsse:Base64Binary">Shared/IDL:IceSess/SessMgr:1.0.IDL/Common/!ICESMS/RESB!ICESMSLB/RES.LB!-1111111111111111111!2222222!0</wsse:BinarySecurityToken></wsse:Security></soap-env:Header><soap-env:Body><EnhancedAirBookRS xmlns="http://services.sabre.com/sp/eab/v3_9"><ApplicationResults xmlns="http://services.sabre.com/STL_Payload/v02_01" status="Complete"><Success timeStamp="2019-08-07T08:53:09.759-05:00"/></ApplicationResults><OTA_AirBookRS><OriginDestinationOption><FlightSegment ArrivalDateTime="05-21T06:15" DepartureDateTime="05-20T01:45" FlightNumber="0127" NumberInParty="001" ResBookDesigCode="C" Status="GK" eTicket="true"><DestinationLocation LocationCode="MNL"/><MarketingAirline Code="PR" FlightNumber="0127"/><OriginLocation LocationCode="JFK"/></FlightSegment><FlightSegment ArrivalDateTime="05-25T23:15" DepartureDateTime="05-25T19:40" FlightNumber="0126" NumberInParty="001" ResBookDesigCode="C" Status="GK" eTicket="true"><DestinationLocation LocationCode="JFK"/><MarketingAirline Code="PR" FlightNumber="0126"/><OriginLocation LocationCode="MNL"/></FlightSegment></OriginDestinationOption></OTA_AirBookRS></EnhancedAirBookRS></soap-env:Body></soap-env:Envelope>'),
			params: {
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
	});

	list.push({
		title: 'Error because of missing flight segment in response',
		input: {
			xml: parseXml('<?xml version="1.0" encoding="UTF-8"?><soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"><soap-env:Header><eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader"><eb:From><eb:PartyId eb:type="urn:x12.org:IO5:01">webservices.sabre.com/websvc</eb:PartyId></eb:From><eb:To><eb:PartyId eb:type="urn:x12.org:IO5:01">innogw.dyninno.net</eb:PartyId></eb:To><eb:CPAId>L3II</eb:CPAId><eb:ConversationId>2019-08-07T13:52:58@innogateway5d4ad7ba96d18PID19798</eb:ConversationId><eb:Service eb:type="OTA">EnhancedAirBookRQ</eb:Service><eb:Action>EnhancedAirBookRS</eb:Action><eb:MessageData><eb:MessageId>247y4eskx</eb:MessageId><eb:Timestamp>2019-08-07T13:53:09</eb:Timestamp><eb:RefToMessageId>1345904779</eb:RefToMessageId></eb:MessageData></eb:MessageHeader><wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"><wsse:BinarySecurityToken EncodingType="wsse:Base64Binary" valueType="String">Shared/IDL:IceSess/SessMgr:1.0.IDL/Common/!ICESMS/RESB!ICESMSLB/RES.LB!-1111111111111111111!2222222!0</wsse:BinarySecurityToken></wsse:Security></soap-env:Header><soap-env:Body><EnhancedAirBookRS xmlns="http://services.sabre.com/sp/eab/v3_9"><ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01"><Success timeStamp="2019-08-07T08:53:09.759-05:00"/></ApplicationResults><OTA_AirBookRS><OriginDestinationOption><FlightSegment ArrivalDateTime="05-21T06:15" DepartureDateTime="05-20T01:45" FlightNumber="0127" NumberInParty="001" ResBookDesigCode="C" Status="GK" eTicket="true"><DestinationLocation LocationCode="MNL"/><MarketingAirline Code="PR" FlightNumber="0127"/><OriginLocation LocationCode="JFK"/></FlightSegment></OriginDestinationOption></OTA_AirBookRS></EnhancedAirBookRS></soap-env:Body></soap-env:Envelope>'),
			params: {
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
			}],
			error: 'Failed to add segments starting from 1-th',
		},
	});

	list.push({
		title: 'Parse soap error response',
		input: {
			xml: parseXml('<?xml version="1.0" encoding="UTF-8"?><soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"><soap-env:Header/><soap-env:Body><soap-env:Fault><faultcode>Server.SystemFailure</faultcode><faultstring>Could not complete the request</faultstring><detail><message>Unexpected error: could not complete the request</message></detail></soap-env:Fault></soap-env:Body></soap-env:Envelope>'),
			params: {
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
				}],
			},
		},
		output: {
			error: 'Sabre soap error - Unexpected error: could not complete the request',
			binarySecurityToken: null,
			newAirSegments: [],
		},
	});

	list.push({
		title: 'Sabre warning in response',
		input: {
			xml: parseXml('<?xml version="1.0" encoding="UTF-8"?><soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"><soap-env:Header><eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader"><eb:From><eb:PartyId eb:type="urn:x12.org:IO5:01">webservices.sabre.com/websvc</eb:PartyId></eb:From><eb:To><eb:PartyId eb:type="urn:x12.org:IO5:01">innogw.dyninno.net</eb:PartyId></eb:To><eb:CPAId>L3II</eb:CPAId><eb:ConversationId>2019-08-07T13:52:58@innogateway5d4ad7ba96d18PID19798</eb:ConversationId><eb:Service eb:type="OTA">EnhancedAirBookRQ</eb:Service><eb:Action>EnhancedAirBookRS</eb:Action><eb:MessageData><eb:MessageId>247y4eskx</eb:MessageId><eb:Timestamp>2019-08-07T13:53:09</eb:Timestamp><eb:RefToMessageId>1345904779</eb:RefToMessageId></eb:MessageData></eb:MessageHeader><wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"><wsse:BinarySecurityToken EncodingType="wsse:Base64Binary" valueType="String">Shared/IDL:IceSess/SessMgr:1.0.IDL/Common/!ICESMS/RESB!ICESMSLB/RES.LB!-1111111111111111111!2222222!0</wsse:BinarySecurityToken></wsse:Security></soap-env:Header><soap-env:Body><EnhancedAirBookRS xmlns="http://services.sabre.com/sp/eab/v3_9"><ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01"><Success timeStamp="2019-08-07T08:53:09.759-05:00"/><Warning><SystemSpecificResults><Message Code="123">Some error message 1</Message></SystemSpecificResults></Warning><Warning><SystemSpecificResults><Message Code="321"/></SystemSpecificResults></Warning></ApplicationResults><OTA_AirBookRS><OriginDestinationOption><FlightSegment ArrivalDateTime="05-21T06:15" DepartureDateTime="05-20T01:45" FlightNumber="0127" NumberInParty="001" ResBookDesigCode="C" Status="GK" eTicket="true"><DestinationLocation LocationCode="MNL"/><MarketingAirline Code="PR" FlightNumber="0127"/><OriginLocation LocationCode="JFK"/></FlightSegment></OriginDestinationOption></OTA_AirBookRS></EnhancedAirBookRS></soap-env:Body></soap-env:Envelope>'),
			params: {
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
				}],
			},
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
			}],
			error: 'Sabre warning - Some error message 1; Sabre warning - (no message)',
		},
	});

	return list.map(a => [a]);
};

class SabreItineraryTest extends require('../../Transpiled/Lib/TestCase') {
	async test_buildXml({input, output}) {
		this.assertSame(output, SabreItinerary.buildItinaryXml(input));
	}

	async test_parseXml({input, output}) {
		// otherwise in a year expected output would change because inside code
		// there is relative date transformation
		sinon.stub(moment().__proto__, 'format')
			.withArgs('YYYY-MM-DD')
			.returns('2019-08-09');


		try {
			const result = SabreItinerary.parseItineraryXmlResponse(input.xml, input.params);
			this.assertArrayElementsSubset(output, result);
		} finally {
			sinon.restore();
		}
	}

	getTestMapping() {
		return [
			[provide_buildXml, this.test_buildXml],
			[provide_parseXml, this.test_parseXml],
		];
	}
}

module.exports = SabreItineraryTest;