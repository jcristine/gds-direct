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

	setState({pqToShow})
	{
		return super.setState({
			pqToShow
		})
	}

	_renderer()
	{
		this.context.classList.toggle('hidden', !this.state['pqToShow']);
	}
}

class Body extends Component
{
	constructor()
	{
		super('div.term-body-pq');
	}


	setState({pqToShow})
	{
		return super.setState({
			pqToShow
		})
	}

	_renderer()
	{
		if( this.state['pqToShow'] )
		{
			this.context.innerHTML = '';

			this.state['pqToShow'].result.map( pq => {

				const container = Dom('div.pq-container');

				container.appendChild(
					Dom('span.m-r-sm', {innerHTML : 'Selling:'})
				);

				container.appendChild(
					Dom('strong.label label-grey m-r-sm', {innerHTML : pq['selling']})
				);

				container.appendChild(
					Dom('span.m-r-sm', {innerHTML : 'NET:'})
				);

				container.appendChild(
					Dom('strong.label label-grey  m-r-sm', {innerHTML : pq['net']})
				);

				container.appendChild(
					Dom('strong.label label-mozilla added-by', {innerHTML : pq['addedByGroupLabel']})
				);

				container.appendChild(
					Dom('div.m-t', {})
				);

				container.appendChild(
					Dom('pre.priceqoute-pre pos-rlt m-b-none m-t-none t-courier', {innerHTML : pq['reservationDump']})
				);

				this.context.appendChild(
					container
				)
			});
		}
	}
}