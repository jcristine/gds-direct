'use strict';

export default function Dom( str ) {

	const [node, className] = str.split('.');
	const element = document.createElement( node );

	if (className)
		element.className = className;

	return element;
};