// namespace Rbs\Process\Apollo\ImportPnr\Actions;

const FareRuleOrSegmentsParser = require('../../../../../Gds/Parsers/Sabre/FareRuleOrSegmentsParser.js');
const FareRuleParser = require('../../../../../Gds/Parsers/Sabre/FareRuleParser.js');
const ImportSabrePnrFormatAdapter = require('../../../../../Rbs/Process/Sabre/ImportPnr/ImportSabrePnrFormatAdapter.js');
const AbstractGdsAction = require('../../../../GdsAction/AbstractGdsAction.js');

const php = require('../../../../../php.js');

class ImportSabreFareRulesActions extends AbstractGdsAction {
	static makeCmd($sections, $ptc, $segmentNumber) {
		return 'WPRD*' + php.implode('¥', php.array_filter([
			// order matters apparently
			($ptc ? 'P' + $ptc : ''),
			($sections ? 'C' + php.implode('/', $sections) : ''),
			($segmentNumber ? 'S' + $segmentNumber : ''),
		]));
	}

	/**
	 * @param $pricing = ImportSabrePnrFormatAdapter::transformPricing()
	 * @param $itinerary = ImportSabrePnrFormatAdapter::transformReservation()['itinerary']
	 * supposes session is in a pricing context
	 */
	async execute($pricing, $itinerary, $sections, $ptc) {
		let $wprdCmd, $wprdDump, $rulesOrSegments, $fareListRecord, $fareData, $segmentNumber, $cmd, $cmpDump,
			$ruleRecord;

		$wprdCmd = this.constructor.makeCmd($sections, $ptc);
		$wprdDump = (await this.runCmd($wprdCmd)).output;
		$rulesOrSegments = FareRuleOrSegmentsParser.parse($wprdDump);
		$fareListRecord = ImportSabrePnrFormatAdapter.transformFareListFromWprd($rulesOrSegments, $pricing, $itinerary);

		if (php.count($fareListRecord['fareList'] || []) > 1) {
			// the dump was list, not single Fare Rule
			for ($fareData of Object.values($fareListRecord['fareList'])) {
				$segmentNumber = $fareData['segmentNumbers'][0];
				$cmd = this.constructor.makeCmd($sections, $ptc, $segmentNumber);
				$cmpDump = (await this.runCmd($cmd)).output;
				$ruleRecord = FareRuleParser.parse($cmpDump);
				$ruleRecord['componentNumber'] = $fareData['componentNumber'];
				$fareListRecord['ruleRecords'].push($ruleRecord);
			}
		}

		return $fareListRecord;
	}
}

module.exports = ImportSabreFareRulesActions;
