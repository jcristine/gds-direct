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

let getRequestBriefData = ({requestId}) => {
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

let getLeadData = async (travelRequestId) =>
	!travelRequestId
		? Promise.resolve(null)
		: getRequestBriefData({requestId: travelRequestId})
			.then(rpcRs => {
				let cmsData = rpcRs.result.data;
				let ageGroupToCnt = {};
				for (let group of cmsData.requestedAgeGroups) {
					ageGroupToCnt[group.ageGroup] = group.quantity;
				}
				return {
					leadId: travelRequestId,
					leadOwnerId: cmsData.leadOwnerId,
					projectName: cmsData.projectName,
					leadUrl: 'https://cms.asaptickets.com/leadInfo?id=' + travelRequestId,
					paxNumAdults: ageGroupToCnt['adult'] || 0,
					paxNumChildren: ageGroupToCnt['child'] || 0,
					paxNumInfants: ageGroupToCnt['infant'] || 0,
				};
			})
			.catch(exc => ({
				leadId: travelRequestId,
				leadUrl: 'https://cms.asaptickets.com/leadInfo?id=' + travelRequestId,
				debug: exc + '',
			}));

exports.getRequestBriefData = getRequestBriefData;
/** in RBS-compatible format */
exports.getLeadData = getLeadData;

exports.reportCmdCalled = async ({cmd, calledDt, agentId, duration}) => {
	return callCms({
		functionName: 'reportCmdCalled',
		params: {cmd, calledDt, agentId, duration},
	});
};