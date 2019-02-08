
exports.hrtimeToDecimal = (hrtime) => {
	let [seconds, nanos] = hrtime;
	let rest = ('0'.repeat(9) + nanos).slice(-9);
	return seconds + '.' + rest;
};

exports.chunk = (arr, size) => {
	let chunks = [];
	for (let i = 0; i < arr.length; i += size) {
		chunks.push(arr.slice(i, i + size));
	}
	return chunks;
};

let jsExport = function($var, $margin, inlineLimit) {
    "use strict";
    var ind = '    ';
    $margin = $margin || '';
    inlineLimit = inlineLimit || 64;

    if ($var === undefined) {
        return 'undefined';
    }

    return JSON.stringify($var).length < inlineLimit ? JSON.stringify($var)
        : Array.isArray($var)
            ? '[\n'
                + $var.map((el) => $margin + ind + jsExport(el, $margin + ind, inlineLimit)).join(',\n')
                + '\n' + $margin + ']'
        : (typeof $var === 'object' && $var !== null)
            ? '{\n'
                + Object.keys($var).map(k => $margin + ind + JSON.stringify(k) + ': ' + jsExport($var[k], $margin + ind, inlineLimit)).join(',\n')
                + '\n' + $margin + '}'
        : (typeof $var === 'string' && $var.indexOf('\n') > -1)
            ? jsExport($var.split('\n'), $margin) + '.join("\\n")'
        : JSON.stringify($var);
};

/**
 * similar to JSON.stringify, but shows multi-line strings
 * as ['...', '...'].join('\n') and prints small objects inline
 */
exports.jsExport = ($var, $margin = null, inlineLimit = 64) =>
	jsExport($var, $margin, inlineLimit);