
exports.never = () => { throw new Error('Should never happen'); };

/**
 * creates an object with values matching their keys
 * for string constants with IDE completion
 */
exports.StrConsts = (nameToNever, valPrefix = '') => {
	// to avoid explicitly setting value for
	// each constant risking getting a typo
	for (let key in nameToNever) {
		delete nameToNever[key];
		nameToNever[key] = valPrefix + key;
	}
	return nameToNever;
};