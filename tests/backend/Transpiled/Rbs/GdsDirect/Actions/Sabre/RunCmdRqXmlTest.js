const GdsSessions = require('../../../../../../../backend/Repositories/GdsSessions.js');
const GdsActionTestUtil = require('../../../../../../../backend/Utils/Testing/GdsActionTestUtil.js');
const GdsDirectDefaults = require('../../../../Rbs/TestUtils/GdsDirectDefaults.js');
const RunCmdRq = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Sabre/RunCmdRq.js');

class RunCmdRqXmlTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js') {
	provideActionTestCases() {
		const list = [];

		list.push({
			'title': 'RE/ with XML direct sell example',
			'input': {
				'cmdRq': 'RE/L3II/GK',
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'sessionData': {'hasPnr': true},
				'calledCommands': [],
			},
			'sessionInfo': {
				'initialState': {...GdsDirectDefaults.makeDefaultSabreState()},
				'initialCommands': [],
				'performedCommands': [{
					'cmd': '*R',
					'output': [
						'NO NAMES',
						' 1 TK  85C 24MAY S MNLIST*SS1   930P  505A  25MAY M /DCTK /E',
						' 2 TK1757C 25MAY M ISTRIX*SS1   820A 1120A /DCTK /E',
						'L3II.L3II*AWS 0946/15AUG19',
					].join('\n'),
				}, {
					'cmd': 'SI*',
					'output': '6IIF.L3II*AWS.A.B.C.D.E.F..*AWS NOT SIGNED OUT',
					'duration': '0.205584529',
					'type': 'signIn',
				}, {
					'cmd': '¤B§OIATH',
					'output': 'ATH:Shared/IDL:IceSess/SessMgr:1.0.IDL/Common/!ICESMS/RESB!ICESMSLB/RES.LB!1!2!3!4!E2E-1',
					'duration': '0.234214541',
					'type': 'changeArea',
				}, {
					'cmd': 'AAAL3II',
					'output': ['L3II.L3II*AWS.A', 'NO MESSAGE..29AUG'].join('\n'),
				}, {
					'cmd': '*R',
					'output': [
						'NO NAMES',
						' 1 9U 135D 10DEC M KIVKBP GK1   130P  220P /E',
						' 2 BT 403D 10DEC M KBPRIX GK1   310P  505P /E',
						'L3II.L3II*AWS 1030/29AUG18',
					].join('\n'),
				}],
			},
			httpRequests: [{
				rq: '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope	xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"	xmlns:secext="http://schemas.xmlsoap.org/ws/2002/12/secext"	xmlns:ebmsg="http://www.ebxml.org/namespaces/messageHeader"><SOAP-ENV:Header><secext:Security><secext:BinarySecurityToken>Shared/IDL:IceSess/SessMgr:1.0.IDL/Common/!ICESMS/RESB!ICESMSLB/RES.LB!1!2!3!4</secext:BinarySecurityToken></secext:Security><ebmsg:MessageHeader><ebmsg:From><ebmsg:PartyId ebmsg:type="urn:x12.org:IO5:01">innogw.dyninno.net</ebmsg:PartyId></ebmsg:From><ebmsg:To><ebmsg:PartyId ebmsg:type="urn:x12.org:IO5:01">webservices.sabre.com/websvc</ebmsg:PartyId></ebmsg:To><ebmsg:CPAId>somePcc</ebmsg:CPAId><ebmsg:ConversationId>777</ebmsg:ConversationId><ebmsg:Service ebmsg:type="OTA">EnhancedAirBookRQ</ebmsg:Service><ebmsg:Action>EnhancedAirBookRQ</ebmsg:Action><ebmsg:MessageData><ebmsg:MessageId>666</ebmsg:MessageId><ebmsg:Timestamp>2019-02-22T19:07:05</ebmsg:Timestamp><ebmsg:Timeout>600</ebmsg:Timeout></ebmsg:MessageData></ebmsg:MessageHeader></SOAP-ENV:Header><SOAP-ENV:Body><ns1:EnhancedAirBookRQ version="3.9.0" xmlns:ns1="http://services.sabre.com/sp/eab/v3_9"><ns1:OTA_AirBookRQ><ns1:OriginDestinationInformation><ns1:FlightSegment DepartureDateTime="2019-05-24T00:00" FlightNumber="85" NumberInParty="1" ResBookDesigCode="C" Status="GK"><ns1:DestinationLocation LocationCode="IST"/><ns1:MarketingAirline Code="TK" FlightNumber="85"/><ns1:OperatingAirline Code="TK"/><ns1:OriginLocation LocationCode="MNL"/></ns1:FlightSegment><ns1:FlightSegment DepartureDateTime="2019-05-25T00:00" FlightNumber="1757" NumberInParty="1" ResBookDesigCode="C" Status="GK"><ns1:DestinationLocation LocationCode="RIX"/><ns1:MarketingAirline Code="TK" FlightNumber="1757"/><ns1:OperatingAirline Code="TK"/><ns1:OriginLocation LocationCode="IST"/></ns1:FlightSegment></ns1:OriginDestinationInformation></ns1:OTA_AirBookRQ><ns1:PostProcessing><ns1:RedisplayReservation></ns1:RedisplayReservation></ns1:PostProcessing><ns1:PreProcessing/></ns1:EnhancedAirBookRQ></SOAP-ENV:Body></SOAP-ENV:Envelope>',
				rs: '<?xml version="1.0" encoding="UTF-8"?><soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"><soap-env:Header><eb:MessageHeader xmlns:eb="http://www.ebxml.org/namespaces/messageHeader" eb:version="1.0" soap-env:mustUnderstand="1"><eb:From><eb:PartyId eb:type="urn:x12.org:IO5:01">webservices.sabre.com/websvc</eb:PartyId></eb:From><eb:To><eb:PartyId eb:type="urn:x12.org:IO5:01">innogw.dyninno.net</eb:PartyId></eb:To><eb:CPAId>L3II</eb:CPAId><eb:ConversationId>777</eb:ConversationId><eb:Service eb:type="OTA">EnhancedAirBookRQ</eb:Service><eb:Action>EnhancedAirBookRS</eb:Action><eb:MessageData><eb:MessageId>16fqzcfqw</eb:MessageId><eb:Timestamp>2019-08-15T14:45:27</eb:Timestamp><eb:RefToMessageId>666</eb:RefToMessageId></eb:MessageData></eb:MessageHeader><wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"><wsse:BinarySecurityToken valueType="String" EncodingType="wsse:Base64Binary">Shared/IDL:IceSess/SessMgr:1.0.IDL/Common/!ICESMS/RESB!ICESMSLB/RES.LB!-1111111111111111111!222222!9!1</wsse:BinarySecurityToken></wsse:Security></soap-env:Header><soap-env:Body><EnhancedAirBookRS xmlns="http://services.sabre.com/sp/eab/v3_9"><ApplicationResults xmlns="http://services.sabre.com/STL_Payload/v02_01" status="Complete"><Success timeStamp="2019-08-15T09:45:27.915-05:00"/></ApplicationResults><OTA_AirBookRS><OriginDestinationOption><FlightSegment ArrivalDateTime="05-25T05:05" DepartureDateTime="05-24T21:30" FlightNumber="0085" NumberInParty="001" ResBookDesigCode="C" Status="GK" eTicket="true"><DestinationLocation LocationCode="IST"/><MarketingAirline Code="TK" FlightNumber="0085"/><OriginLocation LocationCode="MNL"/></FlightSegment><FlightSegment ArrivalDateTime="05-25T11:20" DepartureDateTime="05-25T08:20" FlightNumber="1757" NumberInParty="001" ResBookDesigCode="C" Status="GK" eTicket="true"><DestinationLocation LocationCode="RIX"/><MarketingAirline Code="TK" FlightNumber="1757"/><OriginLocation LocationCode="IST"/></FlightSegment></OriginDestinationOption></OTA_AirBookRS><TravelItineraryReadRS><TravelItinerary><CustomerInfo/><ItineraryInfo><ReservationItems><Item RPH="1"><FlightSegment AirMilesFlown="5684" ArrivalDateTime="05-25T05:05" DayOfWeekInd="7" DepartureDateTime="2020-05-24T21:30" ElapsedTime="12.35" eTicket="true" FlightNumber="0085" NumberInParty="01" ResBookDesigCode="C" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="GK" StopQuantity="00" IsPast="false" CodeShare="false"><DestinationLocation LocationCode="IST"/><Equipment AirEquipType="77W"/><MarketingAirline Code="TK" FlightNumber="0085"><Banner>MARKETED BY TURKISH AIRLINES</Banner></MarketingAirline><Meal Code="M"/><OperatingAirline Code="TK" FlightNumber="0085" ResBookDesigCode="C"><Banner>OPERATED BY TURKISH AIRLINES</Banner></OperatingAirline><OperatingAirlinePricing Code="TK"/><DisclosureCarrier Code="TK"><Banner>TURKISH AIRLINES</Banner></DisclosureCarrier><OriginLocation LocationCode="MNL" Terminal="TERMINAL 3" TerminalCode="3"/><UpdatedArrivalTime>05-25T05:05</UpdatedArrivalTime><UpdatedDepartureTime>05-24T21:30</UpdatedDepartureTime></FlightSegment></Item><Item RPH="2"><FlightSegment AirMilesFlown="1109" ArrivalDateTime="05-25T11:20" DayOfWeekInd="1" DepartureDateTime="2020-05-25T08:20" ElapsedTime="03.00" eTicket="true" FlightNumber="1757" NumberInParty="01" ResBookDesigCode="C" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="GK" StopQuantity="00" IsPast="false" CodeShare="false"><DestinationLocation LocationCode="RIX"/><Equipment AirEquipType="73H"/><MarketingAirline Code="TK" FlightNumber="1757"><Banner>MARKETED BY TURKISH AIRLINES</Banner></MarketingAirline><Meal Code="M"/><OperatingAirline Code="TK" FlightNumber="1757" ResBookDesigCode="C"><Banner>OPERATED BY TURKISH AIRLINES</Banner></OperatingAirline><OperatingAirlinePricing Code="TK"/><DisclosureCarrier Code="TK"><Banner>TURKISH AIRLINES</Banner></DisclosureCarrier><OriginLocation LocationCode="IST"/><UpdatedArrivalTime>05-25T11:20</UpdatedArrivalTime><UpdatedDepartureTime>05-25T08:20</UpdatedDepartureTime></FlightSegment></Item></ReservationItems></ItineraryInfo><ItineraryRef AirExtras="false" InhibitCode="U" PartitionID="AA" PrimeHostID="1S"><Source PseudoCityCode="L3II"/></ItineraryRef></TravelItinerary></TravelItineraryReadRS></EnhancedAirBookRS></soap-env:Body></soap-env:Envelope>',
			}],
		});

		list.push({
			'title': 'Adding more entries to the itinerary should correctly rebuild GK',
			'input': {
				'cmdRq': [
					' 1 TK   85C  24MAY MNLIST SS1   930P  505A+*      1          E ',
					' 2 TK 1757C  25MAY ISTRIX SS1   820A 1120A *      1          E ',
				].join('\n'),
				'baseDate': '2018-06-04',
				'ticketDesignators': [],
			},
			'output': {
				'status': 'executed',
				'sessionData': {'hasPnr': true},
				'calledCommands': [],
			},
			'sessionInfo': {
				'initialState': {...GdsDirectDefaults.makeDefaultSabreState()},
				'initialCommands': [{
					cmd: '*R',
					output: [
						'NO NAMES',
						' 1 PR 127C 20MAY W JFKMNL SS1   145A  615A  21MAY Q /DCPR /E',
						' 2 AY1072Y 28MAY Q RIXHEL SS1  1015A 1125A /DCAY /E',
						'OPERATED BY NORDIC REGIONAL AIRLINES',
						'OPERATED BY NORDIC REGIONAL AIRLINES',
						'6IIF.L3II*AWS 0314/15AUG19',
					].join('\n'),
				}],
				'performedCommands': [{
					cmd: 'WC2C/3C',
					output: [
						'OK - CLASS OF SERVICE CHANGED ',
						' 1 PR 127C 20MAY W JFKMNL SS1   145A  615A  21MAY Q /DCPR /E',
						'NAME CHG NOT ALLOWED FOR PR-C FARECLASS',
						' 2 TK  85C 24MAY S MNLIST SS1   930P  505A  25MAY M /DCTK /E',
						' 3 TK1757C 25MAY M ISTRIX GK1   820A 1120A /E',
						' 4 AY1072Y 28MAY Q RIXHEL SS1  1015A 1125A /DCAY /E',
						'NAME CHG NOT ALLOWED FOR AY-Y FARECLASS',
					].join('\n'),
				}],
			},
			httpRequests: [{
				rq: '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:secext="http://schemas.xmlsoap.org/ws/2002/12/secext" xmlns:ebmsg="http://www.ebxml.org/namespaces/messageHeader"><SOAP-ENV:Header><secext:Security><secext:BinarySecurityToken>soap-unit-test</secext:BinarySecurityToken></secext:Security><ebmsg:MessageHeader><ebmsg:From><ebmsg:PartyId ebmsg:type="urn:x12.org:IO5:01">innogw.dyninno.net</ebmsg:PartyId></ebmsg:From><ebmsg:To><ebmsg:PartyId ebmsg:type="urn:x12.org:IO5:01">webservices.sabre.com/websvc</ebmsg:PartyId></ebmsg:To><ebmsg:CPAId>somePcc</ebmsg:CPAId><ebmsg:ConversationId>777</ebmsg:ConversationId><ebmsg:Service ebmsg:type="OTA">EnhancedAirBookRQ</ebmsg:Service><ebmsg:Action>EnhancedAirBookRQ</ebmsg:Action><ebmsg:MessageData><ebmsg:MessageId>666</ebmsg:MessageId><ebmsg:Timestamp>2019-02-22T19:07:05</ebmsg:Timestamp><ebmsg:Timeout>600</ebmsg:Timeout></ebmsg:MessageData></ebmsg:MessageHeader></SOAP-ENV:Header><SOAP-ENV:Body><ns1:EnhancedAirBookRQ version="3.9.0" xmlns:ns1="http://services.sabre.com/sp/eab/v3_9"><ns1:OTA_AirBookRQ><ns1:OriginDestinationInformation><ns1:FlightSegment DepartureDateTime="2019-05-24T00:00" FlightNumber="85" NumberInParty="1" ResBookDesigCode="C" Status="GK"><ns1:DestinationLocation LocationCode="IST"/><ns1:MarketingAirline Code="TK" FlightNumber="85"/><ns1:OperatingAirline Code="TK"/><ns1:OriginLocation LocationCode="MNL"/></ns1:FlightSegment><ns1:FlightSegment DepartureDateTime="2019-05-25T00:00" FlightNumber="1757" NumberInParty="1" ResBookDesigCode="C" Status="GK"><ns1:DestinationLocation LocationCode="RIX"/><ns1:MarketingAirline Code="TK" FlightNumber="1757"/><ns1:OperatingAirline Code="TK"/><ns1:OriginLocation LocationCode="IST"/></ns1:FlightSegment></ns1:OriginDestinationInformation></ns1:OTA_AirBookRQ><ns1:PostProcessing><ns1:RedisplayReservation></ns1:RedisplayReservation></ns1:PostProcessing><ns1:PreProcessing/></ns1:EnhancedAirBookRQ></SOAP-ENV:Body></SOAP-ENV:Envelope>',
				rs: '<?xml version="1.0" encoding="UTF-8"?><soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"><soap-env:Header><eb:MessageHeader xmlns:eb="http://www.ebxml.org/namespaces/messageHeader" eb:version="1.0" soap-env:mustUnderstand="1"><eb:From><eb:PartyId eb:type="urn:x12.org:IO5:01">webservices.sabre.com/websvc</eb:PartyId></eb:From><eb:To><eb:PartyId eb:type="urn:x12.org:IO5:01">innogw.dyninno.net</eb:PartyId></eb:To><eb:CPAId>L3II</eb:CPAId><eb:ConversationId>2019-02-22T19:07:04@innogateway5c7048587a71aPID4209</eb:ConversationId><eb:Service eb:type="OTA">EnhancedAirBookRQ</eb:Service><eb:Action>EnhancedAirBookRS</eb:Action><eb:MessageData><eb:MessageId>wv6dynwor</eb:MessageId><eb:Timestamp>2019-08-15T08:27:28</eb:Timestamp><eb:RefToMessageId>1876459793</eb:RefToMessageId></eb:MessageData></eb:MessageHeader><wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"><wsse:BinarySecurityToken valueType="String" EncodingType="wsse:Base64Binary">Shared/IDL:IceSess/SessMgr:1.0.IDL/Common/!ICESMS/RESB!ICESMSLB/RES.LB!-1111111111111111111!222222!0</wsse:BinarySecurityToken></wsse:Security></soap-env:Header><soap-env:Body><EnhancedAirBookRS xmlns="http://services.sabre.com/sp/eab/v3_9"><ApplicationResults xmlns="http://services.sabre.com/STL_Payload/v02_01" status="Complete"><Success timeStamp="2019-08-15T03:27:28.279-05:00"/></ApplicationResults><OTA_AirBookRS><OriginDestinationOption><FlightSegment ArrivalDateTime="05-25T05:05" DepartureDateTime="05-24T21:30" FlightNumber="0085" NumberInParty="001" ResBookDesigCode="C" Status="GK" eTicket="true"><DestinationLocation LocationCode="IST"/><MarketingAirline Code="TK" FlightNumber="0085"/><OriginLocation LocationCode="MNL"/></FlightSegment><FlightSegment ArrivalDateTime="05-25T11:20" DepartureDateTime="05-25T08:20" FlightNumber="1757" NumberInParty="001" ResBookDesigCode="C" Status="GK" eTicket="true"><DestinationLocation LocationCode="RIX"/><MarketingAirline Code="TK" FlightNumber="1757"/><OriginLocation LocationCode="IST"/></FlightSegment></OriginDestinationOption></OTA_AirBookRS><TravelItineraryReadRS><TravelItinerary><CustomerInfo/><ItineraryInfo><ReservationItems><Item RPH="1"><FlightSegment AirMilesFlown="8520" ArrivalDateTime="05-21T06:15" DayOfWeekInd="3" DepartureDateTime="2020-05-20T01:45" ElapsedTime="16.30" eTicket="true" FlightNumber="0127" NumberInParty="01" ResBookDesigCode="C" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="SS" StopQuantity="00" IsPast="false" CodeShare="false"><DestinationLocation LocationCode="MNL" Terminal="TERMINAL 1" TerminalCode="1"/><Equipment AirEquipType="350"/><MarketingAirline Code="PR" FlightNumber="0127"><Banner>MARKETED BY PHILIPPINE AIRLINES</Banner></MarketingAirline><Meal Code="D"/><OperatingAirline Code="PR" FlightNumber="0127" ResBookDesigCode="C"><Banner>OPERATED BY PHILIPPINE AIRLINES</Banner></OperatingAirline><OperatingAirlinePricing Code="PR"/><DisclosureCarrier Code="PR"><Banner>PHILIPPINE AIRLINES</Banner></DisclosureCarrier><OriginLocation LocationCode="JFK" Terminal="TERMINAL 1" TerminalCode="1"/><SupplierRef ID="DCPR"/><UpdatedArrivalTime>05-21T06:15</UpdatedArrivalTime><UpdatedDepartureTime>05-20T01:45</UpdatedDepartureTime></FlightSegment></Item><Item RPH="2"><FlightSegment AirMilesFlown="5684" ArrivalDateTime="05-25T05:05" DayOfWeekInd="7" DepartureDateTime="2020-05-24T21:30" ElapsedTime="12.35" eTicket="true" FlightNumber="0085" NumberInParty="01" ResBookDesigCode="C" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="GK" StopQuantity="00" IsPast="false" CodeShare="false"><DestinationLocation LocationCode="IST"/><Equipment AirEquipType="77W"/><MarketingAirline Code="TK" FlightNumber="0085"><Banner>MARKETED BY TURKISH AIRLINES</Banner></MarketingAirline><Meal Code="M"/><OperatingAirline Code="TK" FlightNumber="0085" ResBookDesigCode="C"><Banner>OPERATED BY TURKISH AIRLINES</Banner></OperatingAirline><OperatingAirlinePricing Code="TK"/><DisclosureCarrier Code="TK"><Banner>TURKISH AIRLINES</Banner></DisclosureCarrier><OriginLocation LocationCode="MNL" Terminal="TERMINAL 3" TerminalCode="3"/><UpdatedArrivalTime>05-25T05:05</UpdatedArrivalTime><UpdatedDepartureTime>05-24T21:30</UpdatedDepartureTime></FlightSegment></Item><Item RPH="3"><FlightSegment AirMilesFlown="1109" ArrivalDateTime="05-25T11:20" DayOfWeekInd="1" DepartureDateTime="2020-05-25T08:20" ElapsedTime="03.00" eTicket="true" FlightNumber="1757" NumberInParty="01" ResBookDesigCode="C" SegmentNumber="0003" SmokingAllowed="false" SpecialMeal="false" Status="GK" StopQuantity="00" IsPast="false" CodeShare="false"><DestinationLocation LocationCode="RIX"/><Equipment AirEquipType="73H"/><MarketingAirline Code="TK" FlightNumber="1757"><Banner>MARKETED BY TURKISH AIRLINES</Banner></MarketingAirline><Meal Code="M"/><OperatingAirline Code="TK" FlightNumber="1757" ResBookDesigCode="C"><Banner>OPERATED BY TURKISH AIRLINES</Banner></OperatingAirline><OperatingAirlinePricing Code="TK"/><DisclosureCarrier Code="TK"><Banner>TURKISH AIRLINES</Banner></DisclosureCarrier><OriginLocation LocationCode="IST"/><UpdatedArrivalTime>05-25T11:20</UpdatedArrivalTime><UpdatedDepartureTime>05-25T08:20</UpdatedDepartureTime></FlightSegment></Item><Item RPH="4"><FlightSegment AirMilesFlown="0231" ArrivalDateTime="05-28T11:25" DayOfWeekInd="4" DepartureDateTime="2020-05-28T10:15" ElapsedTime="01.10" eTicket="true" FlightNumber="1072" NumberInParty="01" ResBookDesigCode="Y" SegmentNumber="0004" SmokingAllowed="false" SpecialMeal="false" Status="SS" StopQuantity="00" IsPast="false" CodeShare="false"><DestinationLocation LocationCode="HEL" Terminal="TERMINAL 2" TerminalCode="2"/><Equipment AirEquipType="AT7"/><MarketingAirline Code="AY" FlightNumber="1072"><Banner>MARKETED BY FINNAIR</Banner></MarketingAirline><Meal Code="G"/><OperatingAirline Code="AY" FlightNumber="1072" ResBookDesigCode="Y"><Banner>N7/NORDIC REGIONAL AIRLINES</Banner></OperatingAirline><OperatingAirlinePricing Code="N7"/><DisclosureCarrier Code="N7"><Banner>N7/NORDIC REGIONAL AIRLINES</Banner></DisclosureCarrier><OriginLocation LocationCode="RIX"/><SupplierRef ID="DCAY"/><UpdatedArrivalTime>05-28T11:25</UpdatedArrivalTime><UpdatedDepartureTime>05-28T10:15</UpdatedDepartureTime></FlightSegment></Item></ReservationItems></ItineraryInfo><ItineraryRef AirExtras="false" InhibitCode="U" PartitionID="AA" PrimeHostID="1S"><Source PseudoCityCode="6IIF"/></ItineraryRef></TravelItinerary></TravelItineraryReadRS></EnhancedAirBookRS></soap-env:Body></soap-env:Envelope>',
			}],
		});

		list.push({
			'title': 'VERIFY BOOKING CLASS pricing response',
			'input': {
				'cmdRq': 'WPP2ADT/1C05¥MCAD',
				'baseDate': '2019-11-13',
			},
			'output': {
				'status': 'executed',
				'sessionData': {'pricingCmd': null},
				'calledCommands': [
					{cmd: 'WPP2ADT/1C05¥MCAD'},
				],
			},
			'sessionInfo': {
				'initialState': {
					...GdsDirectDefaults.makeDefaultSabreState(),
					"area": "A", "pcc": "C5VD", "pricingCmd": "WPNC¥MCAD", "hasPnr": true,
				},
				'initialCommands': [],
				'performedCommands': [],
			},
			httpRequests: [
				{
					"cmd": "WPP2ADT/1C05¥MCAD",
					"rq": [
						"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
						"<SOAP-ENV:Envelope",
						"\txmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\"",
						"\txmlns:secext=\"http://schemas.xmlsoap.org/ws/2002/12/secext\"",
						"\txmlns:ebmsg=\"http://www.ebxml.org/namespaces/messageHeader\">",
						"  <SOAP-ENV:Header>",
						"    <secext:Security>",
						"      <secext:BinarySecurityToken>soap-unit-test</secext:BinarySecurityToken>",
						"    </secext:Security>",
						"    <ebmsg:MessageHeader>",
						"      <ebmsg:From>",
						"        <ebmsg:PartyId ebmsg:type=\"urn:x12.org:IO5:01\">innogw.dyninno.net</ebmsg:PartyId>",
						"      </ebmsg:From>",
						"      <ebmsg:To>",
						"        <ebmsg:PartyId ebmsg:type=\"urn:x12.org:IO5:01\">webservices.sabre.com/websvc</ebmsg:PartyId>",
						"      </ebmsg:To>",
						"      <ebmsg:CPAId>somePcc</ebmsg:CPAId>",
						"      <ebmsg:ConversationId>777</ebmsg:ConversationId>",
						"      <ebmsg:Service ebmsg:type=\"OTA\">SabreCommandLLSRQ</ebmsg:Service>",
						"      <ebmsg:Action>SabreCommandLLSRQ</ebmsg:Action>",
						"      <ebmsg:MessageData>",
						"        <ebmsg:MessageId>666</ebmsg:MessageId>",
						"        <ebmsg:Timestamp>2019-02-22T19:07:05</ebmsg:Timestamp>",
						"        <ebmsg:Timeout>600</ebmsg:Timeout>",
						"      </ebmsg:MessageData>",
						"    </ebmsg:MessageHeader>",
						"  </SOAP-ENV:Header>",
						"  <SOAP-ENV:Body>    <ns1:SabreCommandLLSRQ xmlns:ns1=\"http://webservices.sabre.com/sabreXML/2003/07\">",
						"      <ns1:Request>",
						"        <ns1:HostCommand>WPP2ADT/1C05¥MCAD</ns1:HostCommand>",
						"      </ns1:Request>",
						"    </ns1:SabreCommandLLSRQ>  </SOAP-ENV:Body>",
						"</SOAP-ENV:Envelope>",
					].join("\n"),
					"rs": [
						"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
						"<soap-env:Envelope xmlns:soap-env=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap-env:Header><eb:MessageHeader xmlns:eb=\"http://www.ebxml.org/namespaces/messageHeader\" eb:version=\"1.0\" soap-env:mustUnderstand=\"1\"><eb:From><eb:PartyId eb:type=\"urn:x12.org:IO5:01\">webservices.sabre.com/websvc</eb:PartyId></eb:From><eb:To><eb:PartyId eb:type=\"urn:x12.org:IO5:01\">innogw.dyninno.net</eb:PartyId></eb:To><eb:CPAId>L3II</eb:CPAId><eb:ConversationId>2019-02-22T19:07:04@innogateway5c7048587a71aPID4209</eb:ConversationId><eb:Service eb:type=\"OTA\">SabreCommandLLSRQ</eb:Service><eb:Action>SabreCommandLLSRS</eb:Action><eb:MessageData><eb:MessageId>7392884637203540551</eb:MessageId><eb:Timestamp>2019-11-13T17:42:01</eb:Timestamp><eb:RefToMessageId>1876459793</eb:RefToMessageId></eb:MessageData></eb:MessageHeader><wsse:Security xmlns:wsse=\"http://schemas.xmlsoap.org/ws/2002/12/secext\"><wsse:BinarySecurityToken valueType=\"String\" EncodingType=\"wsse:Base64Binary\">Shared/IDL:IceSess\\/SessMgr:1\\.0.IDL/Common/!ICESMS\\/RESG!ICESMSLB\\/RES.LB!-2952987954057875834!309230!0</wsse:BinarySecurityToken></wsse:Security></soap-env:Header><soap-env:Body><SabreCommandLLSRS xmlns=\"http://webservices.sabre.com/sabreXML/2003/07\"><Response>PSGR TYPE  ADT",
						"ATTN*VERIFY BOOKING CLASS",
						"   FARE BASIS BOOK CODE           FARE TAX/FEES/CHGS  TOTAL",
						"01 QTJP-ETJP  Q/E       CAD     768.00   120.84      888.84 ADT",
						"02 QTJP-KTJP  Q/K       CAD     801.00   120.84      921.84 ADT",
						"03 HTJP-ETJP  H/E       CAD     814.00   120.84      934.84 ADT",
						"04 QTJP-XTJP  Q/X       CAD     827.00   120.84      947.84 ADT",
						"05 HTJP-KTJP  H/K       CAD     847.00   120.84      967.84 ADT",
						"06 HTJP-XTJP  H/X       CAD     874.00   120.84      994.84 ADT",
						"07 MTJP-ETJP  M/E       CAD     880.00   120.84     1000.84 ADT",
						"08 QTJP-BTJP  Q/B       CAD     894.00   120.84     1014.84 ADT",
						"09 MTJP-KTJP  M/K       CAD     914.00   120.84     1034.84 ADT",
						"10 HTJP-BTJP  H/B       CAD     940.00   120.84     1060.84 ADT",
						"11 LTJP-ETJP  L/E       CAD     960.00   120.84     1080.84 ADT",
						"12 QTJP-VTJP  Q/V       CAD     966.00   120.84     1086.84 ADT",
						"13 LTJP-KTJP  L/K       CAD     993.00   120.84     1113.84 ADT",
						"14 QTJP       Q/Q       CAD    1006.00   120.84     1126.84 ADT",
						"15 HTJP-VTJP  H/V       CAD    1013.00   120.84     1133.84 ADT",
						"16 LTJP-XTJP  L/X       CAD    1019.00   120.84     1139.84 ADT",
						"17 QTJP-HTJP  Q/H       CAD    1053.00   120.84     1173.84 ADT",
						"18 MTJP-VTJP  M/V       CAD    1079.00   120.84     1199.84 ADT",
						"19 LTJP-BTJP  L/B       CAD    1086.00   120.84     1206.84 ADT",
						"20 STJP-ETJP  S/E       CAD    1092.00   120.84     1212.84 ADT",
						"21 HTJP       H/H       CAD    1099.00   120.84     1219.84 ADT",
						"22 MTJP-QTJP  M/Q       CAD    1119.00   120.84     1239.84 ADT",
						"23 STJP-KTJP  S/K       CAD    1125.00   120.84     1245.84 ADT",
						"24 STJP-XTJP  S/X       CAD    1152.00   120.84     1272.84 ADT",
						"ATTN*REBOOK OPTION OF CHOICE BEFORE STORING FARE",
						"  ",
						"PSGR TYPE  C05",
						"ATTN*VERIFY BOOKING CLASS",
						"   FARE BASIS BOOK CODE           FARE TAX/FEES/CHGS  TOTAL",
						"25 QTJP/CH25* Q/E       CAD     581.00    86.86      667.86 C05",
						"26 QTJP/CH25* Q/K       CAD     605.00    86.86      691.86 C05",
						"27 HTJP/CH25* H/E       CAD     616.00    86.86      702.86 C05",
						"28 QTJP/CH25* Q/X       CAD     625.00    86.86      711.86 C05",
						"29 HTJP/CH25* H/K       CAD     641.00    86.86      727.86 C05",
						"30 QTJP/CH25* Q/E       CAD     645.00    99.72      744.72 C05",
						"31 HTJP/CH25* H/X       CAD     661.00    86.86      747.86 C05",
						"32 MTJP/CH25* M/E       CAD     665.00    86.86      751.86 C05",
						"33 QTJP/CH25* Q/B       CAD     675.00    86.86      761.86 C05",
						"34 MTJP/CH25* M/K       CAD     690.00    86.86      776.86 C05",
						"35 QTJP/CH25* Q/K       CAD     678.00    99.72      777.72 C05",
						"36 HTJP/CH25* H/E       CAD     679.00    99.72      778.72 C05",
						"37 QTJP-ETJP* Q/E       CAD     704.00    86.86      790.86 C05",
						"38 MTJP/CH25* M/X       CAD     710.00    86.86      796.86 C05",
						"39 QTJP/CH25* Q/X       CAD     704.00    99.72      803.72 C05",
						"40 LTJP/CH25* L/E       CAD     724.00    86.86      810.86 C05",
						"41 HTJP/CH25* H/K       CAD     712.00    99.72      811.72 C05",
						"42 QTJP-KTJP* Q/K       CAD     729.00    86.86      815.86 C05",
						"43 MTJP/CH25* M/E       CAD     729.00    99.72      828.72 C05",
						"44 QTJP-XTJP* Q/X       CAD     749.00    86.86      835.86 C05",
						"45 HTJP-ETJP* H/E       CAD     751.00    86.86      837.86 C05",
						"46 HTJP/CH25* H/X       CAD     739.00    99.72      838.72 C05",
						"47 QTJP/CH25  Q/Q       CAD     760.00    86.86      846.86 C05",
						"48 MTJP/CH25* M/K       CAD     763.00    99.72      862.72 C05",
						"ATTN*REBOOK OPTION OF CHOICE BEFORE STORING FARE",
						".</Response></SabreCommandLLSRS></soap-env:Body></soap-env:Envelope>",
					].join("\n"),
				},
			],
		});

		return list.map(c => [c]);
	}

	/**
	 * @test
	 * @dataProvider provideActionTestCases
	 */
	async testAction(testCase) {
		const commandsLeft = testCase.sessionInfo.performedCommands;

		testCase.fullState = {
			gds: 'sabre', area: 'A', areas: {
				'A': GdsSessions.makeDefaultAreaState('sabre'),
			},
		};

		/** @param stateful = require('StatefulSession.js')() */
		const getActual = async ({stateful, input, gdsClients}) => {
			const actual = await RunCmdRq({
				...input,
				stateful,
				useXml: true,
				gdsClients,
			});

			actual.sessionData = stateful.getSessionData();
			return actual;
		};

		await GdsActionTestUtil.testHttpGdsAction({unit: this, testCase, getActual});
		this.assertEquals([], commandsLeft, 'some unused commands left');
	}

	getTestMapping() {
		return [
			[this.provideActionTestCases, this.testAction],
		];
	}
}

module.exports = RunCmdRqXmlTest;
