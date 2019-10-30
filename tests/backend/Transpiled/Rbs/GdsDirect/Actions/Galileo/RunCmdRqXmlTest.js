const GdsActionTestUtil = require('../../../../../../../backend/Utils/Testing/GdsActionTestUtil.js');
const GdsSessions = require('../../../../../../../backend/Repositories/GdsSessions.js');

const GdsDirectDefaults = require('../../../../Rbs/TestUtils/GdsDirectDefaults.js');
const RunCmdRq = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Galileo/RunCmdRq.js');

const php = require('../../../../php.js');

class RunCmdRqXmlTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js') {
	provideTestCases() {
		const list = [];

		list.push({
			startDt: '2019-08-19 00:00:00',
			'title': 'itinerary dump pasted as command example - should rebuild it',
			'input': {
				'cmdRq': [
					' 1. DL 4400 V  19AUG MANLAS HS1   120P   405P O        E MO',
					'         OPERATED BY VIRGIN ATLANTIC',
					' 2. DL  951 V  20AUG LASLAX HS1   559P   720P O        E TU',
					' 3. DL 4357 T  25AUG LAXMAN HS1   605P #1230P O        E SU',
					'       OPERATED BY VIRGIN ATLANTIC',
				].join('\n'),
				'baseDate': '2019-05-20',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [
					{
						cmd: '*R',
						output: [
							' 1. DL 4400 V  22JUN MANLAS HS1   915A  1200N O        E SA  1',
							'         OPERATED BY VIRGIN ATLANTIC',
							' 2. DL  951 V  22JUN LASLAX HS1   456P   613P O        E SA  1',
							' 3. DL 4357 T  05JUL LAXMAN HS1   605P #1230P O        E FR',
							'         OPERATED BY VIRGIN ATLANTIC',
							'><',
						].join('\n'),
					},
				],
				sessionData: {
					hasPnr: true,
				},
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultGalileoState(),
				'initialCommands': [],
				'performedCommands': [
					{
						'cmd': '@1.2/V',
						'output': [
							' 1. DL 4400 V  22JUN MANLAS HS1   915A  1200N O       E      1  OPERATED BY VIRGIN ATLANTIC                                     DEPARTS MAN TERMINAL 2  - ARRIVES LAS TERMINAL 3                NOT VALID FOR INTERLINE CONNECTIONS                             **DL CODE SHARE-QUOTE OPERATED BY VIRGIN ATLAN AS VS FLT 85  *',
							'*LOCAL AND ONLINE CONNECTING TRAFFIC ONLY*',
							' 2. DL  951 V  22JUN LASLAX HS1   456P   613P O       E      1  DEPARTS LAS TERMINAL 1  - ARRIVES LAX TERMINAL 2                ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS  ',
							'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
							'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
							'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
							'><',
						].join('\n'),
					},
					{
						'cmd': '@3/T',
						'output': [
							' 3. DL 4357 T  05JUL LAXMAN HS1   605P #1230P O       E         OPERATED BY VIRGIN ATLANTIC                                     DEPARTS LAX TERMINAL 2  - ARRIVES MAN TERMINAL 2                NOT VALID FOR INTERLINE CONNECTIONS                             **DL CODE SHARE-QUOTE OPERATED BY VIRGIN ATLAN AS VS FLT 182 *',
							'*LOCAL AND ONLINE CONNECTING TRAFFIC ONLY*',
							'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS  ',
							'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
							'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
							'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
							'><',
						].join('\n'),
					},
					{
						'cmd': '*R',
						'output': [
							' 1. DL 4400 V  22JUN MANLAS HS1   915A  1200N O        E SA  1',
							'         OPERATED BY VIRGIN ATLANTIC',
							' 2. DL  951 V  22JUN LASLAX HS1   456P   613P O        E SA  1',
							' 3. DL 4357 T  05JUL LAXMAN HS1   605P #1230P O        E FR',
							'         OPERATED BY VIRGIN ATLANTIC',
							'><',
						].join('\n'),
					},
				],
			},
			httpRequests: [{
				rq: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'		<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com">',
					'			<SOAP-ENV:Body>',
					'				<ns1:SubmitXmlOnSession>',
					'					<ns1:Token>soap-unit-test-blabla-123</ns1:Token>',
					'					<ns1:Request>',
					'						<PNRBFManagement_51>',
					'							<SessionMods><AreaInfoReq/></SessionMods><AirSegSellMods><AirSegSell><Vnd>DL</Vnd><FltNum>4400</FltNum><Class>Y</Class><StartDt>20190819</StartDt><StartAirp>MAN</StartAirp><EndAirp>LAS</EndAirp><Status>AK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>DL</Vnd><FltNum>0951</FltNum><Class>Y</Class><StartDt>20190820</StartDt><StartAirp>LAS</StartAirp><EndAirp>LAX</EndAirp><Status>AK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>DL</Vnd><FltNum>4357</FltNum><Class>Y</Class><StartDt>20190825</StartDt><StartAirp>LAX</StartAirp><EndAirp>MAN</EndAirp><Status>AK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell></AirSegSellMods><PNRBFRetrieveMods><CurrentPNR/></PNRBFRetrieveMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>1</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>2</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>3</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>4</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>5</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>6</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>7</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>8</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods>',
					'						</PNRBFManagement_51>',
					'					</ns1:Request>',
					'					<ns1:Filter>',
					'						<_/>',
					'					</ns1:Filter>',
					'				</ns1:SubmitXmlOnSession>',
					'			</SOAP-ENV:Body>',
					'		</SOAP-ENV:Envelope>',
				].join('\n'),
				rs: '<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soapenv:Body><SubmitXmlOnSessionResponse xmlns="http://webservices.galileo.com"><SubmitXmlOnSessionResult><PNRBFManagement_51 xmlns=""><SessionInfo><AreaInfoResp><Sys>1G</Sys><Processor>A</Processor><GrpModeActivatedInd>N</GrpModeActivatedInd><AAAAreaAry><AAAAreaInfo><AAAArea>A</AAAArea><ActiveInd>Y</ActiveInd><AAACity>QSB</AAACity><AAADept>IV</AAADept><SONCity>QSB</SONCity><SONDept>IV</SONDept><AgntID>ZVTL9W</AgntID><ChkDigit/><AgntInitials>WS</AgntInitials><Duty>AG</Duty><AgncyPCC>711M</AgncyPCC><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd/><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>B</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>IV</AAADept><SONCity>QSB</SONCity><SONDept>IV</SONDept><AgntID>ZVTL9W</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd/><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>C</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>IV</AAADept><SONCity>QSB</SONCity><SONDept>IV</SONDept><AgntID>ZVTL9W</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd/><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>D</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>IV</AAADept><SONCity>QSB</SONCity><SONDept>IV</SONDept><AgntID>ZVTL9W</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd/><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>E</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>IV</AAADept><SONCity>QSB</SONCity><SONDept>IV</SONDept><AgntID>ZVTL9W</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd/><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo></AAAAreaAry></AreaInfoResp></SessionInfo><AirSegSell><AirSell><DisplaySequenceNumber>00</DisplaySequenceNumber><Vnd>DL</Vnd><FltNum>4400</FltNum><OpSuf/><Class>Y</Class><StartDt>20190819</StartDt><DtChg>0</DtChg><StartAirp>MAN</StartAirp><EndAirp>LAS</EndAirp><StartTm>1320</StartTm><EndTm>1605</EndTm><Status>AK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd>N</FareQuoteTkIgnInd><StopoverInd>N</StopoverInd><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt>OPERATED BY VIRGIN ATLANTIC</Txt></TextMsg><TextMsg><Txt><![CDATA[DEPARTS MAN TERMINAL 2  - ARRIVES LAS TERMINAL 3]]></Txt></TextMsg><TextMsg><Txt>NOT VALID FOR INTERLINE CONNECTIONS</Txt></TextMsg><AirSell><DisplaySequenceNumber>00</DisplaySequenceNumber><Vnd>DL</Vnd><FltNum>951</FltNum><OpSuf/><Class>Y</Class><StartDt>20190820</StartDt><DtChg>0</DtChg><StartAirp>LAS</StartAirp><EndAirp>LAX</EndAirp><StartTm>1759</StartTm><EndTm>1920</EndTm><Status>AK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd>N</FareQuoteTkIgnInd><StopoverInd>N</StopoverInd><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt><![CDATA[DEPARTS LAS TERMINAL 1  - ARRIVES LAX TERMINAL 2]]></Txt></TextMsg><AirSell><DisplaySequenceNumber>00</DisplaySequenceNumber><Vnd>DL</Vnd><FltNum>4357</FltNum><OpSuf/><Class>Y</Class><StartDt>20190825</StartDt><DtChg>1</DtChg><StartAirp>LAX</StartAirp><EndAirp>MAN</EndAirp><StartTm>1805</StartTm><EndTm>1230</EndTm><Status>AK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd>N</FareQuoteTkIgnInd><StopoverInd>N</StopoverInd><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt>OPERATED BY VIRGIN ATLANTIC</Txt></TextMsg><TextMsg><Txt><![CDATA[DEPARTS LAX TERMINAL 2  - ARRIVES MAN TERMINAL 2]]></Txt></TextMsg><TextMsg><Txt>NOT VALID FOR INTERLINE CONNECTIONS</Txt></TextMsg></AirSegSell><PNRBFRetrieve><Control><KLRCnt>6</KLRCnt><KlrAry><Klr><ID>IT01</ID><NumOccur>3</NumOccur></Klr><Klr><ID>IT02</ID><NumOccur>2</NumOccur></Klr><Klr><ID>BP08</ID><NumOccur>1</NumOccur></Klr></KlrAry></Control><AirSeg><SegNum>1</SegNum><Status>AK</Status><Dt>20190819</Dt><DayChg>00</DayChg><AirV>DL</AirV><NumPsgrs>1</NumPsgrs><StartAirp>MAN</StartAirp><EndAirp>LAS</EndAirp><StartTm>1320</StartTm><EndTm>1605</EndTm><BIC>Y</BIC><FltNum>4400</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd/><PrevStatusCode>AK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd>N</OpAirVInd></AirSeg><AirSegOpAirV><OpAirVInfoAry><OpAirVInfo><StartAirp/><EndAirp/><AirV>VS</AirV><AirVName>VIRGIN ATLANTIC</AirVName></OpAirVInfo></OpAirVInfoAry></AirSegOpAirV><AirSeg><SegNum>2</SegNum><Status>AK</Status><Dt>20190820</Dt><DayChg>00</DayChg><AirV>DL</AirV><NumPsgrs>1</NumPsgrs><StartAirp>LAS</StartAirp><EndAirp>LAX</EndAirp><StartTm>1759</StartTm><EndTm>1920</EndTm><BIC>Y</BIC><FltNum>951</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd/><PrevStatusCode>AK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg><AirSeg><SegNum>3</SegNum><Status>AK</Status><Dt>20190825</Dt><DayChg>01</DayChg><AirV>DL</AirV><NumPsgrs>1</NumPsgrs><StartAirp>LAX</StartAirp><EndAirp>MAN</EndAirp><StartTm>1805</StartTm><EndTm>1230</EndTm><BIC>Y</BIC><FltNum>4357</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd/><PrevStatusCode>AK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd>N</OpAirVInd></AirSeg><AirSegOpAirV><OpAirVInfoAry><OpAirVInfo><StartAirp/><EndAirp/><AirV>VS</AirV><AirVName>VIRGIN ATLANTIC</AirVName></OpAirVInfo></OpAirVInfoAry></AirSegOpAirV><GenPNRInfo><FileAddr/><CodeCheck/><RecLoc/><Ver>0</Ver><OwningCRS>1G</OwningCRS><OwningAgncyName>INTERNATIONAL TRAVEL NET</OwningAgncyName><OwningAgncyPCC>711M</OwningAgncyPCC><CreationDt/><CreatingAgntSignOn/><CreatingAgntDuty/><CreatingAgncyIATANum/><OrigBkLocn/><SATONum/><PTAInd>N</PTAInd><InUseInd/><SimultaneousUpdInd/><BorrowedInd>N</BorrowedInd><GlobInd>N</GlobInd><ReadOnlyInd>N</ReadOnlyInd><FareDataExistsInd>N</FareDataExistsInd><PastDtQuickInd>N</PastDtQuickInd><CurAgncyPCC>711M</CurAgncyPCC><QInd>N</QInd><TkNumExistInd>N</TkNumExistInd><IMUdataexists>N</IMUdataexists><ETkDataExistInd>Y</ETkDataExistInd><CurDtStamp>20190814</CurDtStamp><CurTmStamp>132350</CurTmStamp><CurAgntSONID>VTL9WS</CurAgntSONID><TravInsuranceInd/><PNRBFTicketedInd>N</PNRBFTicketedInd><ZeppelinAgncyInd>N</ZeppelinAgncyInd><AgncyAutoServiceInd>N</AgncyAutoServiceInd><AgncyAutoNotifyInd>N</AgncyAutoNotifyInd><ZeppelinPNRInd>N</ZeppelinPNRInd><PNRAutoServiceInd>N</PNRAutoServiceInd><PNRNotifyInd>N</PNRNotifyInd><SuperPNRInd>N</SuperPNRInd><PNRBFPurgeDt>NO PURGE</PNRBFPurgeDt><PNRBFChangeInd>Y</PNRBFChangeInd><MCODataExists>N</MCODataExists><OrigRcvdField/><IntContExists>N</IntContExists><AllDataAllTime>N</AllDataAllTime><LastActAgntID/><TransPCCName>INTERNATIONAL TRAVEL NET</TransPCCName><URrecordLoc/><UROSindLoc>N</UROSindLoc><URRCBInd>N</URRCBInd><GMTPNRBFCreationDt/><PricingRecordExist>N</PricingRecordExist><ArchivedFeeDataExists/><LeisureshopperDataExists>N</LeisureshopperDataExists><SeatDataExists>N</SeatDataExists><FrequentFlyerDataExists/><NetTicketDataExists>N</NetTicketDataExists><TinsRemarksExist>N</TinsRemarksExist><ElectronicDataExists>N</ElectronicDataExists><AdditionalItineraryDataExists>N</AdditionalItineraryDataExists><GroupAllocationFileExists>N</GroupAllocationFileExists><ProfileAssociationsExist/><VendorLocatorDataExists>N</VendorLocatorDataExists><BookingCodeDataExists/><ArneDataExists/><TimaticDataExists/><LinearFareDataExists/><ItineraryRemarksExist>N</ItineraryRemarksExist><IdentificationFieldExists>N</IdentificationFieldExists><EmailAddressExists/><RuleDataExists/><LSVendorConfirmationExists>N</LSVendorConfirmationExists><AdditionalSrvcs/><ElectronicMiscDocumentList>N</ElectronicMiscDocumentList><TDSProfileExists>N</TDSProfileExists><ServiceInformationExists>N</ServiceInformationExists><FiledFareDataExists>N</FiledFareDataExists><VendorRemarksDataExists>N</VendorRemarksDataExists><MembershipDataExists>N</MembershipDataExists><DividedBookingsExist>N</DividedBookingsExist><ClientFileReferencesExist>N</ClientFileReferencesExist><CustomCheckRulesExist>N</CustomCheckRulesExist><PassengerInformationExists>N</PassengerInformationExists><GUID/><ARCNewPNR>Y</ARCNewPNR><ARCFares>N</ARCFares><ARCTicketed>N</ARCTicketed><ARCSplitDivide>N</ARCSplitDivide><ARCNameAdd>N</ARCNameAdd><ARCNameDelete>N</ARCNameDelete><ARCItinAdd>Y</ARCItinAdd><ARCItinDEL>N</ARCItinDEL><ARCPhoneAdd>N</ARCPhoneAdd><ARCPhoneDel>N</ARCPhoneDel><ARCFOPAdd>N</ARCFOPAdd><ARCFOPDelete>N</ARCFOPDelete><ARCSSRAdd>N</ARCSSRAdd><ARCSSRDel>N</ARCSSRDel><ARCOSIAdd>N</ARCOSIAdd><ARCOSIDel>N</ARCOSIDel><ReasonCodesspares/></GenPNRInfo></PNRBFRetrieve></PNRBFManagement_51></SubmitXmlOnSessionResult></SubmitXmlOnSessionResponse></soapenv:Body></soapenv:Envelope>',
			}],
		});

		list.push({
			'title': 'Adding more flights to session that has already things in it',
			'input': {
				'cmdRq': [
					' 1 TK   85C  24MAY MNLIST SS1   930P  505A+*      1          E',
					' 2 TK 1757C  25MAY ISTRIX SS1   820A 1120A *      1          E',
				].join('\n'),
				'baseDate': '2019-05-20',
			},
			'output': {
				'status': 'executed',
				'calledCommands': [{
					cmd: '*R',
					output: [
						' 1. PR  127 C  20MAY JFKMNL HS1   145A # 615A O        E WE',
						' 2. AY 1072 Y  28MAY RIXHEL HS1  1015A  1125A O        E TH',
						'         OPERATED BY NORDIC REGIONAL AIRLINE',
						' 3. TK   85 Y  24MAY MNLIST AK1   930P # 505A            SU',
						' 4. TK 1757 Y  25MAY ISTRIX AK1   820A  1120A            MO',
						'><',
					].join('\n')},
				],
				sessionData: {
					hasPnr: true,
				},
			},
			'sessionInfo': {
				'initialState': GdsDirectDefaults.makeDefaultGalileoState(),
				'initialCommands': [{
					cmd: '*R',
					output: [
						' 1. PR  127 C  20MAY JFKMNL HS1   145A # 615A O        E WE',
						' 2. AY 1072 Y  28MAY RIXHEL HS1  1015A  1125A O        E TH',
						'         OPERATED BY NORDIC REGIONAL AIRLINE',
						'><',
					].join('\n'),
				}],
				'performedCommands': [
					{
						'cmd': '@3.4/C',
						'output': [
							' 1. DL 4400 V  22JUN MANLAS HS1   915A  1200N O       E      1  OPERATED BY VIRGIN ATLANTIC                                     DEPARTS MAN TERMINAL 2  - ARRIVES LAS TERMINAL 3                NOT VALID FOR INTERLINE CONNECTIONS                             **DL CODE SHARE-QUOTE OPERATED BY VIRGIN ATLAN AS VS FLT 85  *',
							'*LOCAL AND ONLINE CONNECTING TRAFFIC ONLY*',
							' 2. DL  951 V  22JUN LASLAX HS1   456P   613P O       E      1  DEPARTS LAS TERMINAL 1  - ARRIVES LAX TERMINAL 2                ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS  ',
							'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
							'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
							'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
							'><',
						].join('\n'),
					},
					{
						'cmd': '*R',
						'output': [
							' 1. PR  127 C  20MAY JFKMNL HS1   145A # 615A O        E WE',
							' 2. AY 1072 Y  28MAY RIXHEL HS1  1015A  1125A O        E TH',
							'         OPERATED BY NORDIC REGIONAL AIRLINE',
							' 3. TK   85 Y  24MAY MNLIST AK1   930P # 505A            SU',
							' 4. TK 1757 Y  25MAY ISTRIX AK1   820A  1120A            MO',
							'><',
						].join('\n'),
					},
				],
			},
			httpRequests: [{
				rq: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'		<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com">',
					'			<SOAP-ENV:Body>',
					'				<ns1:SubmitXmlOnSession>',
					'					<ns1:Token>soap-unit-test-blabla-123</ns1:Token>',
					'					<ns1:Request>',
					'						<PNRBFManagement_51>',
					'							<SessionMods><AreaInfoReq/></SessionMods><AirSegSellMods><AirSegSell><Vnd>TK</Vnd><FltNum>0085</FltNum><Class>Y</Class><StartDt>20200524</StartDt><StartAirp>MNL</StartAirp><EndAirp>IST</EndAirp><Status>AK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell><AirSegSell><Vnd>TK</Vnd><FltNum>1757</FltNum><Class>Y</Class><StartDt>20200525</StartDt><StartAirp>IST</StartAirp><EndAirp>RIX</EndAirp><Status>AK</Status><NumPsgrs>1</NumPsgrs><StartTm/><EndTm/><DtChg/><AvailDispType>G</AvailDispType></AirSegSell></AirSegSellMods><PNRBFRetrieveMods><CurrentPNR/></PNRBFRetrieveMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>1</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>2</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>3</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>4</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>5</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>6</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>7</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>8</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods>',
					'						</PNRBFManagement_51>',
					'					</ns1:Request>',
					'					<ns1:Filter>',
					'						<_/>',
					'					</ns1:Filter>',
					'				</ns1:SubmitXmlOnSession>',
					'			</SOAP-ENV:Body>',
					'		</SOAP-ENV:Envelope>',
				].join('\n'),
				rs: '<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soapenv:Body><SubmitXmlOnSessionResponse xmlns="http://webservices.galileo.com"><SubmitXmlOnSessionResult><PNRBFManagement_51 xmlns=""><SessionInfo><AreaInfoResp><Sys>1G</Sys><Processor>A</Processor><GrpModeActivatedInd>N</GrpModeActivatedInd><AAAAreaAry><AAAAreaInfo><AAAArea>A</AAAArea><ActiveInd>Y</ActiveInd><AAACity>QSB</AAACity><AAADept>IV</AAADept><SONCity>QSB</SONCity><SONDept>IV</SONDept><AgntID>ZVTL9W</AgntID><ChkDigit/><AgntInitials>WS</AgntInitials><Duty>AG</Duty><AgncyPCC>711M</AgncyPCC><DomMode/><IntlMode/><PNRDataInd>Y</PNRDataInd><PNRName>NO NAMES</PNRName><GrpModeActiveInd/><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>B</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>IV</AAADept><SONCity>QSB</SONCity><SONDept>IV</SONDept><AgntID>ZVTL9W</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd/><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>C</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>IV</AAADept><SONCity>QSB</SONCity><SONDept>IV</SONDept><AgntID>ZVTL9W</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd/><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>D</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>IV</AAADept><SONCity>QSB</SONCity><SONDept>IV</SONDept><AgntID>ZVTL9W</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd/><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>E</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>IV</AAADept><SONCity>QSB</SONCity><SONDept>IV</SONDept><AgntID>ZVTL9W</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd/><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo></AAAAreaAry></AreaInfoResp></SessionInfo><AirSegSell><AirSell><DisplaySequenceNumber>00</DisplaySequenceNumber><Vnd>TK</Vnd><FltNum>85</FltNum><OpSuf/><Class>Y</Class><StartDt>20200524</StartDt><DtChg>1</DtChg><StartAirp>MNL</StartAirp><EndAirp>IST</EndAirp><StartTm>2130</StartTm><EndTm>505</EndTm><Status>AK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd>N</FareQuoteTkIgnInd><StopoverInd>N</StopoverInd><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt>DEPARTS MNL TERMINAL 3</Txt></TextMsg><AirSell><DisplaySequenceNumber>00</DisplaySequenceNumber><Vnd>TK</Vnd><FltNum>1757</FltNum><OpSuf/><Class>Y</Class><StartDt>20200525</StartDt><DtChg>0</DtChg><StartAirp>IST</StartAirp><EndAirp>RIX</EndAirp><StartTm>820</StartTm><EndTm>1120</EndTm><Status>AK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd>N</FareQuoteTkIgnInd><StopoverInd>N</StopoverInd><AvailyBypassInd/><OpAirV/></AirSell></AirSegSell><PNRBFRetrieve><Control><KLRCnt>6</KLRCnt><KlrAry><Klr><ID>IT01</ID><NumOccur>4</NumOccur></Klr><Klr><ID>IT02</ID><NumOccur>1</NumOccur></Klr><Klr><ID>BP08</ID><NumOccur>1</NumOccur></Klr></KlrAry></Control><AirSeg><SegNum>1</SegNum><Status>HS</Status><Dt>20200520</Dt><DayChg>01</DayChg><AirV>PR</AirV><NumPsgrs>1</NumPsgrs><StartAirp>JFK</StartAirp><EndAirp>MNL</EndAirp><StartTm>145</StartTm><EndTm>615</EndTm><BIC>C</BIC><FltNum>127</FltNum><OpSuf/><COG>N</COG><TklessInd>Y</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType>O</SellType><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd/><PrevStatusCode>NN</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg><AirSeg><SegNum>2</SegNum><Status>HS</Status><Dt>20200528</Dt><DayChg>00</DayChg><AirV>AY</AirV><NumPsgrs>1</NumPsgrs><StartAirp>RIX</StartAirp><EndAirp>HEL</EndAirp><StartTm>1015</StartTm><EndTm>1125</EndTm><BIC>Y</BIC><FltNum>1072</FltNum><OpSuf/><COG>N</COG><TklessInd>Y</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType>O</SellType><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd/><PrevStatusCode>NN</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd>Y</OpAirVInd></AirSeg><AirSegOpAirV><OpAirVInfoAry><OpAirVInfo><StartAirp/><EndAirp/><AirV>N7</AirV><AirVName>NORDIC REGIONAL AIRLINES</AirVName></OpAirVInfo></OpAirVInfoAry></AirSegOpAirV><AirSeg><SegNum>3</SegNum><Status>AK</Status><Dt>20200524</Dt><DayChg>01</DayChg><AirV>TK</AirV><NumPsgrs>1</NumPsgrs><StartAirp>MNL</StartAirp><EndAirp>IST</EndAirp><StartTm>2130</StartTm><EndTm>505</EndTm><BIC>Y</BIC><FltNum>85</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd/><PrevStatusCode>AK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg><AirSeg><SegNum>4</SegNum><Status>AK</Status><Dt>20200525</Dt><DayChg>00</DayChg><AirV>TK</AirV><NumPsgrs>1</NumPsgrs><StartAirp>IST</StartAirp><EndAirp>RIX</EndAirp><StartTm>820</StartTm><EndTm>1120</EndTm><BIC>Y</BIC><FltNum>1757</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>Y</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd/><PrevStatusCode>AK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg><GenPNRInfo><FileAddr/><CodeCheck/><RecLoc/><Ver>0</Ver><OwningCRS>1G</OwningCRS><OwningAgncyName>INTERNATIONAL TRAVEL NET</OwningAgncyName><OwningAgncyPCC>711M</OwningAgncyPCC><CreationDt/><CreatingAgntSignOn/><CreatingAgntDuty/><CreatingAgncyIATANum/><OrigBkLocn/><SATONum/><PTAInd>N</PTAInd><InUseInd/><SimultaneousUpdInd/><BorrowedInd>N</BorrowedInd><GlobInd>N</GlobInd><ReadOnlyInd>N</ReadOnlyInd><FareDataExistsInd>N</FareDataExistsInd><PastDtQuickInd>N</PastDtQuickInd><CurAgncyPCC>711M</CurAgncyPCC><QInd>N</QInd><TkNumExistInd>N</TkNumExistInd><IMUdataexists>N</IMUdataexists><ETkDataExistInd>Y</ETkDataExistInd><CurDtStamp>20190814</CurDtStamp><CurTmStamp>130149</CurTmStamp><CurAgntSONID>VTL9WS</CurAgntSONID><TravInsuranceInd/><PNRBFTicketedInd>N</PNRBFTicketedInd><ZeppelinAgncyInd>N</ZeppelinAgncyInd><AgncyAutoServiceInd>N</AgncyAutoServiceInd><AgncyAutoNotifyInd>N</AgncyAutoNotifyInd><ZeppelinPNRInd>N</ZeppelinPNRInd><PNRAutoServiceInd>N</PNRAutoServiceInd><PNRNotifyInd>N</PNRNotifyInd><SuperPNRInd>N</SuperPNRInd><PNRBFPurgeDt>NO PURGE</PNRBFPurgeDt><PNRBFChangeInd>Y</PNRBFChangeInd><MCODataExists>N</MCODataExists><OrigRcvdField/><IntContExists>N</IntContExists><AllDataAllTime>N</AllDataAllTime><LastActAgntID/><TransPCCName>INTERNATIONAL TRAVEL NET</TransPCCName><URrecordLoc/><UROSindLoc>N</UROSindLoc><URRCBInd>N</URRCBInd><GMTPNRBFCreationDt/><PricingRecordExist>N</PricingRecordExist><ArchivedFeeDataExists/><LeisureshopperDataExists>N</LeisureshopperDataExists><SeatDataExists>N</SeatDataExists><FrequentFlyerDataExists/><NetTicketDataExists>N</NetTicketDataExists><TinsRemarksExist>N</TinsRemarksExist><ElectronicDataExists>N</ElectronicDataExists><AdditionalItineraryDataExists>N</AdditionalItineraryDataExists><GroupAllocationFileExists>N</GroupAllocationFileExists><ProfileAssociationsExist/><VendorLocatorDataExists>N</VendorLocatorDataExists><BookingCodeDataExists/><ArneDataExists/><TimaticDataExists/><LinearFareDataExists/><ItineraryRemarksExist>N</ItineraryRemarksExist><IdentificationFieldExists>N</IdentificationFieldExists><EmailAddressExists/><RuleDataExists/><LSVendorConfirmationExists>N</LSVendorConfirmationExists><AdditionalSrvcs/><ElectronicMiscDocumentList>N</ElectronicMiscDocumentList><TDSProfileExists>N</TDSProfileExists><ServiceInformationExists>N</ServiceInformationExists><FiledFareDataExists>N</FiledFareDataExists><VendorRemarksDataExists>N</VendorRemarksDataExists><MembershipDataExists>N</MembershipDataExists><DividedBookingsExist>N</DividedBookingsExist><ClientFileReferencesExist>N</ClientFileReferencesExist><CustomCheckRulesExist>N</CustomCheckRulesExist><PassengerInformationExists>N</PassengerInformationExists><GUID/><ARCNewPNR>Y</ARCNewPNR><ARCFares>N</ARCFares><ARCTicketed>N</ARCTicketed><ARCSplitDivide>N</ARCSplitDivide><ARCNameAdd>N</ARCNameAdd><ARCNameDelete>N</ARCNameDelete><ARCItinAdd>Y</ARCItinAdd><ARCItinDEL>N</ARCItinDEL><ARCPhoneAdd>N</ARCPhoneAdd><ARCPhoneDel>N</ARCPhoneDel><ARCFOPAdd>N</ARCFOPAdd><ARCFOPDelete>N</ARCFOPDelete><ARCSSRAdd>N</ARCSSRAdd><ARCSSRDel>N</ARCSSRDel><ARCOSIAdd>N</ARCOSIAdd><ARCOSIDel>N</ARCOSIDel><ReasonCodesspares/></GenPNRInfo></PNRBFRetrieve></PNRBFManagement_51></SubmitXmlOnSessionResult></SubmitXmlOnSessionResponse></soapenv:Body></soapenv:Envelope>',
			}],
		});

		return list.map(c => [c]);
	}

	/**
	 * @test
	 * @dataProvider provideTestCases
	 */
	async testCase(testCase) {
		testCase.startDt = testCase.startDt || '2019-08-19 00:00:00';
		let commandsLeft = (testCase.sessionInfo || {}).performedCommands || [];
		testCase.fullState = testCase.fullState || {
			gds: 'galileo', area: 'A', areas: {
				'A': {...GdsSessions.makeDefaultAreaState('galileo'), area: 'A'},
			},
		};
		let unit = this;
		/** @param stateful = require('StatefulSession.js')() */
		let getActual = async ({stateful, input, gdsClients}) => {
			let runCmdXml = stateful.runCmd;
			stateful.runCmd = cmd => {
				const calledCmd = commandsLeft.shift();
				if (cmd === calledCmd.cmd) {
					stateful.getCalledCommands().push(calledCmd);
					return Promise.resolve(calledCmd);
				} else {
					return runCmdXml(cmd);
				}
			};
			let actual = await RunCmdRq({
				stateful, ...input, useXml: true,
				gdsClients,
			});
			actual.sessionData = stateful.getSessionData();
			return actual;
		};
		await GdsActionTestUtil.testHttpGdsAction({unit, testCase, getActual});
		this.assertEquals([], commandsLeft, 'some unused commands left');
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testCase],
		];
	}
}

RunCmdRqXmlTest.count = 0;
module.exports = RunCmdRqXmlTest;
