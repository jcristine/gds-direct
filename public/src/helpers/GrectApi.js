
const GrectApi = ({
	whenEmcSessionId = Promise.reject('EMC ID not supplied'),
}) => {
	const fetchJson = ({url, urlParams = null, postParams = null}) => {
		return whenEmcSessionId.then(emcSessionId => {
			if (urlParams) {
				urlParams.emcSessionId = emcSessionId;
				const esc = encodeURIComponent;
				const query = Object.entries(urlParams)
					.map(([k, v]) => esc(k) + '=' + esc(v))
					.join('&');
				url += (!query ? '' : '?' + query);
			}
			return fetch(url, {
				...(!postParams ? {} : {
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({
						...postParams, emcSessionId,
					}),
				}),
			});
		}).then(rs => rs.status !== 204 ? rs :
			Promise.reject('_No Content_ header returned')
		).then(rs => rs.json());
	};

	let getCmdRqList = ({sessionId}) => fetchJson({
		url: '/terminal/getCmdRqList',
		urlParams: {sessionId},
	});

	let getCmdList = ({sessionId}) => fetchJson({
		url: '/api/js/terminal-log/commands',
		urlParams: {sessionId},
	});

	const saveHighlightSampleDump = (params) => fetchJson({
		url: '/admin/terminal/highlight/saveSampleDump',
		postParams: params,
	});

	return {
		getCmdRqList: getCmdRqList,
		getCmdList: getCmdList,
		saveHighlightSampleDump: saveHighlightSampleDump,
	};
};

export default GrectApi;