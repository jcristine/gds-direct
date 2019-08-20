

exports.matchAll = (pattern, str) => {
	let reg = new RegExp(pattern);
	if (!reg.flags.includes('g')) {
		reg = new RegExp(reg.source, reg.flags + 'g');
	}
	const records = [];
	let lastIndex = -1;
	let matches;
	while((matches = reg.exec(str)) !== null) {
		if (lastIndex === reg.lastIndex) {
			throw new Error('Infinite regex due to empty string match at ' + lastIndex + ' - ' + reg + ' - ' + str);
		}
		lastIndex = reg.lastIndex;
		records.push(matches);
	}
	return records;
};