
const Fp = require('../../../../../Lib/Utils/Fp.js');
const AbstractGdsAction = require('../../../../../Rbs/GdsAction/AbstractGdsAction.js');
const FqnParser = require('../../../../../Gds/Parsers/Apollo/FareRules/FqnParser.js');
const FnParser = require('../../../../../Gds/Parsers/Apollo/FareRules/FnParser.js');
const {fetchAll} = require('../../../../../../GdsHelpers/TravelportUtils.js');
const TravelportClient = require("../../../../../../GdsClients/TravelportClient");

/**
 * retrieves Fare Rules text per section of
 * each FARE COMPONENT listed by FQN command
 *
 * expects session be in a Pricing context
 */
const php = require('../../../../../phpDeprecated.js');

class ImportFareComponentsAction extends AbstractGdsAction {
	constructor() {
		super();
		this.usesXml = true;
		this.TravelportClient = TravelportClient();
	}

	useXml(flag) {
		this.usesXml = flag;
		return this;
	}

	setTravelportClient(client) {
		this.TravelportClient = client;
		return this;
	}

	async getRulesViaCli({fareComponentNumber, paragraphs}) {
		paragraphs = paragraphs || [];
		paragraphs = paragraphs.length > 0 ? paragraphs : ['ALL'];
		let cmd = 'FN' + fareComponentNumber + '/' + paragraphs.join('/');
		let cmdRec = await fetchAll(cmd, this);
		let lines = cmdRec.output.split('\n');
		// "  QUOTE\t1" is present only in terminal response
		lines.shift();
		let output = lines.join('\n');
		return {cmd, output};
	}

	async getComponentFareRules($fareNumber, $paragraphs) {
		let $sections, $cmdRecord, $dump, $number, $sectionsRecord, $error, $byNumber, $paragraph, $section,
			$sectionRecord;

		$sections = [];
		let params = {
			'fareComponentNumber': $fareNumber,
			'paragraphs': $paragraphs,
		};

		if(this.usesXml) {
			$cmdRecord = await this.TravelportClient.getFareRules(this.session.getGdsData(), params);
		} else {
			$cmdRecord = await this.getRulesViaCli(params);
		}

		$dump = $cmdRecord['output'];

		$sectionsRecord = FnParser.parse($dump);

		if ($error = ($sectionsRecord['error'])) {
			$byNumber = {};
		} else {
			$byNumber = php.array_combine(php.array_column($sectionsRecord['sections'], 'sectionNumber'), $sectionsRecord['sections']);
		}

		for ($paragraph of Object.values($paragraphs)) {
			if ($error) {
				$section = {'error': $error};
				$sections[$paragraph] = $section;
			} else if ($sectionRecord = $byNumber[$paragraph]) {
				$sections[$paragraph] = $sectionRecord;
			}
		}

		return {
			'sections': $sections,
			'cmdRec': $cmdRecord,
		};
	}

	async execute($sectionCodes, $subPricingNumber) {
		let $cmd, $dump, $fqn, $error, $i, $comp, $num, $paragraphs, $rules;

		$cmd = 'FQN' + $subPricingNumber;
		let cmdRec = await this.runCmd($cmd);
		$dump = cmdRec.output;
		$fqn = FqnParser.parse($dump);
		if ($error = $fqn['error']) {
			$error = 'Failed to parse Fare Component List - ' + $error;
			return {'error': $error};
		}

		let $comps = $fqn['components'];
		for ([$i, $comp] of Object.entries($comps)) {
			$num = $comp['componentNumber'];
			$paragraphs = Fp.filter('is_numeric', $sectionCodes);
			if ($paragraphs) {
				$rules = await this.getComponentFareRules($num, $paragraphs);
				$comps[$i]['ruleSections'] = $rules['sections'];
				$comps[$i]['cmdRec'] = $rules['cmdRec'];
			}
		}

		return {
			'fareList': $comps,
			'cmdRec': cmdRec,
		};
	}
}

module.exports = ImportFareComponentsAction;
