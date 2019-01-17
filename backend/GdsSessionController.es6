
let RbsClient = require('./RbsClient.es6');
let TravelportClient = require('./TravelportClient.es6');
let dbPool = require('./App/Classes/Sql.es6');
let Db = require('./Utils/Db.es6');
let TerminalService = require('./Transpiled/App/Services/TerminalService.es6');
let {hrtimeToDecimal} = require('./Utils/Misc.es6');
let {admins} = require('./Constants.es6');
let GdsSessions = require('./Repositories/GdsSessions.es6');

let md5 = (data) => {
	// return crypto.createHash('md5')
	// 	.update(JSON.stringify(data))
	// 	.digest('hex');
	let objectHash = require('object-hash');
	return objectHash(data);
};

let makeCmdResponse = (data) => 1 && {
	success: true,
	data: Object.assign({
		output: 'NO RESPONSE',
		tabCommands: [],
		clearScreen: false,
		canCreatePq: false,
		canCreatePqErrors: [],
		area: 'A',
		pcc: '1O3K',
		prompt: "",
		startNewSession: false,
		userMessages: null,
		appliedRules: [],
		legend: [],
	}, data),
};

let isTravelportAllowed = (rqBody) => {
	return admins.includes(+rqBody.agentId);
};

let startNewSession = (rqBody) => {
	let starting;
	if (+rqBody.useRbs) {
		starting = RbsClient.startSession(rqBody);
	} else {
		if (!isTravelportAllowed(rqBody)) {
			starting = Promise.reject('You are not allowed to use RBS-free connection');
		} else if (rqBody.gds === 'apollo') {
			starting = TravelportClient.startSession();
		} else {
			starting = Promise.reject('GDS ' + rqBody.gds + ' not supported with "Be Fast" flag - uncheck it.');
		}
	}
	return starting.then(sessionData => GdsSessions.storeNew(rqBody, sessionData));
};

let runInSession = (session, rqBody) => {
	let running;
	if (+session.context.useRbs) {
		running = RbsClient(rqBody).runInputCmd(session.sessionData);
	} else {
		running = TravelportClient(rqBody).runInputCmd(session.sessionData);
	}
	return running.then(rbsResult => ({session, rbsResult}));
};

/** @param {IEmcResult} emcResult
 * @param reqBody = in('WebRoutes.es6').normalizeRqBody() */
let runInputCmd = (reqBody) => {
	reqBody.command = reqBody.command.trim();
	let running = GdsSessions.getByContext(reqBody)
		.then(session => runInSession(session, reqBody))
		.catch(exc => startNewSession(reqBody)
			// session could have expired
			.then(session => runInSession(session, reqBody))
			.then(data => Object.assign({}, data, {
				startNewSession: true,
				userMessages: ['New session started, reason: ' + (exc + '').slice(0, 800) + '...\n'],
			})));

	return running.then(({session, rbsResult}) => {
		GdsSessions.updateAccessTime(session.id);
		let termSvc = new TerminalService(reqBody.gds, reqBody.agentId, reqBody.travelRequestId);
		return termSvc.addHighlighting(reqBody.command, reqBody.language || reqBody.gds, rbsResult);
	}).then(makeCmdResponse);
};

/** @param {IEmcResult} emcResult */
exports.runInputCmd = (reqBody, emcResult) => {
	let hrtimeStart = process.hrtime();
	let requestTimestamp = Math.floor(new Date().getTime() / 1000);
	let running = runInputCmd(reqBody, emcResult);

	// do logging _after_ we returned the result
	running.then(result => {
		let hrtimeDiff = process.hrtime(hrtimeStart);
		let responseTimestamp = Math.floor(new Date().getTime() / 1000);
		dbPool.getConnection()
			.then(dbConn => {
				return Db(dbConn).writeRows('terminalBuffering', [{
					agentId: reqBody.agentId,
					requestId: reqBody.travelRequestId || 0,
					gds: reqBody.gds,
					dialect: reqBody.language,
					rbsSessionId: result.data.rbsSessionId || null,
					gdsSessionDataMd5: !result.data.gdsSessionData ? null :
						md5(result.data.gdsSessionData),
					area: result.data.area,
					terminalNumber: reqBody.terminalIndex,
					processedTime: hrtimeToDecimal(hrtimeDiff),
					command: reqBody.command,
					output: result.data.output,
					requestTimestamp: requestTimestamp,
					responseTimestamp: responseTimestamp,
				}]).finally(() => dbPool.releaseConnection(dbConn));
			})
			.catch(exc => console.error('SQL exc - ' + exc));
	});

	return running;
};

exports.getPqItinerary = (reqBody) => {
	reqBody.useRbs = true;
	return GdsSessions.getByContext(reqBody).then(session =>
		RbsClient(reqBody).getPqItinerary(session.sessionData));
};
exports.importPq = (reqBody) => {
	reqBody.useRbs = true;
	return GdsSessions.getByContext(reqBody).then(session =>
		RbsClient(reqBody).importPq(session.sessionData));
};

/** @param {IEmcResult} emcResult */
exports.keepAlive = (reqBody) => {
	// TODO: use terminal.keepAlive so that RBS logs were not trashed with these MD0-s
	return runInputCmd({command: 'MD0', ...reqBody});
};

exports.getLastCommands = (reqBody) => {
	let agentId = reqBody.agentId;
	let gds = reqBody.gds;
	let requestId = reqBody.travelRequestId || 0;
	return dbPool.getConnection()
		.then(dbConn => {
			return Db(dbConn).fetchAll({
				table: 'terminalBuffering',
				where: [
					['gds', '=', gds],
					['agentId', '=', agentId],
					['requestId', '=', requestId],
				],
				orderBy: 'id DESC',
				limit: 100,
			}).then(rows => {
				let cmds = rows.map(row => row.command);
				let usedSet = new Set();
				return {
					success: true,
					data: cmds.filter(cmd => {
						// remove dupes
						let used = usedSet.has(cmd);
						usedSet.add(cmd);
						return !used;
					}).reverse(),
				};
			}).finally(() => dbPool.releaseConnection(dbConn));
		});
};