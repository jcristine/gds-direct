
// namespace Gds\Parsers\Apollo\BaggageAllowanceParser\BagLineParser;

let php = require('../../../../../php');

class NextToken
{
    static matchBagNumber($text)  {
        let $tokens;
        $tokens = [];
        if (php.preg_match(/^   BAG (\d) -  (.*)$/, $text, $tokens = [])) {
            return {
                'bagNumber': $tokens[1],
                'textLeft': $tokens[2],
            };
        } else {
            return false;
        }
    }

    static matchChangesMayApplyDisclaimer($text)  {
        let $tokens;
        $tokens = [];
        if (php.preg_match(/^CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE(.*)$/, $text, $tokens = [])) {
            return {
                'textLeft': $tokens[1],
            };
        } else {
            return false;
        }
    }

    static matchFeeToken($text)  {
        let $feeText, $textLeft, $tokens;
        $feeText = php.substr($text, 0, 13);
        $textLeft = php.substr($text, 13);
        $tokens = [];
        if (php.trim($feeText) == 'NO FEE') {
            return {
                'noFeeFlag': true,
                'feeAmount': null,
                'feeCurrency': null,
                'textLeft': $textLeft,
            };
        } else if (php.preg_match(/^(\d+)(\.\d+)?\s([A-Z]{3})/, php.trim($feeText), $tokens = [])) {
            return {
                'noFeeFlag': false,
                'feeAmount': $tokens[1]+$tokens[2],
                'feeCurrency': $tokens[3],
                'textLeft': $textLeft,
            };
        } else {
            return false;
        }
    }

    static matchPersonalItemToken($text)  {
        let $tokens;
        $tokens = [];
        if (php.preg_match(/^PERSONAL ITEM(.*)$/, $text, $tokens = [])) {
            return {
                'description': 'PERSONAL ITEM',
                'textLeft': $tokens[1],
            };
        } else {
            return false;
        }
    }

    static matchBaggageChargesDataNotAvailableToken($text)  {
        let $tokens;
        $tokens = [];
        if (php.preg_match(/^BAGGAGE CHARGES DATA NOT AVAILABLE(.*)$/, $text, $tokens = [])) {
            return {
                'description': 'BAGGAGE CHARGES DATA NOT AVAILABLE',
                'textLeft': $tokens[1],
            };
        } else {
            return false;
        }
    }

    static matchNotPermittedToken($text)  {
        let $tokens;
        $tokens = [];
        if (php.preg_match(/^NOT PERMITTED - SEE EMBARGO BELOW(.*)$/, $text, $tokens = [])) {
            return {
                'description': 'NOT PERMITTED - SEE EMBARGO BELOW',
                'textLeft': $tokens[1],
            };
        } else {
            return false;
        }
    }

    static matchExtraHandBaggageToken($text)  {
        let $tokens;
        $tokens = [];
        if (php.preg_match(/^EXTRA HAND BAGGAGE(.*)$/, $text, $tokens = [])) {
            return {
                'description': 'EXTRA HAND BAGGAGE',
                'textLeft': $tokens[1],
            };
        } else {
            return false;
        }
    }

    static matchExcessPieceToken($text)  {
        let $tokens;
        $tokens = [];
        if (php.preg_match(/^EXCESS PIECE(.*)$/, $text, $tokens = [])) {
            return {
                'description': 'EXCESS PIECE',
                'textLeft': $tokens[1],
            };
        } else {
            return false;
        }
    }

    static matchCarryonBaggageAllowanceToken($text)  {
        let $tokens;
        $tokens = [];
        if (php.preg_match(/^CARRYON HAND BAGGAGE ALLOWANCE(.*)$/, $text, $tokens = [])) {
            return {
                'description': 'CARRYON HAND BAGGAGE ALLOWANCE',
                'textLeft': $tokens[1],
            };
        } else if (php.preg_match(/^CARRY ON HAND BAGGAGE(.*)$/, $text, $tokens = [])) {
            return {
                'description': 'CARRY ON HAND BAGGAGE',
                'textLeft': $tokens[1],
            };
        } else {
            return false;
        }
    }

    static matchCarryOnPersonalItemsToken($text)  {
        let $tokens;
        $tokens = [];
        if (php.preg_match(/^CARRY ON PERSONAL ITEMS(.*)$/, $text, $tokens = [])) {
            return {
                'description': 'CARRY ON PERSONAL ITEMS',
                'textLeft': $tokens[1],
            };
        } else if (php.preg_match(/^CARRY ON PERSONAL ITEM(.*)$/, $text, $tokens = [])) {
            return {
                'description': 'CARRY ON PERSONAL ITEM',
                'textLeft': $tokens[1],
            };
        } else {
            return false;
        }
    }

    static matchSizeConstraintsToken($text)  {
        let $tokens, $_, $l, $w, $h, $left;
        $tokens = [];
        if (php.preg_match(/^\s*(OVER|CARRY|UPTO|MAX)(\d+)(LI|IN)(\/| )(\d+)(LCM|CM|LC)(.*)$/, $text, $tokens = [])) {
            // 'UPTO62LI/158LCM'
            return {
                'sizeInInches': $tokens[2],
                'sizeInCm': $tokens[5],
                'textLeft': $tokens[7],
            };
        } else if (php.preg_match(/^\s*(OVER|CARRY|UPTO|MAX)(\d+)(LI|IN)(.*)$/, $text, $tokens = [])) {
            return {
                'sizeInInches': $tokens[2],
                'textLeft': $tokens[4],
            };
        } else if (php.preg_match(/^\s*(OVER|CARRY|UPTO|MAX)(\d+)(LCM|CM|LC)(.*)$/, $text, $tokens = [])) {
            return {
                'sizeInCm': $tokens[2],
                'textLeft': $tokens[4],
            };
        } else if (php.preg_match(/^\s*(\d*\.?\d+)L\s*X?\s*(\d*\.?\d+)W\s*X?\s*(\d*\.?\d+)H(.*)$/, $text, $tokens = [])) {
            // '55L X 40W X 25H'
            [$_, $l, $w, $h, $left] = $tokens;
            return {
                'sizeInCm': +$l + +$w + +$h, // linear centimeters
                'length': $l,
                'width': $w,
                'height': $h,
                'textLeft': $left,
            };
        } else {
            return false;
        }
    }

    static matchWeightConstraintsToken($text)  {
        let $tokens;
        $tokens = [];
        if (php.preg_match(/^\s*(OVER|CARRY|UPTO|MAX)(\d+)LB(\/| )(\d+)KG(.*)$/, $text, $tokens = [])) {
            return {
                'weightInLb': $tokens[2],
                'weightInKg': $tokens[4],
                'textLeft': $tokens[5],
            };
        } else if (php.preg_match(/^\s*(OVER|CARRY|UPTO|MAX)(\d+)KG(\/| )(\d+)LB(.*)$/, $text, $tokens = [])) {
            return {
                'weightInLb': $tokens[2],
                'weightInKg': $tokens[4],
                'textLeft': $tokens[5],
            };
        } else if (php.preg_match(/^\s*(OVER|CARRY|UPTO|MAX)(\d+)LB(.*)$/, $text, $tokens = [])) {
            return {
                'weightInLb': $tokens[2],
                'weightInKg': null,
                'textLeft': $tokens[3],
            };
        } else if (php.preg_match(/^\s*(OVER|CARRY|UPTO|MAX)(\d+)KG(.*)$/, $text, $tokens = [])) {
            return {
                'weightInLb': $tokens[2],
                'weightInKg': null,
                'textLeft': $tokens[3],
            };
        } else {
            return false;
        }
    }

    static matchAndToken($text)  {
        let $tokens;
        $tokens = [];
        if (php.preg_match(/^ AND (.*)$/, $text, $tokens = [])) {
            return {
                'textLeft': $tokens[1],
            };
        } else {
            return false;
        }
    }

    static matchEndOfLine($text)  {
        let $tokens;
        $tokens = [];
        if (!php.trim($text)) {
            return true;
        } else {
            return false;
        }
    }
}
module.exports = NextToken;
