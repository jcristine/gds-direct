
// namespace Gds\Parsers\Apollo\LinearFareParser;

const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const FareConstructionParser = require('../../../../Gds/Parsers/Common/FareConstruction/FareConstructionParser.js');
const php = require('../../../../php');

class LinearFareParser
{
    // 'FARE USD 870.00 TAX 11.20AY TAX 35.60US TAX 3.96XA TAX 13.50XF TAX 7.00XY TAX 5.50YC TAX 136.00YQ TOT USD 1082.76'
    // 'FARE EUR 145.00 EQU USD 193.00 TAX 4.50LV TAX 8.70XM TAX 4.00UA TAX 2.00UD TAX 8.50YK TAX 1.40ZR TAX 113.70YQ TOT USD 335.80 '
    static parseFareBreakdown($line)  {
        let $taxPattern, $regex, $matches, $taxMatches;
        $taxPattern = 'TAX\\s+(\\d*\\.\\d+|EXEMPT\\s+)([A-Z0-9]{2})\\s+';
        $regex =
            '\/^FARE\\s+'+
            '(?<baseCurrency>[A-Z]{3})\\s+'+
            '(?<baseAmount>\\d*\\.?\\d+)\\s+'+
            '(EQU\\s+'+
            '(?<equivalentCurrency>[A-Z]{3})\\s+'+
            '(?<equivalentAmount>\\d*\\.?\\d+)\\s+'+
            ')?'+
            '(?<taxList>(?:'+$taxPattern+')*)TOT\\s+'+
            '(?<totalCurrency>[A-Z]{3})\\s+'+
            '(?<totalAmount>\\d*\\.\\d+)'+
            '(?<textLeft>.*)'+
            '\/s';
        if (php.preg_match($regex, $line, $matches = [])) {
            $matches = php.array_filter($matches);
            $taxMatches = php.preg_match_all('\/'+$taxPattern+'\/', $matches['taxList'] || '', $taxMatches = [], php.PREG_SET_ORDER);
            return {
                'fareAndMarkup': {
                    'currency': $matches['baseCurrency'],
                    'amount': $matches['baseAmount'],
                },
                'fareEquivalent': php.isset($matches['equivalentCurrency']) ? {
                    'currency': $matches['equivalentCurrency'],
                    'amount': $matches['equivalentAmount'],
                } : null,
                'taxes': Fp.map(($tuple) => {
                    let $_, $amount, $taxCode;
                    [$_, $amount, $taxCode] = $tuple;
                    if (php.trim($amount) === 'EXEMPT') {
                        $amount = '0.00';
                    }
                    return {
                        'pseudoCountryCode': $taxCode,
                        'amount': $amount,
                    };
                }, $taxMatches),
                'amountCharged': {
                    'currency': $matches['totalCurrency'],
                    'amount': $matches['totalAmount'],
                },
                'textLeft': $matches['textLeft'] || '',
            };
        } else {
            return null;
        }
    }

    static parseFcWithNewParser($text)  {
        let $lines, $i, $fareBreakdown, $cleanFcText, $fareConstruction, $textLeft;
        $lines = StringUtil.lines($text);
        for ($i = 0; $i < php.count($lines); ++$i) {
            $fareBreakdown = this.parseFareBreakdown(php.implode(php.PHP_EOL, php.array_slice($lines, $i)));
            if ($fareBreakdown) {
                $cleanFcText = php.implode(php.PHP_EOL, php.array_slice($lines, 0, $i));
                $fareConstruction = FareConstructionParser.parse($cleanFcText);
                if ($fareConstruction['textLeft']) {
                    $fareConstruction['error'] = 'Text left after parsed fare construction - '+$fareConstruction['textLeft'];
                } else if (!php.isset($fareConstruction['error'])) {
                    $textLeft = $fareBreakdown['textLeft'];
                    delete($fareBreakdown['textLeft']);
                    $fareConstruction = {
                        'parsed': php.array_merge($fareConstruction['parsed'], $fareBreakdown),
                        'textLeft': $textLeft,
                    };
                }
                return $fareConstruction;
            }
        }
        return {'error': 'Failed to parse fare breakdown'};
    }
}
module.exports = LinearFareParser;
