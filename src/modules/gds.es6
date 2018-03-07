import {GDS_LIST} 	from '../constants.es6';
import {GDS_UNIT} 	from "./gdsUnit";

export class GDS
{
	constructor(gdsList, buffer = {}, activeName, permissions)
	{
		this.list 		= gdsList;
		this.buffer 	= buffer;
		this.setCurrent(activeName);

		this.gdsSet 	= GDS_LIST
			.filter( name => ( name !== 'galileo' || permissions) )
			.map( name => {
				let settings 		= this.list[name] 	|| {};
				const {gds = {}} 	= this.buffer 		|| {};

				return new GDS_UNIT(name, settings, gds);
			});
	}

	getList()
	{
		return this.gdsSet;
	}

	setCurrent(name = 'apollo')
	{
		this.name = name;
	}

	getCurrent()
	{
		return this.gdsSet.filter( gds => this.name === gds.get('name') )[0];
	}

	getCurrentName()
	{
		return this.name;
	}

	isApollo()
	{
		return this.name === 'apollo';
	}

	update(newState)
	{
		this.gdsSet = this.gdsSet.map( gds => {

			if (gds.get('name') === this.name)
			{
				gds.update(newState);
			}

			return gds;
		});
	}

	updateMatrix(dimensions)
	{
		this.getCurrent().updateMatrix(dimensions);
	}

	updatePcc(newState)
	{
		this.getCurrent().updatePcc(newState);
	}

	clearScreen()
	{
		const terminals = this.getCurrent().get('terminals');

		for (const key of Object.keys(terminals))
		{
			if (terminals[key])
			{
				terminals[key].clear();
			}
		}

		// this.getCurrent().get('terminals').forEach( terminal => terminal.clear() );
	}

	getActiveTerminal()
	{
		return this.getCurrent().getActiveTerminal();
	}

	changeActive(index)
	{
		const terminal = this.getActiveTerminal();

		if (typeof terminal !== 'undefined')
		{
			terminal.context.classList.remove('activeWindow');
		}

		this.update({curTerminalId : index});
		this.getActiveTerminal().context.classList.add('activeWindow');

		// return this.getActiveTerminal().context; // for focus
	}

	runCommand(command)
	{
		const terminal = this.getActiveTerminal();

		if (typeof terminal === 'undefined')
		{
			alert('Please select terminal first');
			return Promise.reject('Please select terminal first');
		}

		terminal.plugin.terminal.exec(command);
		return Promise.resolve();
	}
}