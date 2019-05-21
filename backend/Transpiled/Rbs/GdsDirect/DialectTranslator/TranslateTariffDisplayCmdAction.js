// namespace Rbs\GdsDirect\DialectTranslator;

const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');

const php = require('../../../php.js');
const separateWithLex = require("./Helper").separateWithLex;

class TranslateTariffDisplayCmdAction {
	static translateIssueDate($value, $fromGds, $toGds) {
		let $toPredicate;

		$value = php.preg_replace('#^[^\\d]+#', '', $value);
		$toPredicate = this.getFirstLibraryElement('issueDatePredicate', $toGds);
		return $toPredicate + $value;
	}

	static translateChangeDeparture($value, $fromGds, $toGds) {

		return this.translateTwoPartVariable($value, 'changeDeparture', /(.+?)([A-Z]{3})$/, $fromGds, $toGds);
	}

	static translateChangeDestination($value, $fromGds, $toGds) {

		return this.translateTwoPartVariable($value, 'changeDestination', /(.+?)([A-Z]{3})$/, $fromGds, $toGds);
	}

	static translateChangeAirline($value, $fromGds, $toGds) {

		return this.translateTwoPartVariable($value, 'changeAirline', /(.+?)([A-Z\d]{2})$/, $fromGds, $toGds);
	}

	static translateBookClass($value, $fromGds, $toGds) {

		return this.translateTwoPartVariable($value, 'changeBookClass', /(.+?)([A-Z])$/, $fromGds, $toGds);
	}

	static translateCurrency($value, $fromGds, $toGds) {
		let $predicate;

		$value = php.preg_replace('#^[^A-Z]*#', '', $value);
		$predicate = this.getFirstLibraryElement('currencyPredicate', $toGds);
		return php.strval($predicate) + $value;
	}

	static translateDate($value, $fromGds, $toGds) {
		let $predicate;

		$value = php.preg_replace('#^[^\\d]*#', '', $value);
		$predicate = this.getFirstLibraryElement('datePredicate', $toGds);
		return php.strval($predicate) + $value;
	}

	static translateReturnDate($value, $fromGds, $toGds) {
		let $predicate;

		$value = php.preg_replace('#^[^\\d]*#', '', $value);
		$predicate = this.getFirstLibraryElement('returnDatePredicate', $toGds);
		return php.strval($predicate) + $value;
	}

	static translateAirlines($value, $fromGds, $toGds) {
		let $fromDelim, $fromPred, $airlines, $delimiter, $predicate;

		$fromDelim = this.getFirstLibraryElement('airlineDelimiter', $fromGds);
		$fromPred = this.getFirstLibraryElement('airlinePredicate', $fromGds);
		if (StringUtil.startsWith($value, $fromPred)) {
			$value = php.substr($value, php.strlen($fromPred));
		} else {
			return null;
		}
		$airlines = php.explode($fromDelim, $value);
		$delimiter = this.getFirstLibraryElement('airlineDelimiter', $toGds);
		$predicate = this.getFirstLibraryElement('airlinePredicate', $toGds);
		return $predicate + php.implode($delimiter, $airlines);
	}

	static glueTranslatedData($data, $toGds) {
		let $command, $keys, $sortArray, $existPaxParams, $sortedData;

		$command = null;
		$keys = php.array_keys($data);

		if ($toGds == 'apollo') {
			if (!php.empty($data['rDate']) && php.empty($data['issueDate'])) {
				$data['tariff'] += 'V';
			}
			$sortArray = {
				'tariff': null,
				'changeDep': null,
				'changeDes': null,
				'date': null,
				'cityPair': null,
				'rDate': null,
			};
		} else if ($toGds == 'galileo') {
			if (!php.empty($data['rDate'])) {
				$data['rDate'] = 'V' + $data['date'] + $data['rDate'];
				$data['date'] = '';
			}
			if (php.equals(php.array_keys(php.array_filter($data)), ['tariff'])) {
				// redisplay tariff screen - FD*
				$data['tariff'] += '*';
			}
			$sortArray = {
				'tariff': null,
				'date': null,
				'cityPair': null,
				'rDate': null,
				'issueDate': null,
			};
		} else if ($toGds == 'sabre') {
			if (!php.empty($data['tariff'])) {
				if (php.count($data) == 1) {
					$data['tariff'] = $data['tariff'] + '*';
				} else if (php.count($data) == 2
					&& (php.isset($data['airlines'])
						|| php.isset($data['changeDes'])
						|| php.isset($data['changeDep']))
				) {
					$data['tariff'] = $data['tariff'] + '*';
				}
			}

			$sortArray = {
				'tariff': null,
				'changeDep': null,
				'changeDes': null,
				'issueDate': null,
				'cityPair': null,
				'date': null,
				'rDate': null,
				'class': null,
				'paxType': null,
				'airlines': null,
				'fareType': null,
				'flightType': null,
			};
		} else if ($toGds == 'amadeus') {
			$existPaxParams = !php.empty(php.array_intersect(['issueDate', 'paxType', 'fareType'], $keys));
			if ($existPaxParams) {
				$data['paxParam'] = '/R';
			}
			if (!php.empty($data['tariff'])) {
				if (php.count($data) == 1) {
					$data['tariff'] = 'MPFQD';
				} else if (
					php.empty($data['date']) &&
					php.empty($data['cityPair']) &&
					!php.empty($data['airlines'])
				) {
					$data['tariff'] = $data['tariff'] + 'C';
				}
			}
			$sortArray = {
				'tariff': null,
				'changeDes': null,
				'cityPair': null,
				'date': null,
				'rDate': null,
				'paxParam': null,
				'paxType': null,
				'issueDate': null,
				'fareType': null,
				'class': null,
				'airlines': null,
				'flightType': null,
			};
		} else {
			return null;
		}
		$sortedData = php.array_filter(php.array_merge($sortArray, $data));
		return php.implode('', $sortedData);
	}

	static commandPartTranslationLibrary($type, $dialect) {
		let $lib;

		$lib = {
			'tariff': {
				'apollo': ['$D'],
				'galileo': ['FD'],
				'sabre': ['FQ'],
				'amadeus': ['FQD'],
			},
			'issueDatePredicate': {
				'apollo': ['T'],
				'galileo': ['.T'],
				'sabre': [''],
				'amadeus': [','],
			},
			'airlinePredicate': {
				'apollo': ['|', '+'],
				'galileo': ['/', '/'],
				'sabre': ['-', '-'],
				'amadeus': ['/A', '/A'],
			},
			'airlineDelimiter': {
				'apollo': ['|', '+'],
				'galileo': ['/', '/'],
				'sabre': ['-', '-'],
				'amadeus': [',', ','],
			},
			'currencyPredicate': {
				'apollo': [':'],
				'galileo': [':'],
				'sabre': ['/'],
				'amadeus': [''],
			},
			'flightType': {
				'apollo': [null, ':RT', ':OW'],
				'galileo': [null, '-RT', '-OW'],
				'sabre': [null, '¥RT', '¥OW'],
				'amadeus': [null, '/IR', '/IO'],
			},
			'class': {
				'apollo': [null, '@Y', '@W', '@C', '@F', '@AB'],
				'galileo': [null, '@Y', '@W', '@C', '@F', '@AB'],
				'sabre': [null, 'YB', 'SB', 'BB', 'FB', ''],
				'amadeus': [null, '/KM', '/KW', '/KC', '/KF'],
			},
			'paxType': {
				'apollo': ['-'],
				'galileo': ['*'],
				'sabre': ['¥P'],
				'amadeus': [',-'],
			},
			'fareType': {
				'apollo': [null, ':N', '/:N', ':A', '/:A', ':P', ':G'],
				'galileo': [null, ':N', ':N', ':A', ':A', ':P', ':G'],
				'sabre': [null, '¥PL', '¥PL', '¥PV', '¥PV', '¥PV', '¥PV'],
				'amadeus': [null, ',P', ',P', ',U', ',U', ',U', ',U'],
			},
			'changeBookClass': {
				'apollo': ['-'],
				'galileo': ['-'],
				'sabre': ['¥B'],
				'amadeus': ['/C'],
			},
			'changeDeparture': {
				'apollo': ['B'],
				'galileo': ['O'],
				'sabre': ['D'],
				'amadeus': [''],
			},
			'changeDestination': {
				'apollo': ['D'],
				'galileo': ['D'],
				'sabre': ['A'],
				'amadeus': ['C/'],
			},
			'changeAirline': {
				'apollo': ['|', '+'],
				'galileo': ['/', '/'],
				'sabre': ['-', '-'],
				'amadeus': ['C\/A', 'C\/A'],
			},
			'datePredicate': {
				'apollo': [''],
				'sabre': [''],
				'amadeus': ['/'],
			},
			'returnDatePredicate': {
				'apollo': [''],
				'sabre': ['¥R'],
				'amadeus': ['*'],
			},
		};
		return ($lib[$type] || {})[$dialect] || [];
	}

	static getFirstLibraryElement($varName, $dialect) {

		return php.strval((this.commandPartTranslationLibrary($varName, $dialect) || {})[0]);
	}

	static translateCaseVariable($varName, $varValue, $fromGds, $toGds) {
		let $possibleVariants, $varIndex;

		$possibleVariants = this.commandPartTranslationLibrary($varName, $fromGds);
		$varIndex = php.intval(php.array_search($varValue, $possibleVariants));
		return (this.commandPartTranslationLibrary($varName, $toGds) || {})[$varIndex];
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

	static translateEachFragment($data, $fromGds, $toGds) {
		let $result, $key, $value, $translated, $pred;

		$result = {};
		if ($toGds == 'amadeus' && (
			php.array_key_exists('currency', $data)
			|| php.array_key_exists('changeDep', $data)
		)) {
			return null;
		}

		for ([$key, $value] of Object.entries($data)) {
			$translated = '';
			if ($key === 'cityPair') {
				$translated = $value;
			} else if ($key === 'paxType') {
				$pred = this.getFirstLibraryElement('paxType', $toGds);
				$translated = $pred ? $pred + php.substr($value, -3) : null;
			} else if (php.in_array($key, ['tariff', 'flightType', 'class', 'paxType', 'fareType'])) {
				if ($fromGds == 'apollo' && $key == 'class') {
					$value = php.trim($value, '/');
				}
				$translated = this.translateCaseVariable($key, $value, $fromGds, $toGds);
			} else if ($key === 'airlines') {
				$translated = this.translateAirlines($value, $fromGds, $toGds);
			} else if ($key === 'currency') {
				$translated = this.translateCurrency($value, $fromGds, $toGds);
			} else if ($key === 'issueDate') {
				$translated = this.translateIssueDate($value, $fromGds, $toGds);
			} else if ($key === 'changeDep') {
				$translated = this.translateChangeDeparture($value, $fromGds, $toGds);
			} else if ($key === 'changeDes') {
				$translated = this.translateChangeDestination($value, $fromGds, $toGds);
			} else if ($key === 'changeAir') {
				$translated = this.translateChangeAirline($value, $fromGds, $toGds);
			} else if ($key === 'bookClass') {
				$translated = this.translateBookClass($value, $fromGds, $toGds);
			} else if ($key === 'date') {
				if ($toGds == 'apollo'
					&& !php.isset($data['rDate'])
					&& php.isset($data['issueDate'])
				) {
					$result['rDate'] = this.translateReturnDate($value, $fromGds, $toGds);
				} else {
					$translated = this.translateDate($value, $fromGds, $toGds);
				}
			} else if ($key === 'rDate') {
				if ($fromGds == 'apollo' && !php.isset($data['date'])) {
					$result['date'] = this.translateDate($value, $fromGds, $toGds);
				} else {
					$translated = this.translateReturnDate($value, $fromGds, $toGds);
				}
			}
			if (!php.is_null($translated)) {
				$result[$key] = $translated;
			} else {
				return null;
			}
		}
		return $result;
	}

	static normalizeGalileoParts($cmd) {
		let $parsed, $data, $parts, $modPartNames, $mod, $partName;

		$parsed = require('../../../Gds/Parsers/Galileo/CommandParser.js').parse($cmd);
		if ($parsed['type'] !== 'fareSearch' ||
			!php.empty($parsed['data']['unparsed'])
		) {
			return []; // failed to parse cmd
		}
		$data = $parsed['data'];
		$parts = php.array_filter({
			'tariff': 'FD',
			'cityPair': $data['departureAirport'] + $data['destinationAirport'],
			'date': ($data['departureDate'] || {})['raw'] || '',
			'rDate': ($data['returnDate'] || {})['raw'] || '',
		});
		$modPartNames = {
			'tripType': 'flightType',
			'bookingClass': 'bookClass',
			'cabinClass': 'class',
			'airlines': 'airlines',
			'ticketingDate': 'issueDate',
			//'allianceCode' => '',
			'currency': 'currency',
			'fareType': 'fareType',
			'ptc': 'paxType',
		};
		for ($mod of Object.values($data['modifiers'] || [])) {
			if ($partName = $modPartNames[$mod['type']]) {
				$parts[$partName] = $mod['raw'];
			} else {
				return []; // unsupported mod
			}
		}
		return $parts;
	}

	static separateCommandToData($input, $fromGds, $toGds) {
		let $parts;

		if ($fromGds === 'galileo') {
			// reuse existing parser
			return this.normalizeGalileoParts($input);
		}
		$parts = {
			'apollo': {
				'tariff': '^\\$DV?',
				'changeAir': ['(?<=\\$D)[\\+\\|][A-Z\\d]{2}$', l => l.after(['tariff'])],
				'changeDep': ['B[A-Z]{3}$', l => l.after(['tariff'])],
				'changeDes': ['D[A-Z]{3}$', l => l.after(['tariff'])],

				'date': ['\\d{1,2}[A-Z]{3}(\\d{2})?', l => l.after(['tariff'])],
				'cityPair': '[A-Z]{6}',
				'rDate': ['\\d{1,2}[A-Z]{3}(\\d{2})?', l => l.after(['cityPair'])],
				'issueDate': 'T(\\d{1,2}[A-Z]{3}(\\d{2})?)',

				'flightType': ':(OW|RT)',
				'class': '/{0,2}@[A-Z]B?',
				'paxType': '-([A-Z][A-Z0-9]{2})',
				'bookClass': '-[A-Z]',
				'airlines': '([\\+\\|][A-Z\\d]{2})+',
				'currency': ':[A-Z]{3}',
				'fareType': '/?:[A-Z]',
			},
			'sabre': {
				'tariff': '^FQ\\*?',
				'changeAir': ['-[A-Z\\d]{2}$', l => l.after(['tariff'])],
				'changeDep': ['D[A-Z]{3}$', l => l.after(['tariff'])],
				'changeDes': ['A[A-Z]{3}$', l => l.after(['tariff'])],

				'issueDate': ['\\d{1,2}[A-Z]{3}(\\d{2})?', l => l.after(['tariff'])],
				'cityPair': '[A-Z]{6}',
				'date': ['\\d{1,2}[A-Z]{3}(\\d{2})?', l => l.after(['cityPair'])],
				'rDate': '¥R\\d{1,2}[A-Z]{3}(\\d{2})?',

				'class': '[YSBF]B',
				'bookClass': '¥B[A-Z]',
				'airlines': '(-[A-Z\\d]{2})+',
				'currency': '/[A-Z]{3}',
				'paxType': '¥P([A-Z][A-Z0-9]{2})',
				'flightType': '¥(OW|RT)',
				'fareType': '¥P[LV]',
			},
			'amadeus': {
				'tariff': '^(MP)?FQD',
				'changeAir': ['C\/A[A-Z\\d]{2}', l => l.after(['tariff'])],
				'changeDes': ['C\/[A-Z]{3}', l => l.after(['tariff'])],

				'cityPair': '[A-Z]{6}',
				'date': '/D?\\d{1,2}[A-Z]{3}(\\d{2})?',
				'rDate': '\\*\\d{1,2}[A-Z]{3}(\\d{2})?',
				'issueDate': ',\\d{1,2}[A-Z]{3}(\\d{2})?',

				'paxParam': '/R',
				'class': '/K[MWCF]',
				'bookClass': '/C[A-Z]',
				'airlines': '/A([A-Z\\d]{2},?)+',
				'paxType': ',-([A-Z][A-Z0-9]{2})',
				'flightType': '/I[OR]',
				'fareType': ',[PU]',
			},
		};

		return separateWithLex($input, $parts[$fromGds]);

		// $result = [];
		// $filterData = [];
		// for ([$key, $value] of Object.entries($parts[$fromGds])) {
		//     $filterData.push('(?<'+$key+'>'+$value+')');}
		// $filter = '#^(?:'+php.implode('|', $filterData)+')+$#';
		// php.preg_match($filter, $input, $matches = [], php.PREG_OFFSET_CAPTURE);
		//
		// $getPos = ($match) => $match[1];
		// $byTextOrder = Fp.sortBy($getPos, $matches || []);
		//
		// for ([$key, [$data, $order]] of Object.entries($byTextOrder)) {
		//     if (!php.is_numeric($key)) {
		//         $result[$key] = $data;
		//     }}
		// return php.array_filter($result);
	}

	static isTariffDisplayCommand($input, $gds) {

		if ($gds == 'apollo' && php.preg_match('#^\\$D#', $input)) {
			return true;
		} else if ($gds == 'sabre' && php.preg_match('#^FQ#', $input)) {
			return true;
		} else if ($gds == 'amadeus' && php.preg_match('#^(MP)?FQD#', $input)) {
			return true;
		} else if ($gds == 'galileo' && require('../../../Gds/Parsers/Galileo/CommandParser.js').parse($input)['type'] === 'fareSearch') {
			return true;
		}
		return false;
	}

	static translate($input, $fromGds, $toGds) {
		let $separatedData, $translatedData;

		if (!php.empty($input)) {
			$separatedData = this.separateCommandToData($input, $fromGds, $toGds);
			$translatedData = this.translateEachFragment($separatedData, $fromGds, $toGds);
		}
		return !php.empty($translatedData) ?
			this.glueTranslatedData($translatedData, $toGds) :
			null;
	}
}

module.exports = TranslateTariffDisplayCmdAction;
