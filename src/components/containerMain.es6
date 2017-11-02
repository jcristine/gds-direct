import ActionsMenu 		from './actionsMenu';
import MenuPanel 		from './menuPanel';
import TerminalMatrix 	from './terminalMatrix';
import Component 		from '../modules/component';
import Dom 				from "../helpers/dom";

let matrix, tempTerm;

export default class Container extends Component {

	constructor( rootId )
	{
		super('section');

		this.observe(
			new Wrapper()
		);

		document.getElementById( rootId ).appendChild(
			this.getContext()
		);
	}

	purgeScreens( gds )
	{
		matrix.purgeScreens( gds );
	}

	getTerminal(gds, index, props)
	{
		return matrix.getTerminal(gds, index, props);
	}

	_renderer()
	{
		this.context.className 	= 'terminal-wrap-custom term-f-size-' + this.props.fontSize;
	}
}

class RightSide extends Component
{
	constructor()
	{
		// super('aside.t-d-cell menu');
		super('td.menu');

		this.observe(
			new MenuPanel()
		);
	}

	_renderer()
	{
		this.context.classList.toggle('hidden', this.props.hideMenu );
	}
}

class TempTerminal extends Component
{
	constructor( parent )
	{
		super('div.terminal temp-terminal');

		this.cursor = Dom('span.cursor', {innerHTML  : '&nbsp;'});
		const div	= Dom('div.cmd', {innerHTML  : '&nbsp;'});

		div.appendChild( this.cursor );
		this.attach(div);

		this.parent = parent;
	}

	calculate({cells, rows}, parentWidth)
	{
		// console.log( 'zzzzz', this.parent.clientWidth );
		// console.log( 'zzzzz', parentWidth );
		// console.log( 'zzzzz', this.parent.offsetWidth );
		// console.log( 'zzzzz', this.parent );



		return {
			height		: Math.floor(this.parent.clientHeight 	/ (rows+1)),
			// width 		: Math.floor(this.parent.clientWidth 	/ (cells+1)),
			width 		: Math.floor((parentWidth - 100) 	/ (cells+1)),
			char		: this.getLineHeight()
		}
	}

	getLineHeight()
	{
		const  { width, height } = this.cursor.getBoundingClientRect();
		return { width, height };
	}
}

class Wrapper extends Component
{
	constructor()
	{
		super('table.term-body minimized');

		matrix 			= new TerminalMatrix( this.context );

		const leftSide 	= new Component('td.left');
		const rightSide = new RightSide();

		tempTerm		= new TempTerminal(leftSide.context);

		this
			.observe(
				new Component('tr')
					.append( leftSide )
					.append( rightSide )
			);

		this.addToObserve( rightSide );
		this.addToObserve( leftSide );

		leftSide
			.observe( matrix )
			.append(
				new ActionsMenu()
			);

		this.append(
			tempTerm
		)
	}

	_renderer()
	{
		// console.log(this.context.clientWidth);
		// console.log(this.context);
		//
		// console.log(this.context.parentNode.clientWidth);
		// console.log(this.context.parentNode);
		//
		// console.log(this.context.parentNode);
		// console.log('=================');

		const dimensions = tempTerm.calculate(this.props.gdsObj.matrix, this.context.parentNode.clientWidth);
		this.props = {...this.props, dimensions}
	}
}