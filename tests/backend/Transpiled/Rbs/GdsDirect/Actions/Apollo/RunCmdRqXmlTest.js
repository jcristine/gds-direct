const SqlUtil = require('klesun-node-tools/src/Utils/SqlUtil.js');
const Pccs = require('../../../../../../../backend/Repositories/Pccs.js');
const PtcUtil = require('../../../../../../../backend/Transpiled/Rbs/Process/Common/PtcUtil.js');
const stubPtcFareFamilies = require('../../../../../../data/stubPtcFareFamilies.js');
const PtcFareFamilies = require('../../../../../../../backend/Repositories/PtcFareFamilies.js');
const GdsSessions = require('../../../../../../../backend/Repositories/GdsSessions.js');
const GdsActionTestUtil = require('../../../../../../../backend/Utils/Testing/GdsActionTestUtil.js');
const stubPccs = require('../../../../../../data/stubPccs.js');
const {nonEmpty} = require('klesun-node-tools/src/Lang.js');

const RunCmdRq = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Apollo/RunCmdRq.js');

const sinon = require('sinon');

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
					'							<SessionMods><AreaInfoReq/></SessionMods><AirSegSellMods><AirSegSell><Vnd>AA</Vnd><FltNum>0670</FltNum><Class>Q</Class><StartDt>20190826</StartDt><StartAirp>STL</StartAirp><EndAirp>LAX</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>PR</Vnd><FltNum>0103</FltNum><Class>U</Class><StartDt>20190826</StartDt><StartAirp>LAX</StartAirp><EndAirp>MNL</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>PR</Vnd><FltNum>0112</FltNum><Class>U</Class><StartDt>20190830</StartDt><StartAirp>MNL</StartAirp><EndAirp>LAX</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>AA</Vnd><FltNum>0803</FltNum><Class>Q</Class><StartDt>20190830</StartDt><StartAirp>LAX</StartAirp><EndAirp>STL</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell></AirSegSellMods><PNRBFRetrieveMods><CurrentPNR/></PNRBFRetrieveMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>1</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>2</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>3</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>4</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>5</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>6</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>7</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>8</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods>',
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
				   "\t\t\t\t\t\t\t<SessionMods><AreaInfoReq/></SessionMods><AirSegSellMods><AirSegSell><Vnd>ET</Vnd><FltNum>0502</FltNum><Class>H</Class><StartDt>20190902</StartDt><StartAirp>ADD</StartAirp><EndAirp>YYZ</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>ET</Vnd><FltNum>0307</FltNum><Class>H</Class><StartDt>20190902</StartDt><StartAirp>NBO</StartAirp><EndAirp>ADD</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>ET</Vnd><FltNum>0859</FltNum><Class>Y</Class><StartDt>20190902</StartDt><StartAirp>ADD</StartAirp><EndAirp>JNB</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>ET</Vnd><FltNum>0900</FltNum><Class>Y</Class><StartDt>20190902</StartDt><StartAirp>LOS</StartAirp><EndAirp>ADD</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell></AirSegSellMods><PNRBFRetrieveMods><CurrentPNR/></PNRBFRetrieveMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>1</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>2</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>3</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>4</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>5</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>6</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>7</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>8</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods>",
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
					'							<SessionMods><AreaInfoReq/></SessionMods><AirSegSellMods><AirSegSell><Vnd>AA</Vnd><FltNum>0044</FltNum><Class>Y</Class><StartDt>20200619</StartDt><StartAirp>JFK</StartAirp><EndAirp>CDG</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>AA</Vnd><FltNum>0045</FltNum><Class>Y</Class><StartDt>20200701</StartDt><StartAirp>CDG</StartAirp><EndAirp>JFK</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell></AirSegSellMods><PNRBFRetrieveMods><CurrentPNR/></PNRBFRetrieveMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>1</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>2</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>3</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>4</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>5</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>6</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>7</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>8</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods>',
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

	testCases.push({
		title: 'rebookAsGk example, uses exposed parseRange() function from CommandParser.js, should not fail after refactoring',
		startDt: '2019-08-13 13:12:00',
		input: {
			cmdRq: 'X1-2/0SGK',
		},
		output: {
			status: 'executed',
			calledCommands: [
				{cmd: '*R', output: [
					"NO NAMES",
					" 1 AV 211S 10DEC JFKBOG GK1   105P  705P           TU",
					"         OPERATED BY AVIANCA",
					" 2 AV9217S 10DEC BOGCLO GK1   816P  924P           TU",
					"         OPERATED BY AVIANCA",
					"",
				].join('\n')},
			],
		},
		httpRequests: [
			{
				"cmd": "*R",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>*R</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">NO NAMES",
					" 1 AV 211Y 10DEC JFKBOG SS1   105P  705P *         TU   E  1",
					"         OPERATED BY AVIANCA",
					" 2 AV9217Y 10DEC BOGCLO SS1   816P  924P *         TU   E  1",
					"         OPERATED BY AVIANCA",
					"&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "X1|2",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>X1|2</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">CNLD FROM  1",
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
					"\t\t\t\t\t<ns1:Token>soap-unit-test-blabla-123</ns1:Token>",
					"\t\t\t\t\t<ns1:Request>",
					"\t\t\t\t\t\t<PNRBFManagement_51>",
					"\t\t\t\t\t\t\t<SessionMods><AreaInfoReq/></SessionMods><AirSegSellMods><AirSegSell><Vnd>AV</Vnd><FltNum>0211</FltNum><Class>S</Class><StartDt>20191210</StartDt><StartAirp>JFK</StartAirp><EndAirp>BOG</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>AV</Vnd><FltNum>9217</FltNum><Class>S</Class><StartDt>20191210</StartDt><StartAirp>BOG</StartAirp><EndAirp>CLO</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell></AirSegSellMods><PNRBFRetrieveMods><CurrentPNR/></PNRBFRetrieveMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>1</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>2</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>3</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>4</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>5</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>6</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>7</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>8</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods>",
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
					" <soapenv:Body><SubmitXmlOnSessionResponse xmlns=\"http://webservices.galileo.com\"><SubmitXmlOnSessionResult><PNRBFManagement_51 xmlns=\"\"><SessionInfo><AreaInfoResp><Sys>1V</Sys><Processor>B</Processor><GrpModeActivatedInd>N</GrpModeActivatedInd><AAAAreaAry><AAAAreaInfo><AAAArea>A</AAAArea><ActiveInd>Y</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials>WS</AgntInitials><Duty>AG</Duty><AgncyPCC>2F3K</AgncyPCC><DomMode>BASIC</DomMode><IntlMode>US-ECAC</IntlMode><PNRDataInd>Y</PNRDataInd><PNRName>NO NAMES</PNRName><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>B</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>C</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>D</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>E</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo></AAAAreaAry></AreaInfoResp></SessionInfo><AirSegSell><AirSell><DisplaySequenceNumber/><Vnd>AV</Vnd><FltNum>211</FltNum><OpSuf/><Class>S</Class><StartDt>20191210</StartDt><DtChg>0</DtChg><StartAirp>JFK</StartAirp><EndAirp>BOG</EndAirp><StartTm>1305</StartTm><EndTm>1905</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt>OPERATED BY AVIANCA</Txt></TextMsg><TextMsg><Txt><![CDATA[DEPARTS JFK TERMINAL 4  - ARRIVES BOG TERMINAL 1]]></Txt></TextMsg><AirSell><DisplaySequenceNumber/><Vnd>AV</Vnd><FltNum>9217</FltNum><OpSuf/><Class>S</Class><StartDt>20191210</StartDt><DtChg>0</DtChg><StartAirp>BOG</StartAirp><EndAirp>CLO</EndAirp><StartTm>2016</StartTm><EndTm>2124</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt><![CDATA[OFFER CAR/HOTEL    |CAL\t     |HOA\t]]></Txt></TextMsg><TextMsg><Txt>OPERATED BY AVIANCA</Txt></TextMsg><TextMsg><Txt>DEPARTS BOG TERMINAL 1</Txt></TextMsg><TextMsg><Txt>ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS</Txt></TextMsg><TextMsg><Txt>PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION</Txt></TextMsg><TextMsg><Txt>WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES</Txt></TextMsg><TextMsg><Txt>FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES</Txt></TextMsg></AirSegSell><PNRBFRetrieve><Control><KLRCnt>7</KLRCnt><KlrAry><Klr><ID>BP08</ID><NumOccur>1</NumOccur></Klr><Klr><ID>IT01</ID><NumOccur>2</NumOccur></Klr><Klr><ID>IT02</ID><NumOccur>2</NumOccur></Klr></KlrAry></Control><GenPNRInfo><FileAddr/><CodeCheck/><RecLoc/><Ver>0</Ver><OwningCRS>1V</OwningCRS><OwningAgncyName>INTERNATIONAL TRAVEL NET</OwningAgncyName><OwningAgncyPCC>2F3K</OwningAgncyPCC><CreationDt/><CreatingAgntSignOn/><CreatingAgntDuty/><CreatingAgncyIATANum/><OrigBkLocn/><SATONum/><PTAInd>N</PTAInd><InUseInd/><SimultaneousUpdInd/><BorrowedInd>N</BorrowedInd><GlobInd>N</GlobInd><ReadOnlyInd>N</ReadOnlyInd><FareDataExistsInd>N</FareDataExistsInd><PastDtQuickInd>N</PastDtQuickInd><CurAgncyPCC>2F3K</CurAgncyPCC><QInd>N</QInd><TkNumExistInd>N</TkNumExistInd><IMUdataexists>Y</IMUdataexists><ETkDataExistInd>N</ETkDataExistInd><CurDtStamp>20190910</CurDtStamp><CurTmStamp>103019</CurTmStamp><CurAgntSONID>DPBVWS</CurAgntSONID><TravInsuranceInd>N</TravInsuranceInd><PNRBFTicketedInd>N</PNRBFTicketedInd><ZeppelinAgncyInd>N</ZeppelinAgncyInd><AgncyAutoServiceInd>N</AgncyAutoServiceInd><AgncyAutoNotifyInd>N</AgncyAutoNotifyInd><ZeppelinPNRInd>N</ZeppelinPNRInd><PNRAutoServiceInd>N</PNRAutoServiceInd><PNRNotifyInd/><SuperPNRInd>N</SuperPNRInd><PNRBFPurgeDt>NO PURGE</PNRBFPurgeDt><PNRBFChangeInd>Y</PNRBFChangeInd><MCODataExists>N</MCODataExists><OrigRcvdField/><IntContExists/><AllDataAllTime>N</AllDataAllTime><LastActAgntID/><TransPCCName>INTERNATIONAL TRAVEL NET</TransPCCName><URrecordLoc/><UROSindLoc>N</UROSindLoc><URRCBInd>N</URRCBInd><GMTPNRBFCreationDt/><PricingRecordExist>N</PricingRecordExist><ArchivedFeeDataExists>N</ArchivedFeeDataExists><LeisureshopperDataExists>N</LeisureshopperDataExists><SeatDataExists>N</SeatDataExists><FrequentFlyerDataExists>N</FrequentFlyerDataExists><NetTicketDataExists>N</NetTicketDataExists><TinsRemarksExist>N</TinsRemarksExist><ElectronicDataExists>N</ElectronicDataExists><AdditionalItineraryDataExists>N</AdditionalItineraryDataExists><GroupAllocationFileExists>N</GroupAllocationFileExists><ProfileAssociationsExist>N</ProfileAssociationsExist><VendorLocatorDataExists>N</VendorLocatorDataExists><BookingCodeDataExists/><ArneDataExists>N</ArneDataExists><TimaticDataExists>N</TimaticDataExists><LinearFareDataExists>N</LinearFareDataExists><ItineraryRemarksExist>N</ItineraryRemarksExist><IdentificationFieldExists>N</IdentificationFieldExists><EmailAddressExists>N</EmailAddressExists><RuleDataExists>N</RuleDataExists><LSVendorConfirmationExists>N</LSVendorConfirmationExists><AdditionalSrvcs>N</AdditionalSrvcs><ElectronicMiscDocumentList>N</ElectronicMiscDocumentList><TDSProfileExists>N</TDSProfileExists><ServiceInformationExists/><FiledFareDataExists/><VendorRemarksDataExists/><MembershipDataExists/><DividedBookingsExist>N</DividedBookingsExist><ClientFileReferencesExist/><CustomCheckRulesExist/><PassengerInformationExists/><GUID/><ARCNewPNR/><ARCFares/><ARCTicketed/><ARCSplitDivide/><ARCNameAdd/><ARCNameDelete/><ARCItinAdd/><ARCItinDEL/><ARCPhoneAdd/><ARCPhoneDel/><ARCFOPAdd/><ARCFOPDelete/><ARCSSRAdd/><ARCSSRDel/><ARCOSIAdd/><ARCOSIDel/><ReasonCodesspares/></GenPNRInfo><AirSeg><SegNum>1</SegNum><Status>GK</Status><Dt>20191210</Dt><DayChg>00</DayChg><AirV>AV</AirV><NumPsgrs>1</NumPsgrs><StartAirp>JFK</StartAirp><EndAirp>BOG</EndAirp><StartTm>1305</StartTm><EndTm>1905</EndTm><BIC>S</BIC><FltNum>211</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>GK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd>Y</OpAirVInd></AirSeg><AirSegOpAirV><OpAirVInfoAry><OpAirVInfo><StartAirp>JFK</StartAirp><EndAirp>BOG</EndAirp><AirV/><AirVName>AVIANCA</AirVName></OpAirVInfo></OpAirVInfoAry></AirSegOpAirV><AirSeg><SegNum>2</SegNum><Status>GK</Status><Dt>20191210</Dt><DayChg>00</DayChg><AirV>AV</AirV><NumPsgrs>1</NumPsgrs><StartAirp>BOG</StartAirp><EndAirp>CLO</EndAirp><StartTm>2016</StartTm><EndTm>2124</EndTm><BIC>S</BIC><FltNum>9217</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>Y</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>GK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd>Y</OpAirVInd></AirSeg><AirSegOpAirV><OpAirVInfoAry><OpAirVInfo><StartAirp>BOG</StartAirp><EndAirp>CLO</EndAirp><AirV/><AirVName>AVIANCA</AirVName></OpAirVInfo></OpAirVInfoAry></AirSegOpAirV></PNRBFRetrieve><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote></PNRBFManagement_51></SubmitXmlOnSessionResult></SubmitXmlOnSessionResponse></soapenv:Body></soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "*R",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>*R</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">NO NAMES",
					" 1 AV 211S 10DEC JFKBOG GK1   105P  705P           TU",
					"         OPERATED BY AVIANCA",
					" 2 AV9217S 10DEC BOGCLO GK1   816P  924P           TU",
					"         OPERATED BY AVIANCA",
					"&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			},
		],
	});

	testCases.push({
		title: 'rebookAsGk 12NJ PCC specific XI response format',
		startDt: '2019-09-16 19:58:38',
		input: {
			cmdRq: 'X3-4/0LGK',
		},
		output: {
			status: 'executed',
			calledCommands: [
				{cmd: '*R', output: [
					"NO NAMES",
					" 1 UA8612W 13DEC YULBRU SS1   725P  810A|*      FR/SA   E",
					"         OPERATED BY AIR CANADA",
					" 2 SN 357Q 14DEC BRUFIH SS1  1050A  655P *         SA   E",
					" 3 LH 599L 21DEC ADDFRA GK1  1150P  520A|       SA/SU",
					"         OPERATED BY LUFTHANSA CITYLINE GMBH",
					" 4 AC 875L 22DEC FRAYUL GK1  1005A 1205P           SU",
					"",
				].join('\n')},
			],
		},
		httpRequests: [
			{
			   "cmd": "*R",
			   "rq": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>*R</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
			   ].join("\n"),
			   "rs": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
				   " <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">NO NAMES",
				   " 1 UA8612W 13DEC YULBRU SS1   725P  810A|*      FR/SA   E",
				   "         OPERATED BY AIR CANADA",
				   " 2 SN 357Q 14DEC BRUFIH SS1  1050A  655P *         SA   E",
				   " 3 LH 599V 21DEC ADDFRA SS1  1150P  520A|*      SA/SU   E",
				   "         OPERATED BY LUFTHANSA CITYLINE GMBH",
				   " 4 AC 875V 22DEC FRAYUL SS1  1005A 1205P *         SU   E",
				   "&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
				   "</soapenv:Envelope>"
			   ].join("\n")
		   },
		   {
			   "cmd": "X3|4",
			   "rq": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>X3|4</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
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
			   "cmd": "<PNRBFManagement_51/>",
			   "rq": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "\t\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\">",
				   "\t\t\t<SOAP-ENV:Body>",
				   "\t\t\t\t<ns1:SubmitXmlOnSession>",
				   "\t\t\t\t\t<ns1:Token>soap-unit-test-blabla-123</ns1:Token>",
				   "\t\t\t\t\t<ns1:Request>",
				   "\t\t\t\t\t\t<PNRBFManagement_51>",
				   "\t\t\t\t\t\t\t<SessionMods><AreaInfoReq/></SessionMods><AirSegSellMods><AirSegSell><Vnd>LH</Vnd><FltNum>0599</FltNum><Class>L</Class><StartDt>20191221</StartDt><StartAirp>ADD</StartAirp><EndAirp>FRA</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>AC</Vnd><FltNum>0875</FltNum><Class>L</Class><StartDt>20191222</StartDt><StartAirp>FRA</StartAirp><EndAirp>YUL</EndAirp><Status>GK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell></AirSegSellMods><PNRBFRetrieveMods><CurrentPNR/></PNRBFRetrieveMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>1</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>2</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>3</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>4</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>5</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>6</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>7</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>8</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods>",
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
				   " <soapenv:Body><SubmitXmlOnSessionResponse xmlns=\"http://webservices.galileo.com\"><SubmitXmlOnSessionResult><PNRBFManagement_51 xmlns=\"\"><SessionInfo><AreaInfoResp><Sys>1V</Sys><Processor>C</Processor><GrpModeActivatedInd>N</GrpModeActivatedInd><AAAAreaAry><AAAAreaInfo><AAAArea>A</AAAArea><ActiveInd>Y</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials>WS</AgntInitials><Duty>AG</Duty><AgncyPCC>12NJ</AgncyPCC><DomMode>BASIC</DomMode><IntlMode>ECAC</IntlMode><PNRDataInd>Y</PNRDataInd><PNRName>NO NAMES</PNRName><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>B</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>C</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>D</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>E</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo></AAAAreaAry></AreaInfoResp></SessionInfo><AirSegSell><AirSell><DisplaySequenceNumber/><Vnd>LH</Vnd><FltNum>599</FltNum><OpSuf/><Class>L</Class><StartDt>20191221</StartDt><DtChg>1</DtChg><StartAirp>ADD</StartAirp><EndAirp>FRA</EndAirp><StartTm>2350</StartTm><EndTm>520</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV>CL</OpAirV></AirSell><TextMsg><Txt>OPERATED BY LUFTHANSA CITYLINE GMBH</Txt></TextMsg><TextMsg><Txt><![CDATA[DEPARTS ADD TERMINAL 2  - ARRIVES FRA TERMINAL 1]]></Txt></TextMsg><AirSell><DisplaySequenceNumber/><Vnd>AC</Vnd><FltNum>875</FltNum><OpSuf/><Class>L</Class><StartDt>20191222</StartDt><DtChg>0</DtChg><StartAirp>FRA</StartAirp><EndAirp>YUL</EndAirp><StartTm>1005</StartTm><EndTm>1205</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt><![CDATA[OFFER CAR/HOTEL    |CAL\t     |HOA\t]]></Txt></TextMsg><TextMsg><Txt>DEPARTS FRA TERMINAL 1</Txt></TextMsg><TextMsg><Txt>ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS</Txt></TextMsg><TextMsg><Txt>PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION</Txt></TextMsg><TextMsg><Txt>WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES</Txt></TextMsg><TextMsg><Txt>FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES</Txt></TextMsg></AirSegSell><PNRBFRetrieve><Control><KLRCnt>9</KLRCnt><KlrAry><Klr><ID>BP08</ID><NumOccur>1</NumOccur></Klr><Klr><ID>IT01</ID><NumOccur>4</NumOccur></Klr><Klr><ID>IT02</ID><NumOccur>2</NumOccur></Klr></KlrAry></Control><GenPNRInfo><FileAddr/><CodeCheck/><RecLoc/><Ver>0</Ver><OwningCRS>1V</OwningCRS><OwningAgncyName>AVIAJET INTL TVL NETWORK</OwningAgncyName><OwningAgncyPCC>12NJ</OwningAgncyPCC><CreationDt/><CreatingAgntSignOn/><CreatingAgntDuty/><CreatingAgncyIATANum/><OrigBkLocn/><SATONum/><PTAInd>N</PTAInd><InUseInd/><SimultaneousUpdInd/><BorrowedInd>N</BorrowedInd><GlobInd>N</GlobInd><ReadOnlyInd>N</ReadOnlyInd><FareDataExistsInd>N</FareDataExistsInd><PastDtQuickInd>N</PastDtQuickInd><CurAgncyPCC>12NJ</CurAgncyPCC><QInd>N</QInd><TkNumExistInd>N</TkNumExistInd><IMUdataexists>Y</IMUdataexists><ETkDataExistInd>N</ETkDataExistInd><CurDtStamp>20190916</CurDtStamp><CurTmStamp>105728</CurTmStamp><CurAgntSONID>DPBVWS</CurAgntSONID><TravInsuranceInd>N</TravInsuranceInd><PNRBFTicketedInd>N</PNRBFTicketedInd><ZeppelinAgncyInd>N</ZeppelinAgncyInd><AgncyAutoServiceInd>N</AgncyAutoServiceInd><AgncyAutoNotifyInd>N</AgncyAutoNotifyInd><ZeppelinPNRInd>N</ZeppelinPNRInd><PNRAutoServiceInd>N</PNRAutoServiceInd><PNRNotifyInd/><SuperPNRInd>N</SuperPNRInd><PNRBFPurgeDt>NO PURGE</PNRBFPurgeDt><PNRBFChangeInd>Y</PNRBFChangeInd><MCODataExists>N</MCODataExists><OrigRcvdField/><IntContExists/><AllDataAllTime>N</AllDataAllTime><LastActAgntID/><TransPCCName>AVIAJET INTL TVL NETWORK</TransPCCName><URrecordLoc/><UROSindLoc>N</UROSindLoc><URRCBInd>N</URRCBInd><GMTPNRBFCreationDt/><PricingRecordExist>N</PricingRecordExist><ArchivedFeeDataExists>N</ArchivedFeeDataExists><LeisureshopperDataExists>N</LeisureshopperDataExists><SeatDataExists>N</SeatDataExists><FrequentFlyerDataExists>N</FrequentFlyerDataExists><NetTicketDataExists>N</NetTicketDataExists><TinsRemarksExist>N</TinsRemarksExist><ElectronicDataExists>N</ElectronicDataExists><AdditionalItineraryDataExists>N</AdditionalItineraryDataExists><GroupAllocationFileExists>N</GroupAllocationFileExists><ProfileAssociationsExist>N</ProfileAssociationsExist><VendorLocatorDataExists>N</VendorLocatorDataExists><BookingCodeDataExists/><ArneDataExists>N</ArneDataExists><TimaticDataExists>N</TimaticDataExists><LinearFareDataExists>N</LinearFareDataExists><ItineraryRemarksExist>N</ItineraryRemarksExist><IdentificationFieldExists>N</IdentificationFieldExists><EmailAddressExists>N</EmailAddressExists><RuleDataExists>N</RuleDataExists><LSVendorConfirmationExists>N</LSVendorConfirmationExists><AdditionalSrvcs>N</AdditionalSrvcs><ElectronicMiscDocumentList>N</ElectronicMiscDocumentList><TDSProfileExists>N</TDSProfileExists><ServiceInformationExists/><FiledFareDataExists/><VendorRemarksDataExists/><MembershipDataExists/><DividedBookingsExist>N</DividedBookingsExist><ClientFileReferencesExist/><CustomCheckRulesExist/><PassengerInformationExists/><GUID/><ARCNewPNR/><ARCFares/><ARCTicketed/><ARCSplitDivide/><ARCNameAdd/><ARCNameDelete/><ARCItinAdd/><ARCItinDEL/><ARCPhoneAdd/><ARCPhoneDel/><ARCFOPAdd/><ARCFOPDelete/><ARCSSRAdd/><ARCSSRDel/><ARCOSIAdd/><ARCOSIDel/><ReasonCodesspares/></GenPNRInfo><AirSeg><SegNum>1</SegNum><Status>SS</Status><Dt>20191213</Dt><DayChg>01</DayChg><AirV>UA</AirV><NumPsgrs>1</NumPsgrs><StartAirp>YUL</StartAirp><EndAirp>BRU</EndAirp><StartTm>1925</StartTm><EndTm>810</EndTm><BIC>W</BIC><FltNum>8612</FltNum><OpSuf/><COG>N</COG><TklessInd>Y</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType>L</SellType><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>NN</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd>N</OpAirVInd></AirSeg><AirSegOpAirV><OpAirVInfoAry><OpAirVInfo><StartAirp>YUL</StartAirp><EndAirp>BRU</EndAirp><AirV>AC</AirV><AirVName>AIR CANADA</AirVName></OpAirVInfo></OpAirVInfoAry></AirSegOpAirV><AirSeg><SegNum>2</SegNum><Status>SS</Status><Dt>20191214</Dt><DayChg>00</DayChg><AirV>SN</AirV><NumPsgrs>1</NumPsgrs><StartAirp>BRU</StartAirp><EndAirp>FIH</EndAirp><StartTm>1050</StartTm><EndTm>1855</EndTm><BIC>Q</BIC><FltNum>357</FltNum><OpSuf/><COG>N</COG><TklessInd>Y</TklessInd><ConxInd>Y</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType>L</SellType><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>NN</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg><AirSeg><SegNum>3</SegNum><Status>GK</Status><Dt>20191221</Dt><DayChg>01</DayChg><AirV>LH</AirV><NumPsgrs>1</NumPsgrs><StartAirp>ADD</StartAirp><EndAirp>FRA</EndAirp><StartTm>2350</StartTm><EndTm>520</EndTm><BIC>L</BIC><FltNum>599</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>GK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd>Y</OpAirVInd></AirSeg><AirSegOpAirV><OpAirVInfoAry><OpAirVInfo><StartAirp>ADD</StartAirp><EndAirp>FRA</EndAirp><AirV>CL</AirV><AirVName>LUFTHANSA CITYLINE GMBH</AirVName></OpAirVInfo></OpAirVInfoAry></AirSegOpAirV><AirSeg><SegNum>4</SegNum><Status>GK</Status><Dt>20191222</Dt><DayChg>00</DayChg><AirV>AC</AirV><NumPsgrs>1</NumPsgrs><StartAirp>FRA</StartAirp><EndAirp>YUL</EndAirp><StartTm>1005</StartTm><EndTm>1205</EndTm><BIC>L</BIC><FltNum>875</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>Y</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>GK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg></PNRBFRetrieve><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote></PNRBFManagement_51></SubmitXmlOnSessionResult></SubmitXmlOnSessionResponse></soapenv:Body></soapenv:Envelope>"
			   ].join("\n")
		   },
		   {
			   "cmd": "*R",
			   "rq": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>*R</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
			   ].join("\n"),
			   "rs": [
				   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
				   "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
				   " <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">NO NAMES",
				   " 1 UA8612W 13DEC YULBRU SS1   725P  810A|*      FR/SA   E",
				   "         OPERATED BY AIR CANADA",
				   " 2 SN 357Q 14DEC BRUFIH SS1  1050A  655P *         SA   E",
				   " 3 LH 599L 21DEC ADDFRA GK1  1150P  520A|       SA/SU",
				   "         OPERATED BY LUFTHANSA CITYLINE GMBH",
				   " 4 AC 875L 22DEC FRAYUL GK1  1005A 1205P           SU",
				   "&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
				   "</soapenv:Envelope>"
			   ].join("\n")
		   },
		],
	});

	testCases.push({
		title: 'STORE xml example',
		startDt: '2019-09-23 16:01:14',
		input: {
			cmdRq: 'STOREJCB/CDL',
		},
		output: {
			status: 'executed',
			calledCommands: [
				{cmd: 'T:$BN1-1*J05|2-1*JNF/Z0/ACC/CDL', output: [
					">*LF",
					"1/ATFQ",
					"$B-1 C23SEP19",
					"LOS DL ATL Q5.33 1152.00KL10J9M3 NUC1157.33END ROE1.0",
					"FARE USD 1157.00 TAX 18.60US TAX 3.96XA TAX 7.00XY TAX 5.77YC",
					"TAX 70.10NG TAX 50.00QT TAX 20.00TE TAX 245.50YR TOT USD",
					"1577.93",
					"$B-2 C23SEP19",
					"LOS DL ATL 115.20KL10J9M3/IN90 NUC115.20END ROE1.0",
					"FARE USD 115.00 TAX 18.60US TAX 3.96XA TAX 7.00XY TAX 5.77YC",
					"TAX 5.80NG TOT USD 156.13",
					"><",
				].join('\n')},
			],
		},
		httpRequests: [
			{
				"cmd": "*R",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>*R</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>",
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\"> 1.1KLESUN/ARTUR*C05  2.I/1KLESUNE/ANITA*25JAN19 ",
					" 1 DL  55K 29DEC LOSATL SS1  1020P  515A|*      SU/MO   E",
					"&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>",
				].join("\n"),
			},
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
					"\t\t\t\t\t\t\t<SessionMods><AreaInfoReq/></SessionMods><PNRBFRetrieveMods><CurrentPNR/></PNRBFRetrieveMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>1</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>2</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>3</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>4</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>5</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>6</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>7</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>8</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><StorePriceMods><AssocPsgrs><PsgrAry><Psgr><LNameNum>1</LNameNum><PsgrNum>1</PsgrNum><AbsNameNum>1</AbsNameNum></Psgr></PsgrAry></AssocPsgrs><PICOptMod><PIC>J05</PIC></PICOptMod><AssocPsgrs><PsgrAry><Psgr><LNameNum>2</LNameNum><PsgrNum>1</PsgrNum><AbsNameNum>2</AbsNameNum></Psgr></PsgrAry></AssocPsgrs><PICOptMod><PIC>JNF</PIC></PICOptMod><CommissionMod><Amt>0</Amt></CommissionMod><PlatingAirVMods><PlatingAirV>DL</PlatingAirV></PlatingAirVMods><SegSelection><ReqAirVPFs>Y</ReqAirVPFs><SegRangeAry><SegRange><StartSeg>00</StartSeg><EndSeg>00</EndSeg><FareType>P</FareType><PFQual><CRSInd>1V</CRSInd><PublishedFaresInd>Y</PublishedFaresInd><Type>A</Type></PFQual></SegRange></SegRangeAry></SegSelection><PassengerType><PsgrAry><Psgr><LNameNum>1</LNameNum><PsgrNum>1</PsgrNum><AbsNameNum>1</AbsNameNum><PTC>J05</PTC><Age>05</Age></Psgr><Psgr><LNameNum>2</LNameNum><PsgrNum>1</PsgrNum><AbsNameNum>2</AbsNameNum><PTC>JNF</PTC></Psgr><Psgr><LNameNum>0</LNameNum><PsgrNum>0</PsgrNum><AbsNameNum>0</AbsNameNum></Psgr></PsgrAry></PassengerType><GenQuoteInfo><NetFaresOnly>A</NetFaresOnly></GenQuoteInfo></StorePriceMods>",
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
					" <soapenv:Body><SubmitXmlOnSessionResponse xmlns=\"http://webservices.galileo.com\"><SubmitXmlOnSessionResult><PNRBFManagement_51 xmlns=\"\"><SessionInfo><AreaInfoResp><Sys>1V</Sys><Processor>D</Processor><GrpModeActivatedInd>N</GrpModeActivatedInd><AAAAreaAry><AAAAreaInfo><AAAArea>A</AAAArea><ActiveInd>Y</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials>WS</AgntInitials><Duty>AG</Duty><AgncyPCC>2F3K</AgncyPCC><DomMode>BASIC</DomMode><IntlMode>US-ECAC</IntlMode><PNRDataInd>Y</PNRDataInd><PNRName>KLESUN/ARTUR</PNRName><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>B</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>C</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>D</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>E</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo></AAAAreaAry></AreaInfoResp></SessionInfo><PNRBFRetrieve><Control><KLRCnt>12</KLRCnt><KlrAry><Klr><ID>BP08</ID><NumOccur>1</NumOccur></Klr><Klr><ID>BP10</ID><NumOccur>2</NumOccur></Klr><Klr><ID>BP12</ID><NumOccur>2</NumOccur></Klr><Klr><ID>BP47</ID><NumOccur>2</NumOccur></Klr><Klr><ID>BP13</ID><NumOccur>2</NumOccur></Klr><Klr><ID>IT01</ID><NumOccur>1</NumOccur></Klr></KlrAry></Control><GenPNRInfo><FileAddr/><CodeCheck/><RecLoc/><Ver>0</Ver><OwningCRS>1V</OwningCRS><OwningAgncyName>INTERNATIONAL TRAVEL NET</OwningAgncyName><OwningAgncyPCC>2F3K</OwningAgncyPCC><CreationDt/><CreatingAgntSignOn/><CreatingAgntDuty/><CreatingAgncyIATANum/><OrigBkLocn/><SATONum/><PTAInd>N</PTAInd><InUseInd/><SimultaneousUpdInd/><BorrowedInd>N</BorrowedInd><GlobInd>N</GlobInd><ReadOnlyInd>N</ReadOnlyInd><FareDataExistsInd>N</FareDataExistsInd><PastDtQuickInd>N</PastDtQuickInd><CurAgncyPCC>2F3K</CurAgncyPCC><QInd>N</QInd><TkNumExistInd>N</TkNumExistInd><IMUdataexists>Y</IMUdataexists><ETkDataExistInd>N</ETkDataExistInd><CurDtStamp>20190923</CurDtStamp><CurTmStamp>070123</CurTmStamp><CurAgntSONID>DPBVWS</CurAgntSONID><TravInsuranceInd>N</TravInsuranceInd><PNRBFTicketedInd>N</PNRBFTicketedInd><ZeppelinAgncyInd>N</ZeppelinAgncyInd><AgncyAutoServiceInd>N</AgncyAutoServiceInd><AgncyAutoNotifyInd>N</AgncyAutoNotifyInd><ZeppelinPNRInd>N</ZeppelinPNRInd><PNRAutoServiceInd>N</PNRAutoServiceInd><PNRNotifyInd/><SuperPNRInd>N</SuperPNRInd><PNRBFPurgeDt>NO PURGE</PNRBFPurgeDt><PNRBFChangeInd>Y</PNRBFChangeInd><MCODataExists>N</MCODataExists><OrigRcvdField/><IntContExists/><AllDataAllTime>N</AllDataAllTime><LastActAgntID/><TransPCCName>INTERNATIONAL TRAVEL NET</TransPCCName><URrecordLoc/><UROSindLoc>N</UROSindLoc><URRCBInd>N</URRCBInd><GMTPNRBFCreationDt/><PricingRecordExist>N</PricingRecordExist><ArchivedFeeDataExists>N</ArchivedFeeDataExists><LeisureshopperDataExists>N</LeisureshopperDataExists><SeatDataExists>N</SeatDataExists><FrequentFlyerDataExists>N</FrequentFlyerDataExists><NetTicketDataExists>N</NetTicketDataExists><TinsRemarksExist>N</TinsRemarksExist><ElectronicDataExists>N</ElectronicDataExists><AdditionalItineraryDataExists>N</AdditionalItineraryDataExists><GroupAllocationFileExists>N</GroupAllocationFileExists><ProfileAssociationsExist>N</ProfileAssociationsExist><VendorLocatorDataExists>N</VendorLocatorDataExists><BookingCodeDataExists/><ArneDataExists>N</ArneDataExists><TimaticDataExists>N</TimaticDataExists><LinearFareDataExists>N</LinearFareDataExists><ItineraryRemarksExist>N</ItineraryRemarksExist><IdentificationFieldExists>N</IdentificationFieldExists><EmailAddressExists>N</EmailAddressExists><RuleDataExists>N</RuleDataExists><LSVendorConfirmationExists>N</LSVendorConfirmationExists><AdditionalSrvcs>N</AdditionalSrvcs><ElectronicMiscDocumentList>N</ElectronicMiscDocumentList><TDSProfileExists>N</TDSProfileExists><ServiceInformationExists/><FiledFareDataExists/><VendorRemarksDataExists/><MembershipDataExists/><DividedBookingsExist>N</DividedBookingsExist><ClientFileReferencesExist/><CustomCheckRulesExist/><PassengerInformationExists/><GUID/><ARCNewPNR/><ARCFares/><ARCTicketed/><ARCSplitDivide/><ARCNameAdd/><ARCNameDelete/><ARCItinAdd/><ARCItinDEL/><ARCPhoneAdd/><ARCPhoneDel/><ARCFOPAdd/><ARCFOPDelete/><ARCSSRAdd/><ARCSSRDel/><ARCOSIAdd/><ARCOSIDel/><ReasonCodesspares/></GenPNRInfo><LNameInfo><LNameNum>1</LNameNum><NumPsgrs>1</NumPsgrs><NameType/><LName>KLESUN</LName></LNameInfo><FNameInfo><PsgrNum>1</PsgrNum><AbsNameNum>1</AbsNameNum><FName>ARTUR</FName></FNameInfo><PsgrsName><NameType/><LNameNum>1</LNameNum><PsgrNum>1</PsgrNum><AbsNameNum>1</AbsNameNum><NameOrdNum>1</NameOrdNum><InfInd/><InfBirthDt/><InfLinkedAdtName>0</InfLinkedAdtName><Spare/><NameNum>KLESUN@ARTUR@@</NameNum></PsgrsName><LNameInfo><LNameNum>2</LNameNum><NumPsgrs>1</NumPsgrs><NameType>I</NameType><LName>KLESUNE</LName></LNameInfo><FNameInfo><PsgrNum>1</PsgrNum><AbsNameNum>2</AbsNameNum><FName>ANITA</FName></FNameInfo><PsgrsName><NameType>I</NameType><LNameNum>2</LNameNum><PsgrNum>1</PsgrNum><AbsNameNum>2</AbsNameNum><NameOrdNum>2</NameOrdNum><InfInd>Y</InfInd><InfBirthDt>25JAN19</InfBirthDt><InfLinkedAdtName>1</InfLinkedAdtName><Spare/><NameNum>KLESUNE@ANITA@@</NameNum></PsgrsName><NameRmkInfo><LNameNum>1</LNameNum><PsgrNum/><AbsNameNum/><NameRmk>C05</NameRmk></NameRmkInfo><NameRmkInfo><LNameNum>2</LNameNum><PsgrNum/><AbsNameNum/><NameRmk>25JAN19</NameRmk></NameRmkInfo><AirSeg><SegNum>1</SegNum><Status>SS</Status><Dt>20191229</Dt><DayChg>01</DayChg><AirV>DL</AirV><NumPsgrs>1</NumPsgrs><StartAirp>LOS</StartAirp><EndAirp>ATL</EndAirp><StartTm>2220</StartTm><EndTm>515</EndTm><BIC>K</BIC><FltNum>55</FltNum><OpSuf/><COG>N</COG><TklessInd>Y</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType>L</SellType><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>NN</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg></PNRBFRetrieve><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002308</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>NO STORED FARES EXIST</Text></ErrText></DocProdDisplayStoredQuote><FareInfo><RespHeader><UniqueKey>0000</UniqueKey><CRTOutput>N</CRTOutput><ErrMsg>N</ErrMsg><AgntAlert>N</AgntAlert><SmartParsedData>N</SmartParsedData><NextGenInd>Y</NextGenInd><Spares1>NNN</Spares1><FQSOnlyItin>N</FQSOnlyItin><HostUse14>N</HostUse14><IFQLastF0>N</IFQLastF0><IFQLastFQ>N</IFQLastFQ><IFQLastD>N</IFQLastD><IFQLastB>N</IFQLastB><IFQLastV>N</IFQLastV><HostUse20>N</HostUse20><AppInd1>N</AppInd1><AppInd2>N</AppInd2><AppInd3>Y</AppInd3><AppInd4>N</AppInd4><AppInd5>N</AppInd5><AppInd6>N</AppInd6><AppInd7>N</AppInd7><AppInd8>N</AppInd8><AppInd9>N</AppInd9><AppInd10>N</AppInd10><AppInd11>N</AppInd11><AppInd12>N</AppInd12><AppInd13>N</AppInd13><AppInd14>N</AppInd14><AppInd15>N</AppInd15><AppInd16>N</AppInd16></RespHeader><ItinSeg><UniqueKey>0001</UniqueKey><AirV>DL</AirV><FltNum>55</FltNum><StartDt>20191229</StartDt><StartPt>LOS</StartPt><EndPt>ATL</EndPt><SegType>0</SegType><DayDifferential>1</DayDifferential><NoStopAtBoardPt>N</NoStopAtBoardPt><BreakInJrny>N</BreakInJrny><BreakNoDirectService>N</BreakNoDirectService><FictitiousPt>N</FictitiousPt><MoreDistantPt>N</MoreDistantPt><FQSGenFictitiousPt>N</FQSGenFictitiousPt><StartCityNotPrevOffCity>N</StartCityNotPrevOffCity><Spare1>N</Spare1><StartTm>2220</StartTm><EndTm>515</EndTm><BIC>K</BIC><Spare2>NNNNNNNN</Spare2><Spare3>100</Spare3><Mile>5840</Mile><IntlStartCity>Y</IntlStartCity><IntlEndCity>N</IntlEndCity><PtToPtAvail>N</PtToPtAvail><Spare4>NNNNN</Spare4><AvailLinkStatus/><AvailSource/><BookingCabinClsSeg>Y</BookingCabinClsSeg></ItinSeg><SegRelatedInfo><UniqueKey>1</UniqueKey><QuoteNum>1</QuoteNum><RelSegNum>1</RelSegNum><NotValidBeforeDt>20191229</NotValidBeforeDt><NotValidAfterDt>20191229</NotValidAfterDt><Stopover/><FIC>KL10J9M3</FIC><TkDesignator/><BagInfo>2PC</BagInfo><Fare> 1157.33</Fare><HostUseOnly54>1</HostUseOnly54><HostUseOnly55>1</HostUseOnly55><HostUseOnly56>1</HostUseOnly56><FareCabinClsSeg>E</FareCabinClsSeg><FlownMile>05840</FlownMile><MaxPermittedMile>00000</MaxPermittedMile><HostUseOnly76>N</HostUseOnly76><PFOverrideWaivers>N</PFOverrideWaivers><FlatFQ>N</FlatFQ><PermittedDiscFare>N</PermittedDiscFare><PFQuoted>N</PFQuoted><Spare1>NNN</Spare1><NetFareFIC>KL10J9M3</NetFareFIC><TkFareFIC>KL10J9M3</TkFareFIC><SellPCCSellAuthority>N</SellPCCSellAuthority><SellPCCTkAuthority>N</SellPCCTkAuthority><SellIATASellAuthority>N</SellIATASellAuthority><SellIATATkAuthority>N</SellIATATkAuthority><TkDesignatorCat35>N</TkDesignatorCat35><CAT35BagInd>N</CAT35BagInd><Spare2/><ProviderPCC/><ProviderIATANum/><TkPsgrFareFIC/><TkAuditorFareAmt/></SegRelatedInfo><PNRFareDetail><UniqueKey>1</UniqueKey><SegNum>1</SegNum><QuoteNum>1</QuoteNum><FareDir>F</FareDir><FareType>XOX</FareType><AirVParticipation>0</AirVParticipation><RuleTariff>1</RuleTariff><PvtTariff>N</PvtTariff><RuleNum>3MTN</RuleNum><FareCatg/><FareOwnCarrier>DL</FareOwnCarrier><FareComponentNum>1</FareComponentNum></PNRFareDetail><Surcharge><UniqueKey>0001</UniqueKey><QuoteNum>1</QuoteNum><ISGRIRelatedSecItinSegNum>1</ISGRIRelatedSecItinSegNum><Type>5</Type><CumulativeNumStops>0</CumulativeNumStops><Amt>533</Amt><Currency>NUC</Currency><DecPos>2</DecPos></Surcharge><RulesInfo><UniqueKey>1</UniqueKey><QuoteNum>1</QuoteNum><FareNum>1</FareNum><FareRuleInfo>Y</FareRuleInfo><PermittedDisc>N</PermittedDisc><DiscAdultFare>N</DiscAdultFare><GenFare>N</GenFare><NetFare>N</NetFare><FareRestricted>N</FareRestricted><NGGFIntlInd>Y</NGGFIntlInd><Spare1>N</Spare1><StartPt>LOS</StartPt><EndPt>ATL</EndPt><FirstTravDt>20191229</FirstTravDt><AirV>DL</AirV><FIC>KL10J9M3</FIC><TotFareComponent>115733</TotFareComponent><Currency>NUC</Currency><DecPos>2</DecPos><FareAmt>115200</FareAmt><RuleSupplierID>0</RuleSupplierID><RuleNumOrdinal>00F3D4</RuleNumOrdinal><FareTariffNum>0001</FareTariffNum><RuleTextOrdinalNum>E3D5</RuleTextOrdinalNum><RulesApply>Y</RulesApply><RtesApply>Y</RtesApply><NoRulesExist>N</NoRulesExist><Spare2>NNNNN</Spare2><DBInd>N</DBInd><HostUseOnly91>N</HostUseOnly91><PFQuoted>N</PFQuoted><Spare3>YNNNN</Spare3><DBID/><FareRuleInfoYQual><GlobDirOrdinal>AT</GlobDirOrdinal><HIFCity1/><HIFCity2/><MileSurchargeRtgInd>1</MileSurchargeRtgInd><FlownMileComponent>5840</FlownMileComponent><MPMComponent>7008</MPMComponent><DifBetween>0</DifBetween><ExtraMileCity1/><ExtraMileCity2/><ExtraMileCity3/><OTWTransportingAirV>DL</OTWTransportingAirV><ComponentAirV1/><ComponentAirV2/><Key>NADT3MTN0010000</Key></FareRuleInfoYQual></RulesInfo><GenQuoteDetails><UniqueKey>1</UniqueKey><QuoteNum>1</QuoteNum><QuoteType>C</QuoteType><LastTkDt>20190926</LastTkDt><QuoteDt>20190923</QuoteDt><IntlSaleInd/><BaseFareCurrency>USD</BaseFareCurrency><BaseFareAmt>115700</BaseFareAmt><LowestOrNUCFare>0</LowestOrNUCFare><BaseDecPos>2</BaseDecPos><EquivCurrency/><EquivAmt>0</EquivAmt><EquivDecPos>0</EquivDecPos><TotCurrency>USD</TotCurrency><TotAmt>157793</TotAmt><TotDecPos>2</TotDecPos><ITNum/><RteBasedQuote>Y</RteBasedQuote><M0>N</M0><M5>N</M5><M10>N</M10><M15>N</M15><M20>N</M20><M25>N</M25><Spare1>N</Spare1><PrivFQd>N</PrivFQd><PFOverrides>N</PFOverrides><FlatFQd>N</FlatFQd><DirMinApplied>N</DirMinApplied><VATIncInd>N</VATIncInd><PenApplies>Y</PenApplies><Spare2>N</Spare2><QuoteBasis>Y</QuoteBasis><TaxDataAry><TaxData><Country>US</Country><Amt>00018.60</Amt></TaxData><TaxData><Country>XA</Country><Amt>00003.96</Amt></TaxData><TaxData><Country>XY</Country><Amt>00007.00</Amt></TaxData><TaxData><Country>YC</Country><Amt>00005.77</Amt></TaxData><TaxData><Country>NG</Country><Amt>00070.10</Amt></TaxData><TaxData><Country>QT</Country><Amt>00050.00</Amt></TaxData><TaxData><Country>TE</Country><Amt>00020.00</Amt></TaxData><TaxData><Country>YR</Country><Amt>00245.50</Amt></TaxData></TaxDataAry></GenQuoteDetails><GrandFeeTotal><UniqueKey>1</UniqueKey><QuoteNum>1</QuoteNum><PassengerId>0</PassengerId><Crncy>USD</Crncy><DecPos>2</DecPos><SubTotAmt>157793</SubTotAmt><TotFeeAmt>0</TotFeeAmt><GrandTotAmt>157793</GrandTotAmt><BestBuyCompTotAmt>0</BestBuyCompTotAmt><PlatingAirV>DL</PlatingAirV><CCFeesExistInd>N</CCFeesExistInd><CCFeesExcludedInd/><TKTFeesExcludedInd/><Spare/></GrandFeeTotal><PsgrTypes><UniqueKey>0001</UniqueKey><PICReq>J05</PICReq><QueryAmt>5</QueryAmt><QueryIATAFmt>N</QueryIATAFmt><QueryApolloFmt>Y</QueryApolloFmt><PercentQuery>N</PercentQuery><AmtQuery>N</AmtQuery><AgeQuery>Y</AgeQuery><ReqReturnedPIC>N</ReqReturnedPIC><QuoteOnlyPICReq>N</QuoteOnlyPICReq><HasDiscData>N</HasDiscData><RespPIC>ADT</RespPIC><RespAmt>0</RespAmt><RespIATAFmt>N</RespIATAFmt><RespATPCOFmt>N</RespATPCOFmt><PercentResp>N</PercentResp><AmtResp>N</AmtResp><AgeResp>N</AgeResp><PFCsApply>N</PFCsApply><NPFReq>N</NPFReq><Spare1>N</Spare1><PsgrNumAry><PsgrNum>1</PsgrNum></PsgrNumAry></PsgrTypes><BaggDispInfo><UniqueKey>1</UniqueKey><QuoteNum>1</QuoteNum><BaggType>A</BaggType><PsgrType>J05</PsgrType><StartPt>LOS</StartPt><EndPt>ATL</EndPt><BaggAllwnceVal>2</BaggAllwnceVal><BaggAllwnceUnit>P</BaggAllwnceUnit><Vnd>DL</Vnd><Spare/><BaggTripStartSegNum>1</BaggTripStartSegNum><BaggTripEndSegNum>1</BaggTripEndSegNum><URL>VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/DL</URL></BaggDispInfo><BaggDispFQandFQBB><UniqueKey>1</UniqueKey><QuoteNum>1</QuoteNum><BaggNum>1</BaggNum><BaggFee><![CDATA[       0]]></BaggFee><Currency>NGN</Currency><WtDimension>UPTO50LB/23KG AND UPTO62LI/158LCM</WtDimension><BaggTripStartSegNum>1</BaggTripStartSegNum><BaggTripEndSegNum>1</BaggTripEndSegNum></BaggDispFQandFQBB><BaggDispFQandFQBB><UniqueKey>1</UniqueKey><QuoteNum>1</QuoteNum><BaggNum>2</BaggNum><BaggFee><![CDATA[       0]]></BaggFee><Currency>NGN</Currency><WtDimension>UPTO50LB/23KG AND UPTO62LI/158LCM</WtDimension><BaggTripStartSegNum>1</BaggTripStartSegNum><BaggTripEndSegNum>1</BaggTripEndSegNum></BaggDispFQandFQBB><BaggDispInfo><UniqueKey>1</UniqueKey><QuoteNum>1</QuoteNum><BaggType>B</BaggType><PsgrType>J05</PsgrType><StartPt>LOS</StartPt><EndPt>ATL</EndPt><BaggAllwnceVal>1</BaggAllwnceVal><BaggAllwnceUnit>P</BaggAllwnceUnit><Vnd>DL</Vnd><Spare/><BaggTripStartSegNum>1</BaggTripStartSegNum><BaggTripEndSegNum>1</BaggTripEndSegNum></BaggDispInfo><BaggDispFQandFQBB><UniqueKey>1</UniqueKey><QuoteNum>1</QuoteNum><BaggNum>1</BaggNum><BaggFee><![CDATA[       0]]></BaggFee><Currency>NGN</Currency><WtDimension>PERSONAL ITEM</WtDimension><BaggTripStartSegNum>1</BaggTripStartSegNum><BaggTripEndSegNum>1</BaggTripEndSegNum></BaggDispFQandFQBB><BaggDispInfo><UniqueKey>1</UniqueKey><QuoteNum>1</QuoteNum><BaggType>E</BaggType><PsgrType>J05</PsgrType><StartPt>LOS</StartPt><EndPt>ATL</EndPt><BaggAllwnceVal>888</BaggAllwnceVal><BaggAllwnceUnit/><Vnd>DL</Vnd><Spare/><BaggTripStartSegNum>1</BaggTripStartSegNum><BaggTripEndSegNum>1</BaggTripEndSegNum><URL>VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/DL</URL></BaggDispInfo><ExtendedQuoteInformation><UniqueKey>1</UniqueKey><QuoteNum>1</QuoteNum><ETkInd>Y</ETkInd><PaperTkInd>N</PaperTkInd><PlatingInd>N</PlatingInd><NetFareInd>N</NetFareInd><TkFareInd>N</TkFareInd><LLPFQuoted>N</LLPFQuoted><CommUnresolved>N</CommUnresolved><DataRetQuote>N</DataRetQuote><FareIT>N</FareIT><BagInd>N</BagInd><TkDesignator>N</TkDesignator><FareBT>N</FareBT><FiledNetFare>N</FiledNetFare><NTypeComm>N</NTypeComm><Spare1>NN</Spare1><NetFareCrncy/><NetFareAmt>0</NetFareAmt><NetFareNumDecs>0</NetFareNumDecs><EquivNetFareCrcy/><EquivNetFareAmt>0</EquivNetFareAmt><EquivNumDecs>0</EquivNumDecs><TotNetCrcy/><TotNetAmt>0</TotNetAmt><TotNetNumDecs>0</TotNetNumDecs><TkFareCrcy/><TkFareAmt>0</TkFareAmt><TkNumDecs>0</TkNumDecs><EquivTkCrncy/><EquivTkAmt>0</EquivTkAmt><EquivTkNumDecs>0</EquivTkNumDecs><TotTkCrncy/><TotTkAmt>0</TotTkAmt><TotTkNumDecs>0</TotTkNumDecs><CrncyBaseFareTkPsgrCoupon/><TkPsgrCouponAmt>0</TkPsgrCouponAmt><TkPsgrCouponNumDecs>0</TkPsgrCouponNumDecs><EquivCrncyTkPsgrCoupon/><EquivAmtTkPsgrCoupon>0</EquivAmtTkPsgrCoupon><EquivNumDecsTkPsgrCoupon>0</EquivNumDecsTkPsgrCoupon><TotCrncyTkPsgrCoupon/><TotAmtTkPsgrCoupon>0</TotAmtTkPsgrCoupon><TotNumDecsTkPsgrCoupon>0</TotNumDecsTkPsgrCoupon><MethodType/><Type/><CARCode/><ValueCode/><TkPCC/><TkPCCIATANum/><SellingPCC/><SellingIATANum/><TkPCCTkAuthority>N</TkPCCTkAuthority><TkPCCSellAuthority>N</TkPCCSellAuthority><SellPCCTkAuthority>N</SellPCCTkAuthority><SellPCCSellAuthority>N</SellPCCSellAuthority><Spare2>NNNN</Spare2></ExtendedQuoteInformation><JrnyType><UniqueKey>0001</UniqueKey><QuoteNum>1</QuoteNum><NumJrnyItems>1</NumJrnyItems><CircTrip>N</CircTrip><RT>N</RT><OW>Y</OW><OpenJaw>N</OpenJaw><RndWorld>N</RndWorld><Spare1>NNN</Spare1><NumFareComponents>1</NumFareComponents><HIF>N</HIF><StopSurcharge>N</StopSurcharge><NotesApply>N</NotesApply><NoBankBuyRateHeld>N</NoBankBuyRateHeld><Spare2>NNNN</Spare2></JrnyType><CityIndInfo><UniqueKey>1</UniqueKey><QuoteNum>1</QuoteNum><FareNum>1</FareNum><CityIndAry><CityInd><Mandatory-NoStopover>N</Mandatory-NoStopover><MandatoryRtePt>N</MandatoryRtePt><CityWI1stLevelSideTrip>N</CityWI1stLevelSideTrip><CityWI2ndLevelSideTrip>N</CityWI2ndLevelSideTrip><AllowOpenJawBreak>N</AllowOpenJawBreak><SurfaceSectorInc>N</SurfaceSectorInc><SurfaceSectorExc>N</SurfaceSectorExc><SysGenFictitiousPt>N</SysGenFictitiousPt><NegMileExcMPMReductionPt>N</NegMileExcMPMReductionPt><RIOSAOMileCity>N</RIOSAOMileCity><UnspecExtraMileAllow>N</UnspecExtraMileAllow><SouthAtlanticMileCity>N</SouthAtlanticMileCity><ClassDifferential>N</ClassDifferential><IguassuFallsMileCity>N</IguassuFallsMileCity><Spare1>NN</Spare1></CityInd><CityInd><Mandatory-NoStopover>N</Mandatory-NoStopover><MandatoryRtePt>N</MandatoryRtePt><CityWI1stLevelSideTrip>N</CityWI1stLevelSideTrip><CityWI2ndLevelSideTrip>N</CityWI2ndLevelSideTrip><AllowOpenJawBreak>N</AllowOpenJawBreak><SurfaceSectorInc>N</SurfaceSectorInc><SurfaceSectorExc>N</SurfaceSectorExc><SysGenFictitiousPt>N</SysGenFictitiousPt><NegMileExcMPMReductionPt>N</NegMileExcMPMReductionPt><RIOSAOMileCity>N</RIOSAOMileCity><UnspecExtraMileAllow>N</UnspecExtraMileAllow><SouthAtlanticMileCity>N</SouthAtlanticMileCity><ClassDifferential>N</ClassDifferential><IguassuFallsMileCity>N</IguassuFallsMileCity><Spare1>NN</Spare1></CityInd></CityIndAry></CityIndInfo><InfoMsg><UniqueKey>0001</UniqueKey><QuoteNum>1</QuoteNum><MsgNum>6</MsgNum><AppNum>0</AppNum><MsgType>1</MsgType><Lang>0</Lang><Text>NONREF/PENALTY APPLIES</Text></InfoMsg><InfoMsg><UniqueKey>0001</UniqueKey><QuoteNum>1</QuoteNum><MsgNum>0</MsgNum><AppNum>0</AppNum><MsgType>6</MsgType><Lang>0</Lang><Text>01 NVB29DEC/NVA29DEC</Text></InfoMsg><InfoMsg><UniqueKey>0001</UniqueKey><QuoteNum>1</QuoteNum><MsgNum>1182</MsgNum><AppNum>0</AppNum><MsgType>2</MsgType><Lang>0</Lang><Text>TICKETING WITHIN 72 HOURS AFTER RESERVATION</Text></InfoMsg><InfoMsg><UniqueKey>0001</UniqueKey><QuoteNum>1</QuoteNum><MsgNum>1006</MsgNum><AppNum>0</AppNum><MsgType>2</MsgType><Lang>0</Lang><Text>LAST DATE TO PURCHASE TICKET: 26SEP19 / 0601 SFO</Text></InfoMsg><InfoMsg><UniqueKey>0001</UniqueKey><QuoteNum>1</QuoteNum><MsgNum>1170</MsgNum><AppNum>0</AppNum><MsgType>2</MsgType><Lang>0</Lang><Text>TICKETING AGENCY 2F3K</Text></InfoMsg><InfoMsg><UniqueKey>0001</UniqueKey><QuoteNum>1</QuoteNum><MsgNum>1171</MsgNum><AppNum>0</AppNum><MsgType>2</MsgType><Lang>0</Lang><Text>DEFAULT PLATING CARRIER DL</Text></InfoMsg><InfoMsg><UniqueKey>0001</UniqueKey><QuoteNum>1</QuoteNum><MsgNum>1026</MsgNum><AppNum>0</AppNum><MsgType>2</MsgType><Lang>0</Lang><Text>E-TKT REQUIRED</Text></InfoMsg><RsvnRules><UniqueKey>0</UniqueKey><Spare1>NNN</Spare1><HoursMin>N</HoursMin><DaysMin>N</DaysMin><MonthsMin>N</MonthsMin><OccurIndMin>N</OccurIndMin><SameDayMin>N</SameDayMin><Spare2>NNNNNNNN</Spare2><TmDOWMin>0</TmDOWMin><NumOccurMin>0</NumOccurMin><FareComponent>1</FareComponent><Spare3/><Spare4>NNN</Spare4><HoursMax>N</HoursMax><DaysMax>N</DaysMax><MonthsMax>N</MonthsMax><OccurIndMax>N</OccurIndMax><SameDayMax>N</SameDayMax><StartIndMax>N</StartIndMax><CompletionInd>N</CompletionInd><Spare5>NNNNNN</Spare5><TmDOWMax>0</TmDOWMax><NumOccurMax>0</NumOccurMax><Spare6/><Spare7>NNN</Spare7><NoRsvn>N</NoRsvn><AdvRsvnOnlyIfTk>N</AdvRsvnOnlyIfTk><AdvRsvnAnyTm>Y</AdvRsvnAnyTm><AdvRsvnHrs>N</AdvRsvnHrs><AdvRsvnDays>N</AdvRsvnDays><AdvRsvnMonths>N</AdvRsvnMonths><AdvRsvnEarliestTm>N</AdvRsvnEarliestTm><AdvRsvnLatestTm>N</AdvRsvnLatestTm><AdvRsvnWaived>N</AdvRsvnWaived><AdvRsvnDataExists>N</AdvRsvnDataExists><AdvRsvnEndItem>N</AdvRsvnEndItem><Spare8>NN</Spare8><Spare9>NNN</Spare9><AdvTkEarliestTm>Y</AdvTkEarliestTm><AdvTkLatestTm>N</AdvTkLatestTm><AdvTkRsvnHrs>Y</AdvTkRsvnHrs><AdvTkRsvnDays>N</AdvTkRsvnDays><AdvTkRsvnMonths>N</AdvTkRsvnMonths><AdvTkStartHrs>N</AdvTkStartHrs><AdvTkStartDays>Y</AdvTkStartDays><AdvTkStartMonths>N</AdvTkStartMonths><AdvTkWaived>N</AdvTkWaived><AdvTkAnyTm>N</AdvTkAnyTm><AdvTkEndItem>N</AdvTkEndItem><Spare10>NN</Spare10><AdvRsvnTm>0</AdvRsvnTm><AdvTkRsvnTm>72</AdvTkRsvnTm><AdvTkStartTm>10</AdvTkStartTm><Spare11/><Spare12>NNNN</Spare12><EarliestRsvnDtPresent>N</EarliestRsvnDtPresent><EarliestTkDtPresent>N</EarliestTkDtPresent><LatestRsvnDtPresent>N</LatestRsvnDtPresent><LatestTkDtPresent>N</LatestTkDtPresent><Spare13>NNNNNNNN</Spare13><EarliestRsvnDt/><EarliestTkDt/><LatestRsvnDt/><LatestTkDt/><Spare14/><PenFeeAry><PenFee><DepRequired>N</DepRequired><DepNonRef>N</DepNonRef><TkNonRef>Y</TkNonRef><AirVFee>N</AirVFee><Cancellation>Y</Cancellation><FailConfirmSpace>Y</FailConfirmSpace><ItinChg>N</ItinChg><ReplaceTk>N</ReplaceTk><Applicable>Y</Applicable><ApplicableTo>Y</ApplicableTo><AnytimePenalty>Y</AnytimePenalty><BeforeDeparturePenalty>N</BeforeDeparturePenalty><AfterDeparturePenalty>N</AfterDeparturePenalty><Spare15>NNN</Spare15><Amt>100</Amt><Type>P</Type><Currency/><Spare16>NNNNNNNN</Spare16><Spare17/></PenFee><PenFee><DepRequired>N</DepRequired><DepNonRef>N</DepNonRef><TkNonRef>N</TkNonRef><AirVFee>N</AirVFee><Cancellation>N</Cancellation><FailConfirmSpace>N</FailConfirmSpace><ItinChg>Y</ItinChg><ReplaceTk>N</ReplaceTk><Applicable>Y</Applicable><ApplicableTo>Y</ApplicableTo><AnytimePenalty>Y</AnytimePenalty><BeforeDeparturePenalty>N</BeforeDeparturePenalty><AfterDeparturePenalty>N</AfterDeparturePenalty><Spare15>NNN</Spare15><Amt>180.00</Amt><Type>D</Type><Currency>USD</Currency><Spare16>NNNNNNNN</Spare16><Spare17/></PenFee></PenFeeAry><Cat0>N</Cat0><Cat1>N</Cat1><Cat2>Y</Cat2><Cat3>Y</Cat3><Cat4>Y</Cat4><Cat5>Y</Cat5><Cat6>N</Cat6><Cat7>N</Cat7><Cat8>Y</Cat8><Cat9>Y</Cat9><Cat10>Y</Cat10><Cat11>N</Cat11><Cat12>N</Cat12><Cat13>N</Cat13><Cat14>N</Cat14><Cat15>Y</Cat15><Cat16>Y</Cat16><Cat17>N</Cat17><Cat18>Y</Cat18><Cat19>N</Cat19><Cat20>N</Cat20><Cat21>N</Cat21><Cat22>N</Cat22><Cat23>N</Cat23><Cat24>N</Cat24><Cat25>N</Cat25><Cat26>N</Cat26><Cat27>N</Cat27><Cat28>N</Cat28><Cat29>N</Cat29><Cat30>N</Cat30><Cat31>N</Cat31><RestrictiveDt>20190926</RestrictiveDt><SurchargeAmt>533</SurchargeAmt><NotUSACity>Y</NotUSACity><Spare18>NNNNNNN</Spare18><MissingRules>N</MissingRules><Spare19>NNNNNNN</Spare19><Spare20/></RsvnRules><FareConstruction><UniqueKey>0001</UniqueKey><QuoteNum>1</QuoteNum><FareConstructText>LOS DL ATL Q5.33 1152.00KL10J9M3 NUC1157.33END ROE1.0</FareConstructText></FareConstruction><SellStructFareConstruct><UniqueKey>1</UniqueKey><QuoteNum>1</QuoteNum><FareConstruction>1ALOS,1BDL,1AATL,4BQ5.33,4A1152.00,1CKL10J9M3,3E0101,1ENUC,4F1157.33,1FEND,1GROE1.0</FareConstruction></SellStructFareConstruct><SellFareConstruct><UniqueKey>1</UniqueKey><QuoteNum>1</QuoteNum><FareConstruction>LOS DL ATL Q5.33 1152.00 NUC1157.33END ROE1.0</FareConstruction></SellFareConstruct><SegRelatedInfo><UniqueKey>2</UniqueKey><QuoteNum>2</QuoteNum><RelSegNum>1</RelSegNum><NotValidBeforeDt>20191229</NotValidBeforeDt><NotValidAfterDt>20191229</NotValidAfterDt><Stopover/><FIC>KL10J9M3</FIC><TkDesignator>IN90</TkDesignator><BagInfo>1PC</BagInfo><Fare><![CDATA[  115.20]]></Fare><HostUseOnly54>1</HostUseOnly54><HostUseOnly55>1</HostUseOnly55><HostUseOnly56>1</HostUseOnly56><FareCabinClsSeg>E</FareCabinClsSeg><FlownMile>05840</FlownMile><MaxPermittedMile>00000</MaxPermittedMile><HostUseOnly76>N</HostUseOnly76><PFOverrideWaivers>N</PFOverrideWaivers><FlatFQ>N</FlatFQ><PermittedDiscFare>Y</PermittedDiscFare><PFQuoted>N</PFQuoted><Spare1>NNN</Spare1><NetFareFIC>KL10J9M3</NetFareFIC><TkFareFIC>KL10J9M3</TkFareFIC><SellPCCSellAuthority>N</SellPCCSellAuthority><SellPCCTkAuthority>N</SellPCCTkAuthority><SellIATASellAuthority>N</SellIATASellAuthority><SellIATATkAuthority>N</SellIATATkAuthority><TkDesignatorCat35>N</TkDesignatorCat35><CAT35BagInd>N</CAT35BagInd><Spare2/><ProviderPCC/><ProviderIATANum/><TkPsgrFareFIC/><TkAuditorFareAmt/></SegRelatedInfo><PNRFareDetail><UniqueKey>2</UniqueKey><SegNum>1</SegNum><QuoteNum>2</QuoteNum><FareDir>F</FareDir><FareType>XOX</FareType><AirVParticipation>0</AirVParticipation><RuleTariff>1</RuleTariff><PvtTariff>N</PvtTariff><RuleNum>3MTN</RuleNum><FareCatg>D</FareCatg><FareOwnCarrier>DL</FareOwnCarrier><FareComponentNum>1</FareComponentNum></PNRFareDetail><RulesInfo><UniqueKey>2</UniqueKey><QuoteNum>2</QuoteNum><FareNum>1</FareNum><FareRuleInfo>Y</FareRuleInfo><PermittedDisc>N</PermittedDisc><DiscAdultFare>N</DiscAdultFare><GenFare>N</GenFare><NetFare>N</NetFare><FareRestricted>N</FareRestricted><NGGFIntlInd>Y</NGGFIntlInd><Spare1>N</Spare1><StartPt>LOS</StartPt><EndPt>ATL</EndPt><FirstTravDt>20191229</FirstTravDt><AirV>DL</AirV><FIC>KL10J9M3</FIC><TotFareComponent>11520</TotFareComponent><Currency>NUC</Currency><DecPos>2</DecPos><FareAmt>11520</FareAmt><RuleSupplierID>0</RuleSupplierID><RuleNumOrdinal>00F3D4</RuleNumOrdinal><FareTariffNum>0001</FareTariffNum><RuleTextOrdinalNum>E3D5</RuleTextOrdinalNum><RulesApply>Y</RulesApply><RtesApply>Y</RtesApply><NoRulesExist>N</NoRulesExist><Spare2>NNNNN</Spare2><DBInd>N</DBInd><HostUseOnly91>N</HostUseOnly91><PFQuoted>N</PFQuoted><Spare3>YNNNN</Spare3><DBID/><FareRuleInfoYQual><GlobDirOrdinal>AT</GlobDirOrdinal><HIFCity1/><HIFCity2/><MileSurchargeRtgInd>1</MileSurchargeRtgInd><FlownMileComponent>5840</FlownMileComponent><MPMComponent>7008</MPMComponent><DifBetween>0</DifBetween><ExtraMileCity1/><ExtraMileCity2/><ExtraMileCity3/><OTWTransportingAirV>DL</OTWTransportingAirV><ComponentAirV1/><ComponentAirV2/><Key>NINF3MTN0010000</Key></FareRuleInfoYQual></RulesInfo><GenQuoteDetails><UniqueKey>2</UniqueKey><QuoteNum>2</QuoteNum><QuoteType>C</QuoteType><LastTkDt>20190926</LastTkDt><QuoteDt>20190923</QuoteDt><IntlSaleInd/><BaseFareCurrency>USD</BaseFareCurrency><BaseFareAmt>11500</BaseFareAmt><LowestOrNUCFare>0</LowestOrNUCFare><BaseDecPos>2</BaseDecPos><EquivCurrency/><EquivAmt>0</EquivAmt><EquivDecPos>0</EquivDecPos><TotCurrency>USD</TotCurrency><TotAmt>15613</TotAmt><TotDecPos>2</TotDecPos><ITNum/><RteBasedQuote>Y</RteBasedQuote><M0>N</M0><M5>N</M5><M10>N</M10><M15>N</M15><M20>N</M20><M25>N</M25><Spare1>N</Spare1><PrivFQd>N</PrivFQd><PFOverrides>N</PFOverrides><FlatFQd>N</FlatFQd><DirMinApplied>N</DirMinApplied><VATIncInd>N</VATIncInd><PenApplies>Y</PenApplies><Spare2>N</Spare2><QuoteBasis>N</QuoteBasis><TaxDataAry><TaxData><Country>US</Country><Amt>00018.60</Amt></TaxData><TaxData><Country>XA</Country><Amt>00003.96</Amt></TaxData><TaxData><Country>XY</Country><Amt>00007.00</Amt></TaxData><TaxData><Country>YC</Country><Amt>00005.77</Amt></TaxData><TaxData><Country>NG</Country><Amt>00005.80</Amt></TaxData></TaxDataAry></GenQuoteDetails><GrandFeeTotal><UniqueKey>2</UniqueKey><QuoteNum>2</QuoteNum><PassengerId>0</PassengerId><Crncy>USD</Crncy><DecPos>2</DecPos><SubTotAmt>15613</SubTotAmt><TotFeeAmt>0</TotFeeAmt><GrandTotAmt>15613</GrandTotAmt><BestBuyCompTotAmt>0</BestBuyCompTotAmt><PlatingAirV>DL</PlatingAirV><CCFeesExistInd>N</CCFeesExistInd><CCFeesExcludedInd/><TKTFeesExcludedInd/><Spare/></GrandFeeTotal><PsgrTypes><UniqueKey>0002</UniqueKey><PICReq>JNF</PICReq><QueryAmt>0</QueryAmt><QueryIATAFmt>N</QueryIATAFmt><QueryApolloFmt>Y</QueryApolloFmt><PercentQuery>N</PercentQuery><AmtQuery>N</AmtQuery><AgeQuery>N</AgeQuery><ReqReturnedPIC>Y</ReqReturnedPIC><QuoteOnlyPICReq>N</QuoteOnlyPICReq><HasDiscData>N</HasDiscData><RespPIC>JNF</RespPIC><RespAmt>0</RespAmt><RespIATAFmt>N</RespIATAFmt><RespATPCOFmt>N</RespATPCOFmt><PercentResp>N</PercentResp><AmtResp>N</AmtResp><AgeResp>N</AgeResp><PFCsApply>N</PFCsApply><NPFReq>N</NPFReq><Spare1>N</Spare1><PsgrNumAry><PsgrNum>2</PsgrNum></PsgrNumAry></PsgrTypes><BaggDispInfo><UniqueKey>2</UniqueKey><QuoteNum>2</QuoteNum><BaggType>A</BaggType><PsgrType>JNF</PsgrType><StartPt>LOS</StartPt><EndPt>ATL</EndPt><BaggAllwnceVal>1</BaggAllwnceVal><BaggAllwnceUnit>P</BaggAllwnceUnit><Vnd>DL</Vnd><Spare/><BaggTripStartSegNum>1</BaggTripStartSegNum><BaggTripEndSegNum>1</BaggTripEndSegNum><URL>VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/DL</URL></BaggDispInfo><BaggDispFQandFQBB><UniqueKey>2</UniqueKey><QuoteNum>2</QuoteNum><BaggNum>1</BaggNum><BaggFee><![CDATA[       0]]></BaggFee><Currency>NGN</Currency><WtDimension>UPTO22LB/10KG AND UPTO45LI/115LCM</WtDimension><BaggTripStartSegNum>1</BaggTripStartSegNum><BaggTripEndSegNum>1</BaggTripEndSegNum></BaggDispFQandFQBB><BaggDispFQandFQBB><UniqueKey>2</UniqueKey><QuoteNum>2</QuoteNum><BaggNum>2</BaggNum><BaggFee><![CDATA[   72382]]></BaggFee><Currency>NGN</Currency><WtDimension>UPTO50LB/23KG AND UPTO62LI/158LCM</WtDimension><BaggTripStartSegNum>1</BaggTripStartSegNum><BaggTripEndSegNum>1</BaggTripEndSegNum></BaggDispFQandFQBB><BaggDispInfo><UniqueKey>2</UniqueKey><QuoteNum>2</QuoteNum><BaggType>B</BaggType><PsgrType>JNF</PsgrType><StartPt>LOS</StartPt><EndPt>ATL</EndPt><BaggAllwnceVal>0</BaggAllwnceVal><BaggAllwnceUnit>P</BaggAllwnceUnit><Vnd>DL</Vnd><Spare/><BaggTripStartSegNum>1</BaggTripStartSegNum><BaggTripEndSegNum>1</BaggTripEndSegNum></BaggDispInfo><BaggDispInfo><UniqueKey>2</UniqueKey><QuoteNum>2</QuoteNum><BaggType>E</BaggType><PsgrType>JNF</PsgrType><StartPt>LOS</StartPt><EndPt>ATL</EndPt><BaggAllwnceVal>888</BaggAllwnceVal><BaggAllwnceUnit/><Vnd>DL</Vnd><Spare/><BaggTripStartSegNum>1</BaggTripStartSegNum><BaggTripEndSegNum>1</BaggTripEndSegNum><URL>VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/DL</URL></BaggDispInfo><ExtendedQuoteInformation><UniqueKey>2</UniqueKey><QuoteNum>2</QuoteNum><ETkInd>Y</ETkInd><PaperTkInd>N</PaperTkInd><PlatingInd>N</PlatingInd><NetFareInd>N</NetFareInd><TkFareInd>N</TkFareInd><LLPFQuoted>N</LLPFQuoted><CommUnresolved>N</CommUnresolved><DataRetQuote>N</DataRetQuote><FareIT>N</FareIT><BagInd>N</BagInd><TkDesignator>N</TkDesignator><FareBT>N</FareBT><FiledNetFare>N</FiledNetFare><NTypeComm>N</NTypeComm><Spare1>NN</Spare1><NetFareCrncy/><NetFareAmt>0</NetFareAmt><NetFareNumDecs>0</NetFareNumDecs><EquivNetFareCrcy/><EquivNetFareAmt>0</EquivNetFareAmt><EquivNumDecs>0</EquivNumDecs><TotNetCrcy/><TotNetAmt>0</TotNetAmt><TotNetNumDecs>0</TotNetNumDecs><TkFareCrcy/><TkFareAmt>0</TkFareAmt><TkNumDecs>0</TkNumDecs><EquivTkCrncy/><EquivTkAmt>0</EquivTkAmt><EquivTkNumDecs>0</EquivTkNumDecs><TotTkCrncy/><TotTkAmt>0</TotTkAmt><TotTkNumDecs>0</TotTkNumDecs><CrncyBaseFareTkPsgrCoupon/><TkPsgrCouponAmt>0</TkPsgrCouponAmt><TkPsgrCouponNumDecs>0</TkPsgrCouponNumDecs><EquivCrncyTkPsgrCoupon/><EquivAmtTkPsgrCoupon>0</EquivAmtTkPsgrCoupon><EquivNumDecsTkPsgrCoupon>0</EquivNumDecsTkPsgrCoupon><TotCrncyTkPsgrCoupon/><TotAmtTkPsgrCoupon>0</TotAmtTkPsgrCoupon><TotNumDecsTkPsgrCoupon>0</TotNumDecsTkPsgrCoupon><MethodType/><Type/><CARCode/><ValueCode/><TkPCC/><TkPCCIATANum/><SellingPCC/><SellingIATANum/><TkPCCTkAuthority>N</TkPCCTkAuthority><TkPCCSellAuthority>N</TkPCCSellAuthority><SellPCCTkAuthority>N</SellPCCTkAuthority><SellPCCSellAuthority>N</SellPCCSellAuthority><Spare2>NNNN</Spare2></ExtendedQuoteInformation><JrnyType><UniqueKey>0002</UniqueKey><QuoteNum>2</QuoteNum><NumJrnyItems>1</NumJrnyItems><CircTrip>N</CircTrip><RT>N</RT><OW>Y</OW><OpenJaw>N</OpenJaw><RndWorld>N</RndWorld><Spare1>NNN</Spare1><NumFareComponents>1</NumFareComponents><HIF>N</HIF><StopSurcharge>N</StopSurcharge><NotesApply>N</NotesApply><NoBankBuyRateHeld>N</NoBankBuyRateHeld><Spare2>NNNN</Spare2></JrnyType><CityIndInfo><UniqueKey>2</UniqueKey><QuoteNum>2</QuoteNum><FareNum>1</FareNum><CityIndAry><CityInd><Mandatory-NoStopover>N</Mandatory-NoStopover><MandatoryRtePt>N</MandatoryRtePt><CityWI1stLevelSideTrip>N</CityWI1stLevelSideTrip><CityWI2ndLevelSideTrip>N</CityWI2ndLevelSideTrip><AllowOpenJawBreak>N</AllowOpenJawBreak><SurfaceSectorInc>N</SurfaceSectorInc><SurfaceSectorExc>N</SurfaceSectorExc><SysGenFictitiousPt>N</SysGenFictitiousPt><NegMileExcMPMReductionPt>N</NegMileExcMPMReductionPt><RIOSAOMileCity>N</RIOSAOMileCity><UnspecExtraMileAllow>N</UnspecExtraMileAllow><SouthAtlanticMileCity>N</SouthAtlanticMileCity><ClassDifferential>N</ClassDifferential><IguassuFallsMileCity>N</IguassuFallsMileCity><Spare1>NN</Spare1></CityInd><CityInd><Mandatory-NoStopover>N</Mandatory-NoStopover><MandatoryRtePt>N</MandatoryRtePt><CityWI1stLevelSideTrip>N</CityWI1stLevelSideTrip><CityWI2ndLevelSideTrip>N</CityWI2ndLevelSideTrip><AllowOpenJawBreak>N</AllowOpenJawBreak><SurfaceSectorInc>N</SurfaceSectorInc><SurfaceSectorExc>N</SurfaceSectorExc><SysGenFictitiousPt>N</SysGenFictitiousPt><NegMileExcMPMReductionPt>N</NegMileExcMPMReductionPt><RIOSAOMileCity>N</RIOSAOMileCity><UnspecExtraMileAllow>N</UnspecExtraMileAllow><SouthAtlanticMileCity>N</SouthAtlanticMileCity><ClassDifferential>N</ClassDifferential><IguassuFallsMileCity>N</IguassuFallsMileCity><Spare1>NN</Spare1></CityInd></CityIndAry></CityIndInfo><InfoMsg><UniqueKey>0002</UniqueKey><QuoteNum>2</QuoteNum><MsgNum>6</MsgNum><AppNum>0</AppNum><MsgType>1</MsgType><Lang>0</Lang><Text>NONREF/PENALTY APPLIES</Text></InfoMsg><InfoMsg><UniqueKey>0002</UniqueKey><QuoteNum>2</QuoteNum><MsgNum>0</MsgNum><AppNum>0</AppNum><MsgType>6</MsgType><Lang>0</Lang><Text>01 NVB29DEC/NVA29DEC</Text></InfoMsg><InfoMsg><UniqueKey>0002</UniqueKey><QuoteNum>2</QuoteNum><MsgNum>1182</MsgNum><AppNum>0</AppNum><MsgType>2</MsgType><Lang>0</Lang><Text>TICKETING WITHIN 72 HOURS AFTER RESERVATION</Text></InfoMsg><InfoMsg><UniqueKey>0002</UniqueKey><QuoteNum>2</QuoteNum><MsgNum>1006</MsgNum><AppNum>0</AppNum><MsgType>2</MsgType><Lang>0</Lang><Text>LAST DATE TO PURCHASE TICKET: 26SEP19 / 0601 SFO</Text></InfoMsg><InfoMsg><UniqueKey>0002</UniqueKey><QuoteNum>2</QuoteNum><MsgNum>1170</MsgNum><AppNum>0</AppNum><MsgType>2</MsgType><Lang>0</Lang><Text>TICKETING AGENCY 2F3K</Text></InfoMsg><InfoMsg><UniqueKey>0002</UniqueKey><QuoteNum>2</QuoteNum><MsgNum>1171</MsgNum><AppNum>0</AppNum><MsgType>2</MsgType><Lang>0</Lang><Text>DEFAULT PLATING CARRIER DL</Text></InfoMsg><InfoMsg><UniqueKey>0002</UniqueKey><QuoteNum>2</QuoteNum><MsgNum>1026</MsgNum><AppNum>0</AppNum><MsgType>2</MsgType><Lang>0</Lang><Text>E-TKT REQUIRED</Text></InfoMsg><RsvnRules><UniqueKey>0</UniqueKey><Spare1>NNN</Spare1><HoursMin>N</HoursMin><DaysMin>N</DaysMin><MonthsMin>N</MonthsMin><OccurIndMin>N</OccurIndMin><SameDayMin>N</SameDayMin><Spare2>NNNNNNNN</Spare2><TmDOWMin>0</TmDOWMin><NumOccurMin>0</NumOccurMin><FareComponent>1</FareComponent><Spare3/><Spare4>NNN</Spare4><HoursMax>N</HoursMax><DaysMax>N</DaysMax><MonthsMax>N</MonthsMax><OccurIndMax>N</OccurIndMax><SameDayMax>N</SameDayMax><StartIndMax>N</StartIndMax><CompletionInd>N</CompletionInd><Spare5>NNNNNN</Spare5><TmDOWMax>0</TmDOWMax><NumOccurMax>0</NumOccurMax><Spare6/><Spare7>NNN</Spare7><NoRsvn>N</NoRsvn><AdvRsvnOnlyIfTk>N</AdvRsvnOnlyIfTk><AdvRsvnAnyTm>Y</AdvRsvnAnyTm><AdvRsvnHrs>N</AdvRsvnHrs><AdvRsvnDays>N</AdvRsvnDays><AdvRsvnMonths>N</AdvRsvnMonths><AdvRsvnEarliestTm>N</AdvRsvnEarliestTm><AdvRsvnLatestTm>N</AdvRsvnLatestTm><AdvRsvnWaived>N</AdvRsvnWaived><AdvRsvnDataExists>N</AdvRsvnDataExists><AdvRsvnEndItem>N</AdvRsvnEndItem><Spare8>NN</Spare8><Spare9>NNN</Spare9><AdvTkEarliestTm>Y</AdvTkEarliestTm><AdvTkLatestTm>N</AdvTkLatestTm><AdvTkRsvnHrs>Y</AdvTkRsvnHrs><AdvTkRsvnDays>N</AdvTkRsvnDays><AdvTkRsvnMonths>N</AdvTkRsvnMonths><AdvTkStartHrs>N</AdvTkStartHrs><AdvTkStartDays>Y</AdvTkStartDays><AdvTkStartMonths>N</AdvTkStartMonths><AdvTkWaived>N</AdvTkWaived><AdvTkAnyTm>N</AdvTkAnyTm><AdvTkEndItem>N</AdvTkEndItem><Spare10>NN</Spare10><AdvRsvnTm>0</AdvRsvnTm><AdvTkRsvnTm>72</AdvTkRsvnTm><AdvTkStartTm>10</AdvTkStartTm><Spare11/><Spare12>NNNN</Spare12><EarliestRsvnDtPresent>N</EarliestRsvnDtPresent><EarliestTkDtPresent>N</EarliestTkDtPresent><LatestRsvnDtPresent>N</LatestRsvnDtPresent><LatestTkDtPresent>N</LatestTkDtPresent><Spare13>NNNNNNNN</Spare13><EarliestRsvnDt/><EarliestTkDt/><LatestRsvnDt/><LatestTkDt/><Spare14/><PenFeeAry><PenFee><DepRequired>N</DepRequired><DepNonRef>N</DepNonRef><TkNonRef>Y</TkNonRef><AirVFee>N</AirVFee><Cancellation>Y</Cancellation><FailConfirmSpace>Y</FailConfirmSpace><ItinChg>N</ItinChg><ReplaceTk>N</ReplaceTk><Applicable>Y</Applicable><ApplicableTo>Y</ApplicableTo><AnytimePenalty>Y</AnytimePenalty><BeforeDeparturePenalty>N</BeforeDeparturePenalty><AfterDeparturePenalty>N</AfterDeparturePenalty><Spare15>NNN</Spare15><Amt>100</Amt><Type>P</Type><Currency/><Spare16>NNNNNNNN</Spare16><Spare17/></PenFee><PenFee><DepRequired>N</DepRequired><DepNonRef>N</DepNonRef><TkNonRef>N</TkNonRef><AirVFee>N</AirVFee><Cancellation>N</Cancellation><FailConfirmSpace>N</FailConfirmSpace><ItinChg>Y</ItinChg><ReplaceTk>N</ReplaceTk><Applicable>Y</Applicable><ApplicableTo>Y</ApplicableTo><AnytimePenalty>Y</AnytimePenalty><BeforeDeparturePenalty>N</BeforeDeparturePenalty><AfterDeparturePenalty>N</AfterDeparturePenalty><Spare15>NNN</Spare15><Amt>180.00</Amt><Type>D</Type><Currency>USD</Currency><Spare16>NNNNNNNN</Spare16><Spare17/></PenFee></PenFeeAry><Cat0>N</Cat0><Cat1>N</Cat1><Cat2>Y</Cat2><Cat3>Y</Cat3><Cat4>Y</Cat4><Cat5>Y</Cat5><Cat6>N</Cat6><Cat7>N</Cat7><Cat8>Y</Cat8><Cat9>Y</Cat9><Cat10>Y</Cat10><Cat11>N</Cat11><Cat12>N</Cat12><Cat13>N</Cat13><Cat14>N</Cat14><Cat15>Y</Cat15><Cat16>Y</Cat16><Cat17>N</Cat17><Cat18>Y</Cat18><Cat19>N</Cat19><Cat20>N</Cat20><Cat21>N</Cat21><Cat22>N</Cat22><Cat23>N</Cat23><Cat24>N</Cat24><Cat25>N</Cat25><Cat26>N</Cat26><Cat27>N</Cat27><Cat28>N</Cat28><Cat29>N</Cat29><Cat30>N</Cat30><Cat31>N</Cat31><RestrictiveDt>20190926</RestrictiveDt><SurchargeAmt>0</SurchargeAmt><NotUSACity>Y</NotUSACity><Spare18>NNNNNNN</Spare18><MissingRules>N</MissingRules><Spare19>NNNNNNN</Spare19><Spare20/></RsvnRules><FareConstruction><UniqueKey>0002</UniqueKey><QuoteNum>2</QuoteNum><FareConstructText>LOS DL ATL 115.20KL10J9M3/IN90 NUC115.20END ROE1.0</FareConstructText></FareConstruction><SellStructFareConstruct><UniqueKey>2</UniqueKey><QuoteNum>2</QuoteNum><FareConstruction>1ALOS,1BDL,1AATL,4A115.20,1CKL10J9M3,1D/IN90,3E0101,1ENUC,4F115.20,1FEND,1GROE1.0</FareConstruction></SellStructFareConstruct><SellFareConstruct><UniqueKey>2</UniqueKey><QuoteNum>2</QuoteNum><FareConstruction>LOS DL ATL 115.20 NUC115.20END ROE1.0</FareConstruction></SellFareConstruct><PrevBICSegMapping><UniqueKey>0000</UniqueKey><BICInfoAry><BICInfo><BIC>K</BIC><AppliesToSeg1>Y</AppliesToSeg1><AppliesToSeg2>N</AppliesToSeg2><AppliesToSeg3>N</AppliesToSeg3><AppliesToSeg4>N</AppliesToSeg4><AppliesToSeg5>N</AppliesToSeg5><AppliesToSeg6>N</AppliesToSeg6><AppliesToSeg7>N</AppliesToSeg7><AppliesToSeg8>N</AppliesToSeg8><AppliesToSeg9>N</AppliesToSeg9><AppliesToSeg10>N</AppliesToSeg10><AppliesToSeg11>N</AppliesToSeg11><AppliesToSeg12>N</AppliesToSeg12><AppliesToSeg13>N</AppliesToSeg13><AppliesToSeg14>N</AppliesToSeg14><AppliesToSeg15>N</AppliesToSeg15><AppliesToSeg16>N</AppliesToSeg16></BICInfo></BICInfoAry></PrevBICSegMapping><FilingStatus><UniqueKey>0000</UniqueKey><PsgrMismatchInd>N</PsgrMismatchInd><NeedPlatingCarrierInd>N</NeedPlatingCarrierInd><NoNamesInd>N</NoNamesInd><OpenSegInd>N</OpenSegInd><TkDtInd>N</TkDtInd><ClassOverrideInd>N</ClassOverrideInd><RetTripInd>N</RetTripInd><NeedRebookInd>N</NeedRebookInd><DecMismatchInd>N</DecMismatchInd><CurrencyMismatchInd>N</CurrencyMismatchInd><AmendedItinInd>N</AmendedItinInd><PseudoItinInd>N</PseudoItinInd><TooManyTaxesInd>N</TooManyTaxesInd><BaseFareTooBigInd>N</BaseFareTooBigInd><BookingDtInd>N</BookingDtInd><PFMismatchInd>N</PFMismatchInd><NotFullGuarInd>N</NotFullGuarInd><FareFiledOKInd>Y</FareFiledOKInd><DocProdErrTextInd>N</DocProdErrTextInd><MarriageLogicErr>N</MarriageLogicErr><TkModifierErr>N</TkModifierErr><MultiplePTCErr>N</MultiplePTCErr><Spare1>NN</Spare1><Spare2>NNNNNNNN</Spare2></FilingStatus></FareInfo></PNRBFManagement_51></SubmitXmlOnSessionResult></SubmitXmlOnSessionResponse></soapenv:Body></soapenv:Envelope>"
				].join("\n")
			},
			{
				"cmd": "*LF",
				"rq": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"\t<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://webservices.galileo.com\"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>*LF</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>"
				].join("\n"),
				"rs": [
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">",
					" <soapenv:Body><SubmitTerminalTransactionResponse xmlns=\"http://webservices.galileo.com\"><SubmitTerminalTransactionResult USM=\"false\">&gt;*LF",
					"1/ATFQ",
					"$B-1 C23SEP19",
					"LOS DL ATL Q5.33 1152.00KL10J9M3 NUC1157.33END ROE1.0",
					"FARE USD 1157.00 TAX 18.60US TAX 3.96XA TAX 7.00XY TAX 5.77YC",
					"TAX 70.10NG TAX 50.00QT TAX 20.00TE TAX 245.50YR TOT USD",
					"1577.93",
					"$B-2 C23SEP19",
					"LOS DL ATL 115.20KL10J9M3/IN90 NUC115.20END ROE1.0",
					"FARE USD 115.00 TAX 18.60US TAX 3.96XA TAX 7.00XY TAX 5.77YC",
					"TAX 5.80NG TOT USD 156.13",
					"&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>",
					"</soapenv:Envelope>"
				].join("\n")
			},
		],
	});

	return testCases.map(c => [c]);
};

class RunCmdRqXmlTest extends require('../../../../Lib/TestCase.js') {
	async test_call(testCase) {
		// Sets stable start date, dates are created in multiple locations deep
		// in execution stack
		const clock = sinon.useFakeTimers({
			now: 1565568000000, //12th of August 2019
			shouldAdvanceTime: true,
		});

		const dateOriginal = Date.now;

		sinon.stub(Date, 'now')
			.callsFake(() => {
				// this is for jsdom, jsdom has loop where it waits for time
				// to advance calling Date.now
				clock.tick(1);
				return dateOriginal.call(Date);
			});

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
				gdsClients,
				Pccs: {
					findByCode: (gds, pcc) => Promise.resolve()
						.then(() => Pccs.findByCodeParams(gds, pcc))
						.then(params => SqlUtil.selectFromArray(params, stubPccs)[0])
						.then(nonEmpty('No stubbed PCC matching ' + gds + ':' + pcc))
						.then(Pccs.normalizeFromDb),
				},
				PtcUtil: PtcUtil.makeCustom({
					PtcFareFamilies: {
						getAll: () => Promise.resolve(stubPtcFareFamilies),
						getByAdultPtc: (adultPtc) => PtcFareFamilies
							.getByAdultPtcFrom(adultPtc, stubPtcFareFamilies),
					},
				}),
			});
			return actual;
		};

		try {
			await GdsActionTestUtil.testHttpGdsAction({unit, testCase, getActual});
		} finally {
			sinon.restore();
		}

	}

	getTestMapping() {
		return [
			[provide_call, this.test_call],
		];
	}
}

module.exports = RunCmdRqXmlTest;
