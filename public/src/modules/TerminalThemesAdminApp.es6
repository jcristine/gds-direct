

let $ = require('jquery');
import Dom from './../abstract/dom_builder.js';
import DataTable from '../abstract/dataTables.js';

require('select2');

let colorNames = {
	defaultBg				: 'Default Background',
	activeWindow			: 'Active Window Background',
	entryFont				: 'Entry Font',
	outputFont				: 'Output Font',
	usedCommand				: 'Used Command',
	errorMessage			: 'Error Message',
	warningMessage			: 'Warning Message',
	startSession			: '"Start Session"',
	specialHighlight		: 'Special "Highlight"',
	highlightDark			: 'Highlight Dark',
	highlightLight			: 'Highlight Light',
	highlightBlue			: 'Highlight Blue',
	fixedColumnBackground	: 'Fixed Column Background',
};

let columnTitles	= {
	id						: 'Id',
	label					: 'Name',
};

let init = () => {

	function colorDiv(color)
	{
		return (color ? '<div class="btn btn-sm" style="background: ' + color + '">' + color + '</div>' : '')
	}

	function colEdit(colors, name, cssParam)
	{
		let isNameInColors	= typeof colors !== 'undefined' && typeof colors[name] !== 'undefined';
		let color			= isNameInColors ? colors[name][cssParam] : '';
		let isBold			= isNameInColors && colors[name]['font-weight'] ? true : false;
		let isEnabled = color ? true : false;
		let $inp = $('<input name="colors['+ name + '][' + cssParam + ']' +'" class="colorpicker form-control" type="color" id="demo_size" value="'+ color +'">');

		let onEnabledChange = enabled => enabled
			? $inp[0].removeAttribute('disabled')
			: $inp[0].setAttribute('disabled', 'disabled');
		onEnabledChange(isEnabled);

		return [
			$('<div class="col-sm-8"></div>').append($inp),
			$('<div class="col-sm-1 cb-sm text-right">').append(
				Dom.build.checkbox({
					name	: 'colors[' + name + '][font-weight]',
					title	: '',
					value	: 'bold',
					checked	: isBold,
				})
			),
			$('<div class="col-sm-1 cb-sm text-right">').append(
				Dom.build.checkbox({
					checked	: isEnabled,
					onchange: (e) => onEnabledChange(e.target.checked),
				})
			),
		];
	}

	function AjaxRequest(data, callback)
	{
		//console.log('ajax params', arguments);
		$('#filter-form').serializeArray().map(function ( obj ) {
			data[obj.name] = obj.value;
		});

		fetch('/gdsDirect/themes', {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
			//body: JSON.stringify(data),
		}).then(a => a.json()).then(resp => {
			resp.terminalThemes.forEach(th => {
				for (let name in colorNames) {
					th.colors = th.colors || {};
					th.colors[name] = th.colors[name] || {};
				}
			});
			return callback({aaData: resp.terminalThemes});
		});
	}

	var params = {

		router: {
			remove		: '/admin/terminal/themes/delete',
			save		: '/admin/terminal/themes/save',
		},
		ajax		: AjaxRequest,
		responsive	: false,
		columns		: [
			{
				name		: 'id',
				data		: 'id',
				title		: columnTitles['id'],
				width		: 50
			},
			{
				name		: 'label',
				data		: 'label',
				title		: columnTitles['label'],

				// editable	: 'input',
				editable	: function (d, row)
				{
					return	'<div class="col-sm-8"><input name="label" class="form-control" type="text" value="'+ row['label'] +'"></div>' +
							'<label class="control-label col-sm-1">Bold</label>' +
							'<label class="control-label col-sm-1">Enabled</label>';
				},
				validate	: ['notBlank']
			},
			{
				name		: 'colors',
				data		: function(obj){
					return colorDiv( obj['colors']['defaultBg']['background-color'] );
				},
				title		: colorNames['defaultBg'],

				editable	: function (d, row)
				{
					return colEdit( row['colors'], 'defaultBg', 'background-color' );
				}
			},
			{
				data		: function(obj){
					return colorDiv( obj['colors']['activeWindow']['background-color'] );
				},
				title		: colorNames['activeWindow'],

				editable	: function (d, row)
				{
					return colEdit( row['colors'], 'activeWindow', 'background-color' );
				}
			},
			{
				data		: function(obj){
					return colorDiv( obj['colors']['entryFont']['color'] );
				},
				title		: colorNames['entryFont'],

				editable	: function (d, row)
				{
					return colEdit( row['colors'], 'entryFont', 'color' );
				}
			},
			{
				data		: function(obj){
					return colorDiv( obj['colors']['outputFont']['color'] );
				},
				title		: colorNames['outputFont'],

				editable	: function (d, row)
				{
					return colEdit( row['colors'], 'outputFont', 'color' );
				}
			},
			{
				data		: function(obj){
					return colorDiv( obj['colors']['usedCommand']['color'] );
				},
				title		: colorNames['usedCommand'],

				editable	: function (d, row)
				{
					return colEdit( row['colors'], 'usedCommand', 'color' );
				}
			},
			{
				data		: function(obj){
					return colorDiv( obj['colors']['errorMessage']['color'] );
				},
				title		: colorNames['errorMessage'],

				editable	: function (d, row)
				{
					return colEdit( row['colors'], 'errorMessage', 'color' );
				}
			},
			{
				data		: function(obj){
					return colorDiv( obj['colors']['warningMessage']['color'] );
				},
				title		: colorNames['warningMessage'],

				editable	: function (d, row)
				{
					return colEdit( row['colors'], 'warningMessage', 'color' );
				}
			},
			{
				data		: function(obj){
					return colorDiv( obj['colors']['startSession']['color'] );
				},
				title		: colorNames['startSession'],

				editable	: function (d, row)
				{
					return colEdit( row['colors'], 'startSession', 'color' );
				}
			},
			{
				data		: function(obj){
					return colorDiv( obj['colors']['specialHighlight']['color'] );
				},
				title		: colorNames['specialHighlight'],

				editable	: function (d, row)
				{
					return colEdit( row['colors'], 'specialHighlight', 'color' );
				}
			},
			{
				data		: function(obj){
					return obj['colors']['highlightDark'] ? colorDiv( obj['colors']['highlightDark']['background-color'] ) : '';
				},
				title		: colorNames['highlightDark'],

				editable	: function (d, row)
				{
					return colEdit( row['colors'], 'highlightDark', 'background-color' );
				}
			},
			{
				data		: function(obj){
					return obj['colors']['highlightLight'] ? colorDiv( obj['colors']['highlightLight']['background-color'] ) : '';
				},
				title		: colorNames['highlightLight'],

				editable	: function (d, row)
				{
					return colEdit( row['colors'], 'highlightLight', 'background-color' );
				}
			},
			{
				data		: function(obj){
					return obj['colors']['highlightBlue'] ? colorDiv( obj['colors']['highlightBlue']['background-color'] ) : '';
				},
				title		: colorNames['highlightBlue'],

				editable	: function (d, row)
				{
					return colEdit( row['colors'], 'highlightBlue', 'background-color' );
				}
			},
			{
				data		: function(obj){
					return obj['colors']['fixedColumnBackground'] ? colorDiv( obj['colors']['fixedColumnBackground']['background-color'] ) : '';
				},
				title		: colorNames['fixedColumnBackground'],

				editable	: function (d, row)
				{
					return colEdit( row['colors'], 'fixedColumnBackground', 'background-color' );
				}
			}
		],
	};

	DataTable.init('#table_list', params);
	return Promise.resolve(true);
};

export default (appParams) => {
	window.GdsDirectPlusParams = window.GdsDirectPlusParams || {};
	window.GdsDirectPlusParams.emcSessionId = appParams.emcSessionId;
	return init();
};