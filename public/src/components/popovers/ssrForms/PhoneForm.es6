import {getStore} from "../../../store";
import {DEV_CMD_STACK_RUN} from "../../../actions";
import SsrHelper from "./SsrHelper";
import Dom from "../../../helpers/dom";

const paxToPhoneTr = (pax, paxes, ssrs) => {
	const ssr = ssrs.slice(-1)[0] || {};
	const numRec = pax.nameNumber;
	return Dom('tr', {}, [
		Dom('td', {}, [
			Dom('select', {name: 'nameNumber'}, [
				Dom('option', {
					checked: 'checked',
					value: JSON.stringify(numRec),
					textContent: SsrHelper()
						.formatNameNum(numRec),
				}),
			]),
			Dom('input', {
				type: 'hidden',
				name: 'oldSsrs',
				value: JSON.stringify(ssrs),
			}),
		]),
		Dom('td', {}, [
			Dom('input', {
				name: 'phoneNumber', type: 'tel',
				value: (ssr.content || '').replace(/^\/?/, ''),
			}),
		]),
	]);
};

const phoneTrToData = (tr) => {
	return {
		nameNumber: JSON.parse(tr.querySelector('[name="nameNumber"]').value),
		phoneNumber: tr.querySelector('[name="phoneNumber"]').value,
		oldSsrs: JSON.parse(tr.querySelector('[name="oldSsrs"]').value),
	};
};

const phoneDataToCmds = (phoneRecord, gds) => {
	const content = phoneRecord.phoneNumber.replace('+', '00');
	if (!content || !content.match(/^\d+$/)) {
		// do not write SSR for passengers with no dob specified
		return [];
	}
	const {fieldNumber, firstNameNumber} = phoneRecord.nameNumber;
	return {
		'apollo': [`¤:3SSRCTCMYYHK1/N${fieldNumber}-${firstNameNumber}/${content}`],
		'galileo': [`SI.P${fieldNumber}/SSRCTCMYYHK1/${content}`],
		'sabre': [
			`3CTCMA/${content}-${fieldNumber}.${firstNameNumber}`,
			`4CTCMA/${content}-${fieldNumber}.${firstNameNumber}`,
		],
		'amadeus': [`SRCTCMYYHK1${content}/P${fieldNumber}`],
	}[gds];
};

const PhoneForm = ({close}) => {
	const tbody = Dom('tbody');
	const dom = Dom('form', {onsubmit: (e) => {
		e.preventDefault();
		const gdsSwitch = getStore().app.gdsSwitch;
		const gds = gdsSwitch.getCurrentName();

		const dataRecords = [...tbody.querySelectorAll(':scope > tr')]
			.map(phoneTrToData);
		const deleteSsrs = [];
		const writeCmds = [];
		for (const phoneRecord of dataRecords) {
			const newContent = phoneRecord.phoneNumber.replace('+', '00');
			if (!phoneRecord.oldSsrs.some(old => old.content.replace(/^\//, '') === newContent)) {
				deleteSsrs.push(...phoneRecord.oldSsrs);
				const cmds = phoneDataToCmds(phoneRecord, gds);
				writeCmds.push(...cmds);
			}
		}
		SsrHelper().cancelOldSsrs(deleteSsrs, gds);
		for (const cmd of writeCmds) {
			DEV_CMD_STACK_RUN(cmd);
		}
		if (deleteSsrs.length > 0 || writeCmds.length > 0) {
			SsrHelper().saveChanges(gds);
		}
		close();
		return false; // no page reload
	}}, [
		Dom('table', {}, [
			Dom('thead', {}, [
				Dom('tr', {}, [
					Dom('th', {textContent: '#'}),
					Dom('th', {textContent: 'Phone'}),
				]),
			]),
			tbody,
		]),
		Dom('div', {style: 'text-align: right'}, [
			Dom('button[Save]'),
		]),
	]);

	const updateBlock = (paxes, serviceSsrs) => {
		tbody.innerHTML = '';
		for (let i = 0; i < paxes.length; ++i) {
			const pax = paxes[i];
			const ssrs = serviceSsrs.filter(ssr =>
				ssr.ssrCode === 'CTCM' &&
				ssr.nameNumber &&
				ssr.nameNumber.absolute == +i +1
			);
			const tr = paxToPhoneTr(pax, paxes, ssrs);
			tbody.appendChild(tr);
		}
	};

	return {
		dom,
		updateBlock,
	};
};

export default PhoneForm;
