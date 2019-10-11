const xml = require('xml');
const _ = require('lodash');
const moment = require('moment');
const {getValueOrNullFromDomElement, getValueOrNullFromDomAttribute} = require('./Utils');

module.exports.buildItineraryXml = params => {
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

	if (soapError) {
		return {
			error: `Sabre soap error - ${soapError}`,
			newAirSegments: [],
			binarySecurityToken: null,
		};
	}

	const errors = _.map(body.querySelectorAll('EnhancedAirBookRS > ApplicationResults > Warning'),
		el => `Sabre warning - ${getValueOrNullFromDomElement(el, 'SystemSpecificResults > Message') || '(no message)'}`);

	const newAirSegments = _.map(body.querySelectorAll('EnhancedAirBookRS > OTA_AirBookRS > OriginDestinationOption > FlightSegment'), transformSegment);
	const pnrItinerary = parsePnrSegments(body.querySelector('ReservationItems'));

	if (newAirSegments.length < params.addAirSegments.length) {
		let postfix = `starting from #${newAirSegments.length + 1}`;
		if (newAirSegments.length === 0) {
			// sometimes Sabre returns no newAirSegments,
			// despite some segments _being_ added...
			postfix = !pnrItinerary.length ?  '(nothing added)' :
				`starting from #${pnrItinerary.length + 1}`;
		}
		errors.push(`Failed to add segments ${postfix}`);
	}

	return {
		binarySecurityToken: getValueOrNullFromDomElement(header, 'wsse\\:Security > wsse\\:BinarySecurityToken'),
		newAirSegments: newAirSegments,
		reservations: pnrItinerary,
		error: errors.length ? errors.join('; ') : null,
	};
};

const transformSegment = el => ({
	departureDt: transformDate(el.getAttribute('DepartureDateTime')),
	destinationDt: transformDate(el.getAttribute('ArrivalDateTime')),
	/** @deprecated, not sure if they are used anywhere... */
	departureDate: transformDate(el.getAttribute('DepartureDateTime')),
	/** @deprecated */
	destinationDate: transformDate(el.getAttribute('ArrivalDateTime')),
	airline: getValueOrNullFromDomAttribute(el, 'MarketingAirline', 'Code'),
	flightNumber: el.getAttribute('FlightNumber'),
	bookingClass: el.getAttribute('ResBookDesigCode'),
	departureAirport: getValueOrNullFromDomAttribute(el, 'OriginLocation', 'LocationCode'),
	destinationAirport: getValueOrNullFromDomAttribute(el, 'DestinationLocation', 'LocationCode'),
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
		'ns1:MarriageGrp': seg.isMarried === undefined ? null : seg.isMarried ? 'I' : 'O',
	}, {
		'ns1:OperatingAirline': cleanUpAttrs({_attr: {Code: seg.operatedByCode || seg.airline}}),
	}, {
		'ns1:OriginLocation': cleanUpAttrs({_attr: {LocationCode: seg.departureAirport}}),
	}, {
		'ns1:Equipment': seg.aircraft ? cleanUpAttrs({_attr: {AirEquipType: seg.aircraft}}) : null,
	}]),
});

const transformDate = val => {
	if (!val) {
		return null;
	}

	const [date, time] = val.split('T');

	// in reservation segment date is already with the year
	if (date.length === '2019-01-01'.length) {
		return {
			raw: val,
			parsed: date.substr('2019-'.length), // everywhere else parsed date is just date and month
			full: date + ' ' + time + ':00',
		};
	}

	return {
		raw: val,
		parsed: date,
	};
};

const cleanUpAttrs = attributes => {
	const r = Object.entries(attributes._attr || {}).reduce((acc, keyValuePair) => {
		// xml lib will add attributes regardless if they are set or not
		// so if something is null or undefined it will be added in attributes
		// with string value "null" or "undefined" respectively
		if (keyValuePair[1] !== undefined && keyValuePair[1] !== null) {
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
		.filter(property => property && Object.values(property)
			.some(v => v !== undefined && v !== null));

	return r.length > 0 ? r : null;
};

// Reservation might have multiple flight segment in one item in case of
// hidden stop, departure data is from first segment and destination data
// is from last one
const combineReservation = segments => {
	if (segments.length < 2) {
		return segments[0];
	}

	const departure = segments[0];
	const arrival = _.last(segments);

	return _.extend(departure, {
		destinationDate: arrival.destinationDate,
		destinationDt: arrival.destinationDt,
		destinationAirport: arrival.destinationAirport,
	});
};

const parsePnrSegments = items => {
	if (!items) {
		return [];
	}

	return _.map(items.querySelectorAll('Item'), item => {
		const segmentNumber = parseInt(item.getAttribute('RPH'), 10);

		const segments = _.map(item.querySelectorAll('FlightSegment'), transformSegment);

		const segment = combineReservation(segments);

		if (!segment) {
			return;
		}

		segment.segmentNumber = segmentNumber;

		return segment;
	}).filter(seg => seg);
};
