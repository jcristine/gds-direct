interface IEmcResult {
    "session": "befef28ce6c2b508f11a52c7f7615ed3",
    "project": "LMS",
    "user": {
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
        "photos": [],
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
}

interface IRbsRunCommandResult {
    "status": "executed",
    "sessionInfo": {
        "isAlive": true,
        "pcc": "2G55",
        "area": "A",
        "recordLocator": "",
        "canCreatePq": false,
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