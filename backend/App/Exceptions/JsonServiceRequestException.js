"use strict";

class JsonServiceRequestException extends URIError{
    constructor(message, ...params) {
        super(...params);
        this.parentName = this.name;
        this.name = this.constructor.name;
        this.message = message;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, JsonServiceRequestException);
        }
        this.date = new Date();
    }
}

module.exports = JsonServiceRequestException;