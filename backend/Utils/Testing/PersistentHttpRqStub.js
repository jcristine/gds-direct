
/**
 * behaves same way as PersistentHttpRq.js, but instead of making
 * actual HTTP requests, it takes next predefined rq/rs pair from
 * passed values, checks that rq body matches and returns the rs body
 *
 * intended for testing GDS XML actions mixed with simple terminal session commands
 *
 * @param {{rq: string, rs: string}[]} httpRequests
 */
const PersistentHttpRqStub = (httpRequests, normalizer = normalizeXmlBody) => {
	let i = 0;
	const PersistentHttpRq = ({url, headers, body}) => {
		const nextResult = httpRequests.shift();
		if (!nextResult) {
			throw new Error('Tried to make http request when all stub values were exhausted: ' + url + '\n' + body);
		} else if (normalizer(body) !== normalizer(nextResult.rq)) {
			throw new Error('Tried to make unexpected ' + i + '-th http request ' + url + '.\nExpected:\n' + nextResult.rq + '\nActual:\n' + body);
		} else {
			++i;
			return Promise.resolve({
				headers: {},
				body: nextResult.rs,
			});
		}
	};
	PersistentHttpRq.getHttpRequestsLeft = () => httpRequests;
	return PersistentHttpRq;
};

// Remove all white spaces that are in the request body without affecting structure
// so that you don't have to construct exactly same string to match the fixture
const normalizeXmlBody = body => body
	.replace(/>\s+</gm, '><')
	.replace(/^\s+/gm, '')
	.replace(/\s+$/gm, '')
	.replace(/([a-zA-Z0-9:]+={0,1}("[^\s]+"){0,1})\s+/gm, '$1 '); //for atribute values

module.exports = PersistentHttpRqStub;
