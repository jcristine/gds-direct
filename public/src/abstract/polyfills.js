Array.prototype.flatMap = Array.prototype.flatMap
	|| function(flatten) {
		const result = [];
		for (const el of this) {
			const chunk = flatten(el);
			result.push(...chunk);
		}
		return result;
	};
