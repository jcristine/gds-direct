
const DateTime = require('../../../Lib/Utils/DateTime.js');
const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const GalCmdParser = require('../../../Gds/Parsers/Galileo/CommandParser.js');

const php = require('../../../phpDeprecated.js');
const separateWithLex = require("./Helper").separateWithLex;

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

	static normalizePaxes($fromGds, $mods) {
		let $paxNums, $ptcs, $ptcGroup, $number, $ptcRec, $i, $normPtc;

		$paxNums = [];
		$ptcs = [];

		if ($fromGds === 'apollo') {
			// In Apollo you can't specify PTC without pax numbers even if there are no paxes in PNR
			//$paxNums = array_column($mods['passengers']['passengerProperties'] ?? [], 'passengerNumber');
			$ptcs = php.array_column(($mods['passengers'] || {})['passengerProperties'] || [], 'ptc');
			if (php.empty($ptcs) && !php.empty($mods['accompaniedChild'])) {
				$ptcs.push('C05');
			}
		} else if ($fromGds === 'galileo') {
			for ($ptcGroup of Object.values(($mods['passengers'] || {})['ptcGroups'] || [])) {
				if (!$mods['passengers']['appliesToAll']) {
					for ($number of Object.values($ptcGroup['passengerNumbers'])) {
						$ptcs.push($ptcGroup['ptc']);
					}
				} else {
					$ptcs.push($ptcGroup['ptc']);
				}
			}
			if (php.empty($ptcs) && !php.empty($mods['accompaniedChild'])) {
				$ptcs.push('C05');
			}
		} else if ($fromGds === 'sabre') {
			$paxNums = php.array_column($mods['names'] || [], 'fieldNumber');
			for ($ptcRec of Object.values($mods['ptc'] || [])) {
				for ($i = 0; $i < ($ptcRec['quantity'] || 1); ++$i) {
					$ptcs.push($ptcRec['ptc']);
				}
			}
		} else if ($fromGds === 'amadeus') {
			$normPtc = ($ptc) => ({'IN': 'INF', 'CH': 'CNN'} || {})[$ptc] || $ptc;
			$paxNums = $mods['names'] || [];
			$ptcs = Fp.map($normPtc, ($mods['generic'] || {})['ptcs'] || []);
		} else {
			return null;
		}
		return {'paxNums': $paxNums, 'ptcs': $ptcs};
	}

	static translatePaxes($fromGds, $toGds, $mods) {
		let $norm, $ptcs, $paxNums, $cnt, $ptc, $paxParts, $grouped, $addCnt, $normPtc;

		if (!($norm = this.normalizePaxes($fromGds, $mods))) {
			return null;
		}
		$ptcs = $norm['ptcs'];
		$paxNums = $norm['paxNums'];
		$cnt = php.max(php.count($paxNums), php.count($ptcs));
		if (!$cnt || !php.empty($paxNums) && !php.empty($ptcs)
			&& php.count($paxNums) !== php.count($ptcs)
		) {
			return null;
		}

		if ($toGds === 'apollo') {
			if (php.count($ptcs) === 1 && php.empty($paxNums)) {
				$ptc = $ptcs[0];
				return '*' + $ptc + (php.in_array($ptc, ['CNN', 'C05']) ? '/ACC' : '');
			} else {
				$paxParts = Fp.map(($i) => {
					let $paxNum, $ptc;

					$paxNum = $paxNums[$i] || $i + 1;
					$ptc = $ptcs[$i];
					return $paxNum + ($ptc ? '*' + $ptc : '');
				}, php.range(0, $cnt - 1));
				return 'N' + php.implode('|', $paxParts);
			}
		} else if ($toGds === 'galileo') {
			if (php.count($ptcs) === 1 && php.empty($paxNums)) {
				$ptc = $ptcs[0];
				return php.in_array($ptc, ['CNN', 'C05']) ? '*' + $ptc + '/ACC' : '*' + $ptc;
			} else {
				$paxParts = Fp.map(($i) => {
					let $paxNum, $ptc;

					$paxNum = $paxNums[$i] || $i + 1;
					$ptc = $ptcs[$i];
					return $paxNum + ($ptc ? '*' + $ptc : '');
				}, php.range(0, $cnt - 1));
				return 'P' + php.implode('.', $paxParts);
			}
		} else if ($toGds === 'sabre') {
			$grouped = Fp.groupBy(($ptc) => $ptc, $ptcs);
			$addCnt = ($ptcs) => {
				let $cnt;

				$cnt = php.count($ptcs) > 1 || php.count($grouped) > 1 ? php.count($ptcs) : '';
				return $cnt + ($ptcs[0] || 'ADT');
			};
			return php.implode('¥', php.array_filter([
				$paxNums.length > 0 ? 'N' + php.implode('/', $paxNums) : '',
				$ptcs.length > 0 ? 'P' + php.implode('/', Fp.map($addCnt, $grouped)) : '',
			]));
		} else if ($toGds === 'amadeus') {
			$normPtc = ($ptc) => $ptc || 'ADT';
			$ptcs = php.array_values(php.array_unique($ptcs));
			return php.implode('/', php.array_filter([
				$paxNums.length > 0 ? 'P' + php.implode(',', $paxNums) : '',
				$ptcs.length > 0 ? 'R' + php.implode('*', Fp.map($normPtc, $ptcs)) : '',
			]));
		} else {
			return null;
		}
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
				$translated = this.constructor.translatePaxes($fromGds, $toGds, $typeToModData);
			} else if ($key === 'singlePax') {
				$translated = this.constructor.translatePaxes($fromGds, $toGds, $typeToModData);
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
