
// namespace Rbs\GdsDirect\SessionStateProcessor;

const GetPqItineraryAction = require('./CanCreatePqRules.js');
const Errors = require('../../../Rbs/GdsDirect/Errors.js');
const SessionStateProcessor = require('../../../Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessor.js');
const CmsApolloTerminal = require('../../../Rbs/GdsDirect/GdsInterface/CmsApolloTerminal');
const CmsSabreTerminal = require('../../../Rbs/GdsDirect/GdsInterface/CmsSabreTerminal');
const CmsAmadeusTerminal = require('../../../Rbs/GdsDirect/GdsInterface/CmsAmadeusTerminal');
const CmsGalileoTerminal = require('../../../Rbs/GdsDirect/GdsInterface/CmsGalileoTerminal');
const php = require('../../../php.js');
const CommonDataHelper = require("../CommonDataHelper");

/**
 * provides functions that work with
 * result of session state processor
 */
class SessionStateHelper
{
    /** make _new_ area data */
    static makeNewAreaData($sessionData)  {
        return {
            'session_id': $sessionData['id'],
            'work_area_letter': $sessionData['area'],
            'internal_token': $sessionData['internal_token'],
            'pcc': $sessionData['pcc'],
            'record_locator': '',
            'has_pnr': false,
            'is_pnr_stored': false,
            'dt': php.date('Y-m-d H:i:s'),
        };
    }

    static makeAreaData($sessionData)  {
        return {
            'session_id': $sessionData['id'],
            'work_area_letter': $sessionData['area'],
            'internal_token': $sessionData['internal_token'] || null,
            'pcc': $sessionData['pcc'] || null,
            'record_locator': $sessionData['record_locator'] || '',
            'has_pnr': $sessionData['has_pnr'] || false,
            'is_pnr_stored': $sessionData['is_pnr_stored'] || false,
            'dt': php.date('Y-m-d H:i:s'),
        };
    }

    static updateFromArea($sessionData, $areaData)  {
        $sessionData = {...$sessionData};
        $sessionData['area'] = $areaData['work_area_letter'] || $areaData['area'];
        $sessionData['record_locator'] = $areaData['record_locator'];
        $sessionData['has_pnr'] = $areaData['has_pnr'];
        $sessionData['is_pnr_stored'] = $areaData['is_pnr_stored'];
        $sessionData['pcc'] = $areaData['pcc'];
        $sessionData['internal_token'] = $areaData['internal_token'] || null;
        return $sessionData;
    }

    static async makeSessionInfo($cmdLog, $leadData)  {
        let $row;
        $row = $cmdLog.getSessionData();
        return {
            'isAlive': $row['is_active'] ? true : false,
            'canCreatePq': $row['can_create_pq'] ? true : false,
            'pricingCmd': $row['pricing_cmd'] || '',
            'pcc': $row['pcc'],
            'area': $row['area'],
            'recordLocator': $row['record_locator'] || '',
            'hasPnr': $row['has_pnr'] || false,
            'isPnrStored': $row['is_pnr_stored'] || false,
            'canCreatePqErrors': await this.checkCanCreatePq($cmdLog, $leadData),
            'canCreatePqFor': await this.getPricedAgeGroups($cmdLog),
        };
    }

    static async getPricingCmdRow($cmdLog)  {
        let $cmdRows, $typeToCmdRow;
        $cmdRows = await $cmdLog.getLastCommandsOfTypes(SessionStateProcessor.getCanCreatePqSafeTypes());
        $cmdRows = $cmdRows.filter(row => !row.is_mr);
        $typeToCmdRow = php.array_combine(php.array_column($cmdRows, 'type'), $cmdRows);
        return $typeToCmdRow['priceItinerary'] || null;
    }

    static async getPricedAgeGroups($cmdLog)  {
        let $cmdRow, $priced;
        if ($cmdRow = await this.getPricingCmdRow($cmdLog)) {
        	let gds = $cmdLog.getSessionData()['gds'];
        	let ifc = CommonDataHelper.makeIfcByGds(gds);
            $priced = ifc.getPricedPtcs($cmdRow['cmd']);
            return GetPqItineraryAction.ptcsToAgeGroups($priced['ptcs'] || []);
        } else {
            return [];
        }
    }

    static async checkCanCreatePq($cmdLog, $leadData)  {
        let $errors, $gds, $gdsInterface, $cmdList, $cmdPricing, $cmdItinerary, $cmdRecord;
        $errors = [];
        $gds = $cmdLog.getSessionData()['gds'];
        $gdsInterface = CommonDataHelper.makeIfcByGds($gds);
        $cmdList = await $cmdLog.getLastCommandsOfTypes(SessionStateProcessor.getCanCreatePqSafeTypes());
        $cmdPricing = await this.getPricingCmdRow($cmdLog);
        $cmdItinerary = null;
        for ($cmdRecord of $cmdList) {
            if (php.in_array($cmdRecord['type'], ['redisplayPnr', 'itinerary']) && !$cmdRecord.is_mr) {
                $cmdItinerary = $cmdRecord;
            }}
        if (!$cmdPricing) {
            $errors.push(Errors.getMessage(Errors.NO_RECENT_PRICING));
        } else {
            $errors = php.array_merge($errors, GetPqItineraryAction.checkPricingOutput($gds, $cmdPricing['output'], $leadData));
            $errors = php.array_merge($errors, GetPqItineraryAction.checkPricingCommand($gds, $cmdPricing['cmd'], $leadData));
            // prevent duplicate errors from entered cmd and cmd in pricing output
            $errors = php.array_values(php.array_unique($errors));
        }
        if ($cmdItinerary) {
            let reservation = CommonDataHelper.parsePnrByGds($gds, $cmdItinerary['output']);
            $errors = php.array_merge($errors, GetPqItineraryAction.checkPnrData(reservation));
        }
        return $errors;
    }
}
module.exports = SessionStateHelper;
