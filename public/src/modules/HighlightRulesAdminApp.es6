'use strict';


const $ = require('jquery');
import {notify} from '../helpers/debug.es6';
//import Notify 		from 'abstract/notifications';

import DataTable from '../abstract/dataTables.js';
import Dom from './../abstract/dom_builder.js';

let chunk = (arr, size) => {
	let chunks = [];
	for (let i = 0; i < arr.length; i += size) {
		chunks.push(arr.slice(i, i + size));
	}
	return chunks;
};


const msgLang = {
	id                      : 'Id',
	priority                : 'Priority',
	label                   : 'Label',
	gds                     : 'Gds',
	gdsCommand              : 'Gds Language Command',
	whatToHighlight         : 'What to highlight',
	highlightGroup          : 'Rule Group',
	highlightColorType      : 'Highlight Type',
	isInSameWindow          : 'Run command in the same window',
	isOnlyFirstFound        : 'Only first found',
	messageOnClickHover     : 'Message on click/hover',
	isMessageOnClick        : 'On Click',
	onClickCommand          : 'Command to perform on click',
	addMsgOnClick           : 'Please add message to show on click',
	command                 : 'On Click Command',
	pattern                 : 'Pattern',
	isEnabled               : 'Enabled',
	isForTestersOnly        : 'Only For Tester',
	lookForPattern          : 'Look for Pattern in Output of the following GDS Commands',
	dateFromTo              : 'Date From/To',
	fontColor               : 'Font-color',
	background              : 'Background',
};

let highlightGroups = {
	others: 'Others',
	errors: 'Errors',
	availabilityScreen: 'Availability Screen',
	pricingScreen: 'Pricing Screen',
	ticketMask: 'Ticket Mask',
	tariffDisplay: 'Tariff Display',
	pnrScreen: 'PNR Screen',
	routingScreen: 'Routing Screen',
	airlineIncentives: 'Airline Incentives',
	historyScreen: 'History Screen',
	seatMap: 'Seat Map',
	fastSearch: 'Fast Search (FS)',
	svc: '*SVC',
};

let highlightTypes = {
	patternOnly: 'Pattern Only',
	fullLine: 'Full Line',
	patternToStart: 'Pattern To Start',
	patternToEnd: 'Pattern To End',
	customValue: 'Custom values (?<name>)',
};

let terminalColors = {
	highlightBlue: 'Highlight Blue',
	highlightLight: 'Highlight Light',
	highlightDark: 'Highlight Dark',
	warningMessage: 'Warning Message',
	usedCommand: 'Used Command',
	startSession: 'Start Session',
	specialHighlight: 'Special "Highlight"',
	outputFont: 'Output Font',
	errorMessage: 'Error Message',
	entryFont: 'Entry Font',
	defaultBg: 'Default Background',
	activeWindow: 'Active Window Background',
};

msgLang.setOnlyOneMsg   = `"${msgLang.onClickCommand}" cannot be combined with "Message on click"`;

const gdses = ['apollo', 'sabre', 'amadeus', 'galileo'];
const params = {

	router: window['routesUrl'],
	url: '/admin/terminal/highlight',
	apiUrl: '/admin/terminal/highlight/save?a=a',
	serverSide: false, // false - for sorting and stuff to happen on client side
	pageLength: 2000, // if there is ever so much rules sometime in future...
	method: 'post',
	rowReorder: {
		selector: 'td.run-order',
	},
	order: [[ 2, 'asc' ]],
	modal: {
		dialog_class	: 'modal-full',
		body			: $('<div class="hbox stretch">'),
	},
	responsive: false,
	createdRow: (row, data, dataIndex) => {
		let isError = false;

		Object.keys(data['gds']).forEach( gds => {
			if ( data['gds'][gds]['regexError'] )
				isError = true;
		});

		Object.keys(data['languages']).forEach( lang => {
			if ( data['languages'][lang]['regexError'] )
				isError = true;
		});

		if (isError) {
			row.style = 'background-color: #ffbcbc;';
		}
	},
	onBeforeSave: () =>	{
		const onClickIsChecked      = document.getElementById('isMessageOnClick').checked;
		const onClickMessage        = document.querySelector('.onClickMessage');
		const onClickMessageHidden  = document.querySelector('.onClickMessageHidden');
		let onClickCommandVal       = false;

		[].map.call( document.querySelectorAll('.onClickCommand'), el => {
			el.classList.remove('is-warning');

			if ( el.value )
				onClickCommandVal = true;
		});

		onClickMessage.classList.remove('is-warning');

		if ( onClickMessage.value )
		{
			// functionality for keeping newlines in highlight tooltips
			onClickMessageHidden.value = onClickMessage.value.replace(/\r\n|\r|\n/g,'<br />');
		}

		if ( onClickIsChecked && !onClickMessage.value )
		{
			onClickMessage.classList.add('is-warning');

			notify({msg: msgLang.addMsgOnClick, timeout: 15000});
			return false;
		}

		if ( onClickIsChecked && onClickCommandVal )
		{
			onClickMessage.classList.add('is-warning');

			[].map.call( document.querySelectorAll('.onClickCommand'), el => {
				if ( el.value )
					el.classList.add('is-warning');
			});

			notify({msg: msgLang.setOnlyOneMsg, timeout: 15000});
			return false;
		}
	},
	columns: [],
};

params.columns.push(

	{
		name        : '',
		data        : '',
		width       : 40,
		className   : 'run-order',
		render      : () => '<i class="fa fa-random text-primary"></i>',
		searchable  : false,
		editable    : false,
		orderable   : false,
		title       : '',
		visible     : true,
	},

	{
		name: 'id',
		data: 'id',
		width: 100,
		title: msgLang.id,
		visible: true,
	},

	{
		name: 'priority',
		data: 'priority',
		width: 100,
		title: msgLang.priority,
		visible: true,
	},

	{
		name: 'highlightGroup',
		data: obj => highlightGroups[obj['highlightGroup']],
		width: 200,
		title: msgLang.highlightGroup,
		editable: (d, row) => Dom.build.select({
			name 		: 'highlightGroup',
			optionsList : highlightGroups,
		}).val(row['highlightGroup']),
	},

	{
		name: 'label',
		data: 'label',
		validate: ['notBlank'],
		width: 200,
		title: msgLang.label,
		editable: 'input',
	},

	{
		visible: false,
		data: () => '',
		width: 200,
		title: '&nbsp;',
		editable: '<hr>',
	},

	{
		visible: false,
		data: () => '',
		width: 200,
		title: '&nbsp;',
		editable: () => `<label class="control-label" style="width: 100%;text-align: center;">${msgLang.lookForPattern}</label>`,
	}
);

gdses.forEach( lang => {
	params.columns.push({
		visible: false,
		data: () => '',
		width: 200,
		title: lang,
		editable: (d, row) => {
			const val     = row['languages'] ? (row['languages'][lang]['cmdPattern'] != null ? row['languages'][lang]['cmdPattern'] : '') : '';
			const isError = row['languages'] ? (row['languages'][lang]['regexError'] ? 'text-danger' : '') : '';

			return `<input class="form-control input-sm ${isError}" name="languages[${lang}][cmdPattern]" value="${val}" autocomplete="off">`;
		},
	});
});

params.columns.push(

	{
		visible: false,
		data: () => '',
		width: 200,
		title: '&nbsp;',
		editable: '<hr>',
	},

	{
		visible: false,
		data: () => '',
		width: 200,
		title: '&nbsp;',
		editable: () => `<label class="control-label" style="width: 100%;text-align: center;">${msgLang.pattern}</label>`,
	}
);

gdses.forEach( gds => {
	params.columns.push({
		visible: false,
		data: () => '',
		width: 200,
		title: gds,
		editable: (d, row) => {
			const val     = row['gds'] ? (row['gds'][gds]['pattern'] != null ? row['gds'][gds]['pattern'] : '') : '';
			const isError = row['gds'] ? (row['gds'][gds]['regexError'] ? 'text-danger' : '') : '';

			return `<input class="form-control input-sm ${isError}" name="gds[${gds}][pattern]" value="${val}" autocomplete="off">`;
		},
	});
});

let escapeXml = (text) => $('<div/>').text(text).html();

params.columns.push(

	{
		name: 'highlightType',
		data: obj => escapeXml(highlightTypes[obj['highlightType']]),
		validate : ['selectNotZero'],
		width: 200,
		title: msgLang.whatToHighlight,
		editable: (d, row) => {
			const highlightType = Dom.build.select({
				name 		: 'highlightType',
				optionsList : highlightTypes,
			}).val(row['highlightType']);

			const isOnlyFirstFound = Dom.build.checkbox({
				name		: 'isOnlyFirstFound',
				title       : msgLang.isOnlyFirstFound,
				checked		: row['isOnlyFirstFound'] === 1,
			});

			return [
				$('<div class="row">').append(
					$('<div class="col-sm-6">').append(highlightType),
					$('<div class="col-sm-6">').append(isOnlyFirstFound),
				),
			];
		},
	},

	{
		visible: false,
		data: () => '',
		width: 200,
		title: '&nbsp;',
		editable: '<hr>',
	},

	{
		name: 'terminalColor',
		data: obj => terminalColors[obj['color']],
		validate : ['selectNotZero'],
		width: 200,
		title: msgLang.highlightColorType,
		editable: (d, row) => {
			const colorsWithNoneOption = Object.assign({}, { '': 'Default (none)' }, terminalColors);
			return [
				$('<div class="row">').append(
					$('<div class="col-sm-2 text-right">').append($('<label>').text(msgLang.fontColor)),
					$('<div class="col-sm-4">').append(Dom.build.select({
						name 		: 'color',
						optionsList : terminalColors,
					}).val(row['color'])),
				),
				$('<div class="row m-t-sm text-right">').append(
					$('<div class="col-sm-2">').append($('<label>').text(msgLang.background)),
					$('<div class="col-sm-4">').append(Dom.build.select({
						name 		: 'backgroundColor',
						optionsList : colorsWithNoneOption,
					}).val(row['backgroundColor'])),
				),
			];
		},
	},

	{
		name: '',
		visible: false,
		data: () => '',
		width: 200,
		/** @param {IFullHighlightDataEl} row */
		editable: (d, row) => {
			let decorFlags = [
				['underline', 'Underline'],
				['bold'     , 'Bold'],
				['dotted'   , 'Dotted'],
				['bordered' , 'Bordered'],
				['large'    , 'Large Font'],
				['italic'   , 'Italic'],
			];
			let checkboxes = [];
			for (let [decor, label] of decorFlags) {
				checkboxes.push(Dom.build.checkbox({
					name		: 'decorationFlags[' + decor + ']',
					title       : label,
					checked		: (row['decoration'] || []).includes(decor),
				}));
			}
			return chunk(checkboxes, 2).map((cells) =>
				$('<div class="row">').append(...cells.map(c =>
					$('<div class="col-sm-6">').append(c))));
		},
	},

	{
		visible: false,
		data: () => '',
		width: 200,
		title: msgLang.messageOnClickHover,
		editable: (d, row) => {
			const clickMsg  = row.message ? `${row['message'].replace(/<br \/>/g,'\n')}` : "";
			const text      = `<textarea class="form-control onClickMessage" rows="2">${clickMsg}</textarea>`;
			const message   = '<input class="onClickMessageHidden" type="hidden" name="message" value="">';

			const onClick = Dom.build.checkbox({
				name		: 'isMessageOnClick',
				title       : msgLang.isMessageOnClick,
				checked		: row['isMessageOnClick'] === 1,
			});

			return [
				$('<div class="row">').append(
					$('<div class="col-sm-8">').append(text, message),
					$('<div class="col-sm-4">').append(onClick),
				),
			];
		},
	},

	{
		visible: false,
		data: () => '',
		width: 200,
		title: msgLang.onClickCommand,
		editable: (d, row) => {
			let inputs = '';

			gdses.forEach( gds => {
				const val     = row['languages'] ? (row['languages'][gds]['onClickCommand'] != null ? row['languages'][gds]['onClickCommand'] : '') : '';
				const isError = row['languages'] ? (row['languages'][gds]['regexError'] ? 'text-danger' : '') : '';

				inputs += `
					<div>
						<input type="text" value="${val}"
							class="${'onClickCommand'} ${isError}"
							name="languages[${gds}][${'onClickCommand'}]"
						/>
						<label>${gds}</label>
					</div>`;
			});

			return `<div class="row">${inputs}</div>`;
		},
	},

	{
		visible: false,
		data: obj => Dom.build.checkbox({
			name		: 'isInSameWindow',
			checked		: obj['isInSameWindow'] === 1,
		}).prop('outerHTML'),
		width: 200,
		title: msgLang.isInSameWindow,
		editable: (d, row) => Dom.build.checkbox({
			name		: 'isInSameWindow',
			checked		: row['isInSameWindow'] === 1,
		}),
	},

	{
		visible: false,
		data: () => '',
		width: 200,
		title: '&nbsp;',
		editable: '<hr>',
	},

	{
		name: 'isEnabled',
		data: 'isEnabled',
		render: (data, type, obj) => type !== 'display' ? data :
			Dom.build.checkbox({
				name		: 'isEnabled',
				checked		: data === 1,
				disabled    : 'disabled',
			}).prop('outerHTML'),
		width: 200,
		title: msgLang.isEnabled,
		editable: (d, row) => Dom.build.checkbox({
			name		: 'isEnabled',
			checked		: row['isEnabled'] === 1,
		}),
	},

	{
		name: 'isForTestersOnly',
		data: 'isForTestersOnly',
		render: (data, type, obj) => type !== 'display' ? data :
			Dom.build.checkbox({
				name		: 'isForTestersOnly',
				checked		: data === 1,
				disabled    : 'disabled',
			}).prop('outerHTML'),
		width: 200,
		title: msgLang.isForTestersOnly,
		editable: (d, row) => Dom.build.checkbox({
			name		: 'isForTestersOnly',
			checked		: row['isForTestersOnly'] === 1,
		}),
	},

	{
		name: 'isOnlyFirstFound',
		visible: false,
		data: () => '',
		width: 200,
		title: '&nbsp;',
		editable: 'empty',
	},

	{
		name: 'message',
		visible: false,
		data: () => '',
		width: 200,
		title: '&nbsp;',
		editable: 'empty',
	},

	{
		name: 'isMessageOnClick',
		visible: false,
		data: () => '',
		width: 200,
		title: '&nbsp;',
		editable: 'empty',
	},

	{
		name: 'isInSameWindow',
		visible: false,
		data: () => '',
		width: 200,
		title: '&nbsp;',
		editable: 'empty',
	},

	{
		name: 'terminalBackgroundColor',
		visible: false,
		data: () => '',
		width: 200,
		title: '&nbsp;',
		editable: 'empty',
	}
);

let onReorder = (e, diff, edit, table) => {

	if (diff.length !== 0) {

		let priority = null;

		diff.forEach(function(tr)
		{
			if ( tr['oldPosition'] === edit['triggerRow'][0][0] )
			{
				if ( edit['triggerRow'].index() < tr['newPosition'] )
				{
					priority = table.DataTable().row( tr['newPosition'] ).data().priority;
				}
				else {
					const rowData = table.DataTable().row( tr['newPosition'] - 1 ).data();
					priority = rowData ? rowData.priority : table.DataTable().row( 0 ).data().priority;
				}
			}
		});

		let url = '/admin/terminal/highlight/setPriority/' + edit['triggerRow'].data().id + '/' + priority;
		fetch(url, {method: 'GET'}).then(a => a.json()).catch(rejected => {
			console.log(rejected);
		});
	}
};

export default (appParams) => {
	window.GdsDirectPlusParams = window.GdsDirectPlusParams || {};
	window.GdsDirectPlusParams.emcSessionId = appParams.emcSessionId;


	const table = DataTable.init('#table_list', params);

	// row reorder
	table.DataTable().on( 'row-reorder', (e, diff, edit) => onReorder(e, diff, edit, table));

	let resetBtn		= document.getElementById('resetFilter'),
		groupIdFilter	= document.getElementById('highlightGroup');

	if (highlightGroups && groupIdFilter) {
		for (const value in highlightGroups) {
			groupIdFilter.appendChild(new Option(value, highlightGroups[value]));
		}
	}

	groupIdFilter.onclick = e => {
		e.stopPropagation();
	};

	groupIdFilter.onchange = e => {
		table.DataTable().draw();
	};

	resetBtn.onclick = () => {
		groupIdFilter.value = 0;
		table.DataTable().draw();
	};

	return Promise.resolve({message: 'TODO: implement!'});
};