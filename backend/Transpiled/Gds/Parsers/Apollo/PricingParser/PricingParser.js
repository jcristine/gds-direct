/**
 * Meant to parse stuff like $B, T:V+
 * Tested specifically on few $B:N examples, so you should perceive it as
 * "$B:N Parser" or rewrite that comment+
 * Problem with $B/T:V parsers is that we already have some, but these are
 * very ad-hoc solutions serving some specific purpose and most like
 * written without having the full image of it in mind+ E+g+
 *   class/ApolloIntegration/ApolloSimplePricingParser+php
 *   class/ApolloIntegration/ApolloParsers/StoredPriceValidationParser+php
 *
 * Next thing is that quite significant part of $B output is fare
 * construction, the same thing that we can find in *LF, so by now we also
 * have things like
 *   class/ApolloIntegration/ApolloLinearFareParser+php
 * which aren't even really LF parsers, but more like preprocessors for
 * retrieving FC text from some more verbose command output+
 *
 * By the way, FC parser is quite complicated one+
 *
 * Now, the real problem is that it seams that we cannot just split $B
 * output on logical parts without actually parsing FC+
 *
 * So, this parser strives for being quite complete $B parser, but is
 * probably less efficient than those specific parsers mentioned above for
 * their purpose+ Hence, I leave them be and write new parser+
 */

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const PricingStructureWriter = require('../../../../Gds/Parsers/Apollo/PricingParser/DataStructureWriters/PricingStructureWriter.js');
const NextToken = require("./NextToken");
const ParserState = require("./ParserState");
const php = require('klesun-node-tools/src/Transpiled/php.js');

class PricingParser
{
//    public static function fetchFareBasisListFromStructure(array $parsedDump)
//    {
//        $fetchBasisListWithDefault = function(array $b) {
//            return is_array($b['basis']) ? $b['basis'] : [];
//        };
//
//        return array_unique(
//            \ArrayUtil::arrayConcat(
//                \Fp::map($fetchBasisListWithDefault,
//                    \ArrayUtil::arrayConcat(
//                        \Fp::map(\Fp::makeFetchElementLambda('segments'),
//                            \Fp::map(\Fp::makeFetchElementLambda('fareConstruction'), $parsedDump['pricingBlockList']))))));
//    }

	static preprocessDump($text)  {
		$text = StringUtil.wrapLinesAt($text, 64);
		$text = php.implode(php.PHP_EOL, StringUtil.lines($text));
		return $text;
	}

	static parse($text, $structureWriter)  {
		let $state, $commandLinesEnded, $res, $nonCommandLinesFound, $matches, $lines, $line;
		$structureWriter = $structureWriter || PricingStructureWriter.make();
		$state = ParserState.DUMP_START;
		$text = this.preprocessDump($text);
		$commandLinesEnded = false;
		while (true) {
			let match;
			if ($state == ParserState.DUMP_START) {
				if ($res = NextToken.matchFlightNotFoundStatement($text)) {
					return null;
				} else if ($res = NextToken.matchNoValidFareForInputCriteriaStatement($text)) {
					return null;
				} else if ($res = NextToken.matchNoItinStatement($text)) {
					return null;
				} else if ($res = NextToken.matchCommandCopyLine($text)) {
					$structureWriter.commandCopyLineFound($res);
					$text = $res['textLeft'];
					$state = ParserState.COMMAND_COPY_START_FOUND;
				} else {
					throw new Error($text);
				}
			} else if ($state == ParserState.COMMAND_COPY_START_FOUND) {
				$nonCommandLinesFound = true;
				if ($res = NextToken.matchEmptyLine($text)) {
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchTicketingWithinHoursLine($text)) {
					$text = $res['textLeft'];
				} else if (
					match = $text.match(/^ROUND THE WORLD FARES QUOTED-AGENT MUST VERIFY RULES\s*\n/) ||
							$text.match(/^\s*INFORMATION ONLY - BOOKING DATE MODIFIED\s*/)
				) {
					// ignore
					$text = $text.slice(match[0].length);
				} else if ($res = NextToken.matchFareGuaranteedAtTicketIssuanceStatement($text)) {
					$structureWriter.fareGuaranteedAtTicketIssuanceStatementFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchAgentSelectedFareUsedStatement($text)) {
					$structureWriter.agentSelectedFareUsedStatementFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchFareHasPlatingCarrierRestrictionStatement($text)) {
					$structureWriter.fareHasPlatingCarrierRestrictionStatementFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchETicketRequiredStatement($text)) {
					$structureWriter.eTicketRequiredStatementFound($res);
					$text = $res['textLeft'];
				} else if (php.preg_match(/^PAPER TICKET REQUIRED\s*?\n/, $text, $matches = [])) {
					$structureWriter.paperTicketRequiredStatementFound();
					$text = php.substr($text, php.mb_strlen($matches[0]));
				} else if ($res = NextToken.matchAdditionalServicesStatement($text)) {
					$structureWriter.additionalServicesStatementFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchRebookStatement($text)) {
					$structureWriter.rebookStatementFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchPenaltyAppliesStatement($text)) {
					$structureWriter.penaltyAppliesStatementFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchPrivateFaresSelectedStatement($text)) {
					$structureWriter.privateFaresSelectedStatementFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchBestFareForPassengerTypeLine($text)) {
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchLastDateToPurchaseTicket($text)) {
					$structureWriter.lastDateToPurchaseTicketFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchFareConstructionMarkerLine($text)) {
					$structureWriter.fareConstructionMarkerLineFound($res);
					$text = $res['textLeft'];
					$state = ParserState.FARE_CONSTRUCTION_MARKER_FOUND;
				} else if ($res = NextToken.matchUnknownPricingStatementLine($text)) {
					$structureWriter.unknownPricingStatementLineFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchCommandCommentLine($text)) {
					// ignoring it
					$text = $res['textLeft'];
				} else if ($text && !$commandLinesEnded) {
					$lines = StringUtil.lines($text);
					$structureWriter.commandCopyLineFound({line: php.array_shift($lines)});
					$text = php.implode(php.PHP_EOL, $lines);
					$nonCommandLinesFound = false;
				} else {
					throw new Error($text);
				}
				$commandLinesEnded = $nonCommandLinesFound;
			} else if ($state == ParserState.FARE_CONSTRUCTION_MARKER_FOUND) {
				if ($res = NextToken.matchFareConstructionBlock($text)) {
					$structureWriter.fareConstructionFound($res);
					$text = $res['textLeft'];
					$state = ParserState.FARE_CONSTRUCTION_FOUND;
				} else {
					throw new Error(php.substr($text, 0, 100));
				}
			} else if ($state == ParserState.FARE_CONSTRUCTION_FOUND) {
				if ($res = NextToken.matchEmptyLine($text)) {
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchNotValidBeforeOrAfterLine($text)) {
					$structureWriter.notValidBeforeOrAfterLineFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchEndorsementBoxLine($text)) {
					$structureWriter.endorsementBoxLineFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchUbPassengerServiceChargeLine($text)) {
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchTourCodeLine($text)) {
					$structureWriter.tourCodeLineFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchTicketingAgencyLine($text)) {
					$structureWriter.ticketingAgencyLineFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchFareHasFormOfPaymentRestrictionStatement($text)) {
					$structureWriter.fareHasFormOfPaymentRestrictionStatementFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchDefaultPlatingCarrierLine($text)) {
					$structureWriter.defaultPlatingCarrierLineFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchBankSellingRate($text)) {
					// RSBS-1490
					$structureWriter.bankSellingRateFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchTaxesLine($text)) {
					$structureWriter.taxesLineFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchBaggageAllowanceBlockStartLine($text)) {
					$structureWriter.baggageAllowanceBlockStartLineFound($res);
					$text = $res['textLeft'];
					$state = ParserState.BAGGAGE_ALLOWANCE_START_LINE_FOUND;
				} else if ($res = NextToken.matchUnknownPricingStatementLine($text)) {
					$structureWriter.unknownPricingStatementLineFound($res);
					$text = $res['textLeft'];
				} else if ($text) {
					$lines = StringUtil.lines($text);
					$line = php.array_shift($lines);
					$text = php.implode(php.PHP_EOL, $lines);
					$structureWriter.unparsedInfoLineFound($line);
				} else {
					throw new Error('No text left at state ' + $state);
				}
			} else if ($state == ParserState.BAGGAGE_ALLOWANCE_START_LINE_FOUND) {
				if ($res = NextToken.matchPassengerTypeCodeLine($text)) {
					$structureWriter.passengerTypeCodeLineFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchPenaltyAppliesStatement($text)) {
					$res['makeNewPricingBlock'] = true;
					$structureWriter.penaltyAppliesStatementFound($res);
					$text = $res['textLeft'];
					$state = ParserState.BAGGAGE_ALLOWANCE_BLOCK_ENDED;
				} else if ($res = NextToken.matchPrivateFaresSelectedStatement($text)) {
					$res['makeNewPricingBlock'] = true;
					$structureWriter.privateFaresSelectedStatementFound($res);
					$text = $res['textLeft'];
					$state = ParserState.BAGGAGE_ALLOWANCE_BLOCK_ENDED;
				} else if ($res = NextToken.matchLastDateToPurchaseTicket($text)) {
					$res['makeNewPricingBlock'] = true;
					$structureWriter.lastDateToPurchaseTicketFound($res);
					$text = $res['textLeft'];
					$state = ParserState.BAGGAGE_ALLOWANCE_BLOCK_ENDED;
				} else if ($res = NextToken.matchAdditionalServicesStatement($text)) {
					$res['makeNewPricingBlock'] = true;
					$structureWriter.additionalServicesStatementFound($res);
					$text = $res['textLeft'];
					$state = ParserState.BAGGAGE_ALLOWANCE_BLOCK_ENDED;
				} else if ($res = NextToken.matchUnknownPricingStatementLine($text)) {
					$res['makeNewPricingBlock'] = true;
					$structureWriter.unknownPricingStatementLineFound($res);
					$text = $res['textLeft'];
					$state = ParserState.BAGGAGE_ALLOWANCE_BLOCK_ENDED;
				} else if ($res = NextToken.matchFareConstructionMarkerLine($text)) {
					$res['makeNewPricingBlock'] = true;
					$structureWriter.fareConstructionMarkerLineFound($res);
					$text = $res['textLeft'];
					$state = ParserState.FARE_CONSTRUCTION_MARKER_FOUND;
				} else if (!(php.trim($text))) {
					break;  // parsed successfully
				} else if ($res = NextToken.matchWhateverLine($text)) {
					/* We don't know what exatly can it be, but we know
                     * that baggage info can be quite free-form so we just
                     * count it as part of baggage allowance for now (but,
                     * obviously it can be changed if we want to improve
                     * baggage allowance parser, and I hope it will be
                     * someday)
                     */
					$structureWriter.baggageInfoLineFound($res);
					$text = $res['textLeft'];
				} else {
					// simply impossible, but still…
					throw new Error($text);
				}
			} else if ($state == ParserState.BAGGAGE_ALLOWANCE_BLOCK_ENDED) {
				if ($res = NextToken.matchPenaltyAppliesStatement($text)) {
					$structureWriter.penaltyAppliesStatementFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchPrivateFaresSelectedStatement($text)) {
					$structureWriter.privateFaresSelectedStatementFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchLastDateToPurchaseTicket($text)) {
					$structureWriter.lastDateToPurchaseTicketFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchUnknownPricingStatementLine($text)) {
					$structureWriter.unknownPricingStatementLineFound($res);
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchTicketingWithinHoursLine($text)) {
					$text = $res['textLeft'];
				} else if ($res = NextToken.matchFareConstructionMarkerLine($text)) {
					$structureWriter.fareConstructionMarkerLineFound($res);
					$text = $res['textLeft'];
					$state = ParserState.FARE_CONSTRUCTION_MARKER_FOUND;
				} else if ($res = NextToken.matchBestFareForPassengerTypeLine($text)) {
					$text = $res['textLeft'];
				} else if (!(php.trim($text))) {
					break;  // parsed successfully
				} else {
					throw new Error($text);
				}
			}
		}
		return $structureWriter.getStructure();
	}
}
module.exports = PricingParser;
