var express = require('express');
var router = express.Router();
var i18n = require('i18n');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function (req, res) {
  res.locals.yam = i18n.__('hello');
  res.render('hod_login');
})


module.exports = router;




