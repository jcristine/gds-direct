
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
exports.runInputCmd = (reqBody, emcResult) => {
	reqBody.agentId = emcResult.user.id;
	let useRbs = +reqBody.useRbs ? true : false;
	let hrtimeStart = process.hrtime();
	let requestTimestamp = new Date().getTime();
	let running = useRbs
		? RbsClient(reqBody).runInputCmd()
			.then(data => makeCmdResponse(data))
		: TravelportClient.runInputCmd(reqBody)
			.then(data => makeCmdResponse(data));

	// do logging _after_ we returned the result
	running.then(result => {
		let hrtimeDiff = process.hrtime(hrtimeStart);
		let responseTimestamp = new Date().getTime();
		dbPool.getConnection()
			.then(dbConn => {
				return Db(dbConn).insertRows('terminalBuffering', [{
					agentId: reqBody.agentId,
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
			.catch(exc => console.log('SQL exc - ' + exc));
	});

	return running;
};

exports.getLastCommands = (reqBody, emcResult) => {
	reqBody.agentId = emcResult.user.id;
	return dbPool.getConnection()
		.then(dbConn => {
			let rbsSessionId = RbsClient(reqBody).getSessionId();
			//let gdsSessionData = TravelportClient(reqBody).getSessionData();
			//let gdsSessionDataMd5 = md5(gdsSessionData);
			let gdsSessionDataMd5 = 'fake123';
			return Db(dbConn).fetchAll({
				table: 'terminalBuffering',
				whereOr: [
					[['rbsSessionId', '=', rbsSessionId]],
					[['gdsSessionDataMd5', '=', gdsSessionDataMd5]],
				],
				orderBy: 'id DESC',
				limit: 100,
			}).then(rows => {
				let cmds = rows.map(row => row.command);
				let usedSet = new Set();
				return {
					success: true,
					data: cmds.reverse().filter(cmd => {
						// remove dupes
						let used = usedSet.has(cmd);
						usedSet.add(cmd);
						return !used;
					}),
				};
			}).finally(() => dbPool.releaseConnection(dbConn));
		});
};