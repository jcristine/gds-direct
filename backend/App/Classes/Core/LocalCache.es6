const ConnectionList = require('./../Cache/ConnectionList.es6');
const Sessions = require('./../Cache/Sessions.es6');

class LocalCache {
    constructor() {
        this.connectList = new ConnectionList();
        this.sessions = new Sessions();
    }
}

/**
 *
 * @type {LocalCache}
 */
module.exports = new LocalCache();