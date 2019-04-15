
import {get} 				from "../helpers/requests";

let whenPccList = null;
let getPccList = () => {
	if (!whenPccList) {
		whenPccList = get('/data/getPccList');
	}
	return whenPccList;
};
let wheShortcutActionList = null;
let getShortcutActionList = () => {
	if (!wheShortcutActionList) {
		wheShortcutActionList = get('/admin/getShortcutActions');
	}
	return wheShortcutActionList;
};

/**
 * gather here data-retrieval functions and use from all
 * components to make sure we don't fetch same data twice
 */
export {
	getPccList,
	getShortcutActionList,
};