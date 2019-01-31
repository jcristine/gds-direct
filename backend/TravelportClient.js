let ItineraryParser = require("./Transpiled/Gds/Parsers/Apollo/Pnr/ItineraryParser.js");

let config = require('./Config.js');
let PersistentHttpRq = require('./Utils/PersistentHttpRq.js');
const hrtimeToDecimal = require("./Utils/Misc").hrtimeToDecimal;

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
	}).catch(exc => {
		let obj = typeof exc === 'string' ? new Error(exc) : exc;
		// be careful not to include credentials here
		obj.rqBody = body;
		return Promise.reject(obj);
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

let makeResult = (calledCommands, token) => ({
	calledCommands: calledCommands,
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

/** @param segment = ItineraryParser.parseSegmentLine() */
let makeSellCmd = (segment) => {
	return [
		'0',
		segment.airline,
		segment.flightNumber,
		segment.bookingClass,
		segment.departureDate.raw,
		segment.departureAirport,
		segment.destinationAirport,
		segment.segmentStatus,
		segment.statusNumber,
	].join('');
};

let parseCmdAsItinerary = (dump) => {
	try {
		let parsed = ItineraryParser.parse(dump);
		if (parsed.segments.length > 0) {
			console.log('parsed itinerary', {dump, parsed});
			return {
				bulkCmds: parsed.segments.map(makeSellCmd),
			};
		}
	} catch (exc) {
		// should not happen, but who knows...
	}
	return null;
};

let parseAlias = (cmd) => {
	let type = null, data = null, fetchAll = false, realCmd = '';

	if (cmd.endsWith('/MDA')) {
		realCmd = cmd.slice(0, -4);
		fetchAll = true;
	} else if (cmd === 'MDA') {
		realCmd = 'MD';
		fetchAll = true;
	} else if (data = parseCmdAsItinerary(cmd)) {
		type = 'itinerary';
	} else {
		realCmd = cmd;
	}
	return {
		realCmd: realCmd,
		fetchAll: fetchAll,
		data: data,
		type: type,
	};
};

let fetchAllOutput = async (nextCmd, token) => {
	let pages = [];
	while (nextCmd) {
		let rawOutput = (await runOneCmd(nextCmd, token)).output;
		let [output, pager] = extractPager(rawOutput);
		pages.push(output);
		nextCmd = pager === ')><' ? 'MR' : null;
	}
	return pages.join('\n')
};

let runAndCleanupCmd = async (inputCmd, token) => {
	let {realCmd: cmd, fetchAll, type, data} = parseAlias(inputCmd);
	let cmdsLeft = (data ? data.bulkCmds : null) || [cmd];
	let calledCommands = [];
	for (let cmd of cmdsLeft) {
		let hrtimeStart = process.hrtime();
		let output = fetchAll
			? await fetchAllOutput(cmd, token)
			: (await runOneCmd(cmd, token)).output;
		if (shouldWrap(cmd)) {
			output = wrap(output);
		}
		let hrtimeDiff = process.hrtime(hrtimeStart);
		calledCommands.push({
			cmd: encodeCmdForCms(cmd),
			output: encodeOutputForCms(output),
			duration: hrtimeToDecimal(hrtimeDiff),
		});
	}
	return makeResult(calledCommands, token);
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

/** @param session = at('GdsSessions.js').makeSessionRecord() */
TravelportClient.closeSession = (session) => {
	// TODO: actually close
	return Promise.resolve({message: 'Nah, will expire on it\'s own someday...'});
};

module.exports = TravelportClient;