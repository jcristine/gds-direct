
let RbsClient = require('./RbsClient.es6');
let TravelportClient = require('./TravelportClient.es6');
let dbPool = require('./App/Classes/Sql.es6');
let Db = require('./Utils/Db.es6');
let TerminalService = require('./Transpiled/App/Services/TerminalService.es6');

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

let isTravelportAllowed = (emcResult) => {
	let agentId = emcResult.user.id;
	return [
		6206, // aklesuns
		785, // kira
		836, // Bruce
		1330, // Bruce Paulson
		20744, // Eldar
		1092, // Jayden
		2838, // stanislaw
		2838, // stanislaw
		101395, // aprokopcuks
	].includes(+agentId);
};

/** @param {IEmcResult} emcResult */
let runInputCmd = (reqBody, emcResult) => {
	reqBody.command = reqBody.command.trim();
	let useRbs = +reqBody.useRbs ? true : false;
	let running;
	if (useRbs) {
		running = RbsClient(reqBody).runInputCmd();
	} else if (!isTravelportAllowed(emcResult)) {
		running = Promise.reject('You are not allowed to use RBS-free connection');
	} else {
		if (reqBody.gds === 'apollo') {
			running = TravelportClient(reqBody).runInputCmd(reqBody);
		} else {
			running = Promise.reject('Unsupported GDS for RBS-free connection - ' + reqBody.gds)
		}
	}
	return running.then(rbsResult => {
		let termSvc = new TerminalService(reqBody.gds, reqBody.agentId, reqBody.travelRequestId);
		return termSvc.addHighlighting(reqBody.command, reqBody.language, rbsResult);
	}).then(makeCmdResponse);
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

exports.getPqItinerary = (reqBody, emcResult) => RbsClient(reqBody).getPqItinerary();
exports.importPq = (reqBody, emcResult) => RbsClient(reqBody).importPq();

/** @param {IEmcResult} emcResult */
exports.keepAlive = (reqBody, emcResult) => {
	// TODO: use terminal.keepAlive so that RBS logs was not trashed with these MD0-s
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