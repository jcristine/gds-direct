
let DiagService;
try {
    DiagService = require('dynatech-diag-service').DiagService;
} catch (exc) {
    DiagService = class {
        setProjectId() {};
        setIsProduction() {};
        setHostname() {};
        error() {};
    };
}
const Config = require('../Config.js');

const diagService = new DiagService(null, {
    host: Config.production ? 'localhost' : '10.128.128.254',
});
diagService.setProjectId(Config.mantisId);
diagService.setIsProduction(Config.production);
diagService.setHostname(Config.host || 'gds-direct-plus.asaptickets.com');

module.exports = diagService;
