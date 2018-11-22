import {Sender} from "es6!./send";
import {SenderTerminal} from "es6!./sendTerminal";

import {VALIDATE_STATE} from "es6!./validate";
import Notify from 'abstract/notifications'
import {getState} from "es6!../store";
import {formatHotelDate} from "../tour";

export const CLICK_EVENT = ({key, value}) => {
	return {type: 'TOUR', hotel: {...getState().tour.hotel, ...{[key] : value}}}
};

export const UPDATE = ({key, value}) => {
	return {type : 'UPDATE', [key] : value};
};

export const PCC_UPDATE = ({key, value}) => {
	return {type : 'PCC_UPDATE', pcc : value};
};

export const TOUR_SET = ({key, value = false} = {}) => {
	return {type : 'TOUR', [key] : value}
};

export const TOUR_DATE_SET = (dates) => {
	return {
		type : 'TOUR',
		date : {
			checkIn		: formatHotelDate(dates[0]),
			checkOut 	: formatHotelDate(dates[1])
		}
	}
};

export const TOUR_CITY_SET = ({id, name, label} = {}) => {
	return {type : 'TOUR', city : {id, label}}
};

export const TOUR_HOTEL_UPDATE = (updateInfo) => {
    return {type: 'TOUR', hotel: {...getState().tour.hotel, ...updateInfo}}
};

export const TOUR_HOTEL_SET = ({label, id, location} = {}) => {
	return {type: 'TOUR', hotel: {id, name: label, address: location.address}}
};

export const RESET = ({key, value = false} = {}) => {
	return {type : 'RESET', [key] : value}
};

export const CLOSE = () => {
	return {type : 'CLOSE'};
};

export const PRICE_CHANGE = (props) => {
	return {type : 'PRICE_CHANGE', ...props};
};

export const COPY_NET_VAL = (props) => {
	return {type : 'COPY_NET_VAL', ...props};
};

export const SHOW_ERRORS = (err) => {
	return {type : 'VALIDATE', ...err};
};

export const CREATE = () => {
	const errors = VALIDATE_STATE();
	const hasErr = Object.keys(errors).filter( obj => obj.length > 0 );

	if (hasErr.length > 0)
	{
		Notify.bubble_msg.warning('Some Fields Contains invalid data');
		return Promise.reject(errors);
	} else
	{
		const {terminal} = getState();
		return terminal ? SenderTerminal.send() : Sender.send();
	}
};