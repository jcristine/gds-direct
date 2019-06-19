
import Component from "../modules/component.es6";
import Modals from '../abstract/components/modals.js';

import AppDom from '../helpers/dom.es6';
let App = {Dom: AppDom};

import Validate from './validator.js';
import {notify} from '../helpers/debug.es6';

require('datatables.net');

// define([
// 	'abstract/validator',
// 	'abstract/notifications'
// ], function(Validate, Notify) {});

export default (function() {
	'use strict';

	var msgLang	= {
		requestLong : 'Request is taking too long, Please try reloading page',
		deleteMsg 	: 'Are you Sure you want to Delete This Record Form Db?',
		search 		: 'Search',
		newRecAdd	: 'New record successfully added',
		newRecUpdate: 'New record successfully updated',
		recordRemove: 'Record successfully removed',
		save		: 'Save',
		deleteTxt	: 'Delete',
		invalidData	: 'Invalid input data',
		edit		: 'Edit',
		create		: 'Create New'
	};

	function Responsive(api, rowIdx, columns)
	{
		var table = columns.filter( function ( column ) {
			return column.hidden;
		});

		if (table.length)
			return new Component('table').mount(function () {
				table.map( function (column) {
					this.attach(
                        Component('tr')
							.append( App.Dom('td', {innerHTML : column.title}) )
							.append( App.Dom('td', {innerHTML : column.data}) )
					)
				}, this);

			}).getContext();
	}

	function getDefaults( settings )
	{
		var defs = {
			autoWidth		: false,
			processing		: true,
			deferRender		: true,
			serverSide		: true,
			pagingType		: "full_numbers",
			iDisplayLength	: 25,
			searchDelay		: 700,
			searching		: true,
			dom				: '<"dt-head clearfix"<"pull-left"f> <"toolbar pull-left"> <"hidden-xs" p> <"m-l m-r-sm badge"i><"pull-right  m-r-sm" l> > <t> <"text-right dt-head  clearfix" <"pull-right" <"inline" p> <"m-l m-r-sm inline  badge"i> > >',
			router			: {},

			sAjaxDataProp   : 'data', // tells dataTables to take rows from 'aaData' key in response
			ajax			: function (data, callback)
			{
				// var form = document.getElementById('filter-form');
				//
				// if (form)
				// {
				// 	Array.prototype.forEach.call( form.querySelectorAll('*[name]'), function (obj) {
				// 		data[obj.name] = obj.value;
				// 	});
				// }

				$('#filter-form').serializeArray().map(function ( obj ) {
					data[obj.name] = obj.value;
				});

				var promise = fetch(settings.url, {
					method: settings.method ? settings.method.toUpperCase() : data ? 'POST' : 'GET',
					headers: {'Content-Type': 'application/json'},
					body: data ? JSON.stringify(data) : undefined,
				}).then(a => a.json());
                promise.then(callback);
			},

			language		: {
				info				: "_START_ - _END_ of _TOTAL_ ",
				lengthMenu			: "Show _MENU_",
				search				: "",
				searchPlaceholder	: msgLang.search +"...",
				paginate			: {
					next		: ">>",
					previous	: "<<"
				}
			},

			responsive		: {
				details: {
					renderer: Responsive
				}
			},

			edit			: true
		};

		return $.extend(true, {}, defs, settings);
	}

	function editButton( settings )
	{
		return {
			defaultContent 	: '',
			searchable		: false,
			orderable		: false,
			nosaveable		: true,
			className		: 'all buttons',
			createdCell		: function (cell, cellData, rowData)
			{
				var table = this;  // !!!!

				cell.appendChild( App.Dom('a.btn-xs btn btn-success', {
					innerHTML 	: '<i class="fa fa-pencil-square-o" title="Edit"></i>',
					onclick		: function () {
						EditModal( settings, table, 'editRow', rowData ).show(settings.modal);
					}
				}))
			},
			width: 35
		}
	}

	function copyButton( settings) {

		return {
			defaultContent 	: '',
			searchable		: false,
			orderable		: false,
			nosaveable		: true,
			className		: 'all buttons',
			createdCell		: function (cell, cellData, rowData)
			{
				var table = this;  // !!!!

				cell.appendChild( App.Dom('a.btn-xs btn btn-success', {
					innerHTML 	: '<i class="fa fa-copy" title="Copy"></i>',
					onclick		: function () {
						var newRowData = $.extend({}, rowData);
						delete newRowData.id;
						EditModal( settings, table, 'newRow', newRowData ).show(settings.modal);
					}
				}))
			},
			width: 35
		}
	}

	function DataTable(context, settings)
	{
		// var options = $.extend(true, {}, getDefaults(settings), settings);
		var options = getDefaults(settings);

		if (options.edit)
			options.columns.push( editButton( options ) );

		if (options.copy) {
			options.columns.push( copyButton( options ) );
		}

		context.dataTable(options);

		// if ( options.searching != false)
		// 	this.context.fnSetFilteringDelay();

		$('.js-add-new-row', context.closest('.panel') ).click( function () {
			EditModal( options, context, 'newRow', {} ).show( options.modal )
		});

		$('#filter').click(function() {
			context.DataTable().draw();
		});
	}


	$.fn.lmsDataTable = function (options) {
		var context = $(this);

		if ( $.fn.DataTable.isDataTable( context ) )
			return context.DataTable().draw();

		return DataTable( context, options );
	};

	function EditModal( settings, table, type, rowData )
	{
		var modalContext;
		var $form 		= $('<form class="form-horizontal">');

		var view		= function ()
		{
			function _makeInput(params)
			{
				if ( !params['editable'] )
					return $('<input type="hidden" name="'+params.name+'" value="'+ (params.value || '' )+'">');

				if ( params['editable'] && params['editable'] === '<hr>' )
					return '<hr style="border-color: #ddd;">';

				if ( params['editable'] && params['editable'] === 'empty' )
					return '';

				return $('<div class="form-group">').append(

					RowEditor.label(params),

					$('<div class="col-sm-7">').append(
						typeof params.editable === "function" ? params.editable(params, rowData) : RowEditor[params.editable](params, rowData)
					)
				);
			}

			function _buildInputs()
			{

				return settings.columns

					.filter( function(params) {
						return params.nosaveable !== true;
					})

					.map( function(column) {
						return _makeInput( $.extend({}, column, {value : rowData[column.name] }) );
					})

					.concat(
						'<input id="saveType" name="saveType" type="hidden" value="'+type+'">'
					);
			}

			return $form.append(
				_buildInputs()
			);
		};

		var sendRequest 	= function ()
		{
			function _validate()
			{
				return settings.columns.filter( function( column ) {
					if ( column['validate'] && !column.nosaveable )
					{
						var
							name 	= column['saveAsName'] || column['name'],
							input 	= $('[name='+name+']');

						return Validate.validateInput(input , column['validate']);
					}
				});
			}

			function send(params)
			{
				if (typeof settings.onBeforeSave === 'function')
					if ( settings.onBeforeSave( params.modal, rowData ) === false )
						return false;
				
				var disabledSelects	= $form.find('select:disabled').removeAttr('disabled');

				let body = $form.serialize();
				let delim = body ? '&' : '';
				body += delim + 'emcSessionId=' + window.GdsDirectPlusParams.emcSessionId;

				return fetch(params['url'], {
					method: 'POST',
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					body: body,

					cleanUrl: true
				}).then(a => a.json().then((resp) => resp.error
					? Promise.reject('Server returned error - ' + resp.error)
					: Promise.resolve(resp)
				).then(resp => {
					disabledSelects.prop('disabled', 1);
					if (a.status === 200) {
						notify({msg: resp.message || 'Saved successfully', type: 'success', timeout: 3000});
						if (settings.onSaveSuccess) {
							settings.onSaveSuccess(resp);
						}
					} else {
						notify({msg: resp.message || 'Bad response ' + a.status + ' ' + a.statusText, type: 'warning', timeout: 3000});
					}
					$(table).DataTable().draw();
				})).catch(exc => {
					disabledSelects.prop('disabled', 1);
					notify({msg: 'Server returned error - ' + exc});
					return Promise.reject(exc);
				});
			}

			return {
				remove	: function ()
				{
					return send({
						url		: settings.router['remove'] ? settings.router['remove'] : settings.apiUrl + '&removeData=1',
						message	: msgLang.recordRemove
					});
				},

				save	: function ()
				{
					if ( _validate().length > 0  ) //success.length === 0
					{
						notify({msg: msgLang.invalidData});
						return false;
					}

					return send({
						url		: settings.router['save'] ? settings.router['save'] : settings.apiUrl + '&setData=1',
						message	: type !== 'editRow' ? msgLang.newRecAdd : msgLang.newRecUpdate
					})
				}
			}
		};

		return {

			show	: function ( modalParams )
			{
				var title = rowData.id ? msgLang.edit : msgLang.create;

				if ( rowData.id )
					title += '<span class="m-l-xs inline label label-default">' + rowData.id + ' ' + ( rowData.name || '' ) + ' </span>';

				var params	= $.extend({}, {title : title}, modalParams);

				modalContext = Modals.make( params )

					.pushToBody(
						view()
					)

					.pushButton(
						App.Dom('button.btn btn-success btn-lg no-radius', {
							innerHTML 	: msgLang.save,
							onclick		: function () {
								sendRequest().save()
									.then(() => modalContext.close())
									.catch(exc => {});
							}
						})
					)

					.pushButton(
						App.Dom('button.btn btn-danger btn-lg no-radius', {
							innerHTML 	: msgLang.deleteTxt,
							onclick		: function () {
								if (confirm( msgLang.deleteMsg ))
									sendRequest().remove()
										.then(() => modalContext.close())
										.catch(exc => {});
							}
						})
					)

					.show( function(params) {
						params.modal.on('hidden.bs.modal', function () {
							params.modal.detach().remove();
						});

						if (typeof settings.onEditShow === 'function')
							settings.onEditShow( params.modal, rowData );
					});
			}
		}
	}

	var RowEditor = {

		link	 : function (params)
		{
			return '<a class="btn btn-xs btn-primary '+params.class+'" title="'+ (params.title || '' ) +'" data-toggle="tooltip" target="_blank" href="'+ (params.href || '') + '">' + params.text + '</a>';
		},

		button	 : function (params)
		{
			return '<button class="btn btn-sm '+params.class+'">' + params.text + '</button>';
		},

		textarea : function(params)
		{
			params = {
				'class' 		: 'form-control'
				// ,id				: params.id
				,text 			: params.value
				,name 			: params.name
				,placeholder 	: params.name
				,rows			: 5
			};

			return $('<textarea>', params);
		},

		input		: function(params)
		{
			var p = {
				// id				: params.id
				name 			: params.name
				,value 			: params.value
				,'class' 		: 'form-control input-sm'
				,placeholder 	: params.placeholder || params.title || params.name
				,"autoComplete"	: 'off'
			};

			if (params.disabled)
				p.disabled = 1;

			return $('<input>', p);
		},

		select		: function(params, row)
		{
			var select 	= $('<select class="form-control input-sm" name="'+params.saveAsName+'">');
			var list 	= ['<option value="">Not Selected</option>'];

			 Object
				 .keys(params.options)
				 .forEach(function ( index ) {
				 	list.push( new Option(params.options[index], index) )
				 });

			return select.append( list ).val( row[params.saveAsName]);
		},

		autoComplete	: function(params , row)
		{
			//TODO: remove
			return Dom.modules.autoComplete.make2({
				value 			: row[params.data]
				,lookupUrl		: params.lookupUrl
				,name			: params.saveAsName
				,saveAsValue	: row[params.saveAsName]
			});
		},

		label			: function (params)
		{
			var text = params['editFieldTitle'] || params.title || params.name;
			return '<label class="control-label col-sm-4 text-right" for="'+params.name+'">'+text+'</label>';
		}
	};

	$.fn.dataTableExt.sErrMode = function( settings, level, msg ) {
		console.error(msg);
	};

	return {

		init : function( selector, params )
		{
			var tableEl = $(selector);
			tableEl.lmsDataTable(params);
			return tableEl;
		}
	}
}());