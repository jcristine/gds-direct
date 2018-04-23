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

		if ( outputText.indexOf(value) > -1 )
		{
			const valueReplaced = value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'); // escapes all special regexp chars
			outputText = outputText.replace(new RegExp(valueReplaced, 'g'), part);
		}
	});

	return {
		tips, outputText
	}
};

export const replaceInTerminal = (div, tips) => {

	Object.keys(tips).map( key => {

		const querySelector 	= div[0].querySelectorAll('.' + key);

		[].map.call(querySelector, ( target )  => {

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
				const runCommand = () => DEV_CMD_STACK_RUN(command);
				target.onclick = () => switchTerminal({keymap : 'next'}).then( runCommand )
			}

		});
	});
};