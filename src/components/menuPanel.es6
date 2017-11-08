import Theme 			from './popovers/theme.es6';
import {History} 		from './popovers/history.es6';
import TextSize 		from './popovers/textSize.es6';
import {SessionButtons}	from './menu/sessionButtons.es6';
import PqButton			from './menu/pqButton.es6';
import DevButtons		from './menu/devButtons.es6';
import Dom				from '../helpers/dom.es6';
import Component		from '../modules/component';
import GdsSet 			from '../modules/gds';
import {CHANGE_INPUT_LANGUAGE, SHOW_PQ_QUOTES} from "../actions";

export default class MenuPanel extends Component
{
	constructor()
	{
		super('aside.sideMenu');

		this.append(
			new SettingsButtons()
		);

		this.attach(
			Dom('span.label[Session]')
		);

		this.observe(
			new GdsAreas()
		);

		this.attach(
			Dom('span.label[Input Language]')
		);

		this.observe(
			new LanguageButtons()
		);

		this.observe(
			new PqButton()
		);

		if ( window.TerminalState.hasPermissions() )
			this.append(
				new TestsButtons()
			);
	}
}

class SettingsButtons extends Component
{
	constructor()
	{
		super('article');
		this.children().map( element => this.context.appendChild( element ) );
	}

	children()
	{
		const Quotes 	= Dom('button.btn btn-primary font-bold', {innerHTML : 'Quoutes', onclick : SHOW_PQ_QUOTES});

		const theme 	= new Theme({
			icon	: '<i class="fa fa-paint-brush t-f-size-14"></i>'
		}).getTrigger();

		const textSize 	= new TextSize({
			icon	: '<i class="fa fa-text-height t-f-size-14"></i>'
		}).getTrigger();

		const history	= new History({
			icon	: '<i class="fa fa-history t-f-size-14"></i>'
		}).getTrigger();

		return [Quotes, theme, textSize, history];
	}
}

class GdsAreas extends Component
{
	constructor()
	{
		super('article');
	}

	stateToProps({gdsObj})
	{
		const {pcc, sessionIndex, name} = gdsObj;
		return {pcc, sessionIndex, name};
	}

	_renderer()
	{
		this.context.innerHTML = '';

		GdsSet.getList().forEach( ({list, name}) => {

			const buttons = new SessionButtons(this.props);

			this.context.appendChild(
				buttons.makeTrigger( name )
			);

			if (this.props['name'] === name)
				list.map( (area,index) => {
					this.context.appendChild(
						buttons.makeArea(area, index)
					);
				});
		});
	}
}

class LanguageButtons extends Component
{
	constructor()
	{
		super('article');
	}

	stateToProps({language})
	{
		return {language};
	}

	_renderer()
	{
		this.context.innerHTML = '';

		['APOLLO','SABRE', 'AMADEUS'].forEach( value => {

			const button = Dom('button.btn  btn-gold t-f-size-10 font-bold' + ( this.props.language === value ? ' active' : '') );

			button.innerHTML = value;
			button.addEventListener('click', () => CHANGE_INPUT_LANGUAGE(value) );

			this.context.appendChild(
				button
			);
		});
	}
}

class TestsButtons extends Component
{
	constructor()
	{
		super('article');

		this.context.appendChild(
			new DevButtons().getContext()
		);
	}
}