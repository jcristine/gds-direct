define([
	'application',
	'es6!./newApp'
], function(App, New) {

	var Terminal = New;

	return {
		init  : function ()
		{
			Terminal.init();
		},

		execPnrCode : function (data)
		{
			Terminal.execPnrCode(data)
		},

		execRebuild : function (data)
		{
			Terminal.execRebuild(data);
		},

		pqModalCreate	: function ()
		{
			Terminal.pQuotesCreate();
		},

		pqModalClone	: function (props)
		{
			Terminal.pQuotesClone(props);
		}
	}
});