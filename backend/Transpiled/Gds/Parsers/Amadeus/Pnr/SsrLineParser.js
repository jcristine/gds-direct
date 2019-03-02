
// namespace Gds\Parsers\Amadeus\ReservationParser;

const SsrBlockParser = require('../../../../Gds/Parsers/Apollo/Pnr/SsrBlockParser.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const Fp = require('../../../../Lib/Utils/Fp.js');

const php = require('../../../../php.js');
class SsrLineParser
{
    // Example: 'P/LBN/2390602/LBN/19JAN64/M/05NOV17/BEAINI/HADI/S2',
    static parseSsrDocsToken($ssrData)  {
        let $tokenParts, $travelDocType, $issuingCountry, $travelDocNumber, $nationality, $dob, $genderAndI, $expirationDate, $lastName, $firstName, $segment, $segmentMaches;

        $tokenParts = php.explode('/', $ssrData['content'] || '');
        if (php.count($tokenParts) >= 9) {
            [$travelDocType, $issuingCountry, $travelDocNumber, $nationality, $dob, $genderAndI, $expirationDate, $lastName, $firstName, $segment] = php.array_pad($tokenParts, 10, null);

            php.preg_match('#S(\\d)#', $segment, $segmentMaches = []);
            return {
                'travelDocType': $travelDocType,
                'issuingCountry': $issuingCountry,
                'travelDocNumber': $travelDocNumber,
                'nationality': $nationality,
                'dob': {
                    'raw': $dob,
                    'parsed': SsrBlockParser.parseDateOfBirth($dob),
                },
                'gender': $genderAndI[0],
                'paxIsInfant': ($genderAndI[1]) === 'I',
                'expirationDate': CommonParserHelpers.parseCurrentCenturyFullDate($expirationDate),
                'lastName': $lastName,
                'firstName': $firstName,
            };
        } else {
            return null;
        }
    }

    // Example: '/D/USA/6960 AVENUE PETE STR/DEARBORN/FL/33710',
    static parseSsrDocaToken($ssrData)  {
        let $tokenParts, $addressType, $country, $addressDetails, $city, $province, $postalCode;

        $tokenParts = php.explode('/', $ssrData['content'] || '');
        if (php.count($tokenParts) >= 6) {
            [$addressType, $country, $addressDetails, $city, $province, $postalCode] = php.array_pad($tokenParts, 6, '');

            return {
                'addressType': $addressType,
                'country': $country,
                'addressDetails': $addressDetails,
                'city': $city,
                'province': $province,
                'postalCode': $postalCode,
            };
        } else {
            return null;
        }
    }

    // Example: '/V/H0380256/USA//USA/S3',
    static parseSsrDocoToken($ssrData)  {
        let $tokenParts, $pre, $travelDocType, $travelDocNumber, $issuingCountry, $dob, $countryWhereApplies, $segment, $segmentMaches;

        $tokenParts = php.explode('/', $ssrData['content'] || '');
        if (php.count($tokenParts) >= 6) {
            [$pre, $travelDocType, $travelDocNumber, $issuingCountry, $dob, $countryWhereApplies, $segment] = php.array_pad($tokenParts, 7, '');

            php.preg_match('#S(\\d)#', $segment, $segmentMaches = []);
            return {
                //'pre' => $pre,
                'travelDocType': $travelDocType,
                'travelDocNumber': $travelDocNumber,
                'issuingCountry': $issuingCountry,
                'dob': {
                    'raw': $dob,
                    'parsed': SsrBlockParser.parseDateOfBirth($dob),
                },
                'countryWhereApplies': $countryWhereApplies,
                'segmentNumber': $segmentMaches[1] || '',
            };
        } else {
            return null;
        }
    }

    // Example:
    // '/ PS1005775190/3',
    // 'PR203833593',
    // 'DL9418144359/P2',
    static parseSsrFqtvToken($ssrData)  {
        let $regex, $matches;

        $regex =
            '/'+
            '(?<airline>[A-Z0-9\\d]{2})'+
            '(?<flyerNumber>[A-Z0-9]{3,})'+
            '.*?'+
            '(\\\/P(?<paxNum>\\d+))?'+
            '\\s*$/';
        if (php.preg_match($regex, $ssrData['content'], $matches = [])) {
            return {
                'airline': $matches['airline'],
                'flyerNumber': $matches['flyerNumber'],
                'paxNum': $matches['paxNum'] || '',
            };
        }
        return null;
    }

    // '/S3', '/S3', '/S8/P4'
    static parseSegmentNumberToken($ssrContent)  {
        let $regex, $matches;

        $regex = '/^\\s*'+
            '\\\/S(?<segNum>\\d+)'+
            '(\\\/P(?<paxNum>\\d+))?'+
            '\\s*$/';
        if (php.preg_match($regex, $ssrContent, $matches = [])) {
            return {
                'segNum': $matches['segNum'],
                'paxNum': $matches['paxNum'] || '',
            };
        } else {
            return null;
        }
    }

    static parseSsrLineData($ssrData)  {
        let $code, $content;

        $code = $ssrData['ssrCode'];
        $content = $ssrData['content'];
        if ($code == 'DOCS') {
            return this.parseSsrDocsToken($ssrData);
        } else if ($code == 'DOCA') {
            return this.parseSsrDocaToken($ssrData);
        } else if ($code == 'DOCO') {
            return this.parseSsrDocoToken($ssrData);
        } else if ($code == 'FQTV') {
            return this.parseSsrFqtvToken($ssrData);
        } else if (SsrBlockParser.isMealSsrCode($code)) {
            return this.parseSegmentNumberToken($content);
        } else if (SsrBlockParser.isDisabilitySsrCode($code)) {
            return this.parseSegmentNumberToken($content);
        }
        return null;
    }

    static cleanNumMatches($matches)  {
        let $numKeys;

        $numKeys = Fp.filter('is_numeric', php.array_keys($matches));
        return php.array_diff_key($matches, php.array_flip($numKeys));
    }

    static parse($line)  {
        let $filterSsr, $filterOsi, $matches, $ssrData;

        $line = php.str_replace(php.PHP_EOL, '', $line);
        $filterSsr = '/^'+
            '\\s{0,2}'+
            '(?<lineNumber>\\d{1,2})\\s'+
            '[\\\/\\*]?(?<type>SSR)\\s+'+
            '(?<ssrCode>[A-Z]{4})\\s'+
            '(?<airline>[A-Z\\d]{2})?\\s*'+
            '(?:(?<status>[A-Z]{2})(?<statusNumber>\\d{0,2}))?\\s*'+
            '(?<content>.*?)'+
            '(\\\/S(?<segNum>\\d+))?'+
            '(\\\/P(?<paxNum>\\d+))?'+
            '\\s*$/';
        $filterOsi = '#^'+
            '\\s{0,2}'+
            '(?<lineNumber>\\d{1,2})\\s'+
            '(?<ssrCode>OSI)\\s+'+
            '(?<airline>[A-Z\\d]{2})?\\s*'+
            '(?<content>.+)'+
            '#s';
        if (php.preg_match($filterSsr, $line, $matches = [])) {
            $ssrData = this.cleanNumMatches($matches);
            $ssrData['data'] = this.parseSsrLineData($ssrData);
            if (!php.empty($ssrData['segNum']) || !php.empty($ssrData['paxNum'])) {
                $ssrData['data'] = $ssrData['data'] || [];
                $ssrData['data']['segNum'] = $ssrData['segNum'] || null || null;
                $ssrData['data']['paxNum'] = $ssrData['paxNum'] || null || null;
            }
            $ssrData['line'] = $line;
            return $ssrData;
        } else if (php.preg_match($filterOsi, $line, $matches = [])) {
            $ssrData = this.cleanNumMatches($matches);
            $ssrData['line'] = $line;
            return $ssrData;
        }
        return null;
    }
}
module.exports = SsrLineParser;
