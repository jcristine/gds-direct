
// namespace Rbs\GdsDirect;

const StringUtil = require('../../Lib/Utils/StringUtil.js');
const Errors = require("./Errors");

let php = require('../../php.js');
const CmsClient = require("../../../IqClients/CmsClient");

/**
 * provides functions that process generalized data from any GDS
 */
class CommonDataHelper
{
    static getTicketingCommands()  {
        return [
            'issueTickets', 'voidTicket', 'exchangeTicket', 'refundTicket', 'changeTickets',
            'unvoidPaperTicket', 'revalidateTicket',
        ];
    }

    static getQueueCommands()  {
        return [
            'openQueue', 'queueOperation', 'leaveQueue', 'removeFromQueue', 'movePnrToPccQueue',
            'movePnrToQueue', 'queueCount', 'ignoreMoveToQueue', 'queueRecordLocators',
        ];
    }

    static getCountedFsCommands()  {
        return ['lowFareSearch', 'lowFareSearchFromPnr', 'lowFareSearchUnclassified'];
    }

    static getTotallyForbiddenCommands()  {
        return [
            'signIn', 'signOut', 'createAgent', 'branchTo', 'agentList', 'lniataList',
            'storePnrSendEmail', 'showSessionToken',
        ];
    }

    static shouldAddCreationRemark($msg, $cmdLog)  {
        let $sessionData, $commands, $cmdRecord, $parsed, $flatCmds, $flatCmd;
        $sessionData = $cmdLog.getSessionData();
        if ($sessionData['is_pnr_stored']) {
            return false;
        }
        $commands = $cmdLog.getCurrentPnrCommands();
        for ($cmdRecord of Object.values($commands)) {
            $parsed = this.getParsedCommand($sessionData['gds'], $cmdRecord['cmd_performed']);
            $flatCmds = php.array_merge([$parsed], $parsed['followingCommands']);
            for ($flatCmd of Object.values($flatCmds)) {
                if ($flatCmd['type'] === 'addRemark' && $flatCmd['data'] === $msg) {
                    return false;
                }}}
        return true;
    }

    /** @param stateful = await require('StatefulSession.js')() */
    static async createCredentialMessage(stateful)  {
        let $leadData = stateful.getLeadData();
        if ($leadData.leadId) {
            let cmsData = await CmsClient.getRequestBriefData({requestId: $leadData.leadId})
                .then(rpcRs => rpcRs.result.data).catch(() => ({}));
            $leadData.leadOwnerId = cmsData.leadOwnerId;
        }

        let $agent = stateful.getAgent();
        let $leadAgent = stateful.getLeadAgent();
        let $maxLen, $leadPart, $pattern, $minLen;
        $maxLen = {
            'apollo': 87 - php.strlen('@:5'),
            'galileo': 87,
            // 71 is limit for whole remark command: >5MSG LIMIT IS 70; >53¤MSG LIMIT IS 68;
            'sabre': 71 - php.strlen('5'),
            'amadeus': 126 - php.strlen('RM'),
        }[stateful.gds];
        $leadPart = php.empty($leadData['leadId']) ? '' : (
            ($agent.canSavePnrWithoutLead() ? '' : /FOR {leadAgent}/+($leadData['leadOwnerId'] || ''))+
            '/LEAD-'+$leadData['leadId']
        );
        if ($agent.getLogin()) {
            // if you make changes here, please also update
            // Common\GenericRemarkParser::parseCmsLeadRemark()
            $pattern = php.implode('', [
                'GD-',
                '{pnrAgent}',
                '/'+$agent.getId(),
                $leadPart,
                ' IN '+stateful.getSessionData().pcc,
            ]);
            $minLen = php.mb_strlen(StringUtil.format($pattern, {
                'pnrAgent': '', 'leadAgent': '',
            }));
            return php.strtoupper(StringUtil.format($pattern, {
                'pnrAgent': php.mb_substr($agent.getLogin(), 0, php.floor(($maxLen - $minLen) / 2)),
                'leadAgent': php.mb_substr($leadAgent ? $leadAgent.getLogin() : 'AGENT', 0, php.floor(($maxLen - $minLen) / 2)),
            }));
        }
        throw new Error('Not found agent');
    }

    static checkSeatCount($pnr)  {
        let $errors, $passengerCount, $pax, $itinerary, $segment;
        $errors = [];
        $passengerCount = 0;
        for ($pax of Object.values($pnr.getPassengers())) {
            if (!$pax['nameNumber']['isInfant']) {
                $passengerCount++;
            }}
        if ($passengerCount === 0) {
            $errors.push(Errors.getMessage(Errors.NO_NAMES_IN_PNR));
        } else if (!($itinerary = $pnr.getItinerary())) {
            $errors.push(Errors.getMessage(Errors.ITINERARY_IS_EMPTY));
        } else {
            for ($segment of Object.values($itinerary)) {
                if ($segment['seatCount'] != $passengerCount) {
                    $errors.push(Errors.getMessage(Errors.WRONG_SEAT_COUNT, {
                        'seatCount': $segment['seatCount'],
                        'nameCount': $passengerCount,
                    }));
                    break;
                }}
        }
        return $errors;
    }

    /**
     * before:
     * '   6 SSRCTCEQRHK1/VANIASDANDEY//YAHOO+COM-1PANDEY/DEVENDRA'
     * '   7 SSRCTCMQRHK1/15123456627-1PANDEY/DEVENDRA'
     * after:
     * '   6 SSRCTCEQRHK1/XXXXXXXXXXXY//YAHOO+COM-1PANDEY/DEVENDRA'
     * '   7 SSRCTCMQRHK1/XXXXXXXXX27-1PANDEY/DEVENDRA'
     */
    static maskSsrContactInfo($output, $lettersShown = 1, $digitsShown = 2)  {
        let $lines, $line, $lineNumber, $ssrStart, $emailRegex, $phoneRegex, $matches, $_, $prefix, $masked, $postfix;
        $lines = [];
        for ($line of Object.values(StringUtil.lines($output))) {
            $lineNumber = '(?:\\s*\\d+|GFAX-)\\.?\\s*';
            $ssrStart = '(?:[A-Z0-9]{2})?\\s*(?:[A-Z]{2}\\d+)?\\s*[\\\/\\s]';
            $emailRegex = '/^('+$lineNumber+'SSR\\s*CTCE\\s*'+$ssrStart+')(.+?)(\\S{'+$lettersShown+'}\\\/\\\/.*|)$/';
            $phoneRegex = '/^('+$lineNumber+'SSR\\s*CTCM\\s*'+$ssrStart+')(.+)(\\d{'+$digitsShown+'}.*)$/';
            if (php.preg_match($emailRegex, $line, $matches = [])) {
                [$_, $prefix, $masked, $postfix] = $matches;
                $line = $prefix+php.preg_replace(/./, 'X', $masked)+$postfix;
            }
            if (php.preg_match($phoneRegex, $line, $matches = [])) {
                [$_, $prefix, $masked, $postfix] = $matches;
                $line = $prefix+php.preg_replace(/./, 'X', $masked)+$postfix;
            }
            $lines.push($line);}
        return php.implode(php.PHP_EOL, $lines);
    }

    static isValidPnr($pnr)  {
        if (
            $pnr.hasItinerary() ||
            !php.empty($pnr.getPassengers()) ||
            !php.empty($pnr.getRecordLocator())
        ) {
            return true;
        }
        return false;
    }

    static getParsedCommand($gds, $cmd)  {
        return GdsDirect.makeGdsInterface($gds).parseCommand($cmd);
    }

    static getCommandType($gds, $cmd)  {
        return CommonDataHelper.getParsedCommand($gds, $cmd)['type'];
    }
}
module.exports = CommonDataHelper;
