
// "Rej" stands for "Rejections"
// this module defines shortcuts for classified
// errors to distinct them programmatically
// (to decide whether or not to write it to Diag, for example)

let toReject = (httpStatusCode, isOk = false) => {
	let makeRejection = (msg, data = undefined) => {
		msg += ' (status: ' + httpStatusCode + ')';
		let exc;
		if (!isOk) {
			exc = new Error(msg);
		} else {
			// this is probably faster, and saves you few days of life
			// when you see tons of meaningless stack traces in the log
			exc = {message: msg, toString: () => msg};
		}
		exc.httpStatusCode = httpStatusCode;
		exc.data = data;
		let rejection = Promise.reject(exc);
		rejection.exc = exc;
		return rejection;
	};
	makeRejection.httpStatusCode = httpStatusCode;
	makeRejection.matches = (otherCode) => otherCode == httpStatusCode;
	return makeRejection;
};

let isOk = true;

// non-error responses
exports.NoContent = toReject(204, isOk);

// user errors
exports.BadRequest = toReject(400);
exports.Forbidden = toReject(403, isOk);
exports.NotFound = toReject(404);
exports.Conflict = toReject(409);
// unable to process the requested instructions, I'll use it
// as cannot satisfy in RBS - when GDS returns error and such
exports.UnprocessableEntity = toReject(422);
exports.LoginTimeOut = toReject(440);

// server errors
exports.InternalServerError = toReject(500);
exports.NotImplemented = toReject(501);
exports.BadGateway = toReject(502);

/** handy when you need to filter a value in Promise chain */
exports.nonEmpty = (msg = '(no description)', reject = null) => (value) => {
	reject = reject || exports.NoContent;
	return value ? Promise.resolve(value)
		: reject('Value is empty - ' + msg);
};