
const $ = require('jquery');
const validator = require('validator');
const Noty = require('noty');

export default (function() {

	$.lms			= $.lms || {};

	var ValidationGroup		= function (inputs)
	{
		this.defaults	= {
			error_class	: 'is-group-error'
		};

		this.inputs		= inputs;

		this.hasError					= function ()
		{
			var res = inputs.map(function ()
			{
				var rules = $(this).data('validate-group').split(' ');

				var isError =  $.lms.validator.inputHasErrors( $(this), rules);

				if ( !isError )
				{
					return 'ok';
				}
			});

			return res.length == 0;
		};

		this._addCheckListener 			= function ()
		{
			var _this = this;

			inputs.change(function () {
				if (! _this.hasError() )
				{
					_this._approve();
				}
			});
		};

		this._approve		= function (error)
		{
			inputs.removeClass(this.defaults.error_class);
		};

		this._markAsError	= function ()
		{
			inputs.addClass(this.defaults.error_class);
		};

		this.clearAllInputErr			= function ()
		{
		};

		this.init			= function ()
		{
			if ( ! this.hasError() )
			{
				return false;
			}

			this._markAsError();
			this._addCheckListener();

			return this;
		};

		return this;
	};

	var ValidationError		= function(params)
	{
		this.defaults	= {
			error_class	: 'is-error'
		};

		this.$input		= params.input;
		this.errors		= params.errors;

		this._addCheckListener 			= function ()
		{
			var _this = this;

			this.$input.on('change keyup' ,function () {

				for (var rule in _this.errors)
				{
					var
						error = _this.errors[rule]
						,seed = error.seed || null;

					if (!error.rule || $.lms.validator.validate(error.rule, $(this).val(), seed) === true)
					{
						_this._approve(rule);
					}
				}
			});
		};

		this._approve		= function (error)
		{
			this.errors[error].li.remove();

			delete this.errors[error];

			if ($.isEmptyObject(this.errors))
			{
				this.$input.toggleClass(this.defaults.error_class);
				this.ul.remove();

				$.lms.validator.removeFromFailed(this.$input.attr('name'));
			}
		};

		this._markAsError	= function ()
		{
			var list  = [];

			for (var er in this.errors)
			{
				var
					error = this.errors[er]
					,li = $('<li>', {class: 'text-muted m-l-xs m-t-xs pull-left', html : error.msg});

				this.errors[er]['li'] = li;
				list.push( li );
			}

			this.ul = this.ul || $('<ul>', {class : 'js-list-errors list-unstyled m-b-none clearfix'});

			this.$input.addClass(this.defaults.error_class);

			var inputParent = this.$input.parent();
			var appendTo = (inputParent.hasClass('input-group') ? inputParent : this.$input);

			if (inputParent.hasClass('intl-tel-input'))
			{
				inputParent.after( this.ul.append( list ) );
			} else {
				appendTo.after( this.ul.append( list ) );
			}
		};

		this.clearAllInputErr			= function ()
		{
			for (var er in this.errors)
			{
				this._approve(er);
			}
		};

		this.init			= function ()
		{
			this._markAsError();
			this._addCheckListener();

			return this;
		};

		return this.init();
	};

	// validator.js wrapper https://www.npmjs.com/package/validator
	// Analog - validator.js wrapper http://validatorjs.org/

	//rules should be like isEmail

	$.lms.validator = {
		validator			: null
		,failed				: {}
		,messages			: {
			isemail		: "This value should be a valid email.",
			isnumeric	: "This value should be a valid number.",
			isphone		: "This value should be valid phone.",
			notblank	: "This value shouldn't be blank.",

			isfloat			: "This value should be a valid number",
			blankorletters	: "This value should not contain any letters",
			blankoremail	: "This value should be a valid email",
			blankorphone	: "This value should be valid phone.",
			notnull			: "This value should be greater then 0",
			containsnot		: "This value contains forbidden word : %r",

			minlength		: "Not enough symbols were provided in a comment (minimum is %r symbols)",

			emailwithoutstars			: "You are trying to submit masked email",
			blankoremailwithoutstars	: "This value should be a valid email and not be masked"

			/*required	: "This value is required.",
			pattern		: "This value seems to be invalid.",
			min			: "This value should be greater than or equal to %s.",
			max			: "This value should be lower than or equal to %s.",
			range		: "This value should be between %s and %s.",
			minlength	: "This value is too short. It should have %s characters or more.",
			maxlength	: "This value is too long. It should have %s characters or fewer.",
			length		: "This value length is invalid. It should be between %s and %s characters long.",
			mincheck	: "You must select at least %s choices.",
			maxcheck	: "You must select %s choices or fewer.",
			check		: "You must select between %s and %s choices.",
			equalto		: "This value should be the same."*/
		}

		,removeFromFailed	: function (index)
		{
			delete this.failed[index];

			if ($.isEmptyObject(this.failed))
			{
				$( document ).trigger( 'editSave:enable' );
			}
		}

		,validate			: function(rule, checkValue, seed)
		{
			try {
				return validator[rule](checkValue, seed);
			} catch (e) {
				Notify.bubble_msg.danger('Validation rule: ' + rule + ' Doesnt exist');
			}
		}

		,reset				: function ()
		{
			this.failed = {};
		}

		,inputHasErrors			: function(input, rules, rulesValue)
		{
			var
				checkValue 	= input.val()
				,errors		= {};

			for (var r in rules)
			{
				var rule = rules[r];

				var seed = (rulesValue) ? rulesValue[rule] : '';

				if ( this.validate(rule, checkValue, seed) !== true )
				{
					var msg = this.messages[rule.toLowerCase()] || '';

					errors[rule] = {
						rule 	: rule
						,msg 	: msg.replace("%r", seed)
						,seed	: seed
					};
				}
			}

			return $.isEmptyObject(errors) ? false : errors;
		}

		,assignError		: function (input, errors)
		{
			var err_obj = new ValidationError({
				input 	: input
				,errors	: errors
			});

			this.failed[input.attr('name')] = err_obj;

			return err_obj;
		}

		,resetInput			: function ( input )
		{
			if ( !this.failed[input.attr('name')] )
				return false;

			this.failed[input.attr('name')].clearAllInputErr();
			this.failed[input.attr('name')] = null;
		}

		// ruleOptions for ex : validateInput( input, ['contains', 'notBlank'],  { contains : 'foo' })

		,validateInput 		: function (input, predefinedRules, rulesValue)
		{
			var rules = predefinedRules || input.data('validate').split(' ');

			var errors = this.inputHasErrors(input, rules, rulesValue);

			if (errors)
			{
				return this.assignError(input, errors);
			}

			return false;
		}
	};

	$.lms.FormValidator = function (context, options)
	{
		this.context 	= context;
		this.failed		= [];
		this.failedGroup	= [];

		this.clear		= function ()
		{
			for (var i in this.failed)
			{
				this.failed[i].clearAllInputErr();
			}

			this.failed = [];
		};

		this.init		= function ()
		{
			var
				_this = this;

			this.context.submit(function( event ) {
				_this.clear();
				var
					validate = $(this).find('*[data-validate]');

				_this.walkInputs(validate);
			});

			return this;
		};

		this.checkGrouped	= function ()
		{
			var grouped = this.context.find('*[data-validate-group]');

			if (grouped.length == 0) return false;

			//todo:: split group into groups
			var gr = new ValidationGroup(grouped);

			return gr.init();
		};

		this.walkInputs		= function (inputs)
		{
			var _this = this;

			if (inputs.length == 0) return;

			inputs.each(function () {

				var error = $.lms.validator.validateInput( $(this) );

				if ( error )
				{
					_this.failed.push( error );
				}
			});
		};

		this.perform	= function ()
		{
			this.clear();

			var inputs =  this.context.find('input, select, textarea').filter(function() {
				return $(this).data("validate")
			});

			this.walkInputs( inputs );

			var checkGrouped = this.checkGrouped();

			return this.failed.length == 0 && !checkGrouped ;
		};

		return this.init();
	};


	$.fn.lmsFormValidator = function (options, e) {
		var
			el = $(this)
			,inst;

		if (el.data('validator'))
		{
			inst = el.data('validator');
		} else {
			inst = new $.lms.FormValidator(el, options);
			el.data('validator', inst);
		}

		return inst;
	};

	validator.notBlank = function (str) {
		return str ? true : false;
	};

	validator.selectNotZero = function (str) {
		return str != 0
	};

	validator.notNull = function (str) {
		return parseFloat(str) > 0
	};

	validator.blankOrLetters = function (str) {
		if (!str) return true;
		return !validator.isAlpha(str);
	};

	validator.blankOrEmail = function (str) {
		var
            whitelist = [
                'corporate_travel@itncorp.com'
            ],
			blocked = [
				'ctncorp',
				'asaptickets',
				'itncorp',
				'airconcierge',
				'skyluxtravel',
				'noemail',
				'itntickets',
				'gmai.'
			],
			length = blocked.length
		;

		if (!str) return true;

		if (whitelist.indexOf(str.trim())!== -1) return true;

		while(length--) {
			if (str.indexOf(blocked[length])!=-1) {
				return false;
			}
		}

		return validator.isEmail(str);
	};

	validator.containsNot = function (str, seed) {
		if (!str) return true;
		return !validator.contains(str.toLowerCase(),seed);
	};

	validator.minLength = function (str, seed) {
		var strLength = $.trim(str).length;

		return !(strLength < seed);
	};

	validator.emailWithoutStars = function (str) {
		return !(str && str.indexOf('*@') !== -1);
	};

	validator.blankOrEmailWithoutStars = function (str) {
		return validator.blankOrEmail(str) && validator.emailWithoutStars(str);
	};

	return $.lms.validator;
}());
