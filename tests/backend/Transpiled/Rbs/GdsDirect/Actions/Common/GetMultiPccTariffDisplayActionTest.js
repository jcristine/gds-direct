
// namespace Rbs\GdsDirect\Actions\Common;

const ArrayUtil = require('../../../../../../../backend/Transpiled/Lib/Utils/ArrayUtil.js');
const Fp = require('../../../../../../../backend/Transpiled/Lib/Utils/Fp.js');
const StubLocationGeographyProvider = require('../../../../../../../backend/Transpiled/Rbs/DataProviders/StubLocationGeographyProvider.js');
const GetMultiPccTariffDisplayAction = require('../../../../../../../backend/Transpiled/Rbs/GdsDirect/Actions/Common/GetMultiPccTariffDisplayAction.js');

let php = require('../../../../../../../backend/Transpiled/php.js');

class GetMultiPccTariffDisplayActionTest extends require('../../../../../../../backend/Transpiled/Lib/TestCase.js')
{
    static getGeoProvider()  {
        let $airportRows;
        $airportRows = ArrayUtil.makeTableRows([
            ['iata_code' , 'name'                          , 'country_code' , 'country_name'   , 'state_code' , 'city_code' , 'city_name'   , 'lat'     , 'lon'      , 'tz'                , 'region_id' , 'region_name'  ],
            ['ABZ'       , 'Dyce Airport'                  , 'GB'           , 'United Kingdom' , null         , 'ABZ'       , 'Aberdeen'    , '57.2019' , '-2.1978'  , 'Europe/London'     ,        '33' , 'Europe'       ],
            ['AMM'       , 'Queen Alia Intl Arpt'          , 'JO'           , 'Jordan'         , null         , 'AMM'       , 'Amman'       , '31.7226' , '35.9932'  , 'Asia/Amman'        ,        '35' , 'Middle East'  ],
            ['AMS'       , 'Schiphol Arpt'                 , 'NL'           , 'Netherlands'    , null         , 'AMS'       , 'Amsterdam'   , '52.3086' , '4.7639'   , 'Europe/Amsterdam'  ,        '33' , 'Europe'       ],
            ['JFK'       , 'John F Kennedy Intl Arpt'      , 'US'           , 'United States'  , 'NY'         , 'NYC'       , 'New York'    , '40.6398' , '-73.7789' , 'America/New_York'  ,        '38' , 'North America'],
            ['KIV'       , 'Chisinau Arpt'                 , 'MD'           , 'Moldova'        , null         , 'KIV'       , 'Chisinau'    , '46.9277' , '28.9310'  , 'Europe/Chisinau'   ,        '33' , 'Europe'       ],
            ['LGA'       , 'La Guardia Arpt'               , 'US'           , 'United States'  , 'NY'         , 'NYC'       , 'New York'    , '40.7772' , '-73.8726' , 'America/New_York'  ,        '38' , 'North America'],
            ['LOS'       , 'Murtala Muhammed Arpt'         , 'NG'           , 'Nigeria'        , null         , 'LOS'       , 'Lagos'       , '6.5774'  , '3.3212'   , 'Africa/Lagos'      ,        '34' , 'Africa'       ],
            ['MSP'       , 'Minneapolis St Paul Intl Arpt' , 'US'           , 'United States'  , 'MN'         , 'MSP'       , 'Minneapolis' , '44.8820' , '-93.2218' , 'America/Chicago'   ,        '38' , 'North America'],
            ['TUL'       , 'Tulsa Intl Arpt'               , 'US'           , 'United States'  , 'OK'         , 'TUL'       , 'Tulsa'       , '36.1984' , '-95.8881' , 'America/Chicago'   ,        '38' , 'North America'],
        ])
        ;
        return new StubLocationGeographyProvider($airportRows);
    }

    static getRepriceRules()  {
        return [
            {
                // fallback rule
                'departure_items': [],
                'destination_items': [],
                'reprice_pcc_records': [
                    {'gds': 'apollo', 'pcc': '1O3K', 'ptc': 'JWZ'},
                    {'gds': 'apollo', 'pcc': '2G52', 'ptc': 'JWZ'},
                    {'gds': 'apollo', 'pcc': '2F9B', 'ptc': 'JWZ'},
                    {'gds': 'apollo', 'pcc': '13NM', 'ptc': 'JWZ'},
                    {'gds': 'apollo', 'pcc': '2G2H', 'ptc': 'JWZ'},
                    {'gds': 'sabre', 'pcc': 'U2E5', 'ptc': 'JCB'},
                    {'gds': 'sabre', 'pcc': '5E9H', 'ptc': 'JCB'},
                    {'gds': 'sabre', 'pcc': 'DK8H', 'ptc': 'JCB'},
                    {'gds': 'sabre', 'pcc': '0EKH', 'account_code': 'BSAG', 'ptc': 'ITX'},
                    {'gds': 'sabre', 'pcc': '0EKH', 'account_code': 'BSAG', 'ptc': null},
                    {'gds': 'sabre', 'pcc': 'K2MI'},
                    {'gds': 'galileo', 'pcc': 'K9P', 'account_code': 'TPACK', 'fare_type': 'private', 'ptc': 'ITX'},
                    {'gds': 'galileo', 'pcc': 'K9P', 'account_code': 'TPACK', 'fare_type': 'private', 'ptc': null},
                    {'gds': 'galileo', 'pcc': 'G8T', 'account_code': 'TPACK', 'fare_type': 'private', 'ptc': 'ITX'},
                    {'gds': 'galileo', 'pcc': 'G8T', 'account_code': 'TPACK', 'fare_type': 'private', 'ptc': null},
                ],
            },
            {
                'departure_items': [{'type': 'country','value': 'US'}],
                'destination_items': [{'type': 'region','value': '35'}],
                'reprice_pcc_records': [
                    {'gds': 'apollo','pcc': '1O3K','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '13NM','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G52','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G8P','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2I3L','ptc': 'JWZ'},
                    {'gds': 'sabre','pcc': 'U2E5','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': 'DK8H','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': '5E9H','ptc': 'JCB'},
                ],
            },
            {
                'departure_items': [{'type': 'country','value': 'US'}],
                'destination_items': [{'type': 'region','value': '39'}],
                'reprice_pcc_records': [
                    {'gds': 'apollo','pcc': '1O3K','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G2H','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G8P','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '13NM','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G52','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2F9B','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '15D9','ptc': 'JWZ'},
                    {'gds': 'sabre','pcc': 'U2E5','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': '5E9H','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': 'DK8H','ptc': 'JCB'},
                    {'gds': 'amadeus','pcc': 'LAXGO3106','fare_type': 'private'},
                ],
            },
            {
                'departure_items': [{'type': 'country','value': 'US'}],
                'destination_items': [{'type': 'region','value': '34'}],
                'reprice_pcc_records': [
                    {'gds': 'apollo','pcc': '1O3K','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '13NM','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G2H','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G52','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2F9B','ptc': 'JWZ'},
                    {'gds': 'sabre','pcc': 'U2E5','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': 'DK8H','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': '5E9H','ptc': 'JCB'},
                ],
            },
            {
                'departure_items': [{'type': 'country','value': 'US'}],
                'destination_items': [{'type': 'region','value': '33'}],
                'reprice_pcc_records': [
                    {'gds': 'apollo','pcc': '1O3K','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G2H','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G52','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '13NM','ptc': 'JWZ'},
                    {'gds': 'sabre','pcc': 'U2E5','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': 'DK8H','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': '5E9H','ptc': 'JCB'},
                    {'gds': 'amadeus','pcc': 'LAXGO3106','fare_type': 'private'},
                ],
            },
            {
                'departure_items': [{'type': 'country','value': 'US'}],
                'destination_items': [{'type': 'region','value': '37'}],
                'reprice_pcc_records': [
                    {'gds': 'apollo','pcc': '1O3K','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G2H','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G52','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '13NM','ptc': 'JWZ'},
                    {'gds': 'amadeus','pcc': 'LAXGO3106','fare_type': 'private'},
                ],
            },
            {
                'departure_items': [{'type': 'country','value': 'US'}],
                'destination_items': [{'type': 'region','value': '42'}],
                'reprice_pcc_records': [
                    {'gds': 'apollo','pcc': '1O3K','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '13NM','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G52','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G2H','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2I3L','ptc': 'JWZ'},
                    {'gds': 'sabre','pcc': 'U2E5','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': 'DK8H','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': '5E9H','ptc': 'JCB'},
                ],
            },
            {
                'departure_items': [{'type': 'country','value': 'US'}],
                'destination_items': [{'type': 'region','value': '36'}],
                'reprice_pcc_records': [
                    {'gds': 'apollo','pcc': '1O3K','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G2H','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G52','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2E8R','ptc': 'JWZ'},
                    {'gds': 'sabre','pcc': 'U2E5','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': 'DK8H','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': '5E9H','ptc': 'JCB'},
                ],
            },
            {
                'departure_items': [{'type': 'country','value': 'CA'}],
                'destination_items': [],
                'reprice_pcc_records': [
                    {'gds': 'apollo','pcc': '2BQ6','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2E4T','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G52','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2I70','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2E1I','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2ER7','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '10OW','ptc': 'JWZ'},
                    {'gds': 'sabre','pcc': 'RR8F','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': '5EGB','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': 'T42I','ptc': 'JCB'},
                    {'gds': 'amadeus','pcc': 'YTOGO310E','fare_type': 'private'},
                ],
            },
            {
                'departure_items': [{'type': 'country','value': 'GB'}],
                'destination_items': [],
                'reprice_pcc_records': [
                    {'gds': 'apollo','pcc': '13NM','ptc': 'JWZ'},
                    {'gds': 'sabre','pcc': '0EKH','ptc': 'ITX','account_code': 'BSAG'},
                    {'gds': 'sabre','pcc': '0EKH','account_code': 'BSAG'},
                    {'gds': 'sabre','pcc': '5E9H','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': 'K2MI'},
                    {'gds': 'sabre','pcc': 'DK8H','ptc': 'JCB'},
                    {'gds': 'galileo','pcc': 'K9P','ptc': 'ITX','account_code': 'TPACK','fare_type': 'private'},
                    {'gds': 'galileo','pcc': 'K9P','account_code': 'TPACK','fare_type': 'private'},
                    {'gds': 'galileo','pcc': 'G8T','ptc': 'ITX','account_code': 'TPACK','fare_type': 'private'},
                    {'gds': 'galileo','pcc': 'G8T','account_code': 'TPACK','fare_type': 'private'},
                    {'gds': 'galileo','pcc': '3ZV4','ptc': 'ITX','account_code': 'BSAG','fare_type': 'private'},
                    {'gds': 'galileo','pcc': '3ZV4','account_code': 'BSAG','fare_type': 'private'},
                ],
            },
            {
                'departure_items': [{'type': 'country','value': 'US'}],
                'destination_items': [],
                'reprice_pcc_records': [
                    {'gds': 'apollo','pcc': '1O3K','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G2H','ptc': 'JWZ'},
                    {'gds': 'apollo','pcc': '2G52','ptc': 'JWZ'},
                    {'gds': 'sabre','pcc': 'U2E5','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': '6IIF','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': 'DK8H','ptc': 'JCB'},
                    {'gds': 'sabre','pcc': '5E9H','ptc': 'JCB'},
                ],
            },
        ];
    }

    provideMakeRpcParamOptionsTestCases()  {
        let $list;
        $list = [];

        // the US -> Europe rule from Apollo, round-trip
        $list.push([
            {
                'gds': 'apollo', 'pcc': '2G52',
                'cmd': '$DV5NOVTULAMS22NOV',
            },
            ArrayUtil.makeTableRows([
                ['pcc'       , 'gds'     , 'ptc', 'fareType' , 'departureAirport' , 'destinationAirport' , 'departureDate' , 'returnDate'],
                ['1O3K'      , 'apollo'  , 'JWZ', null       , 'TUL'              , 'AMS'                , '2018-11-05'    , '2018-11-22'],
                ['2G2H'      , 'apollo'  , 'JWZ', null       , 'TUL'              , 'AMS'                , '2018-11-05'    , '2018-11-22'],
                ['2G52'      , 'apollo'  , 'JWZ', null       , 'TUL'              , 'AMS'                , '2018-11-05'    , '2018-11-22'],
                ['13NM'      , 'apollo'  , 'JWZ', null       , 'TUL'              , 'AMS'                , '2018-11-05'    , '2018-11-22'],
                ['U2E5'      , 'sabre'   , 'JCB', null       , 'TUL'              , 'AMS'                , '2018-11-05'    , '2018-11-22'],
                ['DK8H'      , 'sabre'   , 'JCB', null       , 'TUL'              , 'AMS'                , '2018-11-05'    , '2018-11-22'],
                ['5E9H'      , 'sabre'   , 'JCB', null       , 'TUL'              , 'AMS'                , '2018-11-05'    , '2018-11-22'],
                ['LAXGO3106' , 'amadeus' , null , 'private'  , 'TUL'              , 'AMS'                , '2018-11-05'    , '2018-11-22'],
            ]),
        ]);

        // Apollo US -> US with airline select
        $list.push([
            {
                'gds': 'apollo', 'pcc': '2CV4',
                'cmd': '$D24NOVLOSNYC|KQ',
            },
            ArrayUtil.makeTableRows([
                ['pcc'  , 'gds'    , 'ptc' , 'airlines' , 'departureDate' , 'returnDate' , 'departureAirport' , 'destinationAirport'],
                ['1O3K' , 'apollo' , 'JWZ' , ['KQ']     , '2018-11-24'    , null         , 'LOS'              , 'NYC'               ],
                ['13NM' , 'apollo' , 'JWZ' , ['KQ']     , '2018-11-24'    , null         , 'LOS'              , 'NYC'               ],
                ['2G2H' , 'apollo' , 'JWZ' , ['KQ']     , '2018-11-24'    , null         , 'LOS'              , 'NYC'               ],
                ['2G52' , 'apollo' , 'JWZ' , ['KQ']     , '2018-11-24'    , null         , 'LOS'              , 'NYC'               ],
                ['2F9B' , 'apollo' , 'JWZ' , ['KQ']     , '2018-11-24'    , null         , 'LOS'              , 'NYC'               ],
                ['U2E5' , 'sabre'  , 'JCB' , ['KQ']     , '2018-11-24'    , null         , 'LOS'              , 'NYC'               ],
                ['DK8H' , 'sabre'  , 'JCB' , ['KQ']     , '2018-11-24'    , null         , 'LOS'              , 'NYC'               ],
                ['5E9H' , 'sabre'  , 'JCB' , ['KQ']     , '2018-11-24'    , null         , 'LOS'              , 'NYC'               ],
                ['2CV4' , 'apollo' ,  null , ['KQ']     , '2018-11-24'    , null         , 'LOS'              , 'NYC'               ],
            ]),
        ]);

        // from anywhere else to anywhere else
        $list.push([
            {
                'gds': 'apollo', 'pcc': '2G2H',
                'cmd': '$DV21DECKIVAMM4JAN',
            },
            ArrayUtil.makeTableRows([
                ['pcc'  , 'gds'     , 'ptc' , 'departureDate' , 'returnDate' , 'departureAirport' , 'destinationAirport' , 'accountCode' , 'fareType'],
                ['1O3K' , 'apollo'  , 'JWZ' , '2018-12-21'    , '2019-01-04' , 'KIV'              , 'AMM'                , null          , null      ],
                ['2G52' , 'apollo'  , 'JWZ' , '2018-12-21'    , '2019-01-04' , 'KIV'              , 'AMM'                , null          , null      ],
                ['2F9B' , 'apollo'  , 'JWZ' , '2018-12-21'    , '2019-01-04' , 'KIV'              , 'AMM'                , null          , null      ],
                ['13NM' , 'apollo'  , 'JWZ' , '2018-12-21'    , '2019-01-04' , 'KIV'              , 'AMM'                , null          , null      ],
                ['2G2H' , 'apollo'  , 'JWZ' , '2018-12-21'    , '2019-01-04' , 'KIV'              , 'AMM'                , null          , null      ],
                ['U2E5' , 'sabre'   , 'JCB' , '2018-12-21'    , '2019-01-04' , 'KIV'              , 'AMM'                , null          , null      ],
                ['5E9H' , 'sabre'   , 'JCB' , '2018-12-21'    , '2019-01-04' , 'KIV'              , 'AMM'                , null          , null      ],
                ['DK8H' , 'sabre'   , 'JCB' , '2018-12-21'    , '2019-01-04' , 'KIV'              , 'AMM'                , null          , null      ],
                ['0EKH' , 'sabre'   , 'ITX' , '2018-12-21'    , '2019-01-04' , 'KIV'              , 'AMM'                , 'BSAG'        , null      ],
                ['0EKH' , 'sabre'   , null  , '2018-12-21'    , '2019-01-04' , 'KIV'              , 'AMM'                , 'BSAG'        , null      ],
                ['K2MI' , 'sabre'   , null  , '2018-12-21'    , '2019-01-04' , 'KIV'              , 'AMM'                , null          , null      ],
                ['K9P'  , 'galileo' , 'ITX' , '2018-12-21'    , '2019-01-04' , 'KIV'              , 'AMM'                , 'TPACK'       , 'private' ],
                ['K9P'  , 'galileo' , null  , '2018-12-21'    , '2019-01-04' , 'KIV'              , 'AMM'                , 'TPACK'       , 'private' ],
                ['G8T'  , 'galileo' , 'ITX' , '2018-12-21'    , '2019-01-04' , 'KIV'              , 'AMM'                , 'TPACK'       , 'private' ],
                ['G8T'  , 'galileo' , null  , '2018-12-21'    , '2019-01-04' , 'KIV'              , 'AMM'                , 'TPACK'       , 'private' ],
            ]),
        ]);

        // Sabre, with private fare mods, one way, GB -> US
        // should use agent's mods in Sabre and mods from rules everywhere else
        // should not repeat same PCC-s from GB -> anywhere and US -> Europe (33)
        // rules, but should include all of them from both rules (G8T, U2E5, etc...)
        $list.push([
            {
                'gds': 'sabre', 'pcc': '0EKH',
                'cmd': 'FQABZMSP18MAR¥RR*BSAG¥PITX',
            },
            ArrayUtil.makeTableRows([
                ['pcc'       , 'gds'     , 'ptc' , 'departureDate' , 'returnDate' , 'departureAirport' , 'destinationAirport' , 'accountCode' , 'fareType'],
                ['13NM'      , 'apollo'  , 'JWZ' , '2019-03-18'    , null         , 'ABZ'              , 'MSP'                , null          , null      ],
                ['0EKH'      , 'sabre'   , 'ITX' , '2019-03-18'    , null         , 'ABZ'              , 'MSP'                , 'BSAG'        , null      ],
                ['5E9H'      , 'sabre'   , 'ITX' , '2019-03-18'    , null         , 'ABZ'              , 'MSP'                , 'BSAG'        , null      ],
                ['K2MI'      , 'sabre'   , 'ITX' , '2019-03-18'    , null         , 'ABZ'              , 'MSP'                , 'BSAG'        , null      ],
                ['DK8H'      , 'sabre'   , 'ITX' , '2019-03-18'    , null         , 'ABZ'              , 'MSP'                , 'BSAG'        , null      ],
                ['K9P'       , 'galileo' , 'ITX' , '2019-03-18'    , null         , 'ABZ'              , 'MSP'                , 'TPACK'       , 'private' ],
                ['K9P'       , 'galileo' , null  , '2019-03-18'    , null         , 'ABZ'              , 'MSP'                , 'TPACK'       , 'private' ],
                ['G8T'       , 'galileo' , 'ITX' , '2019-03-18'    , null         , 'ABZ'              , 'MSP'                , 'TPACK'       , 'private' ],
                ['G8T'       , 'galileo' , null  , '2019-03-18'    , null         , 'ABZ'              , 'MSP'                , 'TPACK'       , 'private' ],
                ['3ZV4'      , 'galileo' , 'ITX' , '2019-03-18'    , null         , 'ABZ'              , 'MSP'                , 'BSAG'        , 'private' ],
                ['3ZV4'      , 'galileo' , null  , '2019-03-18'    , null         , 'ABZ'              , 'MSP'                , 'BSAG'        , 'private' ],
        
                ['1O3K'      , 'apollo'  , 'JWZ' , '2019-03-18'    , null         , 'ABZ'              , 'MSP'                , null          , null      ],
                ['2G2H'      , 'apollo'  , 'JWZ' , '2019-03-18'    , null         , 'ABZ'              , 'MSP'                , null          , null      ],
                ['2G52'      , 'apollo'  , 'JWZ' , '2019-03-18'    , null         , 'ABZ'              , 'MSP'                , null          , null      ],
                ['U2E5'      , 'sabre'   , 'ITX' , '2019-03-18'    , null         , 'ABZ'              , 'MSP'                , 'BSAG'        , null      ],
                ['LAXGO3106' , 'amadeus' , null  , '2019-03-18'    , null         , 'ABZ'              , 'MSP'                , null          , 'private' ],
            ]),
        ]);
        return $list;
    }

    assertSameNoKeyAsNull($expected, $actual, $message)  {
        let $key, $value, $actualValue, $extraKeys;
        if (php.is_array($expected) && php.is_array($actual)) {
            for ([$key, $value] of Object.entries($expected)) {
                $actualValue = $actual[$key] || null;
                this.assertSameNoKeyAsNull($value, $actualValue, $message+'['+$key+']');}
            $extraKeys = php.array_diff(php.array_keys($actual), php.array_keys($expected));
            this.assertEmpty($extraKeys, $message+' actual list has unexpected keys: '+php.implode(', ', $extraKeys));
        } else {
            this.assertSame($expected, $actual, $message);
        }
    }

    /**
     * @test
     * @dataProvider provideMakeRpcParamOptionsTestCases
     */
    async testMakeRpcParamOptions($input, $expected)  {
        let $actual;
        $actual = await (new GetMultiPccTariffDisplayAction())
            .setBaseDate($input['baseDate'] || '2018-09-09')
            .setGeoProvider(this.constructor.getGeoProvider())
            .setRepriceRules(this.constructor.getRepriceRules())
            .makeRpcParamOptions($input['cmd'], $input);
        $actual = Fp.map(($rpcParams) => {
            $rpcParams = {...$rpcParams};
            delete($rpcParams['maxFares']);
            delete($rpcParams['timeout']);
            return $rpcParams;
        }, $actual['options']);
        try {
            this.assertSameNoKeyAsNull($expected, $actual);
        } catch (exc) {
            let args = process.argv.slice(process.execArgv.length + 2);
            if (args.includes('debug')) {
                console.log('\nactual\n', JSON.stringify($actual));
            }
            throw exc;
        }
    }

	getTestMapping() {
		return [
			[this.provideMakeRpcParamOptionsTestCases, this.testMakeRpcParamOptions],
		];
	}
}
module.exports = GetMultiPccTariffDisplayActionTest;
