'use strict';

define([
	'jquery',
	'application',
	'abstract/components/autocomplete',
	'abstract/components/modals',
	'../lib/fuelux/checkbox'
], function($, App, AutoComplete, Modals) {

	var Dom 	= {};

	Dom.build 	= {

		btnToggle	: function (params)
		{
			params = params || {};

			var
				button 	= $('<button>', {
					class	: params.class 	|| ( 'btn btn-block btn-sm btn-rounded ' + params.className ),
					type	: 'button'
				}),

				input 	= $('<input>', {
					type	: params.type,
					name	: params.name,
					value	: params.value
				});

			if (params.id)
			{
				button.prop('id', params.id)
			}

			if (params.checked)
			{
				button.toggleClass('active', params.checked);
				input.prop('checked', params.checked);
			}

			button.append(
				input,
				'<i class="fa fa-check text-active">',
				params.text
			);

			button.isChecked = function () {
				return input.prop('checked');
			};

			button.check = function () {
				button.addClass('active');
				input.prop('checked', 1);
			};

			button.unCheck = function () {
				button.removeClass('active');
				input.removeAttr('checked');
			};

			return button;
		}

		,select		: function ( params )
		{
			var
				options 	= params.optionsList,
				contains	= [];

			for (var i in options)
			{
				var
					name 	= options[i].name || options[i]
					,value 	= options[i].id || i;

				contains.push(
					new Option(name, value)
				);
			}

			var select = $('<select>', {
				name		: params.name
				,class 		: params.class || 'input-sm form-control'
				,data		: params.data || {}
			});

			if (params.id)
			{
				select.prop('id', params.id)
			}

			if (params.disabled) select.prop('disabled', params.disabled);

			select.append(contains);

			if (params.selected)
			{
				select.val( params.selected );
			}

			return select;
		}

		,checkbox	: function (params)
		{
			var $hidden;

			var
				input		= $('<input>', {
					type 	: 'checkbox',
					name 	: params.name,
					id 		: params.id || params.name,
					value 	: params.value || 1
				})
				,container 	= $('<div class="checkbox">')
				,title		= $('<span>', 	{class : 'checkbox-label', text : params.title})
				,label 		= $('<label class="checkbox-custom">');

			input.on('change', params.click);

			if (params.class) container.addClass(params.class);
			if (params.addon) 	container.addClass('input-group-addon');
			if (params.checked) input.prop('checked', params.checked);

			if (params.disabled)
				input.prop('disabled', params.disabled);

			if (params.hidden)
			{
				$hidden = $('<input>', {type : 'hidden', name : params.name, value : 0});
				label.append( $hidden );
			}

			container.append(
				label.append([ input , title])
			);

			if (params.initOnHover)
			{
				label.hover(function () {
					label.checkbox();
				});
			} else
			{
				label.checkbox();
			}

			container.isChecked = function ()
			{
				return input.is(':checked');
			};

			return container;
		}
	};

	Dom.modules = {

		autoComplete 	: AutoComplete,
		modal			: Modals,
		popovers		: function(props)
		{
			return new Promise(function (resolve) {
				require(['es6!abstract/components/popover'], function (Popover) {
					return resolve(
						new Popover.PopoverBs(props)
					);
				});
			});
		},

		popover			: {

			build		: function ( params )
			{
				params = params || {};

				var
					context 	= null
					,view 		= []
					,trigger;

				return {

					make		: function ()
					{
						var defaults = {
							trigger 	: 'click',
							viewport 	: { selector: 'body', padding: 0 },
							placement	: 'top',
							html		: true,
							container	: 'body',
							template	: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
							animation	: false,
							content		: function () {
								if (view.length)
									return view
							}
						};

						context = trigger.popover(
							Object.assign({}, defaults, params)
						);

						return this;
					}

					,attachTo		: function ( element )
					{
						trigger = element instanceof $ ? element : $(element);
						return this;
					}

					,withClose		: function ( soft )
					{
						view.unshift(
							App.Dom('span.btn btn-xs btn-white close-rounded[&times;]', {
								onclick		:  function () {
									context.popover( soft ? 'hide' : 'destroy');
								}
							})
						);

						return this;
					}

					,content		: function( body )
					{
						if ( body )
							view.push( body );

						return this;
					}

					,confirm		: function( callback )
					{
						view.push(
							App.Dom('button.btn btn-sm btn-success btn-block m-t font-bold', {
								type 		: 'button',
								innerHTML 	: 'Process',
								onclick		: callback
							})
						);

						return this;
					}

					,show			: function( callback )
					{
						context.popover('show');

						if (typeof callback === 'function')
						{
							callback( context );
						}

						return context;
					},

					getContext 		: function () {
						return context;
					}

					,hide			: function ()
					{
						context.popover('hide');
					}
				}
			}
		}
	};

	$( "body" ).on( "mouseenter", "*[data-init='tooltip']", function() {

		var params = {
			html : true
		};

		var data = $(this).data();

		if ( data['container'] !== false )
		{
			params.container = 'body';
		}

		var tip = $(this).tooltip( params );

		tip.tooltip('show');
	});

 	return Dom;
});