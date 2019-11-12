const GlobalAuthUsers = require('../Repositories/GlobalAuthUsers.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const GdsSessionManager = require('../GdsHelpers/GdsSessionManager.js');
const Debug = require('klesun-node-tools/src/Debug.js');
const LocalDiag = require('../Repositories/LocalDiag.js');

const Emc = require('../LibWrappers/Emc.js');
const {NoContent, Forbidden, NotAuthorized, BadRequest, TooManyRequests, LoginTimeOut, InternalServerError, NotFound} = require('klesun-node-tools/src/Rej.js');
const Diag = require('../LibWrappers/Diag.js');
const FluentLogger = require('../LibWrappers/FluentLogger.js');
const Config = require('../Config.js');
const Agents = require("../Repositories/Agents");
const Agent = require('../DataFormats/Wrappers/Agent.js');
const MaskUtil = require("../Transpiled/Lib/Utils/MaskingUtil");
const {HttpUtil} = require('klesun-node-tools');

const isSystemError = (exc) =>
	!exc.isOk &&
	!NoContent.matches(exc.httpStatusCode) &&
	!BadRequest.matches(exc.httpStatusCode) &&
	!TooManyRequests.matches(exc.httpStatusCode) &&
	!Forbidden.matches(exc.httpStatusCode) &&
	!LoginTimeOut.matches(exc.httpStatusCode);

const toHandleHttp = (httpAction) => (req, res) => {
	return HttpUtil.toHandleHttp(({rqBody, routeParams}) => httpAction(rqBody, routeParams))(req, res)
		.catch(exc => {
			const rqBody = HttpUtil.getRqBody(req);
			const maskedBody = Object.assign({}, rqBody, {
				emcSessionId: '******' + (rqBody.emcSessionId || '').slice(-4),
				globalAuthPassword: '******',
			});
			const errorData = Debug.getExcData(exc, {
				requestPath: req.path,
				message: exc.message || '' + exc,
				httpStatusCode: exc.httpStatusCode,
				requestBody: maskedBody,
				stack: exc.stack,
			});
			if (isSystemError(exc)) {
				let msg = (exc || {}).message || (exc + '');
				if (typeof msg !== 'string') {
					msg = '(non-string message: ' + JSON.stringify(msg) + ')';
				}
				if (msg.match(/42\|Transport\|Temporary network error:unable to reach targeted application/)) {
					LocalDiag({
						type: LocalDiag.types.AMA_TMP_NETWORK_ERROR_UNABLE_TO_REACH,
						data: errorData,
					});
				} else if (msg.match(/Illogical conversation/)) {
					LocalDiag({
						type: LocalDiag.types.AMA_ILLOGICAL_CONVERSATION,
						data: errorData,
					});
				} else if (msg.includes('<faultstring> 18|Application|</faultstring>')) {
					// agent ignored and re-opened PNR, entered same command again (TTH),
					// and it worked, dunno maybe something just failed on Amadeus side...
					LocalDiag({
						type: LocalDiag.types.AMA_APPLICATION,
						data: errorData,
					});
				} else {
					const msg = 'HTTP request failed';
					if (process.env.NODE_ENV === 'development') {
						console.error(msg, '\n' + JSON.stringify(errorData));
					}
					Diag.logExc(msg, errorData);
				}
			}
		});
};

/** @param {{data: IEmcResult}} emcData */
const normalizeRqBody = (rqBody, emcData) => {
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
const normalizeForeignProjectEmcData = async (emcData) => {
	const row = await Agents.getById(emcData.data.user.id);
	const roles = (row.data || {}).roles || [];
	emcData.data.user.roles = roles;
	return emcData;
};

const getGlobalAuthData = (login, password) => {
	return GlobalAuthUsers.getByLogin(login, password)
		.then(user => ({
			data: {
				user: {
					id: user.id,
					displayName: user.login,
					roles: user.roles || [],
					allowedPccRecs: user.allowedPccRecs || [],
				},
			},
		}));
};

const withAuth = (userAction) => (req, res) => {
	return toHandleHttp(async (rqBody, routeParams) => {
		if (typeof userAction !== 'function') {
			return InternalServerError('Action is not a function - ' + userAction);
		}
		const isGlobalAuth = rqBody.globalAuthLogin && rqBody.globalAuthPassword;
		const whenEmcData = isGlobalAuth
			? getGlobalAuthData(rqBody.globalAuthLogin, rqBody.globalAuthPassword)
			: Emc.getCachedSessionInfo(rqBody.emcSessionId);

		let emcData = await whenEmcData;
		rqBody = {...rqBody};
		emcData = {...emcData};
		delete rqBody.emcSessionId;
		delete rqBody.globalAuthPassword;

		if (rqBody.isForeignProjectEmcId) {
			emcData = await normalizeForeignProjectEmcData(emcData).catch(exc => emcData);
		}
		if (!isGlobalAuth) {
			// all EMC users are supposed have these rights, but it probably
			// would make sense to make them configurable in EMC as well in future
			emcData.data.user.roles.push('can_save_pnr');
		}
		for (const role of rqBody.disabledRoles || []) {
			// for debug
			const i = emcData.data.user.roles.indexOf(role);
			if (i > -1) {
				emcData.data.user.roles.splice(i, 1);
			}
		}
		rqBody = normalizeRqBody(rqBody, emcData);
		return Promise.resolve()
			.then(() => userAction(rqBody, emcData.data, routeParams));
	})(req, res);
};

/** @param {function({rqBody, session, emcUser}): Promise} sessionAction */
const withGdsSession = (sessionAction, canStartNew = false) => (req, res, protocolSpecific = {}) => {
	return withAuth(async (rqBody) => {
		const askClient = protocolSpecific.askClient || null;
		const emcUser = rqBody.emcUser;
		const agent = Agent(emcUser);
		const {startedNew, session} = await GdsSessionManager.getSession({rqBody, emcUser, canStartNew});
		delete(rqBody.emcUser);
		delete(rqBody.emcSessionId);

		const briefing = req.path === '/terminal/command' ? ' >' + rqBody.command + ';' : '';
		const msg = 'TODO: Processing HTTP RQ ' + req.path + briefing;
		const startMs = Date.now();
		FluentLogger.logit(msg, session.logId, {rqBody, protocol: protocolSpecific.protocol || 'http'});
		return Promise.resolve()
			.then(() => sessionAction({rqBody, session, emcUser, askClient}))
			.then(result => {
				if (startedNew) {
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
				const msg = 'ERROR: HTTP RQ was not satisfied ' + (exc.httpStatusCode || '(runtime error)');
				FluentLogger.logExc(msg, session.logId, exc);
				exc.session = session;
				return Promise.reject(exc);
			});
	})(req, res);
};

// UnhandledPromiseRejectionWarning
process.on('unhandledRejection', async (exc, promise) => {
	exc = exc || 'Empty error ' + exc;
	const dataStr = typeof exc === 'string' ? exc : Debug.jsExport({
		message: exc + '',
		stack: exc.stack,
		promise: promise,
		...exc,
	});
	if (isSystemError(exc)) {
		if (!Config.production) {
			console.error('Unhandled Promise Rejection', dataStr);
		}
		Diag.logExc('Unhandled Promise Rejection', dataStr);
	}
});

exports.toHandleHttp = toHandleHttp;
exports.withAuth = withAuth;
exports.withGdsSession = withGdsSession;
