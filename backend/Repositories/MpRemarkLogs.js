const Db = require('../Utils/Db.js');
const GdsSessions = require('./GdsSessions.js');
const CmdLogs = require('./CmdLogs.js');
const Agents = require('./Agents.js');
const {msToSqlDt, sqlNow} = require('klesun-node-tools/src/Utils/Misc.js');
const _ = require('lodash');

const TABLE = 'mp_remark_log';

exports.storeNew = ({airline, pcc, agentId, destinationAirport, recordLocator}) => {
	return Db.withMaster(db => db.writeRows(TABLE, [{
		dt: sqlNow(),
		agentId, airline, pcc,
		destinationAirport,
		recordLocator,
	}]));
};

/** probably won't be needed anymore */
const getFromCmdLogs = async () => {
	const dtObj = new Date();
	dtObj.setMonth(dtObj.getMonth() - 1);
	const monthAgoDt = msToSqlDt(dtObj.getTime());
	const cmdRecs = await CmdLogs.getBy({
		connectionType: 'slave',
		where: [
			['type', '=', 'addRemark'],
			['cmd', 'LIKE', '%-MP-%'],
			['output', 'LIKE', 'OK - %'],
			['gds', 'IN', ['apollo', 'sabre', 'amadeus', 'galileo']],
			['dt', '>=', monthAgoDt],
		],
		orderBy: [['id', 'DESC']],
		limit: 10000,
	});
	const sessionIds = [...new Set(cmdRecs.map(rec => rec.session_id))];
	const sessions = await GdsSessions.getHist({sessionIds, limit: sessionIds.length});
	const idToSession = _.keyBy(sessions, s => s.id);

	const records = [];
	for (const cmdRec of cmdRecs) {
		const session = idToSession[cmdRec.session_id];

		// @:5EXPERTS REMARK-MP-UA-2G2H|ER
		const mpMatch = cmdRec.cmd.match(/EXPERTS REMARK-MP-([A-Z0-9]{2})-([A-Z0-9]{3,9})/);
		if (mpMatch && session) {
			const [, airline, pcc] = mpMatch;
			records.push({
				dt: cmdRec.dt,
				recordLocator: cmdRec.record_locator,
				agentId: session.agentId,
				airline: airline,
				pcc: pcc,
				destinationAirport: null,
			});
		}
	}
	return records;
};

const getAll = () => {
	return Db.withSlave(db => db.fetchAll({
		table: TABLE,
		orderBy: [
			['id', 'DESC'],
		],
	}));
};

exports.getHist = async (rqBody) => {
	const whenAgents = Agents.getAll();
	const whenLogRecs = getAll();
	const [agents, logRecs] = await Promise.all([whenAgents, whenLogRecs]);

	const idToAgent = _.keyBy(agents, a => a.id);
	const records = [];
	for (const logRec of logRecs) {
		const agent = idToAgent[logRec.agentId];
		records.push({
			dt: logRec.dt,
			recordLocator: logRec.recordLocator,
			mpAirline: logRec.airline,
			mpPcc: logRec.pcc,
			destinationAirport: logRec.destinationAirport,
			agentLogin: !agent ? null : agent.login,
			agentCompanies: !agent ? [] : Object.values((agent.data || {}).availableCompanies || {}),
		});
	}
	return {records};
};

exports.getFromCmdLogs = getFromCmdLogs;
