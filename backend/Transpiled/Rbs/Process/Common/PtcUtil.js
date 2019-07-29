const Rej = require('klesun-node-tools/src/Rej.js');


let php = require('klesun-node-tools/src/Transpiled/php.js');

const CHILD_MAX_AGE = 11;

/** provides functions to parse/make/modify PTC */
const PtcUtil = ({
    PtcFareFamilies = require('../../../../Repositories/PtcFareFamilies.js'),
}) => {
    const getFareType = async (ptc) => {
        let families = await PtcFareFamilies.getAll();
        for (let family of families) {
            let matches;
            if (php.preg_match(/^([A-Z])(\d{2})$/, ptc, matches = [])) {
                let [$_, $letter, $age] = matches;
                if ($letter === family.childLetter) {
                    return family.name;
                }
            } else {
                for (let [ageGroup, groupPtc] of Object.entries(family.groups)) {
                    if (groupPtc === ptc) {
                        return family.name;
                    }
                }
            }
        }
        return null;
    };

    /**
     * @see PTYP+TXT in https://developer.travelport.com/euf/assets/developer-network/downloads/ReferenceData.zip
     * this function decodes PTC-s very approximately+ Age group for
     * ambiguous PTC-s like seniors, patients, students etc..+ will be 'adult'
     */
    const parsePtc = ($ptc) => {
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
            if (php.intval($age) <= CHILD_MAX_AGE) {
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
    };

    /**
     * converts $adultPtc to the age group of $nameRecord
     * JCB + child = JNN
     * ITX + infant = ITF
     * ...
     * @param $nameRecord = GdsPassengerBlockParser::flattenPassengers()[0]
     */
    const convertPtcAgeGroup = async ($adultPtc, $nameRecord, $tripEndDt = null) => {
        let ageGroup = getPaxAgeGroup($nameRecord, $tripEndDt);
        let age = !php.empty($nameRecord['age'])
            ? php.str_pad($nameRecord['age'], 2, '0', php.STR_PAD_LEFT)
            : null;
        if ($nameRecord['ptc'] === 'YTH') {
            return $adultPtc === 'ADT' ? 'YTH' : $adultPtc;
        } else if (ageGroup === 'adult') {
            return $adultPtc;
        }
        let fareFamily = await PtcFareFamilies.getByAdultPtc($adultPtc);
        if ($nameRecord['ptc'] === 'INS') {
            let ptc = fareFamily.groups.infantWithSeat;
            return ptc ? ptc : Rej.NotImplemented(
                'No infant with a seat PTC matching ' + $adultPtc);
        } else {
            return convertPtcByAgeGroup($adultPtc, ageGroup, age);
        }
    };

    const convertPtcByAgeGroup = async ($adultPtc, $ageGroup, $age = null) => {
        let $pricingPtc, $letter;
        if ($ageGroup === 'adult') {
            return $adultPtc;
        }
        let fareFamily = await PtcFareFamilies.getByAdultPtc($adultPtc);
        if ($ageGroup === 'child') {
            if ($letter = fareFamily.childLetter) {
                let age = !$age ? 'NN' : ('0' + $age).slice(-2);
                $pricingPtc = $letter + age;
            } else if (fareFamily.groups.child) {
                $pricingPtc = fareFamily.groups.child;
            } else {
                return Rej.NotImplemented('No child PTC matching ' + $adultPtc);
            }
        } else if ($ageGroup === 'infant') {
            if (!($pricingPtc = fareFamily.groups.infant)) {
                return Rej.NotImplemented('No infant PTC matching ' + $adultPtc);
            }
        } else {
            return Rej.NotImplemented('Unsupported age group - ' + $ageGroup);
        }
        return $pricingPtc;
    };

    const _getFullYearsBetween = (tripEndDt, dateOfBirth) => {
        let dobObj = new Date(dateOfBirth);
        let baseDtObj = new Date(tripEndDt);
        let ageDifMs = baseDtObj.getTime() - dobObj.getTime();
        let ageDate = new Date(ageDifMs); // milliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const getPaxAgeGroup = ($nameRecord, $tripEndDt = null) => {
        let $age, $dob, $ptc;
        if ($nameRecord['nameNumber']['isInfant']) {
            return 'infant';
        } else if ($age = $nameRecord['age'] || null) {
            return php.intval($age) <= CHILD_MAX_AGE ? 'child' : 'adult';
        } else if ($tripEndDt && ($dob = ($nameRecord['dob'] || {})['parsed'])) {
            $age = _getFullYearsBetween($tripEndDt, $dob);
            return php.intval($age) <= CHILD_MAX_AGE ? 'child' : 'adult';
        } else if ($ptc = $nameRecord['ptc'] || null) {
            return parsePtc($ptc)['ageGroup'];
        } else {
            return 'adult';
        }
    };

    return {
        getFareType,
        parsePtc,
        convertPtcAgeGroup,
        convertPtcByAgeGroup,
        getPaxAgeGroup,
    };
};

const defaultInst = PtcUtil({});

defaultInst.makeCustom = params => PtcUtil(params);

module.exports = defaultInst;
