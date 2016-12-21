'use strict';

function chunk(arr, limit) {
	let result = [];

	while (arr.length > limit)
	{
		result.push(arr.slice(0, limit));
		arr = arr.slice(limit);
	}

	if (arr.length > 0)
		result.push(arr);

	return result;

}

function substitutePrintableChar(ch)
{
	let sabreLayout = {
		'\'': '‡',
		'[': '¤',
		'=': '*',
		'\\': '§',
	};

	if (sabreLayout[ch])
		return sabreLayout[ch];

	return ch.toUpperCase();
}

function splitLines(txt)
{
	return txt.split(/\r?\n/);
}

function makeCachedParts(txt)
{
	let lines = splitLines(txt);

	return chunk(lines, 20).map(function(sectionLines){
		return sectionLines.join('\n');
	});
}

let Helpers = {
	makeCachedParts 		:	makeCachedParts,
	substitutePrintableChar :	substitutePrintableChar
};

module.exports = Helpers;