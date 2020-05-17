var express = require('express');
var crypto = require('crypto');

var Storage = (function () {
    function Storage() {
        this.localStorage = {};
    }

    getTime = () => {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        return dateTime;
    }

    Storage.prototype.addPasswd = function (password, max_time, max_views) {
        key = crypto.randomBytes(64).toString('hex');
        console.log(key);
        const date = Date.now();
        let one_pass = {
            'password': password,

            'max_time': new Date(date + (max_time * 60000)),

            'max_views': max_views,
        }
        this.localStorage[key] = one_pass;
        return key;
    };

    // Object can have instance methods as usually.
    Storage.prototype.getPasswd = function (url) {
        let one_pass = this.localStorage[url];
        let error_message = { 'error': 'Too many views or time expired' };

        try {
            one_pass.max_views -= 1;
            if (one_pass.max_views > 0 & one_pass.max_time > Date.now()) {
                return one_pass;
            } else {
                delete this.localStorage[url];
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