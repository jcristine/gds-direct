const PersistentHttpRqStub = require('../../../../../../../backend/Utils/Testing/PersistentHttpRqStub.js');
const TravelportClient = require('../../../../../../../backend/GdsClients/TravelportClient.js');

const RunCmdRq = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Apollo/RunCmdRq.js');
const GdsDirectDefaults = require('../../../../../../../backend/Utils/Testing/GdsDirectDefaults.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');
const php = require('../../../../php.js');

const provide_call = () => {
	let testCases = [];

	testCases.push({
		title: 'simple A20MAYJFKMNL XML test case',
		input: {
			cmdRq: 'A20MAYJFKMNL',
		},
		output: {
			status: 'executed',
			calledCommands: [
				{
					cmd: 'A20MAYJFKMNL',
					output: [
						'NEUTRAL DISPLAY*   WE 20MAY NYCMNL|12:00 HR                     1| PR 127 J9 C9 D9 I9 Z6 W9 N9 Y9 S9 L9|JFKMNL 145A  615A|350  02| UA7998 J9 C9 D9 Z9 P9 O9 A9 R6 Y9 B9|JFKNRT1200N  300P|77W* 03| DL 181 J9 C9 D9 I9 Z9 W9 S9 Y9 B9 M9|   MNL 400P| 755P|76W  04| KE  82 P0 F0 A0 J9 C9 D9 I9 R9 Z9 Y9|JFKICN 200P  520P|388  05| KE 623 F0 A0 J9 C9 D9 I9 R9 Z9 Y9 B9|   MNL 645P| 955P|773  06| NH   9 F6 A3 J9 C9 D9 Z9 P9 G9 E9 N6|JFKNRT1200N  300P|77W  07| DL 181 J9 C9 D9 I9 Z9 W9 S9 Y9 B9 M9|   MNL 400P| 755P|76W  0MEALS>A*M;  CLASSES>A*C;..  JOURNEY TIME >A*J;  ><',
					].join(''),
				},
			],
		},
		httpRequests: [{
			rq: [
				'<?xml version="1.0" encoding="UTF-8"?>',
				'	<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>A20MAYJFKMNL</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>',
			].join('\n'),
			rs: [
				'<?xml version="1.0" encoding="UTF-8"?>',
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
				' <soapenv:Body><SubmitTerminalTransactionResponse xmlns="http://webservices.galileo.com"><SubmitTerminalTransactionResult USM="false">NEUTRAL DISPLAY*   WE 20MAY NYCMNL|12:00 HR                     1| PR 127 J9 C9 D9 I9 Z6 W9 N9 Y9 S9 L9|JFKMNL 145A  615A|350  02| UA7998 J9 C9 D9 Z9 P9 O9 A9 R6 Y9 B9|JFKNRT1200N  300P|77W* 03| DL 181 J9 C9 D9 I9 Z9 W9 S9 Y9 B9 M9|   MNL 400P| 755P|76W  04| KE  82 P0 F0 A0 J9 C9 D9 I9 R9 Z9 Y9|JFKICN 200P  520P|388  05| KE 623 F0 A0 J9 C9 D9 I9 R9 Z9 Y9 B9|   MNL 645P| 955P|773  06| NH   9 F6 A3 J9 C9 D9 Z9 P9 G9 E9 N6|JFKNRT1200N  300P|77W  07| DL 181 J9 C9 D9 I9 Z9 W9 S9 Y9 B9 M9|   MNL 400P| 755P|76W  0MEALS&gt;A*M;  CLASSES&gt;A*C;..  &gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>',
				'</soapenv:Envelope>',
			].join('\n'),
		}],
	});

	testCases.push({
		title: 'simple XML itinerary build example',
		input: {
			cmdRq: [
				" 1 AA 670Q 26AUG STLLAX GK1   520P  716P           MO",
				" 2 PR 103U 26AUG LAXMNL GK1  1030P  400A2       MO/WE",
				" 3 PR 112U 30AUG MNLLAX GK1  1125A 1000A           FR",
				" 4 AA 803Q 30AUG LAXSTL GK1   726P 1258A|       FR/SA",
				"",
			].join("\n"),
		},
		output: {
			status: 'executed',
			calledCommands: [{
				cmd: '*R',
				output: [
					"NO NAMES",
					" 1 AA 670Q 26AUG STLLAX GK1   520P  716P           MO",
					" 2 PR 103U 26AUG LAXMNL GK1  1030P  400A2       MO/WE",
					" 3 PR 112U 30AUG MNLLAX GK1  1125A 1000A           FR",
					" 4 AA 803Q 30AUG LAXSTL GK1   726P 1258A|       FR/SA",
					"",
				].join("\n"),
			}],
		},
		httpRequests: [
			{
				rq: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'		<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com">',
					'			<SOAP-ENV:Body>',
					'				<ns1:SubmitXmlOnSession>',
					'					<ns1:Token>soap-unit-test-blabla-123</ns1:Token>',
					'					<ns1:Request>',
					'						<PNRBFManagement_51>',
					'							<SessionMods><AreaInfoReq/></SessionMods><PNRBFRetrieveMods><CurrentPNR/></PNRBFRetrieveMods><AirSegSellMods><AirSegSell><Vnd>AA</Vnd><FltNum>0670</FltNum><Class>Q</Class><StartDt>20190826</StartDt><StartAirp>STL</StartAirp><EndAirp>LAX</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>PR</Vnd><FltNum>0103</FltNum><Class>U</Class><StartDt>20190826</StartDt><StartAirp>LAX</StartAirp><EndAirp>MNL</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>PR</Vnd><FltNum>0112</FltNum><Class>U</Class><StartDt>20190830</StartDt><StartAirp>MNL</StartAirp><EndAirp>LAX</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>AA</Vnd><FltNum>0803</FltNum><Class>Q</Class><StartDt>20190830</StartDt><StartAirp>LAX</StartAirp><EndAirp>STL</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell></AirSegSellMods>',
					'						</PNRBFManagement_51>',
					'					</ns1:Request>',
					'					<ns1:Filter>',
					'						<_/>',
					'					</ns1:Filter>',
					'				</ns1:SubmitXmlOnSession>',
					'			</SOAP-ENV:Body>',
					'		</SOAP-ENV:Envelope>',
				].join('\n'),
				rs: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
					' <soapenv:Body><SubmitXmlOnSessionResponse xmlns="http://webservices.galileo.com"><SubmitXmlOnSessionResult><PNRBFManagement_51 xmlns=""><SessionInfo><AreaInfoResp><Sys>1V</Sys><Processor>E</Processor><GrpModeActivatedInd>N</GrpModeActivatedInd><AAAAreaAry><AAAAreaInfo><AAAArea>A</AAAArea><ActiveInd>Y</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials>WS</AgntInitials><Duty>AG</Duty><AgncyPCC>2F3K</AgncyPCC><DomMode>BASIC</DomMode><IntlMode>US-ECAC</IntlMode><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>B</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>C</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>D</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>E</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo></AAAAreaAry></AreaInfoResp></SessionInfo><PNRBFRetrieve><Control><KLRCnt>3</KLRCnt><KlrAry><Klr><ID>BP08</ID><NumOccur>1</NumOccur></Klr></KlrAry></Control><GenPNRInfo><FileAddr/><CodeCheck/><RecLoc/><Ver>0</Ver><OwningCRS>1V</OwningCRS><OwningAgncyName>INTERNATIONAL TRAVEL NET</OwningAgncyName><OwningAgncyPCC>2F3K</OwningAgncyPCC><CreationDt/><CreatingAgntSignOn/><CreatingAgntDuty/><CreatingAgncyIATANum/><OrigBkLocn/><SATONum/><PTAInd>N</PTAInd><InUseInd/><SimultaneousUpdInd/><BorrowedInd>N</BorrowedInd><GlobInd>N</GlobInd><ReadOnlyInd>N</ReadOnlyInd><FareDataExistsInd>N</FareDataExistsInd><PastDtQuickInd>N</PastDtQuickInd><CurAgncyPCC>2F3K</CurAgncyPCC><QInd>N</QInd><TkNumExistInd>N</TkNumExistInd><IMUdataexists>Y</IMUdataexists><ETkDataExistInd>N</ETkDataExistInd><CurDtStamp>20190801</CurDtStamp><CurTmStamp>133247</CurTmStamp><CurAgntSONID>DPBVWS</CurAgntSONID><TravInsuranceInd>N</TravInsuranceInd><PNRBFTicketedInd>N</PNRBFTicketedInd><ZeppelinAgncyInd>N</ZeppelinAgncyInd><AgncyAutoServiceInd>N</AgncyAutoServiceInd><AgncyAutoNotifyInd>N</AgncyAutoNotifyInd><ZeppelinPNRInd>N</ZeppelinPNRInd><PNRAutoServiceInd>N</PNRAutoServiceInd><PNRNotifyInd/><SuperPNRInd>N</SuperPNRInd><PNRBFPurgeDt>NO PURGE</PNRBFPurgeDt><PNRBFChangeInd>N</PNRBFChangeInd><MCODataExists>N</MCODataExists><OrigRcvdField/><IntContExists/><AllDataAllTime>N</AllDataAllTime><LastActAgntID/><TransPCCName>INTERNATIONAL TRAVEL NET</TransPCCName><URrecordLoc/><UROSindLoc>N</UROSindLoc><URRCBInd>N</URRCBInd><GMTPNRBFCreationDt/><PricingRecordExist>N</PricingRecordExist><ArchivedFeeDataExists>N</ArchivedFeeDataExists><LeisureshopperDataExists>N</LeisureshopperDataExists><SeatDataExists>N</SeatDataExists><FrequentFlyerDataExists>N</FrequentFlyerDataExists><NetTicketDataExists>N</NetTicketDataExists><TinsRemarksExist>N</TinsRemarksExist><ElectronicDataExists>N</ElectronicDataExists><AdditionalItineraryDataExists>N</AdditionalItineraryDataExists><GroupAllocationFileExists>N</GroupAllocationFileExists><ProfileAssociationsExist>N</ProfileAssociationsExist><VendorLocatorDataExists>N</VendorLocatorDataExists><BookingCodeDataExists/><ArneDataExists>N</ArneDataExists><TimaticDataExists>N</TimaticDataExists><LinearFareDataExists>N</LinearFareDataExists><ItineraryRemarksExist>N</ItineraryRemarksExist><IdentificationFieldExists>N</IdentificationFieldExists><EmailAddressExists>N</EmailAddressExists><RuleDataExists>N</RuleDataExists><LSVendorConfirmationExists>N</LSVendorConfirmationExists><AdditionalSrvcs>N</AdditionalSrvcs><ElectronicMiscDocumentList>N</ElectronicMiscDocumentList><TDSProfileExists>N</TDSProfileExists><ServiceInformationExists/><FiledFareDataExists/><VendorRemarksDataExists/><MembershipDataExists/><DividedBookingsExist>N</DividedBookingsExist><ClientFileReferencesExist/><CustomCheckRulesExist/><PassengerInformationExists/><GUID/><ARCNewPNR/><ARCFares/><ARCTicketed/><ARCSplitDivide/><ARCNameAdd/><ARCNameDelete/><ARCItinAdd/><ARCItinDEL/><ARCPhoneAdd/><ARCPhoneDel/><ARCFOPAdd/><ARCFOPDelete/><ARCSSRAdd/><ARCSSRDel/><ARCOSIAdd/><ARCOSIDel/><ReasonCodesspares/></GenPNRInfo></PNRBFRetrieve><AirSegSell><AirSell><DisplaySequenceNumber/><Vnd>AA</Vnd><FltNum>670</FltNum><OpSuf/><Class>Q</Class><StartDt>20190826</StartDt><DtChg>0</DtChg><StartAirp>STL</StartAirp><EndAirp>LAX</EndAirp><StartTm>1720</StartTm><EndTm>1916</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt>DEPARTS STL TERMINAL 1</Txt></TextMsg><AirSell><DisplaySequenceNumber/><Vnd>PR</Vnd><FltNum>103</FltNum><OpSuf/><Class>U</Class><StartDt>20190826</StartDt><DtChg>2</DtChg><StartAirp>LAX</StartAirp><EndAirp>MNL</EndAirp><StartTm>2230</StartTm><EndTm>400</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt><![CDATA[DEPARTS LAX TERMINAL B  - ARRIVES MNL TERMINAL 1]]></Txt></TextMsg><AirSell><DisplaySequenceNumber/><Vnd>PR</Vnd><FltNum>112</FltNum><OpSuf/><Class>U</Class><StartDt>20190830</StartDt><DtChg>0</DtChg><StartAirp>MNL</StartAirp><EndAirp>LAX</EndAirp><StartTm>1125</StartTm><EndTm>1000</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt><![CDATA[DEPARTS MNL TERMINAL 2  - ARRIVES LAX TERMINAL B]]></Txt></TextMsg><AirSell><DisplaySequenceNumber/><Vnd>AA</Vnd><FltNum>803</FltNum><OpSuf/><Class>Q</Class><StartDt>20190830</StartDt><DtChg>1</DtChg><StartAirp>LAX</StartAirp><EndAirp>STL</EndAirp><StartTm>1926</StartTm><EndTm>58</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt><![CDATA[OFFER CAR/HOTEL    |CAL	     |HOA	]]></Txt></TextMsg><TextMsg><Txt><![CDATA[                         ARRIVES STL TERMINAL 1]]></Txt></TextMsg><TextMsg><Txt>ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS</Txt></TextMsg><TextMsg><Txt>PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION</Txt></TextMsg><TextMsg><Txt>WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES</Txt></TextMsg><TextMsg><Txt>FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES</Txt></TextMsg><TextMsg><Txt>THIS AIRLINE SUPPORTS CLAIM PNR - AA</Txt></TextMsg><TextMsg><Txt>TO REQUEST CLAIM PNR PLEASE IGNORE AND ENTER THE</Txt></TextMsg><TextMsg><Txt>AIRLINES INFORMATION IN ONE OF THE FOLLOWING FORMATS -</Txt></TextMsg><TextMsg><Txt><![CDATA[L@AA/*(RECORD LOCATOR)  OR  L@AA/*AA670/26AUG-(NAME)]]></Txt></TextMsg></AirSegSell></PNRBFManagement_51></SubmitXmlOnSessionResult></SubmitXmlOnSessionResponse></soapenv:Body></soapenv:Envelope>',
				].join('\n'),
			},
			{
				rq: [
					'<?xml version="1.0" encoding="UTF-8"?>',
	    			'	<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>*R</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>',
				].join('\n'),
				rs: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
					' <soapenv:Body><SubmitTerminalTransactionResponse xmlns="http://webservices.galileo.com"><SubmitTerminalTransactionResult USM="false">NO NAMES',
					' 1 AA 670Q 26AUG STLLAX GK1   520P  716P           MO',
					' 2 PR 103U 26AUG LAXMNL GK1  1030P  400A2       MO/WE',
					' 3 PR 112U 30AUG MNLLAX GK1  1125A 1000A           FR',
					' 4 AA 803Q 30AUG LAXSTL GK1   726P 1258A|       FR/SA',
					'&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>',
					'</soapenv:Envelope>',
				].join('\n'),
			},
		],
	});

	return testCases.map(c => [c]);
};

class RunCmdRqXmlTest extends require('../../../../Lib/TestCase.js')
{
	async test_call({input, output, httpRequests}) {
		let PersistentHttpRq = PersistentHttpRqStub(httpRequests);
		let travelport = TravelportClient.makeCustom({
			PersistentHttpRq,
			GdsProfiles: {
				getTravelport: (profileName) => Promise.resolve({
					username: 'grectUnitTest',
					password: 'qwerty123',
				}),
			},
		});
		let gdsData = {
			sessionToken: 'soap-unit-test-blabla-123',
		};
		let stateful = GdsDirectDefaults.makeStatefulSessionCustom({
			session: {
				context: {gds: 'apollo', travelRequestId: null},
				gdsData: gdsData,
			},
			gdsSession: {runCmd: cmd => travelport.runCmd({command: cmd}, gdsData)},
		});

		let actual = await RunCmdRq({...input, stateful, TravelportClient: travelport, useXml: true})
			.catch(coverExc(Rej.list, exc => ({error: exc + ''})));

		this.assertArrayElementsSubset(output, actual, php.implode('; ', actual['userMessages'] || []) + php.PHP_EOL);
		this.assertEquals([], PersistentHttpRq.getHttpRequestsLeft(), 'not all HTTP requests were used');
	}

	getTestMapping() {
		return [
			[provide_call, this.test_call],
		];
	}
}

module.exports = RunCmdRqXmlTest;
