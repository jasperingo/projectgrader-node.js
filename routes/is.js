'use strict'


var IS = require('../controllers/ISController');
var auth = require('../middlewares/AuthMiddleware');

var express = require('express');
var router = express.Router();


router.get('/', auth('is', true), IS.index);


router.get('/login', auth('is', true), IS.getLogin);


router.post('/login', IS.postLogin);




module.exports = router;






