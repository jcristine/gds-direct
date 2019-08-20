
const Db = require('../Utils/Db.js');

/**
 * aka "terminal buffering" - temporary storage of system
 * responses to show them when agent refreshes the page
 */
const TABLE = 'cmd_rs_log';

exports.cleanupOutdated = () => {
	// 3 days ago
	const longAgoMs = Date.now() - 3 * 24 * 60 * 60 * 1000;
	const longAgoSec = Math.floor(longAgoMs / 1000);
	return Db.with(db => db.delete({
		table: TABLE,
		where: [['responseTimestamp', '<', longAgoSec]],
	}));
};