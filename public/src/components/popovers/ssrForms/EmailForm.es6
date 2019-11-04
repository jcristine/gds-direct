import {getStore} from "../../../store";
import {DEV_CMD_STACK_RUN} from "../../../actions";
import SsrHelper from "./SsrHelper";
import Dom from "../../../helpers/dom";

const paxToEmailTr = (pax, paxes, ssrs) => {
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
				name: 'emailAddress', type: 'email',
				size: 30,
				value: decodeEmail((ssr.content || '').replace(/^\/?/, '')),
				pattern: /^\S+@\S+\.\S+$/.source,
			}),
		]),
	]);
};

const emailTrToData = (tr) => {
	return {
		nameNumber: JSON.parse(tr.querySelector('[name="nameNumber"]').value),
		emailAddress: tr.querySelector('[name="emailAddress"]').value,
		oldSsrs: JSON.parse(tr.querySelector('[name="oldSsrs"]').value),
	};
};

const encodeEmail = (email) => {
	return email
		.replace('@', '//')
		.replace('_', '..')
		.replace('-', './');
};

const decodeEmail = (gdsEmail) => {
	return gdsEmail
		.replace('//', '@')
		.replace('..', '_')
		.replace('./', '-');
};

const emailDataToCmds = (emailRecord, gds) => {
	const content = encodeEmail(emailRecord.emailAddress);
	if (!content || content.match(/\*+/)) {
		// do not write SSR for passengers with no dob specified
		return [];
	}
	const {fieldNumber, firstNameNumber} = emailRecord.nameNumber;
	return {
		'apollo': [`¤:3SSRCTCEYYHK1/N${fieldNumber}-${firstNameNumber}/${content}`],
		'galileo': [`SI.P${fieldNumber}/SSRCTCEYYHK1/${content}`],
		'sabre': [
			`3CTCEA/${content}-${fieldNumber}.${firstNameNumber}`,
			`4CTCEA/${content}-${fieldNumber}.${firstNameNumber}`,
		],
		'amadeus': [`SRCTCEYYHK1${content}/P${fieldNumber}`],
	}[gds];
};

const EmailForm = ({close}) => {
	const tbody = Dom('tbody');
	const dom = Dom('form', {onsubmit: (e) => {
		e.preventDefault();
		const gdsSwitch = getStore().app.gdsSwitch;
		const gds = gdsSwitch.getCurrentName();

		const dataRecords = [...tbody.querySelectorAll(':scope > tr')]
			.map(emailTrToData);

		const deleteSsrs = [];
		const writeCmds = [];
		for (const emailRecord of dataRecords) {
			const newContent = encodeEmail(emailRecord.emailAddress);
			const doesMatch = old => old.content.replace(/^\//, '') === newContent;
			if (newContent && !newContent.match(/\*+/) &&
				!emailRecord.oldSsrs.some(doesMatch)
			) {
				deleteSsrs.push(...emailRecord.oldSsrs);
				const cmds = emailDataToCmds(emailRecord, gds);
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
					Dom('th', {textContent: 'Email'}),
				]),
			]),
			tbody,
		]),
		Dom('div', {style: 'text-align: right'}, [
			Dom('button', {textContent: 'Save', className: 'save-changes'}),
			Dom('button', {textContent: 'Save', className: 'save-changes', disabled: 'disabled'}),
		]),
	]);

	const updateBlock = (paxes, serviceSsrs) => {
		tbody.innerHTML = '';
		for (let i = 0; i < paxes.length; ++i) {
			const pax = paxes[i];
			const ssrs = serviceSsrs.filter(ssr =>
				ssr.ssrCode === 'CTCE' &&
				ssr.nameNumber &&
				ssr.nameNumber.absolute == +i +1
			);
			const tr = paxToEmailTr(pax, paxes, ssrs);
			tbody.appendChild(tr);
		}
	};

	return {
		dom,
		updateBlock,
	};
};

export default EmailForm;
