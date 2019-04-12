import '../src/actions/initAuthPage.js';
import Component from '../src/modules/component.es6';

let Cmp = (...args) => new Component(...args);

let whenPccList = fetch('/data/getPccList').then(rs => rs.json());
let whenEmcSessionId = window.GdsDirectPlusPage.whenEmcSessionId;
let $ = window.$;

let makeCmdListTdCmp = (commands) => {
	let cmdListCmp = Cmp('div.command-list');
	let addCmd = (cmd) => {
		let entryCmp = Cmp('div.command-list-entry').attach([
			Cmp('input', {type: 'text', value: cmd}),
			Cmp('button[Remove]', {
				type: 'button',
				onclick: () => entryCmp.context.remove(),
			}),
		]);
		cmdListCmp.attach([entryCmp]);
	};
	commands.forEach(addCmd);

	return Cmp('td').attach([
		Cmp('button[Add]', {
			type: 'button',
			onclick: () => addCmd(''),
		}),
		cmdListCmp,
	]);
};

let makePccSelectCmp = (pccs) => {
	let pccSelectCmp = Cmp('select', {
		name: 'pccs',
		multiple: 'multiple',
	});
	let pccSelect = pccSelectCmp.context;

	whenPccList.then(({records}) => {
		pccSelectCmp.attach(records.map(pccRec => Cmp('option', {
			textContent: pccRec.label,
			value: pccRec.name,
			selected: pccs.includes(pccRec.name),
		})));
		$(pccSelect).select2({
			placeholder: 'Any',
			width: '230px',
			tags: true,
			templateSelection: (state) => state.id,
		});
	});

	return pccSelectCmp;
};

let addActionRow = (tbody, record = {}) => {
	let cmdListTdCmp = makeCmdListTdCmp(record.commands || []);
	let pccSelectCmp = makePccSelectCmp(record.pccs || []);
	let actionTr = Cmp('tr').attach([
		Cmp('td').attach([
			Cmp('input', {type: 'hidden', name: 'id', value: record.id || ''}),
			Cmp('label', {textContent: record.id || ''}),
		]),
		Cmp('td').attach([
			Cmp('input', {
				name: 'name', value: record.name || '',
				...(record.name ? {disabled: 'disabled'} : {}),
			}),
		]),
		Cmp('td').attach([
			Cmp('select', {
				name: 'gds',
				// should probably filter PCC options on GDS change
			}).attach(['apollo', 'sabre', 'amadeus', 'galileo'].map(gds =>
				Cmp('option', {
					textContent: gds,
					selected: gds === record.gds,
				}))),
		]),
		Cmp('td.pcc-select-holder').attach([pccSelectCmp]),
		cmdListTdCmp,
		Cmp('td').attach([
			Cmp('input', {
				type: 'hidden', name: 'globalShortcut',
				value: record.globalShortcut || '',
			}),
			Cmp('button[Set]', {
				type: 'button',
				onclick: () => alert('TODO: implement Set!'),
			}),
		]),
		Cmp('td').attach([
			Cmp('button[Remove]', {
				type: 'button',
				onclick: () => actionTr.remove(),
			}),
		]),
	]).context;
	tbody.appendChild(actionTr);
};

let collectData = (form) => {
	let records = [...form.querySelectorAll('tbody.shortcut-list > tr')]
		.map(tr => {
			return {
				id: tr.querySelector('input[name="id"]').value,
				name: tr.querySelector('input[name="name"]').value,
				gds: tr.querySelector('select[name="gds"]').value,
				pccs: [...tr.querySelectorAll('select[name="pccs"] > option')]
					.filter(o => o.selected).map(o => o.value),
				commands: [...tr.querySelectorAll('.command-list-entry > input')].map(i => i.value),
				globalShortcut: tr.querySelector('input[name="globalShortcut"]').value,
			};
		});
	return {records};
};

let initialize = (data) => {
	let tbody = document.querySelector('tbody.shortcut-list');
	let addActionBtn = document.querySelector('button.add-shortcut-action');
	let form = document.querySelector('form[name="shortcut-table-form"]');
	[...document.querySelectorAll('.please-wait-msg')]
		.forEach(dom => dom.style.display = 'none');
	tbody.innerHTML = '';
	for (let record of data.records) {
		addActionRow(tbody, record);
	}

	form.onsubmit = (e) => {
		e.preventDefault();
		let data = collectData(form);
		whenEmcSessionId.then(emcSessionId => {
			fetch('/admin/setShortcutActions', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					emcSessionId: emcSessionId,
					records: data.records,
				}),
			}).then(rs => rs.json()
				.then(data => alert('Status ' + rs.status + ' ' + rs.statusText + ' ' + JSON.stringify(data))))
				.catch(exc => alert('Failure ' + exc));
		});
		return false;
	};
	addActionBtn.onclick = () => addActionRow(tbody, {});
};

let main = () => {
	fetch('/admin/getShortcutActions')
		.then(rs => rs.json())
		.then(initialize);
};

main();