
let Component = require('../../../modules/component.es6').default;

/** '2020-07-01' -> '07/20' */
let formatExpirationDate = (full) => {
	if (!(full || '').trim()) {
		return '';
	} else {
		let [y, m, d] = full.split('-');
		return m + '/' + y.slice(2);
	}
};

/** @param {IRbsMcoData} data */
let dataToDom = (data) => {
	let values = {};
	let enableds = {};
	for (let field of data.fields) {
		values[field.key] = field.value;
		enableds[field.key] = field.enabled;
	}

	let mkCmp = (...args) => new Component(...args);
	let nameOptions = (data.passengers || [])
		.map(paxName => mkCmp('option[' + paxName + ']', {value: paxName}))
		.concat([mkCmp('option[SELECT A PASSENGER]', {disabled: 'disabled', selected: 'selected'})]);

	let mkFld = (caption, name, size = null) => {
		let cls = enableds[name] ? '.enabled' : '';
		let fld = mkCmp('span' + cls);
		let inp;
		if (name === 'passengerName') {
			inp = mkCmp('select', {name: 'passengerName'}).attach(nameOptions);
			if ((data.passengers || []).length === 1) {
				inp.context.value = data.passengers[0];
			}
		} else if (name === 'expirationDate') {
			// display as '07/20', but pass to backend what we got from it - '2020-07-01'
			inp = mkCmp('input', {type: 'text', value: formatExpirationDate(values[name]), disabled: 'disabled'});
			fld.attach([mkCmp('input', {type: 'hidden', value: values[name], name: name})]);
		} else {
			inp = mkCmp('input', {type: 'text', value: values[name], name: name});
		}
		if (!enableds[name]) {
			inp.context.setAttribute('disabled', 'disabled');
		}
		if (name === 'issueNow') {
			inp.context.setAttribute('placeholder', 'Y/N');
		}
		fld.attach([
			mkCmp('label[' + caption + ']'), inp,
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

	let normal = 10;
	let small = 6;
	let tiny = 3;
	// I would be glad to move this to an html file...
	let mcoForm = mkCmp('form.mask-form mco-mask').attach([
		mkCmp('br'),
		mkCmp('div').attach([
			mkCmp('div.align-caption').attach([
				mkCmp('div.cmd-line').attach([ // 'HHMCU..         *** MISC CHARGE ORDER ***                       ',
					mkCmp('span').attach([mkCmp('label[HHMCU' + (values.mcoNumber || '') + ']')]),
					mkCmp('span.screen-name').attach([mkCmp('label[*** MISC CHARGE ORDER ***]')]),
				]),
				mkCmp('div').attach([ // ' PASSENGER NAME;........................................        ',
					mkFld('PAX NAME', 'passengerName'),
				]),
				mkCmp('div').attach([ // ' TO;........................................ AT;............... ',
					mkFld('TO', 'to', normal),
					mkFld('AT', 'at', normal),
				]),
				mkCmp('div').attach([ // ' VALID FOR;.................................................... ',
					mkFld('VALID FOR', 'validFor'),
				]),
				mkCmp('div').attach([ // ' TOUR CODE;............... RELATED TKT NBR;.............        ',
					mkFld('TOUR CODE', 'tourCode', normal),
					mkFld('RELATED TKT NBR', 'ticketNumber', normal),
				]),
				mkCmp('div').attach([ // ' FOP;.......................................................... ',
					mkFld('FOP', 'formOfPayment'),
				]),
				mkCmp('div').attach([ // ' EXP DATE;.... APVL CODE;...... COMM;........ TAX;........-;..  ',
					mkFld('EXP DATE', 'expirationDate', normal),
					mkFld('APVL CODE', 'approvalCode', small),
					mkFld('COMM', 'commission', small),

					mkCmp('div.float-right').attach([
						mkFld('TAX', 'taxAmount', small),
						mkFld('-', 'taxCode', tiny),
					]),
				]),
				mkCmp('div').attach([ // ' AMOUNT;........-;... EQUIV ;........-;... BSR;..........       ',
					mkFld('AMOUNT', 'amount', small),
					mkFld('-', 'amountCurrency', small),

					mkCmp('div.float-right').attach([
						mkFld('EQUIV', 'equivAmount', small),
						mkFld('-', 'equivCurrency', small),
						mkFld('BSR', 'rateOfExchange', small),
					]),
				]),
				mkCmp('div').attach([ // ' END BOX;...................................................... ',
					mkFld('END BOX', 'endorsementBox'),
				]),
				mkCmp('div').attach([ // ' REMARK1;..............................................         ',
					mkFld('REMARK1', 'remark1'),
				]),
				mkCmp('div').attach([ //  ' REMARK2;...................................................... ',
					mkFld('REMARK2', 'remark2'),
				]),
			]),
			mkCmp('div').attach([ // ' VALIDATING CARRIER;..                  ISSUE NOW;.             ',
				mkFld('VALIDATING CARRIER', 'validatingCarrier', normal),
				mkFld('ISSUE NOW', 'issueNow', small),
			]),
			mkCmp('div.float-right').attach([
				mkCmp('button[Submit]'),
				mkCmp('button[Cancel]', {type: 'button', onclick: () => mcoForm.context.remove()}),
			]),
		]),
		mkCmp('br', {clear: 'all'}),
	]);
	return mcoForm;
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
//   'HHMCU..         *** MISC CHARGE ORDER ***                       ',
//   ' PASSENGER NAME;........................................        ',
//   ' TO;........................................ AT;............... ',
//   ' VALID FOR;.................................................... ',
//   ' TOUR CODE;............... RELATED TKT NBR;.............        ',
//   ' FOP;.......................................................... ',
//   ' EXP DATE;.... APVL CODE;...... COMM;........ TAX;........-;..  ',
//   ' AMOUNT;........-;... EQUIV ;........-;... BSR;..........       ',
//   ' END BOX;...................................................... ',
//   ' REMARK1;..............................................         ',
//   ' REMARK2;...................................................... ',
//   ' VALIDATING CARRIER;..                  ISSUE NOW;.             ',
/** @param {IRbsMcoData} data */
export let McoForm = ({data, onsubmit = null}) => {
	let mcoForm = dataToDom(data);
	mcoForm.context.onsubmit = () => {
		if (onsubmit) {
			onsubmit(domToData(mcoForm)).then(({canClosePopup}) => {
				if (canClosePopup) {
					mcoForm.context.remove();
				}
			});
		}
		return false;
	};
	return mcoForm;
};