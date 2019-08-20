const crypto = require('crypto');
const GdsSessions = require('../Repositories/GdsSessions.js');
const GdsProfiles = require('../Repositories/GdsProfiles.js');
const {TRAVELPORT, AMADEUS, SABRE} = GdsProfiles;
const MaskUtil = require('../Transpiled/Lib/Utils/MaskUtil.js');
const FluentLogger = require('../LibWrappers/FluentLogger.js');

const AmadeusClient = require("../GdsClients/AmadeusClient.js");
const SabreClient = require("../GdsClients/SabreClient.js");
const TravelportClient = require('../GdsClients/TravelportClient.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');
const {jsExport} = require('klesun-node-tools/src/Debug.js');

/** @param {String} rqBody */
const makeHttpRqBriefing = (rqBody, gds) => {
	let match;
	if (['apollo', 'galileo'].includes(gds)) {
		if (match = rqBody.match(/:Request>\s*<(\w+)>/)) {
			return '<' + match[1] + '/>';
		} else if (match = rqBody.match(/:BeginSession>/)) {
			return '<BeginSession/>';
		} else if (match = rqBody.match(/:EndSession>/)) {
			return '<EndSession/>';
		} else if (match = rqBody.match(/:Request>\s*(.+?)\s*<\//)) {
			return '>' + match[1] + ';';
		}
	} else if (gds === 'amadeus') {
		if (match = rqBody.match(/:textStringDetails>\s*(.+?)\s*<\//)) {
			let briefing = '>' + match[1] + ';';
			if (rqBody.includes('TransactionStatusCode="Start"')) {
				if (match = rqBody.match(/ PseudoCityCode="(\w+?)"/)) {
					briefing += ' start ' + match[1];
				}
			}
			return briefing;
		} else if (match = rqBody.match(/:Body>\s*<\w+:(\w+)/)) {
			return '<' + match[1] + '>';
		}
	} else if (gds === 'sabre') {
		if (match = rqBody.match(/:HostCommand>\s*(.+?)\s*<\//)) {
			return '>' + match[1] + ';';
		} else if (match = rqBody.match(/:SessionCreateRQ>/)) {
			return '<SessionCreateRQ/>';
		} else if (match = rqBody.match(/:SessionCloseRQ>/)) {
			return '<SessionCloseRQ/>';
		} else if (match = rqBody.match(/:Body><\w+:(\w+)/)) {
			return '<' + match[1] + '/>';
		}
	}
	return '';
};

const maskRqBody = (rqBody, gds) => {
	if (gds === 'amadeus') {
		rqBody = rqBody.replace(/(<\w+:Username\b[^>]*>)[^<]+(<\/\w+:Username>)/g, '$1GRECTMASKED$2');
		rqBody = rqBody.replace(/(<\w+:Password\b[^>]*>)[^<]+(<\/\w+:Password>)/g, '$1GRECTMASKED$2');
	} else if (gds === 'sabre') {
		rqBody = rqBody.replace(/(<\w+:Username>)[^<]+(<\/\w+:Username>)/g, '$1GRECTMASKED$2');
		rqBody = rqBody.replace(/(<\w+:Password>)[^<]+(<\/\w+:Password>)/g, '$1GRECTMASKED$2');
	}
	return rqBody;
};

const initHttpRqFor = ({
	logId, gds,
	PersistentHttpRq = require('klesun-node-tools/src/Utils/PersistentHttpRq.js'),
}) => (params) => {
	const whenResult = PersistentHttpRq(params);
	const logit = (msg, data) => {
		const masked = MaskUtil.maskCcNumbers(data);
		FluentLogger.logit(msg, logId, masked);
		if (process.env.NODE_ENV === 'development') {
			console.log(logId + ': ' + msg, typeof masked === 'string' ? masked : jsExport(masked));
		}
	};
	const briefing = makeHttpRqBriefing(params.body, gds);
	const masked = maskRqBody(params.body, gds);
	// for multi-session logging
	const refNum = crypto.createHash('md5')
		.update(Math.random() + '')
		.digest('hex')
		.slice(0, 6);
	logit('XML RQ: ' + briefing + ' ' + refNum, masked);
	return whenResult
		.then(result => {
			logit('XML RS:' + ' ' + refNum, result.body);
			return result;
		})
		.catch(coverExc([Rej.BadGateway], (exc) => {
			const body = (exc.data || {}).body;
			if (body) {
				logit('ERROR: (XML RS)', body);
			}
			return Promise.reject(exc);
		}));
};

const initHttpRq = (session) => initHttpRqFor({
	logId: session.logId,
	gds: session.context.gds,
});

const makeGdsClients = ({
	logId, gds,
	PersistentHttpRq = require('klesun-node-tools/src/Utils/PersistentHttpRq.js'),
	GdsProfiles = require('../Repositories/GdsProfiles.js'),
	randomBytes = (size) => crypto.randomBytes(size),
	now = () => Date.now(),
}) => {
	const loggingHttpRq = initHttpRqFor({logId, gds, PersistentHttpRq});
	const travelport = TravelportClient({PersistentHttpRq: loggingHttpRq, GdsProfiles});
	const sabre = SabreClient.makeCustom({PersistentHttpRq: loggingHttpRq, GdsProfiles});
	const amadeus = AmadeusClient.makeCustom({
		PersistentHttpRq: loggingHttpRq,
		GdsProfiles, randomBytes, now,
	});
	return {travelport, amadeus, sabre};
};

/**
 * the entity which StatefulSession.js uses to invoke the commands - be careful not
 * to use it where some more GDS-specific session or StatefulSession is needed
 *
 * also note that this entity represents an _existing_
 * session - it does not implicitly start/restart/close it
 *
 * @param session = at('GdsSessions.js').makeSessionRecord()
 */
const GdsSession = ({
	session,
	gdsClients = makeGdsClients({
		gds: session.context.gds,
		logId: session.logId,
	}),
}) => {
	const gds = session.context.gds;
	const {travelport, sabre, amadeus} = gdsClients;
	const runByGds = (cmd) => {
		if (['apollo', 'galileo'].includes(gds)) {
			return travelport.runCmd({command: cmd}, session.gdsData);
		} else if (gds === 'amadeus') {
			return amadeus.runCmd({command: cmd}, session.gdsData);
		} else if (gds === 'sabre') {
			return sabre.runCmd({command: cmd}, session.gdsData);
		} else {
			return Rej.NotImplemented('Unsupported stateful GDS - ' + gds);
		}
	};
	return {
		runCmd: runByGds,
	};
};

GdsSession.makeGdsClients = makeGdsClients;

GdsSession.initHttpRq = initHttpRq;

GdsSession.startByGds = async (gds) => {
	const logId = await FluentLogger.logNewId(gds);
	const {travelport, sabre, amadeus} = makeGdsClients({logId, gds});
	const tuples = [
		['apollo' , travelport, TRAVELPORT.DynApolloProd_2F3K],
		['galileo', travelport, TRAVELPORT.DynGalileoProd_711M],
		['amadeus', amadeus   , AMADEUS.AMADEUS_PROD_1ASIWTUTICO],
		['sabre'  , sabre     , SABRE.SABRE_PROD_L3II],
	];
	for (const [clientGds, client, profileName] of tuples) {
		if (gds === clientGds) {
			const limit = await GdsProfiles.getLimit(gds, profileName);
			const taken = await GdsSessions.countActive(gds, profileName);
			if (limit !== null && taken >= limit) {
				// actually, instead of returning error, we could close the most
				// inactive session of another agent (idle for at least 10 minutes)
				const msg = 'Too many sessions, ' + taken + ' (>= ' + limit + ') opened ' +
					'for this GDS profile ATM. Wait for few minutes and try again.';
				return Rej.ServiceUnavailable(msg);
			} else {
				return client.startSession({profileName})
					.then(gdsData => ({...gdsData, profileName}))
					.then(gdsData => ({gdsData, limit, taken, logId}));
			}
		}
	}
	return Rej.NotImplemented('Unsupported GDS ' + gds + ' for session creation');
};

module.exports = GdsSession;