// namespace Gds\Parsers\Apollo\ApolloSvcParser;

const php = require('../../../../phpDeprecated.js');

class ApolloSvcParserDataWriter {
	static make() {
		return new this();
	}

	constructor() {
		this.$segments = [];
		this.$currentSegment = null;
		this.$currentLeg = null;
	}

	finalizeSegment() {
		if (this.$currentSegment) {
			this.finalizeLeg();
			this.$segments.push(this.$currentSegment);
			this.$currentSegment = null;
		}
	}

	startNewSegment($data) {
		this.finalizeSegment();
		this.$currentSegment = {
			'segmentNumber': $data['segmentNumber'],
			'airline': $data['airline'],
			'flightNumber': $data['flightNumber'],
			'bookingClass': $data['bookingClass'],

			'departureTerminal': null,
			'arrivalTerminal': null,
			'operatedByText': '',
			'miscInfoText': '',

			'legs': [],
		};
	}

	finalizeLeg() {
		if (this.$currentLeg) {
			this.$currentSegment['legs'].push(this.$currentLeg);
			this.$currentLeg = null;
		}
	}

	/** @param $data = ApolloSvcParser::parseSegmentStartLine() */
	startNewLeg($data) {
		this.finalizeLeg();
		this.$currentLeg = {
			'departureAirport': $data['departureAirport'],
			'destinationAirport': $data['destinationAirport'],
			'aircraft': $data['aircraft'],
			'mealOptions': $data['mealOptions'],
			'mealOptionsParsed': $data['mealOptionsParsed'],
			'flightDuration': $data['flightDuration'],

			'inFlightServicesText': '',
		};
	}

	segmentStartLineFound($data) {
		if (!$data['isHiddenSegment']) {
			this.startNewSegment($data);
		}
		this.startNewLeg($data);
	}

	operatedByLineFound($data) {
		this.$currentSegment['operatedByText'] = $data['text'];
	}

	airportTerminalInfoLineFound($data) {
		this.$currentSegment['departureTerminal'] = $data['departureTerminal'];
		this.$currentSegment['arrivalTerminal'] = $data['arrivalTerminal'];
	}

	inFlightServicesLineFound($data) {
		this.$currentLeg['inFlightServicesText'] += this.$currentLeg['inFlightServicesText'] ? php.PHP_EOL + $data['text'] : $data['text'];
	}

	miscInfoLineFound($data) {
		this.$currentSegment['miscInfoText'] += this.$currentSegment['miscInfoText'] ? php.PHP_EOL + $data['text'] : $data['text'];
	}

	getData() {
		this.finalizeSegment();
		return this.$segments;
	}
}

module.exports = ApolloSvcParserDataWriter;
