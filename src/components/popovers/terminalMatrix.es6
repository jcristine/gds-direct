import Dom 			 	from '../../helpers/dom.es6';
import ButtonPopOver	from '../../modules/buttonPopover.es6';
import {CHANGE_MATRIX} from "../../actions";

let cellObj = [];

const ACTIVE_CLASS = 'bg-purple';

export default class Matrix extends ButtonPopOver
{
	constructor( params )
	{
		super( params );

		this.popContent = Dom('table.matrix-table');
		this.makeTrigger();
	}

	build()
	{
		[0, 1, 2, 3]
			.map( this._rows )
			.map( this._cells, this )
			.map( this._toTable, this );
	}

	_rows()
	{
		cellObj.push([]);
		return document.createElement('tr');
	}

	_cells( row, rIndex )
	{
		[0, 1, 2, 3].map( cIndex => row.appendChild( this._cell( rIndex, cIndex) ) );
		return row;
	}

	_cell( rIndex, cIndex)
	{
		const cell = document.createElement('td');

		cellObj[rIndex].push(cell);

		cell.addEventListener( 'click', () => {
			this.popover.close();

			CHANGE_MATRIX({
				rows 	: rIndex,
				cells	: cIndex
			})
		});

		cell.addEventListener('mouseover', () => {

			for ( let i = 0; i <= rIndex; i++ )
			{
				cellObj[i].slice(0, cIndex + 1 ).forEach( cell => cell.classList.toggle(ACTIVE_CLASS) )
			}

		});

		cell.addEventListener('mouseleave', () => {
			[].forEach.call( this.popContent.querySelectorAll( '.' + ACTIVE_CLASS) , cell => cell.classList.toggle(ACTIVE_CLASS) );
		});

		return cell;
	}

	_toTable( row )
	{
		this.popContent.appendChild( row );
	}
}