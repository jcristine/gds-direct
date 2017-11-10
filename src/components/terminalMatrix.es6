import Dom			from '../helpers/dom.es6';
import Terminal 	from '../modules/terminal.es6';
import Component 	from '../modules/component.es6';

const gdsSession	= [];
const stringify 	= JSON.stringify;
let cells 			= [];

export default class TerminalsMatrix extends Component
{
	constructor()
	{
		super('table.terminals-table');
	}

	clear()
	{
		this.context.innerHTML = '';
		return this;
	}

	makeCells(rowCount, cellCount, dimensions)
	{
		const makeRow 	= () => {
			const row = Dom('tr');
			this.context.appendChild( row );
			return row;
		};

		const makeCells = row => {
			return [ ...new Array(cellCount) ]
				.map( () => {
					const cell = Dom('td.terminal-cell', {style : `width : ${dimensions.width}px; max-height : ${dimensions.height}px; height: ${dimensions.height}px`});
					row.appendChild(cell);
					return cell;
				});
		};

		return [].concat.apply( [], [ ...new Array(rowCount) ].map( makeRow ).map( makeCells ) );
	}

	purgeScreens( gds )
	{
		gdsSession[ gds ].forEach( terminal => terminal.clear() );
	}

	getTerminal(gds, index, props)
	{
		return gdsSession[gds][index] = gdsSession[gds][index] || new Terminal( props );
	}

	renderIsNeeded( state )
	{
		if (!this.state)
			return true;

		return stringify(state) !== stringify(this.state);
	}

	_renderer()
	{
		const {hideMenu, gdsObj, pqToShow, getDimensions, width} = this.props;

		const state = {
			gds			: gdsObj['name'],
			matrix		: gdsObj.matrix,
			hideMenu	: hideMenu,
			pqToShow	: pqToShow,
			width
		};

		const needToRender = this.renderIsNeeded( state );

		if ( needToRender )
		{
			gdsSession[gdsObj['name']] = gdsSession[gdsObj['name']] || [];
			const rowCount 	= gdsObj.matrix.rows 	+ 1;
			const cellCount = gdsObj.matrix.cells 	+ 1;

			// console.warn('need to rerender!!');

			this.context.innerHTML 	= '';

			const dimensions = getDimensions();
			this.state = state;

			cells = this.makeCells(rowCount, cellCount, dimensions);

			cells.forEach( (cell, index) => {

				const props = {
					name 	: index,
					gds		: gdsObj['name'],
					buffer	: gdsObj['buffer'] ? gdsObj['buffer']['terminals'][index + 1] : ''
				};

				this
					.getTerminal( gdsObj['name'], index, props )
					.reattach( cell, dimensions )
			});
		}

		if (cells[this.curTerminalId])
			cells[this.curTerminalId].classList.remove('activeWindow');

		if (cells[gdsObj.curTerminalId])
			cells[gdsObj.curTerminalId].classList.add('activeWindow');

		this.curTerminalId = gdsObj.curTerminalId;
	}
}