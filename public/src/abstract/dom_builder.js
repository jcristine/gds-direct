
// taken from CMS /_js/abstract/dom_builder.js

let Dom = {
	build: {
		select: (params) => {
			let options = params.optionsList;
			let contains	= [];
			for (let i in options) {
				let name 	= options[i].name || options[i]
					,value 	= options[i].id || i;
				contains.push(
					new Option(name, value)
				);
			}
			let select = $('<select>', {
				name		: params.name
				,class 		: params.class || 'input-sm form-control'
				,data		: params.data || {}
			});
			if (params.id) { select.prop('id', params.id) }
			if (params.disabled) { select.prop('disabled', params.disabled); }
			select.append(contains);
			if (params.selected) { select.val( params.selected ); }

			return select;
		},
		checkbox: (params) => {
			let $hidden;
			let input = $('<input>', {
					type 	: 'checkbox',
					name 	: params.name,
					id 		: params.id || params.name,
					value 	: params.value || 1
				})
				,container 	= $('<div class="checkbox">')
				,title		= $('<span>', 	{class : 'checkbox-label', text : params.title})
				,label 		= $('<label>');

			input.on('change', params.click);

			if (params.class) { container.addClass(params.class); }
			if (params.addon) { container.addClass('input-group-addon'); }
			if (params.checked) { input[0].setAttribute('checked', 'checked'); }
			if (params.disabled) { input[0].setAttribute('disabled', 'disabled'); }
			if (params.onchange) { input[0].onchange = e => params.onchange(e); }
			if (params.hidden) {
				$hidden = $('<input>', {type : 'hidden', name : params.name, value : 0});
				label.append( $hidden );
			}
			container.append(
				label.append([ input , title])
			);
			container.isChecked = function () {
				return input.is(':checked');
			};

			return container;
		},
	},
};

export default Dom;