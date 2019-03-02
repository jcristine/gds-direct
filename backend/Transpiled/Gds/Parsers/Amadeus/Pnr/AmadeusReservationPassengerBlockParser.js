
// namespace Gds\Parsers\Amadeus\ReservationParser;

const Fp = require('../../../../Lib/Utils/Fp.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * Basically copy-pasted from pax block parser common for Sabre & Apollo, and
 * changed slightly; the main reason is I saw almost no Amadeus dumps at the
 * moment of writing, so if you have significant testing material it'd better
 * be rewritten completely
 */
const php = require('../../../../php.js');
class AmadeusReservationPassengerBlockParser
{
    static parseLine($line)  {
        let $passengerList, $tokens, $token, $matches, $parent, $child;

        $line = php.trim($line);
        if (php.preg_match(/^\d+\./, $line)) {
            $passengerList = [];

            $tokens = php.array_filter(Fp.map('trim', $line.split(/(?=\b\d+\.)/)));
            for ($token of Object.values($tokens)) {
                if (php.preg_match(/^(?<adultToken>.+)\(INF(?<infantToken>.+)\)/, $token, $matches = [])) {
                    $parent = this.parsePassengerToken($matches['adultToken']);
                    $passengerList.push($parent);
                    $child = this.parseInfantToken($matches['infantToken']);
                    $child['lastName'] = $child['lastName'] || $parent['lastName'];
                    $child['nameNumber'] = {
                        'fieldNumber': $parent['nameNumber']['fieldNumber'],
                        'isInfant': true,
                    };
                    $passengerList.push($child);
                } else {
                    $passengerList.push(this.parsePassengerToken($token));
                }}

            return {
                'passengerList': $passengerList,
                'success': true
            };
        } else {
            return {'success': false};
        }
    }

    static parseInfantToken($token)  {
        let $lastName, $firstName, $dob;

        [$lastName, $firstName, $dob] = php.explode('\/', $token);
        return {
            'success': true,
            'rawNumber': null,
            'firstName': $firstName,
            'lastName': $lastName,
            // Enter "PTC" in focal point for reference
            'ptc': 'INF',
            'age': null,
            'dob': $dob ? {
                'raw': $dob,
                'parsed': this.parseDateOfBirth($dob),
            } : null,
        };
    }

    // Few examples:
    // '1.DELATORRE/VMARTIN'
    static parsePassengerToken($token)  {
        let $matches, $name, $details;

        if (php.preg_match(/^(?<number>\d+\.)(?<name>[A-Z\s-]+\/[A-Z\s-]+)\((?<details>.+)\)/, $token, $matches = [])) {
            $name = this.parseName($matches['name']);
            $details = this.parseDetails($matches['details']);
            return {
                'success': true,
                'rawNumber': $matches['number'],
                'firstName': $name['firstName'],
                'lastName': $name['lastName'],
                'age': $details['age'],
                'dob': $details['dob'],
                'ptc': $details['ptc'],
                'nameNumber': {
                    'fieldNumber': php.explode('.', $matches['number'])[0],
                    'isInfant': $details['ptc'] === 'INF',
                },
            };
        } else if (php.preg_match(/^(?<number>\d+\.)(?<name>.+\/.*)/, $token, $matches = [])) {
            $name = this.parseName($matches['name']);
            return {
                'success': true,
                'rawNumber': $matches['number'],
                'firstName': $name['firstName'],
                'lastName': $name['lastName'],
                'age': null,
                'dob': null,
                'ptc': null,
                'nameNumber': {
                    'fieldNumber': php.explode('.', $matches['number'])[0],
                    'isInfant': false
                },
            };
        } else {
            return {'success': false};
        }
    }

    static parseName($token)  {
        let $lastName, $firstName;

        [$lastName, $firstName] = php.explode('\/', $token);
        return {
            'firstName': php.trim($firstName),
            'lastName': php.trim($lastName),
        };
    }

    static parseDetails($token)  {
        let $ptc, $dob;

        [$ptc, $dob] = php.array_pad(php.explode('\/', $token), 2, null);
        return {
            'age': php.is_numeric(php.substr($ptc, 1)) ? php.substr($ptc, 1) : null,
            'dob': $dob ? {
                'raw': $dob,
                'parsed': this.parseDateOfBirth($dob),
            } : null,
            'ptc': $ptc,
        };
    }

    static parseDateOfBirth($token)  {

        return (CommonParserHelpers.parsePastFullDate($token) || {})['parsed'];
    }
}
AmadeusReservationPassengerBlockParser.PASSENGER_TYPE_INFANT = 'infant';
AmadeusReservationPassengerBlockParser.PASSENGER_TYPE_ADULT = 'adult';
AmadeusReservationPassengerBlockParser.PASSENGER_TYPE_CHILD = 'child';
module.exports = AmadeusReservationPassengerBlockParser;
