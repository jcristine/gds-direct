const UnprocessableEntity = require("../Utils/Rej").UnprocessableEntity;
const iqJson = require("../Utils/Misc").iqJson;
const {getConfig} = require('../Config.js');

let callCms = async ({functionName, params}) => {
	let config = await getConfig();
	return iqJson({
		functionName: functionName,
		params: params,
		serviceName: 'gdsDirect',
		credentials: {
			login: config.external_service.cms.login,
			passwd: config.external_service.cms.password,
		},
		url: config.external_service.cms.host,
	});
};

exports.getRequestBriefData = ({requestId}) => {
	return callCms({
		functionName: 'getRequestBriefData',
		params: {requestId},
	}).then(rpcRs => {
		if (!rpcRs.result.success) {
			let error = rpcRs.result.errorMessage
				|| rpcRs.result.msg
				|| 'CMS did not return success=true - ' + JSON.stringify(rpcRs);
			return UnprocessableEntity(error);
		} else {
			return Promise.resolve(rpcRs);
		}
	});
};

exports.reportCmdCalled = async ({cmd, calledDt, agentId, duration}) => {
	return callCms({
		functionName: 'reportCmdCalled',
		params: {cmd, calledDt, agentId, duration},
	});
};