import {SwitchCb} from "es6!../../../../../../../helpers/dom/switch";

import App from 'application';
import {dispatch} from "es6!../store";
import {getLang} from "es6!../language";
import {UPDATE} from "es6!../actions/common";

const Component = App.components.create;

export const DetailsSwitch = () => {
	const context = SwitchCb({
		id 		: 'details',
		text	: getLang('detailsNotR'),
		click  	: status => {
			dispatch(UPDATE, {key : 'detailsNotRequired', value : status})
		}
	});

	return Component({
		context
	}).assignRender(state => {
		context.set(state.props.detailsNotRequired);
		context.classList.toggle('hidden', state.terminal);
	})
};