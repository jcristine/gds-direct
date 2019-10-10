const Debug = require('klesun-node-tools/src/Debug.js');
const Rej = require('klesun-node-tools/src/Rej.js');

const {getDbConfig} = require('dyn-utils/src/Config.js');
const {getStaticConfig} = require('../Config.js');
const NotFound = require("klesun-node-tools/src/Rej").NotFound;
const Diag = require('../LibWrappers/Diag.js');
const {SqlUtil} = require('klesun-node-tools');
const {coverExc, onDemand} = require('klesun-node-tools/src/Lang.js');
const ClusterWrapper = require('dynatech-mysql-cluster-wrapper').default;

const getWrapper = onDemand(async () => {
	const staticCfg = getStaticConfig();
	const cfg = await getDbConfig();
	if (!cfg || !cfg.DB_HOST) {
		return Rej.BadRequest('DB credentials not supplied');
	}
	const wrapper = new ClusterWrapper({
		canRetry: true,
		removeNodeErrorCount: 5,
		restoreNodeTimeout: 1000 * 10,
	}, {
		mantisId: staticCfg.mantisId,
	});
	wrapper.configFetch().setSchedule(true);
	wrapper.configFetch().appendDefaultPollConfig({
		connectionLimit: 20,
		// return datetime as string, not Date object
		dateStrings: true,
	});

	return wrapper;
});

/**
 * a wrapper for DB connection
 * provides handy methods to make inserts/selects/etc...
 * @param {PoolConnection} dbConn
 */
const Db = (dbConn) => {
	const query = (sql, ...restArgs) => {
		return new Promise((resolve, reject) => {
			dbConn.query(sql, ...restArgs, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		}).catch(exc => {
			exc = exc || new Error('empty mysqljs error');
			exc = typeof exc === 'string' ? new Error(exc) : exc;
			exc.httpStatusCode = Rej.ServiceUnavailable.httpStatusCode;
			exc.message = 'SQL query failed - ' + exc.message;
			exc.sql = sql;
			exc.restArgs = restArgs;
			return Promise.reject(exc);
		});
	};

	/**
	 * @return {Promise<IPromiseMysqlQueryResult>}
	 */
	const writeRows = (table, rows) => {
		if (rows.length === 0) {
			return Promise.resolve();
		}
		let record;
		try {
			record = SqlUtil.makeInsertQuery({table, rows});
		} catch (exc) {
			return Promise.reject(exc);
		}
		const {sql, placedValues} = record;
		return query(sql, placedValues);
	};

	const update = ({table, set, where}) => {
		const {sql, placedValues} = SqlUtil.makeUpdateQuery({table, set, where});
		return query(sql, placedValues);
	};

	const deleteVar = ({table, where}) => {
		const {sql, placedValues} = SqlUtil.makeDeleteQuery({table, where});
		return query(sql, placedValues);
	};

	/**
	 * usage:
	 * Db(conn).fetchAll(params).then(rows => console.log(rows));
	 * @return Promise
	 */
	const fetchAll = (params) => {
		const {sql, placedValues} = SqlUtil.makeSelectQuery(params);
		return query(sql, placedValues);
	};

	return {
		writeRows: writeRows,
		update: update,
		delete: deleteVar,
		fetchAll: fetchAll,
		fetchOne: params => fetchAll(params)
			.then(rows => rows.length > 0 ? rows[0] :
				NotFound('Could not find ' +
					params.table + ' record in DB ' +
					(params.where ? JSON.stringify(params.where) : ''))),
		// for custom stuff
		query: query,
	};
};

const ReadOnlyDb = (dbConn) => {
	const db = Db(dbConn);
	return {
		fetchAll: db.fetchAll,
		fetchOne: db.fetchOne,
	};
};

const normSqlExc = exc => {
	if (exc.httpStatusCode !== NotFound.httpStatusCode) {
		// Diag.error('SQL query failed ' + exc, Debug.jsExport({
		// 	message: exc.message,
		// 	stack: exc.stack,
		// 	exc: exc,
		// }));
	}
	return Promise.reject(exc);
};

const withMaster = async (process) => {
	const wrapper = await getWrapper();
	const dbConn = await wrapper.getMasterConnection();
	return Promise.resolve()
		.then(() => process(Db(dbConn)))
		.catch(normSqlExc)
		.finally(() => dbConn.release());
};

Db.withMaster = withMaster;
Db.with = withMaster;
Db.withAny = async (process) => {
	const wrapper = await getWrapper();
	const dbConn = await wrapper.getConnection();
	return Promise.resolve()
		.then(() => process(ReadOnlyDb(dbConn)))
		.catch(normSqlExc)
		.finally(() => dbConn.release());
};
Db.withSlave = async (process) => {
	const wrapper = await getWrapper();
	const dbConn = await wrapper.getConnection('SLAVE*');
	return Promise.resolve()
		.then(() => process(ReadOnlyDb(dbConn)))
		.catch(normSqlExc)
		.finally(() => dbConn.release());
};

Db.getInfo = async () => {
	// should probably return this functionality...
	return {
		acquiringConnections: 0,
		allConnections: 0,
		freeConnections: 0,
		connectionQueue: 0,
	};
};

const withRetry = (dbAction) => {
	// retry once, as DB connection pretty often gets closed by server
	const perform = () => Db.with(db => dbAction(db));
	return perform()
		.catch(coverExc([Rej.ServiceUnavailable], perform));
};

Db.fetchAll = (params) => withRetry(db => db.fetchAll(params));
Db.fetchOne = (params) => withRetry(db => db.fetchOne(params));

Db.makeSelectQuery = SqlUtil.makeSelectQuery;

module.exports = Db;
