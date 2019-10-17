const Rej = require('klesun-node-tools/src/Rej.js');
const gds = require('../IqControllers/gds.js');
const Common = require('dynatech-node-libraries-abstract-json-service/lib/Common').default;
const crypto = require('crypto');

const routes = {
	'gds.priceItinerary': gds.priceItinerary,
};

class JsonService extends Common {
	constructor() {
		super();
		this.setServiceName('main');
		for (const [funcName, action] of Object.entries(routes)) {
			this.appendRouteMap('/' + funcName, async (req, res) => {
				const response = this.createNewResponse();
				try {
					const iqParams = req.body.params;
					const result = await action({iqParams});
					response.setResults(result);
				} catch (exc) {
					response.setException(exc);
					console.error('Failed to handle ' + funcName + ' incoming IQ JSON request', exc);
				} finally {
					res.send(response.getResponse());
				}
			});
		}
		this.app = {
			DiagService: {
				warning: () => {},
			},
		};
	}

	auth(credentials) {
		const password = credentials.password;
		if (!password) {
			throw Rej.BadRequest.makeExc('IQ JSON password not supplied');
		}
		const passwordHash = crypto.createHash('md5')
			.update(password).digest('hex');
		const correctHash = 'f64fa510fb4320e2c856fd1fb3224ea8';
		return passwordHash === correctHash;
	}
}

module.exports = JsonService;
