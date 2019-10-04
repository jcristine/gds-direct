import './../src/actions/initAuthPage.js';
import GrectApi from './../src/helpers/GrectApi.js';
import Component from '../src/modules/component.es6';

const Cmp = (...args) => new Component(...args);

const whenEmcSessionId = window.GdsDirectPlusPage.whenEmcSessionId;
const grectApi = GrectApi({whenEmcSessionId});

const matchesFilters = (filters, record) => {
	const minDate = filters.minDate.value;
	const maxDate = filters.maxDate.value;
	const company = filters.company.value;
	const mpAirline = filters.mpAirline.value;
	const agentLogin = filters.agentLogin.value;
	const mpPcc = filters.mpPcc.value;
	const destinationAirport = filters.destinationAirport.value;
	return (!minDate || record.dt.slice(0, 10) >= minDate)
		&& (!minDate || record.dt.slice(0, 10) <= maxDate)
		&& (!company || record.agentCompanies.includes(company))
		&& (!mpAirline || record.mpAirline === mpAirline)
		&& (!agentLogin || record.agentLogin === agentLogin)
		&& (!mpPcc || record.mpPcc === mpPcc)
		&& (!destinationAirport || record.destinationAirport === destinationAirport)
	;
};

const main = () => {
	const mpList = document.getElementById('mp-action-list');
	const filterForm = document.forms[0];
	const filters = filterForm.elements;
	grectApi.admin.getMpLog().then(({records}) => {
		const render = () => {
			mpList.textContent = '';
			for (const record of records) {
				if (matchesFilters(filters, record)) {
					mpList.appendChild(Cmp('tr').attach([
						Cmp('td', {textContent: record.dt}),
						Cmp('td', {textContent: record.recordLocator}),
						Cmp('td', {textContent: record.agentLogin}),
						Cmp('td', {textContent: record.agentCompanies.join(', ')}),
						Cmp('td', {textContent: record.mpAirline}),
						Cmp('td', {textContent: record.mpPcc}),
						Cmp('td', {textContent: record.destinationAirport}),
					]).context);
				}
			}
		};
		filterForm.onsubmit = (evt) => {
			evt.preventDefault();
			render();
			return false;
		};
		render();
	});
};

main();
