import Component from "../modules/component";
import Dom from '../helpers/dom';
import {HIDE_PQ_QUOTES} from "../actions/priceQuoutes";

export class PqQuotes extends Component
{
	constructor()
	{
		super('td.pqQuotes hidden  b-l b-r');

		this.observe(
			new Component('section.hbox stretch')
				.observe(
					new Component('section.vbox')
						.append(
							new Component('header.header')
								.append(
									new Component('span.close[&times;]', {onclick: HIDE_PQ_QUOTES})
								)
						)

						.observe(
							new Component('section.scrollable lter')
								.observe(
									new Component('div.hbox stretch')
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
			if (this.state['pqToShow'] === 'loading')
			{
				this.context.innerHTML 	= '<div class="text-center centered"><div class="terminal-lds-hourglass"></div></div>';
				return '';
			}

			this.context.innerHTML = '';

			this.state['pqToShow'].result.map( pq => {

				const container = Dom('div.pq-container');
				const labels 	= Dom('div.pq-container-labels');

				labels.appendChild(
					Dom('strong.label label-grey m-r-sm', {innerHTML : 'Selling: ' + pq['selling']})
				);

				labels.appendChild(
					Dom('strong.label label-grey  m-r-sm', {innerHTML : 'NET: '  + pq['net']})
				);

				labels.appendChild(
					Dom('strong.label label-mozilla added-by', {innerHTML : pq['addedByGroupLabel']})
				);

				container.appendChild(
					labels
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