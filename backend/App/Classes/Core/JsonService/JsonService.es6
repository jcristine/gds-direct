"use strict";

const request = require('request');
const JsonServiceRequestException = require('./../../../Exceptions/JsonServiceRequestException.es6');

class JsonService {
    constructor() {
        this._url = '';

        this._param = {
            'credentials': {},
            'service'    : '',
            'function'   : '',
            'params'     : {}
        };

        this._validationChencking = {};

        this.debugInfo = {};
    }

    /**
     *
     * @param url
     * @returns {static}
     */
    setUrl(url) {
        this._url = url;
        return this;
    }

    /**
     *
     * @param login
     * @param passwd
     * @param project
     * @returns {static}
     */
    setCredentials(login, passwd, project) {
        this._param.credentials = {login, passwd, project};
        return this;
    }

    /**
     *
     * @param value
     * @returns {static}
     */
    setParams(value) {
        this._param.params = Object.assign({}, this._param.params, value);
        return this;
    }

    /**
     *
     * @returns {static}
     */
    dropParams() {
        this._param.params = '';
        return this;
    }

    /**
     *
     * @param key
     * @param value
     * @returns {static}
     */
    setParam(key, value) {
        this._param.params[key] = value;
        return this;
    }

    /**
     *
     * @param key
     * @returns {static}
     */
    dropParam(key) {
        delete this._param.params[key];
        return this;
    }

    /**
     *
     * @param func
     * @returns {static}
     */
    setMethod(func) {
        this._param.function = func;
        return this;
    }

    /**
     *
     * @param service
     * @returns {static}
     */
    setService(service) {
        this._param.service = service;
        return this;
    }

    /**
     *
     * @returns {{credentials: {}, service: string, function: string, params: {}}}
     * @private
     */
    _collectParams() {
        let params = JSON.parse(JSON.stringify(this._param));
        params.credentials = JSON.stringify(params.credentials);
        params.params = JSON.stringify(params.params);
        return params;
    }

    /**
     *
     * @param callBack
     * @returns {JsonService}
     */
    setSuccessValidationChecking(callBack) {
        this._validationChencking = callBack;
        return this;
    }

    /**
     *
     * @returns {Promise<any>}
     */
    callPromise() {
        return new Promise((resolve, reject) => {
            this.debugInfo = {url: this._url, form: this._param, formSend: this._collectParams()};
            request.post({url: this._url, form: this._collectParams()}, (err, httpResponse, body) => {
                this.debugInfo = Object.assign({}, this.debugInfo, {err, httpResponse, body});
                if (!err && httpResponse.statusCode === 200) {
                    const data = JSON.parse(body);
                    try {
                        this._validationChencking(data);
                    } catch (e) {
                        reject(e);
                    }
                    resolve(data);
                }
                reject(new JsonServiceRequestException(err + ' - ' + httpResponse.statusCode + ' - ' + body));
            });
        });
    }

    /**
     *
     * @param callback
     */
    callWithCallBack(callback) {
        this.debugInfo = {url: this._url, form: this._param, formSend: this._collectParams()};
        request.post({url: this._url, form: this._collectParams()}, (err, httpResponse, body) => {
            this.debugInfo = Object.assign({}, this.debugInfo, {err, httpResponse, body});
            if (!err && httpResponse.statusCode === 200) {
                const data = JSON.parse(body);
                let err;
                if (this._validationChencking && (err = this._validationChencking(data)) === true) {
                    callback(null, data);
                } else {
                    callback(err, data);
                }
            } else {
                callback(err, body);
            }
        });
    }

    /**
     *
     * @param callBack
     * @param usePromise
     * @returns {Promise<any>|static}
     */
    call(callBack, usePromise) {
        if (usePromise) {
            return this.callPromise()
                .then((result) => {
                    return result;
                }, (error) => {
                    return error;
                });
        } else {
            this.callWithCallBack(callBack);
        }
        return this;
    }
}

module.exports = JsonService;