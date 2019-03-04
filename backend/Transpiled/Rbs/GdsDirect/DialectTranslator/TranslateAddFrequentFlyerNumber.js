
// namespace Rbs\GdsDirect\DialectTranslator;
const Fp = require('../../../Lib/Utils/Fp.js');

/**
 * Apollo : MPN1*@LH12345678910
 * Sabre  : FFAA987654321/CX,AS,EI,QF-2.2
 * Amadeus: FFNUA-123456778910,UA,LH/P1
 * Galileo: M+P1/UA12345876490/BD/LH/AC
 */
const php = require('../../../php.js');
class TranslateAddFrequentFlyerNumber
{
    static normalizeData($parsedData, $gds)  {

        if (!$parsedData) {
            return null;
        }
        if ($gds === 'apollo') {
            return $parsedData;
        } else if ($gds === 'sabre') {
            return {'passengers': [{
                'majorPaxNum': $parsedData['majorPaxNum'],
                'minorPaxNum': $parsedData['minorPaxNum'],
                'mileagePrograms': [{
                    'airline': $parsedData['airline'],
                    'code': $parsedData['code'],
                    'partners': $parsedData['partners'],
                }],
            }]};
        } else if ($gds === 'amadeus') {
            return {'passengers': [{
                'majorPaxNum': $parsedData['majorPaxNum'],
                'minorPaxNum': null,
                'mileagePrograms': [{
                    'airline': $parsedData['airline'],
                    'code': $parsedData['code'],
                    'partners': php.array_values(Fp.filter(($partner) => {

                        return $partner !== $parsedData['airline'];
                    }, $parsedData['partners'])),
                }],
            }]};
        } else if ($gds === 'galileo') {
            return {'passengers': [{
                'majorPaxNum': $parsedData['majorPaxNum'],
                'minorPaxNum': null,
                'mileagePrograms': $parsedData['mileagePrograms'],
            }]};
        } else {
            return null;
        }
    }

    static flattenMileagePrograms($norm)  {
        let $flatMps, $pax, $mp;

        $flatMps = [];
        for ($pax of Object.values($norm['passengers'])) {
            for ($mp of Object.values($pax['mileagePrograms'])) {
                $flatMps.push({
                    'airline': $mp['airline'],
                    'code': $mp['code'],
                    'partners': $mp['partners'] || [],
                    'majorPaxNum': $pax['majorPaxNum'],
                    'minorPaxNum': $pax['majorPaxNum'],
                });}}
        return $flatMps;
    }

    static glueTranslatedData($norm, $gds)  {
        let $flatMps;

        if (!$norm) {
            return null;
        }
        $flatMps = this.flattenMileagePrograms($norm);
        if ($gds === 'apollo') {
            return 'MP'+php.implode('|', Fp.map(($pax) => {
                let $paxNum;

                $paxNum = !$pax['majorPaxNum'] ? '' :
                    'N'+$pax['majorPaxNum']+(php.empty($pax['minorPaxNum']) ? '' :
                        '-'+$pax['minorPaxNum']);
                return $paxNum+php.implode('', Fp.map(($mp) => {
                    let $withAt, $air;

                    $withAt = $mp['withAllPartners'] || (php.count($mp['partners']) > 0);
                    $air = ($mp['partners'] || {})[0] || $mp['airline'];
                    return '*'+($withAt ? '@' : '')+$air+$mp['code'];
                }, $pax['mileagePrograms']));
            }, $norm['passengers']));
        } else if ($gds === 'sabre') {
            return php.implode('\u00A7', Fp.map(($mp) => {
                let $paxNum, $partnerPart;

                $paxNum = !$mp['majorPaxNum'] ? '' :
                    '-'+$mp['majorPaxNum']+(php.empty($mp['minorPaxNum']) ? '' :
                        '.'+$mp['minorPaxNum']);
                $partnerPart = php.empty($mp['partners']) ? '' : '/'+php.implode(',', $mp['partners']);
                return 'FF'+$mp['airline']+$mp['code']+$partnerPart+$paxNum;
            }, $flatMps));
        } else if ($gds === 'amadeus') {
            return php.implode(';', Fp.map(($mp) => {
                let $paxNum, $partners, $addComa, $partnerPart;

                $paxNum = !$mp['majorPaxNum'] ? '' : '/P'+$mp['majorPaxNum'];
                $partners = $mp['partners'] || [];
                if (!php.empty($partners) && $mp['airline'] && !php.in_array($mp['airline'], $partners)) {
                    php.array_unshift($partners, $mp['airline']);
                }
                $addComa = ($partner) => ',' + $partner;
                $partnerPart = php.implode('', Fp.map($addComa, $partners));
                return 'FFN'+$mp['airline']+'-'+$mp['code']+$partnerPart+$paxNum;
            }, $flatMps));
        } else if ($gds === 'galileo') {
            return php.implode('|', Fp.map(($mp) => {
                let $paxNum, $addSlash, $partnerPart;

                $paxNum = !$mp['majorPaxNum'] ? '' : 'P'+$mp['majorPaxNum']+'/';
                $addSlash = ($partner) => '/' + $partner;
                $partnerPart = php.implode('', Fp.map($addSlash, $mp['partners']));
                return 'M.'+$paxNum+$mp['airline']+$mp['code']+$partnerPart;
            }, $flatMps));
        } else {
            return null;
        }
    }

    /** @param $parsedData = CommandParser::parse()['data'] */
    static translate($parsedData, $fromGds, $toGds)  {
        let $norm;

        $norm = this.normalizeData($parsedData, $fromGds);
        return this.glueTranslatedData($norm, $toGds);
    }
}
module.exports = TranslateAddFrequentFlyerNumber;