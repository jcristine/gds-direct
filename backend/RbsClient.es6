
let request = require('request');
let Utils = require('./Utils/Utils.es6');

let agentToGdsToLeadToSessionId = Utils.MultiLevelMap();

let callRbs = (functionName, params) => new Promise((resolve, reject) => {
	let logId = 'rbs.5bf6e431.9577485';
	let rbsUrl = 'http://st-rbs.sjager.php7.dyninno.net/jsonExternalInterface.php?log_id=' + logId;
	let formParams = {
		credentials: JSON.stringify({login: 'CMS', password: 'qwerty'}),
		functionName: functionName,
		params: JSON.stringify(params),
	};
	return request.post({
		url: rbsUrl, form: formParams,
	}, (err, httpResponse, body) => {
		if (err || httpResponse.statusCode !== 200) {
			reject('Could not connect to RBS - ' + httpResponse.statusCode + ' - ' + err + ' - ' + body);
		}
		let resp;
		try {
			resp = JSON.parse(body);
		} catch (exc) {
			reject('Could not parse RBS ' + functionName + ' json response - ' + body);
		}
		if (resp.status !== 'OK' || !resp.result || !resp.result.response_code) {
			reject('Unexpected RBS response format - ' + JSON.stringify(resp));
		} else if (![1,2,3].includes(resp.result.response_code)) {
			let rpcErrors = resp.result.errors;
			reject('RBS service responded with error - ' + resp.result.response_code + ' - ' + JSON.stringify(rpcErrors));
		} else if (resp.result.response_code == 3) {
			let rpcErrors = resp.result.errors;
			let messages = resp.result.result.messages;
			reject('RBS service cannot satisfy your request - ' + JSON.stringify(messages) + ' - ' + JSON.stringify(rpcErrors));
		} else {
			resolve(resp);
		}
	});
});

let runInSession = (reqBody, sessionId) => callRbs('terminal.runCommand', {
	gds: reqBody.gds,
	command: reqBody.command,
	dialect: reqBody.language,
	sessionId: sessionId,
}).then(rbsResp => {
	return {
		output: rbsResp.result.result.calledCommands
			.map(call => '>' + call.cmd + '\n' + call.output)
			.join('\n______________________\n'),
		tabCommands: rbsResp.result.result.calledCommands
			.flatMap(call => call.tabCommands),
		clearScreen: rbsResp.result.result.clearScreen,
		canCreatePq: rbsResp.result.result.sessionInfo.canCreatePq,
		canCreatePqErrors: rbsResp.result.result.sessionInfo.canCreatePqErrors,
		area: rbsResp.result.result.sessionInfo.area,
		pcc: rbsResp.result.result.sessionInfo.pcc,
	};
});

let runInNewSession = (reqBody) => callRbs('terminal.startSession', {
	gds: reqBody.gds, agentId: 6206,
}).then(rbsResp => {
	let {agentId, gds, leadId} = reqBody;
	let sessionId = rbsResp.result.result.sessionId;
	agentToGdsToLeadToSessionId.set([agentId, gds, leadId], sessionId);
	return runInSession(reqBody, sessionId)
		.then(data => Object.assign({}, data, {
			startNewSession: true,
			userMessages: ['New session started'],
		}));
});

/** @param {{command: '*R', gds: 'apollo', language: 'sabre', agentId: '6206'}} reqBody */
exports.runInputCmd = (reqBody) => {
	let {agentId, gds, leadId} = reqBody;
	let sessionId = agentToGdsToLeadToSessionId.get([agentId, gds, leadId]);
	if (sessionId) {
		return runInSession(reqBody, sessionId)
			.catch(exc => runInNewSession(reqBody)
				.then(data => Object.assign({}, data, {
					userMessages: [('Session aborted - ' + exc).slice(0, 800) + '...\n']
						.concat(data.userMessages || []),
				})));
	} else {
		return runInNewSession(reqBody);
	}
};