
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
                "consolidator": "Cosmopolitan Travel",
                "pcc_type": "Consolidator PCC",
                "arc_type": "ARC",
                "content_type": "Pub / Nets",
                "gds": "Apollo",
                "gds_pcc": "Apollo/15JE",
                "sabre_b_type": null,
                "sabre_c_type": null,
                "consolidator_uuid": "9c1da1bd-de70-11e6-991c-125119b79a05",
                "point_of_sale_city": "DTT",
                "point_of_sale_country": "US",
                "can_issue_tickets": true,
                "consolidator_currency_override": null,
                "pcc": "15JE",
                "pcc_name": "COSMOPOLITAN TVL",
                "arc_nr": 23612444,
                "cc_allowance": true,
                "ticket_self": true,
                "ticket_order": false,
                "aaa_from": null,
                "dk_number": null,
                "ticket_mask_pcc": "15JE",
                "ticketing_remarks": [
                    {"ticketing_remark":"T-CA¤D415840020"},
                    {"ticketing_remark":"T-UD25 {fareType}"}
                ],
                "invoice_number": null,
                "hap": "DynApolloProd_15JE",
                "can_book_pnr": true,
                "can_price_pnr": true,
                "can_store_fare": true,
                "currency": null
            }
        ]
    }
}
