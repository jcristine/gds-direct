

interface IRbsRunCommandResult {
    "status": "executed",
    "sessionInfo": {
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
