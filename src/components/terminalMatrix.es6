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

	setState(state)
	{
		const {terminals, matrix, dimensions, hasWide, wideDimensions, name} = state.curGds.get();

		this.terminals = terminals;

		return super.setState({
			matrix, dimensions, name, hasWide, wideDimensions
		});
	}

	_renderer()
	{
		const {dimensions, matrix, hasWide, wideDimensions} = this.state;
		const terminals = this.terminals;

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