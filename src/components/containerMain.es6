import ActionsMenu 		from './actionsMenu';
import MenuPanel 		from './menuPanel';
import TerminalMatrix 	from './terminalMatrix';
import Component 		from '../modules/component';
import Dom 				from "../helpers/dom";
import {PqQuotes} 		from "./PqQuotes";
import {CHANGE_ACTIVE_TERMINAL, DEV_CMD_STACK_RUN, CHANGE_GDS} from "../actions";

let matrix, tempTerm, isTerminalInit;

const cookie = {
	get : (name) => {
		const 	value = '; ' + document.cookie,
			parts = value.split('; ' + name + '=');

		if (parts.length === 2)
		{
			return parts.pop().split(';').shift();
		}
	},

	set : (name, value, xmins) => {
		const 	d = new Date(),
			expires = 'expires='+ d.toUTCString();

		xmins = !isNaN(parseFloat(xmins)) ? parseFloat(xmins) : 1;
		d.setTime(d.getTime() + (xmins*60*1000));
		document.cookie = name + '=' + value + '; ' + expires;
	}
};

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

		this.customInitForPnr();
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

	customInitForPnr()
	{
		const self = this;

		if (!isTerminalInit)
		{
			isTerminalInit = true;

			setTimeout(function() {
				self.executePnrCode();
			}, 300);

			window.onhashchange = () => {
				if (location.hash === "#terminalNavBtntab")
				{
					self.executePnrCode();
				}
			};
		}
	}

	executePnrCode()
	{
		const 	pnrCode = cookie.get('pnrCode'),
				gdsName = cookie.get('gdsName') || 'apollo';

		if (pnrCode)
		{
			cookie.set('pnrCode', null);
			cookie.set('gdsName', null);

			CHANGE_GDS(gdsName);
			CHANGE_ACTIVE_TERMINAL({gds : gdsName, curTerminalId : 0, plugin : this.getTerminal(gdsName, 0).plugin});
			DEV_CMD_STACK_RUN('*' + pnrCode);
		}
	}
}

class RightSide extends Component
{
	constructor()
	{
		super('td.menu');

		const menu = new MenuPanel();
		this.addToObserve( menu );

		this.append(
			new Component('section.hbox stretch')
				.append(
					new Component('section.vbox')
						.append(
							new Component('section.scrollable')
								.append(
									menu
								)
						)
				)
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

	calculate({cells, rows}, parentWidth, parentHeight)
	{
		// console.log( 'zzzzz', this.parent.clientWidth );
		// console.log( 'zzzzz', parentWidth );
		// console.log( 'zzzzz' );


		return {
			height		: Math.floor(parentHeight 	/ (rows+1)),
			width 		: Math.floor( (this.parent.clientWidth) 	/ (cells+1)),
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

		const rightSide = new RightSide();
		const pqQuotes 	= new PqQuotes();
		const leftSide 	= new Component('td.left');

		tempTerm		= new TempTerminal(leftSide.context);

		this
			.observe(
				new Component('tr')
					.append( leftSide )
					.append( pqQuotes)
					.append( rightSide )
			);

		this.addToObserve( pqQuotes );
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
		// const dimensions = tempTerm.calculate(this.props.gdsObj.matrix, this.context.parentNode.clientWidth, this.context.parentNode.clientHeight);

		this.props = {...this.props,  width : this.context.clientWidth, getDimensions : () => {
			// console.log(this.context.clientWidth);
			// console.log(this.context.parentNode.clientWidth);
			// console.log('=================');

			return tempTerm.calculate(this.props.gdsObj.matrix, this.context.parentNode.clientWidth, this.context.parentNode.clientHeight)
		}}
	}
}