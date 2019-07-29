

const php = require('../../../phpDeprecated.js');
class SabreVerifyParsedStructureWriter
{
    constructor()  {
		this.$segments = [];
		this.$currentSegment = null;
		this.$currentLeg = null;
    }

    flushLeg()  {

        if (this.$currentLeg) {
			this.$currentSegment['legs'] = this.$currentSegment['legs'] || [];
            this.$currentSegment['legs'].push(this.$currentLeg);
            this.$currentLeg = null;
        }
    }

    flushSegment($initialData)  {

        this.flushLeg();
        if (this.$currentSegment) {
            this.$segments.push(this.$currentSegment);
        }
        this.$currentSegment = $initialData;
    }

    /** @param $data = SabreVerifyParser::parseSegmentLine() */
    legFound($data)  {
        let $segmentData;

        if ($data['segmentNumber']) {
            [$segmentData, $data] = this.constructor.extractSegmentData($data);
            this.flushSegment($segmentData);
            this.$currentLeg = $data;
        } else {
            this.flushLeg();
            this.$currentLeg = $data;
        }
        this.$currentLeg['departureTerminal'] = null;
        this.$currentLeg['destinationTerminal'] = null;
    }

    terminalsFound($data)  {

        this.$currentLeg['departureTerminal'] = $data['departureTerminal'];
        this.$currentLeg['destinationTerminal'] = $data['destinationTerminal'];
    }

    getData()  {

        this.flushSegment();
        return {
            'segments': this.$segments,
        };
    }

    static extractSegmentData($fistLeg)  {
        let $segment;

        $segment = {
            'segmentNumber': $fistLeg['segmentNumber'],
            'airline': $fistLeg['airline'],
            'flightNumber': $fistLeg['flightNumber'],
        };
        $fistLeg = php.array_diff_key($fistLeg, $segment);

        return [$segment, $fistLeg];
    }
}
module.exports = SabreVerifyParsedStructureWriter;
