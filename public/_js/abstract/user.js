'use strict';

define([
	'jquery',
	'application'
], function($, App) {

	var processing;

	return {

		customer: (function ()
		{
			var limit = App.get('ableToSeeContacts');

			var getRevealAttempts = function ()
			{
				return limit;
			};

			var decreaseLimit = function ()
			{
				limit--;
			};

			processing = null;

			var getContacts = function (data)
			{
				//TODO :: find better way. removed from define ... it raised conflicts with helper and notifications
				var Notify = require('abstract/notifications');
				var Helper = require('abstract/helper');

				var limit = getRevealAttempts();

				if (!limit || limit === 0)
				{
					Notify.bubble_msg.warning('No more Attempts left');
					return Promise.reject();
				}

				if (processing)
					return Promise.reject();

				processing = data;

				return Helper.apiRequest.promise({
					url		: 'clients/' + ( data.all ? 'customerContacts' : 'customerInfo' ),
					data	: {id: data.id}
				}).post().then(function (response) {

					decreaseLimit();
					processing = false;

					if (response.msg)
						Notify.bubble_msg.warning(response.msg);

					return response;
				});
			};

			return {
				getContacts			: getContacts
				,getRevealAttempts	: getRevealAttempts
			}
		})(),


		company : {
			asArray 	: null,
			asObject 	: {},
			active		: '',
			getColor	: function()
			{
				return App.get('companyColor')[App.get('auth')['companyId']];
			},

			getData 	: function ()
			{
				var companies 	= App.get('availableCompanies');

				this.asArray 	= this.asArray || Object.keys(companies).map(function(value) {
					if (companies[value] === apiData.company)
						this.active = value;

					return {
						id 		: value,
						label	: companies[value]
					}
				}, this);

				return {
					asObject 	: companies,
					asArray		: this.asArray,
					active		: this.active
				}
			}
		}

		,agent	: (function() {

			var Auth = App.get('auth');

			var
				companyId 				= Auth.companyId
				,company 				= App.get('company')
				,amITester				= Auth.isTester
				,amIAdmin				= Auth.isAdmin
				,amIDev					= Auth.isDev
				,amIManager				= Auth.isManager
				,amISuperVisor			= Auth['isSupervisor']
				,amISeniorSuperVisor	= Auth['isSeniorSupervisor']
				,amIExpert				= Auth.isExpert
				,amIExpertSupervisor	= Auth.isExpertSupervisor
				,amICompliance			= Auth.isCompliance
				,amISeniorCompliance 	= Auth.isSeniorCompliance
				,amIAgent				= Auth.isAgent
				,amIRequestManager		= Auth.isRequestManager
				,amICustomerSupport		= Auth.isCustomerSupport
				,id						= parseInt(Auth.id)
				,roles					= Auth.roles.map( function (el) {
					return el
				})
				,login					= Auth.displayName;

			if (App.get('lead') && App.get('lead')['company'])
			{
				company = App.get('lead')['company'];
			}

			var getCompanyId = function() {
				return companyId
			};

			var getCompany = function() {
				return company
			};

			var isAgent = function() {
				return amIAgent
			};

			var getId	= function() {
				return id;
			};

			var getLogin= function() {
				return login;
			};

			var isTester	= function() {
				return amITester;
			};

			var isAdmin	= function() {
				return amIAdmin;
			};

			var isDev	= function() {
				return amIDev;
			};

			var isManager = function() {
				return amIManager;
			};

			var isSeniorSuperVisor	= function() {
				return amISeniorSuperVisor;
			};

			var isSuperVisor	= function() {
				return amISuperVisor;
			};

			var isExpert	= function() {
				return amIExpert;
			};

			var isExpertSupervisor	= function() {
				return amIExpertSupervisor;
			};

			var isCompliance	= function() {
				return amICompliance;
			};

			var isSeniorCompliance = function() {
				return amISeniorCompliance;
			};

			var isRequestManager = function() {
				return amIRequestManager;
			};

			var isCustomerSupport = function() {
				return amICustomerSupport;
			};

			var _getRoles = function() {
				return roles;
			};

			var _roles = {};

			var _hasRole = function(name) {
				if (_roles[name] === undefined)
					_roles[name] = roles.indexOf(name) !== -1;

				return _roles[name];
			};

			var _hasRoles = function(roles)
			{
				return roles.filter( function(role) {
					return _hasRole(role);
				}).length > 0;
			};

			return {
				getCompanyId 			: getCompanyId
				,getCompany 			: getCompany
				,isTester 				: isTester
				,isAdmin 				: isAdmin
				,isDev 					: isDev
				,isManager 				: isManager
				,isSeniorSuperVisor 	: isSeniorSuperVisor
				,isSuperVisor 			: isSuperVisor
				,isSeniorCompliance		: isSeniorCompliance
				,isExpert 				: isExpert
				,isExpertSupervisor 	: isExpertSupervisor
				,isCompliance 			: isCompliance
				,isAgent 				: isAgent
				,isRequestManager 		: isRequestManager
				,isCustomerSupport 		: isCustomerSupport
				,getId 					: getId
				,getLogin				: getLogin
				,getRoles				: _getRoles
				,hasRole				: _hasRole
				,hasRoles				: _hasRoles
			}
		})()
	};
});
