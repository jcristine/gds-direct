'use strict';

import {splitIntoLinesArr} from '../helpers/helpers.es6';

export default class Output
{
	constructor( terminal )
	{
		this.terminal		= terminal;

		this.context 		= document.createElement('div');
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

	countEmpty()
	{
		if (!this.numRows)
		{
			console.warn('No num rows !!!!!!!!!!!!');
		}

		const numOfRows = this.numRows || this.terminal.rows(); //this.terminal.rows() - slow dom append cursor to body

		const noClearScreen	= () => this.emptyLines > 0 ? this.emptyLines - this.getOutputLength() : 0 ;
		const isClearScreen = () => numOfRows - ( this.getOutputLength() + 2 ); // 2 = cmd line + command name

		this.emptyLines 	= this.clearScreen ? isClearScreen() : noClearScreen();

		// console.log( ' ==== ' );
		// console.log( this.terminal.rows() );
		// console.log( numOfRows );
		// console.log( this.getOutputLength() );
		// console.log( this.emptyLines );

		if (this.emptyLines < 0 )
			this.emptyLines = 0;

		return this;
	}

	prepare( output, clearScreen = false )
	{
		this.outputStrings 	= output;
		this.clearScreen	= clearScreen;

		this.countEmpty().printOutput().attachEmpty().scroll();
	}

	recalculate()
	{
		// console.log(' recalculate ');
		this.countEmpty().attachEmpty().scroll();
	}

	attachEmpty()
	{
		this.context.innerHTML = '';

		if (this.emptyLines > 0 )
			this.context.innerHTML = [ ...new Array(  this.emptyLines + 1  ) ].join('<div><span>&nbsp;</span></div>');

		return this;
	}

	getOutputLength()
	{
		const chars = this.numOfChars || this.terminal.cols();

		// console.log( chars )
		// console.log( this.numOfChars )
		// console.log( this.terminal.cols() )

		// console.log(' num of chars ', this.numOfChars );
		// console.log(' num of chars ', this.terminal.cols() );
		// console.log(' num of chars ', chars );

		// console.log('zzz', this.terminal.cols() );
		// console.log('zzz', chars  );

		const lines = splitIntoLinesArr( this.outputStrings, chars );
		// console.log( lines );

		return lines.length;
	}

	printOutput()
	{
		this.cmdLineOffset 	= this.terminal.cmd()[0].offsetTop  - ( this.charHeight ? this.charHeight : 0);

		this.terminal.echo(this.outputStrings);
		return this;
	}

	scroll()
	{
		if (this.emptyLines === 0)
		{
			this.terminal.scroll().scroll( this.cmdLineOffset ); // to first line, to desired line //TEST
		} else
		{
			this.terminal.scroll_to_bottom(); // to first line, to desired line //TEST
			// this.terminal[0].scrollTop = this.terminal[0].scrollHeight;
		}
	}
}