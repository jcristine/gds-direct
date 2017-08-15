import ContainerMain	from './components/containerMain.es6';
import {get, setLink}	from './helpers/requests.es6';
import GdsSet 			from './modules/gds';
import {AREA_LIST, GDS_LIST} from './constants.es6';

let Container, Gds;

class Terminal
{
	constructor( params )
	{
		Gds = GdsSet.getList( GDS_LIST, params.settings.gds );

		setLink( params['commandUrl'] );

		const { permissions, buffer, openPqModal, requestId } = params;

		window.TerminalState = new TerminalState({
			curGds 		: Gds[params.settings.common['currentGds'] || 'apollo'],
			permissions, buffer, openPqModal, requestId
		});

		Container = new ContainerMain( params['htmlRootId'] || 'rootTerminal' );
		window.TerminalState.change({}, '');
	}
}


export class TerminalState
{
	constructor( params )
	{
		this.state = {
			language	: 'APOLLO',
			fontSize	: 1,
			hideMenu	: false,
			gdsObj		: params.curGds,
			buffer		: params.buffer,
			requestId	: params.requestId
		};

		this.permissions	= params.permissions;
		this.openPqModal	= params.openPqModal;

		this.buffer = {
			gds : {}
		};

		if ( params.buffer && params.buffer.gds )
			this.state.buffer = params.buffer.gds;
	}

	showPqModal()
	{
		return this.openPqModal({
			canCreatePqErrors 	: this.state.gdsObj.canCreatePqErrors,
			onClose				: () => this.action( 'CLOSE_PQ_WINDOW')
		})
	}

	hasPermissions()
	{
		return this.permissions;
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

	clearTerminal()
	{
		window.activePlugin.purge();
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

	getHistory()
	{
		return get(`terminal/lastCommands?rId=${this.state.requestId}&gds=${this.getGds()}`, false);
	}

	purgeScreens()
	{
		Container.purgeScreens( this.getGds() );
		get(`terminal/clearBuffer`, true);
	}

	switchTerminals(gds, index, props)
	{
		const terminal = Container.getTerminal(gds, index, props);

		if (terminal.plugin !== null)
			return terminal.plugin.terminal.focus();

		terminal.context.click();
	}

	execCmd( commands )
	{
		const term = this.getActiveTerminal();

		if (term)
			term.exec( commands );

		return false;
	}

	getGdsList()
	{
		console.log( Gds );
	}

	isGdsApollo()
	{
		return this.getGds() === 'apollo';
	}

	isLanguageApollo()
	{
		return this.getLanguage() === 'APOLLO'; //when time comes uncomment
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
				this.execCmd( [command] );
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

			case 'UPDATE_CUR_GDS' :
				const pcc 	= Object.assign({}, this.state.gdsObj.pcc, { [ params['sessionIndex'] ] : params['lastPcc']} );
				const gds 	= Object.assign({}, this.state.gdsObj, {pcc : pcc});

				this.change({ gdsObj : Object.assign( {}, gds, params ) });
			break;

			case 'PQ_MODAL_SHOW' :
				if (!this.state.gdsObj.canCreatePq)
					return false;

				this.showPqModal()
					.then(() => this.change({hideMenu: true}))
					.catch(() => console.log(' catch !!!') );

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

window.terminal = Terminal;

let resizeTimeout;

window.onresize = () => {

	if (resizeTimeout)
		clearInterval(resizeTimeout);

	resizeTimeout = setTimeout( () => window.TerminalState.change(), 50 );
};