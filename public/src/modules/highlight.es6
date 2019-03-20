import {DEV_CMD_STACK_RUN} from "../actions";
import {switchTerminal} from "./switchTerminal";
import {escapeSpecials, getFirstNumber, replaceChar, splitLines} from "../helpers/helpers";
import tetherDrop from 'tether-drop';

// example:        "1%+% PR 127 %L7%+%JFK%MNL 145A  615A+350  0" <- "%+%", "%L7%", "%JFK%"
// would result in "1+ PR 127 %L7+JFK%MNL 145A  615A+350  0" without this check
// instead of      "1+ PR 127 L7+JFKMNL 145A  615A+350  0"
const hasBrokenTokens = (text) => {
	let percents = text.split('').filter(c => c === '%');
	return percents.length % 2 === 1;
};

const makeRule		= (rule, key, isPattern = '') => {
	let searchIndex		= '';
	const isInteract 	= rule['onClickCommand'] || rule['onClickMessage'] || rule['onMouseOver'];

	if (isInteract)
	{
		searchIndex = `replace_${key}_${isPattern.replace('*', '').replace(/ /g, '_').replace(/@/g, 'at')}`;
		tips = {...tips, [searchIndex] : rule};
	}

	let className	= `term-highlight ${rule.color}-color ${rule.backgroundColor}-backgroundColor ${rule['decoration'].join(' ')}` + (searchIndex ? ` t-pointer ${searchIndex}` : '');

	return (...args) => {
		let match = args.shift();
		let fullStr = args.pop();
		let offset = args.pop();
		if (hasBrokenTokens(fullStr.slice(0, offset))) {
			return match; // skip this match
		} else {
			return `[[;;;${className}]${replaceChar(rule.value, '%')}]`; // creates span like span.usedCommand term-highlight replace_0
		}
	};
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

		const replaceOutput = (pattern, onClickCmd) => (line) => {
			const replaced 	= replaceWith(pattern, onClickCmd(line));
			const needle	= replaceAll(escapeSpecials(value));

			const newLine 	= line.replace(needle, replaced);
			outputText 		= outputText.replace(line, newLine);
		};
		const findInjection 	= line => {
			const pos = line.indexOf(value);
			return pos > -1;
		};
		const replacePerLine 	= (pattern, onClickCmd) => splitLines(outputText)
			.filter(findInjection).map(replaceOutput(pattern, onClickCmd));

		if (rule.onClickCommand.indexOf('{lnNumber}') > -1)
		{
			return replacePerLine('{lnNumber}', line => getFirstNumber(line));
		}

		if (rule.onClickCommand.indexOf('{pattern}') > -1)
		{
			return replacePerLine('{pattern}', () => replaceChar(value, '%'));
		}

		if ( findInjection(outputText) )
		{
			const needle = new RegExp(escapeSpecials(value), 'g');
			outputText = outputText.replace(needle, replaceWith() );
		}
	};

	appliedRules.forEach(loop);

	return {tips, outputText}
};

export const replaceInTerminal = ($div, tips) => {

	let popovers = [];

	/**
	 * a replacement for $().popover() because requiring bootstrap causes
	 * side effects in the form of main app popovers stopping working
	 */
	let bsPopover = (target, options) => {
		//return $(target).popover(options);
		let content = document.createElement('div');
		content.innerHTML = options.template;
		let popover = new tetherDrop({
			target: target,
			content: content,
			position: 'top center',
			classes: 'drop-theme-arrows highlight-popover',
			openOn: options.trigger,
			remove: true,
			tetherOptions: {
				attachment: 'bottom center',
				targetAttachment: 'top center',
				constraints: [{to: 'scrollParent', pin: true}],
			},
		});
		popovers.push(popover);
	};

	const findSpan = key => target => {

		const {id, onMouseOver, onClickMessage, onClickCommand, isInSameWindow} = tips[key];

		if (onClickMessage)
		{
			bsPopover(target, {
				...popoverDefs(onClickMessage, id),
				trigger 	: 'click',
				template 	: '<div class="font-bold text-danger" role="tooltip"><div class="arrow"></div><div style="max-width: 400px">' + onClickMessage + '</div></div>',
			});
		}
		if (onMouseOver)
		{
			bsPopover(target, {
				...popoverDefs(onMouseOver, id),
				trigger 	: 'hover',
				template 	: '<div class="font-bold text-primary" role="tooltip"><div class="arrow"></div><div style="max-width: 400px">' + onMouseOver + '</div></div>',
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
		try {
			[...$div[0].querySelectorAll('.' + key)]
				.forEach(findSpan(key));
		} catch (exc) {
			// sometimes matched text may contain "@" character and, which is not a valid selector
			// example: '.replace_0_1 MNL HKG 0525 0740 @KA5'
			console.error('Failed to highlight key: ' + key, exc);
		}
	});

	// $().terminal() re-renders content on focus change leaving broken tether
	// instance visible forever since onmouseout event never fires on target
	let cleanup = () => popovers.forEach(popover => popover.remove());
	return cleanup;
};

const popoverDefs = (content, id) => {
	content += window.GdsDirectPlusState.hasPermissions() ? '(' + id + ')' : '';

	return {content}
};