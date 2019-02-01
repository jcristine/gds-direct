
interface IRbsBagPtcBlock     {
    "pricingNumber": 0,
    "subPricingNumber": 0,
    "passengerNameNumbers": {}[],
    "ptcInfo": {
        "ptc": "ADT",
        "ptcRequested": null,
        "ageGroup": "adult",
        "ageGroupRequested": null,
        "quantity": 0,
        "paxLinkError": null
    },
    "parsed": {
        "baggageAllowanceBlocks": [
            {
                "ptc": "ADT",
                "segments": [
                    {
                        "segmentDetails": {
                            "airline": "PS",
                            "departureAirport": "KIV",
                            "destinationAirport": "RIX",
                            "bagWithoutFeeNumber": "2PC",
                            "bagWithoutFeeNumberParsed": {"amount":"2","units":"pieces"},
                            "isAvailable": true,
                            "error": null
                        },
                        "bags": [
                            {
                                "bagNumber": "1",
                                "flags": ["noFeeFlag"],
                                "bagDescription": "UPTO70LB/32KG AND UPTO62LI/158LCM",
                                "weightInLb": "70",
                                "weightInKg": "32",
                                "sizeInInches": "62",
                                "sizeInCm": "158",
                                "feeAmount": null,
                                "feeCurrency": null
                            },
                            {
                                "bagNumber": "2",
                                "flags": ["noFeeFlag"],
                                "bagDescription": "UPTO70LB/32KG AND UPTO62LI/158LCM",
                                "weightInLb": "70",
                                "weightInKg": "32",
                                "sizeInInches": "62",
                                "sizeInCm": "158",
                                "feeAmount": null,
                                "feeCurrency": null
                            }
                        ]
                    }
                ]
            }
        ],
        "carryOnAllowanceBlock": {
            "segments": [
                {
                    "segmentDetails": {
                        "airline": "PS",
                        "departureAirport": "KIV",
                        "destinationAirport": "IEV",
                        "bagWithoutFeeNumber": null,
                        "bagWithoutFeeNumberParsed": null,
                        "isAvailable": false,
                        "error": "CARRY ON ALLOWANCE DATA NOT AVAILABLE"
                    },
                    "flags": {}[],
                    "bags": {}[]
                },
                {
                    "segmentDetails": {
                        "airline": "PS",
                        "departureAirport": "IEV",
                        "destinationAirport": "RIX",
                        "bagWithoutFeeNumber": null,
                        "bagWithoutFeeNumberParsed": null,
                        "isAvailable": false,
                        "error": "CARRY ON ALLOWANCE DATA NOT AVAILABLE"
                    },
                    "flags": {}[],
                    "bags": {}[]
                }
            ]
        },
        "misc": {"embargoBlock":{"segments":{}[]},"flags":{}[]}
    },
    "raw":
        "BAGGAGE ALLOWANCE" &
        "ADT                                                         " &
        " PS KIVRIX  2PC                                             " &
        "   BAG 1 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM" &
        "   BAG 2 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM" &
        "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/PS" &
        "                                                                " &
        "CARRY ON ALLOWANCE" &
        " PS KIVIEV  CARRY ON ALLOWANCE DATA NOT AVAILABLE           " &
        " PS IEVRIX  CARRY ON ALLOWANCE DATA NOT AVAILABLE           " &
        "",
}

interface IRbsPnrData {
    "reservation": {
        "raw":
            "NO NAMES" &
            " 1 PS 898D 10MAY KIVKBP SS1   720A  825A *         FR   E  1" &
            " 2 PS 185D 10MAY KBPRIX SS1   920A 1055A *         FR   E  1" &
            " 3 AY1072Y 20MAY RIXHEL SS1  1015A 1125A *         MO   E" &
            "         OPERATED BY NORDIC REGIONAL AIRLINES" &
            " 4 IB 350Y 20MAY HELJFK SS1  1220P  205P *         MO   E" &
            "         OPERATED BY FINNAIR" &
            "",
        "error": null,
        "parsed": {
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
        }
    },
    "currentPricing": {
        "cmd": "$B/S1|2&$B/S3|4",
        "raw":
            ">$B/S1-*2G55|2-*2G55" &
            "*FARE GUARANTEED AT TICKET ISSUANCE*" &
            "" &
            "E-TKT REQUIRED" &
            "        **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >$B/DASO;" &
            "LAST DATE TO PURCHASE TICKET: 10MAY19" &
            "$B-1 C17OCT18     " &
            "KIV PS X/IEV PS RIX 600.58D1EP4 NUC600.58END ROE0.86249" &
            "FARE EUR 518.00 EQU USD 600.00 TAX 2.90JQ TAX 10.40MD TAX" &
            "7.20WW TAX 4.00UA TAX 8.50YK TAX 18.00YQ TAX 30.00YR TOT USD" &
            "681.00  " &
            "E NONEND/RES RSTR/RBK FOC" &
            "TICKETING AGENCY 2G55" &
            "DEFAULT PLATING CARRIER PS" &
            "RATE USED IN EQU TOTAL IS BSR 1EUR - 1.157439USD" &
            "BAGGAGE ALLOWANCE" &
            "ADT                                                         " &
            " PS KIVRIX  2PC                                             " &
            "   BAG 1 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM" &
            "   BAG 2 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM" &
            "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/PS" &
            "                                                                CARRY ON ALLOWANCE" &
            " PS KIVIEV  CARRY ON ALLOWANCE DATA NOT AVAILABLE           " &
            " PS IEVRIX  CARRY ON ALLOWANCE DATA NOT AVAILABLE           " &
            "" &
            "&" &
            ">$B/S3-*2G55|4-*2G55" &
            "*FARE GUARANTEED AT TICKET ISSUANCE*" &
            "" &
            "*FARE HAS A PLATING CARRIER RESTRICTION*" &
            "E-TKT REQUIRED" &
            "        **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >$B/DASO;" &
            "LAST DATE TO PURCHASE TICKET: 14NOV18" &
            "$B-1 C17OCT18     " &
            "RIX AY X/HEL IB NYC Q RIXNYC12.17M1991.90Y1N0C9M0 NUC2004.07END" &
            "ROE0.86249" &
            "FARE EUR 1729.00 EQU USD 2001.00 TAX 18.30US TAX 3.96XA TAX" &
            "7.00XY TAX 5.77YC TAX 4.00LV TAX 7.50XM TAX 4.80WL TAX 1.40XU" &
            "TAX 157.40YQ TOT USD 2211.13  " &
            "E 55 NOEND/CHGS-REF PERMIT" &
            "E NO RESTRICTION APPLIES" &
            "TICKETING AGENCY 2G55" &
            "DEFAULT PLATING CARRIER IB" &
            "RATE USED IN EQU TOTAL IS BSR 1EUR - 1.157439USD" &
            "BAGGAGE ALLOWANCE" &
            "ADT                                                         " &
            " AY RIXNYC  1PC                                             " &
            "   BAG 1 -  NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM" &
            "   BAG 2 -  75.00 EUR    UPTO50LB/23KG AND UPTO62LI/158LCM" &
            "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/AY" &
            "                                                                CARRY ON ALLOWANCE" &
            " AY RIXHEL  1PC                                             " &
            "   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   " &
            " AY HELNYC  1PC                                             " &
            "   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   " &
            "BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/" &
            "ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC." &
            "",
        "parsed": {
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
        }
    },
    "bagPtcPricingBlocks": IRbsBagPtcBlock[],
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

interface IRbsGetPqItineraryRs {
    "pnrData": IRbsPnrData,
    "error": null,
    "status": "executed",
    "messages": string[],
    "userMessages": string[],
    "sessionInfo": {
        "isAlive": true,
        "canCreatePq": true,
        "pcc": "2I61",
        "area": "A",
        "recordLocator": "",
        "hasPnr": "1",
        "isPnrStored": "0",
        "canCreatePqErrors": string[],
        "canCreatePqFor": ["adult"]
    },
    "calledCommands": [
        {
            "cmd": "*R",
            "output":
                "NO NAMES" &
                " 1 DL8456Z 24APR SFOCDG GK2   825P  420P+       WE/TH" &
                "         OPERATED BY AIR FRANCE" &
                " 2 AF7626J 25APR CDGBOD GK2   705P  815P           TH" &
                " 3 DL9359Z 11MAY BODAMS GK2   630A  815A           SA" &
                "         OPERATED BY KLM ROYAL DUTCH AIRL" &
                " 4 DL9380Z 11MAY AMSSFO GK2   950A 1145A           SA" &
                "         OPERATED BY KLM ROYAL DUTCH AIRL" &
                ""
            "tabCommands": string[],
            "clearScreen": true
        }
    ],
    "allCommands": [
        {
            "cmd": "*R",
            "output":
                "NO NAMES" &
                " 1 DL8456Z 24APR SFOCDG GK2   825P  420P+       WE/TH" &
                "         OPERATED BY AIR FRANCE" &
                " 2 AF7626J 25APR CDGBOD GK2   705P  815P           TH" &
                " 3 DL9359Z 11MAY BODAMS GK2   630A  815A           SA" &
                "         OPERATED BY KLM ROYAL DUTCH AIRL" &
                " 4 DL9380Z 11MAY AMSSFO GK2   950A 1145A           SA" &
                "         OPERATED BY KLM ROYAL DUTCH AIRL" &
                ""
            "tabCommands": string[],
            "clearScreen": true,
            "type": "redisplayPnr"
        },
        {
            "cmd": "$B/:A",
            "output":
                ">$B/-*2I61/:A" &
                "*FARE HAS A PLATING CARRIER RESTRICTION*" &
                "E-TKT REQUIRED" &
                "        **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >$B/DASO·" &
                "** PRIVATE FARES SELECTED **  " &
                "*PENALTY APPLIES*" &
                "LAST DATE TO PURCHASE TICKET: 25DEC18" &
                "$B-1-2 A10DEC18     " &
                "SFO DL X/PAR AF BOD M505.77ZK7B1RD2/LN1U DL X/AMS DL SFO Q" &
                "BODSFO14.25M505.77ZK7B1RD3/LN1U NUC1025.79END ROE1.0" &
                "FARE USD 1026.00 TAX 5.60AY TAX 36.60US TAX 3.96XA TAX 4.50XF" &
                "TAX 7.00XY TAX 5.77YC TAX 26.80FR TAX 51.20IZ TAX 12.00QW TAX" &
                "6.30QX TAX 7.40CJ TAX 7.30RN TAX 1106.00YR TAX 13.00YQ TOT USD" &
                "2319.43   " &
                "S1 /NVA24OCT" &
                "S2 /NVA24OCT" &
                "S3 NVB28APR/NVA24OCT" &
                "S4 NVB28APR/NVA24OCT" &
                "E NONEND/NONREF/LN19" &
                "E PROOF OF LAND PKG REQUIRED" &
                "TICKETING AGENCY 2I61" &
                "DEFAULT PLATING CARRIER DL" &
                "US PFC: XF SFO4.5 " &
                "BAGGAGE ALLOWANCE" &
                "ADT                                                         " &
                " DL SFOBOD  2PC                                             " &
                "   BAG 1 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM" &
                "   BAG 2 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM" &
                "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/DL" &
                "                                                                " &
                " DL BODSFO  2PC                                             " &
                "   BAG 1 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM" &
                "   BAG 2 -  NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM" &
                "   VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/DL" &
                "                                                                " &
                "CARRY ON ALLOWANCE" &
                " AF SFOPAR  2PC                                             " &
                "   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   " &
                "   BAG 2 -  NO FEE       UPTO20LB/9KG AND UPTO45LI/115LCM " &
                " AF PARBOD  1PC                                             " &
                "   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO45LI/115LCM" &
                " KL BODAMS  2PC                                             " &
                "   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   " &
                "   BAG 2 -  NO FEE       UPTO20LB/9KG AND UPTO45LI/115LCM " &
                " KL AMSSFO  2PC                                             " &
                "   BAG 1 -  NO FEE       CARRYON HAND BAGGAGE ALLOWANCE   " &
                "   BAG 2 -  NO FEE       UPTO20LB/9KG AND UPTO45LI/115LCM " &
                "BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/" &
                "ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC." &
                ""
            "tabCommands": ["$B/DASO"],
            "clearScreen": true,
            "type": "priceItinerary"
        }
    ]
}