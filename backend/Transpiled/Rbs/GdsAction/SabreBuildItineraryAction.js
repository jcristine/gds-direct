
// namespace Rbs\GdsAction;

const DateTime = require('../../Lib/Utils/DateTime.js');
const Fp = require('../../Lib/Utils/Fp.js');
const StringUtil = require('../../Lib/Utils/StringUtil.js');
const AbstractGdsAction = require('./AbstractGdsAction.js');
const php = require('../../php.js');
const AirAvailabilityParser = require('../../Gds/Parsers/Sabre/AirAvailabilityParser.js');

class SabreBuildItineraryAction extends AbstractGdsAction
{
    constructor() {
		super();
		this.$useXml = false;
    }

    useXml($flag)  {

        this.$useXml = $flag;
        return this;
    }

    async executeViaTerminal($itinerary, $isParserFormat)  {
        let $i, $segment, $cmd, $output, $errorType, $tplData;

        $itinerary = Fp.map(($segment) => {
            let $date = $isParserFormat
                ? $segment['departureDate']['raw']
                : this.constructor.formatSabreDate($segment['departureDate']);

            return {...$segment, 'departureDate': $date};
        }, $itinerary);

        for ([$i, $segment] of Object.entries($itinerary)) {
            $cmd = StringUtil.format('0{airline}{flightNumber}{bookingClass}{departureDate}{departureAirport}{destinationAirport}{segmentStatus}{seatCount}', $segment);
            $output = (await this.runCmd($cmd)).output;
            if ($output.match(/UNABLE - SYSTEM ERROR[\s\S]*CONTINUE WITH PNR CREATION/)) {
                $output = (await this.runCmd($cmd)).output;
            }
            if (!this.constructor.isOutputValid($output)) {
                if (this.constructor.isAvailabilityOutput($output)) {
                    $errorType = this.constructor.ERROR_NO_AVAIL;
                } else {
                    $errorType = this.constructor.ERROR_GDS_ERROR;
                }
                $tplData = {
                    'segmentNumber': $i + 1,
                    'from': $segment['departureDate'],
                    'to': $segment['destinationAirport'],
                    'response': php.trim($output),
                };
                return {'success': false, 'errorType': $errorType, 'errorData': $tplData};
            }
        }
        // a workaround for Sabre CONTINUE WITH PNR CREATION auto-claim bug
        // happening on the next command after passive segment sell of some
        // airlines, for example: >0DY7088C20APRLAXARNGK1;
        let pnrDump = await this.runCmd('*R');
        return {'success': true, pnrDump};
    }

    executeViaXml($itinerary, $isParserFormat)  {
        let $startDt, $params, $gtlResult, $funcResult, $errorData;

        $startDt = php.is_callable(this.session.getStartDt) ? this.session.getStartDt() : php.date('Y-m-d');

        $params = {
            'addAirSegments': Fp.map(($seg) => {
                let $departureDt;

                $departureDt = !$isParserFormat ? $seg['departureDate'] :
                    DateTime.decodeRelativeDateInFuture($seg['departureDate']['parsed'], $startDt);
                return {
                    'airline': $seg['airline'],
                    'flightNumber': $seg['flightNumber'],
                    'bookingClass': $seg['bookingClass'],
                    'departureDt': $departureDt,
                    'destinationDt': null, // needed if times specified
                    'departureAirport': $seg['departureAirport'],
                    'destinationAirport': $seg['destinationAirport'],
                    'segmentStatus': $seg['segmentStatus'],
                    'seatCount': $seg['seatCount'],
                };
            }, $itinerary),
        };
        this.log('Xml params: (addAirSegments())', $params);
        $gtlResult = this.getSabre().addAirSegments($params);
        $funcResult = $gtlResult.isOk() ? $gtlResult.unwrap() :
            (($gtlResult.$error.$rpcResult || {})['result']);
        this.log('Xml result: (addSabreAirSegments())', $funcResult);
        if ($gtlResult.isOk()) {
            return {'success': true};
        } else {
            this.log('ERROR: Failed to sell segments via XML: '+$gtlResult.$error.getMessage());
            $errorData = {'response': $gtlResult.$error.getMessage()};
            return {'success': false, 'errorType': this.constructor.ERROR_MULTISEGMENT, 'errorData': $errorData};
        }
    }

    static isOutputValid($output)  {
        let $filter;

        $filter = ['/',
            '\\s*',
            '(?<departureTime>\\d{2,4}[A-Z])',
            '\\s+',
            '(?<destinationTime>\\d{2,4}[A-Z])',
            '.+',
            'SEG\\s*(?<lastSegmentNumber>\\d+)',
            '/'
        ];
        if (php.preg_match(php.implode('', $filter), $output)) {
            return true;
        }
        return false;
    }

    static formatSabreDate($dt)  {

        return php.strtoupper(php.date('dM', php.strtotime($dt)));
    }

    static isAvailabilityOutput($output)  {

        // if there are no seats available, Sabre
        // displays availability instead of error
        return !php.empty(AirAvailabilityParser.parse($output)['flights']);
    }

    /** @param $itinerary = ItineraryParser::parse() */
    async execute($itinerary, $isParserFormat = true)  {

        if (this.$useXml) {
            return this.executeViaXml($itinerary, $isParserFormat);
        } else {
            return this.executeViaTerminal($itinerary, $isParserFormat);
        }
    }
}
SabreBuildItineraryAction.ERROR_GDS_ERROR = 'ERROR_GDS_ERROR';
SabreBuildItineraryAction.ERROR_MULTISEGMENT = 'ERROR_MULTISEGMENT';
SabreBuildItineraryAction.ERROR_NO_AVAIL = 'ERROR_NO_AVAIL';
module.exports = SabreBuildItineraryAction;
