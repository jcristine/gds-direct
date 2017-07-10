import {AREA_LIST, GDS_LIST} 	from '../constants.es6';
import {mergeIntoNew} 			from '../helpers/helpers';

const saved		= localStorage.getItem('matrix');

const defaults	= {
	sessionIndex 	: 0,
	pcc				: {},
	matrix			: saved ? JSON.parse( saved ) : {rows : 1, cells : 1},
	activeTerminal	: null,
	canCreatePq		: false,
	history			: []
};

class Gds
{
	constructor( name )
	{
		this.data 		= this.extend( name );
	}

	extend( name )
	{
		const settings 	= window.apiData.settings['gds'][name] || {};

		if ( !window.apiData.hasPermissions() ) // AMADEUS FOR DEV
		{
		}

		return mergeIntoNew( defaults, {
			name 			: name,
			sessionIndex 	: AREA_LIST.indexOf( settings['area'] ),
			// canCreatePq		: !!settings['canCreatePq'] // for DEV
			canCreatePq		: !window.apiData.hasPermissions() ? false : !!settings['canCreatePq']
		})
	}

	getData()
	{
		return this.data;
	}
}

export default class GdsSet
{
	static getList()
	{
		const res = {};

		let list = GDS_LIST;

		if ( !window.apiData.hasPermissions() ) // AMADEUS FOR DEV
		{
			list = list.slice(0, -1);
		}

		this.gdsList = list.map( name => new Gds(name).getData() );

		this.gdsList.forEach( gds => { res[gds.name] = gds; });

		return res;
	}

	static getAreas( defaultsEvents )
	{
		return this.gdsList.map( gds => {

			return mergeIntoNew( defaultsEvents , {
				name 	: gds.name,
				list	: gds.name === 'sabre' ? AREA_LIST : AREA_LIST.slice(0, -1) //remove F
			});

		})
	}
}