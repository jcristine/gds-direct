
module.exports = {
    "2": {
        "id": 2,
        "highlightGroup": "pricingScreen",
        "color": "outputFont",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 6,
        "name": "baseFareAmount",
        "label": "Base Fare amount",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bold\"]",
        "cmdPatterns": [
            {"id":2,"ruleId":2,"dialect":"apollo","cmdPattern":"\\$B.*|\\*LF|T\\:\\$B|FS\\*\\d{1,2}","onClickCommand":null,"regexError":0},
            {"id":4,"ruleId":2,"dialect":"sabre","cmdPattern":"WP.*|\\*PQ","onClickCommand":null,"regexError":0},
            {"id":6,"ruleId":2,"dialect":"amadeus","cmdPattern":"FX.*","onClickCommand":null,"regexError":0},
            {"id":580,"ruleId":2,"dialect":"galileo","cmdPattern":"FQ.*","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":2,"ruleId":2,"gds":"apollo","pattern":"(?P<value>^FARE [A-Z]{3} \\d{1,4}\\.\\d{2})","regexError":0},
            {"id":4,"ruleId":2,"gds":"sabre","pattern":"^\\s+(?P<value>\\d{1,5}\\.\\d{2})\\s.*TTL$","regexError":0},
            {"id":6,"ruleId":2,"gds":"amadeus","pattern":"(^\\s+TOTALS\\s+\\d\\s+)(?P<value>\\d{1,5}\\.\\d{2})","regexError":0},
            {"id":8,"ruleId":2,"gds":"galileo","pattern":"^FQG.+\\s(?P<value>[A-Z]{3}\\s+\\d+\\.\\d+)(.*$)","regexError":0}
        ]
    },
    "4": {
        "id": 4,
        "highlightGroup": "tariffDisplay",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 7,
        "name": "fareBasisInTariffDisplay",
        "label": "Fare Basis in Tariff Display",
        "message": "Click to view Exchange/Refund rules",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":8,"ruleId":4,"dialect":"apollo","cmdPattern":"\\$D.*","onClickCommand":"$V{lnNumber}/16/MDA","regexError":0},
            {"id":10,"ruleId":4,"dialect":"sabre","cmdPattern":"FQ.*","onClickCommand":null,"regexError":0},
            {"id":12,"ruleId":4,"dialect":"amadeus","cmdPattern":"FQD.*","onClickCommand":null,"regexError":0},
            {"id":504,"ruleId":4,"dialect":"galileo","cmdPattern":"FD.*","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":10,"ruleId":4,"gds":"apollo","pattern":"^(\\s{0,2})(\\d)(.{14,16})(\\s)(?P<value1>\\S{1,9})","regexError":0},
            {"id":12,"ruleId":4,"gds":"sabre","pattern":"(^\\s*\\d+\\s+)(?P<value>\\w+)","regexError":0},
            {"id":14,"ruleId":4,"gds":"amadeus","pattern":"(^\\d{2,3}\\s)(?P<value>\\w+)","regexError":0},
            {"id":16,"ruleId":4,"gds":"galileo","pattern":"(^\\s{0,2}\\d+\\s+\\w+\\s+\\d+\\.\\d+.\\s)(?P<value>\\w+)","regexError":0}
        ]
    },
    "6": {
        "id": 6,
        "highlightGroup": "availabilityScreen",
        "color": "specialHighlight",
        "backgroundColor": "",
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "AirlineCode",
        "label": "Airline Code",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bold\"]",
        "cmdPatterns": [
            {"id":14,"ruleId":6,"dialect":"apollo","cmdPattern":"A.*","onClickCommand":"S*AIR/{pattern}/MDA","regexError":0},
            {"id":16,"ruleId":6,"dialect":"sabre","cmdPattern":"1.*","onClickCommand":"","regexError":0},
            {"id":18,"ruleId":6,"dialect":"amadeus","cmdPattern":"A.*","onClickCommand":"","regexError":0},
            {"id":460,"ruleId":6,"dialect":"galileo","cmdPattern":"A.*","onClickCommand":",kejip","regexError":0}
        ],
        "patterns": [
            {"id":18,"ruleId":6,"gds":"apollo","pattern":"^\\d(\\*|\\+|\\s)\\s\\K([A-Z0-9]{2})","regexError":0},
            {"id":20,"ruleId":6,"gds":"sabre","pattern":"(^\\d\\K\\w{2}\\/\\K(?P<value>\\w{2}))|(^\\d\\K(?P<value1>\\w{2}))","regexError":0},
            {"id":22,"ruleId":6,"gds":"amadeus","pattern":"^\\s(\\d{1}|\\s{1})\\K(\\w{2}|\\s{3}\\K\\w{2})","regexError":0},
            {"id":24,"ruleId":6,"gds":"galileo","pattern":"^((\\d.{20})|(\\d.{23}))\\K([A-Z0-9]{2})","regexError":0}
        ]
    },
    "8": {
        "id": 8,
        "highlightGroup": "pricingScreen",
        "color": "usedCommand",
        "backgroundColor": "",
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "PrivateFareSelectedInPricing",
        "label": "\"Private Fare Selected\" in Pricing",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":20,"ruleId":8,"dialect":"apollo","cmdPattern":"\\$B.*|\\*LF|T\\:\\$B|FS\\*\\d{1,2}","onClickCommand":"","regexError":0},
            {"id":22,"ruleId":8,"dialect":"sabre","cmdPattern":"WP.*|\\*PQ","onClickCommand":"","regexError":0},
            {"id":24,"ruleId":8,"dialect":"amadeus","cmdPattern":"FX.*","onClickCommand":"","regexError":0},
            {"id":554,"ruleId":8,"dialect":"galileo","cmdPattern":"FQ.*","onClickCommand":"","regexError":0}
        ],
        "patterns": [
            {"id":26,"ruleId":8,"gds":"apollo","pattern":"(\\*\\* PRIVATE FARES SELECTED \\*\\*)|(\\*\\* BEST FARE FOR PRIVATE FARES REQUEST \\*\\*)","regexError":0},
            {"id":28,"ruleId":8,"gds":"sabre","pattern":"^PRIVATE FARE APPLIED","regexError":0},
            {"id":30,"ruleId":8,"gds":"amadeus","pattern":"(\\*\\* PRIVATE FARES SELECTED \\*\\*)|(\\*\\* BEST FARE FOR PRIVATE FARES REQUEST \\*\\*)","regexError":0},
            {"id":32,"ruleId":8,"gds":"galileo","pattern":"(\\*\\* PRIVATE FARES SELECTED \\*\\*)|(\\*\\* BEST FARE FOR PRIVATE FARES REQUEST \\*\\*)","regexError":0}
        ]
    },
    "10": {
        "id": 10,
        "highlightGroup": "pricingScreen",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "totalPriceInPricingOutput",
        "label": "Total Price in pricing output",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bordered\",\"italic\",\"large\"]",
        "cmdPatterns": [
            {"id":26,"ruleId":10,"dialect":"apollo","cmdPattern":"\\$B.*|\\*LF|T\\:\\$B|FS\\*\\d{1,2}","onClickCommand":null,"regexError":0},
            {"id":28,"ruleId":10,"dialect":"sabre","cmdPattern":"WP.*|\\*PQ","onClickCommand":null,"regexError":0},
            {"id":30,"ruleId":10,"dialect":"amadeus","cmdPattern":"FX.*","onClickCommand":null,"regexError":0},
            {"id":590,"ruleId":10,"dialect":"galileo","cmdPattern":"FQ.*","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":34,"ruleId":10,"gds":"apollo","pattern":"(TOT\\s(USD|CAD)\\s\\d{1,8}\\.\\d{2})","regexError":0},
            {"id":36,"ruleId":10,"gds":"sabre","pattern":"^.{51,55}\\s\\K\\d{1,5}\\.\\d{2}TTL","regexError":0},
            {"id":38,"ruleId":10,"gds":"amadeus","pattern":"^\\s*TOTALS.*\\s\\K(\\d{1,5}\\.\\d{2}$)|(^USD\\s{1,3}\\d{1,5}\\.\\d{2}$)","regexError":0},
            {"id":40,"ruleId":10,"gds":"galileo","pattern":"^GRAND TOTAL INCLUDING TAXES.+\\s\\K\\d{1,4}\\.\\d{2}","regexError":0}
        ]
    },
    "12": {
        "id": 12,
        "highlightGroup": "tariffDisplay",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "routingIndicatorInTariffDisplay",
        "label": "\"Routing\" Indicator in Tariff Display",
        "message": "Click to see the Routing Rules",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":32,"ruleId":12,"dialect":"apollo","cmdPattern":"\\$D.*","onClickCommand":"$LR{lnNumber}/MDA","regexError":0},
            {"id":34,"ruleId":12,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":36,"ruleId":12,"dialect":"amadeus","cmdPattern":"FQD.*","onClickCommand":null,"regexError":0},
            {"id":562,"ruleId":12,"dialect":"galileo","cmdPattern":"FD.*","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":42,"ruleId":12,"gds":"apollo","pattern":"^(.{50,65})(?P<value1>\\bR\\b)","regexError":0},
            {"id":44,"ruleId":12,"gds":"sabre","pattern":null,"regexError":0},
            {"id":46,"ruleId":12,"gds":"amadeus","pattern":"^\\d.*(?P<value>R$)","regexError":0},
            {"id":48,"ruleId":12,"gds":"galileo","pattern":"^\\s+\\d+.{53}(?P<value>R)","regexError":0}
        ]
    },
    "14": {
        "id": 14,
        "highlightGroup": "pricingScreen",
        "color": "warningMessage",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "loadedTDSForNonSPLTPublishedFaresInPricing",
        "label": "Loaded TD's for non-SPLT Published Fares in Pricing",
        "message": "It's a Published discounted fare, that can be sold under $B:N price. The TOTAL PRICE on the screen can be used as NET your price",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":38,"ruleId":14,"dialect":"apollo","cmdPattern":"\\$B.*|\\*LF|T\\:\\$B|FS\\*\\d{1,2}","onClickCommand":null,"regexError":0},
            {"id":40,"ruleId":14,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":42,"ruleId":14,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":528,"ruleId":14,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":50,"ruleId":14,"gds":"apollo","pattern":"(\\/(ITN | SKY)\\S{7}\\s)","regexError":0},
            {"id":52,"ruleId":14,"gds":"sabre","pattern":null,"regexError":0},
            {"id":54,"ruleId":14,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":56,"ruleId":14,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "16": {
        "id": 16,
        "highlightGroup": "tariffDisplay",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "onlySSFTicketDesignatorsInTariffDisplay",
        "label": "Only SSF Ticket Designators in Tariff Display",
        "message": "This is a Super Saver Fare. Make sure to check the fare rules in order to build the flight properly",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"dotted\",\"bold\"]",
        "cmdPatterns": [
            {"id":44,"ruleId":16,"dialect":"apollo","cmdPattern":"\\$D.*","onClickCommand":null,"regexError":0},
            {"id":46,"ruleId":16,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":48,"ruleId":16,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":548,"ruleId":16,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":58,"ruleId":16,"gds":"apollo","pattern":"^(\\s{5})(TD:)(?P<ticket_designator>SSF\\d{1})","regexError":0},
            {"id":60,"ruleId":16,"gds":"sabre","pattern":null,"regexError":0},
            {"id":62,"ruleId":16,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":64,"ruleId":16,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "18": {
        "id": 18,
        "highlightGroup": "pricingScreen",
        "color": "warningMessage",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "loadedTDSForSPLTPublishedFaresInPricing",
        "label": "Loaded TD's for SPLT Published Fares in Pricing",
        "message": "It's a Published discounted fare, that can be sold under Published Fare ($B:N). The Correct NET Price can be seen by using the pricing command shown below in section \"MUST PRICE AS ....\"",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":50,"ruleId":18,"dialect":"apollo","cmdPattern":"\\$B.*|\\*LF|T\\:\\$B|FS\\*\\d{1,2}","onClickCommand":null,"regexError":0},
            {"id":52,"ruleId":18,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":54,"ruleId":18,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":532,"ruleId":18,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":66,"ruleId":18,"gds":"apollo","pattern":"(?P<value>\\/SPL\\S{7})\\s","regexError":0},
            {"id":68,"ruleId":18,"gds":"sabre","pattern":null,"regexError":0},
            {"id":70,"ruleId":18,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":72,"ruleId":18,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "20": {
        "id": 20,
        "highlightGroup": "pricingScreen",
        "color": "warningMessage",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "loadedTDSForPrivateFaresInPricing",
        "label": "Loaded TD's for Private Fares in Pricing",
        "message": "This is an ITN special private contract. Make sure to check additional rules in Endorsement, as well as correct Pricing Command in \"MUST PRICE AS \" section",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":56,"ruleId":20,"dialect":"apollo","cmdPattern":"\\$B.*|\\*LF|T\\:\\$B|FS\\*\\d{1,2}","onClickCommand":null,"regexError":0},
            {"id":58,"ruleId":20,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":60,"ruleId":20,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":530,"ruleId":20,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":74,"ruleId":20,"gds":"apollo","pattern":"\\/(?P<ticketDesignator>NET[A-Z0-9]{7})\\s","regexError":0},
            {"id":76,"ruleId":20,"gds":"sabre","pattern":null,"regexError":0},
            {"id":78,"ruleId":20,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":80,"ruleId":20,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "22": {
        "id": 22,
        "highlightGroup": "pricingScreen",
        "color": "warningMessage",
        "backgroundColor": "",
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "BagageInfo13PCs",
        "label": "Bagage Info (1-3 PCs)",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":62,"ruleId":22,"dialect":"apollo","cmdPattern":"\\$B.*|\\*LF|T\\:\\$B","onClickCommand":"","regexError":0},
            {"id":64,"ruleId":22,"dialect":"sabre","cmdPattern":"WP\\*BAG","onClickCommand":"","regexError":0},
            {"id":66,"ruleId":22,"dialect":"amadeus","cmdPattern":"FX.*","onClickCommand":"","regexError":0},
            {"id":478,"ruleId":22,"dialect":"galileo","cmdPattern":"FQ.*","onClickCommand":"","regexError":0}
        ],
        "patterns": [
            {"id":82,"ruleId":22,"gds":"apollo","pattern":"BAGGAGE ALLOWANCE\\n.*\\n.*(3PC|2PC|1PC)\\b","regexError":0},
            {"id":84,"ruleId":22,"gds":"sabre","pattern":"^BAG ALLOWANCE\\s+\\-[A-Z]{6}\\-(01P|02P|03P)","regexError":0},
            {"id":86,"ruleId":22,"gds":"amadeus","pattern":"^.{58}\\K(1P$|2P$|3P$)","regexError":0},
            {"id":88,"ruleId":22,"gds":"galileo","pattern":"^BAGGAGE ALLOWANCE\\n.*$\\n.*\\s(1PC|2PC|3PC)","regexError":0}
        ]
    },
    "24": {
        "id": 24,
        "highlightGroup": "pricingScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "messageToREBOOKSegmentsInPricing",
        "label": "Message to REBOOK segments in Pricing",
        "message": "Click to Rebook",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 1,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 1,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":68,"ruleId":24,"dialect":"apollo","cmdPattern":"\\$B.*","onClickCommand":"$BBQ01","regexError":0},
            {"id":70,"ruleId":24,"dialect":"sabre","cmdPattern":"WP.*","onClickCommand":"WPNCB","regexError":0},
            {"id":72,"ruleId":24,"dialect":"amadeus","cmdPattern":"FXA.*","onClickCommand":"FXR","regexError":0},
            {"id":536,"ruleId":24,"dialect":"galileo","cmdPattern":"FQ.*","onClickCommand":"FQBBK","regexError":0}
        ],
        "patterns": [
            {"id":90,"ruleId":24,"gds":"apollo","pattern":"(REBOOK PNR SEGMENTS|REBOOK PNR SEGMENT)(\\s{3,4})(?P<value1>\\d.+)","regexError":0},
            {"id":92,"ruleId":24,"gds":"sabre","pattern":"(CHANGE BOOKING CLASS \\-(.{3}))(?P<value1>.+)","regexError":0},
            {"id":94,"ruleId":24,"gds":"amadeus","pattern":"^(?P<value>REBOOK TO CHANGE BOOKING CLASS AS SPECIFIED)$","regexError":0},
            {"id":96,"ruleId":24,"gds":"galileo","pattern":"(REBOOK BF SEGMENTS\\s)(?P<value1>\\d.+)(\\s\\*\\*\\*)","regexError":0}
        ]
    },
    "26": {
        "id": 26,
        "highlightGroup": "pnrScreen",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "hXUCNOUNGKSegmentsInPNR",
        "label": "HX/UC/NO/UN/GK Segments in PNR",
        "message": "Segment with this status must be removed from PNR",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":74,"ruleId":26,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":null,"regexError":0},
            {"id":76,"ruleId":26,"dialect":"sabre","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|¤[A-Z]|0.*","onClickCommand":null,"regexError":0},
            {"id":78,"ruleId":26,"dialect":"amadeus","cmdPattern":"RT.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":null,"regexError":0},
            {"id":518,"ruleId":26,"dialect":"galileo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":98,"ruleId":26,"gds":"apollo","pattern":"[A-Z]{6}\\s(?P<value>(HX\\d)|(GK\\d)|(UC\\d)|(NO\\d)|(UN\\d)|(LL\\d)|(NN\\d))","regexError":0},
            {"id":100,"ruleId":26,"gds":"sabre","pattern":"\\s[A-Z]{6}\\s(?P<value>(HX\\d)|(GK\\d)|(UC\\d)|(NO\\d)|(UN\\d)|(LL\\d)|(NN\\d))\\s","regexError":0},
            {"id":102,"ruleId":26,"gds":"amadeus","pattern":"[A-Z]{6}\\s(?P<value>(HX\\d)|(GK\\d)|(UC\\d)|(NO\\d)|(UN\\d)|(LL\\d)|(NN\\d))","regexError":0},
            {"id":104,"ruleId":26,"gds":"galileo","pattern":"(HX\\d)|(GK\\d)|(UC\\d)|(NO\\d)|(UN\\d)|(LL\\d)|(NN\\d)","regexError":0}
        ]
    },
    "28": {
        "id": 28,
        "highlightGroup": "pnrScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "lFInPNR",
        "label": "*LF in PNR",
        "message": "Click to open the stored fare",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 1,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bold\",\"bordered\"]",
        "cmdPatterns": [
            {"id":80,"ruleId":28,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|0.*","onClickCommand":"*LF/MDA","regexError":0},
            {"id":82,"ruleId":28,"dialect":"sabre","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|0.*","onClickCommand":"*PQ","regexError":0},
            {"id":84,"ruleId":28,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":526,"ruleId":28,"dialect":"galileo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|0.*","onClickCommand":"*FF","regexError":0}
        ],
        "patterns": [
            {"id":106,"ruleId":28,"gds":"apollo","pattern":"\\*LF\\·","regexError":0},
            {"id":108,"ruleId":28,"gds":"sabre","pattern":"^PRICE QUOTE RECORD EXISTS","regexError":0},
            {"id":110,"ruleId":28,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":112,"ruleId":28,"gds":"galileo","pattern":"\\*FF","regexError":0}
        ]
    },
    "30": {
        "id": 30,
        "highlightGroup": "pnrScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "hKSSKLInPNR",
        "label": "HK, SS, KL in PNR",
        "message": "Click to open a seat map",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":86,"ruleId":30,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":"9V/S{lnNumber}/MDA","regexError":0},
            {"id":88,"ruleId":30,"dialect":"sabre","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|¤[A-Z]|0.*","onClickCommand":"4G{lnNumber}*","regexError":0},
            {"id":90,"ruleId":30,"dialect":"amadeus","cmdPattern":"RT.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|SS.*","onClickCommand":"SM{lnNumber}","regexError":0},
            {"id":514,"ruleId":30,"dialect":"galileo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":"SA*S{lnNumber}/MDA","regexError":0}
        ],
        "patterns": [
            {"id":114,"ruleId":30,"gds":"apollo","pattern":"\\b((HK\\d)\\b|\\b(KL\\d)\\b|\\b(SS\\d))\\b","regexError":0},
            {"id":116,"ruleId":30,"gds":"sabre","pattern":"\\b((HK\\d)\\b|\\b(KL\\d)\\b|\\b(SS\\d))\\b","regexError":0},
            {"id":118,"ruleId":30,"gds":"amadeus","pattern":"(HK\\d)|(KL\\d)|(DK\\d)","regexError":0},
            {"id":120,"ruleId":30,"gds":"galileo","pattern":"(HK\\d)|(KL\\d)|(HS\\d)","regexError":0}
        ]
    },
    "32": {
        "id": 32,
        "highlightGroup": "pnrScreen",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "segmentODInPNRs",
        "label": "Segment O&D in PNRs",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":92,"ruleId":32,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":null,"regexError":0},
            {"id":94,"ruleId":32,"dialect":"sabre","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|¤[A-Z]|0.*","onClickCommand":null,"regexError":0},
            {"id":96,"ruleId":32,"dialect":"amadeus","cmdPattern":"RT.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|0.*","onClickCommand":null,"regexError":0},
            {"id":566,"ruleId":32,"dialect":"galileo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":122,"ruleId":32,"gds":"apollo","pattern":"^(.\\d{1,2}\\s)(.{12,13})(\\s)(?P<value1>\\w{6})(\\s)","regexError":0},
            {"id":124,"ruleId":32,"gds":"sabre","pattern":"^(.\\d{1,2}\\s)(.{12,13})(\\s)(?P<value1>\\w{6})(\\s)","regexError":0},
            {"id":126,"ruleId":32,"gds":"amadeus","pattern":"^(.\\d{1,2}\\s)(.{12,13})(\\s)(?P<value1>\\w{6})(\\s)","regexError":0},
            {"id":128,"ruleId":32,"gds":"galileo","pattern":"^(.\\d{1,2}\\s)(.{12,13})(\\s)(?P<value1>\\w{6})(\\s)","regexError":0}
        ]
    },
    "34": {
        "id": 34,
        "highlightGroup": "pnrScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "indicatorOfChildInfantInPNR",
        "label": "Indicator of Child/Infant in PNR",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":98,"ruleId":34,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":null,"regexError":0},
            {"id":100,"ruleId":34,"dialect":"sabre","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|¤[A-Z]|0.*","onClickCommand":null,"regexError":0},
            {"id":102,"ruleId":34,"dialect":"amadeus","cmdPattern":"RT.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|0.*","onClickCommand":null,"regexError":0},
            {"id":520,"ruleId":34,"dialect":"galileo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":130,"ruleId":34,"gds":"apollo","pattern":"(\\*P\\-C\\d{1,2})|(\\*P\\-INF)|(\\*P\\-CNN)|(\\*[0-9]{1,2}[A-Z]{3}[0-9]{1,2})","regexError":0},
            {"id":132,"ruleId":34,"gds":"sabre","pattern":"(\\*P\\-C\\d{1,2})|(\\*P\\-INF)|(\\*P\\-CNN)|(\\*[0-9]{1,2}[A-Z]{3}[0-9]{1,2})","regexError":0},
            {"id":134,"ruleId":34,"gds":"amadeus","pattern":"(\\*P\\-C\\d{1,2})|(\\*P\\-INF)|(\\*P\\-CNN)|(\\*[0-9]{1,2}[A-Z]{3}[0-9]{1,2})","regexError":0},
            {"id":136,"ruleId":34,"gds":"galileo","pattern":"(\\*P\\-C\\d{1,2})|(\\*P\\-INF)|(\\*P\\-CNN)|(\\*[0-9]{1,2}[A-Z]{3}[0-9]{1,2})","regexError":0}
        ]
    },
    "36": {
        "id": 36,
        "highlightGroup": "pnrScreen",
        "color": "warningMessage",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "paxNamesInPNR",
        "label": "Pax Names in PNR",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":104,"ruleId":36,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]","onClickCommand":null,"regexError":0},
            {"id":106,"ruleId":36,"dialect":"sabre","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|¤[A-Z]","onClickCommand":null,"regexError":0},
            {"id":108,"ruleId":36,"dialect":"amadeus","cmdPattern":"RT.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR","onClickCommand":null,"regexError":0},
            {"id":550,"ruleId":36,"dialect":"galileo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":138,"ruleId":36,"gds":"apollo","pattern":"((\\s\\d\\.\\d)|(\\s\\d\\.\\I\\/\\d))(?P<value1>[A-Z]+\\/[A-Z ]+[A-Z]+)","regexError":0},
            {"id":140,"ruleId":36,"gds":"sabre","pattern":"((\\s\\d\\.\\d)|(\\s\\d\\.\\I\\/\\d))(?P<value1>[A-Z]+\\/[A-Z ]+[A-Z]+)","regexError":0},
            {"id":142,"ruleId":36,"gds":"amadeus","pattern":"((\\s\\d\\.\\d)|(\\s\\d\\.\\I\\/\\d))(?P<value1>[A-Z]+\\/[A-Z ]+[A-Z]+)","regexError":0},
            {"id":144,"ruleId":36,"gds":"galileo","pattern":"((\\s\\d\\.\\d)|(\\s\\d\\.\\I\\/\\d))(?P<value1>[A-Z]+\\/[A-Z ]+[A-Z]+)","regexError":0}
        ]
    },
    "38": {
        "id": 38,
        "highlightGroup": "availabilityScreen",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "showingAServiceStopInAvailability",
        "label": "Showing a service stop in Availability",
        "message": "There is an additional Service Stop",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"dotted\"]",
        "cmdPatterns": [
            {"id":110,"ruleId":38,"dialect":"apollo","cmdPattern":"A.*","onClickCommand":null,"regexError":0},
            {"id":112,"ruleId":38,"dialect":"sabre","cmdPattern":"1.*","onClickCommand":null,"regexError":0},
            {"id":114,"ruleId":38,"dialect":"amadeus","cmdPattern":"AD.*","onClickCommand":null,"regexError":0},
            {"id":570,"ruleId":38,"dialect":"galileo","cmdPattern":"A.*","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":146,"ruleId":38,"gds":"apollo","pattern":"(1$)|(CHG  1$)","regexError":0},
            {"id":148,"ruleId":38,"gds":"sabre","pattern":"^\\d.{43,52}\\s\\K0","regexError":0},
            {"id":150,"ruleId":38,"gds":"amadeus","pattern":"^\\s.{62}\\K1","regexError":0},
            {"id":152,"ruleId":38,"gds":"galileo","pattern":"^\\d\\s\\w{3}\\K\\d{1}","regexError":0}
        ]
    },
    "40": {
        "id": 40,
        "highlightGroup": "availabilityScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "aM",
        "label": "A*M·",
        "message": "Click to view Meals Plus screen",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 1,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":116,"ruleId":40,"dialect":"apollo","cmdPattern":"A.*","onClickCommand":"A*M","regexError":0},
            {"id":118,"ruleId":40,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":120,"ruleId":40,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":466,"ruleId":40,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":154,"ruleId":40,"gds":"apollo","pattern":"(A\\*M\\·)","regexError":0},
            {"id":156,"ruleId":40,"gds":"sabre","pattern":null,"regexError":0},
            {"id":158,"ruleId":40,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":160,"ruleId":40,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "42": {
        "id": 42,
        "highlightGroup": "availabilityScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "aC1",
        "label": "A*C1",
        "message": "Expanded Classes screen",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":122,"ruleId":42,"dialect":"apollo","cmdPattern":"A.*","onClickCommand":null,"regexError":0},
            {"id":124,"ruleId":42,"dialect":"sabre","cmdPattern":"1.*","onClickCommand":null,"regexError":0},
            {"id":126,"ruleId":42,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":454,"ruleId":42,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":162,"ruleId":42,"gds":"apollo","pattern":"(CLASSES\\>)(?P<value1>A\\*C\\·\\.\\.)","regexError":0},
            {"id":164,"ruleId":42,"gds":"sabre","pattern":"(^\\* - FOR ADDITIONAL CLASSES ENTER) (?P<value>1\\*C)","regexError":0},
            {"id":166,"ruleId":42,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":168,"ruleId":42,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "44": {
        "id": 44,
        "highlightGroup": "availabilityScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "returnToCurrentAvailabilityScreen",
        "label": "Return to Current Availability Screen",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 1,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 1,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":128,"ruleId":44,"dialect":"apollo","cmdPattern":"A.*","onClickCommand":"A*C","regexError":0},
            {"id":130,"ruleId":44,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":132,"ruleId":44,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":560,"ruleId":44,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":170,"ruleId":44,"gds":"apollo","pattern":"(CURRENT\\>)(?P<value1>A\\*C\\·)","regexError":0},
            {"id":172,"ruleId":44,"gds":"sabre","pattern":null,"regexError":0},
            {"id":174,"ruleId":44,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":176,"ruleId":44,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "46": {
        "id": 46,
        "highlightGroup": "pricingScreen",
        "color": "startSession",
        "backgroundColor": "",
        "highlightType": "customValue",
        "priority": 0,
        "name": "FareConstruction",
        "label": "Fare Construction",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bold\",\"italic\"]",
        "cmdPatterns": [
            {"id":134,"ruleId":46,"dialect":"apollo","cmdPattern":"\\$B.*|\\*LF|T\\:\\$B|FS\\*\\d{1,2}","onClickCommand":"","regexError":0},
            {"id":136,"ruleId":46,"dialect":"sabre","cmdPattern":"WP.*|\\*PQ","onClickCommand":"","regexError":0},
            {"id":138,"ruleId":46,"dialect":"amadeus","cmdPattern":"FX.*","onClickCommand":"","regexError":0},
            {"id":506,"ruleId":46,"dialect":"galileo","cmdPattern":"\\*FF\\d","onClickCommand":"","regexError":0}
        ],
        "patterns": [
            {"id":178,"ruleId":46,"gds":"apollo","pattern":"(\\s(\\d{1,5}|M\\d{1,5}|\\d{1,2}M\\d{1,5})\\.\\d{2})(?<value>([A-Z][A-Z0-9]{2,9}))(\\s|\\H|\\/[A-Z].+)","regexError":0},
            {"id":180,"ruleId":46,"gds":"sabre","pattern":"((?<![a-zA-Z])(\\w{2})\\s(?P<value>\\w{3}\\d+\\.\\d+))|(?<value2>M\\d+\\.\\d+\\w{2})","regexError":0},
            {"id":182,"ruleId":46,"gds":"amadeus","pattern":"(?!ROE)([A-Z]{3})(?P<value>\\d{1,5}\\.\\d{2}(?!END)\\w+)","regexError":0},
            {"id":184,"ruleId":46,"gds":"galileo","pattern":"(\\w{2}\\s{1}[A-Z]{3}\\s{1})(?P<value>M\\d{1,5}\\.\\d{2}|\\d{1,5}\\.\\d{2})(\\s)","regexError":0}
        ]
    },
    "48": {
        "id": 48,
        "highlightGroup": "pricingScreen",
        "color": "outputFont",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "xInFareConstruction",
        "label": "X/ in Fare Construction",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bold\"]",
        "cmdPatterns": [
            {"id":140,"ruleId":48,"dialect":"apollo","cmdPattern":"\\$B.*|\\*LF|T\\:\\$B|FS\\*\\d{1,2}","onClickCommand":null,"regexError":0},
            {"id":142,"ruleId":48,"dialect":"sabre","cmdPattern":"WP.*|\\*PQ","onClickCommand":null,"regexError":0},
            {"id":144,"ruleId":48,"dialect":"amadeus","cmdPattern":"FX.*","onClickCommand":null,"regexError":0},
            {"id":598,"ruleId":48,"dialect":"galileo","cmdPattern":"\\*FF\\d","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":186,"ruleId":48,"gds":"apollo","pattern":"(\\s)(?P<flightVia>(X\\/|X\\/E\\/)[A-Z]{3})(\\s)","regexError":0},
            {"id":188,"ruleId":48,"gds":"sabre","pattern":null,"regexError":0},
            {"id":190,"ruleId":48,"gds":"amadeus","pattern":"(\\s)(?P<flightVia>(X\\/|X\\/E\\/)[A-Z]{3})(\\s)","regexError":0},
            {"id":192,"ruleId":48,"gds":"galileo","pattern":"\\w{2}(\\s)(?P<flightVia>(X\\/|X\\/E\\/)[A-Z]{3})(\\s)","regexError":0}
        ]
    },
    "50": {
        "id": 50,
        "highlightGroup": "others",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "canBeUsed",
        "label": "Can be used",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 0,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":146,"ruleId":50,"dialect":"apollo","cmdPattern":"0.*","onClickCommand":null,"regexError":0},
            {"id":148,"ruleId":50,"dialect":"sabre","cmdPattern":"0.*","onClickCommand":null,"regexError":0},
            {"id":150,"ruleId":50,"dialect":"amadeus","cmdPattern":"SS.*","onClickCommand":null,"regexError":0},
            {"id":574,"ruleId":50,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":194,"ruleId":50,"gds":"apollo","pattern":"\\bSS[1-9]\\b","regexError":0},
            {"id":196,"ruleId":50,"gds":"sabre","pattern":"\\*SS[1-9]\\b","regexError":0},
            {"id":198,"ruleId":50,"gds":"amadeus","pattern":"\\bDK[1-9]\\b","regexError":0},
            {"id":200,"ruleId":50,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "52": {
        "id": 52,
        "highlightGroup": "pnrScreen",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "tHISPNRHASBEENCHANGEDIGNOREBEFOREPROCEEDING",
        "label": "THIS PNR HAS BEEN CHANGED - IGNORE BEFORE PROCEEDING",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 1,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":152,"ruleId":52,"dialect":"apollo","cmdPattern":"\\*R|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]","onClickCommand":"IR","regexError":0},
            {"id":154,"ruleId":52,"dialect":"sabre","cmdPattern":"\\*R|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|¤[A-Z]","onClickCommand":"IR","regexError":0},
            {"id":156,"ruleId":52,"dialect":"amadeus","cmdPattern":"RT|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|","onClickCommand":"IR","regexError":0},
            {"id":584,"ruleId":52,"dialect":"galileo","cmdPattern":"\\*R|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]","onClickCommand":"IR","regexError":0}
        ],
        "patterns": [
            {"id":202,"ruleId":52,"gds":"apollo","pattern":"\\*\\* THIS PNR HAS BEEN CHANGED \\- IGNORE BEFORE PROCEEDING \\*\\*|\\*\\* THIS PNR IS CURRENTLY IN USE \\*\\*","regexError":0},
            {"id":204,"ruleId":52,"gds":"sabre","pattern":"(SIMULTANEOUS CHANGES TO PNR \\- USE IR TO IGNORE AND RETRIEVE PNR)|(VERIFY ORDER OF ITINERARY SEGMENTS \\- MODIFY OR END TRANSACTION)","regexError":0},
            {"id":206,"ruleId":52,"gds":"amadeus","pattern":"^PNR UPDATED BY PARALLEL PROCESS-PLEASE VERIFY PNR CONTENT","regexError":0},
            {"id":208,"ruleId":52,"gds":"galileo","pattern":"(\\*\\* THIS BF IS CURRENTLY IN USE \\*\\*)|(\\*\\* THIS BF HAS BEEN CHANGED - IGNORE BEFORE PROCEEDING \\*\\* >IR)","regexError":0}
        ]
    },
    "54": {
        "id": 54,
        "highlightGroup": "pnrScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "iRIgnoreChangesInPNR",
        "label": ">IR· Ignore Changes in PNR",
        "message": "Click to Ignore Changes",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 1,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":158,"ruleId":54,"dialect":"apollo","cmdPattern":"\\*R|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]","onClickCommand":"IR","regexError":0},
            {"id":160,"ruleId":54,"dialect":"sabre","cmdPattern":"\\*R|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|¤[A-Z]","onClickCommand":"IR","regexError":0},
            {"id":162,"ruleId":54,"dialect":"amadeus","cmdPattern":"RT|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR","onClickCommand":"IR","regexError":0},
            {"id":524,"ruleId":54,"dialect":"galileo","cmdPattern":"\\*R|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]","onClickCommand":"IR","regexError":0}
        ],
        "patterns": [
            {"id":210,"ruleId":54,"gds":"apollo","pattern":"\\>IR\\·","regexError":0},
            {"id":212,"ruleId":54,"gds":"sabre","pattern":null,"regexError":0},
            {"id":214,"ruleId":54,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":216,"ruleId":54,"gds":"galileo","pattern":">IR","regexError":0}
        ]
    },
    "56": {
        "id": 56,
        "highlightGroup": "availabilityScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "nOMORELATERFLIGHTS",
        "label": "NO MORE LATER FLIGHTS",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 1,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":164,"ruleId":56,"dialect":"apollo","cmdPattern":"A.*","onClickCommand":null,"regexError":0},
            {"id":166,"ruleId":56,"dialect":"sabre","cmdPattern":"1.*","onClickCommand":null,"regexError":0},
            {"id":168,"ruleId":56,"dialect":"amadeus","cmdPattern":"AD.*","onClickCommand":null,"regexError":0},
            {"id":544,"ruleId":56,"dialect":"galileo","cmdPattern":"A.*","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":218,"ruleId":56,"gds":"apollo","pattern":"(NO MORE LATER FLIGHTS.+)","regexError":0},
            {"id":220,"ruleId":56,"gds":"sabre","pattern":"^NO MORE($|\\s\\w{2})","regexError":0},
            {"id":222,"ruleId":56,"gds":"amadeus","pattern":"^NO LATER FLTS.*$","regexError":0},
            {"id":224,"ruleId":56,"gds":"galileo","pattern":"NO MORE LATER FLIGHTS.+$","regexError":0}
        ]
    },
    "58": {
        "id": 58,
        "highlightGroup": "others",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "xXXInFareConstruction",
        "label": "/-XXX in Fare Construction",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 1,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":170,"ruleId":58,"dialect":"apollo","cmdPattern":"\\$B.*|T\\:\\$B","onClickCommand":null,"regexError":0},
            {"id":172,"ruleId":58,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":174,"ruleId":58,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":600,"ruleId":58,"dialect":"galileo","cmdPattern":null,"onClickCommand":"","regexError":0}
        ],
        "patterns": [
            {"id":226,"ruleId":58,"gds":"apollo","pattern":"\\s\\/\\-[A-Z]{3}\\s","regexError":0},
            {"id":228,"ruleId":58,"gds":"sabre","pattern":null,"regexError":0},
            {"id":230,"ruleId":58,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":232,"ruleId":58,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "60": {
        "id": 60,
        "highlightGroup": "pnrScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "tInPNR",
        "label": "*T· in PNR",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":176,"ruleId":60,"dialect":"apollo","cmdPattern":"\\*R|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]","onClickCommand":"*T","regexError":0},
            {"id":178,"ruleId":60,"dialect":"sabre","cmdPattern":"\\*R|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|¤[A-Z]","onClickCommand":"*T","regexError":0},
            {"id":180,"ruleId":60,"dialect":"amadeus","cmdPattern":"RT.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR","onClickCommand":"RTTN","regexError":0},
            {"id":588,"ruleId":60,"dialect":"galileo","cmdPattern":"\\*R|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]","onClickCommand":"*HTI","regexError":0}
        ],
        "patterns": [
            {"id":234,"ruleId":60,"gds":"apollo","pattern":"\\*T\\·","regexError":0},
            {"id":236,"ruleId":60,"gds":"sabre","pattern":"TKT\\/TIME LIMIT\\n\\s+\\d\\.\\KT\\-.*$","regexError":0},
            {"id":238,"ruleId":60,"gds":"amadeus","pattern":"FA PAX\\s\\d+\\-\\d+","regexError":0},
            {"id":240,"ruleId":60,"gds":"galileo","pattern":">\\K\\*HTI;","regexError":0}
        ]
    },
    "62": {
        "id": 62,
        "highlightGroup": "pnrScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "hTEInPNR",
        "label": "*HTE· in PNR",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 1,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":182,"ruleId":62,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]","onClickCommand":"*HTE/MDA","regexError":0},
            {"id":184,"ruleId":62,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":186,"ruleId":62,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":516,"ruleId":62,"dialect":"galileo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]","onClickCommand":"*HTE/MDA","regexError":0}
        ],
        "patterns": [
            {"id":242,"ruleId":62,"gds":"apollo","pattern":"\\*HTE\\·","regexError":0},
            {"id":244,"ruleId":62,"gds":"sabre","pattern":null,"regexError":0},
            {"id":246,"ruleId":62,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":248,"ruleId":62,"gds":"galileo","pattern":">\\K\\*HTE\\;","regexError":0}
        ]
    },
    "64": {
        "id": 64,
        "highlightGroup": "pnrScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "9DInPNR",
        "label": "9D· in PNR",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":188,"ruleId":64,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]","onClickCommand":"9D/MDA","regexError":0},
            {"id":190,"ruleId":64,"dialect":"sabre","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|¤[A-Z]","onClickCommand":"*B","regexError":0},
            {"id":192,"ruleId":64,"dialect":"amadeus","cmdPattern":"RT.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR","onClickCommand":"RTSTR","regexError":0},
            {"id":452,"ruleId":64,"dialect":"galileo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]","onClickCommand":"*SD","regexError":0}
        ],
        "patterns": [
            {"id":250,"ruleId":64,"gds":"apollo","pattern":"9D\\·","regexError":0},
            {"id":252,"ruleId":64,"gds":"sabre","pattern":"^SEATS\\/BOARDING PASS","regexError":0},
            {"id":254,"ruleId":64,"gds":"amadeus","pattern":"RTSTR$","regexError":0},
            {"id":256,"ruleId":64,"gds":"galileo","pattern":"\\*SD;$","regexError":0}
        ]
    },
    "66": {
        "id": 66,
        "highlightGroup": "pnrScreen",
        "color": "startSession",
        "backgroundColor": "",
        "highlightType": "customValue",
        "priority": 0,
        "name": "BookedRBDInPNR",
        "label": "Booked RBD in PNR",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":194,"ruleId":66,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":"","regexError":0},
            {"id":196,"ruleId":66,"dialect":"sabre","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":"","regexError":0},
            {"id":198,"ruleId":66,"dialect":"amadeus","cmdPattern":"RT.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|SS.*","onClickCommand":"","regexError":0},
            {"id":482,"ruleId":66,"dialect":"galileo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":"","regexError":0}
        ],
        "patterns": [
            {"id":258,"ruleId":66,"gds":"apollo","pattern":"^(\\d|\\s)(\\d\\s)(?<value1>[A-Z,0-9]{2})(.{4})(?<value2>\\w)\\b","regexError":0},
            {"id":260,"ruleId":66,"gds":"sabre","pattern":"^(\\s\\d\\s)(?P<value1>[A-Z,0-9]{2})(.{4})(?P<value2>[A-Z])\\b","regexError":0},
            {"id":262,"ruleId":66,"gds":"amadeus","pattern":"(^\\s+\\d\\s+)(?P<airline>\\w{2})(\\s*\\d+\\s+)(?P<RBD>[A-Z]{1})","regexError":0},
            {"id":264,"ruleId":66,"gds":"galileo","pattern":"(^\\s\\d\\.\\s)(?P<Airline>\\w{2})(\\s+\\d+\\s)(?P<RBD>[A-Z]{1})","regexError":0}
        ]
    },
    "68": {
        "id": 68,
        "highlightGroup": "pnrScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "pAProfileAssociationRemark",
        "label": "*PA - Profile Association Remark",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 1,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":200,"ruleId":68,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]","onClickCommand":"*PA/MDA","regexError":0},
            {"id":202,"ruleId":68,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":204,"ruleId":68,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":480,"ruleId":68,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":266,"ruleId":68,"gds":"apollo","pattern":"\\*PA\\·","regexError":0},
            {"id":268,"ruleId":68,"gds":"sabre","pattern":null,"regexError":0},
            {"id":270,"ruleId":68,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":272,"ruleId":68,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "70": {
        "id": 70,
        "highlightGroup": "ticketMask",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "ticketNumberAndOtherInfoInHTE",
        "label": "Ticket Number and other Info in *HTE",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":206,"ruleId":70,"dialect":"apollo","cmdPattern":"\\*HTE|\\*TE\\d{1,3}|\\*TE\\/\\d{13}","onClickCommand":null,"regexError":0},
            {"id":208,"ruleId":70,"dialect":"sabre","cmdPattern":"\\*TE\\d{1,3}|WETR\\*\\d{1,3}","onClickCommand":null,"regexError":0},
            {"id":210,"ruleId":70,"dialect":"amadeus","cmdPattern":"TWD.*","onClickCommand":null,"regexError":0},
            {"id":586,"ruleId":70,"dialect":"galileo","cmdPattern":"\\*HTE|\\*TE\\d{1,3}","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {
                "id": 274,
                "ruleId": 70,
                "gds": "apollo",
                "pattern": "TKT\\:\\s\\K[0-9 -]{13,19}|NAME\\:\\s\\K[A-Z \\/]{20,50}|CC\\:\\s\\K[A-Z0-9]{15,20}|ISSUED\\:\\s\\K.{7}|FOP\\:\\K.{23,26}|PSEUDO\\:\\s.{4}|IATA\\:\\s\\K\\d{8}|TOTAL\\s(USD|CAD|GBP)\\s{1,2}\\d{1,4}\\.\\d{2}",
                "regexError": 0
            },
            {
                "id": 276,
                "ruleId": 70,
                "gds": "sabre",
                "pattern": "TKT\\:\\K\\d{13,16}|ISSUED\\:\\K.{7}|PCC\\:\\K.{4}|IATA\\:\\K\\d{8}|NAME\\:\\K[A-Z \\/]{20,30}|FOP\\:\\s\\K.{23,24}|TOTAL\\s{3}\\K(USD|CAD|GBP)\\d{1,4}\\.\\d{2}",
                "regexError": 0
            },
            {"id":278,"ruleId":70,"gds":"amadeus","pattern":"^TKT-\\K7387111858240|^TOTAL\\s+\\K.*$|^\\sOD.*IOI\\-\\K\\d+|^\\s{3}\\d\\.[A-Z]+\\/[A-Z]+","regexError":0},
            {
                "id": 280,
                "ruleId": 70,
                "gds": "galileo",
                "pattern": "^TKT:\\s\\K\\d+\\s\\d+\\s\\d+|NAME:\\s\\K.*$|^ISSUED:\\s\\K\\d{2}[A-Z]{3}\\d{2}|FOP:\\K[A-Z]+|^PSEUDO:\\s\\K\\w+|PLATING CARRIER:\\s\\K\\w+|ISO:\\s\\K\\w+|IATA:\\s\\K\\d+|TOTAL USD\\s\\K.*$|RLOC\\s\\w{2}\\s\\K\\w+",
                "regexError": 0
            }
        ]
    },
    "72": {
        "id": 72,
        "highlightGroup": "ticketMask",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "badTicketCouponStatus",
        "label": "\"Bad\" Ticket Coupon status",
        "message": "Contact Customer Support for assistance",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":212,"ruleId":72,"dialect":"apollo","cmdPattern":"\\*HTE|\\*TE\\d{1,3}\\*HTE\\/MDA|\\*TE\\/\\d{13}","onClickCommand":null,"regexError":0},
            {"id":214,"ruleId":72,"dialect":"sabre","cmdPattern":"WETR.*","onClickCommand":null,"regexError":0},
            {"id":216,"ruleId":72,"dialect":"amadeus","cmdPattern":"TWD.*","onClickCommand":null,"regexError":0},
            {"id":474,"ruleId":72,"dialect":"galileo","cmdPattern":"\\*HTE|\\*TE\\d{1,3}|\\*HTE\\/MDA","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":282,"ruleId":72,"gds":"apollo","pattern":"^\\s{3}(?P<value>SUSP|UNVL|VOID|CLSD)\\s","regexError":0},
            {"id":284,"ruleId":72,"gds":"sabre","pattern":"(?P<value2>SUSP|UNVL|VOID|CLSD)$","regexError":0},
            {"id":286,"ruleId":72,"gds":"amadeus","pattern":"^\\s\\d+\\s.{43}(?P<badStatus>S|U|V|Z)","regexError":0},
            {"id":288,"ruleId":72,"gds":"galileo","pattern":"^\\s+(?P<value>SUSP|UNVL|VOID|CLSD)","regexError":0}
        ]
    },
    "74": {
        "id": 74,
        "highlightGroup": "ticketMask",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "goodTicketCouponStatuses",
        "label": "\"Good\" Ticket Coupon statuses",
        "message": "No actions are required",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":218,"ruleId":74,"dialect":"apollo","cmdPattern":"\\*HTE.*|\\*TE\\d{1,3}|\\*TE\\/\\d{13}","onClickCommand":null,"regexError":0},
            {"id":220,"ruleId":74,"dialect":"sabre","cmdPattern":"WETR.*","onClickCommand":null,"regexError":0},
            {"id":222,"ruleId":74,"dialect":"amadeus","cmdPattern":"TWD.*","onClickCommand":null,"regexError":0},
            {"id":510,"ruleId":74,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":290,"ruleId":74,"gds":"apollo","pattern":"^\\s{3}(?P<value>OPEN|ARPT|CKIN)\\s","regexError":0},
            {"id":292,"ruleId":74,"gds":"sabre","pattern":"(?P<value2>OPEN|ARPT|CKIN)$","regexError":0},
            {"id":294,"ruleId":74,"gds":"amadeus","pattern":"^\\s\\d+\\s.{43}(?P<badStatus>O|A|C)","regexError":0},
            {"id":296,"ruleId":74,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "76": {
        "id": 76,
        "highlightGroup": "availabilityScreen",
        "color": "specialHighlight",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "departureCity",
        "label": "Departure city",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bold\"]",
        "cmdPatterns": [
            {"id":224,"ruleId":76,"dialect":"apollo","cmdPattern":"A.*","onClickCommand":"S*CTY/{pattern}","regexError":0},
            {"id":226,"ruleId":76,"dialect":"sabre","cmdPattern":"1.*","onClickCommand":null,"regexError":0},
            {"id":228,"ruleId":76,"dialect":"amadeus","cmdPattern":"AD.*","onClickCommand":null,"regexError":0},
            {"id":542,"ruleId":76,"dialect":"galileo","cmdPattern":"A.*","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":298,"ruleId":76,"gds":"apollo","pattern":"^\\d.{39}\\K([A-Z]{3})","regexError":0},
            {"id":300,"ruleId":76,"gds":"sabre","pattern":"^\\d.{23}\\K([A-Z]{3})","regexError":0},
            {"id":302,"ruleId":76,"gds":"amadeus","pattern":"^\\s*\\d+.{33}\\K[A-Z]{3}","regexError":0},
            {"id":304,"ruleId":76,"gds":"galileo","pattern":"^(\\d\\s)\\K([A-Z]{3})","regexError":0}
        ]
    },
    "78": {
        "id": 78,
        "highlightGroup": "pnrScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "rMItineraryRemarks",
        "label": "RM* - Itinerary Remarks",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 1,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":230,"ruleId":78,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]","onClickCommand":"RM*/MDA","regexError":0},
            {"id":232,"ruleId":78,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":234,"ruleId":78,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":592,"ruleId":78,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":306,"ruleId":78,"gds":"apollo","pattern":"RM\\*\\·","regexError":0},
            {"id":308,"ruleId":78,"gds":"sabre","pattern":null,"regexError":0},
            {"id":310,"ruleId":78,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":312,"ruleId":78,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "80": {
        "id": 80,
        "highlightGroup": "ticketMask",
        "color": "specialHighlight",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "exchangedRefundedUsedLiftedFlownCouponStatusesInHTE",
        "label": "\"Exchanged/Refunded/Used/Lifted/Flown\" coupon statuses in *HTE",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":236,"ruleId":80,"dialect":"apollo","cmdPattern":"\\*HTE.*|\\*TE\\d{1,3}|\\*TE\\/\\d{13}","onClickCommand":null,"regexError":0},
            {"id":238,"ruleId":80,"dialect":"sabre","cmdPattern":"WETR.*","onClickCommand":null,"regexError":0},
            {"id":240,"ruleId":80,"dialect":"amadeus","cmdPattern":"TWD.*","onClickCommand":null,"regexError":0},
            {"id":488,"ruleId":80,"dialect":"galileo","cmdPattern":"\\*HTE.*|\\*TE\\d{1,3}","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":314,"ruleId":80,"gds":"apollo","pattern":"^\\s{3}(?P<value>EXCH|RFND|USED|LFTD|FLWN)\\s","regexError":0},
            {"id":316,"ruleId":80,"gds":"sabre","pattern":"(?P<value2>EXCH|RFND|USED|LFTD|FLWN)$","regexError":0},
            {"id":318,"ruleId":80,"gds":"amadeus","pattern":"^\\s\\d+\\s.{43}(?P<status>E|R|F|L)","regexError":0},
            {"id":320,"ruleId":80,"gds":"galileo","pattern":"^\\s{3}(?P<value>EXCH|RFND|USED|LFTD|FLWN)\\s","regexError":0}
        ]
    },
    "82": {
        "id": 82,
        "highlightGroup": "seatMap",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "availableSeatsWithADDITIONALINFORMATIONBELOW",
        "label": "Available seats with ADDITIONAL INFORMATION BELOW",
        "message": "The seat is available, but check the additional info below",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 0,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":242,"ruleId":82,"dialect":"apollo","cmdPattern":"9V\\/S.*","onClickCommand":null,"regexError":0},
            {"id":244,"ruleId":82,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":246,"ruleId":82,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":472,"ruleId":82,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":322,"ruleId":82,"gds":"apollo","pattern":"^.{9}\\s\\K|([A-L]\\*\\b)","regexError":0},
            {"id":324,"ruleId":82,"gds":"sabre","pattern":null,"regexError":0},
            {"id":326,"ruleId":82,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":328,"ruleId":82,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "84": {
        "id": 84,
        "highlightGroup": "seatMap",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "chargeableSeats",
        "label": "Chargeable seats",
        "message": "CHARGEABLE SEAT",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 0,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":248,"ruleId":84,"dialect":"apollo","cmdPattern":"9V\\/S.*","onClickCommand":null,"regexError":0},
            {"id":250,"ruleId":84,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":252,"ruleId":84,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":486,"ruleId":84,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":330,"ruleId":84,"gds":"apollo","pattern":"^.{9}\\s\\K|(\\b[A-L]\\-|[A-L]\\-\\*\\b)","regexError":0},
            {"id":332,"ruleId":84,"gds":"sabre","pattern":null,"regexError":0},
            {"id":334,"ruleId":84,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":336,"ruleId":84,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "86": {
        "id": 86,
        "highlightGroup": "ticketMask",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "unused4",
        "label": "Unused_4",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 0,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":254,"ruleId":86,"dialect":"apollo","cmdPattern":"\\*HTE.*|\\*TE\\d{1,3}","onClickCommand":null,"regexError":0},
            {"id":256,"ruleId":86,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":258,"ruleId":86,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":594,"ruleId":86,"dialect":"galileo","cmdPattern":null,"onClickCommand":"","regexError":0}
        ],
        "patterns": [
            {"id":338,"ruleId":86,"gds":"apollo","pattern":"TOTAL (USD|CAD)\\s{1,2}\\d{1,8}\\.\\d{2}","regexError":0},
            {"id":340,"ruleId":86,"gds":"sabre","pattern":"TOTAL\\s{3}(USD|CAD|GBP)\\d{1,4}\\.\\d{2}\\s","regexError":0},
            {"id":342,"ruleId":86,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":344,"ruleId":86,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "88": {
        "id": 88,
        "highlightGroup": "routingScreen",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "airportsInRouting",
        "label": "Airports in Routing",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 0,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":260,"ruleId":88,"dialect":"apollo","cmdPattern":"\\$LR.*","onClickCommand":null,"regexError":0},
            {"id":262,"ruleId":88,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":264,"ruleId":88,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":464,"ruleId":88,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":346,"ruleId":88,"gds":"apollo","pattern":null,"regexError":0},
            {"id":348,"ruleId":88,"gds":"sabre","pattern":null,"regexError":0},
            {"id":350,"ruleId":88,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":352,"ruleId":88,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "90": {
        "id": 90,
        "highlightGroup": "pnrScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "frequentFlyerMPInPNR",
        "label": "Frequent Flyer (*MP) in PNR",
        "message": "Click to see Frequent Flier information",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 1,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":266,"ruleId":90,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]","onClickCommand":"*MP/MDA","regexError":0},
            {"id":268,"ruleId":90,"dialect":"sabre","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|¤[A-Z]","onClickCommand":"*FF","regexError":0},
            {"id":270,"ruleId":90,"dialect":"amadeus","cmdPattern":"RT.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR","onClickCommand":null,"regexError":0},
            {"id":508,"ruleId":90,"dialect":"galileo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]","onClickCommand":"*MM","regexError":0}
        ],
        "patterns": [
            {"id":354,"ruleId":90,"gds":"apollo","pattern":"\\*MP\\·","regexError":0},
            {"id":356,"ruleId":90,"gds":"sabre","pattern":"\\*FF","regexError":0},
            {"id":358,"ruleId":90,"gds":"amadeus","pattern":"^\\s+\\d\\s+\\*SSR\\sFQTV\\s\\K.*$","regexError":0},
            {"id":360,"ruleId":90,"gds":"galileo","pattern":">\\K\\*MM;","regexError":0}
        ]
    },
    "92": {
        "id": 92,
        "highlightGroup": "others",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "cancelledPNRsInName",
        "label": "Cancelled PNRs in **-Name",
        "message": "Click to open the Canceled PNR",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":272,"ruleId":92,"dialect":"apollo","cmdPattern":"\\*\\*B\\-\\.*|\\*\\*-\\.*","onClickCommand":"*{lnNumber}","regexError":0},
            {"id":274,"ruleId":92,"dialect":"sabre","cmdPattern":"\\*\\-XXXX\\-.*|\\*\\-","onClickCommand":"*{lnNumber}","regexError":0},
            {"id":276,"ruleId":92,"dialect":"amadeus","cmdPattern":"RT\\/.*","onClickCommand":"RT{lnNumber}","regexError":0},
            {"id":484,"ruleId":92,"dialect":"galileo","cmdPattern":"\\*\\*B\\-\\.*|\\*\\*-\\.*","onClickCommand":"*{lnNumber}","regexError":0}
        ],
        "patterns": [
            {"id":362,"ruleId":92,"gds":"apollo","pattern":"\\b(?P<cancelledPnr>\\X\\s[0-9]{2}[A-Z]{3})","regexError":0},
            {"id":364,"ruleId":92,"gds":"sabre","pattern":"(\\s*\\d+\\s.{15})(?P<cancelledPNR>X\\s*-\\w+)","regexError":0},
            {"id":366,"ruleId":92,"gds":"amadeus","pattern":"(?P<cancelledPnr>NO ACTIVE ITINERARY.*$)","regexError":0},
            {"id":368,"ruleId":92,"gds":"galileo","pattern":"(?P<cancelledPnr>\\sX\\s\\d{2}[A-Z]{3})","regexError":0}
        ]
    },
    "94": {
        "id": 94,
        "highlightGroup": "others",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "activePNRSIn",
        "label": "Active PNR's in **- ",
        "message": "Click to open the Active PNR",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":278,"ruleId":94,"dialect":"apollo","cmdPattern":"\\*\\*B\\-\\.*|\\*\\*-\\.*","onClickCommand":"*{lnNumber}","regexError":0},
            {"id":280,"ruleId":94,"dialect":"sabre","cmdPattern":"\\*\\-XXX\\-.*|\\*\\-.*","onClickCommand":"*{lnNumber}","regexError":0},
            {"id":282,"ruleId":94,"dialect":"amadeus","cmdPattern":"RT\\/.*","onClickCommand":"RT{lnNumber}","regexError":0},
            {"id":456,"ruleId":94,"dialect":"galileo","cmdPattern":"\\*\\*B\\-\\.*|\\*\\*-\\.*","onClickCommand":"*{lnNumber}","regexError":0}
        ],
        "patterns": [
            {"id":370,"ruleId":94,"gds":"apollo","pattern":"(\\s{3})(?P<activePnr>[0-9]{2}[A-Z]{3})","regexError":0},
            {"id":372,"ruleId":94,"gds":"sabre","pattern":"(\\s*\\d+\\s.{16})(?P<activePnrs>\\d+.{9})","regexError":0},
            {"id":374,"ruleId":94,"gds":"amadeus","pattern":"^\\s+\\d+.{23}(?P<activePnrs>\\w{2}\\s*\\d+.*)","regexError":0},
            {"id":376,"ruleId":94,"gds":"galileo","pattern":"(?<!X\\s)(?P<activePNR>\\d{2}[A-Z]{3}($|\\s))","regexError":0}
        ]
    },
    "96": {
        "id": 96,
        "highlightGroup": "errors",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "showingLLUCNOUNNNSegmentsInSELLResponse",
        "label": "Showing LL, UC, NO, UN, NN segments in SELL response",
        "message": "Unconfirmed seats",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 0,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":284,"ruleId":96,"dialect":"apollo","cmdPattern":"0.*","onClickCommand":null,"regexError":0},
            {"id":286,"ruleId":96,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":288,"ruleId":96,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":572,"ruleId":96,"dialect":"galileo","cmdPattern":"0.*","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":378,"ruleId":96,"gds":"apollo","pattern":"(\\bLL\\d\\b)|(\\bUC\\d\\b)|(\\bNO\\d\\b)|(\\bUN\\d\\b)|(\\bNN\\d\\b)|(UNABLE - HAVE WAITLISTED)","regexError":0},
            {"id":380,"ruleId":96,"gds":"sabre","pattern":null,"regexError":0},
            {"id":382,"ruleId":96,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":384,"ruleId":96,"gds":"galileo","pattern":"(^\\s\\d.{26})(\\K(LL|UC|NO|UN|NN)\\d)","regexError":0}
        ]
    },
    "98": {
        "id": 98,
        "highlightGroup": "others",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "moveDownSign",
        "label": "Move Down sign",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 1,
        "isInSameWindow": 1,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":290,"ruleId":98,"dialect":"apollo","cmdPattern":"(?!(\\*R|\\$BB|\\*HA|0|\\$D)).*","onClickCommand":"MDA","regexError":0},
            {"id":292,"ruleId":98,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":294,"ruleId":98,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":538,"ruleId":98,"dialect":"galileo","cmdPattern":"(?!(\\*R|\\$BB|\\*HA|0|\\$D)).*","onClickCommand":"MDA","regexError":0}
        ],
        "patterns": [
            {"id":386,"ruleId":98,"gds":"apollo","pattern":"\\└\\─\\>","regexError":0},
            {"id":388,"ruleId":98,"gds":"sabre","pattern":null,"regexError":0},
            {"id":390,"ruleId":98,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":392,"ruleId":98,"gds":"galileo","pattern":"\\└\\─\\>","regexError":0}
        ]
    },
    "100": {
        "id": 100,
        "highlightGroup": "pnrScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "mPDOnPNRScreen",
        "label": "*MPD on PNR screen",
        "message": "Click to open MISCELLANEOUS DOCUMENT DATA",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":296,"ruleId":100,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]","onClickCommand":"*MPD","regexError":0},
            {"id":298,"ruleId":100,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":300,"ruleId":100,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":540,"ruleId":100,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":394,"ruleId":100,"gds":"apollo","pattern":"\\*MPD\\·","regexError":0},
            {"id":396,"ruleId":100,"gds":"sabre","pattern":null,"regexError":0},
            {"id":398,"ruleId":100,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":400,"ruleId":100,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "102": {
        "id": 102,
        "highlightGroup": "airlineIncentives",
        "color": "specialHighlight",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "generalTariffDisplayForBRAirline",
        "label": "General Tariff Display for BR airline",
        "message": "Sell 50 tickets on Eva Air and get $500.00 Net bonus. \nLearn more of Eva Air https://www.youtube.com/watch?v=zDDX3Uo0PX0\n",
        "isMessageOnClick": 1,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 1,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":302,"ruleId":102,"dialect":"apollo","cmdPattern":"\\$(D|DV)(\\d{1,2})([A-Z]{3})([A-Z]{3})([A-Z]{3}).*","onClickCommand":null,"regexError":0},
            {"id":304,"ruleId":102,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":306,"ruleId":102,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":582,"ruleId":102,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":402,"ruleId":102,"gds":"apollo","pattern":"^(\\s{0,2})([1-9]{1,3})(\\s|\\s\\/)(?P<value1>BR)","regexError":0},
            {"id":404,"ruleId":102,"gds":"sabre","pattern":null,"regexError":0},
            {"id":406,"ruleId":102,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":408,"ruleId":102,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "104": {
        "id": 104,
        "highlightGroup": "historyScreen",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "sSHKInAirHistoryHA",
        "label": "SS/HK in Air History *HA",
        "message": "Successfully booked segment(s)",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 1,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":308,"ruleId":104,"dialect":"apollo","cmdPattern":"\\*H.*","onClickCommand":null,"regexError":0},
            {"id":310,"ruleId":104,"dialect":"sabre","cmdPattern":"\\*H.*","onClickCommand":null,"regexError":0},
            {"id":312,"ruleId":104,"dialect":"amadeus","cmdPattern":"RH.*","onClickCommand":null,"regexError":0},
            {"id":576,"ruleId":104,"dialect":"galileo","cmdPattern":"\\*H.*","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":410,"ruleId":104,"gds":"apollo","pattern":".*\\bSS\\/HK[1-9]\\b.*\\s$|.*\\bSS\\/HK[1-9]\\b.*[1-9]$","regexError":0},
            {"id":412,"ruleId":104,"gds":"sabre","pattern":"^AS.*\\*\\KNN\\/SS\\d+","regexError":0},
            {"id":414,"ruleId":104,"gds":"amadeus","pattern":"^.{8}(OS|AS).*\\KLK\\d","regexError":0},
            {"id":416,"ruleId":104,"gds":"galileo","pattern":"^(HS|AS).{23}\\KNN\\/HS\\d","regexError":0}
        ]
    },
    "106": {
        "id": 106,
        "highlightGroup": "errors",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "standartErrors",
        "label": "Standart errors",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":314,"ruleId":106,"dialect":"apollo","cmdPattern":"(?!(\\*R|\\$BB|\\*HA|0)).*","onClickCommand":null,"regexError":0},
            {"id":316,"ruleId":106,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":318,"ruleId":106,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":578,"ruleId":106,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":418,"ruleId":106,"gds":"apollo","pattern":"(^INVLD DATA\\/FORMAT)|(^INVLD)|(^CK ACTN CODE)|(^CK FRMT)|(^RESTRICTED$)|(^CHECK FORMAT)","regexError":0},
            {"id":420,"ruleId":106,"gds":"sabre","pattern":null,"regexError":0},
            {"id":422,"ruleId":106,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":424,"ruleId":106,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "108": {
        "id": 108,
        "highlightGroup": "historyScreen",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "hKHXByAirlineOnHistoryScreen",
        "label": "HK/HX by airline on History Screen",
        "message": "Segment(s) cancelled by the airline",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 1,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":320,"ruleId":108,"dialect":"apollo","cmdPattern":"\\*H.*","onClickCommand":null,"regexError":0},
            {"id":322,"ruleId":108,"dialect":"sabre","cmdPattern":"\\*H.*","onClickCommand":null,"regexError":0},
            {"id":324,"ruleId":108,"dialect":"amadeus","cmdPattern":"RH.*","onClickCommand":null,"regexError":0},
            {"id":512,"ruleId":108,"dialect":"galileo","cmdPattern":"\\*H.*","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":426,"ruleId":108,"gds":"apollo","pattern":".*\\bHK\\/HX[1-9]\\b.*STATUS CHANGE","regexError":0},
            {"id":428,"ruleId":108,"gds":"sabre","pattern":"^SC.*\\KHK\\/HX\\d","regexError":0},
            {"id":430,"ruleId":108,"gds":"amadeus","pattern":"^.{8}CS.*\\s\\KHX\\d","regexError":0},
            {"id":432,"ruleId":108,"gds":"galileo","pattern":"^SC.{23}\\KHK\\/HX\\d","regexError":0}
        ]
    },
    "110": {
        "id": 110,
        "highlightGroup": "errors",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "deleteRebookErrors",
        "label": "Delete/Rebook errors",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":326,"ruleId":110,"dialect":"apollo","cmdPattern":"X.*","onClickCommand":null,"regexError":0},
            {"id":328,"ruleId":110,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":330,"ruleId":110,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":500,"ruleId":110,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {
                "id": 434,
                "ruleId": 110,
                "gds": "apollo",
                "pattern": "(^\\sCHECK SEGMENT NUMBER-NO ACTION TAKEN)|(^CK CLASS.*$)|(^UNABLE (TO|-).*$)|(^0 AVAIL\\/WL CLOSED.*$)|(^UNA PROC.*$)|(^DUPLICATE SEGMENT NOT PERMITTED)|(^CK (DATE|CLS))",
                "regexError": 0
            },
            {"id":436,"ruleId":110,"gds":"sabre","pattern":null,"regexError":0},
            {"id":438,"ruleId":110,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":440,"ruleId":110,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "112": {
        "id": 112,
        "highlightGroup": "errors",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "sellErrors",
        "label": "Sell Errors",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":332,"ruleId":112,"dialect":"apollo","cmdPattern":"0.*","onClickCommand":null,"regexError":0},
            {"id":334,"ruleId":112,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":336,"ruleId":112,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":568,"ruleId":112,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":442,"ruleId":112,"gds":"apollo","pattern":"(^SELL OF COMPLETE.*$)|(^UNABLE - WAITLIST CLOSED.*$)|(^CK CLASS .*$)|(^0 AVAIL\\/WL .*$)|(^RE-REQUEST IN NUMERIC SEQUENCE)","regexError":0},
            {"id":444,"ruleId":112,"gds":"sabre","pattern":null,"regexError":0},
            {"id":446,"ruleId":112,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":448,"ruleId":112,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "114": {
        "id": 114,
        "highlightGroup": "errors",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "pricingErrors",
        "label": "Pricing errors",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":338,"ruleId":114,"dialect":"apollo","cmdPattern":"\\$BB.*","onClickCommand":null,"regexError":0},
            {"id":340,"ruleId":114,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":342,"ruleId":114,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":498,"ruleId":114,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":450,"ruleId":114,"gds":"apollo","pattern":"(^VERIFY DATE SEQUENCE IN ITINERARY)|(^ERROR \\d+ .*$)|(^SPECIFY SEGS DESIRED .*$)|(^NO ITIN)|(^UNA PROC .*$)","regexError":0},
            {"id":452,"ruleId":114,"gds":"sabre","pattern":null,"regexError":0},
            {"id":454,"ruleId":114,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":456,"ruleId":114,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "116": {
        "id": 116,
        "highlightGroup": "errors",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "reorderErrors",
        "label": "Reorder errors",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":344,"ruleId":116,"dialect":"apollo","cmdPattern":"\\/.*","onClickCommand":null,"regexError":0},
            {"id":346,"ruleId":116,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":348,"ruleId":116,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":558,"ruleId":116,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":458,"ruleId":116,"gds":"apollo","pattern":"(^CK SGMT NBR)","regexError":0},
            {"id":460,"ruleId":116,"gds":"sabre","pattern":null,"regexError":0},
            {"id":462,"ruleId":116,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":464,"ruleId":116,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "118": {
        "id": 118,
        "highlightGroup": "availabilityScreen",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 13,
        "name": "availableRBD",
        "label": "Available RBD",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":350,"ruleId":118,"dialect":"apollo","cmdPattern":"A.*","onClickCommand":null,"regexError":0},
            {"id":352,"ruleId":118,"dialect":"sabre","cmdPattern":"1.*","onClickCommand":null,"regexError":0},
            {"id":354,"ruleId":118,"dialect":"amadeus","cmdPattern":"AD.*","onClickCommand":null,"regexError":0},
            {"id":468,"ruleId":118,"dialect":"galileo","cmdPattern":"A.*","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":466,"ruleId":118,"gds":"apollo","pattern":"^\\d.{7}\\K|(\\b[A-Z][1-9]\\b)","regexError":0},
            {"id":468,"ruleId":118,"gds":"sabre","pattern":"(\\b[A-Z][1-9]\\b)","regexError":0},
            {"id":470,"ruleId":118,"gds":"amadeus","pattern":"(\\b[A-Z][1-9]\\b)","regexError":0},
            {"id":472,"ruleId":118,"gds":"galileo","pattern":"^\\d.{26}\\K|(\\b[A-Z][1-9]\\b)","regexError":0}
        ]
    },
    "120": {
        "id": 120,
        "highlightGroup": "availabilityScreen",
        "color": "specialHighlight",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 7,
        "name": "codeShareFlightIndicator",
        "label": "Code-share Flight indicator",
        "message": "Code-share flight",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 1,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":356,"ruleId":120,"dialect":"apollo","cmdPattern":"A.*","onClickCommand":"A*M","regexError":0},
            {"id":358,"ruleId":120,"dialect":"sabre","cmdPattern":"1.*","onClickCommand":null,"regexError":0},
            {"id":360,"ruleId":120,"dialect":"amadeus","cmdPattern":"AD.*","onClickCommand":null,"regexError":0},
            {"id":490,"ruleId":120,"dialect":"galileo","cmdPattern":"A.*","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":474,"ruleId":120,"gds":"apollo","pattern":".{61}(?P<value>\\*)","regexError":0},
            {"id":476,"ruleId":120,"gds":"sabre","pattern":"^\\d(?P<value>\\w{2})\\/","regexError":0},
            {"id":478,"ruleId":120,"gds":"amadeus","pattern":"(^.{4}\\:)(?P<value>\\w{2})","regexError":0},
            {"id":480,"ruleId":120,"gds":"galileo","pattern":"^.{20}\\K(?P<value>@)","regexError":0}
        ]
    },
    "122": {
        "id": 122,
        "highlightGroup": "availabilityScreen",
        "color": "specialHighlight",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "insideAvailabilityParticipantIndicator",
        "label": "Inside Availability ™  participant indicator",
        "message": "This airline is an Inside Availability ™  participant",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 0,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":362,"ruleId":122,"dialect":"apollo","cmdPattern":"A.*","onClickCommand":null,"regexError":0},
            {"id":364,"ruleId":122,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":366,"ruleId":122,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":522,"ruleId":122,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":482,"ruleId":122,"gds":"apollo","pattern":"^[1-9](?P<value>\\+)\\s","regexError":0},
            {"id":484,"ruleId":122,"gds":"sabre","pattern":null,"regexError":0},
            {"id":486,"ruleId":122,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":488,"ruleId":122,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "124": {
        "id": 124,
        "highlightGroup": "availabilityScreen",
        "color": "specialHighlight",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "unused",
        "label": "Unused",
        "message": "Test",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 0,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":368,"ruleId":124,"dialect":"apollo","cmdPattern":"A.*","onClickCommand":null,"regexError":0},
            {"id":370,"ruleId":124,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":372,"ruleId":124,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":494,"ruleId":124,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":490,"ruleId":124,"gds":"apollo","pattern":"^.{40}(?P<value3>[A-Z]{3})","regexError":0},
            {"id":492,"ruleId":124,"gds":"sabre","pattern":null,"regexError":0},
            {"id":494,"ruleId":124,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":496,"ruleId":124,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "126": {
        "id": 126,
        "highlightGroup": "pricingScreen",
        "color": "warningMessage",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "endorsementForLoadedTDS",
        "label": "Endorsement for loaded TD's",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":374,"ruleId":126,"dialect":"apollo","cmdPattern":"\\$B.*|\\*LF|T\\:\\$B","onClickCommand":null,"regexError":0},
            {"id":376,"ruleId":126,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":378,"ruleId":126,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":496,"ruleId":126,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":498,"ruleId":126,"gds":"apollo","pattern":"^E MARKUP CAP UP TO PUB FARES|^E PAYMENT.*|(^E MUST BE.*$\\n\\w.*$)|^E NET PRICE MUST BE.*","regexError":0},
            {"id":500,"ruleId":126,"gds":"sabre","pattern":null,"regexError":0},
            {"id":502,"ruleId":126,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":504,"ruleId":126,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "128": {
        "id": 128,
        "highlightGroup": "availabilityScreen",
        "color": "specialHighlight",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "dateWeekday",
        "label": "Date / Weekday",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 1,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":380,"ruleId":128,"dialect":"apollo","cmdPattern":"A.*","onClickCommand":null,"regexError":0},
            {"id":382,"ruleId":128,"dialect":"sabre","cmdPattern":"1.*","onClickCommand":null,"regexError":0},
            {"id":384,"ruleId":128,"dialect":"amadeus","cmdPattern":"AD.*","onClickCommand":null,"regexError":0},
            {"id":492,"ruleId":128,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":506,"ruleId":128,"gds":"apollo","pattern":"^.{18}\\s(?P<value3>[A-Z]{2}\\s\\d{2}[A-Z]{3}\\b)\\s","regexError":0},
            {"id":508,"ruleId":128,"gds":"sabre","pattern":"^\\s(?P<value>\\w{5}\\s{2}[A-Z]{3})","regexError":0},
            {"id":510,"ruleId":128,"gds":"amadeus","pattern":"(^.{64}\\s)(?P<value>[A-Z]{2}\\s\\w{5})","regexError":0},
            {"id":512,"ruleId":128,"gds":"galileo","pattern":"(^.{19})(?P<value>[A-Z]{2}\\s\\w{5})","regexError":0}
        ]
    },
    "130": {
        "id": 130,
        "highlightGroup": "seatMap",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "aircraftWing",
        "label": "Aircraft wing",
        "message": "Aircraft Window",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"dotted\",\"bold\"]",
        "cmdPatterns": [
            {"id":386,"ruleId":130,"dialect":"apollo","cmdPattern":"9V\\/S.*","onClickCommand":null,"regexError":0},
            {"id":388,"ruleId":130,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":390,"ruleId":130,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":596,"ruleId":130,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":514,"ruleId":130,"gds":"apollo","pattern":"^.{5}(?P<value>W)\\s","regexError":0},
            {"id":516,"ruleId":130,"gds":"sabre","pattern":null,"regexError":0},
            {"id":518,"ruleId":130,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":520,"ruleId":130,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "132": {
        "id": 132,
        "highlightGroup": "seatMap",
        "color": "specialHighlight",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "exitRow",
        "label": "Exit Row",
        "message": "Exit Row. Normally seats in this row cannot be pre-assigned. These seats are under airport control",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 0,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"dotted\"]",
        "cmdPatterns": [
            {"id":392,"ruleId":132,"dialect":"apollo","cmdPattern":"9V\\/S.*","onClickCommand":null,"regexError":0},
            {"id":394,"ruleId":132,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":396,"ruleId":132,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":502,"ruleId":132,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":522,"ruleId":132,"gds":"apollo","pattern":"^\\s{2}(?P<value2>E)\\s","regexError":0},
            {"id":524,"ruleId":132,"gds":"sabre","pattern":null,"regexError":0},
            {"id":526,"ruleId":132,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":528,"ruleId":132,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "134": {
        "id": 134,
        "highlightGroup": "seatMap",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "availableSeats",
        "label": "Available seats",
        "message": "Available seats. To assign a seat, enter 9S/S1/35A, where S1 stands for segment #1; 35A is for Row 35 seat A. If you have multiple passengers in PNR, you can assign seats to all of them in a single entry: 9S/S1/35A35C35D or 9S/S1/35ACD",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":398,"ruleId":134,"dialect":"apollo","cmdPattern":"9V\\/S.*","onClickCommand":null,"regexError":0},
            {"id":400,"ruleId":134,"dialect":"sabre","cmdPattern":"4G.*","onClickCommand":null,"regexError":0},
            {"id":402,"ruleId":134,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":470,"ruleId":134,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":530,"ruleId":134,"gds":"apollo","pattern":"^(.{10}\\K)|(\\h(?P<value>[A-L])\\s)","regexError":0},
            {"id":532,"ruleId":134,"gds":"sabre","pattern":null,"regexError":0},
            {"id":534,"ruleId":134,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":536,"ruleId":134,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "136": {
        "id": 136,
        "highlightGroup": "seatMap",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "seatsWithRestrictedRecline",
        "label": "Seats with restricted recline",
        "message": "This seat has a restricted recline",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 1,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":404,"ruleId":136,"dialect":"apollo","cmdPattern":"9V\\/S.*","onClickCommand":null,"regexError":0},
            {"id":406,"ruleId":136,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":408,"ruleId":136,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":564,"ruleId":136,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":538,"ruleId":136,"gds":"apollo","pattern":"^.{10}\\K|\\s(?P<value>[A-L]R)\\s","regexError":0},
            {"id":540,"ruleId":136,"gds":"sabre","pattern":null,"regexError":0},
            {"id":542,"ruleId":136,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":544,"ruleId":136,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "138": {
        "id": 138,
        "highlightGroup": "seatMap",
        "color": "outputFont",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "preferredSeating",
        "label": "Preferred seating",
        "message": "Restricted Seats",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 1,
        "isInSameWindow": 0,
        "decoration": "[\"dotted\"]",
        "cmdPatterns": [
            {"id":410,"ruleId":138,"dialect":"apollo","cmdPattern":"9V\\/S.*","onClickCommand":null,"regexError":0},
            {"id":412,"ruleId":138,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":414,"ruleId":138,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":552,"ruleId":138,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":546,"ruleId":138,"gds":"apollo","pattern":"^.{10}\\K|(\\h(?P<value>[A-L]\\/|[A-L]R\\/)\\s)","regexError":0},
            {"id":548,"ruleId":138,"gds":"sabre","pattern":null,"regexError":0},
            {"id":550,"ruleId":138,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":552,"ruleId":138,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "140": {
        "id": 140,
        "highlightGroup": "svc",
        "color": "specialHighlight",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "airlineCodeInSVC",
        "label": "Airline Code in *SVC",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":416,"ruleId":140,"dialect":"apollo","cmdPattern":"\\*SVC","onClickCommand":null,"regexError":0},
            {"id":418,"ruleId":140,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":420,"ruleId":140,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":462,"ruleId":140,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":554,"ruleId":140,"gds":"apollo","pattern":"^.{3}(?P<value>[A-Z0-9]{2})\\s","regexError":0},
            {"id":556,"ruleId":140,"gds":"sabre","pattern":null,"regexError":0},
            {"id":558,"ruleId":140,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":560,"ruleId":140,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "142": {
        "id": 142,
        "highlightGroup": "svc",
        "color": "specialHighlight",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "mealsInSVC",
        "label": "Meals in *SVC",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":422,"ruleId":142,"dialect":"apollo","cmdPattern":"\\*SVC","onClickCommand":null,"regexError":0},
            {"id":424,"ruleId":142,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":426,"ruleId":142,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":534,"ruleId":142,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":562,"ruleId":142,"gds":"apollo","pattern":"^.{22}[A-Z0-9]{3}\\s{2}\\K[A-Z \\/]{4,18}","regexError":0},
            {"id":564,"ruleId":142,"gds":"sabre","pattern":null,"regexError":0},
            {"id":566,"ruleId":142,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":568,"ruleId":142,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "144": {
        "id": 144,
        "highlightGroup": "svc",
        "color": "specialHighlight",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "rBDInSVC",
        "label": "RBD in *SVC",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":428,"ruleId":144,"dialect":"apollo","cmdPattern":"\\*SVC","onClickCommand":null,"regexError":0},
            {"id":430,"ruleId":144,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":432,"ruleId":144,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":556,"ruleId":144,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":570,"ruleId":144,"gds":"apollo","pattern":"^.{12}(?P<value>\\b[A-Z])\\s","regexError":0},
            {"id":572,"ruleId":144,"gds":"sabre","pattern":null,"regexError":0},
            {"id":574,"ruleId":144,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":576,"ruleId":144,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "146": {
        "id": 146,
        "highlightGroup": "svc",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "oDAndFlightDurationInSVC",
        "label": "O&D and Flight duration in *SVC",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":434,"ruleId":146,"dialect":"apollo","cmdPattern":"\\*SVC","onClickCommand":null,"regexError":0},
            {"id":436,"ruleId":146,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":438,"ruleId":146,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":546,"ruleId":146,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":578,"ruleId":146,"gds":"apollo","pattern":"([0-9]{1,2}\\:\\d{2})|(\\:\\d{2})|^.{13}\\s\\K[A-Z]{6}\\b","regexError":0},
            {"id":580,"ruleId":146,"gds":"sabre","pattern":null,"regexError":0},
            {"id":582,"ruleId":146,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":584,"ruleId":146,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "148": {
        "id": 148,
        "highlightGroup": "svc",
        "color": "specialHighlight",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "aircraftTypeInSVC",
        "label": "Aircraft Type in *SVC",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 1,
        "isInSameWindow": 0,
        "decoration": "[\"dotted\"]",
        "cmdPatterns": [
            {"id":440,"ruleId":148,"dialect":"apollo","cmdPattern":"\\*SVC","onClickCommand":"HELP {pattern}","regexError":0},
            {"id":442,"ruleId":148,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":444,"ruleId":148,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":458,"ruleId":148,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":586,"ruleId":148,"gds":"apollo","pattern":"^(\\s\\d.{19}\\s)(?P<value>[A-Z0-9]{3})(\\s)","regexError":0},
            {"id":588,"ruleId":148,"gds":"sabre","pattern":null,"regexError":0},
            {"id":590,"ruleId":148,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":592,"ruleId":148,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "150": {
        "id": 150,
        "highlightGroup": "pricingScreen",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "baggageInfo0PCS",
        "label": "Baggage Info (0 PC's)",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":446,"ruleId":150,"dialect":"apollo","cmdPattern":"\\$B.*|\\*LF|T\\:\\$B","onClickCommand":null,"regexError":0},
            {"id":448,"ruleId":150,"dialect":"sabre","cmdPattern":"WP\\*BAG","onClickCommand":null,"regexError":0},
            {"id":450,"ruleId":150,"dialect":"amadeus","cmdPattern":"FX.*","onClickCommand":null,"regexError":0},
            {"id":476,"ruleId":150,"dialect":"galileo","cmdPattern":"FQ.*","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":594,"ruleId":150,"gds":"apollo","pattern":"BAGGAGE ALLOWANCE\\n.*\\n.*(0PC)\\b","regexError":0},
            {"id":596,"ruleId":150,"gds":"sabre","pattern":"^BAG ALLOWANCE\\s+\\-[A-Z]{6}\\-(0P|NIL)","regexError":0},
            {"id":598,"ruleId":150,"gds":"amadeus","pattern":"^.{58}\\K0P$","regexError":0},
            {"id":600,"ruleId":150,"gds":"galileo","pattern":"^BAGGAGE ALLOWANCE\\n.*$\\n.*\\s(0PC)","regexError":0}
        ]
    },
    "152": {
        "id": 152,
        "highlightGroup": "pricingScreen",
        "color": "outputFont",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "mUSTPRICEASBA",
        "label": "----- MUST PRICE AS B/A -----",
        "message": "Make sure the selling price is not below the Total Price, that you see in $B:A pricing",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 1,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"dotted\",\"bold\"]",
        "cmdPatterns": [
            {"id":706,"ruleId":152,"dialect":"apollo","cmdPattern":"\\$B.*|\\*LF|T\\:\\$B|FS\\*\\d{1,2}","onClickCommand":null,"regexError":0},
            {"id":708,"ruleId":152,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":710,"ruleId":152,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":712,"ruleId":152,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":602,"ruleId":152,"gds":"apollo","pattern":"\\-\\-\\s(?P<value>MUST PRICE AS B\\/A)\\s\\-","regexError":0},
            {"id":604,"ruleId":152,"gds":"sabre","pattern":null,"regexError":0},
            {"id":606,"ruleId":152,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":608,"ruleId":152,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "154": {
        "id": 154,
        "highlightGroup": "pricingScreen",
        "color": "outputFont",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "mUSTPRICEASB",
        "label": "--- MUST PRICE AS B ---",
        "message": "The selling price can be equal or above the Total Price shown below",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 1,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"dotted\",\"bold\"]",
        "cmdPatterns": [
            {"id":714,"ruleId":154,"dialect":"apollo","cmdPattern":"\\$B.*|\\*LF|T\\:\\$B|FS\\*\\d{1,2}","onClickCommand":null,"regexError":0},
            {"id":716,"ruleId":154,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":718,"ruleId":154,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":720,"ruleId":154,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":610,"ruleId":154,"gds":"apollo","pattern":"\\-\\-\\s(?P<value>MUST PRICE AS B)\\s\\-","regexError":0},
            {"id":612,"ruleId":154,"gds":"sabre","pattern":null,"regexError":0},
            {"id":614,"ruleId":154,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":616,"ruleId":154,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "156": {
        "id": 156,
        "highlightGroup": "pnrScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "dividedBooking",
        "label": "Divided booking",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 1,
        "decoration": "[\"bold\",\"bordered\"]",
        "cmdPatterns": [
            {"id":722,"ruleId":156,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|0.*","onClickCommand":"*DV","regexError":0},
            {"id":724,"ruleId":156,"dialect":"sabre","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|0.*|\\*D","onClickCommand":"*D","regexError":0},
            {"id":726,"ruleId":156,"dialect":"amadeus","cmdPattern":"RT|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|0.*","onClickCommand":null,"regexError":0},
            {"id":728,"ruleId":156,"dialect":"galileo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|0.*","onClickCommand":"*DV","regexError":0}
        ],
        "patterns": [
            {"id":618,"ruleId":156,"gds":"apollo","pattern":"(\\*\\*\\* DIVIDED BOOKING EXISTS \\*\\*\\*>)(?P<value>\\*DV·)","regexError":0},
            {"id":620,"ruleId":156,"gds":"sabre","pattern":"(^\\s{2}\\d\\.)(?P<value1>DIVIDED).*(?P<value2>\\w{6}$)","regexError":0},
            {"id":622,"ruleId":156,"gds":"amadeus","pattern":"(^\\s{2}\\*) (?P<remark>SP).*(?P<pnr>\\w{6}$)","regexError":0},
            {"id":624,"ruleId":156,"gds":"galileo","pattern":"(^\\*\\* DIVIDED BOOKINGS EXIST \\*\\*\\s+>)(?P<value>\\*DV;)","regexError":0}
        ]
    },
    "158": {
        "id": 158,
        "highlightGroup": "pnrScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "gIGLOBALINFORMATIONEXISTS",
        "label": "*GI - GLOBAL INFORMATION EXISTS",
        "message": "undefined",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 1,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":730,"ruleId":158,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|0.*","onClickCommand":"*GI","regexError":0},
            {"id":732,"ruleId":158,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":734,"ruleId":158,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":736,"ruleId":158,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":626,"ruleId":158,"gds":"apollo","pattern":"\\*GI\\·","regexError":0},
            {"id":628,"ruleId":158,"gds":"sabre","pattern":null,"regexError":0},
            {"id":630,"ruleId":158,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":632,"ruleId":158,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "160": {
        "id": 160,
        "highlightGroup": "pnrScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "filedFares",
        "label": "Filed fares",
        "message": "undefined",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 1,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":738,"ruleId":160,"dialect":"apollo","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":740,"ruleId":160,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":742,"ruleId":160,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":744,"ruleId":160,"dialect":"galileo","cmdPattern":"\\*FF.*","onClickCommand":"*FF{lnNumber}/MDA","regexError":0}
        ],
        "patterns": [
            {"id":634,"ruleId":160,"gds":"apollo","pattern":null,"regexError":0},
            {"id":636,"ruleId":160,"gds":"sabre","pattern":null,"regexError":0},
            {"id":638,"ruleId":160,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":640,"ruleId":160,"gds":"galileo","pattern":"^FQ\\d.{9}","regexError":0}
        ]
    },
    "162": {
        "id": 162,
        "highlightGroup": "availabilityScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "aJ",
        "label": "A*J",
        "message": "undefined",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 1,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 1,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":746,"ruleId":162,"dialect":"apollo","cmdPattern":"A.*","onClickCommand":"A*J","regexError":0},
            {"id":748,"ruleId":162,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":750,"ruleId":162,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":752,"ruleId":162,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":642,"ruleId":162,"gds":"apollo","pattern":"(A\\*J\\·)","regexError":0},
            {"id":644,"ruleId":162,"gds":"sabre","pattern":null,"regexError":0},
            {"id":646,"ruleId":162,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":648,"ruleId":162,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "164": {
        "id": 164,
        "highlightGroup": "pnrScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 0,
        "name": "pNRNameInPNR",
        "label": "PNR name in PNR",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bold\",\"bordered\"]",
        "cmdPatterns": [
            {"id":754,"ruleId":164,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":null,"regexError":0},
            {"id":756,"ruleId":164,"dialect":"sabre","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|¤[A-Z]|0.*","onClickCommand":null,"regexError":0},
            {"id":758,"ruleId":164,"dialect":"amadeus","cmdPattern":"R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|SS.*","onClickCommand":null,"regexError":0},
            {"id":760,"ruleId":164,"dialect":"galileo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":650,"ruleId":164,"gds":"apollo","pattern":"(?P<value>^[A-Z0-9]{6})(\\/[A-Z0-9]{2}\\s)","regexError":0},
            {"id":652,"ruleId":164,"gds":"sabre","pattern":"(^[A-Z0-9]{4}\\.[A-Z0-9]{4}.{18})(?P<value>[A-Z0-9]{6})","regexError":0},
            {"id":654,"ruleId":164,"gds":"amadeus","pattern":"(^RP.{55})(?P<value>[A-Z0-9]{6})","regexError":0},
            {"id":656,"ruleId":164,"gds":"galileo","pattern":"(?P<value>^[A-Z0-9]{6})(\\/[A-Z0-9]{2}\\s)","regexError":0}
        ]
    },
    "166": {
        "id": 166,
        "highlightGroup": "ticketMask",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 7,
        "name": "openTicketMasksFromHTE",
        "label": "Open ticket masks from *HTE",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 1,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":762,"ruleId":166,"dialect":"apollo","cmdPattern":"\\*HTE","onClickCommand":"{pattern}","regexError":0},
            {"id":764,"ruleId":166,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":766,"ruleId":166,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":768,"ruleId":166,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":658,"ruleId":166,"gds":"apollo","pattern":"(^\\>)(?P<value>\\*.{5})","regexError":0},
            {"id":660,"ruleId":166,"gds":"sabre","pattern":null,"regexError":0},
            {"id":662,"ruleId":166,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":664,"ruleId":166,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "168": {
        "id": 168,
        "highlightGroup": "pricingScreen",
        "color": "specialHighlight",
        "backgroundColor": "",
        "highlightType": "customValue",
        "priority": 9,
        "name": "FareAmountInFareConstruction",
        "label": "Fare Amount in Fare Construction",
        "message": "undefined",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 1,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":770,"ruleId":168,"dialect":"apollo","cmdPattern":"\\$B.*|\\*LF|T\\:\\$B|FS\\*\\d{1,2}","onClickCommand":"","regexError":0},
            {"id":772,"ruleId":168,"dialect":"sabre","cmdPattern":"","onClickCommand":"","regexError":0},
            {"id":774,"ruleId":168,"dialect":"amadeus","cmdPattern":"","onClickCommand":"","regexError":0},
            {"id":776,"ruleId":168,"dialect":"galileo","cmdPattern":"","onClickCommand":"","regexError":0}
        ],
        "patterns": [
            {"id":666,"ruleId":168,"gds":"apollo","pattern":"(\\s|\\sM|\\d{1,2}M)(?<fareLevel>(\\d{1,5}\\.\\d{2}))(([A-Z][A-Z0-9]{2,9}))(\\s|\\H|\\/[A-Z].+)","regexError":0},
            {"id":668,"ruleId":168,"gds":"sabre","pattern":"","regexError":0},
            {"id":670,"ruleId":168,"gds":"amadeus","pattern":"","regexError":0},
            {"id":672,"ruleId":168,"gds":"galileo","pattern":"","regexError":0}
        ]
    },
    "170": {
        "id": 170,
        "highlightGroup": "pnrScreen",
        "color": "specialHighlight",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 14,
        "name": "temporaryStoredFareHighlight",
        "label": "Temporary Stored Fare Highlight",
        "message": "undefined",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":778,"ruleId":170,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":"{patter}","regexError":0},
            {"id":780,"ruleId":170,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":782,"ruleId":170,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":784,"ruleId":170,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":674,"ruleId":170,"gds":"apollo","pattern":"^ATFQ\\-|\\*IF[0-9]{1,5}|\\/Z\\$[0-9]{1,4}\\.[0-9]{2}\\/","regexError":0},
            {"id":676,"ruleId":170,"gds":"sabre","pattern":null,"regexError":0},
            {"id":678,"ruleId":170,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":680,"ruleId":170,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "172": {
        "id": 172,
        "highlightGroup": "ticketMask",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 14,
        "name": "exchangedFor",
        "label": "Exchanged for",
        "message": "undefined",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 1,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":786,"ruleId":172,"dialect":"apollo","cmdPattern":"\\*TE.*","onClickCommand":"*TE/{pattern}","regexError":0},
            {"id":788,"ruleId":172,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":790,"ruleId":172,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":792,"ruleId":172,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":682,"ruleId":172,"gds":"apollo","pattern":"^EXCHANGED FOR:\\s\\K.{13}","regexError":0},
            {"id":684,"ruleId":172,"gds":"sabre","pattern":null,"regexError":0},
            {"id":686,"ruleId":172,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":688,"ruleId":172,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "174": {
        "id": 174,
        "highlightGroup": "pnrScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 16,
        "name": "dOCSSSRSOSIREMARKS",
        "label": "DOCS SSRS & OSI REMARKS",
        "message": "undefined",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bold\"]",
        "cmdPatterns": [
            {"id":794,"ruleId":174,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":null,"regexError":0},
            {"id":796,"ruleId":174,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":798,"ruleId":174,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":800,"ruleId":174,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {
                "id": 690,
                "ruleId": 174,
                "gds": "apollo",
                "pattern": "(^\\s+\\d+\\sSSRDOCS(?P<airline>\\w{2}).{8})(?P<docs>.{11}\\w+(\\s\\w+\\/|\\/)\\w+(\\/\\w+|\\/|\\s\\w+)(\\/\\w+|-))|(^\\s+\\d+\\s+)(?P<value>OSI.*)",
                "regexError": 0
            },
            {"id":692,"ruleId":174,"gds":"sabre","pattern":null,"regexError":0},
            {"id":694,"ruleId":174,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":696,"ruleId":174,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "178": {
        "id": 178,
        "highlightGroup": "airlineIncentives",
        "color": "usedCommand",
        "backgroundColor": "highlightDark",
        "highlightType": "customValue",
        "priority": 32,
        "name": "sampleKEToPH",
        "label": "Sample KE to PH",
        "message": "Check this out",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 1,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":810,"ruleId":178,"dialect":"apollo","cmdPattern":"\\$(D|DV)(\\d{1,2})([A-Z]{3})([A-Z]{3})(MNL|CEB|DVO)","onClickCommand":null,"regexError":0},
            {"id":812,"ruleId":178,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":814,"ruleId":178,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":816,"ruleId":178,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":706,"ruleId":178,"gds":"apollo","pattern":"^(\\s{0,2})(?P<value1>([1-9]{1,3})(\\s{1,2}|\\s\\/)(KE)(\\s{2,4}[0-9]{2,4}\\.[0-9]{2}(\\s|R)))","regexError":0},
            {"id":708,"ruleId":178,"gds":"sabre","pattern":null,"regexError":0},
            {"id":710,"ruleId":178,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":712,"ruleId":178,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "180": {
        "id": 180,
        "highlightGroup": "airlineIncentives",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 18,
        "name": "oZExtraLuggagePromo",
        "label": "OZ Extra Luggage Promo",
        "message": "1 EXTRA EXCESS BAGGAGE FOR OUTBOUND ONLY<br /><br />TKT PERIOD: August 01, 2018 ~ August 31, 2018<br />DEPARTURE PERIOD: SEPTEMBER 01, 2018 ~ NOVEMBER 31, 2018<br /><br />※ Must send all EB request to wonsuh@flyasiana.com within 48 HOURS after ticket issu",
        "isMessageOnClick": 1,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":818,"ruleId":180,"dialect":"apollo","cmdPattern":"\\$(D|DV)(\\d{1,2})(SEP|OCT|NOV)(SFO)(MNL|CEB|DVO|BJS|SHA|HKG|TPE).*","onClickCommand":null,"regexError":0},
            {"id":820,"ruleId":180,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":822,"ruleId":180,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":824,"ruleId":180,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":714,"ruleId":180,"gds":"apollo","pattern":"^(\\s{0,2})([0-9]{1,3})(\\s{1,2}|\\s\\/|\\s\\-)(?P<value1>OZ)(.{19}\\s)(T|W|V|S|K|Q|E|H)(\\s)","regexError":0},
            {"id":716,"ruleId":180,"gds":"sabre","pattern":null,"regexError":0},
            {"id":718,"ruleId":180,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":720,"ruleId":180,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "182": {
        "id": 182,
        "highlightGroup": "tariffDisplay",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 1,
        "name": "iGEconomyLightFareInFareBasis",
        "label": "IG Economy Light  Fare - in FareBasis",
        "message": "Economy Light Fare<br /><br />It comes with NO luggage allowance. Refunds/Exchanges are not permitted. <br /><br />Customers can still pay for a seat or baggage after the booking separately.<br /> <br />Alternatively, look for a more expensive fare, that ",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":826,"ruleId":182,"dialect":"apollo","cmdPattern":"\\$D.*","onClickCommand":null,"regexError":0},
            {"id":828,"ruleId":182,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":830,"ruleId":182,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":832,"ruleId":182,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":722,"ruleId":182,"gds":"apollo","pattern":"^(\\s{0,2})(\\d)(\\s{2}IG|\\s\\/IG)(.{10,12})(\\s)(?P<value2>\\S{2}LG\\S{0,5})","regexError":0},
            {"id":724,"ruleId":182,"gds":"sabre","pattern":null,"regexError":0},
            {"id":726,"ruleId":182,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":728,"ruleId":182,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "184": {
        "id": 184,
        "highlightGroup": "tariffDisplay",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 19,
        "name": "sabreIndicatorInMIXOutput",
        "label": "Sabre indicator in MIX output",
        "message": "SABRE<br /><br />1S is an indicator of Sabre GDS.  This means, that the provided tariff is available in Sabre PCC indicated next. It could be an ITX or a JCB tariff. Please make sure to check both options. ",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":834,"ruleId":184,"dialect":"apollo","cmdPattern":"\\$D.*\\/MIX","onClickCommand":null,"regexError":0},
            {"id":836,"ruleId":184,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":838,"ruleId":184,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":840,"ruleId":184,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":730,"ruleId":184,"gds":"apollo","pattern":"^(.{63})(?P<value1>\\b1S\\b)","regexError":0},
            {"id":732,"ruleId":184,"gds":"sabre","pattern":null,"regexError":0},
            {"id":734,"ruleId":184,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":736,"ruleId":184,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "186": {
        "id": 186,
        "highlightGroup": "tariffDisplay",
        "color": "specialHighlight",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 20,
        "name": "amadeusIndicatorInMIXOutput",
        "label": "Amadeus Indicator in MIX output",
        "message": "AMADEUS<br /><br />1A is an indicator of Sabre GDS.  This means, that the provided tariff is available in Amadeus PCC indicated next. Make sure to use R,UP modifier to get the listed tariff",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":842,"ruleId":186,"dialect":"apollo","cmdPattern":"\\$D.*\\/MIX","onClickCommand":null,"regexError":0},
            {"id":844,"ruleId":186,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":846,"ruleId":186,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":848,"ruleId":186,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":738,"ruleId":186,"gds":"apollo","pattern":"^(.{63})(?P<value1>\\b1A\\b)","regexError":0},
            {"id":740,"ruleId":186,"gds":"sabre","pattern":null,"regexError":0},
            {"id":742,"ruleId":186,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":744,"ruleId":186,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "188": {
        "id": 188,
        "highlightGroup": "tariffDisplay",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 21,
        "name": "pCCOfTheActiveGDSFoundInMIXOutput",
        "label": "PCC of the Active GDS found in MIX output",
        "message": "Click to emulate to specified PCC in order to build a chosen fare",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":850,"ruleId":188,"dialect":"apollo","cmdPattern":"\\$D.*\\/MIX","onClickCommand":"SEM/{pattern}/AG","regexError":0},
            {"id":852,"ruleId":188,"dialect":"sabre","cmdPattern":"FQ.*\\MIX","onClickCommand":"AAA{pattern}","regexError":0},
            {"id":854,"ruleId":188,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":856,"ruleId":188,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":746,"ruleId":188,"gds":"apollo","pattern":"^(.{62})(\\s1V\\s)(?P<value1>.{4,9}\\b)","regexError":0},
            {"id":748,"ruleId":188,"gds":"sabre","pattern":"(^.{63}1S\\s)(?P<value>\\w{4})","regexError":0},
            {"id":750,"ruleId":188,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":752,"ruleId":188,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "190": {
        "id": 190,
        "highlightGroup": "tariffDisplay",
        "color": "outputFont",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 22,
        "name": "listOfPCCSCheckInMIXFormat",
        "label": "List of PCC's check in MIX format",
        "message": "List of PCC's, that were checked for the best Tariffs. <br />Please note, that some of those PCC's belong to alternative GDS",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bold\"]",
        "cmdPatterns": [
            {"id":858,"ruleId":190,"dialect":"apollo","cmdPattern":"\\$D.*\\/MIX","onClickCommand":null,"regexError":0},
            {"id":860,"ruleId":190,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":862,"ruleId":190,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":864,"ruleId":190,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":754,"ruleId":190,"gds":"apollo","pattern":"^(PUBLIC\\/PRIVATE FARES FOR \\S{4}\\s)(?P<value1>.*)","regexError":0},
            {"id":756,"ruleId":190,"gds":"sabre","pattern":null,"regexError":0},
            {"id":758,"ruleId":190,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":760,"ruleId":190,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "191": {
        "id": 191,
        "highlightGroup": "pnrScreen",
        "color": "specialHighlight",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 23,
        "name": "storedFarePCCInATFQ",
        "label": "Stored fare PCC in ATFQ",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 1,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":865,"ruleId":191,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":"SEM/{pattern}/AG","regexError":0},
            {"id":867,"ruleId":191,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":869,"ruleId":191,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":871,"ruleId":191,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":761,"ruleId":191,"gds":"apollo","pattern":"^ATFQ.*\\/TA(?P<value>\\w{4})\\/","regexError":0},
            {"id":763,"ruleId":191,"gds":"sabre","pattern":null,"regexError":0},
            {"id":765,"ruleId":191,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":767,"ruleId":191,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "193": {
        "id": 193,
        "highlightGroup": "pnrScreen",
        "color": "highlightLight",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 24,
        "name": "oPERATEDBY",
        "label": "OPERATED BY",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 1,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":873,"ruleId":193,"dialect":"apollo","cmdPattern":"\\*R.*|\\*[A-Z0-9]{6}|\\*\\d{1,2}|IR|ER|PNR|S[A-Z]|0.*","onClickCommand":null,"regexError":0},
            {"id":875,"ruleId":193,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":877,"ruleId":193,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":879,"ruleId":193,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":769,"ruleId":193,"gds":"apollo","pattern":"^ {9}(?P<value>OPERATED BY .*)","regexError":0},
            {"id":771,"ruleId":193,"gds":"sabre","pattern":null,"regexError":0},
            {"id":773,"ruleId":193,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":775,"ruleId":193,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "194": {
        "id": 194,
        "highlightGroup": "pricingScreen",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 26,
        "name": "failedRulesForForcedFare",
        "label": "Failed rules for Forced fare",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":880,"ruleId":194,"dialect":"apollo","cmdPattern":"\\$B\\¤.*|T\\:\\$B\\¤.*","onClickCommand":null,"regexError":0},
            {"id":882,"ruleId":194,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":884,"ruleId":194,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":886,"ruleId":194,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":776,"ruleId":194,"gds":"apollo","pattern":"^ {9}(?P<value>THE FOLLOWING RULES FAILED FOR .*)","regexError":0},
            {"id":778,"ruleId":194,"gds":"sabre","pattern":null,"regexError":0},
            {"id":780,"ruleId":194,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":782,"ruleId":194,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "196": {
        "id": 196,
        "highlightGroup": "pricingScreen",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 27,
        "name": "validationRulesMetForForcedFare",
        "label": "Validation rules met for Forced Fare",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":888,"ruleId":196,"dialect":"apollo","cmdPattern":"\\$B\\¤.*|T\\:\\$B\\¤.*","onClickCommand":null,"regexError":0},
            {"id":890,"ruleId":196,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":892,"ruleId":196,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":894,"ruleId":196,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":784,"ruleId":196,"gds":"apollo","pattern":"^ {9}(?P<value>RULES VALIDATION MET .*)","regexError":0},
            {"id":786,"ruleId":196,"gds":"sabre","pattern":null,"regexError":0},
            {"id":788,"ruleId":196,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":790,"ruleId":196,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "198": {
        "id": 198,
        "highlightGroup": "airlineIncentives",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 28,
        "name": "kQReminder",
        "label": "KQ reminder",
        "message": "Make sure to offer exclusive KQ bi-directional OW Net fares (can also be combined to form round-trips)",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bold\"]",
        "cmdPatterns": [
            {
                "id": 896,
                "ruleId": 198,
                "dialect": "apollo",
                "cmdPattern": "\\$D((29OCT|30OCT|31OCT)|(\\d{2}(NOV|DEC|JAN|FEB|MAR|APR|MAY)))(([A-Z]{3}(NBO|JNB|CPT|LOS|ACC|ADD|ROB|EBB|KGL|JRO|DAR|SEZ|BJM|ZNZ|LUN))|((NBO|JNB|CPT|LOS|ACC|ADD|ROB|EBB|KGL|JRO|DAR|SEZ|BJM|ZNZ|LUN)[A-Z]{3})).*",
                "onClickCommand": null,
                "regexError": 0
            },
            {"id":898,"ruleId":198,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":900,"ruleId":198,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":902,"ruleId":198,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":792,"ruleId":198,"gds":"apollo","pattern":"^(?P<value>.{5}KQ.{11}).{9}(?P<value2>.*)","regexError":0},
            {"id":794,"ruleId":198,"gds":"sabre","pattern":null,"regexError":0},
            {"id":796,"ruleId":198,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":798,"ruleId":198,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "200": {
        "id": 200,
        "highlightGroup": "airlineIncentives",
        "color": "errorMessage",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 29,
        "name": "eKReminder",
        "label": "EK reminder",
        "message": "Make sure to offer exclusive EK Net fares to ADD/EBB/NBO/JNB that are significantly cheaper than EK published!",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bold\"]",
        "cmdPatterns": [
            {
                "id": 904,
                "ruleId": 200,
                "dialect": "apollo",
                "cmdPattern": "\\$D\\d{2}(OCT|NOV)(NYC|JFK|LGA|EWR|WAS|IAD|DCA|BWI|BOS|CHI|ORD|FLL|ORL|DFW|HOU|IAH|SFO|LAX)(ADD|EBB|NBO|JNB).*",
                "onClickCommand": null,
                "regexError": 0
            },
            {"id":906,"ruleId":200,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":908,"ruleId":200,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":910,"ruleId":200,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":800,"ruleId":200,"gds":"apollo","pattern":"^(?P<value1>.{5}EK.{11}).{9}(?P<value2>.*)","regexError":0},
            {"id":802,"ruleId":200,"gds":"sabre","pattern":null,"regexError":0},
            {"id":804,"ruleId":200,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":806,"ruleId":200,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "202": {
        "id": 202,
        "highlightGroup": "fastSearch",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 30,
        "name": "totalPriceInFSResults",
        "label": "Total Price in FS results",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":912,"ruleId":202,"dialect":"apollo","cmdPattern":"FS.*|FS","onClickCommand":null,"regexError":0},
            {"id":914,"ruleId":202,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":916,"ruleId":202,"dialect":"amadeus","cmdPattern":"FX.*","onClickCommand":null,"regexError":0},
            {"id":918,"ruleId":202,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":808,"ruleId":202,"gds":"apollo","pattern":"^PRICING OPTION.{22,26}TOTAL AMOUNT\\s{3,6}(?<value1>([1-9].{5,11}))","regexError":0},
            {"id":810,"ruleId":202,"gds":"sabre","pattern":null,"regexError":0},
            {"id":812,"ruleId":202,"gds":"amadeus","pattern":"^.{11}RECOMMENDATION.{17,19}\\((?<value1>.{8,11})\\)","regexError":0},
            {"id":814,"ruleId":202,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "204": {
        "id": 204,
        "highlightGroup": "fastSearch",
        "color": "startSession",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 31,
        "name": "pRINGOPTIONInFSResults",
        "label": "\"PRING OPTION\" in FS results",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":920,"ruleId":204,"dialect":"apollo","cmdPattern":"FS.*|FS","onClickCommand":null,"regexError":0},
            {"id":922,"ruleId":204,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":924,"ruleId":204,"dialect":"amadeus","cmdPattern":"FX*","onClickCommand":null,"regexError":0},
            {"id":926,"ruleId":204,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":816,"ruleId":204,"gds":"apollo","pattern":"^(?<value2>PRICING OPTION.{22,26}TOTAL AMOUNT)\\s","regexError":0},
            {"id":818,"ruleId":204,"gds":"sabre","pattern":null,"regexError":0},
            {"id":820,"ruleId":204,"gds":"amadeus","pattern":"^(.{8,11})(?<value2>RECOMMENDATION\\s[1-9].{5,40})\\(","regexError":0},
            {"id":822,"ruleId":204,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "206": {
        "id": 206,
        "highlightGroup": "historyScreen",
        "color": "warningMessage",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 33,
        "name": "historicalStore",
        "label": "Historical Store",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":928,"ruleId":206,"dialect":"apollo","cmdPattern":"\\*H\\$","onClickCommand":null,"regexError":0},
            {"id":930,"ruleId":206,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":932,"ruleId":206,"dialect":"amadeus","cmdPattern":"TTH.*","onClickCommand":null,"regexError":0},
            {"id":934,"ruleId":206,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":824,"ruleId":206,"gds":"apollo","pattern":"^A\\$.*TOT.*\\d?$","regexError":0},
            {"id":826,"ruleId":206,"gds":"sabre","pattern":null,"regexError":0},
            {"id":828,"ruleId":206,"gds":"amadeus","pattern":"(^AC\\s.*$)|(^AF\\/.*$)|(^\\s{5}.*GT.*$)","regexError":0},
            {"id":830,"ruleId":206,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "208": {
        "id": 208,
        "highlightGroup": "historyScreen",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 34,
        "name": "storedPricingCommand",
        "label": "Stored pricing command",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bordered\"]",
        "cmdPatterns": [
            {"id":936,"ruleId":208,"dialect":"apollo","cmdPattern":"\\*H\\$","onClickCommand":null,"regexError":0},
            {"id":938,"ruleId":208,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":940,"ruleId":208,"dialect":"amadeus","cmdPattern":"TTH.*","onClickCommand":null,"regexError":0},
            {"id":942,"ruleId":208,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":832,"ruleId":208,"gds":"apollo","pattern":"^A\\$\\sREPR.*$","regexError":0},
            {"id":834,"ruleId":208,"gds":"sabre","pattern":null,"regexError":0},
            {"id":836,"ruleId":208,"gds":"amadeus","pattern":"^PE\\s.*$","regexError":0},
            {"id":838,"ruleId":208,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "214": {
        "id": 214,
        "highlightGroup": "tariffDisplay",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "patternOnly",
        "priority": 35,
        "name": "fareRulesSections",
        "label": "Fare rules sections",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":960,"ruleId":214,"dialect":"apollo","cmdPattern":"(\\$V|FN)\\d+\\/(16|31)","onClickCommand":null,"regexError":0},
            {"id":962,"ruleId":214,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":964,"ruleId":214,"dialect":"amadeus","cmdPattern":"FQN\\d+\\*(16|31)","onClickCommand":null,"regexError":0},
            {"id":966,"ruleId":214,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":856,"ruleId":214,"gds":"apollo","pattern":"^.*(CANCELLATIONS\\s\\s)|(^.*REFUND\\s\\s)|(^.*EXCHANGE\\s\\s)|(^.*CHANGES\\s\\s)|(^.*REISSUE\\s\\s)|(NO-SHOW\\s)","regexError":0},
            {"id":858,"ruleId":214,"gds":"sabre","pattern":null,"regexError":0},
            {"id":860,"ruleId":214,"gds":"amadeus","pattern":"^.*(CANCELLATIONS\\s\\s)|(^.*REFUND\\s\\s)|(^.*EXCHANGE\\s\\s)|(^.*CHANGES\\s\\s)|(^.*REISSUE\\s\\s)|(NO-SHOW\\s)","regexError":0},
            {"id":862,"ruleId":214,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "216": {
        "id": 216,
        "highlightGroup": "fastSearch",
        "color": "warningMessage",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 36,
        "name": "rEBOOKCANCELSELECTEDFLIGHTOPTION",
        "label": "REBOOK/CANCEL SELECTED FLIGHT OPTION",
        "message": "REBOOK/CANCEL FLIGHT OPTION",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bold\",\"bordered\"]",
        "cmdPatterns": [
            {"id":968,"ruleId":216,"dialect":"apollo","cmdPattern":"FS.*|FS","onClickCommand":"{pattern}","regexError":0},
            {"id":970,"ruleId":216,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":972,"ruleId":216,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":974,"ruleId":216,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":864,"ruleId":216,"gds":"apollo","pattern":"^\\>(?<value>FS\\d{2,3})\\·","regexError":0},
            {"id":866,"ruleId":216,"gds":"sabre","pattern":null,"regexError":0},
            {"id":868,"ruleId":216,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":870,"ruleId":216,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "218": {
        "id": 218,
        "highlightGroup": "fastSearch",
        "color": "warningMessage",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 37,
        "name": "vIEWFAREPRICINGDETAILS",
        "label": "VIEW FARE PRICING DETAILS",
        "message": "VIEW FARE PRICING DETAILS",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[\"bold\",\"bordered\"]",
        "cmdPatterns": [
            {"id":976,"ruleId":218,"dialect":"apollo","cmdPattern":"FS.*|FS","onClickCommand":"{pattern}/MDA","regexError":0},
            {"id":978,"ruleId":218,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":980,"ruleId":218,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":982,"ruleId":218,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":872,"ruleId":218,"gds":"apollo","pattern":"\\>(?<value>FS\\*\\d{1,2})\\·","regexError":0},
            {"id":874,"ruleId":218,"gds":"sabre","pattern":null,"regexError":0},
            {"id":876,"ruleId":218,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":878,"ruleId":218,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "220": {
        "id": 220,
        "highlightGroup": "fastSearch",
        "color": "usedCommand",
        "backgroundColor": null,
        "highlightType": "customValue",
        "priority": 38,
        "name": "vIEWADDITIONALPRICINGOPTIONS",
        "label": "VIEW ADDITIONAL PRICING OPTIONS",
        "message": "VIEW ADDITIONAL PRICING OPTIONS",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 1,
        "decoration": "[\"bold\",\"bordered\"]",
        "cmdPatterns": [
            {"id":984,"ruleId":220,"dialect":"apollo","cmdPattern":"FS.*|FS","onClickCommand":"{pattern}/MDA","regexError":0},
            {"id":986,"ruleId":220,"dialect":"sabre","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":988,"ruleId":220,"dialect":"amadeus","cmdPattern":null,"onClickCommand":null,"regexError":0},
            {"id":990,"ruleId":220,"dialect":"galileo","cmdPattern":null,"onClickCommand":null,"regexError":0}
        ],
        "patterns": [
            {"id":880,"ruleId":220,"gds":"apollo","pattern":"\\>(?<value>FSMORE)\\·","regexError":0},
            {"id":882,"ruleId":220,"gds":"sabre","pattern":null,"regexError":0},
            {"id":884,"ruleId":220,"gds":"amadeus","pattern":null,"regexError":0},
            {"id":886,"ruleId":220,"gds":"galileo","pattern":null,"regexError":0}
        ]
    },
    "222": {
        "id": 222,
        "highlightGroup": "historyScreen",
        "color": "usedCommand",
        "backgroundColor": "",
        "highlightType": "patternOnly",
        "priority": 0,
        "name": "RCVDInH",
        "label": "RCVD in *H",
        "message": "",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 0,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":992,"ruleId":222,"dialect":"apollo","cmdPattern":"^\\*H.*","onClickCommand":"","regexError":0},
            {"id":994,"ruleId":222,"dialect":"sabre","cmdPattern":"","onClickCommand":"","regexError":0},
            {"id":996,"ruleId":222,"dialect":"amadeus","cmdPattern":"","onClickCommand":"","regexError":0},
            {"id":998,"ruleId":222,"dialect":"galileo","cmdPattern":"","onClickCommand":"","regexError":0}
        ],
        "patterns": [
            {"id":888,"ruleId":222,"gds":"apollo","pattern":"^RCVD-","regexError":0},
            {"id":890,"ruleId":222,"gds":"sabre","pattern":"","regexError":0},
            {"id":892,"ruleId":222,"gds":"amadeus","pattern":"","regexError":0},
            {"id":894,"ruleId":222,"gds":"galileo","pattern":"","regexError":0}
        ]
    },
    "224": {
        "id": 224,
        "highlightGroup": "pricingScreen",
        "color": "errorMessage",
        "backgroundColor": "",
        "highlightType": "customValue",
        "priority": 0,
        "name": "ExceedingMaximumPermittedMileageOnPricingScreen",
        "label": "Exceeding maximum permitted Mileage on Pricing screen",
        "message": "The fare can be lower if a different route is chosen",
        "isMessageOnClick": 0,
        "isOnlyFirstFound": 0,
        "isEnabled": 1,
        "isForTestersOnly": 0,
        "isInSameWindow": 0,
        "decoration": "[]",
        "cmdPatterns": [
            {"id":1016,"ruleId":224,"dialect":"apollo","cmdPattern":"\\$B.*|\\*LF|T\\:\\$B|FS\\*\\d{1,2}","onClickCommand":"","regexError":0},
            {"id":1018,"ruleId":224,"dialect":"sabre","cmdPattern":"","onClickCommand":"","regexError":0},
            {"id":1020,"ruleId":224,"dialect":"amadeus","cmdPattern":"","onClickCommand":"","regexError":0},
            {"id":1022,"ruleId":224,"dialect":"galileo","cmdPattern":"","onClickCommand":"","regexError":0}
        ],
        "patterns": [
            {"id":912,"ruleId":224,"gds":"apollo","pattern":"","regexError":0},
            {"id":914,"ruleId":224,"gds":"sabre","pattern":"","regexError":0},
            {"id":916,"ruleId":224,"gds":"amadeus","pattern":"","regexError":0},
            {"id":918,"ruleId":224,"gds":"galileo","pattern":"","regexError":0}
        ]
    }
};