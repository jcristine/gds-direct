// namespace Rbs\GdsDirect\DialectTranslator;

const php = require('../../../php.js');
const CommandCorrector = require("../../../../../../backend/Transpiled/Rbs/GdsDirect/DialectTranslator/CommandCorrector");

class CommandCorrectorTest extends require('../../../Lib/TestCase.js') {
	provideCommands() {

		return [
			['apollo', 'BB', '$BB'],
			['apollo', '#BB', '$BB'],
			['apollo', 'A20SEP', 'A*20SEP'],
			['apollo', '1*28JUL', '128JUL'],
			['apollo', 'A22JULYOWFRA¥AC', 'A22JULYOWFRA+AC'],
			['apollo', 'A16JANLONEWR+DL§', 'A16JANLONEWR+DL'],
			['apollo', 'A16DECFRALOSET', 'A16DECFRALOS+ET'],
			['apollo', '$BBJCB', '$BB*JCB'],
			['apollo', 'A234JULNYCLON+IB', null],
			['apollo', 'A17JULKIVRI+PS', null],
			['apollo', 'A20SEPKIVRIX+P', null],
			['apollo', 'A28JULLON+ET', null],
			['apollo', 'A.L.5DECIADACC', 'A/L/5DECIADACC'],
			['apollo', 'A-C', 'A*C'],
			['apollo', 'A&C', 'A*C'],
			['apollo', 'A8C', 'A*C'],
			['apollo', 'AC', 'A*C'],
			['apollo', '*C', 'A*C'],
			['apollo', '*VCT', 'VCT*'],
			['apollo', 'A20SENYCMNL', null],
			['apollo', 'R', '*R'],
			['apollo', '8R', '*R'],
			['apollo', '*R*', '*R'],
			['apollo', 'R*', '*R'],
			['apollo', 'R*R', '*R'],
			['apollo', '*E', '*R'],
			['apollo', '&*R', '*R'],
			['apollo', '§*R', '*R'],
			['apollo', '*(R', '*R'],
			['apollo', '*', '*R'],
			['apollo', '**R', '*R'],
			['apollo', '(R', '*R'],
			['apollo', '03L1**', '03L1*'],
			['apollo', 'SEM/37AF/AH', 'SEM/37AF/AG'],
			['apollo', 'SEM/37AF/AG', 'SEM/37AF/AG'],
			['apollo', '$BBB', '$BB'],
			['apollo', 'A16DECFRALOSET', 'A16DECFRALOS+ET'],
			['apollo', 'A17JULKIVRI+PS', null],
			['apollo', 'A20SEPKIVRIX+P', null],
			['apollo', 'A28JULLON+ET', null],

			['sabre', 'AAAS12D', 'AAAS12D'],
			['sabre', 'R', '*R'],
			['sabre', '8R', '*R'],
			['sabre', '*R*', '*R'],
			['sabre', 'R*', '*R'],
			['sabre', 'R*R', '*R'],
			['sabre', '*E', '*R'],
			['sabre', '&*R', '*R'],
			['sabre', '§*R', '*R'],
			['sabre', '*(R', '*R'],
			['sabre', '*', '*R'],
			['sabre', '**R', '*R'],
			['sabre', '(R', '*R'],
			['sabre', '03L1**', '03L1*'],
			['sabre', '122JULYOWFRA+AC', '122JULYOWFRA‡AC'],
			['sabre', '125AUGDKRJFK:IB', '125AUGDKRJFK‡IB'],
			['sabre', '120SEPKIVRIX§PS', '120SEPKIVRIX‡PS'],
			['sabre', '116JANLONEWR¥DL§', '116JANLONEWR‡DL'],
			['sabre', '116DECFRALOSET', '116DECFRALOS‡ET'],
			['sabre', '1&C', '1*C'],
			['sabre', '18C', '1*C'],
			['sabre', '1C', '1*C'],
			['sabre', '*C', '1*C'],
			['sabre', '1*CX', '1‡CX'],
			['sabre', '1-C', '1*C'],
			['sabre', '1*V', '1*C'],
			['sabre', '1(', '1*'],
			['sabre', '1*(', '1*'],
			['sabre', 'AAAA6IIF', 'AAA6IIF'],
//            ['sabre', '120SENYCMNL', '120SEPNYCMNL'],
			['sabre', '1&', '1*'],
			['sabre', 'WPPJCB:NC', 'WPPJCB‡NC'],
			['sabre', 'PE¥TEST@ITNCORP.COM¥', 'PE¥TEST@ITNCORP.COM¥'], // No changes should be made
			['sabre', 'PE‡TEST@ITNCORP.COM‡', 'PE‡TEST@ITNCORP.COM‡'], // No changes should be made
			['sabre', 'WPPJCB:NCS', 'WPPJCB‡NCS'],
			['sabre', 'WPPJCBNC', 'WPPJCB‡NC'],
			['sabre', 'WPPJCBNCS', 'WPPJCB‡NCS'],
			['sabre', '**IA', '*IA'],
			['sabre', 'WPPJCB:NCB', 'WPPJCB‡NCB'],
			['sabre', 'WPPPJCB', 'WPPJCB'],
			['sabre', 'P3D', '*P3D'],
			['sabre', '128JULLON¥ET', null],
			['sabre', 'AAAU2E55', null],
			['sabre', '1124JULNYCLON¥IB-S', null],
			['sabre', '117JULBJMAD¥ET', null],
			['sabre', '120SEPKIVRIX+P', null],
			['sabre', '122JULYOWFRA+AC', '122JULYOWFRA‡AC'],
			['sabre', '120SEPKIVRIX§PS', '120SEPKIVRIX‡PS'],
			['sabre', 'WPPJCB:NC', 'WPPJCB‡NC'],
			['sabre', 'WPPJCB:NCS', 'WPPJCB‡NCS'],
			['sabre', 'WPPJCBNC', 'WPPJCB‡NC'],
			['sabre', 'WPPJCBNCS', 'WPPJCB‡NCS'],
			['sabre', '128JULLON‡ET', null],
			['sabre', '117JULBJMAD‡ET', null],
			['sabre', '120SEPKIVRIX‡P', null],
			['sabre', '120SEPKIVRIX:P', null],
			['sabre', 'A1JANLOSYYZ‡BA', '11JANLOSYYZ‡BA'],

			['sabre', 'WPNCB:PJCB', 'WPNCB‡PJCB'],
			// ":" should not be replaced with "¥" in _any_ command, just in a few specific cases
			['sabre', 'N:EMANUEL/MADISON ROSE*P-C11', 'N:EMANUEL/MADISON ROSE*P-C11'],

			// >*C...; should be replaced with >1*C...; but only if it is not a PNR like >*CSOZMB;
			['sabre', '*C', '1*C'],
			['sabre', '*C5', '1*C5'],
			['sabre', '*C26', '1*C26'],
			// should not be changed!
			['sabre', '*CSOZMB', '*CSOZMB'],

			// corrector should not remove /MDA
			['apollo', '$D20MARNYCPAR/MDA', '$D20MARNYCPAR/MDA'],
			['apollo', '$D20FEBNYCSFO/MDA', '$D20FEBNYCSFO/MDA'],

			// when trying to emulate Amadeus PCC using Apollo dialect
			['apollo', 'SEM/SFO1S21D2/AG', 'SEM/SFO1S21D2/AG'],
			// when trying to emulate Amadeus PCC using Sabre dialect
			['sabre', 'AAASFO1S21D2', 'AAASFO1S21D2'],
			['apollo', 'SEM/2G56', 'SEM/2G56/AG'],

			// should not change to >1*CHI;
			['sabre', '1CHI', '1CHI'],

			// should not get changed to $BBC/UA
			['apollo', '$BBCUA', '$BBCUA'],
			['apollo', '$BB/CUA', '$BB/CUA'],

			// should preserve /MDA
			['apollo', '*LF/MDA', '*LF/MDA'],
			['galileo', '*FF/MDA', '*FF/MDA'],

			['apollo', 'RE/2I61/AG', 'RE/2I61/GK'],
			['galileo', 'RE/K9P/AG', 'RE/K9P/AK'],
			['amadeus', 'RE/SFO123456/AG', 'RE/SFO123456/GK'],
			['sabre', 'RE/6IIF/AG', 'RE/6IIF/GK'],
			// undocumented >U; has something to do with "messages", possibly the queue messages
			// the deal is, it is really close to the "I" button and agents accidentally hit it VERY often
			['apollo', 'UI', 'I'],
			['apollo', 'U', 'I'],

			// cyrillic characters (relevant for Moldova and Riga)
			['apollo', '*К', '*R'],
			['apollo', 'Ф10ЬФНОАЛЬТД', 'A10MAYJFKMNL'],
		];
	}

	/**
	 * @test
	 * @dataProvider provideCommands
	 */
	testCorrector($gds, $input, $expectedResult) {
		let $result;

		$result = CommandCorrector.correct($input, $gds);
		this.assertEquals($expectedResult, $result['output'], $result['error'] || '');
	}

	getTestMapping() {
		return [
			[this.provideCommands, this.testCorrector],
		];
	}
}

CommandCorrectorTest.count = 0;
module.exports = CommandCorrectorTest;
