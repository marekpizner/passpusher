var express = require('express');
var Storage = require('../db/local_storage')
var storage = new Storage()

var router = express.Router();

const parseData = (req) => {
  try {

    if (
      "password" in req.body &&
      "max_views_check" in req.body &&
      "max_views" in req.body &&
      "max_time_check" in req.body &&
      "max_time" in req.body
    ) {
      password = {
        "password": req.body['password'],
        'max_views_check': req.body['max_views_check'],
        "max_views": req.body['max_views'],
        "max_time_check": req.body['max_time_check'],
        "max_time": req.body['max_time'],
      }
      return password;
    } else {
      throw 'Error parsing parameters'
    }
  } catch (error) {
    console.log(error)
  }
  return false;
}

/* GET users listing. */
router.post('/', function (req, res, next) {
  const data = parseData(req);

  if (data) {
    var response = storage.addPasswd(data);
    console.log(response)
    res.send(JSON.stringify(response));
  } else {
    next('Something went wrong!')
  }
});


module.exports = router;
