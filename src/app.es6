import ContainerMain					from './components/containerMain.es6';
import Requests							from './helpers/requests.es6';
import GdsSet 							from './modules/gds';
import {KEEP_ALIVE_REFRESH, AREA_LIST} 	from './constants.es6';

const apiData	= window.apiData || {};

const Container 	= new ContainerMain( apiData['htmlRootId'] || 'rootTerminal' );
// const mergeIntoNew 	= ( current, extendWith ) => Object.assign({}, current, extendWith);

const Gds = GdsSet.getList();

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

		//setInterval( () => Requests.get(`terminal/keepAlive`, true), KEEP_ALIVE_REFRESH );
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
		const key = this.isGdsApollo() ? 'S': '¤';
		return AREA_LIST.map( char => key + char );
	}

	getBuffer( gds, terminalId )
	{
		const buffer = apiData.buffer;

		if ( apiData && buffer && buffer.gds && buffer.gds[gds] )
			return buffer['gds'][gds]['terminals'][terminalId];

		return false;
	}

	getHistory()
	{
		return Requests.get(`terminal/lastCommands?rId=${apiData.rId}&gds=${this.getGds()}`, false);
	}

	purgeScreens()
	{
		Container.purgeScreens( this.getGds() );
		Requests.get(`terminal/clearBuffer`, true);
	}

	switchTerminals(gds, index, props)
	{
		var terminal = Container.getTerminal(gds, index, props);

		if (terminal.plugin !== null)
		{
			terminal.plugin.terminal.focus();
		} else {
			terminal.context.click()
		}
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

	isGdsApollo()
	{
		return this.getGds() === 'apollo';
	}

	isLanguageApollo()
	{
		if ( !apiData.prod && window.apiData.hasPermissions() )
		{
			return this.getLanguage() === 'APOLLO'; //when time comes uncomment
		} else {
			return this.isGdsApollo();
		}
	}

	action( action, params )
	{
		switch (action)
		{
			case 'CHANGE_GDS':
				// save prev gds state
				Gds[ this.getGds() ] = this.state.gdsObj;

				// replace gds params = index
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
				this.change({
					gdsObj : Object.assign( {}, this.state.gdsObj, { activeTerminal : params } )
				});
			break;

			case 'CHANGE_PCC' :
				const area = this.getAreaIndex();

				const pcc = Object.assign({}, this.state.gdsObj.pcc, {[area] : params});
				const gds = Object.assign({}, this.state.gdsObj, {pcc : pcc});

				this.change({ gdsObj : gds });
			break;

			case 'UPDATE_CUR_GDS' :
				this.state.gdsObj.pcc[ params.sessionIndex ] = params.lastPcc;

				this.change({
					gdsObj : Object.assign( {}, this.state.gdsObj, params )
				});
			break;

			case 'PQ_MODAL_SHOW' :
				if (!this.state.gdsObj.canCreatePq)
					return false;

				apiData.pqModal.show({
					canCreatePqErrors 	: this.state.gdsObj.canCreatePqErrors,
					onClose				: () => this.action( 'CLOSE_PQ_WINDOW')
				}).then( () => {
					this.change({hideMenu: true});
				});
			break;

			case 'CLOSE_PQ_WINDOW' :
				this.change({ hideMenu: false});
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

		if (window.location.hash === '#terminalNavBtntab') // fixing bug where terminal freezes if i close pq popup while in other tab
		{
			Container.render( this.state );
		}
	}
}

window.TerminalState = new TerminalState();
window.TerminalState.change({}, '');

let resizeTimeout;

window.onresize = () => {

	if (resizeTimeout)
		clearInterval(resizeTimeout);

	resizeTimeout = setTimeout( () => window.TerminalState.change(), 50 );
};