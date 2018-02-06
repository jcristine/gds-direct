export class TerminalState
{
	constructor({permissions, requestId})
	{
		this.state = {
			language	: 'APOLLO',
			fontSize	: 1,
			hideMenu	: false,
			requestId	: requestId
		};

		this.permissions	= permissions;
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

	getRequestId()
	{
		return this.state.requestId;
	}

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