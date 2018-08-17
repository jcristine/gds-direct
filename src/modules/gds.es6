import {GDS_UNIT} 	from "./gdsUnit";
import {GDS_LIST} from "../constants";

export class GDS
{
	constructor({gdsListDb, buffer = {}, activeName})
	{
		this.setCurrent(activeName);

		this.gdsSet 	= GDS_LIST.map( name => {
			const settings 		= gdsListDb[name] || {};
			const {gds = {}} 	= buffer;

			return new GDS_UNIT(name, settings.area, gds, settings);
		});
	}

	getList()
	{
		return this.gdsSet;
	}

	setCurrent(name = 'apollo')
	{
		this.name 	= name;
		this.index 	= GDS_LIST.indexOf(name);
	}

	getCurrent()
	{
		return this.gdsSet.filter( gds => this.name === gds.get('name') )[0] || this.gdsSet[0];
	}

	getCurrentName()
	{
		return this.name;
	}

	getCurrentIndex()
	{
		return this.index;
	}

	isApollo()
	{
		return this.name === 'apollo';
	}

	update(newState, gdsName = this.name)
	{
		this.gdsSet = this.gdsSet.map( gds => {

			if (gds.get('name') === (gdsName))
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

	getGds(gdsName)
	{
		return this.gdsSet.filter( gds => gds.get('name') === gdsName )[0];
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
	}

	_getActiveTerminal()
	{
		return this.getCurrent().getActiveTerminal();
	}

	changeActive(index)
	{
		const terminal = this._getActiveTerminal();

		if (typeof terminal !== 'undefined')
		{
			terminal.context.classList.remove('activeWindow');
		}

		this.update({curTerminalId : index}); // change current terminal
		this._getActiveTerminal().context.classList.add('activeWindow');

		// return this.getActiveTerminal().context; // for focus
	}

	runCommand(command)
	{
		const terminal = this._getActiveTerminal();

		if (typeof terminal === 'undefined')
		{
			alert('Please select terminal first');
			return Promise.reject('Please select terminal first');
		}

		terminal.plugin.terminal.exec(command);
		return Promise.resolve();
	}
}