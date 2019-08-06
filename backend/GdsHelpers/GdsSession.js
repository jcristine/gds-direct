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
		if (match = rqBody.match(/:Request>\s*<(\w+?)>/)) {
			return '<' + match[1] + '/>';
		} else if (match = rqBody.match(/:Request>\s*(.+?)\s*<\//)) {
			return '>' + match[1] + ';';
		}
	} else if (gds === 'amadeus') {
		if (match = rqBody.match(/:textStringDetails>\s*(.+?)\s*<\//)) {
			return '>' + match[1] + ';';
		}
	} else if (gds === 'sabre') {
		if (match = rqBody.match(/:HostCommand>\s*(.+?)\s*<\//)) {
			return '>' + match[1] + ';';
		}
	}
	return '';
};

const initHttpRq = (session) => (params) => {
	let whenResult = PersistentHttpRq(params);
	let logit = (msg, data) => {
		let masked = MaskUtil.maskCcNumbers(data);
		FluentLogger.logit(msg, session.logId, masked);
		if (process.env.NODE_ENV !== 'production') {
			console.log(msg, typeof masked === 'string' ? masked : jsExport(masked));
		}
	};
	let briefing = makeHttpRqBriefing(params.body, session.context.gds);
	logit('XML RQ: ' + briefing, params.body);
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

module.exports = GdsSession;