
let dbPool = require('../App/Classes/Sql.es6');

/**
 * a wrapper for DB connection
 * provides handy methods to make inserts/selects/etc...
 * @param {PoolConnection} dbConn
 */
let Db = (dbConn) => {
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
						return Promise.reject('Invalid insert value on key `' + $colName + '` in the ' + $i + '-th row - ' + (typeof value));
					} else {
						$dataToInsert.push(value);
					}
				} else {
					return Promise.reject('No key `' + $colName + '` in the ' + $i + '-th row required to insert many');
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

		return dbConn.query($sql, $dataToInsert);
	};

	/**
	 * @param {{
	 *     table: 'terminalBuffering',
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
		return dbConn.query(sql, placedValues);
	};

	return {
		writeRows: writeRows,
		fetchAll: fetchAll,
		fetchOne: params => fetchAll(params)
			.then(rows => rows.length > 0 ? rows[0] :
				Promise.reject('Could not find ' +
					params.table + ' record in DB')),
		// for custom stuff
		query: (...args) => dbConn.query(...args),
	};
};
Db.with = (process) => dbPool.getConnection()
	.then(dbConn => Promise.resolve()
		.then(() => process(Db(dbConn)))
		.then(result => {
			dbPool.releaseConnection(dbConn);
			return result;
		})
		.catch(exc => {
			dbPool.releaseConnection(dbConn);
			return Promise.reject(exc);
		})
	);

module.exports = Db;