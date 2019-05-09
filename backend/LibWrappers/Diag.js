
const {jsExport} = require('../Utils/Misc.js');

let DiagService;
try {
    DiagService = require('dynatech-diag-service').default;
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
            if (match = line.match(/^    at (.+) \((.+):(\d+):(\d+)\)\s*$/)) {
                // "    at process._tickCallback (internal/process/next_tick.js:68:7)"
                let [_, func, file, line, col] = match;
                entries.push({func, file, line, col});
            } else if (match = line.match(/^    at (.+) \(<(anonymous)>\)\s*$/)) {
                // "    at getFetchedDataOnDemand.next (<anonymous>)",
                let [_, func, file] = match;
                entries.push({func, file, line: 0, col: 0});
            } else {
                return null;
            }
        }
        return {message, entries};
    }
};

diagService.logExc = (msg, exc) => {
    let lastEntry = null;
    try {
        let parsedStack = parseStack(exc.stack);
        let entries = (parsedStack || {}).entries || [];
        lastEntry = entries.filter(e =>
            !e.file.endsWith('/Rej.js') &&
            !e.file.endsWith('/translib.js'))[0];
    } catch (exc) {}

    let formatted = jsExport(exc);
    if (lastEntry) {
        let {func, file, line, col} = lastEntry;
        let type = diagService.DIAG_TYPE_DEFAULT;
        let severity = diagService.DIAG_SEVERITY_ERROR;
        return diagService.logDiag([msg, formatted], line, false, 0, type, severity, file, func, null, null, null);
    } else {
        return diagService.error(msg, formatted);
    }
};

module.exports = diagService;
