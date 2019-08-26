

const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');

class TktgParser
{
	static parse($dump)  {
		let $ticketedRegex, $tokens, $matches, $_, $tauDate;
		$ticketedRegex =
            '/^TKTG-T/'+
            '(?<agencyCode>[A-Z]{3})'+
            '\\s+'+
            '(?<ticketingDate>\\d{1,2}[A-Z]{3})'+
            '(?<ticketingTime>\\d{3,4})'+
            '(?<timezone>[A-Z]?)'+
            '\\s+'+
            '(?<fpInitials>[A-Z\\d]{2})'+
            '\\s+'+
            'AG'+
            '/';
		if (php.preg_match($ticketedRegex, $dump, $tokens = [])) {
			return {
				'agencyCode': $tokens['agencyCode'],
				'ticketingDate': {
					'raw': $tokens['ticketingDate'],
					'parsed': CommonParserHelpers.parsePartialDate($tokens['ticketingDate']),
				},
				'ticketingTime': {
					'raw': $tokens['ticketingTime'],
					'parsed': CommonParserHelpers.decodeApolloTime($tokens['ticketingTime']),
				},
				'timezone': {
					'raw': $tokens['timezone'],
					'parsed': $tokens['timezone'] === 'Z' ? 'UTC' : null,
				},
				'fpInitials': $tokens['fpInitials'],
			};
		} else if (php.preg_match(/^TKTG-TAU\/(\d{1,2}[A-Z]{3})$/, $dump, $matches = [])) {
			[$_, $tauDate] = $matches;
			return {
				'tauDate': {
					'raw': $tauDate,
					'parsed': CommonParserHelpers.parsePartialDate($tauDate),
				},
			};
		} else {
			return null;
		}
	}
}
module.exports = TktgParser;
