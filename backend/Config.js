
const DynConfig = require('dyn-utils/src/Config.js');
const env = process.env || {};

const isProd = env.NODE_ENV === 'production';

const StaticConfig = {
	mantisId: 677,
	production: isProd,
	RBS_PASSWORD: env.RBS_PASSWORD,
};

const getExternalServices = () => ({
	// TODO: move to admin page like in CMS
	emc: {
		projectName: 'GDSD',
		login: 'gdsd',
		password: isProd ? '' : 'qwerty',
		token: isProd ? 'byXWu*Yu^8HyD23BJ4Gu' : '',
	},
	infocenter: {
		host: isProd
			? 'http://infocenter7-services-dyninno.lan.dyninno.net/server_json.php'
			: 'http://infocenter-services.gitlab-runner.php7.dyninno.net/server_json.php',
		login: 'services_infocenter',
		password: isProd ? 'Chwpjx2UlSM0pGMAQTnb' : 'Chwpjx2UlSM0pGMAQTnb',
	},
	act: {
		host: isProd
			? 'http://contracts-asaptickets-lan.dyninno.net/jsonService.php'
			: 'http://contracts.gitlab-runner.php7.dyninno.net/jsonService.php',
		// CMS, does not have access to getTicketDesignatorsV2ByCriteria
		//login: 'cms_json_service',
		//password: isProd ? '4plj42hy2EvhoZgKYthc' : 'SK8BmH2XrAlwgr3U6Hem',
		//login: 'rbs_json_service',
		//password: isProd ? 'zWpmFZbwkxPftCfZ7NRt' : 'BQK8FDCkKbk26sukZZ3H',
		// finally we have own credentials
		login: 'gdsd_json_service',
		password: isProd ? 'zrZZDO0qlrXB3Bo9Inqy' : 'zuQYTCEZN0L3O2njRwS6',
		serviceName: 'gdsd',
	},
	cms: {
		// CMS uses your EMC login/password for authentication, but since GDSD is a
		// new project, it only has the token, no password, so using CMS credentials
		host: isProd
			? 'http://services-cms-asaptickets.lan.dyninno.net/jsonService.php'
			: 'http://10.128.8.117:1337/jsonService.php',
		login: 'lms',
		password: isProd ? 'zB3+(nCy' : 'qwerty',
	},
	pqt: {
		host: isProd
			? 'http://pqt-asaptickets.lan.dyninno.net/rpc/iq-json'
			: 'http://st-pqt.sjager.php7.dyninno.net/rpc/iq-json',
		login: isProd ? 'GDSD' : 'CMS',
		password: isProd ? 'dp6FcHKqATUsGqQxU&4f' : 'qwerty',
	},
});

const hardcodedConfig = {
	external_service: getExternalServices(),
};

let fetching = null;
StaticConfig.getConfig = async () => {
	if (fetching) {
		return fetching;
	}
	fetching = DynConfig.getConfig().then(lanConfig => {
		return Object.assign({}, StaticConfig, hardcodedConfig, lanConfig);
	});
	return fetching;
};
StaticConfig.getExternalServices = getExternalServices;
StaticConfig.getStaticConfig = () => StaticConfig;

module.exports = StaticConfig;
