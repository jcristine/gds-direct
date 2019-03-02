
// namespace Gds\Parsers\Common;

/**
 * this class provides constants that are common for all GDS-es:
 * meal types/ssr codes/segment types/history codes/etc/etc...
 */
const php = require('../../../php.js');
class GdsConstants
{
}
GdsConstants.MEAL_MEAL_AT_COST = 'MEAL_AT_COST';
GdsConstants.MEAL_ALCOHOL_PURCHASE = 'ALCOHOL_PURCHASE';
GdsConstants.MEAL_COLD_MEAL = 'COLD_MEAL';
GdsConstants.MEAL_REFRESHMENTS = 'REFRESHMENTS';
GdsConstants.MEAL_HOT_MEAL = 'HOT_MEAL';
GdsConstants.MEAL_LUNCH = 'LUNCH';
GdsConstants.MEAL_ALCOHOL_NO_COST = 'ALCOHOL_NO_COST';
GdsConstants.MEAL_REFRESH_AT_COST = 'REFRESH_AT_COST';
GdsConstants.MEAL_NO_MEAL_IS_OFFERED = 'NO_MEAL_IS_OFFERED';
GdsConstants.MEAL_NO_MEAL_SVC = 'NO_MEAL_SVC';
GdsConstants.MEAL_FOOD_AND_ALCOHOL_AT_COST = 'FOOD_AND_ALCOHOL_AT_COST';
GdsConstants.MEAL_SNACK = 'SNACK';
GdsConstants.MEAL_MEAL = 'MEAL';
GdsConstants.MEAL_FOOD_TO_PURCHASE = 'FOOD_TO_PURCHASE';
GdsConstants.MEAL_DINNER = 'DINNER';
GdsConstants.MEAL_BREAKFAST = 'BREAKFAST'; // no in Apollo
GdsConstants.MEAL_CONTINENTAL_BREAKFAST = 'CONTINENTAL_BREAKFAST'; // only in Amadeus
GdsConstants.MEAL_DUTY_FREE_SALES_AVAILABLE = 'DUTY_FREE_SALES_AVAILABLE'; // only in Amadeus
module.exports = GdsConstants;
