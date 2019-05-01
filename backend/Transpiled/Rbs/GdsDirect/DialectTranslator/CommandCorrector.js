// namespace Rbs\GdsDirect\DialectTranslator;

const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const php = require('../../../php.js');
const VariableTranslator = require("./VariableTranslator");
const SimplePatternTranslator = require("./SimplePatternTranslator");
const PatternTranslator = require("./PatternTranslator");

/**
 * CommandCorrector::correct('BB', 'apollo');
 * ==> '$BB'
 */
class CommandCorrector {

	constructor() {
		this.$messages = [];
		this.$errors = [];
	}

	static getLegendData() {

		return {
			'pcc': '[A-Z\\d]{3,9}',
			'not_ag': '(?!AG$).*',
			'not_city': '(?![A-Z]{3})',
			'not_date': '(?!\\d{3}[A-Z]{3})',
			'not_pcc': '[A-Z\\d]{5}',
			'wrong_date': '\\d{3}[A-Z]{3}',
			'wrong_month': '\\d{2}[A-Z]{2}',
			'nc_modificator': 'NC[SC]?',
			'char_or_num': '[A-Z0-9]'
		};
	}

	static getPatternList($gds) {
		let $patterns;

		$patterns = {
			'apollo': [
				{
					'mistake': 'BB{free_text}',
					'correct': '$BB{free_text}',
					'message': 'CORRECTED! DON\\\'T FORGET $ SIGN NEXT TIME',
				},
				{
					'mistake': '$BBB{free_text}',
					'correct': '$BB{free_text}',
				},
				{
					'mistake': '#BB{free_text}',
					'correct': '$BB{free_text}',
					'message': 'CORRECTED! USE $ SIGN NEXT TIME',
				},
				{
					'mistake': '$BB{pax_pricing_type}',
					'correct': '$BB*{pax_pricing_type}',
				},
				{
					'mistake': '$BB*JC',
					'correct': '$BB*JCB',
				},
				{
					'mistake': 'A{date}',
					'correct': 'A*{date}',
					'message': 'CORRECTED! DON\\\'T FORGET * BEFORE THE DATE',
				},
				{
					'mistake': '1*{date}{free_text}',
					'correct': '1{date}{free_text}',
					'message': 'CORRECTED! THERE IS NO NEED IN *',
				},
				{
					// Error
					'mistake': 'A{date}{city}{not_city}{free_text}',
					'message': 'ERROR! PLEASE CHECK AVAILABILITY PARAMS!',
				},
				{
					'mistake': 'A.{class}.{free_text}',
					'correct': 'A\/{class}\/{free_text}',
					'message': 'CORRECTED! USE \/ INSTEAD OF . NEXT TIME',
				},
				{
					// Error
					'mistake': 'A{wrong_date}{city_pair}{free_text}',
					'message': 'ERROR! CHECK THE DATE, IT\\\'S TOO LONG',
				},
				{
					// Error
					'mistake': 'A{wrong_month}{city_pair}',
					'message': 'ERROR! CHECK THE DATE, IT\\\'S TOO SHORT',
				},
				{
					'mistake': 'A{date}{city_pair}{ss}',
					'correct': 'A{date}{city_pair}+{ss}',
					'message': 'CORRECTED! DON\\\'T FORGET + SIGN NEXT TIME',
				},
				{
					// Error
					'mistake': 'A{date}{city_pair}+{single_char}',
					'message': 'ERROR! AIRLINE NAME IS TOO SHORT!',
				},
				{
					'mistake': 'SEM\/{pcc}\/{not_ag}{free_text}',
					'correct': 'SEM\/{pcc}\/AG{free_text}',
					'message': 'CORRECTED! SEM COMMAND ENDS WITH \/AG'
				},
				{
					'mistake': 'SEM\/{pcc}',
					'correct': 'SEM\/{pcc}\/AG',
					'message': 'CORRECTED! DON\\\'T FORGET \/AG NEXT TIME'
				},
				{
					'mistake': 'RE\/{pcc}\/AG',
					'correct': 'RE\/{pcc}\/GK',
					'message': 'CORRECTED! GK WAS USED INSTEAD OF WRONG STATUS AG'
				},
				{
					'mistake': 'A-C{free_text}',
					'correct': 'A*C{free_text}',
					'message': 'CORRECTED! USE * INSTEAD OF -',
				},
				{
					'mistake': 'A&C{free_text}',
					'correct': 'A*C{free_text}',
					'message': 'CORRECTED! USE * INSTEAD OF &',
				},
				{
					'mistake': 'A8C{free_text}',
					'correct': 'A*C{free_text}',
					'message': 'CORRECTED! USE * INSTEAD OF 8',
				},
				{
					'mistake': 'AC',
					'correct': 'A*C',
					'message': 'CORRECTED! USE * BETWEEN A and C',
				},
				{
					'mistake': '0{number}{class}{int_num}**',
					'correct': '0{number}{class}{int_num}*',
					'message': 'CORRECTED! USE ONE *',
				},
				{
					'mistake': '1*{date}',
					'correct': '1{date}',
					'message': 'CORRECTED! THERE IS NO NEED IN *',
				},
				{
					'mistake': '*C',
					'correct': 'A*C',
				},
				{
					'mistake': '*VCT',
					'correct': 'VCT*',
				},
				{
					'mistake': 'R',
					'correct': '*R',
				},

				{
					'mistake': '8R',
					'correct': '*R',
				},
				{
					'mistake': '*R*',
					'correct': '*R',
				},
				{
					'mistake': 'R*',
					'correct': '*R',
				},
				{
					'mistake': 'R*R',
					'correct': '*R',
				},
				{
					'mistake': '*E',
					'correct': '*R',
				},
				{
					'mistake': '03L1**',
					'correct': '03L1*',
				},
				{
					'mistake': '*',
					'correct': '*R',
				},
				{
					'mistake': '&*R',
					'correct': '*R',
				},
				{
					'mistake': '\u00A7*R',
					'correct': '*R',
				},
				{
					'mistake': '*(R',
					'correct': '*R',
				},
				{
					'mistake': '(R',
					'correct': '*R',
				},
				{
					'mistake': '**R',
					'correct': '*R',
				},
			],

			'sabre': [
				{
					// Error
					'mistake': '1{date}{city}{not_city}{free_text}',
					'message': 'ERROR! PLEASE CHECK AVAILABILITY PARAMS!',
				},
				{
					// Error
					'mistake': '1{date}{city_pair}\u2021{single_char}',
					'message': 'ERROR! AIRLINE NAME IS TOO SHORT!',
				},
				{
					// Error
					'mistake': '1{date}{city_pair}\u2021{single_char}',
					'message': 'ERROR! AIRLINE NAME IS TOO SHORT!',
				},
				{
					// Error
					'mistake': '1{date}{city_pair}+{single_char}',
					'message': 'ERROR! AIRLINE NAME IS TOO SHORT!',
				},
				{
					'mistake': 'A{date}{city_pair}{free_text}',
					'correct': '1{date}{city_pair}{free_text}',
					'message': 'CORRECTED! USE 1 INSTEAD OF A IN SABRE',
				},
				{
					// Error
					'mistake': '1{wrong_date}{free_text}',
					'message': 'ERROR! CHECK THE DATE, IT\\\'S TOO LONG',
				},
				{
					// Error
					'mistake': '1{wrong_month}{city_pair}',
					'message': 'ERROR! CHECK THE DATE, IT\\\'S TOO SHORT',
				},
				{
					'mistake': '1{date}{city_pair}+{ss}',
					'correct': '1{date}{city_pair}\u2021{ss}',
					'message': 'CORRECTED! USE \u2021 SIGN INSTEAD OF + NEXT TIME',
				},
				{
					'mistake': '1{date}{city_pair}{ss}',
					'correct': '1{date}{city_pair}\u2021{ss}',
					'message': 'CORRECTED! USE \u2021 SIGN BEFORE AIRLINE NEXT TIME',
				},
				{
					'mistake': '1{date}{city_pair}:{ss}',
					'correct': '1{date}{city_pair}\u2021{ss}',
					'message': 'CORRECTED! USE \u2021 SIGN INSTEAD OF : NEXT TIME',
				},
				{
					'mistake': '1{date}{city_pair}+{ss}',
					'correct': '1{date}{city_pair}\u2021{ss}',
					'message': 'CORRECTED! USE \u2021 SIGN INSTEAD OF + NEXT TIME',
				},
				{
					'mistake': '1{date}{city_pair}\u00A7{ss}',
					'correct': '1{date}{city_pair}\u2021{ss}',
					'message': 'CORRECTED! USE \u2021 SIGN INSTEAD OF \u00A7 NEXT TIME',
				},
				{
					'mistake': '1{date}{city_pair}\u00A5{ss}\u00A7',
					'correct': '1{date}{city_pair}\u2021{ss}',
				},
				{
					'mistake': '1&C{free_text}',
					'correct': '1*C{free_text}',
					'message': 'CORRECTED! USE * INSTEAD OF &',
				},
				{
					'mistake': '18C{free_text}',
					'correct': '1*C{free_text}',
					'message': 'CORRECTED! USE * INSTEAD OF 8',
				},
				{
					'mistake': '1C{free_text_but_not_2_letters}',
					'correct': '1*C{free_text_but_not_2_letters}',
					'message': 'CORRECTED! USE * BETWEEN 1 and C',
				},
				{
					'mistake': '*C{free_text_but_not_5_chars}',
					'correct': '1*C{free_text_but_not_5_chars}',
				},
				{
					'mistake': '1*CX{free_text}',
					'correct': '1\u2021CX{free_text}',
				},
				{
					'mistake': '1-C{free_text}',
					'correct': '1*C{free_text}',
					'message': 'CORRECTED! USE * INSTEAD OF -',
				},
				{
					'mistake': '1*V{free_text}',
					'correct': '1*C{free_text}',
					'message': 'CORRECTED! USE * INSTEAD OF -',
				},
				{
					'mistake': 'AAAA{pcc}{free_text}',
					'correct': 'AAA{pcc}{free_text}',
					'message': 'CORRECTED! USE AAA ONLY',
				},
				{
					// Error
					'mistake': 'AAA{not_pcc}',
					'message': 'ERROR! CHECK PCC NAME, IT\\\'S TOO LONG',
				},
				{
					'mistake': '0{number}{class}{int_num}**',
					'correct': '0{number}{class}{int_num}*',
					'message': 'CORRECTED! USE ONE *',
				},
				{
					'mistake': 'R',
					'correct': '*R',
				},
				{
					'mistake': '8R',
					'correct': '*R',
				},
				{
					'mistake': '*R*',
					'correct': '*R',
				},
				{
					'mistake': 'R*',
					'correct': '*R',
				},
				{
					'mistake': 'R*R',
					'correct': '*R',
				},
				{
					'mistake': '*E',
					'correct': '*R',
				},
				{
					'mistake': '03L1**',
					'correct': '03L1*',
				},
				{
					'mistake': '*',
					'correct': '*R',
				},
				{
					'mistake': '**IA',
					'correct': '*IA',
				},
				{
					'mistake': '*IA$',
					'correct': '*IA',
				},
				{
					'mistake': '*IAQ',
					'correct': '*IA',
				},
				{
					'mistake': '*(IA',
					'correct': '*IA',
				},
				{
					'mistake': '&*R',
					'correct': '*R',
				},
				{
					'mistake': '\u2021*R',
					'correct': '*R',
				},
				{
					'mistake': '\u00A7*R',
					'correct': '*R',
				},
				{
					'mistake': '\u00A5*R',
					'correct': '*R',
				},
				{
					'mistake': '*(R',
					'correct': '*R',
				},
				{
					'mistake': '(R',
					'correct': '*R',
				},
				{
					'mistake': '**R',
					'correct': '*R',
				},
				{
					'mistake': '**IA',
					'correct': '*IA',
				},
				{
					'mistake': 'P3D',
					'correct': '*P3D',
				},
				{
					'mistake': '1&',
					'correct': '1*',
				},
				{
					'mistake': '1*(',
					'correct': '1*',
				},
				{
					'mistake': '1(',
					'correct': '1*',
				},
				{
					'mistake': 'WPPP{pax_pricing_type}',
					'correct': 'WPP{pax_pricing_type}',
				},
				{
					'mistake': 'WPP{pax_pricing_type}:{nc_modificator}{free_text}',
					'correct': 'WPP{pax_pricing_type}\u2021{nc_modificator}{free_text}',
					'message': 'CORRECTED! USE \u2021 SIGN INSTEAD OF : NEXT TIME',
				},
				{
					'mistake': 'WPP{pax_pricing_type}{nc_modificator}{free_text}',
					'correct': 'WPP{pax_pricing_type}\u2021{nc_modificator}{free_text}',
					'message': 'CORRECTED! DON\\\'T FORGET ABOUT \u2021 NEXT TIME',
				},
				{
					'mistake': 'RE\/{pcc}\/AG',
					'correct': 'RE\/{pcc}\/GK',
					'message': 'CORRECTED! GK WAS USED INSTEAD OF WRONG STATUS AG'
				},
			],
			'galileo': [
				{
					'mistake': 'RE\/{pcc}\/AG',
					'correct': 'RE\/{pcc}\/AK',
					'message': 'CORRECTED! AK WAS USED INSTEAD OF WRONG STATUS AG'
				},
			],
			'amadeus': [
				{
					'mistake': 'RE\/{pcc}\/AG',
					'correct': 'RE\/{pcc}\/GK',
					'message': 'CORRECTED! GK WAS USED INSTEAD OF WRONG STATUS AG'
				},
			],
		};
		return $patterns[$gds] || [];
	}

	static cleanPatternPlaceholders($output) {

		return php.preg_replace(/{.+?\d}/, '', $output);
	}

	replaceAndMessage($pattern, $replacement, $input, $message) {
		let $found;

		$input = php.preg_replace($pattern, $replacement, $input, -1, $found);
		if ($found && !php.empty($message)) {
			this.$messages.push($message);
		}
		return $input;
	}

	correctTyposWithReplace($dialect, $input) {

		if ($dialect === 'apollo') {
			$input = this.replaceAndMessage(/\§/, '', $input);
			$input = this.replaceAndMessage(/‡/, '+', $input, 'CORRECTED! USE + SIGN INSTEAD OF \u2021 NEXT TIME');
			$input = this.replaceAndMessage(/¥/, '+', $input, 'CORRECTED! USE + SIGN INSTEAD OF \u00A5 NEXT TIME');
		} else if ($dialect === 'sabre') {
			if (StringUtil.startsWith($input, 'WP') || // pricing
				StringUtil.startsWith($input, '1') // availability
			) {
				$input = this.replaceAndMessage(/\:/, '\u2021', $input, 'CORRECTED! USE \u2021 SIGN INSTEAD OF : NEXT TIME');
			}
		}
		return $input;
	}

	execute($input, $dialect) {
		let $addNoteCorrected, $output, $legend, $patternData, $mistake, $correct, $result;

		$addNoteCorrected = false;
		$output = this.correctTyposWithReplace($dialect, $input);

		$legend = php.array_merge(VariableTranslator.getLegendData(),
			this.constructor.getLegendData());

		for ($patternData of Object.values(this.constructor.getPatternList($dialect))) {
			if (php.empty($patternData.mistake) ||
				!PatternTranslator.prefixMatches($patternData.mistake, $input)
			) {
				continue;
			}
			$mistake = $patternData['mistake'];
			$correct = $patternData['correct'] || '';
			$result = SimplePatternTranslator.translatePattern($output, $mistake, $correct, $legend);
			if ($result['translated']) {
				$output = this.constructor.cleanPatternPlaceholders($result['output']);
				if (php.isset($patternData['correct'])) {
					$addNoteCorrected = true;
					if (!php.empty($patternData['message'])) {
						this.$messages.push($patternData['message']);
					}
				} else {
					this.$messages.push($patternData['message'] || 'ERROR! WRONG COMMAND');
					this.$errors.push('Wrong command');
					return null;
				}
				break;
			}
		}

		if ($addNoteCorrected && php.empty(this.$messages)) {
			this.$messages.push('CORRECTED!');
		}
		return $output;
	}

	static correct($input, $dialect) {
		let $self, $output;

		$self = new this();
		$output = $self.execute($input, $dialect);
		return {
			'output': $output,
			'messages': $self.$messages,
			'errors': $self.$errors,
		};
	}

}

module.exports = CommandCorrector;