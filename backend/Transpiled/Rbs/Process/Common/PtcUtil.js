
// namespace Rbs\Process\Common;

let php = require('../../../php.js');

/** provides functions to parse/make/modify PTC */
class PtcUtil
{
    static getFareTypeMapping()  {
        return {
            'regular': {
                'childLetter': 'C',
                'groups': {
                    'adult': 'ADT', 'infant': 'INF',
                    'child': 'CNN', 'infantWithSeat': 'INS',
                },
            },
            'inclusiveTour': {
                'childLetter': 'I',
                'groups': {
                    'adult': 'ITX', 'infant': 'ITF',
                    'child': 'INN', 'infantWithSeat': 'ITS',

                },
            },
            'contractBulk': {
                'childLetter': 'J',
                'groups': {
                    'adult': 'JCB', 'infant': 'JNF',
                    'child': 'JNN', 'infantWithSeat': 'JNS',
                },
            },
            'missionary': {
                'childLetter': null,
                'groups': {
                    'adult': 'MIS', 'infant': 'MIF',
                    'child': 'MIC', 'infantWithSeat': 'MSS',
                },
            },
            'blended': {
                'childLetter': null,
                'groups': {
                    'adult': 'JWZ', 'infant': 'INF',
                    'child': 'JWB', 'infantWithSeat': 'INS',
                },
            },
        };
    }

    static getFareType($ptc)  {
        let $fareType, $data, $matches, $_, $letter, $age, $ageGroup, $groupPtc;
        for ([$fareType, $data] of Object.entries(this.getFareTypeMapping())) {
            if (php.preg_match(/^([A-Z])(\d{2})$/, $ptc, $matches = [])) {
                [$_, $letter, $age] = $matches;
                if ($letter === $data['childLetter']) {
                    return $fareType;
                }
            } else {
                for ([$ageGroup, $groupPtc] of Object.entries($data['groups'])) {
                    if ($groupPtc === $ptc) {
                        return $fareType;
                    }
                }
            }
        }
        return null;
    }

    static getAdultFarePtc($fareType)  {
        let $mapping;
        $mapping = this.getFareTypeMapping();
        return $mapping[$fareType]['groups']['adult'] || null;
    }

    /**
     * @see PTYP+TXT in https://developer.travelport.com/euf/assets/developer-network/downloads/ReferenceData.zip
     * this function decodes PTC-s very approximately+ Age group for
     * ambiguous PTC-s like seniors, patients, students etc..+ will be 'adult'
     */
    static parsePtc($ptc)  {
        let $infantPtcs, $childPtcs, $adultPtcs, $ageGroup, $matches, $age;
        if (!$ptc) {
            return {'ageGroup': null};
        }
        $infantPtcs = [
            'INF', 'INS', 'JNF', 'JNS', /* rare -> */
            'FBI', 'LIF', 'LNS', 'API', 'APS', 'CNF', 'ENF', 'ENS', 'FGI',
            'FIP', 'FIS', 'FNF', 'FSP', 'GIF', 'GIS', 'GRI', 'GRS', 'ICF', 'INR', 'INX', 'INY', 'ISR', 'MEI', 'MIF',
            'MNF', 'MNS', 'MSS', 'NBI', 'NBS', 'PEI', 'PES', 'SNF', 'SNS', 'TIF', 'TNF', 'VFF', 'WBI', 'ZEI', 'ZUI',
            'ITS', 'ITF',
        ];
        $childPtcs = [
            'CNN', 'JNN', 'CHD', /* rare -> */
            'APC', 'CCA', 'CHR', 'CSB', 'CVN', 'DCD', 'DNN', 'ECH', 'EMN', 'ENN',
            'FBC', 'FCP', 'FCU', 'FGC', 'FHC', 'FNN', 'FNP', 'GNN', 'ICN', 'INN', 'LNN', 'LUN', 'MDP', 'MEC', 'MIC',
            'MNN', 'NBC', 'NBU', 'PEC', 'PNN', 'SAC', 'SUC', 'TIN', 'TNN', 'UNN', 'UNR', 'VFN', 'VNN', 'WBC', 'WNN',
            'XNN', 'YNN', 'ZCO', 'ZCU', 'ZEC', 'ZNN', 'JWB',
        ];
        $adultPtcs = [
            'ADT', 'JCB', /* rare -> */
            'ADD', 'ADR', 'APA', 'BNN', 'CMA', 'CMR', 'EDT', 'FBA', 'FGA', 'FHA', 'GLR',
            'NBA', 'PCR', 'PEA', 'VAC', 'VAG', 'ZEA', 'ZMA', 'ZPA', 'ZSA', 'ZWA', 'JWZ',
        ];
        if (php.in_array($ptc, $infantPtcs)) {
            $ageGroup = 'infant';
        } else if (php.in_array($ptc, $childPtcs)) {
            $ageGroup = 'child';
        } else if (php.preg_match(/^[A-Z](\d{1,2})$/, $ptc, $matches = [])) {
            $age = $matches[1];
            if (php.intval($age) <= this.CHILD_MAX_AGE) {
                $ageGroup = 'child';
            } else {
                $ageGroup = 'adult';
            }
        } else if (php.in_array($ptc, $adultPtcs)) {
            $ageGroup = 'adult';
        } else {
            // very rare PTC-s for military, staff, government...
            $ageGroup = 'adult';
        }
        return {
            'ageGroup': $ageGroup,
        };
    }

    /**
     * converts $adultPtc to the age group of $nameRecord
     * JCB + child = JNN
     * ITX + infant = ITF
     * ...
     * @param $nameRecord = GdsPassengerBlockParser::flattenPassengers()[0]
     */
    static convertPtcAgeGroup($adultPtc, $nameRecord, $tripEndDt)  {
        let $ageGroup, $age, $seatedInfantPtcs, $pricingPtc, $ageLetters, $letter, $infantPtcs;
        $ageGroup = PtcUtil.getPaxAgeGroup($nameRecord, $tripEndDt);
        $age = !php.empty($nameRecord['age'])
            ? php.str_pad($nameRecord['age'], 2, '0', php.STR_PAD_LEFT)
            : null;
        if ($nameRecord['ptc'] === 'INS') {
            // infant with a seat
            $seatedInfantPtcs = {
                'ADT': 'INS', 'JCB': 'JNS',
                'ITX': 'ITS', 'MIS': 'MSS',
            };
            if (!($pricingPtc = $seatedInfantPtcs[$adultPtc] || null)) {
                return {'error': 'No infant with a seat PTC matching '+$adultPtc};
            }
        } else if ($nameRecord['ptc'] === 'YTH') {
            $pricingPtc = $adultPtc === 'ADT' ? 'YTH' : $adultPtc;
        } else if ($ageGroup === 'adult') {
            $pricingPtc = $adultPtc;
        } else if ($ageGroup === 'child') {
            $ageLetters = {'ADT': 'C', 'JCB': 'J', 'ITX': 'I'};
            if ($letter = $ageLetters[$adultPtc] || null) {
                $pricingPtc = $letter+($age || 'NN');
            } else if ($adultPtc === 'MIS') {
                $pricingPtc = 'MIC';
            } else {
                return {'error': 'No child PTC matching '+$adultPtc};
            }
        } else if ($ageGroup === 'infant') {
            $infantPtcs = {
                'ADT': 'INF', 'JCB': 'JNF',
                'ITX': 'ITF', 'MIS': 'MIF',
            };
            if (!($pricingPtc = $infantPtcs[$adultPtc] || null)) {
                return {'error': 'No infant PTC matching '+$adultPtc};
            }
        } else {
            return {'error': 'Unsupported age group - '+$ageGroup};
        }
        return {'ptc': $pricingPtc};
    }

    /** @param $nameRecord = GdsPassengerBlockParser::flattenPassengers()[0] */
    static getPaxAgeGroup($nameRecord, $tripEndDt)  {
        let $age, $dob, $ptc;
        if ($nameRecord['nameNumber']['isInfant']) {
            return 'infant';
        } else if ($age = $nameRecord['age'] || null) {
            return php.intval($age) <= this.CHILD_MAX_AGE ? 'child' : 'adult';
        } else if ($tripEndDt && ($dob = ($nameRecord['dob'] || {})['parsed'])) {
            $age = (new require('../../../DateTime.js')($tripEndDt)).diff(new require('../../../DateTime.js')($dob)).$y;
            return php.intval($age) <= this.CHILD_MAX_AGE ? 'child' : 'adult';
        } else if ($ptc = $nameRecord['ptc'] || null) {
            return this.parsePtc($ptc)['ageGroup'];
        } else {
            return 'adult';
        }
    }
}

PtcUtil.CHILD_MAX_AGE = 11;

module.exports = PtcUtil;
