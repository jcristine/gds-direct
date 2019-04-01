
let express = require('express');
let UserController = require('./HttpControllers/UserController.js');
let CompletionData = require('./HttpControllers/CompletionData.js');
let Emc = require('./LibWrappers/Emc.js');
let GdsSessionController = require('./HttpControllers/GdsSessionController.js');
let TerminalBaseController = require('./Transpiled/App/Controllers/TerminalBaseController.js');
let {hrtimeToDecimal} = require('./Utils/Misc.js');
let {Forbidden, BadReqeust} = require('./Utils/Rej.js');
let {admins} = require('./Constants.js');
let UpdateHighlightRulesFromProd = require('./Actions/UpdateHighlightRulesFromProd.js');
let Db = require('./Utils/Db.js');
let Diag = require('./LibWrappers/Diag.js');
let HighlightRulesRepository = require('./Repositories/HighlightRules.js');
let Redis = require('./LibWrappers/Redis.js');
let initSocketIo = require('socket.io');
let {getConfig} = require('./Config.js');
let GdsSessions = require('./Repositories/GdsSessions.js');
let Migration = require("./Maintenance/Migration");
const CommandParser = require("./Transpiled/Gds/Parsers/Apollo/CommandParser");
const PnrParser = require("./Transpiled/Gds/Parsers/Apollo/Pnr/PnrParser");
const FareConstructionParser = require("./Transpiled/Gds/Parsers/Common/FareConstruction/FareConstructionParser");
const KeepAlive = require("./Maintenance/KeepAlive");
const {safe} = require('./Utils/Misc.js');
const PersistentHttpRq = require('./Utils/PersistentHttpRq.js');
const withGdsSession = require("./HttpControllers/MainController").withGdsSession;
const toHandleHttp = require("./HttpControllers/MainController").toHandleHttp;
const withAuth = require("./HttpControllers/MainController").withAuth;

let app = express();

app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,cache-control');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});
app.get('/', (req, res) => res.redirect('/public'));
app.use('/public', (rq, rs, next) => {
	if (rq.path.endsWith('.js')) {
		rs.setHeader('Content-Type', 'application/javascript');
	} else if (rq.path.endsWith('.css')) {
		rs.setHeader('Content-Type', 'text/css');
	}
	next();
});
app.use('/public', express.static(__dirname + '/../public'));

app.get('/gdsDirect/view', withAuth(UserController.getView));
app.get('/autoComplete', async (req, res) => {
	res.send(JSON.stringify(await CompletionData.getData(req)));
});

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
app.get('/terminal/lastCommands', withAuth(GdsSessionController.getLastCommands));
app.get('/terminal/clearBuffer', withAuth(GdsSessionController.clearBuffer));
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

app.post('/admin/terminal/sessionsGet', toHandleHttp(async rqBody => {
	let sessions = await GdsSessions.getHist(rqBody);
	return {
		aaData: sessions,
	};
}));

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
	let result = await emc.authorizeToken(token);
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

app.get('/doSomeHeavyStuff', withAuth((reqBody, emcResult) => {
	if (emcResult.user.id == 6206) {
		let hrtimeStart = process.hrtime();
		let sum = 0;
		for (let i = 0; i < 1000000000; ++i) {
			sum += i % 2 ? i : -i;
		}
		let hrtimeDiff = process.hrtime(hrtimeStart);
		return {message: 'Done in ' + hrtimeToDecimal(hrtimeDiff) + ' ' + sum};
	} else {
		return Forbidden('Sorry, you must be me in order to use that');
	}
}));
app.get('/runMigrations', withAuth((reqBody, emcResult) => {
	if (emcResult.user.id == 6206) {
		return Migration.run();
	} else {
		return Forbidden('Sorry, you must be me in order to use that');
	}
}));
app.get('/runKeepAlive', withAuth((reqBody, emcResult) => {
	if (emcResult.user.id == 6206) {
		let keepAlive = KeepAlive.run();
		keepAlive.onIdle = () => keepAlive.terminate();
		return {workerLogId: keepAlive.workerLogId};
	} else {
		return Forbidden('Sorry, you must be me in order to use that');
	}
}));
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
app.post('/keepAliveEmc', toHandleHttp(async (rqBody) => {
	if (!rqBody.emcSessionId) {
		return BadReqeust('emcSessionId parameter is mandatory');
	} else if (rqBody.isForeignProjectEmcId) {
		return Promise.resolve({message: 'Foreign Project EMC id - success by default'});
	} else {
		let emc = await Emc.getClient();
		return emc.doAuth(rqBody.emcSessionId);
	}
}));

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
	let PersistentHttpRq = require('./Utils/PersistentHttpRq.js');

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