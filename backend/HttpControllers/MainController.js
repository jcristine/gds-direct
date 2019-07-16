
let Emc = require('../LibWrappers/Emc.js');
let {NoContent, Forbidden, NotAuthorized, BadRequest, TooManyRequests, LoginTimeOut, InternalServerError, NotFound} = require('klesun-node-tools/src/Rej.js');
let Diag = require('../LibWrappers/Diag.js');
let FluentLogger = require('../LibWrappers/FluentLogger.js');
const {getExcData} = require('../Utils/TmpLib.js');
const GdsSessions = require("../Repositories/GdsSessions");
const GdsSessionsController = require("./GdsSessionController");
const Config = require('../Config.js');
const Agents = require("../Repositories/Agents");
const Agent = require('../DataFormats/Wrappers/Agent.js');
const MaskUtil = require("../Transpiled/Lib/Utils/MaskUtil");
const {HttpUtil} = require('klesun-node-tools');
const TmpLib = require('../Utils/TmpLib.js');

let isSystemError = (exc) =>
	!exc.isOk &&
	!NoContent.matches(exc.httpStatusCode) &&
	!BadRequest.matches(exc.httpStatusCode) &&
	!TooManyRequests.matches(exc.httpStatusCode) &&
	!Forbidden.matches(exc.httpStatusCode) &&
	!LoginTimeOut.matches(exc.httpStatusCode);

let toHandleHttp = (httpAction) => (req, res) => {
	return HttpUtil.toHandleHttp(({rqBody, routeParams}) => httpAction(rqBody, routeParams))(req, res)
		.catch(exc => {
			let rqBody = HttpUtil.getRqBody(req);
			let maskedBody = Object.assign({}, rqBody, {
				emcSessionId: '******' + (rqBody.emcSessionId || '').slice(-4),
			});
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
			.then(TmpLib.addPerformanceDebug('EMC session info'))
			.catch(exc => {
				let error = new Error('EMC auth error - ' + exc);
				error.httpStatusCode = (exc + '').match(/Session not found/)
					? LoginTimeOut.httpStatusCode
					: NotAuthorized.httpStatusCode;
				error.stack += '\nCaused by:\n' + exc.stack;
				return Promise.reject(error);
			})
			.then(async emcData => {
				rqBody = {...rqBody};
				emcData = {...emcData};
				delete(rqBody.emcSessionId);
				if (rqBody.isForeignProjectEmcId) {
					emcData = await normalizeForeignProjectEmcData(emcData).catch(exc => emcData);
				}
				for (let role of rqBody.disabledRoles || []) {
					// for debug
					let i = emcData.data.user.roles.indexOf(role);
					if (i > -1) {
						emcData.data.user.roles.splice(i, 1);
					}
				}
				rqBody = normalizeRqBody(rqBody, emcData);
				return Promise.resolve()
					.then(() => userAction(rqBody, emcData.data, routeParams))
					.then(TmpLib.addPerformanceDebug('Route action', emcData));
			});
	})(req, res);
};

/** @param {function({rqBody, session, emcUser}): Promise} sessionAction */
let withGdsSession = (sessionAction, canStartNew = false) => (req, res, protocolSpecific = {}) => {
	return withAuth(async (rqBody) => {
		let askClient = protocolSpecific.askClient || null;
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
			})
			.then(TmpLib.addPerformanceDebug('GDS Session'));
		delete(rqBody.emcUser);
		delete(rqBody.emcSessionId);

		let briefing = req.path === '/terminal/command' ? ' >' + rqBody.command + ';' : '';
		let msg = 'TODO: Processing HTTP RQ ' + req.path + briefing;
		let startMs = Date.now();
		FluentLogger.logit(msg, session.logId, {rqBody, protocol: protocolSpecific.protocol || 'http'});
		return Promise.resolve()
			.then(() => sessionAction({rqBody, session, emcUser, askClient}))
			.then(TmpLib.addPerformanceDebug('Session action', session))
			.then(result => {
				if (startNewSession) {
					result.startNewSession = true;
				}
				if (!agent.canSeeCcNumbers()) {
					result = MaskUtil.maskCcNumbers(result);
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
process.on('unhandledRejection', (exc, promise) => {
	exc = exc || 'Empty error ' + exc;
	let data = typeof exc === 'string' ? exc : {
		message: exc + ' ' + promise,
		stack: exc.stack,
		promise: promise,
		...exc,
	};
	if (isSystemError(exc)) {
		// TODO: report to diag, the reason it was disabled
		//  was caused by code mistake as it appears
		if (!Config.production) {
			console.error('Unhandled Promise Rejection', data);
		}
	}
});

exports.toHandleHttp = toHandleHttp;
exports.withAuth = withAuth;
exports.withGdsSession = withGdsSession;
