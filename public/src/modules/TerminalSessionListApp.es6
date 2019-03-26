
let $ = require('jquery');
import DataTable from '../abstract/dataTables.js';

let isDev = !(window.location.hostname + '').endsWith('.asaptickets.com');

let init = () => {
	var msgLang = {
		id          : 'Id',
		gds         : 'Gds',
		company     : 'Company',
		requestId   : 'RequestId',
		agentId     : 'Agent Id',
		startTime   : 'Start Time',
		endTime     : 'End Time',
		logId       : 'Logger',
		restarted   : 'Restarted',
		terminate   : 'Terminate',
	};

	var curPageUrl = {
		get         : '/admin/terminal/sessionsGet',
	};

	var selfTableName   = 'terminalSessions';

	var params = {
		apiUrl: curPageUrl.get,
		url: curPageUrl.get,
		method  : 'POST',
		serverSide: false, // false - for sorting and stuff to happen on client side
		pageLength: 2000, // if there is ever so much rules sometime in future...

		searching : false,
		order   : [[0, 'DESC']],
		edit    : false,

		columns : [
			{
				name        : 'id',
				data        : 'id',
				searchable  : selfTableName + '.id',
				orderable   : true,
				editable    : false,
				width       : 100,
				title       : msgLang.id,
			},

			{
				name        : 'gds',
				data        : 'gds',
				searchable  : false,
				orderable   : false,
				editable    : false,
				width       : 120,
				title       : msgLang.gds,
			},

			{
				name        : 'agentId',
				data        : 'agentId',
				searchable  : selfTableName + '.agentId',
				orderable   : false,
				editable    : false,
				width       : 180,
				title       : msgLang.agentId,
			},

			{
				name        : 'requestId',
				data        : function (obj)
				{
					let baseUrl = isDev
						? 'https://cms.gitlab-runner.snx702.dyninno.net/leadInfo?rId='
						: 'https://cms.asaptickets.com/leadInfo?&rId=';
					return '<a class="btn-link" target="_blank" href="' + baseUrl +
						obj['requestId'] + '">' + obj['requestId'] + '</a>';
				},
				searchable  : selfTableName + '.requestId',
				orderable   : false,
				editable    : false,
				width       : 100,
				title       : msgLang.requestId,
			},

			{
				name        : 'startTime',
				data        : 'startTime',
				searchable  : false,
				orderable   : false,
				editable    : false,
				width       : 220,
				title       : msgLang.startTime,
			},

			{
				name        : 'endTimeOrder',
				data        : function (obj)
				{
					return obj['endTime'];
				},
				searchable  : false,
				orderable   : false,
				editable    : false,
				width       : 220,
				title       : msgLang.endTime,
			},

			{
				name        : 'logId',
				data        : function (obj)
				{
					let baseUrl = isDev
						? 'http://stg-logger.dyninno.net/get.php?i='
						: 'https://log.dyninno.net/get.php?i=';
					return '<a class="btn-link" target="_blank" href="' + baseUrl +
						obj['logId'] + '">' + obj['logId'] + '</a>';
				},
				searchable  : false,
				orderable   : false,
				editable    : false,
				title       : msgLang.logId,
			},
		],
	};

	var isFilter 	= document.getElementById('isFilter'),
		clearFilter = document.getElementById('clearFilter'),
		tableEl, hasToReInit;

	$('#filter-form').find('#resetFilter').on('click', function(){
		clearFilter.value	= 1;
		isFilter.value 		= 1;

		tableEl.DataTable().draw();
	});

	tableEl = DataTable.init('#table_list', params);

	$('#table_list').on('xhr.dt', function () {
		if (hasToReInit)
		{
			clearFilter.value	= 0;
			isFilter.value 		= 1;
			hasToReInit = false;
			tableEl.DataTable().draw();
		}
	});

	return Promise.resolve(true);
};

export default (appParams) => {
	window.GdsDirectPlusParams = window.GdsDirectPlusParams || {};
	window.GdsDirectPlusParams.emcSessionId = appParams.emcSessionId;
	return init();
};