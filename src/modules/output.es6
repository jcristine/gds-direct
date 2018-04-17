import {splitIntoLinesArr} from '../helpers/helpers.es6';
import Dom from '../helpers/dom.es6';
// import Drop from "tether-drop";

export default class Output
{
	constructor( terminal, {numOfChars, numOfRows, charHeight})
	{
		this.terminal		= terminal;

		this.emptyLines 	= 0;
		this.outputStrings	= '';
		this.cmdLineOffset 	= '';
		this.clearScreen 	= false; // parameter for lifting up output with empty lines;

		this.numRows 		= numOfRows;
		this.numOfChars 	= numOfChars;
		this.charHeight 	= charHeight;

		this.context 		= Dom('div.emptyLinesWrapper');
		this.terminal.cmd().after( this.context );
	}

	setOptions({numOfRows, numOfChars, charHeight})
	{
		this.numRows 	= numOfRows;
		this.numOfChars = numOfChars;
		this.charHeight = charHeight;
	}

	recalculate({numOfRows, numOfChars, charHeight}) //on view terminal change sizes
	{
		this.setOptions({numOfRows, numOfChars, charHeight});

		this
			._countEmpty()
			._attachEmpty()
			._scroll();
	}

	_getOutputLength()
	{
		return splitIntoLinesArr( this.outputStrings, this.numOfChars ).length;
	}

	_countEmpty()
	{
		const outputRows = this.outputStrings ? this._getOutputLength() : 1;

		const rowsRemoveEmpty	= () => this.emptyLines - outputRows;
		const rowsToLift 		= () => this.numRows - outputRows - 1; // 1 - cmd line

		this.emptyLines 	= this.clearScreen ? rowsToLift() : rowsRemoveEmpty();

		if (this.emptyLines < 0)
		{
			this.emptyLines = 0;
		}

		return this;
	}

	_printOutput(appliedRules = '')
	{
		/*if (appliedRules)
		{
			const tips = {};

			Object.keys(appliedRules).map( (key) => {
				const color = appliedRules[key].color;
				const value = appliedRules[key].value;

				tips['replace_'+key] = appliedRules[key];
				this.outputStrings = this.outputStrings.replace(value, '[[;;;'+color+' replace_'+key+']'+value+']');
			});

			this.terminal.echo(this.outputStrings, {
				finalize : (div) => {

					Object.keys(tips).map( (key) => {
						const tip = div[0].querySelector('.' + key);

						if (tip && tips[key].onMouseOver)
						{
							new Drop({
								target		: tip,
								content		: '<div class="font-bold">'+tips[key].onMouseOver+'</div>',
								classes		: 'drop-theme-twipsy',
								openOn		: 'hover'
							});
						}

					});
				}
			});
		} else
		{*/
			this.terminal.echo(this.outputStrings);
		// }

		return this;
	}

	_attachEmpty()
	{
		this.context.innerHTML = '';

		if (this.emptyLines > 0 )
		{
			this.context.innerHTML = [ ...new Array(  this.emptyLines + 1  ) ].join('<div><span>&nbsp;</span></div>');
		}

		return this;
	}

	_scroll()
	{
		if (this.emptyLines === 0)
		{
			this.terminal.scroll().scroll( this.cmdLineOffset ); // to first line, to desired line
		} else
		{
			this.terminal.scroll_to_bottom();
		}
	}

	printOutput(output, isClearScreen = false, appliedRules = '')
	{
		this.outputStrings 	= output;
		this.clearScreen	= isClearScreen;
		this.cmdLineOffset 	= this.terminal.cmd()[0].offsetTop; // - this.charHeight; // remember scrollTop height before the command so when clear flag screen is set scroll to this mark

		this._countEmpty()._printOutput(appliedRules)._attachEmpty()._scroll();
	}
}