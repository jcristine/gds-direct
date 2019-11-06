
// for Date class to interpret '2019-01-15 00:00:00' as
// UTC and to return UTC days of week, hours, etc...
process.env.TZ = 'UTC';

// adds some must-have es6+ methods to prototypes, possibly should
// use some lib here if amount of these functions surpasses 1...

Array.prototype.flatMap = function(flatten) {
	const result = [];
	for (let i = 0; i < this.length; ++i) {
		const el = this[i];
		const chunk = flatten(el, i);
		result.push(...chunk);
	}
	return result;
};
