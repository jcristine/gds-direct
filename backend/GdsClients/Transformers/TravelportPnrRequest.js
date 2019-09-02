const AtfqParser = require('../../Transpiled/Gds/Parsers/Apollo/Pnr/AtfqParser.js');
const ParserUtil = require('../../Parsers/ParserUtil.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const DecodeTravelportError = require('./DecodeTravelportError.js');
const {parseXml} = require("../../GdsHelpers/CommonUtils.js");
const UnprocessableEntity = require("klesun-node-tools/src/Rej").UnprocessableEntity;

const js2xml = require("xml");
const _ = require("lodash");
const moment = require("moment");
const {getValueOrNullFromDomElement} = require('./Utils');

// Builds xml body of a PNR soap request
module.exports.buildPnrXmlDataObject = params => js2xml([
	{SessionMods: [
		{AreaInfoReq: null},
	]},
	...(!params.addAirSegments ? [] : [
		{AirSegSellMods: (params.addAirSegments || [])
			.map(transformAirSegmentForSoap)
			.map(v => ({AirSegSell: v}))},
	]),
	// note, position of <PNRBFRetrieveMods/> element is important: if it were placed before
	// <AirSegSellMods/>, it would not include the newly added segments with their numbers
	// the code outside is expecting them to be included, so let's make sure this element is always in the end
	{PNRBFRetrieveMods: [params.recordLocator ?
		{PNRAddr: [{RecLoc: params.recordLocator}]} : {CurrentPNR: null},
	]},
	// display all stored pricing-s (8 max)
	// see http://testws.galileo.com/GWSSample/Help/GWSHelp/mergedprojects/XML_Samples/PNRBFManagement_33_s105.xml
	...[...Array(8).keys()].map(i => ({FareRedisplayMods: [
		{DisplayAction: {Action: 'D'}}, // 'D' - *LF (detailed) data, 'I' - ATFQ (brief) data
		{FareNumInfo: [{FareNumAry: [{FareNum: +i + 1}]}]},
	]})),
	// no point in putting it higher, you won't get the
	// updated <DocProdDisplayStoredQuote/> in same request anyway
	...(!params.storePricingParams ? [] : [{
		StorePriceMods: makeStorePriceMods(params.storePricingParams),
	}]),
]);

// parses travelport soap request response body and build corresponding object
module.exports.parsePnrXmlResponse = async response => {
	const dom = parseXml(response);

	const respElement = dom.querySelector("PNRBFManagement_51");

	if (!respElement) {
		throw UnprocessableEntity.makeExc("Missing PNRBFManagement_51 element in response", response);
	}

	const airSegmentElement = respElement.querySelectorAll("AirSeg") || [];
	const sellSegmentElement = respElement.querySelector("AirSegSell");
	const storeElements = [...respElement.querySelectorAll("DocProdDisplayStoredQuote")];
	const currentPricingEl = respElement.querySelector("FareInfo");

	const airSellResult = transformAirSellSegFromSoap(sellSegmentElement);

	return {
		error: collectErrors(respElement, airSellResult),
		reservation: {
			itinerary: _.map(airSegmentElement, transformAirSegmentFromSoap),
		},
		currentPricing: !currentPricingEl ? null : transformCurrentPricing(currentPricingEl),
		/** stored pricing */
		fareQuoteInfo: transformFareQuoteInfo(storeElements),
		newAirSegments: airSellResult.sell,
	};
};

// In soap response it is yyyymmdd without any delimiters
const transformDateFromSoap = date => {
	if(!/^\d{8}$/.test(date)) {
		return null;
	}

	const y = date.substr(0, 4);
	const m = date.substr(4, 2);
	const d = date.substr(6, 2);

	return {
		raw: date,
		parsed: y + '-' + m + '-' + d,
	};
};

// In soap response it is as (h)hmm(ss) without any delimiters
const transformTimeFromSoap = time => {
	if(!time) {
		return null;
	}

	const paddedDate = _.padStart(time, 4, '0');

	const h = paddedDate.substr(0, 2);
	const m = paddedDate.substr(2, 2);
	const s = paddedDate.substr(4, 2) || '00';

	return {
		raw: paddedDate,
		parsed: h + ':' + m + ':' + s,
	};
};

const transformAirSegmentFromSoap = element => {
	const departureDate = transformDateFromSoap(getValueOrNullFromDomElement(element, 'Dt'));
	const departureTime = transformTimeFromSoap(getValueOrNullFromDomElement(element, 'StartTm'));
	let departureDtStr = departureDate.parsed;
	if (departureDtStr && departureTime) {
		departureDtStr += ' ' + departureTime.parsed;
	}
	return {
		segmentNumber: getValueOrNullFromDomElement(element, 'SegNum'),
		segmentStatus: getValueOrNullFromDomElement(element, 'Status'),
		airline: getValueOrNullFromDomElement(element, 'AirV'),
		seatCount: getValueOrNullFromDomElement(element, 'NumPsgrs'),
		departureAirport: getValueOrNullFromDomElement(element, 'StartAirp'),
		destinationAirport: getValueOrNullFromDomElement(element, 'EndAirp'),
		bookingClass: getValueOrNullFromDomElement(element, 'BIC'),
		flightNumber: getValueOrNullFromDomElement(element, 'FltNum'),
		marriage: getValueOrNullFromDomElement(element, 'MarriageNum'),
		departureDt: !departureDtStr ? null : {full: departureDtStr},
		// XML-specific fields follow
		statusOld: getValueOrNullFromDomElement(element, 'PrevStatusCode'),
		// is it confirmedByAirline from ItineraryParser.js per chance?
		confirmedByAirlineIndicator: getValueOrNullFromDomElement(element, 'VndLocInd'),
		isFlown: getValueOrNullFromDomElement(element, 'FltFlownInd') === 'Y',
		scheduleValidationIndicator: getValueOrNullFromDomElement(element, 'ScheduleValidationInd'),
		// separate departure/destination date/time fields should probably be removed, as they
		// would make sense only in parser-specific processes, and XML actions should be as
		// close to the ImportApolloPnrFormatAdapter.js::transformReservation() as possible
		departureDate: departureDate,
		departureTime: departureTime,
		dayOffset: getValueOrNullFromDomElement(element, 'DayChg'),
		destinationTime: transformTimeFromSoap(getValueOrNullFromDomElement(element, 'EndTm')),
	};
};

const transformAirSellFromSoap = element => ({
	success: getValueOrNullFromDomElement(element, 'SuccessInd') === 'Y',
	displaySequenceNumber: getValueOrNullFromDomElement(element, 'DisplaySequenceNumber'),
	airline: getValueOrNullFromDomElement(element, 'Vnd'),
	flightNumber: getValueOrNullFromDomElement(element, 'FltNum'),
	bookingClass: getValueOrNullFromDomElement(element, 'Class'),
	departureDate: transformDateFromSoap(getValueOrNullFromDomElement(element, 'StartDt')),
	dayOffset: getValueOrNullFromDomElement(element, 'DtChg'),
	departureAirport: getValueOrNullFromDomElement(element, 'StartAirp'),
	destinationAirport: getValueOrNullFromDomElement(element, 'EndAirp'),
	departureTime: transformTimeFromSoap(getValueOrNullFromDomElement(element,'StartTm')),
	destinationTime: transformTimeFromSoap(getValueOrNullFromDomElement(element, 'EndTm')),
	segmentStatus: getValueOrNullFromDomElement(element, 'Status'),
	seatCount: getValueOrNullFromDomElement(element, 'NumPsgrs'),
	marriage: getValueOrNullFromDomElement(element, 'MarriageNum'),
	aircraftChanges: getValueOrNullFromDomElement(element, 'COG') === 'Y',
	eticket: getValueOrNullFromDomElement(element, 'TklessInd') === 'Y',
	isStopover: getValueOrNullFromDomElement(element, 'StopoverInd') === 'Y',
	operatedByCode: getValueOrNullFromDomElement(element, 'OpAirV'),
	messages: [],
});

const transformAirSellSegFromSoap = element => {
	const result = {
		error: null,
		sell: [],
	};

	if(!element) {
		return result;
	}

	_.forEach(element.children, childEl => {
		if(childEl.tagName === "AirSell") {
			result.sell.push(transformAirSellFromSoap(childEl));
			return;
		}

		if(childEl.tagName === "TextMsg" && result.sell.length > 0) {
			_.last(result.sell).messages.push(getValueOrNullFromDomElement(childEl, "Txt") || '');
			return;
		}

		if(childEl.tagName === "ErrText" && result.sell.length > 0) {
			_.last(result.sell).error = getValueOrNullFromDomElement(childEl, "Text");
			return;
		}

		if(childEl.tagName === "ErrText") {
			result.error = getValueOrNullFromDomElement(childEl, "Text");
			return;
		}
	});

	return result;
};

// single entry in newAirSegments
const transformAirSegmentForSoap = segment => {
	const dateRegex = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;
	const hasBothDateTimes = dateRegex.test(segment.departureDt) && dateRegex.test(segment.destinationDt);

	const departureTime = hasBothDateTimes
		? moment.utc(segment.departureDt).format("HHmm") : null;
	const destinationTime = hasBothDateTimes
		? moment.utc(segment.destinationDt).format("HHmm") : null;
	const dayOffset = hasBothDateTimes
		? moment.utc(segment.destinationDt).diff(moment.utc(segment.departureDt), "days") : null;

	return [
		{Vnd: segment["airline"]},
		{FltNum: _.padStart(segment.flightNumber, 4, "0")},
		{Class: segment.bookingClass},
		{StartDt: moment.utc(segment.departureDt).format("YYYYMMDD")},
		{StartAirp: segment.departureAirport},
		{EndAirp: segment.destinationAirport},
		{Status: segment.segmentStatus},
		{NumPsgrs: segment.seatCount},
		{StartTm: departureTime},
		{EndTm: destinationTime},
		{DtChg: dayOffset},
		{AvailDispType: 'G'},
	];
};

const collectErrors = (dom, sellSegments) => {
	const errors = [];

	const overallError = getValueOrNullFromDomElement(dom.querySelector("PNRBFRetrieve > ErrText"), "Text");
	const transactionErrorCode = getValueOrNullFromDomElement(dom.querySelector("TransactionErrorCode"), "Code");

	if(overallError) {
		errors.push(overallError);
	}

	if(sellSegments.error) {
		errors.push('Failed to sell segments - ' + sellSegments.error);
	}

	sellSegments.sell
		.filter(sell => sell.error)
		.forEach(sell => errors.push('Failed to sell 0'
			+ sell.airline
			+ sell.flightNumber
			+ sell.bookingClass
			+ moment.utc(sell.departureDate.parsed).format("DDMMM").toUpperCase()
			+ sell.departureAirport
			+ sell.destinationAirport
			+ sell.segmentStatus
			+ (sell.seatCount || '1')
			+ ' - ' + sell.error));

	// code 1 means something like "partial success with warnings"
	if (transactionErrorCode && transactionErrorCode != 1) {
		const decoded = DecodeTravelportError(transactionErrorCode);
		const error = 'Transaction error #' + transactionErrorCode +
			' (' + (decoded || 'unknown code') + ')';
		errors.push(error);
	}

	return errors.length > 0 ? errors.join("; ") : null;
};

/** @param storePricingParams = require('AtfqParser.js').parsePricingCommand() */
const makeStorePriceMods = (storePricingParams) => {
	const {gds, pricingModifiers} = storePricingParams;
	const xmlMods = [];
	xmlMods.push({SegSelection: [
		{ReqAirVPFs: 'Y'},
		{SegRangeAry: [{SegRange: [
			{StartSeg: '00'},
			{EndSeg: '00'},
			{FareType: 'P'}, // Means "private", but "PublishedFaresInd" allows pub
			{PFQual: [
				{CRSInd: {
					'apollo': '1V',
					'galileo': '1G',
				}[gds]},
				{PublishedFaresInd: 'Y'},
				{Type: 'A'}, // 'A' - all types, 'V' - validated
			]},
		]}]},
	]});
	const xmlModGenQuoteInfo = {GenQuoteInfo: [
		{NetFaresOnly: 'A'}, // both net and pub/private
	]};
	const xmlModPassengerType = {PassengerType: [{PsgrAry: []}]};

	for (const mod of pricingModifiers) {
		const {type, parsed, raw} = mod;
		if (type === 'forceProperEconomy') {
			// does not appear in ATFQ cmd copy, but hope it works
			xmlModGenQuoteInfo.GenQuoteInfo.push({Decontented: 'Y'});
		} else if (type === 'fareType') {
			xmlMods.push({DocProdFareType: [{Type: AtfqParser.encodeFareType(parsed)}]});
		} else if (type === 'validatingCarrier') {
			xmlMods.push({PlatingAirVMods: [{PlatingAirV: parsed}]});
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
		} else {
			throw Rej.NotImplemented.makeExc('Unsupported T:$B modifier - ' + type + ' - ' + raw);
		}
	}
	xmlMods.push(xmlModPassengerType);
	xmlMods.push(xmlModGenQuoteInfo);

	return xmlMods;
};

/** @param {Element} blockEl */
const transformPtcBlock = (blockEl, storeEl) => {
	const uniqueKey = +blockEl.querySelector(':scope > UniqueKey').textContent;
	/** @see https://ask.travelport.com/index?page=content&id=AN9643&actp=search&viewlocale=en_US&searchid=1527512839140#FSI */
	const fareTypeCode = [...storeEl.querySelectorAll(':scope > FareGarnteCD')]
		.filter(guarEl => +(guarEl.querySelector('UniqueKey') || {}).textContent === uniqueKey)
		.map(guarEl => (guarEl.querySelector('GuaranteeCD') || {}).textContent || null)[0];
	return {
		fareTypeCode: fareTypeCode,
		hasPrivateFaresSelectedMessage: ['B', 'A', 'Z', 'P'].includes(fareTypeCode),
		// there is more data in XML, but for now I need just few fields
	};
};

/** @param {Element} storeEl */
const transformStore = (storeEl) => {
	const get = (keys) => [...storeEl.querySelectorAll(':scope > ' + keys.join(' > '))];
	return {
		pricingNumber: get(['FareNumInfo', 'FareNumAry', 'FareNum'])
			.map(el => el.textContent)[0] || null,
		pricingBlockList: get(['GenQuoteDetails']).map((b, i) => transformPtcBlock(b, storeEl)),
		// there is more data in XML, but for now I need just few fields
	};
};

const transformFareQuoteInfo = (storeElements) => {
	const pricingList = [];
	const messages = [];
	for (const storeEl of storeElements) {
		const error = storeEl.querySelector(':scope > ErrText > Text');
		if (error) {
			messages.push(error.textContent);
		} else {
			pricingList.push(transformStore(storeEl));
		}
	}
	return {pricingList, messages};
};

const normMoney = (el, currencyField, centsField, decPosField) => {
	const currency = el.querySelector(currencyField).textContent;
	const cents = el.querySelector(centsField).textContent;
	const decPos = el.querySelector(decPosField).textContent;
	return {
		currency,
		amount: (cents / Math.pow(10, decPos)).toFixed(decPos),
	};
};

const transformPricedSegment = (segEl) => {
	const bagCode = segEl.querySelector('BagInfo').textContent;
	const nvb = (segEl.querySelector('NotValidBeforeDt') || {}).textContent;
	const nva = (segEl.querySelector('NotValidAfterDt') || {}).textContent;
	return {
		fareBasis: segEl.querySelector('FIC').textContent,
		ticketDesignator: (segEl.querySelector('TkDesignator') || {}).textContent,
		freeBaggageAmount: ParserUtil.parseBagAmountCode(bagCode),
		notValidBefore: !nvb ? null : {raw: nvb},
		notValidAfter: !nva ? null : {raw: nva},
		fare: [...segEl.querySelectorAll('Fare')]
			.map(el => el.textContent.trim())[0],
		isStopover: [...segEl.querySelectorAll('Stopover')]
			.some(el => el.textContent !== 'X'),
	};
};

const transformCurrentPtcBlock = (blockEl, pricingEl) => {
	const uniqueKey = +blockEl.querySelector(':scope > UniqueKey').textContent;
	return ({
		fareInfo: {
			baseFare: normMoney(blockEl, 'BaseFareCurrency', 'BaseFareAmt', 'BaseDecPos'),
			totalFare: normMoney(blockEl, 'TotCurrency', 'TotAmt', 'TotDecPos'),
		},
		hasPrivateFaresSelectedMessage: [...blockEl.querySelectorAll('PrivFQd')]
			.some(el => el.textContent === 'Y'),
		segments: [...pricingEl.querySelectorAll(':scope > SegRelatedInfo')]
			.filter(el => +el.querySelector('UniqueKey').textContent === uniqueKey)
			.map(segEl => transformPricedSegment(segEl)),
	});
};

const transformCurrentPricing = (pricingEl) => {
	const ptcBlocks = [...pricingEl.querySelectorAll(':scope > GenQuoteDetails')]
		.map(blockEl => transformCurrentPtcBlock(blockEl, pricingEl));
	return {
		pricingBlockList: ptcBlocks,
		// there is more data in the XML...
	};
};