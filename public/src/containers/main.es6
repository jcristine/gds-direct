import Component from "../modules/component";
import {TableSections} from "./sectionsWrap";
import {TempTerminal} from "../components/tempTerminal";
import {THEME_CLASS_NAME} from "../constants";

export default class ContainerMain extends Component
{
	constructor( htmlRootDom )
	{
		super(`section.terminal-wrap-custom`);

		this.observe(
			new TableSections()
		);

		htmlRootDom.innerHTML = '';
		this.parent = htmlRootDom;

		this.parent.appendChild(
			this.getContext()
		);

		this.tempTerminal 	= new TempTerminal();

		this.append(
			this.tempTerminal
		)
	}

	changeFontClass(fontSize)
	{
		this.context.className = 'terminal-wrap-custom term-f-size-' + fontSize;
	}

	getTempTerminal()
	{
		return this.tempTerminal;
	}

	changeStyle(themeName)
	{
		this.parent.classList.remove( THEME_CLASS_NAME + this.themeName );
		this.themeName = themeName;
		this.parent.classList.add( THEME_CLASS_NAME + themeName );
	}
}