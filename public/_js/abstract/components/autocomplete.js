'use strict';

define([
	'jquery',
	'application',
	'abstract/helper',
	'lib/auto-complete.min'
], function ($, App, Helper, AcLib) {

	var msgLang	= App.language.translate({
		typeSearch : 'Type to search'
	}, 'abstract.components/autocomplete.js' );

	var
		geo 	= false,
		geoType = App.get('geoTypes'); //city, airport

	var Multiple	= function(name, values, params)
	{
		var context = App.Dom('ul.pillbox clearfix');

		function addPill(value)
		{
			var li = App.Dom('li.label label-default', {
				title 		: value.label 	|| '',
				innerHTML	: value.show 	|| value.label,
				onclick		: function(e) {
					e.target.parentNode.removeChild( e.target );

					if (params.onRemove && typeof params.onRemove === 'function') {
						params.onRemove(context);
					}
				}
			});

			li.appendChild(
				App.Dom('input', {type : 'hidden', name : name, value : value.value})
			);

			context.appendChild( li );
		}

		function selectFromList(event, term, item)
		{
			if ( context.querySelectorAll('input[value="'+item.getAttribute('data-id')+'"]').length )
				return false;

			event.target.value = '';

			addPill({
				label 	: item.getAttribute('data-label'),
				show 	: item.getAttribute('data-show'),
				value 	: item.getAttribute('data-id')
			});

			if (params.onAdd && typeof params.onAdd === 'function') {
				params.onAdd(context);
			}

			return false;
		}

		for (var i in values)
		{
			addPill( values[i] );
		}

		return {
			selectFromList		: selectFromList,
			getContext			: function()
			{
				return context;
			}
		}
	};

	function PqHotels (inputDom, params)
	{
		var props = {
            lookupUrl 			: params.lookupUrl,
			tags				: true,
			onSelectCallback 	: params.onSelectCallback
		};

		props.customRenderItem = function (item, itemDom) {
            var info = item.location.city.title || item.location.address.substring(0, 25) + "..";

            if (info)
            {
                itemDom.appendChild(
                    App.Dom('div', {
                        innerHTML : '<span class="text-muted">' + info + '</span>'
                    })
                );
            }
		};

		return Instance(inputDom, props);
	}

	function Instance(inputDom, params)
	{
		var wrapperDom, name, saveToInput, cache = {}, lookupUrl = params.lookupUrl, focusVal, multiple, autoComplete = null;

		function keyPress(e)
		{
			if ( e.target.value === focusVal )
			{
				var code = e.keyCode || e.which;

				if (code !== 9 && code !== 13)
				{
					e.target.value 		= '';
					focusVal 			= '';
					_setVal('0');

					e.target.classList.remove('is-ok');
				}
			}
		}

		function blur(e)
		{
			e.target.classList.remove('is-ok');
		}

		function initHandlers()
		{
			inputDom.onkeydown 	= keyPress;
			inputDom.onblur 	= blur;

			if (typeof params.onFocus === 'function')
			{
				inputDom.onfocus = params.onFocus;
			}
		}

		function prepareInput()
		{
			wrapperDom = App.Dom('div.ac-wrap');

			if (inputDom instanceof jQuery === true)
			{
				inputDom = inputDom.get(0);
			}

			if (inputDom instanceof HTMLElement === false)
			{
				inputDom = App.Dom('input', inputDom);
			}
			else if (inputDom.parentNode)
			{
				inputDom.parentNode.insertBefore(wrapperDom, inputDom.nextSibling);
			}

			name = inputDom.name;

			inputDom.name = '';
			inputDom.className += ' ui-autocomplete-input'; // so so

			saveToInput = App.Dom('input', {
				type 	: 'hidden',
				name 	: name,
				value 	: inputDom.dataset.value || ''
			});

			focusVal = params.value || inputDom.value;

			// TODO : !!!! special market
			// inputDom.name = params.validateName || '';

			inputDom.placeholder = params.placeholder || inputDom.placeholder || msgLang.typeSearch;

			if (params.multiple)
			{
				multiple = Multiple(name, params.value, params);

				wrapperDom.appendChild(
					multiple.getContext()
				);

				selectFromList = multiple.selectFromList;
				wrapperDom.appendChild(inputDom);
			}
			else
			{
				wrapperDom.appendChild(inputDom);
				wrapperDom.appendChild(saveToInput);
			}
		}

		var selectFromList = function(event, term, item)
		{
			saveToInput.value	= item.getAttribute('data-id');
			focusVal 			= item.getAttribute('data-label');

			var ui = this.responseItems.filter(function (item) {
				return parseInt(item.id) === parseInt(saveToInput.value);
			})[0];

			inputDom.value = focusVal;
			inputDom.classList.add('is-ok');

			if (typeof params.onSelectCallback === "function")
			{
				params.onSelectCallback(event, {item : ui});
			}

			event.preventDefault();
		};

		function initPlugin()
		{
			var defProps = {
				selector	: inputDom,
				minChars	: 2,
				cache		: false,
				source		: function(term, response)
				{
					var _that = this;

					Helper.apiRequest.promise({
						url : lookupUrl + ( '&term=' + term )
					}).get().then(function(data) {
						_that.responseItems = data;
						response(data);
					});
				},

				renderItem	: function (item, search)
				{
					var className = 'autocomplete-suggestion';

					if (this.responseItems && this.responseItems[0].value && this.responseItems[0].value === item.value)
					{
						className += ' selected';
					}

					var re = new RegExp("(" + search + ")", "gi" );

					var itemDom = App.Dom('div', {
                        className		: className + ' big',
                        innerHTML 		: item.label.replace(re, '<strong class="text-danger">$1</strong>'),
                        'data-id' 		: item.id,
                        'data-label' 	: item.label,
                        'data-show'		: item.show || item.label,
                        'data-val' 		: search // library needs it
                    });

					if (params.hasOwnProperty('customRenderItem') && typeof params.customRenderItem === 'function')
					{
                        params.customRenderItem(item, itemDom);
					}

                    return itemDom.outerHTML;
				},

				onSelect	: selectFromList
			};

			Object.assign(defProps, params);
			autoComplete = new AcLib(defProps);
		}

		function _fillValues(params)
		{
			saveToInput.value 	= params.id;
			focusVal 			= inputDom.value = params.name;
		}

		function _setVal (value)
		{
			return saveToInput.value = value
		}

		function _getVal()
		{
			return saveToInput.value;
		}

		function _changeUrl(url)
		{
			params.lookupUrl = lookupUrl = url;
			autoComplete = autoComplete ? autoComplete.destroy() : null;
			initPlugin();
		}

		prepareInput();
		initHandlers();
		initPlugin();

		return {
			input 	: $(inputDom),
			typeInput: params.typeInput || null,
			setVal	: _setVal,
			getVal	: _getVal,
			// getText	: function() { return inputDom.value; },
			getDom	: function() { return $(wrapperDom); },
			fillValues : _fillValues,
			changeUrl : _changeUrl
		}
	}

	function City(InputDom, inputs)
	{
		var props = {
			lookupUrl			: 'autoComplete?cities=1',

			onSelectCallback	: function(e, ui)
			{
				if (!inputs)
					return;

				var	items	= ui.item;

				if (inputs.region)
				{
					inputs.region.val(items.regionId);
				}

				inputs.state.fillValues({id : items.stateId, name : items.state});
				inputs.country.fillValues({id : items.countryId, name : items.country});
			}
		};

		return Instance(InputDom, props) //.getDom();
	}

	function Country( inputDom )
	{
		return Instance(inputDom, {lookupUrl : 'autoComplete?countries=1'})//.getDom();
	}

	function State(inputDom )
	{
		return Instance(inputDom, {lookupUrl : 'autoComplete?states=1'})//.getDom();
	}

	function Agent(InputDom, params)
	{
		params = params || {minLength: 2, lookupUrl	: 'autoComplete?agents=1'};
		return Instance(InputDom, params);
	}

	function LeadAgent(InputDom, params)
	{
		params = { minLength: 2, lookupUrl	: 'autoComplete?leadAgents=1&requestId=' +  params.requestId};
		return Instance(InputDom, params);
	}

	function Airline(InputDom, params)
	{
		params = params || {};

		var acParams = {
			lookupUrl	: 'autoComplete?airlines=1',
			minLength	: 2,
			value		: params.values || [],
			onAdd		: params.onAdd || false,
			onRemove		: params.onRemove || false
		};

		if (params.multiple !== false)
		{
			acParams.multiple = true;
		}

		return Instance(InputDom, acParams).getDom();
	}

	function Team(InputDom, params)
	{
		params = {
			lookupUrl			: 'autoComplete?teams=1',
			minLength			: 2,
			multiple			: params.multiple,
			onSelectCallback 	: params.onSelectCallback,
			value				: params.values || []
		};

		InputDom = Object.assign({}, {value : []}, InputDom);
		return Instance(InputDom, params).getDom();
	}

	function Geo( props )
	{
		var
			inputAutoComplete 	= props.inputs.input,
			typeInput			= props.inputs.type;

		return Instance( inputAutoComplete, {

			value 		: inputAutoComplete.value,
			typeInput	: typeInput,
			source		: function (request, response)
			{
				var _that = this;

				var
					perfectMatch	= [],
					term 			= request.toLowerCase(),
					termCount		= term.trim().split(' ').length;

				geo.then(function(geoResponse) {

					var r = geoResponse.filter(function(location) {

						if (!location.search)
						{
							return false;
						}

						if ( props.noAirPort && geoType[location.type] !== 'city')
						{
							return false;
						}

						var inStr = location.search.toLowerCase().indexOf(term) !== -1;

						if (!inStr)
						{
							return false;
						}

						if (termCount > 1)
						{
							return location;
						}

						var chunked = location.search.toLowerCase().split(' ');

						if (chunked[0] === term) // when we found term in code
						{
							geoType[location.type] === 'city' ? perfectMatch.unshift(location) : perfectMatch.push(location);
							return false;
						}

						var found = chunked.filter(function (item) {
							return item.indexOf(term) === 0;
						});

						return found.length ? location : false;

					}).map( function (location) {
						return location;
					});

					_that.responseItems = perfectMatch.concat(r);

					response( perfectMatch.concat(r) );
				});
			},

			onSelectCallback	: function(e, ui)
			{
				var item = ui.item;

				if (typeof props.selectCallBack === 'function')
				{
					props.selectCallBack( item );
				}

				typeInput.value = geoType[item.type];
			},

			onFocus			: function ()
			{
				geo = geo || Helper.apiRequest.promise({
					url	: 'autoComplete?getGeo=1'
				}).get();
			}
		});
	}

	var module = {
		city		: City,
		country		: Country,
		state		: State,
		leadAgent	: LeadAgent,
		agent		: Agent,
		airline		: Airline,
		team		: Team,
		pqHotels	: PqHotels,
		makeGeo		: function(props)
		{
			var autoComplete 	= new Geo(props);
			autoComplete.getDom().append( props.inputs.type );
			return autoComplete;
		},

		make2		: Instance
	};

	function HtmlInit(fn, e)
	{
		fn(e);
		e.target.removeAttribute('data-init');
	}

	var initHtml	= {

		geo	: function (e)
		{
			var depType = App.Dom('input', {name : e.target.dataset.type, type : 'hidden'});

			var acParams = {
				inputs : {
					input	: e.target,
					type	: depType
				},

				noAirPort	: true
			};

			return module.makeGeo(acParams);
		},

		agent	: function(e)
		{
			Agent(e.target);
		},

		countries	: function(e)
		{
			Country( e.target );
		}
	};

	$( "body" )
		.on( "mouseover", "*[data-init='autocomplete-geo']", HtmlInit.bind(null, initHtml.geo) )
		.on( "mouseover", "*[data-init='autocomplete-agent']", HtmlInit.bind(null, initHtml.agent) )
		.on( "mouseover", "*[data-init='autocomplete-countries']",  HtmlInit.bind(null, initHtml.countries) );

	return module;
});