import {DEV_CMD_STACK_RUN} from "../actions";
import Drop from "tether-drop";
import {switchTerminal} from "./switchTerminal";

export const highlightPopover = (props) => {
	const defs = {
		classes		: 'drop-theme-twipsy font-bold highlight-popover',
		position	: 'top center',
		openOn		: 'hover'
	};

	return new Drop({
		...defs,
		...props
	});
};

export const seedOutputString = (outputText, appliedRules) => {

	const tips = {};

	// appliedRules = Object.keys(appliedRules).map((k) => appliedRules[k]);

	appliedRules.map( ({color, value, ...rule}, key) => {
		const replaced 	= value.replace(new RegExp('%', 'g'), '');

		let part =  '[[;;;'+color;

		if (rule.onClickCommand || rule.onMouseOver)
		{
			tips['replace_'+key] = rule;
			part += ' terminal-highlight replace_'+key;
		}

		part += ']'+replaced+']';

		outputText = outputText.replace(value, part);
	});

	return {
		tips, outputText
	}
};

export const replaceInTerminal = (div, tips) => {

	Object.keys(tips).map( key => {

		const target 	= div[0].querySelector('.' + key);
		let content 	= tips[key].onMouseOver;

		if ( window.TerminalState.hasPermissions() )
		{
			content += '(' + tips[key].id + ')';
		}

		if (target && content)
		{
			highlightPopover({target, content})
		}

		const command = tips[key].onClickCommand || tips[key].onClickMessage;

		if (target && command)
		{
			target.onclick = () => {
				switchTerminal({keymap : 'next'})
					.then(() => {
						DEV_CMD_STACK_RUN(command);
					});
			}
		}
	});
};