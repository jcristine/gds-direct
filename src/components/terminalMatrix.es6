import Dom			from '../helpers/dom.es6';
import Terminal 	from '../modules/terminal.es6';
import Component 	from '../modules/component.es6';

const gdsSession	= [];
const stringify 	= JSON.stringify;
let cells 			= [];

class DimensionCalculator
{
	constructor( context )
	{
		this.context = context;
	}

	calculate(rowCount, cellCount)
	{
		return {
			height		: Math.floor(this.context.clientHeight / rowCount),
			width 		: Math.floor(this.context.clientWidth / cellCount),
			char		: this.getLineHeight()
		}
	}

	getLineHeight()
	{
		const  { width, height }	= ( this.cursor || this.getCursor() ).getBoundingClientRect();
		return { width, height };
	}

	getCursor()
	{
		const tempCmd 		= Dom('div.terminal temp-terminal');
		this.context.appendChild( tempCmd );
		tempCmd.innerHTML 	= '<div class="cmd"><span class="cursor">&nbsp;</span></div>';

		return this.cursor	= tempCmd.querySelector('.cursor');
	}
}

export default class TerminalsMatrix extends Component
{
	constructor( parent )
	{
		super('table.terminals-table');
		this.sizer = this.sizer || new DimensionCalculator( parent );
	}

	clear()
	{
		this.context.innerHTML = '';
		return this;
	}

	makeCells(rowCount,  cellCount)
	{
		const makeRow 	= () => {
			const row = Dom('tr');
			this.context.appendChild( row );
			return row;
		};

		const makeCells = row => {
			return [ ...new Array(cellCount) ]
				.map( () => {
					const cell = Dom('td.terminal-cell');
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
		const {hideMenu, buffer, gdsObj} = this.props;

		const rowCount 	= gdsObj.matrix.rows 	+ 1;
		const cellCount = gdsObj.matrix.cells 	+ 1;

		gdsSession[gdsObj['name']] = gdsSession[gdsObj['name']] || [];

		const state = {
			gds			: gdsObj['name'],
			dimensions 	: this.sizer.calculate(rowCount, cellCount),
			hideMenu	: hideMenu
		};

		const needToRender = this.renderIsNeeded( state );

		if ( needToRender )
		{
			// console.warn('need to rerender');

			this.context.innerHTML 	= '';
			this.context.className 	= 't-matrix-w-' + ( cellCount - 1 );
			this.curTerminalId		= undefined;

			this.state = state;

			cells = this.makeCells( rowCount, cellCount );

			// console.log('cells', cells);

			cells.forEach( (cell, index) => {

				const props = {
					name 	: index,
					gds		: gdsObj['name'],
					buffer	: buffer && buffer[gdsObj['name']] ? buffer[gdsObj['name']]['terminals'][index + 1] : ''
				};

				this.getTerminal( gdsObj['name'], index, props )
					.reattach( cell, this.sizer.calculate(rowCount, cellCount) ); //sometimes calculate doesn't get actual parent context dimensions
			});
		}

		if ( gdsObj.curTerminalId !== this.curTerminalId )
		{
			if (this.curTerminalId !== undefined && cells[this.curTerminalId])
				cells[this.curTerminalId].classList.remove('activeWindow');

			if (cells[gdsObj.curTerminalId])
				cells[gdsObj.curTerminalId].classList.toggle('activeWindow');

			this.curTerminalId = gdsObj.curTerminalId;
		}
	}
}