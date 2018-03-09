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

		const {terminals, matrix, dimensions, hasWide} = curGds.get();

		return super.setState({
			terminals, matrix, dimensions, gdsObjName, hasWide
		});
	}

	_renderer()
	{
		const {dimensions, matrix, terminals, hasWide} = this.state;

		this.context.style.width 	= (dimensions.parent.width) + 'px';
		this.context.style.height 	= (dimensions.parent.height) + 'px';
		this.context.innerHTML 		= '';

		if (hasWide)
		{
			const wideTerminal = terminals.wide; //curGds.wideTerminal;

			wideTerminal.changeSize({
				char : dimensions.char,
				size : {
					height 	: dimensions.parent.height,
					width 	: dimensions.size.width
				},
			});

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