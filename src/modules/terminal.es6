import TerminalPlugin	from '../middleware/plugin.es6';
import Dom				from '../helpers/dom.es6';
import {CHANGE_ACTIVE_TERMINAL} from "../actions/settings";

require('../../node_modules/jquery.terminal/js/unix_formatting');

export default class Terminal
{
	constructor( params )
	{
		this.plugin 	= null;
		this.settings 	= params;
		this.context 	= Dom('div.terminal terminal-cell ' + (params.name === 'wide' ? 'fixedColumnBackground' : ''));

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
			numOfChars 	: this.numOfChars,
			charHeight 	: this.charHeight
		});

		if (this.settings.name === 0) // when all terminals init at once first is current but never gets selected
		{
			CHANGE_ACTIVE_TERMINAL({curTerminalId: 0});
			this.plugin.terminal.enable();
		}
	}

	makeBuffer( buf )
	{
		if (!buf)
			return false;

		const buffered = buf['buffering'].map( record => {

			const c = $.terminal.format( record.output ).replace(/%/g, '').replace(new RegExp('\r?\n','g'), '<br />')
			const output = record.output ? `<pre style="white-space: pre-wrap; overflow: hidden">${ c } </pre>` : '';

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
		const {char, numOf ,terminalSize, leftOver} = dimension;

		this.numOfRows 	= numOf.numOfRows;
		this.numOfChars	= numOf.numOfChars;

		this.charHeight	= char.height;

		if (this.plugin)
		{
			this.plugin.resize({
				numOfChars 	: this.numOfChars,
				numOfRows 	: this.numOfRows,
				charHeight	: this.charHeight
			});
		} else
		{
			this.initPlugin();
		}

		this.context.style.width 	= terminalSize.width + 'px';
		this.context.style.height 	= terminalSize.height + 'px';

		const padding = Math.floor(leftOver.height / 2);
		this.context.style.paddingTop 		= padding + 'px';
		this.context.style.paddingBottom 	= padding + 'px';
		this.context.style.boxSizing 		= 'content-box';

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