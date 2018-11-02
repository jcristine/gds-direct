import Component 		                    from "../../modules/component";
import Dom                                  from "../../helpers/dom";
import {GET_LAST_REQUESTS}                  from "../../actions/settings";
import {PQ_MODAL_SHOW, SET_REQUEST_ID} 	    from "../../actions/priceQuoutes";
import Drop                                 from "tether-drop";
import Moment 								from "moment";

export default class gdsDirectPqButton extends Component
{
	constructor()
	{
		super('button.btn btn-sm btn-mozilla font-bold[PQ]');

		this.popContent = Dom('div.terminal-menu-popover requestList');

		this.context.addEventListener('click', () => {
			this.makePopover();
			this.askServer();
		});
	}

	makePopover()
	{
		if (this.popover)
		{
			return false;
		}

		this.popover = new Drop({
			target		: this.context,
			content		: this.popContent,
			classes		: 'drop-theme-twipsy',
			position	: 'left top',
			openOn		: 'manual'
		});
	}

	askServer()
	{
		this.popContent.innerHTML 	= '<div class="text-center"><div class="terminal-lds-hourglass"></div></div>';

		this.popover.open();

		GET_LAST_REQUESTS()
			.then(response => {
				const c = new PopoverContext(response, this.popover);

				this.popContent.innerHTML = '';
				this.popContent.appendChild( c.context );

				c.finalize( this.popContent );
			});
	}

	setState({requestId, ...state})
	{
		return super.setState({
			canCreatePq : state.curGds.get('canCreatePq'),
			requestId 	: requestId
		})
	}

	_renderer()
	{
		this.context.disabled = this.state.canCreatePq !== true;
		this.context.classList.toggle('hidden', !!this.state.requestId);
	}
}

class PopoverContext
{
	constructor(response, popover)
	{
		this.context = Dom('div');

		this._makeBody(response, popover);
	}

	_makeBody(response, popover)
	{
		response.data.forEach( value => {
			const leadWrapper = Dom('div');

            const el 	= Dom(`a.t-pointer[${value}]`, {
                onclick : () => {
                    SET_REQUEST_ID(value)
                        .then( () => {
                            PQ_MODAL_SHOW();
                            popover.close();
                        });
                }
            });

            leadWrapper.appendChild( el );

            response.records.forEach( record => {
				if (value === record.id)
				{
					let dateWrapper = Dom('div', { style: 'display: inline-block; width: 55px; margin-right: 5px;' });

                    dateWrapper.appendChild(
                        Dom(`span[${this._getDate(record)}]`)
                    );

					leadWrapper.appendChild( dateWrapper );

                    leadWrapper.appendChild(
                    	Dom(`span[${this._getItinerary(record)}]`)
					);
				}
			} );

			this.context.appendChild( leadWrapper );
		});
	}

	_getDate (record) {
		const destination = record.destinations[Object.keys(record.destinations)[0]][1];

		return destination.departureDateMin && destination.departureDateMin !== "" ? Moment(destination.departureDateMin).format('DD-MMM-YY') : '';
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