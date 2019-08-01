

const php = require('../../../../phpDeprecated.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const Fp = require('../../../../Lib/Utils/Fp.js');

class FareDisplayCommonParser
{
	static parse($dump)  {
		return this.parseLines(StringUtil.lines($dump));
	}

	static parseAirportsLine($line)  {
		let $matches, $_, $departure, $destination;
		if (php.preg_match(/^\s*([A-Z]{3})([A-Z]{3})\s*$/, $line, $matches = [])) {
			[$_, $departure, $destination] = $matches;
			return {
				'departure': $departure,
				'destination': $destination,
			};
		} else {
			return null;
		}
	}

	static parseLines($lines)  {
		let $result, $unparsed, $lastFare, $departure, $destination, $line, $parsed, $airports;
		$result = [];
		$unparsed = [];
		$lastFare = null;
		$departure = null;
		$destination = null;
		for ($line of Object.values($lines)) {
			if ($parsed = this.parseFareLine($line)) {
				if ($lastFare) {
					$result.push($lastFare);
				}
				$parsed['ticketDesignator'] = null;
				$parsed['ptc'] = [];
				$parsed['departure'] = $departure;
				$parsed['destination'] = $destination;
				$lastFare = $parsed;
			} else if ($parsed = this.parseAdditionalInfoLine($line)) {
				if ($lastFare && $parsed['ticketDesignator']) {
					$lastFare['ticketDesignator'] = $parsed['ticketDesignator'];
				}
				if ($lastFare && !php.empty($parsed['ptc'])) {
					$lastFare['ptc'] = $parsed['ptc'];
				}
			} else if ($airports = this.parseAirportsLine($line)) {
				$departure = $airports['departure'];
				$destination = $airports['destination'];
			} else {
				$unparsed.push($line);
				if ($lastFare) {
					$result.push($lastFare);
					$lastFare = null;
				}
			}}
		if ($lastFare) {
			$result.push($lastFare);
			$lastFare = null;
		}
		return {
			'result': $result,
			'unparsed': $unparsed,
		};
	}

	static parseAdvancePurchase($str)  {
		$str = php.str_replace('|', '', $str);
		$str = php.str_replace('-', '', $str);
		$str = php.str_replace(' ', '', $str);
		return $str;
	}

	/** @param $raw = ['3', '12M', '@@', '--', '||', 'V', 'SU'][$i]
     * @see SummaryParser::parseStayLimitToken() */
	static parseStayLimit($raw)  {
		let $weekDays, $result, $matches;
		$weekDays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
		$result = {'raw': $raw, 'type': null};
		if ($raw === '@@' || $raw === '--' || $raw === '') {
			$result['type'] = 'noRequirements';
		} else if ($raw === '||' || $raw === '++' || $raw === 'V') {
			$result['type'] = 'complexRule';
		} else if (php.in_array($raw, $weekDays)) {
			$result['type'] = 'dayOfWeek';
			$result['dayOfWeek'] = php.array_flip($weekDays)[$raw] + 1;
		} else if (php.preg_match(/^(\d+)(M|)$/, $raw, $matches = [])) {
			$result['type'] = 'amount';
			$result['amount'] = $matches[1];
			$result['units'] = $matches[2] === 'M' ? 'months' : 'days';
		}
		return $result;
	}

	static decodeFareType($raw)  {
		return {
			'': 'public',
			'\/': 'agencyPrivate',
			'-': 'airlinePrivate',
			'X': 'invalid',
		}[$raw] || null;
	}

	static parseFareLine($line)  {
		throw new Error('Should be implemented by extending class - parseFareLine()');
	}

	static parseAdditionalInfoLine($line)  {
		let $matches, $result, $pairs, $pair, $name, $value;
		if (php.preg_match(/^\s+[A-Z]+:/, $line, $matches = [])) {
			$result = {
				'ticketDesignator': null,
				'ptc': [],
			};
			$line += ' ';
			php.preg_match_all(/(?<name>[A-Z]+):\s*(?<value>([A-Z\d]+\s)*)/, $line, $matches = []);
			$pairs = php.array_map(
				([$name, $value]) => ({'name': php.trim($name), 'value': php.trim($value)}),
				Fp.zip([$matches['name'], $matches['value']])
			);
			for ($pair of Object.values($pairs)) {
				$name = $pair['name'];
				$value = $pair['value'];
				if ($name === 'TD') {
					$result['ticketDesignator'] = $value;
				} else if ($name === 'PTC') {
					$result['ptc'] = php.explode(' ', $value);
				}
			}
			return $result;
		} else {
			return null;
		}
	}

	static parseDate($date)  {
		let $result;
		$result = require('../CommonParserHelpers.js').parsePartialDate($date);
		return {
			'raw': $date,
			'parsed': $result,
		};
	}
}
module.exports = FareDisplayCommonParser;
