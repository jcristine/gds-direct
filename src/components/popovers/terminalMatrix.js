'use strict';

import Drop 	from 'tether-drop';

let popContext;

//function popover()
//{
//}

class Matrix
{
	constructor( params )
	{
		this.context 			= document.createElement('table');
		this.context.className	= 'matrix-table';

		this.settings = params;

		popContext = new Drop({
			target		: params['button'],
			content		: this.getContext(),
			classes		: 'drop-theme-arrows',
			position	: 'bottom right',
			openOn		: 'click'
		});
	}
	
	makeRow( rowIndex )
	{
		let row 		= document.createElement('tr');
		row.className 	= rowIndex + '-tr';

		this.context.appendChild( row );

		[ 0, 1, 2, 3 ].map((index) => {
			return row.appendChild( this.makeCell( index, rowIndex ) )
		});
	}
	
	makeCell( cellIndex, rowIndex )
	{
		let cell 		= document.createElement('td');
		cell.className 	= cellIndex + '-td';

		cell.addEventListener( 'click', () => {
			popContext.close();
			this.settings.onClick( rowIndex, cellIndex );
		});

		return cell;
	}
	
	build()
	{


		[ 0, 1, 2, 3].map( this.makeRow , this )
	}

	getContext()
	{console.log(' build ', this.context);
		return this.context;
	}
}

export default Matrix;