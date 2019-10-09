
import './../actions/initAuthPage.js';

//import DataTable from '../abstract/dataTables.js';
import {getAgentList} from '../helpers/dataProvider.js';

const {$} = window;
const isDev = !(window.location.hostname + '').endsWith('.asaptickets.com');

const init = () => {
	const headTr = document.querySelector('thead > tr.session-list-columns');
	const tbody = document.querySelector('tbody.session-list');

	const whenAgentList = getAgentList();
	const whenAgentsById = whenAgentList.then(({records}) => {
		const agentsById = {};
		for (const record of records) {
			agentsById[record.id] = record;
		}
		return agentsById;
	});
	const getAgentById = (id) => whenAgentsById.then(agentsById => {
		const agent = agentsById[id];
		if (agent) {
			return Promise.resolve(agent);
		} else {
			return Promise.reject('No such agent: #' + id);
		}
	});

	const formatters = {
		agentId: (value) => {
			const span = document.createElement('span');
			span.textContent = value;
			if (value) {
				getAgentById(value).then(agent => {
					span.textContent = value + ' (' + agent.displayName + ')';
				});
			}
			return span;
		},
		requestId: (value) => {
			const baseUrl = isDev
				? 'https://cms.gitlab-runner.snx702.dyninno.net/leadInfo?rId='
				: 'https://cms.asaptickets.com/leadInfo?&rId=';
			const a = document.createElement('a');
			a.classList.add('btn-link');
			a.setAttribute('target', '_blank');
			a.setAttribute('href', baseUrl + value);
			a.textContent = value;
			return a;
		},
		logId: (value) => {
			const baseUrl = isDev
				? 'http://stg-logger.dyninno.net/get.php?i='
				: 'https://log.dyninno.net/get.php?i=';
			const a = document.createElement('a');
			a.classList.add('btn-link');
			a.setAttribute('target', '_blank');
			a.setAttribute('href', baseUrl + value);
			a.textContent = value;
			return a;
		},
		id: (value) => {
			const url = '/public/admin/terminalSessionCommands.html?sessionId=' + value;
			const a = document.createElement('a');
			a.classList.add('btn-link');
			a.setAttribute('target', '_blank');
			a.setAttribute('href', url);
			a.textContent = value;
			return a;
		},
	};

	/** @param {sessionsGet_rs} rsData */
	const redraw = (rsData) => {
		tbody.innerHTML = '';
		// put active sessions first
		const rows = rsData.aaData.sort((a,b) =>
			a.endTime === b.endTime ? 0 :
				!a.endTime ? -1 :
					!b.endTime ? 1 : 0);

		for (let i = 0; i < rows.length; ++i) {
			const row = rows[i];
			row['rowNumber'] = i + 1;
			const tr = headTr.cloneNode(true);
			tbody.appendChild(tr);
			[...tr.querySelectorAll(':scope > td')].forEach(td => {
				const name = td.getAttribute('data-name');
				td.innerHTML = '';
				const formatter = formatters[name];
				if (formatter) {
					const formatted = formatter(row[name]);
					td.appendChild(formatted);
				} else {
					td.textContent = row[name];
				}
			});
		}
	};

	const submitFilters = () => {
		let data = {};
		$('#filter-form').serializeArray()
			.map((item) => data[item.name] = item.value);
		data = {...data, ...eval('(' + (data.customJson || '{}') + ')')};
		delete data.customJson;
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
		const input = document.querySelector('#filter-form input[name="agentId"]');
		records.sort((a,b) =>
			a.displayName < b.displayName ? -1 :
				a.displayName > b.displayName ? 1 : 0);

		const data = records.map(({id, displayName}) => ({
			id: id,
			text: displayName + ' - ' + id,
		}));
		$(input).select2({
			data: data,
			width: '140px',
			tags: true,
			query: (params) => {
				const {term, page, callback} = params;
				const pageSize = 100;
				const from = (page - 1) * pageSize;
				const to = page * pageSize;
				const results = term
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
