import Component from "../modules/component";
import {TableSections} from "./sectionsWrap";
import {TempTerminal} from "../components/tempTerminal";

export default class ContainerMain extends Component
{
	constructor( rootId )
	{
		super('section.terminal-wrap-custom');

		this.observe(
			new TableSections()
		);

		this.parent = document.getElementById( rootId );

		this.parent.appendChild(
			this.getContext()
		);

		this.tempTerminal 	= new TempTerminal();

		this.append(
			this.tempTerminal
		)
	}

	changeFontClass({fontSize})
	{
		this.context.className = 'terminal-wrap-custom term-f-size-' + fontSize;
	}

	getTempTerminal()
	{
		return this.tempTerminal;
	}

	changeStyle(themeName)
	{
		this.parent.classList.remove( this.themeName );
		this.themeName = themeName;
		this.parent.classList.add( themeName );
	}
}