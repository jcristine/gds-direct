let {LoginTimeOut, BadRequest, BadGateway, NotImplemented} = require("../Utils/Rej.js");
let Config = require("../Config.js");
let Crypt = require("../../node_modules/dynatech-client-component/lib/Crypt.js").default;

let querystring = require('querystring');
let PersistentHttpRq = require('../Utils/PersistentHttpRq.js');

let callRbs = (functionName, params) => {
	let logId = 'rbs.5bf6e431.9577485';
	let rbsUrl = Config.production
		? 'http://rbs-asaptickets.lan.dyninno.net/jsonExternalInterface.php?log_id=' + logId
		: 'http://st-rbs.sjager.php7.dyninno.net/jsonExternalInterface.php?log_id=' + logId;
		// : 'http://rbs-dev.aklesuns.php7.dyninno.net/jsonExternalInterface.php?log_id=' + logId;

	let rbsPassword = Config.RBS_PASSWORD;
	if (!rbsPassword) {
		return Promise.reject('RBS password not defined in env');
	}

	let ec = new Crypt(process.env.RANDOM_KEY, 'des-ede3');
	let formParams = {
		credentials: JSON.stringify({
			login: 'CMS',
			password: ec.encryptToken(rbsPassword),
		}),
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
			return BadGateway('Could not parse RBS ' + functionName + ' json response - ' + body);
		}
		if (resp.status !== 'OK' || !resp.result || !resp.result.response_code) {
			return Promise.reject('Unexpected RBS response format - ' + body);
		} else if (![1,2,3].includes(resp.result.response_code)) {
			let rpcErrors = resp.result.errors;
			let errorStr = resp.result.response_code + ' - ' + JSON.stringify(rpcErrors);
			if (resp.result.response_code == 104) {
				return BadRequest('RBS says passed params are invalid - ' + errorStr);
			} else {
				return BadGateway('RBS returned error - ' + resp.result.response_code + ' - ' + errorStr);
			}
		} else if (resp.result.response_code == 3) {
			let rpcErrors = resp.result.errors || [];
			let messages = (resp.result.result || {}).messages || [];
			return NotImplemented('RBS cant satisfy - ' + JSON.stringify(messages.concat(rpcErrors)));
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
		}).then(result => result.result.result).catch(exc => {
			if ((exc + '').indexOf('Session token expired') > -1) {
				return LoginTimeOut('Session token expired');
			} else {
				return Promise.reject(exc);
			}
		}),
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
		/** @param {IRebuildItineraryRq} params */
		rebuildItinerary: (params) => callRbs('terminal.rebuildItinerary', params)
			.then(rbsResp => rbsResp.result.result),
	};
};

RbsClient.startSession = ({gds, agentId}) => {
	return callRbs('terminal.startSession', {
		gds: gds, agentId: agentId,
	}).then(rbsResp => ({
		rbsSessionId: rbsResp.result.result.sessionId,
	}));
};

/** @param session = at('GdsSessions.js').makeSessionRecord() */
RbsClient.closeSession = (session) => {
	return callRbs('terminal.endSession', {
		gds: session.context.gds,
		sessionId: session.gdsData.rbsSessionId,
	});
};

/**
 * @param {IGetTariffDisplayRq} params
 * @return Promise<IGetTariffDisplayRs>
 */
RbsClient.getTariffDisplay = (params) => {
	return callRbs('terminal.getTariffDisplay', params);
};

module.exports = RbsClient;
