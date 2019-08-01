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
	if (['apollo', 'galileo'].includes(gds)) {
		let match;
		if (match = rqBody.match(/:Request>\s*<(\w+?)>/)) {
			return '<' + match[1] + '/>';
		} else if (match = rqBody.match(/:Request>\s*(.+?)\s*<\//)) {
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
 * @param session = at('GdsSessions.js').makeSessionRecord()
 */
const GdsSession = ({session}) => {
	let gds = session.context.gds;
	let httpRq = GdsSession.initHttpRq(session);
	let runByGds = (cmd) => {
		if (['apollo', 'galileo'].includes(gds)) {
			let travelport = TravelportClient.makeCustom({PersistentHttpRq: httpRq});
			return travelport.runCmd({command: cmd}, session.gdsData);
		} else if (gds === 'amadeus') {
			return AmadeusClient.runCmd({command: cmd}, session.gdsData);
		} else if (gds === 'sabre') {
			return SabreClient.runCmd({command: cmd}, session.gdsData);
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