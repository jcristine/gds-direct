import Dom 					from '../../helpers/dom.es6';
import ButtonPopOver		from '../../modules/buttonPopover.es6';
import {CHANGE_SETTINGS} 	from '../../actions/settings';
import {getBindingForKey} 	from '../../helpers/keyBinding';
import {GDS_LIST} 			from '../../constants';
import {getStore} 			from './../../store';
import AreaPccSelect 			from "./areaPccSelect";
import "select2";
import $ from 'jquery';
import {RESET_SESSION} from "../../actions.es6";
import {UPDATE_ALL_AREA_STATE, UPDATE_DEFAULT_AREA_PCCS} from "../../actions/gdsActions";
import {getPccList, getShortcutActionList} from "../../helpers/dataProvider.js";

let shortcutCompletionId = 'shortcut-action-completion-options';

export default class KeySettings extends ButtonPopOver
{
	constructor({ keyBindings, gdsAreaSettings, ...params })
	{
		super(params, 'div.terminal-menu-popover hotkeysContext');

		this.pccs = [];

		this.makeTrigger({
			onclick : () => {
                getPccList()
                    .then(({records}) => {
                        this.pccs = records;

                        this.popContent.innerHTML = '';
                        const c = new Context(this, keyBindings, gdsAreaSettings);
                        this.popContent.appendChild(c.context);
                    });
				getShortcutActionList()
					.then(({records}) => {
						let datalist = document.getElementById(shortcutCompletionId);
						if (!datalist) {
							datalist = document.createElement('datalist');
							datalist.setAttribute('id', shortcutCompletionId);
							document.body.appendChild(datalist);
						}
						let occurrences = new Set();
						datalist.innerHTML = records
							.filter(rec => {
								let used = occurrences.has(rec.name);
								occurrences.add(rec.name);
								return !used;
							})
							.map(rec => {
								let preview = rec.commands.join(';');
								return `<option value="{{!${rec.name}}}">{{!${rec.name}}} - ${preview}</option>`;
							})
							.join('');
					});
			},
		});
	}
}

class Context
{
	constructor(popover, keyBindings, gdsAreaSettings)
	{
		this.pccs = popover.pccs;
		this.context = Dom('div');
		this.currentKeyBindings = keyBindings;
		this.gdsAreaSettings = gdsAreaSettings;
		this.inputFields = {};
		this._makeBody(popover);
	}

	_makeBody(parent)
	{
		const { name } = getStore().app.gdsSwitch.getCurrent().get();
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


			const buttonHeader = Dom(`div.settings-input-container input-container-header`);
			buttonHeader.appendChild(Dom(`label[Key]`));
			buttonHeader.appendChild(Dom(`label[Command]`));
			buttonHeader.appendChild(Dom(`label[Autorun]`));

			const inputFields = this._makeInputFieldList(gds);
			const labelDiv = Dom(`div.settings-input-container`);
			labelDiv.appendChild(Dom(`button.btn-primary[Default PCC]`, {
				title: 'Press to Restart Session',
				onclick: () => RESET_SESSION({gds}),
				//if (parent.popover) {
				//	// close since we reloaded UI, and the element
				//	// drop was bound to does not exist anymore
				//	parent.popover.close();
				//}
			}));
			tabContent.appendChild(labelDiv);
			tabContent.appendChild(inputFields.areaGrid);

			tabContent.appendChild(buttonHeader);

			inputFields.buttons.forEach(button => {
				tabContent.appendChild(button.inputContainer);
			});
		});

		const manualBtn = Dom('button.btn btn-sm btn-primary font-bold pull-right [Manual]', {
			onclick: () => window.open('https://docs.google.com/document/d/1ZthW07sWlFDMRFWd3sRQtOLMvDCGUKAMSG4RX05pc64', '_blank'),
		});
		const saveBtn = Dom('button.btn btn-sm btn-purple font-bold pull-right [Save]', {
			onclick : () => {
				let saveData = this._collectSaveData();
				CHANGE_SETTINGS(saveData).then(saved => {
					UPDATE_DEFAULT_AREA_PCCS(saveData);
					parent.popover.close();
				});
			},
		});
		header.appendChild(saveBtn);
		header.appendChild(manualBtn);

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
		const data = { buttons: [], areaSettings: [] };
		const buttonPrefixes = [null, 'shift', 'ctrl'];
		const startingKey = 111;

		const areaGrid = Dom(`div`, {style: 'display: grid; grid-template-areas: "a a";'});
		this._getGdsAreas(gds)
            .map(letter => {
                const container = Dom(`div.settings-input-container`);
                const defaultPcc    = this._getAreaPcc(gds, letter);
            	const pccs          = this.pccs.filter( pcc => pcc.gds === gds);
                const select        = new AreaPccSelect({gds, defaultPcc, pccs}).getContext();

                container.setAttribute('data-area', letter);
                container.appendChild(Dom(`label[Area ${letter}]`, {style: 'text-align: right; padding-right: 6px;'}));
                container.appendChild(select);

                $(select).select2({
                    theme : "bootstrap",
                    dropdownParent : $(this.context),
					width : '185px',
                });

                return container;
            })
            .forEach(cell => areaGrid.appendChild(cell));

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
					value: this._getKeyBinding(gds, btnName, 'command'),
				});

				// "Autorun" checkbox
				const userAutorun = this._getKeyBinding(gds, btnName, 'autorun');
				inputContainer.appendChild(
					Dom('input.form-control ch-box', {
						type: 'checkbox',
						checked: userAutorun !== false ? userAutorun : placeholder.autorun,
					})
				);
				data.buttons.push({ key, btnName, placeholder, inputContainer });
			}
		});

		this.inputFields[gds] = data;

		return data;
	}

	_getInputRow({ label, placeholder, value })
	{
		const container = Dom(`div.settings-input-container`);
		container.appendChild(Dom(`label[${label}]`));
		let input = Dom('input.form-control settings-input', { placeholder, value });
		container.appendChild(input);

		let shortcutActionsAllowed = true;
		if (shortcutActionsAllowed) {
			input.setAttribute('list', shortcutCompletionId);
			let isFirefox = navigator.userAgent.search('Firefox') > -1;
			let completionHint = 'Click Twice to Show Options';
			input.addEventListener('click', () => {
				if (isFirefox) {
					input.placeholder = input.placeholder || completionHint;
				}
			});
			input.addEventListener('blur', () => {
				if (input.placeholder === completionHint) {
					input.placeholder = '';
				}
			});
		}

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

	_collectSaveData()
	{
		const result = {};

		GDS_LIST.forEach(gds => {
			result[gds] = { keyBindings: {} };

			this.inputFields[gds].buttons.forEach(input => {
				const placeholder = input.placeholder;
				const command = input.inputContainer.children[1].value;
				const autorun = input.inputContainer.children[2].checked ? 1 : 0;

				if (command !== '' || autorun !== placeholder.autorun) {
					result[gds].keyBindings[input.btnName] = { command, autorun };
				}
			});

			result[gds].areaSettings = [...this.inputFields[gds].areaGrid.children].map(cont => 1 && {
				area: cont.getAttribute('data-area'),
				defaultPcc: [...cont.querySelectorAll('select.default-pcc')]
					.map(select => select.options[select.selectedIndex].value)[0] || null,
            });

			// jquery-param removes empty objects so we need to preserve emptiness with "null"
			if ($.isEmptyObject(result[gds].keyBindings)) {
				result[gds].keyBindings = null;
			}
		});

		return result;
	}
}
