import TerminalPlugin	from '../middleware/plugin.es6';
import Dom				from '../helpers/dom.es6';

require('../../node_modules/jquery.terminal/js/unix_formatting');

export default class Terminal
{
	constructor( params )
	{
		this.plugin 	= null;
		this.settings 	= params;
		this.context 	= Dom('div.terminal terminal-cell');

		this.makeBuffer( params.buffer );
	}

	initPlugin()
	{
		this.plugin = new TerminalPlugin({
			context 	: this.context,
			clear		: () => this.clear(),
			name 		: this.settings['name'],
			gds 		: this.settings['gds'],
			numOfRows 	: this.numOfRows,
			numOfChars 	: this.numOfChars
		});
	}

	makeBuffer( buf )
	{
		if (!buf)
			return false;

		const buffered = buf['buffering'].map( record => {

			const output = record.output ? `<pre style="white-space: pre-wrap; overflow: hidden">${ $.terminal.format( record.output )} </pre>` : '';

			return `<div class="command">
						<div>
							<span class="usedCommand">${record.command}</span>
						</div>
					</div>
					${output}`;
		}).join('');

		this.bufferDiv 				= Dom('article.terminal-wrapper');
		this.bufferDiv.innerHTML 	= `<div class="terminal-output"> ${buffered} </div>`;

		this.context.appendChild( this.bufferDiv );
	}

	changeSize(dimension)
	{
		const {char, size} = dimension;

		const charHeight 	= char.height;
		const charWidth 	= char.width;

		this.numOfRows 	= Math.floor( size.height 	/ charHeight );
		this.numOfChars	= Math.floor( size.width 	/ charWidth ); //2 - padding-left px : need to fix

		if (this.plugin)
		{
			this.plugin.resize({
				numOfChars 	: this.numOfChars - 2,
				numOfRows 	: this.numOfRows
			});

			this.plugin.emptyLinesRecalculate( this.numOfRows, this.numOfChars, char.height );
		} else
		{
			this.initPlugin()
		}

		// this.context.style.width 	= ( (this.numOfChars - 2) * charWidth) 	+ 'px';
		// this.context.style.height 	= (this.numOfRows * charHeight) 		+ 'px';

		this.context.style.width 	= size.width	+ 'px';
		this.context.style.height 	= (size.height) + 'px';

		return this.plugin;
	}

	clear()
	{
		if (this.plugin)
		{
			this.plugin.terminal.clear();
			this.plugin.terminal.cmd().set('');
		}

		if (this.bufferDiv)
		{
			this.context.removeChild(this.bufferDiv);
			this.bufferDiv = false;
		}

		this.buffer = '';
	}
}