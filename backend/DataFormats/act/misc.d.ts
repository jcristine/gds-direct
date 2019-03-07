
interface IGetAirlineBookingClassesRs {
    "status": "OK",
    "result": {
        "type": "content",
        "work_time": 0.18,
        "result_count": 406,
        "log_id": "ACT.5c818560.fa7bf49",
        "content": {
            "MU": {
                "business": {"C":true,"D":true,"I":true,"J":true,"Q":true},
                "economy": {"E":true,"H":true,"K":true,"L":true,"M":true,"N":true,"R":true,"S":true,"T":true,"V":true,"Y":true,"Z":true,"B":true},
                "first_class": {"F":true,"P":true,"U":true}
            }
        }
    }
}

interface IGetPccsAllRs {
    "status": "OK",
    "result": {
        "type": "content",
        "work_time": 1.065,
        "result_count": 131,
        "filter_count": 131,
        "total_count": 131,
        "content": [
            {
                "consolidator": "Sky Bird Travel (CA)",
                "pcc_type": "Consolidator PCC",
                "arc_type": "BSP",
                "content_type": "Pub / Nets",
                "gds": "Apollo",
                "gds_pcc": "Apollo/2BQ6",
                "sabre_b_type": null,
                "sabre_c_type": null,
                "point_of_sale_city": "YTO",
                "point_of_sale_country": "CA",
                "pcc": "2BQ6",
                "pcc_name": "SKY BIRD TRAVEL AND TOUR YSB",
                "arc_nr": 67505535,
                "cc_allowance": true,
                "ticket_self": true,
                "ticket_order": false,
                "aaa_from": null,
                "dk_number": null,
                "ticket_mask_pcc": "2BQ6",
                "ticketing_remarks": [
                    {"ticketing_remark":"T-CA-01¤8006772943"},
                    {
                        "ticketing_remark": "D-ITN TRAVEL¤100 PINE ST SUITE 1925¤SAN FRANSISCO¤CALIFORNIA 94111"
                    },
                    {"ticketing_remark":"T-G*RC/{routingCode}"}
                ],
                "invoice_number": null
            },
            {
                "consolidator": "GoWay Canada",
                "pcc_type": "Consolidator PCC",
                "arc_type": "BSP",
                "content_type": "Tour",
                "gds": "Amadeus",
                "gds_pcc": "Amadeus/YTOGO310E",
                "sabre_b_type": null,
                "sabre_c_type": null,
                "point_of_sale_city": "YTO",
                "point_of_sale_country": "CA",
                "pcc": "YTOGO310E",
                "pcc_name": "GOWAY TRAVEL",
                "arc_nr": 67541563,
                "cc_allowance": false,
                "ticket_self": false,
                "ticket_order": true,
                "aaa_from": null,
                "dk_number": null,
                "ticket_mask_pcc": "YTOGO310E",
                "ticketing_remarks": {}[],
                "invoice_number": null
            },
            {
                "consolidator": "Brightsun UK",
                "pcc_type": "Consolidator PCC",
                "arc_type": "BSP",
                "content_type": "Tour",
                "gds": "Sabre",
                "gds_pcc": "Sabre/0EKH",
                "sabre_b_type": "Yes",
                "sabre_c_type": "Yes",
                "point_of_sale_city": "LON",
                "point_of_sale_country": "GB",
                "pcc": "0EKH",
                "pcc_name": "BRIGHTSUN TRAVEL, MIDDLESEX, GB",
                "arc_nr": 91247424,
                "cc_allowance": false,
                "ticket_self": false,
                "ticket_order": true,
                "aaa_from": "6IIF",
                "dk_number": null,
                "ticket_mask_pcc": "0EKH",
                "ticketing_remarks": {}[],
                "invoice_number": null
            },
            {
                "consolidator": "Brightsun UK",
                "pcc_type": "Consolidator PCC",
                "arc_type": "BSP",
                "content_type": "Tour",
                "gds": "Galileo",
                "gds_pcc": "Galileo/111",
                "sabre_b_type": null,
                "sabre_c_type": null,
                "point_of_sale_city": null,
                "point_of_sale_country": null,
                "pcc": "111",
                "pcc_name": "111",
                "arc_nr": 1111111,
                "cc_allowance": false,
                "ticket_self": false,
                "ticket_order": false,
                "aaa_from": null,
                "dk_number": null,
                "ticket_mask_pcc": "111",
                "ticketing_remarks": {}[],
                "invoice_number": false
            }
        ]
    }
}
