//
// // namespace Rbs\GdsDirect\Actions;
//
// const Fp = require('../../../Lib/Utils/Fp.js');
// const ImportPqApolloAction = require('../../../Rbs/GdsDirect/Actions/Apollo/ImportPqApolloAction.js');
// const Errors = require('../../../Rbs/GdsDirect/Errors.js');
// const GdsDirect = require('../../../Rbs/GdsDirect/GdsDirect.js');
// const SessionStateHelper = require('../../../Rbs/GdsDirect/SessionStateProcessor/SessionStateHelper.js');
// const SessionStateProcessor = require('../../../Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessor.js');
// const ImportPnrAction = require('../../../Rbs/Process/Common/ImportPnr/ImportPnrAction.js');
// const PnrFieldsCommonHelper = require('../../../Rbs/Process/Common/ImportPnr/PnrFieldsCommonHelper.js');
//
// /**
//  * import PNR fields of currently opened PNR
//  * unlike ImportPnrAction.php, it takes pricing
//  * data from session, not from stored ATFQ-s
//  *
//  * this class gathers GDS-specific actions in one place
//  * it also performs common operations after that,
//  * like: UTC times, trip type, cabin classes, etc...
//  */
// class ImportPqAction
// {
//     constructor()  {
//         this.$log = ($msg, $data) => {};
//         this.$session = null;
//         this.$fetchOptionalFields = true;
//     }
//
//     setLog($log)  {
//         this.$log = $log;
//         return this;
//     }
//
//     setSession($session)  {
//         this.$session = $session;
//         return this;
//     }
//
//     fetchOptionalFields($fetchOptionalFields)  {
//         this.$fetchOptionalFields = $fetchOptionalFields;
//         return this;
//     }
//
//     getCurrentStateCommands()  {
//         let $cmdTypes, $mixed, $priorPricingCommands, $lastStateSafeCommands, $isPricingMd, $cmdRow, $belongsToPricing;
//         $cmdTypes = SessionStateProcessor.getCanCreatePqSafeTypes();
//         $cmdTypes.push('priceItinerary');
//         $mixed = this.$session.getLog().getLastCommandsOfTypes($cmdTypes);
//         $priorPricingCommands = [];
//         $lastStateSafeCommands = [];
//         $isPricingMd = false;
//         for ($cmdRow of $mixed) {
//             $belongsToPricing = $cmdRow['cmd_type'] === 'priceItinerary'
//                 || $isPricingMd && php.in_array($cmdRow['cmd_type'], ['moveRest', 'moveDown']);
//             if ($belongsToPricing) {
//                 $isPricingMd = true;
//                 $lastStateSafeCommands = [];
//                 $priorPricingCommands.push($cmdRow);
//             } else {
//                 $isPricingMd = false;
//                 $lastStateSafeCommands.push($cmdRow);
//             }}
//         return php.array_merge($priorPricingCommands, $lastStateSafeCommands);
//     }
//
//     collectPnrData($statefulSession)  {
//         let $leadData, $gds, $action;
//         $leadData = $statefulSession.getLeadData();
//         if (php.empty($leadData['leadId'])) {
//             return {'error': Errors.getMessage(Errors.LEAD_ID_IS_REQUIRED)};
//         }
//         $gds = $statefulSession.getSessionData()['gds'];
//         if ($gds === 'apollo') {
//             $action = (new ImportPqApolloAction()).setApollo($statefulSession);
//         } else {
//             return {'error': 'Unsupported GDS - '+$gds};
//         }
//         return $action.fetchOptionalFields(this.$fetchOptionalFields).setLeadData($leadData).setLog(this.$log).setBaseDate($statefulSession.getStartDt()).setPreCalledCommandsFromDb(this.getCurrentStateCommands(),
//                 $statefulSession.getLog().getSessionData()).execute();
//     }
//
//     postProcessPricing($currentPricing, $helper)  {
//         $currentPricing['parsed'] = $helper.extendPricingInfo($currentPricing['parsed']);
//         $currentPricing['parsed']['pricingList'] = Fp.map(($store) => {
//             let $correctCmds;
//             $correctCmds = [];
//             $store['pricingBlockList'] = Fp.map(($ptcBlock) => {
//                 $ptcBlock['fareInfo']['fareConstruction']['segments'] = Fp.map(($fcSeg) => {
//                     let $gds, $tdInfo;
//                     if (!php.empty($fcSeg['fare'])) {
//                         $gds = this.$session.getSessionData()['gds'];
//                         $tdInfo = !php.in_array($gds, ['apollo', 'galileo']) ? null :
//                             this.$session.getTdInfo($fcSeg['ticketDesignator'] || '');
//                         $correctCmds.push($tdInfo['sale_correct_pricing_command']);
//                         if ($tdInfo['agency_incentive_units'] === 'amount' &&
//                             $tdInfo['currency'] === $ptcBlock['fareInfo']['totalFare']['currency']
//                         ) {
//                             $fcSeg['agencyIncentiveAmount'] = $tdInfo['agency_incentive_value'];
//                         } else {
//                             $fcSeg['agencyIncentiveAmount'] = null;
//                         }
//                     }
//                     return $fcSeg;
//                 }, $ptcBlock['fareInfo']['fareConstruction']['segments']);
//                 return $ptcBlock;
//             }, $store['pricingBlockList']);
//             $correctCmds = php.array_values(php.array_unique(php.array_filter($correctCmds)));
//             if (php.count($correctCmds) > 1) {
//                 (this.$log)('ERROR: different correct agent pricing formats in ITN ticket designators', $correctCmds);
//                 $store['correctAgentPricingFormat'] = null;
//             } else {
//                 $store['correctAgentPricingFormat'] = $correctCmds[0] || null;
//             }
//             $store['pricingPcc'] = $store['pricingPcc'] || this.$session.getSessionData()['pcc'];
//             return $store;
//         }, $currentPricing['parsed']['pricingList']);
//         return $currentPricing;
//     }
//
//     /**
//      * add fields that do not require GDS-specific logic
//      */
//     postprocessPnrData($pnrData)  {
//         let $gds, $dataAccess, $helper, $itinerary, $svcSegments, $utcRecord;
//         $gds = this.$session.getSessionData()['gds'];
//         $dataAccess = this.$session.getDataAccess();
//         $helper = (new PnrFieldsCommonHelper($gds)).setDataAccess($dataAccess);
//         $pnrData['currentPricing'] = this.postProcessPricing($pnrData['currentPricing'], $helper);
//         $pnrData['contractInfo'] = $helper.transformContractInfo($pnrData['currentPricing']['parsed'], $pnrData['reservation']['parsed']);
//         $itinerary = $pnrData['reservation']['parsed']['itinerary'];
//         $itinerary = ImportPnrAction.addCabinClasses($itinerary,
//             $pnrData['contractInfo']['cabinClassInfo']['segments'] || []);
//         if ($svcSegments = $pnrData['flightServiceInfo']['parsed']['segments'] || []) {
//             $itinerary = ImportPnrAction.combineItineraryAndSvc($itinerary, $svcSegments);
//         }
//         //$utcRecord = (new FetchItineraryUtcTimesAction()).setDataAccess($dataAccess).execute($itinerary);
//         //$pnrData['reservation']['parsed']['itinerary'] = $utcRecord['itineraryWithUtc'];
//         return $pnrData;
//     }
//
//     static hasConflictingCurrencies($pnrData)  {
//         let $currencies, $store, $ptcBlock;
//         $currencies = [];
//         for ($store of $pnrData['currentPricing']['parsed']['pricingList']) {
//             for ($ptcBlock of $store['pricingBlockList']) {
//                 $currencies.push($ptcBlock['fareInfo']['totalFare']['currency']);}}
//         return php.count(php.array_unique($currencies)) > 1;
//     }
//
//     static validateInput($statefulSession)  {
//         if (!$statefulSession.getSessionData()['can_create_pq']) {
//             return GdsDirect.makeForbiddenReturn($statefulSession.getLog(),
//                 ['Cannot import PQ when canCreatePq is false']);
//         }
//         return null;
//     }
//
//     execute()  {
//         let $statefulSession, $errorData, $result, $log, $messages, $error, $responseCode, $status;
//         $statefulSession = this.$session;
//         $errorData = this.constructor.validateInput($statefulSession);
//         if ($errorData) return $errorData;
//         $result = this.collectPnrData($statefulSession);
//         $log = this.$log;
//         $messages = [];
//         if ($error = $result['error'] || null) {
//             $log('Got error during PQ import - '+$error);
//             delete($result['error']);
//             $messages.push({'type': GdsDirect.MSG_POP_UP, 'text': $error});
//             if (!php.isset($result['pnrData']['currentPricing'])) {
//                 $responseCode = 3;
//                 $status = GdsDirect.STATUS_FORBIDDEN;
//             } else {
//                 $responseCode = 2;
//                 $status = GdsDirect.STATUS_EXECUTED;
//             }
//         } else if (this.constructor.hasConflictingCurrencies($result['pnrData'])) {
//             $log('Pricing has conflicting currencies', $result['pnrData']);
//             $responseCode = 3;
//             $status = GdsDirect.STATUS_FORBIDDEN;
//         } else {
//             $log('Successfully imported PQ', $result['pnrData']);
//             $responseCode = 1;
//             $status = GdsDirect.STATUS_EXECUTED;
//         }
//         if ($status === GdsDirect.STATUS_EXECUTED) {
//             $result['pnrData'] = this.postprocessPnrData($result['pnrData']);
//         }
//         $result['status'] = $status;
//         $result['messages'] = $messages;
//         $result['userMessages'] = php.array_column($messages, 'text');
//         $result['sessionInfo'] = SessionStateHelper.makeSessionInfo($statefulSession.getLog(), $statefulSession.getLeadData());
//         $result['calledCommands'] = Fp.map([$statefulSession.getGdsInterface(), 'transformCalledCommand'],
//             $statefulSession.flushCalledCommands());
//         return {
//             'response_code': $responseCode,
//             'result': $result,
//             'errors': [],
//         };
//     }
// }
// module.exports = ImportPqAction;
