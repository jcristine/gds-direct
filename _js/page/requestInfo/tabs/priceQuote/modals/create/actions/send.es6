import {getState} from "es6!../store";
import Helper from 'abstract/helper';
import {modules} from 'abstract/dom_builder';
import {formatHotelDate} from "es6!../tour";

export class Sender
{
	static getPostData()
	{
		const {props, rId, canMarkup, canMileAge, clone, terminal, flightOptionId, itineraryId, canTour, tour, isTourFare} = getState();

		let post = {
			rId,
			msg					: props.dump,
			apolloPcc			: props.pcc,
			currency			: props.currency,
			customerRemarks		: props.clientRemark,
			internalRemarks		: props.internalRemark,
			detailsRequired		: props.detailsNotRequired ? 1 : 0
		};

		if (canMileAge)
		{
			post['mileage'] =  props['mileage'];
		}

		if (clone || terminal)
		{
			post = {...post , flightOptionId, itineraryId};
		}

		if (canTour && isTourFare)
		{
			post = {...post, ...this.getTourData(tour)}
		}

		const prices  = this.getPrices(props.prices, canMarkup);
		post = {...post, ...prices};

		return post;
	}

	static getPrices(prices, canMarkup)
	{
		const res = {};

		prices.map ( price => {
			const capitalize 	= (string) => string.charAt(0).toUpperCase() + string.slice(1);
			const name 			= capitalize(price['name']);

			res['netPrice' + name] 	= price['netVal'];

			if (canMarkup)
			{
				res['markup'	+ name] = price['selVal'];
			} else
			{
				res['price'	+ name] = price['selVal'];
			}
		});

		return res;
	}

	static getTourData(tour)
	{
		let props = {};

		const hotel = {
            id			: tour.hotel.id,
            nbRooms 	: tour.rooms,
            nbAdults 	: tour.adults,
            nbChildren 	: tour.children,
            dateFrom 	: formatHotelDate(tour.date.checkIn),
            dateTo 		: formatHotelDate(tour.date.checkOut)
		};

		if (!tour.hotel.id)
		{
			props = {
                id 			: 0,
                name 		: tour.hotel.name,
                address 	: tour.hotel.address,
                cityId		: tour.city.id,
			};
        }

        if (tour.hotel.randomHotel)
		{
			props = {
				id 			: 0,
				cityId		: tour.city.id,
                randomHotel : tour.hotel.randomHotel
			}
		}

        return {hotel: {...hotel, ...props}};
	}

	static send()
	{
		const post = this.getPostData();

		const {clone} = getState();
		Helper.loader.show();

		return Helper.apiRequest.promise({
			url		: 'requestInfo/flightOption/' + ( clone ? 'clone' : 'add' ),
			data 	: post
		}).post().then( response => {

			if (response.manualApprovalText)
			{
				approveModal(response.manualApprovalText,  response.flId)
			} else
			{
				App.publish("/pqTable/refresh", () => Helper.loader.hide() );
			}
		});
	}
}

const approveModal = ( body, flId ) => {
	const request = url => {
		modal.close();
		return Helper.apiRequest.promise({url, data : {flId}}).post();
	};

	const rejectMe = () => 	request('requestInfo/flightOption/cancel');
	const confirm = () =>	request('requestInfo/flightOption/approve');

	const modal = modules.modal.make({
		noCloseBtn	: 1,
		body 		: App.Dom(`div.alert alert-warning t-f-size-12 font-bold m-b-none[${body}]`),
		buttons		: [
			App.Dom('button.btn btn-lg no-radius btn-success[Confirm]', {onclick : () => confirm() }),
			App.Dom('button.btn btn-lg no-radius btn-danger[Cancel]', 	{onclick : () => rejectMe() })
		]
	})
		.show();
};