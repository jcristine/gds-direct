import Helper from 'abstract/helper';
import App from "../../../../../../application";

const Moment 	= require('moment');
const DATE_FORMAT = 'YYYY-MM-DD';

const getFirstDestination = destinations => {

	if (!Array.isArray(destinations))
	{
		destinations = Helper.objectToArray(destinations)
			.filter(routes => routes[1])
			.map(route => route[1]);
	}

	return destinations.filter(route => route.isDestination)[0] || {};
};

const getDefCity = ({destinationCityName, destinationCountryName}) => (
	(destinationCountryName && destinationCityName) ? destinationCityName + ', '  + destinationCountryName : ''
);

export const formatHotelDate = (date) => date ? Moment(date).format(DATE_FORMAT) : null;


export const dateFromTo = ({departureDateMin}, destinationDateTime) => {
	const 	today 	= Moment();
	let 	from 	= !destinationDateTime || today.isAfter(destinationDateTime) ? Moment(departureDateMin) : Moment(destinationDateTime);

	if (today.isAfter(from)) {
		from = today;
	}

	return {
		checkIn		: from.format(DATE_FORMAT),
		checkOut	: Moment(from).add(3, 'days').format(DATE_FORMAT)
	};
};

export const tourDefData = (destinationDateTime = null) => {

	const destination = getFirstDestination(App.get('lead').destinations);

	return {
		adults 			: destination ? destination.adults : 1,
		children 		: destination ? destination.childs : 0,
		rooms			: 1,

		date 			: dateFromTo(destination, destinationDateTime),

		city 			: {
			id 		: destination ? destination.destinationCityId 		: null,
			label	: getDefCity(destination)
		},

		hotel 			: {
			id		: '',
            name	: '',
			address : '',
			randomHotel : 0
		}
	}
};

export const tourDefDataClone = (destination, destinationDateTime = null) => {

	if (!destination)
		return  tourDefData(destinationDateTime);

	const {hotelData} = destination;

	return {
		adults 			: destination.adults,
		children 		: destination.children,
		rooms			: 1,

		date 			: {
			checkIn 	: destination.checkInDate,
			checkOut 	: destination.checkOutDate,
			arrivalTime	: destinationDateTime
		},

		city 			: {
			id 		: hotelData.cityId,
			label	: hotelData.cityName + ', ' + hotelData.countryName
		},

        hotel 			: {
            id		: hotelData.foreignId,
            name	: hotelData.name,
            address : hotelData.address,
            randomHotel : hotelData.randomHotel
        }
	}
};


export const tourTerminalData = destination => {

	if (!destination)
	{
		return  tourDefData();
	}

	destination = getFirstDestination(destination);

	const checkOutDate 	= destination.destinationDate ? Moment(destination.destinationDate).add(3, 'days').format(DATE_FORMAT) : '';
	const cityName 		= destination['destinationCityName'] + ', ' + destination['destinationCountryName'];

	return {
		adults 			: destination.adults,
		children 		: destination.childs,
		rooms			: 1,

		date 			: {
			checkIn 	: formatHotelDate(destination.destinationDate),
			checkOut 	: formatHotelDate(checkOutDate),
		},

		city 			: {
			id 		: destination.destinationCityId,
			label	: cityName
		},

		hotel			: {
			id		: '',
			name	: '',
			address	: '',
            randomHotel : 0
		}
	}
};