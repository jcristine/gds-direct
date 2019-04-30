
import './../actions/initAuthPage.js';

//import DataTable from '../abstract/dataTables.js';
import {getAgentList} from '../helpers/dataProvider.js';

let {$} = window;
let isDev = !(window.location.hostname + '').endsWith('.asaptickets.com');

let init = () => {
	let headTr = document.querySelector('thead > tr.session-list-columns');
	let tbody = document.querySelector('tbody.session-list');

	let whenAgentList = getAgentList();
	let whenAgentsById = whenAgentList.then(({records}) => {
		let agentsById = {};
		for (let record of records) {
			agentsById[record.id] = record;
		}
		return agentsById;
	});
	let getAgentById = (id) => whenAgentsById.then(agentsById => {
		let agent = agentsById[id];
		if (agent) {
			return Promise.resolve(agent);
		} else {
			return Promise.reject('No such agent: #' + id);
		}
	});

	let formatters = {
		agentId: (value) => {
			let span = document.createElement('span');
			span.textContent = value;
			if (value) {
				getAgentById(value).then(agent => {
					span.textContent = value + ' (' + agent.displayName + ')';
				});
			}
			return span;
		},
		requestId: (value) => {
			let baseUrl = isDev
				? 'https://cms.gitlab-runner.snx702.dyninno.net/leadInfo?rId='
				: 'https://cms.asaptickets.com/leadInfo?&rId=';
			let a = document.createElement('a');
			a.classList.add('btn-link');
			a.setAttribute('target', '_blank');
			a.setAttribute('href', baseUrl + value);
			a.textContent = value;
			return a;
		},
		logId: (value) => {
			let baseUrl = isDev
				? 'http://stg-logger.dyninno.net/get.php?i='
				: 'https://log.dyninno.net/get.php?i=';
			let a = document.createElement('a');
			a.classList.add('btn-link');
			a.setAttribute('target', '_blank');
			a.setAttribute('href', baseUrl + value);
			a.textContent = value;
			return a;
		},
		id: (value) => {
			let url = '/public/admin/terminalSessionCommands.html?sessionId=' + value;
			let a = document.createElement('a');
			a.classList.add('btn-link');
			a.setAttribute('target', '_blank');
			a.setAttribute('href', url);
			a.textContent = value;
			return a;
		},
	};

	/** @param {sessionsGet_rs} rsData */
	let redraw = (rsData) => {
		tbody.innerHTML = '';
		// put active sessions first
		let rows = rsData.aaData.sort((a,b) =>
			a.endTime === b.endTime ? 0 :
			!a.endTime ? -1 :
			!b.endTime ? 1 : 0);

		for (let i = 0; i < rows.length; ++i) {
			let row = rows[i];
			row['rowNumber'] = i + 1;
			let tr = headTr.cloneNode(true);
			tbody.appendChild(tr);
			[...tr.querySelectorAll(':scope > td')].forEach(td => {
				let name = td.getAttribute('data-name');
				td.innerHTML = '';
				let formatter = formatters[name];
				if (formatter) {
					let formatted = formatter(row[name]);
					td.appendChild(formatted);
				} else {
					td.textContent = row[name];
				}
			});
		}
	};

	let submitFilters = () => {
		let data = {};
		$('#filter-form').serializeArray()
			.map((item) => data[item.name] = item.value);
		window.GdsDirectPlusPage.whenEmcSessionId
			.then(emcSessionId => fetch('/admin/terminal/sessionsGet', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({...data, emcSessionId: emcSessionId}),
			}))
			.then(rs => rs.json())
			.then(rsData => redraw(rsData));
	};

	$('#filter-form').on('submit', (e) => {
		e.preventDefault();
		submitFilters();
		return false;
	});
	submitFilters();

	whenAgentList.then(({records}) => {
		let input = document.querySelector('#filter-form input[name="agentId"]');
		records.sort((a,b) =>
			a.displayName < b.displayName ? -1 :
			a.displayName > b.displayName ? 1 : 0);

		let data = records.map(({id, displayName}) => ({
			id: id,
			text: displayName + ' - ' + id,
		}));
		$(input).select2({
			data: data,
			width: '140px',
			tags: true,
			query: (params) => {
				let {term, page, callback} = params;
				let pageSize = 100;
				let from = (page - 1) * pageSize;
				let to = page * pageSize;
				let results = term
					? data.filter(e => e.text.toUpperCase()
						.includes(term.toUpperCase()))
					: data;
				callback({
					results: results.slice(from, to),
					more: results.length >= to,
				});
			},
		});
	});

	return Promise.resolve(true);
};

init();