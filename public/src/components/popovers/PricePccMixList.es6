
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

	const formatNet = (ptcBlock) => {
		if (!ptcBlock) {
			return '';
		}
		const netPrice = ptcBlock.fareInfo.totalFare;
		const sign = netPrice.currency === 'USD' ? '$' : netPrice.currency + ' ';
		return sign + netPrice.amount;
	};

	/** @param {{gds, pcc}} pccResult = (new (require('RepriceInAnotherPccAction.js'))).repriceIn() */
	const addRow = ({pccResult}) => {
		const ageGroupToBlock = {};
		for (const ptcBlock of pccResult.pricingBlockList || []) {
			const ageGroup = ptcBlock.ptcInfo.ageGroupRequested || ptcBlock.ptcInfo.ageGroup;
			ageGroupToBlock[ageGroup] = ptcBlock;
		}
		const mainPtcBlock =
			ageGroupToBlock.adult ||
			ageGroupToBlock.child ||
			ageGroupToBlock.infant ||
			null;

		if (!mainPtcBlock) {
			// an error, could show it somewhere probably...
			return;
		}
		const ptc = mainPtcBlock.ptcInfo.ptcRequested || mainPtcBlock.ptcInfo.ptc;
		const fareType = 'TODO';

		tbodyCmp.attach([Cmp('tr').attach([
			Cmp('td', {textContent: pccResult.pcc}),
			Cmp('td', {textContent: ptc}),
			Cmp('td', {textContent: fareType}),
			Cmp('td.net-price', {textContent: formatNet(ageGroupToBlock.adult)}),
			Cmp('td.net-price', {textContent: formatNet(ageGroupToBlock.child)}),
			Cmp('td.net-price', {textContent: formatNet(ageGroupToBlock.infant)}),
		])]);
	};

	const finalize = (data) => {
		rootCmp.attach([Cmp('div', {style: 'color: green', textContent: 'Done'})]);
	};

	const main = () => {
		return {
			dom: rootCmp.context,
			addRow: addRow,
			finalize: finalize,
		};
	};

	return main();
};

let priceMixList = null;

PricePccMixList.finalize = (data) => {
	console.debug('ololo finalize', {data, priceMixList});
	if (priceMixList) {
		priceMixList.finalize(data);
	}
	return priceMixList = null;
};

PricePccMixList.displayPriceMixPccRow = (plugin, pccResult) => {
	if (!priceMixList) {
		priceMixList = PricePccMixList();
		const {remove} = plugin.injectDom({
			cls: 'price-mix-pcc-holder',
			dom: priceMixList.dom,
			onCancel: () => {
				remove();
				priceMixList = null;
			},
		});
	}
	priceMixList.addRow(pccResult);
};

export default PricePccMixList;