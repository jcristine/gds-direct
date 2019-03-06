

// namespace Rbs\GdsDirect\Actions\Common;


const Fp = require('../../../../../../../backend/Transpiled/Lib/Utils/Fp.js');
const MakeMultiPccTariffDumpAction = require("../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Common/MakeMultiPccTariffDumpAction");

let php = require('../../../../../../../backend/Transpiled/php.js');

class MakeMultiPccTariffDumpActionTest extends require('../../../../../../../backend/Transpiled/Lib/TestCase.js')
{
    static makeTableRows($valuesPerRow)  {
        let $keys, $rows, $values;
        if (php.empty($valuesPerRow)) {
            return [];
        } else {
            $keys = php.array_shift($valuesPerRow);
            $rows = [];
            for ($values of Object.values($valuesPerRow)) {
                if (php.count($keys) === php.count($values)) {
                    $rows.push(php.array_combine($keys, $values));
                } else {
                    throw new Error('Row value count mismatch: '+php.count($keys)+' vs '+php.count($values)+' '+
                        php.PHP_EOL+php.implode(', ', $keys)+php.PHP_EOL+php.implode(', ', Fp.map('json_encode', $values)));
                }}
            return $rows;
        }
    }

    provideMakeTariffDisplayDumpFromJobsTestCases()  {
        let $list;
        $list = [];
        $list.push([
            [
                {
                    'pcc': '2G2H',
                    'gds': 'apollo',
                    'jobResult': {
                        'response_code': 1,
                        'result': {
                            'currency': 'USD',
                            'fares': [
                                {'lineNumber': 1,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'UA','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 2,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'LH','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 3,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'SN','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 4,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'OS','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 5,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'LX','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 6,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'AC','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                            ],
                        },
                    },
                },
                {
                    'pcc': '15JE',
                    'gds': 'apollo',
                    'jobResult': {
                        'response_code': 1,
                        'result': {
                            'currency': 'USD',
                            'fares': [
                                {'lineNumber': 1,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'UA','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 2,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'LH','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 3,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'SN','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 4,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'OS','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 5,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'LX','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 6,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'AC','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                            ],
                        },
                    },
                },
                {
                    'pcc': '2G52',
                    'gds': 'apollo',
                    'jobResult': {
                        'response_code': 1,
                        'result': {
                            'currency': 'USD',
                            'fares': [
                                {'lineNumber': 1,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'KL','fare': '88.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'VL7B1RM2','bookingClass': 'V','advancePurchase': 0,'ticketDesignator': null},
                                {'lineNumber': 2,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'DL','fare': '88.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'VL7B1RM2','bookingClass': 'V','advancePurchase': 0,'ticketDesignator': null},
                                {'lineNumber': 3,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'AZ','fare': '88.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'OL7B1RM2','bookingClass': 'O','advancePurchase': 0,'ticketDesignator': null},
                                {'lineNumber': 4,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'AZ','fare': '88.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'OL7B1RM2','bookingClass': 'O','advancePurchase': 0,'ticketDesignator': null},
                                {'lineNumber': 5,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'AF','fare': '88.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'VL7B1RM2','bookingClass': 'V','advancePurchase': 0,'ticketDesignator': null},
                                {'lineNumber': 6,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'AC','fare': '92.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 7,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'KL','fare': '93.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'VL7B1RM2','bookingClass': 'V','advancePurchase': 0,'ticketDesignator': null},
                                {'lineNumber': 8,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'DL','fare': '93.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'VL7B1RM2','bookingClass': 'V','advancePurchase': 0,'ticketDesignator': null},
                                {'lineNumber': 9,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'AZ','fare': '93.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'OL7B1RM2','bookingClass': 'O','advancePurchase': 0,'ticketDesignator': null},
                                {'lineNumber': 10,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'AZ','fare': '93.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'OL7B1RM2','bookingClass': 'O','advancePurchase': 0,'ticketDesignator': null},
                                {'lineNumber': 11,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'AF','fare': '93.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'VL7B1RM2','bookingClass': 'V','advancePurchase': 0,'ticketDesignator': null},
                            ],
                        },
                    },
                },
                {
                    'pcc': '2F9B',
                    'gds': 'apollo',
                    'jobResult': {
                        'response_code': 1,
                        'result': {
                            'currency': 'USD',
                            'fares': [
                                {'lineNumber': 1,'fareType': 'public','isRoundTrip': true,'airline': 'UA','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 2,'fareType': 'public','isRoundTrip': true,'airline': 'LH','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 3,'fareType': 'public','isRoundTrip': true,'airline': 'SN','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 4,'fareType': 'public','isRoundTrip': true,'airline': 'OS','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 5,'fareType': 'public','isRoundTrip': true,'airline': 'LX','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 6,'fareType': 'public','isRoundTrip': true,'airline': 'AZ','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'OL3X87B1','bookingClass': 'O','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 7,'fareType': 'public','isRoundTrip': true,'airline': 'AZ','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'OLEX87B1','bookingClass': 'O','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 8,'fareType': 'public','isRoundTrip': true,'airline': 'AC','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 9,'fareType': 'public','isRoundTrip': true,'airline': 'TK','fare': '121.00','seasonStart': {'raw': '07AUG','parsed': '08-07'},'seasonEnd': {'raw': '15MAY','parsed': '05-15'},'fareBasis': 'PV3XPC','bookingClass': 'P','advancePurchase': 0,'ticketDesignator': null},
                            ],
                        },
                    },
                },
                {
                    'pcc': '15D9',
                    'gds': 'apollo',
                    'jobResult': {
                        'response_code': 1,
                        'result': {
                            'currency': 'USD',
                            'fares': [
                                {'lineNumber': 1,'fareType': 'public','isRoundTrip': true,'airline': 'UA','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 2,'fareType': 'public','isRoundTrip': true,'airline': 'LH','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 3,'fareType': 'public','isRoundTrip': true,'airline': 'SN','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 4,'fareType': 'public','isRoundTrip': true,'airline': 'OS','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 5,'fareType': 'public','isRoundTrip': true,'airline': 'LX','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 6,'fareType': 'public','isRoundTrip': true,'airline': 'AZ','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'OL3X87B1','bookingClass': 'O','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 7,'fareType': 'public','isRoundTrip': true,'airline': 'AZ','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'OLEX87B1','bookingClass': 'O','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 8,'fareType': 'public','isRoundTrip': true,'airline': 'AC','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 9,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'TK','fare': '114.00','seasonStart': {'raw': '07AUG','parsed': '08-07'},'seasonEnd': {'raw': '15MAY','parsed': '05-15'},'fareBasis': 'PV3XPCFB','bookingClass': 'P','advancePurchase': 0,'ticketDesignator': null},
                                {'lineNumber': 10,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'TK','fare': '115.00','seasonStart': {'raw': '07AUG','parsed': '08-07'},'seasonEnd': {'raw': '15MAY','parsed': '05-15'},'fareBasis': 'PV3XPC','bookingClass': 'P','advancePurchase': 0,'ticketDesignator': 'FB05'},
                                {'lineNumber': 11,'fareType': 'public','isRoundTrip': true,'airline': 'TK','fare': '121.00','seasonStart': {'raw': '07AUG','parsed': '08-07'},'seasonEnd': {'raw': '15MAY','parsed': '05-15'},'fareBasis': 'PV3XPC','bookingClass': 'P','advancePurchase': 0,'ticketDesignator': null},
                            ],
                        },
                    },
                },
                {
                    'pcc': '2E1I',
                    'gds': 'apollo',
                    'jobResult': {
                        'response_code': 1,
                        'result': {
                            'currency': 'USD',
                            'fares': [
                                {'lineNumber': 1,'fareType': 'public','isRoundTrip': true,'airline': 'UA','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 2,'fareType': 'public','isRoundTrip': true,'airline': 'LH','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 3,'fareType': 'public','isRoundTrip': true,'airline': 'SN','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 4,'fareType': 'public','isRoundTrip': true,'airline': 'OS','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 5,'fareType': 'public','isRoundTrip': true,'airline': 'LX','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 6,'fareType': 'public','isRoundTrip': true,'airline': 'AZ','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'OL3X87B1','bookingClass': 'O','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 7,'fareType': 'public','isRoundTrip': true,'airline': 'AZ','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'OLEX87B1','bookingClass': 'O','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 8,'fareType': 'public','isRoundTrip': true,'airline': 'AC','fare': '109.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 9,'fareType': 'public','isRoundTrip': true,'airline': 'TK','fare': '121.00','seasonStart': {'raw': '07AUG','parsed': '08-07'},'seasonEnd': {'raw': '15MAY','parsed': '05-15'},'fareBasis': 'PV3XPC','bookingClass': 'P','advancePurchase': 0,'ticketDesignator': null},
                            ],
                        },
                    },
                },
                {
                    'pcc': '2G55',
                    'gds': 'apollo',
                    'jobResult': {
                        'response_code': 1,
                        'result': {
                            'currency': 'USD',
                            'fares': [
                                {'lineNumber': 1,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'UA','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 2,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'LH','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 3,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'SN','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 4,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'OS','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 5,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'LX','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': 6,'fareType': 'airlinePrivate','isRoundTrip': true,'airline': 'AC','fare': '59.00','seasonStart': {'raw': '28OCT','parsed': '10-28'},'seasonEnd': {'raw': '13DEC','parsed': '12-13'},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                            ],
                        },
                    },
                },
                {
                    'pcc': '6IIF',
                    'gds': 'sabre',
                    'jobResult': {
                        'response_code': 1,
                        'result': {
                            'currency': 'USD','fares': [
                                {'lineNumber': '1','fareType': 'public','isRoundTrip': true,'airline': 'LH','fare': '109.00','seasonStart': {'raw': '','parsed': null},'seasonEnd': {'raw': '','parsed': null},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                            ],
                        },
                    },
                },
                {
                    'pcc': 'U2E5',
                    'gds': 'sabre',
                    'jobResult': {
                        'response_code': 1,
                        'result': {
                            'currency': 'USD',
                            'fares': [
                                {'lineNumber': '1','fareType': 'public','isRoundTrip': true,'airline': 'LH','fare': '109.00','seasonStart': {'raw': '','parsed': null},'seasonEnd': {'raw': '','parsed': null},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                            ],
                        }},
                },
                {
                    'pcc': '5E9H',
                    'gds': 'sabre',
                    'jobResult': {
                        'response_code': 1,
                        'result': {
                            'currency': 'USD',
                            'fares': [
                                {'lineNumber': '1','fareType': 'public','isRoundTrip': true,'airline': 'LH','fare': '109.00','seasonStart': {'raw': '','parsed': null},'seasonEnd': {'raw': '','parsed': null},'fareBasis': 'KLA87LGT','bookingClass': 'K','advancePurchase': 28,'ticketDesignator': null},
                            ],
                        },
                    },
                },
                {
                    'pcc': 'LAXGO3106',
                    'gds': 'amadeus',
                    'jobResult': {
                        'response_code': 1,
                        'result': {
                            'currency': 'USD',
                            'fares': [
                                {'lineNumber': '01','fareType': 'public','isRoundTrip': true,'airline': 'AZ','fare': '109','seasonStart': null,'seasonEnd': null,'fareBasis': 'OL3X87B1','bookingClass': null,'advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': '02','fareType': 'public','isRoundTrip': true,'airline': 'UA','fare': '109','seasonStart': null,'seasonEnd': null,'fareBasis': 'KLA87LGT','bookingClass': null,'advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': '03','fareType': 'public','isRoundTrip': true,'airline': 'SN','fare': '109','seasonStart': null,'seasonEnd': null,'fareBasis': 'KLA87LGT','bookingClass': null,'advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': '04','fareType': 'public','isRoundTrip': true,'airline': 'AZ','fare': '109','seasonStart': null,'seasonEnd': null,'fareBasis': 'OLEX87B1','bookingClass': null,'advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': '05','fareType': 'public','isRoundTrip': true,'airline': 'AC','fare': '109','seasonStart': null,'seasonEnd': null,'fareBasis': 'KLA87LGT','bookingClass': null,'advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': '06','fareType': 'public','isRoundTrip': true,'airline': 'LH','fare': '109','seasonStart': null,'seasonEnd': null,'fareBasis': 'KLA87LGT','bookingClass': null,'advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': '07','fareType': 'public','isRoundTrip': true,'airline': 'LX','fare': '109','seasonStart': null,'seasonEnd': null,'fareBasis': 'KLA87LGT','bookingClass': null,'advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': '08','fareType': 'public','isRoundTrip': true,'airline': 'OS','fare': '109','seasonStart': null,'seasonEnd': null,'fareBasis': 'KLA87LGT','bookingClass': null,'advancePurchase': 28,'ticketDesignator': null},
                                {'lineNumber': '09','fareType': 'public','isRoundTrip': true,'airline': 'TK','fare': '121','seasonStart': {'raw': '07AUG','parsed': '08-07'},'seasonEnd': null,'fareBasis': 'PV3XPC','bookingClass': null,'advancePurchase': 0,'ticketDesignator': null},
                            ],
                        },
                    },
                },
            ],
            php.implode(php.PHP_EOL, [
                '     CX    FARE   FARE     C  AP MIN/    FE SEASONS..... MR GI',
                '           USD    BASIS            MAX                        ',
                '  1 -UA    59.00R KLA87LGT K  28   /        28OCT -13DEC',
                '  2 -LH    59.00R KLA87LGT K  28   /        28OCT -13DEC',
                '  3 -SN    59.00R KLA87LGT K  28   /        28OCT -13DEC',
                '  4 -OS    59.00R KLA87LGT K  28   /        28OCT -13DEC',
                '  5 -LX    59.00R KLA87LGT K  28   /        28OCT -13DEC',
                '  6 -AC    59.00R KLA87LGT K  28   /        28OCT -13DEC',
                '  7 -KL    88.00R VL7B1RM2 V   |   /        28OCT -13DEC       1V 2G52',
                '  8 -DL    88.00R VL7B1RM2 V   |   /        28OCT -13DEC       1V 2G52',
                '  9 -AZ    88.00R OL7B1RM2 O   |   /        28OCT -13DEC       1V 2G52',
                ' 10 -AF    88.00R VL7B1RM2 V   |   /        28OCT -13DEC       1V 2G52',
                ' 11 -AC    92.00R KLA87LGT K  28   /        28OCT -13DEC       1V 2G52',
                ' 12 -KL    93.00R VL7B1RM2 V   |   /        28OCT -13DEC       1V 2G52',
                ' 13 -DL    93.00R VL7B1RM2 V   |   /        28OCT -13DEC       1V 2G52',
                ' 14 -AZ    93.00R OL7B1RM2 O   |   /        28OCT -13DEC       1V 2G52',
                ' 15 -AF    93.00R VL7B1RM2 V   |   /        28OCT -13DEC       1V 2G52',
				' 16  UA   109.00R KLA87LGT K  28   /        28OCT -13DEC       1V 2F9B',
				' 17  LH   109.00R KLA87LGT K  28   /        28OCT -13DEC       1V 2F9B',
				' 18  SN   109.00R KLA87LGT K  28   /        28OCT -13DEC       1V 2F9B',
				' 19  OS   109.00R KLA87LGT K  28   /        28OCT -13DEC       1V 2F9B',
				' 20  LX   109.00R KLA87LGT K  28   /        28OCT -13DEC       1V 2F9B',
                ' 21  AZ   109.00R OL3X87B1 O  28   /        28OCT -13DEC       1V 2F9B',
                ' 22  AZ   109.00R OLEX87B1 O  28   /        28OCT -13DEC       1V 2F9B',
                ' 23  AC   109.00R KLA87LGT K  28   /        28OCT -13DEC       1V 2F9B',
                ' 24 -TK   114.00R PV3XPCFB P   |   /        07AUG -15MAY       1V 15D9',
                ' 25 -TK   115.00R PV3XPC   P   |   /        07AUG -15MAY       1V 15D9',
                '     TD:FB05 ',
                ' 26  TK   121.00R PV3XPC   P   |   /        07AUG -15MAY       1V 2F9B',
            ]),
        ]);
        return $list;
    }

    provideMakeTariffDisplayDumpTestCases()  {
        let $list;
        $list = [];
        $list.push([
            {'pcc': '6IIF', 'gds': 'sabre'},
            Fp.map(($fare) => {
				return [$fare];
            }, this.constructor.makeTableRows([
                ['lineNumber' , 'fareType'       , 'isRoundTrip' , 'airline' , 'fare'   , 'seasonStart'                          , 'seasonEnd'                            , 'fareBasis' , 'bookingClass' , 'advancePurchase' , 'minStay'                                                                                   , 'maxStay'                                                                                        , 'penalties'                                                                        , 'ticketDesignator' , 'oceanicFlight' , 'isRoutingBased' , 'isMileageBased' , 'gds'     , 'pcc'       , 'currency'],
                [           1 , 'agencyPrivate'  , true          , 'MU'      , '95.00'  , {'raw': '','parsed': null}         , {'raw': '','parsed': null}         , 'TLE0Z6RN'  , 'T'            , null              , {'raw': '','type': 'noRequirements'}                                                    , {'raw': '','type': 'noRequirements'}                                                         , null                                                                               , 'SSF2'             , {'raw': ''}   , null             , true             , 'apollo'  , '1O3K'      , 'USD'     ],
                [           2 , 'agencyPrivate'  , true          , 'TK'      , '119.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'UV3XPC'    , 'U'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , 'ITN06YJEE5'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [           3 , 'agencyPrivate'  , true          , 'TK'      , '119.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'UV3XPC'    , 'U'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , 'NET1VOZ9XZ'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [           4 , 'airlinePrivate' , true          , 'TK'      , '119.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'UV3XPCFB'  , 'U'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , null               , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [           5 , 'agencyPrivate'  , true          , 'TK'      , '121.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'UV3XPC'    , 'U'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , 'ITN05U4R4U'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [           6 , 'airlinePrivate' , true          , 'TK'      , '121.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'UV3XPCFB'  , 'U'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , null               , {'raw': 'AT'} , true             , null             , 'apollo'  , '2G2H'      , 'USD'     ],
                [           1 , 'public'         , true          , 'TK'      , '127.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'UV3XPC'    , 'U'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , null               , {'raw': 'AT'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [           7 , 'agencyPrivate'  , true          , 'TK'      , '203.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'WV3XPC'    , 'W'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , 'ITN06YJEE5'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [           8 , 'agencyPrivate'  , true          , 'TK'      , '203.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'WV3XPC'    , 'W'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , 'NET1VOZ9XZ'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [           9 , 'airlinePrivate' , true          , 'TK'      , '203.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'WV3XPCFB'  , 'W'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , null               , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          10 , 'airlinePrivate' , true          , 'TK'      , '205.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'WV3XPC'    , 'W'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , 'FB05'             , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          11 , 'agencyPrivate'  , true          , 'TK'      , '205.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'WV3XPC'    , 'W'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , 'ITN05U4R4U'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          12 , 'airlinePrivate' , true          , 'TK'      , '205.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'WV3XPCFB'  , 'W'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , null               , {'raw': 'AT'} , true             , null             , 'apollo'  , '2G2H'      , 'USD'     ],
                [           2 , 'public'         , true          , 'TK'      , '216.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'WV3XPC'    , 'W'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , null               , {'raw': 'AT'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          13 , 'agencyPrivate'  , true          , 'TK'      , '344.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'PV3XPC'    , 'P'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , 'NET1VOZ9XZ'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          14 , 'agencyPrivate'  , true          , 'TK'      , '345.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'PV3XPC'    , 'P'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , 'ITN06YJEE5'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          15 , 'airlinePrivate' , true          , 'TK'      , '345.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'PV3XPCFB'  , 'P'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , null               , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          16 , 'airlinePrivate' , true          , 'TK'      , '349.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'PV3XPC'    , 'P'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , 'FB05'             , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          17 , 'agencyPrivate'  , true          , 'TK'      , '349.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'PV3XPC'    , 'P'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , 'ITN05U4R4U'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          18 , 'airlinePrivate' , true          , 'TK'      , '349.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'PV3XPCFB'  , 'P'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , null               , {'raw': 'AT'} , true             , null             , 'apollo'  , '2G2H'      , 'USD'     ],
                [           3 , 'public'         , true          , 'TK'      , '367.00' , {'raw': '07AUG','parsed': '08-07'} , {'raw': '15MAY','parsed': '05-15'} , 'PV3XPC'    , 'P'            , null              , {'raw': 'SU','type': 'dayOfWeek','dayOfWeek': 7}                                      , {'raw': '4M','type': 'amount','amount': '4','units': 'months'}                           , null                                                                               , null               , {'raw': 'AT'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          19 , 'agencyPrivate'  , true          , 'KL'      , '383.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKX7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , 'SPL08SYL4C'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          20 , 'agencyPrivate'  , true          , 'AF'      , '383.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKX7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , 'SPL08Y42B7'       , {'raw': 'AT'} , null             , true             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          21 , 'agencyPrivate'  , true          , 'KL'      , '391.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKX7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , 'SPL06OJXV1'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          22 , 'agencyPrivate'  , true          , 'KL'      , '395.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKX7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , 'SPL05K5ALQ'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          23 , 'agencyPrivate'  , true          , 'AF'      , '395.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKX7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , 'SPL05PARSL'       , {'raw': 'AT'} , null             , true             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          24 , 'agencyPrivate'  , true          , 'KL'      , '404.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKX7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , 'SPL03FQNCF'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          25 , 'agencyPrivate'  , true          , 'AF'      , '404.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKX7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , 'SPL03KW4JA'       , {'raw': 'AT'} , null             , true             , 'apollo'  , '1O3K'      , 'USD'     ],
                [           4 , 'airlinePrivate' , true          , 'MS'      , '413.00' , {'raw': '01SEP','parsed': '09-01'} , {'raw': '14DEC','parsed': '12-14'} , 'SLNIUS'    , 'S'            , null              , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '12M','type': 'amount','amount': '12','units': 'months'}                         , null                                                                               , 'PV'               , {'raw': 'AT'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [           5 , 'public'         , true          , 'KL'      , '416.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKX7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'AT'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [           6 , 'public'         , true          , 'AF'      , '416.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKX7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'AT'} , null             , true             , 'apollo'  , '2F9B'      , 'USD'     ],
                [           7 , 'public'         , true          , 'MH'      , '424.00' , {'raw': '','parsed': null}         , {'raw': '','parsed': null}         , 'QLXB1YUS'  , 'Q'            , null              , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '12M','type': 'amount','amount': '12','units': 'months'}                         , null                                                                               , null               , {'raw': 'PA'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [           8 , 'airlinePrivate' , true          , 'MS'      , '450.00' , {'raw': '01SEP','parsed': '09-01'} , {'raw': '14DEC','parsed': '12-14'} , 'LLRIUS'    , 'L'            , null              , {'raw': '5','type': 'amount','amount': '5','units': 'days'}                         , {'raw': '12M','type': 'amount','amount': '12','units': 'months'}                         , null                                                                               , 'PV'               , {'raw': 'AT'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          31 , 'agencyPrivate'  , true          , 'KL'      , '493.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKW7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , 'SPL08SYL4C'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          32 , 'agencyPrivate'  , true          , 'AF'      , '493.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKW7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , 'SPL08Y42B7'       , {'raw': 'AT'} , null             , true             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          33 , 'agencyPrivate'  , true          , 'ET'      , '503.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '12DEC','parsed': '12-12'} , 'HKESUS'    , 'H'            , null              , {'raw': '','type': 'noRequirements'}                                                    , {'raw': '12M','type': 'amount','amount': '12','units': 'months'}                         , null                                                                               , 'NET1VHSYKQ'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          34 , 'agencyPrivate'  , true          , 'KL'      , '504.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKW7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , 'SPL06OJXV1'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          35 , 'agencyPrivate'  , true          , 'KL'      , '509.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKW7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , 'SPL05K5ALQ'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          36 , 'agencyPrivate'  , true          , 'KE'      , '509.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '11DEC','parsed': '12-11'} , 'TKX6ZNME'  , 'T'            ,                30 , {'raw': '||','type': 'complexRule'}                                                     , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , 'NET1VN46OW'       , {'raw': 'PA'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          37 , 'agencyPrivate'  , true          , 'AF'      , '509.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKW7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , 'SPL05PARSL'       , {'raw': 'AT'} , null             , true             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          38 , 'agencyPrivate'  , true          , 'KL'      , '520.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKW7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , 'SPL03FQNCF'       , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          39 , 'agencyPrivate'  , true          , 'AF'      , '520.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKW7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , 'SPL03KW4JA'       , {'raw': 'AT'} , null             , true             , 'apollo'  , '1O3K'      , 'USD'     ],
                [          40 , 'airlinePrivate' , true          , 'EK'      , '522.00' , {'raw': '08DEC','parsed': '12-08'} , {'raw': '13DEC','parsed': '12-13'} , 'LXHWPUS2'  , 'L'            ,                 7 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'AT'} , true             , null             , 'apollo'  , '1O3K'      , 'USD'     ],
                [           9 , 'public'         , true          , 'MH'      , '524.00' , {'raw': '','parsed': null}         , {'raw': '','parsed': null}         , 'QLWB1YUS'  , 'Q'            , null              , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '12M','type': 'amount','amount': '12','units': 'months'}                         , null                                                                               , null               , {'raw': 'PA'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          10 , 'airlinePrivate' , true          , 'MS'      , '525.00' , {'raw': '01SEP','parsed': '09-01'} , {'raw': '14DEC','parsed': '12-14'} , 'VLRIUS'    , 'V'            , null              , {'raw': '3','type': 'amount','amount': '3','units': 'days'}                         , {'raw': '12M','type': 'amount','amount': '12','units': 'months'}                         , null                                                                               , 'PV'               , {'raw': 'AT'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          11 , 'public'         , true          , 'KL'      , '536.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKW7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'AT'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          12 , 'public'         , true          , 'AF'      , '536.00' , {'raw': '21NOV','parsed': '11-21'} , {'raw': '12DEC','parsed': '12-12'} , 'VKW7R8US'  , 'V'            ,                10 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'AT'} , null             , true             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          13 , 'public'         , true          , 'KL'      , '542.00' , {'raw': '08DEC','parsed': '12-08'} , {'raw': '13DEC','parsed': '12-13'} , 'VHXL77M2'  , 'V'            , null              , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '12M','type': 'amount','amount': '12','units': 'months'}                         , null                                                                               , null               , {'raw': 'AT'} , null             , true             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          14 , 'public'         , true          , 'EK'      , '542.00' , {'raw': '08DEC','parsed': '12-08'} , {'raw': '13DEC','parsed': '12-13'} , 'LXHWPUS1'  , 'L'            ,                 7 , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'AT'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          15 , 'public'         , true          , 'AF'      , '542.00' , {'raw': '08DEC','parsed': '12-08'} , {'raw': '13DEC','parsed': '12-13'} , 'VHXL77M2'  , 'V'            , null              , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '12M','type': 'amount','amount': '12','units': 'months'}                         , null                                                                               , null               , {'raw': 'AT'} , null             , true             , 'apollo'  , '2F9B'      , 'USD'     ],
                [         '1' , 'public'         , true          , 'HX'      , '550.00' , {'raw': '','parsed': null}         , {'raw': '','parsed': null}         , 'TIL3MA'    , 'T'            , null              , {'type': 'noRequirements'}                                                                , {'type': 'amount','amount': '3','units': 'months'}                                         , null                                                                               , null               , {'raw': ''}   , null             , null             , 'sabre'   , '6IIF'      , 'USD'     ],
                [          16 , 'public'         , true          , 'MS'      , '550.00' , {'raw': '01SEP','parsed': '09-01'} , {'raw': '14DEC','parsed': '12-14'} , 'SLNIUS'    , 'S'            , null              , {'raw': '7','type': 'amount','amount': '7','units': 'days'}                         , {'raw': '12M','type': 'amount','amount': '12','units': 'months'}                         , null                                                                               , null               , {'raw': 'AT'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          18 , 'public'         , true          , 'ET'      , '559.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '12DEC','parsed': '12-12'} , 'HKESUS'    , 'H'            , null              , {'raw': '','type': 'noRequirements'}                                                    , {'raw': '12M','type': 'amount','amount': '12','units': 'months'}                         , null                                                                               , null               , {'raw': 'AT'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          19 , 'public'         , true          , 'DL'      , '588.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '11DEC','parsed': '12-11'} , 'VKX6ZNME'  , 'V'            ,                30 , {'raw': '||','type': 'complexRule'}                                                     , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , true             , true             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          20 , 'public'         , true          , 'KE'      , '588.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '11DEC','parsed': '12-11'} , 'TKX6ZNME'  , 'T'            ,                30 , {'raw': '||','type': 'complexRule'}                                                     , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          21 , 'public'         , true          , 'JL'      , '588.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '10DEC','parsed': '12-10'} , 'OKU18EN0'  , 'O'            ,                30 , {'raw': '||','type': 'complexRule'}                                                     , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , null             , true             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          22 , 'public'         , true          , 'UA'      , '594.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '10DEC','parsed': '12-10'} , 'LKX4ZAM3'  , 'L'            ,                14 , {'raw': '','type': 'noRequirements'}                                                    , {'raw': '3M','type': 'amount','amount': '3','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          23 , 'public'         , true          , 'NH'      , '594.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '10DEC','parsed': '12-10'} , 'LKX4ZAM3'  , 'L'            ,                14 , {'raw': '','type': 'noRequirements'}                                                    , {'raw': '3M','type': 'amount','amount': '3','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          24 , 'public'         , true          , 'JL'      , '594.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '10DEC','parsed': '12-10'} , 'OKX48AN2'  , 'O'            , null              , {'raw': '||','type': 'complexRule'}                                                     , {'raw': '3M','type': 'amount','amount': '3','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , null             , true             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          25 , 'public'         , true          , 'CZ'      , '595.00' , {'raw': '10DEC','parsed': '12-10'} , {'raw': '13DEC','parsed': '12-13'} , 'V2ZRCUS'   , 'V'            , null              , {'raw': '3','type': 'amount','amount': '3','units': 'days'}                         , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          26 , 'public'         , true          , 'AA'      , '596.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '10DEC','parsed': '12-10'} , 'OKU18GN1'  , 'O'            ,                30 , {'raw': '||','type': 'complexRule'}                                                     , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , null             , true             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          27 , 'public'         , true          , 'AA'      , '596.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '10DEC','parsed': '12-10'} , 'OKX48CN1'  , 'O'            ,                14 , {'raw': '||','type': 'complexRule'}                                                     , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , null             , true             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          28 , 'public'         , true          , 'UA'      , '600.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '10DEC','parsed': '12-10'} , 'LKG0ZCM9'  , 'L'            , null              , {'raw': '','type': 'noRequirements'}                                                    , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          29 , 'public'         , true          , 'UA'      , '600.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '10DEC','parsed': '12-10'} , 'LKGEZCM9'  , 'L'            , null              , {'raw': '','type': 'noRequirements'}                                                    , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          30 , 'public'         , true          , 'SQ'      , '600.00' , {'raw': '01JAN','parsed': '01-01'} , {'raw': '31DEC','parsed': '12-31'} , 'VMJFK'     , 'V'            , null              , {'raw': '','type': 'noRequirements'}                                                    , {'raw': '1M','type': 'amount','amount': '1','units': 'months'}                           , null                                                                               , null               , {'raw': 'AT'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          31 , 'public'         , true          , 'MS'      , '600.00' , {'raw': '01SEP','parsed': '09-01'} , {'raw': '14DEC','parsed': '12-14'} , 'LLRIUS'    , 'L'            , null              , {'raw': '5','type': 'amount','amount': '5','units': 'days'}                         , {'raw': '12M','type': 'amount','amount': '12','units': 'months'}                         , null                                                                               , null               , {'raw': 'AT'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          33 , 'public'         , true          , 'NH'      , '600.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '10DEC','parsed': '12-10'} , 'LKG0ZCM9'  , 'L'            , null              , {'raw': '','type': 'noRequirements'}                                                    , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          34 , 'public'         , true          , 'NH'      , '600.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '10DEC','parsed': '12-10'} , 'LKGEZCM9'  , 'L'            , null              , {'raw': '','type': 'noRequirements'}                                                    , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          35 , 'public'         , true          , 'OZ'      , '600.00' , {'raw': '08DEC','parsed': '12-08'} , {'raw': '12DEC','parsed': '12-12'} , 'WKXAUS14'  , 'W'            ,                14 , {'raw': '','type': 'noRequirements'}                                                    , {'raw': '12M','type': 'amount','amount': '12','units': 'months'}                         , null                                                                               , null               , {'raw': 'PA'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          36 , 'public'         , true          , 'AA'      , '608.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '10DEC','parsed': '12-10'} , 'OKU08GN1'  , 'O'            , null              , {'raw': '||','type': 'complexRule'}                                                     , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , null             , true             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          37 , 'public'         , true          , 'AA'      , '608.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '10DEC','parsed': '12-10'} , 'OKX08CN1'  , 'O'            , null              , {'raw': '||','type': 'complexRule'}                                                     , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , null             , true             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          38 , 'public'         , true          , 'UA'      , '608.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '10DEC','parsed': '12-10'} , 'LKX0ZAM3'  , 'L'            , null              , {'raw': '','type': 'noRequirements'}                                                    , {'raw': '3M','type': 'amount','amount': '3','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          39 , 'public'         , true          , 'NH'      , '608.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '10DEC','parsed': '12-10'} , 'LKX0ZAM3'  , 'L'            , null              , {'raw': '','type': 'noRequirements'}                                                    , {'raw': '3M','type': 'amount','amount': '3','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , true             , null             , 'apollo'  , '2F9B'      , 'USD'     ],
                [          40 , 'public'         , true          , 'JL'      , '608.00' , {'raw': '01DEC','parsed': '12-01'} , {'raw': '10DEC','parsed': '12-10'} , 'OKU08GN0'  , 'O'            , null              , {'raw': '||','type': 'complexRule'}                                                     , {'raw': '6M','type': 'amount','amount': '6','units': 'months'}                           , null                                                                               , null               , {'raw': 'PA'} , null             , true             , 'apollo'  , '2F9B'      , 'USD'     ],
                [        '01' , 'public'         , true          , 'PR'      ,    '660' , null                                   , null                                   , 'OKXFNY'    , null           , null              , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '1M','hasMoreRules': false,'type': 'amount','amount': '1','units': 'months'}   , {'raw': 'NRF','type': 'nonRefundable','value': null,'hasMoreRules': false} , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '02' , 'public'         , true          , 'PR'      ,    '720' , null                                   , null                                   , 'OKWFNY'    , null           , null              , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '1M','hasMoreRules': false,'type': 'amount','amount': '1','units': 'months'}   , {'raw': 'NRF','type': 'nonRefundable','value': null,'hasMoreRules': false} , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '03' , 'public'         , true          , 'PR'      ,    '780' , null                                   , null                                   , 'UKXFNY'    , null           , null              , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '3M','hasMoreRules': false,'type': 'amount','amount': '3','units': 'months'}   , {'raw': 'NRF','type': 'nonRefundable','value': null,'hasMoreRules': false} , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '04' , 'public'         , true          , 'PR'      ,    '840' , null                                   , null                                   , 'UKWFNY'    , null           , null              , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '3M','hasMoreRules': false,'type': 'amount','amount': '3','units': 'months'}   , {'raw': 'NRF','type': 'nonRefundable','value': null,'hasMoreRules': false} , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '05' , 'public'         , true          , 'PR'      ,    '920' , {'raw': '10DEC','parsed': '12-10'} , null                                   , 'TKXFNY'    , null           , null              , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '3M','hasMoreRules': false,'type': 'amount','amount': '3','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '06' , 'public'         , true          , 'HU'      ,    '938' , {'raw': '31DEC','parsed': '12-31'} , null                                   , 'NL6MCUS5'  , null           ,                50 , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M+','hasMoreRules': true,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , null             , true             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '07' , 'public'         , true          , 'PR'      ,    '980' , {'raw': '10DEC','parsed': '12-10'} , null                                   , 'TKWFNY'    , null           , null              , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '3M','hasMoreRules': false,'type': 'amount','amount': '3','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '08' , 'public'         , true          , 'HU'      ,    '988' , {'raw': '31DEC','parsed': '12-31'} , null                                   , 'NL6MCUS3'  , null           ,                30 , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M+','hasMoreRules': true,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , null             , true             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '09' , 'public'         , true          , 'HX'      ,   '1020' , null                                   , null                                   , 'SIL6MA'    , null           , null              , {'raw': '-','hasMoreRules': false,'type': 'noRequirements'}                           , {'raw': '6M','hasMoreRules': false,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '+','type': 'complexRule','value': null,'hasMoreRules': true}      , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '10' , 'public'         , true          , 'HU'      ,   '1038' , {'raw': '31DEC','parsed': '12-31'} , null                                   , 'NL6MCUS2'  , null           ,                14 , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M+','hasMoreRules': true,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , null             , true             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '11' , 'public'         , true          , 'PR'      ,   '1050' , {'raw': '13DEC','parsed': '12-13'} , null                                   , 'THXFNY'    , null           , null              , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '3M','hasMoreRules': false,'type': 'amount','amount': '3','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '12' , 'public'         , true          , 'PR'      ,   '1050' , {'raw': '10DEC','parsed': '12-10'} , null                                   , 'EKXFNY'    , null           , null              , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '3M','hasMoreRules': false,'type': 'amount','amount': '3','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '14' , 'public'         , true          , 'HU'      ,   '1088' , {'raw': '31DEC','parsed': '12-31'} , null                                   , 'NL6MCUS1'  , null           ,                 7 , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M+','hasMoreRules': true,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , null             , true             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '15' , 'public'         , true          , 'PR'      ,   '1110' , {'raw': '10DEC','parsed': '12-10'} , null                                   , 'EKWFNY'    , null           , null              , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '3M','hasMoreRules': false,'type': 'amount','amount': '3','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '17' , 'public'         , true          , 'HU'      ,   '1138' , {'raw': '31DEC','parsed': '12-31'} , null                                   , 'NL6MCUS'   , null           , null              , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M+','hasMoreRules': true,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , null             , true             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '18' , 'public'         , true          , 'PR'      ,   '1150' , {'raw': '13DEC','parsed': '12-13'} , null                                   , 'THWFNY'    , null           , null              , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '3M','hasMoreRules': false,'type': 'amount','amount': '3','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '19' , 'public'         , true          , 'PR'      ,   '1150' , {'raw': '10DEC','parsed': '12-10'} , null                                   , 'KKXFNY'    , null           , null              , {'raw': '3','hasMoreRules': false,'type': 'amount','amount': '3','units': 'days'} , {'raw': '3M','hasMoreRules': false,'type': 'amount','amount': '3','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '20' , 'public'         , true          , 'PR'      ,   '1150' , {'raw': '13DEC','parsed': '12-13'} , null                                   , 'EHXFNY'    , null           , null              , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '3M','hasMoreRules': false,'type': 'amount','amount': '3','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '21' , 'public'         , true          , 'HU'      ,   '1188' , {'raw': '23DEC','parsed': '12-23'} , null                                   , 'NH6MCUS5'  , null           ,                50 , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M+','hasMoreRules': true,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , null             , true             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '22' , 'public'         , true          , 'PR'      ,   '1200' , {'raw': '10DEC','parsed': '12-10'} , null                                   , 'TKOXFNY'   , null           , null              , {'raw': '-','hasMoreRules': false,'type': 'noRequirements'}                           , {'raw': '-','hasMoreRules': false,'type': 'noRequirements'}                                , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '23' , 'public'         , true          , 'PR'      ,   '1210' , {'raw': '10DEC','parsed': '12-10'} , null                                   , 'KKWFNY'    , null           , null              , {'raw': '3','hasMoreRules': false,'type': 'amount','amount': '3','units': 'days'} , {'raw': '3M','hasMoreRules': false,'type': 'amount','amount': '3','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '24' , 'public'         , true          , 'HX'      ,   '1220' , null                                   , null                                   , 'NIL6MA'    , null           , null              , {'raw': '-','hasMoreRules': false,'type': 'noRequirements'}                           , {'raw': '6M','hasMoreRules': false,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '+','type': 'complexRule','value': null,'hasMoreRules': true}      , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '25' , 'public'         , true          , 'PR'      ,   '1230' , {'raw': '13DEC','parsed': '12-13'} , null                                   , 'KHXFNY'    , null           , null              , {'raw': '3','hasMoreRules': false,'type': 'amount','amount': '3','units': 'days'} , {'raw': '3M','hasMoreRules': false,'type': 'amount','amount': '3','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '26' , 'public'         , true          , 'HU'      ,   '1238' , {'raw': '23DEC','parsed': '12-23'} , null                                   , 'NH6MCUS3'  , null           ,                30 , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M+','hasMoreRules': true,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , null             , true             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '27' , 'public'         , true          , 'PR'      ,   '1250' , {'raw': '13DEC','parsed': '12-13'} , null                                   , 'EHWFNY'    , null           , null              , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '3M','hasMoreRules': false,'type': 'amount','amount': '3','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '28' , 'public'         , true          , 'PR'      ,   '1260' , {'raw': '10DEC','parsed': '12-10'} , null                                   , 'TKOWFNY'   , null           , null              , {'raw': '-','hasMoreRules': false,'type': 'noRequirements'}                           , {'raw': '-','hasMoreRules': false,'type': 'noRequirements'}                                , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '29' , 'public'         , true          , 'PR'      ,   '1285' , {'raw': '12DEC','parsed': '12-12'} , null                                   , 'NXPFNY'    , null           , null              , {'raw': '3','hasMoreRules': false,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M','hasMoreRules': false,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '30' , 'public'         , true          , 'HU'      ,   '1288' , {'raw': '31DEC','parsed': '12-31'} , null                                   , 'VL6MCUS'   , null           , null              , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M+','hasMoreRules': true,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , null             , true             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '31' , 'public'         , true          , 'HU'      ,   '1288' , {'raw': '23DEC','parsed': '12-23'} , null                                   , 'NH6MCUS2'  , null           ,                14 , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M+','hasMoreRules': true,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , null             , true             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '32' , 'public'         , true          , 'PR'      ,   '1330' , {'raw': '13DEC','parsed': '12-13'} , null                                   , 'KHWFNY'    , null           , null              , {'raw': '3','hasMoreRules': false,'type': 'amount','amount': '3','units': 'days'} , {'raw': '3M','hasMoreRules': false,'type': 'amount','amount': '3','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '33' , 'public'         , true          , 'PR'      ,   '1330' , {'raw': '22DEC','parsed': '12-22'} , null                                   , 'XHXFNY'    , null           , null              , {'raw': '3','hasMoreRules': false,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M','hasMoreRules': false,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '34' , 'public'         , true          , 'PR'      ,   '1330' , {'raw': '10DEC','parsed': '12-10'} , null                                   , 'XKXFNY'    , null           , null              , {'raw': '3','hasMoreRules': false,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M','hasMoreRules': false,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '35' , 'public'         , true          , 'HU'      ,   '1338' , {'raw': '23DEC','parsed': '12-23'} , null                                   , 'NH6MCUS1'  , null           ,                 7 , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M+','hasMoreRules': true,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , null             , true             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '38' , 'public'         , true          , 'PR'      ,   '1385' , {'raw': '12DEC','parsed': '12-12'} , null                                   , 'NWPFNY'    , null           , null              , {'raw': '3','hasMoreRules': false,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M','hasMoreRules': false,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '39' , 'public'         , true          , 'PR'      ,   '1390' , {'raw': '10DEC','parsed': '12-10'} , null                                   , 'XKWFNY'    , null           , null              , {'raw': '3','hasMoreRules': false,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M','hasMoreRules': false,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '41' , 'public'         , true          , 'PR'      ,   '1430' , {'raw': '22DEC','parsed': '12-22'} , null                                   , 'XHWFNY'    , null           , null              , {'raw': '3','hasMoreRules': false,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M','hasMoreRules': false,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '42' , 'public'         , true          , 'HX'      ,   '1430' , null                                   , null                                   , 'MILRTA'    , null           , null              , {'raw': '-','hasMoreRules': false,'type': 'noRequirements'}                           , {'raw': '12M','hasMoreRules': false,'type': 'amount','amount': '12','units': 'months'} , {'raw': '+','type': 'complexRule','value': null,'hasMoreRules': true}      , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '43' , 'public'         , true          , 'HU'      ,   '1488' , {'raw': '31DEC','parsed': '12-31'} , null                                   , 'XL6MCUS'   , null           , null              , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M+','hasMoreRules': true,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , null             , true             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '44' , 'public'         , true          , 'HU'      ,   '1488' , {'raw': '23DEC','parsed': '12-23'} , null                                   , 'NH6MCUS'   , null           , null              , {'raw': '3+','hasMoreRules': true,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M+','hasMoreRules': true,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , null             , true             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
                [        '46' , 'public'         , true          , 'PR'      ,   '1500' , {'raw': '22DEC','parsed': '12-22'} , null                                   , 'BHXFNY'    , null           , null              , {'raw': '3','hasMoreRules': false,'type': 'amount','amount': '3','units': 'days'} , {'raw': '6M','hasMoreRules': false,'type': 'amount','amount': '6','units': 'months'}   , {'raw': '-','type': 'noRequirements','value': null,'hasMoreRules': false}  , null               , {'raw': 'PA'} , true             , null             , 'amadeus' , 'LAXGO3106' , 'USD'     ],
            ])),
            php.implode(php.PHP_EOL, [
                '     CX    FARE   FARE     C  AP MIN/    FE SEASONS..... MR GI',
                '           USD    BASIS            MAX                        ',
                '  1 /MU    95.00R TLE0Z6RN T   | --/--            -      M     1V 1O3K',
                '     TD:SSF2 ',
                '  2 /TK   119.00R UV3XPC   U   | SU/4M      07AUG -15MAY R  AT 1V 1O3K',
                '     TD:ITN06YJEE5 ',
                '  3 /TK   119.00R UV3XPC   U   | SU/4M      07AUG -15MAY R  AT 1V 1O3K',
                '     TD:NET1VOZ9XZ ',
                '  4 -TK   119.00R UV3XPCFB U   | SU/4M      07AUG -15MAY R  AT 1V 1O3K',
                '  5 /TK   121.00R UV3XPC   U   | SU/4M      07AUG -15MAY R  AT 1V 1O3K',
                '     TD:ITN05U4R4U ',
                '  6 -TK   121.00R UV3XPCFB U   | SU/4M      07AUG -15MAY R  AT 1V 2G2H',
                '  7  TK   127.00R UV3XPC   U   | SU/4M      07AUG -15MAY R  AT 1V 2F9B',
                '  8 /TK   203.00R WV3XPC   W   | SU/4M      07AUG -15MAY R  AT 1V 1O3K',
                '     TD:ITN06YJEE5 ',
                '  9 /TK   203.00R WV3XPC   W   | SU/4M      07AUG -15MAY R  AT 1V 1O3K',
                '     TD:NET1VOZ9XZ ',
                ' 10 -TK   203.00R WV3XPCFB W   | SU/4M      07AUG -15MAY R  AT 1V 1O3K',
                ' 11 -TK   205.00R WV3XPC   W   | SU/4M      07AUG -15MAY R  AT 1V 1O3K',
                '     TD:FB05 ',
                ' 12 /TK   205.00R WV3XPC   W   | SU/4M      07AUG -15MAY R  AT 1V 1O3K',
                '     TD:ITN05U4R4U ',
                ' 13 -TK   205.00R WV3XPCFB W   | SU/4M      07AUG -15MAY R  AT 1V 2G2H',
                ' 14  TK   216.00R WV3XPC   W   | SU/4M      07AUG -15MAY R  AT 1V 2F9B',
                ' 15 /TK   344.00R PV3XPC   P   | SU/4M      07AUG -15MAY R  AT 1V 1O3K',
                '     TD:NET1VOZ9XZ ',
                ' 16 /TK   345.00R PV3XPC   P   | SU/4M      07AUG -15MAY R  AT 1V 1O3K',
                '     TD:ITN06YJEE5 ',
                ' 17 -TK   345.00R PV3XPCFB P   | SU/4M      07AUG -15MAY R  AT 1V 1O3K',
                ' 18 -TK   349.00R PV3XPC   P   | SU/4M      07AUG -15MAY R  AT 1V 1O3K',
                '     TD:FB05 ',
                ' 19 /TK   349.00R PV3XPC   P   | SU/4M      07AUG -15MAY R  AT 1V 1O3K',
                '     TD:ITN05U4R4U ',
                ' 20 -TK   349.00R PV3XPCFB P   | SU/4M      07AUG -15MAY R  AT 1V 2G2H',
                ' 21  TK   367.00R PV3XPC   P   | SU/4M      07AUG -15MAY R  AT 1V 2F9B',
                ' 22 /KL   383.00R VKX7R8US V  10  7/6M      21NOV -12DEC R  AT 1V 1O3K',
                '     TD:SPL08SYL4C ',
                ' 23 /AF   383.00R VKX7R8US V  10  7/6M      21NOV -12DEC M  AT 1V 1O3K',
                '     TD:SPL08Y42B7 ',
                ' 24 /KL   391.00R VKX7R8US V  10  7/6M      21NOV -12DEC R  AT 1V 1O3K',
                '     TD:SPL06OJXV1 ',
                ' 25 /KL   395.00R VKX7R8US V  10  7/6M      21NOV -12DEC R  AT 1V 1O3K',
                '     TD:SPL05K5ALQ ',
                ' 26 /AF   395.00R VKX7R8US V  10  7/6M      21NOV -12DEC M  AT 1V 1O3K',
                '     TD:SPL05PARSL ',
                ' 27 /KL   404.00R VKX7R8US V  10  7/6M      21NOV -12DEC R  AT 1V 1O3K',
                '     TD:SPL03FQNCF ',
                ' 28 /AF   404.00R VKX7R8US V  10  7/6M      21NOV -12DEC M  AT 1V 1O3K',
                '     TD:SPL03KW4JA ',
                ' 29 -MS   413.00R SLNIUS   S   |  7/12M     01SEP -14DEC R  AT 1V 2F9B',
                '     TD:PV ',
                ' 30  KL   416.00R VKX7R8US V  10  7/6M      21NOV -12DEC R  AT 1V 2F9B',
                ' 31  AF   416.00R VKX7R8US V  10  7/6M      21NOV -12DEC M  AT 1V 2F9B',
                ' 32  MH   424.00R QLXB1YUS Q   |  7/12M           -      R  PA 1V 2F9B',
                ' 33 -MS   450.00R LLRIUS   L   |  5/12M     01SEP -14DEC R  AT 1V 2F9B',
                '     TD:PV ',
                ' 34 /KL   493.00R VKW7R8US V  10  7/6M      21NOV -12DEC R  AT 1V 1O3K',
                '     TD:SPL08SYL4C ',
                ' 35 /AF   493.00R VKW7R8US V  10  7/6M      21NOV -12DEC M  AT 1V 1O3K',
                '     TD:SPL08Y42B7 ',
                ' 36 /ET   503.00R HKESUS   H   | --/12M     01DEC -12DEC R  AT 1V 1O3K',
                '     TD:NET1VHSYKQ ',
                ' 37 /KL   504.00R VKW7R8US V  10  7/6M      21NOV -12DEC R  AT 1V 1O3K',
                '     TD:SPL06OJXV1 ',
                ' 38 /KL   509.00R VKW7R8US V  10  7/6M      21NOV -12DEC R  AT 1V 1O3K',
                '     TD:SPL05K5ALQ ',
                ' 39 /KE   509.00R TKX6ZNME T  30  V/6M      01DEC -11DEC R  PA 1V 1O3K',
                '     TD:NET1VN46OW ',
                ' 40 /AF   509.00R VKW7R8US V  10  7/6M      21NOV -12DEC M  AT 1V 1O3K',
                '     TD:SPL05PARSL ',
                ' 41 /KL   520.00R VKW7R8US V  10  7/6M      21NOV -12DEC R  AT 1V 1O3K',
                '     TD:SPL03FQNCF ',
                ' 42 /AF   520.00R VKW7R8US V  10  7/6M      21NOV -12DEC M  AT 1V 1O3K',
                '     TD:SPL03KW4JA ',
                ' 43 -EK   522.00R LXHWPUS2 L   7  7/6M      08DEC -13DEC R  AT 1V 1O3K',
                ' 44  MH   524.00R QLWB1YUS Q   |  7/12M           -      R  PA 1V 2F9B',
                ' 45 -MS   525.00R VLRIUS   V   |  3/12M     01SEP -14DEC R  AT 1V 2F9B',
                '     TD:PV ',
                ' 46  KL   536.00R VKW7R8US V  10  7/6M      21NOV -12DEC R  AT 1V 2F9B',
                ' 47  AF   536.00R VKW7R8US V  10  7/6M      21NOV -12DEC M  AT 1V 2F9B',
                ' 48  KL   542.00R VHXL77M2 V   |  7/12M     08DEC -13DEC M  AT 1V 2F9B',
                ' 49  EK   542.00R LXHWPUS1 L   7  7/6M      08DEC -13DEC R  AT 1V 2F9B',
                ' 50  AF   542.00R VHXL77M2 V   |  7/12M     08DEC -13DEC M  AT 1V 2F9B',
                ' 51  HX   550.00R TIL3MA   T   | --/3M            -',
                ' 52  MS   550.00R SLNIUS   S   |  7/12M     01SEP -14DEC R  AT 1V 2F9B',
                ' 53  ET   559.00R HKESUS   H   | --/12M     01DEC -12DEC R  AT 1V 2F9B',
                ' 54  DL   588.00R VKX6ZNME V  30  V/6M      01DEC -11DEC MR PA 1V 2F9B',
                ' 55  KE   588.00R TKX6ZNME T  30  V/6M      01DEC -11DEC R  PA 1V 2F9B',
                ' 56  JL   588.00R OKU18EN0 O  30  V/6M      01DEC -10DEC M  PA 1V 2F9B',
                ' 57  UA   594.00R LKX4ZAM3 L  14 --/3M      01DEC -10DEC R  PA 1V 2F9B',
                ' 58  NH   594.00R LKX4ZAM3 L  14 --/3M      01DEC -10DEC R  PA 1V 2F9B',
                ' 59  JL   594.00R OKX48AN2 O   |  V/3M      01DEC -10DEC M  PA 1V 2F9B',
                ' 60  CZ   595.00R V2ZRCUS  V   |  3/6M      10DEC -13DEC R  PA 1V 2F9B',
                ' 61  AA   596.00R OKU18GN1 O  30  V/6M      01DEC -10DEC M  PA 1V 2F9B',
                ' 62  AA   596.00R OKX48CN1 O  14  V/6M      01DEC -10DEC M  PA 1V 2F9B',
                ' 63  UA   600.00R LKG0ZCM9 L   | --/6M      01DEC -10DEC R  PA 1V 2F9B',
                ' 64  UA   600.00R LKGEZCM9 L   | --/6M      01DEC -10DEC R  PA 1V 2F9B',
                ' 65  SQ   600.00R VMJFK    V   | --/1M      01JAN -31DEC R  AT 1V 2F9B',
                ' 66  MS   600.00R LLRIUS   L   |  5/12M     01SEP -14DEC R  AT 1V 2F9B',
                ' 67  NH   600.00R LKG0ZCM9 L   | --/6M      01DEC -10DEC R  PA 1V 2F9B',
                ' 68  NH   600.00R LKGEZCM9 L   | --/6M      01DEC -10DEC R  PA 1V 2F9B',
                ' 69  OZ   600.00R WKXAUS14 W  14 --/12M     08DEC -12DEC R  PA 1V 2F9B',
                ' 70  AA   608.00R OKU08GN1 O   |  V/6M      01DEC -10DEC M  PA 1V 2F9B',
                ' 71  AA   608.00R OKX08CN1 O   |  V/6M      01DEC -10DEC M  PA 1V 2F9B',
                ' 72  UA   608.00R LKX0ZAM3 L   | --/3M      01DEC -10DEC R  PA 1V 2F9B',
                ' 73  NH   608.00R LKX0ZAM3 L   | --/3M      01DEC -10DEC R  PA 1V 2F9B',
                ' 74  JL   608.00R OKU08GN0 O   |  V/6M      01DEC -10DEC M  PA 1V 2F9B',
                ' 75  PR   660.00R OKXFNY       |  3/1M   NR       -      R  PA 1A LAXGO3106',
                ' 76  PR   720.00R OKWFNY       |  3/1M   NR       -      R  PA 1A LAXGO3106',
                ' 77  PR   780.00R UKXFNY       |  3/3M   NR       -      R  PA 1A LAXGO3106',
                ' 78  PR   840.00R UKWFNY       |  3/3M   NR       -      R  PA 1A LAXGO3106',
                ' 79  PR   920.00R TKXFNY       |  3/3M   -- 10DEC -      R  PA 1A LAXGO3106',
                ' 80  HU   938.00R NL6MCUS5    50  3/6M   -- 31DEC -      M  PA 1A LAXGO3106',
                ' 81  PR   980.00R TKWFNY       |  3/3M   -- 10DEC -      R  PA 1A LAXGO3106',
                ' 82  HU   988.00R NL6MCUS3    30  3/6M   -- 31DEC -      M  PA 1A LAXGO3106',
                ' 83  HX  1020.00R SIL6MA       | --/6M   ||       -      R  PA 1A LAXGO3106',
                ' 84  HU  1038.00R NL6MCUS2    14  3/6M   -- 31DEC -      M  PA 1A LAXGO3106',
                ' 85  PR  1050.00R THXFNY       |  3/3M   -- 13DEC -      R  PA 1A LAXGO3106',
                ' 86  PR  1050.00R EKXFNY       |  3/3M   -- 10DEC -      R  PA 1A LAXGO3106',
                ' 87  HU  1088.00R NL6MCUS1     7  3/6M   -- 31DEC -      M  PA 1A LAXGO3106',
                ' 88  PR  1110.00R EKWFNY       |  3/3M   -- 10DEC -      R  PA 1A LAXGO3106',
                ' 89  HU  1138.00R NL6MCUS      |  3/6M   -- 31DEC -      M  PA 1A LAXGO3106',
                ' 90  PR  1150.00R THWFNY       |  3/3M   -- 13DEC -      R  PA 1A LAXGO3106',
                ' 91  PR  1150.00R KKXFNY       |  3/3M   -- 10DEC -      R  PA 1A LAXGO3106',
                ' 92  PR  1150.00R EHXFNY       |  3/3M   -- 13DEC -      R  PA 1A LAXGO3106',
                ' 93  HU  1188.00R NH6MCUS5    50  3/6M   -- 23DEC -      M  PA 1A LAXGO3106',
                ' 94  PR  1200.00R TKOXFNY      | --/--   -- 10DEC -      R  PA 1A LAXGO3106',
                ' 95  PR  1210.00R KKWFNY       |  3/3M   -- 10DEC -      R  PA 1A LAXGO3106',
                ' 96  HX  1220.00R NIL6MA       | --/6M   ||       -      R  PA 1A LAXGO3106',
                ' 97  PR  1230.00R KHXFNY       |  3/3M   -- 13DEC -      R  PA 1A LAXGO3106',
                ' 98  HU  1238.00R NH6MCUS3    30  3/6M   -- 23DEC -      M  PA 1A LAXGO3106',
                ' 99  PR  1250.00R EHWFNY       |  3/3M   -- 13DEC -      R  PA 1A LAXGO3106',
                '100  PR  1260.00R TKOWFNY      | --/--   -- 10DEC -      R  PA 1A LAXGO3106',
                '101  PR  1285.00R NXPFNY       |  3/6M   -- 12DEC -      R  PA 1A LAXGO3106',
                '102  HU  1288.00R VL6MCUS      |  3/6M   -- 31DEC -      M  PA 1A LAXGO3106',
                '103  HU  1288.00R NH6MCUS2    14  3/6M   -- 23DEC -      M  PA 1A LAXGO3106',
                '104  PR  1330.00R KHWFNY       |  3/3M   -- 13DEC -      R  PA 1A LAXGO3106',
                '105  PR  1330.00R XHXFNY       |  3/6M   -- 22DEC -      R  PA 1A LAXGO3106',
                '106  PR  1330.00R XKXFNY       |  3/6M   -- 10DEC -      R  PA 1A LAXGO3106',
                '107  HU  1338.00R NH6MCUS1     7  3/6M   -- 23DEC -      M  PA 1A LAXGO3106',
                '108  PR  1385.00R NWPFNY       |  3/6M   -- 12DEC -      R  PA 1A LAXGO3106',
                '109  PR  1390.00R XKWFNY       |  3/6M   -- 10DEC -      R  PA 1A LAXGO3106',
                '110  PR  1430.00R XHWFNY       |  3/6M   -- 22DEC -      R  PA 1A LAXGO3106',
                '111  HX  1430.00R MILRTA       | --/12M  ||       -      R  PA 1A LAXGO3106',
                '112  HU  1488.00R XL6MCUS      |  3/6M   -- 31DEC -      M  PA 1A LAXGO3106',
                '113  HU  1488.00R NH6MCUS      |  3/6M   -- 23DEC -      M  PA 1A LAXGO3106',
                '114  PR  1500.00R BHXFNY       |  3/6M   -- 22DEC -      R  PA 1A LAXGO3106',
            ]),
        ]);
        return $list;
    }

    /**
     * @test
     * @dataProvider provideMakeTariffDisplayDumpFromJobsTestCases
     */
    testMakeTariffDisplayDumpFromJobs($input, $expected)  {
        let $mergedFares, $actual;
        $mergedFares = MakeMultiPccTariffDumpAction.mergeJobFares($input, {});
        $actual = MakeMultiPccTariffDumpAction.makeContentDump($mergedFares, {'pcc': '15JE', 'gds': 'apollo'}, {});
        this.assertEquals($expected, $actual);
    }

    /**
     * @test
     * @dataProvider provideMakeTariffDisplayDumpTestCases
     */
    testMakeTariffDisplayDumpTestCases($sessionData, $input, $expected)  {
        let $actual;
        $actual = MakeMultiPccTariffDumpAction.makeContentDump($input, $sessionData, {});
        this.assertEquals($expected, $actual);
    }

	getTestMapping() {
		return [
			[this.provideMakeTariffDisplayDumpFromJobsTestCases, this.testMakeTariffDisplayDumpFromJobs],
			[this.provideMakeTariffDisplayDumpTestCases, this.testMakeTariffDisplayDumpTestCases],
		];
	}
}
module.exports = MakeMultiPccTariffDumpActionTest;
