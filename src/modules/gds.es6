import {AREA_LIST, GDS_LIST} 	from '../constants.es6';

const saved		= localStorage.getItem('matrix');

const defaults	= {
	sessionIndex 	: 0,
	pcc				: {},
	matrix			: saved ? JSON.parse( saved ) : {rows : 1, cells : 1},
	activeTerminal	: null,
	canCreatePq		: false,
	history			: [],
	curTerminalId	: undefined
};

const initGdsData = (name, settings = {}) => {

	const props = {
		name 			: name,
		sessionIndex 	: AREA_LIST.indexOf( settings['area'] ),
		// canCreatePq		: 1,
		canCreatePq		: false,
		list			: name === 'sabre' ? AREA_LIST : AREA_LIST.slice(0, -1)
	};

	return { ...defaults, ...props}
};

export default class GdsSet
{
	static makeList( savedGdsData )
	{
		return this.gdsList = GDS_LIST.map( name => initGdsData(name, savedGdsData[name]));
	}

	static getList()
	{
		return this.gdsList;
	}
}