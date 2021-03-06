
const mapping = {
	94: "APPLICATION DF ERROR, SEE SNAP C4C6094",
	95: "FATAL APPLICATION ERROR",
	97: "UNEXPECTED MESSAGE FROM APPLICATION",
	98: "RETURN CODE TOO LARGE TO RETURN",
	99: "PROCEDURE TIMED OUT",
	1000: "GENERAL ERROR",
	1001: "TRANSACTION TIME OUT",
	1002: "BUFFERED SEGMENT DOES NOT EXIST",
	1003: "BUFFERED SEGMENT NOT YET AVAILABLE",
	1004: "TPE ERROR WRITING TO COM SERVER",
	1005: "TPE ERROR WRITING TO LOAD DIST",
	1006: "USER NOT LOGGED ON",
	1007: "INVALID DATE RESPONSE",
	1008: "INVALID REGISTRATION RESPONSE",
	1009: "INVALID MPI VENDOR",
	1010: "NO ADE MESSAGE",
	1011: "INVALID ADE MESSAGE",
	1012: "NO PAH HWS TOKEN",
	1013: "SESSION NOT FOUND",
	1014: "DOWNLOAD OFFSET INVALID",
	1015: "SESSION TIME OUT",
	1016: "SESSION KILLED BY OPERATOR",
	1017: "INVALID PAH HWS TOKEN LENGTH",
	1018: "INVALID CREDIT CARD ADDR VERIFICATION RQST",
	1019: "INVALID CUSTOMER REGISTRATION RQST",
	1020: "INVALID CUSTOMER REGISTRATION RQST LENGTH",
	1021: "INVALID CUSTOMER REGISTRATION NOT UAL",
	1100: "TIME OUT ON UPDATE",
	1101: "TIME OUT ON ADD",
	1200: "DOS ALLOC MEMORY ERROR",
	1201: "DOS FREE MEMORY ERROR",
	1202: "DOS OPEN ERROR",
	1203: "DOS CLOSE ERROR",
	1204: "DOS CHANGE FILE POINTER ERROR",
	1205: "DOS READ ERROR",
	1300: "SESS-TRANS ERROR ON RELEASE",
	1301: "SESS-TRANS ERROR ON ADD TRANSACTION",
	1302: "SESS-TRANS ERROR ON GET TRANSACTION",
	1303: "SESS-TRANS ERROR ON DELETE TRANSACTION",
	1304: "SESS-TRANS ERROR ON ADD SESSION",
	1305: "SESS-TRANS ERROR ON DELETE SESSION",
	1306: "SESS-TRANS ERROR ON SESSION MISMATCH",
	1551: "PROTOCOL ERROR ON GET DATA",
	1552: "PROTOCOL ERROR ON FIND FIRST",
	1553: "PROTOCOL ERROR ON CREATE",
	1554: "PROTOCOL ERROR ON ADD",
	1555: "PROTOCOL ERROR ON DESTROY",
	1556: "PROTOCOL ERROR ON FIRST",
	1557: "PROTOCOL ERROR ON UPDATE",
	1558: "PROTOCOL ERROR ON INSERT",
	1559: "PROTOCOL ERROR ON NEXT",
	1560: "PROTOCOL ERROR ON DELETE",
	1561: "PROTOCOL ERROR ON PREVIOUS",
	1562: "PROTOCOL ERROR ON CONTIGUOUS",
	1563: "PROTOCOL ERROR NOT TRANSESSION RECORD",
	1564: "PROTOCOL ERROR NOT DIN",
	1565: "PROTOCOL ERROR NOT LOGON",
	1566: "PROTOCOL ERROR NOT LOGOFF",
	1567: "PROTOCOL ERROR NOT CHANGE PASSWORD",
	1568: "PROTOCOL ERROR NOT NEW CUSTOMER",
	1569: "PROTOCOL ERROR NOT GET CUSTOMER",
	1570: "PROTOCOL ERROR NOT DOWNLOAD",
	1571: "PROTOCOL ERROR INVALID DIN LENGTH",
	1572: "PROTOCOL ERROR NOT PROCEDURE",
	1573: "PROTOCOL ERROR NOT DOT",
	1601: "DOWN LOAD ERROR - FIND ITEM",
	1651: "DATABASE ERROR ON LOGOFF",
	1652: "DATABASE ERROR ON LOGON",
	1653: "DATABASE ERROR ON GET OF USER DATA",
	1654: "DATABASE ERROR ON ADD OF USER DATA",
	1655: "DATABASE ERROR ON UPDATE OF USER DATA",
	2000: "ECB CORE LEVEL E ALREADY IN USE",
	2001: "NO RAW PROCEDURE OR PROCEDURE NAME",
	2002: "INCOMPATIBLE OPTIMIZED CODE",
	2003: "UNEXPECTED LEAVE",
	2004: "UNEXPECTED ITERATE",
	2005: "UNEXPECTED END",
	2006: "EXPECTING END",
	2007: "MAXIMUM DO NESTING LEVEL EXCEEDED",
	2008: "EXPECTING MORE",
	2009: "MAXIMUM EVENT NESTING LEVEL EXCEEDED",
	2010: "UNDEFINED SEGMENT CALLED",
	3000: "UNRECOGNIZED SYSTEM RECORD TYPE IN HEADER",
	3001: "MIXED REQUEST RECEIVED",
	3002: "DUPLICATE CONTROL RECORD ENCOUNTERED",
	3003: "SESSION RECORD MISSING",
	3004: "IDENTITY RECORD MISSING",
	3005: "EXPECTING PROCEDURE RECORD",
	3006: "NO INPUT",
	3007: "SEQUENCE NUMBER NOT NUMERIC",
	3009: "HEADER LENGTH NOT NUMERIC",
	3010: "HEADER SUB REQUEST TOKEN NOT HEXADECIMAL",
	3011: "HEADER RECORD TYPE NOT NUMERIC",
	3012: "MESSAGE NUMBER NOT NUMERIC",
	3013: "RECORD LENGTH MISMATCH",
	3014: "HDR VERSION NOT SUPPORTED",
	3015: "REQUEST SEGMENTATION NOT SUPPORTED",
	3016: "SECURITY RECORD MISSING",
	3017: "SECURITY VERB NOT SUPPORTED",
	3018: "DIALOGUE ERROR FIELD NOT NUMERIC",
	3019: "CITY INDICATOR INVALID",
	3020: "MAXIMUM RESPONSE SIZE EXCEEDED",
	4000: "UNEXPECTED COLON",
	4001: "EXPRESSION TOO COMPLEX",
	4002: "SYNTAX ERROR",
	4003: "SYNTAX NOT SUPPORTED IN THIS VERSION AND RELEASE",
	4004: "UNMATCHED QUOTES",
	4005: "UNEXPECTED END OF STATEMENT",
	4006: "LEVEL D ALREADY IN USE",
	4007: "LEVEL F ALREADY IN USE",
	4008: "VARIABLE OR CONSTANT EXCEEDS 256",
	4009: "UNBALANCED COMMENT",
	4010: "COMMAND NOT SUPPORTED",
	4011: "UNEXPECTED COMMENT",
	4012: "NO INPUT PROCEDURE SCRIPT",
	4013: "UNEXPECTED THEN",
	4014: "EXPECTING THEN",
	4016: "LABEL NOT FOUND",
	4017: "UNKNOWN FUNCTION CALL",
	4018: "EXPECTED END OF STATEMENT",
	4019: "INVALID EXPRESSION",
	4900: "A PARAMETER LIST MUST BE SUPPLIED",
	4901: "PARAMETER 1 MISSING OR INVALID",
	4902: "PARAMETER 2 MISSING OR INVALID",
	4903: "PARAMETER 3 MISSING OR INVALID",
	4904: "PARAMETER 4 MISSING OR INVALID",
	4905: "PARAMETER 5 MISSING OR INVALID",
	4906: "PARAMETER 6 MISSING OR INVALID",
	4907: "PARAMETER 7 MISSING OR INVALID",
	4908: "PARAMETER 8 MISSING OR INVALID",
	4909: "PARAMETER 9 MISSING OR INVALID",
	4910: "PARAMETER 10 MISSING OR INVALID",
	4998: "TOO MANY PARAMETERS PASSED",
	4999: "PARAMETERS LIST TOO LARGE",
	5000: "SESSION BID NOT SUPPORTED",
	5001: "SESSION VERSION NOT SUPPORTED",
	5002: "SESSION TYPE NOT SUPPORTED",
	5003: "ASSOCIATION NOT FOUND",
	5004: "DUPLICATE ASSOCIATION DETECTED",
	5005: "OUT OF SEQUENCE",
	5006: "DIALOGUE ALREADY ACTIVE",
	5007: "ABORTING",
	5008: "TERMINATING",
	5009: "INVALID GTID",
	5010: "AAA MISSING",
	5011: "AAA ALREADY IN USE",
	5012: "GTID NOT SIGNED ON",
	5013: "AAA FIND ERROR",
	5014: "INVALID VENDOR",
	5015: "TIME EXPIRED SIGNED OFF",
	5016: "ERR: AGENT OUT",
	5017: "INVALID AEF FILE ADDR",
	5018: "RETURN TO FP AND RESET AAA",
	5019: "SWITCHABLE ACCESS ACTIVATED",
	5020: "DUTY CODE NOT AUTHORIZED",
	5021: "SESSIONLESS SECURITY FAILED",
	5022: "INVALID CITY CODE",
	5030: "METERING TOO MANY TRANSACTIONS",
	5023: "INVALID DEPARTMENT CODE",
	5200: "BAD RETURN INDEX",
	5300: "STRUCTURED DATA DRIVER BUSY",
	5301: "STRUCTURED DATA DRIVER PAUSED",
	6000: "PROCEDURE BID NOT SUPPORTED",
	6001: "PROCEDURE VERSION NOT SUPPORTED",
	6002: "PROCEDURE RECORD MISSING",
	6003: "PROCEDURE SECURITY VIOLATION",
	6004: "PROCEDURE NOT LOADED",
	6005: "PROCEDURE NOT FOUND",
	6006: "PROCEDURE DISABLED",
	6007: "INVALID SEGMENTATION CONTROL FLAG",
	6008: "PROCEDURE CANCELED BY OPERATOR",
	7000: "IDENTITY BID NOT SUPPORTED",
	7001: "IDENTITY VERSION NOT SUPPORTED",
	7002: "INVALID VENDOR",
	7003: "INVALID COUNTRY CODE",
	8000: "GETFC FAILED",
	8001: "WAITC FAILED",
	8002: "BAD SUBROUTINE INDEX",
	8003: "LABEL TABLE SPACE EXHAUSTED",
	8004: "COMMAND INDEX ERROR",
	8005: "NULL OPTIMIZED PROC PASSED",
	8006: "DO STACK INDEX ERROR",
	8007: "UNEXPECTED SUB FUNCTION",
	8008: "FINWC FAILED",
	8009: "FUNCTION INDEX ERROR",
	8010: "DATE ROUTINE EXHAUSTED",
	8011: "AAA FINWC FAILED",
	8100: "DATA RECORD FACS ERROR - UNKNOWN ERROR",
	8101: "DATA RECORD FACS ERROR - UNKNOWN FACE ID",
	8102: "DATA RECORD FACS ERROR - ORDINAL NUM OUTSIDE",
	8103: "DATA RECORD FIND ERROR",
	8104: "PIT FACS ERROR",
	8202: "PIT NOT INITIALIZED",
	8203: "PIT RECORD FIND ERROR",
	8204: "NEW AAA FIND ERROR",
	8205: "WAIT ERROR",
	8206: "OLD AAA FIND ERROR",
	8207: "AAT ORDINAL NUMBER NOT FOUND",
	8208: "AAT FILE ADDRESS CALCULATION FAILED",
	8209: "AAT/BPR FACE/FIND ERROR",
	8210: "UTARS ITEM NOMATCH",
	8211: "UTARS ITEM ACCOUNT NOT FOUND",
	8212: "PSEUDO CITY ENCRYPTION ERROR",
	8213: "PSEUDO CITY IS NOT A VALID ACCOUNT",
	8214: "PSEUDO CITY HAS BEEN DEACTIVATED",
	8215: "VENDOR ID IS INACTIVE OR LOCKED",
	8216: "PROC ACCES DENIED TO VENDOR",
	8217: "USER ID ERROR",
	8218: "USER ID IS LOCKED",
	8219: "INVALID DUTY CODE IN USER ID",
	8220: "AIT/ABI FACE/FIND ERROR",
	8221: "SECURITY DATABASE ERROR",
	8222: "UNKNOWN SECURITY ERROR",
	8223: "SYSTEM BUSY - PLEASE RETRY LATER (VQC1)",
	8224: "TOGGLING ERROR - RETURN TO FOCALPOINT",
	8300: "DCB DOUBLE RELEASE",
	8301: "SCB DOUBLE RELEASE",
	8302: "PCB DOUBLE RELEASE",
	8303: "EVS DOUBLE RELEASE",
	8400: "DCB GET FAILURE",
	8401: "SCB GET FAILURE",
	8402: "PCB GET FAILURE",
	8403: "EVS GET FAILURE",
	8600: "AAA ERROR",
	8601: "NO DATA ON LEVEL 0",
	8602: "FORWARD CHAIN FINWC FAILED",
	8603: "FORWARD CHAIN SONIC FAILED",
	8604: "FORWARD CHAIN UNEXPECTED END OF CHAIN",
	8699: "LAST SETUP ERROR",
	9999: "TESTING ERROR",
};

/** @see https://support.travelport.com/webhelp/GWS/GWS.htm#XML_Select_Web_Service/Codes/process-level_return_codes.htm?Highlight=8222 */
module.exports = code => {
	code = +code;
	const exactMeaning = mapping[code] || null;
	if (exactMeaning) {
		return exactMeaning;
	} else if (code >= 60 && code <= 99) {
		return 'STRUCTURED DATA DRIVER ERRORS';
	} else if (code >= 100 && code <= 999) {
		return 'RESERVED';
	} else if (code >= 1800 && code <= 1899) {
		return 'TPC - Load distributor errors';
	} else if (code >= 1900 && code <= 1999) {
		return 'TPC - COMM. Server errors';
	} else if (code >= 1000 && code <= 1999) {
		return "TPC ERRORS";
	} else if (code >= 2000 && code <= 2999) {
		return "EXECUTOR RUN TIME ERRORS (PCBERR).";
	} else if (code >= 3000 && code <= 3999) {
		return "PROTOCOL ERRORS (SCBERR/PCBERR).";
	} else if (code >= 4000 && code <= 4999) {
		return "OPTIMIZER PROCESSING ERRORS.";
	} else if (code >= 5000 && code <= 5999) {
		return "Session/DIALOGUE ERRORS (SCBERR)";
	} else if (code >= 6000 && code <= 6999) {
		return "Procedure/TRANSACTION ERRORS (PCBERR).";
	} else if (code >= 7000 && code <= 7999) {
		return "IDENTITY RECORD ERRORS";
	} else if (code >= 8000 && code <= 9999) {
		return "SDD INTERNAL ERRORS";
	} else {
		return null;
	}
};