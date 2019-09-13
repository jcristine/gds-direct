
const crypto = require('crypto');

const endpoint = 'https://americas.universal-api.travelport.com/B2BGateway/connect/uAPI/AirService';
//let endpoint = 'https://emea.universal-api.travelport.com/B2BGateway/connect/uAPI/AirService';

const UapiClient = ({
	PersistentHttpRq = require('klesun-node-tools/src/Utils/PersistentHttpRq.js'),
	randomBytes = (size) => crypto.randomBytes(size),
} = {}) => {

	const sendRequest = async (requestBody) => {
		const authTokenSrc = 'Universal API/uAPI1234567890-abcd1234:qwerty?!&w';
		const authToken = Buffer.from(authTokenSrc).toString('base64');
		return PersistentHttpRq({
			url: endpoint,
			headers: {
				'Authorization': 'Basic ' + authToken,
			},
			body: requestBody,
		}).then(resp => resp.body);
	};

	const getAirAvailability = () => {
		// ID of this request, returned in response, may be useful for debug
		const traceId = 'some-random-string';
		const soapEnvXml = [
		    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">',
		    '  <soapenv:Header/>',
		    '  <soapenv:Body>',
		    '    <air:AvailabilitySearchReq xmlns:air="http://www.travelport.com/schema/air_v34_0" AuthorizedBy="klesun" TargetBranch="P3539842" TraceId="' + traceId + '">',
		    '      <com:BillingPointOfSaleInfo xmlns:com="http://www.travelport.com/schema/common_v34_0" OriginApplication="UAPI"/>',
		    '      <air:SearchAirLeg>',
		    '        <air:SearchOrigin>',
		    '          <com:Airport xmlns:com="http://www.travelport.com/schema/common_v34_0" Code="SYD"/>',
		    '        </air:SearchOrigin>',
		    '        <air:SearchDestination>',
		    '          <com:Airport xmlns:com="http://www.travelport.com/schema/common_v34_0" Code="MEL"/>',
		    '        </air:SearchDestination>',
		    '        <air:SearchDepTime PreferredTime="2020-05-20"/>',
		    '      </air:SearchAirLeg>',
		    '      <air:AirSearchModifiers>',
		    '        <air:PreferredProviders>',
		    '          <com:Provider xmlns:com="http://www.travelport.com/schema/common_v34_0" Code="1V"/>',
		    '        </air:PreferredProviders>',
		    '      </air:AirSearchModifiers>',
		    '    </air:AvailabilitySearchReq>',
		    '  </soapenv:Body>',
		    '</soapenv:Envelope>',
		].join('\n');

		return sendRequest(soapEnvXml);
	};

	return {
		// terminal commands, sessions and PNR processing
		// need to be enabled for our account to be used...
		getAirAvailability: getAirAvailability,
	};
};

module.exports = UapiClient;