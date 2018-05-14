import Dom from '../helpers/dom';

export default class Component
{
	constructor(selector, params)
	{
		this.context 	= Dom( selector, params);
		this.observers 	= [];
	}

	addToObserve( component )
	{
		this.observers.push( component );
		return this;
	}

	observe(el)
	{
		if (!el)
		{
			return this;
		}

		if ( el.constructor === Array )
		{
			el.map(obj => this.observe(obj));
		} else
		{
			this.context.appendChild(el.getContext());
			this.observers.push( el );
		}

		return this;
	}

	append(el)
	{
		if ( el.constructor === Array )
		{
			el.map(obj => this.append(obj));
		}
		else
		{
			if (!el)
				return '';

			if ( !(el instanceof Element) )
			{
				this.context.appendChild(el.getContext());
			} else
			{
				this.context.appendChild(el);
			}
		}

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

	setState(state)
	{
		if ( JSON.stringify(state) === JSON.stringify(this.state) )
		{
			// console.log("IS EQUAL", state, this.state);
			return false;
		}

		this.state = {...state};

		return true;
	}

	mount()
	{
	}

	render({...state})
	{
		if (state)
		{
			this.mount(state); //only once
			this.mount = () => {};
		}

		if ( typeof this._renderer === 'function' )
		{
			const newState = this.setState(state); // if child has no state call parent

			// console.log(newState, this);

			if (newState)
			{
				this._renderer(state);
			}
		}

		this.observers.map( component => component.render(state) );

		return this.context;
	}
}