import Dom 					from '../../helpers/dom.es6';
import ButtonPopOver		from '../../modules/buttonPopover.es6';
import {CHANGE_SETTINGS} 	from '../../actions/settings';
import {getBindingForKey} 	from '../../helpers/keyBinding';
import {GDS_LIST} 			from '../../constants';
import {getStore} 			from './../../store';

export default class KeySettings extends ButtonPopOver
{
	constructor({ keyBindings, defaultPccs, gdsAreaSettings, ...params })
	{
		super(params, 'div.terminal-menu-popover hotkeysContext');

		this.makeTrigger({
			onclick : () => {
				this.popContent.innerHTML = '';
				const c = new Context(this, keyBindings, defaultPccs, gdsAreaSettings);
				this.popContent.appendChild(c.context);
			}
		});
	}
}

class Context
{
	constructor(popover, keyBindings, defaultPccs, gdsAreaSettings)
	{
		this.context = Dom('div');
		this.currentKeyBindings = keyBindings;
		this.currentPccs = defaultPccs;
		this.gdsAreaSettings = gdsAreaSettings;
		this.inputFields = {};
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

		GDS_LIST.forEach((gds, idx) => {
			const isActive = selectedGds === gds;

			const btn = Dom(`a.gds-select t-pointer ${(isActive ? 'checked' : '')}[${gds}]`);
			header.appendChild(btn);

			// Change active tab
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

			const tabContent = Dom('div.tab-content');
			tab.appendChild(tabContent);


			const buttonHeader = Dom(`div.settings-input-container input-container-header`)
			buttonHeader.appendChild(Dom(`label[Key]`));
			buttonHeader.appendChild(Dom(`label[Command]`));
			buttonHeader.appendChild(Dom(`label[Autorun]`));

			const inputFields = this._makeInputFieldList(gds);
			tabContent.appendChild(inputFields.pccContainer);
			tabContent.appendChild(inputFields.areaGrid);

			tabContent.appendChild(buttonHeader);

			inputFields.buttons.forEach(button => {
				tabContent.appendChild(button.inputContainer);
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

    _getGdsAreas(gds)
    {
        return {
            apollo:  ['A', 'B', 'C', 'D', 'E'],
            galileo: ['A', 'B', 'C', 'D', 'E'],
            sabre:   ['A', 'B', 'C', 'D', 'E', 'F'],
            amadeus: ['A', 'B', 'C', 'D'],
        }[gds] || [];
    }

	_makeInputFieldList(gds)
	{
		const data = { pccContainer: null, buttons: [], areaSettings: [] };
		const buttonPrefixes = [null, 'shift', 'ctrl'];
		const startingKey = 111;

		// Default PCC
		const pccContainer = this._getInputRow({
			label: 'Default PCC',
			name: `defaultPcc[${gds}]`,
			placeholder: '',
			value: this._getPcc(gds)
		});
		const areaGrid = Dom(`div`, {style: 'display: grid; grid-template-areas: "a a"; padding-left: 10%'});
		this._getGdsAreas(gds)
            .map(letter => {
                const container = Dom(`div.settings-input-container`);
                container.setAttribute('data-area', letter);
                container.appendChild(Dom(`label[Area ${letter}]`, {style: 'text-align: right; padding-right: 6px;'}));
                container.appendChild(Dom('input.form-control settings-input default-pcc', {
                    placeholder: '', value: this._getAreaPcc(gds, letter)
                }));
                return container;
            })
            .forEach(cell => areaGrid.appendChild(cell));

		data.pccContainer = pccContainer;
		data.areaGrid = areaGrid;

		// All button shortcuts
		buttonPrefixes.forEach(prefix => {
			for (let i = 1; i <= 12; i += 1) {
				const key = startingKey + i;
				const btnName = prefix ? `${prefix}+${key}` : `${key}`;
				const placeholder = getBindingForKey(btnName, gds, false);

				// "Hotkey" input
				const inputContainer = this._getInputRow({
					label: prefix ? `${prefix} + F${i}` : `F${i}`,
					placeholder: placeholder.command,
					value: this._getKeyBinding(gds, btnName, 'command')
				});

				// "Autorun" checkbox
				const userAutorun = this._getKeyBinding(gds, btnName, 'autorun');
				inputContainer.appendChild(
					Dom('input.form-control ch-box', {
						type: 'checkbox',
						checked: userAutorun !== false ? userAutorun : placeholder.autorun
					})
				)
				data.buttons.push({ key, btnName, placeholder, inputContainer, placeholder });
			}
		});

		this.inputFields[gds] = data;

		return data;
	}

	_getInputRow({ label, placeholder, value })
	{
		const container = Dom(`div.settings-input-container`)
		container.appendChild(Dom(`label[${label}]`));
		container.appendChild(Dom('input.form-control settings-input', { placeholder, value }));
		return container;
	}

	_getKeyBinding(gds, btnName, type)
	{
		const hasValue = this.currentKeyBindings && this.currentKeyBindings[gds] && this.currentKeyBindings[gds][btnName];
		if (hasValue) {
			const value = this.currentKeyBindings[gds][btnName];
			return value[type];
		}

		return type === 'command' ? '' : false;
	}

	_getPcc(gds)
	{
		return this.currentPccs && this.currentPccs[gds] ? this.currentPccs[gds] : '';
	}

	_getAreaPcc(gds, area)
	{
		const areaSettings = (this.gdsAreaSettings || {})[gds] || [];
		for (let areaSetting of areaSettings) {
			if (areaSetting.area === area) {
				return areaSetting.defaultPcc;
			}
		}
	    return null;
	}

	save()
	{
		const result = {};

		GDS_LIST.forEach(gds => {
			result[gds] = { keyBindings: {}, defaultPcc: null };

			this.inputFields[gds].buttons.forEach(input => {
				const placeholder = input.placeholder;
				const command = input.inputContainer.children[1].value;
				const autorun = input.inputContainer.children[2].checked ? 1 : 0;

				if (command !== '' || autorun !== placeholder.autorun) {
					result[gds].keyBindings[input.btnName] = { command, autorun };
				}
			});

			result[gds].defaultPcc = this.inputFields[gds].pccContainer.children[1].value;
			result[gds].areaSettings = [...this.inputFields[gds].areaGrid.children].map(cont => 1 && {
				area: cont.getAttribute('data-area'),
				defaultPcc: [...cont.querySelectorAll('input.default-pcc')]
					.map(inp => inp.value)[0] || null,
            });

			// jquery-param removes empty objects so we need to preserve emptiness with "null"
			if ($.isEmptyObject(result[gds].keyBindings)) {
				result[gds].keyBindings = null;
			}
		})

		CHANGE_SETTINGS(result);
	}
}