

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
class PnrInfoBlockParser
{
	static parse($dump)  {
		let $lines, $result, $line, $res;

		$lines = StringUtil.lines($dump);
		$result = {
			'receivedFrom': null,
			'pcc': null,
			'homePcc': null,
			'agentInitials': null,
			'time': null,
			'date': null,
			'recordLocator': null,
		};

		for ($line of Object.values($lines)) {
			$line = php.trim($line);
			if ($res = this.parseReceivedFromLine($line)) {
				$result['receivedFrom'] = $res['name'];
			} else if (!$line) {
				// skip empty lines
			} else if ($res = this.parsePnrFinalLine($line)) {
				$result['pcc'] = $res['pcc'];
				$result['homePcc'] = $res['homePcc'];
				$result['agentInitials'] = $res['agentInitials'];
				$result['time'] = $res['time'];
				$result['date'] = $res['date'];
				$result['recordLocator'] = $res['recordLocator'];
			}}
		return $result;
	}

	static parseReceivedFromLine($line)  {

		if (StringUtil.startsWith($line, 'RECEIVED FROM - ')) {
			return {
				'name': php.trim(php.substr($line, php.strlen('RECEIVED FROM - '))),
			};
		} else {
			return null;
		}
	}

	static parsePnrFinalLine($line)  {
		let $regex, $match, $initials;

		// 'O4FG.O4FG*A15 0524/13SEP11 GMIKYK H'
		$regex =
            '/^'+
            '(?<pcc>[A-Z\\d]{3,4})\\.'+
            '(?<homePcc>[A-Z\\d]{3,4})'+
            '(\\*|\\d|R|\\-)'+
            '(?<agentInitials>[A-Z\\d]{3})\\s'+
            '(?<time>\\d{4})\\\/(?<date>\\d{2}[A-Z]{3}\\d{2})'+
            '(\\s(?<recordLocator>[A-Z\\d]{6}))?'+
            '/';

		if (php.preg_match($regex, $line, $match = [])) {
			$initials = $match['agentInitials'];
			$initials = StringUtil.startsWith($initials, 'A') ? php.substr($initials, 1) : null;
			return {
				'pcc': $match['pcc'],
				'homePcc': $match['homePcc'],
				'agentInitials': $initials,
				'time': $match['time'],
				'time': {
					'raw': $match['time'],
					'parsed': this.parseReservationTime($match['time']),
				},
				'date': {
					'raw': $match['date'],
					'parsed': this.parseReservationDate($match['date']),
				},
				'recordLocator': $match['recordLocator'],
			};
		} else {
			return null;
		}
	}

	static parseReservationTime($time)  {

		return require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js').decodeApolloTime($time);
	}

	static parseReservationDate($date)  {
		let $parsedRelative;

		$parsedRelative = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js').parseApolloFullDate($date);
		return $parsedRelative ? '20'+$parsedRelative : null;
	}
}
module.exports = PnrInfoBlockParser;
