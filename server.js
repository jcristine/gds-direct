
let Diag = require('./LibWrappers/Diag.js');
Diag.error('test diag message', {please: 'work'});

/** @debug */
let express = require('express');
let app = express();
app.get('/test123', (req, res) => {
	res.send(JSON.stringify({test: 'success yay ololo'}));
});

app.listen(3011, function () {
	console.log('listening on *:' + 3011 + ' - for standard http request handling');
});

// const Config = require('./backend/Config.js');
// (async () => {
// 	await Config.fetchExternalConfig();
//
// 	require('./backend/WebRoutes.js');
// })();
