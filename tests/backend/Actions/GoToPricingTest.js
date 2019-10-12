const stubAirports = require('../../data/stubAirports.js');
const GdsSessions = require('../../../backend/Repositories/GdsSessions.js');
const GoToPricing = require('../../../backend/Actions/GoToPricing.js');
const GdsActionTestUtil = require('../../../backend/Utils/Testing/GdsActionTestUtil.js');
const {nonEmpty} = require('klesun-node-tools/src/Lang.js');

const provide_call = () => {
	const testCases = [];

	testCases.push({
		title: 'First and last segments have no marriage, but segments in between do have it - should sort the itinerary after rebook, as the order will be messed up by splitting segments by marriage',
		input: {
			rqBody: {
				"pricingGds": "apollo",
				"pricingPcc": "2F3K",
				"pricingCmd": "$B/*JWZ",
				"pricingAction": "price",
				"itinerary": [
					{"segmentNumber":"1","segmentStatus":"GK","airline":"UA","seatCount":"1","departureAirport":"PHX","destinationAirport":"IAH","bookingClass":"W","flightNumber":"1638","marriage":0,"departureDt":{"full":"2019-10-25 07:55:00"}},
					{"segmentNumber":"2","segmentStatus":"GK","airline":"LH","seatCount":"1","departureAirport":"IAH","destinationAirport":"FRA","bookingClass":"W","flightNumber":"441","marriage":1,"departureDt":{"full":"2019-10-25 15:55:00"}},
					{"segmentNumber":"3","segmentStatus":"GK","airline":"LH","seatCount":"1","departureAirport":"FRA","destinationAirport":"AMM","bookingClass":"W","flightNumber":"692","marriage":1,"departureDt":{"full":"2019-10-26 21:00:00"}},
					{"segmentNumber":"4","segmentStatus":"GK","airline":"LH","seatCount":"1","departureAirport":"AMM","destinationAirport":"FRA","bookingClass":"W","flightNumber":"693","marriage":2,"departureDt":{"full":"2019-11-14 02:40:00"}},
					{"segmentNumber":"5","segmentStatus":"GK","airline":"LH","seatCount":"1","departureAirport":"FRA","destinationAirport":"LAX","bookingClass":"W","flightNumber":"456","marriage":2,"departureDt":{"full":"2019-11-14 10:25:00"}},
					{"segmentNumber":"6","segmentStatus":"GK","airline":"UA","seatCount":"1","departureAirport":"LAX","destinationAirport":"PHX","bookingClass":"W","flightNumber":"5512","marriage":0,"departureDt":{"full":"2019-11-14 16:55:00"}}
				],
			},
		},
		fullState: {
			gds: 'apollo',
			gdsData: {
				sessionToken: 'ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhqUSwox3VCxdjGosDIffaMsB0vMb0bvaZULJYa92mekyEi29X+eyg80OXkjrXLaXs',
			},
			area: 'A',
			areas: {
				'A': {...GdsSessions.makeDefaultAreaState('apollo'), area: 'A', hasPnr: true},
			},
		},
		output: {
			calledCommands: [
				{cmd: '$B/*JWZ'},
			],
			pricingBlockList: [{
				fareInfo: {
					totalFare: {currency: 'USD', amount: '1447.75'},
				},
			}],
		},
		httpRequests: [
			{
				"cmd": "I",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhqUSwox3VCxdjGosDIffaMsB0vMb0bvaZULJYa92mekyEi29X+eyg80OXkjrXLaXs</ns1:Token><ns1:Request>I</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">THIS IS A NEW PNR-ALL DATA WILL BE IGNORED WITH NEXT I OR IR",
					"&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "I",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhqUSwox3VCxdjGosDIffaMsB0vMb0bvaZULJYa92mekyEi29X+eyg80OXkjrXLaXs</ns1:Token><ns1:Request>I</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">IGND ",
					"&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "<PNRBFManagement_51/>",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\">",
					"\t\t\t<SOAP-ENV:Body>",
					"\t\t\t\t<ns1:SubmitXmlOnSession>",
					"\t\t\t\t\t<ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhqUSwox3VCxdjGosDIffaMsB0vMb0bvaZULJYa92mekyEi29X+eyg80OXkjrXLaXs</ns1:Token>",
					"\t\t\t\t\t<ns1:Request>",
					"\t\t\t\t\t\t<PNRBFManagement_51>",
					"\t\t\t\t\t\t\t<SessionMods><AreaInfoReq/></SessionMods><AirSegSellMods><AirSegSell><Vnd>UA</Vnd><FltNum>1638</FltNum><Class>Y</Class><StartDt>20191025</StartDt><StartAirp>PHX</StartAirp><EndAirp>IAH</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>LH</Vnd><FltNum>0441</FltNum><Class>Y</Class><StartDt>20191025</StartDt><StartAirp>IAH</StartAirp><EndAirp>FRA</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>LH</Vnd><FltNum>0692</FltNum><Class>Y</Class><StartDt>20191026</StartDt><StartAirp>FRA</StartAirp><EndAirp>AMM</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>LH</Vnd><FltNum>0693</FltNum><Class>Y</Class><StartDt>20191114</StartDt><StartAirp>AMM</StartAirp><EndAirp>FRA</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>LH</Vnd><FltNum>0456</FltNum><Class>Y</Class><StartDt>20191114</StartDt><StartAirp>FRA</StartAirp><EndAirp>LAX</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>UA</Vnd><FltNum>5512</FltNum><Class>Y</Class><StartDt>20191114</StartDt><StartAirp>LAX</StartAirp><EndAirp>PHX</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell></AirSegSellMods><PNRBFRetrieveMods><CurrentPNR/></PNRBFRetrieveMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>1</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>2</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>3</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>4</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>5</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>6</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>7</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>8</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods>",
					"\t\t\t\t\t\t</PNRBFManagement_51>",
					"\t\t\t\t\t</ns1:Request>",
					"\t\t\t\t\t<ns1:Filter>",
					"\t\t\t\t\t\t<_/>",
					"\t\t\t\t\t</ns1:Filter>",
					"\t\t\t\t</ns1:SubmitXmlOnSession>",
					"\t\t\t</SOAP-ENV:Body>",
					"\t\t</SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitXmlOnSessionResponse xmlns=\"http://webservices.galileo.com\"><SubmitXmlOnSessionResult><PNRBFManagement_51 xmlns=\"\"><SessionInfo><AreaInfoResp><Sys>1V</Sys><Processor>D</Processor><GrpModeActivatedInd>N</GrpModeActivatedInd><AAAAreaAry><AAAAreaInfo><AAAArea>A</AAAArea><ActiveInd>Y</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials>WS</AgntInitials><Duty>AG</Duty><AgncyPCC>2F3K</AgncyPCC><DomMode>BASIC</DomMode><IntlMode>US-ECAC</IntlMode><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>B</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>C</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>D</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>E</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo></AAAAreaAry></AreaInfoResp></SessionInfo><AirSegSell><AirSell><DisplaySequenceNumber/><Vnd>UA</Vnd><FltNum>1638</FltNum><OpSuf/><Class>Y</Class><StartDt>20191025</StartDt><DtChg>0</DtChg><StartAirp>PHX</StartAirp><EndAirp>IAH</EndAirp><StartTm>755</StartTm><EndTm>1230</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt><![CDATA[DEPARTS PHX TERMINAL 2  - ARRIVES IAH TERMINAL C]]></Txt></TextMsg><AirSell><DisplaySequenceNumber/><Vnd>LH</Vnd><FltNum>441</FltNum><OpSuf/><Class>Y</Class><StartDt>20191025</StartDt><DtChg>1</DtChg><StartAirp>IAH</StartAirp><EndAirp>FRA</EndAirp><StartTm>1555</StartTm><EndTm>840</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt><![CDATA[DEPARTS IAH TERMINAL D  - ARRIVES FRA TERMINAL 1]]></Txt></TextMsg><AirSell><DisplaySequenceNumber/><Vnd>LH</Vnd><FltNum>692</FltNum><OpSuf/><Class>Y</Class><StartDt>20191026</StartDt><DtChg>1</DtChg><StartAirp>FRA</StartAirp><EndAirp>AMM</EndAirp><StartTm>2100</StartTm><EndTm>110</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt>DEPARTS FRA TERMINAL 1</Txt></TextMsg><AirSell><DisplaySequenceNumber/><Vnd>LH</Vnd><FltNum>693</FltNum><OpSuf/><Class>Y</Class><StartDt>20191114</StartDt><DtChg>0</DtChg><StartAirp>AMM</StartAirp><EndAirp>FRA</EndAirp><StartTm>240</StartTm><EndTm>625</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt><![CDATA[                         ARRIVES FRA TERMINAL 1]]></Txt></TextMsg><AirSell><DisplaySequenceNumber/><Vnd>LH</Vnd><FltNum>456</FltNum><OpSuf/><Class>Y</Class><StartDt>20191114</StartDt><DtChg>0</DtChg><StartAirp>FRA</StartAirp><EndAirp>LAX</EndAirp><StartTm>1025</StartTm><EndTm>1315</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt><![CDATA[DEPARTS FRA TERMINAL 1  - ARRIVES LAX TERMINAL B]]></Txt></TextMsg><AirSell><DisplaySequenceNumber/><Vnd>UA</Vnd><FltNum>5512</FltNum><OpSuf/><Class>Y</Class><StartDt>20191114</StartDt><DtChg>0</DtChg><StartAirp>LAX</StartAirp><EndAirp>PHX</EndAirp><StartTm>1655</StartTm><EndTm>1919</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt><![CDATA[OFFER CAR/HOTEL    |CAL\t     |HOA\t]]></Txt></TextMsg><TextMsg><Txt>OPERATED BY SKYWEST DBA UNITED EXPRESS</Txt></TextMsg><TextMsg><Txt><![CDATA[DEPARTS LAX TERMINAL 7  - ARRIVES PHX TERMINAL 2]]></Txt></TextMsg><TextMsg><Txt>ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS</Txt></TextMsg><TextMsg><Txt>PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION</Txt></TextMsg><TextMsg><Txt>WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES</Txt></TextMsg><TextMsg><Txt>FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES</Txt></TextMsg><TextMsg><Txt>THIS AIRLINE SUPPORTS CLAIM PNR - UA</Txt></TextMsg><TextMsg><Txt>TO REQUEST CLAIM PNR PLEASE IGNORE AND ENTER THE</Txt></TextMsg><TextMsg><Txt>AIRLINES INFORMATION IN ONE OF THE FOLLOWING FORMATS -</Txt></TextMsg><TextMsg><Txt><![CDATA[L@UA/*(RECORD LOCATOR)  OR  L@UA/*UA1638/25OCT-(NAME)]]></Txt></TextMsg></AirSegSell><PNRBFRetrieve><Control><KLRCnt>10</KLRCnt><KlrAry><Klr><ID>BP08</ID><NumOccur>1</NumOccur></Klr><Klr><ID>IT01</ID><NumOccur>6</NumOccur></Klr><Klr><ID>IT02</ID><NumOccur>1</NumOccur></Klr></KlrAry></Control><GenPNRInfo><FileAddr/><CodeCheck/><RecLoc/><Ver>0</Ver><OwningCRS>1V</OwningCRS><OwningAgncyName>INTERNATIONAL TRAVEL NET</OwningAgncyName><OwningAgncyPCC>2F3K</OwningAgncyPCC><CreationDt/><CreatingAgntSignOn/><CreatingAgntDuty/><CreatingAgncyIATANum/><OrigBkLocn/><SATONum/><PTAInd>N</PTAInd><InUseInd/><SimultaneousUpdInd/><BorrowedInd>N</BorrowedInd><GlobInd>N</GlobInd><ReadOnlyInd>N</ReadOnlyInd><FareDataExistsInd>N</FareDataExistsInd><PastDtQuickInd>N</PastDtQuickInd><CurAgncyPCC>2F3K</CurAgncyPCC><QInd>N</QInd><TkNumExistInd>N</TkNumExistInd><IMUdataexists>Y</IMUdataexists><ETkDataExistInd>N</ETkDataExistInd><CurDtStamp>20191012</CurDtStamp><CurTmStamp>080521</CurTmStamp><CurAgntSONID>DPBVWS</CurAgntSONID><TravInsuranceInd>N</TravInsuranceInd><PNRBFTicketedInd>N</PNRBFTicketedInd><ZeppelinAgncyInd>N</ZeppelinAgncyInd><AgncyAutoServiceInd>N</AgncyAutoServiceInd><AgncyAutoNotifyInd>N</AgncyAutoNotifyInd><ZeppelinPNRInd>N</ZeppelinPNRInd><PNRAutoServiceInd>N</PNRAutoServiceInd><PNRNotifyInd/><SuperPNRInd>N</SuperPNRInd><PNRBFPurgeDt>NO PURGE</PNRBFPurgeDt><PNRBFChangeInd>Y</PNRBFChangeInd><MCODataExists>N</MCODataExists><OrigRcvdField/><IntContExists/><AllDataAllTime>N</AllDataAllTime><LastActAgntID/><TransPCCName>INTERNATIONAL TRAVEL NET</TransPCCName><URrecordLoc/><UROSindLoc>N</UROSindLoc><URRCBInd>N</URRCBInd><GMTPNRBFCreationDt/><PricingRecordExist>N</PricingRecordExist><ArchivedFeeDataExists>N</ArchivedFeeDataExists><LeisureshopperDataExists>N</LeisureshopperDataExists><SeatDataExists>N</SeatDataExists><FrequentFlyerDataExists>N</FrequentFlyerDataExists><NetTicketDataExists>N</NetTicketDataExists><TinsRemarksExist>N</TinsRemarksExist><ElectronicDataExists>N</ElectronicDataExists><AdditionalItineraryDataExists>N</AdditionalItineraryDataExists><GroupAllocationFileExists>N</GroupAllocationFileExists><ProfileAssociationsExist>N</ProfileAssociationsExist><VendorLocatorDataExists>N</VendorLocatorDataExists><BookingCodeDataExists/><ArneDataExists>N</ArneDataExists><TimaticDataExists>N</TimaticDataExists><LinearFareDataExists>N</LinearFareDataExists><ItineraryRemarksExist>N</ItineraryRemarksExist><IdentificationFieldExists>N</IdentificationFieldExists><EmailAddressExists>N</EmailAddressExists><RuleDataExists>N</RuleDataExists><LSVendorConfirmationExists>N</LSVendorConfirmationExists><AdditionalSrvcs>N</AdditionalSrvcs><ElectronicMiscDocumentList>N</ElectronicMiscDocumentList><TDSProfileExists>N</TDSProfileExists><ServiceInformationExists/><FiledFareDataExists/><VendorRemarksDataExists/><MembershipDataExists/><DividedBookingsExist>N</DividedBookingsExist><ClientFileReferencesExist/><CustomCheckRulesExist/><PassengerInformationExists/><GUID/><ARCNewPNR/><ARCFares/><ARCTicketed/><ARCSplitDivide/><ARCNameAdd/><ARCNameDelete/><ARCItinAdd/><ARCItinDEL/><ARCPhoneAdd/><ARCPhoneDel/><ARCFOPAdd/><ARCFOPDelete/><ARCSSRAdd/><ARCSSRDel/><ARCOSIAdd/><ARCOSIDel/><ReasonCodesspares/></GenPNRInfo><AirSeg><SegNum>1</SegNum><Status>GK</Status><Dt>20191025</Dt><DayChg>00</DayChg><AirV>UA</AirV><NumPsgrs>1</NumPsgrs><StartAirp>PHX</StartAirp><EndAirp>IAH</EndAirp><StartTm>755</StartTm><EndTm>1230</EndTm><BIC>Y</BIC><FltNum>1638</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>GK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg><AirSeg><SegNum>2</SegNum><Status>GK</Status><Dt>20191025</Dt><DayChg>01</DayChg><AirV>LH</AirV><NumPsgrs>1</NumPsgrs><StartAirp>IAH</StartAirp><EndAirp>FRA</EndAirp><StartTm>1555</StartTm><EndTm>840</EndTm><BIC>Y</BIC><FltNum>441</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>Y</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>GK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg><AirSeg><SegNum>3</SegNum><Status>GK</Status><Dt>20191026</Dt><DayChg>01</DayChg><AirV>LH</AirV><NumPsgrs>1</NumPsgrs><StartAirp>FRA</StartAirp><EndAirp>AMM</EndAirp><StartTm>2100</StartTm><EndTm>110</EndTm><BIC>Y</BIC><FltNum>692</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>Y</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>GK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg><AirSeg><SegNum>4</SegNum><Status>GK</Status><Dt>20191114</Dt><DayChg>00</DayChg><AirV>LH</AirV><NumPsgrs>1</NumPsgrs><StartAirp>AMM</StartAirp><EndAirp>FRA</EndAirp><StartTm>240</StartTm><EndTm>625</EndTm><BIC>Y</BIC><FltNum>693</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>GK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg><AirSeg><SegNum>5</SegNum><Status>GK</Status><Dt>20191114</Dt><DayChg>00</DayChg><AirV>LH</AirV><NumPsgrs>1</NumPsgrs><StartAirp>FRA</StartAirp><EndAirp>LAX</EndAirp><StartTm>1025</StartTm><EndTm>1315</EndTm><BIC>Y</BIC><FltNum>456</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>Y</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>GK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg><AirSeg><SegNum>6</SegNum><Status>GK</Status><Dt>20191114</Dt><DayChg>00</DayChg><AirV>UA</AirV><NumPsgrs>1</NumPsgrs><StartAirp>LAX</StartAirp><EndAirp>PHX</EndAirp><StartTm>1655</StartTm><EndTm>1919</EndTm><BIC>Y</BIC><FltNum>5512</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>Y</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>GK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd>Y</OpAirVInd></AirSeg><AirSegOpAirV><OpAirVInfoAry><OpAirVInfo><StartAirp>LAX</StartAirp><EndAirp>PHX</EndAirp><AirV/><AirVName>SKYWEST DBA UNITED EXPRESS</AirVName></OpAirVInfo></OpAirVInfoAry></AirSegOpAirV></PNRBFRetrieve><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote></PNRBFManagement_51></SubmitXmlOnSessionResult></SubmitXmlOnSessionResponse></soapenv:Body></soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "X1+6/01W+6W",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhqUSwox3VCxdjGosDIffaMsB0vMb0bvaZULJYa92mekyEi29X+eyg80OXkjrXLaXs</ns1:Token><ns1:Request>X1+6/01W+6W</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">   UA 1638W  25OCT PHXIAH SS1   755A 1230P *                 E",
					"ADV PAX FLT ARRIVES TERMINAL-C *",
					"ADV PAX FLT DEPARTS TERMINAL-2 *",
					" 73C *",
					"DEPARTS PHX TERMINAL 2  - ARRIVES IAH TERMINAL C ",
					"   UA 5512W  14NOV LAXPHX SS1   455P  719P *                 E",
					"ADV PAX FLT ARRIVES TERMINAL-2 *",
					"ADV PAX FLT DEPARTS TERMINAL-7 *",
					"OPERATED BY-SKYWEST DBA UNITED EXPRESS *",
					" E75 *",
					"OFFER CAR/HOTEL    &gt;CAL;     &gt;HOA;",
					"OPERATED BY SKYWEST DBA UNITED EXPRESS",
					"DEPARTS LAX TERMINAL 7  - ARRIVES PHX TERMINAL 2 ",
					")&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "MR",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhqUSwox3VCxdjGosDIffaMsB0vMb0bvaZULJYa92mekyEi29X+eyg80OXkjrXLaXs</ns1:Token><ns1:Request>MR</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">CANCEL REQUEST COMPLETED",
					"&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "X2+3/02W+3W",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhqUSwox3VCxdjGosDIffaMsB0vMb0bvaZULJYa92mekyEi29X+eyg80OXkjrXLaXs</ns1:Token><ns1:Request>X2+3/02W+3W</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">   LH  441W  25OCT IAHFRA SS1   355P  840A|*      1          E",
					"SEC FLT PSGR DATA REQUIRED 72 HBD SSR DOCS *",
					"US LAW SEE GGAIRLH PNR ACCESS OR NEWS KEYWORDS *",
					"ESTA REQUIRED FOR VISA WAIVER NATIONALS *",
					"PLS ADD PAX MOBILE CTC FOR IRREG COMMUNICATION *",
					"DEPARTS IAH TERMINAL D  - ARRIVES FRA TERMINAL 1 ",
					"   LH  692W  26OCT FRAAMM SS1   900P  110A|*      1          E",
					"PLS ADD PAX MOBILE CTC FOR IRREG COMMUNICATION *",
					"OFFER CAR/HOTEL    &gt;CAL;     &gt;HOA;",
					"DEPARTS FRA TERMINAL 1 ",
					"ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
					"PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
					"WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
					")&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "MR",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhqUSwox3VCxdjGosDIffaMsB0vMb0bvaZULJYa92mekyEi29X+eyg80OXkjrXLaXs</ns1:Token><ns1:Request>MR</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
					"CANCEL REQUEST COMPLETED",
					"&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "X4+5/04W+5W",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhqUSwox3VCxdjGosDIffaMsB0vMb0bvaZULJYa92mekyEi29X+eyg80OXkjrXLaXs</ns1:Token><ns1:Request>X4+5/04W+5W</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">   LH  693W  14NOV AMMFRA SS1   240A  625A *      2          E",
					"PLS ADD PAX MOBILE CTC FOR IRREG COMMUNICATION *",
					"                         ARRIVES FRA TERMINAL 1 ",
					"   LH  456W  14NOV FRALAX SS1  1025A  115P *      2          E",
					"SEC FLT PSGR DATA REQUIRED 72 HBD SSR DOCS *",
					"US LAW SEE GGAIRLH PNR ACCESS OR NEWS KEYWORDS *",
					"ESTA REQUIRED FOR VISA WAIVER NATIONALS *",
					"PLS ADD PAX MOBILE CTC FOR IRREG COMMUNICATION *",
					"OFFER CAR/HOTEL    &gt;CAL;     &gt;HOA;",
					"DEPARTS FRA TERMINAL 1  - ARRIVES LAX TERMINAL B ",
					"ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
					"PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
					"WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
					")&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "MR",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhqUSwox3VCxdjGosDIffaMsB0vMb0bvaZULJYa92mekyEi29X+eyg80OXkjrXLaXs</ns1:Token><ns1:Request>MR</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
					"CANCEL REQUEST COMPLETED",
					"&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "*R",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhqUSwox3VCxdjGosDIffaMsB0vMb0bvaZULJYa92mekyEi29X+eyg80OXkjrXLaXs</ns1:Token><ns1:Request>*R</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">NO NAMES",
					" 1 UA1638W 25OCT PHXIAH SS1   755A 1230P *         FR   E",
					" 2 LH 441W 25OCT IAHFRA SS1   355P  840A|*      FR/SA   E  1",
					" 3 LH 692W 26OCT FRAAMM SS1   900P  110A|*      SA/SU   E  1",
					" 4 LH 693W 14NOV AMMFRA SS1   240A  625A *         TH   E  2",
					" 5 UA5512W 14NOV LAXPHX SS1   455P  719P *         TH   E",
					"         OPERATED BY SKYWEST DBA UNITED EXPRESS",
					" 6 LH 456W 14NOV FRALAX SS1  1025A  115P *         TH   E  2",
					"&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "/0/1|2|3|4|6|5",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhqUSwox3VCxdjGosDIffaMsB0vMb0bvaZULJYa92mekyEi29X+eyg80OXkjrXLaXs</ns1:Token><ns1:Request>/0/1|2|3|4|6|5</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\"> 1 UA1638W 25OCT PHXIAH SS1   755A 1230P *         FR   E",
					" 2 LH 441W 25OCT IAHFRA SS1   355P  840A|*      FR/SA   E  1",
					" 3 LH 692W 26OCT FRAAMM SS1   900P  110A|*      SA/SU   E  1",
					" 4 LH 693W 14NOV AMMFRA SS1   240A  625A *         TH   E  2",
					" 5 LH 456W 14NOV FRALAX SS1  1025A  115P *         TH   E  2",
					" 6 UA5512W 14NOV LAXPHX SS1   455P  719P *         TH   E",
					"         OPERATED BY SKYWEST DBA UNITED EXPRESS",
					"&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "$B/*JWZ",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhqUSwox3VCxdjGosDIffaMsB0vMb0bvaZULJYa92mekyEi29X+eyg80OXkjrXLaXs</ns1:Token><ns1:Request>$B/*JWZ</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">&gt;$B/*JWZ/-*2F3K",
					"*FARE HAS A PLATING CARRIER RESTRICTION*",
					"E-TKT REQUIRED",
					"        **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE &gt;$B/DASO;",
					"** PRIVATE FARES SELECTED **  ",
					"*PENALTY APPLIES*",
					"BEST FARE FOR PSGR TYPE",
					"TICKETING WITHIN 72 HOURS AFTER RESERVATION",
					"LAST DATE TO PURCHASE TICKET: 15OCT19 / 0705 SFO",
					"$B-1 A12OCT19     ",
					"PHX UA X/HOU LH X/FRA LH AMM 405.00WK106RCE/CN10 LH X/FRA LH",
					"X/LAX UA PHX 405.00WK106RCE/CN10 NUC810.00END ROE1.0",
					"FARE USD 810.00 TAX 11.20AY TAX 37.20US TAX 3.96XA TAX 13.50XF",
					")&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "MR",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhqUSwox3VCxdjGosDIffaMsB0vMb0bvaZULJYa92mekyEi29X+eyg80OXkjrXLaXs</ns1:Token><ns1:Request>MR</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">TAX 7.00XY TAX 5.89YC TAX 21.00DE TAX 47.00RA TAX 2.90D9 TAX",
					"56.40HQ TAX 14.20NH TAX 400.00YQ TAX 17.50YR TOT USD 1447.75  ",
					"S1 NVB25OCT/NVA25OCT",
					"S2 NVB25OCT/NVA25OCT",
					"S3 NVB26OCT/NVA26OCT",
					"S4 NVB14NOV/NVA14NOV",
					"S5 NVB14NOV/NVA14NOV",
					"S6 NVB14NOV/NVA14NOV",
					"E REFTHRUAG/NONEND/NONRERTE/",
					"E LH/UA/AC/OS/SN/LX ONLY",
					"TOUR CODE: BT294UA        ",
					"TICKETING AGENCY 2F3K",
					"DEFAULT PLATING CARRIER LH",
					")&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "MR",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhqUSwox3VCxdjGosDIffaMsB0vMb0bvaZULJYa92mekyEi29X+eyg80OXkjrXLaXs</ns1:Token><ns1:Request>MR</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">US PFC: XF PHX4.5 IAH4.5 LAX4.5 ",
					"BAGGAGE ALLOWANCE",
					"ADT                                                         ",
					" UA PHXAMM  1PC                                             ",
					"   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM",
					"   BAG 2 -  100.00 USD   UPTO50LB/23KG AND UPTO62LI/158LCM",
					"   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/UA",
					"                                                                 UA AMMPHX  1PC                                             ",
					"   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM",
					"   BAG 2 -  100.00 USD   UPTO50LB/23KG AND UPTO62LI/158LCM",
					"   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/UA",
					"                                                                )&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "MR",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhqUSwox3VCxdjGosDIffaMsB0vMb0bvaZULJYa92mekyEi29X+eyg80OXkjrXLaXs</ns1:Token><ns1:Request>MR</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">CARRY ON ALLOWANCE",
					" UA PHXHOU  1PC                                             ",
					"   BAG 1 -  NO FEE       CARRY ON HAND BAGGAGE            ",
					" LH HOUFRA  1PC                                             ",
					"   BAG 1 -  NO FEE       UPTO18LB/8KG AND UPTO46LI/118LCM ",
					" LH FRAAMM  1PC                                             ",
					"   BAG 1 -  NO FEE       UPTO18LB/8KG AND UPTO46LI/118LCM ",
					" LH AMMFRA  1PC                                             ",
					"   BAG 1 -  NO FEE       UPTO18LB/8KG AND UPTO46LI/118LCM ",
					" LH FRALAX  1PC                                             ",
					"   BAG 1 -  NO FEE       UPTO18LB/8KG AND UPTO46LI/118LCM ",
					" UA LAXPHX  1PC                                             ",
					"   BAG 1 -  NO FEE       CARRY ON HAND BAGGAGE            ",
					")&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "MR",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>ZvuhYvlsIuN8GB1+ylEeuRThGYp1BUBb5dik/qVCBTK7a0OVT/Wy0bGSsrh2g6vhqUSwox3VCxdjGosDIffaMsB0vMb0bvaZULJYa92mekyEi29X+eyg80OXkjrXLaXs</ns1:Token><ns1:Request>MR</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/",
					"ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.",
					"&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			}
		],
	});

	return testCases.map(c => [c]);
};

class GoToPricingTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js') {
	async test_call(testCase) {
		const gds = testCase.input.gds;
		testCase.fullState = testCase.fullState || {
			gds: gds, area: 'A', areas: {
				'A': {...GdsSessions.makeDefaultAreaState(gds), area: 'A'},
			},
		};
		await GdsActionTestUtil.testHttpGdsAction({
			unit: this,
			testCase: testCase,
			getActual: ({stateful, input, gdsClients}) =>
				GoToPricing({
					stateful, gdsClients, Airports: {
						findByCode: code => nonEmpty
							('Code #' + code + ' not supplied by test')
							(stubAirports.filter(row => row.iata_code === code)[0]),
						findByCity: code => nonEmpty
							('Code #' + code + ' not supplied by test')
							(stubAirports.filter(row => row.city_code === code)[0]),
					}, ...input,
				}),
		});
	}

	getTestMapping() {
		return [
			[provide_call, this.test_call],
		];
	}
}

module.exports = GoToPricingTest;
