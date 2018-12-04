

exports.matchAll = (pattern, str) => {
	let reg = new RegExp(pattern);
	if (!reg.flags.includes('g')) {
		reg = new RegExp(reg.source, reg.flags + 'g');
	}
	let records = [];
	let matches;
	while((matches = reg.exec(str)) !== null) {
		records.push(matches);
	}
	return records;
};