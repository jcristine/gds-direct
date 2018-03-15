'use strict';

import {makePages} from '../helpers/helpers.es6';

export default class Pagination
{
	constructor()
	{
		this.cache 	= [];
		this.output	= '';
		this.page 	= 0;
	}

	bindOutput(output, rows = 0, cols = 0)
	{
		this.page 	= 0;
		this.output = output;
		this.cache 	= makePages( output, rows, cols );

		return this;
	}

	next()
	{
		if (this.cache.length && this.page < this.cache.length)
			this.page++;

		return this;
	}

	prev()
	{
		if (this.page > 0 )
			this.page--;

		return this;
	}

	print()
	{
		return this.cache[ this.page ] || '‡NOTHING TO SCROLL‡';
	}

	printAll()
	{
		return this.output;
	}
}