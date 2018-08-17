import Dom 					from '../../helpers/dom.es6';
import ButtonPopOver		from '../../modules/buttonPopover.es6';
import {CHANGE_SETTINGS} 	from '../../actions/settings';
import {getBindingForKey} 	from '../../helpers/keyBinding';
import {GDS_LIST} 			from '../../constants';
import {getStore} 			from './../../store';

export default class Settings extends ButtonPopOver
{
	constructor({ keyBindings, defaultPccs, ...params })
	{
		super(params, 'div.terminal-menu-popover hotkeysContext');

		this.makeTrigger({
			onclick : () => {
				this.popContent.innerHTML = '';
				const c = new Context(this, keyBindings, defaultPccs);
				this.popContent.appendChild(c.context);
			}
		});
	}
}

class Context
{
	constructor(popover, keyBindings, defaultPccs)
	{
		this.context = Dom('div');
		this.currentKeyBindings = keyBindings;
		this.currentPccs = defaultPccs;

		this._makeBody(popover);
	}

	_makeBody(parent)
	{
		const { name } = getStore().app.Gds.getCurrent().get();
		let selectedGds = name;

		const container	= Dom('div');
		const header = Dom('div.gds-select-header');
		const content = Dom('div.gds-select-container');

		container.appendChild(header);
		container.appendChild(content);

		const buttonPrefixes = [null, 'shift', 'ctrl'];
		const startingKey = 111;
	
		GDS_LIST.forEach((gds, idx) => {
			const isActive = selectedGds === gds;

			const btn = Dom(`a.gds-select t-pointer ${(isActive ? 'checked' : '')}[${gds}]`);
			header.appendChild(btn);

			btn.addEventListener('click', (e) => {
				e.target.classList.add('checked');
				selectedGds = gds;
				const activeIdx = GDS_LIST.findIndex(el => el === selectedGds);
				const children = content.children;

				for (let i = 0; i < children.length; i++) {
					content.children[i].classList.remove('active');
					header.children[i].classList.remove('checked');
					if (i === activeIdx) {
						content.children[i].classList.add('active');
						header.children[i].classList.add('checked');
					}
				}
			});

			const tab = Dom(`div.tab${(isActive ? ' active' : '')}`);
			content.appendChild(tab);

			// Default PCC
			const pccContainer = this._getInputRow({ 
				label: 'Default PCC',
				name: `defaultPcc[${gds}]`,
				placeholder: '',
				value: this._getPcc(gds)
			});
			tab.appendChild(pccContainer);

			// All button shortcuts
			buttonPrefixes.forEach(prefix => {
				for (let i = 1; i <= 12; i += 1) {
					const key = startingKey + i;
					const btnName = prefix ? `${prefix}+${key}` : `${key}`;
					const placeholder = getBindingForKey(btnName, gds, false);
					
					const inputContainer = this._getInputRow({ 
						label: prefix ? `${prefix} + F${i}` : `F${i}`,
						name: `keyBindings[${gds}][${btnName}]`,
						placeholder,
						value: this._getKeyBinding(gds, btnName)
					});
	
					tab.appendChild(inputContainer)
				}
			});
		});

		const saveBtn = Dom('button.btn btn-sm btn-purple font-bold pull-right [Save]', {
			onclick : () => {
				this.save();
				parent.popover.close();
			}
		});
		header.appendChild(saveBtn);

		this.context.appendChild( container );
	}

	_getInputRow({ label, name, placeholder, value })
	{
		const container = Dom(`div.settings-input-container`)
		container.appendChild(Dom(`label[${label}]`));
		container.appendChild(Dom('input.form-control settings-input', { name, placeholder, value }));
		return container;
	}

	_getKeyBinding(gds, btnName)
	{
		return this.currentKeyBindings && this.currentKeyBindings[gds] && this.currentKeyBindings[gds][btnName]
			? this.currentKeyBindings[gds][btnName]
			: '';
	}

	_getPcc(gds)
	{
		return this.currentPccs && this.currentPccs[gds] ? this.currentPccs[gds] : '';
	}

	save()
	{
		const result = {};
		GDS_LIST.forEach(gds => result[gds] = { keyBindings: {}, defaultPcc: null });

		$('.settings-input').serializeArray()
			.forEach(item => {
				if (item.value !== '') {
					const [slug, gds, key] = item.name.match(/[a-zA-Z+0-9]+/g);

					if (slug === 'keyBindings') {
						result[gds][slug][key] = item.value;
					} else {
						result[gds][slug] = item.value;
					}
				}
			});

		// jquery-param removes empty objects so we need to preserve emptiness
		$.each(result, (key, value) => {
			if ($.isEmptyObject(value.keyBindings)) {
				result[key].keyBindings = null;
			}
		});

		CHANGE_SETTINGS(result);
	}
}