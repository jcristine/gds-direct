'use strict';

class Sessions {
    constructor() {
        this.session = {};
    }

    /**
     *
     * @param key
     * @returns {Sessions}
     */
    remove(key) {
        if (this.session[key]) {
            delete this.session[key];
        }
        return this;
    }
}

module.exports = Sessions;