// namespace Gds\Parsers\Common\FareConstruction;

const Lexeme = require('../../../../Lib/Lexer/Lexeme.js');
const php = require('../../../../php');

/**
 * Whereas Lexer+php works with cases where single text
 * piece can match only single lexeme, this action provides
 * ability to work with less strict formats where one text
 * piece could match 2 or even 3 lexemes and deciding which
 * of them it really is lays on user who takes the most
 * fitting of all returned combinations
 */
class FareConstructionTokenizer {
	constructor() {
		this.$lexemes = null;
	}

	static getItineraryEndLexemes() {
		return ['apolloMarkup', 'apolloDiscount', 'sabreMarkup', 'totalFare', 'end', 'rateOfExchange', 'domesticTax', 'facilityCharge'];
	}

	/** @see >HELP PRICING-LINEAR FCONST SYMBOLS; */
	static makeLexemes() {
		let $isFirst, $getTuple, $onlyFareInSegment, $getFirst;
		$isFirst = ($context) => $context && php.count($context['lexemes']) === 0;
		$getTuple = ($matches) => php.array_slice($matches, 1);
		$onlyFareInSegment = ($context) => {
			let $lexemes, $i, $lexeme;
			if ($lexemes = $context['lexemes'] || null) {
				for ($i = php.count($lexemes) - 1; $i >= 0; --$i) {
					$lexeme = $lexemes[$i];
					if ($lexeme['lexeme'] === 'segment') {
						return true;
					} else if ($lexeme['lexeme'] === 'fare') {
						return false;
					}
				}
			}
			return false;
		};
		$getFirst = ($matches) => {
			return $matches[1] || null;
		};
		return [
			(new Lexeme('firstDeparture', /^([A-Z]{3})(?![A-Z])/)).hasConstraint($isFirst).preprocessData($getFirst),

			(new Lexeme('domesticTax', /^\s*ZP\s*([A-Z]{3}(?:[A-Z]{3}|\d*\.?\d+)*)/)).hasPreviousLexemeConstraint(this.getItineraryEndLexemes()).preprocessData($getFirst),
			(new Lexeme('facilityCharge', /^\s*(\d*\.?\d+|)XF\s*((?:[A-Z]{3}[\.\d]+)+)/)).hasPreviousLexemeConstraint(this.getItineraryEndLexemes()).preprocessData($getTuple),

			// as i understand, when some segments have different booking class, 'fare' will be
			// as if they were same, and this is the amount added to 'fare' to compensate
			(new Lexeme('fareClassDifference', /^D\s+([A-Z]{3})([A-Z]{3})\s*(\d*[05]M|M|)(\d*\.?\d+)/)).preprocessData($getTuple),
			(new Lexeme('requiredMinimum', /^P\s+([A-Z]{3})([A-Z]{3})(\d*\.?\d+)/)).preprocessData($getTuple),
			// never saw following
			(new Lexeme('returnSubJourneyCheck', /^U\s+([A-Z]{3})([A-Z]{3})(\d*\.?\d+)/)).preprocessData($getTuple),
			(new Lexeme('oneWaySubJourneyCheck', /^H\s+([A-Z]{3})([A-Z]{3})(\d*\.?\d+)/)).preprocessData($getTuple),

			(new Lexeme('sideTripStart', /^\(/)),
			(new Lexeme('sideTripEnd', /^\)/)),
			(new Lexeme('sideTripStartOrEnd', /^\*/)),
			(new Lexeme('extraMileageNoCity', /^E\/XXX/)),
			(new Lexeme('mileageEqualizationPoint', /^B\/([A-Z]{3})(?![A-Z])/)).preprocessData($getFirst),
			(new Lexeme('nextDeparture', /^\/([\/\-])((?:[A-Z]\/)*)([A-Z]{3})(?![A-Z])/)).preprocessData($getTuple),

			(new Lexeme('sabreMarkup', /^(?:PLUS(\d*\.?\d+))/)).preprocessData($getFirst),
			(new Lexeme('apolloMarkup', /^(?:PC(\d*\.?\d+))/)).preprocessData($getFirst),
			(new Lexeme('apolloDiscount', /^(?:LC(\d*\.?\d+))/)).preprocessData($getFirst),
			(new Lexeme('end', /^(?:-{1,3}\s{0,1}(?<infoMessage>[^-]*)-*\s*)*END(?![A-Z])/)).preprocessDataRemoveNumericKeys(),
			(new Lexeme('rateOfExchange', /^(?:ROE(\d+\.?\d*))/)).preprocessData($getFirst),

			(new Lexeme('segment', '/^' +
				'(?<airline>[A-Z0-9]{2})' +
				'(\\s+|[\\(\\*](?<oceanicFlight>[A-Z]{2})[\\)\\*]\\s*|(?<starMark>\\*))' +
				'(?<flags>(?:[A-Z]\\\/)*)' +
				'(?<destination>[A-Z]{3})(?![A-Z])/'
			)).preprocessDataRemoveNumericKeys(),

			(new Lexeme('fuelSurcharge', /^Q\s*(\s[A-Z]{3}[A-Z]{3}|)(\d*\.?\d+)/)).preprocessData($getTuple),
			(new Lexeme('stopoverFee', /^(\d|)S(\d*\.?\d+)/)).preprocessData($getTuple),

			(new Lexeme('fare', '/^' +
				'(?:' +
				'(?<mileagePrinciple>\\d*[05]M|M)' +
				'(?<mileageAirports>\\s+[A-Z]{6}|)\\s*' +
				'|)' +
				'(?:' +
				'(?<from>[A-Z]{3})' +
				'(?<to>[A-Z]{3})\\s*' +
				'|)' +
				'(?<amount>\\d*\\.?\\d+)/'
			)).hasConstraint($onlyFareInSegment).preprocessDataRemoveNumericKeys(),

			(new Lexeme('fareBasis', /^([A-Z0-9]+)(?:\/([A-Z0-9]+)|)/)).hasPreviousLexemeConstraint(['fare']).preprocessData($getTuple),
			(new Lexeme('fareBasis', /^\s{1}([A-Z0-9]+)(?:\/([A-Z0-9]+)|)/)).hasPreviousLexemeConstraint(['hiddenInclusiveTourFare', 'hiddenBulkTourFare']).preprocessData($getTuple),

			(new Lexeme('totalFare', /^((?!ROE)[A-Z]{3})\s*(\d*\.?\d+)/)).preprocessData($getTuple),

			(new Lexeme('hiddenInclusiveTourFare', /^(?:M\/|)(IT)(?![A-Z])/)).preprocessData($getFirst),
			(new Lexeme('hiddenBulkTourFare', /^(?:M\/|)(BT)(?![A-Z])/)).preprocessData($getFirst),
			(new Lexeme('whitespace', /^\s+/)),
		];
	}

	/** @return Lexeme[] */
	getLexemes() {
		return this.$lexemes
			|| (this.$lexemes = this.constructor.makeLexemes());
	}

	* matchLexemes($text, $context) {
		let $lexeme, $r;
		for ($lexeme of this.getLexemes()) {
			$r = $lexeme.match($text, $context);
			if ($r) {
				yield $r;
			}
		}
	}

	/**
	 * Lexes all possible combinations going from end to start,
	 * from top matching lexeme to last+ Supposed to
	 * be interrupted when result satisfies your needs
	 */
	* lexCombinations($text, $prevLexemes) {
		$prevLexemes = [...$prevLexemes];

		let $context, $lexeme, $textLeft, $gotAny, $subContext;
		$context = {
			'text': $text,
			'lexemes': [...$prevLexemes],
		};
		for ($lexeme of this.matchLexemes($text, $context)) {
			$textLeft = $lexeme['textLeft'];
			delete ($lexeme['textLeft']);
			$prevLexemes.push($lexeme);
			$gotAny = false;
			for ($subContext of this.lexCombinations($textLeft, $prevLexemes)) {
				$gotAny = true;
				yield $subContext;
			}
			if (!$gotAny) yield {'text': $textLeft, 'lexemes': $prevLexemes};
			php.array_pop($prevLexemes);
		}
	}

	/**
	 * @return {IterableIterator<{text: '...', lexemes: []}>}
	 * each yield-ed value is matched lexemes and text left
	 * if iterator yields more than one combination,
	 * that means there are more than one way to split
	 * your text to fare construction tokens - use the fittest of them
	 */
	tryTokenCombinations($text) {
		return this.lexCombinations($text, []);
	}
}

module.exports = FareConstructionTokenizer;
