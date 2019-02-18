
/** @debug */
let http = require("http");
let req = http.request({
	host: 'midiana.lv',
	path: 'midiana.lv/test/123',
});
req.end();

/** @debug */
let Diag = require('./backend/LibWrappers/Diag.js');
Diag.error('test diag message - server.js started', [1,2,3]);

require('./backend/WebRoutes.js');
