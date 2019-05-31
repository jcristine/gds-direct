import '../src/actions/initAuthPage.js';
import Component from '../src/modules/component.es6';

let Cmp = (...args) => new Component(...args);

window.GdsDirectPlusPage.whenEmcSessionId.then(emcSessionId => {
    let addSettingRow = (listDom, record) => {
    	let {name, value} = record;
		value = value || '';
    	let textareaCmp = Cmp('textarea', {
    		value: value,
			cols: 100,
			rows: value.indexOf('\n') > -1 ? 30 : 2,
    	});
		let settingDiv = Cmp('div').attach([
			Cmp('div.setting-entry').attach([
				Cmp('div').attach([
					Cmp('input', {disabled: 'disabled', value: name}),
					Cmp('button[Save]', {
						onclick: () => fetch('/admin/setSetting', {
							method: 'POST',
							headers: {'Content-Type': 'application/json'},
							body: JSON.stringify({
								emcSessionId: emcSessionId,
								name: name,
								value: textareaCmp.context.value,
							}),
						}).then(rs => rs.json())
							.then((rsData) => alert(JSON.stringify(rsData)))
							.catch(exc => alert('Failed to save ' + name + ' - ' + exc)),
					}),
					Cmp('button[Delete]', {
						onclick: () => fetch('/admin/deleteSetting', {
							method: 'POST',
							headers: {'Content-Type': 'application/json'},
							body: JSON.stringify({
								emcSessionId: emcSessionId,
								name: record.name,
							}),
						}).then(rs => rs.json())
							.then((rsData) => settingDiv.remove())
							.catch(exc => alert('Failed to delete ' + name + ' - ' + exc)),
					}),
				]),
				Cmp('div').attach([textareaCmp]),
			]),
		]).context;
		listDom.appendChild(settingDiv);
	};
    let initialize = (data) => {
    	let listDom = document.querySelector('.setting-list');
        let addSettingBtn = document.querySelector('button.add-setting-action');
        for (let record of data.records) {
       		addSettingRow(listDom, record);
       	}
        addSettingBtn.onclick = () => {
        	let name = prompt('Setting Name:');
        	if (name) {
				addSettingRow(listDom, {name});
			}
		};
	};
	fetch('/admin/getSettings?emcSessionId=' + emcSessionId)
        .then(rs => rs.json())
        .then(initialize)
		.catch(exc => alert('Failed to fetch settings - ' + exc));
});