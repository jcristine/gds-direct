
let request = require('request');
let MultiLevelMap = require('./Utils/MultiLevelMap.es6');
let TerminalService = require('./Transpiled/App/Services/TerminalService.es6');

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

let agentToGdsToLeadToSessionId = MultiLevelMap();

let getLeadData = (travelRequestId) => {
	return !travelRequestId ? null : {
		// TODO: fetch from CMS
		leadId: travelRequestId,
		leadOwnerId: null,
		leadUrl: 'https://cms.asaptickets.com/leadInfo?id=' + travelRequestId,
		projectName: null,
		paxNumAdults: 1,
		paxNumChildren: 0,
		paxNumInfants: 0,
	};
};

/** @param {{command: '*R', gds: 'apollo', language: 'sabre', agentId: '6206'}} reqBody */
module.exports = (reqBody) => {
	let {agentId, gds, travelRequestId} = reqBody;
	let getSessionId = () => agentToGdsToLeadToSessionId.get([agentId, gds, travelRequestId]);
	let setSessionId = (sessionId) => agentToGdsToLeadToSessionId.set([agentId, gds, travelRequestId], sessionId);

	let runInSession = ({command, dialect, sessionId}) => callRbs('terminal.runCommand', {
		gds: gds,
		command: command,
		dialect: dialect,
		sessionId: sessionId,
		context: getLeadData(reqBody.travelRequestId),
	}).then(rbsResp => {
		let termSvc = new TerminalService(gds, agentId, travelRequestId);
        return termSvc.addHighlighting(command, dialect, rbsResp);
    }).then(result => ({rbsSessionId: sessionId, ...result}));

	let runInNewSession = ({command, dialect}) => callRbs('terminal.startSession', {
		gds: gds, agentId: 6206,
	}).then(rbsResp => {
		let sessionId = rbsResp.result.result.sessionId;
		setSessionId(sessionId);
		return runInSession({command, dialect, sessionId})
			.then(data => Object.assign({}, data, {
				startNewSession: true,
				userMessages: ['New session started'],
			}));
	});

	return {
		getSessionId: getSessionId,
		runInputCmd: () => {
			let sessionId = getSessionId();
			let {command, language: dialect} = reqBody;
			return !sessionId
				? runInNewSession({command, dialect})
				: runInSession({command, dialect, sessionId})
					.catch(exc => runInNewSession(reqBody)
						.then(data => Object.assign({}, data, {
							userMessages: [('Session aborted - ' + exc).slice(0, 800) + '...\n']
								.concat(data.userMessages || []),
						})));
		},
	};
};
