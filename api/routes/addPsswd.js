var express = require('express');
var Storage = require('../db/local_storage')
var storage = new Storage()

var router = express.Router();

const checkData = (data) => {
  if (
    "password" in data.body &&
    "max_views_check" in data.body &&
    "max_views" in data.body &&
    "max_time_check" in data.body &&
    "max_time" in data.body &&

    "password" !== '',
    "password" !== undefined
  ){
    return true;
  } else{
    return false;
  }
}


const parseData = (req) => {
  try {
    if (checkData(req)) {
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

router.post('/', function (req, res, next) {
  const data = parseData(req);
  console.log(data)
  if (data) {
    var response = storage.addPasswd(data);
    console.log(response)
    res.send(JSON.stringify(response));
  } else {
    next('Something went wrong!')
  }
});


module.exports = router;
