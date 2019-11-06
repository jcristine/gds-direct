
import moment from "moment";
import Component from '../../../modules/component.es6';
import {getStore} from "../../../store";
import {DEV_CMD_STACK_RUN} from "../../../actions";
import SsrHelper from "./SsrHelper";
import Dom from "../../../helpers/dom";

const Cmp = (...args) => new Component(...args);

const paxToTsaTrCmp = (pax, paxes, ssrs) => {
	const ssrData = ssrs.map(ssr => ssr.data).slice(-1)[0] || {};
	const makeNumOpts = (pax) => {
		const abs = pax.nameNumber.absolute;
		return paxes
			.map(p => p.nameNumber)
			.map(numRec => Cmp('option', {
				textContent: SsrHelper().formatNameNum(numRec),
				value: JSON.stringify(numRec),
				...(abs == numRec.absolute ? {selected: 'selected'} : {}),
			}));
	};
	const numRec = pax.nameNumber;
	const nameParts = pax.firstName.split(' ');
	const firstName = nameParts[0];
	const middleName = nameParts.slice(1).join(' ');
	return Cmp('tr').attach([
		Cmp('td').attach([
			Cmp({context: SsrHelper().makePaxNumSelect(paxes, pax)}),
			Cmp('input', {
				type: 'hidden',
				name: 'oldSsrs',
				value: JSON.stringify(ssrs),
			}),
		]),
		Cmp('td').attach([
			Cmp('input', {
				type: 'date',
				name: 'dob',
				max: new Date().toISOString().slice(0, 10),
				min: '1903-01-02', // Kane Tanaka
				value: (ssrData.dob || {}).parsed || (pax.dob || {}).parsed || null,
			}),
		]),
		Cmp('td').attach([
			Cmp('select', {name: 'gender'}).attach([
				Cmp('option[male]', ssrData.gender !== 'M' ? {} : {selected: 'selected'}),
				Cmp('option[female]', ssrData.gender !== 'F' ? {} : {selected: 'selected'}),
			]),
		]),
		Cmp('td').attach([
			Cmp('input', {
				type: 'checkbox', name: 'isInfant',
				...(numRec.isInfant ? {checked: 'checked'} : {}),
			}),
		]),
		Cmp('td').attach([
			Cmp('input', {
				name: 'lastName', type: 'text',
				value: ssrData.lastName || pax.lastName,
				pattern: /[a-zA-Z][a-zA-Z\-\s]*/.source,
			}),
		]),
		Cmp('td').attach([
			Cmp('input', {
				name: 'firstName', type: 'text',
				value: ssrData.firstName || firstName,
				pattern: /[a-zA-Z][a-zA-Z\-\s]*/.source,
			}),
		]),
		Cmp('td').attach([
			Cmp('input', {
				name: 'middleName', type: 'text',
				value: ssrData.middleName || middleName || '',
				pattern: /[a-zA-Z][a-zA-Z\-\s]*/.source,
			}),
		]),
	]);
};

/**
 * note, all GDS-es except for Apollo allow joining them all into one
 * through "|", "§", ";" in Galileo, Sabre and Amadeus respectively
 *
 * @return {string[]} = ['¤:3SSRDOCSYYHK1/N1-2/////24SEP60/M//ROSS/KENNETH/DEVONNE']
 *                   || ['SI.P1/SSRDOCSYYHK1/////18MAR54/F//ESTRELLA/PATRICIA /ESTEE']
 *                   || ['3DOCSA/DB/27AUG09/M/DAVIDSONIV/WILLIAMJOSEPH-4.1']
 *                   || ['SRDOCSYYHK1-----17JAN54-F--QUIROZII-ELMA-FERNANDEZ/P1']
 */
const tsaDataToCmds = (tsaData, gds) => {
	if (!tsaData.dob) {
		// do not write SSR for passengers with no dob specified
		return [];
	}

	const {fieldNumber, firstNameNumber} = tsaData.nameNumber;
	const gdsDob = moment(tsaData.dob, 'YYYY-MM-DD').format('DDMMMYY');
	const infantMark = !tsaData.isInfant ? '' : 'I';
	const genderLetter = {male: 'M', female: 'F'}[tsaData.gender];
	const {lastName, firstName, middleName} = tsaData;
	const slashMiddleName = !middleName ? '' : '/' + middleName;

	return {
		'apollo': [`¤:3SSRDOCSYYHK1/N${fieldNumber}-${firstNameNumber}/////${gdsDob}/${genderLetter}${infantMark}//${lastName}/${firstName}/${middleName}`],
		'galileo': [`SI.P${fieldNumber}/SSRDOCSYYHK1/////${gdsDob}/${genderLetter}${infantMark}//${lastName}/${firstName}/${middleName}`],
		'sabre': [
			`3DOCSA/DB/${gdsDob}/${genderLetter}${infantMark}/${lastName}/${firstName}${slashMiddleName}-${fieldNumber}.${firstNameNumber}`,
			`4DOCSA/DB/${gdsDob}/${genderLetter}${infantMark}/${lastName}/${firstName}${slashMiddleName}-${fieldNumber}.${firstNameNumber}`,
		],
		'amadeus': [`SRDOCSYYHK1-----${gdsDob}-${genderLetter}${infantMark}--${lastName}-${firstName}-${middleName}/P${fieldNumber}`],
	}[gds];
};

const tsaTrToData = (tr) => {
	return {
		nameNumber: JSON.parse(tr.querySelector('[name="nameNumber"]').value),
		dob: tr.querySelector('[name="dob"]').value,
		isInfant: tr.querySelector('[name="isInfant"]').checked,
		gender: tr.querySelector('[name="gender"]').value,
		lastName: tr.querySelector('[name="lastName"]').value,
		firstName: tr.querySelector('[name="firstName"]').value,
		middleName: tr.querySelector('[name="middleName"]').value,
		oldSsrs: JSON.parse(tr.querySelector('[name="oldSsrs"]').value),
	};
};

const TsaForm = ({close}) => {
	const tbodyCmp = Cmp('tbody');
	const dom = Cmp('form', {onsubmit: (e) => {
		e.preventDefault();
		const gdsSwitch = getStore().app.gdsSwitch;
		const gds = gdsSwitch.getCurrentName();

		const dataRecords = [...tbodyCmp.context.querySelectorAll(':scope > tr')]
			.map(tsaTrToData);
		const deleteSsrs = dataRecords.flatMap(rec => rec.oldSsrs);
		SsrHelper().cancelOldSsrs(deleteSsrs, gds);
		let changed = false;
		for (const tsaData of dataRecords) {
			deleteSsrs.push(...tsaData.oldSsrs);
			const cmds = tsaDataToCmds(tsaData, gds);
			for (const cmd of cmds) {
				DEV_CMD_STACK_RUN(cmd);
				changed = true;
			}
		}
		if (changed || deleteSsrs.length === 0) {
			SsrHelper().saveChanges(gds);
		}
		close();
		return false; // no page reload
	}}).attach([
		Cmp('table').attach([
			Cmp('thead').attach([
				Cmp('tr').attach([
					Cmp('th[#]'),
					Cmp('th[Date of Birth]'),
					Cmp('th[Gender]'),
					Cmp('th[Inf]'),
					Cmp('th[Last Name]'),
					Cmp('th[First Name]'),
					Cmp('th[Middle Name]'),
				]),
			]),
			tbodyCmp,
		]),
		Cmp('div', {style: 'text-align: right'}).attach([
			Cmp('button', {textContent: 'Save', className: 'save-changes'}),
			Cmp('button', {textContent: 'Save', className: 'save-changes', disabled: 'disabled'}),
		]),
	]).context;

	const updateBlock = (paxes, docSsrs) => {
		tbodyCmp.context.innerHTML = '';
		tbodyCmp.attach(paxes.map((pax, i) => {
			const ssrs = docSsrs.filter(ssr =>
				ssr.ssrCode === 'DOCS' &&
				ssr.nameNumber && ssr.data &&
				// if there is a travel doc number, it's APIS, not TSA
				!ssr.data.travelDocNumber &&
				ssr.nameNumber.absolute == +i +1
			);
			return paxToTsaTrCmp(pax, paxes, ssrs);
		}));
	};

	return {
		dom,
		updateBlock,
	};
};

export default TsaForm;
