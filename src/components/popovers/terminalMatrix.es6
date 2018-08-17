import Dom 			 	from '../../helpers/dom.es6';
import {ADD_WHIDE_COLUMN, CHANGE_MATRIX} from "../../actions/settings";
import {MAX_ROWS} from "../../constants";
import {getStorageMatrix} from "../../helpers/helpers";
import {ButtonPopover} from "../../modules/dom/buttonPopover";
import {getStore} from "../../store";

let cellObj = [];

const HOVER_CLASS 	= 'bg-purple';
const ACTIVE_CLASS 	= 'bg-info';

export default class Matrix extends ButtonPopover
{
	constructor()
	{
		super({icon : '<i class="fa fa-th-large"></i>'});
	}

	getPopContent()
	{
		this.build();
		return this.popContent
	}

	build()
	{
		this.wideButton	= Dom('div.bg-white matrix-column ' , {
			onclick : (e) => {
				e.target.classList.toggle(ACTIVE_CLASS);
				e.target.classList.toggle('bg-white');
				ADD_WHIDE_COLUMN();
			}
		});

		this._renderer();

		const table 	= new Dom('table.matrix-table');

		[0, 1, 2, 3]
			.map( this._rows )
			.map( this._cells, this )
			.map( tr => {
				table.appendChild(tr)
			});

		const {rows, cells} = getStorageMatrix();

		this._addColor(rows, cells, ACTIVE_CLASS);

		this.popContent.attach(
			this.wideButton
		);

		this.popContent.attach(
			table
		);
	}

	_rows()
	{
		cellObj.push([]);
		return Dom('tr');
	}

	_cells( row, rIndex )
	{
		[0, 1, 2, 3].map( cIndex => row.appendChild( this._cell( rIndex, cIndex) ) );
		return row;
	}

	_cell(rIndex, cIndex)
	{
		const selectMatrix = () => {
			// this.popover.close();

			const makeArray 	= length => Array.apply(null, {length});
			const arrayByIndex 	= (yIndex) => (x, xIndex) => yIndex * MAX_ROWS + xIndex;
			const mergeIntoOne 	= (part, collection) => [...part, ...collection];

			const cellsSelected = makeArray(rIndex + 1)
				.map((y, yIndex) => makeArray(cIndex + 1).map(arrayByIndex(yIndex)))
				.reduce(mergeIntoOne);

			this._removeClass(ACTIVE_CLASS);
			this._addColor(rIndex, cIndex, ACTIVE_CLASS);

			const matrixProps = {
				rows 	: rIndex,
				cells	: cIndex,
				list	: cellsSelected
			};

			localStorage.setItem('matrix', JSON.stringify(matrixProps) );

			CHANGE_MATRIX(matrixProps)
		};

		const cell = Dom('td.matrix-p-row', {onclick : selectMatrix});

		cell.addEventListener('mouseover', 	() => this._addColor(rIndex, cIndex, HOVER_CLASS) );
		cell.addEventListener('mouseleave', () => this._removeClass(HOVER_CLASS) );

		cellObj[rIndex].push(cell);

		return cell;
	}

	_addColor(rIndex, cIndex, className)
	{
		for ( let i = 0; i <= rIndex; i++ )
		{
			cellObj[i].slice(0, cIndex + 1 ).forEach( cell => cell.classList.add(className) )
		}
	}

	_removeClass(className)
	{
		[].forEach.call( this.popContent.context.querySelectorAll('.matrix-p-row.' + className) , cell => cell.classList.remove(className) );
	}

	_renderer()
	{
		if (this.wideButton) {
			if (getStore().app.getGds().get('hasWide')) {
				this.wideButton.classList.add(ACTIVE_CLASS);
				this.wideButton.classList.remove('bg-white');
			} else {
				this.wideButton.classList.remove(ACTIVE_CLASS);
				this.wideButton.classList.add('bg-white');
			}
		}
	}
}