
const $ = require('jquery');
import AppDom from '../../helpers/dom.es6';
import Helper from '../../abstract/helper.js';
let App = {Dom: AppDom};

// const Validator = ...;

export default (function () {
	var msgLang	=  {
        close 			: 'Close',
        leaveComment	: 'Leave comment',
        confirm			: 'Confirm',
        yes				: 'Yes',
        no				: 'No'
    };

	var Context		= function (params)
	{
		params = params || {};

		var modalData = params.modalData || null;
		var modalId = params.modalId || null;

		var modal = $('<div>', {
			class: 'modal'.concat(' ', params.modal_class || '')
		});

		if (params.id)
			modal.attr('id', params.id);

		modal.append([
			$('<div>', {class: 'modal-dialog '.concat(' ', params.dialog_class || '')}).append(

				$('<div class="modal-content">' ).append([

					$('<div class="modal-header clearfix">').append([
						'<button class="close btn" data-dismiss="modal">×</button>',
						$('<div class="modal-title">').append(params.header)
					]),

					$('<div>', {class: 'modal-body '.concat(' ', params.body_class || 'bg-light lt')}).append(
						params.body
					)

					,function () {
						if ( !params.footer || params.footer.length === 0 )
							return '';

						return $('<div class="modal-footer">').append(
							params.footer
						)
					}()
				])
			)
		]);

		// Update URL on modal open & close
		modal.on('show.bs.modal', function () {
			var modalParams = Object.assign({}, params, { modalId: modalId, modalData: modalData });
			Helper.url.modal.open(modalParams);
		});

		modal.on('hidden.bs.modal', function () {
			Helper.url.modal.close(params.removeModalParams || []);
		});

		modal.updateModalData = function(data) {
			modalData = data;
		};

		modal.updateModalId = function(id) {
			modalId = id;
		};

		return modal;
	};

	function Basic(params)
	{
		var
			context 	= null,
			body 		= params.body || $('<div>'),
			// header		= $('<span>'),
			header		= App.Dom('span'),
			buttons		= params.buttons || [];

		if (!params.noCloseBtn)
		{
			buttons.push(
				params.closeBtn || $('<button>', {class : 'btn btn-default btn-lg no-radius', text : msgLang.close, 'data-dismiss' : 'modal'})
			);
		}

		params = $.extend({
			body		: body,
			header		: header,
			footer		: buttons
		}, params);

		context = Context(params);

		context.changeHeader = function(text) {
			// header.html(text);
			header.innerHTML = text;
			return context;
		};

		context.bodyAppend = function(contains) {
			body
				.empty()
				.append( contains );

			return context;
		};

		context.appendTo('body');

		return context;
	}

	var ConfirmModal	= function ( deferred, params )
	{
		var modal = Basic({
			body_class 	: 'bg-white confirm-modal',
			noCloseBtn	: 1,
			buttons		: [

				App.Dom('span.btn btn-lg no-radius btn-success m-r-xs['+msgLang.yes+']', {
					onclick : function () {
						deferred.resolve();
						modal.modal('hide');
					}
				}),

				App.Dom('span.btn btn-lg no-radius btn-danger['+msgLang.no+']', {
					onclick : function () {
						modal.modal('hide');
					}
				})
			]
		});

		modal.find('.modal-header').addClass('hidden');

		modal.bodyAppend(
			$('<div class="wrapper text-center">').append(
				'<i class="icon fa fa-info-circle  v-middle font-bold">',
				'<span class="text wrapper inline">'+params.msg+'</span>'
			)
		);

		return modal;
	};

	var SidePanel	= function (params)
	{
		params = $.extend({modal_class : 'modal-side-panel' }, params );
		return Basic(params);
	};

	return {
		created		: {},

		basic		: Basic,

		parts		: {

			comment : function ( params )
			{
				params = $.extend({
					class		: 'form-control',
					placeholder	: msgLang.leaveComment
				}, params);

				return  $('<textarea>', params);
			}
		},

		sidePanel	: SidePanel,

		confirm 	: ConfirmModal,

		make		: function ( params )
		{
			var
				base 			= this
				,modal
				,body			= []
				,listeners		= []
				,controllers	= {}
				,onShow
				,onConfirm;

			function init()
			{
				modal = base.basic( params );

				if (params.noHeader)
					modal.find('.modal-header').remove();

				if (body && body.length > 0)
					modal.bodyAppend( body );

				if (params.title)
					modal.changeHeader( params.title );
			}

			return {

				show	: function( callback )
				{
					this.getModal().modal({
						backdrop :params.backdrop || true
					});

					if (typeof callback === 'function')
						callback({modal : modal});

					if (typeof onShow === 'function')
					{
						onShow({modal : modal});
					}

					return this;
				}

				,init		: function ()
				{
					init();
					return this;
				}

				,changeHeader: function ( text )
				{
					modal.changeHeader( text );
					return this;
				}

				// to depricate changeHeader
				,changeTitle : function ( html )
				{
					modal.changeHeader( html );
					return this;
				}

				,render 	: function ()
				{
					if (!modal)
						return this.show();

					modal.modal('show');

					return modal;
				}

				,addComment : function( settings )
				{
					var comment = controllers.comment = base.parts.comment( settings );

					body.push( comment );

					onShow	= function() {
						comment.focus();
					};

					onConfirm = function()
					{
						if ( Validator.validateInput( comment , ['notBlank'] ) )
						{
							comment.focus();
							return '';
						}

						return true;
					};

					return this;
				}

				,pushToBody			: function( elements )
				{
					body.push( elements );
					return this;
				}

				,addConfirmListener	: function( func )
				{
					listeners.push(
						func
					);

					return this;
				}

				,confirmButton	: function( opts )
				{
					opts = opts || {};

					params.buttons		=  [
						$('<button>', {
							class 		: 'btn btn-default btn-lg no-radius btn-success'
							,text 		: opts.name || msgLang.confirm
							,click		: this.confirm
						})
					];

					return this;
				}

				,pushButton		: function(button)
				{
					params.buttons = params.buttons || [];
					params.buttons.push( button );
					
					return this;
				}

				,confirm	: function ()
				{
					var confirm = true;

					if (typeof onConfirm === 'function')
					{
						confirm = onConfirm();
					}

					if (confirm)
					{
						for(var i in listeners)
						{
							var res = listeners[i]( controllers, modal );

							if (res === false)
								return false;
						}

						modal.modal('hide');
					}
				}

				,close		: function ()
				{
					modal.modal('hide');
				}

				,toggle		: function ()
				{
					if ($(modal).hasClass('in'))
					{
						modal.modal('hide');
					}
					else
					{
						modal.modal('show');
					}
				}

				,getModal	: function ()
				{
					if (!modal)
						init();

					return modal;
				}
				,updateModalData	: function (data)
				{
					modal.updateModalData(data);
					return modal;
				}
				,updateModalId		: function (id)
				{
					modal.updateModalId(id);
					return modal;
				}
			}
		}
	};
}());