
// namespace Rbs\GdsDirect;

const StringUtil = require('../../Lib/Utils/StringUtil.js');
const php = require('../../phpDeprecated');

/**
 * lists error messages common for all GDS-es
 */
class Errors
{
    static getMapping()  {
        return {
            [Errors.CUSTOM]: {
                'pattern': '{text}',
                'sampleData': {'text': 'Failed to parse pricing command - >$ABASDAD; for PQ validation'},
            },

            [this.CMD_FORBIDDEN]: {
                'pattern': 'FORBIDDEN COMMAND',
                'sampleData': {'cmd': 'Q\/18', 'type': 'openQueue'},
            },
            [this.CANT_CHANGE_TICKETED_PNR]: {
                'pattern': 'Forbidden command, cant delete fields in ticketed PNR',
            },
            [this.CANT_CHANGE_GDSD_REMARK]: {
                'pattern': 'Forbidden command, cant change GDS Direct \"CREATED FOR\" remark on line {lineNum}',
                'sampleData': {'lineNum': '3'},
            },
            [this.NO_RECENT_PRICING]: {
                'pattern': 'PNR changed since last pricing - must price again',
            },
            [this.ITINERARY_IS_EMPTY]: {
                'pattern': 'Itinerary is empty',
            },
            [this.BAD_MOD_BASIS_OVERRIDE]: {
                'pattern': 'Pricing command should not force fare - {modifier} is forbidden',
                'sampleData': {'modifier': /¤Y/},
            },
            [this.BAD_MOD_BOKING_CLASS_OVERRIDE]: {
                'pattern': 'Pricing command should not force booking class - {modifier} is forbidden',
                'sampleData': {'modifier': /.K/},
            },
            [this.BAD_MOD_SEGMENT]: {
                'pattern': 'Pricing command should not have segment select - {modifier} is forbidden',
                'sampleData': {'modifier': /S3+5/},
            },
            [this.BAD_MOD_IGNORE_AVAILABILITY]: {
                'pattern': 'Pricing command should not ignore availability - {modifier} is forbidden',
                'sampleData': {'modifier': '>$BBA/'},
            },
            [this.BAD_MOD_LOW_FARE_CHILD]: {
                'pattern': 'Use {alternative} format when pricing {ageGroupsPlural} (instead of {modifier})',
                'sampleData': {'ageGroupsPlural': 'children', 'modifier': '>$BB', 'alternative': '$B'},
            },
            [this.NO_FLYING_PTC_IN_PRICING]: {
                'pattern': php.implode(' ', [
                    'Your pricing command is missing {article} {ageGroup} modifier (your request contains {ageGroup} passengers)',
                ]),
                'sampleData': {'article': 'an', 'ageGroup': 'infant'},
            },
            [this.MUST_REBOOK]: {
                'pattern': 'Pricing demands you to rebook segments',
            },
            [this.UNSUPPORTED_GDS]: {
                'pattern': 'Unsupported GDS - {gds}',
                'sampleData': {'gds': 'amadeus'},
            },
            [this.GDS_PRICING_ERROR]: {
                'pattern': 'GDS returned pricing error - {response}',
                'sampleData': {'response': 'NO VALID FARE FOR INPUT CRITERIA'},
            },
            [this.FAILED_TO_PARSE_PRICING]: {
                'pattern': 'Failed to parse pricing - {parserError}',
                'sampleData': {'parserError': 'Unexpected token \"\/SPLT8 \/-ROM AA\"'},
            },
            [this.BAD_SEGMENT_STATUS]: {
                'pattern': 'Segment #{segmentNumber} has disallowed status - {segmentStatus}',
                'sampleData': {'segmentNumber': 3, 'segmentStatus': 'NN'},
            },
            [this.INVALID_PNR]: {
                'pattern': 'Not valid pnr - {response}',
                'sampleData': {'response': 'INVLD'},
            },
            [this.NO_NAMES_IN_PNR]: {
                'pattern': 'Please, enter pax names first',
            },
            [this.WRONG_SEAT_COUNT]: {
                'pattern': 'Name count: {nameCount} does not match seat count in a segment: {seatCount}',
                'sampleData': {'seatCount': 3, 'nameCount': 2},
            },
            [this.NO_FREE_AREAS]: {
                'pattern': 'There are no free areas available',
            },
            [this.FAILED_TO_CHANGE_AREA]: {
                'pattern': 'Failed to change to Area {area} - {response}',
                'sampleData': {'area': 'C', 'response': 'RESTRICTED'},
            },
            [this.INVALID_AREA_LETTER]: {
                'pattern': 'Invalid Area letter {area}. It must be one of {options}',
                'sampleData': {'area': 'C', 'options': 'A, B, C, D'},
            },
            [this.ALREADY_IN_THIS_AREA]: {
                'pattern': 'Can not change area to {area} since it is already the area you are in',
                'sampleData': {'area': 'A'},
            },
            [this.PCC_NOT_ALLOWED_BY_GDS]: {
                'pattern': 'There is no access to {pcc} available in {gds}. Please check the entered PCC and try again',
                'sampleData': {'pcc': '6IIF', 'gds': 'apollo'},
            },
            [this.PCC_NOT_ALLOWED_BY_US]: {
                'pattern': 'This PCC is restricted - {pcc}',
                'sampleData': {'pcc': 'SFO1S21D2'},
            },
            [this.CANT_CHANGE_IN_THIS_PCC]: {
                'pattern': 'Changes to this PNR allowed only if you are in {allowedPccs} PCC',
                'sampleData': {'pcc': '1O3K', 'allowedPccs': '2E8R or 2G56'},
            },
            [this.PCC_GDS_ERROR]: {
                'pattern': 'Failed to emulate PCC {pcc} - {response}',
                'sampleData': {'pcc': '1O4K', 'response': 'RESTRICTED ON RAINY DAYS'},
            },
            [this.ALREADY_IN_THIS_PCC]: {
                'pattern': 'Can not change pcc to {pcc} since it is already the pcc you are in',
                'sampleData': {'pcc': 'SFO1S2195'},
            },
            [this.REBUILD_NO_AVAIL]: {
                'pattern': php.implode(' ', [
                    'Itinerary segment #{segmentNumber} {from} {to} could not be taken in selected booking class.',
                    'Please double check the availability, or use GK status instead.',
                ]),
                'sampleData': {'segmentNumber': 3, 'from': 'CDG', 'to': 'LHR'},
            },
            [this.REBUILD_GDS_ERROR]: {
                'pattern': 'Failed to create Itinerary segment #{segmentNumber} {from} {to} - {response}',
                'sampleData': {'segmentNumber': 3, 'from': 'CDG', 'to': 'LHR', 'response': 'CK ACTN CODE'},
            },
            [this.REBUILD_MULTISEGMENT]: {
                'pattern': 'Direct sell failed - {response}',
                'sampleData': {'segmentNumber': 3, 'from': 'CDG', 'to': 'LHR', 'response': 'CK ACTN CODE'},
            },
            [this.REBUILD_FALLBACK_TO_GK]: {
                'pattern': 'SOME FLIGHTS DID NOT HAVE ENOUGH SEATS AVAILABLE IN REQUESTED BOOKING CODE - {segNums}',
                'sampleData': {'segNums': '2,3,5'},
            },
            [this.LEAVE_PNR_CONTEXT]: {
                'pattern': 'Active PNR is present - finish or ignore',
            },
            [this.REBOOK_FAILURE]: {
                'pattern': 'Failed to change booking class in {segNums} segment(s): {output}',
                'sampleData': {'segNums': '2,3,5', 'output': '/$UNABLE TO REPLICATE - PASSIVE SEGMENT'},
            },
            [this.GDSD_LIMIT_EXHAUSTED]: {
                'pattern': 'You exhausted your GDS Direct usage limit for today',
            },
            [this.FS_LIMIT_EXHAUSTED]: {
                'pattern': 'You exhausted your GDS Direct usage limit ({totalAllowed} entries) for 24 hours ({callsUsed} used, earliest: {minDt}Z).',
                'sampleData': {'totalAllowed': 2000, 'callsUsed': 3142, 'minDt': '2018-12-13 20:13:48.012'},
            },
        };
    }

    /**
     * @param string $errorName - on of this class constants
     */
    static getMessage($errorName, $templateData)  {
        let $template;
        if ($template = (this.getMapping()[$errorName] || {})['pattern'] || null) {
            return StringUtil.format($template, $templateData);
        } else {
            throw new Error('Unregistered error constant - '+$errorName+' - '+php.json_encode($templateData));
        }
    }
}

Errors.CUSTOM = 'CUSTOM';

Errors.CMD_FORBIDDEN = 'CMD_FORBIDDEN';
Errors.CANT_CHANGE_TICKETED_PNR = 'CANT_CHANGE_TICKETED_PNR';
Errors.CANT_CHANGE_IN_THIS_PCC = 'CANT_CHANGE_IN_THIS_PCC';
Errors.CANT_CHANGE_GDSD_REMARK = 'CANT_CHANGE_GDSD_REMARK';
Errors.NO_RECENT_PRICING = 'NO_RECENT_PRICING';
Errors.ITINERARY_IS_EMPTY = 'ITINERARY_IS_EMPTY';
Errors.BAD_MOD_BASIS_OVERRIDE = 'BAD_MOD_BASIS_OVERRIDE';
Errors.BAD_MOD_BOKING_CLASS_OVERRIDE = 'BAD_MOD_BOKING_CLASS_OVERRIDE';
Errors.BAD_MOD_SEGMENT = 'BAD_MOD_SEGMENT';
Errors.BAD_MOD_IGNORE_AVAILABILITY = 'BAD_MOD_IGNORE_AVAILABILITY';
Errors.BAD_MOD_LOW_FARE_CHILD = 'BAD_MOD_LOW_FARE_CHILD';
Errors.NO_FLYING_PTC_IN_PRICING = 'NO_FLYING_PTC_IN_PRICING';
Errors.MUST_REBOOK = 'MUST_REBOOK';
Errors.UNSUPPORTED_GDS = 'UNSUPPORTED_GDS';
Errors.GDS_PRICING_ERROR = 'GDS_PRICING_ERROR';
Errors.FAILED_TO_PARSE_PRICING = 'FAILED_TO_PARSE_PRICING';
Errors.BAD_SEGMENT_STATUS = 'BAD_SEGMENT_STATUS';
Errors.INVALID_PNR = 'INVALID_PNR';
Errors.NO_NAMES_IN_PNR = 'NO_NAMES_IN_PNR';
Errors.WRONG_SEAT_COUNT = 'WRONG_SEAT_COUNT';
Errors.LEAVE_PNR_CONTEXT = 'LEAVE_PNR_CONTEXT';
Errors.NO_FREE_AREAS = 'NO_FREE_AREAS';
Errors.FAILED_TO_CHANGE_AREA = 'FAILED_TO_CHANGE_AREA';
Errors.INVALID_AREA_LETTER = 'INVALID_AREA_LETTER';
Errors.ALREADY_IN_THIS_AREA = 'ALREADY_IN_THIS_AREA';
Errors.PCC_NOT_ALLOWED_BY_GDS = 'PCC_NOT_ALLOWED_BY_GDS';
Errors.PCC_NOT_ALLOWED_BY_US = 'PCC_NOT_ALLOWED_BY_US';
Errors.PCC_GDS_ERROR = 'PCC_GDS_ERROR';
Errors.ALREADY_IN_THIS_PCC = 'ALREADY_IN_THIS_PCC';
Errors.REBUILD_NO_AVAIL = 'REBUILD_NO_AVAIL';
Errors.REBUILD_GDS_ERROR = 'REBUILD_GDS_ERROR';
Errors.REBUILD_MULTISEGMENT = 'REBUILD_MULTISEGMENT';
Errors.REBUILD_FALLBACK_TO_GK = 'REBUILD_FALLBACK_TO_GK';
Errors.REBOOK_FAILURE = 'REBUILD_FAILURE';
Errors.GDSD_LIMIT_EXHAUSTED = 'GDSD_LIMIT_EXHAUSTED';
Errors.FS_LIMIT_EXHAUSTED = 'FS_LIMIT_EXHAUSTED';

module.exports = Errors;
