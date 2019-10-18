const Redis = require('../LibWrappers/Redis.js');

/**
 * often due to system problems, server restarts, etc... some linked redis structures are
 * not fully removed - this script removes the orphaned entities created in such circumstances
 *
 * in a retrospective, probably I should have used some expiration
 * time for all key-value structures instead of using hset
 *
 * maybe just restarting whole redis server would be a more solid solution of data cleanup...
 */
const CleanupRedisKeys = () => {
	const run = async () => {
		const redis = await Redis.getClient();
		// for some reason SESSION_TO_STATE accumulated 10k orphan entries
		// over half year, whereas other structures around 10-20 of them...
		const sessionIds = await redis.hkeys(Redis.keys.SESSION_TO_STATE);
		const promises = sessionIds.map(async sessionId => {
			const accessMs = await redis.zscore(Redis.keys.SESSION_ACTIVES, sessionId);
			if (accessMs === null) {
				return redis.hdel(Redis.keys.SESSION_TO_STATE, sessionId);
			}
		});
		return Promise.all(promises);
	};

	return {
		run: run,
	};
};

exports.run = () => CleanupRedisKeys().run();
