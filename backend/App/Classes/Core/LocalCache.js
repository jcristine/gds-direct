const ConnectionList = require('./../Cache/ConnectionList.js');
const Sessions = require('./../Cache/Sessions.js');

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