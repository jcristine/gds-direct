
import {post} from "../../helpers/requests.es6";
import Component from '../../modules/component.es6';
import {CHANGE_GDS} from '../../actions/gdsActions.es6';

const Cmp = (...args) => new Component(...args);

/**
 * @param {GdsSwitch} gdsSwitch
 * @param {TerminalPlugin} plugin
 */
const PricePccMixList = ({gdsSwitch, plugin}) => {
	const theadCmp = Cmp('thead.usedCommand').attach([
		Cmp('tr').attach([
			Cmp('th', {textContent: 'GDS'}),
			Cmp('th', {textContent: 'PCC'}),
			Cmp('th', {textContent: 'PTC'}),
			Cmp('th', {textContent: 'Fare Type'}),
			Cmp('th', {textContent: 'ADT'}),
			Cmp('th', {textContent: 'CHD'}),
			Cmp('th', {textContent: 'INF'}),
		]),
	]);
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

	const findFirstHigherThan = (newTr) => {
		const newPrice = newTr.getAttribute('data-net-price');
		const trs = [...tbodyCmp.context.querySelectorAll(':scope > tr[data-net-price]')];
		for (const tr of trs) {
			const oldPrice = tr.getAttribute('data-net-price');
			if (+oldPrice > +newPrice) {
				return tr;
			}
		}
		return null;
	};

	/** @param {{gds, pcc}} pccResult = (new (require('RepriceInAnotherPccAction.js'))).repriceIn() */
	const addRow = ({pccResult}) => {
		console.debug('pccResult', pccResult);

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
		const pricingDump = (pccResult.calledCommands || [])
			.map(({cmd, output}) => '>' + cmd + ';\n' + output)
			.join('\n');

		const goToPricing = () => {
			plugin._withSpinner(() => post('terminal/goToPricing', {
				gds: plugin.gdsName, useSocket: true,
				pricingGds: pccResult.gds,
				pricingPcc: pccResult.pcc,
				pricingCmd: pccResult.pricingCmd,
				itinerary: pccResult.itinerary,
			})).then((cmdResult) => {
				CHANGE_GDS(pccResult.gds);
				gdsSwitch.getGds(pccResult.gds).getActiveTerminal()
					.plugin.parseBackEnd(cmdResult, 'GOTOPRICEMIX');
			});
		};
		const makeNetCell = ptcBlock => Cmp('td.net-price').attach([
			Cmp('span', {
				textContent: formatNet(ptcBlock),
				title: pricingDump,
				onclick: goToPricing,
			}),
		]);

		const trCmp = Cmp('tr').attach([
			Cmp('td').attach([
				Cmp('span', {textContent: pccResult.gds}),
			]),
			Cmp('td.pcc').attach([
				Cmp('span', {textContent: pccResult.pcc}),
			]),
			Cmp('td').attach([
				Cmp('span', {textContent: ptc, title: pccResult.pricingCmd}),
			]),
			Cmp('td').attach([
				Cmp('span', {textContent: mainPtcBlock.fareType}),
			]),
			makeNetCell(ageGroupToBlock.adult),
			makeNetCell(ageGroupToBlock.child),
			makeNetCell(ageGroupToBlock.infant),
		]);
		trCmp.context.setAttribute('data-net-price', mainPtcBlock.fareInfo.totalFare.amount);

		const firstHigher = findFirstHigherThan(trCmp.context);
		if (firstHigher) {
			firstHigher.parentNode.insertBefore(trCmp.context, firstHigher);
		} else {
			tbodyCmp.attach([trCmp]);
		}
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
	if (priceMixList) {
		priceMixList.finalize(data);
	}
	return priceMixList = null;
};

PricePccMixList.displayPriceMixPccRow = (gdsSwitch, plugin, pccResult) => {
	if (!priceMixList) {
		priceMixList = PricePccMixList({gdsSwitch, plugin});
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