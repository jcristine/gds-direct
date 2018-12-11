
let querystring = require('querystring');
let MultiLevelMap = require('./Utils/MultiLevelMap.es6');
let PersistentHttpRq = require('./Utils/PersistentHttpRq.es6');

let callRbs = (functionName, params) => {
	let logId = 'rbs.5bf6e431.9577485';
	//let rbsUrl = 'http://st-rbs.sjager.php7.dyninno.net/jsonExternalInterface.php?log_id=' + logId;
	let rbsUrl = 'http://rbs-dev.aklesuns.php7.dyninno.net/jsonExternalInterface.php?log_id=' + logId;
	let formParams = {
		credentials: JSON.stringify({login: 'CMS', password: 'qwerty'}),
		functionName: functionName,
		params: JSON.stringify(params),
	};
	return PersistentHttpRq({
		url: rbsUrl,
		body: querystring.stringify(formParams),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	}).then(respRec => {
		let body = respRec.body;
		let resp;
		try {
			resp = JSON.parse(body);
		} catch (exc) {
			return Promise.reject('Could not parse RBS ' + functionName + ' json response - ' + body);
		}
		if (resp.status !== 'OK' || !resp.result || !resp.result.response_code) {
			return Promise.reject('Unexpected RBS response format - ' + body);
		} else if (![1,2,3].includes(resp.result.response_code)) {
			let rpcErrors = resp.result.errors;
			return Promise.reject('RBS service responded with error - ' + resp.result.response_code + ' - ' + JSON.stringify(rpcErrors));
		} else if (resp.result.response_code == 3) {
			let rpcErrors = resp.result.errors;
			let messages = resp.result.result.messages;
			return Promise.reject('RBS service cannot satisfy your request - ' + JSON.stringify(messages) + ' - ' + JSON.stringify(rpcErrors));
		} else {
			return Promise.resolve(resp);
		}
	});
};

let agentToGdsToLeadToSessionId = MultiLevelMap();

let getLeadData = (travelRequestId) => {
	return !travelRequestId ? null : {
		// TODO: fetch from CMS
		leadId: +travelRequestId || null,
		leadOwnerId: null,
		leadUrl: 'https://cms.asaptickets.com/leadInfo?id=' + travelRequestId,
		projectName: null,
		paxNumAdults: 1,
		paxNumChildren: 0,
		paxNumInfants: 0,
	};
};

let validate = (sup) => {
	try {
		let access = {
			some: (value, msg = '') => {
				if (value === undefined || value === null) {
					throw new Error('Mandatory value absent ' + value + ' ' + msg);
				} else {
					return value;
				}
			},
		};
		return Promise.resolve(sup(access));
	} catch (exc) {
		exc.message = 'Invalid params - ' + exc.message;
		return Promise.reject(exc);
	}
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
	}).then(result => ({rbsSessionId: sessionId, ...result.result.result}));

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
		getPqItinerary: () => validate(({some}) => ({
			pqTravelRequestId: some(reqBody.pqTravelRequestId, 'travel request id is empty'),
			sessionId: some(getSessionId(), 'session not found - ' + [agentId, gds, travelRequestId]),
		})).then(valid => callRbs('terminal.getPqItinerary', {
			sessionId: valid.sessionId,
			gds: gds,
			context: getLeadData(valid.pqTravelRequestId),
		})).then(rbsResp => rbsResp.result.result),
		importPq: () => validate(({some}) => ({
			pqTravelRequestId: some(reqBody.pqTravelRequestId, 'travel request id is empty'),
			sessionId: some(getSessionId(), 'session not found - ' + [agentId, gds, travelRequestId]),
		})).then(valid => callRbs('terminal.importPq', {
			sessionId: valid.sessionId,
			gds: gds,
			context: getLeadData(valid.pqTravelRequestId),
		})).then(rbsResp => rbsResp.result.result),
	};
};
