const config = require('../local.config.conf');


class Config {

    get production() {
        return this._production;
    }

    get db() {
        return this._db;
    }

    constructor() {
        this._production = config.production || false;
        this._db = Object.assign({}, {
            host           : '',
            user           : '',
            password       : '',
            database       : '',
            port           : '',
            connectionLimit: '',
        }, config.db);
    }
}

module.exports = new Config();
