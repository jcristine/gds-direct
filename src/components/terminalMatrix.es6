import Component 	from '../modules/component.es6';
import {GDS_LIST} 	from "../constants";
const stringify 	= JSON.stringify;

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

	renderIsNeeded( state )
	{
		if (!this.state)
			return true;

		return stringify(state) !== stringify(this.state);
	}

	_renderer()
	{
		const curGdsIndex 	= GDS_LIST.indexOf(this.props.gdsObjName);
		const curGds 		= this.props.gdsList[curGdsIndex];

		const terminals 	= curGds.get('terminals');
		const matrix 		= curGds.get('matrix');
		const dimensions 	= curGds.get('dimensions');
		const name 			= curGds.get('name');

		const state = {
			gds : name,
			...matrix,
			...dimensions,
			hasWide : curGds.get('hasWide')
		};

		if ( !this.renderIsNeeded(state) )
		{
			return false;
		}

		this.context.style.width 	= (dimensions.parent.width) + 'px';
		this.context.style.height 	= (dimensions.parent.height) + 'px';
		this.context.innerHTML 		= '';

		if (curGds.get('hasWide'))
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

		this.state = {...state}
	}
}