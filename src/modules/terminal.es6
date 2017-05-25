'use strict';

import TerminalPlugin	from '../middleware/plugin.es6';
import Dom				from '../helpers/dom.es6';

require('../../node_modules/jquery.terminal/js/unix_formatting');

export default class Terminal {

	constructor( params )
	{
		this.plugin 	= null;
		this.settings 	= params;
		this.context 	= Dom('div.terminal');

		this.makeBuffer( params.buffer );

		this.context.onclick = () => {

			if (!this.plugin)
				this.init();

		};
	}

	init()
	{
		// this.context.innerHTML = '';

		this.plugin = new TerminalPlugin({
			context 		: this.context,
			name 			: this.settings['name'],
			sessionIndex 	: this.settings['sessionIndex'],
			gds 			: this.settings['gds'],
			numOfRows 		: this.numOfRows,
			numOfChars 		: this.numOfChars
		});

		// this.insertBuffer();
	}

	makeBuffer( buf )
	{
		if (!buf)
			return false;

		const buffered = buf['buffering'].map( record => {

			const output = record.output ? `<pre style="white-space: pre-wrap; overflow: hidden">${ $.terminal.format( record.output )} </pre>` : '';

			return `<div class="command">
						<div style="100%">
							<span>${record.command}</span>
						</div>
					</div>
					${output}`;
		}).join('');

		this.bufferDiv 				= Dom('article.terminal-wrapper');
		this.bufferDiv.innerHTML 	= `<div class="terminal-output"> ${buffered} </div>`;

		this.context.appendChild( this.bufferDiv );
	}

	insertBuffer()
	{
		if ( !this.settings.buffer )
			return false;

		this.settings.buffer['buffering'].forEach( (record) => {
			this.plugin.terminal.echo(record.command, { finalize : function ( div ) {
				div[0].className = 'command';
			}});

			this.plugin.terminal.echo(record.output);
		});
	}

	calculateNumOfRows( lineHeight )
	{
		return Math.floor( this.settings.parentContext.clientHeight / lineHeight );
	}

	reattach( parentNode, dimensions )
	{
		// console.log(' reatach ');

		this.settings.parentContext = parentNode;

		parentNode.style.height		= dimensions.height + 'px';
		parentNode.style.width		= dimensions.width	+ 'px';

		// console.log( dimensions );
		// console.log( parentNode.clientWidth );

		this.context.style.height	= parentNode.clientHeight + 'px';
		this.context.style.width	= parentNode.clientWidth + 'px';

		this.numOfRows 				= this.calculateNumOfRows( dimensions.char.height );
		this.numOfChars				= Math.floor( parentNode.clientWidth / Math.ceil(dimensions.char.width) );

		// console.log( parentNode.clientWidth , dimensions.char.width);
		// console.log( '====', this.numOfChars );

		this.settings.parentContext.appendChild( this.context );

		if (this.plugin)
		{
			this.plugin.terminal.settings().numChars = Math.floor( (dimensions.width - 2) / dimensions.char.width );
			this.plugin.terminal.settings().numRows  = this.numOfRows;

			this.plugin.resize();
		}

		this.context.style.height = (this.numOfRows * dimensions.char.height) + 'px';

		if (this.plugin)
		{
			this.plugin.emptyLinesRecalculate( this.numOfRows, this.numOfChars, dimensions.char.height );
		}

		this.context.scrollTop = this.context.scrollHeight;
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