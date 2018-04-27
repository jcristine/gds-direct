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

// highlightPopover({target, content});

/*const replaceForLargeDiv = () => {
	let part =  `<span class="${color}`;

	if (rule.onClickCommand || rule.onClickMessage || rule.onMouseOver)
	{
		part += ' t-highlight replace_'+key;
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
}*/

export const seedOutputString = (outputText, appliedRules) => {

	const tips = {};

	appliedRules.map(({color, value, ...rule}, key) => {

		const replaced 	= value.replace(/%/g, '');

		let part = `[[;;;${color} someClasses ]${replaced}]`;

		if (rule.onClickCommand || rule.onClickMessage || rule.onMouseOver)
		{
			part = part.replace('someClasses', `t-highlight replace_${key}`);
			tips['replace_'+key] = rule;
		}

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


const popoverDefs = (div, content, placement = 'top') => ({
	placement 	: placement,
	content 	: content,
	template	: '<div class="popover font-bold text-danger" role="tooltip"><div class="arrow"></div><div class="popover-content highlight-popover"></div></div>',
	html 		: true,
	trigger		: 'click',
	viewport	: div,
	container	: div
});

export const replaceInTerminal = (div, tips) => {

	Object.keys(tips).map(key => {

		[].map.call(div[0].querySelectorAll('.' + key), target => {

			const {id, onMouseOver, onClickMessage, onClickCommand} = tips[key];

			if (target && onClickMessage)
			{
				$(target).popover( popoverDefs(div, onClickMessage, 'bottom') );
			}

			if (target && onMouseOver)
			{
				let content = onMouseOver + (window.TerminalState.hasPermissions() ? '(' + id + ')' : '');

				$(target).tooltip({
					...popoverDefs(div, content),
					title		: content,
					trigger 	: 'hover',
					template 	: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
				});
			}

			if (target && onClickCommand)
			{
				const runCommand 	= () => DEV_CMD_STACK_RUN(onClickCommand);

				target.onclick 		= () => {
					switchTerminal({keymap : 'next'}).then( runCommand );
				}
			}
		});
	});
};