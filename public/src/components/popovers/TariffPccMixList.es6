
import {post} from "../../helpers/requests.es6";
import Component from '../../modules/component.es6';
import {CHANGE_GDS} from '../../actions/gdsActions.es6';

const Cmp = (...args) => new Component(...args);

/**
 * @param {TerminalPlugin} plugin
 */
const TariffPccMixList = ({
	plugin,
}) => {
	const theadCmp = Cmp('thead.usedCommand').attach([
		Cmp('tr').attach([
			Cmp('th', {textContent: 'CX'}),
			Cmp('th', {textContent: 'FARE'}),
			Cmp('th', {textContent: 'RT'}),
			Cmp('th', {textContent: 'BASIS'}),
			Cmp('th', {textContent: 'C'}),
			Cmp('th', {textContent: 'PCC'}),
		]),
	]);
	const tbodyCmp = Cmp('tbody');
	const rootCmp = Cmp('div.tariff-pcc-mix-list').attach([
		Cmp('h3[Preview]'),
		Cmp('table').attach([theadCmp, tbodyCmp]),
	]);

	const addRow = ({pccResult}) => {
		const bestFare = pccResult.jobResult.result.fares[0] || {};
		tbodyCmp.attach([
			Cmp('tr').attach([
				Cmp('td', {textContent: bestFare.airline || ''}),
				Cmp('td', {textContent: bestFare.fare || ''}),
				Cmp('td', {textContent: bestFare.isRoundTrip ? 'R' : ''}),
				Cmp('td', {textContent: bestFare.fareBasis || ''}),
				Cmp('td', {textContent: bestFare.bookingClass || ''}),
				Cmp('td', {textContent: pccResult.pcc}),
			]),
		]);
	};

	return {
		dom: rootCmp.context,
		addRow: addRow,
	};
};

const cmdRqToList = {};
const cmdRqToRemove = {};

const initialize = (plugin, cmdRqId) => {
	const tariffMixList = TariffPccMixList({plugin});
	const {remove} = plugin.injectDom({
		cls: 'tariff-mix-pcc-holder',
		dom: tariffMixList.dom,
		onCancel: () => remove(),
	});
	cmdRqToRemove[cmdRqId] = remove;
	return tariffMixList;
};

TariffPccMixList.displayTariffMixPccRow = (plugin, data) => {
	if (!cmdRqToList[data.cmdRqId]) {
		cmdRqToList[data.cmdRqId] = initialize(plugin, data.cmdRqId);
	}
	cmdRqToList[data.cmdRqId].addRow(data);
};

TariffPccMixList.finalize = (plugin, data) => {
	const remove = cmdRqToRemove[data.cmdRqId];
	delete cmdRqToList[data.cmdRqId];
	delete cmdRqToRemove[data.cmdRqId];
	if (remove) {
		remove();
	}
};

export default TariffPccMixList;
