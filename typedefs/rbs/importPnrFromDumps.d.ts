interface IImportPnrFromDumpsRq {
    "gds": "apollo",
    "creationDate": "2019-02-26 00:00:00",
    "pnrFields": [
        "reservation",
        "fareQuoteInfo",
        "itineraryUtcTimes",
        "destinationsFromStayTime",
        "detectedTripType",
        "contractInfo",
        "destinationsFromLinearFare",
        "fcSegmentMapping"
    ],
    "pnrDump":
        "QWE123/WS QSBYC DPBVWS  AG 05578602 01JAN" &
        "SOME RANDOM TEXT" &
        " 1.1LIB/MAR " &
        " 1 AC8623L 30MAR YWGYVR GK1   730P  838P           SA" &
        "         OPERATED BY AIR CANADA EXPRESS - JAZZ" &
        " 2 PR 117U 31MAR YVRMNL GK1   145A  615A+       SU/MO" &
        " 3 PR 116O 25APR MNLYVR GK1   700P  420P           TH" &
        " 4 AC 296L 25APR YVRYWG GK1   710P 1153P           TH" &
        "*** LINEAR FARE DATA EXISTS *** >*LF· " &
        "ATFQ-OK/$BN1-1*JCB/-*2E4T/Z0/TA2E4T/CPR/ET" &
        " FQ-CAD 930.00/CAD 25.91CA/CAD 181.15XT/CAD 1137.06 - 26FEB *JCB-ULFC.ULFC.OLFC.OLFC",
    "storedPricingDump":
        ">$BN1-1*JCB/-*2E4T" &
        "*FARE HAS A PLATING CARRIER RESTRICTION*" &
        "E-TKT REQUIRED" &
        "** PRIVATE FARES SELECTED **  " &
        "*PENALTY APPLIES*" &
        "BEST FARE FOR PSGR TYPE" &
        "LAST DATE TO PURCHASE TICKET: 30MAR19" &
        "$B-1 P26FEB19 - CAT35" &
        "YWG AC X/YVR PR MNL Q YVRMNL11.22 354.59ULFCAI/VZT05FYAYP PR" &
        "X/YVR AC YWG Q MNLYVR11.22 319.03OLFCAI/VZT05FYAYP NUC696.06" &
        "----- MUST PRICE AS B/N -- ---END ROE1.336045" &
        "FARE CAD 930.00 TAX 25.91CA TAX 25.00SQ TAX 13.90LI TAX 1.25XG" &
        "TAX 140.00YQ TAX 1.00YR TOT CAD 1137.06 " &
        "S1 /NVA30APR" &
        "S2 /NVA30APR" &
        "S3 NVB03APR/NVA30APR" &
        "S4 NVB03APR/NVA30APR" &
        "E VZT05FYAYP-VZT5CAD50/25" &
        "E VZT10MASLS-VZT10CAD50/25" &
        "TOUR CODE: CA19GPRD2      " &
        "TICKETING AGENCY 2E4T" &
        "DEFAULT PLATING CARRIER PR" &
        "BAGGAGE ALLOWANCE" &
        "JCB                                                         " &
        " AC YWGMNL  2PC                                             " &
        "   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM" &
        "   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM" &
        "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/AC" &
        "                                                                " &
        " AC MNLYWG  2PC                                             " &
        "   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM" &
        "   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM" &
        "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/AC" &
        "                                                                " &
        "CARRY ON ALLOWANCE" &
        " AC YWGYVR  2PC                                             " &
        "   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   " &
        "   BAG 2 -  NO FEE       CARRY ON HAND BAGGAGE            " &
        " PR YVRMNL  07K                                             " &
        "   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE" &
        "   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE" &
        " PR MNLYVR  07K                                             " &
        "   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE" &
        "   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE" &
        " AC YVRYWG  2PC                                             " &
        "   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   " &
        "   BAG 2 -  NO FEE       CARRY ON HAND BAGGAGE            " &
        "BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/" &
        "ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC."
}

interface IImportPnrFromDumpsRs {
    "status": "OK",
    "result": {
        "logId": "rbs-dev.5c77fdc1.6a71d5a",
        "response_code": 1,
        "response_msg": "success",
        "success": true,
        "result": {
            "accessStatus": "available",
            "fieldsAvailable": {
                "reservation": true,
                "fareQuoteInfo": true,
                "itineraryUtcTimes": true,
                "destinationsFromStayTime": true,
                "detectedTripType": true,
                "contractInfo": true,
                "destinationsFromLinearFare": true,
                "fcSegmentMapping": true
            },
            "pnrFields": {
                "reservation": {
                    "pnrInfo": {
                        "recordLocator": "QWE123",
                        "agentInitials": "WS",
                        "receivedFrom": null,
                        "reservationDate": {"raw":"01JAN","parsed":"01-01","full":"2019-01-01"},
                        "agencyInfo": {
                            "agencyId": "QSBYC",
                            "agencyToken": "DPB",
                            "agentToken": "VWS",
                            "arcNumber": "05578602"
                        }
                    },
                    "passengers": [
                        {
                            "success": true,
                            "firstName": "MAR",
                            "lastName": "LIB",
                            "age": null,
                            "dob": null,
                            "ptc": null,
                            "nameNumber": {
                                "raw": "1.1",
                                "absolute": 1,
                                "fieldNumber": "1",
                                "firstNameNumber": 1,
                                "isInfant": false
                            },
                            "ageGroup": "adult",
                            "title": ""
                        }
                    ],
                    "itinerary": [
                        {
                            "segmentNumber": 1,
                            "airline": "AC",
                            "flightNumber": "8623",
                            "bookingClass": "L",
                            "departureDate": {"parsed":"03-30","raw":"30MAR"},
                            "departureTime": {"parsed":"19:30","raw":"730P"},
                            "departureAirport": "YWG",
                            "destinationAirport": "YVR",
                            "segmentStatus": "GK",
                            "seatCount": 1,
                            "dayOffset": 0,
                            "eticket": false,
                            "daysOfWeek": "6",
                            "destinationTime": {"parsed":"20:38"},
                            "confirmedByAirline": false,
                            "operatedBy": "AIR CANADA EXPRESS - JAZZ",
                            "operatedByCode": "AC",
                            "marriage": 0,
                            "raw":
                                " 1 AC8623L 30MAR YWGYVR GK1   730P  838P           SA" &
                                "         OPERATED BY AIR CANADA EXPRESS - JAZZ",
                            "destinationDate": {"parsed":"03-30"},
                            "departureDt": {
                                "parsed": "03-30 19:30",
                                "full": "2019-03-30 19:30:00",
                                "tz": "America/Winnipeg",
                                "utc": "2019-03-31 00:30:00"
                            },
                            "destinationDt": {
                                "parsed": "03-30 20:38",
                                "full": "2019-03-30 20:38:00",
                                "tz": "America/Vancouver",
                                "utc": "2019-03-31 03:38:00"
                            },
                            "cabinClass": "economy"
                        },
                        {
                            "segmentNumber": 2,
                            "airline": "PR",
                            "flightNumber": "117",
                            "bookingClass": "U",
                            "departureDate": {"parsed":"03-31","raw":"31MAR"},
                            "departureTime": {"parsed":"01:45","raw":"145A"},
                            "departureAirport": "YVR",
                            "destinationAirport": "MNL",
                            "segmentStatus": "GK",
                            "seatCount": 1,
                            "dayOffset": 1,
                            "eticket": false,
                            "daysOfWeek": "7/1",
                            "destinationTime": {"parsed":"06:15"},
                            "confirmedByAirline": false,
                            "operatedBy": null,
                            "operatedByCode": null,
                            "marriage": 0,
                            "raw": " 2 PR 117U 31MAR YVRMNL GK1   145A  615A+       SU/MO",
                            "destinationDate": {"parsed":"04-01"},
                            "departureDt": {
                                "parsed": "03-31 01:45",
                                "full": "2019-03-31 01:45:00",
                                "tz": "America/Vancouver",
                                "utc": "2019-03-31 08:45:00"
                            },
                            "destinationDt": {
                                "parsed": "04-01 06:15",
                                "full": "2019-04-01 06:15:00",
                                "tz": "Asia/Manila",
                                "utc": "2019-03-31 22:15:00"
                            },
                            "cabinClass": "economy"
                        },
                        {
                            "segmentNumber": 3,
                            "airline": "PR",
                            "flightNumber": "116",
                            "bookingClass": "O",
                            "departureDate": {"parsed":"04-25","raw":"25APR"},
                            "departureTime": {"parsed":"19:00","raw":"700P"},
                            "departureAirport": "MNL",
                            "destinationAirport": "YVR",
                            "segmentStatus": "GK",
                            "seatCount": 1,
                            "dayOffset": 0,
                            "eticket": false,
                            "daysOfWeek": "4",
                            "destinationTime": {"parsed":"16:20"},
                            "confirmedByAirline": false,
                            "operatedBy": null,
                            "operatedByCode": null,
                            "marriage": 0,
                            "raw": " 3 PR 116O 25APR MNLYVR GK1   700P  420P           TH",
                            "destinationDate": {"parsed":"04-25"},
                            "departureDt": {
                                "parsed": "04-25 19:00",
                                "full": "2019-04-25 19:00:00",
                                "tz": "Asia/Manila",
                                "utc": "2019-04-25 11:00:00"
                            },
                            "destinationDt": {
                                "parsed": "04-25 16:20",
                                "full": "2019-04-25 16:20:00",
                                "tz": "America/Vancouver",
                                "utc": "2019-04-25 23:20:00"
                            },
                            "cabinClass": "economy"
                        },
                        {
                            "segmentNumber": 4,
                            "airline": "AC",
                            "flightNumber": "296",
                            "bookingClass": "L",
                            "departureDate": {"parsed":"04-25","raw":"25APR"},
                            "departureTime": {"parsed":"19:10","raw":"710P"},
                            "departureAirport": "YVR",
                            "destinationAirport": "YWG",
                            "segmentStatus": "GK",
                            "seatCount": 1,
                            "dayOffset": 0,
                            "eticket": false,
                            "daysOfWeek": "4",
                            "destinationTime": {"parsed":"23:53"},
                            "confirmedByAirline": false,
                            "operatedBy": null,
                            "operatedByCode": null,
                            "marriage": 0,
                            "raw": " 4 AC 296L 25APR YVRYWG GK1   710P 1153P           TH",
                            "destinationDate": {"parsed":"04-25"},
                            "departureDt": {
                                "parsed": "04-25 19:10",
                                "full": "2019-04-25 19:10:00",
                                "tz": "America/Vancouver",
                                "utc": "2019-04-26 02:10:00"
                            },
                            "destinationDt": {
                                "parsed": "04-25 23:53",
                                "full": "2019-04-25 23:53:00",
                                "tz": "America/Winnipeg",
                                "utc": "2019-04-26 04:53:00"
                            },
                            "cabinClass": "economy"
                        }
                    ],
                    "remarks": {}[],
                    "confirmationNumbers": {}[],
                    "dataExistsInfo": {
                        "mileageProgramsExist": false,
                        "fareQuoteExists": true,
                        "dividedBookingExists": false,
                        "globalInformationExists": false,
                        "itineraryRemarksExist": false,
                        "miscDocumentDataExists": false,
                        "profileAssociationsExist": false,
                        "seatDataExists": false,
                        "tinRemarksExist": false,
                        "nmePricingRecordsExist": false,
                        "eTicketDataExists": false
                    }
                },
                "fareQuoteInfo": {
                    "pricingList": [
                        {
                            "quoteNumber": null,
                            "pricingPcc": "2E4T",
                            "pricingModifiers": [
                                {
                                    "raw": "N1-1*JCB",
                                    "type": "passengers",
                                    "parsed": {
                                        "passengersSpecified": true,
                                        "passengerProperties": [
                                            {
                                                "passengerNumber": 1,
                                                "firstNameNumber": 1,
                                                "ptc": "JCB",
                                                "markup": null
                                            }
                                        ]
                                    }
                                },
                                {
                                    "raw": "-*2E4T",
                                    "type": "segments",
                                    "parsed": {
                                        "privateFaresPcc": "2E4T",
                                        "bundles": [
                                            {
                                                "segmentNumbers": number[],
                                                "fareBasis": null,
                                                "accountCode": "",
                                                "pcc": "2E4T"
                                            }
                                        ]
                                    }
                                }
                            ],
                            "pricingBlockList": [
                                {
                                    "passengerNameNumbers": [
                                        {
                                            "raw": "1.1",
                                            "absolute": 1,
                                            "fieldNumber": "1",
                                            "firstNameNumber": 1,
                                            "isInfant": false
                                        }
                                    ],
                                    "ptcInfo": {
                                        "ptc": "JCB",
                                        "ptcRequested": "JCB",
                                        "ageGroup": "adult",
                                        "ageGroupRequested": "adult",
                                        "quantity": 1,
                                        "paxLinkError": null
                                    },
                                    "lastDateToPurchase": {"raw":"30MAR19","parsed":"2019-03-30","full":"2019-03-30"},
                                    "lastTimeToPurchase": null,
                                    "validatingCarrier": "PR",
                                    "hasPrivateFaresSelectedMessage": true,
                                    "endorsementBoxLines": ["VZT05FYAYP-VZT5CAD50/25","VZT10MASLS-VZT10CAD50/25"],
                                    "fareInfo": {
                                        "baseFare": {"currency":"CAD","amount":"930.00"},
                                        "fareEquivalent": null,
                                        "totalFare": {"currency":"CAD","amount":"1137.06"},
                                        "taxList": [
                                            {"taxCode":"CA","amount":"25.91"},
                                            {"taxCode":"SQ","amount":"25.00"},
                                            {"taxCode":"LI","amount":"13.90"},
                                            {"taxCode":"XG","amount":"1.25"},
                                            {"taxCode":"YQ","amount":"140.00"},
                                            {"taxCode":"YR","amount":"1.00"}
                                        ],
                                        "fareConstruction": {
                                            "segments": [
                                                {
                                                    "airline": "AC",
                                                    "flags": [{"raw":"X","parsed":"noStopover"}],
                                                    "destination": "YVR",
                                                    "departure": "YWG"
                                                },
                                                {
                                                    "airline": "PR",
                                                    "flags": {}[],
                                                    "destination": "MNL",
                                                    "fuelSurcharge": "11.22",
                                                    "fuelSurchargeParts": ["11.22"],
                                                    "fare": "354.59",
                                                    "fareBasis": "ULFCAI",
                                                    "ticketDesignator": "VZT05FYAYP",
                                                    "departure": "YVR"
                                                },
                                                {
                                                    "airline": "PR",
                                                    "flags": [{"raw":"X","parsed":"noStopover"}],
                                                    "destination": "YVR",
                                                    "departure": "MNL"
                                                },
                                                {
                                                    "airline": "AC",
                                                    "flags": {}[],
                                                    "destination": "YWG",
                                                    "fuelSurcharge": "11.22",
                                                    "fuelSurchargeParts": ["11.22"],
                                                    "fare": "319.03",
                                                    "fareBasis": "OLFCAI",
                                                    "ticketDesignator": "VZT05FYAYP",
                                                    "departure": "YVR"
                                                }
                                            ],
                                            "markup": null,
                                            "currency": "NUC",
                                            "fareAndMarkupInNuc": "696.06",
                                            "fare": "696.06",
                                            "hasEndMark": true,
                                            "infoMessage": "",
                                            "rateOfExchange": "1.336045",
                                            "facilityCharges": {}[],
                                            "hasHiddenFares": false
                                        }
                                    },
                                    "baggageInfo": null,
                                    "bankSellingRate": null,
                                    "bsrCurrencyFrom": null,
                                    "bsrCurrencyTo": null,
                                    "fareType": "published"
                                }
                            ]
                        }
                    ],
                    "isPublishedPricingNeeded": false
                },
                "itineraryUtcTimes": {
                    "times": [
                        {
                            "segmentNumber": 1,
                            "departureDt": {
                                "parsed": "03-30 19:30",
                                "full": "2019-03-30 19:30:00",
                                "tz": "America/Winnipeg",
                                "utc": "2019-03-31 00:30:00"
                            },
                            "destinationDt": {
                                "parsed": "03-30 20:38",
                                "full": "2019-03-30 20:38:00",
                                "tz": "America/Vancouver",
                                "utc": "2019-03-31 03:38:00"
                            }
                        },
                        {
                            "segmentNumber": 2,
                            "departureDt": {
                                "parsed": "03-31 01:45",
                                "full": "2019-03-31 01:45:00",
                                "tz": "America/Vancouver",
                                "utc": "2019-03-31 08:45:00"
                            },
                            "destinationDt": {
                                "parsed": "04-01 06:15",
                                "full": "2019-04-01 06:15:00",
                                "tz": "Asia/Manila",
                                "utc": "2019-03-31 22:15:00"
                            }
                        },
                        {
                            "segmentNumber": 3,
                            "departureDt": {
                                "parsed": "04-25 19:00",
                                "full": "2019-04-25 19:00:00",
                                "tz": "Asia/Manila",
                                "utc": "2019-04-25 11:00:00"
                            },
                            "destinationDt": {
                                "parsed": "04-25 16:20",
                                "full": "2019-04-25 16:20:00",
                                "tz": "America/Vancouver",
                                "utc": "2019-04-25 23:20:00"
                            }
                        },
                        {
                            "segmentNumber": 4,
                            "departureDt": {
                                "parsed": "04-25 19:10",
                                "full": "2019-04-25 19:10:00",
                                "tz": "America/Vancouver",
                                "utc": "2019-04-26 02:10:00"
                            },
                            "destinationDt": {
                                "parsed": "04-25 23:53",
                                "full": "2019-04-25 23:53:00",
                                "tz": "America/Winnipeg",
                                "utc": "2019-04-26 04:53:00"
                            }
                        }
                    ]
                },
                "destinationsFromStayTime": {"segmentNumbers":[2,4],"finalDestination":2},
                "detectedTripType": {"tripType":"RT"},
                "contractInfo": {
                    "isStoredInConsolidatorCurrency": true,
                    "isBasicEconomy": false,
                    "fareType": "published",
                    "isTourFare": false,
                    "cabinClassInfo": {
                        "wholeCabinClass": "economy",
                        "segments": [
                            {"segmentNumber":1,"cabinClass":"economy"},
                            {"segmentNumber":2,"cabinClass":"economy"},
                            {"segmentNumber":3,"cabinClass":"economy"},
                            {"segmentNumber":4,"cabinClass":"economy"}
                        ]
                    }
                },
                "destinationsFromLinearFare": {
                    "segmentNumbers": [2,4],
                    "finalDestination": 2,
                    "isBrokenFare": false
                },
                "fcSegmentMapping": {
                    "segments": [
                        {
                            "pnrSegmentNumber": 1,
                            "fcSegmentNumber": 1,
                            "pricingNumber": null,
                            "ptc": "JCB",
                            "fareBasis": null,
                            "ticketDesignator": null
                        },
                        {
                            "pnrSegmentNumber": 2,
                            "fcSegmentNumber": 2,
                            "pricingNumber": null,
                            "ptc": "JCB",
                            "fareBasis": "ULFCAI",
                            "ticketDesignator": "VZT05FYAYP"
                        },
                        {
                            "pnrSegmentNumber": 3,
                            "fcSegmentNumber": 3,
                            "pricingNumber": null,
                            "ptc": "JCB",
                            "fareBasis": null,
                            "ticketDesignator": null
                        },
                        {
                            "pnrSegmentNumber": 4,
                            "fcSegmentNumber": 4,
                            "pricingNumber": null,
                            "ptc": "JCB",
                            "fareBasis": "OLFCAI",
                            "ticketDesignator": "VZT05FYAYP"
                        }
                    ]
                }
            },
            "dumps": [
                {
                    "dumpNumber": 1,
                    "cmd": null,
                    "dump":
                        "QWE123/WS QSBYC DPBVWS  AG 05578602 01JAN" &
                        "SOME RANDOM TEXT" &
                        " 1.1LIB/MAR " &
                        " 1 AC8623L 30MAR YWGYVR GK1   730P  838P           SA" &
                        "         OPERATED BY AIR CANADA EXPRESS - JAZZ" &
                        " 2 PR 117U 31MAR YVRMNL GK1   145A  615A+       SU/MO" &
                        " 3 PR 116O 25APR MNLYVR GK1   700P  420P           TH" &
                        " 4 AC 296L 25APR YVRYWG GK1   710P 1153P           TH" &
                        "*** LINEAR FARE DATA EXISTS *** >*LF· " &
                        "ATFQ-OK/$BN1-1*JCB/-*2E4T/Z0/TA2E4T/CPR/ET" &
                        " FQ-CAD 930.00/CAD 25.91CA/CAD 181.15XT/CAD 1137.06 - 26FEB *JCB-ULFC.ULFC.OLFC.OLFC",
                    "pnrFields": [
                        "reservation",
                        "itineraryUtcTimes",
                        "destinationsFromStayTime",
                        "detectedTripType",
                        "contractInfo",
                        "destinationsFromLinearFare",
                        "fcSegmentMapping"
                    ]
                },
                {
                    "dumpNumber": 2,
                    "cmd": null,
                    "dump":
                        ">$BN1-1*JCB/-*2E4T" &
                        "*FARE HAS A PLATING CARRIER RESTRICTION*" &
                        "E-TKT REQUIRED" &
                        "** PRIVATE FARES SELECTED **  " &
                        "*PENALTY APPLIES*" &
                        "BEST FARE FOR PSGR TYPE" &
                        "LAST DATE TO PURCHASE TICKET: 30MAR19" &
                        "$B-1 P26FEB19 - CAT35" &
                        "YWG AC X/YVR PR MNL Q YVRMNL11.22 354.59ULFCAI/VZT05FYAYP PR" &
                        "X/YVR AC YWG Q MNLYVR11.22 319.03OLFCAI/VZT05FYAYP NUC696.06" &
                        "----- MUST PRICE AS B/N -- ---END ROE1.336045" &
                        "FARE CAD 930.00 TAX 25.91CA TAX 25.00SQ TAX 13.90LI TAX 1.25XG" &
                        "TAX 140.00YQ TAX 1.00YR TOT CAD 1137.06 " &
                        "S1 /NVA30APR" &
                        "S2 /NVA30APR" &
                        "S3 NVB03APR/NVA30APR" &
                        "S4 NVB03APR/NVA30APR" &
                        "E VZT05FYAYP-VZT5CAD50/25" &
                        "E VZT10MASLS-VZT10CAD50/25" &
                        "TOUR CODE: CA19GPRD2      " &
                        "TICKETING AGENCY 2E4T" &
                        "DEFAULT PLATING CARRIER PR" &
                        "BAGGAGE ALLOWANCE" &
                        "JCB                                                         " &
                        " AC YWGMNL  2PC                                             " &
                        "   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM" &
                        "   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM" &
                        "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/AC" &
                        "                                                                " &
                        " AC MNLYWG  2PC                                             " &
                        "   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM" &
                        "   BAG 2 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM" &
                        "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/AC" &
                        "                                                                " &
                        "CARRY ON ALLOWANCE" &
                        " AC YWGYVR  2PC                                             " &
                        "   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   " &
                        "   BAG 2 -  NO FEE       CARRY ON HAND BAGGAGE            " &
                        " PR YVRMNL  07K                                             " &
                        "   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE" &
                        "   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE" &
                        " PR MNLYVR  07K                                             " &
                        "   BAG 1 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE" &
                        "   BAG 2 -  CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE" &
                        " AC YVRYWG  2PC                                             " &
                        "   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   " &
                        "   BAG 2 -  NO FEE       CARRY ON HAND BAGGAGE            " &
                        "BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/" &
                        "ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.",
                    "pnrFields": [
                        "fareQuoteInfo",
                        "contractInfo",
                        "destinationsFromLinearFare",
                        "fcSegmentMapping"
                    ]
                }
            ],
            "errorData": {}[],
            "messages": {}[]
        },
        "errors": string[],
        "sessionLogId": null
    },
    "logId": "rbs-dev.5c77fdc1.6a71d5a"
}