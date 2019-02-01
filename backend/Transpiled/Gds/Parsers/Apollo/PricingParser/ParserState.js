
// namespace Gds\Parsers\Apollo\PricingParser;

class ParserState
{
}
ParserState.DUMP_START = 0;
ParserState.FARE_CONSTRUCTION_MARKER_FOUND = 1;
ParserState.FARE_CONSTRUCTION_FOUND = 2;
ParserState.BAGGAGE_ALLOWANCE_START_LINE_FOUND = 3;
ParserState.BAGGAGE_ALLOWANCE_BLOCK_ENDED = 4;
ParserState.COMMAND_COPY_START_FOUND = 5;

module.exports = ParserState;
