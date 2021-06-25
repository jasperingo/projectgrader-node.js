'use strict'


var Admin = require('../controllers/AdminController');
var auth = require('../middlewares/AuthMiddleware');
var pager = require('../middlewares/PaginationMiddleware');

var express = require('express');
var router = express.Router();


router.get('/', auth('admin', false), pager(), Admin.index);


router.get('/login', auth('admin', true), Admin.getLogin);


router.post('/login', auth('admin', true), Admin.postLogin);


router.post('/logout', auth('admin', false), Admin.postLogOut);


router.get('/add-student', auth('admin', false), Admin.getAddStudent);


router.post('/add-student', auth('admin', false), Admin.postAddStudent);






module.exports = router;




