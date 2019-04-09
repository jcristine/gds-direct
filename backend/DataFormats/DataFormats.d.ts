
interface IEmcUser {
    "name": "Arturs Klesuns",
    "location": {"id":1,"name":"rix","label":"RIX"},
    "hrmId": "6865",
    "id": "6206",
    "emcId": "6206",
    "login": "aklesuns",
    "displayName": "aklesuns",
    "teamId": "2167",
    "isActive": "1",
    "createTime": "2016-01-06 05:44:01",
    "sourceId": "6206",
    "employeeId": "11321",
    "dmsId": null,
    "statusId": "2",
    "gender": null,
    "position": {
        "department": {"id":"14","name":"dynatech","label":"Dynatech"},
        "occupation": null
    },
    "phones": [
        {"uid":"5VM5I38S337","mask":"3712*****11","type":"mobile"},
        {"uid":"5VM5I38S337","mask":"3712*****11","type":"primary"}
    ],
    "photos": {}[],
    "groups": [{"id":3384,"name":"Developers","project":true}],
    "roles": [
        "login",
        "IS_BACKOFFICE_DEVELOPER",
        "cmsTerminal",
        "cmsCanChangeOfficeIpList",
        "cmsTester",
        "allowSearchBySaleData",
        "accessToAdminTools",
        "accessToProductsTools",
        "accessToManagementTools",
        "menu_StatisticBQPerfomance",
        "menu_StatisticaAgentsAssignStat",
        "menu_StatisticCallStat",
        "menu_StatisticCCQtPerformance",
        "menu_StatisticCompanyPerfomance",
        "menu_StatisticCompliancePerfomance",
        "menu_StatisticExpertPerfomance",
        "menu_StatisticOficePerfomance",
        "menu_StatisticAgentsBurn",
        "menu_StatisticRequestsAssign",
        "menu_StatisticViewContacts",
        "allowSearchByRequestId",
        "cmsCanUnmerge",
        "cmsIsWikiDeveloper",
        "canAddHotel",
        "gdsDirectInNewWindow",
        "cmsMoveRequestToQueueManually",
        "cmsNavigationSearch",
        "allowAccessToFullLogs",
        "allowViewallAgents",
        "allowAccessToAdminLogs",
        "gdsDirectAdministrator",
        "cmsFeedbackFullAccess",
        "cmsComplianceStatisticAccess",
        "accessToLogs",
        "allowAccessToChangeLog",
        "cmsCanViewStatTooltips",
        "cmsAllowAccessRawTablesData",
        "canSeeMarketingInfo",
        "allowAccessToCreateSaleLog",
        "allowAccessToCallbacksLog",
        "allowAccessToLoggerLog",
        "canViewWrongContactInfo",
        "canVerifyWrongContactInfo"
    ],
    "settings": {
        "isSLTagent": "0",
        "ageInMonths": "35",
        "gds_direct_fs_limit": "30",
        "isBogAgent": "0",
        "isbookkeeping": "0",
        "percent": "0.00",
        "split_business": "0",
        "isadmin": "0",
        "jobstart": "",
        "jobfinish": "",
        "fax": "",
        "voip_priority": "0",
        "voip_priorityBusiness": "0",
        "isHomeAgent": "0",
        "fixedCommissionFlag": "0",
        "scheduleEnabled": "0",
        "commissionEnabled": "0",
        "startWorkOnFloorDt": "2016-01-06 00:00:00",
        "isEligibleForWithholding": "0",
        "skipThreeMonthsScheme": "0",
        "remoteAccess": "0",
        "remoteVoipAccess": "0",
        "isCrmAgent": "0",
        "isshipper": "0",
        "cs_num": "0",
        "_status": "0",
        "_look_team": "0",
        "xmppPassword": "",
        "vipLineAccess": "0",
        "lastAttendanceIncident": "0000-00-00",
        "firstNotification": "0",
        "voip_prioritySpecial_1": "0",
        "isApplicant": "0",
        "timeOnTheFloor": "0",
        "birthday": "2016-01-06 00:00:00",
        "eligibleForUnsupervisedPq": "0",
        "contactPhone": "",
        "trainerId": "0",
        "callLimitBonusFactor": "1",
        "tmpLastAttendanceIncident": "0000-00-00",
        "maxWorkingHoursPerDay": "8",
        "epassporteLogin": "",
        "studAccountNumber": "",
        "groupNumber": "",
        "gtid": "95",
        "epassporteLoginAgent": "",
        "fixedVipPriority": "0",
        "skipExperiencedScheme": "0",
        "novice": "0",
        "avgMarkByLast30Days": "0.0000",
        "isExperienced": "0",
        "isOldLfAgent": "0",
        "isAgency": "0",
        "callForwardingNumber": "",
        "eligibleForCallForwarding": "ageDependent",
        "hasSales": "1",
        "version": "1",
        "initials": ""
    },
    "companySettings": {
        "SLT": {"voipDirect":null,"email":null},
        "ITN": {"voipDirect":null,"email":null},
        "UK": {"voipDirect":null,"email":null},
        "CA": {"voipDirect":null,"email":null},
        "BOG": {"voipDirect":null,"email":null},
        "ME": {"voipDirect":null,"email":null},
        "PH": {"voipDirect":null,"email":null},
        "DXF": {"voipDirect":null,"email":null}
    },
    "availableCompanies": {
        "2": "SLT",
        "3": "ITN",
        "11": "UK",
        "22": "CA",
        "24": "BOG",
        "26": "ME",
        "28": "PH",
        "46": "DXF"
    }
}

interface IEmcResult {
    "session": "befef28ce6c2b508f11a52c7f7615ed3",
    "project": "LMS",
    "user": IEmcUser,
}

interface IRbsRunCommandResult {
    "status": "executed",
    "sessionInfo": {
        "isAlive": true,
        "pcc": "2G55",
        "area": "A",
        "recordLocator": "",
        "canCreatePq": false,
        "pricingCmd": '',
        "canCreatePqFor": ["infant","child","pricing"],
        "canCreatePqErrors": [
            "PNR changed since last pricing - must price again",
            "Segment #2 has disallowed status - NN",
            "Children must not be priced with $BB",
            "Pricing command must have children",
            "Pricing command should not override booking class - /@A/ is forbidden",
            "Pricing command should not have segment select - /S1/ is forbidden",
            "Pricing command should not ignore availability - >$BBA/ is forbidden",
            "Pricing command should not have Sabre Low Fare Search - /NC/ is forbidden",
            "GDS returned pricing error",
            "Pricing needs rebook"
        ]
    },
    "calledCommands": [
        {
            "cmd": "HELP HELP",
            "output":
                "HELP WITH HELP                              PAGE 1 OF 8" |
                "--------------" |
                " " |
                "   HOW HELP IS STRUCTURED.................>MD;" |
                "   THE HELP INDEX TABSTOP.................>MD39;" |
                "   IF YOU DON*T KNOW A TOPIC..............>MD52;" |
                "   HOW TO ACCESS A HELP TOPIC.............>MD65;" |
                "   SEND HELP SUGGESTIONS/COMMENTS.........>MD78;" |
                "   RELATED TOPICS.........................>MB;" |
                "   HELP INDEX..................>HELP INDEX-HELP;" |
                "   **TO USE THIS MENU..USE THE TAB KEY TO MOVE TO THE" |
                "     SUBJECT YOU WISH TO READ..AND PRESS THE ENTER KEY **" |
                " " |
                ")><"
            "tabCommands": ["MD","MD39","MD52","MD65","MD78","MB","HELP INDEX-HELP"]
        }
    ],
    "clearScreen": false,
    "userMessages": ["Note, you have just 12 FS commands left till the end of day"],
    "messages": [
        {
            "type": "console_info",
            "text": "Note, you have just 12 FS commands left till the end of day"
        },
        {
            "type": "console_error",
            "text": "Forbidden command, cant delete fields in ticketed PNR"
        },
        {
            "type": "pop_up",
            "text": "CORRECTED! DO NOT FORGET $ SIGN NEXT TIME"
        }
    ]
}

interface ICmsHighlightData {
    "aaData": [
        {
            "id": 12,
            "highlightGroupId": 12,
            "terminalColorId": 14,
            "terminalBackgroundColorId": 0,
            "highlightTypeId": 10,
            "priority": 0,
            "name": "routingIndicatorInTariffDisplay",
            "label": "\"Routing\" Indicator in Tariff Display",
            "message": "Click to see the Routing Rules",
            "isMessageOnClick": 0,
            "isOnlyFirstFound": 0,
            "isEnabled": 1,
            "isForTestersOnly": 0,
            "isInSameWindow": 0,
            "textDecorationUnderline": 0,
            "textDecorationDotted": 0,
            "textDecorationBold": 0,
            "textDecorationBordered": 0,
            "textDecorationItalic": 0,
            "textDecorationLarge": 0,
            "languages": {
                "2": {
                    "id": 32,
                    "terminalHighlightId": 12,
                    "terminalInputLanguageId": 2,
                    "gdsCommand": "\\$D.*",
                    "onClickCommand": "$LR{lnNumber}/MDA",
                    "regexError": 0
                },
                "4": {
                    "id": 34,
                    "terminalHighlightId": 12,
                    "terminalInputLanguageId": 4,
                    "gdsCommand": null,
                    "onClickCommand": null,
                    "regexError": 0
                },
                "6": {
                    "id": 36,
                    "terminalHighlightId": 12,
                    "terminalInputLanguageId": 6,
                    "gdsCommand": "FQD.*",
                    "onClickCommand": null,
                    "regexError": 0
                },
                "8": {
                    "id": 562,
                    "terminalHighlightId": 12,
                    "terminalInputLanguageId": 8,
                    "gdsCommand": "FD.*",
                    "onClickCommand": null,
                    "regexError": 0
                }
            },
            "gds": {
                "2": {
                    "id": 42,
                    "terminalHighlightId": 12,
                    "gdsId": 2,
                    "pattern": "^(.{50,65})(?<value1>\\bR\\b)",
                    "regexError": 0
                },
                "3": {
                    "id": 44,
                    "terminalHighlightId": 12,
                    "gdsId": 3,
                    "pattern": null,
                    "regexError": 0
                },
                "4": {
                    "id": 46,
                    "terminalHighlightId": 12,
                    "gdsId": 4,
                    "pattern": "^\\d.*(?<value>R$)",
                    "regexError": 0
                },
                "6": {
                    "id": 48,
                    "terminalHighlightId": 12,
                    "gdsId": 6,
                    "pattern": "^\\s+\\d+.{53}(?<value>R)",
                    "regexError": 0
                }
            }
        }
    ],
    "recordsTotal": 105,
    "recordsFiltered": 105,
    "draw": 1,
    "query": "SELECT terminalHighlight.id FROM terminalHighlight LIMIT 0, 100"
}

interface IFullCmsHighlightData {
    "cmsData": ICmsHighlightData,
    "emcSessionId": "2aae108030ad283429e7333a1ee7872c",
    "langs": {
        "aaData": [
            {"id":2,"name":"apollo"},
            {"id":4,"name":"sabre"},
            {"id":6,"name":"amadeus"},
            {"id":8,"name":"galileo"}
        ],
        "recordsTotal": null,
        "recordsFiltered": null,
        "draw": 1,
        "query": "SELECT terminalInputLanguages.id FROM terminalInputLanguages LIMIT 0, 5000"
    },
    "groups": {
        "aaData": [
            {
                "id": 18,
                "name": "airlineIncentives",
                "label": "Airline Incentives"
            },
            {
                "id": 6,
                "name": "availabilityScreen",
                "label": "Availability Screen"
            },
            {"id":4,"name":"errors","label":"Errors"},
            {"id":24,"name":"fastSearch","label":"Fast Search (FS)"},
            {"id":20,"name":"historyScreen","label":"History Screen"},
            {"id":2,"name":"others","label":"Others"},
            {"id":14,"name":"pnrScreen","label":"PNR Screen"},
            {"id":8,"name":"pricingScreen","label":"Pricing Screen"},
            {"id":16,"name":"routingScreen","label":"Routing Screen"},
            {"id":22,"name":"seatMap","label":"Seat Map"},
            {"id":26,"name":"svc","label":"*SVC"},
            {"id":12,"name":"tariffDisplay","label":"Tariff Display"},
            {"id":10,"name":"ticketMask","label":"Ticket Mask"}
        ],
        "recordsTotal": null,
        "recordsFiltered": null,
        "draw": 1,
        "query": "SELECT terminalHighlightGroups.id FROM terminalHighlightGroups LIMIT 0, 5000"
    },
    "colors": {
        "aaData": [
            {
                "id": 2,
                "name": "activeWindow",
                "label": "Active Window Background"
            },
            {"id":4,"name":"defaultBg","label":"Default Background"},
            {"id":6,"name":"entryFont","label":"Entry Font"},
            {"id":8,"name":"errorMessage","label":"Error Message"},
            {"id":24,"name":"highlightBlue","label":"Highlight Blue"},
            {"id":20,"name":"highlightDark","label":"Highlight Dark"},
            {"id":22,"name":"highlightLight","label":"Highlight Light"},
            {"id":10,"name":"outputFont","label":"Output Font"},
            {
                "id": 12,
                "name": "specialHighlight",
                "label": "Special \"Highlight\""
            },
            {"id":14,"name":"startSession","label":"Start Session"},
            {"id":16,"name":"usedCommand","label":"Used Command"},
            {"id":18,"name":"warningMessage","label":"Warning Message"}
        ],
        "recordsTotal": null,
        "recordsFiltered": null,
        "draw": 1,
        "query": "SELECT terminalColors.id FROM terminalColors LIMIT 0, 5000"
    },
    "types": {
        "aaData": [
            {
                "id": 10,
                "name": "customValue",
                "label": "Custom values (?<name>)"
            },
            {"id":4,"name":"fullLine","label":"Full Line"},
            {"id":2,"name":"patternOnly","label":"Pattern Only"},
            {"id":8,"name":"patternToEnd","label":"Pattern To End"},
            {"id":6,"name":"patternToStart","label":"Pattern To Start"}
        ],
        "recordsTotal": null,
        "recordsFiltered": null,
        "draw": 1,
        "query": "SELECT terminalHighlightTypes.id FROM terminalHighlightTypes LIMIT 0, 5000"
    }
}

// table row definition follows (may be outdated)

type int = number;
type tinyint = number;
type char = string;
type VARCHAR = string;
type BOOLEAN = boolean;
type DATETIME = string;
type INTEGER = int;
type varchar = VARCHAR;
type INT = int;

type EGds = 'apollo' | 'sabre' | 'amadeus' | 'galileo';

// database row type definitions follow

interface IHighlightRules {
    id: int,
    highlightGroup: VARCHAR,
    color: VARCHAR,
    backgroundColor: VARCHAR,
    highlightType: VARCHAR,
    priority: INTEGER,
    name: varchar,
    label: varchar,
    message: varchar,
    isMessageOnClick: BOOLEAN,
    isOnlyFirstFound: BOOLEAN,
    isEnabled: BOOLEAN,
    isForTestersOnly: BOOLEAN,
    isInSameWindow: BOOLEAN,
    decoration: VARCHAR,
}
interface highlightCmdPatterns {
    id: int,
    ruleId: int,
    dialect: VARCHAR,
    cmdPattern: varchar,
    onClickCommand: varchar,
    regexError: tinyint,
}
interface highlightOutputPatterns {
    id: int,
    ruleId: int,
    gds: VARCHAR,
    pattern: varchar,
    regexError: BOOLEAN,
}

interface terminalAreaSettings {
    id: int,
    gds: varchar,
    area: char,
    agentId: int,
    defaultPcc: varchar,
}

type IFullHighlightDataEl = IHighlightRules & {
    decoration: string[],
    languages: {[k in EGds]: highlightCmdPatterns},
    gds: {[k in EGds]: highlightOutputPatterns},
}
interface IFullHighlightData {
    aaData: IFullHighlightDataEl[],
}

interface ISaveHighlightRuleParams {
    "id": "22",
    "priority": "",
    "highlightGroup": "pricingScreen",
    "label": "Baggage Info (1-3 PCs)",
    "languages": {
        "apollo": {"cmdPattern":"\\$B.*|\\*LF|T\\:\\$B","onClickCommand":""},
        "sabre": {"cmdPattern":"WP\\*BAG","onClickCommand":""},
        "amadeus": {"cmdPattern":"FX.*","onClickCommand":""},
        "galileo": {"cmdPattern":"FQ.*","onClickCommand":""}
    },
    "gds": {
        "apollo": {"pattern":"BAGGAGE ALLOWANCE\\n.*\\n.*(3PC|2PC|1PC)\\b"},
        "sabre": {"pattern":"^BAG ALLOWANCE\\s+\\-[A-Z]{6}\\-(01P|02P|03P)"},
        "amadeus": {"pattern":"^.{58}\\K(1P$|2P$|3P$)"},
        "galileo": {"pattern":"^BAGGAGE ALLOWANCE\\n.*$\\n.*\\s(1PC|2PC|3PC)"}
    },
    "highlightType": "patternOnly",
    "isOnlyFirstFound": "0",
    "color": "warningMessage",
    "backgroundColor": "",
    "decorationFlags": {
        "underline": "0",
        "bold": "0",
        "dotted": "0",
        "bordered": "0",
        "large": "0",
        "italic": "0"
    },
    "message": "",
    "isMessageOnClick": "0",
    "isInSameWindow": "0",
    "isEnabled": "1",
    "isForTestersOnly": "0",
    "saveType": "editRow",
    "emcSessionId": "2b9135b7f0719e7bd1fc1f3f00d180c5\n"
}

interface IPromiseMysqlQueryResult {
    "fieldCount": 0,
    "affectedRows": 2,
    "insertId": 14,
    "serverStatus": 2,
    "warningCount": 1,
    "protocol41": true,
    "changedRows": 0
}

interface ITestEvent {
    type: 'ok' | 'error',
    msg?: string,
}

type EAreaLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

interface IAreaState {
    canCreatePq: string,
    area: EAreaLetter,
    recordLocator: string,
    pcc: string,
    lead_creator_id: string,
    isPnrStored: string,
    hasPnr: string,
}

type IFullSessionState = IAreaState & {
    area: EAreaLetter,
    areas: {[area in EAreaLetter]: IAreaState},
}

type ETravelportProfile = 'DynApolloProd_1O3K' | 'DynApolloProd_2F3K' | 'DynApolloCopy_1O3K' | 'DynApolloProd_2G55' | 'DynGalileoProd_711M';
type ESabreProfile = 'SABRE_PROD_L3II' | 'SABRE_PROD_Z2NI' | 'SABRE_PROD_6IIF' | 'SABRE_PROD_8ZFH';
type EAmadeusProfile = 'AMADEUS_TEST_1ASIWTUTICO' | 'AMADEUS_PROD_1ASIWTUTICO' | 'AMADEUS_PROD_1ASIWTUT0GW';
interface IGdsProfileMap {
    travelport: {
        [gdsProfile in ETravelportProfile]: {
            username: 'GWS/PCC1O3K',
            password: 'qwe123',
        }
    },
    sabre: {
        [gdsProfile in ESabreProfile]: {
            password: 'qwe123',
            username: '1234',
            default_pcc: 'L3II',
        }
    },
    amadeus: {
        [gdsProfile in EAmadeusProfile]: {
            username: 'WS0GWTUT',
            password: 'qwe123',
            default_pcc: 'LAXGO3106',
            endpoint: 'https://nodeD1.test.webservices.amadeus.com/1ASIWTUTICO'
                    | 'https://nodeD1.production.webservices.amadeus.com/1ASIWTUTICO',
        }
    },
}

type IExchangeApolloTicketParsedMask = {
    mcoRows: [{
        command: '*MCO1',
        passengerName: 'BITCA/IU',
        documentNumber: '0065056180983',
        issueDate: {raw: '03APR19', parsed: '2019-04-03'},
        amount: '100.00',
        "fullData": {
            "passengerName": "BITCA/IURI",
            "to": "DL",
            "at": "ATL",
            "validFor": "SPLIT",
            "tourCode": "",
            "ticketNumber": "",
            "formOfPayment": {"raw": "AXXXXXXXXXXXX1052/OK"},
            "expirationMonth": "02",
            "expirationYear": "23",
            "approvalCode": "109678",
            "commission": "0.00/",
            "taxAmount": "",
            "taxCode": "",
            "baseFare": {"currency": "USD", "amount": "100.00"},
            "fareEquivalent": null,
            "rateOfExchange": "",
            "endorsementBox": "",
            "remark1": "",
            "remark2": "",
            "validatingCarrier": "DL",
            "issueNow": false
        }
    }],
    headerData: {
        lastName: string,
        firstName: string,
        majorNumber: string,
        minorNumber: string,
        baseFareCurrency: string,
        baseFareAmount: string,
        netPriceCurrency: string,
        netPriceAmount: string,
        equivalentPart: string,
        taxCurrency1: string,
        taxAmount1: string,
        taxCode1: string,
        taxCurrency2: string,
        taxAmount2: string,
        taxCode2: string,
        taxCurrency3: string,
        taxAmount3: string,
        taxCode3: string,
        exchangedTicketCurrency: string,
    }
    fields: [
        {"enabled"?: true , "key": "exchangedTicketNumber", "value": ""},
        {"enabled"?: true , "key": "exchangedTicketExtension", "value": ""},
        {"enabled"?: false, "key": "ticketNumber1", "value": "01672891061612"},
        {"enabled"?: false, "key": "couponNumber1", "value": "1"},
        {"enabled"?: true , "key": "ticketNumber2", "value": ""},
        {"enabled"?: true , "key": "couponNumber2", "value": ""},
        {"enabled"?: true , "key": "commission", "value": ""},
        {"enabled"?: false, "key": "originalFormOfPayment", "value": "CK"},
        {"enabled"?: true , "key": "evenIndicator", "value": ""},
        {"enabled"?: false, "key": "exchangedTicketTotalValue", "value": "983.30"},
        {"enabled"?: false, "key": "originalBoardPoint", "value": "SFO"},
        {"enabled"?: false, "key": "originalOffPoint", "value": "LAX"},
        {"enabled"?: false, "key": "taxAmount1", "value": "67.60"},
        {"enabled"?: false, "key": "taxCode1", "value": "US"},
        {"enabled"?: false, "key": "taxAmount2", "value": "14.30"},
        {"enabled"?: false, "key": "taxCode2", "value": "XT"},
        {"enabled"?: true , "key": "taxAmount3", "value": ""},
        {"enabled"?: true , "key": "taxCode3", "value": ""},
        {"enabled"?: false, "key": "originalIssuePoint", "value": "SFO"},
        {"enabled"?: false, "key": "originalIssueDate", "value": "02APR19"},
        {"enabled"?: false, "key": "originalAgencyIata", "value": "00000000 "},
        {"enabled"?: false, "key": "originalTicketStar", "value": "0161111111111"},
        {"enabled"?: false, "key": "originalTicketStarExtension", "value": ""},
        {"enabled"?: false, "key": "originalInvoiceNumber", "value": ""},
        {"enabled"?: true , "key": "penaltyAmount", "value": ""},
        {"enabled"?: true , "key": "commOnPenaltyAmount", "value": ""}
    ],
    maskOutput?: '>$EX NAME ...',
}