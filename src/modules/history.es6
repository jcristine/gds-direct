import {GET_HISTORY} from "../actions/settings";

const promises = {};
const commands = {};

export default function History( gds = 'apollo' )
{
	let pos 	= false;
	let length	= 0;

	commands[gds] 	= commands[gds] || [];

	const askServer = () => GET_HISTORY();
	const getData 	= () => {
		// if ( promises[gds] && !pos )
		// 	pos = commands[gds].length - 1;

		// this will ask server only once per GDS
		promises[gds] = promises[gds] || new Promise( resolve => {

			askServer()
				.then( response => {
					commands[gds] 	= response.data;
					pos				= commands[gds].length;
					length			= commands[gds].length;
				})
				.then( resolve );
		});

		return promises[gds];
	};

	const checkIfListUpdated = () => {

		if ( commands[gds] ) // when new commands were executed update position
		{
			if (commands[gds].length !== length)
			{
				length 	= commands[gds].length;
				pos 	= length;
			}
		}
	};

	return {

		add	: function ( cmd )
		{
			if ( commands[gds] )
				commands[gds].push( cmd );
		},

		next: function()
		{
			if ( length === 0 )
				return getData();

			if (pos < commands[gds].length )
				++pos;

			checkIfListUpdated();

			return getData().then( () => commands[gds][pos] || '' );
		},

		previous: function()
		{
			checkIfListUpdated();

			return getData().then( () => {
				if (pos > 0)
					--pos;

				return commands[gds][pos];
			});
		}
	}
}