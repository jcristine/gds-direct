import {SessionButtons} from "./sessionButtons";
import Component from "../../modules/component";

export class GdsAreas extends Component
{
	constructor()
	{
		super('article');
	}

	_renderer()
	{
		this.context.innerHTML = '';

		this.props.gdsList.map( obj => {

			const buttons = new SessionButtons({
				pcc				: obj.get('pcc'),
				sessionIndex	: obj.get('sessionIndex'),
				name			: obj.get('name')
			});

			this.context.appendChild(
				buttons.makeTrigger(this.props.gdsObjName)
			);

			if (this.props.gdsObjName === obj.get('name') )
			{
				obj.get('list').map( (area, index) => {
					this.context.appendChild(
						buttons.makeArea(area, index)
					);
				});
			}

		});
	}
}