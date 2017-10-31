const applyProperties = (node, list) => {
	Object.keys(list).map(function (index) {
		if (index === 'style')
		{
			node.setAttribute('style' , list[index]);
		} else
		{
			node[index] = list[index];
		}
	});
};

export default function Dom(str, props = {}) {

	let innerHTML;

	const matches = str.match(/\[(.*?)\]/);

	if (matches)
	{
		innerHTML 	= matches[1];
		str 		= str.replace(`[${innerHTML}]`, '');
	}

	const [node, className] = str.split('.');
	const element 			= document.createElement( node );

	if (className)
		element.className = className;

	if (innerHTML)
		element.innerHTML = innerHTML;

	applyProperties(element, props);
	return element;
};