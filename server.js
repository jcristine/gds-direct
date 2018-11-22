let http = require('http');
let express = require('express');
let request = require('request');
let app = express();

let globalSessionId = null;

app.use(express.json());
app.use(express.urlencoded());

let callRbs = (functionName, params) => new Promise((resolve, reject) => {
	let logId = 'rbs.5bf6e431.9577485';
	let rbsUrl = 'http://st-rbs.sjager.php7.dyninno.net/jsonExternalInterface.php?log_id=' + logId;
	let formParams = {
		credentials: JSON.stringify({login: 'CMS', password: 'qwerty'}),
		functionName: functionName,
		params: JSON.stringify(params),
	};
	return request.post({
		url: rbsUrl, form: formParams,
	}, (err, httpResponse, body) => {
		if (err || httpResponse.statusCode !== 200) {
			reject('Could not connect to RBS - ' + httpResponse + ' - ' + err + ' - ' + body);
		}
		let resp;
		try {
			resp = JSON.parse(body);
		} catch (exc) {
			reject('Could not parse RBS ' + functionName + ' json response - ' + body);
		}
		if (resp.status !== 'OK' || !resp.result || !resp.result.response_code) {
			reject('Unexpected RBS response format - ' + JSON.stringify(resp));
		} else if (![1,2,3].includes(resp.result.response_code)) {
			let rpcErrors = resp.result.errors;
			reject('RBS service responded with error - ' + resp.result.response_code + ' - ' + JSON.stringify(rpcErrors));
		} else if (resp.result.response_code == 3) {
			let rpcErrors = resp.result.errors;
			let messages = resp.result.result.messages;
			reject('RBS service cannot satisfy your request - ' + JSON.stringify(messages) + ' - ' + JSON.stringify(rpcErrors));
		} else {
			resolve(resp);
		}
	});
});

let runCommand = (req) => {
	let stub = {"data":{"output":"[[;;;startSession]\/START SESSION]\nNEUTRAL DISPLAY*   %MO 20MAY% SYDNYC-14:00 HR                     \n1+ QF   7 F9 A9 J9 C9 D0 I0 W9 R9 T0 Y9+SYDDFW1235P  100P 388  0\n2+ QF4396 J6 C0 D0 I0 Y9 B9 H9 K9 M9 L9+   LGA 230P  659P 32B%*% 0\n3+ QF   7 F9 A9 J9 C9 D0 I0 W9 R9 T0 Y9+SYDDFW1235P  100P 388  0\n4+ AA1105 J7 D0 I0 Y7 B7 H7 K7 M7 L7 G7+   LGA 230P  659P 32B 60\n5+ UA 870 J9 C9 D9 Z5 P0 Y9 B9 M9 E9 U9+SYDSFO1030A  710A 789  0\n6+ UA 295 J9 C9 D9 Z5 P0 Y9 B9 M9 E9 U9+   EWR 830A  501P 777 80\n7* NZ9870 C4 D4 Z4 J4 Y4 B4 M4 H4 Q4 V4+SYDSFO1030A  710A 789%*% 0\n8+ UA 295 J9 C2 D2 Z0 P0 Y9 B9 M9 E9 U9+   EWR 830A  501P 777 80\nMEALS\u003E%A*M\u00b7%  CLASSES\u003E%A*C\u00b7..%  JOURNEY TIME \u003EA*J\u00b7","tabCommands":["A*M","A*C","A*J"],"clearScreen":true,"canCreatePq":false,"canCreatePqErrors":["PNR changed since last pricing - must price again"],"area":"A","pcc":"2G55","prompt":"","startNewSession":true,"userMessages":null,"appliedRules":[{"id":120,"isInSameWindow":0,"onMouseOver":"Code-share flight","onClickMessage":"","color":"specialHighlight","backgroundColor":"","onClickCommand":"","decoration":[],"value":"%*%","offsets":[{"start":191,"end":192},{"start":516,"end":517}]},{"id":40,"isInSameWindow":1,"onMouseOver":"Click to view Meals Plus screen","onClickMessage":"","color":"usedCommand","backgroundColor":"","onClickCommand":"A*M","decoration":["bordered"],"value":"%A*M\u00b7%","offsets":[{"start":591,"end":596}]},{"id":42,"isInSameWindow":0,"onMouseOver":"Expanded Classes screen","onClickMessage":"","color":"usedCommand","backgroundColor":"","onClickCommand":"","decoration":[],"value":"%A*C\u00b7..%","offsets":[{"start":606,"end":613}]},{"id":128,"isInSameWindow":0,"onMouseOver":"","onClickMessage":"","color":"specialHighlight","backgroundColor":"","onClickCommand":"","decoration":[],"value":"%MO 20MAY%","offsets":[{"start":19,"end":27}]}],"legend":[]},"success":true};
	let runInSession = (sessionId) => callRbs('terminal.runCommand', {
		gds: req.body.gds,
		command: req.body.command,
		sessionId: sessionId,
	}).then(rbsResp => {
		return {
			success: true,
			data: {
				output: rbsResp.result.result.calledCommands
					.map(call => '>' + call.cmd + '\n' + call.output)
					.join('\n______________________\n'),
				tabCommands: rbsResp.result.result.calledCommands
					.flatMap(call => call.tabCommands),
				clearScreen: rbsResp.result.result.clearScreen,
				canCreatePq: rbsResp.result.result.sessionInfo.canCreatePq,
				canCreatePqErrors: rbsResp.result.result.sessionInfo.canCreatePqErrors,
				area: rbsResp.result.result.sessionInfo.area,
				pcc: rbsResp.result.result.sessionInfo.pcc,
				prompt: "",
				startNewSession: true,
				userMessages: null,
				appliedRules: [],
				legend: [],
			},
		};
	});
	if (globalSessionId) {
		return runInSession(globalSessionId);
	} else {
		return callRbs('terminal.startSession', {
			gds: req.body.gds, agentId: 6206,
		}).then(rbsResp => {
			globalSessionId = rbsResp.result.result.sessionId;
			return runInSession(globalSessionId);
		});
	}
};

app.use(express.static(__dirname)); // for /_js/ and /_contrib/
app.get('/gdsDirect/view', (req, res) => res.send(JSON.stringify({
    enabled       : true,
    disableReason : '',
    settings      : {
		"common": {"currentGds":"apollo"},
		"gds": {
			"apollo": {
			  "terminalsMatrix": [2,2],
			  "language": "",
			  "area": "A",
			  "pcc": "2G52",
			  "terminalNumber": 1,
			  "fontSize": 1,
			  "canCreatePq": 0,
			  "keyBindings": null,
			  "theme": 0,
			  "matrix": {"hasWide":"false","matrix":{"rows":0,"cells":0,"list":[0]}},
			  "defaultPcc": "",
			  "areaSettings": [
				  {
					  "id": 33,
					  "gds": "apollo",
					  "area": "A",
					  "agentId": 6206,
					  "defaultPcc": null
				  },
				  {
					  "id": 34,
					  "gds": "apollo",
					  "area": "B",
					  "agentId": 6206,
					  "defaultPcc": null
				  },
				  {
					  "id": 35,
					  "gds": "apollo",
					  "area": "C",
					  "agentId": 6206,
					  "defaultPcc": "2CV4"
				  },
				  {
					  "id": 36,
					  "gds": "apollo",
					  "area": "D",
					  "agentId": 6206,
					  "defaultPcc": null
				  },
				  {
					  "id": 37,
					  "gds": "apollo",
					  "area": "E",
					  "agentId": 6206,
					  "defaultPcc": null
				  }
			  ]
		  },
		},
	},
    buffer        : {},
    lastCommands  : [],
})));
app.get('/gdsDirect/themes', (req, res) => res.send(JSON.stringify(
	{"terminalThemes":[{"id":4,"label":"Apollo Default","colors":{"defaultBg":{"background-color":"#191a1b"},"activeWindow":{"background-color":"#2a2835"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#ff0000","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#00ff00"},"specialHighlight":{"color":"#00ff00"},"highlightDark":{"background-color":"#ddeeff","font-weight":"bold"},"highlightLight":{"background-color":"#f40000"},"highlightBlue":{"background-color":"#00029f"},"fixedColumnBackground":{"background-color":"#3deb28"}},"colorsParsed":{"defaultBg-color":{"color":"#191a1b"},"defaultBg-backgroundColor":{"background-color":"#191a1b"},"activeWindow-color":{"color":"#2a2835"},"activeWindow-backgroundColor":{"background-color":"#2a2835"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#ff0000"},"errorMessage-backgroundColor":{"background-color":"#ff0000"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#00ff00"},"startSession-backgroundColor":{"background-color":"#00ff00"},"specialHighlight-color":{"color":"#00ff00"},"specialHighlight-backgroundColor":{"background-color":"#00ff00"},"highlightDark-color":{"color":"#ddeeff"},"highlightDark-backgroundColor":{"background-color":"#ddeeff"},"highlightLight-color":{"color":"#f40000"},"highlightLight-backgroundColor":{"background-color":"#f40000"},"highlightBlue-color":{"color":"#00029f"},"highlightBlue-backgroundColor":{"background-color":"#00029f"},"fixedColumnBackground-color":{"color":"#3deb28"},"fixedColumnBackground-backgroundColor":{"background-color":"#3deb28"}}},{"id":6,"label":"Sabre Default","colors":{"defaultBg":{"background-color":"#000080"},"activeWindow":{"background-color":"#000080"},"entryFont":{"color":"#ffff00"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#fa0000","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#00ff00","font-weight":"bold"},"specialHighlight":{"color":"#35c26e","font-weight":"bold"},"highlightDark":{"background-color":""},"highlightLight":{"background-color":"#751515"},"highlightBlue":{"background-color":"#000000"},"fixedColumnBackground":{"background-color":""}},"colorsParsed":{"defaultBg-color":{"color":"#000080"},"defaultBg-backgroundColor":{"background-color":"#000080"},"activeWindow-color":{"color":"#000080"},"activeWindow-backgroundColor":{"background-color":"#000080"},"entryFont-color":{"color":"#ffff00"},"entryFont-backgroundColor":{"background-color":"#ffff00"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#fa0000"},"errorMessage-backgroundColor":{"background-color":"#fa0000"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#00ff00"},"startSession-backgroundColor":{"background-color":"#00ff00"},"specialHighlight-color":{"color":"#35c26e"},"specialHighlight-backgroundColor":{"background-color":"#35c26e"},"highlightDark-color":{"color":""},"highlightDark-backgroundColor":{"background-color":""},"highlightLight-color":{"color":"#751515"},"highlightLight-backgroundColor":{"background-color":"#751515"},"highlightBlue-color":{"color":"#000000"},"highlightBlue-backgroundColor":{"background-color":"#000000"},"fixedColumnBackground-color":{"color":""},"fixedColumnBackground-backgroundColor":{"background-color":""}}},{"id":8,"label":"Natural Apollo","colors":{"defaultBg":{"background-color":"#3f7b7d"},"activeWindow":{"background-color":"#428284"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#f30912","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#00ff00"},"specialHighlight":{"color":"#eab00b"},"highlightDark":{"background-color":""},"highlightLight":{"background-color":"#eab00b"},"highlightBlue":{"background-color":""},"fixedColumnBackground":{"background-color":""}},"colorsParsed":{"defaultBg-color":{"color":"#3f7b7d"},"defaultBg-backgroundColor":{"background-color":"#3f7b7d"},"activeWindow-color":{"color":"#428284"},"activeWindow-backgroundColor":{"background-color":"#428284"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#f30912"},"errorMessage-backgroundColor":{"background-color":"#f30912"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#00ff00"},"startSession-backgroundColor":{"background-color":"#00ff00"},"specialHighlight-color":{"color":"#eab00b"},"specialHighlight-backgroundColor":{"background-color":"#eab00b"},"highlightDark-color":{"color":""},"highlightDark-backgroundColor":{"background-color":""},"highlightLight-color":{"color":"#eab00b"},"highlightLight-backgroundColor":{"background-color":"#eab00b"},"highlightBlue-color":{"color":""},"highlightBlue-backgroundColor":{"background-color":""},"fixedColumnBackground-color":{"color":""},"fixedColumnBackground-backgroundColor":{"background-color":""}}},{"id":10,"label":"Black on White","colors":{"defaultBg":{"background-color":"#f2f2f2"},"activeWindow":{"background-color":"#ffffff"},"entryFont":{"color":"#0000ff"},"outputFont":{"color":"#000000"},"usedCommand":{"color":"#0000ff","font-weight":"bold"},"errorMessage":{"color":"#ff0000","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#008000","font-weight":"bold"},"specialHighlight":{"color":"#008000","font-weight":"bold"}},"colorsParsed":{"defaultBg-color":{"color":"#f2f2f2"},"defaultBg-backgroundColor":{"background-color":"#f2f2f2"},"activeWindow-color":{"color":"#ffffff"},"activeWindow-backgroundColor":{"background-color":"#ffffff"},"entryFont-color":{"color":"#0000ff"},"entryFont-backgroundColor":{"background-color":"#0000ff"},"outputFont-color":{"color":"#000000"},"outputFont-backgroundColor":{"background-color":"#000000"},"usedCommand-color":{"color":"#0000ff"},"usedCommand-backgroundColor":{"background-color":"#0000ff"},"errorMessage-color":{"color":"#ff0000"},"errorMessage-backgroundColor":{"background-color":"#ff0000"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#008000"},"startSession-backgroundColor":{"background-color":"#008000"},"specialHighlight-color":{"color":"#008000"},"specialHighlight-backgroundColor":{"background-color":"#008000"}}},{"id":12,"label":"CMS Color Scheme","colors":{"defaultBg":{"background-color":"#545e70"},"activeWindow":{"background-color":"#3d4452"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#f60a0c","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#0ff940"},"specialHighlight":{"color":"#44f0f9"}},"colorsParsed":{"defaultBg-color":{"color":"#545e70"},"defaultBg-backgroundColor":{"background-color":"#545e70"},"activeWindow-color":{"color":"#3d4452"},"activeWindow-backgroundColor":{"background-color":"#3d4452"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#f60a0c"},"errorMessage-backgroundColor":{"background-color":"#f60a0c"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#0ff940"},"startSession-backgroundColor":{"background-color":"#0ff940"},"specialHighlight-color":{"color":"#44f0f9"},"specialHighlight-backgroundColor":{"background-color":"#44f0f9"}}},{"id":16,"label":"Exotic Green","colors":{"defaultBg":{"background-color":"#191a1b"},"activeWindow":{"background-color":"#2a2835"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#17f308"},"usedCommand":{"color":"#f1fb33"},"errorMessage":{"color":"#fb1010","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#18fafa"},"specialHighlight":{"color":"#fa70f9"}},"colorsParsed":{"defaultBg-color":{"color":"#191a1b"},"defaultBg-backgroundColor":{"background-color":"#191a1b"},"activeWindow-color":{"color":"#2a2835"},"activeWindow-backgroundColor":{"background-color":"#2a2835"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#17f308"},"outputFont-backgroundColor":{"background-color":"#17f308"},"usedCommand-color":{"color":"#f1fb33"},"usedCommand-backgroundColor":{"background-color":"#f1fb33"},"errorMessage-color":{"color":"#fb1010"},"errorMessage-backgroundColor":{"background-color":"#fb1010"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#18fafa"},"startSession-backgroundColor":{"background-color":"#18fafa"},"specialHighlight-color":{"color":"#fa70f9"},"specialHighlight-backgroundColor":{"background-color":"#fa70f9"}}},{"id":18,"label":"Chocolate","colors":{"defaultBg":{"background-color":"#403835"},"activeWindow":{"background-color":"#483f3b"},"entryFont":{"color":"#f2f2f2"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00","font-weight":"bold"},"errorMessage":{"color":"#ff5252","font-weight":"bold"},"warningMessage":{"color":"#d2e30c","font-weight":"bold"},"startSession":{"color":"#35c26e","font-weight":"bold"},"specialHighlight":{"color":"#00ff00","font-weight":"bold"}},"colorsParsed":{"defaultBg-color":{"color":"#403835"},"defaultBg-backgroundColor":{"background-color":"#403835"},"activeWindow-color":{"color":"#483f3b"},"activeWindow-backgroundColor":{"background-color":"#483f3b"},"entryFont-color":{"color":"#f2f2f2"},"entryFont-backgroundColor":{"background-color":"#f2f2f2"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#ff5252"},"errorMessage-backgroundColor":{"background-color":"#ff5252"},"warningMessage-color":{"color":"#d2e30c"},"warningMessage-backgroundColor":{"background-color":"#d2e30c"},"startSession-color":{"color":"#35c26e"},"startSession-backgroundColor":{"background-color":"#35c26e"},"specialHighlight-color":{"color":"#00ff00"},"specialHighlight-backgroundColor":{"background-color":"#00ff00"}}},{"id":20,"label":"Deep Ocean","colors":{"defaultBg":{"background-color":"#141e29"},"activeWindow":{"background-color":"#192633"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#ff0000"},"warningMessage":{"color":"#65d994"},"startSession":{"color":"#81f7b1"},"specialHighlight":{"color":"#18fafa"}},"colorsParsed":{"defaultBg-color":{"color":"#141e29"},"defaultBg-backgroundColor":{"background-color":"#141e29"},"activeWindow-color":{"color":"#192633"},"activeWindow-backgroundColor":{"background-color":"#192633"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#ff0000"},"errorMessage-backgroundColor":{"background-color":"#ff0000"},"warningMessage-color":{"color":"#65d994"},"warningMessage-backgroundColor":{"background-color":"#65d994"},"startSession-color":{"color":"#81f7b1"},"startSession-backgroundColor":{"background-color":"#81f7b1"},"specialHighlight-color":{"color":"#18fafa"},"specialHighlight-backgroundColor":{"background-color":"#18fafa"}}},{"id":22,"label":"SmartPoint Theme","colors":{"defaultBg":{"background-color":"#4b4b4b"},"activeWindow":{"background-color":"#525151"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffff00"},"errorMessage":{"color":"#ff0000","font-weight":"bold"},"warningMessage":{"color":"#77fc77"},"startSession":{"color":"#00ff00"},"specialHighlight":{"color":"#7eb9f9"}},"colorsParsed":{"defaultBg-color":{"color":"#4b4b4b"},"defaultBg-backgroundColor":{"background-color":"#4b4b4b"},"activeWindow-color":{"color":"#525151"},"activeWindow-backgroundColor":{"background-color":"#525151"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffff00"},"usedCommand-backgroundColor":{"background-color":"#ffff00"},"errorMessage-color":{"color":"#ff0000"},"errorMessage-backgroundColor":{"background-color":"#ff0000"},"warningMessage-color":{"color":"#77fc77"},"warningMessage-backgroundColor":{"background-color":"#77fc77"},"startSession-color":{"color":"#00ff00"},"startSession-backgroundColor":{"background-color":"#00ff00"},"specialHighlight-color":{"color":"#7eb9f9"},"specialHighlight-backgroundColor":{"background-color":"#7eb9f9"}}},{"id":24,"label":"Deep Ocean (no highlights)","colors":{"defaultBg":{"background-color":"#141e29"},"activeWindow":{"background-color":"#192633"},"entryFont":{"color":"#ffffff"},"outputFont":{"color":"#ffffff"},"usedCommand":{"color":"#ffffff"},"errorMessage":{"color":"#ffffff"},"warningMessage":{"color":"#ffffff"},"startSession":{"color":"#ffffff"},"specialHighlight":{"color":"#ffffff"}},"colorsParsed":{"defaultBg-color":{"color":"#141e29"},"defaultBg-backgroundColor":{"background-color":"#141e29"},"activeWindow-color":{"color":"#192633"},"activeWindow-backgroundColor":{"background-color":"#192633"},"entryFont-color":{"color":"#ffffff"},"entryFont-backgroundColor":{"background-color":"#ffffff"},"outputFont-color":{"color":"#ffffff"},"outputFont-backgroundColor":{"background-color":"#ffffff"},"usedCommand-color":{"color":"#ffffff"},"usedCommand-backgroundColor":{"background-color":"#ffffff"},"errorMessage-color":{"color":"#ffffff"},"errorMessage-backgroundColor":{"background-color":"#ffffff"},"warningMessage-color":{"color":"#ffffff"},"warningMessage-backgroundColor":{"background-color":"#ffffff"},"startSession-color":{"color":"#ffffff"},"startSession-backgroundColor":{"background-color":"#ffffff"},"specialHighlight-color":{"color":"#ffffff"},"specialHighlight-backgroundColor":{"background-color":"#ffffff"}}}],"terminalData":{"rId":0,"isStandAlone":1},"apolloPcc":[],"currency":[],"mileages":[],"scriptStart":"gdsDirect"}
)));
app.get('/terminal/saveSetting/:name/:currentGds/:value', (req, res) => res.send(JSON.stringify({
    success: true, data : {data: {userMessages: 'OK'}},
})));
app.post('/terminal/saveSetting/:name/:currentGds', (req, res) => res.send(JSON.stringify({
    success: true, data : {data: {userMessages: 'OK'}},
})));
app.post('/terminal/command', (req, res) => runCommand(req)
	.then(result => res.send(JSON.stringify(result)))
	.catch(exc => res.send(JSON.stringify({error: exc.message}))));
app.get('/autoComplete', (req, res) => res.send(JSON.stringify(
	[{"id":1,"label":"Apollo 2CV4 - Sky Bird Travel (US)","name":"2CV4","gds":"apollo","consolidatorName":"Sky Bird Travel (US)","isTourFare":0},{"id":5,"label":"Apollo 2BQ6 - Sky Bird Travel (CA)","name":"2BQ6","gds":"apollo","consolidatorName":"Sky Bird Travel (CA)","isTourFare":0},{"id":7,"label":"Apollo 170F - Adam Travel","name":"170F","gds":"apollo","consolidatorName":"Adam Travel","isTourFare":0},{"id":13,"label":"Apollo 2E8R - Aavan Vacation","name":"2E8R","gds":"apollo","consolidatorName":"Aavan Vacation","isTourFare":1},{"id":17,"label":"Apollo 1RZ2 - CNH Oakland","name":"1RZ2","gds":"apollo","consolidatorName":"CNH Oakland","isTourFare":0},{"id":19,"label":"Apollo 2G2H - Sky Bird Travel (US)","name":"2G2H","gds":"apollo","consolidatorName":"Sky Bird Travel (US)","isTourFare":0},{"id":20,"label":"Apollo 15JE - Cosmopolitan Travel","name":"15JE","gds":"apollo","consolidatorName":"Cosmopolitan Travel","isTourFare":0},{"id":22,"label":"Apollo 13PW - Grand Holidays","name":"13PW","gds":"apollo","consolidatorName":"Grand Holidays","isTourFare":1},{"id":24,"label":"Apollo 2F9B - Vacation.com","name":"2F9B","gds":"apollo","consolidatorName":"Vacation.com","isTourFare":0},{"id":26,"label":"Apollo 2G52 - Downtown Travel","name":"2G52","gds":"apollo","consolidatorName":"Downtown Travel","isTourFare":1},{"id":28,"label":"Apollo 15ZF - Picasso","name":"15ZF","gds":"apollo","consolidatorName":"Picasso","isTourFare":1},{"id":30,"label":"Apollo 2G55 - ITN Corp","name":"2G55","gds":"apollo","consolidatorName":"ITN Corp","isTourFare":0},{"id":32,"label":"Apollo 2G6Y - Cosmopolitan Travel","name":"2G6Y","gds":"apollo","consolidatorName":"Cosmopolitan Travel","isTourFare":1},{"id":34,"label":"Sabre YA4G - GoWay Canada","name":"YA4G","gds":"sabre","consolidatorName":"GoWay Canada","isTourFare":0},{"id":36,"label":"Apollo 2G2J - CNH Oakland","name":"2G2J","gds":"apollo","consolidatorName":"CNH Oakland","isTourFare":1},{"id":38,"label":"Sabre 50DH - Downtown Travel","name":"50DH","gds":"sabre","consolidatorName":"Downtown Travel","isTourFare":1},{"id":40,"label":"Apollo 2G8P - Downtown Travel","name":"2G8P","gds":"apollo","consolidatorName":"Downtown Travel","isTourFare":0},{"id":42,"label":"Apollo 15D9 - JustFares","name":"15D9","gds":"apollo","consolidatorName":"JustFares","isTourFare":1},{"id":44,"label":"Sabre 6IIF - ITN Corp","name":"6IIF","gds":"sabre","consolidatorName":"ITN Corp","isTourFare":0},{"id":46,"label":"Sabre YR8A - Sky Bird Travel (US)","name":"YR8A","gds":"sabre","consolidatorName":"Sky Bird Travel (US)","isTourFare":0},{"id":48,"label":"Sabre 0WBH - BrightSun","name":"0WBH","gds":"sabre","consolidatorName":"BrightSun","isTourFare":1},{"id":50,"label":"Sabre C7XB - Picasso","name":"C7XB","gds":"sabre","consolidatorName":"Picasso","isTourFare":1},{"id":52,"label":"Sabre 5EGB - Skylink (CA)","name":"5EGB","gds":"sabre","consolidatorName":"Skylink (CA)","isTourFare":0},{"id":54,"label":"Sabre DK8H - Downtown Travel","name":"DK8H","gds":"sabre","consolidatorName":"Downtown Travel","isTourFare":1},{"id":56,"label":"Sabre W8K7 - Sky Bird Travel (US)","name":"W8K7","gds":"sabre","consolidatorName":"Sky Bird Travel (US)","isTourFare":0},{"id":58,"label":"Sabre RR8F - Sky Bird Travel (CA)","name":"RR8F","gds":"sabre","consolidatorName":"Sky Bird Travel (CA)","isTourFare":0},{"id":60,"label":"Apollo 1O3K - ITN Corp","name":"1O3K","gds":"apollo","consolidatorName":"ITN Corp","isTourFare":0},{"id":62,"label":"Apollo 2E8U - ITN Corp","name":"2E8U","gds":"apollo","consolidatorName":"ITN Corp","isTourFare":0},{"id":64,"label":"Apollo 2F9H - ITN Corp","name":"2F9H","gds":"apollo","consolidatorName":"ITN Corp","isTourFare":0},{"id":66,"label":"Apollo 2G54 - Mill Run","name":"2G54","gds":"apollo","consolidatorName":"Mill Run","isTourFare":0},{"id":68,"label":"Sabre L3II - ITN Corp","name":"L3II","gds":"sabre","consolidatorName":"ITN Corp","isTourFare":0},{"id":70,"label":"Apollo 115Q - Sky Bird Travel (US)","name":"115Q","gds":"apollo","consolidatorName":"Sky Bird Travel (US)","isTourFare":0},{"id":72,"label":"Apollo 2CX8 - Sky Bird Travel (US)","name":"2CX8","gds":"apollo","consolidatorName":"Sky Bird Travel (US)","isTourFare":0},{"id":74,"label":"Sabre K77G - Sky Bird Travel (US)","name":"K77G","gds":"sabre","consolidatorName":"Sky Bird Travel (US)","isTourFare":1},{"id":76,"label":"Sabre X02C - Sky Bird Travel (US)","name":"X02C","gds":"sabre","consolidatorName":"Sky Bird Travel (US)","isTourFare":1},{"id":78,"label":"Apollo 2E95 - Skylink","name":"2E95","gds":"apollo","consolidatorName":"Skylink","isTourFare":0},{"id":80,"label":"Apollo 2E97 - Skylink","name":"2E97","gds":"apollo","consolidatorName":"Skylink","isTourFare":0},{"id":82,"label":"Sabre U2E5 - Skylink","name":"U2E5","gds":"sabre","consolidatorName":"Skylink","isTourFare":0},{"id":84,"label":"Apollo 24TT - Skylink (CA)","name":"24TT","gds":"apollo","consolidatorName":"Skylink (CA)","isTourFare":0},{"id":86,"label":"Apollo 2ER7 - Skylink (CA)","name":"2ER7","gds":"apollo","consolidatorName":"Skylink (CA)","isTourFare":0},{"id":88,"label":"Apollo 2G53 - Cosmopolitan Travel","name":"2G53","gds":"apollo","consolidatorName":"Cosmopolitan Travel","isTourFare":0},{"id":90,"label":"Sabre 37AF - Cosmopolitan Travel","name":"37AF","gds":"sabre","consolidatorName":"Cosmopolitan Travel","isTourFare":1},{"id":92,"label":"Sabre 8WLF - Cosmopolitan Travel","name":"8WLF","gds":"sabre","consolidatorName":"Cosmopolitan Travel","isTourFare":0},{"id":94,"label":"Sabre W4FF - Cosmopolitan Travel","name":"W4FF","gds":"sabre","consolidatorName":"Cosmopolitan Travel","isTourFare":0},{"id":96,"label":"Sabre 4FTG - Greaves Travel","name":"4FTG","gds":"sabre","consolidatorName":"Greaves Travel","isTourFare":0},{"id":98,"label":"Sabre 1BJC - Downtown Travel","name":"1BJC","gds":"sabre","consolidatorName":"Downtown Travel","isTourFare":0},{"id":100,"label":"Apollo 2G56 - Aavan Vacation","name":"2G56","gds":"apollo","consolidatorName":"Aavan Vacation","isTourFare":1},{"id":102,"label":"Apollo 0H0Q - CNH","name":"0H0Q","gds":"apollo","consolidatorName":"CNH","isTourFare":0},{"id":104,"label":"Sabre FP3C - CNH","name":"FP3C","gds":"sabre","consolidatorName":"CNH","isTourFare":1},{"id":106,"label":"Apollo 2G2K - Picasso","name":"2G2K","gds":"apollo","consolidatorName":"Picasso","isTourFare":1},{"id":108,"label":"Sabre 5E9H - Picasso","name":"5E9H","gds":"sabre","consolidatorName":"Picasso","isTourFare":1},{"id":110,"label":"Sabre 1H8C - GoWay","name":"1H8C","gds":"sabre","consolidatorName":"GoWay","isTourFare":0},{"id":112,"label":"Sabre YA2G - GoWay","name":"YA2G","gds":"sabre","consolidatorName":"GoWay","isTourFare":1},{"id":114,"label":"Sabre YA3G - GoWay","name":"YA3G","gds":"sabre","consolidatorName":"GoWay","isTourFare":0},{"id":116,"label":"Sabre O4FG - Yaturist","name":"O4FG","gds":"sabre","consolidatorName":"Yaturist","isTourFare":0},{"id":118,"label":"Sabre UZ09 - Yaturist","name":"UZ09","gds":"sabre","consolidatorName":"Yaturist","isTourFare":0},{"id":120,"label":"Sabre 0BWH - Brightsun UK","name":"0BWH","gds":"sabre","consolidatorName":"Brightsun UK","isTourFare":1},{"id":122,"label":"Sabre 0EKH - Brightsun UK","name":"0EKH","gds":"sabre","consolidatorName":"Brightsun UK","isTourFare":1},{"id":124,"label":"Sabre 1NHH - Brightsun UK","name":"1NHH","gds":"sabre","consolidatorName":"Brightsun UK","isTourFare":0},{"id":126,"label":"Sabre T1G5 - Mill Run","name":"T1G5","gds":"sabre","consolidatorName":"Mill Run","isTourFare":1},{"id":128,"label":"Sabre Y6V0 - Mill Run","name":"Y6V0","gds":"sabre","consolidatorName":"Mill Run","isTourFare":0},{"id":130,"label":"Sabre H54D - Westminster","name":"H54D","gds":"sabre","consolidatorName":"Westminster","isTourFare":0},{"id":132,"label":"Sabre O4HG - VIP Service","name":"O4HG","gds":"sabre","consolidatorName":"VIP Service","isTourFare":0},{"id":134,"label":"Sabre Y2CG - VIP Service","name":"Y2CG","gds":"sabre","consolidatorName":"VIP Service","isTourFare":0},{"id":136,"label":"Apollo 13NM - ITN Tours","name":"13NM","gds":"apollo","consolidatorName":"ITN Tours","isTourFare":1},{"id":138,"label":"Amadeus SFO1S2195 - ITN Corp","name":"SFO1S2195","gds":"amadeus","consolidatorName":"ITN Corp","isTourFare":0},{"id":140,"label":"Sabre 9WE0 - Mill Run","name":"9WE0","gds":"sabre","consolidatorName":"Mill Run","isTourFare":1},{"id":142,"label":"Sabre F1E2 - Sky Bird Travel (US)","name":"F1E2","gds":"sabre","consolidatorName":"Sky Bird Travel (US)","isTourFare":0},{"id":144,"label":"Sabre 3U6I - Skylink","name":"3U6I","gds":"sabre","consolidatorName":"Skylink","isTourFare":0},{"id":146,"label":"Sabre 3U7I - Skylink (CA)","name":"3U7I","gds":"sabre","consolidatorName":"Skylink (CA)","isTourFare":0},{"id":148,"label":"Sabre E65F - Sky Bird Travel (CA)","name":"E65F","gds":"sabre","consolidatorName":"Sky Bird Travel (CA)","isTourFare":0},{"id":150,"label":"Apollo 2E4T - Sky Bird Travel (CA)","name":"2E4T","gds":"apollo","consolidatorName":"Sky Bird Travel (CA)","isTourFare":0},{"id":152,"label":"Sabre 37BF - Skylink","name":"37BF","gds":"sabre","consolidatorName":"Skylink","isTourFare":0},{"id":154,"label":"Sabre 56F9 - Skylink","name":"56F9","gds":"sabre","consolidatorName":"Skylink","isTourFare":0},{"id":156,"label":"Sabre 9Q40 - Skylink","name":"9Q40","gds":"sabre","consolidatorName":"Skylink","isTourFare":0},{"id":158,"label":"Sabre OW69 - Picasso","name":"OW69","gds":"sabre","consolidatorName":"Picasso","isTourFare":1},{"id":160,"label":"Sabre 37S2 - Brightsun UK","name":"37S2","gds":"sabre","consolidatorName":"Brightsun UK","isTourFare":0},{"id":162,"label":"Apollo 23FH - Skylink (CA)","name":"23FH","gds":"apollo","consolidatorName":"Skylink (CA)","isTourFare":0},{"id":164,"label":"Sabre OR92 - Skylink","name":"OR92","gds":"sabre","consolidatorName":"Skylink","isTourFare":0},{"id":166,"label":"Sabre H9S9 - Sky Bird Travel (US)","name":"H9S9","gds":"sabre","consolidatorName":"Sky Bird Travel (US)","isTourFare":0},{"id":168,"label":"Sabre 8QDA - Skylord Travel","name":"8QDA","gds":"sabre","consolidatorName":"Skylord Travel","isTourFare":1},{"id":170,"label":"Sabre V1OA - Skylord Travel","name":"V1OA","gds":"sabre","consolidatorName":"Skylord Travel","isTourFare":1},{"id":172,"label":"Sabre V5HG - Skylord Travel","name":"V5HG","gds":"sabre","consolidatorName":"Skylord Travel","isTourFare":1},{"id":174,"label":"Sabre 08K0 - Skylink (CA)","name":"08K0","gds":"sabre","consolidatorName":"Skylink (CA)","isTourFare":0},{"id":176,"label":"Sabre Z9X3 - Skylink (CA)","name":"Z9X3","gds":"sabre","consolidatorName":"Skylink (CA)","isTourFare":0},{"id":178,"label":"Sabre K2MI - Skylord Travel","name":"K2MI","gds":"sabre","consolidatorName":"Skylord Travel","isTourFare":0},{"id":180,"label":"Sabre W1JA - Picasso","name":"W1JA","gds":"sabre","consolidatorName":"Picasso","isTourFare":1},{"id":182,"label":"Amadeus LAXGO3100 - GoWay","name":"LAXGO3100","gds":"amadeus","consolidatorName":"GoWay","isTourFare":1},{"id":183,"label":"Sabre P3F9 - Skylink","name":"P3F9","gds":"sabre","consolidatorName":"Skylink","isTourFare":0},{"id":184,"label":"Galileo 711M - ITN Corp","name":"711M","gds":"galileo","consolidatorName":"ITN Corp","isTourFare":0},{"id":186,"label":"Sabre UR40 - Picasso","name":"UR40","gds":"sabre","consolidatorName":"Picasso","isTourFare":1},{"id":188,"label":"Sabre 4Q2B - CTI","name":"4Q2B","gds":"sabre","consolidatorName":"CTI","isTourFare":1},{"id":189,"label":"Sabre EP51 - Skylink","name":"EP51","gds":"sabre","consolidatorName":"Skylink","isTourFare":0},{"id":191,"label":"Sabre T247 - Skylink","name":"T247","gds":"sabre","consolidatorName":"Skylink","isTourFare":0},{"id":192,"label":"Sabre HA80 - Skylink","name":"HA80","gds":"sabre","consolidatorName":"Skylink","isTourFare":0},{"id":194,"label":"Amadeus LAXGO3106 - GoWay","name":"LAXGO3106","gds":"amadeus","consolidatorName":"GoWay","isTourFare":1},{"id":196,"label":"Galileo 3ZV4 - Brightsun UK","name":"3ZV4","gds":"galileo","consolidatorName":"Brightsun UK","isTourFare":1},{"id":198,"label":"Apollo 2I61 - Adam Travel","name":"2I61","gds":"apollo","consolidatorName":"Adam Travel","isTourFare":1},{"id":200,"label":"Apollo 2F3K - ITN Corp","name":"2F3K","gds":"apollo","consolidatorName":"ITN Corp","isTourFare":0},{"id":202,"label":"Apollo 2H9D - Adam Travel","name":"2H9D","gds":"apollo","consolidatorName":"Adam Travel","isTourFare":1},{"id":204,"label":"Apollo 2I3L - Adam Travel","name":"2I3L","gds":"apollo","consolidatorName":"Adam Travel","isTourFare":0},{"id":206,"label":"Apollo 1N7Q - ITN Corp","name":"1N7Q","gds":"apollo","consolidatorName":"ITN Corp","isTourFare":0},{"id":208,"label":"Apollo 1O7V - ITN Corp","name":"1O7V","gds":"apollo","consolidatorName":"ITN Corp","isTourFare":0},{"id":210,"label":"Apollo 2FD0 - ITN Corp","name":"2FD0","gds":"apollo","consolidatorName":"ITN Corp","isTourFare":0},{"id":212,"label":"Apollo 2HJ9 - ITN Corp","name":"2HJ9","gds":"apollo","consolidatorName":"ITN Corp","isTourFare":0},{"id":214,"label":"Sabre 7ECG - Sky Bird Travel (US)","name":"7ECG","gds":"sabre","consolidatorName":"Sky Bird Travel (US)","isTourFare":0},{"id":216,"label":"Galileo K9P - TravelPack","name":"K9P","gds":"galileo","consolidatorName":"TravelPack","isTourFare":0},{"id":218,"label":"Apollo 2E1I - Voyzant","name":"2E1I","gds":"apollo","consolidatorName":"Voyzant","isTourFare":0},{"id":220,"label":"Apollo 2I70 - Voyzant","name":"2I70","gds":"apollo","consolidatorName":"Voyzant","isTourFare":0},{"id":222,"label":"Galileo 69KS - ITN Corp","name":"69KS","gds":"galileo","consolidatorName":"ITN Corp","isTourFare":0},{"id":224,"label":"Sabre T42I - Voyzant","name":"T42I","gds":"sabre","consolidatorName":"Voyzant","isTourFare":0},{"id":226,"label":"Amadeus NYC1S2186 - ITN Tours","name":"NYC1S2186","gds":"amadeus","consolidatorName":"ITN Tours","isTourFare":1},{"id":228,"label":"Amadeus SFO1S2106 - ITN Corp","name":"SFO1S2106","gds":"amadeus","consolidatorName":"ITN Corp","isTourFare":0},{"id":230,"label":"Galileo 0GF - TravelPack","name":"0GF","gds":"galileo","consolidatorName":"TravelPack","isTourFare":1},{"id":232,"label":"Amadeus YTOGO3100 - GoWay Canada","name":"YTOGO3100","gds":"amadeus","consolidatorName":"GoWay Canada","isTourFare":1},{"id":234,"label":"Amadeus YTOGO310E - GoWay Canada","name":"YTOGO310E","gds":"amadeus","consolidatorName":"GoWay Canada","isTourFare":1},{"id":236,"label":"Amadeus SJC1S212D - ITN Corp","name":"SJC1S212D","gds":"amadeus","consolidatorName":"ITN Corp","isTourFare":0},{"id":238,"label":"Apollo 2H8P - Greaves Travel","name":"2H8P","gds":"apollo","consolidatorName":"Greaves Travel","isTourFare":0},{"id":240,"label":"Apollo 10OW - ITN (Canada)","name":"10OW","gds":"apollo","consolidatorName":"ITN (Canada)","isTourFare":0},{"id":242,"label":"Apollo 2I97 - Greaves Travel","name":"2I97","gds":"apollo","consolidatorName":"Greaves Travel","isTourFare":0},{"id":244,"label":"Galileo G8T - TravelPack","name":"G8T","gds":"galileo","consolidatorName":"TravelPack","isTourFare":1},{"id":245,"label":"Galileo 54F2 - ITN Corp","name":"54F2","gds":"galileo","consolidatorName":"ITN Corp","isTourFare":0},{"id":247,"label":"Galileo 802Z - ITN Corp","name":"802Z","gds":"galileo","consolidatorName":"ITN Corp","isTourFare":0},{"id":249,"label":"Galileo 80DJ - ITN Corp","name":"80DJ","gds":"galileo","consolidatorName":"ITN Corp","isTourFare":0},{"id":250,"label":"Galileo 111 - Brightsun UK","name":"111","gds":"galileo","consolidatorName":"Brightsun UK","isTourFare":1},{"id":252,"label":"Galileo 3NH - Brightsun UK","name":"3NH","gds":"galileo","consolidatorName":"Brightsun UK","isTourFare":1},{"id":254,"label":"Galileo C2Y - Brightsun UK","name":"C2Y","gds":"galileo","consolidatorName":"Brightsun UK","isTourFare":1},{"id":256,"label":"Sabre 8YGH - TravelPack","name":"8YGH","gds":"sabre","consolidatorName":"TravelPack","isTourFare":1},{"id":258,"label":"Sabre 9DDA - TravelPack","name":"9DDA","gds":"sabre","consolidatorName":"TravelPack","isTourFare":1}]
)));
app.listen(8080);

// let server = http.createServer((req, res) => {
//     let jsonRpc = require('./backend/jsonRpc.js');
//     let postStr = '';
//     req.on('data', (data) => {
//         postStr += data;
//         if (postStr.length > 2 * 1024 * 1024) {
//             req.connection.destroy();
//         }
//     });
//     req.on('end', function () {
//         let requestData;
//         try {
//             requestData = JSON.parse(postStr);
//         } catch (exc) {
//             requestData = {};
//         }
//         res.setHeader('Content-Type', 'application/json');
//
//         // Website you wish to allow to connect
//         res.setHeader('Access-Control-Allow-Origin', 'http://midiana.lv');
//
//         // Request methods you wish to allow
//         res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//
//         // Request headers you wish to allow
//         res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//
//         // Set to true if you need the website to include cookies in the requests sent
//         // to the API (e.g. in case you use sessions)
//         res.setHeader('Access-Control-Allow-Credentials', true);
//         jsonRpc.processRequest(requestData)
//             .then(responseData => {
//                 res.statusCode = 200;
//                 res.end(JSON.stringify(responseData));
//             }).catch(error => {
//                 res.statusCode = 200; // preflight OPTIONS request, damn it
//                 res.end(JSON.stringify({error: error}));
//             });
//         });
// });
//
// server.listen(8080, '0.0.0.0', () => {
//     console.log(`Server running`);
// });
