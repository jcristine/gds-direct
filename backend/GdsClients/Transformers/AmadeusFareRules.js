const {getValueOrNullFromDomElement} = require('./Utils');
const {parseXml} = require('../../GdsHelpers/CommonUtils.js');
const _ = require('lodash');
const xml = require('xml');
const moment = require('moment');

module.exports.buildFareRuleXml = params => '<ns1:Fare_GetFareRules xmlns:ns1="http://xml.amadeus.com/FARRNQ_10_1_1A">' + xml([
	{'ns1:msgType': [{
		'ns1:messageFunctionDetails': [{'ns1:messageFunction': 'FRN'}],
	}]},
	{'ns1:pricingTickInfo': [{
		'ns1:productDateTimeDetails': [{'ns1:ticketingDate': moment.utc(params.ticketingDt).format('DDMMYY')}],
	}]},
	{'ns1:flightQualification': [{
		'ns1:additionalFareDetails': [
			{'ns1:rateClass': params.fareBasis},
			{'ns1:commodityCategory': params.ticketDesignator || null},
		],
	}]},
	{'ns1:transportInformation': [{
		'ns1:transportService': [{
			'ns1:companyIdentification': [{'ns1:marketingCompany': params.airline}],
		}],
	}]},
	{'ns1:tripDescription': [
		{'ns1:origDest': [{'ns1:origin': params.origin}, {'ns1:destination': params.destination}]},
		{'ns1:dateFlightMovement': params.departureDt ?
			[{'ns1:dateAndTimeDetails': [{'ns1:date': moment.utc(params.departureDt).format('DDMMYY')}]}] : null},
	]},
]) + '</ns1:Fare_GetFareRules>';

module.exports.parseFareRuleXmlResponse = response => {
	const dom = parseXml(response);
	const header = transformHeader(dom);
	const sections = transformSections(dom);

	if(sections.length > 0) {
		return {
			header: header,
			sections: sections,
		};
	} else {
		return transformError(dom);
	}
};

const transformHeader = dom => {
	const rootNode = dom.querySelector('flightDetails');

	if(!rootNode) {
		return null;
	}

	const fareDetails = rootNode.querySelector('qualificationFareDetails');
	const productInfo = rootNode.querySelector('productInfo');
	const travellerGrp = rootNode.querySelector('travellerGrp');
	const refItems = rootNode.querySelectorAll('referenceDetails') || [];
	const infoItems = rootNode.querySelectorAll('flightErrorCode') || [];

	const infoCodeToText = _.reduce(infoItems, (obj, item) => {
		obj[item.querySelector('freeTextQualification > informationType').textContent]
			= item.querySelector('freeText').textContent;
		return obj;
	}, {});

	const refTypeToValue = _.reduce(refItems, (obj, item) => {
		obj[item.querySelector('type').textContent] = item.querySelector('value').textContent;
		return obj;
	}, {});

	return {
		fareBasis: getValueOrNullFromDomElement(fareDetails, 'additionalFareDetails > fareClass'),
		trf: getValueOrNullFromDomElement(travellerGrp, 'fareRulesDetails > tariffClassId'),
		rule: refTypeToValue['RU'] || null,
		bookingClass: getValueOrNullFromDomElement(productInfo, 'productDetails > bookingClassDetails > designator'),
		ptc: getValueOrNullFromDomElement(fareDetails, 'fareDetails > qualifier'),
		ptcMeaning: infoCodeToText['PTC'] || null,
		fareType: getValueOrNullFromDomElement(fareDetails, 'fareDetails > fareCategory'),
		tripTypeRemark: infoCodeToText['FTC'] || null,
		sectionOrders: _.map(travellerGrp.querySelectorAll('fareRulesDetails > ruleSectionId'), el => el.textContent),
	};
};

const transformSections = dom => {
	const rootNodes = dom.querySelectorAll('tariffInfo') || [];

	return _.map(rootNodes, node => {
		const lineRecords = node.querySelectorAll('fareRuleText') || [];

		const headerTextParts = (getValueOrNullFromDomElement(lineRecords[0], 'freeText') || '')
			.split('.');

		return {
			sectionOrder: getValueOrNullFromDomElement(node, 'fareRuleInfo > ruleSectionLocalId'),
			sectionNumber: _.trim(getValueOrNullFromDomElement(node, 'fareRuleInfo > ruleCategoryCode'), '()'),
			sectionName: headerTextParts[1] || '',
			abbrevation: headerTextParts[0] || '',
			// drop is used to imitate php functionality, in php shift is used to get
			// node for name/abbrevation
			raw: _.map(_.drop(lineRecords), n => getValueOrNullFromDomElement(n, 'freeText'))
				.join('\n'),
		};
	});
};

const transformError = dom => {
	return {
		errorCode: getValueOrNullFromDomElement(dom, 'errorInfo > rejectErrorCode > errorDetails > errorCode'),
		error: _.map(dom.querySelectorAll('errorInfo > errorFreeText > freeText'), n => n.textContent || '')
			.join('') || 'Unexpected response format - ', //+ dom.serialize(),
	};
};