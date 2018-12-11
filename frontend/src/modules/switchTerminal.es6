import {SWITCH_TERMINAL} from "../actions";

export const switchTerminal = ({keymap}) => {

	const fn = ({matrix, curTerminalId}) => {

		const {list} = matrix;

		if (typeof keymap === 'number')
		{
			const id = keymap === 48 ? 9 : keymap - 49;
			return id >= list.length ? false :  list[id];
		}

		const index 		= list.indexOf(curTerminalId);
		let changeIndex 	= keymap === 'next' ? (index + 1) : (index - 1);

		if (changeIndex >= list.length)
			changeIndex = 0;

		if (changeIndex < 0)
			changeIndex = list.length - 1;

		return list[changeIndex];
	};

	return SWITCH_TERMINAL( fn );
};