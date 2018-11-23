import App 		from 'application';
import User 	from "../../../../../../abstract/user";
import {tourDefData, tourDefDataClone, tourTerminalData} from "es6!./tour";
import {CreatePqContext} 	from "es6!./containers/context";
import {createStore} 		from "es6!./store";
import CreatePq 			from 'es6!./reducers/index';
import {url} 				from 'abstract/helper';
import {PANELS, VARS} 		from 'page/common/constants';

const initState = (data = {}) => ({
	isHidden 	: false,
	errors 		: {},

	rId 		: App.get('rId'),
	revenueOpt	: App.get('mileages').filter( obj => obj.code === '07')[0],

	canPcc		: true,
	canDump		: true,
	canMarkup	: App.get('auth')['isExpert'],
	canCliRemark: !App.get('auth')['isExpert'],
	canMileAge 	: User.agent.hasRoles(['cmsAllowChoseMileages']), // || !App.get('prod'),
	canTour		: User.agent.hasRoles(['canAddHotel', 'addHotelOptional']) || !App.get('prod'),
	optionalTour: !User.agent.hasRole('addHotelOptional'),
	canCurrency : true,
	canNetVal	: true,

	clone		: false,
	terminal	: false,
	onClose		: () => App.publish('/pqTable/resizeHeader'),

	...data
});

let store;
const currency 		= (App.get('currency') || [] )[0] || {};
const getCurrency	= name => App.get('currency').filter(c => c.name === name)[0] || currency;

const show = ({props, ...data}, modalId) => {

	const tourFareArray = App.get('apolloPcc').filter(pcc => pcc.isTourFare);

	const state 		= initState({
		props : {
			dump 				: '',
			internalRemark		: '',
			clientRemark		: '',
			... props
		},

		isTourFare		: tourFareArray.filter(pcc => pcc.id === parseInt(props.pcc)).length > 0,
		tourFareArray 	: tourFareArray,
		...data
	});

	store = store || createStore(CreatePq)(CreatePqContext, 'leadInfoWrap');
	store.render(state);

	if (modalId) {
		url.panel.remove(PANELS.priceQuote, PANELS.priceQuoteClone);
		url.var.remove(VARS.pqcId);
		url.panel.add(modalId);
	}
};

export const AddPq = () => {
	show({
		props : {
			pcc 	: -1,
			currency: currency['id'],
			mileage	: 0,
			prices 	: addPqPrices()
		},

		tour	: tourDefData()
	}, PANELS.priceQuote);

	document.body.classList.add('modal-open-pq');
	App.publish('/pqTable/resizeHeader');
};

export const ClonePq = rowData => {
	show({
		itineraryId 	: rowData.id,
		flightOptionId 	: rowData.flightOptionId,

		props 			: {
			dump 				: rowData['reservationDumpClean'],
			mileage				: rowData['mileagesId'] || 0,
			pcc					: rowData['pccId'] 		|| App.get('apolloPcc')[0]['id'],
			clientRemark 		: rowData['remarksForCustomer'] || '',
			internalRemark 		: rowData['manualRemark'] 		|| '',
			currency			: getCurrency(rowData['currencyName'])['id'],
			detailsNotRequired 	: true,
			prices 				: clonePrices(rowData)
		},

		canCurrency : false,
		canNetVal	: false,
		canDump		: false,
		clone		: true,
		tour		: tourDefDataClone(rowData.hotelData, rowData.segments[0]['destinationDateTime'])
	}, PANELS.priceQuoteClone);

	url.var.update(VARS.pqcId, rowData.id);

	document.body.classList.add('modal-open-pq');
	App.publish('/pqTable/resizeHeader');
};

export const TerminalCreate = (response, onClose) => {

	const props = {
		itineraryId 	: response.result.itineraryId,
		flightOptionId 	: response.result.flId,

		tour 			: tourTerminalData(response.data.destinations),
		isTourFare		: response.data.isTourFare,

		canCurrency 	: false,
		canNetVal		: false,
		canDump			: false,
		canPcc			: false,
		terminal 		: true,

		props			: {
			dump 			: response.data['reservationDump'],
			pcc				: response.data['pccId'],
			currency		: response.data['currencyId'],
			prices			: terminalPrices(response['data']['netPrices'] || {}),
			mileage			: 0,
			selectCurrency	: response.data.selectCurrency || false,
			selectPcc		: response.data.selectPcc || false
		},

		pnr					: response.data.pnr || '',
		onClose 			: onClose,
		manualApprovalText 	: response.result.manualApprovalText || ''
	};
	if (response.rId) {
		props.rId = response.rId;
	}

	show(props);
};

const makePrices = prices => prices.map(({name, selVal = '', netVal = '', markUp = 0}) => ({ name, selVal, netVal, markUp }));

const addPqPrices = () => {
	const paxMap 	= {adults : 'Adult', childs : 'Child', infants : 'Infant'};

	const pr 		= App.get('lead')['destinations'][1][1];

	const byPax 	= (name) => ({name : paxMap[name]});
	const prices 	= ['adults', 'childs', 'infants'].filter(name => pr[name]).map(name => byPax(name));

	return makePrices(prices);
};

const clonePrices = (rowData) => {
	const byPax = (name, {net, amount, markup}) =>  ({name, netVal : net, selVal : amount, markUp : markup});
	const prices = ['adult', 'child', 'infant'].filter( name => rowData.prices[name]).map( name => byPax(name, rowData.prices[name]));
	return makePrices(prices);
};

const terminalPrices = (price) => {

	const byPax = (name, {amount}) =>  ({
		name 	: name.charAt(0).toUpperCase() + name.slice(1) + 's',
		netVal 	: amount
	});

	const prices = ['adult', 'child', 'infant'].filter(name => price[name]).map(name => byPax(name, price[name]));

	return makePrices(prices);
};