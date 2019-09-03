const zlib = require('zlib');

module.exports.compress = (text, dictionary) => {
	return new Promise((resolve, reject) => {
		zlib.deflate(text, {
			dictionary,
			level: zlib.constants.Z_BEST_COMPRESSION,
		}, (error, compressedText) => {
			if (error) {
				return reject(error);
			}

			resolve(compressedText);
		});
	});
};

module.exports.decompress = (archive, dictionary) => {
	return new Promise((resolve, reject) => {
		zlib.inflate(archive, {
			dictionary,
		}, (error, plainText) => {
			if (error) {
				return reject(error);
			}

			resolve(plainText);
		});
	});
};
