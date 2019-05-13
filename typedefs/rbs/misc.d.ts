
interface IImportPqRq {
    "gds": "galileo",
    "sessionId": "11521980",
    "sessionLogId": "cmsTerminal_galileo_24236.5c6d9a71.99c5a26",
    "context": {
        "leadId": "10722524",
        "leadOwnerId": "101907",
        "projectName": "UK",
        "leadUrl": "https://cms.asaptickets.co.uk/leadInfo?rId=10722524",
        "paxNumAdults": "2",
        "paxNumInfants": "0",
        "paxNumChildren": "0"
    }
}

interface IRebuildItineraryRq {
    "sessionId": "546",
    "pcc": "1O3K",
    "itinerary": [
        {
            "airline": "DL",
            "flightNumber": "1648",
            "bookingClass": "X",
            "departureDate": "2017-07-06",
            "departureAirport": "MDW",
            "destinationAirport": "ATL",
            "segmentStatus": "GK",
            "seatCount": 1
        },
        {
            "airline": "DL",
            "flightNumber": "8517",
            "bookingClass": "X",
            "departureDate": "2017-07-06",
            "departureAirport": "ATL",
            "destinationAirport": "CDG",
            "segmentStatus": "GK",
            "seatCount": 1
        }
    ],
}

interface IGetTariffDisplayRq {
    "maxFares": "40",
    "timeout": "13.333333333333",
    "departureDate": "2019-02-26",
    "returnDate": "",
    "departureAirport": "CHI",
    "destinationAirport": "FRA",
    "pcc": "LAXGO3106",
    "gds": "amadeus",
    "fareType": "private"
}

interface IGetTariffDisplayRs {
    "status": "OK",
    "logId": "rbs.5c6c9bc4.bb9e5f9",
    "result": {
        "logId": "rbs.5c6c9bc4.bb9e5f9",
        "response_code": 1,
        "response_msg": "success",
        "errors": string[],
        "result": {
            "currency": "USD",
            "header": {"commandCopy":"FQDCHIFRA/26FEB19/R,U"},
            "fares": [
                {
                    "lineNumber": "06",
                    "isPrivateFare": true,
                    "fareType": "airlinePrivate",
                    "isRoundTrip": true,
                    "airline": "DL",
                    "fare": "363",
                    "seasonStart": null,
                    "seasonEnd": null,
                    "fareBasis": "UL5X57B1",
                    "bookingClass": null,
                    "advancePurchase": 50,
                    "minStay": {
                        "raw": "7+",
                        "hasMoreRules": true,
                        "type": "amount",
                        "amount": "7",
                        "units": "days"
                    },
                    "maxStay": {
                        "raw": "12M",
                        "hasMoreRules": false,
                        "type": "amount",
                        "amount": "12",
                        "units": "months"
                    },
                    "penalties": {
                        "raw": "NRF",
                        "type": "nonRefundable",
                        "value": null,
                        "hasMoreRules": false
                    },
                    "ticketDesignator": null,
                    "oceanicFlight": {"raw":"AT"},
                    "isRoutingBased": false,
                    "isMileageBased": true,
                    "departure": "CHI",
                    "destination": "FRA"
                }
            ]
        }
    }
}
