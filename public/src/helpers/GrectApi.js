
let GrectApi = ({
	whenEmcSessionId = Promise.reject('EMC ID not supplied'),
}) => {
	let fetchJson = ({url, urlParams = {}}) =>
		whenEmcSessionId.then(emcSessionId => {
			urlParams.emcSessionId = emcSessionId;
			let esc = encodeURIComponent;
			let query = Object.entries(urlParams)
				.map(([k, v]) => esc(k) + '=' + esc(v))
				.join('&');

			return fetch(url + (!query ? '' : '?' + query));
		}).then(rs => rs.json());

	let getCmdRqList = ({sessionId}) => fetchJson({
		url: '/terminal/getCmdRqList',
		urlParams: {sessionId},
	});

	let getCmdList = ({sessionId}) => fetchJson({
		url: '/api/js/terminal-log/commands',
		urlParams: {sessionId},
	});

	return {
		getCmdRqList: getCmdRqList,
		getCmdList: getCmdList,
	};
};

export default GrectApi;