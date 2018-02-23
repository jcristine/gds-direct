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

		document.getElementById( rootId ).appendChild(
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
}