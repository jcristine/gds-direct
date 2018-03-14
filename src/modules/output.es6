import {splitIntoLinesArr} from '../helpers/helpers.es6';
import Dom from '../helpers/dom.es6';

export default class Output
{
	constructor( terminal )
	{
		this.terminal		= terminal;

		this.context 		= Dom('div.emptyLinesWrapper');
		this.emptyLines 	= 0;
		this.outputStrings	= '';
		this.cmdLineOffset 	= '';

		this.terminal.cmd().after( this.context );

		this.clearScreen 	= false;
		this.numRows		= 0;
	}

	setNumRows( numRows )
	{
		this.numRows = numRows;
		return this;
	}

	setNumChars( numOfChars )
	{
		this.numOfChars = numOfChars;
		return this;
	}

	setCharHeight( charHeight )
	{
		this.charHeight = charHeight;
		return this;
	}

	prepare( output, clearScreen = false )
	{
		this.outputStrings 	= output;
		this.clearScreen	= clearScreen;

		this._countEmpty()._printOutput()._attachEmpty()._scroll();
	}

	recalculate()
	{
		this._countEmpty()._attachEmpty()._scroll();
	}

	_countEmpty()
	{
		if (!this.numRows)
		{
			console.warn('No num rows !!!!!!!!!!!!');
		}

		const noClearScreen	= () => this.emptyLines > 0 ? this.emptyLines - this._getOutputLength() : 0 ;
		const isClearScreen = () => this.numRows - ( this._getOutputLength() + 2 ); // 2 = cmd line + command name

		this.emptyLines 	= this.clearScreen ? isClearScreen() : noClearScreen();

		if (this.emptyLines < 0 )
			this.emptyLines = 0;

		return this;
	}

	_attachEmpty()
	{
		this.context.innerHTML = '';

		if (this.emptyLines > 0 )
			this.context.innerHTML = [ ...new Array(  this.emptyLines + 1  ) ].join('<div><span>&nbsp;</span></div>');

		return this;
	}

	_getOutputLength()
	{
		const chars = this.numOfChars || this.terminal.cols();
		const lines = splitIntoLinesArr( this.outputStrings, chars );

		return lines.length;
	}

	_printOutput()
	{
		this.cmdLineOffset 	= this.terminal.cmd()[0].offsetTop  - ( this.charHeight ? this.charHeight : 0);

		console.log('@@', this.outputStrings)

		this.terminal.echo(this.outputStrings);
		return this;
	}

	_scroll()
	{
		if (this.emptyLines === 0)
		{
			this.terminal.scroll().scroll( this.cmdLineOffset ); // to first line, to desired line //TEST
		} else
		{
			this.terminal.scroll_to_bottom();
		}
	}
}