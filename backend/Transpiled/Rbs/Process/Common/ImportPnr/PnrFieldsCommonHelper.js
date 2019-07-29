

/**
 * provides functions that are needed by every GDS
 * unlike ImportPnrCommonFormatAdapter+php it is not
 * static, so you don't  have to pass thousands of arguments
 * if you want to use a data provider instead of DB
 */
class PnrFieldsCommonHelper
{
    constructor($gds)  {
		this.$dataAccess = null;
        this.$gds = $gds;
    }

    setDataAccess($dataAccess)  {
    	this.$dataAccess = $dataAccess;
        return this;
    }

    /** @param $pricingStoreInfo = ApolloStoredPricingAdapter::transform()
     * @param $reservation = IGdsPnrFieldsProvider::getReservation() */
    transformContractInfo($pricingStoreInfo, $reservation)  {
    	return {error: 'Should be provided by RBS'};
    }

    /**
     * calculate additional data like fare type
     * @param $pricingInfo = IGdsPnrFieldsProvider::getFareQuoteInfo()
     */
    extendPricingInfo($pricingInfo)  {
    	// fareType should be calculated by RBS, not by us
        return $pricingInfo;
    }

    getDataAccess()  {
        return this.$dataAccess;
    }
}
module.exports = PnrFieldsCommonHelper;
