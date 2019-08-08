const GdsSessions = require('../Repositories/GdsSessions.js');
const GdsProfiles = require('../Repositories/GdsProfiles.js');
let {TRAVELPORT, AMADEUS, SABRE} = GdsProfiles;
const PersistentHttpRq = require('../../node_modules/klesun-node-tools/src/Utils/PersistentHttpRq.js');
const MaskUtil = require('../Transpiled/Lib/Utils/MaskUtil.js');
const FluentLogger = require('../LibWrappers/FluentLogger.js');

const AmadeusClient = require("../GdsClients/AmadeusClient.js");
const SabreClient = require("../GdsClients/SabreClient.js");
const TravelportClient = require('../GdsClients/TravelportClient.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');
const {jsExport} = require('klesun-node-tools/src/Debug.js');

const makeHttpRqBriefing = (rqBody, gds) => {
	let match;
	if (['apollo', 'galileo'].includes(gds)) {
		if (match = rqBody.match(/:Request>\s*<(\w+)>/)) {
			return '<' + match[1] + '/>';
		} else if (match = rqBody.match(/:Request>\s*(.+?)\s*<\//)) {
			return '>' + match[1] + ';';
		}
	} else if (gds === 'amadeus') {
		if (match = rqBody.match(/:textStringDetails>\s*(.+?)\s*<\//)) {
			return '>' + match[1] + ';';
		} else if (match = rqBody.match(/:Body>\s*<\w+:(\w+)/)) {
			return '<' + match[1] + '>';
		}
	} else if (gds === 'sabre') {
		if (match = rqBody.match(/:HostCommand>\s*(.+?)\s*<\//)) {
			return '>' + match[1] + ';';
		}
	}
	return '';
};

const maskRqBody = (rqBody, gds) => {
	if (gds === 'amadeus') {
		rqBody = rqBody.replace(/(<\w+:Username\b[^>]*>)[^<]+(<\/\w+:Username>)/g, '$1GRECTMASKED$2');
		rqBody = rqBody.replace(/(<\w+:Password\b[^>]*>)[^<]+(<\/\w+:Password>)/g, '$1GRECTMASKED$2');
	}
	return rqBody;
};

const initHttpRqFor = ({logId, gds}) => (params) => {
	let whenResult = PersistentHttpRq(params);
	let logit = (msg, data) => {
		let masked = MaskUtil.maskCcNumbers(data);
		FluentLogger.logit(msg, logId, masked);
		if (process.env.NODE_ENV !== 'production') {
			console.log(logId + ': ' + msg, typeof masked === 'string' ? masked : jsExport(masked));
		}
	};
	let briefing = makeHttpRqBriefing(params.body, gds);
	let masked = maskRqBody(params.body, gds);
	logit('XML RQ: ' + briefing, masked);
	return whenResult
		.then(result => {
			logit('XML RS:', result.body);
			return result;
		})
		.catch(coverExc([Rej.BadGateway], (exc) => {
			logit('ERROR: (XML RS)', exc.data.body);
			return Promise.reject(exc);
		}));
};

const initHttpRq = (session) => initHttpRqFor({
	logId: session.logId,
	gds: session.context.gds,
});

/**
 * the entity which StatefulSession.js uses to invoke the commands - be careful not
 * to use it where some more GDS-specific session or StatefulSession is needed
 *
 * also note that this entity represents an _existing_
 * session - it does not implicitly start/restart/close it
 *
 * @param session = at('GdsSessions.js').makeSessionRecord()
 */
const GdsSession = ({session}) => {
	let gds = session.context.gds;
	let httpRq = GdsSession.initHttpRq(session);
	let runByGds = (cmd) => {
		if (['apollo', 'galileo'].includes(gds)) {
			let travelport = TravelportClient({PersistentHttpRq: httpRq});
			return travelport.runCmd({command: cmd}, session.gdsData);
		} else if (gds === 'amadeus') {
			let amadeus = AmadeusClient.makeCustom({PersistentHttpRq: httpRq});
			return amadeus.runCmd({command: cmd}, session.gdsData);
		} else if (gds === 'sabre') {
			let sabre = SabreClient.makeCustom({PersistentHttpRq: httpRq});
			return sabre.runCmd({command: cmd}, session.gdsData);
		} else {
			return Rej.NotImplemented('Unsupported stateful GDS - ' + gds);
		}
	};
	return {
		runCmd: runByGds,
	};
};

GdsSession.initHttpRq = initHttpRq;

GdsSession.startByGds = async (gds) => {
	let logId = await FluentLogger.logNewId(gds);
	let loggingHttpRq = initHttpRqFor({logId, gds});
	let amadeus = AmadeusClient.makeCustom({PersistentHttpRq: loggingHttpRq});
	// make sure we mask passwords before adding http logging for rest GDS-es
	let travelport = TravelportClient();
	let sabre = SabreClient.makeCustom();
	let tuples = [
		['apollo' , travelport, TRAVELPORT.DynApolloProd_2F3K],
		['galileo', travelport, TRAVELPORT.DynGalileoProd_711M],
		['amadeus', amadeus   , AMADEUS.AMADEUS_PROD_1ASIWTUTICO],
		['sabre'  , sabre     , SABRE.SABRE_PROD_L3II],
	];
	for (let [clientGds, client, profileName] of tuples) {
		if (gds === clientGds) {
			let limit = await GdsProfiles.getLimit(gds, profileName);
			let taken = await GdsSessions.countActive(gds, profileName);
			if (limit !== null && taken >= limit) {
				// actually, instead of returning error, we could close the most
				// inactive session of another agent (idle for at least 10 minutes)
				let msg = 'Too many sessions, ' + taken + ' (>= ' + limit + ') opened ' +
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