
const ArrayUtil = require('../../Lib/Utils/ArrayUtil.js');
const LocationGeographyProvider = require('../../Rbs/DataProviders/LocationGeographyProvider.js');
const FareRuleParser = require('../../Gds/Parsers/Amadeus/Pricing/FareRuleParser.js');
const AbstractGdsAction = require('./AbstractGdsAction.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const AmadeusUtil = require("../../../GdsHelpers/AmadeusUtils");

/** from current pricing */
class AmadeusGetFareRulesAction extends AbstractGdsAction {
	constructor() {
		super();
		this.$tzProvider = null;
	}

	setTzProvider($tzProvider) {
		this.$tzProvider = $tzProvider;
		return this;
	}

	getTzProvider() {
		return this.$tzProvider
			|| (this.$tzProvider = new LocationGeographyProvider());
	}

	/**
	 * @param $components = [FareRuleParser::parseComponentLine(), ...]
	 * @param $itinerary = AmadeusPnrCommonFormatAdapter::transformItinerary()
	 */
	async addSegmentNumbersToFares($components, $itinerary) {
		$itinerary = [...$itinerary];
		let $fareComponents, $i, $component, $segmentNumbers, $first, $dprt, $dstn, $rSeg;

		$fareComponents = [];
		for ([$i, $component] of Object.entries($components)) {
			$segmentNumbers = [];
			$first = true;
			$dprt = null;
			$dstn = null;
			while ($rSeg = php.array_shift($itinerary)) {
				if ($first) {
					$first = false;
					$dprt = $rSeg['departureAirport'];
					if (await this.getTzProvider().doesBelongToCity($dprt, $component['departureCity'])) {
						$segmentNumbers.push($rSeg['segmentNumber']);
					} else {
						break;
					}
				} else {
					$segmentNumbers.push($rSeg['segmentNumber']);
				}
				$dstn = $rSeg['destinationAirport'];
				if (await this.getTzProvider().doesBelongToCity($dstn, $component['destinationCity'])) {
					break;
				}
			}
			$fareComponents.push({
				componentNumber: $component['componentNumber'],
				segmentNumbers: $segmentNumbers,
				departureAirport: $dprt,
				destinationAirport: $dstn,
				fareBasis: $component['fareBasis'],
			});
		}
		return $fareComponents;
	}

	static makeCmd($fxNum, $sections, $fareNum) {

		return 'FQN' + $fxNum +
			($fareNum ? '-' + $fareNum : '') +
			($sections ? '*' + php.implode(',', $sections) : '');
	}

	/** @param $parsed = FareRuleParser::parse()['data'] */
	static transformSingleFare($parsed, $dumpNumber, $itinerary) {

		return {
			componentNumber: $parsed['fareComponent']['componentNumber'],
			dumpNumber: $dumpNumber,
			fareBasis: $parsed['fareComponent']['fareBasis'],
			ruleRecords: $parsed['sections'],
			segmentNumbers: php.array_column($itinerary, 'segmentNumber'),
			departureAirport: (ArrayUtil.getFirst($itinerary) || {})['departureAirport'],
			destinationAirport: (ArrayUtil.getLast($itinerary) || {})['destinationAirport'],
		};
	}

	async amadeusFx($cmd) {
		return (await AmadeusUtil.fetchAllFx($cmd, this)).output;
	}

	async execute($fxPaxNum, $sections, $itinerary) {
		let $cmd, $dump, $mainDumpNumber, $parsed, $fares, $type, $i, $cmpParsed, $error;

		$cmd = this.constructor.makeCmd($fxPaxNum, $sections);
		$dump = await this.amadeusFx($cmd);

		$parsed = FareRuleParser.parse($dump);
		$fares = [];
		$type = $parsed['type'];
		if ($type === 'rulesDisplay') {
			// single rules component
			$fares.push(this.constructor.transformSingleFare($parsed['data'], $mainDumpNumber, $itinerary));
		} else if ($type === 'componentList') {
			// multiple rules components
			$fares = await this.addSegmentNumbersToFares($parsed['data'], $itinerary);
			for ($i = 0; $i < php.count($fares); ++$i) {
				$cmd = this.constructor.makeCmd($fxPaxNum, $sections, $fares[$i]['componentNumber']);
				$dump = await this.amadeusFx($cmd);
				$cmpParsed = FareRuleParser.parse($dump);
				if ($error = $cmpParsed['error']) {
					return {error: 'Failed to parse rules of ' + $i + '-th component - ' + $error};
				} else {
					$fares[$i]['ruleRecords'] = $cmpParsed['data']['sections'];
				}
			}
		} else {
			return {error: 'Failed to parse Fare Rules header - ' + ($parsed['error'] || 'unknown type display ' + $type)};
		}
		return {
			fareList: $fares,
		};
	}
}

module.exports = AmadeusGetFareRulesAction;
