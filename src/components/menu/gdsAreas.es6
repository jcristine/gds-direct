import {SessionButtons} from "./sessionButtons";
import Component from "../../modules/component";
import {GDS_LIST} from "../../constants";

export class GdsAreas extends Component
{
	constructor()
	{
		super('article');
	}

	setState(state)
	{
		const {gdsList, gdsObjName, gdsObjIndex} = state;

		const current = gdsList[gdsObjIndex];

		const {pcc, sessionIndex} = current.get();

		return super.setState({
			gdsObjName,
			pcc,
			sessionIndex,
			areaList 	: current.get('list'),
			gdsList 	: gdsList.map( name => name.props.name)
		})
	}

	_renderer()
	{
		this.context.innerHTML = '';

		this.state.gdsList.map( name => {

			const buttons = new SessionButtons({name});

			this.context.appendChild(
				buttons.makeTrigger(this.state.gdsObjName)
			);

			if (this.state.gdsObjName === name )
			{
				this.state.areaList.map( (area, index) => {

					this.context.appendChild(
						buttons.makeArea(area, index, this.state.pcc, this.state.sessionIndex)
					);

				});
			}
		});
	}
}