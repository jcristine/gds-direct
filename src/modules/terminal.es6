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

	/*insertBuffer()
	{
		if ( !this.settings.buffer )
			return false;

		this.settings.buffer['buffering'].forEach( (record) => {
			this.plugin.terminal.echo(record.command, { finalize : function ( div ) {
				div[0].className = 'command';
			}});

			this.plugin.terminal.echo(record.output);
		});
	}*/

	reattach( parentNode, dimensions )
	{
		this.settings.parentContext = parentNode;

		this.context.style.height	= parentNode.clientHeight + 'px';
		this.context.style.width	= parentNode.clientWidth + 'px';

		this.settings.parentContext.appendChild(
			this.context
		);

		this.numOfRows 	= Math.floor( parentNode.clientHeight / dimensions.char.height );
		this.numOfChars	= Math.floor( this.context.clientWidth / dimensions.char.width ); //2 - padding-left px : need to fix


		if (this.plugin)
		{
			this.plugin.resize({
				numOfChars 	: this.numOfChars - 2,
				numOfRows 	: this.numOfRows
			});

			this.plugin.emptyLinesRecalculate( this.numOfRows, this.numOfChars, dimensions.char.height )
		}

		this.context.style.height = (this.numOfRows * dimensions.char.height) + 'px';

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