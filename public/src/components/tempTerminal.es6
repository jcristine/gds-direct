import Component from "../modules/component";
import Dom from "../helpers/dom";

export class TempTerminal extends Component
{
	constructor()
	{
		super('div.terminal temp-terminal');

		this.cursor = Dom('span.cursor', {innerHTML  : '&nbsp;'});
		const div	= Dom('div.cmd', {innerHTML  : '&nbsp;'});

		div.appendChild( this.cursor );
		this.attach(div);
	}

	calculate()
	{
		return {
			char		: this.getLineHeight()
		}
	}

	getLineHeight()
	{
		const  { width, height } = this.cursor.getBoundingClientRect();
		return { width, height };
	}
}