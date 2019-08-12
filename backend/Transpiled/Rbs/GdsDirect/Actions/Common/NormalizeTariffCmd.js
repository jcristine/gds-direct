

const ApolloCmdParser = require('../../../../Gds/Parsers/Apollo/CommandParser.js');
const DateTime = require('../../../../Lib/Utils/DateTime.js');

let php = require('klesun-node-tools/src/Transpiled/php.js');

/** takes gds and tariff cmd like $D10DECKIVRIX and parses it into a structure common to all GDS-es */
class NormalizeTariffCmd
{
	constructor()  {
		this.$baseDate = php.date('Y-m-d H:i:s');
	}

	setBaseDate($baseDate)  {
		this.$baseDate = $baseDate;
		return this;
	}

	static normalizeApolloCmd($cmdData)  {
		let $typeToData;
		if (!$cmdData || !php.empty($cmdData['unparsed'])) {
			return null;
		}
		$typeToData = php.array_combine(
			php.array_column($cmdData['modifiers'] || [], 'type'),
			php.array_column($cmdData['modifiers'] || [], 'parsed')
		);
		$cmdData['typeToData'] = $typeToData;
		return $cmdData;
	}

	static normalizeGalileoCmd($cmdData)  {
		let $typeToData;
		if (!$cmdData || !php.empty($cmdData['unparsed'])) {
			return null;
		}
		$typeToData = php.array_combine(
			php.array_column($cmdData['modifiers'] || [], 'type'),
			php.array_column($cmdData['modifiers'] || [], 'parsed')
		);
		$cmdData['typeToData'] = $typeToData;
		if (!php.empty($cmdData['typeToData']['accountCodes'])) {
			$cmdData['typeToData']['accountCode'] = php.array_shift($cmdData['typeToData']['accountCodes']);
			delete($cmdData['typeToData']['accountCodes']);
		}
		return $cmdData;
	}

	static normalizeAmadeusCmd($cmdData)  {
		let $typeToData;
		if (!$cmdData) {
			return null;
		}
		$typeToData = php.array_combine(php.array_column($cmdData['modifiers'], 'type'),
			php.array_column($cmdData['modifiers'], 'parsed'));
		$typeToData = php.array_merge($typeToData, php.array_combine(
			php.array_column(($typeToData['generic'] || {})['rSubModifiers'] || [], 'type'),
			php.array_column(($typeToData['generic'] || {})['rSubModifiers'] || [], 'parsed')
		));
		if (php.array_key_exists(null, $typeToData)) {
			return null; // failed to parse some modifiers
		}
		$cmdData['departureDate'] = $typeToData['travelDates']['departureDate'] || null;
		$cmdData['returnDate'] = $typeToData['travelDates']['returnDate'] || null;
		delete($typeToData['travelDates']);
		delete($typeToData['generic']);
		$cmdData['typeToData'] = $typeToData;
		return $cmdData;
	}

	static normalizeSabreCmd($cmdData)  {
		let $typeToData, $ticketingDate;
		if (!$cmdData || !php.empty($cmdData['unparsed'])) {
			return null;
		}
		$typeToData = php.array_combine(
			php.array_column($cmdData['modifiers'] || [], 'type'),
			php.array_column($cmdData['modifiers'] || [], 'parsed')
		);
		if ($ticketingDate = $cmdData['ticketingDate'] || null) {
			$typeToData['ticketingDate'] = $ticketingDate;
		}
		$cmdData['returnDate'] = $typeToData['returnDate'] || null;
		delete($typeToData['returnDate']);
		$cmdData['typeToData'] = $typeToData;
		return $cmdData;
	}

	normalizeDate($dateRecord)  {
		if (!($dateRecord || {})['full']) {
			if (($dateRecord || {})['partial']) {
				$dateRecord['full'] =
                    DateTime.decodeRelativeDateInFuture($dateRecord['partial'], this.$baseDate);
			} else {
				// date not specified or invalid
				return null;
			}
		}
		return $dateRecord;
	}

	/** parse and apply some normalization if needed */
	execute($cmd, $gds)  {
		let $cmdData;
		if ($gds === 'apollo') {
			$cmdData = ApolloCmdParser.parseFareSearch($cmd);
			$cmdData = this.constructor.normalizeApolloCmd($cmdData);
		} else if ($gds === 'sabre') {
			$cmdData = require('../../../../Gds/Parsers/Sabre/Commands/TariffCmdParser.js').parse($cmd);
			$cmdData = this.constructor.normalizeSabreCmd($cmdData);
		} else if ($gds === 'amadeus') {
			$cmdData = require('../../../../Gds/Parsers/Amadeus/Commands/TariffCmdParser.js').parse($cmd);
			$cmdData = this.constructor.normalizeAmadeusCmd($cmdData);
		} else if ($gds === 'galileo') {
			$cmdData = require('../../../../Gds/Parsers/Galileo/Commands/TariffCmdParser.js').parse($cmd);
			$cmdData = this.constructor.normalizeGalileoCmd($cmdData);
		} else {
			return null;
		}
		if (!$cmdData) {
			return null;
		}
		$cmdData['departureDate'] = this.normalizeDate($cmdData['departureDate'] || null);
		$cmdData['returnDate'] = this.normalizeDate($cmdData['returnDate'] || null);
		if (php.empty($cmdData['departureAirport']) ||
            php.empty($cmdData['destinationAirport']) ||
            php.empty(($cmdData['departureDate'] || {})['full'])
		) {
			return null;
		}
		return $cmdData;
	}
}
module.exports = NormalizeTariffCmd;
