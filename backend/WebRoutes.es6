
let express = require('express');
let UserController = require('./UserController.es6');
let CompletionData = require('./CompletionData.es6');
let Emc = require('./App/Api/Clients/Emc.es6');
let GdsSessionController = require('./GdsSessionController.es6');
let TerminalBaseController = require('./Transpiled/App/Controllers/TerminalBaseController.es6');
let {hrtimeToDecimal} = require('./Utils/Misc.es6');
let {Forbidden, NotImplemented} = require('./Utils/Rej.es6');
let cluster = require('cluster');
let {admins} = require('./Constants.es6');
let UpdateHighlightRulesFromProd = require('./Actions/UpdateHighlightRulesFromProd.es6');
let Db = require('./Utils/Db.es6');
let Diag = require('./LibWrappers/Diag.es6');
let FluentLogger = require('./LibWrappers/FluentLogger.es6');
let HighlightRulesRepository = require('./Actions/HighlightRulesRepository.es6');
let dbPool = require('./App/Classes/Sql.es6');
let Redis = require('./LibWrappers/Redis.es6');
let initSocketIo = require('socket.io');
let Config = require('./Config.es6');

let app = express();

let shouldDiag = (exc) =>
	!Forbidden.matches(exc.httpStatusCode) &&
	!NotImplemented.matches(exc.httpStatusCode);

let toHandleHttp = (action, logger = null) => (req, res) => {
	let log = logger ? logger.log : (() => {});
	let rqBody = req.body;
	if (Object.keys(rqBody).length === 0) {
		let querystring = require('querystring');
		let queryStr = req.url.split('?')[1] || '';
		rqBody = querystring.parse(queryStr);
	}
	let maskedBody = Object.assign({}, rqBody, {
		emcSessionId: '******' + (rqBody.emcSessionId || '').slice(-4),
	});
	log('Processing HTTP request ' + req.path + ' with params:', maskedBody);
	return Promise.resolve()
		.then(() => action(rqBody, req.params))
		.catch(exc => {
			let error = new Error('HTTP action failed - ' + exc);
			error.httpStatusCode = exc.httpStatusCode || 520;
			if (exc.stack) {
				error.stack += '\nCaused by:\n' + exc.stack;
			}
			return Promise.reject(error);
		})
		.then(result => {
			log('HTTP action result:', result);
			res.setHeader('Content-Type', 'application/json');
			res.status(200);
			res.send(JSON.stringify(Object.assign({
				message: 'OK', workerId: (cluster.worker || {}).id,
			}, result)));
		})
		.catch(exc => {
			exc = exc || 'Empty error ' + exc;
			res.status(exc.httpStatusCode || 500);
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({error: exc + '', stack: exc.stack}));
			let errorData = {
				message: exc.message || '' + exc,
				httpStatusCode: exc.httpStatusCode,
				requestPath: req.path,
				requestBody: maskedBody,
				stack: exc.stack,
				processLogId: logger ? logger.logId : null,
			};
			if (shouldDiag(exc)) {
				FluentLogger.logExc('ERROR: HTTP request failed', logger.logId, errorData);
				Diag.error('HTTP request failed', errorData);
			} else {
				log('HTTP request was not satisfied', errorData);
			}
		})
};

let normalizeRqBody = (rqBody, emcData, logId) => {
	return {
		agentId: +emcData.result.user.id,
		processLogId: logId,
		// action-specific fields follow
		...rqBody,
	};
};

let withAuth = (action) => (req, res) => {
	let logger = FluentLogger.init();
	let {log, logId} = logger;
	let logToTable = (agentId) => Db.with(db =>
		db.writeRows('http_rq_log', [{
			path: req.path,
			dt: new Date().toISOString(),
			agentId: agentId,
			logId: logId,
		}]));

	return toHandleHttp((rqBody, routeParams) => {
		return (new Emc()).getCachedSessionInfo(rqBody.emcSessionId)
			.catch(exc => {
				let error = new Error('EMC auth error - ' + exc);
				error.httpStatusCode = 401;
				error.stack += '\nCaused by:\n' + exc.stack;
				return Promise.reject(error);
			})
			.then(emcData => {
				rqBody = normalizeRqBody(rqBody, emcData, logId);
				log('Authorized agent: ' + rqBody.agentId + ' ' + emcData.result.user.displayName, emcData.result.user.roles);
				logToTable(rqBody.agentId);
				return Promise.resolve()
					.then(() => action(rqBody, emcData.result, routeParams));
			});
	}, logger)(req, res);
};

app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});
app.get('/', (req, res) => res.redirect('/public'));
app.use('/public', (rq, rs, next) => {
	if (rq.path.endsWith('.es6')) {
		rs.setHeader('Content-Type', 'application/javascript');
	}
	next();
});
app.use('/public', express.static(__dirname + '/../public'));

app.get('/gdsDirect/view', withAuth(UserController.getView));
app.get('/autoComplete', (req, res) => {
	res.send(JSON.stringify(CompletionData.getData(req)));
});
app.get('/gdsDirect/themes', (req, res) => res.send(JSON.stringify(
	{"terminalThemes":[{"id":4,"label":"Apollo Default","colors":{"defaultBg":{"background-color":"#191a1b"},"activeWindow":{"background-color":"#2a2835"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#ff0000","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#00ff00"},"specialHighlight":{"color":"#00ff00"},"highlightDark":{"background-color":"#ddeeff","font-weight":"bold"},"highlightLight":{"background-color":"#f40000"},"highlightBlue":{"background-color":"#00029f"},"fixedColumnBackground":{"background-color":"#3deb28"}},"colorsParsed":{"defaultBg-color":{"color":"#191a1b"},"defaultBg-backgroundColor":{"background-color":"#191a1b"},"activeWindow-color":{"color":"#2a2835"},"activeWindow-backgroundColor":{"background-color":"#2a2835"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#ff0000"},"errorMessage-backgroundColor":{"background-color":"#ff0000"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#00ff00"},"startSession-backgroundColor":{"background-color":"#00ff00"},"specialHighlight-color":{"color":"#00ff00"},"specialHighlight-backgroundColor":{"background-color":"#00ff00"},"highlightDark-color":{"color":"#ddeeff"},"highlightDark-backgroundColor":{"background-color":"#ddeeff"},"highlightLight-color":{"color":"#f40000"},"highlightLight-backgroundColor":{"background-color":"#f40000"},"highlightBlue-color":{"color":"#00029f"},"highlightBlue-backgroundColor":{"background-color":"#00029f"},"fixedColumnBackground-color":{"color":"#3deb28"},"fixedColumnBackground-backgroundColor":{"background-color":"#3deb28"}}},{"id":6,"label":"Sabre Default","colors":{"defaultBg":{"background-color":"#000080"},"activeWindow":{"background-color":"#000080"},"entryFont":{"color":"#ffff00"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#fa0000","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#00ff00","font-weight":"bold"},"specialHighlight":{"color":"#35c26e","font-weight":"bold"},"highlightDark":{"background-color":""},"highlightLight":{"background-color":"#751515"},"highlightBlue":{"background-color":"#000000"},"fixedColumnBackground":{"background-color":""}},"colorsParsed":{"defaultBg-color":{"color":"#000080"},"defaultBg-backgroundColor":{"background-color":"#000080"},"activeWindow-color":{"color":"#000080"},"activeWindow-backgroundColor":{"background-color":"#000080"},"entryFont-color":{"color":"#ffff00"},"entryFont-backgroundColor":{"background-color":"#ffff00"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#fa0000"},"errorMessage-backgroundColor":{"background-color":"#fa0000"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#00ff00"},"startSession-backgroundColor":{"background-color":"#00ff00"},"specialHighlight-color":{"color":"#35c26e"},"specialHighlight-backgroundColor":{"background-color":"#35c26e"},"highlightDark-color":{"color":""},"highlightDark-backgroundColor":{"background-color":""},"highlightLight-color":{"color":"#751515"},"highlightLight-backgroundColor":{"background-color":"#751515"},"highlightBlue-color":{"color":"#000000"},"highlightBlue-backgroundColor":{"background-color":"#000000"},"fixedColumnBackground-color":{"color":""},"fixedColumnBackground-backgroundColor":{"background-color":""}}},{"id":8,"label":"Natural Apollo","colors":{"defaultBg":{"background-color":"#3f7b7d"},"activeWindow":{"background-color":"#428284"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#f30912","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#00ff00"},"specialHighlight":{"color":"#eab00b"},"highlightDark":{"background-color":""},"highlightLight":{"background-color":"#eab00b"},"highlightBlue":{"background-color":""},"fixedColumnBackground":{"background-color":""}},"colorsParsed":{"defaultBg-color":{"color":"#3f7b7d"},"defaultBg-backgroundColor":{"background-color":"#3f7b7d"},"activeWindow-color":{"color":"#428284"},"activeWindow-backgroundColor":{"background-color":"#428284"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#f30912"},"errorMessage-backgroundColor":{"background-color":"#f30912"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#00ff00"},"startSession-backgroundColor":{"background-color":"#00ff00"},"specialHighlight-color":{"color":"#eab00b"},"specialHighlight-backgroundColor":{"background-color":"#eab00b"},"highlightDark-color":{"color":""},"highlightDark-backgroundColor":{"background-color":""},"highlightLight-color":{"color":"#eab00b"},"highlightLight-backgroundColor":{"background-color":"#eab00b"},"highlightBlue-color":{"color":""},"highlightBlue-backgroundColor":{"background-color":""},"fixedColumnBackground-color":{"color":""},"fixedColumnBackground-backgroundColor":{"background-color":""}}},{"id":10,"label":"Black on White","colors":{"defaultBg":{"background-color":"#f2f2f2"},"activeWindow":{"background-color":"#ffffff"},"entryFont":{"color":"#0000ff"},"outputFont":{"color":"#000000"},"usedCommand":{"color":"#0000ff","font-weight":"bold"},"errorMessage":{"color":"#ff0000","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#008000","font-weight":"bold"},"specialHighlight":{"color":"#008000","font-weight":"bold"}},"colorsParsed":{"defaultBg-color":{"color":"#f2f2f2"},"defaultBg-backgroundColor":{"background-color":"#f2f2f2"},"activeWindow-color":{"color":"#ffffff"},"activeWindow-backgroundColor":{"background-color":"#ffffff"},"entryFont-color":{"color":"#0000ff"},"entryFont-backgroundColor":{"background-color":"#0000ff"},"outputFont-color":{"color":"#000000"},"outputFont-backgroundColor":{"background-color":"#000000"},"usedCommand-color":{"color":"#0000ff"},"usedCommand-backgroundColor":{"background-color":"#0000ff"},"errorMessage-color":{"color":"#ff0000"},"errorMessage-backgroundColor":{"background-color":"#ff0000"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#008000"},"startSession-backgroundColor":{"background-color":"#008000"},"specialHighlight-color":{"color":"#008000"},"specialHighlight-backgroundColor":{"background-color":"#008000"}}},{"id":12,"label":"CMS Color Scheme","colors":{"defaultBg":{"background-color":"#545e70"},"activeWindow":{"background-color":"#3d4452"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#f60a0c","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#0ff940"},"specialHighlight":{"color":"#44f0f9"}},"colorsParsed":{"defaultBg-color":{"color":"#545e70"},"defaultBg-backgroundColor":{"background-color":"#545e70"},"activeWindow-color":{"color":"#3d4452"},"activeWindow-backgroundColor":{"background-color":"#3d4452"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#f60a0c"},"errorMessage-backgroundColor":{"background-color":"#f60a0c"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#0ff940"},"startSession-backgroundColor":{"background-color":"#0ff940"},"specialHighlight-color":{"color":"#44f0f9"},"specialHighlight-backgroundColor":{"background-color":"#44f0f9"}}},{"id":16,"label":"Exotic Green","colors":{"defaultBg":{"background-color":"#191a1b"},"activeWindow":{"background-color":"#2a2835"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#17f308"},"usedCommand":{"color":"#f1fb33"},"errorMessage":{"color":"#fb1010","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#18fafa"},"specialHighlight":{"color":"#fa70f9"}},"colorsParsed":{"defaultBg-color":{"color":"#191a1b"},"defaultBg-backgroundColor":{"background-color":"#191a1b"},"activeWindow-color":{"color":"#2a2835"},"activeWindow-backgroundColor":{"background-color":"#2a2835"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#17f308"},"outputFont-backgroundColor":{"background-color":"#17f308"},"usedCommand-color":{"color":"#f1fb33"},"usedCommand-backgroundColor":{"background-color":"#f1fb33"},"errorMessage-color":{"color":"#fb1010"},"errorMessage-backgroundColor":{"background-color":"#fb1010"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#18fafa"},"startSession-backgroundColor":{"background-color":"#18fafa"},"specialHighlight-color":{"color":"#fa70f9"},"specialHighlight-backgroundColor":{"background-color":"#fa70f9"}}},{"id":18,"label":"Chocolate","colors":{"defaultBg":{"background-color":"#403835"},"activeWindow":{"background-color":"#483f3b"},"entryFont":{"color":"#f2f2f2"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00","font-weight":"bold"},"errorMessage":{"color":"#ff5252","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#35c26e","font-weight":"bold"},"specialHighlight":{"color":"#00ff00","font-weight":"bold"}},"colorsParsed":{"defaultBg-color":{"color":"#403835"},"defaultBg-backgroundColor":{"background-color":"#403835"},"activeWindow-color":{"color":"#483f3b"},"activeWindow-backgroundColor":{"background-color":"#483f3b"},"entryFont-color":{"color":"#f2f2f2"},"entryFont-backgroundColor":{"background-color":"#f2f2f2"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#ff5252"},"errorMessage-backgroundColor":{"background-color":"#ff5252"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#35c26e"},"startSession-backgroundColor":{"background-color":"#35c26e"},"specialHighlight-color":{"color":"#00ff00"},"specialHighlight-backgroundColor":{"background-color":"#00ff00"}}},{"id":20,"label":"Deep Ocean","colors":{"defaultBg":{"background-color":"#141e29"},"activeWindow":{"background-color":"#192633"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#ff0000"},"warningMessage":{"color":"#65d994"},"startSession":{"color":"#81f7b1"},"specialHighlight":{"color":"#18fafa"}},"colorsParsed":{"defaultBg-color":{"color":"#141e29"},"defaultBg-backgroundColor":{"background-color":"#141e29"},"activeWindow-color":{"color":"#192633"},"activeWindow-backgroundColor":{"background-color":"#192633"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#ff0000"},"errorMessage-backgroundColor":{"background-color":"#ff0000"},"warningMessage-color":{"color":"#65d994"},"warningMessage-backgroundColor":{"background-color":"#65d994"},"startSession-color":{"color":"#81f7b1"},"startSession-backgroundColor":{"background-color":"#81f7b1"},"specialHighlight-color":{"color":"#18fafa"},"specialHighlight-backgroundColor":{"background-color":"#18fafa"}}},{"id":22,"label":"SmartPoint Theme","colors":{"defaultBg":{"background-color":"#4b4b4b"},"activeWindow":{"background-color":"#525151"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#ff0000","font-weight":"bold"},"warningMessage":{"color":"#77fc77"},"startSession":{"color":"#00ff00"},"specialHighlight":{"color":"#7eb9f9"}},"colorsParsed":{"defaultBg-color":{"color":"#4b4b4b"},"defaultBg-backgroundColor":{"background-color":"#4b4b4b"},"activeWindow-color":{"color":"#525151"},"activeWindow-backgroundColor":{"background-color":"#525151"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#ff0000"},"errorMessage-backgroundColor":{"background-color":"#ff0000"},"warningMessage-color":{"color":"#77fc77"},"warningMessage-backgroundColor":{"background-color":"#77fc77"},"startSession-color":{"color":"#00ff00"},"startSession-backgroundColor":{"background-color":"#00ff00"},"specialHighlight-color":{"color":"#7eb9f9"},"specialHighlight-backgroundColor":{"background-color":"#7eb9f9"}}},{"id":24,"label":"Deep Ocean (no highlights)","colors":{"defaultBg":{"background-color":"#141e29"},"activeWindow":{"background-color":"#192633"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffffff"},"errorMessage":{"color":"#ffffff"},"warningMessage":{"color":"#ffffff"},"startSession":{"color":"#ffffff"},"specialHighlight":{"color":"#ffffff"}},"colorsParsed":{"defaultBg-color":{"color":"#141e29"},"defaultBg-backgroundColor":{"background-color":"#141e29"},"activeWindow-color":{"color":"#192633"},"activeWindow-backgroundColor":{"background-color":"#192633"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffffff"},"usedCommand-backgroundColor":{"background-color":"#ffffff"},"errorMessage-color":{"color":"#ffffff"},"errorMessage-backgroundColor":{"background-color":"#ffffff"},"warningMessage-color":{"color":"#ffffff"},"warningMessage-backgroundColor":{"background-color":"#ffffff"},"startSession-color":{"color":"#ffffff"},"startSession-backgroundColor":{"background-color":"#ffffff"},"specialHighlight-color":{"color":"#ffffff"},"specialHighlight-backgroundColor":{"background-color":"#ffffff"}}}],"terminalData":{"rId":0,"isStandAlone":1},"apolloPcc":[],"currency":[],"mileages":[],"scriptStart":"gdsDirect"}
)));
app.get('/terminal/saveSetting/:name/:currentGds/:value', withAuth((reqBody, emcResult, routeParams) => {
	let {name, currentGds, value} = routeParams;
	return new TerminalBaseController(emcResult).saveSettingAction(name, currentGds, value);
}));
app.post('/terminal/saveSetting/:name/:currentGds', withAuth((reqBody, emcResult, routeParams) => {
	let {name, currentGds} = routeParams;
	return new TerminalBaseController(emcResult).postSaveSettingAction(reqBody, name, currentGds);
}));
app.post('/terminal/command', withAuth(GdsSessionController.runInputCmd));
app.post('/gdsDirect/keepAlive', withAuth(GdsSessionController.keepAlive));
app.get('/terminal/getPqItinerary', withAuth(GdsSessionController.getPqItinerary));
app.get('/terminal/importPq', withAuth(GdsSessionController.importPq));
app.get('/terminal/lastCommands', withAuth(GdsSessionController.getLastCommands));
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

app.get('/ping', toHandleHttp((rqBody) => {
	let memory = {};
	const used2 = process.memoryUsage();
	for (let key in used2) {
		memory[key] = Math.round(used2[key] / 1024 / 1024 * 100) / 100;
	}

	return Redis.getInfo().then(redisLines => {
		const data = {
			'dbPool': {
				acquiringConnections: dbPool.pool._acquiringConnections.length,
				allConnections: dbPool.pool._allConnections.length,
				freeConnections: dbPool.pool._freeConnections.length,
				connectionQueue: dbPool.pool._connectionQueue.length
			},
			sockets: {
				'totalConnection': 0,
				'userCount': 0
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
				memory: memory
			},
		};
		console.log(JSON.stringify(data));
		data['msg'] = 'pong';
		return {status: 'OK', result: data};
	});
}));

app.get('/doSomeHeavyStuff', withAuth((reqBody, emcResult) => {
	if (emcResult.user.id == 6206) {
		let hrtimeStart = process.hrtime();
		let sum = 0;
		for (let i = 0; i < 1000000000; ++i) {
			sum += i % 2 ? i : -i;
		}
		let hrtimeDiff = process.hrtime(hrtimeStart);
		return {message: 'Done in ' + hrtimeToDecimal(hrtimeDiff) + ' ' + sum + ' on worker #' + cluster.worker.id};
	} else {
		return Forbidden('Sorry, you must be me in order to use that');
	}
}));

app.listen(Config.HTTP_PORT);

// UnhandledPromiseRejectionWarning
// it's actually pretty weird that we ever get here, probably
// something is wrong with the Promise chain in toHandleHttp()
process.on('unhandledRejection', (exc, promise) => {
	exc = exc || 'Empty error ' + exc;
	let data = typeof exc === 'string' ? exc : {
		message: exc + ' ' + promise,
		stack: exc.stack,
		promise: promise,
		...exc,
	};
	if (shouldDiag(exc)) {
		console.error('Unhandled Promise Rejection', data);
		Diag.error('Unhandled Promise Rejection', data);
	} else {
		console.log('(ignored) Unhandled Promise Rejection', data);
	}
});

let socketIo = initSocketIo();
socketIo.on('connection', /** @param {Socket} socket */ socket => {
	console.log('got a socket connection', socket.id);
	socket.on('message', (data, reply) => {
		console.log('message from client', data);

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
			withAuth(GdsSessionController.runInputCmd)(rq, rs);
		} else if (rq.path === '/gdsDirect/keepAlive') {
			withAuth(GdsSessionController.keepAlive)(rq, rs);
		} else {
			rs.status(501);
			rs.send('Unsupported path - ' + rq.path);
		}
	});
	socket.send({testMessage: 'hello, how are you?'}, (response) => {
		console.log('delivered testMessage to client', response);
	});
});
socketIo.listen(Config.SOCKET_PORT);

