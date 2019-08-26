
const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const FareRuleSectionParser = require('../../../Gds/Parsers/Common/FareRuleSectionParser.js');

/**
 * parses WPRD*1,2,3 etc
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');

class FareRuleParser {
	static removeIndexKeys($dict) {
		let $stringKeys;

		$stringKeys = Fp.filter('is_string', php.array_keys($dict));
		return php.array_intersect_key($dict, php.array_flip($stringKeys));
	}

	static parseSection($sectionHeader, $lines) {
		let $regex, $matches, $_, $sectionNumber, $sectionName;

		$regex = /^(\d{2}|IC)\.(.*)$/;
		if (php.preg_match($regex, $sectionHeader, $matches = [])) {
			[$_, $sectionNumber, $sectionName] = $matches;
			return FareRuleSectionParser.parse(php.implode(php.PHP_EOL, $lines), $sectionNumber, $sectionName);
		} else {
			return null;
		}
	}

	static splitByIndent($lines, $indentSize) {
		let $indent, $result, $currentPart, $rootLine, $idx, $line;

		$lines = php.array_values($lines);
		$indent = php.str_repeat(' ', $indentSize);

		$result = [];
		$currentPart = [];
		$rootLine = null;
		for ([$idx, $line] of Object.entries($lines)) {
			if (StringUtil.startsWith($line, $indent) || php.preg_match(/^\s*$/, $line)) {
				$currentPart.push(php.substr($line, $indentSize));
			} else {
				if ($idx > 0) {
					$result.push([$rootLine, $currentPart]);
					$currentPart = [];
				}
				$rootLine = $line;
			}
		}
		if ($rootLine !== null) {
			$result.push([$rootLine, $currentPart]);
		}

		return $result;
	}

	static parseSections($lines) {
		let $sections, $indentSize, $tuples, $tuple, $sectionHeader, $innerLines, $section, $key;

		$sections = {};
		$indentSize = 3;
		$tuples = this.splitByIndent($lines, $indentSize);

		while ($tuple = php.array_shift($tuples)) {
			[$sectionHeader, $innerLines] = $tuple;
			if ($section = this.parseSection($sectionHeader, $innerLines)) {
				$key = $section['sectionNumber'];
				$key = php.is_numeric($key) ? php.intval($key) : $key;
				$sections[$key] = $section;
			} else {
				php.array_unshift($tuples, $tuple);
				break;
			}
		}

		$lines = php.array_reduce($tuples, ($sum, $tuple) => {
			let $rootLine, $innerLines;

			[$rootLine, $innerLines] = $tuple;
			return php.array_merge($sum, [$rootLine], Fp.map(($line) => {
				return php.str_repeat(' ', $indentSize) + $line;
			}, $innerLines));
		}, []);

		return [$sections, $lines];
	}

	/** @return [$isOptional, $regex][] */
	static getHeaderLinesPattern() {

		return [
			// "PASSENGER TYPE-ADT                 AUTO PRICE-YES
			[false, '^' +
			'PASSENGER TYPE-(?<ptc>[A-Z0-9]{3})\\s+' +
			'AUTO PRICE-(?<autoPriceFlag>YES|NO|.*)\\s*' +
			'$'],
			// "FROM-LOS TO-MLW    CXR-YY    TVL-03OCT16  RULE-AFEX 031SITA/31
			[false, '^' +
			'FROM-(?<departureCity>[A-Z]{3})\\s+' +
			'TO-(?<destinationCity>[A-Z]{3})\\s+' +
			'CXR-(?<airline>[A-Z0-9]{2})\\s+' +
			'TVL-(?<travelDate>\\d{1,2}[A-Z]{3}\\d{2})\\s+' +
			'RULE-(?<rule>.*)\\s*' +
			'$'],
			// "FARE BASIS-YEEIF3M           SPECIAL FARE  DIS-E   VENDOR-SITA
			[false, '^' +
			'FARE BASIS-(?<fareBasis>[^\\s]+)\\s+' +
			'(?<fareSpecialization>[A-Z]+)\\s+FARE\\s+' + // either "NORMAL" or "SPECIAL"
			'DIS-(?<dis>[A-Z])\\s+' + // i think "E" means E-Ticket. There can also be "L" and maybe more
			'VENDOR-(?<vendor>[A-Z]+)\\s*' +
			'$'],
			// "FARE TYPE-XEX      RT-REGULAR EXCURSION
			[true, '^' +
			'FARE TYPE-(?<fareType>[A-Z0-9]+)\\s+' +
			'(?<tripType>[A-Z]{2})-' +
			'(?<tripTypeRemark>.+)' +
			'$'],
			// "TARIFF FAMILY-J    DBE-YE     FARE QUALITY-E    ROUTE CODE-42
			[true, '^' +
			'TARIFF FAMILY-(?<tariffFamily>[A-Z])\\s+' +
			'DBE-(?<dbe>[A-Z0-9]+)\\s+' +
			'FARE QUALITY-(?<fareQuality>[A-Z])\\s+' +
			'ROUTE CODE-(?<routeCode>[A-Z0-9]+)\\s*' +
			'$'],
			// "USD  3500.00   MPM  E11FEB16 D-INFINITY   FC-YEEIF3M  FN-16
			[false, '^' +
			'(?<currency>[A-Z]{3})\\s*' +
			'(?<amount>\\d+\\.?\\d*)\\s*' +
			'(?<mileagePoints>[A-Z0-9]+)\\s+' +
			'E(?<effectiveDateForOutboundTravel>\\d{1,2}[A-Z]{3}\\d{2})\\s+' +
			'D-?(?<discontinueDateForOutboundTravel>INFINITY|\\d{1,2}[A-Z]{3}\\d{2})\\s+' +
			'FC-(?<fareConstructionBasis>[^\\s]+)\\s*' +
			'FN-(?<fareNumber>[A-Z0-9]*)\\s*', // guessing
			'$'],
			// "SYSTEM DATES - CREATED 12SEP16/0720  EXPIRES INFINITY"
			[false, '^' +
			'SYSTEM DATES - ' +
			'CREATED (?<createdDate>\\d{1,2}[A-Z]{3}\\d{2})\\\/' +
			'(?<createdTime>\\d+)\\s+' +
			'EXPIRES (?<expiresDate>INFINITY|.*)\\s*' +
			'$'],
		];
	}

	static parseHeader($lines) {
		let $result, $linePatterns, $tuple, $isOptional, $pattern, $line, $matches, $travelDate, $eDate, $dDate,
			$createdDate;

		$result = {};

		$linePatterns = this.getHeaderLinesPattern();

		for ($tuple of Object.values($linePatterns)) {
			[$isOptional, $pattern] = $tuple;
			$line = php.array_shift($lines);
			if (php.preg_match('/' + $pattern + '/', $line, $matches = [])) {
				$result = {...$result, ...php.array_filter(this.removeIndexKeys($matches))};
			} else {
				if ($isOptional) {
					php.array_unshift($lines, $line);
				} else {
					return [$result + {
						'error': 'line does not match pattern:' + php.PHP_EOL + $line + php.PHP_EOL + ' \/' + $pattern + '\/',
					}, $lines];
				}
			}
		}

		$travelDate = CommonParserHelpers.parseApolloFullDate($result['travelDate']);
		$eDate = CommonParserHelpers.parseApolloFullDate($result['effectiveDateForOutboundTravel']);
		$dDate = CommonParserHelpers.parseApolloFullDate($result['discontinueDateForOutboundTravel']);
		$createdDate = CommonParserHelpers.parseApolloFullDate($result['createdDate']);

		$result = php.array_merge($result, {
			'travelDate': {
				'raw': $result['travelDate'],
				'parsed': $travelDate ? '20' + $travelDate : null,
			},
			'effectiveDateForOutboundTravel': {
				'raw': $result['effectiveDateForOutboundTravel'],
				'parsed': $eDate ? '20' + $eDate : null,
			},
			'discontinueDateForOutboundTravel': {
				'raw': $result['discontinueDateForOutboundTravel'],
				'parsed': $dDate ? '20' + $eDate : null,
			},
			'createdDate': {
				'raw': $result['createdDate'],
				'parsed': $createdDate ? '20' + $createdDate : null,
			},
			'createdTime': {
				'raw': $result['createdTime'],
				'parsed': CommonParserHelpers.decodeApolloTime($result['createdTime']),
			},
		});

		return [$result, $lines];
	}

	static parseTravelTicketDate($token) {
		let $result, $decodes, $months, $matches, $_, $codes, $day, $rawMonth, $month, $rawCode;

		$result = [];

		$decodes = {
			'S': 'firstSaleDate',
			'E': 'effectiveDateForOutboundTravel',
			'D': 'discontinueDateForOutboundTravel',
			'C': 'allTravelCompletionDate',
			'R': 'returnTravelCommenceDate',
			'T': 'lastTicketDate',
			'*': 'tooManyProvisionsApply',
		};

		$months = php.array_flip(['JA', 'FE', 'MR', 'AP', 'MY', 'JN', 'JL', 'AU', 'SE', 'OC', 'NV', 'DE']);

		if (php.preg_match(/^([A-Z\*]+)(\d{1,2})([A-Z]{2})$/, $token, $matches = [])) {
			[$_, $codes, $day, $rawMonth] = $matches;
			$month = $months[$rawMonth];
			for ($rawCode of Object.values(php.str_split($codes))) {
				$result.push({
					'code': {
						'raw': $rawCode,
						'parsed': $decodes[$rawCode],
					},
					'date': {
						'raw': $day + $rawMonth,
						'parsed': php.str_pad(+$month + 1, 2, '0', php.STR_PAD_LEFT) + '-' + php.str_pad(+$day, 2, '0', php.STR_PAD_LEFT),
					},
				});
			}
		} else if ($token === 'S*GA') {
			$result.push({
				'code': {
					'raw': 'S',
					'parsed': 'subjectToGovernmentApproval',
				},
			});
		} else if (!php.preg_match(/^-+$/, $token)) {
			$result.push({
				'raw': $token,
				'error': 'failed to parse',
			});
		}

		return $result;
	}

	// "¥¥" (complex rule),
	// "", "-", "--" (no restriction),
	// "1M" (one month, usually from departure),
	// "6M" (6 months),
	// "3" (three days)
	// "SU" (first sunday, usually from departure)
	static parseStayLimit($token) {
		let $matches, $_, $amount, $monthsMark;

		$token = php.trim($token);

		if (php.preg_match(/^(¥)+$/, $token, $matches = [])) {
			return {'type': 'complexRule'};
		} else if (php.preg_match(/^\-*$/, $token, $matches = [])) {
			return {'type': 'noRequirements'};
		} else if (php.preg_match(/^(\d+)(M|)$/, $token, $matches = [])) {
			[$_, $amount, $monthsMark] = $matches;
			return {
				'type': 'amount',
				'amount': $amount,
				'units': $monthsMark ? 'months' : 'days',
			};
		} else if (php.preg_match(/^[A-Z]{2}$/, $token)) {
			return {
				'type': 'dayOfWeek',
				'dayOfWeek': CommonParserHelpers.apolloDayOfWeekToNumber($token),
			};
		} else {
			return null;
		}
	}

	/** @param $raw = ['*', '/', 'X', '¤'][$i] */
	static decodeFareType($raw) {
		return ({
			'': 'public',
			'*': 'accountPrivate',
			'/': 'agencyPrivate',
			'X': 'invalid',
			'¤': 'airlinePrivate',
		} || {})[($raw || '').trim()];
	}

	// @see https://formatfinder.sabre.com/Content/Fares/FareQuoteFQ/FQSystemResponseExplanations.aspx?ItemID=4460CEB625CA402AA0D86DD988A7038D
	//      v fare basis     bk    fare   travel-ticket ap  minmax  rtg
	// "  1   XLRTEENG       X R   440.00     ----      -/¥  -/12M AT01"
	// "  1  ¤TLOWUS1        T X   150.00 D31AU  T28FE  -    -/  - AT01"
	// "  1   ZK3APCD        Z¥R   127.00     ----     60    2/ 1M EH01"
	// "  1   ZK5MSL         Z R  2158.00     ----     50/14SU/12M AT01"
	// "  1   ULTAPUK        U R   148.00     ----      -   ¥¥/ 1M EH01"
	// "  1   YH3            Y X   250.00     ----      -    -/  -    1"
	static parseFareComponentLine($line) {
		let $tripTypes, $regex, $matches;

		$tripTypes = {
			'X': 'oneWay',
			'R': 'roundTrip',
			'O': 'oneWayDirectional', // cannot be doubled for round trip
			'H': 'halfRoundTrip',
		};

		$regex =
			'\/^\\s*' +
			'(?<componentNumber>\\d{1,3})' +
			'(?<sameDayIndicator>[\\sA-Z])' +
			'(?<vendorCode>[\\.\\s])' +
			'(?<privateFareIndicator>\u00A4|.)' +
			'(?<fareBasis>[^\\s]+)\\s+' +
			'(?<primaryBookingClass>[A-Z])' +
			'(?<secondaryBookingClassAppliesMark>\\s|\u00A5)' +
			'(?<tripTypeLetter>[A-Z])\\s+' +
			'(?<fare>\\d+\\.?\\d*)\\s+' +
			'(?<travelTicketDates>([A-Z0-9\\*]+\\s+)+|-+\\s+)' +
			'(?<advancedPurchaseReservation>(\\d|\u00A5|\\-|[A-Z]){1,2}|SIML)' +
			'(\\\/(?<advancedPurchaseTicketing>(\\d|\u00A5|\\-|[A-Z]){1,2}))?\\s*' +
			'(?<stayMin>(.|\u00A5){2})\\\/' +
			'(?<stayMax>(.|\u00A5){3})\\s*' +
			'(?<tariffRouting>[A-Z0-9]+)' +
			'\\s*$\/';

		if (php.preg_match($regex, $line, $matches = [])) {
			return {
				'componentNumber': $matches['componentNumber'],
				'sameDayIndicator': php.trim($matches['sameDayIndicator']) || null,
				'vendorCode': php.trim($matches['vendorCode']),
				'privateFareIndicator': php.trim($matches['privateFareIndicator']) ? {
					'raw': $matches['privateFareIndicator'],
					//'parsed': TariffDisplayParser.decodeFareType($matches['privateFareIndicator']),
					'parsed': this.decodeFareType($matches['privateFareIndicator']),
				} : null,
				'fareBasis': $matches['fareBasis'],
				'primaryBookingClass': $matches['primaryBookingClass'],
				'secondaryBookingClassApplies': $matches['secondaryBookingClassAppliesMark'] === '\u00A5',
				'tripType': {
					'raw': $matches['tripTypeLetter'],
					'parsed': $tripTypes[$matches['tripTypeLetter']],
				},
				'fare': $matches['fare'],
				'travelTicketDates': Fp.flatten(php.array_map(raw => this.parseTravelTicketDate(raw),
					php.array_filter(php.explode(' ', $matches['travelTicketDates'])))),
				'advancedPurchaseReservation': $matches['advancedPurchaseReservation'],
				'advancedPurchaseTicketing': $matches['advancedPurchaseTicketing'],
				'stayMin': {'raw': $matches['stayMin'], 'parsed': this.parseStayLimit($matches['stayMin'])},
				'stayMax': {'raw': $matches['stayMax'], 'parsed': this.parseStayLimit($matches['stayMax'])},
				'tariffRouting': $matches['tariffRouting'],
			};
		} else {
			return {
				'error': 'line does not match pattern:' + php.PHP_EOL + $line + php.PHP_EOL + ' ' + $regex,
			};
		}
	}

	static parseFareComponent($lines) {
		let $component, $line, $matches;

		$component = this.parseFareComponentLine(php.array_shift($lines));

		while ($line = php.array_shift($lines)) {
			if (php.preg_match(/^\s{33}\s*(?<travelTicketDates>[A-Z0-9\*\-]+\s+)+$/, $line, $matches = [])) {
				$component['travelTicketDates'] =
					php.array_merge($component['travelTicketDates'] || [],
						Fp.flatten(php.array_map(raw => this.parseTravelTicketDate(raw),
							php.array_filter(php.explode(' ', $matches[0])))));
			} else {
				php.array_unshift($lines, $line);
				break;
			}
		}

		return [$component, $lines];
	}

	static parse($dump) {
		let $lines, $result, $line;

		$lines = StringUtil.lines($dump);
		$result = {};

		// "    V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG"
		if (!php.preg_match(/^ +V +FARE +BASIS +BK +FARE +TRAVEL-TICKET +AP +MINMAX +RTG *$/,
			$line = php.array_shift($lines))) {
			return {...$result, error: 'unexpectedStartOfDump - ' + $line};
		}

		[$result['fareComponent'], $lines] = this.parseFareComponent($lines);
		[$result['header'], $lines] = this.parseHeader($lines);
		if (php.isset($result['header']['error'])) {
			return {...$result, error: 'failed to parse header'};
		}
		php.array_shift($lines); // empty line
		[$result['sections'], $lines] = this.parseSections($lines);
		php.array_pop($lines); // dot
		$result['additionalInfo'] = $lines;

		return $result;
	}
}

module.exports = FareRuleParser;
