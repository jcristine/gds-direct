

const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const php = require('../../../../phpDeprecated.js');
const TicketListParser = require("./TicketListParser");
const TicketParser = require("./TicketParser");

/**
 * Parses output of *HTE format, which is either a single ticket or a list of
 * tickets in the PNR
 */
class HteParser
{
	static parse($dump)  {
		let $lines, $firstLine, $type, $result;

		$dump = StringUtil.wrapLinesAt($dump, 64);
		$lines = StringUtil.lines($dump);
		$firstLine = ArrayUtil.getFirst($lines);
		if (php.trim($firstLine) == 'ELECTRONIC TICKET LIST BY *HTE') {
			$type = this.TICKET_LIST;
			$result = TicketListParser.parse($dump);
		} else {
			$type = this.SINGLE_TICKET;
			$result = TicketParser.parse($dump);
		}
		if (php.empty($result['error'])) {
			return {'type': $type, 'result': $result};
		} else {
			return {'error': $result['error'], 'errorType': $result['errorType']};
		}
	}
}
HteParser.SINGLE_TICKET = 'SINGLE_TICKET';
HteParser.TICKET_LIST = 'TICKET_LIST';
module.exports = HteParser;
