import {post} from './../../helpers/requests';
import {getStore} from "../../store";
import Drop		from 'tether-drop';
import Dom 		from '../../helpers/dom.es6';
import TsaForm from "./ssrForms/TsaForm";
import SsrHelper from "./ssrForms/SsrHelper";
import PhoneForm from "./ssrForms/PhoneForm";
import EmailForm from "./ssrForms/EmailForm";
import FrequentFlyerForm from "./ssrForms/FrequentFlyerForm";

const Component = require('../../modules/component.es6').default;
const Cmp = (...args) => new Component(...args);

const onClickOutside = (element, callback) => {
	const outsideClickListener = event => {
		if (!element.contains(event.target)) {
			callback();
		}
	};
	document.addEventListener('mousedown', outsideClickListener);
	return {
		removeListener: () => document.removeEventListener('mousedown', outsideClickListener),
	};
};

/** @param {string} icon - html */
const SsrForm = ({icon, popoverTarget}) => {
	const statusHolderCmp = Cmp('div.status-holder');
	const paxListCmp = Cmp('div.passenger-list');
	const segListCmp = Cmp('div.segment-list');
	const popContent = Dom('div');
	const popover = new Drop({
		target		: popoverTarget,
		content		: popContent,
		classes		: 'drop-theme-twipsy terminal-popover-root pnr-services-form-popover',
		position	: 'left middle',
		openOn		: null, // open/close only with code
		remove		: true,
		tetherOptions: {
			constraints: [
				{
					to: 'window',
					attachment: 'none',
				},
			],
		},
	});
	const tsaForm = TsaForm({close: () => popover.close()});
	const phoneForm = PhoneForm({close: () => popover.close()});
	const emailForm = EmailForm({close: () => popover.close()});
	const frequentFlyerForm = FrequentFlyerForm({close: () => popover.close()});

	const makeSectionsSwitchCmp = () => {
		const sectionButtons = [
			Cmp('span[TSA].active-section-btn', {'data-section': 'tsa'}),
			Cmp('span[Phone number]'          , {'data-section': 'phone-number'}),
			Cmp('span[E-mail]'                , {'data-section': 'email'}),
			Cmp('span[Frequent flyer]'        , {'data-section': 'frequent-flyer'}),
			Cmp('span[APIS]'                  , {'data-section': 'apis'}),
			Cmp('span[KTN]'                   , {'data-section': 'ktn'}),
			Cmp('span[Meal]'                  , {'data-section': 'meal'}),
			Cmp('span[OSI]'                   , {'data-section': 'osi'}),
			Cmp('span[Redress number]'        , {'data-section': 'redress-number'}),
			Cmp('span[Assistance]'            , {'data-section': 'assistance'}),
		];
		const sectionsContCmp = Cmp('div.sections', {'data-active-section': 'tsa'}).attach([
			Cmp('div', {'data-section': 'tsa'}).attach([tsaForm.dom]),
			Cmp('div', {'data-section': 'phone-number'}).attach([phoneForm.dom]),
			Cmp('div', {'data-section': 'email'}).attach([emailForm.dom]),
			Cmp('div', {'data-section': 'frequent-flyer'}).attach([frequentFlyerForm.dom]),
			Cmp('div', {'data-section': 'apis'}).attach([Cmp('h2[Not Implemented Yet apis]')]),
			Cmp('div', {'data-section': 'ktn'}).attach([Cmp('h2[Not Implemented Yet ktn]')]),
			Cmp('div', {'data-section': 'meal'}).attach([Cmp('h2[Not Implemented Yet meal]')]),
			Cmp('div', {'data-section': 'osi'}).attach([Cmp('h2[Not Implemented Yet osi]')]),
			Cmp('div', {'data-section': 'redress-number'}).attach([Cmp('h2[Not Implemented Yet redress-number]')]),
			Cmp('div', {'data-section': 'assistance'}).attach([Cmp('h2[Not Implemented Yet assistance]')]),
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

	const rootCmp = Cmp('div.pnr-services-form', {style: 'min-height: 450px'}).attach([
		statusHolderCmp,
		Cmp('h2[PNR Services]'),
		Cmp('div', {style: 'display: flex'}).attach([
			Cmp('div.passenger-list-block', {style: 'width: 200px'}).attach([
				paxListCmp,
				// Cmp('label').attach([
				// 	Cmp('input', {type: 'checkbox'}),
				// 	Cmp('span[Select all]'),
				// ]),
			]),
			Cmp('div.segment-list-block', {style: 'width: 400px'}).attach([
				segListCmp,
				// Cmp('label').attach([
				// 	Cmp('input', {type: 'checkbox'}),
				// 	Cmp('span[Select all]'),
				// ]),
			]),
		]),
		makeSectionsSwitchCmp(),
	]);
	popContent.appendChild(rootCmp.context);

	const render = (onRendered) => {
		const gdsSwitch = getStore().app.gdsSwitch;
		const plugin = gdsSwitch.getActivePlugin();
		const gds = gdsSwitch.getCurrentName();

		const setStatus = (status, msg = '') => {
			statusHolderCmp.context.setAttribute('data-status', status);
			statusHolderCmp.context.textContent = msg;
		};

		/** @param imported = require('GdsSessionController.js').getCurrentPnr() */
		const updateFromPnr = (imported) => {
			const {reservation, docSsrList, serviceSsrList, frequentFlyerInfo} = imported;
			paxListCmp.context.innerHTML = '';
			segListCmp.context.innerHTML = '';

			const paxes = reservation.passengers;
			const segs = reservation.itinerary;
			if (paxes.length === 0 || segs.length === 0) {
				setStatus('error', 'No PNR');
			} else {
				setStatus('success');
			}

			paxListCmp.attach(paxes.map(pax => {
				const {nameNumber, lastName, firstName, dob = null, ptc = null} = pax;
				let remark = null;
				if (dob) {
					remark = dob.raw;
				} else if (ptc) {
					remark = 'P-' + ptc;
				}
				const paxStr = SsrHelper().formatNameNum(nameNumber) + ' ' +
					lastName + '/' + firstName +
					(remark ? '*' + remark : '');
				return Cmp('div', {textContent: paxStr});
			}));
			segListCmp.attach(segs.map(seg => {
				return Cmp('div', {textContent: seg.raw});
			}));

			tsaForm.updateBlock(paxes, docSsrList.data || []);
			phoneForm.updateBlock(paxes, serviceSsrList.data || []);
			emailForm.updateBlock(paxes, serviceSsrList.data || []);
			frequentFlyerForm.updateBlock(paxes, frequentFlyerInfo.mileagePrograms || []);
			onRendered();

			const selector = '[data-section="tsa"] input[name="dob"]';
			[...rootCmp.context.querySelectorAll(selector)]
				.forEach(inp => inp.focus());
		};
		setStatus('loading', 'Loading PNR...');
		plugin._withSpinner(() => post('/terminal/getCurrentPnr', {
			gds, pnrFields: ['reservation', 'docSsrList'],
		}).then(updateFromPnr)
			.catch(exc => {
				setStatus('error', 'Failed to fetch PNR - ' + exc);
				return Promise.reject(exc);
			}));
	};

	const main = () => {
		const trigger = Dom('button.btn btn-primary font-bold', {innerHTML: icon});
		trigger.addEventListener('click', () => {
			render(() => {
				popover.open();
				// setTimeout - to not include current click to the handler
				setTimeout(() => {
					const listening = onClickOutside(popContent, () => {
						popover.close();
						listening.removeListener();
					});
				}, 1);
			});
		});
		return {
			dom: trigger,
		};
	};

	return main();
};

export default SsrForm;
