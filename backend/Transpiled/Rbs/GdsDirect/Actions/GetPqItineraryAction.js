// namespace Rbs\GdsDirect\Actions;

const Fp = require('../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../Lib/Utils/StringUtil.js');
const Errors = require('../../../Rbs/GdsDirect/Errors.js');
const CmsApolloTerminal = require('../../../Rbs/GdsDirect/GdsInterface/CmsApolloTerminal.js');
const PtcUtil = require('../../../Rbs/Process/Common/PtcUtil.js');

/**
 * return pricing/itinerary dump/parsed data
 * this action is called before terminal+importPq, supposedly being
 * faster, to give mandatory data to CMS as soon as possible
 */
class GetPqItineraryAction {
	static checkPnrData($parsedReservation) {
		let $errors, $allowedStatuses, $segment;
		$errors = [];
		$allowedStatuses = ['HK', 'SS', 'GK', 'DK', 'HS', 'AK'];
		if (php.empty($parsedReservation['itinerary'])) {
			$errors.push(Errors.getMessage(Errors.ITINERARY_IS_EMPTY));
		}
		for ($segment of $parsedReservation['itinerary']) {
			if (!php.in_array($segment['segmentStatus'], $allowedStatuses)) {
				$errors.push(Errors.getMessage(Errors.BAD_SEGMENT_STATUS, {
					'segmentNumber': $segment['segmentNumber'],
					'segmentStatus': $segment['segmentStatus'],
				}));
			}
		}
		return $errors;
	}

	/**
	 * some pricing commands, like $BBQ01 or T:V1 reuse modifiers from previous commands,
	 * so we have to check both the entered command and command copy in pricing output
	 */
	static checkCmdInPartialApolloPricingDump($output, $leadData) {
		let $errors, $lines, $cmdLine, $nextLine, $cmd, $cmdErrors;
		$errors = [];
		$lines = StringUtil.lines($output);
		$cmdLine = php.array_shift($lines);
		if (php.strlen($cmdLine) === 64) {
			$nextLine = php.array_shift($lines);
			if (!StringUtil.contains(php.rtrim($nextLine), ' ')) {
				// command was wrapped
				$cmdLine += php.array_shift($lines);
			}
		}
		if (StringUtil.startsWith($cmdLine, '>')) {
			$cmd = php.substr($cmdLine, 1);
			// $BB0 does not include modifiers
			// in the output, so we can't check them
			if ($cmd !== '$BB0') {
				$cmdErrors = this.checkPricingCommand('apollo', $cmd, $leadData);
				$errors = php.array_merge($errors, $cmdErrors);
			}
		} else {
			$errors.push('Unexpected start of command copy - ' + ($cmdLine[0] || '(nothing)'));
		}
		return $errors;
	}

	static checkPricingOutput($gds, $output, $leadData) {
		let $errors, $tooShortToBeValid, $needsRebook;
		$errors = [];
		$tooShortToBeValid = !php.preg_match(/\n.*\n/, StringUtil.wrapLinesAt($output, 64));
		if ($tooShortToBeValid) {
			$errors.push(Errors.getMessage(Errors.GDS_PRICING_ERROR, {
				'response': php.trim(php.str_replace(php.PHP_EOL, ' ', $output)),
			}));
		}
		$needsRebook = false;
		if ($gds == 'apollo') {
			$needsRebook = php.preg_match(/REBOOK PNR SEGMENT/, $output);
			$errors = php.array_merge($errors, this.checkCmdInPartialApolloPricingDump($output, $leadData));
		} else if ($gds == 'sabre') {
			$needsRebook = php.preg_match(/CHANGE BOOKING CLASS/, $output);
		} else if ($gds == 'amadeus') {
			$needsRebook = php.preg_match(/REBOOK TO CHANGE BOOKING CLASS AS SPECIFIED/, $output);
		} else if ($gds == 'galileo') {
			$needsRebook = php.preg_match(/\*\*\* REBOOK BF SEGMENTS/, $output);
		} else {
			$errors.push(Errors.getMessage(Errors.UNSUPPORTED_GDS, {'gds': $gds}));
		}
		if ($needsRebook) {
			$errors.push(Errors.getMessage(Errors.MUST_REBOOK));
		}
		return $errors;
	}

	/**
	 * these errors decide whether button will be enabled or not
	 * Bruce asked to separate these rules from the rest because they are "obvious for a sales agent"
	 * Eldar asked to return them nonetheless - they will likely appear if you hover on disabled button
	 */
	static checkPricingCommandObviousRules($gds, $pricingCmd) {
		let $errors, $errorRecords, $errorRec, $cmdParsed;
		$errors = [];
		if ($gds == 'apollo') {
			$errorRecords = CmsApolloTerminal.checkPricingCmdObviousPqRuleRecords($pricingCmd);
			for ($errorRec of $errorRecords) {
				$errors.push(Errors.getMessage($errorRec['type'], $errorRec['data'] || null));
			}
		}
		return $errors;
	}

	static checkPricingCommand($gds, $cmd, $leadData) {
		let $errors, $priced, $ptcErrors, $ageGroups, $paxNumInfants, $paxNumChildren, $ageGroupsPlural;
		$errors = this.checkPricingCommandObviousRules($gds, $cmd);
		let ifc;
		if ($gds === 'apollo') {
			ifc = new CmsApolloTerminal();
		} else {
			$errors.push('Unsupported GDS ' + $gds + ' for pricing command check');
			return $errors;
		}
		$priced = ifc.getPricedPtcs($cmd);
		if ($ptcErrors = $priced['errors'] || []) {
			$errors = php.array_merge($errors, $ptcErrors);
		} else {
			$ageGroups = this.ptcsToAgeGroups($priced['ptcs']);
			$errors = php.array_merge($errors, this.checkPricedAgeGroups($ageGroups, $leadData));
		}
		$paxNumInfants = $leadData['paxNumInfants'] || 0;
		$paxNumChildren = $leadData['paxNumChildren'] || 0;
		if ($gds == 'apollo') {
			// If I'm not mistaken, we do this because Apollo may
			// price child and adult in different booking classes
			if (StringUtil.startsWith($cmd, '$BB')) {
				$ageGroupsPlural = php.array_filter([
					$paxNumChildren > 0 ? 'children' : null,
					$paxNumInfants > 0 ? 'infants' : null,
				]);
				if (php.count($ageGroupsPlural) > 0) {
					$errors.push(Errors.getMessage(Errors.BAD_MOD_LOW_FARE_CHILD, {
						'ageGroupsPlural': php.implode(', ', $ageGroupsPlural), 'modifier': '$BB', 'alternative': '$B',
					}));
				}
			}
		}
		return $errors;
	}

	static ptcsToAgeGroups($pricedPtcs) {
		$pricedPtcs = $pricedPtcs || ['ADT'];
		$pricedPtcs = Fp.map(($ptc) => {
			return $ptc || 'ADT';
		}, $pricedPtcs);
		return php.array_column(Fp.map([PtcUtil.class, 'parsePtc'], $pricedPtcs), 'ageGroup');
	}

	static checkPricedAgeGroups($pricingAgeGroups, $leadData) {
		let $errors, $ageGroups, $lacking;
		$errors = [];
		$ageGroups = this.makeAgeGroups($leadData);
		if ($lacking = php.array_diff($ageGroups, $pricingAgeGroups)) {
			$errors = php.array_merge($errors, Fp.map(($ageGroup) => {
				let $article;
				$article = {
					'child': 'a',
					'infant': 'an',
					'adult': 'an',
				}[$ageGroup] || 'a\/an';
				return Errors.getMessage(Errors.NO_FLYING_PTC_IN_PRICING, {'ageGroup': $ageGroup, 'article': $article});
			}, php.array_unique($lacking)));
		}
		return $errors;
	}

	/**
	 * unlike built-in range(), it returns php.empty array
	 * on static::range(0,0) and static::range(0,-1)
	 */
	static range($from, $to) {
		let $result, $i;
		$result = [];
		for ($i = $from; $i < $to; ++$i) {
			$result.push($i);
		}
		return $result;
	}

	static toConst($value) {
		return () => {
			return $value;
		};
	}

	/**
	 * @param $quantities = ['paxNumAdults' => 2, 'paxNumChildren' => 1, 'paxNumInfants' => 2];
	 * @return array like ['adult', 'adult', 'child', 'infant', 'infant']
	 */
	static makeAgeGroups($quantities) {
		return php.array_merge(Fp.map(this.toConst('adult'), this.range(0, $quantities['paxNumAdults'] || 0)),
			Fp.map(this.toConst('child'), this.range(0, $quantities['paxNumChildren'] || 0)),
			Fp.map(this.toConst('infant'), this.range(0, $quantities['paxNumInfants'] || 0)));
	}
}

module.exports = GetPqItineraryAction;
