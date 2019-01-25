"use strict";

const JsonService                 = require('../../Classes/Core/JsonService/JsonService.js'),
      Config                      = require('./../../../Config.js'),
      LocalCache                  = require('../../Classes/Core/LocalCache.js'),
      JsonServiceRequestException = require('./../../Exceptions/JsonServiceRequestException.js');

class Emc extends JsonService {
    constructor() {
        super();
        this.SESSION_EXPIRE = 60 * 10 * 1000;

        if (Config.production) {
            this.setUrl('http://auth-asaptickets-com.lan.dyninno.net/jsonService.php');
            this.setCredentials('cmschat', '9djtDELLFv9sZEA2a3H4sgra', 'CMS_CHAT');
        } else {
            this.setUrl('http://auth.gitlab-runner.snx702.dyninno.net/jsonService.php');
            this.setCredentials('cmschat', 'qwerty', 'CMS_CHAT');
        }

        //Helper.debugLog('EMC url: ' + this._url);
        this.setService('014');
        this.setSuccessValidationChecking(this._jsonValidation);
    }

    /**
     *
     * @param jsonData
     * @returns {boolean}
     * @private
     */
    _jsonValidation(jsonData) {
        if (jsonData.status !== 'OK') {
            throw new JsonServiceRequestException('Problems with status');
        }
        if (jsonData.result && jsonData.result.errorMessage) {
            throw new JsonServiceRequestException('Service return error: ' + jsonData.result.errorMessage);
        }
        return true;
    }

    /**
     *
     * @returns {Promise<any>|static}
     */
    getAllUsers() {
        this.setMethod('getUsers');
        return this.callPromise();
    }

    /**
     *
     * @param sessionKey
     * @returns {Promise<any>|static}
     */
    getSessionInfo(sessionKey) {
        this.setMethod('sessionInfo');
        this.setParam('sessionKey', sessionKey);
        return this.callPromise();
    }

    /**
     *
     * @param sessionKey
     * @returns {*}
     */
    getCachedSessionInfo(sessionKey) {
        if (LocalCache.sessions && LocalCache.sessions['session'] && LocalCache.sessions.session[sessionKey]) {
            const session = LocalCache.sessions.session[sessionKey];
            if (session.time.getTime() > (new Date()).getTime() - this.SESSION_EXPIRE) {
                return Promise.resolve(session.data);
            }
        }
        return this.getSessionInfo(sessionKey)
            .then(data => {
                LocalCache.sessions.session[sessionKey] = {time: new Date(), data: data};
                return data;
            });
    }

    /**
     *
     * @param sessionKey
     * @param ipAddress
     * @returns {Promise<any>|static}
     */
    doAuth(sessionKey, ipAddress) {
        this.setMethod('doAuth');
        this.setParam('sessionKey', sessionKey);
        this.setParam('id', ipAddress);
        return this.callPromise();
    }

    /**
     *
     * @returns {Promise<any>|static}
     */
    getTeams() {
        this.setMethod('getTeams');
        return this.callPromise();
    }

    /**
     *
     * @returns {Promise<any>}
     */
    getCompanies() {
        this.setMethod('getCompanies');
        return this.callPromise();
    }

    /**
     *
     * @returns {Promise<any>}
     */
    getTeamMainSupervisors() {
        this.setMethod('getTeamMainSupervisors');
        return this.callPromise();

    }
}

module.exports = Emc;