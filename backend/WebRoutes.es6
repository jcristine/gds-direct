
let express = require('express');
let UserController = require('./UserController.es6');
let CompletionData = require('./CompletionData.es6');
let Emc = require('./App/Api/Clients/Emc.es6');
let GdsSessionController = require('./GdsSessionController.es6');
let TerminalBaseController = require('./Transpiled/App/Controllers/TerminalBaseController.es6');
let {hrtimeToDecimal} = require('./Utils/Misc.es6');
let cluster = require('cluster');
let {admins} = require('./Constants.es6');
let UpdateHighlightRulesFromProd = require('./Actions/UpdateHighlightRulesFromProd.es6');
let Db = require('./Utils/Db.es6');
let Diag = require('./ProjectWrappers/Diag.es6');
let FluentLogger = require('./ProjectWrappers/FluentLogger.es6');

let app = express();

let withAuth = (action) => (req, res) => {
	let reqBody = req.body;
	if (Object.keys(reqBody).length === 0) {
		let querystring = require('querystring');
		let queryStr = req.url.split('?')[1] || '';
		reqBody = querystring.parse(queryStr);
	}
	let maskedBody = Object.assign({}, reqBody, {
		emcSessionId: '******' + (reqBody.emcSessionId || '').slice(-4),
	});
	let {log, logId} = FluentLogger.init();
	let logToTable = (agentId) => Db.with(db =>
		db.writeRows('http_rq_log', [{
			path: req.path,
			dt: new Date().toISOString(),
			agentId: agentId,
			logId: logId,
		}]));
	log('Processing HTTP request ' + req.path + ' with params:', maskedBody);
	return (new Emc()).getCachedSessionInfo(reqBody.emcSessionId)
		.catch(exc => {
			let error = new Error('EMC auth error - ' + exc);
			error.httpStatusCode = 401;
			error.stack += '\nCaused by:\n' + exc.stack;
			return Promise.reject(error);
		})
		.then(emcData => {
			let agentId = emcData.result.user.id;
			reqBody.agentId = agentId;
			log('Authorized agent: ' + reqBody.agentId + ' ' + emcData.result.user.displayName, emcData.result.user.roles);
			logToTable(agentId);
			return Promise.resolve()
				.then(() => action(reqBody, emcData.result, req.params))
				.catch(exc => {
					let error = new Error('HTTP action failed - ' + exc);
					error.httpStatusCode = 520;
					if (exc.stack) {
						error.stack += '\nCaused by:\n' + exc.stack;
					}
					return Promise.reject(error);
				});
		})
		.then(result => {
			log('HTTP action result:', result);
			return res.send(JSON.stringify(Object.assign({
				message: 'OK', workerId: (cluster.worker || {}).id,
			}, result)));
		})
		.catch(exc => {
			res.status(exc.httpStatusCode || 500);
			res.send(JSON.stringify({error: exc + '', stack: exc.stack}));
			let errorData = {
				message: exc.message || '' + exc,
				httpStatusCode: exc.httpStatusCode,
				requestPath: req.path,
				requestBody: maskedBody,
				stack: exc.stack,
				processLogId: logId,
			};
			log('ERROR: HTTP request failed', errorData);
			Diag.error('HTTP request failed', errorData);
		});
};

app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => res.redirect('/public'));
app.use('/public', express.static(__dirname + '/../public'));
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

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
		return Promise.reject('Sorry, only users with admin rights can use that. Your id ' + emcResult.user.id + ' is not in ' + admins.join(','));
	}
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
		return Promise.reject('Sorry, you must be me in order to use that');
	}
}));

app.listen(20327);
