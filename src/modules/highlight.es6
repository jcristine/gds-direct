import {DEV_CMD_STACK_RUN} from "../actions";
import {switchTerminal} from "./switchTerminal";
import {escapeSpecials, getFirstNumber, replaceChar, splitLines} from "../helpers/helpers";

const makeRule		= (rule, key, lineNumber = '', pattern = '') => {

	let searchIndex	= '';
	let className	= `${rule.color} ${rule['decoration'].join(' ')} term-highlight`;
	let newRule		= {...rule};

	if (rule['onClickCommand'] || rule['onClickMessage'] || rule['onMouseOver'])
	{
		searchIndex = `replace_${key}`;
		className 	+= ` t-pointer`;
	}

	if (lineNumber)
	{
		searchIndex += '_' + lineNumber;
		newRule.onClickCommand = newRule.onClickCommand.replace(pattern, lineNumber);
	}

	if (searchIndex)
	{
		className += ` ${searchIndex}`;
	}

	return {searchIndex, className, newRule};
};


export const seedOutputString = (outputText, appliedRules) => {

	let tips = {};

	const loop = ({value, ...rule}, key) => {

		const replaceWith 		= (pattern = '', lineNumber = '') => {
			const {searchIndex, className, newRule} = makeRule(rule, key, lineNumber, pattern);

			if (searchIndex)
				tips = {...tips, [searchIndex] : newRule};

			return `[[;;;${className} ${searchIndex}]${replaceChar(value,'%')}]`;
		};

		const findInjection = line => line.indexOf(value) > -1;

		const replaceOutput = (pattern, getCmd) => line => {
			const replaced = replaceWith(pattern, getCmd(line));
			outputText = outputText.replace(line, line.replace(value, replaced) );
		};

		const replacePerLine = (pattern, getCmd) => splitLines(outputText).filter(findInjection).map( replaceOutput(pattern, getCmd));

		if (rule.onClickCommand.indexOf('{lnNumber}') > -1)
		{
			return replacePerLine('{lnNumber}', line => getFirstNumber(line));
		}

		if (rule.onClickCommand.indexOf('{pattern}') > -1)
		{
			return replacePerLine('{pattern}', () => replaceChar(value, '%') );
		}

		if ( outputText.indexOf(value) > -1 )
		{
			const needle = new RegExp(escapeSpecials(value), 'g');
			outputText = outputText.replace(needle, replaceWith() );
		}
	};

	appliedRules.forEach(loop);

	return {tips, outputText}
};

export const replaceInTerminal = (div, tips) => {
	Object.keys(tips).map(key => {

		[].map.call(div[0].querySelectorAll('.' + key), target => {

			const {id, onMouseOver, onClickMessage, onClickCommand, isInSameWindow} = tips[key];

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
				if (parseInt(isInSameWindow) === 1)
				{
					target.onclick 	= () => DEV_CMD_STACK_RUN(onClickCommand);
				} else
				{
					target.onclick 	= () => switchTerminal({keymap : 'next'}).then( () => DEV_CMD_STACK_RUN(onClickCommand) )
				}
			}
		});
	});
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