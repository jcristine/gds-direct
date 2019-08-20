
import Component from '../../modules/component.es6';
const Cmp = (...args) => new Component(...args);

const PricePccMixList = () => {
	const theadCmp = Cmp('thead').attach([Cmp('tr').attach([
		Cmp('th', {textContent: 'PCC'}),
		Cmp('th', {textContent: 'PTC'}),
		Cmp('th', {textContent: 'Fare Type'}),
		Cmp('th', {textContent: 'ADT'}),
		Cmp('th', {textContent: 'CHD'}),
		Cmp('th', {textContent: 'INF'}),
	])]);
	const tbodyCmp = Cmp('tbody');
	const rootCmp = Cmp('div.price-pcc-mix-list').attach([
		Cmp('table').attach([theadCmp, tbodyCmp]),
	]);

	/** @param {{gds, pcc}} pccResult = (new (require('RepriceInAnotherPccAction.js'))).repriceIn() */
	const addRow = ({pccResult}) => {
		// TODO: ensure adult > child > infant
		const mainPtcBlock = (pccResult.pricingBlockList || [])[0];
		if (!mainPtcBlock) {
			// an error, could show it somewhere probably...
			return;
		}
		const ptc = mainPtcBlock.ptcInfo.ptcRequested || mainPtcBlock.ptcInfo.ptc;
		const fareType = 'TODO';
		const netPrice = mainPtcBlock.fareInfo.totalFare;
		const sign = netPrice.currency === 'USD' ? '$' : netPrice.currency + ' ';
		const netFormatted = sign + netPrice.amount;

		tbodyCmp.attach([Cmp('tr').attach([
			Cmp('td', {textContent: pccResult.pcc}),
			Cmp('td', {textContent: ptc}),
			Cmp('td', {textContent: fareType}),
			Cmp('td.net-price', {textContent: netFormatted}),
			// TODO:
			Cmp('td.net-price', {textContent: ''}),
			Cmp('td.net-price', {textContent: ''}),
		])]);
	};

	const main = () => {
		return {
			dom: rootCmp.context,
			addRow: addRow,
		};
	};

	return main();
};

export default PricePccMixList;