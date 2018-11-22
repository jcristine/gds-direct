'use strict';

define([
	'jquery',
	'application',
	'moment',
	'lib/moment-timezone-with-data-2012-2022.min',
	'abstract/notifications',
	'abstract/user',
	'abstract/validator',
	'page/common/constants'
], function($, App, Moment, MomentTimezone, Notify, User, Validate, Constants) {

	var helper;
	var bubbleMsg = Notify['bubble_msg'];

	var locales = {
		relativeTime: {
			future: 'in %s',
			past  : '%s ago',
			s     : 'seconds',
			m     : 'a min',
			mm    : '%d min',
			h     : '1 hour',
			hh    : '%d hrs',
			d     : 'a day',
			dd    : '%d days',
			M     : 'a mth',
			MM    : '%d mths',
			y     : 'a year',
			yy    : '%d years'
		}
	};

	Moment.updateLocale('en',locales);

	function extend(obj, src)
	{
		if (!src)
			return obj;

		Object.keys(src).forEach(function (key) {
			obj[key] = src[key];
		});

		return obj;
	}

	var PriceQuotes = function ()
	{
		var colorList;

		function _getColorList()
		{
			return App.get('pqStatusColors');
		}

		function _getColor( statusName )
		{
			colorList = colorList || _getColorList();
			return colorList[statusName] || 'purple';
		}

		return {
			getColor : _getColor
		};
	};

	var Request = function(params) {
		var xhr;

		params = extend({
			dataType: 'json',
			method  : 'GET'
		}, params);

		function makeUrl( url )
		{
			if (url.substr(0, 1) !== '/')
				url = '/' + url;

			if (!params.cleanUrl)
				url = wwwFullDir + url;

			return url;
		}

		if (params.url)
			params.url = makeUrl( params.url );

		function _before()
		{
			if (params.noLoader)
			{
				return params;
			}

			if (params.loaderStay)
			{
				params.noLoader 	= true;
				params.loaderFull 	= true;
			}

			if (params.loaderFull)
			{
				helper.loader.show();
			} else
			{
				helper.spinner.show();
			}
		}

		function finalize(response)
		{
			if (!params.noLoader)
			{
				helper.loader.hide();
				helper.spinner.hide();
			}

			return response;
		}

		function _onError(params)
		{
			helper.loader.hide();
			helper.spinner.hide();

			var responseJSON    = params['responseJSON'] || {};

			if (params['loginAuth'] || responseJSON['loginAuth'])
			{
				return App.publish('loginForm/show', '');
			}

			var msg = params;

			if (typeof params === 'object' && params.status )
			{
				msg = 'Server is not responding correctly. Please wait few seconds and try again';

				if (params['responseJSON'] && params['responseJSON']['fail'])
				{
					msg = params['responseJSON']['fail'];
				}
			}

			bubbleMsg.danger(msg, 7000);

			return Promise.reject();
		}

		function showMessages( response )
		{
			var mapping = {
				dangerMsg 	: 'danger',
				warningMsg	: 'warning',
				message		: 'info'
			};

			['dangerMsg', 'warningMsg', 'message']
				.filter(function (type) {
					return response[type];
				})
				.forEach(function (type) {
					bubbleMsg[ mapping[type] ]( response[type], 7000 );
				});
		}

		_before();

		xhr = $.ajax( params );

		function _onSuccess(response)
		{
			if (response['failedInput'])
			{
				var error = response['fail'] || response['warningMsg'] || 'Something terrible happened';

				Validate.assignError(
					$('*[name="' + response['failedInput'] + '"]'), [{msh : error}]
				);
			}

			finalize(response);
			showMessages(response);

			return response;
		}

		if (params.promise)
		{
			return Promise.resolve(xhr)
				.then(_onSuccess)
				.catch(_onError);
		}

		return $.Deferred().resolve()
			.then( function () { return xhr; })
			.then(_onSuccess)
			.fail(_onError);
	};

	function LoadingHelper( params )
	{
		var context, isShown;

		function _getContext()
		{
			context = context || $(params.context);
			return context;
		}

		function _show()
		{
			if ( isShown )
				return false;

			isShown = !isShown;

			_getContext().removeClass( params.className );
		}

		function _hide()
		{
			if ( !isShown )
				return false;

			isShown = !isShown;

			_getContext().addClass( params.className );
		}

		return {
			show 	: _show,
			hide	: _hide
		};
	}

	function getCurrentUrl() {
		return new URL(window.location.href);
	}

	function replaceHistoryState(url) {
		// In some places e.g. email templates we need to use encoded URL to preserve correct values
		var newUrl = decodeURIComponent(url.toString());

		window.history.replaceState(window.history.state, '', newUrl);
	}

	// Manages URL part that contains something like /?key=value
	var varHistoryState = {
		update: function (key, value) {
			var url = getCurrentUrl();

			if (typeof value === 'object') {
				value = JSON.stringify(value);

				if (value === '""') {
					value = '';
				}
			}

			if (value !== '') {
				url.searchParams.set(key, value);
			} else {
				url.searchParams.delete(key);
			}

			replaceHistoryState(url);
		},
		get: function (key, defaultValue, json) {
			var url = getCurrentUrl();

			if (url.searchParams.has(key)) {
				var value = url.searchParams.get(key);

				if (json) {
					value = JSON.parse(value);
				}

				return value;
			}

			return defaultValue;
		},
		remove: function (key) {
			var url = getCurrentUrl();

			url.searchParams.delete(key);
			replaceHistoryState(url);
		}
	};

	// Manages URL part that contains something like /?key=value1,value2,value3
	var arrayHistoryState = {
		add: function (key, value) {
			var url = getCurrentUrl();

			var data = (url.searchParams.get(key) || '').split(',').filter(function (value) {
				return value !== '';
			});

			if (data.indexOf(value) === -1) {
				data.push(value);
			}

			url.searchParams.set(key, data.join(','));

			replaceHistoryState(url);
		},
		get: function (key) {
			var url 	= getCurrentUrl(),
				data 	= (url.searchParams.get(key) || '').split(',').filter(function (value) {
					return value !== '';
				});

			return data;
		},
		exists: function (key, value) {
			var url 	= getCurrentUrl(),
				data 	= (url.searchParams.get(key) || '').split(',');

			return data.indexOf(value) >= 0;
		},
		remove: function (key, args) {
			var url = getCurrentUrl(),
				data = (url.searchParams.get(key) || '').split(',').filter(function (value) {
					return value !== '';
				});

			Array.prototype.forEach.call(args, function (keyToRemove) {
				var index = data.indexOf(keyToRemove);

				if (index !== -1)
					data.splice(index, 1);
			});

			if (!data.length) {
				url.searchParams.delete(key);
			} else {
				url.searchParams.set(key, data.join(','));
			}
			
			replaceHistoryState(url);
		}
	};

	helper = {
		// TODO: this whole part will be optimized, this is just initial version.
		url: {
			current	: function() {
				return getCurrentUrl();
			},
			modal	: {
				open	: function (data) {
					var modalId = data && data.modalId ? data.modalId : false;
	
					// Update URLs only for modals that have some data
					if (modalId !== false) {
						var url = getCurrentUrl();

						url.searchParams.set(Constants.VARS.modalId, modalId);
	
						var modalData = data && data.modalData ? data.modalData : false;

						if (modalData !== false) {
							url.searchParams.set(Constants.VARS.modalData, JSON.stringify(modalData));
						}
	
						replaceHistoryState(url);
					}
				},
				close	: function (removeParams) {
					var url = getCurrentUrl();
	
					if (url.searchParams.has(Constants.VARS.modalId)) {
						url.searchParams.delete(Constants.VARS.modalId);
						url.searchParams.delete(Constants.VARS.modalData);
						removeParams.forEach(function (p) {
							url.searchParams.delete(p);
						});

						replaceHistoryState(url);
					}
				},
				exists	: function (modalId, compare) {
					var url = getCurrentUrl();

					if (
						url.searchParams.has(Constants.VARS.modalId)
						&& url.searchParams.get(Constants.VARS.modalId) === modalId
					) {
						if (typeof compare === 'function') {
							var data = JSON.parse(getCurrentUrl().searchParams.get(Constants.VARS.modalData));

							return compare(data);
						}

						return true;
					}

					return false;
				}
			},
			panel	: {
				add		: function (panelId) {
					arrayHistoryState.add('panels', panelId);
				},
				exists	: function (panelId) {
					return arrayHistoryState.exists('panels', panelId);
				},
				remove	: function () {
					arrayHistoryState.remove('panels', arguments);
				}
			},
			var		: varHistoryState,
			array	: arrayHistoryState,
			canUpdateLeadUrl() {
				var url = getCurrentUrl();
				if (url.pathname === '/leadCreate') {
					return true;
				}
				return false;
			}
		},
		storage					: {
			get			: function(name)
			{
				var retrievedObject = localStorage.getItem(name) || '';

				if (retrievedObject)
					return JSON.parse(retrievedObject);
			},

			set			: function (name, val)
			{
				localStorage.setItem(name, JSON.stringify(val));
			}

			,remove		: function (name)
			{
				localStorage.removeItem(name);
			}
		},

		formatter				: {
			phpString	: function (str)
			{
				if (!str)
					return '';

				return str
					.replace(/\\\\\\/g, "")
					.replace(/(?:\\[rn])+/g, '<br>');
			}

			,timeLength		: function (seconds)
			{
				if (!seconds)
					return '';

				return Moment.duration(seconds, "seconds").humanize(false);
			}

			,capitalize	: function ( str )
			{
				return str.charAt(0).toUpperCase() + str.slice(1);
			},

			localizeNumber : function( str )
			{
				str = str || 0;

				return parseFloat(str).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			}
		},

		date					: {

			defaultFormat	: null,

			getDefFormat	: function ()
			{
				return this.defaultFormat = this.defaultFormat || function () {
					var formatter 	= App.get('formatter') || {},
						date		= formatter.date || 'MM/DD/YY',
						time		= formatter.time || 'h:mm A';

					return {
						date 	: date,
						time	: time,
						dateTime: date + ' ' + time
					};
				}();
			},

			momentObj	: function(date, format)
			{
				return Moment(date, format);
			},

			checkEmpty	: function (date)
			{
				if (!date || date === '0000-00-00 00:00:00')
					return 1;

				return false;
			},

			formatSqlDate	: function (sqlDate, type, withTimezone)
			{
				if (this.checkEmpty(sqlDate))
					return '';

				var format, formatter = this.getDefFormat();

				format = type === 'date' ? formatter.date : formatter.dateTime;

				if (withTimezone)
					format += ' z';

				if (type === 'time')
					format = formatter.time;
				if (type === 'year')
					format = 'YYYY';
				if (type === 'month')
					format = 'MM';
				if (type === 'forCalendar')
					format = 'YYYY-MM-DD HH:mm:ss';
                if (type === 'dateTimeWithSeconds')
                    format = 'YYYY-MM-DD HH:mm:ss' + (withTimezone ? ' z' : '');
				if (type === 'YYYY-MM-DD')
					format = 'YYYY-MM-DD';
				if (type === 'MM/DD/YYYY')
					format = 'MM/DD/YYYY';
				if (type === 'HH:mm')
					format = 'h:mm A';
				if (type === 'mm:ss')
					format = 'mm:ss';
				if (type === 'hh:mm:ss')
					format = 'hh:mm:ss A ' + (withTimezone ? ' z' : '');
				if (type === 'forNotifications')
					format = 'DD-MMM-YY h:mm A' + (withTimezone ? ' z' : '');
				if (type === 'forNotifications')
					format = 'DD-MMM-YY h:mm A' + (withTimezone ? ' z' : '');
				if (typeof type === 'object' && type.type === 'custom')
					format = type.format + (withTimezone ? ' z' : '');

				if ( typeof sqlDate === 'object' && sqlDate.timestamp && sqlDate.timezone ) {
					return MomentTimezone.unix(sqlDate.timestamp).tz(sqlDate.timezone).format(format);
				} else if ( typeof sqlDate === 'object' && sqlDate._tz && sqlDate._ts ) {
					return MomentTimezone.unix(sqlDate._ts).tz(sqlDate._tz).format(format);
				} else {
					return Moment(sqlDate).format(format);
				}
			}

			,timePicker	: function (time)
			{
				if (this.checkEmpty(time))
					return '';

				return Moment(time).utc().format('h:mm A');
			}

			,format			: {

				sqlMonth	: function(sqlDate)
				{
					if (!sqlDate || sqlDate === '0000-00-00 00:00:00')
						return '';

					return Moment(sqlDate).format('MMM DD');
				}

				,sqlMonthYear	: function(sqlDate)
				{
					if (!sqlDate || sqlDate === '0000-00-00 00:00:00')
						return '';

					return Moment(sqlDate).format('DD-MMM-YY');
				}

				,timeStamp	: function(date)
				{
					if (!date)
						return '';

					return Moment(date).format('DD-MMM-YY h:mm A');
				}
			}

			,formatTimeLength	: function (data)
			{
				if (!data)
					return '00:00:00';

				var sec_num = parseInt(data, 10);
				var hours   = Math.floor(sec_num / 3600);
				var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
				var seconds = sec_num - (hours * 3600) - (minutes * 60);

				if (hours   < 10) {hours   = "0"+hours;}
				if (minutes < 10) {minutes = "0"+minutes;}
				if (seconds < 10) {seconds = "0"+seconds;}

				return hours+':'+minutes+':'+seconds;
			}

			,utcOffsetTime	: function (utc)
			{
				if ( !utc )
					return {};

				var dateMoment 	= Moment().utcOffset(utc)
					,hour		= dateMoment.get('hour')
					,textClass 	= (hour >=8  && hour <= 20) ? 'text-success dk' : 'text-danger'
				;

				return  {
					time 		: dateMoment.format('h:mm A')
					,textClass	: textClass
				};
			}

			,formatCustomerTime	: function (date, timeZone)
			{
				if (this.checkEmpty(date))
					return {};

				var dateMoment 	= Moment(date)
					,hour		= dateMoment.get('hour')
					,textClass 	= (hour >=8  && hour <= 20) ? 'text-success dk' : 'text-danger'
				;

				if (timeZone)
				{
					dateMoment.tz(timeZone);
				}

				return  {
					time 		: dateMoment.format('h:mm A z')
					,textClass	: textClass
				};
			}

			,calculateHowSoon : function (date)
			{
				var now 	= Moment();
				var utc 	= App.get('timeZone') || '+00:00';
				var than 	= Moment(date+' '+utc, "YYYY-MM-DD HH:mm:ss Z");

				return Moment.duration(now.diff(than));
			}

			// getting current company time in milliseconds
			,currentCompanyTimeInMs: function()
			{
				var utc	= App.get('curTimeZone') || '+00:00';

				return Moment.utc().utcOffset(utc).format('x');
			}

			// getting request assign time in milliseconds
			,getRequestAssignTime: function()
			{
				var utc 	= App.get('curTimeZone') || '+00:00';

				return Moment(App.get('lead')['assigned'] + utc).format('x');
			}
		},

		spinner					: (function()
		{
			return new LoadingHelper({
				context		: '#spinners',
				className 	: 'hidden'
			});
		}()),

		loader					: (function()
		{
			var _super = new LoadingHelper({
				context		: '#loadingDots',
				className 	: 'loading-hidden'
			});

			var context = {};

			context.show = function () {
				_super.show();
				helper.spinner.show();
			};

			context.hide = function () {
				_super.hide();
				helper.spinner.hide();
			};

			return context;
		}()),

		apiRequest			: {

			make_request: function ( params )
			{
				return new Request( params );
			},

			post: function ( params )
			{
				params = extend(params, { method  : 'POST' });

				return new Request( params );
			},

			promise: function( params )
			{
				params = extend(params, {promise : true});

				function makeRequest(params)
				{
					return new Request(params);
				}

				return {
					get : function ()
					{
						return makeRequest( params );
					},

					post : function ()
					{
						params = extend(params, { method  : 'POST'});
						return makeRequest( params );
					}
				};
			}
		}

		,objectToArray			: function (obj)
		{
			return Object.keys( obj ).map(function(k) {
				return obj[k];
			});
		},

		priceQuote				: PriceQuotes(),

		lead 					: {

			getDepDate			: function( lead )
			{
				if (!lead || !lead.destinations || !lead.destinations[1] || !lead.destinations[1][1])
					return false;

				return helper.date.format.sqlMonthYear( lead.destinations[1][1]['departureDateMin'] );
			}

			,getDepDateValidJsDate			: function( lead )
			{
				if (!lead || !lead.destinations || !lead.destinations[1] || !lead.destinations[1][1])
					return false;

				return helper.date.formatSqlDate( lead.destinations[1][1]['departureDateMin'], 'forCalendar' );
			}

			,queueStatus		: function(queues, showFull)
			{
				function _get(id)
				{
					var queue = queues[id];

					if ( !queue )
					{
						return '';
					}

					var parentId = queue.parentId;

					if (parseInt(parentId) > 0)
					{
						var belongsTo = queues[parentId];

						if (showFull)
						{
							return App.components.create('div.inline t-help m-r-xs label label-' + belongsTo.className, {
								'data-init' : 'tooltip',
								title		: App.language.get( belongsTo.label )
							})
								.append([
									App.Dom('span', {
										innerHTML 	: App.language.get( queue.label )
									})
								]);
						}

						return queues[belongsTo.name !== 'closed' ? parentId : id].label;
					}

					return queues[id].label ? queues[id].label : '';
				}

				return {
					parse		: function(id)
					{
						if ( !queues || queues.length === 0 )
							return '';

						if (typeof id === 'string')
							id = [id];

						return id.map(function(i) {
							return _get(i);
						});
					}
				};
			}

			,createNew				: function( params )
			{
				helper.loader.show();

				var form = $('<form>', {method : 'POST', action : 'leadCreate'}).append(
					$('<input>', {type: 'hidden', name : 'cId', value : params.cId || ''})
					,$('<input>', {type: 'hidden', name : 'reason', value : params.reason || ''})
					,$('<input>', {type: 'hidden', name : 'customer', value : ''})
					,$('<input>', {type: 'hidden', name : 'discountReferralCode', value : ''})
					,$('<input>', {type: 'hidden', name : 'content', value : ''})
					,$('<input>', {type: 'hidden', name : 'voipCallId', value : ''})
					,$('<input>', {type: 'hidden', name : 'voipCallerPhone', value : ''})
					,$('<input>', {type: 'hidden', name : 'fromClientsSection', value : params.fromClientsSection || ''})
				).appendTo('body');

				form.submit();
			}
		}

		,loaded					: {}

		,appendStylesheet		: function( url )
		{
			if (this.loaded[url])
				return false;

			this.loaded[url] = url;
			var link         = document.createElement("link");
			link.type        = "text/css";
			link.rel         = "stylesheet";
			link.href        = url;
			document.getElementsByTagName("head")[0].appendChild(link);
		},

		loadScript : function(url, load, version)
		{
			if (loadedScripts[url])
			{
				load();
				return '';
			}

			loadedScripts[url] = true;

			var script 		= document.createElement('script');
			script.onload	= load;
			script.src 		= url + (version ? ('?v=' + apiData.version) : '');

			(document.head || document.getElementsByTagName('head')[0]).appendChild(script);
		},

		teamSelect		: function( selectEl )
		{
			function createOption(team, pos)
			{
				var margin = new Array(pos * 2).join('\xa0');

				return new Option( margin + team.name, team.id );
			}

			// var marginIndex = [0, 2, 5, 7, 9, 11];
			// var marginIndex = [0, 2, 4, 6, 8, 10];

			function makeTeams( teams, index )
			{
				var options = [];

				teams.map(function ( team ) {

					options.push(
						createOption( team, index*2 )
					);

					makeTeams( team.teams, index + 1 ).map(function (subTeams) {
						options.push( subTeams );
					});
				});

				return options;
			}

			selectEl.append(
				makeTeams(App.get('teams'), 0)
			);

			if (App.get('teamId'))
				selectEl.val(App.get('teamId'));

			this.wrapSelect2(selectEl);
		},

		wrapSelect2	: function (selectEl, options)
		{
			selectEl = selectEl instanceof $ ? selectEl : $( selectEl );

			options	= extend({theme : "bootstrap"}, options);

			require(['select2'], function() {
				selectEl.select2( options );
			});
		},

		cookie							: {
			get	: function(name)
			{
				var value = '; ' + document.cookie;
				var parts = value.split('; ' + name + '=');

				if (parts.length === 2)
					return parts.pop().split(';').shift();
			},

			set	: function(name, value, xdays)
			{
				var d = new Date();
				xdays = !isNaN(parseFloat(xdays)) ? parseFloat(xdays) : 1;
				d.setTime(d.getTime() + (xdays*24*60*60*1000));
				var expires = 'expires='+ d.toUTCString();
				document.cookie = name + '=' + value + '; ' + expires;
			}
		},
		browser : function()
		{
			var nAgt 		 = navigator.userAgent;
			var fullVersion, browserName;

			function detect(data)
			{
				var name = data[0], offset = data[1];
				var verOffset = nAgt.indexOf(name);

				if ( verOffset !== -1 )
				{
					browserName = name;
					fullVersion = nAgt.substring(verOffset + offset);

					return 'Browser name  = '+browserName + ' Full version  = '+fullVersion;
				}

				return false;
			}

			var found = false;

			[ ["OPR/", 4],["Opera", 6],["MSIE", 5],["Chrome", 7],["Safari", 7],["Firefox", 8] ]
				.forEach( function(data) {
					if ( !found )
						found = detect(data);
				});

			return found;
		}
	};

	var loadedScripts = {};

	// $.lms.helper = helper;
	return helper;
});