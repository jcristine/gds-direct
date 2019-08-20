const AbstractMaskParser = require("../../Transpiled/Gds/Parsers/Apollo/AbstractMaskParser");
const Rej = require('klesun-node-tools/src/Rej.js');
const NmeScreenParser = require("../../Transpiled/Gds/Parsers/Apollo/ManualPricing/NmeScreenParser");

const POSITIONS = AbstractMaskParser.getPositionsBy('_', [
	"$NME LIB/MAR                                                   ",
	" X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA     ",
	" _ ___ __ ____ __ _____ _____ __;________;_______;_____;_____   ",
	" _ ___ __ ____ __ _____ _____ __;________;_______;_____;_____   ",
	" _ ___ __ ____ __ _____ _____ __;________;_______;_____;_____   ",
	" _ ___ __ ____ __ _____ _____ __;________;_______;_____;_____   ",
	" _ ___  FARE;___;________  DO TAXES APPLY?;_                    ",
	"  EQUIV FARE;___;________             COMM _______ F CONST;__   ",
	" TD 1/;______ 2/;______ 3/;______ 4/;______  INT X  MREC 01/01  ",
	"                                                   ;PSGR 01/01  ",
	"                                                   ;BOOK 01/01  ",
	"DO YC/XY TAXES APPLY?"
].join(''));

const FIELDS = [
	'seg1_stopoverMark', 'seg1_departureAirport', 'seg1_airline', 'seg1_flightNumber',
	'seg1_bookingClass', 'seg1_departureDate', 'seg1_departureTime', 'seg1_status',
	'seg1_fareBasis', 'seg1_fare', 'seg1_notValidBefore', 'seg1_notValidAfter',

	'seg2_stopoverMark', 'seg2_departureAirport', 'seg2_airline', 'seg2_flightNumber',
	'seg2_bookingClass', 'seg2_departureDate', 'seg2_departureTime', 'seg2_status',
	'seg2_fareBasis', 'seg2_fare', 'seg2_notValidBefore', 'seg2_notValidAfter',

	'seg3_stopoverMark', 'seg3_departureAirport', 'seg3_airline', 'seg3_flightNumber',
	'seg3_bookingClass', 'seg3_departureDate', 'seg3_departureTime', 'seg3_status',
	'seg3_fareBasis', 'seg3_fare', 'seg3_notValidBefore', 'seg3_notValidAfter',

	'seg4_stopoverMark', 'seg4_departureAirport', 'seg4_airline', 'seg4_flightNumber',
	'seg4_bookingClass', 'seg4_departureDate', 'seg4_departureTime', 'seg4_status',
	'seg4_fareBasis', 'seg4_fare', 'seg4_notValidBefore', 'seg4_notValidAfter',

	'seg5_stopoverMark', 'seg5_departureAirport',

	'baseFareCurrency', 'baseFareAmount', 'doTaxesApply',
	'fareEquivalentCurrency', 'fareEquivalentAmount', 'commission', 'constantIndicator',

	'seg1_ticketDesignator', 'seg2_ticketDesignator',
	'seg3_ticketDesignator', 'seg4_ticketDesignator',
];

exports.POSITIONS = POSITIONS;
exports.FIELDS = FIELDS;

exports.parse = async (mask) => {
	const parsed = NmeScreenParser.parse(mask);
	if (parsed.error) {
		return Rej.UnprocessableEntity('Bad HHPR reply - ' + parsed.error);
	}
	const items = await AbstractMaskParser.getPositionValues({
		mask: mask,
		positions: POSITIONS,
		fields: FIELDS,
	});
	const defaults = {};
	for (let i = 0; i < parsed.segments.length; ++i) {
		const dtRec = parsed.segments[i].departureDate;
		if (dtRec) {
			defaults['seg' + (i + 1) + '_notValidBefore'] = dtRec.raw;
			defaults['seg' + (i + 1) + '_notValidAfter'] = dtRec.raw;
		}
	}
	return {
		parsed: parsed,
		fields: items.map(i => {
			const value = i.value || defaults[i.key] || '';
			return {
				key: i.key,
				value: value,
				enabled: !value && i.enabled,
			};
		}),
		maskOutput: mask,
	};
};