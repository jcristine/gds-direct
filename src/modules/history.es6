'use strict';

import Requests	from '../helpers/requests.es6';

function History( gds = 'apollo')
{
	const name 	= 'history';
	const size 	= 60;

	let enabled 		= true;

	let storage_key 	= '';

	if (typeof name === 'string' && name !== '')
	{
		storage_key = name + '_';
	}

	storage_key += 'commands';

	let data 		= [];
	// let promise 	= new Promise();


	console.log('go');

	function getData()
	{
		console.log('getData');

		return promise || function ()
		{
			let promise = Requests.get(`terminal/lastCommands?rId=${apiData.rId}&gds=${gds}`, false).then( response => {
				console.log('response', response.data);
				this.state.history = response.data
			});
		}
	}

	// Requests.get(`terminal/lastCommands?rId=${apiData.rId}&gds=${this.getGds()}`, false).then( (response) => {
	// 	this.state.history = response.data
	// });

	// let data = window.TerminalState.history || [];
	// console.log('!!!!!!')

	// if (memory)
	// {
	// data = [];
	// }

	// else
	// {
	// 	data = $.Storage.get(storage_key);
	// 	data = data ? $.parseJSON(data) : [];
	// }

	let pos = data.length - 1;

	return {

		append: function(item)
		{
			if (enabled)
			{
				if (data[data.length - 1] !== item)
				{
					data.push(item);

					if (size && data.length > size)
					{
						data = data.slice(-size);
					}

					pos = data.length - 1;

					// if (!memory)
					// {
					// 	$.Storage.set(storage_key, JSON.stringify(data));
					// }
				}
			}
		},

		set: function(new_data)
		{
			if (new_data instanceof Array)
			{
				data = new_data;

				// if (!memory)
				// {
				// 	$.Storage.set(storage_key, JSON.stringify(data));
				// }
			}
		},

		data: function()
		{
			return data;
		},

		reset: function()
		{
			pos = data.length - 1;
		},

		last: function()
		{
			return data[data.length - 1];
		},

		end: function()
		{
			return pos === data.length - 1;
		},

		position: function()
		{
			return pos;
		},

		current: function()
		{
			return data[pos];
		},

		next: function()
		{
			if (pos < data.length - 1)
			{
				++pos;
			}

			if (pos !== -1)
			{
				return data[pos];
			}
		},

		previous: function()
		{
			console.log('previous');

			let old = pos;

			// if (pos > 0)
			// {
			// 	--pos;
			// }
			//
			// if (old !== -1)
			// {
				return getData()[pos];
			// }
		},

		clear: function()
		{
			data = [];
			this.purge();
		},

		enabled: function()
		{
			return enabled;
		},

		enable: function()
		{
			enabled = true;
		},

		purge: function()
		{
			// if (!memory)
			// {
			// 	$.Storage.remove(storage_key);
			// }
		},

		disable: function()
		{
			enabled = false;
		}
	}
}

const h =  new History();

console.log( h );

export default h;