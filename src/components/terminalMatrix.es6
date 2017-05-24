import Dom			from '../helpers/dom.js6';
import Terminal 	from '../modules/terminal.js6';

const gdsSession	= [];
const stringify 	= JSON.stringify;

class TerminalsMatrix
{
	static clear()
	{
		this.context.innerHTML = '';
		return this;
	}

	static createTempTerminal()
	{
		const tempCmd 		= Dom('div.terminal temp-terminal');
		tempCmd.innerHTML 	= '<div class="cmd"><span class="cursor">&nbsp;</span></div>';

		this.context.parentNode.appendChild( tempCmd );
		return tempCmd;
	}

	static getLineHeight()
	{
		this.tempTerminal = this.tempTerminal || this.createTempTerminal();

		const  { width, height } = this.tempTerminal.querySelector('.cursor').getBoundingClientRect();
		return { width, height };
	}

	static getDimension( rowCount, cellCount )
	{
		const parent = this.context.parentNode;

		return {
			height		: Math.floor(parent.clientHeight / rowCount),
			width 		: Math.floor(parent.clientWidth / cellCount),
			char		: this.getLineHeight()
		}
	}

	static makeCells(rowCount,  cellCount)
	{
		const makeRow 	= () 	=> {
			const row = Dom('tr');
			this.context.appendChild( row );
			return row;
		};

		const makeCells = row 	=> {

			return [ ...new Array(cellCount) ]

				.map( () => {
					const cell = Dom('td.v-middle');
					row.appendChild(cell);
					return cell;
				});
		};

		const cells 	= [ ...new Array(rowCount) ].map( makeRow ).map( makeCells );

		this.resCells	= [].concat.apply( [], cells ); // join arrays into one

		this.context.className = 'terminals-table ' + 't-matrix-w-' + ( cellCount - 1 );

		return this;
	}

	static appendTerminals({sessionIndex, gds, activeTerminal}, needToRender)
	{
		gdsSession[ gds ] = gdsSession[ gds ] || [];

		this.resCells.forEach(( cell, index ) => {

			const isActive = activeTerminal && index === activeTerminal.name();

			cell.classList.toggle('active', isActive);

			if (needToRender)
			{
				gdsSession[gds][index] = gdsSession[gds][index] || new Terminal({
						name 			: index,
						sessionIndex	: sessionIndex,
						gds				: gds,
						buffer			: window.TerminalState.getBuffer(gds, index + 1),
						dimensions		: this.props.dimensions
					});

				// draw or redraw
				gdsSession[ gds ][index].reattach( cell , this.props.dimensions );
			}
		});
	}

	static purgeScreens( gds )
	{
		gdsSession[ gds ].forEach( terminal => terminal.clear() );
	}

	static render( params )
	{
		let {rows : rowCount, cells : cellCount} = params.cellMatrix;

		rowCount++;
		cellCount++;

		const props = {
			gds			: params.gds,
			dimensions 	: this.getDimension(rowCount, cellCount),
			// wrapWidth	: Container.context.clientWidth
			wrapWidth	: params.containerWidth
		};

		const needToRender = stringify(props) !== stringify(this.props);

		if ( needToRender )
		{
			// console.log("RERENDER ALL");

			this.props = props;
			this.clear().makeCells( rowCount, cellCount );
		}

		this.appendTerminals( params, needToRender );
	}
}

TerminalsMatrix.context = Dom('table.terminals-table');
TerminalsMatrix.props 	= {
	gds			: '',
	dimensions 	: {}
};

export default TerminalsMatrix