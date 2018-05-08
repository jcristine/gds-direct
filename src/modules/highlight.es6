import {DEV_CMD_STACK_RUN} from "../actions";
import {switchTerminal} from "./switchTerminal";

const getFirstNumber = (line) => line.match(/^\d+|\d+\b|\d+(?=\w)/)[0];

const makeSpan	= (color, index, value) => `[[;;;${color} ${index}]${value.replace(/%/g, '')}]`;

const makeRule	= (rule, key, lineNumber = '') => {

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
		newRule.onClickCommand = newRule.onClickCommand.replace('{lnNumber}', lineNumber);
	}

	if (searchIndex)
	{
		className += ` ${searchIndex}`;
	}

	return {searchIndex, className, newRule};
};


export const seedOutputString = (outputText, appliedRules) => {

	const tips = {};

	appliedRules.map( ({value, ...rule}, key) => {

		if (rule.onClickCommand.indexOf('lnNumber') > -1)
		{
			/** when we need to replace {lineNumber} for all the values found in output**/
			return outputText.split(/\r?\n/)
				.filter( line => line.indexOf(value) > -1)
				.map( line => {
					/** GET FIRST NUMBER **/
					const lineNumber = getFirstNumber(line);

					const {searchIndex, newRule, className} = makeRule(rule, key, lineNumber);
					tips[searchIndex] 	= newRule;

					const newLine 	= line.replace(value, makeSpan(className, searchIndex, value) );
					outputText 		= outputText.replace(line, newLine);
				});
		}

		const {searchIndex, newRule, className} = makeRule(rule, key);

		if (searchIndex)
		{
			tips[searchIndex] = newRule;
		}

		if ( outputText.indexOf(value) > -1 )
		{
			/** Escapes all special regexp chars **/
			const valueReplaced = value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
			outputText = outputText.replace(new RegExp(valueReplaced, 'g'), makeSpan(className, searchIndex, value));
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