import Component from "../../modules/component";
import MenuPanel from "../../components/menuPanel";

export class RightSide extends Component
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

	setState({menuHidden})
	{
		return super.setState({
			menuHidden
		})
	}

	_renderer()
	{
		this.context.classList.toggle('hidden', this.state.menuHidden );
	}
}