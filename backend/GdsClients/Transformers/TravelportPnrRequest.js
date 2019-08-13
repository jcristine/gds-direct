const DecodeTravelportError = require('./DecodeTravelportError.js');
const {parseXml} = require("../../GdsHelpers/CommonUtils.js");
const UnprocessableEntity = require("klesun-node-tools/src/Rej").UnprocessableEntity;

const js2xml = require("xml");
const _ = require("lodash");
const moment = require("moment");
const {getValueOrNullFromDomElement} = require('./Utils');

// Builds xml body of a PNR soap request
module.exports.buildPnrXmlDataObject = params => js2xml([
	{SessionMods: [
		{AreaInfoReq: null},
	]},
	{AirSegSellMods: (params.addAirSegments || [])
		.map(transformAirSegmentForSoap)
		.map(v => ({AirSegSell: v}))},
	// note, position of <PNRBFRetrieveMods/> element is important: if it were placed before
	// <AirSegSellMods/>, it would not include the newly added segments with their numbers
	// the code outside is expecting them to be included, so let's make sure this element is always in the end
	{PNRBFRetrieveMods: [params.recordLocator ?
		{PNRAddr: [{RecLoc: params.recordLocator}]} : {CurrentPNR: null},
	]},
]);

// parses travelport soap request response body and build corresponding object
module.exports.parsePnrXmlResponse = async response => {
	const dom = parseXml(response);

	const respElement = dom.querySelector("PNRBFManagement_51");

	if(!respElement) {
		throw UnprocessableEntity.makeExc("Missing PNRBFManagement_51 element in response", response);
	}

	const airSegmentElement = respElement.querySelectorAll("AirSeg") || [];
	const sellSegmentElement = respElement.querySelector("AirSegSell");

	const airSellResult = transformAirSellSegFromSoap(sellSegmentElement);

	return {
		error: collectErrors(respElement, airSellResult),
		reservation: {
			itinerary: _.map(airSegmentElement, transformAirSegmentFromSoap),
		},
		newAirSegments: airSellResult.sell,
	};
};

// In soap response it is yyyymmdd without any delimiters
const transformDateFromSoap = date => {
	if(!/^\d{8}$/.test(date)) {
		return null;
	}

	const y = date.substr(0, 4);
	const m = date.substr(4, 2);
	const d = date.substr(6, 2);

	return {
		raw: date,
		parsed: y + '-' + m + '-' + d,
	};
};

// In soap response it is as (h)hmm(ss) without any delimiters
const transformTimeFromSoap = time => {
	if(!time) {
		return null;
	}

	const paddedDate = _.padStart(time, 4, '0');

	const h = paddedDate.substr(0, 2);
	const m = paddedDate.substr(2, 2);
	const s = paddedDate.substr(4, 2) || '00';

	return {
		raw: paddedDate,
		parsed: h + ':' + m + ':' + s,
	};
};

const transformAirSegmentFromSoap = element => ({
	segmentNumber: getValueOrNullFromDomElement(element, 'SegNum'),
	segmentStatus: getValueOrNullFromDomElement(element, 'Status'),
	departureDate: transformDateFromSoap(getValueOrNullFromDomElement(element, 'Dt')),
	dayOffset: getValueOrNullFromDomElement(element, 'DayChg'),
	airline: getValueOrNullFromDomElement(element, 'AirV'),
	seatCount: getValueOrNullFromDomElement(element, 'NumPsgrs'),
	departureAirport: getValueOrNullFromDomElement(element, 'StartAirp'),
	destinationAirport: getValueOrNullFromDomElement(element, 'EndAirp'),
	departureTime: transformTimeFromSoap(getValueOrNullFromDomElement(element, 'StartTm')),
	destinationTime: transformTimeFromSoap(getValueOrNullFromDomElement(element, 'EndTm')),
	bookingClass: getValueOrNullFromDomElement(element, 'BIC'),
	flightNumber: getValueOrNullFromDomElement(element, 'FltNum'),
	marriage: getValueOrNullFromDomElement(element, 'MarriageNum'),
	statusOld: getValueOrNullFromDomElement(element, 'PrevStatusCode'),
	confirmedByAirlineIndicator: getValueOrNullFromDomElement(element, 'VndLocInd'),
	isFlown: getValueOrNullFromDomElement(element, 'FltFlownInd') === 'Y',
	scheduleValidationIndicator: getValueOrNullFromDomElement(element, 'ScheduleValidationInd'),
});

const transformAirSellFromSoap = element => ({
	success: getValueOrNullFromDomElement(element, 'SuccessInd') === 'Y',
	displaySequenceNumber: getValueOrNullFromDomElement(element, 'DisplaySequenceNumber'),
	airline: getValueOrNullFromDomElement(element, 'Vnd'),
	flightNumber: getValueOrNullFromDomElement(element, 'FltNum'),
	bookingClass: getValueOrNullFromDomElement(element, 'Class'),
	departureDate: transformDateFromSoap(getValueOrNullFromDomElement(element, 'StartDt')),
	dayOffset: getValueOrNullFromDomElement(element, 'DtChg'),
	departureAirport: getValueOrNullFromDomElement(element, 'StartAirp'),
	destinationAirport: getValueOrNullFromDomElement(element, 'EndAirp'),
	departureTime: transformTimeFromSoap(getValueOrNullFromDomElement(element,'StartTm')),
	destinationTime: transformTimeFromSoap(getValueOrNullFromDomElement(element, 'EndTm')),
	segmentStatus: getValueOrNullFromDomElement(element, 'Status'),
	seatCount: getValueOrNullFromDomElement(element, 'NumPsgrs'),
	marriage: getValueOrNullFromDomElement(element, 'MarriageNum'),
	aircraftChanges: getValueOrNullFromDomElement(element, 'COG') === 'Y',
	eticket: getValueOrNullFromDomElement(element, 'TklessInd') === 'Y',
	isStopover: getValueOrNullFromDomElement(element, 'StopoverInd') === 'Y',
	operatedByCode: getValueOrNullFromDomElement(element, 'OpAirV'),
	messages: [],
});

const transformAirSellSegFromSoap = element => {
	const result = {
		error: null,
		sell: [],
	};

	if(!element) {
		return result;
	}

	_.forEach(element.children, childEl => {
		if(childEl.tagName === "AirSell") {
			result.sell.push(transformAirSellFromSoap(childEl));
			return;
		}

		if(childEl.tagName === "TextMsg" && result.sell.length > 0) {
			_.last(result.sell).messages.push(getValueOrNullFromDomElement(childEl, "Txt") || '');
			return;
		}

		if(childEl.tagName === "ErrText" && result.sell.length > 0) {
			_.last(result.sell).error = getValueOrNullFromDomElement(childEl, "Text");
			return;
		}

		if(childEl.tagName === "ErrText") {
			result.error = getValueOrNullFromDomElement(childEl, "Text");
			return;
		}
	});

	return result;
};

// single entry in newAirSegments
const transformAirSegmentForSoap = segment => {
	const dateRegex = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;
	const hasBothDateTimes = dateRegex.test(segment.departureDt) && dateRegex.test(segment.destinationDt);

	const departureTime = hasBothDateTimes
		? moment.utc(segment.departureDt).format("HHmm") : null;
	const destinationTime = hasBothDateTimes
		? moment.utc(segment.destinationDt).format("HHmm") : null;
	const dayOffset = hasBothDateTimes
		? moment.utc(segment.destinationDt).diff(moment.utc(segment.departureDt), "days") : null;

	return [
		{Vnd: segment["airline"]},
		{FltNum: _.padStart(segment.flightNumber, 4, "0")},
		{Class: segment.bookingClass},
		{StartDt: moment.utc(segment.departureDt).format("YYYYMMDD")},
		{StartAirp: segment.departureAirport},
		{EndAirp: segment.destinationAirport},
		{Status: segment.segmentStatus},
		{NumPsgrs: segment.seatCount},
		{StartTm: departureTime},
		{EndTm: destinationTime},
		{DtChg: dayOffset},
		{AvailDispType: 'G'},
	];
};

const collectErrors = (dom, sellSegments) => {
	const errors = [];

	const overallError = getValueOrNullFromDomElement(dom.querySelector("PNRBFRetrieve > ErrText"), "Text");
	const transactionErrorCode = getValueOrNullFromDomElement(dom.querySelector("TransactionErrorCode"), "Code");

	if(overallError) {
		errors.push(overallError);
	}

	if(sellSegments.error) {
		errors.push('Failed to sell segments - ' + sellSegments.error);
	}

	sellSegments.sell
		.filter(sell => sell.error)
		.forEach(sell => errors.push('Failed to sell 0'
			+ sell.airline
			+ sell.flightNumber
			+ sell.bookingClass
			+ moment.utc(sell.departureDate.parsed).format("DDMMM").toUpperCase()
			+ sell.departureAirport
			+ sell.destinationAirport
			+ sell.segmentStatus
			+ (sell.seatCount || '1')
			+ ' - ' + sell.error));

	// code 1 means something like "partial success with warnings"
	if (transactionErrorCode && transactionErrorCode != 1) {
		let decoded = DecodeTravelportError(transactionErrorCode);
		let error = 'Transaction error #' + transactionErrorCode +
			' (' + (decoded || 'unknown code') + ')';
		errors.push(error);
	}

	return errors.length > 0 ? errors.join("; ") : null;
};
