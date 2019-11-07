import {getStore} from "../../../store";
import {DEV_CMD_STACK_RUN} from "../../../actions";
import SsrHelper from "./SsrHelper";
import Dom from "../../../helpers/dom";

const makeMpTr = (paxes, mp = null) => {
	const nameNumber = !mp ? null : mp.passengerNameNumber;
	const pax = !nameNumber ? null : {nameNumber};
	const tr = Dom('tr', {}, [
		Dom('td', {}, [SsrHelper().makePaxNumSelect(paxes, pax)]),
		Dom('td', {}, [Dom('input', {
			type: 'text', size: 2, name: 'airline',
			pattern: /^[A-Z0-9]{2}$/.source,
			value: !mp ? '' : mp.airline,
			required: 'required',
		})]),
		Dom('td', {}, [Dom('input', {
			type: 'text', name: 'code',
			pattern: /^[A-Z0-9]+$/.source,
			value: !mp ? '' : mp.code,
			required: 'required',
		})]),
		Dom('td', {}, [Dom('button', {
			type: 'button',
			textContent: 'Remove',
			onclick: () => tr.remove(),
		})]),
	]);
	return tr;
};

const mpTrToData = (tr) => {
	const nameNumSel = tr.querySelector('[name="nameNumber"]');
	return {
		nameNumber: !nameNumSel ? null : JSON.parse(nameNumSel.value),
		airline: tr.querySelector('[name="airline"]').value,
		code: tr.querySelector('[name="code"]').value,
	};
};

const deleteAll = (mileagePrograms, gds) => {
	if (mileagePrograms.length > 0) {
		const cmd = {
			apollo: 'MP/X/*ALL',
			galileo: 'M.@',
			sabre: 'FF¤ALL',
			amadeus: 'XE' + mileagePrograms
				.map(mp => mp.lineNumber)
				.join(','),
		}[gds];

		DEV_CMD_STACK_RUN(cmd);
	}
};

const addRecords = (newRecords, gds) => {
	if (newRecords.length > 0) {
		let cmd;
		if (gds === 'apollo') {
			const paxNumToAirParts = {};
			for (const mp of newRecords) {
				const paxNum = mp.nameNumber.fieldNumber +
						'-' + mp.nameNumber.firstNameNumber;
				paxNumToAirParts[paxNum] = paxNumToAirParts[paxNum] || [];
				paxNumToAirParts[paxNum].push(`*@${mp.airline}${mp.code}`);
			}
			cmd = 'MP' + Object.entries(paxNumToAirParts)
				.map(([paxNum, airParts]) => 'N' + paxNum + airParts.join(''))
				.join('|');
		} else {
			const delim = {
				sabre: '§',
				amadeus: ';',
				galileo: '|',
			}[gds];
			const parts = newRecords.map(mp => ({
				sabre: `FF${mp.airline}${mp.code}-${mp.nameNumber.fieldNumber}.${mp.nameNumber.firstNameNumber}`,
				amadeus: `FFN${mp.airline}-${mp.code},YY/P${mp.nameNumber.fieldNumber}`,
				galileo: `M.P${mp.nameNumber.fieldNumber}/${mp.airline}${mp.code}`,
			})[gds]);
			cmd = parts.join(delim);
		}
		DEV_CMD_STACK_RUN(cmd);
	}
};

const FrequentFlyerForm = ({close}) => {
	const addRowBtn = Dom('button', {
		textContent: 'Add Row', type: 'button',
		onclick: () => alert('Wait for pax list to load first!'),
	});
	const tbody = Dom('tbody');
	const formDom = Dom('form', {onsubmit: (e) => {
		e.preventDefault();
		alert('Wait for pax list to load first!');
		return false;
	}}, [
		addRowBtn,
		Dom('table', {}, [
			Dom('thead', {}, [
				Dom('tr', {}, [
					Dom('th', {textContent: 'Pax'}),
					Dom('th', {textContent: 'Airline'}),
					Dom('th', {textContent: 'Frequent Flyer Number'}),
				]),
			]),
			tbody,
		]),
		Dom('div', {style: 'text-align: right'}, [
			Dom('button', {textContent: 'Save', className: 'save-changes'}),
			Dom('button', {textContent: 'Save', className: 'save-changes', disabled: 'disabled'}),
		]),
	]);

	const getDataRecords = () => [...tbody.querySelectorAll(':scope > tr')]
		.map(mpTrToData).filter(mp => mp.nameNumber && mp.airline && mp.code);

	const updateBlock = (paxes, mileagePrograms) => {
		const gdsSwitch = getStore().app.gdsSwitch;
		const gds = gdsSwitch.getCurrentName();

		tbody.innerHTML = '';
		for (const mp of mileagePrograms) {
			const tr = makeMpTr(paxes, mp);
			tbody.appendChild(tr);
		}
		const oldRecords = getDataRecords();
		addRowBtn.onclick = () => tbody.appendChild(makeMpTr(paxes));
		formDom.onsubmit = (e) => {
			e.preventDefault();
			const newRecords = getDataRecords();
			if (JSON.stringify(oldRecords) !== JSON.stringify(newRecords)) {
				deleteAll(mileagePrograms, gds);
				addRecords(newRecords, gds);
				SsrHelper().saveChanges(gds);
			}
			close();
			return false; // no page reload

		};
	};

	return {
		dom: formDom,
		updateBlock,
	};
};

export default FrequentFlyerForm;
