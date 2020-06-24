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
            return { 'url': key, 'errors': [] };
        } else {
            return { 'url': '', 'errors': ['Max capacity'] };
        }
    }

    Storage.prototype.createPasswordRecord = function (data) {
        const date = Date.now();

        const record = {
            'encrypted': data['encrypted'],
            'password': data['password'],
            'max_views_check': data['max_views_check'],
            'max_views': data['max_views'],
            'max_time_check': data['max_time_check'],
            'max_time': new Date(date + (data['max_time'] * TIME_SHIFT_IN_SECONDS))
        };

        return record;
    }

    Storage.prototype.addPasswd = function (data) {
        this.cleanCache();
        const password_record = this.createPasswordRecord(data);
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

    Storage.prototype.checkConditionOnPassword = function (one_pass) {
        if (one_pass.max_views_check === true && one_pass.max_views < 0) {
            return false;
        }
        if (one_pass.max_time_check === true && one_pass.max_time < Date.now()) {
            return false;
        }
        return true;
    }

    Storage.prototype.getPasswd = function (url) {
        //TODO refactor error message
        let one_pass = this.localStorage[url];
        let error_messages = { 'errors': ['Too many views or time expired'] };

        try {
            if (one_pass.max_views_check) {
                one_pass.max_views -= 1;
            }
            if (this.checkConditionOnPassword(one_pass)) {
                return one_pass;
            } else {
                delete this.localStorage[url];
                this.max_passwords -= 1;
                return error_messages;
            }
        } catch (error) {
            return error_messages;
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