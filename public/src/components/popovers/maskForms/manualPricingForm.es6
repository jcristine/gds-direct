
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

	let formCmp = Cmp('form.mask-form manual-pricing-mask monospace-inputs').attach([
		Cmp('br'),
		Cmp('div').attach([
			Cmp('div').attach([
				Cmp('span.static-text', {textContent: '>$NME ' + parsed.lastName + '/' + parsed.firstName}),
			]),
			Cmp('table').attach([
				Cmp('thead').attach([
					Cmp('tr').attach([
						Cmp('th[X]'), Cmp('th[CTY]'), Cmp('th[CR]'), Cmp('th[FLT/]'),
						Cmp('th[CLS]'), Cmp('th[DATE]'), Cmp('th[TIME]'), Cmp('th[ST]'),
						Cmp('th[F/B]'), Cmp('th[VALUE]'), Cmp('th[NVB]'), Cmp('th[NVA]'),
					]),
				]),
				Cmp('tbody').attach([...Array(4).keys()]
					.map(i => Cmp('tr').attach([
						Cmp('td').attach([Inp('seg' + (+i + 1) + '_stopoverMark', 1)]),
						Cmp('td').attach([Inp('seg' + (+i + 1) + '_departureAirport', 3)]),
						Cmp('td').attach([Inp('seg' + (+i + 1) + '_airline', 2)]),
						Cmp('td').attach([Inp('seg' + (+i + 1) + '_flightNumber', 4)]),
						Cmp('td').attach([Inp('seg' + (+i + 1) + '_bookingClass', 2)]),
						Cmp('td').attach([Inp('seg' + (+i + 1) + '_departureDate', 5)]),
						Cmp('td').attach([Inp('seg' + (+i + 1) + '_departureTime', 5)]),
						Cmp('td').attach([Inp('seg' + (+i + 1) + '_status', 2)]),
						Cmp('td').attach([Inp('seg' + (+i + 1) + '_fareBasis', 8)]),
						Cmp('td').attach([Inp('seg' + (+i + 1) + '_fare', 7)]),
						Cmp('td').attach([Inp('seg' + (+i + 1) + '_notValidBefore', 5)]),
						Cmp('td').attach([Inp('seg' + (+i + 1) + '_notValidAfter', 5)]),
					]))
					.concat([Cmp('tr').attach([
						Cmp('td').attach([Inp('seg5_stopoverMark', 1)]),
						Cmp('td').attach([Inp('seg5_departureAirport', 3)]),
						Cmp('td', {colSpan: 9999}).attach([
							Cmp('div.fill-space').attach([
								Cmp('span').attach([
									Fld('FARE', 'baseFareCurrency', 3),
									Inp('baseFareAmount', 8),
								]),
								Fld('DO TAXES APPLY', 'doTaxesApply', 1),
								// to leave some space in the end as in terminal
								Cmp('span'), Cmp('span'),
							]),
						]),
					])])),
			]),
			Cmp('div.fill-space').attach([
				Cmp('span').attach([
					Fld('FARE EQUIV', 'fareEquivalentCurrency', 3),
					Inp('fareEquivalentAmount', 8),
				]),
				// to leave some space in between as in terminal
				Cmp('span'), Cmp('span'),
				Fld('COMM', 'commission', 7),
				Fld('F CONST', 'constantIndicator', 2),
			]),
			Cmp('div.fill-space').attach([
				Cmp('span.enabled').attach([
					Cmp('label[TD]'),
				]),
			].concat([...Array(4).keys()].map(i =>
				Fld((+i + 1) + '/', 'seg' + (+i + 1) + '_ticketDesignator', 6)
			)).concat([
				Cmp('span.static-text[INT X]'),
				Cmp('span.static-text', {
					textContent: 'MREC ' +
						('  ' + parsed.record.storeNumber.current).slice(-2) + '/' +
						('  ' + parsed.record.storeNumber.total).slice(-2)}),
			])),
			Cmp('div.fill-space').attach([
				Cmp('span'), // to align following to the right
				Cmp('span.static-text', {
					textContent: 'PSGR ' +
						('  ' + parsed.record.storePtcNumber.current).slice(-2) + '/' +
						('  ' + parsed.record.storePtcNumber.total).slice(-2)}),
			]),
			Cmp('div.fill-space').attach([
				Cmp('span'), // to align following to the right
				Cmp('span.static-text', {
					textContent: 'BOOK ' +
						('  ' + parsed.record.page.current).slice(-2) + '/' +
						('  ' + parsed.record.page.total).slice(-2)}),
			]),
			Cmp('div').attach([
				Cmp('span.static-text', {textContent: 'DO YC/XY TAXES APPLY?'}),
			]),
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
// ">$NME LIB/MAR                                                 ",
// " X CTY CR FLT/CLS DATE  TIME  ST F/B      VALUE   NVB   NVA ",
// " . JFK PR  127 N  20SEP  145A OK;........;.......;.....;..... ",
// " . MNL .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
// " . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
// " . ... .. .... ..  VOID ..... .. ........ ....... ..... ..... ",
// " . ...  FARE;...;........  DO TAXES APPLY?;.                  ",
// "  EQUIV FARE;...;........             COMM;....... F CONST;..",
// " TD 1/;...... 2/;...... 3/;...... 4/;......  INT X  MREC 01/01",
// "                                                   ;PSGR 01/01",
// "                                                   ;BOOK 01/01",
// "DO YC/XY TAXES APPLY?",
export let ManualPricingForm = ({data, onCancel, onsubmit = null}) => {
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