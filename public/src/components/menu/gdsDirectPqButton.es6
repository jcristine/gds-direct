import Component 		                    from "../../modules/component";
import Dom                                  from "../../helpers/dom";
import {GET_LAST_REQUESTS}                  from "../../actions/settings";
import {PQ_MODAL_SHOW} from "../../actions/priceQuoutes";
import ButtonPopOver						from "../../modules/buttonPopover";

export default class gdsDirectPqButton extends Component
{
    constructor()
    {
        super('div');

        this.pqButton = new PqButtonPopover().getTrigger();
    }

    setState({requestId, ...state})
    {
        return super.setState({
            canCreatePq : state.curGds.get('canCreatePq'),
            canCreatePqErrors : state.curGds.get('canCreatePqErrors') || [],
            requestId 	: requestId
        })
    }

    mount ()
    {
        this.context.appendChild(
            this.pqButton
        )
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
                GET_LAST_REQUESTS()
                    .then(response => {
                        const c = new PopoverContext(response, this.popover);

                        this.popContent.innerHTML = '';
                        this.popContent.appendChild( c.context );

                        c.finalize( this.popContent );
                    });
            }
        });
    }

}

class PopoverContext
{
    constructor(response, popover)
    {
        this.context = Dom('div');

        this._makeHeader();

        this._makeBody(response, popover);
    }

    _makeHeader ()
    {
        const header = Dom('div', {style: 'text-align: center'});

        header.appendChild(
            Dom(`h4[Last 10 requests]`, {style: 'font-weight: bold'})
        );

        this.context.appendChild( header );
    }

    _makeBody(response, popover)
	{
		let leadRecords = response.records || [];
		leadRecords.forEach( record => {
			let pqTravelRequestId = record.id;
			let leadWrapper = Dom('div');

			let el = Dom(`a.t-pointer[${pqTravelRequestId}]`, {
				onclick : () => {
					// App.get('lead')
					window.apiData = window.apiData || {};
					window.apiData.lead = record;
					PQ_MODAL_SHOW(pqTravelRequestId);
					popover.close();
				}
			});

			leadWrapper.appendChild( el );
			let dateWrapper = Dom('div', { style: 'display: inline-block; width: 55px; margin-right: 5px;' });
			dateWrapper.appendChild(
				Dom(`span[${this._getDate(record)}]`)
			);
			leadWrapper.appendChild( dateWrapper );
			leadWrapper.appendChild(
				Dom(`span[${this._getItinerary(record)}]`)
			);

			this.context.appendChild( leadWrapper );
		});
	}

	/** '2019-03-17 00:00:00' -> '17-Mar-19' */
    _getDate (record) {
        const destination = record.destinations[Object.keys(record.destinations)[0]][1];

        if (!destination.departureDateMin || destination.departureDateMin === "" || destination.departureDateMin === "0000-00-00 00:00:00")
        {
            return '-';
        }

        let epochMs = Date.parse(destination.departureDateMin + ' Z');
        let dtObj = new Date(epochMs);
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return [
            ('00' + dtObj.getUTCDate()).slice(-2),
            months[dtObj.getUTCMonth()],
            (dtObj.getUTCFullYear() + '').slice(-2),
        ].join('-');
    }

    _getItinerary (record) {
        let codes = [], destination, departure;

        const destinations = Object.keys(record.destinations).map( key => record.destinations[key][1]);

        destinations.forEach( function( firstRoute ) {

            departure	= firstRoute['departureCityCode'] || firstRoute['departureAirportCode'];

            if (destination && ( departure !== destination ) )
            {
                codes.push( destination, '||' );
            }

            if (departure)
            {
                codes.push( departure, '-' );
            }

            destination = firstRoute['destinationCityCode'] || firstRoute['destinationAirportCode'];
        });

        if ( destination )
        {
            codes.push(destination);
        }

        return codes.join('') || '';
    }

    finalize(popContent)
    {
        this.context.scrollTop  = popContent.scrollHeight;
    }
}