
let RbsClient = require('./RbsClient.es6');
let TravelportClient = require('./TravelportClient.es6');
let dbPool = require('./App/Classes/Sql.es6');
let Db = require('./Utils/Db.es6');

let md5 = (data) => {
	// return crypto.createHash('md5')
	// 	.update(JSON.stringify(data))
	// 	.digest('hex');
	let objectHash = require('object-hash');
	return objectHash(data);
};

let hrtimeToDecimal = (hrtime) => {
	let [seconds, nanos] = hrtime;
	let rest = ('0'.repeat(9) + nanos).slice(-9);
	return seconds + '.' + rest;
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

/** @param {IEmcResult} emcResult */
let runInputCmd = (reqBody, emcResult) => {
	reqBody.agentId = emcResult.user.id;
	reqBody.command = reqBody.command.trim();
	let useRbs = +reqBody.useRbs ? true : false;
	if (useRbs) {
		return RbsClient(reqBody).runInputCmd()
			.then(data => makeCmdResponse(data));
	} else {
		return TravelportClient(reqBody).runInputCmd(reqBody)
			.then(data => makeCmdResponse(data));
	}
};

/** @param {IEmcResult} emcResult */
exports.runInputCmd = (reqBody, emcResult) => {
	let hrtimeStart = process.hrtime();
	let requestTimestamp = new Date().getTime();
	let running = runInputCmd(reqBody, emcResult);

	// do logging _after_ we returned the result
	running.then(result => {
		let hrtimeDiff = process.hrtime(hrtimeStart);
		let responseTimestamp = new Date().getTime();
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

/** @param {IEmcResult} emcResult */
exports.keepAlive = (reqBody, emcResult) => {
	// TODO: use terminal.keepAlive function in RBS instead since if user enters a
	//  command before keepAlive finishes, "session is locked" error will be returned
	return runInputCmd({command: 'MD0', ...reqBody}, emcResult);
};

exports.getLastCommands = (reqBody, emcResult) => {
	let agentId = emcResult.user.id;
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