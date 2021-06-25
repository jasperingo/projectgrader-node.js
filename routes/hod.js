'use strict'


var HOD = require('../controllers/HodController');
var auth = require('../middlewares/AuthMiddleware');
var pager = require('../middlewares/PaginationMiddleware');

var express = require('express');
var router = express.Router();


router.get('/add', auth('admin', false), HOD.getAdd);

router.post('/add', auth('admin', false), HOD.postAdd);


router.get('/', auth('hod', false), pager(), HOD.index);


router.get('/login', auth('hod', true), HOD.getLogin);


router.post('/login', auth('hod', true), HOD.postLogin);


module.exports = router;




