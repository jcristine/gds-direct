import Dom			from '../helpers/dom.es6';
import Terminal 	from '../modules/terminal.es6';
import Component 	from '../modules/component.es6';

const gdsSession	= [];
const stringify 	= JSON.stringify;
// let cells 			= [];

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

	makeCells( {rows, cells} , dimensions)
	{
		let cellsDom = [];

		Array.apply(null, {length: rows + 1 })
			.map( () => Dom('tr') )
			.map( tr => {

				Array.apply(null, {length: cells + 1}).map( () => {

					const cell = Dom('td.terminal-cell', {
						style : `width : ${dimensions.width}px; max-height : ${dimensions.height}px; height: ${dimensions.height}px`
					});

					tr.appendChild(cell);
					cellsDom.push( cell );
				});

				this.context.appendChild( tr );
			});

		return cellsDom;
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
		const {hideMenu, gdsObj, pqToShow, getDimensions, width, fontSize, curTd} = this.props;

		const state = {
			gds			: gdsObj['name'],
			matrix		: gdsObj.matrix,
			hideMenu	: hideMenu,
			pqToShow	: pqToShow,
			width,
			fontSize
		};

		const needToRender = this.renderIsNeeded( state );

		if ( needToRender )
		{
			gdsSession[gdsObj['name']] = gdsSession[gdsObj['name']] || [];

			this.context.innerHTML 	= '';

			const dimensions = getDimensions();
			this.state = state;

			this.makeCells(gdsObj.matrix, dimensions).forEach( (cell, index) => {

				const props = {
					name 	: index,
					gds		: gdsObj['name'],
					buffer	: gdsObj['buffer'] ? gdsObj['buffer']['terminals'][index + 1] : ''
				};

				this
					.getTerminal( gdsObj['name'], index, props )
					.reattach( cell, dimensions,  gdsObj.curTerminalId === index);
			});
		}

		if (this.curTerminal !== curTd)
		{
			if (this.curTerminal !== undefined)
			{
				this.getTerminal( gdsObj['name'], this.curTerminal ).context.parentNode.classList.remove('activeWindow');
			}

			this.getTerminal( gdsObj['name'], curTd ).context.parentNode.classList.add('activeWindow');
		}

		this.curTerminal = curTd;
	}
}