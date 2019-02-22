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