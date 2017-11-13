import Component from "../modules/component";
import Dom from '../helpers/dom';
import {HIDE_PQ_QUOTES} from "../actions";

export class PqQuotes extends Component
{
	constructor()
	{
		super('td.pqQuotes hidden bg-white b-l b-r');

		this.observe(
			new Component('section.hbox stretch')
				.observe(
					new Component('section.vbox')

						.append(
							new Component('header.header b-b')
								.observe(
									new Component('span.close', {
										innerHTML 	: '&times;',
										onclick		: HIDE_PQ_QUOTES
									})
								)
						)

						.observe(
							new Component('section.scrollable bg-light lter ')
								.observe(

									new Component('div.hbox stretch ')
										.observe(
											new Body()
										)

								)
						)
				)
		)
	}

	stateToProps({pqToShow})
	{
		return {pqToShow};
	}

	_renderer()
	{
		this.context.classList.toggle('hidden', !this.props['pqToShow']);
	}
}

class Body extends Component
{
	constructor()
	{
		super('div.term-body-pq');
	}

	_renderer()
	{
		if( this.props['pqToShow'] )
		{
			this.context.innerHTML = '';

			this.context.appendChild(
				Dom('br')
			);

			this.props['pqToShow'].result.map( pq => {

				this.context.appendChild(
					Dom('span.m-r-sm', {innerHTML : 'Selling:'})
				);

				this.context.appendChild(
					Dom('strong.label label-grey m-r-sm', {innerHTML : pq['selling']})
				);

				this.context.appendChild(
					Dom('span.m-r-sm', {innerHTML : 'NET:'})
				);

				this.context.appendChild(
					Dom('strong.label label-grey  m-r-sm', {innerHTML : pq['net']})
				);

				this.context.appendChild(
					Dom('strong.label label-mozilla ', {innerHTML : pq['addedByGroupLabel']})
				);

				this.context.appendChild(
					Dom('div.m-t', {})
				);

				this.context.appendChild(
					Dom('pre.priceqoute-pre pos-rlt m-b-none m-t-none t-courier', {innerHTML : pq['reservationDump']})
				);

				this.context.appendChild(
					Dom('br', {})
				);
			});
		}
	}
}