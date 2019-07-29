
/**
 * this class provides implementation for
 * each function in the RPC controller
 */
class GdsDirect {
	constructor() {

	}

	static success($result) {
		return {
			'response_code': 1,
			'result': $result,
			'errors': [],
		};
	}
}

GdsDirect.STATUS_EXECUTED = 'executed';
GdsDirect.STATUS_FORBIDDEN = 'forbidden';
GdsDirect.STATUS_SESSION_EXPIRED = 'sessionExpired';
GdsDirect.STATUS_SESSION_LIMIT_REACHED = 'sessionLimitReached';
GdsDirect.MSG_CONSOLE_INFO = 'console_info';
GdsDirect.MSG_CONSOLE_ERROR = 'console_error';
GdsDirect.MSG_POP_UP = 'pop_up';
GdsDirect.GDS_APOLLO = 'apollo';
GdsDirect.GDS_SABRE = 'sabre';


module.exports = GdsDirect;
