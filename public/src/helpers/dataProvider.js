
let fetchJson = (url) => {
	let rootUrl = (window.GdsDirectPlusParams || {}).rootUrl;
	// using the requests.es6 module only if it is the main app bundle, since
	// it uses webpack-specific features, like requiring 'noty' from node_modules,
	// otherwise just make simple fetch() request on a vanilla es6 import page
	// not sure it's the best way to arrange code though...
	if (rootUrl) {
		let {get} = require('../helpers/requests.es6');
		return get(url);
	} else {
		return fetch(url).then(rs => rs.json());
	}
};

let whenPccList = null;
let getPccList = () => {
	if (!whenPccList) {
		whenPccList = fetchJson('/data/getPccList');
	}
	return whenPccList;
};
let whenShortcutActionList = null;
let getShortcutActionList = () => {
	if (!whenShortcutActionList) {
		whenShortcutActionList = fetchJson('/admin/getShortcutActions');
	}
	return whenShortcutActionList;
};
let whenAgentList = null;
let getAgentList = () => {
	if (!whenAgentList) {
		whenAgentList = fetchJson('/data/getAgentList');
	}
	return whenAgentList;
};

/**
 * gather here data-retrieval functions and use from all
 * components to make sure we don't fetch same data twice
 */
export {
	getPccList,
	getShortcutActionList,
	getAgentList,
};