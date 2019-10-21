
import Dom from "../../helpers/dom";
import {get} from "../../helpers/requests";

const withBtnLock = (btn, action) => {
	btn.setAttribute('disabled', 'disabled');
	return Promise.resolve()
		.then(action).finally(() => {
			btn.removeAttribute('disabled');
		});
};

/** @param reprotectionAction = require('ReprotectionAction.es6')() */
const ReprotectionButton = ({reprotectionBtnCallback, gdsSwitch}) => {
	const btn = Dom('button', {
		className: 'btn btn-sm btn-mozilla font-bold',
		textContent: 'RO',
		onclick: () => withBtnLock(btn, () =>
			get('/terminal/getReprotectionData')
				.then(reprotectionBtnCallback)),
	});
	return {dom: Dom('article', {}, [btn])};
};

export default ReprotectionButton;
