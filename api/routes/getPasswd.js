var express = require('express');
var Storage = require('../db/local_storage')
var storage = new Storage()

var router = express.Router();

/* GET users listing. */
router.get('/:url', function (req, res, next) {
    var url = req.params['url'];
    var data = storage.getPasswd(url)
    console.log('GETT!!!!!')
    if (data !== undefined) {
        var response = {
            'password': data.password,
            'max_views': data.max_views,
            'error': data.error
        }
    } else {
        var response = { data };
    }
    console.log(response)
    res.send(JSON.stringify(response))
});

module.exports = router;
