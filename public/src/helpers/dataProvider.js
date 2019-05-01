
import {get} from "../helpers/requests.es6";

let whenPccList = null;
let getPccList = () => {
	if (!whenPccList) {
		whenPccList = get('/data/getPccList');
	}
	return whenPccList;
};
let whenShortcutActionList = null;
let getShortcutActionList = () => {
	if (!whenShortcutActionList) {
		whenShortcutActionList = get('/admin/getShortcutActions');
	}
	return whenShortcutActionList;
};
let whenAgentList = null;
let getAgentList = () => {
	if (!whenAgentList) {
		whenAgentList = get('/data/getAgentList');
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