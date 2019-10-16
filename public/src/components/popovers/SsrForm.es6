import ButtonPopOver from '../../modules/buttonPopover.es6';
import {post} from './../../helpers/requests';
import {getStore} from "../../store";
import {DEV_CMD_STACK_RUN} from "../../actions";
import moment from "moment";

const Component = require('../../modules/component.es6').default;
const Cmp = (...args) => new Component(...args);

const paxToTsaTrCmp = (pax, paxes, ssrs) => {
	const ssrData = ssrs.map(ssr => ssr.data).slice(-1)[0] || {};
	const makeNumOpts = (pax) => {
		const abs = pax.nameNumber.absolute;
		return paxes
			.map(p => p.nameNumber)
			.map(numRec => Cmp('option', {
				textContent: formatNameNum(numRec),
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
			Cmp('select', {name: 'nameNumber'})
				.attach(makeNumOpts(pax)),
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
			Cmp('input', {name: 'lastName', type: 'text', value: ssrData.lastName || pax.lastName}),
		]),
		Cmp('td').attach([
			Cmp('input', {name: 'firstName', type: 'text', value: ssrData.firstName || firstName}),
		]),
		Cmp('td').attach([
			Cmp('input', {name: 'middleName', type: 'text', value: ssrData.middleName || middleName || ''}),
		]),
	]);
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

const cancelOldSsrs = (deleteSsrs, gds) => {
	if (deleteSsrs.length > 0) {
		const nums = deleteSsrs.map(ssr => ssr.lineNumber);
		const cmd = {
			apollo: 'C:' + nums.join('*') + '@:3',
			// cancel SSR-s from end so following line numbers were not affected
			sabre: deleteSsrs
				.sort((a,b) => b.lineNumber - a.lineNumber)
				.map(ssr => (ssr.isForAmericanAirlines ? '4' : '3') + ssr.lineNumber + '¤')
				.join('§'),
			// not sure if in galileo should be sorted backwards as well...
			galileo: nums
				.map(n => 'SI.' + n + '@')
				.join('|'),
			amadeus: 'XE' + nums.join(','),
		}[gds];
		DEV_CMD_STACK_RUN(cmd);
	}
};

const saveChanges = (gds) => {
	const cmd = {
		apollo: 'R:GRECT|ER',
		sabre: '6GRECT§ER',
		galileo: 'R.GRECT|ER',
		amadeus: 'RFGRECT;ER',
	}[gds];
	DEV_CMD_STACK_RUN(cmd);
};

const makeSectionsSwitchCmp = () => {
	const sectionButtons = [
		Cmp('span[TSA].active-section-btn', {'data-section': 'tsa'}),
		Cmp('span[APIS]'                  , {'data-section': 'apis'}),
		Cmp('span[Frequent flyer]'        , {'data-section': 'frequent-flyer'}),
		Cmp('span[KTN]'                   , {'data-section': 'ktn'}),
		Cmp('span[Meal]'                  , {'data-section': 'meal'}),
		Cmp('span[OSI]'                   , {'data-section': 'osi'}),
		Cmp('span[Redress number]'        , {'data-section': 'redress-number'}),
		Cmp('span[Phone number]'          , {'data-section': 'phone-number'}),
		Cmp('span[E-mail]'                , {'data-section': 'email'}),
		Cmp('span[Assistance]'            , {'data-section': 'assistance'}),
	];
	const tbodyCmp = Cmp('tbody');
	const sectionsContCmp = Cmp('div.sections', {'data-active-section': 'tsa'}).attach([
		Cmp('div', {'data-section': 'tsa'}).attach([
			Cmp('form', {onsubmit: (e) => {
				e.preventDefault();
				const gdsSwitch = getStore().app.gdsSwitch;
				const gds = gdsSwitch.getCurrentName();

				const dataRecords = [...tbodyCmp.context.querySelectorAll(':scope > tr')]
					.map(tsaTrToData);
				const deleteSsrs = dataRecords.flatMap(rec => rec.oldSsrs);
				cancelOldSsrs(deleteSsrs, gds);
				let changed = false;
				for (const tsaData of dataRecords) {
					deleteSsrs.push(...tsaData.oldSsrs);
					const cmds = tsaDataToCmds(tsaData, gds);
					for (const cmd of cmds) {
						DEV_CMD_STACK_RUN(cmd);
						changed = true;
					}
				}
				if (changed && deleteSsrs.length === 0) {
					saveChanges(gds);
				}
				return false; // no page reload
			}}).attach([
				Cmp('table.tsa-data').attach([
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
					Cmp('button[Save]'),
				]),
			]),
		]),
		Cmp('div', {'data-section': 'apis'}).attach([
			Cmp('h2[Not Implemented Yet apis]'),
		]),
		Cmp('div', {'data-section': 'frequent-flyer'}).attach([
			Cmp('h2[Not Implemented Yet frequent-flyer]'),
		]),
		Cmp('div', {'data-section': 'ktn'}).attach([
			Cmp('h2[Not Implemented Yet ktn]'),
		]),
		Cmp('div', {'data-section': 'meal'}).attach([
			Cmp('h2[Not Implemented Yet meal]'),
		]),
		Cmp('div', {'data-section': 'osi'}).attach([
			Cmp('h2[Not Implemented Yet osi]'),
		]),
		Cmp('div', {'data-section': 'redress-number'}).attach([
			Cmp('h2[Not Implemented Yet redress-number]'),
		]),
		Cmp('div', {'data-section': 'phone-number'}).attach([
			Cmp('h2[Not Implemented Yet phone-number]'),
		]),
		Cmp('div', {'data-section': 'email'}).attach([
			Cmp('h2[Not Implemented Yet email]'),
		]),
		Cmp('div', {'data-section': 'assistance'}).attach([
			Cmp('h2[Not Implemented Yet assistance]'),
		]),
	]);
	const sectionSwitchCmp = Cmp('div.section-switch').attach([
		Cmp('div.switch-buttons').attach(sectionButtons),
		sectionsContCmp,
	]);
	const activeBtnCls = 'active-section-btn';
	const getActiveBtns = () => {
		const selector = ':scope > .switch-buttons > .' + activeBtnCls;
		return [...sectionSwitchCmp.context.querySelectorAll(selector)];
	};
	sectionButtons.forEach(btnCmp => {
		const btn = btnCmp.context;
		const section = btn.getAttribute('data-section');
		btn.onclick = () => {
			getActiveBtns().forEach(btn => btn.classList.toggle(activeBtnCls, false));
			btn.classList.toggle(activeBtnCls, true);

			return sectionsContCmp.context
				.setAttribute('data-active-section', section);
		};
	});
	return sectionSwitchCmp;
};

const formatNameNum = (nameNumber) => {
	const {fieldNumber, firstNameNumber, isInfant} = nameNumber;
	return fieldNumber + '.' + (isInfant ? 'I/' : '') + firstNameNumber;
};

export default class SsrForm extends ButtonPopOver
{
	constructor({icon})
	{
		super( {icon, onOpen: () => this.onOpen()}, 'div' );
		this.makeTrigger({});
		this.statusHolderCmp = Cmp('div.status-holder');
		this.paxListCmp = Cmp('div.passenger-list');
		this.segListCmp = Cmp('div.segment-list');
	}

	updateTsaBlock(paxes, docSsrs)
	{
		const tbody = this.rootCmp.context.querySelector('[data-section="tsa"] tbody');
		tbody.innerHTML = '';
		Cmp({context: tbody}).attach(paxes.map((pax, i) => {
			const ssrs = docSsrs.filter(ssr =>
				ssr.ssrCode === 'DOCS' &&
				ssr.nameNumber && ssr.data &&
				ssr.nameNumber.absolute == +i +1
			);
			return paxToTsaTrCmp(pax, paxes, ssrs);
		}));
	}

	onOpen()
	{
		const gdsSwitch = getStore().app.gdsSwitch;
		const plugin = gdsSwitch.getActivePlugin();
		const gds = gdsSwitch.getCurrentName();

		const setStatus = (status, msg = '') => {
			this.statusHolderCmp.context.setAttribute('data-status', status);
			this.statusHolderCmp.context.textContent = msg;
		};

		/** @param reservation = require('ImportApolloPnrFormatAdapter.js').transformReservation() */
		const updateFromPnr = (imported) => {
			const {reservation, docSsrList} = imported;
			this.paxListCmp.context.innerHTML = '';
			this.segListCmp.context.innerHTML = '';

			const paxes = reservation.passengers;
			const segs = reservation.itinerary;
			if (paxes.length === 0 || segs.length === 0) {
				setStatus('error', 'No PNR');
			} else {
				setStatus('success');
			}

			this.paxListCmp.attach(paxes.map(pax => {
				const {nameNumber, lastName, firstName, dob = null, ptc = null} = pax;
				let remark = null;
				if (dob) {
					remark = dob.raw;
				} else if (ptc) {
					remark = 'P-' + ptc;
				}
				const paxStr = formatNameNum(nameNumber) + ' ' +
					lastName + '/' + firstName +
					(remark ? '*' + remark : '');
				return Cmp('div', {textContent: paxStr});
			}));
			this.segListCmp.attach(segs.map(seg => {
				return Cmp('div', {textContent: seg.raw});
			}));

			this.updateTsaBlock(paxes, docSsrList.data || []);
			this.rootCmp.context.querySelector('[data-section="tsa"] input[name="dob"]').focus();
		};
		setStatus('loading', 'Loading PNR...');
		plugin._withSpinner(() => post('/terminal/getCurrentPnr', {
			gds, pnrFields: ['reservation', 'docSsrList'],
		}).then(updateFromPnr)
			.catch(exc => {
				setStatus('error', 'Failed to fetch PNR - ' + exc);
				return Promise.reject(exc);
			}));
	}

	build()
	{
		const rootCmp = Cmp('div.pnr-services-form', {style: 'min-height: 450px'}).attach([
			this.statusHolderCmp,
			Cmp('h2[PNR Services]'),
			Cmp('div', {style: 'display: flex'}).attach([
				Cmp('div.passenger-list-block', {style: 'width: 200px'}).attach([
					this.paxListCmp,
					// Cmp('label').attach([
					// 	Cmp('input', {type: 'checkbox'}),
					// 	Cmp('span[Select all]'),
					// ]),
				]),
				Cmp('div.segment-list-block', {style: 'width: 400px'}).attach([
					this.segListCmp,
					// Cmp('label').attach([
					// 	Cmp('input', {type: 'checkbox'}),
					// 	Cmp('span[Select all]'),
					// ]),
				]),
			]),
			makeSectionsSwitchCmp(),
		]);
		this.rootCmp = rootCmp;
		this.popContent.appendChild(rootCmp.context);
	}
}
