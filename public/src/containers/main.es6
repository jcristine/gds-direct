import Component from "../modules/component";
import {TableSections} from "./sectionsWrap";
import {TempTerminal} from "../components/tempTerminal";
import {THEME_CLASS_NAME} from "../constants";

export let normalizeThemeId = (themeId, terminalThemes) => {
	// theme may have been deleted - take any other in
	// such case (otherwise user sees white screen)
	let noTheme = !themeId
		|| !terminalThemes.some(t => +t.id === +themeId);
	if (noTheme && terminalThemes.length > 0) {
		let apolloDefault = terminalThemes
			.filter(t => t.label === 'Apollo Default')
			.map(t => t.id)[0];
		themeId = apolloDefault || terminalThemes[0].id;
	}
	return themeId;
};

export class ContainerMain extends Component
{
	constructor({htmlRootDom, terminalThemes})
	{
		super(`section.terminal-wrap-custom`);

		this.observe(
			new TableSections()
		);

		this.parent = htmlRootDom;
		this.terminalThemes = terminalThemes;

		this.parent.appendChild(
			this.getContext()
		);

		this.tempTerminal 	= new TempTerminal();

		this.append(
			this.tempTerminal
		);
	}

	changeFontClass(fontSize)
	{
		this.context.classList.toggle('terminal-wrap-custom', true);
		let prefix = 'term-f-size-';
		for (let cls of this.context.className.split(' ')) {
			if (cls.startsWith(prefix)) {
				this.context.classList.toggle(cls, false);
			}
		}
		this.context.classList.toggle(prefix + fontSize, true);
	}

	setDisableTextWrap(flag)
	{
		this.context.classList.toggle('disable-text-wrap', flag);
	}

	getTempTerminal()
	{
		return this.tempTerminal;
	}

	changeStyle(themeName)
	{
		themeName = normalizeThemeId(themeName, this.terminalThemes);
		this.parent.classList.remove( THEME_CLASS_NAME + this.themeName );
		this.themeName = themeName;
		this.parent.classList.add( THEME_CLASS_NAME + themeName );
	}
}