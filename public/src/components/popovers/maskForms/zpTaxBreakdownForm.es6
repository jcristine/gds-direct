
import {post} from "../../../helpers/requests";

let Component = require('../../../modules/component.es6').default;
let Cmp = (...args) => new Component(...args);

/** @param data = await require('SubmitZpTaxBreakdownMask.js').parse() */
let dataToDom = (data) => {
	let values = {};
	let enableds = {};
	for (let field of data.fields) {
		values[field.key] = field.value;
		enableds[field.key] = field.enabled;
	}

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

	let formCmp = Cmp('div').attach([
			Cmp('div').attach([
				Cmp('span.static-text', {textContent: '>$ZP U.S. FLIGHT SEGMENT TAX BREAKDOWN SCREEN'}),
			]),
			Cmp('div').attach([
				Cmp('span.static-text', {textContent: ' '}),
			]),
			Cmp('div', {style: 'padding-left: 10px'}).attach([
				Cmp('div').attach([
					Cmp('span.static-text', {textContent: 'TOTAL ' + data.parsed.currency}),
					Cmp('span.static-text', {textContent: data.parsed.amount, style: 'margin-left: 10px; margin-right: 10px; min-width: 200px; text-align: right'}),
					Cmp('span.static-text', {textContent: data.parsed.taxCode}),
				]),
				Cmp('div').attach([
					Cmp('span.static-text', {textContent: ' '}),
				]),
				Cmp('div', {style: 'display: grid; grid-template-columns: repeat(3, 1fr);'})
					.attach([...Array(20).keys()].map(i => {
						let num = +i + 1;
						let padNum = ('00' + num).slice(-2);
						let label = 'ARPT' + padNum;
						return Cmp('div').attach([
							Fld(label, 'airport' + num + '_code', 3),
							Inp('airport' + num + '_amount', 5),
						]);
					})),
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
// ">$ZP U.S. FLIGHT SEGMENT TAX BREAKDOWN SCREEN                  ",
// "                                                               ",
// "  TOTAL USD    95.00 ZP                                        ",
// "                                                               ",
// "  ARPT01;...;.....  ARPT02;...;.....  ARPT03;...;.....         ",
// "  ARPT04;...;.....  ARPT05;...;.....  ARPT06;...;.....         ",
// "  ARPT07;...;.....  ARPT08;...;.....  ARPT09;...;.....         ",
// "  ARPT10;...;.....  ARPT11;...;.....  ARPT12;...;.....         ",
// "  ARPT13;...;.....  ARPT14;...;.....  ARPT15;...;.....         ",
// "  ARPT16;...;.....  ARPT17;...;.....  ARPT18;...;.....         ",
// "  ARPT19;...;.....  ARPT20;...;.....                           ",
/** @return {IMaskForm} */
export let ZpTaxBreakdownForm = ({data}) => {
	let formCmp = dataToDom(data);
	return {
		dom: formCmp.context,
		submit: () => {
			let result = domToData(formCmp);
			return post('terminal/submitZpTaxBreakdownMask', {
				gds: 'apollo',
				fields: result.fields,
				maskOutput: data.maskOutput,
			});
		},
	};
};