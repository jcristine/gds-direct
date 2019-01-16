'use strict';

// define([
// 	'jquery',
// 	'application',
// 	'moment',
// 	'lib/moment-timezone-with-data-2012-2022.min',
// 	'abstract/notifications',
// 	'abstract/user',
// 	'abstract/validator',
// 	'page/common/constants'
// ], function($, App, Moment, MomentTimezone, Notify, User, Validate, Constants) {});

export default (function() {
	let helper;
	let Constants = {VARS: {}};

	function extend(obj, src)
	{
		if (!src)
			return obj;

		Object.keys(src).forEach(function (key) {
			obj[key] = src[key];
		});

		return obj;
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
	};

	// $.lms.helper = helper;
	return helper;
}());