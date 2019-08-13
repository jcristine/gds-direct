
const DateTime = require('../../../Lib/Utils/DateTime.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const GalCmdParser = require('../../../Gds/Parsers/Galileo/CommandParser.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
const separateWithLex = require("./Helper").separateWithLex;
const {translatePaxes} = require('../../../../Actions/CmdTranslators/TranslatePricingCmd.js');

/** @deprecated - should drop once TranslatePricingCmd.js supports all formats */
class TranslatePricingCmdAction {
	constructor() {
		this.$baseDate = null;
	}

	setBaseDate($baseDate) {

		this.$baseDate = $baseDate;
		return this;
	}

	static preFormat($gds, $input) {

		if ($gds == 'apollo') {
			$input = php.preg_replace('#\u00A4#', '@', $input);
		}
		return $input;
	}

	static preFormatPrefix($gds, $input) {
		let $matches;

		if ($gds == 'apollo') {
			if (php.preg_match('#^((?:T:)?\\$B(?:B[A0]?)?)(/?)(.*)$#', $input, $matches = [])) {
				$input = $matches[1] + '/' + $matches[3];
				$input = php.trim($input, '/');
			}
		} else if ($gds == 'sabre') {
			$input = php.preg_replace('#^WP(?!¥)(?!$)#', 'WP¥', $input);
		}
		return $input;
	}

	static deleteSeparator($gds, $key, $input) {

		if ($gds == 'apollo' && $key != 'cabin') {
			$input = php.preg_replace('#^/#', '', $input);
		} else if ($gds == 'sabre') {
			$input = php.preg_replace('#^¥#', '', $input);
		} else if ($gds == 'amadeus') {
			$input = php.preg_replace('#^/#', '', $input);
		}
		return $input;
	}

	static translateSegments($value, $fromGds, $toGds) {
		let $replace;

		$replace = {
			'apollo': ['*', '|', '+'],
			'galileo': ['-', '.', '.'],
			'sabre': ['-', '/', '/'],
			'amadeus': ['-', ',', ','],
		};
		$value = php.preg_replace('#\\' + $replace[$fromGds][0] + '#', $replace[$toGds][0], $value);
		$value = php.preg_replace('#\\' + $replace[$fromGds][1] + '#', $replace[$toGds][1], $value);
		$value = php.preg_replace('#\\' + $replace[$fromGds][2] + '#', $replace[$toGds][2], $value);
		return $value;
	}

	static translateValidating($value, $fromGds, $toGds) {

		return this.translateTwoPartVariable($value, 'validating', '#(.+?)([A-Z\\d]{2})$#', $fromGds, $toGds);
	}

	static translateSpecClass($value, $fromGds, $toGds) {

		return this.translateTwoPartVariable($value, 'specClass', '#(.+?)([A-Z\\d]{1})$#', $fromGds, $toGds);
	}

	static translateCurrency($value, $fromGds, $toGds) {

		return this.translateTwoPartVariable($value, 'currency', '#(.+?)([A-Z]{3})$#', $fromGds, $toGds);
	}

	static makeGdsFullDate($full) {

		return php.strtoupper(php.date('dMy', php.strtotime($full)));
	}

	translateTicketDate($value, $fromGds, $toGds) {
		let $fromPrefix, $toPrefix, $gdsDate, $partial, $full;

		$fromPrefix = (this.constructor.commandPartTranslationLibrary('ticketDate', $fromGds) || {})[1];
		$toPrefix = (this.constructor.commandPartTranslationLibrary('ticketDate', $toGds) || {})[1];
		if (!$toPrefix || !$fromPrefix ||
			!StringUtil.startsWith($value, $fromPrefix)
		) {
			return null;
		}
		$gdsDate = php.substr($value, php.strlen($fromPrefix));
		$partial = require('../../../Gds/Parsers/Apollo/CommonParserHelpers.js').parsePartialDate($gdsDate);
		if (this.$baseDate && $partial) {
			$full = DateTime.decodeRelativeDateInFuture($partial, this.$baseDate);
			$gdsDate = this.constructor.makeGdsFullDate($full);
		}
		return $toPrefix + $gdsDate;
	}

	static translateCommission($value, $fromGds, $toGds) {

		return this.translateTwoPartVariable($value, 'commission', '#(.+?)(\\d+)$#', $fromGds, $toGds);
	}

	static translateFareBase($value, $fromGds, $toGds) {

		$value = php.trim($value, '/');
		return this.translateTwoPartVariable($value, 'fareBase', '#(Q|@|L-)(.+)$#', $fromGds, $toGds);
	}

	static translateTwoPartVariable($value, $varName, $filter, $fromGds, $toGds) {
		let $matches, $caseVar;

		if (php.preg_match($filter, $value, $matches = [])) {
			$caseVar = this.translateCaseVariable($varName, $matches[1], $fromGds, $toGds);
			if ($caseVar) {
				return $caseVar + $matches[2];
			}
		}
		return null;
	}

	static glueTranslatedData($data, $toGds) {
		let $separator, $pricing, $sortArray, $ordered, $modsPart, $command, $baseCmd, $paxes, $rMod;

		$separator = '';
		if ($toGds == 'apollo') {
			$pricing = php.implode('', [
				$data['store'] || '',
				$data['pricing'],
				$data['booking'] || '',
			]);
			delete ($data['store']);
			delete ($data['pricing']);
			delete ($data['booking']);

			$sortArray = {
				'segments': null,
				'singlePax': null,
				'paxes': null,
				'cabin': null,
				'currency': null,
				'fareBase': null,
				'specClass': null,
				'validating': null,
				'fareType': null,
				'commission': null,
			};
			$ordered = php.array_filter(php.array_merge($sortArray, $data));
			if (php.array_search('cabin', php.array_keys($ordered)) > 0) {
				// cabin is not first, keep just one "/" so
				// that after implode it was //@Y, not ///@Y
				$ordered['cabin'] = '/' + php.ltrim($ordered['cabin'], '/');
			}
			$modsPart = php.implode('/', $ordered);
			if (StringUtil.startsWith($modsPart, 'C') || // /CUA
				StringUtil.startsWith($modsPart, 'A') // /ACC
			) {
				// must be explicitly separated from $BBC and $BBA
				// it would be better to always add "/", but 274. test cases
				$separator = '/';
			}
			$command = $pricing + $separator + $modsPart;
		} else if ($toGds == 'galileo') {
			$baseCmd = $data['pricing'] + ($data['booking'] || '');
			delete ($data['pricing']);
			delete ($data['booking']);
			$data = php.array_filter($data);
			$command = $baseCmd + php.implode('/', $data);
		} else if ($toGds == 'sabre') {
			$sortArray = {
				'booking': null,
				'store': null,
				'segments': null,
				'singlePax': null,
				'paxes': null,
				'currency': null,
				'cabin': null,
				'fareBase': null,
				'commission': null,
				'specClass': null,
				'validating': null,
				'fareType': null,
			};
			$pricing = $data['pricing'];
			delete ($data['pricing']);
			$command = $pricing + php.implode('¥', php.array_filter(php.array_merge($sortArray, $data)));
		} else if ($toGds == 'amadeus') {
			if (!php.empty($data['store'])) {
				$data['booking'] = $data['store'];
				delete ($data['store']);
			} else if (php.empty($data['booking'])) {
				$data['booking'] = 'X';
			}
			$paxes = $data['singlePax'] || $data['paxes'] || '';
			$rMod = php.implode('', [
				php.substr($paxes, php.strlen('R')),
				$data['fareType'] || '',
				$data['validating'] || '',
				$data['currency'] || '',
				$data['ticketDate'] || '',
			]);

			$command = php.implode('/', php.array_filter([
				$data['pricing'] + $data['booking'],
				$data['fareBase'],
				$data['segments'],
				!php.empty($rMod) ? 'R' + $rMod : null,
				$data['cabin'],
			]));
		} else {
			return null;
		}
		return $command;
	}

	static commandPartTranslationLibrary($type, $dialect) {
		let $lib;

		$lib = {
			'pricing': {
				'apollo': ['$B'],
				'galileo': ['FQ'],
				'sabre': ['WP'],
				'amadeus': ['FX'],
			},
			'store': {
				'apollo': ['T:'],
				'galileo': [''],
				'sabre': ['RQ'],
				'amadeus': ['P'],
			},
			'booking': {
				'apollo': ['', 'B', 'BA', 'B0', 'BQ01'],
				'galileo': ['', 'BB', 'BA', null, 'BBK'],
				'sabre': ['', 'NC', 'NCS', 'NCB', null],
				'amadeus': ['X', 'A', 'L', 'R', null],
			},
			'cabin': {
				'apollo': [null, '//@Y', '//@W', '//@C', '//@F', '//@AB'],
				'galileo': [null, '++-ECON', '++-PREME', '++-BUSNS', '++-FIRST', '++-AB'],
				'sabre': [null, 'TC-YB', 'TC-SB', 'TC-BB', 'TC-FB', ''],
				'amadeus': [null, 'KM', 'KW', 'KC', 'KF', 'K'],
			},
			'fareType': {
				'apollo': [null, ':N', ':A'],
				'galileo': [null, ':N', ':A'],
				'sabre': [null, 'PL', 'PV'],
				'amadeus': [null, ',P', ',U'],
			},
			'validating': {
				'apollo': [null, 'C', 'OC'],
				'galileo': [null, 'C', 'OC'],
				'sabre': [null, 'A', 'C-'],
				'amadeus': [null, ',VC-', ',OCC-'],
			},
			'specClass': {
				'apollo': [null, '.'],
				'galileo': [null, '.'],
				'sabre': [null, 'OC-B'],
				'amadeus': [null],
			},
			'currency': {
				'apollo': [null, ':'],
				'galileo': [null, ':'],
				'sabre': [null, 'M'],
				'amadeus': [null, ',FC-'],
			},
			'ticketDate': {
				'apollo': [null, ':'],
				'galileo': [null, '.T'],
				'sabre': [null, 'B'],
				'amadeus': [null, ','],
			},
			'fareBase': {
				'apollo': [null, '@'],
				'galileo': [null, '@'],
				'sabre': [null, 'Q'],
				'amadeus': [null, 'L-'],
			},
			'commission': {
				'apollo': ['Z'],
				'sabre': ['KP'],
				'amadeus': [''],
			},
		};
		return ($lib[$type] || {})[$dialect] || [];
	}

	static translateCaseVariable($varName, $varValue, $fromGds, $toGds) {
		let $possibleVariants, $varIndex;

		$possibleVariants = this.commandPartTranslationLibrary($varName, $fromGds);
		$varIndex = php.intval(php.array_search($varValue, $possibleVariants));
		return (this.commandPartTranslationLibrary($varName, $toGds) || {})[$varIndex];
	}

	translateEachFragment($data, $fromGds, $toGds, $modItems) {
		let $keys, $typeToModData, $result, $key, $value, $translated;

		if ($toGds == 'amadeus') {
			$keys = php.array_keys($data);
			if (php.in_array('commission', $keys) || php.in_array('specClass', $keys)) {
				return null;
			}
		}
		$typeToModData = php.array_combine(
			php.array_column($modItems, 'type'),
			php.array_column($modItems, 'parsed'),
		);

		$result = {};
		for ([$key, $value] of Object.entries($data)) {
			if (php.in_array($key, ['store', 'pricing', 'booking', 'cabin', 'fareType'])) {
				$translated = this.constructor.translateCaseVariable($key, $value, $fromGds, $toGds);
			} else if ($key === 'paxes') {
				$translated = translatePaxes($fromGds, $toGds, $typeToModData);
			} else if ($key === 'singlePax') {
				$translated = translatePaxes($fromGds, $toGds, $typeToModData);
			} else if ($key === 'segments') {
				$translated = this.constructor.translateSegments($value, $fromGds, $toGds);
			} else if ($key === 'currency') {
				$translated = this.constructor.translateCurrency($value, $fromGds, $toGds);
			} else if ($key === 'ticketDate') {
				$translated = this.translateTicketDate($value, $fromGds, $toGds);
			} else if ($key === 'commission') {
				$translated = this.constructor.translateCommission($value, $fromGds, $toGds);
			} else if ($key === 'specClass') {
				$translated = this.constructor.translateSpecClass($value, $fromGds, $toGds);
			} else if ($key === 'validating') {
				$translated = this.constructor.translateValidating($value, $fromGds, $toGds);
			} else if ($key === 'fareBase') {
				$translated = this.constructor.translateFareBase($value, $fromGds, $toGds);
			} else {
				$translated = '';
			}
			if (!php.is_null($translated)) {
				$result[$key] = $translated;
			} else {
				//console.error('\nCould not translate pricing cmd part ' + $key + ' - ' + $value, $typeToModData);
				return null;
			}
		}

		return $result;
	}

	/** take parsed pricing command, return mods with names in this action format */
	static normalizeGalileoRawMods($parsed) {
		let $parts, $modPartNames, $mod, $partName;

		$parts = {
			'pricing': 'FQ',
			'booking': php.substr($parsed['baseCmd'], php.strlen('FQ')),
		};
		$modPartNames = {
			//'passengers' => 'paxes',
			'cabinClass': 'cabin',
			'bookingClass': 'specClass',
			'currency': 'currency',
			'ticketingDate': 'ticketDate',
			'validatingCarrier': 'validating',
			'overrideCarrier': 'validating',
			'fareType': 'fareType',
		};
		for ($mod of Object.values($parsed['pricingModifiers'] || [])) {
			if ($partName = $modPartNames[$mod['type']]) {
				$parts[$partName] = $mod['raw'];
			} else if ($mod['type'] === 'segments') {
				if (!php.empty($mod['parsed']['bundles'][0]['segmentNumbers'])) {
					$parts['segments'] = $mod['raw'];
				} else {
					$parts['fareBase'] = $mod['raw'];
				}
			} else if (
				$mod['type'] === 'passengers' ||
				$mod['type'] === 'accompaniedChild'
			) {
				$parts['paxes'] = php.empty($parts['paxes']) ? $mod['raw'] :
					$parts['paxes'] + '/' + $mod['raw'];
			} else {
				// unsupported mod
				return [];
			}
		}
		return $parts;
	}

	static separateCommandToData($input, $fromGds, $parsed) {
		let $parts;

		if ($fromGds === 'galileo') {
			// reuse existing parser
			return this.normalizeGalileoRawMods($parsed);
		}
		$parts = {
			'apollo': {
				'store': '^T\\:(?=\\$B)',
				'pricing': '\\$B',
				'booking': ['B[A0]?', l => l.hasPreviousLexemeConstraint(['pricing'])],
				//'booking': '(?<=\\$B)B[A0]?',
				'singlePax': '/\\*[A-Z]([A-Z]{2}|\\d{2})(?!\\+|\\|)|/ACC',
				'paxes': '/N((\\d?(\\*[A-Z]([A-Z]{2}|\\d{2}))?)[\\+\\|]?)+',

				'cabin': '//@([YWCF]|AB)',
				'segments': '/S(\\d[\\+\\|\\*]?)+',
				'currency': '/:[A-Z]{3}',
				'ticketDate': '/:\\d{2}[A-Z]{3}\\d{0,2}',
				'fareBase': '/@.+?(?:/(?=/)|$)',
				'commission': '/Z\\d',
				'specClass': '/\\.[A-Z]',
				'validating': '/O?C[A-Z\\d]{2}',
				'fareType': '/?:[AN]',
			},
			'sabre': {
				'store': '¥RQ',
				'pricing': '^WP',
				'booking': '(¥|)NC[SB]?',
				//'booking': '(¥|(?<=^WP))NC[SB]?',
				'singlePax': '¥P[A-Z]([A-Z]{2}|\\d{2})(?!/)',
				'paxes': '¥P(?:\\d[A-Z]([A-Z]{2}|\\d{2})/?)+',

				'cabin': '¥TC-[YSBF]B',
				'segments': '¥S(?:\\d{1,2}[-/]?)+',
				'currency': '¥M[A-Z]{3}',
				'ticketDate': '¥B\\d{2}[A-Z]{3}\\d{2}',
				'fareBase': '¥Q[^¥]+',
				'commission': '¥KP\\d',
				'specClass': '¥OC-B[A-Z]',
				'validating': '¥(C-|A)[A-Z\\d]{2}',
				'fareType': '¥P[VL]',
			},
			'amadeus': {
				'store': ['P', l => l.hasPreviousLexemeConstraint(['pricing'])],
				'pricing': '^FX',
				'booking': ['[ALRX]', l => l.hasPreviousLexemeConstraint(['pricing'])],
				'singlePax': '/R[A-Z]([A-Z]{1,2}|\\d{2})(?![A-Z\\d\\*])',
				'paxes': '/R(?:[A-Z]([A-Z]{1,2}|\\d{2})\\*?){2,}',
				'emptyPax': '/R',

				'cabin': '/K[MWCF]?',
				'segments': '/S(?:\\d{1,2}[-,]?)+',
				'currency': ',FC-[A-Z]{3}',
				'fareBase': '/L-.+?(?=/R|$)',

				'ticketDate': ',\\d{1,2}[A-Z]{3}\\d{2}',
				'validating': ',(OC|V)C-[A-Z\\d]{2}',
				'fareType': ',[PU]',
				//'ticketDate'=> '', //notExist
				//'commission' => '', //notExist
				//'specClass' => '', //notExist
			},
		};

		$input = this.preFormat($fromGds, $input);
		$input = this.preFormatPrefix($fromGds, $input);

		let result = separateWithLex($input, $parts[$fromGds]);
		for (let [$key, $data] of Object.entries(result)) {
			result[$key] = this.deleteSeparator($fromGds, $key, $data);
		}
		return result;
	}

	static isPricingCommand($input, $gds) {

		if ($gds == 'apollo' && php.preg_match('#^(T:)?\\$B#', $input)) {
			return true;
		} else if ($gds == 'galileo') {
			return GalCmdParser.parse($input)['type'] === 'priceItinerary';
		} else if ($gds == 'sabre' && php.preg_match('#^WP#', $input)) {
			return true;
		} else if ($gds == 'amadeus' && php.preg_match('#^FX[XALRP]#', $input)) {
			return true;
		}
		return false;
	}

	translate($input, $fromGds, $toGds, parsedCmd) {
		let $parsed, $stores, $modItems, $separatedData, $translatedData;

		if (php.empty($input)) {
			return null;
		}
		$parsed = parsedCmd.data;
		if ($fromGds === 'amadeus') {
			$stores = $parsed['pricingStores'] || [];
			if (php.count($stores) > 1) {
				// only Amadeus allows multiple stores in one command
				return null;
			} else {
				$modItems = $stores[0] || [];
			}
		} else {
			$modItems = $parsed['pricingModifiers'] || [];
		}

		$separatedData = this.constructor.separateCommandToData($input, $fromGds, $parsed);
		$translatedData = this.translateEachFragment($separatedData, $fromGds, $toGds, $modItems);

		if (php.empty($translatedData)) {
			return null;
		}
		return this.constructor.glueTranslatedData($translatedData, $toGds);
	}
}

module.exports = TranslatePricingCmdAction;
