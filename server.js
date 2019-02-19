
const Config = require('./backend/Config.js');

let Diag = require('./backend/LibWrappers/Diag.js');
Diag.error('test diag message', {please: 'work'});

/** @debug */
let express = require('express');
let app = express();
app.get('/test123', (req, res) => {
	res.send(JSON.stringify({test: 'success yay ololo'}));
});
app.get('/testConfigLan', (req, res) => {
	Config.fetchExternalConfig()
		.then(none => res.send(JSON.stringify({message: 'success'})))
		.catch(exc => res.send('Failed to fetch config lan - ' + exc));
});

app.listen(process.env.HTTP_PORT, process.env.HOST, function () {
	console.log('listening on *:' + process.env.HTTP_PORT + ' - for standard http request handling');
});

// const Config = require('./backend/Config.js');
// (async () => {
// 	await Config.fetchExternalConfig();
//
// 	require('./backend/WebRoutes.js');
// })();
