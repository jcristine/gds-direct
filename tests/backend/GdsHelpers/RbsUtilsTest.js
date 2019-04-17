const RbsUtils = require('../../../backend/GdsHelpers/RbsUtils.js');

class RbsUtilsTest extends require('../Transpiled/Lib/TestCase.js') {
	provide_makeContractInfo() {
		let testCases = [];

		testCases.push({
			input: {
				"title": "This is JCB in C2Y - should not be a tour fare. Due to mistake in code, C2Y logic if branch never happened",
				"gds": "galileo",
				"pricingList": [
					{
						"quoteNumber": null,
						"pricingPcc": "C2Y",
						"pricingModifiers": [
							{"raw": "-BSAG", "type": "accountCode", "parsed": {"code": "BSAG"}},
							{"raw": "TAC2Y", "type": "ticketingAgencyPcc", "parsed": "C2Y"},
							{
								"raw": "*JCB",
								"type": "passengers",
								"parsed": {
									"appliesToAll": true,
									"ptcGroups": [
										{
											"passengerNumbers": [],
											"ptc": "JCB",
											"ptcDescription": "",
											"raw": "*JCB"
										}
									]
								}
							},
							{"raw": "FXD", "type": "forceProperEconomy", "parsed": true}
						],
						"pricingBlockList": [
							{
								"ptcInfo": {
									"ptc": "JCB",
									"ageGroup": "adult",
									"ptcRequested": "JCB",
									"ageGroupRequested": "adult",
									"quantity": 9
								},
								"passengerNameNumbers": [
									{"absolute": 1, "fieldNumber": 1, "firstNameNumber": 1},
									{"absolute": 2, "fieldNumber": 2, "firstNameNumber": 1},
									{"absolute": 3, "fieldNumber": 3, "firstNameNumber": 1},
									{"absolute": 4, "fieldNumber": 4, "firstNameNumber": 1},
									{"absolute": 5, "fieldNumber": 5, "firstNameNumber": 1},
									{"absolute": 6, "fieldNumber": 6, "firstNameNumber": 1},
									{"absolute": 7, "fieldNumber": 7, "firstNameNumber": 1},
									{"absolute": 8, "fieldNumber": 8, "firstNameNumber": 1},
									{"absolute": 9, "fieldNumber": 9, "firstNameNumber": 1}
								],
								"validatingCarrier": "VS",
								"hasPrivateFaresSelectedMessage": true,
								"lastDateToPurchase": {"full": "2019-04-26"},
								"endorsementBoxLines": [],
								"privateFareType": null,
								"tourCode": null,
								"fareInfo": {
									"baseFare": {"currency": "GBP", "amount": "273.00"},
									"fareEquivalent": null,
									"totalFare": {"currency": "GBP", "amount": "614.12"},
									"taxList": [
										{"taxCode": "GB", "amount": "78.00"},
										{"taxCode": "UB", "amount": "46.62"},
										{"taxCode": "QT", "amount": "38.20"},
										{"taxCode": "TE", "amount": "15.30"},
										{"taxCode": "YQ", "amount": "163.00"}
									],
									"fareConstruction": {
										"segments": [
											{
												"airline": "VS",
												"flags": [],
												"destination": "LOS",
												"fare": "212.70",
												"fareBasis": "XLUF0SMN",
												"ticketDesignator": "VF18",
												"departure": "LON"
											},
											{
												"airline": "VS",
												"flags": [],
												"destination": "LON",
												"fare": "146.85",
												"fareBasis": "OTUP0SMW",
												"ticketDesignator": "VF18",
												"departure": "LOS"
											}
										],
										"markup": null,
										"currency": "NUC",
										"fareAndMarkupInNuc": "359.55",
										"fare": "359.55",
										"hasEndMark": true,
										"infoMessage": null,
										"rateOfExchange": "0.75928",
										"facilityCharges": [],
										"hasHiddenFares": false
									}
								},
								"fareType": "tour"
							}
						],
						"correctAgentPricingFormat": null
					}
				]
			},
			output: {
				"isStoredInConsolidatorCurrency": true,
				"isBasicEconomy": false,
				"fareType": "private",
				"isTourFare": false
			},
		});

		return testCases.map(c => [c]);
	}

	async test_makeContractInfo({input, output}) {
		let {gds, pricingList} = input;
		let actual = await RbsUtils.makeContractInfo(gds, pricingList);
		this.assertArrayElementsSubset(output, actual);
	}

	getTestMapping() {
		return [
			[this.provide_makeContractInfo, this.test_makeContractInfo],
		];
	}
}

module.exports = RbsUtilsTest;