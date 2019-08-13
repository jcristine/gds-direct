module.exports.parseTariffDisplay = result => {
	const output = result.output || '';

	if(output.indexOf('NEED TARIFF DISPLAY') !== -1) {
		return {
			error: 'NEED TARIFF DISPLAY',
		};
	}

	// Depending on previous command $D will return different output
	// required dates in output will be in different positions
	const match = [
		/\$D.{1}(?<dep>\d{2}[A-Z]{3})[A-Z]{6}(?<arr>\d{2}[A-Z]{3})/,
		/\$D[A-Z]+(?<dep>\d{2}[A-Z]{3})(?<arr>\d{2}[A-Z]{3})/,
	].map(r => output.match(r)).filter(r => r)[0];

	const hasMatch = match && match.groups && match.groups.dep
		&& match.groups.arr;

	if(!hasMatch) {
		return {
			success: false,
			error: 'Dates not found in dump',
		};
	}

	return {
		success: true,
		departureDate: match.groups.dep,
		returnDate: match.groups.arr,
	};
};

