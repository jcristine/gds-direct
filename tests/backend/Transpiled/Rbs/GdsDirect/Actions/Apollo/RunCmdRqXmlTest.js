const GdsSessions = require('../../../../../../../backend/Repositories/GdsSessions.js');
const GdsActionTestUtil = require('../../../../../../../backend/Utils/Testing/GdsActionTestUtil.js');

const RunCmdRq = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Apollo/RunCmdRq.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');

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
					'							<SessionMods><AreaInfoReq/></SessionMods><AirSegSellMods><AirSegSell><Vnd>AA</Vnd><FltNum>0670</FltNum><Class>Q</Class><StartDt>20190826</StartDt><StartAirp>STL</StartAirp><EndAirp>LAX</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>PR</Vnd><FltNum>0103</FltNum><Class>U</Class><StartDt>20190826</StartDt><StartAirp>LAX</StartAirp><EndAirp>MNL</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>PR</Vnd><FltNum>0112</FltNum><Class>U</Class><StartDt>20190830</StartDt><StartAirp>MNL</StartAirp><EndAirp>LAX</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>AA</Vnd><FltNum>0803</FltNum><Class>Q</Class><StartDt>20190830</StartDt><StartAirp>LAX</StartAirp><EndAirp>STL</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell></AirSegSellMods><PNRBFRetrieveMods><CurrentPNR/></PNRBFRetrieveMods>',
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

	testCases.push({
		title: '*HA unsupported format - should not cause null-pointer exception',
		input: {
			cmdRq: '*HA',
		},
		output: {
			status: 'executed',
			calledCommands: [{
				cmd: '*HA',
				output: [
				    "     *****  AIR  HISTORY  *****",
				    " ",
				    " ",
				    "29MAY / 22:17 UTC. BY: RASMUS. PCC: 1O3K. HISTORICAL SEGMENTS",
				    "",
				    " 1 HX   2Y 01SEP ACUMNA GK/GK1               ",
				    " ",
				    "**********************************************************",
				    " ",
				    "29MAY / 22:19 UTC. BY: RASMUS. PCC: 1O3K. ",
				    "",
				    "   HX   2Y 01SEP ACUMNA GK/GK1              - CANCELLED SEGMENT",
				    " ",
				    "**********************************************************",
				    " ",
				].join("\n"),
			}],
		},
		httpRequests: [
			{
			   "cmd": "*HA",
			   "rq": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>*HA</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>",
			   ].join("\n"),
			   "rs": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
				   " <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">     *****  AIR  HISTORY  *****",
				   "XS HX   2 Y01SEP ACUMNA GK/GK1  ",
				   "RCVD-RASMUS/ZDPBVWS -CR- QSB/1O3K/1V AG WS 29MAY2219Z",
				   "HS HX   2 Y01SEP ACUMNA GK/GK1  ",
				   "RCVD-RASMUS/ZDPBVWS -CR- QSB/1O3K/1V AG WS 29MAY2217Z",
				   "&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
				   "</soapenv:Envelope>",
			   ].join("\n"),
		   },
		],
	});

	testCases.push({
		title: 'Example of bug: when you paste itinerary to session that already has some segments, wrong segments gets rebooked',
		startDt: '2019-08-13 13:12:00',
		sessionInfo: {
			initialCommands: [{
				"cmd": "*R",
				"output": [
					"NO NAMES",
					" 1 DL2840L 17AUG YWGMSP SS1   522P  644P *         SA   E  1",
					" 2 DL 162L 17AUG MSPAMS SS1   735P 1050A|*      SA/SU   E  1",
					" 3 DL9585L 18AUG AMSNBO SS1  1255P  950P *         SU   E  1",
					"         OPERATED BY KLM ROYAL DUTCH AIRL",
					" 4 WS3466L 03SEP YYZYOW SS1   200P  308P *         TU   E",
					"         OPERATED BY WESTJET ENCORE",
					" 5 WS 575L 03SEP YOWYWG SS1   400P  546P *         TU   E",
					"><",
				].join("\n"),
			}],
		},
		input: {
			cmdRq: [
				" 1 ET 502H 02SEP ADDYYZ GK1  1055P  825A+       MO/TU",
				" 2 ET 307H 02SEP NBOADD GK1   655P  905P           MO",
				" 3 ET 859J 02SEP ADDJNB SS1  1130P  355A+*      MO/TU   E",
				" 4 ET 900J 02SEP LOSADD SS1   140P  900P *         MO   E",
			].join("\n"),
		},
		output: {
			status: 'executed',
			calledCommands: [{
				cmd: "/0/1|2|3|9|7|6|8|4|5",
				output: [
					" 1 DL2840L 17AUG YWGMSP SS1   522P  644P *         SA   E  1",
					" 2 DL 162L 17AUG MSPAMS SS1   735P 1050A|*      SA/SU   E  1",
					" 3 DL9585L 18AUG AMSNBO SS1  1255P  950P *         SU   E  1",
					"         OPERATED BY KLM ROYAL DUTCH AIRL",
					" 4 ET 900J 02SEP LOSADD SS1   140P  900P *         MO   E",
					" 5 ET 307H 02SEP NBOADD GK1   655P  905P           MO",
					" 6 ET 502H 02SEP ADDYYZ GK1  1055P  825A|       MO/TU",
					" 7 ET 859J 02SEP ADDJNB SS1  1130P  355A|*      MO/TU   E",
					" 8 WS3466L 03SEP YYZYOW SS1   200P  308P *         TU   E",
					"         OPERATED BY WESTJET ENCORE",
					" 9 WS 575L 03SEP YOWYWG SS1   400P  546P *         TU   E",
					"><",
				].join("\n"),
			}],
		},
		httpRequests: [
			{
			   "cmd": "<PNRBFManagement_51/>",
			   "rq": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "\t\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\">",
				   "\t\t\t<SOAP-ENV:Body>",
				   "\t\t\t\t<ns1:SubmitXmlOnSession>",
				   "\t\t\t\t\t<ns1:Token>soap-unit-test-blabla-123</ns1:Token>",
				   "\t\t\t\t\t<ns1:Request>",
				   "\t\t\t\t\t\t<PNRBFManagement_51>",
				   "\t\t\t\t\t\t\t<SessionMods><AreaInfoReq/></SessionMods><AirSegSellMods><AirSegSell><Vnd>ET</Vnd><FltNum>0502</FltNum><Class>H</Class><StartDt>20190902</StartDt><StartAirp>ADD</StartAirp><EndAirp>YYZ</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>ET</Vnd><FltNum>0307</FltNum><Class>H</Class><StartDt>20190902</StartDt><StartAirp>NBO</StartAirp><EndAirp>ADD</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>ET</Vnd><FltNum>0859</FltNum><Class>Y</Class><StartDt>20190902</StartDt><StartAirp>ADD</StartAirp><EndAirp>JNB</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>ET</Vnd><FltNum>0900</FltNum><Class>Y</Class><StartDt>20190902</StartDt><StartAirp>LOS</StartAirp><EndAirp>ADD</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell></AirSegSellMods><PNRBFRetrieveMods><CurrentPNR/></PNRBFRetrieveMods>",
				   "\t\t\t\t\t\t</PNRBFManagement_51>",
				   "\t\t\t\t\t</ns1:Request>",
				   "\t\t\t\t\t<ns1:Filter>",
				   "\t\t\t\t\t\t<_/>",
				   "\t\t\t\t\t</ns1:Filter>",
				   "\t\t\t\t</ns1:SubmitXmlOnSession>",
				   "\t\t\t</SOAP-ENV:Body>",
				   "\t\t</SOAP-ENV:Envelope>",
			   ].join("\n"),
			   "rs": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
				   " <soapenv:Body><SubmitXmlOnSessionResponse xmlns=\"http://webservices.galileo.com\"><SubmitXmlOnSessionResult><PNRBFManagement_51 xmlns=\"\"><SessionInfo><AreaInfoResp><Sys>1V</Sys><Processor>D</Processor><GrpModeActivatedInd>N</GrpModeActivatedInd><AAAAreaAry><AAAAreaInfo><AAAArea>A</AAAArea><ActiveInd>Y</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials>WS</AgntInitials><Duty>AG</Duty><AgncyPCC>2F3K</AgncyPCC><DomMode>BASIC</DomMode><IntlMode>US-ECAC</IntlMode><PNRDataInd>Y</PNRDataInd><PNRName>NO NAMES</PNRName><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>B</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>C</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>D</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>E</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo></AAAAreaAry></AreaInfoResp></SessionInfo><AirSegSell><AirSell><DisplaySequenceNumber/><Vnd>ET</Vnd><FltNum>502</FltNum><OpSuf/><Class>H</Class><StartDt>20190902</StartDt><DtChg>1</DtChg><StartAirp>ADD</StartAirp><EndAirp>YYZ</EndAirp><StartTm>2255</StartTm><EndTm>825</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt><![CDATA[DEPARTS ADD TERMINAL 2  - ARRIVES YYZ TERMINAL 1]]></Txt></TextMsg><AirSell><DisplaySequenceNumber/><Vnd>ET</Vnd><FltNum>307</FltNum><OpSuf/><Class>H</Class><StartDt>20190902</StartDt><DtChg>0</DtChg><StartAirp>NBO</StartAirp><EndAirp>ADD</EndAirp><StartTm>1855</StartTm><EndTm>2105</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt>DEPARTS NBO TERMINAL 1C - ARRIVES ADD TERMINAL 2</Txt></TextMsg><AirSell><DisplaySequenceNumber/><Vnd>ET</Vnd><FltNum>859</FltNum><OpSuf/><Class>Y</Class><StartDt>20190902</StartDt><DtChg>1</DtChg><StartAirp>ADD</StartAirp><EndAirp>JNB</EndAirp><StartTm>2330</StartTm><EndTm>355</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt><![CDATA[DEPARTS ADD TERMINAL 2  - ARRIVES JNB TERMINAL A]]></Txt></TextMsg><AirSell><DisplaySequenceNumber/><Vnd>ET</Vnd><FltNum>900</FltNum><OpSuf/><Class>Y</Class><StartDt>20190902</StartDt><DtChg>0</DtChg><StartAirp>LOS</StartAirp><EndAirp>ADD</EndAirp><StartTm>1340</StartTm><EndTm>2100</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt><![CDATA[OFFER CAR/HOTEL    |CAL\t     |HOA\t]]></Txt></TextMsg><TextMsg><Txt><![CDATA[DEPARTS LOS TERMINAL I  - ARRIVES ADD TERMINAL 2]]></Txt></TextMsg><TextMsg><Txt>ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS</Txt></TextMsg><TextMsg><Txt>PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION</Txt></TextMsg><TextMsg><Txt>WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES</Txt></TextMsg><TextMsg><Txt>FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES</Txt></TextMsg></AirSegSell><PNRBFRetrieve><Control><KLRCnt>14</KLRCnt><KlrAry><Klr><ID>BP08</ID><NumOccur>1</NumOccur></Klr><Klr><ID>IT01</ID><NumOccur>9</NumOccur></Klr><Klr><ID>IT02</ID><NumOccur>2</NumOccur></Klr></KlrAry></Control><GenPNRInfo><FileAddr/><CodeCheck/><RecLoc/><Ver>0</Ver><OwningCRS>1V</OwningCRS><OwningAgncyName>INTERNATIONAL TRAVEL NET</OwningAgncyName><OwningAgncyPCC>2F3K</OwningAgncyPCC><CreationDt/><CreatingAgntSignOn/><CreatingAgntDuty/><CreatingAgncyIATANum/><OrigBkLocn/><SATONum/><PTAInd>N</PTAInd><InUseInd/><SimultaneousUpdInd/><BorrowedInd>N</BorrowedInd><GlobInd>N</GlobInd><ReadOnlyInd>N</ReadOnlyInd><FareDataExistsInd>N</FareDataExistsInd><PastDtQuickInd>N</PastDtQuickInd><CurAgncyPCC>2F3K</CurAgncyPCC><QInd>N</QInd><TkNumExistInd>N</TkNumExistInd><IMUdataexists>Y</IMUdataexists><ETkDataExistInd>N</ETkDataExistInd><CurDtStamp>20190812</CurDtStamp><CurTmStamp>081603</CurTmStamp><CurAgntSONID>DPBVWS</CurAgntSONID><TravInsuranceInd>N</TravInsuranceInd><PNRBFTicketedInd>N</PNRBFTicketedInd><ZeppelinAgncyInd>N</ZeppelinAgncyInd><AgncyAutoServiceInd>N</AgncyAutoServiceInd><AgncyAutoNotifyInd>N</AgncyAutoNotifyInd><ZeppelinPNRInd>N</ZeppelinPNRInd><PNRAutoServiceInd>N</PNRAutoServiceInd><PNRNotifyInd/><SuperPNRInd>N</SuperPNRInd><PNRBFPurgeDt>NO PURGE</PNRBFPurgeDt><PNRBFChangeInd>Y</PNRBFChangeInd><MCODataExists>N</MCODataExists><OrigRcvdField/><IntContExists/><AllDataAllTime>N</AllDataAllTime><LastActAgntID/><TransPCCName>INTERNATIONAL TRAVEL NET</TransPCCName><URrecordLoc/><UROSindLoc>N</UROSindLoc><URRCBInd>N</URRCBInd><GMTPNRBFCreationDt/><PricingRecordExist>N</PricingRecordExist><ArchivedFeeDataExists>N</ArchivedFeeDataExists><LeisureshopperDataExists>N</LeisureshopperDataExists><SeatDataExists>N</SeatDataExists><FrequentFlyerDataExists>N</FrequentFlyerDataExists><NetTicketDataExists>N</NetTicketDataExists><TinsRemarksExist>N</TinsRemarksExist><ElectronicDataExists>N</ElectronicDataExists><AdditionalItineraryDataExists>N</AdditionalItineraryDataExists><GroupAllocationFileExists>N</GroupAllocationFileExists><ProfileAssociationsExist>N</ProfileAssociationsExist><VendorLocatorDataExists>N</VendorLocatorDataExists><BookingCodeDataExists/><ArneDataExists>N</ArneDataExists><TimaticDataExists>N</TimaticDataExists><LinearFareDataExists>N</LinearFareDataExists><ItineraryRemarksExist>N</ItineraryRemarksExist><IdentificationFieldExists>N</IdentificationFieldExists><EmailAddressExists>N</EmailAddressExists><RuleDataExists>N</RuleDataExists><LSVendorConfirmationExists>N</LSVendorConfirmationExists><AdditionalSrvcs>N</AdditionalSrvcs><ElectronicMiscDocumentList>N</ElectronicMiscDocumentList><TDSProfileExists>N</TDSProfileExists><ServiceInformationExists/><FiledFareDataExists/><VendorRemarksDataExists/><MembershipDataExists/><DividedBookingsExist>N</DividedBookingsExist><ClientFileReferencesExist/><CustomCheckRulesExist/><PassengerInformationExists/><GUID/><ARCNewPNR/><ARCFares/><ARCTicketed/><ARCSplitDivide/><ARCNameAdd/><ARCNameDelete/><ARCItinAdd/><ARCItinDEL/><ARCPhoneAdd/><ARCPhoneDel/><ARCFOPAdd/><ARCFOPDelete/><ARCSSRAdd/><ARCSSRDel/><ARCOSIAdd/><ARCOSIDel/><ReasonCodesspares/></GenPNRInfo><AirSeg><SegNum>1</SegNum><Status>SS</Status><Dt>20190817</Dt><DayChg>00</DayChg><AirV>DL</AirV><NumPsgrs>1</NumPsgrs><StartAirp>YWG</StartAirp><EndAirp>MSP</EndAirp><StartTm>1722</StartTm><EndTm>1844</EndTm><BIC>L</BIC><FltNum>2840</FltNum><OpSuf/><COG>N</COG><TklessInd>Y</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum>01</MarriageNum><SellType>L</SellType><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>NN</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg><AirSeg><SegNum>2</SegNum><Status>SS</Status><Dt>20190817</Dt><DayChg>01</DayChg><AirV>DL</AirV><NumPsgrs>1</NumPsgrs><StartAirp>MSP</StartAirp><EndAirp>AMS</EndAirp><StartTm>1935</StartTm><EndTm>1050</EndTm><BIC>L</BIC><FltNum>162</FltNum><OpSuf/><COG>N</COG><TklessInd>Y</TklessInd><ConxInd>Y</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum>01</MarriageNum><SellType>L</SellType><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>NN</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg><AirSeg><SegNum>3</SegNum><Status>SS</Status><Dt>20190818</Dt><DayChg>00</DayChg><AirV>DL</AirV><NumPsgrs>1</NumPsgrs><StartAirp>AMS</StartAirp><EndAirp>NBO</EndAirp><StartTm>1255</StartTm><EndTm>2150</EndTm><BIC>L</BIC><FltNum>9585</FltNum><OpSuf/><COG>N</COG><TklessInd>Y</TklessInd><ConxInd>Y</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum>01</MarriageNum><SellType>L</SellType><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>NN</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd>N</OpAirVInd></AirSeg><AirSegOpAirV><OpAirVInfoAry><OpAirVInfo><StartAirp>AMS</StartAirp><EndAirp>NBO</EndAirp><AirV>KL</AirV><AirVName>KLM ROYAL DUTCH AIRL</AirVName></OpAirVInfo></OpAirVInfoAry></AirSegOpAirV><AirSeg><SegNum>4</SegNum><Status>SS</Status><Dt>20190903</Dt><DayChg>00</DayChg><AirV>WS</AirV><NumPsgrs>1</NumPsgrs><StartAirp>YYZ</StartAirp><EndAirp>YOW</EndAirp><StartTm>1400</StartTm><EndTm>1508</EndTm><BIC>L</BIC><FltNum>3466</FltNum><OpSuf/><COG>N</COG><TklessInd>Y</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType>L</SellType><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>NN</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd>Y</OpAirVInd></AirSeg><AirSegOpAirV><OpAirVInfoAry><OpAirVInfo><StartAirp>YYZ</StartAirp><EndAirp>YOW</EndAirp><AirV/><AirVName>WESTJET ENCORE</AirVName></OpAirVInfo></OpAirVInfoAry></AirSegOpAirV><AirSeg><SegNum>5</SegNum><Status>SS</Status><Dt>20190903</Dt><DayChg>00</DayChg><AirV>WS</AirV><NumPsgrs>1</NumPsgrs><StartAirp>YOW</StartAirp><EndAirp>YWG</EndAirp><StartTm>1600</StartTm><EndTm>1746</EndTm><BIC>L</BIC><FltNum>575</FltNum><OpSuf/><COG>N</COG><TklessInd>Y</TklessInd><ConxInd>Y</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType>L</SellType><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>NN</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg><AirSeg><SegNum>6</SegNum><Status>GK</Status><Dt>20190902</Dt><DayChg>01</DayChg><AirV>ET</AirV><NumPsgrs>1</NumPsgrs><StartAirp>ADD</StartAirp><EndAirp>YYZ</EndAirp><StartTm>2255</StartTm><EndTm>825</EndTm><BIC>H</BIC><FltNum>502</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>GK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd>Y</OpAirVInd></AirSeg><AirSeg><SegNum>7</SegNum><Status>GK</Status><Dt>20190902</Dt><DayChg>00</DayChg><AirV>ET</AirV><NumPsgrs>1</NumPsgrs><StartAirp>NBO</StartAirp><EndAirp>ADD</EndAirp><StartTm>1855</StartTm><EndTm>2105</EndTm><BIC>H</BIC><FltNum>307</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>GK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg><AirSeg><SegNum>8</SegNum><Status>GK</Status><Dt>20190902</Dt><DayChg>01</DayChg><AirV>ET</AirV><NumPsgrs>1</NumPsgrs><StartAirp>ADD</StartAirp><EndAirp>JNB</EndAirp><StartTm>2330</StartTm><EndTm>355</EndTm><BIC>Y</BIC><FltNum>859</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>Y</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>GK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg><AirSeg><SegNum>9</SegNum><Status>GK</Status><Dt>20190902</Dt><DayChg>00</DayChg><AirV>ET</AirV><NumPsgrs>1</NumPsgrs><StartAirp>LOS</StartAirp><EndAirp>ADD</EndAirp><StartTm>1340</StartTm><EndTm>2100</EndTm><BIC>Y</BIC><FltNum>900</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>GK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg></PNRBFRetrieve></PNRBFManagement_51></SubmitXmlOnSessionResult></SubmitXmlOnSessionResponse></soapenv:Body></soapenv:Envelope>"
			   ].join("\n"),
		   },
		   {
			   "cmd": "X8+9/08J+9J",
			   "rq": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>X8+9/08J+9J</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>",
			   ].join("\n"),
			   "rs": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
				   " <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">   ET  859J   2SEP ADDJNB SS1  1130P  355A|*                 E",
				   "010 KP 1200  KU 6859  SA 7203 *",
				   "DEPARTS ADD TERMINAL 2  - ARRIVES JNB TERMINAL A ",
				   "   ET  900J   2SEP LOSADD SS1   140P  900P *                 E",
				   "010 KP 1203  SQ 6128 *",
				   "OFFER CAR/HOTEL    &gt;CAL;     &gt;HOA;",
				   "DEPARTS LOS TERMINAL I  - ARRIVES ADD TERMINAL 2 ",
				   "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
				   "PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
				   "WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
				   "FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES",
				   "CANCEL REQUEST COMPLETED",
				   "&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
				   "</soapenv:Envelope>",
			   ].join("\n"),
		   },
		   {
			   "cmd": "*R",
			   "rq": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>*R</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>",
			   ].join("\n"),
			   "rs": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
				   " <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">NO NAMES",
				   " 1 DL2840L 17AUG YWGMSP SS1   522P  644P *         SA   E  1",
				   " 2 DL 162L 17AUG MSPAMS SS1   735P 1050A|*      SA/SU   E  1",
				   " 3 DL9585L 18AUG AMSNBO SS1  1255P  950P *         SU   E  1",
				   "         OPERATED BY KLM ROYAL DUTCH AIRL",
				   " 4 WS3466L 03SEP YYZYOW SS1   200P  308P *         TU   E",
				   "         OPERATED BY WESTJET ENCORE",
				   " 5 WS 575L 03SEP YOWYWG SS1   400P  546P *         TU   E",
				   " 6 ET 502H 02SEP ADDYYZ GK1  1055P  825A|       MO/TU",
				   " 7 ET 307H 02SEP NBOADD GK1   655P  905P           MO",
				   " 8 ET 859J 02SEP ADDJNB SS1  1130P  355A|*      MO/TU   E",
				   " 9 ET 900J 02SEP LOSADD SS1   140P  900P *         MO   E",
				   "&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
				   "</soapenv:Envelope>",
			   ].join("\n"),
		   },
		   {
			   "cmd": "/0/1|2|3|9|7|6|8|4|5",
			   "rq": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>/0/1|2|3|9|7|6|8|4|5</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>",
			   ].join("\n"),
			   "rs": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
				   " <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\"> 1 DL2840L 17AUG YWGMSP SS1   522P  644P *         SA   E  1",
				   " 2 DL 162L 17AUG MSPAMS SS1   735P 1050A|*      SA/SU   E  1",
				   " 3 DL9585L 18AUG AMSNBO SS1  1255P  950P *         SU   E  1",
				   "         OPERATED BY KLM ROYAL DUTCH AIRL",
				   " 4 ET 900J 02SEP LOSADD SS1   140P  900P *         MO   E",
				   " 5 ET 307H 02SEP NBOADD GK1   655P  905P           MO",
				   " 6 ET 502H 02SEP ADDYYZ GK1  1055P  825A|       MO/TU",
				   " 7 ET 859J 02SEP ADDJNB SS1  1130P  355A|*      MO/TU   E",
				   " 8 WS3466L 03SEP YYZYOW SS1   200P  308P *         TU   E",
				   "         OPERATED BY WESTJET ENCORE",
				   " 9 WS 575L 03SEP YOWYWG SS1   400P  546P *         TU   E",
				   "&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
				   "</soapenv:Envelope>",
			   ].join("\n"),
		   },
		],
	});

	testCases.push({
		title: 'PNRBFManagement failed due to travelport 8222 (UNKNOWN SECURITY ERROR) - should not continue and attempt to rebook segments',
		startDt: '2019-08-13 13:12:00',
		input: {
			cmdRq: [
				" 1 AA  44I 19JUN JFKCDG SS1   610P  745A+*      FR/SA   E",
				" 2 AA  45I 01JUL CDGJFK SS1  1150A  240P *         WE   E",
			].join("\n"),
		},
		output: {
			status: 'forbidden',
			userMessages: ['Direct sell failed - Transaction error #8222 (UNKNOWN SECURITY ERROR)'],
		},
		httpRequests: [
			{
			   "cmd": "<PNRBFManagement_51/>",
			   "rq": [
					   '<?xml version="1.0" encoding="UTF-8"?>',
					'		<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com">',
					'			<SOAP-ENV:Body>',
					'				<ns1:SubmitXmlOnSession>',
					'					<ns1:Token>soap-unit-test-blabla-123</ns1:Token>',
					'					<ns1:Request>',
					'						<PNRBFManagement_51>',
					'							<SessionMods><AreaInfoReq/></SessionMods><AirSegSellMods><AirSegSell><Vnd>AA</Vnd><FltNum>0044</FltNum><Class>Y</Class><StartDt>20200619</StartDt><StartAirp>JFK</StartAirp><EndAirp>CDG</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>AA</Vnd><FltNum>0045</FltNum><Class>Y</Class><StartDt>20200701</StartDt><StartAirp>CDG</StartAirp><EndAirp>JFK</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell></AirSegSellMods><PNRBFRetrieveMods><CurrentPNR/></PNRBFRetrieveMods>',
					'						</PNRBFManagement_51>',
					'					</ns1:Request>',
					'					<ns1:Filter>',
					'						<_/>',
					'					</ns1:Filter>',
					'				</ns1:SubmitXmlOnSession>',
					'			</SOAP-ENV:Body>',
					'		</SOAP-ENV:Envelope>',
			   ].join("\n"),
			   "rs": [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
					' <soapenv:Body><SubmitXmlOnSessionResponse xmlns="http://webservices.galileo.com"><SubmitXmlOnSessionResult><PNRBFManagement_51 xmlns=""><TransactionErrorCode><Domain>Procedure</Domain><Code>8222</Code></TransactionErrorCode></PNRBFManagement_51></SubmitXmlOnSessionResult></SubmitXmlOnSessionResponse> </soapenv:Body>',
					'</soapenv:Envelope>',
			   ].join("\n"),
		   },
		],
	});

	return testCases.map(c => [c]);
};

class RunCmdRqXmlTest extends require('../../../../Lib/TestCase.js')
{
	async test_call(testCase) {
		testCase.fullState = testCase.fullState || {
			gds: 'apollo', area: 'A', areas: {
				'A': {...GdsSessions.makeDefaultAreaState('apollo'), area: 'A'},
			},
		};
		let unit = this;
		/** @param stateful = require('StatefulSession.js')() */
		let getActual = async ({stateful, input, gdsClients}) => {
			let actual = await RunCmdRq({
				stateful, ...input, useXml: true,
				travelport: gdsClients.travelport,
			}).catch(coverExc(Rej.list, exc => ({error: exc + ''})));
			return actual;
		};
		await GdsActionTestUtil.testHttpGdsAction({unit, testCase, getActual});
	}

	getTestMapping() {
		return [
			[provide_call, this.test_call],
		];
	}
}

module.exports = RunCmdRqXmlTest;
