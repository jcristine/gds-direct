import ContainerMain					from './components/containerMain.es6';
import Requests							from './helpers/requests.es6';
import {KEEP_ALIVE_REFRESH, AREA_LIST} 	from './constants.es6';

const apiData	= window.apiData || {};
const saved		= localStorage.getItem('matrix');

const Container = new ContainerMain( apiData['htmlRootId'] || 'rootTerminal' );

const gdsSettings = {
	sessionIndex 	: 0,
	pcc				: {},
	matrix			: saved ? JSON.parse( saved ) : {rows : 1, cells : 1},
	activeTerminal	: null,
	canCreatePq		: false
};

const extendGds = name => ({
	name 			: name,
	sessionIndex 	: AREA_LIST.indexOf(apiData.settings['gds'][name]['area']),
	canCreatePq		: !!apiData.settings['gds'][name]['canCreatePq']
});

const Gds = {
	apollo	: Object.assign({}, gdsSettings, extendGds('apollo')),
	sabre	: Object.assign({}, gdsSettings, extendGds('sabre'))
};

class TerminalState
{
	constructor()
	{
		const curGds = apiData.settings.common['currentGds'] || 'apollo';

		this.state = {
			language		: 'APOLLO',
			fontSize		: 1,
			hideMenu		: false,
			gdsObj			: Gds[curGds]
		};

		setInterval( () => Requests.get(`terminal/keepAlive`, true), KEEP_ALIVE_REFRESH );
	}

	getMatrix()
	{
		return this.state.gdsObj.matrix;
	}

	getPcc()
	{
		return this.state.gdsObj.pcc;
	}

	getActiveTerminal()
	{
		return this.state.gdsObj['activeTerminal'];
	}

	getGds()
	{
		return this.state.gdsObj['name'];
	}

	getLanguage()
	{
		return this.state['language'];
	}

	getAreaIndex()
	{
		return this.state.gdsObj['sessionIndex'];
	}

	getSessionAreaMap()
	{
		const key = this.getGds() === 'apollo' ? 'S': '¤';
		return AREA_LIST.map( char => key + char );
	}

	getBuffer( gds, terminalId )
	{
		const buffer = apiData.buffer;

		if ( apiData && buffer && buffer.gds && buffer.gds[gds] )
			return buffer['gds'][gds]['terminals'][terminalId];

		return false;
	}

	purgeScreens()
	{
		Container.purgeScreens( this.getGds() );
		Requests.get(`terminal/clearBuffer`, true);
	}

	execCmd( params )
	{
		const term = this.getActiveTerminal();

		if (term)
		{
			window.activePlugin.hiddenBuff = params;
			window.activePlugin.loopCmdStack();
		}

		return false;
	}

	isLanguageApollo()
	{
		return this.getLanguage() === 'APOLLO';
	}

	action( action, params )
	{
		switch (action)
		{
			case 'CHANGE_GDS':

				// replace the gds and save
				Gds[ this.getGds() ] = this.state.gdsObj;

				this.change({
					gds		: params,
					gdsObj 	: Gds[params]
				});
			break;

			case 'CHANGE_SESSION_AREA' :
				this.change({
					gdsObj : Object.assign( {}, this.state.gdsObj, {sessionIndex : params} )
				});
			break;

			case 'CHANGE_SESSION_BY_MENU' :
				const command	= this.getSessionAreaMap()[params];
				this.getActiveTerminal().exec( command );
			break;

			case 'CHANGE_MATRIX':

				localStorage.setItem('matrix', JSON.stringify( params ) );

				this.change({
					gdsObj : Object.assign( {}, this.state.gdsObj, {matrix : params} )
				});

			break;

			case 'CHANGE_ACTIVE_TERMINAL' :
				// TODO :: optimize
				this.change({
					gdsObj : Object.assign( {}, this.state.gdsObj, { activeTerminal : params } )
				});
			break;

			case 'CHANGE_PCC' :
				const area = this.getAreaIndex();

				const pcc = Object.assign({}, this.state.gdsObj.pcc, {
					[area] : params
				});

				const gds = Object.assign({}, this.state.gdsObj, {pcc : pcc});

				this.change({ gdsObj : gds });
			break;

			case 'CAN_CREATE_PQ' :

				// OPTIMIZE
				this.change({
					gdsObj : Object.assign( {}, this.state.gdsObj, params )
				});

				return false;
			break;

			case 'PQ_MODAL_SHOW' :
				if (!this.state.gdsObj.canCreatePq)
					return false;

				apiData.pqModal.show({
					canCreatePqErrors 	: this.state.gdsObj.canCreatePqErrors,
					onClose				: () => this.change( {hideMenu: false} )
				}).then( () => this.change({hideMenu: true}) );

			break;

			case 'DEV_CMD_STACK_RUN' :
				this.execCmd( params );
				return false;
			break;
		}
	}

	change( params = {} )
	{
		this.state = Object.assign( {}, this.state, params );
		Container.render( this.state );
	}
}

window.TerminalState = new TerminalState();
window.TerminalState.change({}, '');

let resizeTimeout;

window.onresize = () => {

	if (resizeTimeout)
		clearInterval(resizeTimeout);

	resizeTimeout = setTimeout( () => window.TerminalState.change(), 150 );
};