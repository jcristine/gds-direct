
const {jsExport} = require('klesun-node-tools/src/Debug.js');

const DiagService = require('dynatech-diag-service').default;
const Config = require('../Config.js');

const diagService = new DiagService(null, {
	host: Config.production ? 'localhost' : '10.128.128.254',
});
diagService.setProjectId(Config.mantisId);
diagService.setIsProduction(Config.production);
const parseStack = (stack) => {
	if (!stack) {
		return null;
	} else {
		const lines = stack.split('\n');
		const message = lines.shift();
		const entries = [];
		for (const line of lines) {
			let match = line.match(/^    at (.+) \((.+):(\d+):(\d+)\)\s*$/);
			if (match = line.match(/^    at (.+) \((.+):(\d+):(\d+)\)\s*$/)) {
				// "    at process._tickCallback (internal/process/next_tick.js:68:7)"
				const [_, func, file, line, col] = match;
				entries.push({func, file, line, col});
			} else if (match = line.match(/^    at (.+) \(<(anonymous)>\)\s*$/)) {
				// "    at getFetchedDataOnDemand.next (<anonymous>)",
				const [_, func, file] = match;
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
		const parsedStack = parseStack(exc.stack);
		const entries = (parsedStack || {}).entries || [];
		lastEntry = entries.filter(e =>
			!e.file.endsWith('/Rej.js') &&
            !e.file.endsWith('/translib.js'))[0];
	} catch (exc) {}

	const formatted = typeof exc === 'string' ? exc : jsExport(exc);
	if (lastEntry) {
		const {func, file, line, col} = lastEntry;
		const type = diagService.DIAG_TYPE_DEFAULT;
		const severity = diagService.DIAG_SEVERITY_ERROR;
		return diagService.logDiag([msg, formatted], line, false, 0, type, severity, file, func, null, null, null);
	} else {
		return diagService.error(msg, formatted);
	}
};

module.exports = diagService;
