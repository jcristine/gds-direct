import Dom from '../helpers/dom';

export default class Component
{
	constructor( selector )
	{
		this.context 	= Dom( selector );
		this.observers 	= [];
	}

	observe( component )
	{
		this.observers.push( component );
		this.context.appendChild( component.getContext() );
		return this;
	}

	append( component )
	{
		this.context.appendChild( component.getContext() );
		return this;
	}

	getContext()
	{
		return this.context;
	}

	// _renderer()
	// {
	// }

	render( params )
	{
		// console.log('render');
		// console.log( this._renderer );

		this.props = params;

		if ( typeof this._renderer === 'function' )
		{
			this._renderer();
		}

		this.observers.map( component => {
			component.render( this.props )
		});



		return this.context;
	}
}