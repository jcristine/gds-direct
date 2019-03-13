

interface IRbsPnrData {
    "reservation": {
        "pnrInfo": null,
        "passengers": Array,
        "itinerary": [
            {
                "segmentNumber": 0,
                "airline": "PS",
                "flightNumber": "898",
                "bookingClass": "D",
                "departureDate": {"parsed":"05-10","raw":"10MAY"},
                "departureTime": {"parsed":"07:20","raw":"720A"},
                "departureAirport": "KIV",
                "destinationAirport": "KBP",
                "segmentStatus": "SS",
                "seatCount": 0,
                "dayOffset": 0,
                "eticket": true,
                "daysOfWeek": "5",
                "destinationTime": {"parsed":"08:25"},
                "confirmedByAirline": true,
                "operatedBy": null,
                "operatedByCode": null,
                "marriage": 0,
                "raw": " 1 PS 898D 10MAY KIVKBP SS1   720A  825A *         FR   E  1",
                "destinationDate": {"parsed":"05-10"},
                "departureDt": {
                    "parsed": "05-10 07:20",
                    "full": "2019-05-10 07:20:00",
                    "tz": "Europe/Chisinau",
                    "utc": "2019-05-10 04:20:00"
                },
                "destinationDt": {
                    "parsed": "05-10 08:25",
                    "full": "2019-05-10 08:25:00",
                    "tz": "Europe/Kiev",
                    "utc": "2019-05-10 05:25:00"
                },
                "cabinClass": "business"
            },
            {
                "segmentNumber": 0,
                "airline": "PS",
                "flightNumber": "185",
                "bookingClass": "D",
                "departureDate": {"parsed":"05-10","raw":"10MAY"},
                "departureTime": {"parsed":"09:20","raw":"920A"},
                "departureAirport": "KBP",
                "destinationAirport": "RIX",
                "segmentStatus": "SS",
                "seatCount": 0,
                "dayOffset": 0,
                "eticket": true,
                "daysOfWeek": "5",
                "destinationTime": {"parsed":"10:55"},
                "confirmedByAirline": true,
                "operatedBy": null,
                "operatedByCode": null,
                "marriage": 0,
                "raw": " 2 PS 185D 10MAY KBPRIX SS1   920A 1055A *         FR   E  1",
                "destinationDate": {"parsed":"05-10"},
                "departureDt": {
                    "parsed": "05-10 09:20",
                    "full": "2019-05-10 09:20:00",
                    "tz": "Europe/Kiev",
                    "utc": "2019-05-10 06:20:00"
                },
                "destinationDt": {
                    "parsed": "05-10 10:55",
                    "full": "2019-05-10 10:55:00",
                    "tz": "Europe/Riga",
                    "utc": "2019-05-10 07:55:00"
                },
                "cabinClass": "business"
            },
            {
                "segmentNumber": 0,
                "airline": "AY",
                "flightNumber": "1072",
                "bookingClass": "Y",
                "departureDate": {"parsed":"05-20","raw":"20MAY"},
                "departureTime": {"parsed":"10:15","raw":"1015A"},
                "departureAirport": "RIX",
                "destinationAirport": "HEL",
                "segmentStatus": "SS",
                "seatCount": 0,
                "dayOffset": 0,
                "eticket": true,
                "daysOfWeek": "1",
                "destinationTime": {"parsed":"11:25"},
                "confirmedByAirline": true,
                "operatedBy": "NORDIC REGIONAL AIRLINES",
                "operatedByCode": null,
                "marriage": 0,
                "raw":
                    " 3 AY1072Y 20MAY RIXHEL SS1  1015A 1125A *         MO   E" &
                    "         OPERATED BY NORDIC REGIONAL AIRLINES"
                "destinationDate": {"parsed":"05-20"},
                "departureDt": {
                    "parsed": "05-20 10:15",
                    "full": "2019-05-20 10:15:00",
                    "tz": "Europe/Riga",
                    "utc": "2019-05-20 07:15:00"
                },
                "destinationDt": {
                    "parsed": "05-20 11:25",
                    "full": "2019-05-20 11:25:00",
                    "tz": "Europe/Helsinki",
                    "utc": "2019-05-20 08:25:00"
                },
                "cabinClass": "economy"
            },
            {
                "segmentNumber": 0,
                "airline": "IB",
                "flightNumber": "350",
                "bookingClass": "Y",
                "departureDate": {"parsed":"05-20","raw":"20MAY"},
                "departureTime": {"parsed":"12:20","raw":"1220P"},
                "departureAirport": "HEL",
                "destinationAirport": "JFK",
                "segmentStatus": "SS",
                "seatCount": 0,
                "dayOffset": 0,
                "eticket": true,
                "daysOfWeek": "1",
                "destinationTime": {"parsed":"14:05"},
                "confirmedByAirline": true,
                "operatedBy": "FINNAIR",
                "operatedByCode": "AY",
                "marriage": 0,
                "raw":
                    " 4 IB 350Y 20MAY HELJFK SS1  1220P  205P *         MO   E" &
                    "         OPERATED BY FINNAIR",
                "destinationDate": {"parsed":"05-20"},
                "departureDt": {
                    "parsed": "05-20 12:20",
                    "full": "2019-05-20 12:20:00",
                    "tz": "Europe/Helsinki",
                    "utc": "2019-05-20 09:20:00"
                },
                "destinationDt": {
                    "parsed": "05-20 14:05",
                    "full": "2019-05-20 14:05:00",
                    "tz": "America/New_York",
                    "utc": "2019-05-20 18:05:00"
                },
                "cabinClass": "economy"
            }
        ],
        "remarks": Array,
        "confirmationNumbers": Array,
        "dataExistsInfo": {
            "mileageProgramsExist": false,
            "fareQuoteExists": false,
            "dividedBookingExists": false,
            "globalInformationExists": false,
            "itineraryRemarksExist": false,
            "miscDocumentDataExists": false,
            "profileAssociationsExist": false,
            "seatDataExists": false,
            "tinRemarksExist": false,
            "nmePricingRecordsExist": false,
            "eTicketDataExists": false
        },
        "dumpNumbers": null
    },
    "fareQuoteInfo": {
        "pricingList": [
            {
                "quoteNumber": null,
                "pricingPcc": "2G55",
                "pricingModifiers": [
                    {
                        "raw": "S1-*2G55|2-*2G55",
                        "type": "segments",
                        "parsed": {
                            "privateFaresPcc": "2G55",
                            "bundles": [
                                {
                                    "segmentNumbers": ["1"],
                                    "fareBasis": null,
                                    "accountCode": "",
                                    "pcc": "2G55"
                                },
                                {
                                    "segmentNumbers": ["2"],
                                    "fareBasis": null,
                                    "accountCode": "",
                                    "pcc": "2G55"
                                }
                            ]
                        }
                    }
                ],
                "pricingBlockList": [
                    {
                        "passengerNameNumbers": {}[],
                        "ptcInfo": {
                            "ptc": "ADT",
                            "ptcRequested": null,
                            "ageGroup": "adult",
                            "ageGroupRequested": null,
                            "quantity": 0,
                            "paxLinkError": null
                        },
                        "lastDateToPurchase": {"raw":"10MAY19","parsed":"2019-05-10","full":"2019-05-10"},
                        "lastTimeToPurchase": null,
                        "validatingCarrier": "PS",
                        "hasPrivateFaresSelectedMessage": false,
                        "endorsementBoxLines": ["NONEND/RES RSTR/RBK FOC"],
                        "fareInfo": {
                            "baseFare": {"currency":"EUR","amount":"518.00"},
                            "fareEquivalent": {"currency":"USD","amount":"600.00"},
                            "totalFare": {"currency":"USD","amount":"681.00"},
                            "taxList": [
                                {"taxCode":"JQ","amount":"2.90"},
                                {"taxCode":"MD","amount":"10.40"},
                                {"taxCode":"WW","amount":"7.20"},
                                {"taxCode":"UA","amount":"4.00"},
                                {"taxCode":"YK","amount":"8.50"},
                                {"taxCode":"YQ","amount":"18.00"},
                                {"taxCode":"YR","amount":"30.00"}
                            ],
                            "fareConstruction": {
                                "segments": [
                                    {
                                        "airline": "PS",
                                        "flags": [{"raw":"X","parsed":"noStopover"}],
                                        "destination": "IEV",
                                        "departure": "KIV"
                                    },
                                    {
                                        "airline": "PS",
                                        "flags": {}[],
                                        "destination": "RIX",
                                        "fare": "600.58",
                                        "fareBasis": "D1EP4",
                                        "ticketDesignator": null,
                                        "departure": "IEV",
                                        "agencyIncentiveAmount": null
                                    }
                                ],
                                "markup": null,
                                "currency": "NUC",
                                "fareAndMarkupInNuc": "600.58",
                                "fare": "600.58",
                                "hasEndMark": true,
                                "infoMessage": null,
                                "rateOfExchange": "0.86249",
                                "facilityCharges": {}[],
                                "hasHiddenFares": false
                            }
                        },
                        "baggageInfo": null,
                        "fareType": "published"
                    }
                ],
                "pricingNumber": 0,
                "correctAgentPricingFormat": null
            },
            {
                "quoteNumber": null,
                "pricingPcc": "2G55",
                "pricingModifiers": [
                    {
                        "raw": "S3-*2G55|4-*2G55",
                        "type": "segments",
                        "parsed": {
                            "privateFaresPcc": "2G55",
                            "bundles": [
                                {
                                    "segmentNumbers": ["3"],
                                    "fareBasis": null,
                                    "accountCode": "",
                                    "pcc": "2G55"
                                },
                                {
                                    "segmentNumbers": ["4"],
                                    "fareBasis": null,
                                    "accountCode": "",
                                    "pcc": "2G55"
                                }
                            ]
                        }
                    }
                ],
                "pricingBlockList": [
                    {
                        "passengerNameNumbers": {}[],
                        "ptcInfo": {
                            "ptc": "ADT",
                            "ptcRequested": null,
                            "ageGroup": "adult",
                            "ageGroupRequested": null,
                            "quantity": 0,
                            "paxLinkError": null
                        },
                        "lastDateToPurchase": {"raw":"14NOV18","parsed":"2018-11-14","full":"2018-11-14"},
                        "lastTimeToPurchase": null,
                        "validatingCarrier": "IB",
                        "hasPrivateFaresSelectedMessage": false,
                        "endorsementBoxLines": ["55 NOEND/CHGS-REF PERMIT","NO RESTRICTION APPLIES"],
                        "fareInfo": {
                            "baseFare": {"currency":"EUR","amount":"1729.00"},
                            "fareEquivalent": {"currency":"USD","amount":"2001.00"},
                            "totalFare": {"currency":"USD","amount":"2211.13"},
                            "taxList": [
                                {"taxCode":"US","amount":"18.30"},
                                {"taxCode":"XA","amount":"3.96"},
                                {"taxCode":"XY","amount":"7.00"},
                                {"taxCode":"YC","amount":"5.77"},
                                {"taxCode":"LV","amount":"4.00"},
                                {"taxCode":"XM","amount":"7.50"},
                                {"taxCode":"WL","amount":"4.80"},
                                {"taxCode":"XU","amount":"1.40"},
                                {"taxCode":"YQ","amount":"157.40"}
                            ],
                            "fareConstruction": {
                                "segments": [
                                    {
                                        "airline": "AY",
                                        "flags": [{"raw":"X","parsed":"noStopover"}],
                                        "destination": "HEL",
                                        "departure": "RIX"
                                    },
                                    {
                                        "airline": "IB",
                                        "flags": {}[],
                                        "destination": "NYC",
                                        "fuelSurcharge": "12.17",
                                        "fuelSurchargeParts": ["12.17"],
                                        "mileageSurcharge": "M",
                                        "fare": "1991.90",
                                        "fareBasis": "Y1N0C9M0",
                                        "ticketDesignator": null,
                                        "departure": "HEL",
                                        "agencyIncentiveAmount": null
                                    }
                                ],
                                "markup": null,
                                "currency": "NUC",
                                "fareAndMarkupInNuc": "2004.07",
                                "fare": "2004.07",
                                "hasEndMark": true,
                                "infoMessage": null,
                                "rateOfExchange": "0.86249",
                                "facilityCharges": {}[],
                                "hasHiddenFares": false
                            }
                        },
                        "baggageInfo": null,
                        "fareType": "published"
                    }
                ],
                "pricingNumber": 0,
                "correctAgentPricingFormat": null
            }
        ]
    },
    "contractInfo": {
        "dumpNumbers": {}[],
        "error": null,
        "isStoredInConsolidatorCurrency": true,
        "isBasicEconomy": false,
        "fareType": "published",
        "isTourFare": false,
        "cabinClassInfo": {
            "wholeCabinClass": "economy",
            "segments": [
                {"segmentNumber":0,"cabinClass":"business"},
                {"segmentNumber":0,"cabinClass":"business"},
                {"segmentNumber":0,"cabinClass":"economy"},
                {"segmentNumber":0,"cabinClass":"economy"}
            ]
        }
    }
}