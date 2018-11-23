'use strict';

var App;

define([], function () {

	var PubSub		= (function () {

		var channels = {};

		var subscribe = function (channel, fn)
			{
				if (!channels[channel])
					channels[channel] = [];

				channels[channel].push({context: this, callback: fn});
				return this;
			},

			publish   = function (channel) {
				if (!channels[channel])
					return false;

				var args = Array.prototype.slice.call(arguments, 1);

				for (var i = 0, l = channels[channel].length; i < l; i++)
				{
					var subscription = channels[channel][i];
					subscription.callback.apply(subscription.context, args);
				}

				return this;
			};

		return {
			publish		: publish,
			subscribe	: subscribe
		};
	}());

	var Language 	= (function () {

		return {

			library		: {},
			once		: null,
			preTranslate: [],
			fileNames	: {},

			sendRequest	: function ()
			{
				if ( this.preTranslate.length === 0 || this.once )
					return false;

				this.once = 1;

                SendToServer( 'collections=' + JSON.stringify(this.preTranslate) , 'translate/autoAppend');
			},

			collect	: function (text)
			{
				this.preTranslate.push( text );
			},

			get		: function ( text, fileName)
			{
				if ( this.library[text] )
					return this.library[text];

				if ( !window['languages'].hasOwnProperty(text) )
				{
					this.collect(text);
					this.fileNames[fileName] = 1;
				}

				return this.library[text] = window.languages[text] || text;
			},

			add	: function()
			{
				if ( !window.apiData.prod )
					alert('language.add');
			},

			translate	: function (data, fileName)
			{
				if (!fileName)
				{
					// console.log(data);
				}

				var result = {};

				for (var i in data)
				{
					if ( data.hasOwnProperty(i) )
						result[i] = this.get( data[i], fileName );
				}

				return result;
			},

			/*  run through browser console . App.finalize() */
			finalize			: function ()
			{
				this.sendRequest();
			},

			getUntranslated	: function ()
			{
				console.log(this.preTranslate);
				console.log(this.fileNames);
			}
		}
	}());

	function applyProperties(node, list)
	{
		Object.keys(list).map(function (index) {
			if (index === 'style' || index.indexOf('data-') === 0)
			{
				node.setAttribute(index , list[index]);
			}
			else
			{
				node[index] = list[index];
			}
		});
	}

	// APP defined globally in footer.html
	App = (function ()
	{
		var componentsList = {};

		return {

			get				: function (name)
			{
				return apiData[name];
			},

			set				: function (name, val)
			{
				apiData[name] = val;
			},

			language		: Language,

			domId			: function (id)
			{
				return document.getElementById(id);
			},

			Dom				: function( str, props )
			{
				var properties 	= props || {};
				var innerHTML, matches = str.match(/\[(.*?)\]/);

				if (matches)
				{
					innerHTML 	= matches[1];
					str 		= str.replace('['+innerHTML+']', '');

					if (innerHTML)
						properties.innerHTML = innerHTML;
				}

				var split 	= str.split('.');
				var node 	= document.createElement( split[0] );

				if (split[1])
					properties.className = split[1];

				applyProperties( node, properties );

				return node;
			},

			components		: {

				list	: {},

				add	: function(params)
				{
					var name = params.name;

					if (componentsList[name])
						return componentsList[name];

					return componentsList[name]= params.context;
				},

				create : function ( factory, properties )
				{
					var props;

					function _addToObservers( element )
					{
						if (element && element.context)
						{
							this.observers.push(
								element
							);

							this.context.appendChild(
								element.getContext()
							);
						}
					}

					var abstract = {

						// data		: null,

						init		: function ()
						{
							var context 	= this.context;
							props 			= this.props || context.props || {};

							if ( typeof context === 'string' )
							{
								this.context = App.Dom(context, props);
							} else
							{
								// for jquery //TODO refactor remove
								if (this.events)
									this.context.on( this.events, this );
							}

							if ( typeof this._mount === 'function')
								this._mount(this);

							return this;
						},

						getContext : function()
						{
							return this.context;
						},

						observers	: [],

						// method to pass Component Obj and get reference to parent
						observeEl	: function(component)
						{
							if (component && component.length)
							{
								component.forEach(_addToObservers, this);
							} else
							{
								_addToObservers.call(this, component);
							}

							return this;
						},

						// method to pass Component Obj and get reference to itself
						observe		: function ( component )
						{
							this.observers.push( component );
							return component.getContext();
						},

						setState: function ( state )
						{
							var updated = Object.assign({}, props, state);

							if ( JSON.stringify(updated) !== JSON.stringify(props) )
							{
								applyProperties( this.context, updated );
								props = updated;
							}
						},

						mount		: function ( callback )
						{
							callback.call( this );
							return this;
						},

						assignRender: function (fn)
						{
							this._renderer = fn;
							return this;
						},

						render 		: function ( params )
						{
							this.observers.map( function ( observer ) {

								if (observer.onMount)
								{
									observer.onMount( params, observer );
									observer.onMount = false;
								}

								observer.render( params );
							});

							if ( typeof this._renderer === 'function')
							{
								this._renderer( params, this );
							}

							return this.getContext();
						},

						// _append		: function(args)
						// {
						// 	return fun.apply(self, [].slice.apply(arguments));
						// },
						//
						append		: function(el)
						{
							// this._append.call( this, el );

							if (typeof el === 'function')
							{
								el = el.call(this, this);
							}

							if (!el)
							{
								return this;
							}

							if (arguments.length > 1)
							{
								el = Array.prototype.slice.call(arguments);
							}

							// if (!el.length || !Array.isArray(el))
							if (!Array.isArray(el))
							{
								el = [el];
							}

							el.forEach(function (e) {
								if (e)
									this.getContext().appendChild(e);
							}, this);

							return this;
						},

						// method to pass component Object
						attach 		: function (el)
						{
							if (typeof el === 'function')
							{
								el = el.call(this, this);
							}

							if (!el)
							{
								return this;
							}

							if (arguments.length > 1)
							{
								el = Array.prototype.slice.call(arguments);
							}

							if( !Array.isArray(el) )
							{
								el = [el];
							}

							el.filter(function(element) {
								return element && element.getContext();
							}).forEach( function (element) {
								this.getContext().appendChild(
									element.getContext()
								);
							}, this);

							return this;
						}
					};

					// creates obj from string
					if (typeof factory === 'string')
					{
						if (properties)
						{
							factory = {context : App.Dom(factory, properties)};
						} else
						{
							factory = {context : factory}
						}
					}

					Object.keys(factory).forEach(function (key) {
						abstract[key] = factory[key];
					});

					return abstract.init();
				}
			},

			subscribe			: PubSub.subscribe,
			publish				: PubSub.publish
		}
	}());

	/*
	* SEND ERRORS TO SERVER
	* */
	function SendToServer( params, url )
	{
		var http 	= new XMLHttpRequest();

		http.open("POST", url, true);
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		http.send( params ); //string
	}

	(function() {

		var countErrors = 1;
		var errorsLog	= {};

		window.onerror = function(message, source, lineNo, colNo, error) {

			if (typeof error === 'object' && error.message === 'Please Login')
				return false;

			countErrors++;

			if (countErrors > 3)
				return false;

			var keyIndex = lineNo + colNo;

			if (errorsLog[keyIndex])
				return false;

			var json = [].filter.call(arguments, function ( obj ) {
				return typeof obj !== 'object'
			});

			errorsLog[keyIndex] = 1;

			if (Array.isArray(json) )
			{
				if ( typeof json[0] === 'string' || json[0] instanceof String )
				{
					var doNotLog = ['NS_ERROR_FAILURE:', 'NS_ERROR_STORAGE_IOERR:', 'Error: Script error for', 'NS_ERROR_FILE_CORRUPTED:', 'Uncaught Error: Script error for', 'ReferenceError: vendor_lib'];

					var doNotSendToDiag = doNotLog.filter( function(text) {
						return json[0].indexOf(text) === 0
					});

					if (doNotSendToDiag.length > 0)
					{
						return false;
					}
				}
			}

			var params 	= 'json=' + JSON.stringify( json );
			SendToServer(params, 'system/reportJsError');
		};
	}());

	window.App = App;

	return App;
});