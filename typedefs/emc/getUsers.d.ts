interface getUsers_rs_el {
    "name": "Stefan Stratan",
    "location": {"id":2,"name":"kiv","label":"KIV"},
    "hrmId": "39003",
    "id": "100548",
    "emcId": "100548",
    "login": "ss112",
    "displayName": "Chad",
    "teamId": "93",
    "isActive": "1",
    "createTime": "2018-05-25 10:00:14",
    "sourceId": "100548",
    "employeeId": "28122",
    "dmsId": null,
    "statusId": "2",
    "hasAccountInBackOffice": true,
    "gender": "Male",
    "position": {
        "department": {"id":"74","name":"Sales","label":"Sales"},
        "occupation": {"id":"12","name":"Expert","label":"Expert"}
    },
    "phones": [
        {
            "uid": "2STP3SQJ4NP",
            "mask": "3737*****77",
            "isPrimary": true,
            "type": "mobile"
        }
    ],
    "photos": [
        {
            "id": "6121000",
            "public": "1",
            "gender": "Male",
            "url": {
                "ITN": "//agentphotos2.asaptickets.com/api/v2/image/emc/39003_30ffd70c6ef4c524471860e67c5a02e1/inline/jpg/165/165",
                "ME": "//agentphotos2.asaptickets.com/api/v2/image/emc/39003_30ffd70c6ef4c524471860e67c5a02e1/inline/jpg/165/165"
            }
        }
    ],
    "groups": [
        {"id":3771,"name":"Experts","project":true},
        {"id":25,"name":"Experts"}
    ],
    "roles": [
        "login",
        "NEW_GDS_DIRECT_ACCESS",
        "NEW_GDS_DIRECT_PNR_SEARCH",
        "NEW_GDS_DIRECT_EDIT_VOID_TICKETED_PNR",
        "NEW_GDS_DIRECT_CAN_EMULATE_TO_RESTRICTED_SABRE_PCCS",
        "NEW_GDS_DIRECT_MULTI_PCC_TARIFF_DISPLAY",
        "NEW_GDS_DIRECT_PASTE_ITINERARY",
        "IS_PQ_AUDITOR"
    ],
    "settings": {
        "isSLTagent": "0",
        "ageInMonths": "10",
        "gds_direct_fs_limit": "30",
        "isBogAgent": "0",
        "scheduleEnabled": "1",
        "startWorkOnFloorDt": "2018-05-28",
        "isExpert": ["316"],
        "Sabre Initials": "SX",
        "Sabre LNIATA": ["0472F8"],
        "Sabre ID": "9409",
        "Sabre_PCC": "6IIF",
        "fp_initials": "KUZ",
        "rdp_password": "K57686KUZ",
        "RDP_Login": "Ss112"
    },
    "companySettings": {
        "ITN": {
            "voipDirect": "8442481886",
            "email": "chad.s@asaptickets.com",
            "defaultEmail": true
        },
        "ME": {"voipDirect":null,"email":"chad.s@asaptickets.com"}
    },
    "availableCompanies": {"3":"ITN","26":"ME"},
    "extensions": {
        "22943": {
            "id": 22943,
            "voipId": 81175,
            "autoLogin": 1,
            "location": null,
            "workgroups": {
                "84": {"name":"22901","priority":"1","callLimit":"2"},
                "36191": {"name":"22905","priority":"0","callLimit":"0"},
                "50011": {"name":"22919","priority":"0","callLimit":"0"},
                "59230": {"name":"22925","priority":"1","callLimit":"0"},
                "75982": {"name":"22931","priority":"1","callLimit":"0"}
            }
        }
    }
}

interface getUsers_rs {
    "data": {
        "users": {
            "100548": getUsers_rs_el,
        }
    }
}
