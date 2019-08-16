const {findSegmentNumberInPnr} = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Common/ItinerarySegments');
const {expect} = require('chai');

const defaultSegment = {
	airline: 'PR',
	bookingClass: 'C',
	departureAirport: 'JFK',
	departureDate: {
		parsed: '05-20',
		raw: '20MAY',
	},
	departureDt: {
		full: '2020-05-20 01:45:00',
		parsed: '05-20 01:45',
	},
	destinationAirport: 'MNL',
	flightNumber: '127',
	raw: '1 PR 127C 20MAY JFKMNL SS1   145A  615A|*      WE/TH   E',
	seatCount: 1,
	segmentNumber: 1,
	segmentStatus: 'SS',
};

class ItinerarySegmentsTest extends require('../../../../../../../backend/Transpiled/Lib/TestCase.js') {
	getThrowingCases()	{
		const l = [];

		l.push({
			title: 'Throw when no segment can be found in reservation',
			input: {
				segment: defaultSegment,
				reservations: [{
					airline: 'PR',
					bookingClass: 'Y',
					departureAirport: 'WAS',
					departureDate: {
						parsed: '2020-05-20',
						raw: '20200520',
					},
					destinationAirport: 'MNL',
					flightNumber: '127',
					segmentNumber: '1',
					segmentStatus: 'GK',
				}, {
					airline: 'AY',
					bookingClass: 'Z',
					confirmedByAirlineIndicator: '',
					dayOffset: '00',
					departureAirport: 'RIX',
					departureDate: {
						parsed: '2020-05-28',
						raw: '20200528',
					},
					destinationAirport: 'HEL',
					flightNumber: '1072',
					scheduleValidationIndicator: '',
					seatCount: '1',
					segmentNumber: '2',
					segmentStatus: 'GK',
				}],
			},
		});

		return l.map(c => [c]);
	}

	getPassingCases() {
		const l = [];

		l.push({
			title: 'Return segments number if there are no reservations',
			input: {
				segment: defaultSegment,
				reservations: null,
			},
			output: 1,
		});

		l.push({
			title: 'Return reservations number if reservation can be found',
			input: {
				segment: defaultSegment,
				reservations: [{
					airline: 'PR',
					bookingClass: 'Y',
					departureAirport: 'JFK',
					departureDate: {
						parsed: '2020-05-20',
						raw: '20200520',
					},
					destinationAirport: 'MNL',
					flightNumber: '127',
					segmentNumber: '13',
					segmentStatus: 'GK',
				}],
			},
			output: '13',
		});

		return l.map(c => [c]);
	}

	testThrowing({input})	{
		expect(() => findSegmentNumberInPnr(input.segment, input.reservations))
			.to.throw();
	}

	testPassing({input, output}) {
		expect(findSegmentNumberInPnr(input.segment, input.reservations))
			.to.be.equal(output);
	}

	getTestMapping() {
		return [
			[this.getThrowingCases, this.testThrowing],
			[this.getPassingCases, this.testPassing],
		];
	}
}
module.exports = ItinerarySegmentsTest;
