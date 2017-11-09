export class TerminalState
{
	constructor({permissions, buffer, requestId})
	{
		this.state = {
			language	: 'APOLLO',
			fontSize	: 1,
			hideMenu	: false,
			buffer		: buffer,
			requestId	: requestId
		};

		this.permissions	= permissions;

		this.buffer = {
			gds : {}
		};

		if ( buffer && buffer.gds )
			this.state.buffer = buffer.gds;
	}

	setProvider( fn )
	{
		this.render = fn;
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

	getGds()
	{
		return this.state.gdsObj['name'];
	}

	getGdsObj()
	{
		return this.state.gdsObj;
	}

	getLanguage()
	{
		return this.state['language'];
	}

	getAreaIndex()
	{
		return this.state.gdsObj['sessionIndex'];
	}

	getRequestId()
	{
		return this.state.requestId;
	}

	/*execCmd( commands )
	{
		const term = this.getActiveTerminal();

		if (term)
			term.exec( commands );

		return false;
	}

	getGdsList()
	{
		// console.log( Gds );
		// return Gds;
	}*/

	isGdsApollo()
	{
		return this.getGds() === 'apollo';
	}

	isLanguageApollo()
	{
		return this.getLanguage() === 'APOLLO'; //when time comes uncomment
	}

	change( params = {} )
	{
		this.state = Object.assign( {}, this.state, params );

		this.render(
			this.state
		);
	}
}