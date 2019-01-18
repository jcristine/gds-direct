
// "Rej" stands for "Rejections"
// this module defines shortcuts for classified
// errors to distinct them programmatically
// (to decide whether or not to write it to Diag, for example)

let toReject = (httpStatusCode, isOk = false) => {
	let makeRejection = (msg) => {
		msg += ' ' + httpStatusCode;
		let exc;
		if (!isOk) {
			exc = new Error(msg);
		} else {
			// this is probably faster, and saves you few days of life
			// when you see tons of meaningless stack traces in the log
			exc = {message: msg, toString: () => msg};
		}
		exc.httpStatusCode = httpStatusCode;
		return Promise.reject(exc);
	};
	makeRejection.httpStatusCode = httpStatusCode;
	makeRejection.matches = (otherCode) => otherCode == httpStatusCode;
	return makeRejection;
};

let isOk = true;

// non-error responses
exports.NoContent = toReject(204, isOk);

// user errors
exports.Forbidden = toReject(403, isOk);
exports.NotFound = toReject(404);
exports.Conflict = toReject(409);

// server errors
exports.NotImplemented = toReject(501);