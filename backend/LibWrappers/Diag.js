
let DiagService;
try {
    DiagService = require('dynatech-diag-service').DiagService;
} catch (exc) {
    DiagService = class {
        setProjectId() {};
        setIsProduction() {};
        setHostname() {};
        log() {};
        notice() {};
        error() {};
    };
}
const Config = require('../Config.js');

const diagService = new DiagService(null, {
    host: Config.production ? 'localhost' : '10.128.128.254',
});
diagService.setProjectId(Config.mantisId);
diagService.setIsProduction(Config.production);
let parseStack = (stack) => {
    if (!stack) {
        return null;
    } else {
        let lines = stack.split('\n');
        let message = lines.shift();
        let entries = [];
        for (let line of lines) {
            let match = line.match(/^    at (.+) \((.+):(\d+):(\d+)\)\s*$/);
            if (!match) {
                return null;
            } else {
                let [_, func, file, line, col] = match;
                entries.push({func, file, line, col});
            }
        }
        return {message, entries};
    }
};

diagService.logExc = (msg, exc) => {
    let parsedStack = parseStack(exc.stack);
    let entries = (parsedStack || {}).entries || [];
    let lastEntry = entries.filter(e => !e.file.endsWith('/Rej.js'))[0];
    if (lastEntry) {
        let {func, file, line, col} = lastEntry;
        let type = diagService.DIAG_TYPE_DEFAULT;
        let severity = diagService.DIAG_SEVERITY_ERROR;
        return diagService.logDiag([msg, exc], line, false, 0, type, severity, file, func, null, null, null);
    } else {
        return diagService.error(msg, exc);
    }
};

module.exports = diagService;
