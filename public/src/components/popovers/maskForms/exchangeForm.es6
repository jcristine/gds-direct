
let Component = require('../../../modules/component.es6').default;
let Cmp = (...args) => new Component(...args);

let lastUniqueId = 0;

/** @param {IExchangeApolloTicketParsedMask} data */
let dataToDom = (data) => {
	let values = {};
	let enableds = {};
	for (let field of data.fields) {
		values[field.key] = field.value;
		enableds[field.key] = field.enabled;
	}
	let head = data.headerData;
	let currency = head.exchangedTicketCurrency;

	let datalistId = 'mco-doc-nums-' + (++lastUniqueId);
	let datalistDom = Cmp('datalist', {id: datalistId})
		.attach(data.mcoRows.map(mcoRow => Cmp('option', {
			value: mcoRow.documentNumber,
			textContent: mcoRow.documentNumber + ' ' + mcoRow.command,
		}))).context;

	let onTickNum = (ticketNumber) => {};

	let Fld = (caption, name, size) => {
		let cls = enableds[name] ? '.enabled' : '';
		let fld = Cmp('span' + cls);
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
		if (name === 'ticketNumber1') {
			inp.context.setAttribute('list', datalistId);
			inp.context.setAttribute('size', size + 2); // extend for completion arrow
			// remove browser input value caching
			inp.context.setAttribute('autocomplete', 'off');
			inp.context.oninput = () => onTickNum(inp.context.value);
		}
		fld.attach([
			Cmp('label[' + caption + ']'), inp,
		]);
		fld.context.setAttribute('data-field-name', name);
		return fld;
	};

	let HeadVal = (caption, value, size) => {
		let inp = Cmp('input', {type: 'text', value: value});
		inp.context.setAttribute('disabled', 'disabled');
		inp.context.setAttribute('size', size);
		return Cmp('span').attach([
			Cmp('label[' + caption + ']'), inp,
		]);
	};

	let formCmp = Cmp('form.mask-form exchange-mask').attach([
		Cmp('br'),
		Cmp('div').attach([
			Cmp('div.align-caption').attach([
				Cmp('div.new-ticket-info-line').attach([ // "$EX NAME ARTURS/KLESUNS                     PSGR  1/ 1         ",
					Cmp('span', {textContent: '>$EX NAME ' + head.lastName + '/' + head.firstName}),
					Cmp('span', {
						textContent: 'PSGR ' +
							('  ' + head.majorNumber).slice(-2) + '/' +
							('  ' + head.minorNumber).slice(-2)}),
				]),
				Cmp('div.new-ticket-info-line').attach([ // "FARE USD   903.40  TOTAL USD   983.30                           ",
					HeadVal('FARE ' + head.baseFareCurrency, head.baseFareAmount, 9),
					HeadVal('TOTAL ' + head.netPriceCurrency, head.netPriceAmount, 9),
				].concat(!(head.equivalentPart || '').trim() ? [] : [
					// may appear if base currency is different from PCC
					Cmp('span', {textContent: head.equivalentPart}),
				])),
				Cmp('div.new-ticket-info-line').attach([ // "TX1 USD   69.60 US   TX2 USD   14.30 XT   TX3                   ",
					HeadVal('TX1 ' + (head.taxCurrency1 || ''), (head.taxAmount1 || '') + ' ' + (head.taxCode1 || ''), 11),
					HeadVal('TX2 ' + (head.taxCurrency2 || ''), (head.taxAmount2 || '') + ' ' + (head.taxCode2 || ''), 11),
					HeadVal('TX3 ' + (head.taxCurrency3 || ''), (head.taxAmount3 || '') + ' ' + (head.taxCode3 || ''), 11),
				]),
				Cmp('div').attach([ // "                                                                ",
					Cmp('span', {innerHTML: '&nbsp;'}),
				]),
				Cmp('div').attach([ // "EXCHANGE TKTS ;..............-;...  CPN ALL                     ",
					Cmp('span').attach([
						Fld('EXCHANGE TKTS', 'exchangedTicketNumber', 14),
						Fld('-', 'exchangedTicketExtension', 3),
					]),
				]),
				Cmp('div').attach([ // "TKT1;.............. CPN;.... TKT2;.............. CPN;....       ",
					Cmp('span').attach([
						Cmp({context: datalistDom}),
						Fld('TKT1', 'ticketNumber1', 14),
						Fld('CPN', 'couponNumber1', 4),
					]),
					Cmp('span').attach([
						Fld('TKT2', 'ticketNumber2', 14),
						Fld('CPN', 'couponNumber2', 4),
					]),
				]),
				Cmp('div').attach([ // "COMM;.........  ORIG FOP;................... EVEN;.             ",
					Fld('COMM', 'commission', 9),
					Fld('ORIG FOP', 'originalFormOfPayment', 19),
					Fld('EVEN', 'evenIndicator', 1),
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
					Fld('ORIG ISS', 'originalIssuePoint', 6),
					Fld('ORIG DATE', 'originalIssueDate', 7),
					Fld('ORIG IATA NBR', 'originalAgencyIata', 9),
				]),
				Cmp('div').attach([ // "ORIG TKT;..............-;...  ORIG INV NBR;.........            ",
					Cmp('span').attach([
						Fld('ORIG TKT', 'originalTicketStar', 14),
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

	onTickNum = (ticketNumber) => data.mcoRows
		.filter(mcoRow => mcoRow.documentNumber == ticketNumber)
		.forEach(mcoRow => {
			[...formCmp.context.querySelectorAll('input[name="exchangedTicketTotalValue"]')]
				.forEach(inp => inp.value = inp.value || mcoRow.amount);
			[...formCmp.context.querySelectorAll('input[name="originalIssueDate"]')]
				.forEach(inp => inp.value = inp.value || mcoRow.issueDate.raw);
		});

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