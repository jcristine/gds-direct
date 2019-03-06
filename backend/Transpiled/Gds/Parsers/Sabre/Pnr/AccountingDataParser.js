// namespace Gds\Parsers\Sabre\SabreReservationParser;

const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');

const php = require('../../../../php.js');

class AccountingDataParser {
	static toRemoveIndent($size) {

		return ($line) => {
			return php.substr($line, $size);
		};
	}

	static parseFormOfPayment($text) {
		let $parsed, $matches, $_, $ccc, $ccn, $type;

		$parsed = null;
		// CCVIXXXXXXXXXXXX0302
		if (php.preg_match(/^\s*CC([A-Z]{2})([\dX]{15,16})\s*$/, $text, $matches = [])) {
			[$_, $ccc, $ccn] = $matches;
			$type = 'creditCard';
			$parsed = {
				'creditCardCompany': $ccc,
				'creditCardNumber': $ccn,
			};
		} else if (php.trim($text) === 'CA') {
			$type = 'cash';
		} else {
			$type = null;
		}
		return {'raw': $text, 'type': $type, 'parsed': $parsed};
	}

	static parseAccountingLine($line) {
		let $regex, $matches, $unparsed, $numKeys;

		$regex =
			'/^\\s*' +
			'(?<airline>[A-Z0-9]{2})\\s*' +
			'(?<source>¥|\\\/|\u00A4)\\s*' +
			'(?<partialTicketNumber>\\d{10})\\s*\\\/\\s*' +
			'(?<agencyCommission>\\d*\\.?\\d+)\\s*\\\/\\s*' +
			'(?<baseAmount>\\d*\\.?\\d+)\\s*\\\/\\s*' +
			'(?<taxAmount>\\d*\\.?\\d+)\\s*\\\/\\s*' +
			'(?<coverage>[^\\\/]*)\\s*\\\/\\s*' +
			'(?<formOfPayment>.*?)\\s+' +
			'(?<nameNumber>\\d+\\.\\d+)?\\s*' +
			'(?<lastName>[^\\s]+)\\s+' +
			'(?<firstName>[^\\\/]+)\\s*\\\/\\s*' +
			'(?<unparsedTokens>.*?)' +
			'\\s*$/';

		if (php.preg_match($regex, $line, $matches = [])) {
			$matches['nameNumber'] = $matches['nameNumber'] ? {
				'raw': $matches['nameNumber'],
				'fieldNumber': php.explode('.', $matches['nameNumber'])[0],
				'firstNameNumber': php.explode('.', $matches['nameNumber'])[1],
			} : null;
			$matches['source'] = {
				'raw': $matches['source'],
				'parsed': ({
					'¥': 'automatic',
					'/': 'manual',
					'\u00A4': 'msif',
				} || {})[$matches['source']],
			};
			$matches['formOfPayment'] = this.parseFormOfPayment($matches['formOfPayment']);
			$unparsed = php.trim($matches['unparsedTokens']);
			$matches['unparsedTokens'] = $unparsed
				? Fp.map('trim', php.explode('/', $unparsed))
				: [];
			$numKeys = Fp.filter('is_numeric', php.array_keys($matches));
			return php.array_diff_key($matches, php.array_flip($numKeys));
		} else {
			return null;
		}
	}

	// "BAIRBLK/BLK/10.00/0.00/PER" - 4 slashes
	// "L009100/DIS/77.00/0.00/ONE/N1.1" - 5 slashes
	// "AF¥7959119472/  82.00/    1010.00/ 430.76/ONE/CCVIXXXXXXXXXXXX0302 1.1POPICH RANKA/1/F/E" - 8 slashes
	static parseDataLine($line) {
		let $parsed, $type, $tokens;

		if ($parsed = this.parseAccountingLine($line)) {
			$type = 'accounting';
		} else {
			$tokens = Fp.map('trim', php.explode('/', php.trim($line)));
			if (php.count($tokens) === 5) {
				$type = 'bulk';
			} else if (php.count($tokens) === 6) {
				$type = 'discount';
			} else {
				$type = null;
			}
			$parsed = {
				'unparsedTokens': $tokens,
			};
		}

		return {
			'type': $type,
			'parsed': $parsed,
		};
	}

	static parseRecord($recordsBlock) {
		let $regex, $matches, $raw, $result, $record;

		$regex =
			'/^' +
			'(?<recordBlock>\\s{0,2}' +
			'(?<lineNumber>\\d+)\\.' +
			'(?<indent>\\s*)' +
			'(?<fistLine>.*)' +
			'(?<wrappedText>\\n\\s{4}.*)*' +
			')\\n?' +
			'(?<textLeft>([\\s\\S]*))' +
			'$/';

		if (php.preg_match($regex, $recordsBlock, $matches = [])) {
			$raw = php.implode('', Fp.map(this.toRemoveIndent(4 + php.strlen($matches['indent'])),
				StringUtil.lines($matches['recordBlock'])));
			$result = this.parseDataLine($raw);
			$record = {
				'lineNumber': php.intval($matches['lineNumber']),
				'type': $result['type'],
				'raw': $raw,
				'parsed': $result['parsed'],
			};
			return [$record, $matches['textLeft']];
		} else {
			return null;
		}

	}

	static parse($dump) {
		let $matches, $textLeft, $records, $record, tuple;

		if (php.preg_match(/^\s*ACCOUNTING DATA[^\S\n]*\n(.*)/s, $dump, $matches = [])) {
			$textLeft = $matches[1];
			$records = [];
			while (tuple = this.parseRecord($textLeft)) {
				[$record, $textLeft] = tuple;
				$records.push($record);
			}
			return {'records': $records};
		} else {
			return {'error': 'Unexpected start of >*PAC; dump'};
		}
	}
}

module.exports = AccountingDataParser;