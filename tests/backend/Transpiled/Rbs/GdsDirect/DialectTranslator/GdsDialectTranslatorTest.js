

const GdsDialectTranslator = require('../../../../../../backend/Transpiled/Rbs/GdsDirect/DialectTranslator/GdsDialectTranslator.js');

const php = require('../../../php.js');

/** $BBCUA -> $BB/CUA */
const normCmd = (gds, cmd) => {
	if (!cmd) {
		return cmd;
	}
	if (gds === 'apollo') {
		let match = cmd.match(/^((?:T:)?\$B(?:BQ\d+|B[AC0]?)?)(.*)$/);
		if (match) {
			let [_, baseCmd, modsPart] = match;
			if (modsPart && !modsPart.startsWith('/')) {
				cmd = baseCmd + '/' + modsPart;
			}
		}
	} else if (gds === 'galileo') {
		let match = cmd.match(/^(FQ(?:A|BB(?:K|)|BA|))(.*)$/);
		if (match) {
			let [_, baseCmd, modsPart] = match;
			if (modsPart && !modsPart.startsWith('/')) {
				cmd = baseCmd + '/' + modsPart;
			}
		}
	} else if (gds === 'amadeus') {
		let match = cmd.match(/^(FX[A-Z])(.*)$/);
		if (match) {
			let [_, baseCmd, modsPart] = match;
			if (modsPart && !modsPart.startsWith('/')) {
				cmd = baseCmd + '/' + modsPart;
			}
		}
	}
	return cmd;
};

class GdsDialectTranslatorTest extends require('../../../Lib/TestCase.js')
{
	provideCommands()  {
		let $tests;

		$tests = [

			['apollo', 'sabre',   'A*6PM', '1*6P'],
			['apollo', 'amadeus', 'A*6PM', 'AC6P'],

			// Display ticket number info

			['apollo', 'sabre',   '*TE/0161234567890',   'WETR*T0161234567890'],
			['apollo', 'amadeus', '*TE/0161234567890',   'TWD/016-1234567890'],
			['sabre', 'apollo',   'WETR*T0161234567890', '*TE/0161234567890'],
			['sabre', 'amadeus',  'WETR*T0161234567890', 'TWD/016-1234567890'],
			['amadeus', 'apollo', 'TWD/016-1234567890',  '*TE/0161234567890'],
			['amadeus', 'sabre',  'TWD/016-1234567890',  'WETR*T0161234567890'],

			// from,    to,        input,           output
			['apollo',  'sabre',   'A01MARRIXLAX',  '101MARRIXLAX'],
			['apollo',  'amadeus', 'A01MARRIXLAX',  'AD01MARRIXLAX'],
			['sabre',   'apollo',  '101MARRIXLAX',  'A01MARRIXLAX'],
			['sabre',   'amadeus', '101MARRIXLAX',  'AD01MARRIXLAX'],
			['amadeus', 'apollo',  'AD01MARRIXLAX', 'A01MARRIXLAX'],
			['amadeus', 'sabre',   'AD01MARRIXLAX', '101MARRIXLAX'],

			['apollo',  'sabre',   'A01MARRIXLAX|BT',   '101MARRIXLAX¥BT'],
			['apollo',  'amadeus', 'A01MARRIXLAX|BT',   'AD01MARRIXLAX/ABT'],
			['sabre',   'apollo',  '101MARRIXLAX¥BT',   'A01MARRIXLAX|BT'],
			['sabre',   'amadeus', '101MARRIXLAX¥BT',   'AD01MARRIXLAX/ABT'],
			['amadeus', 'apollo',  'AD01MARRIXLAX/ABT', 'A01MARRIXLAX|BT'],
			['amadeus', 'sabre',   'AD01MARRIXLAX/ABT', '101MARRIXLAX¥BT'],

			['apollo',  'sabre',   'A20JUNKIVRIX|9U.BT.SU',   '120JUNKIVRIX¥9UBTSU'],
			['apollo',  'amadeus', 'A20JUNKIVRIX|9U.BT.SU',   'AD20JUNKIVRIX/A9U,BT,SU'],
			['sabre',   'apollo',  '120JUNKIVRIX¥9UBTSU',     'A20JUNKIVRIX|9U.BT.SU'],
			['sabre',   'amadeus', '120JUNKIVRIX¥9UBTSU',     'AD20JUNKIVRIX/A9U,BT,SU'],
			['amadeus', 'apollo',  'AD20JUNKIVRIX/A9U,BT,SU', 'A20JUNKIVRIX|9U.BT.SU'],
			['amadeus', 'sabre',   'AD20JUNKIVRIX/A9U,BT,SU', '120JUNKIVRIX¥9UBTSU'],

			['apollo',  'sabre',   'A*|UA.PS',  '1¥UAPS'],
			['apollo',  'amadeus', 'A*|UA.PS',  'AC/AUA,PS'],
			['sabre',   'apollo',  '1¥UAPS',    'A*|UA.PS'],
			['sabre',   'amadeus', '1¥UAPS',    'AC/AUA,PS'],
			['amadeus', 'apollo',  'AC/AUA,PS', 'A*|UA.PS'],
			['amadeus', 'sabre',   'AC/AUA,PS', '1¥UAPS'],

			['apollo',  'sabre',   '$B@VKXT5U0',    'WPQVKXT5U0'],
			['apollo',  'amadeus', '$B@VKXT5U0',    'FXX/L-VKXT5U0'],
			['sabre',   'apollo',  'WPQVKXT5U0',    '$B@VKXT5U0'],
			['sabre',   'amadeus', 'WPQVKXT5U0',    'FXX/L-VKXT5U0'],
			['amadeus', 'apollo',  'FXX/L-VKXT5U0', '$B@VKXT5U0'],
			['amadeus', 'sabre',   'FXX/L-VKXT5U0', 'WPQVKXT5U0'],

			['apollo',  'sabre',   'X1-2/0Y', 'WC1-2Y'],
			['apollo',  'amadeus', 'X1-2/0Y', 'SBY1-2'],
			['sabre',   'apollo',  'WC1-2Y',  'X1-2/0Y'],
			['sabre',   'amadeus', 'WC1-2Y',  'SBY1-2'],
			['amadeus', 'apollo',  'SBY1-2',  'X1-2/0Y'],
			['amadeus', 'sabre',   'SBY1-2',  'WC1-2Y'],

			['apollo',  'sabre',   'X1-2|5-7',  'X1-2/5-7'],
			['apollo',  'amadeus', 'X1-2|5-7',  'XE1-2,5-7'],
			['sabre',   'apollo',  'X1-2/5-7',  'X1-2|5-7'],
			['sabre',   'amadeus', 'X1-2/5-7',  'XE1-2,5-7'],
			['amadeus', 'apollo',  'XE1-2,5-7', 'X1-2|5-7'],
			['amadeus', 'sabre',   'XE1-2,5-7', 'X1-2/5-7'],

			['apollo',  'sabre',   '$D20JUNKIVRIX',  'FQKIVRIX20JUN'],
			['apollo',  'amadeus', '$D20JUNKIVRIX',  'FQDKIVRIX/20JUN'],
			['sabre',   'apollo',  'FQKIVRIX20JUN',  '$D20JUNKIVRIX'],
			['sabre',   'amadeus', 'FQKIVRIX20JUN',  'FQDKIVRIX/20JUN'],
			['amadeus', 'apollo',  'FQDKIVRIX/20JUN', '$D20JUNKIVRIX'],
			['amadeus', 'sabre',   'FQDKIVRIX/20JUN', 'FQKIVRIX20JUN'],

			['apollo',  'sabre',   '$DKIVRIX20JUN@W',  'FQKIVRIX20JUNSB'],
			['apollo',  'amadeus', '$DKIVRIX20JUN@W',  'FQDKIVRIX/20JUN/KW'],
			['sabre',   'apollo',  'FQKIVRIX20JUNSB',  '$D20JUNKIVRIX@W'],
			['sabre',   'amadeus', 'FQKIVRIX20JUNSB',  'FQDKIVRIX/20JUN/KW'],
			['amadeus', 'apollo',  'FQDKIVRIX/20JUN/KW', '$D20JUNKIVRIX@W'],
			['amadeus', 'sabre',   'FQDKIVRIX/20JUN/KW', 'FQKIVRIX20JUNSB'],

			['apollo',  'sabre',   '$DKIVRIX20JUN',  'FQKIVRIX20JUN'],
			['apollo',  'amadeus', '$DKIVRIX20JUN',  'FQDKIVRIX/20JUN'],
			['sabre',   'apollo',  'FQKIVRIX20JUN',  '$D20JUNKIVRIX'],
			['sabre',   'amadeus', 'FQKIVRIX20JUN',  'FQDKIVRIX/20JUN'],
			['amadeus', 'apollo',  'FQDKIVRIX/20JUN', '$D20JUNKIVRIX'],
			['amadeus', 'sabre',   'FQDKIVRIX/20JUN', 'FQKIVRIX20JUN'],

			['apollo',  'sabre',   '$DV20JUNKIVRIX05JUL+PS+TK+LO',    'FQKIVRIX20JUN¥R05JUL-PS-TK-LO'],
			['apollo',  'amadeus', '$DV20JUNKIVRIX05JUL+PS+TK+LO',    'FQDKIVRIX/20JUN*05JUL/APS,TK,LO'],
			['sabre',   'apollo',  'FQKIVRIX20JUN¥R05JUL-PS-TK-LO',   '$DV20JUNKIVRIX05JUL|PS|TK|LO'],
			['sabre',   'amadeus', 'FQKIVRIX20JUN¥R05JUL-PS-TK-LO',   'FQDKIVRIX/20JUN*05JUL/APS,TK,LO'],
			['amadeus', 'apollo',  'FQDKIVRIX/20JUN*05JUL/APS,TK,LO', '$DV20JUNKIVRIX05JUL|PS|TK|LO'],
			['amadeus', 'sabre',   'FQDKIVRIX/20JUN*05JUL/APS,TK,LO', 'FQKIVRIX20JUN¥R05JUL-PS-TK-LO'],

			['apollo',  'sabre',   '@:3SSRDOCSYYHK1/N1/////02APR11/FI//LASTNAME/NAME',  '3DOCSA/DB/02APR11/FI/LASTNAME/NAME-1.1'],
			['apollo',  'amadeus', '@:3SSRDOCSYYHK1/N1/////02APR11/FI//LASTNAME/NAME',  'SRDOCSYYHK1-----02APR11-FI--LASTNAME-NAME/P1'],
			['sabre',   'apollo',  '3DOCSA/DB/02APR11/FI/LASTNAME/NAME-1.1',   '@:3SSRDOCSYYHK1/N1/////02APR11/FI//LASTNAME/NAME'],
			['sabre',   'amadeus', '3DOCSA/DB/02APR11/FI/LASTNAME/NAME-1.1',   'SRDOCSYYHK1-----02APR11-FI--LASTNAME-NAME/P1'],
			['amadeus', 'apollo',  'SRDOCSYYHK1-----02APR11-FI--LASTNAME-NAME/P1', '@:3SSRDOCSYYHK1/N1/////02APR11/FI//LASTNAME/NAME'],
			['amadeus', 'sabre',   'SRDOCSYYHK1-----02APR11-FI--LASTNAME-NAME/P1', '3DOCSA/DB/02APR11/FI/LASTNAME/NAME-1.1'],

			['apollo',  'sabre',   '$BB//@F',  'WPNC¥TC-FB'],
			['apollo',  'amadeus', '$BB//@F',  'FXA/KF'],
			['sabre',   'apollo',  'WPNC¥TC-FB',   '$BB//@F'],
			['sabre',   'amadeus', 'WPNC¥TC-FB',   'FXA/KF'],
			['amadeus', 'apollo',  'FXA/KF', '$BB//@F'],
			['amadeus', 'sabre',   'FXA/KF', 'WPNC¥TC-FB'],

			['apollo',  'sabre',   '**-SMITH/AMY',  '*-SMITH/AMY'],
			['apollo',  'amadeus', '**-SMITH/AMY',  'RT/SMITH/AMY'],
			['sabre',   'apollo',  '*-SMITH/AMY',   '**-SMITH/AMY'],
			['sabre',   'amadeus', '*-SMITH/AMY',   'RT/SMITH/AMY'],
			['amadeus', 'apollo',  'RT/SMITH/AMY',  '**-SMITH/AMY'],
			['amadeus', 'sabre',   'RT/SMITH/AMY',  '*-SMITH/AMY'],

			['apollo',  'sabre',   '*ABC123',  '*ABC123'],
			['apollo',  'amadeus', '*ABC123',  'RTABC123'],
			['sabre',   'apollo',  '*ABC123',  '*ABC123'],
			['sabre',   'amadeus', '*ABC123',  'RTABC123'],
			['amadeus', 'apollo',  'RTABC123', '*ABC123'],
			['amadeus', 'sabre',   'RTABC123', '*ABC123'],

			['apollo',  'sabre',   '*3',  '*3'],
			['apollo',  'amadeus', '*3',  'RT3'],
			['sabre',   'apollo',  '*3',  '*3'],
			['sabre',   'amadeus', '*3',  'RT3'],
			['amadeus', 'apollo',  'RT3', '*3'],
			['amadeus', 'sabre',   'RT3', '*3'],

			['apollo',  'sabre',   'T:TAU/1NOV',  '7TAW/1NOV'],
			['apollo',  'amadeus', 'T:TAU/1NOV',  'TKTL1NOV'],
			['sabre',   'apollo',  '7TAW/1NOV',   'T:TAU/1NOV'],
			['sabre',   'amadeus', '7TAW/1NOV',   'TKTL1NOV'],
			['amadeus', 'apollo',  'TKTL1NOV', 'T:TAU/1NOV'],
			['amadeus', 'sabre',   'TKTL1NOV', '7TAW/1NOV'],

			['apollo',  'sabre',   'X5-10',  'X5-10'],
			['apollo',  'amadeus', 'X5-10',  'XE5-10'],
			['sabre',   'apollo',  'X5-10',  'X5-10'],
			['sabre',   'amadeus', 'X5-10',  'XE5-10'],
			['amadeus', 'apollo',  'XE5-10', 'X5-10'],
			['amadeus', 'sabre',   'XE5-10', 'X5-10'],

			['apollo', 'sabre', 'A20JUNKIVRIX|PS',       '120JUNKIVRIX¥PS'],
			['apollo', 'sabre', 'A20JUNKIVRIX|9U.BT.SU', '120JUNKIVRIX¥9UBTSU'],
			['apollo', 'sabre', 'A/T/20JUNLAXMNL|DL',    '1S20JUNLAXMNL¥DL-T'],
			['apollo', 'sabre', 'A*|PS',                 '1¥PS'],
			['apollo', 'sabre', 'A*|PS.B2',              '1¥PSB2'],
			['apollo', 'sabre', 'A*-UA.BT.PS',           '1¥*UABTPS'],
			['apollo', 'sabre', 'A*C',                   '1*C'],
			['apollo', 'sabre', 'A*',                    '1*'],
			['apollo', 'sabre', '$BS1+2',                'WPS1/2'],
			['apollo', 'sabre', '$BS1*3+5*7',            'WPS1-3/5-7'],
			['apollo', 'sabre', '$BBS1+2',               'WPNC¥S1/2'],
			['apollo', 'sabre', '$B/ACC',                'WPPC05'],
			['apollo', 'sabre', '$BN1+2*C05',            'WPP1ADT/1C05'],
			['apollo', 'sabre', '$BN1+2*C05+3*INF',      'WPP1ADT/1C05/1INF'],
			['apollo', 'sabre', '$BN1+2+3*C05+4*INF',    'WPP2ADT/1C05/1INF'],
			['apollo', 'sabre', '$BN1*JCB+2*J05',        'WPP1JCB/1J05'],
			['apollo', 'sabre', '$BN1*JCB+2*JNS',        'WPP1JCB/1JNS'],
			['apollo', 'sabre', '$BN1*ITX+2*I06',        'WPP1ITX/1I06'],
			['apollo', 'sabre', '$BB*JCB',               'WPNC¥PJCB'],
			['apollo', 'sabre', '$BB*ITX',               'WPNC¥PITX'],
			['apollo', 'sabre', '$BB0*JCB',              'WPNCB¥PJCB'],
			['apollo', 'sabre', '$BB0*ITX',              'WPNCB¥PITX'],
			['apollo', 'sabre', '$BBN1*JCB+2*J05',       'WPNC¥P1JCB/1J05'],
			['apollo', 'sabre', '$BBN1*JCB+2*JNS',       'WPNC¥P1JCB/1JNS'],
			['apollo', 'sabre', '$BB0N1*JCB+2*J05',      'WPNCB¥P1JCB/1J05'],
			['apollo', 'sabre', '$BB0N1*JCB+2*JNS',      'WPNCB¥P1JCB/1JNS'],
			['apollo', 'sabre', 'A/V/15SEPSEAMNL+DL',    '1S15SEPSEAMNL¥DL-V'],
			['apollo', 'sabre', '$BB0S1+4',              'WPNCB¥S1/4'],
			['apollo', 'sabre', '$BBAS1+4',              'WPNCS¥S1/4'],
			['apollo', 'sabre', '$BB0S1*2+3*4',          'WPNCB¥S1-4'],
			['apollo', 'sabre', '$BBAS1*2+3*4',          'WPNCS¥S1-4'],
			['apollo', 'sabre', '$BB/ACC',               'WPNC¥PC05'],
			['apollo', 'sabre', '$BB0/ACC',              'WPNCB¥PC05'],
			['apollo', 'sabre', '$BBA/ACC',              'WPNCS¥PC05'],
			['apollo', 'sabre', 'A*C7',                  '1*C'],
			['apollo', 'sabre', '$BBAN1+2*C05',          'WPNCS¥P1ADT/1C05'],
			['apollo', 'sabre', '$BBAN1+2*C05+3*INF',    'WPNCS¥P1ADT/1C05/1INF'],
			['apollo', 'sabre', '$BBAN1+2+3*C05+4*INF',  'WPNCS¥P2ADT/1C05/1INF'],
			['apollo', 'sabre', '$BBA*JCB',              'WPNCS¥PJCB'],
			['apollo', 'sabre', '$BBA*ITX',              'WPNCS¥PITX'],
			['apollo', 'sabre', 'A20JUNSEAMNL12AATL+DL.AA.UA',  '120JUNSEAMNL12AATL¥DLAAUA'],
			['apollo', 'sabre', 'A20JUNNYCSFO12AMSP.CHI+UA.AA.DL', '120JUNNYCSFO12AMSP/CHI¥UAAADL'],
			['apollo', 'sabre', 'A/T/20JUNLAXMNL12ASFO+DL',     '1S20JUNLAXMNL12ASFO¥DL-T'],
			['apollo', 'sabre', 'A1MARSFOACC+/*A', '11MARSFOACC¥/*A'],

			['sabre', 'apollo', 'WPP1ADT/1C05¥S1/2/5/6', '$BN1*ADT|2*C05/S1|2|5|6'],
			['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥S1/2/5/6', '$BN1*ADT|2*C05|3*INF/S1|2|5|6'],
			['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥S1/2/5/6', '$BN1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNC¥P1ADT/1C05¥S1/2/5/6', '$BBN1*ADT|2*C05/S1|2|5|6'],
			['sabre', 'apollo', 'WPNC¥P1ADT/1C05/1INF¥S1/2/5/6', '$BBN1*ADT|2*C05|3*INF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNC¥P2ADT/1C05/1INF¥S1/2/5/6', '$BBN1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCB¥P1ADT/1C05¥S1/2/5/6', '$BB0N1*ADT|2*C05/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCB¥P1ADT/1C05/1INF¥S1/2/5/6', '$BB0N1*ADT|2*C05|3*INF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCB¥P2ADT/1C05/1INF¥S1/2/5/6', '$BB0N1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCS¥P1ADT/1C05¥S1/2/5/6', '$BBAN1*ADT|2*C05/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCS¥P1ADT/1C05/1INF¥S1/2/5/6', '$BBAN1*ADT|2*C05|3*INF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCS¥P2ADT/1C05/1INF¥S1/2/5/6', '$BBAN1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6'],
			['sabre', 'apollo', 'WPP1ADT/1C05¥S1/2/5/6', '$BN1*ADT|2*C05/S1|2|5|6'],
			['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥S1/2/5/6', '$BN1*ADT|2*C05|3*INF/S1|2|5|6'],
			['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥S1/2/5/6', '$BN1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNC¥P1ADT/1C05¥S1/2/5/6', '$BBN1*ADT|2*C05/S1|2|5|6'],
			['sabre', 'apollo', 'WPNC¥P1ADT/1C05/1INF¥S1/2/5/6', '$BBN1*ADT|2*C05|3*INF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNC¥P2ADT/1C05/1INF¥S1/2/5/6', '$BBN1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCB¥P1ADT/1C05¥S1/2/5/6', '$BB0N1*ADT|2*C05/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCB¥P1ADT/1C05/1INF¥S1/2/5/6', '$BB0N1*ADT|2*C05|3*INF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCB¥P2ADT/1C05/1INF¥S1/2/5/6', '$BB0N1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCS¥P1ADT/1C05¥S1/2/5/6', '$BBAN1*ADT|2*C05/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCS¥P1ADT/1C05/1INF¥S1/2/5/6', '$BBAN1*ADT|2*C05|3*INF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCS¥P2ADT/1C05/1INF¥S1/2/5/6', '$BBAN1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6'],
			['sabre', 'apollo', 'WPP1JCB/1JNS¥S1/2/5/6', '$BN1*JCB|2*JNS/S1|2|5|6'],
			['sabre', 'apollo', 'WPP1JCB/1JNS/1JNF¥S1/2/5/6', '$BN1*JCB|2*JNS|3*JNF/S1|2|5|6'],
			['sabre', 'apollo', 'WPP2JCB/1JNS/1JNF¥S1/2/5/6', '$BN1*JCB|2*JCB|3*JNS|4*JNF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNC¥P1JCB/1JNS¥S1/2/5/6', '$BBN1*JCB|2*JNS/S1|2|5|6'],
			['sabre', 'apollo', 'WPNC¥P1JCB/1JNS/1JNF¥S1/2/5/6', '$BBN1*JCB|2*JNS|3*JNF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNC¥P2JCB/1JNS/1JNF¥S1/2/5/6', '$BBN1*JCB|2*JCB|3*JNS|4*JNF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCB¥P1JCB/1JNS¥S1/2/5/6', '$BB0N1*JCB|2*JNS/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCB¥P1JCB/1JNS/1JNF¥S1/2/5/6', '$BB0N1*JCB|2*JNS|3*JNF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCB¥P2JCB/1JNS/1JNF¥S1/2/5/6', '$BB0N1*JCB|2*JCB|3*JNS|4*JNF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCS¥P1JCB/1JNS¥S1/2/5/6', '$BBAN1*JCB|2*JNS/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCS¥P1JCB/1JNS/1JNF¥S1/2/5/6', '$BBAN1*JCB|2*JNS|3*JNF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCS¥P2JCB/1JNS/1JNF¥S1/2/5/6', '$BBAN1*JCB|2*JCB|3*JNS|4*JNF/S1|2|5|6'],
			['apollo', 'sabre', '$BS1*2+5*6/N1*JCB+2*JNS', 'WPS1/2/5/6¥P1JCB/1JNS'],
			['apollo', 'sabre', '$BS1*2+5*6/N1*JCB+2*JNS+3*JNF', 'WPS1/2/5/6¥P1JCB/1JNS/1JNF'],
			['apollo', 'sabre', '$BS1*2+5*6/N1*JCB+2*JCB+3*JNS+4*JNF', 'WPS1/2/5/6¥P2JCB/1JNS/1JNF'],
			['apollo', 'sabre', '$BBS1*2+5*6/N1*JCB+2*JNS', 'WPNC¥S1/2/5/6¥P1JCB/1JNS'],
			['apollo', 'sabre', '$BBS1*2+5*6/N1*JCB+2*JNS+3*JNF', 'WPNC¥S1/2/5/6¥P1JCB/1JNS/1JNF'],
			['apollo', 'sabre', '$BBS1*2+5*6/N1*JCB+2*JCB+3*JNS+4*JNF', 'WPNC¥S1/2/5/6¥P2JCB/1JNS/1JNF'],
			['apollo', 'sabre', '$BB0S1*2+5*6/N1*JCB+2*JNS', 'WPNCB¥S1/2/5/6¥P1JCB/1JNS'],
			['apollo', 'sabre', '$BB0S1*2+5*6/N1*JCB+2*JNS+3*JNF', 'WPNCB¥S1/2/5/6¥P1JCB/1JNS/1JNF'],
			['apollo', 'sabre', '$BB0S1*2+5*6/N1*JCB+2*JCB+3*JNS+4*JNF', 'WPNCB¥S1/2/5/6¥P2JCB/1JNS/1JNF'],
			['apollo', 'sabre', '$BBAS1*2+5*6/N1*JCB+2*JCB', 'WPNCS¥S1/2/5/6¥P2JCB'],
			['apollo', 'sabre', '$BBAS1*2+5*6/N1*JCB+2*JNS+3*JNF', 'WPNCS¥S1/2/5/6¥P1JCB/1JNS/1JNF'],
			['apollo', 'sabre', '$BBAS1*2+5*6/N1*JCB+2*JCB+3*JNS+4*JNF', 'WPNCS¥S1/2/5/6¥P2JCB/1JNS/1JNF'],
			['sabre', 'apollo', 'WPP1ITX/1INN¥S1/2/5/6', '$BN1*ITX|2*INN/S1|2|5|6'],
			['sabre', 'apollo', 'WPP1ITX/1INN/1ITF¥S1/2/5/6', '$BN1*ITX|2*INN|3*ITF/S1|2|5|6'],
			['sabre', 'apollo', 'WPP2ITX/1INN/1ITF¥S1/2/5/6', '$BN1*ITX|2*ITX|3*INN|4*ITF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNC¥P1ITX/1INN¥S1/2/5/6', '$BBN1*ITX|2*INN/S1|2|5|6'],
			['sabre', 'apollo', 'WPNC¥P1ITX/1INN/1ITF¥S1/2/5/6', '$BBN1*ITX|2*INN|3*ITF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNC¥P2ITX/1INN/1ITF¥S1/2/5/6', '$BBN1*ITX|2*ITX|3*INN|4*ITF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCB¥P1ITX/1INN¥S1/2/5/6', '$BB0N1*ITX|2*INN/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCB¥P1ITX/1INN/1ITF¥S1/2/5/6', '$BB0N1*ITX|2*INN|3*ITF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCB¥P2ITX/1INN/1ITF¥S1/2/5/6', '$BB0N1*ITX|2*ITX|3*INN|4*ITF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCS¥P1ITX/1INN¥S1/2/5/6', '$BBAN1*ITX|2*INN/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCS¥P1ITX/1INN/1ITF¥S1/2/5/6', '$BBAN1*ITX|2*INN|3*ITF/S1|2|5|6'],
			['sabre', 'apollo', 'WPNCS¥P2ITX/1INN/1ITF¥S1/2/5/6', '$BBAN1*ITX|2*ITX|3*INN|4*ITF/S1|2|5|6'],
			['apollo', 'sabre', '$BS1*2+5*6/N1*ITX+2*INN', 'WPS1/2/5/6¥P1ITX/1INN'],
			['apollo', 'sabre', '$BS1*2+5*6/N1*ITX+2*INN+3*ITF', 'WPS1/2/5/6¥P1ITX/1INN/1ITF'],
			['apollo', 'sabre', '$BS1*2+5*6/N1*ITX+2*ITX+3*INN+4*ITF', 'WPS1/2/5/6¥P2ITX/1INN/1ITF'],
			['apollo', 'sabre', '$BBS1*2+5*6/N1*ITX+2*INN', 'WPNC¥S1/2/5/6¥P1ITX/1INN'],
			['apollo', 'sabre', '$BBS1*2+5*6/N1*ITX+2*INN+3*ITF', 'WPNC¥S1/2/5/6¥P1ITX/1INN/1ITF'],
			['apollo', 'sabre', '$BBS1*2+5*6/N1*ITX+2*ITX+3*INN+4*ITF', 'WPNC¥S1/2/5/6¥P2ITX/1INN/1ITF'],
			['apollo', 'sabre', '$BB0S1*2+5*6/N1*ITX+2*INN', 'WPNCB¥S1/2/5/6¥P1ITX/1INN'],
			['apollo', 'sabre', '$BB0S1*2+5*6/N1*ITX+2*INN+3*ITF', 'WPNCB¥S1/2/5/6¥P1ITX/1INN/1ITF'],
			['apollo', 'sabre', '$BB0S1*2+5*6/N1*ITX+2*ITX+3*INN+4*ITF', 'WPNCB¥S1/2/5/6¥P2ITX/1INN/1ITF'],
			['apollo', 'sabre', '$BBAS1*2+5*6/N1*ITX+2*INN', 'WPNCS¥S1/2/5/6¥P1ITX/1INN'],
			['apollo', 'sabre', '$BBAS1*2+5*6/N1*ITX+2*INN+3*ITF', 'WPNCS¥S1/2/5/6¥P1ITX/1INN/1ITF'],
			['apollo', 'sabre', '$BBAS1*2+5*6/N1*ITX+2*ITX+3*INN+4*ITF', 'WPNCS¥S1/2/5/6¥P2ITX/1INN/1ITF'],
			['apollo', 'sabre', 'A20JUNSFOACC12ANYC+/*S', '120JUNSFOACC12ANYC¥/*S'],
			['apollo', 'sabre', 'A/K/20JUNSFOACC12ANYC+/*S', '1S20JUNSFOACC12ANYC¥/*S-K'],
			['apollo', 'sabre', 'A/K/20JUNSFOACC12ANYC.AMS+/*S', '1S20JUNSFOACC12ANYC/AMS¥/*S-K'],
			['apollo', 'sabre', '$D20JUNKIVRIX:CAD', 'FQKIVRIX20JUN/CAD'],
			['apollo', 'sabre', '$D20JUNKIVRIX+PS+TK+LO:CAD', 'FQKIVRIX20JUN-PS-TK-LO/CAD'],
			['apollo', 'sabre', '$D20JUNKIVRIX@Y:CAD', 'FQKIVRIX20JUNYB/CAD'],
			['apollo', 'sabre', '$D20JUNKIVRIX:CAD@Y', 'FQKIVRIX20JUNYB/CAD'],
			['apollo', 'sabre', '$DV20JUNKIVRIX05JUL:CAD+PS+TK+LO', 'FQKIVRIX20JUN¥R05JUL-PS-TK-LO/CAD'],
			['apollo', 'sabre', '$DV20JUNKIVRIX05JUL+PS+TK+LO:CAD', 'FQKIVRIX20JUN¥R05JUL-PS-TK-LO/CAD'],
			['apollo', 'sabre', '$D20JUNKIVRIX+PS+TK+LO:CAD', 'FQKIVRIX20JUN-PS-TK-LO/CAD'],
			['apollo', 'sabre', '$D20JUNKIVRIX:CAD+PS+TK+LO', 'FQKIVRIX20JUN-PS-TK-LO/CAD'],
			['apollo', 'sabre', '$D20JUNKIVRIX:CAD', 'FQKIVRIX20JUN/CAD'],
			['apollo', 'sabre', '$D20JUNKIVRIX@W:CAD', 'FQKIVRIX20JUNSB/CAD'],
			['apollo', 'sabre', '$D20JUNKIVRIX:CAD@W', 'FQKIVRIX20JUNSB/CAD'],
			['apollo', 'sabre', '$D20JUNKIVRIX@C:CAD', 'FQKIVRIX20JUNBB/CAD'],
			['apollo', 'sabre', '$D20JUNKIVRIX:CAD@C', 'FQKIVRIX20JUNBB/CAD'],
			['apollo', 'sabre', '$D20JUNKIVRIX@F:CAD', 'FQKIVRIX20JUNFB/CAD'],
			['apollo', 'sabre', '$D20JUNKIVRIX:CAD@F', 'FQKIVRIX20JUNFB/CAD'],
			['apollo', 'sabre', '$D20JUNKIVRIX:A', 'FQKIVRIX20JUN¥PV'],
			['apollo', 'sabre', '$DNYCMNL28NOV17T12MAR17+DL:CAD', 'FQ12MAR17NYCMNL28NOV17-DL/CAD'],
			['apollo', 'sabre', '$D20JUNKIVRIX/:N', 'FQKIVRIX20JUN¥PL'],
			['apollo', 'sabre', '$D20JUNKIVRIX:A', 'FQKIVRIX20JUN¥PV'],
			['apollo', 'sabre', '$D20JUNKIVRIX/:A', 'FQKIVRIX20JUN¥PV'],
			['apollo', 'sabre', '$D20JUNKIVRIX+PS+TK+LO:N', 'FQKIVRIX20JUN-PS-TK-LO¥PL'],
			['apollo', 'sabre', 'A20SEPKIVMIA12AIST960+TK.9U', '120SEPKIVMIA12AIST-960¥TK9U'],
			['apollo', 'sabre', 'A/V/20SEPKIVMIA12AIST960+TK.9U', '1S20SEPKIVMIA12AIST-960¥TK9U-V'],
			['apollo', 'sabre', 'A*XDTW', '1DTW'],
			['apollo', 'sabre', 'A20JUNSFOACC12ANYC960+/*S', '120JUNSFOACC12ANYC-960¥/*S'],
			['apollo', 'sabre', 'A/V/20JUNSFOACC12ANYC960+/*S', '1S20JUNSFOACC12ANYC-960¥/*S-V'],
			['apollo', 'sabre', 'A20SEPKIVLAX12AOTP.IST960+TK.9U', '120SEPKIVLAX12AOTP/IST-960¥TK9U'],
			['apollo', 'sabre', 'A/V/20SEPKIVLAX12AOTP.IST960+TK.9U', '1S20SEPKIVLAX12AOTP/IST-960¥TK9U-V'],

			['sabre', 'apollo', '120JUNSFOACC12ANYC¥/*S', 'A20JUNSFOACC12ANYC|/*S'],
			['sabre', 'apollo', '1S20JUNSFOACC12ANYC¥/*S-T', 'A/T/20JUNSFOACC12ANYC|/*S'],
			['sabre', 'apollo', '1S20JUNSFOACC12ANYC/AMS¥/*S-T', 'A/T/20JUNSFOACC12ANYC.AMS|/*S'],
			['sabre', 'apollo', 'FQKIVRIX20JUN/CAD', '$D20JUNKIVRIX:CAD'],
			['sabre', 'apollo', 'FQKIVRIX20JUN-PS-TK-LO/CAD', '$D20JUNKIVRIX|PS|TK|LO:CAD'],
			['sabre', 'apollo', 'FQKIVRIX20JUNYB/CAD', '$D20JUNKIVRIX@Y:CAD'],
			['sabre', 'apollo', 'FQKIVRIX20JUN¥R05JUL/CAD-PS-TK-LO', '$DV20JUNKIVRIX05JUL:CAD|PS|TK|LO'],
			['sabre', 'apollo', 'FQKIVRIX20JUN¥R05JUL-PS-TK-LO/CAD', '$DV20JUNKIVRIX05JUL|PS|TK|LO:CAD'],
			['sabre', 'apollo', 'FQKIVRIX20JUN-PS-TK-LO/CAD', '$D20JUNKIVRIX|PS|TK|LO:CAD'],
			['sabre', 'apollo', 'FQKIVRIX20JUN/CAD-PS-TK-LO', '$D20JUNKIVRIX:CAD|PS|TK|LO'],
			['sabre', 'apollo', 'FQKIVRIX20JUN/CAD', '$D20JUNKIVRIX:CAD'],
			['sabre', 'apollo', 'FQKIVRIX20JUNSB/CAD', '$D20JUNKIVRIX@W:CAD'],
			['sabre', 'apollo', 'FQKIVRIX20JUNBB/CAD', '$D20JUNKIVRIX@C:CAD'],
			['sabre', 'apollo', 'FQKIVRIX20JUNFB/CAD', '$D20JUNKIVRIX@F:CAD'],
			['sabre', 'apollo', 'FQ12MAR17NYCMNL28NOV17-DL/CAD', '$DNYCMNL28NOV17T12MAR17|DL:CAD'],
			['sabre', 'apollo', 'FQKIVRIX20JUN¥PL', '$D20JUNKIVRIX:N'],
			['sabre', 'apollo', 'FQKIVRIX20JUN¥PV', '$D20JUNKIVRIX:A'],
			['sabre', 'apollo', 'FQKIVRIX20JUN-PS-TK-LO¥PL', '$D20JUNKIVRIX|PS|TK|LO:N'],
			['sabre', 'apollo', '120SEPKIVMIA12AIST-960¥TK9U', 'A20SEPKIVMIA12AIST960|TK.9U'],
			['sabre', 'apollo', '1S20SEPKIVMIA12AIST-960¥TK9U-V', 'A/V/20SEPKIVMIA12AIST960|TK.9U'],
			['sabre', 'apollo', '1DTW', 'A*XDTW'],
			['sabre', 'apollo', '120JUNSFOACC12ANYC-960¥/*S', 'A20JUNSFOACC12ANYC960|/*S'],
			['sabre', 'apollo', '1S20JUNSFOACC12ANYC-960¥/*S-V', 'A/V/20JUNSFOACC12ANYC960|/*S'],
			['sabre', 'apollo', '120SEPKIVLAX12AOTP/IST-960¥TK9U', 'A20SEPKIVLAX12AOTP.IST960|TK.9U'],
			['sabre', 'apollo', '1S20SEPKIVLAX12AOTP/IST-960¥TK9U-V', 'A/V/20SEPKIVLAX12AOTP.IST960|TK.9U'],
			['apollo', 'sabre', '@LTKIV', 'T*KIV'],
			['apollo', 'sabre', '$DNYCMNL28NOV17T12MAR17|DL', 'FQ12MAR17NYCMNL28NOV17-DL'],
			['apollo', 'sabre', 'A/V/14AUGKIVMOW/D|9U.SU', '1S14AUGKIVMOW/N¥9USU-V'],
			['apollo', 'sabre', 'A*6P', '1*6P'],
			['apollo', 'sabre', 'A*|5', '1¥5'],
			['apollo', 'sabre', 'A*-5', '1-5'],
			['apollo', 'sabre', 'MR', 'MD'],
			['apollo', 'sabre', 'A20JUNKIVMOW/D|9U.SU', '120JUNKIVMOW/N¥9USU'],

			['apollo', 'sabre', '$V3/16', 'RD3*16'],
			['apollo', 'sabre', 'SA', '\u00A4A'],
			['apollo', 'sabre', 'A1MARSFOACC12ANYC.AMS|/*S', '11MARSFOACC12ANYC/AMS¥/*S'],
			['apollo', 'sabre', '**B-SMITH/AMY JOHNSON', '*-XXXX-SMITH/AMY JOHNSON'],
			['apollo', 'sabre', '**-SMITH/AMY JOHNSON', '*-SMITH/AMY JOHNSON'],
			['apollo', 'sabre', 'C:T:', '7\u00A4'],
			['apollo', 'sabre', 'T:$BN1*ITX|2*I06|3*ITF', 'WPRQ¥P1ITX/1I06/1ITF'],
			['apollo', 'sabre', 'T:$BN1*JCB|2*JNS', 'WPRQ¥P1JCB/1JNS'],

			['sabre', 'apollo', '1R25JUN', 'A*O25JUN'],
			['sabre', 'apollo', '120JUNNYCSFO12AMSP¥UAAADL', 'A20JUNNYCSFO12AMSP|UA.AA.DL'],
			['sabre', 'apollo', '120JUNKIVRIX¥BT', 'A20JUNKIVRIX|BT'],
			['sabre', 'apollo', '1S14AUGKIVMOW/N¥9USU-V', 'A/V/14AUGKIVMOW/D|9U.SU'],
			['sabre', 'apollo', '1*C2', 'A*C2'],
			['apollo', 'sabre', 'A*C2', '1*C'],

			['sabre', 'apollo', '1S20JUNLAXMNL12ASFO¥DL-T', 'A/T/20JUNLAXMNL12ASFO|DL'],
			['sabre', 'apollo', '120JUNSFOACC12ANYC/AMS¥/*S', 'A20JUNSFOACC12ANYC.AMS|/*S'],
			['sabre', 'apollo', 'WPNC', '$BB'],
			['sabre', 'apollo', 'WPNCS', '$BBA'],
			['sabre', 'apollo', 'WPPCNN', '$B*CNN/ACC'],
			['sabre', 'apollo', 'WPPCNN¥NC', '$BB*CNN/ACC'],
			['sabre', 'apollo', 'WPPCNN¥NCB', '$BB0*CNN/ACC'],
			['sabre', 'apollo', 'WPPCNN¥NCS', '$BBA*CNN/ACC'],
			['sabre', 'apollo', 'WPP1JCB/1JNS/1JNF', '$BN1*JCB|2*JNS|3*JNF'],

			['sabre', 'apollo', 'X1/3/5', 'X1|3|5'],
			['sabre', 'apollo', 'I', '!aliasDoubleIgnore'],
			['sabre', 'apollo', 'X1-2/5-7', 'X1-2|5-7'],
			['sabre', 'apollo', 'FQKIVRIX20JUN¥R05JUL', '$DV20JUNKIVRIX05JUL'],
			['sabre', 'apollo', 'FQKIVRIX20JUN-PS-TK-LO', '$D20JUNKIVRIX|PS|TK|LO'],
			['sabre', 'apollo', 'RD3*16', '$V3/16'],
			['sabre', 'apollo', '*-XXXX-SMITH/AMY JOHNSON', '**B-SMITH/AMY JOHNSON'],
			['sabre', 'apollo', '*-SMITH/AMY JOHNSON', '**-SMITH/AMY JOHNSON'],
			['sabre', 'apollo', '71\u00A4', 'C:T:'],
			['sabre', 'apollo', '5S1 985.00 N1 720.00 F1 500.00', '@:5S1 985.00 N1 720.00 F1 500.00'],
			['sabre', 'apollo', '91-800-750-2238-A', 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT'],
			['sabre', 'apollo', 'WPPJCB¥RQ', 'T:$B*JCB'],
			['sabre', 'apollo', 'WPP1ADT/1CNN¥RQ', 'T:$BN1*ADT|2*CNN'],
			['sabre', 'apollo', 'WPP1ADT/1CNN/1INF¥RQ', 'T:$BN1*ADT|2*CNN|3*INF'],
			['sabre', 'apollo', 'WPPITX¥RQ', 'T:$B*ITX'],
			['sabre', 'apollo', 'WPP1ITX/1INN/1ITF¥RQ', 'T:$BN1*ITX|2*INN|3*ITF'],
			['sabre', 'apollo', '0OTHYYGK1/RETENTION20SEP', '0TURZZBK1SFO20SEP-RETENTION'],

			['apollo', 'sabre', 'A/K/1MARSFOACC12ANYC.AMS|/*S',     '1S1MARSFOACC12ANYC/AMS¥/*S-K'],
			['sabre', 'apollo', '1S1MARSFOACC12ANYC/AMS¥/*S-K',    'A/K/1MARSFOACC12ANYC.AMS|/*S'],
			['apollo', 'sabre', 'A/K/1MARSFOACC12ANYC|/*S',         '1S1MARSFOACC12ANYC¥/*S-K'],
			['sabre', 'apollo', '1S1MARSFOACC12ANYC¥/*S-K',        'A/K/1MARSFOACC12ANYC|/*S'],
			['apollo', 'sabre', 'A1MARSFOACC12ANYC|/*S',            '11MARSFOACC12ANYC¥/*S'],
			['sabre', 'apollo', '11MARSFOACC12ANYC¥/*S',           'A1MARSFOACC12ANYC|/*S'],

			['apollo', 'sabre', 'A20JUNNYCSFO12AMSP|UA.AA.DL',   '120JUNNYCSFO12AMSP¥UAAADL'],
			['apollo', 'sabre', 'A20JUNNYCSFO12AMSP.CHI|UA.AA',  '120JUNNYCSFO12AMSP/CHI¥UAAA'],
			['apollo', 'sabre', 'L@PS/A20JUNKIVRIX',             '120JUNKIVRIX\u00A4PS'],
			['apollo', 'sabre', 'L@PS/A20JUNKIVRIX12A',          '120JUNKIVRIX12A\u00A4PS'],
			['apollo', 'sabre', 'A20JUNKIVRIX-*9U.BT.SU',        '120JUNKIVRIX¥*9UBTSU'],
			['apollo', 'sabre', 'A/T/20JUNLAXMNL12ASFO|DL',      '1S20JUNLAXMNL12ASFO¥DL-T'],
			['apollo', 'sabre', '$BBA//@Y',                      'WPNCS¥TC-YB'],
			['apollo', 'sabre', '$BBN1|2*C05|3*INF//@Y',         'WPNC¥P1ADT/1C05/1INF¥TC-YB'],
			['apollo', 'sabre', '$BBN1*JCB|2*J05|3*JNF//@Y',     'WPNC¥P1JCB/1J05/1JNF¥TC-YB'],
			['apollo', 'sabre', '$BBN1*ITX|2*I05|3*ITF//@Y',     'WPNC¥P1ITX/1I05/1ITF¥TC-YB'],
			['apollo', 'sabre', '$BBA//@W',                      'WPNCS¥TC-SB'],
			['apollo', 'sabre', '$BBA//@C',                      'WPNCS¥TC-BB'],
			['apollo', 'sabre', '$BBA//@F',                      'WPNCS¥TC-FB'],
			['apollo', 'sabre', '$BBA//@AB',                     'WPNCS'],
			['apollo', 'sabre', '$B/ACC',                        'WPPC05'],
			['apollo', 'sabre', '$BB/ACC',                       'WPNC¥PC05'],
			['apollo', 'sabre', '$BBAS1|2|5|6',                  'WPNCS¥S1/2/5/6'],
			['apollo', 'sabre', '$BBAS1*3|5|6',                  'WPNCS¥S1-3/5/6'],
			['apollo', 'sabre', '$BBA*JCB',                      'WPNCS¥PJCB'],
			['apollo', 'sabre', '$BBA*ITX',                      'WPNCS¥PITX'],
			['apollo', 'sabre', '$BBAN1*ITX|2*I05',              'WPNCS¥P1ITX/1I05'],
			['apollo', 'sabre', '$BBAN1*ITX|2*I06|3*ITF',        'WPNCS¥P1ITX/1I06/1ITF'],
			['apollo', 'sabre', '$D15JANNYCIST:N',               'FQNYCIST15JAN¥PL'],
			['apollo', 'sabre', '$V3/16',                        'RD3*16'],
			['apollo', 'sabre', '**B-SMITH',                     '*-XXXX-SMITH'],
			['apollo', 'sabre', 'SA',       '\u00A4A'],
			['apollo', 'sabre', '@LTKIV',   'T*KIV'],
			['apollo', 'sabre', 'MR',       'MD'],
			['apollo', 'sabre', 'A*6P',     '1*6P'],
			['apollo', 'sabre', 'A*|5',     '1¥5'],
			['apollo', 'sabre', 'A*-5',     '1-5'],
			['apollo', 'sabre', '$BBA//@Y',     'WPNCS¥TC-YB'],
			['apollo', 'sabre', '$BBA//@W',     'WPNCS¥TC-SB'],
			['apollo', 'sabre', '$BBA//@C',     'WPNCS¥TC-BB'],
			['apollo', 'sabre', '$BBA//@F',     'WPNCS¥TC-FB'],
			['apollo', 'sabre', '$BBA//@AB',    'WPNCS'],
			['apollo', 'sabre', '$BBN1|2*C05|3*INF//@Y',        'WPNC¥P1ADT/1C05/1INF¥TC-YB'],
			['apollo', 'sabre', '$BBN1|2*C05|3*INF//@Y',        'WPNC¥P1ADT/1C05/1INF¥TC-YB'],
			['apollo', 'sabre', '$BBN1*JCB|2*J05|3*JNF//@Y',    'WPNC¥P1JCB/1J05/1JNF¥TC-YB'],
			['apollo', 'sabre', '$B:N',                         'WPPL'],
			['apollo', 'sabre', '$B:A',                         'WPPV'],
			['apollo', 'sabre', '$V1',                          'RD1*M'],
			['apollo', 'sabre', '**B-SMITH',                    '*-XXXX-SMITH'],
			['apollo', 'sabre', '**B-SMITH/AMY',                '*-XXXX-SMITH/AMY'],
			['apollo', 'sabre', 'A20JUNKIVRIX-9U.BT.SU',       '120JUNKIVRIX¥*9UBTSU'],
			['apollo', 'sabre', '@:5SFOHT/PLEASE CONTACT PAX',  '5SFOHT/PLEASE CONTACT PAX'],
			['apollo', 'sabre', '*TE1',                         'WETR*1'],
			['apollo', 'sabre', 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT',       '91-800-750-2238-A'],
			['apollo', 'sabre', '@:5S1 985.00 N1 720.00 F1 500.00',                 '5S1 985.00 N1 720.00 F1 500.00'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N1/////02APR11/FI//LASTNAME/NAME', '3DOCSA/DB/02APR11/FI/LASTNAME/NAME-1.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N1/////05MAR90/F//LASTNAME/NAME',     '3DOCSA/DB/05MAR90/F/LASTNAME/NAME-1.1'],
			['apollo', 'sabre', 'L@PS/A20JUNKIVRIX',            '120JUNKIVRIX\u00A4PS'],
			['apollo', 'sabre', 'L@PS/A20JUNKIVRIX12A',         '120JUNKIVRIX12A\u00A4PS'],
			['apollo', 'sabre', '$D15JANNYCIST:N',              'FQNYCIST15JAN¥PL'],
			['apollo', 'sabre', '$D20JUNKIVRIX@Y:OW',           'FQKIVRIX20JUNYB¥OW'],
			['apollo', 'sabre', 'A20JUNKIVMOW/D',               '120JUNKIVMOW/N¥'],
			['apollo', 'sabre', 'A/V/14AUGKIVMOW/D',            '1S14AUGKIVMOW/N¥-V'],
			['apollo', 'sabre', 'A/T/20JUNLAXMNL',              '1S20JUNLAXMNL-T'],
			['apollo', 'sabre', 'A/T/20JUNLAXMNL12ASFO',        '1S20JUNLAXMNL12ASFO-T'],
			['apollo', 'sabre', 'A20SEPKIVMIA12AIST960', '120SEPKIVMIA12AIST-960'],
			['apollo', 'sabre', 'A20SEPKIVMIA12AOTP.IST960', '120SEPKIVMIA12AOTP/IST-960'],
			['apollo', 'sabre', 'A/V/20SEPKIVMIA12AOTP.IST960', '1S20SEPKIVMIA12AOTP/IST-960-V'],
			['apollo', 'sabre', 'A/V/20SEPKIVMIA12AIST960', '1S20SEPKIVMIA12AIST-960-V'],
			['apollo', 'sabre', 'X1|3|4/01Y|3J|4M', 'WC1Y/3J/4M'],
			['apollo', 'sabre', '$DV20JUNKIVRIX05JUL:CAD', 'FQKIVRIX20JUN¥R05JUL/CAD'],
			['apollo', 'sabre', '$DNYCMNL28NOV17T12MAR17:CAD', 'FQ12MAR17NYCMNL28NOV17/CAD'],
			['apollo', 'sabre', '$DV20JUNKIVRIX05JUL:CAD', 'FQKIVRIX20JUN¥R05JUL/CAD'],
			['apollo', 'sabre', 'A20JUNNYCSFO12AMSP.CHI', '120JUNNYCSFO12AMSP/CHI'],
			['apollo', 'sabre', 'X1|3|4/01Y|3J|4M', 'WC1Y/3J/4M'],
			['apollo', 'sabre', 'X1|2|5/0Y', 'WC1Y/2Y/5Y'],
			['apollo', 'sabre', '01Y1*GK', '01Y1GK*'],
			['apollo', 'sabre', 'XX100|50', 'T\u00A4100+50'],
			['apollo', 'sabre', 'XX100-50', 'T\u00A4100-50'],
			['apollo', 'sabre', 'XX100*50', 'T\u00A4100*50'],
			['apollo', 'sabre', 'XX100/50', 'T\u00A4100/50'],
			['apollo', 'sabre', 'A20JUNKIVMOW/D', '120JUNKIVMOW/N¥'],
			['apollo', 'sabre', 'A/V/14AUGKIVMOW/D', '1S14AUGKIVMOW/N¥-V'],
			['apollo', 'sabre', 'A/T/20JUNLAXMNL', '1S20JUNLAXMNL-T'],
			['apollo', 'sabre', 'A/T/20JUNLAXMNL12ASFO', '1S20JUNLAXMNL12ASFO-T'],
			['apollo', 'sabre', 'A20SEPKIVMIA12AIST960', '120SEPKIVMIA12AIST-960'],
			['apollo', 'sabre', 'A20SEPKIVMIA12AOTP.IST960', '120SEPKIVMIA12AOTP/IST-960'],
			['apollo', 'sabre', 'A/V/20SEPKIVMIA12AOTP.IST960', '1S20SEPKIVMIA12AOTP/IST-960-V'],
			['apollo', 'sabre', 'A/V/20SEPKIVMIA12AIST960', '1S20SEPKIVMIA12AIST-960-V'],
			['apollo', 'sabre', '$DV20JUNKIVRIX05JUL:CAD', 'FQKIVRIX20JUN¥R05JUL/CAD'],
			['apollo', 'sabre', '$DNYCMNL28NOV17T12MAR17:CAD', 'FQ12MAR17NYCMNL28NOV17/CAD'],
			['apollo', 'sabre', '$DV20JUNKIVRIX05JUL:CAD', 'FQKIVRIX20JUN¥R05JUL/CAD'],
			['apollo', 'sabre', '$D20JUNKIVRIX|9U|PS@Y', 'FQKIVRIX20JUNYB-9U-PS'],
			['apollo', 'sabre', '$D20JUNKIVRIX@Y|9U|PS', 'FQKIVRIX20JUNYB-9U-PS'],
			['apollo', 'sabre', '$D20JUNKIVRIX@W|9U|PS', 'FQKIVRIX20JUNSB-9U-PS'],
			['apollo', 'sabre', '$D20JUNKIVRIX|9U|PS@W', 'FQKIVRIX20JUNSB-9U-PS'],
			['apollo', 'sabre', '$D20JUNKIVRIX|9U|PS@C', 'FQKIVRIX20JUNBB-9U-PS'],
			['apollo', 'sabre', '$D20JUNKIVRIX@C|9U|PS', 'FQKIVRIX20JUNBB-9U-PS'],
			['apollo', 'sabre', '$D20JUNKIVRIX|9U|PS@F', 'FQKIVRIX20JUNFB-9U-PS'],
			['apollo', 'sabre', '$D20JUNKIVRIX@F|9U|PS', 'FQKIVRIX20JUNFB-9U-PS'],
			['apollo', 'sabre', 'T:$B/Z5', 'WPRQ¥KP5'],
			['apollo', 'sabre', 'T:$B:N/Z5', 'WPRQ¥PL¥KP5'],
			['apollo', 'sabre', 'T:$B:A', 'WPRQ¥PV'],
			['apollo', 'sabre', 'T:$B/:A', 'WPRQ¥PV'],
			['apollo', 'sabre', 'T:$B:N', 'WPRQ¥PL'],
			['apollo', 'sabre', 'T:$B/:N', 'WPRQ¥PL'],
			['apollo', 'sabre', '$D20JUNKIVRIX|PS|TK|LO:OW', 'FQKIVRIX20JUN-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX:OW@Y', 'FQKIVRIX20JUNYB¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX@Y:OW', 'FQKIVRIX20JUNYB¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX:OW@W', 'FQKIVRIX20JUNSB¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX@W:OW', 'FQKIVRIX20JUNSB¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX:OW@C', 'FQKIVRIX20JUNBB¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX@C:OW', 'FQKIVRIX20JUNBB¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX:OW@F', 'FQKIVRIX20JUNFB¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX@F:OW', 'FQKIVRIX20JUNFB¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX|PS|TK|LO:RT', 'FQKIVRIX20JUN-PS-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX:RT|PS|TK|LO', 'FQKIVRIX20JUN-PS-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX:RT|PS|TK|LO', 'FQKIVRIX20JUN-PS-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX:RT@Y', 'FQKIVRIX20JUNYB¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX@Y:RT', 'FQKIVRIX20JUNYB¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX:RT@W', 'FQKIVRIX20JUNSB¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX@W:RT', 'FQKIVRIX20JUNSB¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX:RT@C', 'FQKIVRIX20JUNBB¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX@C:RT', 'FQKIVRIX20JUNBB¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX:RT@F', 'FQKIVRIX20JUNFB¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX@F:RT', 'FQKIVRIX20JUNFB¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX:OW@Y|PS|TK|LO', 'FQKIVRIX20JUNYB-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX@Y:OW|PS|TK|LO', 'FQKIVRIX20JUNYB-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX:OW@W|PS|TK|LO', 'FQKIVRIX20JUNSB-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX@W:OW|PS|TK|LO', 'FQKIVRIX20JUNSB-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX:OW@C|PS|TK|LO', 'FQKIVRIX20JUNBB-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX@C:OW|PS|TK|LO', 'FQKIVRIX20JUNBB-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX:OW@F|PS|TK|LO', 'FQKIVRIX20JUNFB-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX@F:OW|PS|TK|LO', 'FQKIVRIX20JUNFB-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX|PS|TK|LO:RT', 'FQKIVRIX20JUN-PS-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX:RT|PS|TK|LO|TK|LO', 'FQKIVRIX20JUN-PS-TK-LO-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX:RT@Y|PS|TK|LO', 'FQKIVRIX20JUNYB-PS-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX@Y:RT|PS|TK|LO', 'FQKIVRIX20JUNYB-PS-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX:RT@W|PS|TK|LO', 'FQKIVRIX20JUNSB-PS-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX@W:RT|PS|TK|LO', 'FQKIVRIX20JUNSB-PS-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX:RT@C|PS|TK|LO', 'FQKIVRIX20JUNBB-PS-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX@C:RT|PS|TK|LO', 'FQKIVRIX20JUNBB-PS-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX:RT@F|PS|TK|LO', 'FQKIVRIX20JUNFB-PS-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX@F:RT|PS|TK|LO', 'FQKIVRIX20JUNFB-PS-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX|PS|TK|LO:OW', 'FQKIVRIX20JUN-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX|PS|TK|LO:OW@Y', 'FQKIVRIX20JUNYB-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX|PS|TK|LO@Y:OW', 'FQKIVRIX20JUNYB-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX|PS|TK|LO:OW@W', 'FQKIVRIX20JUNSB-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX|PS|TK|LO@W:OW', 'FQKIVRIX20JUNSB-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX|PS|TK|LO:OW@C', 'FQKIVRIX20JUNBB-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX|PS|TK|LO@C:OW', 'FQKIVRIX20JUNBB-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX|PS|TK|LO:OW@F', 'FQKIVRIX20JUNFB-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX|PS|TK|LO@F:OW', 'FQKIVRIX20JUNFB-PS-TK-LO¥OW'],
			['apollo', 'sabre', '$D20JUNKIVRIX|PS|TK|LO:RT', 'FQKIVRIX20JUN-PS-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX:RT|PS|TK|LO', 'FQKIVRIX20JUN-PS-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX:RT|PS|TK|LO', 'FQKIVRIX20JUN-PS-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX|TK|LO:RT@Y', 'FQKIVRIX20JUNYB-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX|TK|LO@Y:RT', 'FQKIVRIX20JUNYB-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX|TK|LO:RT@W', 'FQKIVRIX20JUNSB-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX|TK|LO@W:RT', 'FQKIVRIX20JUNSB-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX|TK|LO:RT@C', 'FQKIVRIX20JUNBB-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX|TK|LO@C:RT', 'FQKIVRIX20JUNBB-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX|TK|LO:RT@F', 'FQKIVRIX20JUNFB-TK-LO¥RT'],
			['apollo', 'sabre', '$D20JUNKIVRIX|TK|LO@F:RT', 'FQKIVRIX20JUNFB-TK-LO¥RT'],
			['sabre', 'apollo', '120JUNKIVMOW/N¥', 'A20JUNKIVMOW/D'],
			['sabre', 'apollo', '1S14AUGKIVMOW/N¥-V', 'A/V/14AUGKIVMOW/D'],
			['sabre', 'apollo', '1S20JUNLAXMNL-T', 'A/T/20JUNLAXMNL'],
			['sabre', 'apollo', '1S20JUNLAXMNL12ASFO-T', 'A/T/20JUNLAXMNL12ASFO'],
			['sabre', 'apollo', '120SEPKIVMIA12AIST-960', 'A20SEPKIVMIA12AIST960'],
			['sabre', 'apollo', '120SEPKIVMIA12AOTP/IST-960', 'A20SEPKIVMIA12AOTP.IST960'],
			['sabre', 'apollo', '1S20SEPKIVMIA12AOTP/IST-960-V', 'A/V/20SEPKIVMIA12AOTP.IST960'],
			['sabre', 'apollo', '1S20SEPKIVMIA12AIST-960-V', 'A/V/20SEPKIVMIA12AIST960'],
			['sabre', 'apollo', 'FQ12MAR17NYCMNL28NOV17/CAD', '$DNYCMNL28NOV17T12MAR17:CAD'],
			['sabre', 'apollo', 'WC1Y/3J/4M', 'X1|3|4/01Y|3J|4M'],
			['sabre', 'apollo', 'FQKIVRIX20JUNYB-9U-PS', '$D20JUNKIVRIX@Y|9U|PS'],
			['sabre', 'apollo', 'FQKIVRIX20JUNSB-9U-PS', '$D20JUNKIVRIX@W|9U|PS'],
			['sabre', 'apollo', 'FQKIVRIX20JUNBB-9U-PS', '$D20JUNKIVRIX@C|9U|PS'],
			['sabre', 'apollo', 'FQKIVRIX20JUNFB-9U-PS', '$D20JUNKIVRIX@F|9U|PS'],
			['apollo', 'sabre', '$D20JUNKIVRIX@F|9U|PS', 'FQKIVRIX20JUNFB-9U-PS'],
			['sabre', 'apollo', 'WPRQ¥PL¥KP5', 'T:$B:N/Z5'],
			['sabre', 'apollo', 'WPPC05¥NC', '$BB*C05/ACC'],
			['apollo', 'sabre', '$BB0/ACC', 'WPNCB¥PC05'],
			['apollo', 'sabre', '$BBA/ACC', 'WPNCS¥PC05'],
			['sabre', 'apollo', 'T\u00A4100+50', 'XX100|50'],
			['sabre', 'apollo', 'T\u00A4100-50', 'XX100-50'],
			['sabre', 'apollo', 'T\u00A4100*50', 'XX100*50'],
			['sabre', 'apollo', 'T\u00A4100/50', 'XX100/50'],
			['sabre', 'apollo', '01Y1GK*', '01Y1*GK'],
			['sabre', 'apollo', 'WPRQ¥PL', 'T:$B:N'],
			['sabre', 'apollo', 'WC1Y/2Y/5Y', 'X1|2|5/0Y'],
			['sabre', 'apollo', 'FQKIVRIX20JUN-PS-TK-LO¥OW', '$D20JUNKIVRIX|PS|TK|LO:OW'],
			['sabre', 'apollo', 'FQKIVRIX20JUN¥OW-PS-TK-LO', '$D20JUNKIVRIX:OW|PS|TK|LO'],
			['sabre', 'apollo', 'FQKIVRIX20JUNYB¥OW', '$D20JUNKIVRIX@Y:OW'],
			['sabre', 'apollo', 'FQKIVRIX20JUNSB¥OW', '$D20JUNKIVRIX@W:OW'],
			['sabre', 'apollo', 'FQKIVRIX20JUNBB¥OW', '$D20JUNKIVRIX@C:OW'],
			['sabre', 'apollo', 'FQKIVRIX20JUNFB¥OW', '$D20JUNKIVRIX@F:OW'],
			['sabre', 'apollo', 'FQKIVRIX20JUN-PS-TK-LO¥RT', '$D20JUNKIVRIX|PS|TK|LO:RT'],
			['sabre', 'apollo', 'FQKIVRIX20JUN¥RT-PS-TK-LO', '$D20JUNKIVRIX:RT|PS|TK|LO'],
			['sabre', 'apollo', 'FQKIVRIX20JUN¥RT-PS-TK-LO', '$D20JUNKIVRIX:RT|PS|TK|LO'],
			['sabre', 'apollo', 'FQKIVRIX20JUNYB¥RT', '$D20JUNKIVRIX@Y:RT'],
			['sabre', 'apollo', 'FQKIVRIX20JUNSB¥RT', '$D20JUNKIVRIX@W:RT'],
			['sabre', 'apollo', 'FQKIVRIX20JUNBB¥RT', '$D20JUNKIVRIX@C:RT'],
			['sabre', 'apollo', 'FQKIVRIX20JUNFB¥RT', '$D20JUNKIVRIX@F:RT'],
			['sabre', 'apollo', '120JUNKIVRIX¥BT', 'A20JUNKIVRIX|BT'],
			['apollo', 'sabre', '$D10SEPPITMIL-JCB', 'FQPITMIL10SEP¥PJCB'],
			['apollo', 'sabre', '$D10SEPPITMIL-ITX', 'FQPITMIL10SEP¥PITX'],
			['apollo', 'sabre', 'XX100.20|50', 'T\u00A4100.20+50'],
			['apollo', 'sabre', 'N:SMITH/JUNIOR*P-C07', '-SMITH/JUNIOR*P-C07'],
			['apollo', 'sabre', 'N:EAGEN/KATY JOHN*P-C07', '-EAGEN/KATY JOHN*P-C07'],
			['apollo', 'sabre', 'S*CTY/ACCRA', 'W/-CCACCRA'],
			['apollo', 'sabre', 'S*AIR/LUFTHANSA', 'W/-ALLUFTHANSA'],
			['apollo', 'sabre', 'A/U8/17JULSFOJNB|DL', '1S17JULSFOJNB¥DL-8U'],
			['apollo', 'sabre', 'A/T8/20JUNLAXMNL12ASFO|DL', '1S20JUNLAXMNL12ASFO¥DL-8T'],
			['apollo', 'sabre', 'A/V/14AUGKIVMOW/D|9U.SU', '1S14AUGKIVMOW/N¥9USU-V'],
			['apollo', 'sabre', 'A/T/20JUNSFOACC12ANYC.AMS|/*S', '1S20JUNSFOACC12ANYC/AMS¥/*S-T'],
			['apollo', 'sabre', 'A/K/20JUNSFOACC12ANYC|/*S', '1S20JUNSFOACC12ANYC¥/*S-K'],
			['apollo', 'sabre', 'A/V/20SEPKIVMIA12AOTP.IST960|TK.9U', '1S20SEPKIVMIA12AOTP/IST-960¥TK9U-V'],
			['apollo', 'sabre', 'A/V/20SEPKIVMIA12AIST960|TK.9U', '1S20SEPKIVMIA12AIST-960¥TK9U-V'],
			['apollo', 'sabre', 'A/V/20JUNSFOACC12ANYC960|/*S', '1S20JUNSFOACC12ANYC-960¥/*S-V'],
			['apollo', 'sabre', 'A/V/14AUGKIVMOW/D|9U.SU', '1S14AUGKIVMOW/N¥9USU-V'],
			['apollo', 'sabre', 'A/T8/20JUNLAXMNL12ASFO.SEA|DL', '1S20JUNLAXMNL12ASFO/SEA¥DL-8T'],
			['apollo', 'sabre', 'A/T8/20JUNLAXMNL12ASFO.SEA/D|DL', '1S20JUNLAXMNL12ASFO/SEA/N¥DL-8T'],
			['sabre', 'apollo', 'FQPITMIL10SEP¥PJCB', '$D10SEPPITMIL-JCB'],
			['sabre', 'apollo', 'FQPITMIL10SEP¥PITX', '$D10SEPPITMIL-ITX'],
			['sabre', 'apollo', '91-800-750-2238', 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT'],
			['sabre', 'apollo', 'W/-CCACCRA', 'S*CTY/ACCRA'],
			['sabre', 'apollo', 'W/-ALLUFTHANSA', 'S*AIR/LUFTHANSA'],
			['sabre', 'apollo', 'A/U8/17JULSFOJNB+DL', null],
			['sabre', 'apollo', '1S17JULSFOJNB¥DL-8U', 'A/U8/17JULSFOJNB|DL'],
			['sabre', 'apollo', '1S20JUNLAXMNL12ASFO¥DL-8T', 'A/T8/20JUNLAXMNL12ASFO|DL'],
			['sabre', 'apollo', '1S14AUGKIVMOW/N¥9USU-V', 'A/V/14AUGKIVMOW/D|9U.SU'],
			['sabre', 'apollo', '1S20JUNSFOACC12ANYC/AMS¥/*S-T', 'A/T/20JUNSFOACC12ANYC.AMS|/*S'],
			['sabre', 'apollo', '1S20JUNSFOACC12ANYC¥/*S-K', 'A/K/20JUNSFOACC12ANYC|/*S'],
			['sabre', 'apollo', '1S20SEPKIVMIA12AOTP/IST-960¥TK9U-V', 'A/V/20SEPKIVMIA12AOTP.IST960|TK.9U'],
			['sabre', 'apollo', '1S20SEPKIVMIA12AIST-960¥TK9U-V', 'A/V/20SEPKIVMIA12AIST960|TK.9U'],
			['sabre', 'apollo', '1S20JUNSFOACC12ANYC-960¥/*S-V', 'A/V/20JUNSFOACC12ANYC960|/*S'],
			['sabre', 'apollo', '1S14AUGKIVMOW/N¥9USU-V', 'A/V/14AUGKIVMOW/D|9U.SU'],
			['sabre', 'apollo', '1S20JUNLAXMNL12ASFO/SEA¥DL-8T'   , 'A/T8/20JUNLAXMNL12ASFO.SEA|DL'],

			['apollo', 'sabre', 'X1|3|4/01Y|3J|4M', 'WC1Y/3J/4M'],
			['apollo', 'sabre', 'X1|3|5', 'X1/3/5'],
			['sabre', 'apollo', 'WC1Y/2M', 'X1|2/01Y|2M'],

			['apollo', 'sabre', '$D10SEPPITMIL-JCB', 'FQPITMIL10SEP¥PJCB'],
			['apollo', 'sabre', '$D10SEPPITMIL-ITX', 'FQPITMIL10SEP¥PITX'],
			['apollo', 'sabre', '$BBS1', 'WPNC¥S1'],
			['apollo', 'sabre', 'S*AIR/BANKGKOK AIRWAYS', 'W/-ALBANKGKOK AIRWAYS'],
			['apollo', 'sabre', '$B:CAD', 'WPMCAD'],
			['apollo', 'sabre', '$BB:CAD', 'WPNC¥MCAD'],
			['apollo', 'sabre', '$BBA:CAD', 'WPNCS¥MCAD'],
			['apollo', 'sabre', '$BB0:CAD', 'WPNCB¥MCAD'],
			['apollo', 'sabre', '$B/:CAD', 'WPMCAD'],
			['apollo', 'sabre', '$BB/:CAD', 'WPNC¥MCAD'],
			['apollo', 'sabre', '$BBA/:CAD', 'WPNCS¥MCAD'],
			['apollo', 'sabre', '$BB0/:CAD', 'WPNCB¥MCAD'],
			['apollo', 'sabre', '|4', ',4'],
			['apollo', 'sabre', '$BN1|2*C05|3*INF/:EUR', 'WPP1ADT/1C05/1INF¥MEUR'],
			['apollo', 'sabre', '$BBN1*JCB|2*J05/:EUR', 'WPNC¥P1JCB/1J05¥MEUR'],
			['apollo', 'sabre', '$BBAN1*ITX|2*I05/:EUR', 'WPNCS¥P1ITX/1I05¥MEUR'],
			['apollo', 'sabre', '$BB0N1|2*C05|3*INF/:EUR', 'WPNCB¥P1ADT/1C05/1INF¥MEUR'],
			['apollo', 'sabre', '$BN1|2*C05/:EUR', 'WPP1ADT/1C05¥MEUR'],
			['apollo', 'sabre', '$BN1|2*C05|3*INF/:EUR', 'WPP1ADT/1C05/1INF¥MEUR'],
			['apollo', 'sabre', '$BBN1|2*C05|3*INF/:EUR', 'WPNC¥P1ADT/1C05/1INF¥MEUR'],
			['apollo', 'sabre', '$BBN1|2*C05/:EUR', 'WPNC¥P1ADT/1C05¥MEUR'],
			['apollo', 'sabre', '$BBN1|2|3*C05|4*INF/:EUR', 'WPNC¥P2ADT/1C05/1INF¥MEUR'],
			['apollo', 'sabre', '$BB0N1|2*C05/:EUR', 'WPNCB¥P1ADT/1C05¥MEUR'],
			['apollo', 'sabre', '$BB0N1|2*C05|3*INF/:EUR', 'WPNCB¥P1ADT/1C05/1INF¥MEUR'],
			['apollo', 'sabre', '$BB0N1|2|3*C05|4*INF/:EUR', 'WPNCB¥P2ADT/1C05/1INF¥MEUR'],
			['apollo', 'sabre', '$BBAN1|2*C05/:EUR', 'WPNCS¥P1ADT/1C05¥MEUR'],
			['apollo', 'sabre', '$BBAN1|2*C05|3*INF/:EUR', 'WPNCS¥P1ADT/1C05/1INF¥MEUR'],
			['apollo', 'sabre', '$BBAN1|2|3*C05|4*INF/:EUR', 'WPNCS¥P2ADT/1C05/1INF¥MEUR'],
			['apollo', 'sabre', '$B*JCB/:EUR', 'WPPJCB¥MEUR'],
			['apollo', 'sabre', '$BB*JCB/:EUR', 'WPNC¥PJCB¥MEUR'],
			['apollo', 'sabre', '$BB0*JCB/:EUR', 'WPNCB¥PJCB¥MEUR'],
			['apollo', 'sabre', '$BBA*JCB/:EUR', 'WPNCS¥PJCB¥MEUR'],
			['apollo', 'sabre', '$BN1*JCB|2*J05/:EUR', 'WPP1JCB/1J05¥MEUR'],
			['apollo', 'sabre', '$BBN1*JCB|2*J05/:EUR', 'WPNC¥P1JCB/1J05¥MEUR'],
			['apollo', 'sabre', '$BB0N1*JCB|2*J05/:EUR', 'WPNCB¥P1JCB/1J05¥MEUR'],
			['apollo', 'sabre', '$BN1*JCB|2*JNS|3*JNF/:EUR', 'WPP1JCB/1JNS/1JNF¥MEUR'],
			['apollo', 'sabre', '$B*ITX/:EUR', 'WPPITX¥MEUR'],
			['apollo', 'sabre', '$BB*ITX/:EUR', 'WPNC¥PITX¥MEUR'],
			['apollo', 'sabre', '$BB0*ITX/:EUR', 'WPNCB¥PITX¥MEUR'],
			['apollo', 'sabre', '$BBA*ITX/:EUR', 'WPNCS¥PITX¥MEUR'],
			['apollo', 'sabre', '$BN1*ITX|2*I06/:EUR', 'WPP1ITX/1I06¥MEUR'],
			['apollo', 'sabre', '$BN1*ITX|2*I06|3*ITF/:EUR', 'WPP1ITX/1I06/1ITF¥MEUR'],
			['apollo', 'sabre', '$BBN1*ITX|2*I05/:EUR', 'WPNC¥P1ITX/1I05¥MEUR'],
			['apollo', 'sabre', '$BBN1*ITX|2*I06|3*ITF/:EUR', 'WPNC¥P1ITX/1I06/1ITF¥MEUR'],
			['apollo', 'sabre', '$BB0N1*ITX|2*I05/:EUR', 'WPNCB¥P1ITX/1I05¥MEUR'],
			['apollo', 'sabre', '$BB0N1*ITX|2*I06|3*ITF/:EUR', 'WPNCB¥P1ITX/1I06/1ITF¥MEUR'],
			['apollo', 'sabre', '$BBAN1*ITX|2*I05/:EUR', 'WPNCS¥P1ITX/1I05¥MEUR'],
			['apollo', 'sabre', '$BBAN1*ITX|2*I06|3*ITF/:EUR', 'WPNCS¥P1ITX/1I06/1ITF¥MEUR'],
			['apollo', 'sabre', '$BS1|2/:EUR', 'WPS1/2¥MEUR'],
			['apollo', 'sabre', '$BS1*3|5|6/:EUR', 'WPS1-3/5/6¥MEUR'],
			['apollo', 'sabre', '$BBS1|2/:EUR', 'WPNC¥S1/2¥MEUR'],
			['apollo', 'sabre', '$BBS1*3|5|6/:EUR', 'WPNC¥S1-3/5/6¥MEUR'],
			['apollo', 'sabre', '$BBAS1|2|5|6/:EUR', 'WPNCS¥S1/2/5/6¥MEUR'],
			['apollo', 'sabre', '$BBAS1*3|5|6/:EUR', 'WPNCS¥S1-3/5/6¥MEUR'],
			['apollo', 'sabre', '$BS1|2|5|6/N1|2*C05/:EUR', 'WPS1/2/5/6¥P1ADT/1C05¥MEUR'],
			['apollo', 'sabre', '$BS1|2|5|6/N1|2*C05|3*INF/:EUR', 'WPS1/2/5/6¥P1ADT/1C05/1INF¥MEUR'],
			['apollo', 'sabre', '$BS1|2|5|6/N1|2|3*C05|4*INF/:EUR', 'WPS1/2/5/6¥P2ADT/1C05/1INF¥MEUR'],
			['apollo', 'sabre', '$BBS1|2|5|6/N1|2*C05/:EUR', 'WPNC¥S1/2/5/6¥P1ADT/1C05¥MEUR'],
			['apollo', 'sabre', '$BBS1|2|5|6/N1|2*C05|3*INF/:EUR', 'WPNC¥S1/2/5/6¥P1ADT/1C05/1INF¥MEUR'],
			['apollo', 'sabre', '$BBS1|2|5|6/N1|2|3*C05|4*INF/:EUR', 'WPNC¥S1/2/5/6¥P2ADT/1C05/1INF¥MEUR'],
			['apollo', 'sabre', '$BB0S1|2|5|6/N1|2*C05/:EUR', 'WPNCB¥S1/2/5/6¥P1ADT/1C05¥MEUR'],
			['apollo', 'sabre', '$BB0S1|2|5|6/N1|2*C05|3*INF/:EUR', 'WPNCB¥S1/2/5/6¥P1ADT/1C05/1INF¥MEUR'],
			['apollo', 'sabre', '$BB0S1|2|5|6/N1|2|3*C05|4*INF/:EUR', 'WPNCB¥S1/2/5/6¥P2ADT/1C05/1INF¥MEUR'],
			['apollo', 'sabre', '$BBAS1|2|5|6/N1|2*C05/:EUR', 'WPNCS¥S1/2/5/6¥P1ADT/1C05¥MEUR'],
			['apollo', 'sabre', '$BBAS1|2|5|6/N1|2*C05|3*INF/:EUR', 'WPNCS¥S1/2/5/6¥P1ADT/1C05/1INF¥MEUR'],
			['apollo', 'sabre', '$BBAS1|2|5|6/N1|2|3*C05|4*INF/:EUR', 'WPNCS¥S1/2/5/6¥P2ADT/1C05/1INF¥MEUR'],
			['apollo', 'sabre', '$BBS1|2|5|6/N1*JCB|2*JCB|3*JNS|4*JNF/:EUR', 'WPNC¥S1/2/5/6¥P2JCB/1JNS/1JNF¥MEUR'],
			['apollo', 'sabre', '$BBS1|2|5|6/N1*ITX|2*ITX|3*INN|4*ITF/:EUR', 'WPNC¥S1/2/5/6¥P2ITX/1INN/1ITF¥MEUR'],
			['apollo', 'sabre', '$DV20SEPKIVRIX', 'FQKIVRIX20SEP'],
			['sabre', 'apollo', 'FQPITMIL10SEP¥PJCB', '$D10SEPPITMIL-JCB'],
			['sabre', 'apollo', 'FQPITMIL10SEP¥PITX', '$D10SEPPITMIL-ITX'],
			['sabre', 'apollo', 'T\u00A4100.20+50', 'XX100.20|50'],
			['sabre', 'apollo', 'FQLAXPAR30AUG¥PJCB', '$D30AUGLAXPAR-JCB'],
			['sabre', 'apollo', 'WPS3¥NC', '$BBS3'],
			['sabre', 'apollo', 'W/-ALBANKGKOK AIRWAYS', 'S*AIR/BANKGKOK AIRWAYS'],
			['sabre', 'apollo', ',3', '|3'],
			['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥MEUR', '$BN1*ADT|2*C05|3*INF/:EUR'],
			['sabre', 'apollo', 'WPP1JCB/1J05¥NC¥MEUR', '$BBN1*JCB|2*J05/:EUR'],
			['sabre', 'apollo', 'WPP1ITX/1I06¥NCS¥MEUR', '$BBAN1*ITX|2*I06/:EUR'],
			['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥NCB¥MEUR', '$BB0N1*ADT|2*C05|3*INF/:EUR'],
			['sabre', 'apollo', 'WPP1ADT/1C05¥MEUR', '$BN1*ADT|2*C05/:EUR'],
			['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥MEUR', '$BN1*ADT|2*C05|3*INF/:EUR'],
			['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥NC¥MEUR', '$BBN1*ADT|2*C05|3*INF/:EUR'],
			['sabre', 'apollo', 'WPP1ADT/1C05¥NC¥MEUR', '$BBN1*ADT|2*C05/:EUR'],
			['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥NC¥MEUR', '$BBN1*ADT|2*ADT|3*C05|4*INF/:EUR'],
			['sabre', 'apollo', 'WPP1ADT/1C05¥NCB¥MEUR', '$BB0N1*ADT|2*C05/:EUR'],
			['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥NCB¥MEUR', '$BB0N1*ADT|2*C05|3*INF/:EUR'],
			['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥NCB¥MEUR', '$BB0N1*ADT|2*ADT|3*C05|4*INF/:EUR'],
			['sabre', 'apollo', 'WPP1ADT/1C05¥NCS¥MEUR', '$BBAN1*ADT|2*C05/:EUR'],
			['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥NCS¥MEUR', '$BBAN1*ADT|2*C05|3*INF/:EUR'],
			['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥NCS¥MEUR', '$BBAN1*ADT|2*ADT|3*C05|4*INF/:EUR'],
			['sabre', 'apollo', 'WPPJCB¥MEUR', '$B*JCB/:EUR'],
			['sabre', 'apollo', 'WPNC¥PJCB¥MEUR', '$BB*JCB/:EUR'],
			['sabre', 'apollo', 'WPNCB¥PJCB¥MEUR', '$BB0*JCB/:EUR'],
			['sabre', 'apollo', 'WPNCS¥PJCB¥MEUR', '$BBA*JCB/:EUR'],
			['sabre', 'apollo', 'WPP1JCB/1J05¥MEUR', '$BN1*JCB|2*J05/:EUR'],
			['sabre', 'apollo', 'WPP1JCB/1J05¥NC¥MEUR', '$BBN1*JCB|2*J05/:EUR'],
			['sabre', 'apollo', 'WPP1JCB/1J05¥NCB¥MEUR', '$BB0N1*JCB|2*J05/:EUR'],
			['sabre', 'apollo', 'WPP1JCB/1JNS/1JNF¥MEUR', '$BN1*JCB|2*JNS|3*JNF/:EUR'],
			['sabre', 'apollo', 'WPPITX¥MEUR', '$B*ITX/:EUR'],
			['sabre', 'apollo', 'WPNC¥PITX¥MEUR', '$BB*ITX/:EUR'],
			['sabre', 'apollo', 'WPNCB¥PITX¥MEUR', '$BB0*ITX/:EUR'],
			['sabre', 'apollo', 'WPNCS¥PITX¥MEUR', '$BBA*ITX/:EUR'],
			['sabre', 'apollo', 'WPP1ITX/1I06¥MEUR', '$BN1*ITX|2*I06/:EUR'],
			['sabre', 'apollo', 'WPP1ITX/1I06/1ITF¥MEUR', '$BN1*ITX|2*I06|3*ITF/:EUR'],
			['sabre', 'apollo', 'WPP1ITX/1I06¥NC¥MEUR', '$BBN1*ITX|2*I06/:EUR'],
			['sabre', 'apollo', 'WPP1ITX/1I06/1ITF¥NC¥MEUR', '$BBN1*ITX|2*I06|3*ITF/:EUR'],
			['sabre', 'apollo', 'WPP1ITX/1I06¥NCB¥MEUR', '$BB0N1*ITX|2*I06/:EUR'],
			['sabre', 'apollo', 'WPP1ITX/1I06/1ITF¥NCB¥MEUR', '$BB0N1*ITX|2*I06|3*ITF/:EUR'],
			['sabre', 'apollo', 'WPP1ITX/1I06¥NCS¥MEUR', '$BBAN1*ITX|2*I06/:EUR'],
			['sabre', 'apollo', 'WPP1ITX/1I06/1ITF¥NCS¥MEUR', '$BBAN1*ITX|2*I06|3*ITF/:EUR'],
			['sabre', 'apollo', 'WPS1/2¥MEUR', '$BS1|2/:EUR'],
			['sabre', 'apollo', 'WPS1-3/5/6¥MEUR', '$BS1*3|5|6/:EUR'],
			['sabre', 'apollo', 'WPS1/2¥NC¥MEUR', '$BBS1|2/:EUR'],
			['sabre', 'apollo', 'WPS1-3/5/6¥NC¥MEUR', '$BBS1*3|5|6/:EUR'],
			['sabre', 'apollo', 'WPS1/2/5/6¥NCS¥MEUR', '$BBAS1|2|5|6/:EUR'],
			['sabre', 'apollo', 'WPS1/2/5/6¥NCS¥MEUR', '$BBAS1|2|5|6/:EUR'],
			['sabre', 'apollo', 'WPP1ADT/1C05¥S1/2/5/6¥MEUR', '$BN1*ADT|2*C05/S1|2|5|6/:EUR'],
			['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥S1/2/5/6¥MEUR', '$B/N1*ADT|2*C05|3*INF/S1|2|5|6/:EUR'],
			['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥S1/2/5/6¥MEUR', '$B/N1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6/:EUR'],
			['sabre', 'apollo', 'WPP1ADT/1C05¥NC¥S1/2/5/6¥MEUR', '$BB/N1*ADT|2*C05/S1|2|5|6/:EUR'],
			['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥NC¥S1/2/5/6¥MEUR', '$BB/N1*ADT|2*C05|3*INF/S1|2|5|6/:EUR'],
			['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥NC¥S1/2/5/6¥MEUR', '$BB/N1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6/:EUR'],
			['sabre', 'apollo', 'WPP1ADT/1C05¥NCB¥S1/2/5/6¥MEUR', '$BB0/N1*ADT|2*C05/S1|2|5|6/:EUR'],
			['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥NCB¥S1/2/5/6¥MEUR', '$BB0/N1*ADT|2*C05|3*INF/S1|2|5|6/:EUR'],
			['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥NCB¥S1/2/5/6¥MEUR', '$BB0/N1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6/:EUR'],
			['sabre', 'apollo', 'WPP1ADT/1C05¥NCS¥S1/2/5/6¥MEUR', '$BBA/N1*ADT|2*C05/S1|2|5|6/:EUR'],
			['sabre', 'apollo', 'WPP1ADT/1C05/1INF¥NCS¥S1/2/5/6¥MEUR', '$BBA/N1*ADT|2*C05|3*INF/S1|2|5|6/:EUR'],
			['sabre', 'apollo', 'WPP2ADT/1C05/1INF¥NCS¥S1/2/5/6¥MEUR', '$BBA/N1*ADT|2*ADT|3*C05|4*INF/S1|2|5|6/:EUR'],
			['sabre', 'apollo', 'WPP2JCB/1JNS/1JNF¥NC¥S1/2/5/6¥MEUR', '$BB/N1*JCB|2*JCB|3*JNS|4*JNF/S1|2|5|6/:EUR'],
			['sabre', 'apollo', 'WPP2ITX/1INN/1ITF¥NC¥S1/2/5/6¥MEUR', '$BB/N1*ITX|2*ITX|3*INN|4*ITF/S1|2|5|6/:EUR'],
			['sabre', 'apollo', 'FQKIVRIX20SEP¥OW', '$D20SEPKIVRIX:OW'],
			['apollo', 'amadeus', 'A20SEPNYCSFO12AMSP|UA.AA.DL', 'AD20SEPNYCSFO12A/XMSP/AUA,AA,DL'],
			['apollo', 'amadeus', 'A20SEPNYCSFO12AMSP.CHI|UA.AA.DL', 'AD20SEPNYCSFO12A/XMSPCHI/AUA,AA,DL'],
			['apollo', 'amadeus', 'A20SEPKIVMOW/D|9U.SU', 'AD20SEPKIVMOW/FN/A9U,SU'],
			['apollo', 'amadeus', 'L@S7/A15SEPKIVMOW', '1S7AD15SEPKIVMOW'],
			['apollo', 'amadeus', 'A20SEPKIVMOW/D|9U.SU', 'AD20SEPKIVMOW/FN/A9U,SU'],
			['apollo', 'amadeus', 'A/V/14AUGKIVMOW/D|9U.SU', 'AD/14AUGKIVMOW/FN/A9U,SU/CV'],
			['apollo', 'amadeus', 'L@S7/A15SEPKIVMOW12A', '1S7AD15SEPKIVMOW12A'],
			['apollo', 'amadeus', 'A20SEPKIVRIX-9U.BT.SU', 'AD20SEPKIVRIX/A-9U,BT,SU'],
			['apollo', 'amadeus', 'A/U8/17JULSFOJNB|DL', 'AD/17JULSFOJNB/ADL/CU/B8'],
			['apollo', 'amadeus', 'A/T8/20SEPLAXMNL12ASFO|DL', 'AD/20SEPLAXMNL12A/XSFO/ADL/CT/B8'],
			['apollo', 'amadeus', 'A/T/20SEPLAXMNL12ASFO|DL', 'AD/20SEPLAXMNL12A/XSFO/ADL/CT'],
			['apollo', 'amadeus', 'A20MARSFOACC|/*A', 'AD20MARSFOACC/A*A'],
			['apollo', 'amadeus', 'A/K/20SEPSFOACC12ANYC|/*S', 'AD/20SEPSFOACC12A/XNYC/CK/A*S'],
			['apollo', 'amadeus', 'A/K/20SEPSFOACC12ANYC.AMS|/*S', 'AD/20SEPSFOACC12A/XNYCAMS/CK/A*S'],
			['apollo', 'amadeus', 'A*6P', 'AC6P'],
			['apollo', 'amadeus', 'A*|5', 'AC5'],
			['apollo', 'amadeus', 'A*-5', 'AC-5'],
			['apollo', 'amadeus', 'A*C6', 'AC'],
			['apollo', 'amadeus', '$BB0', 'FXR'],
			['apollo', 'amadeus', '$BBA', 'FXL'],
			['apollo', 'amadeus', '$BBA//@Y', 'FXL/KM'],
			['apollo', 'amadeus', '$BBA//@W', 'FXL/KW'],
			['apollo', 'amadeus', '$BBA//@C', 'FXL/KC'],
			['apollo', 'amadeus', '$BBA//@F', 'FXL/KF'],
			['apollo', 'amadeus', '$BBA//@AB', 'FXL/K'],
			['apollo', 'amadeus', '$BB/:N', 'FXA/R,P'],
			['apollo', 'amadeus', '$BB/:A', 'FXA/R,U'],
			['apollo', 'amadeus', '$BB0/ACC', 'FXR/RC05'],
			['apollo', 'amadeus', '$BBA/ACC', 'FXL/RC05'],
			['sabre', 'amadeus', '115SEPKIVMOW12A\u00A4S7', '1S7AD15SEPKIVMOW12A'],
			['sabre', 'amadeus', '115SEPKIVMOW\u00A4S7', '1S7AD15SEPKIVMOW'],
			['sabre', 'amadeus', '1S14AUGKIVMOW/N¥9USU-V', 'AD/14AUGKIVMOW/FN/A9U,SU/CV'],
			['sabre', 'amadeus', '120SEPKIVMOW/N¥9USU', 'AD20SEPKIVMOW/FN/A9U,SU'],
			['sabre', 'amadeus', '120SEPNYCSFO12AMSP/CHI¥UAAADL', 'AD20SEPNYCSFO12A/XMSPCHI/AUA,AA,DL'],
			['sabre', 'amadeus', '120SEPNYCSFO12AMSP¥UAAADL', 'AD20SEPNYCSFO12A/XMSP/AUA,AA,DL'],
			['sabre', 'amadeus', '120SEPKIVRIX¥*9UBTSU', 'AD20SEPKIVRIX/A-9U,BT,SU'],
			['sabre', 'amadeus', '120SEPKIVMOW/N¥9USU', 'AD20SEPKIVMOW/FN/A9U,SU'],
			['sabre', 'amadeus', '1S17JULSFOJNB¥DL-8U', 'AD/17JULSFOJNB/ADL/CU/B8'],
			['sabre', 'amadeus', '1S20SEPLAXMNL12ASFO¥DL-8T', 'AD/20SEPLAXMNL12A/XSFO/ADL/CT/B8'],
			['sabre', 'amadeus', '1S20SEPLAXMNL12ASFO¥DL-T', 'AD/20SEPLAXMNL12A/XSFO/ADL/CT'],
			['sabre', 'amadeus', '120NOVSFOACC¥/*A', 'AD20NOVSFOACC/A*A'],
			['sabre', 'amadeus', '1S20SEPSFOACC12ANYC¥/*S-K', 'AD/20SEPSFOACC12A/XNYC/CK/A*S'],
			['sabre', 'amadeus', '1S20SEPSFOACC12ANYC/AMS¥/*S-K', 'AD/20SEPSFOACC12A/XNYCAMS/CK/A*S'],
			['sabre', 'amadeus', '1*6P', 'AC6P'],
			['sabre', 'amadeus', '1¥5', 'AC5'],
			['sabre', 'amadeus', '1-5', 'AC-5'],
			['sabre', 'amadeus', '1DTW', 'AC/XDTW'],
			['sabre', 'amadeus', '1*C', 'AC'],
			['sabre', 'amadeus', 'WPNCB', 'FXR'],
			['sabre', 'amadeus', 'WPNCS', 'FXL'],
			['sabre', 'amadeus', 'WPNCS¥TC-YB', 'FXL/KM'],
			['sabre', 'amadeus', 'WPNCS¥TC-SB', 'FXL/KW'],
			['sabre', 'amadeus', 'WPNCS¥TC-BB', 'FXL/KC'],
			['sabre', 'amadeus', 'WPNCS¥TC-FB', 'FXL/KF'],
			['sabre', 'amadeus', 'WPPC05¥NCB', 'FXR/RC05'],
			['sabre', 'amadeus', 'WPPC05¥NCS', 'FXL/RC05'],
			['apollo', 'sabre', '$B*ITX/@VKXT5U0', 'WPPITX¥QVKXT5U0'],
			['sabre', 'apollo', 'WPQVKXT5U0¥PITX', '$B/@VKXT5U0/*ITX'],
			['sabre', 'amadeus', '1S20SEPSFOACC12ANYC/AMS¥/*S', 'AD20SEPSFOACC12A/XNYCAMS/A*S'],
			['apollo', 'amadeus', 'A20SEPSFOACC12ANYC.AMS|/*S', 'AD20SEPSFOACC12A/XNYCAMS/A*S'],
			['apollo', 'amadeus', '$B*ITX/@VKXT5U0', 'FXX/RITX/L-VKXT5U0'],
			['apollo', 'amadeus', '$BN1|2*C05', 'FXX/RADT*C05'],
			['apollo', 'amadeus', '$BN1|2*C05|3*INF', 'FXX/RADT*C05*INF'],
			['sabre', 'amadeus', 'WPPITX¥QVKXT5U0', 'FXX/RITX/L-VKXT5U0'],
			['sabre', 'amadeus', 'WPP1ADT/1C05', 'FXX/RADT*C05'],
			['sabre', 'amadeus', 'WPP1ADT/1C05/1INF', 'FXX/RADT*C05*INF'],
			['apollo', 'amadeus', '$BN1|2*C05', 'FXX/RADT*C05'],
			['apollo', 'amadeus', '$BN1|2*C05|3*INF', 'FXX/RADT*C05*INF'],
			['apollo', 'amadeus', '$B:CAD', 'FXX/R,FC-CAD'],
			['apollo', 'amadeus', '$BB:EUR', 'FXA/R,FC-EUR'],
			['apollo', 'amadeus', '$BBA:EUR', 'FXL/R,FC-EUR'],
			['apollo', 'amadeus', '$BB0:EUR', 'FXR/R,FC-EUR'],
			['apollo', 'amadeus', '$BN1|2*C05|3*INF/:EUR', 'FXX/RADT*C05*INF,FC-EUR'],
			['apollo', 'amadeus', '$B*JCB', 'FXX/RJCB'],
			['apollo', 'amadeus', '$B*ITX', 'FXX/RITX'],
			['apollo', 'amadeus', '$BS1|2', 'FXX/S1,2'],
			['apollo', 'amadeus', '$BS1*3|5|6', 'FXX/S1-3,5,6'],
			['apollo', 'amadeus', '$BBS1|2', 'FXA/S1,2'],
			['apollo', 'amadeus', '$BS1|2|5|6/N1|2*C05', 'FXX/S1,2,5,6/RADT*C05'],
			['apollo', 'amadeus', '$BS1|2|5|6/N1|2*C05|3*INF', 'FXX/S1,2,5,6/RADT*C05*INF'],
			['apollo', 'amadeus', '/1/3', 'RS1,3'],
			['apollo', 'amadeus', '/0/3-4', 'RS0,3-4'],
			['sabre', 'amadeus', 'WPP1ADT/1C05', 'FXX/RADT*C05'],
			['sabre', 'amadeus', 'WPP1ADT/1C05/1INF', 'FXX/RADT*C05*INF'],
			['sabre', 'amadeus', 'WPMCAD', 'FXX/R,FC-CAD'],
			['sabre', 'amadeus', 'WPNC¥MEUR', 'FXA/R,FC-EUR'],
			['sabre', 'amadeus', 'WPNCS¥MEUR', 'FXL/R,FC-EUR'],
			['sabre', 'amadeus', 'WPNCB¥MEUR', 'FXR/R,FC-EUR'],
			['sabre', 'amadeus', 'WPP1ADT/1C05/1INF¥MEUR', 'FXX/RADT*C05*INF,FC-EUR'],
			['sabre', 'amadeus', 'WPPJCB', 'FXX/RJCB'],
			['sabre', 'amadeus', 'WPPITX', 'FXX/RITX'],
			['sabre', 'amadeus', 'WPS1/2', 'FXX/S1,2'],
			['sabre', 'amadeus', 'WPS1-3/5/6', 'FXX/S1-3,5,6'],
			['sabre', 'amadeus', 'WPS1/2¥NC', 'FXA/S1,2'],
			['sabre', 'amadeus', 'WPP1ADT/1C05¥S1/2/5/6', 'FXX/RADT*C05/S1,2,5,6'],
			['sabre', 'amadeus', 'WPP1ADT/1C05/1INF¥S1/2/5/6', 'FXX/RADT*C05*INF/S1,2,5,6'],
			['apollo', 'sabre', 'S*AIR/ROYAL AIR MAROC', 'W/-ALROYAL AIR MAROC'],
			['apollo', 'sabre', 'S*AIR.KENYA', 'W/-ALKENYA'],
			['apollo', 'sabre', 'S*AIRL/XL AIRWAYS FRACE', 'W/-ALXL AIRWAYS FRACE'],
			['apollo', 'sabre', 'S*CITY/ACCRA', 'W/-CCACCRA'],
			['apollo', 'sabre', '$BB//@AB/:N', 'WPNC¥PL'],
			['apollo', 'sabre', '$BB//@AB:N', 'WPNC¥PL'],
			['apollo', 'sabre', '$BB//@C/:N', 'WPNC¥TC-BB¥PL'],
			['apollo', 'sabre', '$BB//@C:N', 'WPNC¥TC-BB¥PL'],
			['apollo', 'sabre', '$BB//@W/:N', 'WPNC¥TC-SB¥PL'],
			['apollo', 'sabre', '$BB:A//@C', 'WPNC¥PV¥TC-BB'],
			['apollo', 'sabre', '$BB:EUR//@C', 'WPNC¥MEUR¥TC-BB'],
			['apollo', 'sabre', '$BB:N//@C', 'WPNC¥PL¥TC-BB'],
			['apollo', 'sabre', '* M9GKK4', '*M9GKK4'],
			['apollo', 'sabre', '* MZRD31', '*MZRD31'],
			['apollo', 'sabre', '* RGNH1G', '*RGNH1G'],
			['apollo', 'sabre', '/0/2|1', '/0/2+1'],
			['apollo', 'sabre', '/4/7|8', '/4/7+8'],
			['apollo', 'sabre', '/0/2|3|4', '/0/2+3+4'],
			['apollo', 'sabre', '/4/6|7|8', '/4/6+7+8'],
			['apollo', 'sabre', '/1/3|4|5|6', '/1/3+4+5+6'],
			['apollo', 'sabre', '$BBN1|2*C03/:N', 'WPNC¥P1ADT/1C03¥PL'],
			['apollo', 'sabre', '$BBN1|2*C08/:A', 'WPNC¥P1ADT/1C08¥PV'],
			['apollo', 'sabre', '$BBN1|2*C10/:N', 'WPNC¥P1ADT/1C10¥PL'],
			['apollo', 'sabre', '$BBS1|2|5|6/:N', 'WPNC¥S1/2/5/6¥PL'],
			['apollo', 'sabre', '$BBS1|2/:A', 'WPNC¥S1/2¥PV'],
			['apollo', 'sabre', '$BBS2|3|4|5/:A', 'WPNC¥S2-5¥PV'],
			['apollo', 'sabre', '$BBS3|4/:A', 'WPNC¥S3/4¥PV'],
			['apollo', 'sabre', '$BN1*JCB|2*J08/:A', 'WPP1JCB/1J08¥PV'],
			['apollo', 'sabre', '$BN1*JCB|2*JCB|3*J09/:A', 'WPP2JCB/1J09¥PV'],
			['apollo', 'sabre', '$BN1|2*C02/:N', 'WPP1ADT/1C02¥PL'],
			['apollo', 'sabre', '$BN1|2*C06/:N', 'WPP1ADT/1C06¥PL'],
			['apollo', 'sabre', '$BN1|2*C08|3*INF/:N', 'WPP1ADT/1C08/1INF¥PL'],
			['apollo', 'sabre', '$BN1|2*C09/:A', 'WPP1ADT/1C09¥PV'],
			['apollo', 'sabre', '$BN1|2*C10/:A', 'WPP1ADT/1C10¥PV'],
			['apollo', 'sabre', '$BN1|2*C05/:N', 'WPP1ADT/1C05¥PL'],
			['apollo', 'sabre', '$BN1|2*INF/:N', 'WPP1ADT/1INF¥PL'],
			['apollo', 'sabre', '$BS1|2/:A', 'WPS1/2¥PV'],
			['apollo', 'sabre', '$DV10JULMIAATH17JUL@C', 'FQMIAATH10JUL¥R17JULBB'],
			['apollo', 'sabre', '$DV14AUGDFWBCN31AUG@C', 'FQDFWBCN14AUG¥R31AUGBB'],
			['apollo', 'sabre', '$DV14AUGLAXDEL31AUG//@C', 'FQLAXDEL14AUG¥R31AUGBB'],
			['apollo', 'sabre', '$DV14JULMIAROM24JUL@C', 'FQMIAROM14JUL¥R24JULBB'],
			['apollo', 'sabre', '$DV17JULJFKMNL2AUG//@C', 'FQJFKMNL17JUL¥R2AUGBB'],
			['apollo', 'sabre', '$DV23JULCHIPAR31JUL//@C', 'FQCHIPAR23JUL¥R31JULBB'],
			['apollo', 'sabre', '$DV25DECDFWMAD9JAN//@C', 'FQDFWMAD25DEC¥R9JANBB'],
			['apollo', 'sabre', '$DV25SEPNYCFLR4OCT//@AB', 'FQNYCFLR25SEP¥R4OCT'],
			['apollo', 'sabre', '$DV25SEPNYCFLR4OCT//@C', 'FQNYCFLR25SEP¥R4OCTBB'],
			['apollo', 'sabre', '$DV28AUGMSYCEB28SEP//@C', 'FQMSYCEB28AUG¥R28SEPBB'],
			['apollo', 'sabre', '$DV28FEBLAXHKG8MAY//@W', 'FQLAXHKG28FEB¥R8MAYSB'],
			['apollo', 'sabre', '$DV2OCTPSASIN12OCT@C', 'FQPSASIN2OCT¥R12OCTBB'],
			['apollo', 'sabre', '$DV3JULMIABEY24JUL//@C', 'FQMIABEY3JUL¥R24JULBB'],
			['apollo', 'sabre', '$DV3JULMIABEY24JUL//@C-JCB', 'FQMIABEY3JUL¥R24JULBB¥PJCB'],
			['apollo', 'sabre', '$DV4AUGJFKDEL20AUG@C', 'FQJFKDEL4AUG¥R20AUGBB'],
			['apollo', 'sabre', '$DV6JULNYCATH27JUL//@C', 'FQNYCATH6JUL¥R27JULBB'],
			['apollo', 'sabre', '$DV6JULSFOLON16JUL@C', 'FQSFOLON6JUL¥R16JULBB'],
			['apollo', 'sabre', '$DV6OCTBOSROM20OCT//@W', 'FQBOSROM6OCT¥R20OCTSB'],
			['apollo', 'sabre', '$DV9OCTDFWDXB15OCT//@C', 'FQDFWDXB9OCT¥R15OCTBB'],
			['apollo', 'sabre', '$DV17JULROCMNL2AUG//@W', 'FQROCMNL17JUL¥R2AUGSB'],
			['apollo', 'sabre', '$DV20FEBLAXBCD//@C', 'FQLAXBCD20FEBBB'],
			['apollo', 'sabre', '$DV20FEBLAXBCD8MAR//@C', 'FQLAXBCD20FEB¥R8MARBB'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N1/////01JAN74/M//MAYYI/KYI WAR', '3DOCSA/DB/01JAN74/M/MAYYI/KYI WAR-1.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N1/////10JUN00/M//YE/JEAL MO', '3DOCSA/DB/10JUN00/M/YE/JEAL MO-1.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N1/////15JAN12/F//DAVIS/SARAI AMANI', '3DOCSA/DB/15JAN12/F/DAVIS/SARAI AMANI-1.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N1/////17JUL97/F//MOUZIK/MOUNA M', '3DOCSA/DB/17JUL97/F/MOUZIK/MOUNA M-1.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N1/////18SEP71/M//ROSEN/ANDREW THOMAS', '3DOCSA/DB/18SEP71/M/ROSEN/ANDREW THOMAS-1.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N1/////20JUL83/F//MUTHOKA/JUBILEE JEBET', '3DOCSA/DB/20JUL83/F/MUTHOKA/JUBILEE JEBET-1.1'],
			['apollo', 'sabre', 'ALGACMN12AYUL|AC', '1LGACMN12AYUL¥AC'],
			['apollo', 'sabre', 'ANBOTYS12ADOHPHL|QR.AA', '1NBOTYS12ADOH/PHL¥QRAA'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N1/////22OCT58/F//ME/AH LU', '3DOCSA/DB/22OCT58/F/ME/AH LU-1.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N1/////23NOV61/F//BUCCIVALENTINI/ANDREA MARIE', '3DOCSA/DB/23NOV61/F/BUCCIVALENTINI/ANDREA MARIE-1.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N1/////23OCT81/F//UDOKANG/USENOBONG UDOFIA', '3DOCSA/DB/23OCT81/F/UDOKANG/USENOBONG UDOFIA-1.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N1/////24DEC64/M//SONGELA/JOEL HAMULI', '3DOCSA/DB/24DEC64/M/SONGELA/JOEL HAMULI-1.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N1/////24OCT92/M//ADEDIPE/ABIOLA A', '3DOCSA/DB/24OCT92/M/ADEDIPE/ABIOLA A-1.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N1/////27NOV82/M//WOODSON/TREVOR AARON', '3DOCSA/DB/27NOV82/M/WOODSON/TREVOR AARON-1.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N2/////01MAR16/F//MUTHOKA/THANDIWE TUNENNANDU', '3DOCSA/DB/01MAR16/F/MUTHOKA/THANDIWE TUNENNANDU-2.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N2/////21FEB82/F//MEE/AH SAR', '3DOCSA/DB/21FEB82/F/MEE/AH SAR-2.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N2/////21SEP04/M//ROSEN/NATAN YISHAI', '3DOCSA/DB/21SEP04/M/ROSEN/NATAN YISHAI-2.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N3/////08NOV07/F//FABDELHAMED/MAY M', '3DOCSA/DB/08NOV07/F/FABDELHAMED/MAY M-3.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N4/////15JUN77/F//INGE/KHIN LAY', '3DOCSA/DB/15JUN77/F/INGE/KHIN LAY-4.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N4/////15JUN77/F//NGE/KHIN LAY', '3DOCSA/DB/15JUN77/F/NGE/KHIN LAY-4.1'],
			['apollo', 'sabre', '@:3SSRDOCSYYHK1/N4/////30DEC12/M//FRANCO/EDWARD JULIAN', '3DOCSA/DB/30DEC12/M/FRANCO/EDWARD JULIAN-4.1'],
			['apollo', 'sabre', 'A/L/WASPHC|ET', '1SWASPHC¥ET-L'],
			['apollo', 'sabre', 'A/L/YULLOS|LH', '1SYULLOS¥LH-L'],
			['apollo', 'sabre', 'A/L/CHIGDN|UA.LH', '1SCHIGDN¥UALH-L'],
			['apollo', 'sabre', 'A/R/CKYJFK|DL.AF', '1SCKYJFK¥DLAF-R'],
			['apollo', 'sabre', 'A/X/AMSJFK/D|DL.KL', '1SAMSJFK/N¥DLKL-X'],
			['apollo', 'sabre', 'A/X/HOUNBO|KL.DL.AF', '1SHOUNBO¥KLDLAF-X'],
			['apollo', 'sabre', 'A/L/IADNBO12AADD|ET', '1SIADNBO12AADD¥ET-L'],
			['apollo', 'sabre', 'A/G/4SEPKIVLED7A|9U', '1S4SEPKIVLED7A¥9U-G'],
			['apollo', 'sabre', 'A/S/LGACMN12AYUL|AC', '1SLGACMN12AYUL¥AC-S'],
			['apollo', 'sabre', 'A/T/ABJMIA|DL.KL.AF', '1SABJMIA¥DLKLAF-T'],
			['apollo', 'sabre', 'A/T/ATLSNN12AJFK|DL', '1SATLSNN12AJFK¥DL-T'],
			['apollo', 'sabre', 'A/V/IADAMS12ACDG|KL.DL', '1SIADAMS12ACDG¥KLDL-V'],
			['apollo', 'sabre', 'A/T/20AUGDLAWAS12A|SN.UA', '1S20AUGDLAWAS12A¥SNUA-T'],
			['apollo', 'sabre', 'A/T1/24JULKBPSFO|UA.LH', '1S24JULKBPSFO¥UALH-1T'],
			['apollo', 'sabre', 'ACHIAMS12AMSP|DL', '1CHIAMS12AMSP¥DL'],
			['apollo', 'sabre', 'ACMNLGA12AYUL|AC', '1CMNLGA12AYUL¥AC'],
			['apollo', 'sabre', 'A17JULPHXIAD|UA/D', '117JULPHXIAD/N¥UA'],
			['apollo', 'sabre', 'A20AUGLASSEA|UA/D', '120AUGLASSEA/N¥UA'],
			['apollo', 'sabre', 'A26JUNIADMFE|UA/D', '126JUNIADMFE/N¥UA'],
			['apollo', 'sabre', 'A28AUGDUBLAX|AA/D', '128AUGDUBLAX/N¥AA'],
			['apollo', 'sabre', 'A3AUGFIHCLT12A|UA', '13AUGFIHCLT12A¥UA'],
			['apollo', 'sabre', 'N:BONA/AGNES DELA PENA', '-BONA/AGNES DELA PENA'],
			['apollo', 'sabre', 'N:DEL PIZZO/ALPHONSE BENITO', '-DEL PIZZO/ALPHONSE BENITO'],
			['apollo', 'sabre', 'N:GYEKE ABOAGYE/ADOM JAMAL*P-C08', '-GYEKE ABOAGYE/ADOM JAMAL*P-C08'],
			['apollo', 'sabre', 'N:GYEKE ABOAGYE/GEORGE', '-GYEKE ABOAGYE/GEORGE'],
			['apollo', 'sabre', 'N:GYEKE ABOAGYE/LAURA', '-GYEKE ABOAGYE/LAURA'],
			['apollo', 'sabre', 'N:GYEKE ABOAGYE/SAMUEL*P-C05', '-GYEKE ABOAGYE/SAMUEL*P-C05'],
			['apollo', 'sabre', 'N:LEEMASTER/MICHELLE ANN N', '-LEEMASTER/MICHELLE ANN N'],
			['apollo', 'sabre', 'N:TOURE/ABOUBACAR SIDIK MORITIE', '-TOURE/ABOUBACAR SIDIK MORITIE'],
			['apollo', 'sabre', '01X4X5U6GK', '01X4X5U6GK'],
			['apollo', 'sabre', '01Y1Y2GK', '01Y1Y2GK'],
			['apollo', 'sabre', '01Y5GK', '01Y5GK'],
			['apollo', 'sabre', '05L1R2GK', '05L1R2GK'],
			['apollo', 'sabre', 'T:$BN1*JCB|2*JCB|3*JCB|4*JCB|5*J03/:A', 'WPRQ¥P4JCB/1J03¥PV'],
			['apollo', 'sabre', 'T:$BN1|2*INF/:A', 'WPRQ¥P1ADT/1INF¥PV'],
			['apollo', 'sabre', '$B*JCB/:A', 'WPPJCB¥PV'],
			['apollo', 'sabre', '$BB*JCB//@C', 'WPNC¥PJCB¥TC-BB'],
			['apollo', 'sabre', '$BB*JCB/:N', 'WPNC¥PJCB¥PL'],
			['apollo', 'sabre', '$BB/*JCB', 'WPNC¥PJCB'],
			['apollo', 'sabre', '$BBA*JCB//@C', 'WPNCS¥PJCB¥TC-BB'],
			['apollo', 'sabre', '$BBA/*JCB', 'WPNCS¥PJCB'],
			['apollo', 'sabre', 'N: EMUKA /SAM', '-EMUKA/SAM'],
			['apollo', 'sabre', 'N: EMUKA/PHILLIS', '-EMUKA/PHILLIS'],
			['apollo', 'sabre', 'N: FLANNERY/ COURTNEY', '-FLANNERY/COURTNEY'],
			['apollo', 'sabre', 'N: LEEMASTER/MICHELLE ANN', '-LEEMASTER/MICHELLE ANN'],
			['apollo', 'sabre', 'N: MILLER/TOMMY LAMONT', '-MILLER/TOMMY LAMONT'],
			['apollo', 'sabre', 'N:EMUKA /CHRISTINE O', '-EMUKA/CHRISTINE O'],
			['apollo', 'sabre', 'N:MEPOSSI NOUTCHA/GILLES  CONSTANT', '-MEPOSSI NOUTCHA/GILLES CONSTANT'],
			['apollo', 'sabre', 'N:MWAMTOBE/TUMPE   ULINYELUSYA', '-MWAMTOBE/TUMPE ULINYELUSYA'],
			['apollo', 'sabre', '$BB*ITX', 'WPNC¥PITX'],
			['apollo', 'sabre', '$BBA//@C/*JCB', 'WPNCS¥TC-BB¥PJCB'],
			['apollo', 'sabre', '$BB//@C/*JCB', 'WPNC¥TC-BB¥PJCB'],
			['apollo', 'sabre', 'T:$B*JCB/:A', 'WPRQ¥PJCB¥PV'],
			['apollo', 'sabre', 'A/T/EWRYYZ', '1SEWRYYZ-T'],
			['apollo', 'sabre', 'A/L/15JULYULACC12AYYZBRU', '1S15JULYULACC12AYYZ/BRU-L'],
			['apollo', 'sabre', 'A/N/1JULATLROB12ADTWAMS', '1S1JULATLROB12ADTW/AMS-N'],
			['apollo', 'sabre', 'XX 626.60|677.76', 'T\u00A4626.60+677.76'],
			['apollo', 'sabre', 'XX470.26 |200', 'T\u00A4470.26+200'],
			['sabre', 'apollo', 'T\u00A41187¥116', 'XX1187|116'],
			['sabre', 'apollo', 'T\u00A4123.55¥59.92', 'XX123.55|59.92'],
			['sabre', 'apollo', 'T\u00A4196.80¥439.20', 'XX196.80|439.20'],
			['sabre', 'apollo', 'T\u00A42857.06¥189.70', 'XX2857.06|189.70'],
			['sabre', 'apollo', 'T\u00A4389.10¥596.76', 'XX389.10|596.76'],
			['apollo', 'sabre', 'X1-2/01Y|2K', 'WC1Y/2K'],
			['apollo', 'sabre', 'X4-5/04R|5L', 'WC4R/5L'],
			['apollo', 'sabre', 'X1-3/01L|2V|3V', 'WC1L/2V/3V'],

			['apollo', 'sabre', 'X1-2/01K', null], // no need to translate
			['apollo', 'sabre', 'X6-8/08K', null], // no need to translate
			['apollo', 'sabre', 'X1-3/03K', null], // no need to translate
			['apollo', 'sabre', 'X1|4-6/0Y', 'WC1Y/4-6Y'],
			['apollo', 'sabre', 'X6|8-11/0Y', 'WC6Y/8-11Y'],
			['sabre', 'apollo', 'WC1Y/3-4Y', 'X1|3-4/0Y'],
			['sabre', 'amadeus', 'WC1Y/3-4Y', 'SBY1,3-4'],
			['apollo', 'amadeus', 'X1|3-4/0Y', 'SBY1,3-4'],
			['apollo', 'sabre', 'X1|3-4/0Y', 'WC1Y/3-4Y'],
			['apollo', 'sabre', 'X2/01X2', 'X2¥01X2'],
			['apollo', 'sabre', 'X3|4/01K1*', 'X3/4¥01K1*'],
			['apollo', 'sabre', 'X1/01S1', 'X1¥01S1'],
			['apollo', 'sabre', 'X1|2/01Z1K2', 'X1/2¥01Z1K2'],
			['apollo', 'sabre', 'X1-2/01Z1K2', 'X1-2¥01Z1K2'],
			['apollo', 'sabre', 'X1|2/01Z1*', 'X1/2¥01Z1*'],
			['apollo', 'sabre', 'X1-2/01Z1*', 'X1-2¥01Z1*'],
			['apollo', 'sabre', 'X1/01Z1', 'X1¥01Z1'],
			['sabre', 'apollo', 'X1/2¥01Z1K2', 'X1|2/01Z1K2'],
			['sabre', 'apollo', 'X1-2¥01Z1K2', 'X1-2/01Z1K2'],
			['sabre', 'apollo', 'X1/2¥01Z1*', 'X1|2/01Z1*'],
			['sabre', 'apollo', 'X1-2¥01Z1*', 'X1-2/01Z1*'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:OW', 'FQDKIVRIX/20SEP/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX|PS|TK|LO:OW', 'FQDKIVRIX/20SEP/APS,TK,LO/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:OW|PS|TK|LO', 'FQDKIVRIX/20SEP/APS,TK,LO/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:OW@Y', 'FQDKIVRIX/20SEP/KM/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@Y:OW', 'FQDKIVRIX/20SEP/KM/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:OW@W', 'FQDKIVRIX/20SEP/KW/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@W:OW', 'FQDKIVRIX/20SEP/KW/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:OW@C', 'FQDKIVRIX/20SEP/KC/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@C:OW', 'FQDKIVRIX/20SEP/KC/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:OW@F', 'FQDKIVRIX/20SEP/KF/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@F:OW', 'FQDKIVRIX/20SEP/KF/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX|PS|TK|LO:RT', 'FQDKIVRIX/20SEP/APS,TK,LO/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:RT|PS|TK|LO', 'FQDKIVRIX/20SEP/APS,TK,LO/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:RT@Y', 'FQDKIVRIX/20SEP/KM/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@Y:RT', 'FQDKIVRIX/20SEP/KM/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:RT@W', 'FQDKIVRIX/20SEP/KW/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@W:RT', 'FQDKIVRIX/20SEP/KW/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:RT@C', 'FQDKIVRIX/20SEP/KC/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@C:RT', 'FQDKIVRIX/20SEP/KC/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:RT@F', 'FQDKIVRIX/20SEP/KF/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@F:RT', 'FQDKIVRIX/20SEP/KF/IR'],
			['apollo', 'amadeus', '$DV20SEPKIVRIX05JUL', 'FQDKIVRIX/20SEP*05JUL'],
			['apollo', 'amadeus', '$D20SEPKIVRIX|PS|TK|LO', 'FQDKIVRIX/20SEP/APS,TK,LO'],
			['apollo', 'amadeus', '$DV20SEPKIVRIX05JUL|PS|TK|LO', 'FQDKIVRIX/20SEP*05JUL/APS,TK,LO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@Y', 'FQDKIVRIX/20SEP/KM'],
			['apollo', 'amadeus', '$D20SEPKIVRIX|9U|PS@Y', 'FQDKIVRIX/20SEP/KM/A9U,PS'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@Y|9U|PS', 'FQDKIVRIX/20SEP/KM/A9U,PS'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@W', 'FQDKIVRIX/20SEP/KW'],
			['apollo', 'amadeus', '$D20SEPKIVRIX|9U|PS@W', 'FQDKIVRIX/20SEP/KW/A9U,PS'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@W|9U|PS', 'FQDKIVRIX/20SEP/KW/A9U,PS'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@C', 'FQDKIVRIX/20SEP/KC'],
			['apollo', 'amadeus', '$D20SEPKIVRIX|9U|PS@C', 'FQDKIVRIX/20SEP/KC/A9U,PS'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@C|9U|PS', 'FQDKIVRIX/20SEP/KC/A9U,PS'],
			['apollo', 'amadeus', '$D20SEPKIVRIX|9U|PS@F', 'FQDKIVRIX/20SEP/KF/A9U,PS'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@F|9U|PS', 'FQDKIVRIX/20SEP/KF/A9U,PS'],
			['sabre', 'amadeus', 'FQKIVRIX20SEP¥OW', 'FQDKIVRIX/20SEP/IO'],
			['sabre', 'amadeus', 'FQKIVRIX20SEP-PS-TK-LO¥OW', 'FQDKIVRIX/20SEP/APS,TK,LO/IO'],
			['sabre', 'amadeus', 'FQKIVRIX20SEP¥OW-PS-TK-LO', 'FQDKIVRIX/20SEP/APS,TK,LO/IO'],
			['sabre', 'amadeus', 'FQKIVRIX20SEPYB¥OW', 'FQDKIVRIX/20SEP/KM/IO'],
			['sabre', 'amadeus', 'FQKIVRIX20SEPSB¥OW', 'FQDKIVRIX/20SEP/KW/IO'],
			['sabre', 'amadeus', 'FQKIVRIX20SEPBB¥OW', 'FQDKIVRIX/20SEP/KC/IO'],
			['sabre', 'amadeus', 'FQKIVRIX20SEPFB¥OW', 'FQDKIVRIX/20SEP/KF/IO'],
			['sabre', 'amadeus', 'FQKIVRIX20SEP-PS-TK-LO¥RT', 'FQDKIVRIX/20SEP/APS,TK,LO/IR'],
			['sabre', 'amadeus', 'FQKIVRIX20SEP¥RT-PS-TK-LO', 'FQDKIVRIX/20SEP/APS,TK,LO/IR'],
			['sabre', 'amadeus', 'FQKIVRIX20SEPYB¥RT', 'FQDKIVRIX/20SEP/KM/IR'],
			['sabre', 'amadeus', 'FQKIVRIX20SEPSB¥RT', 'FQDKIVRIX/20SEP/KW/IR'],
			['sabre', 'amadeus', 'FQKIVRIX20SEPBB¥RT', 'FQDKIVRIX/20SEP/KC/IR'],
			['sabre', 'amadeus', 'FQKIVRIX20SEPFB¥RT', 'FQDKIVRIX/20SEP/KF/IR'],
			['sabre', 'amadeus', 'FQKIVRIX20SEP¥R05JUL', 'FQDKIVRIX/20SEP*05JUL'],
			['sabre', 'amadeus', 'FQKIVRIX20SEP-PS-TK-LO', 'FQDKIVRIX/20SEP/APS,TK,LO'],
			['sabre', 'amadeus', 'FQKIVRIX20SEP¥R05JUL-PS-TK-LO', 'FQDKIVRIX/20SEP*05JUL/APS,TK,LO'],
			['sabre', 'amadeus', 'FQKIVRIX20SEPYB', 'FQDKIVRIX/20SEP/KM'],
			['sabre', 'amadeus', 'FQKIVRIX20SEPYB-9U-PS', 'FQDKIVRIX/20SEP/KM/A9U,PS'],
			['sabre', 'amadeus', 'FQKIVRIX20SEPSB', 'FQDKIVRIX/20SEP/KW'],
			['sabre', 'amadeus', 'FQKIVRIX20SEPSB-9U-PS', 'FQDKIVRIX/20SEP/KW/A9U,PS'],
			['sabre', 'amadeus', 'FQKIVRIX20SEPBB', 'FQDKIVRIX/20SEP/KC'],
			['sabre', 'amadeus', 'FQKIVRIX20SEPBB-9U-PS', 'FQDKIVRIX/20SEP/KC/A9U,PS'],
			['sabre', 'amadeus', 'FQKIVRIX20SEPFB', 'FQDKIVRIX/20SEP/KF'],
			['sabre', 'amadeus', 'FQKIVRIX20SEPFB-9U-PS', 'FQDKIVRIX/20SEP/KF/A9U,PS'],
			['sabre', 'amadeus', 'FQ12MAR17NYCMNL28NOV17-DL', 'FQDNYCMNL/28NOV17/R,12MAR17/ADL'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/IO', '$D20SEPKIVRIX:OW'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/APS,TK,LO/IO', '$D20SEPKIVRIX|PS|TK|LO:OW'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/IO/APS,TK,LO', '$D20SEPKIVRIX:OW|PS|TK|LO'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/IO/KM', '$D20SEPKIVRIX:OW@Y'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/KM/IO', '$D20SEPKIVRIX@Y:OW'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/IO/KW', '$D20SEPKIVRIX:OW@W'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/KW/IO', '$D20SEPKIVRIX@W:OW'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/IO/KC', '$D20SEPKIVRIX:OW@C'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/KC/IO', '$D20SEPKIVRIX@C:OW'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/IO/KF', '$D20SEPKIVRIX:OW@F'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/KF/IO', '$D20SEPKIVRIX@F:OW'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/APS,TK,LO/IR', '$D20SEPKIVRIX|PS|TK|LO:RT'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/IR/APS,TK,LO', '$D20SEPKIVRIX:RT|PS|TK|LO'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/IR/KM', '$D20SEPKIVRIX:RT@Y'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/KM/IR', '$D20SEPKIVRIX@Y:RT'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/IR/KW', '$D20SEPKIVRIX:RT@W'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/KW/IR', '$D20SEPKIVRIX@W:RT'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/IR/KC', '$D20SEPKIVRIX:RT@C'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/KC/IR', '$D20SEPKIVRIX@C:RT'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/IR/KF', '$D20SEPKIVRIX:RT@F'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/KF/IR', '$D20SEPKIVRIX@F:RT'],
			['amadeus', 'apollo', 'FQDKIVRIX/D10SEP*25JUL', '$DV10SEPKIVRIX25JUL'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP*05JUL/APS,TK,LO', '$DV20SEPKIVRIX05JUL|PS|TK|LO'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/KM', '$D20SEPKIVRIX@Y'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/A9U,PS/KM', '$D20SEPKIVRIX|9U|PS@Y'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/KM/A9U,PS', '$D20SEPKIVRIX@Y|9U|PS'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/A9U,PS/KW', '$D20SEPKIVRIX|9U|PS@W'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/KW/A9U,PS', '$D20SEPKIVRIX@W|9U|PS'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/KC', '$D20SEPKIVRIX@C'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/A9U,PS/KC', '$D20SEPKIVRIX|9U|PS@C'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/KC/A9U,PS', '$D20SEPKIVRIX@C|9U|PS'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/A9U,PS/KF', '$D20SEPKIVRIX|9U|PS@F'],
			['amadeus', 'apollo', 'FQDKIVRIX/D20SEP/KF/A9U,PS', '$D20SEPKIVRIX@F|9U|PS'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/IO', 'FQKIVRIX20SEP¥OW'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/APS,TK,LO/IO', 'FQKIVRIX20SEP-PS-TK-LO¥OW'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/IO/APS,TK,LO', 'FQKIVRIX20SEP-PS-TK-LO¥OW'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/IO/KM', 'FQKIVRIX20SEPYB¥OW'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/KM/IO', 'FQKIVRIX20SEPYB¥OW'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/IO/KW', 'FQKIVRIX20SEPSB¥OW'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/KW/IO', 'FQKIVRIX20SEPSB¥OW'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/IO/KC', 'FQKIVRIX20SEPBB¥OW'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/KC/IO', 'FQKIVRIX20SEPBB¥OW'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/IO/KF', 'FQKIVRIX20SEPFB¥OW'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/KF/IO', 'FQKIVRIX20SEPFB¥OW'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/APS,TK,LO/IR', 'FQKIVRIX20SEP-PS-TK-LO¥RT'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/IR/APS,TK,LO', 'FQKIVRIX20SEP-PS-TK-LO¥RT'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/IR/KM', 'FQKIVRIX20SEPYB¥RT'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/KM/IR', 'FQKIVRIX20SEPYB¥RT'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/IR/KW', 'FQKIVRIX20SEPSB¥RT'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/KW/IR', 'FQKIVRIX20SEPSB¥RT'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/IR/KC', 'FQKIVRIX20SEPBB¥RT'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/KC/IR', 'FQKIVRIX20SEPBB¥RT'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/IR/KF', 'FQKIVRIX20SEPFB¥RT'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/KF/IR', 'FQKIVRIX20SEPFB¥RT'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP*05JUL', 'FQKIVRIX20SEP¥R05JUL'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/APS,TK,LO', 'FQKIVRIX20SEP-PS-TK-LO'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP*05JUL/APS,TK,LO', 'FQKIVRIX20SEP¥R05JUL-PS-TK-LO'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/KM', 'FQKIVRIX20SEPYB'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/A9U,PS/KM', 'FQKIVRIX20SEPYB-9U-PS'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/KM/A9U,PS', 'FQKIVRIX20SEPYB-9U-PS'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/KW', 'FQKIVRIX20SEPSB'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/A9U,PS/KW', 'FQKIVRIX20SEPSB-9U-PS'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/KW/A9U,PS', 'FQKIVRIX20SEPSB-9U-PS'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/KC', 'FQKIVRIX20SEPBB'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/A9U,PS/KC', 'FQKIVRIX20SEPBB-9U-PS'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/KC/A9U,PS', 'FQKIVRIX20SEPBB-9U-PS'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/KF', 'FQKIVRIX20SEPFB'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/A9U,PS/KF', 'FQKIVRIX20SEPFB-9U-PS'],
			['amadeus', 'sabre', 'FQDKIVRIX/D20SEP/KF/A9U,PS', 'FQKIVRIX20SEPFB-9U-PS'],
			['amadeus', 'sabre', 'FQDNYCMNL/D28NOV17/R,12MAR17/ADL', 'FQ12MAR17NYCMNL28NOV17-DL'],
			['apollo', 'amadeus', 'SA', 'JMA'],
			['apollo', 'amadeus', 'SB', 'JMB'],
			['amadeus', 'apollo', 'JMA', 'SA'],
			['amadeus', 'apollo', 'JMB', 'SB'],
			['amadeus', 'sabre', 'JMA', '\u00A4A'],
			['amadeus', 'sabre', 'JMB', '\u00A4B'],
			['sabre', 'amadeus', '\u00A4A', 'JMA'],
			['sabre', 'amadeus', '\u00A4B', 'JMB'],
			['amadeus', 'apollo', 'AD20NOVJFKLOS', 'A20NOVJFKLOS'],
			['amadeus', 'apollo', 'AD20SEPNYCSFO12A/XMSP/AUA,AA,DL', 'A20SEPNYCSFO12AMSP|UA.AA.DL'],
			['amadeus', 'apollo', 'AD20SEPNYCSFO12A/XMSPCHI/AUA,AA,DL', 'A20SEPNYCSFO12AMSP.CHI|UA.AA.DL'],
			['amadeus', 'apollo', 'AD20NOVKIVRIX/ABT', 'A20NOVKIVRIX|BT'],
			['amadeus', 'apollo', 'AD20NOVKIVRIX/ABT,PS', 'A20NOVKIVRIX|BT.PS'],
			['amadeus', 'apollo', '1S7AD11SEPKIVMOW', 'L@S7/A11SEPKIVMOW'],
			['amadeus', 'apollo', '1S7AD15SEPKIVMOW12A', 'L@S7/A15SEPKIVMOW12A'],
			['amadeus', 'apollo', 'AD20NOVKIVRIX/A-9U,BT,SU', 'A20NOVKIVRIX-9U.BT.SU'],
			['amadeus', 'apollo', 'AD20SEPLAXMNL/ADL/CT', 'A/T/20SEPLAXMNL|DL'],
			['amadeus', 'apollo', 'AD/17JULSFOJNB/ADL/CU/B8', 'A/U8/17JULSFOJNB|DL'],
			['amadeus', 'apollo', 'AD/20SEPLAXMNL12A/XSFO/ADL/CT', 'A/T/20SEPLAXMNL12ASFO|DL'],
			['amadeus', 'apollo', 'AD/20SEPLAXMNL12A/XSFO/ADL/CT/B8', 'A/T8/20SEPLAXMNL12ASFO|DL'],
			['amadeus', 'apollo', 'AD20NOVSFOACC/A*A', 'A20NOVSFOACC|/*A'],
			['amadeus', 'apollo', 'AD20SEPSFOACC12A/XNYC/A*S', 'A20SEPSFOACC12ANYC|/*S'],
			['amadeus', 'apollo', 'AD20SEPSFOACC12A/XNYC/CK/A*S', 'A/K/20SEPSFOACC12ANYC|/*S'],
			['amadeus', 'apollo', 'AD20SEPSFOACC12A/XNYCAMS/A*S', 'A20SEPSFOACC12ANYC.AMS|/*S'],
			['amadeus', 'apollo', 'AD20SEPSFOACC12A/XNYCAMS/CK/A*S', 'A/K/20SEPSFOACC12ANYC.AMS|/*S'],
			['amadeus', 'apollo', 'MD', 'MR'],
			['amadeus', 'apollo', 'MU', 'MU'],
			['amadeus', 'apollo', 'MO', 'A*R'],
			['amadeus', 'apollo', 'AC22NOV', 'A*22NOV'],
			['amadeus', 'apollo', 'AC6P', 'A*6P'],
			['amadeus', 'apollo', 'AC5', 'A*|5'],
			['amadeus', 'apollo', 'AC-5', 'A*-5'],
			['amadeus', 'apollo', 'AC/XDTW', 'A*XDTW'],
			['amadeus', 'apollo', 'ACR25JUN', 'A*O25JUN'],
			['amadeus', 'apollo', 'AC/ADL', 'A*|DL'],
			['amadeus', 'apollo', 'AC/A-UA', 'A*-UA'],
			['amadeus', 'apollo', 'AC/ADL,SU', 'A*|DL.SU'],
			['amadeus', 'apollo', 'AC/A-UA,BT,PS', 'A*-UA.BT.PS'],
			['amadeus', 'apollo', 'RT', '*R'],
			['amadeus', 'apollo', 'FXX', '$B'],
			['amadeus', 'apollo', 'FXA', '$BB'],
			['amadeus', 'apollo', 'FXR', '$BB0'],
			['amadeus', 'apollo', 'FXL', '$BBA'],
			['amadeus', 'apollo', 'FXA/KM', '$BB//@Y'],
			['amadeus', 'apollo', 'FXL/KM', '$BBA//@Y'],
			['amadeus', 'apollo', 'FXA/KW', '$BB//@W'],
			['amadeus', 'apollo', 'FXL/KW', '$BBA//@W'],
			['amadeus', 'apollo', 'FXA/KC', '$BB//@C'],
			['amadeus', 'apollo', 'FXL/KC', '$BBA//@C'],
			['amadeus', 'apollo', 'FXA/KF', '$BB//@F'],
			['amadeus', 'apollo', 'FXL/KF', '$BBA//@F'],
			['amadeus', 'apollo', 'FXA/K', '$BB//@AB'],
			['amadeus', 'apollo', 'FXL/K', '$BBA//@AB'],
			['amadeus', 'apollo', 'FXA/R,P', '$BB:N'],
			['amadeus', 'apollo', 'FXA/R,P', '$BB:N'],
			['amadeus', 'apollo', 'FXA/R,U', '$BB:A'],
			['amadeus', 'apollo', 'FXA/R,U', '$BB:A'],
			['amadeus', 'apollo', 'FXX/R,P', '$B:N'],
			['amadeus', 'apollo', 'FXX/R,U', '$B:A'],
			['amadeus', 'apollo', 'FXX/RC05', '$B*C05/ACC'],
			['amadeus', 'apollo', 'FXA/RC05', '$BB*C05/ACC'],
			['amadeus', 'apollo', 'FXR/RC05', '$BB0*C05/ACC'],
			['amadeus', 'apollo', 'FXL/RC05', '$BBA*C05/ACC'],
			['amadeus', 'apollo', 'FXX/L-Q1LEP4', '$B@Q1LEP4'],
//['amadeus', 'apollo', 'FXX/L-Q1LEP4/RJCB', '$B*JCB/@Q1LEP4'],
//['amadeus', 'apollo', 'FXX/L-Q1LEP4/RITX', '$B*ITX/@Q1LEP4'],
			['amadeus', 'apollo', 'FXX/R,FC-CAD', '$B:CAD'],
			['amadeus', 'apollo', 'FXA/R,FC-CAD', '$BB:CAD'],
			['amadeus', 'apollo', 'FXL/R,FC-CAD', '$BBA:CAD'],
			['amadeus', 'apollo', 'FXR/R,FC-CAD', '$BB0:CAD'],
			['amadeus', 'apollo', 'FXX/RADT*CNN*IN,FC-EUR', '$BN1*ADT|2*CNN|3*INF/:EUR'],
			['amadeus', 'apollo', 'FXX/RADT*C05', '$BN1*ADT|2*C05'],
			['amadeus', 'apollo', 'FXX/RADT*C05*INF', '$BN1*ADT|2*C05|3*INF'],
			['amadeus', 'apollo', 'FXX/RJCB', '$B*JCB'],
			['amadeus', 'apollo', 'FXA/R,U', '$BB:A'],
			['amadeus', 'apollo', 'FXR/R,U', '$BB0:A'],
			['amadeus', 'apollo', 'FXL/R,U', '$BBA:A'],
			['amadeus', 'apollo', 'FXX/RJCB*J05', '$BN1*JCB|2*J05'],
			['amadeus', 'apollo', 'FXX/RITX', '$B*ITX'],
			['amadeus', 'apollo', 'FXA/R,U', '$BB:A'],
			['amadeus', 'apollo', 'FXR/R,U', '$BB0:A'],
			['amadeus', 'apollo', 'FXL/R,U', '$BBA:A'],
			['amadeus', 'apollo', 'FXX/S1,2', '$BS1|2'],
			['amadeus', 'apollo', 'FXX/S1-3,5,6', '$BS1*3|5|6'],
			['amadeus', 'apollo', 'FXA/S1,2', '$BBS1|2'],
			['amadeus', 'apollo', 'FXA/S1-3,5,6', '$BBS1*3|5|6'],
			['amadeus', 'apollo', 'FXL/S1,2', '$BBAS1|2'],
			['amadeus', 'apollo', 'FXL/S1-3,5,6', '$BBAS1*3|5|6'],
			['amadeus', 'apollo', 'FXX/RADT*CH/S1,2,5,6', '$BN1*ADT|2*CNN/S1|2|5|6'],
			['amadeus', 'apollo', 'FXX/RADT*CH*IN/S1,2,5,6', '$BN1*ADT|2*CNN|3*INF/S1|2|5|6'],
			['amadeus', 'apollo', 'SS2Y1', '02Y1*'],
			['amadeus', 'apollo', 'SBY', 'XA/0Y'],
			['amadeus', 'apollo', 'SBY1', 'X1/0Y'],
			['amadeus', 'apollo', 'SBY1-2', 'X1-2/0Y'],
			['amadeus', 'apollo', 'SB12JUL3', 'X3/012JUL'],
			['amadeus', 'apollo', 'SB12JUL1,2', 'X1-2/012JUL'],
			['amadeus', 'apollo', 'XE1', 'X1'],
			['amadeus', 'apollo', 'XE1,3,5', 'X1|3|5'],
			['amadeus', 'apollo', 'XE3-5', 'X3-5'],
			['amadeus', 'apollo', 'XE1-2,5-7', 'X1-2|5-7'],
			['amadeus', 'apollo', 'RS1,3', '/1/3'],
			['amadeus', 'apollo', 'RS0,3-4', '/0/3-4'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP', '$D20SEPKIVRIX'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/IO', '$D20SEPKIVRIX:OW'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/APS,TK,LO/IO', '$D20SEPKIVRIX|PS|TK|LO:OW'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/IO/APS,TK,LO', '$D20SEPKIVRIX:OW|PS|TK|LO'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/IO/KM', '$D20SEPKIVRIX:OW@Y'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/KM/IO', '$D20SEPKIVRIX@Y:OW'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/IO/KW', '$D20SEPKIVRIX:OW@W'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/KW/IO', '$D20SEPKIVRIX@W:OW'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/IO/KC', '$D20SEPKIVRIX:OW@C'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/KC/IO', '$D20SEPKIVRIX@C:OW'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/IO/KF', '$D20SEPKIVRIX:OW@F'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/KF/IO', '$D20SEPKIVRIX@F:OW'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/APS,TK,LO/IR', '$D20SEPKIVRIX|PS|TK|LO:RT'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/IR/APS,TK,LO', '$D20SEPKIVRIX:RT|PS|TK|LO'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/IR/KM', '$D20SEPKIVRIX:RT@Y'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/KM/IR', '$D20SEPKIVRIX@Y:RT'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/IR/KW', '$D20SEPKIVRIX:RT@W'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/KW/IR', '$D20SEPKIVRIX@W:RT'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/IR/KC', '$D20SEPKIVRIX:RT@C'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/KC/IR', '$D20SEPKIVRIX@C:RT'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/IR/KF', '$D20SEPKIVRIX:RT@F'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/KF/IR', '$D20SEPKIVRIX@F:RT'],
			['amadeus', 'apollo', 'FQDKIVRIX/10JUL*25JUL', '$DV10JULKIVRIX25JUL'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/APS,TK,LO', '$D20SEPKIVRIX|PS|TK|LO'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP*05JUL/APS,TK,LO', '$DV20SEPKIVRIX05JUL|PS|TK|LO'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/KM', '$D20SEPKIVRIX@Y'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/A9U,PS/KM', '$D20SEPKIVRIX|9U|PS@Y'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/KM/A9U,PS', '$D20SEPKIVRIX@Y|9U|PS'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/KW', '$D20SEPKIVRIX@W'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/A9U,PS/KW', '$D20SEPKIVRIX|9U|PS@W'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/KW/A9U,PS', '$D20SEPKIVRIX@W|9U|PS'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/KC', '$D20SEPKIVRIX@C'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/A9U,PS/KC', '$D20SEPKIVRIX|9U|PS@C'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/KC/A9U,PS', '$D20SEPKIVRIX@C|9U|PS'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/KF', '$D20SEPKIVRIX@F'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/A9U,PS/KF', '$D20SEPKIVRIX|9U|PS@F'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/KC/A9U,PS', '$D20SEPKIVRIX@C|9U|PS'],
			['amadeus', 'apollo', 'FQDNYCMNL/28NOV17/R,12MAR17/ADL', '$DNYCMNL28NOV17T12MAR17|DL'],
			['amadeus', 'apollo', 'FQDC/APS', '$D|PS'],
			['amadeus', 'apollo', 'FQDC/MUC', '$DDMUC'],
			['amadeus', 'apollo', 'FQN1', '$V1'],
			['amadeus', 'apollo', 'FQR1', '$LR1'],
			['amadeus', 'apollo', 'RT/SMITH', '**-SMITH'],
			['amadeus', 'apollo', 'RT/SMITH/AMY', '**-SMITH/AMY'],
			['amadeus', 'apollo', 'RTABC123', '*ABC123'],
			['amadeus', 'apollo', 'RT3', '*3'],
			['amadeus', 'apollo', 'TKTL1NOV', 'T:TAU/1NOV'],
			['amadeus', 'apollo', '5/TL24MAY', 'C:T:TAU/24MAY'],
			['amadeus', 'apollo', 'XE5', 'X5'],
			['amadeus', 'apollo', 'RF STAS', 'R:STAS'],
			['amadeus', 'apollo', 'ER', 'ER'],
			['amadeus', 'apollo', 'SRDOCSYYHK1-----05MAR90-F--SMITH-JOHN/P1', '@:3SSRDOCSYYHK1/N1/////05MAR90/F//SMITH/JOHN'],
			['amadeus', 'apollo', 'SRDOCSYYHK1-----05MAR90-FI--SMITH-JOHN/P1', '@:3SSRDOCSYYHK1/N1/////05MAR90/FI//SMITH/JOHN'],
			['amadeus', 'apollo', 'XE32-39', 'X32-39'],
			['amadeus', 'apollo', 'RMS1 985.00 N1 720.00 F1 500.00', '@:5S1 985.00 N1 720.00 F1 500.00'],
			['amadeus', 'apollo', 'AP SFO 800-750-2238-A', 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT'],
			['amadeus', 'apollo', 'TWD', '*HTE'],
			['amadeus', 'apollo', 'TWD/L1', '*TE1'],
			['amadeus', 'apollo', 'FXP', 'T:$B'],
			['amadeus', 'apollo', 'TQT', '*LF'],
			['amadeus', 'apollo', 'ERK', '.IHK'],
			['amadeus', 'apollo', 'RM PLEASE CONTACT PAX', '@:5 PLEASE CONTACT PAX'],
			['amadeus', 'apollo', 'RU1AHK1MIA12JAN/RETENTION', null],
			['amadeus', 'apollo', 'DACDEN', 'S*CTY/DEN'],
			['amadeus', 'apollo', 'DNASU', 'S*AIR/SU'],
			['amadeus', 'apollo', 'DNE767', 'HELP 767'],
			['amadeus', 'apollo', 'JD', 'OP/W*'],
			['amadeus', 'apollo', 'RTSVC', '*SVC'],
			['amadeus', 'apollo', 'IG', '!aliasDoubleIgnore'],
			['amadeus', 'apollo', 'IR', 'IR'],
			['amadeus', 'apollo', 'DMI', '@MT'],
			['amadeus', 'apollo', 'JMA', 'SA'],
			['amadeus', 'apollo', 'MD', 'MR'],
			['amadeus', 'apollo', 'SBY1,3-5', 'X1|3-5/0Y'],
			['amadeus', 'apollo', 'SBY1,2,5', 'X1|2|5/0Y'],
			['amadeus', 'apollo', 'FQS6/ADL', '$LB6/DL'],
			['amadeus', 'apollo', 'NM1SMITH/JOHN', 'N:SMITH/JOHN'],
			['amadeus', 'apollo', 'NM1SMITH/JOHN PAUL', 'N:SMITH/JOHN PAUL'],
			['amadeus', 'apollo', 'NM1SMITH/JOHN (C07)', 'N:SMITH/JOHN*P-C07'],
			['amadeus', 'apollo', 'NM1SMITH/JOHN PAUL (C07)', 'N:SMITH/JOHN PAUL*P-C07'],
			['amadeus', 'apollo', 'JUM/O-AMSXY2100', 'SEM/AMSXY2100/AG'],
			['amadeus', 'apollo', 'AD/14AUGKIVMOW/FN/A9U,SU/CV', 'A/V/14AUGKIVMOW/D|9U.SU'],
			['amadeus', 'apollo', 'AD20SEPKIVMOW/FN/A9U,SU', 'A20SEPKIVMOW/D|9U.SU'],
			['amadeus', 'apollo', 'SSPS898Y20SEPKIVKBP3', '0PS898Y20SEPKIVKBPSS3'],
			['amadeus', 'apollo', 'AC', 'A*C1'],
			['amadeus', 'apollo', 'SS2YJ3', '02Y3J4'],
			['apollo', 'amadeus', 'A20SEPKIVRIX', 'AD20SEPKIVRIX'],
			['apollo', 'amadeus', 'A20SEPNYCSFO12AMSP|UA.AA.DL', 'AD20SEPNYCSFO12A/XMSP/AUA,AA,DL'],
			['apollo', 'amadeus', 'A20SEPNYCSFO12AMSP.CHI|UA.AA', 'AD20SEPNYCSFO12A/XMSPCHI/AUA,AA'],
			['apollo', 'amadeus', 'A20SEPKIVRIX|BT', 'AD20SEPKIVRIX/ABT'],
			['apollo', 'amadeus', 'A20SEPKIVMOW/D|9U.SU', 'AD20SEPKIVMOW/FN/A9U,SU'],
			['apollo', 'amadeus', 'A20SEPKIVRIX|9U.BT.SU', 'AD20SEPKIVRIX/A9U,BT,SU'],
			['apollo', 'amadeus', 'A/V/14AUGKIVMOW/D|9U.SU', 'AD/14AUGKIVMOW/FN/A9U,SU/CV'],
			['apollo', 'amadeus', 'L@S7/A15SEPKIVMOW', '1S7AD15SEPKIVMOW'],
			['apollo', 'amadeus', 'L@S7/A15SEPKIVMOW12A', '1S7AD15SEPKIVMOW12A'],
			['apollo', 'amadeus', 'A20SEPKIVRIX-9U.BT.SU', 'AD20SEPKIVRIX/A-9U,BT,SU'],
			['apollo', 'amadeus', 'A/T/20SEPLAXMNL|DL', 'AD/20SEPLAXMNL/ADL/CT'],
			['apollo', 'amadeus', 'A/U8/17JULSFOJNB|DL', 'AD/17JULSFOJNB/ADL/CU/B8'],
			['apollo', 'amadeus', 'A/T/20SEPLAXMNL12ASFO|DL', 'AD/20SEPLAXMNL12A/XSFO/ADL/CT'],
			['apollo', 'amadeus', 'A/T8/20SEPLAXMNL12ASFO|DL', 'AD/20SEPLAXMNL12A/XSFO/ADL/CT/B8'],
			['apollo', 'amadeus', 'A1MARSFOACC|/*A', 'AD1MARSFOACC/A*A'],
			['apollo', 'amadeus', 'A1MARSFOACC12ANYC|/*S', 'AD1MARSFOACC12A/XNYC/A*S'],
			['apollo', 'amadeus', 'A/K/1MARSFOACC12ANYC|/*S', 'AD/1MARSFOACC12A/XNYC/CK/A*S'],
			['apollo', 'amadeus', 'A1MARSFOACC12ANYC.AMS|/*S', 'AD1MARSFOACC12A/XNYCAMS/A*S'],
			['apollo', 'amadeus', 'A/K/20SEPSFOACC12ANYC.AMS|/*S', 'AD/20SEPSFOACC12A/XNYCAMS/CK/A*S'],
			['apollo', 'amadeus', 'A*', 'MD'],
			['apollo', 'amadeus', 'A*20SEP', 'AC20SEP'],
			['apollo', 'amadeus', 'A*6P', 'AC6P'],
			['apollo', 'amadeus', 'A*|5', 'AC5'],
			['apollo', 'amadeus', 'A*-5', 'AC-5'],
			['apollo', 'amadeus', 'A*XDTW', 'AC/XDTW'],
			['apollo', 'amadeus', 'A*O25JUN', 'ACR25JUN'],
			['apollo', 'amadeus', 'A*|UA', 'AC/AUA'],
			['apollo', 'amadeus', 'A*-UA', 'AC/A-UA'],
			['apollo', 'amadeus', 'A*|UA.PS', 'AC/AUA,PS'],
			['apollo', 'amadeus', 'A*-UA.BT.PS', 'AC/A-UA,BT,PS'],
			['apollo', 'amadeus', '$BB/ACC', 'FXA/RC05'],
			['apollo', 'amadeus', '$BB0/ACC', 'FXR/RC05'],
			['apollo', 'amadeus', '$BBA/ACC', 'FXL/RC05'],
			['apollo', 'amadeus', '$B@VKXT5U0', 'FXX/L-VKXT5U0'],
			['apollo', 'amadeus', '$B*JCB/@VKXT5U0', 'FXX/RJCB/L-VKXT5U0'],
			['apollo', 'amadeus', '$B*ITX/@VKXT5U0', 'FXX/RITX/L-VKXT5U0'],
			['apollo', 'amadeus', '$B:CAD', 'FXX/R,FC-CAD'],
			['apollo', 'amadeus', '$BB:EUR', 'FXA/R,FC-EUR'],
			['apollo', 'amadeus', '$BBA:EUR', 'FXL/R,FC-EUR'],
			['apollo', 'amadeus', '$BB0:EUR', 'FXR/R,FC-EUR'],
			['apollo', 'amadeus', '$BN1|2*C05|3*INF/:EUR', 'FXX/RADT*C05*INF,FC-EUR'],
			['apollo', 'amadeus', '$BN1|2*C05', 'FXX/RADT*C05'],
			['apollo', 'amadeus', '$BN1|2*C05|3*INF', 'FXX/RADT*C05*INF'],
			['apollo', 'amadeus', '$BN1*JCB|2*J05', 'FXX/RJCB*J05'],
			['apollo', 'amadeus', '$BN1*JCB|2*J06|3*JNF', 'FXX/RJCB*J06*JNF'],
			['apollo', 'amadeus', '$B*ITX', 'FXX/RITX'],
			['apollo', 'amadeus', '$BS1|2', 'FXX/S1,2'],
			['apollo', 'amadeus', '$BS1*3|5|6', 'FXX/S1-3,5,6'],
			['apollo', 'amadeus', '$BBS1|2', 'FXA/S1,2'],
			['apollo', 'amadeus', '$BBS1*3|5|6', 'FXA/S1-3,5,6'],
			['apollo', 'amadeus', '$BBAS1|2|5|6', 'FXL/S1,2,5,6'],
			['apollo', 'amadeus', '$BBAS1*3|5|6', 'FXL/S1-3,5,6'],
			['apollo', 'amadeus', '$BS1|2|5|6/N1|2*C05', 'FXX/S1,2,5,6/RADT*C05'],
			['apollo', 'amadeus', '$BS1|2|5|6/N1|2*C05|3*INF', 'FXX/S1,2,5,6/RADT*C05*INF'],
			['apollo', 'amadeus', '01Y1', 'SS1Y1'],
			['apollo', 'amadeus', '01Y1Y2Y3', 'SS1YYY1'],
			['apollo', 'amadeus', '01Y1*', 'SS1Y1'],
			['sabre', 'amadeus', '0KL642J7DECYYZAMSNN2', 'SSKL642J7DECYYZAMS2'],
			['apollo', 'amadeus', 'XA/0Y', 'SBY'],
			['apollo', 'amadeus', 'X1/0Y', 'SBY1'],
			['apollo', 'amadeus', 'X1-2/0Y', 'SBY1-2'],
			['apollo', 'amadeus', 'X1|2|5/0Y', 'SBY1,2,5'],
			['apollo', 'amadeus', 'X1|3-4/0Y', 'SBY1,3-4'],
			['apollo', 'amadeus', 'X3/012JUL', 'SB12JUL3'],
			['apollo', 'amadeus', 'X1-2/023JUN', 'SB23JUN1,2'],
			['apollo', 'amadeus', 'X1', 'XE1'],
			['apollo', 'amadeus', 'X1|3|5', 'XE1,3,5'],
			['apollo', 'amadeus', 'X3-5', 'XE3-5'],
			['apollo', 'amadeus', 'X1-2|5-7', 'XE1-2,5-7'],
			['apollo', 'amadeus', '/1/3', 'RS1,3'],
			['apollo', 'amadeus', '/0/3-4', 'RS0,3-4'],
			['apollo', 'amadeus', '$D20SEPKIVRIX', 'FQDKIVRIX/20SEP'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:OW', 'FQDKIVRIX/20SEP/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX|PS|TK|LO:OW', 'FQDKIVRIX/20SEP/APS,TK,LO/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:OW|PS|TK|LO', 'FQDKIVRIX/20SEP/APS,TK,LO/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:OW@Y', 'FQDKIVRIX/20SEP/KM/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@Y:OW', 'FQDKIVRIX/20SEP/KM/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:OW@W', 'FQDKIVRIX/20SEP/KW/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@W:OW', 'FQDKIVRIX/20SEP/KW/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:OW@C', 'FQDKIVRIX/20SEP/KC/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@C:OW', 'FQDKIVRIX/20SEP/KC/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:OW@F', 'FQDKIVRIX/20SEP/KF/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@F:OW', 'FQDKIVRIX/20SEP/KF/IO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX|PS|TK|LO:RT', 'FQDKIVRIX/20SEP/APS,TK,LO/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:RT|PS|TK|LO', 'FQDKIVRIX/20SEP/APS,TK,LO/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:RT@Y', 'FQDKIVRIX/20SEP/KM/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@Y:RT', 'FQDKIVRIX/20SEP/KM/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:RT@W', 'FQDKIVRIX/20SEP/KW/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@W:RT', 'FQDKIVRIX/20SEP/KW/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:RT@C', 'FQDKIVRIX/20SEP/KC/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@C:RT', 'FQDKIVRIX/20SEP/KC/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX:RT@F', 'FQDKIVRIX/20SEP/KF/IR'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@F:RT', 'FQDKIVRIX/20SEP/KF/IR'],
			['apollo', 'amadeus', '$DV20SEPKIVRIX05JUL', 'FQDKIVRIX/20SEP*05JUL'],
			['apollo', 'amadeus', '$D20SEPKIVRIX|PS|TK|LO', 'FQDKIVRIX/20SEP/APS,TK,LO'],
			['apollo', 'amadeus', '$DV20SEPKIVRIX05JUL|PS|TK|LO', 'FQDKIVRIX/20SEP*05JUL/APS,TK,LO'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@Y', 'FQDKIVRIX/20SEP/KM'],
			['apollo', 'amadeus', '$D20SEPKIVRIX|9U|PS@Y', 'FQDKIVRIX/20SEP/KM/A9U,PS'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@Y|9U|PS', 'FQDKIVRIX/20SEP/KM/A9U,PS'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@W', 'FQDKIVRIX/20SEP/KW'],
			['apollo', 'amadeus', '$D20SEPKIVRIX|9U|PS@W', 'FQDKIVRIX/20SEP/KW/A9U,PS'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@W|9U|PS', 'FQDKIVRIX/20SEP/KW/A9U,PS'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@C', 'FQDKIVRIX/20SEP/KC'],
			['apollo', 'amadeus', '$D20SEPKIVRIX|9U|PS@C', 'FQDKIVRIX/20SEP/KC/A9U,PS'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@C|9U|PS', 'FQDKIVRIX/20SEP/KC/A9U,PS'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@F', 'FQDKIVRIX/20SEP/KF'],
			['apollo', 'amadeus', '$D20SEPKIVRIX|9U|PS@F', 'FQDKIVRIX/20SEP/KF/A9U,PS'],
			['apollo', 'amadeus', '$D20SEPKIVRIX@F|9U|PS', 'FQDKIVRIX/20SEP/KF/A9U,PS'],
			['apollo', 'amadeus', '$DNYCMNL28NOV17T12MAR17|DL', 'FQDNYCMNL/28NOV17/R,12MAR17/ADL'],
			['apollo', 'amadeus', '$D|PS', 'FQDC/APS'],
			['apollo', 'amadeus', '$DDPAR', 'FQDC/PAR'],
			['apollo', 'amadeus', '$V1', 'FQN1'],
			['apollo', 'amadeus', '$LR1', 'FQR1'],
			['apollo', 'amadeus', '$LB1/DL', 'FQS1/ADL'],
			['apollo', 'amadeus', 'SEM/103K/AG', 'JUM/O-103K'],
			['apollo', 'amadeus', '**-SMITH', 'RT/SMITH'],
			['apollo', 'amadeus', '**-SMITH/AMY ', 'RT/SMITH/AMY'],
			['apollo', 'amadeus', '*ABC123', 'RTABC123'],
			['apollo', 'amadeus', '*3', 'RT3'],
			['apollo', 'amadeus', 'N:SMITH/JOHN', 'NM1SMITH/JOHN'],
			['apollo', 'amadeus', 'N:SMITH/JOHN PAUL', 'NM1SMITH/JOHN PAUL'],
			['apollo', 'amadeus', 'N:SMITH/JUNIOR*P-C07', 'NM1SMITH/JUNIOR (C07)'],
			['apollo', 'amadeus', 'N:EAGEN/KATY JOHN*P-C07', 'NM1EAGEN/KATY JOHN (C07)'],
			['apollo', 'amadeus', 'T:TAU/1NOV', 'TKTL1NOV'],
			['apollo', 'amadeus', 'C:T:TAU/24MAY', '5/TL24MAY'],
			['apollo', 'amadeus', 'R:STAS', 'RF STAS'],
			['apollo', 'amadeus', 'ER', 'ER'],
			['apollo', 'amadeus', '@:3SSRDOCSYYHK1/N1/////05MAR90/F//LAST/FIRST', 'SRDOCSYYHK1-----05MAR90-F--LAST-FIRST/P1'],
			['apollo', 'amadeus', '@:3SSRDOCSYYHK1/N1/////02APR11/FI//LASTNAME/NAME', 'SRDOCSYYHK1-----02APR11-FI--LASTNAME-NAME/P1'],
			['apollo', 'amadeus', 'C:5-10@:3', 'XE5-10'],
			['apollo', 'amadeus', '@:5S1 985.00 N1 720.00 F1 500.00', 'RMS1 985.00 N1 720.00 F1 500.00'],
			['apollo', 'amadeus', 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT', 'AP SFO 800-750-2238-A'],
			['apollo', 'amadeus', '*HTE', 'TWD'],
			['apollo', 'amadeus', '*TE1', 'TWD/L1'],
			['apollo', 'amadeus', 'T:$B', 'FXP'],
			['apollo', 'amadeus', '@:5SFOHT/PLEASE CONTACT PAX', 'RMSFOHT/PLEASE CONTACT PAX'],
			['apollo', 'amadeus', '0TURZZBK1SFO12MAR-***THANK YOU FOR YOUR SUPPORT***', 'RU1AHK1SFO12MAR/***THANK YOU FOR YOUR SUPPORT***'],
			['apollo', 'amadeus', 'S*CTY/DEN', 'DACDEN'],
			['apollo', 'amadeus', 'S*AIR/9U', 'DNA9U'],
			['apollo', 'amadeus', 'HELP 767', 'DNE767'],
			['apollo', 'amadeus', 'VITPS898/20SEP', 'DOPS898/20SEP'],
			['apollo', 'amadeus', '@MT', 'DMI'],
			['apollo', 'amadeus', 'SA', 'JMA'],
			['apollo', 'amadeus', '$BOCUA', 'FXX/R,OCC-UA'],
			['apollo', 'amadeus', '01Y1Y2Y3', 'SS1YYY1'],
			['amadeus', 'apollo', 'SS1YYY1', '01Y1Y2Y3'],
			['apollo', 'amadeus', 'X1|3|4/01Y|3J|4M', 'SBY1/J3/M4'],
			['amadeus', 'sabre',  'SBY1/J3/M4', 'WC1Y/3J/4M'],
			['sabre',  'amadeus', 'WC1Y/3J/4M', 'SBY1/J3/M4'],
			['apollo', 'amadeus', 'A/V/14AUGKIVMOW/D|9U.SU', 'AD/14AUGKIVMOW/FN/A9U,SU/CV'],
			['apollo', 'amadeus', 'A/T/20SEPLAXMNL|DL', 'AD/20SEPLAXMNL/ADL/CT'],
			['apollo', 'amadeus', 'A/U8/17JULSFOJNB|DL', 'AD/17JULSFOJNB/ADL/CU/B8'],
			['apollo', 'amadeus', 'A/T/20SEPLAXMNL12ASFO|DL', 'AD/20SEPLAXMNL12A/XSFO/ADL/CT'],
			['apollo', 'amadeus', 'A/T8/20SEPLAXMNL12ASFO|DL', 'AD/20SEPLAXMNL12A/XSFO/ADL/CT/B8'],
			['apollo', 'amadeus', 'A/K/20SEPSFOACC12ANYC|/*S', 'AD/20SEPSFOACC12A/XNYC/CK/A*S'],
			['apollo', 'amadeus', 'A/K/20SEPSFOACC12ANYC.AMS|/*S', 'AD/20SEPSFOACC12A/XNYCAMS/CK/A*S'],
			['sabre', 'amadeus', '1S14AUGKIVMOW/N¥9USU-V', 'AD/14AUGKIVMOW/FN/A9U,SU/CV'],
			['sabre', 'amadeus', '1S20SEPLAXMNL¥DL-T', 'AD/20SEPLAXMNL/ADL/CT'],
			['sabre', 'amadeus', '1S17JULSFOJNB¥DL-8U', 'AD/17JULSFOJNB/ADL/CU/B8'],
			['sabre', 'amadeus', '1S20SEPLAXMNL12ASFO¥DL-T', 'AD/20SEPLAXMNL12A/XSFO/ADL/CT'],
			['sabre', 'amadeus', '1S20SEPLAXMNL12ASFO¥DL-8T', 'AD/20SEPLAXMNL12A/XSFO/ADL/CT/B8'],
			['sabre', 'amadeus', '1S20SEPSFOACC12ANYC¥/*S-K', 'AD/20SEPSFOACC12A/XNYC/CK/A*S'],
			['sabre', 'amadeus', '1S20SEPSFOACC12ANYC/AMS¥/*S-K', 'AD/20SEPSFOACC12A/XNYCAMS/CK/A*S'],
			['apollo', 'sabre', '$BB/OCUA', 'WPNC¥C-UA'],
			['apollo', 'sabre', '$BCUA', 'WPAUA'],
			['apollo', 'sabre', '$B/CUA', 'WPAUA'],
			['apollo', 'sabre', '$BOCUA', 'WPC-UA'],
			['apollo', 'sabre', '$BOCUA', 'WPC-UA'],
			['apollo', 'sabre', '$BB/CUA', 'WPNC¥AUA'],
			['apollo', 'sabre', '$BB/CUA', 'WPNC¥AUA'],
			['apollo', 'sabre', '$BB/OCUA', 'WPNC¥C-UA'],
			['apollo', 'sabre', '$BB0/CUA', 'WPNCB¥AUA'],
			['apollo', 'sabre', '$BB0CUA', 'WPNCB¥AUA'],
			['apollo', 'sabre', '$BB0OCUA', 'WPNCB¥C-UA'],
			['apollo', 'sabre', '$BB/OCUA', 'WPNC¥C-UA'],
			['apollo', 'amadeus', '$BB/OCUA', 'FXA/R,OCC-UA'],
			['apollo', 'amadeus', '$BCUA', 'FXX/R,VC-UA'],
			['apollo', 'amadeus', '$B/CUA', 'FXX/R,VC-UA'],
			['apollo', 'amadeus', '$BOCUA', 'FXX/R,OCC-UA'],
			['apollo', 'amadeus', '$B/OCUA', 'FXX/R,OCC-UA'],
			['apollo', 'amadeus', '$BB/CUA', 'FXA/R,VC-UA'],
			['apollo', 'amadeus', '$BB/CUA', 'FXA/R,VC-UA'],
			['apollo', 'amadeus', '$BB/OCUA', 'FXA/R,OCC-UA'],
			['apollo', 'amadeus', '$BB0/CUA', 'FXR/R,VC-UA'],
			['apollo', 'amadeus', '$BB0CUA', 'FXR/R,VC-UA'],
			['apollo', 'amadeus', '$BB0OCUA', 'FXR/R,OCC-UA'],
			['apollo', 'amadeus', '$BB/OCUA', 'FXA/R,OCC-UA'],

			['apollo', 'sabre', '$D', 'FQ*'],
			['apollo', 'sabre', 'A20SEPKIVRIX6P', '120SEPKIVRIX6P'],
			['apollo', 'sabre', '*IA', '*IA'],
			['apollo', 'sabre', '*HA', '*HIA'],
			['apollo', 'sabre', '*HI', '*HI'],
			['apollo', 'sabre', 'T:$B/*JCB', 'WPRQ¥PJCB'],
			['apollo', 'sabre', '$BB/OCUA', 'WPNC¥C-UA'],
			['apollo', 'sabre', 'MR', 'MD'],
			['apollo', 'sabre', 'MD', 'MD'],
			['apollo', 'sabre', 'MT', 'MT'],
			['apollo', 'sabre', 'MB', 'MB'],
			['apollo', 'sabre', 'MU', 'MU'],
			['apollo', 'amadeus', 'S*AIR/LUFTHANSA', 'DNALUFTHANSA'],
			['apollo', 'sabre', '0TURZZBK1SFO12MAR-RETENTION', '0OTHYYGK1/RETENTION12MAR'],
			['apollo', 'sabre', 'P:SFOAS/800-750-2238', '91-800-750-2238-A'],
			['apollo', 'sabre', '*LF', '*PQ'],
			['apollo', 'sabre', 'XT3', 'PQD3'],
			['apollo', 'sabre', '*LF2', '*PQ2'],
			['apollo', 'sabre', '$D', 'FQ*'],

			['sabre', 'apollo', 'FQ*', '$D'],
			['sabre', 'apollo', '120SEPKIVRIX6P', 'A20SEPKIVRIX6P'],
			['sabre', 'apollo', '*IA', '*IA'],
			['sabre', 'apollo', '*HIA', '*HA'],
			['sabre', 'apollo', '*HI', '*HI'],
			['sabre', 'apollo', 'WPPJCB¥RQ', 'T:$B*JCB'],
			['sabre', 'apollo', 'WPAUA', '$B/CUA'],
			['sabre', 'apollo', 'WPC-UA', '$BOCUA'],
			['sabre', 'apollo', 'WPNC¥AUA', '$BB/CUA'],
			['sabre', 'apollo', 'WPNC¥C-UA', '$BBOCUA'],
			['sabre', 'apollo', 'WPNCB¥AUA', '$BB0/CUA'],
			['sabre', 'apollo', 'MD', 'MR'],
			['sabre', 'apollo', 'MT', 'MT'],
			['sabre', 'apollo', 'MB', 'MB'],
			['sabre', 'apollo', 'MU', 'MU'],
			['sabre', 'apollo', '0OTHYYGK1/RETENTION12MAR', '0TURZZBK1SFO12MAR-RETENTION'],
			['sabre', 'apollo', '*PQ', '*LF'],
			['sabre', 'apollo', 'PQD3', 'XT3'],
			['sabre', 'apollo', '*PQ2', '*LF2'],
			['sabre', 'apollo', 'FQ*', '$D'],

			['apollo', 'amadeus', 'A20SEPKIVRIX6P', 'AD20SEPKIVRIX6P'],
			['apollo', 'amadeus', '*IA', 'RTI'],
			['apollo', 'amadeus', '*HA', 'RHA'],
			['apollo', 'amadeus', '*HI', 'RHI'],
			['apollo', 'amadeus', '0PS898Y20SEPKIVKBPGK2', 'SSPS898Y20SEPKIVKBPGK2/A'],
			['apollo', 'amadeus', '0PS898Y20SEPKIVKBPLL2', 'SSPS898Y20SEPKIVKBPPE2'],
			['apollo', 'amadeus', 'PS-TEXT IN PNR HEADER', 'UHP/TEXT IN PNR HEADER'],
			['apollo', 'amadeus', '02Y1Z2X3GK', 'SS2YZX1/GK/A'],
			['sabre', 'amadeus', '02Y1GK*', 'SS2Y1/GK/A'],
			['apollo', 'amadeus', '$BB/OCUA', 'FXA/R,OCC-UA'],
			['apollo', 'amadeus', '$B*ITX', 'FXX/RITX'],
			['apollo', 'amadeus', '$BB*ITX', 'FXA/RITX'],
			// don't know why we have "no need to translate" them, they are likely to be used a lot
			// I guess initial author meant "no need to translate _for now_"
			// TODO: uncomment and make sure they all are translated correctly
//            ['apollo', 'amadeus', '$BBN1*JCB|2*J05/:EUR', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBAN1*ITX|2*X05/:EUR', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BB0N1|2*C05|3*INF/:EUR', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBN1*ITX|2*I05', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBN1*ITX|2*I06|3*ITF', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BB0N1*ITX|2*I05', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BB0N1*ITX|2*I06|3*ITF', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBAN1*ITX|2*I05', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBAN1*ITX|2*I06|3*ITF', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BB0N1*JCB|2*J05', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBN1*JCB|2*J05', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBAN1|2|3*C05|4*INF', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBAN1|2*C05|3*INF', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBAN1|2*C05', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BB0N1|2|3*C05|4*INF', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BB0N1|2*C05|3*INF', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BB0N1|2*C05', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBN1|2|3*C05|4*INF', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBN1|2*C05|3*INF', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBN1|2*C05', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBS1|2|5|6/N1|2*C05', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBS1|2|5|6/N1|2*C05|3*INF', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBS1|2|5|6/N1|2|3*C05|4*INF', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BB0S1|2|5|6/N1|2*C05', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BB0S1|2|5|6/N1|2*C05|3*INF', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BB0S1|2|5|6/N1|2|3*C05|4*INF', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBAS1|2|5|6/N1|2*C05', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBAS1|2|5|6/N1|2*C05|3*INF', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBAS1|2|5|6/N1|2|3*C05|4*INF', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBS1|2|5|6/N1*JCB|2*JCB|3*JNN|4*JNF', ''], 	//no need to translate
//            ['apollo', 'amadeus', '$BBS1|2|5|6/N1*ITX|2*ITX|3*INN|4*ITF', ''], 	//no need to translate
//            ['apollo', 'amadeus', 'A20SEPKIVMIA12AIST960|TK.9U', ''], 	//no need to translate
//            ['apollo', 'amadeus', 'A1MARSFOACC12ANYC960|/*S', ''],
//            ['sabre', 'amadeus', 'WPP1JCB/1J05¥NC¥MEUR', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ITX/1I06¥NCS¥MEUR', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ADT/1C05/1INF¥NCB¥MEUR', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPPITX', 'FXX/RIIT'],
//            ['sabre', 'amadeus', 'WPNC¥PITX', 'FXA/RIIT'],
//            ['sabre', 'amadeus', 'WPP1ITX/1I06¥NC', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ITX/1I06/1ITF¥NC', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ITX/1I06¥NCB', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ITX/1I06/1ITF¥NCB', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ITX/1I06¥NCS', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ITX/1I06/1ITF¥NCS', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1JCB/1J05¥NCB', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1JCB/1J05¥NC', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1JCB/1J05', 'FXX/RJCB*J05'],
//            ['sabre', 'amadeus', 'WPP2ADT/1C05/1INF¥NCS', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ADT/1C05/1INF¥NCS', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ADT/1C05¥NCS', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP2ADT/1C05/1INF¥NCB', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ADT/1C05/1INF¥NCB', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ADT/1C05¥NCB', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP2ADT/1C05/1INF¥NC', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ADT/1C05/1INF¥NC', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ADT/1C05¥NC', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP2ADT/1C05/1INF', 'FXX/RADT*C05*INF'], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP2ADT/1C05/1INF¥S1/2/5/6', 'FXX/S1,2,5,6/RADT*C05*INF'],
//            ['sabre', 'amadeus', 'WPP1ADT/1C05¥NC¥S1/2/5/6', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ADT/1C05/1INF¥NC¥S1/2/5/6', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP2ADT/1C05/1INF¥NC¥S1/2/5/6', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ADT/1C05¥NCB¥S1/2/5/6', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ADT/1C05/1INF¥NCB¥S1/2/5/6', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP2ADT/1C05/1INF¥NCB¥S1/2/5/6', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ADT/1C05¥NCS¥S1/2/5/6', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP1ADT/1C05/1INF¥NCS¥S1/2/5/6', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP2ADT/1C05/1INF¥NCS¥S1/2/5/6', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP2JCB/1JNN/1JNF¥NC¥S1/2/5/6', ''], 	//no need to translate
//            ['sabre', 'amadeus', 'WPP2ITX/1INN/1ITF¥NC¥S1/2/5/6', ''], 	//no need to translate
//            ['sabre', 'amadeus', '120SEPKIVMIA12AIST-960¥TK9U', ''], 	//no need to translate
//            ['sabre', 'amadeus', '120SEPSFOACC12ANYC-960¥/*S', ''], 	//no need to translate
			['apollo', 'amadeus', 'XX100.20|50', 'DF100.20;50'],
			['apollo', 'amadeus', 'XX100|50', 'DF100;50'],
			['apollo', 'amadeus', 'XX100-50', 'DF100-50'],
			['apollo', 'amadeus', 'XX100*50', 'DF100*50'],
			['apollo', 'amadeus', 'XX100.20*50.3', 'DF100.20*50.3'],
			['apollo', 'amadeus', 'XX100.20/50.1', 'DF100.20/50.1'],
			['apollo', 'amadeus', 'MD', 'MD'],
			['apollo', 'amadeus', 'MT', 'MT'],
			['apollo', 'amadeus', 'MB', 'MB'],
			['apollo', 'amadeus', 'MU', 'MU'],
			['amadeus', 'apollo', 'DNALUFTHANSA', 'S*AIR/LUFTHANSA'],
			['apollo', 'amadeus', 'S*AIR/9U', 'DNA9U'],
			['apollo', 'amadeus', 'S*CTY/ACCRA', 'DANACCRA'],
			['apollo', 'amadeus', 'PS-TEXT IN PNR HEADER', 'UHP/TEXT IN PNR HEADER'],
			['apollo', 'amadeus', '0TURZZBK1SFO12MAR-RETENTION', 'RU1AHK1SFO12MAR/RETENTION'],
			['apollo', 'amadeus', 'P:SFOAS/800-750-2238', 'AP SFO 800-750-2238-A'],
			['apollo', 'amadeus', 'T:$BN1|2*C05', 'FXP/RADT*C05'],
			['apollo', 'amadeus', 'T:$BN1|2*C05|3*INF', 'FXP/RADT*C05*INF'],
			['apollo', 'amadeus', 'T:$B*JCB', 'FXP/RJCB'],
			['apollo', 'amadeus', 'T:$BN1*JCB|2*J06', 'FXP/RJCB*J06'],
			['apollo', 'amadeus', 'T:$BN1*JCB|2*J05|3*JNF', 'FXP/RJCB*J05*JNF'],
			['apollo', 'amadeus', 'T:$B*ITX', 'FXP/RITX'],
			['apollo', 'amadeus', 'T:$BN1*ITX|2*I06', 'FXP/RITX*I06'],
			['apollo', 'amadeus', 'T:$BN1*ITX|2*I06|3*ITF', 'FXP/RITX*I06*ITF'],
			['apollo', 'amadeus', 'XT', 'TTE/ALL'],
			['apollo', 'amadeus', '*LF', 'TQT'],
			['apollo', 'amadeus', 'XT3', 'TTE/T3'],
			['apollo', 'amadeus', '*LF3', 'TQT/T3'],
			['apollo', 'amadeus', 'A/V/14AUGKIVMOW/SO|9U.SU', 'AD/14AUGKIVMOW/O/A9U,SU/CV'],
			['apollo', 'amadeus', 'A14AUGKIVMOW/DO|9U.SU', 'AD14AUGKIVMOW/O/A9U,SU'],
			['apollo', 'amadeus', 'A/V/14AUGKIVMOW/DO|9U.SU', 'AD/14AUGKIVMOW/O/A9U,SU/CV'],
			['apollo', 'amadeus', 'HELP AVAILABILITY', 'HE AVAILABILITY'],
			['apollo', 'amadeus', '$D10SEPPITMIL-JCB', 'FQDPITMIL/10SEP/R,-JCB'],
			['apollo', 'amadeus', '$D20SEPKIVRIX|PS|TK|LO-JCB', 'FQDKIVRIX/20SEP/R,-JCB/APS,TK,LO'],
			['apollo', 'amadeus', '$DV10SEPPITMIL27SEP-JCB', 'FQDPITMIL/10SEP*27SEP/R,-JCB'],
			['apollo', 'amadeus', '$D10SEPPITMIL-ITX', 'FQDPITMIL/10SEP/R,-ITX'],
			['apollo', 'amadeus', '$D10SEPPITMIL|PS|TK|LO-ITX', 'FQDPITMIL/10SEP/R,-ITX/APS,TK,LO'],
			['apollo', 'amadeus', '$D', 'MPFQD'],
			['sabre', 'amadeus', 'W/-ALLUFTHANSA', 'DNALUFTHANSA'],
			['sabre', 'amadeus', '120SEPKIVRIX6P', 'AD20SEPKIVRIX6P'],
			['sabre', 'amadeus', '*IA', 'RTI'],
			['sabre', 'amadeus', '*HIA', 'RHA'],
			['sabre', 'amadeus', '*HI', 'RHI'],
			['sabre', 'amadeus', '0PS898Y20SEPKIVKBPGK2', 'SSPS898Y20SEPKIVKBPGK2/A'],
			['sabre', 'amadeus', '0PS898Y20SEPKIVKBPLL2', 'SSPS898Y20SEPKIVKBPPE2'],
			['sabre', 'amadeus', '02Y1Z2X3GK', 'SS2YZX1/GK/A'],
			['sabre', 'amadeus', '02Y1GK*', 'SS2Y1/GK/A'],
			['sabre', 'amadeus', 'WPAUA', 'FXX/R,VC-UA'],
			['sabre', 'amadeus', 'WPC-UA', 'FXX/R,OCC-UA'],
			['sabre', 'amadeus', 'WPNC¥AUA', 'FXA/R,VC-UA'],
			['sabre', 'amadeus', 'WPNC¥C-UA', 'FXA/R,OCC-UA'],
			['sabre', 'amadeus', 'WPNCB¥AUA', 'FXR/R,VC-UA'],
			['sabre', 'amadeus', 'T\u00A4100.20+50', 'DF100.20;50'],
			['sabre', 'amadeus', 'T\u00A4100+50', 'DF100;50'],
			['sabre', 'amadeus', 'T\u00A4100-50', 'DF100-50'],
			['sabre', 'amadeus', 'T\u00A4100*50', 'DF100*50'],
			['sabre', 'amadeus', 'T\u00A4100.20*50.3', 'DF100.20*50.3'],
			['sabre', 'amadeus', 'T\u00A4100.20/50.1', 'DF100.20/50.1'],
			['sabre', 'amadeus', 'MD', 'MD'],
			['sabre', 'amadeus', 'MT', 'MT'],
			['sabre', 'amadeus', 'MB', 'MB'],
			['sabre', 'amadeus', 'MU', 'MU'],
			['amadeus', 'sabre', 'DNALUFTHANSA', 'W/-ALLUFTHANSA'],
			['sabre', 'amadeus', 'W/*SU', 'DNASU'],
			['sabre', 'amadeus', 'W/-CCACCRA', 'DANACCRA'],
			['sabre', 'amadeus', '0OTHYYGK1/RETENTION20SEP', 'RU1AHK1SFO20SEP/RETENTION'],
			['sabre', 'amadeus', 'WPP1ADT/1CNN¥RQ', 'FXP/RADT*CNN'],
			['sabre', 'amadeus', 'WPPJCB¥RQ', 'FXP/RJCB'],
			['sabre', 'amadeus', 'WPP1JCB/1J06¥RQ', 'FXP/RJCB*J06'],
			['sabre', 'amadeus', 'WPP1JCB/1J05/1JNF¥RQ', 'FXP/RJCB*J05*JNF'],
			['sabre', 'amadeus', 'WPP1ADT/1CNN/1INF¥RQ', 'FXP/RADT*CNN*INF'],
			['sabre', 'amadeus', 'WPPITX¥RQ', 'FXP/RITX'],
			['sabre', 'amadeus', 'WPP1ITX/1I06¥RQ', 'FXP/RITX*I06'],
			['sabre', 'amadeus', 'WPP1ITX/1I06/1ITF¥RQ', 'FXP/RITX*I06*ITF'],
			['sabre', 'amadeus', 'PQD-ALL', 'TTE/ALL'],
			['sabre', 'amadeus', '*PQ', 'TQT'],
			['sabre', 'amadeus', 'FQPITMIL10SEP¥PJCB', 'FQDPITMIL/10SEP/R,-JCB'],
			['sabre', 'amadeus', 'FQKIVRIX20SEP-PS-TK-LO¥PJCB', 'FQDKIVRIX/20SEP/R,-JCB/APS,TK,LO'],
			['sabre', 'amadeus', 'FQKIVRIX20SEP¥R05JUL¥PJCB', 'FQDKIVRIX/20SEP*05JUL/R,-JCB'],
			['sabre', 'amadeus', 'FQPITMIL10SEP¥PITX', 'FQDPITMIL/10SEP/R,-ITX'],
			['sabre', 'amadeus', 'FQPITMIL10SEP-PS-TK-LO¥PITX', 'FQDPITMIL/10SEP/R,-ITX/APS,TK,LO'],
			['sabre', 'amadeus', 'FQ*', 'MPFQD'],
			['sabre', 'amadeus', 'PQD3', 'TTE/T3'],
			['amadeus', 'sabre', 'TQT/T3', '*PQ3'],

			['sabre', 'apollo', '120SEPKIVMOW/O¥¥¥', 'A20SEPKIVMOW/DO'],
			['sabre', 'apollo', '120JUNKIVMOW/O¥¥', 'A20JUNKIVMOW/SO'],
			['sabre', 'apollo', '1S14AUGKIVMOW/O¥¥-V', 'A/V/14AUGKIVMOW/SO'],
			['sabre', 'apollo', '1S14AUGKIVMOW/O¥¥¥-V', 'A/V/14AUGKIVMOW/DO'],
			['sabre', 'apollo', '1S14AUGKIVMOW/O¥¥9USU-V', 'A/V/14AUGKIVMOW/SO|9U.SU'],
			['sabre', 'apollo', '1S14AUGKIVMOW/O¥¥¥9USU-V', 'A/V/14AUGKIVMOW/DO|9U.SU'],
			['sabre', 'apollo', '1S14AUGKIVMOW/O¥¥¥¥9USU-V', null], // 3 stops, not possible to specify in Apollo AFAIK
			['sabre', 'apollo', '120JUNKIVMOW/N¥9USU', 'A20JUNKIVMOW/D|9U.SU'],

			['apollo', 'sabre', 'A/T/STLARN/SO|UA', '1SSTLARN/O¥¥UA-T'],
			['apollo', 'sabre', 'A/V/14AUGKIVMOW/SO', '1S14AUGKIVMOW/O-V¥¥'],
			['apollo', 'sabre', 'A/V/14AUGKIVMOW/DO', '1S14AUGKIVMOW/O-V¥¥¥'],
			['apollo', 'sabre', 'A20SEPKIVMOW/SO', '120SEPKIVMOW/O¥¥'],
			['apollo', 'sabre', 'A20SEPKIVMOW/DO', '120SEPKIVMOW/O¥¥¥'],
			['apollo', 'sabre', 'A24JUNLAXNRT1AXMN/SO', '124JUNLAXNRT1AXMN/O¥¥'],
			['apollo', 'sabre', 'A15OCTIADPRG12AVIE/SO|OS', '115OCTIADPRG12AVIE/O¥¥OS'],
			['apollo', 'sabre', 'A2JULEWRNBO12AADD|ET/SO', '12JULEWRNBO12AADD/O¥¥ET'],
			['apollo', 'sabre', 'A23JULAUSGLA12AAMS|DL.KL/DO', '123JULAUSGLA12AAMS/O¥¥¥DLKL'],

			['apollo', 'amadeus', 'A14AUGKIVMOW/SO', 'AD14AUGKIVMOW/O'],
			['apollo', 'amadeus', 'A14AUGKIVMOW/DO', 'AD14AUGKIVMOW/O'],
			['apollo', 'amadeus', 'A/V/14AUGKIVMOW/DO', 'AD/14AUGKIVMOW/O/CV'],
			['sabre', 'amadeus', '1S14AUGKIVMOW/O¥¥9USU-V', 'AD/14AUGKIVMOW/O/A9U,SU/CV'],
			['sabre', 'amadeus', '114AUGKIVMOW/O¥¥', 'AD14AUGKIVMOW/O'],
			['sabre', 'amadeus', '114AUGKIVMOW/O¥¥¥', 'AD14AUGKIVMOW/O'],
			['sabre', 'amadeus', '1S14AUGKIVMOW/O¥¥¥-V', 'AD/14AUGKIVMOW/O/CV'],
			['sabre', 'amadeus', '1S14AUGKIVMOW/O¥¥¥9USU-V', 'AD/14AUGKIVMOW/O/A9U,SU/CV'],
			['apollo', 'sabre', '0TURZZBK1SFO12MAR-RETENTION', '0OTHYYGK1/RETENTION12MAR'],
			['sabre', 'apollo', '0OTHYYGK1/RETENTION20SEP', '0TURZZBK1SFO20SEP-RETENTION'],
			['apollo', 'amadeus', 'N:I/EAGEN/KATY*29AUG16', '1/(INFEAGEN/KATY/29AUG16)'],
			['apollo', 'amadeus', 'N:I/EAGEN/KATY SEAN*29AUG16', '1/(INFEAGEN/KATY SEAN/29AUG16)'],
			['apollo', 'amadeus', '*TE2', 'TWD/L2'],
			['apollo', 'amadeus', '$V3/16', 'FQN3*16'],
			['apollo', 'amadeus', 'N:I/EAGEN/KATY*29AUG16', '1/(INFEAGEN/KATY/29AUG16)'],
			['apollo', 'amadeus', 'N:I/EAGEN/KATY SEAN*29AUG16', '1/(INFEAGEN/KATY SEAN/29AUG16)'],
			['apollo', 'amadeus', '0TURZZBK1SFO12MAR-RETENTION', 'RU1AHK1SFO12MAR/RETENTION'],
			['apollo', 'amadeus', '@LTKIV', 'DDKIV'],
			['apollo', 'amadeus', 'XX100.20|50', 'DF100.20;50'],
			['sabre', 'amadeus', '-I/EAGEN/KATY*29AUG16', '1/(INFEAGEN/KATY/29AUG16)'],
			['sabre', 'amadeus', '-I/EAGEN/KATY SEAN*29AUG16', '1/(INFEAGEN/KATY SEAN/29AUG16)'],
			['sabre', 'amadeus', 'RD3*16', 'FQN3*16'],
			['sabre', 'amadeus', 'RD3*16', 'FQN3*16'],
			['sabre', 'amadeus', '-I/EAGEN/KATY*29AUG16', '1/(INFEAGEN/KATY/29AUG16)'],
			['sabre', 'amadeus', '-I/EAGEN/KATY SEAN*29AUG16', '1/(INFEAGEN/KATY SEAN/29AUG16)'],
			['sabre', 'amadeus', 'T*KIV', 'DDKIV'],
			['sabre', 'amadeus', 'T\u00A4100.20+50', 'DF100.20;50'],
			['amadeus', 'apollo', 'AC5', 'A*|5'],
			['amadeus', 'apollo', 'SS2Y1', '02Y1*'],
			['amadeus', 'apollo', 'SSPS898Y20SEPKIVKBPGK2/ABVGDEJDFSDSFSD', '0PS898Y20SEPKIVKBPGK2'],
			['amadeus', 'apollo', 'SSPS898Y20SEPKIVKBPPE2', '0PS898Y20SEPKIVKBPLL2'],
			['amadeus', 'apollo', 'FXX/RITX*I06', '$BN1*ITX|2*I06'],
			['amadeus', 'apollo', 'FXX/RITX*I06*ITF', '$BN1*ITX|2*I06|3*ITF'],
			['amadeus', 'apollo', 'FXX/RADT*CH/S1,2,5,6', '$BN1*ADT|2*CNN/S1|2|5|6'],
			['amadeus', 'apollo', 'FXP/RITX*I06', 'T:$BN1*ITX|2*I06'],
			['amadeus', 'apollo', 'FXP/RITX*I06*ITF', 'T:$BN1*ITX|2*I06|3*ITF'],
			['amadeus', 'apollo', 'FQDPITMIL/10SEP/R,-JCB', '$D10SEPPITMIL-JCB'],
			['amadeus', 'apollo', 'FQDPITMIL/10SEP*27SEP/R,-JCB', '$DV10SEPPITMIL27SEP-JCB'],
			['amadeus', 'apollo', 'FQDPITMIL/10SEP/APS,TK,LO/R,-JCB', '$D10SEPPITMIL|PS|TK|LO-JCB'],
			['amadeus', 'apollo', 'FQDPITMIL/10SEP*27SEP/R,-JCB', '$DV10SEPPITMIL27SEP-JCB'],
			['amadeus', 'apollo', 'FQDPITMIL/10SEP/R,-ITX', '$D10SEPPITMIL-ITX'],
			['amadeus', 'apollo', 'FQDPITMIL/10SEP/APS,TK,LO/R,-ITX', '$D10SEPPITMIL|PS|TK|LO-ITX'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/R,P', '$D20SEPKIVRIX:N'],
			['amadeus', 'apollo', 'FQDKIVRIX/20SEP/R,U', '$D20SEPKIVRIX:A'],
			['amadeus', 'sabre', 'SS2Y1', '02Y1*'],
			['amadeus', 'sabre', 'AD/20SEPKIVMOW/O/CV', '1S20SEPKIVMOW/O-V¥¥'],

			['amadeus', 'apollo', 'AC//DTW', 'A*DDTW'],
			['amadeus', 'apollo', 'ACDTW', 'A*BDTW'],
			['apollo',  'sabre', 'A*BMNL', '1*DMNL'],
			['apollo',  'sabre', 'A*DMNL', '1*AMNL'],
			['apollo', 'amadeus', 'A*BDTW', 'ACDTW'],
			['apollo', 'amadeus', 'A*DJNB', 'AC//JNB'],
			['sabre',  'apollo', '1*AMNL', 'A*DMNL'],
			['sabre',  'apollo', '1*DMNL', 'A*BMNL'],

			['apollo', 'sabre', 'A20JUNKIVMOW/SO|SU', '120JUNKIVMOW/O¥¥SU'],
			['apollo', 'sabre', 'A/V/14AUGKIVMOW/SO|9U.SU', '1S14AUGKIVMOW/O¥¥9USU-V'],
			['apollo', 'sabre', 'A/V/14AUGKIVMOW/DO|9U.SU', '1S14AUGKIVMOW/O¥¥¥9USU-V'],
			['apollo', 'sabre', 'A20SEPKIVMOW/DO|9U.SU', '120SEPKIVMOW/O¥¥¥9USU'],
			['sabre', 'apollo', '120JUNKIVMOW/O¥¥¥SU', 'A20JUNKIVMOW/DO|SU'],
			['sabre', 'amadeus', '1S14AUGKIVMOW/O-V¥¥¥', 'AD/14AUGKIVMOW/O/CV'],
			['sabre', 'amadeus', '1S14AUGKIVMOW/O-V¥¥', 'AD/14AUGKIVMOW/O/CV'],
			['sabre', 'amadeus', '1S14AUGKIVMOW/O-V¥¥¥', 'AD/14AUGKIVMOW/O/CV'],
			['sabre', 'amadeus', '1S20SEPKIVMOW/O-V¥¥', 'AD/20SEPKIVMOW/O/CV'],
			['apollo', 'sabre', 'A/V/14AUGKIVMOW/SO|9U.SU', '1S14AUGKIVMOW/O¥¥9USU-V'],
			['apollo', 'sabre', 'A14AUGKIVMOW/DO|9U.SU', '114AUGKIVMOW/O¥¥¥9USU'],
			['apollo', 'sabre', 'A/V/14AUGKIVMOW/DO|9U.SU', '1S14AUGKIVMOW/O¥¥¥9USU-V'],
			['apollo', 'sabre', 'A/V/14AUGKIVMOW/SO|9U.SU', '1S14AUGKIVMOW/O¥¥9USU-V'],
			['apollo', 'sabre', 'A14AUGKIVMOW/SO|9U.SU', '114AUGKIVMOW/O¥¥9USU'],
			['apollo', 'sabre', 'A14AUGKIVMOW/DO|9U.SU', '114AUGKIVMOW/O¥¥¥9USU'],
			['apollo', 'sabre', 'A/V/14AUGKIVMOW/DO', '1S14AUGKIVMOW/O-V¥¥¥'],
			['apollo', 'sabre', 'A/V/14AUGKIVMOW/SO', '1S14AUGKIVMOW/O-V¥¥'],
			['sabre', 'apollo', '1S14AUGKIVMOW/O-V¥¥', 'A/V/14AUGKIVMOW/SO'],
			['sabre', 'apollo', '1S14AUGKIVMOW/O-V¥¥¥', 'A/V/14AUGKIVMOW/DO'],

			['apollo', 'sabre', '9D', '*B'],
			['apollo', 'sabre', '9D/S2', '*B2'],
			['apollo', 'sabre', '9V/DL401Y20SEPJFKLHR', '4G*DL401Y20SEPJFKLHR'],
			['apollo', 'sabre', '9S', '4GA/W'],
			['apollo', 'sabre', '9V/S1', '4G1*'],
			['apollo', 'sabre', '9S/A', '4GA/A'],
			['apollo', 'sabre', '9S/S1', '4G1/W'],
			['apollo', 'sabre', '9S/N2/A', '4GA/A-2.1'],
			['apollo', 'sabre', '9S/S1+2/A', '4G1,2/A'],
			['apollo', 'sabre', '9S/S1|2/A', '4G1,2/A'],
			['apollo', 'sabre', '9S/N3', '4GA/W-3.1'],
			['apollo', 'sabre', '9S/N1/S2', '4G2/W-1.1'],
			['apollo', 'sabre', '9S/N1/S2/A', '4G2/A-1.1'],
			['apollo', 'sabre', '9S/N1/S2/17A', '4G2/17A-1.1'],
			['apollo', 'sabre', '9X/S3/17A', '4GX3/17A'],
			['apollo', 'sabre', '9S/S2/17A18C', '4G2/17A18C'],
			['apollo', 'sabre', '9X/N2/S1', '4GX1-2.1'],
			['apollo', 'sabre', '9S/S2/17AB', '4G2/17A17B'],
			['apollo', 'sabre', '9X/S3', '4GX3'],
			['apollo', 'sabre', '9X', '4GXALL'],
			['apollo', 'sabre', '9X/N1-4/S2', null], // grouped pax 4.1 - untranslatable

			['sabre', 'apollo', '*B', '9D'],
			['sabre', 'apollo', '*B2', '9D/S2'],
			['sabre', 'apollo', '4G*DL401Y20SEPJFKLHR', '9V/DL401Y20SEPJFKLHR'],
			['sabre', 'apollo', '4GA/W', '9S'],
			['sabre', 'apollo', '4G1*', '9V/S1'],
			['sabre', 'apollo', '4GA/A', '9S/A'],
			['sabre', 'apollo', '4G1/W', '9S/S1'],
			['sabre', 'apollo', '4GA/A-2.1', '9S/N2/A'],
			['sabre', 'apollo', '4G1,2/A', '9S/S1|2/A'],
			['sabre', 'apollo', '4GA/W-3.1', '9S/N3'],
			['sabre', 'apollo', '4G2/W-1.1', '9S/N1/S2'],
			['sabre', 'apollo', '4G2/A-1.1', '9S/N1/S2/A'],
			['sabre', 'apollo', '4G2/17A-1.1', '9S/N1/S2/17A'],
			['sabre', 'apollo', '4GX3/17A', '9X/S3/17A'],
			['sabre', 'apollo', '4G2/17A18C', '9S/S2/17A18C'],
			['sabre', 'apollo', '4GX1-2.1', '9X/N2/S1'],
			['sabre', 'apollo', '4G2/17AB', '9S/S2/17A17B'],
			['sabre', 'apollo', '4GX3', '9X/S3'],
			['sabre', 'apollo', '4GXALL', '9X'],
			['sabre', 'apollo', '4GX2-1.1-4.1', '9X/N1|2|3|4/S2'],

			['apollo', 'amadeus', '9D', 'RTSTR'],
			['apollo', 'amadeus', '9D/S2', 'RTSTR/S2'],
			['apollo', 'amadeus', '9S/A', 'ST/A'],
			['apollo', 'amadeus', '9V/S1', 'SM1'],
			['apollo', 'amadeus', '9V/DL401Y20SEPJFKLHR', 'SMDL401/Y/20SEPJFKLHR'],
			['apollo', 'amadeus', '9S', 'ST/W'],
			['apollo', 'amadeus', '9S/S1', 'ST/W/S1'],
			['apollo', 'amadeus', '9S/S1+2/A', 'ST/A/S1,2'],
			['apollo', 'amadeus', '9S/S1|2/A', 'ST/A/S1,2'],
			['apollo', 'amadeus', '9X', 'SX'],
			['apollo', 'amadeus', '9S/N3', 'ST/W/P3'],
			['apollo', 'amadeus', '9S/N2/A', 'ST/A/P2'],
			['apollo', 'amadeus', '9S/N1/S2', 'ST/W/P1/S2'],
			['apollo', 'amadeus', '9S/N1/S2/A', 'ST/A/P1/S2'],
			['apollo', 'amadeus', '9S/N1/S2/17A', 'ST/17A/P1/S2'],
			['apollo', 'amadeus', '9S/S2/17A18C', 'ST/17A/18C/S2'],
			['apollo', 'amadeus', '9S/S2/17AB', 'ST/17A/17B/S2'],
			['apollo', 'amadeus', '9X/S3', 'SX/S3'],

			['sabre', 'amadeus', '*B', 'RTSTR'],
			['sabre', 'amadeus', '*B2', 'RTSTR/S2'],
			['sabre', 'amadeus', '4G*DL401Y20SEPJFKLHR', 'SMDL401/Y/20SEPJFKLHR'],
			['sabre', 'amadeus', '4G3/X', 'ST/B/S3'],
			['sabre', 'amadeus', '4GA/W-3.1', 'ST/W/P3'],
			['sabre', 'amadeus', '4GA/A-2.1', 'ST/A/P2'],
			['sabre', 'amadeus', '4G1*', 'SM1'],
			['sabre', 'amadeus', '4GA/X-1.1', 'ST/B/P1'],
			['sabre', 'amadeus', '4GA/W', 'ST/W'],
			['sabre', 'amadeus', '4G2/W-1.1', 'ST/W/P1/S2'],
			['sabre', 'amadeus', '4GA/A', 'ST/A'],
			['sabre', 'amadeus', '4G2/A-1.1', 'ST/A/P1/S2'],
			['sabre', 'amadeus', '4GA/X', 'ST/B'],
			['sabre', 'amadeus', '4G2/X-1.1', 'ST/B/P1/S2'],
			['sabre', 'amadeus', '4G1/W', 'ST/W/S1'],
			['sabre', 'amadeus', '4G2/17A-1.1', 'ST/17A/P1/S2'],
			['sabre', 'amadeus', '4G1,2/A', 'ST/A/S1,2'],
			['sabre', 'amadeus', '4G2/17A18C', 'ST/17A/18C/S2'],
			['sabre', 'amadeus', '4G2/17AB', 'ST/17A/17B/S2'],
			['sabre', 'amadeus', '4GXALL', 'SX'],
			['sabre', 'amadeus', '4GX3', 'SX/S3'],

			['amadeus', 'apollo', 'RTSTR', '9D'],
			['amadeus', 'apollo', 'RTSTR/S2', '9D/S2'],
			['amadeus', 'apollo', 'ST/A', '9S/A'],
			['amadeus', 'apollo', 'SM1', '9V/S1'],
			['amadeus', 'apollo', 'SMDL401/Y/20SEPJFKLHR', '9V/DL401Y20SEPJFKLHR'],
			['amadeus', 'apollo', 'ST/W', '9S'],
			['amadeus', 'apollo', 'ST/W/S1', '9S/S1'],
			['amadeus', 'apollo', 'ST/A/S1,2', '9S/S1|2/A'],
			['amadeus', 'apollo', 'SX', '9X'],
			['amadeus', 'apollo', 'ST/W/P3', '9S/N3'],
			['amadeus', 'apollo', 'ST/A/P2', '9S/N2/A'],
			['amadeus', 'apollo', 'ST/W/P1/S2', '9S/N1/S2'],
			['amadeus', 'apollo', 'ST/A/P1/S2', '9S/N1/S2/A'],
			['amadeus', 'apollo', 'ST/17A/P1/S2', '9S/N1/S2/17A'],
			['amadeus', 'apollo', 'ST/17A/18C/S2', '9S/S2/17A18C'],
			['amadeus', 'apollo', 'ST/17AB/S2', '9S/S2/17A17B'],
			['amadeus', 'apollo', 'SX/S3', '9X/S3'],
			['amadeus', 'sabre', 'RTSTR', '*B'],
			['amadeus', 'sabre', 'RTSTR/S2', '*B2'],
			['amadeus', 'sabre', 'SMDL401/Y/20SEPJFKLHR', '4G*DL401Y20SEPJFKLHR'],
			['amadeus', 'sabre', 'ST/B/S3', '4G3/X'],
			['amadeus', 'sabre', 'ST/W/P3', '4GA/W-3.1'],
			['amadeus', 'sabre', 'ST/A/P2', '4GA/A-2.1'],
			['amadeus', 'sabre', 'SM1', '4G1*'],
			['amadeus', 'sabre', 'ST/A/P1', '4GA/A-1.1'],
			['amadeus', 'sabre', 'ST/W', '4GA/W'],
			['amadeus', 'sabre', 'ST/W/P1/S2', '4G2/W-1.1'],
			['amadeus', 'sabre', 'ST/A', '4GA/A'],
			['amadeus', 'sabre', 'ST/A/P1/S2', '4G2/A-1.1'],
			['amadeus', 'sabre', 'ST/B', '4GA/X'],
			['amadeus', 'sabre', 'ST/B/P1/S2', '4G2/X-1.1'],
			['amadeus', 'sabre', 'ST/W/S1', '4G1/W'],
			['amadeus', 'sabre', 'ST/17A/P1/S2', '4G2/17A-1.1'],
			['amadeus', 'sabre', 'ST/A/S1,2', '4G1,2/A'],
			['amadeus', 'sabre', 'ST/17A/18C/S2', '4G2/17A18C'],
			['amadeus', 'sabre', 'ST/17AB/S2', '4G2/17A17B'],
			['amadeus', 'sabre', 'SX', '4GXALL'],
			['amadeus', 'sabre', 'SX/S3', '4GX3'],

			['apollo', 'sabre', 'FS', 'WPNI'],
			['apollo', 'sabre', 'FS//D', 'WPNI/D'],
			['apollo', 'sabre', 'FS//+DL.AF.KL', 'WPNI/ADLAFKL'],
			['apollo', 'sabre', 'FSS1+2', 'WPNI¥S1/2'],
			['apollo', 'sabre', 'FS//*JCB', 'WPNI¥PJCB'],
			['apollo', 'sabre', 'FS//*ITX', 'WPNI¥PITX'],

			['sabre', 'apollo', 'WPNI', 'FS'],
			['sabre', 'apollo', 'WPNI/D', 'FS//D'],
			['sabre', 'apollo', 'WPNI/ADLAFKL', 'FS//|DL.AF.KL'],
			['sabre', 'apollo', 'WPNI¥S1/2', 'FSS1|2'],
			['sabre', 'apollo', 'WPNI¥PJCB', 'FS//*JCB'],
			['sabre', 'apollo', 'WPNI¥PITX', 'FS//*ITX'],

			['apollo', 'sabre', '*FS', 'WPNI*'],
			['sabre', 'apollo', 'WPNI*', '*FS'],
			['apollo', 'sabre', 'FSA', 'WPNIS'],
			['sabre', 'apollo', 'WPNIS', 'FSA'],
			['apollo', 'sabre', 'FS//@C', 'WPNI¥TC-BB'],
			['apollo', 'sabre', 'FS//@F', 'WPNI¥TC-FB'],
			['apollo', 'sabre', 'FS//@Y', 'WPNI¥TC-YB'],
			['apollo', 'sabre', 'FS//@W', 'WPNI¥TC-SB'],
			['apollo', 'sabre', 'FS//@P', 'WPNI¥TC-PB'],
			['sabre', 'apollo', 'WPNI¥TC-BB', 'FS//@C'],
			['sabre', 'apollo', 'WPNI¥TC-FB', 'FS//@F'],
			['sabre', 'apollo', 'WPNI¥TC-YB', 'FS//@Y'],
			['sabre', 'apollo', 'WPNI¥TC-SB', 'FS//@W'],
			['sabre', 'apollo', 'WPNI¥TC-PB', 'FS//@P'],
			['apollo', 'sabre', 'FS//+/*A', 'WPNI/A*A'],
			['apollo', 'sabre', 'FS//-3', 'WPNI¥M3'],
			['apollo', 'sabre', 'FS//+3', 'WPNI¥P3'],
			['apollo', 'sabre', 'FS//D4', 'WPNI/T4'],
			['sabre', 'apollo', 'WPNI/A*A', 'FS//|/*A'],
			['sabre', 'apollo', 'WPNI¥M3', 'FS//-3'],
			['sabre', 'apollo', 'WPNI¥P3', 'FS//|3'],
			['sabre', 'apollo', 'WPNI/T4', 'FS//D4'],
			['apollo', 'sabre', 'FS03', 'WC¥03X'],
			['sabre', 'apollo', 'WC¥3X', 'FS3'],
			['apollo', 'sabre', 'FS:CAD', 'WPNI¥MCAD'],
			['sabre', 'apollo', 'WPNI¥MCAD', 'FS:CAD'],
			['apollo', 'sabre', '$BB:15JUN17', 'WPNC¥B15JUN17'],
			['sabre', 'apollo', 'WPNC¥B15JUN17', '$BB:15JUN17'],
			['sabre', 'apollo', 'WPQWV3XPCIT¥PITX', '$B@WV3XPCIT/*ITX'],
			['sabre', 'apollo', 'WPQWV3XPCIT¥PJCB', '$B@WV3XPCIT/*JCB'],
			['sabre', 'apollo', 'WPPJCB¥QWV3XPCIT', '$B*JCB/@WV3XPCIT'],
			['sabre', 'apollo', 'WPPITX¥QWV3XPCIT', '$B*ITX/@WV3XPCIT'],

			['apollo', 'amadeus', '*TE/0161234567890', 'TWD/016-1234567890'],
			['amadeus', 'apollo', 'TWD/016-1234567890', '*TE/0161234567890'],

			['apollo', 'sabre', '$DNYCMNL28NOV17T12MAR17+DL-N', 'FQ12MAR17NYCMNL28NOV17-DL¥BN'],
			['apollo', 'sabre', '$DNYCMNL28NOV17T12MAR17:RT+DL-M', 'FQ12MAR17NYCMNL28NOV17-DL¥RT¥BM'],
			['sabre', 'apollo', 'FQ12MAR17NYCMNL28NOV17-DL¥BN', '$DNYCMNL28NOV17T12MAR17|DL-N'],
			['sabre', 'apollo', 'FQ12MAR17NYCMNL28NOV17-DL¥RT¥BM', '$DNYCMNL28NOV17T12MAR17|DL:RT-M'],
			['apollo', 'amadeus', '$DNYCMNL28NOV17T12MAR17+DL-N', 'FQDNYCMNL/28NOV17/R,12MAR17/ADL/CN'],
			['apollo', 'amadeus', '$DNYCMNL28NOV17T12MAR17:RT+DL-M', 'FQDNYCMNL/28NOV17/R,12MAR17/ADL/IR/CM'],
			['sabre', 'amadeus', 'FQ12MAR17NYCMNL28NOV17-DL¥BN', 'FQDNYCMNL/28NOV17/R,12MAR17/ADL/CN'],
			['sabre', 'amadeus', 'FQ12MAR17NYCMNL28NOV17-DL¥RT¥BM', 'FQDNYCMNL/28NOV17/R,12MAR17/ADL/IR/CM'],
			['amadeus', 'apollo', 'FQDNYCMNL/28NOV17/R,12MAR17/ADL/CN', '$DNYCMNL28NOV17T12MAR17|DL-N'],
			['amadeus', 'apollo', 'FQDNYCMNL/28NOV17/R,12MAR17/IR/ADL/CM', '$DNYCMNL28NOV17T12MAR17:RT|DL-M'],
			['amadeus', 'sabre', 'FQDNYCMNL/28NOV17/R,12MAR17/ADL/CN', 'FQ12MAR17NYCMNL28NOV17-DL¥BN'],
			['amadeus', 'sabre', 'FQDNYCMNL/28NOV17/R,12MAR17/IR/ADL/CM', 'FQ12MAR17NYCMNL28NOV17-DL¥RT¥BM'],

			// instead of '-EMANUEL/MADISON ROSE'
			['apollo', 'sabre', 'N:EMANUEL/MADISON ROSE*P-C11', '-EMANUEL/MADISON ROSE*P-C11'],
			// instead of '-I/EAGEN/KATY*12JAN14'
			['apollo', 'sabre', 'N:I/EAGEN/KATY*12JAN14', '-I/EAGEN/KATY*DOB12JAN14'],

			['apollo',  'sabre',   'F:PS0186/02JAN', '2PS0186/02JAN'],
			['apollo',  'amadeus', 'F:PS0186/02JAN', 'DOPS0186/02JAN'],
			['amadeus', 'sabre',   'DOPS0186/02JAN', '2PS0186/02JAN'],
			['amadeus', 'apollo',  'DOPS0186/02JAN', 'F:PS0186/02JAN'],

			// caused warning - should not anymore
			['apollo', 'galileo', 'A22JUNMUCBOS|LH', 'AJ22JUNMUCBOS/LH#'],
			['apollo', 'galileo', '$B', 'FQ'],
			['apollo', 'galileo', '$D10MAYKIVRIX', 'FD10MAYKIVRIX'],
			['apollo', 'galileo', '9S', 'S.NW'],
			['apollo', 'anyOtherGds', 'A22JUNMUCBOS|LH', null],
			['galileo', 'apollo', 'FQ', '$B'],

			['apollo', 'amadeus', 'SEM/SFO1S21D2/AG', 'JUM/O-SFO1S21D2'],

			// availability commands follow

			// A{date]{from}{to} -> A{date]{from}{to}
			['apollo', 'galileo', 'A20SEPKIVRIX', 'AJ20SEPKIVRIX', true],
			// A{date]{from}{to}{time} -> A{date]{from}{to}{time}
			['apollo', 'galileo', 'A20SEPKIVRIX6P', 'AJ20SEPKIVRIX.6P', true],
			// A{date]{from}{to}+{al1}.{al2}.{al3} -> A{date]{from}{to}/{al1}/{al2}/{al3}
			['apollo', 'galileo', 'A20SEPKIVRIX+9U.BT.SU', 'AJ20SEPKIVRIX/9U#/BT#/SU#', true],
			// A{date]{from}{to}{time}{cCity}+{al}.{al2}.{al3} -> A{date]{from}{to}.{time}.{cCity}/{al}/{al2}/{al3}
			['apollo', 'galileo', 'A20SEPNYCSFO12AMSP+UA.AA.DL', 'AJ20SEPNYCSFO.12A.MSP/UA#/AA#/DL#', true],
			// A{date]{from}{to}{time}{cCity1}.{cCity2}+{al}.{al2}.{al3} -> A{date}{from}{to}.{time}.{ccity1}.{ccity2}/{al1}/{al2}
			['apollo', 'galileo', 'A20SEPNYCSFO12AMSP.CHI+UA.AA', 'AJ20SEPNYCSFO.12A.MSP.CHI/UA#/AA#', true],
			// A{date]{from}{to}+{al} -> A{date]{from}{to}/{al}
			['apollo', 'galileo', 'A20SEPKIVRIX+BT', 'AJ20SEPKIVRIX/BT#', true],
			// A{date}{from}{to}/D+{al1}.{al2} -> A{date}{from}{to}.D0/{al1}/{al2}
			['apollo', 'galileo', 'A20SEPKIVMOW/D+9U.SU', 'AJ20SEPKIVMOW.D0/9U#/SU#', true],

			// L¤{al}/A{date}{from}{to} -> A{date}{from}{to}*{al}
			['apollo', 'galileo', 'L\u00A4S7/A15SEPKIVMOW', 'AJ15SEPKIVMOW*S7', true],
			// L¤{al}/A{date}{from}{to}{time} -> A{date}{from}{to}.{time}*{al}
			['apollo', 'galileo', 'L\u00A4S7/A15SEPKIVMOW12A', 'AJ15SEPKIVMOW.12A*S7', true],
			// L¤{al}/A* -> AM*{al}
			['apollo', 'galileo', 'L\u00A4S7/A*', 'AM*S7', true],
			// A{date]{from}{to}-{al1}.{al2}.{al3} -> A{date}{from}{to}/{al1}-/{al2}-/{al3}-
			['apollo', 'galileo', 'A20SEPKIVRIX-9U.BT.SU', 'AJ20SEPKIVRIX/9U-/BT-/SU-', true],
			// A/{class}/{date}{from}{to}+{al} -> A{date}{from}{to}/{al}@{class}
			['apollo', 'galileo', 'A/T/20SEPLAXMNL+DL', 'AJ20SEPLAXMNL/DL#@T', true],
			// A/{class}{seatsNum}/{date}{from}{to}+{al} -> A{date}{from}{to}/{al}@{seatsNum}{class}
			['apollo', 'galileo', 'A/U8/17JULSFOJNB+DL', 'AJ17JULSFOJNB/DL#@8U', true],
			// A/{class}/{date}{from}{to}{time}{cCity}+{al}.{al2}.{al3} -> A{date}{from}{to}{time}{cCity}/{al}@{class}
			['apollo', 'galileo', 'A/T/20SEPLAXMNL12ASFO+DL', 'AJ20SEPLAXMNL.12A.SFO/DL#@T', true],
			// A/{class}{seatsNum}/{date}{from}{to}{time}{cCity}+{al}.{al2}.{al3} -> A{date}{from}{to}{time}{cCity}/{al}@{seatNum}{class}
			['apollo', 'galileo', 'A/T8/20SEPLAXMNL12ASFO+DL', 'AJ20SEPLAXMNL.12A.SFO/DL#@8T', true],
			// A{date}{from}{to}{time}-{cCity1}{cCity2} -> A{date}{from}{to}.{time}.{cCity1}-.{cCity2}-
			['apollo', 'galileo', 'A20SEPLAXMNL12A-DTW/SEA', 'AJ20SEPLAXMNL.12A.DTW-.SEA-', true],
			['apollo', 'sabre', 'A20SEPLAXMNL12A-DTW/SEA', '120SEPLAXMNL12A*DTW/SEA', true],
			['apollo', 'amadeus', 'A20SEPLAXMNL12A-DTW/SEA', 'AD20SEPLAXMNL12A/X-DTW,SEA', true],
			// A{date}{from}{to}+/*{allianceCode} -> A{date}{from}{to}//*{allianceCode}
			['apollo', 'galileo', 'A20NOVSFOACC+/*A', 'AJ20NOVSFOACC//*A', true],
			// A{date}{from}{to}{time}{cCity1}+/*{allianceCode} -> A{date}{from}{to}.{time}.{cCity}//*{allianceCode}
			['apollo', 'galileo', 'A20SEPSFOACC12ANYC+/*S', 'AJ20SEPSFOACC.12A.NYC//*S', true],
			// A{date}{from}{to}{time}{cCity1}.{cCity2}+/*{allianceCode} -> A{date}{from}{to}.{time}.{cCity1}.{cCity2}//*{allianceCode}
			['apollo', 'galileo', 'A20SEPSFOACC12ANYC.AMS+/*S', 'AJ20SEPSFOACC.12A.NYC.AMS//*S', true],
			// A{date}{from}{to}{time}{cCity1}+/*{allianceCode} -> A{date}{from}{to}.{time}.{cCity}//*{allianceCode}@{class}
			['apollo', 'galileo', 'A/K/20SEPSFOACC12ANYC+/*S', 'AJ20SEPSFOACC.12A.NYC//*S@K', true],
			// A{date}{from}{to}{time}{cCity1}.{cCity2}+/*{allianceCode} -> A{date}{from}{to}.{time}.{cCity1}.{cCity2}//*{allianceCode}@{class}
			['apollo', 'galileo', 'A/K/20SEPSFOACC12ANYC.AMS+/*S', 'AJ20SEPSFOACC.12A.NYC.AMS//*S@K', true],
			['apollo', 'galileo', 'A*', 'A*', true],
			['apollo', 'galileo', 'A-', 'A*P', true],
			['apollo', 'galileo', 'A*R', 'A*O', true],
			['apollo', 'galileo', 'A*C', 'A*R'],
			// A*{date} -> A{date}
			['apollo', 'galileo', 'A*20SEP', 'A20SEP', true],
			// A*{time} -> A.{time}
			['apollo', 'galileo', 'A*6P', 'A.6P', true],
			// A*{time} -> A.{time}
			['apollo', 'galileo', 'A*6PM', 'A.6P'],
			// A*+{numberofDays} -> A#{numberofDays}
			['apollo', 'galileo', 'A*+5', 'A#5', true],
			// A*-{numberofDays} -> A-{numberofDays}
			['apollo', 'galileo', 'A*-5', 'A-5', true],
			// A*X{cCity} -> A.{cCity}
			['apollo', 'galileo', 'A*XDTW', 'A.DTW', true],
			// A*X{cCity1}{cCity2} -> A.{cCity1}.{cCity2}
			['apollo', 'galileo', 'A*XNYCDTW', 'A.NYC.DTW', true],
			// A*X-{cCity} -> A.{cCity}-
			['apollo', 'galileo', 'A*X-DTW', 'A.DTW-', true],
			// A*X-{cCity1}{cCity2} -> A.{cCity1}{cCity2}-
			['apollo', 'galileo', 'A*X-NYCDTW', 'A.NYCDTW-', true],

			// A*O{rDate} -> AR{rDate}
			['apollo', 'galileo', 'A*O25JUN', 'AR25JUN', true],
			// A*D{arrivalCity} -> AO{arrivalCity}
			['apollo', 'galileo', 'A*DDTW', 'AODTW', true],
			// A*B{departureCity} -> AB{departureCity}
			['apollo', 'galileo', 'A*BDTW', 'ABDTW', true],
			// A*+{al} -> A/{al}
			['apollo', 'galileo', 'A*+DL', 'A/DL', true],
			// A*-{al} -> A/{al}-
			['apollo', 'galileo', 'A*-UA', 'A/UA-', true],
			// A*+{al1}.{al2} -> A/{al1}/{al2}
			['apollo', 'galileo', 'A*+DL.SU', 'A/DL/SU', true],
			// A*-{al1}.{al2}.{al3} -> A/{al1}-/{al2}-/{al3}-
			['apollo', 'galileo', 'A*-UA.BT.PS', 'A/UA-/BT-/PS-', true],
			// A*C{segNum}  -> A@#{segNum}
			['apollo', 'galileo', 'A*C1', 'A@#1', true],

			// tariff display commands follow

			// $D{date}{from}{to} -> FD{date}{from}{to}
			['apollo', 'galileo', '$D20SEPKIVRIX', 'FD20SEPKIVRIX', true],
			// $D{date}{from}{to}:OW -> FD{date}{from}{to}-OW
			['apollo', 'galileo', '$D20SEPKIVRIX:OW', 'FD20SEPKIVRIX-OW', true],
			// $D{date}{from}{to}+{al}+{al2}+{al3}:OW -> FD{date}{from}{to}/{al1}/{al2}/{al3}-OW
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO:OW', 'FD20SEPKIVRIX/PS/TK/LO-OW', true],
			// $D{date}{from}{to}:OW+{al}+{al2}+{al3} -> FD{date}{from}{to}-OW/{al1}/{al2}/{al3}
			['apollo', 'galileo', '$D20SEPKIVRIX:OW+PS+TK+LO', 'FD20SEPKIVRIX-OW/PS/TK/LO', true],
			// $D{date}{from}{to}:OW¤Y -> FD{date}{from}{to}/{al1}/{al2}/{al3}-OW@Y
			['apollo', 'galileo', '$D20SEPKIVRIX:OW+PS+TK+LO\u00A4Y', 'FD20SEPKIVRIX-OW/PS/TK/LO@Y', true],
			// $D{date}{from}{to}¤Y:OW -> FD{date}{from}{to}/{al1}/{al2}/{al3}@Y-OW
			['apollo', 'galileo', '$D20SEPKIVRIX\u00A4Y+PS+TK+LO:OW', 'FD20SEPKIVRIX@Y/PS/TK/LO-OW', true],
			// $D{date}{from}{to}:OW¤W -> FD{date}{from}{to}/{al1}/{al2}/{al3}-OW@W
			['apollo', 'galileo', '$D20SEPKIVRIX:OW+PS+TK+LO\u00A4W', 'FD20SEPKIVRIX-OW/PS/TK/LO@W', true],
			// $D{date}{from}{to}¤W:OW -> FD{date}{from}{to}/{al1}/{al2}/{al3}@W-OW
			['apollo', 'galileo', '$D20SEPKIVRIX\u00A4W+PS+TK+LO:OW', 'FD20SEPKIVRIX@W/PS/TK/LO-OW', true],
			// $D{date}{from}{to}:OW¤C -> FD{date}{from}{to}/{al1}/{al2}/{al3}-OW@C
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO:OW\u00A4C', 'FD20SEPKIVRIX/PS/TK/LO-OW@C', true],
			// $D{date}{from}{to}¤C:OW -> FD{date}{from}{to}/{al1}/{al2}/{al3}@C-OW
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO\u00A4C:OW', 'FD20SEPKIVRIX/PS/TK/LO@C-OW', true],
			// $D{date}{from}{to}:OW¤F -> FD{date}{from}{to}/{al1}/{al2}/{al3}-OW@F
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO:OW\u00A4F', 'FD20SEPKIVRIX/PS/TK/LO-OW@F', true],
			// $D{date}{from}{to}¤F:OW -> FD{date}{from}{to}/{al1}/{al2}/{al3}@F-OW
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO\u00A4F:OW', 'FD20SEPKIVRIX/PS/TK/LO@F-OW', true],
			// $D{date}{from}{to}+{al}+{al2}+{al3}:RT -> FD{date}{from}{to}/{al1}/{al2}/{al3}-RT
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO:RT', 'FD20SEPKIVRIX/PS/TK/LO-RT', true],
			// $D{date}{from}{to}:RT+{al}+{al2}+{al3} -> FD{date}{from}{to}-RT/{al1}/{al2}/{al3}
			['apollo', 'galileo', '$D20SEPKIVRIX:RT+PS+TK+LO', 'FD20SEPKIVRIX-RT/PS/TK/LO', true],
			// $D{date}{from}{to}:RT¤Y -> FD{date}{from}{to}/{al1}/{al2}/{al3}-RT@Y
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO:RT\u00A4Y', 'FD20SEPKIVRIX/PS/TK/LO-RT@Y', true],
			// $D{date}{from}{to}¤Y:RT -> FD{date}{from}{to}/{al1}/{al2}/{al3}@Y-RT
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO\u00A4Y:RT', 'FD20SEPKIVRIX/PS/TK/LO@Y-RT', true],
			// $D{date}{from}{to}:RT¤W -> FD{date}{from}{to}/{al1}/{al2}/{al3}-RT@W
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO:RT\u00A4W', 'FD20SEPKIVRIX/PS/TK/LO-RT@W', true],
			// $D{date}{from}{to}¤W:RT -> FD{date}{from}{to}/{al1}/{al2}/{al3}@W-RT
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO\u00A4W:RT', 'FD20SEPKIVRIX/PS/TK/LO@W-RT', true],
			// $D{date}{from}{to}:RT¤C -> FD{date}{from}{to}/{al1}/{al2}/{al3}-RT@C
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO:RT\u00A4C', 'FD20SEPKIVRIX/PS/TK/LO-RT@C', true],
			// $D{date}{from}{to}¤C:RT -> FD{date}{from}{to}/{al1}/{al2}/{al3}@C-RT
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO\u00A4C:RT', 'FD20SEPKIVRIX/PS/TK/LO@C-RT', true],
			// $D{date}{from}{to}:RT¤F -> FD{date}{from}{to}/{al1}/{al2}/{al3}-RT@F
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO:RT\u00A4F', 'FD20SEPKIVRIX/PS/TK/LO-RT@F', true],
			// $D{date}{from}{to}¤F:RT -> FD{date}{from}{to}/{al1}/{al2}/{al3}@F-RT
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO\u00A4F:RT', 'FD20SEPKIVRIX/PS/TK/LO@F-RT', true],
			// $DV{date}{from}{to}{rDate} -> FD{from}{to}V{date}{rDate}
			['apollo', 'galileo', '$DV20SEPKIVRIX05JUL', 'FDKIVRIXV20SEP05JUL', true],
			// $D{date}{from}{to}+{al}+{al2}+{al3} -> FD{date}{from}{to}/PS
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO', 'FD20SEPKIVRIX/PS/TK/LO', true],
			// $DV{date}{from}{to}{rDate}+{al}+{al2}+{al3} -> FD{from}{to}{date}V{rDate}/{al1}/{al2}/{al3}
			['apollo', 'galileo', '$DV20SEPKIVRIX05JUL+PS+TK+LO', 'FDKIVRIXV20SEP05JUL/PS/TK/LO', true],
			// $D{date}{from}{to}¤Y -> FD{date}{from}{to}@Y
			['apollo', 'galileo', '$D20SEPKIVRIX\u00A4Y', 'FD20SEPKIVRIX@Y', true],
			// $D{date}{from}{to}¤W -> FD{date}{from}{to}@W
			['apollo', 'galileo', '$D20SEPKIVRIX\u00A4W', 'FD20SEPKIVRIX@W', true],
			// $D{date}{from}{to}¤C -> FD{date}{from}{to}@C
			['apollo', 'galileo', '$D20SEPKIVRIX\u00A4C', 'FD20SEPKIVRIX@C', true],
			// $D{date}{from}{to}¤F -> FD{date}{from}{to}@F
			['apollo', 'galileo', '$D20SEPKIVRIX\u00A4F', 'FD20SEPKIVRIX@F', true],
			// $D{date}{from}{to}+{al1}+{al2}¤Y -> FD{date}{from}{to}/{al1}/{al2}@Y
			['apollo', 'galileo', '$D20SEPKIVRIX+9U+PS\u00A4Y', 'FD20SEPKIVRIX/9U/PS@Y', true],
			// $D{date}{from}{to}¤Y+{al1}+{al2} -> FD{date}{from}{to}@Y/{al1}/{al2}
			['apollo', 'galileo', '$D20SEPKIVRIX\u00A4Y+9U+PS', 'FD20SEPKIVRIX@Y/9U/PS', true],
			// $D{date}{from}{to}+{al1}+{al2}¤W -> FD{date}{from}{to}/{al1}/{al2}@W
			['apollo', 'galileo', '$D20SEPKIVRIX+9U+PS\u00A4W', 'FD20SEPKIVRIX/9U/PS@W', true],
			// $D{date}{from}{to}¤W+{al1}+{al2} -> FD{date}{from}{to}@W/{al1}/{al2}
			['apollo', 'galileo', '$D20SEPKIVRIX\u00A4W+9U+PS', 'FD20SEPKIVRIX@W/9U/PS', true],
			// $D{date}{from}{to}+{al1}+{al2}¤C -> FD{date}{from}{to}/{al1}/{al2}@C
			['apollo', 'galileo', '$D20SEPKIVRIX+9U+PS\u00A4C', 'FD20SEPKIVRIX/9U/PS@C', true],
			// $D{date}{from}{to}¤C+{al1}+{al2} -> FD{date}{from}{to}@C/{al1}/{al2}
			['apollo', 'galileo', '$D20SEPKIVRIX\u00A4C+9U+PS', 'FD20SEPKIVRIX@C/9U/PS', true],
			// $D{date}{from}{to}+{al1}+{al2}¤F -> FD{date}{from}{to}/{al1}/{al2}@F
			['apollo', 'galileo', '$D20SEPKIVRIX+9U+PS\u00A4F', 'FD20SEPKIVRIX/9U/PS@F', true],
			// $D{date}{from}{to}¤F+{al1}+{al2} -> FD{date}{from}{to}@F/{al1}/{al2}
			['apollo', 'galileo', '$D20SEPKIVRIX\u00A4F+9U+PS', 'FD20SEPKIVRIX@F/9U/PS', true],
			// $D{from}{to}{tvlDate}T{issueDate}+{al} -> FD{tvlDate}{from}{to}.T{issueDate}/{al}
			['apollo', 'galileo', '$DNYCMNL28NOV17T12MAR17+DL', 'FD28NOV17NYCMNL.T12MAR17/DL'],
			// $D{from}{to}{tvlDate}T{issueDate}+{al}-{class} -> FD{tvlDate}{from}{to}.T{issueDate}-{class}/{al}
			['apollo', 'galileo', '$DNYCMNL28NOV17T12MAR17+DL-X', 'FD28NOV17NYCMNL.T12MAR17/DL-X'],
			// $D{from}{to}{tvlDate}T{issueDate}:RT+{al}-{class} -> FD{tvlDate}{from}{to}{issueDate}-RT.T-{class}/{al}
			['apollo', 'galileo', '$DNYCMNL28NOV17T12MAR17:RT+DL-M', 'FD28NOV17NYCMNL.T12MAR17-RT/DL-M'],
			// $D{date}{from}{to}:{currency} -> FD{date}{from}{to}:{currency}
			['apollo', 'galileo', '$D20SEPKIVRIX:CAD', 'FD20SEPKIVRIX:CAD', true],
			// $D{date}{from}{to}:{currency}+{al}+{al2}+{al3} -> FD{date}{from}{to}:{currency}/{al1}/{al2}/{al3}
			['apollo', 'galileo', '$D20SEPKIVRIX:CAD+PS+TK+LO', 'FD20SEPKIVRIX:CAD/PS/TK/LO', true],
			// $D{date}{from}{to}+{al}+{al2}+{al3}:{currency} -> FD{date}{from}{to}/{al1}/{al2}/{al3}:{currency}
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO:CAD', 'FD20SEPKIVRIX/PS/TK/LO:CAD', true],
			// $DV{date}{from}{to}{rDate}+{al}+{al2}+{al3}:{currency} -> FD{from}{to}{date}V{rDate}/{al1}/{al2}/{al3}:{currency}
			['apollo', 'galileo', '$DV20SEPKIVRIX05JUL+PS+TK+LO:CAD', 'FDKIVRIXV20SEP05JUL/PS/TK/LO:CAD', true],
			// $DV{date}{from}{to}{rDate}:{currency}+{al}+{al2}+{al3} -> FD{from}{to}{date}V{rDate}:{currency}/{al1}/{al2}/{al3}
			['apollo', 'galileo', '$DV20SEPKIVRIX05JUL:CAD+PS+TK+LO', 'FDKIVRIXV20SEP05JUL:CAD/PS/TK/LO', true],
			// $DV{date}{from}{to}{rDate}:{currency} -> FD{from}{to}V{date}{rDate}:{currency}
			['apollo', 'galileo', '$DV20SEPKIVRIX05JUL:CAD', 'FDKIVRIXV20SEP05JUL:CAD', true],
			// $D{date}{from}{to}¤Y:{currency} -> FD{date}{from}{to}@Y:{currency}
			['apollo', 'galileo', '$D20SEPKIVRIX\u00A4Y:CAD', 'FD20SEPKIVRIX@Y:CAD', true],
			// $D{date}{from}{to}:{currency}¤Y -> FD{date}{from}{to}:{currency}@Y
			['apollo', 'galileo', '$D20SEPKIVRIX:CAD\u00A4Y', 'FD20SEPKIVRIX:CAD@Y', true],
			// $D{date}{from}{to}¤W:{currency} -> FD{date}{from}{to}@W:{currency}
			['apollo', 'galileo', '$D20SEPKIVRIX\u00A4W:CAD', 'FD20SEPKIVRIX@W:CAD', true],
			// $D{date}{from}{to}:{currency}¤W -> FD{date}{from}{to}:{currency}@W
			['apollo', 'galileo', '$D20SEPKIVRIX:CAD\u00A4W', 'FD20SEPKIVRIX:CAD@W', true],
			// $D{date}{from}{to}¤C:{currency} -> FD{date}{from}{to}@C:{currency}
			['apollo', 'galileo', '$D20SEPKIVRIX\u00A4C:CAD', 'FD20SEPKIVRIX@C:CAD', true],
			// $D{date}{from}{to}:{currency}¤C -> FD{date}{from}{to}:{currency}@C
			['apollo', 'galileo', '$D20SEPKIVRIX:CAD\u00A4C', 'FD20SEPKIVRIX:CAD@C', true],
			// $D{date}{from}{to}¤F:{currency} -> FD{date}{from}{to}@F:{currency}
			['apollo', 'galileo', '$D20SEPKIVRIX\u00A4F:CAD', 'FD20SEPKIVRIX@F:CAD', true],
			// $D{date}{from}{to}:{currency}¤F -> FD{date}{from}{to}:{currency}@F
			['apollo', 'galileo', '$D20SEPKIVRIX:CAD\u00A4F', 'FD20SEPKIVRIX:CAD@F', true],
			// $D{from}{to}{tvlDate}T{issueDate}+{al}:{currency} -> FD{tvlDate}{from}{to}.T{issueDate}/{al}:{currency}
			['apollo', 'galileo', '$DNYCMNL28NOV17T12MAR17+DL:CAD', 'FD28NOV17NYCMNL.T12MAR17/DL:CAD'],
			// $D{from}{to}{tvlDate}T{issueDate}:{currency}+{al} -> FD{tvlDate}{from}{to}.T{issueDate}:{currency}/{al}
			['apollo', 'galileo', '$DNYCMNL28NOV17T12MAR17:CAD+DL', 'FD28NOV17NYCMNL.T12MAR17:CAD/DL'],
			// $D{from}{to}{tvlDate}T{issueDate}:{currency} -> FD{tvlDate}{from}{to}.T{issueDate}:{currency}
			['apollo', 'galileo', '$DNYCMNL28NOV17T12MAR17:CAD', 'FD28NOV17NYCMNL.T12MAR17:CAD'],
			// $D{date}{from}{to}-{PTC} -> FD{date}{from}{to}*{PTC}
			['apollo', 'galileo', '$D10SEPPITMIL-PFA', 'FD10SEPPITMIL*PFA', true],
			// $D{date}{from}{to}-JCB -> FD{date}{from}{to}*JCB
			['apollo', 'galileo', '$D10SEPPITMIL-JCB', 'FD10SEPPITMIL*JCB', true],
			// $D{date}{from}{to}+{al1}+{al2}+{al3}-JCB -> FD{date}{from}{to}/{al1}/{al2}/{al3}*JCB
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO-JCB', 'FD20SEPKIVRIX/PS/TK/LO*JCB', true],
			// $DV{date}{from}{to}{rDate}-JCB -> FD{from}{to}V{date}{rDate}*JCB
			['apollo', 'galileo', '$DV10SEPPITMIL27SEP-JCB', 'FDPITMILV10SEP27SEP*JCB', true],
			// $D{date}{from}{to}-ITX -> FD{date}{from}{to}*ITX
			['apollo', 'galileo', '$D10SEPPITMIL-ITX', 'FD10SEPPITMIL*ITX', true],
			// $D{date}{from}{to}+{al1}+{al2}+{al3}-ITX -> FD{date}{from}{to}/{al1}/{al2}/{al3}*ITX
			['apollo', 'galileo', '$D10SEPPITMIL+PS+TK+LO-ITX', 'FD10SEPPITMIL/PS/TK/LO*ITX', true],
			// $D{date}{from}{to}:N -> FD{date}{from}{to}:N
			['apollo', 'galileo', '$D15JANNYCIST:N', 'FD15JANNYCIST:N', true],
			// $D{date}{from}{to}/:N -> FD{date}{from}{to}:N
			['apollo', 'galileo', '$D15JANNYCIST/:N', 'FD15JANNYCIST:N'],
			// $D{date}{from}{to}:A -> FD{date}{from}{to}:A
			['apollo', 'galileo', '$D15JANNYCIST:A', 'FD15JANNYCIST:A', true],
			// $D{date}{from}{to}/:A -> FD{date}{from}{to}:A
			['apollo', 'galileo', '$D15JANNYCIST/:A', 'FD15JANNYCIST:A'],
			// $D{date}{from}{to}+{al}+{al2}+{al3}:N -> FD{date}{from}{to}/{al1}/{al2}/{al3}:N
			['apollo', 'galileo', '$D20SEPKIVRIX+PS+TK+LO:N', 'FD20SEPKIVRIX/PS/TK/LO:N', true],
			['apollo', 'galileo', '$D', 'FD*', true],
			// $D+{al} -> FD/{al}
			['apollo', 'galileo', '$D+PS', 'FD/PS', true],
			// $DB{departureCityCode} -> FDO{destinationCityCode}
			['apollo', 'galileo', '$DBATL', 'FDOATL', true],
			// $DD{destinationCityCode} -> FDD{destinationCityCode}
			['apollo', 'galileo', '$DDPAR', 'FDDPAR', true],
			// $V{fareNum} -> FN*{fareNum}
			['apollo', 'galileo', '$V1', 'FN*1', true],
			// $V{fareNum}/{ruleCat}      -> FN*{fareNum}/{ruleCat}
			['apollo', 'galileo', '$V3/16', 'FN*3/16', true],
			// $V{fareNum}/S -> FN*{fareNum}/S
			['apollo', 'galileo', '$V1/S', 'FN1/S', true],
			// $LR{fareNum} -> FR*{fareNum}
			['apollo', 'galileo', '$LR1', 'FR*1', true],
			// $LB{fareNum} -> FDC*{fareNum}
			['apollo', 'galileo', '$LB1', 'FDC*1', true],
			// $LB{fareNum}/{al} -> FDC*{fareNum}//{al}
			['apollo', 'galileo', '$LB1/DL', 'FDC*1//DL', true],
			['galileo', 'sabre', 'FD20SEPKIVRIX@W-RT', 'FQKIVRIX20SEPSB¥RT'],

			['sabre', 'galileo', 'FQKIVRIX20SEP', 'FD20SEPKIVRIX', true],
			['sabre', 'galileo', 'FQKIVRIX20SEP¥OW', 'FD20SEPKIVRIX-OW', true],
			['sabre', 'galileo', 'FQKIVRIX20SEP-PS-TK-LO¥OW', 'FD20SEPKIVRIX/PS/TK/LO-OW', true],
			['sabre', 'galileo', 'FQKIVRIX20SEP¥OW-PS-TK-LO', 'FD20SEPKIVRIX-OW/PS/TK/LO'],
			['sabre', 'galileo', 'FQKIVRIX20SEPYB-PS-TK-LO¥OW', 'FD20SEPKIVRIX@Y/PS/TK/LO-OW', true],
			['sabre', 'galileo', 'FQKIVRIX20SEPSB-PS-TK-LO¥OW', 'FD20SEPKIVRIX@W/PS/TK/LO-OW', true],
			['sabre', 'galileo', 'FQKIVRIX20SEPBB-PS-TK-LO¥OW', 'FD20SEPKIVRIX@C/PS/TK/LO-OW', true],
			['sabre', 'galileo', 'FQKIVRIX20SEPFB-PS-TK-LO¥OW', 'FD20SEPKIVRIX@F/PS/TK/LO-OW', true],
			['sabre', 'galileo', 'FQKIVRIX20SEP-PS-TK-LO¥RT', 'FD20SEPKIVRIX/PS/TK/LO-RT', true],
			['sabre', 'galileo', 'FQKIVRIX20SEP¥RT-PS-TK-LO', 'FD20SEPKIVRIX-RT/PS/TK/LO'],
			['sabre', 'galileo', 'FQKIVRIX20SEP¥R05JUL', 'FDKIVRIXV20SEP05JUL', true],
			['sabre', 'galileo', 'FQKIVRIX20SEP¥R05JUL-PS-TK-LO', 'FDKIVRIXV20SEP05JUL/PS/TK/LO', true],
			['amadeus', 'galileo', 'FQDKIVRIX/20SEP', 'FD20SEPKIVRIX', true],
			['amadeus', 'galileo', 'FQDKIVRIX/20SEP/IO', 'FD20SEPKIVRIX-OW', true],
			['amadeus', 'galileo', 'FQDKIVRIX/20SEP/APS,TK,LO/IO', 'FD20SEPKIVRIX/PS/TK/LO-OW'],
			['amadeus', 'galileo', 'FQDKIVRIX/20SEP/IO/APS,TK,LO', 'FD20SEPKIVRIX-OW/PS/TK/LO'],
			['amadeus', 'galileo', 'FQDKIVRIX/20SEP/IO/APS,TK,LO/KM', 'FD20SEPKIVRIX-OW/PS/TK/LO@Y'],
			['amadeus', 'galileo', 'FQDKIVRIX/20SEP/IO/APS,TK,LO/KW', 'FD20SEPKIVRIX-OW/PS/TK/LO@W'],
			['amadeus', 'galileo', 'FQDKIVRIX/20SEP/IO/APS,TK,LO/KC', 'FD20SEPKIVRIX-OW/PS/TK/LO@C'],
			['amadeus', 'galileo', 'FQDKIVRIX/20SEP/IO/APS,TK,LO/KF', 'FD20SEPKIVRIX-OW/PS/TK/LO@F'],
			['amadeus', 'galileo', 'FQDKIVRIX/20SEP/APS,TK,LO/IR', 'FD20SEPKIVRIX/PS/TK/LO-RT'],
			['amadeus', 'galileo', 'FQDKIVRIX/20SEP/IR/APS,TK,LO', 'FD20SEPKIVRIX-RT/PS/TK/LO'],
			['amadeus', 'galileo', 'MPFQD', 'FD*', true],
			['amadeus', 'galileo', 'FQDC/APS', 'FD/PS', true],
			['amadeus', 'galileo', 'FQDC/PAR', 'FDDPAR', true],
			['amadeus', 'galileo', 'FQN1', 'FN*1', true],
			['amadeus', 'galileo', 'FQN3*16', 'FN*3/16', true],
			['amadeus', 'galileo', 'FQR1', 'FR*1', true],
			['amadeus', 'galileo', 'FQS1', 'FDC*1', true],
			['amadeus', 'galileo', 'FQS1/ADL', 'FDC*1//DL', true],
			['amadeus', 'galileo', 'FQS1/ADL', 'FDC*1//DL', true],
			['sabre', 'galileo', 'FQ*', 'FD*', true],
			['sabre', 'galileo', 'FQ*-PS', 'FD/PS', true],
			['sabre', 'galileo', 'FQ*DATL', 'FDOATL', true],
			['sabre', 'galileo', 'FQ*APAR', 'FDDPAR', true],
			['sabre', 'galileo', 'RD1*M', 'FN*1', true],
			['sabre', 'galileo', 'RD3*16', 'FN*3/16', true],
			['sabre', 'galileo', 'RD1*RTG', 'FR*1', true],
			['sabre', 'galileo', 'RB1', 'FDC*1', true],
			['sabre', 'galileo', 'RB1DL', 'FDC*1//DL', true],

			// with our /MDA fake modifier - it should be preserved
			['apollo', 'galileo', '$D10MARRIXLAX/MDA5', 'FD10MARRIXLAX/MDA5', true],
			['apollo', 'galileo', '*LF', '*FF', true],
			['apollo', 'galileo', '*LF/MDA', '*FF/MDA', true],

			// pricing commands follow

			['apollo', 'galileo', '$B', 'FQ', true],
			['apollo', 'galileo', '$BB', 'FQBB', true],
			['apollo', 'galileo', '$BB0', 'FQBBK'],
			['apollo', 'galileo', '$BBA', 'FQBA', true],
			// $BB:{futureDate} -> FQBB.T{futureDate}{year}
			['apollo', 'galileo', '$BB:26MAR18', 'FQBB.T26MAR18', true],
			// $BB:{pastDate} -> FQBB.B{pastDate}
			['apollo', 'galileo', '$BB//\u00A4Y', 'FQBB++-ECON', true],
			['apollo', 'galileo', '$BBA//\u00A4Y', 'FQBA++-ECON', true],
			['apollo', 'galileo', '$BB//\u00A4W', 'FQBB++-PREME', true],
			['apollo', 'galileo', '$BBA//\u00A4W', 'FQBA++-PREME', true],
			['apollo', 'galileo', '$BB//\u00A4C', 'FQBB++-BUSNS', true],
			['apollo', 'galileo', '$BBA//\u00A4C', 'FQBA++-BUSNS', true],
			['apollo', 'galileo', '$BB//\u00A4F', 'FQBB++-FIRST', true],
			['apollo', 'galileo', '$BBA//\u00A4F', 'FQBA++-FIRST', true],
			['apollo', 'galileo', '$BB//\u00A4AB', 'FQBB++-AB', true],
			['apollo', 'galileo', '$BBA//\u00A4AB', 'FQBA++-AB', true],
			['apollo', 'galileo', '$BB:N', 'FQBB:N', true],
			['apollo', 'galileo', '$BB/:N', 'FQBB:N'],
			['galileo', 'apollo', 'FQBB:N', '$BB:N'],
			['apollo', 'galileo', '$BB:A', 'FQBB:A', true],
			['apollo', 'galileo', '$BB/:A', 'FQBB:A'],
			['apollo', 'galileo', '$B:N', 'FQ:N', true],
			['apollo', 'galileo', '$B:A', 'FQ:A', true],
			// $B.{class} -> FQ.{class}
			['apollo', 'galileo', '$B.Q', 'FQ.Q', true],
			// $BC{al} -> FQC{al}
			['apollo', 'galileo', '$BCUA', 'FQCUA'],
			// $B/C{al} -> FQ/C{al}
			['apollo', 'galileo', '$B/CUA', 'FQCUA'],
			// $BOC{al} -> FQOC{al}
			['apollo', 'galileo', '$BOCUA', 'FQOCUA', true],
			// $B/OC{al} -> FQ/OC{al}
			['apollo', 'galileo', '$B/OCUA', 'FQOCUA'],
			// $BB/C{al} -> FQBBC{al}
			['apollo', 'galileo', '$BB/CUA', 'FQBBCUA'],
			// $BBC{al} -> FQBB/C{al}
			['apollo', 'galileo', '$BB/CUA', 'FQBBCUA'],
			// $BB/OC{al} -> FQBBOC{al}
			['apollo', 'galileo', '$BB/OCUA', 'FQBBOCUA'],
			// $BB0/C{al} -> DOES NOT EXIST
			['apollo', 'galileo', '$BB0/CUA', null],
			// $BB0C{al} -> DOES NOT EXIST
			['apollo', 'galileo', '$BB0CUA', null],
			// $B*C{paxAge}/ACC -> FQ*C{paxAge}/ACC
			['apollo', 'galileo', '$B*C05/ACC', 'FQ*C05/ACC'],
			// $BB*C{paxAge}/ACC -> FQBB*C{paxAge}/ACC
			['apollo', 'galileo', '$BB*C05/ACC', 'FQBB*C05/ACC'],
			// $BB0*C{paxAge}/ACC -> DOES NOT EXIST
			['apollo', 'galileo', '$BB0*C05/ACC', null],
			// $BBA*C{paxAge}/ACC -> FQBA*C{paxAge}/ACC
			['apollo', 'galileo', '$BBA*C05/ACC', 'FQBA*C05/ACC'],
			// $B¤{fareBase} -> FQ@{fareBase}
			['apollo', 'galileo', '$B\u00A4VKXT5U0', 'FQ@VKXT5U0', true],
			// $B¤{fareBase}//*{PTC} -> FQ@{fareBase}*{PTC}
			['apollo', 'galileo', '$B\u00A4VKXT5U0/*JCB', 'FQ@VKXT5U0/*JCB'],
			// $BBN{paxOrder}+{paxOrder}*C{paxAge}+3*INF//¤Y -> FQBBP{paxOrder1}.{paxOrder2}*C{paxAge}.{paxOrder}*INF++-BUSNS
			['apollo', 'galileo', '$BBN1+2*C05+3*INF//\u00A4C', 'FQBBP1.2*C05.3*INF/++-BUSNS', true],
			// $BBN{paxOrder}*{PTC}+{paxOrder}*{PTC}+{paxOrder}*{PTC}//¤C -> FQBBP{paxOrder1}*{PTC}.{paxOrder}*{PTC}.{paxOrder}*{PTC}++-BUSNS
			['apollo', 'galileo', '$BBN1*JCB+2*J05+3*JNF//\u00A4C', 'FQBBP1*JCB.2*J05.3*JNF/++-BUSNS', true],
			// $B/:{currency} -> FQ:{currency}
			['apollo', 'galileo', '$B/:CAD', 'FQ:CAD'],
			// $BB/:{currency} -> FQBB:{currency}
			['apollo', 'galileo', '$BB/:EUR', 'FQBB:EUR'],
			// $BBA/:{currency} -> FQBA:{currency}
			['apollo', 'galileo', '$BBA/:EUR', 'FQBA:EUR'],
			// $BB0/:{currency} -> DOES NOT EXIST
			['apollo', 'galileo', '$BB0/:EUR', null],
			// $BN{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF/:{currency} -> FQP{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
			['apollo', 'galileo', '$BN1+2*C05+3*INF/:EUR', 'FQP1.2*C05.3*INF/:EUR', true],
			// $BBN{paxOrder}*JCB+{paxOrder}*J{paxAge}/:{currency} -> FQBBP{paxOrder}*JCB+{paxOrder}*J{paxAge}:{currency}
			['apollo', 'galileo', '$BBN1*JCB+2*J05/:EUR', 'FQBBP1*JCB.2*J05/:EUR', true],
			// $BBAN{paxOrder}*ITX+{paxOrder}*I{paxAge}/:{currency} -> FQBAP{paxOrder}*ITX+{paxOrder}*I{paxAge}:{currency}
			['apollo', 'galileo', '$BBAN1*ITX+2*I05/:EUR', 'FQBAP1*ITX.2*I05/:EUR', true],
			// $BB0N{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF/:{currency} -> DOES NOT EXIST
			['apollo', 'galileo', '$BB0N1+2*C05+3*INF/:EUR', null],
			// $BN{paxOrder}+{paxOrder}*C{paxAge} -> FQP{paxOrder}.{paxOrder}*C{paxAge}
			['apollo', 'galileo', '$BN1+2*C05', 'FQP1.2*C05', true],
			// $BN{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF -> FQP{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
			['apollo', 'galileo', '$BN1+2*C05+3*INF', 'FQP1.2*C05.3*INF', true],
			// $BN{paxorder}+{paxOrder1}+{paxOrder2}*C{paxAge}+{paxOrder}*INF -> FQP{paxOrder}.{paxOrder}.{paxOrder}*C{paxAge}*INF
			['apollo', 'galileo', '$BN1+2+3*C05+4*INF', 'FQP1.2.3*C05.4*INF', true],
			// $BBN{paxOrder}+{paxOrder}*C{paxAge} -> FQBBP{paxOrder}.{paxOrder}*C{paxAge}
			['apollo', 'galileo', '$BBN1+2*C05', 'FQBBP1.2*C05', true],
			// $BBN{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF -> FQBBP{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
			['apollo', 'galileo', '$BBN1+2*C05+3*INF', 'FQBBP1.2*C05.3*INF', true],
			// $BBN{paxorder}+{paxOrder1}+{paxOrder2}*C{paxAge}+{paxOrder}*INF -> FQBBP{paxOrder}.{paxOrder}.{paxOrder}*C{paxAge}*INF
			['apollo', 'galileo', '$BBN1+2+3*C05+4*INF', 'FQBBP1.2.3*C05.4*INF', true],
			// $BB0N{paxOrder}+{paxOrder}*C{paxAge} -> DOES NOT EXIST
			['apollo', 'galileo', '$BB0N1+2*C05', null],
			// $BB0N{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF -> DOES NOT EXIST
			['apollo', 'galileo', '$BB0N1+2*C05+3*INF', null],
			// $BB0N{paxorder}+{paxOrder1}+{paxOrder2}*C{paxAge}+{paxOrder}*INF -> DOES NOT EXIST
			['apollo', 'galileo', '$BB0N1+2+3*C05+4*INF', null],
			// $BBAN{paxOrder}+{paxOrder}*C{paxAge} -> FQBBAP{paxOrder}.{paxOrder}*C{paxAge}
			['apollo', 'galileo', '$BBAN1+2*C05', 'FQBAP1.2*C05', true],
			// $BBAN{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF -> FQBBAP{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
			['apollo', 'galileo', '$BBAN1+2*C05+3*INF', 'FQBAP1.2*C05.3*INF', true],
			// $BBAN{paxorder}+{paxOrder1}+{paxOrder2}*C{paxAge}+{paxOrder}*INF -> FQBBAP{paxOrder1}.{paxOrder2}.{3paxOrder}*C{paxAge}.{paxOrder4}*INF
			['apollo', 'galileo', '$BBAN1+2+3*C05+4*INF', 'FQBAP1.2.3*C05.4*INF', true],
			['apollo', 'galileo', '$B*JCB', 'FQ*JCB', true],
			['apollo', 'galileo', '$BB*JCB', 'FQBB*JCB', true],
			['apollo', 'galileo', '$BB0*JCB', null],
			['apollo', 'galileo', '$BBA*JCB', 'FQBA*JCB', true],
			// $BN{paxOrder}*JCB+{paxOrder}*J{paxAge} -> FQP{paxOrder}*JCB.2*J{paxAge}
			['apollo', 'galileo', '$BN1*JCB+2*J05', 'FQP1*JCB.2*J05', true],
			// $BBN{paxOrder}*JCB+{paxOrder}*J{paxAge} -> FQBBP{paxOrder}*JCB.{paxOrder}*J{paxAge}
			['apollo', 'galileo', '$BBN1*JCB+2*J05', 'FQBBP1*JCB.2*J05', true],
			// $BB0N{paxOrder}*JCB+{paxOrder}*J{paxAge} -> DOES NOT EXIST
			['apollo', 'galileo', '$BB0N1*JCB+2*J05', null],
			// $BN{paxOrder}+JCB+{paxOrder}*J{paxAge}+{paxOrder}*JNF -> FQP{paxOrder}*JCB.{paxOrder}*J{paxAge}.{paxOrder}*JNF
			['apollo', 'galileo', '$BN1*JCB+2*J06+3*JNF', 'FQP1*JCB.2*J06.3*JNF', true],
			['apollo', 'galileo', '$B*ITX', 'FQ*ITX', true],
			['apollo', 'galileo', '$BB*ITX', 'FQBB*ITX', true],
			['apollo', 'galileo', '$BB0*ITX', null],
			['apollo', 'galileo', '$BBA*ITX', 'FQBA*ITX', true],
			// $BN{paxOrder}*ITX+{paxOrder}*I{paxAge} -> FQP{paxOrder}*ITX.{paxOrder}*I{paxAge}
			['apollo', 'galileo', '$BN1*ITX+2*I06', 'FQP1*ITX.2*I06', true],
			// $BN{paxOrder}*ITX+{paxOrder}*I{paxAge}+{paxOrder}*ITF -> FQP{paxOrder}*ITX.{paxOrder}*I{paxAge}.{paxOrder}*ITF
			['apollo', 'galileo', '$BN1*ITX+2*I06+3*ITF', 'FQP1*ITX.2*I06.3*ITF', true],
			// $BBN{paxOrder}*ITX+{paxOrder}*I{paxAge} -> FQBBP{paxOrder}*ITX.{paxOrder}*I{paxOrder}
			['apollo', 'galileo', '$BBN1*ITX+2*I05', 'FQBBP1*ITX.2*I05', true],
			// $BBN{paxOrder}*ITX+{paxOrder}*I{paxAge}+{paxOrder}*ITF -> FQBBP{paxOrder}*ITX.{paxOrder}*I{paxOrder}.{paxOrder}*ITF
			['apollo', 'galileo', '$BBN1*ITX+2*I06+3*ITF', 'FQBBP1*ITX.2*I06.3*ITF', true],
			// $BB0N{paxOrder}*ITX+{paxOrder}*I{paxAge} -> DOES NOT EXIST
			['apollo', 'galileo', '$BB0N1*ITX+2*I05', null],
			// $BB0N{paxOrder}*ITX+{paxOrder}*I{paxAge}+{paxOrder}*ITF -> DOES NOT EXIST
			['apollo', 'galileo', '$BB0N1*ITX+2*I06+3*ITF', null],
			// $BBAN{paxOrder}*ITX+{paxOrder}*I{paxAge} -> FQBAP{paxOrder}*ITX.{paxOrder}*I{paxAge}
			['apollo', 'galileo', '$BBAN1*ITX+2*I05', 'FQBAP1*ITX.2*I05', true],
			// $BBAN{paxOrder}*ITX+{paxOrder}*I{paxAge}+{paxOrder}*ITF -> FQBAP{paxOrder}*ITX.{paxOrder}*I{paxAge}.{paxOrder}*I{paxAge}
			['apollo', 'galileo', '$BBAN1*ITX+2*I06+3*ITF', 'FQBAP1*ITX.2*I06.3*ITF', true],
			// $BS{segNum1}+{segNum2} -> FQS{segNum1}.{segNum2}
			['apollo', 'galileo', '$BS1+2', 'FQS1.2', true],
			// $BS{segNum1}*{segNum3}+{segNum5}*{segNum6} -> FQS{segNum1}-{segNum3}.{segNum5}-{segNum6}
			['apollo', 'galileo', '$BS1*3+5*6', 'FQS1-3.5.6', true],
			// $BBS{segNum1}+{segNum2} -> FQBBS{segNum1}.{segNum2}
			['apollo', 'galileo', '$BBS1+2', 'FQBBS1.2', true],
			// $BBS{segNum1}*{segNum3}+{segNum5}*{segNum6} -> FQBBS{segNum1}-{segNum3}.{segNum5}-{segNum6}
			['apollo', 'galileo', '$BBS1*3+5*6', 'FQBBS1-3.5.6', true],
			// $BBAS{segNum1}+{segNum2}+{segNum5}+{segNum6} -> FQBAS{segNum1}.{segNum2}.{segNum5}.{segNum6}
			['apollo', 'galileo', '$BBAS1+2+5+6', 'FQBAS1.2.5.6', true],
			// $BBAS{segNum1}*{segNum3}+{segNum5}*{segNum6} -> FQBAS{segNum1}-{segNum3}.{segNum5}-{segNum6}
			['apollo', 'galileo', '$BBAS1*3+5*6', 'FQBAS1-3.5.6', true],
			// $BS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxOrder}+{paxOrder}*C{paxAge} -> FQS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}*C{paxAge}
			['apollo', 'galileo', '$BS1+2+5+6/N1+2*C05', 'FQS1.2.5.6/P1.2*C05', true],
			// $BS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF -> FQS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
			['apollo', 'galileo', '$BS1+2+5+6/N1+2*C05+3*INF', 'FQS1.2.5.6/P1.2*C05.3*INF', true],
			// $BS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder}+{paxOrder1}+{paxOrder2}*C{paxAge}+{paxOrder}*INF -> FQS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
			['apollo', 'galileo', '$BS1+2+5+6/N1+2+3*C05+4*INF', 'FQS1.2.5.6/P1.2.3*C05.4*INF', true],
			// $BBS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxOrder}+{paxOrder}*C{paxAge} -> FQBBS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}*C{paxAge}
			['apollo', 'galileo', '$BBS1+2+5+6/N1+2*C05', 'FQBBS1.2.5.6/P1.2*C05', true],
			// $BBS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF -> FQBBS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
			['apollo', 'galileo', '$BBS1+2+5+6/N1+2*C05+3*INF', 'FQBBS1.2.5.6/P1.2*C05.3*INF', true],
			// $BBS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder}+{paxOrder1}+{paxOrder2}*C{paxAge}+{paxOrder}*INF -> FQBBS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
			['apollo', 'galileo', '$BBS1+2+5+6/N1+2+3*C05+4*INF', 'FQBBS1.2.5.6/P1.2.3*C05.4*INF', true],
			// $BB0S{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxOrder}+{paxOrder}*C{paxAge} -> DOES NOT EXIST
			['apollo', 'galileo', '$BB0S1+2+5+6/N1+2*C05', null],
			// $BB0S{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF -> DOES NOT EXIST
			['apollo', 'galileo', '$BB0S1+2+5+6/N1+2*C05+3*INF', null],
			// $BB0S{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder}+{paxOrder1}+{paxOrder2}*C{paxAge}+{paxOrder}*INF -> DOES NOT EXIST
			['apollo', 'galileo', '$BB0S1+2+5+6/N1+2+3*C05+4*INF', null],
			// $BBAS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxOrder}+{paxOrder}*C{paxAge} -> FQBAS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}*C{paxAge}
			['apollo', 'galileo', '$BBAS1+2+5+6/N1+2*C05', 'FQBAS1.2.5.6/P1.2*C05', true],
			// $BBAS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder}+{paxOrder}*C{paxAge}+{paxOrder}*INF -> FQBAS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
			['apollo', 'galileo', '$BBAS1+2+5+6/N1+2*C05+3*INF', 'FQBAS1.2.5.6/P1.2*C05.3*INF', true],
			// $BBAS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder}+{paxOrder1}+{paxOrder2}*C{paxAge}+{paxOrder}*INF -> FQBAS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}.{paxOrder}.{paxOrder}*C{paxAge}.{paxOrder}*INF
			['apollo', 'galileo', '$BBAS1+2+5+6/N1+2+3*C05+4*INF', 'FQBAS1.2.5.6/P1.2.3*C05.4*INF', true],
			// $BBS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder1}*JCB+{paxOrder2}*JCB+{paxOrder3}*J{paxAge}+{paxOrder}*JNF -> FQBBS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}*JCB.{paxOrder}*JCB.{paxOrder}*J{paxAge}.{paxOrder}*JNF
			['apollo', 'galileo', '$BBS1+2+5+6/N1*JCB+2*JCB+3*JNN+4*JNF', 'FQBBS1.2.5.6/P1*JCB.2*JCB.3*JNN.4*JNF', true],
			// $BBS{segNum1}+{segNum2}+{segNum5}+{segNum6}/N{paxorder1}*ITX+{paxOrder2}*ITX+{paxOrder3}*I{paxAge}+{paxOrder}*XTF -> FQBBS{segNum1}.{segNum2}.{segNum5}.{segNum6}/P{paxOrder}*ITX.{paxOrder}*ITX.{paxOrder}*I{paxAge}.{paxOrder}*ITF
			['apollo', 'galileo', '$BBS1+2+5+6/N1*ITX+2*ITX+3*INN+4*ITF', 'FQBBS1.2.5.6/P1*ITX.2*ITX.3*INN.4*ITF', true],
			['galileo', 'sabre', 'FQBB*C05/ACC', 'WPNC¥PC05'],

			['sabre', 'apollo', 'WP', '$B', true],
			['sabre', 'amadeus', 'WP', 'FXX', true],
			['sabre', 'galileo', 'WP', 'FQ', true],
			['sabre', 'galileo', 'WPNCB', 'FQBBK', true],
			['amadeus', 'galileo', 'FXA/R,15JUN17', 'FQBB.T15JUN17', true],

			['galileo', 'amadeus', 'FQBBK', 'FXR'],
			['galileo', 'amadeus', 'FQBB/:N', 'FXA/R,P'],
			['galileo', 'amadeus', 'FQBB/:A', 'FXA/R,U'],
			['galileo', 'amadeus', 'FQ/CUA', 'FXX/R,VC-UA'],
			['galileo', 'amadeus', 'FQ/OCUA', 'FXX/R,OCC-UA'],
			['galileo', 'amadeus', 'FQBB/CUA', 'FXA/R,VC-UA'],
			['galileo', 'amadeus', 'FQ*C05', 'FXX/RC05'],
			['galileo', 'amadeus', 'FQBB*C05', 'FXA/RC05'],
			['galileo', 'amadeus', 'FQBA*C05', 'FXL/RC05'],
			['galileo', 'amadeus', 'FQ@VKXT5U0', 'FXX/L-VKXT5U0'],
			['galileo', 'amadeus', 'FQ@VKXT5U0*JCB', 'FXX/L-VKXT5U0/RJCB'],
			['galileo', 'amadeus', 'FQP1.2*C05.3*INF/:EUR', 'FXX/RADT*C05*INF,FC-EUR'],
			['galileo', 'amadeus', 'FQP1*ADT.2*C05', 'FXX/RADT*C05'],
			['galileo', 'amadeus', 'FQP1.2*C05.3*INF', 'FXX/RADT*C05*INF'],
			['galileo', 'amadeus', 'FQ*JCB', 'FXX/RJCB'],
			['galileo', 'amadeus', 'FQBB*JCB', 'FXA/RJCB'],
			['galileo', 'amadeus', 'FQBA*JCB', 'FXL/RJCB'],
			['galileo', 'amadeus', 'FQP1*JCB.2*J05', 'FXX/RJCB*J05'],
			['galileo', 'amadeus', 'FQP1*JCB.2*J06.3*JNF', 'FXX/RJCB*J06*JNF'],
			['galileo', 'amadeus', 'FQ*ITX', 'FXX/RITX'],
			['galileo', 'amadeus', 'FQBB*ITX', 'FXA/RITX'],
			['galileo', 'amadeus', 'FQBA*ITX', 'FXL/RITX'],
			['galileo', 'amadeus', 'FQP1*ITX.2*I06', 'FXX/RITX*I06'],
			['galileo', 'amadeus', 'FQP1*ITX.2*I06.3*ITF', 'FXX/RITX*I06*ITF'],
			['galileo', 'amadeus', 'FQS1.2.5.6/P1.2*C05', 'FXX/S1,2,5,6/RADT*C05'],
			['galileo', 'amadeus', 'FQS1.2.5.6/P1.2*C05.3*INF', 'FXX/S1,2,5,6/RADT*C05*INF'],

			['galileo', 'sabre', 'FQBBK', 'WPNCB'],
			['galileo', 'sabre', 'FQBB/:N', 'WPNC¥PL'],
			['galileo', 'sabre', 'FQBB/:A', 'WPNC¥PV'],
			['galileo', 'sabre', 'FQ/CUA', 'WPAUA'],
			['galileo', 'sabre', 'FQ/OCUA', 'WPC-UA'],
			['galileo', 'sabre', 'FQBB/CUA', 'WPNC¥AUA'],
			['galileo', 'sabre', 'FQBBOCUA', 'WPNC¥C-UA'],
			['galileo', 'sabre', 'FQ@VKXT5U0', 'WPQVKXT5U0'],
			['galileo', 'sabre', 'FQ@VKXT5U0*JCB', 'WPQVKXT5U0¥PJCB'],
			['galileo', 'sabre', 'FQBBP1.2*C05.3*INF++-BUSNS', 'WPNC¥P1ADT/1C05/1INF¥TC-BB'],
			['galileo', 'sabre', 'FQBBP1*JCB.2*J05.3*JNF++-BUSNS', 'WPNC¥P1JCB/1J05/1JNF¥TC-BB'],
			['galileo', 'sabre', 'FQBBP1*JCB.2*J05:EUR', 'WPNC¥P1JCB/1J05¥MEUR'],
			['galileo', 'sabre', 'FQBAP1*ITX.2*I05:EUR', 'WPNCS¥P1ITX/1I05¥MEUR'],

			['galileo', 'apollo', 'FQBBK', '$BBQ01'],
			['galileo', 'apollo', 'FQBB/:N', '$BB:N'],
			['galileo', 'apollo', 'FQBB/:A', '$BB:A'],
			['galileo', 'apollo', 'FQ/CUA', '$B/CUA'],
			['galileo', 'apollo', 'FQ/OCUA', '$BOCUA'],
			// it's important that Apollo translation had slash before /CUA,
			// $BBCUA is invalid since there is a $BBC base cmd
			['galileo', 'apollo', 'FQBBCUA', '$BB/CUA'],
			['galileo', 'apollo', 'FQBB/CUA', '$BB/CUA'],
			['galileo', 'apollo', 'FQ*C05/ACC', '$B*C05/ACC'],
			['galileo', 'apollo', 'FQBB*C05/ACC', '$BB*C05/ACC'],
			['galileo', 'apollo', 'FQBA*C05/ACC', '$BBA*C05/ACC'],
			['galileo', 'apollo', 'FQ@VKXT5U0', '$B\u00A4VKXT5U0'],
			['galileo', 'apollo', 'FQ@VKXT5U0*JCB', '$B@VKXT5U0/*JCB'],
			['galileo', 'apollo', 'FQBBP1.2*C05.3*INF++-BUSNS', '$BBN1+2*C05+3*INF//\u00A4C'],
			['galileo', 'apollo', 'FQBBP1*JCB.2*J05.3*JNF++-BUSNS', '$BBN1*JCB+2*J05+3*JNF//\u00A4C'],

			//['galileo', 'apollo', 'FQBB.B15JUN17', '$BB:15JUN17'],

			// PNR-related commands follow

			// SEM/{pcc}/AG -> SEM/{pcc}/AG
			['apollo', 'galileo', 'SEM/103K/AG', 'SEM/103K/AG', true],
			// **-{paxLast} -> *-{paxLast}
			['apollo', 'galileo', '**-SMITH', '*-SMITH', true],
			// **-{paxLast}/{paxFirst} -> *-{paxLast}/{paxFirst}
			['apollo', 'galileo', '**-SMITH/AMY', '*-SMITH/AMY', true],
			// **-{paxLast}/{paxFirst} {paxMiddle} -> *-{paxLast}/{paxFirst} {paxMiddle}
			['apollo', 'galileo', '**-SMITH/AMY JOHNSON', '*-SMITH/AMY JOHNSON', true],
			// **B-{paxLast} -> **B-{paxLast}
			['apollo', 'galileo', '**B-SMITH', '**B-SMITH', true],
			// **B-{paxLast}/{paxFirst} -> **B-{paxLast}/{paxFirst}
			['apollo', 'galileo', '**B-SMITH/AMY', '**B-SMITH/AMY', true],
			// **B-{paxLast}/{paxFirst} {paxMiddle} -> **B-{paxLast}/{paxFirst} {paxMiddle}
			['apollo', 'galileo', '**B-SMITH/AMY JOHNSON', '**B-SMITH/AMY JOHNSON', true],
			// *{pnr} -> *{pnr}
			['apollo', 'galileo', '*ABC123', '*ABC123', true],
			// *{pnrList} -> *{pnrList}
			['apollo', 'galileo', '*3', '*3', true],
			// *TE/{ticketNumber} -> *TE/{ticketNumber}
			['apollo', 'galileo', '*TE/0161234567890', '*TE/0161234567890', true],
			// N:{paxLast}/{paxFirst} -> N.{paxLast}/{paxFirst}
			['apollo', 'galileo', 'N:SMITH/JOHN', 'N.SMITH/JOHN', true],
			// N:{paxLast}/{paxFirst} {paxMiddle} -> N.{paxLast}/{paxFirst} {paxMiddle}
			['apollo', 'galileo', 'N:SMITH/JOHN PAUL', 'N.SMITH/JOHN PAUL', true],
			// N:{paxLast}/{paxFirst}*P-C{paxAge} -> N.{lastName}/{firstName}*P-C{paxAge}
			['apollo', 'galileo', 'N:SMITH/JUNIOR*P-C07', 'N.SMITH/JUNIOR*P-C07', true],
			// N:{paxLast}/{paxFirst} {paxMiddle}*P-C{paxAge} -> N.{paxLast}/{paxFirst} {paxMiddle}*P-C{paxAge}
			['apollo', 'galileo', 'N:EAGEN/KATY JOHN*P-C07', 'N.EAGEN/KATY JOHN*P-C07', true],
			// N:{paxLast}/{paxFirst}*P-INS -> N.{paxLast}/{paxFirst}*P-INS
			['apollo', 'galileo', 'N:SMITH/JOHN*P-INS', 'N.SMITH/JOHN*P-INS', true],
			// N:{paxLast}/{paxFirst} {paxMiddle}*P-INS -> N.{paxLast}/{paxFirst} {paxMiddle}*P-INS
			['apollo', 'galileo', 'N:SMITH/JOHN PAUL*P-INS', 'N.SMITH/JOHN PAUL*P-INS', true],
			// N:I/{paxLast}/{paxFirst}*{paxDob} -> N:I/{paxLast}/{paxFirst}*{paxDob}
			['apollo', 'galileo', 'N:I/EAGEN/KATY*12JAN18', 'N.I/EAGEN/KATY*12JAN18', true],
			// N:I/{paxLast}/{paxFirst} {paxMiddle}*{paxDob} -> N.I/{paxLast}/{paxFirst} {paxMiddle}*{paxDob}
			['apollo', 'galileo', 'N:I/EAGEN/KATY SEAN*12JAN08', 'N.I/EAGEN/KATY SEAN*12JAN08', true],
			// T:TAU/{date} -> T.TAU/{date}
			['apollo', 'galileo', 'T:TAU/1NOV', 'T.TAU/1NOV', true],
			// C:{paxNum}N: -> N:P{paxNum}@
			['apollo', 'galileo', 'C:1N:', 'N.P1@', true],
			// C:{paxNum}N:{newName} -> N:P{paxNum}@{newName}
			['apollo', 'galileo', 'C:1N:SMITH/JOHN', 'N.P1@SMITH/JOHN', true],
			// C:T:TAU/{date} -> T.@TAU/{date}
			['apollo', 'galileo', 'C:T:TAU/24MAY', 'T.@TAU/24MAY', true],
			['apollo', 'galileo', 'C:T:', 'T.@', true],
			// R:{agentName} -> R.{agentName}
			['apollo', 'galileo', 'R:ELDAR', 'R.ELDAR', true],
			['apollo', 'galileo', 'C:R:', 'R.@', true],
			['apollo', 'galileo', 'ER', 'ER', true],
			// P:{agencyLocation}AS/{agencyPhone} {freeText} -> P.{agencyLocation}T/{agencyPhone} {freeText}
			['apollo', 'galileo', 'P:SFOAS/800-750-2238 ASAP CUSTOMER SUPPORT', 'P.SFOT*800-750-2238 ASAP CUSTOMER SUPPORT', true],
			// P:{agencyLocation}R/{agencyPhone} {freeText} -> P.{agencyLocation}R/{agencyPhone} {freeText}
			['apollo', 'galileo', 'P:SFOR/800-750-2238 ASAP CUSTOMER SUPPORT', 'P.SFOH*800-750-2238 ASAP CUSTOMER SUPPORT', true],
			// .{segNum}{segStatus} -> @{segNum}{segStatus}
			['apollo', 'galileo', '.1HK', '@1HK', true],
			['apollo', 'galileo', '.IHK', '@ALL', true],
			// ¤:5{freeText} -> NP.{freeText}
			['apollo', 'galileo', '\u00A4:5PLEASE CONTACT PAX', 'NP.PLEASE CONTACT PAX', true],
			// C:{remarkNum}¤:5 -> NP.{remarkNum}@
			['apollo', 'galileo', 'C:2\u00A4:5', 'NP.2@', true],
			// 0TURZZBK1SFO{date}-{freeText} -> 0TURZZBK1SFO{date}-{freeText}
			['apollo', 'galileo', '0TURZZBK1SFO12MAR-RETENTION', '0TURZZBK1SFO12MAR-RETENTION', true],

			['sabre', 'galileo', '7\u00A4', 'T.@'],
			['sabre', 'galileo', '6\u00A4', 'R.@'],
			['sabre', 'galileo', '91-800-750-2238-A', 'P.SFOT*800-750-2238 ASAP CUSTOMER SUPPORT'],
			['sabre', 'galileo', '91-800-750-2238-H', 'P.SFOH*800-750-2238 ASAP CUSTOMER SUPPORT'],

			['amadeus', 'galileo', 'NM1SMITH/JOHN(C07)', 'N.SMITH/JOHN*P-C07'],
			['amadeus', 'galileo', 'NM1SMITH/JOHN PAUL(C07)', 'N.SMITH/JOHN PAUL*P-C07'],
			['amadeus', 'galileo', 'NM1SMITH/JOHN(INS)', 'N.SMITH/JOHN*P-INS'],
			['amadeus', 'galileo', 'NM1SMITH/JOHN PAUL(INS)', 'N.SMITH/JOHN PAUL*P-INS'],
			['amadeus', 'galileo', '1/(INF EAGEN/KATY/12JAN18)', 'N.I/EAGEN/KATY*12JAN18'],
			['amadeus', 'galileo', '1/(INF EAGEN/KATY SEAN/29AUG16)', 'N.I/EAGEN/KATY SEAN*29AUG16'],
			['amadeus', 'galileo', 'AP SFO 800-750-2238-A', 'P.SFOT*800-750-2238 ASAP CUSTOMER SUPPORT'],
			['amadeus', 'galileo', 'AP SFO 800-750-2238-H', 'P.SFOH*800-750-2238 ASAP CUSTOMER SUPPORT'],

			['galileo', 'sabre', 'R.@', '6\u00A4'],
			['galileo', 'sabre', 'T.@', '7\u00A4'],
			['galileo', 'sabre', 'P.SFOT*800-750-2238 ASAP CUSTOMER SUPPORT', '9800-750-2238-A'],
			['galileo', 'sabre', 'P.SFOH*800-750-2238 ASAP CUSTOMER SUPPORT', '9800-750-2238-H'],

			['galileo', 'amadeus', 'P.SFOT*800-750-2238 ASAP CUSTOMER SUPPORT', 'AP SFO 800-750-2238-A'],
			['galileo', 'amadeus', 'P.SFOH*800-750-2238 ASAP CUSTOMER SUPPORT', 'AP SFO 800-750-2238-H'],
			['galileo', 'amadeus', 'NP.2@', null],
			['galileo', 'amadeus', 'RM2@', null],

			// ¤:3SSRDOCSYYHK1/N{paxOrder}/////{paxDob}/{paxG}//{paxLast}/{paxFirst} -> SI.P{paxOrder}/SSRDOCSYYHK1/////{paxDOB}/{paxG}//{paxLast}/{paxFirst}
			['apollo', 'galileo', '\u00A4:3SSRDOCSYYHK1/N1/////05MAR90/F//LAST/FIRST', 'SI.P1/SSRDOCSYYHK1/////05MAR90/F//LAST/FIRST', true],
			// ¤:3SSRDOCSYYHK1/N{paxOrder}/////{paxDob}/{paxG}I//{paxLast}/{paxFirst} -> SI.P{paxOrder}/SSRDOCSYYHK1/////{paxDOB}/{paxG}I//{paxLast}/{paxFirst}
			['apollo', 'galileo', '\u00A4:3SSRDOCSYYHK1/N1/////02APR11/FI//LASTNAME/NAME', 'SI.P1/SSRDOCSYYHK1/////02APR11/FI//LASTNAME/NAME', true],
			// C:{tsaOrder1}-{tsaOrder2}¤:3 -> SI.{tsaOrder5}-{tsaOrder10}@
			['apollo', 'galileo', 'C:5-10\u00A4:3', 'SI.5-10@', true],

			// info commands follow

			// S*COU/{countryName} -> .LE {countryName}
			['apollo', 'galileo', 'S*COU/RUSSIA', '.LE RUSSIA', true],
			// S*COU/{countryCode} -> .LD {countryCode}
			['apollo', 'galileo', 'S*COU/RU', '.LD RU', true],
			// S*CTY/{airportCityCode} -> .CD {airportCityCode}
			['apollo', 'galileo', 'S*CTY/DEN', '.CD DEN', true],
			// S*CTY/{cityName} -> .CE {cityName}
			['apollo', 'galileo', 'S*CTY/ACCRA', '.CE ACCRA', true],
			// S*AIR/{al} -> .AD {al}
			['apollo', 'galileo', 'S*AIR/SU', '.AD SU', true],
			// S*AIR/{airlineName} -> .AE {airlineName}
			['apollo', 'galileo', 'S*AIR/LUFTHANSA', '.AE LUFTHANSA', true],
			// HELP {fltType} -> .EE {fltType}
			['apollo', 'galileo', 'HELP 767', '.EE 767', true],
			['apollo', 'galileo', '*R', '*R', true],
			['apollo', 'galileo', 'OP/W*', 'OP/W*', true],
			['apollo', 'galileo', '*SVC', '*SVC', true],
			['apollo', 'galileo', '*IA', '*IA', true],
			['apollo', 'galileo', '*H', '*H', true],
			['apollo', 'galileo', '*HA', '*HIA', true],
			['apollo', 'galileo', '*HI', '*HI', true],
			['apollo', 'galileo', '*HTE', '*HTE', true],
			// *TE{ticketNum} -> *TE{ticketNum}
			['apollo', 'galileo', '*TE002', '*TE002', true],
			['apollo', 'galileo', '*N', '*N', true],
			['apollo', 'galileo', 'I', 'I'],
			['apollo', 'galileo', 'IR', 'IR', true],
			// VIT{al}{flightNum}/{date} -> TT{al}{flightNum}/{date}
			['apollo', 'galileo', 'VITPS898/20SEP', 'TTPS898/20SEP', true],
			['apollo', 'galileo', '\u00A4MT', '@MT', true],
			// S{area} -> S{area}
			['apollo', 'galileo', 'SA', 'SA', true],
			// ¤LT{airportCityCode} -> @LT{airportCityCode}
			['apollo', 'galileo', '\u00A4LTKIV', '@LTKIV', true],
			['apollo', 'galileo', 'MR', 'MR', true],
			['apollo', 'galileo', 'MD', 'MR'],
			['apollo', 'galileo', 'MU', 'MU', true],
			['apollo', 'galileo', 'MT', 'MT', true],
			['apollo', 'galileo', 'MB', 'MB', true],
			// XX{digit}{function}{digit} -> XX{digit}{function}{digit}
			['apollo', 'galileo', 'XX100.20+50', 'XX100.20+50', true],
			// HELP {question} -> HELP {question}
			['apollo', 'galileo', 'HELP $D', 'HELP FD', true],

			// segment reordering commands follow

			// XA/0{class} -> @A/{class}
			['apollo', 'galileo', 'XA/0Y', '@A/Y', true],
			// X{segNum}/0{class} -> @{segNum}/{class}
			['apollo', 'galileo', 'X1/0Y', '@1/Y', true],
			// X{segNum1}-{segNum2}/0{class} -> @{segNum1}-{segNum2}/{class}
			['apollo', 'galileo', 'X1-2/0Y', '@1-2/Y', true],
			// X{segNum1}+{segNum2}+{segNum5}/0{class} -> @{segNum1}.{segNum2}.{segNum5}/{class}
			['apollo', 'galileo', 'X1+2+5/0Y', '@1.2.5/Y', true],
			// X{segNum1}+{segNum3}+{segNum4}/0{paxNum}{class1}+{segNum3}{class3}+{segNum4}{class4} -> DOES NOT EXIST
			['apollo', 'galileo', 'X1+3+4/01Y+3J+4M', null],
			// X{segNum1}+{segNum3}-{segNum4}/0{class} -> @{segNum1}.{segNum2}-{segNum5}/{class}
			['apollo', 'galileo', 'X1+3-4/0Y', '@1.3-4/Y', true],
			// X{segNum1}+{segNum2}/0{paxNum}{class1}{lineNum1}{class2}{lineNum2} -> X{segNum1}+{segNum2}+0{paxNum}{class1}{lineNum1}{class2}{lineNum2}
			['apollo', 'galileo', 'X1+2/01Z1K2', 'X1.2+01Z1K2', true],
			// X{segNum}/0{date} -> @{segNum}/{date}
			['apollo', 'galileo', 'X3/012JUL', '@3/12JUL', true],
			// X{segNum1}-{segNum2}/0{date} -> @{segNum1}-{segNum2}/{date}
			['apollo', 'galileo', 'X1-2/023JUN', '@1-2/23JUN', true],
			// X{segNum} -> X{segNum}
			['apollo', 'galileo', 'X1', 'X1', true],
			// X{segNum1}+{segNum3}+{segNum5} -> X.{segNum1}.{segNum3}.{segNum5}
			['apollo', 'galileo', 'X1+3+5', 'X1.3.5', true],
			// X{segNum3}-{segNum5} -> X{segNum3}-{segNum5}
			['apollo', 'galileo', 'X3-5', 'X3-5', true],
			// X{segNum1}-{segNum2}+{segNum5}-{segNum7} -> X{segNum1}-{segNum2}.{segNum5}-{segNum7}
			['apollo', 'galileo', 'X1-2+5-7', 'X1-2.5-7', true],
			// /{segNum1}/{segNum3} -> /{segNum1}S{segNum3}
			['apollo', 'galileo', '/1/3', '/1S3', true],
			// /{segNum0}/{segNum3}-{segNum4} -> /{segNum0}S{segNum3}-{segNum4}
			['apollo', 'galileo', '/0/3-4', '/0S3-4', true],
			// +{seatsNum} -> @A/{seatsNum}
			['apollo', 'galileo', '+4', '@A/4', true],

			// low fare search commands follow

			['apollo', 'galileo', 'FS', 'FS', true],
			['sabre', 'galileo', 'WPNIX', 'FS++I', true],
			['apollo', 'galileo', 'FS//D', 'FS++.D', true],
			// FS//+{al1}.{al2}.{al3} -> FS++/{al1}/{al2}/{al3}
			['apollo', 'galileo', 'FS//+DL.AF.KL', 'FS++/DL/AF/KL', true],
			// FSS{segNum1}+{segNum2} -> FS+S{segNum1}.{segNum2}
			['apollo', 'galileo', 'FSS1+2', 'FS+S1.2', true],
			// FS//*{PTC} -> FS+*{PTC}
			['apollo', 'galileo', 'FS//*JCB', 'FS+*JCB', true],
			['apollo', 'galileo', 'FSA', 'FSA', true],
			['apollo', 'galileo', 'FS//\u00A4C', 'FS++-BUSNS', true],
			['apollo', 'galileo', 'FS//\u00A4F', 'FS++-FIRST', true],
			['apollo', 'galileo', 'FS//\u00A4Y', 'FS++-ECON', true],
			['apollo', 'galileo', 'FS//\u00A4W', 'FS++-PREME', true],
			['apollo', 'galileo', 'FS//\u00A4P', 'FS++-PREMF', true],
			['apollo', 'galileo', '*FS', 'FS*', true],
			// FS//+/*{allianceCode} -> FS++//*{allianceCode}
			['apollo', 'galileo', 'FS//+/*A', 'FS++//*A', true],
			// FS//-{numDays} -> FS++-{numDays}
			['apollo', 'galileo', 'FS//-3', 'FS++-3', true],
			// FS//+{numDays} -> FS++#{numDays}
			['apollo', 'galileo', 'FS//+3', 'FS++#3', true],
			// FS//D{numHours} -> NON-TRANSLATABLE
			['apollo', 'galileo', 'FS//D4', null], // NON-TRANSLATABLE
			// FS:{currency} -> FS:{currency}
			['apollo', 'galileo', 'FS:CAD', 'FS:CAD', true],
			// FS{fareNum} -> FSK{fareNum}
			['apollo', 'galileo', 'FS03', 'FSK03', true],
			// FS{from}{date}{to} -> FS{from}{date}{to}
			['apollo', 'galileo', 'FSKIV10SEPRIX', 'FSKIV10SEPRIX', true],
			// FS{from}{date}{to}{rDate}{from} -> FS{from}{date}{to}{rDate}{from}
			['apollo', 'galileo', 'FSKIV10SEPRIX15SEPKIV', 'FSKIV10SEPRIX15SEPKIV', true],
			// FS{from}{date}{to}{date}{to}{date}{to} -> FS{from}{date}{to}{date}{to}{date}{to}
			['apollo', 'galileo', 'FSYUL10JULYVR15JULLAX20JULYUL', 'FSYUL10JULYVR15JULLAX20JULYUL', true],
			// FS{paxNum}{from}{date}{to} -> FS{paxNum}{from}{date}{to}
			['apollo', 'galileo', 'FS2KIV10SEPRIX', 'FS2KIV10SEPRIX', true],
			// FS{from}{date}{to}{date}{to}{date}//D -> FS{from}{date}{to}{date}{to}{date}++.D
			['apollo', 'galileo', 'FSKIV10SEPMOW8NOVKIV//D', 'FSKIV10SEPMOW8NOVKIV++.D', true],
			// FS{from}{date}{to}{rDate}{to}//+{al1}.{al2}.{al3} -> FS{from}{date}{to}{rDate}{to}++/{al1}/{al2}/{al3}
			['apollo', 'galileo', 'FSKIV10SEPRIX15SEPKIV//+PS.SU.TK', 'FSKIV10SEPRIX15SEPKIV++/PS/SU/TK', true],
			// FS{from}{date}{to}{rDate}{to}//+/*{allianceCode} -> FS{from}{date}{to}{rDate}{to}++//*{allianceCode}
			['apollo', 'galileo', 'FSCHI20SEPLON30SEPCHI//+/*A', 'FSCHI20SEPLON30SEPCHI++//*A', true],
			// FS{from}{date}{to}{rDate}{to}//¤C -> FS{from}{date}{to}{rDate}{to}++-BUSNS
			['apollo', 'galileo', 'FSKIV10JULRIX20JULKIV//\u00A4C', 'FSKIV10JULRIX20JULKIV++-BUSNS', true],
			// FS{from}{date}{to}{rDate}{to}//¤F -> FS{from}{date}{to}{rDate}{to}++-FIRST
			['apollo', 'galileo', 'FSKIV10JULRIX20JULKIV//\u00A4F', 'FSKIV10JULRIX20JULKIV++-FIRST', true],
			// FS{from}{date}{to}{rDate}{to}//¤Y -> FS{from}{date}{to}{rDate}{to}++-ECON
			['apollo', 'galileo', 'FSKIV10JULRIX20JULKIV//\u00A4Y', 'FSKIV10JULRIX20JULKIV++-ECON', true],
			// FS{from}{date}{to}{rDate}{to}//¤W -> FS{from}{date}{to}{rDate}{to}++-PREME
			['apollo', 'galileo', 'FSKIV10JULRIX20JULKIV//\u00A4W', 'FSKIV10JULRIX20JULKIV++-PREME', true],
			// FS{from}{date}{to}{rDate}{to}//¤P -> FS{from}{date}{to}{rDate}{to}++-PREMF
			['apollo', 'galileo', 'FSKIV10JULRIX20JULKIV//\u00A4P', 'FSKIV10JULRIX20JULKIV++-PREMF', true],
			['sabre', 'galileo', 'JR.CHI/S-OYLON20SEP*A/S-OYCHI30SEP*A', 'FSCHI20SEPLON30SEPCHI++//*A', true],
			['galileo', 'sabre', 'FSYUL10JULYVR15JULLAX20JULYUL', 'JR.YUL/S-OYYVR10JUL/S-OYLAX15JUL/S-OYYUL20JUL', true],

			['sabre', 'galileo', 'JR.KIV/S-OYRIX10SEPPSSUTK/S-OYKIV15SEPPSSUTK', 'FSKIV10SEPRIX15SEPKIV++/PS/SU/TK'],
			['sabre', 'galileo', 'JR.KIV/S-OYRIX10SEP/S-OYKIV15SEP', 'FSKIV10SEPRIX15SEPKIV++-ECON'],
			['amadeus', 'galileo', 'FXD//A*A', 'FS++//*A'],

			['apollo', 'sabre', '$D25MAYNYCDXB+EK-ITX\u00A4C', 'FQNYCDXB25MAYBB¥PITX-EK'],
			// seat commands follow

			['apollo', 'galileo', '9D', '*SD', true],
			// 9D/S{segNum} -> SM*S{segNum}
			['apollo', 'galileo', '9D/S2', 'SM*S2', true],
			// 9V/{al}{flightNum}{class}{date}{from}{to} -> SM*{al}{flightNum}{class}{date}{from}{to}
			['apollo', 'galileo', '9V/DL401Y20SEPJFKLHR', 'SM*DL401Y20SEPJFKLHR', true],
			// 9V/S{segNum} -> SA*S{segNum}
			['apollo', 'galileo', '9V/S1', 'SA*S1', true],
			['apollo', 'galileo', '9S', 'S.NW', true],
			['apollo', 'galileo', '9S/A', 'S.NA', true],
			// 9S/S{segNum} -> S.S{segNum}/NW
			['apollo', 'galileo', '9S/S1', 'S.S1/NW', true],
			// 9S/S{segNum1}+{segNum2}/A -> S.S{segNum1}.{segNum2}/NA
			['apollo', 'galileo', '9S/S1+2/A', 'S.S1.2/NA', true],
			// 9S/N{paxNum3} -> S.P{paxNum3}/NW
			['apollo', 'galileo', '9S/N3', 'S.P3/NW', true],
			// 9S/N{paxNum2}/A -> S.P{paxNum2}/NA
			['apollo', 'galileo', '9S/N2/A', 'S.P2/NA', true],
			// 9S/N{paxNum1}/S{segNum2} -> S.P{paxNum1}S{segNum2}/NW
			['apollo', 'galileo', '9S/N1/S2', 'S.P1S2/NW', true],
			// 9S/N{paxNum1}/S{segNum2}/A -> S.P{paxNum1}S{segNum2}/NW
			['apollo', 'galileo', '9S/N1/S2/A', 'S.P1S2/NA', true],
			// 9S/N{paxNum1}/S{segNum2}/{seatNum} -> S.P{paxNum1}S{segNum2}/{seatNum}
			['apollo', 'galileo', '9S/N1/S2/17A', 'S.P1S2/17A', true],
			// 9S/S{segNum2}/{seatNum1}{seatNum2} -> S.S{segNum2}/{seatNum1}/{seatNum2}
			['apollo', 'galileo', '9S/S2/17A18C', 'S.S2/17A/18C', true],
			// 9S/S{segNum2}/{seatNum1}{seatNum2} -> S.S{segNum2}/{seatNum1}.{seatNum2}
			['apollo', 'galileo', '9S/S2/17AB', 'S.S2/17A/17B', false],
			['apollo', 'galileo', '9X', 'S.@', true],
			// 9X/S{segNum3} -> S.S{segNum3}@
			['apollo', 'galileo', '9X/S3', 'S.S3@', true],
			// 9X/N{paxNum2}/S{segNum1} -> S.P{paxNum2}S{segNum1}@
			['apollo', 'galileo', '9X/N2/S1', 'S.P2S1@', true],
			// 9X/S{segNum3}/{seatNum} -> DOES NOT EXIST
			['apollo', 'galileo', '9X/S3/17A', null],
			// 9X/N{paxNum1}-{paxNum4}/S{segNum2} -> S.P{paxNum1}-{paxNum4}S{segNum2}
			['apollo', 'galileo', '9X/N1-4/S2', null], // grouped pax 1.4 - untranslatable
			// 9C/S{segNum4}/{seatNum1}*{seatNum2} -> DOES NOT EXIST
			['apollo', 'galileo', '9C/S4/7A*9C', null],
			// 9C/S{segNum3}/{seatNum1}*{seatNum2} -> DOES NOT EXIST
			['apollo', 'galileo', '9C/S3/4A-C*6AB7A', null],

			['sabre', 'galileo', '*B', '*SD', true],
			// *B{segNum} -> SM*S{segNum}
			['sabre', 'galileo', '*B2', 'SM*S2', true],
			// 4G*{al}{flightNum}{class}{date}{from}{to} -> SM*{al}{flightNum}{class}{date}{from}{to}
			['sabre', 'galileo', '4G*DL401Y20SEPJFKLHR', 'SM*DL401Y20SEPJFKLHR', true],
			// 4G{segNum}* -> SA*S{segNum}
			['sabre', 'galileo', '4G1*', 'SA*S1', true],
			['sabre', 'galileo', '4GA/W', 'S.NW', true],
			['sabre', 'galileo', '4GA/A', 'S.NA', true],
			// 4G{segNum}/W -> S.S{segNum}/NW
			['sabre', 'galileo', '4G1/W', 'S.S1/NW', true],
			// 4G{segNum1},{segNum2}/A -> S.S{segNum1}.{segNum2}/NA
			['sabre', 'galileo', '4G1,2/A', 'S.S1.2/NA', true],
			// 4GA/W-{paxNum3} -> S.P{paxNum3}/NW
			['sabre', 'galileo', '4GA/W-3.1', 'S.P3/NW', true],
			// 4GA/A-{paxNum2} -> S.P{paxNum2}/NA
			['sabre', 'galileo', '4GA/A-2.1', 'S.P2/NA', true],
			// 4G{segNum2}/W-{paxNum1} -> S.P{paxNum1}S{segNum2}/NW
			['sabre', 'galileo', '4G2/W-1.1', 'S.P1S2/NW', true],
			// 4G{segNum2}/A-{paxNum1} -> S.P{paxNum1}S{segNum2}/NW
			['sabre', 'galileo', '4G2/A-1.1', 'S.P1S2/NA', true],
			// 4G{segNum2}/{seatNum}-{paxNum1} -> S.P{paxNum1}S{segNum2}/{seatNum}
			['sabre', 'galileo', '4G2/17A-1.1', 'S.P1S2/17A', true],
			// 4G{segNum2}/{seatNum1}{seatNum2} -> S.S{segNum2}/{seatNum1}/{seatNum2}
			['sabre', 'galileo', '4G2/17A18C', 'S.S2/17A/18C', true],
			// 4G{segNum2}/{seatNum} -> S.S{segNum2}/{seatNum1}.{seatNum2}
			['sabre', 'galileo', '4G2/17AB', 'S.S2/17A/17B', false],
			['sabre', 'galileo', '4GXALL', 'S.@', true],
			// 4GX{segNum3} -> S.S{segNum3}@
			['sabre', 'galileo', '4GX3', 'S.S3@', true],
			// 4GX{segNum1}-{paxNum2} -> S.P{paxNum2}S{segNum1}@
			['sabre', 'galileo', '4GX1-2.1', 'S.P2S1@', true],
			// 4GX{segNum3}/{seatNum} -> DOES NOT EXIST
			['sabre', 'galileo', '4GX3/17A', null],
			// 4GX{segNum2}-{paxNum1}-{paxNum4} -> S.P{paxNum1}-{paxNum4}S{segNum2}
			['sabre', 'galileo', '4GX2-1.1-4.1', 'S.P1.2.3.4S2@', false],
			['galileo', 'sabre', 'S.P1.2.3.4S2@', '4GX2-1.1,2.1,3.1,4.1', false],
			['sabre', 'galileo', '4G3/X', 'S.S3/NB', true],

			['amadeus', 'galileo', 'RTSTR', '*SD', true],
			// RTSTR/S{segNum} -> SM*S{segNum}
			['amadeus', 'galileo', 'RTSTR/S2', 'SM*S2', true],
			// SM{al}{flightNum}/{class}/{date}{from}{to} -> SM*{al}{flightNum}{class}{date}{from}{to}
			['amadeus', 'galileo', 'SMDL401/Y/20SEPJFKLHR', 'SM*DL401Y20SEPJFKLHR', true],
			// SM{segNum} -> SA*S{segNum}
			['amadeus', 'galileo', 'SM1', 'SA*S1', true],
			['amadeus', 'galileo', 'ST/W', 'S.NW', true],
			['amadeus', 'galileo', 'ST/A', 'S.NA', true],
			['amadeus', 'galileo', 'ST/B', 'S.NB', true],
			// ST/W/S{segNum} -> S.S{segNum}/NW
			['amadeus', 'galileo', 'ST/W/S1', 'S.S1/NW', true],
			// ST/A/S{segNum1},{segNum2} -> S.S{segNum1}.{segNum2}/NA
			['amadeus', 'galileo', 'ST/A/S1,2', 'S.S1.2/NA', true],
			// ST/B/S{segNum3} -> S.S{segNum3}/NB
			['amadeus', 'galileo', 'ST/B/S3', 'S.S3/NB', true],
			// ST/W/P{paxNum3} -> S.P{paxNum3}/NW
			['amadeus', 'galileo', 'ST/W/P3', 'S.P3/NW', true],
			// ST/A/P{paxNum2} -> S.P{paxNum2}/NA
			['amadeus', 'galileo', 'ST/A/P2', 'S.P2/NA', true],
			// ST/B/P{paxNum1} -> S.P{paxNum1}/NB
			['amadeus', 'galileo', 'ST/B/P1', 'S.P1/NB', true],
			// ST/W/P{paxNum1}/S{segNum2} -> S.P{paxNum1}S{segNum2}/NW
			['amadeus', 'galileo', 'ST/W/P1/S2', 'S.P1S2/NW', true],
			// ST/A/P{paxNum1}/S{segNum2} -> S.P{paxNum1}S{segNum2}/NW
			['amadeus', 'galileo', 'ST/A/P1/S2', 'S.P1S2/NA', true],
			// ST/B/P{paxNum1}/S{segNum2} -> S.P{paxNum1}S{segNum2}/NB
			['amadeus', 'galileo', 'ST/B/P1/S2', 'S.P1S2/NB', true],
			// ST/{seatNum}/P{paxNum1}/S{segNum2} -> S.P{paxNum1}S{segNum2}/{seatNum}
			['amadeus', 'galileo', 'ST/17A/P1/S2', 'S.P1S2/17A', true],
			// ST/{seatNum1}/{seatNum2}/S{segNum2} -> S.S{segNum2}/{seatNum1}/{seatNum2}
			['amadeus', 'galileo', 'ST/17A/18C/S2', 'S.S2/17A/18C', true],
			// ST/{seatNum}/S{segNum2} -> S.S{segNum2}/{seatNum1}.{seatNum2}
			['amadeus', 'galileo', 'ST/17AB/S2', 'S.S2/17A/17B', false],
			['amadeus', 'galileo', 'SX', 'S.@', true],
			// SX/S{segNum3} -> S.S{segNum3}@
			['amadeus', 'galileo', 'SX/S3', 'S.S3@', true],

			// MP*{al}{ffNumber} -> M.{al}{ffNumber}
			['apollo', 'galileo', 'MP*UA12345678910', 'M.UA12345678910', true],
			// MP*¤{alFF}{ffNumber} -> M.{al}{ffNumber}/{alFF}
			['galileo', 'apollo', 'M.UA12345678910/LH', 'MP*@LH12345678910', false],
			// MPN{paxNum}*{al}{ffNumber} -> M.P{paxNum}/{al}{ffNumber}
			['apollo', 'galileo', 'MPN1*UA12345678910', 'M.P1/UA12345678910', true],
			// MPN{paxNum}*¤{alFF}{ffNumber} -> M.P{paxNum}/{al}{ffNumber}/{alFF}
			['galileo', 'apollo', 'M.P1/UA12345678910/LH', 'MPN1*\u00A4LH12345678910', false],
			['apollo', 'galileo', '*MP', '*MM', true],
			['apollo', 'galileo', 'MP/X/*ALL', 'M.@', true],
			// MP/X/N{paxNum}*{alFF} -> M.P{paxNum}@
			['apollo', 'galileo', 'MP/X/N1*LH', 'M.P1*LH@', true],
			// F:{al}{flightNum}/{date} -> L@{al}/LF{al}{flightNum}/{date}
			['apollo', 'galileo', 'F:LH123/29APR', 'L@LH/LFLH123/29APR', true],

			// FF{al}{ffNumber} -> M.{al}{ffNumber}
			['sabre', 'galileo', 'FFUA12345678910', 'M.UA12345678910', true],
			// FF{al}{ffNumber}/{alFF} -> M.{al}{ffNumber}/{alFF}
			['sabre', 'galileo', 'FFUA12345678910/LH', 'M.UA12345678910/LH', true],
			// FF{al}{ffNumber}-{paxNum} -> M.P{paxNum}/{al}{ffNumber}
			['sabre', 'galileo', 'FFUA12345678910-1.1', 'M.P1/UA12345678910', true],
			// FF{al}{ffNumber}/{alFF}-{paxNum} -> M.P{paxNum}/{al}{ffNumber}/{alFF}
			['sabre', 'galileo', 'FFUA12345678910/LH-1.1', 'M.P1/UA12345678910/LH', true],
			['sabre', 'galileo', '*FF', '*MM', true],
			['sabre', 'galileo', 'FF\u00A4ALL', 'M.@', true],
			// FF{paxNum}¤ -> M.P{paxNum}@
			['sabre', 'galileo', 'FF1\u00A4', null, false], // 1 is line number
			['galileo', 'sabre', 'M.P1@', null, false], // 1 is pax number
			// 2{al}{flightNum}/{date} -> L@{al}/LF{al}{flightNum}/{date}
			['sabre', 'galileo', '2LH123/29APR', 'L@LH/LFLH123/29APR', true],

			// FFN{al}-{ffNumber} -> M.{al}{ffNumber}
			['amadeus', 'galileo', 'FFNUA-12345678910', 'M.UA12345678910', true],
			// FFN{al}-{ffNumber},{al},{alFF} -> M.{al}{ffNumber}/{alFF}
			['amadeus', 'galileo', 'FFNUA-12345678910,UA,LH', 'M.UA12345678910/LH', true],
			// FFN{al}-{ffNumber}/P{paxNum} -> M.P{paxNum}/{al}{ffNumber}
			['amadeus', 'galileo', 'FFNUA-12345678910/P1', 'M.P1/UA12345678910', true],
			// FFN{alff}-{ffNumber},{al}/P{paxNum} -> M.P{paxNum}/{al}{ffNumber}/{alFF}
			['amadeus', 'galileo', 'FFNUA-12345678910,UA,LH/P1', 'M.P1/UA12345678910/LH', true],
			// DO{al}{flightNum}/{date} -> L@{al}/LF{al}{flightNum}/{date}
			['amadeus', 'galileo', 'DOLH123/29APR', 'L@LH/LFLH123/29APR', true],

			['apollo', 'galileo', '*LF', '*FF', true],
			['apollo', 'galileo', '*LF1', '*FF1', true],
			['sabre', 'galileo', '*PQ', '*FF', true],
			['sabre', 'galileo', '*PQ2', '*FF2', true],
			['amadeus', 'galileo', 'TQT', '*FF', true],
			['amadeus', 'galileo', 'TQT/T4', '*FF4', true],

			// Price and store as booked private
			['apollo', 'galileo', 'T:$B/:A', 'FQ:A'],
			['sabre', 'galileo', 'WPRQ¥PV', 'FQ:A'],
			['amadeus', 'galileo', 'FXP/R,U', 'FQ:A'],
			// Price and store as booked publsihed
			['apollo', 'galileo', 'T:$B:N', 'FQ:N'],
			['sabre', 'galileo', 'WPRQ¥PL', 'FQ:N'],
			['amadeus', 'galileo', 'FXP/R,P', 'FQ:N'],
			// Price and store as booked publsihed
			['apollo', 'galileo', 'T:$B/:N', 'FQ:N'],
			['sabre', 'galileo', 'WPRQ¥PL', 'FQ:N'],
			['amadeus', 'galileo', 'FXP/R,P', 'FQ:N'],
			// Store the fare for adult, child
			['apollo', 'galileo', 'T:$BN1+2*C05', 'FQP1.2*C05'],
			['sabre', 'galileo', 'WPP1ADT/1CNN¥RQ', 'FQP1*ADT.2*CNN'],
			['amadeus', 'galileo', 'FXP/RADT*C05', 'FQP1*ADT.2*C05'],
			// Store the fare for adult,  child,  infant
			['apollo', 'galileo', 'T:$BN1+2*C05+3*INF', 'FQP1.2*C05.3*INF'],
			['sabre', 'galileo', 'WPP1ADT/1CNN/1INF¥RQ', 'FQP1*ADT.2*CNN.3*INF'],
			['amadeus', 'galileo', 'FXP/RADT*C05*INF', 'FQP1*ADT.2*C05.3*INF'],
			// Store fare with a specific PTC for a single passenger
			['apollo', 'galileo', 'T:$B*JCB', 'FQ*JCB'],
			['sabre', 'galileo', 'WPPJCB¥RQ', 'FQ*JCB'],
			['amadeus', 'galileo', 'FXP/RJCB', 'FQ*JCB'],
			// Store fare with a specific PTC's for a multiple passengers
			['apollo', 'galileo', 'T:$BN1*JCB+2*J06+3*JNF', 'FQP1*JCB.2*J06.3*JNF'],
			['sabre', 'galileo', 'WPP1JCB/1J06/1JNF¥RQ', 'FQP1*JCB.2*J06.3*JNF'],
			['amadeus', 'galileo', 'FXP/RJCB*J08', 'FQP1*JCB.2*J08'],
			// Display stored fare
			['apollo', 'galileo', '*LF', '*FF', true],
			['sabre', 'galileo', '*PQ', '*FF', true],
			['amadeus', 'galileo', 'TQT', '*FF', true],
			// Display specific store
			['apollo', 'galileo', '*LF2', '*FF2', true],
			['sabre', 'galileo', '*PQ2', '*FF2', true],
			['amadeus', 'galileo', 'TQT/T2', '*FF2', true],
			// Delete all stored fare
			['apollo', 'galileo', 'XT', 'FXALL', true],
			['sabre', 'galileo', 'PQD-ALL', 'FXALL', true],
			['amadeus', 'galileo', 'TTE/ALL', 'FXALL', true],
			// Delete specific stored fared
			['apollo', 'galileo', 'XT3', 'FX3', true],
			['sabre', 'galileo', 'PQD3', 'FX3', true],
			['amadeus', 'galileo', 'TTE/T3', 'FX3', true],

			// Segment status change
			['sabre', 'apollo', '.1HK', '.1HK', true],
			['amadeus', 'apollo', '1/HK', '.1HK', true],
			['galileo', 'apollo', '@1HK', '.1HK', true],

			// FLIFO historical flight status (up to 2-3 days)
			['apollo', 'galileo', 'F:LH123/29APR', 'L@LH/LFLH123/29APR'],
			['sabre', 'galileo', '2LH123/29APR', 'L@LH/LFLH123/29APR'],
			['amadeus', 'galileo', 'DOLH123/29APR', 'L@LH/LFLH123/29APR'],

			// FLIFO historical flight status (up to 2-3 days)
			['sabre', 'apollo', '2LH123/29APR', 'F:LH123/29APR', true],
			['amadeus', 'apollo', 'DOLH123/29APR', 'F:LH123/29APR', true],
			['galileo', 'apollo', 'L@LH/LFLH123/29APR', 'F:LH123/29APR', true],

			['apollo', 'amadeus', '$BB:15JUN17', 'FXA/R,15JUN17'],
			// needs current date
			['apollo', 'amadeus', '$BB:15JUN', 'FXA/R,15JUN18'],
			['apollo', 'amadeus', 'MP*UA12345678910', 'FFNUA-12345678910'],
			['apollo', 'amadeus', 'MP*\u00A4LH12345678910', 'FFNLH-12345678910'],
			['apollo', 'amadeus', 'MPN1*UA12345678910', 'FFNUA-12345678910/P1'],
			['apollo', 'amadeus', 'MPN1*\u00A4LH12345678910', 'FFNLH-12345678910/P1'],
			['apollo', 'amadeus', '.1HK', '1/HK'],
			['apollo', 'amadeus', 'F:LH123/29APR', 'DOLH123/29APR'],
			['apollo', 'amadeus', 'FS', 'FXD'],
			['apollo', 'amadeus', 'FS//D', 'FXD//FD'],
			['apollo', 'amadeus', 'FS//+DL.AF.KL', 'FXD//ADL,AF,KL'],
			['apollo', 'amadeus', 'FSS1+2', 'FXD/S1,2'],
			['apollo', 'amadeus', 'FS//*JCB', 'FXD/RJCB'],
			['apollo', 'amadeus', 'FS//*ITX', 'FXD/RITX'],
			['apollo', 'amadeus', 'FS//\u00A4C', 'FXD//KC'],
			['apollo', 'amadeus', 'FS//\u00A4F', 'FXD//KF'],
			['apollo', 'amadeus', 'FS//\u00A4Y', 'FXD//KM'],
			['apollo', 'amadeus', 'FS//\u00A4W', 'FXD//KY'],
			['apollo', 'amadeus', '*FS', 'MPFXD'],
			['apollo', 'amadeus', 'FS//+/*A', 'FXD//A*A'],
			['apollo', 'amadeus', 'FS//-3', 'FXD//D-3'],
			['apollo', 'amadeus', 'FS//+3', 'FXD//D3'],
			['apollo', 'amadeus', 'FS:CAD', 'FXD/R,FC-CAD'],
			['apollo', 'amadeus', 'FS03', 'FXZ03'],
			['sabre', 'amadeus', 'WPNC¥B15JUN17', 'FXA/R,15JUN17'],
			['sabre', 'amadeus', 'FFUA12345678910-1.1', 'FFNUA-12345678910/P1'],
			['sabre', 'amadeus', 'FFUA12345678910/LH', 'FFNUA-12345678910,UA,LH'],
			['sabre', 'amadeus', 'FFUA12345678910-1.1', 'FFNUA-12345678910/P1'],
			['sabre', 'amadeus', 'FFUA12345678910/LH-1.1', 'FFNUA-12345678910,UA,LH/P1'],
			['sabre', 'amadeus', '.1HK', '1/HK'],
			['sabre', 'amadeus', '2LH123/29APR', 'DOLH123/29APR'],
			['sabre', 'amadeus', 'WPNI', 'FXD'],
			['sabre', 'amadeus', 'WPNIX', 'FXD//X'],
			['sabre', 'amadeus', 'WPNI/D', 'FXD//FD'],
			['sabre', 'amadeus', 'WPNI/ADLAFKL', 'FXD//ADL,AF,KL'],
			['sabre', 'amadeus', 'WPNI¥S1/4', 'FXD/S1,4'],
			['sabre', 'amadeus', 'WPNI¥PJCB', 'FXD/RJCB'],
			['sabre', 'amadeus', 'WPNI¥PITX', 'FXD/RITX'],
			['sabre', 'amadeus', 'WPNI¥TC-BB', 'FXD//KC'],
			['sabre', 'amadeus', 'WPNI¥TC-FB', 'FXD//KF'],
			['sabre', 'amadeus', 'WPNI¥TC-YB', 'FXD//KM'],
			['sabre', 'amadeus', 'WPNI¥TC-SB', 'FXD//KY'],
			['sabre', 'amadeus', 'WPNI*', 'MPFXD'],
			['sabre', 'amadeus', 'WPNI/A*A', 'FXD//A*A'],
			['sabre', 'amadeus', 'WPNI¥M3', 'FXD//D-3'],
			['sabre', 'amadeus', 'WPNI¥P3', 'FXD//D3'],
			['sabre', 'amadeus', 'WPNI¥MCAD', 'FXD/R,FC-CAD'],
			['sabre', 'amadeus', 'WC¥3X', 'FXZ3'],

			// with /MIX alias modifier - it should not interrupt translation
			['apollo', 'sabre', '$D10DECLONJFK/MIX', 'FQLONJFK10DEC/MIX'],
			['apollo', 'sabre', '$D10DECLONJFK/MDA/MIX', 'FQLONJFK10DEC/MDA/MIX'],
			['apollo', 'sabre', '$D10DECLONJFK/MIX/MDA', 'FQLONJFK10DEC/MIX/MDA'],

			['apollo', 'galileo', '01Y1Z2GK', '01Y1Z2AK'],
			['apollo', 'galileo', '02Y1*GK',  '02Y1AK*'],

			['galileo', 'apollo', '01Y1Z2AK', '01Y1Z2GK'],
			['galileo', 'apollo', '02Y1AK*',  '02Y1*GK'],

			['sabre', 'galileo', '01Y1Z2GK', '01Y1Z2AK'],
			['sabre', 'galileo', '02Y1GK*',  '02Y1AK*'],

			['galileo', 'sabre', '01Y1Z2AK', '01Y1Z2GK'],
			['galileo', 'sabre', '02Y1AK*',  '02Y1GK*'],

			// should not cause null-pointer exception, session #84156
			['sabre', 'apollo', '1',  'A*'],
			['galileo', 'apollo', 'A*R',  'A*C'], // #96896
			// #352088, should not remove airline when converting
			['galileo', 'apollo', 'A1JANACCYTO|ET',  null],

			['apollo', 'galileo', 'A*O15', 'AR15', true],
			['apollo', 'sabre', 'A*O15', '1R15', true],
			// same as in Apollo, since it would conflict with existing ACR15 format otherwise
			['sabre', 'amadeus', '1R15', 'A*O15', true],
			// should not convert to >PRICEHELP; since "PRICE" is a special alias
			['apollo', 'sabre', 'HELP PRICE', 'HELP PRICE'],
			['apollo', 'sabre', 'HELP RB', 'RBHELP'],
			['apollo', 'sabre', 'HELP RD', 'RDHELP'],
			// should not cause null pointer exception
			['apollo', 'sabre', 'X-12/0Y', null],
			// should not translate pricing commands with unknown modifiers to FQ
			['apollo', 'galileo', '$B/+2CV4', null],
			['apollo', 'sabre', 'M*FWYESB', 'W/-ATFWY¥ATESB'],
		];

		return $tests;
	}

	/**
	 * @test
	 * @dataProvider provideCommands
	 */
	testTranslator($from, $to, $cmd, $expectedResult, $bidirectional)  {
		let $baseDate, $result;

		if ($from === 'apollo') {
			// in GDS Direct translator is called after CMS character are replaced
			$cmd = php.str_replace('\u00A4', '@', $cmd);
			$cmd = php.str_replace('+', '|', $cmd);
		}
		if ($to === 'apollo') {
			$expectedResult = php.str_replace('\u00A4', '@', $expectedResult);
			$expectedResult = php.str_replace('+', '|', $expectedResult);
		}
		$baseDate = '2018-06-12 08:09:08';
		$result = (new GdsDialectTranslator()).setBaseDate($baseDate).translate($from, $to, $cmd);
		try {
			let expected = normCmd($to, $expectedResult || null);
			let actual = normCmd($to, $result['output']);
			this.assertEquals(expected, actual, ($result['error'] || '')+' '+'forward');
			if ($bidirectional) {
				$result = (new GdsDialectTranslator()).setBaseDate($baseDate).translate($to, $from, $expectedResult);
				let expected = normCmd($from, normCmd($cmd || null));
				let actual = normCmd($from, normCmd($result['output']));
				this.assertEquals(expected, actual, ($result['error'] || '')+' '+'backward');
			}
		} catch (exc) {
			let args = process.argv.slice(process.execArgv.length + 2);
			if (args.includes('debug')) {
				console.log('\n$result\n', JSON.stringify({$from, $to, $cmd, $result}));
			}
			throw exc;
		}
	}

	getTestMapping() {
		return [
			[this.provideCommands, this.testTranslator],
		];
	}
}
GdsDialectTranslatorTest.count = 0;
module.exports = GdsDialectTranslatorTest;
