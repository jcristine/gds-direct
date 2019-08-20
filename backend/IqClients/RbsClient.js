
const RbsClientLib = require('dynatech-client-component-rbs');

const {getConfig} = require("../Config.js");

const callRbs = async (functionName, params) => {
	const config = await getConfig();
	const rbs = RbsClientLib({
		login: 'CMS',
		RBS_PASSWORD: config.RBS_PASSWORD,
		RANDOM_KEY: process.env.RANDOM_KEY,
	});
	return rbs.callRbs(functionName, params);
};

const RbsClient = {};

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
