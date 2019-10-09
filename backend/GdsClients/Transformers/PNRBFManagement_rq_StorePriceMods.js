const BuilderUtil = require('gds-utils/src/text_format_processing/agnostic/BuilderUtil.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const Parse_priceItinerary = require('gds-utils/src/text_format_processing/apollo/commands/Parse_priceItinerary.js');

/** @param storePricingParams = require('AtfqParser.js').parsePricingCommand() */
const PNRBFManagement_rq_StorePriceMods = (storePricingParams) => {
	const {gds, pricingModifiers} = storePricingParams;
	const xmlMods = [];
	const xmlModSegSelection = {SegSelection: [
		{ReqAirVPFs: 'Y'},
		{SegRangeAry: []},
	]};
	const xmlPFQual = {PFQual: [
		{CRSInd: {
			'apollo': '1V',
			'galileo': '1G',
		}[gds]},
		{PublishedFaresInd: 'Y'},
		{Type: 'A'}, // 'A' - all types, 'V' - validated
	]};
	const xmlModGenQuoteInfo = {GenQuoteInfo: [
		{NetFaresOnly: 'A'}, // both net and pub/private
	]};
	const xmlModPassengerType = {PassengerType: [{PsgrAry: []}]};
	let fareType = null;

	for (const mod of pricingModifiers) {
		const {type, parsed, raw} = mod;
		if (type === 'forceProperEconomy') {
			// does not appear in ATFQ cmd copy, but hope it works
			xmlModGenQuoteInfo.GenQuoteInfo.push({Decontented: 'Y'});
		} else if (type === 'fareType') {
			fareType = parsed;
			xmlMods.push({DocProdFareType: [{Type: Parse_priceItinerary.encodeFareType(parsed)}]});
		} else if (type === 'validatingCarrier') {
			xmlMods.push({PlatingAirVMods: [{PlatingAirV: parsed}]});
		} else if (type === 'overrideCarrier') {
			xmlMods.push({OCMods: [{AirV: parsed}]});
		} else if (type === 'commission') {
			const commMod = parsed.units === 'percent'
				? {CommissionMod: [{Amt: parsed.value}]}
				: {CommissionMod: [{Percent: parsed.value}]};
			xmlMods.push(commMod);
		} else if (type === 'passengers') {
			for (const pax of parsed.passengerProperties) {
				xmlMods.push({AssocPsgrs: [
					{PsgrAry: [
						{Psgr: [
							{LNameNum: pax.passengerNumber || 1},
							{PsgrNum: pax.firstNameNumber || 1},
							{AbsNameNum: pax.passengerNumber || 1},
						]},
					]},
				]});
				if (pax.ptc) {
					xmlMods.push({PICOptMod: [{PIC: pax.ptc}]});
				}
			}
			xmlModPassengerType.PassengerType[0].PsgrAry
				.push(...parsed.passengerProperties.map(pax => {
					const age = ((pax.ptc || '').match(/^[A-Z](\d{1,2})$/) || [])[1];
					return ({Psgr: [
						{LNameNum: pax.passengerNumber || 1},
						{PsgrNum: pax.firstNameNumber || 1},
						{AbsNameNum: pax.passengerNumber || 1},
						{PTC: pax.ptc},
						...(!age ? [] : [{Age: age}]),
					]});
				}));
		} else if (type === 'accompaniedChild') {
			// weird, but seems to work. Now, even though /ACC does
			// not appear in ATFQ cmd copy, we do get the child price
			xmlModPassengerType.PassengerType[0].PsgrAry
				.push({Psgr: [
					{LNameNum: '0'},
					{PsgrNum: '0'},
					{AbsNameNum: '0'},
				]});
		} else if (type === 'segments') {
			for (const b of parsed.bundles) {
				const segNums = b.segmentNumbers;
				const ranges = segNums.length > 0
					? BuilderUtil.shortenRanges(segNums)
					: [{from: 0, to: 0}];
				if (b.accountCode || b.pcc || b.bookingClass) {
					const msg = 'Unsupported segment modifier for #' +
						segNums.join(',') + ' - ' + raw;
					return Rej.NotImplemented(msg, b);
				}
				for (const {from, to} of ranges) {
					xmlModSegSelection.SegSelection[1].SegRangeAry
						.push({SegRange: [
							{StartSeg: from},
							{EndSeg: to},
							{FareType: !b.fareBasis ? 'P' : 'B'},
							...(!b.fareBasis ? [] : [{FIC: b.fareBasis}]),
							xmlPFQual,
						]});
				}
			}
		} else if (type === 'cabinClass') {
			const msg = 'Cabin class modifier not allowed in T:$B - ' + raw +
				'. You may want to $BB/' + raw + ' and $BBQ01 to rebook in desired class prior to T:$B';
			throw Rej.BadRequest.makeExc(msg);
		} else {
			const reject = !type ? Rej.BadRequest : Rej.NotImplemented;
			throw reject.makeExc('Unsupported T:$B modifier - ' + type + ' - ' + raw);
		}
	}
	if (xmlModSegSelection.SegSelection[1].SegRangeAry.length === 0) {
		xmlModSegSelection.SegSelection[1].SegRangeAry.push({SegRange: [
			{StartSeg: '00'}, {EndSeg: '00'}, {FareType: 'P'}, xmlPFQual,
		]});
	}
	if (fareType === 'public') {
		// even though we said that it is public fare in <DocProdFareType/>, travelport seems to also
		// require PFQual field to be empty to actually return public fare in some broken fare cases
		for (const xmlEl of xmlModSegSelection.SegSelection[1].SegRangeAry) {
			xmlEl.SegRange.pop(); // <PFQual/>
			xmlEl.SegRange.slice(-1)[0].FareType = {
				'P': 'N', // P = private fare data, N = no more data
				'B': 'F', // B = fare basis + private fare data, F = just fare basis
			}[xmlEl.SegRange.slice(-1)[0].FareType];
		}
	}
	xmlMods.push(xmlModSegSelection);
	xmlMods.push(xmlModPassengerType);
	xmlMods.push(xmlModGenQuoteInfo);

	return xmlMods;
};

module.exports = PNRBFManagement_rq_StorePriceMods;
