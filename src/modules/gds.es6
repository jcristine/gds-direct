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

const getGdsData = (name, settings = {}) => {

	return mergeIntoNew( defaults, {

		name 			: name,
		sessionIndex 	: AREA_LIST.indexOf( settings['area'] ),

		// canCreatePq		: !!settings['canCreatePq'] // for DEV
		// canCreatePq		: !window.TerminalState.hasPermissions() ? false : !!settings['canCreatePq'],

		canCreatePq		: false
	})

};

export default class GdsSet
{
	static getList( list, loadedGds )
	{
		this.gdsList = list.map( name => getGdsData(name, loadedGds[name]) );

		const res = {};

		this.gdsList.forEach( gds => {
			res[gds.name] = gds;
		});

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