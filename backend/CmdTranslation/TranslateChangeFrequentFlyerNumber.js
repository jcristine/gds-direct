
/**
 * Apollo : MP/X/N1*DL|2*AA
 * Sabre  : FF1¤
 * Amadeus: NON-TRANSLATABLE
 * Galileo: M+P1*DL/P2*AA@
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');

class TranslateChangeFrequentFlyerNumber {
	static normalizeData(parsedData, gds) {
		if (!parsedData) {
			return null;
		}
		if (gds === 'apollo') {
			return {
				passengers: parsedData.passengers.map((pax) => {
					pax.airline = ((pax.mileagePrograms || {})[0] || {}).airline;
					return pax;
				}),
			};
		} else if (gds === 'sabre') {
			if (php.empty(parsedData.lineNums)) { // ALL
				return {passengers: []};
			} else {
				// Sabre allows deleting only by line number, not by pax
				return null;
			}
		} else if (gds === 'galileo') {
			return parsedData;
		} else {
			return null;
		}
	}

	static glueTranslatedData(norm, gds) {
		if (!norm) {
			return null;
		}
		if (gds === 'apollo') {
			if (php.empty(norm.passengers)) {
				return 'MP/X/*ALL';
			} else {
				return 'MP/X/N' + norm.passengers.map((pax) => {
					return pax.majorPaxNum + (php.empty(pax.minorPaxNum) ? '' :
						'-' + pax.minorPaxNum) + '*' + pax.airline;
				}).join('|');
			}
		} else if (gds === 'sabre') {
			if (php.empty(norm.passengers)) {
				return 'FF\u00A4ALL';
			} else {
				return null;
			}
		} else if (gds === 'galileo') {
			if (php.empty(norm.passengers)) {
				return 'M.@';
			} else {
				return 'M.' + norm.passengers.map((pax) => {
					const paxNum = !pax.majorPaxNum ? '' : 'P' + pax.majorPaxNum;
					const air = !pax.airline ? '' : '*' + pax.airline;
					return paxNum + air;
				}).join('/') + '@';
			}
		} else {
			return null;
		}
	}

	/** @param parsed = CommandParser::parse().data */
	static translate(parsed, fromGds, toGds) {
		const norm = this.normalizeData(parsed, fromGds);
		return this.glueTranslatedData(norm, toGds);
	}
}

module.exports = TranslateChangeFrequentFlyerNumber;
