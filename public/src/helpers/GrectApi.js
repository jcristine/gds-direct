
const GrectApi = ({
	whenEmcSessionId = Promise.reject('EMC ID not supplied'),
}) => {
	const fetchJson = ({url, urlParams = {}, postParams = null}) => {
		return whenEmcSessionId.then(emcSessionId => {
			if (!postParams) {
				urlParams.emcSessionId = emcSessionId;
			}
			if (Object.keys(urlParams).length > 0) {
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
		getPccList: params => fetchJson({url: '/data/getPccList'}),
		getCmdRqList: getCmdRqList,
		getCmdList: getCmdList,
		saveHighlightSampleDump: saveHighlightSampleDump,
		listMultiPccTariffRules: (params) => fetchJson({
			url: '/api/js/admin/multi-pcc-tariff/list-rules',
		}),
		storeMultiPccTariffRule: params => fetchJson({
			url: '/api/js/admin/multi-pcc-tariff/store-rule',
			postParams: params,
		}),
		deleteMultiPccTariffRule: params => fetchJson({
			url: '/api/js/admin/multi-pcc-tariff/delete-rule',
			postParams: params,
		}),
		admin: {
			getMpLog: () => fetchJson({url: '/admin/getMpLog'}),
		},
	};
};

export default GrectApi;
