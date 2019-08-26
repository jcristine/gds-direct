

const php = require('klesun-node-tools/src/Transpiled/php.js');

class FqLineParser
{
	/**
     * Example input:
     * FQ-USD 1350.00/USD 34.40US/USD 447.62XT/USD 1832.02 - 8APR *IF91-MHPR3MUS+MHPR3MUS+MHPR3MUS+MHPR3MUS+MHPR3MUS+MHPR3MUS
     */
	static parseFqLine($line)  {
		let $result, $priceConstructionPart, $miscInfoPart, $priceConstructionPartTokens, $state, $token, $price;
		$result = {
			'fare': null,
			'taxList': [],
			'netPrice': null,
		};
		$line = php.substr($line, 3);
		[$priceConstructionPart, $miscInfoPart] = php.array_pad(php.explode(' - ', $line), 2, '');
		$priceConstructionPartTokens = php.explode('/', $priceConstructionPart);
		$state = this.FQ_LINE_PARSER_STATE_WAITING_FOR_FARE;
		for ($token of $priceConstructionPartTokens) {
			if ($state == this.FQ_LINE_PARSER_STATE_WAITING_FOR_FARE) {
				$price = this.parsePriceConstructionToken($token);
				if (!$price) {
					throw new Error('First price construction token expected to be fare, something else found: ['+$token+']');
				} else if ($price['taxType']) {
					throw new Error('First price construction token expected to be fare, tax found: ['+$token+']');
				} else {
					$result['fare'] = {
						'currency': $price['currency'],
						'amount': $price['amount'],
					};

					$state = this.FQ_LINE_PARSER_STATE_WAITING_FOR_TAX_OR_NET_PRICE;
				}
			} else if ($state = this.FQ_LINE_PARSER_STATE_WAITING_FOR_TAX_OR_NET_PRICE) {
				$price = this.parsePriceConstructionToken($token);
				if (!$price) {
					throw new Error('Tax or net price expected, something else found: ['+$token+']');
				} else if ($price['taxType']) {
					$result['taxList'].push({
						'currency': $price['currency'],
						'amount': $price['amount'],
						'taxType': $price['taxType'],
					});
				} else {
					$result['netPrice'] = {
						'currency': $price['currency'],
						'amount': $price['amount'],
					};
				}
			}}
		return $result;
	}

	static parsePriceConstructionToken($token)  {
		let $matches;
		$matches = [];
		php.preg_match_all(/([A-Z]{3}) (\d+(\.\d{2})?)([A-Z]{2})?/, $token, $matches);
		if (php.count($matches[1]) > 0 && php.count($matches[2]) > 0) {
			return {
				'currency': $matches[1][0],
				'amount': $matches[2][0],
				'taxType': $matches[4][0] ? $matches[4][0] : null,
			};
		} else {
			return false;
		}
	}
}
FqLineParser.FQ_LINE_PARSER_STATE_WAITING_FOR_FARE = 0;
FqLineParser.FQ_LINE_PARSER_STATE_WAITING_FOR_TAX_OR_NET_PRICE = 1;

module.exports = FqLineParser;
