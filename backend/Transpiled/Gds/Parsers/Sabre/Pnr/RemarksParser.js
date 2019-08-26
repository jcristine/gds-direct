
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const GenericRemarkParser = require('../../../../Gds/Parsers/Common/GenericRemarkParser.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');

class RemarksParser {
	static parse($dump) {
		let $lines, $firstLine, $remarks, $line, $lineParse;

		$lines = StringUtil.lines($dump);
		$firstLine = php.array_shift($lines);
		$lines = this.unwrapLines($lines);

		if (!StringUtil.startsWith($firstLine, 'REMARKS')) {
			throw new Error('Unexpected REMARKS section header [' + $firstLine + ']');
		}

		$remarks = [];
		for ($line of Object.values($lines)) {
			if (!php.trim($line)) {
				// skip empty lines
			} else {
				$lineParse = this.parseLine($line);
				$remarks.push({
					'lineNumber': !$lineParse ? null : $lineParse['lineNumber'],
					'remarkType': !$lineParse ? null : $lineParse['remarkType'],
					'data': !$lineParse ? null : $lineParse['data'],
					'line': $line,
				});
			}
		}

		return $remarks;
	}

	/** @param string $remark =
	 * '-CK' ||
	 * '...-*VI4111111111111111¥08/17' ||
	 * '-CHECK' ||
	 * '-*VIXXXXXXXXXXXX1072¥XXXXX'
	 */
	static parseFopRemark($remark) {
		let $filter, $tokens;

		$filter =
			'/^\\.*-\\*?(?:(?<cash>CK|CHECK|CASH)|(?<card>[A-Z]{2}[\\d\\X¥\\\/]{16,}))/ms';
		if (php.preg_match($filter, $remark, $tokens = [])) {
			if (!php.empty($tokens['cash'])) {
				return {'type': this.TYPE_CASH};
			} else if (!php.empty($tokens['card'])) {
				return {'type': this.TYPE_CC};
			}
		}
		return null;
	}

	/**
	 * transforms:
	 * ' 17.H-ASC-NEW EARLIER SCHD VIOLATES DEFINED TIME TOLERANCE 26NO',
	 * '    V/1312',
	 * to
	 * ' 17.H-ASC-NEW EARLIER SCHD VIOLATES DEFINED TIME TOLERANCE 26NOV/1312',
	 */
	static unwrapLines($lines) {
		let $result, $line, $matches;

		$result = [];
		for ($line of Object.values($lines)) {
			if ($result && php.preg_match(/^\s{4}(.+)$/, $line, $matches = [])) {
				$result[php.count($result) - 1] += $matches[1];
			} else {
				$result.push($line);
			}
		}
		return $result;
	}

	static parseCurrency($token) {
		let $mapping;

		$mapping = {
			'E': 'EUR',
			'D': 'USD',
		};

		if (php.array_key_exists($token, $mapping)) {
			return $mapping[$token];
		} else {
			return null;
		}
	}

	static parseLetterCodesRemark($remark) {
		let $regex, $tokens, $remarks;

		$regex = /((?<code>[A-Z]{1})(?<paxNumber>\d+) (?<amount>\d+(\.\d{0,2})?))/;
		if (php.preg_match_all($regex, $remark, $tokens = [])) {
			$remarks = php.array_map(([$code, $paxNumber, $amount]) => {

				return {
					'passengerNumber': php.intval($paxNumber),
					'code': $code,
					'amount': $amount,
				};
			}, Fp.zip([$tokens['code'], $tokens['paxNumber'], $tokens['amount']]));
			return $remarks;
		} else {
			return null;
		}
	}

	static parseConversionRateRemark($remark) {
		let $tokens, $firstToken, $restTokens, $allTokensHaveCode, $currencies, $currencyCode;

		$tokens = this.parseLetterCodesRemark($remark);
		if ($tokens) {
			$firstToken = php.array_shift($tokens);
			$restTokens = $tokens;
			$allTokensHaveCode = ($code) => {

				return Fp.all(($token) => {
					return $token['code'] === $code;
				}, $restTokens);
			};

			if ($firstToken['code'] == 'K') {
				$currencies = ['D', 'E'];
				for ($currencyCode of Object.values($currencies)) {
					if ($allTokensHaveCode($currencyCode)) {
						return {
							'exchangeRate': {
								'currency': this.parseCurrency($currencyCode),
								'rate': $firstToken['amount'],
							},
							'netPrices': Fp.map(($price) => {

								return {
									'passengerNumber': $price['passengerNumber'],
									'amount': $price['amount'],
								};
							}, $restTokens),
						};
					}
				}
			}
		}

		return null;
	}

	/** @param $line = 'DIVIDED/37AF*AWS 1403/02MAR18 YMJLFC'
	 *              || 'DIVIDED/6IIF*AWS 1423/23FEB18 ZHVFPE' */
	static parseDividedRemark($line) {
		let $regex, $matches, $pcc, $agentInitials;

		$regex =
			'/^DIVIDED\/' +
			'(?<agentSign>.+?)\\s+' +
			'(?<time>\\d{2,4})\/' +
			'(?<date>\\d{1,2}[A-Z]{3}\\d*)\\s+' +
			'(?<recordLocator>[A-Z]{6})' +
			'$/';
		if (php.preg_match($regex, $line, $matches = [])) {
			[$pcc, $agentInitials] = php.array_pad(php.explode('*', $matches['agentSign']), 2, '');
			return {
				'pcc': $pcc,
				'agentInitials': StringUtil.startsWith($agentInitials, 'A') ? php.substr($agentInitials, 1) : $agentInitials,
				'time': {
					'raw': $matches['time'],
					'parsed': CommonParserHelpers.decodeApolloTime($matches['time']),
				},
				'date': CommonParserHelpers.parseCurrentCenturyFullDate($matches['date']),
				'recordLocator': $matches['recordLocator'],
			};
		} else {
			return null;
		}
	}

	static parseLine($line) {
		let $match, $lineNumber, $remark, $res, $record;

		if (php.preg_match(/^\s*(?<lineNumber>\d+)\.(?<remark>.*)$/, $line, $match = [])) {
			$lineNumber = $match['lineNumber'];
			$remark = $match['remark'];

			if ($res = this.parseConversionRateRemark($remark)) {
				return {
					'lineNumber': php.intval($lineNumber),
					'remarkType': 'CONVERSION_RATE_REMARK',
					'data': $res,
				};
			} else if ($res = this.parseFopRemark($remark)) {
				return {
					'lineNumber': php.intval($lineNumber),
					'remarkType': 'FOP_REMARK',
					'data': $res,
				};
			} else if ($res = this.parseDividedRemark($remark)) {
				return {
					'lineNumber': php.intval($lineNumber),
					'remarkType': 'DIVIDED_REMARK',
					'data': $res,
				};
			} else {
				$record = GenericRemarkParser.parse($remark);
				return {
					'lineNumber': $lineNumber,
					'remarkType': $record['remarkType'],
					'data': $record['data'],
				};
			}
		} else {
			return null;
		}
	}
}

RemarksParser.TYPE_CASH = 'cash';
RemarksParser.TYPE_CC = 'creditCard';
module.exports = RemarksParser;
