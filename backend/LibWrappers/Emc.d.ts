import {Interfaces} from "dynatech-client-component-emc/src";
import {ClientAbstract} from "dynatech-client-component/src/Interfaces";

interface IAuthorizeTokenRs {
    "data": {
        "sessionKey": "f1a80617203b889567378d7fc8a86c56",
        "companyGroupIds": [
            "2"
            ],
        "project": "CMS_CHAT",
        "redirectUrl": null,
        "user": {
            "name": "Janis Ozolins",
            "location": {
                "id": 1,
                "name": "rix",
                "label": "RIX"
            },
            "hrmId": "1349",
            "id": 100024,
            "emcId": "100024",
            "login": "jozolins",
            "displayName": "jozolins",
            "teamId": "2166",
            "isActive": "1",
            "createTime": "2017-04-10 11:10:04",
            "sourceId": "100024",
            "employeeId": "4879",
            "dmsId": null,
            "statusId": "2",
            "hasAccountInBackOffice": true,
            "gender": "Male",
            "position": {
                "department": {
                    "id": "14",
                    "name": "dynatech",
                    "label": "Dynatech"
                },
                "occupation": null
            },
            "phones": [
                {
                    "uid": "C0DALCELE9P",
                    "mask": "3712*****61",
                    "isPrimary": true,
                    "type": "mobile"
                }
                ],
            "photos": {}[],
            "groups": {}[],
            "roles": [
                "login"
                ],
            "settings": {
                "isSLTagent": "0",
                "ageInMonths": "23",
                "gds_direct_fs_limit": "0",
                "isBogAgent": "0",
                "startWorkOnFloorDt": "2017-04-10",
                "fp_initials": "RE5",
                "fullAccessToTeam": "1"
            },
            "companySettings": {
                "SLT": {
                    "voipDirect": null,
                    "email": null
                },
                "ITN": {
                    "voipDirect": null,
                    "email": "j.ozolins@dyninno.lv"
                },
                "UK": {
                    "voipDirect": null,
                    "email": null
                },
                "CA": {
                    "voipDirect": null,
                    "email": null
                },
                "BOG": {
                    "voipDirect": null,
                    "email": null
                },
                "ME": {
                    "voipDirect": null,
                    "email": null
                },
                "PH": {
                    "voipDirect": null,
                    "email": null
                },
                "Training": {
                    "voipDirect": null,
                    "email": null
                },
                "MNL": {
                    "voipDirect": null,
                    "email": null
                }
            },
            "availableCompanies": {
                "2": "SLT",
                "3": "ITN",
                "11": "UK",
                "22": "CA",
                "24": "BOG",
                "26": "ME",
                "28": "PH",
                "32": "Training",
                "56": "MNL"
            }
        }
    }
}


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

interface IEmcClient extends Interfaces.Emc, ClientAbstract {
    // add a bit more type info
    getLoginPage(project: string, url: string, data: any = null): Promise<{
        data: {
            data: 'http://auth-service.gitlab-runner.snx702.dyninno.net/loginservice#/?token=90548375f9b23097a6c65aa6672705cc',
            logId: 'emc.5c702612.e8f0207',
        }
    }>,
    authorizeToken: (token: string) => Promise<IAuthorizeTokenRs>,
}