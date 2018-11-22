// apiData.prod = true;

if ( !apiData || apiData.length === 0 || !apiData.auth )
{
	throw 'ERROR PAGE';
}

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

if (apiData.prod)
{
	requirejs.onError = function (err) {

		if (err.requireType === 'timeout')
		{
			console.error('modules failed to load: ' + err.requireModules);
			return false;
		}

		throw err;
	};
}

if (apiData['scriptStart'])
{
	require(['lib/common', 'application'], function () {
		require([apiData['scriptStart']]);
	});
} else
{
	var rData = ['es6!page/common/app'];

	if (apiData.prod)
	{
		rData.push('abstract/dataTables');
	}

	require(rData, function () {
		require(apiData['jsScripts']);
	});
}