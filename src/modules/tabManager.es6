export default class TabManager
{
	constructor()
	{
		this.index 	= 0;
		this.list	= [];
	}

	reset( list = [], output )
	{
		this.list 	= list;

		this.index 	= 0;
		this.output = output;

		if (list.length)
		{
			this.list.push(''); // empty command line
		}
	}

	next()
	{
		this.index++;

		if ( this.list.length <= this.index )
			this.index = 0;
	}

	getCommand()
	{
		return this.list[ this.index ];
	}

	formatOutput( cmd )
	{
		if (cmd) // last element in the array is an empty string
		{
			cmd = `>${cmd}`;
			const index = this.output.indexOf( cmd ) + cmd.length;
			return this.output.substr(0, index) + `[[;red;blue;]·]` +  this.output.substr( (index + 1 ) , this.output.length)

		}

		return this.output;
	}

	run( replace )
	{
		const cmd = this.getCommand();

		if ( cmd !== undefined )
		{
			replace([ cmd, this.formatOutput( cmd ) ]);
			this.next();
		}

		return [];
	}
}