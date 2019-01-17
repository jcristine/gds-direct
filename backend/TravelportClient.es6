let config = require('./../local.config.conf');
let PersistentHttpRq = require('./Utils/PersistentHttpRq.es6');
let RedisData = require('./LibWrappers/RedisData.es6');

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

let sendRequest = (requestBody) =>
	PersistentHttpRq({
		url: endpoint,
		headers: {
			'Authorization': 'Basic ' + config.apolloAuthToken,
		},
		body: requestBody,
	}).then(resp => resp.body);

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
	});
};

let extractPager = (text) => {
	let [_, clean, pager] =
		text.match(/([\s\S]*)(\)\>\<)$/) ||
		text.match(/([\s\S]*)(\>\<)$/) ||
		[null, text, null];
	return [clean, pager];
};

let shouldWrap = (cmd) => {
	let wrappedCmds = ['FS', 'MORE*', 'QC', '*HTE', 'HOA', 'HOC', 'FQN', 'A', '$D'];
	let alwaysWrap = false;
	return alwaysWrap
		|| wrappedCmds.some(wCmd => cmd.startsWith(wCmd));
};

let wrap = function(text) {
	let result = [];
	for (let line of text.split('\n')) {
		for (let chunk of (line.match(/.{1,64}/g) || [''])) {
			result.push(chunk);
		}
	}
	if (result.slice(-1)[0].length === 64) {
		result.push('');
	}
	return result.join('\n');
};

let makeSessionData = token => !token ? null :{
	profileName: gdsProfile,
	externalToken: token,
};

/**
 * @param '$BN1|2*INF'
 * @return '$BN1+2*INF'
 */
let encodeCmdForCms = ($cmd) =>
	$cmd.replace(/\|/g, '+').replace(/@/g, '¤');

let encodeOutputForCms = ($dump) =>
	$dump.replace(/\|/g, '+').replace(/;/g, '·');

let makeResult = (cmd, output, token) => ({
	calledCommands: [{
		cmd: encodeCmdForCms(cmd),
		output: encodeOutputForCms(output),
	}],
	messages: [],
	clearScreen: false,
	sessionInfo: {
		canCreatePq: false,
		canCreatePqErrors: ['Not supported in RBS-free connection'],
		area: 'A',
		pcc: '1O3K',
	},
	gdsSessionData: makeSessionData(token),
});

let runAndCleanupCmd = (cmd, token) => {
	let fetchAll = false;
	if (cmd.endsWith('/MDA')) {
		cmd = cmd.slice(0, -4);
		fetchAll = true;
	} else if (cmd === 'MDA') {
		cmd = 'MD';
		fetchAll = true;
	}
	let fullOutput = '';
	let getNextPage = (nextCmd) => runOneCmd(nextCmd, token)
		.then((parsedResp) => {
			let rawOutput = parsedResp.output;
			let [output, pager] = extractPager(rawOutput);

			if (fetchAll) {
				if (shouldWrap(cmd)) {
					output = wrap(output);
				}
				fullOutput += output;
				if (pager === ')><') {
					return getNextPage('MR', token);
				} else {
					return makeResult(cmd, fullOutput, token);
				}
			} else {
				if (shouldWrap(cmd)) rawOutput = wrap(rawOutput);
				return makeResult(cmd, rawOutput + '\n', token);
			}
		});
	return getNextPage(cmd);
};

/** @param {{command: '*R', gds: 'apollo', language: 'sabre', agentId: '6206'}} reqBody */
let TravelportClient = (reqBody) => {
	let runInputCmd = ({sessionToken}) => {
		let cmd = reqBody.command;
		return runAndCleanupCmd(cmd, sessionToken);
	};
	return {
		runInputCmd: runInputCmd,
	};
};

TravelportClient.startSession = startSession;

module.exports = TravelportClient;