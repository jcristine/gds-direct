import {DEV_CMD_STACK_RUN} from "../actions";
import Drop from "tether-drop";
import {switchTerminal} from "./switchTerminal";

const highlightPopover = (props) => {
	const defs = {
		classes		: 'drop-theme-twipsy font-bold highlight-popover',
		position	: 'top center',
		openOn		: 'hover',
		remove		: true
	};

	return new Drop({
		...defs,
		...props
	});
};

export const seedOutputString = (outputText, appliedRules) => {

	const tips = {};

	appliedRules.map( ({color, value, ...rule}, key) => {

		const replaced 	= value.replace(new RegExp('%', 'g'), '');

		let part =  `[[;;;${color}`;

		if (rule.onClickCommand || rule.onClickMessage || rule.onMouseOver)
		{
			part += ' terminal-highlight replace_'+key;
			tips['replace_'+key] = rule;
		}

		part += `]${replaced}]`;

		/*let part =  `<span class="${color}`;

		if (rule.onClickCommand || rule.onClickMessage || rule.onMouseOver)
		{
			part += ' terminal-highlight replace_'+key;
			tips['replace_'+key] = rule;
		}

		part += `"`;

		if (rule.onMouseOver)
		{
			let content = rule.onMouseOver;

			if ( window.TerminalState.hasPermissions() ) // for debug purpose
			{
				content += '(' + rule.id + ')';
			}

			part += ` title="${content}"`;
		}

		part += `>${replaced}</span>`;
*/
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

		[].map.call(querySelector, target  => {

			const command = tips[key].onClickCommand || tips[key].onClickMessage;

			if (target && command)
			{
				const runCommand = () => DEV_CMD_STACK_RUN(command);

				target.onclick = () => {
					switchTerminal({keymap : 'next'}).then( runCommand );
				}
			}

			let content 	= tips[key].onMouseOver;

			if ( window.TerminalState.hasPermissions() ) // for debug purpose
			{
				content += '(' + tips[key].id + ')';
			}

			if (target && content)
			{
				// highlightPopover({target, content});

				$(target).popover({
					placement 	: 'top',
					// container	: 'body',
					content 	: content,
					template	: '<div class="popover bg-darka font-bold text-danger" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
					html 		: true,
					trigger		: 'hover',
					viewport	: div
				});
			}
		});
	});
};