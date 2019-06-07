
import Dom                                  from "../../helpers/dom";
import {GET_LAST_REQUESTS}                  from "../../actions/settings";

/**
 * shows agent the last few recently used leads and an input for custom ID
 */
export class LeadList
{
	/** @param {function(leadId: number)} onChosen */
    constructor(onChosen)
    {
    	this.onChosen = onChosen;
        this.context = Dom('div.lead-list');
        this._makeHeader();
        this._makeBody();
    }

    _makeHeader ()
    {
        const header = Dom('div', {style: 'text-align: center'});

        header.appendChild(
            Dom(`h4[Last 10 requests]`, {style: 'font-weight: bold'})
        );

        this.context.appendChild( header );
    }

    _makeBody()
	{
		let submitLead = (leadId) => {
			this.onChosen(leadId);
		};
		let customIdInp = Dom('input', {
			type: 'text',
			style: 'color: black',
			size: 12,
		});
		let customIdBtn = Dom('button', {
			textContent: 'Custom Lead ID',
			style: 'color: black',
			onclick: () => {
				let leadId = customIdInp.value;
				if (leadId.match(/^\d{6,}[02468]$/)) {
					submitLead(leadId);
				} else {
					alert('Invalid lead ID #' + leadId);
				}
			},
		});
		this.context.appendChild(customIdInp);
		this.context.appendChild(customIdBtn);
		let statusHolder = Dom('div', {textContent: 'Loading recent lead list...'});
		this.context.appendChild(statusHolder);
		GET_LAST_REQUESTS()
			.then(response => {
				let records = response.records || [];
				statusHolder.textContent = 'Loaded ' + records.length + ' recent leads:';
				return records;
			})
			.then(records => records.forEach(record => {
				let pqTravelRequestId = record.id;
				let leadWrapper = Dom('div');

				let el = Dom(`a.t-pointer[${pqTravelRequestId}]`, {
					onclick : () => {
						// App.get('lead')
						window.apiData = window.apiData || {};
						window.apiData.lead = record;
						submitLead(pqTravelRequestId);
					}
				});

				leadWrapper.appendChild( el );
				let dateWrapper = Dom('div', { style: 'display: inline-block; width: 75px; margin-right: 5px;' });
				dateWrapper.appendChild(
					Dom(`span[${this._getDate(record)}]`)
				);
				leadWrapper.appendChild( dateWrapper );
				leadWrapper.appendChild(
					Dom(`span[${this._getItinerary(record)}]`)
				);

				this.context.appendChild( leadWrapper );
			}))
			.catch(exc => statusHolder.textContent = ('Failed to load lead list - ' + exc).slice(0, 300));
	}

	/** '2019-03-17 00:00:00' -> '17-Mar-19' */
    _getDate (record) {
        const destination = record.destinations[Object.keys(record.destinations)[0]][1];

        if (!destination.departureDateMin || destination.departureDateMin === "" || destination.departureDateMin === "0000-00-00 00:00:00")
        {
            return '-';
        }

        let epochMs = Date.parse(destination.departureDateMin + 'Z');
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