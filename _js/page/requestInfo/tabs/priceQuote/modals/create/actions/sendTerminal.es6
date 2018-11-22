import {getState} 	from "es6!../store";
import {Sender} 	from 'es6!./send';
import {apiRequest} from 'abstract/helper';

const App 			= require('application');
const Dom 			= require('abstract/dom_builder');

const areYouSureModal = ({manualApprovalText, rId, pcc, flightOptionId}) => {

	const promise = resolve => {

		const rejectMe = () => {
			modal.close();
			return apiRequest.promise({url : `terminal/priceQuoteReject?rId=${rId}&pcc=${pcc}&flId=${flightOptionId}`}).post();
		};

		const confirm = () => modal.close();

		const modal = Dom.modules.modal.make({
			noCloseBtn	: 1,
			body 		: App.Dom(`div.t-f-size-13 text-center[${manualApprovalText.join('')}]`),
			buttons		: [
				App.Dom('button.btn btn-lg no-radius btn-success[Confirm]', {onclick : () => resolve(confirm) }),
				App.Dom('button.btn btn-lg no-radius btn-danger[Cancel]', {onclick 	: () => resolve(rejectMe) })
			]
		})
		.show();
	};

	return new Promise(promise);
};

export class SenderTerminal extends Sender
{
	static getPrices(prices, canMarkup)
	{
		let netPrice = {}, mainPrice = {};

		prices.forEach( price => {
			netPrice[price.name] 	= price['netVal'];
			mainPrice[price.name] 	= price['selVal'];
		});

		return {
			netPrice,
			price 	: 	canMarkup ? {} : mainPrice,
			markup 	:	canMarkup ? mainPrice : {}
		}
	}

	static submit(postData, {rId, pcc, pnr})
	{
		return apiRequest.promise({
			url 		: `terminal/priceQuoteSubmit?rId=${rId}&pcc=${pcc}&pnr=${pnr}`,
			data 		: postData,
			loaderFull	: 1
		}).post();
	}

	static send()
	{
		const {props, pnr, rId, flightOptionId, manualApprovalText} = getState();
		const get = {pcc : props.pcc, pnr, rId, flightOptionId, manualApprovalText};

		const postData = {...this.getPostData(), flId : flightOptionId};

		if (manualApprovalText)
		{
			return areYouSureModal(get)
				.then(result => this.submit(postData, get).then(result))
		}

		return this.submit(postData, get);
	}
}