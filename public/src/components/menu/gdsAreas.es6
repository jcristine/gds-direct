import Component from "../../modules/component";
import {CHANGE_SESSION_BY_MENU} from "../../actions/settings";
import {CHANGE_GDS} from "../../actions/gdsActions";
import Dom from "../../helpers/dom";
import {AREA_LIST,GDS_LIST} from "../../constants";
import ButtonPopOver from "../../modules/buttonPopover";

export class GdsAreas extends Component
{
	constructor()
	{
		super('article');
	}

	setState(state)
	{
		const current = state.curGds;

		return super.setState({
			gdsName			: current.get('name'),
			pcc 			: current.get('pcc'),
			sessionIndex	: current.get('sessionIndex'),
			areaList 		: current.get('list'),
			idxToInfo		: current.get('idxToInfo') || {},
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
	constructor({gdsName, areaList, sessionIndex, pcc, idxToInfo})
	{
		super({icon : gdsName}, 'div');

		this.gdsname		= gdsName;
		this.areaList		= areaList;
		this.sessionIndex	= sessionIndex;
		this.pcc			= pcc;
		this.idxToInfo		= idxToInfo || {};
	}

	makeTrigger()
	{
		return super.makeTrigger({className : 'btn btn-primary font-bold pos-rlt has-drop-down'})
	}

	build()
	{
		GDS_LIST.map( name => {
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
		let sessionInfo = this.idxToInfo[index] || {};
		let pnrHtml = '';
		if (sessionInfo.area === area) {
			let rloc = sessionInfo.recordLocator || '';
			if (rloc) {
				pnrHtml = `<span class="pnr-label">${rloc}</span>`;
			} else if (sessionInfo.canCreatePq) {
				let pricingCmd = sessionInfo.pricingCmd || 'PQ';
				pnrHtml = `<span class="pnr-label">${pricingCmd}</span>`;
			} else if (sessionInfo.hasPnr) {
				pnrHtml = `<span class="pnr-label">PNR</span>`;
			}
		}

		return Dom(`button.btn btn-sm btn-purple font-bold pos-rlt ${isActive ? 'active' : ''}`, {
			innerHTML	:  area + ( this.pcc[index] ? `<span class="pcc-label">${this.pcc[index]}</span>` : '')
				+ pnrHtml
				,
			disabled	:  isActive,
			onclick		: e => {
				e.target.disabled = true;
				CHANGE_SESSION_BY_MENU(AREA_LIST[index])
			}
		});
	}
}