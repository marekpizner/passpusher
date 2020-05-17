var express = require('express');
var Storage = require('../db/local_storage')
var storage = new Storage()

var router = express.Router();

/* GET users listing. */
router.get('/:passwd/:max_views/:max_time', function (req, res, next) {
  var passwd = req.params['passwd'];
  var max_views = req.params['max_views'];
  var max_time = req.params['max_time'];

  console.log(passwd);
  console.log(max_views);

  var url = storage.addPasswd(passwd, max_time, max_views);

  var response = {
    'url': url
  }
  console.log('adding password: ' + passwd + ' to url: ' + url);

  res.send(JSON.stringify(response));
});

module.exports = router;
