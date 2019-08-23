
import {post} from "../../helpers/requests.es6";
import Component from '../../modules/component.es6';
import {CHANGE_GDS} from '../../actions/gdsActions.es6';

const Cmp = (...args) => new Component(...args);

/**
 * @param {GdsSwitch} gdsSwitch
 * @param {TerminalPlugin} plugin
 */
const PricePccMixList = ({
	plugin, itinerary, processes, cmdRqId,
}) => {
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
	const tbodyCmp = Cmp('tbody').attach(processes
		.map(({gds, pcc, pricingCmd}) => {
			const trCmp = Cmp('tr').attach([
				Cmp('td.gds', {textContent: gds}),
				Cmp('td.pcc', {textContent: pcc, title: pricingCmd}),
			]);
			trCmp.context.setAttribute('data-gds', gds);
			trCmp.context.setAttribute('data-pcc', pcc);
			trCmp.context.setAttribute('data-cmd', pricingCmd);
			return trCmp;
		}));
	const rootCmp = Cmp('div.price-pcc-mix-list').attach([
		Cmp('table').attach([theadCmp, tbodyCmp]),
	]);
	let pendingLeft = processes.length;

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
		const trs = [...tbodyCmp.context.querySelectorAll(':scope > tr')];
		for (const tr of trs) {
			const oldPrice = tr.getAttribute('data-net-price');
			if (!oldPrice) {
				return tr;
			} else if (+oldPrice > +newPrice) {
				return tr;
			}
		}
		return null;
	};

	const finalize = () => {
		delete cmdRqToList[cmdRqId];
		rootCmp.attach([Cmp('div', {style: 'color: green', textContent: 'Done'})]);
	};

	const populateRow = (pccResult, trCmp) => {
		const {gds, pcc, pricingCmd, pricingBlockList = [], calledCommands = []} = pccResult;

		const ageGroupToBlock = {};
		for (const ptcBlock of pricingBlockList) {
			const ageGroup = ptcBlock.ptcInfo.ageGroupRequested || ptcBlock.ptcInfo.ageGroup;
			ageGroupToBlock[ageGroup] = ptcBlock;
		}
		const mainPtcBlock =
			ageGroupToBlock.adult ||
			ageGroupToBlock.child ||
			ageGroupToBlock.infant ||
			null;

		const ptc = mainPtcBlock.ptcInfo.ptcRequested || mainPtcBlock.ptcInfo.ptc;
		const pricingDump = calledCommands
			.map(({cmd, output}) => '>' + cmd + ';\n' + output)
			.join('\n');

		const goToPricing = () => {
			plugin._withSpinner(() => post('terminal/goToPricing', {
				gds: plugin.gdsName, useSocket: true,
				pricingGds: gds,
				pricingPcc: pcc,
				pricingCmd: pricingCmd,
				itinerary: itinerary,
			})).then((cmdResult) => {
				const gdsUnit = CHANGE_GDS(gds);
				gdsUnit.getActiveTerminal()
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

		trCmp.attach([
			Cmp('td').attach([
				Cmp('span', {textContent: ptc, title: pricingCmd}),
			]),
			Cmp('td').attach([
				Cmp('span', {textContent: mainPtcBlock.fareType}),
			]),
			makeNetCell(ageGroupToBlock.adult),
			makeNetCell(ageGroupToBlock.child),
			makeNetCell(ageGroupToBlock.infant),
		]);
		trCmp.context.setAttribute('data-net-price', mainPtcBlock.fareInfo.totalFare.amount);

		trCmp.context.remove();
		const firstHigher = findFirstHigherThan(trCmp.context);
		if (firstHigher) {
			firstHigher.parentNode.insertBefore(trCmp.context, firstHigher);
		} else {
			tbodyCmp.attach([trCmp]);
		}
	};

	/** @param {{gds, pcc}} pccResult = (new (require('RepriceInAnotherPccAction.js'))).repriceIn() */
	const addRow = ({pccResult}) => {
		console.debug('pccResult', pccResult);

		const {gds, pcc, rulePricingCmd, pricingBlockList = []} = pccResult;
		const error = pccResult.error || (pricingBlockList.length ? null : 'No pricing returned');

		const selector = ':scope > tr[data-gds="' + gds + '"][data-pcc="' + pcc + '"]:not(.filled)';
		const tr = [...tbodyCmp.context.querySelectorAll(selector)]
			.filter(tr => tr.getAttribute('data-cmd') === rulePricingCmd)[0];
		const trCmp = Cmp({context: tr});

		if (error) {
			trCmp.attach([
				Cmp('td.error', {colSpan: 5, textContent: error.slice(0, 300).replace('\n', ' - ')}),
			]);
		} else {
			populateRow(pccResult, trCmp);
		}
		trCmp.context.classList.toggle('filled', true);

		if (--pendingLeft <= 0) {
			finalize();
		}
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

const cmdRqToList = {};

PricePccMixList.initialize = (plugin, data) => {
	const {itinerary, cmdRqId, processes} = data;
	const priceMixList = PricePccMixList({
		plugin, itinerary, processes, cmdRqId,
	});
	cmdRqToList[cmdRqId] = priceMixList;
	const {remove} = plugin.injectDom({
		cls: 'price-mix-pcc-holder',
		dom: priceMixList.dom,
		onCancel: () => remove(),
	});
};

PricePccMixList.displayPriceMixPccRow = (pccResult) => {
	cmdRqToList[pccResult.cmdRqId].addRow(pccResult);
};

export default PricePccMixList;