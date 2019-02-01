
// namespace Gds\Parsers\Apollo\BaggageAllowanceParser\BagLineParser;

const NextToken = require("./NextToken");
const ParserState = require("./ParserState");
const php = require('../../../../../php');

class BaggageAllowanceParserBagLineException extends Error
{
}
module.exports = BaggageAllowanceParserBagLineException;
class BaggageAllowanceParserBagLineUnexpectedTokenException extends BaggageAllowanceParserBagLineException
{
}
module.exports = BaggageAllowanceParserBagLineUnexpectedTokenException;

class BagLineParser
{
    // '   BAG 2 -  0.0 MDL      PET IN CABIN                     ',
    // '   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   ',
    // '   BAG 1 -  NO FEE       UPTO22LB/10KG AND UPTO45LI/115LCM',
    // '   BAG 1 -  NO FEE       UPTO22LB/10KG AND 55L X 40W X 25H',
    static parse($text, $structureWriter)  {
        let $state, $res;
        $state = ParserState.START;
        while (true) {
            if ($state == ParserState.START) {
                if ($res = NextToken.matchBagNumber($text)) {
                    $structureWriter.bagNumberFound($res);
                    $state = ParserState.BAG_NUBER_FOUND;
                    $text = $res['textLeft'];
                } else {
                    throw new BaggageAllowanceParserBagLineUnexpectedTokenException($text);
                }
            } else if ($state == ParserState.BAG_NUBER_FOUND) {
                if ($res = NextToken.matchChangesMayApplyDisclaimer($text)) {
                    $structureWriter.chargesMayApplyDisclaimerFound($res);
                    $state = ParserState.CHANGES_MAY_APPLY_DISCLAIMER_FOUND;
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchBaggageChargesDataNotAvailableToken($text)) {
                    $structureWriter.baggageChargesDataNotAvailableTokenFound($res);
                    $state = ParserState.BAGGAGE_CHARGES_DATA_NOT_AVAILABLE_TOKEN_FOUND;
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchNotPermittedToken($text)) {
                    $structureWriter.notPermittedTokenFound($res);
                    $state = ParserState.NOT_PERMITTED_TOKEN_FOUND;
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchFeeToken($text)) {
                    $structureWriter.feeTokenFound($res);
                    $state = ParserState.FEE_TOKEN_FOUND;
                    $text = $res['textLeft'];
                } else {
                    throw new BaggageAllowanceParserBagLineUnexpectedTokenException($text);
                }
            } else if ($state == ParserState.FEE_TOKEN_FOUND) {
                if ($res = NextToken.matchPersonalItemToken($text)) {
                    $structureWriter.personalItemFound($res);
                    $state = ParserState.PERSONAL_ITEM_TOKEN_FOUND;
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchCarryonBaggageAllowanceToken($text)) {
                    $structureWriter.carryOnBaggageAllowanceTokenFound($res);
                    $state = ParserState.CARRYON_BAGGAGE_ALLOWANCE_TOKEN_FOUND;
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchCarryOnPersonalItemsToken($text)) {
                    $structureWriter.carryOnPersonalItemsTokenFound($res);
                    $state = ParserState.CARRY_ON_PERSONAL_ITEMS_TOKEN_FOUND;
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchExcessPieceToken($text)) {
                    $structureWriter.excessPieceTokenFound($res);
                    $state = ParserState.EXCESS_PIECE_TOKEN_FOUND;
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchExtraHandBaggageToken($text)) {
                    $structureWriter.extraHandBaggageTokenFound($res);
                    $state = ParserState.EXTRA_HAND_BAGGAGE_TOKEN_FOUND;
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchSizeConstraintsToken($text)) {
                    $structureWriter.sizeConstraintsTokenFound($res);
                    $state = ParserState.FIRST_SIZE_OR_WEIGHT_CONSTRAINTS_TOKEN_FOUND;
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchWeightConstraintsToken($text)) {
                    $structureWriter.weightConstraintsTokenFound($res);
                    $state = ParserState.FIRST_SIZE_OR_WEIGHT_CONSTRAINTS_TOKEN_FOUND;
                    $text = $res['textLeft'];
                } else {
                    $structureWriter.unclassifiedBagDescriptionFound(php.trim($text));
                    $state = ParserState.UNCLASSIFIED_DESCRIPTION_FOUND;
                    $text = '';
                }
            } else if ($state == ParserState.FIRST_SIZE_OR_WEIGHT_CONSTRAINTS_TOKEN_FOUND) {
                if ($res = NextToken.matchEndOfLine($text)) {
                    break;
                } else if ($res = NextToken.matchAndToken($text)) {
                    $state = ParserState.AND_TOKEN_FOUND;
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchSizeConstraintsToken($text)) {
                    $structureWriter.sizeConstraintsTokenFound($res);
                    $state = ParserState.SECOND_SIZE_OR_WEIGHT_CONSTRAINTS_TOKEN_FOUND;
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchWeightConstraintsToken($text)) {
                    $structureWriter.weightConstraintsTokenFound($res);
                    $state = ParserState.SECOND_SIZE_OR_WEIGHT_CONSTRAINTS_TOKEN_FOUND;
                    $text = $res['textLeft'];
                } else {
                    throw new BaggageAllowanceParserBagLineUnexpectedTokenException($text);
                }
            } else if ($state == ParserState.AND_TOKEN_FOUND) {
                if ($res = NextToken.matchSizeConstraintsToken($text)) {
                    $structureWriter.sizeConstraintsTokenFound($res);
                    $state = ParserState.SECOND_SIZE_OR_WEIGHT_CONSTRAINTS_TOKEN_FOUND;
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchWeightConstraintsToken($text)) {
                    $structureWriter.weightConstraintsTokenFound($res);
                    $state = ParserState.SECOND_SIZE_OR_WEIGHT_CONSTRAINTS_TOKEN_FOUND;
                    $text = $res['textLeft'];
                } else {
                    throw new BaggageAllowanceParserBagLineUnexpectedTokenException($text);
                }
            } else if ($state == ParserState.CHANGES_MAY_APPLY_DISCLAIMER_FOUND ||
                    $state == ParserState.PERSONAL_ITEM_TOKEN_FOUND ||
                    $state == ParserState.CARRYON_BAGGAGE_ALLOWANCE_TOKEN_FOUND ||
                    $state == ParserState.CARRY_ON_PERSONAL_ITEMS_TOKEN_FOUND ||
                    $state == ParserState.BAGGAGE_CHARGES_DATA_NOT_AVAILABLE_TOKEN_FOUND ||
                    $state == ParserState.NOT_PERMITTED_TOKEN_FOUND ||
                    $state == ParserState.EXTRA_HAND_BAGGAGE_TOKEN_FOUND ||
                    $state == ParserState.EXCESS_PIECE_TOKEN_FOUND ||
                    $state == ParserState.UNCLASSIFIED_DESCRIPTION_FOUND ||
                    $state == ParserState.SECOND_SIZE_OR_WEIGHT_CONSTRAINTS_TOKEN_FOUND) {
                break;
            }
        }
        return $structureWriter.getStructure();
    }
}
module.exports = BagLineParser;
