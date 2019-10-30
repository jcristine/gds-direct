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
			'				<ns1:MarriageGrp>O</ns1:MarriageGrp>',
			'				<ns1:OperatingAirline Code="PR"/>',
			'				<ns1:OriginLocation LocationCode="JFK"/>',
			'			</ns1:FlightSegment>',
			'			<ns1:FlightSegment DepartureDateTime="2020-05-25T00:00" FlightNumber="126" NumberInParty="1" ResBookDesigCode="C" Status="GK">',
			'				<ns1:DestinationLocation LocationCode="JFK"/>',
			'				<ns1:MarketingAirline Code="PR" FlightNumber="126"/>',
			'				<ns1:MarriageGrp>O</ns1:MarriageGrp>',
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

	list.push({
		title: 'Build request xml with redisplay',
		input: {
			redisplay: true,
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
		output: [
			'<ns1:EnhancedAirBookRQ version="3.9.0" xmlns:ns1="http://services.sabre.com/sp/eab/v3_9">',
			'	<ns1:OTA_AirBookRQ>',
			'		<ns1:OriginDestinationInformation>',
			'			<ns1:FlightSegment DepartureDateTime="2020-05-20T00:00" FlightNumber="127" NumberInParty="1" ResBookDesigCode="C" Status="GK">',
			'				<ns1:DestinationLocation LocationCode="MNL"/>',
			'				<ns1:MarketingAirline Code="PR" FlightNumber="127"/>',
			'				<ns1:MarriageGrp>O</ns1:MarriageGrp>',
			'				<ns1:OperatingAirline Code="PR"/>',
			'				<ns1:OriginLocation LocationCode="JFK"/>',
			'			</ns1:FlightSegment>',
			'		</ns1:OriginDestinationInformation>',
			'	</ns1:OTA_AirBookRQ>',
			'	<ns1:PostProcessing>',
			'    <ns1:RedisplayReservation></ns1:RedisplayReservation>',
			' </ns1:PostProcessing>',
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
			xml: parseXml('<?xml version="1.0" encoding="UTF-8"?><soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"><soap-env:Header><eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader"><eb:From><eb:PartyId eb:type="urn:x12.org:IO5:01">webservices.sabre.com/websvc</eb:PartyId></eb:From><eb:To><eb:PartyId eb:type="urn:x12.org:IO5:01">innogw.dyninno.net</eb:PartyId></eb:To><eb:CPAId>L3II</eb:CPAId><eb:ConversationId>2019-02-22T19:07:04@innogateway5c7048587a71aPID4209</eb:ConversationId><eb:Service eb:type="OTA">EnhancedAirBookRQ</eb:Service><eb:Action>EnhancedAirBookRS</eb:Action><eb:MessageData><eb:MessageId>2e7v3xpls</eb:MessageId><eb:Timestamp>2019-08-15T07:10:31</eb:Timestamp><eb:RefToMessageId>1876459793</eb:RefToMessageId></eb:MessageData></eb:MessageHeader><wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"><wsse:BinarySecurityToken EncodingType="wsse:Base64Binary" valueType="String">Shared/IDL:IceSess/SessMgr:1.0.IDL/Common/!ICESMS/RESB!ICESMSLB/RES.LB!-1111111111111111111!2222222!0</wsse:BinarySecurityToken></wsse:Security></soap-env:Header><soap-env:Body><EnhancedAirBookRS xmlns="http://services.sabre.com/sp/eab/v3_9"><ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01"><Success timeStamp="2019-08-15T02:10:31.047-05:00"/></ApplicationResults><OTA_AirBookRS><OriginDestinationOption><FlightSegment ArrivalDateTime="05-21T06:15" DepartureDateTime="05-20T01:45" FlightNumber="0127" NumberInParty="001" ResBookDesigCode="C" Status="GK" eTicket="true"><DestinationLocation LocationCode="MNL"/><MarketingAirline Code="PR" FlightNumber="0127"/><OriginLocation LocationCode="JFK"/></FlightSegment><FlightSegment ArrivalDateTime="05-25T23:15" DepartureDateTime="05-25T19:40" FlightNumber="0126" NumberInParty="001" ResBookDesigCode="C" Status="GK" eTicket="true"><DestinationLocation LocationCode="JFK"/><MarketingAirline Code="PR" FlightNumber="0126"/><OriginLocation LocationCode="MNL"/></FlightSegment></OriginDestinationOption></OTA_AirBookRS><TravelItineraryReadRS><TravelItinerary><CustomerInfo/><ItineraryInfo><ReservationItems><Item RPH="1"><FlightSegment AirMilesFlown="8520" ArrivalDateTime="05-21T06:15" CodeShare="false" DayOfWeekInd="3" DepartureDateTime="2020-05-20T01:45" ElapsedTime="16.30" FlightNumber="0127" IsPast="false" NumberInParty="01" ResBookDesigCode="C" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="GK" StopQuantity="00" eTicket="true"><DestinationLocation LocationCode="MNL" Terminal="TERMINAL 1" TerminalCode="1"/><Equipment AirEquipType="350"/><MarketingAirline Code="PR" FlightNumber="0127"><Banner>MARKETED BY PHILIPPINE AIRLINES</Banner></MarketingAirline><Meal Code="D"/><OperatingAirline Code="PR" FlightNumber="0127" ResBookDesigCode="C"><Banner>OPERATED BY PHILIPPINE AIRLINES</Banner></OperatingAirline><OperatingAirlinePricing Code="PR"/><DisclosureCarrier Code="PR"><Banner>PHILIPPINE AIRLINES</Banner></DisclosureCarrier><OriginLocation LocationCode="JFK" Terminal="TERMINAL 1" TerminalCode="1"/><UpdatedArrivalTime>05-21T06:15</UpdatedArrivalTime><UpdatedDepartureTime>05-20T01:45</UpdatedDepartureTime></FlightSegment></Item><Item RPH="2"><FlightSegment AirMilesFlown="8520" ArrivalDateTime="05-25T23:15" CodeShare="false" DayOfWeekInd="1" DepartureDateTime="2020-05-25T19:40" ElapsedTime="16.35" FlightNumber="0126" IsPast="false" NumberInParty="01" ResBookDesigCode="C" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="GK" StopQuantity="00" eTicket="true"><DestinationLocation LocationCode="JFK" Terminal="TERMINAL 1" TerminalCode="1"/><Equipment AirEquipType="350"/><MarketingAirline Code="PR" FlightNumber="0126"><Banner>MARKETED BY PHILIPPINE AIRLINES</Banner></MarketingAirline><Meal Code="D"/><OperatingAirline Code="PR" FlightNumber="0126" ResBookDesigCode="C"><Banner>OPERATED BY PHILIPPINE AIRLINES</Banner></OperatingAirline><OperatingAirlinePricing Code="PR"/><DisclosureCarrier Code="PR"><Banner>PHILIPPINE AIRLINES</Banner></DisclosureCarrier><OriginLocation LocationCode="MNL" Terminal="TERMINAL 1" TerminalCode="1"/><UpdatedArrivalTime>05-25T23:15</UpdatedArrivalTime><UpdatedDepartureTime>05-25T19:40</UpdatedDepartureTime></FlightSegment></Item></ReservationItems></ItineraryInfo><ItineraryRef AirExtras="false" InhibitCode="U" PartitionID="AA" PrimeHostID="1S"><Source PseudoCityCode="6IIF"/></ItineraryRef></TravelItinerary></TravelItineraryReadRS></EnhancedAirBookRS></soap-env:Body></soap-env:Envelope>'),
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
				departureDate: {
					raw: '05-20T01:45',
					parsed: '05-20',
				},
				destinationDate: {
					raw: '05-21T06:15',
					parsed: '05-21',
				},
				airline: 'PR',
				flightNumber: '0127',
				bookingClass: 'C',
				destinationAirport: 'MNL',
				departureAirport: 'JFK',
				segmentStatus: 'GK',
				seatCount: '001',
				eticket: true,
			}, {
				departureDate: {
					raw: '05-25T19:40',
					parsed: '05-25',
				},
				destinationDate: {
					raw: '05-25T23:15',
					parsed: '05-25',
				},
				airline: 'PR',
				flightNumber: '0126',
				bookingClass: 'C',
				destinationAirport: 'JFK',
				departureAirport: 'MNL',
				segmentStatus: 'GK',
				seatCount: '001',
				eticket: true,
			}],
			reservations: [{
				segmentNumber: 1,
				departureDate: {
					raw: '2020-05-20T01:45',
					parsed: '05-20',
				},
				destinationDate: {
					raw: '05-21T06:15',
					parsed: '05-21',
				},
				airline: 'PR',
				flightNumber: '0127',
				bookingClass: 'C',
				destinationAirport: 'MNL',
				departureAirport: 'JFK',
				segmentStatus: 'GK',
				seatCount: '01',
				eticket: true,
			}, {
				segmentNumber: 2,
				departureDate: {
					raw: '2020-05-25T19:40',
					parsed: '05-25',
				},
				destinationDate: {
					raw: '05-25T23:15',
					parsed: '05-25',
				},
				airline: 'PR',
				flightNumber: '0126',
				bookingClass: 'C',
				destinationAirport: 'JFK',
				departureAirport: 'MNL',
				segmentStatus: 'GK',
				seatCount: '01',
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
				departureDate: {
					raw: '05-20T01:45',
					parsed: '05-20',
				},
				destinationDate: {
					raw: '05-21T06:15',
					parsed: '05-21',
				},
				airline: 'PR',
				flightNumber: '0127',
				bookingClass: 'C',
				destinationAirport: 'MNL',
				departureAirport: 'JFK',
				segmentStatus: 'GK',
				seatCount: '001',
				eticket: true,
			}],
			error: 'Failed to add segments starting from #2',
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
				departureDate: {
					raw: '05-20T01:45',
					parsed: '05-20',
				},
				destinationDate: {
					raw: '05-21T06:15',
					parsed: '05-21',
				},
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

	//  1.1OTUWA/EMMANUEL NWANKWO
	//  6 UA9002T 19AUG M FRAPHC HX1  1115A  615P HRS /DCUA*K5ZEQP /E
	// OPERATED BY LUFTHANSA
	// FRA CHECK-IN WITH LUFTHANSA
	//  7  OTH YY 10JAN F GK1  XXX/PRESERVEPNR
	//  8  OTH YY 15FEB J GK1  XXX/PRESERVEPNR
	list.push({
		title: 'Test xml response with non flight segments in reservation element (2 OTH segments)',
		input: {
			xml: parseXml('<?xml version="1.0" encoding="UTF-8"?><soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"><soap-env:Header><eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader"><eb:From><eb:PartyId eb:type="urn:x12.org:IO5:01">webservices.sabre.com/websvc</eb:PartyId></eb:From><eb:To><eb:PartyId eb:type="urn:x12.org:IO5:01">innogw.dyninno.net</eb:PartyId></eb:To><eb:CPAId>L3II</eb:CPAId><eb:ConversationId>2019-02-22T19:07:04@innogateway5c7048587a71aPID4209</eb:ConversationId><eb:Service eb:type="OTA">EnhancedAirBookRQ</eb:Service><eb:Action>EnhancedAirBookRS</eb:Action><eb:MessageData><eb:MessageId>20z93nib0</eb:MessageId><eb:Timestamp>2019-08-20T14:50:08</eb:Timestamp><eb:RefToMessageId>1876459793</eb:RefToMessageId></eb:MessageData></eb:MessageHeader><wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"><wsse:BinarySecurityToken EncodingType="wsse:Base64Binary" valueType="String">Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/RESG!ICESMSLB\/RES.LB!-2983111861065286004!940630!0</wsse:BinarySecurityToken></wsse:Security></soap-env:Header><soap-env:Body><EnhancedAirBookRS xmlns="http://services.sabre.com/sp/eab/v3_9"><ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01"><Success timeStamp="2019-08-20T09:50:08.136-05:00"/></ApplicationResults><OTA_AirBookRS><OriginDestinationOption><FlightSegment ArrivalDateTime="09-10T14:34" DepartureDateTime="09-10T11:40" FlightNumber="1260" NumberInParty="001" ResBookDesigCode="Q" Status="GK" eTicket="true"><DestinationLocation LocationCode="DEN"/><MarketingAirline Code="UA" FlightNumber="1260"/><OriginLocation LocationCode="LAS"/></FlightSegment></OriginDestinationOption></OTA_AirBookRS><TravelItineraryReadRS><TravelItinerary><AccountingInfo><Airline Code="UA"/><BaseFare Amount="1323.00" CurrencyCode="USD"/><DocumentInfo><Document Number="7356544419"/></DocumentInfo><FareApplication>ONE</FareApplication><PaymentInfo><Commission Amount=".00"/><Payment><Form>CA</Form></Payment></PaymentInfo><PersonName NameNumber="1.1">OTUWA EMMANUEL NWANKWO</PersonName><Taxes><Tax Amount="933.33"/></Taxes><TicketingInfo><eTicket Ind="true"/><Exchange Ind="false"/><TariffBasis>F</TariffBasis><Ticketing ConjunctedCount="2"/></TicketingInfo></AccountingInfo><CustomerInfo><ContactNumbers><ContactNumber LocationCode="SFO" Phone="800-800-800" RPH="001"/></ContactNumbers><PaymentInfo><Payment><Form RPH="002"><Text>CK</Text></Form></Payment></PaymentInfo><PersonName NameNumber="01.01" PassengerType="ADT" RPH="1" WithInfant="false" elementId="pnr-9.1"><GivenName>EMMANUEL NWANKWO</GivenName><Surname>OTUWA</Surname></PersonName></CustomerInfo><ItineraryInfo><ItineraryPricing><PriceQuote RPH="1"><MiscInformation><BaggageFees><Text>BAG ALLOWANCE     -PHCLAS-02P/LH/EACH PIECE UP TO 50 POUNDS/23</Text><Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text><Text>BAG ALLOWANCE     -LASPHC-02P/LH/EACH PIECE UP TO 50 POUNDS/23</Text></BaggageFees><GlobalNetRemit><NetFare><BaseFare/><EquivFare/><Taxes/><TotalFare Amount="0.00"/></NetFare><SellingFare><BaseFare/><EquivFare/><Taxes/><TotalFare Amount="0.00"/></SellingFare><Text>BT</Text></GlobalNetRemit><SignatureLine CommissionAmount="0" CommissionID="A" ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE"><Text>6IIF 6IIF*AAB 1245/17MAY19</Text></SignatureLine></MiscInformation><PricedItinerary DisplayOnly="false" InputMessage="WPPJCB¥K0¥ETR¥RQ" RPH="1" StatusCode="A" StoredDateTime="2019-05-16T12:49" TaxExempt="false" ValidatingCarrier="UA"><AirItineraryPricingInfo><ItinTotalFare><BaseFare Amount="1323.00" CurrencyCode="USD"/><Taxes><Tax Amount="933.33" TaxCode="XT"/><TaxBreakdownCode TaxPaid="false">618.60YQ</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">37.20US</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">5.77YC</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">7.00XY</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">3.96XA</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">11.20AY</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">97.10NG</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">50.00QT</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">20.00TE</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">21.20DE</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">47.80RA</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">13.50XF</TaxBreakdownCode></Taxes><TotalFare Amount="2256.33" CurrencyCode="USD"/><Totals><BaseFare Amount="1323.00"/><Taxes><Tax Amount="933.33"/></Taxes><TotalFare Amount="2256.33"/></Totals></ItinTotalFare><PassengerTypeQuantity Code="JCB" Quantity="01"/><PrivateFareInformation PrivateFareType="@"><Text>@</Text></PrivateFareInformation><PTC_FareBreakdown><Endorsements><Endorsement type="PRICING_PARAMETER"><Text>WPPJCB$K0$ETR$RQ</Text></Endorsement><Endorsement type="WARNING"><Text>PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING</Text></Endorsement><Endorsement type="WARNING"><Text>VALIDATING CARRIER - UA</Text></Endorsement><Endorsement type="SYSTEM_ENDORSEMENT"><Text>REFTHRUAG/NONEND/NONRERTE/LH/UA/AC/OS/SN/LX ONLY</Text></Endorsement><Endorsement type="PRIVATE_FARE"><Text>PRIVATE @</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>BAG ALLOWANCE     -PHCLAS-02P/LH/EACH PIECE UP TO 50 POUNDS/23</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>BAG ALLOWANCE     -LASPHC-02P/LH/EACH PIECE UP TO 50 POUNDS/23</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>CARRY ON ALLOWANCE</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>PHCFRA FRAIAH IAHFRA FRAPHC-01P/LH</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>01/UP TO 18 POUNDS/8 KILOGRAMS AND UP TO 46 LINEAR INCHES/118 L</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>INEAR CENTIMETERS</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>IAHLAS LASIAH-01P/UA</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>01/CARRY ON HAND BAGGAGE</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>CARRY ON CHARGES</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>PHCFRA FRAIAH IAHFRA FRAPHC-LH</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>UP TO 18 POUNDS/8 KILOGRAMS AND UP TO 46 LINEAR INCHES/118 LINE</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>AR CENTIMETERS-NOT PERMITTED</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>IAHLAS LASIAH-UA-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text></Endorsement></Endorsements><FareBasis Code="LLRCNGW/CN10/LLRCNGW/CN10/LLRCNGW/CN10/LHRCNGW/CN10/LHRCNGW/CN10/LHRCNGW/CN10"/><FareCalculation><Text>PHC LH X/FRA LH X/HOU UA LAS571.50UA X/HOU LH X/FRA LH PHC751.50NUC1323.00END ROE1.00 XFIAH4.5LAS4.5IAH4.5</Text></FareCalculation><FareSource>ATPC</FareSource><FlightSegment ConnectionInd="O" DepartureDateTime="05-28T20:00" FlightNumber="595" ResBookDesigCode="L" SegmentNumber="1" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LLRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="595"/><OriginLocation LocationCode="PHC"/><ValidityDates><NotValidAfter>2019-05-28</NotValidAfter><NotValidBefore>2019-05-28</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="05-29T10:00" FlightNumber="440" ResBookDesigCode="L" SegmentNumber="2" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LLRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="440"/><OriginLocation LocationCode="FRA"/><ValidityDates><NotValidAfter>2019-05-29</NotValidAfter><NotValidBefore>2019-05-29</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="05-29T20:10" FlightNumber="2115" ResBookDesigCode="L" SegmentNumber="3" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LLRCNGW/CN10"/><MarketingAirline Code="UA" FlightNumber="2115"/><OriginLocation LocationCode="IAH"/><ValidityDates><NotValidAfter>2019-05-29</NotValidAfter><NotValidBefore>2019-05-29</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="O" DepartureDateTime="07-13T06:00" FlightNumber="2276" ResBookDesigCode="L" SegmentNumber="4" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LHRCNGW/CN10"/><MarketingAirline Code="UA" FlightNumber="2276"/><OriginLocation LocationCode="LAS"/><ValidityDates><NotValidAfter>2019-07-13</NotValidAfter><NotValidBefore>2019-07-13</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="07-13T15:55" FlightNumber="441" ResBookDesigCode="L" SegmentNumber="5" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LHRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="441"/><OriginLocation LocationCode="IAH"/><ValidityDates><NotValidAfter>2019-07-13</NotValidAfter><NotValidBefore>2019-07-13</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="07-14T11:15" FlightNumber="594" ResBookDesigCode="L" SegmentNumber="6" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LHRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="594"/><OriginLocation LocationCode="FRA"/><ValidityDates><NotValidAfter>2019-07-14</NotValidAfter><NotValidBefore>2019-07-14</NotValidBefore></ValidityDates></FlightSegment><FlightSegment><OriginLocation LocationCode="PHC"/></FlightSegment><FareComponent Amount="57150" FareBasisCode="LLRCNGW/CN10" FareDirectionality="FROM" GoverningCarrier="LH" TicketDesignator="CN10"><Location Destination="LAS" Origin="PHC"/><Dates ArrivalDateTime="05-29T21:31" DepartureDateTime="05-28T20:00"/></FareComponent><FareComponent Amount="75150" FareBasisCode="LHRCNGW/CN10" FareDirectionality="TO" GoverningCarrier="LH" TicketDesignator="CN10"><Location Destination="PHC" Origin="LAS"/><Dates ArrivalDateTime="07-14T18:15" DepartureDateTime="07-13T06:00"/></FareComponent><ResTicketingRestrictions>LAST DAY TO PURCHASE 19MAY/1249</ResTicketingRestrictions><ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 19MAY</ResTicketingRestrictions><TourCode><Text>BT294UA</Text></TourCode></PTC_FareBreakdown></AirItineraryPricingInfo><NetTicketingInfo><SellingFareDetails><BaseFare Amount="1323.00" CurrencyCode="USD"/><TotalTax Amount="933.33" CurrencyCode="USD"/><TotalFare Amount="2256.33" CurrencyCode="USD"/><Commission Amount="0.00" CurrencyCode="USD"><Percent Type="">0</Percent></Commission><FareCalc>PHC LH X/FRA LH X/HOU UA LAS571.50UA X/HOU LH X/FRA LH PHC751.50NUC1323.00END ROE1.00 XFIAH4.5LAS4.5IAH4.5</FareCalc><Taxes><Tax Amount="618.60" Exempt="false" TaxCode="YQ"/><Tax Amount="37.20" Exempt="false" TaxCode="US"/><Tax Amount="5.77" Exempt="false" TaxCode="YC"/><Tax Amount="7.00" Exempt="false" TaxCode="XY"/><Tax Amount="3.96" Exempt="false" TaxCode="XA"/><Tax Amount="11.20" Exempt="false" TaxCode="AY"/><Tax Amount="97.10" Exempt="false" TaxCode="NG"/><Tax Amount="50.00" Exempt="false" TaxCode="QT"/><Tax Amount="20.00" Exempt="false" TaxCode="TE"/><Tax Amount="21.20" Exempt="false" TaxCode="DE"/><Tax Amount="47.80" Exempt="false" TaxCode="RA"/><Tax Amount="13.50" Exempt="false" TaxCode="XF"/></Taxes></SellingFareDetails></NetTicketingInfo></PricedItinerary><ResponseHeader><Text>FARE - PRICE RETAINED</Text><Text>FARE NOT GUARANTEED UNTIL TICKETED</Text></ResponseHeader><PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="IT" ItineraryChanged="true" ManualFare="false" NUCSuppresion="false" NegotiatedFare="true" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" TourCode="BT294UA" VerifyFareCalc="false"><PassengerInfo PassengerType="JCB"><PassengerData NameNumber="01.01">OTUWA/EMMANUEL NWANKWO</PassengerData></PassengerInfo><TicketingInstructionsInfo/></PriceQuotePlus></PriceQuote><PriceQuote RPH="2"><MiscInformation><SignatureLine CommissionAmount="0.00" CommissionID="A" ExpirationDateTime="00:00" PQR_Ind="Y" Source="AGT" Status="ACTIVE"><Text>6IIF 6IIF*AMK 0829/23JUL19</Text></SignatureLine></MiscInformation><PricedItinerary DisplayOnly="false" InputMessage="WFR0XXXXXXXX4419¥PJCB¥K0¥AUA" RPH="2" StatusCode="A" StoredDateTime="2019-05-16T12:49" TaxExempt="false" ValidatingCarrier="UA"><AirItineraryPricingInfo><ItinTotalFare><BaseFare Amount="1368.00" CurrencyCode="USD"/><Taxes><Tax Amount="937.83" TaxCode="XT"/><TaxBreakdownCode TaxPaid="false">618.60YQ</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">37.20US</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">5.77YC</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">7.00XY</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">3.96XA</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">11.20AY</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">97.10NG</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">50.00QT</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">20.00TE</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">21.20DE</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">47.80RA</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">18.00XF</TaxBreakdownCode></Taxes><TotalFare Amount="2305.83" CurrencyCode="USD"/><Totals><BaseFare Amount="1368.00"/><Taxes><Tax Amount="937.83"/></Taxes><TotalFare Amount="2305.83"/></Totals></ItinTotalFare><PassengerTypeQuantity Code="JCB" Quantity="01"/><PTC_FareBreakdown><Endorsements><Endorsement type="PRICING_PARAMETER"><Text>WFR0XXXXXXXX4419$PJCB$K0$AUA</Text></Endorsement></Endorsements><FareBasis Code="LLRCNGW/CN10/LLRCNGW/CN10/LLTCNGW/CN10/THRCNGW/CN10/THRCNGW/CN10/THRCNGW/CN10"/><FareCalculation><Text>PHC LH X/FRA LH X/HOU UA LAS571.50LLTCNGW/CN10 UA X/DEN UA X/FRA UA PHC796.50THRCNGW/CN10 NUC1368.00END ROE1.00 XFIAH4.5LAS4.5IAH4.5DEN4.5</Text></FareCalculation><FlightSegment ConnectionInd=" " DepartureDateTime="05-28T20:00" FlightNumber="595" ResBookDesigCode="L" SegmentNumber="0" Status="OK"><FareBasis Code="LLRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="595"/><OriginLocation LocationCode="PHC"/></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="05-29T10:00" FlightNumber="440" ResBookDesigCode="L" SegmentNumber="0" Status="OK"><FareBasis Code="LLRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="440"/><OriginLocation LocationCode="FRA"/></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="05-29T20:10" FlightNumber="2115" ResBookDesigCode="L" SegmentNumber="0" Status="OK"><FareBasis Code="LLTCNGW/CN10"/><MarketingAirline Code="UA" FlightNumber="2115"/><OriginLocation LocationCode="IAH"/></FlightSegment><FlightSegment ConnectionInd="O" DepartureDateTime="08-18T11:34" FlightNumber="1260" ResBookDesigCode="T" SegmentNumber="0" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="THRCNGW/CN10"/><MarketingAirline Code="UA" FlightNumber="1260"/><OriginLocation LocationCode="LAS"/><ValidityDates><NotValidAfter>2019-08-18</NotValidAfter><NotValidBefore>2019-08-18</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="08-18T15:45" FlightNumber="0182" ResBookDesigCode="T" SegmentNumber="0" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="THRCNGW/CN10"/><MarketingAirline Code="UA" FlightNumber="182"/><OriginLocation LocationCode="DEN"/><ValidityDates><NotValidAfter>2019-08-18</NotValidAfter><NotValidBefore>2019-08-18</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="08-19T11:15" FlightNumber="0594" ResBookDesigCode="T" SegmentNumber="0" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="THRCNGW/CN10"/><MarketingAirline Code="UA" FlightNumber="9002"/><OriginLocation LocationCode="FRA"/><ValidityDates><NotValidAfter>2019-08-19</NotValidAfter><NotValidBefore>2019-08-19</NotValidBefore></ValidityDates></FlightSegment><FlightSegment><OriginLocation LocationCode="PHC"/></FlightSegment><FareComponent Amount="57150" FareBasisCode="LLRCNGW" FareDirectionality="TO" GoverningCarrier="LH" TicketDesignator="CN10"><Location Destination="LAS" Origin="PHC"/><Dates ArrivalDateTime="05-29T21:31" DepartureDateTime="05-28T20:00"/></FareComponent><FareComponent Amount="79650" FareBasisCode="THRCNGW" FareDirectionality="TO" GoverningCarrier="UA" TicketDesignator="CN10"><Location Destination="PHC" Origin="LAS"/><Dates ArrivalDateTime="08-19T18:15" DepartureDateTime="08-18T11:34"/></FareComponent></PTC_FareBreakdown></AirItineraryPricingInfo></PricedItinerary><ResponseHeader><Text>FARE - PRICE RETAINED</Text><Text>FARE NOT GUARANTEED UNTIL TICKETED</Text></ResponseHeader><PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="A" SubjToGovtApproval="false" SystemIndicator="A" VerifyFareCalc="false"><PassengerInfo PassengerType="JCB"><PassengerData NameNumber="01.01">OTUWA/EMMANUEL NWANKWO</PassengerData></PassengerInfo><TicketingInstructionsInfo/></PriceQuotePlus></PriceQuote><PriceQuote RPH="3"><MiscInformation><BaggageFees><Text>BAG ALLOWANCE     -PHCLAS-02P/LH/EACH PIECE UP TO 50 POUNDS/23</Text><Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text><Text>BAG ALLOWANCE     -LASPHC-02P/LH/EACH PIECE UP TO 50 POUNDS/23</Text><Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text><Text>CARRY ON ALLOWANCE</Text><Text>PHCFRA FRAIAH IAHFRA FRAPHC-01P/LH</Text><Text>01/UP TO 18 POUNDS/8 KILOGRAMS AND UP TO 46 LINEAR INCHES/118 L</Text><Text>INEAR CENTIMETERS</Text><Text>IAHLAS LASIAH-01P/UA</Text><Text>01/CARRY ON HAND BAGGAGE</Text><Text>01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text><Text>CARRY ON CHARGES</Text><Text>PHCFRA FRAIAH IAHFRA FRAPHC-LH</Text><Text>UP TO 18 POUNDS/8 KILOGRAMS AND UP TO 46 LINEAR INCHES/118 LINE</Text><Text>AR CENTIMETERS-NOT PERMITTED</Text><Text>IAHLAS LASIAH-UA-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text><Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text><Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text><Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text></BaggageFees><GlobalNetRemit><NetFare><BaseFare/><EquivFare/><Taxes/><TotalFare Amount="0.00"/></NetFare><SellingFare><BaseFare/><EquivFare/><Taxes/><TotalFare Amount="0.00"/></SellingFare><Text>BT</Text></GlobalNetRemit><SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="HISTORY"><Text>6IIF L3II*AWS 1249/16MAY19</Text></SignatureLine></MiscInformation><PricedItinerary DisplayOnly="false" InputMessage="WPRQ¥PJCB" RPH="1" StatusCode="A" StoredDateTime="2019-05-16T12:49" TaxExempt="false" ValidatingCarrier="UA"><AirItineraryPricingInfo><ItinTotalFare><BaseFare Amount="1323.00" CurrencyCode="USD"/><Taxes><Tax Amount="934.33" TaxCode="XT"/><TaxBreakdownCode TaxPaid="false">619.40YQ</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">37.20US</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">5.77YC</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">7.00XY</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">3.96XA</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">11.20AY</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">97.10NG</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">50.00QT</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">20.00TE</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">21.40DE</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">47.80RA</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">13.50XF</TaxBreakdownCode></Taxes><TotalFare Amount="2257.33" CurrencyCode="USD"/><Totals><BaseFare Amount="1323.00"/><Taxes><Tax Amount="934.33"/></Taxes><TotalFare Amount="2257.33"/></Totals></ItinTotalFare><PassengerTypeQuantity Code="JCB" Quantity="01"/><PrivateFareInformation PrivateFareType="@"><Text>@</Text></PrivateFareInformation><PTC_FareBreakdown><Endorsements><Endorsement type="PRICING_PARAMETER"><Text>WPRQ$PJCB</Text></Endorsement><Endorsement type="WARNING"><Text>PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING</Text></Endorsement><Endorsement type="WARNING"><Text>VALIDATING CARRIER - UA</Text></Endorsement><Endorsement type="SYSTEM_ENDORSEMENT"><Text>REFTHRUAG/NONEND/NONRERTE/LH/UA/AC/OS/SN/LX ONLY</Text></Endorsement><Endorsement type="PRIVATE_FARE"><Text>PRIVATE @</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>BAG ALLOWANCE     -PHCLAS-02P/LH/EACH PIECE UP TO 50 POUNDS/23</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>BAG ALLOWANCE     -LASPHC-02P/LH/EACH PIECE UP TO 50 POUNDS/23</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>CARRY ON ALLOWANCE</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>PHCFRA FRAIAH IAHFRA FRAPHC-01P/LH</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>01/UP TO 18 POUNDS/8 KILOGRAMS AND UP TO 46 LINEAR INCHES/118 L</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>INEAR CENTIMETERS</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>IAHLAS LASIAH-01P/UA</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>01/CARRY ON HAND BAGGAGE</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>CARRY ON CHARGES</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>PHCFRA FRAIAH IAHFRA FRAPHC-LH</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>UP TO 18 POUNDS/8 KILOGRAMS AND UP TO 46 LINEAR INCHES/118 LINE</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>AR CENTIMETERS-NOT PERMITTED</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>IAHLAS LASIAH-UA-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text></Endorsement></Endorsements><FareBasis Code="LLRCNGW/CN10/LLRCNGW/CN10/LLRCNGW/CN10/LHRCNGW/CN10/LHRCNGW/CN10/LHRCNGW/CN10"/><FareCalculation><Text>PHC LH X/FRA LH X/HOU UA LAS571.50UA X/HOU LH X/FRA LH PHC751.50NUC1323.00END ROE1.00 XFIAH4.5LAS4.5IAH4.5</Text></FareCalculation><FareSource>ATPC</FareSource><FlightSegment ConnectionInd="O" DepartureDateTime="05-28T20:00" FlightNumber="595" ResBookDesigCode="L" SegmentNumber="1" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LLRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="595"/><OriginLocation LocationCode="PHC"/><ValidityDates><NotValidAfter>2019-05-28</NotValidAfter><NotValidBefore>2019-05-28</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="05-29T10:00" FlightNumber="440" ResBookDesigCode="L" SegmentNumber="2" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LLRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="440"/><OriginLocation LocationCode="FRA"/><ValidityDates><NotValidAfter>2019-05-29</NotValidAfter><NotValidBefore>2019-05-29</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="05-29T20:10" FlightNumber="2115" ResBookDesigCode="L" SegmentNumber="3" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LLRCNGW/CN10"/><MarketingAirline Code="UA" FlightNumber="2115"/><OriginLocation LocationCode="IAH"/><ValidityDates><NotValidAfter>2019-05-29</NotValidAfter><NotValidBefore>2019-05-29</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="O" DepartureDateTime="07-13T06:00" FlightNumber="2276" ResBookDesigCode="L" SegmentNumber="4" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LHRCNGW/CN10"/><MarketingAirline Code="UA" FlightNumber="2276"/><OriginLocation LocationCode="LAS"/><ValidityDates><NotValidAfter>2019-07-13</NotValidAfter><NotValidBefore>2019-07-13</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="07-13T15:55" FlightNumber="441" ResBookDesigCode="L" SegmentNumber="5" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LHRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="441"/><OriginLocation LocationCode="IAH"/><ValidityDates><NotValidAfter>2019-07-13</NotValidAfter><NotValidBefore>2019-07-13</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="07-14T11:15" FlightNumber="594" ResBookDesigCode="L" SegmentNumber="6" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LHRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="594"/><OriginLocation LocationCode="FRA"/><ValidityDates><NotValidAfter>2019-07-14</NotValidAfter><NotValidBefore>2019-07-14</NotValidBefore></ValidityDates></FlightSegment><FlightSegment><OriginLocation LocationCode="PHC"/></FlightSegment><FareComponent Amount="57150" FareBasisCode="LLRCNGW/CN10" FareDirectionality="FROM" GoverningCarrier="LH" TicketDesignator="CN10"><Location Destination="LAS" Origin="PHC"/><Dates ArrivalDateTime="05-29T21:31" DepartureDateTime="05-28T20:00"/></FareComponent><FareComponent Amount="75150" FareBasisCode="LHRCNGW/CN10" FareDirectionality="TO" GoverningCarrier="LH" TicketDesignator="CN10"><Location Destination="PHC" Origin="LAS"/><Dates ArrivalDateTime="07-14T18:15" DepartureDateTime="07-13T06:00"/></FareComponent><ResTicketingRestrictions>LAST DAY TO PURCHASE 19MAY/1249</ResTicketingRestrictions><ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 19MAY</ResTicketingRestrictions><TourCode><Text>BT294UA</Text></TourCode></PTC_FareBreakdown></AirItineraryPricingInfo><NetTicketingInfo><SellingFareDetails><BaseFare Amount="1323.00" CurrencyCode="USD"/><TotalTax Amount="934.33" CurrencyCode="USD"/><TotalFare Amount="2257.33" CurrencyCode="USD"/><FareCalc>PHC LH X/FRA LH X/HOU UA LAS571.50UA X/HOU LH X/FRA LH PHC751.50NUC1323.00END ROE1.00 XFIAH4.5LAS4.5IAH4.5</FareCalc><Taxes><Tax Amount="619.40" Exempt="false" TaxCode="YQ"/><Tax Amount="37.20" Exempt="false" TaxCode="US"/><Tax Amount="5.77" Exempt="false" TaxCode="YC"/><Tax Amount="7.00" Exempt="false" TaxCode="XY"/><Tax Amount="3.96" Exempt="false" TaxCode="XA"/><Tax Amount="11.20" Exempt="false" TaxCode="AY"/><Tax Amount="97.10" Exempt="false" TaxCode="NG"/><Tax Amount="50.00" Exempt="false" TaxCode="QT"/><Tax Amount="20.00" Exempt="false" TaxCode="TE"/><Tax Amount="21.40" Exempt="false" TaxCode="DE"/><Tax Amount="47.80" Exempt="false" TaxCode="RA"/><Tax Amount="13.50" Exempt="false" TaxCode="XF"/></Taxes></SellingFareDetails></NetTicketingInfo></PricedItinerary><ResponseHeader><Text>FARE - PRICE RETAINED</Text><Text>FARE NOT GUARANTEED UNTIL TICKETED</Text></ResponseHeader><PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="IT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="true" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" TourCode="BT294UA" VerifyFareCalc="false"><TicketingInstructionsInfo/></PriceQuotePlus></PriceQuote><PriceQuote RPH="4"><MiscInformation><BaggageFees><Text>BAG ALLOWANCE     -PHCLAS-02P/LH/EACH PIECE UP TO 50 POUNDS/23</Text><Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text><Text>BAG ALLOWANCE     -LASPHC-02P/LH/EACH PIECE UP TO 50 POUNDS/23</Text><Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text><Text>CARRY ON ALLOWANCE</Text><Text>PHCFRA FRAIAH IAHFRA FRAPHC-01P/LH</Text><Text>01/UP TO 18 POUNDS/8 KILOGRAMS AND UP TO 46 LINEAR INCHES/118 L</Text><Text>INEAR CENTIMETERS</Text><Text>IAHLAS LASIAH-01P/UA</Text><Text>01/CARRY ON HAND BAGGAGE</Text><Text>01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text><Text>CARRY ON CHARGES</Text><Text>PHCFRA FRAIAH IAHFRA FRAPHC-LH</Text><Text>UP TO 18 POUNDS/8 KILOGRAMS AND UP TO 46 LINEAR INCHES/118 LINE</Text><Text>AR CENTIMETERS-NOT PERMITTED</Text><Text>IAHLAS LASIAH-UA-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text><Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text><Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text><Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text></BaggageFees><GlobalNetRemit><NetFare><BaseFare/><EquivFare/><Taxes/><TotalFare Amount="0.00"/></NetFare><SellingFare><BaseFare/><EquivFare/><Taxes/><TotalFare Amount="0.00"/></SellingFare><Text>BT</Text></GlobalNetRemit><SignatureLine CommissionAmount="0" CommissionID="P" ExpirationDateTime="00:00" Source="SYS" Status="HISTORY"><Text>6IIF L3II*AWS 1303/16MAY19</Text></SignatureLine></MiscInformation><PricedItinerary DisplayOnly="false" InputMessage="WPN1.1¥PJCB¥PV¥KP0¥ETR¥RQ" RPH="1" StatusCode="A" StoredDateTime="2019-05-16T12:49" TaxExempt="false" ValidatingCarrier="UA"><AirItineraryPricingInfo><ItinTotalFare><BaseFare Amount="1323.00" CurrencyCode="USD"/><Taxes><Tax Amount="934.33" TaxCode="XT"/><TaxBreakdownCode TaxPaid="false">619.40YQ</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">37.20US</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">5.77YC</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">7.00XY</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">3.96XA</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">11.20AY</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">97.10NG</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">50.00QT</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">20.00TE</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">21.40DE</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">47.80RA</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">13.50XF</TaxBreakdownCode></Taxes><TotalFare Amount="2257.33" CurrencyCode="USD"/><Totals><BaseFare Amount="1323.00"/><Taxes><Tax Amount="934.33"/></Taxes><TotalFare Amount="2257.33"/></Totals></ItinTotalFare><PassengerTypeQuantity Code="JCB" Quantity="01"/><PrivateFareInformation PrivateFareType="@"><Text>@</Text></PrivateFareInformation><PTC_FareBreakdown><Endorsements><Endorsement type="PRICING_PARAMETER"><Text>WPN1.1$PJCB$PV$KP0$ETR$RQ</Text></Endorsement><Endorsement type="WARNING"><Text>PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING</Text></Endorsement><Endorsement type="WARNING"><Text>VALIDATING CARRIER - UA</Text></Endorsement><Endorsement type="SYSTEM_ENDORSEMENT"><Text>REFTHRUAG/NONEND/NONRERTE/LH/UA/AC/OS/SN/LX ONLY</Text></Endorsement><Endorsement type="PRIVATE_FARE"><Text>PRIVATE @</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>BAG ALLOWANCE     -PHCLAS-02P/LH/EACH PIECE UP TO 50 POUNDS/23</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>BAG ALLOWANCE     -LASPHC-02P/LH/EACH PIECE UP TO 50 POUNDS/23</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>CARRY ON ALLOWANCE</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>PHCFRA FRAIAH IAHFRA FRAPHC-01P/LH</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>01/UP TO 18 POUNDS/8 KILOGRAMS AND UP TO 46 LINEAR INCHES/118 L</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>INEAR CENTIMETERS</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>IAHLAS LASIAH-01P/UA</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>01/CARRY ON HAND BAGGAGE</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>CARRY ON CHARGES</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>PHCFRA FRAIAH IAHFRA FRAPHC-LH</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>UP TO 18 POUNDS/8 KILOGRAMS AND UP TO 46 LINEAR INCHES/118 LINE</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>AR CENTIMETERS-NOT PERMITTED</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>IAHLAS LASIAH-UA-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text></Endorsement></Endorsements><FareBasis Code="LLRCNGW/CN10/LLRCNGW/CN10/LLRCNGW/CN10/LHRCNGW/CN10/LHRCNGW/CN10/LHRCNGW/CN10"/><FareCalculation><Text>PHC LH X/FRA LH X/HOU UA LAS571.50UA X/HOU LH X/FRA LH PHC751.50NUC1323.00END ROE1.00 XFIAH4.5LAS4.5IAH4.5</Text></FareCalculation><FareSource>ATPC</FareSource><FlightSegment ConnectionInd="O" DepartureDateTime="05-28T20:00" FlightNumber="595" ResBookDesigCode="L" SegmentNumber="1" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LLRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="595"/><OriginLocation LocationCode="PHC"/><ValidityDates><NotValidAfter>2019-05-28</NotValidAfter><NotValidBefore>2019-05-28</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="05-29T10:00" FlightNumber="440" ResBookDesigCode="L" SegmentNumber="2" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LLRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="440"/><OriginLocation LocationCode="FRA"/><ValidityDates><NotValidAfter>2019-05-29</NotValidAfter><NotValidBefore>2019-05-29</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="05-29T20:10" FlightNumber="2115" ResBookDesigCode="L" SegmentNumber="3" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LLRCNGW/CN10"/><MarketingAirline Code="UA" FlightNumber="2115"/><OriginLocation LocationCode="IAH"/><ValidityDates><NotValidAfter>2019-05-29</NotValidAfter><NotValidBefore>2019-05-29</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="O" DepartureDateTime="07-13T06:00" FlightNumber="2276" ResBookDesigCode="L" SegmentNumber="4" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LHRCNGW/CN10"/><MarketingAirline Code="UA" FlightNumber="2276"/><OriginLocation LocationCode="LAS"/><ValidityDates><NotValidAfter>2019-07-13</NotValidAfter><NotValidBefore>2019-07-13</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="07-13T15:55" FlightNumber="441" ResBookDesigCode="L" SegmentNumber="5" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LHRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="441"/><OriginLocation LocationCode="IAH"/><ValidityDates><NotValidAfter>2019-07-13</NotValidAfter><NotValidBefore>2019-07-13</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="07-14T11:15" FlightNumber="594" ResBookDesigCode="L" SegmentNumber="6" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LHRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="594"/><OriginLocation LocationCode="FRA"/><ValidityDates><NotValidAfter>2019-07-14</NotValidAfter><NotValidBefore>2019-07-14</NotValidBefore></ValidityDates></FlightSegment><FlightSegment><OriginLocation LocationCode="PHC"/></FlightSegment><FareComponent Amount="57150" FareBasisCode="LLRCNGW/CN10" FareDirectionality="FROM" GoverningCarrier="LH" TicketDesignator="CN10"><Location Destination="LAS" Origin="PHC"/><Dates ArrivalDateTime="05-29T21:31" DepartureDateTime="05-28T20:00"/></FareComponent><FareComponent Amount="75150" FareBasisCode="LHRCNGW/CN10" FareDirectionality="TO" GoverningCarrier="LH" TicketDesignator="CN10"><Location Destination="PHC" Origin="LAS"/><Dates ArrivalDateTime="07-14T18:15" DepartureDateTime="07-13T06:00"/></FareComponent><ResTicketingRestrictions>LAST DAY TO PURCHASE 19MAY/1249</ResTicketingRestrictions><ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 19MAY</ResTicketingRestrictions><TourCode><Text>BT294UA</Text></TourCode></PTC_FareBreakdown></AirItineraryPricingInfo><NetTicketingInfo><SellingFareDetails><BaseFare Amount="1323.00" CurrencyCode="USD"/><TotalTax Amount="934.33" CurrencyCode="USD"/><TotalFare Amount="2257.33" CurrencyCode="USD"/><Commission Amount="0.00" CurrencyCode="USD"><Percent Type="GROSS">0</Percent></Commission><FareCalc>PHC LH X/FRA LH X/HOU UA LAS571.50UA X/HOU LH X/FRA LH PHC751.50NUC1323.00END ROE1.00 XFIAH4.5LAS4.5IAH4.5</FareCalc><Taxes><Tax Amount="619.40" Exempt="false" TaxCode="YQ"/><Tax Amount="37.20" Exempt="false" TaxCode="US"/><Tax Amount="5.77" Exempt="false" TaxCode="YC"/><Tax Amount="7.00" Exempt="false" TaxCode="XY"/><Tax Amount="3.96" Exempt="false" TaxCode="XA"/><Tax Amount="11.20" Exempt="false" TaxCode="AY"/><Tax Amount="97.10" Exempt="false" TaxCode="NG"/><Tax Amount="50.00" Exempt="false" TaxCode="QT"/><Tax Amount="20.00" Exempt="false" TaxCode="TE"/><Tax Amount="21.40" Exempt="false" TaxCode="DE"/><Tax Amount="47.80" Exempt="false" TaxCode="RA"/><Tax Amount="13.50" Exempt="false" TaxCode="XF"/></Taxes></SellingFareDetails></NetTicketingInfo></PricedItinerary><ResponseHeader><Text>FARE - PRICE RETAINED</Text><Text>FARE NOT GUARANTEED UNTIL TICKETED</Text></ResponseHeader><PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="IT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="true" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" TourCode="BT294UA" VerifyFareCalc="false"><TicketingInstructionsInfo/></PriceQuotePlus></PriceQuote><PriceQuote RPH="5"><MiscInformation><BaggageFees><Text>BAG ALLOWANCE     -PHCLAS-02P/LH/EACH PIECE UP TO 50 POUNDS/23</Text><Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text><Text>BAG ALLOWANCE     -LASPHC-02P/LH/EACH PIECE UP TO 50 POUNDS/23</Text><Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text><Text>CARRY ON ALLOWANCE</Text><Text>PHCFRA FRAIAH IAHFRA FRAPHC-01P/LH</Text><Text>01/UP TO 18 POUNDS/8 KILOGRAMS AND UP TO 46 LINEAR INCHES/118 L</Text><Text>INEAR CENTIMETERS</Text><Text>IAHLAS LASIAH-01P/UA</Text><Text>01/CARRY ON HAND BAGGAGE</Text><Text>01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text><Text>CARRY ON CHARGES</Text><Text>PHCFRA FRAIAH IAHFRA FRAPHC-LH</Text><Text>UP TO 18 POUNDS/8 KILOGRAMS AND UP TO 46 LINEAR INCHES/118 LINE</Text><Text>AR CENTIMETERS-NOT PERMITTED</Text><Text>IAHLAS LASIAH-UA-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text><Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text><Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text><Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text></BaggageFees><GlobalNetRemit><NetFare><BaseFare/><EquivFare/><Taxes/><TotalFare Amount="0.00"/></NetFare><SellingFare><BaseFare/><EquivFare/><Taxes/><TotalFare Amount="0.00"/></SellingFare><Text>BT</Text></GlobalNetRemit><SignatureLine CommissionAmount="0" CommissionID="A" ExpirationDateTime="00:00" Source="SYS" Status="HISTORY"><Text>6IIF 6IIF*AAB 1240/17MAY19</Text></SignatureLine></MiscInformation><PricedItinerary DisplayOnly="false" InputMessage="WPPJCB¥K0¥ETR¥RQ" RPH="1" StatusCode="A" StoredDateTime="2019-05-16T12:49" TaxExempt="false" ValidatingCarrier="UA"><AirItineraryPricingInfo><ItinTotalFare><BaseFare Amount="1323.00" CurrencyCode="USD"/><Taxes><Tax Amount="933.33" TaxCode="XT"/><TaxBreakdownCode TaxPaid="false">618.60YQ</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">37.20US</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">5.77YC</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">7.00XY</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">3.96XA</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">11.20AY</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">97.10NG</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">50.00QT</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">20.00TE</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">21.20DE</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">47.80RA</TaxBreakdownCode><TaxBreakdownCode TaxPaid="false">13.50XF</TaxBreakdownCode></Taxes><TotalFare Amount="2256.33" CurrencyCode="USD"/><Totals><BaseFare Amount="1323.00"/><Taxes><Tax Amount="933.33"/></Taxes><TotalFare Amount="2256.33"/></Totals></ItinTotalFare><PassengerTypeQuantity Code="JCB" Quantity="01"/><PrivateFareInformation PrivateFareType="@"><Text>@</Text></PrivateFareInformation><PTC_FareBreakdown><Endorsements><Endorsement type="PRICING_PARAMETER"><Text>WPPJCB$K0$ETR$RQ</Text></Endorsement><Endorsement type="WARNING"><Text>PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING</Text></Endorsement><Endorsement type="WARNING"><Text>VALIDATING CARRIER - UA</Text></Endorsement><Endorsement type="SYSTEM_ENDORSEMENT"><Text>REFTHRUAG/NONEND/NONRERTE/LH/UA/AC/OS/SN/LX ONLY</Text></Endorsement><Endorsement type="PRIVATE_FARE"><Text>PRIVATE @</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>BAG ALLOWANCE     -PHCLAS-02P/LH/EACH PIECE UP TO 50 POUNDS/23</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>BAG ALLOWANCE     -LASPHC-02P/LH/EACH PIECE UP TO 50 POUNDS/23</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>CARRY ON ALLOWANCE</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>PHCFRA FRAIAH IAHFRA FRAPHC-01P/LH</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>01/UP TO 18 POUNDS/8 KILOGRAMS AND UP TO 46 LINEAR INCHES/118 L</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>INEAR CENTIMETERS</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>IAHLAS LASIAH-01P/UA</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>01/CARRY ON HAND BAGGAGE</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>01/UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>CARRY ON CHARGES</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>PHCFRA FRAIAH IAHFRA FRAPHC-LH</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>UP TO 18 POUNDS/8 KILOGRAMS AND UP TO 46 LINEAR INCHES/118 LINE</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>AR CENTIMETERS-NOT PERMITTED</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>IAHLAS LASIAH-UA-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text></Endorsement><Endorsement type="DOT_BAGGAGE"><Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text></Endorsement></Endorsements><FareBasis Code="LLRCNGW/CN10/LLRCNGW/CN10/LLRCNGW/CN10/LHRCNGW/CN10/LHRCNGW/CN10/LHRCNGW/CN10"/><FareCalculation><Text>PHC LH X/FRA LH X/HOU UA LAS571.50UA X/HOU LH X/FRA LH PHC751.50NUC1323.00END ROE1.00 XFIAH4.5LAS4.5IAH4.5</Text></FareCalculation><FareSource>ATPC</FareSource><FlightSegment ConnectionInd="O" DepartureDateTime="05-28T20:00" FlightNumber="595" ResBookDesigCode="L" SegmentNumber="1" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LLRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="595"/><OriginLocation LocationCode="PHC"/><ValidityDates><NotValidAfter>2019-05-28</NotValidAfter><NotValidBefore>2019-05-28</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="05-29T10:00" FlightNumber="440" ResBookDesigCode="L" SegmentNumber="2" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LLRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="440"/><OriginLocation LocationCode="FRA"/><ValidityDates><NotValidAfter>2019-05-29</NotValidAfter><NotValidBefore>2019-05-29</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="05-29T20:10" FlightNumber="2115" ResBookDesigCode="L" SegmentNumber="3" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LLRCNGW/CN10"/><MarketingAirline Code="UA" FlightNumber="2115"/><OriginLocation LocationCode="IAH"/><ValidityDates><NotValidAfter>2019-05-29</NotValidAfter><NotValidBefore>2019-05-29</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="O" DepartureDateTime="07-13T06:00" FlightNumber="2276" ResBookDesigCode="L" SegmentNumber="4" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LHRCNGW/CN10"/><MarketingAirline Code="UA" FlightNumber="2276"/><OriginLocation LocationCode="LAS"/><ValidityDates><NotValidAfter>2019-07-13</NotValidAfter><NotValidBefore>2019-07-13</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="07-13T15:55" FlightNumber="441" ResBookDesigCode="L" SegmentNumber="5" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LHRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="441"/><OriginLocation LocationCode="IAH"/><ValidityDates><NotValidAfter>2019-07-13</NotValidAfter><NotValidBefore>2019-07-13</NotValidBefore></ValidityDates></FlightSegment><FlightSegment ConnectionInd="X" DepartureDateTime="07-14T11:15" FlightNumber="594" ResBookDesigCode="L" SegmentNumber="6" Status="OK"><BaggageAllowance Number="02P"/><FareBasis Code="LHRCNGW/CN10"/><MarketingAirline Code="LH" FlightNumber="594"/><OriginLocation LocationCode="FRA"/><ValidityDates><NotValidAfter>2019-07-14</NotValidAfter><NotValidBefore>2019-07-14</NotValidBefore></ValidityDates></FlightSegment><FlightSegment><OriginLocation LocationCode="PHC"/></FlightSegment><FareComponent Amount="57150" FareBasisCode="LLRCNGW/CN10" FareDirectionality="FROM" GoverningCarrier="LH" TicketDesignator="CN10"><Location Destination="LAS" Origin="PHC"/><Dates ArrivalDateTime="05-29T21:31" DepartureDateTime="05-28T20:00"/></FareComponent><FareComponent Amount="75150" FareBasisCode="LHRCNGW/CN10" FareDirectionality="TO" GoverningCarrier="LH" TicketDesignator="CN10"><Location Destination="PHC" Origin="LAS"/><Dates ArrivalDateTime="07-14T18:15" DepartureDateTime="07-13T06:00"/></FareComponent><ResTicketingRestrictions>LAST DAY TO PURCHASE 19MAY/1249</ResTicketingRestrictions><ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 19MAY</ResTicketingRestrictions><TourCode><Text>BT294UA</Text></TourCode></PTC_FareBreakdown></AirItineraryPricingInfo><NetTicketingInfo><SellingFareDetails><BaseFare Amount="1323.00" CurrencyCode="USD"/><TotalTax Amount="933.33" CurrencyCode="USD"/><TotalFare Amount="2256.33" CurrencyCode="USD"/><Commission Amount="0.00" CurrencyCode="USD"><Percent Type="">0</Percent></Commission><FareCalc>PHC LH X/FRA LH X/HOU UA LAS571.50UA X/HOU LH X/FRA LH PHC751.50NUC1323.00END ROE1.00 XFIAH4.5LAS4.5IAH4.5</FareCalc><Taxes><Tax Amount="618.60" Exempt="false" TaxCode="YQ"/><Tax Amount="37.20" Exempt="false" TaxCode="US"/><Tax Amount="5.77" Exempt="false" TaxCode="YC"/><Tax Amount="7.00" Exempt="false" TaxCode="XY"/><Tax Amount="3.96" Exempt="false" TaxCode="XA"/><Tax Amount="11.20" Exempt="false" TaxCode="AY"/><Tax Amount="97.10" Exempt="false" TaxCode="NG"/><Tax Amount="50.00" Exempt="false" TaxCode="QT"/><Tax Amount="20.00" Exempt="false" TaxCode="TE"/><Tax Amount="21.20" Exempt="false" TaxCode="DE"/><Tax Amount="47.80" Exempt="false" TaxCode="RA"/><Tax Amount="13.50" Exempt="false" TaxCode="XF"/></Taxes></SellingFareDetails></NetTicketingInfo></PricedItinerary><ResponseHeader><Text>FARE - PRICE RETAINED</Text><Text>FARE USED TO CALCULATE DISCOUNT</Text><Text>FARE NOT GUARANTEED UNTIL TICKETED</Text></ResponseHeader><PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="IT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="true" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" TourCode="BT294UA" VerifyFareCalc="false"><TicketingInstructionsInfo/></PriceQuotePlus></PriceQuote><PriceQuoteTotals><BaseFare Amount="2691.00"/><Taxes><Tax Amount="1871.16"/></Taxes><TotalFare Amount="4562.16"/></PriceQuoteTotals></ItineraryPricing><ReservationItems><Item RPH="1"><FlightSegment AirMilesFlown="3123" ArrivalDateTime="05-29T05:30" ConnectionInd="O" DayOfWeekInd="2" DepartureDateTime="2019-05-28T20:00" FlightNumber="0595" IsPast="true" NumberInParty="01" ResBookDesigCode="L" SegmentNumber="0001" SpecialMeal="false" Status="HK" eTicket="true"><DestinationLocation LocationCode="FRA"/><Equipment AirEquipType="333"/><MarketingAirline Code="LH" FlightNumber="0595"><Banner>MARKETED BY LUFTHANSA</Banner></MarketingAirline><MarriageGrp Group="001" Ind="O" Sequence="1"/><OperatingAirline FlightNumber="0595" ResBookDesigCode="L"/><OperatingAirlinePricing/><OriginLocation LocationCode="PHC"/><SupplierRef ID="DCLH*QQ5YS8"/><UpdatedArrivalTime>05-29T05:30</UpdatedArrivalTime><UpdatedDepartureTime>05-28T20:00</UpdatedDepartureTime></FlightSegment></Item><Item RPH="2"><MiscSegment DayOfWeekInd="5" DepartureDateTime="01-10" IsPast="false" NumberInParty="01" SegmentNumber="0010" Status="GK" Type="OTH"><OriginLocation LocationCode="XXX"/><Text>PRESERVEPNR</Text><Vendor Code="YY"/></MiscSegment></Item><Item RPH="3"><MiscSegment DayOfWeekInd="6" DepartureDateTime="02-15" IsPast="false" NumberInParty="01" SegmentNumber="0011" Status="GK" Type="OTH"><OriginLocation LocationCode="XXX"/><Text>PRESERVEPNR</Text><Vendor Code="YY"/></MiscSegment></Item><Item RPH="4"><Seats><Seat Changed="N" NameNumber="01.01" Number="37F" SegmentNumber="0003" SegmentStatus="KK" SmokingPreference="N" Status="HRS" TypeTwo=""><FlightSegment><DestinationLocation LocationCode="LAS"/><OriginLocation LocationCode="IAH"/></FlightSegment></Seat></Seats></Item></ReservationItems><Ticketing RPH="01" TicketTimeLimit="T-23JUL-6IIF*AMK"/></ItineraryInfo><ItineraryRef AirExtras="false" ID="BDAJOO" InhibitCode="U" PartitionID="AA" PrimeHostID="1S"><Source AAA_PseudoCityCode="6IIF" CreateDateTime="2019-05-16T14:49" CreationAgent="AWS" HomePseudoCityCode="L3II" LastUpdateDateTime="2019-08-18T13:55" PseudoCityCode="6IIF" ReceivedFrom="SHEENA" SequenceNumber="27"/></ItineraryRef><RemarkInfo><Remark RPH="001" Type="General"><Text>GD-SHEENA/5940/FOR BONNIE/7904/LEAD-11676446 IN 6IIF</Text></Remark><Remark RPH="003" Type="General"><Text>XXTAW/16MAY</Text></Remark></RemarkInfo><SpecialServiceInfo RPH="001" Type="AFX"><Service SSR_Code="SSR" SSR_Type="OTHS"><Text>1S PLS ADV TKT NBR BY 19MAY19/1949Z OR LH OPTG/MKTG FLTS WILL BE CANX / APPLIC FARE RULE APPLIES IF IT DEMANDS EARLIER TKTG</Text></Service></SpecialServiceInfo></TravelItinerary></TravelItineraryReadRS></EnhancedAirBookRS></soap-env:Body></soap-env:Envelope>'),
			params: {
				addAirSegments: [{
					airline: 'LH',
					flightNumber: '595',
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
			reservations: [{
				segmentNumber: 1,
				departureDate: {
					raw: '2019-05-28T20:00',
					parsed: '05-28',
				},
				destinationDate: {
					raw: '05-29T05:30',
					parsed: '05-29',
				},
				airline: 'LH',
				flightNumber: '0595',
				bookingClass: 'L',
				destinationAirport: 'FRA',
				departureAirport: 'PHC',
				segmentStatus: 'HK',
				seatCount: '01',
				eticket: true,
			}],
		},
	});

	// 1 ET 509E 28FEB EWRLFW SS1   920P 1205P+*      FR/SA   E  1
	// 2 ET1005E 29FEB LFWROB SS1  1250P  410P *         SA   E  1
	//         OPERATED BY ASKY  LFW-ACC
	//         OPERATED BY ASKY  ACC-ROB
	// 3 ET1006E 24MAR ROBLFW SS1   810A 1140A *         TU   E  2
	//         OPERATED BY ASKY  ROB-ACC
	//         OPERATED BY ASKY  ACC-LFW
	// 4 ET 508E 24MAR LFWEWR SS1  1235P  820P *         TU   E  2
	list.push({
		title: 'Hidden stops in reservation output',
		input: {
			xml: parseXml('<?xml version="1.0" encoding="UTF-8"?><soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"><soap-env:Header><eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader"><eb:From><eb:PartyId eb:type="urn:x12.org:IO5:01">webservices.sabre.com/websvc</eb:PartyId></eb:From><eb:To><eb:PartyId eb:type="urn:x12.org:IO5:01">innogw.dyninno.net</eb:PartyId></eb:To><eb:CPAId>L3II</eb:CPAId><eb:ConversationId>2019-02-22T19:07:04@innogateway5c7048587a71aPID4209</eb:ConversationId><eb:Service eb:type="OTA">EnhancedAirBookRQ</eb:Service><eb:Action>EnhancedAirBookRS</eb:Action><eb:MessageData><eb:MessageId>e3ipppq56</eb:MessageId><eb:Timestamp>2019-08-20T13:58:47</eb:Timestamp><eb:RefToMessageId>1876459793</eb:RefToMessageId></eb:MessageData></eb:MessageHeader><wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"><wsse:BinarySecurityToken EncodingType="wsse:Base64Binary" valueType="String">Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/RESC!ICESMSLB\/RES.LB!-2983122460280249461!772698!0</wsse:BinarySecurityToken></wsse:Security></soap-env:Header><soap-env:Body><EnhancedAirBookRS xmlns="http://services.sabre.com/sp/eab/v3_9"><ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01"><Success timeStamp="2019-08-20T08:58:47.673-05:00"/></ApplicationResults><OTA_AirBookRS><OriginDestinationOption><FlightSegment ArrivalDateTime="02-29T12:05" DepartureDateTime="02-28T21:20" FlightNumber="0509" NumberInParty="001" ResBookDesigCode="E" Status="GK" eTicket="true"><DestinationLocation LocationCode="LFW"/><MarketingAirline Code="ET" FlightNumber="0509"/><OriginLocation LocationCode="EWR"/></FlightSegment><FlightSegment ArrivalDateTime="02-29T16:10" DepartureDateTime="02-29T12:50" FlightNumber="1005" NumberInParty="001" ResBookDesigCode="E" Status="GK" eTicket="true"><DestinationLocation LocationCode="ROB"/><MarketingAirline Code="ET" FlightNumber="1005"/><OriginLocation LocationCode="LFW"/></FlightSegment></OriginDestinationOption></OTA_AirBookRS><TravelItineraryReadRS><TravelItinerary><CustomerInfo/><ItineraryInfo><ReservationItems><Item RPH="1"><FlightSegment AirMilesFlown="5182" ArrivalDateTime="02-29T12:05" CodeShare="false" DayOfWeekInd="5" DepartureDateTime="2020-02-28T21:20" ElapsedTime="09.45" FlightNumber="0509" IsPast="false" NumberInParty="01" ResBookDesigCode="E" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="GK" StopQuantity="00" eTicket="true"><DestinationLocation LocationCode="LFW"/><Equipment AirEquipType="787"/><MarketingAirline Code="ET" FlightNumber="0509"><Banner>MARKETED BY ETHIOPIAN AIRLINES</Banner></MarketingAirline><Meal Code="B"/><OperatingAirline Code="ET" FlightNumber="0509" ResBookDesigCode="E"><Banner>OPERATED BY ETHIOPIAN AIRLINES</Banner></OperatingAirline><OperatingAirlinePricing Code="ET"/><DisclosureCarrier Code="ET"><Banner>ETHIOPIAN AIRLINES</Banner></DisclosureCarrier><OriginLocation LocationCode="EWR" Terminal="TERMINAL B" TerminalCode="B"/><UpdatedArrivalTime>02-29T12:05</UpdatedArrivalTime><UpdatedDepartureTime>02-28T21:20</UpdatedDepartureTime></FlightSegment></Item><Item RPH="2"><FlightSegment AirMilesFlown="0106" ArrivalDateTime="02-29T13:30" CodeShare="true" DayOfWeekInd="6" DepartureDateTime="2020-02-29T12:50" ElapsedTime="00.40" FlightNumber="1005" IsPast="false" NumberInParty="01" ResBookDesigCode="E" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="GK" StopQuantity="01" eTicket="true"><DestinationLocation LocationCode="ACC" TerminalCode="3"/><Equipment AirEquipType="737"/><MarketingAirline Code="ET" FlightNumber="1005"><Banner>MARKETED BY ETHIOPIAN AIRLINES</Banner></MarketingAirline><Meal Code="M"/><OperatingAirline Code="KP" FlightNumber="0020" ResBookDesigCode="E"><Banner>OPERATED BY ASKY</Banner></OperatingAirline><OperatingAirlinePricing Code="KP"/><DisclosureCarrier Code="KP"><Banner>ASKY</Banner></DisclosureCarrier><OriginLocation LocationCode="LFW"/><UpdatedDepartureTime>02-29T12:50</UpdatedDepartureTime></FlightSegment><FlightSegment AirMilesFlown="0702" ArrivalDateTime="02-29T16:10" CodeShare="true" DayOfWeekInd="6" DepartureDateTime="2020-02-29T14:10" ElapsedTime="02.00" FlightNumber="1005" IsPast="false" NumberInParty="01" ResBookDesigCode="E" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="GK" StopQuantity="01" eTicket="true"><DestinationLocation LocationCode="ROB"/><Equipment AirEquipType="737"/><MarketingAirline Code="ET" FlightNumber="1005"><Banner>MARKETED BY ETHIOPIAN AIRLINES</Banner></MarketingAirline><Meal Code="M"/><OperatingAirline Code="KP" FlightNumber="0020" ResBookDesigCode="E"><Banner>OPERATED BY ASKY</Banner></OperatingAirline><OperatingAirlinePricing Code="KP"/><DisclosureCarrier Code="KP"><Banner>ASKY</Banner></DisclosureCarrier><OriginLocation LocationCode="ACC" TerminalCode="3"/><UpdatedArrivalTime>02-29T16:10</UpdatedArrivalTime></FlightSegment></Item></ReservationItems></ItineraryInfo><ItineraryRef AirExtras="false" InhibitCode="U" PartitionID="AA" PrimeHostID="1S"><Source PseudoCityCode="6IIF"/></ItineraryRef></TravelItinerary></TravelItineraryReadRS></EnhancedAirBookRS></soap-env:Body></soap-env:Envelope>'),
			params: {
				addAirSegments: [{
					airline: 'ET',
					flightNumber: '0509',
					bookingClass: 'E',
					destinationAirport: 'LFW',
					departureAirport: 'EWR',
					departureDt: '2020-02-28',
					segmentStatus: 'GK',
					seatCount: 1,
					isMarried: false,
				}, {
					airline: 'ET',
					flightNumber: '1005',
					bookingClass: 'E',
					destinationAirport: 'ROB',
					departureAirport: 'LWF',
					departureDt: '2020-02-29',
					segmentStatus: 'GK',
					seatCount: 1,
					isMarried: false,
				}],
			},
		},
		output: {
			reservations: [{
				segmentNumber: 1,
				departureDate: {
					raw: '2020-02-28T21:20',
					parsed: '02-28',
				},
				destinationDate: {
					raw: '02-29T12:05',
					parsed: '02-29',
				},
				airline: 'ET',
				flightNumber: '0509',
				bookingClass: 'E',
				destinationAirport: 'LFW',
				departureAirport: 'EWR',
				segmentStatus: 'GK',
				seatCount: '01',
				eticket: true,
			}, {
				segmentNumber: 2,
				departureDate: {
					raw: '2020-02-29T12:50',
					parsed: '02-29',
				},
				destinationDate: {
					raw: '02-29T16:10',
					parsed: '02-29',
				},
				airline: 'ET',
				flightNumber: '1005',
				bookingClass: 'E',
				destinationAirport: 'ROB',
				departureAirport: 'LFW',
				segmentStatus: 'GK',
				seatCount: '01',
				eticket: true,
			}],
		},
	});

	return list.map(a => [a]);
};

class SabreItineraryTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js') {
	async test_buildXml({input, output}) {
		this.assertSame(output, SabreItinerary.buildItineraryXml(input));
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
