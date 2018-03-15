import {splitIntoLinesArr} from '../helpers/helpers.es6';
import Dom from '../helpers/dom.es6';

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
		const noClearScreen	= () => this.emptyLines > 0 ? (this.emptyLines - this._getOutputLength()) : 0 ;
		const isClearScreen = () => this.numRows - ( this._getOutputLength() + 2 ); // 2 = cmd line + command name

		this.emptyLines 	= this.clearScreen ? isClearScreen() : noClearScreen();

		if (this.emptyLines < 0 )
			this.emptyLines = 0;

		return this;
	}

	_printOutput()
	{
		this.cmdLineOffset 	= this.terminal.cmd()[0].offsetTop;//  - this.charHeight; // remember scrollTop height before the command so when clear flag screen is set scroll to this mark

		this.terminal.echo(this.outputStrings);
		return this;
	}

	_attachEmpty()
	{
		this.context.innerHTML = '';

		if (this.emptyLines > 0 )
			this.context.innerHTML = [ ...new Array(  this.emptyLines + 1  ) ].join('<div><span>&nbsp;</span></div>');

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

	printOutput(output, isClearScreen = false)
	{
		this.outputStrings 	= output;
		this.clearScreen	= isClearScreen;

		this._countEmpty()._printOutput()._attachEmpty()._scroll();
	}
}