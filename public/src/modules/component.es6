import Dom from '../helpers/dom.es6';

/**
 * @see https://stackoverflow.com/a/11616993/2750743
 * needed when jquery version is >2.1.4
 */
let jsonNoCirc = data => {
	const getCircularReplacer = () => {
		const seen = new WeakSet();
		return (key, value) => {
			if (typeof value === "object" && value !== null) {
				if (seen.has(value)) {
					return;
				}
				seen.add(value);
			}
			return value;
		};
	};
	return JSON.stringify(data, getCircularReplacer());
};

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

	attach( elements )
	{
		if (!Array.isArray(elements)) {
			elements = [elements];
		}
		for (let element of elements) {
			if (element instanceof HTMLElement) {
				this.context.appendChild( element );
			} else {
				this.context.appendChild( element.getContext() );
			}
		}
		return this;
	}

	getContext()
	{
		return this.context;
	}

	setState(state)
	{
		if ( jsonNoCirc(state) === jsonNoCirc(this.state) )
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