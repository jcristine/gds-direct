export default class TabManager
{
	constructor()
	{
		this.index 	= 0;
		this.list	= [];
		this.output = '';
	}

	_getCommand()
	{
		return this.list[ this.index ];
	}

	_formatOutput( cmd )
	{
		if (cmd) // last element in the array is an empty string
		{
			cmd 		= `>${cmd}`;
			const pos 	= this.output.indexOf( cmd );
			const index = pos + cmd.length;

			if (pos !== -1) // show this only if command is found
				return this.output.substr(0, index) + `[[;red;blue;]·]` +  this.output.substr( (index + 1 ) , this.output.length);
		}

		return this.output;
	}

	reset( commandList = [], output )
	{
		this.list 	= commandList;
		this.index 	= false;
		this.output = output;

		if (commandList.length)
		{
			this.list.push(''); // empty command line
		}
	}

	next()
	{
		this.index = this.index === false ? 0 : this.index + 1;

		if ( this.list.length <= this.index )
			this.index = 0;

		return this;
	}

	prev()
	{
		this.index--;

		if ( this.index < 0)
			this.index = this.list.length - 1;

		return this;
	}

	move(isOn = false)
	{
		if (isOn)
			return this.prev();

		return this.next();
	}

	run(terminal)
	{
		const cmd = this._getCommand();

		if ( cmd !== undefined )
		{
			terminal.update(-1,  this._formatOutput(cmd));
			terminal.cmd().set( cmd );
		}

		return [];
	}
}