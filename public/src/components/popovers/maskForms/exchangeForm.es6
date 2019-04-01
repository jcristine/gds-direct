
let Component = require('../../../modules/component.es6').default;

let dataToDom = (data) => {
	let values = {};
	let enableds = {};
	for (let field of data.fields) {
		values[field.key] = field.value;
		enableds[field.key] = field.enabled;
	}
	let currency = data.currency;

	let Cmp = (...args) => new Component(...args);

	let Fld = (caption, name, size = null, props = {}) => {
		let cls = enableds[name] ? '.enabled' : '';
		let fld = Cmp('span' + cls);
		let inp;
		inp = Cmp('input', {type: 'text', value: values[name], name: name, ...props});
		if (!enableds[name]) {
			inp.context.setAttribute('disabled', 'disabled');
		}
		fld.attach([
			Cmp('label[' + caption + ']'), inp,
		]);
		if (size) {
			inp.context.setAttribute('size', size);
		} else {
			inp.context.style.flex = 2;
			fld.context.style.display = 'flex';
		}
		fld.context.setAttribute('data-field-name', name);
		return fld;
	};

	let formCmp = Cmp('form.mask-form exchange-mask').attach([
		Cmp('br'),
		Cmp('div').attach([
			Cmp('div.align-caption').attach([
				Cmp('div').attach([ // "EXCHANGE TKTS ;..............-;...  CPN ALL                     ",
					Cmp('span').attach([
						Fld('EXCHANGE TKTS', 'exchangedTicketNumber', 14),
						Fld('-', 'exchangedTicketExtension', 3),
					]),
				]),
				Cmp('div').attach([ // "TKT1;.............. CPN;.... TKT2;.............. CPN;....       ",
					Cmp('span').attach([
						Fld('TKT1', 'ticketNumber1', 14, {placeholder: '0161111111111'}),
						Fld('CPN', 'couponNumber1', 4, {placeholder: '1'}),
					]),
					Cmp('span').attach([
						Fld('TKT2', 'ticketNumber2', 14),
						Fld('CPN', 'couponNumber2', 4),
					]),
				]),
				Cmp('div').attach([ // "COMM;.........  ORIG FOP;................... EVEN;.             ",
					Fld('COMM', 'commission', 9, {placeholder: '0.00/'}),
					Fld('ORIG FOP', 'originalFormOfPayment', 19, {placeholder: 'VI4444333322221111'}),
					Fld('EVEN', 'evenIndicator', 2, {placeholder: 'Y/N'}),
				]),
				Cmp('div').attach([ // "                                                                ",
					Cmp('span', {innerHTML: '&nbsp;'}),
				]),
				Cmp('div').attach([ // "TTL VALUE OF EX TKTS USD;.............  ORIG BRD/OFF;...;...    ",
					Fld('TTL VALUE OF EX TKTS ' + currency, 'exchangedTicketTotalValue', 13),
					Cmp('span').attach([
						Fld('ORIG BRD/OFF', 'originalBoardPoint', 3),
						Fld('', 'originalOffPoint', 3),
					]),
				]),
				Cmp('div').attach([ // "TX1 USD;.......;..   TX2 USD;.......;..   TX3 USD;.......;..    ",
					Cmp('span').attach([
						Fld('TX1 ' + currency, 'taxAmount1', 7),
						Fld('', 'taxCode1', 2),
					]),
					Cmp('span').attach([
						Fld('TX2 ' + currency, 'taxAmount2', 7),
						Fld('', 'taxCode2', 2),
					]),
					Cmp('span').attach([
						Fld('TX3 ' + currency, 'taxAmount3', 7),
						Fld('', 'taxCode3', 2),
					]),
				]),
				Cmp('div').attach([ // "ORIG ISS;...... ORIG DATE;....... ORIG IATA NBR;.........       ",
					Fld('ORIG ISS', 'originalIssuePoint', 6, {placeholder: 'SFO'}),
					Fld('ORIG DATE', 'originalIssueDate', 7),
					Fld('ORIG IATA NBR', 'originalAgencyIata', 9),
				]),
				Cmp('div').attach([ // "ORIG TKT;..............-;...  ORIG INV NBR;.........            ",
					Cmp('span').attach([
						Fld('ORIG TKT', 'originalTicketStar', 14, {placeholder: '*'}),
						Fld('-', 'originalTicketStarExtension', 3),
					]),
					Fld('ORIG INV NBR', 'originalInvoiceNumber', 9),
				]),
				Cmp('div').attach([ // "PENALTY USD;............  COMM ON PENALTY;...........",
					Fld('PENALTY ' + currency, 'penaltyAmount', 12),
					Fld('COMM ON PENALTY', 'commOnPenaltyAmount', 11),
				]),
			]),
			Cmp('div.float-right').attach([
				Cmp('button[Submit]'),
				Cmp('button[Cancel]', {type: 'button', onclick: () => formCmp.context.remove()}),
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
//   '$EX NAME ARTURS/KLESUNS                     PSGR  1/ 1         ',
//   'FARE USD   903.40  TOTAL USD   983.30                           ',
//   'TX1 USD   69.60 US   TX2 USD   14.30 XT   TX3                   ',
//   '                                                                ',
//   'EXCHANGE TKTS ;..............-;...  CPN ALL                     ',
//   'TKT1;.............. CPN;.... TKT2;.............. CPN;....       ',
//   'COMM;.........  ORIG FOP;................... EVEN;.             ',
//   '                                                                ',
//   'TTL VALUE OF EX TKTS USD;.............  ORIG BRD/OFF;...;...    ',
//   'TX1 USD;.......;..   TX2 USD;.......;..   TX3 USD;.......;..    ',
//   'ORIG ISS;...... ORIG DATE;....... ORIG IATA NBR;.........       ',
//   'ORIG TKT;..............-;...  ORIG INV NBR;.........            ',
export let ExchangeForm = ({data, onsubmit = null}) => {
	let formCmp = dataToDom(data);
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