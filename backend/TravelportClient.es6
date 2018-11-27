
let https = require('https');
let jsdom = require('jsdom');
let config = require('./../local.config.conf');
let Utils = require('./Utils/Utils.es6');

let agentToToken = Utils.MultiLevelMap();

let agent = new https.Agent({
	keepAlive: true,
	keepAliveMsecs: 4 * 60 * 1000, // 4 minutes
	maxSockets: 1,
});

let url = 'https://emea.webservices.travelport.com/B2BGateway/service/XMLSelect';
// let url = 'https://americas.webservices.travelport.com/B2BGateway/service/XMLSelect';
// let url = 'https://apac.webservices.travelport.com/B2BGateway/service/XMLSelect';

let sendRequest = (requestBody) => new Promise((resolve, reject) => {
	let headers = {
		'Authorization': 'Basic ' + config.apolloAuthToken,
	};
	let req = https.request(url, {
		headers: headers,
		method: 'POST',
		agent: agent,
	}, (res) => {
		let responseBody = '';
		res.setEncoding('utf8');
	    res.on('data', (chunk) => responseBody += chunk);
	    res.on('end', () => {
			if (res.statusCode != 200) {
				reject('Http request to Travelport failed - ' + res.statusCode + ' - ' + responseBody);
			} else {
				resolve(responseBody);
			}
	    });
	});
	req.on('error', (e) => reject('Failed to make request - ' + e));
	req.end(requestBody);
});

let startSession = () => {
	let body = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:BeginSession><ns1:Profile>DynApolloProd_1O3K</ns1:Profile></ns1:BeginSession></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
	return sendRequest(body).then(resp => {
		let xmlDoc = new jsdom.JSDOM(resp, {contentType: 'text/xml'});
		let sessionToken = xmlDoc.window.document.querySelectorAll('BeginSessionResult')[0].innerHTML;
		return {
			sessionToken: sessionToken,
		};
	});
};

let runOneCmd = (cmd, token) => {
	let body = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://webservices.galileo.com"><SOAP-ENV:Body><ns1:SubmitTerminalTransaction><ns1:Token>` + token + `</ns1:Token><ns1:Request>` + cmd + `</ns1:Request><ns1:IntermediateResponse></ns1:IntermediateResponse></ns1:SubmitTerminalTransaction></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
	return sendRequest(body).then(resp => {
		let xmlDoc = new jsdom.JSDOM(resp, {contentType: 'text/xml'});
		let resultTag = xmlDoc.window.document.querySelectorAll('SubmitTerminalTransactionResult')[0];
		if (resultTag) {
			return {output: resultTag.innerHTML};
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
    let wrappedCmds = ['FS', 'MORE*', 'QC', '*HTE', 'HOA', 'HOC', 'FQN', 'A'];
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

exports.runInputCmd = (reqBody) => {
	let cmd = reqBody.command;
	let agentId = reqBody.agentId;
	let fullOutput = '';
	let fetchAll = true;
	let getNextPage = (nextCmd, token) => runOneCmd(nextCmd, token).then((parsedResp) => {
		if (parsedResp.error) {
			return Promise.reject('failed to run command though http - ' + parsedResp.error);
		} else {
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
					return {output: fullOutput};
				}
			} else {
				if (shouldWrap(cmd)) rawOutput = wrap(rawOutput);
				return {output: rawOutput + '\n'};
			}
		}
	});
	let runInNewSession = (cmd) => startSession().then((resp) => {
		let token = resp.sessionToken;
		agentToToken.set([agentId], token);
		return getNextPage(cmd, token)
			.then(data => Object.assign({}, data, {
				startNewSession: true,
				userMessages: ['New session started'],
			}));
	});
	let travelportToken = agentToToken.get([agentId]);
	if (travelportToken) {
		return getNextPage(cmd, travelportToken)
			.catch(exc => runInNewSession(cmd)
				.then(data => Object.assign({}, data, {
					userMessages: [('Session aborted - ' + exc).slice(0, 800) + '...\n']
						.concat(data.userMessages || []),
				})));
	} else {
		return runInNewSession(cmd);
	}
};