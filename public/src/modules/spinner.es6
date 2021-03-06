'use strict';

const cliSpinners 		= require('cli-spinners');

export default class Spinner
{
	constructor( terminal )
	{
		this.timer 		= false;
		this.terminal 	= terminal;
		this.prompt 	= '';
		this.spinner	= cliSpinners.simpleDots;
		this.spinner.interval = 550;
		this.frameCounter = 0;
	}

	set()
	{
		const text = this.spinner.frames[this.frameCounter++ % this.spinner.frames.length];
		this.terminal.set_prompt(text);
	}

	start()
	{
		if (this.timer)
		{
			// this.end();
			return false;
		}

		this.terminal.find('.cursor').hide();
		this.terminal.set_mask('');

		this.prompt 	= this.terminal.get_prompt();

		this.set();
		this.timer 		= setInterval( this.set.bind(this), this.spinner.interval);
	}

	end()
	{
		clearInterval( this.timer );

		this.terminal.set_prompt( this.prompt );

		this.terminal.find('.cursor').show();
		this.terminal.set_mask(false);

		this.timer = false;
	}

	isActive()
	{
		return !!this.timer;
	}
}