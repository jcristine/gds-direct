
let TravelportClient = require('./../TravelportClient.js');
const GdsSessions = require("../Repositories/GdsSessions");
const SessionStateProcessor = require("../Transpiled/Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessor");
const AreaSettings = require("../Repositories/AreaSettings");
const logExc = require("../LibWrappers/FluentLogger").logExc;
const nonEmpty = require("../Utils/Rej").nonEmpty;
const hrtimeToDecimal = require("../Utils/Misc").hrtimeToDecimal;

let addSessionInfo = async (session, rbsResult) => {
	let gds = session.context.gds;
	if (gds !== 'apollo') {
		return session;
	}
	let hrtimeStart = process.hrtime();
	let fullState = await GdsSessions.getFullState(session);
	for (let rec of rbsResult.calledCommands) {
		let {cmd, output} = rec;
		fullState = SessionStateProcessor
			.updateFullState(cmd, output, gds, fullState);
		rec.type = fullState.areas[fullState.area].cmdType;
	}
	GdsSessions.updateFullState(session, fullState);
	let areaState = fullState.areas[fullState.area] || {};
	rbsResult.sessionInfo = rbsResult.sessionInfo || {};
	rbsResult.sessionInfo.area = areaState.area || '';
	rbsResult.sessionInfo.pcc = areaState.pcc || '';
	rbsResult.sessionInfo.hasPnr = areaState.has_pnr ? true : false;
	rbsResult.sessionInfo.recordLocator = areaState.record_locator || '';
	rbsResult.sessionInfo.canCreatePq = areaState.can_create_pq ? true : false;
	rbsResult.sessionInfo.canCreatePqErrors = areaState.can_create_pq
		? [] : ['Local state processor does not allow creating PQ'];
	let hrtimeDiff = process.hrtime(hrtimeStart);
	rbsResult.sessionInfo.updateTime = hrtimeToDecimal(hrtimeDiff);
	return rbsResult;
};

let addSessionInfoSafe = (session, rbsResult) =>
	addSessionInfo(session, rbsResult).catch(exc => {
		rbsResult.messages.push({type: 'pop_up', text: 'Failed to process state ' + exc});
		logExc('ERROR: Failed to process state', session.logId, exc);
		return rbsResult;
	});

/**
 * auto-correct typos in the command, convert it between
 * GDS dialects, run _alias_ chain of commands, etc...
 * @param session = at('GdsSessions.js').makeSessionRecord()
 * @param {{command: '*R'}} rqBody
 */
module.exports = (session, rqBody) =>
	TravelportClient(rqBody).runInputCmd(session.gdsData)
		.then(rbsResult => addSessionInfoSafe(session, rbsResult))
		.then(rbsResult => {
			let {area, pcc} = rbsResult.sessionInfo;
			if (!pcc) {
				// emulate to default pcc
				return AreaSettings.getByAgent(rqBody.agentId)
					.then(rows => rows.filter(r => r.area === area && r.defaultPcc)[0])
					.then(nonEmpty())
					.then(row => TravelportClient({command: 'SEM/' + row.defaultPcc + '/AG'}).runInputCmd(session.gdsData))
					.then(semResult => addSessionInfoSafe(session, semResult))
					.then(semResult => {
						semResult.calledCommands.unshift(...(rbsResult.calledCommands || []));
						return semResult;
					})
					.catch(exc => rbsResult);
			} else {
				return rbsResult;
			}
		});
