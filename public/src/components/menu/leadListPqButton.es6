
import Component 		                    from "../../modules/component";
import ButtonPopOver						from "../../modules/buttonPopover";
import {LeadList} from '../reusable/LeadList.js';
import {PQ_MODAL_SHOW} from "../../actions/priceQuoutes";

export default class LeadListPqButton extends Component
{
    constructor()
    {
        const roles = window.GdsDirectPlusState.getRoles();
        super('div', {
            style: roles.includes('can_add_pqs') ? '' : 'display: none',
        });

        this.pqButton = new PqButtonPopover().getTrigger();
    }

    setState({requestId, ...state})
    {
        return super.setState({
            canCreatePq : state.curGds.get('canCreatePq'),
            canCreatePqErrors : state.curGds.get('canCreatePqErrors') || [],
            requestId 	: requestId
        });
    }

    mount ()
    {
        this.context.appendChild(
            this.pqButton
        );
    }

    _renderer()
    {
        this.pqButton.disabled = this.state.canCreatePq !== true;
        this.pqButton.classList.toggle('has-pq-errors', (this.state.canCreatePqErrors || []).length > 0);
        this.pqButton.classList.toggle('hidden', !!this.state.requestId);
    }
}

class PqButtonPopover extends ButtonPopOver {

    constructor()
    {
        super({icon : 'PQ'}, 'div.terminal-menu-popover requestList');

        this.makeTrigger({
            className	: 'btn btn-sm btn-mozilla font-bold',
            onclick		: () => {
                let c = new LeadList(leadId => {
                    PQ_MODAL_SHOW(leadId);
                    this.popover.close();
                });
                this.popContent.innerHTML = '';
                this.popContent.appendChild( c.context );

                c.finalize( this.popContent );
            }
        });
    }
}
