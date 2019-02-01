
let express = require('express');
let UserController = require('./UserController.js');
let CompletionData = require('./CompletionData.js');
let Emc = require('./App/Api/Clients/Emc.js');
let GdsSessionController = require('./GdsSessionController.js');
let TerminalBaseController = require('./Transpiled/App/Controllers/TerminalBaseController.js');
let {hrtimeToDecimal} = require('./Utils/Misc.js');
let {Forbidden, NotImplemented} = require('./Utils/Rej.js');
let cluster = require('cluster');
let {admins} = require('./Constants.js');
let UpdateHighlightRulesFromProd = require('./Actions/UpdateHighlightRulesFromProd.js');
let Db = require('./Utils/Db.js');
let Diag = require('./LibWrappers/Diag.js');
let FluentLogger = require('./LibWrappers/FluentLogger.js');
let HighlightRulesRepository = require('./Actions/HighlightRulesRepository.js');
let dbPool = require('./App/Classes/Sql.js');
let Redis = require('./LibWrappers/Redis.js');
let initSocketIo = require('socket.io');
let Config = require('./Config.js');
let GdsSessions = require('./Repositories/GdsSessions.js');
const CommandParser = require("./Transpiled/Gds/Parsers/Apollo/CommandParser");
const PnrParser = require("./Transpiled/Gds/Parsers/Apollo/Pnr/PnrParser");
const FareConstructionParser = require("./Transpiled/Gds/Parsers/Common/FareConstruction/FareConstructionParser");

let app = express();

let shouldDiag = (exc) =>
	!Forbidden.matches(exc.httpStatusCode) &&
	!NotImplemented.matches(exc.httpStatusCode);

let toHandleHttp = (action, logger = null) => (req, res) => {
	let log = logger ? logger.log : (() => {});
	let logId = logger ? logger.logId :null;
	let rqBody = req.body;
	let rqTakenMs = Date.now();
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
				rqTakenMs: rqTakenMs,
				rsSentMs: Date.now(),
				message: 'GRECT HTTP OK', workerId: (cluster.worker || {}).id,
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
				processLogId: logId,
			};
			if (shouldDiag(exc)) {
				FluentLogger.logExc('ERROR: HTTP request failed', logId, errorData);
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
	if (rq.path.endsWith('.js')) {
		rs.setHeader('Content-Type', 'application/javascript');
	}
	next();
});
app.use('/public', express.static(__dirname + '/../public'));

app.get('/gdsDirect/view', withAuth(UserController.getView));
app.get('/autoComplete', (req, res) => {
	res.send(JSON.stringify(CompletionData.getData(req)));
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
app.post('/admin/terminal/themes/save', withAuth(rqBody => {
	return Db.with(db => db.writeRows('terminalThemes', [{
		id: rqBody.id || undefined,
		label: rqBody.label,
		colors: JSON.stringify(rqBody.colors || {}),
	}]));
}));
app.post('/admin/terminal/themes/delete', withAuth(rqBody => {
	let sql = 'DELETE FROM terminalThemes WHERE id = ?';
	return Db.with(db => db.query(sql, [rqBody.id]))
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

/** @param session = at('GdsSessions.js').makeSessionRecord() */
let transformSession = (session) => {
	return {
		"id": session.id,
		"externalId": session.sessionData.rbsSessionId || JSON.stringify(session.sessionData),
		"agentId": session.context.agentId,
		"gds": session.context.gds,
		"requestId": session.context.travelRequestId,
		"startTime": new Date(session.createdMs).toISOString(),
		"endTime": null,
		"logId": session.logId,
		"isRestarted": false,
		"startTimestamp": Math.floor(session.createdMs / 1000),
		"accessMs": session.accessMs,
		"useRbs": session.context.useRbs,
	};
};

app.post('/admin/terminal/sessionsGet', toHandleHttp(async rqBody => {
	let sessions = await GdsSessions.getAll();
	return {
		aaData: sessions.map(transformSession),
	};
}));

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
let safe = getter => {
	try {
		return getter();
	} catch (exc) {
		return null;
	}
};
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

