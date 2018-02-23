import Dom 			 	from '../../helpers/dom.es6';
import ButtonPopOver	from '../../modules/buttonPopover.es6';
import {ADD_WHIDE_COLUMN, CHANGE_MATRIX} from "../../actions";
import {MAX_ROWS} from "../../constants";
import {getStorageMatrix} from "../../helpers/helpers";

let cellObj = [];

const ACTIVE_CLASS = 'bg-purple';

export default class Matrix extends ButtonPopOver
{
	constructor( params )
	{
		super( params );

		this.popContent = Dom('div');
		this.makeTrigger();
	}

	build()
	{
		const button 	= new Dom('div.bg-white matrix-column' , {
			onclick : ADD_WHIDE_COLUMN
		});

		const table 	= new Dom('table.matrix-table');
		// window.open('http://cms3.artur.snx702.dyninno.net/leadInfo?rId=6173322#terminalNavBtntab','winname',"directories=0,titlebar=0,toolabar=0,location=0,stataus=0,menaubar=0,scrollbars=no,resizable=no,widtah=400,aheight=350");

		[0, 1, 2, 3]
			.map( this._rows )
			.map( this._cells, this )
			.map( tr => {
				table.appendChild(tr)
			});

		const {rows, cells} = getStorageMatrix();

		this._addColor(rows, cells, ACTIVE_CLASS);

		this.popContent.appendChild(
			button
		);

		this.popContent.appendChild(
			table
		);
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

	_cell(rIndex, cIndex)
	{
		const cell = document.createElement('td');

		cellObj[rIndex].push(cell);

		cell.addEventListener('click', () => {

			let cellsSelected = [];

			Array.apply(null, {length : rIndex + 1}).map( (y, yIndex) => {
				Array.apply(null, {length : cIndex + 1}).map( (x, xIndex) => cellsSelected.push(yIndex * MAX_ROWS + xIndex))
			});

			this.popover.close();

			this._addColor(rIndex, cIndex, ACTIVE_CLASS);

			const matrixProps = {
				rows 	: rIndex,
				cells	: cIndex,
				list	: cellsSelected
			};

			localStorage.setItem('matrix', JSON.stringify(matrixProps) );

			CHANGE_MATRIX(matrixProps)
		});

		cell.addEventListener('mouseover', () => this._addColor(rIndex, cIndex, ACTIVE_CLASS) );

		cell.addEventListener('mouseleave', () => {
			[].forEach.call( this.popContent.querySelectorAll('.' + ACTIVE_CLASS) , cell => cell.classList.remove(ACTIVE_CLASS) );
		});

		return cell;
	}

	_addColor(rIndex, cIndex, className)
	{
		for ( let i = 0; i <= rIndex; i++ )
		{
			cellObj[i].slice(0, cIndex + 1 ).forEach( cell => cell.classList.add(className) )
		}
	}
}