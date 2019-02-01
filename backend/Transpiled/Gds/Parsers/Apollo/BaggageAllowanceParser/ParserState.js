
// namespace Gds\Parsers\Apollo\BaggageAllowanceParser;

class ParserState
{
}
ParserState.START = 0;
ParserState.BA_BLOCK_START_LINE_FOUND = 1;
ParserState.PASSENGER_TYPE_LINE_FOUND = 2;
ParserState.BA_BLOCK_SPECIFIC_SEGMENT_LINE_FOUND = 3;
ParserState.BAGGAGE_DISCOUNTS_DISCLAIMER_FOUND = 4;
ParserState.CARRYON_ALLOWANCE_BLOCK_START_LINE_FOUND = 5;
ParserState.EMBARGO_BLOCK_START_LINE_FOUND = 6;

module.exports = ParserState;
