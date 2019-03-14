
let Emc = require('../LibWrappers/Emc.js');
let {Forbidden, BadRequest, NotImplemented, LoginTimeOut, InternalServerError} = require('../Utils/Rej.js');
let Db = require('../Utils/Db.js');
let Diag = require('../LibWrappers/Diag.js');
let FluentLogger = require('../LibWrappers/FluentLogger.js');
const {getExcData} = require('../Utils/Misc.js');
const php = require('../Transpiled/php.js');

let shouldDiag = (exc) =>
	!BadRequest.matches(exc.httpStatusCode) &&
	!Forbidden.matches(exc.httpStatusCode) &&
	!LoginTimeOut.matches(exc.httpStatusCode) &&
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
			let excData = getExcData(exc);
			if (typeof excData === 'string') {
				excData = new Error('HTTP action failed - ' + exc);
			} else {
				excData.message = 'HTTP action failed - ' + excData.message;
				let cause = excData.stack ? '\nCaused by:\n' + excData.stack : '';
				excData.stack = new Error().stack + cause;
			}
			excData.httpStatusCode = exc.httpStatusCode || 520;
			return Promise.reject(excData);
		})
		.then(result => {
			log('HTTP action result:', result);
			res.setHeader('Content-Type', 'application/json');
			res.status(200);
			// not JSON.stringify, because there are a lot of transpiled parsers that
			// assign keys to an [] and they will be missing in normal JSON.stringify
			res.send(php.json_encode(Object.assign({
				rqTakenMs: rqTakenMs,
				rsSentMs: Date.now(),
				message: 'GRECT HTTP OK',
			}, result)));
		})
		.catch(exc => {
			exc = exc || 'Empty error ' + exc;
			res.status(exc.httpStatusCode || 500);
			res.setHeader('Content-Type', 'application/json');
			res.send(php.json_encode({error: exc.message || exc + '', processLogId: logId}));
			let errorData = getExcData(exc, {
				message: exc.message || '' + exc,
				httpStatusCode: exc.httpStatusCode,
				requestPath: req.path,
				requestBody: maskedBody,
				stack: exc.stack,
				processLogId: logId,
			});
			if (shouldDiag(exc)) {
				FluentLogger.logExc('ERROR: HTTP request failed', logId, errorData);
				Diag.error('HTTP request failed', errorData);
			} else {
				log('HTTP request was not satisfied', errorData);
			}
		});
};

/** @param {{data: IEmcResult}} emcData */
let normalizeRqBody = (rqBody, emcData, logId) => {
	return {
		emcUser: emcData.data.user,
		agentId: +emcData.data.user.id,
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
		if (typeof action !== 'function') {
			return InternalServerError('Action is not a function - ' + action);
		}
		return Emc.getCachedSessionInfo(rqBody.emcSessionId)
			.catch(exc => {
				let error = new Error('EMC auth error - ' + exc);
				error.httpStatusCode = 401;
				error.stack += '\nCaused by:\n' + exc.stack;
				return Promise.reject(error);
			})
			.then(emcData => {
				rqBody = normalizeRqBody(rqBody, emcData, logId);
				log('Authorized agent: ' + rqBody.agentId + ' ' + emcData.data.user.displayName, emcData.data.user.roles);
				logToTable(rqBody.agentId);
				return Promise.resolve()
					.then(() => action(rqBody, emcData.data, routeParams));
			});
	}, logger)(req, res);
};

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
	// ignoring for now because this event appears to fire even if you _did_ catch
	// rejection, dunno if it's v8 bug or my misunderstanding of how it should work
	// for example: calling runInSession() at GdsSessionController.js results in rejection
	// if token is outdated - you can see me catching it in runInputCmdRestartAllowed() and
	// client does receive response generated in this catch, but 'unhandledRejection' fires
	// nevertheless, with almost empty stack trace (just the PersistentHttpRq.js)
	//if (shouldDiag(exc)) {
	//	console.error('Unhandled Promise Rejection', data);
	//	Diag.error('Unhandled Promise Rejection', data);
	//} else {
	//	console.log('(ignored) Unhandled Promise Rejection', data);
	//}
});

exports.toHandleHttp = toHandleHttp;
exports.withAuth = withAuth;
