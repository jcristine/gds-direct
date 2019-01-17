const {DiagService} = require('dynatech-diag-service');
const Config = require('../Config.es6');

const diagService = new DiagService(null, {
    host: Config.production ? 'localhost' : '10.128.128.254',
});
diagService.setProjectId(Config.mantisId);
diagService.setIsProduction(Config.production);
diagService.setHostname(Config.host || 'gds-direct-plus.asaptickets.com');

module.exports = diagService;
