

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');

class FopParser
{
	static parse($dump)  {
		let $sectionLines;
		$sectionLines = StringUtil.lines($dump);
		return this.parseFopLine($sectionLines[0]);
	}

	static parseFopLine($line)  {
		let $matches, $expirationDate, $approvalCode;
		$line = php.trim(php.mb_substr($line, php.mb_strlen('FOP:-')));
		if ($line == 'CK') {
			return {
				formOfPayment: 'check',
			};
		} else if (php.preg_match(/(?<ccType>VI|AX|CA|DS)(?<ccNumber>3\d{14}|4\d{15}|5\d{15}|6\d{15})\/D(?<expirationDate>\d{4})(\/\*(?<approvalCode>[A-Z\d]+))?/, $line, $matches = [])) {
			$expirationDate = $matches.expirationDate;
			$approvalCode = php.array_key_exists('approvalCode', $matches) ? $matches.approvalCode : null;

			return {
				formOfPayment: 'cc',
				ccType: $matches.ccType,
				ccNumber: $matches.ccNumber,
				expirationDate: {
					raw: $expirationDate,
					parsed: this.decodeExpirationDate($expirationDate),
				},
				approvalCode: $approvalCode,
			};
		} else {
			return null;
		}
	}

	static decodeExpirationDate($str)  {
		let $month, $shortYear;
		$month = php.substr($str, 0, 2);
		$shortYear = php.substr($str, 2);
		return '20'+$shortYear+'-'+$month;
	}
}
module.exports = FopParser;
