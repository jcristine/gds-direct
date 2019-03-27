
let mysql = require('promise-mysql');
let {getConfig} = require('../Config.js');
const NotFound = require("./Rej").NotFound;
const BadRequest = require("./Rej").BadRequest;
const Diag = require('../LibWrappers/Diag.js');

let whenPool = null;
let getPool = () => {
	if (whenPool === null) {
		whenPool = getConfig().then(cfg => mysql.createPool({
			host: cfg.DB_HOST,
			user: cfg.DB_USER,
			password: cfg.DB_PASS,
			database: cfg.DB_NAME,
			port: cfg.DB_PORT || 3306,
			connectionLimit: 20,
			// return datetime as string, not Date object
			dateStrings: true,
		}));
	}
	return whenPool;
};

/**
 * a wrapper for DB connection
 * provides handy methods to make inserts/selects/etc...
 * @param {PoolConnection} dbConn
 */
let Db = (dbConn) => {
	let query = (...args) => dbConn.query(...args);

	/**
	 * @return {Promise<IPromiseMysqlQueryResult>}
	 */
	let writeRows = ($table, $rows) => {
		if ($rows.length === 0) {
			return Promise.resolve();
		}
		let $colNames = Object.keys($rows[0]);
		let $dataToInsert = [];
		for (let $i = 0; $i < $rows.length; ++$i) {
			let $row = $rows[$i];
			for (let $colName of $colNames) {
				if ($colName in $row) {
					let value = $row[$colName];
					let primitives = ['string', 'number', 'boolean', 'undefined'];
					if (!primitives.includes(typeof value) && value !== null) {
						return BadRequest('Invalid insert value on key `' + $colName + '` in the ' + $i + '-th row - ' + (typeof value));
					} else {
						$dataToInsert.push(value);
					}
				} else {
					return BadRequest('No key `' + $colName + '` in the ' + $i + '-th row required to insert many');
				}
			}
		}

		// setup the placeholders - a fancy way to make the long "(?, ?, ?)..." string
		let $rowPlaces = '(' + new Array($colNames.length).fill('?').join(', ') + ')';
		let $allPlaces = new Array($rows.length).fill($rowPlaces).join(', ');

		let $sql = [
			'INSERT',
			'INTO ' + $table + ' (' + $colNames.join(', ') + ')',
			'VALUES ' + $allPlaces,
			'ON DUPLICATE KEY UPDATE ' + $colNames
				.map(($colName) => $colName + ' = VALUES(' + $colName + ')')
				.join(', '),
		].join('\n');

		return query($sql, $dataToInsert);
	};

	/**
	 * @param {{
	 *     table: 'cmd_rq_log',
	 *     where?: [
	 *         ['gds', '=', 'apollo'],
	 *         ['terminalNumber', '=', '2'],
	 *     ],
	 *     whereOr?: [
	 *         [['rbsSessionId', '=', '12345']],
	 *         [['gdsSessionDataMd5', '=', 'abcvsdadadajwnekjn']],
	 *     ],
	 *     orderBy?: 'id DESC',
	 *     skip?: '0',
	 *     limit?: '100',
	 * }} params
	 * will generate:
	 *   SELECT * FROM terminalBuffering
	 *   WHERE gds = 'apollo' AND terminalNumber = '2'
	 *     AND (rbsSessionId = '12345' OR gdsSessionDataMd5 = 'abcvsdadadajwnekjn')
	 *   ORDER BY id DESC
	 *   LIMIT 0, 100
	 * usage:
	 * Db(conn).fetchAll(params).then(rows => console.log(rows));
	 * @return Promise
	 */
	let fetchAll = (params) => {
		let {
			table, where = [], whereOr = [], orderBy = null,
			limit = null, skip = null,
		} = params;
		let makeConds = ands => ands.map(([col, operator]) =>
			'`' + col + '` ' + operator + ' ?').join(' AND ');
		let sql = [
			`SELECT * FROM ${table}`,
			`WHERE TRUE`,
			where.length === 0 ? '' :
				'AND ' + makeConds(where),
			whereOr.length === 0 ? '' :
				'AND (' + (whereOr.map(or => makeConds(or)).join(' OR ')) + ')',
			!orderBy ? '' : `ORDER BY ` + orderBy,
			!limit ? '' : `LIMIT ` + (+skip ? +skip + ', ' : '') + +limit,
		].join('\n');

		let placedValues = [].concat(
			where
				.map(([col, op, val]) => val),
			whereOr.map(or => or
				.map(([col, op, val]) => val))
				.reduce((a,b) => a.concat(b), []),
		);
		return query(sql, placedValues);
	};

	return {
		writeRows: writeRows,
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
	let dbPool = await getPool();
	let dbConn = await dbPool.getConnection();
	return Promise.resolve()
		.then(() => process(Db(dbConn)))
		.catch(exc => {
			if (exc.httpStatusCode !== NotFound.httpStatusCode) {
				Diag.error('SQL query failed ' + exc, {
					message: exc.message,
					stack: exc.stack,
					exc: exc,
				});
			}
			return Promise.reject(exc);
		})
		.finally(() => dbPool.releaseConnection(dbConn));
};

Db.getInfo = async () => {
	let dbPool = await getPool();
	return {
		acquiringConnections: dbPool.pool._acquiringConnections.length,
		allConnections: dbPool.pool._allConnections.length,
		freeConnections: dbPool.pool._freeConnections.length,
		connectionQueue: dbPool.pool._connectionQueue.length,
	};
};

module.exports = Db;