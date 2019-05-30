
const Rej = require('klesun-node-tools/src/Utils/Rej.js');
const BagAllowanceParser = require("../../Transpiled/Gds/Parsers/Sabre/BagAllowanceParser");
const {parseSequence} = require('../ParserUtil.js');
const CommonParserHelpers = require('../../Transpiled/Gds/Parsers/Apollo/CommonParserHelpers.js');
const {matchAll} = require('../../Utils/Str.js');
const PricingCommonHelper = require('../../Transpiled/Gds/Parsers/Sabre/Pricing/PricingCommonHelper.js');
const FareConstructionParser = require("../../Transpiled/Gds/Parsers/Common/FareConstruction/FareConstructionParser");
const StringUtil = require('../../Transpiled/Lib/Utils/StringUtil.js');
const Fp = require('../../Transpiled/Lib/Utils/Fp.js');

let parseSegmentLine = (line) => {
	//            'XTPE BR  V   02SEP VLXU            02SEP 02SEP 02P',
	let pattern = 'XAAA CC  L   WWWWW IIIIIIIIIIIIIIIIOOOOO EEEEEBBBBB';
	let split = StringUtil.splitByPosition(line, pattern, null, true);

	let date = CommonParserHelpers.parsePartialDate(split['W']);
	let nvbDate = CommonParserHelpers.parsePartialDate(split['O']);
	let nvaDate = CommonParserHelpers.parsePartialDate(split['E']);

	let [fareBasis, ticketDesignator] = split['I'].split('/');
	let result = {
		type: 'flight',
		stopoverIndicator: split['X'] || null, // 'O' = stopover, 'X' = connection
		airport: split['A'],
		airline: split['C'],
		bookingClass: split['L'],
		departureDate: {raw: split['W'], parsed: date},
		fareBasis: fareBasis,
		ticketDesignator: ticketDesignator, // not sure it can happen
		notValidBefore: nvbDate ? {raw: split['O'], parsed: nvbDate} : null,
		notValidAfter: nvbDate ? {raw: split['E'], parsed: nvaDate} : null,
		bagAllowanceCode: BagAllowanceParser.parseAmountCode(split['B']),
	};
	if (date && split[' '].trim() === '' &&
		result['bookingClass'] &&
		!Fp.any((v) => v === '', result)
	) {
		return result;
	} else {
		return null;
	}
};

/** @return {Promise} */
let parseSingleBlock = (linesLeft) => {
	let line, match;

	[, linesLeft] = parseSequence(linesLeft, l => l.trim() === '');

	line = linesLeft.shift() || '';
	match = line.match(/^PSGR TYPE\s+([A-Z0-9]{2,3})\s*-\s*(\d+)/);
	if (!match) {
		return Rej.NoContent('Invalid PQ PTC block header - ' + line);
	}
	let [, ptc, ptcNumber] = match;
	linesLeft.shift(); // '     CXR RES DATE  FARE BASIS      NVB   NVA    BG'

	let firstAirport = linesLeft.shift().trim();
	let segments;
	[segments, linesLeft] = parseSequence(linesLeft, parseSegmentLine);

	let [, baseCurrency, baseAmount, eqStr] = linesLeft.shift()
		.match(/^FARE\s+([A-Z]{3})\s*(\d*\.?\d+)\s*(.*)/);
	let fareEquivalent = null;
	if (eqStr) {
		let [, currency, amount] = eqStr.match(/^EQUIV\s+([A-Z]{3})\s*(\d*\.?\d+)/);
		fareEquivalent = {currency, amount};
	}

	let mainTaxLine = linesLeft.shift().replace(/^TAX/, '');
	let mainTaxes = matchAll(/\s*([A-Z]{3})\s*(\d*\.?\d+)([A-Z0-9]{2})/, mainTaxLine)
		.map(([, currency, amount, taxCode]) => ({taxCode, currency, amount}));
	if (mainTaxes.length === 0) {
		// no taxes line, possible for infant
		linesLeft.unshift(mainTaxLine);
	}

	let [, totalCurrency, totalAmount] = linesLeft.shift()
		.match(/^TOTAL\s+([A-Z]{3})\s*(\d*\.?\d+)\s*(.*)/);

	let fbLine = linesLeft.shift() || '';
	let fareBasisInfo = PricingCommonHelper.parseFareBasisSummary(fbLine);
	if (!fareBasisInfo) {
		return Rej.UnprocessableEntity('Invalid fare basis line - ' + fbLine);
	}

	let fcLines;
	[fcLines, linesLeft] = parseSequence(linesLeft, (l) => {
		let match = l.match(/^ (.*)$/);
		return match ? match[1] : null;
	});
	let fcLine = fcLines.join('\n');
	let fcRecord = FareConstructionParser.parse(fcLine);
	fcRecord.raw = fcLine;

	let xtLines;
	[xtLines, linesLeft] = parseSequence(linesLeft, (l) => {
		let match = l.match(/^XT\s+(.*)$/);
		return match ? match[1] : null;
	});
	let xtTaxes = xtLines
		.flatMap(xtLine => {
			let matches = matchAll(/\s*([A-Z]{3})(\d*\.?\d+)([A-Z0-9]{2})((?:[A-Z]{3}\d*\.?\d+)*)\s*/, xtLine);
			return matches.map(([, currency, amount, taxCode, facilityStr]) => {
				let record = {taxCode, currency, amount};
				if (facilityStr) {
					record.facilityCharges = matchAll(/([A-Z]{3})(\d*\.?\d+)/, facilityStr)
						.map(([, airport, amount]) => ({airport, amount}));
				}
				return record;
			});
		});

	let attnBlockStarted = false;
	let bagBlockStarted = false;
	let infoLines = [];
	let bagLines = [];
	while ((line = linesLeft.shift()) !== undefined) {
		if (!line.startsWith('ATTN*')) {
			if (attnBlockStarted) {
				linesLeft.unshift(line); // end of this PTC PQ block
				break;
			} else {
				infoLines.push(line);
			}
		} else {
			attnBlockStarted = true;
			let content = line.slice('ATTN*'.length);
			bagBlockStarted |= content.startsWith('BAG ALLOWANCE');
			if (!bagBlockStarted) {
				infoLines.push(content);
			} else {
				bagLines.push(content);
			}
		}
	}

	return Promise.resolve([{
		ptc: ptc,
		ptcNumber: ptcNumber,
		segments: [{airport: firstAirport, type: 'void'}].concat(segments),
		baseFare: {currency: baseCurrency, amount: baseAmount},
		fareEquivalent: fareEquivalent,
		mainTaxes: mainTaxes,
		netPrice: {currency: totalCurrency, amount: totalAmount},
		fareBasisInfo: fareBasisInfo,
		fareConstruction: fcRecord,
		xtTaxes: xtTaxes,
		fareConstructionInfo: PricingCommonHelper.parseFareConstructionInfo(infoLines, true),
		baggageInfo: bagLines.length === 0 ? null : BagAllowanceParser.parse(bagLines),
	}, linesLeft]);
};

/** @return {Promise} */
let parseFooter = (linesLeft) => {
	linesLeft = [...linesLeft];
	let totalsLine = linesLeft.shift();
	//            "           10232         196.00      52.80            248.80TTL",
	let pattern = 'BBBBBBBBBBBBBBBB EEEEEEEEEEEEEE TTTTTTTTTT NNNNNNNNNNNNNNNNNLLL';
	let split = StringUtil.splitByPosition(totalsLine, pattern, null, true);
	if (split['L'] !== 'TTL') {
		return Rej.NoContent('Footer must start with TTL line');
	} else {
		return Promise.resolve({
			totals: {
				baseAmount: split['B'],
				equivalentAmount: split['E'],
				taxAmount: split['T'],
				netAmount: split['N'],
			},
			linesLeft: linesLeft,
		});
	}
};

/**
 * this function parses output of WP ('priceItinerary') command
 * in Sabre with custom display format PCC configuration (C5VD)
 * this format differs from normal WP output considerably...
 *
 * @param {string} output = [
 *     "PSGR TYPE  ADT - 01",
 *     "     CXR RES DATE  FARE BASIS      NVB   NVA    BG",
 *     " MNL",
 *     " DVO PR  U   13AUG UAP30PH               29MAY NIL",
 *     " MNL PR  U   26AUG UAP30PH               29MAY NIL",
 *     "FARE  PHP      5116 EQUIV USD     98.00",
 *     "TAX   USD      0.30PD USD      7.60LI USD     18.50XT",
 *     "TOTAL USD    124.40",
 *     "ADT-02  UAP30PH",
 *     " MNL PR DVO2558PR MNL2558PHP5116END",
 *     "XT USD12.50PV USD6.00YQ",
 *     "ENDOS*SEG1/2*ECO SUPERSAVER/NONREF/FARE RULES APPLY",
 *     "RATE USED 1PHP-0.01917487USD",
 *     "ATTN*PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING",
 *     "ATTN*PRIVATE ¤",
 *     "ATTN*VALIDATING CARRIER - PR",
 *     "           10232         196.00      52.80            248.80TTL",
 *     "                                                               ",
 *     "ATTN*AIR EXTRAS AVAILABLE - SEE WP*AE",
 *     "ATTN*BAGGAGE INFO AVAILABLE - SEE WP*BAG",
 *     "."
 * ].join("\n")
 */
exports.parse = async (output) => {
	let linesLeft = output.split('\n');
	let pqList = [];
	let footer = null;
	do {
		let ptcBlock;
		[ptcBlock, linesLeft] = await parseSingleBlock(linesLeft);
		pqList.push(ptcBlock);
		footer = await parseFooter(linesLeft).catch(exc => null);
	} while (!footer);
	return {
		displayType: 'philippinesPricing',
		pqList: pqList,
		footer: footer,
	};
};