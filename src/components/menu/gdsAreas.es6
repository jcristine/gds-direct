import Component from "../../modules/component";
import {CHANGE_GDS, CHANGE_SESSION_BY_MENU, DEV_CMD_STACK_RUN} from "../../actions";
import Dom from "../../helpers/dom";
import {AREA_LIST} from "../../constants";
import ButtonPopOver from "../../modules/buttonPopover";

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

		return super.setState({
			gdsObjName,
			pcc 			: current.get('pcc'),
			sessionIndex	: current.get('sessionIndex'),
			areaList 		: current.get('list'),
			gdsList 		: gdsList.map( name => name.props.name)
		})
	}

	_renderer()
	{
		this.context.innerHTML = '';

		const buttons = new GdsButtons(this.state);

		this.context.appendChild(
			buttons.makeTrigger()
		);

		buttons.makeAreas( this.context );
	}
}

class GdsButtons extends ButtonPopOver
{
	constructor({gdsObjName, gdsList, areaList, sessionIndex, pcc})
	{
		super({icon : gdsObjName }, 'div');

		this.gdsname		= gdsObjName;
		this.gdsList		= gdsList;
		this.areaList		= areaList;
		this.sessionIndex	= sessionIndex;
		this.pcc			= pcc;
	}

	makeTrigger()
	{
		return super.makeTrigger({className : 'btn btn-primary font-bold pos-rlt has-drop-down'})
	}

	build()
	{
		this.gdsList.map( name => {
			this.popContent.appendChild(
				this.gdsButton(name)
			);
		})
	}

	gdsButton(gdsName)
	{
		return Dom(`button.btn btn-sm btn-block btn-mint font-bold [${gdsName}]`, {
			disabled 	: this.gdsname === gdsName,
			onclick 	: () => {
				CHANGE_GDS(gdsName);
				this.popover.close();
			}
		});
	}

	makeAreas(context)
	{
		this.areaList.map( (area, index) => {
			context.appendChild(
				this.makeArea(area, index)
			)
		});
	}

	makeArea(area, index)
	{
		const isActive 	= this.sessionIndex === index;

		return Dom(`button.btn btn-sm btn-purple font-bold pos-rlt ${isActive ? 'active' : ''}`, {

			innerHTML	:  area + ( this.pcc[index] ? `<span class="pcc-label">${this.pcc[index]}</span>` : ''),

			disabled	:  isActive,

			onclick		: e => {

				e.target.disabled = true;

				CHANGE_SESSION_BY_MENU(AREA_LIST[index])
					// .catch( () => e.target.disabled = false )
			}
		});
	}
}