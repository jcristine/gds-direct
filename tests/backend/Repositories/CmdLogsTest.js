const CmdLogs = require("../../../backend/Repositories/CmdLogs");

class CmdLogsTest extends require('../Transpiled/Lib/TestCase.js')
{
	provide_isInvalidFormat() {
		let list = [
		    [
		        {
		            "cmdRec": {"cmd":"B*R","output":"CK ACTN CODE \n><"},
		            "gds": "apollo"
		        },
		        true
		    ],
		    [
		        {"cmdRec":{"cmd":"*К","output":"INVLD \n><"},"gds":"apollo"},
		        true
		    ],
		    [
		        {"cmdRec":{"cmd":"*RIR","output":"INVLD \n><"},"gds":"apollo"},
		        true
		    ],
		    [
		        {
		            "cmdRec": {
		                "cmd": "T",
		                "output": "AG - DUTY CODE NOT AUTH FOR CRT - APOLLO\n><"
		            },
		            "gds": "apollo"
		        },
		        false
		    ],
		    [
		        {
		            "cmdRec": {
		                "cmd": "YT",
		                "output": "AG - DUTY CODE NOT AUTH FOR CRT - APOLLO\n><"
		            },
		            "gds": "apollo"
		        },
				false
		    ],
		    [
		        {
		            "cmdRec": {"cmd":"OI","output":"RESTRICTED \n><"},
		            "gds": "apollo"
		        },
		        true
		    ],
		    [
		        {"cmdRec":{"cmd":"*R4","output":"INVLD \n><"},"gds":"apollo"},
		        true
		    ],
		    [
		        {
		            "cmdRec": {
		                "cmd": "FN1*16",
		                "output": [
		                    " QUOTE01",
		                    " 01    MNL-CHI       FR-05APR19  OZ      NUC    430.00  WHASU14",
		                    "16. PENALTIES",
		                    "BETWEEN PHILIPPINES AND THE UNITED STATES",
		                    "  FOR TICKETING ON/AFTER 01APR 17",
		                    "    CANCELLATIONS",
		                    "      ANY TIME",
		                    "        CHARGE USD 200.00 FOR CANCEL/REFUND.",
		                    "        CHILD/INFANT DISCOUNTS APPLY.",
		                    "        WAIVED FOR DEATH OF PASSENGER OR FAMILY MEMBER.",
		                    "         NOTE -",
		                    "          1. WAIVED FOR DEATH OF THE PASSENGER/",
		                    "             IMMEDIATE FAMILY MEMBER VALID DEATH",
		                    ")><"
		                ].join("\n")
		            },
		            "gds": "apollo"
		        },
				false
		    ],
		    [
		        {
		            "cmdRec": {"cmd":"II","output":"CHECK FORMAT - II\n><"},
		            "gds": "apollo"
		        },
		        true
		    ],
		    [
		        {
		            "cmdRec": {"cmd":"OP/W","output":"RESTRICTED \n><"},
		            "gds": "apollo"
		        },
		        true
		    ],
		    [
		        {"cmdRec":{"cmd":"*AC1","output":"INVLD \n><"},"gds":"apollo"},
		        true
		    ],
		    [
		        {
		            "cmdRec": {"cmd":"II","output":"CHECK FORMAT - II\n><"},
		            "gds": "apollo"
		        },
		        true
		    ],
		    [
		        {"cmdRec":{"cmd":"*:F","output":"INVLD \n><"},"gds":"apollo"},
		        true
		    ],
		    [
		        {
		            "cmdRec": {"cmd":"4BB","output":"CK ACTN CODE \n><"},
		            "gds": "apollo"
		        },
		        true
		    ],
		    [
		        {
		            "cmdRec": {"cmd":"4BB","output":"CK ACTN CODE \n><"},
		            "gds": "apollo"
		        },
		        true
		    ],
		    [
		        {"cmdRec":{"cmd":"*R1*R","output":"INVLD \n><"},"gds":"apollo"},
		        true
		    ],
		    [
		        {
		            "cmdRec": {"cmd":"II","output":"CHECK FORMAT - II\n><"},
		            "gds": "apollo"
		        },
		        true
		    ],
		    [
		        {"cmdRec":{"cmd":"*/R","output":"INVLD \n><"},"gds":"apollo"},
		        true
		    ],
		    [
		        {
		            "cmdRec": {"cmd":"II","output":"CHECK FORMAT - II\n><"},
		            "gds": "apollo"
		        },
		        true
		    ],
		    [
		        {
		            "cmdRec": {"cmd":"568","output":"CK ACTN CODE \n><"},
		            "gds": "apollo"
		        },
		        true
		    ],
		    [
		        {
		            "cmdRec": {
		                "cmd": "$V1/16",
		                "output": [
		                    "  1 NYCBOG 08APR19 AM USD   266.00 NNNN6XCI STAY---/12MBK-N",
		                    "16. PENALTIES",
		                    "UNLESS OTHERWISE SPECIFIED   NOTE - RULE G016 IN IPRG",
		                    "APPLIES",
		                    "BETWEEN THE UNITED STATES AND AREA 1 FOR N-C TYPE FARES",
		                    "  CANCELLATIONS",
		                    "    ANY TIME",
		                    "      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.",
		                    "      WAIVED FOR DEATH OF PASSENGER OR FAMILY MEMBER.",
		                    "  CHANGES",
		                    "    ANY TIME",
		                    "      CHARGE USD 200.00 FOR REISSUE/REVALIDATION.",
		                    "      WAIVED FOR DEATH OF PASSENGER OR FAMILY MEMBER.",
		                    ")><"
		                ].join("\n")
		            },
		            "gds": "apollo"
		        },
				false
		    ],
		    [
		        {
		            "cmdRec": {"cmd":"*AO20JUL","output":"INVLD \n><"},
		            "gds": "apollo"
		        },
		        true
		    ],
		    [
		        {
		            "cmdRec": {"cmd":"NO NAMES","output":"CK FLT NBR\n><"},
		            "gds": "apollo"
		        },
				true
		    ],
		    [
		        {
		            "cmdRec": {"cmd":"IK","output":"CHECK FORMAT - IK\n><"},
		            "gds": "apollo"
		        },
		        true
		    ],
		    [
		        {
		            "cmdRec": {"cmd":"4BB","output":"CK ACTN CODE \n><"},
		            "gds": "apollo"
		        },
		        true
		    ],
		    [
		        {
		            "cmdRec": {"cmd":"869","output":"CK ACTN CODE \n><"},
		            "gds": "apollo"
		        },
		        true
		    ],
		    [
		        {
		            "cmdRec": {"cmd":"II","output":"CHECK FORMAT - II\n><"},
		            "gds": "apollo"
		        },
		        true
		    ],
		    [
		        {
		            "cmdRec": {
		                "cmd": "$/0/3-5",
		                "output": "ERROR 47 - INVALID FORMAT/DATA FOR MODIFIER 0\n$/0/3-5\n><"
		            },
		            "gds": "apollo"
		        },
		        true
		    ],
		    [
		        {"cmdRec":{"cmd":"R@MT","output":"INVLD \n><"},"gds":"apollo"},
		        true
		    ],
		    [
		        {
		            "cmdRec": {
		                "cmd": "$V13/16",
		                "output": [
		                    " 13 DENROM 21MAY19 UA USD   354.00 KHXUAX03 STAY-SU/6M BK-K",
		                    "16. PENALTIES",
		                    "UNLESS OTHERWISE SPECIFIED",
		                    "  CANCELLATIONS",
		                    "    BEFORE DEPARTURE",
		                    "      CHARGE USD 300.00 FOR CANCEL/REFUND.",
		                    "      CHILD/INFANT DISCOUNTS APPLY.",
		                    "      WAIVED FOR SCHEDULE CHANGE.",
		                    "         NOTE -",
		                    "          DEATH/ HOSPITALIZATION CERTIFICATE REQUIRED.",
		                    "          TICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW.",
		                    "         NOTE -",
		                    "          A.  EMERGENCY PROVISION",
		                    ")><"
		                ].join("\n")
		            },
		            "gds": "apollo"
		        },
				false
		    ],
			[
			   {
				   "cmdRec": {
					   "cmd": ".I",
					   "output": [
						   "CK STATUS                                                      ",
						   "><"
					   ].join("\n")
				   },
				   "gds": "apollo"
			   },
			   true
		   ],
		   [
			   {
				   "cmdRec": {"cmd":"NO NAMES","output":"CK FLT NBR\n><"},
				   "gds": "apollo"
			   },
			   true
		   ],
		   [
			   {
				   "cmdRec": {
					   "cmd": ".2HK",
					   "output": [
						   "SGMT   2 HK                                                    ",
						   "><"
					   ].join("\n")
				   },
				   "gds": "apollo"
			   },
			   false
		   ],
		   [
			   {
				   "cmdRec": {"cmd":"RIR","output":"NO TRANS AAA\n><"},
				   "gds": "apollo"
			   },
			   false
		   ],
		   [
			   {
				   "cmdRec": {"cmd":"-1E1*","output":"INVALID ACTION\n><"},
				   "gds": "apollo"
			   },
			   true
		   ],
		   [
			   {
				   "cmdRec": {
					   "cmd": "@MTY",
					   "output": "INVALID SEGMENT RANGE OR PAIR SPECIFIED\n><"
				   },
				   "gds": "apollo"
			   },
			   true
		   ],
		   [
			   {
				   "cmdRec": {
					   "cmd": ".5|6HK",
					   "output": [
						   " ALL SGMTS STATUS CHANGED TO  HK                               ",
						   "><"
					   ].join("\n")
				   },
				   "gds": "apollo"
			   },
			   false
		   ],
		   [
			   {"cmdRec":{"cmd":"U","output":"NO MSG \n><"},"gds":"apollo"},
			   false
		   ],
		   [
			   {
				   "cmdRec": {"cmd":"*RT","output":"FIN OR IGN \n><"},
				   "gds": "apollo"
			   },
			   false
		   ],
		   [
			   {
				   "cmdRec": {
					   "cmd": "C:PS-PANDAREN",
					   "output": "INVLD ACT/NOT ENT/CCCCCCCCCCCCCC\n><"
				   },
				   "gds": "apollo"
			   },
			   true
		   ],
		   [
			   {
				   "cmdRec": {
					   "cmd": "T:L$B",
					   "output": "RESTRICTED/NOT ENT/T:L$\n><"
				   },
				   "gds": "apollo"
			   },
			   true
		   ],
		   [
			   {
				   "cmdRec": {"cmd":"RM","output":" INVALID FORMAT\n><"},
				   "gds": "apollo"
			   },
			   true
		   ],
		   [
			   {
				   "cmdRec": {"cmd":"-R","output":"ILLEGAL ENTRY\n><"},
				   "gds": "apollo"
			   },
			   true
		   ],
		   [
			   {
				   "cmdRec": {
					   "cmd": "$V1/",
					   "output": [
						   "  1 NYCZAD 28JUN19 LH USD   376.00 KQXUAX03 STAY-SU/6M BK-K",
						   "USE *PFA OR *JCB OR *ADT OR *ITX TO PRICE",
						   " 0.APPLICATION    1.ELIGIBILITY   2.DAY/TIME      3.SEASONS",
						   " 5.ADV RES/TKTG   6.MIN STAY      7.MAX STAY      8.STOPOVERS",
						   " 9.TRANSFERS     10.COMBINATIONS 12.SURCHARGES   14.TVL RESTR",
						   "15.SALES RESTR   16.PENALTIES    18.TKT ENDORSE  19.CHILDREN",
						   "20.TOUR CON      21.AGENT DISC   22.OTHER DISC   23.MISC",
						   "27.TOURS         31.VOL CHANGES  35.NET FARES",
						   "><"
					   ].join("\n")
				   },
				   "gds": "apollo"
			   },
			   false
		   ],
		   [
			   {
				   "cmdRec": {
					   "cmd": "/V1",
					   "output": [
						   "CK SGMT NBR                                                    ",
						   "><"
					   ].join("\n")
				   },
				   "gds": "apollo"
			   },
			   true
		   ],
		   [
			   {
				   "cmdRec": {
					   "cmd": "R*-",
					   "output": [
						   "   BAG 1 -  NO FEE       UPTO26LB/12KG AND UPTO45LI/115LCM",
						   " DL AMSATL  1PC                                             ",
						   "   BAG 1 -  NO FEE       PERSONAL ITEM                    ",
						   " DL ATLBOS  1PC                                             ",
						   "   BAG 1 -  NO FEE       PERSONAL ITEM                    ",
						   "                                                                EMBARGO - FOR BAGGAGE LIMITATIONS SEE ",
						   " DL BOSATL  VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/DL        ",
						   " DL AMSATL  VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/DL        ",
						   " DL ATLBOS  VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/DL        ",
						   "                                                                BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/",
						   "ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.",
						   "><"
					   ].join("\n")
				   },
				   "gds": "apollo"
			   },
			   false
		   ],
		   [
			   {
				   "cmdRec": {
					   "cmd": "@MTR",
					   "output": "INVALID SEGMENT RANGE OR PAIR SPECIFIED\n><"
				   },
				   "gds": "apollo"
			   },
			   true
		   ],
		];

		return list;
	}

	test_isInvalidFormat(input, output) {
		let actual = CmdLogs.isInvalidFormat(input.cmdRec, input.gds);
		this.assertSame(output, actual);
	}

	getTestMapping() {
		return [
			[this.provide_isInvalidFormat, this.test_isInvalidFormat],
		];
	}
}

module.exports = CmdLogsTest;