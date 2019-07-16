
// namespace Gds\Parsers\Amadeus\ReservationParser;

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');

// '  30 FP PAX CCVI43*********32706/1219/A419872/S3-6/P1-2'
// '   9 FP PAX O/CA/S2
// '   9 FP O/CA/S2
// '   8 FP CA
// '  13 FP O/NR+/CA' // new - CASH, old - NONREF
// '   9 FP NONREF
// '   9 FP CASH
// '   9 FP CHECK
// '  22 FP PAX NR+CASH/INR2744/S3/P1
// '  23 FP PAX NR+CASH/INR2744/S3/P2
// If star in beginning then it is free text - *
// Old data marked with: O/
// New separated from Old with +/
// Two records separated with +

const php = require('../../../../phpDeprecated.js');
class FopLineParser
{
    static getFormOfPayment($methodStr)  {

        if (php.in_array($methodStr, ['NR', 'NONREF'])) {
            return this.TYPE_NO_REF;
        } else if (php.in_array($methodStr, ['CA', 'CASH', 'CK', 'CHECK'])) {
            return this.TYPE_CASH;
        } else if (StringUtil.startsWith($methodStr, 'CC')) {
            return this.TYPE_CC;
        } else {
            return this.TYPE_UNPARSED;
        }
    }

    //CCCAXXXXXXXXXXXX8406/0319/A01456Z
    //CCCA5111111111111111
    static parseCcData($ccLine)  {
        let $filter, $matches, $return;

        $filter = new RegExp([
            /CC(?<ccType>[A-Z]{2})/,
            /(?<ccNumber>[\d*X]{15,16})/,
            /(\/(?<date>\d{4}))?/,
            /(\/(?<code>[A-Z\d]+))?/
        ].map(sr => sr.source).join(''));

        if (php.preg_match($filter, $ccLine, $matches = {})) {
            $return = {
                'ccType': $matches['ccType'],
                'ccNumber': $matches['ccNumber'],
            };
            if ($matches['date']) {
                $return['expirationDate'] = {
                    'parsed': this.decodeExpirationDate($matches['date']),
                    'raw': $matches['date'],
                };
            }
            if (!php.empty($matches['code'])) {
                $return['approvalCode'] = $matches['code'];
            }
            return $return;
        } else {
            return null;
        }
    }

    static decodeExpirationDate($str)  {
        let $month, $shortYear;

        $month = php.substr($str, 0, 2);
        $shortYear = php.substr($str, 2);
        return '20'+$shortYear+'-'+$month;
    }

    // 2-4 => 2,3,4
    static makeNumberList($diapasonStr)  {
        let $numbers, $matches, $start, $end, $i;

        $numbers = [];
        if (php.preg_match('/(?<start>\\d+)-?(?<end>\\d*)/', $diapasonStr, $matches = [])) {
            $start = $matches['start'];
            $end = !php.empty($matches['end']) ? $matches['end'] : $start;
            for ($i = $start; $i <= $end; $i++) {
                $numbers.push($i);
            }
        }
        return $numbers;
    }

    static parseDataStr($lineDataStr, $pax)  {
        let $parsedData, $oldNewData, $paymentStr, $isOld, $method, $form, $data;

        $parsedData = [];
        $lineDataStr = php.str_replace(php.PHP_EOL, '', $lineDataStr);
        $oldNewData = php.explode('+/', $lineDataStr);
        for ($paymentStr of Object.values($oldNewData)) {
            $isOld = false;
            if (StringUtil.startsWith($paymentStr, 'O/')) {
                $isOld = true;
                $paymentStr = php.substr($paymentStr,2);
            }
            for ($method of Object.values(php.explode('+', $paymentStr))) {
                if (!php.empty(php.trim($method))) {
                    $form = this.getFormOfPayment($method);
                    $data = $form == this.TYPE_CC
                        ? $data = this.parseCcData($method)
                        : null;

                    $data = $data || {raw: $method};
                    $data['isOld'] = $isOld;
                    $data['isForInf'] = ($pax == 'INF');
                    $data['formOfPayment'] = $form;
                    $parsedData.push($data);
                }}}
        return $parsedData;
    }

    // '  30 FP PAX CCVI43*********32706/1219/A419872/S3-6/P1-2'
    static parse($line)  {
        let $matches, $_, $lineNumber, $pax, $dataStr;

        $line = php.str_replace("\n", '', $line);

        if (php.preg_match('/^\\s*(\\d+)\\sFP\\s+([A-Z]{3}\\s|)\\s*(.+?)$/s', $line, $matches = [])) {
            [$_, $lineNumber, $pax, $dataStr] = $matches;
            return {
                'lineNumber': $lineNumber,
                'data': this.parseDataStr($dataStr, $pax),
            };
        } else {
            return null;
        }
    }

}
FopLineParser.TYPE_CASH = 'cash';
FopLineParser.TYPE_UNPARSED = 'unParsed';
FopLineParser.TYPE_NO_REF = 'noReference';
FopLineParser.TYPE_CC = 'creditCard';
module.exports = FopLineParser;