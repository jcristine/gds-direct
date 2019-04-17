
let Emc = require('../LibWrappers/Emc.js');
let {NoContent, Forbidden, NotAuthorized, BadRequest, TooManyRequests, NotImplemented, LoginTimeOut, InternalServerError, NotFound} = require('../Utils/Rej.js');
let Diag = require('../LibWrappers/Diag.js');
let FluentLogger = require('../LibWrappers/FluentLogger.js');
const {getExcData} = require('../Utils/Misc.js');
const php = require('../Transpiled/php.js');
const GdsSessions = require("../Repositories/GdsSessions");
const GdsSessionsController = require("./GdsSessionController");
const Config = require('../Config.js');
const Agents = require("../Repositories/Agents");
const Agent = require('../DataFormats/Wrappers/Agent.js');
const Misc = require("../Transpiled/Lib/Utils/Misc");

let isSystemError = (exc) =>
	!NoContent.matches(exc.httpStatusCode) &&
	!BadRequest.matches(exc.httpStatusCode) &&
	!TooManyRequests.matches(exc.httpStatusCode) &&
	!Forbidden.matches(exc.httpStatusCode) &&
	!LoginTimeOut.matches(exc.httpStatusCode) &&
	!NotImplemented.matches(exc.httpStatusCode);

let toHandleHttp = (httpAction) => (req, res) => {
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
	return Promise.resolve()
		.then(() => httpAction(rqBody, req.params))
		.catch(exc => {
			let excData = getExcData(exc);
			if (typeof excData === 'string') {
				excData = new Error('HTTP action failed - ' + excData);
			}
			excData.httpStatusCode = exc.httpStatusCode || 520;
			return Promise.reject(excData);
		})
		.then(result => {
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
			res.send(php.json_encode({error: (exc.message || exc + '').replace(/^Error: /, '')}));
			let errorData = getExcData(exc, {
				message: exc.message || '' + exc,
				httpStatusCode: exc.httpStatusCode,
				requestPath: req.path,
				requestBody: maskedBody,
				stack: exc.stack,
			});
			if (isSystemError(exc)) {
				Diag.logExc('HTTP request failed', errorData);
			}
		});
};

/** @param {{data: IEmcResult}} emcData */
let normalizeRqBody = (rqBody, emcData) => {
	return {
		...rqBody,
		emcUser: emcData.data.user,
	};
};

/**
 * may be needed in SCS project for example, as they are currently
 * passing just their token instead of authorizing in GDSD
 * and when they do so, 'roles' contains the roles of _their_ project, not of GDSD
 */
let normalizeForeignProjectEmcData = async (emcData) => {
	let row = await Agents.getById(emcData.data.user.id);
	let roles = row.roles ? row.roles.split(',') : [];
	emcData.data.user.roles = roles;
	return emcData;
};

let withAuth = (userAction) => (req, res) => {
	return toHandleHttp((rqBody, routeParams) => {
		if (typeof userAction !== 'function') {
			return InternalServerError('Action is not a function - ' + userAction);
		}
		return Emc.getCachedSessionInfo(rqBody.emcSessionId)
			.catch(exc => {
				let error = new Error('EMC auth error - ' + exc);
				error.httpStatusCode = (exc + '').match(/Session not found/)
					? LoginTimeOut.httpStatusCode
					: NotAuthorized.httpStatusCode;
				error.stack += '\nCaused by:\n' + exc.stack;
				return Promise.reject(error);
			})
			.then(async emcData => {
				if (rqBody.isForeignProjectEmcId) {
					emcData = await normalizeForeignProjectEmcData(emcData).catch(exc => emcData);
				} else if (rqBody.disableAllRoles) {
					// for debug - to test app behaviour for simple agents
					emcData.data.user.roles = [];
				}
				rqBody = normalizeRqBody(rqBody, emcData);
				return Promise.resolve()
					.then(() => userAction(rqBody, emcData.data, routeParams));
			});
	})(req, res);
};

/** @param {function({rqBody, session, emcUser}): Promise} sessionAction */
let withGdsSession = (sessionAction, canStartNew = false) => (req, res) => {
	return withAuth(async (rqBody) => {
		let emcUser = rqBody.emcUser;
		let agent = Agent(emcUser);
		let startNewSession = false;
		let session = await GdsSessions.getByContext(rqBody, emcUser)
			.catch(exc => {
				if (NotFound.matches(exc.httpStatusCode)) {
					if (canStartNew) {
						startNewSession = true;
						return GdsSessionsController.startNewSession(rqBody, emcUser)
							.then(session => {
								FluentLogger.logit('INFO: emcUser', session.logId, emcUser);
								return session;
							});
					} else {
						exc.httpStatusCode = LoginTimeOut.httpStatusCode;
						return Promise.reject(exc);
					}
				} else {
					return Promise.reject(exc);
				}
			});
		delete(rqBody.emcUser);
		delete(rqBody.emcSessionId);

		let briefing = req.path === '/terminal/command' ? ' >' + rqBody.command + ';' : '';
		let msg = 'TODO: Processing HTTP RQ ' + req.path + briefing;
		let startMs = Date.now();
		FluentLogger.logit(msg, session.logId, rqBody);
		return Promise.resolve()
			.then(() => sessionAction({rqBody, session, emcUser}))
			.then(result => {
				if (startNewSession) {
					result.startNewSession = true;
				}
				if (!agent.canSeeCcNumbers()) {
					result = Misc.maskCcNumbers(result);
				}
				//                 'TODO: Processing HTTP RQ'
				FluentLogger.logit('................ HTTP RS (in ' + ((Date.now() - startMs) / 1000).toFixed(3) + ' s.)', session.logId, result);
				return Promise.resolve(result);
			})
			.catch(exc => {
				let msg = 'ERROR: HTTP RQ was not satisfied ' + (exc.httpStatusCode || '(runtime error)');
				FluentLogger.logExc(msg, session.logId, exc);
				exc.session = session;
				return Promise.reject(exc);
			});
	})(req, res);
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
	if (isSystemError(exc)) {
		if (!Config.production) {
			console.error('Unhandled Promise Rejection', data);
		}
	}
});

exports.toHandleHttp = toHandleHttp;
exports.withAuth = withAuth;
exports.withGdsSession = withGdsSession;
