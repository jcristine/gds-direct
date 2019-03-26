const getLeadData = require("./CmsClient").getLeadData;

const iqJson = require("../Utils/Misc").iqJson;

let {LoginTimeOut, BadRequest, BadGateway, NotImplemented, UnprocessableEntity} = require("../Utils/Rej.js");
let {getConfig} = require("../Config.js");
let Crypt;
try {
	Crypt = require("../../node_modules/dynatech-client-component/lib/Crypt.js").default;
} catch (exc) {
	// no access on test environment in gitlab
	Crypt = class {
		construct() {
			throw new Error('Cannot instantiate Crypt since it could not be required. Is this test environment? ' + exc.getMessage());
		}
	};
}

let callRbs = async (functionName, params) => {
	let logId = 'rbs.5bf6e431.9577485';
	let config = await getConfig();
	let url = config.production
		? 'http://rbs-asaptickets.lan.dyninno.net/jsonExternalInterface.php?log_id=' + logId
		// : 'http://st-rbs.sjager.php7.dyninno.net/jsonExternalInterface.php?log_id=' + logId;
		: 'http://rbs-st.aklesuns.php7.dyninno.net/jsonExternalInterface.php?log_id=' + logId;

	let rbsPassword = config.RBS_PASSWORD;
	if (!rbsPassword) {
		return NotImplemented('RBS password not defined in env');
	}
	let ec = new Crypt(process.env.RANDOM_KEY, 'des-ede3');
	let credentials = {login: 'CMS', password: ec.encryptToken(rbsPassword)};

	return iqJson({url, credentials, functionName, params}).then(resp => {
		if (!resp.result || !resp.result.response_code) {
			return Promise.reject('Unexpected RBS response format - ' + JSON.stringify(resp));
		} else if (![1,2,3].includes(resp.result.response_code)) {
			let rpcErrors = resp.result.errors;
			let errorStr = resp.result.response_code + ' - ' + JSON.stringify(rpcErrors);
			if (resp.result.response_code == 104) {
				return BadRequest('RBS says passed params are invalid - ' + errorStr);
			} else {
				return UnprocessableEntity('RBS returned error - ' + errorStr);
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

let RbsClient = (reqBody) => {
	let {gds} = reqBody;
	return {
		runInputCmd: async ({rbsSessionId}) => callRbs('terminal.runCommand', {
			gds: gds,
			command: reqBody.command,
			dialect: reqBody.language,
			sessionId: rbsSessionId,
			context: null,
		}).then(result => result.result.result).catch(exc => {
			if ((exc + '').indexOf('Session token expired') > -1) {
				return LoginTimeOut('Session token expired');
			} else {
				return Promise.reject(exc);
			}
		}),
		getPqItinerary: async ({rbsSessionId, leadId}) => callRbs('terminal.getPqItinerary', {
			sessionId: rbsSessionId,
			gds: gds,
			context: await getLeadData(leadId),
		}).then(rbsResp => rbsResp.result.result),
		importPq: async ({rbsSessionId, leadId}) => callRbs('terminal.importPq', {
			sessionId: rbsSessionId,
			gds: gds,
			context: {
				// no need to pas paxes for validation, since we already checked them in
				// getPqItinerary, but leadId is mandatory in RBS for importPq/getPqItinerary
				leadId: leadId,
			},
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

/**
 * @param {IImportPnrFromDumpsRq} params
 * @return {Promise<IImportPnrFromDumpsRs>}
 */
RbsClient.importPnrFromDumps = (params) => {
	return callRbs('pnr.importPnrFromDumps', params);
};

RbsClient.getSessionLimits = (params = {}) => {
	return callRbs('info.getSessionLimits', params);
};

RbsClient.reportCreatedPnr = (params) => {
	return callRbs('pnr.reportCreated', params);
};

RbsClient.getMultiPccTariffRules = (params = {}) => {
	return callRbs('search.getMultiPccTariffRules', params);
};

RbsClient.reportMultiPccTariffResult = (params) => {
	return callRbs('search.reportMultiPccTariffResult', params);
};

module.exports = RbsClient;
