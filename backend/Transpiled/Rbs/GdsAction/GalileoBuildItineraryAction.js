
// namespace Rbs\GdsAction;

const Fp = require('../../Lib/Utils/Fp.js');
const StringUtil = require('../../Lib/Utils/StringUtil.js');
const ItineraryParser = require('../../Gds/Parsers/Galileo/Pnr/ItineraryParser.js');
const AbstractGdsAction = require('./AbstractGdsAction.js');

/**
 * takes itinerary data and adds it to current PNR by
 * performing a direct sell command of each segment
 * >0AC 215V 24MAR YYCYVR NN1;
 */
const php = require('../../php.js');
class GalileoBuildItineraryAction extends AbstractGdsAction
{
    constructor() {
    	super();
		this.$allCommands = [];
	}

    fetchAndStore($cmd)  {
        let $output;

        $output = this.galileo($cmd);
        this.$allCommands.push({'cmd': $cmd, 'output': $output});
        return $output;
    }

    getCalledCommands()  {

        return this.$allCommands;
    }

    static formatGdsDate($dt)  {

        return php.strtoupper(php.date('dM', php.strtotime($dt)));
    }

    static isAvailabilityOutput($output)  {
        let $clean;

        $clean = php.preg_replace(/><$/, '', $output);
        return php.trim($clean) === '*0 AVAIL\/WL CLOSED*';
    }

    // '    EK  214 C  29JUL FLLDXB HS1   910P # 740P O       E         DEPARTS FLL TERMINAL 3  - ARRIVES DXB TERMINAL 3                *COMPLIMENTARY CHAUFFEUR DRIVE - SEE EK PAGES IN YOUR GDS*',
    // '*ADD PASSPORT DETAILS IN SSR DOCS AND CONTACT IN SSR CTCM *',
    // '*ADD NEXT OF KIN CONTACT IN SSR PCTC*',
    // 'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS  ',
    // 'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
    // 'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
    // 'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
    // 'OFFER CAR/HOTEL      >CAL;       >HOA; ',
    // '><',
    // ' 5. EK  213 K  23AUG DXBFLL HS1   210A   959A O       E      1  DEPARTS DXB TERMINAL 3  - ARRIVES FLL TERMINAL 4                *ADD PASSPORT DETAILS IN SSR DOCS AND CONTACT IN SSR CTCM *',
    // '*ADD NEXT OF KIN CONTACT IN SSR PCTC*',
    // 'ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS  ',
    // 'PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION',
    // 'WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES',
    // 'FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES',
    // 'OFFER CAR/HOTEL      >CAL;       >HOA; ',
    // '><',
    static parseItinerary($output)  {
        let $wrapped, $parsed;

        $output = php.preg_replace(/^    /, ' 0. ', $output);
        $wrapped = StringUtil.wrapLinesAt($output, 64);
        $parsed = ItineraryParser.parse($wrapped);
        return $parsed['parsedData'] || [];
    }

    execute($itinerary, $isParserFormat)  {
        let $resultItinerary, $i, $segment, $pattern, $cmd, $output, $segments, $errorType, $tplData;

        $itinerary = Fp.map(($segment) => {
            let $date, $seatCount;

            $date = $isParserFormat
                ? $segment['departureDate']['raw']
                : this.constructor.formatGdsDate($segment['departureDate']);
            $seatCount = $isParserFormat ? $segment['statusNumber'] : $segment['seatCount'];

            return {
                'airline': $segment['airline'],
                'flightNumber': $segment['flightNumber'],
                'bookingClass': $segment['bookingClass'],
                'departureDate': $date,
                'departureAirport': $segment['departureAirport'],
                'destinationAirport': $segment['destinationAirport'],
                'segmentStatus': $segment['segmentStatus'],
                'seatCount': $seatCount,
            };
        }, $itinerary);

        $resultItinerary = [];
        for ([$i, $segment] of Object.entries($itinerary)) {
            $pattern = '0{airline}{flightNumber}{bookingClass}{departureDate}{departureAirport}{destinationAirport}{segmentStatus}{seatCount}';
            $cmd = StringUtil.format($pattern, $segment);
            $output = this.fetchAndStore($cmd);
            if (php.empty($segments = this.constructor.parseItinerary($output))) {
                if (this.constructor.isAvailabilityOutput($output)) {
                    $errorType = this.constructor.ERROR_NO_AVAIL;
                } else {
                    $errorType = this.constructor.ERROR_GDS_ERROR;
                }
                $tplData = {
                    'segmentNumber': $i + 1,
                    'from': $segment['departureAirport'],
                    'to': $segment['destinationAirport'],
                    'response': php.trim($output),
                };
                return {'success': false, 'errorType': $errorType, 'errorData': $tplData};
            }
            $resultItinerary = php.array_merge($resultItinerary, $segments);}
        return {'success': true, 'itinerary': $resultItinerary};
    }
}
GalileoBuildItineraryAction.ERROR_GDS_ERROR = 'ERROR_GDS_ERROR';
GalileoBuildItineraryAction.ERROR_NO_AVAIL = 'ERROR_NO_AVAIL';
module.exports = GalileoBuildItineraryAction;
