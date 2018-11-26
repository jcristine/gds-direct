import {DEV_CMD_STACK_RUN} from "../actions";
import {switchTerminal} from "./switchTerminal";
import {escapeSpecials, getFirstNumber, replaceChar, splitLines} from "../helpers/helpers";

const makeRule		= (rule, key, isPattern = '') => {
	let searchIndex		= '';
	const isInteract 	= rule['onClickCommand'] || rule['onClickMessage'] || rule['onMouseOver'];

	if (isInteract)
	{
		searchIndex = `replace_${key}_${isPattern.replace('*', '')}`;
		tips = {...tips, [searchIndex] : rule};
	}

	let className	= `term-highlight ${rule.color}-color ${rule.backgroundColor}-backgroundColor ${rule['decoration'].join(' ')}` + (searchIndex ? ` t-pointer ${searchIndex}` : '');
	return `[[;;;${className}]${replaceChar(rule.value, '%')}]`; // creates span like span.usedCommand term-highlight replace_0
};

/**
 color
 decoration
 id
 isInSameWindow
 onClickCommand : command / {lineNumber} / {pattern}
 onClickMessage
 onMouseOver
 value
**/

const replaceAll = value => new RegExp(value, 'g');

let tips 	= {};

export const seedOutputString = (outputText, appliedRules) => {

	tips = {};

	const loop 	= (rule, key) => {
		const value = rule.value;

		const replaceWith = (pattern = '', patternReplaced = '') => {
			const newRule = {...rule};

			if (pattern)
			{
				newRule.onClickCommand = newRule.onClickCommand.replace(pattern, patternReplaced);
			}

			return makeRule(newRule, key, patternReplaced);
		};

		const replaceOutput = (pattern, onClickCmd) => line => {
			const replaced 	= replaceWith(pattern, onClickCmd(line));
			const needle	= replaceAll(escapeSpecials(value));

			const newLine 	= line.replace(needle, replaced);
			outputText 		= outputText.replace(line, newLine);
		};

		const findInjection 	= line => line.indexOf(value) > -1;
		const replacePerLine 	= (pattern, onClickCmd) => splitLines(outputText).filter(findInjection).map(replaceOutput(pattern, onClickCmd));

		if (rule.onClickCommand.indexOf('{lnNumber}') > -1)
		{
			return replacePerLine('{lnNumber}', line => getFirstNumber(line));
		}

		if (rule.onClickCommand.indexOf('{pattern}') > -1)
		{
			return replacePerLine('{pattern}', () => replaceChar(value, '%'));
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

	const findSpan = key => target => {

		const {id, onMouseOver, onClickMessage, onClickCommand, isInSameWindow} = tips[key];

		if (onClickMessage)
		{
			$(target).popover({
				...popoverDefs(div, onClickMessage, id),

				template 	: '<div class="popover popoverOnClick font-bold text-danger" role="tooltip"><div class="arrow"></div><div class="popover-content highlight-popover"></div></div>',
			});
		}

		if (onMouseOver)
		{
			$(target).popover({
				...popoverDefs(div, onMouseOver, id),

				placement 	: 'top',
				trigger 	: 'hover',
				template 	: '<div class="popover font-bold text-primary" role="tooltip"><div class="arrow"></div><div class="popover-content highlight-popover"></div></div>',
			});
		}

		if (onClickCommand)
		{
			// $(target).tooltip({
			// 	...popoverDefs(div, onClickCommand, id),
			// 	placement 	: 'top',
			// 	trigger 	: 'hover',
			// 	template 	: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
			// });

			if (parseInt(isInSameWindow) === 1)
			{
				target.onclick 	= () => DEV_CMD_STACK_RUN(onClickCommand);
			} else
			{
				target.onclick 	= () => switchTerminal({keymap : 'next'}).then( () => DEV_CMD_STACK_RUN(onClickCommand) )
			}
		}
	};

	Object.keys(tips).map(key => {
		const spans = div[0].querySelectorAll('.' + key);
		[].map.call(spans, findSpan(key));
	});
};

const popoverDefs = (div, content, id) => {
	content += window.GdsDirectPlusState.hasPermissions() ? '(' + id + ')' : '';

	return {
		content,
		placement 	: 'top',
		trigger		: 'click',
		template	: '<div class="popover font-bold text-danger" role="tooltip"><div class="arrow"></div><div class="popover-content highlight-popover"></div></div>',

		title		: content,
		html 		: true,
		viewport	: div,
		container	: div
	}
};

// closing popover when clicking outside it
$('body').on('click', function (e) {
	$('.popoverOnClick').each(function () {
		if ( e.target.getAttribute('aria-describedby') !== this.id && !$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0 ) {
			$(this).popover('hide');
		}
	});
});
// bootstrap fix where programmatically hiding popover trigger click state is not changed
$('body').on('hidden.bs.popover', function (e) {
	$(e.target).data('bs.popover').inState.click = false;
});