
// namespace Gds\Parsers\Apollo\BaggageAllowanceParser;

const BaggageAllowanceParserDataStructureWriter = require("./BaggageAllowanceParserDataStructureWriter");
const NextToken = require("./NextToken");
const ParserState = require("./ParserState");
const php = require('../../../../php');

class BaggageAllowanceParserException extends Error
{
}
module.exports = BaggageAllowanceParserException;
class BaggageAllowanceParserUnexpectedTokenException extends BaggageAllowanceParserException
{
}
module.exports = BaggageAllowanceParserUnexpectedTokenException;

/*
 * BA stands for Baggage Allowance, since it is used in parser so often
 */
class BaggageAllowanceParser
{
    static parse($text, $structureWriter)  {
        let $structureWritert, $state, $res;
        $structureWriter = $structureWritert || BaggageAllowanceParserDataStructureWriter.make();
        $state = ParserState.START;
        while (true) {
            if ($state == ParserState.START) {
                if ($res = NextToken.matchBaBlockStartLine($text)) {
                    $structureWriter.baBlockStartLineFound($res);
                    $state = ParserState.BA_BLOCK_START_LINE_FOUND;
                    $text = $res['textLeft'];
                } else {
                    throw new BaggageAllowanceParserUnexpectedTokenException('At ' + $state + ' - ' + $text);
                }
            } else if ($state == ParserState.BA_BLOCK_START_LINE_FOUND) {
                if ($res = NextToken.matchPassengerTypeLine($text)) {
                    $structureWriter.passengerTypeLineFound($res);
                    $state = ParserState.PASSENGER_TYPE_LINE_FOUND;
                    $text = $res['textLeft'];
                } else {
                    throw new BaggageAllowanceParserUnexpectedTokenException('At ' + $state + ' - ' + $text);
                }
            } else if ($state == ParserState.PASSENGER_TYPE_LINE_FOUND) {
                if ($res = NextToken.matchBaBlockSpecificSegmentLine($text)) {
                    $structureWriter.baBlockSpecificSegmentLineFound($res);
                    $state = ParserState.BA_BLOCK_SPECIFIC_SEGMENT_LINE_FOUND;
                    $text = $res['textLeft'];
                } else {
                    throw new BaggageAllowanceParserUnexpectedTokenException('At ' + $state + ' - ' + $text);
                }
            } else if ($state == ParserState.BA_BLOCK_SPECIFIC_SEGMENT_LINE_FOUND) {
                if ($res = NextToken.matchBaBlockBagLine($text)) {
                    $structureWriter.baBlockBagLineFound($res);
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchBaBlockCarryOnLine($text)) {
                    $structureWriter.baBlockCarryOnLineFound($res);
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchBaBlockMyTripAndMoreLinkLine($text)) {
                    $structureWriter.baBlockMyTripAndMoreLinkLineFound($res);
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchEmptyLine($text)) {
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchBaBlockSpecificSegmentLine($text)) {
                    $structureWriter.baBlockSpecificSegmentLineFound($res);
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchBaggageDiscountsDisclaimer($text)) {
                    $structureWriter.baggageDiscountsDisclaimerFound($res);
                    $state = ParserState.BAGGAGE_DISCOUNTS_DISCLAIMER_FOUND;
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchCarryOnAllowanceBlockStartLine($text)) {
                    $structureWriter.carryOnAllowanceBlockStartLineFound($res);
                    $state = ParserState.CARRYON_ALLOWANCE_BLOCK_START_LINE_FOUND;
                    $text = $res['textLeft'];
                } else if (!php.trim($text)) {
                    break;
                } else {
                    throw new BaggageAllowanceParserUnexpectedTokenException('At ' + $state + ' - ' + $text);
                }
            } else if ($state == ParserState.CARRYON_ALLOWANCE_BLOCK_START_LINE_FOUND) {
                if ($res = NextToken.matchCarryOnBlockSpecificSegmentLine($text)) {
                    $structureWriter.carryOnBlockSpecificSegmentLineFound($res);
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchBdbfLine($text)) {
                    // do nothing since nobody knows what it is
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchCarryOnBlockBagLine($text)) {
                    $structureWriter.carryOnBlockBagLineFound($res);
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchBaggageDiscountsDisclaimer($text)) {
                    $structureWriter.baggageDiscountsDisclaimerFound($res);
                    $state = ParserState.BAGGAGE_DISCOUNTS_DISCLAIMER_FOUND;
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchEmbargoBlockStartLine($text)) {
                    $structureWriter.embargoBlockStartLineFound($res);
                    $state = ParserState.EMBARGO_BLOCK_START_LINE_FOUND;
                    $text = $res['textLeft'];
                } else if (!php.trim($text)) {
                    break;
                } else if ($res = NextToken.matchEmptyLine($text)) {
                    $text = $res['textLeft'];
                } else {
                    throw new BaggageAllowanceParserUnexpectedTokenException('At ' + $state + ' - ' + $text);
                }
            } else if ($state == ParserState.EMBARGO_BLOCK_START_LINE_FOUND) {
                if ($res = NextToken.matchEmbargoSpecificSegmentUrlLine($text)) {
                    $structureWriter.embargoSpecificSegmentUrlLineFound($res);
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchBaggageDiscountsDisclaimer($text)) {
                    $structureWriter.baggageDiscountsDisclaimerFound($res);
                    $state = ParserState.BAGGAGE_DISCOUNTS_DISCLAIMER_FOUND;
                    $text = $res['textLeft'];
                } else if ($res = NextToken.matchEmptyLine($text)) {
                    $text = $res['textLeft'];
                } else if (!php.trim($text)) {
                    break;
                } else {
                    throw new BaggageAllowanceParserUnexpectedTokenException('At ' + $state + ' - ' + $text);
                }
            } else if ($state == ParserState.BAGGAGE_DISCOUNTS_DISCLAIMER_FOUND) {
                if (!php.trim($text)) {
                    break;
                } else {
                    throw new BaggageAllowanceParserUnexpectedTokenException('At ' + $state + ' - ' + $text);
                }
            }
        }
        return $structureWriter.getStructure();
    }
}
module.exports = BaggageAllowanceParser;
