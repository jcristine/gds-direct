import Component 	from '../modules/component.es6';

export default class TerminalsMatrix extends Component
{
	constructor()
	{
		super('div.terminals-table matrix-row');
	}

	clear()
	{
		this.context.innerHTML = '';
		return this;
	}

	setState({gdsObjName, gdsObjIndex, gdsList})
	{
		const curGds 		= gdsList[gdsObjIndex];

		const {terminals, matrix, dimensions, hasWide, wideDimensions} = curGds.get();

		return super.setState({
			terminals, matrix, dimensions, gdsObjName, hasWide, wideDimensions
		});
	}

	_renderer()
	{
		const {dimensions, matrix, terminals, hasWide, wideDimensions} = this.state;

		this.context.style.width 	= dimensions.parent.width + 'px';
		this.context.style.height 	= dimensions.parent.height + 'px';
		this.context.innerHTML 		= '';

		if (hasWide)
		{
			const wideTerminal = terminals.wide; //curGds.wideTerminal;

			wideTerminal.changeSize(wideDimensions);
			this.context.appendChild(wideTerminal.context);
		}

		matrix.list.forEach( index => {

			terminals[index].changeSize(dimensions);

			this.context.appendChild(
				terminals[index].context
			);

			terminals[index].context.scrollTop = terminals[index].context.scrollHeight;
		});
	}
}