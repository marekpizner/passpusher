var express = require('express');
var Storage = require('../db/local_storage')
var storage = new Storage()

var router = express.Router();

/* GET users listing. */
router.get('/:url', function (req, res, next) {
    var url = req.params['url'];
    var data = storage.getPasswd(url);

    if (data !== undefined) {
        res.send(JSON.stringify(data));
    } else {
        var err = new Error('Not found');
        err.status = 404;
        return next(err);
    }
});

module.exports = router;
