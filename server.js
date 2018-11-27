
let express = require('express');

let TravelportClient = require('./backend/TravelportClient.es6');
let RbsClient = require('./backend/RbsClient.es6');
let User = require('./backend/User.es6');
let CompletionData = require('./backend/CompletionData.es6');
let Emc = require('./backend/App/Api/Clients/Emc.es6');

let app = express();

app.use(express.json());
app.use(express.urlencoded());

let makeCmdResponse = (data) => 1 && {
	success: true,
	data: Object.assign({
		output: 'NO RESPONSE',
		tabCommands: [],
		clearScreen: false,
		canCreatePq: false,
		canCreatePqErrors: [],
		area: 'A',
		pcc: '1O3K',
		prompt: "",
		startNewSession: false,
		userMessages: null,
		appliedRules: [],
		legend: [],
	}, data),
};

/** @param {IEmcData} emcData */
let runInputCmd = (reqBody, emcData) => {
	let agentId = emcData.user.id;
	let useRbs = +reqBody.useRbs ? true : false;
	let params = {
		command: reqBody.command,
		gds: reqBody.gds,
		language: reqBody.language,
		agentId: agentId,
	};
	if (useRbs) {
		return RbsClient.runInputCmd(params)
			.then(data => makeCmdResponse(data));
	} else {
	    return TravelportClient.runInputCmd(params)
		 	.then(data => makeCmdResponse(data));
	}
};

app.use('/public', express.static(__dirname + '/public'));
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.get('/gdsDirect/view', (req, res) => {
    res.send(JSON.stringify(User.getView()));
});
app.get('/autoComplete', (req, res) => {
    res.send(JSON.stringify(CompletionData.getData(req)));
});
app.get('/gdsDirect/themes', (req, res) => res.send(JSON.stringify(
	{"terminalThemes":[{"id":4,"label":"Apollo Default","colors":{"defaultBg":{"background-color":"#191a1b"},"activeWindow":{"background-color":"#2a2835"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#ff0000","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#00ff00"},"specialHighlight":{"color":"#00ff00"},"highlightDark":{"background-color":"#ddeeff","font-weight":"bold"},"highlightLight":{"background-color":"#f40000"},"highlightBlue":{"background-color":"#00029f"},"fixedColumnBackground":{"background-color":"#3deb28"}},"colorsParsed":{"defaultBg-color":{"color":"#191a1b"},"defaultBg-backgroundColor":{"background-color":"#191a1b"},"activeWindow-color":{"color":"#2a2835"},"activeWindow-backgroundColor":{"background-color":"#2a2835"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#ff0000"},"errorMessage-backgroundColor":{"background-color":"#ff0000"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#00ff00"},"startSession-backgroundColor":{"background-color":"#00ff00"},"specialHighlight-color":{"color":"#00ff00"},"specialHighlight-backgroundColor":{"background-color":"#00ff00"},"highlightDark-color":{"color":"#ddeeff"},"highlightDark-backgroundColor":{"background-color":"#ddeeff"},"highlightLight-color":{"color":"#f40000"},"highlightLight-backgroundColor":{"background-color":"#f40000"},"highlightBlue-color":{"color":"#00029f"},"highlightBlue-backgroundColor":{"background-color":"#00029f"},"fixedColumnBackground-color":{"color":"#3deb28"},"fixedColumnBackground-backgroundColor":{"background-color":"#3deb28"}}},{"id":6,"label":"Sabre Default","colors":{"defaultBg":{"background-color":"#000080"},"activeWindow":{"background-color":"#000080"},"entryFont":{"color":"#ffff00"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#fa0000","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#00ff00","font-weight":"bold"},"specialHighlight":{"color":"#35c26e","font-weight":"bold"},"highlightDark":{"background-color":""},"highlightLight":{"background-color":"#751515"},"highlightBlue":{"background-color":"#000000"},"fixedColumnBackground":{"background-color":""}},"colorsParsed":{"defaultBg-color":{"color":"#000080"},"defaultBg-backgroundColor":{"background-color":"#000080"},"activeWindow-color":{"color":"#000080"},"activeWindow-backgroundColor":{"background-color":"#000080"},"entryFont-color":{"color":"#ffff00"},"entryFont-backgroundColor":{"background-color":"#ffff00"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#fa0000"},"errorMessage-backgroundColor":{"background-color":"#fa0000"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#00ff00"},"startSession-backgroundColor":{"background-color":"#00ff00"},"specialHighlight-color":{"color":"#35c26e"},"specialHighlight-backgroundColor":{"background-color":"#35c26e"},"highlightDark-color":{"color":""},"highlightDark-backgroundColor":{"background-color":""},"highlightLight-color":{"color":"#751515"},"highlightLight-backgroundColor":{"background-color":"#751515"},"highlightBlue-color":{"color":"#000000"},"highlightBlue-backgroundColor":{"background-color":"#000000"},"fixedColumnBackground-color":{"color":""},"fixedColumnBackground-backgroundColor":{"background-color":""}}},{"id":8,"label":"Natural Apollo","colors":{"defaultBg":{"background-color":"#3f7b7d"},"activeWindow":{"background-color":"#428284"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#f30912","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#00ff00"},"specialHighlight":{"color":"#eab00b"},"highlightDark":{"background-color":""},"highlightLight":{"background-color":"#eab00b"},"highlightBlue":{"background-color":""},"fixedColumnBackground":{"background-color":""}},"colorsParsed":{"defaultBg-color":{"color":"#3f7b7d"},"defaultBg-backgroundColor":{"background-color":"#3f7b7d"},"activeWindow-color":{"color":"#428284"},"activeWindow-backgroundColor":{"background-color":"#428284"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#f30912"},"errorMessage-backgroundColor":{"background-color":"#f30912"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#00ff00"},"startSession-backgroundColor":{"background-color":"#00ff00"},"specialHighlight-color":{"color":"#eab00b"},"specialHighlight-backgroundColor":{"background-color":"#eab00b"},"highlightDark-color":{"color":""},"highlightDark-backgroundColor":{"background-color":""},"highlightLight-color":{"color":"#eab00b"},"highlightLight-backgroundColor":{"background-color":"#eab00b"},"highlightBlue-color":{"color":""},"highlightBlue-backgroundColor":{"background-color":""},"fixedColumnBackground-color":{"color":""},"fixedColumnBackground-backgroundColor":{"background-color":""}}},{"id":10,"label":"Black on White","colors":{"defaultBg":{"background-color":"#f2f2f2"},"activeWindow":{"background-color":"#ffffff"},"entryFont":{"color":"#0000ff"},"outputFont":{"color":"#000000"},"usedCommand":{"color":"#0000ff","font-weight":"bold"},"errorMessage":{"color":"#ff0000","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#008000","font-weight":"bold"},"specialHighlight":{"color":"#008000","font-weight":"bold"}},"colorsParsed":{"defaultBg-color":{"color":"#f2f2f2"},"defaultBg-backgroundColor":{"background-color":"#f2f2f2"},"activeWindow-color":{"color":"#ffffff"},"activeWindow-backgroundColor":{"background-color":"#ffffff"},"entryFont-color":{"color":"#0000ff"},"entryFont-backgroundColor":{"background-color":"#0000ff"},"outputFont-color":{"color":"#000000"},"outputFont-backgroundColor":{"background-color":"#000000"},"usedCommand-color":{"color":"#0000ff"},"usedCommand-backgroundColor":{"background-color":"#0000ff"},"errorMessage-color":{"color":"#ff0000"},"errorMessage-backgroundColor":{"background-color":"#ff0000"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#008000"},"startSession-backgroundColor":{"background-color":"#008000"},"specialHighlight-color":{"color":"#008000"},"specialHighlight-backgroundColor":{"background-color":"#008000"}}},{"id":12,"label":"CMS Color Scheme","colors":{"defaultBg":{"background-color":"#545e70"},"activeWindow":{"background-color":"#3d4452"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#f60a0c","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#0ff940"},"specialHighlight":{"color":"#44f0f9"}},"colorsParsed":{"defaultBg-color":{"color":"#545e70"},"defaultBg-backgroundColor":{"background-color":"#545e70"},"activeWindow-color":{"color":"#3d4452"},"activeWindow-backgroundColor":{"background-color":"#3d4452"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#f60a0c"},"errorMessage-backgroundColor":{"background-color":"#f60a0c"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#0ff940"},"startSession-backgroundColor":{"background-color":"#0ff940"},"specialHighlight-color":{"color":"#44f0f9"},"specialHighlight-backgroundColor":{"background-color":"#44f0f9"}}},{"id":16,"label":"Exotic Green","colors":{"defaultBg":{"background-color":"#191a1b"},"activeWindow":{"background-color":"#2a2835"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#17f308"},"usedCommand":{"color":"#f1fb33"},"errorMessage":{"color":"#fb1010","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#18fafa"},"specialHighlight":{"color":"#fa70f9"}},"colorsParsed":{"defaultBg-color":{"color":"#191a1b"},"defaultBg-backgroundColor":{"background-color":"#191a1b"},"activeWindow-color":{"color":"#2a2835"},"activeWindow-backgroundColor":{"background-color":"#2a2835"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#17f308"},"outputFont-backgroundColor":{"background-color":"#17f308"},"usedCommand-color":{"color":"#f1fb33"},"usedCommand-backgroundColor":{"background-color":"#f1fb33"},"errorMessage-color":{"color":"#fb1010"},"errorMessage-backgroundColor":{"background-color":"#fb1010"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#18fafa"},"startSession-backgroundColor":{"background-color":"#18fafa"},"specialHighlight-color":{"color":"#fa70f9"},"specialHighlight-backgroundColor":{"background-color":"#fa70f9"}}},{"id":18,"label":"Chocolate","colors":{"defaultBg":{"background-color":"#403835"},"activeWindow":{"background-color":"#483f3b"},"entryFont":{"color":"#f2f2f2"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00","font-weight":"bold"},"errorMessage":{"color":"#ff5252","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#35c26e","font-weight":"bold"},"specialHighlight":{"color":"#00ff00","font-weight":"bold"}},"colorsParsed":{"defaultBg-color":{"color":"#403835"},"defaultBg-backgroundColor":{"background-color":"#403835"},"activeWindow-color":{"color":"#483f3b"},"activeWindow-backgroundColor":{"background-color":"#483f3b"},"entryFont-color":{"color":"#f2f2f2"},"entryFont-backgroundColor":{"background-color":"#f2f2f2"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#ff5252"},"errorMessage-backgroundColor":{"background-color":"#ff5252"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#35c26e"},"startSession-backgroundColor":{"background-color":"#35c26e"},"specialHighlight-color":{"color":"#00ff00"},"specialHighlight-backgroundColor":{"background-color":"#00ff00"}}},{"id":20,"label":"Deep Ocean","colors":{"defaultBg":{"background-color":"#141e29"},"activeWindow":{"background-color":"#192633"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#ff0000"},"warningMessage":{"color":"#65d994"},"startSession":{"color":"#81f7b1"},"specialHighlight":{"color":"#18fafa"}},"colorsParsed":{"defaultBg-color":{"color":"#141e29"},"defaultBg-backgroundColor":{"background-color":"#141e29"},"activeWindow-color":{"color":"#192633"},"activeWindow-backgroundColor":{"background-color":"#192633"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#ff0000"},"errorMessage-backgroundColor":{"background-color":"#ff0000"},"warningMessage-color":{"color":"#65d994"},"warningMessage-backgroundColor":{"background-color":"#65d994"},"startSession-color":{"color":"#81f7b1"},"startSession-backgroundColor":{"background-color":"#81f7b1"},"specialHighlight-color":{"color":"#18fafa"},"specialHighlight-backgroundColor":{"background-color":"#18fafa"}}},{"id":22,"label":"SmartPoint Theme","colors":{"defaultBg":{"background-color":"#4b4b4b"},"activeWindow":{"background-color":"#525151"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#ff0000","font-weight":"bold"},"warningMessage":{"color":"#77fc77"},"startSession":{"color":"#00ff00"},"specialHighlight":{"color":"#7eb9f9"}},"colorsParsed":{"defaultBg-color":{"color":"#4b4b4b"},"defaultBg-backgroundColor":{"background-color":"#4b4b4b"},"activeWindow-color":{"color":"#525151"},"activeWindow-backgroundColor":{"background-color":"#525151"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#ff0000"},"errorMessage-backgroundColor":{"background-color":"#ff0000"},"warningMessage-color":{"color":"#77fc77"},"warningMessage-backgroundColor":{"background-color":"#77fc77"},"startSession-color":{"color":"#00ff00"},"startSession-backgroundColor":{"background-color":"#00ff00"},"specialHighlight-color":{"color":"#7eb9f9"},"specialHighlight-backgroundColor":{"background-color":"#7eb9f9"}}},{"id":24,"label":"Deep Ocean (no highlights)","colors":{"defaultBg":{"background-color":"#141e29"},"activeWindow":{"background-color":"#192633"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffffff"},"errorMessage":{"color":"#ffffff"},"warningMessage":{"color":"#ffffff"},"startSession":{"color":"#ffffff"},"specialHighlight":{"color":"#ffffff"}},"colorsParsed":{"defaultBg-color":{"color":"#141e29"},"defaultBg-backgroundColor":{"background-color":"#141e29"},"activeWindow-color":{"color":"#192633"},"activeWindow-backgroundColor":{"background-color":"#192633"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffffff"},"usedCommand-backgroundColor":{"background-color":"#ffffff"},"errorMessage-color":{"color":"#ffffff"},"errorMessage-backgroundColor":{"background-color":"#ffffff"},"warningMessage-color":{"color":"#ffffff"},"warningMessage-backgroundColor":{"background-color":"#ffffff"},"startSession-color":{"color":"#ffffff"},"startSession-backgroundColor":{"background-color":"#ffffff"},"specialHighlight-color":{"color":"#ffffff"},"specialHighlight-backgroundColor":{"background-color":"#ffffff"}}}],"terminalData":{"rId":0,"isStandAlone":1},"apolloPcc":[],"currency":[],"mileages":[],"scriptStart":"gdsDirect"}
)));
app.get('/terminal/saveSetting/:name/:currentGds/:value', (req, res) => res.send(JSON.stringify({
    success: true, data : {data: {userMessages: 'OK'}},
})));
app.post('/terminal/saveSetting/:name/:currentGds', (req, res) => res.send(JSON.stringify({
    success: true, data : {data: {userMessages: 'OK'}},
})));
app.post('/terminal/command', (req, res) => (new Emc()).getCachedSessionInfo(req.body.emcSessionId)
	.catch(exc => Promise.reject('EMC auth error - ' + exc))
	.then(emcData => runInputCmd(req.body, emcData.result))
	.then(result => res.send(JSON.stringify(Object.assign({success: true}, result))))
	.catch(exc => {
		res.status(500);
		res.send(JSON.stringify({error: exc + '', stack: exc.stack}));
	}));
app.post('/gdsDirect/keepAlive', (req, res) => (new Emc()).getCachedSessionInfo(req.body.emcSessionId)
	.catch(exc => Promise.reject('EMC auth error - ' + exc))
	.then(emcData => runInputCmd({command: 'MD0', ...req.body}, emcData.result))
	.then(result => res.send(JSON.stringify(Object.assign({success: true}, result))))
	.catch(exc => {
		res.status(500);
		res.send(JSON.stringify({error: exc + '', stack: exc.stack}));
	}));
app.get('/terminal/priceQuote', (req, res) => {
	res.status(501);
	res.send(JSON.stringify({error: 'PQ creation is not supported yet'}));
});

app.listen(8080);
