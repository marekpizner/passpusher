var express = require('express');
var crypto = require('crypto');

const MAX_PASSWORD = 2;
const TIME_SHIFT_IN_SECONDS = 60000;


var Storage = (function () {

    function Storage() {
        this.localStorage = {};
        this.max_passwords = 0;
    }

    Storage.prototype.savePasswordRecordToStorage = function (password_record) {
        if (this.max_passwords <= MAX_PASSWORD) {
            key = crypto.randomBytes(64).toString('hex');
            this.localStorage[key] = password_record;
            this.max_passwords += 1;
            return { 'url': key, 'error': '' };
        } else {
            return { 'url': '', 'error': 'Max capacity' };
        }
    }

    Storage.prototype.createPasswordRecord = function (password, max_time, max_views) {
        const date = Date.now();

        const record = {
            'password': password,
            'max_time': new Date(date + (max_time * TIME_SHIFT_IN_SECONDS)),
            'max_views': max_views,
        };

        return record;
    }

    Storage.prototype.returnRecord = function () {

    }

    Storage.prototype.addPasswd = function (password, max_time, max_views) {
        this.cleanCache();
        const password_record = this.createPasswordRecord(password, max_time, max_views);
        return this.savePasswordRecordToStorage(password_record);
    };

    Storage.prototype.cleanCache = function () {
        try {
            for (var url in this.localStorage) {
                var value = this.localStorage[url];
                if (value.max_views <= 0 | value.max_time <= Date.now()) {
                    delete this.localStorage[url];
                    this.max_passwords -= 1;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    Storage.prototype.getPasswd = function (url) {
        let one_pass = this.localStorage[url];
        let error_message = { 'error': 'Too many views or time expired' };

        try {
            one_pass.max_views -= 1;
            if (one_pass.max_views > 0 & one_pass.max_time > Date.now()) {
                return one_pass;
            } else {
                delete this.localStorage[url];
                this.max_passwords -= 1;
                return error_message;
            }
        } catch (error) {
            return error_message;
        }
    };

    var instance;

    return function () {
        if (!instance) {
            instance = new Storage();
        }
        return instance;
    };
})();

module.exports = Storage;