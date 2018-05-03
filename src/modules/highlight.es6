import {DEV_CMD_STACK_RUN} from "../actions";
import {switchTerminal} from "./switchTerminal";


export const seedOutputString = (outputText, appliedRules) => {

	const tips = {};

	appliedRules.map( ({color, decoration, value, ...rule}, key) => {

		const replaced 	= value.replace(/%/g, '');
		color 			+= ` ${decoration.join(' ')} term-highlight`;

		if (rule.onClickCommand.indexOf('lnNumber') > -1)
		{
			/** when we need to replace {lineNumber} for all the values found in output**/
			return outputText.split(/\r?\n/)
				.filter( line => line.indexOf(value) > -1)
				.map( line => {

					/** GET FIRST NUMBER **/
					const lineNumber = line.match(/^\d+|\d+\b|\d+(?=\w)/)[0];
					const index 	= `replace_${key}_${lineNumber}`;

					tips[index] 	= {
						...rule,
						onClickCommand : rule.onClickCommand.replace('{lnNumber}', lineNumber)
					};

					let part 		= `[[;;;t-pointer ${color} ${index}]${replaced}]`;
					const newLine 	= line.replace(value, part);

					outputText 		= outputText.replace(line, newLine);
				});
		}

		if (rule['onClickCommand'] || rule['onClickMessage'] || rule['onMouseOver'])
		{
			const index 	= 'replace_'+key;
			color 			+= ` t-pointer ${index}`;
			tips[index] 	= rule;
		}

		let part = `[[;;;${color}]${replaced}]`;

		if ( outputText.indexOf(value) > -1 )
		{
			/**escapes all special regexp chars**/
			const valueReplaced = value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
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
				target.onclick 		= () => {

					if (parseInt(isInSameWindow) === 1)
					{
						return DEV_CMD_STACK_RUN(onClickCommand);
					}

					switchTerminal({keymap : 'next'}).then( () => DEV_CMD_STACK_RUN(onClickCommand) );
				}
			}
		});
	});
};