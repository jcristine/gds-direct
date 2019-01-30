
// namespace Rbs\GdsDirect\SessionStateProcessor;

const GetPqItineraryAction = require('../../../Rbs/GdsDirect/Actions/GetPqItineraryAction.js');
const Errors = require('../../../Rbs/GdsDirect/Errors.js');
const SessionStateProcessor = require('../../../Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessor.js');
const CmsApolloTerminal = require('../../../Rbs/GdsDirect/GdsInterface/CmsApolloTerminal');

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

    static makeSessionInfo($cmdLog, $leadData)  {
        let $row;
        $row = $cmdLog.getSessionData();
        return {
            'isAlive': $row['is_active'] ? true : false,
            'canCreatePq': $row['can_create_pq'] ? true : false,
            'pcc': $row['pcc'],
            'area': $row['area'],
            'recordLocator': $row['record_locator'] || '',
            'hasPnr': $row['has_pnr'] || false,
            'isPnrStored': $row['is_pnr_stored'] || false,
            'canCreatePqErrors': this.checkCanCreatePq($cmdLog, $leadData),
            'canCreatePqFor': this.getPricedAgeGroups($cmdLog),
        };
    }

    static getPricingCmdRow($cmdLog)  {
        let $cmdRows, $typeToCmdRow;
        $cmdRows = $cmdLog.getLastCommandsOfTypes(SessionStateProcessor.getCanCreatePqSafeTypes());
        $typeToCmdRow = php.array_combine(php.array_column($cmdRows, 'cmd_type'), $cmdRows);
        return $typeToCmdRow['priceItinerary'] || null;
    }

    static getPricedAgeGroups($cmdLog)  {
        let $cmdRow, $priced;
        if ($cmdRow = this.getPricingCmdRow($cmdLog)) {
        	let gds = $cmdLog.getSessionData()['gds'];
        	let ifc;
			if (gds === 'apollo') {
				ifc = new CmsApolloTerminal();
			} else {
				return ['Unsupported GDS for checkCanCreatePq - ' + gds];
			}
            $priced = ifc.getPricedPtcs($cmdRow['cmd_performed']);
            return GetPqItineraryAction.ptcsToAgeGroups($priced['ptcs'] || []);
        } else {
            return [];
        }
    }

    static checkCanCreatePq($cmdLog, $leadData)  {
        let $errors, $gds, $gdsInterface, $cmdList, $cmdPricing, $cmdItinerary, $cmdRecord;
        $errors = [];
        $gds = $cmdLog.getSessionData()['gds'];
        if ($gds === 'apollo') {
        	$gdsInterface = new CmsApolloTerminal();
		} else {
        	$errors.push('Unsupported GDS for checkCanCreatePq - ' + $gds);
        	return $errors;
		}
        $cmdList = $cmdLog.getLastCommandsOfTypes(SessionStateProcessor.getCanCreatePqSafeTypes());
        $cmdPricing = this.getPricingCmdRow($cmdLog);
        $cmdItinerary = null;
        for ($cmdRecord of $cmdList) {
            if (php.in_array($cmdRecord['cmd_type'], ['redisplayPnr', 'itinerary'])) {
                $cmdItinerary = $cmdRecord;
            }}
        if (!$cmdPricing) {
            $errors.push(Errors.getMessage(Errors.NO_RECENT_PRICING));
        } else {
            $errors = php.array_merge($errors, GetPqItineraryAction.checkPricingOutput($gds, $cmdPricing['output'], $leadData));
            $errors = php.array_merge($errors, GetPqItineraryAction.checkPricingCommand($gds, $cmdPricing['cmd_performed'], $leadData));
            // prevent duplicate errors from entered cmd and cmd in pricing output
            $errors = php.array_values(php.array_unique($errors));
        }
        if ($cmdItinerary) {
            $errors = php.array_merge($errors, $gdsInterface.checkPqPnrDump($cmdItinerary['output']));
        }
        return $errors;
    }
}
module.exports = SessionStateHelper;
