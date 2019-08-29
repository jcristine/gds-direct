const Airports = require('./Repositories/Airports.js');
const MultiPccTariffRules = require('./Repositories/MultiPccTariffRules.js');
const AgentCustomSettings = require('./Repositories/AgentCustomSettings.js');

const Clustering = require('./Utils/Clustering.js');
const {descrProc} = Clustering;

const express = require('express');
const UserController = require('./HttpControllers/UserController.js');
const CompletionData = require('./HttpControllers/CompletionData.js');
const Emc = require('./LibWrappers/Emc.js');
const GdsSessionController = require('./HttpControllers/GdsSessionController.js');
const TerminalBaseController = require('./Transpiled/App/Controllers/TerminalBaseController.js');
const {Forbidden, BadReqeust, LoginTimeOut} = require('klesun-node-tools/src/Rej.js');
const UpdateHighlightRulesFromProd = require('./Actions/UpdateHighlightRulesFromProd.js');
const Db = require('./Utils/Db.js');
const Diag = require('./LibWrappers/Diag.js');
const HighlightRulesRepository = require('./Repositories/HighlightRules.js');
const Redis = require('./LibWrappers/Redis.js');
const {getConfig} = require('./Config.js');
const GdsSessions = require('./Repositories/GdsSessions.js');
const PersistentHttpRq = require('klesun-node-tools/src/Utils/PersistentHttpRq.js');
const Misc = require("./Transpiled/Lib/Utils/MaskUtil");
const CmdLogs = require("./Repositories/CmdLogs");
const Rej = require("klesun-node-tools/src/Rej");
const Agents = require("./Repositories/Agents");
const {withGdsSession} = require("./HttpControllers/MainController");
const {toHandleHttp} = require("./HttpControllers/MainController");
const {withAuth} = require("./HttpControllers/MainController");
const GdsdLib = require('klesun-node-tools');
const Settings = require("./Repositories/Settings");
const SocketIo = require('./LibWrappers/SocketIo.js');
const ParsersController = require("./HttpControllers/ParsersController");
const {readFile} = require('fs').promises;

const app = express();

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
	const queryStr = req.url.split('?')[1] || '';
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
	} else if (rq.path.endsWith('.md')) {
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
	const records = await CompletionData.getPccList();
	return {records};
}));
app.get('/data/getAgentList', toHandleHttp(async (rqBody) => {
	const rows = await Agents.getAll();
	// since we are not checking roles for this API, it's
	// better to not include agent's real name and emails
	const records = rows.map(row => ({
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
const separateBgColors = (nameToStyles) => {
	const $colorsParsed = {};
	for (const [$class, $style] of Object.entries(nameToStyles)) {
		const $hex = $style['background-color'] || $style['color'] || '';
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
	const returnUrl = rqBody.returnUrl;
	const config = await getConfig();
	const emc = await Emc.getClient();
	const result = await emc.getLoginPage(config.external_service.emc.projectName, returnUrl);
	return {emcLoginUrl: result.data.data};
}));
app.get('/authorizeEmcToken', toHandleHttp(async rqBody => {
	const token = rqBody.token;
	const emc = await Emc.getClient();
	const result = await emc.authorizeToken(token)
		.catch(exc => (exc + '').match(/Token not found/)
			? LoginTimeOut('Session key expired')
			: Promise.reject(exc));
	return {emcSessionId: result.data.sessionKey};
}));
app.get('/checkEmcSessionId', toHandleHttp(async rqBody => {
	const sessionInfo = await Emc.getClient()
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
		const emc = await Emc.getClient();
		return Promise.resolve()
			.then(() => emc.doAuth(rqBody.emcSessionId))
			.catch(exc => (exc + '').match(/session key is invalid/)
				? LoginTimeOut('Session key expired')
				: (exc + '').match(/ESOCKETTIMEDOUT/)
				? Rej.ServiceUnavailable('EMC server is unreachable ATM', {isOk: true})
				: (exc + '').match(/405 Not Allowed/)
				// when they do production restart I think, or when they are overloaded
				? Rej.ServiceUnavailable('EMC service is inaccessible ATM', {isOk: true})
				: Promise.reject(exc));
	}
}));
app.post('/system/reportJsError', withAuth((rqBody, emcResult) => {
	delete(rqBody.emcUser);
	const user = {
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
	const {name, currentGds, value} = routeParams;
	return new TerminalBaseController(emcResult).saveSettingAction(name, currentGds, value);
}));
app.post('/terminal/saveSetting/:name/:currentGds', withAuth((reqBody, emcResult, routeParams) => {
	const {name, currentGds} = routeParams;
	return new TerminalBaseController(emcResult).postSaveSettingAction(reqBody, name, currentGds);
}));
app.post('/terminal/saveSetting/:name', withAuth((reqBody, emcResult, routeParams) => {
	const agentId = emcResult.user.id;
	const value = reqBody.value;
	return AgentCustomSettings.set(agentId, routeParams.name, value);
}));
app.post('/terminal/resetToDefaultPcc', withGdsSession(GdsSessionController.resetToDefaultPcc));
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
app.get('/terminal/clearBuffer', withAuth(GdsSessionController.clearBuffer));

//=====================
// /admin/* routes follow
//=====================

const withOwnerAuth = (ownerAction) => withAuth((rqBody, emcResult) => {
	if (emcResult.user.id == 6206) {
		return ownerAction(rqBody, emcResult);
	} else {
		return Forbidden('Sorry, you must be me in order to use that');
	}
});

const withRoleAuth = (roles, roleAction) => withAuth((rqBody, emcResult) => {
	const userRoles = emcResult.user.roles;
	const matchingRoles = userRoles.filter(r => roles.includes(r));
	if (matchingRoles.length > 0) {
		return roleAction(rqBody, emcResult);
	} else {
		return Forbidden('You do not have ' + roles.join(' or ') + ' role');
	}
});

const withDevAuth = (devAction) => withRoleAuth(['NEW_GDS_DIRECT_DEV_ACCESS'], devAction);

//app.use('/admin/updateHighlightRules', express.bodyParser({limit: '10mb'}));
app.post('/admin/updateHighlightRules', withDevAuth((reqBody, emcResult) => {
	return UpdateHighlightRulesFromProd(reqBody);
}));

app.post('/admin/terminal/highlight', toHandleHttp(HighlightRulesRepository.getFullDataForAdminPage));
app.post('/admin/terminal/highlight/save', withDevAuth(HighlightRulesRepository.saveRule));
app.post('/admin/terminal/highlight/saveSampleDump', withDevAuth(HighlightRulesRepository.saveSampleDump));
app.post('/admin/terminal/themes/save', withAuth(rqBody => {
	return Db.with(db => db.writeRows('terminalThemes', [{
		id: rqBody.id || undefined,
		label: rqBody.label,
		colors: JSON.stringify(rqBody.colors || {}),
	}]));
}));
app.post('/admin/terminal/themes/delete', withAuth(rqBody => {
	const sql = 'DELETE FROM terminalThemes WHERE id = ?';
	return Db.with(db => db.query(sql, [rqBody.id]));
}));

app.post('/admin/terminal/sessionsGet', withRoleAuth([
	'NEW_GDS_DIRECT_DEV_ACCESS', 'VIEW_GDS_SESSION_LOG',
], async (rqBody, emcResult) => {
	const sessions = await GdsSessions.getHist(rqBody);
	return {
		aaData: sessions,
	};
}));
app.get('/terminal/getCmdRqList', withRoleAuth([
	'NEW_GDS_DIRECT_DEV_ACCESS', 'VIEW_GDS_SESSION_LOG',
], GdsSessionController.getCmdRqList));

app.get('/api/js/terminal-log/commands', withRoleAuth([
	'NEW_GDS_DIRECT_DEV_ACCESS', 'VIEW_GDS_SESSION_LOG',
], async (rqBody, emcResult) => {
	const [sessionRow, cmdRows] = await Promise.all([
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
app.post('/admin/getModel', withOwnerAuth(async (reqBody, emcResult) => {
	let rows = await Db.with(db => db.fetchAll({
		table: reqBody.model,
		fields: reqBody.fields || [],
		where: reqBody.where || [],
		whereOr: reqBody.whereOr || [],
		orderBy: reqBody.orderBy || [],
		skip: reqBody.skip,
		limit: reqBody.limit || 100,
	})).catch(exc => {
		if (exc) {
			exc.message = 'Invalid params - ' + exc.httpStatusCode + ' - ' + exc.message;
			exc.httpStatusCode = Rej.BadRequest.httpStatusCode;
		}
		return Promise.reject(exc);
	});
	rows = Misc.maskCcNumbers(rows);
	return {records: rows};
}));

app.get('/admin/showTables', withOwnerAuth(async (rqBody) => {
	const rows = await Db.with(async db => db.query('SHOW TABLES'));
	const records = rows.map(row => ({name: Object.values(row)[0]}));
	return {records};
}));
app.post('/admin/getAllRedisKeys', withOwnerAuth(async (reqBody, emcResult) => {
	const redis = await Redis.getClient();
	const keys = await redis.keys('*');
	return {keys};
}));
app.post('/admin/operateRedisKey', withOwnerAuth(async (reqBody, emcResult) => {
	const {key, operation} = reqBody;
	const redis = await Redis.getClient();
	const redisData = await redis[operation.toLowerCase()](key);
	return {redisData};
}));
app.get('/admin/getShortcutActions', toHandleHttp(async (rqBody) => {
	const rows = await Db.with(db => db
		.fetchAll({table: 'shortcut_actions'}));
	const records = rows
		.map(row => ({
			...JSON.parse(row.data),
			id: row.id,
			gds: row.gds,
			name: row.name,
		}));
	return {records};
}));
app.post('/admin/setShortcutActions', withDevAuth(async (rqBody, emcResult) => {
	const records = rqBody.records;
	return Db.with(async db => {
		const rows = records.map(rec => ({
			...(rec.id ? {id: rec.id} : {}),
			gds: rec.gds,
			name: rec.name,
			data: JSON.stringify(rec),
		}));
		const oldRows = rows.filter(r => r.id);
		const newRows = rows.filter(r => !r.id);

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
app.get('/admin/getSettings', withOwnerAuth(async (rqBody, emcResult) => {
	return Settings.getAll()
		.then(records => ({records}));
}));
app.post('/admin/setSetting', withOwnerAuth(Settings.set));
app.post('/admin/deleteSetting', withOwnerAuth(Settings.delete));
app.get('/admin/status', withDevAuth(async (reqBody, emcResult) => {
	const v8 = require('v8');
	const PersistentHttpRq = require('klesun-node-tools/src/Utils/PersistentHttpRq.js');
	const startupTag = await Clustering.whenStartupTag;
	const fsTag = await readFile(__dirname + '/../public/CURRENT_PRODUCTION_TAG', 'utf8').catch(exc => 'FS error - ' + exc);
	return {
		dt: new Date().toISOString(),
		message: 'testing no watch:true in config, take 1',
		startupTag: startupTag,
		fsTag: fsTag,
		process: descrProc(),
		persistentHttpRqInfo: PersistentHttpRq.getInfo(),
		cmdLogsInsertionKeys: CmdLogs.ramDebug.getInsertionKeys(),
		heapSpaceStatistics: v8.getHeapSpaceStatistics(),
		heapStatistics: v8.getHeapStatistics(),
	};
}));

app.get('/parser/test', toHandleHttp(ParsersController.parseAnything));

//===============================
// one-time script-triggering routes follow
//===============================

app.get('/testHttpRq', withOwnerAuth((reqBody, emcResult) => {
	const rqParams = JSON.parse(reqBody.rqParams);
	rqParams.dropConnection = true;
	return PersistentHttpRq(rqParams);
}));
app.get('/testMemoryLimit', withOwnerAuth(async (rqBody, emcResult) => {
	// 1200000 ~ 350 MiB
	const dummyDataLength = rqBody.dummyDataLength || 100;
	const arr = [];
	for (let i = 0; i < dummyDataLength; ++i) {
		arr.push(i + '-' + i + '-' + Math.random());
	}
	const index = Math.floor(Math.random() * dummyDataLength);
	return {
		index: index,
		dummyDataLength: dummyDataLength,
		value: arr[index],
	};
}));
app.get('/getAgentList', withOwnerAuth(async (reqBody, emcResult) => {
	const emc = await Emc.getClient();
	// keeping useCache false will cause "Not ready yet. Project: 178, Company:" error
	emc.setMethod('getUsers');
	const users = await emc.call();
	return users;
}));
app.get('/getAsapLocations', withOwnerAuth(async (reqBody, emcResult) => {
	const config = await getConfig();
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
}));

//============================
// socket listener initialization follows
//============================

const routes = {
	'/terminal/command': withGdsSession(GdsSessionController.runInputCmd, true),
	'/gdsDirect/keepAlive': withGdsSession(GdsSessionController.keepAliveCurrent),
	'/terminal/addMpRemark': withGdsSession(GdsSessionController.addMpRemark),
	'/terminal/goToPricing': withGdsSession(GdsSessionController.goToPricing),
	'/api/js/admin/multi-pcc-tariff/list-rules': withDevAuth(MultiPccTariffRules.getAll),
	'/api/js/data/locations': toHandleHttp(Airports.getAllLocations),
};

const socketIo = SocketIo.init(routes);
for (const [route, expressAction] of Object.entries(routes)) {
	app.get(route, expressAction);
	app.post(route, expressAction);
}

app.get('/server/forceRestart', withOwnerAuth((rqBody) => Clustering.restartAll({
	reason: 'HTTP dev owner force restart',
	message: rqBody.message || null,
})));
app.get('/server/restartIfNeeded', toHandleHttp(Clustering.restartAllIfNeeded));
app.get('/ping', toHandleHttp(async (rqBody) => {
	const memory = {};
	const used2 = process.memoryUsage();
	for (const key in used2) {
		memory[key] = Math.round(used2[key] / 1024 / 1024 * 100) / 100;
	}
	const startupTag = await Clustering.whenStartupTag;

	return Redis.getInfo().then(async redisLines => {
		const data = {
			process: descrProc(),
			startupTag: startupTag,
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
		};
		data['msg'] = 'pong';
		return {status: 'OK', result: data};
	});
}));
app.get('/CURRENT_PRODUCTION_TAG', async (rq, rs) => {
	Clustering.fetchTagFromFs()
		.then(tag => {
			rs.status(200);
			rs.setHeader('Content-Type', 'text/plain');
			rs.send(tag);
		})
		.catch(exc => {
			exc = exc || new Error('(empty error)');
			rs.status((exc || {}).httpStatusCode || 500);
			rs.setHeader('Content-Type', 'application/json');
			rs.send(JSON.stringify({
				message: exc.message || exc + '',
				stack: exc.stack,
				...exc,
			}));
		});
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
	res.status(404).send('GRECT Route ' + req.path + ' not found');
});

exports.initListeners = () => {
	Clustering.initListeners({
		expressInst: app,
		socketIoInst: socketIo,
	});
};