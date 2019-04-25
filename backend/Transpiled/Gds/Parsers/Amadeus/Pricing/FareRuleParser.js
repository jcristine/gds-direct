
// namespace Gds\Parsers\Amadeus\Pricing;

const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const FareRuleSectionParser = require('../../../../Gds/Parsers/Common/FareRuleSectionParser.js');
const php = require('../../../../php.js');

/**
 * parses output of >FQN...; which displays Fare Rules or component list
 */
class FareRuleParser
{
    static parseSequence($linesLeft, $parse)  {
        let $parsedLines, $line, $parsedLine;

        $parsedLines = [];
        while ($line = php.array_shift($linesLeft)) {
            if ($parsedLine = $parse($line)) {
                $parsedLines.push($parsedLine);
            } else {
                php.array_unshift($linesLeft, $line);
                break;
            }
        }
        return [$parsedLines, $linesLeft];
    }

    static isEmptyLine($line)  {

        return php.trim($line) === '';
    }

    /** @param $expr = '1' || '' || '1,3-4' */
    static parsePaxNums($expr)  {
        let $parseRange;

        if (php.preg_match(/^\s*(\d[\d\/-]*)\s*$/, $expr)) {
            $parseRange = ($text) => {
                let $pair;

                $pair = php.explode('-', $text);
                return php.range($pair[0], $pair[1] || $pair[0]);
            };
            return Fp.flatten(Fp.map($parseRange, php.explode('\/', php.trim($expr))));
        } else {
            return null;
        }
    }

    // ' 1 - PSGR P1 ADT                                   RULES DISPLAY',
    // '2 - PSGR P1-2 ADT',
    // '1 - PTC 1/6-6 ADT',
    static parseScreenHeaderLine($line)  {
        let $regex, $matches, $paxNumType;

        $regex =
            '\/^\\s*'+
            '(?<pricingPaxNum>\\d+)\\s*-\\s*'+
            '(?<paxNumType>PSGR P|PTC\\s*)'+
            '(?<paxNumExpr>\\d+[\\d+\\\/-]*)\\s*'+
            '(?<ptc>[A-Z0-9]+)'+
            '.*?'+
            '(?<isRulesDisplayMark>RULES DISPLAY|)\\s*'+
            '$\/';
        if (php.preg_match($regex, $line, $matches = [])) {
            $paxNumType = php.trim($matches['paxNumType']);
            return {
                'pricingPaxNum': $matches['pricingPaxNum'],
                'paxNumberType': {
                    'PSGR P': 'pnrName',
                    'PTC': 'commandPtc',
                }[$paxNumType],
                'paxNumbers': this.parsePaxNums($matches['paxNumExpr']),
                'ptc': $matches['ptc'],
                'isRulesDisplay': $matches['isRulesDisplayMark'] ? true : false,
            };
        } else {
            return null;
        }
    }

    // 'FARE COMPONENT  1    ADT MWZJNB KQ  TSRWTZ',
    //          ' FQN 3-1    INF WASDLA ET  ULPRUS',
    //          ' FQN 1-1    ADT KIVRIX SU  YFO               FF : EF',
    static parseComponentLine($line)  {
        let $regex, $matches;

        $regex =
            '\/\\s*'+
            '(?<label>.*?)\\s*'+
            '(?<componentNumber>\\d+)\\s+'+
            '(?<ptc>[A-Z0-9]{3})\\s+'+
            '(?<departureCity>[A-Z]{3})'+
            '(?<destinationCity>[A-Z]{3})\\s+'+
            '(?<airline>[A-Z0-9]{2})\\s+'+
            '(?<fareBasis>[A-Z0-9]+)'+
            '(\\\/(?<ticketDesignator>[A-Z0-9]+))?\\s*'+
            '(?<unparsed>.*?)\\s*'+
            '$\/';
        if (php.preg_match($regex, $line, $matches = [])) {
            return {
                'command': $matches['label'] !== 'FARE COMPONENT'
                    ? $matches['label']+$matches['componentNumber']
                    : null,
                'componentNumber': $matches['componentNumber'],
                'ptc': $matches['ptc'],
                'departureCity': $matches['departureCity'],
                'destinationCity': $matches['destinationCity'],
                'airline': $matches['airline'],
                'fareBasis': $matches['fareBasis'],
                'ticketDesignator': $matches['ticketDesignator'],
            };
        } else {
            return null;
        }
    }

    static parseFclLine($line)  {
        let $pattern, $symbols, $names, $split;

        //         'FCL: TSRWTZ    TRF:  31 RULE: TZ11 BK:  T',
        $pattern = 'LLLLFFFFFFFFFF LLLLTTTT LLLLLTRRRR LLL  B';
        $symbols = php.str_split($pattern, 1);
        $names = php.array_combine($symbols, $symbols);
        $split = StringUtil.splitByPosition($line, $pattern, $names, true);

        if ($split['L'] === 'FCL:TRF:RULE:BK:') {
            return {
                'fareBasis': $split['F'],
                // in XML it's called "tariff class id"
                'trf': $split['T'],
                'rule': $split['R'],
                'bookingClass': $split['B'],
            };
        } else {
            return null;
        }
    }

    static parsePtcLine($line)  {
        let $pattern, $symbols, $names, $split;

        //         'PTC: ADT-ADULT              FTC: XOX-ONE WAY SPECIAL EXCURSION',
        //         'PTC: INF-INFANT NOT OCCUPYI FTC: XAN-NON REFUNDABLE APEX',
        $pattern = 'LLLL CCC-MMMMMMMMMMMMMMMMMM LLLL TTT-RRRRRRRRRRRRRRRRRRRRRRRRRRR';
        $symbols = php.str_split($pattern, 1);
        $names = php.array_combine($symbols, $symbols);
        $split = StringUtil.splitByPosition($line, $pattern, $names, true);

        if ($split['L'] === 'PTC:FTC:') {
            return {
                'ptc': $split['C'],
                'ptcMeaning': $split['M'],
                'fareType': $split['T'],
                'tripTypeRemark': $split['R'],
            };
        } else {
            return null;
        }
    }

    // 'FCL: TSRWTZ    TRF:  31 RULE: TZ11 BK:  T',
    // 'PTC: ADT-ADULT              FTC: XOX-ONE WAY SPECIAL EXCURSION',
    static parseRulesHeader($linesLeft)  {
        let $result, $line, $fcl, $ptc;

        $result = {};
        while ($line = php.array_shift($linesLeft)) {
            if ($fcl = this.parseFclLine($line)) {
                $result = php.array_merge($result, $fcl);
            } else if ($ptc = this.parsePtcLine($line)) {
                $result = php.array_merge($result, $ptc);
            } else if (php.preg_match(/[A-Z]{2}\.\S+/, $line)) {
                // Fare Rules section start
                php.array_unshift($linesLeft, $line);
                break;
            } else {
                $result['unparsedLines'] = $result['unparsedLines'] || [];
                $result['unparsedLines'].push($line);
            }
        }
        return [$result, $linesLeft];
    }

    // 'MN.MIN STAY',
    // 'PE.PENALTIES'
    // 'VR.VOLUNTARY REFUNDS',
    static parseSectionHeader($line)  {
        let $abbrToNumber, $matches, $_, $abbr, $name, $num;

        $abbrToNumber = {
            'EL': '01', 'DA': '02', 'SE': '03', 'FL': '04',
            'AP': '05', 'MN': '06', 'MX': '07', 'SO': '08',
            'TF': '09', 'CO': '10', 'BO': '11', 'SU': '12',
            'AC': '13', 'TR': '14', 'SR': '15', 'PE': '16',
            'HI': '17', 'TE': '18', 'CD': '19', 'TC': '20',
            'AD': '21', 'OD': '22', 'MD': '23', 'GP': '26',
            'TO': '27', 'VI': '28', 'DE': '29', 'VC': '31',
            'RU': '50',
            'AO': null, 'EE': null, 'OJ': null, 'CT': null,
        };

        if (php.preg_match(/^([A-Z]{2})\.(\S.*?)\s*$/, $line, $matches = [])) {
            [$_, $abbr, $name] = $matches;
            $num = $abbrToNumber[$abbr];
            return {
                'abbreviation': $abbr,
                'sectionName': $name,
                'sectionNumber': $num ? php.intval($num) : null,
            };
        } else {
            return null;
        }
    }

    // block starts with something like:
    // 'PE.PENALTIES'
    // 'FOR TSRWTZ TYPE FARES'
    static parseSections($linesLeft)  {
        let $sections, $i, $line, $header;

        $sections = [];
        $i = -1;

        for ($line of Object.values($linesLeft)) {
            if ($header = this.parseSectionHeader($line)) {
                ++$i;
                $header['raw'] = '';
                $sections[$i] = $header;
            } else if ($i > -1) {
                $sections[$i]['raw'] += $sections[$i]['raw'] ? php.PHP_EOL+$line : $line;
            }}
        return Fp.map(($section) => {
            let $raw, $common;

            $raw = php.rtrim($section['raw']);
            $common = FareRuleSectionParser.parse($raw, $section['sectionNumber'], $section['sectionName']);
            $common['abbreviation'] = $section['abbreviation'];
            return $common;
        }, $sections);
    }

    static parse($dump)  {
        let $linesLeft, $cmdCopy, $emptyLines, $displayHeaderLine, $displayHeaderData, $type, $fareComponent, $header, $sections, $data, $components;

        $linesLeft = StringUtil.lines($dump);
        $cmdCopy = php.trim(php.array_shift($linesLeft));
        if (!StringUtil.startsWith($cmdCopy, 'FQN')) {
            return {'error': 'Unexpected command copy format - '+$cmdCopy};
        }
        [$emptyLines, $linesLeft] = this.parseSequence($linesLeft, (...args) => this.isEmptyLine(...args));

        $displayHeaderLine = php.array_shift($linesLeft);
        if (!($displayHeaderData = this.parseScreenHeaderLine($displayHeaderLine))) {
            return {'error': 'Failed to parse FQN screen header - '+php.trim($displayHeaderLine)};
        }

        if ($displayHeaderData['isRulesDisplay']) {
            $type = 'rulesDisplay';
            $fareComponent = this.parseComponentLine(php.array_shift($linesLeft));
            [$header, $linesLeft] = this.parseRulesHeader($linesLeft);
            $sections = this.parseSections(php.array_splice($linesLeft, 0));
            $data = {
                'fareComponent': $fareComponent,
                'header': $header,
                'sections': $sections,
            };
        } else {
            $type = 'componentList';
            [$components, $linesLeft] = this.parseSequence($linesLeft, (...args) => this.parseComponentLine(...args));
            if (!$components) {
                return {'error': 'Failed to parse fare component - '+php.trim(ArrayUtil.getFirst($linesLeft))};
            }
            $data = $components;
        }
        [$emptyLines, $linesLeft] = this.parseSequence($linesLeft, (...args) => this.isEmptyLine(...args));
        return {
            'pricingPaxNum': $displayHeaderData['pricingPaxNum'],
            'paxNumberType': $displayHeaderData['paxNumberType'],
            'paxNumbers': $displayHeaderData['paxNumbers'],
            'ptc': $displayHeaderData['ptc'],
            'type': $type,
            'data': $data,
            'linesLeft': $linesLeft,
        };
    }
}
module.exports = FareRuleParser;
