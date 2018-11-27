'use strict';

class JsonServiceResponse {
    constructor() {
        this._result = {};
        this._status = '';
        this._debug = [];

        this.setStatus('OK')
    }

    /**
     *
     * @param result
     * @returns {JsonServiceResponse}
     */
    setResults(result) {
        this._result.data = result;
        return this;
    }

    /**
     *
     * @param status
     * @returns {JsonServiceResponse}
     */
    setStatus(status) {
        this._status = status;
        return this;
    }

    /**
     *
     * @param str
     * @returns {JsonServiceResponse}
     */
    setAppendDebugMessage(str) {
        this._debug.push(str);
        return this;
    }

    /**
     *
     * @param exception
     * @returns {JsonServiceResponse}
     */
    setException(exception) {
        return this.setErrorMessage(exception.message);
    }

    /**
     *
     * @param message
     * @returns {JsonServiceResponse}
     */
    setErrorMessage(message) {
        this._result.errorMessage = message;
        return this;
    }

    /**
     *
     * @returns {{status: string, result: {}}}
     */
    getResponse() {
        if (this._debug.length) {
            this._result['debug'] = this._debug;
        }
        return {
            'status': this._status,
            'result': this._result
        };
    }
}

module.exports = JsonServiceResponse;