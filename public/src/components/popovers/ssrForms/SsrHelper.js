import {DEV_CMD_STACK_RUN} from "../../../actions";

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

	return {
		formatNameNum,
		saveChanges,
	};
};

export default SsrHelper;
