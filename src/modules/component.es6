import Dom from '../helpers/dom';

export default class Component
{
	constructor(selector, params)
	{
		this.context 	= Dom( selector, params);
		this.observers 	= [];
	}

	observe( component )
	{
		this.observers.push( component );
		this.context.appendChild( component.getContext() );
		return this;
	}

	addToObserve( component )
	{
		this.observers.push( component );
		return this;
	}

	append( component )
	{
		this.context.appendChild( component.getContext() );
		return this;
	}

	attach( element )
	{
		this.context.appendChild( element );
	}

	getContext()
	{
		return this.context;
	}

	mount()
	{
	}

	render( params )
	{
		if ( typeof this.stateToProps === 'function' )
		{
			const props = this.stateToProps(params);

			if ( JSON.stringify( props ) === JSON.stringify( this.props ) )
			{
				return '';
			}

			if (props)
			{
				this.props = JSON.parse( JSON.stringify(props) );
			}
		}
		else
		{
			this.props = params;
		}

		// console.log("!",this.props);

		if (this.props)
		{
			// console.log('IS')
			this.mount();
			this.mount = () => {};
		}

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