// apiData.prod = true;


window.languages = window.languages || {};
// TODO: we don't want to use same value as in CMS!
window.wwwFullDir = window.wwwFullDir || 'http://10.128.8.117:8080';
window.apiData = window.apiData || {
    "terminalData": {"rId":0,"isStandAlone":1},
    "prod": false,
    "auth": {
        "id": 6206,
        "displayName": "aklesuns",
        "roles": [],
    }
};

requirejs.config({
	baseUrl		: '_js',
	urlArgs		: "v=" + apiData.version,
	shim 		: {
		"bootstrap" 		: {"deps" : ['jquery'] },
		"jquery-ui"			: {"deps" : ['jquery'] },
		'daterangepicker'	: {"deps" : ['jquery'] }
	},
	waitSeconds : 12,
	paths		: {
		"jquery" 				: "lib/jquery-2.1.4.min",
		"bootstrap" 			: "lib/bootstrap.min",
		"jquery-ui" 			: "lib/jquery-ui.min"
		,"moment"				: "lib/moment.min"
		,'validator'			: 'lib/validator.min'
		,'fuelux'				: 'lib/fuelux'
		,callModal				: 'modules/call/main'
		,emailModal				: 'lead/email/main'
		,es6     	: '../_contrib/tools/babel/es6',
		babel   	: '../_contrib/tools/babel/babel.min'
	},
	es6: {
		fileExtension: '.es6' // put in .jsx for JSX transformation
	},
	babel: {
		presets: ['es2015'],
		plugins: ['transform-es2015-modules-amd', 'transform-object-rest-spread']
	}
});

requirejs.onError = function (err) {

	if (err.requireType === 'timeout')
	{
		console.error('modules failed to load: ' + err.requireModules);
		return false;
	}

	throw err;
};

require(['lib/common', 'application'], function () {
	require(['gdsDirect']);
});