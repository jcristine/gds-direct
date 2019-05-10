let {getTravelport} = require("../Repositories/GdsProfiles.js");
let {LoginTimeOut, BadGateway} = require("../Utils/Rej");
let {escapeXml, parseXml} = require("../Utils/Misc.js");
let PersistentHttpRq = require('../Utils/PersistentHttpRq.js');
const GdsProfiles = require("../Repositories/GdsProfiles");
const Conflict = require("../Utils/Rej").Conflict;

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
let endpoint = 'https://americas.webservices.travelport.com/B2BGateway/service/XMLSelect';
//let endpoint = 'https://emea.webservices.travelport.com/B2BGateway/service/XMLSelect';
//let endpoint = 'https://apac.webservices.travelport.com/B2BGateway/service/XMLSelect';

let sendRequest = async (requestBody, profileName) => {
	let profileData = await getTravelport(profileName);
	let authTokenSrc = profileData.username + ':' + profileData.password;
	let authToken = Buffer.from(authTokenSrc).toString('base64');
	return PersistentHttpRq({
		url: endpoint,
		headers: {
			'Authorization': 'Basic ' + authToken,
		},
		body: requestBody,
	}).then(resp => resp.body);
};

let startSession = (params) => {
	let profileName = params.profileName;
	let body = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:BeginSession><ns1:Profile>${profileName}</ns1:Profile></ns1:BeginSession></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
	return sendRequest(body, profileName).then(resp => {
		let sessionToken = parseXml(resp).querySelectorAll('BeginSessionResult')[0].textContent;
		if (!sessionToken) {
			return BadGateway('Failed to extract session token from Travelport response - ' + resp);
		} else {
			return Promise.resolve({sessionToken: sessionToken, profileName: profileName});
		}
	});
};

let runCmd = (cmd, gdsData) => {
	let token = gdsData.sessionToken;
	let profileName = gdsData.profileName;
	let body = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>` + token + `</ns1:Token><ns1:Request>` + escapeXml(cmd) + `</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
	return sendRequest(body, profileName).then(resp => {
		let resultTag = parseXml(resp).querySelectorAll('SubmitTerminalTransactionResult')[0];
		if (resultTag) {
			return {output: resultTag.textContent};
		} else {
			return BadGateway('Unexpected Travelport response format - ' + resp);
		}
	}).catch(exc => {
		if ((exc + '').indexOf('Could not locate Session Token Information') > -1) {
			return LoginTimeOut('Session token expired');
		} else if ((exc + '').indexOf('Transaction already in progress') > -1) {
			let error = 'Another command is still in progress - no action taken.\n' +
				'To restart session use _⚙ (Gear) -> Default PCC_.\n' +
				'Note, reloading page does not reduce waiting time on hanging availability (60 s.).';
			return Conflict(error, {isOk: true});
		} else {
			let obj = typeof exc === 'string' ? new Error(exc) : exc;
			// for debug, be careful not to include credentials here
			obj.rqBody = body;
			return Promise.reject(obj);
		}
	});
};

/** @param {{command: '*R', gds: 'apollo', language: 'sabre', agentId: '6206'}} reqBody */
let TravelportClient = (reqBody) => {
	return {
		runCmd: (gdsData) => runCmd(reqBody.command, gdsData),
	};
};

TravelportClient.startSession = startSession;

/** @param session = at('GdsSessions.js').makeSessionRecord() */
TravelportClient.closeSession = (gdsData) => {
	let body = [
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

let makeSession = (gdsData) => ({
	gdsData: gdsData,
	runCmd: (cmd) => runCmd(cmd, gdsData)
		.then(result => ({cmd, ...result})),
});

TravelportClient.withSession = (params, action) => {
	let profileName = params.profileName
		|| GdsProfiles.TRAVELPORT.DynApolloProd_2F3K;
	return startSession({profileName}).then(gdsData => {
		let session = makeSession(gdsData);
		return Promise.resolve()
			.then(() => action(session))
			.finally(() => {
				TravelportClient.closeSession(gdsData);
			});
	});
};

TravelportClient.getFares = (params) => {
	let soapEnv = [
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
	return sendRequest(soapEnv, 'DynApolloProd_2F3K');
};

module.exports = TravelportClient;