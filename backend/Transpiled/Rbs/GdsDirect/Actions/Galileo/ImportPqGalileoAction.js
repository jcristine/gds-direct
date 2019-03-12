
// namespace Rbs\GdsDirect\Actions\Galileo;

const CommandParser = require('../../../../Gds/Parsers/Galileo/CommandParser.js');

const php = require('../../../../php.js');
const CmsGalileoTerminal = require("../../GdsInterface/CmsGalileoTerminal");
class ImportPqGalileoAction
{
    static joinFullOutput($pagesLeft)  {
        let $fullDump, $dumpPage, $hasMorePages, $isLast;

        $fullDump = '';
        while ($dumpPage = php.array_shift($pagesLeft)) {
            $fullDump += $dumpPage;
            $hasMorePages = CmsGalileoTerminal.isScrollingAvailable($fullDump);
            $isLast = !$hasMorePages || !$pagesLeft;
            if (!$isLast) {
                $fullDump = CmsGalileoTerminal.trimScrollingIndicator($fullDump);
            } else {
                // remove "><", but preserve ")><" to determine that no more output
                if (!$hasMorePages) {
                    $fullDump = CmsGalileoTerminal.trimScrollingIndicator($fullDump);
                }
                break;
            }
        }
        return $fullDump;
    }

    static collectCmdToFullOutput($calledCommands)  {
        let $cachedCommands, $mrs, $cmdRecord, $logCmdType;

        $cachedCommands = [];
        $mrs = [];
        for ($cmdRecord of Object.values(php.array_reverse($calledCommands))) {
            php.array_unshift($mrs, $cmdRecord['output']);
            $logCmdType = CommandParser.parse($cmdRecord['cmd'])['type'];
            if ($logCmdType !== 'moveRest') {
                $cmdRecord['output'] = this.joinFullOutput($mrs);
                if (!CmsGalileoTerminal.isScrollingAvailable($cmdRecord['output'])) {
                    $cachedCommands[$cmdRecord['cmd']] = $cmdRecord['output'];
                }
                $mrs = [];
            }}
        return $cachedCommands;
    }
}
module.exports = ImportPqGalileoAction;
