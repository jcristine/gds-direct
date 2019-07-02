
import {post} from "../../../helpers/requests";

let Component = require('../../../modules/component.es6').default;
let Cmp = (...args) => new Component(...args);

let dataToDom = (data) => {
	let values = {};
	let enableds = {};
	for (let field of data.fields) {
		values[field.key] = field.value;
		enableds[field.key] = field.enabled;
	}
	/** @var parsed = require('TaScreenParser.js').parse() */
	let parsed = data.parsed;

	let Inp = (name, size) => {
		let inp;
		inp = Cmp('input', {
			type: 'text',
			value: values[name],
			name: name,
			placeholder: '.'.repeat(size || 0),
			...(size ? {maxLength: size} : {}),
		});
		if (!enableds[name]) {
			inp.context.setAttribute('disabled', 'disabled');
		}
		inp.context.setAttribute('size', size);
		return inp;
	};

	let Fld = (caption, name, size) => {
		let cls = enableds[name] ? '.enabled' : '';
		let fld = Cmp('span' + cls);
		fld.attach([
			Cmp('label[' + caption + ']'), Inp(name, size),
		]);
		return fld;
	};

	let formCmp = Cmp('div.monospace-inputs fare-calculation-mask').attach([
			Cmp('div').attach([
				Cmp('span.static-text', {textContent: '>$FC/ATB FARE CONSTRUCTION'}),
			]),
			Cmp('div').attach([
				Cmp('div').attach([
					Cmp('span.static-text', {textContent: ' FP ' + parsed.formOfPayment.raw}),
					Fld('FC', 'fcLine1', 38),
				]),
				Cmp('div').attach([
					Inp('fcLine2', 51),
				]),
				Cmp('div').attach([
					Inp('fcLine3', 51),
				]),
				Cmp('div').attach([
					Inp('fcLine4', 50),
				]),
				Cmp('div').attach([
					Inp('fcLine5', 51),
				]),
			]),
			Cmp('div').attach([
				Cmp('span[ ]'),
			]),
			Cmp('div').attach([
				Cmp('span.static-text', {textContent: ';' + parsed.fareConstruction.clean.raw}),
			]),
	]);

	return formCmp;
};
let domToData = (mcoForm) => {
	let fields = [...mcoForm.context.querySelectorAll('input, select')]
		.filter(inp => inp.name)
		.map(inp => ({
			key: inp.name, value: inp.value, enabled: !inp.disabled,
		}));
	return {fields: fields};
};

// attempts to imitate this:
// ">$FC/ATB FARE CONSTRUCTION ",
// " FP NO FOP FC;...................................... ",
// ";................................................... ",
// ";................................................... ",
// ";..................................................  ",
// ";...................................................;",
// "",
// ";10DEC JFK PR MNL 100.00 $100.00     ",
/** @return {IMaskForm} */
export let FareCalculationForm = ({data}) => {
	let formCmp = dataToDom(data);
	return {
		dom: formCmp.context,
		submit: () => {
			let result = domToData(formCmp);
			return post('terminal/submitFcMask', {
				gds: 'apollo',
				fields: result.fields,
				maskOutput: data.maskOutput,
			});
		},
	};
};