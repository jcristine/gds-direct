
import Component from '../../modules/component.es6';
const Cmp = (...args) => new Component(...args);

const PricePccMixList = () => {
	const tbodyCmp = Cmp('tbody');
	const tableCmp = Cmp('table').attach(tbodyCmp);
	tableCmp.attach(Cmp('thead').attach([Cmp('tr').attach([
		Cmp('th', {textContent: 'PCC'}),
		Cmp('th', {textContent: 'PTC'}),
		Cmp('th', {textContent: 'Fare Type'}),
		Cmp('th', {textContent: 'ADT'}),
		Cmp('th', {textContent: 'CHD'}),
		Cmp('th', {textContent: 'INF'}),
	])]));

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
		const sign = netPrice.currency === 'USD' ? '$' : netPrice.currency;
		const netFormatted = sign + netPrice.amount;

		tbodyCmp.attach([Cmp('tr').attach([
			Cmp('td', {textContent: pccResult.pcc}),
			Cmp('td', {textContent: ptc}),
			Cmp('td', {textContent: fareType}),
			Cmp('td', {textContent: netFormatted}),
			// TODO:
			Cmp('td', {textContent: ''}),
			Cmp('td', {textContent: ''}),
		])]);
	};

	const main = () => {
		return {
			dom: tableCmp.context,
			addRow: addRow,
		};
	};

	return main();
};

export default PricePccMixList;