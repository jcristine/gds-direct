const UnprocessableEntity = require("klesun-node-tools/src/Rej").UnprocessableEntity;
const iqJson = require("../Utils/TmpLib").iqJson;
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
	}).then(rpcRs => {
		if (rpcRs.result.success === 0) {
			let error = rpcRs.result.errorMessage
				|| rpcRs.result.msg
				|| 'CMS did not return success=true - ' + JSON.stringify(rpcRs);
			return UnprocessableEntity(error);
		} else {
			return Promise.resolve(rpcRs);
		}
	});
};

let getRequestBriefData = ({requestId}) => {
	return callCms({
		functionName: 'getRequestBriefData',
		params: {requestId},
	});
};

/**
 * @return {Promise<{
 *     result: {
 *         data: {
 *             pcc: '2F3K',
 *             segments: [{
 *                 airline: 'AA',
 *                 flightNumber: '1234',
 *                 bookingClass: 'S',
 *                 departureDate: '2019-05-13',
 *                 departureAirport: 'JFK',
 *                 destinationAirport: 'MNL',
 *                 segmentStatus: 'NN',
 *                 seatCount: '1',
 *             }],
 *         },
 *     },
 * }>}
 */
let getItineraryData = ({itineraryId}) => {
	return callCms({
		functionName: 'getItineraryData',
		params: {itineraryId},
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
					leadUrl: 'https://cms.asaptickets.com/leadInfo?rId=' + travelRequestId,
					paxNumAdults: ageGroupToCnt['adult'] || 0,
					paxNumChildren: ageGroupToCnt['child'] || 0,
					paxNumInfants: ageGroupToCnt['infant'] || 0,
				};
			})
			.catch(exc => ({
				error: 'CMS error - ' + exc,
				leadId: travelRequestId,
				leadUrl: 'https://cms.asaptickets.com/leadInfo?rId=' + travelRequestId,
				debug: exc + '',
			}));

exports.getRequestBriefData = getRequestBriefData;
exports.getItineraryData = getItineraryData;
/** in RBS-compatible format */
exports.getLeadData = getLeadData;

exports.reportCmdCalled = async ({cmd, calledDt, agentId, duration}) => {
	return callCms({
		functionName: 'reportCmdCalled',
		params: {cmd, calledDt, agentId, duration},
	});
};