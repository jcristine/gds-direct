
const InfocenterClient = require('dynatech-client-component-infocenter');
const Config = require('../Config.js');

exports.getInfocenter = async () => {
	const credentials = Config.getExternalServices().infocenter;
	return InfocenterClient(credentials);
};
