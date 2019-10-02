import './../src/actions/initAuthPage.js';
import GrectApi from './../src/helpers/GrectApi.js';
import Component from '../src/modules/component.es6';

const Cmp = (...args) => new Component(...args);

const whenEmcSessionId = window.GdsDirectPlusPage.whenEmcSessionId;
const grectApi = GrectApi({whenEmcSessionId});

const main = () => {
	const mpList = document.getElementById('mp-action-list');
	grectApi.admin.getMpLog().then(({records}) => {
		for (const record of records) {
			mpList.appendChild(Cmp('tr').attach([
				Cmp('td', {textContent: record.dt}),
				Cmp('td', {textContent: record.agentLogin}),
				Cmp('td', {textContent: record.agentCompanies.join(', ')}),
				Cmp('td', {textContent: record.mpAirline}),
				Cmp('td', {textContent: record.mpPcc}),
			]).context);
		}
	});
};

main();
