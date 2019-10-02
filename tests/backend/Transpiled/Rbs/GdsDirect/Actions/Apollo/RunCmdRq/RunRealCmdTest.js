const RunRealCmd = require('../../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Apollo/RunCmdRq/RunRealCmd.js');
const GdsSessions = require('../../../../../../../../backend/Repositories/GdsSessions.js');
const GdsActionTestUtil = require('../../../../../../../../backend/Utils/Testing/GdsActionTestUtil.js');

const provide_checkIsForbidden = () => {
	const testCases = [];

	testCases.push({
		title: 'XI in a divided PNR - should take real ticket numbers to test for void from XML',
		emcUser: {
			id: 100548,
			displayName: 'Chad',
			roles: ["NEW_GDS_DIRECT_EDIT_VOID_TICKETED_PNR"],
		},
		input: {
			cmd: 'XI',
		},
		output: ['Forbidden command, cant delete fields in ticketed PNR'],
		httpRequests: [
			{
				rq: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'	<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>*R</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>',
				].join('\n'),
				rs: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
					' <soapenv:Body><SubmitTerminalTransactionResponse xmlns="http://webservices.galileo.com"><SubmitTerminalTransactionResult USM="false">PANDAREN',
					'2G8P - DOWNTOWN TRAVEL          ATL',
					'NKJN49/WS QSBYC DPB/VWS AG 23854526 02OCT',
					' 1.1IWU/PATRICIA URENNA ',
					' 1 DL8573L 22DEC DTWCDG HK1   905P 1050A|*      SU/MO   E',
					'         OPERATED BY AIR FRANCE',
					' 2 AF 818Q 23DEC CDGABV HK1   115P  720P *         MO   E',
					' 3 AF 818R 13JAN ABVCDG HK1   855P  620A|*      MO/TU   E',
					' 4 DL8504X 14JAN CDGATL HK1  1035A  235P *         TU   E  1',
					'         OPERATED BY AIR FRANCE',
					' 5 DL3055X 14JAN ATLDTW HK1   449P  645P *         TU   E  1',
					' 6 OTH ZO GK1  XXX 02AUG-PRESERVEPNR',
					'*** PROFILE ASSOCIATIONS EXIST *** &gt;*PA; ',
					')&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>',
					'</soapenv:Envelope>',
				].join('\n'),
			},
			{
				rq: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'	<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>MR</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>',
				].join('\n'),
				rs: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
					' <soapenv:Body><SubmitTerminalTransactionResponse xmlns="http://webservices.galileo.com"><SubmitTerminalTransactionResult USM="false">*** SEAT DATA EXISTS *** &gt;9D; ',
					'*** DIVIDED BOOKING EXISTS ***&gt;*DV; ',
					'FONE-SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',
					'   2 ATLAS/212-481-5516-PANDAREN',
					'   3 SFOR/800-750-2238-ITN',
					'ADRS-INTERNATIONAL TRAVEL NETWORK@100 PINE STREET@SUITE 1925@SAN FRANCISCO CA Z/94111',
					'FOP:-CK',
					'TKTG-T/QSB 02OCT1813Z WS AG **ELECTRONIC DATA EXISTS** &gt;*HTE;',
					'*** TIN REMARKS EXIST *** &gt;*T; ',
					'*** LINEAR FARE DATA EXISTS *** &gt;*LF; ',
					'ATFQ-REPR/$B/-*2G8P/:A/Z0/ET/NOCCGR/TA2G8P/CDL',
					' FQ-USD 576.00/USD 37.20US/USD 837.45XT/USD 1450.65 - 2OCT LJML0)&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>',
					'</soapenv:Envelope>',
				].join('\n'),
			},
			{
				rq: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'	<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>MR</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>',
				].join('\n'),
				rs: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
					' <soapenv:Body><SubmitTerminalTransactionResponse xmlns="http://webservices.galileo.com"><SubmitTerminalTransactionResult USM="false">0M6.LJML00M6.XJML06M6.XJML06M6.XJML06M6',
					'GFAX-SSRADTK1VTOAF BY 04OCT 1600 OTHERWISE WILL BE XLD',
					'   2 SSRADTK1VTODL BY 04DEC 2359 SFO OTHERWISE MAY BE XLD',
					'   3 SSRADTK1VTODL BY 04DEC FARE MAY NEED EARLIER TKT DTE',
					'   4 OSIYY RLOC QTS1VZQ8QQ2',
					'   5 SSRADTK1VTOAF BY 04OCT 1600 OTHERWISE WILL BE XLD',
					'   6 SSRCTCEDLHK1/CHARLESBBKG//YAHOO.COM-1IWU/PATRICIA URENNA',
					'   7 SSRCTCEAFHK1/CHARLESBBKG//YAHOO.COM-1IWU/PATRICIA URENNA',
					'   8 SSRCTCMDLHK1/3133841084-1IWU/PATRICIA URENNA',
					'   9 SSRCTCMAFHK1/3133841084-1IWU/PATRICIA URENNA',
					'  10 SSRDOCSDLHK1/////27JAN57/F//IWU/PATRICIA/URENNA-1IWU/PATRICIA URENNA',
					'  11 SSRDOCSAFHK1/////27JAN57/F//IWU/PATRICIA/URENNA-1IWU/PATRIC)&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>',
					'</soapenv:Envelope>',
				].join('\n'),
			},
			{
				rq: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'	<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>MR</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>',
				].join('\n'),
				rs: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
					' <soapenv:Body><SubmitTerminalTransactionResponse xmlns="http://webservices.galileo.com"><SubmitTerminalTransactionResult USM="false">IA URENNA',
					'  12 SSRTKNEDLHK01 DTWCDG 8573L 22DEC-1IWU/PATRICIA .0067407604208C1/208-209',
					'  13 SSRTKNEAFHK01 CDGABV 0818Q 23DEC-1IWU/PATRICIA .0067407604208C2/208-209',
					'  14 SSRTKNEAFHK01 ABVCDG 0818R 13JAN-1IWU/PATRICIA .0067407604208C3/208-209',
					'  15 SSRTKNEDLHK01 CDGATL 8504X 14JAN-1IWU/PATRICIA .0067407604208C4/208-209',
					'  16 SSRTKNEDLHK01 ATLDTW 3055X 14JAN-1IWU/PATRICIA .0067407604209C1/208-209',
					'RMKS-GD-NOLAN MCRAE/103353/FOR ORE/102283/LEAD-13158322 IN 2G2H',
					'   2 SPLIT PTY/02OCT/WSAG/QSB/ZQ8QQ2',
					')&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>',
					'</soapenv:Envelope>',
				].join('\n'),
			},
			{
				rq: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'	<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>MR</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>',
				].join('\n'),
				rs: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
					' <soapenv:Body><SubmitTerminalTransactionResponse xmlns="http://webservices.galileo.com"><SubmitTerminalTransactionResult USM="false">TRMK-AN8007502041',
					'   2 DI-UD35',
					'   3 CA ACCT-8007502041',
					'   4 UD8 0',
					'   5 UD1 N',
					'ACKN-1A R8EG9A   02OCT 1545',
					'   2 DL GGKSCJ   02OCT 1810',
					'   3 DL GGKSCJ   02OCT 1810',
					'&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>',
					'</soapenv:Envelope>',
				].join('\n'),
			},
			{
				rq: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'	<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>*HTE</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>',
				].join('\n'),
				rs: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
					' <soapenv:Body><SubmitTerminalTransactionResponse xmlns="http://webservices.galileo.com"><SubmitTerminalTransactionResult USM="false">TKT: 006 7407 604208-209 NAME: IWU/PATRICIA URENNA               PH: 800 750 2238                                  ',
					'ISSUED: 02OCT19          FOP:CHECK                              PSEUDO: 2G8P  PLATING CARRIER: DL  ISO: US  IATA: 10577976   ',
					'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
					'   ARPT DL 8573  L  22DEC DTWCDG 0905P OK LJML00M6/LN610     1',
					'                                          NVB22DEC NVA22DEC',
					'   ARPT AF  818  Q  23DEC CDGABV 0115P OK LJML00M6/LN610     2',
					'                                          NVB23DEC NVA23DEC',
					'   ARPT AF  818  R  13JAN ABVCDG 0855P OK XJML06M6/LN610     3',
					'                                          NVB13JAN NVA13JAN',
					'   ARPT DL 8504  X  14JAN CDGATL 1035A OK XJML06M6/LN610     4',
					'                                          NVB14JAN NVA14JAN',
					')&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>',
					'</soapenv:Envelope>',
				].join('\n'),
			},
			{
				rq: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'	<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>soap-unit-test-blabla-123</ns1:Token><ns1:Request>MR</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>',
				].join('\n'),
				rs: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
					' <soapenv:Body><SubmitTerminalTransactionResponse xmlns="http://webservices.galileo.com"><SubmitTerminalTransactionResult USM="false">----209----',
					'   OPEN DL 3055  X  14JAN ATLDTW 0449P OK XJML06M6/LN610     1',
					'                                          NVB14JAN NVA14JAN',
					' ',
					'FARE          IT TAX    37.20 US TAX   837.45 XT',
					'TOTAL USD      IT',
					'   NONEND-NONREFL-9882-LN610    ',
					' ',
					'FC M/IT END ROE1.0 XT 650.00YR 50.00QT 42.20QX 28.0',
					'0YQ 20.00TE 11.20AY 10.20FR 7.00XY 5.89YC 3.96XA 9.             00XFDTW4.5ATL4.5                                                RLOC 1V NKJN49    DL GGKSCJ                                            ',
					'&gt;&lt;</SubmitTerminalTransactionResult></SubmitTerminalTransactionResponse> </soapenv:Body>',
					'</soapenv:Envelope>',
				].join('\n'),
			},
			{
				rq: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'		<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com">',
					'			<SOAP-ENV:Body>',
					'				<ns1:SubmitXmlOnSession>',
					'					<ns1:Token>soap-unit-test-blabla-123</ns1:Token>',
					'					<ns1:Request>',
					'						<PNRBFManagement_51>',
					'							<SessionMods><AreaInfoReq/></SessionMods><PNRBFRetrieveMods><PNRAddr><RecLoc>NKJN49</RecLoc></PNRAddr></PNRBFRetrieveMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>1</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>2</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>3</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>4</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>5</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>6</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>7</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods><FareRedisplayMods><DisplayAction/><FareNumInfo><FareNumAry><FareNum>8</FareNum></FareNumAry></FareNumInfo></FareRedisplayMods>',
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
					' <soapenv:Body><SubmitXmlOnSessionResponse xmlns="http://webservices.galileo.com"><SubmitXmlOnSessionResult><PNRBFManagement_51 xmlns=""><SessionInfo><AreaInfoResp><Sys>1V</Sys><Processor>E</Processor><GrpModeActivatedInd>N</GrpModeActivatedInd><AAAAreaAry><AAAAreaInfo><AAAArea>A</AAAArea><ActiveInd>Y</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials>WS</AgntInitials><Duty>AG</Duty><AgncyPCC>2F3K</AgncyPCC><DomMode>BASIC</DomMode><IntlMode>US-ECAC</IntlMode><PNRDataInd>Y</PNRDataInd><PNRName>IWU/PATRICIA URENNA</PNRName><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>B</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>C</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>D</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>E</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo></AAAAreaAry></AreaInfoResp></SessionInfo><PNRBFRetrieve><Control><KLRCnt>60</KLRCnt><KlrAry><Klr><ID>BP08</ID><NumOccur>1</NumOccur></Klr><Klr><ID>BP09</ID><NumOccur>1</NumOccur></Klr><Klr><ID>BP10</ID><NumOccur>1</NumOccur></Klr><Klr><ID>BP12</ID><NumOccur>1</NumOccur></Klr><Klr><ID>BP47</ID><NumOccur>1</NumOccur></Klr><Klr><ID>BP16</ID><NumOccur>3</NumOccur></Klr><Klr><ID>BP32</ID><NumOccur>1</NumOccur></Klr><Klr><ID>BP52</ID><NumOccur>1</NumOccur></Klr><Klr><ID>DPP1</ID><NumOccur>1</NumOccur></Klr><Klr><ID>BP17</ID><NumOccur>1</NumOccur></Klr><Klr><ID>IT01</ID><NumOccur>5</NumOccur></Klr><Klr><ID>IT02</ID><NumOccur>2</NumOccur></Klr><Klr><ID>IT07</ID><NumOccur>1</NumOccur></Klr><Klr><ID>ST01</ID><NumOccur>1</NumOccur></Klr><Klr><ID>ST02</ID><NumOccur>1</NumOccur></Klr><Klr><ID>BP19</ID><NumOccur>1</NumOccur></Klr><Klr><ID>BP20</ID><NumOccur>10</NumOccur></Klr><Klr><ID>BP51</ID><NumOccur>5</NumOccur></Klr><Klr><ID>BP21</ID><NumOccur>5</NumOccur></Klr><Klr><ID>BP22</ID><NumOccur>5</NumOccur></Klr><Klr><ID>BP24</ID><NumOccur>1</NumOccur></Klr><Klr><ID>BP26</ID><NumOccur>2</NumOccur></Klr><Klr><ID>BP27</ID><NumOccur>1</NumOccur></Klr><Klr><ID>DPIR</ID><NumOccur>5</NumOccur></Klr><Klr><ID>BP42</ID><NumOccur>1</NumOccur></Klr></KlrAry></Control><GenPNRInfo><FileAddr>D426B4AC</FileAddr><CodeCheck>53</CodeCheck><RecLoc>NKJN49</RecLoc><Ver>21</Ver><OwningCRS>1V</OwningCRS><OwningAgncyName>DOWNTOWN TRAVEL</OwningAgncyName><OwningAgncyPCC>2G8P</OwningAgncyPCC><CreationDt>20191002</CreationDt><CreatingAgntSignOn>DPBVWS</CreatingAgntSignOn><CreatingAgntDuty>AG</CreatingAgntDuty><CreatingAgncyIATANum>23854526</CreatingAgncyIATANum><OrigBkLocn>QSBYC</OrigBkLocn><SATONum/><PTAInd>N</PTAInd><InUseInd>N</InUseInd><SimultaneousUpdInd>N</SimultaneousUpdInd><BorrowedInd>N</BorrowedInd><GlobInd>N</GlobInd><ReadOnlyInd>N</ReadOnlyInd><FareDataExistsInd>Y</FareDataExistsInd><PastDtQuickInd>N</PastDtQuickInd><CurAgncyPCC>2F3K</CurAgncyPCC><QInd>N</QInd><TkNumExistInd>Y</TkNumExistInd><IMUdataexists>Y</IMUdataexists><ETkDataExistInd>Y</ETkDataExistInd><CurDtStamp>20191002</CurDtStamp><CurTmStamp>131112</CurTmStamp><CurAgntSONID>DPBVWS</CurAgntSONID><TravInsuranceInd>N</TravInsuranceInd><PNRBFTicketedInd>Y</PNRBFTicketedInd><ZeppelinAgncyInd>N</ZeppelinAgncyInd><AgncyAutoServiceInd>N</AgncyAutoServiceInd><AgncyAutoNotifyInd>N</AgncyAutoNotifyInd><ZeppelinPNRInd>N</ZeppelinPNRInd><PNRAutoServiceInd>N</PNRAutoServiceInd><PNRNotifyInd/><SuperPNRInd>N</SuperPNRInd><PNRBFPurgeDt>20200804</PNRBFPurgeDt><PNRBFChangeInd>N</PNRBFChangeInd><MCODataExists>N</MCODataExists><OrigRcvdField>NOLANMCRAE</OrigRcvdField><IntContExists/><AllDataAllTime>N</AllDataAllTime><LastActAgntID>DPBVWS</LastActAgntID><TransPCCName>INTERNATIONAL TRAVEL NET</TransPCCName><URrecordLoc/><UROSindLoc>N</UROSindLoc><URRCBInd>N</URRCBInd><GMTPNRBFCreationDt>20191002</GMTPNRBFCreationDt><PricingRecordExist>N</PricingRecordExist><ArchivedFeeDataExists>N</ArchivedFeeDataExists><LeisureshopperDataExists>N</LeisureshopperDataExists><SeatDataExists>Y</SeatDataExists><FrequentFlyerDataExists>N</FrequentFlyerDataExists><NetTicketDataExists>N</NetTicketDataExists><TinsRemarksExist>Y</TinsRemarksExist><ElectronicDataExists>Y</ElectronicDataExists><AdditionalItineraryDataExists>N</AdditionalItineraryDataExists><GroupAllocationFileExists>N</GroupAllocationFileExists><ProfileAssociationsExist>Y</ProfileAssociationsExist><VendorLocatorDataExists>Y</VendorLocatorDataExists><BookingCodeDataExists/><ArneDataExists>N</ArneDataExists><TimaticDataExists>N</TimaticDataExists><LinearFareDataExists>Y</LinearFareDataExists><ItineraryRemarksExist>N</ItineraryRemarksExist><IdentificationFieldExists>N</IdentificationFieldExists><EmailAddressExists>N</EmailAddressExists><RuleDataExists>N</RuleDataExists><LSVendorConfirmationExists>N</LSVendorConfirmationExists><AdditionalSrvcs>N</AdditionalSrvcs><ElectronicMiscDocumentList>N</ElectronicMiscDocumentList><TDSProfileExists>N</TDSProfileExists><ServiceInformationExists/><FiledFareDataExists/><VendorRemarksDataExists/><MembershipDataExists/><DividedBookingsExist>Y</DividedBookingsExist><ClientFileReferencesExist/><CustomCheckRulesExist/><PassengerInformationExists/><GUID/><ARCNewPNR/><ARCFares/><ARCTicketed/><ARCSplitDivide/><ARCNameAdd/><ARCNameDelete/><ARCItinAdd/><ARCItinDEL/><ARCPhoneAdd/><ARCPhoneDel/><ARCFOPAdd/><ARCFOPDelete/><ARCSSRAdd/><ARCSSRDel/><ARCOSIAdd/><ARCOSIDel/><ReasonCodesspares/></GenPNRInfo><PostScript><Text>PANDAREN</Text></PostScript><LNameInfo><LNameNum>1</LNameNum><NumPsgrs>1</NumPsgrs><NameType/><LName>IWU</LName></LNameInfo><FNameInfo><PsgrNum>1</PsgrNum><AbsNameNum>1</AbsNameNum><FName>PATRICIA URENNA</FName></FNameInfo><PsgrsName><NameType/><LNameNum>1</LNameNum><PsgrNum>1</PsgrNum><AbsNameNum>1</AbsNameNum><NameOrdNum>2</NameOrdNum><InfInd/><InfBirthDt/><InfLinkedAdtName>0</InfLinkedAdtName><Spare/><NameNum>IWU@PATRICIA URENNA@@</NameNum></PsgrsName><PhoneInfo><PhoneFldNum>1</PhoneFldNum><Pt>SFO</Pt><Type>A</Type><Phone>800-750-2238 ASAP CUSTOMER SUPPORT</Phone></PhoneInfo><PhoneInfo><PhoneFldNum>2</PhoneFldNum><Pt>ATL</Pt><Type>A</Type><Phone>212-481-5516-PANDAREN</Phone></PhoneInfo><PhoneInfo><PhoneFldNum>3</PhoneFldNum><Pt>SFO</Pt><Type>R</Type><Phone>800-750-2238-ITN</Phone></PhoneInfo><TkArrangement><Text>QSB 02OCT1813Z WS AG **ELECTRONIC DATA EXISTS**</Text></TkArrangement><FormOfPayment><FOPData>CK</FOPData></FormOfPayment><CheckFOP><ID>2</ID><Type>1</Type><Currency/><Amt/><AdditionalInfoAry></AdditionalInfoAry></CheckFOP><AddrInfo><Addr>INTERNATIONAL TRAVEL NETWORK@100 PINE STREET@SUITE 1925@SAN FRANCISCO CA Z/94111</Addr></AddrInfo><AirSeg><SegNum>1</SegNum><Status>HK</Status><Dt>20191222</Dt><DayChg>01</DayChg><AirV>DL</AirV><NumPsgrs>1</NumPsgrs><StartAirp>DTW</StartAirp><EndAirp>CDG</EndAirp><StartTm>2105</StartTm><EndTm>1050</EndTm><BIC>L</BIC><FltNum>8573</FltNum><OpSuf/><COG>N</COG><TklessInd>Y</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType>L</SellType><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>SS</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd>N</OpAirVInd></AirSeg><AirSegOpAirV><OpAirVInfoAry><OpAirVInfo><StartAirp>DTW</StartAirp><EndAirp>CDG</EndAirp><AirV>AF</AirV><AirVName>AIR FRANCE</AirVName></OpAirVInfo></OpAirVInfoAry></AirSegOpAirV><AirSeg><SegNum>2</SegNum><Status>HK</Status><Dt>20191223</Dt><DayChg>00</DayChg><AirV>AF</AirV><NumPsgrs>1</NumPsgrs><StartAirp>CDG</StartAirp><EndAirp>ABV</EndAirp><StartTm>1315</StartTm><EndTm>1920</EndTm><BIC>Q</BIC><FltNum>818</FltNum><OpSuf/><COG>N</COG><TklessInd>Y</TklessInd><ConxInd>Y</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType>L</SellType><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>SS</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg><AirSeg><SegNum>3</SegNum><Status>HK</Status><Dt>20200113</Dt><DayChg>01</DayChg><AirV>AF</AirV><NumPsgrs>1</NumPsgrs><StartAirp>ABV</StartAirp><EndAirp>CDG</EndAirp><StartTm>2055</StartTm><EndTm>620</EndTm><BIC>R</BIC><FltNum>818</FltNum><OpSuf/><COG>N</COG><TklessInd>Y</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType>L</SellType><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>SS</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd>Y</OpAirVInd></AirSeg><AirSeg><SegNum>4</SegNum><Status>HK</Status><Dt>20200114</Dt><DayChg>00</DayChg><AirV>DL</AirV><NumPsgrs>1</NumPsgrs><StartAirp>CDG</StartAirp><EndAirp>ATL</EndAirp><StartTm>1035</StartTm><EndTm>1435</EndTm><BIC>X</BIC><FltNum>8504</FltNum><OpSuf/><COG>N</COG><TklessInd>Y</TklessInd><ConxInd>Y</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum>01</MarriageNum><SellType>L</SellType><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>SS</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd>N</OpAirVInd></AirSeg><AirSegOpAirV><OpAirVInfoAry><OpAirVInfo><StartAirp>CDG</StartAirp><EndAirp>ATL</EndAirp><AirV>AF</AirV><AirVName>AIR FRANCE</AirVName></OpAirVInfo></OpAirVInfoAry></AirSegOpAirV><AirSeg><SegNum>5</SegNum><Status>HK</Status><Dt>20200114</Dt><DayChg>00</DayChg><AirV>DL</AirV><NumPsgrs>1</NumPsgrs><StartAirp>ATL</StartAirp><EndAirp>DTW</EndAirp><StartTm>1649</StartTm><EndTm>1845</EndTm><BIC>X</BIC><FltNum>3055</FltNum><OpSuf/><COG>N</COG><TklessInd>Y</TklessInd><ConxInd>Y</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum>01</MarriageNum><SellType>L</SellType><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>SS</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg><NonAirSeg><SegNum>6</SegNum><Status>GK</Status><Type>OTH</Type><StartDt>20200802</StartDt><EndDt/><Vnd>ZO</Vnd><NumPersons>1</NumPersons><NumNights/><StartPt>XXX</StartPt><EndPt/><SellType/><Text>-PRESERVEPNR</Text></NonAirSeg><SeatSeg><FltNum>3055</FltNum><OpSuf/><AirV>DL</AirV><StartDt>20200114</StartDt><BIC>X</BIC><StartAirp>ATL</StartAirp><EndAirp>DTW</EndAirp><FltSegNum>5</FltSegNum><NumPsgrs>1</NumPsgrs><COGNum/></SeatSeg><SeatAssignment><LNameNum/><PsgrNum/><AbsNameNum>1</AbsNameNum><Status>HK</Status><Locn>25C</Locn><AttribAry><Attrib>N</Attrib></AttribAry></SeatAssignment><OSI><GFAXNum>4</GFAXNum><OSIV>YY</OSIV><OSIMsg>RLOC QTS1VZQ8QQ2</OSIMsg></OSI><NonProgramaticSSR><GFAXNum>1</GFAXNum><SSRCode>ADTK</SSRCode><Vnd>1V</Vnd><Status/><NumRequired/><SSRText>TOAF BY 04OCT 1600 OTHERWISE WILL BE XLD</SSRText></NonProgramaticSSR><NonProgramaticSSR><GFAXNum>2</GFAXNum><SSRCode>ADTK</SSRCode><Vnd>1V</Vnd><Status/><NumRequired/><SSRText>TODL BY 04DEC 2359 SFO OTHERWISE MAY BE XLD</SSRText></NonProgramaticSSR><NonProgramaticSSR><GFAXNum>3</GFAXNum><SSRCode>ADTK</SSRCode><Vnd>1V</Vnd><Status/><NumRequired/><SSRText>TODL BY 04DEC FARE MAY NEED EARLIER TKT DTE</SSRText></NonProgramaticSSR><NonProgramaticSSR><GFAXNum>5</GFAXNum><SSRCode>ADTK</SSRCode><Vnd>1V</Vnd><Status/><NumRequired/><SSRText>TOAF BY 04OCT 1600 OTHERWISE WILL BE XLD</SSRText></NonProgramaticSSR><NonProgramaticSSR><GFAXNum>6</GFAXNum><SSRCode>CTCE</SSRCode><Vnd>DL</Vnd><Status>HK</Status><NumRequired>1</NumRequired><SSRText>CHARLESBBKG//YAHOO.COM-1IWU/PATRICIA URENNA</SSRText></NonProgramaticSSR><NonProgramaticSSR><GFAXNum>7</GFAXNum><SSRCode>CTCE</SSRCode><Vnd>AF</Vnd><Status>HK</Status><NumRequired>1</NumRequired><SSRText>CHARLESBBKG//YAHOO.COM-1IWU/PATRICIA URENNA</SSRText></NonProgramaticSSR><NonProgramaticSSR><GFAXNum>8</GFAXNum><SSRCode>CTCM</SSRCode><Vnd>DL</Vnd><Status>HK</Status><NumRequired>1</NumRequired><SSRText>3133841084-1IWU/PATRICIA URENNA</SSRText></NonProgramaticSSR><NonProgramaticSSR><GFAXNum>9</GFAXNum><SSRCode>CTCM</SSRCode><Vnd>AF</Vnd><Status>HK</Status><NumRequired>1</NumRequired><SSRText>3133841084-1IWU/PATRICIA URENNA</SSRText></NonProgramaticSSR><NonProgramaticSSR><GFAXNum>10</GFAXNum><SSRCode>DOCS</SSRCode><Vnd>DL</Vnd><Status>HK</Status><NumRequired>1</NumRequired><SSRText>////27JAN57/F//IWU/PATRICIA/URENNA-1IWU/PATRICIA URENNA</SSRText></NonProgramaticSSR><NonProgramaticSSR><GFAXNum>11</GFAXNum><SSRCode>DOCS</SSRCode><Vnd>AF</Vnd><Status>HK</Status><NumRequired>1</NumRequired><SSRText>////27JAN57/F//IWU/PATRICIA/URENNA-1IWU/PATRICIA URENNA</SSRText></NonProgramaticSSR><PrgmSSR><GenFactNum>12</GenFactNum><SSRCode>TKNE</SSRCode><Status>HK</Status><SegNum>1</SegNum><SSRQty>1</SSRQty><Spare/><AppliesToAry><AppliesTo><LNameNum>01</LNameNum><PsgrNum>01</PsgrNum><AbsNameID>0</AbsNameID><Spare/></AppliesTo></AppliesToAry></PrgmSSR><ProgramaticSSR><GFAXNum>12</GFAXNum><SSRCode>TKNE</SSRCode><Status>HK</Status><SegNum>1</SegNum><AppliesToAry><AppliesTo><LNameNum>1</LNameNum><PsgrNum>1</PsgrNum><AbsNameNum>0</AbsNameNum></AppliesTo></AppliesToAry></ProgramaticSSR><ProgramaticSSRText><Text>0067407604208C1/208-209</Text></ProgramaticSSRText><PrgmSSR><GenFactNum>13</GenFactNum><SSRCode>TKNE</SSRCode><Status>HK</Status><SegNum>2</SegNum><SSRQty>1</SSRQty><Spare/><AppliesToAry><AppliesTo><LNameNum>01</LNameNum><PsgrNum>01</PsgrNum><AbsNameID>0</AbsNameID><Spare/></AppliesTo></AppliesToAry></PrgmSSR><ProgramaticSSR><GFAXNum>13</GFAXNum><SSRCode>TKNE</SSRCode><Status>HK</Status><SegNum>2</SegNum><AppliesToAry><AppliesTo><LNameNum>1</LNameNum><PsgrNum>1</PsgrNum><AbsNameNum>0</AbsNameNum></AppliesTo></AppliesToAry></ProgramaticSSR><ProgramaticSSRText><Text>0067407604208C2/208-209</Text></ProgramaticSSRText><PrgmSSR><GenFactNum>14</GenFactNum><SSRCode>TKNE</SSRCode><Status>HK</Status><SegNum>3</SegNum><SSRQty>1</SSRQty><Spare/><AppliesToAry><AppliesTo><LNameNum>01</LNameNum><PsgrNum>01</PsgrNum><AbsNameID>0</AbsNameID><Spare/></AppliesTo></AppliesToAry></PrgmSSR><ProgramaticSSR><GFAXNum>14</GFAXNum><SSRCode>TKNE</SSRCode><Status>HK</Status><SegNum>3</SegNum><AppliesToAry><AppliesTo><LNameNum>1</LNameNum><PsgrNum>1</PsgrNum><AbsNameNum>0</AbsNameNum></AppliesTo></AppliesToAry></ProgramaticSSR><ProgramaticSSRText><Text>0067407604208C3/208-209</Text></ProgramaticSSRText><PrgmSSR><GenFactNum>15</GenFactNum><SSRCode>TKNE</SSRCode><Status>HK</Status><SegNum>4</SegNum><SSRQty>1</SSRQty><Spare/><AppliesToAry><AppliesTo><LNameNum>01</LNameNum><PsgrNum>01</PsgrNum><AbsNameID>0</AbsNameID><Spare/></AppliesTo></AppliesToAry></PrgmSSR><ProgramaticSSR><GFAXNum>15</GFAXNum><SSRCode>TKNE</SSRCode><Status>HK</Status><SegNum>4</SegNum><AppliesToAry><AppliesTo><LNameNum>1</LNameNum><PsgrNum>1</PsgrNum><AbsNameNum>0</AbsNameNum></AppliesTo></AppliesToAry></ProgramaticSSR><ProgramaticSSRText><Text>0067407604208C4/208-209</Text></ProgramaticSSRText><PrgmSSR><GenFactNum>16</GenFactNum><SSRCode>TKNE</SSRCode><Status>HK</Status><SegNum>5</SegNum><SSRQty>1</SSRQty><Spare/><AppliesToAry><AppliesTo><LNameNum>01</LNameNum><PsgrNum>01</PsgrNum><AbsNameID>0</AbsNameID><Spare/></AppliesTo></AppliesToAry></PrgmSSR><ProgramaticSSR><GFAXNum>16</GFAXNum><SSRCode>TKNE</SSRCode><Status>HK</Status><SegNum>5</SegNum><AppliesToAry><AppliesTo><LNameNum>1</LNameNum><PsgrNum>1</PsgrNum><AbsNameNum>0</AbsNameNum></AppliesTo></AppliesToAry></ProgramaticSSR><ProgramaticSSRText><Text>0067407604209C1/208-209</Text></ProgramaticSSRText><ProfileClientFileAssoc><ItemNum/><CRSID>1V</CRSID><MAR>2G8P</MAR><BAR>ITN</BAR><PAR/><ActiveInd>Y</ActiveInd><PrefsInd>N</PrefsInd></ProfileClientFileAssoc><GenRmkInfo><GenRmkNum>1</GenRmkNum><CreationDt/><CreationTm/><GenlRmkQual/><GenRmk>GD-NOLAN MCRAE/103353/FOR ORE/102283/LEAD-13158322 IN 2G2H</GenRmk></GenRmkInfo><GenRmkInfo><GenRmkNum>2</GenRmkNum><CreationDt/><CreationTm/><GenlRmkQual/><GenRmk>SPLIT PTY/02OCT/WSAG/QSB/ZQ8QQ2</GenRmk></GenRmkInfo><VndRecLocs><RecLocInfoAry><RecLocInfo><TmStamp>1545</TmStamp><DtStamp>20191002</DtStamp><Vnd>1A</Vnd><RecLoc>R8EG9A</RecLoc></RecLocInfo><RecLocInfo><TmStamp>1810</TmStamp><DtStamp>20191002</DtStamp><Vnd>DL</Vnd><RecLoc>GGKSCJ</RecLoc></RecLocInfo><RecLocInfo><TmStamp>1810</TmStamp><DtStamp>20191002</DtStamp><Vnd>DL</Vnd><RecLoc>GGKSCJ</RecLoc></RecLocInfo></RecLocInfoAry></VndRecLocs><InvoiceRmk><ItemNum>1</ItemNum><Keyword>3000</Keyword><Rmk>AN8007502041</Rmk></InvoiceRmk><InvoiceRmk><ItemNum>2</ItemNum><Keyword>3000</Keyword><Rmk>DI-UD35</Rmk></InvoiceRmk><InvoiceRmk><ItemNum>3</ItemNum><Keyword>3007</Keyword><Rmk>8007502041</Rmk></InvoiceRmk><InvoiceRmk><ItemNum>4</ItemNum><Keyword>3000</Keyword><Rmk>UD8 0</Rmk></InvoiceRmk><InvoiceRmk><ItemNum>5</ItemNum><Keyword>3000</Keyword><Rmk>UD1 N</Rmk></InvoiceRmk><DividedBookingInfo><DivPsgrName>NNAJI/CHARLES AM</DivPsgrName><TruncInd>Y</TruncInd><DivTypeInd>N</DivTypeInd><RLoc>ZQ8QQ2</RLoc><DivDt>20191002</DivDt><DivTm>094500</DivTm></DividedBookingInfo></PNRBFRetrieve><DocProdDisplayStoredQuote><FareNumInfo><FareNumAry><FareNum>1</FareNum></FareNumAry></FareNumInfo><GenQuoteDetails><UniqueKey>1</UniqueKey><QuoteNum>1</QuoteNum><QuoteType>C</QuoteType><LastTkDt>20191004</LastTkDt><QuoteDt>20191002</QuoteDt><IntlSaleInd/><BaseFareCurrency>USD</BaseFareCurrency><BaseFareAmt>57600</BaseFareAmt><LowestOrNUCFare>0</LowestOrNUCFare><BaseDecPos>2</BaseDecPos><EquivCurrency/><EquivAmt>0</EquivAmt><EquivDecPos>0</EquivDecPos><TotCurrency>USD</TotCurrency><TotAmt>145065</TotAmt><TotDecPos>2</TotDecPos><ITNum/><RteBasedQuote>N</RteBasedQuote><M0>N</M0><M5>N</M5><M10>N</M10><M15>N</M15><M20>N</M20><M25>N</M25><Spare1>N</Spare1><PrivFQd>Y</PrivFQd><PFOverrides>N</PFOverrides><FlatFQd>N</FlatFQd><DirMinApplied>N</DirMinApplied><VATIncInd>N</VATIncInd><PenApplies>N</PenApplies><Spare2>N</Spare2><QuoteBasis>N</QuoteBasis><TaxDataAry><TaxData><Country>AY</Country><Amt>00011.20</Amt></TaxData><TaxData><Country>US</Country><Amt>00037.20</Amt></TaxData><TaxData><Country>XA</Country><Amt>00003.96</Amt></TaxData><TaxData><Country>XF</Country><Amt>00009.00</Amt></TaxData><TaxData><Country>XY</Country><Amt>00007.00</Amt></TaxData><TaxData><Country>YC</Country><Amt>00005.89</Amt></TaxData><TaxData><Country>FR</Country><Amt>00010.20</Amt></TaxData><TaxData><Country>QX</Country><Amt>00042.20</Amt></TaxData><TaxData><Country>QT</Country><Amt>00050.00</Amt></TaxData><TaxData><Country>TE</Country><Amt>00020.00</Amt></TaxData><TaxData><Country>YR</Country><Amt>00650.00</Amt></TaxData><TaxData><Country>YQ</Country><Amt>00028.00</Amt></TaxData></TaxDataAry></GenQuoteDetails><ExtendedQuoteInformation><UniqueKey>1</UniqueKey><QuoteNum>1</QuoteNum><ETkInd>Y</ETkInd><PaperTkInd>N</PaperTkInd><PlatingInd>N</PlatingInd><NetFareInd>N</NetFareInd><TkFareInd>Y</TkFareInd><LLPFQuoted>N</LLPFQuoted><CommUnresolved>N</CommUnresolved><DataRetQuote>Y</DataRetQuote><FareIT>N</FareIT><BagInd>N</BagInd><TkDesignator>N</TkDesignator><FareBT>N</FareBT><FiledNetFare>N</FiledNetFare><NTypeComm>N</NTypeComm><Spare1>NN</Spare1><NetFareCrncy/><NetFareAmt>0</NetFareAmt><NetFareNumDecs>0</NetFareNumDecs><EquivNetFareCrcy/><EquivNetFareAmt>0</EquivNetFareAmt><EquivNumDecs>0</EquivNumDecs><TotNetCrcy/><TotNetAmt>0</TotNetAmt><TotNetNumDecs>0</TotNetNumDecs><TkFareCrcy>USD</TkFareCrcy><TkFareAmt>57600</TkFareAmt><TkNumDecs>2</TkNumDecs><EquivTkCrncy/><EquivTkAmt>0</EquivTkAmt><EquivTkNumDecs>0</EquivTkNumDecs><TotTkCrncy>USD</TotTkCrncy><TotTkAmt>145065</TotTkAmt><TotTkNumDecs>2</TotTkNumDecs><CrncyBaseFareTkPsgrCoupon/><TkPsgrCouponAmt>0</TkPsgrCouponAmt><TkPsgrCouponNumDecs>0</TkPsgrCouponNumDecs><EquivCrncyTkPsgrCoupon/><EquivAmtTkPsgrCoupon>0</EquivAmtTkPsgrCoupon><EquivNumDecsTkPsgrCoupon>0</EquivNumDecsTkPsgrCoupon><TotCrncyTkPsgrCoupon/><TotAmtTkPsgrCoupon>0</TotAmtTkPsgrCoupon><TotNumDecsTkPsgrCoupon>0</TotNumDecsTkPsgrCoupon><MethodType>0</MethodType><Type/><CARCode/><ValueCode/><TkPCC/><TkPCCIATANum/><SellingPCC/><SellingIATANum/><TkPCCTkAuthority>N</TkPCCTkAuthority><TkPCCSellAuthority>N</TkPCCSellAuthority><SellPCCTkAuthority>N</SellPCCTkAuthority><SellPCCSellAuthority>N</SellPCCSellAuthority><Spare2>NNNN</Spare2></ExtendedQuoteInformation><AgntEnteredPsgrDescInfo><UniqueKey>0001</UniqueKey><AgntEnteredPsgrDesc/><QuotedPsgrDesc/><PFCApplies>N</PFCApplies><Spare1>NNNNNNN</Spare1><ApplesToAry><AppliesTo><LNameNum>1</LNameNum><FNameNum>1</FNameNum><AbsNameNum>0</AbsNameNum></AppliesTo></ApplesToAry></AgntEnteredPsgrDescInfo><FareGarnteCD><UniqueKey>1</UniqueKey><QuoteNum>1</QuoteNum><GuaranteeCD>A</GuaranteeCD></FareGarnteCD><AssocSegs><SegNumAry><SegNum>1</SegNum></SegNumAry></AssocSegs><PFMod><Acct/><PCC>2G8P</PCC><Contract/><PFType>P</PFType></PFMod><AssocSegs><SegNumAry><SegNum>2</SegNum></SegNumAry></AssocSegs><PFMod><Acct/><PCC>2G8P</PCC><Contract/><PFType>P</PFType></PFMod><AssocSegs><SegNumAry><SegNum>3</SegNum></SegNumAry></AssocSegs><PFMod><Acct/><PCC>2G8P</PCC><Contract/><PFType>P</PFType></PFMod><AssocSegs><SegNumAry><SegNum>4</SegNum></SegNumAry></AssocSegs><PFMod><Acct/><PCC>2G8P</PCC><Contract/><PFType>P</PFType></PFMod><AssocSegs><SegNumAry><SegNum>5</SegNum></SegNumAry></AssocSegs><PFMod><Acct/><PCC>2G8P</PCC><Contract/><PFType>P</PFType></PFMod><CommissionMod><Amt/><Percent>0</Percent><CommCappedAmt/></CommissionMod><PlatingAirVMod><AirV>DL</AirV></PlatingAirVMod><FOPRestrictions><PaymentTypeArray><PaymentType>CC</PaymentType><PaymentType>GR</PaymentType></PaymentTypeArray></FOPRestrictions><DocumentSelect><TkOnlyInd/><ETInd>Y</ETInd><CouponCnt/><DestInd/><ForceInd/><MIRInd/><Locn/><PCC/><ItinInd/><FaxInd/><ItinOptInd/><SepInd/><PocketItinCnt/><PocketItinsDestInd/><DeliveryDocsInd/></DocumentSelect><AdditionalPsgrFareInfo><FareGuarCode>V</FareGuarCode><Status>U</Status><TkNum>0067407604208-209</TkNum><TkType/><LNameNum>1</LNameNum><PsgrNum>1</PsgrNum><AbsNameNum/><UnableTkStatus/><InvoiceAlphaChars>EZ</InvoiceAlphaChars><InvoiceNum>EZ0111067</InvoiceNum></AdditionalPsgrFareInfo></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002311</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>FARE DOES NOT EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002311</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>FARE DOES NOT EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002311</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>FARE DOES NOT EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002311</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>FARE DOES NOT EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002311</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>FARE DOES NOT EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002311</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>FARE DOES NOT EXIST</Text></ErrText></DocProdDisplayStoredQuote><DocProdDisplayStoredQuote><ErrText><Err>D0002311</Err><KlrInErr>0000</KlrInErr><InsertedTextAry></InsertedTextAry><Text>FARE DOES NOT EXIST</Text></ErrText></DocProdDisplayStoredQuote></PNRBFManagement_51></SubmitXmlOnSessionResult></SubmitXmlOnSessionResponse></soapenv:Body></soapenv:Envelope>',
				].join('\n'),
			},
		],
	});

	return testCases.map(c => [c]);
};

class RunCmdRqXmlTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js') {
	async test_checkIsForbidden(testCase) {
		testCase.fullState = testCase.fullState || {
			gds: 'apollo', area: 'A', areas: {
				'A': {...GdsSessions.makeDefaultAreaState('apollo'),
					area: 'A', hasPnr: true, isPnrStored: true,
					recordLocator: 'NKJN49',
				},
			},
		};
		const unit = this;
		/** @param stateful = require('StatefulSession.js')() */
		const getActual = async ({stateful, input, gdsClients}) => {
			return RunRealCmd.checkIsForbidden({
				stateful, ...input, gdsClients,
			});
		};

		await GdsActionTestUtil.testHttpGdsAction({unit, testCase, getActual});
	}

	getTestMapping() {
		return [
			[provide_checkIsForbidden, this.test_checkIsForbidden],
		];
	}
}

module.exports = RunCmdRqXmlTest;
