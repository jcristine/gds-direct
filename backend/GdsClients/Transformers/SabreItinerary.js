const xml = require('xml');
const _ = require('lodash');
const moment = require('moment');
const DateTime = require('../../Transpiled/Lib/Utils/DateTime');
const {getValueOrNullFromDomElement, getValueOrNullFromDomAttribute} = require('./Utils');

module.exports.buildItinaryXml = params => {
	const flightSegments = (params.addAirSegments || []).map(buildFlightSegment);

	return xml([
		{'ns1:EnhancedAirBookRQ': [{
			_attr: {
				version: '3.9.0',
				'xmlns:ns1': 'http://services.sabre.com/sp/eab/v3_9',
			},
		}, {
			'ns1:OTA_AirBookRQ': [{
				'ns1:OriginDestinationInformation': flightSegments,
			}],
		}, {
			'ns1:PostProcessing': filterEmpty([
				cleanUpAttrs({_attr: {IgnoreAfter: params.ignoreAfter ? 'true' : null}}),
				{'ns1:RedisplayReservation': params.redisplay ? '' : null},
			]),
		}, {
			'ns1:PreProcessing': filterEmpty([
				cleanUpAttrs({_attr: {IgnoreBefore: params.ignoreBefore ? 'true' : null}}),
				{'ns1:UniqueId': params.recordLocator ? cleanUpAttrs({_attr: {ID: params.recordLocator}}) : null},
			]),
		}]},
	]);
};

module.exports.parseItineraryXmlResponse = (dom, params) => {
	const header = dom.querySelector('soap-env\\:Header');
	const body = dom.querySelector('soap-env\\:Body');

	const soapError = getValueOrNullFromDomElement(dom, 'soap-env\\:Fault > detail > message');

	if(soapError) {
		return {
			error: `Sabre soap error - ${soapError}`,
			newAirSegments: [],
			binarySecurityToken: null,
		};
	}

	const errors = _.map(body.querySelectorAll('EnhancedAirBookRS > ApplicationResults > Warning'),
		el => `Sabre warning - ${getValueOrNullFromDomElement(el, 'SystemSpecificResults > Message') || '(no message)'}`);

	const airSegments = _.map(body.querySelectorAll('EnhancedAirBookRS > OTA_AirBookRS > OriginDestinationOption > FlightSegment'), transformSegment);

	if(airSegments.length < params.addAirSegments.length) {
		errors.push(`Failed to add segments starting from ${airSegments.length}-th`);
	}

	return {
		binarySecurityToken: getValueOrNullFromDomElement(header, 'wsse\\:Security > wsse\\:BinarySecurityToken'),
		newAirSegments: airSegments,
		error: errors.length ? errors.join('; ') : null,
	};
};

const transformSegment = el => ({
	departureDt: transformDate(el.getAttribute('DepartureDateTime')),
	destinationDt: transformDate(el.getAttribute('ArrivalDateTime')),
	airline: getValueOrNullFromDomAttribute(el, 'MarketingAirline', 'Code'),
	flightNumber: el.getAttribute('FlightNumber'),
	bookingClass: el.getAttribute('ResBookDesigCode'),
	destinationAirport: getValueOrNullFromDomAttribute(el, 'DestinationLocation', 'LocationCode'),
	departureAirport: getValueOrNullFromDomAttribute(el, 'OriginLocation', 'LocationCode'),
	segmentStatus: el.getAttribute('Status'),
	seatCount: el.getAttribute('NumberInParty'),
	eticket: el.getAttribute('eTicket') === 'true',
});

const buildFlightSegment = seg => ({
	'ns1:FlightSegment': filterEmpty([cleanUpAttrs({
		_attr: {
			DepartureDateTime: moment.utc(seg.departureDt).format('YYYY-MM-DD\\THH:mm'),
			ArrivalDateTime: seg.destinationDt ? moment.utc(seg.destinationDt).format('YYYY-MM-DD\\THH:mm') : undefined,
			FlightNumber: seg.flightNumber,
			NumberInParty: seg.seatCount,
			ResBookDesigCode: seg.bookingClass,
			Status: seg.segmentStatus,
		},
	}),{
		'ns1:DestinationLocation': cleanUpAttrs({_attr: {LocationCode: seg.destinationAirport}}),
	}, {
		'ns1:MarketingAirline': cleanUpAttrs({
			_attr: {
				Code: seg.airline,
				FlightNumber: seg.flightNumber,
			},
		}),
	}, {
		'ns1:MarriageGrp': seg.isMarried === undefined ? null : seg.isMarried ? 'O' : 'I',
	}, {
		'ns1:OperatingAirline': cleanUpAttrs({_attr: {Code: seg.operatedByCode || seg.airline}}),
	}, {
		'ns1:OriginLocation': cleanUpAttrs({_attr: {LocationCode: seg.departureAirport}}),
	}, {
		'ns1:Equipment': seg.aircraft ? cleanUpAttrs({_attr: {AirEquipType: seg.aircraft}}) : null,
	}]),
});

const transformDate = val => {
	if(!val) {
		return null;
	}

	const [date, time] = val.split('T');

	return `${DateTime.decodeRelativeDateInFuture(date, moment().format('YYYY-MM-DD'))} ${time}:00`;
};

const cleanUpAttrs = attributes => {
	const r = Object.entries(attributes._attr || {}).reduce((acc, keyValuePair) => {
		// xml lib will add atributes regardless if they are set or not
		// so if something is null or undefined it will be added in attributes
		// with string value "null" or "undefined" respectively
		if(keyValuePair[1] !== undefined && keyValuePair[1] !== null) {
			acc[keyValuePair[0]] = keyValuePair[1];
		}

		return acc;
	}, {});

	return Object.values(r).length > 0 ? {
		_attr: r,
	} : null;
};

// Original PHP code doesn't add sub properties that don't have any
// child elements/attributes
const filterEmpty = properties => {
	const r = properties
		.filter(property => property && Object.values(property).some(v => v));

	return r.length > 0 ? r : null;
};