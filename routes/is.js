'use strict'


var IS = require('../controllers/ISController');
var auth = require('../middlewares/AuthMiddleware');

var express = require('express');
var router = express.Router();



router.get('/add', auth('admin', false), IS.getAdd);

router.post('/add', auth('admin', false), IS.postAdd);


router.get('/', auth('is', false), IS.index);


router.get('/login', auth('is', true), IS.getLogin);


router.post('/login', auth('is', true), IS.postLogin);




module.exports = router;






