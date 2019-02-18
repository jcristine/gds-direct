
/** @debug */
let Diag = require('./backend/LibWrappers/Diag.js');
Diag.error('test diag message - server.js started', [1,2,3]);

require('./backend/WebRoutes.js');
