import Dom			from '../helpers/dom.es6';
import Terminal 	from '../modules/terminal.es6';
import Component 	from '../modules/component.es6';

const gdsSession	= [];
const stringify 	= JSON.stringify;
let cells = [];

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

class TerminalsMatrix extends Component
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

	getSizes()
	{
		return this.sizer = this.sizer || new DimensionCalculator( this.getContext().parentNode );
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
					const cell = Dom('td.v-middle');
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
		const params 	= this.props;

		const rowCount 	= params.cellMatrix.rows 	+ 1;
		const cellCount = params.cellMatrix.cells 	+ 1;

		gdsSession[ params.gds ] = gdsSession[ params.gds ] || [];

		const state = {
			gds			: params.gds,
			dimensions 	: this.getSizes().calculate(rowCount, cellCount),
			wrapWidth	: params.containerWidth,
			hideMenu	: params.hideMenu
		};

		const needToRender = this.renderIsNeeded( state );

		if ( needToRender )
		{
			this.context.innerHTML 	= '';
			this.context.className 	= 't-matrix-w-' + ( cellCount - 1 );

			this.state = state;

			cells = this.makeCells( rowCount, cellCount );

			cells.forEach( ( cell, index ) => {

				const props = {
					name 			: index,
					sessionIndex	: params.sessionIndex,
					gds				: params.gds, // need for session
					buffer			: params.buffer ? params.buffer[params.gds]['terminals'][index + 1] : ''
				};

				this.getTerminal( params.gds, index, props )
					.reattach( cell, this.getSizes().calculate(rowCount, cellCount) ); //sometimes calculate doesn't get actual parent context dimensions
			});
		}

		cells.forEach( (cell, index) => {
			const isActive = params.activeTerminal && index === params.activeTerminal.name();
			cell.classList.toggle('active', isActive);
		});
	}
}

export default TerminalsMatrix