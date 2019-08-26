const {LoginTimeOut, BadGateway} = require("klesun-node-tools/src/Rej");
const {escapeXml, parseXml} = require("../GdsHelpers/CommonUtils.js");
const Conflict = require("klesun-node-tools/src/Rej").Conflict;
const TravelportPnrRequestTransformer = require('./Transformers/TravelportPnrRequest');
const TravelportFareRuleTransformer = require('./Transformers/TravelportFareRules');

/**
 * they are all physically located in USA, Atlanta (in same building)
 * I guess different urls are kept just for compatibility now
 * it is said in their docs, though, that it is possible to setup a separate endpoint for a company:
 * @see https://support.travelport.com/webhelp/GWS/Content/Overview/Getting_Started/Connecting_to_GWS.htm
 * due to geo-latency, requests from Europe to USA are taking at least 100 ms overhead on dev
 *
 * Upd.: the travelport business guys said that they decide regional stuff depending on
 * the url, something like showing european fares on europe url more often, and such stuff...
 */
const endpoint = 'https://americas.webservices.travelport.com/B2BGateway/service/XMLSelect';
//let endpoint = 'https://emea.webservices.travelport.com/B2BGateway/service/XMLSelect';
//let endpoint = 'https://apac.webservices.travelport.com/B2BGateway/service/XMLSelect';

const buildSoapBody = (gdsData, requestType, reqXml) => (
	`<?xml version="1.0" encoding="UTF-8"?>
		<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com">
			<SOAP-ENV:Body>
				<ns1:SubmitXmlOnSession>
					<ns1:Token>${gdsData.sessionToken}</ns1:Token>
					<ns1:Request>
						<${requestType}>
							${reqXml}
						</${requestType}>
					</ns1:Request>
					<ns1:Filter>
						<_/>
					</ns1:Filter>
				</ns1:SubmitXmlOnSession>
			</SOAP-ENV:Body>
		</SOAP-ENV:Envelope>`);

const buildFaresSoapEnv = () => [
	'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com">',
	'  <SOAP-ENV:Body>',
	'    <ns1:SubmitXml>',
	'      <ns1:Profile>DynApolloProd_2G8P</ns1:Profile>',
	'      <ns1:Request>',
	'        <FareQuoteMultiDisplay_27>',
	'          <FareDisplayMods>',
	'            <QueryHeader>',
	'              <Action>02</Action>',
	'              <SmartParsed>N</SmartParsed>',
	'              <PFPWInd>Y</PFPWInd>',
	'              <TariffQual>',
	'                <PRIInd>Y</PRIInd>',
	'              </TariffQual>',
	'            </QueryHeader>',
	'            <TravConstraints>',
	'              <StartPt>MIA</StartPt>',
	'              <EndPt>LON</EndPt>',
	'              <StartDt>20190519</StartDt>',
	'              <EndDt>20190530</EndDt>',
	'              <ValidatingDispInd>Y</ValidatingDispInd>',
	'              <AirV1>AA</AirV1>',
	'              <AirlinePvtFare>Y</AirlinePvtFare>',
	'            </TravConstraints>',
	'            <PFMods>',
	'              <PCC>2G8P</PCC>',
	'            </PFMods>',
	'         </FareDisplayMods>',
	'        </FareQuoteMultiDisplay_27>',
	'      </ns1:Request>',
	'      <ns1:Filter>',
	'        <_/>',
	'      </ns1:Filter>',
	'    </ns1:SubmitXml>',
	'  </SOAP-ENV:Body>',
	'</SOAP-ENV:Envelope>',
].join('\n');

const TravelportClient = ({
	PersistentHttpRq = require('klesun-node-tools/src/Utils/PersistentHttpRq.js'),
	GdsProfiles = require("../Repositories/GdsProfiles"),
} = {}) => {

	const {getTravelport} = GdsProfiles;

	const sendRequest = async (requestBody, profileName) => {
		const profileData = await getTravelport(profileName);
		const authTokenSrc = profileData.username + ':' + profileData.password;
		const authToken = Buffer.from(authTokenSrc).toString('base64');
		return PersistentHttpRq({
			url: endpoint,
			headers: {
				'Authorization': 'Basic ' + authToken,
			},
			body: requestBody,
		}).then(resp => resp.body);
	};

	const startSession = (params) => {
		const profileName = params.profileName;
		const body = `<?xml version="1.0" encoding="UTF-8"?>
	<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:BeginSession><ns1:Profile>${profileName}</ns1:Profile></ns1:BeginSession></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
		return sendRequest(body, profileName).then(resp => {
			const sessionToken = parseXml(resp).querySelectorAll('BeginSessionResult')[0].textContent;
			if (!sessionToken) {
				return BadGateway('Failed to extract session token from Travelport response - ' + resp);
			} else {
				return Promise.resolve({sessionToken: sessionToken, profileName: profileName});
			}
		});
	};

	const normActionExc = (exc, body) => {
		if ((exc + '').indexOf('Could not locate Session Token Information') > -1) {
			return LoginTimeOut('Session token expired');
		} else if ((exc + '').indexOf('Transaction already in progress') > -1) {
			const error = 'Another command is still in progress - no action taken.\n' +
				'To restart session use _⚙ (Gear) -> Default PCC_.\n' +
				'Note, reloading page does not reduce waiting time on hanging availability (60 s.).';
			return Conflict(error, {isOk: true});
		} else {
			const obj = typeof exc === 'string' ? new Error(exc) : exc;
			// for debug, be careful not to include credentials here
			obj.rqBody = body;
			return Promise.reject(obj);
		}
	};

	const runCmd = (cmd, gdsData) => {
		const token = gdsData.sessionToken;
		const profileName = gdsData.profileName;
		const body = `<?xml version="1.0" encoding="UTF-8"?>
	<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>` + token + `</ns1:Token><ns1:Request>` + escapeXml(cmd) + `</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
		return sendRequest(body, profileName).then(resp => {
			const resultTag = parseXml(resp).querySelectorAll('SubmitTerminalTransactionResult')[0];
			if (resultTag) {
				return {output: resultTag.textContent};
			} else {
				return BadGateway('Unexpected Travelport response format - ' + resp);
			}
		}).catch(exc => normActionExc(exc, body));
	};

	const processPnr = async (gdsData, params) => {
		const reqXml = TravelportPnrRequestTransformer.buildPnrXmlDataObject(params);

		const reqBody = buildSoapBody(gdsData, 'PNRBFManagement_51', reqXml);

		return sendRequest(reqBody, gdsData.profileName)
			.then(TravelportPnrRequestTransformer.parsePnrXmlResponse)
			.catch(exc => normActionExc(exc, reqBody));
	};

	const getFareRules = async (gdsData, params) => {
		const reqXml = TravelportFareRuleTransformer.buildFareRuleXml(params);

		const reqBody = buildSoapBody(gdsData, 'FareQuoteMultiDisplay_23', reqXml);

		return sendRequest(reqBody, gdsData.profileName)
			.then(result => TravelportFareRuleTransformer.parseFareRuleXmlResponse(result, params))
			.catch(exc => normActionExc(exc, reqBody));
	};

	const closeSession = (gdsData) => {
		const body = [
			'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com">',
			'  <SOAP-ENV:Body>',
			'    <ns1:EndSession>',
			'      <ns1:Token>' + gdsData.sessionToken + '</ns1:Token>',
			'    </ns1:EndSession>',
			'  </SOAP-ENV:Body>',
			'</SOAP-ENV:Envelope>',
		].join('\n');
		return sendRequest(body, gdsData.profileName);
	};

	const makeSession = (gdsData) => ({
		gdsData: gdsData,
		// TODO: refactor and leave just getGdsData()
		getGdsData: () => gdsData,
		runCmd: (cmd) => runCmd(cmd, gdsData)
			.then(result => ({cmd, ...result})),
	});

	const withSession = (params, action) => {
		const profileName = params.profileName
			|| GdsProfiles.TRAVELPORT.DynApolloProd_2F3K;
		return startSession({profileName}).then(gdsData => {
			const session = makeSession(gdsData);
			return Promise.resolve()
				.then(() => action(session))
				.finally(() => {
					closeSession(gdsData);
				});
		});
	};

	const getFares = (params) => {
		const soapEnv = buildFaresSoapEnv();
		return sendRequest(soapEnv, 'DynApolloProd_2F3K');
	};

	return {
		/** @param {{command: '*R' | string}} reqBody */
		runCmd: (reqBody, gdsData) => runCmd(reqBody.command, gdsData),
		startSession,
		closeSession,
		processPnr,
		withSession,
		getFares,
		getFareRules,
	};
};

module.exports = TravelportClient;
