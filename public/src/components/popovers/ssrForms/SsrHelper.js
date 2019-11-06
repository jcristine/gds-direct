import {DEV_CMD_STACK_RUN} from "../../../actions";
import Dom from "../../../helpers/dom";

const SsrHelper = () => {
	const formatNameNum = (nameNumber) => {
		const {fieldNumber, firstNameNumber, isInfant} = nameNumber;
		return fieldNumber + '.' + (isInfant ? 'I/' : '') + firstNameNumber;
	};

	const saveChanges = (gds) => {
		const cmd = {
			apollo: 'R:GRECT|ER',
			sabre: '6GRECT§ER',
			galileo: 'R.GRECT|ER',
			amadeus: 'RFGRECT;ER',
		}[gds];
		DEV_CMD_STACK_RUN(cmd);
	};

	const cancelOldSsrs = (deleteSsrs, gds) => {
		if (deleteSsrs.length > 0) {
			const nums = deleteSsrs.map(ssr => ssr.lineNumber);
			const cmd = {
				apollo: 'C:' + nums.join('*') + '¤:3',
				// cancel SSR-s from end so following line numbers were not affected
				sabre: deleteSsrs
					.sort((a,b) => b.lineNumber - a.lineNumber)
					.map(ssr => (ssr.isForAmericanAirlines ? '4' : '3') + ssr.lineNumber + '¤')
					.join('§'),
				// not sure if in galileo should be sorted backwards as well...
				galileo: nums
					.map(n => 'SI.' + n + '@')
					.join('|'),
				amadeus: 'XE' + nums.join(','),
			}[gds];
			DEV_CMD_STACK_RUN(cmd);
		}
	};

	const makePaxNumSelect = (paxes, pax = null) => {
		const abs = !pax ? null : pax.nameNumber.absolute;
		return Dom('select', {name: 'nameNumber'}, paxes
			.map(p => p.nameNumber)
			.map(numRec => Dom('option', {
				textContent: SsrHelper().formatNameNum(numRec),
				value: JSON.stringify(numRec),
				required: 'required',
				...(abs == numRec.absolute ? {selected: 'selected'} : {}),
			})));
	};

	return {
		formatNameNum,
		saveChanges,
		cancelOldSsrs,
		makePaxNumSelect,
	};
};

export default SsrHelper;
