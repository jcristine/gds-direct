
const php = require('klesun-node-tools/src/Transpiled/php.js');

exports.checkDumpIsNotExisting = ($dump) => {
	return php.preg_match(/^.{1,2}RESTRICTED.{1,2} \*NOT AA PNR\*\s*$/, php.trim($dump))
		|| php.preg_match(/^.{1,2}ADDR.{1,2}\s*$/, php.trim($dump));
};

exports.checkDumpIsRestricted = ($dump) => {
	return php.preg_match(/^\s*SECURED PNR\s*$/, php.trim($dump));
};