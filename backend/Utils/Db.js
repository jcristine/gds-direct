const Rej = require('klesun-node-tools/src/Rej.js');

const mysql = require('promise-mysql');
const {getDbConfig} = require('dyn-utils/src/Config.js');
const NotFound = require("klesun-node-tools/src/Rej").NotFound;
const Diag = require('../LibWrappers/Diag.js');
const {SqlUtil} = require('klesun-node-tools');
const {jsExport} = require('klesun-node-tools/src/Utils/Misc.js');
const {coverExc, onDemand} = require('klesun-node-tools/src/Lang.js');

const getPool = onDemand(async () => {
	const cfg = await getDbConfig();
	if (!cfg || !cfg.DB_HOST) {
		return Rej.BadRequest('DB credentials not supplied');
	}
	return mysql.createPool({
		host: cfg.DB_HOST,
		user: cfg.DB_USER,
		password: cfg.DB_PASS,
		database: cfg.DB_NAME,
		port: cfg.DB_PORT || 3306,
		connectionLimit: 20,
		// return datetime as string, not Date object
		dateStrings: true,
	});
});

/**
 * a wrapper for DB connection
 * provides handy methods to make inserts/selects/etc...
 * @param {PoolConnection} dbConn
 */
const Db = (dbConn) => {
	const query = (sql, ...restArgs) => Promise.resolve()
		.then(() => dbConn.query(sql, ...restArgs))
		.catch(exc => {
			exc = exc || new Error('empty mysqljs error');
			exc = typeof exc === 'string' ? new Error(exc) : exc;
			exc.httpStatusCode = Rej.ServiceUnavailable.httpStatusCode;
			exc.message = 'SQL query failed - ' + exc.message;
			exc.sql = sql;
			exc.restArgs = restArgs;
			return Promise.reject(exc);
		});

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
Db.with = async (process) => {
	const dbPool = await getPool();
	const dbConn = await dbPool.getConnection();
	return Promise.resolve()
		.then(() => process(Db(dbConn)))
		.catch(exc => {
			if (exc.httpStatusCode !== NotFound.httpStatusCode) {
				Diag.error('SQL query failed ' + exc, jsExport({
					message: exc.message,
					stack: exc.stack,
					exc: exc,
				}));
			}
			return Promise.reject(exc);
		})
		.finally(() => dbPool.releaseConnection(dbConn));
};

Db.getInfo = async () => {
	const dbPool = await getPool();
	return {
		acquiringConnections: dbPool.pool._acquiringConnections.length,
		allConnections: dbPool.pool._allConnections.length,
		freeConnections: dbPool.pool._freeConnections.length,
		connectionQueue: dbPool.pool._connectionQueue.length,
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
