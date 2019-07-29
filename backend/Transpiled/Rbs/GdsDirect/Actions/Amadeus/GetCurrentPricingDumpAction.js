

const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const AbstractGdsAction = require('../../../GdsAction/AbstractGdsAction.js');
const CommandParser = require('../../../../Gds/Parsers/Amadeus/CommandParser.js');
const PagingHelper = require('../../../../../GdsHelpers/AmadeusUtils.js');

/**
 * this action searches for current pricing command in command log and reuses all MD-s, MU-s,
 * MP FXP-es, etc..+ Amadeus allows us to continue scrolling pricing even if you called other
 * commands afterwards, that allows us to save at least one command when pricing is incomplete
 */
const php = require('../../../../phpDeprecated.js');
class GetCurrentPricingDumpAction extends AbstractGdsAction
{
    /**
     * @param $numToPage = [1 => ..., 2 => ..., 4 => ...]
     * @return Array [1 => ..., 2 => ...]
     */
    static cutInterrupted($numToPage)  {
        let $result, $from, $i, $page;

        $result = [];
        $from = ArrayUtil.getFirst(php.array_keys($numToPage));
        for ($i = 0; $i < php.count($numToPage); ++$i) {
            if ($page = $numToPage[+$from + $i]) {
                $result.push($page);
            } else {
                break;
            }
        }
        return $result;
    }

    static makeScrollAlias($pricingCmd)  {
        let $parsed, $baseCmd;

        $parsed = CommandParser.parse($pricingCmd);
        if ($parsed['type'] !== 'priceItinerary') {
            return null;
        }
        $baseCmd = $parsed['data']['baseCmd'];
        return ({
            'FXP': 'FXP',
            'FXX': 'FXP',
            'FXA': 'FXA',
            'FXL': 'FXL',
            'FXB': 'FXB',
            'FXR': 'FXB',
        } || {})[$baseCmd];
    }

    static getFetchedPageData($previousCommands)  {
        let $pricingCmd, $isInPricingMd, $pageNum, $pageCnt, $numToPage, $scrollCmds, $cmdRec, $cmd, $parsed, $pager, $scrollAlias;

        $pricingCmd = null;
        $isInPricingMd = false;
        $pageNum = 0;
        $pageCnt = 0;
        $numToPage = {};
        $scrollCmds = ['M', 'MD', 'MU', 'MP', 'MT', 'MB'];
        for ($cmdRec of Object.values($previousCommands)) {
            $cmd = $cmdRec['cmd'];
            $parsed = CommandParser.parse($cmd);
            $pager = PagingHelper.parseFxPager($cmdRec['output']);
            if (!$pager['hasPageMark']) {
                $isInPricingMd = false;
            } else {
                if ($parsed['type'] === 'priceItinerary') {
                    $pricingCmd = $cmd;
                    $isInPricingMd = true;
                    $pageCnt = $pager['pageCnt'];
                    $pageNum = +$pager['pageNum'];
                    $numToPage = {};
                    $numToPage[$pageNum] = $pager['content'];
                } else if ($isInPricingMd && php.in_array($cmd, $scrollCmds)) {
                    $pageNum = +$pager['pageNum'];
                    $numToPage[$pageNum] = $pager['content'];
                } else if ($pricingCmd) {
                    $scrollAlias = this.makeScrollAlias($pricingCmd);
                    if ($scrollAlias === php.substr($cmd, -3) &&
                        php.in_array(php.trim(php.substr($cmd, 0, -3)), $scrollCmds)
                    ) {
                        // MPFXA, MDFXX, MTFXL, ...
                        $isInPricingMd = true;
                        $pageNum = $pager['pageNum'];
                        $numToPage[$pageNum] = $pager['content'];
                    } else {
                        $isInPricingMd = false;
                    }
                } else {
                    $isInPricingMd = false;
                }
            }}

        return {
            'pricingCmd': $pricingCmd,
            'isInPricingMd': $isInPricingMd,
            'pageNum': $pageNum,
            'pageCnt': $pageCnt,
            'numToPage': $numToPage,
        };
    }

    /** @param $previousCommands = [['cmd' => ..., 'output' => ...], ...]; */
    async execute($previousCommands)  {
        let $pageData, $uninterrupted, $fetchedPart, $fullDump, $scrollAlias, $pages, $redisplayCmd, $lastPage, $pager, $i;

        $pageData = this.constructor.getFetchedPageData($previousCommands);
        $uninterrupted = this.constructor.cutInterrupted($pageData['numToPage']);
        $fetchedPart = php.implode(php.PHP_EOL, $uninterrupted);
        if (!$pageData['pricingCmd']) {
            return {'error': 'State changed since last pricing'};
        } else if (
            php.count($uninterrupted) === php.count($pageData['numToPage']) &&
            php.isset($pageData['numToPage'][$pageData['pageCnt']])
        ) {
            $fullDump = $fetchedPart;
        } else {
            $scrollAlias = this.constructor.makeScrollAlias($pageData['pricingCmd']);
            if (!$scrollAlias) {
                return {'error': 'Scrolling for '+$pageData['pricingCmd']+' format is not supported'};
            } else {
                // go to bottom and fetch rest pages with MU
                $pages = [];
                $redisplayCmd = 'MB'+$scrollAlias;
                $lastPage = (await this.runCmd($redisplayCmd)).output;
                $pager = PagingHelper.parseFxPager($lastPage);
                if (!$pager['hasPageMark']) {
                    return {'error': 'Failed to redisplay pricing with '+$redisplayCmd+' - '+$lastPage};
                } else {
                    php.array_unshift($pages, $pager['content']);
                    for ($i = $pageData['pageCnt'] - 1; $i > $pageData['pageNum']; --$i) {
                        $pager = PagingHelper.parseFxPager((await this.runCmd('MU')).output);
                        php.array_unshift($pages, $pager['content']);
                    }
                    $fullDump = $fetchedPart+php.PHP_EOL+php.implode(php.PHP_EOL, $pages);
                }
            }
        }

        return {'cmd': $pageData['pricingCmd'], 'output': $fullDump};
    }
}
module.exports = GetCurrentPricingDumpAction;
