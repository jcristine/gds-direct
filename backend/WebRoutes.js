
let express = require('express');
let UserController = require('./HttpControllers/UserController.js');
let CompletionData = require('./HttpControllers/CompletionData.js');
let Emc = require('./LibWrappers/Emc.js');
let GdsSessionController = require('./HttpControllers/GdsSessionController.js');
let TerminalBaseController = require('./Transpiled/App/Controllers/TerminalBaseController.js');
let {Forbidden, BadReqeust} = require('klesun-node-tools/src/Utils/Rej.js');
let {admins} = require('./Constants.js');
let UpdateHighlightRulesFromProd = require('./Actions/UpdateHighlightRulesFromProd.js');
let Db = require('./Utils/Db.js');
let Diag = require('./LibWrappers/Diag.js');
let HighlightRulesRepository = require('./Repositories/HighlightRules.js');
let Redis = require('./LibWrappers/Redis.js');
let initSocketIo = require('socket.io');
let {getConfig} = require('./Config.js');
let GdsSessions = require('./Repositories/GdsSessions.js');
const CommandParser = require("./Transpiled/Gds/Parsers/Apollo/CommandParser");
const PnrParser = require("./Transpiled/Gds/Parsers/Apollo/Pnr/PnrParser");
const FareConstructionParser = require("./Transpiled/Gds/Parsers/Common/FareConstruction/FareConstructionParser");
const {safe} = require('./Utils/Misc.js');
const PersistentHttpRq = require('klesun-node-tools/src/Utils/PersistentHttpRq.js');
const Misc = require("./Transpiled/Lib/Utils/Misc");
const CmdLogs = require("./Repositories/CmdLogs");
const Rej = require("gds-direct-lib/src/Utils/Rej");
const Agents = require("./Repositories/Agents");
const LoginTimeOut = require("gds-direct-lib/src/Utils/Rej").LoginTimeOut;
const withGdsSession = require("./HttpControllers/MainController").withGdsSession;
const toHandleHttp = require("./HttpControllers/MainController").toHandleHttp;
const {withAuth} = require("./HttpControllers/MainController");
const GdsdLib = require('klesun-node-tools');

let app = express();

app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,cache-control,Cache-Control');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});
app.get('/', (req, res) => {
	let queryStr = req.url.split('?')[1] || '';
	let newUrl = '/public';
	if (queryStr) {
		newUrl += '?' + queryStr;
	}
	return res.redirect(newUrl);
});
app.use('/public', (rq, rs, next) => {
	if (rq.path.endsWith('.js') || rq.path.endsWith('.es6')) {
		rs.setHeader('Content-Type', 'application/javascript');
		// 10 minutes. Should eventually start sending a bg request
		// to server to invalidate cache if response is not 304
		rs.setHeader('Cache-Control', 'public, max-age=3600');
	} else if (rq.path.endsWith('.css')) {
		rs.setHeader('Content-Type', 'text/css');
	} else if (rq.path.endsWith('CURRENT_PRODUCTION_TAG')) {
		rs.setHeader('Content-Type', 'text/plain');
	}
	next();
});
app.use('/public', express.static(__dirname + '/../public'));

//============================
// page initialization routes follow
//============================

app.get('/gdsDirect/view', withAuth(UserController.getView));
app.get('/data/getPccList', toHandleHttp(async (rqBody) => {
	let records = await CompletionData.getPccList();
	return {records};
}));
app.get('/data/getAgentList', toHandleHttp(async (rqBody) => {
	let rows = await Agents.getAll();
	// since we are not checking roles for this API, it's
	// better to not include agent's real name and emails
	let records = rows.map(row => ({
		id: row.id,
		displayName: row.login, // RBS legacy
		isActive: row.is_active,
		gdsSigns: [
			{gds: 'apollo', initials: row.fp_initials},
			{gds: 'sabre', initials: row.sabre_initials},
		].filter(s => s.initials),
		teamId: row.team_id,
	}));
	return {records};
}));
/**
 * Function separates font color from background color so we can apply
 * two different classes in frontend for highlighting
 */
let separateBgColors = (nameToStyles) => {
	let $colorsParsed = {};
	for (let [$class, $style] of Object.entries(nameToStyles)) {
		let $hex = $style['background-color'] || $style['color'] || '';
		$colorsParsed[$class + '-color'] = {
			'color': $hex,
		};
		$colorsParsed[$class + '-backgroundColor'] = {
			'background-color': $hex,
		};
	}
	return $colorsParsed;
};
app.get('/gdsDirect/themes', toHandleHttp(() =>
	Db.with(db => db.fetchAll({table: 'terminalThemes'}))
		.then(rows => ({
			terminalThemes: rows.map(r => {
				return ({
					id: r.id,
					label: r.label,
					colors: JSON.parse(r.colors || '{}'),
					colorsParsed: separateBgColors(JSON.parse(r.colors || '{}')),
				});
			}),
		}))
));
app.get('/emcLoginUrl', toHandleHttp(async rqBody => {
	let returnUrl = rqBody.returnUrl;
	let config = await getConfig();
	let emc = await Emc.getClient();
	let result = await emc.getLoginPage(config.external_service.emc.projectName, returnUrl);
	return {emcLoginUrl: result.data.data};
}));
app.get('/authorizeEmcToken', toHandleHttp(async rqBody => {
	let token = rqBody.token;
	let emc = await Emc.getClient();
	let result = await emc.authorizeToken(token)
		.catch(exc => (exc + '').match(/Token not found/)
			? LoginTimeOut('Session key expired')
			: Promise.reject(exc));
	return {emcSessionId: result.data.sessionKey};
}));
app.get('/checkEmcSessionId', toHandleHttp(async rqBody => {
	let sessionInfo = await Emc.getClient()
		.then(emc => emc.sessionInfo(rqBody.emcSessionId))
		.catch(exc => null);
	return {
		isValid: (((sessionInfo || {}).data || {}).user || {}).id > 0,
	};
}));
app.post('/keepAliveEmc', toHandleHttp(async (rqBody) => {
	if (!rqBody.emcSessionId) {
		return BadReqeust('emcSessionId parameter is mandatory');
	} else if (rqBody.isForeignProjectEmcId) {
		return Promise.resolve({message: 'Foreign Project EMC id - success by default'});
	} else {
		let emc = await Emc.getClient();
		return Promise.resolve()
			.then(() => emc.doAuth(rqBody.emcSessionId))
			.catch(exc => (exc + '').match(/session key is invalid/)
				? LoginTimeOut('Session key expired')
				: Promise.reject(exc));
	}
}));
app.post('/system/reportJsError', withAuth((rqBody, emcResult) => {
	delete(rqBody.emcUser);
	let user = {
		id: emcResult.user.id,
		login: emcResult.user.login,
		displayName: emcResult.user.displayName,
	};
	return Diag.warning('Uncaught JS exception reported', {rqBody, user});
}));

//==========================
// terminal actions follow
//==========================

app.get('/terminal/saveSetting/:name/:currentGds/:value', withAuth((reqBody, emcResult, routeParams) => {
	let {name, currentGds, value} = routeParams;
	return new TerminalBaseController(emcResult).saveSettingAction(name, currentGds, value);
}));
app.post('/terminal/saveSetting/:name/:currentGds', withAuth((reqBody, emcResult, routeParams) => {
	let {name, currentGds} = routeParams;
	return new TerminalBaseController(emcResult).postSaveSettingAction(reqBody, name, currentGds);
}));
app.post('/terminal/resetToDefaultPcc', withGdsSession(GdsSessionController.resetToDefaultPcc));
app.post('/terminal/command', withGdsSession(GdsSessionController.runInputCmd, true));
app.post('/gdsDirect/keepAlive', withGdsSession(GdsSessionController.keepAliveCurrent));
app.get('/terminal/getPqItinerary', withGdsSession(GdsSessionController.getPqItinerary));
app.get('/terminal/importPq', withGdsSession(GdsSessionController.importPq));
app.post('/terminal/makeMco', withGdsSession(GdsSessionController.makeMco));
app.post('/terminal/exchangeTicket', withGdsSession(GdsSessionController.exchangeTicket));
app.post('/terminal/confirmExchangeFareDifference', withGdsSession(GdsSessionController.confirmExchangeFareDifference));
app.post('/terminal/submitHhprMask', withGdsSession(GdsSessionController.submitHhprMask));
app.post('/terminal/submitTaxBreakdownMask', withGdsSession(GdsSessionController.submitTaxBreakdownMask));
app.post('/terminal/submitZpTaxBreakdownMask', withGdsSession(GdsSessionController.submitZpTaxBreakdownMask));
app.post('/terminal/submitFcMask', withGdsSession(GdsSessionController.submitFcMask));
app.get('/terminal/lastCommands', withAuth(GdsSessionController.getLastCommands));
app.get('/terminal/getCmdRqList', withAuth(GdsSessionController.getCmdRqList));
app.get('/terminal/clearBuffer', withAuth(GdsSessionController.clearBuffer));

//=====================
// /admin/* routes follow
//=====================

//app.use('/admin/updateHighlightRules', express.bodyParser({limit: '10mb'}));
app.post('/admin/updateHighlightRules', withAuth((reqBody, emcResult) => {
	if (admins.includes(+emcResult.user.id)) {
		return UpdateHighlightRulesFromProd(reqBody);
	} else {
		return Forbidden('Sorry, only users with admin rights can use that. Your id ' + emcResult.user.id + ' is not in ' + admins.join(','));
	}
}));

app.post('/admin/terminal/highlight', toHandleHttp(HighlightRulesRepository.getFullDataForAdminPage));
app.post('/admin/terminal/highlight/save', withAuth(HighlightRulesRepository.saveRule));
app.post('/admin/terminal/themes/save', withAuth(rqBody => {
	return Db.with(db => db.writeRows('terminalThemes', [{
		id: rqBody.id || undefined,
		label: rqBody.label,
		colors: JSON.stringify(rqBody.colors || {}),
	}]));
}));
app.post('/admin/terminal/themes/delete', withAuth(rqBody => {
	let sql = 'DELETE FROM terminalThemes WHERE id = ?';
	return Db.with(db => db.query(sql, [rqBody.id]));
}));

app.post('/admin/terminal/sessionsGet', withAuth(async (rqBody, emcResult) => {
	if (!emcResult.user.roles.includes('NEW_GDS_DIRECT_DEV_ACCESS')) {
		return Forbidden('You do not have dev access role');
	}
	let sessions = await GdsSessions.getHist(rqBody);
	return {
		aaData: sessions,
	};
}));
app.get('/api/js/terminal-log/commands', withAuth(async (rqBody, emcResult) => {
	if (!emcResult.user.roles.includes('NEW_GDS_DIRECT_DEV_ACCESS')) {
		return Forbidden('You do not have dev access role');
	}
	let [sessionRow, cmdRows] = await Promise.all([
		GdsSessions.getHist({sessionId: rqBody.sessionId})
			.then(rows => rows[0])
			.then(Rej.nonEmpty('No such session id DB: #' + rqBody.sessionId)),
		CmdLogs.getAll(rqBody.sessionId),
	]);
	return {
		sessionData: {
			agent: "", // login
			agent_id: sessionRow.agentId,
			created_dt: sessionRow.startTime,
			gds: sessionRow.gds,
			id: sessionRow.id,
			lead_id: sessionRow.requestId,
			user_activity_dt: sessionRow.endTime,
			log_id: sessionRow.logId,
		},
		records: cmdRows.reverse().map(row => ({...row,
			cmd_performed: row.cmd,
			cmd_type: row.type,
			cmd_requested: row.cmd_rq_id,
		})),
	};
}));
app.post('/admin/getModel', withAuth(async (reqBody, emcResult) => {
	if (emcResult.user.id == 6206) {
		let rows = await Db.with(db => db.fetchAll({
			table: reqBody.model,
			where: reqBody.where || [],
			whereOr: reqBody.whereOr || [],
			orderBy: reqBody.orderBy || null,
			skip: reqBody.skip,
			limit: reqBody.limit || 100,
		}));
		rows = Misc.maskCcNumbers(rows);
		return {records: rows};
	} else {
		return Forbidden('Sorry, you must be me in order to use that');
	}
}));
app.post('/admin/getAllRedisKeys', withAuth(async (reqBody, emcResult) => {
	if (emcResult.user.id == 6206) {
		let redis = await Redis.getClient();
		let keys = await redis.keys('*');
		return {keys};
	} else {
		return Forbidden('Sorry, you must be me in order to use that');
	}
}));
app.post('/admin/operateRedisKey', withAuth(async (reqBody, emcResult) => {
	if (emcResult.user.id == 6206) {
		let {key, operation} = reqBody;
		let redis = await Redis.getClient();
		let redisData = await redis[operation.toLowerCase()](key);
		return {redisData};
	} else {
		return Forbidden('Sorry, you must be me in order to use that');
	}
}));
app.get('/admin/getShortcutActions', toHandleHttp(async (rqBody) => {
	let rows = await Db.with(db => db
		.fetchAll({table: 'shortcut_actions'}));
	let records = rows
		.map(row => ({
			...JSON.parse(row.data),
			id: row.id,
			gds: row.gds,
			name: row.name,
		}));
	return {records};
}));
app.post('/admin/setShortcutActions', withAuth(async (rqBody, emcResult) => {
	if (!emcResult.user.roles.includes('NEW_GDS_DIRECT_DEV_ACCESS')) {
		return Forbidden('You are not allowed to change shortcut actions');
	}
	let records = rqBody.records;
	return Db.with(async db => {
		let rows = records.map(rec => ({
			...(rec.id ? {id: rec.id} : {}),
			gds: rec.gds,
			name: rec.name,
			data: JSON.stringify(rec),
		}));
		let oldRows = rows.filter(r => r.id);
		let newRows = rows.filter(r => !r.id);

		if (oldRows.length > 0) {
			await db.query([
				'DELETE FROM shortcut_actions WHERE id',
				'NOT IN (' + oldRows.map(id => '?') + ');',
			].join('\n'), oldRows.map(r => r.id));
		} else {
			await db.query('DELETE FROM shortcut_actions');
		}
		return Promise.all([
			db.writeRows('shortcut_actions', oldRows),
			db.writeRows('shortcut_actions', newRows),
		]);
	});
}));
app.get('/admin/status', withAuth(async (reqBody, emcResult) => {
	if (emcResult.user.id == 6206) {
		return {
			cmdLogsInsertionKeys: CmdLogs.ramDebug.getInsertionKeys(),
		};
	} else {
		return Forbidden('Sorry, you must be me in order to use that');
	}
}));

app.get('/parser/test', toHandleHttp((rqBody) => {
	let result;
	result = CommandParser.parse(rqBody.input);
	if (result && result.type && result.data) {
		return result;
	}
	result = PnrParser.parse(rqBody.input);
	if (safe(() => result.headerData.reservationInfo.recordLocator) ||
		safe(() => result.itineraryData.length > 0) ||
		safe(() => result.passengers.length > 0)
	) {
		return result;
	}
	result = FareConstructionParser.parse(rqBody.input);
	return result;
}));

//===============================
// one-time script-triggering routes follow
//===============================

app.get('/testHttpRq', withAuth((reqBody, emcResult) => {
	if (emcResult.user.id == 6206) {
		let rqParams = JSON.parse(reqBody.rqParams);
		rqParams.dropConnection = true;
		return PersistentHttpRq(rqParams);
	} else {
		return Forbidden('Sorry, you must be me in order to use that');
	}
}));
app.get('/testRedisWrite', withAuth(async (reqBody, emcResult) => {
	if (emcResult.user.id == 6206) {
		let redis = await Redis.getClient();
		return redis.hset(Redis.keys.USER_TO_TMP_SETTINGS + ':' + emcResult.user.id, reqBody.key, reqBody.val)
			.then(rs => ({rs}));
	} else {
		return Forbidden('Sorry, you must be me in order to use that');
	}
}));
app.get('/testMemoryLimit', withAuth(async (rqBody, emcResult) => {
	if (emcResult.user.id == 6206) {
		// 1200000 ~ 350 MiB
		let dummyDataLength = rqBody.dummyDataLength || 100;
		let arr = [];
		for (let i = 0; i < dummyDataLength; ++i) {
			arr.push(i + '-' + i + '-' + Math.random());
		}
		let index = Math.floor(Math.random() * dummyDataLength);
		return {
			index: index,
			dummyDataLength: dummyDataLength,
			value: arr[index],
		};
	} else {
		return Forbidden('Sorry, you must be me in order to use that');
	}
}));
app.get('/getAgentList', withAuth(async (reqBody, emcResult) => {
	if (emcResult.user.id == 6206) {
		let emc = await Emc.getClient();
		// keeping useCache false will cause "Not ready yet. Project: 178, Company:" error
		emc.setMethod('getUsers');
		let users = await emc.call();
		return users;
	} else {
		return Forbidden('Sorry, you must be me in order to use that');
	}
}));
app.get('/getAsapLocations', withAuth(async (reqBody, emcResult) => {
	if (emcResult.user.id == 6206) {
		let config = await getConfig();
		/** @type IGetAirportsRs */
		return GdsdLib.Misc.iqJson({
			url: config.external_service.infocenter.host,
			credentials: {
				login: config.external_service.infocenter.login,
				passwd: config.external_service.infocenter.password,
			},
			functionName: 'getAllWithRegions',
			serviceName: 'infocenter',
			params: {folder: 'asap'},
		});
	} else {
		return Forbidden('Sorry, you must be me in order to use that');
	}
}));

//============================
// socket listener initialization follows
//============================

getConfig().then(config => {
	app.listen(+config.HTTP_PORT, config.HOST, function () {
		//console.log('listening on *:' + config.HTTP_PORT + ' - for standard http request handling');
	});
});

let socketIo = initSocketIo();
socketIo.on('connection', /** @param {Socket} socket */ socket => {
	socket.on('message', (data, reply) => {
		let fallbackBody = JSON.stringify({error: 'Your request was not handled'});
		let rsData = {body: fallbackBody, status: 501, headers: {}};
		let rq = {url: data.url, path: data.url.split('?')[0], body: data.body, params: {}};
		let rs = {
			status: (code) => rsData.status = code,
			setHeader: (name, value) => rsData.headers[name] = value,
			send: (body) => {
				try {
					body = JSON.parse(body);
				} catch (exc) {}
				rsData.body = body;
				reply(rsData);
			},
		};
		if (rq.path === '/terminal/command') {
			withGdsSession(GdsSessionController.runInputCmd, true)(rq, rs);
		} else if (rq.path === '/gdsDirect/keepAlive') {
			withGdsSession(GdsSessionController.keepAliveCurrent)(rq, rs);
		} else {
			rs.status(501);
			rs.send('Unsupported path - ' + rq.path);
		}
	});
	socket.send({testMessage: 'hello, how are you?'}, (response) => {
		//console.log('delivered testMessage to client', response);
	});
});
getConfig().then(config => {
	try {
		socketIo.listen(config.SOCKET_PORT);
	} catch (exc) {
		// TypeError: Cannot read property 'listeners' of undefined if SOCKET_PORT is not defined
		Diag.error('Failed to listen to socket port (' + config.SOCKET_PORT + ') - ' + exc);
	}
});

app.get('/ping', toHandleHttp((rqBody) => {
	let memory = {};
	const used2 = process.memoryUsage();
	for (let key in used2) {
		memory[key] = Math.round(used2[key] / 1024 / 1024 * 100) / 100;
	}
	let PersistentHttpRq = require('klesun-node-tools/src/Utils/PersistentHttpRq.js');

	return Redis.getInfo().then(async redisLines => {
		const data = {
			pid: process.pid,
			'dbPool': await Db.getInfo(),
			sockets: {
				'totalConnection': socketIo.engine.clientsCount,
			},
			redis: {
				connected_clients: redisLines.connected_clients,
				client_longest_output_list: redisLines.client_longest_output_list,
				client_biggest_input_buf: redisLines.client_biggest_input_buf,
				blocked_clients: redisLines.blocked_clients,
				used_memory_human: redisLines.used_memory_human,
				used_memory_peak_human: redisLines.used_memory_peak_human,
			},
			system: {
				memory: memory,
			},
			persistentHttpRqInfo: PersistentHttpRq.getInfo(),
		};
		data['msg'] = 'pong';
		return {status: 'OK', result: data};
	});
}));

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.status(404).send('GRECT Route ' + req.path + ' not found');
});
