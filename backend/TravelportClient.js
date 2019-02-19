let {LoginTimeOut} = require("./Utils/Rej");
let Redis = require('./LibWrappers/Redis.js');
let config = require('./Config.js');
let PersistentHttpRq = require('./Utils/PersistentHttpRq.js');

/**
 * they are all physically located in USA, Atlanta (in same building)
 * I guess different urls are kept just for compatibility now
 * it is said in their docs, though, that it is possible to setup a separate endpoint for a company:
 * @see https://support.travelport.com/webhelp/GWS/Content/Overview/Getting_Started/Connecting_to_GWS.htm
 * due to geo-latency, requests from Europe to USA are taking at least 100 ms overhead on dev
 */
let endpoint = 'https://americas.webservices.travelport.com/B2BGateway/service/XMLSelect';
//let endpoint = 'https://emea.webservices.travelport.com/B2BGateway/service/XMLSelect';
//let endpoint = 'https://apac.webservices.travelport.com/B2BGateway/service/XMLSelect';

let sendRequest = async (requestBody) => {
	let redisKey = Redis.keys.USER_TO_TMP_SETTINGS + ':6206';
	let authToken = await Redis.client.hget(redisKey, 'apolloAuthToken');
	if (!authToken) {
		return Promise.reject('Apollo auth credentials not set');
	}
	return PersistentHttpRq({
		url: endpoint,
		headers: {
			'Authorization': 'Basic ' + authToken,
		},
		body: requestBody,
	}).then(resp => resp.body);
};

let gdsProfile = 'DynApolloProd_1O3K';

let parseXml = (xml) => {
	let jsdom = require('jsdom');
	let jsdomObj = new jsdom.JSDOM(xml, {contentType: 'text/xml'});
	return jsdomObj.window.document;
};

let startSession = () => {
	let body = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:BeginSession><ns1:Profile>${gdsProfile}</ns1:Profile></ns1:BeginSession></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
	return sendRequest(body).then(resp => {
		let sessionToken = parseXml(resp).querySelectorAll('BeginSessionResult')[0].textContent;
		if (!sessionToken) {
			return Promise.reject('Failed to extract session token from Travelport response - ' + resp);
		} else {
			return Promise.resolve({sessionToken: sessionToken});
		}
	});
};

let runOneCmd = (cmd, token) => {
	let body = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>` + token + `</ns1:Token><ns1:Request>` + cmd + `</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
	return sendRequest(body).then(resp => {
		let resultTag = parseXml(resp).querySelectorAll('SubmitTerminalTransactionResult')[0];
		if (resultTag) {
			return {output: resultTag.textContent};
		} else {
			return Promise.reject('Unexpected Travelport response format - ' + resp);
		}
	}).catch(exc => {
		if ((exc + '').indexOf('Could not locate Session Token Information') > -1) {
			return LoginTimeOut('Session token expired');
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
		runCmd: (gdsData) => runOneCmd(reqBody.command, gdsData.sessionToken),
	};
};

TravelportClient.startSession = startSession;

/** @param session = at('GdsSessions.js').makeSessionRecord() */
TravelportClient.closeSession = (session) => {
	// TODO: actually close
	return Promise.resolve({message: 'Nah, will expire on it\'s own someday...'});
};

module.exports = TravelportClient;