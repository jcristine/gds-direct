'use strict';

export default function Dom( str ) {

	let innerHTML;

	const matches = str.match(/\[(.*?)\]/);

	if (matches)
	{
		innerHTML = matches[1];
		str = str.replace(`[${innerHTML}]`, '');
	}

	const [node, className] = str.split('.');
	const element = document.createElement( node );

	if (className)
		element.className = className;

	if (innerHTML)
	{
		element.innerHTML = innerHTML;
	}

	return element;
};