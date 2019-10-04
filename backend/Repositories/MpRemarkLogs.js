const GdsSessions = require('./GdsSessions.js');
const CmdLogs = require('./CmdLogs.js');
const Agents = require('./Agents.js');
const {msToSqlDt} = require('klesun-node-tools/src/Utils/Misc.js');

const TABLE = 'mp_remark_log';

exports.getHist = async (rqBody) => {
	const whenAgents = Agents.getAll();
	const dtObj = new Date();
	dtObj.setMonth(dtObj.getMonth() - 1);
	const monthAgoDt = msToSqlDt(dtObj.getTime());
	const whenCmdRecs = CmdLogs.getBy({
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
	const [agents, cmdRecs] = await Promise.all([whenAgents, whenCmdRecs]);
	const sessionIds = [...new Set(cmdRecs.map(rec => rec.session_id))];
	const sessions = await GdsSessions.getHist({sessionIds, limit: sessionIds.length});

	const idToSession = _.keyBy(sessions, s => s.id);
	const idToAgent = _.keyBy(agents, a => a.id);
	const records = [];
	for (const cmdRec of cmdRecs) {
		const session = idToSession[cmdRec.session_id];
		const agent = !session ? null : idToAgent[session.agentId];

		// @:5EXPERTS REMARK-MP-UA-2G2H|ER
		const mpMatch = cmdRec.cmd.match(/EXPERTS REMARK-MP-([A-Z0-9]{2})-([A-Z0-9]{3,9})/);
		if (mpMatch) {
			const [, mpAirline, mpPcc] = mpMatch;
			records.push({...cmdRec,
				agentLogin: !agent ? null : agent.login,
				agentCompanies: !agent ? [] : Object.values((agent.data || {}).availableCompanies || {}),
				mpAirline: mpAirline,
				mpPcc: mpPcc,
			});
		}
	}
	return {records};
};
