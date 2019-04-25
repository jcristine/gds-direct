
// namespace Rbs\GdsDirect\DialectTranslator;

const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const SabCmdParser = require('../../../Gds/Parsers/Sabre/CommandParser.js');

const php = require('../../../php.js');
class VariableTranslator
{
    /**
    * Have list of constant regexes(variables with no changes over dialect)
    */
    static getLegendData()  {

        return {
            'calculation': '[\\d\\.\\+\\-\\/\\*]+',
            'single_char': '[A-Z]',
            'free_text': '.*?',
            'free_text_no_at': '[^@]*?',
            'free_text_but_not_5_chars': '(.{0,4}|.{6}.*?)',
            'free_text_but_not_2_letters': '([A-Z]{2}.+|[A-Z].{2,}|.[A-Z].+|.|[^A-Z]{2}.*|)',
            'int_num': '\\d{1,3}',
            'flt_num': '\\d{1,4}',
            'number': '\\d',
            'range': '\\d*',

            'date': '\\d{1,2}[A-Z]{3}',
            'time_short': '\\d{1,4}[APMN]',
            'time': '\\d{1,4}[AP]|\\d{3,4}|12(00|)[MN]',
            'num_time': '\\d{3,4}',

            'al': '[A-Z0-9]{2}',
            'air_alliance': '[A,S,O]',
            'country': '[A-Z]{2}',
            'city': '[A-Z]{3}',
            'currency': '[A-Z]{3}',
            'city_pair': '[A-Z]{6}',
            'pnr': '[A-Z\\d]{6}',
            'fare_base': '[A-Z0-9]+(?:\\/[A-Z0-9]+)?',
            'alphanum': '[A-Z0-9]+',
            'seg_num': '\\d+',
            'flight_num': '\\s{0,3}\\d{1,4}',
            'flt_type': '[A-Z0-9]{3}',
            'class': '[A-Z]{1}',
            'class_list': '(?:[A-Z]\\d)+',
            'ss': '[A-Z]{2}',
            'pcc': '[A-Z0-9]{3,9}',
            'text': '[A-Z\\d\\.\\s\\-]+',
            'star': '[\\*\\s]?',

            'ptc': '[A-Z][A-Z0-9]{2}',
            'pax_pricing_type': '(ITX|JCB)',
            'pax_type': '[A-Z][A-Z0-9]{1,2}',
            'pax_num': '\\d{1,9}',
            'pax_dob': '\\d{1,2}[A-Z]{3}\\d{2}',
            'pax_gender': '[A-Z]?I?',
            'pax_last': '\\w{1,}(\\s\\w{1,})?',
            'pax_first': '\\w{1,}(\\s\\w{1,})?',
            'pax_middle': '\\w{1,}(\\s\\w{1,})?',
            'pax_status': '(?:MR|MRS|MS)',
            'pax_order': '\\d{1,9}',
            'pax_age': '\\d{1,9}',
            'pnr_list': '\\d+',

            'agent_name': '\\S+',
            'sell_price': '\\d+(?:\\.\\d+|)',
            'net_price': '\\d+(?:\\.\\d+|)',
            'fare_amount': '\\d+(:?\\.\\d+|)',
            'agency_phone': '\\d{2,}[\\d-]*',
            'tsa_order': '\\d+',
            'fare_num': '\\d+',
            'space': '\\s*',
        };
    }

    /**
     * Will find list of values(often uses for airlines)
     * regex - need to find each variable(airline)
     * start - text with will be in string beginning
     * between - text between each variable(airline)
     */
    static getListDataType($dialect, $name)  {
        let $types;

        $name = this.cleanNumberInVariableName($name);
        $types = {
            'list_airlines': {
                'apollo': {
                    'regex': '[+.]{al}',
                    'start': '+',
                    'between': '.',
                },
                'galileo': {
                    'regex': '\\/{al}',
                    'start': '/',
                    'between': '/',
                },
                'sabre': {
                    'regex': '(:?¥)?{al}',
                    'start': '¥',
                    'between': '',
                },
                'amadeus': {
                    'regex': '(\\/A|,){al}',
                    'start': '/A',
                    'between': ',',
                },
            },
            'list_airlines_fs': {
                'apollo': {
                    'regex': '[+.]{al}',
                    'start': '+',
                    'between': '.',
                },
                'galileo': {
                    'regex': '\\/{al}',
                    'start': '/',
                    'between': '/',
                },
                'sabre': {
                    'regex': '{al}',
                    'start': '',
                    'between': '',
                },
                'amadeus': {
                    'regex': '(\\/A|,){al}',
                    'start': '/A',
                    'between': ',',
                },
            },
            'list_not_in_airlines': {
                'apollo': {
                    'regex': '[-.]{al}',
                    'start': '-',
                    'between': '.',
                },
                'galileo': {
                    'regex': '\\/{al}-?',
                    'start': '/',
                    'between': '-/',
                },
                'sabre': {
                    'regex': '(:?¥\\*)?{al}',
                    'start': '¥*',
                    'between': '',
                },
                'amadeus': {
                    'regex': '(\\/A-|,){al}',
                    'start': '/A-',
                    'between': ',',
                },
            },
        };
        return ($types[$name] || {})[$dialect];
    }

    static specialVariableData($dialect, $name)  {
        let $types;

        $name = this.cleanNumberInVariableName($name);
        $types = {
            'special_calculation': {
                'apollo': {
                    'getFull': '[\\d\\.\\+\\|\\-\\/\\*]+',
                    'get_types': '([\\d\\.\\+\\-\\/\\*]+)',
                },
                'galileo': {
                    'getFull': '[\\d\\.\\+\\|\\-\\/\\*]+',
                    'get_types': '([\\d\\.\\+\\-\\/\\*]+)',
                },
                'sabre': {
                    'getFull': '[\\d\\.\\+\\-\\/\\*]+',
                    'get_types': '([\\d\\.\\+\\-\\/\\*]+)',
                },
                'amadeus': {
                    'getFull': '[\\d\\.\\+\\-\\/\\*\\;]+',
                    'get_types': '([\\d\\.\\+\\-\\/\\*\\;]+)',
                },
            },
            'special_segment_move_numbers': {
                'apollo': {
                    'getFull': '(\\d+)([-\\+\\/]\\d+)*',
                    'get_types': '(\\d+)([-\\+\\/]\\d+)*',
                },
                'galileo': {
                    'getFull': '(\\d+)S(\\d+[-.\\d]*)*',
                    'get_types': '(\\d+)S(\\d+[-.\\d]*)*',
                },
                'sabre': {
                    'getFull': '(\\d+)([-\\+\\/]\\d+)*',
                    'get_types': '(\\d+)([-\\+\\/]\\d+)*',
                },
                'amadeus': {
                    'getFull': '(\\d+)([-,\\+]\\d+)*',
                    'get_types': '(\\d+)([-,\\+]\\d+)*',
                },
            },
            'special_rebook_segment_numbers': {
                'apollo': {
                    'getFull': '(\\d+)([-+|]\\d+)*',
                    'get_types': '(\\d+)([-+|]\\d+)*',
                },
                'galileo': {
                    'getFull': '(\\d+)([-.]\\d+)*',
                    'get_types': '(\\d+)([-+|]\\d+)*',
                },
                'sabre': {
                    'getFull': '(\\d+)([-\\/]\\d+)*',
                    'get_types': '(\\d+)([-\\/]\\d+)*',
                },
                'amadeus': {
                    'getFull': '(\\d+)([-,]\\d+)*',
                    'get_types': '(\\d+)([-,]\\d+)*',
                },
            },
            'special_rebook_one_class': {
                'apollo': {
                    'getFull': '(\\d+)([-\\+\\/\\d]*)\\/0[A-Z]',
                    'get_types': '(?<numbers>(\\d+)([-\\+\\/\\d]*))\\/0(?<class>[A-Z])',
                },
                'galileo': {
                    'getFull': '(\\d+)([-.]\\d+)*\\/[A-Z]',
                    'get_types': '(?<numbers>(\\d+)([-.\\d]*))\\/(?<class>[A-Z])',
                },
                'sabre': {
                    'getFull': '(\\d+(-\\d+)?(?<letter>[A-Z])(\\/\\d+(-\\d+)?[A-Z]\\/?)*)',
                    'get_types': '(?<numbers>((\\d+)(-\\d+)*[A-Z]\\/?)+)',
                },
                'amadeus': {
                    'getFull': '(?<class>[A-Z])(?<numbers>(\\d+)([-,\\/]\\d+)*)',
                    'get_types': '(?<class>[A-Z])(?<numbers>(\\d+)([-,\\/]\\d+)*)',
                },
            },
            'special_only_apollo_digit': {
                'apollo': {
                    'getFull': '(\\d{1,2}|)',
                    'get_types': '(\\d{1,2}|)',
                },
                'sabre': {
                    'getFull': '(\\d{1,2}|)',
                    'get_types': '(\\d{1,2}|)',
                },
                'amadeus': {
                    'getFull': '(\\d{1,2}|)',
                    'get_types': '(\\d{1,2}|)',
                },
            },
            'special_ticket_num': {
                'apollo': {
                    'getFull': '(\\d{3}\\d{10})',
                    'get_types': '(\\d{3}\\d{10})',
                },
                'galileo': {
                    'getFull': '(\\d{3}\\d{10})',
                    'get_types': '(\\d{3}\\d{10})',
                },
                'sabre': {
                    'getFull': '(\\d{3}\\d{10})',
                    'get_types': '(\\d{3}\\d{10})',
                },
                'amadeus': {
                    'getFull': '(\\d{3}-\\d{10})',
                    'get_types': '(\\d{3}-\\d{10})',
                },
            },
            'special_pax_order': {
                'apollo': {
                    'getFull': '\\d{1,2}(-\\d)?',
                    'get_types': '((?<first_num>\\d{1,2})-?(?<second_num>\\d?))',
                },
                'galileo': {
                    'getFull': '\\d{1,2}',
                    'get_types': '(?<first_num>\\d{1,2})',
                },
                'sabre': {
                    'getFull': '\\d{1,2}.\\d',
                    'get_types': '((?<first_num>\\d{1,2})\\.(?<second_num>\\d))',
                },
                'amadeus': {
                    'getFull': '\\d{1,2}',
                    'get_types': '(?<first_num>\\d{1,2})',
                },
            },
            'special_agency_location': {
                'apollo': {
                    'getFull': '[A-Z]{3}',
                    'get_types': '([A-Z]{3})',
                },
                'galileo': {
                    'getFull': '[A-Z]{3}',
                    'get_types': '([A-Z]{3})',
                },
                'sabre': {
                    'getFull': '',
                    'get_types': '()',
                },
                'amadeus': {
                    'getFull': '[A-Z]{3}',
                    'get_types': '([A-Z]{3})',
                },
            },
            'special_agency_free_text': {
                'apollo': {
                    'getFull': '(\\s|).*',
                    'get_types': '((\\s|).*)',
                },
                'sabre': {
                    'getFull': '',
                    'get_types': '()',
                },
                'amadeus': {
                    'getFull': '',
                    'get_types': '()',
                },
            },
            'special_classes': {
                'apollo': {
                    'getFull': '((?:[A-Z]\\d)+)',
                    'get_types': '((?:[A-Z]\\d)+)',
                },
                'galileo': {
                    'getFull': '((?:[A-Z]\\d)+)',
                    'get_types': '((?:[A-Z]\\d)+)',
                },
                'sabre': {
                    'getFull': '((?:[A-Z]\\d)+)',
                    'get_types': '((?:[A-Z]\\d)+)',
                },
                'amadeus': {
                    'getFull': '([A-Z]+\\d+)',
                    'get_types': '([A-Z]+\\d+)',
                },
            },
            'special_classes_rebook': {
                'apollo': {
                    'getFull': '([\\d\\+\\-]+\\/0((\\d[A-Z]\\+?)+|[A-Z]))',
                    'get_types': '(?<number_list>[\\d\\+\\-]+)\\/0(?:(?<class_list>(\\d[A-Z]\\+?)+)|(?<class>[A-Z]))',
                },
                'sabre': {
                    'getFull': '((\\d+[A-Z]\\/?)+)',
                    'get_types': '(?<class_list>(?:\\d+[A-Z]\\/?)+)',
                },
                'amadeus': {
                    'getFull': '(([A-Z]\\d+\\/?)+)',
                    'get_types': '(?<class_list>(?:[A-Z]\\d+\\/?)+)',
                },
            },
            'special_ss_pax_comment': {
                'apollo': {
                    'getFull': '([A-Z]{2}\\d?)',
                    'get_types': '(?<segment_status>[A-Z]{2}|)(?<pax_num>\\d?)',
                },
                'galileo': {
                    'getFull': '([A-Z]{2}\\d?)',
                    'get_types': '(?<segment_status>[A-Z]{2}|)(?<pax_num>\\d?)',
                },
                'sabre': {
                    'getFull': '([A-Z]{2}\\d?)',
                    'get_types': '(?<segment_status>[A-Z]{2}|)(?<pax_num>\\d?)',
                },
                'amadeus': {
                    'getFull': '(([A-Z]{2}|)\\d?(\\/.+?)?)',
                    'get_types': '(?<segment_status>[A-Z]{2}|)(?<pax_num>\\d?)(?:\\/.+?|)',
                },
            },
            'special_class_types_lib': {
                'apollo': {
                    'getFull': '(//@[A-Z])',
                    'get_types': '(//@[A-Z])',
                },
                'sabre': {
                    'getFull': '(¥TC-[A-Z]B)',
                    'get_types': '(¥TC-[A-Z]B)',
                },
            },
            'special_fare_num': {
                'apollo': {
                    'getFull': '\\d{2}',
                    'get_types': '(//@[A-Z])',
                },
                'sabre': {
                    'getFull': '(¥TC-[A-Z]B)',
                    'get_types': '(¥TC-[A-Z]B)',
                },
            },
        };
        return ($types[$name] || {})[$dialect];
    }

    static commandPartTranslationLibrary($type, $dialect)  {
        let $lib;

        $lib = {
            'cmd': {
                'apollo': '$B',
                'sabre': 'WP',
                'amadeus': 'FX',
            },
            'mod': {
                'apollo': ['',  'B',   'BA',   'B0'],
                'sabre': ['',  'NC', 'NCS', 'NCB'],
                'amadeus': ['X', 'A',   'L',    'R'],
            },
            'type': {
                'apollo': ['', 'S',  'N',  '@'],
                'sabre': ['', 'S',  'P',  'Q'],
                'amadeus': ['', '/S', '/R', '/L'],
            },
            'special_rebook_segment_numbers': {
                'apollo': ['', '-', '+', '|'],
                'galileo': ['', '-', '.', '.'],
                'sabre': ['', '-', '/', '/'],
                'amadeus': ['', '-', ',', ','],
            },
            'special_class_types_lib': {
                'apollo': ['', '//@C',   '//@F',   '//@Y',   '//@W',   '//@P'],
                'sabre': ['', '¥TC-BB', '¥TC-FB', '¥TC-YB', '¥TC-SB', '¥TC-PB'],
            },
        };
        return ($lib[$type] || {})[$dialect] || [];
    }

    static replacesSymbolsFromLibInString($libName, $variable, $fromGds, $toGds)  {
        let $fromLib, $destLib;

        $fromLib = this.commandPartTranslationLibrary($libName, $fromGds);
        $destLib = this.commandPartTranslationLibrary($libName, $toGds);

        $variable = php.preg_replace('/\\'+$fromLib[1]+'/', $destLib[1], $variable);
        $variable = php.preg_replace('/\\'+$fromLib[2]+'/', $destLib[2], $variable);
        return {
            'variable': $variable,
            'status': 'OK',
        };
    }

    // Multiple segments Booking Class Rebook translation
    static translateSpecialClassesRebook($matches, $fromGds, $toGds)  {
        let $matchesRebook, $base, $numbers, $temp, $key, $number, $class, $variable;

        $matchesRebook = [];
        $base =  ($matches['class_list'] || {})[0] || '';
        if ($fromGds === 'apollo') {
            php.preg_match_all(/(?<segments>\d+)(?<classes>[A-Z])\+?/, $base, $matchesRebook = []);
        } else if ($fromGds === 'sabre') {
            php.preg_match_all(/(?<segments>\d+)(?<classes>[A-Z])\/?/, $base, $matchesRebook = []);
        } else if ($fromGds === 'amadeus') {
            php.preg_match_all(/(?<classes>[A-Z])(?<segments>\d+)\/?/, $base, $matchesRebook = []);
        }

        if ($fromGds === 'apollo') {
            $numbers = this.stringSegmentNumbersToArray(($matches['number_list'] || {})[0] || '');
            if (php.count($numbers) != php.count($matchesRebook['classes'])) {
                return {
                    'variable': '',
                    'status': 'fail',
                };
            }
        }

        $temp = [];
        for ([$key, $number] of Object.entries($matchesRebook['segments'] || [])) {
            $class = ($matchesRebook['classes'] || {})[$key] || '';
            if ($toGds === 'amadeus') {
                $temp.push($class+$number);
            } else {
                $temp.push($number+$class);
            }
        }

        if ($toGds === 'apollo') {
            $variable = php.implode('+', $matchesRebook['segments'])+'/0'+php.implode('+', $temp);
        } else {
            $variable = php.implode('/', $temp);
        }
        return {
            'variable': $variable,
            'status': 'OK',
        };
    }

    static stringSegmentNumbersToArray($numberList)  {
        let $list, $key, $number, $diapason, $i;

        $list = php.explode('+', $numberList);
        for ([$key, $number] of Object.entries($list)) {
            $diapason = php.explode('-', $number);
            if (php.isset($diapason[1])) {
               $list[$key] = $diapason[0];
                for ($i = $diapason[0]; $i < $diapason[1]; $i++) {
                    php.array_push($list, $i+1);
                }
            }}
        php.asort($list);
        return php.array_values($list);
    }

    // Makes list of classes from amadeus to other languages (apollo, sabre)
    static translateSpecialClasses($variable, $fromGds, $toGds)  {
        let $matches, $classes, $segNum, $class;

        $matches = [];
        if ($fromGds === 'amadeus') {
            php.preg_match(/(?<classes>[A-Z]+)(?<seg_num>\d+)$/, $variable, $matches = []);
            $classes = php.str_split($matches['classes'] || '');
            $segNum = php.intval($matches['seg_num'] || 1);
            $variable = '';
            for ($class of Object.values($classes)) {
                $variable += $class+$segNum++;}

        } else if ($toGds === 'amadeus') {
            php.preg_match_all(/((?<classes>[A-Z])(?<seg_num>\d+))/, $variable, $matches = []);
            $variable = '';
            for ($class of Object.values($matches['classes'] || [])) {
                $variable += $class;}
            $variable = php.isset($matches['seg_num'][0]) ? $variable+$matches['seg_num'][0] : '';
        }
        return {
            'variable': $variable,
            'status': 'OK',
        };
    }

    // Translation logic for segment numbers
    static translateSpecialMoveNumbers($variable, $fromGds, $toGds)  {

        if ($fromGds === 'amadeus') {
            $variable = php.preg_replace(/,/, '/', $variable);
        } else if ($toGds === 'amadeus') {
            $variable = php.preg_replace(/\//, ',', $variable);
        }
        if ($fromGds === 'galileo') {
            $variable = php.preg_replace(/S/, '/', $variable);
        } else if ($toGds === 'galileo') {
            $variable = php.preg_replace(/\//, 'S', $variable);
        }
        return {
            'variable': $variable,
            'status': 'OK',
        };
    }

    // Translation logic for segment numbers
    static translateSpecialRebookOneClass($matches, $fromGds, $toGds)  {
        let $numbers, $class, $classMatches, $libName, $numberData, $variable;

        $numbers = ($matches['numbers'] || {})[0] || '';
        $class = ($matches['class'] || {})[0] || '';
        if ($fromGds === 'sabre') {
            let parsed = SabCmdParser.parseChangeBookingClasses('WC' + $numbers);
            let clses = ((parsed || {}).segments || []).map(s => s.bookingClass);
            if (php.array_unique(clses).length > 1) {
                // check if there were different classes. Could not match
                // with regex since js does not support (?p=letter)
                return {variable: '', status: 'fail'};
            } else {
                $class = clses[0];
                $numbers = php.preg_replace(/[A-Z](?=\/|$)/, '', $numbers);
            }
        }

        $libName = 'special_rebook_segment_numbers';
        $numberData = this.replacesSymbolsFromLibInString($libName, $numbers, $fromGds, $toGds);
        $numbers = $numberData['variable'];

        if ($toGds === 'apollo') {
            $variable = $numbers+'/0'+$class;
        } else if ($toGds === 'galileo') {
            $variable = $numbers+'/'+$class;
        } else if ($toGds === 'sabre') {
            $numbers = php.preg_replace(/(?=\/|$)/, $class, $numbers);
            $variable = $numbers;
        } else if ($toGds === 'amadeus') {
            $variable = $class+$numbers;
        } else {
            $variable = ($matches[0] || {})[0] || '';
        }
        return {
            'variable': $variable,
            'status': 'OK',
        };
    }

    // Translation logic through partTranslationLibrary
    static translateVariablesWithLibraryKeys($variable, $key, $fromGds, $toGds)  {

        if ($fromGds === 'sabre' && $key === 'special_pricing_cabin_lib') {
            $variable = '¥'+php.trim($variable, '¥');
        }
        return {
            'variable': this.translateVariableWithPartLibrary($key, $variable, $fromGds, $toGds),
            'status': 'OK',
        };
    }

    // Translation logic for accompanied pax command
    static translateSpecialAccompaniedPax($variable, $fromGds, $toGds)  {

        if ($fromGds === 'apollo') {
            $variable = 'C05';
        } else if ($toGds === 'apollo') {
            $variable = 'ACC';
        }
        return {
            'variable': $variable,
            'status': 'OK',
        };
    }

    // Translation logic for pax order in ssr docs
    static translateSpecialPaxOrder($matches, $toGds)  {
        let $first_num, $second_num, $variable;

        $first_num = $matches['first_num'][0];
        $second_num = ($matches['second_num'] || {})[0] || 0;
        if ($toGds === 'sabre') {
            $variable = $first_num+'.'+($second_num == 0 ? 1 : $second_num);
        } else {
            $variable = $first_num;
        }

        return {
            'variable': $variable,
            'status': 'OK',
        };
    }

    // Translation logic for ticketing number
    static translateSpecialTicketNum($variable, $fromGds, $toGds)  {

        if ($fromGds === 'amadeus') {
            $variable = php.str_replace('-', '', $variable);
        } else if ($toGds === 'amadeus') {
            $variable = php.substr_replace($variable, '-', 3, 0);
        }
        return {
            'variable': $variable,
            'status': 'OK',
        };
    }

    // Translation logic for calculation
    static translateSpecialCalculation($variable, $fromGds, $toGds)  {

        if ($fromGds === 'apollo' || $fromGds === 'galileo') {
            $variable = php.str_replace('|', '+', $variable);
        }
        if ($fromGds === 'amadeus') {
            $variable = php.str_replace(';', '+', $variable);
        } else if ($toGds === 'amadeus') {
            $variable = php.str_replace('+', ';', $variable);
        }
        return {
            'variable': $variable,
            'status': 'OK',
        };
    }

    static translateSegmentStatus($status, $fromGds, $toGds)  {
        let $statusTypes, $statusType;

        $statusTypes = [
            {
                'apollo': 'SS',
                'galileo': 'SS',
                'sabre': 'NN',
                'amadeus': '',
            },
            {
                'apollo': 'LL',
                'galileo': 'LL',
                'sabre': 'LL',
                'amadeus': 'PE',
            },
            {
                'apollo': 'GK',
                'galileo': 'AK',
                'sabre': 'GK',
                'amadeus': 'GK',
            },
        ];
        for ($statusType of Object.values($statusTypes)) {
            if ($status === $statusType[$fromGds]) {
                return $statusType[$toGds] || '';
            }}
        return $status;
    }

    // Translation Segment status not exist in amadeus command
    static translateSpecialSegmentStatusWithComment($matches, $fromGds, $toGds)  {
        let $segmentStatus, $paxNumber, $comment;

        $segmentStatus = this.translateSegmentStatus(($matches['segment_status'] || {})[0] || '', $fromGds, $toGds);
        $paxNumber = ($matches['pax_num'] || {})[0] || '';

        $comment = '';
        if ($toGds === 'amadeus' && php.in_array($segmentStatus, ['GK', 'AK'])) {
            $comment = '/A';
        }

        return {
            'variable': $segmentStatus+$paxNumber+$comment,
            'status': 'OK',
        };
    }

    // Makes empty any digit in sabre
    static translateSpecialOnlyApolloDigit($variable, $toGds)  {

        if ($toGds === 'apollo') {
            $variable = php.empty($variable) ? '1' : $variable;
        } else {
            $variable = '';
        }

        return {
            'variable': $variable,
            'status': 'OK',
        };
    }

    // Makes empty location in sabre, and adds default in other dialects
    static translateSpecialAgencyLocation($variable, $toGds)  {

        if ($toGds === 'sabre') {
            $variable = '';
        } else if (php.empty($variable)) {
            $variable = 'SFO';
        }
        return {
            'variable': $variable,
            'status': 'OK',
        };
    }

    // Makes empty free_text in sabre and amadeus, and sets default in apollo
    static translateSpecialAgencyFreeText($variable, $toGds)  {

        if ($toGds === 'apollo' && php.empty($variable)) {
            $variable = ' ASAP CUSTOMER SUPPORT';
        } else {
            $variable = '';
        }
        return {
            'variable': $variable,
            'status': 'OK',
        };
    }

    static combineSpecialVariable($variableMatches, $keyName, $fromGds, $toGds)  {
        let $variable, $key, $typeFilter, $matches;

        $variable = $variableMatches[0] || '';
        $key = this.cleanNumberInVariableName($keyName);
        $typeFilter = this.specialVariableData($fromGds, $key)['get_types'];
        php.preg_match_all('#'+$typeFilter+'#', $variable, $matches = []);

        if (StringUtil.endsWith($key, '_lib')) {
            return this.translateVariablesWithLibraryKeys($variable, $key, $fromGds, $toGds);
        } else if ($key === 'special_rebook_segment_numbers') {
            return this.replacesSymbolsFromLibInString($key, $variable, $fromGds, $toGds);
        } else if ($key === 'special_segment_move_numbers') {
            return this.translateSpecialMoveNumbers($variable, $fromGds, $toGds);
        } else if ($key === 'special_rebook_one_class') {
            return this.translateSpecialRebookOneClass($matches, $fromGds, $toGds);
        } else if ($key === 'special_pax_order') {
            return this.translateSpecialPaxOrder($matches, $toGds);
        } else if ($key === 'special_ticket_num') {
            return this.translateSpecialTicketNum($variable, $fromGds, $toGds);
        } else if ($key === 'special_only_apollo_digit') {
            return this.translateSpecialOnlyApolloDigit($variable, $toGds);
        } else if ($key === 'special_agency_location') {
            return this.translateSpecialAgencyLocation($variable, $toGds);
        } else if ($key === 'special_agency_free_text') {
            return this.translateSpecialAgencyFreeText($variable, $toGds);
        } else if ($key === 'special_classes') {
            return this.translateSpecialClasses($variable, $fromGds, $toGds);
        } else if ($key === 'special_classes_rebook') {
            return this.translateSpecialClassesRebook($matches, $fromGds, $toGds);
        } else if ($key === 'special_ss_pax_comment') {
            return this.translateSpecialSegmentStatusWithComment($matches, $fromGds, $toGds);
        } else if ($key === 'special_calculation') {
            return this.translateSpecialCalculation($variable, $fromGds, $toGds);
        }
        return {
            'variable': $variable,
            'status': 'OK',
        };
    }

    static translateVariableWithPartLibrary($varName, $varValue, $fromGds, $toGds)  {
        let $possibleVariants, $varIndex;

        $possibleVariants = this.commandPartTranslationLibrary($varName, $fromGds);
        $varIndex = php.intval(php.array_search($varValue, $possibleVariants));
        return (this.commandPartTranslationLibrary($varName, $toGds) || {})[$varIndex] || '';
    }

    static cleanNumberInVariableName($key)  {
        let $keyData;

        if (php.preg_match(/(?<name>[a-z_]+)(?<order>\d*)/, $key, $keyData = [])) {
            return $keyData['name'];
        }
        return null;
    }

    static combineListVariable($variableArray, $varName, $dialect)  {
        let $listDataType = this.getListDataType($dialect, $varName);
        let $start = !$listDataType ? '' : $listDataType['start'];
        let $between = !$listDataType ? '' : $listDataType['between'];

        return $start+php.implode($between, $variableArray);
    }

    static getLegendElement($elementName)  {

        return (this.getLegendData() || {})[$elementName];
    }

    static getVariableRegex($key, $dialect, $name)  {
        let $type;

        if (StringUtil.startsWith($key, 'list_')) {
            $type = '(:?'+((this.getListDataType($dialect, $key) || {})['regex'] || '')+')+';
        } else if (StringUtil.startsWith($key, 'special_')) {
            $type = '(:?'+((this.specialVariableData($dialect, $key) || {})['getFull'] || '')+')';
        } else {
            $type = this.getLegendElement($key);
        }

        if ($type) {
            if ($name) {
                return '(?<'+$name+'>'+$type+')';
            } else {
                return $type;
            }
        }
        return null;
    }

    static translateVariable($key, $variableMatches, $from, $to)  {

        if ($from == $to) {
            return {
                'variable': $variableMatches[0],
                'status': 'OK',
            };
        } else if (StringUtil.startsWith($key, 'list_')) {
            return {
                'variable': this.combineListVariable($variableMatches, $key, $to),
                'status': 'OK',
            };
        } else if (StringUtil.startsWith($key, 'special_')) {
            return this.combineSpecialVariable($variableMatches, $key, $from, $to);
        } else {
            return {
                'variable': $variableMatches[0],
                'status': 'OK',
            };
        }
    }

}
module.exports = VariableTranslator;
