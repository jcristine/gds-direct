"use strict";
const mysql  = require('promise-mysql'),
      Config = require('../../Config.js');

let dbPool = mysql.createPool({
	host: Config.DB_HOST,
	user: Config.DB_USER,
	password: Config.DB_PASS,
	database: Config.DB_NAME,
	port: 3306,
	connectionLimit: 20,
});

module.exports = dbPool;