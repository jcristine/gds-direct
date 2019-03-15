
// namespace Rbs\Process\Common\ImportPnr;

let php = require('../../../../php');
let ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');

/**
 * this action unites the Apollo and Sabre PNR import processes
 */
class ImportPnrAction
{
    static areSegmentsCompatible($rSeg, $svcSeg)  {

        return $rSeg
            && $rSeg['airline'] === $svcSeg['airline']
            && php.intval($rSeg['flightNumber']) === php.intval($svcSeg['flightNumber'])
            && $rSeg['departureAirport'] === ArrayUtil.getFirst($svcSeg['legs'])['departureAirport']
            && $rSeg['destinationAirport'] === ArrayUtil.getLast($svcSeg['legs'])['destinationAirport'];
    }

    static setSvcSegmentTimes($rSeg, $svcLegs)  {
        let $firstSegIndex, $lastSegIndex, $i, $result, $leg;

        $firstSegIndex = 0;
        $lastSegIndex = php.count($svcLegs) - 1;
        $i = 0;
        $result = [];
        for ($leg of Object.values($svcLegs)) {
            $leg['segmentDepartureDt'] = ($i === $firstSegIndex) ? $rSeg['departureDt'] : $leg['departureDt'];
            $leg['segmentDestinationDt'] = ($i === $lastSegIndex) ? $rSeg['destinationDt'] : $leg['destinationDt'];
            $result.push($leg);
            ++$i;
        }
        return $result;
    }

    static combineItineraryAndSvc($rSegments, $svcSegments)  {
        let $result, $segNumToSvc, $rSeg, $segNum, $svcSeg, $error;

        $result = [];

        $segNumToSvc = php.array_combine(php.array_column(
            $svcSegments, 'segmentNumber'),
            $svcSegments);

        for ($rSeg of Object.values($rSegments)) {
            $segNum = $rSeg['segmentNumber'];
            $svcSeg = $segNumToSvc[$segNum];
            if ($svcSeg) {
                $rSeg['flightServiceInfo'] = {};
                if (this.areSegmentsCompatible($rSeg, $svcSeg)) {
                    $rSeg['flightServiceInfo']['legs'] = this.setSvcSegmentTimes($rSeg, $svcSeg['legs'] || []);
                } else {
                    $error = 'Reservation segment #'+$segNum+' does not match flight service segment';
                    $rSeg['flightServiceInfo']['error'] = $error;
                }
            }
            $result.push($rSeg);
        }

        return $result;
    }

    static detectOpenPnrStatus($gds, $dump)  {
        let $status;
        if ($gds == 'apollo') {
            if (require('../../../../Rbs/TravelDs/ApolloPnr.js').checkDumpIsNotExisting($dump)) {
                $status = 'notExisting';
            } else if (require('../../../../Rbs/TravelDs/ApolloPnr.js').checkDumpIsRestricted($dump)) {
                $status = 'isRestricted';
            } else if (php.preg_match(/^\s*FIN OR IGN\s*(><)?\s*$/, $dump)) {
                $status = 'finishOrIgnore';
            } else if (php.preg_match(/^\s*\S[^\n]*\s*(><)?\s*$/, $dump)) {
                // any single line is treated as error
                $status = 'customError';
            } else {
                // there are many ways for agent to open a PNR and tweak
                // output, so matching anything that is not an error is safer
                $status = 'available';
            }
        } else if ($gds === 'sabre') {
            if (require('../../../../Rbs/TravelDs/SabrePnr.js').checkDumpIsNotExisting($dump)) {
                $status = 'notExisting';
            } else if (require('../../../../Rbs/TravelDs/SabrePnr.js').checkDumpIsRestricted($dump)) {
                $status = 'isRestricted';
            } else if (php.trim($dump) === '¥FIN OR IG¥') {
                $status = 'finishOrIgnore';
            } else if (php.preg_match(/^\s*¥.+¥\s*$/, php.trim($dump))) {
                $status = 'customError';
            } else {
                $status = 'available';
            }
        } else {
            throw new Error('Unsupported GDS - '+$gds);
        }
        return $status;
    }
}
module.exports = ImportPnrAction;
