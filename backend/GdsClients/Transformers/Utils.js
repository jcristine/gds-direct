module.exports.getValueOrNullFromDomElement = (element, tag) => {
	if(!element) {
		return null;
	}

	const valueElement = element.querySelector(tag);

	if(!valueElement) {
		return null;
	}

	return valueElement.textContent;
};