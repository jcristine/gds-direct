
const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const separateWithLex = require("./Helper").separateWithLex;

class TranslateAvailabilityCmdAction {
	static translateConnection($value, $fromGds, $toGds) {
		let $filter, $matches, $cities, $addMinus;

		if ($fromGds == 'apollo') {
			$filter = php.implode('', [
				'(?<time>\\d{1,4}[APNM]?)?',
				'(?<minus>-?)' +
				'(?<city1>[A-Z]{3})?',
				'(.?(?<city2>[A-Z]{3}))?',
				'(?<cTime>\\d{1,4}[APNM]?)?',
			]);
			php.preg_match('#' + $filter + '#', $value, $matches = []);
		} else if ($fromGds === 'galileo') {
			$filter = php.implode('', [
				'\\.?(?<time>\\d{1,4}[APNM]?)',
				'(\\.(?<city1>[A-Z]{3})(?<minus>-)?)?',
				'(\\.(?<city2>[A-Z]{3})(?<minus2>-)?)?',
			]);
			php.preg_match('#' + $filter + '#', $value, $matches = []);
		} else if ($fromGds == 'sabre') {
			$filter = php.implode('', [
				'(?<time>\\d{1,4}[APNM]?)?',
				'(?<minus>\\*)?',
				'(?<city1>[A-Z]{3})?',
				'(/(?<city2>[A-Z]{3}))?',
				'(-(?<cTime>\\d{1,4}[APNM]?))?',
			]);
			php.preg_match('#' + $filter + '#', $value, $matches = []);
		} else if ($fromGds == 'amadeus') {
			$filter = php.implode('', [
				'(?<time>\\d{1,4}[APNM]?)?',
				'(/X',
				'(?<minus>-)?',
				'(?<city1>[A-Z]{3}),?',
				'(?<city2>[A-Z]{3})?',
				')?',
			]);
			php.preg_match('#' + $filter + '#', $value, $matches = []);
		} else {
			return null;
		}

		if ($toGds == 'apollo') {
			return php.implode('', [
				$matches['time'] || '',
				(!php.empty($matches['minus']) ? '-' : ''),
				$matches['city1'] || '',
				!php.empty($matches['city2'])
					? (!php.empty($matches['minus']) ? '/' : '.') + $matches['city2']
					: '',
				$matches['cTime'] || '',
			]);
		} else if ($toGds == 'galileo') {
			$cities = php.array_filter([$matches['city1'], $matches['city2']]);
			if ($matches['minus'] || false) {
				$addMinus = ($cty) => $cty + '-';
				$cities = Fp.map($addMinus, $cities);
			}
			return php.implode('', [
				'.',
				$matches['time'] || '',
				!php.empty($cities) ? '.' + php.implode('.', $cities) : '',
			]);
		} else if ($toGds == 'sabre') {
			return php.implode('', [
				$matches['time'] || '',
				!php.empty($matches['minus']) ? '*' : '',
				$matches['city1'] || '',
				!php.empty($matches['city2']) ? '/' + $matches['city2'] : '',
				!php.empty($matches['cTime']) ? '-' + $matches['cTime'] : '',
			]);
		} else if ($toGds == 'amadeus') {
			return php.implode('', [
				$matches['time'] || '',
				php.isset($matches['city1']) ? '/X' + (!php.empty($matches['minus']) ? '-' : '') + $matches['city1'] : '',
				!php.empty($matches['city2']) ? (!php.empty($matches['minus']) ? ',' : '') + $matches['city2'] : '',
			]);
		} else {
			return null;
		}
	}

	static parseAirlineList($value, $gds) {
		let $matches, $_, $sign, $joinedAirlines, $signs, $filters, $inclusive, $exclusive, $trimMinus, $filterType;

		if ($gds === 'apollo') {
			// '|UA.PS.DL', '+UA.PS.DL', '-UA.PS.DL'
			if (php.preg_match(/^([-+|]|-\*)([A-Z0-9]{2}(?:\.[A-Z0-9]{2})*)$/, $value, $matches = [])) {
				[$_, $sign, $joinedAirlines] = $matches;
				$signs = {'+': 'include', '|': 'include', '-': 'exclude', '-*': 'exclude'};
				return {
					filterType: $signs[$sign],
					airlines: php.explode('.', $joinedAirlines),
				};
			}
		} else if ($gds === 'galileo') {
			// '/9U-/BT-/SU-', '/9U/BT/SU', 'A10MAYKIVRIX/BT/PS-/OS-', '/PS#/BT#/BA#'
			if (php.preg_match(/^(\/[A-Z0-9]{2}[-#]?)+$/, $value, $matches = [])) {
				$filters = php.explode('/', php.ltrim($value, '/'));
				$inclusive = ($flt) => !StringUtil.endsWith($flt, '-');
				$exclusive = ($flt) => StringUtil.endsWith($flt, '-');
				$trimMinus = ($flt) => php.rtrim($flt, '-#');
				if (Fp.all($inclusive, $filters)) {
					$filterType = 'include';
				} else if (Fp.all($exclusive, $filters)) {
					$filterType = 'exclude';
				} else {
					// Galileo-specific functionality, can't translate
					return null;
				}
				return {
					filterType: $filterType,
					airlines: Fp.map($trimMinus, $filters),
				};
			}
		} else if ($gds === 'sabre') {
			// '¥PSB2', '¥*UABTPS', '¥UAAC¥¥DL¥AAET'
			// each ¥ before airline marks the next connection up to 4 of them
			// I guess we'll just merge them as I believe not all GDS-es support
			// specifying an airline for each connection, though I may be wrong...
			const $filters = $value.split(/(?:¥)+/).filter(s => s);
			const $inclusive = ($flt) => !StringUtil.startsWith($flt, '*');
			const $exclusive = ($flt) => StringUtil.startsWith($flt, '*');
			const trimStar = ($flt) => $flt.replace(/^\*/, '');
			if (Fp.all($inclusive, $filters)) {
				$filterType = 'include';
			} else if (Fp.all($exclusive, $filters)) {
				$filterType = 'exclude';
			} else {
				// Sabre-specific functionality, can't translate
				return null;
			}
			return {
				filterType: $filterType,
				airlines: $filters.map(trimStar)
					.map(str => php.str_split(str, 2))
					.reduce((a, b) => a.concat(b), []),
			};
		} else if ($gds === 'amadeus') {
			// '/AUA,AA,DL', '/A-9U,BT,SU'
			if (php.preg_match(/^(\/A-?)([A-Z0-9]{2}(?:,[A-Z0-9]{2})*)$/, $value, $matches = [])) {
				[$_, $sign, $joinedAirlines] = $matches;
				$signs = {'/A': 'include', '/A-': 'exclude'};
				return {
					filterType: $signs[$sign],
					airlines: php.explode(',', $joinedAirlines),
				};
			}
		}
		return null;
	}

	static translateAirlines($value, $fromGds, $toGds) {
		let $parsed, $signs, $sign, $addSign;

		if (!($parsed = this.parseAirlineList($value, $fromGds))) {
			return null;
		}
		if (php.empty($parsed.airlines)) {
			// in Sabre you specify both stop count and airlines
			// in same mod, so it's OK if no airline is specified
			return '';
		}
		if ($toGds === 'apollo') {
			$signs = {include: '|', exclude: '-'};
			$sign = $signs[$parsed['filterType']];
			return $sign + php.implode('.', $parsed['airlines']);
		} else if ($toGds === 'galileo') {
			$addSign = ($air) => $parsed['filterType'] === 'exclude' ? $air + '-' : $air + '#';
			return '/' + php.implode('/', Fp.map($addSign, $parsed['airlines']));
		} else if ($toGds === 'sabre') {
			$signs = {include: '¥', exclude: '¥*'};
			$sign = $signs[$parsed['filterType']];
			return $sign + php.implode('', $parsed['airlines']);
		} else if ($toGds === 'amadeus') {
			$signs = {include: '/A', exclude: '/A-'};
			$sign = $signs[$parsed['filterType']];
			return $sign + php.implode(',', $parsed['airlines']);
		} else {
			return null;
		}
	}

	static translateDirectLink($value, $fromGds, $toGds) {
		let $result;

		$result = this.translateTwoPartVariable($value, 'directLink', '#^(1|\u00A4|L@|\\*)([A-Z\\d]{2})/?$#', $fromGds, $toGds);
		if ($toGds == 'apollo') {
			$result += '/';
		}
		return $result;
	}

	static translateAllianceCode($value, $fromGds, $toGds) {

		return this.translateTwoPartVariable($value, 'allianceCode', /(.+?)([A-Z]{1})$/, $fromGds, $toGds);
	}

	static translateClass($value, $fromGds, $toGds) {
		let $matches, $class, $seatNum;

		if ($fromGds == 'apollo') {
			php.preg_match('#/(?<class>[A-Z])(?<seatNum>\\d)?/#', $value, $matches = []);
		} else if ($fromGds == 'galileo') {
			php.preg_match('#@(?<seatNum>\\d)?(?<class>[A-Z])#', $value, $matches = []);
		} else if ($fromGds == 'sabre') {
			php.preg_match('#\\-(?<seatNum>\\d)?(?<class>[A-Z])#', $value, $matches = []);
		} else if ($fromGds == 'amadeus') {
			php.preg_match('#(/C(?<class>[A-Z]))?(/B(?<seatNum>\\d))?#', $value, $matches = []);
		} else {
			return null;
		}
		$class = $matches['class'] || '';
		$seatNum = $matches['seatNum'] || '';

		if ($toGds == 'apollo') {
			return '/' + $class + $seatNum + '/';
		} else if ($toGds == 'galileo') {
			return '@' + $seatNum + $class;
		} else if ($toGds == 'sabre') {
			return '-' + $seatNum + $class;
		} else if ($toGds == 'amadeus') {
			$seatNum = !php.empty($seatNum) ? '/B' + $seatNum : '';
			$class = !php.empty($class) ? '/C' + $class : '';
			return $class + $seatNum;
		} else {
			return null;
		}
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
		let $sortArray, $sortedData;

		if ($toGds == 'apollo') {
			$sortArray = {
				directLink: null,
				availability: null,
				class: null,
				date: null,
				cityPair: null,
				connection: null,
				flightType: null,
				airlines: null,
				allianceCode: null,
			};
		} else if ($toGds == 'galileo') {
			$sortArray = {
				availability: null,
				date: null,
				cityPair: null,
				connection: null,
				flightType: null,
				airlines: null,
				allianceCode: null,
				class: null,
				directLink: null,
			};
		} else if ($toGds == 'sabre') {
			$sortArray = {
				availability: null,
				date: null,
				cityPair: null,
				connection: null,
				allianceCode: null,
				directLink: null,
				flightType: null,
				airlines: null,
				class: null,
			};
			if (php.isset($data['class'])) {
				$data['availability'] += 'S';
			}
			if (php.isset($data['flightType']) && php.isset($data['airlines'])) {
				$data['airlines'] = php.preg_replace('#^¥#', '', $data['airlines']);
			} else if (!php.isset($data['airlines']) &&
				!php.isset($data['allianceCode']) &&
				php.isset($data['flightType']) &&
				php.isset($data['class'])
			) {
				if ($data['flightType'] == '/O¥¥¥') {
					$data['flightType'] = '/O' + $data['class'] + '¥¥¥';
					delete ($data['class']);
				} else if ($data['flightType'] == '/O¥¥') {
					$data['flightType'] = '/O' + $data['class'] + '¥¥';
					delete ($data['class']);
				}
			}
		} else if ($toGds == 'amadeus') {
			if (php.isset($data['class'])) {
				$data['availability'] += '/';
			}
			$sortArray = {
				directLink: null,
				availability: null,
				date: null,
				cityPair: null,
				connection: null,
				flightType: null,
				airlines: null,
				class: null,
				allianceCode: null,
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
			availability: {
				apollo: ['A', 'A'],
				galileo: ['AJ', 'A'],
				sabre: ['1', '1'],
				amadeus: ['AD', 'AD'],
			},
			directLink: {
				apollo: ['L@'],
				galileo: ['*'],
				sabre: ['\u00A4'],
				amadeus: ['1'],
			},
			flightType: {
				apollo:  [null, '/D' , '/D'  , '/D'   , '/SO'  , '/DO'  ],
				galileo: [null, '.D0', '.D0'],
				sabre:   [null, '/N¥', '/N'  , '/O¥'  , '/O¥¥' , '/O¥¥¥' , '/O¥¥¥¥'],
				amadeus: [null, '/FN', '/FN' , '/FN'  , '/O'   , '/O'   , '/O'   ],
			},
			allianceCode: {
				apollo: ['|/*', '+/*'],
				galileo: ['//*', '//*'],
				sabre: ['¥/*', '¥/*'],
				amadeus: ['/A*', '/A*'],
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

	static translateEachFragment($data, $fromGds, $toGds) {
		let $result, $key, $value, $translated, $matches;

		if ($toGds == 'amadeus' && php.array_key_exists('cTime', $data)) {
			return null;
		}

		$result = {};
		for ([$key, $value] of Object.entries($data)) {
			if (php.in_array($key, ['date', 'cityPair'])) {
				$translated = $value;
			} else if ($key === 'availability') {
				$translated = this.translateCaseVariable($key, $value, $fromGds, $toGds);
			} else if ($key === 'flightType') {
				if ($fromGds == 'sabre') {
					const numOfFlights = ($data['airlines'] || '').split('').filter(c => c === '¥').length;
					$value += '¥'.repeat(numOfFlights);
				}
				$translated = this.translateCaseVariable($key, $value, $fromGds, $toGds);
			} else if ($key === 'directLink') {
				$translated = this.translateDirectLink($value, $fromGds, $toGds);
			} else if ($key === 'class') {
				if ($fromGds == 'amadeus' && php.isset($data['seatNum'])) {
					$value += $data['seatNum'];
				}
				$translated = this.translateClass($value, $fromGds, $toGds);
			} else if ($key === 'connection') {
				$translated = this.translateConnection($value, $fromGds, $toGds);
			} else if ($key === 'airlines') {
				$translated = this.translateAirlines($value, $fromGds, $toGds);
			} else if ($key === 'allianceCode') {
				$translated = this.translateAllianceCode($value, $fromGds, $toGds);
			} else {
				$translated = '';
			}
			if (!php.is_null($translated)) {
				$result[$key] = $translated;
			} else {
				//console.error('\nCould not translate avail cmd part ' + $key + ' - ' + $value);
				return null;
			}
		}

		return $result;
	}

	static normalizeGalileoParts($cmd) {
		const parsed = require('gds-utils/src/text_format_processing/galileo/commands/CmdParser.js').parse($cmd);
		if (parsed['type'] !== 'airAvailability' ||
			!php.empty(parsed.data.unparsed) ||
			!php.empty(parsed.followingCommands)
		) {
			return []; // failed to parse cmd
		}
		const data = parsed.data;
		const parts = php.array_filter({
			availability: 'A' + (data.orderBy || ''),
			date: ((data.departureDate || {}).raw || ''),
			cityPair: (data.departureAirport || '')
					+ (data.destinationAirport || ''),
		});
		const modPartNames = {
			connection: 'connection',
			airlines: 'airlines',
			numberOfStops: 'flightType',
			directLink: 'directLink',
			bookingClass: 'class',
			allianceCode: 'allianceCode',
		};
		for (const mod of data.modifiers || []) {
			const partName = modPartNames[mod.type];
			if (partName) {
				parts[partName] = mod['raw'];
			} else {
				return []; // unsupported mod
			}
		}
		return parts;
	}

	static separateCommandToData($input, $fromGds) {
		let $parts;

		if ($fromGds === 'galileo') {
			// reuse existing parser
			return this.normalizeGalileoParts($input);
		}
		const toBeFirst = (lexeme) => lexeme.hasConstraint(ctx => ctx && ctx.lexemes.length === 0);
		$parts = {
			apollo: {
				directLink: '^L@[A-Z\\d]{2}/(?=A\\/?)',
				availability: 'A',
				class: ['/\\s*[A-Z]\\d?\\s*/', lex => lex.after(['availability'])],
				dateCityPair: '(?<date>\\d{1,2}[A-Z]{3})?(?<cityPair>[A-Z]{6})',
				connection: '\\d{1,4}[APNM]?(-?[A-Z]{3}([\\.\\/]?[A-Z]{3})?)?(?<cTime>\\d{1,4}[APNM]?)?',

				flightType: '/DO|/SO|/D',
				airlines: '[\\+\\|-]\\*?([A-Z\\d]{2}\\.?)+',
				allianceCode: '[\\+\\|]/\\*[A-Z]',
			},
			sabre: {
				dateCityPair: ['(?<date>\\d{1,2}[A-Z]{3})?(?<cityPair>[A-Z]{6})', lex => lex.hasPreviousLexemeConstraint(['availability'])],
				availability: ['1S?', toBeFirst],
				flightType: '/[ON]',
				class: '-\\d?[A-Z]',
				connection: '\\d{1,4}[APNM]?\\*?([A-Z]{3}(/[A-Z]{3})?)?(?<cTime>-\\d{1,4}[APNM]?)?',
				allianceCode: '¥/\\*[A-Z]',
				airlines: '(¥\\*?([A-Z\\d]{2})*)+',
				directLink: '\u00A4[A-Z\\d]{2}',
			},
			amadeus: {
				directLink: '1[A-Z\\d]{2}(?=AD)',
				availability: 'AD/?',
				dateCityPair: '(?<date>\\d{1,2}[A-Z]{3})?(?<cityPair>[A-Z]{6})',
				connection: '(\\d{1,4}[APNM]?)(/X-?[A-Z]{3}(,?[A-Z]{3})?)?|(/X-?[A-Z]{3}(,?[A-Z]{3})?)',
				flightType: '/FN|\\/O',
				airlines: '/A-?([A-Z\\d]{2}\\,?)+',
				class: '/C[A-Z]',
				seatNum: '/B\\d',
				allianceCode: '/A\\*[A-Z]',
			},
		};

		return separateWithLex($input, $parts[$fromGds]);
	}

	static isAvailabilityCommand($input, $gds) {

		if ($gds == 'apollo' && php.preg_match('#^(L@[A-Z\\d]{2}/)?A(/[A-Z]\\d?/)?(\\d{1,2}[A-Z]{3})?([A-Z]{6})#', $input)) {
			return true;
		} else if ($gds == 'galileo' && php.preg_match('#^AJ?(\\d{1,2}[A-Z]{3})?([A-Z]{6})#', $input)) {
			return true;
		} else if ($gds == 'sabre' && php.preg_match('#^1S?(\\d{1,2}[A-Z]{3})?([A-Z]{6})#', $input)) {
			return true;
		} else if ($gds == 'amadeus' && php.preg_match('#^(1[A-Z\\d]{2})?AD/?(\\d{1,2}[A-Z]{3})?([A-Z]{6})#', $input)) {
			return true;
		}
		return false;
	}

	static translate($input, $fromGds, $toGds) {
		let $separatedData, $translatedData;

		if (!php.empty($input)) {
			$separatedData = this.separateCommandToData($input, $fromGds);
			$translatedData = this.translateEachFragment($separatedData, $fromGds, $toGds);
		}

		return !php.empty($translatedData) ?
			this.glueTranslatedData($translatedData, $toGds) :
			null;
	}
}

module.exports = TranslateAvailabilityCmdAction;
