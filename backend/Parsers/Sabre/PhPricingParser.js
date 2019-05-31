
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
	//            " BOM LH  G   11DEC G1                    10DEC 02P",
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
		notValidAfter: nvaDate ? {raw: split['E'], parsed: nvaDate} : null,
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

let parseSingleBlock = (linesLeft) => {
	let line, match;

	line = linesLeft.shift() || '';
	match = line.match(/^PSGR TYPE\s+([A-Z0-9]{2,3})\s*-\s*(\d+)/);
	if (!match) {
		return null;
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
		return null;
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

	return [{
		ptcNumber: ptcNumber,
		totals: {
			baseFare: {currency: baseCurrency, amount: baseAmount},
			inDefaultCurrency: fareEquivalent,
			tax: null,
			total: {
				currency: totalCurrency,
				amount: totalAmount,
				ptc: ptc,
			},
		},
		taxList: mainTaxes
			.filter(tax => tax.taxCode !== 'XT')
			.concat(xtTaxes),
		segments: [{airport: firstAirport, type: 'void'}].concat(segments),
		fareBasisInfo: fareBasisInfo,
		fareConstruction: fcRecord,
		fareConstructionInfo: PricingCommonHelper.parseFareConstructionInfo(infoLines, true),
		baggageInfo: bagLines.length === 0 ? null : BagAllowanceParser.parse(bagLines),
		baggageInfoDump: bagLines.join('\n'),
	}, linesLeft];
};

/** see also SabrePricingParser.parseTotalFareLine */
let parseTotalsLine = (totalsLine) => {
	//            "           10232         196.00      52.80            248.80TTL",
	let pattern = 'BBBBBBBBBBBBBBBB EEEEEEEEEEEEEE TTTTTTTTTT NNNNNNNNNNNNNNNNNLLL';
	let split = StringUtil.splitByPosition(totalsLine, pattern, null, true);
	if (split['L'] === 'TTL') {
		return {
			baseFare: split['B'],
			inDefaultCurrency: split['E'],
			tax: split['T'],
			total: split['N'],
		};
	} else {
		return null;
	}
};

let parseFooter = (linesLeft) => {
	linesLeft = [...linesLeft];

	let totalsLine = linesLeft.shift() || '';
	if (totalsLine.startsWith('PSGR TYPE')) {
		return null;
	}
	let faresSum = parseTotalsLine(totalsLine);
	if (!faresSum) {
		// present only in multi-PTC pricing
		linesLeft.unshift(totalsLine);
	}
	[, linesLeft] = parseSequence(linesLeft, l => l.trim() === '');

	let attnLines = [];
	let unparsedLines = [];
	for (let line of linesLeft) {
		let attnMatch = line.match(/^ATTN\*(.*)$/);
		if (attnMatch) {
			attnLines.push(attnMatch[1]);
		} else if (!['', '.'].includes(line)) {
			unparsedLines.push(line);
		}
	}

	let dataExistsInfo;
	[attnLines, dataExistsInfo] = PricingCommonHelper.parseDataExists(attnLines);

	return {
		faresSum: faresSum,
		dataExistsInfo: dataExistsInfo,
		additionalInfo: unparsedLines.concat(attnLines),
	};
};

/**
 * this function parses output of WP ('priceItinerary') command
 * in Sabre with custom display format PCC configuration (C5VD)
 * this format differs from normal WP output considerably...
 *
 * @param {string} output = [
 *     'PSGR TYPE  ADT - 01',
 *     '     CXR RES DATE  FARE BASIS      NVB   NVA    BG',
 *     ' MNL',
 *     ' SIN PR  E   16DEC EOTSG           16DEC 16DEC 25K',
 *     'FARE  USD    180.00 EQUIV PHP      9414',
 *     'TAX   PHP      1620PH PHP       550LI PHP       367XT',
 *     'TOTAL PHP     11951',
 *     'ADT-01  EOTSG',
 *     ' MNL PR SIN180.00NUC180.00END ROE1.00',
 *     'XT PHP53YR PHP314YQ',
 *     'ENDOS*SEG1*ECONOMY SAVER/FARE RULES APPLY',
 *     'RATE USED 1USD-52.3PHP',
 *     'ATTN*VALIDATING CARRIER - PR',
 *     'ATTN*CHANGE BOOKING CLASS -   1E',
 *     '                                                               ',
 *     'ATTN*AIR EXTRAS AVAILABLE - SEE WP*AE',
 *     'ATTN*BAGGAGE INFO AVAILABLE - SEE WP*BAG',
 *     '.',
 * ].join("\n")
 */
exports.parse = (output) => {
	let linesLeft = output.split('\n');
	let pqList = [];
	let footer = null;
	do {
		let ptcBlock;
		let tuple = parseSingleBlock(linesLeft);
		if (!tuple) {
			return {error: 'Failed to parse PTC block - ' + linesLeft[0]};
		}
		[ptcBlock, linesLeft] = tuple;
		pqList.push(ptcBlock);
		[, linesLeft] = parseSequence(linesLeft, l => l.trim() === '');
		footer = parseFooter(linesLeft);
	} while (!footer);
	return {
		displayType: 'philippinesPricing',
		pqList: pqList,
		...footer,
	};
};