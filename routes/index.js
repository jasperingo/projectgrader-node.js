'use strict'

var auth = require('../middlewares/AuthMiddleware');

var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: `${res.__('app_name')} - ${res.__('app_desc')}` });
});


router.post('/logout', auth(['admin', 'hod', 'is', 'es'], false), function (req, res) {
  var path = req.session.user.type;
  req.session.destroy(function(err) {
    if (err) res.redirect('/'+path);
    else res.redirect(`/${path}/login`);
  });
});




module.exports = router;



