'use strict'

var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: `${res.__('app_name')} - ${res.__('app_desc')}` });
});


module.exports = router;



