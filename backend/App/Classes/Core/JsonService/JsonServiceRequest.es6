"use strict";

class JsonServiceRequest {
    constructor(req) {
        this._credentials = {};
        this._functionName = '';
        this._serviceName = '';
        this._params = {};
        this.__location_debug_info = {};
        this._raw = Object.keys(req.body).length > 0 ? req.body : req.query;

        this.parse();
    }

    parse() {
        this._credentials = JSON.parse(this._raw.credentials);
        this._functionName = this._raw.functionName;
        this._serviceName = this._raw.serviceName;
        this._params = JSON.parse(this._raw.params);
        this.__location_debug_info = JSON.parse(this._raw._location_debug_info);
    }

    /**
     *
     * @returns {{credentials: ({}|*), functionName: ({}|*), serviceName: ({}|*), params: ({}|*), _location_debug_info: ({}|*)}}
     */
    get() {
        return {
            credentials         : this._credentials,
            functionName        : this._functionName,
            serviceName         : this._serviceName,
            params              : this._params,
            _location_debug_info: this.__location_debug_info
        };
    }
}

module.exports = JsonServiceRequest;
