
let Component = require('../../../modules/component.es6').default;
let Cmp = (...args) => new Component(...args);

let dataToDom = (data, onCancel) => {
	let values = {};
	let enableds = {};
	for (let field of data.fields) {
		values[field.key] = field.value;
		enableds[field.key] = field.enabled;
	}
	/** @var parsed = require('NmeScreenParser.js').parse() */
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

	let {baseFare, fareEquivalent, netPrice} = parsed;
	let baseFareStr = data.parsed.fareEquivalent
		? ` EQUIV ${fareEquivalent.currency} ${('       ' + fareEquivalent.amount).slice(-7)} TTL ${netPrice.currency}`
		: ` FARE  ${baseFare.currency} ${('       ' + baseFare.amount).slice(-7)} TTL ${netPrice.currency}`;
	let formCmp = Cmp('form.mask-form manual-pricing-mask').attach([
		Cmp('br'),
		Cmp('div').attach([
			Cmp('div').attach([
				Cmp('span.static-text', {textContent: '>$TA                TAX BREAKDOWN SCREEN'}),
			]),
			Cmp('div').attach([
				Cmp('span.static-text', {textContent: baseFareStr}),
				Inp('netPrice', 8),
				Fld('ROE', 'rateOfExchange', 12),
			]),
			Cmp('div', {style: 'display: grid; grid-template-columns: repeat(4, 1fr);'})
				.attach([...Array(20).keys()].map(i => {
					let num = +i + 1;
					let label = ('T' + num + ' ').slice(0, 3);
					return Cmp('div').attach([
						Fld(label, 'tax' + num + '_amount', 8),
						Inp('tax' + num + '_code', 2),
					]);
				})),
			Cmp('div').attach([
				Cmp('span.static-text', {textContent: ' '}),
			]),
			Cmp('div').attach([
				Cmp('span.static-text', {textContent: ' U.S. PSGR FACILITY CHARGES'}),
			]),
			Cmp('div', {style: 'display: grid; grid-template-columns: repeat(2, 1fr);'})
				.attach([...Array(4).keys()].map(i => {
					let num = +i + 1;
					return Cmp('div').attach([
						Fld('AIRPORT ' + num, 'facilityCharge' + num + '_airport', 3),
						Fld('AMT', 'facilityCharge' + num + '_amount', 5),
					]);
				})),
			Cmp('div.float-right').attach([
				Cmp('button[Submit]'),
				Cmp('button[Cancel]', { type: 'button', onclick: () => {
						formCmp.context.remove();

						if (onCancel && typeof onCancel === 'function')
						{
							onCancel();
						}
					} }),
			]),
		]),
		Cmp('br', {clear: 'all'}),
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
// ">$TA                TAX BREAKDOWN SCREEN                       ",
// " FARE  USD  100.00 TTL USD ;........          ROE ;............",
// "T1 ;........;.. T2 ;........;.. T3 ;........;.. T4 ;........;..",
// "T5 ;........;.. T6 ;........;.. T7 ;........;.. T8 ;........;..",
// "T9 ;........;.. T10;........;.. T11;........;.. T12;........;..",
// "T13;........;.. T14;........;.. T15;........;.. T16;........;..",
// "T17;........;.. T18;........;.. T19;........;.. T20;........;..",
// "                                                               ",
// " U.S. PSGR FACILITY CHARGES                                    ",
// " AIRPORT 1 ;...  AMT ;.....   AIRPORT 2 ;...  AMT ;.....       ",
// " AIRPORT 3 ;...  AMT ;.....   AIRPORT 4 ;...  AMT ;.....       ",
export let TaxBreakdownForm = ({data, onCancel, onsubmit = null}) => {
	let formCmp = dataToDom(data, onCancel);
	formCmp.context.onsubmit = () => {
		if (onsubmit) {
			let result = domToData(formCmp);
			onsubmit(result).then(({canClosePopup}) => {
				if (canClosePopup) {
					formCmp.context.remove();
				}
			});
		}
		return false;
	};
	return formCmp;
};