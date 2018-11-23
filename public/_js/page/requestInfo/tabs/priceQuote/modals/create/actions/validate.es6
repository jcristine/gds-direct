import {getState} 	from "es6!../store";
import {getLang} 	from "es6!../language";
import {bubble_msg} from 'abstract/notifications';

export const  VALIDATE_STATE = () => {

	const {props, canMileAge, tour, canTour, isTourFare, clone, optionalTour, canPcc} = getState();

	const errors = {};

	if (!props.dump)
	{
		errors.dump = true;
	}

	if (canPcc && (!props.pcc || props.pcc === -1)) {
		errors.pcc = true;
	}

	let netValMandatory = !!props['detailsNotRequired'];

	if (canMileAge)
	{
		const mileageCodes = apiData['mileages'].filter( obj => obj.id === parseInt(props['mileage']) );

		if (mileageCodes.length > 0 && mileageCodes[0].code !== '07')
		{
			// console.warn('MileAge is Present so should check net val also');
			netValMandatory = true;
		}

		if (parseInt(props['mileage']) === 0)
		{
			errors.mileage = true;
		}
	}

	const error_pr = {}, minValue = [];

	props.prices.map( (price, index) => {

		error_pr[index] = {};

		if (!parseFloat(price.netVal) && netValMandatory)
		{
			error_pr[index].netVal = 'No net price';
		}

		if (!(parseFloat(price.selVal) >= 0))
		{
			error_pr[index].selVal = 'No selling price';
		}

		if (clone)
		{
			const minRange 	= parseFloat(price.markUp) + ( parseFloat(price.netVal) || 0 );

			if (minRange > parseFloat(price.selVal))
			{
				error_pr[index].selVal = getLang('minSellingPrice') + ' ' + minRange;
				minValue.push(`${price.name} ${getLang('minSellingPrice')} ${minRange}`);
			}
		}
	});

	if (minValue.length)
	{
		bubble_msg.warning(minValue.join('<br>'));
	}

	const hasErr = Object.keys(error_pr).map( obj => Object.keys(error_pr[obj])).filter( obj => obj.length > 0 );

	if (hasErr.length > 0)
	{
		errors.prices = error_pr;
	}

	if (isTourFare && canTour && optionalTour)
	{
		if (tour.hotel.randomHotel)
		{
			if (!tour.city.id)
			{
				errors.hotelCityId 	= 'Hotel City is Not Set';
			}

            if (!tour.date.checkIn || !tour.date.checkOut)
            {
                errors.dates = "Dates are not selected";
            }
		}
		else
		{
            if (!tour.hotel.address)
            {
                errors.hotelAddress = 'Hotel address is Not Set';
            }

            if (!tour.hotel.id && !tour.hotel.name)
            {
                errors.hotelId 	= 'Name of the hotel is Not Set';
            }

            if (!tour.hotel.id && !tour.city.id)
            {
                errors.hotelCityId 	= 'Hotel City is Not Set';
            }

            if (!tour.date.checkIn || !tour.date.checkOut)
            {
                errors.dates = "Dates are not selected";
            }
		}
	}

	return errors;
};