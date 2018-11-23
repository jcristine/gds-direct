'use strict';
define([], function() {
	var MAX = 3;
	var DELAY = 4000;
	var Storage = function () {
		var
			storageIndex	= 'history',
			maxSize			= 25;
		return {
			set			: function (value, type)
			{
				require(['abstract/helper'], function (Helper) {
					var prev = Helper.storage.get(storageIndex) || [];
					if (prev.length >= maxSize)
						prev.pop();
					prev.unshift({
						value	: value,
						date	: new Date().getTime(),
						type	: type
					});
					Helper.storage.set(storageIndex, prev);
				})
			}
		}
	}();
	var Container	= (function () {
		var bubbles = [];
		var context;
		function _get_context()
		{
			if (context)
				return context;
			context 			= document.createElement('div');
			context.className 	= 'bubble-msg-wrap';
			document.body.appendChild( context );
			return context;
		}
		function _show(bubble)
		{
			if ( bubbles.length >= MAX )
				bubbles.shift().hide();
			bubbles.push( bubble );
			_get_context().appendChild( bubble.getContext() );
			bubble.show();
		}
		return {
			show: _show
		}
	}());
	function Bubble( params )
	{
		var context, timeout;

		function construct()
		{
			context 			= document.createElement('div');

			context.className 	= 'clearfix hidden ns-box ns-growl ns-effect-scale ' + params['className'];

			var close 			= document.createElement('span');
			close.className 	= 'close close-rounded inline';
			close.innerHTML 	= '&times;';
			close.addEventListener('click', _hide);

			var body 		= document.createElement('div');
			body.className 	= 'bubble-body ' + (params['bodyClass'] || 'text-center');
			body.innerHTML	= '<strong class="v-middle">'+params.msg+'</strong>';

			context.appendChild( close );
			context.appendChild( body );
			_autoHide();
			return context;
		}

		function _autoHide()
		{
			timeout = setTimeout( _hide, params['delay'] );
		}

		function _hide()
		{
			if (!context)
				return false;
			clearTimeout( timeout );
			context.parentNode.removeChild( context );
			context = '';
		}

		construct();

		return {
			getContext : function ()
			{
				return context;
			},
			show		: function ()
			{
				context.className = context.className.replace('hidden', '');
				context.className += ' ns-show';
			},
			hide 		: _hide
		}
	}
	return window.notifications = (function () {
		function _show( message, delay, noSave, params )
		{
			var options = {
				msg		: message,
				delay	: delay || DELAY
			};
			Object.keys(params).forEach(function (key) {
				options[key] = params[key];
			});
			Container.show( Bubble(options) );
			if (!noSave)
				Storage.set( options.msg, options['type'] );
		}
		return {
			bubble_msg : {
				info	: function(message, delay, noSave)
				{
					_show( message, delay, noSave, {
						type		: 'info',
						className	: 'bg-info dk bg-gradient'
					} );
				},
				warning	: function(message, delay, noSave)
				{
					_show( message, delay, noSave, {
						type		: 'warning',
						className	: 'bg-warning dker bg-gradient'
					} );
				},
				danger	: function(message, delay, noSave, bodyClass)
				{
					_show( message, delay, noSave, {
						type		: 'danger',
						className	: 'bg-danger bg-gradient qa-danger',
						bodyClass	: bodyClass
					});
				}
			}
		}
	}());
});