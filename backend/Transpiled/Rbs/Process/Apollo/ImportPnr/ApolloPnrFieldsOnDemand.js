

const php = require('../../../../phpDeprecated.js');

class ApolloPnrFieldsOnDemand
{
	static detectPricingErrorResponse($dump)  {
		let errorData = this.detectPricingErrorResponseType($dump);
		return errorData ? errorData['error'] : null;
	}

	static detectPricingErrorResponseType($dump)  {
		let $trimmed;
		$trimmed = php.trim($dump);
		if (php.trim($dump) === 'NO VALID FARE FOR INPUT CRITERIA' ||
            php.preg_match(/^\s*NO PUBLIC FARES VALID FOR PASSENGER TYPE\/CLASS OF SERVICE\s*\.\s*/s, $dump) ||
            php.preg_match(/^\s*ERROR \d+ - INVALID INPUT UNPRICEABLE PNR.*/s, $dump)
		) {
			return {'error': 'noData', 'errorType': 'NO_VALID_FARE'};
		} else if (php.trim($dump) === 'NO VALIDATING AIRLINE FOUND') {
			return {'error': 'error response - '+$trimmed, 'errorType': 'NO_VALIDATING_AIRLINE_FOUND'};
		} else if (!php.preg_match(/\n.*\n/, $trimmed)) {
			return {'error': 'error response - '+$trimmed, 'errorType': 'CUSTOM_GDS_ERROR'};
		} else {
			return null;
		}
	}
}
module.exports = ApolloPnrFieldsOnDemand;
