
let querystring = require('querystring');
let PersistentHttpRq = require('./Utils/PersistentHttpRq.es6');
let RedisData = require('./LibWrappers/RedisData.es6');

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

/** @param {{command: '*R', gds: 'apollo', language: 'sabre', agentId: '6206'}} reqBody */
let RbsClient = (reqBody) => {
	let {gds, travelRequestId} = reqBody;
	return {
		runInputCmd: ({rbsSessionId}) => callRbs('terminal.runCommand', {
			gds: gds,
			command: reqBody.command,
			dialect: reqBody.language,
			sessionId: rbsSessionId,
			context: getLeadData(travelRequestId),
		}).then(result => result.result.result),
		getPqItinerary: ({rbsSessionId}) => callRbs('terminal.getPqItinerary', {
			sessionId: rbsSessionId,
			gds: gds,
			context: getLeadData(reqBody.pqTravelRequestId),
		}).then(rbsResp => rbsResp.result.result),
		importPq: ({rbsSessionId}) => callRbs('terminal.importPq', {
			sessionId: rbsSessionId,
			gds: gds,
			context: getLeadData(reqBody.pqTravelRequestId),
		}).then(rbsResp => rbsResp.result.result),
	};
};

RbsClient.startSession = ({gds, agentId}) => {
	return callRbs('terminal.startSession', {
		gds: gds, agentId: agentId,
	}).then(rbsResp => ({
		rbsSessionId: rbsResp.result.result.sessionId,
	}));
};

/** @param session = at('GdsSessions.es6').makeSessionRecord() */
RbsClient.closeSession = (session) => {
	return callRbs('terminal.endSession', {
		gds: session.context.gds,
		sessionId: session.sessionData.rbsSessionId,
	});
};

module.exports = RbsClient;
