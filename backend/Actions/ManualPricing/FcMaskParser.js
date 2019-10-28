
const AbstractMaskParser = require("../../Transpiled/Gds/Parsers/Apollo/AbstractMaskParser");
const Rej = require('klesun-node-tools/src/Rej.js');
const FcScreenParser = require("gds-utils/src/text_format_processing/apollo/ticketing_masks/FcScreenParser");

const POSITIONS = AbstractMaskParser.getPositionsBy('_', [
	"$FC/ATB FARE CONSTRUCTION                                      ",
	" FP NO FOP FC;______________________________________            ",
	";___________________________________________________            ",
	";___________________________________________________            ",
	";__________________________________________________             ",
	";___________________________________________________;           ",
	"                                                                ",
	";10DEC JFK PR MNL 100.00 $100.00                                ",
].join(''));

const FIELDS = [
	'fcLine1',
	'fcLine2',
	'fcLine3',
	'fcLine4',
	'fcLine5',
];

exports.POSITIONS = POSITIONS;
exports.FIELDS = FIELDS;
exports.parse = async (mask) => {
	const fields = await AbstractMaskParser.getPositionValues({
		mask: mask,
		positions: POSITIONS,
		fields: FIELDS,
	});
	const parsed = FcScreenParser.parse(mask);
	if (parsed.error) {
		return Rej.UnprocessableEntity('Invalid $FC screen - ' + parsed.error + ' - ' + mask);
	}
	return {
		parsed: parsed,
		fields: fields.map(f => ({...f, enabled: f.enabled && !f.value})),
		maskOutput: mask,
	};
};
