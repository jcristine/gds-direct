const Fp = require('../Transpiled/Lib/Utils/Fp.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');

/**
 * Galileo does not allow pricing multiple PTC-s
 * at same time when there are no names in PNR. Fix.
 */
exports.withFakeNames = async ({
	session, pricingModifiers, action,
}) => {
	const mods = php.array_combine(php.array_column(
		pricingModifiers, 'type'),
		pricingModifiers);

	const ptcGroups = ((mods['passengers'] || {})['parsed'] || {})['ptcGroups'] || [];
	const paxNums = Fp.flatten(php.array_column(ptcGroups, 'passengerNumbers'));

	let result;
	if (!php.empty(paxNums)) {
		let names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
		names = php.array_slice(names, 0, php.count(paxNums));
		const addCmd = php.implode('|', names.map(($name) => 'N.FAKE/' + $name));
		await session.runCmd(addCmd, false); // add fake names
		result = await action();
		const removeCmd = php.count(paxNums) > 1
			? 'N.P1-' + php.count(names) + '@'
			: 'N.P1@';
		await session.runCmd(removeCmd, false); // remove fake names
	} else {
		result = await action();
	}

	return result;
};