

const TicketParser = require('../../../../../../../backend/Transpiled/Gds/Parsers/Apollo/HteParser/TicketParser.js');

const php = require('../../../../php.js');
class TicketParserTest extends require('klesun-node-tools/src/Transpiled/Lib/TestCase.js')
{
	provideTestCases()  {
		let $list;

		$list = [];

		// BT total fare
		$list.push([
			php.implode(php.PHP_EOL, [
				'TKT: 176 7192 581470     NAME: REID/JOYROSETTA                   ',
				'ISSUED: 17SEP18          FOP:CHECK                              PSEUDO: 13NM  PLATING CARRIER: EK  ISO: US  IATA: 33546656   ',
				'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
				'   OPEN EK 0220  X  13MAR MCODXB 0220P OK XLXTRUS2/ITX2      1',
				'                                          NVB13MAR NVA13MAR',
				'   OPEN EK 0770  X  15MAR DXBCPT 0855A OK XLXTRUS2/ITX2      2',
				'                                          NVB15MAR NVA15MAR',
				'   OPEN EK 0773  X  30MAR CPTDXB 0125P OK XLWTRUS2/ITX2      3',
				'                                          NVB30MAR NVA30MAR',
				'   OPEN EK 0219  X  31MAR DXBMCO 0250A OK XLWTRUS2/ITX2      4',
				'                                          NVB31MAR NVA31MAR',
				' ',
				'FARE          BT TAX    36.60 US TAX   696.31 XT',
				'TOTAL          BT',
				'   INVOL REISSUE DUE SC EK 778/15MAR NON-END-SPECIAL REWARD/UPGR   ADE RESTRICTED                                                ',
				'FC M/BT END XT 614.00YQ 19.00F6 16.30ZA 13.00WC 7.0',
				'0XY 5.65YC 5.60AY 4.20ZR 3.96XA 1.60EV 1.50UM 4.50X             FMCO4.5                                                         TOUR CODE: ZZITX2ZZ       ',
				'EXCHANGED FOR: 1767192581394',
				'ORIGINAL ISSUE: 1767192581394LAX03SEP1833546656       ',
				'RLOC 1V QWE123    EK QGTR6W                                            ',
			]),
			{
				'header': {
					'ticketNumber': '176 7192 581470',
					'pcc': '13NM',
				},
				'footer': {
					'baseFare': {'currency': null,'amount': null,'privateFareType': 'BT'},
					'taxList': [{'taxCode': 'US','amount': '36.60'},{'taxCode': 'XT','amount': '696.31'}],
					'totalFare': {'currency': null,'amount': null,'privateFareType': 'BT'},
					'extraFields': {
						'originalIssue': {
							'airlineNumber': '176',
							'documentNumber': '7192581394',
						},
					},
					'airlinePnrs': [
						{'airline': '1V', 'recordLocator': 'QWE123'},
						{'airline': 'EK', 'recordLocator': 'QGTR6W'},
					],
				},
			},
		]);

		$list.push([
			php.implode(php.PHP_EOL, [
				'TKT: 180 7729 613205     NAME: PARK/MYUNG SOOK                  ',
				' CC: CA5111111111111111                            ',
				'ISSUED: 21FEB16          FOP:CA5111111111111111-91211Z          ',
				'PSEUDO: 115Q  PLATING CARRIER: KE  ISO: US  IATA: 23854526   ',
				'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
				'   VOID KE   24  N  12APR SFOICN 0140P OK NLX0ZBSP           1',
				'                                                   NVA12OCT',
				'   VOID KE  689  N  13APR ICNPNH 0645P OK NLX0ZBSP           2',
				'                                                   NVA12OCT',
				'   VOID KE  690  Q  17APR PNHICN 1120P OK QLX0ZBSP           3',
				'                                                   NVA12OCT',
				'   VOID KE   23  Q  02MAY ICNSFO 0530P OK QLX0ZBSP           4',
				'                                                   NVA12OCT',
				' ',
				'FARE          IT TAX    35.60 US TAX   446.16 XT',
				'TOTAL USD      IT',
				'   2016UPC./NONENDS./RISS CHRG APPLY./RFND PNTY APPLY./NO MILE U',
				'   G.                                                           ',
				' ',
				'FC M/IT END ROE1.0 XT 360.00YR 31.00BP 25.00KX 7.00',
				'XY 5.60AY 5.50YC 3.96XA 3.60YQ 4.50XFSFO4.5                     ',
				'TOUR CODE: 6SDANINUCW     ',
				'RLOC 1V KMFB9O    1A ZXSE24                                     '
			]),
			{
				'header': {
					'ticketNumber': '180 7729 613205',
					'passengerName': 'PARK/MYUNG SOOK',
					'issueDate': {'parsed': '2016-02-21'},
					'pcc': '115Q',
					'platingCarrier': 'KE',
				},
				'segments': [
					{
						'couponStatus': 'VOID',
						'airline': 'KE',
						'flightNumber': '24',
						'bookingClass': 'N',
						'departureDate': {'parsed': '04-12'},
						'departureAirport': 'SFO',
						'destinationAirport': 'ICN',
						'departureTime': {'parsed': '13:40'},
						'bookingStatus': 'OK',
						'fareBasis': 'NLX0ZBSP',
					},
					{
						'couponStatus': 'VOID',
						'airline': 'KE',
						'flightNumber': '689',
						'bookingClass': 'N',
						'departureDate': {'parsed': '04-13'},
						'departureAirport': 'ICN',
						'destinationAirport': 'PNH',
						'departureTime': {'parsed': '18:45'},
						'bookingStatus': 'OK',
						'fareBasis': 'NLX0ZBSP',
					},
					{
						'couponStatus': 'VOID',
						'airline': 'KE',
						'flightNumber': '690',
						'bookingClass': 'Q',
						'departureDate': {'parsed': '04-17'},
						'departureAirport': 'PNH',
						'destinationAirport': 'ICN',
						'departureTime': {'parsed': '23:20'},
						'bookingStatus': 'OK',
						'fareBasis': 'QLX0ZBSP',
					},
					{
						'couponStatus': 'VOID',
						'airline': 'KE',
						'flightNumber': '23',
						'bookingClass': 'Q',
						'departureDate': {'parsed': '05-02'},
						'departureAirport': 'ICN',
						'destinationAirport': 'SFO',
						'departureTime': {'parsed': '17:30'},
						'bookingStatus': 'OK',
						'fareBasis': 'QLX0ZBSP',
					},
				],
			},
		]);

		// Z3KTGO - with '0020A' time instead of '1220A'
		$list.push([
			php.implode(php.PHP_EOL , [
				'TKT: 695 7827 349441     NAME: TUNG/REBECCA                     ',
				' ',
				'ISSUED: 05SEP16          FOP:CHECK/CC                           ',
				'PSEUDO: 1O3K  PLATING CARRIER: BR  ISO: US  IATA: 05578602   ',
				'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
				'   OPEN BR   55  V  07NOV ORDTPE 0020A OK VLX3P              1',
				'                                          NVB07NOV NVA07NOV',
				'   OPEN BR   56  V  18NOV TPEORD 0805P OK VLW3P              2',
				'                                          NVB10NOV NVA07FEB',
				' ',
				'FARE USD  600.00 TAX    35.60 US TAX    92.36 XT',
				'TOTAL USD  727.96',
				'   NON END-RRT-/TPE STPVR ADC APLY-/B7 EWA APLY                 ',
				' ',
				'FC 7NOV CHI BR TPE 280.00BR CHI 320.00NUC600.00END ',
				'ROE1.0 XT 50.00YQ 15.80TW 7.00XY 5.60AY 5.50YC 3.96             ',
				'XA 4.50XFORD4.5 A/C 30.00                                       ',
				'EXCHANGED FOR: 6958151906988',
				'ORIGINAL ISSUE: 6958151906988SFO05SEP1605578602       ',
				'RLOC 1V Z3KTGO    1A 3R6IDG                                     '
			]),
			{
				'header': {
					'ticketNumber': '695 7827 349441',
					'issueDate': {'parsed': '2016-09-05'},
				},
				'segments': [
					{
						'flightNumber': '55',
						'departureAirport': 'ORD',
						'departureTime': {'parsed': '00:20'},
					},
					{
						'flightNumber': '56',
						'departureDate': {'parsed': '11-18'},
					},
				],
				'footer': {
					'baseFare': {'currency': 'USD', 'amount': '600.00'},
					'taxList': [
						{'taxCode': 'US', 'amount': '35.60'},
						{'taxCode': 'XT', 'amount': '92.36'}
					],
					'totalFare': {'currency': 'USD', 'amount': '727.96'},
					'endorsementLines': [
						'   NON END-RRT-/TPE STPVR ADC APLY-/B7 EWA APLY                 '
					],
					'fareConstruction': {
						'raw': php.implode(php.PHP_EOL, [
							'7NOV CHI BR TPE 280.00BR CHI 320.00NUC600.00END ',
							'ROE1.0 XT 50.00YQ 15.80TW 7.00XY 5.60AY 5.50YC 3.96             ',
							'XA 4.50XFORD4.5 A/C 30.00                                       '
						])
					},
					'extraFields': {
						'exchangedFor': {
							'airlineNumber': '695',
							'documentNumber': '8151906988',
						},
						'originalIssue': {
							'airlineNumber': '695',
							'documentNumber': '8151906988',
							'location': 'SFO',
							'date': {'raw': '05SEP16', 'parsed': '2016-09-05'},
							'iata': '05578602',
						},
					},
					'airlinePnrs': [
						{'airline': '1V', 'recordLocator': 'Z3KTGO'},
						{'airline': '1A', 'recordLocator': '3R6IDG'}
					],
				}
			},
		]);

		// with ORIGINAL ISSUE
		$list.push([
			php.implode(php.PHP_EOL, [
				'TKT: 512 7009 625640-641 NAME: LEITH/ORAINEJOSIAH               ',
				' ',
				'ISSUED: 03JAN18          FOP:CHECK/CC                           ',
				'PSEUDO: 2G55  PLATING CARRIER: RJ  ISO: US  IATA: 05578602   ',
				'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
				'   USED RJ 7332  I  02FEB TPAORD 0455P OK IRTEEUS            1',
				'                                          NVB02FEB NVA02FEB',
				'   USED RJ  264  I  02FEB ORDAMM 0945P OK IRTEEUS            2',
				'                                          NVB02FEB NVA02FEB',
				'   USED RJ  612  I  03FEB AMMDXB 0915P OK IRTEEUS            3',
				'                                          NVB03FEB NVA03FEB',
				'   USED RJ  613  I  09FEB DXBAMM 0745A OK IRTEEUS            4',
				'                                          NVB09FEB NVA09FEB',
				'----641----',
				'   USED RJ  263  I  09FEB AMMORD 1110A OK IRTEEUS            1',
				'                                          NVB09FEB NVA09FEB',
				'   USED RJ 7028  I  09FEB ORDTPA 0645P OK IRTEEUS            2',
				'                                          NVB09FEB NVA09FEB',
				' ',
				'FARE          BT TAX    36.60 US TAX   465.41 XT',
				'TOTAL USD      BT',
				'   FARE RESTRICTIONS APPLY      ',
				' ',
				'FC M/BT END ROE1.0 XT 364.00YR 20.40AE 14.60KJ 11.4',
				'0YQ 11.20AY 9.50F6 7.00XY 5.65YC 3.96XA 2.80ZR 1.40             ',
				'TP 13.50XFTPA4.5ORD4.5ORD4.5 A/C 209.99                         ',
				'TOUR CODE: NYCITN1112     ',
				'EXCHANGED FOR: 5125053077217',
				'ORIGINAL ISSUE: 5125053077217SFO03JAN1805578602       ',
				'RLOC 1V SFCP1Q    1A OOJYB3                                     ',
				'       ',
			]),
			{
				'footer': {
					'extraFields': {
						'exchangedFor': {
							'airlineNumber': '512',
							'documentNumber': '5053077217',
						},
						'originalIssue': {
							'airlineNumber': '512',
							'documentNumber': '5053077217',
							'location': 'SFO',
							'date': {'raw': '03JAN18', 'parsed': '2018-01-03'},
							'iata': '05578602',
						},
					},
				},
			},
		]);

		// *W20QN6 - without an additional line per segment
		$list.push([
			php.implode(php.PHP_EOL, [
				'TKT: 157 7830 831534     NAME: JAMES/KAMOLI SILVESTERMBITHI     ',
				' CC: VI4111111111111111                            ',
				'ISSUED: 29OCT16          FOP:VI4111111111111111-00054D          ',
				'PSEUDO: 1O3K  PLATING CARRIER: QR  ISO: US  IATA: 05578602   ',
				'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
				'   OPEN QR 1342  V  25NOV NBODOH 0120A OK VLR1R1SI           1',
				'   OPEN QR  725  V  25NOV DOHORD 0805A OK VLR1R1SI           2',
				'   ARPT AA 3707  V  25NOV ORDGRR 0620P OK VLR1R1SI           3',
				' ',
				'FARE USD  635.00 TAX    17.80 US TAX   267.06 XT',
				'TOTAL USD  919.86',
				'   NON END-CHNG PENALTIES/AS PER RULE                           ',
				' ',
				'FC 25NOV NBO QR X/DOH QR X/CHI AA GRR Q NBOGRR20.00',
				' 615.00NUC635.00END ROE1.0 XT 186.00YQ 50.00TU 7.00             ',
				'XY 5.60AY 5.50YC 4.00YR 3.96XA 0.50PZ 4.50XFORD4.5              ',
				'TOUR CODE: USAN002        ',
				'RLOC 1V W20QN6    1A 6T8KB3    AA GAAKSN                        ',
				'       '
			]),
			{
				'segments': [
					{
						'couponStatus': 'OPEN',
						'flightNumber': '1342',
						'destinationAirport': 'DOH',
						'departureTime': {'parsed': '01:20'},
					},
					{
						'couponStatus': 'OPEN',
						'flightNumber': '725',
						'destinationAirport': 'ORD',
						'departureTime': {'parsed': '08:05'},
					},
					{
						'couponStatus': 'ARPT',
						'flightNumber': '3707',
						'destinationAirport': 'GRR',
						'departureTime': {'parsed': '18:20'},
					},
				],
				'footer': {
					'airlinePnrs': [
						{'airline': '1V', 'recordLocator': 'W20QN6'},
						{'airline': '1A', 'recordLocator': '6T8KB3'},
						{'airline': 'AA', 'recordLocator': 'GAAKSN'},
					],
				},
			},
		]);

		// *VWZD3E - with '----602----' between two segments
		$list.push([
			php.implode(php.PHP_EOL, [
				'TKT: 016 7830 831601-602 NAME: KIKATI/GAYLORDKAKESA             ',
				' CC: VI4111111111111111                            ',
				'ISSUED: 29OCT16          FOP:VI4111111111111111-030557          ',
				'PSEUDO: 1O3K  PLATING CARRIER: UA  ISO: US  IATA: 05578602   ',
				'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
				'   OPEN UA 4075  S  06NOV PIAORD 0350P OK SL06RCE/CN35       1',
				'                                          NVB06NOV NVA06NOV',
				'   OPEN UA  972  S  06NOV ORDBRU 0550P OK SL06RCE/CN35       2',
				'                                          NVB06NOV NVA06NOV',
				'   ARPT SN  357  S  07NOV BRUFIH 1115A OK SL06RCE/CN35       3',
				'                                          NVB07NOV NVA07NOV',
				'   ARPT SN  352  S  03DEC FIHBRU 0955P OK SL06RCE/CN35       4',
				'                                          NVB03DEC NVA03DEC',
				'----602----',
				'   OPEN UA  973  S  04DEC BRUORD 1105A OK SL06RCE/CN35       1',
				'                                          NVB04DEC NVA04DEC',
				'   OPEN UA 4040  S  04DEC ORDPIA 0530P OK SL06RCE/CN35       2',
				'                                          NVB04DEC NVA04DEC',
				' ',
				'FARE          BT TAX    35.60 US TAX   767.96 XT',
				'TOTAL USD      BT',
				'   REFTHRUAG-NONEND-NONRERTE-/LH-UA-AC-OS-SN-LX ONLY            ',
				' ',
				'FC M/BT END ROE1.0 XT 650.00YQ 38.80BE 35.00CD 11.2',
				'0AY 7.00XY 5.50YC 3.96XA 3.00LW 13.50XFPIA4.5ORD4.5             ',
				'ORD4.5                                                          ',
				'TOUR CODE: 294UA          ',
				'RLOC 1V VWZD3E    UA MH2WPG                                     ',
				'       ',
			]),
			{
				'segments': [
					{'departureAirport': 'PIA', 'destinationAirport': 'ORD', 'fareBasis': 'SL06RCE', 'ticketDesignator': 'CN35'},
					{'departureAirport': 'ORD', 'destinationAirport': 'BRU'},
					{'departureAirport': 'BRU', 'destinationAirport': 'FIH'},
					{'departureAirport': 'FIH', 'destinationAirport': 'BRU', 'fareBasis': 'SL06RCE', 'ticketDesignator': 'CN35'},
					// ----602----
					{'departureAirport': 'BRU', 'destinationAirport': 'ORD', 'fareBasis': 'SL06RCE', 'ticketDesignator': 'CN35'},
					{'departureAirport': 'ORD', 'destinationAirport': 'PIA'},
				],
				'footer': {
					'baseFare': {'privateFareType': 'BT'},
					'taxList': [
						{'taxCode': 'US', 'amount': '35.60'},
						{'taxCode': 'XT', 'amount': '767.96'}
					],
					'totalFare': {'privateFareType': 'BT'},
					'extraFields': {
						'tourCode': '294UA',
						'originalIssue': null,
					},
				},
			},
		]);

		// without footer values like 'TOUR CODE:'
		$list.push([
			php.implode(php.PHP_EOL, [
				'TKT: 016 7828 617596     NAME: GARCIACAMPOS/FRANCISCO           ',
				' CC: VI4111111111111111                            ',
				'ISSUED: 20SEP16          FOP:VI4111111111111111-020829          ',
				'PSEUDO: 2CX8  PLATING CARRIER: UA  ISO: US  IATA: 23854526   ',
				'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
				'   OPEN UA  412  V  17DEC SFOMEX 1125P OK VNN7C9SN           1',
				'                                          NVB17DEC NVA17DEC',
				'   OPEN UA  718  V  06JAN MEXSFO 0140P OK VNN7C9SN           2',
				'                                          NVB06JAN NVA06JAN',
				' ',
				'FARE USD  590.00 TAX    35.60 US TAX    91.72 XT',
				'TOTAL USD  717.32',
				'   NONREF-0VALUAFTDPT-CHGFEE    ',
				' ',
				'FC 17DEC SFO UA MEX Q40.00 275.00UA SFO 275.00NUC59',
				'0.00END ROE1.0 XT 44.03XD 21.13UK 7.00XY 5.60AY 5.5             ',
				'0YC 3.96XA 4.50XFSFO4.5                                         ',
				'RLOC 1V Q0Q22G    UA DX9ZFC                                     ',
				'       ',
				'',
			]),
			{
				'footer': {
					'baseFare': {'currency': 'USD', 'amount': '590.00'},
					'taxList': [
						{'taxCode': 'US', 'amount': '35.60'},
						{'taxCode': 'XT', 'amount': '91.72'}
					],
					'totalFare': {'currency': 'USD', 'amount': '717.32'},
					'endorsementLines': ['   NONREF-0VALUAFTDPT-CHGFEE    '],
					'fareConstruction': {
						'raw': php.implode(php.PHP_EOL, [
							'17DEC SFO UA MEX Q40.00 275.00UA SFO 275.00NUC59',
							'0.00END ROE1.0 XT 44.03XD 21.13UK 7.00XY 5.60AY 5.5             ',
							'0YC 3.96XA 4.50XFSFO4.5                                         '
						])
					},
					'extraFields': null,
					'airlinePnrs': [
						{'airline': '1V', 'recordLocator': 'Q0Q22G'},
						{'airline': 'UA', 'recordLocator': 'DX9ZFC'}
					],
				},
			},
		]);

		// non-USD fare
		$list.push([
			php.implode(php.PHP_EOL, [
				'TKT: 125 7916 991229     NAME: SENIOR/DAVID MARK                ',
				' CC: AX371244902766000                             ',
				'ISSUED: 22FEB17          FOP:AX371244902766000-162164           ',
				'PSEUDO: 1O3K  PLATING CARRIER: BA  ISO: US  IATA: 05578602   ',
				'   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN',
				'   OPEN BA 8126  N  02JUN FCOPRG 0100P OK NOWVY              1',
				'                                          NVB02JUN NVA02JUN',
				' ',
				'FARE EUR   71.00 TAX    18.90 IT TAX    14.80 XT',
				'TOTAL USD  108.70',
				'   NON-REF-CHNG RESTRICTED      ',
				' ',
				'FC 2JUN ROM BA PRG 75.91NUC75.91END ROE0.935287 XT ',
				'8.00HB 3.50VT 2.40EX 0.90MJ                                     ',
				'RLOC 1V J2292M    1A 4KNYLH                                     ',
				'       ',
			]),
			{
				'footer': {
					'success': true,
					'baseFare': {'currency': 'EUR', 'amount': '71.00'},
					'taxList': [
						{'taxCode': 'IT', 'amount': '18.90'},
						{'taxCode': 'XT', 'amount': '14.80'}
					],
					'totalFare': {'currency': 'USD', 'amount': '108.70'},
				},
			},
		]);

		$list.push([
			php.implode(php.PHP_EOL, [
				'UNABLE TO PROCESS ELECTRONIC TICKET DISPLAY',
				'NO AGENCY AGREEMENT EXIST - ACCESS DENIED',
				'PSEUDO: 00GF                                                 ',
				'RLOC 1G PVC9JU                                                  ',
			]),
			{
				'error': 'GDS returned error of type no_agreement_exists',
				'errorType': 'no_agreement_exists',
				'pcc': '00GF',
				'gdsCode': '1G',
				'recordLocator': 'PVC9JU',
			},
		]);

		$list.push([
			php.implode(php.PHP_EOL, [
				'UNABLE TO PROCESS ELECTRONIC TICKET DISPLAY',
				'TICKET NUMBER NOT FOUND',
			]),
			{
				'error': 'GDS returned error of type ticket_not_found',
				'errorType': 'ticket_not_found',
			},
		]);

		$list.push([
			php.implode(php.PHP_EOL, [
				'UNABLE TO PROCESS ELECTRONIC TICKET DISPLAY',
				'NO AGENCY AGREEMENT EXIST - ACCESS DENIED',
				'PSEUDO: 23FH                                                 ',
				'RLOC 1V NM66PO                                                  ',
			]),
			{
				'error': 'GDS returned error of type no_agreement_exists',
				'errorType': 'no_agreement_exists',
				'pcc': '23FH',
				'gdsCode': '1V',
				'recordLocator': 'NM66PO',
			},
		]);

		$list.push([
			php.implode(php.PHP_EOL, [
				'UNABLE TO PROCESS ELECTRONIC TICKET DISPLAY',
				'NO RESPONSE FROM VENDOR',
			]),
			{
				'error': 'GDS returned error of type no_response_from_vendor',
				'errorType': 'no_response_from_vendor',
			},
		]);

		return $list;
	}

	/**
     * @test
     * @dataProvider provideTestCases
     */
	testErrorResult($dump, $expectedResult)  {
		let $actualResult;

		$actualResult = TicketParser.parse($dump);
		try {
			this.assertArrayElementsSubset($expectedResult, $actualResult, $actualResult['error']);
		} catch (exc) {
			let args = process.argv.slice(process.execArgv.length + 2);
			if (args.includes('debug')) {
				console.log('\n$actualResult\n', JSON.stringify($actualResult));
			}
			throw exc;
		}
	}

	getTestMapping() {
		return [
			[this.provideTestCases, this.testErrorResult],
		];
	}
}
TicketParserTest.count = 0;
module.exports = TicketParserTest;
