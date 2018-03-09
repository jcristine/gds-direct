import Dom	from '../../helpers/dom.es6';
import {CHANGE_GDS, CHANGE_SESSION_BY_MENU} from "../../actions";
import {AREA_LIST} from "../../constants";

export class SessionButtons
{
	constructor(params)
	{
		this.context 		= Dom('div');
		this.gdsname		= params.name;
	}

	makeTrigger(gdsName)
	{
		return Dom('button', {
			className 	: `btn btn-sm btn-mint font-bold ${gdsName === this.gdsname ? ' active' : '' }`,
			innerHTML	: this.gdsname,
			onclick		: () => CHANGE_GDS(this.gdsname)
		});
	}

	makeArea(area, index, pcc, sessionIndex)
	{
		const isActive 	= sessionIndex === index;

		return Dom(`button`, {
			className 	: `btn btn-sm btn-purple font-bold pos-rlt ${isActive ? 'active' : ''}`,

			innerHTML	:  area + ( pcc[index]? `<span class="pcc-label">${pcc[index]}</span>` : ''),

			disabled	:  isActive,

			onclick		: (e) => {

				e.target.disabled = true;

				CHANGE_SESSION_BY_MENU(AREA_LIST[index]).catch( () => {
					e.target.disabled = false;
				})
			}
		});
	}
}