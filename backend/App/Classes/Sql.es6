"use strict";
const mysql  = require('promise-mysql'),
      Config = require('../../Config.es6');

let dbPool = mysql.createPool(Config.db);

module.exports = dbPool;