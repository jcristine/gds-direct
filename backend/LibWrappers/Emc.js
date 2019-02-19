
let Config = require('../Config.js');

/** @type {{Interfaces.Emc|ClientAbstract}} */
let client;
try {
	let {Emc} = require('dynatech-client-component-emc');
	client = new Emc();

	if (Config.production) {
		client.setLink('http://auth-asaptickets-com.lan.dyninno.net/jsonService.php');
	} else {
		client.setLink('http://auth.gitlab-runner.snx702.dyninno.net/jsonService.php');
	}
	client.setLogin(Config.serviceUserLogin);
	client.setPassword(Config.serviceUserPass);
	client.setDiagServiceProjectId(Config.mantisId);
	client.setProject(Config.projectName);
} catch (exc) {
	client = {
		sessionInfo: (token) => {
			return Promise.reject('EMC could not be required, possibly due to no rights - ' + exc);
		},
	};
}

exports.client = client;